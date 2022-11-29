// DOCUMENT ELEMENTS
const navbar = document.getElementById('navbar');

const gridLinesCheckbox = document.getElementById('show-grid');
const showStepsCheckbox = document.getElementById('show-steps');

// CANVAS
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// MAZE VARIABLES
var showGrid = false;
var showSteps = false;

function getCheckbox() {
    showGrid = gridLinesCheckbox.checked;
    showSteps = showStepsCheckbox.checked;
}
