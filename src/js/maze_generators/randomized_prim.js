import { sleep, draw, drawAll } from "../script.js";

/**
 * A function that generates a maze using randomized prim's algorithm
 * @param {Maze} maze the maze to modify
 * @param {boolean} showSteps whether to visualize the algorithm
 * @param {Number} sleepTimeMS how long to wait for each step in visualization
 */
export default async function randomizedPrim(maze, showSteps, sleepTimeMS) {
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
    const initialTile = maze.matrix[randomRow][randomCol];
    initialTile.type = 0;
    initialTile.checked = true;
    initialTile.visited = true;
    
    // Add the adjacent tiles to the tile list
    for (const adjTile of maze.getAdjacent(initialTile, 2)) {
        adjTile.checked = true;
        adjTile.parentTile = initialTile;
        tileList.push(adjTile);
    }

    if (showSteps) {
        drawAll();
    }

    while (tileList.length > 0) {
        // Pick a random element and remove it
        const randomIndex = Math.floor(Math.random() * tileList.length);
        const randomTile = tileList.splice(randomIndex, 1)[0];

        // Skip the tile if it has already been visited
        if (randomTile.visited) {
            continue;
        }
        randomTile.visited = true;

        // Make a passage between the chosen tile and its parent tile
        const editedTiles = maze.editTilesBetween(randomTile, randomTile.parentTile, 0);
        for (const editedTile of editedTiles) {
            editedTile.visited = true;

            if (showSteps) {
                draw(editedTile.row, editedTile.column);
            }
        }

        // Add the adjacent tiles to the tile list
        const adjTiles = maze.getAdjacent(randomTile, 2).filter((adjTile) => { return adjTile.type === 3 });
        for (const adjTile of adjTiles) {
            adjTile.checked = true;
            adjTile.parentTile = randomTile;
            tileList.push(adjTile);

            if (showSteps) {
                draw(adjTile.row, adjTile.column);
            }
        }

        if (showSteps) {
            await sleep(sleepTimeMS);
        }
    }

}