// DOCUMENT ELEMENTS
const navbar = document.getElementById('navbar');
const canvasContainer = document.getElementById('canvas-container');

const gridLinesCheckbox = document.getElementById('show-grid');
const showStepsCheckbox = document.getElementById('show-steps');
const wormholeIdRange = document.getElementById('wormhole-id');
const buttons = document.getElementsByClassName("button");

// CANVAS
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// MAZE VARIABLES
var showGrid = false;
var showSteps = false;
var wormholeId = 1;
var editMode = "Wall";
const gridSize = 30;
const numRows = Math.floor((canvasContainer.clientHeight-10) / gridSize);
const numColumns = Math.floor((canvasContainer.clientWidth-10) / gridSize);

canvas.width = gridSize * numColumns;
canvas.height = gridSize * numRows;
canvas.style.width = `${canvas.width}px`;
canvas.style.height = `${canvas.height}px`;

for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].id !== "solve-button") {
        buttons[i].addEventListener("click", (e) => {
            getEditMode(e);
        });
    }
}

function getCheckbox() {
    showGrid = gridLinesCheckbox.checked;
    showSteps = showStepsCheckbox.checked;
    drawAll();
}
function getWormholeId() {
    wormholeId = wormholeIdRange.value;
    wormholeIdRange.previousSibling.previousSibling.innerText = `wormhole id (${wormholeId}):`;
}
function getEditMode(e) {
    for (var i = 0; i < buttons.length; i++) {
        if (buttons[i].hasAttribute("data-active")) {
            buttons[i].removeAttribute("data-active");
        }
    }
    e.target.setAttribute("data-active", '');
    editMode = e.target.innerText;
}

function drawAll() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (showGrid) {
        ctx.lineWidth = 2;
        ctx.strokeStyle = "rgb(220, 220, 220)";
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
