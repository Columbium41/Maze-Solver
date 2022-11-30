import Tile from "./tile.js";

export default class Maze {
    constructor(rows, columns) {
        this.rows = rows;
        this.columns = columns;

        this.matrix = [];
        for (var i = 0; i < this.rows; i++) {
            this.matrix[i] = [];
            for (var j = 0; j < this.columns; j++) {
                this.matrix[i][j] = new Tile(i, j, 0);
            }
        }
    }

    getAdjacent(r, c) {
        var adjacentTiles = [];
        if (r >= 0 && c >= 0 && r < this.rows && c < this.columns) {
            const tile = this.matrix[r][c];
            
        }
        return adjacentTiles;
    }
}
