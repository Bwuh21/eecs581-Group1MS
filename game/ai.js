let currentTurn = "player";
let aiMode = null;
let aiThinking = false;

function playerCanMove() {
    return currentTurn === "player" && !aiThinking;
}

function updateAIButtonStyles() {
    const buttons = {
        easy: document.getElementById("ai-easy"),
        medium: document.getElementById("ai-medium"),
        hard: document.getElementById("ai-hard")
    };
    Object.values(buttons).forEach(btn => {
        if (btn) {
            btn.style.backgroundColor = "";
            btn.style.color = "";
            btn.style.fontWeight = "";
            btn.style.border = "";
            btn.style.boxShadow = "";
        }
    });
    if (aiMode && buttons[aiMode]) {
        const selectedBtn = buttons[aiMode];
        switch (aiMode) {
            case "easy":
                selectedBtn.style.backgroundColor = "#4CAF50";
                selectedBtn.style.color = "white";
                break;
            case "medium":
                selectedBtn.style.backgroundColor = "#FF9800";
                selectedBtn.style.color = "white";
                break;
            case "hard":
                selectedBtn.style.backgroundColor = "#F44336";
                selectedBtn.style.color = "white";
                break;
        }
        selectedBtn.style.fontWeight = "bold";
        selectedBtn.style.border = "3px solid #333";
        selectedBtn.style.boxShadow = "0 0 10px rgba(0,0,0,0.3)";
    }
}

function setBoardThinking(isThinking) {
    const grid = document.getElementById("minesweeper-grid");
    if (!grid) return;

    if (isThinking) {
        grid.style.opacity = "0.5";
        grid.style.pointerEvents = "none";
        grid.style.filter = "grayscale(70%)";

        let overlay = document.getElementById("ai-thinking-overlay");
        if (!overlay) {
            overlay = document.createElement("div");
            overlay.id = "ai-thinking-overlay";
            overlay.style.cssText = `
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 15px 25px;
                border-radius: 10px;
                font-size: 16px;
                font-weight: bold;
                z-index: 1000;
                pointer-events: none;
                border: 2px solid #fff;
                box-shadow: 0 0 20px rgba(0,0,0,0.5);
            `;
            const gridContainer = grid.parentElement;
            gridContainer.style.position = "relative";
            gridContainer.appendChild(overlay);
        }
        overlay.textContent = `AI (${aiMode.toUpperCase()}) is thinking...`;
        overlay.style.display = "block";
    } else {
        grid.style.opacity = "1";
        grid.style.pointerEvents = "auto";
        grid.style.filter = "none";
        const overlay = document.getElementById("ai-thinking-overlay");
        if (overlay) {
            overlay.style.display = "none";
        }
    }
}

function getAvailableCells() {
    const grid = document.getElementById("minesweeper-grid");
    const availableCells = [];
    const buttons = grid.querySelectorAll("button:not(:disabled)");
    buttons.forEach(btn => {
        if (btn.textContent === "⬛") {
            const matches = btn.id.match(/cell-(\d+)-(\d+)/);
            if (matches) {
                availableCells.push({
                    x: parseInt(matches[1]),
                    y: parseInt(matches[2]),
                    element: btn
                });
            }
        }
    });
    return availableCells;
}

function selectEasyCell(availableCells) {
    //return a random cell bomb or not
    if (availableCells.length === 0) return null;
    return availableCells[Math.floor(Math.random() * availableCells.length)];
}


function selectMediumCell(availableCells) {
    // TODO: replace with the random logic with medium logic 
    if (availableCells.length === 0) return null;

    const grid = document.getElementById("minesweeper-grid");
    const revealed = grid.querySelectorAll("button:disabled");

    // Step 1: Apply rules for safe picks
    for (let btn of revealed) {
        const value = parseInt(btn.textContent);
        if (isNaN(value) || value === 0) continue;

        const matches = btn.id.match(/cell-(\d+)-(\d+)/);
        if (!matches) continue;
        const x = parseInt(matches[1]);
        const y = parseInt(matches[2]);

        const neighbors = [];
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                if (dx === 0 && dy === 0) continue;
                const n = document.getElementById(`cell-${x + dx}-${y + dy}`);
                if (n) neighbors.push(n);
            }
        }

        const hiddenNeighbors = neighbors.filter(n => n.textContent === "⬛" && n.dataset.flagged !== "true");
        const flaggedNeighbors = neighbors.filter(n => n.dataset.flagged === "true");

        // Rule 1: Flag bombs internally
        if (hiddenNeighbors.length > 0 && hiddenNeighbors.length === value - flaggedNeighbors.length) {
            hiddenNeighbors.forEach(hn => hn.dataset.flagged = "true");
        }

        // Rule 2: Open safe cells
        if (flaggedNeighbors.length === value && hiddenNeighbors.length > 0) {
            return { element: hiddenNeighbors[0], x, y }; // guaranteed safe
        }
    }

    // Step 2: Fallback random pick (bomb or safe)
    const hiddenCells = availableCells.filter(c => c.element.textContent === "⬛");
    if (hiddenCells.length === 0) return null;

    return hiddenCells[Math.floor(Math.random() * hiddenCells.length)];
}

function selectHardCell(availableCells) {
    // TODO: select a non bomb from the game state, never pick a bomb. 
    if (availableCells.length === 0) return null;

    // Step 1: Apply Medium rules first
    const mediumPick = selectMediumCell(availableCells);
    if (mediumPick) return mediumPick;

    const grid = document.getElementById("minesweeper-grid");
    const revealed = grid.querySelectorAll("button:disabled");

    // Step 2: Apply 1-2-1 pattern rule
    for (let btn of revealed) {
        const value = parseInt(btn.textContent);
        if (isNaN(value)) continue;

        const matches = btn.id.match(/cell-(\d+)-(\d+)/);
        if (!matches) continue;
        const x = parseInt(matches[1]);
        const y = parseInt(matches[2]);

        // Horizontal 1-2-1
        const left = document.getElementById(`cell-${x-1}-${y}`);
        const right = document.getElementById(`cell-${x+1}-${y}`);
        if (left && right && left.textContent === "1" && btn.textContent === "2" && right.textContent === "1") {
            const outerLeft = document.getElementById(`cell-${x-2}-${y}`);
            const outerRight = document.getElementById(`cell-${x+2}-${y}`);
            const middle = document.getElementById(`cell-${x}-${y}`);

            if (outerLeft && outerLeft.textContent === "⬛") outerLeft.dataset.flagged = "true";
            if (outerRight && outerRight.textContent === "⬛") outerRight.dataset.flagged = "true";
            if (middle && middle.textContent === "⬛") return { element: middle, x, y }; // safe pick
        }

        // Vertical 1-2-1
        const up = document.getElementById(`cell-${x}-${y-1}`);
        const down = document.getElementById(`cell-${x}-${y+1}`);
        if (up && down && up.textContent === "1" && btn.textContent === "2" && down.textContent === "1") {
            const outerUp = document.getElementById(`cell-${x}-${y-2}`);
            const outerDown = document.getElementById(`cell-${x}-${y+2}`);
            const middle = document.getElementById(`cell-${x}-${y}`);

            if (outerUp && outerUp.textContent === "⬛") outerUp.dataset.flagged = "true";
            if (outerDown && outerDown.textContent === "⬛") outerDown.dataset.flagged = "true";
            if (middle && middle.textContent === "⬛") return { element: middle, x, y }; // safe pick
        }
    }

    // Step 3: Fallback random pick (bomb or safe)
    const hiddenCells = availableCells.filter(c => c.element.textContent === "⬛");
    if (hiddenCells.length === 0) return null;

    return hiddenCells[Math.floor(Math.random() * hiddenCells.length)];
}

function endPlayerTurn() {
    if (!aiMode) return;
    if (currentTurn !== "player") return;
    currentTurn = "ai";
    aiMove();
}

function aiMove() {
    if (!aiMode || currentTurn !== "ai") return;
    aiThinking = true;
    setBoardThinking(true);
    const delays = { easy: 500, medium: 600, hard: 700 };
    const delay = delays[aiMode];
    setStatus(`AI (${aiMode.toUpperCase()}) is thinking...`, "playing");
    setTimeout(() => {
        aiThinking = false;
        setBoardThinking(false);
        makeAIMove();
        setTimeout(() => {
            currentTurn = "player";
            setStatus("Your turn!", "playing");
        }, 500);

    }, delay);
}

function makeAIMove() {
    clearPreviousAIHighlight();
    const availableCells = getAvailableCells();
    let selectedCell = null;
    switch (aiMode) {
        case "easy":
            selectedCell = selectEasyCell(availableCells);
            break;
        case "medium":
            selectedCell = selectMediumCell(availableCells);
            break;
        case "hard":
            selectedCell = selectHardCell(availableCells);
            break;
    }

    if (selectedCell) {
        selectedCell.element.style.backgroundColor = "#ff6b6b";
        selectedCell.element.style.border = "3px solid #ff1744";
        selectedCell.element.style.transform = "scale(1.1)";
        selectedCell.element.setAttribute('data-ai-selected', 'true');
        setTimeout(() => {
            selectedCell.element.click();
        }, 500);
    }
}

function clearPreviousAIHighlight() {
    const previousAICells = document.querySelectorAll('[data-ai-selected="true"]');
    previousAICells.forEach(btn => {
        btn.style.backgroundColor = "";
        btn.style.border = "";
        btn.style.transform = "";
        btn.removeAttribute('data-ai-selected');
    });
}

function startAIEasy() {
    aiMode = "easy";
    updateAIButtonStyles();
    setStatus("AI Easy mode selected", "playing");
}

function startAIMedium() {
    aiMode = "medium";
    updateAIButtonStyles();
    setStatus("AI Medium mode selected", "playing");
}

function startAIHard() {
    aiMode = "hard";
    updateAIButtonStyles();
    setStatus("AI Hard mode selected", "playing");
}

document.addEventListener("DOMContentLoaded", function () {
    const buttons = [
        { id: "ai-easy", fn: startAIEasy },
        { id: "ai-medium", fn: startAIMedium },
        { id: "ai-hard", fn: startAIHard }
    ];
    buttons.forEach(({ id, fn }) => {
        const btn = document.getElementById(id);
        btn.addEventListener("click", fn);
    });
});

setTimeout(() => {
    const buttons = [
        { id: "ai-easy", fn: startAIEasy },
        { id: "ai-medium", fn: startAIMedium },
        { id: "ai-hard", fn: startAIHard }
    ];

    buttons.forEach(({ id, fn }) => {
        const btn = document.getElementById(id);
        if (!btn.hasAttribute('data-ai-connected')) {
            btn.addEventListener("click", fn);
            btn.setAttribute('data-ai-connected', 'true');
        }
    });
}, 500);

function setStatus(message, gameState) {
    const statusElement = document.getElementById("game-status");
    if (statusElement) {
        statusElement.textContent = message;
        statusElement.className = `status-${gameState}`;
    }
}