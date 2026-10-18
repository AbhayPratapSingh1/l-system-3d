// 3D Hilbert curve (fig. 1.8), filling a cube centered on the screen.
L_SYSTEMS.hilbert = {
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
};
