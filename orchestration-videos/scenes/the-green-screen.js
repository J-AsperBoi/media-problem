// the-green-screen: seamless-loop, embroidery, traffic, between nations. Analog: covid-2020.
// One mapping: race film t in [2.0, 17.6] -> day = (t - 2) * 36 (1 s = 36 days). Hook = flash-forward to day 300 of the same timeline.
// Red: 40 stations (1/40 of 234 countries each); station k reached when the sourced extent curve (s1, piecewise through weekly points) >= k/40.
// Green: knot day = max(343 [f7 first dose], lognormalQuantile(q, 421, 490)); the stitcher is q = 0.9 (day 490).
// Snap: ai_counterfactual median 363 (same shape, same floor), labeled illustrative. On-screen numbers: 421, 363.
// Loop: the tail (34.4-36) redraws the frame-1 shot at lt = t - DUR. See output/the-green-screen/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('covid-2020');
  const DUR = 36.0, RED = L.RED, GREEN = L.GREEN;
  const rgbaG = a => `rgba(52,210,123,${a})`, rgbaR = a => `rgba(255,59,48,${a})`;
  const TABLE = '#161513', LINEN = '#33312d', WEAVE = '#45423c', SATIN = '#6c6962', SATIN_BASE = '#4d4a45', OUTL = '#9a968e';
  const TAG = '#b9b4a8', TAGINK = '#5f5b54', CREAM = '#fffdf7', BODY = '#cfc9bc';

  // ---------------- time mapping ----------------
  const T0 = 2.0, DPS = 36, TFREEZE = 17.6, SPAN = 562;
  const dayAt = t => (t - T0) * DPS;
  const HOOK_DAY = 300;

  // ---------------- red: sourced extent curve ----------------
  const EXT = [[0, 1 / 234]].concat(A.threat.points.map(p => [p.t, p.extent]));
  const extent = d => { if (d <= 0) return EXT[0][1];
    for (let i = 0; i < EXT.length - 1; i++) if (d <= EXT[i + 1][0]) return L.lerp(EXT[i][1], EXT[i + 1][1], (d - EXT[i][0]) / (EXT[i + 1][0] - EXT[i][0]));
    return EXT[EXT.length - 1][1]; };
  const extentInv = r => { if (r <= EXT[0][1]) return 0;
    for (let i = 0; i < EXT.length - 1; i++) if (r <= EXT[i + 1][1]) return L.lerp(EXT[i][0], EXT[i + 1][0], (r - EXT[i][1]) / (EXT[i + 1][1] - EXT[i][1]));
    return Infinity; };

  // ---------------- green: sourced lognormal ----------------
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;          // 421, 490
  const FLOOR = A.solution.fragments.find(f => f.id === 'f7').ready_at;                 // 343
  const AIMED = A.ai_counterfactual.aggregation_median, AIP90 = AIMED * P90 / MED;      // 363, 422.5
  const cdfH = d => d < FLOOR ? 0 : L.lognormalCDF(d, MED, P90);
  const cdfA = d => d < FLOOR ? 0 : L.lognormalCDF(d, AIMED, AIP90);

  // ---------------- the map ----------------
  const PX = (lon, lat) => [540 + lon * 2.6, 990 - lat * 2.6];
  const CONT = [
    { d: 1, p: [[-165, 65], [-140, 70], [-95, 72], [-80, 62], [-60, 55], [-65, 45], [-80, 32], [-82, 25], [-97, 26], [-97, 18], [-88, 15], [-83, 9], [-78, 8], [-90, 13], [-105, 20], [-117, 32], [-125, 42], [-125, 50], [-140, 60], [-160, 58]] },
    { d: -1, p: [[-50, 60], [-20, 70], [-25, 82], [-60, 81], [-70, 76]] },
    { d: -1, p: [[-78, 8], [-60, 10], [-50, 0], [-35, -7], [-40, -22], [-55, -35], [-65, -42], [-70, -54], [-75, -45], [-72, -20], [-80, -5]] },
    { d: -1, p: [[-10, 36], [-9, 43], [-2, 48], [5, 55], [5, 62], [20, 70], [30, 70], [40, 65], [40, 45], [28, 41], [20, 40], [12, 38], [3, 43]] },
    { d: 1, p: [[-17, 15], [-10, 30], [0, 36], [10, 37], [33, 31], [43, 12], [51, 11], [40, -5], [40, -15], [33, -27], [20, -35], [15, -25], [12, -5], [8, 4], [-8, 5], [-17, 10]] },
    { d: 1, p: [[40, 45], [40, 65], [60, 70], [80, 73], [110, 76], [140, 72], [170, 68], [160, 60], [140, 55], [135, 43], [122, 40], [122, 30], [110, 20], [105, 10], [100, 2], [98, 15], [90, 22], [80, 8], [72, 20], [60, 25], [57, 23], [52, 17], [43, 12], [35, 33], [28, 41]] },
    { d: -1, p: [[114, -22], [122, -18], [132, -12], [142, -11], [153, -27], [146, -39], [135, -35], [115, -34]] },
    { d: 1, p: [[-5, 50], [1, 51], [-2, 56], [-6, 58], [-5, 54]] },
    { d: -1, p: [[130, 31], [141, 36], [142, 43], [139, 40], [132, 34]] },
    { d: 1, p: [[95, 5], [106, -6], [115, -8], [118, 2], [110, 2]] },
  ].map(c => { const pts = c.p.map(([lo, la]) => PX(lo, la)); const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]);
    return { dir: c.d, pts, bb: [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)] }; });
  const LL = [[114, 30], [127, 37], [139, 36], [121, 14], [101, 14], [106, -6], [78, 22], [67, 30], [53, 32], [45, 24],
    [35, 39], [37, 56], [13, 52], [2, 47], [-2, 53], [12, 43], [-4, 40], [18, 60], [22, 48], [31, 30],
    [3, 9], [38, 9], [37, -2], [25, -28], [-7, 33], [15, -12], [-100, 40], [-75, 40], [-120, 37], [-80, 50],
    [-100, 20], [-75, 5], [-47, -15], [-65, -33], [-75, -10], [145, -33], [172, -41], [90, 48], [-18, 64], [115, 4]];
  const N = LL.length, HERO = 22, ORIGIN = 0, UKI = 14;
  const ST = LL.map(([lo, la], i) => { const [x, y] = PX(lo, la); return { i, x, y }; });
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  const R = L.rng(2020);

  // red order: distance from the origin, hubs pulled earlier, jittered (illustrative geography; the share over time is the data)
  const HUBS = new Set([1, 2, 8, 12, 13, 14, 15, 16, 26, 27, 28]);
  const keyR = ST.map(s => s.i === ORIGIN ? -1 : dist(s, ST[ORIGIN]) * (HUBS.has(s.i) ? 0.4 : 1) * (0.7 + 0.6 * R()));
  let order = ST.map(s => s.i).sort((a, b) => keyR[a] - keyR[b]);
  const place = (idx, pos) => { order = order.filter(i => i !== idx); order.splice(pos, 0, idx); };
  place(25, 35); place(23, 32); place(21, 29); place(HERO, 26);   // hero last so it lands exactly at k = 26
  order.forEach((i, k) => { ST[i].rk = k; ST[i].rday = k === 0 ? 0 : extentInv(k / N); });
  ST.forEach(s => { if (s.rday === 0) return; if (!isFinite(s.rday)) return;
    const earlier = ST.filter(o => o.rday < s.rday);
    let p = null;
    if ([21, 23, 25].includes(s.i) && ST[HERO].rday < s.rday) p = ST[HERO];
    else if (R() < 0.3) { const hubs = earlier.filter(o => HUBS.has(o.i) || o.i === ORIGIN); p = hubs[Math.floor(R() * hubs.length)] || null; }
    if (!p) earlier.forEach(o => { if (!p || dist(o, s) < dist(p, s)) p = o; });
    s.rpar = p; s.rtravel = Math.min(8, Math.max(1.5, s.rday - p.rday)); });

  // green: quantiles shuffled; first-dose station earliest; the stitcher at p90
  const qs = []; for (let i = 0; i < N; i++) if (i !== 36) qs.push((i + 0.5) / N);
  const first = qs.shift();
  for (let i = qs.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [qs[i], qs[j]] = [qs[j], qs[i]]; }
  ST[UKI].q = first; ST[HERO].q = 0.9;
  ST.forEach(s => { if (s.q === undefined) s.q = qs.pop(); s.gday = Math.max(FLOOR, L.lognormalQuantile(s.q, MED, P90)); });
  const byG = ST.slice().sort((a, b) => a.gday - b.gday || (a.i === UKI ? -1 : b.i === UKI ? 1 : a.i - b.i));
  byG.forEach((s, k) => { if (k === 0) return; let p = null; for (let m = 0; m < k; m++) { const o = byG[m]; if (!p || dist(o, s) < dist(p, s)) p = o; }
    s.gpar = p; s.gstart = Math.min(Math.max(p.gday, s.gday - 28), s.gday - 0.5); });
  ST.forEach(s => { s.tagOn = 200 + 60 * R(); s.sway = R() * 6.28; });
  // early fragments: unconnected green cross-stitches
  const FRAG = [[12, 0], [26, 0], [ORIGIN, 11], [27, 13], [28, 76], [UKI, 337]].map(([i, d]) => ({ s: ST[i], d }));
  // base travel routes: each station to its two nearest
  const ROUTES = []; const seen = new Set();
  ST.forEach(s => { ST.filter(o => o !== s).sort((a, b) => dist(a, s) - dist(b, s)).slice(0, 2).forEach(o => {
    const k = Math.min(s.i, o.i) + '-' + Math.max(s.i, o.i); if (!seen.has(k)) { seen.add(k); ROUTES.push([s, o]); } }); });
  const H = ST[HERO], SX = H.x, SY = H.y;

  // ---------------- camera (log zoom, anchored) ----------------
  const camHook = lt => ({ x: SX + 6, y: SY - 4, z: 46 * (1 + 0.004 * lt) });
  const WIDE = { x: 540, y: 960, z: 0.92 }, WIDE2 = { x: 540, y: 960, z: 0.86 };
  const C2 = { x: SX + 7, y: SY - 4, z: 58 }, C3 = { x: SX + 9, y: SY - 6, z: 78 };
  const mix = (a, b, u) => { const z = Math.exp(L.lerp(Math.log(a.z), Math.log(b.z), u)); const w = (1 / z - 1 / a.z) / (1 / b.z - 1 / a.z);
    return { z, x: L.lerp(a.x, b.x, w), y: L.lerp(a.y, b.y, w) }; };
  const camAt = t => {
    if (t < 3.2) return camHook(t);
    if (t < 8.2) return mix(camHook(3.2), WIDE, L.ease.inOut((t - 3.2) / 5.0));
    if (t < 12.8) return { x: 540, y: 960, z: L.lerp(WIDE.z, WIDE2.z, L.ease.inOut((t - 8.2) / 4.6)) };
    if (t < 15.0) return mix(WIDE2, C2, L.ease.inOut((t - 12.8) / 2.2));
    return { ...C2, z: C2.z * (1 + 0.025 * (Math.min(t, TFREEZE) - 15.0)) };
  };

  // ---------------- drawing helpers ----------------
  const rr = (ctx, x, y, w, h, r) => { r = Math.min(r, w / 2, h / 2); ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); };
  const arcPt = (a, b, bend, f) => { const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1; let px = -dy / len, py = dx / len; if (py > 0) { px = -px; py = -py; }
    const cx = (a.x + b.x) / 2 + px * bend * len, cy = (a.y + b.y) / 2 + py * bend * len;
    return [(1 - f) * (1 - f) * a.x + 2 * f * (1 - f) * cx + f * f * b.x, (1 - f) * (1 - f) * a.y + 2 * f * (1 - f) * cy + f * f * b.y]; };
  const arcPath = (ctx, a, b, bend, f0, f1) => { ctx.beginPath(); const n = 32; for (let i = 0; i <= n; i++) { const [x, y] = arcPt(a, b, bend, L.lerp(f0, f1, i / n)); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } };
  const cross = (ctx, x, y, s, col, w) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x - s, y - s); ctx.lineTo(x + s, y + s); ctx.moveTo(x + s, y - s); ctx.lineTo(x - s, y + s); ctx.stroke(); };
  const knot = (ctx, x, y, r, a = 1) => { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = rgbaG(0.22); ctx.beginPath(); ctx.arc(x, y, r * 2.6, 0, 7); ctx.fill();
    ctx.fillStyle = GREEN; for (let k = 0; k < 6; k++) { const an = k / 6 * 6.283; ctx.beginPath(); ctx.arc(x + Math.cos(an) * r * 0.55, y + Math.sin(an) * r * 0.55, r * 0.5, 0, 7); ctx.fill(); }
    ctx.fillStyle = '#7fe6a9'; ctx.beginPath(); ctx.arc(x - r * 0.15, y - r * 0.2, r * 0.38, 0, 7); ctx.fill(); ctx.restore(); };

  // one felt stitcher, feet at (x, y), height h (world units)
  function stitcher(ctx, x, y, h, o = {}) {
    const bw = h * 0.62, bh = h * 0.95, top = y - bh, ink = '#23221f', mood = o.mood || 'wait', lk = o.look || [0, 0];
    ctx.save(); ctx.globalAlpha *= (o.alpha ?? 1); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; rr(ctx, x - bw / 2 + h * 0.04, top + h * 0.05, bw, bh, bw / 2); ctx.fill();
    rr(ctx, x - bw / 2, top, bw, bh, bw / 2); ctx.fillStyle = o.col || BODY; ctx.fill();
    ctx.setLineDash([h * 0.07, h * 0.045]); ctx.strokeStyle = '#8d8a83'; ctx.lineWidth = h * 0.028;
    rr(ctx, x - bw / 2 + h * 0.045, top + h * 0.045, bw - h * 0.09, bh - h * 0.09, bw / 2 - h * 0.045); ctx.stroke(); ctx.setLineDash([]);
    const ey = top + bh * 0.3, ex = bw * 0.2, er = bw * 0.13;
    ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = h * 0.028;
    if (mood === 'relief') [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(x + d * ex, ey + er * 0.4, er * 0.8, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); });
    else if (mood === 'tender') [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(x + d * ex, ey - er * 0.3, er * 0.8, Math.PI * 0.15, Math.PI * 0.85); ctx.stroke(); });
    else [-1, 1].forEach(d => { const r0 = er * (mood === 'awe' ? 1.2 : 1); ctx.fillStyle = CREAM; ctx.beginPath(); ctx.arc(x + d * ex, ey, r0, 0, 7); ctx.fill();
      ctx.lineWidth = h * 0.012; ctx.stroke(); ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(x + d * ex + lk[0] * r0 * 0.4, ey + lk[1] * r0 * 0.4, r0 * (mood === 'awe' ? 0.38 : 0.52), 0, 7); ctx.fill(); });
    ctx.lineWidth = h * 0.028;
    if (mood === 'worry' || mood === 'awe') [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(x + d * (ex + er * 1.1), ey - er * (mood === 'awe' ? 2.0 : 1.5)); ctx.lineTo(x + d * (ex - er * 0.9), ey - er * (mood === 'awe' ? 2.1 : 2.2)); ctx.stroke(); });
    const my = top + bh * 0.5; ctx.beginPath();
    if (mood === 'wait') { ctx.moveTo(x - bw * 0.09, my); ctx.lineTo(x + bw * 0.09, my); ctx.stroke(); }
    else if (mood === 'worry') { ctx.arc(x, my + bw * 0.09, bw * 0.1, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke(); }
    else if (mood === 'awe') { ctx.ellipse(x, my, bw * 0.055, bw * 0.08, 0, 0, 7); ctx.fill(); }
    else { ctx.arc(x, my - bw * 0.05, bw * 0.1, Math.PI * 0.2, Math.PI * 0.8); ctx.stroke(); }
    if (mood === 'tender' || mood === 'relief') { ctx.fillStyle = 'rgba(200,160,150,0.35)'; [-1, 1].forEach(d => { ctx.beginPath(); ctx.ellipse(x + d * bw * 0.3, my - bw * 0.06, bw * 0.08, bw * 0.05, 0, 0, 7); ctx.fill(); }); }
    // arms (felt strips) with hands
    const hand = o.hand || [x - bw * 0.75, top + bh * 0.8], hand2 = [x + bw * 0.72, top + bh * 0.86];
    [[[x - bw * 0.42, top + bh * 0.55], hand], [[x + bw * 0.42, top + bh * 0.55], hand2]].forEach(([s, e]) => {
      ctx.strokeStyle = '#5f5c56'; ctx.lineWidth = h * 0.11; ctx.beginPath(); ctx.moveTo(s[0], s[1]); ctx.lineTo(e[0], e[1]); ctx.stroke();
      ctx.strokeStyle = o.col || BODY; ctx.lineWidth = h * 0.08; ctx.beginPath(); ctx.moveTo(s[0], s[1]); ctx.lineTo(e[0], e[1]); ctx.stroke(); });
    ctx.restore();
  }

  // ---------------- the world at a given day ----------------
  // hero: { mood, look, lt (bob clock), dip (0..1) }
  function world(ctx, day, cam, hero = {}) {
    ctx.fillStyle = TABLE; ctx.fillRect(0, 0, 1080, 1920);
    ctx.save(); ctx.translate(540, 960); ctx.scale(cam.z, cam.z); ctx.translate(-cam.x, -cam.y);
    const z = cam.z, vx0 = cam.x - 540 / z, vx1 = cam.x + 540 / z, vy0 = cam.y - 960 / z, vy1 = cam.y + 960 / z;
    const U = Math.max(1, 2.2 / z), inView = (x, y, m) => x > vx0 - m && x < vx1 + m && y > vy0 - m && y < vy1 + m;
    // linen inside the hoop
    ctx.fillStyle = LINEN; ctx.beginPath(); ctx.arc(540, 960, 520, 0, 7); ctx.fill();
    // weave (only when close)
    const wa = L.sm(5, 15, z) * 0.55;
    if (wa > 0.01) { ctx.save(); ctx.globalAlpha = wa; ctx.strokeStyle = WEAVE; ctx.lineWidth = 0.28; const sp = 0.8;
      ctx.setLineDash([0.4, 0.4]); ctx.beginPath(); for (let x = Math.floor(vx0 / sp) * sp; x <= vx1; x += sp) { ctx.moveTo(x, vy0); ctx.lineTo(x, vy1); } ctx.stroke();
      ctx.lineDashOffset = 0.4; ctx.beginPath(); for (let y = Math.floor(vy0 / sp) * sp; y <= vy1; y += sp) { ctx.moveTo(vx0, y); ctx.lineTo(vx1, y); } ctx.stroke();
      ctx.setLineDash([]); ctx.lineDashOffset = 0; ctx.restore(); }
    // continents: satin stitch
    CONT.forEach(c => {
      const bx0 = Math.max(c.bb[0], vx0), by0 = Math.max(c.bb[1], vy0), bx1 = Math.min(c.bb[2], vx1), by1 = Math.min(c.bb[3], vy1);
      if (bx0 >= bx1 || by0 >= by1) return;
      ctx.save(); ctx.beginPath(); c.pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath();
      ctx.fillStyle = SATIN_BASE; ctx.fill(); ctx.clip();
      const k = c.dir, S = 2.2, cs = [bx0 - k * by0, bx0 - k * by1, bx1 - k * by0, bx1 - k * by1], c0 = Math.floor(Math.min(...cs) / S) * S, c1 = Math.max(...cs);
      ctx.strokeStyle = SATIN; ctx.lineWidth = 1.75; ctx.lineCap = 'butt'; ctx.setLineDash([6, 0.6]); ctx.beginPath();
      for (let cc = c0; cc <= c1; cc += S) { ctx.moveTo(cc + k * (by0 - 2), by0 - 2); ctx.lineTo(cc + k * (by1 + 2), by1 + 2); }
      ctx.stroke(); ctx.setLineDash([]); ctx.restore();
      ctx.save(); ctx.strokeStyle = OUTL; ctx.lineWidth = Math.max(0.3, 1.3 / z); ctx.setLineDash([1.2, 0.6]); ctx.beginPath();
      c.pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.stroke(); ctx.setLineDash([]); ctx.restore();
    });
    // base travel routes (gray running stitch)
    ctx.save(); ctx.globalAlpha = 0.5; ctx.strokeStyle = '#8d8a83'; ctx.lineWidth = Math.max(0.18, 1.3 / z); ctx.lineCap = 'round'; ctx.setLineDash([1.4, 1.0]);
    ROUTES.forEach(([a, b]) => { arcPath(ctx, a, b, 0.12, 0, 1); ctx.stroke(); }); ctx.setLineDash([]); ctx.restore();
    // red thread
    const RW = Math.max(0.35, 3.2 / z);
    ctx.save(); ctx.lineCap = 'round';
    ST.forEach(s => { if (!s.rpar) return; const f = L.clamp((day - (s.rday - s.rtravel)) / s.rtravel, 0, 1); if (f <= 0) return;
      ctx.setLineDash([2.2, 1.0]);
      ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = RW; ctx.save(); ctx.translate(0.12, 0.16); arcPath(ctx, s.rpar, s, 0.12, 0, f); ctx.stroke(); ctx.restore();
      ctx.strokeStyle = RED; ctx.lineWidth = RW; arcPath(ctx, s.rpar, s, 0.12, 0, f); ctx.stroke(); });
    ctx.setLineDash([]); ctx.restore();
    // station bases, red marks
    ST.forEach(s => { if (!inView(s.x, s.y, 12)) return;
      ctx.fillStyle = '#8d8a83'; ctx.beginPath(); ctx.arc(s.x, s.y, 0.7 * U, 0, 7); ctx.fill();
      if (day >= s.rday) { const since = day - s.rday;
        ctx.fillStyle = rgbaR(0.2); ctx.beginPath(); ctx.arc(s.x, s.y, 2.4 * U, 0, 7); ctx.fill();
        cross(ctx, s.x, s.y, 1.0 * U, RED, Math.max(0.3, 2.6 / z));
        if (since < 20) { ctx.strokeStyle = rgbaR(0.8 * (1 - since / 20)); ctx.lineWidth = Math.max(0.2, 2 / z); ctx.beginPath(); ctx.arc(s.x, s.y, (2 + since * 0.35) * U, 0, 7); ctx.stroke(); } } });
    // early fragments
    FRAG.forEach(({ s, d }) => { if (day < d || !inView(s.x, s.y, 12)) return; const x = s.x + 2.2 * U, y = s.y - 2.0 * U;
      ctx.save(); ctx.fillStyle = rgbaG(0.25); ctx.beginPath(); ctx.arc(x, y, 1.8 * U, 0, 7); ctx.fill(); cross(ctx, x, y, 0.8 * U, GREEN, Math.max(0.28, 2.4 / z)); ctx.restore(); });
    // green thread (one hop at a time)
    const GW = Math.max(0.38, 3.6 / z);
    ctx.save(); ctx.lineCap = 'round'; ctx.shadowColor = rgbaG(0.7); ctx.shadowBlur = 10;
    ST.forEach(s => { if (!s.gpar) return; const f = L.clamp((day - s.gstart) / (s.gday - s.gstart), 0, 1); if (f <= 0) return;
      ctx.setLineDash([2.2, 1.0]); ctx.strokeStyle = GREEN; ctx.lineWidth = GW; arcPath(ctx, s.gpar, s, -0.1, 0, f); ctx.stroke(); });
    ctx.setLineDash([]); ctx.restore();
    // paperwork tags, stamps, knots
    ST.forEach(s => { if (!inView(s.x, s.y, 14)) return;
      const ta = L.clamp((day - s.tagOn) / 10, 0, 1) * (1 - L.clamp((day - s.gday - 8) / 12, 0, 1));
      if (ta > 0) { const ax = s.x - 1.2 * U, ay = s.y - 0.6 * U, sw = 0.12 * Math.sin(day * 0.25 + s.sway);
        ctx.save(); ctx.globalAlpha *= ta; ctx.strokeStyle = TAGINK; ctx.lineWidth = Math.max(0.12, 1 / z); ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(ax, ay); ctx.stroke();
        ctx.translate(ax, ay); ctx.rotate(sw); const w = 3.0 * U, hh = 2.1 * U;
        ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fillRect(-w + 0.15 * U, 0.2 * U, w, hh);
        ctx.fillStyle = TAG; ctx.fillRect(-w, 0, w, hh); ctx.strokeStyle = TAGINK; ctx.lineWidth = Math.max(0.1, 0.8 / z);
        ctx.beginPath(); for (let k = 0; k < 3; k++) { ctx.moveTo(-w * 0.88, hh * (0.28 + k * 0.22)); ctx.lineTo(-w * (k === 2 ? 0.5 : 0.25), hh * (0.28 + k * 0.22)); } ctx.stroke();
        if (day >= s.gday - 6) { const sa = L.clamp((day - (s.gday - 6)) / 2, 0, 1); ctx.globalAlpha *= sa; ctx.strokeStyle = '#3e3c38'; ctx.lineWidth = Math.max(0.12, 0.25 * U);
          ctx.beginPath(); ctx.arc(-w * 0.28, hh * 0.55, 0.55 * U, 0, 7); ctx.stroke(); cross(ctx, -w * 0.28, hh * 0.55, 0.3 * U, '#3e3c38', Math.max(0.1, 0.18 * U)); }
        ctx.restore(); }
      if (day >= s.gday) { const k = L.clamp((day - s.gday) / 3, 0, 1); knot(ctx, s.x, s.y, 1.05 * U * (0.4 + 0.6 * L.ease.back(k)), 1);
        if (day - s.gday < 12) { ctx.strokeStyle = rgbaG(0.8 * (1 - (day - s.gday) / 12)); ctx.lineWidth = Math.max(0.2, 2 / z); ctx.beginPath(); ctx.arc(s.x, s.y, (2 + (day - s.gday) * 0.3) * U, 0, 7); ctx.stroke(); } } });
    // stitchers
    const fa = L.sm(2.2, 5, z);
    ST.forEach(s => { if (s === H || fa <= 0.01 || !inView(s.x + 9, s.y - 4, 14)) return;
      stitcher(ctx, s.x + 9, s.y + 2, 12, { alpha: fa, mood: day < s.rday ? 'wait' : day < s.gday ? 'worry' : 'relief', look: [-0.8, 0.2] }); });
    // the hero: one stitcher, one green needle
    if (inView(SX + 9, SY - 4, 20)) {
      const bob = hero.dip ? 0 : 0.35 * Math.sin(2 * Math.PI * (hero.lt || 0) / 1.6);
      const hand = [SX + 3.6 - 0.8 * (hero.dip || 0), SY - 3.6 + bob + 1.0 * (hero.dip || 0)];
      const tipT = [SX + 0.25, SY - 0.25], dx = tipT[0] - hand[0], dy = tipT[1] - hand[1], dl = Math.hypot(dx, dy), D = [dx / dl, dy / dl];
      const eye = [hand[0] - D[0] * 1.3, hand[1] - D[1] * 1.3], tip = [hand[0] + D[0] * (dl - 0.2), hand[1] + D[1] * (dl - 0.2)];
      stitcher(ctx, SX + 9, SY + 2, 12, { mood: hero.mood, look: hero.look, hand });
      // green thread from the needle's eye: loose (a fragment) until the knot, then joined to it
      ctx.save(); ctx.lineCap = 'round'; ctx.shadowColor = rgbaG(0.6); ctx.shadowBlur = 12; ctx.strokeStyle = GREEN; ctx.lineWidth = Math.max(0.3, 3 / z); ctx.beginPath(); ctx.moveTo(eye[0], eye[1]);
      if (day >= H.gday) ctx.bezierCurveTo(eye[0] - 1.5, eye[1] + 3.5, SX + 1.5, SY + 2.2, SX, SY);
      else ctx.bezierCurveTo(eye[0] - 2.5, eye[1] - 5, eye[0] + 4, eye[1] - 7.5, eye[0] + 6.5, eye[1] - 10 + 0.4 * Math.sin((hero.lt || 0) * 2));
      ctx.stroke(); ctx.restore();
      // needle
      ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = '#5a5852'; ctx.lineWidth = 0.42; ctx.beginPath(); ctx.moveTo(eye[0] + 0.1, eye[1] + 0.12); ctx.lineTo(tip[0] + 0.1, tip[1] + 0.12); ctx.stroke();
      ctx.strokeStyle = '#dcd9d2'; ctx.lineWidth = 0.3; ctx.beginPath(); ctx.moveTo(eye[0], eye[1]); ctx.lineTo(tip[0], tip[1]); ctx.stroke();
      ctx.strokeStyle = '#3a3935'; ctx.lineWidth = 0.08; ctx.beginPath(); ctx.ellipse(eye[0] + D[0] * 0.35, eye[1] + D[1] * 0.35, 0.28, 0.08, Math.atan2(D[1], D[0]), 0, 7); ctx.stroke(); ctx.restore();
      // hand over the needle
      ctx.fillStyle = BODY; ctx.beginPath(); ctx.arc(hand[0], hand[1], 0.75, 0, 7); ctx.fill(); ctx.strokeStyle = '#5f5c56'; ctx.lineWidth = 0.12; ctx.stroke();
    }
    // the hoop
    ctx.strokeStyle = '#4c4740'; ctx.lineWidth = 26; ctx.beginPath(); ctx.arc(540, 960, 532, 0, 7); ctx.stroke();
    ctx.strokeStyle = '#6f675c'; ctx.lineWidth = 18; ctx.beginPath(); ctx.arc(540, 960, 530, 0, 7); ctx.stroke();
    ctx.fillStyle = '#6f675c'; ctx.fillRect(522, 408, 36, 40); ctx.fillStyle = '#8a8378'; ctx.fillRect(532, 396, 16, 16);
    ctx.restore();
  }

  // ---------------- cards ----------------
  const card = (ctx, lines, y, a, size = 96) => { if (a > 0.001) L.title(ctx, lines, y, size, { alpha: a }); };
  const win = (t, a, b, f = 0.3) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));
  const HOOK_CARD = ['Red thread', 'needs no passport.'];
  const heroMood = t => t < 4.1 ? 'wait' : t < 15.6 ? 'worry' : t < 16.3 ? 'awe' : 'relief';
  const heroLook = t => t < 4.1 ? [-0.9, 0.3] : t < 12.8 ? [-0.6, 0.5] : [-0.9, 0.6];
  function hookShot(ctx, lt) { world(ctx, HOOK_DAY, camHook(lt), { mood: 'worry', look: [-0.9, 0.4], lt }); }

  // ---------------- the snap ----------------
  const X0 = 150, X1 = 930, XD = d => X0 + (X1 - X0) * d / SPAN;
  function chart(ctx, yb, Hh, dEnd, cdf) {
    ctx.strokeStyle = '#6d6a64'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X0, yb); ctx.lineTo(X1, yb); ctx.stroke();
    if (dEnd <= 0) return;
    const curve = (fn, from) => { const pts = []; for (let d = from; d < dEnd; d += 2) pts.push([XD(d), yb - Hh * fn(d)]); pts.push([XD(dEnd), yb - Hh * fn(dEnd)]); return pts; };
    const area = (pts, fill, stroke, x0) => { ctx.beginPath(); ctx.moveTo(x0, yb); pts.forEach(p => ctx.lineTo(p[0], p[1])); ctx.lineTo(pts[pts.length - 1][0], yb); ctx.closePath(); ctx.fillStyle = fill; ctx.fill();
      ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.strokeStyle = stroke; ctx.lineWidth = 6; ctx.lineJoin = 'round'; ctx.stroke(); };
    area(curve(extent, 0), rgbaR(0.28), RED, X0);
    if (dEnd > FLOOR) area(curve(cdf, FLOOR), rgbaG(0.28), GREEN, XD(FLOOR));
  }
  function marker(ctx, yb, Hh, d, text, a) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; const x = XD(d), y = yb - Hh * 0.5;
    ctx.strokeStyle = '#e8e4da'; ctx.lineWidth = 3; ctx.setLineDash([10, 8]); ctx.beginPath(); ctx.moveTo(x, yb); ctx.lineTo(x, yb - Hh - 16); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = rgbaG(0.3); ctx.beginPath(); ctx.arc(x, y, 30, 0, 7); ctx.fill(); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(x, y, 14, 0, 7); ctx.fill();
    ctx.font = `60px "${SERIF}"`; ctx.textAlign = 'right'; ctx.lineWidth = 8; ctx.strokeStyle = '#0d1118'; ctx.lineJoin = 'round'; ctx.strokeText(text, x - 26, y - 22);
    ctx.fillStyle = '#8fe8b4'; ctx.fillText(text, x - 26, y - 22); ctx.restore();
  }
  function snap(ctx, t) {
    ctx.fillStyle = '#0c0c0b'; ctx.fillRect(0, 0, 1080, 1920);
    L.title(ctx, ['Real speed.'], 290, 84, { alpha: win(t, 20.1, 22.4) });
    // panel A: as it happened, the whole timeline in 1.2 s
    const aA = L.sm(20.1, 20.4, t), yA = 380, ybA = yA + 430, HA = 200;
    ctx.save(); ctx.globalAlpha = aA;
    ctx.fillStyle = '#1b1a18'; ctx.fillRect(90, yA, 900, 470); ctx.strokeStyle = '#4f4c46'; ctx.lineWidth = 3; ctx.strokeRect(90, yA, 900, 470);
    L.label(ctx, 'as it happened', 120, yA + 72, 60, { col: CREAM, font: SERIF, align: 'left' });
    L.label(ctx, 'red: countries reached', 120, yA + 128, 44, { col: '#ff6f66', align: 'left' });
    L.label(ctx, 'green: the answer arrives', 120, yA + 176, 44, { col: '#8fe8b4', align: 'left' });
    chart(ctx, ybA, HA, SPAN * L.clamp((t - 20.4) / 1.2, 0, 1), cdfH);
    ctx.restore();
    marker(ctx, ybA, HA, MED, 'day ' + MED, L.sm(21.35, 21.6, t));
    // panel B: same pieces, better routing (illustrative)
    const aB = L.sm(22.4, 22.7, t), yB = 900, ybB = yB + 430, HB = 200;
    if (aB > 0) {
      ctx.save(); ctx.globalAlpha = aB;
      ctx.fillStyle = '#1b1a18'; ctx.fillRect(90, yB, 900, 470); ctx.strokeStyle = '#4f4c46'; ctx.lineWidth = 3; ctx.strokeRect(90, yB, 900, 470);
      L.label(ctx, 'same pieces, better routing', 120, yB + 72, 58, { col: CREAM, font: SERIF, align: 'left' });
      L.label(ctx, 'illustrative', 120, yB + 128, 48, { col: '#c9c4b8', align: 'left' });
      const g = L.sm(23.5, 23.9, t);
      if (g > 0) { ctx.save(); ctx.globalAlpha = aB * g; ctx.strokeStyle = '#8d8a83'; ctx.lineWidth = 3; ctx.setLineDash([6, 10]);
        ctx.beginPath(); ctx.moveTo(XD(MED), ybB); ctx.lineTo(XD(MED), ybB - HB - 16); ctx.stroke(); ctx.setLineDash([]);
        const ay = ybB - HB * 0.5 + 46; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(XD(MED) - 6, ay); ctx.lineTo(XD(AIMED) + 16, ay); ctx.moveTo(XD(AIMED) + 30, ay - 12); ctx.lineTo(XD(AIMED) + 16, ay); ctx.lineTo(XD(AIMED) + 30, ay + 12); ctx.stroke(); ctx.restore(); }
      chart(ctx, ybB, HB, SPAN * L.clamp((t - 22.7) / 1.2, 0, 1), cdfA);
      ctx.restore();
      marker(ctx, ybB, HB, AIMED, 'day ' + AIMED, L.sm(23.45, 23.7, t));
    }
    L.title(ctx, ['Same thread. Fewer stops.'], 1480, 64,{ alpha: win(t, 24.9, 26.45, 0.25) });
    L.slate(ctx, t < 22.4 ? 'SC2  SNAP: REAL SPEED' : 'SC2  SNAP: SIDE BY SIDE');
  }

  // ---------------- draw ----------------
  function draw(ctx, t) {
    if (t < 1.8) {                                                  // SC1 hook (flash-forward) == loop target
      hookShot(ctx, t);
      card(ctx, HOOK_CARD, 330, 1 - L.sm(1.5, 1.8, t), 92);
      L.slate(ctx, 'SC1  CLOSE (eye level)'); L.grain(ctx, t, { alpha: 0.05 }); return;
    }
    if (t < 2.0) {                                                  // unstitch back to day 0
      const d = L.lerp(HOOK_DAY, 0, L.ease.inOut((t - 1.8) / 0.2));
      world(ctx, d, camHook(t), { mood: 'awe', look: [-0.9, 0.4], lt: t });
      L.slate(ctx, 'SC1  REWIND (unstitch)'); L.grain(ctx, t, { alpha: 0.05 }); return;
    }
    if (t < 19.8) {                                                 // SC1: one long take, close -> world -> closer
      const tt = Math.min(t, TFREEZE), day = dayAt(tt);
      const dip = L.sm(15.3, 15.6, tt) * (1 - L.sm(15.8, 16.2, tt));
      world(ctx, day, camAt(tt), { mood: heroMood(tt), look: heroLook(tt), lt: tt, dip });
      card(ctx, ['Rewind.', 'Watch it travel.'], 330, win(t, 2.1, 3.9), 92);
      card(ctx, [{ text: 'The answer', col: GREEN }, 'was stitched early.'], 300, win(t, 5.2, 7.4), 86);
      card(ctx, ['Then it stopped', 'at every border.'], 300, win(t, 7.8, 10.2), 88);
      card(ctx, ['Forms. Stamps.', 'Waiting rooms.'], 300, win(t, 10.5, 12.7), 88);
      card(ctx, ['One knot', 'at a time.'], 300, win(t, 13.0, 14.9), 88);
      card(ctx, ['It arrived.', 'Long after red.'], 300, win(t, 15.9, 17.6, 0.25), 92);
      const lg = win(t, 8.4, 12.6, 0.4);
      if (lg > 0) { L.label(ctx, 'red thread: reached', 90, 1486, 44, { col: '#ff6f66', alpha: lg, align: 'left' }); L.label(ctx, 'green knot: arrived', 515, 1486, 44, { col: '#8fe8b4', alpha: lg, align: 'left' }); }
      if (t >= TFREEZE) { ctx.fillStyle = `rgba(8,8,7,${0.55 * L.sm(TFREEZE, 17.9, t)})`; ctx.fillRect(0, 0, 1080, 1920);
        card(ctx, ['We slowed it down', 'so you could see it.'], 300, win(t, 17.8, 19.75, 0.25), 84); }
      L.slate(ctx, t < 3.2 ? 'SC1  CLOSE (day zero)' : t < 8.2 ? 'SC1  CONTINUOUS ZOOM OUT' : t < 12.8 ? 'SC1  WIDE (the hoop is the world)' : t < 15.0 ? 'SC1  ZOOM IN' : t < TFREEZE ? 'SC1  CLOSE+' : 'SC1  FREEZE');
      L.grain(ctx, t, { alpha: 0.05 }); return;
    }
    if (t < 20.1) { ctx.fillStyle = '#000000'; ctx.fillRect(0, 0, 1080, 1920); L.slate(ctx, 'SC2  SILENCE'); return; }
    if (t < 26.5) { snap(ctx, t); return; }
    if (t < 29.9) {                                                 // SC3: back in, closer than ever
      world(ctx, SPAN, { ...C3, z: C3.z * (1 + 0.03 * (t - 26.5)) }, { mood: 'tender', look: [0, 0], lt: t, dip: 0 });
      ctx.fillStyle = `rgba(0,0,0,${1 - L.sm(26.5, 26.9, t)})`; ctx.fillRect(0, 0, 1080, 1920);
      card(ctx, ['This is', 'the bottleneck.'], 330, win(t, 27.0, 29.8, 0.3), 104);
      L.slate(ctx, 'SC3  CLOSE++ (tender)'); L.grain(ctx, t, { alpha: 0.05 });
      if (t > 29.6) L.endCard(ctx, L.sm(29.6, 29.9, t), { line: 'Help close the gap.' });
      return;
    }
    if (t >= 34.4) {                                                // loop tail: dissolve into frame 1
      hookShot(ctx, t - DUR);
      card(ctx, HOOK_CARD, 330, L.sm(35.1, 35.7, t), 100);
      L.grain(ctx, t, { alpha: 0.05 });
    }
    const ea = 1 - L.sm(34.4, 35.1, t);
    if (ea > 0) L.endCard(ctx, ea, { line: 'Help close the gap.' });
    L.slate(ctx, t < 34.4 ? 'END' : 'SC1  CLOSE (loop)');
  }

  const tOfDay = d => T0 + d / DPS;
  return {
    draw, DUR,
    acts: [
      { start: 0, end: 1.8, bpm: 0, drone: true },
      { start: 1.8, end: TFREEZE, bpm: 56, drone: true },
      { start: TFREEZE, end: 19.8, bpm: 0, drone: true },
      { start: 20.1, end: 26.5, bpm: 0, drone: true },
      { start: 26.5, end: 34.4, bpm: 0, drone: true },
      { start: 34.4, end: DUR, bpm: 0, drone: true },
    ],
    cues: [
      { t: 0.2, type: 'stamp' }, { t: 1.8, type: 'whoosh' }, { t: tOfDay(H.rday), type: 'bonk' },
      { t: tOfDay(FLOOR), type: 'stamp' }, { t: tOfDay(MED), type: 'pop' }, { t: tOfDay(H.gday - 6), type: 'stamp' }, { t: tOfDay(H.gday), type: 'ding' },
      { t: TFREEZE, type: 'hit' }, { t: 20.1, type: 'hit' }, { t: 21.45, type: 'pop' }, { t: 23.5, type: 'ding' },
      { t: 26.5, type: 'whoosh' }, { t: 29.6, type: 'ding' }, { t: 34.4, type: 'whoosh' },
    ],
  };
}
if (typeof module !== 'undefined') module.exports = makeScene;
