// Vine: a stem that twists as it climbs, with a green leaf sprig every step.
L_SYSTEMS.vine = {
  name: "vine",
  axiom: "A",
  rules: {
    A: "F/[&&'L]//+A",
    L: "F[+F][-F]",
  },
  iterations: 40,
  position: { x: 0, y: 300, z: 900 },
  turtle: { angle: 20, length: 14, radius: 4 },
};
