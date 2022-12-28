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
     * @param {Tile} tile A Tile in the maze
     * @param {Number} d How far to search away
     * @returns {Array} An array of adjacent tiles
     */
    getAdjacent(tile, d) {
        const r = tile.row;
        const c = tile.column;
        var adjacentTiles = [];

        // Check if the current tile is valid
        if (this.tileValid(r, c) && tile.type !== 3) { 
            if (this.tileValid(r, c - d)) {
                adjacentTiles.push(this.matrix[r][c - d]);
            }
            if (this.tileValid(r, c + d)) {
                adjacentTiles.push(this.matrix[r][c + d]);
            }
            if (this.tileValid(r - d, c)) {
                adjacentTiles.push(this.matrix[r - d][c]);
            }
            if (this.tileValid(r + d, c)) {
                adjacentTiles.push(this.matrix[r + d][c]);
            }
        }

        return adjacentTiles;
    }

    /**
     * A method that edits tiles between tile1 and tile2
     * Precondition: tile1 and tile2 are on the same row or same column and tile1 is not equal to tile2
     * @param {Tile} tile1 The first tile
     * @param {Tile} tile2 The second tile
     * @param {Number} tileType The type to modify the tiles
     * @returns {Array} An array containing all tiles that were edited
     */
    editTilesBetween(tile1, tile2, tileType) {
        const diff_x = tile2.column - tile1.column;
        const diff_y = tile2.row - tile1.row;

        if (diff_x !== 0 && diff_y !== 0) {
            return [];
        }

        var i;
        var j;
        var editingRow;

        if (diff_x > 0) {
            i = tile1.column;
            j = tile2.column;
            editingRow = true;
        }
        else if (diff_x < 0) {
            i = tile2.column;
            j = tile1.column;
            editingRow = true;
        }
        else if (diff_y > 0) {
            i = tile1.row;
            j = tile2.row;
            editingRow = false;
        }
        else if (diff_y < 0) {
            i = tile2.row;
            j = tile1.row;
            editingRow = false;
        }
        
        var editedTiles = [];
        if (editingRow) {
            for (var index = i; index <= j; index++) {
                this.matrix[tile1.row][index].type = tileType;
                editedTiles.push(this.matrix[tile1.row][index]);
            }
        }
        else {
            for (var index = i; index <= j; index++) {
                this.matrix[index][tile1.column].type = tileType;
                editedTiles.push(this.matrix[index][tile1.column]);
            }
        }

        return editedTiles;

    }

    /**
     * A method that checks if a specified row and column is in the maze
     * @param {Number} r The row of the tile
     * @param {Number} c The column of the tile
     * @returns {boolean} Whether the tile is valid or not
     */
    tileValid(r, c) {
        return (r >= 0 && c >= 0 && r < this.rows && c < this.columns);
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
                this.matrix[i][j].distance = Number.MAX_SAFE_INTEGER;
                this.matrix[i][j].parentTile = null;
            }
        }
    }
}
