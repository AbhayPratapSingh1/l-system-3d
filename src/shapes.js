// Shapes (copied from AbhayPratapSingh1/3d-shapes, src/shapes.js)

const WORLD_ITEMS = {
  palettes: [
    "#0015ff",
    "#ff00a1",
    "#90fe00",
    "#8400ff",
    "#00fff7",
    "#ff7300",
  ],
};

class Cylinder {
  constructor(
    x,
    y,
    z,
    h,
    radius,
    length,
    sides = 8,
    color = WORLD_ITEMS.palettes,
    strokeColor = CONFIG.strokeColor,
  ) {
    this.pos = createVector(x, y, z);
    this.h = h;
    this.rOuter = radius;
    this.rInner = length;
    this.sides = sides;
    this.color = color;
    this.strokeColor = strokeColor;

    this.points = this.createVertices();
  }

  createVertices() {
    const points = [];
    const angleStep = TWO_PI / this.sides;
    const halfHeight = this.h / 2;

    // top circle
    for (let i = 0; i < this.sides; i++) {
      const angle = i * angleStep;
      const px = this.pos.x + cos(angle) * this.rOuter;
      const pz = this.pos.z + sin(angle) * this.rOuter;
      const py = this.pos.y - halfHeight;
      points.push(createVector(px, py, pz));
    }

    // bottom circle
    for (let i = 0; i < this.sides; i++) {
      const angle = i * angleStep;
      const px = this.pos.x + cos(angle) * this.rOuter;
      const pz = this.pos.z + sin(angle) * this.rOuter;
      const py = this.pos.y + halfHeight;
      points.push(createVector(px, py, pz));
    }

    return points;
  }

  getFaces() {
    const faces = [];
    const top = this.points.slice(0, this.sides);
    const bottom = this.points.slice(this.sides);

    // side faces
    for (let i = 0; i < this.sides; i++) {
      const next = (i + 1) % this.sides;
      faces.push({
        points: [bottom[i], bottom[next], top[next], top[i]],
        color: this.color[i % this.color.length],
        strokeColor: this.strokeColor,
      });
    }

    faces.push({
      points: top,
      color: this.color[0],
      strokeColor: this.strokeColor,
    }, {
      points: bottom.reverse(),
      color: this.color[0],
      strokeColor: this.strokeColor,
    });
    return faces;
  }

  rotate(degree, a1 = "x", a2 = "y", reference = undefined) {
    reference = reference || this.pos;
    this.points.forEach((point) => {
      const [v1, v2] = rotatePointAroundPoint(point, reference, degree, a1, a2);
      point[a1] = v1;
      point[a2] = v2;
    });

    const [v1, v2] = rotatePointAroundPoint(
      this.pos,
      reference,
      degree,
      a1,
      a2,
    );
    this.pos[a1] = v1;
    this.pos[a2] = v2;
  }
}
