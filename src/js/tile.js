export default class Tile {
    static tileTypeDict = {
        "Delete": 0,
        "Starting Block": 1,
        "Destination Block": 2,
        "Wall": 3,
        "Left Block": 4,
        "Right Block": 5,
        "Up Block": 6,
        "Down Block": 7,
        "Wormhole": 8
    };

    constructor(row, column, type) {
        this.row = row;
        this.column = column;
        this.type = type;

        this.checked = false;
        this.visited = false;
        this.parentTile = null;
    }
}
