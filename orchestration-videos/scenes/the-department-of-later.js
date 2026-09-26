// The Department of Later: mockumentary, bean cartoon, gfc-2008 analog.
// One world camera: the meeting room is drawn inside one window of the central ministry (k = 0.06),
// so the crane out and the drop back in are continuous zooms. See output/the-department-of-later/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('gfc-2008');
  const DUR = 40, RED = L.RED, GREEN = L.GREEN;
  const INK = '#1b1f27', PAPER = '#fffdf7', BG = '#191c23', WALL = '#23272f', GRAY = '#a9adb5';
  const sm = L.sm, lerp = L.lerp, clamp = L.clamp;

  // ---------- time mapping: 1 film second = 30 days, t=0 = Aug 9 2007 ----------
  const DPS = 30, END_DAY = 584;
  const dayAt = t => clamp(t * DPS, 0, END_DAY);
  const tOfDay = d => d / DPS;

  // ---------- threat: piecewise-linear share of the eventual fall ----------
  const pts = [[0, 0]].concat(A.threat.points.filter(p => p.t > 0).map(p => [p.t, p.extent]));
  const extent = d => { if (d <= 0) return 0; for (let i = 0; i < pts.length - 1; i++) { const [a, A1] = pts[i], [b, B1] = pts[i + 1]; if (d <= b) return lerp(A1, B1, (d - a) / (b - a)); } return pts[pts.length - 1][1]; };

  // ---------- green fragments: human = max(ready, lognormal quantile); AI = quantile x 220/426, laws keep human dates ----------
  const ag = A.solution.aggregation, aiMed = A.ai_counterfactual.aggregation_median;
  const ready = id => A.solution.fragments.find(f => f.id === id).ready_at;
  // slot order on the board: f2 f3 f4 f5 / f6 f1(protagonist) f7 ; q index from the notes table
  const FR = [
    { id: 'f2', qi: 0, where: 'room', src: [300, 0], law: false },
    { id: 'f3', qi: 1, where: 'remote', law: false },
    { id: 'f4', qi: 2, where: 'remote', law: true },
    { id: 'f5', qi: 3, where: 'room', src: [560, 0], law: false },
    { id: 'f6', qi: 4, where: 'room', src: [820, 0], law: false },
    { id: 'f1', qi: 5, where: 'hero', law: false },
    { id: 'f7', qi: 6, where: 'remote', law: true },
  ];
  FR.forEach(f => { const q = (f.qi + 0.5) / 7, Q = L.lognormalQuantile(q, ag.median, ag.p90);
    f.hDay = Math.max(ready(f.id), Q); f.aiDay = f.law ? f.hDay : Q * aiMed / ag.median; });
  const HERO = FR[5];
  const SLOTS = [[119, 430], [216, 430], [314, 430], [411, 430], [168, 565], [265, 565], [363, 565]];

  // ---------- helpers ----------
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r); };
  const fade = (t, a, b, f = 0.3) => sm(a, a + f, t) * (1 - sm(b - f, b, t));
  function card(c, lines, y, size, al, col = PAPER) { if (al <= 0) return; c.save(); c.globalAlpha = al; c.textAlign = 'center';
    lines.forEach((l, i) => { const yy = y + i * size * 1.05; c.font = `${size}px "${SERIF}"`; c.lineWidth = size * 0.12; c.strokeStyle = '#0d1118'; c.lineJoin = 'round';
      c.strokeText(l, 490, yy); c.fillStyle = col; c.fillText(l, 490, yy); }); c.restore(); }
  function hand(c, text, x, y, size, col, al = 1, align = 'center') { if (al <= 0) return; c.save(); c.globalAlpha = al; c.font = `${size}px "${HAND}"`; c.textAlign = align; c.fillStyle = col; c.fillText(text, x, y); c.restore(); }

  function note(c, x, y, s, rot, { text = null, al = 1, glow = 0, seed = 1 } = {}) {
    if (al <= 0) return; c.save(); c.globalAlpha = al; c.translate(x, y); c.rotate(rot);
    if (glow > 0) { c.fillStyle = `rgba(52,210,123,${0.22 * glow})`; c.beginPath(); c.arc(0, 0, s * 1.1, 0, 7); c.fill(); }
    c.fillStyle = 'rgba(0,0,0,0.25)'; c.fillRect(-s / 2 + s * 0.04, -s / 2 + s * 0.05, s, s);
    c.fillStyle = GREEN; c.fillRect(-s / 2, -s / 2, s, s);
    c.fillStyle = 'rgba(15,61,36,0.35)'; c.fillRect(-s / 2, -s / 2, s, s * 0.14);
    if (text) { c.fillStyle = '#0f3d24'; c.textAlign = 'center'; c.font = `${s * 0.2}px "${HAND}"`; text.split('|').forEach((ln, i, a) => c.fillText(ln, 0, s * 0.08 + (i - (a.length - 1) / 2) * s * 0.24)); }
    else { c.strokeStyle = '#0f3d24'; c.lineWidth = Math.max(1, s * 0.035); c.lineCap = 'round'; const r = L.rng(seed);
      for (let k = 0; k < 3; k++) { const yy = -s * 0.12 + k * s * 0.2; c.beginPath(); c.moveTo(-s * 0.32, yy); c.lineTo(-s * 0.32 + s * (0.4 + r() * 0.24), yy); c.stroke(); } }
    c.restore(); }

  // Bean (from the example, extended): back view, profile eye, moods.
  function bean(c, x, y, s, o = {}) {
    const bw = 46 * s, bh = 60 * s, col = o.col || GRAY, mood = o.mood || 'happy', lk = o.look || [0, 0];
    c.save();
    if (o.armTo) { c.strokeStyle = col; c.lineWidth = 6 * s; c.lineCap = 'round'; const sx = x + bw * 0.38, sy = y + bh * 0.05;
      c.beginPath(); c.moveTo(sx, sy); c.quadraticCurveTo(sx + bw * 0.1, o.armTo[1] + bh * 0.1, o.armTo[0], o.armTo[1]); c.stroke(); }
    c.fillStyle = col; rr(c, x - bw / 2, y - bh / 2, bw, bh, bw / 2); c.fill();
    if (o.rim) { c.save(); rr(c, x - bw / 2, y - bh / 2, bw, bh, bw / 2); c.clip(); const g = c.createLinearGradient(x + bw / 2, 0, x + bw * 0.1, 0);
      g.addColorStop(0, `rgba(255,59,48,${0.35 * o.rim})`); g.addColorStop(1, 'rgba(255,59,48,0)'); c.fillStyle = g; c.fillRect(x - bw / 2, y - bh / 2, bw, bh); c.restore(); }
    if (o.back) {
      const pf = o.profile || 0;
      if (pf > 0) { const ex = x + bw * 0.4, ey = y - bh * 0.17, er = bw * 0.07; c.globalAlpha = pf;
        c.fillStyle = PAPER; c.beginPath(); c.ellipse(ex, ey, er * 0.7, er, 0, 0, 7); c.fill();
        c.fillStyle = INK; c.beginPath(); c.arc(ex + er * 0.2, ey + er * 0.1, er * 0.45, 0, 7); c.fill();
        c.strokeStyle = INK; c.lineWidth = 2.6 * s; c.lineCap = 'round'; c.beginPath(); c.moveTo(ex - er * 1.3, ey - er * 1.9); c.lineTo(ex + er * 0.9, ey - er * 1.2); c.stroke();
        c.beginPath(); c.moveTo(x + bw * 0.44, y + bh * 0.1); c.lineTo(x + bw * 0.34, y + bh * 0.1); c.stroke(); c.globalAlpha = 1; }
      c.restore(); return; }
    const ey = y - bh * 0.14, er = bw * (mood === 'freeze' ? 0.17 : 0.14);
    [-1, 1].forEach(sd => { const ex = x + sd * bw * 0.19;
      c.fillStyle = PAPER; c.beginPath(); c.arc(ex, ey, er, 0, 7); c.fill(); c.strokeStyle = INK; c.lineWidth = 1.6 * s; c.stroke();
      c.fillStyle = INK; c.beginPath(); c.arc(ex + lk[0] * er * 0.4, ey + lk[1] * er * 0.4, er * (mood === 'freeze' ? 0.34 : 0.5), 0, 7); c.fill();
      if (mood === 'angry') { c.strokeStyle = INK; c.lineWidth = 3 * s; c.beginPath(); c.moveTo(ex - sd * er * 1.2, ey - er * 1.7); c.lineTo(ex + sd * er * 0.9, ey - er * 1.0); c.stroke(); }
      if (mood === 'worried') { c.strokeStyle = INK; c.lineWidth = 2.4 * s; c.beginPath(); c.moveTo(ex - sd * er * 1.0, ey - er * 1.1); c.lineTo(ex + sd * er * 0.8, ey - er * 1.7); c.stroke(); } });
    const my = y + bh * 0.15; c.strokeStyle = INK; c.fillStyle = INK; c.lineWidth = 3 * s; c.lineCap = 'round';
    if (mood === 'happy') { c.beginPath(); c.arc(x, my - bw * 0.04, bw * 0.13, 0.15 * Math.PI, 0.85 * Math.PI); c.stroke(); }
    else if (mood === 'freeze') { c.beginPath(); c.ellipse(x, my, bw * 0.06, bw * 0.08, 0, 0, 7); c.fill(); }
    else if (mood === 'talk') { c.beginPath(); c.ellipse(x, my, bw * 0.1, bw * (0.03 + 0.05 * Math.abs(Math.sin((o.t || 0) * 14))), 0, 0, 7); c.fill(); }
    else { c.beginPath(); c.moveTo(x - bw * 0.1, my); c.lineTo(x + bw * 0.1, my); c.stroke(); }
    c.restore(); }

  function chart(c, x, y, w, h, day, { frame = true, lw = 4 } = {}) {
    if (frame) { c.fillStyle = '#3a3f49'; rr(c, x - 14, y - 14, w + 28, h + 28, 10); c.fill(); }
    c.fillStyle = '#0b0d11'; c.fillRect(x, y, w, h);
    c.strokeStyle = '#2a2f38'; c.lineWidth = 1.5; for (let k = 1; k < 4; k++) { c.beginPath(); c.moveTo(x, y + h * k / 4); c.lineTo(x + w, y + h * k / 4); c.stroke(); }
    const px = d => x + 6 + (w - 12) * d / END_DAY, py = e => y + h - 8 - (h - 16) * e;
    const n = Math.max(1, Math.ceil(day / 4)); c.beginPath(); c.moveTo(px(0), py(0));
    for (let i = 0; i <= n; i++) { const d = day * i / n; c.lineTo(px(d), py(extent(d))); }
    c.lineTo(px(day), py(0)); c.closePath(); c.fillStyle = 'rgba(255,59,48,0.28)'; c.fill();
    c.beginPath(); for (let i = 0; i <= n; i++) { const d = day * i / n; i ? c.lineTo(px(d), py(extent(d))) : c.moveTo(px(d), py(extent(d))); }
    c.strokeStyle = RED; c.lineWidth = lw; c.lineJoin = 'round'; c.stroke();
    c.fillStyle = 'rgba(255,59,48,0.25)'; c.beginPath(); c.arc(px(day), py(extent(day)), lw * 4.5, 0, 7); c.fill(); c.fillStyle = RED; c.beginPath(); c.arc(px(day), py(extent(day)), lw * 2.2, 0, 7); c.fill(); }

  // ---------- the meeting room (room coords 1080x1920) ----------
  const ACROSS = [{ x: 300, fi: 0, ph: 0.3 }, { x: 560, fi: 3, ph: 2.1 }, { x: 820, fi: 4, ph: 4.0 }];
  const heldAt = a => [a.x + 58, 918];
  const FG = { x: 250, y: 1570, s: 9 }, HERO_NOTE = [610, 1345];
  function flight(f, day) { const D = f.hDay; return clamp((day - (D - 12)) / 12, 0, 1); }
  function drawRoom(c, t, o = {}) {
    const day = dayAt(t), comedic = day < 403, frozen = t >= 13.43, dim = o.dim || 0, prof = o.profile || 0;
    c.fillStyle = WALL; c.fillRect(0, 0, 1080, 1920);
    c.fillStyle = '#1e2229'; c.fillRect(0, 0, 1080, 170); c.fillStyle = '#2b3039'; c.fillRect(0, 170, 1080, 8);
    // board
    c.fillStyle = '#3a3f49'; rr(c, 60, 330, 410, 330, 10); c.fill(); c.fillStyle = '#2e333c'; c.fillRect(74, 344, 382, 302);
    SLOTS.forEach(([sx, sy], i) => { c.save(); c.setLineDash([8, 7]); c.strokeStyle = i === 5 ? '#8a909b' : '#555b66'; c.lineWidth = 3; c.strokeRect(sx - 40, sy - 40, 80, 80); c.restore(); });
    // TV
    c.fillStyle = '#3a3f49'; c.fillRect(780, 700, 18, 60); chart(c, 600, 380, 400, 290, day, { lw: 5 });
    // across-table beans
    ACROSS.forEach((a, k) => { const f = FR[a.fi], fl = flight(f, day), holding = fl <= 0;
      const mood = frozen ? (t < 14.9 ? 'freeze' : 'worried') : (comedic && Math.sin(t * 3 + a.ph) > 0.2 ? 'talk' : 'happy');
      const bob = comedic ? Math.sin(t * 5 + a.ph) * 6 : 0; const hp = heldAt(a);
      bean(c, a.x, 880 + bob, 2.4, { mood, look: frozen ? [0.8, -0.7] : [0.5, 0.7], armTo: holding ? [hp[0], hp[1] + bob] : null, t });
      if (holding) note(c, hp[0], hp[1] - 12 + bob, 58, -0.1 + k * 0.08, { seed: 10 + k }); });
    // table
    c.fillStyle = '#2b3039'; c.beginPath(); c.moveTo(-40, 1320); c.lineTo(110, 960); c.lineTo(970, 960); c.lineTo(1120, 1320); c.closePath(); c.fill();
    c.fillStyle = '#343a44'; c.fillRect(110, 960, 860, 10);
    // paperwork on the table
    c.fillStyle = '#c9c6bd'; [[240, 1040, 0.1], [700, 1010, -0.2], [880, 1120, 0.3], [420, 1150, -0.05]].forEach(([px, py, rt]) => { c.save(); c.translate(px, py); c.rotate(rt); c.fillRect(-45, -30, 90, 60); c.restore(); });
    // comedy: blah volleys and invites (only before the jump)
    if (comedic && !o.noBusy) { for (let k = 0; k < 6; k++) { const a = ACROSS[k % 3], b = ACROSS[(k + 1 + (k > 2 ? 1 : 0)) % 3];
        const q = ((t * 0.8 + k / 6) % 1); const bx = lerp(a.x, b.x, q), by = 760 - Math.sin(q * Math.PI) * 120 - (k % 2) * 40;
        c.save(); c.globalAlpha = Math.sin(q * Math.PI) * 0.95; c.fillStyle = '#d8d4ca'; rr(c, bx - 55, by - 26, 110, 52, 18); c.fill();
        c.fillStyle = '#4a4f58'; c.font = `32px "${HAND}"`; c.textAlign = 'center'; c.fillText(k % 3 === 2 ? 'sync?' : 'blah', bx, by + 10); c.restore(); }
      for (let k = 0; k < 4; k++) { const q = ((t * 0.55 + k * 0.27) % 1), ex = lerp(-80, 1160, q), ey = 1080 + k * 50 + Math.sin(q * 9 + k) * 20;
        c.save(); c.translate(ex, ey); c.rotate(Math.sin(q * 6 + k) * 0.3); c.fillStyle = '#8a909b'; c.fillRect(-32, -20, 64, 40); c.strokeStyle = '#5d636d'; c.lineWidth = 3; c.beginPath(); c.moveTo(-32, -20); c.lineTo(0, 4); c.lineTo(32, -20); c.stroke(); c.restore(); } }
    // foreground bean (back view), in shadow
    bean(c, FG.x, FG.y, FG.s, { col: '#80858e', back: true, profile: prof, armTo: [HERO_NOTE[0] - 40, HERO_NOTE[1] + 60], rim: extent(day) * (0.4 + dim) });
    // ---- lights-out overlay (loss as absence), then the lit things on top ----
    if (dim > 0) { c.fillStyle = `rgba(6,7,10,${0.62 * dim})`; c.fillRect(0, 0, 1080, 1920); chart(c, 600, 380, 400, 290, day, { lw: 5, frame: false }); }
    // board notes + flights
    FR.forEach((f, i) => { if (f.where === 'hero') return; const fl = flight(f, day); if (fl <= 0) return;
      const S = SLOTS[i]; let P; if (f.where === 'room') { const a = ACROSS.find(a => a.fi === i); P = heldAt(a); P = [P[0], P[1] - 12]; } else P = [-60, 780 - i * 40];
      const e = L.ease.inOut(fl), x = lerp(P[0], S[0], e), y = lerp(P[1], S[1], e) - Math.sin(e * Math.PI) * 90;
      if (fl < 1 || day - f.hDay < 20) { c.save(); c.globalAlpha = fl < 1 ? 0.8 : 0.8 * (1 - (day - f.hDay) / 20); c.strokeStyle = GREEN; c.lineWidth = 3; c.setLineDash([10, 8]); c.beginPath(); c.moveTo(P[0], P[1]); c.lineTo(x, y); c.stroke(); c.restore(); }
      note(c, x, y, lerp(58, 70, e), lerp(-0.1, (i % 2 ? 0.05 : -0.05), e), { seed: 20 + i }); });
    ACROSS.forEach((a, k) => { if (dim > 0 && flight(FR[a.fi], day) <= 0) { const hp = heldAt(a); note(c, hp[0], hp[1] - 12, 58, -0.1 + k * 0.08, { seed: 10 + k }); } });
    // hero's note in hand
    const tremble = o.tremble ? Math.sin(t * 31) * 0.012 * o.tremble : 0;
    note(c, HERO_NOTE[0], HERO_NOTE[1], 180, -0.08 + tremble, { text: 'who owes|whom?', glow: 0.6 });
    c.fillStyle = dim > 0 ? '#4a4e56' : '#80858e'; c.beginPath(); c.arc(HERO_NOTE[0] - 52, HERO_NOTE[1] + 74, 30, 0, 7); c.fill();
  }

  // ---------- the city of ministries ----------
  const W0 = [508, 1000], K = 0.06, WW = 1080 * K, WH = 1920 * K;
  const toCity = (rx, ry) => [W0[0] + rx * K, W0[1] + ry * K];
  const cr = L.rng(77), buildings = [], windows = [];
  function addRow(base, hMin, hMax, shade, winScale, x0, x1) { let x = x0; while (x < x1) { const w = 90 + cr() * 90, h = hMin + cr() * (hMax - hMin);
      if (!(base === 1600 && x + w > 360 && x < 720)) { const b = { x, w, top: base - h, base, shade, ped: cr() < 0.5 }; buildings.push(b);
        const ws = 14 * winScale, hs = 20 * winScale, cols = Math.floor((w - 20) / (ws * 2)), rows = Math.floor((h - 50) / (hs * 1.9));
        for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) windows.push({ x: x + 12 + q * ws * 2 + ws * 0.5, y: b.top + 30 + r * hs * 1.9, w: ws, h: hs, lit: cr() < 0.35, b }); }
      x += w + 8 + cr() * 18; } }
  addRow(1150, 260, 520, '#262a32', 0.7, -260, 1340); addRow(1360, 300, 560, '#2d323b', 0.85, -240, 1320); addRow(1600, 320, 600, '#343a44', 1, -260, 1340);
  const MAIN = { x: 360, w: 360, top: 830, base: 1600 };
  for (let r = 0; r < 9; r++) for (const qx of [385, 425, 635, 675]) windows.push({ x: qx, y: 880 + r * 76, w: 18, h: 28, lit: cr() < 0.4 });
  // red ranks: distance from the upper-right corner plus noise, then uniform ranks so red share == extent exactly
  windows.forEach(w => w.key = Math.hypot(w.x - 1250, w.y - 800) / 1500 + cr() * 0.25);
  const order = windows.map((w, i) => i).sort((a, b) => windows[a].key - windows[b].key); order.forEach((wi, r) => windows[wi].rank = (r + 0.5) / windows.length);
  const remoteIdx = [1, 2, 6], remoteWin = {};
  [[-60, 1180], [1010, 980], [150, 1420]].forEach((p, k) => { let best = null, bd = 1e9; windows.forEach(w => { const d = Math.hypot(w.x - p[0], w.y - p[1]); if (d < bd && !w.green) { bd = d; best = w; } }); best.green = true; remoteWin[remoteIdx[k]] = best; });
  function drawCity(c, t, z) {
    const day = dayAt(t), ex = extent(day), dim = sm(19, 22, t);
    const g = c.createLinearGradient(0, -400, 0, 1700); g.addColorStop(0, '#0e1016'); g.addColorStop(1, '#1f232b'); c.fillStyle = g; c.fillRect(-2000, -2000, 5080, 6000);
    c.fillStyle = '#12141a'; c.fillRect(-2000, 1600, 5080, 2000);
    buildings.forEach(b => { c.fillStyle = b.shade; c.fillRect(b.x, b.top, b.w, b.base - b.top);
      if (b.ped) { c.beginPath(); c.moveTo(b.x - 6, b.top); c.lineTo(b.x + b.w / 2, b.top - b.w * 0.22); c.lineTo(b.x + b.w + 6, b.top); c.closePath(); c.fill(); } });
    // main ministry: pediment, columns, steps
    c.fillStyle = '#3d434e'; c.fillRect(MAIN.x, MAIN.top, MAIN.w, MAIN.base - MAIN.top);
    c.beginPath(); c.moveTo(MAIN.x - 20, MAIN.top); c.lineTo(MAIN.x + MAIN.w / 2, MAIN.top - 110); c.lineTo(MAIN.x + MAIN.w + 20, MAIN.top); c.closePath(); c.fill();
    c.fillStyle = '#4a515d'; c.fillRect(MAIN.x - 20, MAIN.top - 6, MAIN.w + 40, 14); for (let k = 0; k < 4; k++) c.fillRect(MAIN.x - 30 - k * 12, 1560 + k * 10, MAIN.w + 60 + k * 24, 10);
    for (const cx of [470, 590]) c.fillRect(cx - 9, 870, 18, 690);
    windows.forEach(w => { let col = w.lit ? '#5d636d' : '#2a2f38';
      if (w.green) { c.fillStyle = 'rgba(52,210,123,0.25)'; c.beginPath(); c.arc(w.x + w.w / 2, w.y + w.h / 2, w.w * 3.2, 0, 7); c.fill(); col = GREEN; c.fillStyle = GREEN; c.fillRect(w.x - w.w * 0.4, w.y - w.h * 0.4, w.w * 1.8, w.h * 1.8); }
      else if (ex >= w.rank) col = RED;
      c.fillStyle = col; c.globalAlpha = (!w.green && ex >= w.rank) ? 0.85 : 1; c.fillRect(w.x, w.y, w.w, w.h); c.globalAlpha = 1; });
    // the meeting-room window, with the room inside
    c.fillStyle = '#0b0d11'; c.fillRect(W0[0] - 6, W0[1] - 6, WW + 12, WH + 12);
    c.save(); c.beginPath(); c.rect(W0[0], W0[1], WW, WH); c.clip(); c.translate(W0[0], W0[1]); c.scale(K, K);
    drawRoom(c, t, { dim: sm(19, 22, t), profile: sm(20.6, 21.6, t), tremble: sm(20.6, 22, t), noBusy: z < 6 }); c.restore();
    // lines from the other ministries to the room (only visible from far away)
    const la = 1 - sm(2.5, 6, z); if (la > 0) { const Wc = [W0[0] + WW / 2, W0[1] + WH / 2];
      c.save(); c.globalAlpha = la; c.fillStyle = 'rgba(52,210,123,0.18)'; c.beginPath(); c.arc(Wc[0], Wc[1], 70, 0, 7); c.fill();
      remoteIdx.forEach((fi, k) => { const w = remoteWin[fi], P = [w.x + w.w / 2, w.y + w.h / 2], f = FR[fi];
        c.strokeStyle = GREEN; c.lineCap = 'round';
        if (day >= f.hDay) { c.lineWidth = 4; c.setLineDash([]); c.beginPath(); c.moveTo(P[0], P[1]); c.lineTo(Wc[0], Wc[1]); c.stroke(); }
        else { const q = ((t * 0.7 + k * 0.37) % 1), reach = sm(0, 0.7, q) * 0.62; c.globalAlpha = la * (1 - sm(0.7, 1, q)) * 0.9; c.lineWidth = 3; c.setLineDash([12, 10]);
          c.beginPath(); c.moveTo(P[0], P[1]); c.lineTo(lerp(P[0], Wc[0], reach), lerp(P[1], Wc[1], reach)); c.stroke(); c.globalAlpha = la; } });
      c.restore(); }
    if (dim > 0) { c.fillStyle = `rgba(6,7,10,${0.35 * dim})`; c.fillRect(-2000, -2000, 5080, 6000); }
  }

  // World camera: [t, cx, cy, z]; zoom is interpolated in log space, center in 1/z so the focus stays locked.
  const RC = toCity(540, 960), Z0 = 1 / K;
  const CAM = [
    [0, ...RC, Z0], [5.2, RC[0], RC[1] + 1, Z0 * 1.06],
    [10.0, RC[0], RC[1], Z0 * 1.0], [13.43, ...toCity(560, 940), Z0 * 1.04], [15.0, ...toCity(560, 940), Z0 * 1.04],
    [18.3, 540, 1100, 1.0], [20.0, 540, 1100, 0.98],
    [21.8, ...toCity(600, 1170), Z0 * 1.62], [24.2, ...toCity(600, 1190), Z0 * 1.72]];
  function cam(t) { let i = 0; while (i < CAM.length - 2 && t > CAM[i + 1][0]) i++; const a = CAM[i], b = CAM[i + 1];
    const f = L.ease.inOut(clamp((t - a[0]) / (b[0] - a[0]), 0, 1)); const z = Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), f));
    const F0 = 1 / a[3], F1 = 1 / b[3], g = Math.abs(F1 - F0) < 1e-9 ? f : (1 / z - F0) / (F1 - F0);
    return [lerp(a[1], b[1], g), lerp(a[2], b[2], g), z]; }
  function world(c, t, [cx, cy, z]) { c.save(); c.translate(540, 960); c.scale(z, z); c.translate(-cx, -cy); drawCity(c, t, z); c.restore(); }

  // ---------- interviews ----------
  const IV = [
    { title: 'Liquidity Desk', quote: 'I did send the memo.', wall: '#262a31', fi: 0, mood: 'happy' },
    { title: 'Rescue Office', quote: "It's on the agenda. Next quarter.", wall: '#24282e', fi: 1, mood: 'happy' },
    { title: 'Reform Committee', quote: "We're scheduling the pre-meeting.", wall: '#282b30', fi: 6, mood: 'talk' }];
  function interview(c, lt, k, t) {
    const iv = IV[k], day = dayAt(t); c.fillStyle = iv.wall; c.fillRect(0, 0, 1080, 1920);
    c.fillStyle = '#1f2228'; c.fillRect(0, 1480, 1080, 440);
    // blinds
    c.fillStyle = '#2e323a'; c.fillRect(90, 360, 330, 420); c.strokeStyle = '#3c414a'; c.lineWidth = 6; for (let y = 380; y < 780; y += 26) { c.beginPath(); c.moveTo(96, y); c.lineTo(414, y); c.stroke(); }
    // tear-off calendar: a page per month drops
    c.fillStyle = '#c9c6bd'; c.fillRect(170, 840, 150, 170); c.fillStyle = '#6d727b'; c.fillRect(170, 840, 150, 34);
    const pg = (day / 30.4) % 1; c.save(); c.translate(245 + pg * 60, 925 + pg * pg * 500); c.rotate(pg * 1.4); c.globalAlpha = 1 - pg; c.fillStyle = '#d8d4ca'; c.fillRect(-75, -85, 150, 170); c.restore();
    chart(c, 600, 600, 320, 220, day, { lw: 4 });
    const bob = Math.sin(t * 2.2) * 5;
    bean(c, 470, 1150 + bob, 6.4, { mood: iv.mood, look: [0.3, 0], armTo: [700, 1240 + bob], t });
    const f = FR[iv.fi], held = dayAt(t) < f.hDay;
    note(c, 720, 1195 + bob, 130, 0.08, { seed: 40 + k, glow: 0.4, al: held ? 1 : 0.35 });
    // documentary frame marks
    c.strokeStyle = 'rgba(232,228,218,0.5)'; c.lineWidth = 4; [[100, 250, 1, 1], [880, 250, -1, 1], [100, 1500, 1, -1], [880, 1500, -1, -1]].forEach(([x, y, sx, sy]) => { c.beginPath(); c.moveTo(x, y + sy * 50); c.lineTo(x, y); c.lineTo(x + sx * 50, y); c.stroke(); });
    hand(c, 'REC', 150, 310, 36, '#c9c6bd');
    // lower third
    const a = sm(0.05, 0.3, lt); c.save(); c.globalAlpha = a * 0.85; c.fillStyle = '#0d1118'; c.fillRect(80, 1330, 800, 150); c.restore();
    c.save(); c.globalAlpha = a; c.font = `60px "${SERIF}"`; c.fillStyle = PAPER; c.textAlign = 'left'; c.fillText(iv.quote, 110, 1400); c.restore();
    hand(c, iv.title.toUpperCase(), 110, 1455, 36, '#9aa0aa', a, 'left');
  }

  // ---------- snap panels ----------
  function panel(c, x, dayP, dayKey, lines) {
    const w = 385; chart(c, x + 20, 540, w - 40, 200, dayP, { lw: 3 });
    c.fillStyle = '#2e333c'; rr(c, x, 800, w, 290, 12); c.fill();
    const sl = i => [x + 55 + (i < 4 ? i : i - 4 + 0.5) * 92, i < 4 ? 885 : 1005];
    FR.forEach((f, i) => { const [sx, sy] = sl(i); c.save(); c.setLineDash([6, 6]); c.strokeStyle = i === 5 ? '#b9bec8' : '#555b66'; c.lineWidth = i === 5 ? 3 : 2; c.strokeRect(sx - 34, sy - 34, 68, 68); c.restore();
      const D = f[dayKey]; const P = [x + 30 + i * 54, 1180 + (i % 2) * 40];
      c.fillStyle = GREEN; c.globalAlpha = dayP >= D ? 0.35 : 1; c.beginPath(); c.arc(P[0], P[1], 9, 0, 7); c.fill(); c.globalAlpha = 1;
      if (lines && dayP >= D - 25 && dayP < D + 60) { c.save(); c.globalAlpha = 0.8 * (1 - clamp((dayP - D) / 60, 0, 1)); c.strokeStyle = GREEN; c.lineWidth = 2; c.beginPath(); c.moveTo(P[0], P[1]); c.lineTo(sx, sy); c.stroke(); c.restore(); }
      if (dayP >= D) note(c, sx, sy, 60, (i % 2 ? 0.05 : -0.05), { seed: 60 + i }); });
    c.fillStyle = '#2a2f38'; c.fillRect(x, 1260, w, 10); c.fillStyle = '#8a909b'; c.fillRect(x, 1260, w * dayP / END_DAY, 10);
  }

  // ---------- draw ----------
  function draw(c, t) {
    c.fillStyle = BG; c.fillRect(0, 0, 1080, 1920);
    if (t < 5.2 || (t >= 10 && t < 24.2)) {
      world(c, t, cam(t));
      if (t < 5.2) { L.slate(c, 'SC1  CLOSE  OVER THE SHOULDER');
        card(c, ['Everyone here', 'has a piece.'], 250, 96, 1 - sm(4.6, 4.9, t));
        const a = 1 - sm(4.6, 4.9, t); c.save(); c.globalAlpha = a * 0.85; c.fillStyle = '#0d1118'; c.fillRect(80, 1370, 560, 110); c.restore();
        hand(c, 'OFFICE OF LATER', 110, 1422, 44, PAPER, a, 'left'); hand(c, 'holds a piece nobody has read', 110, 1462, 30, '#9aa0aa', a, 'left'); }
      else if (t < 15.0) { L.slate(c, t < 13.43 ? 'SC3  MEDIUM  OVER THE SHOULDER' : 'SC3  HOLD');
        card(c, ['Agenda item one:', 'the agenda.'], 250, 88, fade(t, 10.2, 13.3));
        card(c, ['Did anyone read', "the others' notes?"], 250, 88, fade(t, 13.6, 15.0, 0.25)); }
      else if (t < 20.0) { L.slate(c, t < 18.3 ? 'SC4  CRANE UP' : 'SC4  WIDE');
        card(c, ['Every office', 'had a piece.'], 330, 96, fade(t, 16.0, 18.1));
        card(c, ['No one had', 'the map.'], 330, 96, fade(t, 18.2, 20.0, 0.25)); }
      else { L.slate(c, t < 21.8 ? 'SC5  DROP DOWN' : 'SC5  CLOSE');
        card(c, ['We slowed it down', 'so you could see it.'], 280, 86, fade(t, 21.9, 24.2)); }
    } else if (t < 10) {
      const k = Math.min(2, Math.floor((t - 5.2) / 1.6)); interview(c, t - 5.2 - k * 1.6, k, t); L.slate(c, 'SC2  INTERVIEW ' + (k + 1));
    } else if (t < 31.2) {
      const lt = t - 24.2; c.fillStyle = '#0d1118'; c.fillRect(0, 0, 1080, 1920); L.slate(c, 'SC6  SNAP');
      if (lt > 0.4) { const a = sm(0.4, 0.8, lt);
        c.save(); c.globalAlpha = a;
        const dL = clamp((t - 24.8) / 2.0, 0, 1) * END_DAY, dR = clamp((t - 27.2) / 2.0, 0, 1) * END_DAY;
        panel(c, 90, dL, 'hDay', false); panel(c, 505, dR, 'aiDay', true); c.restore();
        card(c, ['At true speed.'], 300, 92, a);
        hand(c, 'As it happened', 282, 470, 44, '#c9c6bd', a); hand(c, 'Found sooner', 697, 460, 44, '#c9c6bd', sm(26.9, 27.2, t)); hand(c, 'illustrative', 697, 500, 32, '#9aa0aa', sm(26.9, 27.2, t));
        hand(c, 'red: identical in both panels', 490, 1330, 32, '#8a909b', a);
        card(c, ['Same pieces.', 'Found sooner.'], 1400, 72, sm(29.4, 29.8, t)); }
    } else if (t < 35) {
      const lt = t - 31.2, z = Z0 * lerp(2.6, 3.4, L.ease.inOut(clamp(lt / 3.8, 0, 1))); const p = toCity(HERO_NOTE[0] - 10, HERO_NOTE[1] - 40);
      world(c, t, [p[0], p[1], z]);
      // the room clock is frozen at the trough; only the tremble continues
      c.save(); c.globalAlpha = 1 - sm(0, 0.5, lt); c.fillStyle = '#0d1118'; c.fillRect(0, 0, 1080, 1920); c.restore();
      L.slate(c, 'SC7  EXTREME CLOSE  DOLLY IN');
      card(c, ['This is', 'the bottleneck.'], 300, 104, sm(32.0, 32.4, t) * (1 - sm(34.7, 35, t)));
      if (t > 34.7) { c.fillStyle = `rgba(13,17,24,${sm(34.7, 35, t)})`; c.fillRect(0, 0, 1080, 1920); }
    } else {
      const a = sm(35, 35.5, t); L.endCard(c, a, { line: '' });
      card(c, ['The bottleneck', 'is us.'], 400, 100, a);
    }
    L.grain(c, t, { alpha: 0.05, n: 500 });
  }

  return { draw, DUR,
    acts: [{ start: 0, end: 13.43, bpm: 96 }, { start: 13.43, end: 24.2, bpm: 0, drone: true }, { start: 24.8, end: 31.2, bpm: 0, drone: true }, { start: 31.2, end: 40, bpm: 0, drone: true }],
    cues: [{ t: tOfDay(FR[0].hDay), type: 'ding' }, { t: 6.8, type: 'pop' }, { t: 8.4, type: 'pop' }, { t: 13.43, type: 'hit' }, { t: 15.0, type: 'whoosh' }, { t: 20.0, type: 'whoosh' },
      { t: 24.2, type: 'hit' }, { t: 27.2 + 2.0 * HERO.aiDay / END_DAY, type: 'ding' }, { t: 35.0, type: 'pop' }] };
}
if (typeof module !== 'undefined') module.exports = makeScene;
