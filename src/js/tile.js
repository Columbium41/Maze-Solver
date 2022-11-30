const leftPush = new Image();
leftPush.src = "/images/left-arrow.png";
const rightPush = new Image();
rightPush.src = "/images/right-arrow.png";
const upPush = new Image();
upPush.src = "/images/up-arrow.png";
const downPush = new Image();
downPush.src = "/images/down-arrow.png";

export default class Tile {
    static tileTypeDict = {
        "Delete": 0,
        "Start Block": 1,
        "Destination Block": 2,
        "Wall": 3,
        "Left Block": 4,
        "Right Block": 5,
        "Up Block": 6,
        "Down Block": 7
    };

    static tileImageDict = {
        4: leftPush,
        5: rightPush,
        6: upPush,
        7: downPush
    };

    constructor(row, column, type) {
        this.row = row;
        this.column = column;
        this.type = type;

        this.checked = false;
        this.visited = false;
        this.inPath = false;
        this.parentTile = null;
    }
    
    /**
     * A method to check if a tile is equal to another tile
     * @param {Tile} other The other tile
     * @returns {boolean} Whether the two tiles are equal or not
     */
    equals(other) {
        return (this.row === other.row && this.column === other.column && this.type === other.type);
    }
}
