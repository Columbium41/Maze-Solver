import Maze from "./maze.js";
import Tile from "./tile.js";

// COLORS
const white = "rgb(220, 220, 220)";

// DOCUMENT ELEMENTS
const canvasContainer = document.getElementById('canvas-container');

const gridLinesCheckbox = document.getElementById('show-grid');
const showStepsCheckbox = document.getElementById('show-steps');
const wormholeIdRange = document.getElementById('wormhole-id');
const buttons = document.getElementsByClassName("button");
const deleteAllButton = document.getElementById('delete-all-button');

// CANVAS
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// MAZE VARIABLES
var showGrid = false;
var showSteps = false;
var wormholeId = 1;
var editMode = "Wall";
var mouseDown = false;
const gridSize = 30;
const numRows = Math.floor((canvasContainer.clientHeight-10) / gridSize);
const numColumns = Math.floor((canvasContainer.clientWidth-10) / gridSize);

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
    for (var i = 0; i < maze.matrix.length; i++) {
        for (var j = 0; j < maze.matrix[i].length; j++) {
            maze.matrix[i][j].type = 0;
        }
    }
    drawAll();
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

        // Check if the tile is empty or if the user wants to delete the tile
        if (typeNumber === 0 || maze.matrix[row][col].type === 0) {
            maze.matrix[row][col].type = typeNumber;
            if (typeNumber === 0) {
                drawAll();
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

    if (tile.type === 0) {  // Empty
        ctx.clearRect(x, y, gridSize, gridSize);
    }
    else if (tile.type === 3) {  // Wall
        ctx.fillStyle = white;
        ctx.fillRect(x, y, gridSize, gridSize);
    }
}
