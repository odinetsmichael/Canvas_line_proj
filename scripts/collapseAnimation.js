let clearCounter = 0;
const clearDivideCount = 60;

function collapseLines() {
  if (allLines.length == 0) return;

  if (clearCounter < clearDivideCount) {
    window.requestAnimationFrame(collapseLines);
    clearCounter++;
  } else {
    allLines = [];
    clearCounter = 0;
    clearCanvas();
    return;
  }

  allLines.forEach((line) => {
    line.moveStartPointToCenter();
    line.moveEndPointToCenter();
  });
  allLines.forEach((line) => {
    setIntersectionsForLine(line);
  });

  clearCanvas();
  drawLines();
  drawCircles();
}

function calculateMovementVector() {
  const t = clearDivideCount;
  allLines.forEach((line) => {
    line.clearVectorStart = getMovementVector(
      line.pointStart.x,
      line.centerPoint.x,
      line.pointStart.y,
      line.centerPoint.y,
      t
    );

    line.clearVectorEnd = getMovementVector(
      line.pointEnd.x,
      line.centerPoint.x,
      line.pointEnd.y,
      line.centerPoint.y,
      t
    );
  });
}

function getMovementVector(x1, x2, y1, y2, t) {
  return new Point(+((x2 - x1) / t).toFixed(1), +((y2 - y1) / t).toFixed(1));
}
