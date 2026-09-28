// Snippet #2: red-at-the-edge (4.0 s). Feature: saturation isolation / colour at the frame edge.
// Params (research/FILM_GRAMMAR.md §4 row 2): wide on Ari (zoom 1.0), everything gray; red enters the right edge
// at 0.5 s and creeps left at 20 px/s, never more than 5% of the frame; Ari doesn't notice. Locked-off, drone only.
function makeScene(SERIF, HAND) {
  const L = require('../../tools/lib.js')(SERIF, HAND);
  const A = require('../../tools/character.js')(L);
  const DUR = 4.0, BG = '#161a21';
  const FX = 540, FY = 1535;                 // feet: 'full' framing at scale 1 centres the body in frame
  const T_IN = 0.5, SPEED = 20;              // red enters at 0.5 s, 20 px/s
  const RY0 = 760, RY1 = 1920;               // vertical extent of the red at the edge (street level and below)
  const FEATHER = 36;                        // soft leading glow (px)

  // Leading-edge x at height y: straight creep + a slow organic wobble (pure in t).
  const edgeX = (y, t, depth) => 1080 - depth - (L.noise(y / 90 + t * 0.6, 3) - 0.5) * 18 * Math.min(1, depth / 30)
    - 10 * Math.pow(Math.sin(Math.PI * (y - RY0) / (RY1 - RY0)), 0.6) * Math.min(1, depth / 30);

  function red(ctx, t) {
    const depth = Math.max(0, (t - T_IN) * SPEED);
    if (depth <= 0) return;
    const taper = y => { const u = (y - RY0) / 160; return u < 1 ? Math.sqrt(Math.max(0, u)) : 1; }; // rounded top end
    const pts = []; for (let y = RY0; y <= RY1; y += 12) pts.push([1080 - (1080 - edgeX(y, t, depth)) * taper(y), y]);
    // soft glow just ahead of the edge
    ctx.save(); ctx.globalAlpha = Math.min(1, depth / 20) * 0.35;
    for (let k = 3; k >= 1; k--) { ctx.beginPath(); ctx.moveTo(1080, RY0 - 20);
      pts.forEach(([x, y]) => ctx.lineTo(x - FEATHER * k / 3 * taper(y), y)); ctx.lineTo(1080, RY1); ctx.closePath();
      ctx.fillStyle = `rgba(255,59,48,${(0.25 / k).toFixed(3)})`; ctx.fill(); }
    ctx.restore();
    ctx.beginPath(); ctx.moveTo(1080, RY0); pts.forEach(([x, y]) => ctx.lineTo(x, y)); ctx.lineTo(1080, RY1); ctx.closePath();
    ctx.fillStyle = L.RED; ctx.fill();
  }

  function draw(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    ctx.fillStyle = '#1b2028'; ctx.fillRect(0, FY, 1080, 1920 - FY);           // ground
    ctx.strokeStyle = 'rgba(154,160,170,0.25)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, FY); ctx.lineTo(1080, FY); ctx.stroke();
    A.ari(ctx, FX, FY, 1, { t, seed: 4, expression: 'calm', look: [-0.35, 0.1] }); // looking away from the red
    red(ctx, t);
    L.slate(ctx, 'red-at-the-edge · edge colour');
  }
  return { draw, DUR, acts: [{ start: 0, end: DUR, bpm: 0, drone: true }], cues: [] };
}
if (typeof module !== 'undefined') module.exports = makeScene;
