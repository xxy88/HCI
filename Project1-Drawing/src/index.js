window.addEventListener('load', () => {
    /* use document.addEventListener to add additional two functions for interactivity
    "mouseup" for startPainting and "mousedown" for stopPainting (10pts)
    */
    document.addEventListener('mousemove', sketch); // when mouse move, we draw the lines
    document.addEventListener('mousedown', startPainting); // when mouse down, we start drawing
    document.addEventListener('mouseup', stopPainting); // when mouse up, we stop drawing
});

const canvas = document.getElementById('myCanvas');

// Context for the canvas for 2 dimensional operations
const ctx = canvas.getContext('2d');

// use document.getElementById to get the slider and the corresponding value
var slider = document.getElementById("linecap");
var output_v = document.getElementById("value");
output_v.innerHTML = slider.value;

//use document.getElementByName to get the line color
var radio = document.getElementsByName("linecolor");

// define the current mode : draw or erase
var tooltype = 'draw';

// Stores the initial position of the cursor
let coord = {x: 0, y: 0};

// This is the flag that we are going to use to 
// trigger drawing
let paint = false;

// Updates the coordianates of the cursor when 
// an event e is triggered to the coordinates where 
// the said event is triggered.
function getPosition(event) {
    coord.x = event.clientX - canvas.offsetLeft;
    coord.y = event.clientY - canvas.offsetTop;
}

// The following function trigger the flag to start draw (10pts)
function startPainting(event) {
    paint = true;
    getPosition(event);
}

// The following function trigger the flag to stop draw (10pts)
function stopPainting() {
    paint = false;
}

function sketch(event) {
    // if !paint is true, this function does nothing. (3pts)
    if (!paint) return;

    // Prepare drawing calss (ctx.beginPath function) (3pts)
    ctx.beginPath();

    // assign the value of linewidth to ctx.lineWidth (3pts)
    ctx.lineWidth = slider.value;

    // Sets the end of the lines drawn
    // to a round shape.
    ctx.lineCap = 'round';

    // judge whether you aim to draw or erase
    if (tooltype === 'erase') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 1)';
    } else {
        // (5pts)
        /* check every element in radio and change the style to the selected color */
        for (var i = 0; i < radio.length; i++) {
            if (radio[i].checked) {
                ctx.strokeStyle = radio[i].value;
            }
        }
    }

    // The cursor to start drawing
    // moves to this coordinate (ctx.moveTo function) (3pts)
    ctx.moveTo(coord.x, coord.y);

    // The position of the cursor
    // gets updated as we move the
    // mouse around.
    getPosition(event);

    // A line is traced from start
    // coordinate to this coordinate (ctx.lineTo function) (3pts)
    ctx.lineTo(coord.x, coord.y);

    // call ctx.stroke to draw the line. (3pts)
    ctx.stroke();
}

/* define a function that can change the draw or erase mode
when user clicks the corresponding button on HTML (5pts)
*/
function changeMode(mode){
    if (mode === 'draw') {
        tooltype = 'draw';
    } else {
        tooltype = 'erase';
    }
}


slider.oninput = function () {
    output_v.innerHTML = this.value;
}

