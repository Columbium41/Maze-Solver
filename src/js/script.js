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
const visualizeStepsCheckbox = document.getElementById('visualize-steps');
const buttons = document.getElementsByClassName("button");
const deleteAllButton = document.getElementById('delete-all-button');
const solveMazeButton = document.getElementById('solve-button');
const solveAlgorithmSelect = document.getElementById('solve-maze-select');
const generateMazeButton = document.getElementById('generate-button');
const generateAlgorithmSelect = document.getElementById('generate-maze-select');
const visualizationDelayRange = document.getElementById('visualize-delay-input');

// CANVAS
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// MAZE VARIABLES
var showGrid = gridLinesCheckbox.checked;
var showSteps = visualizeStepsCheckbox.checked;
var editMode = "Start Block";
var mouseDown = false;
var finishedAlgorithm = false;
const gridSize = 25;
const numRows = Math.floor((canvasContainer.clientHeight-10) / gridSize);
const numColumns = Math.floor((canvasContainer.clientWidth-10) / gridSize);
var sleepTimeMS = visualizationDelayRange.value;

canvas.width = gridSize * numColumns;
canvas.height = gridSize * numRows;
canvas.style.width = `${canvas.width}px`;
canvas.style.height = `${canvas.height}px`;

var maze = new Maze(numRows, numColumns);

// Add event listeners to buttons
for (var i = 0; i < buttons.length; i++) {
    if (buttons[i].id !== "solve-button" && buttons[i].id !== "delete-all-button" && buttons[i].id !== "generate-button") {
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
generateMazeButton.addEventListener("click", () => {
    startGenerate();
});

// Add event listeners to range input
visualizationDelayRange.oninput = () => {
    sleepTimeMS = visualizationDelayRange.value;
    visualizationDelayRange.previousSibling.previousSibling.innerText = `Delay: (${sleepTimeMS}ms)`;
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
 * A function that updates the maze edit mode
 * @param {PointerEvent} e The Click Event Information
 */
function getEditMode(e) {
    if (finishedAlgorithm) {
        drawAll();
        finishedAlgorithm = false;
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

        const startTile = maze.getTile(1);
        const destinationTile = maze.getTile(2);

        drawAll();
        disableMenu();
        const solveAlgorithm = solveAlgorithmSelect.value;
        var solved;
        switch (solveAlgorithm) {
            case "I_DFS":
                solved = await IterativeDFS(startTile, destinationTile);
                break;
            case "I_BFS":
                solved = await IterativeBFS(startTile, destinationTile);
                break;
            case "R_DFS":
                solved = await RecursiveDFS(startTile, destinationTile);
                break;
        }

        if (solved) {
            reconstructPath(startTile, destinationTile);
            drawAll();
        }
        else {
            alert("Maze cannot be solved!");
        }

        finishedAlgorithm = true;
        maze.resetTiles();
        enableMenu();
    }
    else {
        alert("Please put down a start and destination tile.");
    }
}

/**
 * A function that handles generating a maze based on user input
 */
async function startGenerate() {
    const generateAlgorithm = generateAlgorithmSelect.value;

    maze.clear();
    drawAll();
    disableMenu();

    switch(generateAlgorithm) {
        case "random-prim":
            await RandomPrim();
            break;
    }

    maze.resetTiles();
    drawAll();
    enableMenu();
}

/**
 * A search function that implements iterative DFS
 * @param {Tile} startTile the starting tile in the maze
 * @param {Tile} destinationTile the destination tile in the maze
 * @return {boolean} whether or not a path has been found
 */
async function IterativeDFS(startTile, destinationTile) {
    var stack = [];
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
        const adjacentTiles = maze.getAdjacent(currentTile);
        for (const adjTile of adjacentTiles) {
            if (!adjTile.checked && adjTile.type !== 3) {  // Tile hasn't been checked
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
                }
            }
        }
    }
    return foundDestination;
}

/**
 * A search function that implements recursive DFS
 * @param {Tile} startTile the starting tile in the maze
 * @param {Tile} destinationTile the destination tile in the maze
 * @return {boolean} whether or not a path has been found
 */
async function RecursiveDFS(currentTile, destinationTile) {

    currentTile.visited = true;
    if (currentTile.equals(destinationTile)) {  // Destination tile found
        return true;
    }

    if (showSteps) {
        draw(currentTile.row, currentTile.column);
        await sleep(sleepTimeMS);
    }

    // Iterate through each adjacent tile
    const adjacentTiles = maze.getAdjacent(currentTile);
    for (const adjTile of adjacentTiles) {
        if (!adjTile.visited && adjTile.type !== 3) {
            adjTile.parentTile = currentTile;
            const foundDestinationCallback = await RecursiveDFS(adjTile, destinationTile)
            if (foundDestinationCallback) {
                return true;
            }
        } 
    }

    return false;

} 

/**
 * A search function that implements iterative BFS
 * @param {Tile} startTile the starting tile in the maze
 * @param {Tile} destinationTile the destination tile in the maze
 * @return {boolean} whether or not a path has been found
 */
async function IterativeBFS(startTile, destinationTile) {
    var queue = [];
    var foundDestination = false;

    // Add start tile to queue
    startTile.checked = true;
    queue.push(startTile);

    while (queue.length > 0 && !foundDestination) {

        const currentTile = queue.shift();
        if (currentTile.visited) {
            continue;
        }
        currentTile.visited = true;

        if (showSteps) {
            draw(currentTile.row, currentTile.column);
            await sleep(sleepTimeMS);
        }

        // Iterate through each adjacent tile
        const adjacentTiles = maze.getAdjacent(currentTile);
        for (const adjTile of adjacentTiles) {
            if (!adjTile.checked && adjTile.type !== 3) {  // Tile hasn't been checked
                adjTile.parentTile = currentTile;

                if (adjTile.equals(destinationTile)) {  // Found the destination tile
                    foundDestination = true;
                }
                else {  // Add tile to the end of the queue
                    adjTile.checked = true;
                    queue.push(adjTile);
                }

                if (showSteps) {
                    draw(adjTile.row, adjTile.column);
                }
            }
        }

    }
    return foundDestination;
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
}

/**
 * A function that generates a maze using randomized prim's algorithm
 */
async function RandomPrim() {
    var tileList = [];

    // fill all cells with walls
    for (var i = 0; i < maze.matrix.length; i++) {
        for (var j = 0; j < maze.matrix[i].length; j++) {
            maze.matrix[i][j].type = 3;
        }
    }

    // Pick a random tile and mark it as part of the maze
    const randomRow = Math.floor(Math.random() * maze.rows);
    const randomCol = Math.floor(Math.random() * maze.columns);
    const randomTile = maze.matrix[randomRow][randomCol];
    randomTile.type = 0;
    randomTile.checked = true;
    randomTile.visited = true;
    
    // Add the adjacent tiles to the tile list
    for (const adjTile of maze.getAdjacent(randomTile)) {
        adjTile.checked = true;
        tileList.push(adjTile);
    }

    if (showSteps) {
        drawAll();
    }

    while (tileList.length > 0) {

        // Pick a random element and remove it
        const randomIndex = Math.floor(Math.random() * tileList.length);
        const tile = tileList.splice(randomIndex, 1)[0];
        tile.visited = true;

        // Get the number of empty tiles around the tile
        tile.type = 0;
        var numEmptyTiles = 0;
        const adjacentTiles = maze.getAdjacent(tile);
        for (const adjTile of adjacentTiles) {
            if (adjTile.type === 0) {
                numEmptyTiles++;
            }
        }
        tile.type = 3;

        // Add adjacent tiles to the list if the number of adjacent empty tiles is 1
        if (numEmptyTiles === 1) {
            tile.type = 0;
            for (const adjTile of adjacentTiles) {
                if (!adjTile.checked) {
                    adjTile.checked = true;
                    tileList.push(adjTile);
                }
            }
        }

        if (showSteps) {
            draw(tile.row, tile.column);
            await sleep(sleepTimeMS);
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
