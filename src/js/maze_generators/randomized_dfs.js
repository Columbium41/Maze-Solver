import { sleep, draw, drawAll } from '../script.js';

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
    const initialTile = maze.matrix[randomRow][randomCol];

    // Push the starting tile to the stack
    initialTile.checked = true;
    initialTile.type = 0;
    stack.push(initialTile);

    if (showSteps) {
        drawAll();
    }

    while (stack.length > 0) {
        const currentTile = stack.pop();
        currentTile.visited = true;
        
        const adjTiles = maze.getAdjacent(currentTile, 2).filter((tile) => { return tile.type !== 0 });

        // Generate a path if there is a tile that hasn't been visited yet
        if (adjTiles.length > 0) {
            stack.push(currentTile);

            // Pick a random unvisited adjacent tile from the current tile
            const randomIndex = Math.floor(Math.random() * adjTiles.length);
            const randomTile = adjTiles[randomIndex];
            
            // Mark all tiles as visited
            if (showSteps) {
                for (const adjTile of adjTiles) {
                    adjTile.checked = true;
                    draw(adjTile.row, adjTile.column);
                }
            }
            
            // Make a passage between the currentTile and randomly selected unvisited adjacentTile
            const editedTiles = maze.editTilesBetween(currentTile, randomTile, 0);
            stack.push(randomTile);

            if (showSteps) {
                for (const editedTile of editedTiles) {
                    editedTile.visited = true;
                    draw(editedTile.row, editedTile.column);
                }
                await sleep(sleepTimeMS);
            }
        }
    }
}
