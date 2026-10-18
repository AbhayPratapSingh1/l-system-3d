// 3D dragon curve: the classic X/Y dragon with every other fold pitched
// out of the plane.
L_SYSTEMS.dragon = {
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
};
