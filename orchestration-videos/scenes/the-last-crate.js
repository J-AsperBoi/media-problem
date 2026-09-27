// the-last-crate: ticking-clock, woodblock, handheld chase. Analog: covid-2020.
// Speeds: red = analog threat.points (share of countries) interpolated; green = analog fragment days +
// max(343, L.lognormalQuantile(q, 421, 490)) per country; the courier's village is q = 0.90 -> day 490.
// AI snap = ai_counterfactual median 363, same sigma (p90 422.5), supply unchanged (illustrative).
// Mapping: from t = 1.8 s, day = 13 + 28 * (t - 1.8) (1 s = 4 weeks, linear). See output/the-last-crate/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('covid-2020');
  const DUR = 38, RED = L.RED, GREEN = L.GREEN, DKGREEN = '#1f8a4f';
  const PAPER = '#e7dfcb', INK = '34,32,30';
  const ink = a => `rgba(${INK},${a})`;
  const pap = a => `rgba(231,223,203,${a})`;
  const G = ['#d3cbb8', '#b5ae9e', '#948e81', '#6f6a61', '#4a4741', '#2b2927'];
  const CX = 490; // text column center (right column is platform UI)

  // ---------- time mapping ----------
  const T0 = 1.8, D0 = 13, DPS = 28, DEND = 490;
  const TEND = T0 + (DEND - D0) / DPS; // 18.84
  const dayAt = t => t < T0 ? DEND : Math.min(DEND, D0 + DPS * (t - T0));
  const tOfDay = d => T0 + (d - D0) / DPS;

  // ---------- threat: analog country-share points ----------
  const pts = [{ t: 0, extent: 0 }].concat(A.threat.points);
  const extent = d => { if (d <= 0) return 0; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1]; if (d <= b.t) return L.lerp(a.extent, b.extent, (d - a.t) / (b.t - a.t)); } return pts[pts.length - 1].extent; };
  const dayForShare = s => { for (let d = 0; d <= 700; d += 0.25) if (extent(d) >= s) return d; return null; };

  // ---------- green ----------
  const F = {}; A.solution.fragments.forEach(f => F[f.id] = f.ready_at);
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;
  const AIMED = A.ai_counterfactual.aggregation_median, AIP90 = AIMED * P90 / MED;
  const FIRST = F.f7, APPROVE = F.f6, TRIAL = F.f5;
  const VQ = 0.9;
  const VDAY = Math.max(FIRST, L.lognormalQuantile(VQ, MED, P90));     // ~490
  const VAIDAY = Math.max(FIRST, L.lognormalQuantile(VQ, AIMED, AIP90)); // ~422

  // ---------- helpers ----------
  const fade = (t, a, b, f = 0.3) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));
  function polyPath(ctx, p) { ctx.beginPath(); p.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); }
  function glow(ctx, x, y, r, a) { if (a <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(52,210,123,${0.5 * a})`); g.addColorStop(0.5, `rgba(52,210,123,${0.18 * a})`); g.addColorStop(1, 'rgba(52,210,123,0)'); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); }
  // carved gouges: short parallel strokes clipped to a shape (woodblock texture)
  function gouges(ctx, list, col) { ctx.strokeStyle = col; ctx.lineCap = 'round'; list.forEach(g => { ctx.lineWidth = g.w; ctx.beginPath(); ctx.moveTo(g.x, g.y); ctx.quadraticCurveTo(g.x + g.l * 0.5, g.y + g.c, g.x + g.l, g.y); ctx.stroke(); }); }
  function mkGouges(r, x0, y0, x1, y1, n, len = 60, w = 3) { const o = []; for (let i = 0; i < n; i++) o.push({ x: x0 + r() * (x1 - x0), y: y0 + r() * (y1 - y0), l: len * (0.5 + r()), c: (r() - 0.5) * 12, w: w * (0.6 + r() * 0.8) }); return o; }
  function card(ctx, lines, y, size, a) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center';
    const fs = lines.map(l => { let fz = size; ctx.font = `${fz}px "${SERIF}"`; while (ctx.measureText(l).width > 740 && fz > 40) { fz -= 4; ctx.font = `${fz}px "${SERIF}"`; } return fz; });
    const h = fs.reduce((s, f) => s + f * 1.1, 0) + 40; const top = y - fs[0] - 10;
    const wmax = Math.max(...lines.map((l, i) => { ctx.font = `${fs[i]}px "${SERIF}"`; return ctx.measureText(l).width; })) + 70;
    ctx.fillStyle = pap(0.94); ctx.fillRect(CX - wmax / 2, top, wmax, h); ctx.strokeStyle = ink(0.85); ctx.lineWidth = 5; ctx.strokeRect(CX - wmax / 2 + 8, top + 8, wmax - 16, h - 16);
    let yy = y; lines.forEach((l, i) => { if (i) yy += fs[i] * 1.1; ctx.font = `${fs[i]}px "${SERIF}"`; ctx.fillStyle = ink(0.95); ctx.fillText(l, CX, yy); });
    ctx.restore();
  }
  function clock(ctx, day, a = 1, y = 290) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = G[5]; ctx.fillRect(CX - 260, y - 90, 520, 170); ctx.strokeStyle = pap(0.7); ctx.lineWidth = 3; ctx.strokeRect(CX - 248, y - 78, 496, 146);
    ctx.fillStyle = PAPER; ctx.textAlign = 'left'; ctx.font = `48px "${HAND}"`; ctx.fillText('DAY', CX - 220, y + 20);
    ctx.textAlign = 'right'; ctx.font = `140px "${SERIF}"`; ctx.fillText(String(Math.floor(day)), CX + 225, y + 48);
    ctx.restore();
  }
  function slate(ctx, s) { ctx.save(); ctx.fillStyle = ink(0.6); ctx.fillRect(40, 1818, 560, 58); ctx.restore(); L.slate(ctx, s); }

  // ---------- paper + wood grain (static texture, built once) ----------
  const { createCanvas } = require('@napi-rs/canvas');
  const grainCv = createCanvas(1080, 1920), gx = grainCv.getContext('2d'); const gr = L.rng(77);
  for (let i = 0; i < 150; i++) { const y0 = i * 13 + gr() * 8, ph = gr() * 6, am = 4 + gr() * 10; gx.strokeStyle = gr() < 0.5 ? 'rgba(60,50,40,0.07)' : 'rgba(255,250,235,0.10)'; gx.lineWidth = 1 + gr() * 2; gx.beginPath();
    for (let x = 0; x <= 1080; x += 20) { const y = y0 + Math.sin(x * 0.006 + ph) * am + Math.sin(x * 0.021 + ph * 2) * 2; x ? gx.lineTo(x, y) : gx.moveTo(x, y); } gx.stroke(); }
  for (let k = 0; k < 4; k++) { const kx = 100 + gr() * 880, ky = 200 + gr() * 1500; for (let j = 1; j < 7; j++) { gx.strokeStyle = 'rgba(60,50,40,0.06)'; gx.lineWidth = 2; gx.beginPath(); gx.ellipse(kx, ky, j * 16, j * 6, 0, 0, 7); gx.stroke(); } }
  for (let i = 0; i < 900; i++) { gx.fillStyle = gr() < 0.5 ? 'rgba(40,35,30,0.10)' : 'rgba(255,250,235,0.16)'; gx.fillRect(gr() * 1080, gr() * 1920, 1 + gr() * 3, 1 + gr() * 2); }
  function paper(ctx) { ctx.fillStyle = PAPER; ctx.fillRect(-2000, -2000, 5080, 5920); }

  // ================= CHASE (behind the courier) =================
  const HOR = 930; // ground line / vanishing y
  const cr = L.rng(12);
  const ridges = [0, 1, 2, 3].map(r => { const ph = cr() * 6, f = 0.004 + cr() * 0.003, amp = [120, 150, 170, 120][r], base = [HOR - 150, HOR - 90, HOR - 30, HOR + 10][r];
    const top = x => base - amp * (0.55 + 0.45 * Math.sin(x * f + ph)) - 18 * Math.sin(x * 0.03 + ph * 3);
    return { r, top, tone: G[1 + Math.min(r, 3)] }; });
  const segs = []; ridges.forEach(rg => { for (let k = 0; k < 7; k++) { const x0 = -400 + k * 270, x1 = x0 + 272, p = [];
    for (let x = x0; x <= x1; x += 15) p.push([x, rg.top(x)]); p.push([x1, HOR + 60], [x0, HOR + 60]);
    segs.push({ rg, p, g: mkGouges(cr, x0, rg.top((x0 + x1) / 2) + 10, x1, HOR + 40, 9, 70, 3) }); } });
  segs.map(s => ({ s, k: s.rg.r + cr() * 1.6 })).sort((a, b) => a.k - b.k).forEach((o, i) => { o.s.rank = i; o.s.redDay = dayForShare((i + 0.5) / segs.length); });
  const furrows = []; for (let i = 0; i < 26; i++) furrows.push({ x: -1400 + i * 150 + cr() * 60, a: 0.12 + cr() * 0.12 });
  // courier run distance (world units), stalls at the trials gate
  const STALL = [tOfDay(TRIAL), tOfDay(TRIAL) + 0.7];
  const RUN = []; { let d = 0; for (let i = 0; i <= 38 * 120; i++) { const t = i / 120; RUN.push(d); const stalled = t >= STALL[0] && t < STALL[1]; d += stalled ? 0 : 6.2 / 120; } }
  const runAt = t => RUN[Math.max(0, Math.min(RUN.length - 1, Math.round(t * 120)))];
  const zy = z => HOR + 990 / z, zhw = z => 700 / z;

  function gate(ctx, z, label, armUp, village) {
    if (z < 1.2 || z > 40) return; const y = zy(z), hw = zhw(z), s = 1 / z;
    const lx = 540 - hw - 40 * s, rx = 540 + hw + 40 * s, ph = 980 * s;
    ctx.fillStyle = G[5]; ctx.fillRect(lx - 26 * s, y - ph, 52 * s, ph); ctx.fillRect(rx - 26 * s, y - ph, 52 * s, ph);
    if (village) { ctx.fillRect(lx - 60 * s, y - ph - 60 * s, rx - lx + 120 * s, 70 * s); ctx.fillStyle = G[3]; ctx.fillRect(lx - 40 * s, y - ph + 10 * s, rx - lx + 80 * s, 30 * s); }
    else { ctx.save(); ctx.translate(lx, y - 420 * s); ctx.rotate(-armUp * 1.35); const len = rx - lx;
      for (let k = 0; k < 8; k++) { ctx.fillStyle = k % 2 ? PAPER : G[5]; ctx.fillRect(k * len / 8, -24 * s, len / 8 + 1, 48 * s); } ctx.strokeStyle = G[5]; ctx.lineWidth = 5 * s; ctx.strokeRect(0, -24 * s, len, 48 * s); ctx.restore(); }
    if (label) { const fz = L.clamp(160 * s, 26, 60); ctx.save(); ctx.font = `${fz}px "${HAND}"`; ctx.textAlign = 'left'; const tw = ctx.measureText(label).width;
      const bx = Math.max(90, lx - tw / 2), by = y - ph - (village ? 90 : 20) * s - fz * 0.4; ctx.fillStyle = PAPER; ctx.fillRect(bx - 12, by - fz, tw + 24, fz * 1.3); ctx.strokeStyle = G[5]; ctx.lineWidth = 3; ctx.strokeRect(bx - 12, by - fz, tw + 24, fz * 1.3);
      ctx.fillStyle = G[5]; ctx.fillText(label, bx, by); ctx.restore(); }
  }

  // courier from behind; (x, feetY), scale s, phase p, running flag
  function courier(ctx, x, fy, s, p, running, crateA = 1) {
    ctx.save(); ctx.translate(x, fy); ctx.scale(s, s);
    const bob = running ? Math.abs(Math.sin(p)) * 18 : Math.sin(p * 0.3) * 2; ctx.translate(0, -bob); ctx.rotate(running ? 0.04 * Math.sin(p) : 0);
    glow(ctx, 0, -500, 420, crateA);
    const lift = d => running ? Math.max(0, d * Math.sin(p)) * 120 : 0;
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    [[-1, lift(1)], [1, lift(-1)]].forEach(([d, l]) => { ctx.strokeStyle = G[5]; ctx.lineWidth = 64; ctx.beginPath(); ctx.moveTo(d * 48, -330); ctx.lineTo(d * 56, -170 - l * 0.35); ctx.lineTo(d * 52, -30 - l); ctx.stroke();
      ctx.fillStyle = G[5]; ctx.beginPath(); ctx.ellipse(d * 52, -18 - l, 44, 26, 0, 0, 7); ctx.fill(); ctx.fillStyle = G[2]; ctx.fillRect(d * 52 - 30, -20 - l, 60, 8); });
    polyPath(ctx, [[-95, -320], [95, -320], [135, -630], [-135, -630]]); ctx.fillStyle = G[4]; ctx.fill();
    const sw = running ? Math.sin(p) : 0;
    [[-1, sw], [1, -sw]].forEach(([d, a]) => { ctx.strokeStyle = G[4]; ctx.lineWidth = 46; ctx.beginPath(); ctx.moveTo(d * 128, -600); ctx.lineTo(d * 175, -470 + a * 50); ctx.lineTo(d * 165, -350 + a * 90); ctx.stroke(); ctx.fillStyle = G[3]; ctx.beginPath(); ctx.arc(d * 165, -340 + a * 90, 26, 0, 7); ctx.fill(); });
    ctx.fillStyle = G[5]; ctx.beginPath(); ctx.arc(0, -705, 72, 0, 7); ctx.fill(); ctx.strokeStyle = pap(0.25); ctx.lineWidth = 4; for (let k = -2; k <= 2; k++) { ctx.beginPath(); ctx.arc(k * 10, -690, 50, 3.6, 5.8); ctx.stroke(); }
    // the crate
    ctx.fillStyle = GREEN; ctx.fillRect(-150, -650, 300, 270); ctx.strokeStyle = DKGREEN; ctx.lineWidth = 8; for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(-150, -650 + k * 67); ctx.lineTo(150, -650 + k * 67); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(-150, -650); ctx.lineTo(150, -380); ctx.stroke(); ctx.strokeStyle = G[5]; ctx.lineWidth = 10; ctx.strokeRect(-150, -650, 300, 270);
    ctx.fillStyle = G[5]; ctx.fillRect(-110, -660, 30, 150); ctx.fillRect(80, -660, 30, 150);
    ctx.restore();
  }

  function drawChase(ctx, day, t, village) {
    paper(ctx);
    // hills (red washes over them in the data's order)
    segs.forEach(sg => { polyPath(ctx, sg.p); ctx.fillStyle = sg.rg.tone; ctx.fill();
      const a = sg.redDay === null ? 0 : L.clamp((day - sg.redDay) / 4, 0, 1);
      if (a > 0) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = RED; ctx.fill(); ctx.restore(); }
      ctx.save(); polyPath(ctx, sg.p); ctx.clip(); gouges(ctx, sg.g, a > 0.5 ? 'rgba(120,20,15,0.35)' : pap(0.35)); ctx.restore();
      ctx.strokeStyle = G[5]; ctx.lineWidth = 4; ctx.beginPath(); sg.p.slice(0, -2).forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); });
    if (village) { for (let k = 0; k < 7; k++) { const x = 260 + k * 85, y = HOR - 10, h = 30 + (k * 37 % 25); ctx.fillStyle = G[4]; ctx.fillRect(x - 28, y - h, 56, h); polyPath(ctx, [[x - 36, y - h], [x + 36, y - h], [x, y - h - 30]]); ctx.fill(); } }
    // ground + furrows + road
    ctx.fillStyle = G[1]; ctx.fillRect(-2000, HOR, 5080, 3000);
    furrows.forEach(f => { ctx.strokeStyle = ink(f.a); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(540 + (f.x - 540) * 0.02, HOR); ctx.lineTo(f.x, 2600); ctx.stroke(); });
    const zb = 990 / (2600 - HOR);
    polyPath(ctx, [[540 - 6, HOR], [540 + 6, HOR], [540 + zhw(zb), 2600], [540 - zhw(zb), 2600]]); ctx.fillStyle = G[3]; ctx.fill();
    ctx.strokeStyle = G[5]; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(540, HOR); ctx.lineTo(540 - zhw(zb), 2600); ctx.moveTo(540, HOR); ctx.lineTo(540 + zhw(zb), 2600); ctx.stroke();
    const run = runAt(t); for (let k = 0; k < 40; k++) { const d = k * 1.6 - (run % 1.6) + 0.3; const z1 = d, z2 = d + 0.7; if (z1 < 0.25) continue;
      const y1 = zy(z2), y2 = zy(z1), w1 = 16 / z2, w2 = 16 / z1; polyPath(ctx, [[540 - w1, y1], [540 + w1, y1], [540 + w2, y2], [540 - w2, y2]]); ctx.fillStyle = pap(0.8); ctx.fill(); }
    // gates
    if (village) gate(ctx, 7.2 - t * 1.4, 'the last village', 0, true);
    else { const gz = runAt(STALL[0]) + 1.7 - run + 1.04; const up = L.ease.inOut(L.clamp((t - STALL[1] + 0.1) / 0.4, 0, 1)); gate(ctx, gz, 'trials', up, false); }
    const stalled = !village && t >= STALL[0] && t < STALL[1];
    courier(ctx, 540, 1880, 1, run * 1.9, !stalled);
  }
  function chaseCam(ctx, t) {
    const [x, y, z] = L.key([[0, [540, 1060, 1.04]], [1.8, [540, 1040, 1.06]], [5.9, [540, 1000, 1.12]], [8.2, [540, 560, 0.62]]], t);
    const sh = t < 6 ? 1 : 0.5; const bob = Math.abs(Math.sin(runAt(t) * 1.9));
    const sx = (L.noise(t * 1.6, 3) - 0.5) * 34 * sh, sy = (L.noise(t * 2.1, 7) - 0.5) * 26 * sh + bob * 10 * sh, rot = (L.noise(t * 1.1, 11) - 0.5) * 0.035 * sh;
    ctx.translate(540, 960); ctx.rotate(rot); ctx.scale(z, z); ctx.translate(-x - sx, -y - sy);
  }

  // ================= MAP (carved relief of roads and borders) =================
  const mr = L.rng(2026); const N = 60;
  const landR = a => 1 + 0.15 * Math.sin(a * 3 + 1) + 0.09 * Math.sin(a * 5 + 2.3) + 0.06 * Math.sin(a * 9 + 0.7);
  const inLand = (x, y) => { const dx = (x - 540) / 450, dy = (y - 980) / 690; return Math.hypot(dx, dy) < landR(Math.atan2(dy, dx)) * 0.9; };
  const land = []; for (let i = 0; i < 44; i++) { const a = i / 44 * Math.PI * 2, r = landR(a) * (1 + (mr() - 0.5) * 0.04); land.push([540 + Math.cos(a) * 450 * r, 980 + Math.sin(a) * 690 * r]); }
  const landG = mkGouges(mr, 80, 250, 1000, 1700, 90, 50, 3);
  const nodes = []; while (nodes.length < N) { const x = 110 + mr() * 860, y = 320 + mr() * 1340; if (!inLand(x, y)) continue; if (nodes.some(n => Math.hypot(n.x - x, n.y - y) < 100)) continue; nodes.push({ x, y, i: nodes.length }); }
  const nearest = (x, y, ex = []) => nodes.filter(n => !ex.includes(n)).reduce((b, n) => Math.hypot(n.x - x, n.y - y) < Math.hypot(b.x - x, b.y - y) ? n : b);
  const origin = nearest(320, 470), hub = nearest(520, 900, [origin]);
  nodes.map(n => ({ n, k: Math.hypot(n.x - origin.x, n.y - origin.y) + mr() * 280 })).sort((a, b) => a.k - b.k).forEach((o, r) => { o.n.redDay = dayForShare((r + 0.5) / N); });
  // road tree (Prim from the approval hub)
  // each country routes toward the hub through a nearer neighbour (short hops, every hop crosses a border)
  const dh = n => Math.hypot(n.x - hub.x, n.y - hub.y); hub.parent = null;
  nodes.forEach(n => { if (n === hub) return; let best = hub, bc = 1e9; nodes.forEach(m => { if (m === n || dh(m) > dh(n) - 40) return; const c = Math.hypot(n.x - m.x, n.y - m.y) + 0.3 * dh(m); if (c < bc) { bc = c; best = m; } }); n.parent = best; });
  nodes.forEach(n => { const p = []; let c = n; while (c) { p.unshift(c); c = c.parent; } n.path = p; });
  const edges = nodes.filter(n => n.parent).map(n => ({ a: n.parent, b: n, mx: (n.x + n.parent.x) / 2, my: (n.y + n.parent.y) / 2, ang: Math.atan2(n.y - n.parent.y, n.x - n.parent.x) }));
  // arrival quantiles (shuffled); the village is the far node forced to q = 0.90
  const qs = nodes.map((_, i) => (i + 0.5) / N); for (let i = qs.length - 1; i > 0; i--) { const j = Math.floor(mr() * (i + 1)); [qs[i], qs[j]] = [qs[j], qs[i]]; }
  const vil = nodes.filter(n => n !== hub && n !== origin && n.x > 300 && n.x < 760).reduce((b, n) => n.y > b.y ? n : b);
  nodes.forEach((n, i) => { n.q = n === vil ? VQ : qs[i]; n.gDay = Math.max(FIRST, L.lognormalQuantile(n.q, MED, P90)); n.aiDay = Math.max(FIRST, L.lognormalQuantile(n.q, AIMED, AIP90)); });
  hub.gDay = FIRST; hub.aiDay = FIRST;
  const vilPathSet = new Set(vil.path);
  function crateAt(n, day, key = 'gDay') {
    const arr = n[key]; if (n === hub) return day >= arr ? { x: hub.x, y: hub.y, done: true } : null;
    if (day < APPROVE) return null; const f = L.clamp((day - APPROVE) / (arr - APPROVE), 0, 1); if (f >= 1) return { x: n.x, y: n.y, done: true };
    const k = n.path.length - 1, hi = Math.min(k - 1, Math.floor(f * k)), lf = f * k - hi, a = n.path[hi], b = n.path[hi + 1];
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, ang = Math.atan2(b.y - a.y, b.x - a.x), back = 16 + (n.i % 4) * 15;
    const qx = mx - Math.cos(ang) * back, qy = my - Math.sin(ang) * back;
    if (lf < 0.15) { const u = lf / 0.15; return { x: L.lerp(a.x, qx, u), y: L.lerp(a.y, qy, u) }; }
    if (lf < 0.85) return { x: qx, y: qy, wait: true };
    const u = (lf - 0.85) / 0.15; return { x: L.lerp(qx, b.x, u), y: L.lerp(qy, b.y, u) };
  }
  function drawMap(ctx, day, t, zoom) {
    paper(ctx);
    for (let i = 0; i < 40; i++) { const y = 140 + i * 45; ctx.strokeStyle = ink(0.12); ctx.lineWidth = 3; ctx.beginPath(); for (let x = -200; x < 1300; x += 40) { const yy = y + Math.sin(x * 0.02 + i) * 6; x > -200 ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy); } ctx.stroke(); }
    polyPath(ctx, land); ctx.fillStyle = G[1]; ctx.fill(); ctx.save(); polyPath(ctx, land); ctx.clip(); gouges(ctx, landG, pap(0.4)); ctx.restore();
    ctx.strokeStyle = G[5]; ctx.lineWidth = 7; polyPath(ctx, land); ctx.stroke();
    ctx.strokeStyle = ink(0.35); ctx.lineWidth = 3; polyPath(ctx, land.map(([x, y]) => [540 + (x - 540) * 1.035, 980 + (y - 980) * 1.03])); ctx.stroke();
    // red: flat carved discs per country, on its data day
    nodes.forEach(n => { if (n.redDay === null || day < n.redDay) return; const a = L.clamp((day - n.redDay) / 4, 0, 1); ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(n.x, n.y, 44, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(120,20,15,0.35)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(n.x, n.y, 30, 0.3, 2.6); ctx.stroke(); ctx.restore(); });
    // roads (grooves) and borders (bars)
    edges.forEach(e => { const hl = vilPathSet.has(e.b); ctx.strokeStyle = G[5]; ctx.lineWidth = hl ? 12 : 8; ctx.beginPath(); ctx.moveTo(e.a.x, e.a.y); ctx.lineTo(e.b.x, e.b.y); ctx.stroke();
      ctx.strokeStyle = PAPER; ctx.lineWidth = hl ? 5 : 3; ctx.stroke(); });
    edges.forEach(e => { ctx.save(); ctx.translate(e.mx, e.my); ctx.rotate(e.ang); ctx.fillStyle = G[5]; ctx.fillRect(-5, -22, 10, 44); ctx.restore(); });
    nodes.forEach(n => { ctx.fillStyle = G[5]; ctx.fillRect(n.x - 11, n.y - 8, 22, 18); polyPath(ctx, [[n.x - 15, n.y - 8], [n.x + 15, n.y - 8], [n.x, n.y - 22]]); ctx.fill();
      if (n !== hub && day >= n.gDay) { ctx.strokeStyle = GREEN; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(n.x, n.y, 26, 0, 7); ctx.stroke(); } });
    // crates: stockpiled at the approval gate, then queued at every border
    const pile = []; nodes.forEach(n => { if (n === hub) return; const c = crateAt(n, day); if (!c) pile.push(n); else if (!c.done) { glow(ctx, c.x, c.y, 30, 0.8); ctx.fillStyle = GREEN; ctx.fillRect(c.x - 9, c.y - 9, 18, 18); ctx.strokeStyle = G[5]; ctx.lineWidth = 2; ctx.strokeRect(c.x - 9, c.y - 9, 18, 18);
      if (n === vil) { ctx.strokeStyle = G[5]; ctx.lineWidth = 4; ctx.strokeRect(c.x - 17, c.y - 17, 34, 34); } } });
    if (pile.length) { const cols = 8; const ox = hub.x + 36, oy = hub.y - 60; glow(ctx, ox + 80, oy + 70, 160, 0.7);
      pile.forEach((n, k) => { const x = ox + (k % cols) * 21, y = oy + Math.floor(k / cols) * 21; ctx.fillStyle = GREEN; ctx.fillRect(x, y, 18, 18); ctx.strokeStyle = G[5]; ctx.lineWidth = 2; ctx.strokeRect(x, y, 18, 18); if (n === vil) { ctx.lineWidth = 4; ctx.strokeRect(x - 3, y - 3, 24, 24); } });
      ctx.fillStyle = G[5]; ctx.fillRect(hub.x + 22, oy - 12, 8, 190); }
    // labels (counter-scaled so they stay phone-legible)
    const ls = 1 / zoom; ctx.save(); ctx.font = `${44 * ls}px "${HAND}"`; ctx.textAlign = 'left';
    const lab = (txt, x, y) => { const w = ctx.measureText(txt).width; ctx.fillStyle = PAPER; ctx.fillRect(x - 8 * ls, y - 40 * ls, w + 16 * ls, 52 * ls); ctx.fillStyle = G[5]; ctx.fillText(txt, x, y); };
    if (day < FIRST + 20) lab('approval', hub.x - 200 * ls, hub.y + 70 * ls);
    lab('the village', vil.x - 230 * ls, vil.y + 70 * ls); ctx.restore();
    ctx.strokeStyle = G[5]; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(vil.x, vil.y, 36, 0, 7); ctx.stroke();
  }
  function mapCam(ctx, t) {
    const V = [vil.x, vil.y];
    const [x, y, z] = L.key([[6.6, [hub.x + 60, hub.y, 3.2]], [9.8, [540, 990, 1.0]], [15.0, [530, 1000, 0.97]], [17.6, [V[0], V[1] - 10, 3.4]]], t);
    ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-x, -y); return z;
  }

  // ================= VILLAGE (gate, square, empty chairs) =================
  const vr = L.rng(505);
  const chairs = []; [[1010, 0.62], [1100, 0.76], [1205, 0.92]].forEach(([y, s], row) => { for (let c = 0; c < 5; c++) chairs.push({ x: 540 + (c - 2) * 118 * s * 1.25, y, s, row }); });
  const EMPTY = new Set([1, 4, 6, 8, 12, 13]); // index 12 = front row, center: the chair the crate rests on in IN++
  const vilHillsG = mkGouges(vr, -300, 620, 1380, 960, 40, 90, 4);
  function villager(ctx, x, y, s, look, mood) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = G[4]; polyPath(ctx, [[-38, 0], [38, 0], [30, -95], [-30, -95]]); ctx.fill();
    ctx.fillStyle = G[5]; ctx.beginPath(); ctx.arc(look * 4, -128, 34, 0, 7); ctx.fill();
    ctx.strokeStyle = PAPER; ctx.lineWidth = 4; ctx.lineCap = 'round'; const ex = 12, ey = -132, lx = look * 7;
    if (mood === 'sad') { [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(lx + d * ex, ey - 2, 6, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }); ctx.beginPath(); ctx.arc(lx, -104, 8, 1.2 * Math.PI, 1.8 * Math.PI); ctx.stroke(); }
    else { ctx.fillStyle = PAPER; [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(lx + d * ex, ey, 5, 0, 7); ctx.fill(); }); ctx.beginPath(); ctx.moveTo(lx - 7, -110); ctx.lineTo(lx + 7, -110); ctx.stroke(); }
    ctx.restore();
  }
  function chair(ctx, c, occupied, look, mood) {
    ctx.save(); ctx.translate(c.x, c.y); ctx.scale(c.s, c.s);
    ctx.fillStyle = G[3]; ctx.fillRect(-42, -150, 84, 96); ctx.strokeStyle = G[5]; ctx.lineWidth = 5; ctx.strokeRect(-42, -150, 84, 96);
    ctx.strokeStyle = pap(0.35); ctx.lineWidth = 3; for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(-30, -130 + k * 26); ctx.lineTo(30, -128 + k * 26); ctx.stroke(); }
    ctx.fillStyle = G[4]; ctx.fillRect(-50, -56, 100, 18); ctx.fillRect(-46, -40, 12, 44); ctx.fillRect(34, -40, 12, 44);
    ctx.restore();
    if (occupied) villager(ctx, c.x, c.y - 44 * c.s, c.s * 0.95, look, mood);
  }
  function drawVillage(ctx, day, t, phase) {
    paper(ctx);
    // hills behind the village: red since the village's red day
    const ra = L.clamp((day - vil.redDay) / 4, 0, 1);
    const hill = []; for (let x = -400; x <= 1480; x += 20) hill.push([x, 700 - 90 * (0.5 + 0.5 * Math.sin(x * 0.006 + 1.3)) - 20 * Math.sin(x * 0.027)]); hill.push([1480, 1000], [-400, 1000]);
    polyPath(ctx, hill); ctx.fillStyle = G[2]; ctx.fill(); if (ra > 0) { ctx.save(); ctx.globalAlpha = ra; ctx.fillStyle = RED; ctx.fill(); ctx.restore(); }
    ctx.save(); polyPath(ctx, hill); ctx.clip(); gouges(ctx, vilHillsG, ra > 0.5 ? 'rgba(120,20,15,0.35)' : pap(0.35)); ctx.restore();
    ctx.strokeStyle = G[5]; ctx.lineWidth = 5; ctx.beginPath(); hill.slice(0, -2).forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke();
    for (let k = 0; k < 11; k++) { const x = -60 + k * 115, h = 70 + (k * 53 % 60), y = 900; ctx.fillStyle = k % 2 ? G[4] : G[3]; ctx.fillRect(x - 50, y - h, 100, h + 40); polyPath(ctx, [[x - 62, y - h], [x + 62, y - h], [x, y - h - 55]]); ctx.fillStyle = G[5]; ctx.fill(); }
    // square
    ctx.fillStyle = G[1]; ctx.fillRect(-600, 900, 2280, 1600); ctx.strokeStyle = ink(0.18); ctx.lineWidth = 3; for (let k = 0; k < 14; k++) { const y = 920 + k * k * 7; ctx.beginPath(); ctx.moveTo(-600, y); ctx.lineTo(1680, y); ctx.stroke(); }
    // green arrival pool (attention) once the crate is in
    const arrived = day >= VDAY; const ga = phase === 'inpp' ? 1 : arrived ? L.sm(TEND, TEND + 0.8, t) : 0;
    if (ga > 0) { ctx.save(); ctx.scale(1, 0.35); glow(ctx, 540, 1250 / 0.35, 520, ga); ctx.restore(); }
    // chairs: villagers turn toward the crate after it arrives
    const look = ga > 0 ? 1 : 0; chairs.forEach((c, i) => chair(ctx, c, !EMPTY.has(i), look * (c.x < 540 ? 1 : -1) * 0.8 * ga, 'sad'));
    // crate on the empty front chair (IN++)
    if (phase === 'inpp') { const c = chairs[12]; glow(ctx, c.x, c.y - 90, 260, 1); ctx.fillStyle = GREEN; ctx.fillRect(c.x - 58, c.y - 158, 116, 104); ctx.strokeStyle = DKGREEN; ctx.lineWidth = 5; for (let k = 1; k < 3; k++) { ctx.beginPath(); ctx.moveTo(c.x - 58, c.y - 158 + k * 35); ctx.lineTo(c.x + 58, c.y - 158 + k * 35); ctx.stroke(); }
      ctx.strokeStyle = G[5]; ctx.lineWidth = 5; ctx.strokeRect(c.x - 58, c.y - 158, 116, 104);
      villager(ctx, 700, 1300, 1.25, -1, 'sad'); }
    // the village gate (foreground frame)
    ctx.fillStyle = G[5]; ctx.fillRect(170, 620, 70, 900); ctx.fillRect(840, 620, 70, 900); ctx.fillRect(110, 570, 860, 80); ctx.fillStyle = G[3]; ctx.fillRect(140, 655, 800, 26);
    ctx.strokeStyle = pap(0.3); ctx.lineWidth = 3; for (let k = 0; k < 5; k++) { ctx.beginPath(); ctx.moveTo(130 + k * 170, 590); ctx.lineTo(220 + k * 170, 594); ctx.stroke(); }
    // courier (from behind) approaching until the day it arrives
    if (phase !== 'inpp') { const f = L.ease.out(L.clamp((t - 17.0) / (TEND - 17.0), 0, 1)); const running = t < TEND; courier(ctx, 540, L.lerp(2250, 1720, f), L.lerp(0.95, 0.78, f), t * 11, running, 1); }
  }
  function villageCam(ctx, t, phase) {
    let x, y, z, sh;
    if (phase === 'inpp') { [x, y, z] = L.key([[30.0, [560, 1130, 1.75]], [33.8, [575, 1110, 2.25]]], t); sh = 0.25; }
    else { [x, y, z] = L.key([[17.0, [540, 1180, 0.98]], [TEND, [540, 1120, 1.12]], [23.4, [540, 1110, 1.16]]], t); sh = t < TEND ? 1 : 0.2; }
    const sx = (L.noise(t * 1.6, 13) - 0.5) * 30 * sh, sy = (L.noise(t * 2.1, 17) - 0.5) * 24 * sh, rot = (L.noise(t * 1.1, 19) - 0.5) * 0.03 * sh;
    ctx.translate(540, 960); ctx.rotate(rot); ctx.scale(z, z); ctx.translate(-x - sx, -y - sy);
  }

  // ================= SNAP (flat, two panels 900 wide) =================
  const TS = 23.4, SNAPR = 190; // days per second at true proportion
  const cells = nodes.map((n, i) => ({ n, cx: 150 + (i % 12) * 70, cy: Math.floor(i / 12) * 62 }));
  function panel(ctx, y0, day, title, sub, key, a) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = G[0]; ctx.fillRect(90, y0, 900, 440); ctx.strokeStyle = G[5]; ctx.lineWidth = 6; ctx.strokeRect(90, y0, 900, 440); ctx.lineWidth = 2; ctx.strokeRect(100, y0 + 10, 880, 420);
    ctx.fillStyle = G[5]; ctx.textAlign = 'left'; ctx.font = `56px "${SERIF}"`; ctx.fillText(title, 120, y0 + 66);
    if (sub) { const tw = ctx.measureText(title).width; ctx.font = `48px "${HAND}"`; ctx.fillStyle = G[4]; ctx.fillText('(' + sub + ')', 140 + tw, y0 + 64); }
    cells.forEach(({ n, cx, cy }) => { const x = cx, y = y0 + 120 + cy;
      if (n.redDay !== null && day >= n.redDay) { ctx.fillStyle = RED; ctx.fillRect(x - 27, y - 24, 54, 50); }
      ctx.fillStyle = G[5]; ctx.fillRect(x - 9, y - 6, 18, 14); polyPath(ctx, [[x - 13, y - 6], [x + 13, y - 6], [x, y - 18]]); ctx.fill();
      if (day >= n[key]) { ctx.fillStyle = GREEN; ctx.fillRect(x - 8, y + 10, 16, 14); ctx.strokeStyle = G[5]; ctx.lineWidth = 2; ctx.strokeRect(x - 8, y + 10, 16, 14); }
      if (n === vil) { ctx.strokeStyle = G[5]; ctx.lineWidth = 6; ctx.strokeRect(x - 33, y - 30, 66, 62); if (day >= n[key]) glow(ctx, x, y, 90, 1); } });
    ctx.restore();
  }
  function snapDays(t) { const lt = t - TS; const dA = lt < 3.2 ? L.clamp((lt - 0.5) * SNAPR, 0, DEND) : L.clamp((lt - 3.6) * SNAPR, 0, DEND); const dB = L.clamp((lt - 3.6) * SNAPR, 0, DEND); return { lt, dA, dB }; }
  function drawSnap(ctx, t) {
    paper(ctx); const { lt, dA, dB } = snapDays(t);
    clock(ctx, lt < 3.2 ? dA : dB, 1, 300);
    panel(ctx, 520, dA, 'As it happened', null, 'gDay', 1);
    panel(ctx, 1000, dB, 'Routed', 'illustrative', 'aiDay', L.sm(3.2, 3.5, lt));
  }

  // ================= main =================
  function draw(ctx, t) {
    ctx.save();
    if (t < 8.2) {
      const day = dayAt(t);
      ctx.save(); chaseCam(ctx, t); drawChase(ctx, day, t, t < T0); ctx.restore();
      if (t > 6.6) { ctx.save(); ctx.globalAlpha = L.sm(6.6, 7.6, t); ctx.save(); const z = mapCam(ctx, t); drawMap(ctx, day, t, z); ctx.restore(); ctx.restore(); }
      if (t < T0) slate(ctx, 'SC1  COLD OPEN  CLOSE  HANDHELD'); else if (t < 5.9) slate(ctx, 'SC2  CLOSE  HANDHELD CHASE'); else slate(ctx, 'SC3  CRANE UP');
      if (t > T0 - 0.08 && t < T0 + 0.25) { ctx.fillStyle = pap(0.9 * (1 - L.sm(T0, T0 + 0.25, t))); ctx.fillRect(0, 0, 1080, 1920); }
      clock(ctx, day, 1);
      card(ctx, ['Designed in 2 days.'], 560, 96, fade(t, -1, T0 - 0.05, 0.2));
      card(ctx, ['The road took the rest.'], 560, 92, fade(t, 2.2, 5.6));
    } else if (t < 17.6) {
      const day = dayAt(t);
      ctx.save(); const z = mapCam(ctx, t); drawMap(ctx, day, t, z); ctx.restore();
      if (t > 17.0) { ctx.save(); ctx.globalAlpha = L.sm(17.0, 17.6, t); ctx.save(); villageCam(ctx, t, 'arrive'); drawVillage(ctx, day, t, 'arrive'); ctx.restore(); ctx.restore(); }
      slate(ctx, t < 15 ? 'SC3  WIDE  HOLD' : 'SC4  DOLLY IN');
      clock(ctx, day, 1);
      card(ctx, ['The red needed no papers.'], 1440, 88, fade(t, 8.8, 12.6));
      card(ctx, ['Every border, a stamp.'], 1440, 88, fade(t, 13.4, 16.6));
    } else if (t < TS) {
      const day = dayAt(t);
      ctx.save(); villageCam(ctx, t, 'arrive'); drawVillage(ctx, day, t, 'arrive'); ctx.restore();
      slate(ctx, t < TEND ? 'SC4  CLOSE  HANDHELD' : 'SC4  LOCKED  HOLD');
      clock(ctx, day, 1);
      card(ctx, ['The last village on the list.'], 560, 80, fade(t, 17.4, TEND + 0.05, 0.2));
      card(ctx, ['Some chairs were', 'already empty.'], 560, 92, fade(t, 19.3, 21.3));
      if (t > 21.2) { ctx.fillStyle = pap(0.75 * L.sm(21.2, 21.6, t)); ctx.fillRect(0, 0, 1080, 1920); }
      card(ctx, ['We slowed it down', 'so you could see it.'], 700, 92, fade(t, 21.3, TS + 0.05, 0.25));
    } else if (t < 30.0) {
      drawSnap(ctx, t); slate(ctx, 'SC5  SNAP  WIDE FLAT');
    } else {
      ctx.save(); villageCam(ctx, t, 'inpp'); drawVillage(ctx, DEND, t, 'inpp'); ctx.restore();
      if (t < 30.4) { ctx.save(); ctx.globalAlpha = 1 - L.sm(30.0, 30.4, t); drawSnap(ctx, 29.99); ctx.restore(); }
      slate(ctx, 'SC6  EXTREME CLOSE  DOLLY IN');
      card(ctx, ['This is', 'the bottleneck.'], 470, 104, fade(t, 30.4, 33.9));
      if (t >= 33.8) L.endCard(ctx, L.sm(33.8, 34.2, t), { line: 'The bottleneck is us.' });
    }
    ctx.restore();
    if (t < 33.8) { ctx.save(); ctx.globalAlpha = 0.9; ctx.drawImage(grainCv, 0, 0); ctx.restore(); }
    // snap overlay cards (screen space)
    if (t >= TS && t < 30.0) { const lt = t - TS;
      card(ctx, ['At true speed.'], 470, 64, fade(lt, 0.3, 3.2, 0.2));
      card(ctx, ['Same crates. Better routes.'], 470, 64, fade(lt, 3.5, 6.6, 0.25)); }
  }

  return { draw, DUR,
    acts: [{ start: 0, end: TEND, bpm: 104, drone: true }, { start: TEND + 0.3, end: TS, bpm: 0, drone: true }, { start: TS + 0.3, end: 30, bpm: 0, drone: true }, { start: 30, end: DUR, bpm: 0, drone: true }],
    cues: [{ t: T0, type: 'whoosh' }, { t: STALL[0], type: 'stamp' }, { t: 7.0, type: 'whoosh' }, { t: tOfDay(APPROVE), type: 'stamp' }, { t: TEND, type: 'hit' },
      { t: TS + 0.5, type: 'hit' }, { t: TS + 3.6 + VAIDAY / SNAPR, type: 'ding' }, { t: TS + 3.6 + VDAY / SNAPR, type: 'bonk' }, { t: 30.4, type: 'pop' }, { t: 33.8, type: 'hit' }],
    _debug: { VDAY, VAIDAY, TEND, vilRed: vil.redDay, vilHops: vil.path.length - 1 } };
}
module.exports = makeScene;
