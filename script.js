//! Setup !//

// Get the elements
const canvas = document.getElementById("drawing-area");
const toolbar = document.getElementById("toolbar");

// Get the context and location of the canvas (for drawing)
const canvasContext = canvas.getContext("2d");
const canvasRect = () => canvas.getBoundingClientRect();

// Set up global variables
let isPainting = false;
let color = "black"; // default
let lineWidth = 5; // default
let startX;
let startY;

//! Functions !//

// Debug print out what's going on
function printState() {
  console.log(`
isPainting: ${isPainting}
color: ${color}
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

function randomizeColors() {
  const inputs = document.querySelectorAll('label.random-clr input[type=radio][name="color"]');
  inputs.forEach((input) => {
    const hue = Math.floor(Math.random() * 360);
    const colorString = `hsl(${hue}, 57.8%, 61%)`;
    input.value = colorString;
    input.parentElement.style = `--label-clr: ${colorString}`;
  });
}
randomizeColors();

function download() {
  let link = document.createElement("a");
  link.download = "canvas_export.png";
  link.href = canvas.toDataURL();
  link.click();
}

//! Event Listeners !//

// Fix the screen if the window is resized
window.addEventListener("resize", fixCanvasSize);

// Toolbox settings
toolbar.addEventListener("click", (e) => {
  if (e.target.id === "clear") {
    canvasContext.clearRect(0, 0, canvasRect().width, canvasRect().height);
  }
  if (e.target.id === "randomize-colors") {
    randomizeColors();
  }
  if (e.target.id === "download") {
    download();
  }
});
function updateFromCustomColor() {
  const customColor = document.getElementById("stroke");
  canvasContext.strokeStyle = customColor.value;
}
let radios = document.querySelectorAll('input[type=radio][name="color"]');
radios.forEach((radio) => {
  radio.addEventListener("change", () => {
    const customColor = document.getElementById("stroke");
    if (radio.value !== "custom") {
      customColor.removeEventListener("change", updateFromCustomColor);
      canvasContext.strokeStyle = radio.value;
      return;
    }
    canvasContext.strokeStyle = customColor.value;
    // Set up custom color mirroring
    customColor.addEventListener("change", updateFromCustomColor);
  });
});
toolbar.addEventListener("change", (e) => {
  if (e.target.id === "lineWidth") {
    lineWidth = e.target.value;
  }
});

// Mouse movements
window.addEventListener("mousedown", (e) => {
  isPainting = true;
  startX = e.clientX;
  startY = e.clientY;
});
window.addEventListener("mouseup", () => {
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
