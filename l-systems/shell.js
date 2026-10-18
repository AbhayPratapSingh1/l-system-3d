// Seashell: a single helix whose steps (") and thickness (!) grow every
// turn (scales above 1), so it opens into a cone.
L_SYSTEMS.shell = {
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
};
