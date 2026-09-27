// the-arms-race: split-screen-race, neon arcade, game. Analog: penicillin-resistance-1946.
// Race mapping: 1 film second = 1 year (t 3.6 = year 0 ... t 18.6 = year 15). See output/the-arms-race/notes.md.
// Red: L.logistic(yr, 0.56 derived doubling, s0 0.125) over an 8x8 grid of one hospital's samples; cells past extent(1.75) drawn lighter ("fit").
// Green: 9 players, piece i connects at L.lognormalQuantile((i+.5)/9, 13, 69); controller works at 5 of 9 = year 13. Red beats it again at year 15.
// AI (illustrative, snap only): routed response at year 2.5, position only; anonymous links x 2.5/13; chemistry still at 13.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('penicillin-resistance-1946');
  const DUR = 36, RED = L.RED, GREEN = L.GREEN;
  const BG = '#05060a', WHITE = '#e9ecf2', GRAY = '#8b909b', DGRAY = '#3a3f4a', FAINT = '#1b1f28';

  // ---------- speed math ----------
  const DT = A.threat.doubling_time, S0 = A.threat.points[0].extent;       // 0.56 (derived), 0.125
  const ext = y => L.logistic(Math.max(0, y), DT, S0);
  const FIT_FROM = 1.75;                                                   // beyond this: extrapolation, drawn lighter
  const MEAS_CELLS = ext(FIT_FROM) * 64;                                   // 35.5
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90; // 13, 69
  const NEXT = A.solution.fragments.find(f => f.id === 'f3').ready_at;     // 13
  const BEATEN = A.solution.fragments.find(f => f.id === 'f4').ready_at;   // 15
  const AIMED = A.ai_counterfactual.aggregation_median;                    // 2.5 (assumption)
  const N = 9, HERO = 4;
  const Q = []; for (let i = 0; i < N; i++) Q.push(L.lognormalQuantile((i + 0.5) / N, MED, P90));
  const QA = Q.map(q => q * AIMED / MED);
  const connected = yr => Q.filter(q => yr >= q).length;
  const works = yr => connected(yr) >= 5;                                  // majority = median = year 13

  // film time -> year
  const T0 = 3.6, T_END = T0 + BEATEN;                                     // 18.6
  const yearAt = t => { if (t < 1.5) return 4; if (t < 1.9) return L.lerp(4, 0, L.ease.inOut((t - 1.5) / 0.4));
    if (t < T0) return 0; return Math.min(BEATEN, t - T0); };
  const tOf = y => T0 + y;

  // ---------- world layout ----------
  const r = L.rng(1946);
  const CELL = 78, GX = 540 - 4 * CELL, GY = 262;
  const order = [...Array(64).keys()]; for (let i = 63; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  const rank = []; order.forEach((c, k) => { rank[c] = k; });
  const back = [5, 22, 47];                                                // cells that return at year 15
  const INV = ['..X.....X..', '...X...X...', '..XXXXXXX..', '.XX.XXX.XX.', 'XXXXXXXXXXX', 'X.XXXXXXX.X', 'X.X.....X.X', '...XX.XX...'];
  const INV2 = ['..X.....X..', 'X..X...X..X', 'X.XXXXXXX.X', 'XXX.XXX.XXX', 'XXXXXXXXXXX', '.XXXXXXXXX.', '..X.....X..', '.X.......X.'];
  const DIV = 960, CTRL = [560, 1450];
  const PL = [[830, 1190, 1.0], [165, 1560, 1.0], [935, 1500, 1.0], [735, 1770, 1.0], [270, 1200, 1.3], [430, 1790, 1.0], [960, 1800, 0.95], [590, 1160, 0.95], [120, 1820, 0.95]];
  const P = PL.map(([x, y, s], i) => ({ x, y, s, i, ph: r() * 6.28, f: x < CTRL[0] ? 1 : -1 }));
  P.forEach(p => { p.hand = [p.x + p.f * 41 * p.s, p.y - 31 * p.s]; });
  // controller slots: 5 across the top, 4 below
  const SLOT = []; for (let k = 0; k < 5; k++) SLOT.push([CTRL[0] - 128 + k * 64, CTRL[1] - 30]); for (let k = 0; k < 4; k++) SLOT.push([CTRL[0] - 96 + k * 64, CTRL[1] + 36]);
  const slotOf = [0, 5, 4, 7, 1, 8, 6, 3, 2];                              // player -> slot (near-side-ish)
  const stars = []; for (let i = 0; i < 160; i++) stars.push([r() * 1080, r() * 1920, r()]);

  // ---------- drawing helpers ----------
  const glowLine = (ctx, x1, y1, x2, y2, col, w, a = 1) => { ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = col;
    ctx.globalAlpha = 0.18 * a; ctx.lineWidth = w * 4; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
    ctx.globalAlpha = a; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.restore(); };
  const halo = (ctx, x, y, rad, col, a) => { const g = ctx.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = g; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2); ctx.restore(); };
  function invader(ctx, x, y, px, col, alpha, frame, outline) {
    const pat = frame ? INV2 : INV; ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = col; ctx.strokeStyle = col; ctx.lineWidth = 1.5;
    for (let row = 0; row < 8; row++) for (let c = 0; c < 11; c++) if (pat[row][c] === 'X') {
      const xx = x - 5.5 * px + c * px, yy = y - 4 * px + row * px; outline ? ctx.strokeRect(xx + 1, yy + 1, px - 2, px - 2) : ctx.fillRect(xx, yy, px - 0.5, px - 0.5); }
    ctx.restore(); }
  function piece(ctx, x, y, s, col, a = 1) {                               // a controller piece: rounded plus-block
    ctx.save(); ctx.globalAlpha = a; halo(ctx, x, y, 34 * s, col, 0.45 * a); ctx.globalAlpha = a; ctx.fillStyle = col;
    ctx.beginPath(); ctx.roundRect(x - 16 * s, y - 11 * s, 32 * s, 22 * s, 6 * s); ctx.fill();
    ctx.fillStyle = BG; ctx.fillRect(x - 9 * s, y - 2 * s, 8 * s, 4 * s); ctx.fillRect(x - 7 * s, y - 4 * s, 4 * s, 8 * s);
    ctx.beginPath(); ctx.arc(x + 7 * s, y, 3 * s, 0, 7); ctx.fill(); ctx.restore(); }

  function redGrid(ctx, yr, t) {
    const e = ext(yr), n = e * 64, answered = L.sm(NEXT, NEXT + 0.6, yr), frame = Math.floor(t * 2) % 2;
    for (let c = 0; c < 64; c++) {
      const cx = GX + (c % 8 + 0.5) * CELL, cy = GY + (Math.floor(c / 8) + 0.5) * CELL, k = rank[c];
      let isRed = k < n, fit = k >= MEAS_CELLS;
      if (answered > 0 && isRed) { const sweep = answered * 1.2 - (7 - Math.floor(c / 8)) / 8 * 0.2; if (sweep > 0.2) isRed = false; }
      const ret = yr >= BEATEN - 0.01 && back.includes(c);
      if (ret) { isRed = true; fit = false; }
      if (isRed) { halo(ctx, cx, cy, 52, RED, fit ? 0.12 : 0.3); invader(ctx, cx, cy, 5, RED, fit ? 0.5 : 1, frame, fit); }
      else invader(ctx, cx, cy, 5, answered > 0.2 && k < n ? '#5b606b' : DGRAY, 0.9, frame, false);
    }
    // frame + HUD labels
    ctx.save(); ctx.strokeStyle = DGRAY; ctx.lineWidth = 2; ctx.strokeRect(GX - 14, GY - 14, CELL * 8 + 28, CELL * 8 + 28); ctx.restore();
    L.label(ctx, 'THE RED', GX - 10, GY - 40, 44, { col: RED, font: SERIF, align: 'left' });
    L.label(ctx, "one hospital's samples", GX + CELL * 8 + 10, GY - 42, 30, { col: GRAY, align: 'right' });
  }
  function divider(ctx, yr) {
    const x0 = 80, x1 = 1000, e = ext(yr), answered = L.sm(NEXT, NEXT + 0.6, yr);
    glowLine(ctx, 0, DIV, 1080, DIV, WHITE, 3, 0.55);
    const fx = L.lerp(x0, x1, Math.min(e, ext(FIT_FROM))), ex = L.lerp(x0, x1, e);
    ctx.save(); ctx.globalAlpha = 1 - answered;
    ctx.fillStyle = RED; ctx.fillRect(x0, DIV - 22, fx - x0, 16);
    if (ex > fx) { ctx.globalAlpha = 0.45 * (1 - answered); ctx.fillRect(fx, DIV - 22, ex - fx, 16); ctx.globalAlpha = 1 - answered;
      ctx.strokeStyle = RED; ctx.setLineDash([8, 8]); ctx.lineWidth = 2; ctx.strokeRect(fx, DIV - 22, ex - fx, 16); ctx.setLineDash([]); }
    ctx.restore();
    if (yr > FIT_FROM + 0.2 && answered < 1) L.label(ctx, 'derived fit', Math.min(ex, 880), DIV - 34, 28, { col: RED, align: 'right', alpha: 0.7 * (1 - answered) });
    if (yr >= BEATEN - 0.01) { ctx.fillStyle = RED; ctx.fillRect(x0, DIV - 22, 28, 16); }
    L.label(ctx, 'EVERYONE ELSE', 545, DIV + 62, 44, { col: WHITE, font: SERIF, align: 'left' });
  }
  function floor(ctx) {
    ctx.save(); ctx.strokeStyle = FAINT; ctx.lineWidth = 2;
    for (let k = 0; k < 9; k++) { const y = 1000 + k * k * 11.5; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(1080, y); ctx.stroke(); }
    for (let k = -8; k <= 8; k++) { ctx.beginPath(); ctx.moveTo(540 + k * 40, 1000); ctx.lineTo(540 + k * 190, 1920); ctx.stroke(); }
    ctx.restore(); }
  function controller(ctx, yr, t) {
    const ok = works(yr), [cx, cy] = CTRL, w = ok ? 1 : 0;
    ctx.save(); ctx.strokeStyle = ok ? GREEN : GRAY; ctx.lineWidth = 4; ctx.globalAlpha = ok ? 1 : 0.8;
    if (ok) halo(ctx, cx, cy, 300, GREEN, 0.25);
    ctx.beginPath(); ctx.moveTo(cx - 170, cy - 80); ctx.lineTo(cx + 170, cy - 80); ctx.quadraticCurveTo(cx + 250, cy - 80, cx + 240, cy + 40);
    ctx.quadraticCurveTo(cx + 235, cy + 120, cx + 170, cy + 110); ctx.lineTo(cx + 110, cy + 80); ctx.lineTo(cx - 110, cy + 80); ctx.lineTo(cx - 170, cy + 110);
    ctx.quadraticCurveTo(cx - 235, cy + 120, cx - 240, cy + 40); ctx.quadraticCurveTo(cx - 250, cy - 80, cx - 170, cy - 80); ctx.stroke(); ctx.restore();
    SLOT.forEach(([sx, sy]) => { ctx.save(); ctx.strokeStyle = DGRAY; ctx.setLineDash([5, 5]); ctx.lineWidth = 2; ctx.beginPath(); ctx.roundRect(sx - 18, sy - 13, 36, 26, 6); ctx.stroke(); ctx.restore(); });
    return w; }
  function players(ctx, yr, t, heroMood) {
    // attempted links between players who haven't connected: dashed, flickering, breaking
    for (let i = 0; i < N; i++) { const a = P[i], b = P[(i + 3) % N]; if (yr >= Q[i] || yr >= Q[b.i]) continue;
      const on = L.noise(t * 1.6 + i * 3.1, 7) > 0.52; if (!on) continue; const f = L.clamp((L.noise(t * 2.2 + i, 9) - 0.2) * 1.4, 0.1, 0.55);
      ctx.save(); ctx.setLineDash([10, 12]); ctx.strokeStyle = GRAY; ctx.globalAlpha = 0.55; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(a.hand[0], a.hand[1]); ctx.lineTo(L.lerp(a.hand[0], b.hand[0], f), L.lerp(a.hand[1], b.hand[1], f)); ctx.stroke(); ctx.restore(); }
    P.forEach(p => {
      const q = Q[p.i], [sx, sy] = SLOT[slotOf[p.i]], fly = L.clamp((yr - q) / 0.45, 0, 1), hero = p.i === HERO;
      if (fly > 0) glowLine(ctx, p.hand[0], p.hand[1], L.lerp(p.hand[0], sx, L.ease.out(fly)), L.lerp(p.hand[1], sy, L.ease.out(fly)), GREEN, 3, 0.9);
      halo(ctx, p.x, p.y - 90 * p.s, 110 * p.s, '#9aa4b8', 0.12);
      const mood = hero ? heroMood : (fly >= 1 ? 'happy' : yr > 6 ? 'sad' : 'bored');
      const armR = fly > 0 ? 1.5 : 1.1 + 0.08 * Math.sin(t * 3 + p.ph);
      L.stick(ctx, p.x, p.y, p.s, { col: '#cfd4de', mood, t, seed: p.i + 3, pose: { armR, armL: 0.35, lean: 0.05 * p.f }, look: hero ? [0.3, -1] : [p.f, -0.5] });
      const px = fly > 0 ? L.lerp(p.hand[0], sx, L.ease.out(fly)) : p.hand[0] + (hero ? Math.sin(t * 40) * 1.2 * L.sm(10, 12, yr) : 0);
      const py = fly > 0 ? L.lerp(p.hand[1], sy, L.ease.out(fly)) : p.hand[1];
      piece(ctx, px, py, fly > 0 ? L.lerp(p.s, 1, fly) : p.s, GREEN);
    });
  }
  function heroLight(ctx, yr) {                                            // the face lit from above by the red, from below by the piece
    const h = P[HERO], e = ext(yr) * (1 - L.sm(NEXT, NEXT + 0.6, yr)) + (yr >= BEATEN - 0.01 ? 0.3 : 0);
    const hx = h.x, hy = h.y - 86 * h.s; ctx.save(); ctx.globalCompositeOperation = 'lighter';
    halo(ctx, hx, hy - 40, 90, RED, 0.35 * e); halo(ctx, h.hand[0], h.hand[1], 70, GREEN, 0.25); ctx.restore(); }
  function beam(ctx, yr) {
    const a = L.sm(NEXT, NEXT + 0.15, yr) * (1 - L.sm(NEXT + 0.8, NEXT + 1.4, yr)); if (a <= 0) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = a; const gr = ctx.createLinearGradient(0, CTRL[1], 0, GY);
    gr.addColorStop(0, 'rgba(52,210,123,0.9)'); gr.addColorStop(1, 'rgba(52,210,123,0.1)'); ctx.fillStyle = gr;
    ctx.fillRect(CTRL[0] - 30, GY, 60, CTRL[1] - GY); ctx.fillRect(CTRL[0] - 90, GY, 180, CTRL[1] - GY); ctx.restore(); }
  function world(ctx, yr, t, heroMood) {
    ctx.fillStyle = BG; ctx.fillRect(-2000, -2000, 5080, 5920);
    stars.forEach(([x, y, v]) => { if (y < DIV) { ctx.fillStyle = v > 0.8 ? '#2a2f3a' : '#141820'; ctx.fillRect(x, y, 3, 3); } });
    floor(ctx); redGrid(ctx, yr, t); controller(ctx, yr, t); beam(ctx, yr); divider(ctx, yr); players(ctx, yr, t, heroMood); heroLight(ctx, yr);
  }

  // ---------- screen-space helpers ----------
  function card(ctx, lines, y, size, a, cols = []) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center'; let yy = y;
    lines.forEach((l, i) => { let fz = size; ctx.font = `${fz}px "${SERIF}"`; const w = ctx.measureText(l).width; if (w > 790) { fz *= 790 / w; ctx.font = `${fz}px "${SERIF}"`; }
      if (i) yy += fz * 1.08; const ww = ctx.measureText(l).width; ctx.save(); ctx.globalAlpha = a * 0.62; ctx.fillStyle = BG; ctx.fillRect(490 - ww / 2 - 24, yy - fz * 0.82, ww + 48, fz * 1.08); ctx.restore(); ctx.lineWidth = fz * 0.16; ctx.strokeStyle = BG; ctx.lineJoin = 'round'; ctx.strokeText(l, 490, yy); ctx.fillStyle = cols[i] || '#fffdf7'; ctx.fillText(l, 490, yy); });
    ctx.restore(); }
  const win = (t, a, b, f = 0.3) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));
  function scan(ctx, a = 0.1) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#000'; for (let y = 0; y < 1920; y += 6) ctx.fillRect(0, y, 1080, 2); ctx.restore();
    const g = ctx.createRadialGradient(540, 960, 500, 540, 960, 1250); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.65)'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920); }

  // camera: [t, [x, y, zoom, rot]]; handheld chase shake grows with the pace
  const CAM = [
    [0, [300, 1000, 2.0, 0]], [1.5, [300, 1010, 2.1, 0]], [1.9, [300, 1150, 2.4, 0]], [6.0, [300, 1140, 2.55, 0]],
    [8.4, [540, 960, 1.0, 0]], [12.4, [540, 965, 1.03, 0]], [14.6, [290, 1150, 3.2, 0]], [16.4, [287, 1140, 3.45, 0]],
    [17.2, [470, 1010, 1.35, 0]], [18.4, [480, 1000, 1.4, 0]], [19.0, [285, 1130, 4.0, 0]], [20.0, [285, 1130, 4.1, 0]], [22.4, [285, 1130, 4.25, 0]],
  ];
  const shakeAmp = t => t < 20 ? L.lerp(4, 14, L.clamp((t - 1.9) / 17, 0, 1)) * (t > 6 && t < 8.4 ? 2 : 1) * (t > 18.4 && t < 19.2 ? 2.5 : 1) : 0;
  function camera(ctx, t) {
    L.camera(ctx, CAM, t); const k = L.key(CAM, t), a = shakeAmp(t) / k[2];
    ctx.translate((L.noise(t * 3.1, 11) - 0.5) * 2 * a, (L.noise(t * 2.7, 13) - 0.5) * 2 * a); }

  // snap panels (screen space)
  const AX0 = 120, AX1 = 900, ax = y => L.lerp(AX0, AX1, y / BEATEN);
  function panel(ctx, y0, yrs, ai, a) {
    ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = '#0b0d13'; ctx.fillRect(70, y0, 920, 440); ctx.strokeStyle = ai ? GREEN : GRAY; ctx.lineWidth = 3; ctx.strokeRect(70, y0, 920, 440);
    ctx.font = `52px "${SERIF}"`; ctx.textAlign = 'left'; ctx.fillStyle = WHITE; ctx.fillText(ai ? 'Routed' : 'As it happened', 100, y0 + 68);
    if (ai) { ctx.font = `46px "${HAND}"`; ctx.fillStyle = GREEN; ctx.fillText('illustrative', 300, y0 + 66); }
    // red row: share over time (area), lighter past the measured fit, gone at the next answer, back at the counter-move
    const rb = y0 + 200, rh = 90;
    for (let y = 0; y < Math.min(yrs, NEXT); y += 0.05) { const e = ext(y); ctx.fillStyle = RED; ctx.globalAlpha = a * (y > FIT_FROM ? 0.45 : 1); ctx.fillRect(ax(y), rb - e * rh, ax(0.05) - ax(0) + 0.5, e * rh); }
    ctx.globalAlpha = a;
    if (yrs >= BEATEN - 0.05 && !ai) { ctx.fillStyle = RED; ctx.fillRect(ax(BEATEN) - 8, rb - 60, 16, 60); }
    if (yrs >= BEATEN - 0.05 && ai) { ctx.fillStyle = RED; ctx.fillRect(ax(BEATEN) - 8, rb - 60, 16, 60); }
    // axis (no numerals: position only)
    const gy = y0 + 330; ctx.strokeStyle = GRAY; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(AX0, gy); ctx.lineTo(AX1, gy); ctx.stroke();
    for (let y = 0; y <= BEATEN; y++) { ctx.beginPath(); ctx.moveTo(ax(y), gy - 6); ctx.lineTo(ax(y), gy + 6); ctx.stroke(); }
    // green: each link as a dot when it connects; the answer as a diamond
    const QQ = ai ? QA : Q; QQ.forEach((q, i) => { if (q <= yrs && q <= BEATEN) { ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(ax(q), gy - 34 - (i % 3) * 16, 8, 0, 7); ctx.fill(); } });
    const dia = (x, y, s, fill) => { ctx.beginPath(); ctx.moveTo(x, y - s); ctx.lineTo(x + s, y); ctx.lineTo(x, y + s); ctx.lineTo(x - s, y); ctx.closePath(); if (fill) { ctx.fillStyle = GREEN; ctx.fill(); } else { ctx.strokeStyle = GREEN; ctx.lineWidth = 3; ctx.stroke(); } };
    if (!ai && yrs >= NEXT) { halo(ctx, ax(NEXT), gy - 70, 60, GREEN, 0.5 * a); ctx.globalAlpha = a; dia(ax(NEXT), gy - 70, 22, true);
      ctx.font = `48px "${HAND}"`; ctx.textAlign = 'right'; ctx.fillStyle = GREEN; ctx.fillText('13 years', ax(NEXT) - 34, gy - 58); }
    if (ai && yrs >= AIMED) { halo(ctx, ax(AIMED), gy - 70, 70, GREEN, 0.6 * a); ctx.globalAlpha = a; dia(ax(AIMED), gy - 70, 24, true);
      ctx.font = `46px "${HAND}"`; ctx.textAlign = 'left'; ctx.fillStyle = GREEN; ctx.fillText('routed response', ax(AIMED) + 36, gy - 58); }
    if (ai && yrs >= NEXT) { ctx.globalAlpha = a * 0.7; dia(ax(NEXT), gy - 70, 20, false); }
    if (ai) { ctx.globalAlpha = a; ctx.font = `44px "${HAND}"`; ctx.textAlign = 'left'; ctx.fillStyle = GRAY; ctx.fillText('chemistry still takes years', 100, y0 + 410); }
    else { ctx.globalAlpha = a; ctx.font = `44px "${HAND}"`; ctx.textAlign = 'left'; ctx.fillStyle = GRAY; ctx.fillText('red: derived fit, one hospital', 100, y0 + 410); }
    // playhead
    if (yrs < BEATEN) { ctx.globalAlpha = a; ctx.strokeStyle = WHITE; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(ax(yrs), y0 + 90); ctx.lineTo(ax(yrs), gy + 20); ctx.stroke(); }
    ctx.restore(); }

  function draw(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    if (t < 22.4) {
      const yr = yearAt(t);
      const heroMood = t < 1.5 ? 'angry' : yr < 3 ? 'awe' : yr < 9 ? 'sad' : yr < NEXT ? 'angry' : yr < BEATEN - 0.01 ? 'happy' : 'angry';
      ctx.save(); camera(ctx, t); world(ctx, yr, t, heroMood); ctx.restore();
      if (t >= 1.5 && t < 1.9) {                                           // rewind glitch: full-frame bands
        const rr = L.rng(Math.floor(t * 30)); ctx.save(); for (let k = 0; k < 14; k++) { ctx.globalAlpha = 0.35; ctx.fillStyle = rr() > 0.5 ? '#0d0f16' : '#2a2e38'; ctx.fillRect(0, rr() * 1920, 1080, 10 + rr() * 50); } ctx.restore();
        L.label(ctx, '<< REWIND', 120, 1480, 56, { col: WHITE, font: SERIF, align: 'left' }); }
      if (t < 1.5) L.label(ctx, 'LATER', 120, 1480, 50, { col: GRAY, font: SERIF, align: 'left' });
      if (t >= 20.0) { ctx.save(); ctx.globalAlpha = 0.72 * L.sm(20.0, 20.4, t); ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
      scan(ctx, 0.12);
      // cards
      card(ctx, ['It learns faster', 'than we meet.'], 330, 100, t < 1.4 ? 1 : 1 - L.sm(1.4, 1.55, t));
      const vs = win(t, 1.9, 3.6, 0.2);
      if (vs > 0) { card(ctx, ['THE RED'], 1330, 110, vs, [RED]); card(ctx, ['vs'], 1420, 64, vs, [GRAY]); card(ctx, ['EVERYONE ELSE'], 1520, 96, vs); }
      card(ctx, ['Round one:', '1 in 8.'], 1400, 96, win(t, 3.7, 5.2), [WHITE, RED]);
      card(ctx, ['Then it learns.', 'Alone.'], 1400, 96, win(t, 5.2, 6.8), [WHITE, RED]);
      card(ctx, ['We hold the pieces.', 'Separately.'], 330, 84, win(t, 8.5, 10.5), [WHITE, GREEN]);
      card(ctx, ['Nobody passes', 'the controller.'], 330, 84, win(t, 10.6, 12.6));
      card(ctx, ['13 years.', 'The next answer.'], 1380, 90, win(t, 16.6, 18.3), [WHITE, GREEN]);
      card(ctx, ['Beaten again.'], 1480, 110, win(t, 18.6, 20.0, 0.15), [RED]);
      card(ctx, ['We slowed it down', 'so you could see it.'], 900, 92, win(t, 20.2, 22.3, 0.25));
      const sl = t < 1.5 ? 'SC1  CLOSE  COLD OPEN (LATER)' : t < 1.9 ? 'SC1  REWIND' : t < T0 ? 'SC2  CLOSE' : t < 6 ? 'SC3  CLOSE  HANDHELD' : t < 8.4 ? 'SC4  DOLLY OUT  CHASE' : t < 12.4 ? 'SC5  WIDE' :
        t < 14.6 ? 'SC6  DOLLY IN' : t < 16.4 ? 'SC7  ECU' : t < 18.4 ? 'SC8  PULL OUT  MEDIUM' : t < 20 ? 'SC9  SLAM IN  ECU' : 'SC10  FREEZE';
      L.slate(ctx, sl);
    } else if (t < 32.0) {
      const a = L.sm(22.5, 23.1, t), yrs = BEATEN * L.ease.inOut(L.clamp((t - 23.4) / 2.4, 0, 1));
      if (t < 22.55) { ctx.fillStyle = '#ffffff'; ctx.globalAlpha = 0.25; ctx.fillRect(0, 0, 1080, 1920); ctx.globalAlpha = 1; }
      const out = 1 - L.sm(29.3, 29.7, t);
      card(ctx, ['Same race. Same pieces.'], 400, 72, a * out);
      panel(ctx, 470, yrs, false, a * out); panel(ctx, 960, yrs, true, a * out);
      card(ctx, ['Only the routing changed.'], 1490, 72, win(t, 26.2, 29.6) );
      card(ctx, ['This is the bottleneck.'], 960, 100, win(t, 29.7, 32.0, 0.35));
      scan(ctx, 0.08); L.slate(ctx, t < 29.6 ? 'SC11  SNAP  LOCKED WIDE' : 'SC12  BOTTLENECK');
    } else {
      L.endCard(ctx, L.sm(32.0, 32.5, t), { line: 'The bottleneck is us.' }); L.slate(ctx, 'SC13  END');
    }
  }

  const cues = [{ t: 0.05, type: 'hit' }, { t: 1.5, type: 'whoosh' }, { t: 1.9, type: 'stamp' }, { t: 6.0, type: 'whoosh' }, { t: 12.4, type: 'whoosh' },
    { t: tOf(NEXT) + 0.05, type: 'ding' }, { t: tOf(BEATEN), type: 'bonk' }, { t: 22.4, type: 'hit' }, { t: 29.7, type: 'stamp' }];
  Q.forEach((q, i) => { if (q < BEATEN && i !== HERO) cues.push({ t: tOf(q) + 0.4, type: 'pop' }); });
  return { draw, DUR,
    acts: [{ start: 0, end: T0, bpm: 0, drone: true }, { start: T0, end: 12.4, bpm: 84, drone: true }, { start: 12.4, end: 20.0, bpm: 126, drone: true },
      { start: 22.4, end: 32.0, bpm: 0, drone: true }, { start: 32.0, end: DUR, bpm: 0, drone: true }],
    cues: cues.sort((a, b) => a.t - b.t), _debug: { Q, QA } };
}
module.exports = makeScene;
