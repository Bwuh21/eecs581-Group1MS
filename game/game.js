import { Map } from "./map.js";

// --- Popup logic ---
window.onload = function() {
	// show popup on load
	document.getElementById("popupOverlay").style.display = "block";
	document.getElementById("popupContainer").style.display = "block";
  
	// close button
	document.getElementById("closePopup").onclick = function() {
	  document.getElementById("popupOverlay").style.display = "none";
	  document.getElementById("popupContainer").style.display = "none";
	};
  };
  
class Game {
	constructor () {
		this.started = true;
		
		this.initialize();
	}

	/*
	 * Set up game upon loading the webpage.
	 */
	initialize(
		width = 8,
		height = 8,
		bombs = 16,
	) {
		this.bombs = bombs;
		this.map = new Map(width, height, this);

		// Set up html grid
		const grid = document.getElementById("minesweeper-grid");
		grid.innerHTML = "";
		
		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				// Create buttons
				const btn = document.createElement("button");
				btn.className = "grid-btn";
				btn.id = `cell-${x}-${y}`;
				// Add click listener
				btn.addEventListener("click", () => {
					this.map.cellClicked(x, y);
				});
				grid.appendChild(btn);

			}
		}
	}

	start (startX, startY) {
		this.started = true;

		this.map.generateBombs(this.bombs, startX, startY);
	}

	finish () {
		this.started = false;
	}
}

const GAME = new Game();
GAME.start();