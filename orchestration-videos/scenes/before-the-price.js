// before-the-price: before-after, children's-book flat, cooking. Analog: rice-2008.
// ONE mapping while running: 1 second = 2 weeks, with stops (time frozen): see output/before-the-price/notes.md.
// Red = price-climb extent: logistic least-squares fit through (5.3, 0.01 shape anchor, unverified), (29.1, 0.875), (30.6, 1.0):
//   K 1.564, r 0.222/wk (doubling ~3.1 wk), m 28.02; clamped at 1. After the deal (wk 31.3) it decays with
//   k = ln(1/0.625)/4.4 = 0.107/wk (to 0.625 at wk 35.7, sourced June point). Pot linear scale = sqrt(300/price).
// Green = five threads warehouse -> shore at two-sided lognormal quantiles (p10 27.3, median 31.3, p90 205.3).
// AI snap = ai_counterfactual.aggregation_median 28.3 (illustrative), same decay law.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('rice-2008');
  const DUR = 40, RED = L.RED, GREEN = L.GREEN;
  const rgbaG = a => `rgba(52,210,123,${a})`, rgbaR = a => `rgba(255,59,48,${a})`;
  const WALL = '#e3dccf', WALL2 = '#dbd3c5', TABLE = '#a39a8d', TABLE2 = '#958c80', CLOTH = '#cdc4b6', CLOTH2 = '#c2b9ab';
  const SKIN = '#e0cbb6', SKIN2 = '#cfb8a2', CARD = '#8e8883', CARD2 = '#7f7974', SHIRT = '#b6aea3', SHIRT2 = '#a59d92';
  const HAIRK = '#56504c', HAIRG = '#c4bfb7', POT = '#6a655f', POT2 = '#57524d', RICE = '#f6f2e9', BOWL = '#9c948a', BOWL2 = '#8a8278', INK = '#3a3634';

  // ---------- data ----------
  const PTS = A.threat.points;                               // [5.3 unverified, 29.1, 30.6, 35.7]
  const FIT = { K: 1.564, r: 0.222, m: 28.02 };
  const fit = w => FIT.K / (1 + Math.exp(-FIT.r * (w - FIT.m)));
  const W_DEAL = A.solution.aggregation.median;              // 31.3
  const W_NEED = A.solution.aggregation.p10;                 // 27.3
  const W_AI = A.ai_counterfactual.aggregation_median;       // 28.3
  const W_PEAK = PTS[2].t;                                   // 30.6
  const W_JUNE = PTS[3].t, E_JUNE = PTS[3].extent;           // 35.7, 0.625
  const KDEC = Math.log(1 / E_JUNE) / (W_JUNE - W_DEAL);     // 0.107 / week
  const extentAt = (w, deal) => (w <= deal ? Math.min(1, fit(w)) : Math.min(1, fit(deal)) * Math.exp(-KDEC * (w - deal)));
  const qtyOf = e => 300 / (300 + 800 * e);                  // rice per fixed budget (relative; base only a ratio)
  const AG = A.solution.aggregation, SLO = Math.log(AG.median / AG.p10) / 1.2816, SHI = Math.log(AG.p90 / AG.median) / 1.2816;
  const zOf = q => { let lo = -8, hi = 8; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; (0.5 * (1 + L.erf(m / Math.SQRT2)) < q) ? lo = m : hi = m; } return (lo + hi) / 2; };
  const aq = q => { const z = zOf(q); return AG.median * Math.exp(z * (z < 0 ? SLO : SHI)); };

  // ONE mapping: running segments at 1 s = 2 weeks; stops freeze the clock.
  const SEG = [[0, 1.4, 'hold', W_PEAK], [1.4, 4.2, 'hold', 12], [4.2, 8.2, 'run', 12], [8.2, 9.8, 'hold', 20], [9.8, 13.4, 'run', 20],
    [13.4, 17.4, 'hold', 27.2], [17.4, 19.45, 'run', 27.2], [19.45, 20.2, 'hold', W_DEAL], [20.2, 22.4, 'run', W_DEAL], [22.4, 99, 'hold', W_JUNE]];
  const weekAt = t => { for (const [a, b, k, w0] of SEG) if (t < b) return k === 'run' ? Math.min(w0 + (t - a) * 2, 40) : w0; return W_JUNE; };
  const running = t => SEG.some(([a, b, k]) => k === 'run' && t >= a && t < b);

  // ---------- flat helpers ----------
  const R = L.rng(2008);
  function rr(c, x, y, w, h, r, fill) { c.fillStyle = fill; c.beginPath(); c.roundRect(x, y, w, h, r); c.fill(); }
  function circ(c, x, y, r, fill) { c.fillStyle = fill; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
  function ell(c, x, y, rx, ry, fill) { c.fillStyle = fill; c.beginPath(); c.ellipse(x, y, Math.max(0.1, rx), Math.max(0.1, ry), 0, 0, 7); c.fill(); }
  function limb(c, x1, y1, x2, y2, w, col) { c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); }
  function glowDot(c, x, y, r, a = 1) { c.save(); c.globalAlpha = a; const g = c.createRadialGradient(x, y, 0, x, y, r * 4); g.addColorStop(0, rgbaG(0.55)); g.addColorStop(1, rgbaG(0)); c.fillStyle = g; c.beginPath(); c.arc(x, y, r * 4, 0, 7); c.fill(); circ(c, x, y, r, GREEN); c.restore(); }
  function inkText(c, text, x, y, size, { col = INK, alpha = 1, font = SERIF, align = 'center' } = {}) { c.save(); c.globalAlpha = alpha; c.font = `${size}px "${font}"`; c.textAlign = align; c.fillStyle = col; c.fillText(text, x, y); c.restore(); }
  const cardA = (t, a, b) => L.sm(a, a + 0.25, t) * (1 - L.sm(b - 0.25, b, t));
  function card(c, lines, y, t, a, b, size = 96) { const al = cardA(t, a, b); if (al > 0) L.title(c, lines, y, size, { alpha: al }); }
  function chip(c, text, a, col = '#f4efe6') { if (a <= 0) return; c.save(); c.globalAlpha = a; rr(c, 80, 226, 300, 84, 42, 'rgba(40,36,34,0.82)'); inkText(c, text, 230, 286, 58, { col, font: SERIF }); c.restore(); }

  // ---------- faces (flat, readable) ----------
  function face(c, x, y, r, { worry = 0, smile = 0, look = [0, 0], kind = 'kid' }) {
    if (kind === 'kid') { circ(c, x, y - r * 0.05, r * 1.12, HAIRK); ell(c, x, y + r * 0.35, r * 1.1, r * 0.75, HAIRK); }
    else { circ(c, x + r * 0.05, y - r * 1.02, r * 0.42, HAIRG); circ(c, x, y - r * 0.08, r * 1.06, HAIRG); }
    circ(c, x, y, r, SKIN);
    c.save(); c.beginPath(); c.arc(x, y, r, 0, 7); c.clip();                 // fringe / hair cap
    if (kind === 'kid') { c.fillStyle = HAIRK; c.beginPath(); c.ellipse(x - r * 0.1, y - r * 0.78, r * 1.1, r * 0.55, -0.12, 0, 7); c.fill(); }
    else { c.fillStyle = HAIRG; c.beginPath(); c.ellipse(x, y - r * 0.86, r * 1.1, r * 0.42, 0, 0, 7); c.fill(); }
    c.restore();
    ell(c, x - r * 0.5, y + r * 0.25, r * 0.17, r * 0.11, 'rgba(206,160,150,0.55)'); ell(c, x + r * 0.5, y + r * 0.25, r * 0.17, r * 0.11, 'rgba(206,160,150,0.55)');
    const ey = y - r * 0.02, lx = look[0] * r * 0.06, ly = look[1] * r * 0.06;
    [-1, 1].forEach(d => { const ex = x + d * r * 0.34;
      ell(c, ex + lx, ey + ly, r * 0.085, r * (0.11 - worry * 0.015), INK); circ(c, ex + lx + r * 0.03, ey + ly - r * 0.04, r * 0.03, '#fbf8f2');
      // brows: inner end rises with worry
      const inner = -d, by = ey - r * 0.27; c.strokeStyle = kind === 'kid' ? HAIRK : '#8d877f'; c.lineWidth = r * 0.075; c.lineCap = 'round'; c.beginPath();
      c.moveTo(ex - inner * r * 0.14, by + worry * r * 0.02 - smile * r * 0.02); c.lineTo(ex + inner * r * 0.14, by - worry * r * 0.14 + smile * r * 0.01); c.stroke(); });
    if (kind === 'gran') { c.strokeStyle = '#6f6a65'; c.lineWidth = r * 0.045; [-1, 1].forEach(d => { c.beginPath(); c.arc(x + d * r * 0.34, ey, r * 0.2, 0, 7); c.stroke(); }); c.beginPath(); c.moveTo(x - r * 0.14, ey); c.lineTo(x + r * 0.14, ey); c.stroke(); }
    const m = (smile - worry) * r * 0.2, mw = r * 0.2 + smile * r * 0.06, my = y + r * 0.42;
    c.strokeStyle = '#7a5a54'; c.lineWidth = r * 0.07; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - mw, my - m * 0.25); c.quadraticCurveTo(x, my + m, x + mw, my - m * 0.25); c.stroke();
  }
  function bowl(c, x, y, q, glow = 0) {
    const mh = 14 + 52 * q;                                     // rice mound height ~ quantity
    ell(c, x, y - 50, 70 * Math.min(1, 0.55 + q * 0.6), mh, glow > 0 ? '#eef6ee' : RICE);
    c.fillStyle = BOWL; c.beginPath(); c.moveTo(x - 90, y - 52); c.quadraticCurveTo(x - 86, y + 30, x, y + 34); c.quadraticCurveTo(x + 86, y + 30, x + 90, y - 52); c.closePath(); c.fill();
    rr(c, x - 92, y - 58, 184, 14, 7, BOWL2);
    if (glow > 0) { c.save(); c.globalAlpha = glow; const g = c.createRadialGradient(x, y - 60, 0, x, y - 60, 170); g.addColorStop(0, rgbaG(0.5)); g.addColorStop(1, rgbaG(0)); c.fillStyle = g; c.beginPath(); c.arc(x, y - 60, 170, 0, 7); c.fill(); c.restore(); }
  }

  // ---------- the page: kitchen table in design coords 1080x1920 ----------
  const leaf = Array.from({ length: 60 }, () => ({ dx: (R() - 0.5) * 120, rot: (R() - 0.5) * 2.4 }));
  function kitchen(c, t, w, { deal = W_DEAL, give = 0, reach = 0, flip = false, glow = 0, kidLook = [0.8, -0.8], thread = 0 } = {}) {
    const e = extentAt(w, deal), q = qtyOf(e), ps = Math.sqrt(q), relief = w > deal ? L.sm(deal, deal + 4.4, w) : 0;
    // wall + wallpaper
    c.fillStyle = WALL; c.fillRect(0, 0, 1080, 1920);
    c.fillStyle = WALL2; for (let i = 0; i < 12; i++) c.fillRect(i * 96 + 30, 0, 26, 1500);
    c.save(); c.translate(0, 190);   // the page's composition sits low in the frame
    // calendar: red fills the page from the bottom (height = price-climb extent)
    rr(c, 84, 468, 330, 450, 16, '#f3eee4'); rr(c, 84, 468, 330, 92, 16, '#8a847e'); c.fillStyle = '#8a847e'; c.fillRect(84, 520, 330, 40);
    circ(c, 160, 468, 12, INK); circ(c, 338, 468, 12, INK);
    const pTop = 580, pBot = 900, rh = (pBot - pTop) * e;
    if (e > 0.003) { c.fillStyle = RED; c.beginPath(); c.moveTo(100, pBot); c.lineTo(100, pBot - rh);
      for (let x = 100; x <= 398; x += 12) c.lineTo(x, pBot - rh + Math.sin(x * 0.05 + t * 1.5) * 5 * Math.min(1, e * 6)); c.lineTo(398, pBot); c.closePath(); c.fill(); }
    c.fillStyle = 'rgba(60,54,50,0.16)'; for (let r = 0; r < 5; r++) for (let k = 0; k < 6; k++) c.fillRect(110 + k * 48, 596 + r * 60, 34, 40);
    if (flip) { const fr = w - Math.floor(w); if (fr < 0.45) { const lf = leaf[Math.floor(w) % 60], f = fr / 0.45;
      c.save(); c.translate(249 + lf.dx * f, 740 + f * f * 380); c.rotate(lf.rot * f); c.globalAlpha = 1 - L.sm(0.6, 1, f); rr(c, -150, -170, 300, 340, 12, '#f3eee4'); c.restore(); } }
    // window: far across the sea, a small green light (the warehouse, there from week 0)
    rr(c, 610, 468, 370, 330, 18, '#8a847e'); rr(c, 628, 486, 334, 294, 10, '#dfe2e0');
    c.save(); c.beginPath(); c.rect(628, 486, 334, 294); c.clip();
    ell(c, 795, 640, 260, 34, '#bdbab4');                              // far shore
    rr(c, 715, 582, 140, 56, 4, '#8f8a84'); c.fillStyle = '#8f8a84'; c.beginPath(); c.moveTo(705, 586); c.lineTo(785, 552); c.lineTo(865, 586); c.fill();
    c.save(); c.shadowColor = rgbaG(1); c.shadowBlur = 20; for (let k = 0; k < 4; k++) rr(c, 727 + k * 30, 598, 24, 30, 8, GREEN); c.restore();
    glowDot(c, 785, 612, 16, 0.55 + 0.1 * Math.sin(t * 2));
    c.fillStyle = '#b3b9bb'; c.fillRect(628, 648, 334, 140); c.fillStyle = '#a7aeb1'; c.fillRect(628, 700, 334, 90);
    c.restore(); c.fillStyle = '#8a847e'; c.fillRect(789, 486, 12, 294); c.fillRect(628, 650, 334, 10);
    // grandmother (standing, right)
    const wG = L.clamp(e * 1.3, 0, 1) * (1 - relief * 0.75), sG = (1 - L.clamp(e * 3, 0, 1)) + relief * 0.7 + 0.5 * reach;
    rr(c, 590, 1010, 330, 400, 120, CARD); c.fillStyle = CARD2; c.beginPath(); c.moveTo(700, 1010); c.lineTo(755, 1110); c.lineTo(810, 1010); c.fill();
    rr(c, 728, 960, 54, 70, 20, SKIN2);
    face(c, 755, 880, 108, { worry: wG, smile: L.clamp(sG, 0, 1), look: [-0.9, 0.7], kind: 'gran' });
    // child (seated, left)
    const wK = L.clamp((e - 0.25) * 1.6, 0, 1) * (1 - relief), sK = (1 - L.clamp(e * 2.6, 0, 1)) + relief * 0.85 + glow * 0.3;
    rr(c, 160, 1120, 290, 300, 110, SHIRT); rr(c, 282, 1070, 46, 60, 18, SKIN2);
    face(c, 305, 1000, 96, { worry: wK, smile: L.clamp(sK, 0, 1), look: kidLook, kind: 'kid' });
    // table + cloth
    rr(c, -20, 1300, 1120, 150, 20, TABLE); c.fillStyle = CLOTH; c.fillRect(-20, 1380, 1120, 560);
    c.fillStyle = CLOTH2; for (let i = 0; i < 9; i++) c.fillRect(i * 130 + 20, 1380, 44, 560);
    c.fillStyle = TABLE2; c.fillRect(-20, 1372, 1120, 16);
    // pot: area ~ quantity (linear scale = sqrt(300/price))
    const pw = 330 * ps, ph = 210 * ps, px = 560, pby = 1340;
    rr(c, px - pw / 2 - 18 * ps, pby - ph + 6, 36 * ps, 22 * ps, 10 * ps, POT2); rr(c, px + pw / 2 - 18 * ps, pby - ph + 6, 36 * ps, 22 * ps, 10 * ps, POT2);
    rr(c, px - pw / 2, pby - ph, pw, ph, 30 * ps, POT); ell(c, px, pby - ph, pw / 2, 26 * ps, POT2); ell(c, px, pby - ph + 4, pw / 2 - 14 * ps, 18 * ps, glow > 0 ? '#eef6ee' : RICE);
    // steam (flat curls), scaled with pot
    c.save(); c.globalAlpha = 0.35; c.strokeStyle = '#fbf8f2'; c.lineWidth = 14 * ps; c.lineCap = 'round';
    for (let k = 0; k < 3; k++) { const sx = px + (k - 1) * 70 * ps, ph2 = (t * 0.6 + k * 0.33) % 1; c.globalAlpha = 0.35 * Math.sin(ph2 * Math.PI); c.beginPath();
      for (let i = 0; i <= 10; i++) { const yy = pby - ph - 30 - i * 16 - ph2 * 60, xx = sx + Math.sin(i * 0.8 + t * 2 + k) * 14; i ? c.lineTo(xx, yy) : c.moveTo(xx, yy); } c.stroke(); }
    c.restore();
    // grandmother ladling (arm + ladle), her other arm reaches her bowl across to the child
    const rimY = pby - ph, hx = px + 70, hy = rimY - 50;
    limb(c, 640, 1090, hx + 40, hy + 10, 56, CARD2); circ(c, hx + 30, hy + 4, 30, SKIN);
    limb(c, hx + 20, hy, px - 10 * ps, rimY + 6, 12, '#77716b');
    const bx = L.lerp(840, 470, give), by = 1400;
    const rest = [880, 1330], hand = reach > 0 ? [L.lerp(rest[0], bx + 40, reach), L.lerp(rest[1], by - 70, reach)] : rest;
    limb(c, 880, 1110, hand[0], hand[1], 56, CARD2);
    // bowls: the child's, and grandmother's (after the stop it sits with the child)
    bowl(c, 250, 1400, q, glow);
    bowl(c, bx, by, q, glow * (give > 0.9 ? 1 : 0));
    circ(c, hand[0], hand[1], 30, SKIN);
    // child's hands on the bowl
    circ(c, 170, 1360, 28, SKIN); circ(c, 330, 1360, 28, SKIN);
    // the deal thread enters through the window (last part of the q = 0.5 path)
    if (thread > 0) { const p = L.clamp(thread, 0, 1); c.save(); c.strokeStyle = GREEN; c.lineWidth = 9; c.lineCap = 'round'; c.shadowColor = rgbaG(0.9); c.shadowBlur = 18; c.beginPath();
      for (let i = 0; i <= 40 * p; i++) { const f = i / 40, x = L.lerp(785, px, f) + Math.sin(f * Math.PI) * 60, y = L.lerp(612, rimY - 10, f) - Math.sin(f * Math.PI) * 60; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.restore(); }
    c.restore();
  }

  // ---------- the world (1080x1920 at zoom 1): shore, sea, warehouse ----------
  const S = 0.12, HOUSE = [540, 1630];                        // the kitchen page sits inside our house at scale S
  const ZCLOSE = 1 / S;                                       // 8.333: the kitchen fills the frame
  const K2W = (x, y) => [HOUSE[0] + (x - 540) * S, HOUSE[1] + (y - 960) * S];
  const ports = [[150, 0.7], [330, 0.1], [540, 0.5], [750, 0.3], [930, 0.9]].map(([x, qq]) => [x, 1392, qq, aq(qq)]);
  const DOCK = [540, 690];
  const houses = []; { const r = L.rng(31); let n = 0; while (houses.length < 26 && n++ < 4000) { const x = 60 + r() * 960, y = 1470 + r() * 400;
    if (Math.abs(x - HOUSE[0]) < 150 && y < 1850) continue; if (houses.some(h => Math.hypot(h[0] - x, h[1] - y) < 118)) continue; houses.push([x, y, 0.8 + r() * 0.35, Math.floor(r() * 3)]); } }
  houses.sort((a, b) => a[1] - b[1]);
  function tpt(p, f) { const cx = (DOCK[0] + p[0]) / 2 + (p[0] - DOCK[0]) * 0.3, cy = (DOCK[1] + p[1]) / 2; const a = (1 - f) * (1 - f), b = 2 * (1 - f) * f, d = f * f; return [a * DOCK[0] + b * cx + d * p[0], a * DOCK[1] + b * cy + d * p[1]]; }
  function smallHouse(c, x, y, s, e, k, lit) {
    const cols = ['#c9c1b4', '#bdb5a8', '#d1c9bc'], w = 92 * s, h = 70 * s;
    rr(c, x - w / 2, y - h / 2, w, h, 8 * s, cols[k]); c.fillStyle = '#8f877d'; c.beginPath(); c.moveTo(x - w / 2 - 8 * s, y - h / 2 + 2); c.lineTo(x, y - h / 2 - 40 * s); c.lineTo(x + w / 2 + 8 * s, y - h / 2 + 2); c.fill();
    const wx = x - 16 * s, wy = y - 14 * s, ww = 32 * s, wh = 32 * s; rr(c, wx, wy, ww, wh, 4 * s, '#6c6660'); c.fillStyle = RED; c.fillRect(wx, wy + wh * (1 - e), ww, wh * e);
    if (lit > 0) { c.save(); c.globalAlpha = lit; c.strokeStyle = GREEN; c.lineWidth = 5; c.shadowColor = rgbaG(1); c.shadowBlur = 16; c.strokeRect(wx - 5, wy - 5, ww + 10, wh + 10); c.restore(); }
  }
  function world(c, t, w, zoom, kopts) {
    const e = extentAt(w, W_DEAL);
    if (zoom < ZCLOSE * 0.98) {
      c.fillStyle = '#d4cdc1'; c.fillRect(-2000, -2000, 5080, 5920);           // far land
      ell(c, 540, 170, 900, 120, '#cbc4b8');
      // warehouse (size = resources): green sacks, idle
      rr(c, 170, 400, 740, 290, 20, '#8b857e'); c.fillStyle = '#7a746d'; c.beginPath(); c.moveTo(140, 410); c.lineTo(540, 270); c.lineTo(940, 410); c.fill();
      rr(c, 220, 450, 640, 220, 14, '#4a4642');
      c.save(); c.shadowColor = rgbaG(0.9); c.shadowBlur = 22;
      for (let r2 = 0; r2 < 4; r2++) for (let k = 0; k < 11; k++) rr(c, 236 + k * 56 + (r2 % 2) * 12, 462 + r2 * 51, 44, 42, 16, GREEN);
      c.restore();
      // sea bands
      ['#b7bdbf', '#b0b7b9', '#aab1b4', '#a4abae', '#9ea5a9', '#99a0a4', '#949b9f'].forEach((col, i) => { c.fillStyle = col; c.beginPath(); c.moveTo(-2000, 700 + i * 100);
        for (let x = -40; x <= 1120; x += 40) c.lineTo(x, 700 + i * 100 + Math.sin(x * 0.012 + i * 1.7) * 10); c.lineTo(3080, 700 + i * 100); c.lineTo(3080, 1500); c.lineTo(-2000, 1500); c.closePath(); c.fill(); });
      // near shore
      c.fillStyle = '#ddd5c8'; c.beginPath(); c.moveTo(-2000, 1400); for (let x = -40; x <= 1120; x += 40) c.lineTo(x, 1392 + Math.sin(x * 0.02) * 8); c.lineTo(3080, 1400); c.lineTo(3080, 4000); c.lineTo(-2000, 4000); c.closePath(); c.fill();
      // green threads: each connects at its own lognormal quantile week
      ports.forEach(p => { const arr = p[3], f = L.clamp(w / arr, 0, 1), done = w >= arr;
        c.save(); c.strokeStyle = done ? GREEN : rgbaG(0.8); c.lineWidth = done ? 9 : 6; c.lineCap = 'round'; if (!done) c.setLineDash([16, 12]);
        c.shadowColor = rgbaG(0.8); c.shadowBlur = done ? 16 : 6; c.beginPath(); for (let k = 0; k <= 60 * f; k++) { const [x, y] = tpt(p, k / 60); k ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke(); c.restore();
        const [tx, ty] = tpt(p, f); glowDot(c, tx, ty, done ? 12 : 9); });
      // the need lights our port (f2, week 27.3)
      const need = L.sm(W_NEED, W_NEED + 0.3, w); if (need > 0) { c.save(); c.globalAlpha = need; c.strokeStyle = GREEN; c.lineWidth = 7; c.shadowColor = rgbaG(1); c.shadowBlur = 24; c.beginPath(); c.arc(540, 1392, 30, 0, 7); c.stroke(); c.restore(); }
      houses.forEach((h, i) => { const port = ports.reduce((b, p) => Math.abs(p[0] - h[0]) < Math.abs(b[0] - h[0]) ? p : b); smallHouse(c, h[0], h[1], h[2], e, h[3], w >= port[3] ? 0.85 : 0); });
      // our house: a cut-away, the kitchen visible inside
      const [kx0, ky0] = K2W(0, 0), [kx1, ky1] = K2W(1080, 1920);
      rr(c, kx0 - 22, ky0 - 16, kx1 - kx0 + 44, ky1 - ky0 + 30, 10, '#c7bfb2');
      c.fillStyle = '#8f877d'; c.beginPath(); c.moveTo(kx0 - 40, ky0 - 10); c.lineTo(540, ky0 - 110); c.lineTo(kx1 + 40, ky0 - 10); c.fill();
      if (w >= W_DEAL) { const a = L.sm(W_DEAL, W_DEAL + 0.4, w); c.save(); c.globalAlpha = a; c.strokeStyle = GREEN; c.lineWidth = 8; c.lineCap = 'round'; c.shadowColor = rgbaG(1); c.shadowBlur = 18;
        c.beginPath(); c.moveTo(540, 1392); c.lineTo(540, ky0 - 110); c.stroke(); c.restore(); }
    }
    c.save(); c.beginPath(); const [ax, ay] = K2W(0, 0); c.rect(ax, ay, 1080 * S, 1920 * S); c.clip();
    c.translate(ax, ay); c.scale(S, S); kitchen(c, t, w, kopts); c.restore();
  }
  // smooth zoom between two framings: log-zoom eased, centre moves so the zoom feels anchored
  function zcam(c, k0, k1, f) {
    const z = Math.exp(L.lerp(Math.log(k0[2]), Math.log(k1[2]), f)), u = (1 / z - 1 / k0[2]) / (1 / k1[2] - 1 / k0[2] || 1);
    const x = L.lerp(k0[0], k1[0], u), y = L.lerp(k0[1], k1[1], u); c.translate(540, 960); c.scale(z, z); c.translate(-x, -y); return z;
  }
  const CAM_CLOSE = [HOUSE[0], HOUSE[1], ZCLOSE], CAM_WIDE = [540, 960, 1];
  const inKid = K2W(440, 1300), CAM_IN = [inKid[0], inKid[1], 10.4];

  // ---------- snap panels ----------
  function panel(c, y0, title, sub, deal, playW) {
    rr(c, 70, y0, 940, 520, 28, '#f4efe6');
    inkText(c, title, 110, y0 + 70, 58, { align: 'left' });
    if (sub) inkText(c, sub, 110, y0 + 122, 48, { align: 'left', col: '#5e5953', font: HAND });
    // the same page, small: calendar red + pot size at this week
    c.save(); c.beginPath(); c.roundRect(100, y0 + 150, 340, 340, 18); c.clip(); c.translate(100, y0 + 150); c.scale(0.37, 0.37); c.translate(-60, -690);
    kitchen(c, 0, Math.max(12, playW), { deal, give: 1, glow: playW >= deal ? 0.8 : 0, kidLook: [0.6, 0.6] }); c.restore();
    // the curve
    const x0 = 480, x1 = 980, gy = y0 + 470, gh = 250, wx = wk => L.lerp(x0, x1, (wk - 12) / 28);
    c.strokeStyle = '#a9a39b'; c.lineWidth = 3; c.beginPath(); c.moveTo(x0, gy); c.lineTo(x1, gy); c.stroke();
    const upto = Math.min(playW, 40);
    if (upto > 12) { c.beginPath(); c.moveTo(x0, gy); for (let wk = 12; wk <= upto + 1e-6; wk += 0.1) c.lineTo(wx(wk), gy - extentAt(wk, deal) * gh); c.lineTo(wx(upto), gy); c.closePath(); c.fillStyle = RED; c.fill(); }
    const pkx = wx(W_PEAK); c.save(); c.setLineDash([6, 8]); c.strokeStyle = '#8a847d'; c.lineWidth = 3; c.beginPath(); c.moveTo(pkx, gy); c.lineTo(pkx, gy - gh - 10); c.stroke(); c.restore();
    inkText(c, 'peak', pkx + 8, gy - gh - 22, 44, { col: '#5e5953', font: HAND, align: 'left' });
    if (playW >= deal) { const dx = wx(deal), dy = gy - extentAt(deal, deal) * gh, a = 1;
      c.save(); c.globalAlpha = a; c.strokeStyle = GREEN; c.lineWidth = 7; c.beginPath(); c.moveTo(dx, dy); c.lineTo(dx, gy); c.stroke(); c.restore(); glowDot(c, dx, dy, 18, a);
      inkText(c, 'deal', dx - 26, dy + 14, 48, { col: '#1f8a52', font: HAND, align: 'right', alpha: a }); }
    if (playW < 40) { const px = wx(Math.max(12, playW)); c.fillStyle = INK; c.fillRect(px - 2, gy - gh - 10, 4, gh + 20); }
  }
  // snap clock: weeks 12 -> 40 at 1 s = 7 weeks, frozen 1.0 s at the AI-lane deal (wk 28.3)
  const SN0 = 28.6, SNF = SN0 + (W_AI - 12) / 7, SNR = SNF + 1.0;
  const snapW = t => t < SN0 ? 12 : t < SNF ? 12 + (t - SN0) * 7 : t < SNR ? W_AI : Math.min(40, W_AI + (t - SNR) * 7);

  function draw(ctx, t) {
    ctx.fillStyle = WALL; ctx.fillRect(0, 0, 1080, 1920);
    const w = weekAt(t);
    if (t < 27.6) {
      const give = t < 1.4 ? 1 : L.sm(8.45, 9.3, t), reach = t < 1.4 ? 0 : L.sm(8.25, 8.6, t) * (1 - L.sm(9.3, 9.75, t));
      const kopts = { give, reach, flip: running(t), thread: 0, glow: w >= W_DEAL ? 0.5 * L.sm(W_DEAL, W_DEAL + 1, w) : 0,
        kidLook: t > 8.3 && t < 11 ? [0.9, -0.6] : t < 1.4 ? [0.9, -0.9] : [0.4, 0.8] };
      ctx.save();
      let z;
      if (t < 13.4) z = zcam(ctx, CAM_CLOSE, CAM_CLOSE, 0);
      else if (t < 20.2) z = zcam(ctx, CAM_CLOSE, CAM_WIDE, L.ease.inOut(L.clamp((t - 13.4) / 2.8, 0, 1)));
      else z = zcam(ctx, CAM_WIDE, CAM_IN, L.ease.inOut(L.clamp((t - 20.2) / 2.2, 0, 1)));
      world(ctx, t, w, z, kopts);
      ctx.restore();
      chip(ctx, 'AFTER', 1 - L.sm(1.3, 1.4, t));
      chip(ctx, 'BEFORE', L.sm(1.4, 1.5, t) * (1 - L.sm(4.4, 4.8, t)));
      card(ctx, ['Same table.', 'Smaller pot.'], 420, t, -1, 1.38, 104);
      card(ctx, ['Before:', 'a full pot.'], 420, t, 1.5, 4.2, 104);
      card(ctx, ['Each week,', 'a little less.'], 400, t, 4.6, 7.9, 96);
      card(ctx, ['Grandma says', "she's not hungry."], 400, t, 8.3, 10.3, 96);
      card(ctx, ['The red', 'kept climbing.'], 400, t, 10.6, 13.3, 96);
      card(ctx, ['It was there', 'the whole time.'], 300, t, 15.0, 17.2, 96);
      card(ctx, ['1.5 million tonnes.', 'Idle.'], 300, t, 17.3, 20.0, 96);
      card(ctx, ['The red fell a quarter', 'in a month.'], 400, t, 22.5, 24.7, 90);
      if (t > 24.6) { ctx.fillStyle = `rgba(22,20,20,${(0.66 * L.sm(24.6, 25.1, t)).toFixed(3)})`; ctx.fillRect(0, 0, 1080, 1920); }
      card(ctx, ['We slowed it down', 'so you could see it.'], 820, t, 24.9, 27.5, 100);
      L.slate(ctx, t < 1.4 ? 'SC1  CLOSE  COLD OPEN  (AFTER)' : t < 13.4 ? 'SC2  CLOSE  LOCKED  1 s = 2 weeks, with stops' : t < 20.2 ? 'SC3  THE PULL-OUT' : 'SC4  PUSH IN+');
    } else if (t < 28.2) {
      ctx.fillStyle = '#0d0c0c'; ctx.fillRect(0, 0, 1080, 1920);
    } else if (t < 34.2) {
      ctx.fillStyle = '#d9d1c3'; ctx.fillRect(0, 0, 1080, 1920);
      const pw = snapW(t), a = L.sm(28.2, 28.5, t);
      ctx.save(); ctx.globalAlpha = a;
      panel(ctx, 390, 'As it happened', null, W_DEAL, pw);
      panel(ctx, 950, 'AI-assisted routing', 'illustrative', W_AI, pw);
      ctx.restore();
      card(ctx, ['Same stock. Same people.'], 300, t, 28.4, 30.9, 84);
      card(ctx, ['Found sooner.'], 300, t, 31.0, 34.2, 100);
      L.slate(ctx, 'SC5  THE SNAP  1 s = 7 weeks, both lanes');
    } else if (t < 36.6) {
      const f = L.ease.inOut(L.clamp((t - 34.2) / 2.4, 0, 1)), z = L.lerp(1.7, 1.95, f);
      ctx.save(); ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-L.lerp(380, 360, f), -L.lerp(1370, 1420, f));
      kitchen(ctx, t, W_JUNE, { give: 1, glow: 0.6 + 0.4 * L.sm(34.2, 35.2, t), kidLook: [0.9, -0.8] }); ctx.restore();
      card(ctx, ['This is the bottleneck.'], 400, t, 34.5, 36.7, 100);
      L.slate(ctx, 'SC6  EXTREME CLOSE');
    }
    if (t >= 36.6) { ctx.fillStyle = '#0d1118'; ctx.fillRect(0, 0, 1080, 1920); L.endCard(ctx, L.sm(36.6, 37.0, t), { line: 'The bottleneck is us.' }); }
    L.grain(ctx, t, { alpha: 0.04, n: 400 });
  }

  const wT = wk => { for (const [a, b, k, w0] of SEG) if (k === 'run' && wk >= w0 && wk <= w0 + (b - a) * 2) return a + (wk - w0) / 2; return 0; };
  return { draw, DUR,
    acts: [{ start: 0, end: 27.6, bpm: 0, drone: true }, { start: 28.2, end: 40, bpm: 0, drone: true }],
    cues: [{ t: 1.4, type: 'pop' }, { t: 8.2, type: 'pop' }, { t: 13.4, type: 'whoosh' }, { t: wT(W_NEED), type: 'ding' }, { t: wT(W_DEAL), type: 'ding' },
      { t: 20.2, type: 'whoosh' }, { t: 27.6, type: 'stamp' }, { t: SNF, type: 'ding' }, { t: SNR + (W_DEAL - W_AI) / 7, type: 'ding' }, { t: 36.6, type: 'hit' }] };
}
if (typeof module !== 'undefined') module.exports = makeScene;
