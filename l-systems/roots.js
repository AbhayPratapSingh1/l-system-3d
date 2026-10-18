// Roots: the turtle turns around (|) to grow downward, and each random
// split gets shorter and thinner.
L_SYSTEMS.roots = {
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
};
