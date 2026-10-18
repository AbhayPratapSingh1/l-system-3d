// Fractal plant: the stem doubles (F -> FF) while X keeps branching.
L_SYSTEMS.plant = {
  name: "plant",
  axiom: "X",
  rules: {
    X: "F[&+X]//[&-X]///F[^X]\\\\X",
    F: "FF",
  },
  iterations: 4,
  position: { x: 0, y: 300, z: 900 },
  turtle: { angle: 22.5, length: 16, radius: 3 },
};
