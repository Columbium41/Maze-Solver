import { sleep, draw, drawAll } from './script.js';

/**
 * A function that generates a maze using randomized Depth-First Search
 * @param {Maze} maze the maze to modify
 * @param {boolean} showSteps whether to visualize the algorithm
 * @param {Number} sleepTimeMS how long to wait for each step in visualization
 */
export default async function randomizedDFS(maze, showSteps, sleepTimeMS) {

    var stack = [];

    // Fill all cells in the maze as walls
    for (var i = 0; i < maze.matrix.length; i++) {
        for (var j = 0; j < maze.matrix[i].length; j++) {
            maze.matrix[i][j].type = 3;
        }
    }

    // Pick a random tile and mark it as part of the maze
    const randomRow = Math.floor(Math.random() * maze.rows);
    const randomCol = Math.floor(Math.random() * maze.columns);
    const randomTile = maze.matrix[randomRow][randomCol];

    // Push the starting tile to the stack
    randomTile.checked = true;
    randomTile.type = 0;
    stack.push(randomTile);

    if (showSteps) {
        drawAll();
    }

    while (stack.length > 0) {
        const currentTile = stack.pop();
        currentTile.visited = true;
        
        const adjTiles = maze.getAdjacent(currentTile, 2).filter((tile) => { return !tile.checked });

        if (adjTiles.length > 0) {
            stack.push(currentTile);

            // Pick a random unvisited adjacent tile from currentTile
            const randomIndex = Math.floor(Math.random() * adjTiles.length);
            const tile = adjTiles[randomIndex];
            tile.checked = true;
            
            const edited = maze.editTilesBetween(currentTile, tile, 0);
            stack.push(tile);

            if (showSteps) {
                for (const editedTile of edited) {
                    editedTile.visited = true;
                    draw(editedTile.row, editedTile.column);
                }
                await sleep(sleepTimeMS);
            }
        }
    }
}
