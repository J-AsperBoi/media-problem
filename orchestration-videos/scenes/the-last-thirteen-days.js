// the-last-thirteen-days: ticking-clock, blueprint, machine. Analog: cuban-missile-1962.
// Race mapping: 1 film second = 6 hours, day(t) = 8 + (t - 1) / 4 (day 12 at t = 17). See output/the-last-thirteen-days/notes.md.
// Red = alert level (analog threat.points, step function). Green = documented fragments (analog solution.fragments)
// with documented latency (message_latency_hours). Full-record strip uses L.lognormalCDF(median 12, p90 247).
// AI snap = ai_counterfactual (day 11 vs 12, transport/translation only), labeled illustrative.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('cuban-missile-1962');
  const DUR = 38, RED = L.RED, GREEN = L.GREEN;
  const BG = '#161d26', GRID = 'rgba(150,170,190,0.07)', GRID2 = 'rgba(150,170,190,0.13)', INK = '#b9c3cd', DIM = '#6d7886', DESK = '#2c343e';

  // ---------- time mapping ----------
  const T_END = 17; // race ends (deal) -> world freezes
  const dayAt = t => 8 + (Math.min(t, T_END) - 1) / 4;
  const tOfDay = d => 1 + (d - 8) * 4;
  const HRS_PER_S = 6;

  // ---------- threat: step function over analog points ----------
  const pts = A.threat.points;
  const extentAt = d => { let e = 0; pts.forEach(p => { if (d >= p.t) e = p.extent; }); return e; };
  const U2 = tOfDay(pts[pts.length - 1].t); // closest point flash (day 11)

  // ---------- green fragments ----------
  const F = {}; A.solution.fragments.forEach(f => F[f.id] = f.ready_at);
  const LAT = A.solution.message_latency_hours; // typical 6, worst 12
  const DEAL = A.solution.aggregation.median, AIDEAL = A.ai_counterfactual.aggregation_median, FIX = F.f5;
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;
  const f2dep = tOfDay(F.f2), f2arr = f2dep + LAT.worst / HRS_PER_S;
  const f3dep = tOfDay(F.f3), f3arr = f3dep + LAT.typical / HRS_PER_S;
  const f4arr = tOfDay(F.f4), dealT = tOfDay(DEAL);

  // ---------- world layout ----------
  const PATH = [[700, 495], [840, 495], [840, 760], [240, 760], [240, 1020], [660, 1020], [660, 1300]];
  const segLen = []; let totLen = 0; for (let i = 0; i < PATH.length - 1; i++) { const l = Math.hypot(PATH[i + 1][0] - PATH[i][0], PATH[i + 1][1] - PATH[i][1]); segLen.push(l); totLen += l; }
  const along = s => { let d = s * totLen; for (let i = 0; i < segLen.length; i++) { if (d <= segLen[i] || i === segLen.length - 1) { const f = Math.min(1, d / segLen[i]); return [L.lerp(PATH[i][0], PATH[i + 1][0], f), L.lerp(PATH[i][1], PATH[i + 1][1], f)]; } d -= segLen[i]; } };
  const fracOf = pt => { let d = 0; for (let i = 0; i < segLen.length; i++) { const [a, b] = [PATH[i], PATH[i + 1]]; const on = (Math.abs(pt[0] - a[0]) < 1 && Math.abs(pt[0] - b[0]) < 1 && (pt[1] - a[1]) * (pt[1] - b[1]) <= 0) || (Math.abs(pt[1] - a[1]) < 1 && Math.abs(pt[1] - b[1]) < 1 && (pt[0] - a[0]) * (pt[0] - b[0]) <= 0); if (on) return (d + Math.hypot(pt[0] - a[0], pt[1] - a[1])) / totLen; d += segLen[i]; } return 0; };
  const STATIONS = [{ p: [840, 630], name: 'encode' }, { p: [540, 760], name: 'wire' }, { p: [240, 890], name: 'decode' }, { p: [450, 1020], name: 'translate' }];
  STATIONS.forEach(s => s.f = fracOf(s.p));
  // stop-start progress through the machine: half the time moving, half parked at stations
  const machineProgress = u => { u = L.clamp(u, 0, 1); const stops = STATIONS.map(s => s.f); const n = stops.length; const k = [0, ...stops, 1];
    const slot = 1 / (n + 1 + n); // n+1 moves, n waits, equal shares
    let acc = 0; for (let i = 0; i < k.length - 1; i++) { if (u <= acc + slot) return L.lerp(k[i], k[i + 1], L.ease.inOut((u - acc) / slot)); acc += slot; if (i < n) { if (u <= acc + slot) return k[i + 1]; acc += slot; } } return 1; };

  const HANDS = [450, 1500];
  const PIECE = 24; // half-size of the assembled square (world px)
  const pieceHome = { f1: [335, 1503], f2: [600, 1503], f3: [548, 1507], f4: [385, 1507] };
  const quad = { f1: [-1, -1], f2: [1, -1], f3: [1, 1], f4: [-1, 1] };

  const gr = L.rng(62); const specks = []; for (let i = 0; i < 90; i++) specks.push([gr() * 1400 - 160, gr() * 2300 - 190, 1 + gr() * 2]);

  // ---------- drawing helpers ----------
  const fade = (t, a, b, f = 0.3) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));
  function glow(ctx, x, y, r, col = '52,210,123', a = 0.5) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); }
  function card(ctx, lines, y, size, a, col) { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center';
    let yy = y; lines.forEach((l, i) => { const o = typeof l === 'string' ? { text: l } : l; let fz = o.size || size; ctx.font = `${fz}px "${SERIF}"`;
      while (ctx.measureText(o.text).width > 800 && fz > 30) { fz -= 4; ctx.font = `${fz}px "${SERIF}"`; }
      if (i) yy += fz * 1.06; ctx.lineJoin = 'round'; ctx.lineWidth = fz * 0.14; ctx.strokeStyle = 'rgba(12,16,22,0.95)'; ctx.strokeText(o.text, 490, yy);
      ctx.fillStyle = o.col || col || '#f4f1ea'; ctx.fillText(o.text, 490, yy); }); ctx.restore(); }
  function hand(ctx, text, x, y, size, col, a = 1, align = 'center') { L.label(ctx, text, x, y, size, { col, alpha: a, align }); }
  function slate(ctx, s) { ctx.save(); ctx.fillStyle = 'rgba(10,14,20,0.6)'; ctx.fillRect(40, 1818, 560, 58); ctx.restore(); L.slate(ctx, s); }
  function line(ctx, pts, w, col, dash) { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (dash) ctx.setLineDash(dash); ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore(); }
  function gear(ctx, x, y, r, rot, col) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.beginPath();
    for (let i = 0; i <= 48; i++) { const a = i / 48 * Math.PI * 2; const rr = r * (Math.floor(i / 3) % 2 ? 1 : 0.8); i ? ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : ctx.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); }
    ctx.closePath(); ctx.stroke(); ctx.beginPath(); ctx.arc(0, 0, r * 0.28, 0, 7); ctx.stroke(); ctx.restore(); }
  function clockFace(ctx, x, y, r, hours, { blur = 0, lw = 3 } = {}) {
    ctx.save(); ctx.fillStyle = '#1e2630'; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = lw; ctx.stroke();
    for (let i = 0; i < 12; i++) { const a = i / 12 * Math.PI * 2; ctx.lineWidth = lw * (i % 3 ? 0.5 : 1); ctx.beginPath(); ctx.moveTo(x + Math.sin(a) * r * 0.8, y - Math.cos(a) * r * 0.8); ctx.lineTo(x + Math.sin(a) * r * 0.92, y - Math.cos(a) * r * 0.92); ctx.stroke(); }
    if (blur > 0) { ctx.fillStyle = `rgba(185,195,205,${0.12 * blur})`; ctx.beginPath(); ctx.arc(x, y, r * 0.78, 0, 7); ctx.fill(); }
    else { const ma = (hours % 1) * Math.PI * 2; ctx.lineWidth = lw * 0.6; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(ma) * r * 0.78, y - Math.cos(ma) * r * 0.78); ctx.stroke(); }
    const ha = (hours % 12) / 12 * Math.PI * 2; ctx.strokeStyle = '#eef1f4'; ctx.lineWidth = lw * 1.3; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + Math.sin(ha) * r * 0.55, y - Math.cos(ha) * r * 0.55); ctx.stroke();
    ctx.fillStyle = '#eef1f4'; ctx.beginPath(); ctx.arc(x, y, lw * 1.2, 0, 7); ctx.fill(); ctx.restore(); }
  function piece(ctx, x, y, id, a = 1) { if (a <= 0) return; const [qx, qy] = quad[id]; ctx.save(); ctx.globalAlpha *= a; glow(ctx, x, y, 34, '52,210,123', 0.35);
    ctx.fillStyle = GREEN; ctx.beginPath(); ctx.roundRect(x - PIECE / 2, y - PIECE / 2, PIECE, PIECE, 3); ctx.fill();
    // a knob toward the center of the assembled square, so the pieces read as a puzzle
    ctx.beginPath(); ctx.arc(x - qx * PIECE / 2, y, 3.2, 0, 7); ctx.arc(x, y - qy * PIECE / 2, 3.2, 0, 7); ctx.fill(); ctx.restore(); }

  // ---------- the world (blueprint wall), frozen after the deal ----------
  function world(ctx, t) {
    const T = Math.min(t, T_END), day = dayAt(T), ext = extentAt(day);
    // wall + grid
    ctx.fillStyle = BG; ctx.fillRect(-300, -300, 1700, 2500);
    ctx.lineWidth = 1; for (let x = -280; x < 1400; x += 40) { ctx.strokeStyle = (x / 40) % 5 ? GRID : GRID2; ctx.beginPath(); ctx.moveTo(x, -300); ctx.lineTo(x, 2200); ctx.stroke(); }
    for (let y = -280; y < 2200; y += 40) { ctx.strokeStyle = (y / 40) % 5 ? GRID : GRID2; ctx.beginPath(); ctx.moveTo(-300, y); ctx.lineTo(1400, y); ctx.stroke(); }
    ctx.fillStyle = 'rgba(200,210,220,0.12)'; specks.forEach(([x, y, s]) => ctx.fillRect(x, y, s, s));
    // red: alert wash over the wall, strength = alert extent; flash on the closest day
    const flash = Math.exp(-Math.max(0, T - U2) * 2.2) * (T >= U2 ? 1 : 0);
    glow(ctx, 375, 1300, 520 + 300 * ext, '255,59,48', 0.05 + 0.13 * ext + 0.35 * flash);
    // title block (blueprint furniture)
    ctx.strokeStyle = DIM; ctx.lineWidth = 2; ctx.strokeRect(90, 1830, 900, 70); hand(ctx, 'sheet 1 of 1  ·  message path, two desks', 110, 1875, 30, DIM, 1, 'left');

    // desk B (the other side) at the top
    L.stick(ctx, 540, 520, 0.8, { mood: 'glazed', col: '#8b95a1', pose: { armL: 1.1, armR: 1.1 }, seed: 9 });
    ctx.fillStyle = DESK; ctx.fillRect(380, 495, 320, 28); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.strokeRect(380, 495, 320, 28);
    ctx.fillStyle = '#212831'; ctx.fillRect(390, 523, 300, 80); ctx.strokeStyle = DIM; ctx.strokeRect(390, 523, 300, 80);
    hand(ctx, 'desk', 540, 640, 28, DIM);

    // the machine: pipe, stations
    line(ctx, PATH, 14, '#232b35'); line(ctx, PATH, 2.5, INK); line(ctx, PATH, 1, DIM, [6, 8]);
    STATIONS.forEach((s, i) => { const [x, y] = s.p; ctx.fillStyle = '#1b222c'; ctx.fillRect(x - 46, y - 34, 92, 68); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.strokeRect(x - 46, y - 34, 92, 68);
      gear(ctx, x - 14, y - 4, 20, T * 0.6 * (i % 2 ? -1 : 1), DIM); gear(ctx, x + 17, y + 6, 13, -T * 0.9 * (i % 2 ? -1 : 1), DIM);
      hand(ctx, s.name, x, y + 62, 30, INK); });
    // outlet chute above her desk
    ctx.strokeStyle = INK; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(645, 1300); ctx.lineTo(640, 1330); ctx.moveTo(675, 1300); ctx.lineTo(680, 1330); ctx.stroke();

    // wall calendar: 13 day boxes, crossed off (tally, no numerals)
    for (let i = 0; i < 13; i++) { const x = 150 + i * 60, y = 1700; ctx.strokeStyle = DIM; ctx.lineWidth = 2; ctx.strokeRect(x, y, 44, 44);
      const done = L.clamp(day - i - 1, 0, 1); if (done > 0) { line(ctx, [[x + 6, y + 6], [x + 6 + 32 * Math.min(1, done * 2), y + 6 + 32 * Math.min(1, done * 2)]], 3, INK);
        if (done > 0.5) line(ctx, [[x + 38, y + 6], [x + 38 - 32 * (done - 0.5) * 2, y + 6 + 32 * (done - 0.5) * 2]], 3, INK); } }
    hand(ctx, 'days', 150, 1680, 28, DIM, 1, 'left');

    // alert meter (red only for lit segments)
    hand(ctx, 'alert', 290, 1278, 26, DIM, 1, 'left');
    for (let i = 0; i < 4; i++) { const x = 290 + i * 44, lit = ext >= (i + 1) * 0.25 - 1e-6; const blink = lit && i === 2 && flash > 0 ? (Math.floor(T * 10) % 2 ? 0.5 : 1) : 1;
      if (lit) { glow(ctx, x + 19, 1302, 44, '255,59,48', 0.45); ctx.fillStyle = RED; ctx.globalAlpha = blink; ctx.fillRect(x, 1290, 38, 24); ctx.globalAlpha = 1; }
      ctx.strokeStyle = lit ? RED : DIM; ctx.lineWidth = 2; ctx.strokeRect(x, 1290, 38, 24); }

    // her: the translator
    const mood = T < 1.2 ? 'glazed' : T < U2 ? (T > f2arr ? 'sad' : 'glazed') : T < dealT ? 'panic' : 'awe';
    const look = T < 1.2 ? [0, 0] : T < 3 ? [-0.6, -1] : T >= dealT ? [0, 1] : T > f2arr - 0.3 ? [0.6, 0.6] : [0.3, 0];
    L.stick(ctx, 450, 1560, 1.25, { mood, col: '#dde2e7', pose: { armL: 1.05, armR: 1.05, lean: 0 }, seed: 4, look });
    // her desk
    ctx.fillStyle = DESK; ctx.fillRect(250, 1515, 420, 34); ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.strokeRect(250, 1515, 420, 34);
    ctx.fillStyle = '#212831'; ctx.fillRect(262, 1549, 396, 100); ctx.strokeStyle = DIM; ctx.strokeRect(262, 1549, 396, 100);
    line(ctx, [[300, 1575], [620, 1575]], 1.5, DIM, [6, 6]);
    // desk clock
    ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(545, 1515); ctx.lineTo(560, 1497); ctx.lineTo(580, 1497); ctx.lineTo(595, 1515); ctx.stroke();
    clockFace(ctx, 570, 1460, 36, day * 24, { blur: T < T_END ? 1 : 0, lw: 2.4 });

    // green pieces
    const toHands = L.ease.inOut(L.sm(dealT - 0.8, dealT, T));
    const center = HANDS;
    const pos = id => { const home = pieceHome[id]; const tgt = [center[0] + quad[id][0] * PIECE / 2, center[1] + quad[id][1] * PIECE / 2]; return [L.lerp(home[0], tgt[0], toHands), L.lerp(home[1], tgt[1], toHands)]; };
    // f1: already on her desk, from before frame 1
    piece(ctx, ...pos('f1'), 'f1');
    // f2 and f3 travel the machine (stop-start), then drop from the chute
    [['f2', f2dep, f2arr], ['f3', f3dep, f3arr]].forEach(([id, dep, arr]) => {
      if (T < dep) return;
      if (T < arr) { const p = along(machineProgress((T - dep) / (arr - dep))); piece(ctx, p[0], p[1], id); return; }
      const drop = L.ease.in(L.sm(arr, arr + 0.3, T)); const home = pieceHome[id];
      if (drop < 1) piece(ctx, L.lerp(660, home[0], drop), L.lerp(1300, home[1], drop), id); else piece(ctx, ...pos(id), id); });
    // f4: the back channel, slid across the desk in person (bypasses the machine)
    if (T >= f4arr - 0.6) { const s = L.ease.out(L.sm(f4arr - 0.6, f4arr, T)); if (s < 1) piece(ctx, L.lerp(200, pieceHome.f4[0], s), pieceHome.f4[1], 'f4'); else piece(ctx, ...pos('f4'), 'f4'); }
    // assembled
    if (T >= dealT) { glow(ctx, center[0], center[1], 90, '52,210,123', 0.55); ctx.strokeStyle = GREEN; ctx.lineWidth = 2; ctx.strokeRect(center[0] - PIECE - 3, center[1] - PIECE - 3, PIECE * 2 + 6, PIECE * 2 + 6); }
  }

  // ---------- snap sheets (screen space, full frame) ----------
  function sheetBG(ctx) { ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920); ctx.lineWidth = 1;
    for (let x = 0; x <= 1080; x += 40) { ctx.strokeStyle = (x / 40) % 5 ? GRID : GRID2; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 1920); ctx.stroke(); }
    for (let y = 0; y <= 1920; y += 40) { ctx.strokeStyle = (y / 40) % 5 ? GRID : GRID2; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1080, y); ctx.stroke(); } }

  const SNAP0 = 21.2, SNAPGO = 21.6;
  function clocksSheet(ctx, t) {
    sheetBG(ctx);
    const u = Math.max(0, t - SNAPGO);
    const humanH = Math.min(u * HRS_PER_S, LAT.worst); // 12 h at the race mapping = 2 s
    const aiH = Math.min(u * HRS_PER_S, 10 / 60);      // ~10 minutes (illustrative)
    // top: as it was
    hand(ctx, 'as it was', 490, 300, 50, INK);
    clockFace(ctx, 400, 560, 190, 9 + humanH, { lw: 6 });
    const hDone = humanH >= LAT.worst - 1e-6;
    ctx.strokeStyle = DIM; ctx.lineWidth = 3; ctx.strokeRect(650, 520, 170, 80);
    ctx.fillStyle = hDone ? GREEN : 'rgba(52,210,123,0.25)'; ctx.fillRect(654, 524, 162 * (humanH / LAT.worst), 72);
    hand(ctx, 'letter', 735, 640, 32, DIM);
    card(ctx, ['12 hours to decode'], 860, 64, L.sm(SNAPGO + 2.0, SNAPGO + 2.3, t));
    // bottom: frontier AI translating (illustrative)
    hand(ctx, 'frontier AI translating', 490, 1030, 50, INK);
    clockFace(ctx, 400, 1270, 190, 9 + aiH, { lw: 6 });
    const aDone = u > 0.03;
    ctx.strokeStyle = DIM; ctx.lineWidth = 3; ctx.strokeRect(650, 1230, 170, 80);
    ctx.fillStyle = aDone ? GREEN : 'rgba(52,210,123,0.25)'; ctx.fillRect(654, 1234, 162 * Math.min(1, u / 0.03), 72);
    hand(ctx, 'letter', 735, 1350, 32, DIM);
    hand(ctx, 'illustrative: minutes, not hours', 490, 1540, 40, '#d6dbe0', L.sm(SNAPGO + 0.3, SNAPGO + 0.6, t));
    hand(ctx, 'people still read and decide', 490, 1600, 36, DIM, L.sm(SNAPGO + 0.9, SNAPGO + 1.2, t));
    if (u > 0 && u < 0.35) { ctx.fillStyle = `rgba(255,255,255,${0.25 * (1 - u / 0.35)})`; ctx.fillRect(0, 0, 1080, 1920); }
  }

  const REC0 = 24.9, RECDUR = 2.5, SPAN = 260, X0 = 110, X1 = 890;
  const xOf = d => X0 + (X1 - X0) * d / SPAN;
  function recordSheet(ctx, t) {
    sheetBG(ctx);
    const head = L.clamp((t - REC0) / RECDUR, 0, 1) * SPAN;
    hand(ctx, 'the whole record, to scale', 490, 280, 44, INK);
    const lanes = [{ y: 640, label: 'as it was', deal: DEAL, curve: true }, { y: 900, label: 'frontier AI translating (illustrative)', deal: AIDEAL, curve: false }];
    lanes.forEach(ln => {
      hand(ctx, ln.label, X0, ln.y - 150, 36, INK, 1, 'left');
      line(ctx, [[X0, ln.y], [X1, ln.y]], 2, DIM);
      for (let d = 0; d <= SPAN; d += 30) line(ctx, [[xOf(d), ln.y], [xOf(d), ln.y + 10]], 2, DIM);
      // red: alert raised from day 6; its end is not dated in the data, so it fades without a date
      for (let d = pts[1].t; d < Math.min(head, 60); d += 0.5) { const a = d <= DEAL ? 1 : Math.max(0, 1 - (d - DEAL) / 40); ctx.fillStyle = `rgba(255,59,48,${0.85 * a})`; ctx.fillRect(xOf(d), ln.y - 26, xOf(0.5) - X0 + 0.6, 22); }
      if (ln.curve) { ctx.strokeStyle = GREEN; ctx.lineWidth = 3; ctx.beginPath(); for (let d = 0; d <= head; d += 0.5) { const y = ln.y - 20 - 110 * L.lognormalCDF(d, MED, P90); d ? ctx.lineTo(xOf(d), y) : ctx.moveTo(xOf(d), y); } ctx.stroke(); }
      if (head >= ln.deal) { glow(ctx, xOf(ln.deal), ln.y, 30); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(xOf(ln.deal), ln.y, 8, 0, 7); ctx.fill(); }
    });
    // playhead
    if (head < SPAN) line(ctx, [[xOf(head), 470], [xOf(head), 930]], 2, '#e6eaee');
    // the direct line (a human structural fix; shared across both lanes, not claimed for AI)
    if (head >= FIX) { const a = L.sm(0, 0.3, t - (REC0 + RECDUR * FIX / SPAN)); ctx.save(); ctx.globalAlpha = a; line(ctx, [[xOf(FIX), 470], [xOf(FIX), 930]], 4, GREEN, [10, 8]); glow(ctx, xOf(FIX), 640, 50); ctx.restore();
      hand(ctx, 'direct line', xOf(FIX) - 12, 1000, 36, GREEN, a, 'right'); }
    // loupe on days 8..14
    const la = L.sm(REC0 + RECDUR + 0.1, REC0 + RECDUR + 0.5, t);
    if (la > 0) { ctx.save(); ctx.globalAlpha = la; const cx = 390, cy = 1280, R = 190;
      line(ctx, [[xOf(8), 660], [cx - 60, cy - R + 20]], 2, DIM, [4, 6]);
      ctx.fillStyle = '#1b232d'; ctx.beginPath(); ctx.arc(cx, cy, R, 0, 7); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
      const lx = d => cx + (d - 11.5) * 52;
      [[cy - 60, DEAL], [cy + 60, AIDEAL]].forEach(([y, dd]) => { line(ctx, [[lx(8.8), y], [lx(14.2), y]], 2, DIM);
        for (let d = 9; d <= 14; d++) line(ctx, [[lx(d), y - 8], [lx(d), y + 8]], 2, DIM);
        glow(ctx, lx(dd), y, 30); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(lx(dd), y, 11, 0, 7); ctx.fill(); });
      hand(ctx, 'as it was', cx, cy - 90, 28, DIM); hand(ctx, 'illustrative', cx, cy + 105, 28, DIM);
      ctx.restore(); }
    card(ctx, ['The direct line', { text: 'took 247 days.', col: GREEN }], 1590, 84, L.sm(REC0 + RECDUR * FIX / SPAN + 0.3, REC0 + RECDUR * FIX / SPAN + 0.7, t));
  }

  // ---------- camera ----------
  const CAM = [[0, [470, 1430, 2.6, 0]], [5.6, [470, 1430, 2.6, 0]], [8.6, [540, 960, 1, 0]], [13.4, [540, 960, 1, 0]], [16.0, [450, 1470, 3.4, 0]], [21.2, [450, 1475, 3.55, 0]]];
  const CAM2 = [[29.2, [450, 1470, 4.2, 0]], [33.8, [450, 1480, 4.6, 0]]];

  function draw(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    if (t < SNAP0 || t >= 29.2) {
      ctx.save(); L.camera(ctx, t < SNAP0 ? CAM : CAM2, t); world(ctx, t); ctx.restore();
    }
    if (t < SNAP0) {
      if (t >= dealT + 0.2) { ctx.fillStyle = `rgba(8,11,16,${0.45 * L.sm(dealT + 0.2, 18.4, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
      card(ctx, ['The answer is in the mail.'], 330, 84, t < 0.05 ? 1 : fade(t, -1, 2.8));
      card(ctx, ['Alarms are instant.', "Letters aren't."], 300, 84, fade(t, 3.1, 5.5));
      card(ctx, ['Two desks.', 'One slow machine.'], 250, 80, fade(t, 8.7, 10.9));
      card(ctx, ['Nearly 12 hours', 'to decode.'], 250, 80, fade(t, f2arr + 0.1, f2arr + 2.3));
      card(ctx, ['The closest day', 'came first.'], 330, 84, fade(t, 13.9, 16.0));
      card(ctx, ['We slowed it down', 'so you could see it.'], 330, 84, fade(t, 18.6, 21.1, 0.4));
      slate(ctx, t < 5.6 ? 'SC1  CLOSE  LOCKED-OFF' : t < 8.6 ? 'SC2  PULL-OUT' : t < 13.4 ? 'SC3  WIDE' : t < 16 ? 'SC4  DOLLY IN' : t < 18.6 ? 'SC4  CLOSER  (dead stop)' : 'SC5  CARD');
    } else if (t < 29.2) {
      if (t < 24.6) { clocksSheet(ctx, t); slate(ctx, 'SC6  INSERT  TWO CLOCKS'); }
      else { recordSheet(ctx, t); slate(ctx, 'SC7  THE WHOLE RECORD'); }
      // hard cut into the record sheet via a quick full-frame dip
      if (t > 24.3 && t < 24.9) { const a = 1 - Math.abs(t - 24.6) / 0.3; ctx.fillStyle = `rgba(22,29,38,${a})`; ctx.fillRect(0, 0, 1080, 1920); }
    } else {
      // full-frame fade from the record sheet back into the world
      const a = 1 - L.sm(29.2, 29.9, t); if (a > 0) { ctx.save(); ctx.globalAlpha = a; recordSheet(ctx, 29.2); ctx.restore(); }
      card(ctx, ['This is the bottleneck.'], 330, 92, fade(t, 31.4, 33.8, 0.35));
      slate(ctx, 'SC8  CLOSEST');
      if (t >= 33.8) L.endCard(ctx, L.sm(33.8, 34.2, t), { line: 'The bottleneck is us.' });
    }
    L.grain(ctx, t, { alpha: 0.04, n: 400 });
  }

  return {
    draw, DUR,
    acts: [{ start: 0, end: 17.2, bpm: 0, drone: true }, { start: 9, end: 17, bpm: 52 }, { start: 24.6, end: 38, bpm: 0, drone: true }],
    cues: [{ t: 1.0, type: 'hit' }, { t: 5.6, type: 'whoosh' }, { t: f2arr, type: 'pop' }, { t: U2, type: 'bonk' }, { t: f3arr, type: 'pop' }, { t: f4arr, type: 'pop' },
      { t: dealT, type: 'ding' }, { t: SNAPGO, type: 'hit' }, { t: SNAPGO + 2.0, type: 'pop' }, { t: REC0, type: 'whoosh' }, { t: REC0 + RECDUR * FIX / SPAN, type: 'ding' }, { t: 33.8, type: 'hit' }]
  };
}
if (typeof module !== 'undefined') module.exports = makeScene;
