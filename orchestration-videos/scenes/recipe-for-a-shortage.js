// Recipe for a Shortage: a deadpan chalkboard cooking show that turns out to be a real timeline.
// Analog rice-2008. Red chalk = price extent (logistic fit + sourced decay). Green chalk = the stock, the need, the connecting line.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const DUR = 40;
  const RED = L.RED, GREEN = L.GREEN;
  const CH = '#e6e2d8', CHD = 'rgba(230,226,216,0.5)', CHF = 'rgba(230,226,216,0.22)';
  const BOARD = '#1e2326', BG = '#0b0d0f';
  const A = L.loadAnalog('rice-2008');

  // ---- Speed math (see notes.md) ----
  const FK = 1.564, FR = 0.222, FM = 28.02;                     // logistic fit through s2/s3 anchors
  const fit = w => FK / (1 + Math.exp(-FR * (w - FM)));
  const W_NEED = A.solution.fragments.find(f => f.id === 'f2').ready_at;   // 27.3
  const W_DEAL = A.solution.aggregation.median;                           // 31.3
  const W_AI = A.ai_counterfactual.aggregation_median;                    // 28.3
  const K_DEC = Math.log(1 / 0.625) / A.solution.deploy.median;           // 0.107 / week
  const W_END = 35.7;                                                     // last sourced point (June 2008)
  const ext = (w, wd) => w <= wd ? Math.min(1, fit(w)) : Math.min(1, fit(wd)) * Math.exp(-K_DEC * (w - wd));
  // Race clock: 1 s = 2 weeks while running; cold open at week 30; hard stop 10-11 s.
  const week = t => {
    if (t < 2.2) return 30;
    if (t < 3.0) return 30 * (1 - L.ease.inOut((t - 2.2) / 0.8));
    if (t < 10) return (t - 3) * 2;
    if (t < 11) return 14;
    return Math.min(W_END, 14 + (t - 11) * 2);
  };
  const tOfWeek = w => w <= 14 ? 3 + w / 2 : 11 + (w - 14) / 2;
  const T_NEED = tOfWeek(W_NEED), T_DEAL = tOfWeek(W_DEAL);
  // Human aggregation: two-sided lognormal, quantiles for five threads.
  const P90_LO = W_DEAL * W_DEAL / A.solution.aggregation.p10;
  const qs = [0.1, 0.3, 0.5, 0.7, 0.9];
  const arrivals = qs.map(q => q < 0.5 ? L.lognormalQuantile(q, W_DEAL, P90_LO) : L.lognormalQuantile(q, W_DEAL, A.solution.aggregation.p90));

  // ---- World: a chalkboard 4320 x 7680, tiles 540 x 640 (8 x 12 kitchens) ----
  const BW = 4320, BH = 7680, TW = 540, TH = 640;
  const ST = { x: 1620, y: 2560, w: 1080, h: 1280 };          // the chef's station (2x2 tiles)
  const WH = { x: 0, y: 640, w: 1080, h: 1280 };              // the warehouse (2x2 tiles; size = resources)
  const HX = 1780, HY = 3700;                                 // chef head centre
  const SH = [HX + 230, HY + 290];                            // chef shoulder (board side)
  const TIP = [2060, 3440];                                   // where his green chalk waits for the line
  const WH_OUT = [820, 1640];                                 // threads leave the warehouse here
  const rnd = L.rng(808);
  const tiles = [];
  for (let r = 0; r < 12; r++) for (let c = 0; c < 8; c++) {
    const x = c * TW, y = r * TH;
    const inSt = c >= 3 && c <= 4 && r >= 4 && r <= 5, inWh = c <= 1 && r >= 1 && r <= 2;
    if (inSt || inWh) continue;
    tiles.push({ x, y, c, r, seed: 10 + r * 8 + c, flip: rnd() < 0.5, ph: rnd() * 6.28, pot: 0.8 + rnd() * 0.4 });
  }
  const tc = (c, r) => [c * TW + TW / 2, r * TH + TH / 2];
  const threads = [
    { to: tc(6, 2), arr: arrivals[0] },
    { to: tc(2, 8), arr: arrivals[1] },
    { to: TIP, arr: arrivals[2], deal: true },
    { to: tc(6, 9), arr: arrivals[3] },
    { to: tc(1, 11), arr: arrivals[4] },
  ];
  const smudges = []; const rs = L.rng(77);
  for (let i = 0; i < 70; i++) smudges.push([rs() * BW, rs() * BH, 200 + rs() * 700, 60 + rs() * 200, rs() * 3, 0.025 + rs() * 0.04]);

  // Station recipe steps. Film-time write windows. Steps 1-4 also exist in the cold open (week 30).
  const STEPS = [
    { text: '- Have enough rice.', col: CH, s: -1, d: 1 },
    { text: "- Don't tell anyone.", col: CH, s: 3.2, d: 1.2, cold: true },
    { text: '- Lock every kitchen door.', col: CH, s: 5.1, d: 1.4, cold: true },
    { text: '- Let it simmer.', col: CH, s: 7.3, d: 1.1, cold: true },
    { text: '- Someone finally asks.', col: GREEN, s: T_NEED, d: 1.2, cold: true },
    { text: '- It moves.', col: GREEN, s: T_DEAL, d: 0.8 },
  ];
  const SX = 1990, SY0 = 3120, SDY = 100, SFS = 56;
  const widths = {};
  const tw = (ctx, text, size) => { const k = text + size; if (widths[k] == null) { ctx.font = `${size}px "${HAND}"`; widths[k] = ctx.measureText(text).width; } return widths[k]; };
  const DIAL = [2400, 2860], DR = 130;

  // ---- Chalk helpers ----
  const cline = (ctx, x1, y1, x2, y2, o = {}) => L.sketchLine(ctx, x1, y1, x2, y2, { w: 6, col: CH, jitter: 3, boil: 1, ...o });
  const ccirc = (ctx, x, y, r, o = {}) => L.sketchCircle(ctx, x, y, r, { w: 6, col: CH, jitter: 3, boil: 1, ...o });
  function ctext(ctx, text, x, y, size, col, p = 1, alpha = 1) {
    if (p <= 0 || alpha <= 0) return [x, y];
    const w = tw(ctx, text, size);
    ctx.save(); ctx.globalAlpha = alpha; ctx.beginPath(); ctx.rect(x - 10, y - size * 1.1, w * p + 12, size * 1.5); ctx.clip();
    ctx.font = `${size}px "${HAND}"`; ctx.textAlign = 'left';
    ctx.globalAlpha = alpha * 0.35; ctx.fillStyle = col; ctx.fillText(text, x + 2, y + 1.5);
    ctx.globalAlpha = alpha * 0.92; ctx.fillText(text, x, y); ctx.restore();
    return [x + w * p, y - size * 0.3];
  }
  function arc(ctx, x, y, r, a0, a1, col, w, alpha = 1) { ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(x, y, r, a0, a1); ctx.stroke(); ctx.restore(); }
  function glow(ctx, x, y, r, col, a) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col.replace('1)', (0.5 * a).toFixed(3) + ')')); g.addColorStop(1, col.replace('1)', '0)')); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
  const GRGBA = 'rgba(52,210,123,1)', RRGBA = 'rgba(255,59,48,1)';
  // Oven-style price dial: 270 degree sweep from 135 degrees; e = price extent.
  function dial(ctx, x, y, r, e, t, seed, big) {
    ccirc(ctx, x, y, r, { w: big ? 7 : 5, seed, t, col: CHD });
    for (let i = 0; i <= 8; i++) { const a = 0.75 * Math.PI + i / 8 * 1.5 * Math.PI; cline(ctx, x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78, x + Math.cos(a) * r * 0.92, y + Math.sin(a) * r * 0.92, { w: big ? 5 : 4, col: CHD, seed: seed + i, t, jitter: 1 }); }
    const a1 = 0.75 * Math.PI + 1.5 * Math.PI * L.clamp(e, 0, 1);
    if (e > 0.004) { if (big) glow(ctx, x, y, r * 1.5, RRGBA, 0.35 * e); arc(ctx, x, y, r * 0.64, 0.75 * Math.PI, a1, RED, r * (big ? 0.2 : 0.24), 0.92); }
    cline(ctx, x, y, x + Math.cos(a1) * r * 0.62, y + Math.sin(a1) * r * 0.62, { w: big ? 9 : 6, col: e > 0.02 ? RED : CH, seed: seed + 20, t, jitter: 1 });
    ctx.fillStyle = CH; ctx.beginPath(); ctx.arc(x, y, r * 0.07, 0, 7); ctx.fill();
  }

  // ---- Chef (a real person, drawn in flat grays; only his chalk is green) ----
  const SKIN = '#8e8781', JACKET = '#c4bfb5', INK = '#121416', HAIR = '#34302d', HAT = '#dcd8cf';
  function chef(ctx, t, o) {
    const { turn = 0, mood = 'deadpan', hand = [HX + 240, HY + 760], look = [0, 0], chalkGlow = 0.6 } = o;
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    // torso
    ctx.fillStyle = JACKET; ctx.strokeStyle = INK; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.moveTo(HX - 250, HY + 1150); ctx.lineTo(HX - 230, HY + 330); ctx.quadraticCurveTo(HX - 200, HY + 230, HX - 60, HY + 210);
    ctx.lineTo(HX + 90, HY + 210); ctx.quadraticCurveTo(HX + 250, HY + 230, HX + 280, HY + 340); ctx.lineTo(HX + 300, HY + 1150); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#8a857d'; for (let i = 0; i < 3; i++) for (const dx of [-40, 50]) { ctx.beginPath(); ctx.arc(HX + dx + 10, HY + 360 + i * 130, 12, 0, 7); ctx.fill(); }
    // neck
    ctx.fillStyle = SKIN; ctx.fillRect(HX - 50, HY + 110, 100, 120); ctx.strokeRect(HX - 50, HY + 110, 100, 120);
    ctx.fillStyle = HAT; ctx.beginPath(); ctx.moveTo(HX - 90, HY + 200); ctx.lineTo(HX, HY + 250); ctx.lineTo(HX + 90, HY + 200); ctx.lineTo(HX + 80, HY + 240); ctx.lineTo(HX, HY + 290); ctx.lineTo(HX - 80, HY + 240); ctx.closePath(); ctx.fill(); ctx.stroke();
    // head
    const rx = 122, ry = 150;
    ctx.save(); ctx.beginPath(); ctx.ellipse(HX, HY, rx, ry, 0, 0, 7); ctx.fillStyle = SKIN; ctx.fill(); ctx.clip();
    const hairOff = -rx * 1.25 * turn; ctx.fillStyle = HAIR; ctx.beginPath(); ctx.ellipse(HX + hairOff, HY - 20 - 40 * turn, rx * (1.05 - 0.35 * turn), ry * (1.0 - 0.25 * turn), 0, 0, 7); ctx.fill();
    ctx.fillRect(HX - rx, HY - ry, rx * 2, 55);
    ctx.restore();
    ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.beginPath(); ctx.ellipse(HX, HY, rx, ry, 0, 0, 7); ctx.stroke();
    // ear: board-side when turned away, other side when facing us
    const earX = HX + (turn < 0.5 ? rx * 0.92 : -rx * 0.9);
    ctx.fillStyle = SKIN; ctx.beginPath(); ctx.ellipse(earX, HY + 10, 26, 44, 0, 0, 7); ctx.fill(); ctx.stroke();
    // face
    const fa = L.sm(0.3, 0.6, turn);
    if (fa > 0) {
      ctx.save(); ctx.globalAlpha = fa; const fx = HX + L.lerp(rx * 0.9, rx * 0.12, L.sm(0.3, 1, turn)), fy = HY + 5;
      const lk = look;
      [-1, 1].forEach(d => {
        const ex = fx + d * 42, ey = fy - 12;
        ctx.fillStyle = '#e9e5dc'; ctx.beginPath(); ctx.ellipse(ex, ey, 22, 15, 0, 0, 7); ctx.fill();
        ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(ex + lk[0] * 9, ey + lk[1] * 5, mood === 'stunned' ? 7 : 9, 0, 7); ctx.fill();
        // lids
        ctx.fillStyle = SKIN; const lid = { deadpan: 0.55, angry: 0.35, tired: 0.6, stunned: 0, resolve: 0.3, wry: d < 0 ? 0.55 : 0.1 }[mood] ?? 0.3;
        if (lid > 0) { ctx.beginPath(); ctx.rect(ex - 24, ey - 17, 48, 32 * lid); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(ex - 22, ey - 17 + 32 * lid); ctx.lineTo(ex + 22, ey - 17 + 32 * lid); ctx.stroke(); }
        // brows
        const b = { deadpan: [0, 0], angry: [0.42, 10], tired: [-0.25, 0], stunned: [0, -16], resolve: [0.12, 0], wry: d < 0 ? [0, 4] : [-0.15, -18] }[mood] || [0, 0];
        ctx.strokeStyle = INK; ctx.lineWidth = 9; ctx.beginPath();
        const by = ey - 36 + b[1], inner = ex - d * 20, outer = ex + d * 22;
        ctx.moveTo(outer, by - 0); ctx.lineTo(inner, by + b[0] * 34); ctx.stroke();
      });
      ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(fx + 4, fy - 4); ctx.lineTo(fx + 14, fy + 38); ctx.lineTo(fx - 4, fy + 44); ctx.stroke();
      ctx.lineWidth = 7; ctx.beginPath(); const my = fy + 84;
      if (mood === 'angry') { ctx.moveTo(fx - 32, my + 8); ctx.quadraticCurveTo(fx, my - 12, fx + 32, my + 8); }
      else if (mood === 'stunned') { ctx.ellipse(fx, my, 14, 20, 0, 0, 7); }
      else if (mood === 'tired') { ctx.moveTo(fx - 28, my + 4); ctx.quadraticCurveTo(fx, my - 4, fx + 28, my + 4); }
      else if (mood === 'wry') { ctx.moveTo(fx - 28, my + 2); ctx.quadraticCurveTo(fx + 8, my + 6, fx + 30, my - 8); }
      else { ctx.moveTo(fx - 30, my); ctx.lineTo(fx + 30, my); }
      ctx.stroke(); ctx.restore();
    }
    // toque
    ctx.fillStyle = HAT; ctx.strokeStyle = INK; ctx.lineWidth = 10;
    [[-70, -250, 88], [70, -250, 88], [0, -300, 100]].forEach(([dx, dy, r]) => { ctx.beginPath(); ctx.arc(HX + dx, HY + dy, r, 0, 7); ctx.fill(); ctx.stroke(); });
    ctx.beginPath(); ctx.rect(HX - 130, HY - 230, 260, 110); ctx.fill(); ctx.stroke();
    ctx.fillStyle = HAT; ctx.fillRect(HX - 124, HY - 290, 248, 70);
    // arm (two-bone IK), sleeve then hand, then the green chalk
    const [sx, sy] = SH; let [hx, hy] = hand; const a = 430, b = 420; let dx = hx - sx, dy = hy - sy; let dd = Math.hypot(dx, dy);
    if (dd > a + b - 2) { hx = sx + dx / dd * (a + b - 2); hy = sy + dy / dd * (a + b - 2); dx = hx - sx; dy = hy - sy; dd = a + b - 2; }
    const ang = Math.atan2(dy, dx), ca = Math.acos(L.clamp((a * a + dd * dd - b * b) / (2 * a * dd), -1, 1));
    const exx = sx + Math.cos(ang + ca) * a, eyy = sy + Math.sin(ang + ca) * a;
    ctx.strokeStyle = INK; ctx.lineWidth = 104; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(exx, eyy); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.strokeStyle = JACKET; ctx.lineWidth = 86; ctx.stroke();
    ctx.fillStyle = HAT; ctx.strokeStyle = INK; ctx.lineWidth = 8; const cuffA = Math.atan2(hy - eyy, hx - exx);
    ctx.save(); ctx.translate(hx - Math.cos(cuffA) * 40, hy - Math.sin(cuffA) * 40); ctx.rotate(cuffA); ctx.beginPath(); ctx.rect(-22, -50, 44, 100); ctx.fill(); ctx.stroke(); ctx.restore();
    // chalk points from the hand toward the tip target
    const cA = -1.0; const cx1 = hx + Math.cos(cA) * 34, cy1 = hy + Math.sin(cA) * 34, cx2 = hx + Math.cos(cA) * 96, cy2 = hy + Math.sin(cA) * 96;
    glow(ctx, cx2, cy2, 110, GRGBA, chalkGlow);
    ctx.strokeStyle = INK; ctx.lineWidth = 30; ctx.beginPath(); ctx.moveTo(cx1, cy1); ctx.lineTo(cx2, cy2); ctx.stroke();
    ctx.strokeStyle = GREEN; ctx.lineWidth = 20; ctx.stroke();
    ctx.fillStyle = SKIN; ctx.strokeStyle = INK; ctx.lineWidth = 8; ctx.beginPath(); ctx.ellipse(hx, hy, 50, 44, cA, 0, 7); ctx.fill(); ctx.stroke();
    ctx.lineWidth = 5; for (let k = -1; k <= 1; k++) { ctx.beginPath(); ctx.moveTo(hx + 10 + k * 5, hy - 20 + k * 16); ctx.lineTo(hx + 34 + k * 3, hy - 12 + k * 16); ctx.stroke(); }
    ctx.restore();
    return [cx2, cy2];
  }
  // hand position that puts the chalk tip at p
  const handFor = p => [p[0] - Math.cos(-1.0) * 96, p[1] - Math.sin(-1.0) * 96];

  // ---- Kitchens on the board ----
  function kitchen(ctx, k, e, t, detail) {
    const cx = k.x + TW / 2, cy = k.y + TH / 2, s = k.seed;
    cline(ctx, k.x + 40, cy + 170, k.x + TW - 40, cy + 170, { seed: s, t, col: CHD, w: 7 });
    // pot
    const px = cx + (k.flip ? 90 : -90), py = cy + 90, pr = 78 * k.pot;
    ctx.save(); ctx.strokeStyle = CH; ctx.globalAlpha = 0.85; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.arc(px, py - 10, pr, 0.05 * Math.PI, 0.95 * Math.PI); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(px - pr - 12, py - 10); ctx.lineTo(px + pr + 12, py - 10); ctx.stroke(); ctx.restore();
    // steam: fades as the price rises (less in the pot)
    if (detail) for (let i = -1; i <= 1; i++) { const a = (1 - e) * 0.6; if (a < 0.05) continue; ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = CH; ctx.lineWidth = 4; ctx.beginPath();
      for (let j = 0; j < 6; j++) { const yy = py - 40 - j * 16, xx = px + i * 34 + Math.sin(j * 0.9 + t * 3 + k.ph) * 10; j ? ctx.lineTo(xx, yy) : ctx.moveTo(xx, yy); } ctx.stroke(); ctx.restore(); }
    // price dial, same level everywhere (one market)
    dial(ctx, cx + (k.flip ? -120 : 120), cy - 110, 78, e, t, s + 3, false);
    // a person
    const mood = e < 0.25 ? 'happy' : e < 0.6 ? 'bored' : 'sad';
    if (detail) L.stick(ctx, cx + (k.flip ? -110 : 110), cy + 110, 1.2, { mood, col: CH, t, seed: s, boil: 1, pose: { armL: 0.3, armR: 0.3 }, look: [k.flip ? 1 : -1, 0] });
  }
  function warehouse(ctx, t, w) {
    const { x, y, w: ww, h } = WH, pulse = 0.75 + 0.25 * Math.sin(t * 2.2);
    glow(ctx, x + ww / 2, y + h / 2 + 80, 760, GRGBA, 0.55 * pulse);
    cline(ctx, x + 70, y + 340, x + ww / 2, y + 150, { col: CHD, seed: 901, t, w: 8 }); cline(ctx, x + ww / 2, y + 150, x + ww - 70, y + 340, { col: CHD, seed: 902, t, w: 8 });
    cline(ctx, x + 70, y + 340, x + 70, y + h - 90, { col: CHD, seed: 903, t, w: 8 }); cline(ctx, x + ww - 70, y + 340, x + ww - 70, y + h - 90, { col: CHD, seed: 904, t, w: 8 });
    cline(ctx, x + 40, y + h - 90, x + ww - 40, y + h - 90, { col: CHD, seed: 905, t, w: 8 });
    // sacks, stacked (green: the idle stock)
    for (let row = 0; row < 5; row++) for (let i = 0; i < 6 - (row % 2); i++) {
      const sx = x + 170 + i * 150 + (row % 2) * 75, sy = y + h - 170 - row * 120;
      ctx.save(); ctx.strokeStyle = GREEN; ctx.globalAlpha = 0.9; ctx.lineWidth = 9; ctx.beginPath(); ctx.ellipse(sx, sy, 66, 52, 0, 0, 7); ctx.stroke(); ctx.restore();
      cline(ctx, sx - 18, sy - 44, sx + 18, sy - 44, { col: GREEN, seed: 950 + row * 9 + i, t, w: 6, jitter: 2 });
    }
    ctext(ctx, 'rice. idle.', x + 330, y + 300, 78, CH, 1, 0.9);
  }
  function thread(ctx, th, w, t, z) {
    const p = L.clamp(w / th.arr, 0, 1); if (p <= 0) return;
    const [x0, y0] = WH_OUT, [x1, y1] = th.to; const ex = L.lerp(x0, x1, p), ey = L.lerp(y0, y1, p);
    ctx.save(); ctx.strokeStyle = GREEN; ctx.lineCap = 'round';
    const zz = Math.max(0.25, z); if (p < 1) { ctx.setLineDash([34 / Math.min(1, zz * 2), 30 / Math.min(1, zz * 2)]); ctx.globalAlpha = 0.8; ctx.lineWidth = Math.max(12, 4 / zz); }
    else { ctx.globalAlpha = 1; ctx.lineWidth = Math.max(th.deal ? 20 : 14, 6 / zz); }
    ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(ex, ey); ctx.stroke(); ctx.restore();
    if (p >= 1) glow(ctx, x1, y1, 160, GRGBA, 0.8);
    else { ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(ex, ey, 16, 0, 7); ctx.fill(); }
  }

  // ---- The station (recipe + dial) ----
  function station(ctx, t, w, e) {
    const { x, y, w: sw, h } = ST;
    ctx.save(); ctx.strokeStyle = CHF; ctx.lineWidth = 6; ctx.strokeRect(x + 20, y + 20, sw - 40, h - 40); ctx.restore();
    ctext(ctx, "TODAY'S RECIPE", x + 60, y + 150, 76, CH);
    cline(ctx, x + 60, y + 178, x + 620, y + 172, { seed: 401, t, w: 6 });
    dial(ctx, DIAL[0], DIAL[1], DR, e, t, 411, true);
    ctext(ctx, 'price', DIAL[0] - 50, DIAL[1] + DR + 70, 50, CHD);
    const erase = t >= 2.2 && t < 3.0 ? 1 - L.sm(2.2, 2.9, t) : 1;
    let pen = null;
    STEPS.forEach((s, i) => {
      const yy = SY0 + i * SDY; let p, a = 1;
      if (t < 3.0 && s.cold) { p = 1; a = erase; }
      else if (s.s < 0) p = 1;
      else { p = L.clamp((t - s.s) / s.d, 0, 1); if (t >= 10 && t < 11) p = L.clamp((10 - s.s) / s.d, 0, 1); }
      const r = ctext(ctx, s.text, SX, yy, SFS, s.col, p, a);
      if (p > 0 && p < 1 && a === 1) pen = r;
    });
    return pen;
  }

  // Hand target over time (chalk-tip positions).
  const lineStart = i => [SX, SY0 + i * SDY - SFS * 0.3];
  const lineEnd = (ctx, i) => [SX + tw(ctx, STEPS[i].text, SFS), SY0 + i * SDY - SFS * 0.3];
  function tipAt(ctx, t, pen) {
    if (pen) return pen;
    const rest = [HX + 330, HY + 560], chin = [HX + 300, HY + 20];
    if (t < 2.2) return chin;
    if (t < 3.2) return lerp2(chin, lineStart(1), L.sm(2.4, 3.2, t));
    const gaps = [[4.4, 5.1, 1, 2], [6.5, 7.3, 2, 3]];
    for (const [a, b, i, j] of gaps) if (t >= a && t < b) return lerp2(lineEnd(ctx, i), lineStart(j), L.sm(a, b, t));
    if (t >= 8.4 && t < 16.5) return lerp2(lineEnd(ctx, 3), rest, L.sm(8.4, 9.2, Math.min(t, 10)));
    if (t >= 16.5 && t < 32) return lerp2(rest, TIP, L.sm(16.6, 17.5, t));
    if (t >= 32) { const u = L.sm(32.4, 34.2, t); const base = lineEnd(ctx, 5); return [L.lerp(SX, base[0] + 40, u), base[1] + 60]; }
    return rest;
  }
  const lerp2 = (p, q, f) => [L.lerp(p[0], q[0], f), L.lerp(p[1], q[1], f)];
  const turnKeys = [[0, 1], [2.3, 1], [2.9, 0], [4.45, 0], [4.65, 0.85], [4.95, 0.85], [5.1, 0], [6.55, 0], [6.75, 0.85], [7.1, 0.85], [7.3, 0], [8.5, 0], [9.2, 0.75], [11, 0.75], [11.8, 0], [16.4, 0], [17.4, 0.72], [32, 0.72]];
  function moodAt(t) {
    if (t < 2.2) return ['deadpan', [0, 0]];
    if (t < 4.5) return ['deadpan', [0, 0]];
    if (t < 5.1) return ['deadpan', [0, 0]];
    if (t < 6.6) return ['deadpan', [0, 0]];
    if (t < 7.3) return ['wry', [0, 0]];
    if (t < 16.4) return ['stunned', [1, -0.8]];
    if (t < T_DEAL + 0.6) return ['angry', [1, -0.6]];
    if (t < 32) return ['tired', [1, -0.3]];
    return ['resolve', [1, 0]];
  }

  // ---- Camera ----
  const CAM = [
    [0, [2080, 3110, 1.15, 0]], [2.2, [2070, 3120, 1.2, 0]], [2.95, [2070, 3120, 1.2, 0]],
    [3.0, [2180, 3120, 1.0, 0]], [10, [2160, 3150, 1.1, 0]], [11, [2160, 3150, 1.1, 0]],
    [16.5, [2160, 3840, 0.245, 0]], [16.8, [2160, 3840, 0.245, 0]],
    [19.6, [1960, 3520, 1.9, 0]], [22.5, [1950, 3500, 2.05, 0]], [25.8, [1950, 3500, 2.05, 0]],
    [31.99, [1950, 3500, 2.05, 0]], [32.0, [2080, 3560, 2.7, 0]], [35.4, [2090, 3560, 2.9, 0]],
  ];

  function world(ctx, t) {
    const tf = (t >= 10 && t < 11) ? 10 : t;            // hard stop freezes everything
    const w = week(tf), e = ext(w, W_DEAL);
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    ctx.save(); L.camera(ctx, CAM, tf);
    const [cx, cy, z] = L.key(CAM, tf); const vx0 = cx - 540 / z - 300, vx1 = cx + 540 / z + 300, vy0 = cy - 960 / z - 300, vy1 = cy + 960 / z + 300;
    // board and frame
    ctx.fillStyle = '#3b3833'; ctx.fillRect(-90, -90, BW + 180, BH + 180);
    ctx.fillStyle = BOARD; ctx.fillRect(0, 0, BW, BH);
    smudges.forEach(([x, y, a, b, r, al]) => { if (x < vx0 - a || x > vx1 + a || y < vy0 - a || y > vy1 + a) return; ctx.save(); ctx.globalAlpha = al; ctx.fillStyle = '#c8c4bb'; ctx.beginPath(); ctx.ellipse(x, y, a, b, r, 0, 7); ctx.fill(); ctx.restore(); });
    const detail = z > 0.33;
    // faint grid between kitchens
    ctx.save(); ctx.strokeStyle = CHF; ctx.lineWidth = 5; ctx.setLineDash([22, 26]); ctx.beginPath();
    for (let c = 1; c < 8; c++) { ctx.moveTo(c * TW, 0); ctx.lineTo(c * TW, BH); } for (let r = 1; r < 12; r++) { ctx.moveTo(0, r * TH); ctx.lineTo(BW, r * TH); } ctx.stroke(); ctx.restore();
    tiles.forEach(k => { if (k.x + TW < vx0 || k.x > vx1 || k.y + TH < vy0 || k.y > vy1) return; kitchen(ctx, k, e, tf, detail || z > 0.2); });
    if (WH.x + WH.w > vx0 && WH.y < vy1 && WH.y + WH.h > vy0) warehouse(ctx, tf, w);
    // the need lights green in the chef's station
    const needOn = L.sm(T_NEED, T_NEED + 0.4, tf) * (tf >= 2.2 && tf < 3 ? 1 - L.sm(2.2, 2.9, tf) : 1) + (tf < 2.2 ? 1 : 0);
    const pen = station(ctx, tf, w, e);
    threads.forEach(th => thread(ctx, th, tf < 3 ? 0 : w, tf, z));
    const [md, lk] = moodAt(tf);
    const turn = L.key(turnKeys, tf);
    let tip = tipAt(ctx, tf, pen);
    chef(ctx, tf, { turn, mood: md, look: lk, hand: handFor(tip), chalkGlow: 0.5 + 0.6 * Math.min(1, needOn) });
    // IN++: the green underline he draws under the green steps
    if (tf >= 32) { const u = L.sm(32.4, 34.2, tf), yy = SY0 + 5 * SDY + 26; cline(ctx, SX, yy, L.lerp(SX, lineEnd(ctx, 5)[0] + 40, u), yy, { col: GREEN, w: 12, seed: 777, t: tf }); }
    ctx.restore();
    return { w, e, z };
  }

  // ---- Snap panels (screen space) ----
  function panel(ctx, y, title, wd, wNow, label, al, isAI) {
    const x = 80, W = 920, H = 500;
    ctx.fillStyle = BOARD; ctx.fillRect(x, y, W, H);
    ctx.strokeStyle = '#3b3833'; ctx.lineWidth = 14; ctx.strokeRect(x, y, W, H);
    L.label(ctx, title, x + 36, y + 66, 46, { col: isAI ? GREEN : CH, align: 'left', alpha: al });
    const gx0 = x + 60, gx1 = x + W - 60, gy0 = y + H - 60, gy1 = y + 120;
    const X = wk => L.lerp(gx0, gx1, wk / 36), Y = e => L.lerp(gy0, gy1, e);
    cline(ctx, gx0, gy0, gx1, gy0, { col: CHD, seed: 3 + y, t: 0, boil: 0 });
    L.label(ctx, 'time', gx1 - 60, gy0 + 44, 36, { col: '#8d8a84', alpha: al }); L.label(ctx, 'price', gx0 + 10, gy1 - 10, 36, { col: '#8d8a84', align: 'left', alpha: al });
    if (wNow <= 0) return;
    ctx.save(); ctx.strokeStyle = RED; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
    for (let wk = 0; wk <= Math.min(wNow, 36); wk += 0.25) { const px = X(wk), py = Y(ext(Math.min(wk, W_END), wd)); wk ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); ctx.restore();
    if (wNow >= wd) {
      const gx = X(wd); ctx.save(); ctx.strokeStyle = GREEN; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(gx, gy0); ctx.lineTo(gx, gy1 - 10); ctx.stroke(); ctx.restore();
      glow(ctx, gx, Y(ext(wd, wd)), 90, GRGBA, 0.9);
      L.label(ctx, label, gx - 44, gy1 + 30, 56, { col: GREEN, align: 'right', alpha: al });
    }
  }

  function draw(ctx, t) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    if (t < 25.8 || (t >= 32 && t < 35.4)) {
      const { z } = world(ctx, t < 25.8 ? t : t);
      // slates
      let sl = 'SC1  CLOSE  OVER THE SHOULDER  (week 30, cold open)';
      if (t >= 3 && t < 10) sl = 'SC2  OVER THE SHOULDER  push in';
      else if (t >= 10 && t < 11) sl = 'SC2  HARD STOP  freeze';
      else if (t >= 11 && t < 16.8) sl = 'SC3  PULL OUT  the board is the world';
      else if (t >= 16.8 && t < 22.5) sl = 'SC4  DROP BACK IN  closer';
      else if (t >= 22.5 && t < 25.8) sl = 'SC5  HOLD  dead stop';
      else if (t >= 32) sl = 'SC7  EXTREME CLOSE  the chalk';
      // freeze tint during the hard stop
      if (t >= 10 && t < 11) { ctx.fillStyle = 'rgba(10,12,14,0.35)'; ctx.fillRect(0, 0, 1080, 1920); }
      if (t >= 22.5 && t < 25.8) { ctx.fillStyle = `rgba(8,9,11,${(0.62 * L.sm(22.5, 23.1, t) + 0.35 * L.sm(25.0, 25.7, t)).toFixed(3)})`; ctx.fillRect(0, 0, 1080, 1920); }
      L.grain(ctx, t, { alpha: 0.05 });
      L.slate(ctx, sl);
    } else if (t < 32) {
      ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
      const k = 20;                                              // snap: 1 s = 20 weeks
      const wA = t < 27.6 ? (t - 25.8) * k : (t - 27.6) * k, wB = t < 27.6 ? 0 : (t - 27.6) * k;
      const showB = L.sm(27.4, 27.7, t);
      panel(ctx, 360, 'As it happened', W_DEAL, t < 27.6 ? wA : Math.max(wA, 0.01), 'Week 31', 1, false);
      if (showB > 0) { ctx.save(); ctx.globalAlpha = showB; panel(ctx, 920, 'AI-assisted routing · illustrative', W_AI, wB, 'Week 28 · illustrative', showB, true); ctx.restore(); }
      if (t < 27.4) L.title(ctx, ['Same timeline. True pace.'], 280, 74, { alpha: L.sm(25.85, 26.1, t) });
      else if (t > 29.6) L.title(ctx, ['Same rice. Found sooner.'], 280, 74, { alpha: L.sm(29.6, 29.9, t) });
      if (t < 25.9) { ctx.fillStyle = 'rgba(255,255,255,' + (0.5 * (1 - L.sm(25.8, 25.9, t))).toFixed(3) + ')'; ctx.fillRect(0, 0, 1080, 1920); }
      L.grain(ctx, t, { alpha: 0.05 });
      L.slate(ctx, 'SC6  SNAP  same clock, two lanes');
    }
    if (t >= 35.4) { L.endCard(ctx, L.sm(35.4, 35.8, t), { line: 'The bottleneck is us.' }); return; }
    // ---- cards ----
    const card = (a, b, lines, y = 280, size = 84) => { if (t >= a && t < b) { const al = L.sm(a, a + 0.18, t) * (1 - L.sm(b - 0.18, b, t)); const h = size * 1.05 * lines.length; const g = ctx.createLinearGradient(0, y - size - 60, 0, y - size + h + 70); g.addColorStop(0, 'rgba(8,9,11,0)'); g.addColorStop(0.3, 'rgba(8,9,11,0.62)'); g.addColorStop(0.7, 'rgba(8,9,11,0.62)'); g.addColorStop(1, 'rgba(8,9,11,0)'); ctx.save(); ctx.globalAlpha = al; ctx.fillStyle = g; ctx.fillRect(0, y - size - 60, 1080, h + 130); ctx.restore(); } if (t >= a && t < b) L.title(ctx, lines, y, size, { alpha: L.sm(a, a + 0.18, t) * (1 - L.sm(b - 0.18, b, t)) }); };
    card(0, 2.45, ['Step one:', 'have enough rice.'], 250, 88);
    card(2.6, 4.9, ['Step two:', "don't tell anyone."], 250, 88);
    card(4.95, 7.2, ['Step three:', 'lock every kitchen door.'], 250, 80);
    card(7.25, 10.0, ['Step four:', 'let it simmer.'], 250, 88);
    card(10.0, 12.3, ['This recipe', 'really happened.'], 250, 92);
    card(12.5, 14.3, ['Every kitchen.', 'One price.'], 1330, 92);
    card(14.5, 16.7, ['The rice sat', 'in a warehouse.'], 1330, 92);
    card(17.65, 19.6, ['Step five:', 'someone finally asks.'], 250, 84);
    card(19.7, 22.4, ['Step six:', 'it moves.'], 250, 88);
    card(22.6, 25.0, ['We slowed it down', 'so you could see it.'], 820, 88);
    card(32.3, 35.4, ['This is the bottleneck.'], 300, 88);
  }

  const cues = [
    { t: 0.05, type: 'pop' }, { t: 2.2, type: 'whoosh' }, { t: 3.2, type: 'pop' }, { t: 5.1, type: 'pop' }, { t: 7.3, type: 'pop' },
    { t: 10.0, type: 'hit' }, { t: 11.0, type: 'whoosh' }, { t: T_NEED, type: 'ding' }, { t: 16.8, type: 'whoosh' }, { t: T_DEAL, type: 'ding' },
    { t: 25.8, type: 'stamp' }, { t: 25.8 + W_DEAL / 20, type: 'pop' }, { t: 27.6 + W_AI / 20, type: 'ding' }, { t: 32.0, type: 'whoosh' },
  ];
  return {
    draw, DUR,
    acts: [{ start: 0, end: 10, bpm: 96 }, { start: 11, end: 25.0, bpm: 0, drone: true }, { start: 25.8, end: 40, bpm: 0, drone: true }],
    cues,
  };
}
if (typeof module !== 'undefined') module.exports = makeScene;
