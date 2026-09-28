// Snippet #8: silence-then-hit (3.0 s). Feature: silence before a single hit.
// Params (research/FILM_GRAMMAR.md §4 row 8): near-silence 1.2 s; one 'hit' at 1.2 s synced to a hard cut from
// Ari's face to the green pieces snapping together.
// Sound: NO acts at all, so 0–1.2 s is digital silence (the hardest version of "near-silence"). One 'hit' cue
// at exactly 1.2 s, the cut frame (frame 36 at 30 fps). Nothing else, ever.
function makeScene(SERIF, HAND) {
  const L = require('../../tools/lib.js')(SERIF, HAND);
  const A = require('../../tools/character.js')(L);
  const DUR = 3.0, BG = '#161a21', T_CUT = 1.2, SNAP = 0.067;
  const TAU = Math.PI * 2;
  // The whole: an irregular 12-sided green shape (r ~ 190) split into 4 wedge pieces around its centre.
  const R = [190, 170, 200, 176, 186, 204, 168, 192, 180, 198, 172, 188];
  const OUT = R.map((r, i) => { const a = i / R.length * TAU - Math.PI / 2 + 0.1; return [Math.cos(a) * r, Math.sin(a) * r]; });
  const CORE = [8, -6];   // off-centre seam point
  const PIECES = [0, 1, 2, 3].map(k => { const pts = [CORE]; for (let i = k * 3; i <= k * 3 + 3; i++) pts.push(OUT[i % OUT.length]);
    const mid = pts.slice(1).reduce((s, p) => [s[0] + p[0] / 4, s[1] + p[1] / 4], [0, 0]), l = Math.hypot(mid[0], mid[1]);
    return { pts, dir: [mid[0] / l, mid[1] / l], rot: (k % 2 ? 1 : -1) * 0.12 }; });
  const CX = 540, CY = 900;

  function face(ctx, t) {   // shot 1: close-up, held almost still (the visual half of the silence)
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    A.ari(ctx, 540, 1000, 1, { framing: 'close', t, seed: 9, blink: false, hold: true, glow: 0.9,
      expression: { preset: 'notice', lid: 0.1 }, look: [0, 0.35] });
  }

  function pieces(ctx, lt) {  // shot 2: pieces snap shut within 2 frames of the cut, then hold as one
    ctx.fillStyle = '#12151b'; ctx.fillRect(0, 0, 1080, 1920);
    ctx.save(); ctx.translate(CX, CY); ctx.scale(1.45, 1.45); ctx.translate(-CX, -CY);   // pieces fill ~half the width
    const f = L.ease.out(L.clamp(lt / SNAP, 0, 1)), gap = (1 - f) * 70, spin = 1 - f;
    const settle = lt > SNAP ? Math.exp(-(lt - SNAP) * 9) * Math.sin((lt - SNAP) * 40) * 6 : 0;   // tiny recoil after the lock
    // glow: jumps on the lock, then settles to a steady bright level
    const g = lt < SNAP ? 0.5 : 1 + 0.6 * Math.exp(-(lt - SNAP) * 3);
    const grd = ctx.createRadialGradient(CX, CY, 40, CX, CY, 330 * (0.8 + 0.3 * g));
    grd.addColorStop(0, `rgba(52,210,123,${(0.32 * g).toFixed(3)})`); grd.addColorStop(1, 'rgba(52,210,123,0)');
    ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(CX, CY, 420, 0, TAU); ctx.fill();
    PIECES.forEach(p => {
      ctx.save(); ctx.translate(CX + p.dir[0] * (gap + settle), CY + p.dir[1] * (gap + settle)); ctx.rotate(p.rot * spin);
      ctx.beginPath(); p.pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath();
      ctx.fillStyle = L.GREEN; ctx.fill(); ctx.lineJoin = 'round'; ctx.lineWidth = 5; ctx.strokeStyle = '#a6f5c8'; ctx.stroke();
      ctx.restore();
    });
    // seams fade once locked: the pieces become one
    if (lt > SNAP) { ctx.save(); ctx.globalAlpha = L.clamp((lt - SNAP) / 0.6, 0, 1);
      ctx.beginPath(); OUT.forEach(([x, y], i) => i ? ctx.lineTo(CX + x, CY + y) : ctx.moveTo(CX + x, CY + y)); ctx.closePath();
      ctx.fillStyle = L.GREEN; ctx.fill(); ctx.lineWidth = 5; ctx.strokeStyle = '#a6f5c8'; ctx.stroke(); ctx.restore(); }
    // one ring on the lock frame
    if (lt >= SNAP && lt < SNAP + 0.5) { const u = (lt - SNAP) / 0.5; ctx.strokeStyle = `rgba(166,245,200,${(0.7 * (1 - u)).toFixed(3)})`;
      ctx.lineWidth = 8 * (1 - u) + 1; ctx.beginPath(); ctx.arc(CX, CY, 210 + 260 * L.ease.out(u), 0, TAU); ctx.stroke(); }
    ctx.restore();
  }

  function draw(ctx, t) {
    if (t < T_CUT) face(ctx, t); else pieces(ctx, t - T_CUT);
    L.slate(ctx, 'silence-then-hit · silence before a hit');
  }
  return { draw, DUR, acts: [], cues: [{ t: T_CUT, type: 'hit' }] };
}
if (typeof module !== 'undefined') module.exports = makeScene;
