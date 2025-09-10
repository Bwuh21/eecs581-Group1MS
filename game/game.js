import { Map } from "./map.js";

// --- Popup logic ---
window.onload = function () {
	// show popup on load
	document.getElementById("popupOverlay").style.display = "block";
	document.getElementById("popupContainer").style.display = "block";

	// close button
	document.getElementById("closePopup").onclick = function () {
		document.getElementById("popupOverlay").style.display = "none";
		document.getElementById("popupContainer").style.display = "none";
	};
};

class Game {
	constructor() {
		this.started = false;
		this.dead = false;

		this.map = undefined;
		this.bombs = 0;
		this.flags = 0;

		// Set up create map button
		document.getElementById("start-game").addEventListener("click", () => {
			this.createMap();
		});
	}

	/*
	 * Set up game upon loading the webpage.
	 */
	initialize(width = 10, height = 10, bombs = 10) {
		this.bombs = bombs;
		this.flags = this.bombs;

		this.map = new Map(width, height, this);

		// Set up html grid
		const grid = document.getElementById("minesweeper-grid");
		grid.innerHTML = "";
		grid.style.gridTemplateColumns = `repeat(${width}, 58px)`;
		grid.style.gridTemplateRows = `repeat(${height}, 58px)`;
		
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				// Create buttons
				const btn = document.createElement("button");
				btn.className = "grid-btn";
				btn.id = `cell-${x}-${y}`;
				// Add click listeners
				btn.addEventListener("click", () => {
					this.map.cellClicked(x, y);
				});
				btn.addEventListener("contextmenu", (e) => {
					e.preventDefault();
					this.map.cellRightClicked(x, y);
				});
				grid.appendChild(btn);
			}
		}

		this.map.updateMap();
		this.updateFlagCounter();
	}

	createMap() {
		const gridWidth = document.getElementById("grid-width");
		const gridHeight = document.getElementById("grid-height");
		const bombCount = document.getElementById("bomb-count");
		this.initialize(gridWidth.value, gridHeight.value, bombCount.value);
	}

	start(startX, startY) {
		this.started = true;
		this.flags = this.bombs;

		this.map.generateBombs(this.bombs, startX, startY);
		this.map.updateMap();

		setStatus("Game in progress...", "playing");
	}

	finish(result) {
		this.started = false;

		// disable all cells so no more clicks
		const grid = document.getElementById("minesweeper-grid");
		const buttons = grid.querySelectorAll("button");
		buttons.forEach((btn) => (btn.disabled = true));

		if (result === "win") {
			setStatus("😎 You won!", "won");
		} else if (result === "lose") {
			setStatus("💥 You lost!", "lost");
		} else {
			setStatus("Game over", "lost");
		}
	}

	placeFlag() {
		if (this.flags < 1) {
			return false;
		}
		this.flags--;
		this.updateFlagCounter();

		return true
	}

	removeFlag(x, y) {
		this.flags++;
		this.updateFlagCounter();

		return true
	}

	updateFlagCounter() {
		const flagCounter = document.getElementById("flag-counter");
		flagCounter.value = this.flags;
	}
}

const GAME = new Game();
GAME.initialize();
