// keep-the-lights: wait-for-it, shadow puppet, theater. Analog: blackout-2003.
// One mapping (same as seven-minutes): race t = 1..17 s, event hours h = (t - 1) * 0.125  (1 film second = 7.5 minutes).
// Red: lamp filament flicker from t0 (silent alarm loss, s2); red crack at the first verified trip h = 0.85 (s6);
//      cascade = L.logistic fitted through extent 0.01 @ 1.87 and 0.99 @ 1.98 (doubling 0.0083 h). Windows go out by rank.
// Green: puppeteer pieces brighten at analog fragment ready_at; strings connect at L.lognormalQuantile(q, 1.5, 1.83).
// Snap: ai_counterfactual.aggregation_median 0.25 h vs human 1.5 h, labeled illustrative. See output/keep-the-lights/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('blackout-2003');
  const DUR = 38, RED = L.RED, GREEN = L.GREEN;

  // ---------- time mapping ----------
  const HPS = 0.125, T0 = 1.0, COLD_H = 1.93;
  const hAt = t => t < T0 ? COLD_H : Math.min(2.0, (t - T0) * HPS);
  const tOf = h => T0 + h / HPS;

  // ---------- threat ----------
  const TRIP = A.threat.points.find(p => p.t === 0.85).t;          // verified first trip (s6)
  const C0 = 1.87, C1 = 1.98;                                       // analog endpoints (motion only, never on screen)
  const DOUBLING = (C1 - C0) * Math.LN2 / Math.log(9801);          // fit: 0.01 -> 0.99 over C1 - C0
  const extent = h => h < C0 ? 0 : Math.min(1, L.logistic(h - C0, DOUBLING, 0.01) / L.logistic(C1 - C0, DOUBLING, 0.01));
  const hOutOf = r => { if (r <= extent(C0)) return C0; if (r >= 1) return C1; let lo = C0, hi = C1; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; extent(m) < r ? lo = m : hi = m; } return (lo + hi) / 2; };

  // ---------- green ----------
  const FR = {}; A.solution.fragments.forEach(f => FR[f.id] = f.ready_at);
  const AG = A.solution.aggregation, AI = A.ai_counterfactual.aggregation_median;
  // bays: A = right-upper (operators, f2), B = right-lower (IT staff, f1), C = left-upper (coordinator, f3), D = left-lower (neighbors, f4)
  const BAYS = {
    A: { x: 955, y: 590, piece: [872, 500], q0: 1.5 * Math.PI, ready: FR.f2, label: 'operators', side: 1 },
    B: { x: 955, y: 985, piece: [872, 880], q0: 0, ready: FR.f1, label: 'IT staff', side: 1 },
    C: { x: 125, y: 590, piece: [208, 500], q0: Math.PI, ready: FR.f3, label: 'coordinator', side: -1 },
    D: { x: 125, y: 985, piece: [208, 880], q0: 0.5 * Math.PI, ready: FR.f4, label: 'neighbors', side: -1 },
  };
  const PAIRS = [['D', 'C'], ['D', 'A'], ['B', 'C'], ['C', 'A'], ['B', 'D'], ['D', 'A']];
  const CALLS = PAIRS.map((p, i) => ({ a: p[0], b: p[1], h: L.lognormalQuantile((i + 0.5) / PAIRS.length, AG.median, AG.p90) }));
  CALLS.forEach(c => c.t = tOf(c.h));
  const GROW = 0.35, HOLD = 0.9, DROP = 0.7;

  // ---------- world layout (design space at zoom 1) ----------
  const SX0 = 262, SX1 = 818, SY0 = 300, SY1 = 1080;     // the screen
  const LAMP = [600, 690];
  const rng = L.rng(1408);
  const towers = [], windows = [];
  for (let layer = 0; layer < 2; layer++) {
    let x = SX0 - 10 + rng() * 20;
    while (x < SX1) { const w = 34 + rng() * 44, hgt = layer ? 110 + rng() * 230 : 200 + rng() * 170; const tw = { x, w, h: hgt, layer, ant: rng() < 0.3, cap: rng() < 0.3 }; towers.push(tw);
      const cols = Math.floor((w - 10) / 13), rows = Math.floor((hgt - 24) / 19);
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (rng() < (layer ? 0.5 : 0.28)) windows.push({ x: x + 7 + c * 13, y: SY1 - hgt + 16 + r * 19, layer });
      x += w + (layer ? 4 + rng() * 14 : -8 + rng() * 20); }
  }
  // outage ranks: distance from the lamp crack + seeded jitter -> each window's out-time from inverting extent(h)
  const maxD = Math.max(...windows.map(w => Math.hypot(w.x - LAMP[0], w.y - LAMP[1])));
  windows.forEach(w => w.key = Math.hypot(w.x - LAMP[0], w.y - LAMP[1]) / maxD * 0.8 + rng() * 0.2);
  windows.slice().sort((p, q) => p.key - q.key).forEach((w, n, arr) => { w.rank = (n + 0.5) / arr.length; w.hOut = hOutOf(w.rank); });
  // audience rows (front row is nearest the screen = higher in frame, smaller)
  const ROWS = [[1165, 24], [1262, 30], [1385, 37], [1540, 45], [1725, 55]];
  const PROT = { x: 720, y: 1262, s: 2.0 };
  const heads = [];
  ROWS.forEach(([y, r], ri) => { const gap = r * 2.55; for (let x = 40 + (ri % 2) * gap / 2 + rng() * 10; x < 1080; x += gap * (0.92 + rng() * 0.16)) {
    if (ri === 1 && Math.abs(x - PROT.x) < 80) continue; heads.push({ x, y: y + (rng() - 0.5) * 8, r: r * (0.9 + rng() * 0.2), ri, tilt: (rng() - 0.5) * 0.15 }); } });

  // ---------- helpers ----------
  const fade = (t, a, b, f = 0.3) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));
  function glow(ctx, x, y, r, rgb, a) { if (a <= 0.005) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); }
  const mix = (c1, c2, f) => { f = L.clamp(f, 0, 1); const a = c1.match(/\w\w/g).map(v => parseInt(v, 16)), b = c2.match(/\w\w/g).map(v => parseInt(v, 16)); return '#' + a.map((v, i) => Math.round(L.lerp(v, b[i], f)).toString(16).padStart(2, '0')).join(''); };
  function card(ctx, lines, y, size, a, col) { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center';
    let yy = y; lines.forEach((l, i) => { const o = typeof l === 'string' ? { text: l } : l; let fz = o.size || size; ctx.font = `${fz}px "${SERIF}"`;
      while (ctx.measureText(o.text).width > 800 && fz > 30) { fz -= 4; ctx.font = `${fz}px "${SERIF}"`; }
      if (i) yy += fz * 1.06; ctx.lineJoin = 'round'; ctx.lineWidth = fz * 0.14; ctx.strokeStyle = 'rgba(10,13,18,0.95)'; ctx.strokeText(o.text, 490, yy);
      ctx.fillStyle = o.col || col || '#f4f1ea'; ctx.fillText(o.text, 490, yy); }); ctx.restore(); }
  function slate(ctx, s) { ctx.save(); ctx.fillStyle = 'rgba(8,11,16,0.6)'; ctx.fillRect(40, 1818, 640, 58); ctx.restore(); L.slate(ctx, s); }
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  // bean character (after scenes/example_follow_the_green.js)
  function bean(ctx, x, y, s, { col = '#d9d4ca', mood = 'flat', look = [0, 0], arm = 0, eye = '#fffdf7', ink = '#1b1f27' } = {}) {
    const bw = 46 * s, bh = 60 * s; ctx.save(); ctx.lineCap = 'round';
    ctx.strokeStyle = col; ctx.lineWidth = 7 * s;
    [-1, 1].forEach(sd => { const ax = x + sd * bw * 0.42, ay = y + bh * 0.02; const ang = arm && sd === arm.side ? arm.ang : Math.PI / 2 + sd * 0.25;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + Math.cos(ang) * bw * 0.62, ay + Math.sin(ang) * bw * 0.62); ctx.stroke(); });
    ctx.fillStyle = col; rr(ctx, x - bw / 2, y - bh / 2, bw, bh, bw / 2); ctx.fill();
    const ey = y - bh * 0.14, er = bw * (mood === 'panic' ? 0.17 : 0.14);
    [-1, 1].forEach(sd => { const ex = x + sd * bw * 0.19;
      ctx.fillStyle = eye; ctx.beginPath(); ctx.arc(ex, ey, er, 0, 7); ctx.fill(); ctx.strokeStyle = ink; ctx.lineWidth = 1.6 * s; ctx.stroke();
      ctx.fillStyle = ink; ctx.beginPath(); ctx.arc(ex + look[0] * er * 0.45, ey + look[1] * er * 0.45, er * (mood === 'panic' ? 0.36 : 0.5), 0, 7); ctx.fill();
      if (mood === 'flat' || mood === 'sad') { ctx.fillStyle = col; ctx.fillRect(ex - er * 1.15, ey - er * 1.15, er * 2.3, er * (mood === 'sad' ? 0.95 : 0.75)); }
      if (mood === 'sad') { ctx.strokeStyle = ink; ctx.lineWidth = 2.6 * s; ctx.beginPath(); ctx.moveTo(ex - er, ey - er * 0.2 - sd * er * 0.35); ctx.lineTo(ex + er, ey - er * 0.2 + sd * er * 0.35); ctx.stroke(); }
      if (mood === 'panic') { ctx.strokeStyle = ink; ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.moveTo(ex - er, ey - er * 1.6 + sd * er * 0.3); ctx.lineTo(ex + er, ey - er * 1.6 - sd * er * 0.3); ctx.stroke(); } });
    const my = y + bh * 0.15; ctx.strokeStyle = ink; ctx.fillStyle = ink; ctx.lineWidth = 3 * s; ctx.beginPath();
    if (mood === 'panic') { ctx.ellipse(x, my + bh * 0.03, bw * 0.09, bw * 0.12, 0, 0, 7); ctx.fill(); }
    else if (mood === 'sad') { ctx.arc(x, my + bw * 0.1, bw * 0.12, 1.2 * Math.PI, 1.8 * Math.PI); ctx.stroke(); }
    else if (mood === 'happy') { ctx.arc(x, my - bw * 0.04, bw * 0.13, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }
    else { ctx.moveTo(x - bw * 0.1, my); ctx.lineTo(x + bw * 0.1, my); ctx.stroke(); }
    ctx.restore();
  }

  // one quarter of the green dial (the pieces are the four quarters of one shape; B's quarter carries the handle)
  function quarter(ctx, x, y, q0, g, r = 30, handle = false) {
    ctx.save(); ctx.lineCap = 'butt'; const col = mix('1d4a33', '34d27b', 0.25 + 0.75 * g);
    ctx.strokeStyle = col; ctx.lineWidth = r * 0.5; ctx.beginPath(); ctx.arc(x, y, r, q0 + 0.06, q0 + Math.PI / 2 - 0.06); ctx.stroke();
    if (handle) { ctx.lineWidth = r * 0.28; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + Math.cos(q0 + Math.PI / 4) * r * 1.2, y + Math.sin(q0 + Math.PI / 4) * r * 1.2); ctx.lineTo(x + Math.cos(q0 + Math.PI / 4) * r * 1.9, y + Math.sin(q0 + Math.PI / 4) * r * 1.9); ctx.stroke(); }
    ctx.restore();
  }
  function dial(ctx, x, y, r, g) { ['C', 'A', 'B', 'D'].forEach(id => quarter(ctx, x, y, BAYS[id].q0, g, r, false)); ctx.fillStyle = GREEN; ctx.globalAlpha *= g; ctx.beginPath(); ctx.arc(x, y, r * 0.3, 0, 7); ctx.fill(); ctx.globalAlpha /= g || 1; }

  // ---------- state ----------
  function state(t) {
    const h = hAt(t), e = extent(h);
    const lightOn = 1 - e, redA = 4 * e * (1 - e);
    const ember = t >= tOf(C1) && t >= T0 ? 0.55 * Math.exp(-(t - tOf(C1)) / 2.2) : 0;
    return { h, e, lightOn, redA, ember };
  }

  // ---------- the theater ----------
  function drapes(ctx, x0, x1, y0, y1, col, seed, alpha = 1) {
    ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = col; ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    const n = Math.max(2, Math.round((x1 - x0) / 26));
    for (let k = 0; k < n; k++) { const x = x0 + (k + 0.5) * (x1 - x0) / n; const g = ctx.createLinearGradient(x - 13, 0, x + 13, 0);
      g.addColorStop(0, 'rgba(0,0,0,0.35)'); g.addColorStop(0.5, 'rgba(255,255,255,0.05)'); g.addColorStop(1, 'rgba(0,0,0,0.35)'); ctx.fillStyle = g; ctx.fillRect(x - 13, y0, 26, y1 - y0); }
    ctx.restore();
  }

  function stage(ctx, t, S) {
    const { h, e, lightOn, redA, ember } = S, lit = lightOn;
    // hall
    ctx.fillStyle = mix('0b0d11', '181b21', lit); ctx.fillRect(-200, -200, 1480, 2400);
    // fly curtain / valance
    drapes(ctx, 0, 1080, 150, 262, mix('14151a', '2a2830', lit), 1);
    // wings: four bays
    ['A', 'B', 'C', 'D'].forEach(id => { const b = BAYS[id]; const x0 = b.side > 0 ? 850 : 20, x1 = b.side > 0 ? 1060 : 230, y0 = b.y < 800 ? 300 : 705, y1 = b.y < 800 ? 690 : 1090;
      ctx.fillStyle = mix('0d0f13', '1a1d23', lit * 0.8); ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
      // outer drape (pulled to the outside): the bays are separated by curtains
      const dx0 = b.side > 0 ? 1000 : 20, dx1 = b.side > 0 ? 1060 : 80; drapes(ctx, dx0, dx1, y0, y1, mix('17161b', '2b2931', lit), 3);
      // backstage spill from the lamp
      glow(ctx, b.side > 0 ? 850 : 230, (y0 + y1) / 2, 220, '220,212,195', 0.10 * lit);
      // puppeteer: bean holding a rod up to the piece
      const ready = h >= b.ready; let g = ready ? 1 : 0.18; if (e > 0.5) g *= 0.4;
      const [px, py] = b.piece;
      const bc = mix('35343a', '8b8781', lit * 0.9 + 0.1);
      const handX = b.x - b.side * 38, handY = b.y - 10;
      ctx.strokeStyle = '#3d3a36'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(handX, handY); ctx.lineTo(px, py + 30); ctx.stroke();
      bean(ctx, b.x, b.y + 20, 1.35, { col: bc, mood: ready ? 'panic' : 'flat', look: [-b.side * 0.9, -0.4], arm: { side: -b.side, ang: b.side > 0 ? Math.PI + 0.9 : -0.9 }, eye: mix('4a4a48', 'fffdf7', lit * 0.8 + 0.2) });
      glow(ctx, px, py, 95, '52,210,123', 0.12 + 0.42 * g);
      quarter(ctx, px, py, b.q0, g, 30, false);
      // the reaching string (always there, faint): toward the middle of the stage
      ctx.strokeStyle = `rgba(160,166,172,${0.25 + 0.2 * lit})`; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(px, py); ctx.quadraticCurveTo(L.lerp(px, 540, 0.5), py + 60, L.lerp(px, 540, 0.38 + 0.03 * Math.sin(t * 1.3 + b.y)), py + 40); ctx.stroke();
    });
    // plank between upper and lower bays, proscenium pillars
    ctx.fillStyle = mix('0e1014', '262a31', lit); ctx.fillRect(20, 690, 210, 15); ctx.fillRect(850, 690, 210, 15);
    ctx.fillStyle = mix('101216', '2f333b', lit); ctx.fillRect(230, 262, 32, 830); ctx.fillRect(818, 262, 32, 830); ctx.fillRect(230, 262, 620, 38);
    ctx.fillStyle = mix('0e1014', '22262c', lit); ctx.fillRect(0, 1090, 1080, 36);   // stage lip

    // ----- the screen -----
    ctx.save(); ctx.beginPath(); ctx.rect(SX0, SY0, SX1 - SX0, SY1 - SY0); ctx.clip();
    ctx.fillStyle = '#121418'; ctx.fillRect(SX0, SY0, SX1 - SX0, SY1 - SY0);
    if (lit > 0.003) { const g = ctx.createRadialGradient(LAMP[0], LAMP[1], 0, LAMP[0], LAMP[1], 720);
      g.addColorStop(0, `rgba(244,236,214,${0.98 * lit})`); g.addColorStop(0.3, `rgba(208,201,184,${0.75 * lit})`); g.addColorStop(1, `rgba(120,117,110,${0.45 * lit})`);
      ctx.fillStyle = g; ctx.fillRect(SX0, SY0, SX1 - SX0, SY1 - SY0); }
    if (redA > 0.01) glow(ctx, LAMP[0], LAMP[1], 640, '255,59,48', 0.6 * redA);
    if (ember > 0.01) glow(ctx, LAMP[0], LAMP[1], 260, '255,59,48', 0.35 * ember);
    // lamp hot spot through the fabric + filament
    if (lit > 0.01) glow(ctx, LAMP[0], LAMP[1], 70, '255,252,240', 0.9 * lit);
    // the red flicker in the filament: tiny from t0 (the silent failure), a crack from the first trip
    const fl = 0.6 + 0.4 * L.noise(t * 9, 4);
    const rf = h >= TRIP ? 11 + 5 * Math.sin((t - tOf(TRIP)) * 5) : 6;
    if (lit > 0.02) { glow(ctx, LAMP[0], LAMP[1], rf * 3.5, '255,59,48', 0.7 * fl);
      ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(LAMP[0], LAMP[1], rf * 0.55 * fl + 1.5, 0, 7); ctx.fill();
      if (h >= TRIP) { ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(LAMP[0] - 4, LAMP[1] - 26); ctx.lineTo(LAMP[0] + 6, LAMP[1] - 8); ctx.lineTo(LAMP[0] - 3, LAMP[1] + 6); ctx.lineTo(LAMP[0] + 8, LAMP[1] + 24); ctx.stroke(); } }
    if (ember > 0.01) { ctx.fillStyle = `rgba(255,59,48,${ember})`; ctx.beginPath(); ctx.arc(LAMP[0], LAMP[1], 6, 0, 7); ctx.fill(); }
    // shadow city: cut-out towers
    towers.forEach(tw => { ctx.fillStyle = tw.layer ? '#0c0e11' : 'rgba(22,24,28,0.82)'; ctx.fillRect(tw.x, SY1 - tw.h, tw.w, tw.h);
      if (tw.ant) { ctx.fillRect(tw.x + tw.w / 2 - 2, SY1 - tw.h - 40, 4, 40); }
      if (tw.cap) { ctx.beginPath(); ctx.moveTo(tw.x, SY1 - tw.h); ctx.lineTo(tw.x + tw.w / 2, SY1 - tw.h - 22); ctx.lineTo(tw.x + tw.w, SY1 - tw.h); ctx.fill(); } });
    // windows (holes the light passes through): lit, then a red flash as the cascade reaches them, then dark
    windows.forEach(w => { const dt = (h - w.hOut) / HPS; const out = h >= w.hOut;
      if (!out) { ctx.fillStyle = w.layer ? '#efe4c2' : 'rgba(215,205,178,0.8)'; ctx.fillRect(w.x, w.y, 7, 10); }
      else { const f = Math.exp(-dt / 0.3); if (f > 0.03) { ctx.fillStyle = `rgba(255,59,48,${f})`; ctx.fillRect(w.x - 1, w.y - 1, 9, 12); } } });
    ctx.restore();
    // screen frame
    ctx.strokeStyle = mix('0b0d10', '3a3e46', lit); ctx.lineWidth = 6; ctx.strokeRect(SX0, SY0, SX1 - SX0, SY1 - SY0);

    // ----- strings between the bays: reach, hold, tangle -----
    CALLS.forEach(c => {
      const dt = t - c.t; if (t < T0 || dt < 0 || dt > GROW + HOLD + DROP) return;
      const a = BAYS[c.a].piece, b = BAYS[c.b].piece, cx = 540, cy = (a[1] + b[1]) / 2 + 150;
      const q = f => [(1 - f) * (1 - f) * a[0] + 2 * f * (1 - f) * cx + f * f * b[0], (1 - f) * (1 - f) * a[1] + 2 * f * (1 - f) * cy + f * f * b[1]];
      ctx.save(); ctx.lineCap = 'round';
      if (dt < GROW) { const f = L.ease.out(dt / GROW); ctx.strokeStyle = 'rgba(52,210,123,0.85)'; ctx.lineWidth = 4; ctx.setLineDash([12, 9]); ctx.beginPath(); for (let k = 0; k <= 30; k++) { const p = q(f * k / 30); k ? ctx.lineTo(...p) : ctx.moveTo(...p); } ctx.stroke(); }
      else if (dt < GROW + HOLD) { ctx.strokeStyle = 'rgba(52,210,123,0.25)'; ctx.lineWidth = 16; ctx.beginPath(); for (let k = 0; k <= 30; k++) { const p = q(k / 30); k ? ctx.lineTo(...p) : ctx.moveTo(...p); } ctx.stroke(); ctx.strokeStyle = GREEN; ctx.lineWidth = 5; ctx.stroke(); }
      else { const f = (dt - GROW - HOLD) / DROP; ctx.globalAlpha = 1 - f * 0.9; ctx.strokeStyle = '#8a939d'; ctx.lineWidth = 3;
        const [mx, my] = q(0.5);
        [[0, 0.42], [0.58, 1]].forEach(([s0, s1], side) => { ctx.beginPath(); for (let k = 0; k <= 14; k++) { const ff = L.lerp(s0, s1, k / 14); const p = q(ff); const w = side ? 1 - (ff - s0) / (s1 - s0) : (ff - s0) / (s1 - s0); k ? ctx.lineTo(p[0], p[1] + f * 90 * w) : ctx.moveTo(p[0], p[1] + f * 90 * w); } ctx.stroke(); });
        // the tangle: a knot where they met
        ctx.beginPath(); for (let k = 0; k <= 40; k++) { const an = k * 0.9, rr2 = 10 + 8 * L.noise(k * 0.7, c.h * 10); const px = mx + Math.cos(an) * rr2 * (1 + f), py = my + f * 90 + Math.sin(an * 1.3) * rr2 * 0.8; k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
      ctx.restore(); });

    // bay labels (wide only)
    const labA = L.sm(8.8, 9.6, t) * (1 - L.sm(16.6, 17.2, t));
    if (labA > 0.01) Object.values(BAYS).forEach(b => L.label(ctx, b.label, b.side > 0 ? 905 : 175, b.y < 800 ? 340 : 745, 30, { col: '#9aa3ad', alpha: labA, align: b.side > 0 ? 'right' : 'center' }));
  }

  function audience(ctx, t, S, prot) {
    const { lightOn: lit, redA, ember } = S;
    // floor
    const g = ctx.createLinearGradient(0, 1126, 0, 1920); g.addColorStop(0, mix('0c0e12', '1d2026', lit)); g.addColorStop(1, '#090b0e'); ctx.fillStyle = g; ctx.fillRect(-200, 1126, 1480, 1000);
    ROWS.forEach(([ry, rr0], ri) => {
      // seat backs
      ctx.fillStyle = mix('0d0f12', '1b1d22', lit * 0.6); ctx.fillRect(-200, ry + rr0 * 1.6, 1480, rr0 * 1.2);
      heads.filter(hd => hd.ri === ri).forEach(hd => { const r = hd.r;
        ctx.fillStyle = mix('0c0d10', '23262c', lit * 0.7);
        ctx.beginPath(); ctx.ellipse(hd.x, hd.y + r * 1.75, r * 1.55, r * 0.95, 0, Math.PI, 2 * Math.PI); ctx.fill();
        ctx.beginPath(); ctx.ellipse(hd.x, hd.y, r * 0.86, r, hd.tilt, 0, 7); ctx.fill();
        // rim light from the screen
        const rim = 0.55 * lit; if (rim > 0.01) { ctx.strokeStyle = `rgba(232,224,204,${rim})`; ctx.lineWidth = Math.max(2, r * 0.12); ctx.beginPath(); ctx.ellipse(hd.x, hd.y, r * 0.86, r, hd.tilt, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
        if (redA > 0.05) { ctx.strokeStyle = `rgba(255,59,48,${0.7 * redA})`; ctx.lineWidth = Math.max(2, r * 0.12); ctx.beginPath(); ctx.ellipse(hd.x, hd.y, r * 0.86, r, hd.tilt, Math.PI * 1.2, Math.PI * 1.8); ctx.stroke(); }
      });
      if (ri === 1) prot();
    });
  }

  function protagonist(ctx, t, S, over = {}) {
    const { h, e, lightOn, redA, ember } = S; const lit = over.lit ?? lightOn;
    const col = mix('2b2a28', 'd9d4ca', lit * 0.95 + 0.05);
    let mood = over.mood || (t < T0 ? 'panic' : h < C0 ? 'happy' : e < 0.999 ? 'panic' : 'sad');
    const look = over.look || (mood === 'sad' ? [-0.3, -0.6] : [-0.5, -0.9]);
    // seat back behind
    ctx.fillStyle = mix('0d0f12', '1b1d22', lit * 0.6);
    bean(ctx, PROT.x, PROT.y, PROT.s, { col, mood, look, eye: mix('4a4845', 'fffdf7', Math.max(lit, 0.15 + ember)), ink: '#1b1f27' });
    if (lit > 0.02) glow(ctx, PROT.x - 20, PROT.y - 50, 150, '244,236,214', 0.18 * lit);
    if (redA > 0.02) glow(ctx, PROT.x - 10, PROT.y - 40, 170, '255,59,48', 0.4 * redA);
    if (ember > 0.02) glow(ctx, PROT.x - 10, PROT.y - 45, 120, '255,59,48', 0.3 * ember);
    if (over.green) glow(ctx, PROT.x - 10, PROT.y - 50, 170, '52,210,123', 0.22 * over.green);
  }

  function world(ctx, t, S) { stage(ctx, t, S); audience(ctx, t, S, () => protagonist(ctx, t, S)); }

  // ---------- camera (one long take for the race) ----------
  const CLOSE = [700, 1060, Math.log(2.0), 0];
  const WIDE = [540, 960, Math.log(1.0), 0];
  const FACE = [718, 1232, Math.log(3.0), -0.035];
  const CAM = [[0, CLOSE], [6.0, CLOSE], [9.5, WIDE], [16.9, WIDE], [19.4, FACE], [22, [718, 1232, Math.log(3.15), -0.045]]];
  function cam(ctx, keys, t) { const [x, y, lz, r] = L.key(keys, t); const z = Math.exp(lz); ctx.translate(540, 960); ctx.rotate(r); ctx.scale(z, z); ctx.translate(-x, -y); }

  // ---------- snap: two shows ----------
  const SNAP0 = 22.0, SW1 = [22.5, 24.5], SW2 = [25.0, 27.0], SNAP1 = 29.4;
  const AX0 = 110, AX1 = 950, hx = h => AX0 + (AX1 - AX0) * h / 2;
  function miniShow(ctx, x0, y0, w, hh, head, ai) {
    const e = ai ? 0 : extent(head), lit = 1 - e, cx = x0 + w / 2, cy = y0 + hh * 0.45;
    ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, hh); ctx.clip();
    ctx.fillStyle = '#121418'; ctx.fillRect(x0, y0, w, hh);
    const aiDim = ai && head >= C0 ? 0.55 : 1;
    if (lit > 0.01) { const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.6); g.addColorStop(0, `rgba(240,232,210,${0.95 * lit * aiDim})`); g.addColorStop(1, `rgba(110,108,102,${0.4 * lit * aiDim})`); ctx.fillStyle = g; ctx.fillRect(x0, y0, w, hh); }
    const rA = 4 * e * (1 - e); if (rA > 0.01) glow(ctx, cx, cy, w * 0.55, '255,59,48', 0.7 * rA);
    ctx.fillStyle = '#0c0e11'; for (let k = 0; k < 14; k++) { const bx = x0 + k * w / 14, bh = 30 + ((k * 53) % 70); ctx.fillRect(bx, y0 + hh - bh, w / 14 - 3, bh); }
    ctx.restore(); ctx.strokeStyle = '#3a3e46'; ctx.lineWidth = 4; ctx.strokeRect(x0, y0, w, hh);
    if (ai && head >= C0) { ctx.save(); ctx.setLineDash([10, 8]); ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(cx, cy, 30, 0, 7); ctx.stroke(); ctx.restore(); L.label(ctx, '?', cx, cy + 16, 48, { col: '#ff8a80' }); }
    // the four pieces: at the corners; routed, they fly together into one dial
    const corners = { C: [x0 + 70, y0 + 60], A: [x0 + w - 70, y0 + 60], D: [x0 + 70, y0 + hh - 70], B: [x0 + w - 70, y0 + hh - 70] };
    const asm = ai ? L.ease.inOut(L.clamp((head - AI) / 0.12, 0, 1)) : 0;
    const dx = ai ? cx : cx, dy = y0 + hh + 10;
    Object.keys(corners).forEach(id => { const b = BAYS[id]; const [px, py] = corners[id]; const ready = ai ? head >= AI * 0.5 : head >= b.ready;
      const x = L.lerp(px, cx + 150 * 0 , asm), y = L.lerp(py, cy, asm);
      glow(ctx, x, y, 60, '52,210,123', ready ? 0.45 : 0.12); quarter(ctx, x, y, b.q0, ready ? 1 : 0.2, 26, false); });
    if (asm >= 1) { glow(ctx, cx, cy, 120, '52,210,123', 0.4); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(cx, cy, 8, 0, 7); ctx.fill(); }
  }
  function panel(ctx, t, y0, sweep, ai) {
    const head = L.clamp((t - sweep[0]) / (sweep[1] - sweep[0]), 0, 1) * 2;
    ctx.save(); ctx.fillStyle = '#171d25'; rr(ctx, 70, y0, 920, 500, 18); ctx.fill(); ctx.strokeStyle = '#2c3440'; ctx.lineWidth = 3; ctx.stroke();
    ctx.font = `60px "${SERIF}"`; ctx.fillStyle = '#f4f1ea'; ctx.textAlign = 'left'; ctx.fillText(ai ? 'Routed' : 'As it happened', 110, y0 + 72);
    if (ai) L.label(ctx, 'illustrative', 300, y0 + 70, 46, { col: '#aab2bc', align: 'left' });
    miniShow(ctx, 330, y0 + 100, 400, 230, head, ai);
    const ay = y0 + 400;
    ctx.fillStyle = 'rgba(255,59,48,0.16)'; ctx.fillRect(hx(TRIP), ay - 30, hx(C0) - hx(TRIP), 60); ctx.strokeStyle = 'rgba(255,59,48,0.7)'; ctx.lineWidth = 2; ctx.strokeRect(hx(TRIP), ay - 30, hx(C0) - hx(TRIP), 60);
    if (head >= TRIP) { ctx.font = `44px "${HAND}"`; ctx.fillStyle = '#ff8a80'; ctx.textAlign = 'center'; ctx.fillText('the window', (hx(TRIP) + hx(C0)) / 2, ay - 40); }
    ctx.strokeStyle = '#5a6470'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(AX0, ay); ctx.lineTo(AX1, ay); ctx.stroke();
    ctx.strokeStyle = '#d7dce2'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(AX0, ay); ctx.lineTo(hx(head), ay); ctx.stroke();
    if (head >= C0) { const f = L.clamp((head - C0) / (C1 - C0), 0, 1);
      if (ai) { ctx.setLineDash([8, 8]); ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.strokeRect(hx(C0), ay - 44, hx(C1) - hx(C0) + 8, 88); ctx.setLineDash([]); }
      else { ctx.fillStyle = RED; ctx.fillRect(hx(C0), ay - 44, (hx(C1) - hx(C0) + 8) * f, 88); } }
    const gh = ai ? AI : AG.median;
    if (head >= gh) { const x = hx(gh); glow(ctx, x, ay, 60, '52,210,123', 0.5); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(x, ay, 15, 0, 7); ctx.fill();
      L.label(ctx, ai ? 'pieces routed together' : 'noticed, never assembled', ai ? x - 20 : Math.min(x + 40, 940), ay + 70, 46, { col: GREEN, align: ai ? 'left' : 'right' }); }
    if (head < 2) { ctx.fillStyle = '#fffdf7'; ctx.beginPath(); ctx.arc(hx(head), ay, 10, 0, 7); ctx.fill(); }
    ctx.restore();
  }
  function snap(ctx, t) {
    ctx.fillStyle = '#0e1319'; ctx.fillRect(0, 0, 1080, 1920);
    card(ctx, ['Same pieces. Same hour.'], 330, 84, fade(t, 22.3, 24.9));
    card(ctx, ['Same pieces, routed.'], 330, 84, fade(t, 25.0, 27.1));
    card(ctx, ['People still decide.'], 330, 84, fade(t, 27.2, SNAP1 + 0.2));
    panel(ctx, t, 420, SW1, false);
    if (t >= 24.8) { ctx.save(); ctx.globalAlpha = L.sm(24.8, 25.1, t); panel(ctx, t, 960, SW2, true); ctx.restore(); }
  }

  // ---------- draw ----------
  function draw(ctx, t) {
    ctx.fillStyle = '#0b0d11'; ctx.fillRect(0, 0, 1080, 1920);
    if (t < SNAP0) {
      const S = state(t);
      ctx.save(); cam(ctx, CAM, t); world(ctx, t, S); ctx.restore();
      if (t < T0) L.label(ctx, 'later', 130, 1470, 48, { col: '#ff8a80', align: 'left' });
      card(ctx, ['Watch the lamp.'], 330, 100, t < 0.05 ? 1 : fade(t, -1, 1.0, 0.25));
      card(ctx, ['One lamp lights', 'the whole city.'], 330, 84, fade(t, 1.25, 3.6));
      card(ctx, ['Backstage: four pieces', 'of one fix.'], 330, 80, fade(t, 3.8, 6.1));
      card(ctx, ['Four pieces. One show.'], 1480, 72, fade(t, 7.0, 9.4));
      card(ctx, ['The strings kept tangling.'], 1480, 72, fade(t, 10.2, 12.6));
      card(ctx, ['The window: one hour.'], 1480, 72, fade(t, 12.9, 15.7));
      card(ctx, ['50 million people.', 'In minutes.'], 330, 88, fade(t, 17.0, 19.4));
      card(ctx, ['We slowed it down', 'so you could see it.'], 330, 84, fade(t, 19.5, 22.0, 0.35));
      slate(ctx, t < T0 ? 'SC0  CLOSE  (flash-forward)' : t < 6 ? 'SC1  CLOSE  LOCKED-OFF' : t < 9.5 ? 'SC2  PULL-OUT' : t < 16.9 ? 'SC3  WIDE  1 s = 7.5 min' : t < 19.4 ? 'SC4  DOLLY IN  CLOSER' : 'SC4  HOLD  (dead stop)');
      if (t > 21.7) { ctx.fillStyle = `rgba(14,19,25,${L.sm(21.7, 22.0, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
    } else if (t < SNAP1) {
      snap(ctx, t); slate(ctx, 'SC5  INSERT  TWO SHOWS');
      if (t > SNAP1 - 0.3) { ctx.fillStyle = `rgba(14,19,25,${L.sm(SNAP1 - 0.3, SNAP1, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
    } else {
      // back inside, closest: the lamp lit, the dial assembled on the screen (illustrative)
      const S = { h: AI, e: 0, lightOn: 1, redA: 0, ember: 0 };
      const z = L.lerp(3.5, 3.85, L.sm(SNAP1, 33.2, t));
      ctx.save(); ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-706, -1150);
      stage(ctx, t, S);
      ctx.save(); ctx.beginPath(); ctx.rect(SX0, SY0, SX1 - SX0, SY1 - SY0); ctx.clip();
      const ga = L.sm(SNAP1 + 0.3, 30.6, t); glow(ctx, 690, 1000, 110, '52,210,123', 0.55 * ga); ctx.globalAlpha = ga; dial(ctx, 690, 1000, 26, 1); ctx.restore();
      audience(ctx, t, S, () => protagonist(ctx, t, S, { mood: 'flat', look: [-0.3, -1], green: ga }));
      ctx.restore();
      if (t < SNAP1 + 0.3) { ctx.fillStyle = `rgba(14,19,25,${1 - L.sm(SNAP1, SNAP1 + 0.3, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
      { const la = fade(t, SNAP1 + 0.2, 33.3); if (la > 0.01) { ctx.save(); ctx.globalAlpha = la * 0.8; ctx.fillStyle = '#0d1118'; rr(ctx, 370, 610, 240, 66, 14); ctx.fill(); ctx.restore(); L.label(ctx, 'illustrative', 490, 658, 46, { col: '#e8e4da', alpha: la }); } }
      card(ctx, ['This is the bottleneck.'], 330, 92, fade(t, 30.4, 33.3, 0.35));
      slate(ctx, 'SC6  CLOSEST');
      if (t >= 33.2) L.endCard(ctx, L.sm(33.2, 33.6, t), { line: 'The bottleneck is us.' });
    }
    L.grain(ctx, t, { alpha: 0.04, n: 400 });
  }

  const cascadeT = tOf(C0);
  return {
    draw, DUR,
    acts: [{ start: 1.0, end: cascadeT - 0.35, bpm: 0, drone: true }, { start: 9.5, end: cascadeT - 0.35, bpm: 50 }, { start: 29.4, end: 38, bpm: 0, drone: true }],
    cues: [{ t: 1.0, type: 'hit' }, { t: 6.1, type: 'whoosh' }, { t: tOf(TRIP), type: 'bonk' },
      ...CALLS.map(c => ({ t: c.t + GROW, type: 'pop' })),
      { t: cascadeT, type: 'hit' }, { t: 17.0, type: 'whoosh' }, { t: 22.3, type: 'hit' }, { t: SW2[0] + (SW2[1] - SW2[0]) * AI / 2, type: 'ding' }, { t: 30.6, type: 'ding' }, { t: 33.2, type: 'stamp' }]
  };
}
if (typeof module !== 'undefined') module.exports = makeScene;
