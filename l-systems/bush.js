// Stochastic bush: every F picks one of the successors at random,
// so each reset grows a different bush.
L_SYSTEMS.bush = {
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
};
