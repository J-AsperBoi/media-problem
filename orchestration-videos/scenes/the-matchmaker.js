// the-matchmaker: powers-of-ten-zoom, blueprint, market. Analog: rice-2008.
// ONE mapping for the race: 1 second = 1 week, week w at t = 2.0 + (w - 12), weeks 12 -> 35.7 over t 2.0 -> 25.7.
// Red = price-climb extent, logistic fit reused from the-warehouse: K 1.564, r 0.222/wk, m 28.02 (clamped at 1);
//   after the deal decays with k = ln(1/0.625)/4.4 = 0.107/wk (sourced June point). Same single number at every scale.
// Green = five hand-routed ledger lines at two-sided lognormal quantiles (p10 27.3, median 31.3, p90 205.3).
// AI snap = ai_counterfactual.aggregation_median 28.3 (illustrative): a faint candidate line; people sign.
// Camera: one fixed zoom center, log zoom u; sheets BOWL x10 KITCHEN x10 STREET x20 COUNTRY x12 LEDGER.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('rice-2008');
  const DUR = 43, RED = L.RED, GREEN = L.GREEN;
  const rgbaG = a => `rgba(52,210,123,${a})`, rgbaR = a => `rgba(255,59,48,${a})`;
  const BG = '#34404c', INK = '#e3e9ee', DIM = '#9eadbb', FAINT = 'rgba(214,224,232,0.28)';

  // ---------- data ----------
  const PTS = A.threat.points;
  const FIT = { K: 1.564, r: 0.222, m: 28.02 };
  const fit = w => FIT.K / (1 + Math.exp(-FIT.r * (w - FIT.m)));
  const AG = A.solution.aggregation;
  const W_DEAL = AG.median, W_NEED = AG.p10, W_AI = A.ai_counterfactual.aggregation_median;
  const W_JUNE = PTS[3].t, E_JUNE = PTS[3].extent;
  const KDEC = Math.log(1 / E_JUNE) / (W_JUNE - W_DEAL);
  const extentAt = (w, deal) => w <= deal ? Math.min(1, fit(w)) : Math.min(1, fit(deal)) * Math.exp(-KDEC * (w - deal));
  const ext = w => extentAt(w, W_DEAL);
  const qtyOf = e => 300 / (300 + 800 * e);            // rice per fixed budget, relative to week 0 (internal only)
  const SLO = Math.log(AG.median / AG.p10) / 1.2816, SHI = Math.log(AG.p90 / AG.median) / 1.2816;
  const zOf = q => { let lo = -8, hi = 8; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; (0.5 * (1 + L.erf(m / Math.SQRT2)) < q) ? lo = m : hi = m; } return (lo + hi) / 2; };
  const aq = q => { const z = zOf(q); return AG.median * Math.exp(z * (z < 0 ? SLO : SHI)); };

  const weekAt = t => {
    if (t < 1.2) return 30;
    if (t < 2.0) return L.lerp(30, 12, L.ease.inOut((t - 1.2) / 0.8));
    return Math.min(W_JUNE, 12 + (t - 2.0));
  };

  // ---------- camera: log zoom-out u ----------
  const D = [10, 10, 20, 12], M = [1]; D.forEach((d, i) => M.push(M[i] * d));
  const UMAX = Math.log10(M[4]);
  const uAt = t => {
    if (t < 5) return L.key([[0, 0], [2, 0], [5, -0.04]], t);
    if (t < 14) { const f = (t - 5) / 9; return -0.04 + (UMAX + 0.04) * Math.pow(f, 1.7); }
    if (t < 22.3) return L.key([[14, UMAX], [22.3, UMAX - 0.06]], t);
    if (t < 25.7) return L.key([[22.3, UMAX - 0.06], [25.7, -0.2]], t);
    if (t < 36.8) return -0.2;
    return L.key([[36.8, -0.2], [39.5, -0.45]], t);
  };
  const NAMES = ['ONE BOWL', 'KITCHEN', 'STREET', 'COUNTRY', 'WORLD GRAIN LEDGER'];

  // ---------- helpers ----------
  const R = L.rng(3108);
  let S = 1; const px = v => v / S;
  function line(c, x1, y1, x2, y2, w = 3, col = INK) { c.strokeStyle = col; c.lineWidth = px(w); c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); }
  function rect(c, x, y, w, h, lw = 3, col = INK) { c.strokeStyle = col; c.lineWidth = px(lw); c.strokeRect(x, y, w, h); }
  function polyPath(c, pts) { c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); }
  function txt(c, s, x, y, size, col = INK, align = 'center', font = HAND, alpha = 1) { c.save(); c.globalAlpha *= alpha; c.font = `${px(size)}px "${font}"`; c.textAlign = align; c.fillStyle = col; c.fillText(s, x, y); c.restore(); }
  function hatch(c, x0, y0, x1, y1, sp, col, lw) { c.strokeStyle = col; c.lineWidth = px(lw); c.beginPath(); const h = y1 - y0;
    for (let x = x0 - h; x < x1; x += sp) { c.moveTo(x, y1); c.lineTo(x + h, y0); } c.stroke(); }
  function dimH(c, x1, x2, y, label) { line(c, x1, y, x2, y, 2, DIM); [x1, x2].forEach(x => line(c, x, y - px(12), x, y + px(12), 2, DIM)); if (label) txt(c, label, (x1 + x2) / 2, y - px(12), 40, DIM); }
  function blobPts(cx, cy, rx, ry, seed, n = 28) { const p = []; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, j = 1 + (L.noise(i * 0.8, seed) - 0.5) * 0.45 + (L.noise(i * 2.3, seed + 9) - 0.5) * 0.15; p.push([cx + Math.cos(a) * rx * j, cy + Math.sin(a) * ry * j]); } return p; }
  function glowDot(c, x, y, r, a = 1) { c.save(); c.globalAlpha *= a; c.shadowColor = rgbaG(1); c.shadowBlur = px(22); c.fillStyle = GREEN; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.restore(); }
  function signature(c, x, y, wd, p, lw = 5) { // hand signature, drawn progressively (people sign)
    c.save(); c.strokeStyle = GREEN; c.lineWidth = px(lw); c.lineCap = 'round'; c.shadowColor = rgbaG(0.9); c.shadowBlur = px(14); c.beginPath();
    const n = Math.floor(60 * L.clamp(p, 0, 1)); for (let i = 0; i <= n; i++) { const f = i / 60, xx = x + f * wd + Math.sin(f * 30) * wd * 0.05, yy = y - Math.sin(f * 17) * wd * 0.12 * (1 - f * 0.5) - Math.cos(f * 9) * wd * 0.05; i ? c.lineTo(xx, yy) : c.moveTo(xx, yy); }
    c.stroke(); c.restore(); }

  // ---------- SHEET 0: one bowl (face + bowl) ----------
  const BX = 540, BY = 1180, BRX = 280, BRY = 210;   // bowl: lower half-ellipse
  const riceGr = Array.from({ length: 170 }, () => { const x = BX + (R() * 2 - 1) * BRX, y = BY + R() * BRY; return [x, y, R() * 3]; })
    .filter(([x, y]) => ((x - BX) / BRX) ** 2 + ((y - BY) / BRY) ** 2 < 0.92);
  function sheetBowl(c, t, w, { extraRelief = 0 } = {}) {
    const e = ext(w), qty = qtyOf(e), relief = Math.max(L.sm(W_DEAL, W_JUNE, w), extraRelief);
    const worry = L.clamp(e * 1.2, 0, 1) * (1 - relief * 0.7), smile = relief * 0.8;
    // centre line (drafting)
    c.save(); c.setLineDash([px(26), px(10), px(4), px(10)]); line(c, 540, 360, 540, 1470, 2, FAINT); c.restore();
    // shoulders + neck
    c.strokeStyle = INK; c.lineWidth = px(4); c.beginPath(); c.moveTo(495, 862); c.lineTo(495, 930); c.quadraticCurveTo(300, 950, 240, 1060); c.lineTo(210, 1400); c.stroke();
    c.beginPath(); c.moveTo(585, 862); c.lineTo(585, 930); c.quadraticCurveTo(780, 950, 840, 1060); c.lineTo(870, 1400); c.stroke();
    // collar
    c.beginPath(); c.moveTo(470, 940); c.quadraticCurveTo(540, 1010, 610, 940); c.stroke();
    // head
    c.fillStyle = BG; c.beginPath(); c.ellipse(540, 660, 215, 228, 0, 0, 7); c.fill(); c.stroke();
    // hair: contour lines across the crown
    c.lineWidth = px(3); for (let i = 0; i < 6; i++) { c.beginPath(); c.ellipse(540, 660, 215 - i * 3, 228 - i * 3, 0, Math.PI * (1.08 + i * 0.012), Math.PI * (1.92 - i * 0.012)); c.stroke(); }
    c.beginPath(); c.moveTo(335, 600); c.quadraticCurveTo(420, 520, 540, 548); c.quadraticCurveTo(640, 520, 748, 610); c.stroke();
    // ears
    c.lineWidth = px(4); c.beginPath(); c.arc(326, 690, 32, Math.PI * 0.5, Math.PI * 1.5); c.stroke(); c.beginPath(); c.arc(754, 690, 32, -Math.PI * 0.5, Math.PI * 0.5); c.stroke();
    // eyes (looking down into the bowl)
    [[462, 1], [618, -1]].forEach(([ex, side]) => {
      const ey = 690; c.lineWidth = px(4); c.beginPath(); c.ellipse(ex, ey, 34, 22 - worry * 4, 0, 0, 7); c.stroke();
      c.fillStyle = INK; c.beginPath(); c.arc(ex + side * -2, ey + 8 - worry * 2, 11, 0, 7); c.fill();
      c.beginPath(); c.moveTo(ex - 36, ey - 4 - worry * 3); c.quadraticCurveTo(ex, ey - 22 - worry * 4, ex + 36, ey - 4 - worry * 3); c.stroke(); // lid
      c.lineWidth = px(6); c.beginPath(); c.moveTo(ex - side * 40, ey - 44 + worry * 2); c.lineTo(ex + side * 30, ey - 50 - worry * 18 + smile * 4); c.stroke(); // brow, inner end raised
    });
    c.lineWidth = px(4); c.beginPath(); c.moveTo(540, 700); c.lineTo(530, 760); c.lineTo(552, 764); c.stroke();
    const m = smile * 16 - worry * 14; c.beginPath(); c.moveTo(500, 812 - m * 0.3); c.quadraticCurveTo(540, 812 + m, 580, 812 - m * 0.3); c.stroke();
    // bowl interior: red hatch (what the price took) above rice (what the budget still buys)
    const yR = BY + BRY * (1 - qty);
    c.save(); c.beginPath(); c.ellipse(BX, BY, BRX, BRY, 0, 0, Math.PI); c.closePath(); c.clip();
    c.fillStyle = rgbaR(0.16); c.fillRect(BX - BRX, BY, BRX * 2, yR - BY);
    c.save(); c.beginPath(); c.rect(BX - BRX, BY, BRX * 2, yR - BY); c.clip(); hatch(c, BX - BRX, BY, BX + BRX, yR, px(20), RED, 3.5); c.restore();
    c.fillStyle = INK; riceGr.forEach(([x, y, a]) => { if (y > yR + 6) { c.save(); c.translate(x, y); c.rotate(a); c.fillRect(-7, -3, 14, 6); c.restore(); } });
    c.restore();
    line(c, BX - BRX + 8, yR, BX + BRX - 8, yR, 2.5, e > 0.05 ? RED : INK);
    // bowl section
    c.strokeStyle = INK; c.lineWidth = px(5); c.beginPath(); c.ellipse(BX, BY, BRX, BRY, 0, 0, Math.PI); c.stroke();
    c.lineWidth = px(3); c.beginPath(); c.ellipse(BX, BY, BRX + 16, BRY + 16, 0, 0, Math.PI); c.stroke();
    line(c, BX - BRX - 16, BY, BX - BRX, BY, 4); line(c, BX + BRX, BY, BX + BRX + 16, BY, 4);
    rect(c, 470, 1392, 140, 8, 3);
    // portion dimension
    line(c, 200, yR, 200, BY, 2.5, DIM); line(c, 186, yR, 214, yR, 2.5, DIM); line(c, 186, BY, 214, BY, 2.5, DIM); line(c, 214, BY, 250, BY, 1.5, DIM); line(c, 214, yR, 256, yR, 1.5, DIM);
    txt(c, 'empty', 186, (yR + BY) / 2 + 14, 42, DIM, 'right');
    // table (continues onto the kitchen sheet)
    line(c, -4000, 1400, 5000, 1400, 5); line(c, -4000, 1430, 5000, 1430, 2.5, DIM);
  }
  function stockCallout(c, a) {
    if (a <= 0) return; c.save(); c.globalAlpha *= a;
    c.save(); c.setLineDash([px(14), px(10)]); line(c, 898, 850, 1200, 760, 3, rgbaG(0.7)); c.restore();
    c.strokeStyle = GREEN; c.lineWidth = px(5); c.shadowColor = rgbaG(1); c.shadowBlur = px(18); c.beginPath(); c.arc(862, 860, 38, 0, 7); c.stroke(); c.shadowBlur = 0;
    c.fillStyle = GREEN; for (let k = 0; k < 3; k++) c.fillRect(841 + k * 15, 852, 11, 18);
    txt(c, 'stock:', 900, 942, 46, GREEN, 'right'); txt(c, 'other sheet', 900, 990, 46, GREEN, 'right');
    c.restore();
  }

  // ---------- SHEET 1: kitchen (elevation) ----------
  function sheetKitchen(c, t, w) {
    const e = ext(w), qty = qtyOf(e);
    // walls in section
    c.save(); c.beginPath(); c.rect(80, 484, 920, 740); c.rect(100, 504, 880, 700); c.clip('evenodd'); hatch(c, 80, 484, 1000, 1224, px(16), FAINT, 1.5); c.restore();
    rect(c, 80, 484, 920, 740, 3); rect(c, 100, 504, 880, 700, 3);
    line(c, -4000, 1204, 5000, 1204, 4);
    dimH(c, 100, 980, 450, 'kitchen');
    // table (top line continues from the bowl sheet at y 1004)
    line(c, 340, 1004, 740, 1004, 4); line(c, 340, 1007, 740, 1007, 2, DIM); line(c, 362, 1007, 362, 1204, 3); line(c, 718, 1007, 718, 1204, 3);
    // chair behind the child + legs
    line(c, 478, 935, 478, 1204, 2.5, DIM); line(c, 602, 935, 602, 1204, 2.5, DIM); line(c, 478, 1075, 602, 1075, 3, DIM);
    line(c, 522, 1010, 522, 1075, 3); line(c, 558, 1010, 558, 1075, 3); line(c, 522, 1075, 512, 1190, 3); line(c, 558, 1075, 568, 1190, 3);
    // lamp
    line(c, 540, 504, 540, 800, 2, DIM); polyPath(c, [[508, 830], [572, 830], [556, 800], [524, 800]]); c.strokeStyle = INK; c.lineWidth = px(3); c.stroke();
    // window
    rect(c, 700, 600, 180, 200, 3); line(c, 790, 600, 790, 800, 2); line(c, 700, 700, 880, 700, 2);
    c.strokeStyle = DIM; c.lineWidth = px(2); c.beginPath(); c.moveTo(702, 760); c.quadraticCurveTo(760, 735, 820, 752); c.quadraticCurveTo(850, 760, 878, 745); c.stroke();
    // shelf + rice jar (same fraction as the bowl)
    line(c, 140, 720, 400, 720, 4); line(c, 160, 720, 180, 750, 2); line(c, 380, 720, 360, 750, 2);
    const jx = 210, jy = 590, jw = 80, jh = 130, jr = jy + jh * (1 - qty);
    c.save(); c.beginPath(); c.rect(jx, jy, jw, jh); c.clip(); c.fillStyle = rgbaR(0.16); c.fillRect(jx, jy, jw, jr - jy); c.save(); c.beginPath(); c.rect(jx, jy, jw, jr - jy); c.clip(); hatch(c, jx, jy, jx + jw, jr, px(14), RED, 2.5); c.restore();
    c.fillStyle = INK; for (let yy = jr + 8; yy < jy + jh; yy += 12) for (let xx = jx + 8 + (Math.floor(yy) % 2) * 6; xx < jx + jw - 4; xx += 14) c.fillRect(xx, yy, 7, 3); c.restore();
    rect(c, jx, jy, jw, jh, 3); rect(c, jx + 12, jy - 16, jw - 24, 16, 3);
    rect(c, 300, 650, 60, 70, 2.5, DIM);
    // door
    rect(c, 128, 900, 130, 304, 3); c.fillStyle = INK; c.beginPath(); c.arc(240, 1060, 5, 0, 7); c.fill();
    // stove + pot
    rect(c, 790, 1040, 170, 164, 3); line(c, 790, 1070, 960, 1070, 2); rect(c, 830, 985, 90, 55, 3); line(c, 820, 985, 930, 985, 3);
  }

  // ---------- SHEET 2: street (elevation) ----------
  const G = 984.4;
  const houses2 = []; { const r = L.rng(22); let x = -260; while (x < 1340) { const wd = 80 + r() * 60, ht = 55 + r() * 45; if (x + wd > 470 && x < 620) { x = 622; continue; } houses2.push([x, wd, ht, r()]); x += wd + 10 + r() * 30; } }
  const blocks2 = []; { const r = L.rng(23); for (let i = 0; i < 16; i++) blocks2.push([-300 + r() * 1700, 60 + r() * 60, 150 + r() * 220]); }
  const stalls = [[300, 0], [800, 1]];
  const queue = [[250, 0], [272, 1], [294, 2], [230, 3], [760, 4], [740, 5], [720, 6]];
  function sheetStreet(c, t, w) {
    const e = ext(w);
    blocks2.forEach(([x, wd, ht]) => { rect(c, x, G - ht, wd, ht, 1.5, FAINT); for (let yy = G - ht + 14; yy < G - 30; yy += 22) line(c, x + 10, yy, x + wd - 10, yy, 1, FAINT); });
    houses2.forEach(([x, wd, ht, k]) => { c.fillStyle = BG; c.fillRect(x, G - ht, wd, ht); rect(c, x, G - ht, wd, ht, 2.5);
      polyPath(c, [[x - 6, G - ht], [x + wd / 2, G - ht - 30 - k * 14], [x + wd + 6, G - ht]]); c.fillStyle = BG; c.fill(); c.strokeStyle = INK; c.lineWidth = px(2.5); c.stroke();
      rect(c, x + wd * 0.2, G - ht * 0.7, wd * 0.22, ht * 0.3, 2, DIM); rect(c, x + wd * 0.58, G - ht * 0.7, wd * 0.22, ht * 0.3, 2, DIM); });
    // our house: roof over the kitchen section
    polyPath(c, [[478, 912.4], [544, 862], [610, 912.4]]); c.strokeStyle = INK; c.lineWidth = px(3); c.stroke(); rect(c, 580, 870, 12, 26, 2.5);
    // market stalls: price board filled to the price-climb extent
    stalls.forEach(([sx]) => { line(c, sx - 60, G - 70, sx + 60, G - 70, 3); line(c, sx - 55, G - 70, sx - 55, G, 2.5); line(c, sx + 55, G - 70, sx + 55, G, 2.5);
      polyPath(c, [[sx - 66, G - 70], [sx, G - 96], [sx + 66, G - 70]]); c.strokeStyle = INK; c.lineWidth = px(2.5); c.stroke();
      const bx = sx - 26, by = G - 150, bw = 52, bh = 44; line(c, sx, by + bh, sx, G - 96, 2);
      c.fillStyle = RED; c.fillRect(bx, by + bh * (1 - e), bw, bh * e); rect(c, bx, by, bw, bh, 2.5); rect(c, sx - 50, G - 40, 100, 40, 2, DIM); });
    queue.forEach(([qx, i]) => L.stick(c, qx, G - 17, 0.34, { col: INK, mood: e > 0.5 ? 'sad' : 'bored', seed: 40 + i, t, pose: { armL: 0.25, armR: 0.25 } }));
    line(c, -4000, G, 5000, G, 4); line(c, -4000, G + 34, 5000, G + 34, 2, DIM);
    c.save(); c.setLineDash([px(20), px(16)]); line(c, -4000, G + 17, 5000, G + 17, 2, FAINT); c.restore();
    dimH(c, 60, 1020, 760, 'street');
  }

  // ---------- SHEET 3: country (plan) ----------
  const land = blobPts(540, 1000, 360, 560, 31, 60);
  const lTop = Math.min(...land.map(p => p[1])), lBot = Math.max(...land.map(p => p[1]));
  const towns = []; { const r = L.rng(33); while (towns.length < 9) { const x = 260 + r() * 560, y = 560 + r() * 880; if (Math.hypot(x - 540, y - 960) > 150 && ((x - 540) / 330) ** 2 + ((y - 1000) / 520) ** 2 < 0.7) towns.push([x, y]); } }
  function sheetCountry(c, t, w) {
    const e = ext(w);
    // red: land hatched from the south up to the price-climb extent
    const yTop = lBot - e * (lBot - lTop);
    c.save(); polyPath(c, land); c.clip(); c.fillStyle = rgbaR(0.14); c.fillRect(0, yTop, 1080, lBot - yTop + 10); c.save(); c.beginPath(); c.rect(0, yTop, 1080, lBot - yTop + 10); c.clip(); hatch(c, 100, yTop, 1000, lBot + 10, px(22), RED, 3); c.restore();
    if (e > 0.02) line(c, 0, yTop, 1080, yTop, 3, RED); c.restore();
    polyPath(c, land); c.strokeStyle = INK; c.lineWidth = px(4); c.stroke();
    c.save(); polyPath(c, blobPts(540, 1000, 390, 590, 31, 60)); c.setLineDash([px(6), px(10)]); c.strokeStyle = FAINT; c.lineWidth = px(2); c.stroke(); c.restore();
    towns.forEach(([x, y]) => { line(c, 540, 960, x, y, 1.5, FAINT); rect(c, x - 9, y - 9, 18, 18, 2.5); });
    c.strokeStyle = DIM; c.lineWidth = px(3); c.beginPath(); c.moveTo(300, 620); c.bezierCurveTo(420, 780, 380, 940, 520, 990); c.stroke();
    // the city in plan, around the street sheet
    for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) if (Math.abs(i) + Math.abs(j) > 1 && Math.hypot(i, j) < 3.3) rect(c, 540 + i * 13 - 5, 960 + j * 13 - 5, 10, 10, 1.5, DIM);
    const port = land.reduce((b, p) => p[0] > b[0] ? p : b); c.strokeStyle = INK; c.lineWidth = px(3); c.beginPath(); c.arc(port[0] - 16, port[1], 12, 0, 7); c.stroke();
    dimH(c, 180, 900, 380, 'country');
  }

  // ---------- SHEET 4: world grain ledger ----------
  const CW = 90, CH = 160, cc = (i, j) => [540 + CW * j, 960 + CH * i];
  const STOCK = [-2, 2];
  const cells = []; { const r = L.rng(44); for (let i = -6; i <= 6; i++) for (let j = -7; j <= 7; j++) { if ((i === 0 && j === 0) || (i === STOCK[0] && j === STOCK[1])) continue;
    const [x, y] = cc(i, j); cells.push({ i, j, x, y, imp: r() < 0.38, pts: blobPts(x + (r() - 0.5) * 16, y - 10 + (r() - 0.5) * 16, 16 + r() * 16, 24 + r() * 20, 100 + i * 20 + j, 18) }); } }
  const TARGETS = [[1, -3, 0.1], [3, 1, 0.3], [0, 0, 0.5], [-4, -2, 0.7], [4, -4, 0.9]].map(([i, j, q]) => ({ i, j, q, arr: aq(q) }));
  TARGETS.forEach((tg, k) => { // hand routing: a wandering walk over the ledger from the stock cell to the need cell
    for (let seed = 1; seed < 400; seed++) { const r = L.rng(500 + k * 1000 + seed); let [i, j] = STOCK, prev = null; const path = [[i, j]]; let ok = false;
      for (let s = 0; s < 18; s++) { const opts = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(d => !(prev && d[0] === -prev[0] && d[1] === -prev[1]) && Math.abs(i + d[0]) <= 5 && Math.abs(j + d[1]) <= 5);
        const toward = opts.filter(d => Math.sign(tg.i - i) === d[0] && d[0] !== 0 || Math.sign(tg.j - j) === d[1] && d[1] !== 0);
        const d = (r() < 0.5 && toward.length) ? toward[Math.floor(r() * toward.length)] : opts[Math.floor(r() * opts.length)];
        i += d[0]; j += d[1]; prev = d; path.push([i, j]); if (i === tg.i && j === tg.j) { ok = true; break; } }
      if (ok && path.length >= 9) { const off = (k - 2) * 7; tg.pts = path.map(([a, b]) => { const [x, y] = cc(a, b); return [x + off, y + off * 1.6]; }); break; } }
    let len = 0; tg.seg = [0]; for (let s = 1; s < tg.pts.length; s++) { len += Math.hypot(tg.pts[s][0] - tg.pts[s - 1][0], tg.pts[s][1] - tg.pts[s - 1][1]); tg.seg.push(len); } tg.len = len; });
  function partial(c, pts, seg, p) { const L2 = seg[seg.length - 1] * p; c.beginPath(); c.moveTo(pts[0][0], pts[0][1]); let end = pts[0];
    for (let s = 1; s < pts.length; s++) { if (seg[s] <= L2) { c.lineTo(pts[s][0], pts[s][1]); end = pts[s]; } else { const f = (L2 - seg[s - 1]) / (seg[s] - seg[s - 1]); end = [L.lerp(pts[s - 1][0], pts[s][0], f), L.lerp(pts[s - 1][1], pts[s][1], f)]; c.lineTo(end[0], end[1]); break; } }
    c.stroke(); return end; }
  function redBar(c, x, y, e) { c.fillStyle = RED; c.fillRect(x - 34, y + 56, 68 * e, 12); rect(c, x - 34, y + 56, 68, 12, 1.5, DIM); }
  function warehouse(c, x, y, s = 1) { c.save(); c.shadowColor = rgbaG(1); c.shadowBlur = px(26); c.strokeStyle = GREEN; c.lineWidth = px(3.5);
    c.strokeRect(x - 30 * s, y - 14 * s, 60 * s, 34 * s); c.beginPath(); c.moveTo(x - 36 * s, y - 14 * s); c.lineTo(x, y - 34 * s); c.lineTo(x + 36 * s, y - 14 * s); c.stroke();
    c.fillStyle = GREEN; for (let k = 0; k < 4; k++) c.fillRect(x - 24 * s + k * 13 * s, y - 4 * s, 9 * s, 18 * s); c.restore(); }
  function sheetLedger(c, t, w) {
    const e = ext(w);
    c.strokeStyle = FAINT; c.lineWidth = px(1.5); c.beginPath();
    for (let j = -8; j <= 8; j++) { const x = 540 + CW * (j + 0.5); c.moveTo(x, -200); c.lineTo(x, 2120); }
    for (let i = -7; i <= 7; i++) { const y = 960 + CH * (i + 0.5); c.moveTo(-200, y); c.lineTo(1280, y); } c.stroke();
    cells.forEach(cl => { polyPath(c, cl.pts); c.strokeStyle = cl.imp ? INK : DIM; c.lineWidth = px(cl.imp ? 2.2 : 1.5); c.stroke(); if (cl.imp) redBar(c, cl.x, cl.y, e); });
    redBar(c, 540, 960, e);
    const [sx, sy] = cc(...STOCK); warehouse(c, sx, sy - 6, 1);
    // hand-routed lines
    TARGETS.forEach(tg => { const p = L.clamp(w / tg.arr, 0, 1), done = p >= 1; c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
      c.strokeStyle = done ? GREEN : rgbaG(0.6); c.lineWidth = px(done ? 5 : 3); if (!done) c.setLineDash([px(12), px(9)]); if (done) { c.shadowColor = rgbaG(0.9); c.shadowBlur = px(16); }
      const end = partial(c, tg.pts, tg.seg, p); c.restore(); glowDot(c, end[0], end[1], px(done ? 9 : 7));
      if (done) { const [x, y] = cc(tg.i, tg.j); c.save(); c.strokeStyle = GREEN; c.lineWidth = px(4); c.shadowColor = rgbaG(1); c.shadowBlur = px(16); c.strokeRect(x - CW / 2 + 4, y - CH / 2 + 4, CW - 8, CH - 8); c.restore(); } });
    // the need (f2) is posted at week 27.3
    const need = L.sm(W_NEED, W_NEED + 0.5, w);
    if (need > 0) { c.save(); c.globalAlpha *= need; c.strokeStyle = GREEN; c.lineWidth = px(4); c.setLineDash([px(10), px(8)]); c.strokeRect(540 - CW / 2 - 6, 960 - CH / 2 - 6, CW + 12, CH + 12); c.restore(); }
    // the deal: people sign
    if (w >= W_DEAL) signature(c, 490, 1112, 100, (w - W_DEAL) / 0.5, 4);
  }

  // ---------- background grid (log-periodic, screen space) ----------
  function bgGrid(c, u) {
    c.fillStyle = BG; c.fillRect(0, 0, 1080, 1920);
    const p = ((u % 1) + 1) % 1;
    [6000, 600, 60].forEach(base => { const sp = base * Math.pow(10, -p); const a = 0.13 * L.sm(10, 60, sp) * (1 - L.sm(700, 1800, sp)); if (a < 0.005) return;
      c.strokeStyle = `rgba(200,215,228,${a.toFixed(3)})`; c.lineWidth = 1.5; c.beginPath();
      for (let x = 540 - Math.ceil(540 / sp) * sp; x <= 1080; x += sp) { c.moveTo(x, 0); c.lineTo(x, 1920); }
      for (let y = 960 - Math.ceil(960 / sp) * sp; y <= 1920; y += sp) { c.moveTo(0, y); c.lineTo(1080, y); } c.stroke(); });
  }
  const SHEETS = [sheetBowl, sheetKitchen, sheetStreet, sheetCountry, sheetLedger];
  function world(c, t, u, w, opt = {}) {
    for (let k = 4; k >= 0; k--) {
      const Sk = M[k] * Math.pow(10, -u);
      const a = (k === 4 ? 1 : L.sm(0.02, 0.06, Sk)) * (k === 0 ? 1 : 1 - L.sm(3, 8, Sk));
      if (a < 0.01) continue;
      c.save(); c.globalAlpha = a; c.translate(540, 960); c.scale(Sk, Sk); c.translate(-540, -960); S = Sk;
      c.lineCap = 'round'; c.lineJoin = 'round'; SHEETS[k](c, t, w, opt);
      if (k === 0) stockCallout(c, opt.callout || 0);
      c.restore();
    }
    S = 1;
  }
  function titleBlock(c, u, a = 1) {
    let best = 0, bd = 9; for (let k = 0; k < 5; k++) { const d = Math.abs(Math.log10(M[k]) - u); if (d < bd) { bd = d; best = k; } }
    c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(40,50,60,0.85)'; c.fillRect(80, 1404, 560, 88); c.strokeStyle = INK; c.lineWidth = 2.5; c.strokeRect(80, 1404, 560, 88); c.beginPath(); c.moveTo(210, 1404); c.lineTo(210, 1492); c.stroke();
    c.font = `34px "${HAND}"`; c.fillStyle = DIM; c.textAlign = 'left'; c.fillText('SHEET', 100, 1460);
    c.font = `44px "${HAND}"`; c.fillStyle = INK; c.fillText(NAMES[best], 228, 1464); c.restore();
  }
  const cardA = (t, a, b) => L.sm(a, a + 0.25, t) * (1 - L.sm(b - 0.25, b, t));
  function card(c, lines, y, t, a, b, size = 96) { const al = cardA(t, a, b); if (al > 0) L.title(c, lines, y, size, { alpha: al }); }

  // ---------- snap panels ----------
  const routeP = (() => { const r = L.rng(71), pts = [[850, 0]]; for (let k = 1; k < 9; k++) pts.push([850 - k * 78 + (r() - 0.5) * 30, (r() - 0.5) * 90]); pts.push([230, 0]); return pts; })();
  function panel(c, y0, h, title, sub, mode, deal, playW) {
    c.fillStyle = 'rgba(38,47,57,0.92)'; c.fillRect(70, y0, 940, h); c.strokeStyle = INK; c.lineWidth = 3; c.strokeRect(70, y0, 940, h);
    c.save(); c.font = `58px "${SERIF}"`; c.fillStyle = INK; c.textAlign = 'left'; c.fillText(title, 104, y0 + 70); c.restore();
    if (sub) L.label(c, sub, 104, y0 + 120, 46, { col: DIM, align: 'left' });
    const my = y0 + (sub ? 215 : 190), e = extentAt(playW, deal);
    // need cell and stock cell
    c.strokeStyle = INK; c.lineWidth = 2.5; c.strokeRect(150, my - 60, 80, 120); polyPath(c, blobPts(190, my - 10, 22, 30, 31, 20)); c.stroke();
    c.fillStyle = RED; c.fillRect(160, my + 36, 60 * e, 12); c.strokeStyle = DIM; c.lineWidth = 1.5; c.strokeRect(160, my + 36, 60, 12);
    if (playW >= W_NEED) { c.save(); c.strokeStyle = GREEN; c.lineWidth = 4; c.setLineDash([10, 8]); c.strokeRect(142, my - 68, 96, 136); c.restore(); }
    c.strokeStyle = INK; c.lineWidth = 2.5; c.strokeRect(850, my - 60, 80, 120); S = 1; warehouse(c, 890, my + 4, 0.9);
    const signed = playW >= deal;
    if (mode === 'human') { const pts = routeP.map(([x, y]) => [x, my + y]); let seg = [0]; for (let s = 1; s < pts.length; s++) seg.push(seg[s - 1] + Math.hypot(pts[s][0] - pts[s - 1][0], pts[s][1] - pts[s - 1][1]));
      pts.slice(1, -1).forEach(([x, y]) => { c.strokeStyle = FAINT; c.lineWidth = 1.5; c.strokeRect(x - 14, y - 14, 28, 28); });
      const p = L.clamp(playW / deal, 0, 1); c.save(); c.strokeStyle = signed ? GREEN : rgbaG(0.6); c.lineWidth = signed ? 5 : 3; if (!signed) c.setLineDash([12, 9]); c.lineCap = 'round'; const end = partial(c, pts, seg, p); c.restore(); glowDot(c, end[0], end[1], 8);
    } else { const p = L.clamp((playW - W_NEED) / (W_AI - W_NEED), 0, 1);
      if (p > 0) { c.save(); c.strokeStyle = signed ? GREEN : 'rgba(225,233,240,0.55)'; c.lineWidth = signed ? 5 : 2.5; if (!signed) c.setLineDash([6, 10]); c.beginPath(); c.moveTo(850, my); c.lineTo(L.lerp(850, 230, p), my); c.stroke(); c.restore();
        L.label(c, 'candidate match', 540, my - 22, 44, { col: 'rgba(225,233,240,0.8)' }); } }
    if (signed) { S = 1; signature(c, 250, my + 50, 110, (playW - deal) / 0.6, 4); L.label(c, 'people sign', 300, my + 110, 44, { col: GREEN, align: 'left', alpha: L.sm(deal, deal + 0.4, playW) }); }
    // price-climb curve on one clock
    const x0 = 110, x1 = 970, gy = y0 + h - 34, gh = gy - (my + 140), wx = wk => L.lerp(x0, x1, (wk - 12) / 28);
    c.strokeStyle = DIM; c.lineWidth = 2.5; c.beginPath(); c.moveTo(x0, gy); c.lineTo(x1, gy); c.stroke();
    const upto = Math.min(playW, 40);
    if (upto > 12) { c.beginPath(); c.moveTo(x0, gy); for (let wk = 12; wk <= upto + 1e-6; wk += 0.1) c.lineTo(wx(wk), gy - extentAt(wk, deal) * gh); c.lineTo(wx(upto), gy); c.closePath(); c.fillStyle = rgbaR(0.85); c.fill(); }
    if (signed) { const dx = wx(deal); c.save(); c.strokeStyle = GREEN; c.lineWidth = 5; c.shadowColor = rgbaG(1); c.shadowBlur = 16; c.beginPath(); c.moveTo(dx, gy); c.lineTo(dx, gy - gh - 8); c.stroke(); c.restore(); }
    if (playW < 40 && playW > 12) { c.fillStyle = INK; c.fillRect(wx(playW) - 2, gy - gh - 8, 4, gh + 16); }
  }

  // ---------- draw ----------
  function draw(ctx, t) {
    const u = uAt(t);
    if (t < 29.6) {
      const w = weekAt(t);
      bgGrid(ctx, u);
      world(ctx, t, u, w, { callout: 1 - L.sm(4.4, 5.4, t) });
      titleBlock(ctx, u, (1 - L.sm(26.6, 27.0, t)) * (t > 22 ? 1 - L.sm(0.02, 0.15, -u) : 1));
      // ledger labels (screen space, only while the ledger is on screen)
      const la = L.sm(13.4, 14.2, t) * (1 - L.sm(22.3, 22.9, t));
      if (la > 0) { const Sk = Math.pow(10, UMAX - u), P = ([x, y]) => [540 + (x - 540) * Sk, 960 + (y - 960) * Sk];
        const [sx, sy] = P(cc(...STOCK)); L.label(ctx, 'stock', sx, sy - 94 * Sk, 46, { col: GREEN, alpha: la });
        if (w >= W_NEED) { const [nx, ny] = P([540, 960]); L.label(ctx, 'need', nx, ny - 100 * Sk, 46, { col: GREEN, alpha: la * L.sm(W_NEED, W_NEED + 0.5, w) }); }
        if (w >= W_DEAL) { const [nx, ny] = P([540, 960]); L.label(ctx, 'people sign', nx, ny + 190 * Sk, 46, { col: GREEN, alpha: la * L.sm(W_DEAL, W_DEAL + 0.5, w) }); } }
      card(ctx, ['Enough rice.', 'One sheet away.'], 262, t, -1, 1.25, 100);
      card(ctx, ['Months earlier.'], 300, t, 1.3, 2.6, 92);
      card(ctx, ['One bowl.'], 300, t, 2.7, 4.8, 100);
      card(ctx, ['Every kitchen,', 'the same price.'], 290, t, 7.2, 10.2, 92);
      card(ctx, ['1.5 million tonnes.'], 300, t, 14.4, 16.6, 96);
      card(ctx, ['Idle. Two cells over.'], 300, t, 16.7, 18.9, 92);
      card(ctx, ['Routed by hand.'], 300, t, 19.0, 21.2, 96);
      card(ctx, ['People signed.'], 300, t, 21.4, 23.4, 96);
      card(ctx, ['Prices fell a quarter.'], 300, t, 24.3, 26.9, 92);
      if (t > 26.9) { ctx.fillStyle = `rgba(22,28,35,${(0.72 * L.sm(26.9, 27.3, t)).toFixed(3)})`; ctx.fillRect(0, 0, 1080, 1920); }
      card(ctx, ['We slowed it down', 'so you could see it.'], 860, t, 27.1, 29.5, 100);
      L.slate(ctx, t < 2.0 ? 'SC1  CLOSE  COLD OPEN' : t < 5 ? 'SC2  CLOSE  1 s = 1 week' : t < 14 ? 'SC3  CONTINUOUS ZOOM OUT' : t < 22.3 ? 'SC4  WIDE  THE LEDGER' : 'SC5  DIVE IN  CLOSER');
    } else if (t < 36.8) {
      bgGrid(ctx, 0.3);
      const playW = t < 30.4 ? 12 : Math.min(40, 12 + (t - 30.4) * 7);
      const pin = L.sm(29.8, 30.2, t);
      if (pin > 0) { ctx.save(); ctx.globalAlpha = pin;
        panel(ctx, 380, 540, 'As it happened', null, 'human', W_DEAL, playW);
        panel(ctx, 950, 560, 'Frontier AI drafts the match', 'illustrative · people still sign', 'ai', W_AI, playW);
        ctx.restore(); }
      card(ctx, ['Same stock. Same people.'], 290, t, 34.4, 36.8, 84);
      L.slate(ctx, 'SC6  WIDE  THE SNAP  one clock');
    } else if (t < 39.5) {
      bgGrid(ctx, u); world(ctx, t, u, W_JUNE, { extraRelief: L.sm(36.8, 38.2, t) });
      card(ctx, ['This is the bottleneck.'], 1300, t, 37.2, 39.6, 96);
      L.slate(ctx, 'SC7  EXTREME CLOSE');
    }
    if (t >= 39.5) { ctx.fillStyle = '#0d1118'; ctx.fillRect(0, 0, 1080, 1920); L.endCard(ctx, L.sm(39.5, 39.9, t), { line: 'The bottleneck is us.' }); }
    if (t >= 29.6 && t < 29.8) { ctx.fillStyle = '#0d0f12'; ctx.fillRect(0, 0, 1080, 1920); }
    L.grain(ctx, t, { alpha: 0.04, n: 400 });
  }

  const tW = w => 2.0 + (w - 12);
  return { draw, DUR,
    acts: [{ start: 0, end: 29.6, bpm: 0, drone: true }, { start: 30.2, end: DUR, bpm: 0, drone: true }],
    cues: [{ t: 1.2, type: 'whoosh' }, { t: 5.0, type: 'whoosh' }, { t: 14.0, type: 'hit' }, { t: tW(W_NEED), type: 'ding' }, { t: tW(W_DEAL), type: 'pop' },
      { t: 22.3, type: 'whoosh' }, { t: 29.6, type: 'stamp' }, { t: 30.4 + (W_AI - 12) / 7, type: 'ding' }, { t: 30.4 + (W_DEAL - 12) / 7, type: 'ding' }, { t: 39.5, type: 'hit' }] };
}
if (typeof module !== 'undefined') module.exports = makeScene;
