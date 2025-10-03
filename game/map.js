/**
 * Author: Reem Fatima, Pashia Vang, Alejandro Sandoval, Liam Aga, Jorge Trujillo, Aiden Barnard
 * Creation Date: 2025-09-08
 * File: map.js
 * Description: Implements the backend board logic for a Minesweeper-style game.
 * Inputs/Outputs:
 *   - Inputs: width, height, user clicks (left/right), bomb count
 *   - Outputs: Updates DOM cells, flag counters, and game status messages
 * External Sources: None (custom implementation)

 * Class Map
 * 
 * Represents the game board for Minesweeper.
 * 
 * Internal cell representation:
 *   [0] → Visual number (count of surrounding bombs)
 *   [1] → Bomb (0 = no bomb, 1 = bomb present)
 *   [2] → Flag (0 = none, 1 = flagged)
 *   [3] → Covered (1 = covered, 0 = uncovered)
 * 
 * Core responsibilities:
 * - Build and store the game grid in memory.
 * - Randomly place bombs while ensuring the player’s first click and its neighbors are safe.
 * - Update the surrounding number counts whenever a bomb is placed.
 * - Reveal all bombs when the player loses.
 * - Update the visual representation of each cell in the DOM (via updateCell).
 * - Handle left-clicks (reveal) and right-clicks (toggle flag).
 * - Implement a flood-fill algorithm to automatically reveal empty regions.
 * - Check for win conditions (all safe cells uncovered).
 * 
 * Key methods:
 * - constructor(width, height, game): Initializes the grid and links to the Game instance.
 * - generateBombs(bombCount, startX, startY): Places bombs and updates numbers.
 * - revealBombs(): Uncovers all bombs on the board.
 * - setCell(x, y, i, v): Updates a cell property and triggers visual update.
 * - updateCell(x, y): Renders the current state of a cell to the UI.
 * - cellClicked(x, y): Handles left-click (reveal logic).
 * - cellRightClicked(x, y): Handles right-click (flag placement/removal).
 * - floodFill(x, y): Expands reveals over empty cells recursively.
 * - checkWin(): Returns true if all non-bomb cells are uncovered.
 * 
 * Design notes:
 * - This class is tightly coupled with the DOM: each cell corresponds to a
 *   button element with id `cell-x-y`.
 * - Relies on the Game object for global state management (start, finish, flags).
 * - Game logic and rendering are partially mixed, since updateCell writes directly to the DOM.
 */

// MAP CLASS 🗺️📍🧭 ————————————————————————————————————————————————————————————————————————————————
export class Map {
	constructor(width, height, game) {
		this.w = width; // width
		this.h = height; // height
		this.game = game; // reference to Game instance

		// Create grid
		this.grid = [];
		for (let y = 0; y < this.h; y++) {
			this.grid[y] = [];
			for (let x = 0; x < this.w; x++) {
				// [Visual Number (Surrounding bombs), Bomb, Flag?, Covered?]
				this.grid[y][x] = [0, 0, 0, 1];
			}
		}
	}

	/**
	 * Randomly place bombs on the grid while ensuring the first clicked
	 * cell and its neighbors are safe.
	 */
	generateBombs(bombCount, startX, startY) {
		// Generate random number of bombs
		let count = 0;

		// Mark forbidden cells.
		// Bombs shouldn't spawn near or adjacent to where the user clicked
		const forbidden = new Set();
		for (let dy = -1; dy <= 1; dy++) {
			for (let dx = -1; dx <= 1; dx++) {
				const x = startX + dx;
				const y = startY + dy;
				if (this.inMap(x, y)) forbidden.add(`${x},${y}`);
			}
		}

		while (count < bombCount) {
			const x = Math.floor(Math.random() * this.w);
			const y = Math.floor(Math.random() * this.h);

			// Don't spawn where user clicked
			if (forbidden.has(`${x},${y}`)) continue;

			// Generate new coordinate if bomb is already there
			if (this.getCell(x, y, 1) === 1) continue;

			// Place bomb
			this.setCell(x, y, 1, 1);

			// Update numbers of surrounding tiles
			for (let dy = -1; dy <= 1; dy++) {
				for (let dx = -1; dx <= 1; dx++) {
					const cx = x + dx;
					const cy = y + dy;
					if (this.inMap(cx, cy)) {
						this.setCell(cx, cy, 0, this.getCell(cx, cy, 0) + 1);
					}
				}
			}

			count++;
		}
	}

	/**
	 * Reveal all bombs on the board when the player loses.
	 */
	revealBombs() {
		for (let y = 0; y < this.h; y++) {
			for (let x = 0; x < this.w; x++) {
				if (this.getCell(x, y, 1) === 1) {
					// Uncover bomb
					this.setCell(x, y, 3, 0);
				}
			}
		}
	}

	/**
	 * Set a property of a cell and update its visual representation.
	 * @param {number} x - X coordinate
	 * @param {number} y - Y coordinate
	 * @param {number} i - Index in cell array (0-Visual,1-Bomb,2-Flag,3-Covered)
	 * @param {number} v - New value
	 */
	setCell(x, y, i, v) {
		if (!this.inMap(x, y)) return;
		this.grid[y][x][i] = v;

		this.updateCell(x, y);
	}

	/**
	 * Update all cells on the board (used after bomb placement or game reset)
	 */
	updateMap(x, y) {
		for (let y = 0; y < this.h; y++) {
			for (let x = 0; x < this.w; x++) {
				this.updateCell(x, y);
			}
		}
	}

	/**
	 * Update a single cell in the UI based on its current state.
	 */

	updateCell(x, y) {
		const btn = document.getElementById(`cell-${x}-${y}`);
		// Flag
		if (this.getCell(x, y, 2) === 1) {
			btn.textContent = "🚩";
			return;
		}

		// Covered?
		if (this.getCell(x, y, 3) === 1) {
			btn.textContent = "⬛";
			return;
		}

		// Bomb?
		if (this.getCell(x, y, 1) === 1) {
			btn.textContent = "💣";
			return;
		}

		// Number tile (1-8)
		const number = this.getCell(x, y, 0);
		if (number > 0) {
			btn.textContent = number;
			// Assign colors by number
			switch (number) {
				case 1:
					btn.style.color = "blue";
					break;
				case 2:
					btn.style.color = "green";
					break;
				case 3:
					btn.style.color = "red";
					break;
				case 4:
					btn.style.color = "darkblue";
					break;
				case 5:
					btn.style.color = "brown";
					break;
				case 6:
					btn.style.color = "turquoise";
					break;
				case 7:
					btn.style.color = "black";
					break;
				case 8:
					btn.style.color = "gray";
					break;
			}
		} else {
			btn.textContent = ""; // empty cell
		}

		// Uncovered, disable.
		btn.disabled = true;
	}

	// safely get cell property
	getCell(x, y, i) {
		if (!this.inMap(x, y)) return;

		const btn = document.getElementById(`cell-${x}-${y}`);
		if (!btn) return;

		return this.grid[y][x][i];
	}

	// check if coordinates are within map bounds
	inMap(x, y) {
		return x >= 0 && y >= 0 && x < this.w && y < this.h;
	}

	/**
	 * Handle left-click on a cell
	 * @returns {boolean} true if cell revealed, false if bomb or flagged
	 */
	// REPLACE your cellClicked function in map.js with this version:

	cellClicked(x, y) {
		// Allow AI clicks when AI is making its move, but block player clicks
		if (typeof currentTurn !== 'undefined' && currentTurn === "ai") {
			// Only allow if AI is not thinking (meaning it's making its actual move)
			if (typeof aiThinking !== 'undefined' && aiThinking) {
				return false;
			}
		} else if (typeof currentTurn !== 'undefined' && currentTurn !== "player") {
			return false;
		}
		// Block player clicks when AI is thinking
		if (typeof aiThinking !== 'undefined' && aiThinking) {
			return false;
		}
		if (!this.game.started) {
			this.game.start(x, y);
		}
		// Don't do anything if there is a flag
		if (this.getCell(x, y, 2) === 1) {
			return false;
		}
		// If clicked on a bomb → lose
		if (this.getCell(x, y, 1) === 1) {
			// Play bomb SFX (rewind to ensure it plays)
			try {
				const s = document.getElementById('sfx-bomb');
				if (s) { s.currentTime = 0; s.play().catch(()=>{}); }
			} catch(_) {}
			this.setCell(x, y, 3, 0);
			this.game.finish("lose");
			return false;
		}
		// Uncover tile
		if (this.getCell(x, y, 3) === 1) {
			this.floodFill(x, y);
			// Check win after uncover
			if (this.checkWin()) {
				this.game.finish("win");
				return true;
			}
			// Only trigger AI if this was a PLAYER move (not an AI move)
			if (typeof aiMode !== 'undefined' && aiMode &&
				typeof currentTurn !== 'undefined' && currentTurn === "player" &&
				typeof endPlayerTurn === 'function') {
				endPlayerTurn();
			}
			return true;
		}
		return false;
	}

	/**
	 * Handle right-click on a cell (place/remove flag)
	 */
	cellRightClicked(x, y) {
		// Place flag on covered tiles
		if (this.getCell(x, y, 3) === 1) {
			if (this.getCell(x, y, 2) === 0) {
				if (this.game.placeFlag()) {
					// Place
					this.setCell(x, y, 2, 1);
				}
			} else {
				this.game.removeFlag()
				// Remove
				this.setCell(x, y, 2, 0);
			}
		}
	}

	/**
	 * Flood-fill empty tiles recursively
	 */
	floodFill(startX, startY) {
		const empty = this.getCell(startX, startY, 0) === 0;
		// Clear first cell
		this.setCell(startX, startY, 3, 0);
		// If empty, look for neighboring empty tiles.
		if (empty) {
			const visited = [];
			for (let x = 0; x < this.w; x++) {
				visited[x] = [];
				for (let y = 0; y < this.h; y++) {
					// [Visual Number (Surrounding bombs), Bomb, Flag?, Covered?]
					visited[x][y] = false;
				}
			}

			this._flood(startX, startY, visited);
		}
	}

	// Internal helper for recursive flood-fill
	_flood(x, y, visited) {
		// Clear cell and mark it as visited
		this.setCell(x, y, 3, 0);
		visited[x][y] = true;
		if (this.getCell(x, y, 0) !== 0) {
			// Stop searching if not emptry
			return;
		}
		// Spread to neighboring tiles
		for (let dx = -1; dx <= 1; dx++) {
			for (let dy = -1; dy <= 1; dy++) {
				if (dx === 0 && dy === 0) {
					continue;
				}
				if (this.inMap(x + dx, y + dy) && !visited[x + dx][y + dy]) {
					this._flood(x + dx, y + dy, visited);
				}
			}
		}
		return;
	}
	/**
	 * Check win condition: all non-bomb tiles uncovered
	 * @returns {boolean}
	 */
	checkWin() {
		for (let y = 0; y < this.h; y++) {
			for (let x = 0; x < this.w; x++) {
				if (this.getCell(x, y, 1) === 0 && this.getCell(x, y, 3) === 1) {
					return false; // still covered non-bomb
				}
			}
		}
		return true;
	}
}