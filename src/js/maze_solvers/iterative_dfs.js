import { sleep, draw } from "../script.js";

/**
 * A search function that implements iterative DFS
 * @param {Maze} maze the maze the search
 * @param {boolean} showSteps whether to show the steps in the maze solving
 * @param {Tile} startTile the starting tile in the maze
 * @param {Tile} destinationTile the destination tile in the maze
 * @param {Number} sleepTimeMS how long to animate each step in milliseconds 
 * @return {boolean} whether or not a path has been found
 */
export default async function IterativeDFS(maze, showSteps, startTile, destinationTile, sleepTimeMS) {
    var stack = [];

    // Add the start tile to the top of the stack
    startTile.checked = true;
    startTile.visited = true;
    stack.push(startTile);

    // Loop while stack isn't empty and the destination has not been found
    while (stack.length > 0) {

        // Get the tile at the top of the stack and check if it has been visited
        const currentTile = stack.pop();
        currentTile.visited = true;

        if (showSteps) {
            draw(currentTile.row, currentTile.column);
        }
        
        // Iterate through each adjacent tile
        const adjTiles = maze.getAdjacent(currentTile, 1).filter((tile) => { return (!tile.checked && tile.type !== 3) })
        for (const adjTile of adjTiles) {
            adjTile.parentTile = currentTile;

            if (adjTile.equals(destinationTile)) {  // Found the destination tile
                return true;
            }
            else {  // Add tile to the top of the stack
                adjTile.checked = true;
                stack.push(adjTile);
            }

            if (showSteps) {
                draw(adjTile.row, adjTile.column);
            }
        }

        if (showSteps) {
            await sleep(sleepTimeMS);
        }

    }

    return false;
}