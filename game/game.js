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

	}

	start () {

	}

	finish () {

	}
}

GAME = new Game();
GAME.start();