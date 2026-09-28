// Snippet #1: hook-eyes-ecu (3.0 s). Feature: extreme close-up on the eyes from frame 1.
// Params (research/FILM_GRAMMAR.md §4 row 1): zoom 5.0 on the eyes from frame 1; drift +3% over the hold (ease inOut);
// expression preset 'notice'; green glow from the held fragment lights the chin. Locked-off otherwise, drone only.
function makeScene(SERIF, HAND) {
  const L = require('../../tools/lib.js')(SERIF, HAND);
  const A = require('../../tools/character.js')(L);
  const DUR = 3.0, BG = '#161a21';
  const FX = 540, FY = 1700;                       // Ari's feet (drawn once at full size; the camera does the framing)
  const [cx, cy, z] = A.cameraFor('eyes-ecu', FX, FY); // zoom 5.0, eyes at frame centre
  const EYE_Y = cy + 20;                           // eye line (head centre -1000 + 20)
  const CAM = [[0, [cx, EYE_Y, z, 0]], [DUR, [cx, EYE_Y, z * 1.03, 0]]]; // +3% drift, inOut

  function draw(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    ctx.save(); L.camera(ctx, CAM, t);
    A.ari(ctx, FX, FY, 1, { t, seed: 7, expression: 'notice', hold: true, glow: 1.6 });
    ctx.restore();
    L.slate(ctx, 'hook-eyes-ecu · extreme close-up');
  }
  return { draw, DUR, acts: [{ start: 0, end: DUR, bpm: 0, drone: true }], cues: [] };
}
if (typeof module !== 'undefined') module.exports = makeScene;
