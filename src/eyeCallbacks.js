// Eye (camera) controls (copied from AbhayPratapSingh1/3d-shapes, src/eyeCallbacks.js)
//
// The camera never moves: every object is moved/rotated the opposite way
// around the origin (0, 0, 0), which is where the eye sits.
//
//   Arrow keys : look up / down / left / right
//   Z / C      : roll
//   W / S      : move up / down
//   A / D      : move left / right
//   Q / E      : move forward / back
//   - / =      : zoom out / in

const rotateObj = (object, isEye = false) => {
  const reference = isEye ? createVector(0, 0, 0) : undefined;

  if (keyIsDown(UP_ARROW)) {
    object.rotate(1, "z", "y", reference);
  }
  if (keyIsDown(DOWN_ARROW)) {
    object.rotate(1, "y", "z", reference);
  }
  if (keyIsDown(LEFT_ARROW)) {
    object.rotate(1, "z", "x", reference);
  }
  if (keyIsDown(RIGHT_ARROW)) {
    object.rotate(1, "x", "z", reference);
  }
  if (keyIsDown(67)) { // C
    object.rotate(1, "x", "y", reference);
  }
  if (keyIsDown(90)) { // Z
    object.rotate(1, "y", "x", reference);
  }
};

const zoom = (object, isEye = false) => {
  const delta = isEye ? 10 : -10;

  if (keyIsDown(189)) { // -
    object.points.forEach((point) => point.z += delta);
    object.pos.z += delta;
  }
  if (keyIsDown(187)) { // =
    object.points.forEach((point) => point.z -= delta);
    object.pos.z -= delta;
  }
};

const move = (object, isEye = false) => {
  const delta = isEye ? -10 : 10;

  if (keyIsDown(87)) { // W
    object.points.forEach((point) => point.y -= delta);
    object.pos.y -= delta;
  }
  if (keyIsDown(83)) { // S
    object.points.forEach((point) => point.y += delta);
    object.pos.y += delta;
  }
  if (keyIsDown(65)) { // A
    object.points.forEach((point) => point.x -= delta);
    object.pos.x -= delta;
  }
  if (keyIsDown(68)) { // D
    object.points.forEach((point) => point.x += delta);
    object.pos.x += delta;
  }
  if (keyIsDown(81)) { // Q
    object.points.forEach((point) => point.z -= delta);
    object.pos.z -= delta;
  }
  if (keyIsDown(69)) { // E
    object.points.forEach((point) => point.z += delta);
    object.pos.z += delta;
  }
};

const eyeCallbacks = (objects) => {
  objects.forEach((object) => {
    rotateObj(object, true);
    move(object, true);
    zoom(object, true);
  });
};
