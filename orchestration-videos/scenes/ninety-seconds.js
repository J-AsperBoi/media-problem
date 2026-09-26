// ninety-seconds: wait-for-it, topographic map, cosmos. Analog: quebec-1989.
// One stated mapping (log time): event seconds E = 10^((t - 3) / 2) for 3 <= t <= 20.3 (every 2 film s, 10x more real time).
// Red = analog threat.points (0 -> 1 over 90 s, linear in event time); restore = threat.events (83% at 9 h).
// Green = 5 analog fragments; loop edges arrive at L.lognormalQuantile(q, median 759 h [modelled, never shown], p90 64000 h).
// AI snap = ai_counterfactual (~1 h routing of an existing warning), labeled illustrative. See output/ninety-seconds/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('quebec-1989');
  const DUR = 40, RED = L.RED, GREEN = L.GREEN;
  const BG = '#0d1118', INK = '#e8e4da', DIM = '#7c828c', PALE = '#d9d3c3';
  const rgbaG = a => `rgba(52,210,123,${a})`, rgbaR = a => `rgba(255,59,48,${a})`, rgbaW = a => `rgba(232,228,218,${a})`;

  // ---------------- time mapping ----------------
  const TA = 3, SPD = 2, TSTOP = 20.3;
  const E = t => t < TA ? 0 : Math.pow(10, (Math.min(t, TSTOP) - TA) / SPD); // event seconds
  const tOfE = e => TA + SPD * Math.log10(e);
  const COL_S = A.threat.points[1].t * 3600;               // 90 s
  const RST = A.threat.events.find(e => e.t === 9);        // 9 h, 83%
  const RST_S = RST.t * 3600;
  const collapse = e => L.clamp(e / COL_S, 0, 1);
  const restored = e => e <= COL_S ? 0 : e <= RST_S ? 0.83 * (e - COL_S) / (RST_S - COL_S) : 0.83 + 0.17 * L.clamp((e - RST_S) / (86400 - RST_S), 0, 1); // tail to 24 h is an assumption
  const isDark = (d, e) => d < collapse(e) && d < 1 - restored(e);

  // ---------------- map geometry (map space ~1080x1920) ----------------
  const C = { x: 520, y: 1000 };
  const RX = 360, RY = 560;
  const rF = a => 1 + 0.12 * Math.sin(3 * a + 1) + 0.07 * Math.sin(5 * a + 2) + 0.04 * Math.sin(8 * a);
  const inside = (x, y) => { const dx = (x - C.x) / RX, dy = (y - C.y) / RY; return Math.hypot(dx, dy) < rF(Math.atan2(dy, dx)); };
  const bpt = (a, k = 1) => ({ x: C.x + Math.cos(a) * RX * rF(a) * k, y: C.y + Math.sin(a) * RY * rF(a) * k });
  const ORIGIN = { x: C.x + 40, y: C.y - 470 };
  const h = (x, y) => Math.sin(x * 0.006 + 1.3) * Math.cos(y * 0.0042) + 0.6 * Math.sin((x + y) * 0.009) + 0.45 * Math.sin(x * 0.013 + Math.sin(y * 0.011) * 2.2) + 0.3 * Math.cos(y * 0.017 - x * 0.004);
  // marching squares -> segments with distance from origin
  const CELL = 16, X0 = 100, Y0 = 380, NX = 56, NY = 80, LEV = 13;
  const grid = []; let hmin = 1e9, hmax = -1e9;
  for (let j = 0; j <= NY; j++) { grid[j] = []; for (let i = 0; i <= NX; i++) { const v = h(X0 + i * CELL, Y0 + j * CELL); grid[j][i] = v; hmin = Math.min(hmin, v); hmax = Math.max(hmax, v); } }
  const segs = []; let dmax = 0;
  for (let k = 1; k < LEV; k++) { const lv = hmin + (hmax - hmin) * k / LEV;
    for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
      const x = X0 + i * CELL, y = Y0 + j * CELL; if (!inside(x + CELL / 2, y + CELL / 2)) continue;
      const v = [grid[j][i], grid[j][i + 1], grid[j + 1][i + 1], grid[j + 1][i]];
      const P = [[x, y], [x + CELL, y], [x + CELL, y + CELL], [x, y + CELL]];
      const pts = [];
      for (let e = 0; e < 4; e++) { const a = v[e], b = v[(e + 1) % 4]; if ((a < lv) !== (b < lv)) { const f = (lv - a) / (b - a); const p = P[e], q = P[(e + 1) % 4]; pts.push([p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f]); } }
      for (let s = 0; s + 1 < pts.length; s += 2) { const [a, b] = [pts[s], pts[s + 1]]; const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2; const d = Math.hypot(mx - ORIGIN.x, my - ORIGIN.y); dmax = Math.max(dmax, d); segs.push({ a, b, d, major: k % 4 === 0 }); }
    } }
  segs.forEach(s => s.d /= dmax);
  // town lights (population): denser in the south
  const r = L.rng(1989); const lights = [];
  while (lights.length < 90) { const x = 140 + r() * 800, y = 480 + r() * 1100; if (!inside(x, y)) continue; if (r() > 0.25 + 0.75 * (y - 480) / 1100) continue; if (lights.some(l => Math.hypot(l.x - x, l.y - y) < 42)) continue;
    lights.push({ x, y, d: Math.min(1, Math.hypot(x - ORIGIN.x, y - ORIGIN.y) / dmax), s: 2 + r() * 3 }); }
  const TOWN = lights.reduce((b, l) => Math.hypot(l.x - 470, l.y - 1440) < Math.hypot(b.x - 470, b.y - 1440) ? l : b);
  TOWN.s = 6;
  // fragments around the province (loop order), and their edges' arrival times
  const FR = A.solution.fragments; const byId = {}; FR.forEach(f => byId[f.id] = f);
  const loop = [
    { id: 'f3', lbl: 'engineers', a: 1.05 }, { id: 'f4', lbl: 'line crews', a: 2.15 }, { id: 'f2', lbl: 'scientists', a: -2.75 },
    { id: 'f1', lbl: 'forecasters', a: -1.55 }, { id: 'f5', lbl: 'planners', a: -0.25 }];
  loop.forEach(n => Object.assign(n, bpt(n.a, 0.78)));
  const MED = A.solution.aggregation.median, P10 = A.solution.aggregation.p10, P90 = A.solution.aggregation.p90;
  const edges = loop.map((n, i) => { const q = (i + 0.5) / loop.length; const hrs = L.lognormalQuantile(q, MED, P90);
    return { a: n, b: loop[(i + 1) % loop.length], hrs, t: tOfE(hrs * 3600), a0: n.a, a1: loop[(i + 1) % loop.length].a }; });
  edges.forEach(e => { let a1 = e.a1; while (a1 < e.a0) a1 += Math.PI * 2; e.a1 = a1; });
  const RING_T = edges[edges.length - 1].t; // lasting fix (~7 yr)
  const arcPts = (a0, a1, f) => { const out = []; const n = 28; for (let i = 0; i <= n; i++) { const a = a0 + (a1 - a0) * f * i / n; const p = bpt(a, 0.78); out.push([p.x, p.y]); } return out; };

  // ---------------- camera: level 0 = street close, 1 = province, >1 = higher, <0 = closer ----------------
  const levKeys = [[0, 0], [1.6, 0], [5.6, 1], [12.5, 1], [21.5, 1.35], [24.6, 1.35]];
  const levDrop = [[31.4, 1], [33.6, -0.45], [36, -0.62]];
  const lev = t => t < 31.4 ? L.key(levKeys, t) : L.key(levDrop, t);
  const ZMAX = 40;
  function mapCam(l) {
    const ZW = 0.86, CYW = C.y + 60;
    if (l <= 1) { const ll = Math.max(0, l); const Z = Math.pow(ZMAX, 1 - ll) * Math.pow(ZW, ll); const u = (1 / Z - 1 / ZMAX) / (1 / ZW - 1 / ZMAX);
      return { Z, cx: L.lerp(TOWN.x, C.x, u), cy: L.lerp(TOWN.y, CYW, u) }; }
    return { Z: ZW * Math.pow(0.55, (l - 1) / 0.35), cx: C.x, cy: CYW - (l - 1) * 300 };
  }
  const toS = (cam, p) => ({ x: 540 + (p.x - cam.cx) * cam.Z, y: 960 + (p.y - cam.cy) * cam.Z });

  // ---------------- helpers ----------------
  const fade = (t, a, b, f = 0.35) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));
  function card(ctx, lines, y, size, a) {
    if (a <= 0.001) return; ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center'; let yy = y;
    lines.forEach((l, i) => { const o = typeof l === 'string' ? { text: l } : l; let fz = o.size || size; ctx.font = `${fz}px "${SERIF}"`;
      while (ctx.measureText(o.text).width > 780 && fz > 30) { fz -= 4; ctx.font = `${fz}px "${SERIF}"`; }
      if (i) yy += fz * 1.06; ctx.lineJoin = 'round'; ctx.lineWidth = fz * 0.16; ctx.strokeStyle = BG; ctx.strokeText(o.text, 490, yy);
      ctx.fillStyle = o.col || '#fffdf7'; ctx.fillText(o.text, 490, yy); });
    ctx.restore();
  }
  function glowDot(ctx, x, y, rad, col, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a;
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad * 4); g.addColorStop(0, col.replace('A', '0.55')); g.addColorStop(1, col.replace('A', '0'));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rad * 4, 0, 7); ctx.fill(); ctx.fillStyle = col.replace('A', '1'); ctx.beginPath(); ctx.arc(x, y, rad, 0, 7); ctx.fill(); ctx.restore(); }
  const GC = 'rgba(52,210,123,A)', RC = 'rgba(255,59,48,A)', WC = 'rgba(232,228,218,A)';
  function slate(ctx, s) { L.slate(ctx, s); }

  // aurora: gray curtains (desaturated), in screen space of a layer
  function aurora(ctx, t, x0, x1, ytop, ybot, a, seed = 1) {
    if (a <= 0) return; ctx.save();
    for (let i = 0; i < 46; i++) { const f = i / 45; const x = L.lerp(x0, x1, f) + Math.sin(t * 0.35 + f * 5 + seed) * 30;
      const k = L.noise(f * 7 + t * 0.4, seed) * (0.5 + 0.5 * Math.sin(f * 9 + t * 0.6));
      const top = ytop + Math.sin(f * 4 + t * 0.3 + seed) * 50; const g = ctx.createLinearGradient(0, top, 0, ybot);
      g.addColorStop(0, `rgba(200,205,210,0)`); g.addColorStop(0.35, `rgba(205,210,214,${0.20 * k * a})`); g.addColorStop(1, 'rgba(200,205,210,0)');
      ctx.fillStyle = g; ctx.fillRect(x - 16, top, 32, ybot - top); }
    ctx.restore();
  }

  // ---------------- STREET (layer, street space 1080x1920) ----------------
  const sr = L.rng(7);
  const flakes = []; for (let i = 0; i < 170; i++) flakes.push({ x: sr() * 1080, y: sr() * 1920, v: 40 + sr() * 70, w: sr() * 6, s: 2 + sr() * 3.5 });
  const farWin = []; for (let i = 0; i < 26; i++) farWin.push({ x: 40 + (i % 13) * 80 + sr() * 10, y: 760 + Math.floor(i / 13) * 70, fig: sr() < 0.5, d: 0.75 + sr() * 0.25 });
  const pylon = { x: 860, y: 470 };
  function wirePt(f) { // wire from pylon (right) to pole (left)
    const x = L.lerp(pylon.x, 60, f), y = L.lerp(pylon.y + 20, 600, f) + Math.sin(f * Math.PI) * 60; return [x, y]; }
  function street(ctx, t, e, closeness) {
    const dark = isDark(TOWN.d, e);
    // sky
    const g = ctx.createLinearGradient(0, 0, 0, 900); g.addColorStop(0, '#0b0e14'); g.addColorStop(1, '#1b212b');
    ctx.fillStyle = g; ctx.fillRect(-2000, -2000, 5080, 2900);
    aurora(ctx, t, 0, 1080, 120, 760, 1, 2);
    // pylon + wire
    ctx.strokeStyle = '#5a606a'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(pylon.x - 40, 720); ctx.lineTo(pylon.x, pylon.y); ctx.lineTo(pylon.x + 40, 720); ctx.moveTo(pylon.x - 30, 560); ctx.lineTo(pylon.x + 30, 560); ctx.stroke();
    ctx.strokeStyle = '#6a707a'; ctx.lineWidth = 3; ctx.beginPath(); for (let i = 0; i <= 30; i++) { const [x, y] = wirePt(i / 30); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke();
    // red at the edge: glint on the pylon, then a pulse running down the wire as the collapse starts
    const glint = 0.55 + 0.45 * Math.sin(t * 5);
    glowDot(ctx, pylon.x, pylon.y, 11, RC, glint);
    const c = collapse(e); if (c > 0) { const f = L.clamp(c * 1.4, 0, 1); ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.beginPath(); for (let i = 0; i <= 30 * f; i++) { const [x, y] = wirePt(i / 30); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
    // far buildings row
    ctx.fillStyle = '#171c24'; ctx.fillRect(-2000, 720, 5080, 1300);
    farWin.forEach(w => { const on = !isDark(Math.max(0, TOWN.d - (1 - w.d) * 0.05), e);
      ctx.fillStyle = on ? '#b8b09c' : '#20262f'; ctx.fillRect(w.x, w.y, 44, 50);
      if (on && w.fig) { ctx.fillStyle = '#3a3f48'; ctx.beginPath(); ctx.arc(w.x + 22, w.y + 24, 8, 0, 7); ctx.fill(); ctx.fillRect(w.x + 12, w.y + 34, 20, 16); } });
    // snow line on roofs
    ctx.fillStyle = '#cfd3d8'; ctx.fillRect(-2000, 716, 5080, 8);
    // main facade
    ctx.fillStyle = '#232932'; ctx.fillRect(-2000, 900, 5080, 1100);
    // side windows (crowd)
    [[90, 1000], [800, 1000], [90, 1330], [800, 1330]].forEach(([x, y], i) => { const on = !dark;
      ctx.fillStyle = on ? '#a9a291' : '#191e26'; ctx.fillRect(x, y, 190, 240); ctx.strokeStyle = '#3c424c'; ctx.lineWidth = 8; ctx.strokeRect(x, y, 190, 240);
      L.stick(ctx, x + 95, y + 230, 1.1, { mood: 'awe', col: on ? '#3b4049' : '#2a3039', look: [0, -1], seed: 20 + i, pose: { armL: 0.2, armR: 0.2 } });
      ctx.fillStyle = '#d5d9de'; ctx.fillRect(x - 10, y + 236, 210, 12); });
    // main window
    const wx = 320, wy = 800, ww = 440, wh = 480;
    ctx.fillStyle = dark ? '#161b22' : '#c9c1ab'; ctx.fillRect(wx, wy, ww, wh);
    if (!dark) { const lg = ctx.createRadialGradient(540, 960, 30, 540, 960, 380); lg.addColorStop(0, 'rgba(255,250,235,0.35)'); lg.addColorStop(1, 'rgba(255,250,235,0)'); ctx.fillStyle = lg; ctx.fillRect(wx, wy, ww, wh); }
    // person: head at ~ (540, 960)
    const col = '#2b3038';
    const hd = L.stick(ctx, 540, 1215, 2.6, { mood: 'awe', col, look: [0.3, -1], seed: 5, pose: { armL: 0.35, armR: 2.2, lean: 0.05 } }).head;
    // readable face: pale features over the dark head
    ctx.fillStyle = '#e8e4da'; [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(hd[0] + d * 21 + 3, hd[1] - 12, 9, 0, 7); ctx.fill(); });
    ctx.strokeStyle = '#e8e4da'; ctx.lineWidth = 6; ctx.beginPath(); ctx.ellipse(hd[0] + 2, hd[1] + 24, 9, 12, 0, 0, 7); ctx.stroke();
    ctx.lineWidth = 5; [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(hd[0] + d * 30 + 3, hd[1] - 32); ctx.lineTo(hd[0] + d * 12 + 3, hd[1] - 36 + (t > 31.4 ? 4 : 0)); ctx.stroke(); });
    // green page in right hand
    const hx = 540 + 0.05 * 30 * 2.6 + Math.cos(Math.PI / 2 - 2.2) * 46 * 2.6, hy = 1215 - 60 * 2.6 + 8 * 2.6 + Math.sin(Math.PI / 2 - 2.2) * 46 * 2.6;
    ctx.save(); ctx.translate(hx + 10, hy - 30); ctx.rotate(-0.15);
    const pg = ctx.createRadialGradient(0, 0, 10, 0, 0, 140); pg.addColorStop(0, rgbaG(0.35)); pg.addColorStop(1, rgbaG(0)); ctx.fillStyle = pg; ctx.fillRect(-140, -140, 280, 280);
    ctx.fillStyle = GREEN; ctx.fillRect(-38, -50, 76, 100); ctx.fillStyle = 'rgba(13,17,24,0.55)'; for (let k = 0; k < 5; k++) ctx.fillRect(-28, -38 + k * 16, 56 - (k % 2) * 16, 5);
    if (closeness > 0) { ctx.globalAlpha = closeness; ctx.fillStyle = GREEN; ctx.fillRect(-38, -50, 76, 100); ctx.strokeStyle = BG; ctx.lineWidth = 5; ctx.beginPath();
      for (let i = 0; i <= 40; i++) { const a = i / 40 * Math.PI * 2; const x = Math.cos(a) * 24 * rF(a), y = Math.sin(a) * 34 * rF(a); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.closePath(); ctx.stroke(); }
    ctx.restore();
    // window frame + sill snow
    ctx.strokeStyle = '#3c424c'; ctx.lineWidth = 14; ctx.strokeRect(wx, wy, ww, wh); ctx.beginPath(); ctx.moveTo(540, wy); ctx.lineTo(540, wy + 150); ctx.stroke();
    ctx.fillStyle = '#dde1e5'; ctx.beginPath(); ctx.ellipse(540, wy + wh + 8, 250, 18, 0, 0, 7); ctx.fill();
    // street + lamp
    ctx.fillStyle = '#c9cdd2'; ctx.fillRect(-2000, 1640, 5080, 900);
    ctx.fillStyle = '#b3b8be'; for (let i = 0; i < 9; i++) ctx.fillRect(i * 140 - 30, 1700 + (i % 3) * 40, 90, 6);
    ctx.strokeStyle = '#3c424c'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(960, 1720); ctx.lineTo(960, 1320); ctx.lineTo(900, 1300); ctx.stroke();
    if (!dark) glowDot(ctx, 900, 1310, 12, 'rgba(236,230,212,A)', 1);
    // snowfall
    ctx.fillStyle = 'rgba(236,238,240,0.85)';
    flakes.forEach(f => { const y = (f.y + t * f.v) % 1920, x = f.x + Math.sin(t * 0.8 + f.w) * 14; ctx.beginPath(); ctx.arc(x, y, f.s, 0, 7); ctx.fill(); });
  }

  // ---------------- MAP (layer) ----------------
  const stars = []; const st = L.rng(33); for (let i = 0; i < 160; i++) stars.push({ x: st() * 1080, y: st() * 1920, s: 1 + st() * 2.2, p: st() * 6 });
  function map(ctx, t, e, cam, l) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    const high = L.sm(1.02, 1.3, l);
    if (high > 0) { ctx.save(); ctx.globalAlpha = high; stars.forEach(s => { ctx.fillStyle = rgbaW(0.35 + 0.25 * Math.sin(t + s.p)); ctx.fillRect(s.x, s.y, s.s, s.s); }); ctx.restore(); }
    ctx.save(); ctx.translate(540, 960); ctx.scale(cam.Z, cam.Z); ctx.translate(-cam.cx, -cam.cy);
    const px = 1 / cam.Z;
    // planet disc (visible when high)
    ctx.fillStyle = '#131820'; ctx.beginPath(); ctx.arc(C.x, C.y + 2600, 3200, 0, 7); ctx.fill();
    ctx.strokeStyle = rgbaW(0.25 * high); ctx.lineWidth = 3 * px; ctx.stroke();
    // province
    ctx.beginPath(); for (let i = 0; i <= 120; i++) { const p = bpt(i / 120 * Math.PI * 2); i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y); } ctx.closePath();
    ctx.fillStyle = '#181e27'; ctx.fill(); ctx.strokeStyle = rgbaW(0.55); ctx.lineWidth = 3 * px; ctx.stroke();
    // contours: gray, then red where dark, then a bright front
    const c = collapse(e), rs = restored(e);
    ctx.lineCap = 'round';
    const pathSeg = (flt) => { ctx.beginPath(); for (const s of segs) if (flt(s)) { ctx.moveTo(s.a[0], s.a[1]); ctx.lineTo(s.b[0], s.b[1]); } ctx.stroke(); };
    ctx.strokeStyle = 'rgba(160,166,176,0.32)'; ctx.lineWidth = 1.6 * px; pathSeg(s => !s.major && !isDark(s.d, e));
    ctx.strokeStyle = 'rgba(190,196,204,0.5)'; ctx.lineWidth = 2.6 * px; pathSeg(s => s.major && !isDark(s.d, e));
    if (c > 0) {
      ctx.strokeStyle = rgbaR(0.8); ctx.lineWidth = 2.4 * px; pathSeg(s => isDark(s.d, e));
      if (c < 1) { ctx.strokeStyle = '#ffd0cc'; ctx.lineWidth = 4 * px; pathSeg(s => Math.abs(s.d - c) < 0.025); ctx.strokeStyle = RED; ctx.lineWidth = 7 * px; ctx.globalAlpha = 0.5; pathSeg(s => Math.abs(s.d - c) < 0.05); ctx.globalAlpha = 1; }
    }
    // town lights
    lights.forEach(li => { const on = !isDark(li.d, e); const rr = li.s * px * Math.max(1, cam.Z < 1 ? 1 : 1);
      if (on) glowDot(ctx, li.x, li.y, li.s * Math.min(1.6, 1 / Math.sqrt(cam.Z)), 'rgba(236,230,212,A)', 0.9);
      else { ctx.fillStyle = '#2a3039'; ctx.beginPath(); ctx.arc(li.x, li.y, li.s * 0.8, 0, 7); ctx.fill(); } });
    // TOWN ring marker (our street)
    const ta = L.sm(0.5, 0.9, l) * (1 - L.sm(1.1, 1.3, l));
    if (ta > 0) { ctx.strokeStyle = rgbaW(0.7 * ta); ctx.lineWidth = 2.5 * px; ctx.beginPath(); ctx.arc(TOWN.x, TOWN.y, 22 * px, 0, 7); ctx.stroke(); }
    // aurora oval (gray) above the province
    ctx.restore();
    // green fragments + edges (screen space for crisp sizes)
    const ga = L.sm(0.55, 0.95, l);
    if (ga > 0) {
      ctx.save(); ctx.globalAlpha = ga;
      edges.forEach(ed => {
        const pts = arcPts(ed.a0, ed.a1, 1).map(([x, y]) => toS(cam, { x, y }));
        // unconnected: faint dashed gray reach
        ctx.setLineDash([6, 14]); ctx.strokeStyle = rgbaW(0.22); ctx.lineWidth = 2.5; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke(); ctx.setLineDash([]);
        const f = L.ease.out(L.clamp((t - (ed.t - 0.6)) / 0.6, 0, 1));
        if (f > 0) { const gp = arcPts(ed.a0, ed.a1, f).map(([x, y]) => toS(cam, { x, y }));
          ctx.strokeStyle = rgbaG(0.35); ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); gp.forEach((p, i) => i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)); ctx.stroke();
          ctx.strokeStyle = GREEN; ctx.lineWidth = 6; ctx.stroke(); }
      });
      loop.forEach((n, i) => { const p = toS(cam, n); const pulse = 0.8 + 0.2 * Math.sin(t * 2.2 + i * 1.3);
        glowDot(ctx, p.x, p.y, 11 * pulse, GC, 1);
        const lx = L.clamp(p.x, 170, 810), ly = p.y + (n.y < C.y ? -26 : 48);
        ctx.save(); ctx.font = `36px "${HAND}"`; ctx.textAlign = 'center'; ctx.lineWidth = 7; ctx.strokeStyle = BG; ctx.lineJoin = 'round'; ctx.strokeText(n.lbl, lx, ly); ctx.fillStyle = PALE; ctx.fillText(n.lbl, lx, ly); ctx.restore(); });
      // ring closed: full green contour pulse
      const rc = L.sm(RING_T, RING_T + 0.5, t) * (1 - L.sm(24.2, 24.6, t) * 0);
      if (rc > 0) { ctx.globalAlpha = ga * rc * (0.5 + 0.5 * Math.sin((t - RING_T) * 4) ** 2); ctx.strokeStyle = GREEN; ctx.lineWidth = 3; ctx.beginPath();
        for (let i = 0; i <= 90; i++) { const q = toS(cam, bpt(i / 90 * Math.PI * 2, 0.9)); i ? ctx.lineTo(q.x, q.y) : ctx.moveTo(q.x, q.y); } ctx.closePath(); ctx.stroke(); }
      ctx.restore();
    }
    // gray aurora curtains over the map top (screen space, depends on camera height)
    const top = toS(cam, { x: C.x, y: C.y - RY * 1.1 });
    aurora(ctx, t, 60, 1020, top.y - 420 * Math.min(1, cam.Z), top.y + 40, 0.9 * L.sm(0.4, 0.9, l), 5);
  }

  // ---------------- log ruler (screen space) ----------------
  const RX0 = 110, RW = 740, RDEC = 8.6, RY_ = 1450;
  const rpos = s => RX0 + RW * L.clamp(Math.log10(Math.max(1, s)) / RDEC, 0, 1);
  const TICKS = [['second', 1], ['minute', 60], ['hour', 3600], ['day', 86400], ['month', 2.63e6], ['year', 3.156e7], ['decade', 3.156e8]];
  function ruler(ctx, t, a, { y = RY_, e = E(t), title = 'log time', pre = false, ai = false, animGreen = true } = {}) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = 'rgba(13,17,24,0.72)'; ctx.fillRect(RX0 - 40, y - 78, RW + 80, 140);
    ctx.strokeStyle = rgbaW(0.6); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(RX0, y); ctx.lineTo(RX0 + RW, y); ctx.stroke();
    ctx.font = `28px "${HAND}"`; ctx.textAlign = 'center';
    TICKS.forEach(([w, s], i) => { const x = rpos(s); ctx.strokeStyle = rgbaW(0.6); ctx.beginPath(); ctx.moveTo(x, y - 10); ctx.lineTo(x, y + 10); ctx.stroke(); ctx.fillStyle = rgbaW(0.75); ctx.fillText(w, x, y + 44 + (i % 2) * 0); });
    ctx.textAlign = 'left'; ctx.fillStyle = rgbaW(0.8); ctx.font = `30px "${HAND}"`; ctx.fillText(title, RX0 - 20, y - 44);
    // red span
    if (e > 0) { const x1 = rpos(Math.min(e, COL_S)); ctx.fillStyle = RED; ctx.fillRect(RX0, y - 7, x1 - RX0, 14); }
    // green: restoration tick and edge ticks
    edges.forEach(ed => { const s = ed.hrs * 3600; if (e >= s || !animGreen) { const x = rpos(s); ctx.fillStyle = GREEN; ctx.fillRect(x - 4, y - 24, 8, 34); } });
    // marker
    if (!pre && e > 0) { const x = rpos(e); ctx.fillStyle = '#fffdf7'; ctx.beginPath(); ctx.moveTo(x, y - 16); ctx.lineTo(x - 11, y - 34); ctx.lineTo(x + 11, y - 34); ctx.fill(); }
    ctx.restore();
  }

  // ---------------- SNAP ----------------
  function snapScene(ctx, t) {
    const lt = t - 24.6;
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    // faint map ghost
    ctx.save(); ctx.globalAlpha = 0.08; ctx.strokeStyle = INK; ctx.lineWidth = 1.5; const cam = { Z: 1, cx: C.x, cy: C.y }; ctx.beginPath(); segs.forEach((s, i) => { if (i % 2) return; ctx.moveTo(s.a[0], s.a[1]); ctx.lineTo(s.b[0], s.b[1]); }); ctx.stroke(); ctx.restore();
    if (lt < 2.8) {
      // true proportions: linear bar over the ~7 years to the lasting fix
      card(ctx, ['At true proportions.'], 380, 92, fade(t, 24.7, 27.4, 0.25));
      const y = 820, x0 = 110, w = 760, f = L.ease.inOut(L.clamp((lt - 0.4) / 1.6, 0, 1));
      ctx.fillStyle = rgbaW(0.12); ctx.fillRect(x0, y - 16, w, 32);
      ctx.fillStyle = rgbaW(0.45); ctx.fillRect(x0, y - 16, w * f, 32);
      // the dark: 90 s of ~7 yr = 0.0003 px -> drawn as a 2 px hairline
      ctx.fillStyle = RED; ctx.fillRect(x0, y - 60, 2, 120);
      L.label(ctx, 'the dark: too thin to see', x0 - 4, y - 80, 36, { col: rgbaW(0.85), align: 'left' });
      if (f >= 1) { glowDot(ctx, x0 + w, y, 14, GC, 1); L.label(ctx, 'the lasting fix', x0 + w - 10, y + 80, 36, { col: rgbaW(0.85), align: 'right' }); }
      L.label(ctx, 'linear time', x0, y + 80, 30, { col: rgbaW(0.6), align: 'left' });
      return;
    }
    // side by side (stacked): as it happened vs AI-routed warning (illustrative)
    const k = lt - 2.8, a2 = L.sm(0, 0.3, k), aB = L.sm(0.9, 1.3, k);
    card(ctx, ['Same pieces, routed first.'], 330, 84, fade(t, 27.6, 31.4, 0.3));
    const row = (y, label, sub, ai, a) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
      L.label(ctx, label, 490, y - 150, 50, { col: '#fffdf7', font: SERIF }); if (sub) L.label(ctx, sub, 490, y - 108, 34, { col: GREEN });
      // pre-zone ("before")
      ctx.strokeStyle = rgbaW(0.35); ctx.setLineDash([8, 10]); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(RX0 - 20, y); ctx.lineTo(RX0 + 110, y); ctx.stroke(); ctx.setLineDash([]);
      L.label(ctx, 'before', RX0 + 45, y + 44, 28, { col: rgbaW(0.75) });
      const rx = RX0 + 150, rw = RW - 150; const pos = s => rx + rw * L.clamp(Math.log10(Math.max(1, s)) / RDEC, 0, 1);
      ctx.strokeStyle = rgbaW(0.6); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(rx, y); ctx.lineTo(rx + rw, y); ctx.stroke();
      ctx.font = `28px "${HAND}"`; ctx.textAlign = 'center';
      [['second', 1], ['hour', 3600], ['year', 3.156e7]].forEach(([w, s]) => { const x = pos(s); ctx.beginPath(); ctx.moveTo(x, y - 10); ctx.lineTo(x, y + 10); ctx.stroke(); ctx.fillStyle = rgbaW(0.75); ctx.fillText(w, x, y + 44); });
      ctx.fillStyle = RED; ctx.fillRect(rx, y - 8, pos(COL_S) - rx, 16);
      const gOn = s => { const x = pos(s); ctx.fillStyle = GREEN; ctx.fillRect(x - 4, y - 26, 8, 38); };
      gOn(edges[0].hrs * 3600); gOn(edges[4].hrs * 3600);
      // warning fragment: in pre-zone. Human: sits unconnected. AI: routed to the control room before the red.
      const wx = RX0 + 10;
      if (!ai) { glowDot(ctx, wx, y - 50, 9, GC, 1); ctx.setLineDash([5, 10]); ctx.strokeStyle = rgbaW(0.35); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(wx + 14, y - 50); ctx.lineTo(rx - 6, y - 50); ctx.stroke(); ctx.setLineDash([]);
        L.label(ctx, 'warning, unrouted', wx - 10, y - 66, 28, { col: rgbaW(0.7), align: 'left' }); }
      else { const f = L.ease.out(L.clamp((k - 1.3) / 0.5, 0, 1)); glowDot(ctx, wx, y - 50, 9, GC, 1);
        ctx.strokeStyle = GREEN; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(wx, y - 50); ctx.lineTo(L.lerp(wx, rx - 6, f), y - 50); ctx.stroke();
        if (f >= 1) glowDot(ctx, rx - 6, y - 50, 12, GC, 1);
        L.label(ctx, 'warning reaches operators', wx - 10, y - 66, 28, { col: rgbaW(0.85), align: 'left' }); }
      ctx.restore(); };
    row(760, 'As it happened', null, false, a2);
    row(1170, 'AI-routed warning', 'illustrative', true, aB);
    const nA = L.sm(1.9, 2.2, k); if (nA > 0) {
      L.label(ctx, 'Operators still decide.', 490, 1320, 40, { col: rgbaW(0.85), alpha: nA, font: SERIF });
      L.label(ctx, 'Steel still takes years.', 490, 1372, 40, { col: rgbaW(0.85), alpha: L.sm(2.5, 2.8, k), font: SERIF }); }
  }

  // ---------------- main ----------------
  function draw(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    if (t >= 24.6 && t < 31.4) { snapScene(ctx, t); slate(ctx, 'SC2  SNAP  FLAT'); L.grain(ctx, t, { alpha: 0.04, n: 300 }); return; }
    const l = lev(t), e = t < 31.4 ? E(t) : 0; // after the snap we return to an ordinary lit night (the present)
    const cam = mapCam(l);
    // map layer (full frame) under the street layer
    const sa = 1 - L.sm(0.12, 0.42, l);
    if (sa < 1) map(ctx, t, e, cam, l);
    if (sa > 0) {
      ctx.save(); ctx.globalAlpha = sa;
      const k = cam.Z / ZMAX; const tp = toS(cam, TOWN);
      if (l >= 0) { ctx.translate(tp.x, tp.y); ctx.scale(k, k); ctx.translate(-540, -960); }
      else { const zc = Math.pow(1.8, -l / 0.45); ctx.translate(540, 960); ctx.scale(zc, zc); ctx.translate(-540, -960 + 25 * Math.min(1, -l / 0.45)); }
      street(ctx, t, e, t > 31.4 ? L.sm(33.2, 34.2, t) : 0);
      ctx.restore();
    }
    // ruler
    const ra = L.sm(2.4, 3.0, t) * (1 - L.sm(21.6, 22.2, t));
    ruler(ctx, t, ra, { pre: t < TA });
    // cards
    card(ctx, ['Wait for it.'], 330, 120, fade(t, -1, 2.6, 0.3));
    card(ctx, ['Watch the green.'], 330, 100, fade(t, 2.8, 5.0, 0.3));
    card(ctx, ['A province went dark', 'in 90 seconds.'], 300, 92, fade(t, 7.0, 9.6, 0.3));
    card(ctx, ['The fix already existed.', { text: 'In pieces.', col: GREEN }], 300, 88, fade(t, 9.8, 12.3, 0.3));
    card(ctx, ['Lights back within hours.'], 300, 84, fade(t, 12.4, 14.4, 0.3));
    card(ctx, ['The pieces took longer.'], 300, 84, fade(t, 14.6, 16.8, 0.3));
    card(ctx, ['Months. Then years.'], 300, 88, fade(t, 17.0, 19.4, 0.3));
    card(ctx, ['The lasting fix took', '7 years.'], 300, 92, fade(t, 19.7, 22.0, 0.3));
    if (t > 22.0 && t < 24.6) { ctx.fillStyle = `rgba(13,17,24,${0.55 * L.sm(22.0, 22.4, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
    card(ctx, ['We slowed it down', 'so you could see it.'], 820, 92, fade(t, 22.1, 24.6, 0.3));
    if (t > 31.4) card(ctx, ['This is', 'the bottleneck.'], 330, 112, fade(t, 33.4, 36.1, 0.35));
    // slates
    if (t < 1.6) slate(ctx, 'SC1  CLOSE  HOLD'); else if (t < 5.6) slate(ctx, 'SC1  CRANE UP'); else if (t < 12.5) slate(ctx, 'SC1  WIDE  HOLD');
    else if (t < 21.5) slate(ctx, 'SC1  CRANE HIGHER'); else if (t < 24.6) slate(ctx, 'SC1  HOLD'); else if (t < 33.6) slate(ctx, 'SC3  DROP DOWN'); else slate(ctx, 'SC3  EXTREME CLOSE  PUSH');
    L.grain(ctx, t, { alpha: 0.04, n: 300 });
    if (t >= 36) L.endCard(ctx, L.sm(36, 36.4, t), { line: 'The bottleneck is us.' });
  }

  return { draw, DUR,
    acts: [{ start: 0, end: 24.6, bpm: 0, drone: true }, { start: 5.0, end: 7.0, bpm: 60 }, { start: 26.2, end: 31.4, bpm: 0, drone: true }, { start: 31.4, end: 40, bpm: 0, drone: true }],
    cues: [{ t: 1.6, type: 'whoosh' }, { t: 6.9, type: 'hit' }, { t: edges[0].t, type: 'ding' }, { t: RING_T, type: 'ding' }, { t: 24.6, type: 'hit' }, { t: 28.4, type: 'pop' }, { t: 31.4, type: 'whoosh' }, { t: 33.4, type: 'hit' }],
    _debug: { edges: edges.map(e => [e.hrs.toFixed(1), e.t.toFixed(2)]), town: TOWN, segs: segs.length, P10 } };
}
module.exports = makeScene;
