// the-relay: sports-play-by-play, constructivist poster, sport. Analog: wannacry-2017.
// Race mapping: film t 2.3..5.95 s <-> hours 0..7.3 (1 s = 2 h); freeze 5.95..6.95 (hour 7.3 held); then 1 s = 2 h again to hour 24 at t 15.3.
// Red = L.logistic fit through the sourced endpoints (1 machine at 0 h, 99% of 230,000 at 24 h -> doubling 0.982 h).
// Green lanes: max(7.3, L.lognormalQuantile(q, 20, 168)) h. AI snap: median 1 h, p90 8.4 h (illustrative). See output/the-relay/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const { createCanvas } = require('@napi-rs/canvas');
  const A = L.loadAnalog('wannacry-2017');
  const DUR = 36, RED = L.RED, GREEN = L.GREEN;
  const CREAM = '#ebe3cf', CREAM2 = '#dcd2bb', INK = '#161514', G1 = '#2b2926', G2 = '#4b4743', G3 = '#6f6a63', G4 = '#9c958a', G5 = '#bdb5a5', G6 = '#d2c9b6';
  const SKIN = '#c9bea9', SKIN_SH = '#8e8577', TRACK = '#b3a994';

  // ---------- data ----------
  const K = 230000, S0 = 1 / K, END = A.threat.points[A.threat.points.length - 1].t; // 24 h
  const DBL = END * Math.LN2 / Math.log(99 * (K - 1));                                 // 0.982 h
  const share = h => h <= 0 ? 0 : L.logistic(h, DBL, S0);
  const F = {}; A.solution.fragments.forEach(f => F[f.id] = f.ready_at);
  const KILL = F.f3;                                                                   // 7.3 h
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;
  const AIMED = A.ai_counterfactual.aggregation_median, AIP90 = AIMED * P90 / MED;
  const T0 = 2.3, HPS = 2, TK = T0 + KILL / HPS, FREEZE = 1.0, TEND = TK + FREEZE + (END - KILL) / HPS; // 5.95, 15.3
  const hoursAt = t => t < T0 ? 0 : t < TK ? (t - T0) * HPS : t < TK + FREEZE ? KILL : Math.min(END, KILL + (t - TK - FREEZE) * HPS);

  // seats: 24 sectors x 60 (6 rows x 10), rank by angular distance from origin sector 0 + jitter
  const NS = 24, ROWS = 6, COLS = 10, rs = L.rng(7);
  const seats = [];
  for (let s = 0; s < NS; s++) for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const d = Math.min(s, NS - s); seats.push({ s, r, c, base: d + rs() * 1.6 });
  }
  seats.find(x => x.s === 0 && x.r === 1 && x.c === 4).base = -1; // the one seat at the gun
  seats.slice().sort((a, b) => a.base - b.base).forEach((x, i) => x.rank = i / seats.length);
  const seatRank = {}; seats.forEach(x => seatRank[x.s + ':' + x.r + ':' + x.c] = x.rank);
  const isRed = (s, r, c, h) => h > 0 && share(h) >= seatRank[s + ':' + r + ':' + c];

  // lanes: stratified quantiles, shuffled
  const rl = L.rng(19), qs = []; for (let i = 0; i < NS; i++) qs.push((i + 0.5) / NS);
  for (let i = qs.length - 1; i > 0; i--) { const j = Math.floor(rl() * (i + 1)); [qs[i], qs[j]] = [qs[j], qs[i]]; }
  const lanes = qs.map((q, i) => ({ i, q, hum: Math.max(KILL, L.lognormalQuantile(q, MED, P90)), ai: L.lognormalQuantile(q, AIMED, AIP90) }));

  // ---------- helpers ----------
  const layerA = createCanvas(1080, 1920), la = layerA.getContext('2d');
  const layerB = createCanvas(1080, 1920), lb = layerB.getContext('2d');
  function rrect(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
  function caption(c, text, y, a, { size = 78, col = CREAM, bg = INK, cx = 490 } = {}) {
    if (a <= 0) return; c.save(); c.globalAlpha *= a; let fz = size; c.font = `${fz}px "${SERIF}"`;
    let w = c.measureText(text).width; if (w > 740) { fz = fz * 740 / w; c.font = `${fz}px "${SERIF}"`; w = c.measureText(text).width; }
    const pad = 34, h = fz * 1.25, sk = h * 0.25, x0 = cx - w / 2 - pad, x1 = cx + w / 2 + pad;
    c.fillStyle = bg; c.beginPath(); c.moveTo(x0 + sk, y - h * 0.78); c.lineTo(x1 + sk, y - h * 0.78); c.lineTo(x1 - sk, y + h * 0.36); c.lineTo(x0 - sk, y + h * 0.36); c.closePath(); c.fill();
    c.fillStyle = col; c.textAlign = 'center'; c.fillText(text, cx, y); c.restore();
  }
  const capA = (t, a, b) => L.sm(a, a + 0.12, t) * (1 - L.sm(b - 0.12, b, t));
  function tag(c, text, x, y, size, a = 1, col = CREAM, bg = INK) { c.save(); c.globalAlpha *= a; c.font = `${size}px "${HAND}"`; const w = c.measureText(text).width;
    c.fillStyle = bg; c.fillRect(x - 14, y - size * 0.9, w + 28, size * 1.2); c.fillStyle = col; c.textAlign = 'left'; c.fillText(text, x, y); c.restore(); }
  function dial(c, x, y, r, h) {
    c.fillStyle = CREAM; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill();
    const f = h / END; if (f > 0) { c.fillStyle = RED; c.beginPath(); c.moveTo(x, y); c.arc(x, y, r * 0.86, -Math.PI / 2, -Math.PI / 2 + f * Math.PI * 2); c.closePath(); c.fill(); }
    c.strokeStyle = INK; c.lineWidth = 10; c.beginPath(); c.arc(x, y, r, 0, 7); c.stroke();
    for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2 - Math.PI / 2, l = i % 6 ? 0.12 : 0.24; c.lineWidth = i % 6 ? 4 : 8;
      c.beginPath(); c.moveTo(x + Math.cos(a) * r * (1 - l), y + Math.sin(a) * r * (1 - l)); c.lineTo(x + Math.cos(a) * r * 0.97, y + Math.sin(a) * r * 0.97); c.stroke(); }
    const a = -Math.PI / 2 + f * Math.PI * 2; c.lineWidth = 9; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8); c.stroke();
    c.fillStyle = INK; c.beginPath(); c.arc(x, y, 12, 0, 7); c.fill();
  }
  function baton(c, x, y, len, rot, lit, a = 1) {
    c.save(); c.globalAlpha *= a; c.translate(x, y); c.rotate(rot);
    if (lit) { c.fillStyle = 'rgba(52,210,123,0.22)'; rrect(c, -len / 2 - 26, -len * 0.14 - 26, len + 52, len * 0.28 + 52, 40); c.fill(); }
    c.fillStyle = lit ? GREEN : '#5f8a70'; rrect(c, -len / 2, -len * 0.11, len, len * 0.22, len * 0.08); c.fill();
    c.fillStyle = 'rgba(0,0,0,0.18)'; c.fillRect(-len / 2 + len * 0.08, len * 0.02, len * 0.84, len * 0.07);
    c.restore();
  }
  // flat geometric figure (constructivist): x,y = feet; phase = run cycle; armUp raises baton arm
  function figure(c, x, y, s, { col = G2, phase = 0, run = 0, armUp = 0, bat = null, face = true, look = 0 } = {}) {
    c.save(); c.translate(x, y); c.scale(s, s);
    const lg = Math.sin(phase) * 0.6 * run, lean = 0.18 * run;
    c.fillStyle = INK;
    [[-1, lg], [1, -lg]].forEach(([d, a]) => { c.save(); c.translate(d * 10, -80); c.rotate(a); c.fillRect(-9, 0, 18, 82); c.restore(); });
    c.save(); c.translate(0, -80); c.rotate(lean);
    c.fillStyle = col; c.beginPath(); c.moveTo(-30, -92); c.lineTo(30, -92); c.lineTo(20, 0); c.lineTo(-20, 0); c.closePath(); c.fill();
    c.fillStyle = INK; c.beginPath(); c.moveTo(-30, -92); c.lineTo(-12, -92); c.lineTo(20, -30); c.lineTo(20, -8); c.closePath(); c.fill();
    const armA = -Math.sin(phase) * 0.9 * run;
    c.save(); c.translate(-24, -84); c.rotate(0.2 + armA); c.fillStyle = G1; c.fillRect(-8, 0, 16, 70); c.restore();
    c.save(); c.translate(24, -84); c.rotate(-0.2 - armA * (1 - armUp) - armUp * 2.7); c.fillStyle = G1; c.fillRect(-8, 0, 16, 70);
    c.fillStyle = SKIN; c.fillRect(-11, 64, 22, 20); if (bat) baton(c, 0, 76, 90, Math.PI / 2 + 0.3, bat.lit); c.restore();
    c.fillStyle = SKIN; c.beginPath(); c.arc(0, -122, 27, 0, 7); c.fill();
    c.fillStyle = SKIN_SH; c.beginPath(); c.arc(0, -122, 27, -Math.PI / 2, Math.PI / 2); c.fill();
    c.fillStyle = INK; c.beginPath(); c.arc(0, -126, 28, Math.PI * 1.05, Math.PI * 1.95); c.fill();
    if (face) { c.fillRect(-12 + look * 6, -124, 7, 7); c.fillRect(5 + look * 6, -124, 7, 7); c.fillRect(-8 + look * 4, -106, 16, 4); }
    c.restore(); c.restore();
  }
  // big flat face for close-ups. mood: 'set' (resolve) | 'search' (looking for a hand)
  function bigFace(c, x, y, R, mood, look) {
    // shoulders / hoodie
    c.fillStyle = G2; c.beginPath(); c.moveTo(x - R * 2.2, y + R * 3.4); c.lineTo(x - R * 1.6, y + R * 1.25); c.lineTo(x + R * 1.6, y + R * 1.25); c.lineTo(x + R * 2.2, y + R * 3.4); c.closePath(); c.fill();
    c.fillStyle = INK; c.beginPath(); c.moveTo(x + R * 0.2, y + R * 1.25); c.lineTo(x + R * 0.75, y + R * 1.25); c.lineTo(x - R * 0.2, y + R * 3.4); c.lineTo(x - R * 0.75, y + R * 3.4); c.closePath(); c.fill();
    c.fillStyle = SKIN_SH; c.fillRect(x - R * 0.36, y + R * 0.6, R * 0.72, R * 0.8);
    // head
    c.fillStyle = SKIN; c.beginPath(); c.ellipse(x, y, R * 0.86, R, 0, 0, 7); c.fill();
    c.save(); c.beginPath(); c.ellipse(x, y, R * 0.86, R, 0, 0, 7); c.clip();
    c.fillStyle = SKIN_SH; c.beginPath(); c.moveTo(x + R * 0.18, y - R * 1.2); c.lineTo(x + R, y - R * 1.2); c.lineTo(x + R, y + R * 1.2); c.lineTo(x - R * 0.1, y + R * 1.2); c.closePath(); c.fill();
    c.fillStyle = INK; c.beginPath(); c.moveTo(x - R, y - R * 1.2); c.lineTo(x + R, y - R * 1.2); c.lineTo(x + R, y - R * 0.42); c.lineTo(x + R * 0.1, y - R * 0.62); c.lineTo(x - R, y - R * 0.5); c.closePath(); c.fill();
    c.restore();
    c.fillStyle = SKIN_SH; c.beginPath(); c.ellipse(x - R * 0.86, y + R * 0.05, R * 0.12, R * 0.2, 0, 0, 7); c.fill();
    // brows
    const ey = y - R * 0.12, ex = R * 0.34;
    c.fillStyle = INK; [-1, 1].forEach(d => { c.save(); c.translate(x + d * ex + look * R * 0.05, ey - R * 0.2);
      c.rotate(mood === 'set' ? d * 0.22 : -d * 0.16); c.fillRect(-R * 0.17, -R * 0.045, R * 0.34, R * 0.09); c.restore(); });
    // eyes
    [-1, 1].forEach(d => { c.fillStyle = CREAM; c.beginPath(); c.ellipse(x + d * ex, ey, R * 0.14, R * 0.075, 0, 0, 7); c.fill();
      c.fillStyle = INK; c.beginPath(); c.arc(x + d * ex + look * R * 0.07, ey, R * 0.062, 0, 7); c.fill(); });
    // nose + mouth
    c.fillStyle = SKIN_SH; c.beginPath(); c.moveTo(x + R * 0.02, ey + R * 0.08); c.lineTo(x + R * 0.14, y + R * 0.36); c.lineTo(x - R * 0.06, y + R * 0.36); c.closePath(); c.fill();
    c.fillStyle = INK; if (mood === 'set') c.fillRect(x - R * 0.2, y + R * 0.56, R * 0.4, R * 0.06);
    else { c.beginPath(); c.ellipse(x + look * R * 0.03, y + R * 0.58, R * 0.1, R * 0.07, 0, 0, 7); c.fill(); }
  }
  // blocky fist around a vertical/horizontal baton
  function fist(c, x, y, s, horiz, col = G2) {
    c.save(); c.translate(x, y); if (horiz) c.rotate(horiz === 'L' ? Math.PI / 2 : -Math.PI / 2); c.scale(s, s);
    c.fillStyle = col; c.fillRect(-48, 50, 96, 200);                         // sleeve
    c.fillStyle = SKIN; rrect(c, -42, -44, 84, 100, 16); c.fill();            // fist
    c.fillStyle = SKIN_SH; for (let i = 0; i < 4; i++) c.fillRect(-42, -40 + i * 24, 84, 5);
    c.fillStyle = SKIN_SH; c.fillRect(22, -44, 20, 100);
    c.restore();
  }

  // ---------- views ----------
  function standsSide(c, h, { x0, yFront, sw, shh, px, py, skew, heads = true }) {
    for (let r = ROWS - 1; r >= 0; r--) for (let col = 0; col < COLS; col++) {
      const x = x0 + col * px + r * skew, y = yFront - r * py, red = isRed(0, r, col, h);
      c.fillStyle = red ? RED : (r % 2 ? G4 : G5); c.fillRect(x, y, sw, shh);
      c.fillStyle = red ? '#c22a22' : G3; c.fillRect(x, y + shh * 0.8, sw, shh * 0.2);
      if (heads && !red) { c.fillStyle = G2; c.beginPath(); c.arc(x + sw / 2, y - shh * 0.05, sw * 0.17, 0, 7); c.fill(); c.fillRect(x + sw * 0.28, y + shh * 0.05, sw * 0.44, shh * 0.4); }
    }
  }
  // SC2 trackside
  function trackView(c, t) {
    const tt = Math.min(t, TK), h = hoursAt(t);
    c.fillStyle = CREAM; c.fillRect(0, 0, 1080, 1920);
    c.save();
    L.camera(c, [[T0, [500, 1000, 1.03, -0.08]], [5.5, [600, 1060, 1.1, -0.08]], [TK, [700, 1180, 1.32, -0.1]], [TK + FREEZE, [720, 1230, 1.45, -0.11]]], t);
    c.fillStyle = CREAM; c.fillRect(-800, -800, 2700, 3500);
    c.fillStyle = G6; c.fillRect(-800, -800, 2700, 1380);
    c.fillStyle = INK; c.beginPath(); c.moveTo(-800, 560); c.lineTo(1900, 500); c.lineTo(1900, 580); c.lineTo(-800, 640); c.closePath(); c.fill();
    dial(c, 540, 400, 92, h);
    standsSide(c, h, { x0: -40, yFront: 1080, sw: 104, shh: 78, px: 114, py: 96, skew: 16 });
    c.fillStyle = INK; c.fillRect(-800, 1170, 2700, 62);
    c.fillStyle = TRACK; c.fillRect(-800, 1232, 2700, 1800);
    c.strokeStyle = CREAM; c.lineWidth = 8; for (let i = -3; i < 9; i++) { c.beginPath(); c.moveTo(i * 190, 1232); c.lineTo(i * 190 - 420, 2400); c.stroke(); }
    c.fillStyle = INK; c.beginPath(); c.moveTo(-800, 1500); c.lineTo(1900, 1470); c.lineTo(1900, 1488); c.lineTo(-800, 1518); c.closePath(); c.fill();
    c.fillStyle = CREAM; for (let i = 0; i < 6; i++) { c.beginPath(); const bx = 60 + i * 190; c.moveTo(bx, 1440); c.lineTo(bx + 40, 1440); c.lineTo(bx + 20, 1470); c.fill(); }
    // team baton lying, dusty
    baton(c, 330, 1620, 160, -0.28, false, 0.9);
    c.strokeStyle = G4; c.lineWidth = 4; for (let i = 0; i < 7; i++) { const a = i * 0.9; c.beginPath(); c.moveTo(330 + Math.cos(a) * 110, 1620 + Math.sin(a) * 50); c.lineTo(330 + Math.cos(a) * 128, 1620 + Math.sin(a) * 58); c.stroke(); }
    // gun smoke at the start
    const gs = L.sm(T0, T0 + 0.2, t) * (1 - L.sm(T0 + 0.8, T0 + 1.6, t));
    if (gs > 0) { c.fillStyle = G5; c.globalAlpha = gs; [[80, 1300, 60], [130, 1270, 44], [40, 1260, 36]].forEach(([x, y, r]) => { c.beginPath(); c.arc(x, y, r * (1 + (t - T0) * 0.4), 0, 7); c.fill(); }); c.globalAlpha = 1; }
    // the fan: front row, then vault
    const vj = L.sm(5.45, TK, tt), fx = L.lerp(740, 700, vj), fy = L.lerp(1150, 1430, vj) - Math.sin(vj * Math.PI) * 170;
    figure(c, fx, fy, 1.5, { col: G2, run: vj, phase: tt * 14, armUp: L.sm(5.6, TK, tt), bat: { lit: tt >= 5.6 }, look: -1 });
    c.restore();
    if (t >= 3.95) { c.save(); L.camera(c, [[T0, [500, 1000, 1.03, -0.08]], [5.5, [600, 1060, 1.1, -0.08]], [TK, [700, 1180, 1.32, -0.1]], [TK + FREEZE, [720, 1230, 1.45, -0.11]]], t);
      tag(c, '59 DAYS', 250, 1740, 54, L.sm(3.95, 4.1, t)); c.restore(); }
  }
  // SC1 / SC4 close on the fan
  function closeView(c, t, h, variant) {
    c.fillStyle = CREAM; c.fillRect(0, 0, 1080, 1920);
    c.save();
    const keys = variant === 'hook' ? [[0, [540, 960, 1.0, -0.07]], [1.9, [540, 940, 1.07, -0.07]]]
      : [[12.3, [560, 900, 1.3, -0.09]], [15.9, [600, 880, 1.45, -0.1]]];
    L.camera(c, keys, t);
    c.fillStyle = G6; c.fillRect(-600, -600, 2300, 3200);
    standsSide(c, h, { x0: -260, yFront: 1150, sw: 160, shh: 118, px: 174, py: 150, skew: 34 });
    c.fillStyle = INK; c.fillRect(-600, 1290, 2300, 70);
    c.fillStyle = TRACK; c.fillRect(-600, 1360, 2300, 1500);
    if (variant === 'hook') {
      bigFace(c, 590, 860, 230, 'set', -0.3);
      baton(c, 250, 900, 380, Math.PI / 2 - 0.12, true);
      fist(c, 256, 1010, 1.0, false);
    } else {
      bigFace(c, 620, 860, 230, 'search', -1);
      const reach = L.sm(12.5, 13.6, t);
      baton(c, L.lerp(330, 190, reach), 1150, 380, 0.08, true);
      fist(c, L.lerp(430, 290, reach), 1160, 1.0, true);
    }
    c.restore();
  }
  // SC3 top-down stadium = the world
  const CX = 540, CY = 960, EY = 1.25;
  const P = (a, r) => [CX + Math.cos(a) * r, CY + Math.sin(a) * r * EY];
  const secA = s => Math.PI / 2 + s * (Math.PI * 2 / NS);
  const fanPos = h => { const f = L.clamp((h - KILL) / 2, 0, 1); return P(secA(0) + L.ease.inOut(f) * (Math.PI * 2 / NS) * 0.92, 400); };
  function topView(c, t, keys) {
    const h = hoursAt(t);
    c.fillStyle = CREAM; c.fillRect(0, 0, 1080, 1920);
    c.save(); L.camera(c, keys, t);
    c.fillStyle = CREAM; c.fillRect(-2000, -2000, 5000, 6000);
    // stands
    const span = Math.PI * 2 / NS;
    for (let s = 0; s < NS; s++) for (let r = 0; r < ROWS; r++) for (let col = 0; col < COLS; col++) {
      const a0 = secA(s) - span / 2 + span * 0.06 + (col / COLS) * span * 0.88, a1 = a0 + span * 0.88 / COLS * 0.82;
      const r0 = 450 + r * 30, r1 = r0 + 25; const red = isRed(s, r, col, h);
      c.fillStyle = red ? RED : (r % 2 ? G4 : G5);
      const p1 = P(a0, r0), p2 = P(a1, r0), p3 = P(a1, r1), p4 = P(a0, r1);
      c.beginPath(); c.moveTo(p1[0], p1[1]); c.lineTo(p2[0], p2[1]); c.lineTo(p3[0], p3[1]); c.lineTo(p4[0], p4[1]); c.closePath(); c.fill();
    }
    // outer black rim, track
    c.strokeStyle = INK; c.lineWidth = 22; c.beginPath(); c.ellipse(CX, CY, 648, 648 * EY, 0, 0, 7); c.stroke();
    c.fillStyle = INK; c.beginPath(); c.ellipse(CX, CY, 438, 438 * EY, 0, 0, 7); c.fill();
    c.fillStyle = TRACK; c.beginPath(); c.ellipse(CX, CY, 426, 426 * EY, 0, 0, 7); c.fill();
    c.strokeStyle = CREAM; c.lineWidth = 3; for (let k = 0; k < 5; k++) { const rr = 316 + k * 24; c.beginPath(); c.ellipse(CX, CY, rr, rr * EY, 0, 0, 7); c.stroke(); }
    // infield globe
    c.fillStyle = G6; c.beginPath(); c.ellipse(CX, CY, 300, 300 * EY, 0, 0, 7); c.fill();
    c.strokeStyle = G4; c.lineWidth = 4; for (let k = 1; k < 4; k++) { c.beginPath(); c.ellipse(CX, CY, 300 * k / 4, 300 * EY, 0, 0, 7); c.stroke(); c.beginPath(); c.moveTo(CX - 300, CY + (k - 2) * 170); c.lineTo(CX + 300, CY + (k - 2) * 170); c.stroke(); }
    c.fillStyle = INK; c.beginPath(); c.moveTo(CX - 300, CY + 90); c.lineTo(CX + 300, CY - 150); c.lineTo(CX + 300, CY - 110); c.lineTo(CX - 300, CY + 130); c.closePath(); c.fill();
    // lanes: baton at each exchange zone; connects when its organisation arrives
    lanes.forEach(ln => {
      const a = secA(ln.i) + (Math.PI * 2 / NS) * 0.35, [bx, by] = P(a, 360), on = h >= ln.hum;
      c.fillStyle = CREAM; c.fillRect(bx - 34, by - 4, 68, 8);
      if (on) { const k = L.sm(0, 0.8, h - ln.hum); c.strokeStyle = GREEN; c.lineWidth = 7; c.globalAlpha = k;
        c.beginPath(); c.moveTo(bx, by); c.lineTo(L.lerp(bx, CX, 0.72 * k), L.lerp(by, CY, 0.72 * k)); c.stroke(); c.globalAlpha = 1;
        c.fillStyle = G1; c.beginPath(); c.arc(bx + 26, by - 24, 15, 0, 7); c.fill(); }
      baton(c, bx, by, 56, a + Math.PI / 2, on, 1);
    });
    // assembled core grows with the share of connected lanes
    const conn = lanes.filter(ln => h >= ln.hum).length / NS;
    if (conn > 0) { c.fillStyle = GREEN; c.beginPath(); c.ellipse(CX, CY, 20 + conn * 70, (20 + conn * 70) * EY, 0, 0, 7); c.fill(); }
    // the fan
    if (h >= KILL) { const [fx, fy] = fanPos(h); c.fillStyle = 'rgba(52,210,123,0.3)'; c.beginPath(); c.arc(fx, fy, 30, 0, 7); c.fill();
      c.fillStyle = G1; c.beginPath(); c.arc(fx, fy, 15, 0, 7); c.fill(); baton(c, fx + 20, fy - 8, 34, 0.5, true); }
    c.restore();
  }
  // SC6 snap panels
  const AX0 = 130, AX1 = 950, HMAX = 168, ax = h => AX0 + (AX1 - AX0) * Math.min(h, HMAX) / HMAX;
  function panel(c, y0, title, key, sweepH, a, green) {
    c.save(); c.globalAlpha *= a;
    c.fillStyle = CREAM; c.fillRect(70, y0, 940, 430); c.strokeStyle = INK; c.lineWidth = 8; c.strokeRect(70, y0, 940, 430);
    c.fillStyle = INK; c.fillRect(70, y0, 940, 72);
    c.font = `46px "${SERIF}"`; c.fillStyle = CREAM; c.textAlign = 'left'; c.fillText(title, 100, y0 + 52);
    if (green) { c.font = `48px "${HAND}"`; c.fillStyle = GREEN; c.textAlign = 'right'; c.fillText('ILLUSTRATIVE', 985, y0 + 52); }
    const base = y0 + 340;
    // red area 0..24 h (fit), revealed with the sweep
    c.fillStyle = RED; c.beginPath(); c.moveTo(ax(0), base);
    for (let hh = 0; hh <= Math.min(END, sweepH); hh += 0.25) c.lineTo(ax(hh), base - 170 * share(hh)); c.lineTo(ax(Math.min(END, sweepH)), base); c.closePath(); c.fill();
    // axis
    c.fillStyle = INK; c.fillRect(AX0, base, AX1 - AX0, 8);
    c.font = `40px "${HAND}"`; c.fillStyle = G1; c.textAlign = 'left'; c.fillText('the gun', AX0 - 20, base + 56); c.textAlign = 'right'; c.fillText('one week', AX1 + 20, base + 56);
    // pips (stacked)
    const stacks = {};
    lanes.slice().sort((p, q) => p[key] - q[key]).forEach(ln => {
      const hv = ln[key]; if (hv > sweepH) return; const x = hv > HMAX ? AX1 + 6 : ax(hv), bin = Math.round(x / 22);
      const n = stacks[bin] = (stacks[bin] || 0) + 1; c.fillStyle = GREEN; c.fillRect(x - 9, base - 22 - (n - 1) * 26, 18, 20);
    });
    // left arrow: where the baton was before the gun
    c.fillStyle = GREEN; c.beginPath(); c.moveTo(AX0 - 50, base - 250); c.lineTo(AX0 - 20, base - 270); c.lineTo(AX0 - 20, base - 230); c.closePath(); c.fill();
    c.fillRect(AX0 - 22, base - 256, 70, 12);
    c.font = `42px "${HAND}"`; c.fillStyle = G1; c.textAlign = 'left'; c.fillText(green ? 'baton routed before the gun' : 'baton sat 59 days', AX0 + 62, base - 236);
    if (!green && sweepH > KILL) { c.fillStyle = INK; c.fillRect(ax(KILL) + 4, base - 150, 60, 5); c.font = `40px "${HAND}"`; c.textAlign = 'left'; c.fillText('one fan', ax(KILL) + 74, base - 136); }
    if (sweepH < HMAX) { c.fillStyle = INK; c.fillRect(ax(sweepH) - 3, base - 200, 6, 210); }
    c.restore();
  }
  function hands(c, t) {
    c.fillStyle = CREAM; c.fillRect(0, 0, 1080, 1920);
    c.save(); L.camera(c, [[25.8, [540, 960, 1.0, -0.1]], [31.8, [540, 960, 1.14, -0.12]]], t);
    c.fillStyle = G6; c.fillRect(-600, -600, 2300, 3200);
    c.fillStyle = INK; c.beginPath(); c.moveTo(-600, 1420); c.lineTo(1700, 1180); c.lineTo(1700, 1300); c.lineTo(-600, 1540); c.closePath(); c.fill();
    c.fillStyle = RED; c.beginPath(); c.moveTo(-600, 1560); c.lineTo(1700, 1320); c.lineTo(1700, 1400); c.lineTo(-600, 1640); c.closePath(); c.fill();
    const k = L.sm(25.9, 27.1, t), give = L.sm(27.0, 27.6, t);
    const bx = L.lerp(480, 560, give);
    // green line: the routing (AI) finds the second hand
    c.strokeStyle = GREEN; c.lineWidth = 6; c.setLineDash([22, 18]); c.globalAlpha = 1 - give;
    c.beginPath(); c.moveTo(bx + 200, 960); c.quadraticCurveTo(900, 700, L.lerp(1300, 820, k), 960); c.stroke(); c.setLineDash([]); c.globalAlpha = 1;
    baton(c, bx, 960, 460, -0.05, true);
    fist(c, bx - 150, 972, 1.1, 'L', G2);                       // the fan's hand, from the left
    fist(c, L.lerp(1400, bx + 160, k) , 948, 1.1, true, G4);    // the next runner's hand, from the right
    c.restore();
  }

  // ---------- draw ----------
  function draw(ctx, t) {
    ctx.fillStyle = CREAM; ctx.fillRect(0, 0, 1080, 1920);
    const craneKeys = [[TK + FREEZE, [fanPos(KILL)[0], fanPos(KILL)[1], 4.2, -0.35]], [11.5, [540, 960, 0.8, -0.12]], [12.5, [...fanPos(END).slice(0, 2), 5.5, -0.2]]];
    if (t < 1.9) {
      closeView(ctx, t, END, 'hook');
      caption(ctx, "AND WE'RE LIVE.", 330, 1, { size: 92 });
      tag(ctx, 'END OF DAY ONE', 110, 470, 46, 1);
      L.slate(ctx, 'SC1  CLOSE  flash-forward');
    } else if (t < T0) {
      closeView(ctx, 1.9, END, 'hook');
      const w = L.sm(1.9, 2.2, t);
      ctx.save(); ctx.translate(540, 960); ctx.rotate(-0.35); ctx.fillStyle = INK; ctx.fillRect(-1400, -1300 + w * 0, 2800, 2600 * w); ctx.restore();
      if (w > 0.3) caption(ctx, 'REWIND', 960, 1, { size: 120, bg: CREAM, col: INK });
      L.slate(ctx, 'WIPE');
    } else if (t < TK + FREEZE) {
      trackView(ctx, t);
      caption(ctx, "Hour zero. Red's off the line.", 280, capA(t, 2.4, 3.9));
      caption(ctx, 'Team baton: here 59 days.', 280, capA(t, 3.95, 5.45));
      caption(ctx, "HE'S ON THE TRACK!", 280, capA(t, 5.5, TK + FREEZE), { size: 92 });
      if (t >= TK) { const p = L.sm(TK, TK + 0.12, t); ctx.fillStyle = `rgba(255,253,247,${(0.5 * (1 - L.sm(TK, TK + 0.25, t))).toFixed(2)})`; ctx.fillRect(0, 0, 1080, 1920);
        ctx.save(); ctx.translate(560, 560); ctx.rotate(-0.12); ctx.scale(L.lerp(1.6, 1, p), L.lerp(1.6, 1, p)); tag(ctx, 'HOUR 7.3', -150, 30, 96, p); ctx.restore(); }
      L.slate(ctx, t < TK ? 'SC2  TRACKSIDE  DOLLY' : 'SC2  FREEZE  PUSH IN');
    } else if (t < 12.5) {
      topView(ctx, t, craneKeys);
      if (t < TK + FREEZE + 0.4) { const f = L.sm(TK + FREEZE, TK + FREEZE + 0.4, t); la.setTransform(1, 0, 0, 1, 0, 0); trackView(la, TK + FREEZE - 0.001);
        ctx.save(); ctx.globalAlpha = 1 - f; ctx.drawImage(layerA, 0, 0); ctx.restore(); }
      caption(ctx, 'One person. Partly luck.', 280, capA(t, 7.0, 8.5));
      caption(ctx, 'Every lane had a baton.', 280, capA(t, 8.55, 10.0));
      caption(ctx, 'Rest of the team: 59 days late.', 280, capA(t, 10.05, 11.5));
      L.slate(ctx, t < 11.5 ? 'SC3  WIDE  CRANE UP' : 'SC4  DROP DOWN');
    } else if (t < 15.9) {
      const h = hoursAt(t);
      closeView(ctx, t, h, 'close');
      if (t < 12.8) { const f = L.sm(12.5, 12.8, t); lb.setTransform(1, 0, 0, 1, 0, 0); topView(lb, 12.499, craneKeys);
        ctx.save(); ctx.globalAlpha = 1 - f; ctx.drawImage(layerB, 0, 0); ctx.restore(); }
      const out = L.sm(TEND, TEND + 0.35, t);
      if (out > 0) { ctx.fillStyle = `rgba(22,21,20,${(0.72 * out).toFixed(3)})`; ctx.fillRect(0, 0, 1080, 1920); }
      caption(ctx, 'Nobody to hand it to.', 1420, capA(t, 12.8, 14.6));
      L.slate(ctx, 'SC4  CLOSE+  PUSH IN');
    } else if (t < 18.3) {
      closeView(ctx, 15.9, END, 'close');
      ctx.fillStyle = 'rgba(22,21,20,0.78)'; ctx.fillRect(0, 0, 1080, 1920);
      tag(ctx, 'INSTANT REPLAY', 110, 300, 52, L.sm(15.9, 16.1, t), INK, CREAM);
      const a = L.sm(16.0, 16.3, t) * (1 - L.sm(18.0, 18.3, t));
      L.title(ctx, ['We slowed it down', 'so you could see it.'], 860, 100, { alpha: a });
      L.slate(ctx, 'SC5  REPLAY  LOCKED');
    } else if (t < 25.8) {
      ctx.fillStyle = G6; ctx.fillRect(0, 0, 1080, 1920);
      ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(0, 1560); ctx.lineTo(1080, 1440); ctx.lineTo(1080, 1920); ctx.lineTo(0, 1920); ctx.closePath(); ctx.fill();
      const inA = L.sm(18.3, 18.5, t), sw = L.lerp(0, HMAX * 4, L.clamp((t - 18.9) / 3.0, 0, 1));
      L.label(ctx, 'TRUE PROPORTIONS', 490, 300, 64, { font: SERIF, col: INK, alpha: inA });
      L.label(ctx, 'hour 0 to one week, same axis', 490, 360, 42, { col: G1, alpha: inA });
      panel(ctx, 430, 'AS IT HAPPENED', 'hum', Math.min(sw, t > 21.9 ? 1e9 : sw), inA, false);
      panel(ctx, 900, 'ROUTED', 'ai', Math.min(sw, t > 21.9 ? 1e9 : sw), inA, true);
      caption(ctx, 'Same batons. Faster handoffs.', 1440, capA(t, 21.9, 23.65));
      caption(ctx, 'Illustrative. Not a promise.', 1440, capA(t, 23.7, 25.8));
      L.slate(ctx, 'SC6  SNAP  LOCKED WIDE');
    } else if (t < 31.8) {
      hands(ctx, t);
      caption(ctx, 'AI finds the hand. People run.', 330, capA(t, 25.9, 28.4));
      if (t > 28.5) L.title(ctx, ['This is the bottleneck.'], 420, 96, { alpha: L.sm(28.6, 28.9, t) });
      L.slate(ctx, 'SC7  EXTREME CLOSE  PUSH IN');
    } else {
      hands(ctx, 31.8);
      L.endCard(ctx, L.sm(31.8, 32.2, t));
    }
    L.grain(ctx, t, { alpha: 0.05, n: 500 });
  }

  return {
    draw, DUR,
    acts: [{ start: 0, end: T0, bpm: 0, drone: true }, { start: T0, end: TK, bpm: 150 }, { start: TK + FREEZE, end: TEND, bpm: 160 },
      { start: T0, end: TEND, bpm: 0, drone: true }, { start: 15.9, end: 17.9, bpm: 0, drone: true }, { start: 18.3, end: 25.8, bpm: 0, drone: true },
      { start: 25.8, end: DUR, bpm: 0, drone: true }],
    cues: [{ t: 1.9, type: 'whoosh' }, { t: T0, type: 'bonk' }, { t: TK, type: 'stamp' }, { t: TK + FREEZE, type: 'whoosh' }, { t: 11.5, type: 'whoosh' },
      { t: 18.3, type: 'hit' }, { t: 27.1, type: 'pop' }],
  };
}
if (typeof module !== 'undefined') module.exports = makeScene;
