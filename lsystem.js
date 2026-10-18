// L-system grammar generation and the symbol -> Turtle call mapping.
//
// Rules map a symbol to its successor. A successor can be:
//   "FF"                                      deterministic
//   ["F[+F]F", "F[-F]F"]                      stochastic, equal chance
//   [{ successor: "F[+F]F", weight: 2 }, ...] stochastic, weighted
// Symbols without a rule are copied unchanged.
//
// Usage:
//   const system = new LSystem("A", {
//     A: "[&FL!A]/////'[&FL!A]///////'[&FL!A]",
//     F: "S/////F",
//     S: "FL",
//   });
//   const turtle = new Turtle("tree", { x: 0, y: 300, z: 800 }, OBJECTS, { angle: 22.5 });
//   runTurtle(turtle, system.generate(4));

class LSystem {
  constructor(axiom, rules, random = Math.random) {
    this.axiom = axiom;
    this.rules = rules;
    this.random = random;
  }

  pickSuccessor(symbol) {
    const rule = this.rules[symbol];
    if (rule === undefined) return symbol;
    if (typeof rule === "string") return rule;

    const options = rule.map((option) =>
      typeof option === "string" ? { successor: option, weight: 1 } : option
    );
    const total = options.reduce((sum, option) => sum + (option.weight ?? 1), 0);

    let pick = this.random() * total;
    for (const option of options) {
      pick -= option.weight ?? 1;
      if (pick < 0) return option.successor;
    }
    return options[options.length - 1].successor;
  }

  step(sentence) {
    const next = [];
    for (const symbol of sentence) {
      next.push(this.pickSuccessor(symbol));
    }
    return next.join("");
  }

  generate(iterations) {
    let sentence = this.axiom;
    for (let i = 0; i < iterations; i++) {
      sentence = this.step(sentence);
    }
    return sentence;
  }
}

// Symbol -> Turtle call (symbols follow "The Algorithmic Beauty of Plants").
// Each entry gets the turtle; methods fall back to the turtle's own
// `angle` and `length` when no value is passed.
const TURTLE_COMMANDS = {
  F: (turtle) => turtle.forward(), // move forward and draw a branch
  G: (turtle) => turtle.forward(), // same as F, handy for a second rule
  f: (turtle) => turtle.move(), // move forward without drawing
  "+": (turtle) => turtle.turnLeft(), // yaw left
  "-": (turtle) => turtle.turnRight(), // yaw right
  "&": (turtle) => turtle.pitchDown(), // pitch down
  "^": (turtle) => turtle.pitchUp(), // pitch up
  "\\": (turtle) => turtle.rollLeft(), // roll left
  "/": (turtle) => turtle.rollRight(), // roll right
  "|": (turtle) => turtle.turnAround(), // turn 180 degrees
  $: (turtle) => turtle.rollToVertical(), // roll so left is horizontal
  "[": (turtle) => turtle.push(), // save state (start a branch)
  "]": (turtle) => turtle.pop(), // restore state (end a branch)
  "!": (turtle) => turtle.scaleRadius(), // make branches thinner
  '"': (turtle) => turtle.scaleLength(), // make branches shorter
  "'": (turtle) => turtle.nextColor(), // switch to the next palette color
};

// Feeds every symbol of `sentence` to the turtle. Symbols missing from
// `commands` (like A, X, L, S) are ignored.
const runTurtle = (turtle, sentence, commands = TURTLE_COMMANDS) => {
  for (const symbol of sentence) {
    const command = commands[symbol];
    if (command) command(turtle);
  }
};

// Generates and draws a whole L-system described by a config:
//   { name, axiom, rules, iterations, position: {x, y, z}, turtle: {...Turtle options} }
// The branches are pushed into `shapes`.
const renderLSystem = (config, shapes) => {
  const system = new LSystem(config.axiom, config.rules);
  const sentence = system.generate(config.iterations);
  const turtle = new Turtle(config.name, config.position, shapes, config.turtle);

  runTurtle(turtle, sentence);
  return turtle;
};
