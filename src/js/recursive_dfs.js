import { sleep, draw } from './script.js';

/**
 * A search function that implements recursive DFS
 * @param {Maze} maze the maze the search
 * @param {boolean} showSteps whether to show the steps in the maze solving
 * @param {Tile} currentTile the current tile that is being searched
 * @param {Tile} destinationTile the destination tile in the maze
 * @param {Number} sleepTimeMS how long to animate each step in milliseconds 
 * @return {boolean} whether or not a path has been found
 */
export default async function RecursiveDFS(maze, showSteps, currentTile, destinationTile, sleepTimeMS) {
    
    currentTile.visited = true;
    if (currentTile.equals(destinationTile)) {  // Destination tile found
        return true;
    }

    if (showSteps) {
        draw(currentTile.row, currentTile.column);
        await sleep(sleepTimeMS);
    }

    // Iterate through each adjacent tile
    for (const adjTile of maze.getAdjacent(currentTile).reverse()) {
        if (!adjTile.visited && adjTile.type !== 3) {
            adjTile.parentTile = currentTile;
            const foundDestinationCallback = await RecursiveDFS(maze, showSteps, adjTile, destinationTile, sleepTimeMS);
            if (foundDestinationCallback) {
                return true;
            }
        } 
    }

    return false;

} 
