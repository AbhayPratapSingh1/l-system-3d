const OBJECTS = [];

const L_SYSTEM_NAMES = Object.keys(L_SYSTEMS);

let toRenderLSystem = L_SYSTEMS.hilbert;
let lSystemIndex = L_SYSTEM_NAMES.indexOf(toRenderLSystem.name);
let lastAction = "start";

// The eye controls move the shapes, not a camera, so a rebuilt L-system would
// jump back to where it started. The eye frame is an origin plus the tips of
// the x, y and z unit vectors; it gets the same moves as the shapes, so it
// always says where the untouched world now sits in front of the eye.
const createEyeFrame = () => ({
  pos: createVector(0, 0, 0),
  points: [createVector(1, 0, 0), createVector(0, 1, 0), createVector(0, 0, 1)],

  rotate(degree, a1, a2, reference) {
    [this.pos, ...this.points].forEach((point) => {
      const [v1, v2] = rotatePointAroundPoint(point, reference, degree, a1, a2);
      point[a1] = v1;
      point[a2] = v2;
    });
  },
});

let eyeFrame;

// Moves `point` from untouched world coordinates to where the eye frame
// says it is now.
const placeInEyeFrame = (point) => {
  const { pos: origin, points: [x, y, z] } = eyeFrame;
  const placed = origin.copy();
  placed.add(p5.Vector.sub(x, origin).mult(point.x));
  placed.add(p5.Vector.sub(y, origin).mult(point.y));
  placed.add(p5.Vector.sub(z, origin).mult(point.z));
  point.set(placed);
};

// Clears every shape and draws `toRenderLSystem` again. With `keepEye` the
// new shapes are moved to match the current camera; otherwise the camera
// goes back to its start.
function reset(keepEye = false) {
  OBJECTS.length = 0;
  renderLSystem(toRenderLSystem, OBJECTS);

  if (!keepEye) {
    eyeFrame = createEyeFrame();
    return;
  }
  OBJECTS.forEach((object) => {
    object.points.forEach(placeInEyeFrame);
    placeInEyeFrame(object.pos);
  });
}

// Moves `step` places through L_SYSTEMS (wrapping around both ends) and
// draws that L-system.
function showLSystem(step) {
  const count = L_SYSTEM_NAMES.length;
  lSystemIndex = (lSystemIndex + step + count) % count;
  toRenderLSystem = L_SYSTEMS[L_SYSTEM_NAMES[lSystemIndex]];
  reset();
}

// Changes the current L-system's iteration count by `step` (never below 0)
// and draws it again, keeping the camera where it is.
function changeIterations(step) {
  toRenderLSystem.iterations = Math.max(0, toRenderLSystem.iterations + step);
  reset(true);
}

// Returns `color` ("#RGB", "#RRGGBB" or "#RRGGBBAA") as "#RRGGBBAA" with its
// alpha moved by `step` (kept within 00..FF).
const changeAlpha = (color, step) => {
  let hex = color.slice(1);
  if (hex.length === 3) hex = [...hex].map((digit) => digit + digit).join("");
  const alpha = hex.length === 8 ? parseInt(hex.slice(6), 16) : 255;
  const next = Math.min(255, Math.max(0, alpha + step));
  return `#${hex.slice(0, 6)}${next.toString(16).padStart(2, "0").toUpperCase()}`;
};

// Turtle options that can be changed live. The first key lowers the value,
// the second raises it; `change` gets the current value and the direction
// (-1 or 1) and returns the new value. A control with `apply` only restyles
// the shapes already drawn, so the L-system is not grown again.
const TURTLE_CONTROLS = [
  {
    option: "angle",
    label: "turn angle",
    keys: ["t", "y"],
    change: (value, direction) => Math.max(0, value + direction * 2.5),
  },
  {
    option: "length",
    label: "branch length",
    keys: ["u", "i"],
    change: (value, direction) => value * Math.pow(1.1, direction),
  },
  {
    option: "radius",
    label: "branch radius",
    keys: ["o", "p"],
    change: (value, direction) => value * Math.pow(1.2, direction),
  },
  {
    option: "sides",
    label: "branch sides",
    keys: ["g", "h"],
    change: (value, direction) => Math.max(3, value + direction),
  },
  {
    option: "lengthScale",
    label: 'length scale (")',
    keys: ["v", "b"],
    change: (value, direction) => Math.max(0.05, value + direction * 0.05),
  },
  {
    option: "radiusScale",
    label: "radius scale (!)",
    keys: [",", "."],
    change: (value, direction) => Math.max(0.05, value + direction * 0.05),
  },
  {
    option: "strokeColor",
    label: "stroke opacity",
    keys: ["[", "]"],
    change: (value, direction) => changeAlpha(value, direction * 0x11),
    apply: (object, value) => object.strokeColor = value,
  },
];

const CAMERA_CONTROLS = [
  ["↑ ↓ ← →", "look around"],
  ["Z / C", "roll"],
  ["W / S", "move up / down"],
  ["A / D", "move left / right"],
  ["Q / E", "move forward / back"],
  ["- / =", "zoom out / in"],
];

const turtleOption = (config, option) =>
  config.turtle?.[option] ?? TURTLE_DEFAULTS[option];

const formatValue = (value) => {
  if (typeof value === "string") return value;
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
};

// Changes one turtle option of the current L-system and draws it again,
// keeping the camera where it is.
function changeTurtleOption(control, direction) {
  const current = turtleOption(toRenderLSystem, control.option);
  const value = control.change(current, direction);
  toRenderLSystem.turtle = toRenderLSystem.turtle ?? {};
  toRenderLSystem.turtle[control.option] = value;

  if (control.apply) {
    OBJECTS.forEach((object) => control.apply(object, value));
  } else {
    reset(true);
  }
}

// Draws a table with a title row and a header row. (x, y) is its bottom-left
// corner, or its bottom-right corner when `alignRight` is set.
function drawTable(title, rows, x, y, alignRight = false) {
  const rowHeight = 20;
  const padding = 10;
  const gap = 18;

  textSize(14);
  textStyle(BOLD);
  const widths = rows[0].map((_, column) =>
    Math.max(...rows.map((row) => textWidth(String(row[column]))))
  );
  const tableWidth = widths.reduce((sum, w) => sum + w, 0) +
    gap * (widths.length - 1) + padding * 2;
  const tableHeight = rowHeight * (rows.length + 1) + padding * 2;
  const left = alignRight ? x - tableWidth : x;
  const top = y - tableHeight;

  stroke(0, 40);
  line(
    left + padding,
    top + padding + rowHeight * 2 - 3,
    left + tableWidth - padding,
    top + padding + rowHeight * 2 - 3,
  );

  noStroke();
  textAlign(LEFT, TOP);
  fill(0);
  text(title, left + padding, top + padding);

  rows.forEach((row, index) => {
    textStyle(index === 0 ? BOLD : NORMAL);
    fill(index === 0 ? 90 : 0);

    let cellX = left + padding;
    const cellY = top + padding + rowHeight * (index + 1);
    row.forEach((cell, column) => {
      text(String(cell), cellX, cellY);
      cellX += widths[column] + gap;
    });
  });
}

// frameRate() changes every frame, so the shown value is only refreshed
// twice a second to stay readable.
let shownFps = 0;
let fpsUpdatedAt = 0;

function updateFps() {
  if (millis() - fpsUpdatedAt < 500) return;
  shownFps = Math.round(frameRate());
  fpsUpdatedAt = millis();
}

function drawStatus() {
  const position = `${lSystemIndex + 1}/${L_SYSTEM_NAMES.length}`;

  push();
  resetMatrix();

  // name at the top
  noStroke();
  fill(0);
  textAlign(CENTER, TOP);
  textStyle(BOLD);
  textSize(28);
  text(toRenderLSystem.name, width / 2, 16);
  textStyle(NORMAL);
  textSize(14);
  fill(60);
  text(`${position} · last action: ${lastAction}`, width / 2, 50);

  // shape count and frame rate in the top-right corner
  updateFps();
  textAlign(RIGHT, TOP);
  fill(0);
  text(`shapes: ${OBJECTS.length}`, width - 16, 16);
  text(`fps: ${shownFps}`, width - 16, 36);

  const lSystemRows = [
    ["Keys", "Action", "Value"],
    ["N / M", "previous / next L-system", position],
    ["J / K", "fewer / more iterations", toRenderLSystem.iterations],
    ["R", "redraw and reset camera", ""],
    ...TURTLE_CONTROLS.map((control) => [
      control.keys.map((k) => k.toUpperCase()).join(" / "),
      `less / more ${control.label}`,
      formatValue(turtleOption(toRenderLSystem, control.option)),
    ]),
  ];
  drawTable("L-system", lSystemRows, 16, height - 16);
  drawTable(
    "Camera",
    [["Keys", "Action"], ...CAMERA_CONTROLS],
    width - 16,
    height - 16,
    true,
  );

  pop();
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  pixelDensity(1);

  reset();
}

function draw() {
  translate(width / 2, height / 2);
  background(205);

  eyeCallbacks(OBJECTS);
  eyeCallbacks([eyeFrame]);

  renderObjects(OBJECTS);

  drawStatus();
}

function keyPressed() {
  const pressed = key.toLowerCase();

  if (pressed === "r") {
    lastAction = "reset";
    reset();
  }
  if (pressed === "m") {
    lastAction = "next";
    showLSystem(1);
  }
  if (pressed === "n") {
    lastAction = "previous";
    showLSystem(-1);
  }
  if (pressed === "k") {
    lastAction = "more iterations";
    changeIterations(1);
  }
  if (pressed === "j") {
    lastAction = "fewer iterations";
    changeIterations(-1);
  }

  for (const control of TURTLE_CONTROLS) {
    const index = control.keys.indexOf(pressed);
    if (index === -1) continue;

    const direction = index === 0 ? -1 : 1;
    lastAction = `${direction < 0 ? "less" : "more"} ${control.label}`;
    changeTurtleOption(control, direction);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
