const serverIp = 'http://' + 'SERVERIP';

const main = document.querySelector('main');

render();

async function render() {
	try {
		const gameId = localStorage.getItem('gameId');
		let serverResponse;
		if (typeof gameId === 'string') {
			serverResponse = await fetch(serverIp + '/newgame', { method: 'POST', headers: { "Content-Type": "application/json" }, body: JSON.stringify({ gameId: gameId }) });
		} else {
			serverResponse = await fetch(serverIp + '/newgame');
		};
		if (serverResponse.ok) {
			const data = await serverResponse.json();
			// load game
			loadGame(data);
		} else {
			// load menu
			loadMenu();
		};
	} catch (err) {
		loadError(err);
	};
};

async function postNewGame() {
	const serverResponse = await fetch(serverIp, { method: 'POST' });
	if (!serverResponse.ok) {
		loadError(serverResponse.statusText);
		return;
	};
	const data = await serverResponse.json();
	localStorage.setItem('gameId', data.gameId);
	loadGame(data.gameData);
};

async function openField(e) {
	try {
		const id = e.currentTarget.id;
		const coords = id.split(',');
		const gameId = localStorage.getItem('gameId');
		if (typeof gameId != 'string') throw new Error("couldn't find gameId in local storage");
		const requestData = { gameId: gameId, row: coords[0], column: coords[1] };
		const serverResponse = await fetch(serverIp, { method: 'PATCH', headers: { "Content-Type": "application/json" }, body: JSON.stringify(requestData) });
		if (!serverResponse.ok) {
			loadError(serverResponse.statusText);
			return;
		};
		const responseData = await serverResponse.json();
		loadGame(responseData.gameData, responseData.gameStatus);
		if (responseData.gameStatus) {
			localStorage.removeItem('gameId');
			const endGame = document.createElement('p');
			endGame.innerText = responseData.gameStatus;
			main.appendChild(endGame);
		};
	} catch (err) {
		loadError(err);
	};
};

async function flagField(e) {
	e.preventDefault();
	try {
		const id = e.currentTarget.id;
		const coords = id.split(',');
		const gameId = localStorage.getItem('gameId');
		if (typeof gameId != 'string') throw new Error("couldn't find gameId in local storage");
		const requestData = JSON.stringify({ gameId: gameId, row: coords[0], column: coords[1], flag: true });
		const serverResponse = await fetch(serverIp, { method: 'PATCH', headers: { "Content-Type": "application/json" }, body: requestData });
		if (!serverResponse.ok) {
			loadError(serverResponse.statusText);
			return;
		};
		const responseData = await serverResponse.json();
		loadGame(responseData.gameData, responseData.gameStatus);
		if (responseData.gameStatus) {
			localStorage.removeItem('gameId');
			const endGame = document.createElement('p');
			endGame.innerText = responseData.gameStatus;
			main.appendChild(endGame);
		};
	} catch (err) {
		loadError(err);
	};
};

function loadGame(data, endGame) {
	main.innerHTML = '';

	const CELLSIZE = 20;

	const gameBox = document.createElement('div');
	gameBox.id = 'gameBox';
	// gameBox.style.height = String(data.length * CELLSIZE) + 'px';
	// gameBox.style.width = String(data[0].length * CELLSIZE) + 'px';


	data.forEach((row, i) => {
		row.forEach((column, j) => {
			const cell = document.createElement('div');
			cell.classList.add('cell');

			cell.id = `${i},${j}`;
			cell.style.top = String(i * CELLSIZE) + 'px';
			cell.style.left = String(j * CELLSIZE) + 'px';
			switch (column) {
				case 10: // closed cell
					cell.classList.add('closed');
					break;
				case 11: // flag
					cell.classList.add('flagged');
					break;
				case 9: // bomb, means end game
					cell.classList.add('bomb');
					break;
				case 0:
					break;
				default:
					cell.innerText = column;
			};
			if (!endGame) {
				cell.addEventListener('click', openField);
				cell.addEventListener('contextmenu', flagField);
			};
			gameBox.appendChild(cell);
		});
	});
	main.appendChild(gameBox);
};

function loadMenu() {
	main.innerHTML = '';

	const heading = document.createElement('h2');
	heading.innerText = 'New Game';
	main.appendChild(heading);

	const gameBtn = document.createElement('button');
	gameBtn.innerText = 'Standard 16x16 40 mines';
	gameBtn.type = "button";
	gameBtn.addEventListener('click', postNewGame);

	main.appendChild(gameBtn);
};

function loadError(err) {
	main.innerHTML = '';
	const heading = document.createElement('h2');
	heading.innerText = 'Server error';
	main.appendChild(heading);

	const description = document.createElement('p');
	description.innerText = err;
	main.appendChild(description);
};

