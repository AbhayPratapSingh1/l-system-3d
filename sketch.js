const OBJECTS = [];

const L_SYSTEMS = {
  // Bush from "The Algorithmic Beauty of Plants" (fig. 1.25)
  tree: {
    name: "tree",
    axiom: "A",
    rules: {
      A: "[&FL!A]/////'[&FL!A]///////'[&FL!A]",
      F: "S/////F",
      S: "FL",
    },
    iterations: 5,
    position: { x: 0, y: 300, z: 900 },
    turtle: { angle: 22.5, radius: 12 },
  },

  // Stochastic bush: every F picks one of the successors at random,
  // so each reset grows a different bush.
  bush: {
    name: "bush",
    axiom: "[&F]///[&F]///[&F]///[&F]///[&F]",
    rules: {
      F: ["F[&+F]F[^-F]", "F[\\&F]/F", "F[/^F]F[&F]"],
    },
    iterations: 3,
    position: { x: 0, y: 300, z: 900 },
    turtle: {
      angle: 30,
      length: 40,
      radius: 6,
      radiusScale: 0.8,
      palette: [["#2e7d32", "#43a047"]],
    },
  },

  // Fractal plant: the stem doubles (F -> FF) while X keeps branching.
  plant: {
    name: "plant",
    axiom: "X",
    rules: {
      X: "F[&+X]//[&-X]///F[^X]\\\\X",
      F: "FF",
    },
    iterations: 4,
    position: { x: 0, y: 300, z: 900 },
    turtle: { angle: 22.5, length: 16, radius: 3 },
  },

  // Pine: whorls of 4 drooping branches, each level shorter and thinner.
  pine: {
    name: "pine",
    axiom: "FA",
    rules: {
      A: "!FF[&&&&'B]///[&&&&'B]///[&&&&'B]///[&&&&'B]\"/A",
      B: "F[+F][-F]B",
    },
    iterations: 9,
    position: { x: 0, y: 200, z: 900 },
    turtle: {
      angle: 30,
      length: 32,
      radius: 10,
      lengthScale: 0.85,
      radiusScale: 0.8,
    },
  },

  // 3D Hilbert curve (fig. 1.8), filling a cube centered on the screen.
  hilbert: {
    name: "hilbert",
    axiom: "A",
    rules: {
      A: "B-F+CFC+F-D&F^D-F+&&CFC+F+B//",
      B: "A&F^CFB^F^D^^-F-D^|F^B|FC^F^A//",
      C: "|D^|F^B-F+C^F^A&&FA&F^C+F+B^F^D//",
      D: "|CFB-F+B|FA&F^A&&FB-F+B|FC//",
    },
    iterations: 4,
    position: { x: -140, y: 140, z: 760 },
    turtle: { angle: 90, length: 100, radius: 5, sides: 4 },
  },

  // Seashell: a single helix whose steps (") and thickness (!) grow every
  // turn (scales above 1), so it opens into a cone.
  shell: {
    name: "shell",
    axiom: "A",
    rules: {
      A: "F+^\"!A",
    },
    iterations: 120,
    position: { x: -94, y: 75, z: 950 },
    turtle: {
      angle: 12,
      length: 6,
      radius: 1.5,
      lengthScale: 1.02,
      radiusScale: 1.02,
      palette: [["#f5deb3", "#d2b48c"]],
    },
  },

  // 3D dragon curve: the classic X/Y dragon with every other fold pitched
  // out of the plane.
  dragon: {
    name: "dragon",
    axiom: "FX",
    rules: {
      X: "X+YF&",
      Y: "^FX-Y",
    },
    iterations: 8,
    position: { x: 162, y: 225, z: 950 },
    turtle: {
      angle: 90,
      length: 18,
      radius: 3,
      sides: 4,
      palette: [["#5e35b1", "#7e57c2"]],
    },
  },

  // Roots: the turtle turns around (|) to grow downward, and each random
  // split gets shorter and thinner.
  roots: {
    name: "roots",
    axiom: "|A",
    rules: {
      A: ["F\"[&+!A][^-!A]", "F\"[\\&!A]/[^!A]A", "F/A"],
    },
    iterations: 7,
    position: { x: 0, y: -170, z: 900 },
    turtle: {
      angle: 28,
      length: 70,
      radius: 12,
      lengthScale: 0.85,
      radiusScale: 0.75,
    },
  },

  // Coral: three arms that fork three ways, alternating orange and pink.
  coral: {
    name: "coral",
    axiom: "[A]///[&A]///[^A]",
    rules: {
      A: "F\"![&+'A]/[^-A]//[&A]",
    },
    iterations: 5,
    position: { x: 0, y: 250, z: 900 },
    turtle: {
      angle: 35,
      length: 80,
      radius: 14,
      lengthScale: 0.8,
      radiusScale: 0.75,
      palette: [["#ff7043", "#ff8a65"], ["#ec407a", "#f06292"]],
    },
  },

  // Lightning: a zig-zag bolt striking down; each step adds one random kink
  // or a thinner side bolt (B) that zig-zags on its own.
  lightning: {
    name: "lightning",
    axiom: "|A",
    rules: {
      A: ["F+F-A", "F-F+A", "F&F^A", "F^F&A", "F[&+!B]A", "F[^-!B]A"],
      B: ["F+F-B", "F-F+B", "F&F^B", "F"],
    },
    iterations: 20,
    position: { x: 0, y: -300, z: 900 },
    turtle: {
      angle: 35,
      length: 14,
      radius: 4,
      radiusScale: 0.6,
      palette: [["#ffd600", "#fff59d"]],
    },
  },

  // Vine: a stem that twists as it climbs, with a green leaf sprig every step.
  vine: {
    name: "vine",
    axiom: "A",
    rules: {
      A: "F/[&&'L]//+A",
      L: "F[+F][-F]",
    },
    iterations: 40,
    position: { x: 0, y: 300, z: 900 },
    turtle: { angle: 20, length: 14, radius: 4 },
  },
};

const L_SYSTEM_NAMES = Object.keys(L_SYSTEMS);

let toRenderLSystem = L_SYSTEMS.hilbert;
let lSystemIndex = L_SYSTEM_NAMES.indexOf(toRenderLSystem.name);
let lastAction = "start";

// Clears every shape (which also undoes any camera movement, since the eye
// controls move the shapes themselves) and draws `toRenderLSystem` again.
function reset() {
  OBJECTS.length = 0;
  renderLSystem(toRenderLSystem, OBJECTS);
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
// and draws it again.
function changeIterations(step) {
  toRenderLSystem.iterations = Math.max(0, toRenderLSystem.iterations + step);
  reset();
}

// Turtle options that can be changed live. The first key lowers the value,
// the second raises it; `change` gets the current value and the direction
// (-1 or 1) and returns the new value.
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

const formatValue = (value) =>
  Number.isInteger(value) ? String(value) : value.toFixed(2);

// Changes one turtle option of the current L-system and draws it again.
function changeTurtleOption(control, direction) {
  const current = turtleOption(toRenderLSystem, control.option);
  toRenderLSystem.turtle = toRenderLSystem.turtle ?? {};
  toRenderLSystem.turtle[control.option] = control.change(current, direction);
  reset();
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
  fill(255, 255, 255, 210);
  rect(left, top, tableWidth, tableHeight, 6);
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
