// Coral: three arms that fork three ways, alternating orange and pink.
L_SYSTEMS.coral = {
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
};
