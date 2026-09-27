// the-interpreter: game-hud-run, embroidery, language, between nations, one long take, locked-off close-up with a single pull-out.
// Analog: cuban-missile-1962. Two identical gray embroidered houses across a stitched sea in one hoop.
// Every message is a green thread crossing the sea by hand (6-12 h). Frontier AI appears only in the illustrative run,
// as the needle that carries and translates faster. People write the words and decide.
// Mapping: race 1 film s = 6 story hours, continuous (H = hours after day 8). Snap A same mapping; snap B day 0-260 in 1.8 s.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A_ = L.loadAnalog('cuban-missile-1962');
  const DUR = 38, RED = L.RED, GREEN = L.GREEN;
  const TABLE = '#0e0f12', LINEN = '#29292c', WEAVE = '#343438', THREAD = '#b9b6ae', DTHREAD = '#6a6a6e', WOOD = '#5a554e', WOOD2 = '#6e6960', INK = '#e8e4da', GRAY = '#9aa0aa';
  const LAT = A_.solution.message_latency_hours;            // typical 6, worst 12
  const AG = A_.solution.aggregation, AI_MED = A_.ai_counterfactual.aggregation_median; // median 12, p90 247; AI 11
  const PTS = A_.threat.points, FR = A_.solution.fragments;
  const DAY0 = 8;
  const H_ = d => (d - DAY0) * 24;
  const F2 = H_(FR[1].ready_at), F3 = H_(FR[2].ready_at), F4 = H_(FR[3].ready_at), DEAL = H_(AG.median); // 48, 72, 84, 96
  const F2_ARR = F2 + LAT.worst, F3_ARR = F3 + LAT.typical;  // 60, 78
  const FLASH_H = 74;                                          // day-11 event placed inside day 11 (unverified: motion only)
  const extentAt = day => { let e = 0; PTS.forEach(p => { if (day >= p.t) e = p.extent; }); return e; };

  // ---------- one stated mapping: 1 s = 6 h, continuous ----------
  const T0 = 1.4, H0 = -2, RATE = 6, T_STOP = 17.9;
  const Hof = t => t < T0 ? FLASH_H : Math.min(H0 + (T_STOP - T0) * RATE, H0 + (t - T0) * RATE);
  const tOfH = H => T0 + (H - H0) / RATE;
  const T_DEAL = tOfH(DEAL);                                   // 17.73
  const T_SLOW = 18.6, T_SNAP = 21.0, T_REC = 24.8, T_IN2 = 29.0, T_NECK = 31.8, T_END = 34.0;

  // ---------- world layout ----------
  const C = [540, 960], R = 500, SEA0 = 760, SEA1 = 1130;
  const HA = [640, 1290], HB = [640, 670], FS = 1.3;           // figure hips (A near, B far), same size
  const handsOf = hip => { const ny = hip[1] - 60 * FS + 8 * FS; const dx = Math.cos(Math.PI / 2 - 1.25) * 46 * FS, dy = Math.sin(Math.PI / 2 - 1.25) * 46 * FS; return [[hip[0] - dx, ny + dy], [hip[0] + dx, ny + dy]]; };
  const [AL, AR] = handsOf(HA), [BL, BR] = handsOf(HB);
  const KNOT = [640, 1085];
  const path = (a, b, bow) => u => [L.lerp(a[0], b[0], u) + bow * Math.sin(u * Math.PI), L.lerp(a[1], b[1], u)];
  const P2 = path(BL, AL, -45), P3 = path(BR, AR, 45), P4 = path([640, SEA0 - 20], [640, SEA1 + 20], 0);
  const uAtY = y => (y - BL[1]) / (AL[1] - BL[1]);

  // red cross-stitch cells in the sea, ranked from the hoop's sides inward; the crossing channel is last
  const rr = L.rng(1962), CELLS = [];
  for (let y = SEA0 + 8; y < SEA1 - 4; y += 16) for (let x = 48; x < 1040; x += 16) {
    if (Math.hypot(x - C[0], y - C[1]) > R - 14) continue;
    const dx = Math.abs(x - 640);
    let rank = dx < 125 ? 0.8 + rr() * 0.2 : (1 - Math.min(1, (dx - 125) / 420)) * 0.72 + rr() * 0.2;
    CELLS.push({ x: x + (rr() - 0.5) * 2, y: y + (rr() - 0.5) * 2, rank, s: 5 + rr() * 1.5 });
  }
  const extOfH = H => { const d = DAY0 + H / 24; const prev = extentAt(d - 0.15), now = extentAt(d); // stitch-in over 3.6 h after a step
    if (H >= 0 && H < 3.6) return L.lerp(0.5, 0.75, L.ease.inOut(H / 3.6)); return now >= prev ? now : prev; };
  const flashOf = H => Math.exp(-Math.pow((H - FLASH_H) / 1.6, 2));

  // ---------- camera (log-zoom, center follows screen-stable interpolation) ----------
  const V = { close: [630, 1150, 3.0], wide: [540, 960, 0.98], in1: [640, 1170, 4.2], in2: [640, 1170, 4.4], in3: [640, 1165, 5.6], in4: [640, 1165, 6.0] };
  const CAM = [[0, V.close], [6.4, V.close], [9.4, V.wide], [12.4, V.wide], [14.4, V.in1], [T_SNAP, V.in2], [T_IN2, V.in2], [T_IN2 + 0.0001, V.in3], [T_END, V.in4]];
  const camAt = t => {
    if (t <= CAM[0][0]) return CAM[0][1];
    for (let i = 0; i < CAM.length - 1; i++) { const [ta, a] = CAM[i], [tb, b] = CAM[i + 1];
      if (t <= tb) { const f = L.ease.inOut((t - ta) / (tb - ta)); const z = Math.exp(L.lerp(Math.log(a[2]), Math.log(b[2]), f));
        const w = Math.abs(a[2] - b[2]) < 1e-6 ? f : (1 / z - 1 / a[2]) / (1 / b[2] - 1 / a[2]);
        return [L.lerp(a[0], b[0], w), L.lerp(a[1], b[1], w), z]; } }
    return CAM[CAM.length - 1][1];
  };

  // ---------- helpers ----------
  const txt = (c, s, x, y, size, col, { font = HAND, align = 'left', alpha = 1 } = {}) => { if (alpha <= 0.001) return; c.save(); c.globalAlpha *= alpha; c.font = `${size}px "${font}"`; c.textAlign = align; c.fillStyle = col; c.fillText(s, x, y); c.restore(); };
  const fade = (t, a, b, f = 0.3) => Math.min(L.sm(a, a + f, t), 1 - L.sm(b - f, b, t));
  const card = (c, lines, alpha, yLast = 1470, size = 76) => { if (alpha <= 0.001) return; c.save(); c.globalAlpha = alpha; c.textAlign = 'center'; c.font = `${size}px "${SERIF}"`;
    lines.forEach((s, i) => { const y = yLast - (lines.length - 1 - i) * size * 1.05; c.lineWidth = size * 0.14; c.strokeStyle = '#0b0c0f'; c.lineJoin = 'round'; c.strokeText(s, 490, y); c.fillStyle = '#fffdf7'; c.fillText(s, 490, y); }); c.restore(); };
  const stitchLine = (c, pts, col, w, dash = [12, 7], alpha = 1) => { if (pts.length < 2) return; c.save(); c.globalAlpha *= alpha; c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.setLineDash(dash); c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.restore(); };
  const glowLine = (c, pts, col, w, alpha) => { c.save(); c.globalAlpha *= alpha; c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.setLineDash([]); c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1])); c.stroke(); c.restore(); };
  const sample = (P, u0, u1, n = 40) => { const out = []; for (let i = 0; i <= n; i++) out.push(P(L.lerp(u0, u1, i / n))); return out; };
  // by-hand crossing: one stitch at a time (N stitches, eased inside each)
  const byHand = (f, N = 14) => { f = L.clamp(f, 0, 1); if (f >= 1) return 1; const k = Math.floor(f * N), g = f * N - k; return (k + L.ease.inOut(L.clamp(g * 1.6, 0, 1))) / N; };
  const needle = (c, p, dir, len = 34, w = 3) => { const a = Math.atan2(dir[1], dir[0]); c.save(); c.translate(p[0], p[1]); c.rotate(a); c.setLineDash([]);
    c.strokeStyle = '#d6d3cc'; c.lineWidth = w; c.lineCap = 'round'; c.beginPath(); c.moveTo(-len * 0.35, 0); c.lineTo(len * 0.65, 0); c.stroke();
    c.lineWidth = w * 0.6; c.beginPath(); c.ellipse(-len * 0.28, 0, len * 0.09, w * 0.9, 0, 0, 7); c.stroke(); c.restore(); };
  const house = (c, x, base, sc = 1) => { // satin-stitched gray house, identical everywhere
    const w = 170 * sc, h = 100 * sc, rh = 72 * sc, l = x - w / 2; c.save(); c.setLineDash([]); c.lineCap = 'round';
    c.strokeStyle = '#7d7c7a'; c.lineWidth = 2.6 * sc; for (let xx = l + 3 * sc; xx < l + w; xx += 4.2 * sc) { c.beginPath(); c.moveTo(xx, base - h); c.lineTo(xx, base); c.stroke(); }
    c.strokeStyle = '#8f8d89'; for (let yy = base - h - 2 * sc; yy > base - h - rh; yy -= 4.2 * sc) { const f = (base - h - yy) / rh, hw = (w / 2 + 12 * sc) * (1 - f); c.beginPath(); c.moveTo(x - hw, yy); c.lineTo(x + hw, yy); c.stroke(); }
    c.fillStyle = LINEN; c.fillRect(x - 18 * sc, base - 52 * sc, 36 * sc, 52 * sc); c.fillRect(l + 20 * sc, base - 78 * sc, 34 * sc, 30 * sc); c.fillRect(l + w - 54 * sc, base - 78 * sc, 34 * sc, 30 * sc);
    c.strokeStyle = THREAD; c.lineWidth = 2.4 * sc; c.setLineDash([7 * sc, 4 * sc]);
    c.strokeRect(x - 18 * sc, base - 52 * sc, 36 * sc, 52 * sc); c.strokeRect(l + 20 * sc, base - 78 * sc, 34 * sc, 30 * sc); c.strokeRect(l + w - 54 * sc, base - 78 * sc, 34 * sc, 30 * sc);
    c.beginPath(); c.moveTo(l - 12 * sc, base - h); c.lineTo(x, base - h - rh); c.lineTo(l + w + 12 * sc, base - h); c.stroke(); c.restore(); };
  const figure = (c, hip, mood, look, t) => { c.save(); c.setLineDash([9, 4]); L.stick(c, hip[0], hip[1], FS, { pose: { armL: 1.25, armR: 1.25 }, mood, col: '#cfccc4', seed: 7, t, look }); c.restore(); };

  // ---------- the hoop world at story hour H ----------
  function hoopWorld(c, t, H, { tie = 0, redDim = 0, cold = false } = {}) {
    const [cx, cy, z] = camAt(t); const K = Math.min(1, 2.6 / z);
    // hoop outer ring (table shadow + wood)
    c.fillStyle = 'rgba(0,0,0,0.5)'; c.beginPath(); c.arc(C[0] + 10, C[1] + 16, R + 40, 0, 7); c.fill();
    c.fillStyle = WOOD; c.beginPath(); c.arc(C[0], C[1], R + 34, 0, 7); c.fill();
    c.save(); c.beginPath(); c.arc(C[0], C[1], R, 0, 7); c.clip();
    c.fillStyle = LINEN; c.fillRect(C[0] - R, C[1] - R, 2 * R, 2 * R);
    // weave (world space, only what is visible)
    const hw = 540 / z + 4, hh = 960 / z + 4, x0 = Math.max(C[0] - R, cx - hw), x1 = Math.min(C[0] + R, cx + hw), y0 = Math.max(C[1] - R, cy - hh), y1 = Math.min(C[1] + R, cy + hh);
    c.strokeStyle = WEAVE; c.lineWidth = 1.1; c.setLineDash([]); c.beginPath();
    for (let x = Math.floor(x0 / 6) * 6; x < x1; x += 6) { c.moveTo(x, y0); c.lineTo(x, y1); }
    for (let y = Math.floor(y0 / 6) * 6; y < y1; y += 6) { c.moveTo(x0, y); c.lineTo(x1, y); } c.stroke();
    // sea: gray running-stitch waves
    for (let y = SEA0 + 20, k = 0; y < SEA1; y += 38, k++) { const pts = []; for (let x = 40; x <= 1040; x += 20) pts.push([x, y + Math.sin(x / 55 + k * 1.3) * 6]); stitchLine(c, pts, DTHREAD, 2.4, [10, 8]); }
    // shores
    stitchLine(c, sample(u => [L.lerp(40, 1040, u), SEA0 + Math.sin(u * 19) * 4], 0, 1, 50), THREAD, 3, [14, 6]);
    stitchLine(c, sample(u => [L.lerp(40, 1040, u), SEA1 + Math.sin(u * 17 + 1) * 4], 0, 1, 50), THREAD, 3, [14, 6]);
    // red: the threat, cross-stitch in the sea
    const ext = extOfH(H), fl = flashOf(H);
    c.setLineDash([]); c.lineCap = 'round';
    CELLS.forEach(q => { if (q.rank >= ext) return; const g = L.clamp((ext - q.rank) / 0.03, 0, 1); const s = q.s;
      c.globalAlpha = (0.9 - 0.55 * redDim) * (1 - 0.0 * fl); c.strokeStyle = RED; c.lineWidth = 2.6 + 1.2 * fl;
      c.beginPath(); const g1 = Math.min(1, g * 2), g2 = Math.max(0, g * 2 - 1);
      c.moveTo(q.x - s, q.y - s); c.lineTo(q.x - s + 2 * s * g1, q.y - s + 2 * s * g1);
      if (g2 > 0) { c.moveTo(q.x + s, q.y - s); c.lineTo(q.x + s - 2 * s * g2, q.y - s + 2 * s * g2); } c.stroke(); });
    c.globalAlpha = 1;
    if (fl > 0.02) { c.save(); c.globalAlpha = 0.22 * fl; c.fillStyle = RED; c.fillRect(0, SEA0, 1080, SEA1 - SEA0); c.restore(); }
    // houses (identical) and figures
    house(c, 400, 740); house(c, 400, 1370);
    const arrived2 = H >= F2_ARR, deal = tie > 0.5;
    const moodA = deal ? 'happy' : arrived2 ? 'awe' : 'bored', moodB = deal ? 'happy' : 'bored';
    // f1: the trade already in hand (A), and B's thread in hand too
    const held = (a, b) => { const pts = []; for (let i = 0; i <= 20; i++) { const u = i / 20; pts.push([L.lerp(a[0], b[0], u), L.lerp(a[1], b[1], u) + Math.sin(u * Math.PI) * 14]); } return pts; };
    // messages from B to A
    const msg = (P, h0, h1, instant) => { if (H < h0) return; const f = instant ? 1 : byHand((H - h0) / (h1 - h0)); const pts = sample(P, 0, f, 48);
      glowLine(c, pts, GREEN, 12 * K, f >= 1 ? 0.12 + 0.14 * tie : 0.08); stitchLine(c, pts, GREEN, 4.2 * Math.sqrt(K), [12, 6]);
      if (f < 1) { const p = P(f), q = P(Math.min(1, f + 0.01)); needle(c, p, [q[0] - p[0], q[1] - p[1]]); } };
    msg(P2, F2, F2_ARR); msg(P3, F3, F3_ARR);
    if (H >= F4) { const a = L.clamp((H - F4) / 1.5, 0, 1); stitchLine(c, sample(P4, 0, 1, 30), GREEN, 3 * Math.sqrt(K), [4, 7], 0.85 * a); }
    // the deal: threads tie into one knot near A's shore
    if (tie > 0) { const u = uAtY(KNOT[1]); const a2 = P2(u), a3 = P3(u), f = L.ease.out(tie);
      const ties = [[a2, KNOT], [a3, KNOT], [AR, KNOT]];
      ties.forEach(([p, k]) => { const e = [L.lerp(p[0], k[0], f), L.lerp(p[1], k[1], f)]; glowLine(c, [p, e], GREEN, 12 * K, 0.18); stitchLine(c, [p, e], GREEN, 4.5 * Math.sqrt(K), [8, 4]); });
      c.save(); c.globalAlpha = 0.25 * f; c.fillStyle = GREEN; c.beginPath(); c.arc(KNOT[0], KNOT[1], 22 * f * Math.sqrt(K), 0, 7); c.fill(); c.globalAlpha = f; c.beginPath(); c.arc(KNOT[0], KNOT[1], 8 * f, 0, 7); c.fill(); c.restore(); }
    figure(c, HB, moodB, [0, 1], t); figure(c, HA, moodA, [0, -1], t);
    stitchLine(c, held(AL, AR), GREEN, 5, [10, 4]); stitchLine(c, [[AL[0], AL[1]], [AL[0] - 6, AL[1] + 26], [AL[0] + 2, AL[1] + 40]], GREEN, 4, [8, 4]);
    stitchLine(c, held(BL, BR), GREEN, 5, [10, 4]);
    c.restore();
    // inner hoop ring + clamp
    c.save(); c.setLineDash([]); c.strokeStyle = WOOD2; c.lineWidth = 16; c.beginPath(); c.arc(C[0], C[1], R + 8, 0, 7); c.stroke();
    c.strokeStyle = '#46423c'; c.lineWidth = 2; c.beginPath(); c.arc(C[0], C[1], R + 34, 0, 7); c.stroke();
    c.fillStyle = WOOD2; c.fillRect(C[0] - 26, C[1] - R - 70, 52, 44); c.fillStyle = '#8a8680'; c.fillRect(C[0] - 8, C[1] - R - 100, 16, 34); c.restore();
  }

  // ---------- HUD (screen space, gentle game overlay: patches, pips, a bar; no numerals) ----------
  function hud(c, H, tie, alpha, run = 'RUN 1 · BY HAND') {
    if (alpha <= 0.001) return; c.save(); c.globalAlpha = alpha;
    c.fillStyle = 'rgba(11,12,15,0.72)'; c.beginPath(); c.roundRect(70, 222, 840, 214, 22); c.fill();
    c.strokeStyle = '#55555a'; c.lineWidth = 3; c.setLineDash([10, 6]); c.beginPath(); c.roundRect(80, 232, 820, 194, 18); c.stroke(); c.setLineDash([]);
    txt(c, run, 104, 286, 46, INK);
    // alert pips (red = threat), extent / 0.25
    const ext = extOfH(H), fl = flashOf(H);
    txt(c, 'alert', 648, 284, 34, GRAY);
    for (let i = 0; i < 4; i++) { const on = L.clamp(ext / 0.25 - i, 0, 1); c.fillStyle = on > 0 ? RED : '#34343a'; c.globalAlpha = alpha * (on > 0 ? 0.6 + 0.4 * on + 0 * fl : 1);
      c.beginPath(); c.arc(730 + i * 42, 272, 14 + 4 * fl * (on > 0), 0, 7); c.fill(); } c.globalAlpha = alpha;
    // pieces: f1 in hand, f2/f3 on arrival, f4 back channel; knot icon at the deal
    txt(c, 'pieces', 104, 350, 34, GRAY);
    const have = [true, H >= F2_ARR, H >= F3_ARR, H >= F4];
    have.forEach((h, i) => { const x = 222 + i * 58; c.strokeStyle = h ? GREEN : '#55555a'; c.lineWidth = 3; c.setLineDash([6, 4]); c.beginPath(); c.arc(x, 338, 20, 0, 7); c.stroke(); c.setLineDash([]);
      if (h) { c.fillStyle = GREEN; c.beginPath(); c.arc(x, 338, 11, 0, 7); c.fill(); } });
    c.strokeStyle = tie > 0.5 ? GREEN : '#55555a'; c.lineWidth = 4; c.beginPath(); c.moveTo(452, 338); c.lineTo(488, 338); c.stroke();
    c.fillStyle = tie > 0.5 ? GREEN : '#34343a'; c.beginPath(); c.arc(506, 338, 14, 0, 7); c.fill();
    // days: one tick per day since the start (no numerals)
    const days = Math.floor(DAY0 + Math.max(H, -24) / 24);
    txt(c, 'days', 560, 350, 34, GRAY);
    for (let i = 0; i < days; i++) { c.strokeStyle = THREAD; c.lineWidth = 3; c.beginPath(); c.moveTo(640 + i * 20, 326); c.lineTo(640 + i * 20 + 8, 352); c.stroke(); }
    // thread crossing bar
    let prog = 0, active = false;
    if (H >= F2 && H < F2_ARR) { prog = byHand((H - F2) / (F2_ARR - F2)); active = true; } else if (H >= F3 && H < F3_ARR) { prog = byHand((H - F3) / (F3_ARR - F3)); active = true; }
    txt(c, active ? 'thread crossing' : 'waiting', 104, 408, 34, active ? INK : GRAY);
    c.fillStyle = '#26262b'; c.fillRect(330, 388, 540, 20);
    if (prog > 0) { c.fillStyle = GREEN; c.fillRect(330, 388, 540 * prog, 20); }
    c.restore();
  }

  // ---------- snap sheets (full-frame) ----------
  const linenSheet = c => { c.fillStyle = TABLE; c.fillRect(0, 0, 1080, 1920); };
  function strip(c, y, prog, labelTop, sub, doneLabel, done, isAI) {
    const x0 = 70, w = 940, h = 360; c.save();
    c.fillStyle = LINEN; c.beginPath(); c.roundRect(x0, y, w, h, 26); c.fill(); c.strokeStyle = WOOD2; c.lineWidth = 12; c.stroke();
    // red cross-stitch in the strip sea (static alert)
    const r = L.rng(isAI ? 5 : 4); c.strokeStyle = RED; c.lineWidth = 2.6; c.globalAlpha = 0.85;
    for (let k = 0; k < 70; k++) { const xx = 260 + r() * 560, yy = y + 70 + r() * 250; if (Math.abs(yy - (y + 250)) < 30) continue; const s = 6; c.beginPath(); c.moveTo(xx - s, yy - s); c.lineTo(xx + s, yy + s); c.moveTo(xx + s, yy - s); c.lineTo(xx - s, yy + s); c.stroke(); }
    c.globalAlpha = 1; house(c, 165, y + 310, 0.8); house(c, 925, y + 310, 0.8);
    const a = [240, y + 250], b = [850, y + 250], P = u => [L.lerp(a[0], b[0], u), a[1] + Math.sin(u * Math.PI * 3) * 10];
    const pts = sample(P, 0, prog, 60); glowLine(c, pts, GREEN, 12, 0.15); stitchLine(c, pts, GREEN, 5, [12, 6]);
    if (prog < 1 && prog > 0) { const p = P(prog), q = P(Math.min(1, prog + 0.01)); needle(c, p, [q[0] - p[0], q[1] - p[1]], 44, 4); }
    c.restore();
    txt(c, labelTop, 100, y - 70, 48, INK); if (sub) txt(c, sub, 100, y - 20, 44, GRAY);
    txt(c, doneLabel, 540, y + 175, 60, GREEN, { font: SERIF, align: 'center', alpha: done });
  }
  function snapA(c, t) {
    const s = t - T_SNAP; linenSheet(c);
    const p1 = byHand((s - 0.6) / 2.0), p2 = L.clamp((s - 0.6) / 0.028, 0, 1);
    strip(c, 420, p1, 'RUN 1 · BY HAND', null, '12 hours', L.sm(2.6, 2.9, s), false);
    strip(c, 960, p2, 'RUN 2 · FRONTIER AI CARRIES', 'illustrative · translation only', 'minutes', L.sm(0.7, 1.0, s), true);
    card(c, ['It only carries.', 'People decide.'], fade(t, T_SNAP + 1.0, T_REC, 0.25), 1500, 70);
    L.slate(c, 'SC8  SNAP  TWO RUNS  (1 s = 6 h)');
  }
  function snapB(c, t) {
    const s = t - T_REC; linenSheet(c);
    const X = d => 110 + d / 260 * 800, play = L.clamp((s - 0.2) / 1.8, 0, 1) * 260;
    const lane = (yb, med, label, sub) => {
      c.save(); c.fillStyle = LINEN; c.beginPath(); c.roundRect(70, yb - 250, 940, 300, 22); c.fill(); c.strokeStyle = WOOD2; c.lineWidth = 10; c.stroke(); c.restore();
      txt(c, label, 100, yb - 290, 48, INK); if (sub) txt(c, sub, 520, yb - 290, 44, GRAY);
      // red: alert level, stitched along the floor; fades after the crisis (no date given)
      c.save(); c.strokeStyle = RED; c.lineWidth = 2.4;
      for (let d = 0; d <= Math.min(play, 80); d += 1.2) { const e = d <= 12 ? extentAt(d) : 0.75 * Math.max(0, 1 - (d - 12) / 60); if (e <= 0) continue; const hgt = e * 70;
        c.globalAlpha = 0.85; for (let yy = yb; yy > yb - hgt; yy -= 10) { c.beginPath(); c.moveTo(X(d) - 3, yy - 3); c.lineTo(X(d) + 3, yy - 9); c.stroke(); } } c.restore();
      // green: pieces assembled, lognormalCDF(day, median, p90)
      const pts = []; for (let d = 0.5; d <= play; d += 1) pts.push([X(d), yb - 190 * L.lognormalCDF(d, med, AG.p90)]);
      glowLine(c, pts, GREEN, 10, 0.12); stitchLine(c, pts, GREEN, 4.5, [10, 5]);
      if (play >= med) { const k = [X(med), yb - 190 * 0.5]; c.fillStyle = GREEN; c.beginPath(); c.arc(k[0], k[1], 13, 0, 7); c.fill(); txt(c, 'deal', k[0] + 22, k[1] + 12, 44, GREEN); }
      c.strokeStyle = '#8a8680'; c.lineWidth = 2; c.beginPath(); c.moveTo(X(0), yb + 10); c.lineTo(X(260), yb + 10); c.stroke();
      if (play > 0 && play < 260) { c.strokeStyle = INK; c.lineWidth = 2; c.beginPath(); c.moveTo(X(play), yb - 240); c.lineTo(X(play), yb + 30); c.stroke(); }
    };
    lane(760, AG.median, 'RUN 1 · BY HAND', null);
    lane(1240, AI_MED, 'RUN 2 · AI CARRIES', 'illustrative');
    if (play >= AG.p90) { c.save(); c.strokeStyle = GREEN; c.lineWidth = 4; c.setLineDash([8, 8]); c.beginPath(); c.moveTo(X(AG.p90), 470); c.lineTo(X(AG.p90), 1270); c.stroke(); c.restore();
      txt(c, 'direct line', X(AG.p90) - 12, 1320, 44, GREEN, { align: 'right' }); }
    card(c, ['A day sooner.', 'Only that.'], fade(t, T_REC + 0.9, T_REC + 2.3, 0.2), 1490, 64);
    card(c, ['The direct line', 'took 247 days.'], fade(t, T_REC + 2.4, T_IN2, 0.2), 1490, 64);
    L.slate(c, 'SC9  THE WHOLE RECORD  (1 s = 144 days)');
  }

  function draw(c, t) {
    c.fillStyle = TABLE; c.fillRect(0, 0, 1080, 1920);
    const H = Hof(t);
    const tie = t < T0 ? 0 : t >= T_IN2 ? 1 : L.sm(T_DEAL, T_DEAL + 0.6, t);
    const redDim = t >= T_IN2 ? 0.7 * L.sm(T_IN2 + 0.4, T_END, t) : 0;
    if (t < T_SNAP || t >= T_IN2) {
      c.save(); L.camera(c, [[0, camAt(t)]], 0); hoopWorld(c, t, t >= T_IN2 ? 97 : H, { tie, redDim, cold: t < T0 }); c.restore();
      // HUD
      const hudA = t < T_SLOW ? 1 : t >= T_IN2 ? 0.0 : 0;
      hud(c, t >= T_IN2 ? 97 : H, tie, hudA);
      // dim for the slow card
      if (t >= T_STOP && t < T_SNAP) { c.fillStyle = 'rgba(8,9,11,1)'; c.globalAlpha = 0.6 * L.sm(T_SLOW - 0.2, T_SLOW + 0.3, t); c.fillRect(0, 0, 1080, 1920); c.globalAlpha = 1; }
      // cards
      if (t < T0) card(c, ['Every word', 'crossed by hand.'], 1);
      card(c, ['The way out,', 'already in hand.'], fade(t, 2.0, 4.4));
      card(c, ['Waiting on', 'the other shore.'], fade(t, 4.6, 6.6));
      card(c, ['The other house', 'holds the same.'], fade(t, 7.4, 9.7));
      card(c, ['Nearly 12 hours', 'to cross.'], fade(t, 9.9, 12.3));
      card(c, ['Stitch by stitch.', 'Day by day.'], fade(t, 12.6, 14.6));
      card(c, ['Same words.', 'Both shores.'], fade(t, 15.2, 17.6));
      card(c, ['We slowed it down', 'so you could see it.'], fade(t, T_SLOW, T_SNAP, 0.3), 1040, 84);
      card(c, ['The words were', 'always theirs.'], fade(t, T_IN2 + 0.3, T_NECK - 0.1));
      card(c, ['This is the', 'bottleneck.'], fade(t, T_NECK, T_END + 0.2), 1470, 90);
      // slates
      const sl = t < T0 ? 'SC1  CLOSE  COLD OPEN (later)' : t < 6.4 ? 'SC2  CLOSE  LOCKED-OFF' : t < 9.4 ? 'SC3  PULL OUT' : t < 12.4 ? 'SC4  WIDE  THE HOOP' : t < 14.4 ? 'SC5  DOLLY IN' : t < T_SLOW ? 'SC6  CLOSER' : t < T_SNAP ? 'SC7  HOLD' : 'SC10  CLOSEST';
      L.slate(c, sl);
      // fade in from the record sheet (full-frame)
      if (t >= T_IN2 && t < T_IN2 + 0.4) { c.save(); c.globalAlpha = 1 - L.sm(T_IN2, T_IN2 + 0.4, t); snapB(c, T_IN2 - 0.01); c.restore(); }
    } else if (t < T_REC) snapA(c, t); else snapB(c, t);
    if (t >= T_END) L.endCard(c, L.sm(T_END, T_END + 0.5, t));
    L.grain(c, t, { alpha: 0.035 });
  }

  return {
    draw, DUR,
    acts: [{ start: 0, end: T0, bpm: 0, drone: true }, { start: T0, end: T_STOP, bpm: 40, drone: true }, { start: T_STOP, end: T_SLOW, bpm: 0, drone: false },
      { start: T_SLOW, end: T_SNAP, bpm: 0, drone: true }, { start: T_SNAP, end: T_SNAP + 0.5, bpm: 0, drone: false }, { start: T_SNAP + 0.5, end: T_IN2, bpm: 0, drone: true },
      { start: T_IN2, end: T_END, bpm: 36, drone: true }, { start: T_END, end: DUR, bpm: 0, drone: true }],
    cues: [{ t: 0.05, type: 'hit' }, { t: tOfH(0), type: 'hit' }, { t: 6.4, type: 'whoosh' }, { t: tOfH(F2), type: 'pop' }, { t: tOfH(F2_ARR), type: 'ding' },
      { t: 12.4, type: 'whoosh' }, { t: tOfH(F3), type: 'pop' }, { t: tOfH(FLASH_H), type: 'hit' }, { t: tOfH(F3_ARR), type: 'ding' }, { t: tOfH(F4), type: 'ding' },
      { t: T_DEAL, type: 'stamp' }, { t: T_SNAP, type: 'hit' }, { t: T_SNAP + 0.62, type: 'ding' }, { t: T_SNAP + 2.6, type: 'ding' }, { t: T_REC, type: 'whoosh' }, { t: T_NECK, type: 'stamp' }],
  };
}
module.exports = makeScene;
