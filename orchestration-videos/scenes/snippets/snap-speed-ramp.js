// Snippet #7: snap-speed-ramp (4.0 s). Feature: speed ramp (playback rate).
// Params (research/FILM_GRAMMAR.md §4 row 7): red spread at 1x for 1.5 s; rate ramps 1x -> 20x over 0.6 s (ease in); 1.9 s at 20x.
// The WHOLE world runs on one scene clock tau(t) = integral of rate: the red, the passers-by, Ari's breathing.
// Red spread: logistic share of the crowd (L.logistic, doubling 2.5 scene-s, start 3%), infected nearest-first from the far corner.
// Sound: one clock tick (kick) per scene-second, so the ticks accelerate with the ramp into a 20-per-second roll; drone under all.
function makeScene(SERIF, HAND) {
  const L = require('../../tools/lib.js')(SERIF, HAND);
  const A = require('../../tools/character.js')(L);
  const DUR = 4.0, BG = '#161a21', T0 = 1.5, RAMP = 0.6, RATE = 20, DOUBLING = 2.5, S0 = 0.03;
  // scene clock: tau(t). ease.in = f^3, whose integral over [0,1] is 1/4.
  const rate = t => t < T0 ? 1 : t < T0 + RAMP ? 1 + (RATE - 1) * L.ease.in((t - T0) / RAMP) : RATE;
  const tau = t => { if (t < T0) return t; if (t < T0 + RAMP) { const f = (t - T0) / RAMP; return T0 + RAMP * (f + (RATE - 1) * f ** 4 / 4); }
    return T0 + RAMP * (1 + (RATE - 1) / 4) + RATE * (t - T0 - RAMP); };

  // crowd: dots in rough perspective rows; infection rank = distance from the source + a little seeded jitter
  const rnd = L.rng(21), SRC = [960, 640], crowd = [];
  for (let row = 0; row < 16; row++) {
    const y = 360 + row * row * 2.6 + row * 22, r = 7 + row * 0.9, n = 18 - Math.floor(row * 0.35);
    for (let i = 0; i < n; i++) { const x = 70 + (i + 0.5) * (940 / n) + (rnd() - 0.5) * 34 + (row % 2) * 12;
      crowd.push({ x, y: y + (rnd() - 0.5) * 10, r, d: Math.hypot(x - SRC[0], (y - SRC[1]) * 1.4) + rnd() * 140 }); }
  }
  crowd.sort((a, b) => a.d - b.d); crowd.forEach((c, i) => c.q = (i + 0.5) / crowd.length);
  const GROUND = 1260;
  const WALKERS = [[1330, 150, 38, '#2a2f38', 0.0], [1350, -130, 700, '#2d323b', 0.5], [1310, 110, 900, '#282c35', 0.3]];

  function walker(ctx, x, feet, h, col, tt, ph) {
    const step = (tt * 2.2 + ph) % 1, bob = Math.abs(Math.sin(Math.PI * step)) * h * 0.025, hr = h * 0.13, bw = h * 0.3, top = feet - h + hr * 2 - bob;
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, feet - h + hr - bob, hr, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x - bw / 2, top + hr * 0.3, bw, h * 0.45, [bw * 0.35, bw * 0.35, 6, 6]); ctx.fill();
    const sw = Math.sin(Math.PI * 2 * step) * h * 0.07, legTop = top + hr * 0.3 + h * 0.42; ctx.lineCap = 'round'; ctx.strokeStyle = col; ctx.lineWidth = bw * 0.32;
    [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(x + d * bw * 0.2, legTop); ctx.lineTo(x + d * bw * 0.2 + d * sw, feet); ctx.stroke(); });
  }

  function draw(ctx, t) {
    const tt = tau(t), share = L.logistic(tt, DOUBLING, S0);
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    ctx.fillStyle = '#1b2028'; ctx.fillRect(0, GROUND, 1080, 1920 - GROUND);
    // crowd (far field)
    crowd.forEach(c => {
      const on = L.clamp((share - c.q) * crowd.length / 3, 0, 1);   // each dot turns over ~3 ranks, so the front is soft
      ctx.fillStyle = on > 0 ? `rgba(255,59,48,${(0.25 + 0.75 * on).toFixed(3)})` : '#3a3f48';
      if (on <= 0) { ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, 7); ctx.fill(); return; }
      ctx.fillStyle = '#3a3f48'; ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, 7); ctx.fill();
      ctx.fillStyle = L.RED; ctx.globalAlpha = on; ctx.beginPath(); ctx.arc(c.x, c.y, c.r, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
    });
    ctx.strokeStyle = 'rgba(154,160,170,0.18)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(0, GROUND); ctx.lineTo(1080, GROUND); ctx.stroke();
    // passers-by (mid field), same clock
    WALKERS.forEach(([fy, v, x0, col, ph]) => { const span = 1400, x = ((x0 + v * tt + 160) % span + span) % span - 160; walker(ctx, x, fy, 250, col, tt, ph); });
    // Ari (foreground), same clock: breathing and blinks speed up too
    A.ari(ctx, 540, 1830, 0.6, { t: tt, seed: 3, expression: 'calm', hold: true, glow: 1, look: [0.3, -0.4] });
    // rate readout: the dial being tested
    const a20 = L.sm(T0, T0 + RAMP, t);
    L.label(ctx, '1×', 100, 290, 64, { align: 'left', col: '#c9ccd2', alpha: 0.8 * (1 - a20) });
    L.label(ctx, '20×', 100, 290, 64, { align: 'left', col: '#c9ccd2', alpha: 0.8 * a20 });
    L.slate(ctx, 'snap-speed-ramp · speed ramp');
  }

  // One tick per scene-second: tick k falls at the film time where tau = k. Each tick gets its own act whose
  // bpm equals 1 / (gap to the next tick), so audio.js emits exactly one kick (+ offbeat hat) per scene-second.
  const inv = x => { let lo = 0, hi = DUR; for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; tau(m) < x ? lo = m : hi = m; } return (lo + hi) / 2; };
  const ticks = []; for (let k = 0; k <= Math.floor(tau(DUR)); k++) ticks.push(inv(k));
  const acts = [{ start: -2, end: DUR + 2, bpm: 0, drone: true }];
  ticks.forEach((a, i) => { const b = (ticks[i + 1] ?? a + 1 / RATE) - a; acts.push({ start: a, end: Math.min(DUR, a + b), bpm: 60 / b }); });
  return { draw, DUR, acts, cues: [] };
}
if (typeof module !== 'undefined') module.exports = makeScene;
