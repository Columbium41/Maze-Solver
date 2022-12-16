import { sleep, draw } from './script.js';

/**
 * A search function that implements iterative BFS
 * @param {Maze} maze the maze the search
 * @param {boolean} showSteps whether to show the steps in the maze solving
 * @param {Tile} startTile the starting tile in the maze
 * @param {Tile} destinationTile the destination tile in the maze
 * @param {Number} sleepTimeMS how long to animate each step in milliseconds 
 * @return {boolean} whether or not a path has been found
 */
export default async function IterativeBFS(maze, showSteps, startTile, destinationTile, sleepTimeMS) {
    var queue = [];

    // Add start tile to queue
    startTile.checked = true;
    queue.push(startTile);

    while (queue.length > 0) {

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
                    return true;
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

    return false;
}