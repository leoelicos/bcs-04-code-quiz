/****************** 
  GLOBAL VARIABLES
 ******************/

const questionBank = [
	// This is a global array of objects to store each question's title, choices and answer
	// Reference: Trilogy Coding Bootcamp Week 3, Lesson 04
	{ title: 'Which operator is used to combine values to log a single message to the console?', choices: ['+', '-', '*', '/'], answer: '+' },
	// Reference: Trilogy Coding Bootcamp Week 3, Lesson 07
	{ title: 'Which operator compares strict inequality?', choices: ['!', '!=', '!==', '!==='], answer: '!==' },
	// Reference: Trilogy Coding Bootcamp Week 3, Lesson 08
	{ title: 'The expression (!true && !false) will return …', choices: ['true', '!true', 'false', '!false'], answer: 'false' },
	// Reference: Trilogy Coding Bootcamp Week 3, Lesson 13
	{ title: 'How many times will this loop run? for (var i = 0; i < 5; i++) {…}', choices: ['2', '4', '5', '0'], answer: '5' },
	// Reference: Trilogy Coding Bootcamp Week 3, Lesson 15
	{ title: 'Which of these is NOT a valid way to write a function?', choices: ['function f() {}', 'var f = function() {}', 'function f(x,y,z) {}', 'function () {}'], answer: 'function () {}' },
	// Reference: Trilogy Coding Bootcamp Week 3, Lesson 19
	{ title: 'Which of these array methods can change [1, 2, 3] to [1, 2, 3, 4]?', choices: ['Array.sort()', 'Array.push()', 'Array.slice()', 'Array.replace()'], answer: 'Array.push()' },
];
const totalQuestions = questionBank.length; // total number of questions
var index; // to increment through questionBank

var correctQuestions = 0; //  running score
var currentQuestion = 0; // integer that holds current question
var currentQuestionEl; // element that renders current question
const penalty = 10; // penalty of 5 seconds for each wrong answer

var startButtonEl; // element that starts the game when clicked
var timer; // global function that controls the timer
var secondsLeft = 60; // seconds left
var secondsEl; // element that renders the seconds left

// elements
const htmlBody = document.body;
// dynamically created elements
var newHeader, newMain, newSection, newParagraph, newIcon, newImage, newSpan, newH1, newButton, newList, newListItem, newLabel, newInput, feedback;

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
	// newSection = document.createElement('section');
	// newSection.style.display = 'block';
	newParagraph = document.createElement('p');
	newParagraph.setAttribute('id', 'quiz-title');
	newParagraph.append(userQuestion);
	// newSection.appendChild(newParagraph);
	newMain.append(newParagraph);
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

		// newSection.appendChild(newList);
	});

	// newSection.appendChild(newList);
	// newMain.appendChild(newSection);
	newMain.appendChild(newList);
}
function checkAnswer(event) {
	var element = event.target;

	feedback = document.createElement('p');
	feedback.setAttribute('id', 'feedback');

	if (element.textContent == questionBank[index].answer) {
		// correct
		correctQuestions++;
		feedback.classList.add('greenFeedback');
		feedback.append(`Question ${currentQuestion} was correct!`);
	} else {
		// incorrect
		secondsLeft = secondsLeft - penalty;
		feedback.classList.add('redFeedback');
		feedback.innerHTML = `Question ${currentQuestion} was incorrect.<br>"${questionBank[index].title}"<br>Answer: "${questionBank[index].answer}".<br>Penalty: -${penalty} seconds`;
	}

	// increment current question
	index++;
	currentQuestion = index + 1;

	if (index >= totalQuestions) {
		//  render the timer
		secondsEl.textContent = secondsLeft.toString().padStart(2, '0');
		// render recordSection
		recordSection();
	} else {
		// clicking on any option renders the next question and set of options
		renderQuizQuestions(index);
		newMain.appendChild(feedback);
	}
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

	// feedback message
	newMain.appendChild(feedback);

	// separator
	newMain.appendChild(document.createElement('hr'));

	// heading for validation
	newH1 = document.createElement('h1');
	newH1.setAttribute('id', 'victoryMessage');
	newH1.textContent = `${correctQuestions}/${totalQuestions}`;
	newMain.appendChild(newH1);
	newH1 = document.createElement('h1');
	newH1.setAttribute('id', 'affirmation');
	if (correctQuestions === 0) {
		newH1.append(`Don't worry, everyone starts at 0! 😶‍🌫️`);
	} else if (correctQuestions === 1) {
		newH1.append(`One for the road, 5 for the study table! 🐥`);
	} else if (correctQuestions === 2) {
		newH1.append(`Two is better than one! ⛅`);
	} else if (correctQuestions === 3) {
		newH1.append(`That's 50% correct! 🌤️`);
	} else if (correctQuestions === 4) {
		newH1.append(`Four correct! Not bad! 🌻`);
	} else if (correctQuestions === 5) {
		newH1.append(`Five correct! Beautiful! ✨`);
	} else if (correctQuestions === 6) {
		newH1.append(`Bingo! Hats off to you! 🎩`);
	}
	newMain.appendChild(newH1);

	// label for 'Seconds remaining'
	newLabel = document.createElement('p');
	newLabel.setAttribute('id', 'victoryScoreLabel');
	newLabel.textContent = 'Seconds remaining: ' + secondsLeft;
	newMain.appendChild(newLabel);

	// separator
	newMain.appendChild(document.createElement('hr'));

	// label for 'Your initials:'
	newLabel = document.createElement('label');
	newLabel.setAttribute('id', 'recordInitialLabel');
	newLabel.textContent = 'Please enter your initials below: ';
	newMain.appendChild(newLabel);

	// input for user to write initials
	newInput = document.createElement('input');
	newInput.setAttribute('type', 'text');
	newInput.setAttribute('maxLength', '2');
	newInput.setAttribute('id', 'initials');
	newInput.textContent = '';
	newMain.appendChild(newInput);

	// submit button to record score
	newButton = document.createElement('button');
	newButton.setAttribute('type', 'submit');
	newButton.setAttribute('id', 'submit');
	newButton.textContent = 'Submit';
	newButton.addEventListener('click', function () {
		var initials = newInput.value.toString().toUpperCase();
		if (initials.length === 0) {
			newButton.textContent = 'Your initials please';
			newButton.classList.add('redFeedback');
			setTimeout(() => {
				newButton.textContent = 'Submit';
				newButton.classList.remove('redFeedback');
			}, 500);
			return;
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
	newHeader.appendChild(newIcon);
	newLabel = document.createElement('span');
	newLabel.textContent = '\xa0Hall of Fame';
	newLabel.setAttribute('id', 'hallOfFame');
	newHeader.appendChild(newLabel);
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
			var newDiv = document.createElement('button');
			newDiv.setAttribute('id', 'hs-wrapper');
			newDiv.classList.add('btn');
			// span for high scorer's initials
			newSpan = document.createElement('span');
			newSpan.setAttribute('id', 'hs-initial');
			newSpan.textContent = `${SYTYCJ[i].initials}:`;
			newDiv.appendChild(newSpan);
			// span for high scorer's score
			newSpan = document.createElement('span');
			newSpan.setAttribute('id', 'hs-score');
			newSpan.textContent = `${SYTYCJ[i].score}`;
			newDiv.appendChild(newSpan);
			newListItem.appendChild(newDiv);
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
	newParagraph.append(`${totalQuestions} questions.`);
	newSection.append(newParagraph);

	// p
	newParagraph = document.createElement('p');
	newParagraph.classList.add('splash-description');
	newParagraph.append(`${secondsLeft} seconds.`);
	newSection.append(newParagraph);

	// p
	newParagraph = document.createElement('p');
	newParagraph.classList.add('splash-description');
	newParagraph.append(`Wrong answers will deduct ${penalty} seconds!`);
	newSection.append(newParagraph);

	// button
	newButton = document.createElement('button');
	newButton.classList.add('splash-start-button');
	newButton.setAttribute('id', 'startTime');
	newButton.append('Ready?');
	newSection.append(newButton);

	newMain.append(newSection);
	htmlBody.append(newMain);
}
