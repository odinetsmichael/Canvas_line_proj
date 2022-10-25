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
