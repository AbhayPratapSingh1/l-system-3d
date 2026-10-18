// Bush from "The Algorithmic Beauty of Plants" (fig. 1.25)
L_SYSTEMS.tree = {
  name: "tree",
  axiom: "A",
  rules: {
    A: "[&FL!A]/////'[&FL!A]///////'[&FL!A]",
    F: "S/////F",
    S: "FL",
  },
  iterations: 5,
  position: { x: 0, y: 300, z: 900 },
  turtle: { angle: 22.5, radius: 12 },
};
