// the-heat-map: powers-of-ten zoom, topographic map, multi-scale. Analog: heatwave-2003.
// Mapping: race 1 s = 1 day (day = t - 1.4, days 0..19). Snap: 19 days in 4.5 s, same heat in both lanes.
// Red: one heat field T = h(d) * G(x,y) in one global map frame; isotherms by marching squares at every scale.
// h(d) = 4 s(1-s), s = logistic fitted through the sourced endpoints (0 at day 0, 1 at day 19) with its midpoint at the
// sourced peak (day 11.5), same fit as nineteen-days / the-balcony. Green: two-sided lognormal from p10/median/p90.
// AI: ai_counterfactual (3 d), illustrative. Camera p = log10 of scale; level n (0 room, 1 block, 2 city, 3 country)
// is drawn at scale 10^(n-p) around his window, which is always the screen center. See output/the-heat-map/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('heatwave-2003');
  const DUR = 40, RED = L.RED, GREEN = L.GREEN, INK = '#0b0e11';
  const rgbaR = a => `rgba(255,59,48,${L.clamp(a, 0, 1).toFixed(3)})`, rgbaG = a => `rgba(52,210,123,${L.clamp(a, 0, 1).toFixed(3)})`;

  // ---------- data ----------
  const DEND = A.threat.points[A.threat.points.length - 1].t; // 19
  const PEAK = 11.5;
  const kk = Math.log(99) / (DEND - PEAK), DBL = Math.LN2 / kk, S0 = Math.exp(-kk * PEAK) / (1 + Math.exp(-kk * PEAK));
  const raw = d => L.logistic(d, DBL, S0), R0 = raw(0), R1 = raw(DEND);
  const E = d => L.clamp((raw(d) - R0) / (R1 - R0), 0, 1);
  const rho = d => { const s = raw(L.clamp(d, 0, DEND)); return 4 * s * (1 - s); };
  const AG = A.solution.aggregation, MED = AG.median, P10 = AG.p10, P90 = AG.p90;
  const SLO = Math.log(MED / P10) / 1.2816, SHI = Math.log(P90 / MED) / 1.2816;
  const zOf = q => { let lo = -8, hi = 8; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; (0.5 * (1 + L.erf(m / Math.SQRT2)) < q) ? lo = m : hi = m; } return (lo + hi) / 2; };
  const hq = q => { const z = zOf(q); return MED * Math.exp(z * (z < 0 ? SLO : SHI)); };
  const AIM = A.ai_counterfactual.aggregation_median, aq = q => hq(q) * AIM / MED;
  const QS = [0.2, 0.5, 0.9], HUM = QS.map(hq), AIA = QS.map(aq); // 10.3 / 12 / 305 ; 2.6 / 3 / 76

  // ---------- time ----------
  const T0 = 1.4, TSNAP = 24.0, SNAPLEN = 4.5, TFIN = 31.5;
  const dayAt = t => t < T0 ? 11 : L.clamp(t - T0, 0, DEND);
  const CAM = [[T0, 0], [4.6, 0.04], [10.4, 3], [12.2, 3], [13.2, 2], [15.2, 2], [17.6, -0.35], [20.4, -0.45]];
  const CAMF = [[TFIN, 1.3], [35.2, -1.0], [36, -1.05]];
  const pAt = t => t < T0 ? 0 : t < 23 ? L.key(CAM, t) : L.key(CAMF, t);

  // ---------- fields ----------
  const hash = (i, j, s) => { const v = Math.sin(i * 127.1 + j * 311.7 + s * 74.7) * 43758.5453; return v - Math.floor(v); };
  const n2 = (x, y, s) => { const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j, u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
    return L.lerp(L.lerp(hash(i, j, s), hash(i + 1, j, s), u), L.lerp(hash(i, j + 1, s), hash(i + 1, j + 1, s), u), v); };
  const HX = 540, HY = 960; // him, in global (country-level) coordinates; always the screen center
  function Graw(X, Y, m) {
    let g = Math.exp(-((X - 620) ** 2 + (Y - 880) ** 2) / (2 * 420 * 420));
    g += 0.14 * (n2(X / 220 + 3.1, Y / 220 + 1.7, 1) * 2 - 1);
    if (m <= 2) g += 0.07 * (n2(X / 22, Y / 22, 2) * 2 - 1) + 0.08 * Math.exp(-((X - HX) ** 2 + (Y - HY) ** 2) / (2 * 18 * 18));
    if (m <= 1) g += 0.05 * (n2(X / 2.2, Y / 2.2, 3) * 2 - 1);
    if (m <= 0) g += 0.07 * (n2(X / 0.22, Y / 0.22, 4) * 2 - 1);
    return g;
  }
  const GN = Graw(HX, HY, 0), G = (X, Y, m) => Graw(X, Y, m) / GN;
  function Hraw(X, Y, m) { // gray relief (static)
    let g = n2(X / 260, Y / 260, 11) * 0.6 + n2(X / 90, Y / 90, 12) * 0.3;
    if (m <= 2) g += 0.25 * n2(X / 26, Y / 26, 13);
    if (m <= 1) g += 0.25 * n2(X / 2.6, Y / 2.6, 14);
    return g;
  }
  const toG = (m, x, y) => { const k = Math.pow(10, m - 3); return [HX + (x - 540) * k, HY + (y - 960) * k]; };
  function makeGrid(m, cell, ext, fn) {
    const x0 = 540 - 540 * ext, y0 = 960 - 960 * ext, nx = Math.ceil(1080 * ext / cell) + 1, ny = Math.ceil(1920 * ext / cell) + 1;
    const V = new Float32Array(nx * ny);
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) { const [X, Y] = toG(m, x0 + i * cell, y0 + j * cell); V[j * nx + i] = fn(X, Y, m); }
    return { m, cell, x0, y0, nx, ny, V };
  }
  // marching squares over the cells in [i0,i1]x[j0,j1]; levels = lv0 + k*step; value multiplier h; emit(x1,y1,x2,y2,k)
  function march(gr, h, lv0, step, kmax, emit, i0 = 0, i1 = gr.nx - 2, j0 = 0, j1 = gr.ny - 2) {
    const { V, nx, cell, x0, y0 } = gr;
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) {
      const a = V[j * nx + i] * h, b = V[j * nx + i + 1] * h, c = V[(j + 1) * nx + i + 1] * h, d = V[(j + 1) * nx + i] * h;
      const mn = Math.min(a, b, c, d), mx = Math.max(a, b, c, d);
      let k0 = Math.max(0, Math.ceil((mn - lv0) / step)), k1 = Math.min(kmax, Math.floor((mx - lv0) / step));
      const x = x0 + i * cell, y = y0 + j * cell;
      for (let k = k0; k <= k1; k++) {
        const v = lv0 + k * step; if (v <= mn || v > mx) continue;
        const P = [];
        if ((a < v) !== (b < v)) P.push(x + cell * (v - a) / (b - a), y);
        if ((b < v) !== (c < v)) P.push(x + cell, y + cell * (v - b) / (c - b));
        if ((d < v) !== (c < v)) P.push(x + cell * (v - d) / (c - d), y + cell);
        if ((a < v) !== (d < v)) P.push(x, y + cell * (v - a) / (d - a));
        if (P.length >= 4) emit(P[0], P[1], P[2], P[3], k);
        if (P.length === 8) emit(P[4], P[5], P[6], P[7], k);
      }
    }
  }
  const GR = [makeGrid(0, 10, 3, G), makeGrid(1, 24, 4, G), makeGrid(2, 24, 4, G), makeGrid(3, 16, 1.25, G)];
  // static relief contours (gray), per level
  const RELIEF = [null, 1, 2, 3].map(m => { if (m === null) return null;
    const gr = makeGrid(m, m === 3 ? 12 : 24, m === 3 ? 1.25 : 4, Hraw), seg = [];
    march(gr, 1, 0.1, 0.07, 18, (a, b, c, d) => seg.push(a, b, c, d)); return new Float32Array(seg); });

  // ---------- helpers ----------
  const fade = (t, a, b, fd = 0.3) => L.sm(a, a + fd, t) * (1 - L.sm(b - fd, b, t));
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r); };
  const glow = (c, x, y, r, col, a) => { if (a <= 0.002) return; const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col(a)); g.addColorStop(1, col(0)); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); };
  function card(c, lines, y, size, a, { col = '#fffdf7' } = {}) {
    if (a <= 0.001) return; c.save(); c.globalAlpha = a; c.textAlign = 'center'; let yy = y;
    lines.forEach((l, i) => { const o = typeof l === 'string' ? { text: l } : l; let fz = o.size || size; c.font = `${fz}px "${SERIF}"`;
      while (c.measureText(o.text).width > 790 && fz > 30) { fz -= 4; c.font = `${fz}px "${SERIF}"`; }
      if (i) yy += fz * 1.06; c.lineJoin = 'round'; c.lineWidth = fz * 0.2; c.strokeStyle = INK; c.strokeText(o.text, 490, yy);
      c.fillStyle = o.col || col; c.fillText(o.text, 490, yy); });
    c.restore();
  }
  function tag(c, text, x, y, size, a, { col = '#fffdf7', font = HAND, align = 'left' } = {}) {
    if (a <= 0.001) return; c.save(); c.globalAlpha = a; c.font = `${size}px "${font}"`; c.textAlign = align; c.lineJoin = 'round';
    c.lineWidth = size * 0.2; c.strokeStyle = INK; c.strokeText(text, x, y); c.fillStyle = col; c.fillText(text, x, y); c.restore();
  }
  function slate(c, s) { c.save(); c.fillStyle = 'rgba(8,10,12,0.6)'; c.fillRect(40, 1818, 640, 58); c.restore(); L.slate(c, s); }
  const visRange = (gr, s) => { const xl = 540 - 540 / s, xr = 540 + 540 / s, yt = 960 - 960 / s, yb = 960 + 960 / s;
    return [Math.max(0, Math.floor((xl - gr.x0) / gr.cell)), Math.min(gr.nx - 2, Math.ceil((xr - gr.x0) / gr.cell)),
      Math.max(0, Math.floor((yt - gr.y0) / gr.cell)), Math.min(gr.ny - 2, Math.ceil((yb - gr.y0) / gr.cell))]; };
  // red isotherms T = 0.05..0.95 (every 4th heavier), constant screen width
  function isotherms(c, gr, h, s, a = 1, range) {
    if (h < 0.05) return;
    const [i0, i1, j0, j1] = range || visRange(gr, s), thin = [], thick = [];
    march(gr, h, 0.05, 0.05, 18, (x1, y1, x2, y2, k) => ((k + 1) % 4 === 0 ? thick : thin).push(x1, y1, x2, y2), i0, i1, j0, j1);
    const stroke = (arr, w, col) => { if (!arr.length) return; c.beginPath(); for (let i = 0; i < arr.length; i += 4) { c.moveTo(arr[i], arr[i + 1]); c.lineTo(arr[i + 2], arr[i + 3]); } c.lineWidth = w / s; c.strokeStyle = col; c.stroke(); };
    c.save(); c.globalAlpha *= a; c.lineCap = 'round';
    stroke(thick, 16, rgbaR(0.22)); stroke(thin, 3.2, rgbaR(0.85)); stroke(thick, 6.5, RED); c.restore();
  }
  function relief(c, m, s, col, w) {
    const seg = RELIEF[m]; c.beginPath(); for (let i = 0; i < seg.length; i += 4) { c.moveTo(seg[i], seg[i + 1]); c.lineTo(seg[i + 2], seg[i + 3]); }
    c.strokeStyle = col; c.lineWidth = w / s; c.stroke();
  }

  // ---------- level 3: country ----------
  const LAND = []; for (let i = 0; i < 120; i++) { const an = i / 120 * Math.PI * 2; const r = 380 * (0.82 + 0.34 * n2(2 + 1.6 * Math.cos(an), 2 + 1.6 * Math.sin(an), 9) + 0.05 * n2(5 + 5 * Math.cos(an), 5 + 5 * Math.sin(an), 10));
    LAND.push([560 + Math.cos(an) * r, 930 + Math.sin(an) * r]); }
  const landPath = c => { c.beginPath(); LAND.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); };
  const inLand = (x, y) => { const an = Math.atan2(y - 930, x - 560), i = Math.round(((an + Math.PI * 2) % (Math.PI * 2)) / (Math.PI * 2) * 120) % 120; return Math.hypot(x - 560, y - 930) < Math.hypot(LAND[i][0] - 560, LAND[i][1] - 930) - 30; };
  const rngK = L.rng(33); const TOWNS = []; while (TOWNS.length < 14) { const x = 220 + rngK() * 680, y = 580 + rngK() * 720; if (inLand(x, y) && Math.hypot(x - HX, y - HY) > 60) TOWNS.push([x, y, 3 + rngK() * 5]); }
  function country(c, d, s) {
    const h = rho(d);
    c.fillStyle = '#16191c'; c.fillRect(-9000, -9000, 20000, 20000);
    // sea hatching
    c.strokeStyle = 'rgba(120,128,136,0.14)'; c.lineWidth = 2 / s; c.beginPath(); for (let y = -1400; y < 3400; y += 26) { c.moveTo(-1400, y); c.lineTo(2500, y); } c.stroke();
    landPath(c); c.fillStyle = '#2c3136'; c.fill();
    c.save(); landPath(c); c.clip();
    relief(c, 3, s, 'rgba(150,158,166,0.32)', 2);
    const g = c.createRadialGradient(620, 880, 0, 620, 880, 520); g.addColorStop(0, rgbaR(0.3 * h)); g.addColorStop(1, rgbaR(0)); c.fillStyle = g; c.fillRect(0, 300, 1100, 1300);
    isotherms(c, GR[3], h, s);
    c.restore();
    landPath(c); c.strokeStyle = '#a3aab1'; c.lineWidth = 3.5 / s; c.stroke();
    TOWNS.forEach(([x, y, r]) => { c.fillStyle = '#a3aab1'; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); });
    c.strokeStyle = '#e4e7ea'; c.lineWidth = 3 / s; c.beginPath(); c.arc(HX, HY, 9, 0, 7); c.stroke();
  }

  // ---------- level 2: city ----------
  const rngC = L.rng(21);
  const RIVER = []; for (let i = 0; i <= 60; i++) { const x = -1400 + i * 70; RIVER.push([x, 1180 + (x - 540) * 0.35 + 170 * Math.sin(x / 260) + 60 * Math.sin(x / 90)]); }
  const STREETS = []; for (let gx = -1500; gx <= 2600; gx += 36) for (let gy = -2000; gy <= 3900; gy += 36) {
    const dx = gx - 540, dy = gy - 960, dist = Math.hypot(dx, dy); if (dist > 1150 + 200 * n2(gx / 300, gy / 300, 5)) continue;
    if (rngC() > 0.12) STREETS.push(gx, gy, gx + 36, gy); if (rngC() > 0.12) STREETS.push(gx, gy, gx, gy + 36); }
  const CITYWIN = []; for (let i = 0; i < 700; i++) { const an = rngC() * 7, r = Math.sqrt(rngC()) * 1100; const x = 540 + Math.cos(an) * r, y = 960 + Math.sin(an) * r;
    CITYWIN.push([x, y, rngC() < 0.07 ? 0.05 + rngC() * 0.9 : 2]); }
  function city(c, d, t, s) {
    const h = rho(d), e = E(d);
    c.fillStyle = '#2c3136'; c.fillRect(-9000, -9000, 20000, 20000);
    relief(c, 2, s, 'rgba(150,158,166,0.22)', 2);
    c.beginPath(); RIVER.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.strokeStyle = '#191c20'; c.lineWidth = 46; c.stroke(); c.strokeStyle = 'rgba(160,168,176,0.35)'; c.lineWidth = 2 / s; c.stroke();
    c.beginPath(); for (let i = 0; i < STREETS.length; i += 4) { c.moveTo(STREETS[i], STREETS[i + 1]); c.lineTo(STREETS[i + 2], STREETS[i + 3]); } c.strokeStyle = 'rgba(120,128,136,0.55)'; c.lineWidth = 2.4 / s; c.stroke();
    c.fillStyle = rgbaR(0.2 * h); c.fillRect(-9000, -9000, 20000, 20000);
    isotherms(c, GR[2], h, s);
    CITYWIN.forEach(([x, y, th]) => { const off = e > th; c.fillStyle = off ? '#1b1e21' : 'rgba(226,229,232,0.85)'; c.fillRect(x - 3.5, y - 3.5, 7, 7); });
    // hospital (outline)
    const [hx, hy] = HOSP_L2; c.strokeStyle = '#c9ced3'; c.lineWidth = 3 / s; c.strokeRect(hx - 40, hy - 40, 80, 80); c.beginPath(); c.moveTo(hx - 18, hy); c.lineTo(hx + 18, hy); c.moveTo(hx, hy - 18); c.lineTo(hx, hy + 18); c.stroke();
    c.strokeStyle = '#e4e7ea'; c.lineWidth = 3 / s; c.strokeRect(540 - 18, 960 - 18, 36, 36);
  }
  const HOSP_L2 = [800, 690];

  // ---------- level 1: block ----------
  const rngB = L.rng(5); const BLDG = [], BWIN = [];
  for (let bx = -1260; bx <= 2340; bx += 360) for (let by = -2280; by <= 4200; by += 360) {
    const x0 = bx + 35, y0 = by + 35, w = 290; // block interior (streets 70 wide)
    const n = 1 + Math.floor(rngB() * 3);
    for (let k = 0; k < n; k++) { const bw = 90 + rngB() * 180, bh = 90 + rngB() * 180, x = x0 + rngB() * (w - bw), y = y0 + rngB() * (w - bh); BLDG.push([x, y, bw, bh]);
      for (let q = 0; q < 4; q++) BWIN.push([x + 12 + rngB() * (bw - 24), y + 12 + rngB() * (bh - 24), 2]); }
  }
  // his building is the block at 540,960; ensure it
  BLDG.push([430, 860, 210, 190]);
  const NEIGH_L1 = [760, 790]; BLDG.push([690, 720, 150, 150]);
  // a few windows go dark (E thresholds)
  let dk = 0; BWIN.forEach(w => { const dd = Math.hypot(w[0] - 540, w[1] - 960); if (dd < 900 && dd > 150 && dk < 5 && rngB() < 0.2) { w[2] = [0.2, 0.4, 0.55, 0.7, 0.85][dk++]; } });
  function block(c, d, t, s) {
    const h = rho(d), e = E(d);
    c.fillStyle = '#23272b'; c.fillRect(-9000, -9000, 20000, 20000);
    // block interiors (pavement between streets)
    c.fillStyle = '#2f3439'; for (let bx = -1260; bx <= 2340; bx += 360) for (let by = -2280; by <= 4200; by += 360) c.fillRect(bx + 35, by + 35, 290, 290);
    relief(c, 1, s, 'rgba(150,158,166,0.16)', 2);
    BLDG.forEach(([x, y, w, hh]) => { c.fillStyle = '#3c4248'; c.fillRect(x, y, w, hh); c.strokeStyle = 'rgba(190,196,202,0.55)'; c.lineWidth = 2.5 / s; c.strokeRect(x, y, w, hh);
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + w * 0.5, y + hh * 0.5); c.lineTo(x + w, y); c.moveTo(x, y + hh); c.lineTo(x + w * 0.5, y + hh * 0.5); c.lineTo(x + w, y + hh); c.strokeStyle = 'rgba(190,196,202,0.18)'; c.stroke(); });
    c.fillStyle = rgbaR(0.2 * h); c.fillRect(-9000, -9000, 20000, 20000);
    isotherms(c, GR[1], h, s);
    BWIN.forEach(([x, y, th]) => { const off = e > th; c.fillStyle = off ? '#1b1e21' : 'rgba(226,229,232,0.9)'; c.fillRect(x - 6, y - 5, 12, 10); if (off) { c.strokeStyle = 'rgba(190,196,202,0.4)'; c.lineWidth = 1.5 / s; c.strokeRect(x - 6, y - 5, 12, 10); } });
    // his window: a small lit square with a ring
    c.fillStyle = 'rgba(236,239,242,0.95)'; c.fillRect(534, 954, 12, 12); c.strokeStyle = '#e4e7ea'; c.lineWidth = 3 / s; c.beginPath(); c.arc(540, 960, 22, 0, 7); c.stroke();
  }

  // ---------- level 0: his room (close) ----------
  const EYE = [540, 960], EYE2 = [405, 960], HEAD = [472, 1000];
  const ACROSS = [[640, 610], [750, 610], [860, 610], [640, 760], [750, 760], [860, 760], [640, 910], [750, 910], [860, 910], [640, 1060], [750, 1060], [860, 1060]];
  const ACROSS_TH = [2, 2, 0.8, 2, 0.5, 2, 2, 2, 2, 0.3, 2, 2];
  const SWEAT = [[420, 830, 0.1], [560, 850, 0.25], [352, 905, 0.4], [610, 900, 0.55], [470, 790, 0.7], [640, 1010, 0.85]];
  function room(c, d, t, s) {
    const h = rho(d), e = E(d), lw = b => b * L.clamp(s, 0.4, 1.6) / s;
    c.fillStyle = '#25292d'; c.fillRect(-9000, -9000, 20000, 20000);
    // wall texture: faint vertical stripes
    c.strokeStyle = 'rgba(160,168,176,0.05)'; c.lineWidth = lw(10); c.beginPath(); for (let x = -1200; x < 2400; x += 60) { c.moveTo(x, -2000); c.lineTo(x, 4000); } c.stroke();
    // a framed photo on the wall
    c.strokeStyle = 'rgba(190,196,202,0.5)'; c.lineWidth = lw(5); c.strokeRect(70, 330, 190, 150); c.strokeStyle = 'rgba(190,196,202,0.25)'; c.lineWidth = lw(3);
    c.beginPath(); c.arc(135, 400, 22, 0, 7); c.arc(190, 395, 20, 0, 7); c.stroke();
    // window and the building across the street
    c.fillStyle = '#3b4146'; c.fillRect(580, 340, 420, 840);
    c.fillStyle = '#30353a'; c.fillRect(610, 560, 380, 620);
    ACROSS.forEach(([x, y], i) => { const off = e > ACROSS_TH[i]; c.fillStyle = off ? '#1c1f22' : 'rgba(222,226,230,0.85)'; c.fillRect(x, y, 62, 88);
      c.strokeStyle = 'rgba(190,196,202,0.35)'; c.lineWidth = lw(2); c.strokeRect(x, y, 62, 88); });
    c.fillStyle = rgbaR(0.28 * h); c.fillRect(580, 340, 420, 840); // outside is hotter
    c.strokeStyle = '#8f969c'; c.lineWidth = lw(10); c.strokeRect(580, 340, 420, 840); c.beginPath(); c.moveTo(790, 340); c.lineTo(790, 1180); c.moveTo(580, 700); c.lineTo(1000, 700); c.stroke();
    c.fillStyle = '#5a6066'; c.fillRect(550, 1180, 480, 36); c.fillStyle = '#41464b'; c.fillRect(560, 1216, 460, 20);
    // fan on the sill (blade speed is a constant vibe)
    const fx = 810, fy = 1040, fr = 112;
    c.strokeStyle = '#9aa1a7'; c.lineWidth = lw(9); c.beginPath(); c.moveTo(fx, fy + 30); c.lineTo(fx, 1172); c.stroke();
    c.fillStyle = '#6f767c'; c.beginPath(); c.ellipse(fx, 1176, 70, 14, 0, 0, 7); c.fill();
    const ang = t * 11;
    c.fillStyle = 'rgba(170,176,182,0.55)'; for (let b = 0; b < 3; b++) { const a0 = ang + b * Math.PI * 2 / 3; c.beginPath(); c.moveTo(fx, fy); c.ellipse(fx + Math.cos(a0) * 55, fy + Math.sin(a0) * 55, 52, 26, a0, 0, 7); c.fill(); }
    c.fillStyle = '#b8bec3'; c.beginPath(); c.arc(fx, fy, 16, 0, 7); c.fill();
    c.strokeStyle = 'rgba(200,206,210,0.8)'; c.lineWidth = lw(4); c.beginPath(); c.arc(fx, fy, fr, 0, 7); c.stroke();
    c.lineWidth = lw(1.8); c.beginPath(); for (let k = 0; k < 16; k++) { const a0 = k / 16 * Math.PI * 2; c.moveTo(fx, fy); c.lineTo(fx + Math.cos(a0) * fr, fy + Math.sin(a0) * fr); } c.stroke();
    c.beginPath(); c.arc(fx, fy, fr * 0.6, 0, 7); c.stroke();
    // his shoulders (vest)
    c.fillStyle = '#51575d'; c.beginPath(); c.moveTo(110, 1920); c.bezierCurveTo(120, 1380, 250, 1290, 380, 1270); c.lineTo(570, 1270); c.bezierCurveTo(690, 1290, 820, 1380, 830, 1920); c.closePath(); c.fill();
    c.fillStyle = '#7b8187'; c.beginPath(); c.moveTo(380, 1270); c.quadraticCurveTo(472, 1400, 570, 1270); c.lineTo(540, 1250); c.lineTo(405, 1250); c.fill();
    c.strokeStyle = '#3d4247'; c.lineWidth = lw(14); c.beginPath(); c.moveTo(300, 1300); c.lineTo(290, 1920); c.moveTo(650, 1300); c.lineTo(660, 1920); c.stroke();
    // neck
    c.fillStyle = '#80868c'; c.fillRect(410, 1140, 125, 150);
    // head
    const [hx, hy] = HEAD, face = '#8d9399', line = '#d6dade';
    c.fillStyle = face; c.beginPath(); c.ellipse(hx - 212, hy + 10, 34, 58, -0.15, 0, 7); c.ellipse(hx + 212, hy + 10, 34, 58, 0.15, 0, 7); c.fill();
    c.beginPath(); c.ellipse(hx, hy, 210, 262, 0, 0, 7); c.fill(); c.strokeStyle = line; c.lineWidth = lw(5); c.stroke();
    // white hair wisps at the sides
    c.strokeStyle = 'rgba(232,235,238,0.85)'; c.lineWidth = lw(5);
    [[-1, 0], [1, 0]].forEach(([sd]) => { for (let k = 0; k < 6; k++) { const x = hx + sd * (175 + k * 4), y = hy - 150 + k * 22; c.beginPath(); c.moveTo(x, y); c.quadraticCurveTo(x + sd * 30, y + 8, x + sd * 22, y + 26); c.stroke(); } });
    // forehead wrinkles (drawn like contour lines)
    c.strokeStyle = 'rgba(214,218,222,0.55)'; c.lineWidth = lw(3.5);
    [0, 1, 2].forEach(k => { c.beginPath(); c.moveTo(hx - 120 + k * 12, hy - 150 + k * 26); c.bezierCurveTo(hx - 50, hy - 175 + k * 26, hx + 50, hy - 140 + k * 26, hx + 118 - k * 12, hy - 160 + k * 26); c.stroke(); });
    // worried brows
    c.strokeStyle = '#e9ecee'; c.lineWidth = lw(11); c.lineCap = 'round';
    c.beginPath(); c.moveTo(EYE2[0] - 50, 905); c.quadraticCurveTo(EYE2[0], 885, EYE2[0] + 42, 872); c.moveTo(EYE[0] - 42, 872); c.quadraticCurveTo(EYE[0], 885, EYE[0] + 50, 905); c.stroke();
    // eyes (look toward the window)
    [EYE2, EYE].forEach(([ex, ey]) => {
      c.fillStyle = '#e6e9eb'; c.beginPath(); c.ellipse(ex, ey, 34, 24, 0, 0, 7); c.fill();
      c.fillStyle = '#5b6167'; c.beginPath(); c.arc(ex + 12, ey + 1, 16, 0, 7); c.fill();
      c.fillStyle = '#121416'; c.beginPath(); c.arc(ex + 13, ey + 1, 8, 0, 7); c.fill();
      c.fillStyle = 'rgba(255,255,255,0.9)'; c.beginPath(); c.arc(ex + 8, ey - 5, 3.5, 0, 7); c.fill();
      c.strokeStyle = '#5a6066'; c.lineWidth = lw(4); c.beginPath(); c.ellipse(ex, ey, 34, 24, 0, Math.PI * 1.05, Math.PI * 1.95); c.stroke();
      c.strokeStyle = 'rgba(80,86,92,0.7)'; c.lineWidth = lw(3); c.beginPath(); c.arc(ex, ey + 30, 30, Math.PI * 0.2, Math.PI * 0.8); c.stroke(); // bags
    });
    // glasses
    c.strokeStyle = '#e4e7ea'; c.lineWidth = lw(6); [EYE2, EYE].forEach(([ex, ey]) => { rr(c, ex - 58, ey - 44, 116, 88, 30); c.stroke(); });
    c.beginPath(); c.moveTo(EYE2[0] + 58, 950); c.quadraticCurveTo(472, 938, EYE[0] - 58, 950); c.moveTo(EYE2[0] - 58, 945); c.lineTo(hx - 205, 935); c.moveTo(EYE[0] + 58, 945); c.lineTo(hx + 205, 935); c.stroke();
    // nose, mouth, folds
    c.strokeStyle = '#c7ccd0'; c.lineWidth = lw(5); c.beginPath(); c.moveTo(478, 975); c.quadraticCurveTo(470, 1045, 452, 1068); c.quadraticCurveTo(480, 1085, 505, 1066); c.stroke();
    c.beginPath(); c.moveTo(395, 1030); c.quadraticCurveTo(385, 1090, 405, 1140); c.moveTo(555, 1030); c.quadraticCurveTo(565, 1090, 545, 1140); c.stroke();
    c.fillStyle = '#3b4045'; c.beginPath(); c.ellipse(478, 1152, 40, 12 + 8 * h, 0, 0, 7); c.fill();
    c.strokeStyle = '#d6dade'; c.lineWidth = lw(5); c.beginPath(); c.moveTo(430, 1160); c.quadraticCurveTo(478, 1130, 526, 1160); c.stroke();
    // sweat (count rises with the heat curve)
    SWEAT.forEach(([x, y, th]) => { const a = L.clamp((h - th) / 0.1, 0, 1); if (a <= 0) return; const yy = y + ((t * 18 + x) % 40) * a;
      c.fillStyle = `rgba(220,228,234,${(0.85 * a).toFixed(3)})`; c.beginPath(); c.moveTo(x, yy - 16); c.quadraticCurveTo(x + 11, yy + 2, x, yy + 6); c.quadraticCurveTo(x - 11, yy + 2, x, yy - 16); c.fill(); });
    // heat on him: faint wash + isotherms sweeping the room
    c.fillStyle = rgbaR(0.1 * h); c.fillRect(-9000, -9000, 20000, 20000);
    isotherms(c, GR[0], h, s, 0.9);
  }

  // ---------- layered zoom ----------
  const LEVELS = [room, block, city, country];
  function world(c, d, t, p) {
    for (let n = 3; n >= 0; n--) {
      if (n > 0 && p < n - 0.85) continue; // hidden under an opaque finer layer
      const a = n === 3 ? 1 : 1 - L.sm(n + 0.15, n + 0.6, p); if (a <= 0.002) continue;
      const s = Math.pow(10, n - p);
      c.save(); c.globalAlpha = a; c.translate(540, 960); c.scale(s, s); c.translate(-540, -960);
      if (n === 0) LEVELS[0](c, d, t, s); else LEVELS[n](c, d, t, s);
      c.restore();
    }
  }

  // ---------- green pins (global coordinates) ----------
  const PINS = [
    { name: 'a neighbor with a key', g: toG(1, NEIGH_L1[0], NEIGH_L1[1]), arrive: HUM[0], ai: AIA[0], seed: 1, lvl: 1 },
    { name: 'a hospital plan', g: toG(2, HOSP_L2[0], HOSP_L2[1]), arrive: HUM[1], ai: AIA[1], seed: 2, lvl: 2 },
    { name: 'a national heat plan', g: [430, 690], arrive: HUM[2], ai: AIA[2], seed: 3, lvl: 3 }];
  const rngP = L.rng(71); const SMALLPINS = [];
  while (SMALLPINS.length < 8) { const x = 230 + rngP() * 640, y = 560 + rngP() * 760; if (inLand(x, y) && Math.hypot(x - HX, y - HY) > 110 && Math.hypot(x - 430, y - 690) > 80) SMALLPINS.push({ g: [x, y], arrive: hq((SMALLPINS.length + 0.5) / 8), seed: 4 + SMALLPINS.length }); }
  const g2s = (p, [X, Y]) => { const k = Math.pow(10, 3 - p); return [540 + (X - HX) * k, 960 + (Y - HY) * k]; };
  const BOX = [100, 270, 880, 1470];
  function edgePin(P) { const H = [540, 960];
    if (P[0] >= BOX[0] && P[0] <= BOX[2] && P[1] >= BOX[1] && P[1] <= BOX[3]) return [P[0], P[1], false];
    const dx = P[0] - H[0], dy = P[1] - H[1]; let s = 1;
    if (dx < 0) s = Math.min(s, (BOX[0] - H[0]) / dx); if (dx > 0) s = Math.min(s, (BOX[2] - H[0]) / dx);
    if (dy < 0) s = Math.min(s, (BOX[1] - H[1]) / dy); if (dy > 0) s = Math.min(s, (BOX[3] - H[1]) / dy);
    return [H[0] + dx * s, H[1] + dy * s, true]; }
  function pinShape(c, x, y, sc, a) {
    c.save(); c.globalAlpha *= a; glow(c, x, y - 34 * sc, 80 * sc, rgbaG, 0.55);
    c.fillStyle = GREEN; c.beginPath(); c.moveTo(x, y); c.bezierCurveTo(x - 8 * sc, y - 18 * sc, x - 24 * sc, y - 26 * sc, x - 24 * sc, y - 44 * sc);
    c.arc(x, y - 44 * sc, 24 * sc, Math.PI, 0); c.bezierCurveTo(x + 24 * sc, y - 26 * sc, x + 8 * sc, y - 18 * sc, x, y); c.fill();
    c.fillStyle = '#0f2a1a'; c.beginPath(); c.arc(x, y - 44 * sc, 9 * sc, 0, 7); c.fill(); c.restore();
  }
  function reach(c, Q, H, d, arrive, seed, w = 5, a = 1) {
    c.save(); c.globalAlpha *= a; c.lineCap = 'round';
    if (d >= arrive) {
      c.strokeStyle = rgbaG(0.25); c.lineWidth = w * 4; c.beginPath(); c.moveTo(Q[0], Q[1]); c.lineTo(H[0], H[1]); c.stroke();
      c.strokeStyle = GREEN; c.lineWidth = w; c.beginPath(); c.moveTo(Q[0], Q[1]); c.lineTo(H[0], H[1]); c.stroke();
      glow(c, H[0], H[1], 60, rgbaG, 0.6 * L.sm(arrive, arrive + 0.4, d)); c.restore(); return;
    }
    const per = 1.4 + seed * 0.27, ph = ((d + seed * 0.53) % per) / per; // attempt rhythm (vibe; arrival days are data)
    const fx = L.sm(0, 0.7, ph) * (0.3 + 0.35 * ((seed * 7) % 5) / 5), brk = L.sm(0.72, 0.82, ph);
    if (fx > 0.01) { const ex = L.lerp(Q[0], H[0], fx), ey = L.lerp(Q[1], H[1], fx);
      c.globalAlpha *= (1 - brk); c.strokeStyle = GREEN; c.lineWidth = w; c.setLineDash([w * 3, w * 2]); c.beginPath(); c.moveTo(Q[0], Q[1]); c.lineTo(ex, ey); c.stroke(); c.setLineDash([]);
      if (brk > 0) { c.fillStyle = GREEN; for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(ex + (k - 1) * w * 2 * brk, ey + brk * 30 * (k + 1), w * 0.7, 0, 7); c.fill(); } } }
    c.restore();
  }
  function pins(c, d, p, t, { labels = true, lines = true } = {}) {
    const H = [540, 960], la = lines ? L.sm(0.5, 0.9, p) : 0;
    // unlabeled pins: only when on screen at wide scales
    const sa = L.sm(1.8, 2.5, p);
    if (sa > 0) SMALLPINS.forEach(sp => { const Q = g2s(p, sp.g); if (Q[0] < -50 || Q[0] > 1130 || Q[1] < -50 || Q[1] > 1970) return;
      reach(c, Q, H, d, sp.arrive, sp.seed, 3.5, sa * la); pinShape(c, Q[0], Q[1], 0.6, sa); });
    PINS.forEach((pn, i) => {
      const [qx, qy, pinned] = edgePin(g2s(p, pn.g)), Q = [qx, qy];
      if (la > 0) reach(c, Q, H, d, pn.arrive, pn.seed, 6, la);
      pinShape(c, qx, qy, pinned ? 1.0 : 0.9, 1);
      if (!labels) return;
      const lvlA = fade(p, pn.lvl - 0.75, pn.lvl + 0.55, 0.3) * L.sm(0.4, 0.7, p);
      if (lvlA > 0) { c.save(); c.font = `46px "${HAND}"`; const tw = c.measureText(pn.name).width; c.restore();
        let lx = qx < 540 ? qx + 34 : qx - 34 - tw, ly = qy + (qy > 1300 ? -100 : 52);
        lx = L.clamp(lx, 90, 890 - tw); ly = L.clamp(ly, 260, 1490);
        tag(c, pn.name, lx, ly, 46, lvlA, { col: '#d9f5e4' }); }
    });
  }
  const SCALES = ['his window', 'his block', 'his city', 'his country'];
  function scaleLabel(c, p, a) {
    if (a <= 0) return; const pc = L.clamp(p, 0, 3), n = Math.round(pc), fr = 1 - Math.min(1, Math.abs(pc - n) * 3.2);
    tag(c, SCALES[n], 100, 1478, 52, a * fr, { col: '#e4e7ea' });
    c.save(); c.globalAlpha = a * fr; c.strokeStyle = '#e4e7ea'; c.lineWidth = 4; c.beginPath(); c.moveTo(100, 1416); c.lineTo(100, 1428); c.lineTo(300, 1428); c.lineTo(300, 1416); c.stroke(); c.restore();
  }
  function legend(c, a) {
    if (a <= 0) return; c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(11,14,17,0.72)'; rr(c, 80, 1250, 470, 140, 14); c.fill();
    c.strokeStyle = RED; c.lineWidth = 6; c.beginPath(); c.moveTo(106, 1292); c.bezierCurveTo(130, 1276, 150, 1306, 176, 1290); c.stroke(); c.restore();
    tag(c, 'hotter', 196, 1306, 44, a, { col: '#f3d2cf' });
    c.save(); c.globalAlpha = a; pinShape(c, 140, 1374, 0.62, 1); c.restore();
    tag(c, 'help, in pieces', 196, 1364, 44, a, { col: '#d9f5e4' });
  }

  // ---------- snap panel ----------
  const PANEL_PINS = [[-120, -40], [110, -95], [-60, 120]];
  function panel(c, y0, title, sub, arr, clk, a, labA) {
    const x0 = 80, W = 920, H = 560; c.save(); c.globalAlpha = a;
    c.fillStyle = '#16191c'; rr(c, x0, y0, W, H, 16); c.fill(); c.strokeStyle = 'rgba(190,196,202,0.4)'; c.lineWidth = 3; c.stroke();
    // mini map (country), same heat both lanes
    const mx = x0 + 20, my = y0 + 150, MW = 380, MH = 390, sc = 0.44, cx = mx + MW / 2, cy = my + MH / 2;
    c.save(); rr(c, mx, my, MW, MH, 10); c.clip();
    c.translate(cx, cy); c.scale(sc, sc); c.translate(-560, -930);
    country(c, clk, sc);
    c.restore();
    const Hs = [cx + (HX - 560) * sc, cy + (HY - 930) * sc];
    PANEL_PINS.forEach(([dx, dy], i) => { const Q = [Hs[0] + dx, Hs[1] + dy]; reach(c, Q, Hs, clk, arr[i], i + 1, 4, 1); pinShape(c, Q[0], Q[1], 0.55, 1); });
    // chart: the fitted curve E(d), identical in both lanes
    const cx0 = 440, cx1 = 970, cy0 = y0 + 190, cy1 = y0 + H - 60, X = dd => L.lerp(cx0, cx1, dd / DEND), Y = v => L.lerp(cy1, cy0, v);
    c.strokeStyle = 'rgba(190,196,202,0.55)'; c.lineWidth = 3; c.beginPath(); c.moveTo(cx0, cy0); c.lineTo(cx0, cy1); c.lineTo(cx1, cy1); c.stroke();
    c.fillStyle = rgbaR(0.85); c.beginPath(); c.moveTo(X(0), Y(0)); for (let dd = 0; dd <= clk + 1e-6; dd += 0.1) c.lineTo(X(dd), Y(E(dd))); c.lineTo(X(clk), Y(0)); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(220,224,228,0.6)'; c.setLineDash([8, 8]); c.lineWidth = 3; c.beginPath(); c.moveTo(X(PEAK), cy0 - 10); c.lineTo(X(PEAK), cy1); c.stroke(); c.setLineDash([]);
    tag(c, 'peak', X(PEAK) - 10, cy0 - 18, 44, 1, { col: '#e4e7ea', align: 'right' });
    if (clk >= arr[1]) { c.fillStyle = GREEN; c.fillRect(X(arr[1]) - 5, cy0 - 30, 10, cy1 - cy0 + 30); glow(c, X(arr[1]), cy1 - 40, 60, rgbaG, 0.5); }
    c.fillStyle = '#e4e7ea'; c.beginPath(); c.moveTo(X(clk), cy1 + 4); c.lineTo(X(clk) - 12, cy1 + 26); c.lineTo(X(clk) + 12, cy1 + 26); c.fill();
    tag(c, title, 110, y0 + 72, 64, 1, { font: SERIF });
    tag(c, sub, 110, y0 + 128, 50, labA, { col: GREEN });
    c.restore();
  }

  // ---------- draw ----------
  function draw(c, t) {
    c.fillStyle = INK; c.fillRect(0, 0, 1080, 1920);
    const d = dayAt(t), p = pAt(t);
    if (t < 23.0) {
      world(c, d, t, p);
      pins(c, d, p, t, { labels: t >= T0 });
      if (t < T0) {
        card(c, ['He can’t see', 'the map.'], 330, 118, 1);
        slate(c, 'SC1  CLOSE  (flash-forward)');
        if (t > 1.2) { c.fillStyle = `rgba(11,14,17,${L.sm(1.2, 1.4, t).toFixed(3)})`; c.fillRect(0, 0, 1080, 1920); }
      } else {
        if (t < 1.7) { c.fillStyle = `rgba(11,14,17,${(1 - L.sm(1.4, 1.7, t)).toFixed(3)})`; c.fillRect(0, 0, 1080, 1920); }
        scaleLabel(c, p, L.sm(4.4, 4.9, t) * (1 - L.sm(17.8, 18.3, t)));
        legend(c, fade(t, 10.2, 15.4, 0.4));
        card(c, ['One fan.', 'One window.'], 330, 112, fade(t, 1.8, 4.3));
        card(c, ['The heat', 'has a shape.'], 330, 108, fade(t, 4.9, 7.1));
        card(c, ['Help exists.', 'In pieces.'], 330, 108, fade(t, 7.4, 9.9));
        card(c, ['No one holds', 'the whole map.'], 330, 104, fade(t, 10.3, 12.4));
        card(c, ['The plan came', 'after the peak.'], 330, 104, fade(t, 13.3, 15.3));
        card(c, ['Across the street,', 'a window went dark.'], 330, 96, fade(t, 17.8, 20.3));
        if (t > 20.4) { c.fillStyle = `rgba(11,14,17,${(0.62 * L.sm(20.4, 20.8, t)).toFixed(3)})`; c.fillRect(0, 0, 1080, 1920); }
        card(c, ['We slowed it down', 'so you could see it.'], 900, 96, fade(t, 20.6, 22.9));
        slate(c, t < 4.6 ? 'SC2  CLOSE' : t < 10.4 ? 'SC3  ZOOM OUT  (powers of ten)' : t < 12.2 ? 'SC3  WIDE  HOLD' : t < 13.2 ? 'SC4  DIP IN' : t < 15.2 ? 'SC4  CITY  HOLD' : t < 17.6 ? 'SC5  FALL IN' : 'SC5  CLOSE+');
      }
    } else if (t < 23.6) {
      c.fillStyle = INK; c.fillRect(0, 0, 1080, 1920);
    } else if (t < TFIN) {
      const clk = DEND * L.clamp((t - TSNAP) / SNAPLEN, 0, 1), a = L.sm(23.6, 23.9, t);
      tag(c, 'Same heat. Full speed.', 490, 262, 58, a, { font: SERIF, align: 'center' });
      panel(c, 300, 'People', 'hospital plan: day 12', HUM, clk, a, L.sm(0, 0.3, clk - HUM[1]));
      panel(c, 920, 'Frontier AI', 'day 3 · illustrative', AIA, clk, a, L.sm(0, 0.3, clk - AIA[1]));
      tag(c, 'after the peak', 490, 910, 50, fade(t, 28.6, 31.4), { align: 'center' });
      tag(c, 'before the peak', 490, 1535, 50, fade(t, 28.6, 31.4), { align: 'center' });
      slate(c, 'SC6  SNAP  WIDE SPLIT');
      if (t > 31.2) { c.fillStyle = `rgba(11,14,17,${L.sm(31.2, TFIN, t).toFixed(3)})`; c.fillRect(0, 0, 1080, 1920); }
    } else {
      const knot = L.sm(33.0, 34.4, t);
      world(c, DEND, t, p);
      // the three green pins close into a ring around his eye
      const H = [540, 960];
      PINS.forEach((pn, i) => { const [qx, qy] = edgePin(g2s(p, pn.g)), an = -Math.PI / 2 + i * Math.PI * 2 / 3, R = 330;
        const x = L.lerp(qx, H[0] + Math.cos(an) * R, knot), y = L.lerp(qy, H[1] + Math.sin(an) * R, knot); pinShape(c, x, y, 1, 1); });
      if (knot > 0) { c.save(); c.globalAlpha = knot; c.strokeStyle = rgbaG(0.3); c.lineWidth = 26; c.beginPath(); c.arc(H[0], H[1], 300, 0, 7); c.stroke();
        c.strokeStyle = GREEN; c.lineWidth = 7; c.beginPath(); c.arc(H[0], H[1], 300, 0, 7); c.stroke(); glow(c, H[0] + 40, H[1] - 30, 90, rgbaG, 0.7 * knot); c.restore(); }
      c.fillStyle = `rgba(11,14,17,${(0.3 * L.sm(32.6, 33.2, t)).toFixed(3)})`; c.fillRect(0, 0, 1080, 1920);
      card(c, ['This is the', 'bottleneck.'], 330, 130, fade(t, 32.8, 35.8, 0.35));
      slate(c, 'SC7  CLOSE++  (fall into his eye)');
      if (t < 31.9) { c.fillStyle = `rgba(11,14,17,${(1 - L.sm(TFIN, 31.9, t)).toFixed(3)})`; c.fillRect(0, 0, 1080, 1920); }
    }
    if (t >= 35.8) L.endCard(c, L.sm(35.8, 36.2, t), { line: 'The bottleneck is us.' });
    L.grain(c, t, { alpha: 0.05, n: 500 });
  }

  const cues = [{ t: 1.35, type: 'bonk' }, { t: 4.6, type: 'whoosh' }, { t: 12.2, type: 'whoosh' }, { t: 15.2, type: 'whoosh' },
    { t: T0 + HUM[0], type: 'pop' }, { t: T0 + HUM[1], type: 'pop' }, { t: 23.6, type: 'hit' },
    { t: TSNAP + SNAPLEN * AIA[1] / DEND, type: 'ding' }, { t: TSNAP + SNAPLEN * HUM[1] / DEND, type: 'pop' }, { t: 32.8, type: 'hit' }];
  // soft low pulses when E crosses a quarter, a half, three quarters (windows going dark)
  [0.25, 0.5, 0.75].forEach(q => { let lo = 0, hi = DEND; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; E(m) < q ? lo = m : hi = m; } cues.push({ t: T0 + lo, type: 'bonk' }); });
  return { draw, DUR, cues,
    acts: [{ start: 0, end: 23.0, bpm: 0, drone: true }, { start: 23.6, end: TFIN, bpm: 0, drone: true }, { start: TFIN, end: DUR, bpm: 0, drone: true }] };
}
if (typeof module !== 'undefined') module.exports = makeScene;
