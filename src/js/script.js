import Maze from "./maze.js";
import Tile from "./tile.js";

// COLORS
const white = "rgb(220, 220, 220)";
const green = "rgb(40, 190, 40)";
const red = "rgb(190, 40, 40)";
const orange = "rgb(210, 125, 30)";
const yellow = "rgb(230, 200, 40)";
const purple = "rgb(150, 15, 175)";

// DOCUMENT ELEMENTS
const canvasContainer = document.getElementById('canvas-container');

const gridLinesCheckbox = document.getElementById('show-grid');
const showStepsCheckbox = document.getElementById('show-steps');
const wormholeIdRange = document.getElementById('wormhole-id');
const buttons = document.getElementsByClassName("button");
const deleteAllButton = document.getElementById('delete-all-button');
const solveMazeButton = document.getElementById('solve-button');
const solveAlgorithmSelect = document.getElementById('solve-maze-select');

// CANVAS
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// MAZE VARIABLES
var showGrid = gridLinesCheckbox.checked;
var showSteps = showStepsCheckbox.checked;
var wormholeId = wormholeIdRange.value;
var editMode = "Wall";
var mouseDown = false;
var solveAlgorithm = solveAlgorithmSelect.value;
var finishedAlgorithm = false;
const gridSize = 30;
const numRows = Math.floor((canvasContainer.clientHeight-10) / gridSize);
const numColumns = Math.floor((canvasContainer.clientWidth-10) / gridSize);
const sleepTimeMS = 15;

canvas.width = gridSize * numColumns;
canvas.height = gridSize * numRows;
canvas.style.width = `${canvas.width}px`;
canvas.style.height = `${canvas.height}px`;

var maze = new Maze(numRows, numColumns);

// Add event listeners to buttons
for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].id !== "solve-button" && buttons[i].id !== "delete-all-button") {
        buttons[i].addEventListener("click", (e) => {
            getEditMode(e);
        });
    }
}
deleteAllButton.addEventListener("click", () => {
    maze.clear();
    drawAll();
});
solveMazeButton.addEventListener("click", () => {
    startSolve();
});

// Add event listeners to checkboxes
gridLinesCheckbox.addEventListener("click", () => {
    showGrid = gridLinesCheckbox.checked;
    drawAll();
});
showStepsCheckbox.addEventListener("click", () => {
    showSteps = showStepsCheckbox.checked;
});

// Update range input everytime it changes
wormholeIdRange.oninput = () => {
    wormholeId = wormholeIdRange.value;
    wormholeIdRange.previousSibling.previousSibling.innerText = `wormhole id (${wormholeId}):`;
};

// Add event listeners to canvas
canvas.addEventListener("mousedown", (e) => {
    mouseDown = true;
    editMaze(Math.floor(e.offsetY / gridSize), Math.floor(e.offsetX / gridSize));
});
canvas.addEventListener("mouseup", () => {
    mouseDown = false;
});
canvas.addEventListener("mousemove", (e) => {
    if (mouseDown) {
        editMaze(Math.floor(e.offsetY / gridSize), Math.floor(e.offsetX / gridSize));
    }
});

/**
 * A function that updates the maze edit mode
 * @param {PointerEvent} e The Click Event Information
 */
function getEditMode(e) {
    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].hasAttribute("data-active")) {
            buttons[i].removeAttribute("data-active");
        }
    }
    e.target.setAttribute("data-active", '');
    editMode = e.target.innerText;
}

/**
 * A function that edits the maze's tile type at the specified row and column
 * @param {Number} row The row to edit
 * @param {Number} col The column to edit
 */
function editMaze(row, col) {
    // Check if row and column are valid
    if (row >= 0 && col >= 0 && row < numRows && col < numColumns) { 
        const typeNumber = Tile.tileTypeDict[editMode];

        // Check if more than one start/destination tile is being placed
        if ((typeNumber === 1 || typeNumber === 2) && maze.getNumTileType(typeNumber) > 0) {
            return;
        }

        // Check if the tile is empty or if the user wants to delete the tile
        if (maze.matrix[row][col].type === 0 || typeNumber === 0) {
            maze.matrix[row][col].type = typeNumber;
            if (typeNumber === 0 || finishedAlgorithm) {
                drawAll();
                finishedAlgorithm = false;
            }
            else {
                draw(row, col);
            }
        }
    }   
}

/**
 * A function that draws a grid on the canvas
 */
function drawGrids() {
    if (showGrid) {
        ctx.beginPath();
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = white;

        // Draw Rows
        for (var i = 1; i < numRows; i++) {
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(canvas.width, i * gridSize);
        }
        // Draw Columns
        for (var i = 1; i < numColumns; i++) {
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, canvas.height);
        }
        ctx.stroke();
    }
}

/**
 * A function that redraws everything on the canvas
 */
function drawAll() {
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Iterate through and draw each tile in the maze
    for (var i = 0; i < maze.matrix.length; i++) {
        for (var j = 0; j < maze.matrix[i].length; j++) {
            draw(i, j);
        }
    }

    // Overlay the grid on top of the tiles
    drawGrids();
}

/**
 * A function that redraws a tile at the specified row and column
 * @param {Number} r 
 * @param {Number} c 
 */
function draw(r, c) {
    const tile = maze.matrix[r][c];

    const x = c * gridSize;
    const y = r * gridSize;

    if (tile.type in Tile.tileImageDict) {  // Push blocks
        ctx.drawImage(Tile.tileImageDict[tile.type], x, y, gridSize, gridSize);
    }
    else if (tile.type === 0) {  // Empty Tile
        if (tile.inPath) {  // Empty tile is a part of the path
            ctx.fillStyle = purple;
            ctx.fillRect(x, y, gridSize, gridSize);
        }
        else if (tile.visited && showSteps) {  // Empty tile has been visited
            ctx.fillStyle = orange;
            ctx.fillRect(x, y, gridSize, gridSize);
        }
        else if (tile.checked && showSteps) {  // Empty tile has been checked
            ctx.fillStyle = yellow;
            ctx.fillRect(x, y, gridSize, gridSize);
        }
        else { 
            ctx.clearRect(x, y, gridSize, gridSize);
        }
    }
    else if (tile.type === 3) {  // Wall
        ctx.fillStyle = white;
        ctx.fillRect(x, y, gridSize, gridSize);
    }
    else if (tile.type === 1) {  // Start Block
        ctx.fillStyle = green;
        ctx.fillRect(x, y, gridSize, gridSize);
    }
    else if (tile.type === 2) {  // Destination Block
        ctx.fillStyle = red;
        ctx.fillRect(x, y, gridSize, gridSize);
    }
}

/**
 * A function that starts solving the maze based on the selected algorithm
 */
async function startSolve() {
    // Check if maze contains start and destination tile
    if (maze.getNumTileType(1) === 1 && maze.getNumTileType(2) === 1) {

        drawAll();
        disableButtons();
        solveAlgorithm = solveAlgorithmSelect.value;
        var solved;
        switch (solveAlgorithm) {
            case "I_DFS":
                solved = await IterativeDFS();
                break;
            case "BFS":
                solved = await BFS();
                break;
            case "":
                alert("Please select an algorithm to solve the maze.");
                break;
        }

        if (solved) {
            const startTile = maze.getTile(1);
            const destinationTile = maze.getTile(2);
            reconstructPath(startTile, destinationTile);
            drawAll();
        }
        else {
            alert("Maze cannot be solved!");
        }

        finishedAlgorithm = true;
        maze.resetTiles();
        enableButtons();
    }
    else {
        alert("Please put down a start and destination tile.");
    }
}

/**
 * A search function that implements iterative DFS
 * @return {boolean} whether or not a path has been found
 */
async function IterativeDFS() {
    var stack = [];
    const startTile = maze.getTile(1);
    const destinationTile = maze.getTile(2);
    var foundDestination = false;

    // Add the start tile to the top of the stack
    startTile.checked = true;
    stack.push(startTile);

    // Loop while stack isn't empty and the destination has not been found
    while (stack.length > 0 && !foundDestination) {

        // Get the tile at the top of the stack and check if it has been visited
        const currentTile = stack.pop();
        if (currentTile.visited) {
            continue;
        }
        currentTile.visited = true;

        if (showSteps) {
            draw(currentTile.row, currentTile.column);
            await sleep(sleepTimeMS);
        }
        
        // Iterate through each adjacent tile
        const adjacentTiles = maze.getAdjacent(currentTile.row, currentTile.column);
        for (var i = 0; i < adjacentTiles.length; i++) {
            const adjTile = adjacentTiles[i];

            if (!adjTile.checked) {  // Tile hasn't been checked
                adjTile.parentTile = currentTile;

                if (adjTile.equals(destinationTile)) {  // Found the destination tile
                    foundDestination = true;
                }
                else {  // Add tile to the top of the stack
                    adjTile.checked = true;
                    stack.push(adjTile);
                }

                if (showSteps) {
                    draw(adjTile.row, adjTile.column);
                    await sleep(sleepTimeMS);
                }
            }
        }
    }

    return foundDestination;

}

async function BFS() {
    
}

/**
 * A function that reconstructs the path from the start to destination tile
 * @param {Tile} start 
 * @param {Tile} destination 
 */
function reconstructPath(start, destination) {
    var currentTile = destination;
    destination.inPath = true;

    while (!currentTile.equals(start)) {
        currentTile = maze.matrix[currentTile.parentTile.row][currentTile.parentTile.column];
        currentTile.inPath = true;
    }
}

/**
 * A function that disables all menu buttons
 */
function disableButtons() {
    const allButtons = document.getElementsByClassName('button');
    for (var i = 0; i < allButtons.length; i++) {
        allButtons[i].setAttribute('disabled', '');
    }
}

/**
 * A function that enables all menu buttons
 */
function enableButtons() {
    const allButtons = document.getElementsByClassName('button');
    for (var i = 0; i < allButtons.length; i++) {
        if (allButtons[i].id !== "wormhole-button") {
            allButtons[i].removeAttribute('disabled');
        }
    }
}

/**
 * A function that sleeps for a specified amount of time
 * @param {Number} ms The amount of time to sleep in milliseconds
 * @returns {Promise} A promise object
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Draw all contents
drawAll();
