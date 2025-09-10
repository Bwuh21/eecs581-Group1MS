export class Map {
	constructor(width, height, game) {
		this.w = width;
		this.h = height;
		this.game = game;

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

	setCell(x, y, i, v) {
		if (!this.inMap(x, y)) return;
		this.grid[y][x][i] = v;

		this.updateCell(x, y);
	}

	updateMap(x, y) {
		for (let y = 0; y < this.h; y++) {
			for (let x = 0; x < this.w; x++) {
				this.updateCell(x, y);
			}
		}
	}

	updateCell(x, y) {
		const btn = document.getElementById(`cell-${x}-${y}`);
		if (!btn) {
			console.warn(`No cell at (${x}, ${y})`);
			return;
		}

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
			btn.textContent = "";
		}

		// Uncovered, disable.
		btn.disabled = true;
	}

	getCell(x, y, i) {
		if (!this.inMap(x, y)) return;

		const btn = document.getElementById(`cell-${x}-${y}`);
		if (!btn) return;

		return this.grid[y][x][i];
	}

	inMap(x, y) {
		return x >= 0 && y >= 0 && x < this.w && y < this.h;
	}

	cellClicked(x, y) {
		if (!this.game.started) {
				this.game.start(x, y);
		}

		// Don't do anything if there is a flag
		if (this.getCell(x, y, 2) === 1) {
				return;
		}

		// If clicked on a bomb → lose
		if (this.getCell(x, y, 1) === 1) {
				this.setCell(x, y, 3, 0); // uncover bomb
				this.game.finish("lose");
				return false;
		}

		// Uncover tile
		if (this.getCell(x, y, 3) === 1) {
				this.floodFill(x, y);

				// Check win after uncover
				if (this.checkWin()) {
						this.game.finish("win");
				}
				return true;
		}
		return false;
	}

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
