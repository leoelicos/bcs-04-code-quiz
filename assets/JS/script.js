/****************** 
  GLOBAL CONSTANTS
 ******************/

const gameName = 'So You Think You Can Javascript?';
const questionBank = [
	//* This is a global array of objects to store each question's title, choices and answer
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
const penalty = 10; // penalty of 10 seconds for each wrong answer

// DOM ACCESS
const body = document.body;
const header = body.children[0];
const main = body.children[1];

/******************
  GLOBAL VARIABLES
 ******************/

// FUNCTIONS
var timer; // a function that controls the timer

// INTEGERS
var index; // an integer that increments through questionBank
var correctQuestions = 0; // an integer that keeps track of the correct questions
var currentQuestion = 0; // an integer that keeps track of the current questions
var secondsLeft; // an integer that keeps track of the number of seconds left on the timer

// DOM MANIPULATION
var currentQuestionEl; // DOM object that renders current question
var startButtonEl; // element that starts the game when clicked
var secondsEl; // element that renders the seconds left
var section, p, icon, img, span, h1, button, newList, newListItem, newLabel, newInput, feedback;

init(); // load the page

function init() {
	/*
	 Initialise parameters
	 * reset index
	 * reset current question position
	 * reset number of correct questions
	 * reset number of seconds left
	*/

	index = 0;
	currentQuestion = index + 1;
	correctQuestions = 0;
	secondsLeft = 60;

	/*
	 Render DOM
	 * clear body
	 * render splash header
	 * render splash main
	 */

	renderSplashHeader();
	renderSplashMain();

	//* start button events
	startButtonEl = document.getElementById('startTime'); //* assign handle to start button
	startButtonEl.addEventListener('click', () => {
		document.querySelector('.nav-view').parentNode.removeChild(document.querySelector('.nav-view')); //* Derender high scores when game starts
		renderQuizQuestions(index); //* Render question title and options

		/*
		 Define timer
		 * Decrement secondsLeft
		 * Render secondsLeft to DOM
		 * When secondsLeft reaches 0, clear timer and go to records page
		 */

		timer = setInterval(() => {
			secondsLeft--;
			secondsEl = document.getElementById('seconds'); //* handle to display number of seconds left
			secondsEl.textContent = secondsLeft.toString().padStart(2, '0');
			if (secondsLeft <= 0) {
				clearInterval(timer);
				recordSection();
				secondsEl.textContent = "Time's up!";
			}
		}, 1000);
	});
}

function renderSplashHeader() {
	/*
	 * empty header
	 */

	header.innerHTML = '';
	header.classList = '';

	/* 
	 left part of header
	 * clock icon
	 * seconds left
	 */

	p = document.createElement('p');
	p.classList.add('nav-timer');
	icon = document.createElement('i');
	icon.classList.add('fa', 'fa-clock');
	p.append(icon);
	span = document.createElement('span');
	span.append('0:');
	p.append(span);
	span = document.createElement('span');
	span.setAttribute('id', 'seconds');
	span.append('60');
	p.append(span);
	header.append(p);

	/* 
	 middle part of header
	 * current question
	 * total questions
	 */

	p = document.createElement('p');
	p.classList.add('nav-question');
	p.append('Question ');
	span = document.createElement('span');
	span.setAttribute('id', 'currentQuestion');
	span.append('0/6');
	p.append(span);
	header.append(p);

	/* 
	 right part of header
	 * high score icon that takes user to high scores page
	 */

	p = document.createElement('p');
	p.classList.add('nav-view');
	icon = document.createElement('i');
	icon.classList.add('far', 'fa-chart-bar');
	p.append(icon);
	p.addEventListener('click', renderHighScores);
	header.append(p);
}

function renderSplashMain() {
	//* empty main
	main.innerHTML = '';
	main.classList = '';
	//* create splash container
	section = document.createElement('section');
	section.setAttribute('id', 'splash');

	//* create SYTYCJ logo
	img = document.createElement('img');
	img.classList.add('splash-image');
	img.setAttribute('src', './assets/images/favicon.png'); // use same icon as favicon
	img.setAttribute('alt', 'quiz icon'); // accessibility
	section.append(img); // add to splash container

	//* create heading to display game name
	h1 = document.createElement('h1');
	h1.classList.add('splash-heading');
	h1.append(gameName);
	section.append(h1); // add to splash container

	//* create description of the number of questions
	p = document.createElement('p');
	p.classList.add('splash-description');
	p.append(`${totalQuestions} questions.`);
	section.append(p); // add to splash container

	//* create description of the timing
	p = document.createElement('p');
	p.classList.add('splash-description');
	p.append(`${secondsLeft} seconds.`);
	section.append(p); // add to splash container

	//* create description of the time penalty for each wrong question
	p = document.createElement('p');
	p.classList.add('splash-description');
	p.append(`Wrong answers will deduct ${penalty} seconds!`);
	section.append(p); // add to splash container

	//* create start button
	button = document.createElement('button');
	button.classList.add('splash-start-button');
	button.setAttribute('id', 'startTime');
	button.append('Ready?');
	section.append(button); // add to splash container

	//* append to DOM
	main.append(section); // add to main
}

function renderQuizQuestions(index) {
	//* update current question in the header
	currentQuestionEl = document.getElementById('currentQuestion'); //* assign handle to display current question position
	currentQuestionEl.innerHTML = `${currentQuestion}/6`;

	//* clear main
	main.innerHTML = '';
	main.classList.add('quiz');

	//* create question title from questionBank
	p = document.createElement('p');
	p.setAttribute('id', 'quiz-title');
	p.append(questionBank[index].title);

	//* section.appendChild(p);
	main.append(p);
	newList = document.createElement('ul');

	//* go to cycle through each object in questionBank at the index passed to this function
	//* renders the questions to the page after the game has been clicked to start
	questionBank[index].choices.forEach((newItem) => {
		button = document.createElement('button');
		button.classList.add('btn');
		button.textContent = newItem;

		newListItem = document.createElement('li');
		newListItem.classList.add('btn-wrapper');
		newListItem.addEventListener('click', checkAnswer);
		newListItem.appendChild(button);

		newList.appendChild(newListItem);
	});

	main.appendChild(newList);
}
function checkAnswer(event) {
	//* feedback message
	feedback = document.createElement('p');
	feedback.setAttribute('id', 'feedback');

	if (event.target.textContent == questionBank[index].answer) {
		//* correct
		correctQuestions++;
		feedback.classList.add('greenFeedback');
		feedback.append(`Question ${currentQuestion} was correct!`);
	} else {
		//* incorrect
		secondsLeft = secondsLeft - penalty;
		feedback.classList.add('redFeedback');
		feedback.innerHTML = `Question ${currentQuestion} was incorrect.<br>"${questionBank[index].title}"<br>Answer: "${questionBank[index].answer}".<br>Penalty: -${penalty} seconds`;
	}

	// increment current question
	index++;
	currentQuestion = index + 1;

	if (index >= totalQuestions) {
		/* 
		reached the end of the questions
		 * render the timer
		 * render page to record score
		*/
		secondsEl.textContent = secondsLeft.toString().padStart(2, '0');
		recordSection();
	} else {
		/* 
		clicking on any option renders the next question and set of options
		* render next set of questions
	   * add feedback message to the end of the next page
		*/
		renderQuizQuestions(index);
		main.appendChild(feedback);
	}
}
function recordSection() {
	//* halt timer
	if (secondsLeft >= 0) {
		clearInterval(timer);
	}

	//* clear main
	main.innerHTML = '';
	main.className = 'recordSection'; // append to main

	//* feedback message from question 6, and a separator
	main.append(feedback, document.createElement('hr'));

	//* show total score
	h1 = document.createElement('h1');
	h1.setAttribute('id', 'victoryMessage');
	h1.textContent = `${correctQuestions}/${totalQuestions}`;
	main.appendChild(h1); // append to main

	//* show a short validation message
	h1 = document.createElement('h1');
	h1.setAttribute('id', 'affirmation');
	if (correctQuestions === 0) {
		h1.append(`Don't worry, everyone starts at 0! 😶‍🌫️`);
	} else if (correctQuestions === 1) {
		h1.append(`One for the road, 5 for the study table! 🐥`);
	} else if (correctQuestions === 2) {
		h1.append(`Two is better than one! ⛅`);
	} else if (correctQuestions === 3) {
		h1.append(`That's 50% correct! 🌤️`);
	} else if (correctQuestions === 4) {
		h1.append(`Four correct! Not bad! 🌻`);
	} else if (correctQuestions === 5) {
		h1.append(`Five correct! Beautiful! ✨`);
	} else if (correctQuestions === 6) {
		h1.append(`Bingo! Hats off to you! 🎩`);
	}
	main.appendChild(h1); // append to main

	//* show number of seconds remaining, and a separator
	newLabel = document.createElement('p');
	newLabel.setAttribute('id', 'victoryScoreLabel');
	newLabel.textContent = 'Seconds remaining: ' + Math.max(secondsLeft, 0); // can't be lower than zero
	main.appendChild(newLabel, document.createElement('hr')); // append to main

	//* label for 'Your initials:'
	newLabel = document.createElement('label');
	newLabel.setAttribute('id', 'recordInitialLabel');
	newLabel.textContent = 'Please enter your initials below: ';
	main.appendChild(newLabel); // append to main

	//* input for user to write initials
	newInput = document.createElement('input');
	newInput.setAttribute('type', 'text');
	newInput.setAttribute('maxLength', '2'); //! force restriction of 2 letters for initials
	newInput.setAttribute('id', 'initials');
	newInput.textContent = '';
	main.appendChild(newInput); // append to main

	//* render submit button
	button = document.createElement('button');
	button.setAttribute('type', 'submit');
	button.setAttribute('id', 'submit');
	button.textContent = 'Submit';
	main.appendChild(button); // append to main

	//* add event listener to submit button
	button.addEventListener('click', function () {
		//* transform any letters to upper case
		var initials = newInput.value.toString().toUpperCase();

		if (initials.length === 0) {
			//! initials invalid.

			//* passive aggressive message that lasts 500 ms
			button.textContent = 'Your initials please';
			button.classList.add('redFeedback'); // darker color for wrong answers
			setTimeout(() => {
				button.textContent = 'Submit';
				button.classList.remove('redFeedback'); // remove darker color for correct answers
			}, 500);

			//* exit the event listener so they have to try again
			return;
		} else {
			//* initials valid.

			//* get local storage object called 'SYTYCJ'
			var SYTYCJ = localStorage.getItem('SYTYCJ');

			//* if local storage object exists, parse it
			SYTYCJ === null ? (SYTYCJ = []) : (SYTYCJ = JSON.parse(SYTYCJ));

			//* push data to temporary string 'SYTYCJ'. score cannot be less than 0
			SYTYCJ.push({ initials: initials, score: Math.max(secondsLeft, 0) });

			//* stringify temporary string & set as local storage object
			localStorage.setItem('SYTYCJ', JSON.stringify(SYTYCJ));

			//* render highScores
			renderHighScores();
		}
	});
}

function renderHighScores() {
	renderHighScoresHeader();
	renderHighScoresMain();
}

function renderHighScoresHeader() {
	//* clear current header
	header.innerHTML = '';
	header.className = 'highscore-header';

	//* create icon for HIGH SCORES
	icon = document.createElement('i');
	icon.setAttribute('id', 'hsIcon');
	icon.classList.add('far', 'fa-chart-bar');

	//* create text 'Hall of Fame'
	newLabel = document.createElement('span');
	newLabel.textContent = '\xa0Hall of Fame';
	newLabel.setAttribute('id', 'hallOfFame');

	//* add icon and text to header
	header.append(icon, newLabel);
}

function renderHighScoresMain() {
	//* clear main
	main.innerHTML = '';
	main.className = 'highscore-main';

	//* create list of high scores
	var newList = document.createElement('ul');
	newList.setAttribute('id', 'hs');
	main.appendChild(newList); // add to main

	//* create a list item that is for table headings: "Rank, Initials, Score"
	newListItem = document.createElement('li');
	newListItem.classList.add('btn-wrapper');

	//* create a wrapper for the table headings
	newDiv = document.createElement('button');
	newDiv.setAttribute('id', 'hs-wrapper');
	newDiv.classList.add('btn');

	//* table heading "Rank"
	span = document.createElement('span');
	span.setAttribute('id', 'hs-rank');
	span.textContent = `Rank`;
	newDiv.appendChild(span);

	//* table heading "Initials"
	span = document.createElement('span');
	span.setAttribute('id', 'hs-initial');
	span.textContent = `Name`;
	newDiv.appendChild(span);

	//* table heading "Score"
	span = document.createElement('span');
	span.setAttribute('id', 'hs-score');
	span.textContent = `Score`;
	newDiv.appendChild(span);

	//* append wrapper to list item, and list item to list
	newListItem.appendChild(newDiv);
	hs.appendChild(newListItem);

	//* create a temporary variable to store JSON
	var SYTYCJ = localStorage.getItem('SYTYCJ');

	//* convert JSON to array
	SYTYCJ = JSON.parse(SYTYCJ);

	if (SYTYCJ != null) {
		//* sort by score with the highest at the top
		SYTYCJ.sort((a, b) => b.score - a.score);

		for (var i = 0; i < SYTYCJ.length; i++) {
			//* loop through array of high scores

			//* render high score wrapper
			newListItem = document.createElement('li');
			newListItem.classList.add('btn-wrapper');
			newDiv = document.createElement('button');
			newDiv.setAttribute('id', 'hs-wrapper');
			newDiv.classList.add('btn');

			//* render high score rank
			span = document.createElement('span');
			span.setAttribute('id', 'hs-rank');
			span.textContent = `${i + 1}`;
			newDiv.appendChild(span);

			//* render high score initials
			span = document.createElement('span');
			span.setAttribute('id', 'hs-initial');
			span.textContent = `${SYTYCJ[i].initials}`;
			newDiv.appendChild(span);

			//* render high score
			span = document.createElement('span');
			span.setAttribute('id', 'hs-score');
			span.textContent = `${SYTYCJ[i].score}`;
			newDiv.appendChild(span);

			//* add to DOM
			newListItem.appendChild(newDiv); // add wrapper to the list item
			hs.appendChild(newListItem); // add list item to list
		}
	}

	// create button to start a new game
	var button = document.createElement('button');
	button.classList.add('splash-start-button');
	button.setAttribute('id', 'newGame');
	button.append('New Game');
	main.appendChild(button);
	newGame.addEventListener('click', function () {
		// Event listener: New Game
		init();
	});

	// create button to clear current high scores, if any
	var button = document.createElement('button');
	button.classList.add('splash-start-button');
	button.setAttribute('id', 'clear');
	button.append('Clear High Scores');
	main.appendChild(button);
	clear.addEventListener('click', () => {
		// Event listener: Clear high scores
		localStorage.clear();
		// Render the page again to show results cleared
		renderHighScoresMain();
	});
}
