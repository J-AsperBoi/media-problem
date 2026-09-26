// before-the-dark: before-after, woodblock, city. Analog: blackout-2003.
// One stated mapping (both halves): 1 film second = 10 minutes. Event hours after 14:14: h = (t - T0) / 6.
// BEFORE: T0 = 1.4 s. AFTER (illustrative): T0 = 20 s. Cold open (0-1.4 s) is a flash-forward to h = 1.93.
// Red = analog threat.points (extent interpolated linearly). Green = fragments f1-f5 lit at ready_at;
// links at L.lognormalQuantile(q, median 1.5 h, p90 1.83 h), never before both ends are lit.
// AI half = ai_counterfactual (0.25 h routed warning), labeled illustrative. See output/before-the-dark/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('blackout-2003');
  const DUR = 38.4, RED = L.RED, GREEN = L.GREEN;
  const PAPER = '#d3cdc0', INK = '#22211e', FARC = '#77746d', MIDC = '#58564f', GRD = '#9e998e';
  const LIT = '#efe8d4', DARKW = '#262522', SHED = '#8d897f', SHADOW = 'rgba(20,19,17,0.45)';
  const rgbaG = a => `rgba(52,210,123,${a})`, rgbaR = a => `rgba(255,59,48,${a})`;

  // ---------------- time mapping ----------------
  const T0B = 1.4, T0A = 20.0, SPF = 6;
  const HOOK_H = 1.93;
  const PTS = A.threat.points;
  const extent = h => { if (h <= PTS[0].t) return 0; for (let i = 0; i < PTS.length - 1; i++) { const a = PTS[i], b = PTS[i + 1]; if (h <= b.t) return L.lerp(a.extent, b.extent, (h - a.t) / (b.t - a.t)); } return 1; };
  const TRIPS = PTS.filter(p => p.t > 0 && p.extent === 0).map(p => p.t);      // 0.85, 1.30, 1.45
  const NORETURN = PTS.find(p => p.extent > 0 && p.extent < 1).t;               // 1.87
  const DONE = PTS[PTS.length - 1].t;                                            // 1.98
  const XL = 380, XR = 1640;

  const FR = {}; A.solution.fragments.forEach(f => FR[f.id] = f);
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;
  const AIH = A.ai_counterfactual.aggregation_median;                           // 0.25 h
  const LINKS = [{ a: 'f1', b: 'f4', q: 0.10 }, { a: 'f4', b: 'f2', q: 0.35 }, { a: 'f2', b: 'f3', q: 0.60 }, { a: 'f2', b: 'f5', q: 0.95 }];
  LINKS.forEach(k => k.h = Math.max(L.lognormalQuantile(k.q, MED, P90), FR[k.a].ready_at, FR[k.b].ready_at));
  const FAILS = [{ a: 'f1', b: 'f2', h0: 0.16, h1: 0.40 }, { a: 'f4', b: 'f2', h0: 0.88, h1: 1.08 }];

  // ---------------- world (design units; wide shot = zoom 0.675 around (800,1450)) ----------------
  const ZW = 0.675, CW = [800, 1450];
  const r = L.rng(2003);
  const jpoly = (x0, y0, x1, y1, j) => { const p = []; const n = Math.max(2, Math.round((x1 - x0) / 40));
    for (let i = 0; i <= n; i++) p.push([L.lerp(x0, x1, i / n), y0 + (r() - 0.5) * j]);
    p.push([x1 + (r() - 0.5) * j, y1]); p.push([x0 + (r() - 0.5) * j, y1]); return p; };
  function mkBuilding(x, w, top, base, winW, winH, gx, gy) {
    const b = { x, w, top, base, poly: jpoly(x, top, x + w, base, 5), win: [], grain: [] };
    for (let yy = top + 26; yy < base - 40; yy += gy) for (let xx = x + 12; xx + winW < x + w - 8; xx += gx) b.win.push({ x: xx, y: yy, w: winW, h: winH, n: r() });
    for (let k = 0; k < 3 + Math.floor(w / 50); k++) { const gx0 = x + 8 + r() * (w - 16), ph = r() * 6, pl = [];
      for (let yy = top + 10; yy <= base; yy += 40) pl.push([gx0 + Math.sin(yy * 0.02 + ph) * 5, yy]); b.grain.push(pl); }
    return b;
  }
  // fragment targets in the far layer
  const FT = { f2: [520, 900], f3: [1100, 760], f4: [1300, 1130] };
  const far = []; { let x = XL + 10; while (x < 1580) { const w = 80 + r() * 80; let top = 640 + r() * 620;
    Object.values(FT).forEach(([fx, fy]) => { if (fx > x + 20 && fx < x + w - 20) top = Math.min(top, fy - 140 - r() * 120); });
    far.push(mkBuilding(x, w, top, 1740, 11, 16, 24, 32)); x += w + 6 + r() * 16; } }
  const FRAG = {};
  Object.entries(FT).forEach(([id, [fx, fy]]) => { const b = far.find(b => fx > b.x && fx < b.x + b.w);
    let best = b.win[0]; b.win.forEach(w => { if (Math.hypot(w.x - fx, w.y - fy) < Math.hypot(best.x - fx, best.y - fy)) best = w; });
    best.frag = id; FRAG[id] = { layer: 0.45, x: best.x + best.w / 2, y: best.y + best.h / 2 }; });
  const mid = []; { let x = -30; while (x < 1640) { const w = 70 + r() * 90; const top = 1480 + r() * 200;
    const b = mkBuilding(x, w, top, 1910, 12, 14, 26, 30); b.shed = x < 460; mid.push(b); x += w + 4 + r() * 10; } }
  const PYL = [0, 1, 2, 3].map(i => ({ x: -20 + i * 130, y: 1700 }));   // far-layer pylons, wire at y-330
  const HERO = { x: 800, y: 2000, s: 1.5 };
  FRAG.f1 = { layer: 1, x: HERO.x + 30 * HERO.s, y: HERO.y - 146 * HERO.s };
  const SUB = { x: 240, y: 2190 };
  FRAG.f5 = { layer: 1, x: SUB.x, y: SUB.y - 70 };
  const crowd = []; { const rc = L.rng(77); while (crowd.length < 46) { const y = 1935 + rc() * 760, x = rc() * 1600;
    if (Math.abs(x - HERO.x) < 90 && y < 2080) continue; if (Math.hypot(x - SUB.x, y - SUB.y) < 170) continue;
    crowd.push({ x, y, s: 0.42 + (y - 1935) / 760 * 0.25 + rc() * 0.08, v: (rc() - 0.5) * 14, ph: rc() * 6, dir: rc() < 0.5 ? -1 : 1 }); } }
  crowd.sort((a, b) => a.y - b.y);
  const grain = []; { const rg = L.rng(9); for (let i = 0; i < 110; i++) grain.push({ y: rg() * 1920, a: 3 + rg() * 9, f: 0.004 + rg() * 0.01, ph: rg() * 6, w: 1 + rg() * 2.5 }); }
  const specks = []; { const rs = L.rng(11); for (let i = 0; i < 420; i++) specks.push([rs() * 1080, rs() * 1920, 1 + rs() * 2.5]); }
  const labels = { f1: 'knows the alarms are dead', f2: 'can cut the load', f3: 'has the map', f4: 'saw lines trip', f5: 'the fix' };

  // ---------------- camera ----------------
  const camKey = (keys, t) => { if (t <= keys[0][0]) return keys[0][1];
    for (let i = 0; i < keys.length - 1; i++) { const [a, A1] = keys[i], [b, B] = keys[i + 1]; if (t <= b) { const f = L.ease.inOut((t - a) / (b - a));
      return [L.lerp(A1[0], B[0], f), L.lerp(A1[1], B[1], f), Math.exp(L.lerp(Math.log(A1[2]), Math.log(B[2]), f))]; } }
    return keys[keys.length - 1][1]; };
  const CLOSE = [800, 1830, 3.0];
  const KB = [[1.4, CLOSE], [4.6, [800, 1822, 3.15]], [8.0, [800, 1450, ZW]], [10.6, [812, 1440, 0.69]], [12.3, [800, 1795, 3.7]], [13.4, [800, 1790, 3.95]]];
  const KA = [[20, CLOSE], [21.3, [800, 1825, 3.1]], [24.0, [800, 1450, ZW]], [27.4, [812, 1440, 0.69]], [29.6, [800, 1782, 4.4]], [32, [800, 1776, 4.8]]];
  const layerCam = (cam, p) => { const z = cam[2]; if (Math.abs(z - ZW) < 1e-4) return cam; const zl = ZW * Math.pow(z / ZW, p); const u = (zl - ZW) / (z - ZW);
    return [CW[0] + (cam[0] - CW[0]) * u, CW[1] + (cam[1] - CW[1]) * u, zl]; };
  const toS = (lc, x, y) => [540 + (x - lc[0]) * lc[2], 960 + (y - lc[1]) * lc[2]];
  const apply = (c, lc) => { c.translate(540, 960); c.scale(lc[2], lc[2]); c.translate(-lc[0], -lc[1]); };

  // ---------------- state ----------------
  function state(mode, h, t) {
    const S = { mode, h, t };
    if (mode === 'before') {
      S.ext = extent(h); S.xf = XL + S.ext * (XR - XL);
      S.trip = TRIPS.map(th => L.sm(th, th + 0.03, h)); S.trip.push(L.sm(NORETURN - 0.02, NORETURN, h));
      S.redFade = 1 - 0.55 * L.sm(DONE, DONE + 0.05, h);
      S.lit = id => h >= FR[id].ready_at;
      S.litA = id => L.sm(FR[id].ready_at, FR[id].ready_at + 0.04, h);
      S.lever = 0; S.shed = 0;
    } else {
      S.ext = 0; S.xf = -9999;
      S.trip = [L.sm(TRIPS[0], TRIPS[0] + 0.03, h) * (1 - L.sm(0.98, 1.2, h)), 0, 0, 0];
      S.redFade = 1;
      const on = id => id === 'f1' ? FR.f1.ready_at : AIH;
      S.lit = id => h >= on(id); S.litA = id => L.sm(on(id), on(id) + 0.03, h);
      S.lever = L.sm(TRIPS[0] + 0.02, TRIPS[0] + 0.08, h); S.shed = L.sm(TRIPS[0] + 0.06, TRIPS[0] + 0.14, h);
    }
    S.awe = mode === 'before' ? L.sm(1.62, 1.75, h) : L.sm(1.2, 1.4, h);
    return S;
  }

  // ---------------- drawing helpers ----------------
  const poly = (c, p) => { c.beginPath(); p.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); };
  function drawBuildings(c, list, col, S, layerP) {
    list.forEach(b => { c.save(); c.translate(6, 5); c.fillStyle = SHADOW; poly(c, b.poly); c.fill(); c.restore();
      c.fillStyle = col; poly(c, b.poly); c.fill();
      c.strokeStyle = 'rgba(235,228,210,0.10)'; c.lineWidth = 2.2; b.grain.forEach(pl => { c.beginPath(); pl.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); });
      c.strokeStyle = INK; c.lineWidth = 3; poly(c, b.poly); c.stroke(); });
    const lit = new Path2D(), dark = new Path2D(), shed = new Path2D();
    list.forEach(b => b.win.forEach(w => { if (w.frag) return;
      if (S.ext > 0 && w.x < S.xf - 20 + w.n * 40) dark.rect(w.x, w.y, w.w, w.h);
      else if (b.shed && S.shed > w.n) shed.rect(w.x, w.y, w.w, w.h);
      else lit.rect(w.x, w.y, w.w, w.h); }));
    c.fillStyle = LIT; c.fill(lit); c.fillStyle = SHED; c.fill(shed); c.fillStyle = DARKW; c.fill(dark);
    // red at the front: rooftops just swept, and the carved crack
    if (S.ext > 0 && S.ext < 1) { const a = S.redFade;
      c.strokeStyle = rgbaR(a); c.lineWidth = 6; c.lineCap = 'round';
      list.forEach(b => { if (b.x + b.w > S.xf - 200 && b.x < S.xf) { c.beginPath(); const tp = b.poly.slice(0, b.poly.length - 2);
        tp.forEach(([x, y], i) => { const xx = Math.min(x, S.xf); i ? c.lineTo(xx, y) : c.moveTo(xx, y); }); c.stroke(); } });
      const top = Math.min(...list.map(b => b.top)) - 30, base = list[0].base;
      c.strokeStyle = rgbaR(0.22 * a); c.lineWidth = 34; crack(c, S.xf, top, base, S.t); c.strokeStyle = rgbaR(a); c.lineWidth = 8; crack(c, S.xf, top, base, S.t);
    }
  }
  function crack(c, x, y0, y1, t) { c.beginPath(); const n = 18; for (let i = 0; i <= n; i++) { const y = L.lerp(y0, y1, i / n); const xx = x + (L.noise(i * 1.3, 4 + Math.floor(t * 8)) - 0.5) * 46; i ? c.lineTo(xx, y) : c.moveTo(xx, y); } c.stroke(); }
  function wirePath(c, x0, x1, y0, sag, off) { c.beginPath(); for (let x = x0; x <= x1; x += 20) { const u = ((x - x0) / (x1 - x0)) * 2 - 1; const y = y0 + off + sag * (1 - u * u); x === x0 ? c.moveTo(x, y) : c.lineTo(x, y); } }

  function figure(c, x, y, s, o = {}) {
    const col = o.col || '#34322e', skin = o.skin || '#e9e2d1', mood = o.mood || 'calm', lk = o.look || [0, 0];
    c.save(); c.lineCap = 'round'; c.lineJoin = 'round';
    const sw = o.stride || 0;
    c.fillStyle = col; c.strokeStyle = col; c.lineWidth = 11 * s;
    c.beginPath(); c.moveTo(x - 9 * s, y - 58 * s); c.lineTo(x - 11 * s - sw * 8 * s, y - 2 * s); c.moveTo(x + 9 * s, y - 58 * s); c.lineTo(x + 11 * s + sw * 8 * s, y - 2 * s); c.stroke();
    c.beginPath(); c.moveTo(x - 23 * s, y - 122 * s); c.lineTo(x + 23 * s, y - 122 * s); c.lineTo(x + 32 * s, y - 52 * s); c.lineTo(x - 32 * s, y - 52 * s); c.closePath(); c.fill();
    c.strokeStyle = INK; c.lineWidth = 2.5 * s; c.stroke();
    // arms
    c.strokeStyle = col; c.lineWidth = 9 * s;
    c.beginPath(); c.moveTo(x - 21 * s, y - 116 * s); c.lineTo(x - 30 * s, y - 88 * s); c.lineTo(x - 30 * s, y - 64 * s); c.stroke();
    if (o.phone) { c.beginPath(); c.moveTo(x + 21 * s, y - 116 * s); c.lineTo(x + 40 * s, y - 100 * s); c.lineTo(x + 30 * s, y - 138 * s); c.stroke(); }
    else { c.beginPath(); c.moveTo(x + 21 * s, y - 116 * s); c.lineTo(x + 30 * s, y - 88 * s); c.lineTo(x + 30 * s, y - 64 * s); c.stroke(); }
    // head
    const hx = x, hy = y - 146 * s;
    c.fillStyle = skin; c.beginPath(); c.arc(hx, hy, 21 * s, 0, 7); c.fill(); c.strokeStyle = INK; c.lineWidth = 3 * s; c.stroke();
    c.fillStyle = INK; c.beginPath(); c.arc(hx, hy - 7 * s, 21.5 * s, Math.PI * 1.02, Math.PI * 1.98); c.fill();   // carved hair cap
    const ey = hy + 1 * s + lk[1] * 2 * s, er = (mood === 'awe' ? 3.6 : 2.8) * s;
    [-1, 1].forEach(d => { c.beginPath(); c.arc(hx + d * 7.5 * s + lk[0] * 2.5 * s, ey, er, 0, 7); c.fill(); });
    c.strokeStyle = INK; c.lineWidth = 2.2 * s; c.beginPath();
    if (mood === 'worried') { [-1, 1].forEach(d => { c.moveTo(hx + d * 12 * s, ey - 5 * s); c.lineTo(hx + d * 4 * s, ey - 8 * s); }); c.moveTo(hx - 5 * s, hy + 11 * s); c.quadraticCurveTo(hx, hy + 8 * s, hx + 5 * s, hy + 11 * s); }
    else if (mood === 'awe') { c.stroke(); c.beginPath(); c.ellipse(hx, hy + 11 * s, 3.4 * s, 4.6 * s, 0, 0, 7); c.fill(); }
    else if (mood === 'smile') { c.arc(hx, hy + 6 * s, 5.5 * s, 0.2 * Math.PI, 0.8 * Math.PI); }
    else { c.moveTo(hx - 4.5 * s, hy + 10 * s); c.lineTo(hx + 4.5 * s, hy + 10 * s); }
    c.stroke();
    if (o.phone) { const px = x + 30 * s, py = y - 146 * s, g = o.green || 0;
      if (g > 0) { c.fillStyle = rgbaG(0.28 * g); c.beginPath(); c.arc(px, py, 22 * s, 0, 7); c.fill(); }
      c.fillStyle = g > 0.5 ? GREEN : '#4a4843'; c.fillRect(px - 5 * s, py - 10 * s, 10 * s, 20 * s); c.strokeStyle = INK; c.lineWidth = 2 * s; c.strokeRect(px - 5 * s, py - 10 * s, 10 * s, 20 * s); }
    c.restore();
  }

  function text(c, s, x, y, size, o = {}) { c.save(); c.globalAlpha = o.alpha ?? 1; c.font = `${size}px "${o.font || HAND}"`; c.textAlign = o.align || 'center';
    c.lineJoin = 'round'; c.lineWidth = size * 0.22; c.strokeStyle = o.stroke || 'rgba(225,219,205,0.95)'; c.strokeText(s, x, y); c.fillStyle = o.col || INK; c.fillText(s, x, y); c.restore(); }
  function tag(c, s, sub, a) { c.save(); c.globalAlpha = a; c.font = `64px "${SERIF}"`; const w = c.measureText(s).width;
    c.fillStyle = INK; c.fillRect(84, 196, w + 36, 82); c.fillStyle = '#ece6d6'; c.textAlign = 'left'; c.fillText(s, 102, 258);
    if (sub) { c.font = `48px "${HAND}"`; c.fillStyle = INK; c.lineWidth = 9; c.strokeStyle = 'rgba(225,219,205,0.95)'; c.strokeText(sub, 102 + w + 34, 256); c.fillText(sub, 102 + w + 34, 256); }
    c.restore(); }
  function paperTexture(c, dark) {
    c.save(); c.lineWidth = 2; grain.forEach(g => { c.strokeStyle = `rgba(40,36,30,${0.05 * g.w})`; c.beginPath();
      for (let x = -20; x <= 1100; x += 90) { const y = g.y + Math.sin(x * g.f + g.ph) * g.a; x < 0 ? c.moveTo(x, y) : c.lineTo(x, y); } c.stroke(); });
    c.fillStyle = 'rgba(30,28,24,0.10)'; specks.forEach(([x, y, s]) => c.fillRect(x, y, s, s));
    if (dark) { c.fillStyle = `rgba(20,19,17,${0.25 * dark})`; c.fillRect(0, 0, 1080, 1920); }
    c.restore(); }

  // ---------------- the city ----------------
  function city(c, cam, S) {
    const t = S.t, h = S.h;
    // sky: carved gray gradient bands (bokashi)
    c.fillStyle = PAPER; c.fillRect(0, 0, 1080, 1920);
    const g = c.createLinearGradient(0, 0, 0, 900); g.addColorStop(0, 'rgba(70,66,60,0.55)'); g.addColorStop(1, 'rgba(70,66,60,0)'); c.fillStyle = g; c.fillRect(0, 0, 1080, 900);
    const sc = layerCam(cam, 0.2); { const [sx, sy] = toS(sc, 1320, 430); c.fillStyle = '#e6dfcc'; c.beginPath(); c.arc(sx, sy, 80 * sc[2] / ZW * 0.6 + 40, 0, 7); c.fill(); c.strokeStyle = INK; c.lineWidth = 3; c.stroke(); }
    // FAR layer
    const lf = layerCam(cam, 0.45);
    c.save(); apply(c, lf);
    // hill + pylons
    c.fillStyle = '#8a867d'; c.beginPath(); c.moveTo(-400, 1760); c.quadraticCurveTo(100, 1560, 520, 1720); c.lineTo(520, 1760); c.closePath(); c.fill();
    c.strokeStyle = '#3c3a35'; c.lineWidth = 5; PYL.forEach(p => { c.beginPath(); c.moveTo(p.x - 30, p.y - 30); c.lineTo(p.x, p.y - 330); c.lineTo(p.x + 30, p.y - 30); c.moveTo(p.x - 44, p.y - 300); c.lineTo(p.x + 44, p.y - 300); c.moveTo(p.x - 20, p.y - 200); c.lineTo(p.x + 20, p.y - 120); c.moveTo(p.x + 20, p.y - 200); c.lineTo(p.x - 20, p.y - 120); c.stroke(); });
    const segs = [[-400, PYL[1].x], [PYL[1].x, PYL[2].x], [PYL[2].x, PYL[3].x], [PYL[3].x, XL + 10]];
    segs.forEach(([x0, x1], i) => { const a = S.trip[i] * S.redFade;
      [-40, 40].forEach(dx => { c.strokeStyle = '#3c3a35'; c.lineWidth = 3; wirePath(c, x0, x1, PYL[0].y - 300, 26, 0); c.save(); c.translate(dx * 0, 0); c.restore(); c.stroke();
        if (a > 0) { c.strokeStyle = rgbaR(0.25 * a); c.lineWidth = 26; wirePath(c, x0, x1, PYL[0].y - 300, 26, 0); c.stroke(); c.strokeStyle = rgbaR(a); c.lineWidth = 8; wirePath(c, x0, x1, PYL[0].y - 300, 26, 0); c.stroke(); } }); });
    drawBuildings(c, far, FARC, S, 0.45);
    // fragment windows (far)
    ['f2', 'f3', 'f4'].forEach(id => { const f = FRAG[id], a = S.litA(id), dk = S.ext > 0 && f.x < S.xf;
      c.fillStyle = dk ? DARKW : LIT; c.fillRect(f.x - 9, f.y - 12, 18, 24);
      if (a > 0) { c.fillStyle = rgbaG(0.25 * a); c.beginPath(); c.arc(f.x, f.y, 34, 0, 7); c.fill(); c.globalAlpha = a; c.fillStyle = GREEN; c.fillRect(f.x - 9, f.y - 12, 18, 24); c.globalAlpha = 1; }
      c.strokeStyle = INK; c.lineWidth = 3; c.strokeRect(f.x - 9, f.y - 12, 18, 24); });
    c.restore();
    // MID layer
    const lm = layerCam(cam, 0.7);
    c.save(); apply(c, lm); drawBuildings(c, mid, MIDC, S, 0.7); c.restore();
    // GROUND layer
    const lg = cam;
    c.save(); apply(c, lg);
    c.fillStyle = GRD; c.fillRect(-600, 1900, 2800, 1600);
    c.fillStyle = '#b3ae a2'.replace(' ', ''); c.fillRect(-600, 1900, 2800, 22); c.strokeStyle = INK; c.lineWidth = 3; c.beginPath(); c.moveTo(-600, 1922); c.lineTo(2200, 1922); c.stroke();
    c.strokeStyle = 'rgba(40,36,30,0.25)'; c.lineWidth = 3; for (let k = 0; k < 9; k++) { const y = 2060 + k * 90; c.beginPath(); c.moveTo(-600, y); c.lineTo(2200, y + 10); c.stroke(); }
    c.fillStyle = 'rgba(236,230,214,0.55)'; for (let k = 0; k < 8; k++) c.fillRect(980 + k * 38, 2230, 22, 150);
    // substation (the fix)
    c.fillStyle = '#6e6b64'; c.fillRect(SUB.x - 120, SUB.y - 60, 240, 90); c.strokeStyle = INK; c.lineWidth = 4; c.strokeRect(SUB.x - 120, SUB.y - 60, 240, 90);
    c.fillStyle = '#4c4a45'; [-80, -20, 40].forEach(dx => { c.fillRect(SUB.x + dx, SUB.y - 110, 44, 60); c.strokeRect(SUB.x + dx, SUB.y - 110, 44, 60); });
    { const a5 = S.mode === 'after' ? S.lever : S.litA('f5') * (S.h >= LINKS[3].h ? 1 : 0); const ang = L.lerp(-0.9, 0.9, S.mode === 'after' ? S.lever : 0);
      c.save(); c.translate(SUB.x, SUB.y - 70); c.strokeStyle = a5 > 0 ? GREEN : '#34322e'; c.lineWidth = 10; c.lineCap = 'round'; c.beginPath(); c.moveTo(0, 0); c.lineTo(Math.sin(ang) * 60, -Math.cos(ang) * 60); c.stroke();
      c.fillStyle = a5 > 0 ? GREEN : '#34322e'; c.beginPath(); c.arc(Math.sin(ang) * 60, -Math.cos(ang) * 60, 12, 0, 7); c.fill(); c.restore(); }
    // overhead street wires + poles
    const poles = [-40, 380, 1220, 1640];
    c.strokeStyle = '#3a3833'; c.lineWidth = 12; poles.forEach(x => { c.beginPath(); c.moveTo(x, 1990); c.lineTo(x, 1600); c.moveTo(x - 50, 1620); c.lineTo(x + 50, 1620); c.stroke(); });
    for (let i = 0; i < poles.length - 1; i++) [0, 22].forEach(off => { c.strokeStyle = '#2f2d29'; c.lineWidth = 4; wirePath(c, poles[i], poles[i + 1], 1624, 44, off); c.stroke(); });
    if (S.ext > 0) { const a = S.redFade; c.save(); c.beginPath(); c.rect(-600, 1500, S.xf + 600, 300); c.clip();
      for (let i = 0; i < poles.length - 1; i++) [0, 22].forEach(off => { c.strokeStyle = rgbaR(0.25 * a); c.lineWidth = 22; wirePath(c, poles[i], poles[i + 1], 1624, 44, off); c.stroke(); c.strokeStyle = rgbaR(a); c.lineWidth = 7; wirePath(c, poles[i], poles[i + 1], 1624, 44, off); c.stroke(); });
      c.restore(); }
    // crowd
    crowd.forEach(p => { const walk = S.awe > 0.5 ? 0 : 1; const x = p.x + p.v * t * walk;
      figure(c, x, p.y, p.s, { col: '#4a4843', mood: S.awe > 0.5 ? 'awe' : (S.mode === 'after' && S.h > 1.2 ? 'smile' : 'calm'), look: S.awe > 0.5 ? [-0.6, -1] : [p.dir * 0.8, 0], stride: walk * Math.sin(t * 6 + p.ph) }); });
    // hero
    const g1 = S.litA('f1');
    let mood = 'calm', look = [0, 0];
    if (S.mode === 'before') { if (S.h > FAILS[0].h1) { mood = 'worried'; look = [-0.5, -0.3]; } if (S.awe > 0.5) { mood = 'awe'; look = [-0.7, -1]; } }
    else { if (S.h > AIH) { mood = 'smile'; look = [-0.4, -0.6]; } if (S.h > 1.35) { mood = 'awe'; look = [-0.5, -1]; } }
    figure(c, HERO.x, HERO.y, HERO.s, { phone: true, green: g1, mood, look, col: '#2d2b27' });
    c.restore();

    // ---------- green links (screen space) ----------
    const P = id => { const f = FRAG[id]; return toS(layerCam(cam, f.layer), f.x, f.y); };
    const seg = (a, b, u0, u1, w, alpha, col) => { const A1 = P(a), B = P(b); c.strokeStyle = col || rgbaG(alpha); c.lineWidth = w; c.lineCap = 'round'; c.beginPath();
      c.moveTo(L.lerp(A1[0], B[0], u0), L.lerp(A1[1], B[1], u0)); c.lineTo(L.lerp(A1[0], B[0], u1), L.lerp(A1[1], B[1], u1)); c.stroke(); };
    const zw = cam[2];
    const lw = 4 + 3 * Math.min(1, zw / 2);
    if (S.mode === 'before') {
      FAILS.forEach(f => { if (h < f.h0) return; const grow = L.sm(f.h0, f.h0 + (f.h1 - f.h0) * 0.7, h) * 0.8; const brk = L.sm(f.h1 - 0.03, f.h1 + 0.05, h);
        if (brk < 1) { seg(f.a, f.b, 0, grow * (1 - brk * 0.5), lw, 0.95 * (1 - brk)); if (brk > 0) seg(f.a, f.b, grow * (1 - brk * 0.5) + 0.05, grow, lw, 0.95 * (1 - brk)); } });
      LINKS.forEach(k => { const p = L.sm(k.h - 0.08, k.h, h); if (p <= 0) return; seg(k.a, k.b, 0, p, lw + 10, 0.2); seg(k.a, k.b, 0, p, lw, 1, GREEN); });
    } else {
      [['f1', 'f2'], ['f1', 'f4'], ['f1', 'f3'], ['f2', 'f5']].forEach(([a, b], i) => { const h0 = FR.f1.ready_at + 0.02 * i, p = L.sm(h0, AIH, h); if (p <= 0) return;
        seg(a, b, 0, p, lw + 12, 0.22); seg(a, b, 0, p, lw, 1, GREEN);
        if (p >= 1) for (let k = 0; k < 3; k++) { const u = ((t * 0.9 + k / 3 + i * 0.13) % 1); const A1 = P(a), B = P(b); c.fillStyle = '#e8fff0'; c.beginPath(); c.arc(L.lerp(A1[0], B[0], u), L.lerp(A1[1], B[1], u), 5 + 2 * Math.min(1, zw / 2), 0, 7); c.fill(); } });
    }
    // labels in the wide
    const la = L.clamp((1.6 - zw) / 0.6, 0, 1);
    if (la > 0) ['f1', 'f2', 'f3', 'f4', 'f5'].forEach(id => { const a = S.litA(id) * la * (id === 'f5' ? (S.mode === 'after' ? S.lever : 0) : 1); if (a <= 0) return;
      const [x, y] = P(id); const s = labels[id]; c.font = `44px "${HAND}"`; const w = c.measureText(s).width; const cx = L.clamp(x, 90 + w / 2, 895 - w / 2);
      text(c, s, cx, id === 'f1' ? y + 250 * zw / ZW * 0 + 190 : y + 64, 44, { alpha: a }); });
    paperTexture(c, S.mode === 'before' ? L.sm(DONE, DONE + 0.1, h) * 0.8 : 0);
  }

  // ---------------- snap panels ----------------
  function panels(c, t) {
    c.fillStyle = PAPER; c.fillRect(0, 0, 1080, 1920);
    const sweep = L.sm(17.1, 18.9, t), hNow = sweep * 2.0;
    L.title(c, [{ text: 'Same afternoon.' }], 380, 96, { alpha: L.sm(16.8, 17.1, t) });
    const X0 = 130, X1 = 950, xh = hh => X0 + (X1 - X0) * hh / 2.0;
    const box = (y, name, sub) => { c.fillStyle = '#e4ddcc'; c.fillRect(90, y, 900, 360); c.strokeStyle = INK; c.lineWidth = 5; c.strokeRect(90, y, 900, 360);
      c.font = `62px "${SERIF}"`; c.fillStyle = INK; c.textAlign = 'left'; c.fillText(name, 120, y + 78);
      if (sub) { c.font = `48px "${HAND}"`; c.fillText(sub, 120 + c.measureText(name).width + 170, y + 76); }
      c.strokeStyle = '#6a665e'; c.lineWidth = 6; c.beginPath(); c.moveTo(X0, y + 200); c.lineTo(X1, y + 200); c.stroke(); };
    const pa = L.sm(16.8, 17.0, t);
    c.save(); c.globalAlpha = pa;
    // BEFORE panel
    const yb = 500; box(yb, 'BEFORE');
    const cur = xh(hNow);
    c.fillStyle = RED; const nr = xh(NORETURN); c.fillRect(nr, yb + 150, Math.max(0, Math.min(cur, X1) - nr), 100 * (hNow >= NORETURN ? 1 : 0));
    ['f1', 'f4', 'f2', 'f3'].forEach(id => { const x = xh(FR[id].ready_at); if (hNow < FR[id].ready_at) return; c.fillStyle = GREEN; c.beginPath(); c.arc(x, yb + 200, 16, 0, 7); c.fill(); c.strokeStyle = INK; c.lineWidth = 3; c.stroke(); });
    if (hNow >= MED) { c.strokeStyle = GREEN; c.lineWidth = 6; c.beginPath(); c.moveTo(X0, yb + 262); c.lineTo(xh(MED), yb + 262); c.stroke(); text(c, '~1.5 h to notice', 150, yb + 320, 50, { align: 'left' }); }
    if (hNow >= LINKS[3].h) { const x = xh(LINKS[3].h); c.strokeStyle = GREEN; c.lineWidth = 8; c.beginPath(); c.arc(x, yb + 200, 28, 0, 7); c.stroke(); text(c, 'too late', 895, yb + 130, 50, { align: 'right' }); }
    // AFTER panel
    const ya = 960; box(ya, 'AFTER', 'illustrative');
    if (hNow >= TRIPS[0]) { c.fillStyle = RED; c.fillRect(xh(TRIPS[0]), ya + 170, 14, 60); }
    if (hNow >= FR.f1.ready_at) { c.fillStyle = GREEN; c.beginPath(); c.arc(xh(FR.f1.ready_at), ya + 200, 16, 0, 7); c.fill(); }
    if (hNow >= AIH) { const x = xh(AIH); c.strokeStyle = GREEN; c.lineWidth = 8; c.beginPath(); c.arc(x, ya + 200, 28, 0, 7); c.stroke(); c.fillStyle = GREEN; c.beginPath(); c.arc(x, ya + 200, 16, 0, 7); c.fill();
      c.strokeStyle = GREEN; c.lineWidth = 6; c.beginPath(); c.moveTo(X0, ya + 262); c.lineTo(x, ya + 262); c.stroke(); text(c, '15 min', 150, ya + 320, 50, { align: 'left' }); text(c, 'lights stay on', 895, ya + 320, 50, { align: 'right', alpha: L.sm(1.2, 1.4, hNow) }); }
    // cursor
    c.strokeStyle = INK; c.lineWidth = 3; c.setLineDash([10, 10]); c.beginPath(); c.moveTo(cur, yb + 110); c.lineTo(cur, ya + 300); c.stroke(); c.setLineDash([]);
    c.restore();
    L.title(c, [{ text: 'Same pieces.' }, { text: 'Faster routing.', col: GREEN }], 1480 - 110, 84, { alpha: L.sm(19.0, 19.3, t) });
    paperTexture(c, 0);
  }

  // ---------------- main ----------------
  function draw(c, t) {
    if (t < T0B) { // cold open: flash-forward
      city(c, CLOSE, state('before', HOOK_H, t));
      tag(c, 'BEFORE', null, 1);
      L.title(c, [{ text: 'Four people' }, { text: 'almost talked.' }], 420, 104);
      L.slate(c, 'SC1  CLOSE  flash-forward');
      return;
    }
    if (t < 13.4) { const h = (t - T0B) / SPF; const cam = camKey(KB, t); city(c, cam, state('before', h, t));
      tag(c, 'BEFORE', null, 1);
      if (t > 2.3 && t < 4.5) text(c, labels.f1, 540, 1495, 50, { alpha: L.sm(2.3, 2.5, t) * (1 - L.sm(4.3, 4.5, t)) });
      L.title(c, [{ text: 'The answer was here.' }, { text: 'In pieces.', col: GREEN }], 420, 92, { alpha: L.sm(5.4, 5.7, t) * (1 - L.sm(7.6, 7.9, t)) });
      L.slate(c, t < 4.6 ? 'SC2  CLOSE  eye level' : t < 8 ? 'SC2  CRANE UP' : t < 10.6 ? 'SC2  WIDE' : t < 12.3 ? 'SC2  DROP DOWN' : 'SC2  CLOSE+');
      return; }
    if (t < 16.4) { // dead stop, then SLOW
      city(c, KB[KB.length - 1][1], state('before', 2.0, 13.4));
      c.fillStyle = `rgba(13,12,10,${t < 14 ? 1 : 1 - 0.45 * L.sm(14, 14.4, t)})`; c.fillRect(0, 0, 1080, 1920);
      L.title(c, [{ text: 'We slowed it down' }, { text: 'so you could see it.' }], 860, 92, { alpha: L.sm(14.1, 14.4, t) });
      L.slate(c, 'SC3  HOLD');
      return; }
    if (t < 20) { if (t < 16.8) { c.fillStyle = '#0d0c0a'; c.fillRect(0, 0, 1080, 1920); } else panels(c, t); L.slate(c, 'SC4  SNAP  same clock'); return; }
    if (t < 32) { const h = (t - T0A) / SPF; const cam = camKey(KA, t); city(c, cam, state('after', h, t));
      tag(c, 'AFTER', 'illustrative', 1);
      L.title(c, [{ text: 'Same pieces.' }, { text: 'Found in minutes.', col: GREEN }], 420, 92, { alpha: L.sm(22.0, 22.3, t) * (1 - L.sm(23.9, 24.2, t)) });
      if (t > 25.3 && t < 27.6) text(c, 'people still decide', 540, 1490, 54, { alpha: L.sm(25.3, 25.5, t) * (1 - L.sm(27.3, 27.6, t)) });
      L.slate(c, t < 21.3 ? 'SC5  CLOSE  eye level' : t < 24 ? 'SC5  CRANE UP' : t < 27.4 ? 'SC5  WIDE' : t < 29.6 ? 'SC5  DROP DOWN' : 'SC5  CLOSE++');
      return; }
    if (t < 34.4) { city(c, KA[KA.length - 1][1], state('after', 2.0, 32));
      c.fillStyle = `rgba(13,12,10,${0.45 * L.sm(32, 32.4, t)})`; c.fillRect(0, 0, 1080, 1920);
      L.title(c, [{ text: 'This is' }, { text: 'the bottleneck.' }], 820, 116, { alpha: L.sm(32.1, 32.4, t) });
      L.slate(c, 'SC6  HOLD'); return; }
    // end card, then dissolve to frame 1 for the loop
    if (t > 38.0) { draw(c, 0); }
    L.endCard(c, L.sm(34.4, 34.7, t) * (1 - L.sm(38.0, 38.4, t)));
  }

  return {
    draw, DUR,
    acts: [
      { start: 0, end: 12.6, bpm: 60, drone: true },
      { start: 12.6, end: 13.4, bpm: 0, drone: true },
      { start: 14.0, end: 16.4, bpm: 0, drone: true },
      { start: 16.8, end: 20.0, bpm: 0, drone: true },
      { start: 20.0, end: 32.0, bpm: 72, drone: true },
      { start: 32.0, end: 38.4, bpm: 0, drone: true },
    ],
    cues: [
      { t: 0.05, type: 'hit' }, { t: 2.0, type: 'pop' }, { t: 3.8, type: 'bonk' }, { t: 4.6, type: 'whoosh' },
      { t: 6.5, type: 'hit' }, { t: 8.8, type: 'ding' }, { t: 12.62, type: 'hit' },
      { t: 16.8, type: 'hit' }, { t: 20.6, type: 'pop' }, { t: 21.5, type: 'ding' }, { t: 25.4, type: 'stamp' },
      { t: 27.4, type: 'whoosh' }, { t: 34.4, type: 'ding' },
    ],
  };
}
if (typeof module !== 'undefined') module.exports = makeScene;
