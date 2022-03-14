/****************** 
  GLOBAL VARIABLES
 ******************/

const questionBank = [
	// This is a global array of objects to store each question's title, choices and answer
	{ title: 'Which operator is used to combine values to log a single message to the console?', choices: ['+', '-', '*', '/'], answer: '+' }, // Reference: Trilogy Coding Bootcamp Week 3, Lesson 04
	{ title: 'Which operator compares strict inequality?', choices: ['!', '!=', '!==', '!==='], answer: '!==' }, // Reference: Trilogy Coding Bootcamp Week 3, Lesson 07
	{ title: 'The expression (!true && !false) will return …', choices: ['true', '!true', 'false', '!false'], answer: 'false' }, // Reference: Trilogy Coding Bootcamp Week 3, Lesson 08
	{ title: 'How many times will this loop run? for (var i = 0; i < 5; i++) {…}', choices: ['2', '4', '5', '0'], answer: '5' }, // Reference: Trilogy Coding Bootcamp Week 3, Lesson 13
	{ title: 'Which of these is NOT a valid way to write a function?', choices: ['function f() {}', 'var f = function() {}', 'function f(x,y,z) {}', 'function () {}'], answer: 'function () {}' }, // Reference: Trilogy Coding Bootcamp Week 3, Lesson 15
	{ title: 'Which of these array methods can change [1, 2, 3] to [1, 2, 3, 4]?', choices: ['Array.sort()', 'Array.push()', 'Array.slice()', 'Array.replace()'], answer: 'Array.push()' }, // Reference: Trilogy Coding Bootcamp Week 3, Lesson 19
];
const totalQuestions = questionBank.length; // total number of questions
var index; // to increment through questionBank

var correctQuestions = 0; //  running score
var currentQuestion = 0; // integer that holds current question
var currentQuestionEl; // element that renders current question
const penalty = 5; // penalty of 5 seconds for each wrong answer

var startButtonEl; // element that starts the game when clicked
var timer; // global function that controls the timer
var secondsLeft = 60; // seconds left
var secondsEl; // element that renders the seconds left

// elements
const htmlBody = document.body;
// dynamically created elements
var newHeader, newMain, newSection, newParagraph, newIcon, newImage, newSpan, newH1, newButton, newList, newListItem, newLabel, newInput, newDiv;

init(); // load the page

function init() {
	// clear body
	document.body.innerHTML = '';
	document.body.className = '';

	// render header
	renderQuizHeader();

	// render splash area
	renderQuizMain();

	currentQuestionEl = document.getElementById('currentQuestion');
	secondsEl = document.getElementById('seconds');
	startButtonEl = document.getElementById('startTime');

	startButtonEl.addEventListener('click', () => {
		// user clicked start

		// reset index to question 0
		index = 0;

		// reset secondsLeft to 60
		secondsLeft = 60;

		// reset correctQuestions to 0
		correctQuestions = 0;

		// reset current question
		currentQuestion = index + 1;

		// remove high scores button during game
		document.querySelector('.nav-view').parentNode.removeChild(document.querySelector('.nav-view'));

		// renders the first question and the first set of options
		renderQuizQuestions(index);

		// starts the timer
		timer = setInterval(() => {
			secondsLeft--;
			secondsEl.textContent = secondsLeft.toString().padStart(2, '0');
			if (secondsLeft <= 0) {
				// timer has reached zero
				clearInterval(timer);
				recordSection();
				secondsEl.textContent = "Time's up!";
			}
		}, 1000);
	});
}

function renderQuizQuestions(index) {
	var userQuestion = questionBank[index].title;
	var userChoices = questionBank[index].choices;
	/**************** 
	  QUIZ QUESTIONS
	 ****************/

	// update current question in the header
	currentQuestionEl.innerHTML = '';
	currentQuestionEl.append(`${currentQuestion}/6`);

	// clear main
	newMain = document.body.children[1];
	newMain.innerHTML = '';
	newMain.classList.add('quiz');

	// fill the horizontal space
	newSection = document.createElement('section');
	// newSection.style.display = 'block';
	newSection.append(userQuestion);

	newList = document.createElement('ul');

	userChoices.forEach((newItem) => {
		newButton = document.createElement('button');
		newButton.classList.add('btn');
		newButton.textContent = newItem;

		newListItem = document.createElement('li');
		newListItem.classList.add('btn-wrapper');
		newListItem.addEventListener('click', checkAnswer);
		newListItem.appendChild(newButton);

		newList.appendChild(newListItem);

		newSection.appendChild(newList);
	});

	newSection.appendChild(newList);
	newMain.appendChild(newSection);
}
function checkAnswer(event) {
	var element = event.target;

	newDiv = document.createElement('div');
	newDiv.setAttribute('id', 'newDiv');
	newDiv.setAttribute('style', 'text-align:center;');

	if (element.textContent == questionBank[index].answer) {
		// correct
		correctQuestions++;
		newDiv.append(`Question ${currentQuestion} was correct!`);
	} else {
		// incorrect
		secondsLeft = secondsLeft - penalty;
		newDiv.innerHTML = `<p>Question ${currentQuestion} was incorrect.<br>"${questionBank[index].title}"<br>Answer: "${questionBank[index].answer}".<br>Penalty: -${penalty} seconds</p>`;
	}

	// increment current question
	index++;
	currentQuestion = index + 1;

	if (index >= totalQuestions) {
		// reached the end of the questionBank
		recordSection();
		//  render the timer
		secondsEl.textContent = secondsLeft.toString().padStart(2, '0');
		// feedback message
		newDiv.textContent = `${correctQuestions}/${totalQuestions} correct, pretty good!`;
	} else {
		// clicking on any option renders the next question and set of options
		renderQuizQuestions(index);
	}
	newMain.appendChild(newDiv);
}
function recordSection() {
	// if the user finished with any time remaining, stop the timer so the user can view the time left
	if (secondsLeft >= 0) {
		clearInterval(timer);
	}

	// clear main
	newMain = document.body.children[1];
	newMain.innerHTML = '';
	newMain.className = 'recordSection';

	// heading for 'Nice Try!'
	var newH1 = document.createElement('h1');
	newH1.setAttribute('id', 'victoryMessage');
	newH1.textContent = 'Nice Try! ✌🏻';
	newMain.appendChild(newH1);

	// label for 'Your final score is'
	var newLabel = document.createElement('p');
	newLabel.setAttribute('id', 'victoryScoreLabel');
	newLabel.textContent = 'Your final score is: ' + secondsLeft;
	newMain.appendChild(newLabel);

	// label for 'Your initials:'
	var recordInitialLabel = document.createElement('label');
	recordInitialLabel.setAttribute('id', 'recordInitialLabel');
	recordInitialLabel.textContent = 'Please enter your initials below: ';
	newMain.appendChild(recordInitialLabel);

	// input for user to write initials
	var recordInitialInput = document.createElement('input');
	recordInitialInput.setAttribute('type', 'text');
	recordInitialInput.setAttribute('id', 'initials');
	recordInitialInput.textContent = '';
	newMain.appendChild(recordInitialInput);

	// submit button to record score
	newButton = document.createElement('button');
	newButton.setAttribute('type', 'submit');
	newButton.setAttribute('id', 'submit');
	newButton.textContent = 'Submit';
	newButton.addEventListener('click', function () {
		var initials = recordInitialInput.value;
		if (initials.length === 0) {
			initials = 'noname';
		}
		var SYTYCJ = localStorage.getItem('SYTYCJ');
		SYTYCJ === null ? (SYTYCJ = []) : (SYTYCJ = JSON.parse(SYTYCJ));
		SYTYCJ.push({ initials: initials, score: secondsLeft });
		localStorage.setItem('SYTYCJ', JSON.stringify(SYTYCJ));
		// render highScores
		renderHighScores();
	});
	newMain.appendChild(newButton);
}
function renderHighScoresHeader() {
	/********************
	  HIGH SCORES HEADER
	 ********************/

	// clear current header
	newHeader = document.body.children[0];
	newHeader.innerHTML = '';
	newHeader.className = '';

	newHeader.classList.add('highscore-header');

	// create icon for HIGH SCORES
	newIcon = document.createElement('i');
	newIcon.setAttribute('id', 'hsIcon');
	newIcon.classList.add('far', 'fa-chart-bar');
	newHeader.append(newIcon);
}

function renderHighScoresMain() {
	/********************
	  HIGH SCORES MAIN
	 ********************/
	newMain = document.body.children[1];
	newMain.innerHTML = '';
	newMain.className = 'highscore-main';

	// List: High Scores
	var newList = document.createElement('ul');
	newList.setAttribute('id', 'hs');
	newMain.appendChild(newList);
	var SYTYCJ = localStorage.getItem('SYTYCJ');
	SYTYCJ = JSON.parse(SYTYCJ);
	// if not null, sort by score with the highest at the top
	if (SYTYCJ != null) {
		SYTYCJ.sort(function (a, b) {
			return b.score - a.score;
		});
	}
	hs.style.listStyleType = 'none';
	if (SYTYCJ !== null) {
		for (var i = 0; i < SYTYCJ.length; i++) {
			var newListItem = document.createElement('li');
			newListItem.classList.add('btn-wrapper');
			var newSpan = document.createElement('button');
			newSpan.classList.add('btn');
			newSpan.textContent = `${SYTYCJ[i].initials} ${SYTYCJ[i].score}`;
			newListItem.appendChild(newSpan);
			hs.appendChild(newListItem);
		}
	}

	// Button: New Game
	var newButton = document.createElement('button');
	newButton.classList.add('splash-start-button');
	newButton.setAttribute('id', 'newGame');
	newButton.append('New Game');
	newMain.appendChild(newButton);

	// Button: Clear high Scores
	var newButton = document.createElement('button');
	newButton.classList.add('splash-start-button');
	newButton.setAttribute('id', 'clear');
	newButton.append('Clear High Scores');
	newMain.appendChild(newButton);

	// Event listener: New Game
	newGame.addEventListener('click', function () {
		init();
	});

	// Event listener: Clear high scores
	clear.addEventListener('click', () => {
		localStorage.clear();
		renderHighScoresMain();
	});
}
function renderHighScores() {
	renderHighScoresHeader();
	renderHighScoresMain();
}

function renderQuizHeader() {
	/************* 
		 QUIZ HEADER
	 *************/

	// create header
	newHeader = document.createElement('header');
	// create timer
	newParagraph = document.createElement('p');
	newParagraph.classList.add('nav-timer');
	newIcon = document.createElement('i');
	newIcon.classList.add('fa', 'fa-clock');
	newParagraph.append(newIcon);
	newSpan = document.createElement('span');
	newSpan.append('0:');
	newParagraph.append(newSpan);
	newSpan = document.createElement('span');
	newSpan.setAttribute('id', 'seconds');
	newSpan.append('60');
	newParagraph.append(newSpan);
	newHeader.append(newParagraph);
	// create Question Number 0/6
	newParagraph = document.createElement('p');
	newParagraph.classList.add('nav-question');
	newParagraph.append('Question ');
	newSpan = document.createElement('span');
	newSpan.setAttribute('id', 'currentQuestion');
	newSpan.append('0/6');
	newParagraph.append(newSpan);
	newHeader.append(newParagraph);
	// create high scores icon
	newParagraph = document.createElement('p');
	newParagraph.classList.add('nav-view');
	newIcon = document.createElement('i'); // need to add a clickable link to open highscore modal
	newIcon.classList.add('far', 'fa-chart-bar');
	newParagraph.append(newIcon);
	newParagraph.addEventListener('click', renderHighScores);
	newHeader.append(newParagraph);

	// append header to body
	htmlBody.append(newHeader);
}

function renderQuizMain() {
	/************* 
		 QUIZ SPLASH
	 ************/

	newMain = document.createElement('main');
	// splash section
	newSection = document.createElement('section');
	newSection.setAttribute('id', 'splash');
	// icon
	newImage = document.createElement('img');
	newImage.classList.add('splash-image');
	newImage.setAttribute('src', './assets/images/favicon.png');
	newImage.setAttribute('alt', 'quiz icon');
	newSection.append(newImage);

	// h1
	newH1 = document.createElement('h1');
	newH1.classList.add('splash-heading');
	newH1.append('So You Think You Can Javascript?');
	newSection.append(newH1);

	// p
	newParagraph = document.createElement('p');
	newParagraph.classList.add('splash-description');
	newParagraph.append('6 questions.');
	newSection.append(newParagraph);

	// p
	newParagraph = document.createElement('p');
	newParagraph.classList.add('splash-description');
	newParagraph.append('60 seconds.');
	newSection.append(newParagraph);

	// p
	newParagraph = document.createElement('p');
	newParagraph.classList.add('splash-description');
	newParagraph.append('Wrong answers will deduct 5 seconds!');
	newSection.append(newParagraph);

	// button
	newButton = document.createElement('button');
	newButton.classList.add('splash-start-button');
	newButton.setAttribute('id', 'startTime');
	newSpan = document.createElement('span');
	newSpan.append('Ready?');
	newButton.append(newSpan);
	newSection.append(newButton);

	newMain.append(newSection);
	htmlBody.append(newMain);
}
