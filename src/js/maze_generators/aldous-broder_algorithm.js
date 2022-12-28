import { sleep, draw, drawAll } from "../script.js";

export default async function aldous_broder(maze, showSteps, sleepTimeMS) {
    // Fill the maze with walls
    for (var i = 0; i < maze.matrix.length; i++) {
        for (var j = 0; j < maze.matrix[i].length; j++) {
            maze.matrix[i][j].type = 3;
        }
    }

    // Pick a random tile to be a part of the maze
    const randomRow = Math.floor(Math.random() * maze.rows);
    const randomCol = Math.floor(Math.random() * maze.columns);
    const initialTile = maze.matrix[randomRow][randomCol];
    initialTile.type = 0;
    initialTile.visited = true;
    initialTile.checked = true;

    // Calculate the number of unvisited tiles
    var numRowTiles = 0;
    var numColTiles = 0;
    for (var i = randomRow; i >= 0; i -= 2) {
        numRowTiles++;
    }
    for (var i = randomRow + 2; i < maze.rows; i += 2) {
        numRowTiles++;
    }
    for (var i = randomCol; i >= 0; i -= 2) {
        numColTiles++;
    }
    for (var i = randomCol + 2; i < maze.columns; i += 2) {
        numColTiles++;
    }
    var unvisitedTiles = (numRowTiles * numColTiles) - 1;

    var currentTile = initialTile;

    if (showSteps) {
        drawAll();
    }

    // loop while there are unvisited tiles
    while (unvisitedTiles > 0) {
        // Pick a random neighbor
        const adjTiles = maze.getAdjacent(currentTile, 2);
        const randomIndex = Math.floor(Math.random() * adjTiles.length);
        const randomTile = adjTiles[randomIndex];

        if (randomTile.type !== 0) {
            // Mark a passage between the random tile and the current tile
            const editedTiles = maze.editTilesBetween(currentTile, randomTile, 0);
            unvisitedTiles--;

            // Animate step
            if (showSteps) {
                for (const editedTile of editedTiles) {
                    editedTile.visited = true;
                    draw (editedTile.row, editedTile.column);
                }
                await sleep(sleepTimeMS);
            }
        }

        // Make the random tile the current tile
        currentTile = randomTile;

        console.log(unvisitedTiles);
    }
}
