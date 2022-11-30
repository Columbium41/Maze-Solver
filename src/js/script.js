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

function getEditMode(e) {
    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].hasAttribute("data-active")) {
            buttons[i].removeAttribute("data-active");
        }
    }
    e.target.setAttribute("data-active", '');
    editMode = e.target.innerText;
}

function editMaze(row, col) {
    if (row >= 0 && col >= 0 && row < numRows && col < numColumns) {
        maze.matrix[row][col].type = Tile.tileTypeDict[editMode];
        //draw(row, col);
        drawAll();
    }
}

function drawGrids() {
    if (showGrid) {
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = white;

        for (var i = 1; i < numRows; i++) {
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(canvas.width, i * gridSize);
        }
        for (var i = 1; i < numColumns; i++) {
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, canvas.height);
        }
        ctx.stroke();
    }
}
function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < maze.matrix.length; i++) {
        for (var j = 0; j < maze.matrix[i].length; j++) {
            draw(i, j);
        }
    }

    drawGrids();
}
function draw(r, c) {
    const tile = maze.matrix[r][c];

    const x = c * gridSize;
    const y = r * gridSize;

    if (tile.type === 0) {
        ctx.clearRect(x, y, gridSize, gridSize);
    }
    else if (tile.type === 3) {
        ctx.fillStyle = white;
        ctx.fillRect(x, y, gridSize, gridSize);
    }
}
