import { sleep, draw, drawAll } from './script.js';

/**
 * A function that generates a maze using randomized prim's algorithm
 * @param {Maze} maze the maze to modify
 * @param {boolean} showSteps whether to visualize the algorithm
 * @param {Number} sleepTimeMS how long to wait for each step in visualization
 */
export default async function RandomPrim(maze, showSteps, sleepTimeMS) {
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