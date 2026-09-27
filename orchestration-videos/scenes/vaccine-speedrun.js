// vaccine-speedrun ("Any Percent"): game-hud-run, neon arcade, game. Analog: covid-2020.
// Time mapping (labeled on the HUD as NORMAL / FAST-FORWARD): day 0 = 2019-12-31.
//   t 2.2..5.2 s : 1 s = 2 days   day = 9 + 2 (t - 2.2)
//   t 5.2..17.3 s: 1 s = 40 days  day = 15 + 40 (t - 5.2)        cold open = flash-forward to day 421.
// Red: analog threat.points extent (share of countries), piecewise-linear between the sourced weekly points.
// Green: 217 countries, arrival = max(339, lognormalQuantile(q, 421, 490)); routed (illustrative) median 363.
// Numbers on screen: "2 DAYS" (design split) and "DAY 421" (median country). See output/vaccine-speedrun/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('covid-2020');
  const DUR = 35.5, RED = L.RED, GREEN = L.GREEN;
  const BG = '#06070a', W1 = '#f2f3f5', G6 = '#c8ccd2', G5 = '#9aa0aa', G4 = '#6a707a', G3 = '#3c414a', G2 = '#1c1f25';

  // ---------------- time & data ----------------
  const FREEZE = 17.3;
  const dayAt = t => t < 2.2 ? 421 : t < 5.2 ? 9 + 2 * (t - 2.2) : 15 + 40 * (Math.min(t, FREEZE) - 5.2);
  const tOfDay = d => d < 15 ? 2.2 + (d - 9) / 2 : 5.2 + (d - 15) / 40;
  const pts = [{ t: 0, extent: 0 }].concat(A.threat.points);
  const extent = d => { if (d >= pts[pts.length - 1].t) return pts[pts.length - 1].extent;
    for (let i = 0; i < pts.length - 1; i++) if (d <= pts[i + 1].t) return L.lerp(pts[i].extent, pts[i + 1].extent, (d - pts[i].t) / (pts[i + 1].t - pts[i].t)); return 0; };
  const FR = {}; A.solution.fragments.forEach(f => FR[f.id] = f.ready_at);
  const D_RECIPE = FR.f3, D_DESIGN = FR.f4, D_TRIAL = FR.f5, D_AUTH = FR.f6, D_DOSE = FR.f7;   // 11, 13, 76, 337, 343
  const AG = A.solution.aggregation, MED = AG.median, P90 = AG.p90;                         // 421, 490
  const AIMED = A.ai_counterfactual.aggregation_median, AIP90 = AIMED * P90 / MED;           // 363, 422.5
  const FLOOR = 339;                                                                          // earliest real first dose in the file
  const TRAVEL = 30;                                                                          // days a payload is visible en route

  // ---------------- world map (design space, the level) ----------------
  const conts = [
    { x: 250, y: 790, rx: 150, ry: 95, n: 35 }, { x: 350, y: 1050, rx: 72, ry: 125, n: 14 },
    { x: 560, y: 745, rx: 88, ry: 62, n: 50 }, { x: 585, y: 975, rx: 95, ry: 135, n: 55 },
    { x: 800, y: 800, rx: 170, ry: 110, n: 50 }, { x: 905, y: 1130, rx: 75, ry: 52, n: 13 }];
  const r = L.rng(11);
  const outlines = conts.map((c, ci) => { const p = []; for (let i = 0; i <= 48; i++) { const a = i / 48 * Math.PI * 2, k = 1 + 0.32 * (L.noise((i % 48) * 0.45, ci * 3 + 1) - 0.5);
    p.push([c.x + Math.cos(a) * c.rx * k, c.y + Math.sin(a) * c.ry * k]); } return p; });
  const nodes = [];
  conts.forEach((c, ci) => { const md = 0.85 * Math.sqrt(Math.PI * c.rx * c.ry * 0.7 / c.n); let got = 0, tries = 0;
    while (got < c.n && tries < 20000) { tries++; const a = r() * Math.PI * 2, rr = Math.sqrt(r()) * 0.86; const x = c.x + Math.cos(a) * c.rx * rr, y = c.y + Math.sin(a) * c.ry * rr;
      const lim = tries > 12000 ? md * 0.6 : md; if (nodes.some(n => Math.hypot(n.x - x, n.y - y) < lim)) continue; nodes.push({ x, y, ci }); got++; } });
  const P = { x: 215, y: 772 };                     // the player's lab (not one of the 217)
  const R0 = { x: 830, y: 790 };                    // where the red starts
  // red rank: order of distance from R0 with jitter; node is red when extent(day) >= rank
  nodes.map((n, i) => ({ i, k: Math.hypot(n.x - R0.x, n.y - R0.y) + r() * 160 })).sort((a, b) => a.k - b.k).forEach((o, j) => nodes[o.i].rank = (j + 0.5) / nodes.length);
  // arrival quantiles, stratified and shuffled
  const qs = nodes.map((_, i) => (i + 0.5) / nodes.length); const r2 = L.rng(7);
  for (let i = qs.length - 1; i > 0; i--) { const j = Math.floor(r2() * (i + 1)); [qs[i], qs[j]] = [qs[j], qs[i]]; }
  nodes.forEach((n, i) => n.q = qs[i]);
  // the crowd's node: far end of the map (farthest oceania node from the player), given quantile 206.5/217
  let CI = -1, best = -1; nodes.forEach((n, i) => { const d = Math.hypot(n.x - P.x, n.y - P.y); if (n.ci === 5 && d > best) { best = d; CI = i; } });
  const qC = 206.5 / nodes.length, swapI = nodes.findIndex(n => Math.abs(n.q - qC) < 1e-9); [nodes[CI].q, nodes[swapI].q] = [nodes[swapI].q, nodes[CI].q];
  if (nodes[CI].rank > 0.8) { const k = nodes.findIndex(n => n.rank > 0.4 && n.rank < 0.6); [nodes[CI].rank, nodes[k].rank] = [nodes[k].rank, nodes[CI].rank]; }
  nodes.forEach(n => { n.hum = Math.max(FLOOR, L.lognormalQuantile(n.q, MED, P90)); n.ai = Math.max(FLOOR, L.lognormalQuantile(n.q, AIMED, AIP90));
    const dx = n.x - P.x, dy = n.y - P.y, d = Math.hypot(dx, dy); n.cx = (P.x + n.x) / 2 + dy / d * -0.22 * d * Math.sign(dx || 1); n.cy = (P.y + n.y) / 2 - Math.abs(dx) / d * 0.22 * d; });
  const C = nodes[CI];
  const pipOrder = nodes.map(n => n.hum).sort((a, b) => a - b);
  const bez = (n, u) => [(1 - u) * (1 - u) * P.x + 2 * (1 - u) * u * n.cx + u * u * n.x, (1 - u) * (1 - u) * P.y + 2 * (1 - u) * u * n.cy + u * u * n.y];

  // crowd at C (offsets in world units)
  const crowd = []; const r3 = L.rng(5);
  const rows = [{ y: -6, s: 0.04, xs: [-10, -7.5, -5, -2.5, 0, 2.5, 5, 7.5, 10] }, { y: -1, s: 0.046, xs: [-9, -6, -3, 0, 3, 6, 9] }, { y: 5, s: 0.055, xs: [-8, -4, 0, 4, 8] }];
  rows.forEach((row, ri) => row.xs.forEach((x, k) => crowd.push({ x: x + (r3() - 0.5) * 1.2, y: row.y + (r3() - 0.5) * 0.8, s: row.s, ri, front: ri === 2 && x === 0,
    mood: ['sad', 'bored', 'awe', 'sad', 'glazed'][Math.floor(r3() * 5)], seed: 10 + ri * 20 + k, lk: (r3() - 0.5) * 0.8, ph: r3() * 6 })));

  // ---------------- drawing helpers ----------------
  function neon(c, col, w, path, a = 1) {
    c.save(); c.strokeStyle = col; c.lineCap = 'round'; c.lineJoin = 'round'; const ga = c.globalAlpha;
    [[4.2, 0.12], [2.2, 0.26], [1, 1]].forEach(([m, al]) => { c.globalAlpha = ga * al * a; c.lineWidth = w * m; c.beginPath(); path(); c.stroke(); });
    c.restore();
  }
  function glowDot(c, x, y, rad, col, a = 1) {
    c.save(); const ga = c.globalAlpha; c.fillStyle = col;
    [[3, 0.1], [1.8, 0.22], [1, 1]].forEach(([m, al]) => { c.globalAlpha = ga * al * a; c.beginPath(); c.arc(x, y, rad * m, 0, 7); c.fill(); }); c.restore();
  }
  function hexPath(c, x, y, rad) { for (let i = 0; i <= 6; i++) { const a = i / 6 * Math.PI * 2 + Math.PI / 6; i ? c.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad) : c.moveTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad); } }
  const fade = (t, a, b) => L.sm(a, a + 0.2, t) * (1 - L.sm(b - 0.2, b, t));
  const card = (c, lines, y, size, a) => { if (a > 0.001) L.title(c, lines, y, size, { alpha: a }); };
  const hud = (c, text, x, y, size, col, a = 1, align = 'left') => { if (a <= 0) return; c.save(); c.globalAlpha *= a; c.font = `${size}px "${HAND}"`; c.textAlign = align;
    c.fillStyle = col; c.globalAlpha *= 0.3; c.fillText(text, x + 1, y + 1); c.globalAlpha /= 0.3; c.fillText(text, x, y); c.restore(); };
  function scan(c, a = 0.07) { c.save(); c.fillStyle = `rgba(0,0,0,${a})`; for (let y = 0; y < 1920; y += 6) c.fillRect(0, y, 1080, 2); c.restore(); }
  function vignette(c, redA) {
    c.save(); let g = c.createRadialGradient(540, 960, 380, 540, 960, 1200); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.75)'); c.fillStyle = g; c.fillRect(0, 0, 1080, 1920);
    if (redA > 0.005) { g = c.createRadialGradient(540, 1000, 300, 540, 1000, 1150); g.addColorStop(0, 'rgba(255,59,48,0)'); g.addColorStop(1, `rgba(255,59,48,${redA.toFixed(3)})`); c.fillStyle = g; c.fillRect(0, 0, 1080, 1920); }
    c.restore();
  }

  // ---------------- the level ----------------
  // mode 'hum' | 'ai'; z = current zoom (for constant-ish line widths)
  function level(c, day, z, mode = 'hum', t = 0) {
    const lw = 1.6 / Math.pow(z, 0.85), ext = extent(day);
    // grid
    c.save(); c.globalAlpha = 0.35 * L.clamp(1.6 - z * 0.12, 0.25, 1); c.strokeStyle = G2; c.lineWidth = lw; c.beginPath();
    for (let x = -300; x <= 1400; x += 60) { c.moveTo(x, 300); c.lineTo(x, 1650); } for (let y = 300; y <= 1650; y += 60) { c.moveTo(-300, y); c.lineTo(1400, y); } c.stroke(); c.restore();
    // continents
    outlines.forEach(o => neon(c, G4, lw, () => o.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)), 0.8));
    // escort routes
    const rn = 5 / Math.pow(z, 0.6);
    nodes.forEach(n => { const arr = n[mode]; if (day < arr - TRAVEL) return; const u = L.clamp((day - (arr - TRAVEL)) / TRAVEL, 0, 1);
      c.save(); c.strokeStyle = GREEN; c.lineWidth = lw * 0.9; c.globalAlpha = u < 1 ? 0.55 : 0.13; c.beginPath();
      for (let k = 0; k <= 16; k++) { const [x, y] = bez(n, u * k / 16); k ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.restore();
      if (u < 1) { const [x, y] = bez(n, u); glowDot(c, x, y, rn * 0.55, GREEN); } });
    // nodes
    nodes.forEach(n => { const red = ext >= n.rank, got = day >= n[mode];
      c.save(); c.strokeStyle = G5; c.lineWidth = lw; c.globalAlpha = 0.8; c.beginPath(); c.arc(n.x, n.y, rn, 0, 7); c.stroke(); c.restore();
      if (red) glowDot(c, n.x, n.y, rn * 0.72, RED, 0.95);
      if (got) neon(c, GREEN, lw * 1.2, () => c.arc(n.x, n.y, rn * 1.45, 0, 7)); });
    // the lab node
    const lab = 7 / Math.pow(z, 0.6);
    neon(c, W1, lw * 1.2, () => hexPath(c, P.x, P.y, lab)); if (day >= D_DESIGN) glowDot(c, P.x, P.y, lab * 0.45, GREEN);
  }

  // ---------------- the player (world units at P) ----------------
  function player(c, a, t, day, mood) {
    if (a <= 0.01) return; const X = P.x, Y = P.y, lw = 0.3, ext = extent(day);
    c.save(); c.globalAlpha *= a;
    const designed = day >= D_DESIGN; const TX = X + 6.8, TY = Y + 14;
    // shoulders + mic
    neon(c, G5, lw, () => { c.moveTo(X - 17, Y + 21); c.quadraticCurveTo(X - 14, Y + 12, X - 4, Y + 11.2); c.lineTo(X + 4, Y + 11.2); c.quadraticCurveTo(X + 14, Y + 12, X + 17, Y + 21); });
    neon(c, G5, lw, () => { c.moveTo(X - 2.6, Y + 9.6); c.lineTo(X - 2.3, Y + 11.2); c.moveTo(X + 2.6, Y + 9.6); c.lineTo(X + 2.3, Y + 11.2); });
    // head
    c.fillStyle = '#0b0d12'; c.beginPath(); c.ellipse(X, Y, 8.4, 9.8, 0, 0, 7); c.fill();
    // light on the face: red from the level, green from the answer
    c.save(); c.beginPath(); c.ellipse(X, Y, 8.4, 9.8, 0, 0, 7); c.clip();
    let g = c.createRadialGradient(X - 2, Y + 12, 1, X - 2, Y + 12, 16); g.addColorStop(0, `rgba(255,59,48,${(0.1 + 0.45 * ext).toFixed(3)})`); g.addColorStop(1, 'rgba(255,59,48,0)'); c.fillStyle = g; c.fillRect(X - 10, Y - 11, 20, 22);
    const ga = designed ? 0.42 : 0.12 + 0.1 * L.sm(2.7, 3.2, t);
    g = c.createRadialGradient(TX, TY - 2, 0.5, TX, TY - 2, 12); g.addColorStop(0, `rgba(52,210,123,${ga.toFixed(3)})`); g.addColorStop(1, 'rgba(52,210,123,0)'); c.fillStyle = g; c.fillRect(X - 10, Y - 11, 20, 22);
    c.restore();
    neon(c, W1, lw, () => c.ellipse(X, Y, 8.4, 9.8, 0, 0, Math.PI * 2));
    // headphones
    neon(c, G5, lw * 1.3, () => { c.moveTo(X - 9.3, Y + 0.5); c.bezierCurveTo(X - 10, Y - 15, X + 10, Y - 15, X + 9.3, Y + 0.5); });
    [-1, 1].forEach(s => { c.fillStyle = '#0b0d12'; c.beginPath(); c.roundRect(X + s * 9.4 - 1.7, Y - 3.2, 3.4, 7, 1.3); c.fill(); neon(c, G6, lw, () => c.roundRect(X + s * 9.4 - 1.7, Y - 3.2, 3.4, 7, 1.3)); });
    neon(c, G4, lw * 0.8, () => { c.moveTo(X - 9.4, Y + 3.6); c.quadraticCurveTo(X - 8.5, Y + 7.5, X - 3.6, Y + 6.2); });
    // eyes
    const eh = mood === 'awe' ? 1.75 : mood === 'tired' ? 0.9 : 1.35, look = [0.15 * Math.sin(t * 0.7), -0.25];
    [-1, 1].forEach(s => { const ex = X + s * 3.1, ey = Y - 0.6;
      c.fillStyle = '#e9ebee'; c.beginPath(); c.ellipse(ex, ey, 1.75, eh, 0, 0, 7); c.fill();
      c.fillStyle = '#07080b'; c.beginPath(); c.arc(ex + look[0], ey + look[1] * eh, Math.min(0.9, eh * 0.7), 0, 7); c.fill();
      c.fillStyle = RED; c.globalAlpha = a * (0.35 + 0.65 * ext); c.beginPath(); c.arc(ex + look[0] - 0.38, ey - 0.3, 0.26, 0, 7); c.fill();
      c.fillStyle = GREEN; c.globalAlpha = a * (designed ? 1 : 0.35); c.beginPath(); c.arc(ex + look[0] + 0.36, ey - 0.12, 0.22, 0, 7); c.fill(); c.globalAlpha = a;
      // brows
      const tilt = mood === 'set' ? 0.5 : mood === 'awe' ? -0.35 : mood === 'tired' ? -0.2 : 0;
      neon(c, G6, lw * 0.9, () => { c.moveTo(ex - 1.8, ey - eh - 1.1 + s * tilt * 0.6); c.lineTo(ex + 1.8, ey - eh - 1.1 - s * tilt * 0.6); }); });
    // mouth
    neon(c, G6, lw, () => { const my = Y + 4.6;
      if (mood === 'happy') c.arc(X, my - 1.2, 1.9, 0.2 * Math.PI, 0.8 * Math.PI);
      else if (mood === 'awe') c.ellipse(X, my, 0.9, 1.1, 0, 0, Math.PI * 2);
      else if (mood === 'set') { c.moveTo(X - 1.8, my); c.lineTo(X + 1.8, my - 0.25); }
      else { c.moveTo(X - 1.5, my + 0.2); c.lineTo(X + 1.5, my + 0.2); } });
    // the answer: shards (f1 old design, f2 platform) + recipe (f3) -> hex token (f4)
    if (!designed) {
      const conv = L.ease.inOut(L.sm(4.0, 4.2, t));
      const sh = [[TX - 3, TY + 0.8], [TX + 3, TY + 1.2]];
      const fly = L.ease.out(L.sm(2.7, 3.2, t)); sh.push([L.lerp(X + 26, TX, fly), L.lerp(Y - 22, TY - 2.2, fly)]);
      sh.forEach(([x, y], i) => { if (i === 2 && t < 2.7) return; const px = L.lerp(x, TX, conv), py = L.lerp(y, TY, conv) + Math.sin(t * 2 + i) * 0.3 * (1 - conv);
        neon(c, GREEN, lw, () => { c.moveTo(px, py - 1.2); c.lineTo(px + 1.1, py + 0.8); c.lineTo(px - 1.1, py + 0.8); c.closePath(); }, i === 2 ? 1 : 0.8); });
    } else {
      const pop = t < 5 ? 1 + 0.35 * (1 - L.sm(4.2, 4.6, t)) : 1;
      glowDot(c, TX, TY, 1.5 * pop, GREEN, 0.5); neon(c, GREEN, lw * 1.2, () => hexPath(c, TX, TY, 2.5 * pop)); neon(c, '#b9f5d2', lw * 0.7, () => hexPath(c, TX, TY, 1.3 * pop));
    }
    c.restore();
  }

  // ---------------- the crowd (world units at C) ----------------
  function crowdDraw(c, a, t, routed, arrive) {
    if (a <= 0.01) return; c.save(); c.globalAlpha *= a;
    // floor ring: their node, red
    let g = c.createRadialGradient(C.x, C.y + 4, 1, C.x, C.y + 4, 22); g.addColorStop(0, 'rgba(255,59,48,0.32)'); g.addColorStop(1, 'rgba(255,59,48,0)'); c.fillStyle = g; c.fillRect(C.x - 24, C.y - 20, 48, 44);
    neon(c, RED, 0.25, () => c.ellipse(C.x, C.y + 6.5, 14, 3.2, 0, 0, Math.PI * 2), 0.85);
    if (routed && arrive > 0) { g = c.createRadialGradient(C.x, C.y - 1, 0.5, C.x, C.y - 1, 16); g.addColorStop(0, `rgba(52,210,123,${(0.4 * arrive).toFixed(3)})`); g.addColorStop(1, 'rgba(52,210,123,0)'); c.fillStyle = g; c.fillRect(C.x - 20, C.y - 18, 40, 36);
      neon(c, GREEN, 0.25, () => c.ellipse(C.x, C.y + 6.5, 15.2, 3.7, 0, 0, Math.PI * 2), arrive); }
    const pdx = P.x - C.x, pdy = P.y - C.y, pd = Math.hypot(pdx, pdy), lookUp = [pdx / pd * 0.7, -0.9];
    crowd.forEach(f => { const got = routed && arrive > 0.5;
      const mood = got ? (f.front ? 'happy' : (f.seed % 3 ? 'happy' : 'awe')) : f.mood;
      const reachFront = got ? 2.7 : (f.front ? 1.9 + 0.12 * Math.sin(t * 2) : 0.25 + 0.05 * Math.sin(t + f.ph));
      const pose = f.front ? { armL: reachFront, armR: reachFront } : got ? { armL: 1.2 + 0.4 * Math.sin(t * 3 + f.ph), armR: 1.4 + 0.4 * Math.sin(t * 3 + f.ph + 1) } : { armL: 0.25, armR: 0.3 };
      c.save(); c.shadowColor = got ? 'rgba(52,210,123,0.8)' : 'rgba(255,90,80,0.7)'; c.shadowBlur = 14;
      L.stick(c, C.x + f.x, C.y + f.y, f.s, { pose, mood, col: f.ri === 2 ? W1 : f.ri === 1 ? G6 : G5, seed: f.seed, look: got ? [0, 0] : [lookUp[0] + f.lk * 0.3, lookUp[1]] });
      c.restore(); });
    c.restore();
  }

  // ---------------- HUD (screen space) ----------------
  function hudPanel(c, day, t, a = 1, opts = {}) {
    if (a <= 0) return; c.save(); c.globalAlpha = a;
    c.fillStyle = 'rgba(6,7,10,0.78)'; c.beginPath(); c.roundRect(70, 226, 850, 312, 16); c.fill();
    neon(c, G4, 1.6, () => c.roundRect(70, 226, 850, 312, 16), 0.8);
    hud(c, 'ANY%  RUN', 100, 278, 40, W1);
    // speed badge
    const ff = t >= 5.2 && t < FREEZE, bx = 330;
    c.save(); c.fillStyle = ff ? W1 : G5; c.beginPath(); c.moveTo(bx, 254); c.lineTo(bx + 20, 266); c.lineTo(bx, 278); c.fill(); if (ff) { c.beginPath(); c.moveTo(bx + 22, 254); c.lineTo(bx + 42, 266); c.lineTo(bx + 22, 278); c.fill(); } c.restore();
    hud(c, ff ? 'FAST-FORWARD' : (t < 2.2 ? 'REPLAY' : 'NORMAL SPEED'), bx + (ff ? 56 : 34), 278, 34, ff ? W1 : G5, ff ? 0.75 + 0.25 * Math.sin(t * 8) : 1);
    // dial timer (or the frozen DAY readout)
    const dcx = 850, dcy = 290;
    if (opts.showDay) { hud(c, 'DAY 421', 900, 290, 64, W1, 1, 'right'); }
    else { neon(c, G5, 2, () => c.arc(dcx, dcy, 36, 0, Math.PI * 2)); for (let k = 0; k < 12; k++) { const an = k / 12 * Math.PI * 2; c.fillStyle = G4; c.fillRect(dcx + Math.cos(an) * 28 - 2, dcy + Math.sin(an) * 28 - 2, 4, 4); }
      const an = day / 30 * Math.PI * 2 - Math.PI / 2; neon(c, W1, 3, () => { c.moveTo(dcx, dcy); c.lineTo(dcx + Math.cos(an) * 30, dcy + Math.sin(an) * 30); }); }
    const bar = (y, f, col) => { c.fillStyle = G2; c.fillRect(330, y - 20, 430, 20); c.save(); c.fillStyle = col; c.globalAlpha *= 0.3; c.fillRect(326, y - 24, 438 * L.clamp(f, 0, 1) + 0.01, 28); c.globalAlpha /= 0.3; c.fillRect(330, y - 20, 430 * L.clamp(f, 0, 1), 20); c.restore(); };
    // RED ZONE
    hud(c, 'RED ZONE', 100, 338, 34, G6); bar(334, extent(day), RED);
    // DESIGN split
    hud(c, 'DESIGN', 100, 394, 34, G6);
    if (day < D_RECIPE) hud(c, 'waiting for the recipe', 330, 392, 32, G4);
    else if (day < D_DESIGN) bar(390, (day - D_RECIPE) / (D_DESIGN - D_RECIPE), W1);
    else { const pop = L.sm(4.2, 4.35, t) * (t < 2.2 ? 0 : 1) + (t < 2.2 ? 1 : 0);
      hud(c, '2 DAYS', 330, 396, 44, W1); c.save(); c.globalAlpha *= pop; c.fillStyle = W1; c.beginPath(); c.roundRect(480, 362, 74, 42, 8); c.fill(); c.fillStyle = BG; c.font = `34px "${HAND}"`; c.textAlign = 'center'; c.fillText('WR', 517, 395); c.restore();
      if (t > 4.2 && t < 5.6) { c.save(); c.globalAlpha *= (1 - L.sm(4.2, 5.6, t)); c.strokeStyle = W1; c.lineWidth = 3; c.beginPath(); c.roundRect(470 - 30 * L.sm(4.2, 5, t), 352 - 20 * L.sm(4.2, 5, t), 94 + 60 * L.sm(4.2, 5, t), 62 + 40 * L.sm(4.2, 5, t), 10); c.stroke(); c.restore(); }
      hud(c, 'world record', 580, 394, 32, G5); }
    // TRIALS + APPROVAL (biology-bound; left unchanged in the counterfactual)
    hud(c, 'TRIALS', 100, 450, 34, G6);
    if (day >= D_DESIGN) { bar(446, (day - D_DESIGN) / (D_AUTH - D_DESIGN), G6); const tx = 330 + 430 * (D_TRIAL - D_DESIGN) / (D_AUTH - D_DESIGN); c.fillStyle = W1; c.fillRect(tx - 1.5, 422, 3, 28); }
    // ESCORT: 217 pips
    hud(c, 'ESCORT', 100, 506, 34, G6);
    const n = pipOrder.length, per = Math.ceil(n / 2), pw = 430 / per;
    for (let i = 0; i < n; i++) { const row = i < per ? 0 : 1, k = i % per, x = 330 + k * pw, y = 480 + row * 16; const on = day >= pipOrder[i];
      c.fillStyle = on ? GREEN : G3; c.fillRect(x, y, Math.max(1, pw - 1.2), 12); }
    if (day >= D_DESIGN && day < D_DOSE && t >= 2.2) hud(c, 'locked', 770, 506, 30, G4);
    else if (day >= D_DOSE && t >= 5.2) hud(c, 'behind', 770, 506, 30, G5, 0.8 + 0.2 * Math.sin(t * 6));
    c.restore();
  }

  // ---------------- camera ----------------
  const Z0 = 34, ZC0 = 38, ZW = 1.0, ZW1 = 1.06, ZD = 34, ZD1 = 44;
  const zlerp = (a, b, f) => Math.exp(L.lerp(Math.log(a), Math.log(b), f));
  const wgt = (z, z0, z1) => (1 / z - 1 / z0) / (1 / z1 - 1 / z0);
  function camAt(t) {
    t = Math.min(t, FREEZE);
    if (t < 5.6) return [P.x, P.y - 7, t < 2.2 ? Z0 : L.lerp(Z0, ZC0, L.sm(2.2, 5.6, t))];
    if (t < 8.8) { const f = L.ease.inOut((t - 5.6) / 3.2), z = zlerp(ZC0, ZW, f), w = wgt(z, ZC0, ZW); return [L.lerp(P.x, 540, w), L.lerp(P.y - 7, 930, w), z]; }
    if (t < 14.0) return [540, 930, L.lerp(ZW, ZW1, (t - 8.8) / 5.2)];
    if (t < 16.2) { const f = L.ease.inOut((t - 14) / 2.2), z = zlerp(ZW1, ZD, f), w = wgt(z, ZW1, ZD); return [L.lerp(540, C.x, w), L.lerp(930, C.y - 5, w), z]; }
    return [C.x, C.y - 5, L.lerp(ZD, ZD1, L.sm(16.2, FREEZE, t))];
  }
  function applyCam(c, x, y, z) { c.translate(540, 960); c.scale(z, z); c.translate(-x, -y); }

  function raceFrame(c, t) {
    const day = dayAt(t), [cx, cy, z] = camAt(t);
    c.save(); applyCam(c, cx, cy, z);
    level(c, day, z, 'hum', t);
    const mood = t < 2.2 ? 'set' : t < 3.2 ? 'tired' : t < 4.2 ? 'awe' : t < 5.6 ? 'happy' : 'set';
    player(c, day >= 0 ? L.sm(4, 11, z) : 0, t, day, mood);
    crowdDraw(c, L.sm(7, 16, z) * (t > 12 ? 1 : 0), t, false, 0);
    c.restore();
    vignette(c, 0.5 * extent(day) * L.sm(3, 14, z));
    return { day, z };
  }

  // ---------------- snap (screen space) ----------------
  const AX0 = 110, AX1 = 970, SPAN = 600; const ax = d => AX0 + (AX1 - AX0) * d / SPAN;
  const sortedHum = nodes.map(n => n.hum).sort((a, b) => a - b), sortedAi = nodes.map(n => n.ai).sort((a, b) => a - b);
  function panel(c, y0, title, arr, sweep, a, routed) {
    if (a <= 0) return; c.save(); c.globalAlpha = a;
    c.fillStyle = 'rgba(12,14,19,0.9)'; c.beginPath(); c.roundRect(70, y0, 940, 470, 18); c.fill(); neon(c, G4, 1.6, () => c.roundRect(70, y0, 940, 470, 18), 0.8);
    hud(c, title, 100, y0 + 66, 50, W1);
    const top = y0 + 120, bot = y0 + 400, H = bot - top, s = SPAN * L.clamp(sweep, 0, 1);
    c.strokeStyle = G4; c.lineWidth = 2; c.beginPath(); c.moveTo(AX0, bot); c.lineTo(AX1, bot); c.moveTo(AX0, top); c.lineTo(AX0, bot); c.stroke();
    // design sliver, day 11..13 (true width)
    if (s > D_RECIPE) { c.fillStyle = GREEN; c.fillRect(ax(D_RECIPE), top, Math.max(2.5, ax(Math.min(s, D_DESIGN)) - ax(D_RECIPE)), H); hud(c, '< design', ax(D_DESIGN) + 12, top + 40, 44, GREEN); }
    // trials/approval span
    if (s > D_DESIGN) { c.fillStyle = G3; c.fillRect(ax(D_DESIGN), bot + 14, ax(Math.min(s, D_AUTH)) - ax(D_DESIGN), 12); if (s > 120) hud(c, 'trials', ax(90), bot + 60, 44, G5); }
    // red curve (share of countries reached by the red)
    c.save(); c.beginPath(); c.moveTo(AX0, bot); for (let d = 0; d <= s; d += 2) c.lineTo(ax(d), bot - H * extent(d)); c.lineTo(ax(s), bot); c.closePath(); c.fillStyle = 'rgba(255,59,48,0.12)'; c.fill(); c.restore();
    neon(c, RED, 3, () => { for (let d = 0; d <= s; d += 2) d ? c.lineTo(ax(d), bot - H * extent(d)) : c.moveTo(ax(d), bot); });
    // green curve (share of the 217 reached by the answer)
    neon(c, GREEN, 3.5, () => { c.moveTo(AX0, bot); let k = 0; for (let d = 0; d <= s; d += 1) { while (k < arr.length && arr[k] <= d) k++; c.lineTo(ax(d), bot - H * k / arr.length); } });
    // rug of arrivals
    c.fillStyle = GREEN; arr.forEach(d => { if (d <= s) c.fillRect(ax(d) - 1, bot + 2, 2, 10); });
    // sweep head
    if (sweep > 0 && sweep < 1) { c.fillStyle = W1; c.globalAlpha = a * 0.6; c.fillRect(ax(s) - 1.5, top - 10, 3, H + 20); c.globalAlpha = a; }
    c.restore();
  }
  function snap(c, t) {
    c.fillStyle = BG; c.fillRect(0, 0, 1080, 1920);
    const s1 = (t - 19.8) / 2.2, s2 = (t - 22.4) / 2.2;
    panel(c, 300, 'AS IT HAPPENED', sortedHum, s1, L.sm(19.5, 19.8, t), false);
    panel(c, 830, 'ROUTED (ILLUSTRATIVE)', sortedAi, s2, L.sm(22.1, 22.4, t), true);
    // median markers
    const mA = L.sm(22.0, 22.3, t);
    if (mA > 0) { c.save(); c.globalAlpha = mA; c.setLineDash([10, 8]); c.strokeStyle = W1; c.lineWidth = 3; c.beginPath(); c.moveTo(ax(MED), 400); c.lineTo(ax(MED), 720); c.stroke(); c.restore();
      hud(c, 'DAY 421', ax(MED) + 14, 470, 48, W1, mA); hud(c, 'median country', ax(MED) + 14, 516, 36, G5, mA); }
    const mB = L.sm(24.6, 24.9, t);
    if (mB > 0) { c.save(); c.globalAlpha = mB; c.setLineDash([10, 8]); c.strokeStyle = G4; c.lineWidth = 3; c.beginPath(); c.moveTo(ax(MED), 930); c.lineTo(ax(MED), 1250); c.stroke();
      c.strokeStyle = W1; c.beginPath(); c.moveTo(ax(AIMED), 930); c.lineTo(ax(AIMED), 1250); c.stroke(); c.setLineDash([]);
      c.lineWidth = 4; c.beginPath(); c.moveTo(ax(MED) - 6, 985); c.lineTo(ax(AIMED) + 14, 985); c.moveTo(ax(AIMED) + 28, 972); c.lineTo(ax(AIMED) + 12, 985); c.lineTo(ax(AIMED) + 28, 998); c.stroke(); c.restore();
      hud(c, 'sooner', ax(AIMED) - 12, 1040, 44, W1, mB, 'right'); }
    // legend, then caption
    const lg = L.sm(20.0, 20.3, t) * (1 - L.sm(24.7, 24.9, t));
    if (lg > 0) { c.save(); c.globalAlpha = lg; c.fillStyle = RED; c.fillRect(100, 1360, 36, 36); c.fillStyle = GREEN; c.fillRect(100, 1430, 36, 36); c.restore();
      hud(c, 'countries the red reached', 156, 1392, 44, G6, lg); hud(c, 'countries the answer reached', 156, 1462, 44, G6, lg); }
    card(c, ['Same design. Same factories.', 'Better routing.'], 1400, 72, fade(t, 24.9, 27.5));
    scan(c, 0.05);
  }

  // ---------------- IN++ : back in the crowd, routed ----------------
  function finale(c, t) {
    c.fillStyle = BG; c.fillRect(0, 0, 1080, 1920);
    const z = L.lerp(64, 74, L.sm(27.5, 31.8, t)), arrive = L.sm(28.1, 28.6, t);
    c.save(); applyCam(c, C.x, C.y + 0.6, z);
    level(c, 499, z, 'ai', t);
    // the payload coming in along its route
    const pdx = P.x - C.x, pdy = P.y - C.y, pd = Math.hypot(pdx, pdy), u = L.ease.out(L.sm(27.5, 28.4, t));
    const hx = C.x, hy = C.y + 5 - 86 * 0.055 - 0.4; // front figure's hands (arms raised)
    const px = L.lerp(C.x + pdx / pd * 18, hx, u), py = L.lerp(C.y + pdy / pd * 18 - 6, hy - 2.2, u);
    c.save(); c.strokeStyle = GREEN; c.lineWidth = 0.08; c.globalAlpha = 0.6; c.beginPath(); c.moveTo(C.x + pdx / pd * 40, C.y + pdy / pd * 40 - 6); c.lineTo(px, py); c.stroke(); c.restore();
    crowdDraw(c, 1, t, true, arrive);
    glowDot(c, px, py, 0.45, GREEN); neon(c, GREEN, 0.09, () => hexPath(c, px, py, 0.7));
    c.restore();
    vignette(c, 0.28);
    c.save(); c.fillStyle = 'rgba(6,7,10,0.8)'; c.beginPath(); c.roundRect(70, 236, 650, 80, 14); c.fill(); c.restore();
    hud(c, 'ROUTED (ILLUSTRATIVE)', 96, 294, 48, W1);
    const band = Math.max(fade(t, 28.8, 30.4), fade(t, 30.5, 31.9)); if (band > 0) { const g = c.createLinearGradient(0, 340, 0, 520); g.addColorStop(0, 'rgba(6,7,10,0)'); g.addColorStop(0.5, `rgba(6,7,10,${(0.8 * band).toFixed(3)})`); g.addColorStop(1, 'rgba(6,7,10,0)'); c.fillStyle = g; c.fillRect(0, 340, 1080, 180); }
    card(c, ['People still carry it.'], 460, 96, fade(t, 28.8, 30.4));
    card(c, ['This is the bottleneck.'], 460, 96, fade(t, 30.5, 31.9));
    scan(c);
  }

  // ---------------- main ----------------
  function draw(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    if (t < FREEZE) {
      const { day } = raceFrame(ctx, t);
      if (t < 2.2 && t > 1.75) { const g = (t - 1.75) / 0.45, rg = L.rng(Math.floor(t * 30)); for (let i = 0; i < 16; i++) { const y = rg() * 1920, hh = 20 + rg() * 90; ctx.drawImage(ctx.canvas, 0, y, 1080, hh, (rg() - 0.5) * 200 * g, y, 1080, hh); } }
      hudPanel(ctx, day, t, 1, { showDay: t < 1.9 });
      if (t >= 1.8 && t < 2.2) hud(ctx, '<< REWIND', 540, 700, 80, W1, 1, 'center');
      card(ctx, ['Fastest split.', 'Slowest run.'], 690, 104, t < 1.8 ? 1 : 0);
      card(ctx, ['Designed in two days.'], 690, 96, fade(t, 4.25, 5.7));
      card(ctx, ['Then: the escort mission.'], 690, 90, fade(t, 5.8, 7.4));
      card(ctx, ['The red took weeks.'], 1420, 90, fade(t, 8.2, 9.9));
      card(ctx, ['Trials take what they take.'], 1420, 84, fade(t, 10.1, 11.9));
      card(ctx, ['Then: country by country.'], 1420, 84, fade(t, 12.4, 14.2));
      card(ctx, ['Still waiting.'], 660, 100, fade(t, 15.9, FREEZE + 0.3));
      scan(ctx);
      const sl = t < 2.2 ? 'SC1  CLOSE  COLD OPEN' : t < 5.6 ? 'SC2  CLOSE  RUN START' : t < 8.8 ? 'SC3  CRANE UP' : t < 14 ? 'SC3  WIDE  HOLD' : t < 16.2 ? 'SC4  DROP DOWN' : 'SC4  CLOSE  CROWD';
      L.slate(ctx, sl);
    } else if (t < 19.3) {
      raceFrame(ctx, FREEZE); hudPanel(ctx, dayAt(FREEZE), FREEZE, 0.5);
      ctx.fillStyle = `rgba(6,7,10,${(0.82 * L.sm(FREEZE, FREEZE + 0.3, t)).toFixed(3)})`; ctx.fillRect(0, 0, 1080, 1920);
      card(ctx, ['We slowed it down', 'so you could see it.'], 900, 92, fade(t, 17.45, 19.3));
      scan(ctx); L.slate(ctx, 'SC5  FREEZE');
    } else if (t < 27.5) { snap(ctx, t); L.slate(ctx, 'SC6  SNAP  FLAT'); }
    else if (t < 31.8) { finale(ctx, t); L.slate(ctx, 'SC7  EXTREME CLOSE  DOLLY IN'); }
    if (t >= 31.8) L.endCard(ctx, L.sm(31.8, 32.2, t), { line: 'The bottleneck is us.' });
  }

  return { draw, DUR,
    acts: [{ start: 0, end: 2.2, bpm: 0, drone: true }, { start: 2.2, end: 5.2, bpm: 0, drone: true },
      { start: 5.2, end: 9, bpm: 96 }, { start: 9, end: 13, bpm: 118 }, { start: 13, end: FREEZE, bpm: 142 }, { start: 5.2, end: FREEZE, bpm: 0, drone: true },
      { start: FREEZE, end: 19.3, bpm: 0, drone: true }, { start: 20.0, end: 27.5, bpm: 0, drone: true }, { start: 27.5, end: DUR, bpm: 0, drone: true }],
    cues: [{ t: 1.8, type: 'whoosh' }, { t: tOfDay(D_RECIPE), type: 'pop' }, { t: tOfDay(D_DESIGN), type: 'ding' }, { t: 5.2, type: 'whoosh' },
      { t: tOfDay(D_DOSE), type: 'pop' }, { t: FREEZE, type: 'stamp' }, { t: 19.3, type: 'hit' }, { t: 28.4, type: 'pop' }],
    _debug: { C: { q: C.q, hum: C.hum, ai: C.ai, rank: C.rank }, nNodes: nodes.length, floorHum: nodes.filter(n => n.hum === FLOOR).length, floorAi: nodes.filter(n => n.ai === FLOOR).length,
      medHum: sortedHum[108], medAi: sortedAi[108] } };
}
module.exports = makeScene;
