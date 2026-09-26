// day-three-hundred-five: reverse-chronology, children's-book flat, weather/fluids. Analog: heatwave-2003.
// Rewind mapping: log time played backward at a constant rate (day 305 -> 12 over t 3.0-9.9, hold, 12 -> 1 over 11.2-16.5).
// Red = heat intensity h(d) (INTERPOLATED from the analog's sourced shape; the analog gives only endpoints) and
// cumulative loss E(d) = running integral of h(d-0.5)^2 normalized at the analog's day-19 endpoint (drives dark windows, symbolic).
// Green = link join days from a two-sided lognormal fitted to the analog's p10 / median / p90 (9.5 / 12 / 305).
// AI snap = ai_counterfactual.aggregation_median (3) with the same shape scaled by 3/12, labeled illustrative.
// Snap A: 305 days linear in 2.0 s. Snap B: days 0-19 linear in 3.6 s, same clock in both lanes. See output/day-three-hundred-five/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('heatwave-2003');
  const DUR = 40, RED = L.RED, GREEN = L.GREEN;
  const INK = '#2e2c2f', PAPER = '#e7dfd2', SKY = '#cbc5bc', CREAM = '#f2e5c9', DARKW = '#3a3c43', STREET = '#8e8981', WALK = '#aaa399';
  const FAC = ['#8f877e', '#9b938a', '#847d76', '#a0978d', '#8a837b', '#958d84', '#7f7973'];
  const SKIN = '#c6b6a3', SKIN2 = '#a99a8a', SLEEVE = '#77787f', MAN = '#9d958c';
  const rgbaRed = a => `rgba(255,59,48,${a})`, rgbaGreen = a => `rgba(52,210,123,${a})`;

  // ---------- data ----------
  const F = {}; A.solution.fragments.forEach(f => F[f.id] = f.ready_at);
  const D305 = F.f5, D12 = F.f4, DEND = A.threat.points[A.threat.points.length - 1].t; // 305, 12, 19
  const PEAK = A.threat.events.find(e => e.t === 11).t, HEAT_END = 14.5; // heat ends day 14 (Aug 15); interpolation ends at 14.5
  // Heat intensity h(d): MY INTERPOLATION of the sourced shape (begins d1, peaks d11, ends d14), smoothed +-0.5 day.
  const HK = [[0, 0], [2, 0.55], [PEAK, 1], [HEAT_END, 0]];
  const hRaw = d => { if (d <= 0 || d >= HEAT_END) return 0; for (let i = 0; i < HK.length - 1; i++) if (d <= HK[i + 1][0]) return L.lerp(HK[i][1], HK[i + 1][1], (d - HK[i][0]) / (HK[i + 1][0] - HK[i][0])); return 0; };
  const h = d => { let s = 0; for (let k = -4; k <= 4; k++) s += hRaw(d + k * 0.125); return s / 9; };
  const ES = 0.05, ET = [0]; let acc = 0;
  for (let d = ES; d <= DEND + 1e-9; d += ES) { acc += Math.pow(h(d - 0.5), 2) * ES; ET.push(acc); }
  const ENORM = acc;
  const E = d => { if (d <= 0) return 0; if (d >= DEND) return 1; const i = d / ES, k = Math.floor(i); return L.lerp(ET[k], ET[Math.min(k + 1, ET.length - 1)], i - k) / ENORM; };

  // Human aggregation: two-sided lognormal (p10 below the median, p90 above).
  const AG = A.solution.aggregation, MED = AG.median, P10 = AG.p10, P90 = AG.p90;
  const SLO = Math.log(MED / P10) / 1.2816, SHI = Math.log(P90 / MED) / 1.2816;
  const zOf = q => { let lo = -8, hi = 8; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; (0.5 * (1 + L.erf(m / Math.SQRT2)) < q) ? lo = m : hi = m; } return (lo + hi) / 2; };
  const hq = q => { const z = zOf(q); return MED * Math.exp(z * (z < 0 ? SLO : SHI)); };
  const AIMED = A.ai_counterfactual.aggregation_median, aq = q => hq(q) * AIMED / MED;

  // ---------- one stated time mapping for the rewind ----------
  const lg = Math.log10;
  const dayAt = t => {
    if (t < 3) return D305;
    if (t < 9.9) return Math.pow(10, L.lerp(lg(D305), lg(D12), (t - 3) / 6.9));
    if (t < 11.2) return D12;
    if (t < 16.5) return Math.pow(10, L.lerp(lg(D12), 0, (t - 11.2) / 5.3));
    return 1;
  };

  // ---------- helpers ----------
  const rr = (c, x, y, w, h2, r) => { c.beginPath(); c.roundRect(x, y, w, h2, r); };
  const fade = (t, a, b, f = 0.3) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));
  function card(c, lines, y, size, a, { col = '#fffdf7', stroke = INK } = {}) {
    if (a <= 0.001) return; c.save(); c.globalAlpha = a; c.textAlign = 'center'; let yy = y;
    lines.forEach((l, i) => { const o = typeof l === 'string' ? { text: l } : l; let fz = o.size || size; c.font = `${fz}px "${SERIF}"`;
      while (c.measureText(o.text).width > 780 && fz > 30) { fz -= 4; c.font = `${fz}px "${SERIF}"`; }
      if (i) yy += fz * 1.06; c.lineJoin = 'round'; c.lineWidth = fz * 0.16; c.strokeStyle = stroke; c.strokeText(o.text, 490, yy);
      c.fillStyle = o.col || col; c.fillText(o.text, 490, yy); });
    c.restore();
  }
  function tag(c, text, x, y, size, a, { col = '#fffdf7', stroke = INK, align = 'center' } = {}) {
    if (a <= 0.001) return; c.save(); c.globalAlpha = a; c.font = `${size}px "${HAND}"`; const w = c.measureText(text).width;
    let cx = align === 'left' ? x + w / 2 : align === 'right' ? x - w / 2 : x; cx = L.clamp(cx, 80 + w / 2, 900 - w / 2);
    c.textAlign = 'center'; c.lineJoin = 'round'; if (stroke) { c.lineWidth = size * 0.18; c.strokeStyle = stroke; c.strokeText(text, cx, y); }
    c.fillStyle = col; c.fillText(text, cx, y); c.restore();
  }
  function slate(c, s) { c.save(); c.fillStyle = 'rgba(46,44,47,0.55)'; c.fillRect(40, 1818, 560, 58); c.restore(); L.slate(c, s); }
  // flat puzzle piece, soft glow
  function piece(c, x, y, s, a = 1, rot = 0, lit = 1) {
    if (a <= 0.001) return; c.save(); c.globalAlpha *= a; c.translate(x, y); c.rotate(rot);
    if (lit > 0) { const g = c.createRadialGradient(0, 0, 0, 0, 0, s * 1.6); g.addColorStop(0, rgbaGreen(0.45 * lit)); g.addColorStop(1, rgbaGreen(0)); c.fillStyle = g; c.beginPath(); c.arc(0, 0, s * 1.6, 0, 7); c.fill(); }
    const hs = s / 2, k = s * 0.17;
    c.beginPath(); c.moveTo(-hs, -hs); c.lineTo(-k, -hs); c.arc(0, -hs, k, Math.PI, 0, false); c.lineTo(hs, -hs); c.lineTo(hs, -k); c.arc(hs, 0, k, -Math.PI / 2, Math.PI / 2, false);
    c.lineTo(hs, hs); c.lineTo(-hs, hs); c.closePath();
    c.fillStyle = 'rgba(40,60,50,0.25)'; c.save(); c.translate(s * 0.07, s * 0.07); c.fill(); c.restore();
    c.fillStyle = GREEN; c.fill(); c.fillStyle = 'rgba(255,255,255,0.18)'; rr(c, -hs + s * 0.1, -hs + s * 0.1, s * 0.3, s * 0.14, s * 0.07); c.fill();
    c.restore();
  }
  // bean person (flat, dot eyes)
  function bean(c, x, y, s, { col = MAN, mood = 'calm', look = [0, 0], a = 1 } = {}) {
    if (a <= 0.001) return; c.save(); c.globalAlpha *= a; const bw = 46 * s, bh = 62 * s;
    c.fillStyle = 'rgba(40,36,34,0.22)'; rr(c, x - bw / 2 + 5 * s, y - bh / 2 + 5 * s, bw, bh, bw / 2); c.fill();
    c.fillStyle = col; rr(c, x - bw / 2, y - bh / 2, bw, bh, bw / 2); c.fill();
    const ey = y - bh * 0.14; c.fillStyle = INK;
    [-1, 1].forEach(sd => { c.beginPath(); c.arc(x + sd * bw * 0.19 + look[0] * 2.5 * s, ey + look[1] * 2.5 * s, 3.4 * s, 0, 7); c.fill(); });
    c.strokeStyle = INK; c.lineWidth = 2.4 * s; c.lineCap = 'round'; c.beginPath();
    if (mood === 'sad') c.arc(x, y + bh * 0.2, bw * 0.12, 1.2 * Math.PI, 1.8 * Math.PI); else if (mood === 'happy') c.arc(x, y + bh * 0.06, bw * 0.13, 0.2 * Math.PI, 0.8 * Math.PI); else { c.moveTo(x - bw * 0.1, y + bh * 0.12); c.lineTo(x + bw * 0.1, y + bh * 0.12); }
    c.stroke(); c.fillStyle = 'rgba(210,150,140,0.35)'; [-1, 1].forEach(sd => { c.beginPath(); c.arc(x + sd * bw * 0.3, y + bh * 0.04, 4.5 * s, 0, 7); c.fill(); });
    c.restore();
  }
  // POV hand from lower left, holding something at (px,py)
  function hand(c, px, py, s, a, { rot = -0.5, col = SKIN, sleeve = SLEEVE } = {}) {
    if (a <= 0.001) return; c.save(); c.globalAlpha *= a; c.translate(px, py); c.rotate(rot); c.scale(s, s);
    c.fillStyle = 'rgba(40,36,34,0.2)'; rr(c, -60 + 10, 30 + 10, 120, 700, 60); c.fill();
    c.fillStyle = sleeve; rr(c, -72, 190, 144, 700, 60); c.fill();
    c.fillStyle = col; rr(c, -58, 30, 116, 200, 55); c.fill();
    rr(c, -70, -10, 140, 110, 50); c.fill();
    c.restore();
  }
  function fingers(c, px, py, s, a, { rot = -0.5, col = SKIN } = {}) {
    if (a <= 0.001) return; c.save(); c.globalAlpha *= a; c.translate(px, py); c.rotate(rot); c.scale(s, s);
    c.fillStyle = SKIN2; [-45, -15, 15].forEach((fx, i) => { rr(c, fx - 14 + 3, -40 + 4, 30, 62, 15); c.fill(); });
    c.fillStyle = col; [-45, -15, 15].forEach((fx, i) => { rr(c, fx - 14, -40 - (i === 1 ? 6 : 0), 30, 62, 15); c.fill(); });
    c.save(); c.translate(56, 30); c.rotate(-0.9); rr(c, -16, -50, 32, 70, 16); c.fill(); c.restore();
    c.restore();
  }

  // ---------- world: one block, her window at the center ----------
  const wr = L.rng(305);
  const TOPS = [-420, -150, -600, -300, -500, -80, -350];
  const B = TOPS.map((top, i) => ({ c: 540 + (i - 3) * 315, top: top + Math.round((wr() - 0.5) * 60), col: FAC[i] }));
  const GROUND = 1420, HERW = { x: 540, y: 1270, w: 180, h: 220 };
  const wins = [];
  B.forEach((b, bi) => { for (let y = b.top + 110; y <= 1300; y += 135) {
    if (bi === 3 && y > 1120) continue; if ((bi === 4 || bi === 5) && y > 1200) continue;
    [-90, 0, 90].forEach(dx => wins.push({ x: b.c + dx, y, bi, dark: null, nb: false }));
  } });
  // six symbolic dark windows (hers is one), thresholds E = (i+0.5)/6
  const HER_I = 2; const cand = wins.map((w, i) => i).filter(i => wins[i].y > -700);
  const darkIdx = []; while (darkIdx.length < 5) { const k = cand[Math.floor(wr() * cand.length)]; if (!darkIdx.includes(k)) darkIdx.push(k); }
  const THR = [0, 1, 2, 3, 4, 5].map(i => (i + 0.5) / 6);
  let ti = 0; darkIdx.forEach(k => { if (ti === HER_I) ti++; wins[k].dark = THR[ti++]; });
  const HER_THR = THR[HER_I];
  // neighbors in lit windows (link endpoints)
  const nbIdx = []; while (nbIdx.length < 8) { const k = cand[Math.floor(wr() * cand.length)]; if (!nbIdx.includes(k) && wins[k].dark === null) { nbIdx.push(k); wins[k].nb = true; } }
  const HER = { x: 400, y: 1478 }; // her, on the sidewalk under the window
  const HOLD = { fore: { x: B[2].c, y: B[2].top - 150 }, doc: { x: B[4].c, y: 1300 }, hosp: { x: B[5].c, y: B[5].top + 60 }, her: { x: HER.x + 40, y: HER.y - 40 } };
  const nodes = [HOLD.her, HOLD.fore, HOLD.doc, HOLD.hosp, ...nbIdx.map(k => ({ x: wins[k].x, y: wins[k].y }))];
  // 12 links at quantiles (i+0.5)/12 of the human distribution; > day 305 never drawn. Plus two fixed, dated links.
  const links = [];
  for (let i = 0; i < 12; i++) { let a = Math.floor(wr() * nodes.length), b = Math.floor(wr() * nodes.length); if (a === b) b = (b + 3) % nodes.length; links.push({ a: nodes[a], b: nodes[b], day: hq((i + 0.5) / 12) }); }
  links.push({ a: HOLD.hosp, b: HOLD.doc, day: D12 }, { a: HOLD.fore, b: HOLD.hosp, day: D305 });

  function drawWin(c, w, day) {
    const dark = w.dark !== null && E(day) >= w.dark;
    c.fillStyle = 'rgba(40,36,34,0.2)'; rr(c, w.x - 28 + 6, w.y - 40 + 6, 56, 80, 10); c.fill();
    c.fillStyle = dark ? DARKW : CREAM; rr(c, w.x - 28, w.y - 40, 56, 80, 10); c.fill();
    if (w.nb && !dark) { c.fillStyle = '#8f877e'; c.beginPath(); c.arc(w.x, w.y + 12, 15, Math.PI, 0); c.fill(); rr(c, w.x - 15, w.y + 10, 30, 30, 4); c.fill(); }
  }
  function herWindow(c, day, t, lit) {
    const { x, y, w, h: hh } = HERW;
    c.fillStyle = 'rgba(40,36,34,0.25)'; rr(c, x - w / 2 + 10, y - hh / 2 + 10, w, hh, 18); c.fill();
    c.fillStyle = '#6c665f'; rr(c, x - w / 2 - 12, y - hh / 2 - 12, w + 24, hh + 24, 22); c.fill();
    c.fillStyle = lit ? CREAM : DARKW; rr(c, x - w / 2, y - hh / 2, w, hh, 16); c.fill();
    c.save(); rr(c, x - w / 2, y - hh / 2, w, hh, 16); c.clip();
    if (lit) { const g = c.createRadialGradient(x + 50, y - 60, 0, x + 50, y - 60, 140); g.addColorStop(0, 'rgba(255,248,225,0.9)'); g.addColorStop(1, 'rgba(255,248,225,0)'); c.fillStyle = g; c.fillRect(x - 100, y - 120, 200, 240); }
    // lamp
    c.fillStyle = lit ? '#b3a896' : '#45474e'; c.fillRect(x + 56, y - 40, 4, 120); c.beginPath(); c.moveTo(x + 40, y - 40); c.lineTo(x + 76, y - 40); c.lineTo(x + 68, y - 66); c.lineTo(x + 48, y - 66); c.closePath(); c.fill();
    // chair
    const cc = lit ? '#7b7169' : '#4a4c53';
    c.fillStyle = cc; rr(c, x - 60, y - 30, 90, 110, 24); c.fill(); rr(c, x - 72, y + 40, 114, 40, 14); c.fill();
    if (lit) { const br = 1 + 0.015 * Math.sin(t * 2.2); bean(c, x - 15, y + 22 - 3 * br, 1.05 * br, { col: MAN, mood: 'calm', look: [-0.6, 0.4] }); }
    // sill
    c.restore();
    c.fillStyle = '#6c665f'; rr(c, x - w / 2 - 22, y + hh / 2 + 4, w + 44, 16, 6); c.fill();
    // window cross
    c.fillStyle = '#6c665f'; c.fillRect(x - 3, y - hh / 2, 6, hh); c.fillRect(x - w / 2, y - 22, w, 6);
  }
  function drawWorld(c, day, t, z) {
    const hv = h(day);
    c.fillStyle = SKY; c.fillRect(-2000, -3200, 5200, 4700);
    // clouds (flat)
    c.fillStyle = 'rgba(255,255,255,0.25)'; [[-200, -1300, 260], [1200, -1500, 300], [300, -1700, 220]].forEach(([cx, cy, r]) => { rr(c, cx - r, cy - r * 0.3, r * 2, r * 0.6, r * 0.3); c.fill(); });
    // red sun rises with h (heat returns in reverse)
    if (hv > 0.005) {
      const sy = L.lerp(-250, -1150, Math.min(1, hv / 0.8)), sx = 780, sr = 120 + 90 * hv;
      const g = c.createRadialGradient(sx, sy, sr * 0.6, sx, sy, sr * 5); g.addColorStop(0, rgbaRed(0.45 * hv)); g.addColorStop(1, rgbaRed(0)); c.fillStyle = g; c.fillRect(sx - sr * 5, sy - sr * 5, sr * 10, sr * 10);
      c.fillStyle = rgbaRed(Math.min(1, hv * 2.5)); c.beginPath(); c.arc(sx, sy, sr, 0, 7); c.fill();
    }
    // buildings
    B.forEach(b => { c.fillStyle = 'rgba(40,36,34,0.22)'; rr(c, b.c - 150 + 14, b.top + 14, 300, GROUND - b.top, 26); c.fill(); c.fillStyle = b.col; rr(c, b.c - 150, b.top, 300, GROUND - b.top + 40, 26); c.fill(); });
    // forecasters' mast, clinic, hospital sign
    const f = HOLD.fore; c.fillStyle = '#6c665f'; c.fillRect(f.x - 5, f.y, 10, 150); rr(c, f.x - 60, f.y - 30, 120, 16, 8); c.fill(); c.beginPath(); c.arc(f.x - 60, f.y - 22, 18, 0, 7); c.arc(f.x + 60, f.y - 22, 18, 0, 7); c.fill();
    c.fillStyle = '#6c665f'; rr(c, B[4].c - 80, 1230, 160, 190, 18); c.fill(); c.fillStyle = CREAM; rr(c, B[4].c - 22, 1160, 44, 44, 8); c.fill(); c.fillStyle = '#6c665f'; c.fillRect(B[4].c - 4, 1166, 8, 32); c.fillRect(B[4].c - 16, 1178, 32, 8);
    c.fillStyle = CREAM; rr(c, B[5].c - 40, B[5].top + 20, 80, 80, 12); c.fill(); c.fillStyle = '#6c665f'; c.font = `70px "${SERIF}"`; c.textAlign = 'center'; c.fillText('H', B[5].c, B[5].top + 85);
    c.fillStyle = '#6c665f'; rr(c, B[5].c - 90, 1240, 180, 180, 18); c.fill();
    wins.forEach(w => drawWin(c, w, day));
    herWindow(c, day, t, E(day) < HER_THR);
    // street
    c.fillStyle = WALK; c.fillRect(-2000, GROUND, 5200, 110); c.fillStyle = STREET; c.fillRect(-2000, GROUND + 110, 5200, 900);
    c.fillStyle = 'rgba(255,255,255,0.18)'; for (let x = -1800; x < 3000; x += 240) c.fillRect(x, GROUND + 300, 120, 14);
    // links: present only after their join day (rewinding: they vanish as we pass it)
    links.forEach(l => { if (l.day > D305) return; const a = L.clamp((lg(day) - lg(l.day)) / 0.03, 0, 1); if (a <= 0) return;
      const za = 1 - 0.85 * L.sm(1.2, 2.2, z); c.strokeStyle = rgbaGreen(0.85 * a * za); c.lineWidth = 5 / z; c.lineCap = 'round'; c.beginPath(); c.moveTo(l.a.x, l.a.y); c.lineTo(l.b.x, l.b.y); c.stroke(); });
    // her (visible when camera is wide)
    const hA = 1 - L.sm(1.4, 2.2, z);
    bean(c, HER.x, HER.y, 1.3, { col: '#a79d92', mood: day <= 1.001 ? 'calm' : 'sad', look: [0.6, -0.6], a: hA });
  }

  // ---------- camera ----------
  const CAM = [[0, [540, 1270, 3.0]], [3.0, [540, 1270, 3.0]], [8.9, [540, 1150, 1.3]], [10.2, [540, 250, 0.5]], [13.5, [540, 250, 0.5]], [16.5, [540, 1275, 4.2]], [22.6, [540, 1275, 4.5]]];
  const camAt = t => L.key(CAM, t);
  const proj = (p, cam) => [(p.x - cam[0]) * cam[2] + 540, (p.y - cam[1]) * cam[2] + 960];

  // particles (reverse seasons): snow while the rewind passes winter, leaves while it passes autumn
  const pr = L.rng(12); const parts = []; for (let i = 0; i < 70; i++) parts.push({ x: pr() * 1080, y: pr() * 1920, v: 120 + pr() * 160, s: 6 + pr() * 10, ph: pr() * 6.28 });
  function particles(c, t, day) {
    const snow = L.sm(115, 125, day) * (1 - L.sm(205, 218, day)), leaf = L.sm(55, 64, day) * (1 - L.sm(116, 126, day));
    if (snow + leaf < 0.01) return;
    parts.forEach((p, i) => { const y = ((p.y - p.v * t) % 1920 + 1920) % 1920, x = p.x + Math.sin(t * 1.3 + p.ph) * 20;
      if (snow > 0.01) { c.fillStyle = `rgba(250,248,244,${0.85 * snow})`; c.beginPath(); c.arc(x, y, p.s * 0.6, 0, 7); c.fill(); }
      if (leaf > 0.01 && i % 2 === 0) { c.save(); c.translate(x, y); c.rotate(t * 2 + p.ph); c.fillStyle = `rgba(160,140,115,${0.9 * leaf})`; c.beginPath(); c.ellipse(0, 0, p.s, p.s * 0.5, 0, 0, 7); c.fill(); c.restore(); } });
  }
  // rewind strip: log scale, day 1 at left, day 305 at right
  function strip(c, day, a) {
    if (a <= 0.001) return; c.save(); c.globalAlpha = a; const x0 = 110, x1 = 870, y = 1400;
    c.fillStyle = 'rgba(46,44,47,0.55)'; rr(c, x0 - 30, y - 50, x1 - x0 + 60, 120, 24); c.fill();
    c.fillStyle = '#d9d2c6'; rr(c, x0, y - 4, x1 - x0, 8, 4); c.fill();
    const px = x0 + (x1 - x0) * lg(day) / lg(D305);
    c.fillStyle = '#fffdf7'; c.beginPath(); c.moveTo(px, y - 26); c.lineTo(px - 14, y - 44); c.lineTo(px + 14, y - 44); c.closePath(); c.fill(); rr(c, px - 3, y - 26, 6, 40, 3); c.fill();
    c.restore();
    tag(c, 'first morning', x0 - 20, y + 52, 40, a * 0.9, { align: 'left', stroke: null, col: '#e7e0d4' });
    tag(c, 'log time', x1 + 20, y + 52, 40, a * 0.9, { align: 'right', stroke: null, col: '#e7e0d4' });
  }
  function rewindIcon(c, a) { if (a <= 0.001) return; c.save(); c.globalAlpha = a; c.fillStyle = '#fffdf7'; [0, 44].forEach(dx => { c.beginPath(); c.moveTo(150 + dx, 250); c.lineTo(190 + dx, 225); c.lineTo(190 + dx, 275); c.closePath(); c.fill(); }); c.restore(); }

  // ---------- the plan (4 pieces) and where each piece goes ----------
  const HANDP = [330, 1420], PIECE_OFF = [[-36, -36], [36, -36], [-36, 36], [36, 36]];
  const TARGET = [HOLD.fore, HOLD.doc, HOLD.hosp];
  function pieces(c, t, cam) {
    const z = cam[2], split = L.ease.out(L.sm(3.1, 3.6, t)), handA = t < 16.5 ? L.sm(1.6, 2.4, z) : 1;
    const hx = HANDP[0], hy = HANDP[1] - 110;
    for (let i = 0; i < 4; i++) {
      const o = PIECE_OFF[i], sx = hx + o[0] * (1 + 0.8 * split), sy = hy + o[1] * (1 + 0.8 * split);
      if (i < 3) {
        const f = L.ease.inOut(L.sm(3.6 + 0.4 * i, 7.4 + 0.5 * i, t)); const tp = proj(TARGET[i], cam);
        const x = L.lerp(sx, tp[0], f), y = L.lerp(sy, tp[1], f), s = L.lerp(70, 90 * z, f);
        const vis = t < 3.6 ? handA : 1;
        if (t < 16.4) piece(c, x, y, s, vis, split * (i - 1) * 0.3 * (1 - f), 1);
      } else {
        piece(c, sx, sy, 70, handA, split * 0.2, 1);
        const hp = proj(HOLD.her, cam); piece(c, hp[0], hp[1], 90 * z, 1 - handA, 0, 1);
      }
    }
  }

  // ---------- snap panels ----------
  function redHump(c, x0, w, yBase, hgt, dMax, dNow, span) {
    c.fillStyle = RED; c.beginPath(); c.moveTo(x0, yBase); const lim = Math.min(dNow, span);
    for (let d = 0; d <= lim + 1e-6; d += span / 400) c.lineTo(x0 + w * d / span, yBase - hgt * h(d));
    c.lineTo(x0 + w * lim / span, yBase); c.closePath(); c.fill();
  }
  function snapA(c, t) {
    c.fillStyle = PAPER; c.fillRect(0, 0, 1080, 1920);
    const x0 = 90, w = 900, yb = 1000, day = L.clamp((t - 23.3) / 2.0, 0, 1) * D305;
    c.fillStyle = '#b9b1a4'; rr(c, x0, yb - 4, w, 8, 4); c.fill();
    redHump(c, x0, w, yb, 300, DEND, day, D305);
    c.fillStyle = RED; c.fillRect(x0, yb + 10, w * Math.min(day, DEND) / D305, 16);
    for (let i = 0; i < 12; i++) { const d = hq((i + 0.5) / 12); if (d > D305 || day < d) continue; piece(c, x0 + w * d / D305, yb - 60 - (i % 3) * 36, 30, 1, 0, 0.6); }
    const px = x0 + w * day / D305; c.fillStyle = INK; rr(c, px - 3, yb - 380, 6, 420, 3); c.fill();
    if (day >= D305 - 0.5) { piece(c, x0 + w, yb - 200, 80, L.sm(25.25, 25.4, t)); }
    card(c, ['As it happened.'], 420, 110, fade(t, 23.35, 25.4, 0.25), { col: INK, stroke: PAPER });
    tag(c, 'true speed', 90, 560, 48, fade(t, 23.4, 25.4, 0.25), { align: 'left', col: INK, stroke: null });
    tag(c, 'Day 305', 900, yb + 90, 52, L.sm(25.2, 25.35, t), { align: 'right', col: INK, stroke: null });
    tag(c, 'the red', 90, yb + 90, 44, fade(t, 23.6, 25.4, 0.25), { align: 'left', col: RED, stroke: null });
    slate(c, 'SC6  SNAP A  TRUE SPEED');
  }
  function lane(c, t, y0, human) {
    const x0 = 90, w = 900, hh = 400, yb = y0 + hh - 70, day = L.clamp((t - 25.8) / 3.6, 0, 1) * DEND;
    c.fillStyle = 'rgba(40,36,34,0.12)'; rr(c, x0 - 10 + 10, y0 + 10, w + 20, hh, 30); c.fill();
    c.fillStyle = '#f3ede3'; rr(c, x0 - 10, y0, w + 20, hh, 30); c.fill();
    c.fillStyle = '#b9b1a4'; rr(c, x0, yb - 3, w, 6, 3); c.fill();
    redHump(c, x0, w, yb, 170, DEND, day, DEND);
    const peakX = x0 + w * PEAK / DEND; tag(c, 'peak', peakX + 150, yb - 120, 44, L.sm(PEAK / DEND * 3.6 + 25.8, PEAK / DEND * 3.6 + 26.0, t), { col: INK, stroke: null });
    const qs = [0.1, 0.3, 0.5, 0.8], jd = qs.map(q => human ? hq(q) : aq(q));
    const asmD = jd[2], ax = x0 + w * asmD / DEND, ay = y0 + 85;
    const home = [[x0 + 90, y0 + 170], [x0 + 330, y0 + 90], [x0 + 560, y0 + 180], [x0 + 800, y0 + 95]];
    jd.forEach((d, i) => { const tj = 25.8 + 3.6 * d / DEND; const f = L.ease.inOut(L.sm(tj, tj + 0.3, t)); const off = [[-26, -26], [26, -26], [-26, 26], [26, 26]][i];
      const x = L.lerp(home[i][0], ax + off[0], f), y = L.lerp(home[i][1], ay + off[1], f); piece(c, x, y, 50, d <= DEND ? 1 : 0.55, 0, f); });
    const done = L.sm(25.8 + 3.6 * asmD / DEND + 0.3, 25.8 + 3.6 * asmD / DEND + 0.5, t);
    const px = x0 + w * day / DEND; c.fillStyle = INK; rr(c, px - 3, y0 + 40, 6, hh - 80, 3); c.fill();
    tag(c, human ? 'people, as it was' : 'frontier AI routing · illustrative', 110, y0 - 22, 44, 1, { align: 'left', col: INK, stroke: null });
    tag(c, human ? 'Day 12, after the peak' : 'assembled before the peak', 110, yb + 52, 44, done, { align: 'left', col: INK, stroke: null });
  }
  function snapB(c, t) {
    c.fillStyle = PAPER; c.fillRect(0, 0, 1080, 1920);
    card(c, ['Same pieces.', 'Two speeds.'], 300, 100, fade(t, 25.5, 31.0, 0.3), { col: INK, stroke: PAPER });
    lane(c, t, 560, true); lane(c, t, 1060, false);
        slate(c, 'SC6  SNAP B  SAME CLOCK, TWO LANES');
  }
  // ---------- extreme close: the piece passes through the window (illustrative) ----------
  function hands(c, t) {
    const lt = t - 31, s = L.lerp(1.0, 1.12, L.ease.inOut(L.sm(0, 2.5, lt)));
    c.save(); c.translate(540, 960); c.scale(s, s); c.translate(-540, -960);
    c.fillStyle = FAC[3]; c.fillRect(-100, -100, 1300, 2200);
    c.fillStyle = '#6c665f'; rr(c, 40, 180, 1000, 900, 40); c.fill();
    c.fillStyle = CREAM; rr(c, 80, 220, 920, 820, 30); c.fill();
    const g = c.createRadialGradient(760, 420, 0, 760, 420, 600); g.addColorStop(0, 'rgba(255,248,225,0.9)'); g.addColorStop(1, 'rgba(255,248,225,0)'); c.fillStyle = g; c.fillRect(80, 220, 920, 820);
    c.fillStyle = '#6c665f'; c.fillRect(530, 220, 16, 820); c.fillRect(80, 560, 920, 16);
    c.fillStyle = '#6c665f'; rr(c, 10, 1030, 1060, 60, 20); c.fill();
    // his hand from inside (right), palm up on the sill
    const hp = [700, 1000]; c.fillStyle = 'rgba(40,36,34,0.2)'; rr(c, 620, 1005, 560, 40, 20); c.fill(); c.fillStyle = '#7b7169'; rr(c, 790, 930, 400, 100, 50); c.fill(); c.fillStyle = SKIN; rr(c, 640, 945, 190, 80, 40); c.fill();
    c.fillStyle = SKIN2; [0, 1, 2].forEach(i => { rr(c, 596, 952 + i * 22, 80, 22, 11); c.fill(); }); c.fillStyle = SKIN; rr(c, 690, 920, 70, 34, 17); c.fill();
    // her hand from lower left
    const f = L.ease.inOut(L.sm(0.3, 1.8, lt));
    const q = [L.lerp(360, hp[0] - 20, f), L.lerp(1180, 960, f)];
    hand(c, L.lerp(330, 470, f), L.lerp(1330, 1150, f), 1.1, 1, { rot: -0.7 });
    piece(c, q[0], q[1], 90, 1, 0, 1);
    fingers(c, L.lerp(330, 470, f), L.lerp(1330, 1150, f), 1.1, 1 - L.sm(1.2, 1.6, lt), { rot: -0.7 });
    c.restore();
    card(c, ['Routed before the peak.'], 330, 90, fade(t, 31.1, 33.5, 0.3));
    tag(c, 'illustrative', 490, 1440, 48, fade(t, 31.1, 33.5, 0.3));
    slate(c, 'SC7  EXTREME CLOSE  PUSH IN');
  }

  function draw(c, t) {
    c.fillStyle = PAPER; c.fillRect(0, 0, 1080, 1920);
    if (t < 22.6 || (t >= 33.5 && t < 36.2)) {
      const neck = t >= 33.5; const day = neck ? 1 : dayAt(t);
      const cam = neck ? [540, 1275, L.lerp(4.5, 4.8, L.sm(33.5, 36, t))] : camAt(t);
      c.save(); L.camera(c, [[0, [cam[0], cam[1], cam[2], 0]]], 0); drawWorld(c, day, t, cam[2]); c.restore();
      const hv = h(day);
      // heat wash + red top edge in close framings (strength = h(day))
      if (hv > 0.005) { c.fillStyle = rgbaRed(0.08 * hv); c.fillRect(0, 0, 1080, 1920);
        const edge = L.sm(1.6, 2.6, cam[2]); if (edge > 0) { const eh = 220 + 520 * hv; const g = c.createLinearGradient(0, 0, 0, eh); g.addColorStop(0, rgbaRed(edge * Math.min(0.95, hv * 3))); g.addColorStop(1, rgbaRed(0)); c.fillStyle = g; c.fillRect(0, 0, 1080, eh); } }
      if (!neck) {
        particles(c, t, day);
        // POV hand (screen space) when close
        const z = cam[2], handA = L.sm(1.6, 2.4, z);
        hand(c, HANDP[0], HANDP[1], 1.0, handA);
        pieces(c, t, cam);
        fingers(c, HANDP[0], HANDP[1], 1.0, handA * (t < 3.1 ? 1 : 1 - L.sm(3.1, 3.4, t) * 0.0));
        // cold open: red sun of that summer as a double exposure over day 305
        const co = 1 - L.sm(1.1, 2.0, t);
        if (co > 0) { const g = c.createRadialGradient(720, 740, 120, 720, 740, 700); g.addColorStop(0, rgbaRed(0.55 * co)); g.addColorStop(1, rgbaRed(0)); c.fillStyle = g; c.fillRect(0, 0, 1080, 1400);
          c.fillStyle = rgbaRed(0.92 * co); c.beginPath(); c.arc(720, 740, 240, 0, 7); c.fill(); }
        strip(c, day, fade(t, 3.0, 10.3, 0.4) + fade(t, 13.4, 16.8, 0.4));
        rewindIcon(c, fade(t, 3.0, 9.9, 0.2) + fade(t, 11.2, 16.5, 0.2));
        // wide labels
        const wl = fade(t, 10.3, 13.6, 0.4);
        if (wl > 0) { [['forecasters', HOLD.fore, 110], ['doctors', HOLD.doc, -80], ['hospital', HOLD.hosp, -80], ['neighbors', HOLD.her, -90]].forEach(([s, p, dy]) => { const q = proj(p, cam); tag(c, s, q[0], q[1] + dy, 44, wl); }); }
        // cards
        card(c, ['Day 305.'], 330, 150, t < 2.8 ? 1 : 1 - L.sm(2.8, 3.1, t));
        card(c, ['The plan arrived.'], 470, 96, fade(t, 1.2, 3.1, 0.25));
        card(c, ['Rewind.'], 380, 120, fade(t, 3.2, 5.1));
        card(c, ['Each step back,', 'more pieces.'], 380, 104, fade(t, 5.4, 8.8));
        card(c, ['Day 12.', 'After the peak.'], 380, 110, fade(t, 9.9, 11.7));
        card(c, ['The pieces', 'were all here.'], 380, 104, fade(t, 11.8, 13.6));
        card(c, ['Before anyone', 'connected them.'], 380, 104, fade(t, 13.9, 16.4));
        card(c, ['The first morning.'], 380, 110, fade(t, 16.7, 18.9));
        card(c, ['We slowed it down', 'so you could see it.'], 380, 100, fade(t, 19.2, 22.5));
        const sl = t < 3 ? 'SC1  CLOSE  POV  DAY 305' : t < 8.9 ? 'SC2  REWIND  DOLLY OUT' : t < 10.2 ? 'SC3  CRANE UP' : t < 13.5 ? 'SC3  WIDE  HOLD' : t < 16.5 ? 'SC4  DROP DOWN' : 'SC5  CLOSE+  PUSH IN';
        slate(c, sl);
      } else {
        c.fillStyle = 'rgba(30,28,30,0.45)'; c.fillRect(0, 0, 1080, 1920);
        card(c, ['This is the', 'bottleneck.'], 700, 130, fade(t, 33.6, 36.2, 0.35));
        slate(c, 'SC8  CLOSE  HOLD');
      }
      if (t > 22.3 && t < 22.6) { c.fillStyle = `rgba(20,19,21,${L.sm(22.3, 22.6, t)})`; c.fillRect(0, 0, 1080, 1920); }
    } else if (t < 23.3) { c.fillStyle = '#141315'; c.fillRect(0, 0, 1080, 1920); }
    else if (t < 25.4) snapA(c, t);
    else if (t < 31.0) snapB(c, t);
    else if (t < 33.5) hands(c, t);
    if (t >= 35.8) { L.endCard(c, L.sm(35.8, 36.2, t), { line: 'The bottleneck is us.' }); }
    L.grain(c, t, { alpha: 0.05, n: 500 });
  }

  return { draw, DUR,
    acts: [{ start: 0, end: 22.6, bpm: 0, drone: true }, { start: 23.3, end: 31, bpm: 0, drone: true }, { start: 31, end: 40, bpm: 0, drone: true }],
    cues: [{ t: 3.0, type: 'whoosh' }, { t: 3.2, type: 'pop' }, { t: 8.9, type: 'whoosh' }, { t: 9.9, type: 'ding' }, { t: 13.5, type: 'whoosh' }, { t: 23.3, type: 'hit' },
      { t: 25.8 + 3.6 * aq(0.5) / DEND + 0.3, type: 'ding' }, { t: 25.8 + 3.6 * hq(0.5) / DEND + 0.3, type: 'pop' }, { t: 33.5, type: 'hit' }] };
}
if (typeof module !== 'undefined') module.exports = makeScene;
