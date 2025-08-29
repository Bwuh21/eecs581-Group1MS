export class Map {
	constructor (
		width,
		height,
		game,
	) {
		this.w = width;
		this.h = height;

		// Create grid
		this.grid = [];
		for (let y = 0; y < height; y++) {
			this.grid[y] = [];
			for (let x = 0; x < width; x++) {
				// [Visual Number (Surrounding bombs), Bomb, Flag, Covered]
				this.grid[y][x] = [0, 0, 0, 0];
			}
		}

		this.game = game;
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

		const btn = document.getElementById(`cell-${x}-${y}`);
		if (!btn) return;

		if (i == 0) {
			btn.textContent = v;
		}
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
			return;
		}
	}
}