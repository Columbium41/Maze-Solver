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
export default async function BFS(maze, showSteps, startTile, destinationTile, sleepTimeMS) {
    var queue = [];

    // Add start tile to queue
    startTile.visited = true;
    startTile.checked = true;
    queue.push(startTile);

    while (queue.length > 0) {

        const currentTile = queue.shift();
        currentTile.visited = true;

        if (showSteps) {
            draw(currentTile.row, currentTile.column);
        }

        // Iterate through each adjacent tile
        const adjTiles = maze.getAdjacent(currentTile, 1).filter((tile) => { return (!tile.checked && tile.type !== 3) })
        for (const adjTile of adjTiles) {
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

        if (showSteps) {
            await sleep(sleepTimeMS);
        }

    }

    return false;
}