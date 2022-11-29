const navbar = document.getElementById('navbar');
const optionsMenu = document.getElementById('options-menu');

const mazeInterface = document.getElementById('maze-interface');
const mazeMenu = document.getElementById('maze-menu');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

function createMaze() {
    const rowsInput = Number(document.getElementById('rows-input').value);
    const columnsInput = Number(document.getElementById('columns-input').value);

    if (Number.isInteger(rowsInput) && Number.isInteger(columnsInput) && rowsInput > 0 && columnsInput > 0) {
        optionsMenu.style.display = "none";
        navbar.style.display = "none";

        mazeInterface.style.display = "block";
        const gridSize = Math.min(parseInt((window.innerWidth-40)/columnsInput), 
                                  parseInt((window.innerHeight-40-mazeMenu.clientHeight)/rowsInput),
                                  75);

        canvas.width = columnsInput * gridSize;
        canvas.height = rowsInput * gridSize;
        mazeMenu.style.width = `${canvas.width}px`;
    }
    else if (!(Number.isInteger(rowsInput) && Number.isInteger(columnsInput))) {
        alert('Please enter in whole numbers (no decimals).');;
    }
    else if (!(rowsInput > 0 && columnsInput > 0)) {
        alert('Please enter in a whole number greater than zero.')
    }
}

function toMenu() {
    mazeInterface.style.display = "none";
    optionsMenu.style.display = "grid";
    navbar.style.display = "flex";
}
