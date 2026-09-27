// THE STACKS (animatic). Structure: based-on-a-true-story. Analog: penicillin-resistance-1946. Medium: woodblock print.
// Over a librarian's shoulder: her card catalog (40 drawers = 40 samples) fills with red slips; her volume (the warning) is one
// green fragment; the other volumes sit in separate libraries across town; loan slips between them break.
// Red = L.logistic(year, 0.56 [derived doubling time], s0 0.125): drawer i red when share > q_i.
// Loan links = L.lognormalQuantile(q, median 13, p90 69); AI snap = ai_counterfactual median 2.5 (illustrative, coordination only).
// Race mapping: film_t = 3.6 + 14 * log10(1 + year) / log10(16), years 0..15 (log time). Snap: linear, 15 years in 3 s.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const { createCanvas } = require('@napi-rs/canvas');
  const A = L.loadAnalog('penicillin-resistance-1946');
  const DUR = 40.0, RED = L.RED, GREEN = L.GREEN;
  const PAPER = '#d9d3c5', INK = '#26272b', G1 = '#46474d', G2 = '#6e6e72', G3 = '#9d9990', PALE = '#c4beb1', SKIN = '#cfc8ba';
  const DBL = A.threat.doubling_time, S0 = A.threat.points[0].extent;            // 0.56 yr (derived), 0.125
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;   // 13, 69
  const AIMED = A.ai_counterfactual.aggregation_median, AIP90 = AIMED * P90 / MED; // 2.5, 13.3
  const WARN = 1.5, MEET = 13, AGAIN = 15, SPAN = 15, DATA_END = 1.75;
  const RACE0 = 3.6, RACE_LEN = 14;
  const share = y => L.logistic(y, DBL, S0);
  const tOfYear = y => RACE0 + L.mapTime(y, SPAN, RACE_LEN, 'log');
  const yearAt = t => t < RACE0 ? 0 : L.clamp(L.unmapTime(t - RACE0, SPAN, RACE_LEN, 'log'), 0, SPAN);
  const T_WARN = tOfYear(WARN), T_MEET = tOfYear(MEET), T_AGAIN = tOfYear(AGAIN);
  const fade = (t, a, b, e = 0.3) => L.sm(a, a + e, t) * (1 - L.sm(b - e, b, t));
  const r = L.rng(1946);

  // ---------- textures (built once at setup) ----------
  const grainC = createCanvas(240, 240), gx = grainC.getContext('2d');
  for (let i = 0; i < 46; i++) { const y0 = i * 240 / 46 + r() * 3, a = 0.05 + r() * 0.1, ph = r() * 6;
    gx.strokeStyle = i % 3 ? `rgba(20,18,16,${a})` : `rgba(255,252,240,${a * 0.8})`; gx.lineWidth = 0.8 + r() * 1.6; gx.beginPath();
    for (let x = 0; x <= 240; x += 8) { const yy = y0 + Math.sin(x / 240 * Math.PI * 2 + ph) * 2.2 + Math.sin(x / 240 * Math.PI * 4 + ph * 2) * 1.2; x ? gx.lineTo(x, yy) : gx.moveTo(x, yy); } gx.stroke(); }
  const paperC = createCanvas(1080, 1920), px = paperC.getContext('2d');
  px.fillStyle = PAPER; px.fillRect(0, 0, 1080, 1920);
  for (let i = 0; i < 2600; i++) { px.fillStyle = r() < 0.6 ? 'rgba(60,52,40,0.10)' : 'rgba(255,252,242,0.25)'; px.fillRect(r() * 1080, r() * 1920, 1 + r() * 2.5, 1 + r() * 2.5); }
  for (let i = 0; i < 260; i++) { px.strokeStyle = 'rgba(90,80,60,0.08)'; px.lineWidth = 1; const x = r() * 1080, y = r() * 1920, a = r() * 6; px.beginPath(); px.moveTo(x, y); px.lineTo(x + Math.cos(a) * 30, y + Math.sin(a) * 30); px.stroke(); }
  let grainPat = null, grainOwner = null;
  const pat = ctx => { if (grainOwner !== ctx) { grainPat = ctx.createPattern(grainC, 'repeat'); grainOwner = ctx; } return grainPat; };

  // carved shapes: polygons with slightly chiselled edges (fixed per seed; prints do not boil)
  function poly(ctx, pts, fill, { grain = true, stroke = null, lw = 3 } = {}) {
    ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath();
    ctx.fillStyle = fill; ctx.fill(); if (grain) { ctx.fillStyle = pat(ctx); ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.stroke(); } }
  const JIT = {}; const jit = (seed, k) => { const key = seed * 97 + k; if (JIT[key] === undefined) JIT[key] = (L.rng(key)() - 0.5); return JIT[key]; };
  function crect(ctx, x, y, w, h, fill, seed = 1, j = 2, o = {}) {
    const p = []; const n = 3;
    for (let i = 0; i < n; i++) p.push([x + w * i / n + jit(seed, i) * j, y + jit(seed, 10 + i) * j]);
    for (let i = 0; i < n; i++) p.push([x + w + jit(seed, 20 + i) * j, y + h * i / n + jit(seed, 30 + i) * j]);
    for (let i = 0; i < n; i++) p.push([x + w - w * i / n + jit(seed, 40 + i) * j, y + h + jit(seed, 50 + i) * j]);
    for (let i = 0; i < n; i++) p.push([x + jit(seed, 60 + i) * j, y + h - h * i / n + jit(seed, 70 + i) * j]);
    poly(ctx, p, fill, o); }
  function glow(ctx, x, y, rad, rgb, a) { if (a <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2); }

  // ---------- the catalog: 40 drawers, each a fixed threshold ----------
  const qs = []; for (let i = 0; i < 40; i++) qs.push((i + 0.5) / 40);
  for (let i = qs.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [qs[i], qs[j]] = [qs[j], qs[i]]; }
  const rr = Math.LN2 / DBL;
  const drawers = qs.map((q, i) => ({ q, col: i % 8, row: Math.floor(i / 8), yr: q <= S0 ? -1 : Math.log(q * (1 - S0) / (S0 * (1 - q))) / rr }));
  // the two drawers that go red again in 1961 (qualitative): lowest thresholds among the drawers visible in the closest shot
  const again = new Set(drawers.map((d, i) => ({ d, i })).filter(o => o.d.col <= 3 && o.d.row >= 1).sort((a, b) => a.d.q - b.d.q).slice(0, 2).map(o => o.i));
  function drawerRed(i, y) { const d = drawers[i];
    if (y < MEET) return L.sm(d.yr, d.yr + 0.06, y);
    if (y < AGAIN) return (share(MEET) > d.q ? 1 : 0) * (1 - L.sm(MEET, MEET + 0.3, y));
    return again.has(i) ? L.sm(AGAIN - 0.12, AGAIN, y) : 0; }

  // ---------- loan links between four libraries ----------
  // 0 = her library (hospital lab records, f2), 1 = biochemists (f1), 2 = chemists (f3), 3 = the world (f5)
  const PAIRS = [[0, 1], [1, 2], [0, 2], [0, 1], [1, 2], [0, 3], [2, 3], [1, 3], [0, 3], [2, 3]];
  const LINKS = PAIRS.map((p, i) => ({ a: p[0], b: p[1], at: L.lognormalQuantile((i + 0.5) / 10, MED, P90), ai: L.lognormalQuantile((i + 0.5) / 10, AIMED, AIP90),
    bend: (i < 5 ? (i % 2 ? 1 : -1) * (50 + 40 * Math.floor(i / 2)) : (i % 2 ? 1 : -1) * (40 + 30 * (i - 5))), ph: r(), sp: 0.28 + r() * 0.2 }));

  // ---------- world layout (wide = zoom 1) ----------
  const RX = 220, RY = 1160, RS = 1 / 6;                       // reading room: local 1080x1920 drawn at 1/6 inside building A
  const roomToWorld = (lx, ly) => [RX + lx * RS, RY + ly * RS];
  const BOOK = [560, 1330];
  const BLD = [
    { x: 130, top: 820, w: 360, base: 1500, sign: 'her library' },
    { x: 600, top: 470, w: 280, base: 800, sign: 'biochemists' },
    { x: 110, top: 520, w: 280, base: 830, sign: 'chemists' },
    { x: 600, top: 960, w: 280, base: 1260, sign: 'the world' }];
  const NODE = [roomToWorld(...BOOK), [740, 690], [250, 720], [740, 1150]];
  const nodeLit = (k, y) => k === 0 ? L.sm(1.35, 1.6, y) : k === 1 ? 1 : k === 2 ? L.sm(MEET - 0.1, MEET, y) : 0;

  // ---------- the reading room (local coords, 1080x1920) ----------
  const SPINES = []; for (let s = 0; s < 3; s++) { let x = -20; while (x < 1100) { const w = 26 + r() * 34; SPINES.push({ s, x, w, h: 110 + r() * 40, c: [G1, G2, G3, INK][Math.floor(r() * 4)], seed: 500 + SPINES.length }); x += w + 4; } }
  const ARRIVE = [{ x: 668, c: 0 }, { x: 716, c: 1 }, { x: 764, c: 2 }];
  function catalog(ctx, y, t) {
    crect(ctx, 380, 500, 690, 780, G1, 71, 4);                  // cabinet body
    const cw = 81, ch = 146, x0 = 395, y0 = 515;
    for (let i = 0; i < 40; i++) { const d = drawers[i], x = x0 + d.col * cw, yy = y0 + d.row * ch;
      crect(ctx, x + 5, yy + 6, cw - 10, ch - 12, G3, 100 + i, 3);
      crect(ctx, x + cw / 2 - 18, yy + 30, 36, 24, PALE, 200 + i, 1.5, { grain: false, stroke: INK, lw: 2 });
      ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(x + cw / 2, yy + ch - 40, 9, 0, 7); ctx.fill(); }
    for (let i = 0; i < 40; i++) { const red = drawerRed(i, y); if (red <= 0.01) continue; const d = drawers[i], x = x0 + d.col * cw, yy = y0 + d.row * ch;
      const hgt = 110 * red; crect(ctx, x + 14, yy + 44 - hgt * 0.55, cw - 28, hgt, RED, 300 + i, 2.5, { grain: true }); }
    crect(ctx, 400, 1280, 30, 160, INK, 72, 2); crect(ctx, 1020, 1280, 30, 160, INK, 73, 2);
  }
  function volume(ctx, x, y, w, h, green, rot, seed, dark = false) { // a book, standing or held; green = 0..1 ink wipe from the bottom
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    if (green > 0) glow(ctx, 0, 0, Math.max(w, h) * 1.1, '52,210,123', 0.45 * green);
    crect(ctx, -w / 2, -h / 2, w, h, dark ? G1 : G3, seed, 3, { stroke: INK, lw: 4 });
    if (green > 0) { const gh = h * green; crect(ctx, -w / 2 + 4, h / 2 - gh + 2, w - 8, gh - 6, GREEN, seed + 1, 2); }
    ctx.fillStyle = INK; ctx.fillRect(-w / 2 + 10, -h / 2 + h * 0.18, w - 20, 5); ctx.fillRect(-w / 2 + 10, h / 2 - h * 0.2, w - 20, 5);
    ctx.restore(); }
  function head(ctx, x, y, mood, t) { // profile facing right, woodblock bean with round spectacles
    ctx.save(); ctx.translate(x, y);
    poly(ctx, [[-130, -40], [-120, -120], [-40, -165], [60, -160], [120, -100], [118, 0], [138, 30], [115, 48], [112, 110], [60, 150], [-40, 150], [-120, 90]], SKIN, { stroke: INK, lw: 5 });
    poly(ctx, [[-138, 40], [-140, -60], [-100, -140], [-10, -176], [80, -168], [128, -118], [118, -84], [40, -110], [-30, -80], [-60, -10], [-70, 60], [-110, 90]], INK);
    ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(-150, -70, 58, 0, 7); ctx.fill();     // bun
    ctx.fillStyle = G3; ctx.beginPath(); ctx.ellipse(-32, 10, 18, 28, 0, 0, 7); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
    const ex = 62, ey = -22; let look = [1, -0.6], lid = 0, brow = 0, mouth = 0, er = 13;
    if (mood === 'alarm') { look = [1, -0.9]; brow = 1; mouth = 2; er = 16; }
    else if (mood === 'lonely') { look = [0.7, 1]; lid = 0.45; brow = 0.7; mouth = -1; }
    else if (mood === 'relief') { look = [0.8, 0.8]; lid = 0.2; brow = 0.3; mouth = 1; }
    else if (mood === 'neutral') { look = [1, -0.5]; lid = 0.25; }
    ctx.fillStyle = '#f3efe4'; ctx.beginPath(); ctx.ellipse(ex, ey, 24, 17, 0, 0, 7); ctx.fill();
    ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(ex + look[0] * 8, ey + look[1] * 5, er * 0.62, 0, 7); ctx.fill();
    if (lid > 0) { ctx.fillStyle = SKIN; ctx.fillRect(ex - 26, ey - 19, 52, 36 * lid); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(ex - 25, ey - 19 + 36 * lid); ctx.lineTo(ex + 25, ey - 19 + 36 * lid); ctx.stroke(); }
    ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(ex, ey, 36, 0, 7); ctx.stroke();            // spectacles
    ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(ex - 36, ey - 4); ctx.lineTo(-18, -6); ctx.stroke();
    ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(ex - 22, ey - 50 + brow * -6); ctx.lineTo(ex + 24, ey - 52 + brow * 14); ctx.stroke(); // inner end (right) rises when worried
    ctx.lineWidth = 6; ctx.beginPath();
    if (mouth === 1) ctx.arc(84, 88, 16, 0.15 * Math.PI, 0.75 * Math.PI);
    else if (mouth === -1) ctx.arc(84, 106, 16, 1.25 * Math.PI, 1.85 * Math.PI);
    else if (mouth === 2) ctx.ellipse(90, 94, 8, 11, 0, 0, 7);
    else { ctx.moveTo(72, 94); ctx.lineTo(100, 94); }
    ctx.stroke(); ctx.restore(); }
  function moodAt(y) { return y < WARN - 0.05 ? 'neutral' : y < 2.6 ? 'alarm' : y < MEET ? 'lonely' : y < AGAIN - 0.02 ? 'relief' : 'alarm'; }
  function room(ctx, y, t, o = {}) {
    crect(ctx, -10, -10, 1100, 1940, PALE, 61, 0);
    crect(ctx, -10, 180, 1100, 500, G3, 62, 3);                                   // the stacks on the back wall
    SPINES.forEach(s => { const by = 330 + s.s * 170; crect(ctx, s.x, by - s.h, s.w, s.h, s.c, s.seed, 2); });
    for (let s = 0; s < 3; s++) crect(ctx, -10, 330 + s * 170, 1100, 16, INK, 80 + s, 2);
    crect(ctx, -10, 1440, 1100, 500, G2, 63, 3);                                  // floor
    catalog(ctx, y, t);
    crect(ctx, 600, 1480, 500, 60, INK, 64, 3); crect(ctx, 620, 1540, 440, 400, G1, 65, 3);   // desk
    // the other volumes arrive on the desk at the meeting (year 13)
    ARRIVE.forEach((a, k) => { const f = L.sm(MEET + k * 0.08, MEET + 0.35 + k * 0.08, y) * (y < AGAIN + 5 ? 1 : 1); if (f <= 0) return;
      volume(ctx, a.x + (1 - f) * 420, 1370, 44, 210, 1, 0, 700 + k); });
    // the librarian, over her shoulder
    poly(ctx, [[-60, 1930], [-60, 1320], [60, 1220], [250, 1175], [420, 1200], [540, 1290], [620, 1480], [660, 1930]], G1, { stroke: INK, lw: 5 });
    poly(ctx, [[250, 1175], [330, 1170], [360, 1240], [300, 1300], [240, 1230]], SKIN, { stroke: INK, lw: 4 }); // collar/neck
    head(ctx, 330, 1010, o.mood || moodAt(y), t);
    ctx.strokeStyle = INK; ctx.lineWidth = 96; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(300, 1330); ctx.quadraticCurveTo(420, 1520, 560, 1470); ctx.stroke(); // forearm under the book
    ctx.strokeStyle = G1; ctx.lineWidth = 80; ctx.stroke();
    volume(ctx, BOOK[0], BOOK[1], 170, 230, nodeLit(0, y), -0.12, 690);
  }

  // ---------- town ----------
  function building(ctx, k, y, t) { const b = BLD[k], x = b.x, w = b.w;
    crect(ctx, x - 16, b.top, w + 32, 50, INK, 900 + k, 3);                     // cornice
    poly(ctx, [[x - 10, b.top + 4], [x + w / 2, b.top - 60], [x + w + 10, b.top + 4]], G1);
    crect(ctx, x, b.top + 50, w, b.base - b.top - 50, G3, 910 + k, 3, { stroke: INK, lw: 4 });
    crect(ctx, x + 14, b.top + 56, w - 28, 44, PALE, 920 + k, 2, { grain: false });
    L.label(ctx, b.sign, x + w / 2, b.top + 90, 38, { col: INK });
    for (let c = 0; c < 4; c++) crect(ctx, x + 18 + c * (w - 36) / 3.4, b.top + 108, 14, b.base - b.top - 120, G2, 930 + k * 5 + c, 2); // columns
    if (k === 0) { // facade windows = the same 40 drawers
      for (let i = 0; i < 40; i++) { const d = drawers[i], wx = x + 20 + d.col * 40, wy = b.top + 112 + d.row * 40, red = drawerRed(i, y);
        crect(ctx, wx, wy, 30, 30, red > 0.5 ? RED : PALE, 950 + i, 1.5, { grain: true, stroke: INK, lw: 2 }); }
      crect(ctx, RX - 8, RY - 8, 180 * 1 + 16, 320 + 8, INK, 990, 2);
    } else { const wx = x + w / 2, wy = (k === 1 ? 690 : k === 2 ? 720 : 1150);
      crect(ctx, wx - 60, wy - 70, 120, 140, k === 3 ? G1 : PALE, 960 + k, 2, { stroke: INK, lw: 4 });
      crect(ctx, wx - 55, wy + 36, 110, 8, INK, 970 + k, 1);
      volume(ctx, wx, wy - 4, 34, 72, nodeLit(k, y), 0, 980 + k, k === 3); } }
  function linkPath(ctx, l) { const [ax, ay] = NODE[l.a], [bx, by] = NODE[l.b]; const mx = (ax + bx) / 2, my = (ay + by) / 2, nx = -(by - ay), ny = bx - ax, nl = Math.hypot(nx, ny);
    return f => { const cx = mx + nx / nl * l.bend, cy = my + ny / nl * l.bend, u = 1 - f; return [u * u * ax + 2 * u * f * cx + f * f * bx, u * u * ay + 2 * u * f * cy + f * f * by]; }; }
  function links(ctx, y, t, alpha) { if (alpha <= 0.01) return; ctx.save(); ctx.globalAlpha = alpha;
    LINKS.forEach((l, i) => { const P = linkPath(ctx, l);
      if (y >= l.at) { ctx.strokeStyle = GREEN; ctx.lineWidth = 7; ctx.setLineDash([]); ctx.beginPath(); for (let f = 0; f <= 1.001; f += 0.05) { const [x, yy] = P(f); f ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } ctx.stroke(); return; }
      // a reach that goes out, stalls and breaks, over and over
      const cyc = (t * l.sp + l.ph) % 1, reach = L.ease.out(L.clamp(cyc / 0.7, 0, 1)) * (0.45 + 0.4 * L.noise(i * 3.1 + Math.floor(t * l.sp + l.ph), 7)), broken = cyc > 0.7;
      ctx.strokeStyle = INK; ctx.lineWidth = 3.5; ctx.setLineDash([14, 12]); ctx.globalAlpha = alpha * (broken ? 0.35 * (1 - (cyc - 0.7) / 0.3) : 0.8);
      ctx.beginPath(); for (let f = 0; f <= reach + 0.001; f += 0.04) { const [x, yy] = P(Math.min(f, reach)); f ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } ctx.stroke(); ctx.setLineDash([]);
      const [sx, sy] = P(reach); ctx.save(); ctx.translate(sx, sy); ctx.rotate(0.3 * Math.sin(i + t)); crect(ctx, -12, -8, 24, 16, PALE, 1000 + i, 1, { grain: false, stroke: INK, lw: 2 }); ctx.restore();
      ctx.globalAlpha = alpha; });
    ctx.restore(); }
  function town(ctx, y, t, zoom, mood) {
    poly(ctx, [[-400, 860], [100, 800], [500, 840], [900, 790], [1500, 830], [1500, 2400], [-400, 2400]], PALE, { grain: true });
    poly(ctx, [[-400, 1280], [300, 1250], [700, 1270], [1500, 1240], [1500, 2400], [-400, 2400]], G3, { grain: true });
    poly(ctx, [[-400, 1500], [1500, 1500], [1500, 2400], [-400, 2400]], G2, { grain: true });
    for (let k = 0; k < 9; k++) crect(ctx, -60 + k * 140, 1560 + (k % 2) * 60, 90, 18, G1, 1100 + k, 2);
    [2, 1, 3, 0].forEach(k => building(ctx, k, y, t));
    ctx.save(); ctx.beginPath(); ctx.rect(RX, RY, 180, 320); ctx.clip(); ctx.translate(RX, RY); ctx.scale(RS, RS); room(ctx, y, t, { mood }); ctx.restore();
    links(ctx, y, t, 1 - L.sm(1.6, 3.2, zoom));
    const la = 1 - L.sm(1.3, 2.0, zoom);
    if (la > 0) { L.label(ctx, 'log time', 940, 1880, 30, { col: INK, alpha: la * 0.6 }); }
  }

  // ---------- camera ----------
  const W = (lx, ly, zr) => [...roomToWorld(lx, ly), 6 * zr];
  const CAM = [[0, W(560, 1040, 1.1)], [8.4, W(540, 1040, 1.2)], [11.2, [520, 1000, 1.04]], [14.6, [520, 990, 1.08]], [16.4, W(420, 1080, 1.7)], [18.6, W(425, 1080, 1.8)]];
  // zoom about the similarity's fixed point, so big pulls read as one move through the building (log-zoom, eased)
  function camAt(t) { for (let i = 0; i < CAM.length - 1; i++) { const [a, A0] = CAM[i], [b, B0] = CAM[i + 1]; if (t > b) continue; if (t <= a) return A0;
      const f = L.ease.inOut((t - a) / (b - a)), z = A0[2] * Math.pow(B0[2] / A0[2], f);
      if (Math.abs(B0[2] - A0[2]) < 0.2) return [L.lerp(A0[0], B0[0], f), L.lerp(A0[1], B0[1], f), z];
      const Q = [0, 1].map(k => (B0[k] * B0[2] - A0[k] * A0[2]) / (B0[2] - A0[2])); return [0, 1].map(k => Q[k] - (Q[k] - A0[k]) * A0[2] / z).concat([z]); }
    return CAM[CAM.length - 1][1]; }
  function world(ctx, t, y, v, mood) { ctx.save(); ctx.translate(540, 960); ctx.scale(v[2], v[2]); ctx.translate(-v[0], -v[1]); town(ctx, y, t, v[2], mood); ctx.restore(); }

  // ---------- type ----------
  function card(ctx, lines, y, size, a) { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a;
    ctx.font = `${size}px "${SERIF}"`; const wmax = Math.max(...lines.map(l => ctx.measureText(typeof l === 'string' ? l : l.text).width));
    const h = size * 1.04 * lines.length + size * 0.5; crect(ctx, 540 - wmax / 2 - 40, y - size * 0.95, wmax + 80, h, PAPER, 1200 + lines.length, 4, { stroke: INK, lw: 4 });
    ctx.restore(); L.title(ctx, lines.map(l => typeof l === 'string' ? { text: l, col: INK } : l), y, size, { alpha: a, outline: false }); }
  function stamp(ctx, text, x, y, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(-0.08);
    ctx.font = `52px "${SERIF}"`; const w = ctx.measureText(text).width + 40; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.strokeRect(-w / 2, -44, w, 62);
    ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.fillText(text, 0, 2); ctx.restore(); }
  function slate(ctx, s) { ctx.save(); ctx.globalAlpha = 0.8; ctx.fillStyle = INK; ctx.fillRect(40, 1822, 760, 52); ctx.restore(); L.slate(ctx, s); }

  // ---------- the snap: two carved panels, true proportional time ----------
  const SNAP0 = 24.2, SWEEP0 = 25.0, SWEEP = 3.0;
  function lane(ctx, y0, med, p90, head, title, ai, t) {
    crect(ctx, 70, y0, 940, 470, PALE, 1300 + (ai ? 1 : 0), 4, { stroke: INK, lw: 5 });
    L.label(ctx, title, 110, y0 + 64, 50, { col: INK, align: 'left' });
    if (ai) L.label(ctx, 'illustrative', 110, y0 + 118, 46, { col: G1, align: 'left' });
    const X0 = 120, X1 = 960, base = y0 + 420, H = 250, xOf = yr => X0 + (X1 - X0) * yr / SPAN;
    ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(X0, base); ctx.lineTo(X1, base); ctx.stroke();
    L.label(ctx, 'years', X1 - 10, base + 40, 36, { col: G1, align: 'right' });
    // red: share of drawers (data to 1.75, fit after)
    const hr = Math.min(head, SPAN); if (hr > 0) {
      const pts = []; for (let yy = 0; yy <= hr + 1e-6; yy += 0.05) pts.push([xOf(yy), base - H * (yy < MEET ? share(yy) : yy < AGAIN ? 0.02 : 0.05)]);
      poly(ctx, [[X0, base], ...pts, [xOf(hr), base]], RED, { grain: true });
      if (hr > DATA_END) { ctx.save(); ctx.beginPath(); ctx.rect(xOf(DATA_END), base - H - 10, xOf(hr) - xOf(DATA_END), H + 10); ctx.clip();
        ctx.strokeStyle = 'rgba(217,211,197,0.7)'; ctx.lineWidth = 4; for (let k = -40; k < 80; k++) { ctx.beginPath(); ctx.moveTo(X0 + k * 22, base); ctx.lineTo(X0 + k * 22 + 200, base - 260); ctx.stroke(); } ctx.restore();
        L.label(ctx, 'fit', xOf(7.5), base - H - 16, 38, { col: G1 }); } }
    // green: share of loan links arrived
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
    for (let yy = 0; yy <= hr + 1e-6; yy += 0.05) { const py = base - H * L.lognormalCDF(yy, med, p90); yy ? ctx.lineTo(xOf(yy), py) : ctx.moveTo(xOf(yy), py); }
    ctx.strokeStyle = INK; ctx.lineWidth = 17; ctx.stroke(); ctx.strokeStyle = GREEN; ctx.lineWidth = 10; ctx.stroke();
    if (hr >= med) { const x = xOf(med), py = base - H * 0.5; glow(ctx, x, py, 80, '52,210,123', 0.6); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(x, py, 17, 0, 7); ctx.fill();
      ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
      const lx = ai ? x + 40 : x - 40, ly = ai ? py - 40 : base - H - 30; ctx.font = `44px "${HAND}"`; const lw = ctx.measureText('pieces meet').width;
      crect(ctx, ai ? lx - 12 : lx - lw - 12, ly - 40, lw + 24, 54, PAPER, 1400 + (ai ? 1 : 0), 2, { grain: false, stroke: INK, lw: 3 });
      L.label(ctx, 'pieces meet', lx, ly, 44, { col: INK, align: ai ? 'left' : 'right' }); }
    if (head > 0 && head < SPAN) { ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(xOf(head), base - H - 20); ctx.lineTo(xOf(head), base + 12); ctx.stroke(); }
  }
  function snap(ctx, t) {
    const head = L.clamp((t - SWEEP0) / SWEEP, 0, 1) * SPAN;
    lane(ctx, 470, MED, P90, head, 'as it happened', false, t);
    lane(ctx, 990, AIMED, AIP90, head, 'routed coordination', true, t);
    L.label(ctx, 'coordination only.', 540, 1532, 44, { col: INK, alpha: L.sm(SWEEP0 + 1.2, SWEEP0 + 1.6, t) });
    const tm = SWEEP0 + SWEEP * MED / SPAN; card(ctx, [{ text: '13 years.', col: INK }], 330, 96, L.sm(tm + 0.05, tm + 0.4, t));
    if (t > SWEEP0 - 0.25 && t < SWEEP0 + 0.1) { ctx.fillStyle = `rgba(250,247,238,${0.5 * (1 - Math.abs(t - SWEEP0) / 0.25)})`; ctx.fillRect(0, 0, 1080, 1920); }
  }

  // ---------- main ----------
  function draw(ctx, t) {
    ctx.drawImage(paperC, 0, 0);
    if (t < 1.2) { // cold open: flash-forward on the same timeline (year 1.75, last sourced point)
      world(ctx, t, DATA_END, W(560, 1040, 1.1));
      card(ctx, ['The answer is already here.'], 330, 84, 1);
      stamp(ctx, 'LATER', 200, 520, 1);
      if (t > 1.05) { ctx.fillStyle = `rgba(250,247,238,${(t - 1.05) / 0.15})`; ctx.fillRect(0, 0, 1080, 1920); }
      slate(ctx, 'SC1  OTS  COLD OPEN (later)');
    } else if (t < 18.6) {
      const y = yearAt(t), v = camAt(t); world(ctx, t, y, v);
      if (t < 1.5) { ctx.fillStyle = `rgba(250,247,238,${1 - (t - 1.2) / 0.3})`; ctx.fillRect(0, 0, 1080, 1920); }
      stamp(ctx, 'YEAR ZERO', 250, 520, fade(t, 1.3, 3.8));
      card(ctx, ["One library's records."], 330, 88, fade(t, 1.4, 3.7));
      card(ctx, ['Red slips,', 'drawer by drawer.'], 300, 92, fade(t, 3.9, 7.4));
      card(ctx, ['She writes it down.'], 330, 92, fade(t, 7.6, 9.4));
      card(ctx, ['The next answer:', 'in pieces.'], 290, 90, fade(t, 10.9, 12.8));
      card(ctx, ['Separate shelves.', 'Separate buildings.'], 290, 88, fade(t, 12.9, 14.9));
      card(ctx, [{ text: '13 years.', col: INK }], 330, 100, fade(t, T_MEET, T_AGAIN + 0.02, 0.2));
      card(ctx, ['The red returns.'], 330, 96, fade(t, T_AGAIN + 0.02, 18.5, 0.2));
      if (t > 17.9) { ctx.fillStyle = `rgba(38,39,43,${0.5 * L.sm(17.9, 18.6, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
      slate(ctx, t < 3.6 ? 'SC2  OTS  YEAR ZERO' : t < 8.4 ? 'SC3  OTS  slow push' : t < 11.2 ? 'SC4  PULL OUT through the building' : t < 14.6 ? 'SC5  WIDE  the town' : t < 16.4 ? 'SC6  DOLLY IN' : 'SC6  CLOSER  (dead stop)');
    } else if (t < 21.0) {
      card(ctx, ['We slowed it down', 'so you could see it.'], 860, 90, fade(t, 18.8, 21.0, 0.4)); slate(ctx, 'SC7  CARD');
    } else if (t < SNAP0) {
      card(ctx, ['Based on a true story.'], 800, 96, fade(t, 21.1, 22.6, 0.3));
      card(ctx, ['Timed from real records.', { text: '1946.', col: INK, size: 130 }], 760, 84, fade(t, 22.6, SNAP0, 0.3));
      slate(ctx, 'SC8  REVEAL');
    } else if (t < 31.0) {
      snap(ctx, t); slate(ctx, 'SC9  THE SNAP  (true speed, 1 s = 5 years)');
    } else {
      world(ctx, t, AGAIN + 0.5, L.key([[31, W(470, 1000, 1.9)], [35, W(470, 995, 2.05)]], t), 'lonely');
      const a = 1 - L.sm(31, 31.6, t); if (a > 0) { ctx.save(); ctx.globalAlpha = a; ctx.drawImage(paperC, 0, 0); snap(ctx, 31); ctx.restore(); }
      card(ctx, ['The pieces were', 'already here.'], 290, 92, fade(t, 31.5, 33.1));
      card(ctx, ['This is the bottleneck.'], 330, 90, fade(t, 33.2, 35.1, 0.3));
      slate(ctx, 'SC10  CLOSEST  over her shoulder');
      if (t >= 35) L.endCard(ctx, L.sm(35, 35.4, t), { line: 'The bottleneck is us.' });
    }
  }

  const cues = [{ t: 1.15, type: 'hit' }, { t: T_WARN, type: 'ding' }, { t: 8.4, type: 'whoosh' }, { t: 14.6, type: 'whoosh' },
    { t: T_MEET, type: 'ding' }, { t: T_AGAIN, type: 'bonk' }, { t: SWEEP0, type: 'hit' }, { t: SWEEP0 + SWEEP * AIMED / SPAN, type: 'ding' },
    { t: SWEEP0 + SWEEP * MED / SPAN, type: 'pop' }, { t: 21.1, type: 'stamp' }, { t: 31, type: 'whoosh' }, { t: 35, type: 'hit' }];
  drawers.forEach(d => { if (d.yr <= 0) return; const tt = tOfYear(d.yr); if (tt > RACE0 + 0.6 && tt < 8.3 && d.col < 5) cues.push({ t: tt, type: 'pop' }); });
  return {
    draw, DUR,
    acts: [{ start: 0, end: 3.6, bpm: 50, drone: true }, { start: 3.6, end: 11.2, bpm: 58, drone: true }, { start: 11.2, end: 17.9, bpm: 68, drone: true },
      { start: 18.6, end: 24.2, bpm: 0, drone: true }, { start: 28.0, end: 40, bpm: 0, drone: true }],
    cues: cues.sort((a, b) => a.t - b.t),
  };
}
module.exports = makeScene;
