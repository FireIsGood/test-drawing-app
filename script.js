//! Setup !//

// Get the elements
const canvas = document.getElementById("drawing-area");
const toolbar = document.getElementById("toolbar");

// Get the context and location of the canvas (for drawing)
const canvasContext = canvas.getContext("2d");
const canvasRect = () => canvas.getBoundingClientRect();

// Set up global variables
let isPainting = false;
let lineWidth = 5; // default
let startX;
let startY;

//! Functions !//

// Debug print out what's going on
function printState() {
  console.log(`
isPainting: ${isPainting}
lineWidth: ${lineWidth}
startX: ${startX}
startY: ${startY}
stroke: ${canvasContext.strokeStyle}
`);
}

// Fix the size of the canvas for resizing the window
function fixCanvasSize() {
  canvas.width = canvasRect().width;
  canvas.height = canvasRect().height;
}

//! Event Listeners !//

// Fix the screen if the window is resized
window.addEventListener("resize", fixCanvasSize);

// Toolbox settings
toolbar.addEventListener("click", (e) => {
  if (e.target.id === "clear") {
    canvasContext.clearRect(0, 0, canvasRect().width, canvasRect().height);
  }
});
toolbar.addEventListener("change", (e) => {
  if (e.target.id === "stroke") {
    canvasContext.strokeStyle = e.target.value;
  }
  if (e.target.id === "lineWidth") {
    lineWidth = e.target.value;
  }
});

canvas.addEventListener("mousedown", (e) => {
  isPainting = true;
  startX = e.clientX;
  startY = e.clientY;
});

canvas.addEventListener("mouseup", () => {
  isPainting = false;
  canvasContext.stroke();
  canvasContext.beginPath();
});

canvas.addEventListener("mousemove", draw);

// Draw loop
function draw(e) {
  if (!isPainting) {
    return;
  }

  canvasContext.lineWidth = lineWidth;
  canvasContext.lineCap = "round";

  canvasContext.lineTo(e.clientX - canvasRect().x, e.clientY - canvasRect().y);
  canvasContext.stroke();
}

//! Initial function runs !//
fixCanvasSize();
