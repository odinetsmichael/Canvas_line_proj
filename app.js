const leftMouse = 1;
const rightMouse = 3;
const canvas = document.getElementById("canvas");
const colapseButton = document.getElementById("colapse");
const ctx = canvas.getContext("2d");

let allLines = [];
let isTracked = false;

let clearCounter = 0;
const clearDivideCount = 60;

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Line {
  constructor(pointStart, pointEnd, intersectDots) {
    this.pointStart = pointStart;
    this.pointEnd = pointEnd;
    this.intersectDots = intersectDots;
    this.centerPoint = {
      x: (this.pointStart.x + this.pointEnd.x) / 2,
      y: (this.pointStart.y + this.pointEnd.y) / 2,
    };
    this.clearVectorStart = null;
    this.clearVectorEnd = null;
  }

  get getCenterCoord() {
    return this.centerPoint;
  }

  moveStartPointToCenter() {
    this.pointStart.x = this.pointStart.x + this.clearVectorStart.x;
    this.pointStart.y = this.pointStart.y + this.clearVectorStart.y;
  }

  moveEndPointToCenter() {
    this.pointEnd.x = this.pointEnd.x + this.clearVectorEnd.x;
    this.pointEnd.y = this.pointEnd.y + this.clearVectorEnd.y;
  }
}

const currLine = {
  pointStart: null,
  pointEnd: null,
  intersectDots: [],
};

colapseButton.onclick = function (event) {
  clearCounter = 0;
  currLine.pointStart = null;
  currLine.pointEnd = null;
  currLine.intersectDots = [];
  isTracked = false;
  calculateMovementVector();
  window.requestAnimationFrame(colapseLines);
};

function colapseLines(timestamp) {
  if (allLines.length == 0) return;

  if (clearCounter < clearDivideCount) {
    window.requestAnimationFrame(colapseLines);
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

canvas.addEventListener(
  "contextmenu",
  function (event) {
    event.preventDefault();
    return false;
  },
  false
);

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

function rightClick(event) {
  isTracked = false;
  currLine.pointStart = null;
  currLine.pointEnd = null;
  clearCanvas();
  drawLines();
  drawCircles();
}

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

function drawCircles() {
  allLines
    .flatMap((line) => line.intersectDots)
    .forEach((dot) => drawCircle(dot.x, dot.y));
}

function drawCircle(x, y) {
  ctx.beginPath();
  ctx.arc(x, y, 5, 0, Math.PI * 2);
  ctx.fill();
}

function setIntersectionsForLine(line) {
  let intersectDots = [];
  allLines.forEach((item) => {
    let coord = lineSegmentsIntercept(
      line.pointStart,
      line.pointEnd,
      item.pointStart,
      item.pointEnd
    );

    if (coord) {
      intersectDots.push(coord);
    }
  });
  line.intersectDots = intersectDots;
}

function getIntersections(e) {
  let intersectDots = [];
  allLines.forEach((item) => {
    let coord = lineSegmentsIntercept(
      currLine.pointStart,
      new Point(e.offsetX, e.offsetY),
      item.pointStart,
      item.pointEnd
    );

    if (coord) {
      intersectDots.push(coord);
    }
  });
  return intersectDots;
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// point object: {x:, y:}
// p0 & p1 form one segment, p2 & p3 form the second segment
// Returns true if lines segments are intercepting
const lineSegmentsIntercept = (function () {
  let v1, v2, v3, cross, u1, u2;
  v1 = { x: null, y: null };
  v2 = { x: null, y: null };
  v3 = { x: null, y: null };

  function lineSegmentsIntercept(p0, p1, p2, p3) {
    v1.x = p1.x - p0.x; // line p0, p1 as vector
    v1.y = p1.y - p0.y;
    v2.x = p3.x - p2.x; // line p2, p3 as vector
    v2.y = p3.y - p2.y;
    if ((cross = v1.x * v2.y - v1.y * v2.x) === 0) {
      // cross prod 0 if lines parallel
      return false;
    }
    v3 = { x: p0.x - p2.x, y: p0.y - p2.y }; // the line from p0 to p2 as vector
    u2 = (v1.x * v3.y - v1.y * v3.x) / cross;
    // code point B
    if (u2 >= 0 && u2 <= 1) {
      // is intercept on line p2, p3
      u1 = (v2.x * v3.y - v2.y * v3.x) / cross;
      // code point A
      if (u1 >= 0 && u1 <= 1) {
        return {
          x: p0.x + v1.x * u1,
          y: p0.y + v1.y * u1,
        };
      }
      // code point A end
    }

    return false; // no intercept;
    // code point B end
  }
  return lineSegmentsIntercept;
})();
