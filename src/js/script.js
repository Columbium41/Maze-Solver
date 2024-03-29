import Maze from "./classes/maze.js";
import Tile from "./classes/tile.js";

import IterativeDFS from "./maze_solvers/iterative_dfs.js";
import BFS from "./maze_solvers/iterative_bfs.js";
import randomizedPrim from "./maze_generators/randomized_prim.js";
import BBFS from "./maze_solvers/bidirectional_bfs.js";
import randomizedDFS from "./maze_generators/randomized_dfs.js";
import randomizedKruskal from "./maze_generators/randomized_kruskal.js";
import aldous_broder from "./maze_generators/aldous-broder_algorithm.js";
import A_star from "./maze_solvers/A_star.js";

// COLORS
const white = "rgb(220, 220, 220)";
const green = "rgb(40, 190, 40)";
const red = "rgb(190, 40, 40)";
const orange = "rgb(210, 125, 30)";
const yellow = "rgb(230, 200, 40)";
const purple = "rgb(150, 15, 175)";

// DOCUMENT ELEMENTS
const mazeSettings = document.getElementById('maze-settings');
const canvasContainer = document.getElementById('canvas-container');

const gridLinesCheckbox = document.getElementById('show-grid');
const visualizeStepsCheckbox = document.getElementById('visualize-steps');
const buttons = document.getElementsByClassName("button");
const editButtons = document.getElementsByClassName('edit-button');
const deleteAllButton = document.getElementById('delete-all-button');
const solveMazeButton = document.getElementById('solve-button');
const solveAlgorithmSelect = document.getElementById('solve-maze-select');
const generateMazeButton = document.getElementById('generate-button');
const generateAlgorithmSelect = document.getElementById('generate-maze-select');
const visualizationDelayRange = document.getElementById('visualize-delay-input');
const gridSizeRange = document.getElementById('grid-size-input');
const pathLengthLabel = document.getElementById('path-length');
const menuButton = document.getElementById('menu-button');

// CANVAS
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// MAZE VARIABLES
var showGrid = gridLinesCheckbox.checked;
var showSteps = visualizeStepsCheckbox.checked;
var editMode = "Start Block";
var mouseDown = false;
var finishedSolving = false;
var gridSize = 30;
var numRows;
var numColumns;
var sleepTimeMS = visualizationDelayRange.value;
var menuOpened = false;

var maze = new Maze(numRows, numColumns);
var idle = true;

menuButton.onclick = () => {
    menuOpened = !menuOpened;
    if (menuOpened) {
        mazeSettings.setAttribute("open", "true");
    }
    else {
        mazeSettings.setAttribute("open", "false");
    }
}

// Add a listener to the window to resize the canvas each time the window is resized
var resizeTimer;
window.onresize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initMaze(), 250);
};

// Add event listeners to buttons
for (var i = 0; i < editButtons.length; i++) {
    editButtons[i].addEventListener("click", (e) => {
        getEditMode(e);
    });
    
}
deleteAllButton.addEventListener("click", () => {  // Delete All Button
    maze.clear();
    drawAll();
});
solveMazeButton.addEventListener("click", () => {  // Solve Maze Button
    startSolve();
}); 
generateMazeButton.addEventListener("click", () => {  // Generate Button
    startGenerate();
});

// Add event listeners to range input
visualizationDelayRange.oninput = () => {
    sleepTimeMS = visualizationDelayRange.value;
    visualizationDelayRange.previousSibling.previousSibling.innerText = `Delay (${sleepTimeMS}ms):`;
};
gridSizeRange.oninput = () => {
    gridSizeRange.previousSibling.previousSibling.innerText = `Tile Size (${gridSizeRange.value}px):`;
};
gridSizeRange.onmouseup = () => {
    gridSize = gridSizeRange.value;
    initMaze();
};
gridSizeRange.ontouchend = () => {
    gridSize = gridSizeRange.value;
    initMaze();
};

// Add event listeners to checkboxes
gridLinesCheckbox.addEventListener("click", () => {
    showGrid = gridLinesCheckbox.checked;
    drawAll();
});
visualizeStepsCheckbox.addEventListener("click", () => {
    showSteps = visualizeStepsCheckbox.checked;
});

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
 * A function which initializes a new maze
 */
function initMaze() {
    const newNumRows = Math.floor((canvasContainer.clientHeight-10) / gridSize);
    const newNumColumns = Math.floor((canvasContainer.clientWidth-10) / gridSize);

    // Check if resizing the window changes the number of tiles, create a new maze if it does
    if (idle && ((numRows === undefined || numColumns === undefined) || (numRows !== newNumRows || numColumns !== newNumColumns))) {    
        numRows = newNumRows;
        numColumns = newNumColumns;

        finishedSolving = false;

        canvas.width = gridSize * numColumns;
        canvas.height = gridSize * numRows;
        canvas.style.width = `${canvas.width}px`;
        canvas.style.height = `${canvas.height}px`;
        pathLengthLabel.innerText = `Path Length: N/A`;

        if (window.innerWidth <= 800) {
            mazeSettings.setAttribute("open", "false");
            menuOpened = false;
        }
        else {
            mazeSettings.setAttribute("open", "true");
            menuOpened = true;
        }

        maze = new Maze(numRows, numColumns);
        enableMenu();
        drawAll();
    }
}

/**
 * A function that updates the maze edit mode
 * @param {PointerEvent} e The Click Event Information
 */
function getEditMode(e) {
    if (finishedSolving) {
        pathLengthLabel.innerText = `Path Length: N/A`;
        drawAll();
        finishedSolving = false;
    }
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
            if (typeNumber === 0 || finishedSolving) {
                pathLengthLabel.innerText = `Path Length: N/A`;
                drawAll();
                finishedSolving = false;
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
    if (!maze.tileValid(r, c)) {
        throw new Error("Invalid Tile");
    }

    const tile = maze.matrix[r][c];

    const x = c * gridSize;
    const y = r * gridSize;

    if (tile.type === 1) {  // Start Block
        ctx.fillStyle = green;
        ctx.fillRect(x, y, gridSize, gridSize);
    }
    else if (tile.type === 2) {  // Destination Block
        ctx.fillStyle = red;
        ctx.fillRect(x, y, gridSize, gridSize);
    }
    else if (tile.inPath && tile.type === 0) {  // Tile is a part of the path
        ctx.fillStyle = purple;
        ctx.fillRect(x, y, gridSize, gridSize);
    }
    else if (tile.visited && showSteps) {  // Tile has been visited
        ctx.fillStyle = orange;
        ctx.fillRect(x, y, gridSize, gridSize);
    }
    else if (tile.checked && showSteps) {  // Tile has been checked
        ctx.fillStyle = yellow;
        ctx.fillRect(x, y, gridSize, gridSize);
    }
    else if (tile.type === 0) {  // Empty Tile
        ctx.clearRect(x, y, gridSize, gridSize);
    }
    else if (tile.type === 3) {  // Wall
        ctx.fillStyle = white;
        ctx.fillRect(x, y, gridSize, gridSize);
    }
}

/**
 * A function that starts solving the maze based on the selected algorithm
 */
async function startSolve() {
    if (window.innerWidth <= 800) {
        mazeSettings.setAttribute("open", "false");
        menuOpened = false;
    }

    const startTile = maze.getTile(1);
    const destinationTile = maze.getTile(2);

    // Check if maze contains start and destination tile
    if (startTile !== null && destinationTile !== null) {
        
        idle = false;
        drawAll();
        disableMenu();
        const algorithm = solveAlgorithmSelect.value;
        var solved;

        switch (algorithm) {
            case "DFS":
                solved = await IterativeDFS(maze, showSteps, startTile, destinationTile, sleepTimeMS);
                break;
            case "BFS":
                solved = await BFS(maze, showSteps, startTile, destinationTile, sleepTimeMS);
                break;
            case "BBFS":
                solved = await BBFS(maze, showSteps, startTile, destinationTile, sleepTimeMS);
                break;
            case "A-star":
                solved = await A_star(maze, showSteps, startTile, destinationTile, sleepTimeMS);
                break;
        }

        if (solved) {  // Maze was solved
            const pathLength = await reconstructPath(startTile, destinationTile);
            pathLengthLabel.innerText = `Path Length: ${pathLength}`;
            if (!showSteps) {
                drawAll();
            }
        }
        else {  // Maze has no solution
            pathLengthLabel.innerText = `Path Length: N/A`;
            alert("Maze cannot be solved!");
        }

        finishedSolving = true;
        maze.resetTiles();
        enableMenu();
        idle = true;
    }
    else {
        alert("Please put down a start and destination tile.");
    }
}

/**
 * A function that handles generating a maze based on user input
 */
async function startGenerate() {
    if (window.innerWidth <= 800) {
        mazeSettings.setAttribute("open", "false");
        menuOpened = false;
    }

    idle = false;
    const algorithm = generateAlgorithmSelect.value;

    maze.clear();
    drawAll();
    disableMenu();

    switch(algorithm) {
        case "random-prim":
            await randomizedPrim(maze, showSteps, sleepTimeMS);
            break;
        case "random-kruskal":
            await randomizedKruskal(maze, showSteps, sleepTimeMS);
            break;
        case "random-dfs":
            await randomizedDFS(maze, showSteps, sleepTimeMS);
            break;
        case "aldous-broder":
            await aldous_broder(maze, showSteps, sleepTimeMS);
            break;
    }

    maze.resetTiles();
    drawAll();
    enableMenu();
    idle = true;
}

/**
 * A function that reconstructs the path from the start to destination tile
 * @param {Tile} start The start tile in the maze
 * @param {Tile} destination The destination tile in the maze
 * @returns {Number} The path length
 */
async function reconstructPath(start, destination) {
    const pathDrawDelay = Math.min(sleepTimeMS, 30);
    var count = 0;

    // Set the destination tile as part of the path
    var currentTile = destination;
    destination.inPath = true;
    if (showSteps) {
        draw(currentTile.row, currentTile.column);
        await sleep(pathDrawDelay);
    }

    // Backtrack from the destination tile to the start tile
    while (!currentTile.equals(start)) {
        currentTile = maze.matrix[currentTile.parentTile.row][currentTile.parentTile.column];
        currentTile.inPath = true;

        if (showSteps) {
            draw(currentTile.row, currentTile.column);
            await sleep(pathDrawDelay);
        }
        count++;
    }

    return count;
}

/**
 * A function that disables all menu buttons
 */
function enableMenu() {
    const allButtons = document.getElementsByClassName('button');
    for (var i = 0; i < allButtons.length; i++) {
        allButtons[i].removeAttribute('disabled');
    }
    solveAlgorithmSelect.removeAttribute('disabled');
    visualizationDelayRange.removeAttribute('disabled');
    gridLinesCheckbox.removeAttribute('disabled');
    visualizeStepsCheckbox.removeAttribute('disabled');
    generateAlgorithmSelect.removeAttribute('disabled');
    gridSizeRange.removeAttribute('disabled');
}

/**
 * A function that enables all menu buttons
 */
function disableMenu() {
    const allButtons = document.getElementsByClassName('button');
    for (var i = 0; i < allButtons.length; i++) {
        allButtons[i].setAttribute('disabled', '');
    }
    solveAlgorithmSelect.setAttribute('disabled', '');
    visualizationDelayRange.setAttribute('disabled', '');
    gridLinesCheckbox.setAttribute('disabled', '');
    visualizeStepsCheckbox.setAttribute('disabled', '');
    generateAlgorithmSelect.setAttribute('disabled', '');
    gridSizeRange.setAttribute('disabled', '');
}

/**
 * A function that waits a specified amount of time and returns a promise afterwards
 * @param {Number} ms The amount of time to sleep in milliseconds
 * @returns {Promise} A promise object
 */
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Initialize the maze
initMaze();

export { sleep, draw, drawAll };
