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
  }

  /*
   * Set up game upon loading the webpage.
   */
  initialize(width = 8, height = 8, bombs = 8) {
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
  }

  start(startX, startY) {
    this.started = true;

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
}

const GAME = new Game();
GAME.initialize();
