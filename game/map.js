export class Map {
	constructor (
		width,
		height,
		game,
	) {
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

	generateBombs(
		bombCount,
		startX,
		startY,
	) {
		// Generate random number of bombs
		let count = 0;
		while (count < bombCount) {
			const x = Math.floor(Math.random() * this.w);
			const y = Math.floor(Math.random() * this.h);
			
			// Don't spawn where user clicked
			// TODO: Fix, this doesn't work.
			if (x === startX && y === startY) continue;
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
						this.setCell(cx, cy, 0, this.getCell(cx, cy, 0) + 1)
					}
				}
			}

			count++;
		}
	}
	
	setCell (
		x,
		y,
		i,
		v,
	) {
		if (!this.inMap(x,y)) return;
		this.grid[y][x][i] = v;
		
		this.updateCell(x, y);
	}

	updateMap(
		x,
		y,
	) {
		for (let y = 0; y < this.h; y++) {
			for (let x = 0; x < this.w; x++) {
				this.updateCell(x, y);
			}
		}
	}

	updateCell(
		x,
		y,
	) {
		const btn = document.getElementById(`cell-${x}-${y}`);
		if (!btn) {
			console.warn(`No cell at (${x}, ${y})`)
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
		} else {
			btn.textContent = "";
		}

		// Uncovered, disable.
		btn.disabled = true;
	}

	getCell (
		x,
		y,
		i,
	) {
		if (!this.inMap(x,y)) return;

		const btn = document.getElementById(`cell-${x}-${y}`);
		if (!btn) return;

		return this.grid[y][x][i];
	}

	inMap(x,y) {
		return (x >= 0 && y >= 0 && x < this.w && y < this.h)
	}

	cellClicked (
		x,
		y,
	) {
		if (!this.game.started) {
			// Start Game
			this.game.start(x, y);
		}

		// Don't do anything if there is a flag
		if (this.getCell(x, y, 2) === 1) {
			return;
		}

		// Uncover tile
		if (this.getCell(x, y, 3) === 1) {
			// TODO: Flood algorithm to uncover neighboring blank cells.
			this.floodFill(x, y)
			return true;
		} else {
			return false;
		}
	}

	cellRightClicked (
		x,
		y,
	) {
		// Place flag on covered tiles
		if (this.getCell(x, y, 3) === 1) {
			if (this.getCell(x, y, 2) === 0) {
				// Place
				this.setCell(x, y, 2, 1);
			} else {
				// Remove
				this.setCell(x, y, 2, 0);
			}
		}
	}

	floodFill(
		startX,
		startY,
	) {
		// TODO
		this.setCell(startX, startY, 3, 0)
	}
	
}