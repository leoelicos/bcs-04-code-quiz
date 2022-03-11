var hs = document.querySelector('#hs');
var clear = document.querySelector('#clear');
var newGame = document.querySelector('#newGame');

clear.addEventListener('click', function () {
	localStorage.clear();
	location.reload();
});

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
newGame.addEventListener('click', function () {
	window.location.replace('../../index.html');
});
