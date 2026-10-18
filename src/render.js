// 3D -> 2D render pipeline (copied from AbhayPratapSingh1/3d-shapes, src/utilities.js)
//
// Any shape works as long as it has `getFaces()` returning
// [{ points: [p5.Vector, ...], color, strokeColor }, ...]
// with faces wound so their normal points outward.

const SCREEN_Z = 700;
const NEAR_Z = 0.1;

const rotatePointAroundPoint = (p1, p2, da, k1 = "x", k2 = "z") => {
  const dx = p1[k1] - p2[k1];
  const dz = p1[k2] - p2[k2];

  const angle = Math.atan2(dz, dx) + radians(da);
  const radius = Math.sqrt(Math.pow(dx, 2) + Math.pow(dz, 2));

  const key1 = Math.sin(angle) * radius + p2[k2];
  const key2 = Math.cos(angle) * radius + p2[k1];

  return [key2, key1];
};

const normalOfFace = (p1, p2, p3) => {
  const s1 = p5.Vector.sub(p1, p2);
  const s2 = p5.Vector.sub(p3, p2);

  return s2.cross(s1);
};

const centerOfFace = (...points) => {
  const x = points.reduce((s, p) => s + p.x, 0) / points.length;
  const y = points.reduce((s, p) => s + p.y, 0) / points.length;
  const z = points.reduce((s, p) => s + p.z, 0) / points.length;
  return createVector(x, y, z);
};

const getProspectivePoint = (point, screen) => {
  const ratio = screen / point.z;
  return createVector(ratio * point.x, ratio * point.y, screen);
};

const getNormalAndCenter = (face) => ({
  points: face.points,
  center: centerOfFace(...face.points),
  normal: normalOfFace(...face.points),
  color: face.color,
  strokeColor: face.strokeColor,
});

const getAllFacesWithDetail = (objects) =>
  objects.flatMap((each) => each.getFaces()).map(getNormalAndCenter);

const getClippedPoint = (p1, p2) => {
  const diff = p2.z - p1.z;
  const ratio = diff === 0 ? 0 : (NEAR_Z - p1.z) / diff;

  const x = (p2.x - p1.x) * ratio + p1.x;
  const y = (p2.y - p1.y) * ratio + p1.y;
  return createVector(x, y, NEAR_Z);
};

// Cuts away the part of a face that is behind the camera (z < NEAR_Z).
const clipFace = (face) => {
  const points = [];
  const facePoints = face.points;
  for (let i = 0; i < facePoints.length; i++) {
    const current = facePoints[i];
    const next = facePoints[(i + 1) % facePoints.length];
    if (current.z >= NEAR_Z) {
      if (next.z >= NEAR_Z) {
        points.push(next);
      } else {
        points.push(getClippedPoint(current, next));
      }
    } else if (next.z >= NEAR_Z) {
      points.push(getClippedPoint(current, next));
      points.push(next);
    }
  }
  return { ...face, points };
};

// Back-face culling: keep faces whose normal points toward the camera.
const getVisibleFaces = (faces) =>
  faces.filter((face) => face.normal.dot(face.center) < 0);

const getSortedFaces = (faces) =>
  faces.sort((a, b) => b.center.z - a.center.z);

const getPrintablePoint = (faces) =>
  faces.map((face) => ({
    ...face,
    points: face.points.map((point) => getProspectivePoint(point, SCREEN_Z)),
  }));

const drawFace = (face) => {
  if (!face.points || face.points.length < 3) return;

  fill(face.color);
  stroke(face.strokeColor || [0, 0, 0, 0]);
  strokeWeight(1);

  beginShape();
  for (const point of face.points) {
    vertex(point.x, point.y);
  }
  endShape(CLOSE);
};

// Full pipeline: faces -> clip -> cull -> sort -> project -> draw.
// Call after translate(width / 2, height / 2) so (0, 0) is the screen center.
const renderObjects = (objects) => {
  const faces = getAllFacesWithDetail(objects);
  const clippedFaces = faces
    .map((face) => clipFace(face))
    .filter((face) => face.points.length > 0);

  const visibleFaces = getVisibleFaces(clippedFaces);
  const sortedFaces = getSortedFaces(visibleFaces);

  getPrintablePoint(sortedFaces).forEach((face) => drawFace(face));
};
