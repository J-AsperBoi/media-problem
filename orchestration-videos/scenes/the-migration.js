// the-migration: nature-documentary, ink wash, ecology. Analog: rice-2008.
// ONE mapping for the race: 1 second = 1 week, weeks 12 -> 35.7 over t 2.4 -> 26.1 (week w at t = 2.4 + (w - 12)).
// Red = price-climb extent, logistic least-squares fit (same as the-warehouse): K 1.564, r 0.222/wk, m 28.02, clamped at 1;
//   after the route opens (deal, wk 31.3) it decays k = ln(1/0.625)/4.4 = 0.107/wk to the sourced June point.
// Green = the herd (idle stock, f1). Need signal (f2) at p10 27.3. Route-search trails at two-sided lognormal quantiles
//   q .5/.7/.9 -> 31.3 / 67.0 / 205.3 wk (only q .5 arrives in film). AI snap = ai_counterfactual 28.3 (illustrative).
// See output/the-migration/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const { createCanvas } = require('@napi-rs/canvas');
  const A = L.loadAnalog('rice-2008');
  const DUR = 44, RED = L.RED, GREEN = L.GREEN;
  const rgbaG = a => `rgba(52,210,123,${a})`, rgbaR = a => `rgba(255,59,48,${a})`, ink = a => `rgba(38,35,38,${a})`;
  const PAPER = '#ebe5d7', SKIN = '#f1ece2';

  // ---------- data ----------
  const PTS = A.threat.points;
  const FIT = { K: 1.564, r: 0.222, m: 28.02 };
  const fit = w => FIT.K / (1 + Math.exp(-FIT.r * (w - FIT.m)));
  const W_DEAL = A.solution.aggregation.median;           // 31.3
  const W_NEED = A.solution.aggregation.p10;              // 27.3
  const W_AI = A.ai_counterfactual.aggregation_median;    // 28.3
  const W_JUNE = PTS[3].t, E_JUNE = PTS[3].extent;        // 35.7, 0.625
  const KDEC = Math.log(1 / E_JUNE) / (W_JUNE - W_DEAL);
  const extentAt = (w, deal) => w <= deal ? Math.min(1, fit(w)) : Math.min(1, fit(deal)) * Math.exp(-KDEC * (w - deal));
  const ext = w => extentAt(w, W_DEAL);
  const bowlScale = w => Math.sqrt(300 / (300 + 800 * ext(w)));   // grain radius ~ sqrt(quantity per fixed budget)
  const AG = A.solution.aggregation, SLO = Math.log(AG.median / AG.p10) / 1.2816, SHI = Math.log(AG.p90 / AG.median) / 1.2816;
  const zOf = q => { let lo = -8, hi = 8; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; (0.5 * (1 + L.erf(m / Math.SQRT2)) < q) ? lo = m : hi = m; } return (lo + hi) / 2; };
  const aq = q => { const z = zOf(q); return AG.median * Math.exp(z * (z < 0 ? SLO : SHI)); };

  const T0 = 2.4;
  const weekAt = t => {
    if (t < 1.4) return 30;                                              // cold open flash-forward (same timeline)
    if (t < T0) return L.lerp(30, 12, L.ease.inOut((t - 1.4) / (T0 - 1.4))); // labeled rewind
    return Math.min(W_JUNE, 12 + (t - T0));
  };
  const tOfW = w => T0 + (w - 12);

  const R = L.rng(2008);
  // ---------- ink helpers ----------
  function brush(c, pts, w0, w1, col, seed = 1) {
    c.save(); c.strokeStyle = col; c.lineCap = 'round'; c.lineJoin = 'round';
    for (let i = 0; i < pts.length - 1; i++) { const f = i / (pts.length - 1); c.lineWidth = L.lerp(w0, w1, f) * (0.8 + 0.4 * L.noise(i * 0.7, seed));
      c.beginPath(); c.moveTo(pts[i][0], pts[i][1]); c.lineTo(pts[i + 1][0], pts[i + 1][1]); c.stroke(); }
    c.restore(); }
  function ridge(x0, x1, base, amp, seed, n = 60) { const pts = []; for (let i = 0; i <= n; i++) { const f = i / n, x = L.lerp(x0, x1, f);
      const h = amp * (0.55 * L.noise(f * 5, seed) + 0.35 * L.noise(f * 13, seed + 7) + 0.1 * L.noise(f * 31, seed + 3)); pts.push([x, base - h]); } return pts; }
  function washRidge(c, pts, bottom, alpha, blur = 0) {
    c.save(); if (blur) c.filter = `blur(${blur}px)`;
    let top = Infinity; pts.forEach(p => top = Math.min(top, p[1]));
    const g = c.createLinearGradient(0, top, 0, bottom); g.addColorStop(0, ink(alpha)); g.addColorStop(0.45, ink(alpha * 0.45)); g.addColorStop(1, ink(0));
    c.fillStyle = g; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.lineTo(pts[pts.length - 1][0], bottom); c.lineTo(pts[0][0], bottom); c.closePath(); c.fill();
    c.restore(); c.save(); c.filter = 'blur(1px)'; brush(c, pts, 3.5, 1.5, ink(alpha * 1.4)); c.restore(); }
  function fitFont(c, text, size, maxW, font = SERIF) { let s = size; c.font = `${s}px "${font}"`; while (c.measureText(text).width > maxW && s > 20) { s -= 2; c.font = `${s}px "${font}"`; } return s; }
  function inkTitle(c, lines, y, size, alpha, col) { if (alpha <= 0) return; c.save(); c.globalAlpha = alpha; c.textAlign = 'center'; let yy = y;
    lines.forEach((l, i) => { const L2 = typeof l === 'string' ? { text: l } : l; const fz = fitFont(c, L2.text, L2.size || size, 800); if (i) yy += fz * 1.08; c.fillStyle = L2.col || col || ink(0.95); c.fillText(L2.text, 540, yy); }); c.restore(); }
  const cardA = (t, a, b, fadeIn = 0.3) => (a <= 0 ? 1 : L.sm(a, a + fadeIn, t)) * (1 - L.sm(b - 0.3, b, t));
  // documentary lower-third: small caps location line + serif caption on a paper band
  function lowerThird(c, t, a, b, main, sub) {
    const al = cardA(t, a, b); if (al <= 0) return;
    c.save(); c.globalAlpha = al * 0.86; c.fillStyle = PAPER; c.beginPath(); c.roundRect(64, sub ? 1318 : 1360, 870, sub ? 172 : 130, 10); c.fill(); c.restore();
    c.save(); c.globalAlpha = al;
    c.fillStyle = ink(0.9); c.fillRect(96, sub ? 1350 : 1392, 6, sub ? 118 : 76);
    if (sub) { c.font = `36px "${SERIF}"`; c.fillStyle = ink(0.6); c.textAlign = 'left'; const sp = sub.split('').join(String.fromCharCode(8202)); c.fillText(sp, 128, 1384); }
    const fz = fitFont(c, main, 64, 760); c.fillStyle = ink(0.95); c.textAlign = 'left'; c.fillText(main, 128, sub ? 1458 : 1448);
    c.restore(); }

  // ---------- the protagonist: a green grain ----------
  function grain(c, x, y, s, { eyes = 0, smile = 0.5, rot = 0, glow = 0.5, look = [0, 0], detail = true } = {}) {
    c.save(); c.translate(x, y); c.rotate(rot);
    if (glow > 0) { const g = c.createRadialGradient(0, 0, 0, 0, 0, 70 * s); g.addColorStop(0, rgbaG(0.35 * glow)); g.addColorStop(1, rgbaG(0)); c.fillStyle = g; c.beginPath(); c.arc(0, 0, 70 * s, 0, 7); c.fill(); }
    c.fillStyle = GREEN; c.beginPath(); c.ellipse(0, 0, 20 * s, 31 * s, 0, 0, 7); c.fill();
    if (detail) {
      c.fillStyle = 'rgba(210,255,228,0.55)'; c.beginPath(); c.ellipse(-7 * s, -12 * s, 5 * s, 10 * s, -0.3, 0, 7); c.fill();
      c.strokeStyle = ink(0.85); c.lineWidth = Math.max(1, 2.2 * s); c.beginPath(); c.ellipse(0, 0, 20 * s, 31 * s, 0, 0, 7); c.stroke();
      // sprout
      c.lineWidth = Math.max(1, 2 * s); c.beginPath(); c.moveTo(0, -31 * s); c.quadraticCurveTo(2 * s, -40 * s, 6 * s, -44 * s); c.stroke();
      c.fillStyle = GREEN; c.beginPath(); c.ellipse(11 * s, -46 * s, 7 * s, 3.5 * s, -0.5, 0, 7); c.fill(); c.stroke();
      // face
      const ey = -3 * s, ex = 7.5 * s; c.lineWidth = Math.max(1, 2 * s); c.lineCap = 'round';
      [-1, 1].forEach(d => { const px = d * ex;
        if (eyes < 0.5) { c.strokeStyle = ink(0.9); c.beginPath(); c.arc(px, ey - 1.5 * s, 3.4 * s, 0.15 * Math.PI, 0.85 * Math.PI); c.stroke(); }
        else { const o = (eyes - 0.5) * 2; c.fillStyle = ink(0.95); c.beginPath(); c.ellipse(px + look[0] * 1.5 * s, ey + look[1] * 1.5 * s, 2.8 * s, 3.8 * s * o + 0.4 * s, 0, 0, 7); c.fill();
          c.fillStyle = '#ffffff'; c.beginPath(); c.arc(px + look[0] * 1.5 * s + 1 * s, ey + look[1] * 1.5 * s - 1.4 * s, 1 * s, 0, 7); c.fill(); } });
      c.strokeStyle = ink(0.9); c.beginPath(); c.moveTo(-4 * s, 8 * s); c.quadraticCurveTo(0, 8 * s + smile * 5 * s, 4 * s, 8 * s); c.stroke();
      // feet
      c.beginPath(); c.moveTo(-7 * s, 29 * s); c.lineTo(-9 * s, 35 * s); c.moveTo(7 * s, 29 * s); c.lineTo(9 * s, 35 * s); c.stroke();
    }
    c.restore(); }

  // ---------- CLOSE layer (the bowl at the edge of the land) ----------
  const HOR = 880;
  const closeBg = createCanvas(1080, 1920); {
    const c = closeBg.getContext('2d'); c.fillStyle = PAPER; c.fillRect(0, 0, 1080, 1920);
    for (let i = 0; i < 1400; i++) { c.fillStyle = `rgba(90,80,70,${0.03 + R() * 0.05})`; c.fillRect(R() * 1080, R() * 1920, 1 + R() * 18, 1); }
    washRidge(c, ridge(-40, 1120, 800, 240, 11), HOR, 0.16, 6);
    washRidge(c, ridge(-40, 1120, 850, 150, 23), HOR, 0.26, 3);
    washRidge(c, ridge(-40, 1120, 878, 70, 31), HOR + 20, 0.34, 2);
    // land
    const g = c.createLinearGradient(0, HOR, 0, 1920); g.addColorStop(0, ink(0.12)); g.addColorStop(1, ink(0.05)); c.fillStyle = g; c.fillRect(0, HOR, 1080, 1040);
    for (let i = 0; i < 90; i++) { const y = HOR + 10 + Math.pow(R(), 1.6) * 1000, x = R() * 1080, len = 30 + (y - HOR) * 0.25 * R(); c.save(); c.filter = 'blur(1px)'; brush(c, [[x, y], [x + len, y + (R() - 0.5) * 4]], 1 + (y - HOR) / 300, 0.5, ink(0.18)); c.restore(); }
  }
  const cracks = Array.from({ length: 34 }, () => { const x = R() * 1080, y = HOR + 20 + R() * 600; const pts = [[x, y]]; let a = R() * 6.28;
    for (let k = 0; k < 4; k++) { a += (R() - 0.5) * 1.4; const p = pts[pts.length - 1]; pts.push([p[0] + Math.cos(a) * (20 + R() * 40), p[1] + Math.sin(a) * (6 + R() * 12)]); } return pts; });
  const farHerd = Array.from({ length: 46 }, () => ({ x: 250 + (R() - 0.5) * 190, y: 846 + (R() - 0.5) * 22, r: 3 + R() * 4 }));
  const bowlGrains = Array.from({ length: 70 }, () => ({ a: R() * 6.28, d: Math.sqrt(R()) }));
  const closeCv = createCanvas(1080, 1920), cc = closeCv.getContext('2d');

  function face(c, x, y, r, { worry = 0, smile = 0, look = [0, 0] } = {}) {
    // body (ink wash)
    c.save(); c.fillStyle = ink(0.62); c.beginPath(); c.moveTo(x - r * 1.9, y + r * 3.6); c.quadraticCurveTo(x - r * 1.7, y + r * 1.25, x - r * 0.3, y + r * 1.05);
    c.lineTo(x + r * 0.3, y + r * 1.05); c.quadraticCurveTo(x + r * 1.7, y + r * 1.25, x + r * 1.9, y + r * 3.6); c.closePath(); c.fill(); c.restore();
    c.fillStyle = SKIN; c.fillRect(x - r * 0.22, y + r * 0.8, r * 0.44, r * 0.35);
    // hair back
    c.fillStyle = ink(0.88); c.beginPath(); c.ellipse(x, y - r * 0.18, r * 1.1, r * 1.02, 0, 0, 7); c.fill();
    c.fillStyle = SKIN; c.beginPath(); c.ellipse(x, y + r * 0.08, r * 0.9, r * 0.95, 0, 0, 7); c.fill();
    c.strokeStyle = ink(0.8); c.lineWidth = r * 0.04; c.stroke();
    // fringe
    c.save(); c.beginPath(); c.ellipse(x, y + r * 0.08, r * 0.92, r * 0.97, 0, 0, 7); c.clip();
    c.fillStyle = ink(0.9); c.beginPath(); c.moveTo(x - r, y - r); c.lineTo(x - r, y - r * 0.35);
    for (let i = 0; i <= 8; i++) { const f = i / 8; c.lineTo(x - r + f * 2 * r, y - r * (0.28 + 0.1 * (i % 2)) - Math.sin(f * Math.PI) * r * 0.05); }
    c.lineTo(x + r, y - r); c.closePath(); c.fill(); c.restore();
    const ey = y + r * 0.1, by = y - r * 0.12;
    [-1, 1].forEach(d => { const ex = x + d * r * 0.36;
      c.fillStyle = ink(0.95); c.beginPath(); c.ellipse(ex + look[0] * r * 0.06, ey + look[1] * r * 0.05, r * 0.08, r * 0.11, 0, 0, 7); c.fill();
      c.fillStyle = '#fff'; c.beginPath(); c.arc(ex + look[0] * r * 0.06 + r * 0.03, ey + look[1] * r * 0.05 - r * 0.04, r * 0.025, 0, 7); c.fill();
      c.strokeStyle = ink(0.85); c.lineWidth = r * 0.045; c.lineCap = 'round'; c.beginPath();
      c.moveTo(x + d * r * 0.52, by + worry * r * 0.02); c.lineTo(x + d * r * 0.2, by - worry * r * 0.13); c.stroke(); });
    const my = y + r * 0.5; c.strokeStyle = ink(0.8); c.lineWidth = r * 0.04; c.beginPath(); c.moveTo(x - r * 0.15, my); c.quadraticCurveTo(x, my + smile * r * 0.16, x + r * 0.15, my); c.stroke();
  }

  function drawClose(c, t, w, z, opts = {}) {
    const e = ext(w);
    c.save(); c.fillStyle = PAPER; c.fillRect(0, 0, 1080, 1920);
    c.translate(540, 1250); c.scale(z, z); c.translate(-540, -1250);
    c.fillStyle = PAPER; c.fillRect(-2000, -2000, 5080, 5920);
    c.drawImage(closeBg, 0, 0);
    // red wash: sky haze + land front creeping toward the viewer (height ~ extent)
    if (e > 0.005) {
      const topY = HOR - e * 520, fy = HOR + e * 600;
      c.save(); const g = c.createLinearGradient(0, topY, 0, HOR); g.addColorStop(0, rgbaR(0)); g.addColorStop(1, rgbaR(0.42 * Math.min(1, e * 1.5))); c.fillStyle = g; c.fillRect(-60, topY, 1200, HOR - topY); c.restore();
      c.save(); c.filter = 'blur(10px)'; const g2 = c.createLinearGradient(0, HOR, 0, fy); g2.addColorStop(0, rgbaR(0.7)); g2.addColorStop(1, rgbaR(0.4));
      c.fillStyle = g2; c.beginPath(); c.moveTo(-60, HOR - 4); c.lineTo(1140, HOR - 4);
      for (let i = 0; i <= 24; i++) { const x = 1140 - i * 50; c.lineTo(x, fy + (L.noise(i * 0.8, 5) - 0.5) * 70 * e); } c.closePath(); c.fill(); c.restore();
      c.save(); cracks.forEach((p, k) => { if (p[0][1] < fy - 20) brush(c, p, 3, 1, rgbaR(0.85), k); }); c.restore();
    }
    // the herd, far away on the horizon (green, resting)
    c.save(); const hg = c.createRadialGradient(250, 846, 0, 250, 846, 170); hg.addColorStop(0, rgbaG(0.55)); hg.addColorStop(1, rgbaG(0)); c.fillStyle = hg; c.beginPath(); c.arc(250, 846, 170, 0, 7); c.fill();
    c.fillStyle = GREEN; farHerd.forEach(h => { c.beginPath(); c.ellipse(h.x, h.y, h.r * 0.7, h.r, 0.3, 0, 7); c.fill(); }); c.restore();
    // after the route opens: a thin green stream from the herd toward this land
    if (w > W_DEAL) { const f = L.clamp((w - W_DEAL) / 3.0, 0, 1); const P = [[250, 850], [420, 900], [560, 990], [720, 1120], [860, 1290]];
      const n = 40; c.fillStyle = GREEN; for (let i = 0; i < n * f; i++) { const u = i / n * (P.length - 1), k = Math.floor(u), fr = u - k; const a = P[k], b = P[Math.min(k + 1, P.length - 1)];
        c.beginPath(); c.arc(L.lerp(a[0], b[0], fr), L.lerp(a[1], b[1], fr), 2 + i * 0.12, 0, 7); c.fill(); } }
    // the need signal (f2): a green lantern on a pole at the family's edge, lit at week 27.3
    brush(c, [[905, 1330], [912, 1040]], 7, 5, ink(0.8));
    if (w >= W_NEED) { const p = 0.75 + 0.25 * Math.sin(t * 5); const lg = c.createRadialGradient(915, 1035, 0, 915, 1035, 90); lg.addColorStop(0, rgbaG(0.6 * p)); lg.addColorStop(1, rgbaG(0));
      c.fillStyle = lg; c.beginPath(); c.arc(915, 1035, 90, 0, 7); c.fill(); c.fillStyle = GREEN; c.beginPath(); c.roundRect(900, 1012, 30, 42, 8); c.fill(); }
    else { c.strokeStyle = ink(0.7); c.lineWidth = 3; c.beginPath(); c.roundRect(900, 1012, 30, 42, 8); c.stroke(); }
    // family: sibling and child
    const worry = w < 15 ? 0.1 : w < W_NEED ? L.lerp(0.1, 0.9, (w - 15) / (W_NEED - 15)) : w < W_DEAL + 1.5 ? 1 : L.lerp(1, 0.1, L.clamp((w - W_DEAL - 1.5) / 2.5, 0, 1));
    const smile = w < 15 ? 0.2 : w < W_DEAL + 1.5 ? L.lerp(0.2, -0.8, L.clamp((w - 15) / 12, 0, 1)) : L.lerp(-0.8, 0.9, L.clamp((w - W_DEAL - 1.5) / 2.5, 0, 1));
    const look = opts.look || [0, 1];
    face(c, 830, 1250, 70, { worry, smile, look: [look[0] - 0.5, look[1]] });
    face(c, 520, 1160, 125, { worry, smile, look });
    // bowl
    const cx = 540, rimY = 1600, rx = 330, ry = 72, s = bowlScale(w);
    c.save(); const bg = c.createLinearGradient(0, rimY, 0, rimY + 250); bg.addColorStop(0, '#8e8a86'); bg.addColorStop(1, '#58555a'); c.fillStyle = bg;
    c.beginPath(); c.ellipse(cx, rimY, rx, 250, 0, 0, Math.PI); c.fill(); c.fillStyle = '#4c494d'; c.fillRect(cx - 110, rimY + 240, 220, 40); c.restore();
    c.fillStyle = '#403d41'; c.beginPath(); c.ellipse(cx, rimY, rx, ry, 0, 0, 7); c.fill();
    c.save(); c.beginPath(); c.ellipse(cx, rimY, rx - 8, ry - 6, 0, 0, 7); c.clip();
    const gy = rimY + (1 - s) * 70, grx = (rx - 18) * s, gry = (ry - 10) * s;
    c.fillStyle = '#f6f2e8'; c.beginPath(); c.ellipse(cx, gy, grx, gry, 0, 0, 7); c.fill();
    c.fillStyle = ink(0.25); bowlGrains.forEach(g => { c.beginPath(); c.ellipse(cx + Math.cos(g.a) * g.d * grx * 0.9, gy + Math.sin(g.a) * g.d * gry * 0.9, 5, 2.2, g.a, 0, 7); c.fill(); });
    c.restore();
    c.strokeStyle = ink(0.85); c.lineWidth = 7; c.beginPath(); c.ellipse(cx, rimY, rx, ry, 0, 0, 7); c.stroke();
    // mother's hand at the rim (left)
    c.save(); c.fillStyle = ink(0.55); c.beginPath(); c.moveTo(-40, 1560); c.quadraticCurveTo(120, 1600, 200, 1650); c.lineTo(190, 1740); c.quadraticCurveTo(80, 1720, -40, 1760); c.closePath(); c.fill();
    c.fillStyle = SKIN; c.strokeStyle = ink(0.8); c.lineWidth = 4; c.beginPath(); c.ellipse(232, 1665, 58, 44, -0.4, 0, 7); c.fill(); c.stroke();
    [0, 1, 2, 3].forEach(k => { brush(c, [[238 + k * 17, 1640], [250 + k * 18, 1602], [266 + k * 18, 1596]], 16, 13, SKIN); brush(c, [[238 + k * 17, 1640], [250 + k * 18, 1602], [266 + k * 18, 1596]], 3, 2, ink(0.5)); });
    c.restore();
    if (opts.creature) opts.creature(c);
    c.restore();
  }

  // ---------- WORLD layer (the continent-valley) ----------
  const WS = 2; const worldBg = createCanvas(1080 * WS, 1920 * WS); {
    const c = worldBg.getContext('2d'); c.scale(WS, WS); c.fillStyle = PAPER; c.fillRect(0, 0, 1080, 1920);
    for (let i = 0; i < 2500; i++) { c.fillStyle = `rgba(90,80,70,${0.03 + R() * 0.05})`; c.fillRect(R() * 1080, R() * 1920, 0.5 + R() * 10, 0.5); }
    // far mountains behind the herd's valley
    washRidge(c, ridge(-40, 1120, 420, 300, 41), 640, 0.2, 5);
    washRidge(c, ridge(-40, 1120, 500, 160, 43), 640, 0.28, 3);
    // the valley floor (herd rests here)
    c.save(); c.filter = 'blur(8px)'; c.fillStyle = ink(0.07); c.beginPath(); c.ellipse(300, 575, 260, 80, 0, 0, 7); c.fill(); c.restore();
    // middle ridges between the two lands
    [[700, 150, 51, 0.3], [820, 170, 53, 0.34], [950, 190, 57, 0.38], [1100, 200, 59, 0.42]].forEach(([b, a, s, al]) => washRidge(c, ridge(-40, 1120, b, a, s), b + 160, al, 3));
    // mist bands
    [760, 880, 1010, 1160].forEach(y => { c.save(); c.filter = 'blur(14px)'; c.fillStyle = 'rgba(235,229,215,0.8)'; c.fillRect(-40, y, 1160, 40); c.restore(); });
    // plains
    const g = c.createLinearGradient(0, 1160, 0, 1920); g.addColorStop(0, ink(0.06)); g.addColorStop(1, ink(0.12)); c.fillStyle = g; c.fillRect(0, 1160, 1080, 760);
    for (let i = 0; i < 120; i++) { const y = 1180 + R() * 720, x = R() * 1080; brush(c, [[x, y], [x + 20 + R() * 60, y + (R() - 0.5) * 3]], 1.5, 0.5, ink(0.15)); }
    // the family's home at the land's edge
    c.save(); c.filter = 'blur(1.5px)'; c.fillStyle = ink(0.55); c.beginPath(); c.moveTo(770, 1552); c.lineTo(780, 1543); c.lineTo(790, 1552); c.closePath(); c.fill(); c.fillRect(772, 1552, 16, 9); c.restore();
  }
  const HERD_C = [300, 570];
  const PROT = [332, 588];
  const herd = []; while (herd.length < 150) { const a = R() * 6.28, d = Math.sqrt(R()); const x = HERD_C[0] + Math.cos(a) * d * 200, y = HERD_C[1] + Math.sin(a) * d * 55;
    if (Math.hypot(x - PROT[0], (y - PROT[1]) * 2) < 26) continue; herd.push({ x, y, s: 0.28 + R() * 0.08, rot: (R() - 0.5) * 1.6, ph: R() * 6.28 }); }
  const ROUTE = [[PROT[0], PROT[1]], [400, 640], [470, 730], [430, 860], [560, 980], [650, 1120], [720, 1300], [775, 1440], [780, 1545]];
  const TRAILS = [
    { q: 0.7, pts: [[260, 612], [190, 740], [250, 880], [150, 1010], [220, 1170], [380, 1400], [700, 1560]] },
    { q: 0.9, pts: [[420, 605], [610, 640], [830, 730], [960, 890], [900, 1100], [820, 1400], [790, 1550]] }];
  TRAILS.forEach(tr => tr.arr = aq(tr.q));
  function polyLen(P) { let s = 0; for (let i = 1; i < P.length; i++) s += Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]); return s; }
  function along(P, f) { const tot = polyLen(P) * L.clamp(f, 0, 1); let s = 0; for (let i = 1; i < P.length; i++) { const l = Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]);
      if (s + l >= tot) { const u = l ? (tot - s) / l : 0; return [L.lerp(P[i - 1][0], P[i][0], u), L.lerp(P[i - 1][1], P[i][1], u)]; } s += l; } return P[P.length - 1]; }
  const RLEN = polyLen(ROUTE);
  // migration: a subset of the herd follows the protagonist down the opened route (the announcement moved prices; little had to ship)
  const migr = herd.map((h, i) => ({ i, d: Math.hypot(h.x - ROUTE[1][0], h.y - ROUTE[1][1]) })).sort((a, b) => a.d - b.d).slice(0, 55).map((m, k) => ({ i: m.i, k }));
  const migrOf = {}; migr.forEach(m => migrOf[m.i] = m.k);
  const LEAD_START = W_DEAL + 0.45, TRIP = 2.6; // weeks: lead leaves just after the route opens and reaches the land's edge ~week 34.3
  function routePos(wStart, w, home) { const u = (w - wStart) / TRIP; if (u <= 0) return null; if (u >= 1) return 'arrived';
    const p = along(ROUTE, u); if (home && u < 0.08) { const f = u / 0.08; return [L.lerp(home[0], p[0], f), L.lerp(home[1], p[1], f)]; } return p; }
  function protPos(w) { const p = routePos(LEAD_START, w, null); return p === null ? PROT : p === 'arrived' ? ROUTE[ROUTE.length - 1] : p; }

  function drawWorld(c, t, w, cam) {
    const e = ext(w);
    c.save(); c.fillStyle = PAPER; c.fillRect(0, 0, 1080, 1920);
    L.camera(c, [[0, cam]], 0);
    c.drawImage(worldBg, 0, 0, 1080, 1920);
    // red wash over the plains, covering width = extent (one market, one level), with a ragged front
    if (e > 0.005) { const fx = 1080 * (1 - e);
      c.save(); c.filter = 'blur(12px)'; c.fillStyle = rgbaR(0.45); c.beginPath(); c.moveTo(1120, 1150);
      for (let i = 0; i <= 20; i++) { const y = 1150 + i * 40; c.lineTo(fx + (L.noise(i * 0.7, 9) - 0.5) * 120, y); } c.lineTo(1120, 1960); c.closePath(); c.fill(); c.restore();
      c.save(); c.beginPath(); c.rect(fx, 1150, 1200, 800); c.clip(); c.strokeStyle = rgbaR(0.8); c.lineWidth = 1.5;
      for (let k = 0; k < 40; k++) { const x = (k * 97) % 1080, y = 1180 + (k * 173) % 700; c.beginPath(); c.moveTo(x, y); c.lineTo(x + 18, y + 4); c.lineTo(x + 30, y - 3); c.stroke(); } c.restore(); }
    // route-search trails (lognormal quantiles): grow w/arrival of their length
    const trailDraw = (P, f, bright) => { const n = Math.floor(70 * f); c.fillStyle = rgbaG(bright ? 0.95 : 0.7);
      for (let i = 0; i < n; i += 1) { const p = along(P, i / 70); c.beginPath(); c.arc(p[0], p[1], bright ? 3.2 : 2.4, 0, 7); c.fill(); }
      if (f < 1) { const p = along(P, f); const g = c.createRadialGradient(p[0], p[1], 0, p[0], p[1], 22); g.addColorStop(0, rgbaG(0.8)); g.addColorStop(1, rgbaG(0)); c.fillStyle = g; c.beginPath(); c.arc(p[0], p[1], 22, 0, 7); c.fill(); } };
    TRAILS.forEach(tr => trailDraw(tr.pts, w / tr.arr, false));
    const open = w >= W_DEAL;
    if (!open) trailDraw(ROUTE, w / W_DEAL, false);
    else { c.save(); c.strokeStyle = rgbaG(0.35 + 0.35 * L.sm(W_DEAL, W_DEAL + 0.6, w)); c.lineWidth = 7; c.lineCap = 'round'; c.lineJoin = 'round'; c.beginPath(); ROUTE.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); c.restore(); }
    // need signal (f2) at the land's edge
    if (w >= W_NEED) { const p = 0.7 + 0.3 * Math.sin(t * 5); const g = c.createRadialGradient(790, 1528, 0, 790, 1528, 60); g.addColorStop(0, rgbaG(0.8 * p)); g.addColorStop(1, rgbaG(0)); c.fillStyle = g; c.beginPath(); c.arc(790, 1528, 60, 0, 7); c.fill();
      c.fillStyle = GREEN; c.beginPath(); c.arc(790, 1528, 6, 0, 7); c.fill(); }
    // herd glow
    const hg = c.createRadialGradient(HERD_C[0], HERD_C[1], 0, HERD_C[0], HERD_C[1], 260); hg.addColorStop(0, rgbaG(0.3)); hg.addColorStop(1, rgbaG(0)); c.fillStyle = hg; c.beginPath(); c.ellipse(HERD_C[0], HERD_C[1], 280, 130, 0, 0, 7); c.fill();
    const z = cam[2], detail = z > 3.2;
    herd.forEach((h, i) => { let x = h.x, y = h.y + Math.sin(t * 1.3 + h.ph) * 0.6, rot = h.rot, eyes = 0;
      if (w > W_DEAL) { const wake = L.clamp((w - W_DEAL - 0.1 - (i % 7) * 0.05) / 0.4, 0, 1); rot = L.lerp(h.rot, 0, wake); eyes = wake; }
      if (i in migrOf) { const p = routePos(LEAD_START + 0.12 + migrOf[i] * 0.045, w, [h.x, h.y]); if (p === 'arrived') return; if (p) { x = p[0]; y = p[1] - Math.abs(Math.sin(t * 9 + h.ph)) * 1.2; rot = 0; } }
      grain(c, x, y, h.s, { eyes, rot, glow: 0.25, detail, smile: 0.3 }); });
    // the protagonist
    const pp = protPos(w); const wk = L.clamp((w - W_DEAL) / 0.3, 0, 1); const hop = w > LEAD_START ? Math.abs(Math.sin(t * 8)) * 1.5 : 0;
    grain(c, pp[0], pp[1] - hop + Math.sin(t * 1.3) * 0.5, 0.42, { eyes: wk, rot: L.lerp(-0.9, 0, wk), glow: 0.6, smile: L.lerp(0.4, 0.9, wk), look: w > LEAD_START ? [0.6, 0.6] : [0, 0] });
    c.restore(); }

  // ---------- SNAP panel ----------
  function panel(c, y0, dealW, label, sub, wNow, alpha, ghostW) {
    const x0 = 70, w = 940, h = 440, cx0 = x0 + 50, cx1 = x0 + w - 70, by = y0 + h - 50, ty = y0 + 150;
    const X = wk => L.lerp(cx0, cx1, (wk - 12) / 28), Y = e => L.lerp(by, ty, e);
    c.save(); c.globalAlpha = alpha;
    c.fillStyle = 'rgba(255,252,244,0.7)'; c.beginPath(); c.roundRect(x0, y0, w, h, 14); c.fill();
    brush(c, [[x0, y0], [x0 + w, y0], [x0 + w, y0 + h], [x0, y0 + h], [x0, y0]], 4, 3, ink(0.75));
    c.font = `50px "${SERIF}"`; c.fillStyle = ink(0.95); c.textAlign = 'left'; c.fillText(label, x0 + 34, y0 + 66);
    if (sub) { c.font = `44px "${SERIF}"`; c.fillStyle = ink(0.6); c.fillText(sub, x0 + 34, y0 + 116); }
    brush(c, [[cx0, by], [cx1, by]], 3, 3, ink(0.5));
    const wEnd = Math.min(wNow, 40);
    if (wEnd > 12) { c.fillStyle = rgbaR(0.35); c.beginPath(); c.moveTo(X(12), by); for (let k = 0; k <= 80; k++) { const wk = L.lerp(12, wEnd, k / 80); c.lineTo(X(wk), Y(extentAt(wk, dealW))); } c.lineTo(X(wEnd), by); c.closePath(); c.fill();
      c.strokeStyle = RED; c.lineWidth = 6; c.lineJoin = 'round'; c.beginPath(); for (let k = 0; k <= 80; k++) { const wk = L.lerp(12, wEnd, k / 80); const p = [X(wk), Y(extentAt(wk, dealW))]; k ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); } c.stroke(); }
    if (ghostW && wNow >= ghostW) { c.strokeStyle = ink(0.45); c.lineWidth = 3; c.setLineDash([10, 10]); c.beginPath(); c.moveTo(X(ghostW), by); c.lineTo(X(ghostW), ty - 20); c.stroke(); c.setLineDash([]);
      const f = L.sm(0, 0.5, (wNow - ghostW) / 7); if (f > 0) { const yy = ty - 4; c.strokeStyle = GREEN; c.lineWidth = 6; c.beginPath(); c.moveTo(X(ghostW), yy); c.lineTo(L.lerp(X(ghostW), X(dealW) + 14, f), yy); c.stroke();
        c.fillStyle = GREEN; c.beginPath(); c.moveTo(X(dealW) + 4, yy); c.lineTo(X(dealW) + 22, yy - 11); c.lineTo(X(dealW) + 22, yy + 11); c.fill(); } }
    if (wNow >= dealW) { const x = X(dealW); c.strokeStyle = GREEN; c.lineWidth = 6; c.beginPath(); c.moveTo(x, by); c.lineTo(x, ty - 30); c.stroke();
      grain(c, x, ty - 62, 1.0, { eyes: 1, glow: 0.8, smile: 0.9 });
      c.font = `46px "${SERIF}"`; c.fillStyle = ink(0.95); c.textAlign = 'center'; c.fillText(`Week ${Math.floor(dealW)}`, x, by + 40); }
    else grain(c, cx0 + 30, by - 36, 1.0, { eyes: 0, rot: -0.9, glow: 0.4 });
    c.restore(); }

  // ---------- SC7 hands ----------
  function drawHands(c, t, z) {
    c.save(); c.fillStyle = PAPER; c.fillRect(0, 0, 1080, 1920); L.camera(c, [[0, [540, 1250, z]]], 0);
    c.drawImage(closeBg, 0, 0);
    const e = ext(40); const g = c.createLinearGradient(0, HOR - 200, 0, HOR + 200); g.addColorStop(0, rgbaR(0)); g.addColorStop(0.5, rgbaR(0.3 * e)); g.addColorStop(1, rgbaR(0)); c.fillStyle = g; c.fillRect(-100, HOR - 200, 1280, 400);
    c.fillStyle = ink(0.55); c.beginPath(); c.moveTo(-100, 1920); c.quadraticCurveTo(200, 1500, 360, 1420); c.lineTo(720, 1420); c.quadraticCurveTo(880, 1500, 1180, 1920); c.closePath(); c.fill();
    c.fillStyle = SKIN; c.strokeStyle = ink(0.8); c.lineWidth = 6;
    c.beginPath(); c.moveTo(330, 1330); c.quadraticCurveTo(300, 1500, 540, 1520); c.quadraticCurveTo(780, 1500, 750, 1330); c.quadraticCurveTo(540, 1420, 330, 1330); c.closePath(); c.fill(); c.stroke();
    [0, 1, 2].forEach(k => { brush(c, [[360 + k * 40, 1350 + k * 20], [390 + k * 40, 1420 + k * 10]], 4, 2, ink(0.5)); brush(c, [[720 - k * 40, 1350 + k * 20], [690 - k * 40, 1420 + k * 10]], 4, 2, ink(0.5)); });
    grain(c, 540, 1300 + Math.sin(t * 2) * 3, 4.2, { eyes: 1, smile: 1, glow: 1, look: [0, 0.4] });
    c.restore(); }

  // ---------- shots ----------
  const lzKey = (keys, t) => { const v = L.key(keys.map(([a, [x, y, z]]) => [a, [x, y, Math.log(z)]]), t); return [v[0], v[1], Math.exp(v[2])]; };
  const CRANE = [[9.5, [780, 1545, 7]], [15.5, [540, 960, 1]], [19.0, [540, 960, 1]], [21.7, [PROT[0], PROT[1] - 8, 11]]];
  function sceneAt(ctx, t) {
    const w = weekAt(t);
    if (t < 9.5) {
      const z = t < 1.4 ? L.lerp(1.0, 1.04, t / 1.4) : t < T0 ? 1.04 : L.key([[T0, 1.0], [9.5, 1.1]], t);
      drawClose(ctx, t, w, z);
      L.slate(ctx, t < T0 ? 'SC1  CLOSE  EYE LEVEL' : 'SC2  CLOSE  SLOW PUSH');
    } else if (t < 23.6) {
      let cam;
      if (t < 21.7) cam = lzKey(CRANE, t);
      else { const p = protPos(w); const f = L.ease.inOut(L.clamp((t - 21.7) / 1.9, 0, 1)); cam = [p[0], p[1] - 8 + f * 40, Math.exp(L.lerp(Math.log(11), Math.log(3.5), f))]; }
      drawWorld(ctx, t, w, cam);
      if (t < 11.8) { drawClose(cc, t, w, L.lerp(1.1, 0.3, L.ease.in(L.clamp((t - 9.5) / 2.3, 0, 1)))); ctx.save(); ctx.globalAlpha = 1 - L.sm(9.6, 11.0, t); ctx.drawImage(closeCv, 0, 0); ctx.restore(); }
      L.slate(ctx, t < 15.5 ? 'SC3  CRANE UP' : t < 19 ? 'SC3b  WIDE' : t < 21.7 ? 'SC4  DROP DOWN' : 'SC4b  CLOSE  TRACK');
    } else {
      const land = [690, 1560];
      const creature = c => { const f = L.ease.out(L.clamp((t - 23.8) / 1.1, 0, 1)); const x = L.lerp(1000, land[0], f), y = L.lerp(1330, land[1], f) - Math.abs(Math.sin(t * 7)) * 14 * (1 - f);
        grain(c, x, y, 2.6, { eyes: 1, smile: 0.9, glow: 0.9, look: [-0.8, 0.3] }); };
      drawClose(ctx, t, w, L.key([[23.6, 1.3], [26.5, 1.4]], t), { creature, look: [0.6, 0.8] });
      if (t < 24.3) { drawWorld(cc, t, w, [protPos(w)[0], protPos(w)[1] + 32, 3.5]); ctx.save(); ctx.globalAlpha = 1 - L.sm(23.6, 24.3, t); ctx.drawImage(closeCv, 0, 0); ctx.restore(); }
      L.slate(ctx, 'SC5  CLOSER  EYE LEVEL');
    }
    // captions (documentary lower-thirds)
    lowerThird(ctx, t, 0, 1.4, 'Enough grain existed. Just not here.', 'THE DRY SEASON');
    lowerThird(ctx, t, 1.4, 2.8, 'Months earlier.', null);
    lowerThird(ctx, t, 2.9, 5.9, 'Here, a family and its bowl.', 'THE EDGE OF THE LAND');
    lowerThird(ctx, t, 6.1, 9.4, 'Each week, the bowl holds less.', null);
    lowerThird(ctx, t, 11.9, 14.9, 'Far away, a herd of grain rests.', 'ACROSS THE RIDGES');
    lowerThird(ctx, t, 15.1, 18.7, 'It cannot find a route.', null);
    lowerThird(ctx, t, 19.1, 21.6, 'Week after week, it waits.', null);
    lowerThird(ctx, t, 21.8, 23.6, 'Then, a route opens.', null);
    lowerThird(ctx, t, 23.9, 26.45, 'The red recedes within weeks.', null);
  }

  function draw(ctx, t) {
    if (t >= 39.8) { L.endCard(ctx, L.sm(39.8, 40.2, t), { line: 'The bottleneck is us.' }); return; }
    if (t >= 36.6) {
      drawHands(ctx, t, L.key([[36.6, 1.6], [39.8, 1.9]], t));
      inkTitle(ctx, ['This is the bottleneck.'], 420, 96, L.sm(36.9, 37.3, t));
      L.slate(ctx, 'SC7  EXTREME CLOSE  PUSH IN');
    } else if (t >= 30.0) {
      ctx.fillStyle = PAPER; ctx.fillRect(0, 0, 1080, 1920); ctx.drawImage(closeBg, 0, 0, 1080, 1920, 0, 0, 1080, 1920); ctx.fillStyle = 'rgba(235,229,215,0.82)'; ctx.fillRect(0, 0, 1080, 1920);
      const wNow = t < 30.6 ? 12 : Math.min(40, 12 + (t - 30.6) * 7);
      const a = L.sm(30.0, 30.4, t);
      panel(ctx, 380, W_DEAL, 'As it happened', null, wNow, a, null);
      panel(ctx, 870, W_AI, 'AI-assisted routing', 'illustrative', wNow, a, W_DEAL);
      inkTitle(ctx, ['The same weeks, at full speed.'], 290, 64, cardA(t, 30.1, 33.4));
      inkTitle(ctx, ['Same herd. Found sooner.'], 290, 70, cardA(t, 33.6, 36.55));
      L.slate(ctx, 'SC6  SNAP  SPLIT');
    } else if (t >= 29.3) {
      ctx.fillStyle = PAPER; ctx.fillRect(0, 0, 1080, 1920);
      const g = ctx.createRadialGradient(540, 960, 0, 540, 960, 30); g.addColorStop(0, ink(0.9)); g.addColorStop(1, ink(0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(540, 960, 30, 0, 7); ctx.fill();
    } else if (t >= 26.5) {
      sceneAt(ctx, 26.45);
      ctx.fillStyle = `rgba(235,229,215,${0.8 * L.sm(26.5, 26.9, t)})`; ctx.fillRect(0, 0, 1080, 1920);
      inkTitle(ctx, ['We slowed it down', 'so you could see it.'], 900, 92, L.sm(26.6, 27.0, t));
      L.slate(ctx, 'HOLD');
    } else sceneAt(ctx, t);
    L.grain(ctx, t, { alpha: 0.04, n: 400 });
  }

  return { draw, DUR,
    acts: [{ start: 0, end: 29.3, bpm: 0, drone: true }, { start: 30.0, end: 44, bpm: 0, drone: true }],
    cues: [{ t: 1.4, type: 'whoosh' }, { t: 9.5, type: 'whoosh' }, { t: tOfW(W_NEED), type: 'ding' }, { t: 19.0, type: 'whoosh' },
      { t: tOfW(W_DEAL), type: 'pop' }, { t: 29.3, type: 'stamp' }, { t: 30.6 + (W_AI - 12) / 7, type: 'ding' }, { t: 30.6 + (W_DEAL - 12) / 7, type: 'ding' }, { t: 39.8, type: 'hit' }] };
}
if (typeof module !== 'undefined') module.exports = makeScene;
