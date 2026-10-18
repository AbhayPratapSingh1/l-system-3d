# L-System 3D

Interactive 3D L-systems in the browser: trees, ferns, pines, a Hilbert curve, seashells, coral, lightning and more. Each one is grown from a grammar and drawn by a 3D turtle.

**Live demo:** https://l-system-3d.vercel.app/

The 3D rendering is done by hand. The page uses p5.js only for its 2D canvas and vector math, not WEBGL. Every branch is a polygonal cylinder, and the code projects, clips, culls and depth-sorts the faces itself.

## Features

- **11 built-in L-systems**: `tree`, `bush`, `plant`, `pine`, `hilbert`, `shell`, `dragon`, `roots`, `coral`, `lightning`, `vine`
- **Deterministic and stochastic rules**, including weighted random successors
- **Full 3D turtle** (yaw, pitch, roll, branching stack, length and radius scaling, color palettes), using the symbols from *The Algorithmic Beauty of Plants*
- **Live tweaking**: change iterations, turn angle, branch length, radius, sides and scale factors with the keyboard and see the result right away
- **Free camera**: look, roll, move and zoom around the scene

## Built-in L-systems

Rules are written as `symbol → successor`. When a symbol has several successors listed, each rewrite picks one of them at random with equal chance. Any turtle option not listed uses its default (see [Turtle options](#turtle-options)). The app starts on `hilbert`.

### 1. tree

Bush from *The Algorithmic Beauty of Plants* (fig. 1.25).

```
axiom:      A
A → [&FL!A]/////'[&FL!A]///////'[&FL!A]
F → S/////F
S → FL
iterations: 5
turtle:     angle 22.5, radius 12
```

### 2. bush

Stochastic bush. Each `F` picks one of three successors, so every redraw (`R`) grows a different bush.

```
axiom:      [&F]///[&F]///[&F]///[&F]///[&F]
F → F[&+F]F[^-F]  |  F[\&F]/F  |  F[/^F]F[&F]
iterations: 3
turtle:     angle 30, length 40, radius 6, radiusScale 0.8
palette:    green (#2e7d32, #43a047)
```

### 3. plant

Fractal plant: the stem doubles (`F → FF`) while `X` keeps branching.

```
axiom:      X
X → F[&+X]//[&-X]///F[^X]\\X
F → FF
iterations: 4
turtle:     angle 22.5, length 16, radius 3
```

### 4. pine

Whorls of 4 drooping branches. Each level is shorter (`"`) and thinner (`!`).

```
axiom:      FA
A → !FF[&&&&'B]///[&&&&'B]///[&&&&'B]///[&&&&'B]"/A
B → F[+F][-F]B
iterations: 9
turtle:     angle 30, length 32, radius 10, lengthScale 0.85, radiusScale 0.8
```

### 5. hilbert

3D Hilbert curve (fig. 1.8), filling a cube centered on the screen.

```
axiom:      A
A → B-F+CFC+F-D&F^D-F+&&CFC+F+B//
B → A&F^CFB^F^D^^-F-D^|F^B|FC^F^A//
C → |D^|F^B-F+C^F^A&&FA&F^C+F+B^F^D//
D → |CFB-F+B|FA&F^A&&FB-F+B|FC//
iterations: 4
turtle:     angle 90, length 100, radius 5, sides 4
```

### 6. shell

Seashell: one helix whose steps (`"`) and thickness (`!`) grow on every turn, because both scales are above 1. The helix opens out into a cone.

```
axiom:      A
A → F+^"!A
iterations: 120
turtle:     angle 12, length 6, radius 1.5, lengthScale 1.02, radiusScale 1.02
palette:    sand (#f5deb3, #d2b48c)
```

### 7. dragon

3D dragon curve: the classic X/Y dragon with every other fold pitched out of the plane.

```
axiom:      FX
X → X+YF&
Y → ^FX-Y
iterations: 8
turtle:     angle 90, length 18, radius 3, sides 4
palette:    purple (#5e35b1, #7e57c2)
```

### 8. roots

The turtle turns around (`|`) to grow downward, and each random split gets shorter and thinner.

```
axiom:      |A
A → F"[&+!A][^-!A]  |  F"[\&!A]/[^!A]A  |  F/A
iterations: 7
turtle:     angle 28, length 70, radius 12, lengthScale 0.85, radiusScale 0.75
```

### 9. coral

Three arms that each fork three ways, alternating between orange and pink.

```
axiom:      [A]///[&A]///[^A]
A → F"![&+'A]/[^-A]//[&A]
iterations: 5
turtle:     angle 35, length 80, radius 14, lengthScale 0.8, radiusScale 0.75
palette:    orange (#ff7043, #ff8a65), pink (#ec407a, #f06292)
```

### 10. lightning

A zig-zag bolt striking downward. Each step adds one random kink or a thinner side bolt (`B`) that zig-zags on its own.

```
axiom:      |A
A → F+F-A  |  F-F+A  |  F&F^A  |  F^F&A  |  F[&+!B]A  |  F[^-!B]A
B → F+F-B  |  F-F+B  |  F&F^B  |  F
iterations: 20
turtle:     angle 35, length 14, radius 4, radiusScale 0.6
palette:    yellow (#ffd600, #fff59d)
```

### 11. vine

A stem that twists as it climbs, with a green leaf sprig at every step.

```
axiom:      A
A → F/[&&'L]//+A
L → F[+F][-F]
iterations: 40
turtle:     angle 20, length 14, radius 4
```

In the stochastic rules above, `  |  ` separates the choices. A `|` with no spaces around it, as in `hilbert` and `roots`, is the turn-around symbol.

## Keyboard mappings

Keys are case-insensitive. The L-system keys act once per key press and redraw the scene. The camera keys act every frame while you hold them down. The on-screen HUD shows the current L-system, the last action and the current value of every setting, plus the shape count and frame rate in the top-right corner.

### L-system

| Keys      | Action                         |
| --------- | ------------------------------ |
| `N` / `M` | previous / next L-system       |
| `J` / `K` | fewer / more iterations        |
| `R`       | redraw and reset camera        |
| `T` / `Y` | less / more turn angle         |
| `U` / `I` | less / more branch length      |
| `O` / `P` | less / more branch radius      |
| `G` / `H` | fewer / more branch sides      |
| `V` / `B` | less / more length scale (`"`) |
| `,` / `.` | less / more radius scale (`!`) |
| `[` / `]` | less / more stroke opacity     |

How much each key press changes a setting:

| Setting       | Keys      | Step per press           | Limit     |
| ------------- | --------- | ------------------------ | --------- |
| iterations    | `J` / `K` | ±1                       | min 0     |
| turn angle    | `T` / `Y` | ±2.5°                    | min 0     |
| branch length | `U` / `I` | ×1.1 / ÷1.1              | none      |
| branch radius | `O` / `P` | ×1.2 / ÷1.2              | none      |
| branch sides  | `G` / `H` | ±1                       | min 3     |
| length scale  | `V` / `B` | ±0.05                    | min 0.05  |
| radius scale  | `,` / `.` | ±0.05                    | min 0.05  |
| stroke opacity| `[` / `]` | ±0x11 alpha              | 00 – FF   |

Changes are kept per L-system while the page is open. Switching away and back keeps your tweaks, and reloading the page restores the defaults. High iteration counts grow exponentially and can make the page slow.

### Camera

| Keys      | Action              |
| --------- | ------------------- |
| `↑` / `↓` | look up / down (1° per frame)    |
| `←` / `→` | look left / right (1° per frame) |
| `Z` / `C` | roll (1° per frame)              |
| `W` / `S` | move up / down (10 px per frame)      |
| `A` / `D` | move left / right (10 px per frame)   |
| `Q` / `E` | move forward / back (10 px per frame) |
| `-` / `=` | zoom out / in (10 px per frame)       |

The eye never actually moves. The camera keys move and rotate every shape around the origin instead, which is why `R` also resets the camera. Changing iterations or a turtle setting keeps the camera where it is, while `R` and switching L-systems (`N` / `M`) put it back at its start. The stroke opacity keys only restyle the shapes already drawn, so a random L-system keeps its shape.

## Turtle symbols

| Symbol | Meaning                                 |
| ------ | --------------------------------------- |
| `F`, `G` | move forward and draw a branch        |
| `f`    | move forward without drawing            |
| `+` / `-` | yaw left / right                     |
| `&` / `^` | pitch down / up                      |
| `\` / `/` | roll left / right                    |
| `\|`   | turn around (180°)                      |
| `$`    | roll so the turtle's left is horizontal |
| `[` / `]` | push / pop state (start / end a branch) |
| `!`    | scale the branch radius                 |
| `"`    | scale the branch length                 |
| `'`    | switch to the next palette color        |

The turtle ignores any other symbol (`A`, `X`, `L`, ...). Those symbols only matter to the rewriting rules.

## Running locally

There is no build step. Serve the folder with any static file server:

```sh
npx serve .
# or
python3 -m http.server
```

Then open the URL it prints. p5.js is loaded from a CDN. `npm install` is only needed if you want the `@types/p5` editor types.

## Adding your own L-system

Create a file in `l-systems/`, e.g. `l-systems/fern.js`:

```js
L_SYSTEMS.fern = {
  name: "fern",
  axiom: "X",
  rules: {
    X: "F[&+X]//[&-X]F",                  // deterministic
    F: ["FF", "F", { successor: "FFF", weight: 0.5 }], // stochastic, weighted
  },
  iterations: 4,
  position: { x: 0, y: 300, z: 900 },     // where the turtle starts
  turtle: { angle: 25, length: 20, radius: 4 }, // any Turtle option
};
```

Then load it in `index.html`, after `lsystem.js` and before `sketch.js`:

```html
<script src="l-systems/fern.js"></script>
```

The order of these script tags is the order N / M cycles through.

### Turtle options

Turtle options and their defaults (see `TURTLE_DEFAULTS` in `turtle.js`):

| Option        | Default                      |
| ------------- | ---------------------------- |
| `angle`       | `25` (degrees)               |
| `length`      | `50`                         |
| `radius`      | `10`                         |
| `sides`       | `6`                          |
| `lengthScale` | `0.9`                        |
| `radiusScale` | `0.7`                        |
| `palette`     | brown and green color pairs  |
| `strokeColor` | `CONFIG.strokeColor` (`config.js`) |

## Project structure

```
index.html          entry point, loads p5.js and the scripts in order
config.js           shared settings (stroke color)
l-systems/*.js      one L-system config per file, each adds itself to L_SYSTEMS
sketch.js           keyboard controls, HUD, p5 setup/draw
lsystem.js          LSystem grammar rewriting + symbol → turtle command map
turtle.js           3D turtle (H/L/U orientation frame) that emits cylinders
src/render.js       3D → 2D pipeline: clip, back-face cull, depth sort, project
src/shapes.js       Cylinder shape
src/eyeCallbacks.js camera controls (moves the world around a fixed eye)
```

## How it works

1. **Rewrite**: `LSystem.generate(n)` applies the rules to the axiom `n` times. A rule given as an array picks one successor at random.
2. **Interpret**: `runTurtle` walks the resulting string and calls the turtle method for each symbol. The turtle keeps its orientation as three unit vectors: heading, left and up.
3. **Build geometry**: each `F` adds a `Cylinder` between the turtle's old and new positions, aligned with the turtle's frame.
4. **Render**: every frame, the faces are clipped against the near plane, back-face culled, sorted far to near (painter's algorithm), projected in perspective and drawn as 2D polygons.

## Credits

- Symbols and several grammars come from *The Algorithmic Beauty of Plants* by Przemysław Prusinkiewicz and Aristid Lindenmayer.
- The renderer, shapes and camera controls are adapted from [AbhayPratapSingh1/3d-shapes](https://github.com/AbhayPratapSingh1/3d-shapes).
- Built with [p5.js](https://p5js.org/).
