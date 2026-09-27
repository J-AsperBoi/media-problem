// the-worm ("One by One"): pov, blueprint, POV walk. Analog: wannacry-2017. Never named on screen.
// Red: every screen = an equal slice of the ~230,000 systems hit (s2). Red times from the same illustrative logistic as
//   scenes/the-worm-rewind.js (mid 4.0 h, k 1.16/h), 0 at t0, saturated by the 7.3 h kill switch (s1; Neino/Kryptos Logic
//   testimony: bulk hit before the stop). Flat after 7.3 h. Shape inside 0-7.3 h NOT sourced; no counts on screen.
// Green (real): per building max(7.3, lognormalQuantile(u, 20, 168)) h. AI route: lognormalQuantile(u, 1, 8.4) h (illustrative).
// Mapping: race = log clock 0->168 h over film 2-14 s; snap = linear, 168 h in 4 s. See output/the-worm/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('wannacry-2017');
  const DUR = 36, RED = L.RED, GREEN = L.GREEN;
  // blueprint palette: desaturated blue-gray ground, white/gray line
  const BG = '#1d2229', BG2 = '#232931', GRID = 'rgba(200,210,225,0.05)', INK = '#d8dce2', DIM = '#7d8591', FAINT = '#4a525d', DARK = '#0d1118';

  // ---------- data ----------
  const KS = A.threat.events[0].t;                                   // 7.3 h (s1)
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;          // 20, 168
  const AIMED = A.ai_counterfactual.aggregation_median, AIP90 = AIMED * P90 / MED;       // 1, 8.4
  const K = 1.16, MID = 4.0, sig = h => 1 / (1 + Math.exp(-K * (h - MID))), S0 = sig(0), SK = sig(KS);
  const redHourOfQ = q => { const v = S0 + q * (SK - S0); return MID - Math.log(1 / v - 1) / K; };

  // ---------- clock ----------
  const SPAN = 168, LOGS = Math.log10(SPAN + 1), hLog = f => Math.pow(10, L.clamp(f, 0, 1) * LOGS) - 1;
  const HOOK_H = 6.6, SNAP0 = 17.6, SNAP_S = 4;
  const hourAt = t => {
    if (t < 1.4) return HOOK_H;
    if (t < 2) return HOOK_H * (1 - L.ease.inOut((t - 1.4) / 0.6));
    if (t < 14) return hLog((t - 2) / 12);
    return SPAN;
  };
  const tOfHour = h => 2 + 12 * Math.log10(h + 1) / LOGS;
  const snapHour = t => L.clamp((t - SNAP0) / SNAP_S, 0, 1) * SPAN;

  // ---------- the ward (3D, metres). X right, Y down from eye (eye 1.6 m), z forward ----------
  const HW = 1.5, CEIL = -1.1, FLOOR = 1.6, ZFAR = 11, BAY = 1.2, Z0 = 1.6;
  const R = L.rng(4417);
  const wardScreens = [];
  for (let i = 0; i < 7; i++) [-1, 1].forEach(side => { const z1 = Z0 + i * BAY + (side > 0 ? 0.35 : 0.1); wardScreens.push({ side, z1, z2: z1 + 0.6, y1: -0.25, y2: 0.35, ward: true, local: 1 - (z1 - Z0) / (7 * BAY) }); });
  const HERO = wardScreens.find(s => s.side < 0 && Math.abs(s.z1 - (Z0 + BAY + 0.1)) < 0.01);  // bedside screen for the drop-in

  // ---------- plan (2D world px). S px per metre; ward corridor centred on x 540 ----------
  const S = 60, PY0 = 1320;
  const P = (X, z) => [540 + X * S, PY0 - z * S];
  const YOU0 = P(0, 0.2), YOU1 = P(-0.55, 2.3);
  // other buildings: organisations across the city, each with 6 screens
  const BLD = [
    [-1150, -1650], [1900, -1250], [-1050, 150], [2050, 400], [-900, 1900], [1500, 2100], [650, -1800], [2250, -1950], [-200, 2500], [-1350, -2250],
  ].map(([x, y], i) => ({ x, y, w: 460, h: 340, i }));
  const HOSP = { x: 540, y: 1000, w: 820, h: 900 };
  BLD.forEach(b => { b.screens = []; for (let r = 0; r < 2; r++) for (let c = 0; c < 3; c++) b.screens.push({ px: b.x - 130 + c * 130, py: b.y - 60 + r * 120, bld: b }); });
  const PIECES = { patch: [-700, -2750], alert: [-150, -2900], res: [2350, -2800] };
  const HUB = [(PIECES.patch[0] + PIECES.alert[0]) / 2, (PIECES.patch[1] + PIECES.alert[1]) / 2 + 60];
  // ward screens in plan
  wardScreens.forEach(s => { const [x1, y1] = P(s.side * HW, s.z1), [, y2] = P(s.side * HW, s.z2); s.px = x1 - s.side * 6; s.py = (y1 + y2) / 2; s.bld = HOSP; });

  // ---------- red and green times ----------
  const ALL = wardScreens.concat(...BLD.map(b => b.screens));
  ALL.forEach(s => { s.key = s.ward ? 0.02 + 0.95 * s.local + R() * 0.04 : R(); });
  const byKey = ALL.slice().sort((a, b) => a.key - b.key);
  byKey.forEach((s, i) => { s.rh = redHourOfQ((i + 0.5) / byKey.length); });
  const bu = [0.55, 0.2, 0.85, 0.35, 0.93, 0.1, 0.45, 0.62, 0.28, 0.76];
  BLD.forEach((b, i) => { b.u = bu[i]; });
  HOSP.u = 0.7;
  [HOSP, ...BLD].forEach(b => { b.gh = Math.max(KS, L.lognormalQuantile(b.u, MED, P90)); b.ga = L.lognormalQuantile(b.u, AIMED, AIP90); });
  const isRed = (s, h, mode) => h >= s.rh && !(mode === 'ai' && s.bld.ga <= s.rh);

  // ---------- helpers ----------
  const hex = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const rgba = (c, a) => { const [r, g, b] = hex(c); return `rgba(${r},${g},${b},${a})`; };
  const glow = (ctx, x, y, r, col, a) => { if (a <= 0 || r <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgba(col, a)); g.addColorStop(1, rgba(col, 0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); };
  const seg = (ctx, x1, y1, x2, y2, col, w) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
  const outlined = (ctx, text, x, y, size, col, { font = HAND, a = 1, align = 'center' } = {}) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.font = `${size}px "${font}"`; ctx.textAlign = align; ctx.lineJoin = 'round'; ctx.lineWidth = size * 0.18; ctx.strokeStyle = DARK; ctx.strokeText(text, x, y); ctx.fillStyle = col; ctx.fillText(text, x, y); ctx.restore(); };
  const card = (ctx, lines, y, size, a) => { if (a > 0) L.title(ctx, lines, y, size, { alpha: a }); };
  const fadeIO = (t, a, b, f = 0.25) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));
  const gridBG = (ctx, step = 60, off = [0, 0], col = GRID) => { ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920); ctx.strokeStyle = col; ctx.lineWidth = 1.5;
    const ox = ((off[0] % step) + step) % step, oy = ((off[1] % step) + step) % step;
    for (let x = ox; x < 1080; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1920); ctx.stroke(); }
    for (let y = oy; y < 1920; y += step) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1080, y); ctx.stroke(); } };

  // ---------- tiny 3D: camera {x, z, yaw, pitch, bob}, focal F ----------
  const F = 700, VPY = 760;
  function mk(cam) {
    const c = Math.cos(cam.yaw || 0), s = Math.sin(cam.yaw || 0), vpy = VPY + F * Math.tan(cam.pitch || 0) + (cam.bob || 0);
    const tr = (X, Y, z) => { const dx = X - cam.x, dz = z - cam.z; return [dx * c + dz * s, Y - (cam.y || 0), -dx * s + dz * c]; };
    const pr = p => [540 + F * p[0] / p[2], vpy + F * p[1] / p[2]];
    const NEAR = 0.08;
    const line = (ctx, a, b, col, w) => { let p = tr(...a), q = tr(...b); if (p[2] < NEAR && q[2] < NEAR) return;
      if (p[2] < NEAR) { const f = (NEAR - p[2]) / (q[2] - p[2]); p = p.map((v, i) => v + (q[i] - v) * f); }
      if (q[2] < NEAR) { const f = (NEAR - q[2]) / (p[2] - q[2]); q = q.map((v, i) => v + (p[i] - v) * f); }
      const A1 = pr(p), B1 = pr(q); seg(ctx, A1[0], A1[1], B1[0], B1[1], col, w); };
    const poly = (ctx, pts, fill, stroke, w = 3) => { const cp = pts.map(p => tr(...p)); const out = [];
      for (let i = 0; i < cp.length; i++) { const a = cp[i], b = cp[(i + 1) % cp.length], ia = a[2] >= NEAR, ib = b[2] >= NEAR;
        if (ia) out.push(a); if (ia !== ib) { const f = (NEAR - a[2]) / (b[2] - a[2]); out.push(a.map((v, k) => v + (b[k] - v) * f)); } }
      if (out.length < 3) return null; const sp = out.map(pr); ctx.beginPath(); sp.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath();
      if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = w; ctx.lineJoin = 'round'; ctx.stroke(); }
      const cx = sp.reduce((a, p) => a + p[0], 0) / sp.length, cy = sp.reduce((a, p) => a + p[1], 0) / sp.length; return { cx, cy, z: cp.reduce((a, p) => a + p[2], 0) / cp.length }; };
    const pt = (X, Y, z) => { const p = tr(X, Y, z); return p[2] < NEAR ? null : [...pr(p), p[2]]; };
    return { line, poly, pt };
  }

  // screen content (lines of a chart on a monitor)
  function screenFace(ctx, V, s, h, mode, o = {}) {
    const X = s.side * HW, red = isRed(s, h, mode);
    const corners = [[X, s.y1, s.z1], [X, s.y1, s.z2], [X, s.y2, s.z2], [X, s.y2, s.z1]];
    const frame = V.poly(ctx, corners, DARK, INK, 3);
    if (!frame) return;
    const inset = (f, g) => [X, L.lerp(s.y1, s.y2, g), L.lerp(s.z1, s.z2, f)];
    const rf = red ? L.clamp((h - s.rh) / 0.35, 0, 1) : 0;
    if (rf > 0) { glow(ctx, frame.cx, frame.cy, Math.min(900, 520 / Math.max(0.3, frame.z)), RED, 0.28 * rf * (o.light ?? 1)); V.poly(ctx, [inset(0.06, 0.08), inset(0.94, 0.08), inset(0.94, 0.92), inset(0.06, 0.92)], rgba(RED, 0.25 + 0.7 * rf), null); }
    if (!red || rf < 1) { for (let k = 0; k < 4; k++) V.line(ctx, inset(0.12, 0.2 + k * 0.18), inset(0.12 + 0.7 - k * 0.12, 0.2 + k * 0.18), rgba('#9aa3ae', 1 - rf), 2); }
    if (o.apply != null && !red) {                                   // the routed fix, and the apply button
      const g = o.apply; V.poly(ctx, [inset(0.08, 0.66), inset(0.08 + 0.84 * g, 0.66), inset(0.08 + 0.84 * g, 0.9), inset(0.08, 0.9)], rgba(GREEN, 0.35 + 0.6 * (o.pressed || 0)), GREEN, 3);
    }
    if (o.late != null && red) {                                     // fix arrives on an already-red screen
      V.poly(ctx, [inset(0.1, 0.74), inset(0.1 + 0.4 * o.late, 0.74), inset(0.1 + 0.4 * o.late, 0.86), inset(0.1, 0.86)], GREEN, null);
    }
  }

  // the corridor, drawn in 3D
  function corridor(ctx, cam, h, { mode = 'real', lights = 1, windowA = 1, hero = null, t = 0 } = {}) {
    const V = mk(cam);
    gridBG(ctx, 80, [cam.x * 40, 0], 'rgba(200,210,225,0.025)');
    // far wall and window onto the city
    const fw = [[-HW, CEIL, ZFAR], [HW, CEIL, ZFAR], [HW, FLOOR, ZFAR], [-HW, FLOOR, ZFAR]];
    V.poly(ctx, fw, BG2, INK, 3);
    const win = V.poly(ctx, [[-1.25, -0.9, ZFAR], [1.25, -0.9, ZFAR], [1.25, 0.5, ZFAR], [-1.25, 0.5, ZFAR]], '#161b21', INK, 3);
    if (win) {
      const a = V.pt(-1.25, -0.9, ZFAR), b = V.pt(1.25, 0.5, ZFAR);
      if (a && b) { const [x1, y1] = a, [x2, y2] = b, W = x2 - x1, H = y2 - y1;
        ctx.save(); ctx.beginPath(); ctx.rect(x1, y1, W, H); ctx.clip();
        // skyline
        const sk = L.rng(77); ctx.strokeStyle = FAINT; ctx.lineWidth = 2; ctx.beginPath(); let x = x1; ctx.moveTo(x1, y2);
        while (x < x2) { const bh = H * (0.15 + sk() * 0.45), bw = W * (0.05 + sk() * 0.08); ctx.lineTo(x, y2 - bh); ctx.lineTo(x + bw, y2 - bh); ctx.lineTo(x + bw, y2); x += bw; } ctx.stroke();
        ctx.restore();
        const gp = (fx, fy, on, r) => { const gx = x1 + W * fx, gy = y1 + H * fy; if (on <= 0) { ctx.fillStyle = FAINT; ctx.beginPath(); ctx.arc(gx, gy, r * 0.5, 0, 7); ctx.fill(); return; }
          glow(ctx, gx, gy, r * 4, GREEN, 0.55 * on * windowA); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(gx, gy, r, 0, 7); ctx.fill(); };
        const r0 = Math.max(6, W * 0.03);
        gp(0.22, 0.5, 1, r0); gp(0.4, 0.42, 1, r0 * 0.85); gp(0.8, 0.46, h >= KS ? L.clamp((h - KS) / 1.5, 0, 1) : 0, r0 * 0.85);
      }
    }
    // corridor edges
    const zn = cam.z + 0.1;
    [[-HW, CEIL], [HW, CEIL], [-HW, FLOOR], [HW, FLOOR]].forEach(([X, Y]) => V.line(ctx, [X, Y, zn], [X, Y, ZFAR], INK, 3));
    // floor tiles and ceiling tiles (blueprint grid)
    for (let z = Math.ceil(cam.z * 2) / 2; z < ZFAR; z += 0.5) { V.line(ctx, [-HW, FLOOR, z], [HW, FLOOR, z], FAINT, 2); V.line(ctx, [-HW, CEIL, z], [HW, CEIL, z], FAINT, 2); }
    [-0.75, 0, 0.75].forEach(X => { V.line(ctx, [X, FLOOR, zn], [X, FLOOR, ZFAR], FAINT, 2); V.line(ctx, [X, CEIL, zn], [X, CEIL, ZFAR], FAINT, 2); });
    // ceiling lights
    for (let i = 0; i < 9; i++) { const z = 1.2 + i * 1.2; const on = lights; V.poly(ctx, [[-0.35, CEIL, z], [0.35, CEIL, z], [0.35, CEIL, z + 0.5], [-0.35, CEIL, z + 0.5]], on > 0 ? rgba('#e6e9ee', (0.08 + 0.3 * on) * L.clamp((z - cam.z) / 2.5, 0.25, 1)) : BG2, INK, 2); }
    // bays: door frames between screens
    for (let i = 0; i <= 7; i++) { const z = Z0 + i * BAY - 0.15; [-1, 1].forEach(sd => { V.line(ctx, [sd * HW, CEIL, z], [sd * HW, FLOOR, z], DIM, 2); V.line(ctx, [sd * HW, CEIL + 0.25, z], [sd * HW, CEIL + 0.25, z + 0.3], FAINT, 2); }); }
    // handrails
    [-1, 1].forEach(sd => V.line(ctx, [sd * HW, 0.7, zn], [sd * HW, 0.7, ZFAR], FAINT, 3));
    // screens, far to near
    wardScreens.slice().sort((a, b) => b.z1 - a.z1).forEach(s => screenFace(ctx, V, s, h, mode, s === HERO && hero ? { ...hero, light: lights } : { light: lights }));
    return V;
  }

  // ---------- POV hands (blueprint line drawing) ----------
  function hand(ctx, x, y, s, rot, { flip = 1, point = 0 } = {}) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s * flip, s);
    ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    const st = () => { ctx.fillStyle = BG2; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3.2 / s; ctx.stroke(); };
    // sleeve / forearm to the bottom edge
    ctx.beginPath(); ctx.moveTo(-52, 60); ctx.lineTo(-70, 420); ctx.lineTo(70, 420); ctx.lineTo(52, 60); st();
    ctx.strokeStyle = DIM; ctx.lineWidth = 2 / s; ctx.beginPath(); ctx.moveTo(-64, 250); ctx.lineTo(64, 250); ctx.stroke();
    // fingers (index to little), index may be extended to point
    const fingers = [[-38, 88, 22], [-12, 100, 23], [14, 94, 22], [38, 74, 19]];
    fingers.forEach(([fx, len, w], i) => { const L2 = i === 0 ? L.lerp(len, len * 1.15, point) : L.lerp(len, len * 0.45, point);
      ctx.beginPath(); ctx.roundRect(fx - w / 2, -70 - L2, w, L2 + 30, w / 2); st();
      ctx.strokeStyle = FAINT; ctx.lineWidth = 1.6 / s; ctx.beginPath(); ctx.moveTo(fx - w / 2 + 3, -70 - L2 * 0.45); ctx.lineTo(fx + w / 2 - 3, -70 - L2 * 0.45); ctx.stroke(); });
    // palm
    ctx.beginPath(); ctx.roundRect(-55, -80, 110, 150, 30); st();
    // thumb
    ctx.save(); ctx.translate(-50, -5); ctx.rotate(-0.75); ctx.beginPath(); ctx.roundRect(-13, -78, 26, 84, 13); st(); ctx.restore();
    ctx.beginPath(); ctx.roundRect(-55, -80, 110, 150, 30); ctx.strokeStyle = INK; ctx.lineWidth = 3.2 / s; ctx.stroke();
    // construction centre line
    ctx.setLineDash([10 / s, 8 / s]); ctx.strokeStyle = FAINT; ctx.lineWidth = 1.5 / s; ctx.beginPath(); ctx.moveTo(0, -200); ctx.lineTo(0, 120); ctx.stroke(); ctx.setLineDash([]);
    ctx.restore();
  }
  // the station counter in the foreground (3D) with keyboard
  function counter(ctx, V) {
    V.poly(ctx, [[-1.3, 0.55, 0.42], [1.3, 0.55, 0.42], [1.3, 0.55, 1.0], [-1.3, 0.55, 1.0]], BG2, INK, 3);
    V.poly(ctx, [[-1.3, 0.55, 1.0], [1.3, 0.55, 1.0], [1.3, 1.6, 1.0], [-1.3, 1.6, 1.0]], '#1a1f26', INK, 3);
    V.poly(ctx, [[-0.32, 0.55, 0.5], [0.32, 0.55, 0.5], [0.32, 0.55, 0.72], [-0.32, 0.55, 0.72]], '#1a1f26', DIM, 2);
    for (let k = 1; k < 4; k++) V.line(ctx, [-0.3, 0.55, 0.5 + k * 0.055], [0.3, 0.55, 0.5 + k * 0.055], FAINT, 1.5);
  }

  // ---------- the plan (top-down blueprint) ----------
  function planCam(ctx, cx, cy, z) { ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-cx, -cy); }
  const toScr = (cx, cy, z, x, y) => [540 + (x - cx) * z, 960 + (y - cy) * z];
  function plan(ctx, h, cam, { mode = 'real', youAt = YOU0, t = 0, labels = 1, lights = 1 } = {}) {
    const [cx, cy, z] = cam;
    gridBG(ctx, 60 * Math.max(0.5, Math.min(2, z)), [-(cx * z) % 60, -(cy * z) % 60]);
    ctx.save(); planCam(ctx, cx, cy, z);
    const lw = w => w / z;
    // city streets (major grid)
    ctx.strokeStyle = rgba('#c8d2e1', 0.09); ctx.lineWidth = lw(2);
    for (let x = -2600; x <= 3400; x += 500) { ctx.beginPath(); ctx.moveTo(x, -4200); ctx.lineTo(x, 3400); ctx.stroke(); }
    for (let y = -4200; y <= 3400; y += 500) { ctx.beginPath(); ctx.moveTo(-2600, y); ctx.lineTo(3400, y); ctx.stroke(); }
    // generic blocks
    const br = L.rng(9);
    for (let bx = -2500; bx < 3300; bx += 500) for (let by = -4100; by < 3300; by += 500) { const w = 300 + br() * 120, hh = 260 + br() * 140; ctx.strokeStyle = rgba('#c8d2e1', 0.14); ctx.lineWidth = lw(2); ctx.strokeRect(bx + 50, by + 50, w, hh); }
    // other organisations
    BLD.forEach(b => { ctx.fillStyle = BG2; ctx.fillRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h); ctx.strokeStyle = DIM; ctx.lineWidth = lw(3); ctx.strokeRect(b.x - b.w / 2, b.y - b.h / 2, b.w, b.h); });
    // hospital outline and the ward
    ctx.fillStyle = BG; ctx.fillRect(HOSP.x - HOSP.w / 2, HOSP.y - HOSP.h / 2, HOSP.w, HOSP.h);
    ctx.strokeStyle = INK; ctx.lineWidth = lw(3); ctx.strokeRect(HOSP.x - HOSP.w / 2, HOSP.y - HOSP.h / 2, HOSP.w, HOSP.h);
    const [wx1, wy1] = P(-HW, ZFAR), [wx2, wy2] = P(HW, -0.4);
    ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.beginPath(); ctx.moveTo(wx1, wy1); ctx.lineTo(wx1, wy2); ctx.moveTo(wx2, wy1); ctx.lineTo(wx2, wy2); ctx.stroke();
    ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(wx1 - 240, wy1); ctx.lineTo(wx2 + 240, wy1); ctx.moveTo(wx1 - 240, wy2); ctx.lineTo(wx2 + 240, wy2); ctx.moveTo(wx1 - 240, wy1); ctx.lineTo(wx1 - 240, wy2); ctx.moveTo(wx2 + 240, wy1); ctx.lineTo(wx2 + 240, wy2); ctx.stroke();
    ctx.strokeStyle = rgba(INK, 0.8); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(wx1 - 60, wy1 + 1); ctx.lineTo(wx2 + 60, wy1 + 1); ctx.stroke();       // window
    for (let i = 0; i <= 7; i++) { const [, yy] = P(0, Z0 + i * BAY - 0.15); [-1, 1].forEach(sd => { const xw = sd < 0 ? wx1 : wx2; ctx.strokeStyle = DIM; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(xw, yy); ctx.lineTo(xw + sd * 240, yy); ctx.stroke(); }); }
    // beds and door swings in each bay
    for (let i = 0; i < 7; i++) { const [, ya] = P(0, Z0 + i * BAY + 0.95); [-1, 1].forEach(sd => { const xw = sd < 0 ? wx1 : wx2; ctx.strokeStyle = DIM; ctx.lineWidth = 2; ctx.strokeRect(sd < 0 ? xw - 200 : xw + 80, ya, 120, 50);
      ctx.beginPath(); ctx.arc(xw, ya + 10, 30, sd < 0 ? Math.PI : -Math.PI / 2, sd < 0 ? 1.5 * Math.PI : 0); ctx.stroke(); }); }
    // nurse station counter
    const [sx1, sy1] = P(-1.3, 1.0), [sx2, sy2] = P(1.3, 0.42); ctx.fillStyle = BG2; ctx.fillRect(sx1, sy1, sx2 - sx1, sy2 - sy1); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(sx1, sy1, sx2 - sx1, sy2 - sy1);
    // dimension line along the corridor
    ctx.strokeStyle = FAINT; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(wx2 + 290, wy1); ctx.lineTo(wx2 + 290, wy2); ctx.stroke();
    [wy1, wy2].forEach(yy => { ctx.beginPath(); ctx.moveTo(wx2 + 275, yy); ctx.lineTo(wx2 + 305, yy); ctx.stroke(); });
    // screens (all)
    const scr = (s, sz) => { const red = isRed(s, h, mode), rf = red ? L.clamp((h - s.rh) / 0.35, 0, 1) : 0;
      if (rf > 0) glow(ctx, s.px, s.py, sz * 3.5, RED, 0.35 * rf * lights);
      ctx.fillStyle = rf > 0 ? RED : '#2c333c'; ctx.strokeStyle = rf > 0 ? RED : INK; ctx.lineWidth = lw(2); ctx.fillRect(s.px - sz / 2, s.py - sz / 2, sz, sz); ctx.strokeRect(s.px - sz / 2, s.py - sz / 2, sz, sz);
      if (mode === 'ai' && !red && h >= s.bld.ga) { ctx.strokeStyle = GREEN; ctx.lineWidth = lw(3); ctx.strokeRect(s.px - sz * 0.8, s.py - sz * 0.8, sz * 1.6, sz * 1.6); } };
    const ssz = Math.max(26, 9 / z);
    wardScreens.forEach(s => scr(s, Math.min(ssz, 40)));
    BLD.forEach(b => b.screens.forEach(s => scr(s, Math.max(60, 11 / z))));
    // human (or AI) routes: lines from the pieces to each organisation; arrival at g
    [HOSP, ...BLD].forEach(b => { const g = mode === 'ai' ? b.ga : b.gh, p = L.clamp(h / g, 0, 1); if (p <= 0) return;
      const tx = b === HOSP ? 540 : b.x, ty = b === HOSP ? HOSP.y - HOSP.h / 2 : b.y - b.h / 2;
      ctx.strokeStyle = GREEN; ctx.lineWidth = lw(b === HOSP ? 5 : 3.5); ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(HUB[0], HUB[1]); ctx.lineTo(L.lerp(HUB[0], tx, p), L.lerp(HUB[1], ty, p)); ctx.stroke();
      if (p >= 1) { ctx.lineWidth = lw(4); const bw = b === HOSP ? HOSP.w : b.w, bh = b === HOSP ? HOSP.h : b.h, bx = b === HOSP ? HOSP.x : b.x, by = b === HOSP ? HOSP.y : b.y; ctx.strokeRect(bx - bw / 2 - 20, by - bh / 2 - 20, bw + 40, bh + 40); } });
    // the pieces
    const piece = (p, on, r) => { glow(ctx, p[0], p[1], lw(70) + r * 2, GREEN, 0.5 * on); ctx.fillStyle = on > 0 ? GREEN : '#39414b'; ctx.strokeStyle = DARK; ctx.lineWidth = lw(3); ctx.beginPath(); ctx.arc(p[0], p[1], Math.max(r, lw(14)), 0, 7); ctx.fill(); ctx.stroke(); };
    piece(PIECES.patch, 1, 70); piece(PIECES.alert, 1, 60);
    const ksOn = h >= KS ? 1 : 0; piece(PIECES.res, ksOn, 60);
    if (ksOn) { const f = L.clamp((h - KS) / 12, 0, 1); ctx.strokeStyle = rgba(GREEN, 0.7 * (1 - f)); ctx.lineWidth = lw(5); ctx.beginPath(); ctx.arc(PIECES.res[0], PIECES.res[1], 80 + f * 6500, 0, 7); ctx.stroke(); }
    // you
    if (youAt) { ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(youAt[0], youAt[1], 9, 0, 7); ctx.fill();
      ctx.fillStyle = rgba(INK, 0.15); ctx.beginPath(); ctx.moveTo(youAt[0], youAt[1]); ctx.lineTo(youAt[0] - 60, youAt[1] - 150); ctx.lineTo(youAt[0] + 60, youAt[1] - 150); ctx.closePath(); ctx.fill(); }
    ctx.restore();
    // labels in screen space (fixed size)
    if (labels > 0) {
      const lab = (wp, text, col, dy = -40, al = 'center', size = 42) => { const [x, y] = toScr(cx, cy, z, wp[0], wp[1]); outlined(ctx, text, L.clamp(x, 120, 880), y + dy, size, col, { a: labels, align: al }); };
      if (z < 1.2) {
        lab(PIECES.patch, 'a patch', GREEN, 70); lab(PIECES.alert, 'an alert, unread', GREEN, -40);
        if (ksOn) lab(PIECES.res, 'a researcher', GREEN, 70);
        lab([HOSP.x, HOSP.y + HOSP.h / 2], 'her ward', INK, 50);
      }
      if (youAt && z > 0.9) { const [x, y] = toScr(cx, cy, z, youAt[0], youAt[1]); outlined(ctx, 'you', x + 40, y + 12, 44, INK, { a: labels, align: 'left' }); }
    }
  }

  // ---------- HUD clock (hands only, no digits) ----------
  function hudClock(ctx, h, a = 1, label = 'real hours, log clock') {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; const cx = 150, cy = 1430, r = 46;
    ctx.fillStyle = rgba(DARK, 0.75); ctx.beginPath(); ctx.arc(cx, cy, r + 6, 0, 7); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke();
    for (let i = 0; i < 12; i++) { const an = i / 12 * 6.283; seg(ctx, cx + Math.sin(an) * r * 0.8, cy - Math.cos(an) * r * 0.8, cx + Math.sin(an) * r * 0.93, cy - Math.cos(an) * r * 0.93, INK, 2.5); }
    const clockH = 7.75 + h, ha = clockH / 12 * 6.283, ma = clockH * 6.283;   // outbreak began 07:45 UTC (s1)
    seg(ctx, cx, cy, cx + Math.sin(ha) * r * 0.5, cy - Math.cos(ha) * r * 0.5, INK, 6);
    seg(ctx, cx, cy, cx + Math.sin(ma) * r * 0.78, cy - Math.cos(ma) * r * 0.78, INK, 3);
    outlined(ctx, label, cx + 68, cy + 12, 36, '#b9c0ca', { align: 'left' });
    ctx.restore();
  }
  function windFX(ctx, t, a) {
    if (a <= 0) return; ctx.save(); ctx.fillStyle = `rgba(29,34,41,${0.45 * a})`; ctx.fillRect(0, 0, 1080, 1920);
    const r = L.rng(90 + Math.floor(t * 15)); for (let i = 0; i < 6; i++) { ctx.fillStyle = `rgba(216,220,226,${0.08 * a})`; ctx.fillRect(0, r() * 1920, 1080, 3 + r() * 10); }
    ctx.restore();
  }

  // ---------- cameras ----------
  // POV walk: at the station until 4.2 s, then steps down the corridor
  const walkZ = t => L.lerp(0, 1.5, L.ease.inOut(L.clamp((t - 4.2) / 2.7, 0, 1)));
  const povCam = t => { const w = L.clamp((t - 4.2) / 2.7, 0, 1), walking = w > 0 && w < 1 ? Math.sin(Math.PI * w) : 0;
    const ph = (t - 4.2) * 2 * Math.PI * 1.05; return { x: 0.06 * Math.sin(ph / 2) * walking, z: walkZ(t) + 0.02 * Math.sin(t * 0.8), yaw: 0.015 * Math.sin(t * 0.6), pitch: 0, bob: 14 * Math.abs(Math.sin(ph)) * walking }; };
  const craneTilt = t => ({ ...povCam(6.9), pitch: 1.1 * L.ease.inOut(L.clamp((t - 6.9) / 0.7, 0, 1)) });
  const LN = Math.log;
  const upKeys = [[7.4, [YOU1[0], YOU1[1], LN(2.4)]], [7.8, [YOU1[0], YOU1[1] - 20, LN(2.3)]], [10.4, [560, -330, LN(0.27)]], [12.2, [575, -315, LN(0.278)]], [13.7, [YOU1[0], YOU1[1] - 30, LN(2.8)]]];
  const planKey = t => { const [x, y, lz] = L.key(upKeys, t); return [x, y, Math.exp(lz)]; };
  // drop-in, closer: facing the bedside screen
  const closeCam = t => ({ x: -0.55, z: 2.05 + 0.05 * L.sm(13.6, 16.9, t), yaw: 0.62, pitch: 0.02, bob: 0 });
  const closestCam = t => ({ x: -0.8 - 0.08 * L.sm(24.4, 26.5, t), z: 2.3 + 0.12 * L.sm(24.4, 26.5, t), yaw: 0.72, pitch: 0.03, bob: 0 });

  // panels for the snap: city rotated to fit a wide panel
  function panel(ctx, x, y, w, hh, h, mode, a) {
    const zc = Math.min(w / 6200, hh / 4500);
    ctx.save(); ctx.globalAlpha = a; ctx.beginPath(); ctx.rect(x, y, w, hh); ctx.clip();
    ctx.translate(x + w / 2, y + hh / 2); ctx.rotate(-Math.PI / 2); ctx.scale(zc / 0.262, zc / 0.262); ctx.translate(-540, -960);
    plan(ctx, h, [600, -250, 0.262], { mode, youAt: null, labels: 0 });
    ctx.restore();
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = DIM; ctx.lineWidth = 3; ctx.strokeRect(x, y, w, hh); ctx.restore();
  }

  // ---------- draw ----------
  function draw(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    const h = hourAt(t);

    if (t < 6.9) {                                            // SC1-3 POV at the station, then the walk
      const cam = povCam(t);
      const V = corridor(ctx, cam, h, { t });
      counter(ctx, V);
      const sit = 1 - L.sm(4.2, 4.8, t), drop = (1 - sit) * 700;
      if (sit > 0) { const br = Math.sin(t * 1.3) * 4; hand(ctx, 380 - br, 1560 + drop + br, 1.25, 0.18, { flip: 1 }); hand(ctx, 700 + br, 1575 + drop - br, 1.25, -0.2, { flip: -1 }); }
      if (t >= 1.4 && t < 2.1) windFX(ctx, t, 1 - L.sm(1.95, 2.1, t));
      hudClock(ctx, h, 1, t >= 1.4 && t < 2 ? 'winding back' : 'real hours, log clock');
      card(ctx, ['POV:', { text: 'the fix is', col: GREEN }, { text: 'across town.', col: GREEN }], 440, 100, t < 1.45 ? 1 - L.sm(1.3, 1.45, t) : 0);
      card(ctx, ['That morning.'], 470, 100, fadeIO(t, 1.5, 3.0, 0.2));
      card(ctx, ['One screen.'], 470, 100, fadeIO(t, 3.9, 5.1));
      card(ctx, ['Then the next.'], 470, 100, fadeIO(t, 5.1, 6.3));
      card(ctx, ['Then the ward.'], 470, 100, fadeIO(t, 6.3, 7.5));
      L.slate(ctx, t < 1.4 ? 'SC 1  POV  station, cold open' : t < 2 ? 'SC 1  wind back to that morning' : t < 4.2 ? 'SC 2  POV  hands on the counter' : 'SC 3  POV WALK  down the ward');
    } else if (t < 12.2) {                                    // SC4 CRANE UP through the ceiling, to the plan, to the city
      const pf = L.sm(7.35, 7.8, t);
      if (pf > 0) plan(ctx, h, planKey(Math.max(t, 7.4)), { youAt: YOU1, labels: 1 });
      if (pf < 1) { ctx.save(); ctx.globalAlpha = 1 - pf; const V = corridor(ctx, craneTilt(t), h, { t }); ctx.restore(); }
      hudClock(ctx, h);
      card(ctx, ['Across town,', { text: 'one person finds a stop.', col: GREEN }], 800, 84, fadeIO(t, 7.6, 9.2));
      card(ctx, ['Partly luck.'], 840, 110, fadeIO(t, 9.3, 10.7));
      card(ctx, ['The patch is', 'already written.'], 800, 92, fadeIO(t, 10.8, 12.3));
      L.slate(ctx, t < 7.8 ? 'SC 4  CRANE UP  through the ceiling' : t < 10.4 ? 'SC 4  CRANE UP  ward plan to city' : 'SC 4  WIDE  hold');
    } else if (t < 14.3) {                                    // SC5 DROP DOWN, closer
      const pf = 1 - L.sm(13.45, 13.85, t);
      const lights = 1 - L.sm(13.9, 14.3, t);
      if (pf < 1) { const late = L.sm(13.5, 14.0, t); corridor(ctx, closeCam(t), h, { lights, hero: { late } });
        hand(ctx, 720, 1500 - 120 * L.sm(13.6, 14.3, t), 1.45, -0.55, { flip: -1, point: 0.3 }); }
      if (pf > 0) { ctx.save(); ctx.globalAlpha = pf; plan(ctx, h, planKey(t), { youAt: YOU1, labels: 1 - L.sm(12.3, 12.8, t) }); ctx.restore(); }
      if (lights < 1) { ctx.fillStyle = `rgba(6,8,11,${0.55 * (1 - lights)})`; ctx.fillRect(0, 0, 1080, 1920); }
      hudClock(ctx, h);
      card(ctx, ['The fix', 'arrives after.'], 400, 104, fadeIO(t, 12.4, 14.3));
      L.slate(ctx, t < 13.6 ? 'SC 5  DROP DOWN  to you' : 'SC 5  POV  closer, bedside');
    } else if (t < 17.4) {                                    // SC6 reveal line, lights out; then freeze
      corridor(ctx, closeCam(t), SPAN, { lights: 0, hero: { late: 1 } });
      hand(ctx, 720, 1380, 1.45, -0.55, { flip: -1, point: 0.3 });
      ctx.fillStyle = 'rgba(6,8,11,0.55)'; ctx.fillRect(0, 0, 1080, 1920);
      card(ctx, ['We slowed it down', 'so you could see it.'], 560, 92, fadeIO(t, 14.4, 16.9));
      L.slate(ctx, t < 16.9 ? 'SC 6  POV  hold, dark' : 'SC 6  freeze');
    } else if (t < 24.4) {                                    // SC7 SNAP: true speed vs AI route (illustrative)
      const pa = L.sm(17.4, 17.6, t), sh = snapHour(t);
      gridBG(ctx);
      panel(ctx, 70, 330, 940, 520, sh, 'real', pa);
      panel(ctx, 70, 960, 940, 520, sh, 'ai', pa);
      outlined(ctx, 'true speed', 90, 300, 56, INK, { font: SERIF, a: pa, align: 'left' });
      outlined(ctx, 'every place routed:', 90 , 800, 44, '#c3c9d2', { a: pa * L.sm(21.4, 21.7, t), align: 'left' });
      outlined(ctx, '1 week', 450, 815, 110, INK, { font: SERIF, a: L.sm(21.5, 21.8, t), align: 'left' });
      outlined(ctx, 'frontier AI route', 90, 932, 56, GREEN, { font: SERIF, a: pa, align: 'left' });
      outlined(ctx, 'illustrative', 880, 932, 48, INK, { a: pa, align: 'right' });
      outlined(ctx, 'every place routed:', 90, 1430, 44, '#c3c9d2', { a: pa * L.sm(17.8, 18.1, t), align: 'left' });
      outlined(ctx, '8 h', 450, 1445, 110, GREEN, { font: SERIF, a: L.sm(17.9, 18.2, t), align: 'left' });
      outlined(ctx, 'same red, same week', 90, 1520, 40, '#9aa3ae', { a: pa, align: 'left' });
      L.slate(ctx, 'SC 7  SNAP  true speed, stacked');
    } else if (t < 28.0) {                                    // SC8 DOLLY IN, closest: the line reaches her, she applies
      const lt = t - 24.4, ah = 2.6 + lt * 0.4, apply = L.sm(0.2, 1.2, lt), press = L.sm(2.0, 2.2, lt);
      corridor(ctx, closestCam(t), ah, { mode: 'ai', lights: 1, hero: { apply, pressed: press } });
      const reach = L.sm(1.0, 2.1, lt);
      hand(ctx, L.lerp(760, 470, reach), L.lerp(1720, 1180, reach) + press * 10, 1.5, L.lerp(-0.5, -0.9, reach), { flip: -1, point: reach });
      outlined(ctx, 'illustrative', 540, 330, 50, INK, { a: L.sm(24.4, 24.7, t) });
      card(ctx, ['A line reaches her.'], 470, 92, fadeIO(t, 24.6, 26.3));
      card(ctx, [{ text: 'She applies it.', col: GREEN }], 470, 100, fadeIO(t, 26.4, 28.0));
      L.slate(ctx, 'SC 8  DOLLY IN  closest');
    } else if (t < 30.8) {
      gridBG(ctx);
      card(ctx, ['This is', 'the bottleneck.'], 820, 124, fadeIO(t, 28.1, 30.8, 0.35));
      L.slate(ctx, 'SC 9  title');
    } else {
      gridBG(ctx);
      L.endCard(ctx, L.sm(30.8, 31.3, t));
    }
    L.grain(ctx, t, { alpha: 0.04 });
  }

  const tKS = tOfHour(KS), heroRed = tOfHour(HERO.rh);
  const wardT = wardScreens.map(s => tOfHour(s.rh)).sort((a, b) => a - b);
  const cues = [{ t: 1.4, type: 'whoosh' }, { t: tKS, type: 'ding' }, { t: 6.95, type: 'whoosh' }, { t: 12.3, type: 'whoosh' }, { t: 13.9, type: 'bonk' }, { t: 17.4, type: 'hit' }, { t: 26.5, type: 'pop' }, { t: 28.1, type: 'hit' }];
  [wardT[0], wardT[3], wardT[7], wardT[11]].forEach(tt => { if (tt > 2) cues.push({ t: tt, type: 'stamp' }); });
  return { draw, DUR,
    acts: [{ start: 0, end: 14.3, bpm: 0, drone: true }, { start: 2, end: 7, bpm: 132 }, { start: 14.3, end: 17.2, bpm: 0, drone: true }, { start: 17.4, end: 24.4, bpm: 0, drone: true }, { start: 24.4, end: 36, bpm: 0, drone: true }],
    cues,
    _debug: { tKS, heroRed, heroRh: HERO.rh, wardT, wardRh: wardScreens.map(s => +s.rh.toFixed(2)), hospG: HOSP.gh, hospAI: HOSP.ga, tHospG: tOfHour(HOSP.gh),
      savedWard: wardScreens.filter(s => s.rh >= HOSP.ga).length, N: ALL.length, savedAll: ALL.filter(s => s.rh >= s.bld.ga).length } };
}
module.exports = makeScene;
