import { sleep, draw, drawAll } from "../script.js";

export default async function randomizedKruskal(maze, showSteps, sleepTimeMS) {
    var numDistinctSets = Math.ceil(maze.rows / 2) * Math.ceil(maze.columns / 2);

    // Fill the entire maze with walls and set each tile's parentTile to itself
    for (var i = 0; i < maze.matrix.length; i++) {
        for (var j = 0; j < maze.matrix[i].length; j++) {
            maze.matrix[i][j].type = 3;
            maze.matrix[i][j].parentTile = maze.matrix[i][j];
        }
    }

    if (showSteps) {
        for (var i = 0; i < maze.matrix.length; i += 2) {
            for (var j = 0; j < maze.matrix[i].length; j += 2) {
                maze.matrix[i][j].checked = true;
            }
        }
        drawAll();
    }

    // Run while the entire maze isn't connected
    while (numDistinctSets > 1) {
        // Pick a random tile from the maze with an even row and column coordinate
        const randomRow = Math.floor(Math.random() * Math.ceil(maze.rows / 2)) * 2;
        const randomCol = Math.floor(Math.random() * Math.ceil(maze.columns / 2)) * 2;
        const randomTile = maze.matrix[randomRow][randomCol];

        // Get all adjacent tiles which are in distinct sets
        const tileType = randomTile.type;
        randomTile.type = 0;
        const adjTiles = maze.getAdjacent(randomTile, 2).filter((adjTile) => { return isDistinct(randomTile, adjTile) });
        randomTile.type = tileType;

        if (adjTiles.length > 0) {
            // Pick a random adjacent cell in a distinct set
            const randomIndex = Math.floor(Math.random() * adjTiles.length);
            const otherTile = adjTiles[randomIndex];

            // Join the two distinct tiles together
            const editedTiles = maze.editTilesBetween(randomTile, otherTile, 0);

            // Mark the passage as visited
            if (showSteps) {
                for (const editedTile of editedTiles) {
                    editedTile.visited = true;
                    draw(editedTile.row, editedTile.column);
                }
            }

            // Union the two tiles together into one set
            union(randomTile, otherTile);
            numDistinctSets--;

            if (showSteps) {
                await sleep(sleepTimeMS);
            }
        }
    }
}

/**
 * A function which finds the root tile of a tree of tiles using the parentTile property
 * @param {Tile} tile The tile to search
 * @returns {Tile} The root tile
 */
function findHeadTile(tile) {
    var headTile = tile;
    while (!headTile.parentTile.equals(headTile)) {
        headTile = headTile.parentTile;
    }
    return headTile;
}

/**
 * A function that unions two seperate tiles in seperate trees together
 * @param {Tile} tile1 The first tile
 * @param {Tile} tile2 The second tile
 */
function union(tile1, tile2) {
    const headTile1 = findHeadTile(tile1);
    const headTile2 = findHeadTile(tile2);
    headTile2.parentTile = headTile1;
}
 
/**
 * A function that checks if tile1 and tile2 belong to distinct sets based on the parentTile attribute
 * @param {Tile} tile1 The first tile
 * @param {Tile} tile2 The second tile
 * @returns {boolean} True if the tiles are in distinct sets and false otherwise
 */
function isDistinct(tile1, tile2) {
    const headTile1 = findHeadTile(tile1);
    const headTile2 = findHeadTile(tile2);
    return !headTile1.equals(headTile2);
}
