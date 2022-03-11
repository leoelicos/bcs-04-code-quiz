const questionBank = [
	// bootcamp week 3, lesson 4
	{ title: 'Which operator is used to combine values to log a single message to the console?', choices: ['+', '-', '*', '/'], answer: '+' },
	// bootcamp week 3, lesson 7
	{ title: 'Which operator compares strict inequality?', choices: ['!', '!=', '!==', '!==='], answer: '!==' },
	// bootcamp week 3, lesson 8
	{ title: 'The expression (!true && !false) will return', choices: ['true', '!true', 'false', '!false'], answer: 'false' },
	// bootcamp week 3, lesson 13
	{ title: 'How many times will this loop run? for (var i = 0; i < 5; i++) {…}', choices: ['2', '4', '5', '0'], answer: '5' },
	// bootcamp week 3, lesson 15
	{ title: 'Which of these is NOT a valid way to write a function?', choices: ['function f() {}', 'var f = function() {}', 'function f(x,y,z) {}', 'function () {}'], answer: 'function () {}' },
	// bootcamp week 3, lesson 19
	{ title: 'Which of these array methods can change [1, 2, 3] to [1, 2, 3, 4]?', choices: ['Array.sort()', 'Array.push()', 'Array.slice()', 'Array.replace()'], answer: 'Array.push()' },
];

var currentScore = document.getElementById('score');
var correctQuestions = 0;
var index = 0;
var seconds = document.getElementById('seconds');
var timer = document.getElementById('startTime');
var questionSection = document.getElementById('questionSection');
var secondsLeft = 60;
// holdInterval controls the timer. It is global so it can be called to clearInterval when the game is won before the timer reaches 0
var holdInterval = 0;
// penalised 5 seconds for each wrong answer
const penalty = 5;

timer.addEventListener('click', function () {
	if (holdInterval === 0) {
		holdInterval = setInterval(function () {
			secondsLeft--;
			seconds.textContent = secondsLeft;

			if (secondsLeft <= 0) {
				clearInterval(holdInterval);
				recordSection();
				seconds.textContent = "Time's up!";
			}
		}, 1000);
	}
	// renders the current question and the current set of options
	render(index);
});

function render(index) {
	// clear the area
	questionSection.innerHTML = '';
	// fill the horizontal space
	questionSection.style.display = 'block';
	// hide the splash
	document.getElementById('splash').style.display = 'none';
	//
	var newList = document.createElement('ul');

	for (var i = 0; i < questionBank.length; i++) {
		var userQuestion = questionBank[index].title;
		var userChoices = questionBank[index].choices;
		questionSection.textContent = userQuestion;
	}
	userChoices.forEach(function (newItem) {
		var listItem = document.createElement('li');
		listItem.classList.add('btn-wrapper');
		var listItemBtn = document.createElement('button');
		listItemBtn.classList.add('btn');
		listItemBtn.textContent = newItem;

		newList.style.listStyleType = 'none';
		questionSection.appendChild(newList);
		newList.appendChild(listItem);
		listItem.appendChild(listItemBtn);
		listItem.addEventListener('click', checkAnswer);
	});
}
function checkAnswer(event) {
	var element = event.target;

	if (element.matches('button')) {
		var createDiv = document.createElement('div');
		createDiv.setAttribute('id', 'createDiv');
		if (element.textContent == questionBank[index].answer) {
			// correct
			correctQuestions++;
			createDiv.textContent = 'Correct.';
			currentScore.textContent = `${correctQuestions}/6`;
		} else {
			// incorrect
			secondsLeft = secondsLeft - penalty;
			createDiv.textContent = `Not correct. Answer was '${questionBank[index].answer}'. ${penalty} seconds deducted.`;
		}
	}
	index++;

	if (index >= questionBank.length) {
		// reached the end of the questionBank
		recordSection();
		//  render the timer
		seconds.textContent = secondsLeft;
		// feedback message
		createDiv.textContent = `${correctQuestions}/${questionBank.length} correct, pretty good!`;
	} else {
		// clicking on any option renders the next question and set of options
		render(index);
	}
	questionSection.appendChild(createDiv);
}
function recordSection() {
	// clear the screen
	questionSection.innerHTML = '';

	var victoryMessage = document.createElement('h1');
	victoryMessage.setAttribute('id', 'victoryMessage');
	victoryMessage.textContent = 'Nice Try!';

	questionSection.appendChild(victoryMessage);

	var victoryScoreLabel = document.createElement('p');
	victoryScoreLabel.setAttribute('id', 'victoryScoreLabel');

	questionSection.appendChild(victoryScoreLabel);

	if (secondsLeft >= 0) {
		clearInterval(holdInterval);
		victoryScoreLabel.textContent = 'Your final score is: ' + secondsLeft;
	}

	var recordInitialLabel = document.createElement('label');
	recordInitialLabel.setAttribute('id', 'recordInitialLabel');
	recordInitialLabel.textContent = 'Your initials: ';

	questionSection.appendChild(recordInitialLabel);

	var recordInitialInput = document.createElement('input');
	recordInitialInput.setAttribute('type', 'text');
	recordInitialInput.setAttribute('id', 'initials');
	recordInitialInput.textContent = '';

	questionSection.appendChild(recordInitialInput);

	var submitBtn = document.createElement('button');
	submitBtn.setAttribute('type', 'submit');
	submitBtn.setAttribute('id', 'Submit');
	submitBtn.textContent = 'Submit';

	questionSection.appendChild(submitBtn);

	//
	submitBtn.addEventListener('click', function () {
		var initials = recordInitialInput.value;
		if (initials.length === 0) {
			initials = 'noname';
		}
		var SYTYCJ = localStorage.getItem('SYTYCJ');
		SYTYCJ === null ? (SYTYCJ = []) : (SYTYCJ = JSON.parse(SYTYCJ));
		SYTYCJ.push({ initials: initials, score: secondsLeft });
		localStorage.setItem('SYTYCJ', JSON.stringify(SYTYCJ));
		window.location.replace('../../hs.html');
	});
}
