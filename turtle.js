// 3D turtle for L-systems.
//
// The turtle keeps its orientation as three unit vectors (as in
// "The Algorithmic Beauty of Plants"):
//   heading (H) : the direction it moves in
//   left    (L) : its left side
//   up      (U) : H x L
// Every rotation turns two of these vectors around the third one.
// Angles are in degrees, like the rest of the project.
//
// Every drawn segment is a Cylinder pushed into `shapes`, so passing the
// sketch's OBJECTS array makes the branches render and follow the eye
// controls like any other shape.

// Screen y grows downward, so "up" in the world is -y.
const TURTLE_VERTICAL = { x: 0, y: -1, z: 0 };

// Values used for any option not passed to the Turtle constructor.
const TURTLE_DEFAULTS = {
  angle: 25, // turn angle in degrees
  length: 50, // length of a branch
  radius: 10,
  sides: 6,
  lengthScale: 0.9,
  radiusScale: 0.7,
  palette: [
    ["#5b3a1e", "#6e4826"],
    ["#2e7d32", "#43a047"],
  ],
  strokeColor: "#000",
};

// Rotates `a` toward `b` by `degree` inside the plane they span.
const turnPair = (a, b, degree) => {
  const angle = radians(degree);
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  const newA = p5.Vector.add(p5.Vector.mult(a, c), p5.Vector.mult(b, s));
  const newB = p5.Vector.sub(p5.Vector.mult(b, c), p5.Vector.mult(a, s));
  return [newA.normalize(), newB.normalize()];
};

class Turtle {
  constructor(name, { x, y, z }, shapes, options = {}) {
    this.name = name;
    this.shapes = shapes;

    this.position = createVector(x, y, z);
    this.heading = createVector(TURTLE_VERTICAL.x, TURTLE_VERTICAL.y, TURTLE_VERTICAL.z);
    this.left = createVector(-1, 0, 0);
    this.up = p5.Vector.cross(this.heading, this.left);

    const settings = { ...TURTLE_DEFAULTS, ...options };
    this.angle = settings.angle;
    this.length = settings.length;
    this.radius = settings.radius;
    this.sides = settings.sides;
    this.lengthScale = settings.lengthScale;
    this.radiusScale = settings.radiusScale;
    this.palette = settings.palette;
    this.strokeColor = settings.strokeColor;
    this.colorIndex = 0;

    this.stack = [];
  }

  // ---- movement ----

  forward(distance = this.length, draw = true) {
    const start = this.position.copy();
    const end = p5.Vector.add(start, p5.Vector.mult(this.heading, distance));

    if (draw) {
      this.drawBetween(start, end);
    }
    this.position = end;
  }

  move(distance = this.length) {
    this.forward(distance, false);
  }

  // ---- rotation ----

  turnLeft(degree = this.angle) {
    [this.heading, this.left] = turnPair(this.heading, this.left, degree);
  }

  turnRight(degree = this.angle) {
    this.turnLeft(-degree);
  }

  pitchUp(degree = this.angle) {
    [this.heading, this.up] = turnPair(this.heading, this.up, degree);
  }

  pitchDown(degree = this.angle) {
    this.pitchUp(-degree);
  }

  rollRight(degree = this.angle) {
    [this.left, this.up] = turnPair(this.left, this.up, degree);
  }

  rollLeft(degree = this.angle) {
    this.rollRight(-degree);
  }

  turnAround() {
    this.turnLeft(180);
  }

  // Rolls around the heading so that `left` becomes horizontal.
  rollToVertical() {
    const vertical = createVector(TURTLE_VERTICAL.x, TURTLE_VERTICAL.y, TURTLE_VERTICAL.z);
    const left = p5.Vector.cross(vertical, this.heading);
    if (left.mag() < 1e-6) return; // heading is vertical, nothing to align

    this.left = left.normalize();
    this.up = p5.Vector.cross(this.heading, this.left).normalize();
  }

  // ---- branch properties ----

  scaleLength(factor = this.lengthScale) {
    this.length *= factor;
  }

  scaleRadius(factor = this.radiusScale) {
    this.radius *= factor;
  }

  nextColor() {
    this.colorIndex = (this.colorIndex + 1) % this.palette.length;
  }

  currentColor() {
    return this.palette[this.colorIndex % this.palette.length];
  }

  // ---- state stack (branching) ----

  push() {
    this.stack.push({
      position: this.position.copy(),
      heading: this.heading.copy(),
      left: this.left.copy(),
      up: this.up.copy(),
      length: this.length,
      radius: this.radius,
      colorIndex: this.colorIndex,
    });
  }

  pop() {
    const state = this.stack.pop();
    if (!state) return;

    this.position = state.position;
    this.heading = state.heading;
    this.left = state.left;
    this.up = state.up;
    this.length = state.length;
    this.radius = state.radius;
    this.colorIndex = state.colorIndex;
  }

  // ---- drawing ----

  // Builds a Cylinder whose axis runs from `start` to `end`.
  // The Cylinder is created around the origin along its local y axis and its
  // points are then mapped onto a (side, axis, side x axis) basis. That basis
  // is right-handed, so the faces keep their outward winding for culling.
  drawBetween(start, end) {
    const direction = p5.Vector.sub(end, start);
    const height = direction.mag();
    if (height === 0) return;

    const axisY = direction.div(height);

    // Use the turtle's left as the cylinder's side so it rolls with the turtle.
    let axisX = p5.Vector.sub(this.left, p5.Vector.mult(axisY, this.left.dot(axisY)));
    if (axisX.mag() < 1e-6) {
      axisX = p5.Vector.cross(axisY, this.up);
    }
    axisX.normalize();
    const axisZ = p5.Vector.cross(axisX, axisY).normalize();

    const center = p5.Vector.add(start, end).div(2);

    const branch = new Cylinder(
      0,
      0,
      0,
      height,
      this.radius,
      0,
      this.sides,
      this.currentColor(),
      this.strokeColor,
    );

    branch.points.forEach((point) => {
      const { x, y, z } = point;
      point.set(
        center.x + axisX.x * x + axisY.x * y + axisZ.x * z,
        center.y + axisX.y * x + axisY.y * y + axisZ.y * z,
        center.z + axisX.z * x + axisY.z * y + axisZ.z * z,
      );
    });
    branch.pos.set(center.x, center.y, center.z);

    this.shapes.push(branch);
  }
}
