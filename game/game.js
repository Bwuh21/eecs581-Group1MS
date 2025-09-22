/**
 * Author: Reem Fatima, Pashia Vang, Alejandro Sandoval, Liam Aga, Jorge Trujillo, Aiden Barnard
 * Creation Date: 2025-09-21
 * File: game.js
 * Description: Frontend logic for Minesweeper-style game.
 * Inputs/Outputs:
 *   - Inputs: user clicks, popup button clicks, grid size and bomb count inputs
 *   - Outputs: HTML grid updates, flag counter updates, status messages
 * External Sources: Map class imported from ./map.js
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

// GAME CLASS ——————————————————————————————————————————————————————————————————————
// Encapsulates Minesweeper game state and methods
class Game {
	constructor() {
		this.started = false; // true if game in progress
		this.dead = false; // true if player has clicked a bomb

		this.map = undefined; // map object
		this.bombs = 0; // total bombs in current game
		this.flags = 0; // flags remaining

		// Set up create map button
		document.getElementById("start-game").addEventListener("click", () => {
			this.createMap();
		});
	}

	/*
	 * Set up game upon loading the webpage.
	 */
	initialize(width = 10, height = 10, bombs = 10) {
		this.started = false;
		this.dead = false;
		setStatus("", ""); // clear status

		// Set game parameters
		this.bombs = bombs;
		this.flags = this.bombs;

		// Create map object
		this.map = new Map(width, height, this);

		// Set up html grid
		const grid = document.getElementById("minesweeper-grid");
		grid.innerHTML = "";
		grid.style.gridTemplateColumns = `repeat(${width}, 58px)`;
		grid.style.gridTemplateRows = `repeat(${height}, 58px)`;
		
		// Create buttons for each cell in grid
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				// Create buttons
				const btn = document.createElement("button");
				btn.className = "grid-btn";
				btn.id = `cell-${x}-${y}`;

				// left-click reveals cell
				btn.addEventListener("click", () => {
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
		this.started = true;
		this.flags = this.bombs;

		// Generate bombs ensuring first click is safe
		this.map.generateBombs(this.bombs, startX, startY);
		this.map.updateMap();

		setStatus("Game in progress...", "playing");
	}

	/**
     * finish
     * Ends the game, disables all interactions, and shows result.
     * @param {string} result - "win" or "lose"
     */
	finish(result) {
		this.started = false;

		// disable all cells so no more clicks
		const grid = document.getElementById("minesweeper-grid");
		const buttons = grid.querySelectorAll("button");
		buttons.forEach((btn) => (btn.disabled = true));

		// display result message
		if (result === "win") {
			setStatus("😎 You won!", "won");
		} else if (result === "lose") {
			this.map.revealBombs();
			setStatus("💥 You lost!", "lost");
		} else {
			setStatus("Game over", "lost");
		}
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
		flagCounter.value = this.flags;
	}
}

// --- Initialize global game instance ---
const GAME = new Game();
GAME.initialize(); // default 10x10 with 10 bombs
