/**
 * Author: Reem Fatima, Pashia Vang, Alejandro Sandoval, Liam Aga, Jorge Trujillo, Aiden Barnard
 * Authors Part 2: Maren Proplesch, Muhammad Ibrahim, Zach Corbin, Saurav Renju, Nick Grieco, Muhammad Abdulla. 
 * Creation Date: 2025-09-08
 * File: game.js
 * Description: Frontend logic for Minesweeper-style game.
 * Inputs/Outputs:
 *   - Inputs: user clicks, popup button clicks, grid size and bomb count inputs
 *   - Outputs: HTML grid updates, flag counter updates, status messages
 * Responsibilities:
 *   - Popup management, game initialization, grid rendering,
 *     user interaction, game state tracking, UI updates

 * Minesweeper Game Logic (Frontend)
 * ---------------------------------
 * This script implements the client-side logic for a Minesweeper-style game.
 *
 * Main responsibilities:
 *  - Popup management: Displays a welcome/info popup on page load
 *    and provides a close button to dismiss it.
 *  - Game lifecycle: Handles initialization, start, and finish states
 *    (win/lose/neutral), as well as flag placement/removal.
 *  - Grid rendering: Dynamically generates an HTML grid of clickable
 *    cells based on user-defined width, height, and bomb count.
 *  - User interaction: Registers click (reveal cell) and right-click
 *    (toggle flag) events on each cell.
 *  - State tracking: Tracks whether the game has started, whether
 *    the player is dead, bombs remaining, and flags placed.
 *  - UI updates: Updates the game status message and flag counter
 *    throughout gameplay.
 *
 * Core components:
 *  - `Game` class: Encapsulates game state and methods for setup,
 *    starting, finishing, and flag management.
 *  - `Map` class (imported): Handles internal board logic such as
 *    bomb generation, adjacency calculation, and cell reveal.
 *
 * DOM element requirements:
 *  - #popupOverlay and #popupContainer for the startup popup
 *  - #closePopup button inside popup
 *  - #start-game button to trigger game creation
 *  - #grid-width, #grid-height, and #bomb-count inputs for game setup
 *  - #minesweeper-grid container for the game board
 *  - #flag-counter to display flags remaining
 *
 * Usage:
 *  - On page load, the popup displays automatically.
 *  - The "Start Game" button initializes the board with parameters
 *    set by the user in the input fields.
 *  - Left-click reveals cells, right-click toggles flags.
 *  - The game ends with a win (all safe cells revealed) or loss
 *    (bomb clicked), and no further interaction is possible.
 */

/* Import Map class for internal board logic */
import { Map } from "./map.js"; // Imported Map CLASS

// --- SFX helper ---
function playSfx(id) {
    const el = document.getElementById(id);
    if (!el) return;
    try {
        el.currentTime = 0;
        el.volume = 1.0;
        el.play().catch(() => {});
    } catch (_) {
        // ignore
    }
}

// --- Popup logic ---
// Handles showing the welcome popup on page load and closing it
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

//define funcftion for updating the game state 
function setStatus(message, className) {
	const statusElement = document.getElementById("status-indicator");
	statusElement.textContent = message;
	statusElement.className = `status-indicator ${className}`;
}

// GAME CLASS ——————————————————————————————————————————————————————————————————————
// Encapsulates Minesweeper game state and methods
class Game {
	constructor() {
		this.started = false; // true if game in progress
		this.dead = false; // true if player has clicked a bomb

		this.map = undefined; // map object
		this.bombs = 0; // total bombs in current game
		this.flags = 0; // flags remaining

		// Timer state
		this._timerIntervalId = null;
		this._timerStartMs = 0;

		// Set up create map button
		document.getElementById("start-game").addEventListener("click", () => {
			this.createMap();
		});

		// Dynamically constrain bomb count based on grid size
		const gridWidth = document.getElementById("grid-width");
		const gridHeight = document.getElementById("grid-height");
		[gridWidth, gridHeight].forEach((el) => {
			if (el) {
				el.addEventListener("input", () => {
					this.updateBombMax();
					this.updateBombSettingFromInputs();
				});
			}
		});

		// Sync bombs with the flag counter input pre-game
		const bombCount = document.getElementById("bomb-count");
		const flagCounterInput = document.getElementById("flag-counter");
		if (flagCounterInput) {
			flagCounterInput.addEventListener("input", () => {
				if (this.started) {
					// During game, keep it as a display (revert to current flags)
					flagCounterInput.value = String(this.flags);
					return;
				}
				const val = parseInt(flagCounterInput.value, 10) || 1;
				if (bombCount) bombCount.value = String(val);
				this.updateBombSettingFromInputs();
			});
		}
		if (bombCount) {
			bombCount.addEventListener("input", () => {
				if (this.started) return;
				const val = parseInt(bombCount.value, 10) || 1;
				if (flagCounterInput) flagCounterInput.value = String(val);
				this.updateBombSettingFromInputs();
			});
		}
	}

	/**
	 * Update internal bomb/flag settings from inputs while pre-game.
	 * Clamps to valid range based on current grid size.
	 */
	updateBombSettingFromInputs() {
		if (this.started) return;
		const gridWidth = document.getElementById("grid-width");
		const gridHeight = document.getElementById("grid-height");
		const bombCount = document.getElementById("bomb-count");
		const flagCounterInput = document.getElementById("flag-counter");
		if (!gridWidth || !gridHeight || !bombCount) return;

		const w = parseInt(gridWidth.value, 10) || 10;
		const h = parseInt(gridHeight.value, 10) || 10;
		const maxBombs = Math.max(1, w * h - 9);
		let b = parseInt(bombCount.value, 10) || 1;
		b = Math.min(Math.max(1, b), maxBombs);
		this.bombs = b;
		this.flags = b;
		if (flagCounterInput) flagCounterInput.value = String(this.flags);
	}

	/*
	 * Set up game upon loading the webpage.
	 */
	initialize(width = 10, height = 10, bombs = 10) {
		this.started = false;
		this.dead = false;
		setStatus("", ""); // clear status

		// Normalize inputs to integers
		const w = parseInt(width, 10) || 10;
		const h = parseInt(height, 10) || 10;
		let b = parseInt(bombs, 10) || 10;

		// Update bomb max based on size and clamp provided bombs
		const maxBombs = Math.max(1, w * h - 9);
		b = Math.min(Math.max(1, b), maxBombs);
		this.updateBombMax(w, h);

		// Set game parameters
		this.bombs = b;
		this.flags = this.bombs;

		// Create map object
		this.map = new Map(w, h, this);

		// Set up html grid
		const grid = document.getElementById("minesweeper-grid");
		grid.innerHTML = "";
		grid.style.gridTemplateColumns = `repeat(${w}, 58px)`;
		grid.style.gridTemplateRows = `repeat(${h}, 58px)`;

		// Create buttons for each cell in grid
		for (let y = 0; y < h; y++) {
			for (let x = 0; x < w; x++) {
				// Create buttons
				const btn = document.createElement("button");
				btn.className = "grid-btn";
				btn.id = `cell-${x}-${y}`;

				// left-click reveals cell
				btn.addEventListener("click", () => {
					// Play mouse SFX only for human clicks (not AI programmatic click)
					if (typeof currentTurn === 'undefined' || currentTurn === "player") {
						playSfx("sfx-mouse");
					}
					this.map.cellClicked(x, y);
				});

				// right-click toggles flag
				btn.addEventListener("contextmenu", (e) => {
					e.preventDefault();
					this.map.cellRightClicked(x, y);
				});
				grid.appendChild(btn);
			}
		}

		this.map.updateMap(); // update map display
		this.updateFlagCounter(); // update flag counter display

		// Prepare flag counter input for pre-game editing
		const flagCounterInput = document.getElementById("flag-counter");
		if (flagCounterInput) {
			flagCounterInput.disabled = false;
			flagCounterInput.value = String(this.bombs);
		}

		// Reset and show timer at 00:00
		this.stopTimer();
		this._setTimerDisplay(0);
	}

	/**
	 * createMap
	 * Reads user input values and initializes the game board.
	 */
	createMap() {
		const gridWidth = document.getElementById("grid-width");
		const gridHeight = document.getElementById("grid-height");
		const bombCount = document.getElementById("bomb-count");
		this.initialize(gridWidth.value, gridHeight.value, bombCount.value);
	}

	/**
	 * start
	 * Begins game logic after first click.
	 * @param {number} startX - X-coordinate of first click
	 * @param {number} startY - Y-coordinate of first click
	 */
	start(startX, startY) {
		// Ensure bombs reflect latest inputs at first click (works for AI/normal)
		if (!this.started) {
			const gridWidth = document.getElementById("grid-width");
			const gridHeight = document.getElementById("grid-height");
			const bombCount = document.getElementById("bomb-count");
			if (gridWidth && gridHeight && bombCount) {
				const w = parseInt(gridWidth.value, 10) || 10;
				const h = parseInt(gridHeight.value, 10) || 10;
				const maxBombs = Math.max(1, w * h - 9);
				let b = parseInt(bombCount.value, 10) || this.bombs || 10;
				this.bombs = Math.min(Math.max(1, b), maxBombs);
			}
		}
		this.started = true;
		this.flags = this.bombs;

		// Generate bombs ensuring first click is safe
		this.map.generateBombs(this.bombs, startX, startY);
		this.map.updateMap();

		setStatus("Game in progress...", "playing");

		// Start timer on first reveal
		this.startTimer();

		// Disable flag counter while playing and reflect flags remaining
		const flagCounterInput = document.getElementById("flag-counter");
		if (flagCounterInput) {
			flagCounterInput.disabled = true;
			flagCounterInput.value = String(this.flags);
		}
	}

	finish(result) {
		this.started = false;
		this.stopTimer();

		// Play result SFX
		if (result === "win") {
			playSfx("sfx-win");
		}
		// Fallback: if losing and bomb SFX didn't already play, try once here
		if (result === "lose") {
			try {
				const bomb = document.getElementById('sfx-bomb');
				if (bomb && bomb.paused) { bomb.currentTime = 0; bomb.play().catch(()=>{}); }
			} catch(_) {}
		}

		// Reset AI state when game ends
		if (typeof window.currentTurn !== 'undefined') {
			window.currentTurn = "player";
		}
		if (typeof window.aiThinking !== 'undefined') {
			window.aiThinking = false;
		}

		// Clear AI overlay if present
		const overlay = document.getElementById("ai-thinking-overlay");
		if (overlay) {
			overlay.style.display = "none";
		}

		// disable all cells so no more clicks
		const grid = document.getElementById("minesweeper-grid");
		const buttons = grid.querySelectorAll("button");
		buttons.forEach((btn) => (btn.disabled = true));

		// display result message with restart option
		if (result === "win") {
			setStatus("😎 You won! Click 'Start Game' to play again.", "won");
		} else if (result === "lose") {
			this.map.revealBombs();
			setStatus("💥 You lost! Click 'Start Game' to play again.", "lost");
		} else {
			setStatus("Game over! Click 'Start Game' to play again.", "lost");
		}
	}

	/**
	 * Update the max/min constraints for the bomb input based on grid size.
	 * If explicit w/h are not provided, read current input values.
	 */
	updateBombMax(w, h) {
		const gridWidth = document.getElementById("grid-width");
		const gridHeight = document.getElementById("grid-height");
		const bombCount = document.getElementById("bomb-count");
		if (!gridWidth || !gridHeight || !bombCount) return;

		const widthVal = parseInt(w ?? gridWidth.value, 10) || 0;
		const heightVal = parseInt(h ?? gridHeight.value, 10) || 0;
		const maxBombs = Math.max(1, widthVal * heightVal - 9);
		bombCount.min = 1;
		bombCount.max = String(maxBombs);
		const current = parseInt(bombCount.value, 10) || 1;
		if (current > maxBombs) bombCount.value = String(maxBombs);
		if (current < 1) bombCount.value = "1";
	}

	// ---------- Timer functions ----------
	startTimer() {
		this.stopTimer();
		this._timerStartMs = Date.now();
		this._setTimerDisplay(0);
		this._timerIntervalId = setInterval(() => {
			const elapsedSec = Math.floor((Date.now() - this._timerStartMs) / 1000);
			this._setTimerDisplay(elapsedSec);
		}, 1000);
	}

	stopTimer() {
		if (this._timerIntervalId) {
			clearInterval(this._timerIntervalId);
			this._timerIntervalId = null;
		}
	}

	_setTimerDisplay(seconds) {
		const timerEl = document.getElementById("game-timer");
		if (!timerEl) return;
		const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
		const ss = String(seconds % 60).padStart(2, "0");
		timerEl.textContent = `Time: ${mm}:${ss}`;
	}

	/**
	 * placeFlag
	 * Deducts one flag and updates counter.
	 * @returns {boolean} true if flag was placed
	 */
	placeFlag() {
		if (this.flags < 1) {
			return false;
		}
		this.flags--;
		this.updateFlagCounter();

		return true
	}

	/**
	 * removeFlag
	 * Adds back a flag and updates counter.
	 * @param {number} x - X-coordinate (unused internally)
	 * @param {number} y - Y-coordinate (unused internally)
	 * @returns {boolean} true if flag removed
	 */
	removeFlag(x, y) {
		this.flags++;
		this.updateFlagCounter();

		return true
	}

	/**
	 * updateFlagCounter
	 * Updates the HTML input that shows remaining flags
	 */
	updateFlagCounter() {
		const flagCounter = document.getElementById("flag-counter");
		if (!flagCounter) return;
		if (this.started) {
			flagCounter.value = this.flags;
		}
	}
}

// --- Initialize global game instance ---
const GAME = new Game();
GAME.initialize(); // default 10x10 with 10 bombs
