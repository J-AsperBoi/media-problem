// one-in-eight ("It started at 1 in 8."): countdown-list, constructivist poster, machine. Analog: penicillin-resistance-1946.
// Race mapping: 1 film second = 1 year while the clock runs; the clock stops on each numbered card. See output/one-in-eight/notes.md.
// Red wedge: angle = L.logistic(yr, 0.56 derived doubling, s0 0.125) x 360 deg (one hospital's samples).
// Green sockets: L.lognormalQuantile(q, 13, 13^2/1.5) (sigma from the verified p10); named holders keep documented dates (f2 1.5, f3 13).
// AI (illustrative): anonymous holders x 2.5/13; named holders never earlier than their ready_at.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('penicillin-resistance-1946');
  const DUR = 40, RED = L.RED, GREEN = L.GREEN;
  const CREAM = '#e9e1cf', CREAM2 = '#d9d0bc', PAPER = '#f3ede0', GRAY = '#8e8a83', MGRAY = '#6b6862', DGRAY = '#3f3d3a', INK = '#161514';
  const SKIN = '#d4cab6', SKIN_S = '#a39b8c';

  // ---------- speed math ----------
  const DT = A.threat.doubling_time, S0 = A.threat.points[0].extent;          // 0.56 (derived), 0.125
  const ext = y => L.logistic(Math.max(0, y), DT, S0);
  const MED = A.solution.aggregation.median, P10 = A.solution.aggregation.p10; // 13, 1.5
  const P90EQ = MED * MED / P10;                                               // 112.7 (from verified p10; file p90 rests on unverified s6)
  const AIMED = A.ai_counterfactual.aggregation_median;                        // 2.5 (assumption)
  const F2 = A.solution.fragments.find(f => f.id === 'f2'), F3 = A.solution.fragments.find(f => f.id === 'f3'), F4 = A.solution.fragments.find(f => f.id === 'f4');
  const N = 13, LAB = 1, CHEM = 6;
  const QH = [], QA = [];
  for (let i = 0; i < N; i++) { const q = L.lognormalQuantile((i + 0.5) / N, MED, P90EQ); QH.push(q); QA.push(q * AIMED / MED); }
  QH[LAB] = F2.ready_at; QH[CHEM] = F3.ready_at;                              // 1.5, 13
  QA[LAB] = Math.max(F2.ready_at, QA[LAB]); QA[CHEM] = Math.max(F3.ready_at, QA[CHEM]);
  const COUNTER = F4.ready_at;                                                  // 15
  const END_YR = 15, HALF = Math.ceil(N / 2);
  const filled = (yr, Q) => Q.filter((q, i) => yr >= q && !(i === CHEM && yr >= COUNTER)).length;
  const runStart = Q => { for (let y = 0; y <= END_YR; y += 0.01) if (filled(y, Q) >= HALF) return y; return 99; };
  const RUN_H = runStart(QH), RUN_A = runStart(QA);

  // film time -> year (one mapping, stop-start)
  const RUNS = [[3.0, 4.5, 0], [6.5, 18.0, 1.5], [20.0, 22.0, 13]];
  const yearAt = t => { if (t < 1.5) return 2.5; if (t < 3.0) return 0;
    let y = 0; for (const [a, b, y0] of RUNS) { if (t < a) return y; if (t < b) return y0 + (t - a); y = y0 + (b - a); } return y; };
  const running = t => RUNS.some(([a, b]) => t >= a && t < b);
  const tOf = y => { for (const [a, b, y0] of RUNS) if (y >= y0 && y <= y0 + (b - a)) return a + (y - y0); return -1; };

  // ---------- world layout (design space, WIDE = 1080x1920) ----------
  const D = [360, 640], DR = 230, G = [640, 1190], GR = 150;
  const WDIR = Math.atan2(G[1] - D[1], G[0] - D[0]);
  const r = L.rng(1946);
  const HOLD = [
    [150, 1500, 0.8], [290, 1270, 1.1], [460, 1600, 0.85], [960, 1320, 0.75], [900, 960, 0.7], [980, 660, 0.65], [860, 1580, 1.1],
    [770, 560, 0.62], [120, 1090, 0.7], [300, 1830, 0.78], [650, 1780, 0.8], [1000, 1860, 0.8], [600, 890, 0.6],
  ];
  // assign: index LAB and CHEM are fixed holders; the rest of the quantiles shuffled deterministically
  const H = HOLD.map(([x, y, s], k) => ({ x, y, s, k }));
  const lab = H[1], chem = H[6];
  const others = H.filter(h => h !== lab && h !== chem);
  const qIdx = []; for (let i = 0; i < N; i++) if (i !== LAB && i !== CHEM) qIdx.push(i);
  for (let i = qIdx.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [qIdx[i], qIdx[j]] = [qIdx[j], qIdx[i]]; }
  lab.q = LAB; chem.q = CHEM; others.forEach((h, i) => { h.q = qIdx[i]; });
  H.forEach(h => { h.f = h.x < G[0] ? 1 : -1; h.hand = [h.x + h.f * 78 * h.s, h.y - 285 * h.s]; h.ang = Math.atan2(h.hand[1] - G[1], h.hand[0] - G[0]); h.ph = r() * 6.28; });
  // sockets in angular order of their holders
  const byAng = [...H].sort((a, b) => a.ang - b.ang); byAng.forEach((h, i) => { h.sa = -Math.PI + (i + 0.5) * 2 * Math.PI / N; });
  // make socket angle close to the holder's own direction: rotate the ring so the mean offset is zero
  const off = Math.atan2(H.reduce((s, h) => s + Math.sin(h.ang - h.sa), 0), H.reduce((s, h) => s + Math.cos(h.ang - h.sa), 0)); H.forEach(h => { h.sa += off; });
  const specks = []; for (let i = 0; i < 900; i++) specks.push([r() * 1600 - 260, r() * 2600 - 340, r()]);

  // ---------- drawing helpers ----------
  const poly = (ctx, pts, fill, stroke, w = 4) => { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = w; ctx.lineJoin = 'miter'; ctx.stroke(); } };
  function cog(ctx, x, y, rad, col, rot = 0, drain = 0) {
    const pts = [], T = 7; for (let k = 0; k < T; k++) { const a0 = rot + k * 2 * Math.PI / T; [[-0.22, 0.74], [-0.13, 1], [0.13, 1], [0.22, 0.74], [0.5, 0.74]].forEach(([da, rr]) => pts.push([x + Math.cos(a0 + da * 2 * Math.PI / T) * rad * rr, y + Math.sin(a0 + da * 2 * Math.PI / T) * rad * rr])); }
    poly(ctx, pts, col, INK, Math.max(2, rad * 0.09));
    if (drain > 0) { ctx.save(); ctx.globalAlpha = drain; poly(ctx, pts, GRAY, INK, Math.max(2, rad * 0.09)); ctx.restore();
      ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = rad * 0.16; ctx.lineCap = 'butt'; ctx.beginPath(); ctx.moveTo(x - rad * 0.9, y - rad * 0.2); ctx.lineTo(x - rad * 0.1, y + rad * 0.12); ctx.lineTo(x + rad * 0.3, y - rad * 0.3); ctx.lineTo(x + rad * 0.95, y + rad * 0.1);
        ctx.globalAlpha = Math.min(1, drain * 1.5); ctx.stroke(); ctx.restore(); }
    ctx.fillStyle = PAPER; ctx.beginPath(); ctx.arc(x, y, rad * 0.26, 0, 7); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = Math.max(2, rad * 0.07); ctx.stroke(); }

  // poster worker: feet at (x,y), scale s, facing f, mood: resolve | worry | up
  function worker(ctx, h, { piece = 'green', mood = 'resolve', coat = MGRAY, bob = 0, drain = 0, look = 0 } = {}) {
    const { x, y, s, f } = h; ctx.save(); ctx.translate(x, y); ctx.scale(s * f, s);
    // legs (flat black trapezoids, wide stance)
    poly(ctx, [[-38, -95], [-8, -95], [-18, 0], [-58, 0]], INK); poly(ctx, [[6, -95], [36, -95], [58, 0], [20, 0]], INK);
    // torso: coat block with a diagonal lapel
    poly(ctx, [[-50, -205], [48, -205], [40, -88], [-44, -88]], coat, INK, 4);
    poly(ctx, [[-4, -205], [22, -205], [-12, -120]], '#2a2927');
    // back arm down
    ctx.strokeStyle = INK; ctx.lineWidth = 26; ctx.lineCap = 'butt'; ctx.beginPath(); ctx.moveTo(-40, -196); ctx.lineTo(-58, -110); ctx.stroke();
    // raised arm toward the machine
    const hx = 78, hy = -285 + bob * 6;
    ctx.strokeStyle = coat; ctx.lineWidth = 30; ctx.beginPath(); ctx.moveTo(32, -196); ctx.lineTo(hx - 8, hy + 22); ctx.stroke();
    ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(18, -206); ctx.lineTo(hx - 22, hy + 14); ctx.moveTo(46, -186); ctx.lineTo(hx + 6, hy + 30); ctx.stroke();
    ctx.fillStyle = SKIN; ctx.beginPath(); ctx.arc(hx, hy + 6, 15, 0, 7); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
    // head (3/4 view, split lighting)
    const cx = 6, cy = -240, R = 34;
    ctx.fillStyle = SKIN; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.clip(); ctx.fillStyle = SKIN_S; ctx.fillRect(cx - R - 2, cy - R, R * 0.8, R * 2); ctx.restore();
    ctx.strokeStyle = INK; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke();
    // cap (worker's cap, flat black with a peak)
    poly(ctx, [[cx - R - 2, cy - 8], [cx - R + 4, cy - R + 2], [cx + R - 6, cy - R - 4], [cx + R + 2, cy - 12]], INK);
    poly(ctx, [[cx + 4, cy - 14], [cx + R + 22, cy - 10], [cx + R + 18, cy - 4], [cx + 2, cy - 6]], INK);
    // face: eyes look toward the hand (up and forward) or down at the piece
    const ly = mood === 'up' ? -3 : mood === 'worry' ? 2 : -1.5, lx = 2.5 + look;
    const eyes = [[cx - 2, cy + 2], [cx + 18, cy + 1]];
    eyes.forEach(([ex, ey], i) => { ctx.fillStyle = PAPER; ctx.beginPath(); ctx.ellipse(ex, ey, 6.5, 4.2, 0, 0, 7); ctx.fill();
      ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(ex + lx, ey + ly, 2.8, 0, 7); ctx.fill(); });
    ctx.strokeStyle = INK; ctx.lineWidth = 3.4; ctx.lineCap = 'round';
    if (mood === 'worry') { ctx.beginPath(); ctx.moveTo(cx - 10, cy - 5); ctx.lineTo(cx + 4, cy - 10); ctx.moveTo(cx + 12, cy - 11); ctx.lineTo(cx + 26, cy - 7); ctx.stroke(); }
    else { ctx.beginPath(); ctx.moveTo(cx - 10, cy - 8); ctx.lineTo(cx + 5, cy - 6); ctx.moveTo(cx + 11, cy - 7); ctx.lineTo(cx + 27, cy - 9); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(cx + 12, cy + 4); ctx.lineTo(cx + 17, cy + 15); ctx.lineTo(cx + 11, cy + 16); ctx.stroke();           // nose
    ctx.beginPath(); if (mood === 'worry') { ctx.moveTo(cx + 2, cy + 25); ctx.quadraticCurveTo(cx + 10, cy + 21, cx + 18, cy + 25); } else { ctx.moveTo(cx + 1, cy + 23); ctx.lineTo(cx + 19, cy + 22); } ctx.stroke();
    ctx.restore();
    // the piece (drawn unmirrored, in world space)
    const px = x + f * 78 * s, py = y + (-285 + bob * 6 - 26) * s;
    if (piece === 'blank') { ctx.save(); ctx.setLineDash([6 * s, 6 * s]); cog(ctx, px, py, 30 * s, CREAM2); ctx.restore(); }
    else if (piece === 'green') cog(ctx, px, py, 30 * s, GREEN, h.ph, drain);
    else if (piece === 'gray') cog(ctx, px, py, 30 * s, GRAY, h.ph);
  }

  function gear(ctx, cx, cy, R, yr, Q, holders, { rot = 0, lw = 1 } = {}) {
    const n = filled(yr, Q), runs = n >= HALF;
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot);
    // body
    ctx.fillStyle = DGRAY; ctx.beginPath(); ctx.arc(0, 0, R * 0.64, 0, 7); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 6 * lw; ctx.stroke();
    ctx.strokeStyle = INK; ctx.lineWidth = 10 * lw; for (let k = 0; k < 4; k++) { const a = k * Math.PI / 4; ctx.beginPath(); ctx.moveTo(Math.cos(a) * R * 0.6, Math.sin(a) * R * 0.6); ctx.lineTo(-Math.cos(a) * R * 0.6, -Math.sin(a) * R * 0.6); ctx.stroke(); }
    // sockets
    holders.forEach(h => { const w = Math.PI / N * 0.8, a = h.sa, q = Q[h.q]; const on = yr >= q, red = h.q === CHEM && yr >= COUNTER;
      ctx.beginPath(); ctx.arc(0, 0, R, a - w, a + w); ctx.arc(0, 0, R * 0.66, a + w, a - w, true); ctx.closePath();
      ctx.fillStyle = red ? RED : on ? GREEN : PAPER; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5 * lw; ctx.stroke(); });
    // hub: glows green only when at least half the pieces have met (the machine runs)
    ctx.fillStyle = runs ? GREEN : CREAM2; ctx.beginPath(); ctx.arc(0, 0, R * 0.22, 0, 7); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 6 * lw; ctx.stroke();
    ctx.restore(); return runs; }

  function disc(ctx, cx, cy, R, yr, lw = 1) {
    ctx.fillStyle = PAPER; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill();
    const e = ext(yr), half = e * Math.PI;
    ctx.fillStyle = RED; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, R, WDIR - half, WDIR + half); ctx.closePath(); ctx.fill();
    // the wedge's point pushes out of the disc (red-wedge homage): a sharp tip along the axis, length tied to extent
    ctx.beginPath(); ctx.moveTo(cx + Math.cos(WDIR + 0.18) * R * 0.95, cy + Math.sin(WDIR + 0.18) * R * 0.95); ctx.lineTo(cx + Math.cos(WDIR) * R * (1 + 0.35 * e), cy + Math.sin(WDIR) * R * (1 + 0.35 * e));
    ctx.lineTo(cx + Math.cos(WDIR - 0.18) * R * 0.95, cy + Math.sin(WDIR - 0.18) * R * 0.95); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = INK; ctx.lineWidth = 10 * lw; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.stroke(); }

  function world(ctx, yr, t, { chemMood = 'worry', labMood = 'up' } = {}) {
    ctx.fillStyle = CREAM; ctx.fillRect(-700, -700, 2500, 3400);
    // flat constructivist blocks and diagonals (static)
    poly(ctx, [[-400, 1420], [1500, 560], [1500, 700], [-400, 1560]], '#c9c0ac');
    poly(ctx, [[-400, 300], [1500, 170], [1500, 205], [-400, 335]], INK);
    poly(ctx, [[700, -300], [1500, -300], [1500, 330], [700, 420]], '#cfc6b2');
    poly(ctx, [[-400, 1960], [1500, 1700], [1500, 2800], [-400, 2800]], '#bcb3a0');
    ctx.fillStyle = 'rgba(40,36,30,0.07)'; specks.forEach(([x, y, v]) => { if (v < 0.6) ctx.fillRect(x, y, 3, 3); });
    // world labels on the poster (sans-serif-ish via HAND is off-style: use SERIF caps)
    ctx.save(); ctx.fillStyle = INK; ctx.font = `44px "${SERIF}"`; ctx.textAlign = 'left'; ctx.fillText("ONE HOSPITAL'S SAMPLES", 110, 340); ctx.restore();
    ctx.save(); ctx.fillStyle = DGRAY; ctx.font = `italic 34px "${SERIF}"`; ctx.textAlign = 'left'; ctx.fillText('red share: derived fit', 112, 384); ctx.restore();
    disc(ctx, D[0], D[1], DR, yr);
    // beams: gray guide (potential), green steel beam when that holder's piece has met the machine
    H.forEach(h => { const q = QH[h.q], sx = G[0] + Math.cos(h.sa) * GR, sy = G[1] + Math.sin(h.sa) * GR;
      ctx.save(); ctx.strokeStyle = 'rgba(22,21,20,0.28)'; ctx.lineWidth = 3; ctx.setLineDash([10, 12]); ctx.beginPath(); ctx.moveTo(h.hand[0], h.hand[1] - 20 * h.s); ctx.lineTo(sx, sy); ctx.stroke(); ctx.restore();
      const p = L.clamp((yr - (q - 0.4)) / 0.4, 0, 1); if (p > 0) { const red = h.q === CHEM && yr >= COUNTER;
        const ex = L.lerp(h.hand[0], sx, p), ey = L.lerp(h.hand[1] - 20 * h.s, sy, p);
        ctx.strokeStyle = INK; ctx.lineWidth = 18; ctx.lineCap = 'butt'; ctx.beginPath(); ctx.moveTo(h.hand[0], h.hand[1] - 20 * h.s); ctx.lineTo(ex, ey); ctx.stroke();
        ctx.strokeStyle = red ? GRAY : GREEN; ctx.lineWidth = 11; ctx.beginPath(); ctx.moveTo(h.hand[0], h.hand[1] - 20 * h.s); ctx.lineTo(ex, ey); ctx.stroke(); } });
    const rot = filled(yr, QH) >= HALF ? (yr - RUN_H) * 0.9 : 0;
    gear(ctx, G[0], G[1], GR, yr, QH, H, { rot: 0 });
    // the spinning hub spokes (only while running)
    if (rot) { ctx.save(); ctx.translate(G[0], G[1]); ctx.rotate(rot); ctx.strokeStyle = INK; ctx.lineWidth = 8; for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3; ctx.beginPath(); ctx.moveTo(Math.cos(a) * GR * 0.2, Math.sin(a) * GR * 0.2); ctx.lineTo(-Math.cos(a) * GR * 0.2, -Math.sin(a) * GR * 0.2); ctx.stroke(); } ctx.restore(); }
    // holders
    [...H].sort((a, b) => a.y - b.y).forEach(h => { const q = QH[h.q];
      let piece = 'green', mood = 'resolve', coat = MGRAY, drain = 0;
      if (h === chem) { piece = yr >= F3.ready_at ? 'green' : 'blank'; mood = chemMood; coat = '#9c978d'; drain = L.clamp((yr - COUNTER + 0.6) / 0.6, 0, 1); }
      if (h === lab) { piece = yr >= F2.ready_at - 0.3 ? 'green' : 'gray'; mood = labMood; coat = '#b8b2a5'; }
      if (h !== lab && h !== chem && yr < q - 6) piece = 'green';
      const bob = running(t) && yr > q - 0.5 && yr < q ? Math.abs(Math.sin(t * 8)) : 0;
      worker(ctx, h, { piece, mood, coat, bob, drain }); });
  }

  // ---------- screen overlays ----------
  const fade = (t, a, b, f = 0.25) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));
  function block(ctx, lines, y, size, a, { col = PAPER, bg = INK, tilt = -0.05, x = 490 } = {}) { if (a <= 0.01) return;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.rotate(tilt); ctx.textAlign = 'center';
    const ms = lines.map(l => { const o = typeof l === 'string' ? { text: l } : l; let fz = o.size || size; ctx.font = `${fz}px "${SERIF}"`; while (ctx.measureText(o.text).width > 760 && fz > 30) { fz -= 4; ctx.font = `${fz}px "${SERIF}"`; } return { ...o, fz, w: ctx.measureText(o.text).width }; });
    const hTot = ms.reduce((s, m) => s + m.fz * 1.08, 0), wMax = Math.max(...ms.map(m => m.w));
    ctx.fillStyle = bg; ctx.fillRect(-wMax / 2 - 34, -ms[0].fz * 0.95, wMax + 68, hTot + ms[0].fz * 0.35);
    let yy = 0; ms.forEach((m, i) => { if (i) yy += m.fz * 1.08; ctx.font = `${m.fz}px "${SERIF}"`; ctx.fillStyle = m.col || col; ctx.fillText(m.text, 0, yy); });
    ctx.restore(); }
  // countdown poster card: diagonal black band, huge numeral, the word
  function countCard(ctx, n, word, numCol, a, sub) { if (a <= 0.01) return; const k = L.ease.out(L.clamp(a, 0, 1));
    ctx.save(); ctx.globalAlpha = Math.min(1, a * 1.4);
    ctx.save(); ctx.translate(540 - (1 - k) * 900, 1210); ctx.rotate(-0.16); ctx.fillStyle = INK; ctx.fillRect(-900, -150, 1800, 300); ctx.fillStyle = numCol; ctx.fillRect(-900, 150, 1800, 18); ctx.restore();
    ctx.save(); ctx.translate(250, 1290); ctx.rotate(-0.16); ctx.font = `380px "${SERIF}"`; ctx.textAlign = 'center'; ctx.lineWidth = 16; ctx.strokeStyle = INK; ctx.strokeText(String(n), 0, 0); ctx.fillStyle = numCol; ctx.fillText(String(n), 0, 0); ctx.restore();
    ctx.save(); ctx.translate(640, 1200); ctx.rotate(-0.16); ctx.textAlign = 'center'; let fz = 84; ctx.font = `${fz}px "${SERIF}"`; while (ctx.measureText(word).width > 470 && fz > 40) { fz -= 4; ctx.font = `${fz}px "${SERIF}"`; }
    ctx.fillStyle = PAPER; ctx.fillText(word, 0, 0); if (sub) { ctx.font = `italic 52px "${SERIF}"`; ctx.fillStyle = numCol === RED ? PAPER : numCol; ctx.fillText(sub, 0, 72); } ctx.restore();
    ctx.restore(); }
  // year ruler: one tick per year, no numerals; frozen bar + pause mark when the clock is stopped
  function ruler(ctx, yr, run, a, t) { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a;
    const x0 = 110, x1 = 850, y = 250; ctx.fillStyle = INK; ctx.fillRect(x0 - 20, y - 26, x1 - x0 + 40, 52);
    ctx.fillStyle = CREAM2; ctx.fillRect(x0, y - 10, (x1 - x0) * L.clamp(yr / END_YR, 0, 1), 20);
    ctx.fillStyle = PAPER; for (let i = 0; i <= END_YR; i++) { const x = x0 + (x1 - x0) * i / END_YR; ctx.fillRect(x - 1.5, y - 18, 3, i % 5 ? 10 : 36); }
    ctx.fillStyle = PAPER; ctx.font = `36px "${SERIF}"`; ctx.textAlign = 'left'; ctx.fillText('years', x0 - 18, y + 62);
    if (!run) { ctx.fillStyle = PAPER; ctx.fillRect(x1 + 34, y - 18, 10, 36); ctx.fillRect(x1 + 52, y - 18, 10, 36); }
    ctx.restore(); }
  function slate(ctx, s) { ctx.save(); ctx.fillStyle = 'rgba(22,21,20,0.7)'; ctx.fillRect(40, 1818, 700, 58); ctx.restore(); L.slate(ctx, s); }

  // ---------- snap panel ----------
  function panel(ctx, y0, yr, Q, label, sub, runAt, a) { if (a <= 0.01) return;
    ctx.save(); ctx.globalAlpha = a; const W = 920, Hh = 560, x0 = 80;
    ctx.fillStyle = CREAM; ctx.fillRect(x0, y0, W, Hh); ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.strokeRect(x0, y0, W, Hh);
    poly(ctx, [[x0, y0 + Hh - 70], [x0 + W, y0 + Hh - 150], [x0 + W, y0 + Hh - 120], [x0, y0 + Hh - 40]], '#cfc6b2');
    ctx.fillStyle = INK; ctx.fillRect(x0, y0, W, 92); ctx.font = `56px "${SERIF}"`; ctx.fillStyle = PAPER; ctx.textAlign = 'left'; ctx.fillText(label, x0 + 30, y0 + 66);
    if (sub) { ctx.font = `italic 48px "${SERIF}"`; ctx.fillStyle = GREEN; ctx.textAlign = 'right'; ctx.fillText(sub, x0 + 800, y0 + 64); }
    // disc (same wedge in both panels)
    const dcx = x0 + 200, dcy = y0 + 300, dr = 140; disc(ctx, dcx, dcy, dr, yr, 0.7);
    // machine
    const gcx = x0 + 590, gcy = y0 + 300, gr = 150;
    const runs = gear(ctx, gcx, gcy, gr, yr, Q, H, { lw: 0.8 });
    if (runs) { ctx.save(); ctx.translate(gcx, gcy); ctx.rotate((yr - runAt) * 0.9); ctx.strokeStyle = INK; ctx.lineWidth = 7; for (let k = 0; k < 3; k++) { const an = k * Math.PI / 3; ctx.beginPath(); ctx.moveTo(Math.cos(an) * 30, Math.sin(an) * 30); ctx.lineTo(-Math.cos(an) * 30, -Math.sin(an) * 30); ctx.stroke(); } ctx.restore(); }
    // mini ruler along the bottom, with the moment the machine first ran marked in green
    const rx0 = x0 + 60, rx1 = x0 + 760, ry = y0 + Hh - 36; ctx.fillStyle = INK; ctx.fillRect(rx0 - 10, ry - 14, rx1 - rx0 + 20, 28);
    ctx.fillStyle = CREAM2; ctx.fillRect(rx0, ry - 6, (rx1 - rx0) * L.clamp(yr / END_YR, 0, 1), 12);
    if (yr >= runAt) { const mx = rx0 + (rx1 - rx0) * runAt / END_YR; ctx.fillStyle = GREEN; ctx.fillRect(mx - 7, ry - 30, 14, 60); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(mx - 7, ry - 30, 14, 60); }
    ctx.restore(); }

  // ---------- camera (world) ----------
  const CLOSE1 = [322, 1000, 2.6, -0.10];
  const CAM = [[0, CLOSE1], [3.0, CLOSE1], [6.5, [326, 1000, 2.8, -0.10]], [10.0, [540, 960, 1.0, 0]], [15.5, [540, 960, 1.0, 0]], [18.0, [905, 1300, 3.6, 0.08]], [24.0, [900, 1296, 4.3, 0.08]], [26.4, [900, 1296, 4.3, 0.08]]];
  const CAM_END = [[33.4, [400, 980, 2.2, -0.06]], [35.8, [372, 1000, 5.0, -0.12]]];

  function draw(ctx, t) {
    ctx.fillStyle = CREAM; ctx.fillRect(0, 0, 1080, 1920);
    if (t < 26.4 || t >= 33.4) {
      const yr = t >= 33.4 ? END_YR : yearAt(t);
      const chemMood = t >= 22 ? 'worry' : yr >= F3.ready_at ? 'up' : 'worry';
      ctx.save(); L.camera(ctx, t >= 33.4 ? CAM_END : CAM, t); world(ctx, yr, t, { chemMood, labMood: t >= 33.4 ? 'resolve' : 'up' }); ctx.restore();
      if (t < 26.4) ruler(ctx, yr, running(t), 1, t);
      // cards
      if (t < 1.5) { block(ctx, ['It started', { text: 'at 1 in 8.', col: RED, size: 150 }], 470, 118, 1); slate(ctx, 'SC1  CLOSE  (FLASH-FORWARD)'); }
      else if (t < 6.5) { block(ctx, ['The answer existed.', { text: 'In pieces.', col: GREEN }], 470, 100, fade(t, 1.6, 4.4)); countCard(ctx, 3, 'THE WARNING', GREEN, fade(t, 4.5, 6.5, 0.2), 'a hospital lab saw it'); slate(ctx, 'SC2  CLOSE  EYE LEVEL'); }
      else if (t < 15.5) { block(ctx, ['Every piece', 'in a different hand.'], 470, 92, fade(t, 10.4, 12.6)); block(ctx, ['Nobody routing', 'them together.'], 470, 92, fade(t, 13.0, 15.4)); slate(ctx, t < 10 ? 'SC3  CRANE UP' : 'SC3  WIDE'); }
      else if (t < 26.4) {
        countCard(ctx, 2, 'THE NEW COMPOUND', GREEN, fade(t, 18.0, 20.0, 0.2), '13 years');
        countCard(ctx, 1, 'IT ADAPTED.', RED, fade(t, 22.0, 24.0, 0.2));
        block(ctx, ['We slowed it down'], 430, 96, fade(t, 24.2, 26.4)); block(ctx, ['so you could see it.'], 560, 96, fade(t, 24.7, 26.4));
        slate(ctx, t < 18 ? 'SC4  DROP DOWN' : t < 24 ? 'SC4  CLOSE' : 'SC4  CLOSE  (STOP)'); }
      else { block(ctx, ['This is the', 'bottleneck.'], 470, 118, L.sm(33.8, 34.3, t)); slate(ctx, 'SC6  EXTREME CLOSE'); }
      if (t >= 1.5 && t < 1.75) { ctx.fillStyle = `rgba(243,237,224,${(1 - (t - 1.5) / 0.25) * 0.9})`; ctx.fillRect(0, 0, 1080, 1920); }
    } else {
      // SNAP: freeze on 0, one hit; then two panels, same 15 years at one uniform speed
      ctx.fillStyle = CREAM; ctx.fillRect(0, 0, 1080, 1920);
      poly(ctx, [[-10, 1560], [1090, 1380], [1090, 1440], [-10, 1620]], INK);
      countCard(ctx, 0, 'SAME PIECES.', PAPER, fade(t, 26.4, 27.4, 0.15));
      const y1 = t < 30.4 ? L.clamp((t - 27.4) / 3, 0, 1) * END_YR : L.clamp((t - 30.4) / 3, 0, 1) * END_YR;
      const y2 = L.clamp((t - 30.4) / 3, 0, 1) * END_YR;
      panel(ctx, 250, y1, QH, 'as it happened', null, RUN_H, L.sm(27.3, 27.5, t));
      panel(ctx, 840, y2, QA, 'routed sooner', 'illustrative', RUN_A, L.sm(30.1, 30.4, t));
      slate(ctx, 'SC5  SNAP  SPLIT');
    }
    if (t > 35.8) L.endCard(ctx, L.sm(35.8, 36.2, t));
    L.grain(ctx, t, { alpha: 0.05, n: 350 });
  }

  const cues = [{ t: 0.05, type: 'stamp' }, { t: 1.5, type: 'whoosh' }, { t: 4.5, type: 'stamp' }, { t: 6.5, type: 'whoosh' }, { t: 15.5, type: 'whoosh' },
    { t: 18.0, type: 'stamp' }, { t: 22.0, type: 'bonk' }, { t: 27.4, type: 'hit' }, { t: 30.4, type: 'whoosh' }, { t: 30.4 + RUN_A / END_YR * 3, type: 'ding' }, { t: 33.4, type: 'whoosh' }];
  QH.forEach(q => { const tt = tOf(q); if (tt > 0 && q > 0.2 && Math.abs(tt - 18) > 0.2) cues.push({ t: tt, type: 'pop' }); });
  return { draw, DUR,
    acts: [{ start: 0, end: 15.5, bpm: 60, drone: true }, { start: 15.5, end: 24.0, bpm: 72, drone: true }, { start: 27.4, end: 40, bpm: 0, drone: true }],
    cues: cues.sort((a, b) => a.t - b.t), _debug: { QH, QA, RUN_H, RUN_A } };
}
if (typeof module !== 'undefined') module.exports = makeScene;
