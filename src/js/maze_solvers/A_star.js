import { sleep, draw } from "../script.js";
import { PriorityQueue, QueueElement } from "../classes/priorityQueue.js";

export default async function A_star(maze, showSteps, startTile, destinationTile, sleepTimeMS) {
    
    var pq = new PriorityQueue();

    // Add start tile to priority queue
    pq.enqueue(new QueueElement(startTile, getHeuristic(startTile, destinationTile)));
    startTile.checked = true;
    startTile.distance = 0;

    // Run while the priority queue isn't empty
    while (!pq.isEmpty()) {

        // Remove the tile with the lowest value and check if it has already been visited
        const currentTile = pq.dequeue().element;
        if (currentTile.visited) {
            continue;
        }
        currentTile.visited = true;

        // Iterate through each neighbor of currentTile
        const adjTiles = maze.getAdjacent(currentTile, 1).filter((adjTile) => { return adjTile.type !== 3 });
        for (const adjTile of adjTiles) {
            if (adjTile.equals(destinationTile)) {  // Found destination tile
                adjTile.parentTile = currentTile;
                return true;
            }
            // Tile has not been visited or tile has a faster path
            else if (adjTile.distance === Number.MAX_SAFE_INTEGER || currentTile.distance + 1 < adjTile.distance) {
                adjTile.distance = currentTile.distance + 1;
                const value = adjTile.distance + getHeuristic(adjTile, destinationTile);

                pq.enqueue(new QueueElement(adjTile, value));
                adjTile.checked = true;
                adjTile.parentTile = currentTile;
            }

            if (showSteps) {
                draw(adjTile.row, adjTile.column);
            }
        }

        if (showSteps) {
            draw(currentTile.row, currentTile.column);
            await sleep(sleepTimeMS);
        }

    }

    return false;  // Destination tile not found
}

/**
 * A function that calculates a heuristic value of a tile with respect to the destination tile
 * Function calculates heuristic value based on the Manhattan distance between tile and destinationTile
 * @param {Tile} tile the tile to get the heuristic value of
 * @param {Tile} destinationTile the destination in the maze
 */
function getHeuristic(tile, destinationTile) {
    return (Math.abs(tile.row - destinationTile.row) + Math.abs(tile.column - destinationTile.column));
}
