// the-mold-strikes-back: nature-documentary, x-ray, ecology. Analog: penicillin-resistance-1946.
// Race mapping (log): film t = 1.4 + 14.6 * log10(1 + year) / log10(16), years 0..15. See output/the-mold-strikes-back/notes.md.
// Red = L.logistic(year, 0.56 [derived doubling], s0 0.125) over 40 fixed samples (dish colonies = ward beds).
// Green links = L.lognormalQuantile(q, median 13, p90 69); AI snap = ai_counterfactual median 2.5 (illustrative, coordination only).
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('penicillin-resistance-1946');
  const DUR = 37, RED = L.RED, GREEN = L.GREEN;
  const BG = '#05090e', BONE = '#d4e4ee', INK = '#9fb3c2', DIM = '#55697a', FAINT = 'rgba(160,190,210,0.10)';

  // ---------- speed math ----------
  const DBL = A.threat.doubling_time, S0 = A.threat.points[0].extent;       // 0.56 y (derived), 0.125
  const share = y => L.logistic(Math.max(0, y), DBL, S0);
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90; // 13, 69
  const AIMED = A.ai_counterfactual.aggregation_median;                       // 2.5
  const AIP90 = AIMED * P90 / MED;                                            // same sigma
  const F = {}; A.solution.fragments.forEach(f => F[f.id] = f.ready_at);
  const DRUG = F.f3, COUNTER = F.f4, WARN = F.f2;                              // 13, 15, 1.5
  const SPAN = 15, RT0 = 1.4, RLEN = 14.6;
  const tOfYear = y => RT0 + L.mapTime(y, SPAN, RLEN, 'log');
  const yearAt = t => t < RT0 ? 0 : L.unmapTime(Math.min(t, RT0 + RLEN) - RT0, SPAN, RLEN, 'log');
  const T_DRUG = tOfYear(DRUG), T_END = RT0 + RLEN;                          // 15.3, 16.0
  const COLD_YEAR = A.threat.points[2].t;                                      // 1.75, flash-forward

  // ---------- setup (all randomness here) ----------
  const r = L.rng(1946);
  const N = 40, thr = []; for (let i = 0; i < N; i++) thr.push((i + 0.5) / N);
  for (let i = N - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [thr[i], thr[j]] = [thr[j], thr[i]]; }
  // colonies in the dish (local coords, dish radius 320)
  const col = []; let guard = 0;
  while (col.length < N && guard++ < 5000) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 262, x = Math.cos(a) * d, y = Math.sin(a) * d, s = 16 + r() * 14;
    if (col.every(c => Math.hypot(c.x - x, c.y - y) > c.s + s + 12)) col.push({ x, y, s, ph: r() * 6.28 }); }
  // the two colonies that come back red at year 15 (qualitative "first reports")
  const back = [0, 1].map(k => col.map((c, i) => i).filter(i => thr[i] < 0.5)[k * 7 + 3]);
  // ward beds: same 40 samples
  const WARDS = [[130, 900, 370, 120], [520, 900, 380, 120], [130, 1035, 370, 115], [520, 1035, 380, 315]];
  const beds = []; WARDS.forEach(([x, y, w, h], wi) => { const cols = 5, rows = 2; for (let i = 0; i < 10; i++) { const c = i % cols, rw = Math.floor(i / cols);
    beds.push([x + 38 + c * (w - 76) / (cols - 1), wi === 3 ? y + 70 + rw * 150 : y + 40 + rw * 50]); } });
  const specks = []; for (let i = 0; i < 160; i++) specks.push([r() * 1200 - 60, r() * 2100 - 90, 0.6 + r() * 1.6]);

  // green fragment holders
  const DISH = [300, 1250], R0 = 24, K = R0 / 320;
  const NODES = { H: DISH, F1: [250, 430], F3: [770, 340], S1: [800, 660], S2: [190, 720], S3: [560, 590] };
  const PAIRS = [['H', 'S2'], ['S2', 'S3'], ['H', 'S3'], ['F1', 'S2'], ['S1', 'S3'], ['F1', 'S3'], ['H', 'S1'], ['F1', 'H'], ['S1', 'S2'], ['F1', 'S1']];
  const LINKS = PAIRS.map((p, i) => ({ a: p[0], b: p[1], at: L.lognormalQuantile((i + 0.5) / PAIRS.length, MED, P90), seed: i * 13 + 5 }));
  const AILINKS = PAIRS.map((p, i) => L.lognormalQuantile((i + 0.5) / PAIRS.length, AIMED, AIP90));

  // ---------- helpers ----------
  const fade = (t, a, b, f = 0.3) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));
  function glow(ctx, x, y, rad, rgb, a) { const g = ctx.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.fillRect(x - rad, y - rad, 2 * rad, 2 * rad); }
  function hand(ctx, text, x, y, size, c, a = 1, align = 'center') { L.label(ctx, text, x, y, size, { col: c, alpha: a, align }); }
  function slate(ctx, s) { ctx.save(); ctx.fillStyle = 'rgba(4,7,11,0.7)'; ctx.fillRect(40, 1818, 620, 58); ctx.restore(); L.slate(ctx, s); }
  // documentary lower third: rule + serif caption, left aligned, inside x 100..900
  function lower(ctx, text, a, { sub } = {}) { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a;
    const g = ctx.createLinearGradient(0, 1300, 0, 1540); g.addColorStop(0, 'rgba(3,6,10,0)'); g.addColorStop(0.35, 'rgba(3,6,10,0.78)'); g.addColorStop(1, 'rgba(3,6,10,0.78)');
    ctx.fillStyle = g; ctx.fillRect(0, 1300, 1080, 240);
    ctx.fillStyle = 'rgba(212,228,238,0.8)'; ctx.fillRect(100, 1382, 90 + 40 * a, 3);
    let fz = 76; ctx.font = `italic ${fz}px "${SERIF}"`; while (ctx.measureText(text).width > 790 && fz > 40) { fz -= 4; ctx.font = `italic ${fz}px "${SERIF}"`; }
    ctx.textAlign = 'left'; ctx.fillStyle = '#eef3f6'; ctx.fillText(text, 100, 1462);
    if (sub) { ctx.font = `34px "${HAND}"`; ctx.fillStyle = INK; ctx.fillText(sub, 102, 1368); }
    ctx.restore(); }
  function card(ctx, lines, y, size, a, c) { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center'; let yy = y;
    lines.forEach((l, i) => { const o = typeof l === 'string' ? { text: l } : l; let fz = o.size || size; ctx.font = `${fz}px "${SERIF}"`;
      while (ctx.measureText(o.text).width > 800 && fz > 30) { fz -= 4; ctx.font = `${fz}px "${SERIF}"`; }
      if (i) yy += fz * 1.06; ctx.lineJoin = 'round'; ctx.lineWidth = fz * 0.14; ctx.strokeStyle = 'rgba(3,6,10,0.95)'; ctx.strokeText(o.text, 490, yy);
      ctx.fillStyle = o.col || c || '#eef3f6'; ctx.fillText(o.text, 490, yy); }); ctx.restore(); }

  // ---------- the x-ray hand (local coords, dish centre 0,0, radius 320) ----------
  const BONES = [
    [[-250, 1000], [-175, 600]], [[-150, 1010], [-80, 610]],                       // radius, ulna
    [[-120, 560], [40, 420]], [[-95, 585], [95, 395]], [[-70, 610], [140, 380]], [[-45, 640], [170, 385]], // metacarpals
    [[40, 420], [150, 300]], [[150, 300], [215, 215]], [[215, 215], [245, 160]],
    [[95, 395], [210, 290]], [[210, 290], [270, 205]], [[270, 205], [300, 150]],
    [[140, 380], [255, 305]], [[255, 305], [310, 235]], [[310, 235], [335, 190]],
    [[170, 385], [265, 345]], [[265, 345], [320, 300]], [[320, 300], [345, 268]],
  ];
  const THUMB = [[[-160, 560], [-265, 400]], [[-265, 400], [-330, 250]], [[-330, 250], [-340, 150]]];
  const CARP = [[-150, 590, 26], [-110, 600, 24], [-72, 615, 22], [-130, 640, 24], [-92, 650, 24], [-160, 630, 20], [-55, 650, 20]];
  function glovePath(ctx, bones) { ctx.beginPath(); bones.forEach(([a, b]) => { ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); }); }
  function drawBones(ctx, bones, a = 1) { ctx.save(); ctx.globalAlpha *= a; ctx.lineCap = 'round';
    bones.forEach(([p, q]) => { ctx.strokeStyle = 'rgba(212,228,238,0.25)'; ctx.lineWidth = 34; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
      ctx.strokeStyle = BONE; ctx.lineWidth = 18; ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.stroke();
      ctx.strokeStyle = 'rgba(5,9,14,0.55)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(L.lerp(p[0], q[0], 0.18), L.lerp(p[1], q[1], 0.18)); ctx.lineTo(L.lerp(p[0], q[0], 0.82), L.lerp(p[1], q[1], 0.82)); ctx.stroke();
      [p, q].forEach(([x, y]) => { ctx.fillStyle = BONE; ctx.beginPath(); ctx.arc(x, y, 13, 0, 7); ctx.fill(); }); });
    ctx.restore(); }
  function glove(ctx, bones, w) { ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; glovePath(ctx, bones);
    ctx.strokeStyle = 'rgba(150,200,230,0.35)'; ctx.lineWidth = w + 10; ctx.stroke(); ctx.strokeStyle = '#0c1822'; ctx.lineWidth = w; ctx.stroke(); ctx.restore(); }

  // ---------- the dish (local coords) ----------
  function dish(ctx, year, t, { rimOn = 1, cleared = 0, returned = 0, fullRim = 0 } = {}) {
    const s = share(year);
    // agar
    const g = ctx.createRadialGradient(-60, -80, 20, 0, 0, 320); g.addColorStop(0, 'rgba(170,200,220,0.22)'); g.addColorStop(1, 'rgba(120,150,175,0.08)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 305, 0, 7); ctx.fill();
    // colonies
    col.forEach((c, i) => { const isRed = s > thr[i]; const ret = back.includes(i) ? returned : 0;
      const redA = isRed ? Math.max(1 - cleared, ret) : ret;
      ctx.fillStyle = 'rgba(190,212,226,0.30)'; ctx.beginPath(); ctx.arc(c.x, c.y, c.s, 0, 7); ctx.fill();
      ctx.strokeStyle = 'rgba(212,228,238,0.65)'; ctx.lineWidth = 3; ctx.stroke();
      if (redA > 0.01) { const pulse = 1 + 0.06 * Math.sin(t * 2.2 + c.ph); ctx.save(); ctx.globalAlpha = redA;
        glow(ctx, c.x, c.y, c.s * 2.6, '255,59,48', 0.5); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(c.x, c.y, c.s * pulse, 0, 7); ctx.fill(); ctx.restore(); } });
    // glass
    ctx.strokeStyle = 'rgba(212,228,238,0.55)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 305, 0, 7); ctx.stroke();
    // the green rim: her surveillance data (f2), brighter once the warning is ready; closes when the pieces meet
    const on = rimOn * (year >= WARN ? 1 : 0.55);
    glow(ctx, 0, 0, 380, '52,210,123', 0.0);
    ctx.save(); ctx.strokeStyle = GREEN; ctx.lineCap = 'round';
    const arc = L.lerp(0.62, 1, fullRim) * Math.PI * 2;
    ctx.globalAlpha = on * 0.28; ctx.lineWidth = 46; ctx.beginPath(); ctx.arc(0, 0, 322, -Math.PI / 2, -Math.PI / 2 + arc); ctx.stroke();
    ctx.globalAlpha = on; ctx.lineWidth = 14; ctx.beginPath(); ctx.arc(0, 0, 322, -Math.PI / 2, -Math.PI / 2 + arc); ctx.stroke(); ctx.restore();
  }

  // ---------- the world (world coords 1080x1920 at zoom 1) ----------
  function world(ctx, t, year, st, z = 1) {
    const LA = L.clamp((4 - z) / 3, 0, 1); // links and haze read at wide; at macro they would become beams
    ctx.fillStyle = BG; ctx.fillRect(-400, -400, 1900, 2800);
    ctx.fillStyle = 'rgba(170,200,220,0.10)'; specks.forEach(([x, y, s]) => ctx.fillRect(x, y, s, s));
    const s = share(year);
    // hospital, x-ray floor plan
    ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.strokeRect(110, 880, 810, 490);
    ctx.lineWidth = 1.5; ctx.strokeStyle = DIM; WARDS.forEach(([x, y, w, h]) => ctx.strokeRect(x, y, w, h)); ctx.strokeRect(130, 1160, 370, 190);
    glow(ctx, 520, 1120, 520, '255,59,48', (0.05 + 0.12 * s * (1 - st.cleared)) * (0.35 + 0.65 * LA));
    beds.forEach(([x, y], i) => { ctx.fillStyle = '#16222d'; ctx.fillRect(x - 15, y - 9, 30, 18); ctx.strokeStyle = DIM; ctx.lineWidth = 1.2; ctx.strokeRect(x - 15, y - 9, 30, 18);
      const red = (s > thr[i] ? 1 - st.cleared : 0) + (back.includes(i) ? st.returned : 0);
      if (red > 0.02) { ctx.save(); ctx.globalAlpha = Math.min(1, red); glow(ctx, x, y, 22, '255,59,48', 0.6); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(x, y, 6, 0, 7); ctx.fill(); ctx.restore(); }
      else { ctx.fillStyle = 'rgba(190,212,226,0.5)'; ctx.beginPath(); ctx.arc(x, y, 4, 0, 7); ctx.fill(); } });
    hand(ctx, 'wards', 140, 872, 26, DIM, 1, 'left'); hand(ctx, 'the lab', 140, 1345, 22, DIM, 1, 'left');
    // distant rooms
    const room = (id, label, lit, x0, y0) => { const [x, y] = NODES[id]; ctx.strokeStyle = DIM; ctx.lineWidth = 1.5; ctx.strokeRect(x - 80, y - 50, 160, 100);
      L.stick(ctx, x - 30, y + 18, 0.55, { mood: lit > 0.9 ? 'awe' : 'glazed', col: '#8ea2b1', seed: x, pose: { armL: 0.9, armR: 1.2 } });
      if (lit > 0) { glow(ctx, x + 32, y, 60, '52,210,123', 0.45 * lit); ctx.save(); ctx.globalAlpha = lit; ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(x + 32, y, 11, 0, 7); ctx.fill(); ctx.restore(); }
      else { ctx.strokeStyle = 'rgba(52,210,123,0.35)'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(x + 32, y, 11, 0, 7); ctx.stroke(); }
      hand(ctx, label, x, y + 82, 28, INK); };
    // links (drawn under rooms)
    const drugIn = L.sm(DRUG - 0.01, DRUG, year);
    if (LA > 0) { ctx.save(); ctx.globalAlpha = LA;
    LINKS.forEach(k => { const [ax, ay] = NODES[k.a], [bx, by] = NODES[k.b];
      if (year >= k.at) { ctx.save(); ctx.strokeStyle = GREEN; ctx.globalAlpha *= 0.85; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); ctx.restore(); return; }
      // reaching and breaking: a dashed reach that flickers on a ~0.7 s cycle (attention elsewhere)
      const start = k.at * 0.3; if (year < start || !st.live) return;
      const ph = ((t * 1.4 + k.seed * 0.37) % 1), reach = 0.15 + 0.45 * Math.min(1, (year - start) / (k.at - start + 1e-6));
      const len = reach * L.ease.out(Math.min(1, ph / 0.6)), a = ph < 0.75 ? 0.6 : 0.6 * (1 - (ph - 0.75) / 0.25);
      ctx.save(); ctx.strokeStyle = GREEN; ctx.globalAlpha *= a * 0.7; ctx.lineWidth = 2; ctx.setLineDash([8, 10]); ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(L.lerp(ax, bx, len), L.lerp(ay, by, len)); ctx.stroke(); ctx.restore(); });
    if (drugIn > 0) { const [ax, ay] = NODES.F3, [bx, by] = DISH; ctx.save(); glow(ctx, bx, by, 90, '52,210,123', 0.35 * drugIn); ctx.strokeStyle = GREEN; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke(); ctx.restore(); }
    ctx.restore(); }
    room('F1', 'biochemists', 1, 0, 0); room('F3', 'chemists', year >= DRUG ? 1 : 0, 0, 0);
    room('S1', 'another hospital', 0.6, 0, 0); room('S2', 'another hospital', 0.6, 0, 0); room('S3', 'a records office', 0.6, 0, 0);
    // log-time axis (world furniture, legible at wide)
    const ax0 = 140, ax1 = 880, ay = 200 + 0; ctx.strokeStyle = DIM; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ax0, 250); ctx.lineTo(ax1, 250); ctx.stroke();
    for (let yy = 0; yy <= 15; yy++) { const x = L.lerp(ax0, ax1, Math.log10(1 + yy) / Math.log10(16)); ctx.beginPath(); ctx.moveTo(x, 244); ctx.lineTo(x, 256); ctx.stroke(); }
    const hx = L.lerp(ax0, ax1, Math.log10(1 + year) / Math.log10(16)); ctx.fillStyle = BONE; ctx.beginPath(); ctx.arc(hx, 250, 7, 0, 7); ctx.fill();
    hand(ctx, 'years, log time', ax0, 232, 26, DIM, 1, 'left');
    // the lab worker (x-ray stick figure) holding the dish
    L.stick(ctx, 205, 1335, 1.0, { mood: st.mood, col: '#a9bfcd', seed: 7, pose: { armL: 0.5, armR: 0.2 }, look: [1, -0.5] });
    ctx.strokeStyle = '#a9bfcd'; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(205, 1283); ctx.lineTo(255, 1330); ctx.lineTo(282, 1322); ctx.stroke();
    // the close set: hand + dish at the dish position
    ctx.save(); ctx.translate(DISH[0], DISH[1]); ctx.scale(K, K);
    glove(ctx, BONES, 78); drawBones(ctx, CARP.map(([x, y]) => [[x, y], [x + 1, y + 1]]), 1); drawBones(ctx, BONES, 1);
    dish(ctx, year, t, st);
    glove(ctx, THUMB, 80); drawBones(ctx, THUMB, 1);
    ctx.restore();
  }

  // ---------- camera (log zoom interpolation) ----------
  const CX = DISH[0], CY = DISH[1] + 8;
  const CAM = [[0, CX, CY, 13], [6.4, CX, CY, 13], [9.4, 540, 900, 1.0], [12.8, 540, 900, 1.0], [15.3, CX, DISH[1] + 4, 16], [19.4, CX, DISH[1] + 4, 16.6]];
  const CAM2 = [[26.2, CX, DISH[1] + 2, 19], [32, CX, DISH[1] + 2, 21]];
  function cam(ctx, keys, t) { let k = keys[keys.length - 1].slice(1);
    if (t <= keys[0][0]) k = keys[0].slice(1);
    else for (let i = 0; i < keys.length - 1; i++) { const a = keys[i], b = keys[i + 1]; if (t <= b[0]) { const f = L.ease.inOut((t - a[0]) / (b[0] - a[0]));
      const z = Math.exp(L.lerp(Math.log(a[3]), Math.log(b[3]), f));
      // keep the path consistent with the zoom: centre moves in proportion to 1/z
      const u = (1 / z - 1 / a[3]) / (1 / b[3] - 1 / a[3] || 1); k = [L.lerp(a[1], b[1], L.clamp(u, 0, 1)), L.lerp(a[2], b[2], L.clamp(u, 0, 1)), z]; break; } }
    ctx.translate(540, 960); ctx.scale(k[2], k[2]); ctx.translate(-k[0], -k[1]); return k[2]; }

  function stateAt(t) {
    const year = t < 1.3 ? COLD_YEAR : yearAt(t);
    return { year, cleared: L.sm(DRUG, DRUG + 0.6, year) * (t >= T_DRUG ? 1 : 0), returned: t >= T_END - 0.05 ? L.sm(T_END - 0.05, T_END + 0.4, t) : 0,
      fullRim: L.sm(T_DRUG - 0.3, T_DRUG + 0.4, t), rimOn: 1, live: t < T_END,
      mood: t < 1.3 ? 'awe' : year < WARN ? 'glazed' : year < DRUG ? 'sad' : t < T_END ? 'awe' : 'panic' };
  }

  // ---------- snap sheet ----------
  const SNAP0 = 19.4, SWEEP0 = 20.0, SWEEP = 3.0;
  function snap(ctx, t) {
    ctx.fillStyle = '#070c12'; ctx.fillRect(0, 0, 1080, 1920);
    ctx.fillStyle = 'rgba(170,200,220,0.08)'; specks.forEach(([x, y, s]) => ctx.fillRect(x * 0.9, y * 0.9, s, s));
    const head = L.clamp((t - SWEEP0) / SWEEP, 0, 1) * SPAN;
    hand(ctx, 'the same record, true speed', 490, 250, 46, INK);
    const X0 = 120, X1 = 880, xOf = y => X0 + (X1 - X0) * y / SPAN;
    const lanes = [{ y0: 300, label: 'as it was', med: MED, p90: P90, links: LINKS.map(k => k.at) }, { y0: 880, label: 'routed coordination', med: AIMED, p90: AIP90, links: AILINKS, ai: true }];
    lanes.forEach(ln => { const base = ln.y0 + 420, H = 250;
      ctx.fillStyle = 'rgba(20,32,44,0.9)'; ctx.fillRect(70, ln.y0, 940, 520); ctx.strokeStyle = DIM; ctx.lineWidth = 2; ctx.strokeRect(70, ln.y0, 940, 520);
      hand(ctx, ln.label, X0, ln.y0 + 66, 54, BONE, 1, 'left');
      if (ln.ai) { ctx.fillStyle = 'rgba(212,228,238,0.14)'; ctx.fillRect(X0 + 470, ln.y0 + 22, 260, 62); hand(ctx, 'illustrative', X0 + 600, ln.y0 + 66, 48, '#eef3f6'); }
      ctx.strokeStyle = DIM; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X0, base); ctx.lineTo(X1, base); ctx.stroke();
      for (let yy = 0; yy <= SPAN; yy++) { ctx.beginPath(); ctx.moveTo(xOf(yy), base); ctx.lineTo(xOf(yy), base + 12); ctx.stroke(); }
      // red share (same in both lanes)
      ctx.fillStyle = 'rgba(255,59,48,0.85)'; ctx.beginPath(); ctx.moveTo(X0, base);
      for (let yy = 0; yy <= head; yy += 0.05) ctx.lineTo(xOf(yy), base - H * share(yy)); ctx.lineTo(xOf(head), base); ctx.closePath(); ctx.fill();
      // green links connected (lognormal CDF), as a line above
      ctx.strokeStyle = GREEN; ctx.lineWidth = 5; ctx.beginPath();
      for (let yy = 0; yy <= head; yy += 0.05) { const y = base - H * L.lognormalCDF(yy, ln.med, ln.p90); yy ? ctx.lineTo(xOf(yy), y) : ctx.moveTo(xOf(yy), y); } ctx.stroke();
      if (head >= ln.med) { const x = xOf(ln.med), y = base - H * 0.5, since = (head - ln.med) / SPAN * SWEEP;
        glow(ctx, x, y, 90, '52,210,123', 0.6 * Math.max(0.4, 1 - since)); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(x, y, 16, 0, 7); ctx.fill();
        hand(ctx, 'pieces meet', x - 28, y + 12, 40, GREEN, 1, 'right'); }
      if (head < SPAN && head > 0) { ctx.strokeStyle = '#eef3f6'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xOf(head), ln.y0 + 100); ctx.lineTo(xOf(head), base + 14); ctx.stroke(); }
    });
    hand(ctx, 'coordination only. Chemistry still takes years.', 490, 1460, 44, INK, L.sm(SWEEP0 + 1.0, SWEEP0 + 1.4, t));
    card(ctx, [{ text: '13 years.', col: GREEN }], 480, 130, L.sm(SWEEP0 + SWEEP * MED / SPAN + 0.1, SWEEP0 + SWEEP * MED / SPAN + 0.5, t));
    if (t > SWEEP0 - 0.4 && t < SWEEP0) { ctx.fillStyle = `rgba(230,240,248,${0.5 * (1 - (SWEEP0 - t) / 0.4)})`; ctx.fillRect(0, 0, 1080, 1920); }
  }

  function draw(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    if (t < SNAP0) {
      const st = stateAt(t);
      ctx.save(); const z1 = cam(ctx, CAM, t); world(ctx, t, st.year, st, z1); ctx.restore();
      // exposure flash on the cut back from the flash-forward
      if (t > 1.15 && t < 1.8) { const a = t < 1.3 ? (t - 1.15) / 0.15 : 1 - (t - 1.3) / 0.5; ctx.fillStyle = `rgba(225,238,246,${0.85 * a})`; ctx.fillRect(0, 0, 1080, 1920); }
      // dead stop dim
      if (t > T_END + 0.4) { ctx.fillStyle = `rgba(3,6,10,${0.5 * L.sm(T_END + 0.4, 17.2, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
      if (t < 1.3) { card(ctx, ['Watch the red.'], 330, 110, 1); hand(ctx, 'later', 110, 300, 40, INK, 1, 'left'); }
      lower(ctx, 'Spring. One in eight.', fade(t, 1.8, 4.2), { sub: 'one hospital' });
      lower(ctx, 'It does not hurry.', fade(t, 4.3, 6.3));
      lower(ctx, 'Its habitat: every ward.', fade(t, 6.6, 9.2));
      lower(ctx, 'Three rooms hold the answer.', fade(t, 9.4, 11.1));
      lower(ctx, 'They rarely hear each other.', fade(t, 11.2, 12.9));
      lower(ctx, 'At last, the pieces meet.', fade(t, T_DRUG - 0.2, T_END + 0.05));
      lower(ctx, 'The red adapts.', fade(t, T_END + 0.05, 17.3));
      card(ctx, ['We slowed it down', 'so you could see it.'], 700, 88, fade(t, 17.3, SNAP0, 0.4));
      slate(ctx, t < 1.3 ? 'SC1  CLOSE  COLD OPEN (later)' : t < 6.4 ? 'SC1  CLOSE  LOCKED-OFF' : t < 9.4 ? 'SC2  THE PULL-OUT' : t < 12.8 ? 'SC3  WIDE' : t < T_DRUG ? 'SC4  DOLLY IN' : t < 17.3 ? 'SC4  CLOSER  (dead stop)' : 'SC5  CARD');
    } else if (t < 26.2) {
      snap(ctx, t); slate(ctx, 'SC6  THE SNAP  (two lanes, true speed)');
    } else {
      const st = stateAt(T_END + 1); st.live = false; st.mood = 'awe';
      ctx.save(); const z2 = cam(ctx, CAM2, t); world(ctx, t, st.year, st, z2); ctx.restore();
      const a = 1 - L.sm(26.2, 26.9, t); if (a > 0) { ctx.save(); ctx.globalAlpha = a; snap(ctx, 26.2); ctx.restore(); }
      lower(ctx, 'The pieces were already here.', fade(t, 26.8, 29.2));
      card(ctx, ['This is the bottleneck.'], 700, 96, fade(t, 29.3, 32.0, 0.35));
      slate(ctx, 'SC7  CLOSEST');
      if (t >= 32) L.endCard(ctx, L.sm(32, 32.4, t), { line: 'The bottleneck is us.' });
    }
    L.grain(ctx, t, { alpha: 0.05, n: 500 });
  }

  // accelerating pulse: a pop each time a colony turns red during the race
  const pops = []; thr.slice().sort((a, b) => a - b).forEach(q => { if (q <= S0) return; const y = Math.log(q * (1 - S0) / (S0 * (1 - q))) / (Math.LN2 / DBL); const tt = tOfYear(y); if (tt < T_DRUG - 0.3 && tt > 1.9) pops.push(tt); });
  const cues = [{ t: 1.25, type: 'hit' }, { t: 6.4, type: 'whoosh' }, { t: T_DRUG, type: 'ding' }, { t: T_END, type: 'bonk' },
    { t: SWEEP0, type: 'hit' }, { t: SWEEP0 + SWEEP * AIMED / SPAN, type: 'ding' }, { t: SWEEP0 + SWEEP * MED / SPAN, type: 'pop' }, { t: 26.2, type: 'whoosh' }, { t: 32, type: 'hit' }];
  pops.filter((p, i) => i % 3 === 0).forEach(p => cues.push({ t: p, type: 'pop' }));
  return {
    draw, DUR,
    acts: [{ start: 0, end: 6.4, bpm: 46, drone: true }, { start: 6.4, end: 12.8, bpm: 62, drone: true }, { start: 12.8, end: 16.2, bpm: 84, drone: true }, { start: 23, end: 37, bpm: 0, drone: true }],
    cues: cues.sort((a, b) => a.t - b.t),
  };
}
if (typeof module !== 'undefined') module.exports = makeScene;
