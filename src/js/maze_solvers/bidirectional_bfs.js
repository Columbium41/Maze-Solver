import { sleep, draw } from "../script.js";

/**
 * A search function that implements Bidirectional BFS
 * @param {Maze} maze the maze the search
 * @param {boolean} showSteps whether to show the steps in the maze solving
 * @param {Tile} startTile the starting tile in the maze
 * @param {Tile} destinationTile the destination tile in the maze
 * @param {Number} sleepTimeMS how long to animate each step in milliseconds 
 * @return {boolean} whether or not a path has been found
 */
export default async function BBFS(maze, showSteps, startTile, destinationTile, sleepTimeMS) {
    var startQueue = [];
    var destinationQueue = [];
    var searchDestination = false;

    // Add start and destination to their respective queues
    startTile.checked = true;
    startTile.visited = true;
    startTile.distance = 0;
    startTile.parentTile = 0;

    destinationTile.checked = true;
    destinationTile.visited = true;
    destinationTile.distance = 1;
    destinationTile.parentTile = 1;

    startQueue.push(startTile);
    destinationQueue.push(destinationTile);

    while (startQueue.length > 0 || destinationQueue.length > 0) {

        var currentTile;

        // Searching from Destination Tile
        if (searchDestination && destinationQueue.length > 0) { 
            currentTile = destinationQueue.shift();
            currentTile.visited = true;

            for (const adjTile of maze.getAdjacent(currentTile, 1)) {
                if (adjTile.distance !== 1 && adjTile.type !== 3) {
                    if (adjTile.distance === 0) {  // adjTile belongs to start path
                        // Reconstruct path from the destination tile to the adjTile
                        unionPaths(adjTile, currentTile, null, 1);

                        return true;
                    }
                    else {
                        adjTile.parentTile = currentTile;
                        adjTile.checked = true;
                        adjTile.distance = 1;
                        destinationQueue.push(adjTile);
                    }

                    if (showSteps) {
                        draw(adjTile.row, adjTile.column);
                    }
                }
            }
        }

        // Searching from Start Tile
        else if (startQueue.length > 0) {
            currentTile = startQueue.shift();
            currentTile.visited = true;
                        
            for (const adjTile of maze.getAdjacent(currentTile, 1)) {
                if (adjTile.distance !== 0 && adjTile.type !== 3) {
                    if (adjTile.distance === 1) {  // adjTile belongs to destination path
                        // Reconstruct path from the destination tile to the adjTile
                        unionPaths(currentTile, adjTile, null, 1);

                        return true;
                    }
                    else {
                        adjTile.parentTile = currentTile;
                        adjTile.checked = true;
                        adjTile.distance = 0;
                        startQueue.push(adjTile);
                    }

                    if (showSteps) {
                        draw(adjTile.row, adjTile.column);
                    }
                }
            }
        }

        if (showSteps) {
            draw(currentTile.row, currentTile.column);
            await sleep(sleepTimeMS);
        }

        searchDestination = !searchDestination;

    }

    return false;
}

/**
 * A function which reverses the ordering of parentTiles assuming each tile has exactly one child
 * @param {Tile} prev The tile to connect the current tile's parent tile to
 * @param {Tile} current The tile to start reversing at
 * @param {Tile} next A null pointer
 * @param {Number} terminate What value to terminate the reversing
 */
function unionPaths(prev, current, next, terminate) {
    while (current !== terminate) {
        next = current.parentTile;
        current.parentTile = prev;
        prev = current;
        current = next;
    }
}

