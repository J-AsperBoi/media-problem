// Snippet #3: slow-push-in (4.0 s). Feature: slow push-in towards the eyes.
// Params (research/FILM_GRAMMAR.md §4 row 3): zoom 1.6 -> 2.2 over the whole 4.0 s (ease inOut), target = eyes;
// expression calm -> worry at 3.0 s. Everything else neutral: no red, no green, drone only.
function makeScene(SERIF, HAND) {
  const L = require('../../tools/lib.js')(SERIF, HAND);
  const A = require('../../tools/character.js')(L);
  const DUR = 4.0, BG = '#161a21';
  const FX = 540, FY = 1700;
  const EYES = FY - 980;                 // eye line in design space
  const START = FY - 860;                // at zoom 1.6 frame a little lower (head + chest), ending centred on the eyes
  const CAM = [[0, [FX, START, 1.6, 0]], [DUR, [FX, EYES, 2.2, 0]]];

  function draw(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    ctx.save(); L.camera(ctx, CAM, t);
    A.ari(ctx, FX, FY, 1, { t, seed: 9, expression: [[0, 'calm'], [3.0, 'worry']], look: [0, 0] });
    ctx.restore();
    L.slate(ctx, 'slow-push-in · slow push-in');
  }
  return { draw, DUR, acts: [{ start: 0, end: DUR, bpm: 0, drone: true }], cues: [] };
}
if (typeof module !== 'undefined') module.exports = makeScene;
