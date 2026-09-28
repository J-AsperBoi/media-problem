# Ari: our one central character

**What this is:** `character.js` draws **Ari**, the one person the viewer stands next to in every snippet and film. Ari is drawn entirely in code, so every film shows exactly the same character. There is no redrawing and no drift. The reference picture (the "model sheet") is `output/snippets/ari-model-sheet/ari-model-sheet.png`. The full design reasoning, with sources, is in `research/FILM_GRAMMAR.md` section 3.

## Who Ari is
An ordinary person holding one green fragment: one piece of an answer that already exists. Ari has no age, gender or ethnicity cues, so as many viewers as possible can see themselves in Ari. Their name works in many languages. Ari is never a hero or a victim. They are the person the red is walking towards, and the viewer feels for them.

## The design rules (don't break these)
- **4 heads tall.** A big, soft egg-shaped head (warmth, but not a child), with no ears or nose from the front.
- **Big eyes do the acting.** More eye white reads as fear, bigger pupils as tenderness, and a lowered lid as tired or sad.
- **Thick brows and a single mouth line.** Simple faces invite viewers to project themselves into them.
- **Signature: the dark hair cap with one tuft sticking up on the left.** It's how you recognise Ari even when they're tiny. When Ari is very small on screen (under 60 px tall), the code automatically draws a simple silhouette with an extra-big tuft.
- **Clothes:** a gray hoodie with the hood down, darker trousers and plain shoes. No logos.
- **Only grays.** Skin is a warm gray. The *only* colour ever on Ari is the green glow from the fragment, which lights their chin. Red and green stay reserved for the threat and the solution.
- **Light outline** around the whole silhouette, so Ari stands out on the dark background.

## The dials
Each film sets Ari's look with a few dials.

| Dial | What it does |
|---|---|
| `framing` | `full` (whole body), `waist`, `close` (head and collar), `eyes-ecu` (the eyes fill the screen) |
| `expression` | One of 8 named faces: **calm, notice, worry, fear, awe, grief, resolve, tenderness**. You can also set the raw face dials yourself: `brow` (angle), `browY` (height), `white` (how much eye white shows), `pupil` (size), `lid` (how far the upper lid is lowered), `mouth` (frown to smile), `open` (mouth opening) |
| expression over time | `[[0, 'calm'], [1.2, 'fear']]` changes the face at 1.2 s and blends smoothly over 0.3 s |
| `pose` | `armL`/`armR` (0 = down, 1 = up), `headTilt`, `lean`, `slump` (0 to 1: defeat), `turn` (0 = front, 0.55 = three-quarter view) |
| `look` | where the pupils point, e.g. `[1, 0]` = right, `[0, 1]` = down |
| `hold`, `glow` | cupped hands holding the green fragment; glow 0 to 2 |
| `t` | time. Ari breathes and blinks by themselves. Set `idle: false` to freeze Ari completely |

## How a snippet uses Ari
```js
const L = require('../../tools/lib.js')(SERIF, HAND);
const A = require('../../tools/character.js')(L);
function draw(ctx, t) {
  ctx.fillStyle = '#161a21'; ctx.fillRect(0, 0, 1080, 1920);
  // Close-up: calm, then fear at 1.2 s, holding a bright fragment, looking right
  A.ari(ctx, 540, 960, 1, { framing: 'close', t, hold: true, glow: 1.3,
    expression: [[0, 'calm'], [1.2, 'fear']], look: [0.8, 0] });
}
```
For a camera move (for example, pushing in from the full body to the eyes), draw Ari once at full size and move the camera using `A.cameraFor('eyes-ecu', x, y)` as an `L.camera` keyframe.

## Tradeoffs to know about
- The three-quarter view is a 2D approximation: the face, collar and far arm slide over, and an ear and a nose tick appear. It works up to about `turn: 0.6`. True profile and back views aren't drawn yet.
- The hands are simple mittens with a thumb. Finger lines appear only in close shots.

## Moving Ari to 3D later
Ari was designed so the same person can be built in 3D (for example, in Blender). The head becomes a soft, sphere-like shape and the body a capsule, with matte clay- or felt-like materials. The eyes become separate white shapes with pupils painted on. The same dials become "blend shapes" (preset face shapes that can be mixed), so an expression name like `fear` means the same thing in both versions. The lens guide is 85 mm for eye close-ups, 50 mm for close-ups and 24 mm for wide shots. The tuft stays: it's the silhouette signature.

← Back to [tools](README.md)
