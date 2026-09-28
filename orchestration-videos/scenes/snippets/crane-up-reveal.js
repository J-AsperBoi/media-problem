// Snippet #4: crane-up-reveal (5.0 s). Feature: pull-out / crane up (the OUT beat, the look-up).
// Params (research/FILM_GRAMMAR.md §4 row 4): hold close 0.5 s; pull out over 3.0 s (ease inOut); the frame drifts
// 200 px (crane feel); hold wide 1.5 s: hundreds of gray figures, red spreading, green points scattered.
// Deliberate change: the wide end is zoom 0.045, not 0.2 (see notes.md: at 0.2 Ari is 230 px, 12% of frame,
// which can't show "hundreds" or meet §2.1's "Ari <= 3% of frame"). Zoom is interpolated in log space.
// The WORLD block below is identical in drop-back-in-closer.js, so the two cut together (red clock continues).
function makeScene(SERIF, HAND) {
  const L = require('../../tools/lib.js')(SERIF, HAND);
  const A = require('../../tools/character.js')(L);
  const DUR = 5.0;

  // ================= WORLD (identical in crane-up-reveal.js and drop-back-in-closer.js) =================
  const BG = '#161a21', CROWD = '#5d626b', ARI_SIL = '#9aa0aa';
  const Z_WIDE = 0.045, Z_CLOSE = 3.0, CRANE_PX = 200;   // Ari 52 px tall at Z_WIDE (2.7% of frame height)
  const CY_CLOSE = -960, CY_WIDE = -575, CY_EYES = -980; // camera centre heights (world y, Ari's feet at 0,0)
  const SIL_K = 1150 / 640;                              // Ari's silhouette geometry is ~640 units tall; match 1150
  // Crowd: jittered grid, seeded once at setup. Clearing around Ari so neighbours never crowd the close shot.
  const crowd = (() => { const r = L.rng(42), out = [];
    for (let gy = -27000; gy <= 22000; gy += 1250) for (let gx = -17000; gx <= 17000; gx += 800) {
      const x = gx + (r() - 0.5) * 500, y = gy + (r() - 0.5) * 600, s = 0.9 + r() * 0.2;
      if (Math.abs(x) < 1500 && Math.abs(y) < 2300) continue; out.push({ x, y, s, green: false, seed: r() }); }
    // five other fragment holders (Ari is the sixth), placed where the red doesn't reach during either clip
    [[-8000, -11000], [-10000, 6000], [7000, 9000], [1500, -3800], [-4000, 15000]].forEach(([hx, hy]) => {
      let best = null, bd = 1e18; out.forEach(p => { const d = (p.x - hx) ** 2 + (p.y - hy) ** 2; if (d < bd) { bd = d; best = p; } }); best.green = true; });
    return out.sort((a, b) => a.y - b.y); })();
  // Red: a front spreading from far upper-right. World clock c (s): crane-up-reveal uses c = t, drop-back uses c = 5 + t.
  // Illustrative speed only (a feature snippet, not a data film): radius grows 1400 world units/s.
  const RO = [14000, -22000], R0 = 9000, RV = 1400;
  const redR = (ang, c) => (R0 + RV * c) * (1 + 0.12 * (L.noise(ang * 2.2 + 10, 5) - 0.5) + 0.05 * (L.noise(ang * 7 + c * 0.4, 8) - 0.5));
  const redness = (x, y, c) => { const dx = x - RO[0], dy = y - RO[1], d = Math.hypot(dx, dy); return L.clamp((redR(Math.atan2(dy, dx), c) - d) / 500 + 0.5, 0, 1); };
  const mixCol = (f) => { const a = [0x5d, 0x62, 0x6b], b = [0xff, 0x3b, 0x30]; return `rgb(${a.map((v, i) => Math.round(L.lerp(v, b[i], f))).join(',')})`; };
  // Ari's small-size silhouette shape (same geometry as character.js silhouette mode), scaled to full body height.
  function sil(ctx, x, y, s, col, green, glow = 1) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s * SIL_K, s * SIL_K); ctx.fillStyle = col; ctx.strokeStyle = BG; ctx.lineWidth = 16; ctx.lineJoin = 'round';
    const fs = () => { ctx.stroke(); ctx.fill(); };   // dark edge first so overlapping figures stay separate
    ctx.save(); ctx.translate(-40, -515); ctx.beginPath(); ctx.moveTo(-30, 10); ctx.quadraticCurveTo(-60, -60, -95, -120);
    ctx.quadraticCurveTo(-20, -90, 40, 5); ctx.closePath(); fs(); ctx.restore();
    ctx.beginPath(); ctx.roundRect(-78, -330, 156, 330, [30, 30, 12, 12]); fs();
    ctx.beginPath(); ctx.ellipse(0, -420, 110, 115, 0, 0, Math.PI * 2); fs();
    if (green) { const g = ctx.createRadialGradient(0, -250, 0, 0, -250, 260); g.addColorStop(0, `rgba(52,210,123,${(0.55 * glow).toFixed(3)})`); g.addColorStop(1, 'rgba(52,210,123,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, -250, 260, 0, Math.PI * 2); ctx.fill(); ctx.fillStyle = L.GREEN; ctx.beginPath(); ctx.arc(0, -250, 62, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  // Camera: world point (x, y) at screen centre, zoom z, plus a screen-space crane offset (px, + = frame moved up).
  function cam(ctx, x, y, z, crane) { ctx.translate(540, 960 + crane); ctx.scale(z, z); ctx.translate(-x, -y); }
  const logZ = (a, b, f) => Math.exp(L.lerp(Math.log(a), Math.log(b), f));
  // Draw the world at camera (x, y, z, crane), red clock c, Ari's expression keys.
  function world(ctx, t, c, x, y, z, crane, ariOpts) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    ctx.save(); cam(ctx, x, y, z, crane);
    // visible world rect for culling
    const hw = 560 / z, hh = 980 / z, vx0 = x - hw - 1200, vx1 = x + hw + 1200, vy0 = y - (960 + crane) / z - 2200, vy1 = y + (960 - crane) / z + 300;
    // faint red ground wash inside the front
    ctx.beginPath(); for (let i = 0; i <= 120; i++) { const a = i / 120 * Math.PI * 2, r = redR(a, c); const px = RO[0] + Math.cos(a) * r, py = RO[1] + Math.sin(a) * r; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    ctx.closePath(); ctx.fillStyle = 'rgba(255,59,48,0.10)'; ctx.fill();
    // Crowd reads as soft background when large on screen (keeps the close shots about Ari), crisp when small.
    const crowdA = L.clamp(1 - (1150 * z - 150) / 400, 0.3, 1);
    let ariDrawn = false;
    const drawAri = () => { ariDrawn = true;
      if (1150 * z < 62) sil(ctx, 0, 0, 1, ARI_SIL, true, 1.2);
      else A.ari(ctx, 0, 0, 1, { t, seed: 3, hold: true, glow: 1.2, ...ariOpts }); };
    for (const p of crowd) {
      if (!ariDrawn && p.y > 0) drawAri();
      if (p.x < vx0 || p.x > vx1 || p.y < vy0 || p.y > vy1) continue;
      const f = p.green ? 0 : redness(p.x, p.y, c);
      ctx.globalAlpha = crowdA; sil(ctx, p.x, p.y, p.s, f > 0 ? mixCol(f) : CROWD, p.green, 0.9 + 0.2 * Math.sin(t * 2.6 + p.seed * 6)); ctx.globalAlpha = 1;
    }
    if (!ariDrawn) drawAri();
    ctx.restore();
  }
  // ================= end WORLD =================

  const T_HOLD = 0.5, T_PULL = 3.0;          // hold close 0.5 s, pull 3.0 s, hold wide 1.5 s
  function draw(ctx, t) {
    const f = L.ease.inOut(L.clamp((t - T_HOLD) / T_PULL, 0, 1));
    const z = logZ(Z_CLOSE, Z_WIDE, f), cy = L.lerp(CY_CLOSE, CY_WIDE, f), crane = CRANE_PX * f;
    world(ctx, t, t, 0, cy, z, crane, { expression: 'calm' });
    L.slate(ctx, 'crane-up-reveal · pull-out / crane up');
  }
  return { draw, DUR, acts: [{ start: 0, end: DUR, bpm: 0, drone: true }], cues: [] };
}
if (typeof module !== 'undefined') module.exports = makeScene;
