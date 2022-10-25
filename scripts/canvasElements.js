let allLines = [];
let isTracked = false;

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
