// the-hold-music: wait-for-it, bean cartoon, music. Analog: cuban-missile-1962.
// Race mapping: 1 film second = 8 hours, day(t) = 6 + (t - 1.5) / 3 (day 12 at t = 19.5). See output/the-hold-music/notes.md.
// Red = alert level (analog threat.points, step function) drawn as a stepped crescendo hairpin under the score row.
// Green = documented fragments (analog solution.fragments) as notes, crossing with documented latency (message_latency_hours).
// Snap = ai_counterfactual (day 11 vs 12, transport/translation only), labeled illustrative. Long line uses f5 (day 247).
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('cuban-missile-1962');
  const DUR = 37.4, RED = L.RED, GREEN = L.GREEN;
  const BG = '#15181e', INK = '#b4b8bf', DIM = '#6a7079', DESK = '#2b3039', PAPER = '#cfcbc2', BEAN = '#9ea3ab', DARK = '#1b1f27';

  // ---------- time mapping ----------
  const T0 = 1.5, T_DEAL = 19.5, HRS_PER_S = 8;
  const dayOfT = t => 6 + (t - T0) * HRS_PER_S / 24;
  const tOfDay = d => T0 + (d - 6) * 24 / HRS_PER_S;
  const dayAt = t => {
    if (t < 1.1) return 11.02;                                   // cold open: same timeline, day-11 state
    if (t < T0) return L.lerp(11.02, 5.95, L.ease.inOut((t - 1.1) / (T0 - 1.1))); // rewind
    return Math.min(dayOfT(t), 12);
  };

  // ---------- threat ----------
  const pts = A.threat.points;
  const extentAt = d => { let e = 0; pts.forEach(p => { if (d >= p.t) e = p.extent; }); return e; };
  const CLOSEST = pts[pts.length - 1].t; // day 11 pulse, no level change

  // ---------- green ----------
  const F = {}; A.solution.fragments.forEach(f => F[f.id] = f.ready_at);
  const LAT = A.solution.message_latency_hours;
  const DEAL = A.solution.aggregation.median, AIDEAL = A.ai_counterfactual.aggregation_median, FIX = F.f5;
  const msgs = [
    { slots: [1, 3], dep: F.f2, arr: F.f2 + LAT.worst / 24, route: 'line', from: 'B' },
    { slots: [5], dep: F.f3, arr: F.f3 + LAT.typical / 24, route: 'line', from: 'B' },
    { slots: [7], dep: F.f4, arr: F.f4 + 2 / 24, route: 'side', from: 'A' },
  ];
  const A_HALF = [0, 2, 4, 6]; // f1: already on the bottom desk
  const slotOnA = (i, d) => { if (A_HALF.includes(i)) return 1; for (const m of msgs) if (m.slots.includes(i)) return m.from === 'A' ? (d >= m.dep ? 1 : 0) : (d >= m.arr ? 1 : 0); return 0; };
  const slotOnB = (i, d) => { for (const m of msgs) if (m.slots.includes(i)) return m.from === 'B' ? (d >= m.dep ? 1 : 0) : (d >= m.arr ? 1 : 0); return 0; };
  const MEL = [2, 4, 3, 6, 5, 7, 6, 8]; // staff steps (half line spacings) of the way-out melody
  const HOLD = [3, 5, 4, 5, 3, 5, 4, 2]; // the hold loop: same 8 notes forever

  // ---------- world layout ----------
  const Ab = { x: 470, y: 1490, side: -1, stand: 660, sy: 1450, base: [300, 1575], desk: 1580 };
  const Bb = { x: 610, y: 470, side: 1, stand: 420, sy: 430, base: [780, 555], desk: 560 };
  const STY = 760, STS = 28, SX0 = 100, SX1 = 980; // line staff
  const SCY = 1000, SCS = 12, MX0 = 120, MX1 = 960, MW = (MX1 - MX0) / 13; // score row, 13 measures = day 0..12
  const HPY = 1175, HPH = 120; // crescendo hairpin centre and max half-height
  const LINE_PATH = [[Bb.stand, Bb.sy + 40], [Bb.base[0], Bb.base[1] - 10], [940, 640], [SX1, STY + 2 * STS], [SX0, STY + 2 * STS], [100, 1300], [150, 1500], [Ab.base[0], Ab.base[1] - 10], [Ab.stand, Ab.sy + 40]];
  const SIDE_PATH = [[Ab.stand + 60, Ab.sy], [1030, 1350], [1040, 700], [Bb.stand + 80, Bb.sy]];
  const pathLen = P => { let l = 0; for (let i = 0; i < P.length - 1; i++) l += Math.hypot(P[i + 1][0] - P[i][0], P[i + 1][1] - P[i][1]); return l; };
  const along = (P, f) => { let d = L.clamp(f, 0, 1) * pathLen(P); for (let i = 0; i < P.length - 1; i++) { const l = Math.hypot(P[i + 1][0] - P[i][0], P[i + 1][1] - P[i][1]); if (d <= l || i === P.length - 2) { const q = Math.min(1, d / l); return [L.lerp(P[i][0], P[i + 1][0], q), L.lerp(P[i][1], P[i + 1][1], q)]; } d -= l; } };

  // ---------- drawing helpers ----------
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r); };
  function cap(c, text, y, size, a, col = '#fffdf7', font = SERIF) {
    if (a <= 0) return; c.save(); c.globalAlpha = a; c.font = `${size}px "${font}"`; let fz = size; const w = c.measureText(text).width;
    if (w > 780) { fz = size * 780 / w; c.font = `${fz}px "${font}"`; }
    c.textAlign = 'center'; c.lineJoin = 'round'; c.lineWidth = fz * 0.14; c.strokeStyle = '#0d1118'; c.strokeText(text, 490, y); c.fillStyle = col; c.fillText(text, 490, y); c.restore();
  }
  function note(c, x, y, rx, col, stem = 1, a = 1) {
    c.save(); c.globalAlpha *= a; c.fillStyle = col; c.translate(x, y); c.rotate(-0.35); c.beginPath(); c.ellipse(0, 0, rx, rx * 0.72, 0, 0, 6.283); c.fill(); c.restore();
    if (stem) { c.save(); c.globalAlpha *= a; c.strokeStyle = col; c.lineWidth = Math.max(1.5, rx * 0.22); c.beginPath(); c.moveTo(x + rx * 0.9, y - rx * 0.2); c.lineTo(x + rx * 0.9, y - rx * 3.6); c.stroke(); c.restore(); }
  }
  function rest(c, x, y, s, col) { c.strokeStyle = col; c.lineWidth = 2.2 * s; c.lineCap = 'round'; c.beginPath(); c.moveTo(x - 3 * s, y - 9 * s); c.lineTo(x + 3 * s, y - 3 * s); c.lineTo(x - 3 * s, y + 3 * s); c.lineTo(x + 3 * s, y + 9 * s); c.stroke(); }
  function bean(c, x, y, s, { mood = 'flat', look = [0, 0], side = 1, t = 0 } = {}) {
    const bw = 46 * s, bh = 60 * s;
    // arm holding the handset
    c.strokeStyle = BEAN; c.lineWidth = 7 * s; c.lineCap = 'round';
    const hx = x + side * bw * 0.52, hy = y - bh * 0.12;
    c.beginPath(); c.moveTo(x + side * bw * 0.4, y + bh * 0.15); c.quadraticCurveTo(x + side * bw * 0.8, y + bh * 0.05, hx + side * bw * 0.05, hy + bh * 0.12); c.stroke();
    c.fillStyle = BEAN; rr(c, x - bw / 2, y - bh / 2, bw, bh, bw / 2); c.fill();
    const ey = y - bh * 0.14, er = bw * (mood === 'wide' ? 0.17 : 0.14);
    [-1, 1].forEach(sd => {
      const ex = x + sd * bw * 0.19;
      c.fillStyle = '#f2efe8'; c.beginPath(); c.arc(ex, ey, er, 0, 6.283); c.fill();
      c.fillStyle = DARK; c.beginPath(); c.arc(ex + look[0] * er * 0.4, ey + look[1] * er * 0.4, er * (mood === 'wide' ? 0.36 : 0.5), 0, 6.283); c.fill();
      if (mood === 'flat' || mood === 'worried') { // heavy lids
        c.fillStyle = BEAN; c.fillRect(ex - er * 1.2, ey - er * 1.25, er * 2.4, er * (mood === 'flat' ? 1.0 : 0.7));
        c.strokeStyle = DARK; c.lineWidth = 2 * s; c.beginPath(); c.moveTo(ex - er, ey - er * (mood === 'flat' ? 0.25 : 0.55)); c.lineTo(ex + er, ey - er * (mood === 'flat' ? 0.25 : 0.55)); c.stroke();
      }
      if (mood === 'worried' || mood === 'wide') { c.strokeStyle = DARK; c.lineWidth = 2.6 * s; c.beginPath(); c.moveTo(ex - er, ey - er * 1.5 - sd * er * 0.35); c.lineTo(ex + er, ey - er * 1.5 + sd * er * 0.35); c.stroke(); }
    });
    const my = y + bh * 0.16; c.strokeStyle = DARK; c.fillStyle = DARK; c.lineWidth = 2.8 * s; c.lineCap = 'round';
    if (mood === 'wide') { c.beginPath(); c.ellipse(x, my, bw * 0.07, bw * 0.09, 0, 0, 6.283); c.fill(); }
    else if (mood === 'soft') { c.beginPath(); c.arc(x, my - bw * 0.05, bw * 0.1, 0.2 * Math.PI, 0.8 * Math.PI); c.stroke(); }
    else if (mood === 'worried') { c.beginPath(); c.arc(x, my + bw * 0.08, bw * 0.09, 1.2 * Math.PI, 1.8 * Math.PI); c.stroke(); }
    else { c.beginPath(); c.moveTo(x - bw * 0.09, my); c.lineTo(x + bw * 0.09, my); c.stroke(); }
    // handset pressed to the side of the head
    c.save(); c.translate(hx, hy); c.rotate(side * 0.18); c.fillStyle = '#5b616b'; rr(c, -bw * 0.11, -bh * 0.36, bw * 0.22, bh * 0.66, bw * 0.1); c.fill();
    c.fillStyle = '#4a4f58'; rr(c, -bw * 0.16, -bh * 0.4, bw * 0.32, bh * 0.14, bw * 0.06); c.fill(); rr(c, -bw * 0.16, bh * 0.2, bw * 0.32, bh * 0.14, bw * 0.06); c.fill(); c.restore();
    return [hx + side * bw * 0.02, hy + bh * 0.33];
  }
  function coil(c, a, b, s) {
    const n = 26, dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = -dy / l, ny = dx / l;
    c.strokeStyle = '#4a4f58'; c.lineWidth = 2.5 * s; c.beginPath();
    for (let i = 0; i <= n * 4; i++) { const f = i / (n * 4), sg = Math.sin(f * n * 6.283) * 6 * s, sag = Math.sin(f * Math.PI) * 30 * s; const x = a[0] + dx * f + nx * sg, y = a[1] + dy * f + ny * sg + sag; i ? c.lineTo(x, y) : c.moveTo(x, y); }
    c.stroke();
  }
  function sheet(c, X, Y, slotFn, d, { play = 0, glowAll = 0 } = {}) {
    const w = 176, h = 120;
    c.strokeStyle = '#3b414b'; c.lineWidth = 6; c.beginPath(); c.moveTo(X, Y + h / 2); c.lineTo(X, Y + h / 2 + 90); c.stroke();
    c.fillStyle = PAPER; rr(c, X - w / 2, Y - h / 2, w, h, 6); c.fill();
    const top = Y - 26, sp = 12; c.strokeStyle = '#8b8f96'; c.lineWidth = 1.5;
    for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(X - 78, top + i * sp); c.lineTo(X + 78, top + i * sp); c.stroke(); }
    c.fillStyle = '#6d727a'; c.fillRect(X + 76, top, 3, 4 * sp);
    const bot = top + 4 * sp;
    for (let i = 0; i < 8; i++) {
      const nx = X - 62 + i * 17.5, ny = bot - MEL[i] * sp / 2 + 6, on = slotFn(i, d);
      if (on) { const g = play > 0 ? Math.max(0, 1 - Math.abs(play * 9 - 0.5 - i) / 1.2) : 0; note(c, nx, ny, 6.2 + g * 3 + glowAll * 1.2, GREEN); }
      else rest(c, nx, bot - 2 * sp, 1, '#7a7f87');
    }
    if (glowAll > 0) { c.save(); c.globalAlpha = glowAll; c.strokeStyle = GREEN; c.lineWidth = 4; c.beginPath(); for (let i = 0; i < 8; i++) { const nx = X - 62 + i * 17.5 + 5.6, ny = bot - MEL[i] * sp / 2 + 6 - 21; i ? c.lineTo(nx, ny) : c.moveTo(nx, ny); } c.stroke(); c.restore(); }
  }
  function desk(c, P, s = 1) {
    c.fillStyle = DESK; c.fillRect(P.x - 330, P.desk, 660, 26); c.fillStyle = '#22262e'; c.fillRect(P.x - 310, P.desk + 26, 620, 70);
    c.fillStyle = '#3a404a'; rr(c, P.base[0] - 44, P.base[1] - 22, 88, 30, 10); c.fill();
  }

  // ---------- threat hairpin (stepped crescendo) ----------
  function hairpin(c, d, pulse) {
    const xOf = dd => MX0 + dd * MW;
    const topPts = [], botPts = [];
    for (let k = 0; k <= Math.floor(d); k++) { const e = extentAt(k) * HPH, x1 = xOf(Math.min(k + 1, d)), x0 = xOf(k); topPts.push([x0, HPY - e], [x1, HPY - e]); botPts.push([x0, HPY + e], [x1, HPY + e]); }
    if (!topPts.length) return;
    const draw = (grow, a) => { c.save(); c.globalAlpha = a; c.fillStyle = RED; c.beginPath(); c.moveTo(MX0, HPY);
      topPts.forEach(([x, y]) => c.lineTo(x, HPY - (HPY - y) * grow - (y < HPY ? 3 : 0)));
      for (let i = botPts.length - 1; i >= 0; i--) { const [x, y] = botPts[i]; c.lineTo(x, HPY + (y - HPY) * grow + (y > HPY ? 3 : 0)); } c.closePath(); c.fill(); c.restore(); };
    draw(1.3 + pulse * 0.4, 0.07 + pulse * 0.15); draw(1.12, 0.22); draw(1, 0.95);
    // hairpin outline (the musical sign)
    c.strokeStyle = '#ff6a5f'; c.lineWidth = 3; c.beginPath(); c.moveTo(MX0 - 10, HPY); c.lineTo(xOf(d), HPY - extentAt(d) * HPH - 6); c.moveTo(MX0 - 10, HPY); c.lineTo(xOf(d), HPY + extentAt(d) * HPH + 6); c.stroke();
  }
  function scoreRow(c, d, dealA) {
    c.strokeStyle = '#4a505a'; c.lineWidth = 2;
    for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(MX0, SCY + i * SCS); c.lineTo(MX1, SCY + i * SCS); c.stroke(); }
    for (let k = 0; k <= 13; k++) { c.beginPath(); c.moveTo(MX0 + k * MW, SCY); c.lineTo(MX0 + k * MW, SCY + 4 * SCS); c.stroke(); }
    const cur = Math.min(12, Math.floor(d)); c.fillStyle = 'rgba(210,214,220,0.10)'; c.fillRect(MX0 + cur * MW, SCY - 8, MW, 4 * SCS + 16);
    for (let k = 0; k < cur; k++) { note(c, MX0 + k * MW + MW * 0.33, SCY + 3 * SCS, 5.5, '#6f757e', 1); note(c, MX0 + k * MW + MW * 0.66, SCY + 2 * SCS, 5.5, '#6f757e', 1); }
    if (dealA > 0) { c.save(); c.globalAlpha = dealA; c.fillStyle = GREEN; c.fillRect(MX0 + 12 * MW + 6, SCY - 14, MW - 12, 4 * SCS + 28); c.restore(); }
    // playhead
    c.fillStyle = '#d7dadf'; c.fillRect(MX0 + Math.min(d, 13) * MW - 2, SCY - 16, 4, 4 * SCS + 32);
  }
  function lineStaff(c, t, holdOn) {
    c.strokeStyle = '#555b65'; c.lineWidth = 3;
    for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(SX0, STY + i * STS); c.lineTo(SX1, STY + i * STS); c.stroke(); }
    c.fillStyle = '#555b65'; c.fillRect(SX0 - 3, STY, 6, 4 * STS); c.fillRect(SX1 - 3, STY, 6, 4 * STS);
    // repeat signs at both ends: it loops
    c.fillStyle = '#7d838d'; [[SX0 + 22, 1], [SX1 - 22, -1]].forEach(([x]) => { c.beginPath(); c.arc(x, STY + 1.5 * STS, 5, 0, 6.283); c.arc(x, STY + 2.5 * STS, 5, 0, 6.283); c.fill(); });
    if (holdOn <= 0) return;
    // hold loop: one 8-note phrase per 3 film s (= one day), scrolling left to right
    const phraseW = 320, off = ((t / 3) * phraseW) % phraseW;
    c.save(); c.beginPath(); c.rect(SX0 + 40, STY - 120, SX1 - SX0 - 80, 4 * STS + 200); c.clip();
    for (let k = -1; k < 4; k++) for (let i = 0; i < 8; i++) { const x = SX0 + k * phraseW + i * 40 + off; note(c, x, STY + 4 * STS - HOLD[i] * STS / 2, 11, '#80868f', 1, holdOn); }
    c.restore();
  }
  function travelling(c, d) {
    msgs.forEach(m => {
      if (d < m.dep || d > m.arr) return;
      const f = (d - m.dep) / (m.arr - m.dep), P = m.route === 'line' ? LINE_PATH : SIDE_PATH, [x, y] = along(P, f);
      c.save(); c.fillStyle = 'rgba(52,210,123,0.22)'; c.beginPath(); c.arc(x, y, 44, 0, 6.283); c.fill(); c.restore();
      m.slots.forEach((s, j) => note(c, x - 14 + j * 30, y + 10 - j * 8, 16, GREEN));
    });
  }
  function world(c, t, d, o = {}) {
    c.fillStyle = BG; c.fillRect(0, 0, 1080, 1920);
    const pulse = Math.max(0, 1 - Math.abs(d - CLOSEST) * 8) + (o.coldPulse || 0);
    // side path (in person): dotted
    c.save(); c.setLineDash([6, 14]); c.strokeStyle = '#3d434d'; c.lineWidth = 3; c.beginPath(); SIDE_PATH.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.stroke(); c.restore();
    // cords from each base into the line staff
    c.strokeStyle = '#4a4f58'; c.lineWidth = 4; c.beginPath(); c.moveTo(Bb.base[0], Bb.base[1]); c.quadraticCurveTo(960, 580, SX1, STY + 2 * STS); c.stroke();
    c.beginPath(); c.moveTo(Ab.base[0], Ab.base[1]); c.bezierCurveTo(60, 1560, 70, 1100, SX0, STY + 2 * STS); c.stroke();
    hairpin(c, d, pulse);
    scoreRow(c, d, o.dealA || 0);
    lineStaff(c, t, o.holdOn ?? 1);
    // desks (identical, the top one mirrored)
    [Bb, Ab].forEach(P => desk(c, P));
    const moodA = o.moodA || 'flat', moodB = o.moodB || 'flat';
    const hA = bean(c, Ab.x, Ab.y, 2.2, { mood: moodA, side: -1, look: o.lookA || [0.2, -0.3], t });
    const hB = bean(c, Bb.x, Bb.y, 2.2, { mood: moodB, side: 1, look: [-0.2, 0.4], t });
    coil(c, hA, [Ab.base[0], Ab.base[1] - 16], 1); coil(c, hB, [Bb.base[0], Bb.base[1] - 16], 1);
    sheet(c, Ab.stand, Ab.sy, slotOnA, d, { play: o.play || 0, glowAll: o.glowAll || 0 });
    sheet(c, Bb.stand, Bb.sy, slotOnB, d, { play: o.play || 0, glowAll: 0 });
    // hold music leaking from the receiver (close shots)
    const hold = o.holdOn ?? 1;
    if (hold > 0) for (let k = 0; k < 6; k++) { const q = ((t / 3) * 2 + k / 6) % 1; note(c, hA[0] - 30 - q * 70 + Math.sin(q * 6 + k) * 8, hA[1] - 70 - q * 120, 6, '#8a9099', 1, hold * Math.sin(q * Math.PI) * 0.9); }
    travelling(c, d);
  }

  // ---------- camera ----------
  const CAM = [[0, [560, 1430, 2.6]], [5.5, [560, 1430, 2.6]], [8.5, [540, 960, 1.0]], [17.5, [540, 960, 1.0]], [19.5, [585, 1465, 3.4]], [21.2, [585, 1465, 3.4]]];
  const CAM8 = [[31.0, [545, 1478, 4.1]], [33.4, [540, 1480, 4.4]]];

  // ---------- snap ----------
  const SNAP0 = 23.4, SNAPGO = 23.9, SW0 = 24.3, SW1 = 26.9; // sweep day 0 -> 13 in 2.6 s (1 s = 5 days)
  function panel(c, y, deal, title, sub, t) {
    const x0 = 70, w = 940, h = 420; c.fillStyle = '#1d2128'; rr(c, x0, y, w, h, 20); c.fill(); c.strokeStyle = '#353b45'; c.lineWidth = 3; c.stroke();
    c.save(); c.font = `50px "${SERIF}"`; c.textAlign = 'left'; c.fillStyle = '#e8e4da'; c.fillText(title, x0 + 36, y + 70); if (sub) { c.font = `48px "${HAND}"`; c.fillStyle = '#b9bec8'; c.fillText(sub, x0 + 36, y + 126); } c.restore();
    const px0 = 110, pw = 860, mw = pw / 13, sy = y + 190, hy = y + 320, hh = 70;
    const d = L.clamp((t - SW0) / (SW1 - SW0), 0, 1) * 13;
    c.strokeStyle = '#4a505a'; c.lineWidth = 2; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(px0, sy + i * 11); c.lineTo(px0 + pw, sy + i * 11); c.stroke(); }
    for (let k = 0; k <= 13; k++) { c.beginPath(); c.moveTo(px0 + k * mw, sy); c.lineTo(px0 + k * mw, sy + 44); c.stroke(); }
    // red: identical in both panels
    c.fillStyle = RED; c.beginPath(); c.moveTo(px0, hy);
    const dd = Math.min(d, 13); for (let k = 0; k <= Math.floor(dd); k++) { const e = extentAt(k) * hh; c.lineTo(px0 + k * mw, hy - e); c.lineTo(px0 + Math.min(k + 1, dd) * mw, hy - e); }
    for (let k = Math.floor(dd); k >= 0; k--) { const e = extentAt(k) * hh; c.lineTo(px0 + Math.min(k + 1, dd) * mw, hy + e); c.lineTo(px0 + k * mw, hy + e); } c.closePath(); c.fill();
    if (d >= deal) { const a = L.clamp((d - deal) * 3, 0, 1); c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(52,210,123,0.25)'; c.fillRect(px0 + deal * mw - 14, sy - 40, mw + 28, 130); c.fillStyle = GREEN; c.fillRect(px0 + deal * mw + 5, sy - 26, mw - 10, 100); c.restore(); }
    c.fillStyle = '#d7dadf'; c.fillRect(px0 + dd * mw - 2, sy - 30, 5, 140);
  }
  function snap(c, t) {
    c.fillStyle = '#0f1216'; c.fillRect(0, 0, 1080, 1920);
    if (t < SNAPGO) return;
    const a = L.sm(SNAPGO, SNAPGO + 0.25, t); c.save(); c.globalAlpha = a;
    cap(c, 'Same red. Same letters.', 330, 74, 1);
    panel(c, 440, DEAL, 'as it was', null, t);
    panel(c, 940, AIDEAL, 'frontier AI carrying letters', 'illustrative', t);
    cap(c, 'A day sooner. Not a miracle.', 1470, 60, L.sm(26.9, 27.2, t), '#d8dbe0');
    c.restore(); L.slate(c, 'SC6  SNAP  LOCKED');
  }
  const LL0 = 28.0, LLS0 = 28.5, LLS1 = 30.3, SPAN = 260;
  function longLine(c, t) {
    c.fillStyle = '#0f1216'; c.fillRect(0, 0, 1080, 1920);
    const a = L.sm(LL0, LL0 + 0.3, t); c.save(); c.globalAlpha = a;
    const x0 = 100, w = 860, y = 1000, xOf = d => x0 + d / SPAN * w, d = L.clamp((t - LLS0) / (LLS1 - LLS0), 0, 1) * FIX;
    c.strokeStyle = '#555b65'; c.lineWidth = 3; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(x0, y - 24 + i * 12); c.lineTo(x0 + w, y - 24 + i * 12); c.stroke(); }
    // the whole hold, repeated measure after measure
    for (let k = 0; k < Math.min(d, FIX); k += 6) note(c, xOf(k) + 4, y + 12 - ((k / 6) % 4) * 6, 4, '#6f757e', 0);
    // red sliver: the crisis days (stepped, same data)
    for (let k = 0; k <= 12; k++) { const e = extentAt(k) * 70; if (e) { c.fillStyle = RED; c.fillRect(xOf(k), y - e, Math.max(2, xOf(k + 1) - xOf(k)), 2 * e); } }
    c.fillStyle = GREEN; c.fillRect(xOf(DEAL) - 2, y - 60, 6, 120);
    L.label(c, 'the crisis', xOf(6), y - 110, 48, { col: '#e8e4da', align: 'left' });
    c.fillStyle = '#d7dadf'; c.fillRect(xOf(d) - 2, y - 50, 5, 100);
    if (d >= FIX) { const g = L.sm(LLS1, LLS1 + 0.3, t); c.save(); c.globalAlpha = g; c.fillStyle = 'rgba(52,210,123,0.25)'; c.beginPath(); c.arc(xOf(FIX), y, 60, 0, 6.283); c.fill(); note(c, xOf(FIX), y + 6, 20, GREEN); L.label(c, 'direct line', xOf(FIX) - 40, y + 110, 48, { col: GREEN, align: 'right' }); c.restore(); }
    cap(c, 'The direct line', 520, 96, L.sm(LL0 + 0.2, LL0 + 0.5, t));
    cap(c, 'took 247 days.', 620, 96, L.sm(LLS1, LLS1 + 0.3, t));
    c.restore(); L.slate(c, 'SC7  THE LONG LINE  LOCKED');
  }

  // ---------- main ----------
  function draw(c, t) {
    c.fillStyle = BG; c.fillRect(0, 0, 1080, 1920);
    if (t < 21.2) {
      const d = dayAt(t);
      const dealA = L.sm(T_DEAL, T_DEAL + 0.3, t), play = t >= T_DEAL ? L.clamp((t - T_DEAL) / 0.9, 0, 1) : 0;
      const holdOn = t < T_DEAL ? 1 : 1 - L.sm(T_DEAL, T_DEAL + 0.3, t);
      let moodA = 'flat'; if (t < 1.1) moodA = 'worried'; else if (d >= CLOSEST - 0.1 && d < F.f4) moodA = 'worried'; else if (d >= F.f4 && t < T_DEAL) moodA = 'wide'; else if (t >= T_DEAL + 0.2) moodA = 'soft';
      c.save(); L.camera(c, CAM, t);
      world(c, t, d, { dealA, play, glowAll: dealA, holdOn, moodA, moodB: moodA === 'soft' ? 'soft' : (d >= CLOSEST - 0.1 ? 'worried' : 'flat'), lookA: t >= 17.5 ? [0.6, -0.1] : [0.2, -0.3] });
      c.restore();
      // rewind flash
      if (t > 1.05 && t < 1.55) { const f = 1 - Math.abs(t - 1.3) / 0.25; c.fillStyle = `rgba(200,205,212,${(0.35 * f).toFixed(3)})`; c.fillRect(0, 0, 1080, 1920);
        c.save(); c.globalAlpha = 0.5 * f; c.fillStyle = '#ffffff'; for (let k = 0; k < 14; k++) c.fillRect(0, 140 * k + ((t * 3000) % 140), 1080, 3); c.restore(); }
      // captions
      cap(c, 'Wait for it.', 1440, 110, t < 1.1 ? 1 : 1 - L.sm(1.05, 1.2, t));
      cap(c, 'On hold. To each other.', 1440, 84, L.sm(1.8, 2.1, t) * (1 - L.sm(5.0, 5.3, t)));
      cap(c, 'Two desks. One slow line.', 1360, 70, L.sm(8.6, 8.9, t) * (1 - L.sm(10.9, 11.1, t)));
      cap(c, 'Half the way out on each.', 1360, 70, L.sm(11.2, 11.5, t) * (1 - L.sm(13.3, 13.5, t)));
      cap(c, 'Each note: up to 12 hours.', 1360, 70, L.sm(13.6, 13.9, t) * (1 - L.sm(16.2, 16.4, t)));
      cap(c, 'Wait for it...', 330, 96, L.sm(17.6, 17.9, t) * (1 - L.sm(19.3, 19.5, t)));
      cap(c, 'There.', 1440, 120, L.sm(19.6, 19.8, t), GREEN);
      L.slate(c, t < 1.1 ? 'SC1  CLOSE  COLD OPEN' : t < 5.5 ? 'SC1  CLOSE  LOCKED-OFF' : t < 8.5 ? 'SC2  PULL-OUT' : t < 17.5 ? 'SC3  WIDE' : 'SC4  DOLLY IN  CLOSER');
      if (t > 20.9) { c.fillStyle = `rgba(13,17,24,${L.sm(20.9, 21.2, t).toFixed(3)})`; c.fillRect(0, 0, 1080, 1920); }
    } else if (t < SNAP0) {
      c.fillStyle = '#0d1118'; c.fillRect(0, 0, 1080, 1920);
      const a = L.sm(21.3, 21.6, t) * (1 - L.sm(23.0, 23.3, t));
      cap(c, 'We slowed it down', 900, 96, a); cap(c, 'so you could see it.', 1010, 96, a);
      L.slate(c, 'SC5  CARD');
    } else if (t < LL0) {
      snap(c, t); if (t > 27.7) { c.fillStyle = `rgba(15,18,22,${L.sm(27.7, 28.0, t).toFixed(3)})`; c.fillRect(0, 0, 1080, 1920); }
    } else if (t < 31.0) {
      longLine(c, t); if (t > 30.7) { c.fillStyle = `rgba(15,18,22,${L.sm(30.7, 31.0, t).toFixed(3)})`; c.fillRect(0, 0, 1080, 1920); }
    } else {
      c.save(); L.camera(c, CAM8, t); world(c, t, 12, { dealA: 1, glowAll: 1, holdOn: L.sm(31.6, 32.4, t) * 0.9, moodA: 'worried' }); c.restore();
      c.fillStyle = `rgba(15,18,22,${(1 - L.sm(31.0, 31.4, t)).toFixed(3)})`; c.fillRect(0, 0, 1080, 1920);
      cap(c, 'This is the bottleneck.', 1440, 88, L.sm(31.4, 31.7, t));
      L.slate(c, 'SC8  CLOSEST');
      if (t >= 33.4) L.endCard(c, L.sm(33.4, 33.8, t), { line: 'The bottleneck is us.' });
    }
    L.grain(c, t, { alpha: 0.04, n: 400 });
  }

  const tA = m => tOfDay(m.arr);
  return {
    draw, DUR,
    acts: [{ start: 0, end: T_DEAL, bpm: 0, drone: true }, { start: 8.5, end: T_DEAL, bpm: 40 }, { start: SNAPGO, end: DUR, bpm: 0, drone: true }],
    cues: [{ t: 1.1, type: 'whoosh' }, { t: T0, type: 'hit' }, { t: 5.5, type: 'whoosh' }, { t: tOfDay(8), type: 'hit' }, { t: tA(msgs[0]), type: 'pop' },
      { t: tOfDay(CLOSEST), type: 'bonk' }, { t: tA(msgs[1]), type: 'pop' }, { t: tOfDay(F.f4), type: 'pop' }, { t: T_DEAL, type: 'ding' },
      { t: SNAPGO, type: 'hit' }, { t: SW0 + (SW1 - SW0) * AIDEAL / 13, type: 'pop' }, { t: SW0 + (SW1 - SW0) * DEAL / 13, type: 'pop' }, { t: LLS1, type: 'ding' }, { t: 33.4, type: 'hit' }]
  };
}
if (typeof module !== 'undefined') module.exports = makeScene;
