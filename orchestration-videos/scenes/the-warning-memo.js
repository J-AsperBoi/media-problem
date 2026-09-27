// the-warning-memo: mockumentary, constructivist poster, library. Analog: quebec-1989.
// The memo's journey (t < 13) is STAGING, untimed: the analog marks the warning issue time unverified.
// One stated mapping from t0 (log time): event seconds E = 10^((t - 13) / 1.2) for 13 <= t <= 23.2.
// Red = logistic fit through threat.points (0 at t0, whole grid at 90 s): s0 0.001 -> 0.999, doubling 4.52 s.
// Green = 5 analog fragments; loop edges at L.lognormalQuantile(q, median 759 h [modelled, never shown], p90 64000 h).
// AI snap = ai_counterfactual (routing an existing warning), labeled illustrative; red and steel unchanged.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('quebec-1989');
  const DUR = 44, RED = L.RED, GREEN = L.GREEN;
  const CREAM = '#e9e2cf', PAPER = '#ded6c0', INK = '#161514', CHAR = '#262521', G1 = '#8d8a82', G2 = '#b9b3a3', G3 = '#4a4943', DARKF = '#3b3a35';
  const rgbaR = a => `rgba(255,59,48,${a})`, rgbaG = a => `rgba(52,210,123,${a})`;

  // ---------------- time mapping ----------------
  const T0 = 13, SPD = 1.2, TSTOP = 23.2;
  const E = t => t < T0 ? 0 : Math.pow(10, (Math.min(t, TSTOP) - T0) / SPD);
  const tOfE = e => T0 + SPD * Math.log10(e);
  const COL_S = A.threat.points[1].t * 3600;                 // 90 s
  const RST = A.threat.events.find(e => e.t === 9), RST_S = RST.t * 3600; // 9 h, 83 %
  const kR = Math.log(0.999 / 0.001 * 0.999 / 0.001) / COL_S; // logistic through (0, 0.1%) and (90 s, 99.9%)
  const extent = e => { if (e <= 0) return 0; const x = 0.001 * Math.exp(kR * e); return L.clamp((x / (0.999 + x) - 0.001) / 0.998, 0, 1); };
  const restored = e => e <= COL_S ? 0 : e <= RST_S ? 0.83 * (e - COL_S) / (RST_S - COL_S) : 0.83 + 0.17 * L.clamp((e - RST_S) / (86400 - RST_S), 0, 1); // tail to 24 h assumed
  const isDark = (d, e) => d < extent(e) && d < 1 - restored(e);

  // ---------------- world: tower + grid ----------------
  const GROUND = 1500, FH = 70, TX0 = 360, TX1 = 720;
  const floorTop = i => GROUND - FH * (i + 1), floorBot = i => GROUND - FH * i;
  const ENTRY = { x: -700, y: -1000 };
  const r = L.rng(313);
  const towns = [];
  while (towns.length < 34) { const x = -560 + r() * 2200, y = -780 + r() * 3600;
    if (x > 240 && x < 860 && y > 360 && y < 1700) continue; if (towns.some(o => Math.hypot(o.x - x, o.y - y) < 330)) continue; towns.push({ x, y, s: 26 + r() * 26 }); }
  towns.push({ x: 540, y: GROUND + 20, s: 0, tower: true });
  const dist0 = p => Math.hypot(p.x - ENTRY.x, p.y - ENTRY.y);
  let dMax = 0; towns.forEach(p => dMax = Math.max(dMax, dist0(p)));
  towns.forEach(p => p.d = dist0(p) / dMax);
  const lines = []; const seen = {};
  towns.forEach((a, i) => { const near = towns.map((b, j) => ({ j, dd: Math.hypot(a.x - b.x, a.y - b.y) })).filter(o => o.j !== i).sort((p, q) => p.dd - q.dd).slice(0, a.tower ? 4 : 2);
    near.forEach(o => { const k = Math.min(i, o.j) + '-' + Math.max(i, o.j); if (seen[k]) return; seen[k] = 1; lines.push([a, towns[o.j]]); }); });
  const subs = []; lines.forEach(([a, b]) => { const n = 8; for (let k = 0; k < n; k++) { const p = { x: L.lerp(a.x, b.x, k / n), y: L.lerp(a.y, b.y, k / n) }, q = { x: L.lerp(a.x, b.x, (k + 1) / n), y: L.lerp(a.y, b.y, (k + 1) / n) };
    subs.push({ p, q, d: dist0({ x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 }) / dMax }); } });
  const TOWER_D = dist0({ x: 540, y: 1000 }) / dMax;

  // green fragments (analog order) in the landscape; loop edges with lognormal arrivals
  const FR = {}; A.solution.fragments.forEach(f => FR[f.id] = f);
  const nodes = [
    { id: 'f3', lbl: 'engineers', x: 1150, y: 1180 }, { id: 'f4', lbl: 'line crews', x: 1080, y: 2480 },
    { id: 'f2', lbl: 'scientists', x: -120, y: 2150 }, { id: 'f1', lbl: 'forecasters', x: -90, y: 60 },
    { id: 'f5', lbl: 'planners', x: 1130, y: -330 }];
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;
  const edges = nodes.map((n, i) => { const q = (i + 0.5) / nodes.length; const hrs = L.lognormalQuantile(q, MED, P90); return { a: n, b: nodes[(i + 1) % nodes.length], hrs, t: tOfE(hrs * 3600) }; });
  const RING_T = edges[edges.length - 1].t;

  // staff on floors (world)
  const FL_IN = 7, FL_OTHER = 3, FL_BASE = -1, FL_CTRL = 13;
  const staff = [
    { x: 430, fl: FL_IN, mood: 'happy', tag: 'A' }, { x: 570, fl: FL_IN, mood: 'happy', tag: 'B' },
    { x: 530, fl: FL_OTHER, mood: 'bored', tag: 'C' }, { x: 620, fl: FL_BASE, mood: 'happy', tag: 'D' },
    { x: 520, fl: FL_CTRL, mood: 'bored', tag: 'E' }];
  const deskY = fl => floorBot(fl);

  // memo path (world), staging only
  const memoKeys = [[1.4, [452, 1480 - 7 * 70 - 18]], [3.7, [452, 1482 - 490 - 18]], [4.4, [592, 974]], [6.1, [592, 974]], [6.6, [700, 974]], [7.1, [700, 1254]], [7.5, [552, 1254]],
    [8.7, [552, 1254]], [9.1, [700, 1254]], [9.5, [700, 1534]], [9.9, [575, 1534]], [10.7, [560, 1548]]];
  const memoPos = t => L.key(memoKeys, t);
  const stampsOnMemo = t => (t > 2.2) + (t > 4.8) + (t > 7.7) + (t > 10.0);

  // camera keys [t, [x, y, zoom]]
  const camKeys = [[1.4, [440, 972, 10]], [3.6, [446, 972, 10]], [4.5, [575, 972, 10]], [6.1, [580, 972, 10]], [6.7, [690, 1110, 6.5]], [7.3, [548, 1252, 10]], [8.7, [552, 1252, 10]],
    [9.2, [690, 1400, 6.5]], [9.8, [585, 1532, 10]], [10.9, [585, 1532, 10]], [12.2, [560, 640, 3.2]], [12.9, [560, 700, 3.0]], [15.4, [540, 1050, 0.5]],
    [24.2, [540, 1060, 0.47]], [26.0, [438, 972, 16]], [30.0, [440, 970, 17]]];

  // ---------------- drawing helpers ----------------
  const rr = (c, x, y, w, h, rad) => { c.beginPath(); c.roundRect(x, y, w, h, rad); };
  function bean(c, x, y, s, o) {
    const bw = 46 * s, bh = 60 * s, col = o.col || G1, mood = o.mood || 'happy';
    c.save();
    if (o.arms) { c.strokeStyle = col; c.lineWidth = 7 * s; c.lineCap = 'round'; const up = o.armsFwd;
      [-1, 1].forEach(sd => { const ax = x + sd * bw * 0.42, ay = y + bh * 0.05; const ang = up ? (-0.25 * Math.PI + (sd < 0 ? -0.45 * Math.PI : -0.05 * Math.PI)) : (Math.PI / 2 + sd * 0.25);
        c.beginPath(); c.moveTo(ax, ay); c.lineTo(ax + Math.cos(ang) * bw * 0.5, ay + Math.sin(ang) * bw * 0.5); c.stroke(); }); }
    c.fillStyle = col; rr(c, x - bw / 2, y - bh / 2, bw, bh, bw / 2); c.fill(); c.strokeStyle = INK; c.lineWidth = 2.2 * s; c.stroke();
    const ey = y - bh * 0.14, er = bw * 0.14, lk = o.look || [0, 0];
    [-1, 1].forEach(sd => { const ex = x + sd * bw * 0.19;
      c.fillStyle = '#fffdf7'; c.beginPath(); c.arc(ex, ey, er, 0, 6.283); c.fill(); c.strokeStyle = INK; c.lineWidth = 1.6 * s; c.stroke();
      c.fillStyle = INK; c.beginPath(); c.arc(ex + lk[0] * er * 0.4, ey + lk[1] * er * 0.4, er * 0.5, 0, 6.283); c.fill();
      if (mood === 'bored') { c.fillStyle = col; c.fillRect(ex - er * 1.1, ey - er * 1.15, er * 2.2, er * 1.05); c.strokeStyle = INK; c.lineWidth = 2.2 * s; c.beginPath(); c.moveTo(ex - er, ey - 0.1 * er); c.lineTo(ex + er, ey - 0.1 * er); c.stroke(); }
      if (mood === 'sad' || mood === 'grave') { c.strokeStyle = INK; c.lineWidth = 2.6 * s; c.beginPath(); c.moveTo(ex - er, ey - er * 1.5 - sd * er * 0.35); c.lineTo(ex + er, ey - er * 1.5 + sd * er * 0.35); c.stroke(); } });
    const my = y + bh * 0.16; c.strokeStyle = INK; c.lineWidth = 3 * s; c.lineCap = 'round'; c.beginPath();
    if (mood === 'happy') c.arc(x, my - bw * 0.05, bw * 0.13, 0.15 * Math.PI, 0.85 * Math.PI);
    else if (mood === 'sad') c.arc(x, my + bw * 0.07, bw * 0.11, 1.2 * Math.PI, 1.8 * Math.PI);
    else { c.moveTo(x - bw * 0.1, my); c.lineTo(x + bw * 0.1, my); }
    c.stroke(); c.restore();
  }
  function memo(c, x, y, s, nSt, rot = 0) {
    c.save(); c.translate(x, y); c.rotate(rot);
    c.fillStyle = rgbaG(0.25); c.fillRect(-11 * s, -14 * s, 22 * s, 28 * s);
    c.fillStyle = GREEN; c.fillRect(-8 * s, -10.5 * s, 16 * s, 21 * s);
    c.fillStyle = 'rgba(10,40,20,0.55)'; for (let k = 0; k < 4; k++) c.fillRect(-5.5 * s, (-7 + k * 3.2) * s, (k === 3 ? 6 : 11) * s, 1.1 * s);
    c.strokeStyle = INK; c.lineWidth = 0.9 * s; for (let k = 0; k < nSt; k++) { c.save(); c.translate((-3 + (k % 2) * 6) * s, (4 + Math.floor(k / 2) * 3.6) * s); c.rotate(-0.2 + k * 0.17); c.strokeRect(-2.6 * s, -1.3 * s, 5.2 * s, 2.6 * s); c.restore(); }
    c.restore();
  }
  // constructivist banner: black slanted block with cream serif text
  function banner(c, lines, y, size, al, { col = CREAM, bg = INK, skew = -0.04, x0 = 80, x1 = 900 } = {}) {
    if (al <= 0) return; c.save(); c.globalAlpha = al; const h = lines.length * size * 1.08 + size * 0.55;
    c.translate(540, y + h / 2); c.rotate(skew); c.fillStyle = bg; c.fillRect(x0 - 540 - 10, -h / 2, x1 - x0 + 20, h);
    c.textAlign = 'center'; lines.forEach((l, i) => { const L2 = typeof l === 'string' ? { text: l } : l; c.font = `${L2.size || size}px "${L2.font || SERIF}"`; c.fillStyle = L2.col || col;
      c.fillText(L2.text, (x0 + x1) / 2 - 540, -h / 2 + size * 0.95 + i * size * 1.08); }); c.restore();
  }
  function lowerThird(c, quote, who, a) {
    if (a <= 0) return; c.save(); c.globalAlpha = a;
    c.fillStyle = INK; c.fillRect(80, 1300, 820, 170); c.fillStyle = CREAM; c.fillRect(80, 1300, 18, 170);
    c.font = `58px "${SERIF}"`; c.textAlign = 'left'; c.fillStyle = CREAM; c.fillText(quote, 124, 1375);
    c.font = `42px "${HAND}"`; c.fillStyle = G2; c.fillText(who, 126, 1440); c.restore();
  }
  function stamp(c, text, x, y, rot, p, col = INK) {
    if (p <= 0) return; c.save(); c.translate(x, y); c.rotate(rot); const sc = L.lerp(1.9, 1, L.ease.out(Math.min(1, p))); c.scale(sc, sc); c.globalAlpha = Math.min(1, p * 2.5);
    c.font = `84px "${HAND}"`; const w = c.measureText(text).width + 64; c.strokeStyle = col; c.lineWidth = 9; rr(c, -w / 2, -64, w, 108, 10); c.stroke();
    c.lineWidth = 3; rr(c, -w / 2 + 12, -52, w - 24, 84, 6); c.stroke(); c.fillStyle = col; c.textAlign = 'center'; c.fillText(text, 0, 18); c.restore();
  }
  const fade = (t, a, b, f = 0.3) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));

  // ---------------- world draw ----------------
  function drawWorld(c, t, z) {
    const e = E(t);
    // night backdrop + poster geometry
    c.fillStyle = CHAR; c.fillRect(-3000, -3000, 7000, 8000);
    c.fillStyle = '#2f2e29'; c.beginPath(); c.arc(540, 800, 1250, 0, 6.283); c.fill();
    c.save(); c.translate(540, 1000); c.rotate(-0.52); c.fillStyle = '#1d1c19'; c.fillRect(-3000, -180, 6000, 360); c.fillStyle = '#34332d'; c.fillRect(-3000, 420, 6000, 70); c.restore();
    c.fillStyle = '#1f1e1b'; c.fillRect(-3000, GROUND + 70, 7000, 20);
    // grid
    c.lineCap = 'round';
    subs.forEach(s => { const dark = isDark(s.d, e); c.strokeStyle = dark ? RED : G3; c.lineWidth = dark ? 16 : 7; c.beginPath(); c.moveTo(s.p.x, s.p.y); c.lineTo(s.q.x, s.q.y); c.stroke(); });
    // lasting fix: green bracing on lines once the ring closes
    if (t > RING_T) { const a = L.sm(RING_T, RING_T + 0.6, t); c.strokeStyle = rgbaG(a); c.lineWidth = 8;
      lines.forEach(([p, q], i) => { const mx = (p.x + q.x) / 2, my = (p.y + q.y) / 2, ang = Math.atan2(q.y - p.y, q.x - p.x) + Math.PI / 2; [-0.18, 0, 0.18].forEach(f => { const x = L.lerp(mx, q.x, f), y = L.lerp(my, q.y, f);
        c.beginPath(); c.moveTo(x - Math.cos(ang) * 30, y - Math.sin(ang) * 30); c.lineTo(x + Math.cos(ang) * 30, y + Math.sin(ang) * 30); c.stroke(); }); }); }
    towns.forEach(p => { if (p.tower) return; const dark = isDark(p.d, e); c.fillStyle = dark ? '#1a1916' : CREAM; c.save(); c.translate(p.x, p.y); c.rotate(-0.12);
      c.fillRect(-p.s, -p.s, p.s * 2, p.s * 2); if (!dark) { c.fillStyle = INK; c.fillRect(-p.s * 0.55, -p.s * 0.55, p.s * 0.5, p.s * 0.5); } c.restore(); });
    // green fragments + edges (visible once we are wide)
    if (z < 2.5) {
      const ga = L.sm(2.5, 1.2, z);
      edges.forEach(ed => { const f = L.sm(ed.t - 0.4, ed.t, t); if (f <= 0) return; c.strokeStyle = rgbaG(ga); c.lineWidth = 22; c.beginPath(); c.moveTo(ed.a.x, ed.a.y); c.lineTo(L.lerp(ed.a.x, ed.b.x, f), L.lerp(ed.a.y, ed.b.y, f)); c.stroke(); });
      nodes.forEach(n => { c.fillStyle = rgbaG(0.25 * ga); c.beginPath(); c.arc(n.x, n.y, 95, 0, 6.283); c.fill(); c.fillStyle = rgbaG(ga); c.beginPath(); c.arc(n.x, n.y, 48, 0, 6.283); c.fill();
        c.save(); c.globalAlpha = ga; c.font = `100px "${HAND}"`; c.textAlign = 'center'; c.fillStyle = CREAM; c.fillText(n.lbl, n.x, n.y + 170); c.restore(); });
    }
    // tower
    const tDark = isDark(TOWER_D, e);
    c.fillStyle = INK; c.fillRect(TX0 - 22, floorTop(FL_CTRL) - 26, TX1 - TX0 + 44, GROUND - floorTop(FL_CTRL) + 26 + FH + 12);
    for (let i = -1; i <= FL_CTRL; i++) { const y0 = floorTop(i) + 5, y1 = floorBot(i) - 5;
      c.fillStyle = tDark ? DARKF : (i === -1 ? PAPER : CREAM); c.fillRect(TX0, y0, TX1 - TX0, y1 - y0);
      c.fillStyle = tDark ? '#2c2b27' : G2; c.fillRect(680, y0, 40, y1 - y0); // stairwell
      c.strokeStyle = tDark ? '#1e1d1a' : G1; c.lineWidth = 2; c.beginPath(); for (let k = 0; k < 4; k++) { c.moveTo(684, y1 - k * 15); c.lineTo(716, y1 - k * 15 - 10); } c.stroke();
      if (i !== -1 && i % 2 === 0 && i !== FL_IN && i !== FL_OTHER && i !== FL_CTRL) { // generic desks on other floors (tiny, gray)
        for (let k = 0; k < 3; k++) { c.fillStyle = tDark ? '#2c2b27' : G2; c.fillRect(400 + k * 95, y1 - 20, 44, 20); } }
    }
    // records cabinets in basement
    for (let k = 0; k < 4; k++) { const x = 380 + k * 46, y0 = floorTop(-1) + 12; c.fillStyle = tDark ? '#2c2b27' : G1; c.fillRect(x, y0, 40, 53); c.fillStyle = tDark ? '#1e1d1a' : INK; for (let j = 0; j < 3; j++) c.fillRect(x + 14, y0 + 8 + j * 16, 12, 3); }
    // control room: antenna, sign, tray
    c.fillStyle = INK; c.save(); c.translate(560, floorTop(FL_CTRL) - 26); c.rotate(-0.35); c.fillRect(-6, -260, 12, 260); c.fillRect(-60, -250, 120, 10); c.restore();
    c.save(); c.translate(430, floorTop(FL_CTRL) - 60); c.rotate(-0.08); c.fillStyle = INK; c.fillRect(-10, -26, 200, 52); c.font = `36px "${SERIF}"`; c.fillStyle = CREAM; c.textAlign = 'center'; c.fillText('CONTROL', 90, 12); c.restore();
    c.fillStyle = tDark ? '#2c2b27' : G1; c.fillRect(380, floorTop(FL_CTRL) + 14, 90, 40); // control board
    c.strokeStyle = tDark ? '#1e1d1a' : INK; c.lineWidth = 2.5; c.strokeRect(600, floorBot(FL_CTRL) - 34, 40, 12); // empty inbox tray
    // staff
    staff.forEach(p => { const yb = deskY(p.fl); let mood = p.mood;
      if (p.tag === 'A' && t > 24) mood = 'sad';
      bean(c, p.x, yb - 34, 0.62, { col: tDark ? '#57554e' : G1, mood, arms: true, armsFwd: false, look: p.tag === 'E' ? [1, 0.6] : [0.6, 0] });
      c.fillStyle = tDark ? '#1e1d1a' : INK; c.save(); c.translate(p.x + 16, yb - 14); c.rotate(-0.05); c.fillRect(-26, 0, 60, 14); c.restore(); });
    // the memo (after 10.7 it lies in the drawer: a small green glow in the basement)
    if (t < 30) { const [mx, my] = memoPos(t); const inDrawer = t > 10.7; memo(c, mx, my, inDrawer ? 0.9 : 1.1, stampsOnMemo(t), Math.sin(t * 2.1) * 0.06);
      if (inDrawer && z < 3) { c.fillStyle = rgbaG(0.35); c.beginPath(); c.arc(mx, my, 60, 0, 6.283); c.fill(); c.fillStyle = GREEN; c.beginPath(); c.arc(mx, my, 20, 0, 6.283); c.fill(); } }
    // the red flash, arriving from the upper-left corner, as a glow on the tower once dark
    if (tDark && e < RST_S) { c.fillStyle = rgbaR(0.08); c.fillRect(TX0 - 22, floorTop(FL_CTRL) - 26, TX1 - TX0 + 44, GROUND - floorTop(FL_CTRL) + 100); }
  }

  function camera(c, t) {
    const [x, y, z] = L.key(camKeys, t);
    const hh = z > 2 ? 1 : 0.3; // handheld amount
    const jx = (L.noise(t * 1.7, 3) - 0.5) * 22 * hh, jy = (L.noise(t * 1.3, 7) - 0.5) * 18 * hh, jr = (L.noise(t * 0.9, 11) - 0.5) * 0.05 * hh;
    c.translate(540 + jx, 960 + jy); c.rotate(jr - 0.02); c.scale(z, z); c.translate(-x, -y); return z;
  }

  // ---------------- log ruler (screen) ----------------
  const TICKS = [['second', 0], ['minute', Math.log10(60)], ['hour', Math.log10(3600)], ['day', Math.log10(86400)], ['month', Math.log10(2.63e6)], ['year', Math.log10(3.156e7)]];
  const RMAX = Math.log10(A.solution.aggregation.p90 * 3600);
  function ruler(c, t, a) {
    if (a <= 0) return; c.save(); c.globalAlpha = a; const x0 = 100, x1 = 880, y = 1440;
    c.fillStyle = 'rgba(22,21,20,0.85)'; c.fillRect(80, 1350, 840, 140);
    c.strokeStyle = G2; c.lineWidth = 4; c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
    c.font = `32px "${HAND}"`; c.textAlign = 'center';
    TICKS.forEach(([w, lv]) => { const x = L.lerp(x0, x1, lv / RMAX); c.fillStyle = G2; c.fillRect(x - 2, y - 14, 4, 28); c.fillText(w, x, y + 44); });
    c.textAlign = 'left'; c.fillStyle = G2; c.font = `34px "${HAND}"`; c.fillText('log time', x0, 1388);
    const e = E(t); const lv = e < 1 ? 0 : Math.log10(e); const px = L.lerp(x0, x1, L.clamp(lv / RMAX, 0, 1));
    c.fillStyle = extent(e) > 0.02 && e < RST_S ? RED : CREAM; c.beginPath(); c.moveTo(px, y - 8); c.lineTo(px - 14, y - 36); c.lineTo(px + 14, y - 36); c.fill();
    c.restore();
  }

  // ---------------- shots ----------------
  function coldOpen(c, t) {
    c.fillStyle = CREAM; c.fillRect(0, 0, 1080, 1920);
    c.save(); c.translate(540, 960); c.rotate(-0.5); c.fillStyle = INK; c.fillRect(-1400, 380, 2800, 200); c.restore();
    const jx = (L.noise(t * 2.2, 5) - 0.5) * 24, jy = (L.noise(t * 1.8, 9) - 0.5) * 18;
    c.save(); c.translate(jx, jy);
    // window onto the night: the grid lit red
    c.fillStyle = INK; c.fillRect(110, 250, 860, 700); c.fillStyle = CHAR; c.fillRect(140, 280, 800, 640);
    c.save(); c.beginPath(); c.rect(140, 280, 800, 640); c.clip();
    c.lineCap = 'round'; const segs = [[140, 330, 520, 610], [520, 610, 940, 540], [520, 610, 700, 920], [260, 920, 520, 610], [700, 920, 940, 780]];
    const pulse = 0.85 + 0.15 * Math.sin(t * 9);
    segs.forEach(([a, b, cc, d]) => { c.strokeStyle = rgbaR(0.28); c.lineWidth = 70; c.beginPath(); c.moveTo(a, b); c.lineTo(cc, d); c.stroke(); c.strokeStyle = RED; c.globalAlpha = pulse; c.lineWidth = 26; c.beginPath(); c.moveTo(a, b); c.lineTo(cc, d); c.stroke(); c.globalAlpha = 1; });
    [[520, 610], [700, 920], [940, 540]].forEach(([x, y]) => { c.fillStyle = '#1a1916'; c.fillRect(x - 30, y - 30, 60, 60); });
    c.restore();
    c.fillStyle = INK; c.fillRect(530, 250, 20, 700); c.fillRect(110, 600, 860, 16);
    // clerk, close, holding the memo
    bean(c, 540, 1230, 6.2, { col: G1, mood: 'panic', arms: false, look: [-0.8, -0.8] });
    c.strokeStyle = G1; c.lineWidth = 42; c.lineCap = 'round'; c.beginPath(); c.moveTo(430, 1370); c.lineTo(560, 1250); c.moveTo(800, 1400); c.lineTo(740, 1300); c.stroke();
    memo(c, 730, 1250, 9, 3, -0.14);
    c.restore();
    banner(c, ['The warning was', { text: 'already here.', col: GREEN }], 1380, 76, 1, { skew: -0.05 });
  }

  function worldShot(c, t) {
    c.save(); const z = camera(c, t); drawWorld(c, t, z); c.restore();
    // blackout overlay on close shots is not needed; screen-space overlays below
    return z;
  }

  function snap(c, t) {
    const lt = t - 30;
    c.fillStyle = CREAM; c.fillRect(0, 0, 1080, 1920);
    c.save(); c.translate(540, 960); c.rotate(-0.5); c.fillStyle = PAPER; c.fillRect(-1400, -900, 2800, 260); c.restore();
    if (lt < 2.6) { // true proportions
      const a = fade(t, 30.35, 32.6, 0.25);
      c.save(); c.globalAlpha = a;
      banner(c, ['True speed.'], 330, 96, 1, { skew: -0.04 });
      c.fillStyle = INK; c.fillRect(90, 880, 900, 90);
      c.fillStyle = GREEN; c.fillRect(972, 862, 18, 126);
      c.fillStyle = RED; c.fillRect(90, 850, 3, 150);
      c.font = `48px "${HAND}"`; c.textAlign = 'left'; c.fillStyle = RED; c.fillText('the dark: too thin to see', 96, 820);
      c.fillStyle = INK; c.font = `46px "${HAND}"`; c.fillText('the whole bar: until the lasting fix', 96, 1060);
      c.textAlign = 'right'; c.fillStyle = '#1f7a45'; c.fillText('fix', 900, 1130);
      c.restore(); return;
    }
    // two lanes
    const la = L.sm(32.6, 32.9, t);
    c.save(); c.globalAlpha = la;
    const lane = (y0, title, ai) => {
      c.fillStyle = ai ? '#f3eee0' : PAPER; c.fillRect(90, y0, 900, 470); c.strokeStyle = INK; c.lineWidth = 6; c.strokeRect(90, y0, 900, 470);
      c.fillStyle = INK; c.fillRect(90, y0, 900, 76); c.font = `48px "${SERIF}"`; c.textAlign = 'left'; c.fillStyle = CREAM; c.fillText(title, 116, y0 + 55);
      // mini tower
      const tx = 130, tw = 190, fy = y0 + 100, fh = 22; c.fillStyle = INK; c.fillRect(tx - 8, fy - 8, tw + 16, fh * 14 + 16);
      for (let i = 0; i < 14; i++) { c.fillStyle = i === 0 ? (ai && lt > 4.0 ? rgbaG(0.9) : G2) : CREAM; c.fillRect(tx, fy + i * fh + 2, tw, fh - 4); }
      c.font = `30px "${HAND}"`; c.fillStyle = INK; c.textAlign = 'left'; c.fillText('control', tx + tw + 14, fy + 18); c.fillText('intake', tx + tw + 14, fy + 7 * fh + 16); c.fillText('records', tx + tw + 14, fy + 13 * fh + 16);
      // memo path
      const start = [tx + 40, fy + 7 * fh + 10];
      const path = ai ? [start, [tx + 40, fy + 10]] : [start, [tx + 150, fy + 7 * fh + 10], [tx + 150, fy + 10 * fh + 10], [tx + 60, fy + 10 * fh + 10], [tx + 60, fy + 13 * fh + 10]];
      const dur = ai ? 1.0 : 2.6; const f = L.clamp((lt - 3.0) / dur, 0, 1);
      let tot = 0; const segL = []; for (let i = 1; i < path.length; i++) { const l = Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]); segL.push(l); tot += l; }
      let rem = f * tot; c.strokeStyle = ai ? GREEN : G1; c.lineWidth = 6; c.setLineDash(ai ? [] : [12, 10]); c.beginPath(); c.moveTo(...path[0]); let pos = path[0];
      for (let i = 1; i < path.length; i++) { const l = segL[i - 1]; const g = Math.min(1, rem / l); pos = [L.lerp(path[i - 1][0], path[i][0], g), L.lerp(path[i - 1][1], path[i][1], g)]; c.lineTo(...pos); rem -= l; if (rem <= 0) break; }
      c.stroke(); c.setLineDash([]); memo(c, pos[0], pos[1], 2.1, 0, 0);
      // log strip: red at seconds (unchanged), steel at years (unchanged)
      const sx0 = 420, sx1 = 960, sy = y0 + 250;
      c.strokeStyle = INK; c.lineWidth = 4; c.beginPath(); c.moveTo(sx0, sy); c.lineTo(sx1, sy); c.stroke();
      c.fillStyle = RED; c.fillRect(sx0, sy - 34, L.lerp(0, sx1 - sx0, Math.log10(COL_S) / RMAX), 68);
      c.fillStyle = GREEN; c.fillRect(sx1 - 16, sy - 44, 16, 88);
      c.font = `44px "${HAND}"`; c.textAlign = 'left'; c.fillStyle = RED; c.fillText('the red', sx0, sy - 50);
      c.textAlign = 'right'; c.fillStyle = '#1f7a45'; c.fillText('steel: years', sx1 - 4, sy + 90);
      if (ai) { const ok = L.sm(34.1, 34.4, t); c.save(); c.globalAlpha = ok * la; c.fillStyle = '#1f7a45'; c.textAlign = 'left'; c.font = `46px "${HAND}"`; c.fillText('warned before the red', sx0, y0 + 430); c.restore(); }
      else { const ok = L.sm(35.7, 36.0, t); c.save(); c.globalAlpha = ok * la; c.fillStyle = INK; c.textAlign = 'left'; c.font = `46px "${HAND}"`; c.fillText('filed. never reached control', sx0, y0 + 430); c.restore(); }
    };
    lane(300, 'As it happened', false);
    lane(820, 'AI-routed warning', true);
    c.font = `50px "${HAND}"`; c.textAlign = 'left'; c.fillStyle = CREAM; c.fillText('(illustrative)', 530, 874);
    c.restore();
    c.save(); c.globalAlpha = L.sm(34.6, 34.9, t); c.font = `50px "${SERIF}"`; c.textAlign = 'center'; c.fillStyle = INK; c.fillText('Operators still decide.', 490, 1360); c.fillText('Steel still takes years.', 490, 1430); c.restore();
  }

  function finalClose(c, t) {
    const lt = t - 37.6;
    c.fillStyle = CREAM; c.fillRect(0, 0, 1080, 1920);
    c.save(); c.translate(540, 960); c.rotate(-0.5); c.fillStyle = INK; c.fillRect(-1400, 250, 2800, 150); c.restore();
    const z = 1 + lt * 0.04; c.save(); c.translate(540, 1000); c.scale(z, z); c.translate(-540, -1000);
    const jx = (L.noise(t * 1.1, 2) - 0.5) * 10;
    bean(c, 540 + jx, 300, 9, { col: G1, mood: 'grave', look: [0, 1] });
    c.strokeStyle = G1; c.lineWidth = 70; c.lineCap = 'round'; c.beginPath(); c.moveTo(250, 1500); c.lineTo(420, 1080); c.moveTo(830, 1500); c.lineTo(680, 1080); c.stroke();
    memo(c, 550 + jx, 1000, 22, 4, -0.06);
    c.restore();
    banner(c, ['This is the bottleneck.'], 330, 88, fade(t, 37.8, 40.1, 0.3), { skew: -0.04 });
  }

  // ---------------- main ----------------
  function draw(c, t) {
    c.fillStyle = CHAR; c.fillRect(0, 0, 1080, 1920);
    if (t < 1.4) { coldOpen(c, t); L.slate(c, 'SC1  CLOSE  COLD OPEN  handheld'); }
    else if (t < 30) {
      const tw = t < 30 && t > 29.9 ? 29.9 : t;
      const z = worldShot(c, tw);
      // stamps (screen)
      stamp(c, 'RECEIVED', 560, 560, -0.12, fade(t, 2.2, 3.6, 0.1) * L.sm(2.2, 2.4, t) * 2);
      stamp(c, 'OTHER FLOOR', 540, 560, 0.08, fade(t, 4.8, 6.1, 0.1) * L.sm(4.8, 5.0, t) * 2);
      stamp(c, 'WRONG FLOOR', 540, 560, -0.1, fade(t, 7.7, 8.7, 0.1) * L.sm(7.7, 7.9, t) * 2);
      stamp(c, 'FILED', 560, 560, 0.1, fade(t, 10.0, 10.95, 0.1) * L.sm(10.0, 10.2, t) * 2);
      banner(c, ['Earlier that night.'], 300, 64, fade(t, 1.4, 2.2, 0.2), { skew: -0.03 });
      lowerThird(c, 'Stamped it received. Promptly.', '— intake, night shift', fade(t, 2.3, 3.7, 0.25));
      lowerThird(c, 'Right form. Wrong floor.', '— routing', fade(t, 4.6, 6.2, 0.25));
      lowerThird(c, 'Not our floor. Sent it down.', '— the other floor', fade(t, 7.3, 8.8, 0.25));
      lowerThird(c, "It's filed. Extremely safe.", '— records', fade(t, 9.6, 11.0, 0.25));
      banner(c, [{ text: 'Who was it actually for?', font: SERIF }], 1320, 66, fade(t, 11.0, 12.9, 0.3), { bg: CREAM, col: INK, skew: 0.03 });
      banner(c, ['The grid fell', { text: 'in 90 seconds.', col: RED }], 290, 90, fade(t, 15.4, 18.2, 0.35));
      banner(c, ['The lasting fix', { text: 'took 7 years.', col: GREEN }], 290, 90, fade(t, 22.9, 24.6, 0.3));
      ruler(c, t, fade(t, 12.9, 24.3, 0.4));
      lowerThird(c, 'It reached every desk but one.', '— intake, night shift', fade(t, 25.8, 27.9, 0.3));
      if (t > 27.6) { c.fillStyle = `rgba(22,21,20,${(0.55 * L.sm(27.6, 28.0, t)).toFixed(3)})`; c.fillRect(0, 0, 1080, 1920); }
      L.title(c, ['We slowed it down', 'so you could see it.'], 640, 92, { alpha: fade(t, 27.9, 29.9, 0.3) });
      const sl = t < 3.6 ? 'SC2  CLOSE  HANDHELD' : t < 10.9 ? 'SC2  HANDHELD CHASE' : t < 13 ? 'SC3  CRANE UP' : t < 24.2 ? 'SC3  WIDE' : 'SC4  DOLLY IN';
      L.slate(c, sl);
    }
    else if (t < 37.6) { snap(c, t); if (t < 30.35) { c.fillStyle = INK; c.fillRect(0, 0, 1080, 1920); } L.slate(c, 'SC5  SNAP  flat'); }
    else if (t < 40) { finalClose(c, t); L.slate(c, 'SC6  EXTREME CLOSE'); }
    else { L.endCard(c, L.sm(40, 40.5, t)); }
    L.grain(c, t, { alpha: 0.05 });
  }

  return {
    draw, DUR,
    acts: [{ start: 0, end: 11, bpm: 96 }, { start: 11, end: 30, bpm: 0, drone: true }, { start: 30.35, end: 37.6, bpm: 0, drone: true }, { start: 37.6, end: 44, bpm: 0, drone: true }],
    cues: [{ t: 0, type: 'hit' }, { t: 2.2, type: 'stamp' }, { t: 4.8, type: 'stamp' }, { t: 7.7, type: 'stamp' }, { t: 10.0, type: 'stamp' }, { t: 12.9, type: 'whoosh' },
      { t: 13.2, type: 'bonk' }, { t: 30.0, type: 'hit' }, { t: 33.8, type: 'ding' }, { t: 37.6, type: 'pop' }]
  };
}
if (typeof module !== 'undefined') module.exports = makeScene;
