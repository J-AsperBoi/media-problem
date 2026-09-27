// nineteen-days: ticking clock, x-ray, body. Analog: heatwave-2003.
// Mapping: race 1 s = 1 day (day = t - 1.4, days 0..19). Snap: 19 days in 4.5 s, same clock both lanes.
// Red extent E(d): L.logistic fitted through the sourced endpoints (0 at day 0, 1 at day 19) with its midpoint at the sourced
// peak (day 11.5): k = ln(99)/7.5, doubling 1.13 d, normalized. Daily rate rho = 4 s(1-s) (peak shape) drives the heart tempo,
// the red haze and the calendar. Green: two-sided lognormal from p10/median/p90. AI: ai_counterfactual (3 d), illustrative.
// See output/nineteen-days/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('heatwave-2003');
  const DUR = 40, RED = L.RED, GREEN = L.GREEN;
  const FILM = '#0a0f13', INK = '#06090c';
  const BONE = a => `rgba(208,224,232,${a.toFixed(3)})`, rgbaR = a => `rgba(255,59,48,${a.toFixed(3)})`, rgbaG = a => `rgba(52,210,123,${a.toFixed(3)})`;

  // ---------- data ----------
  const DEND = A.threat.points[A.threat.points.length - 1].t; // 19
  const PEAK = 11.5; // sourced: daily excess > 1,000 on days 11 and 12
  const kk = Math.log(99) / (DEND - PEAK), DBL = Math.LN2 / kk, S0 = Math.exp(-kk * PEAK) / (1 + Math.exp(-kk * PEAK));
  const raw = d => L.logistic(d, DBL, S0), R0 = raw(0), R1 = raw(DEND);
  const E = d => L.clamp((raw(d) - R0) / (R1 - R0), 0, 1);
  const rho = d => { const s = raw(L.clamp(d, 0, DEND)); return 4 * s * (1 - s); };
  const f = d => 0.9 + 2.1 * rho(d); // heartbeats per film second (tempo = fitted rate curve)
  const AG = A.solution.aggregation, MED = AG.median, P10 = AG.p10, P90 = AG.p90;
  const SLO = Math.log(MED / P10) / 1.2816, SHI = Math.log(P90 / MED) / 1.2816;
  const zOf = q => { let lo = -8, hi = 8; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; (0.5 * (1 + L.erf(m / Math.SQRT2)) < q) ? lo = m : hi = m; } return (lo + hi) / 2; };
  const hq = q => { const z = zOf(q); return MED * Math.exp(z * (z < 0 ? SLO : SHI)); };
  const AIM = A.ai_counterfactual.aggregation_median, aq = q => hq(q) * AIM / MED;
  const QS = [0.2, 0.5, 0.8], HUM = QS.map(hq), AIA = QS.map(aq); // 10.3 / 12 / 100.4 ; 2.6 / 3 / 25.1

  // heartbeat phase = integral of f over days (one clock for picture and sound)
  const STEP = 0.01, PH = [0];
  for (let i = 1; i <= DEND / STEP + 1; i++) PH[i] = PH[i - 1] + STEP * f((i - 0.5) * STEP);
  const phDay = d => { d = L.clamp(d, 0, DEND); const i = Math.floor(d / STEP), fr = d / STEP - i; return L.lerp(PH[i], PH[Math.min(i + 1, PH.length - 1)], fr); };
  const T0 = 1.4, TSNAP = 24.0, SNAPLEN = 4.5, TFIN = 31.5;
  const dayAt = t => t < T0 ? 12 : L.clamp(t - T0, 0, DEND);
  const phase = t => {
    if (t < T0) return f(12) * t;
    if (t < 23.0) { const d = t - T0; return d <= DEND ? phDay(d) : phDay(DEND) + f(DEND) * (d - DEND); }
    return phDay(DEND) + f(DEND) * (t - TFIN + 3);
  };
  const beat = ph => { const fr = ((ph % 1) + 1) % 1; return Math.exp(-fr * 9) + (fr > 0.2 ? 0.55 * Math.exp(-(fr - 0.2) * 9) : 0); };

  // ---------- helpers ----------
  const fade = (t, a, b, fd = 0.3) => L.sm(a, a + fd, t) * (1 - L.sm(b - fd, b, t));
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r); };
  const glow = (c, x, y, r, col, a) => { if (a <= 0.002) return; const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col(a)); g.addColorStop(1, col(0)); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); };
  function card(c, lines, y, size, a, { col = '#fffdf7' } = {}) {
    if (a <= 0.001) return; c.save(); c.globalAlpha = a; c.textAlign = 'center'; let yy = y;
    lines.forEach((l, i) => { const o = typeof l === 'string' ? { text: l } : l; let fz = o.size || size; c.font = `${fz}px "${SERIF}"`;
      while (c.measureText(o.text).width > 790 && fz > 30) { fz -= 4; c.font = `${fz}px "${SERIF}"`; }
      if (i) yy += fz * 1.06; c.lineJoin = 'round'; c.lineWidth = fz * 0.18; c.strokeStyle = INK; c.strokeText(o.text, 490, yy);
      c.fillStyle = o.col || col; c.fillText(o.text, 490, yy); });
    c.restore();
  }
  function tag(c, text, x, y, size, a, { col = '#fffdf7', font = HAND, align = 'left' } = {}) {
    if (a <= 0.001) return; c.save(); c.globalAlpha = a; c.font = `${size}px "${font}"`; c.textAlign = align; c.lineJoin = 'round';
    c.lineWidth = size * 0.18; c.strokeStyle = INK; c.strokeText(text, x, y); c.fillStyle = col; c.fillText(text, x, y); c.restore();
  }
  function slate(c, s) { c.save(); c.fillStyle = 'rgba(6,9,12,0.6)'; c.fillRect(40, 1818, 640, 58); c.restore(); L.slate(c, s); }
  // x-ray bone: soft halo + bright core
  function bone(c, path, w, a) {
    c.lineCap = 'round'; c.lineJoin = 'round';
    c.beginPath(); path(); c.strokeStyle = BONE(0.13 * a); c.lineWidth = w * 2.6; c.stroke();
    c.beginPath(); path(); c.strokeStyle = BONE(0.75 * a); c.lineWidth = w; c.stroke();
  }

  // ---------- the close-up: her, in local 1080x1920 ----------
  const HEART = [600, 1330];
  const rngS = L.rng(19); const SHIM = Array.from({ length: 14 }, () => ({ x: rngS() * 1080, y: rngS(), w: 120 + rngS() * 260, p: rngS() * 6 }));
  function calendar(c, d, x0 = 90, y0 = 250, cs = 54, gap = 6) {
    c.save(); c.fillStyle = 'rgba(208,224,232,0.05)'; rr(c, x0 - 14, y0 - 30, 7 * (cs + gap) + 22, 3 * (cs + gap) + 40, 8); c.fill();
    c.strokeStyle = BONE(0.35); c.lineWidth = 2.5; c.stroke();
    c.fillStyle = BONE(0.35); c.fillRect(x0 + 40, y0 - 40, 8, 22); c.fillRect(x0 + 7 * (cs + gap) - 60, y0 - 40, 8, 22); // rings
    for (let i = 0; i < DEND; i++) {
      const cx = x0 + (i % 7) * (cs + gap), cy = y0 + Math.floor(i / 7) * (cs + gap), done = L.clamp(d - i, 0, 1);
      c.strokeStyle = BONE(0.28); c.lineWidth = 2; c.strokeRect(cx, cy, cs, cs);
      if (done > 0) { c.fillStyle = rgbaR((0.18 + 0.82 * rho(i + 0.5)) * done); c.fillRect(cx + 3, cy + 3, cs - 6, cs - 6); }
    }
    c.restore();
  }
  function heatHaze(c, d, t, k = 1) {
    const h = rho(d) * k; if (h <= 0.01) return;
    const g = c.createRadialGradient(540, 1000, 300, 540, 1000, 1150); g.addColorStop(0, rgbaR(0)); g.addColorStop(0.6, rgbaR(0.22 * h)); g.addColorStop(1, rgbaR(0.85 * h));
    c.fillStyle = g; c.fillRect(0, 0, 1080, 1920);
    // rising shimmer bands (speed tied to heat)
    c.save(); c.lineWidth = 5; c.lineCap = 'round';
    SHIM.forEach((s, i) => {
      const y = 1920 - (((s.y + t * 0.05 * (0.4 + h)) % 1) * 2100) + 90;
      c.strokeStyle = rgbaR(0.35 * h); c.beginPath();
      for (let k2 = 0; k2 <= 12; k2++) { const x = s.x - s.w / 2 + k2 * s.w / 12, yy = y + Math.sin(k2 * 0.9 + t * 3 + s.p) * 10; k2 ? c.lineTo(x, yy) : c.moveTo(x, yy); }
      c.stroke();
    });
    c.restore();
  }
  function body(c, d, t, ph, bright = 1) {
    const b = bright, pu = beat(ph);
    // soft tissue silhouette
    c.save();
    c.fillStyle = 'rgba(170,196,210,0.06)'; c.strokeStyle = 'rgba(170,196,210,0.28)'; c.lineWidth = 4;
    c.beginPath(); c.ellipse(540, 690, 208, 250, 0, 0, 7); c.fill(); c.stroke();
    c.beginPath(); c.arc(540, 440, 78, 0, 7); c.fill(); c.stroke(); // hair bun
    c.beginPath(); c.moveTo(445, 900); c.lineTo(430, 1010); c.quadraticCurveTo(200, 1030, 40, 1150); c.lineTo(40, 1920); c.lineTo(1040, 1920); c.lineTo(1040, 1150); c.quadraticCurveTo(880, 1030, 650, 1010); c.lineTo(635, 900); c.fill(); c.stroke();
    // mediastinum glow
    const mg = c.createRadialGradient(560, 1360, 20, 560, 1360, 330); mg.addColorStop(0, `rgba(190,210,220,${(0.16 * b).toFixed(3)})`); mg.addColorStop(1, 'rgba(190,210,220,0)'); c.fillStyle = mg; c.fillRect(200, 1000, 700, 700);
    // skull
    bone(c, () => { c.ellipse(540, 640, 158, 172, 0, Math.PI * 0.93, Math.PI * 2.07); }, 9, b);
    bone(c, () => { c.moveTo(385, 700); c.quadraticCurveTo(392, 780, 425, 812); c.moveTo(695, 700); c.quadraticCurveTo(688, 780, 655, 812); }, 7, b);
    [[478, 692], [602, 692]].forEach(([x, y]) => bone(c, () => { c.ellipse(x, y, 46, 38, 0, 0, 7); }, 6, b));
    bone(c, () => { c.moveTo(540, 735); c.lineTo(516, 800); c.lineTo(564, 800); c.closePath(); }, 5, b);
    bone(c, () => { c.moveTo(420, 760); c.quadraticCurveTo(470, 750, 505, 775); c.moveTo(660, 760); c.quadraticCurveTo(610, 750, 575, 775); }, 5, b);
    for (let i = 0; i < 8; i++) { c.fillStyle = BONE(0.6 * b); rr(c, 484 + i * 14.5, 822, 11, 24, 3); c.fill(); rr(c, 488 + i * 13.5, 856, 10, 20, 3); c.fill(); }
    bone(c, () => { c.moveTo(425, 812); c.quadraticCurveTo(440, 905, 540, 915); c.quadraticCurveTo(640, 905, 655, 812); }, 8, b);
    // reading glasses (metal reads bright)
    c.save(); c.strokeStyle = `rgba(240,248,252,${(0.95 * b).toFixed(3)})`; c.lineWidth = 6; rr(c, 424, 654, 110, 78, 26); c.stroke(); rr(c, 546, 654, 110, 78, 26); c.stroke();
    c.beginPath(); c.moveTo(534, 680); c.quadraticCurveTo(540, 670, 546, 680); c.moveTo(424, 676); c.lineTo(380, 668); c.moveTo(656, 676); c.lineTo(700, 668); c.stroke(); c.restore();
    // spine
    for (let y = 930; y < 1940; y += 46) { const w = y < 1040 ? 34 : 42; c.fillStyle = BONE(0.12 * b); rr(c, 540 - w / 2 - 6, y - 4, w + 12, 40, 8); c.fill(); c.fillStyle = BONE(0.42 * b); rr(c, 540 - w / 2, y, w, 32, 6); c.fill(); }
    // clavicles, shoulders, arms
    bone(c, () => { c.moveTo(552, 1048); c.quadraticCurveTo(700, 1005, 870, 1036); c.moveTo(528, 1048); c.quadraticCurveTo(380, 1005, 210, 1036); }, 11, b);
    [[178, 1090], [902, 1090]].forEach(([x, y]) => bone(c, () => { c.arc(x, y, 50, 0, 7); }, 8, b));
    bone(c, () => { c.moveTo(150, 1140); c.lineTo(110, 1920); c.moveTo(206, 1140); c.lineTo(170, 1920); c.moveTo(874, 1140); c.lineTo(910, 1920); c.moveTo(930, 1140); c.lineTo(970, 1920); }, 6, b * 0.8);
    // ribs
    for (let i = 0; i < 10; i++) { const y = 1090 + i * 56, sp = 250 + Math.min(i, 5) * 16 - Math.max(0, i - 6) * 14;
      [-1, 1].forEach(s => bone(c, () => { c.moveTo(540 + s * 24, y); c.bezierCurveTo(540 + s * 140, y - 48, 540 + s * (sp + 40), y - 10, 540 + s * sp, y + 80 + i * 3); }, 8, b * (0.95 - i * 0.03))); }
    c.fillStyle = BONE(0.35 * b); rr(c, 526, 1082, 28, 310, 10); c.fill();
    // pendant on a chain
    c.strokeStyle = `rgba(240,248,252,${(0.55 * b).toFixed(3)})`; c.lineWidth = 2.5; c.beginPath(); c.moveTo(462, 985); c.quadraticCurveTo(540, 1175, 618, 985); c.stroke();
    c.fillStyle = `rgba(245,250,252,${(0.95 * b).toFixed(3)})`; c.beginPath(); c.arc(540, 1142, 13, 0, 7); c.fill();
    // heart: gray light, brightness = attention/life; pulses on the clock
    const [hx, hy] = HEART, sc = 1 + 0.07 * pu;
    glow(c, hx, hy, 230 * sc, a => `rgba(236,242,246,${a.toFixed(3)})`, (0.18 + 0.4 * pu) * b);
    c.save(); c.translate(hx, hy); c.rotate(-0.55); c.scale(sc, sc);
    c.fillStyle = `rgba(225,235,240,${((0.22 + 0.4 * pu) * b).toFixed(3)})`; c.beginPath(); c.ellipse(0, 0, 118, 92, 0, 0, 7); c.fill();
    c.strokeStyle = `rgba(240,248,252,${((0.35 + 0.5 * pu) * b).toFixed(3)})`; c.lineWidth = 5; c.stroke(); c.restore();
    c.restore();
  }
  function closeLayer(c, d, t, ph, { haze = 1, bright = 1 } = {}) {
    c.fillStyle = FILM; c.fillRect(0, 0, 1080, 1920);
    const v = c.createRadialGradient(540, 1000, 400, 540, 1000, 1200); v.addColorStop(0, 'rgba(30,40,48,0.5)'); v.addColorStop(1, 'rgba(0,0,0,0)'); c.fillStyle = v; c.fillRect(0, 0, 1080, 1920);
    // window frame behind her (right), and the calendar (left)
    c.strokeStyle = BONE(0.14); c.lineWidth = 4; c.strokeRect(700, 260, 300, 420); c.beginPath(); c.moveTo(850, 260); c.lineTo(850, 680); c.moveTo(700, 470); c.lineTo(1000, 470); c.stroke();
    calendar(c, d);
    body(c, d, t, ph, bright);
    heatHaze(c, d, t, haze);
  }

  // ---------- the block (world) ----------
  const BX = 90, BY = 240, CW = 180, CH = 320, COLS = 5, ROWS = 5, ME = [1, 2];
  const cellXY = (r, col) => [BX + col * CW, BY + r * CH];
  const HW = [BX + ME[1] * CW + HEART[0] / 6, BY + ME[0] * CH + HEART[1] / 6]; // her heart in world
  const rngC = L.rng(7);
  const cells = [];
  for (let r = 0; r < ROWS; r++) for (let col = 0; col < COLS; col++) cells.push({ r, col, off: rngC() * 0.6 - 0.3, dx: (rngC() - 0.5) * 40, pose: rngC() });
  const cell = (r, col) => cells.find(q => q.r === r && q.col === col);
  [[0, 1, 0.1], [0, 4, 0.3], [1, 0, 0.5], [0, 2, 0.7], [2, 4, 0.9]].forEach(([r, col, th]) => cell(r, col).dim = th);
  // fragments: key (next door, left), doctor's warning (upstairs right), cool room (downstairs left)
  const FR = [
    { name: "a neighbor's key", icon: 'key', w: [BX + 1 * CW + 150, BY + 1 * CH + 215], arrive: HUM[0], seed: 1 },
    { name: "a doctor's warning", icon: 'letter', w: [BX + 3 * CW + 50, BY + 0 * CH + 200], arrive: HUM[1], seed: 2 },
    { name: 'a cool room', icon: 'cool', w: [BX + 0 * CW + 90, BY + 3 * CH + 170], arrive: HUM[2], seed: 3 }];
  cell(1, 1).holder = FR[0]; cell(0, 3).holder = FR[1]; cell(3, 0).cool = true;

  function miniFigure(c, x, y, s, ph, b) {
    c.save(); c.translate(x, y); c.scale(s, s); const pu = beat(ph);
    bone(c, () => { c.arc(0, -92, 24, 0, 7); }, 3.5, b);
    bone(c, () => { c.moveTo(0, -66); c.lineTo(0, 70); }, 3, b);
    bone(c, () => { c.moveTo(-50, -52); c.quadraticCurveTo(0, -62, 50, -52); }, 3, b);
    for (let i = 0; i < 5; i++) { const yy = -44 + i * 16; bone(c, () => { c.moveTo(-4, yy); c.quadraticCurveTo(-44, yy - 8, -40, yy + 22); c.moveTo(4, yy); c.quadraticCurveTo(44, yy - 8, 40, yy + 22); }, 2.6, b); }
    glow(c, 8, -10, 40 * (1 + 0.1 * pu), a => `rgba(236,242,246,${a.toFixed(3)})`, (0.2 + 0.5 * pu) * b);
    c.fillStyle = `rgba(225,235,240,${((0.25 + 0.45 * pu) * b).toFixed(3)})`; c.beginPath(); c.ellipse(8, -10, 14, 11, -0.5, 0, 7); c.fill();
    c.restore();
  }
  function icon(c, kind, x, y, s, a) {
    c.save(); c.translate(x, y); c.scale(s, s); c.globalAlpha = a;
    glow(c, 0, 0, 90, rgbaG, 0.55);
    c.strokeStyle = GREEN; c.fillStyle = GREEN; c.lineWidth = 7; c.lineCap = 'round'; c.lineJoin = 'round';
    if (kind === 'key') { c.beginPath(); c.arc(-18, 0, 16, 0, 7); c.stroke(); c.beginPath(); c.moveTo(-2, 0); c.lineTo(36, 0); c.moveTo(24, 0); c.lineTo(24, 12); c.moveTo(34, 0); c.lineTo(34, 10); c.stroke(); }
    else if (kind === 'letter') { c.strokeRect(-32, -22, 64, 44); c.beginPath(); c.moveTo(-32, -22); c.lineTo(0, 4); c.lineTo(32, -22); c.stroke(); }
    else { for (let k = 0; k < 3; k++) { const an = k * Math.PI / 3; c.beginPath(); c.moveTo(Math.cos(an) * -28, Math.sin(an) * -28); c.lineTo(Math.cos(an) * 28, Math.sin(an) * 28); c.stroke(); } c.beginPath(); c.arc(0, 0, 6, 0, 7); c.fill(); }
    c.restore();
  }
  function world(c, d, t, ph, detailA) {
    c.fillStyle = FILM; c.fillRect(-2000, -3000, 5080, 7000);
    const h = rho(d), e = E(d);
    // heat from above
    const g = c.createLinearGradient(0, -400, 0, 1840); g.addColorStop(0, rgbaR(0.2 + 0.75 * h)); g.addColorStop(0.35, rgbaR(0.45 * h)); g.addColorStop(1, rgbaR(0.08 * h));
    c.fillStyle = g; c.fillRect(-2000, -3000, 5080, 4840 + 3000);
    // building shell
    c.fillStyle = '#0d1318'; c.fillRect(BX - 20, BY - 20, COLS * CW + 40, ROWS * CH + 40);
    bone(c, () => { c.moveTo(BX - 30, BY - 20); c.lineTo(540, BY - 110); c.lineTo(BX + COLS * CW + 30, BY - 20); c.moveTo(-600, BY + ROWS * CH + 20); c.lineTo(1680, BY + ROWS * CH + 20); }, 6, 0.8);
    cells.forEach(q => {
      const [x, y] = cellXY(q.r, q.col);
      c.fillStyle = FILM; c.fillRect(x + 6, y + 6, CW - 12, CH - 12);
      c.fillStyle = rgbaR(h * (0.32 - q.r * 0.055)); c.fillRect(x + 6, y + 6, CW - 12, CH - 12);
      if (q.cool) { c.fillStyle = rgbaG(0.16); c.fillRect(x + 6, y + 6, CW - 12, CH - 12); }
      c.strokeStyle = BONE(0.3); c.lineWidth = 3; c.strokeRect(x + 6, y + 6, CW - 12, CH - 12);
      if (q.r === ME[0] && q.col === ME[1]) return;
      const dimF = q.dim !== undefined ? L.clamp((e - q.dim) / 0.04, 0, 1) : 0;
      miniFigure(c, x + CW / 2 + q.dx, y + CH * 0.62, 0.95, ph + q.off, 1 - 0.85 * dimF);
    });
    // her cell, full detail
    const [mx, my] = cellXY(ME[0], ME[1]);
    c.save(); c.beginPath(); c.rect(mx + 6, my + 6, CW - 12, CH - 12); c.clip(); c.translate(mx, my); c.scale(1 / 6, 1 / 6);
    closeLayer(c, d, t, ph, { haze: detailA }); c.restore();
    c.strokeStyle = BONE(0.3); c.lineWidth = 3; c.strokeRect(mx + 6, my + 6, CW - 12, CH - 12);
  }

  // ---------- camera ----------
  // keys: [t, [x, y, ln zoom]]
  const CAM = [[8.0, [540, 720, Math.log(6)]], [10.6, [540, 1030, 0]], [13.2, [540, 1030, 0]], [14.8, [550, 748, Math.log(9)]], [20.4, [551, 760, Math.log(10)]]];
  const CAMF = [[TFIN, [551.7, 781.7, Math.log(13)]], [35.8, [551.7, 781.7, Math.log(15)]]];
  const camAt = t => { const k = L.key(t >= TFIN ? CAMF : CAM, t); return [k[0], k[1], Math.exp(k[2])]; };
  const applyCam = (c, [x, y, z]) => { c.translate(540, 960); c.scale(z, z); c.translate(-x, -y); };
  const w2s = ([x, y, z], p) => [(p[0] - x) * z + 540, (p[1] - y) * z + 960];
  const BOX = [50, 240, 1030, 1540];
  function pin(P, H) { // clamp P into BOX along the ray from H
    if (P[0] >= BOX[0] && P[0] <= BOX[2] && P[1] >= BOX[1] && P[1] <= BOX[3]) return [P[0], P[1], false];
    const dx = P[0] - H[0], dy = P[1] - H[1]; let s = 1;
    if (dx < 0) s = Math.min(s, (BOX[0] - H[0]) / dx); if (dx > 0) s = Math.min(s, (BOX[2] - H[0]) / dx);
    if (dy < 0) s = Math.min(s, (BOX[1] - H[1]) / dy); if (dy > 0) s = Math.min(s, (BOX[3] - H[1]) / dy);
    return [H[0] + dx * s, H[1] + dy * s, true];
  }
  function reach(c, Q, H, d, fr, w = 6, a = 1) {
    c.save(); c.globalAlpha = a; c.lineCap = 'round';
    if (d >= fr.arrive) {
      c.strokeStyle = rgbaG(0.28); c.lineWidth = w * 4; c.beginPath(); c.moveTo(Q[0], Q[1]); c.lineTo(H[0], H[1]); c.stroke();
      c.strokeStyle = GREEN; c.lineWidth = w; c.beginPath(); c.moveTo(Q[0], Q[1]); c.lineTo(H[0], H[1]); c.stroke();
      glow(c, H[0], H[1], 70, rgbaG, 0.6 * L.sm(fr.arrive, fr.arrive + 0.4, d)); c.restore(); return;
    }
    const per = 1.5 + fr.seed * 0.3, ph = ((d + fr.seed * 0.53) % per) / per; // attempt rhythm (vibe; arrival days are data)
    const fx = L.sm(0, 0.7, ph) * (0.3 + 0.35 * ((fr.seed * 7) % 5) / 5), brk = L.sm(0.72, 0.82, ph);
    if (fx > 0.01) { const ex = L.lerp(Q[0], H[0], fx), ey = L.lerp(Q[1], H[1], fx);
      c.globalAlpha = a * (1 - brk); c.strokeStyle = GREEN; c.lineWidth = w; c.setLineDash([w * 3, w * 2]); c.beginPath(); c.moveTo(Q[0], Q[1]); c.lineTo(ex, ey); c.stroke(); c.setLineDash([]);
      if (brk > 0) { c.fillStyle = GREEN; for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(ex + (k - 1) * w * 2 * brk, ey + brk * 34 * (k + 1), w * 0.7, 0, 7); c.fill(); } } }
    c.restore();
  }
  function fragments(c, cam, d, labelA, a = 1) {
    const H = w2s(cam, HW);
    FR.forEach(fr => {
      const [qx, qy, pinned] = pin(w2s(cam, fr.w), H), Q = [qx, qy];
      reach(c, Q, H, d, fr, 6, a);
      icon(c, fr.icon, qx, qy, pinned ? 1.0 : L.clamp(cam[2] * 0.7, 0.55, 1), a);
      if (labelA > 0) { c.save(); c.font = `46px "${HAND}"`; const tw = c.measureText(fr.name).width; c.restore();
        let lx = qx + (qx < 540 ? 40 : -40) - (qx < 540 ? 0 : tw), ly = qy + (qy > 1300 ? -70 : 80);
        lx = L.clamp(lx, 90, 890 - tw); ly = L.clamp(ly, 250, 1490);
        tag(c, fr.name, lx, ly, 46, labelA * a, { col: '#d9f5e4' }); }
    });
  }

  // ---------- snap panel ----------
  function panel(c, y0, title, sub, arr, clk, a, labA) {
    const x0 = 70, W = 920, H = 540; c.save(); c.globalAlpha = a;
    c.fillStyle = FILM; rr(c, x0, y0, W, H, 16); c.fill(); c.strokeStyle = BONE(0.35); c.lineWidth = 3; c.stroke();
    // mini x-ray chest, same heat and pulse in both lanes
    const cx = 225, cy = y0 + 350, ph = phDay(clk);
    c.save(); c.beginPath(); c.rect(x0 + 4, y0 + 150, 300, H - 154); c.clip();
    const h = rho(clk); glow(c, cx, cy, 200, rgbaR, 0.7 * h);
    miniFigure(c, cx, cy + 40, 1.7, ph, 1); c.restore();
    const HP = [cx + 14, cy + 23];
    const pts = [[x0 + 40, y0 + 200], [x0 + 280, y0 + 210], [x0 + 60, y0 + 500]];
    pts.forEach((p, i) => { const fr = { arrive: arr[i], seed: i + 1 };
      reach(c, p, HP, clk, fr, 4, 1);
      c.fillStyle = GREEN; glow(c, p[0], p[1], 34, rgbaG, 0.6); c.beginPath(); c.arc(p[0], p[1], 10, 0, 7); c.fill(); });
    // chart: E(d), identical in both lanes
    const cx0 = 360, cx1 = 950, cy0 = y0 + 190, cy1 = y0 + H - 50, X = dd => L.lerp(cx0, cx1, dd / DEND), Y = v => L.lerp(cy1, cy0, v);
    c.strokeStyle = BONE(0.45); c.lineWidth = 3; c.beginPath(); c.moveTo(cx0, cy0); c.lineTo(cx0, cy1); c.lineTo(cx1, cy1); c.stroke();
    c.fillStyle = rgbaR(0.85); c.beginPath(); c.moveTo(X(0), Y(0)); for (let dd = 0; dd <= clk + 1e-6; dd += 0.1) c.lineTo(X(dd), Y(E(dd))); c.lineTo(X(clk), Y(0)); c.closePath(); c.fill();
    c.strokeStyle = BONE(0.5); c.setLineDash([8, 8]); c.lineWidth = 3; c.beginPath(); c.moveTo(X(PEAK), cy0 - 10); c.lineTo(X(PEAK), cy1); c.stroke(); c.setLineDash([]);
    tag(c, 'peak', X(PEAK) - 10, cy0 - 18, 44, 1, { col: '#e8e4da', align: 'right' });
    if (clk >= arr[1]) { c.fillStyle = GREEN; c.fillRect(X(arr[1]) - 5, cy0 - 30, 10, cy1 - cy0 + 30); glow(c, X(arr[1]), cy1 - 40, 60, rgbaG, 0.5); }
    c.fillStyle = '#e8e4da'; c.beginPath(); c.moveTo(X(clk), cy1 + 4); c.lineTo(X(clk) - 12, cy1 + 26); c.lineTo(X(clk) + 12, cy1 + 26); c.fill();
    tag(c, title, 100, y0 + 72, 64, 1, { font: SERIF });
    tag(c, sub, 100, y0 + 128, 50, labA, { col: GREEN });
    c.restore();
  }

  // ---------- draw ----------
  function draw(c, t) {
    c.fillStyle = FILM; c.fillRect(0, 0, 1080, 1920);
    const d = dayAt(t), ph = phase(t);
    if (t < 23.0) {
      const cam = t < 8.0 ? camAt(8.0) : camAt(t);
      const detailA = L.clamp((cam[2] - 1.5) / 3.5, 0, 1);
      c.save(); applyCam(c, cam); world(c, d, t, ph, detailA); c.restore();
      fragments(c, cam, d, t < T0 ? 0 : Math.max(fade(t, 4.1, 8.0), fade(t, 10.7, 13.2)));
      if (t < T0) {
        card(c, ['Her heart', 'is the clock.'], 1010, 118, 1);
        slate(c, 'SC1  CLOSE  (flash-forward)');
        if (t > 1.2) { c.fillStyle = `rgba(6,9,12,${L.sm(1.2, 1.4, t).toFixed(3)})`; c.fillRect(0, 0, 1080, 1920); }
      } else {
        if (t < 1.7) { c.fillStyle = `rgba(6,9,12,${(1 - L.sm(1.4, 1.7, t)).toFixed(3)})`; c.fillRect(0, 0, 1080, 1920); }
        card(c, ['Every night,', 'a little faster.'], 1010, 104, fade(t, 1.8, 3.9));
        card(c, ['Help is close.'], 1030, 110, fade(t, 4.1, 5.9));
        card(c, ['Just out of reach.'], 1030, 104, fade(t, 6.1, 7.9));
        card(c, ['Every window,', 'a ribcage.'], 1000, 104, fade(t, 8.4, 10.5));
        card(c, ['All on the', 'same clock.'], 1000, 104, fade(t, 10.7, 13.0));
        card(c, ['Two pieces', 'arrived.'], 1010, 110, fade(t, 15.0, 17.2));
        card(c, ['One never did.'], 1030, 110, fade(t, 17.4, 20.2));
        if (t > 20.4) { c.fillStyle = `rgba(6,9,12,${(0.6 * L.sm(20.4, 20.8, t)).toFixed(3)})`; c.fillRect(0, 0, 1080, 1920); }
        card(c, ['We slowed it down', 'so you could see it.'], 1000, 96, fade(t, 20.6, 22.9));
        slate(c, t < 8.0 ? 'SC2  CLOSE  LOCKED-OFF' : t < 10.6 ? 'SC3  PULL OUT' : t < 13.2 ? 'SC3  WIDE  HOLD' : t < 14.8 ? 'SC4  PUSH IN' : 'SC4  CLOSE+');
      }
    } else if (t < 23.6) {
      c.fillStyle = INK; c.fillRect(0, 0, 1080, 1920);
    } else if (t < TFIN) {
      const clk = DEND * L.clamp((t - TSNAP) / SNAPLEN, 0, 1), a = L.sm(23.6, 23.9, t);
      tag(c, 'Same days. Full speed.', 490, 262, 58, a, { font: SERIF, align: 'center' });
      panel(c, 300, 'People', 'the warning: day 12', HUM, clk, a, L.sm(0, 0.3, clk - HUM[1]));
      panel(c, 900, 'Frontier AI', 'day 3 · illustrative', AIA, clk, a, L.sm(0, 0.3, clk - AIA[1]));
      tag(c, 'after the peak', 490, 885, 50, fade(t, 28.6, 31.4), { align: 'center' });
      tag(c, 'before the peak', 490, 1492, 50, fade(t, 28.6, 31.4), { align: 'center' });
      slate(c, 'SC5  SNAP  WIDE SPLIT');
      if (t > 31.2) { c.fillStyle = `rgba(6,9,12,${L.sm(31.2, TFIN, t).toFixed(3)})`; c.fillRect(0, 0, 1080, 1920); }
    } else {
      const cam = camAt(t), knot = L.sm(31.9, 33.2, t);
      c.save(); applyCam(c, cam); world(c, DEND, t, ph, 1); c.restore();
      // the three green lights close in and ring the heart
      const H = w2s(cam, HW);
      FR.forEach((fr, i) => {
        const [qx, qy] = pin(w2s(cam, fr.w), H), an = -Math.PI / 2 + i * Math.PI * 2 / 3, R = 250;
        const x = L.lerp(qx, H[0] + Math.cos(an) * R, knot), y = L.lerp(qy, H[1] + Math.sin(an) * R, knot);
        icon(c, fr.icon, x, y, 1, 1);
      });
      if (knot > 0) { c.save(); c.globalAlpha = knot; c.strokeStyle = rgbaG(0.3); c.lineWidth = 26; c.beginPath(); c.arc(H[0], H[1], 250, 0, 7); c.stroke();
        c.strokeStyle = GREEN; c.lineWidth = 7; c.beginPath(); c.arc(H[0], H[1], 250, 0, 7); c.stroke(); c.restore(); }
      c.fillStyle = `rgba(6,9,12,${(0.3 * L.sm(32.4, 33.0, t)).toFixed(3)})`; c.fillRect(0, 0, 1080, 1920);
      card(c, ['This is the', 'bottleneck.'], 1330, 130, fade(t, 32.8, 35.8, 0.35));
      slate(c, 'SC6  CLOSE++');
      if (t < 31.8) { c.fillStyle = `rgba(6,9,12,${(1 - L.sm(TFIN, 31.8, t)).toFixed(3)})`; c.fillRect(0, 0, 1080, 1920); }
    }
    if (t >= 35.8) L.endCard(c, L.sm(35.8, 36.2, t), { line: 'The bottleneck is us.' });
    L.grain(c, t, { alpha: 0.05, n: 500 });
  }

  // heartbeat cues on the same clock as the picture
  const cues = [];
  const addBeats = (t0, t1) => { let n = Math.ceil(phase(t0) + 1e-6); for (let t = t0; t < t1; t += 1 / 300) { if (phase(t) >= n) { cues.push({ t, type: 'bonk' }); n++; } } };
  addBeats(0, T0); addBeats(T0, 23.0); addBeats(TFIN, 35.8);
  cues.push({ t: 8.0, type: 'whoosh' }, { t: 13.2, type: 'whoosh' }, { t: 23.6, type: 'hit' },
    { t: TSNAP + SNAPLEN * AIA[1] / DEND, type: 'ding' }, { t: TSNAP + SNAPLEN * HUM[1] / DEND, type: 'pop' }, { t: 32.8, type: 'hit' });
  return { draw, DUR, cues,
    acts: [{ start: 0, end: 23.0, bpm: 0, drone: true }, { start: 23.6, end: TFIN, bpm: 0, drone: true }, { start: TFIN, end: DUR, bpm: 0, drone: true }] };
}
if (typeof module !== 'undefined') module.exports = makeScene;
