window.addEventListener('load', () => {
    document.addEventListener('click', click);
    document.addEventListener('mousedown', startDrawOrMove);
    document.addEventListener('mouseup', stopDrawOrMove);
    document.addEventListener('mousemove', sketch);
});

let canvas = new fabric.Canvas("canvas");
let isDown, origX, origY;

let shapeInput = document.getElementById("shape");
let colorInput = document.getElementById("favcolor");
let slider = document.getElementById("opacity");
let outputO = document.getElementById("value");
let colorValue = document.getElementById('colorVal');

outputO.innerHTML = slider.value;
colorValue.innerHTML = colorInput.value;

let toolType = "draw";
let shapeType = shapeInput.value;
let shape;

function click(event) {
    // if users click reset, clear all shapes in the interface (10pts)
    if (toolType === "reset") {
        console.log("Reset the canvas.")
        canvas.clear();
    }

}

function startDrawOrMove(event) {
    isDown = true;
    let pointer = canvas.getPointer(event, false); // get mouse position
    origX = pointer.x;
    origY = pointer.y;
    if (toolType === "draw") {
        //Use fabric.Circle/Rect/Triangle to define a circle/rectangle/triangle, respectively. Each shape is for 9pts
        if (shapeType === 'circle') {
            shape = new fabric.Circle({
                left: origX,
                top: origY,
                radius: 0,
                fill: colorInput.value,
                opacity: slider.value,
                selectable: false
            });
            console.log("created a circle: " + shape);
        }
        else if (shapeType === 'rectangle') {
            shape = new fabric.Rect({
                left: origX,
                top: origY,
                width: 0,
                height: 0,
                fill: colorInput.value,
                opacity: slider.value,
                selectable: false
            });
            console.log("created a rectangle.")
        }
        else if (shapeType === 'triangle') {
            shape = new fabric.Triangle({
                left: origX,
                top: origY,
                width: 0,
                height: 0,
                fill: colorInput.value,
                opacity: slider.value,
                selectable: false,
            });
            console.log("created a triangle.")
        }
        else {console.warn("Shape should be one of circle, rectangle, or triangle.")}

        // lock the size of created shape
        shape.setControlsVisibility({
            mt: false,
            mb: false,
            ml: false,
            mr: false,
            bl: false,
            br: false,
            tl: false,
            tr: false,
            mtr: false,
        });

        // add the defined shape into canvas (3pts).
        canvas.add(shape);
        console.log("added a shape to canvas." + shape);

    } else if (toolType === "move") {
        // make all shapes selectable (4pts).
        let allShapes = canvas.getObjects();
        for (let i = 0; i < allShapes.length; i++) {
            allShapes[i].set({selectable: true});
        }
        canvas.requestRenderAll();
        console.log("Make shape selectable.")
    }

}

function stopDrawOrMove(event) {
    isDown = false;
}

function sketch(event) {
    if (toolType === "draw") {
        if (!isDown) return;
        let pointer = canvas.getPointer(event, false);
        shape.set({
            left: Math.min(origX, pointer.x),
            top: Math.min(origY, pointer.y)
        });
        if (shapeType === 'circle') {
            // set the circle radius based on the mouse position (6pts)
            shape.set({
                radius: Math.sqrt(Math.pow(pointer.x - origX, 2) + Math.pow(pointer.y - origY, 2)) / 2
            });
            shape.setCoords();
        } else if ((shapeType === 'rectangle') || (shapeType === 'triangle')) {
            // set the width and height of rectangle or triangle based on the mouse position (6pts)
            shape.set({
                width: Math.abs(pointer.x - origX),
                height: Math.abs(pointer.y - origY)
            });
            shape.setCoords();
        }
    } else if (toolType === "move") {
        // move the selected shape  hint: use getActiveObject() function(8pts)
        let pointer = canvas.getPointer(event, false);
        shape.left = pointer.x;
        shape.top = pointer.y;
    }
    canvas.requestRenderAll();
}

function selectShape(shape) {
    shapeType = shape.value;
}

function useTool(tool) {
    toolType = tool;
}

slider.oninput = function () {
    outputO.innerHTML = this.value;
    // get all shapes from canvas (6pts) and change the opacity of each shape (6pts)
    let allShapes = canvas.getObjects();
    for (let i = 0; i < allShapes.length; i++) {
        allShapes[i].opacity = slider.value;
    }
    canvas.requestRenderAll();
}

colorInput.oninput = function () {
    colorValue.innerHTML = this.value;
}