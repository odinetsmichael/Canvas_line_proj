const leftMouse = 1;
const rightMouse = 3;
const collapseButton = document.getElementById("collapse");

canvas.addEventListener(
  "contextmenu",
  function (event) {
    event.preventDefault();
    return false;
  },
  false
);

collapseButton.onclick = function () {
  clearCounter = 0;
  currLine.pointStart = null;
  currLine.pointEnd = null;
  currLine.intersectDots = [];
  isTracked = false;
  calculateMovementVector();
  window.requestAnimationFrame(collapseLines);
};

canvas.onmousedown = function (event) {
  ctx.fillStyle = "red";
  ctx.strokeStyle = "black";
  switch (event.which) {
    case leftMouse:
      leftClick(event);
      break;
    case rightMouse:
      rightClick(event);
      break;
    default:
      break;
  }
};

canvas.onmousemove = function (e) {
  if (!isTracked) return;
  let intersectionCoords = getIntersections(e);
  currLine.intersectDots = intersectionCoords;
  clearCanvas();
  drawLines();
  drawCircles();
  drawCurrentLine(e);
  drawCurrentCircles(currLine.intersectDots);
};

function leftClick(event) {
  if (!isTracked) {
    isTracked = true;
    currLine.pointStart = new Point(
      Math.round(event.offsetX),
      Math.round(event.offsetY)
    );
  } else {
    isTracked = false;
    currLine.pointEnd = new Point(
      Math.round(event.offsetX),
      Math.round(event.offsetY)
    );
    allLines.push(
      new Line(currLine.pointStart, currLine.pointEnd, currLine.intersectDots)
    );
  }
}

function rightClick() {
  isTracked = false;
  currLine.pointStart = null;
  currLine.pointEnd = null;
  clearCanvas();
  drawLines();
  drawCircles();
}
