// Pine: whorls of 4 drooping branches, each level shorter and thinner.
L_SYSTEMS.pine = {
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
};
