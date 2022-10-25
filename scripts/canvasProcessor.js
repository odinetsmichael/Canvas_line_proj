const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function drawCurrentLine(e) {
  drawLine(currLine.pointStart.x, currLine.pointStart.y, e.offsetX, e.offsetY);
}

function drawCurrentCircles(dots) {
  dots.forEach((dot) => drawCircle(dot.x, dot.y));
}

function drawLines() {
  allLines.forEach(function (item) {
    drawLine(
      item.pointStart.x,
      item.pointStart.y,
      item.pointEnd.x,
      item.pointEnd.y
    );
  });
}

function drawLine(startX, startY, endX, endY) {
  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.closePath();
}

function drawCircle(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fill();
}

function drawCircles() {
  allLines
    .flatMap((line) => line.intersectDots)
    .forEach((dot) => drawCircle(dot.x, dot.y));
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
