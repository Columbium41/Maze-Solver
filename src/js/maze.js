import Tile from "./tile.js";

export default class Maze {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;
        this.matrix = [];
        this.clear();
    }

    /**
     * A method that returns a tile with the specified tile type
     * @param {Number} tileType The tile type to search
     * @returns {Tile} The first tile in the maze with the specified tile type
     */
    getTile(tileType) {
        for (var i = 0; i < this.matrix.length; i++) {
            for (var j = 0; j < this.matrix[i].length; j++) {
                if (this.matrix[i][j].type === tileType) {
                    return this.matrix[i][j];
                }
            }
        }
        return null;
    }
    
    /**
     * A method that returns the number of tiles with the specified tile type
     * @param {Number} tileType The tile type to search
     * @returns {Number} The number of tiles with the specified tile type 
     */
    getNumTileType(tileType) {
        var count = 0;
        for (var i = 0; i < this.matrix.length; i++) {
            for (var j = 0; j < this.matrix[i].length; j++) {
                if (this.matrix[i][j].type === tileType) {
                    count++;
                }
            }
        }
        return count
    }

    /**
     * A method that returns an array of adjacent tiles given a row and column
     * @param {Number} r The row of the tile
     * @param {Number} c The column of the tile
     * @returns {Array} An array of adjacent tiles
     */
    getAdjacent(r, c) {
        var adjacentTiles = [];

        // Check if the current tile is valid
        if (this.tileValid(r, c)) {
            const tile = this.matrix[r][c];
            
            if (tile.type === 4 && this.tileValid(r, c - 1)) {  // left push
                adjacentTiles.push(this.matrix[r][c - 1]);
            }
            else if (tile.type === 5 && this.tileValid(r, c + 1)) {  // right push
                adjacentTiles.push(this.matrix[r][c + 1]);
            }
            else if (tile.type === 6 && this.tileValid(r - 1, c)) {  // up push
                adjacentTiles.push(this.matrix[r - 1][c]);
            }
            else if (tile.type === 7 && this.tileValid(r + 1, c)) {  // down push
                adjacentTiles.push(this.matrix[r + 1][c]);
            }
            else if (tile.type === 8) {  // TODO: wormhole
                
            }

            else if (tile.type === 0 || tile.type == 1) {  // empty tile or start tile
                if (this.tileValid(r, c - 1)) {
                    adjacentTiles.push(this.matrix[r][c - 1]);
                }
                if (this.tileValid(r, c + 1)) {
                    adjacentTiles.push(this.matrix[r][c + 1]);
                }
                if (this.tileValid(r - 1, c)) {
                    adjacentTiles.push(this.matrix[r - 1][c]);
                }
                if (this.tileValid(r + 1, c)) {
                    adjacentTiles.push(this.matrix[r + 1][c]);
                }
            }

        }

        return adjacentTiles;
    }

    /**
     * A method that checks if a specified row and column is in the maze and is not a wall
     * @param {Number} r The row of the tile
     * @param {Number} c The column of the tile
     * @returns {boolean} Whether the tile is valid or not
     */
    tileValid(r, c) {
        return (r >= 0 && c >= 0 && r < this.rows && c < this.columns && this.matrix[r][c].type !== 3);
    }

    /**
     * A method that clears all tiles from the maze
     */
    clear() {
        for (var i = 0; i < this.rows; i++) {
            this.matrix[i] = [];
            for (var j = 0; j < this.columns; j++) {
                this.matrix[i][j] = new Tile(i, j, 0);
            }
        }
    }

    /**
     * A method that resets all tiles' visited, checked, and parentTile data
     */
    resetTiles() {
        for (var i = 0; i < this.matrix.length; i++) {
            for (var j = 0; j < this.matrix[i].length; j++) {
                this.matrix[i][j].checked = false;
                this.matrix[i][j].visited = false;
                this.matrix[i][j].inPath = false;
                this.matrix[i][j].parentTile = null;
            }
        }
    }
}
