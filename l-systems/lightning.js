// Lightning: a zig-zag bolt striking down; each step adds one random kink
// or a thinner side bolt (B) that zig-zags on its own.
L_SYSTEMS.lightning = {
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
};
