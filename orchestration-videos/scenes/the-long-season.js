// the-long-season: sports-play-by-play, stained glass, sport. Analog: penicillin-resistance-1946.
// Mapping: 1 film second = 1 season (year) while the clock runs (film 3-18 = years 0-15). See output/the-long-season/notes.md.
// Red: 60 scoreboard panes; pane k red when L.logistic(y, 0.56 derived, 0.125) >= (k+.5)/60 (fit; extrapolated past ~1.75 yr).
// Green: 12 players on separate benches; pass i lands at L.lognormalQuantile((i+.5)/12, 13, 69). Equalizer f3 = 13, answered f4 = 15.
// AI (illustrative): same quantiles x 2.5/13. The chemistry (13, 15) and the red board are identical in both replay panels.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('penicillin-resistance-1946');
  const DUR = 39, RED = L.RED, GREEN = L.GREEN;
  const STONE = '#121419', LEAD = '#07080a', PALE = '#e8e4da';

  // ---------- speed math ----------
  const DT = A.threat.doubling_time, S0 = A.threat.points[0].extent;       // 0.56 (derived), 0.125
  const ext = y => L.logistic(Math.max(0, y), DT, S0);
  const RATE = Math.LN2 / DT;
  const yearOfExt = x => Math.log(x * (1 - S0) / (S0 * (1 - x))) / RATE;     // inverse of the fit
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90; // 13, 69
  const AIMED = A.ai_counterfactual.aggregation_median;                        // 2.5 (assumption, position only)
  const EQ = A.solution.fragments.find(f => f.id === 'f3').ready_at;           // 13
  const ANS = A.solution.fragments.find(f => f.id === 'f4').ready_at;          // 15
  const NP = 12, QH = [], QA = [];
  for (let i = 0; i < NP; i++) { const q = L.lognormalQuantile((i + 0.5) / NP, MED, P90); QH.push(q); QA.push(q * AIMED / MED); }

  // film time -> year
  const yearAt = t => { if (t < 1.5) return 4; if (t < 1.95) return 4 * (1 - L.ease.inOut((t - 1.5) / 0.45)); if (t < 3) return 0; return Math.min(15, t - 3); };
  const tOfYear = y => 3 + y;

  const R = L.rng(1946);
  // ---------- scoreboard: rose window, 60 panes ----------
  const BC = [540, 405], BR = 280;
  const rings = [[0, 0.2, 1], [0.2, 0.46, 11], [0.46, 0.73, 20], [0.73, 1, 28]];
  const panes = [];
  rings.forEach(([r0, r1, n], ri) => { for (let k = 0; k < n; k++) panes.push({ r0, r1, a0: -Math.PI / 2 + k / n * Math.PI * 2 + ri * 0.13, a1: -Math.PI / 2 + (k + 1) / n * Math.PI * 2 + ri * 0.13, lum: 62 + R() * 40, ri }); });
  const ord = panes.map((p, i) => ({ i, k: R() })).sort((a, b) => a.k - b.k);
  ord.forEach((o, k) => { const x = (k + 0.5) / panes.length; panes[o.i].redY = x <= S0 ? -1 : yearOfExt(Math.min(0.9999, x)); });

  // ---------- the league: pitch + 12 separate stadiums ----------
  const PC = [540, 1120], PR = 118;
  const stad = [];
  for (let i = 0; i < NP; i++) { const a = -Math.PI / 2 + (i + 0.5) / NP * Math.PI * 2; stad.push({ x: PC[0] + Math.cos(a) * 385, y: PC[1] + Math.sin(a) * 255, a, ph: R() * 6 }); }
  const qi = [...Array(NP).keys()]; for (let i = NP - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [qi[i], qi[j]] = [qi[j], qi[i]]; }
  stad.forEach((s, i) => { s.qh = QH[qi[i]]; s.qa = QA[qi[i]]; s.slot = i; });

  // ---------- helpers ----------
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const mix = (a, b, f) => { const A2 = hex(a), B = hex(b); return `rgb(${A2.map((v, i) => Math.round(L.lerp(v, B[i], f))).join(',')})`; };
  const gray = l => `rgb(${l | 0},${(l * 0.99) | 0},${(l * 0.96) | 0})`;
  const fade = (t, a, b, e = 0.3) => L.sm(a, a + e, t) * (1 - L.sm(b - e, b, t));
  function glass(ctx, pathFn, fill, { lw = 7, hi = 0.14 } = {}) {
    pathFn(); ctx.fillStyle = fill; ctx.fill();
    pathFn(); ctx.strokeStyle = LEAD; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.stroke();
  }
  const poly = (ctx, P) => () => { ctx.beginPath(); P.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); };
  const circ = (ctx, x, y, r) => () => { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); };
  const ell = (ctx, x, y, rx, ry) => () => { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); };
  function glow(ctx, x, y, r, rgb, a) { if (a <= 0.003) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }

  // ---------- board ----------
  function drawBoard(ctx, cx, cy, r, y, { label = 0 } = {}) {
    const e = ext(y);
    glow(ctx, cx, cy, r * 1.55, '255,59,48', 0.32 * e);
    panes.forEach(p => {
      const red = y >= p.redY; const fl = red ? 1 - L.clamp((y - p.redY) / 0.35, 0, 1) : 0;
      const col = red ? (fl > 0 ? mix(RED, '#ffd9d4', fl * 0.8) : RED) : gray(p.lum);
      const pf = () => { ctx.beginPath(); if (p.r0 === 0) ctx.arc(cx, cy, r * p.r1, 0, 7); else { ctx.arc(cx, cy, r * p.r1, p.a0, p.a1); ctx.arc(cx, cy, r * p.r0, p.a1, p.a0, true); } ctx.closePath(); };
      pf(); ctx.fillStyle = col; ctx.fill();
      const mx = cx + Math.cos((p.a0 + p.a1) / 2) * r * (p.r0 + p.r1) / 2, my = cy + Math.sin((p.a0 + p.a1) / 2) * r * (p.r0 + p.r1) / 2;
      const g = ctx.createLinearGradient(mx - r * 0.15, my - r * 0.15, mx + r * 0.15, my + r * 0.15); g.addColorStop(0, 'rgba(255,255,255,0.18)'); g.addColorStop(1, 'rgba(0,0,0,0.2)'); ctx.fillStyle = g; ctx.fill();
      pf(); ctx.strokeStyle = LEAD; ctx.lineWidth = Math.max(2, r * 0.028); ctx.stroke();
    });
    ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.strokeStyle = '#3a3c42'; ctx.lineWidth = r * 0.07; ctx.stroke(); ctx.strokeStyle = '#1b1c21'; ctx.lineWidth = r * 0.02; ctx.stroke();
    if (label > 0) L.label(ctx, "one hospital's samples  ·  fit", cx, cy + r + 56, 44, { alpha: label, col: '#b9b6ae' });
  }

  // ---------- a tiny green player on a bench ----------
  function player(ctx, x, y, s, bright) {
    glow(ctx, x, y - 10 * s, 46 * s, '52,210,123', 0.25 + 0.45 * bright);
    glass(ctx, poly(ctx, [[x - 34 * s, y + 8 * s], [x + 34 * s, y + 8 * s], [x + 34 * s, y + 18 * s], [x - 34 * s, y + 18 * s]]), '#5d5a55', { lw: 3 * s });
    const c = mix(GREEN, '#2a3a31', 0.35 * (1 - bright));
    glass(ctx, poly(ctx, [[x - 11 * s, y + 8 * s], [x - 9 * s, y - 16 * s], [x + 9 * s, y - 16 * s], [x + 11 * s, y + 8 * s]]), c, { lw: 3 * s });
    glass(ctx, circ(ctx, x, y - 26 * s, 10 * s), c, { lw: 3 * s });
  }

  // ---------- league network (field coords) ----------
  function drawLeague(ctx, y, { mode = 'h', dim = 0, press = true } = {}) {
    ctx.save(); ctx.globalAlpha *= 1 - dim;
    const key = mode === 'a' ? 'qa' : 'qh';
    // pass lines (lead first, then green)
    stad.forEach(s => {
      const dx = PC[0] - s.x, dy = PC[1] - s.y, d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d;
      const x0 = s.x + ux * 78, y0 = s.y + uy * 62, x1 = PC[0] - ux * PR, y1 = PC[1] - uy * PR;
      ctx.lineCap = 'round'; ctx.strokeStyle = LEAD; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.stroke();
      ctx.strokeStyle = '#34363c'; ctx.lineWidth = 5; ctx.setLineDash([10, 12]); ctx.stroke(); ctx.setLineDash([]);
      if (y >= s[key]) { const f = L.clamp((y - s[key]) / 0.7, 0, 1); ctx.strokeStyle = GREEN; ctx.lineWidth = 7;
        ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(L.lerp(x0, x1, f), L.lerp(y0, y1, f)); ctx.stroke();
        if (f < 1) glow(ctx, L.lerp(x0, x1, f), L.lerp(y0, y1, f), 30, '52,210,123', 0.7); }
    });
    // stadiums
    stad.forEach(s => {
      glass(ctx, ell(ctx, s.x, s.y, 80, 62), '#4a4c52', { lw: 7 });
      for (let k = 0; k < 10; k++) { const a0 = k / 10 * Math.PI * 2, a1 = (k + 1) / 10 * Math.PI * 2;
        ctx.beginPath(); ctx.moveTo(s.x + Math.cos(a0) * 80, s.y + Math.sin(a0) * 62); ctx.lineTo(s.x + Math.cos(a0) * 54, s.y + Math.sin(a0) * 40); ctx.strokeStyle = LEAD; ctx.lineWidth = 3; ctx.stroke(); }
      glass(ctx, ell(ctx, s.x, s.y, 54, 40), '#6f716f', { lw: 5 });
      const on = y >= s[key] ? 1 : 0.25 + 0.1 * Math.sin(s.ph + y * 3);
      player(ctx, s.x, s.y + 6, 1, on);
    });
    // central pitch: ring of 12 slots + the equalizer star
    glass(ctx, circ(ctx, PC[0], PC[1], PR), '#3b3d42', { lw: 9 });
    stad.forEach((s, i) => { const a0 = s.a - Math.PI / NP, a1 = s.a + Math.PI / NP; const lit = y >= s[key] + 0.7;
      ctx.beginPath(); ctx.arc(PC[0], PC[1], PR, a0, a1); ctx.arc(PC[0], PC[1], PR - 30, a1, a0, true); ctx.closePath();
      ctx.fillStyle = lit ? GREEN : '#55575c'; ctx.fill(); ctx.strokeStyle = LEAD; ctx.lineWidth = 5; ctx.stroke(); });
    glass(ctx, circ(ctx, PC[0], PC[1], PR - 30), '#5c5e5c', { lw: 6 });
    if (y >= EQ) {
      const on = L.clamp((y - EQ) / 0.3, 0, 1), drain = L.clamp((y - ANS) / 0.6, 0, 1);
      glow(ctx, PC[0], PC[1], 150, '52,210,123', 0.7 * on * (1 - drain));
      const P = []; for (let k = 0; k < 16; k++) { const a = -Math.PI / 2 + k / 16 * Math.PI * 2, rr = (k % 2 ? 30 : 80) * (0.6 + 0.4 * on); P.push([PC[0] + Math.cos(a) * rr, PC[1] + Math.sin(a) * rr]); }
      ctx.save(); ctx.globalAlpha *= on; glass(ctx, poly(ctx, P), mix(GREEN, '#5c5e5c', drain * 0.85), { lw: 6 }); ctx.restore();
      if (y >= ANS) { const b = L.clamp((y - ANS) / 0.4, 0, 1);
        for (let k = 0; k < 8; k++) { const a = -Math.PI / 2 + k / 8 * Math.PI * 2, rr = 80 * b;
          glass(ctx, poly(ctx, [[PC[0] + Math.cos(a) * (rr + 10), PC[1] + Math.sin(a) * (rr + 10)], [PC[0] + Math.cos(a + 0.2) * (rr - 22), PC[1] + Math.sin(a + 0.2) * (rr - 22)], [PC[0] + Math.cos(a - 0.2) * (rr - 22), PC[1] + Math.sin(a - 0.2) * (rr - 22)]]), RED, { lw: 4 }); }
        glow(ctx, PC[0], PC[1], 130, '255,59,48', 0.35 * b); }
    }
    // press box (two commentators)
    if (press) { glass(ctx, poly(ctx, [[830, 640], [990, 640], [990, 730], [830, 730]]), '#3f4147', { lw: 7 });
      glass(ctx, poly(ctx, [[842, 652], [978, 652], [978, 700], [842, 700]]), '#8a8c90', { lw: 4 });
      [880, 940].forEach(x => { glass(ctx, circ(ctx, x, 690, 13), '#b8b5ae', { lw: 3 }); }); }
    ctx.restore();
  }

  // ---------- fans ----------
  // mood: awe | worry | cheer | sad | soft | calm
  function fan(ctx, x, y, s, { lum = 150, mood = 'calm', scarf = 0.3, red = 0, arms = 0, reach = null, look = 0 } = {}) {
    // body
    glass(ctx, poly(ctx, [[x - 92 * s, y + 250 * s], [x - 84 * s, y + 92 * s], [x - 40 * s, y + 58 * s], [x + 40 * s, y + 58 * s], [x + 84 * s, y + 92 * s], [x + 92 * s, y + 250 * s]]), gray(lum * 0.55), { lw: 8 * s });
    ctx.strokeStyle = LEAD; ctx.lineWidth = 5 * s; ctx.beginPath(); ctx.moveTo(x, y + 64 * s); ctx.lineTo(x + 6 * s, y + 250 * s); ctx.stroke();
    // arms raised (cheer)
    if (arms > 0) [-1, 1].forEach(d => { const hx = x + d * L.lerp(80, 70, arms) * s, hy = y + L.lerp(150, -60, arms) * s;
      ctx.lineCap = 'round'; ctx.strokeStyle = LEAD; ctx.lineWidth = 36 * s; ctx.beginPath(); ctx.moveTo(x + d * 70 * s, y + 110 * s); ctx.lineTo(hx, hy); ctx.stroke();
      ctx.strokeStyle = gray(lum * 0.55); ctx.lineWidth = 24 * s; ctx.stroke(); glass(ctx, circ(ctx, hx, hy - 8 * s, 17 * s), gray(lum), { lw: 5 * s }); });
    // head
    const hy = y;
    glass(ctx, circ(ctx, x, hy, 46 * s), gray(lum), { lw: 8 * s, hi: 0.1 });
    if (red > 0) { ctx.save(); circ(ctx, x, hy, 42 * s)(); ctx.clip(); const g = ctx.createLinearGradient(x, hy - 46 * s, x, hy + 20 * s); g.addColorStop(0, `rgba(255,59,48,${0.55 * red})`); g.addColorStop(1, 'rgba(255,59,48,0)'); ctx.fillStyle = g; ctx.fillRect(x - 60 * s, hy - 60 * s, 120 * s, 90 * s); ctx.restore(); }
    // hair cap
    glass(ctx, () => { ctx.beginPath(); ctx.arc(x, hy, 46 * s, Math.PI * 1.08, Math.PI * 1.92); ctx.quadraticCurveTo(x, hy - 22 * s, x - 43 * s, hy - 13 * s); ctx.closePath(); }, gray(lum * 0.35), { lw: 6 * s });
    if (red > 0) { ctx.save(); ctx.strokeStyle = `rgba(255,59,48,${0.8 * red})`; ctx.lineWidth = 4 * s; ctx.beginPath(); ctx.arc(x, hy, 49 * s, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); ctx.restore(); }
    // painted features (grisaille)
    const ink = '#1a1b1f', ey = hy - 2 * s, lx = look * 3 * s; ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineCap = 'round';
    ctx.lineWidth = 3.4 * s;
    const brow = { awe: [-6, -6], worry: [-2, -9], cheer: [-7, -7], sad: [-1, -9], soft: [-5, -5], calm: [-4, -4] }[mood];
    [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(x + d * 23 * s, ey - 13 * s + (d > 0 ? brow[0] : brow[0]) * s * 0.5 + (mood === 'worry' || mood === 'sad' ? 4 * s : 0)); ctx.lineTo(x + d * 8 * s, ey - 13 * s + brow[1] * s * (mood === 'worry' || mood === 'sad' ? 0.3 : 0.5)); ctx.stroke(); });
    if (mood === 'cheer' || mood === 'soft') [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(x + d * 15 * s, ey + 2 * s, 6 * s, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); });
    else [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(x + d * 15 * s + lx, ey + (mood === 'sad' ? 3 * s : 0), (mood === 'awe' ? 5 : 4.2) * s, (mood === 'awe' ? 6 : 5) * s, 0, 0, 7); ctx.fill(); });
    ctx.beginPath(); ctx.moveTo(x + 1 * s, ey + 4 * s); ctx.lineTo(x - 2 * s, ey + 14 * s); ctx.lineTo(x + 3 * s, ey + 15 * s); ctx.stroke();
    const my = hy + 26 * s; ctx.beginPath();
    if (mood === 'awe') { ctx.ellipse(x, my, 5 * s, 7 * s, 0, 0, 7); ctx.fill(); }
    else if (mood === 'cheer') { ctx.moveTo(x - 13 * s, my - 3 * s); ctx.quadraticCurveTo(x, my + 16 * s, x + 13 * s, my - 3 * s); ctx.closePath(); ctx.fill(); }
    else if (mood === 'sad') { ctx.arc(x, my + 9 * s, 10 * s, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke(); }
    else if (mood === 'soft') { ctx.arc(x, my - 7 * s, 10 * s, Math.PI * 0.25, Math.PI * 0.75); ctx.stroke(); }
    else if (mood === 'worry') { ctx.moveTo(x - 9 * s, my + 2 * s); ctx.quadraticCurveTo(x, my - 2 * s, x + 9 * s, my + 2 * s); ctx.stroke(); }
    else { ctx.moveTo(x - 8 * s, my); ctx.lineTo(x + 8 * s, my); ctx.stroke(); }
    // scarf (green: a piece this fan holds); brightness = attention
    const sc = mix(GREEN, '#2c3530', 0.7 * (1 - scarf));
    if (scarf > 0.5) glow(ctx, x, y + 62 * s, 110 * s, '52,210,123', 0.35 * (scarf - 0.5));
    glass(ctx, poly(ctx, [[x - 52 * s, y + 44 * s], [x + 52 * s, y + 44 * s], [x + 56 * s, y + 72 * s], [x - 56 * s, y + 72 * s]]), sc, { lw: 6 * s });
    ctx.strokeStyle = LEAD; ctx.lineWidth = 4 * s; [-18, 18].forEach(o => { ctx.beginPath(); ctx.moveTo(x + o * s, y + 44 * s); ctx.lineTo(x + o * s, y + 72 * s); ctx.stroke(); });
    if (reach) { // scarf end carried out to a knot at reach [kx, ky, f]
      const [kx, ky, f] = reach, ex = L.lerp(x + 40 * s, kx, f), ey2 = L.lerp(y + 150 * s, ky, f);
      glass(ctx, poly(ctx, [[x + 26 * s, y + 70 * s], [x + 50 * s, y + 70 * s], [ex + 12 * s, ey2 + 14 * s], [ex - 12 * s, ey2 + 14 * s]]), sc, { lw: 6 * s });
    } else glass(ctx, poly(ctx, [[x + 22 * s, y + 70 * s], [x + 46 * s, y + 70 * s], [x + 50 * s, y + 170 * s], [x + 26 * s, y + 170 * s]]), sc, { lw: 6 * s });
  }

  // crowd layer (world coords): back row = hero row (heads y 1600), front row heads y 1795
  const HERO = [540, 1600];
  const row1 = [-4, -3, -2, -1, 1, 2, 3, 4].map(k => ({ x: 540 + k * 150, lum: 120 + R() * 60, mood: 'calm' }));
  const row2 = [...Array(8).keys()].map(k => ({ x: 70 + k * 150 + (R() - 0.5) * 20, lum: 90 + R() * 40 }));
  function drawCrowd(ctx, y, t, { heroMood = 'calm', heroRed = 0, arms = 0, tie = 0, heroScarf = 1 } = {}) {
    const e = ext(y);
    // rail behind the rows
    ctx.save();
    row1.forEach((f, i) => {
      const reach = tie > 0 && f.x === 690 ? [615, 1745, L.clamp(tie * 1.4, 0, 1)] : null;
      const lit = tie > 0 ? L.clamp(tie * 3 - Math.abs(f.x - 540) / 150 * 0.5, 0, 1) : 0;
      fan(ctx, f.x, 1600 + (i % 2) * 6, 0.95, { lum: f.lum, mood: tie > 0 ? 'soft' : (y >= EQ && y < ANS ? 'cheer' : 'calm'), scarf: 0.05 + 0.95 * lit, red: 0.35 * e, reach: f.x === 690 && tie > 0 ? [615, 1745, L.clamp(tie * 1.4, 0, 1)] : null, arms: y >= EQ && y < ANS && tie === 0 ? 0.6 : 0 });
    });
    fan(ctx, HERO[0], HERO[1], 1, { lum: 185, mood: heroMood, scarf: heroScarf, red: heroRed, arms, reach: tie > 0 ? [615, 1745, L.clamp(tie * 1.4, 0, 1)] : null, look: 0 });
    // knots: the row's scarves tied into one line (IN++)
    if (tie > 0) {
      const kn = [615, 1745]; const kf = L.clamp(tie * 1.4 - 0.9, 0, 1);
      if (kf > 0) { glow(ctx, kn[0], kn[1], 70, '52,210,123', 0.8 * kf); glass(ctx, circ(ctx, kn[0], kn[1], 16), GREEN, { lw: 5 }); }
      // the line runs down the row, knot by knot
      [-3, -2, -1, 1, 2, 3].forEach(k => { const kx = 615 + k * 150, f = L.clamp(tie * 2.2 - 1.2 - Math.abs(k) * 0.25, 0, 1);
        if (f <= 0) return; ctx.strokeStyle = GREEN; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(kx - Math.sign(k) * 150, 1745); ctx.lineTo(kx - Math.sign(k) * 150 * (1 - f), 1745); ctx.stroke();
        if (f >= 1) glass(ctx, circ(ctx, kx, 1745, 14), GREEN, { lw: 5 }); });
    }
    // front row (silhouettes, closer to camera)
    ctx.globalAlpha *= 0.92;
    row2.forEach(f => fan(ctx, f.x, 1800, 1.15, { lum: f.lum * 0.55, mood: 'calm', scarf: 0.05, red: 0.15 * e }));
    ctx.restore();
  }

  // ---------- captions (play-by-play) ----------
  const CAPS = [
    [0.0, 1.6, 'PLAY-BY-PLAY', "AND WE'RE LIVE."],
    [1.6, 3.0, 'PLAY-BY-PLAY', "Season one. Red's on the board."],
    [3.0, 4.5, 'COLOR', 'Red scores again.'],
    [4.5, 6.0, 'COLOR', 'Every few months now.'],
    [6.0, 7.6, 'PLAY-BY-PLAY', "So where's green?"],
    [7.6, 9.4, 'COLOR', 'All here. Separate benches.'],
    [9.4, 11.0, 'COLOR', 'Separate stadiums.'],
    [11.0, 12.6, 'PLAY-BY-PLAY', "They can't see each other."],
    [12.6, 14.2, 'COLOR', 'Long season, folks.'],
    [14.2, 15.9, 'COLOR', "She hasn't missed a game."],
    [16.0, 17.8, 'PLAY-BY-PLAY', 'YEAR 13. THE EQUALIZER!'],
    [18.0, 19.4, 'PLAY-BY-PLAY', 'Year 15. Answered.'],
  ];
  function caption(ctx, t) {
    CAPS.forEach(([a, b, who, txt], i) => {
      const al = i === 0 ? (1 - L.sm(b - 0.15, b, t)) * (t < b ? 1 : 0) : fade(t, a, b, 0.15); if (al <= 0) return;
      ctx.save(); ctx.globalAlpha = al;
      glass(ctx, poly(ctx, [[84, 1318], [896, 1318], [896, 1478], [84, 1478]]), 'rgba(18,20,25,0.9)', { lw: 8, hi: 0.04 });
      ctx.fillStyle = who === 'COLOR' ? '#8f9299' : '#c9c6bd'; ctx.font = `34px "${HAND}"`; ctx.textAlign = 'left'; ctx.fillText(who, 112, 1362);
      let fz = 66; ctx.font = `${fz}px "${HAND}"`; while (ctx.measureText(txt).width > 760 && fz > 40) { fz -= 2; ctx.font = `${fz}px "${HAND}"`; }
      ctx.fillStyle = txt.includes('13') ? '#ffffff' : PALE; ctx.fillText(txt, 112, 1440);
      ctx.restore();
    });
  }
  // season pennants: 15 unnumbered lozenges (one per year)
  function pennants(ctx, y, a = 1) {
    ctx.save(); ctx.globalAlpha = a;
    for (let k = 0; k < 15; k++) { const x = 118 + k * 51, lit = y > k, cur = y > k && y <= k + 1;
      glass(ctx, poly(ctx, [[x, 228], [x + 20, 246], [x, 264], [x - 20, 246]]), cur ? '#f4f1e8' : lit ? '#8e8c86' : '#2a2c31', { lw: 4 }); }
    ctx.restore();
  }
  function card(ctx, lines, y, size, a) { if (a > 0) L.title(ctx, lines, y, size, { alpha: a }); }

  // ---------- cameras (two-layer parallax crane) ----------
  const CROWD = [[0, [540, 1570, 3.3]], [3, [540, 1570, 3.3]], [6, [540, 1575, 3.45]], [10, [540, 960, 1]], [14, [540, 960, 1]], [16, [540, 1582, 4.2]], [21.8, [540, 1586, 4.4]]];
  const FIELD = [[0, [540, 470, 1.5]], [3, [540, 470, 1.5]], [6, [540, 475, 1.56]], [10, [540, 960, 1]], [14, [540, 950, 1.02]], [16, [540, 480, 1.65]], [21.8, [540, 482, 1.7]]];
  const CROWD2 = [[30.4, [600, 1630, 3.3]], [33.8, [606, 1645, 3.8]]];
  const FIELD2 = [[30.4, [540, 560, 1.35]], [33.8, [540, 560, 1.42]]];
  const cam = (ctx, [x, y, z]) => { ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-x, -y); };

  function scene(ctx, t, y, { crowdKeys = CROWD, fieldKeys = FIELD, tie = 0, tc = t } = {}) {
    const cc = L.key(crowdKeys, tc), fc = L.key(fieldKeys, tc);
    const close = L.clamp((cc[2] - 1) / 2.3, 0, 1);
    ctx.save(); cam(ctx, fc);
    drawBoard(ctx, BC[0], BC[1], BR, y, { label: 1 - L.sm(0.15, 0.4, close) });
    drawLeague(ctx, y, { dim: 0.55 * close });
    ctx.restore();
    ctx.fillStyle = `rgba(10,11,14,${0.25 * close})`; ctx.fillRect(0, 0, 1080, 1920);
    ctx.save(); cam(ctx, cc);
    const e = ext(y);
    const mood = tie > 0 ? 'soft' : y >= ANS ? 'sad' : y >= EQ ? 'cheer' : t < 1.5 ? 'awe' : y > 6 ? 'worry' : 'awe';
    drawCrowd(ctx, y, t, { heroMood: mood, heroRed: 0.9 * e, arms: (y >= EQ && y < ANS && tie === 0) ? L.clamp((y - EQ) / 0.4, 0, 1) : 0, tie, heroScarf: y >= ANS && tie === 0 ? 0.55 : 1 });
    ctx.restore();
    return close;
  }

  // ---------- snap panels ----------
  function panel(ctx, px, py, pw, ph, y, mode, a) {
    ctx.save(); ctx.globalAlpha = a;
    glass(ctx, poly(ctx, [[px, py], [px + pw, py], [px + pw, py + ph], [px, py + ph]]), '#181a1f', { lw: 9, hi: 0.03 });
    // board, scaled
    drawBoard(ctx, px + 190, py + 250, 140, y);
    // league, scaled into the right side
    ctx.save(); ctx.beginPath(); ctx.rect(px + 350, py + 70, pw - 360, 380); ctx.clip();
    ctx.translate(px + 350 + (pw - 360) / 2, py + 262); ctx.scale(0.5, 0.5); ctx.translate(-PC[0], -PC[1]);
    drawLeague(ctx, y, { mode, press: false }); ctx.restore();
    // season bar
    const bx0 = px + 40, bx1 = px + pw - 40, by = py + ph - 44, X = v => L.lerp(bx0, bx1, v / 15);
    ctx.fillStyle = '#2b2d33'; ctx.fillRect(bx0, by - 7, bx1 - bx0, 14);
    ctx.fillStyle = '#c9c6bd'; ctx.fillRect(bx0, by - 7, X(y) - bx0, 14);
    const med = mode === 'a' ? AIMED : MED;
    ctx.fillStyle = GREEN; ctx.beginPath(); ctx.moveTo(X(med), by - 12); ctx.lineTo(X(med) - 13, by - 34); ctx.lineTo(X(med) + 13, by - 34); ctx.closePath(); ctx.fill();
    if (mode === 'h') L.label(ctx, '13', X(med), by - 44, 44, { col: PALE });
    ctx.restore();
  }

  function draw(ctx, t) {
    ctx.fillStyle = STONE; ctx.fillRect(0, 0, 1080, 1920);
    if (t < 21.8) {
      const y = yearAt(t);
      const sh = (t > 1.5 && t < 1.95) ? Math.sin(t * 80) * 5 : 0;
      ctx.save(); ctx.translate(sh, 0); scene(ctx, t, y); ctx.restore();
      if (t > 1.5 && t < 1.95) { const rw = Math.sin((t - 1.5) / 0.45 * Math.PI); ctx.save(); ctx.globalAlpha = 0.22 * rw; ctx.fillStyle = PALE; for (let k = 0; k < 8; k++) ctx.fillRect(0, (k * 263 + t * 5200) % 1920, 1080, 5); ctx.restore(); }
      if (t >= 19.4) { ctx.fillStyle = `rgba(8,9,11,${0.66 * L.sm(19.4, 19.8, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
      pennants(ctx, y, 1 - L.sm(19.4, 19.8, t));
      caption(ctx, t);
      if (t >= 19.5) {
        const a = fade(t, 19.6, 21.75, 0.3);
        ctx.save(); ctx.globalAlpha = a; glass(ctx, poly(ctx, [[380, 640], [700, 640], [700, 712], [380, 712]]), '#2a2c31', { lw: 6 }); ctx.restore();
        L.label(ctx, 'REPLAY', 540, 692, 52, { alpha: a, col: PALE });
        card(ctx, ['We slowed it down', 'so you could see it.'], 860, 96, a);
      }
      L.slate(ctx, t < 1.5 ? 'SC1  CLOSE  (FLASH-FORWARD, YEAR 4)' : t < 3 ? 'SC2  CLOSE' : t < 6 ? 'SC2  CLOSE  PUSH' : t < 10 ? 'SC3  CRANE UP' : t < 14 ? 'SC3  WIDE' : t < 16 ? 'SC4  DROP DOWN' : t < 19.5 ? 'SC4  CLOSE+' : 'SC5  REPLAY');
    } else if (t < 30.4) {
      // freeze frame of the last race frame, flash, then the panels
      if (t < 22.5) { scene(ctx, 21.8, 15); ctx.fillStyle = `rgba(8,9,11,${0.66 + 0.3 * L.sm(21.8, 22.4, t)})`; ctx.fillRect(0, 0, 1080, 1920);
        ctx.fillStyle = `rgba(255,255,255,${0.55 * (1 - L.sm(21.8, 22.0, t))})`; ctx.fillRect(0, 0, 1080, 1920); }
      const pa = L.sm(22.2, 22.6, t);
      const yA = t < 22.6 ? 0 : t < 25.6 ? (t - 22.6) * 5 : t < 26.0 ? 15 : t < 29 ? (t - 26.0) * 5 : 15;
      const yB = t < 26.0 ? 0 : t < 29 ? (t - 26.0) * 5 : 15;
      panel(ctx, 70, 300, 940, 540, yA, 'h', pa);
      panel(ctx, 70, 900, 940, 540, yB, 'a', pa * (t < 25.8 ? 0.45 : 1));
      L.label(ctx, 'AS IT HAPPENED', 110, 358, 48, { alpha: pa, col: PALE, align: 'left' });
      L.label(ctx, 'PASSES ROUTED SOONER', 110, 958, 48, { alpha: pa, col: PALE, align: 'left' });
      ctx.save(); ctx.globalAlpha = pa; glass(ctx, poly(ctx, [[600, 922], [880, 922], [880, 972], [600, 972]]), '#2d3a33', { lw: 5 }); ctx.restore();
      L.label(ctx, 'ILLUSTRATIVE', 740, 962, 44, { alpha: pa, col: '#ffffff' });
      L.label(ctx, 'same board, same years', 540, 262, 44, { alpha: pa * (1 - L.sm(28.8, 29.1, t)), col: '#9aa0aa' });
      card(ctx, ['The chemistry still takes years.'], 1500, 60, fade(t, 29.0, 30.4, 0.25));
      L.slate(ctx, 'SC6  SNAP  SPLIT (REPLAY)');
    } else {
      const tie = L.sm(30.6, 33.0, t);
      scene(ctx, t, 15, { crowdKeys: CROWD2, fieldKeys: FIELD2, tie });
      ctx.fillStyle = `rgba(8,9,11,${0.35 * L.sm(31.2, 31.6, t)})`; ctx.fillRect(0, 0, 1080, 1920);
      card(ctx, ['This is', 'the bottleneck.'], 330, 110, fade(t, 31.2, 33.8, 0.3));
      L.slate(ctx, 'SC7  EXTREME CLOSE  DROP IN');
      if (t >= 33.8) L.endCard(ctx, L.sm(33.8, 34.2, t), { line: 'The bottleneck is us.' });
    }
    L.grain(ctx, t, { alpha: 0.045, n: 400 });
  }

  const cues = [{ t: 1.5, type: 'whoosh' }, { t: 6.0, type: 'whoosh' }, { t: 14.0, type: 'whoosh' }, { t: 16.0, type: 'ding' }, { t: 18.0, type: 'stamp' }, { t: 21.8, type: 'hit' }, { t: 26.0, type: 'pop' }, { t: 31.2, type: 'hit' }];
  QH.forEach(q => { const tt = tOfYear(q); if (q <= 15 && Math.abs(tt - 16) > 0.3) cues.push({ t: tt, type: 'pop' }); });
  return { draw, DUR,
    acts: [{ start: 0, end: 19.4, bpm: 0, drone: true }, { start: 10, end: 18, bpm: 56 }, { start: 22.4, end: 30.4, bpm: 0, drone: true }, { start: 30.4, end: DUR, bpm: 0, drone: true }],
    cues: cues.sort((a, b) => a.t - b.t), _debug: { QH, QA } };
}
module.exports = makeScene;
