// The Reference Desk: one long take at a library reference desk (wait-for-it; false-news-2018).
// Time mapping: race film t = 2 + hours (1 s = 1 h), hours 0-14. Snap: 1 s = 4 h. See output/the-reference-desk/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('false-news-2018');
  const DUR = 35;
  const RED = L.RED, GREEN = L.GREEN;
  const r = L.rng(4242);

  // ---- speed math (from the analog) ----
  const N = 1500, s0 = 1 / N;
  const tEnd = A.threat.points[1].t;                          // ~10 h to reach 1,500 (s2)
  const rate = Math.log(99 * (1 - s0) / s0) / tEnd;           // logistic fit: 99% at 10 h -> doubling 0.58 h
  const invLog = (q, rr) => Math.max(0, Math.log(q / (1 - q) * (1 - s0) / s0) / rr);
  const AG = A.solution.aggregation;                          // Hoaxy lag: median 13, p90 20
  const LAG = AG.median;                                      // our desk = the median
  const AI = A.ai_counterfactual.aggregation_median;          // 1 h, illustrative
  const hourOf = t => t < 1.2 ? 10 : t < 2 ? L.lerp(10, 0, L.ease.inOut((t - 1.2) / 0.8)) : Math.min(14, t - 2);

  // ---- town: 14 terraced streets, 1,500 people ----
  const ROWS = 14, rowY = k => 1380 - 300 * k, rowS = k => 1 - 0.035 * k;
  const GRAYS = ['#8e939b', '#9aa0aa', '#a7a39b', '#7f848c', '#b0aca4', '#969189'];
  const people = [];
  for (let k = 0; k < ROWS; k++) {
    const n = k < 2 ? 108 : 107;
    for (let j = 0; j < n; j++) {
      const x = -1300 + (j + 0.5) / n * 3700 + (r() - 0.5) * 18;
      people.push({ x, k, yb: rowY(k), s: rowS(k), col: GRAYS[Math.floor(r() * GRAYS.length)], ph: r() * 6.28, dn: r() });
    }
  }
  // hand-to-hand tree from the first reader, standing right outside her window
  let origin = 0, best = 1e9;
  people.forEach((p, i) => { if (p.k === 0 && Math.abs(p.x - 520) < best) { best = Math.abs(p.x - 520); origin = i; } });
  const o = people[origin];
  people.forEach((p, i) => { p.d = i === origin ? -1 : Math.hypot(p.x - o.x, (p.yb - o.yb) * 1.1) + p.dn * 260; });
  const order = people.map((_, i) => i).sort((a, b) => people[a].d - people[b].d);
  order.forEach((pi, rank) => {
    const p = people[pi]; p.rank = rank; p.tRed = invLog((rank + 0.5) / N, rate); p.parent = -1;
    if (rank > 0) { let bd = 1e12; for (let q = 0; q < rank; q++) { const c = people[order[q]]; const dd = (c.x - p.x) ** 2 + (c.yb - p.yb) ** 2; if (dd < bd) { bd = dd; p.parent = order[q]; } } }
  });
  // people who already knew the true version: same logistic stretched 6x (s1)
  const kn = people.map((_, i) => i); for (let i = kn.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [kn[i], kn[j]] = [kn[j], kn[i]]; }
  kn.forEach((pi, j) => { people[pi].tGreen = invLog((j + 0.5) / N, rate / 6); });
  const byRow = []; for (let k = 0; k < ROWS; k++) byRow.push(people.filter(p => p.k === k));

  // houses
  const HC = ['#43474f', '#4a4e56', '#50535a', '#3f434a', '#55575c', '#484b50'];
  const houses = [];
  for (let k = 0; k < ROWS; k++) { const s = rowS(k); let x = -1500;
    while (x < 2600) { const w = (130 + r() * 110) * s, h = (140 + r() * 110) * s; houses.push({ k, x, w, h, col: HC[Math.floor(r() * HC.length)], roof: r() < 0.6, lit: r() }); x += w + (6 + r() * 30) * s; } }
  // five other branch libraries (six fact-checkers in s1), lags at lognormal quantiles
  const branches = [[3, -700, 0.1], [5, 1700, 0.3], [8, 300, 0.7], [10, 2000, 0.85], [12, -300, 0.95]]
    .map(([k, x, q]) => ({ k, x, s: rowS(k), lag: L.lognormalQuantile(q, AG.median, AG.p90) }));

  // ---- the library (world coords) ----
  const BX0 = 200, BX1 = 860, CEIL = 1100, FLOOR = 1600, WX0 = 460, WX1 = 760, WY0 = 1150, WY1 = 1420;
  const BOARD = [352, 1195, 86, 140], OUT = [395, 1188], PINY = 1265;
  const pipe = [[752, 1452], [752, 700], [2150, 700], [2150, -2300], [-1050, -2300], [-1050, 400], [395, 400], [395, 1188]];
  const segL = []; let pipeLen = 0; for (let i = 1; i < pipe.length; i++) { const l = Math.hypot(pipe[i][0] - pipe[i - 1][0], pipe[i][1] - pipe[i - 1][1]); segL.push(l); pipeLen += l; }
  const pipeAt = f => { let d = L.clamp(f, 0, 1) * pipeLen; for (let i = 0; i < segL.length; i++) { if (d <= segL[i]) { const g = d / segL[i]; return [L.lerp(pipe[i][0], pipe[i + 1][0], g), L.lerp(pipe[i][1], pipe[i + 1][1], g)]; } d -= segL[i]; } return pipe[pipe.length - 1]; };

  // ---- camera (zoom about a pivot, log-eased), passed to L.camera ----
  const CK = [[0, [560, 1345, 2.55]], [5.5, [560, 1345, 2.55]], [9.5, [540, -500, 0.3]], [11.4, [540, -500, 0.3]], [14.0, [440, 1330, 3.6]], [27.6, [440, 1330, 3.6]], [27.61, [455, 1305, 3.8]], [30.6, [465, 1300, 4.6]]];
  function camAt(t) {
    if (t <= CK[0][0]) return CK[0][1];
    for (let i = 0; i < CK.length - 1; i++) { const [ta, a] = CK[i], [tb, b] = CK[i + 1]; if (t > tb) continue;
      const f = L.ease.inOut((t - ta) / (tb - ta)); const z = Math.exp(L.lerp(Math.log(a[2]), Math.log(b[2]), f));
      if (Math.abs(b[2] - a[2]) < 1e-6) return [L.lerp(a[0], b[0], f), L.lerp(a[1], b[1], f), z];
      if (b[2] > a[2]) { const sx = (b[0] - a[0]) * a[2] * (1 - f), sy = (b[1] - a[1]) * a[2] * (1 - f); return [b[0] - sx / z, b[1] - sy / z, z]; }
      const sx = (a[0] - b[0]) * b[2] * f, sy = (a[1] - b[1]) * b[2] * f; return [a[0] - sx / z, a[1] - sy / z, z]; }
    return CK[CK.length - 1][1];
  }

  const rr = (c, x, y, w, h, rad) => { c.beginPath(); c.roundRect(x, y, w, h, rad); };
  const disc = (c, x, y, rad, col) => { c.fillStyle = col; c.beginPath(); c.arc(x, y, rad, 0, 6.2832); c.fill(); };
  function glow(c, x, y, rad, col, a) { const g = c.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, col.replace('A', a)); g.addColorStop(1, col.replace('A', 0)); c.fillStyle = g; c.beginPath(); c.arc(x, y, rad, 0, 6.2832); c.fill(); }
  const GG = 'rgba(52,210,123,A)', RG = 'rgba(255,59,48,A)';

  function pamphlet(c, x, y, s, z, rot) {
    if (z < 0.9) { disc(c, x, y, Math.max(9 * s, 4.6 / z), RED); return; }
    c.save(); c.translate(x, y); c.rotate(rot || -0.15); c.fillStyle = RED; c.fillRect(-8 * s, -10 * s, 16 * s, 20 * s);
    c.fillStyle = 'rgba(255,255,255,0.28)'; for (let i = 0; i < 3; i++) c.fillRect(-5 * s, (-6 + i * 5) * s, (i === 2 ? 6 : 10) * s, 2 * s); c.restore();
  }
  const handOf = p => [p.x + 15 * p.s, p.yb - 34 * p.s];

  function drawRowPeople(c, k, h, t, z, vb) {
    const ps = byRow[k];
    // red lines between hands (real communication)
    c.lineCap = 'round';
    ps.forEach(p => { if (p.parent < 0 || h < p.tRed - 0.25) return; const q = people[p.parent]; const [ax, ay] = handOf(q), [bx, by] = handOf(p);
      if (Math.max(ax, bx) < vb[0] || Math.min(ax, bx) > vb[2] || Math.max(ay, by) < vb[1] || Math.min(ay, by) > vb[3]) return;
      const f = L.clamp((h - (p.tRed - 0.25)) / 0.25, 0, 1); c.strokeStyle = 'rgba(255,59,48,0.55)'; c.lineWidth = Math.max(1.6, 1.3 / z);
      c.beginPath(); c.moveTo(ax, ay); c.lineTo(L.lerp(ax, bx, f), L.lerp(ay, by, f)); c.stroke(); });
    ps.forEach(p => {
      if (p.x < vb[0] - 40 || p.x > vb[2] + 40 || p.yb < vb[1] - 10 || p.yb - 90 > vb[3]) return;
      const s = p.s, x = p.x + Math.sin(t * 1.1 + p.ph) * 1.5 * s, yb = p.yb;
      c.fillStyle = p.col; rr(c, x - 12 * s, yb - 54 * s, 24 * s, 54 * s, 10 * s); c.fill();
      disc(c, x, yb - 68 * s, 13 * s, p.col);
      if (z > 1.2) { c.fillStyle = '#2a2d33'; const lk = h >= p.tRed ? 0.6 : 0; c.beginPath(); c.arc(x - 4.5 * s + lk * 2 * s, yb - 69 * s + lk * 2 * s, 1.7 * s, 0, 6.3); c.arc(x + 4.5 * s + lk * 2 * s, yb - 69 * s + lk * 2 * s, 1.7 * s, 0, 6.3); c.fill(); }
      if (h >= p.tGreen) disc(c, x - 2 * s, yb - 32 * s, Math.max(5 * s, 3.6 / z), GREEN);
      if (h >= p.tRed) { const [hx, hy] = handOf(p); pamphlet(c, hx, hy, s, z); }
      else if (h >= p.tRed - 0.25 && p.parent >= 0) { const f = (h - (p.tRed - 0.25)) / 0.25; const [ax, ay] = handOf(people[p.parent]), [bx, by] = handOf(p);
        pamphlet(c, L.lerp(ax, bx, f), L.lerp(ay, by, f) - Math.sin(f * Math.PI) * 30 * s, s, z, f * 3); }
    });
  }

  function drawHouses(c, k, vb) {
    houses.forEach(hs => { if (hs.k !== k || hs.x > vb[2] || hs.x + hs.w < vb[0]) return; const yb = rowY(k) - 12 * rowS(k), s = rowS(k);
      c.fillStyle = hs.col; c.fillRect(hs.x, yb - hs.h, hs.w, hs.h);
      if (hs.roof) { c.fillStyle = '#34373e'; c.beginPath(); c.moveTo(hs.x - 8 * s, yb - hs.h); c.lineTo(hs.x + hs.w / 2, yb - hs.h - 60 * s); c.lineTo(hs.x + hs.w + 8 * s, yb - hs.h); c.fill(); }
      c.fillStyle = hs.lit > 0.55 ? '#6a675f' : '#3a3d44'; const ww = 22 * s; for (let wx = hs.x + 18 * s; wx < hs.x + hs.w - 30 * s; wx += 46 * s) c.fillRect(wx, yb - hs.h + 30 * s, ww, 30 * s); });
    branches.forEach(b => { if (b.k !== k) return; const s = b.s, yb = rowY(k) - 12 * s, w = 240 * s, hh = 200 * s, x = b.x - w / 2;
      c.fillStyle = '#5d5f64'; c.fillRect(x, yb - hh, w, hh); c.fillStyle = '#6e7075'; c.beginPath(); c.moveTo(x - 14 * s, yb - hh); c.lineTo(b.x, yb - hh - 70 * s); c.lineTo(x + w + 14 * s, yb - hh); c.fill();
      c.fillStyle = '#7b7d82'; for (let i = 0; i < 4; i++) c.fillRect(x + 22 * s + i * 60 * s, yb - hh + 20 * s, 14 * s, hh - 20 * s); });
  }
  function drawBranchLights(c, h, z) {
    branches.forEach(b => { const s = b.s, yb = rowY(b.k) - 12 * s; const on = L.sm(b.lag, b.lag + 0.3, h); if (on <= 0) { c.fillStyle = '#3c3e44'; c.fillRect(b.x - 22 * s, yb - 120 * s, 44 * s, 34 * s); return; }
      glow(c, b.x, yb - 103 * s, Math.max(90 * s, 40 / z), GG, 0.55 * on); c.fillStyle = GREEN; c.fillRect(b.x - 22 * s, yb - 120 * s, 44 * s, 34 * s); });
  }

  // ---- the librarian (children's-book flat, expressive face) ----
  function librarian(c, x, yH, m) {
    const skin = '#cfc8bd', card = '#7d8088', hair = '#3b3c42';
    // body
    c.fillStyle = card; c.beginPath(); c.moveTo(x - 44, yH + 40); c.quadraticCurveTo(x, yH + 26, x + 44, yH + 40); c.lineTo(x + 60, yH + 175); c.lineTo(x - 60, yH + 175); c.closePath(); c.fill();
    c.fillStyle = '#c9c4bb'; c.beginPath(); c.moveTo(x - 16, yH + 34); c.lineTo(x, yH + 62); c.lineTo(x + 16, yH + 34); c.fill();
    c.fillStyle = '#6d7077'; for (let i = 0; i < 3; i++) disc(c, x + 3, yH + 78 + i * 24, 3.5, '#5f6269');
    // arms (to hand targets)
    const arm = (sx, sy, hx, hy, bend) => { c.strokeStyle = card; c.lineWidth = 17; c.lineCap = 'round'; c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo((sx + hx) / 2 + bend, (sy + hy) / 2 + 26, hx, hy); c.stroke(); disc(c, hx, hy, 9.5, skin); };
    arm(x - 42, yH + 52, m.hL[0], m.hL[1], -22); arm(x + 42, yH + 52, m.hR[0], m.hR[1], 22);
    // head
    c.save(); c.translate(x, yH); c.rotate(m.tilt || 0);
    disc(c, 0, -44, 19, hair);
    disc(c, 0, 0, 34, skin);
    c.fillStyle = hair; c.beginPath(); c.arc(0, -4, 36, Math.PI * 1.05, Math.PI * 1.95); c.quadraticCurveTo(10, -22, -34, -10); c.fill();
    disc(c, -20, 13, 6, 'rgba(200,170,160,0.35)'); disc(c, 20, 13, 6, 'rgba(200,170,160,0.35)');
    const lx = m.look[0] * 3.5, ly = m.look[1] * 3;
    // eyes (blink squashes)
    const bl = m.blink || 0; c.fillStyle = '#23252b';
    [-13, 13].forEach(ex => { c.beginPath(); c.ellipse(ex + lx, 1 + ly, 3.8, Math.max(0.6, 3.8 * (1 - bl)), 0, 0, 6.3); c.fill(); });
    c.strokeStyle = '#2b2d33'; c.lineWidth = 2.6; [-13, 13].forEach(ex => { c.beginPath(); c.arc(ex, 1, 11, 0, 6.3); c.stroke(); });
    c.beginPath(); c.moveTo(-2, 0); c.lineTo(2, 0); c.stroke();
    // brows: inner end rises with tenderness/worry
    c.lineWidth = 3.2; c.lineCap = 'round'; const b = m.brow;
    c.beginPath(); c.moveTo(-23, -15 + b * 2); c.lineTo(-6, -16 - b * 6); c.moveTo(23, -15 + b * 2); c.lineTo(6, -16 - b * 6); c.stroke();
    // mouth
    c.lineWidth = 3; c.beginPath(); c.moveTo(-9, 18); c.quadraticCurveTo(0, 18 + m.smile * 9, 9, 18); c.stroke();
    c.restore();
  }

  function world(c, t, h, cam) {
    const [cx, cy, z] = cam; const vb = [cx - 540 / z, cy - 960 / z, cx + 540 / z, cy + 960 / z];
    c.fillStyle = '#23272e'; c.fillRect(vb[0], vb[1], vb[2] - vb[0], vb[3] - vb[1]);
    c.fillStyle = '#2b2f36'; c.beginPath(); c.arc(1900, -3300, 90, 0, 6.3); c.fill();
    for (let k = ROWS - 1; k >= 0; k--) {
      const yb = rowY(k); if (yb - 400 > vb[3] || yb + 40 < vb[1]) continue;
      drawHouses(c, k, vb);
      c.fillStyle = '#353940'; c.fillRect(vb[0], yb - 12 * rowS(k), vb[2] - vb[0], 30 * rowS(k));
      drawRowPeople(c, k, h, t, z, vb);
    }
    drawBranchLights(c, h, z);
    // ground in front
    c.fillStyle = '#2c2f35'; c.fillRect(vb[0], FLOOR, vb[2] - vb[0], Math.max(0, vb[3] - FLOOR));
    c.fillStyle = '#34373d'; c.fillRect(vb[0], FLOOR + 60, vb[2] - vb[0], 24);
    // library: roof, walls, back wall with window hole
    c.fillStyle = '#5b5850'; c.beginPath(); c.moveTo(BX0 - 40, CEIL - 60); c.lineTo(530, CEIL - 230); c.lineTo(BX1 + 40, CEIL - 60); c.fill();
    c.fillStyle = '#4b4944'; c.fillRect(BX0 - 30, CEIL - 60, BX1 - BX0 + 60, 60);
    c.fillStyle = '#6b675e'; c.beginPath(); c.rect(BX0, CEIL, BX1 - BX0, FLOOR - CEIL); c.rect(WX0, WY0, WX1 - WX0, WY1 - WY0); c.fill('evenodd');
    c.fillStyle = '#4b4944'; c.fillRect(BX0 - 30, CEIL, 30, FLOOR - CEIL); c.fillRect(BX1, CEIL, 30, FLOOR - CEIL);
    c.fillStyle = '#44423d'; c.fillRect(BX0, FLOOR - 20, BX1 - BX0, 20);
    // window frame
    c.strokeStyle = '#8a857a'; c.lineWidth = 9; c.strokeRect(WX0, WY0, WX1 - WX0, WY1 - WY0); c.lineWidth = 5;
    c.beginPath(); c.moveTo((WX0 + WX1) / 2, WY0); c.lineTo((WX0 + WX1) / 2, WY1); c.moveTo(WX0, (WY0 + WY1) / 2 - 20); c.lineTo(WX1, (WY0 + WY1) / 2 - 20); c.stroke();
    c.fillStyle = '#7a766c'; c.fillRect(WX0 - 14, WY1, WX1 - WX0 + 28, 12);
    // shelves right of window
    for (let sy = 1170; sy < 1560; sy += 64) { c.fillStyle = '#54514a'; c.fillRect(785, sy + 50, 70, 8); for (let bx = 788; bx < 850; bx += 11) { c.fillStyle = ['#77736a', '#8b867b', '#666259', '#9a958a'][(bx + sy) % 4]; c.fillRect(bx, sy + 12 + ((bx * 7) % 9), 9, 38 - ((bx * 7) % 9)); } }
    // lamp
    c.fillStyle = '#8b867b'; c.fillRect(528, CEIL, 4, 30);
    // clock (no numerals)
    disc(c, 715, 1128, 21, '#d9d3c6'); c.strokeStyle = '#3a3c42'; c.lineWidth = 3; c.beginPath(); c.arc(715, 1128, 21, 0, 6.3); c.stroke();
    const hrA = h / 12 * 6.2832 - Math.PI / 2, mnA = h * 6.2832 - Math.PI / 2; c.lineWidth = 3.4; c.beginPath(); c.moveTo(715, 1128); c.lineTo(715 + Math.cos(hrA) * 11, 1128 + Math.sin(hrA) * 11); c.stroke();
    c.lineWidth = 2; c.beginPath(); c.moveTo(715, 1128); c.lineTo(715 + Math.cos(mnA) * 16, 1128 + Math.sin(mnA) * 16); c.stroke();
    // notice board
    const [bx, by, bw, bh] = BOARD; c.fillStyle = '#6f675b'; c.fillRect(bx, by, bw, bh); c.strokeStyle = '#524b41'; c.lineWidth = 6; c.strokeRect(bx, by, bw, bh);
    c.fillStyle = '#b7b1a5'; c.save(); c.translate(bx + 22, by + 26); c.rotate(-0.08); c.fillRect(-14, -12, 30, 24); c.restore();
    c.save(); c.translate(bx + 68, by + 108); c.rotate(0.1); c.fillRect(-13, -14, 26, 30); c.restore();
    // pipe
    c.lineJoin = 'round'; c.lineCap = 'round'; c.strokeStyle = '#6f737a'; c.lineWidth = 22; c.beginPath(); pipe.forEach(([px, py], i) => i ? c.lineTo(px, py) : c.moveTo(px, py)); c.stroke();
    c.strokeStyle = '#8c9097'; c.lineWidth = 6; c.stroke();
    c.fillStyle = '#5f6369'; c.fillRect(730, 1438, 44, 30); c.fillRect(OUT[0] - 20, OUT[1] - 14, 40, 16);
    // desk + book
    const sitX = 600, standX = 492;
    const stand = L.sm(12.0, 12.2, h), walk = L.sm(12.2, 12.8, h);
    const lx = L.lerp(sitX, standX, walk), lyH = L.lerp(1395, 1340, stand);
    // green book glow
    glow(c, 680, 1462, 150, GG, 0.33);
    // card state
    const cardFly = L.clamp((h - 0.85) / 0.15, 0, 1);
    let face = { look: [0, 1], smile: 0.4, brow: 0.2, tilt: 0, blink: 0 };
    let hL = [lx - 40, lyH + 100], hR = [lx + 45, lyH + 100];
    const writing = h < 0.85;
    if (h < 1) { face = { look: [0.2, 1], smile: 0.45, brow: 0.25, tilt: 0.05 }; }
    else if (h < 4) { const f = L.sm(1, 1.6, h); face = { look: [L.lerp(1, 0.9, f), L.lerp(0.2, -0.6, f)], smile: 0.55, brow: 0.3, tilt: -0.05 }; }
    else if (h < 12) { const f = L.sm(4, 11, h); face = { look: [0.9, -0.7], smile: L.lerp(0.4, -0.35, f), brow: L.lerp(0.4, 1, f), tilt: L.lerp(-0.05, -0.12, f) }; }
    else if (h < 13.2) { face = { look: [-0.8, -1], smile: 0.1, brow: 0.7, tilt: 0.1 }; }
    else { const f = L.sm(13.3, 13.9, h); face = { look: [L.lerp(-0.6, 0.9, f), L.lerp(-0.8, -0.3, f)], smile: L.lerp(0.35, 0.1, f), brow: 1, tilt: L.lerp(0.08, -0.08, f) }; }
    if (h >= 10 && h < 12 && t < 2) face = { look: [0.9, -0.7], smile: -0.35, brow: 1, tilt: -0.12 };
    face.blink = (Math.abs(((t * 0.37) % 1) - 0.5) < 0.012) ? 1 : 0;
    if (writing) hR = [610 + Math.sin(h * 40) * 8, 1466];
    else if (h < 1.05) hR = [L.lerp(640, 740, cardFly), 1458];
    if (h >= 12.9 && h < 13.3) hL = [OUT[0] + 10, L.lerp(1200, PINY + 8, L.sm(13.0, 13.15, h))];
    else if (h >= 13.3) hL = [lx - 50, lyH + 110];
    if (h >= 12.2) hR = [lx + 48, lyH + 115];
    face.hL = hL; face.hR = hR;
    librarian(c, lx, lyH, face);
    // desk front (hides her lap when seated)
    c.fillStyle = '#6e6a62'; c.fillRect(470, 1478, 270, 14); c.fillStyle = '#5c5952'; c.fillRect(478, 1492, 254, FLOOR - 1492);
    c.fillStyle = '#4d4a44'; c.fillRect(500, 1515, 90, 50); c.fillRect(620, 1515, 90, 50);
    // open green book
    c.fillStyle = GREEN; c.beginPath(); c.moveTo(636, 1480); c.lineTo(724, 1480); c.lineTo(730, 1470); c.lineTo(630, 1470); c.fill();
    c.fillStyle = '#e9f3ec'; c.beginPath(); c.moveTo(634, 1471); c.lineTo(678, 1466); c.lineTo(678, 1474); c.lineTo(634, 1476); c.fill(); c.beginPath(); c.moveTo(680, 1466); c.lineTo(726, 1471); c.lineTo(726, 1476); c.lineTo(680, 1474); c.fill();
    if (writing || h < 0.85) { // the card being written on the desk
      c.fillStyle = '#e8e4da'; c.fillRect(578, 1462, 50, 16); c.fillStyle = GREEN; const wf = L.clamp(h / 0.8, 0, 1); c.fillRect(583, 1466, 40 * Math.min(1, wf * 2), 3); c.fillRect(583, 1472, 30 * L.clamp(wf * 2 - 1, 0, 1), 3); }
    else if (h < 1) { disc(c, L.lerp(620, 752, cardFly), L.lerp(1462, 1450, cardFly), 9, GREEN); }
    // the card in the tube
    if (h >= 1 && h < LAG) { const [px, py] = pipeAt((h - 1) / (LAG - 1)); glow(c, px, py, Math.max(40, 22 / z), GG, 0.6); disc(c, px, py, Math.max(10, 5.5 / z), GREEN); }
    // pinned card
    if (h >= LAG) { const f = L.sm(LAG, LAG + 0.15, h); const py = L.lerp(OUT[1] + 6, PINY, f); if (f >= 1) glow(c, OUT[0], PINY, 70, GG, 0.35);
      c.fillStyle = '#e8e4da'; c.fillRect(OUT[0] - 26, py - 18, 52, 36); c.strokeStyle = GREEN; c.lineWidth = 3; c.strokeRect(OUT[0] - 26, py - 18, 52, 36);
      c.fillStyle = GREEN; c.fillRect(OUT[0] - 18, py - 8, 36, 3); c.fillRect(OUT[0] - 18, py, 26, 3); c.fillRect(OUT[0] - 18, py + 8, 32, 3); if (f >= 1) disc(c, OUT[0], PINY - 20, 4, '#b9bec8'); }
    // re-draw hand that pins, on top of the card
    if (h >= 12.9 && h < 13.3) disc(c, hL[0], hL[1], 9.5, '#cfc8bd');
  }

  // ---- snap panels ----
  function panel(c, y0, lag, title, sub, illus, hs, al) {
    c.save(); c.globalAlpha = al; c.fillStyle = '#1b1f26'; rr(c, 70, y0, 940, 500, 22); c.fill(); c.strokeStyle = '#3a404b'; c.lineWidth = 3; c.stroke();
    L.label(c, title, 100, y0 + 60, 48, { align: 'left', col: '#e8e4da' }); L.label(c, sub, 900, y0 + 60, 50, { align: 'right', col: '#fffdf7', font: SERIF });
    if (illus) L.label(c, 'illustrative', 900, y0 + 112, 44, { align: 'right', col: '#b9bec8' });
    const gx = p => 100 + (p.x + 1300) / 3700 * 800, gy = p => y0 + 430 - p.k * 21 + (p.dn - 0.5) * 12;
    people.forEach(p => { const x = gx(p), y = gy(p);
      if (hs >= p.tRed + lag) { disc(c, x, y, 4.2, RED); c.strokeStyle = GREEN; c.lineWidth = 2.4; c.beginPath(); c.arc(x, y, 6.6, 0, 6.3); c.stroke(); }
      else if (hs >= p.tRed) disc(c, x, y, 4.2, RED); else disc(c, x, y, 2.6, '#5d636d'); });
    // time bar, pin marker
    c.fillStyle = '#3a404b'; c.fillRect(100, y0 + 462, 800, 6); c.fillStyle = '#9aa0aa'; c.fillRect(100, y0 + 462, 800 * hs / 24, 6);
    const mx = 100 + lag / 24 * 800; c.strokeStyle = hs >= lag ? GREEN : '#5d636d'; c.lineWidth = 3; c.strokeRect(mx - 14, y0 + 443, 28, 20);
    if (hs >= lag) { c.fillStyle = GREEN; c.fillRect(mx - 14, y0 + 443, 28, 20); }
    c.restore();
  }

  const cards = [
    [0.0, 2.2, ['Watch the notice board.'], 300, 88],
    [2.4, 4.3, ['She already has', { text: 'the right book.', col: GREEN }], 290, 90],
    [4.5, 6.3, ['Her card takes', 'the long way.'], 290, 90],
    [9.7, 11.4, ['Hand to hand,', 'the whole town.'], 300, 92],
    [15.2, 16.6, ['Pinned.', '13 hours in.'], 280, 96],
    [16.8, 19.3, ['We slowed it down', 'so you could see it.'], 820, 92],
    [25.9, 27.6, ['Speed is not belief.'], 1478, 76],
    [27.9, 30.6, ['This is the bottleneck.'], 300, 88],
  ];

  function draw(ctx, t) {
    ctx.fillStyle = '#23272e'; ctx.fillRect(0, 0, 1080, 1920);
    const inSnap = t >= 19.4 && t < 27.6;
    if (!inSnap || t < 19.8) {
      const cam = camAt(t >= 27.6 ? t : Math.min(t, 19.4)); const h = t >= 27.6 ? 14 : hourOf(Math.min(t, 16));
      ctx.save(); L.camera(ctx, [[0, [cam[0], cam[1], cam[2], 0]]], t); world(ctx, t, h, cam); ctx.restore();
      if (t < 2 && t >= 1.2) { ctx.save(); ctx.globalAlpha = 0.8 * Math.sin((t - 1.2) / 0.8 * Math.PI); ctx.fillStyle = '#e8e4da'; [0, 60].forEach(d => { ctx.beginPath(); ctx.moveTo(620 + d, 1560); ctx.lineTo(560 + d, 1600); ctx.lineTo(620 + d, 1640); ctx.fill(); }); ctx.restore(); }
      if (t < 1.25) L.label(ctx, 'later', 330, 430, 50, { col: '#b9bec8', alpha: 1 - L.sm(1.05, 1.25, t) });
      if (t >= 1.25 && t < 2.6) L.label(ctx, 'earlier', 330, 430, 50, { col: '#b9bec8', alpha: L.sm(1.25, 1.45, t) * (1 - L.sm(2.3, 2.6, t)) });
      if (t >= 16 && t < 27.6) { ctx.fillStyle = `rgba(13,17,24,${(0.6 * L.sm(16.2, 16.8, t)).toFixed(3)})`; ctx.fillRect(0, 0, 1080, 1920); }
    }
    if (inSnap) {
      const a = L.sm(19.4, 19.8, t); ctx.fillStyle = `rgba(16,19,25,${a.toFixed(3)})`; ctx.fillRect(0, 0, 1080, 1920);
      const hs = L.clamp((t - 19.8) / 6 * 24, 0, 24);
      panel(ctx, 300, LAG, 'as it happened', LAG + ' h lag', false, hs, a);
      panel(ctx, 880, AI, 'frontier AI routing', '~' + AI + ' h', true, hs, a);
    }
    if (t >= 27.6 && t < 27.9) { ctx.fillStyle = `rgba(16,19,25,${(1 - L.sm(27.6, 27.9, t)).toFixed(3)})`; ctx.fillRect(0, 0, 1080, 1920); }
    cards.forEach(([a, b, lines, y, sz]) => { if (t < a || t > b) return; const al = L.sm(a, a + 0.25, t) * (1 - L.sm(b - 0.25, b, t)); L.title(ctx, lines, y, sz, { alpha: a === 0 ? (1 - L.sm(b - 0.25, b, t)) : al }); });
    L.grain(ctx, t, { alpha: 0.05 });
    const sl = t < 2 ? 'SC 1  CLOSE  LOCKED-OFF  (cold open)' : t < 5.5 ? 'SC 1  CLOSE  LOCKED-OFF' : t < 11.4 ? 'SC 1  PULL OUT  WIDE' : t < 16 ? 'SC 1  PUSH IN  CLOSE+' : t < 19.4 ? 'SC 1  FREEZE' : t < 27.6 ? 'SNAP  SPLIT' : 'SC 1  EXTREME CLOSE';
    if (t < 30.6) L.slate(ctx, sl);
    if (t >= 30.6) L.endCard(ctx, L.sm(30.6, 31.1, t));
  }

  return {
    draw, DUR,
    acts: [{ start: 0, end: 16.4, bpm: 0, drone: true }, { start: 19.8, end: 27.6, bpm: 60, drone: true }, { start: 27.6, end: 35, bpm: 0, drone: true }],
    cues: [{ t: 1.2, type: 'whoosh' }, { t: 3.0, type: 'pop' }, { t: 5.6, type: 'whoosh' }, { t: 2 + branches[0].lag, type: 'ding' }, { t: 15.1, type: 'stamp' },
      { t: 19.8, type: 'hit' }, { t: 19.8 + AI / 4, type: 'ding' }, { t: 19.8 + LAG / 4, type: 'stamp' }, { t: 30.6, type: 'whoosh' }],
  };
}
module.exports = makeScene;
