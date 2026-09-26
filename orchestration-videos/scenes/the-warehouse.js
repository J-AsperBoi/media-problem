// the-warehouse: man-in-a-hole, paper cutout, cooking. Analog: rice-2008.
// ONE mapping for the race: 1 second = 1 week, weeks 12 -> 35.7 over t 2.2 -> 26.0 (week w at t = 2.2 + (w - 12)).
// Red = price-climb extent: logistic least-squares fit through (5.3, 0.01 shape anchor, unverified), (29.1, 0.875), (30.6, 1.0):
//   K 1.564, r 0.222/wk (doubling 3.1 wk), m 28.02; clamped at 1. After the deal (wk 31.3) it decays with
//   k = ln(1/0.625)/4.4 = 0.107/wk (to 0.625 at wk 35.7, sourced June point). Scoop radius ~ sqrt(300/price).
// Green = five threads warehouse -> coast at two-sided lognormal quantiles (p10 27.3, median 31.3, p90 205.3).
// AI snap = ai_counterfactual.aggregation_median 28.3 (illustrative), same decay law. See output/the-warehouse/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('rice-2008');
  const DUR = 44, RED = L.RED, GREEN = L.GREEN;
  const rgbaG = a => `rgba(52,210,123,${a})`, rgbaR = a => `rgba(255,59,48,${a})`;
  const INK = '#2b2829', WALL = '#ddd5c7', WALL2 = '#d2c9ba', COUNTER = '#8b857d', COUNTER2 = '#76716b';
  const SKIN = '#cdbdaa', SKIN2 = '#b9a996', HAIR = '#433f40', CLOTH = '#8c8f94', CLOTH2 = '#7a7d83';

  // ---------- data ----------
  const PTS = A.threat.points; // [5.3 unverified, 29.1, 30.6, 35.7]
  const FIT = { K: 1.564, r: 0.222, m: 28.02 };
  const fit = w => FIT.K / (1 + Math.exp(-FIT.r * (w - FIT.m)));
  const frag = {}; A.solution.fragments.forEach(f => frag[f.id] = f.ready_at);
  const W_DEAL = A.solution.aggregation.median;              // 31.3
  const W_NEED = A.solution.aggregation.p10;                 // 27.3
  const W_AI = A.ai_counterfactual.aggregation_median;       // 28.3
  const W_JUNE = PTS[3].t, E_JUNE = PTS[3].extent;           // 35.7, 0.625
  const KDEC = Math.log(1 / E_JUNE) / (W_JUNE - W_DEAL);     // 0.107 / week
  const extentAt = (w, deal) => { if (w <= deal) return Math.min(1, fit(w)); return Math.min(1, fit(deal)) * Math.exp(-KDEC * (w - deal)); };
  const ext = w => extentAt(w, W_DEAL);
  const priceOf = e => 300 + 800 * e;                        // internal only (base unverified)
  // two-sided lognormal for aggregation quantiles
  const AG = A.solution.aggregation, SLO = Math.log(AG.median / AG.p10) / 1.2816, SHI = Math.log(AG.p90 / AG.median) / 1.2816;
  const zOf = q => { let lo = -8, hi = 8; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; (0.5 * (1 + L.erf(m / Math.SQRT2)) < q) ? lo = m : hi = m; } return (lo + hi) / 2; };
  const aq = q => { const z = zOf(q); return AG.median * Math.exp(z * (z < 0 ? SLO : SHI)); };

  // one mapping: week(t)
  const weekAt = t => {
    if (t < 1.2) return 30;                                   // cold open: flash-forward (same timeline)
    if (t < 2.2) return L.lerp(30, 12, L.ease.inOut((t - 1.2) / 1.0)); // labeled rewind
    return Math.min(W_JUNE, 12 + (t - 2.2));
  };

  // ---------- paper helpers ----------
  const R = L.rng(2008);
  function jag(pts, amt = 2.2, seed = 1) { // subdivide polygon edges and nudge them: hand-cut paper edge
    const out = []; for (let i = 0; i < pts.length; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length]; const n = Math.max(1, Math.floor(Math.hypot(x2 - x1, y2 - y1) / 18));
      for (let k = 0; k < n; k++) { const f = k / n; out.push([L.lerp(x1, x2, f) + (L.noise(i * 7 + k * 1.3, seed) - 0.5) * amt * 2, L.lerp(y1, y2, f) + (L.noise(i * 5 + k * 1.7, seed + 3) - 0.5) * amt * 2]); } }
    return out; }
  function shadowOn(c, d = 10) { c.shadowColor = 'rgba(35,28,22,0.38)'; c.shadowBlur = d * 1.8; c.shadowOffsetX = d * 0.35; c.shadowOffsetY = d * 0.7; }
  function poly(c, pts, fill, d = 10) { c.save(); if (d) shadowOn(c, d); c.fillStyle = fill; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fill(); c.restore(); }
  function rectP(c, x, y, w, h, fill, d = 10, seed = 1) { poly(c, jag([[x, y], [x + w, y], [x + w, y + h], [x, y + h]], 2, seed), fill, d); }
  function ellP(c, x, y, rx, ry, fill, d = 10, seed = 1, n = 40) { const pts = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, j = 1 + (L.noise(i * 0.9, seed) - 0.5) * 0.03; pts.push([x + Math.cos(a) * rx * j, y + Math.sin(a) * ry * j]); } poly(c, pts, fill, d); }
  function inkText(c, text, x, y, size, { col = INK, alpha = 1, font = SERIF, align = 'center' } = {}) { c.save(); c.globalAlpha = alpha; c.font = `${size}px "${font}"`; c.textAlign = align; c.fillStyle = col; c.fillText(text, x, y); c.restore(); }
  const cardA = (t, a, b) => L.sm(a, a + 0.25, t) * (1 - L.sm(b - 0.25, b, t));
  function card(c, lines, y, t, a, b, size = 96) { const al = cardA(t, a, b); if (al > 0) L.title(c, lines, y, size, { alpha: al }); }

  // ---------- kitchen (design coords, oversize background so any zoom covers the frame) ----------
  const leaves = Array.from({ length: 40 }, (_, k) => ({ dx: (R() - 0.5) * 160, rot: (R() - 0.5) * 3, drift: 60 + R() * 120 }));
  const grains = Array.from({ length: 30 }, () => ({ x: (R() - 0.5) * 30, ph: R(), sp: 0.7 + R() * 0.6 }));
  function face(c, hx, hy, worry, smile, look) {
    // head + hair (cut paper), readable features
    ellP(c, hx - 78, hy - 70, 48, 44, HAIR, 8, 11);                               // bun
    ellP(c, hx, hy, 104, 112, SKIN, 12, 12);                                       // head
    c.save(); c.beginPath(); c.ellipse(hx, hy, 104, 112, 0, 0, 7); c.clip();
    poly(c, jag([[hx - 120, hy - 130], [hx + 120, hy - 130], [hx + 112, hy - 40], [hx + 60, hy - 64], [hx - 10, hy - 50], [hx - 70, hy - 20], [hx - 118, hy + 30]], 3, 13), HAIR, 4);
    c.restore();
    ellP(c, hx + 62, hy + 36, 18, 13, 'rgba(190,150,140,0.35)', 0, 14);          // cheek
    const ex = [hx - 12, hx + 50], ey = hy + 2, lx = look[0] * 5, ly = look[1] * 5;
    ex.forEach((x, i) => {
      c.save(); c.fillStyle = '#f6f1e7'; c.beginPath(); c.ellipse(x, ey, 15, 11 - worry * 1.5, 0, 0, 7); c.fill();
      c.fillStyle = INK; c.beginPath(); c.arc(x + lx, ey + ly + 1, 7.5, 0, 7); c.fill();
      c.fillStyle = SKIN2; c.beginPath(); c.ellipse(x, ey - 9 - worry * 1.5, 17, 7 + worry * 3, 0, Math.PI, 0); c.fill(); // lid (heavier when worried)
      // brow: inner end raised with worry
      const inner = i === 0 ? 1 : -1; c.strokeStyle = HAIR; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath();
      c.moveTo(x - 17 * inner, ey - 26 + worry * 2); c.lineTo(x + 15 * inner, ey - 26 - worry * 12 + smile * 3); c.stroke(); c.restore();
    });
    // nose
    c.save(); c.strokeStyle = SKIN2; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(hx + 22, hy + 14); c.lineTo(hx + 30, hy + 40); c.lineTo(hx + 18, hy + 44); c.stroke();
    // mouth: curve from frown (worry) to soft smile
    const m = smile * 12 - worry * 10, mx = hx + 20, my = hy + 70; c.strokeStyle = '#6b4e4a'; c.lineWidth = 6;
    c.beginPath(); c.moveTo(mx - 24, my - m * 0.3); c.quadraticCurveTo(mx, my + m, mx + 24, my - m * 0.3); c.stroke(); c.restore();
  }
  function kitchen(c, t, w, { thread = 0, glow = 0 } = {}) {
    const e = ext(w), relief = L.sm(W_DEAL, W_JUNE, w);
    // wall
    c.fillStyle = WALL; c.fillRect(-2000, -2000, 5080, 3260 + 2000);
    c.fillStyle = WALL2; for (let i = -10; i < 30; i++) c.fillRect(i * 110, -2000, 3, 3260);
    // red ink seeping up the wall from the baseboard (height = price-climb extent)
    const top = 1260 - e * 1030;
    if (e > 0.002) {
      c.save(); c.beginPath(); c.moveTo(-2000, 1300);
      for (let x = -40; x <= 1120; x += 20) { const f = (L.noise(x * 0.018 + t * 0.25, 5) - 0.5) * 50 + (L.noise(x * 0.07, 9) - 0.5) * 34 * Math.min(1, e * 4); c.lineTo(x, top + f); }
      c.lineTo(3080, 1300); c.closePath();
      c.fillStyle = rgbaR(0.28); c.save(); c.translate(0, -26); c.fill(); c.restore();
      c.fillStyle = rgbaR(0.9); c.fill(); c.restore();
    }
    // calendar: one leaf falls per week (1 s = 1 week)
    rectP(c, 110, 400, 210, 250, '#efe9de', 8, 21); rectP(c, 110, 400, 210, 46, '#9a948c', 4, 22);
    c.fillStyle = '#b9b2a6'; for (let r = 0; r < 4; r++) for (let k = 0; k < 5; k++) c.fillRect(132 + k * 36, 468 + r * 42, 22, 22);
    const fr = w - Math.floor(w); if (t > 2.2 && t < 26 && fr < 0.8) { const lf = leaves[Math.floor(w) % 40], f = fr / 0.8;
      c.save(); c.translate(215 + lf.dx * f, 540 + f * f * 420); c.rotate(lf.rot * f); c.globalAlpha = 1 - L.sm(0.7, 1, f); rectP(c, -100, -110, 200, 220, '#efe9de', 6, 23); c.restore(); }
    // window: the sea, and across it the warehouse (always green: stock existed before t0)
    rectP(c, 590, 360, 390, 360, '#6f6b68', 12, 31);
    c.save(); c.beginPath(); c.rect(610, 380, 350, 320); c.clip();
    c.fillStyle = '#c9cccd'; c.fillRect(610, 380, 350, 320);
    poly(c, jag([[600, 548], [700, 530], [820, 520], [970, 536], [970, 580], [600, 580]], 2, 32), '#9c9892', 3);
    const wg = 0.55 + 0.45 * L.sm(0, 1, glow);
    c.save(); c.shadowColor = rgbaG(0.9); c.shadowBlur = 30; rectP(c, 800, 498, 96, 40, '#77736f', 0, 33); c.restore();
    c.fillStyle = GREEN; for (let k = 0; k < 4; k++) c.fillRect(808 + k * 22, 514, 16, 20);
    c.fillStyle = rgbaG(0.4 * wg); c.beginPath(); c.arc(848, 520, 84, 0, 7); c.fill();
    for (let i = 0; i < 5; i++) poly(c, jag([[600, 580 + i * 26], [970, 574 + i * 26], [970, 720], [600, 720]], 2, 40 + i), ['#a9afb2', '#9ea5a9', '#949b9f', '#8b9296', '#83898d'][i], 3);
    c.restore();
    c.fillStyle = '#6f6b68'; c.fillRect(775, 380, 12, 320); c.fillRect(610, 535, 350, 10);
    // mother
    const worry = L.clamp(e * 1.15, 0, 1) * (1 - relief * 0.75), smile = relief * 0.9 + glow * 0.3;
    poly(c, jag([[300, 1000], [560, 990], [620, 1300], [250, 1300]], 3, 50), CLOTH, 12);          // torso
    rectP(c, 400, 890, 62, 80, SKIN2, 4, 51);                                                     // neck
    face(c, 430, 810, worry, smile, [0.6, 0.9]);
    // counter + stove
    rectP(c, -2000, 1250, 5080, 2400, COUNTER, 14, 60); c.fillStyle = COUNTER2; c.fillRect(-2000, 1250, 5080, 22);
    rectP(c, 520, 1236, 300, 30, '#4e4b49', 6, 61);
    // pot
    poly(c, jag([[520, 1150], [800, 1150], [780, 1250], [540, 1250]], 2, 62), '#5d5a58', 12);
    ellP(c, 660, 1150, 140, 22, '#3f3c3b', 2, 63);
    const qty = 300 / priceOf(e);                                 // rice per fixed budget, relative to week 0
    ellP(c, 660, 1152, 118 * Math.sqrt(qty), 14, glow > 0 ? '#eef3ea' : '#e9e3d6', 0, 64);
    // grains falling from scoop into pot (count ~ quantity)
    const ng = Math.round(grains.length * qty);
    c.fillStyle = '#f2ede2'; for (let i = 0; i < ng; i++) { const g = grains[i], f = (t * g.sp + g.ph) % 1; c.fillRect(640 + g.x, 1080 + f * 70, 5, 8); }
    // arm + scoop (radius ~ sqrt(quantity))
    poly(c, jag([[520, 1000], [575, 995], [650, 1060], [620, 1090]], 2, 70), CLOTH2, 10);
    const sr = 70 * Math.sqrt(qty);
    ellP(c, 640, 1066, 40, 30, SKIN, 8, 71);                                                      // hand
    poly(c, jag([[640 - sr - 10, 1040], [640 + sr + 10, 1040], [640 + sr, 1070 + sr * 0.4], [640 - sr, 1070 + sr * 0.4]], 1.5, 72), '#a7a19a', 8); // scoop
    ellP(c, 640, 1038, sr + 4, sr * 0.55 + 4, glow > 0 ? '#f0f4ec' : '#ece6da', 3, 73);           // rice mound
    if (glow > 0) { c.save(); c.globalAlpha = glow; c.shadowColor = rgbaG(0.9); c.shadowBlur = 40; c.fillStyle = rgbaG(0.35); c.beginPath(); c.ellipse(640, 1040, sr + 30, sr * 0.6 + 20, 0, 0, 7); c.fill(); c.restore(); }
    poly(c, jag([[300, 1060], [260, 1250], [330, 1262], [360, 1080]], 2, 74), CLOTH2, 10);        // other arm on counter
    ellP(c, 318, 1262, 36, 20, SKIN, 6, 75);
    // the deal thread: last 10% of the q=0.5 path enters through the window
    if (thread > 0) { const p = L.clamp(thread, 0, 1), sx = 848, sy = 520, ex2 = 640, ey2 = 1030;
      c.save(); c.strokeStyle = GREEN; c.lineWidth = 8; c.lineCap = 'round'; c.shadowColor = rgbaG(0.9); c.shadowBlur = 20; c.beginPath();
      for (let i = 0; i <= 40 * p; i++) { const f = i / 40, x = L.lerp(sx, ex2, f) + Math.sin(f * Math.PI) * 120, y = L.lerp(sy, ey2, f) - Math.sin(f * Math.PI) * 40; i ? c.lineTo(x, y) : c.moveTo(x, y); }
      c.stroke(); c.restore(); }
  }

  // ---------- map (world coords 1080x1920) ----------
  const HOUSE = [340, 1500];
  const ports = [[180, 1318, 0.7], [340, 1330, 0.5], [560, 1312, 0.3], [770, 1325, 0.1], [930, 1316, 0.9]];
  ports.forEach(p => p.push(aq(p[2])));                     // arrival week per thread
  const houses = []; { const r = L.rng(77); let tries = 0; while (houses.length < 46 && tries++ < 4000) { const x = 60 + r() * 960, y = 1390 + r() * 480;
    if (Math.hypot(x - HOUSE[0], y - HOUSE[1]) < 120) continue; if (houses.some(h => Math.hypot(h[0] - x, h[1] - y) < 105)) continue; houses.push([x, y, 0.75 + r() * 0.35, Math.floor(r() * 3)]); } }
  function house(c, x, y, s, e, seed, lit = 0) {
    const w = 96 * s, h = 70 * s, cols = ['#bfb8ac', '#b3ada2', '#c8c1b5'];
    rectP(c, x - w / 2, y - h / 2, w, h, cols[seed % 3], 6, 100 + seed);
    poly(c, [[x - w / 2 - 8 * s, y - h / 2], [x, y - h / 2 - 42 * s], [x + w / 2 + 8 * s, y - h / 2]], '#8a837b', 6);
    const wx = x - 18 * s, wy = y - 16 * s, ww = 36 * s, wh = 34 * s; c.fillStyle = '#5b5755'; c.fillRect(wx, wy, ww, wh);
    c.fillStyle = RED; c.fillRect(wx, wy + wh * (1 - e), ww, wh * e);
    if (lit > 0) { c.save(); c.globalAlpha = lit; c.shadowColor = rgbaG(1); c.shadowBlur = 24; c.strokeStyle = GREEN; c.lineWidth = 5; c.strokeRect(wx - 4, wy - 4, ww + 8, wh + 8); c.restore(); }
  }
  const W0 = [540, 590];
  function threadPt(p, f) { const [px, py] = p, cx = (W0[0] + px) / 2 + (px - W0[0]) * 0.35, cy = (W0[1] + py) / 2; const a = (1 - f) * (1 - f), b = 2 * (1 - f) * f, d = f * f;
    return [a * W0[0] + b * cx + d * px, a * W0[1] + b * cy + d * py]; }
  function map(c, t, w) {
    const e = ext(w);
    c.fillStyle = '#b9b3a8'; c.fillRect(-3000, -3000, 7080, 7920);
    // far shore
    poly(c, jag([[-200, -200], [1280, -200], [1280, 610], [900, 640], [540, 628], [200, 650], [-200, 620]], 4, 201), '#aaa398', 10);
    // sea layers
    for (let i = 0; i < 7; i++) poly(c, jag([[-200, 660 + i * 95], [1280, 650 + i * 95 + (i % 2) * 14], [1280, 1360], [-200, 1360]], 4, 210 + i), ['#a6acae', '#9fa6a9', '#99a0a4', '#949b9f', '#8f969a', '#8a9195', '#858c90'][i], 6);
    // near shore
    poly(c, jag([[-200, 1340], [150, 1310], [400, 1336], [700, 1306], [1000, 1328], [1280, 1310], [1280, 2200], [-200, 2200]], 4, 220), '#cbc3b5', 12);
    // warehouse (size = resources): stock idle, green from week 0
    rectP(c, 250, 330, 580, 270, '#77736f', 14, 230);
    poly(c, [[230, 340], [540, 230], [850, 340]], '#66625f', 10);
    c.save(); c.fillStyle = '#3d3a39'; c.fillRect(300, 380, 480, 200); c.shadowColor = rgbaG(0.9); c.shadowBlur = 26; c.fillStyle = GREEN;
    for (let r = 0; r < 4; r++) for (let k = 0; k < 9; k++) { c.beginPath(); c.roundRect(312 + k * 52 + (r % 2) * 10, 396 + r * 46, 42, 38, 10); c.fill(); } c.restore();
    // green threads reaching across the sea: each connects at its own lognormal quantile week
    ports.forEach((p, i) => { const arr = p[3], f = L.clamp(w / arr, 0, 1), done = w >= arr;
      c.save(); c.strokeStyle = done ? GREEN : rgbaG(0.75); c.lineWidth = done ? 9 : 5; c.lineCap = 'round'; if (!done) c.setLineDash([16, 12]);
      c.shadowColor = rgbaG(0.8); c.shadowBlur = done ? 18 : 6; c.beginPath(); for (let k = 0; k <= 60 * f; k++) { const [x, y] = threadPt(p, k / 60); k ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
      const [tx, ty] = threadPt(p, f); c.setLineDash([]); c.fillStyle = GREEN; c.beginPath(); c.arc(tx, ty, done ? 14 : 10, 0, 7); c.fill(); c.restore(); });
    // the need lights at the kitchen's port (f2, week 27.3)
    const need = L.sm(W_NEED, W_NEED + 0.4, w); const kp = ports[1];
    if (need > 0) { c.save(); c.globalAlpha = need; c.shadowColor = rgbaG(1); c.shadowBlur = 30; c.strokeStyle = GREEN; c.lineWidth = 6; c.beginPath(); c.arc(kp[0], kp[1], 26, 0, 7); c.stroke(); c.restore(); }
    houses.forEach((h, i) => { const port = ports.reduce((b, p) => Math.abs(p[0] - h[0]) < Math.abs(b[0] - h[0]) ? p : b); house(c, h[0], h[1], h[2], e, h[3] + i, w >= port[3] ? 0.8 : 0); });
    house(c, HOUSE[0], HOUSE[1], 1.15, e, 5, w >= W_DEAL ? 1 : 0);
    // kitchen house marker: small cream cut-paper tag
    c.save(); c.strokeStyle = '#f4efe6'; c.lineWidth = 4; c.setLineDash([8, 8]); c.beginPath(); c.arc(HOUSE[0], HOUSE[1] - 6, 86, 0, 7); c.stroke(); c.restore();
  }

  // ---------- snap panels ----------
  function panel(c, y0, h, title, sub, deal, playW, t) {
    rectP(c, 70, y0, 940, h, '#f4efe6', 14, 300 + y0);
    inkText(c, title, 110, y0 + 70, 56, { align: 'left' });
    if (sub) inkText(c, sub, 110, y0 + 124, 46, { align: 'left', col: '#6a6560', font: HAND });
    const x0 = 110, x1 = 960, gy = y0 + h - 60, gh = h - 200, wx = wk => L.lerp(x0, x1, (wk - 12) / 28);
    c.strokeStyle = '#a9a39b'; c.lineWidth = 3; c.beginPath(); c.moveTo(x0, gy); c.lineTo(x1, gy); c.stroke();
    const upto = Math.min(playW, 40);
    if (upto > 12) { c.save(); c.beginPath(); c.moveTo(x0, gy); for (let wk = 12; wk <= upto + 1e-6; wk += 0.1) c.lineTo(wx(wk), gy - extentAt(wk, deal) * gh); c.lineTo(wx(upto), gy); c.closePath();
      c.fillStyle = rgbaR(0.85); c.fill(); c.restore(); }
    // peak marker (true peak, same in both lanes as a reference)
    const pkx = wx(PTS[2].t); c.save(); c.setLineDash([6, 8]); c.strokeStyle = '#8a847d'; c.lineWidth = 3; c.beginPath(); c.moveTo(pkx, gy); c.lineTo(pkx, gy - gh - 10); c.stroke(); c.restore();
    inkText(c, 'peak', pkx, gy - gh - 22, 40, { col: '#6a6560', font: HAND });
    if (playW >= deal) { const dx = wx(deal), dy = gy - extentAt(deal, deal) * gh, a = L.sm(deal, deal + 0.6, playW);
      c.save(); c.globalAlpha = a; c.shadowColor = rgbaG(1); c.shadowBlur = 24; c.fillStyle = GREEN; c.beginPath(); c.arc(dx, dy, 20, 0, 7); c.fill();
      c.strokeStyle = GREEN; c.lineWidth = 6; c.beginPath(); c.moveTo(dx, dy); c.lineTo(dx, gy); c.stroke(); c.restore();
      inkText(c, 'deal', dx - 30, dy - 30, 46, { col: '#1f8a52', font: HAND, align: 'right', alpha: a }); }
    if (playW < 40) { const px = wx(Math.max(12, playW)); c.fillStyle = INK; c.fillRect(px - 2, gy - gh - 10, 4, gh + 20); }
  }

  // ---------- camera ----------
  const KCAM = [[0, [540, 900, 1.0]], [1.2, [540, 900, 1.05]], [2.2, [540, 960, 1.0]], [11, [540, 960, 1.12]], [12.4, [540, 1300, 0.85]]];
  const KCAM2 = [[19.0, [520, 500, 0.9]], [20.4, [470, 900, 1.35]], [26, [470, 900, 1.42]], [29.8, [470, 900, 1.46]]];
  const KCAM3 = [[36.8, [590, 1090, 1.6]], [40, [600, 1110, 1.85]]];
  const MCAM = [[11.0, [HOUSE[0], HOUSE[1], 9]], [15.4, [540, 960, 1]], [17.0, [540, 960, 1]], [19.6, [HOUSE[0], HOUSE[1], 9]]];

  function draw(ctx, t) {
    ctx.fillStyle = WALL; ctx.fillRect(0, 0, 1080, 1920);
    const w = weekAt(t);
    if (t < 11.0) {
      ctx.save(); L.camera(ctx, KCAM, t); kitchen(ctx, t, w); ctx.restore();
      card(ctx, ['There was enough rice.'], 300, t, -1, 1.25, 100);
      card(ctx, ['Months earlier.'], 300, t, 1.3, 2.9, 90);
      card(ctx, ['Each week,', 'the scoop got smaller.'], 290, t, 3.4, 6.6, 92);
      card(ctx, ['Nobody here', 'did anything wrong.'], 290, t, 7.2, 10.6, 92);
      L.slate(ctx, t < 2.2 ? 'SC1  CLOSE  COLD OPEN' : 'SC2  CLOSE  1 s = 1 week');
    } else if (t < 20.4) {
      // map underneath, kitchen crossfades as a full-frame layer
      ctx.save(); L.camera(ctx, MCAM, t); map(ctx, t, w); ctx.restore();
      const kUp = t < 17 ? 1 - L.sm(11.0, 12.4, t) : L.sm(19.0, 20.4, t);
      if (kUp > 0) { ctx.save(); ctx.globalAlpha = kUp; ctx.save(); L.camera(ctx, t < 17 ? KCAM : KCAM2, t); kitchen(ctx, t, w, { thread: t < 17 ? 0 : L.clamp((w / W_DEAL - 0.9) / 0.1, 0, 1) }); ctx.restore(); ctx.restore(); }
      card(ctx, ['1.5 million tonnes.'], 300, t, 13.0, 15.0, 100);
      card(ctx, ['Idle. Across the sea.'], 300, t, 15.1, 17.1, 96);
      if (t > 16.6 && t < 19.2) { const a = cardA(t, 16.8, 19.2); L.label(ctx, 'someone needs it', ports[1][0] + 60, 1230, 46, { alpha: a * L.sm(W_NEED, W_NEED + 0.3, w), col: '#fffdf7' }); }
      L.slate(ctx, t < 15.4 ? 'SC3  CRANE UP' : t < 17 ? 'SC3  WIDE' : 'SC4  DROP DOWN');
    } else if (t < 29.8) {
      ctx.save(); L.camera(ctx, KCAM2, t); kitchen(ctx, t, w, { thread: L.clamp((w / W_DEAL - 0.9) / 0.1, 0, 1), glow: L.sm(W_DEAL, W_DEAL + 1, w) * 0.6 }); ctx.restore();
      card(ctx, ['The stock and', 'the need met.'], 290, t, 21.9, 24.2, 96);
      card(ctx, ['Prices fell a quarter', 'in a month.'], 290, t, 24.3, 26.6, 92);
      if (t > 26.4) { ctx.fillStyle = `rgba(18,16,17,${(0.62 * L.sm(26.4, 27.0, t)).toFixed(3)})`; ctx.fillRect(0, 0, 1080, 1920); }
      card(ctx, ['We slowed it down', 'so you could see it.'], 820, t, 26.8, 29.6, 100);
      L.slate(ctx, t < 21.5 ? 'SC4  CLOSE+' : 'SC5  CLOSE+  THE CLIMB');
    } else if (t < 36.8) {
      ctx.fillStyle = '#d8d0c2'; ctx.fillRect(0, 0, 1080, 1920);
      const playW = t < 31 ? 12 : 12 + (t - 31) * 7;       // weeks 12 -> 40 in 4 s, same clock both lanes
      const pin = L.sm(30.2, 30.6, t);
      if (pin > 0) { ctx.save(); ctx.globalAlpha = pin;
        panel(ctx, 420, 520, 'As it happened', null, W_DEAL, playW, t);
        panel(ctx, 990, 520, 'AI-assisted routing', 'illustrative', W_AI, playW, t);
        ctx.restore(); }
      card(ctx, ['Same stock. Same people.'], 300, t, 31.0, 33.6, 86);
      card(ctx, ['Found sooner.'], 300, t, 33.8, 36.8, 96);
      L.slate(ctx, 'SC6  WIDE  THE SNAP');
    } else if (t < 40) {
      ctx.save(); L.camera(ctx, KCAM3, t); kitchen(ctx, t, W_JUNE, { thread: 1, glow: 0.6 + 0.4 * L.sm(36.8, 38, t) }); ctx.restore();
      card(ctx, ['This is the bottleneck.'], 400, t, 37.4, 40.2, 100);
      L.slate(ctx, 'SC7  EXTREME CLOSE');
    }
    if (t >= 40) { ctx.fillStyle = '#0d1118'; ctx.fillRect(0, 0, 1080, 1920); L.endCard(ctx, L.sm(40, 40.4, t), { line: 'The bottleneck is us.' }); }
    // hard cut into the freeze: one beat of near-black
    if (t >= 29.8 && t < 30.2) { ctx.fillStyle = '#0d0c0c'; ctx.fillRect(0, 0, 1080, 1920); }
    L.grain(ctx, t, { alpha: 0.05, n: 500 });
  }

  const tDeal = 2.2 + (W_DEAL - 12);
  return { draw, DUR,
    acts: [{ start: 0, end: 29.8, bpm: 0, drone: true }, { start: 30.6, end: 44, bpm: 0, drone: true }],
    cues: [{ t: 1.2, type: 'whoosh' }, { t: 11.0, type: 'whoosh' }, { t: 2.2 + (W_NEED - 12), type: 'ding' }, { t: 17.0, type: 'whoosh' },
      { t: tDeal, type: 'pop' }, { t: 29.8, type: 'stamp' }, { t: 31 + (W_AI - 12) / 7, type: 'ding' }, { t: 31 + (W_DEAL - 12) / 7, type: 'ding' }, { t: 40, type: 'hit' }] };
}
if (typeof module !== 'undefined') module.exports = makeScene;
