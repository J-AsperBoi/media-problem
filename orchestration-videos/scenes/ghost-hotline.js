// ghost-hotline ("The Ghost Line"): ghost-rewind, ink wash, crane up and drop down. Analog: cuban-missile-1962.
// Red = alert level (ordinal, analog threat.points, step function; unverified dates drive motion only, never on screen).
// Green = documented fragments (analog solution.fragments) with documented latency (message_latency_hours).
// Ghost = hindsight (the direct line agreed at day 247), NOT AI. AI appears only in snap B (ai_counterfactual, illustrative).
// Mapping: race 1 s = 1 day with three freezes; snap A 1 s = 100 days; snap B 1 s = 4 days. See output/ghost-hotline/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const { createCanvas } = require('@napi-rs/canvas');
  const A = L.loadAnalog('cuban-missile-1962');
  const DUR = 40.5, RED = L.RED, GREEN = L.GREEN;
  const PAPER = '#d3cdbf', INK = a => `rgba(18,17,16,${a})`, PALE = a => `rgba(214,226,218,${a})`;

  // ---------- data ----------
  const pts = A.threat.points; // extent by day (ordinal alert map)
  const level = d => { let e = 0; pts.forEach(p => { if (d >= p.t) e = p.extent; }); return Math.round(e / 0.25); };
  const F = {}; A.solution.fragments.forEach(f => F[f.id] = f.ready_at);
  const LAT_WORST = A.solution.message_latency_hours.worst / 24, LAT_TYP = A.solution.message_latency_hours.typical / 24;
  const DEAL = A.solution.aggregation.median;           // 12
  const LINE = F.f5;                                     // 247 (verified, s5)
  const AIDEAL = A.ai_counterfactual.aggregation_median; // 11 (illustrative)
  const BOATS = [{ id: 'f2', send: F.f2, lat: LAT_WORST }, { id: 'f3', send: F.f3, lat: LAT_TYP }];
  const F4 = F.f4;

  // ---------- time mapping (race: 1 s = 1 day, three freezes) ----------
  const T0 = 2.8, HOLDS = [[8, 0.8], [10, 0.8], [11, 1.0]];
  const raceDay = t => { const tt = t - T0; let acc = 0;
    for (const [hd, hl] of HOLDS) { const ts = hd + acc; if (tt < ts) return L.clamp(tt - acc, 0, DEAL); if (tt < ts + hl) return hd; acc += hl; }
    return L.clamp(tt - acc, 0, DEAL); };
  const tOfDay = d => T0 + d + HOLDS.filter(h => h[0] < d).reduce((s, h) => s + h[1], 0);
  const dayAt = t => t < 1.6 ? 11 : t < 2.8 ? 11 * (1 - L.ease.inOut((t - 1.6) / 1.2)) : raceDay(t);
  const inHold11 = t => t >= tOfDay(11) && t < tOfDay(11) + 1.0;

  // ---------- ink helpers ----------
  const R0 = L.rng(1962);
  function mountains(c, x0, x1, base, peak, alpha, seed) {
    const g = c.createLinearGradient(0, peak, 0, base + 40); g.addColorStop(0, INK(alpha)); g.addColorStop(0.55, INK(alpha * 0.55)); g.addColorStop(1, INK(0));
    c.fillStyle = g; c.beginPath(); c.moveTo(x0, base + 40);
    for (let x = x0; x <= x1; x += 10) { const r = 0.6 * L.noise(x / 260, seed) + 0.3 * L.noise(x / 80, seed + 1) + 0.1 * L.noise(x / 25, seed + 2);
      c.lineTo(x, base - (base - peak) * Math.pow(r, 1.6)); }
    c.lineTo(x1, base + 40); c.closePath(); c.fill(); }
  function water(c, x0, x1, y0, y1, a0, a1, seed, n) {
    const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, INK(a0)); g.addColorStop(1, INK(a1)); c.fillStyle = g; c.fillRect(x0, y0, x1 - x0, y1 - y0);
    const r = L.rng(seed); c.lineCap = 'round';
    for (let i = 0; i < n; i++) { const y = y0 + 8 + r() * (y1 - y0 - 16), x = x0 + r() * (x1 - x0), len = 30 + r() * 200 * (0.4 + (y - y0) / (y1 - y0));
      c.strokeStyle = `rgba(211,205,191,${0.05 + r() * 0.16})`; c.lineWidth = 1.5 + r() * 3.5; c.beginPath(); c.moveTo(x, y);
      c.quadraticCurveTo(x + len / 2, y + (r() - 0.5) * 4, x + len, y + (r() - 0.5) * 3); c.stroke(); } }
  function blot(c, x, y, rx, ry, a, seed, k = 7) { const r = L.rng(seed);
    for (let i = 0; i < k; i++) { c.fillStyle = INK(a * (0.4 + r() * 0.6)); c.beginPath(); c.ellipse(x + (r() - 0.5) * rx * 0.6, y + (r() - 0.5) * ry * 0.6, rx * (0.5 + r() * 0.6), ry * (0.5 + r() * 0.6), (r() - 0.5) * 0.6, 0, 7); c.fill(); } }
  function pine(c, x, y, h, a, seed) { L.sketchLine(c, x, y, x + 6, y - h, { w: 5, col: INK(a), seed, jitter: 3 });
    const r = L.rng(seed); for (let i = 0; i < 5; i++) { const yy = y - h * (0.45 + i * 0.12); blot(c, x + (r() - 0.5) * 30, yy, h * 0.28 * (1 - i * 0.12), h * 0.07, a * 0.8, seed + i, 4); } }
  function reeds(c, x0, x1, y, a, seed) { const r = L.rng(seed); for (let i = 0; i < 40; i++) { const x = x0 + r() * (x1 - x0), h = 20 + r() * 60;
    L.sketchLine(c, x, y, x + (r() - 0.3) * 20, y - h, { w: 1.5 + r() * 2, col: INK(a), seed: seed + i, jitter: 2 }); } }
  function house(c, cx, base, w, h, roofH, seed, winXs, winY, winH) {
    const r = L.rng(seed);
    c.fillStyle = 'rgba(120,118,112,0.55)'; c.fillRect(cx - w / 2, base - h, w, h);
    for (let i = 0; i < 6; i++) { c.fillStyle = INK(0.06 + r() * 0.08); c.fillRect(cx - w / 2 + r() * w * 0.6, base - h + r() * h * 0.6, w * (0.2 + r() * 0.4), h * (0.2 + r() * 0.4)); }
    // roof: wide eaves, slightly curled
    c.fillStyle = INK(0.82); c.beginPath(); c.moveTo(cx - w / 2 - w * 0.2, base - h + 4);
    c.quadraticCurveTo(cx - w * 0.35, base - h - roofH * 0.2, cx - w * 0.28, base - h - roofH); c.lineTo(cx + w * 0.28, base - h - roofH);
    c.quadraticCurveTo(cx + w * 0.35, base - h - roofH * 0.2, cx + w / 2 + w * 0.2, base - h + 4); c.closePath(); c.fill();
    L.sketchLine(c, cx - w / 2, base, cx - w / 2, base - h, { w: 3, col: INK(0.7), seed: seed + 1, jitter: 1.5 });
    L.sketchLine(c, cx + w / 2, base, cx + w / 2, base - h, { w: 3, col: INK(0.7), seed: seed + 2, jitter: 1.5 });
    L.sketchLine(c, cx - w / 2 - 10, base, cx + w / 2 + 10, base, { w: 4, col: INK(0.8), seed: seed + 3, jitter: 1.5 });
    winXs.forEach((wx, i) => { c.fillStyle = 'rgba(40,38,34,0.9)'; c.fillRect(wx - winH * 0.4, winY - winH / 2, winH * 0.8, winH); }); }
  function lanterns(c, xs, y, rad, lvl, t, { refl = null, flick = 0 } = {}) {
    xs.forEach((x, i) => { const lit = i < lvl;
      L.sketchLine(c, x, y - rad * 1.8, x, y - rad, { w: Math.max(1, rad * 0.12), col: INK(0.8), seed: 9 + i, jitter: 0.5 });
      if (lit) { const f = 1 - flick * (0.35 + 0.35 * Math.sin(t * 37 + i * 2.1));
        const g = c.createRadialGradient(x, y, 0, x, y, rad * 4.5); g.addColorStop(0, `rgba(255,59,48,${0.55 * f})`); g.addColorStop(1, 'rgba(255,59,48,0)');
        c.fillStyle = g; c.beginPath(); c.arc(x, y, rad * 4.5, 0, 7); c.fill();
        c.fillStyle = RED; c.globalAlpha = f; c.beginPath(); c.ellipse(x, y, rad * 0.8, rad, 0, 0, 7); c.fill(); c.globalAlpha = 1;
        if (refl) { const [y0, y1] = refl; for (let k = 0; k < 26; k++) { const f2 = k / 26, yy = L.lerp(y0, y1, f2), wob = Math.sin(k * 1.7 + t * 2) * rad * 0.5;
          c.fillStyle = `rgba(255,59,48,${(0.55 * (1 - f2) + 0.05) * f})`; c.fillRect(x - rad * (0.9 + f2 * 0.8) + wob, yy, rad * (1.8 + f2 * 1.6), Math.max(1.5, (y1 - y0) / 60)); } } }
      else { c.strokeStyle = INK(0.7); c.lineWidth = Math.max(1, rad * 0.15); c.beginPath(); c.ellipse(x, y, rad * 0.8, rad, 0, 0, 7); c.stroke(); c.fillStyle = 'rgba(90,88,84,0.6)'; c.fill(); } }); }
  function boat(c, x, y, s, a = 1) { c.save(); c.globalAlpha = a; c.translate(x, y); c.scale(s, s);
    c.fillStyle = GREEN; c.strokeStyle = INK(0.85); c.lineWidth = 2.2; c.lineJoin = 'round';
    c.beginPath(); c.moveTo(-26, 0); c.lineTo(26, 0); c.lineTo(17, 11); c.lineTo(-17, 11); c.closePath(); c.fill(); c.stroke();
    c.beginPath(); c.moveTo(-2, -2); c.lineTo(-2, -34); c.lineTo(20, -4); c.closePath(); c.fill(); c.stroke(); c.restore(); }
  function greenGlow(c, x, y, r, a = 1) { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(52,210,123,${0.6 * a})`); g.addColorStop(1, 'rgba(52,210,123,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); }
  function token(c, x, y, s) { greenGlow(c, x, y, 26 * s); c.fillStyle = GREEN; c.strokeStyle = INK(0.8); c.lineWidth = 1.6 * s;
    c.beginPath(); c.moveTo(x - 12 * s, y + 7 * s); c.lineTo(x - 7 * s, y - 8 * s); c.lineTo(x + 12 * s, y - 6 * s); c.lineTo(x + 8 * s, y + 8 * s); c.closePath(); c.fill(); c.stroke(); }
  function paperLantern(c, x, y, s) { greenGlow(c, x, y, 40 * s); c.fillStyle = GREEN; c.strokeStyle = INK(0.8); c.lineWidth = 1.8 * s;
    c.beginPath(); c.ellipse(x, y, 10 * s, 14 * s, 0, 0, 7); c.fill(); c.stroke(); L.sketchLine(c, x, y - 14 * s, x, y - 28 * s, { w: 1.6 * s, col: INK(0.8), seed: 4, jitter: 0.5 }); }
  function spool(c, x, y, s, wound = 1) { c.fillStyle = '#8f8a80'; c.strokeStyle = INK(0.85); c.lineWidth = 2 * s;
    c.beginPath(); c.rect(x - 16 * s, y - 20 * s, 32 * s, 6 * s); c.rect(x - 16 * s, y + 14 * s, 32 * s, 6 * s); c.fill(); c.stroke();
    greenGlow(c, x, y, 34 * s, 0.8); c.fillStyle = GREEN; c.fillRect(x - 12 * s, y - 14 * s, 24 * s, 28 * s * wound + 0.01); c.strokeRect(x - 12 * s, y - 14 * s, 24 * s, 28 * s); }
  const curvePt = (p0, p1, sag, u) => { const cx = (p0[0] + p1[0]) / 2, cy = (p0[1] + p1[1]) / 2 + sag; return [(1 - u) * (1 - u) * p0[0] + 2 * (1 - u) * u * cx + u * u * p1[0], (1 - u) * (1 - u) * p0[1] + 2 * (1 - u) * u * cy + u * u * p1[1]]; };
  function thread(c, p0, p1, sag, col, w, upto = 1) { c.strokeStyle = col; c.lineWidth = w; c.lineCap = 'round'; c.beginPath();
    for (let i = 0; i <= 40; i++) { const u = i / 40 * upto, p = curvePt(p0, p1, sag, u); i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); } c.stroke(); }

  // ---------- characters ----------
  function bean(c, x, y, s, { mood = 'calm', look = [0, 0], hands = null, red = 0 } = {}) {
    const bw = 46 * s, bh = 60 * s, col = '#8d8a84';
    c.save(); c.lineCap = 'round';
    if (hands) hands.forEach(([hx, hy], i) => { const sd = i ? 1 : -1; c.strokeStyle = col; c.lineWidth = 7 * s; c.beginPath(); c.moveTo(x + sd * bw * 0.4, y + bh * 0.02); c.quadraticCurveTo(x + sd * bw * 0.6, y + bh * 0.3, hx, hy); c.stroke(); });
    c.fillStyle = col; c.beginPath(); c.roundRect(x - bw / 2, y - bh / 2, bw, bh, bw / 2); c.fill();
    c.strokeStyle = INK(0.75); c.lineWidth = 2.2 * s; c.stroke();
    if (red > 0) { const g = c.createLinearGradient(x + bw / 2, y - bh / 2, x - bw * 0.1, y); g.addColorStop(0, `rgba(255,59,48,${0.45 * red})`); g.addColorStop(1, 'rgba(255,59,48,0)'); c.fillStyle = g; c.beginPath(); c.roundRect(x - bw / 2, y - bh / 2, bw, bh, bw / 2); c.fill(); }
    const ey = y - bh * 0.14, er = bw * (mood === 'awe' ? 0.16 : 0.14);
    [-1, 1].forEach(sd => { const ex = x + sd * bw * 0.19; c.fillStyle = '#efeadf'; c.beginPath(); c.arc(ex, ey, er, 0, 7); c.fill(); c.strokeStyle = INK(0.9); c.lineWidth = 1.5 * s; c.stroke();
      c.fillStyle = INK(0.95); c.beginPath(); c.arc(ex + look[0] * er * 0.45, ey + look[1] * er * 0.45, er * 0.5, 0, 7); c.fill();
      if (mood === 'worried') { c.strokeStyle = INK(0.9); c.lineWidth = 2.6 * s; c.beginPath(); c.moveTo(ex - er, ey - er * 1.5 - sd * er * 0.35); c.lineTo(ex + er, ey - er * 1.5 + sd * er * 0.35); c.stroke(); } });
    const my = y + bh * 0.15; c.strokeStyle = INK(0.9); c.lineWidth = 2.6 * s; c.beginPath();
    if (mood === 'worried') c.arc(x, my + bw * 0.1, bw * 0.12, 1.2 * Math.PI, 1.8 * Math.PI);
    else if (mood === 'awe') c.ellipse(x, my, bw * 0.06, bw * 0.08, 0, 0, 7);
    else if (mood === 'resolve') c.arc(x, my - bw * 0.06, bw * 0.13, 0.2 * Math.PI, 0.8 * Math.PI);
    else { c.moveTo(x - bw * 0.1, my); c.lineTo(x + bw * 0.1, my); }
    c.stroke();
    if (hands) hands.forEach(([hx, hy]) => { c.fillStyle = col; c.beginPath(); c.arc(hx, hy, 5 * s, 0, 7); c.fill(); c.strokeStyle = INK(0.7); c.lineWidth = 1.4 * s; c.stroke(); });
    c.restore(); }
  function ghost(c, x, y, s, t, { a = 0.8, hand = null } = {}) {
    const bw = 46 * s, bh = 60 * s; c.save();
    const g = c.createRadialGradient(x, y, 0, x, y, bh * 1.3); g.addColorStop(0, `rgba(226,234,228,${0.35 * a})`); g.addColorStop(1, 'rgba(226,234,228,0)');
    c.fillStyle = g; c.beginPath(); c.arc(x, y, bh * 1.3, 0, 7); c.fill();
    if (hand) { c.strokeStyle = PALE(0.75 * a); c.lineWidth = 6 * s; c.lineCap = 'round'; c.beginPath(); c.moveTo(x + bw * 0.35, y); c.quadraticCurveTo(x + bw * 0.6, (y + hand[1]) / 2, hand[0], hand[1]); c.stroke();
      c.fillStyle = PALE(0.85 * a); c.beginPath(); c.arc(hand[0], hand[1], 4.5 * s, 0, 7); c.fill(); }
    c.fillStyle = PALE(0.62 * a); c.beginPath(); c.moveTo(x - bw / 2, y); c.arc(x, y - bh / 2 + bw / 2, bw / 2, Math.PI, 0); c.lineTo(x + bw / 2, y + bh * 0.25);
    for (let i = 0; i <= 6; i++) { const f = i / 6, xx = L.lerp(x + bw / 2, x - bw / 2, f), yy = y + bh * 0.25 + bh * 0.28 * Math.sin(f * Math.PI) * (0.8 + 0.2 * Math.sin(t * 3 + f * 6)) + Math.sin(f * 12 + t * 4) * 3 * s; c.lineTo(xx, yy); }
    c.closePath(); c.fill(); c.strokeStyle = PALE(0.9 * a); c.lineWidth = 1.6 * s; c.stroke();
    const ey = y - bh * 0.2; c.strokeStyle = `rgba(70,76,72,${0.8 * a})`; c.lineWidth = 2.4 * s; c.lineCap = 'round';
    [-1, 1].forEach(sd => { c.beginPath(); c.arc(x + sd * bw * 0.18, ey + bw * 0.04, bw * 0.08, 1.1 * Math.PI, 1.9 * Math.PI); c.stroke(); });
    c.beginPath(); c.arc(x, y - bh * 0.02, bw * 0.1, 0.2 * Math.PI, 0.8 * Math.PI); c.stroke(); c.restore(); }

  // ---------- cards ----------
  function card(c, lines, y, size, a, col = '#f4efe3') { if (a <= 0) return; L.title(c, lines.map(tx => typeof tx === 'string' ? { text: tx } : tx), y, size, { alpha: a, col }); }
  const fade = (t, a, b, e = 0.25) => L.sm(a, a + e, t) * (1 - L.sm(b - e, b, t));
  function inkLabel(c, text, x, y, size, a = 1, align = 'left', col = INK(0.9), font = HAND) { c.save(); c.globalAlpha = a; c.font = `${size}px "${font}"`; c.textAlign = align; c.fillStyle = col; c.fillText(text, x, y); c.restore(); }
  function tallySlip(c, day, a = 1) { if (a <= 0) return; c.save(); c.globalAlpha = a; c.fillStyle = PAPER; c.fillRect(84, 232, 12 * 46 + 40, 78); c.strokeStyle = INK(0.6); c.lineWidth = 2; c.strokeRect(84, 232, 12 * 46 + 40, 78);
    for (let i = 0; i < 12; i++) { const f = L.clamp(day - i, 0, 1); if (f <= 0) continue; L.sketchLine(c, 114 + i * 46, 250, 114 + i * 46 + 4, 250 + 44 * f, { w: 6, col: INK(0.9), seed: 30 + i, jitter: 1.5 }); }
    inkLabel(c, 'each stroke: one day', 84, 346, 32, 0.85, 'left', '#e8e4da'); c.restore(); }

  // ---------- WORLD (landscape): prerender ----------
  const WX = -300, WY = -450, WW = 1680, WH = 2820, WS = 1.4;
  const HB = { cx: 760, base: 470, w: 170, h: 120, roof: 60 }, HA = { cx: 300, base: 1640, w: 300, h: 200, roof: 95 };
  const LB = [715, 745, 775, 805].map(x => [x, HB.base - HB.h + 16]), LA = [210, 262, 338, 390].map(x => [x, HA.base - HA.h + 22]);
  const WIN_A = [225, 1525], WIN_B = [760, 420];
  const world = createCanvas(Math.round(WW * WS), Math.round(WH * WS));
  { const c = world.getContext('2d'); c.scale(WS, WS); c.translate(-WX, -WY);
    c.fillStyle = PAPER; c.fillRect(WX, WY, WW, WH);
    mountains(c, WX, WX + WW, 470, -380, 0.16, 3); mountains(c, WX, WX + WW, 470, -120, 0.26, 7); mountains(c, WX, WX + WW, 480, 180, 0.42, 11);
    c.fillStyle = INK(0.75); c.fillRect(WX, 466, WW, 22); for (let i = 0; i < 26; i++) pine(c, WX + 40 + i * 64 + R0() * 30, 472, 40 + R0() * 50, 0.7, 100 + i);
    water(c, WX, WX + WW, 488, 1500, 0.5, 0.78, 21, 520);
    const g = c.createLinearGradient(0, 1500, 0, WY + WH); g.addColorStop(0, INK(0.72)); g.addColorStop(0.25, INK(0.35)); g.addColorStop(1, INK(0.12)); c.fillStyle = g; c.fillRect(WX, 1500, WW, WY + WH - 1500);
    L.sketchLine(c, WX, 1502, WX + WW, 1498, { w: 7, col: INK(0.85), seed: 40, jitter: 5 });
    for (let i = 0; i < 14; i++) blot(c, WX + 60 + i * 120, 1560 + R0() * 60, 90, 22, 0.25, 200 + i, 5);
    reeds(c, 480, 1100, 1510, 0.6, 51); reeds(c, -250, 100, 1510, 0.6, 52);
    pine(c, 40, 1700, 260, 0.8, 61); pine(c, 590, 1720, 180, 0.7, 62); pine(c, 1000, 1690, 300, 0.75, 63);
    house(c, HB.cx, HB.base, HB.w, HB.h, HB.roof, 71, [WIN_B[0]], WIN_B[1], 26);
    house(c, HA.cx, HA.base, HA.w, HA.h, HA.roof, 72, [WIN_A[0], 380], WIN_A[1], 60); }

  function drawWorld(c, cam, day, t) {
    c.save(); L.camera(c, [[0, cam]], 0);
    c.drawImage(world, WX, WY, WW, WH);
    const lvl = level(day), flick = inHold11(t) ? 1 : 0;
    // clerk in her window (tiny) and the far clerk
    c.save(); c.beginPath(); c.rect(WIN_A[0] - 24, WIN_A[1] - 30, 48, 60); c.clip(); c.fillStyle = 'rgba(150,146,138,0.9)'; c.fillRect(WIN_A[0] - 24, WIN_A[1] - 30, 48, 60); bean(c, WIN_A[0], WIN_A[1] + 12, 0.55, { mood: lvl >= 3 ? 'worried' : 'calm', look: [0.6, -1] }); c.restore();
    c.fillStyle = 'rgba(150,146,138,0.9)'; c.fillRect(WIN_B[0] - 10, WIN_B[1] - 13, 20, 26); bean(c, WIN_B[0], WIN_B[1] + 5, 0.22, { mood: 'calm' });
    lanterns(c, LB.map(p => p[0]), LB[0][1], 7, lvl, t, { refl: [492, 800], flick });
    lanterns(c, LA.map(p => p[0]), LA[0][1], 11, lvl, t, { flick });
    // ghost thread (hindsight) + ghost on the water
    const p0 = [WIN_A[0] + 18, WIN_A[1] + 20], p1 = [WIN_B[0], WIN_B[1] + 8];
    thread(c, p0, p1, 90, PALE(0.55), 2.2);
    const gp = curvePt(p0, p1, 90, 0.42); ghost(c, gp[0] - 26, gp[1] + 40, 1.0, t, { a: 0.85, hand: gp });
    // fragments
    token(c, WIN_A[0] - 12, WIN_A[1] + 34, 0.7);
    BOATS.forEach((b, i) => { if (day < b.send) return; const p = L.clamp((day - b.send) / b.lat, 0, 1);
      const x = L.lerp(HB.cx - 30 - i * 20, 360 + i * 46, p), y = L.lerp(500, 1488, p); boat(c, x, y, L.lerp(0.45, 0.9, p)); });
    if (day >= F4) paperLantern(c, HA.cx + 90, HA.base - 30, 0.9);
    if (day >= DEAL - 0.3) { const k = L.clamp((day - (DEAL - 0.3)) / 0.3, 0, 1); greenGlow(c, WIN_A[0], WIN_A[1] + 20, 70 * k); }
    c.restore(); }

  // ---------- WINDOW COMP (close, eye level): prerender ----------
  const CS = 2, WIN = { x0: 130, x1: 950, y0: 250, y1: 1190 };
  const FH = { cx: 560, base: 600, w: 320, h: 190, roof: 95 };
  const LBC = [455, 525, 600, 670], LBC_Y = FH.base - FH.h + 36, FWIN = [560, 520];
  const SPOOL = [505, 1600], HOOK = [800, 1206], TOKEN = [880, 1200];
  const comp = createCanvas(1080 * CS, 1920 * CS);
  { const c = comp.getContext('2d'); c.scale(CS, CS);
    c.fillStyle = '#2d2b27'; c.fillRect(0, 0, 1080, 1920);
    const r = L.rng(77); for (let i = 0; i < 60; i++) { c.fillStyle = r() < 0.5 ? 'rgba(0,0,0,0.12)' : 'rgba(211,205,191,0.035)'; c.beginPath(); c.ellipse(r() * 1080, r() * 1920, 80 + r() * 260, 40 + r() * 160, r() * 3, 0, 7); c.fill(); }
    c.save(); c.beginPath(); c.rect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0); c.clip();
    c.fillStyle = PAPER; c.fillRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0);
    mountains(c, WIN.x0, WIN.x1, 600, 180, 0.15, 13); mountains(c, WIN.x0, WIN.x1, 600, 330, 0.3, 17); mountains(c, WIN.x0, WIN.x1, 605, 470, 0.5, 19);
    c.fillStyle = INK(0.8); c.fillRect(WIN.x0, 592, WIN.x1 - WIN.x0, 18);
    for (let i = 0; i < 9; i++) if (i !== 4 && i !== 3) pine(c, 150 + i * 95, 598, 60 + (i % 3) * 25, 0.7, 300 + i);
    water(c, WIN.x0, WIN.x1, 608, WIN.y1, 0.55, 0.8, 23, 260);
    house(c, FH.cx, FH.base, FH.w, FH.h, FH.roof, 81, [FWIN[0]], FWIN[1], 50);
    c.restore();
    // window frame + sill
    c.strokeStyle = '#1b1a17'; c.lineWidth = 34; c.strokeRect(WIN.x0, WIN.y0, WIN.x1 - WIN.x0, WIN.y1 - WIN.y0);
    L.sketchLine(c, WIN.x0 - 20, WIN.y0 - 14, WIN.x1 + 20, WIN.y0 - 16, { w: 8, col: INK(0.9), seed: 91, jitter: 2 });
    c.fillStyle = '#5b5750'; c.fillRect(WIN.x0 - 40, 1188, WIN.x1 - WIN.x0 + 80, 50); L.sketchLine(c, WIN.x0 - 40, 1190, WIN.x1 + 40, 1188, { w: 5, col: INK(0.85), seed: 92, jitter: 1.5 });
    L.sketchLine(c, WIN.x0 - 40, 1238, WIN.x1 + 40, 1240, { w: 5, col: INK(0.85), seed: 93, jitter: 1.5 });
    // hook on sill
    c.strokeStyle = INK(0.95); c.lineWidth = 6; c.beginPath(); c.arc(HOOK[0], HOOK[1] - 10, 12, Math.PI * 0.1, Math.PI * 1.1, true); c.stroke(); }

  function compTally(c, day) { for (let i = 0; i < 12; i++) { const f = L.clamp(day - i, 0, 1); if (f <= 0) continue; L.sketchLine(c, 180 + i * 34, 1196, 184 + i * 34, 1196 + 34 * f, { w: 5, col: INK(0.9), seed: 50 + i, jitter: 1.2 }); } }

  // comp: cam = [cx, cy, s]; opts: ghostMode ('beside'|'water'|'guide'), tie (0..1), lvlOverride
  function drawComp(c, cam, day, t, o = {}) {
    c.save(); c.translate(540, 960); c.scale(cam[2], cam[2]); c.translate(-cam[0], -cam[1]);
    c.drawImage(comp, 0, 0, 1080, 1920);
    const lvl = o.lvl ?? level(day), flick = inHold11(t) ? 1 : 0;
    c.save(); c.beginPath(); c.rect(WIN.x0 + 17, WIN.y0 + 17, WIN.x1 - WIN.x0 - 34, WIN.y1 - WIN.y0 - 34); c.clip();
    c.fillStyle = 'rgba(150,146,138,0.95)'; c.fillRect(FWIN[0] - 20, FWIN[1] - 25, 40, 50); bean(c, FWIN[0], FWIN[1] + 8, 0.45, { mood: 'calm' });
    lanterns(c, LBC, LBC_Y, 20, lvl, t, { refl: [612, 1170], flick });
    // thread: ghost (pale) or real (green, when tied)
    const far = [FWIN[0] + 8, FWIN[1] + 10];
    if (o.tie > 0) thread(c, [HOOK[0], HOOK[1] - 16], far, 60, GREEN, 5, L.clamp(o.tie, 0, 1));
    else thread(c, [HOOK[0], HOOK[1] - 16], far, 60, PALE(0.6), 3);
    // boats crossing toward her
    BOATS.forEach((b, i) => { if (day < b.send || o.noFrag) return; const p = L.clamp((day - b.send) / b.lat, 0, 1);
      boat(c, L.lerp(FH.cx - 60 + i * 80, 640 + i * 90, p), L.lerp(622, 1172, p * p * 0.6 + p * 0.4), L.lerp(0.7, 2.1, p)); });
    let gp = null;
    if (o.ghostMode === 'water') { gp = curvePt([HOOK[0], HOOK[1] - 16], far, 60, o.gu ?? 0.45); ghost(c, gp[0] - 40, gp[1] + 60, 1.5, t, { a: 0.9, hand: gp }); }
    c.restore();
    // green pieces inside the room
    if (!o.noFrag) { token(c, TOKEN[0], TOKEN[1], 1.3); if (day >= F4) paperLantern(c, 215, 1330, 1.8); }
    compTally(c, o.tally ?? day);
    // pale thread from spool to hook (ghost's line) or green when tied
    const hands = o.hands || [[SPOOL[0] - 22, SPOOL[1] + 4], [SPOOL[0] + 22, SPOOL[1] + 4]];
    const sp = o.spoolAt || SPOOL;
    if (o.tie > 0) thread(c, [sp[0], sp[1] - 10], [HOOK[0], HOOK[1] - 16], 30, GREEN, 5);
    else thread(c, [sp[0], sp[1] - 10], [HOOK[0], HOOK[1] - 16], 50, PALE(0.6), 3);
    // knot of the deal: fragments reach her hands
    if (!o.noFrag && day >= DEAL - 0.3) { const k = L.clamp((day - (DEAL - 0.3)) / 0.3, 0, 1);
      [[TOKEN[0], TOKEN[1]], [640, 1172], [730, 1172], [215, 1330]].forEach(([x, y]) => { c.strokeStyle = GREEN; c.lineWidth = 4; c.beginPath(); c.moveTo(x, y); c.lineTo(L.lerp(x, sp[0], k), L.lerp(y, sp[1], k)); c.stroke(); });
      greenGlow(c, sp[0], sp[1], 120 * k); }
    bean(c, (o.beanAt||[400,1560])[0], (o.beanAt||[400,1560])[1], 3.2, { mood: o.mood || (lvl >= 3 ? 'worried' : 'calm'), look: o.look || [0.55, -0.9], hands, red: lvl / 4 });
    spool(c, sp[0], sp[1], 1.5);
    if (o.ghostMode === 'beside') ghost(c, 800, 1540, 2.6, t, { a: 0.95, hand: o.ghostHand || [SPOOL[0] + 40, SPOOL[1] - 30] });
    if (o.ghostMode === 'guide') ghost(c, o.gx || 760, 1440, 2.6, t, { a: 0.9, hand: o.ghostHand });
    c.restore(); }

  // ---------- SNAP A: whole record to scale ----------
  function snapA(c, t) {
    c.fillStyle = PAPER; c.fillRect(0, 0, 1080, 1920);
    const X = d => 60 + d / 260 * 960, top = 900, bot = 1180;
    const day = L.clamp((t - 20.6) * 100, 0, 260);
    const g = c.createLinearGradient(0, top, 0, bot); g.addColorStop(0, INK(0.55)); g.addColorStop(1, INK(0.8)); c.fillStyle = g; c.fillRect(60, top, 960, bot - top);
    L.sketchLine(c, 50, top, 1030, top, { w: 6, col: INK(0.9), seed: 5, jitter: 2 }); L.sketchLine(c, 50, bot, 1030, bot, { w: 6, col: INK(0.9), seed: 6, jitter: 2 });
    // red sliver (alert level by the same ordinal map; fades after the deal, no date claimed)
    for (let d = 0; d < Math.min(day, 20); d += 0.25) { const lv = level(d) / 4 * (d <= DEAL ? 1 : Math.max(0, 1 - (d - DEAL) / 6)); if (lv <= 0) continue; c.fillStyle = `rgba(255,59,48,${lv})`; c.fillRect(X(d), top + 4, 960 / 260 * 0.25 + 0.6, bot - top - 8); }
    if (day >= 10) { [[10, 0.35], [11, 0.55], [11.5, 0.75]].forEach(([d, fy]) => { if (day >= d) { c.fillStyle = GREEN; c.beginPath(); c.arc(X(d), L.lerp(top, bot, fy), 5, 0, 7); c.fill(); } }); }
    if (day >= DEAL) greenGlow(c, X(DEAL), (top + bot) / 2, 30);
    // the real line, strung at day 247
    if (day >= LINE) { const k = L.sm(0, 0.3, (t - 20.6) - LINE / 100); greenGlow(c, X(LINE), (top + bot) / 2, 90 * k); c.strokeStyle = GREEN; c.lineWidth = 7; c.beginPath(); c.moveTo(X(LINE), top); c.lineTo(X(LINE), L.lerp(top, bot, k)); c.stroke(); }
    // unrevealed veil + playhead
    if (day < 260) { c.fillStyle = 'rgba(211,205,191,0.8)'; c.fillRect(X(day), top - 10, 1030 - X(day), bot - top + 20); L.sketchLine(c, X(day), top - 30, X(day), bot + 30, { w: 3, col: INK(0.8), seed: 8, jitter: 1 }); }
    // ghost walks back from the line to day 0, carrying the pale thread
    const gw = L.ease.inOut(L.clamp((t - 24.2) / 1.4, 0, 1)), gx = L.lerp(X(LINE), X(0) + 6, gw);
    if (t > 23.6) { const a = L.sm(23.6, 24.0, t); c.save(); c.globalAlpha = a; c.strokeStyle = PALE(0.85); c.lineWidth = 4; c.beginPath(); c.moveTo(gx, top); c.lineTo(gx, bot); c.stroke();
      for (let k = 0; k < 10; k++) { const f = k / 10, xx = L.lerp(gx, X(LINE), f * gw); c.fillStyle = PALE(0.08 * (1 - f)); c.fillRect(xx, top + 4, 12, bot - top - 8); }
      ghost(c, gx + 30, (top + bot) / 2 + 20, 1.5, t, { a: 0.95, hand: [gx, (top + bot) / 2 - 10] }); c.restore(); }
    inkLabel(c, 'the crisis', 80, 1245, 42, L.sm(20.8, 21.1, t));
    inkLabel(c, 'the direct line', 900, 1245, 42, L.sm(23.1, 23.4, t), 'right', INK(0.9));
    inkLabel(c, 'the whole record, to scale', 540, 820, 48, fade(t, 20.6, 26.0), 'center');
    card(c, ['The direct line', { text: 'took 247 days.', col: '#f4efe3' }], 470, 100, fade(t, 23.1, 24.7));
    card(c, ['The ghost', 'was hindsight.'], 470, 110, fade(t, 24.6, 26.05, 0.2));
    L.slate(c, 'SC7  SNAP  WHOLE RECORD  FLAT');
  }

  // ---------- SNAP B: side by side, 1 s = 4 days ----------
  function panel(c, y0, day, deal, sends, lat, label, sub) {
    const x0 = 60, w = 960, h = 380;
    c.save(); c.fillStyle = '#c9c3b4'; c.fillRect(x0, y0, w, h);
    c.beginPath(); c.rect(x0, y0, w, h); c.clip();
    mountains(c, x0, x0 + w, y0 + 120, y0 + 30, 0.25, 31);
    const g = c.createLinearGradient(0, y0 + 120, 0, y0 + h); g.addColorStop(0, INK(0.55)); g.addColorStop(1, INK(0.8)); c.fillStyle = g; c.fillRect(x0, y0 + 120, w, h - 120);
    // houses
    const hb = [x0 + 720, y0 + 122], ha = [x0 + 220, y0 + 330];
    [[hb, 90, 60], [ha, 130, 80]].forEach(([p, ww, hh]) => { c.fillStyle = 'rgba(120,118,112,0.9)'; c.fillRect(p[0] - ww / 2, p[1] - hh, ww, hh); c.fillStyle = INK(0.85); c.beginPath(); c.moveTo(p[0] - ww * 0.7, p[1] - hh + 2); c.lineTo(p[0] - ww * 0.3, p[1] - hh - 30); c.lineTo(p[0] + ww * 0.3, p[1] - hh - 30); c.lineTo(p[0] + ww * 0.7, p[1] - hh + 2); c.closePath(); c.fill(); });
    const lv = level(day);
    lanterns(c, [hb[0] - 30, hb[0] - 10, hb[0] + 10, hb[0] + 30], hb[1] - 52, 7, lv, 0, { refl: [y0 + 124, y0 + 250] });
    lanterns(c, [ha[0] - 45, ha[0] - 15, ha[0] + 15, ha[0] + 45], ha[1] - 70, 9, lv, 0);
    sends.forEach((s, i) => { if (day < s) return; const p = lat ? L.clamp((day - s) / lat[i], 0, 1) : 1;
      boat(c, L.lerp(hb[0] - 20, ha[0] + 110 + i * 60, p), L.lerp(y0 + 140, y0 + 300, p), 0.8); });
    if (day >= deal) { greenGlow(c, ha[0], ha[1] - 40, 110); c.fillStyle = GREEN; c.beginPath(); c.arc(ha[0], ha[1] - 40, 14, 0, 7); c.fill(); }
    // tally row (one stroke per day)
    c.fillStyle = 'rgba(211,205,191,0.92)'; c.fillRect(x0 + 330, y0 + 300, 12 * 44 + 30, 66);
    for (let i = 0; i < 12; i++) { const f = L.clamp(day - i, 0, 1); if (f > 0) L.sketchLine(c, x0 + 350 + i * 44, y0 + 310, x0 + 352 + i * 44, y0 + 310 + 44 * f, { w: 5, col: INK(0.9), seed: 70 + i, jitter: 1 }); }
    if (day >= deal) { const kx = x0 + 350 + (deal - 1) * 44; greenGlow(c, kx, y0 + 332, 40); c.strokeStyle = GREEN; c.lineWidth = 7; c.beginPath(); c.moveTo(kx, y0 + 306); c.lineTo(kx + 2, y0 + 358); c.stroke(); }
    c.restore(); c.strokeStyle = INK(0.8); c.lineWidth = 3; c.strokeRect(x0, y0, w, h);
    inkLabel(c, label, 80, y0 - 18, 46);
    if (sub) inkLabel(c, sub, 80, y0 + h + 52, 40, 0.85);
  }
  function snapB(c, t) {
    c.fillStyle = PAPER; c.fillRect(0, 0, 1080, 1920);
    const a = L.sm(26.0, 26.3, t); c.save(); c.globalAlpha = a;
    const day = L.clamp((t - 26.3) * 4, 0, 12);
    panel(c, 400, day, DEAL, [F.f2, F.f3], [LAT_WORST, LAT_TYP], 'as it happened', null);
    const sh = DEAL - AIDEAL; // illustrative one-day shift, transit ~minutes
    panel(c, 960, day, AIDEAL, [F.f2 - sh, F.f3 - sh], [0.01, 0.01], 'frontier AI carries + translates', 'people still decide');
    c.restore();
    inkLabel(c, 'illustrative', 80, 1470, 56, a, 'left', INK(0.95), SERIF);
    inkLabel(c, 'a day sooner', 900, 1470, 56, L.sm(29.05, 29.3, t), 'right', INK(0.95), SERIF);
    L.slate(c, 'SC8  SNAP  SIDE BY SIDE');
  }

  // ---------- camera plans ----------
  const CRANE = [[5.2, [300, 1480, 2.6]], [6.4, [300, 1380, 2.0]], [9.0, [540, 980, 0.7]], [13.6, [540, 960, 0.72]], [16.4, [228, 1515, 3.4]]];
  const COMP1 = [[0, [540, 960, 1.0]], [1.6, [540, 960, 1.0]], [2.8, [540, 960, 1.02]], [5.2, [540, 960, 1.08]], [6.2, [540, 700, 1.2]]];
  const COMP2 = [[15.9, [520, 1080, 1.1]], [17.4, [520, 1150, 1.35]], [20.2, [520, 1155, 1.38]]];
  const COMP3 = [[30.2, [600, 1300, 1.55]], [31.4, [680, 1300, 1.9]], [35.4, [690, 1300, 2.0]]];

  function draw(c, t) {
    c.fillStyle = PAPER; c.fillRect(0, 0, 1080, 1920);
    const day = dayAt(t);
    if (t < 5.2) {
      const cam = L.key(COMP1, t);
      drawComp(c, cam, day, t, { ghostMode: t < 3.0 ? 'beside' : 'water', gu: 0.45,
        ghostHand: t >= 1.6 && t < 2.8 ? [L.lerp(SPOOL[0] + 40, 720, L.sm(1.6, 1.9, t)), L.lerp(SPOOL[1] - 30, 1150, L.sm(1.6, 1.9, t))] : null });
      if (t >= 3.0 && t < 3.6) { c.fillStyle = `rgba(214,226,218,${0.25 * (1 - L.sm(3.0, 3.6, t))})`; c.fillRect(0, 0, 1080, 1920); }
      if (t >= 1.6 && t < 2.8) { // rewind veil: ink un-bleeding
        const f = Math.sin((t - 1.6) / 1.2 * Math.PI); c.fillStyle = `rgba(214,226,218,${0.18 * f})`; c.fillRect(0, 0, 1080, 1920);
        for (let i = 0; i < 18; i++) { const y = (i * 131 + (t - 1.6) * -900) % 1920; c.fillStyle = `rgba(214,226,218,${0.12 * f})`; c.fillRect(0, (y + 1920) % 1920, 1080, 6); } }
      card(c, ['She held the line.'], 330, 112, t < 1.4 ? 1 : 1 - L.sm(1.4, 1.6, t));
      card(c, ['Rewind.'], 330, 120, fade(t, 1.6, 2.95));
      card(c, ['Two houses.', 'Dark water.'], 330, 104, fade(t, 3.0, 5.2));
      L.slate(c, t < 1.6 ? 'SC1  CLOSE  EYE LEVEL  (flash-forward)' : t < 2.8 ? 'SC1  REWIND' : 'SC2  CLOSE  PUSH');
    } else if (t < 13.6) {
      drawWorld(c, L.key(CRANE, t), day, t);
      if (t < 6.2) { c.save(); c.globalAlpha = 1 - L.sm(5.2, 6.1, t); drawComp(c, L.key(COMP1, t), day, t, { ghostMode: 'water' }); c.restore(); }
      tallySlip(c, day, L.sm(5.8, 6.3, t));
      card(c, ['The line was', 'already on the spool.'], 560, 96, fade(t, 6.2, 8.9));
      card(c, ['Every word', 'crossed by boat.'], 560, 100, fade(t, 9.4, 13.3));
      L.slate(c, t < 9 ? 'SC3  CRANE UP' : 'SC4  WIDE  BOTH SHORES');
    } else if (t < 17.4) {
      drawWorld(c, L.key(CRANE, t), day, t);
      tallySlip(c, day, 1 - L.sm(15.8, 16.2, t));
      if (t >= 15.9) { c.save(); c.globalAlpha = L.sm(15.9, 16.5, t); drawComp(c, L.key(COMP2, t), day, t, { ghostMode: 'water', gu: 0.5 }); c.restore(); }
      card(c, ['It held', 'by a thread.'], 560, 110, fade(t, 15.2, 17.35));
      L.slate(c, 'SC5  DROP DOWN');
    } else if (t < 20.2) {
      drawComp(c, L.key(COMP2, t), DEAL, t, { ghostMode: 'water', gu: 0.5 });
      c.fillStyle = `rgba(10,10,9,${0.6 * L.sm(17.4, 17.8, t)})`; c.fillRect(0, 0, 1080, 1920);
      card(c, ['We slowed it down', 'so you could see it.'], 820, 96, fade(t, 17.6, 20.15));
      L.slate(c, 'SC6  FREEZE');
    } else if (t < 26.0) {
      if (t < 20.6) { c.fillStyle = '#0c0c0b'; c.fillRect(0, 0, 1080, 1920); }
      else snapA(c, t);
    } else if (t < 30.2) {
      snapB(c, t);
    } else {
      // IN++: the ghost guides her hand; she ties the green line before it is needed (day 0: lanterns dark)
      const cam = L.key(COMP3, t), k = L.sm(30.3, 31.2, t), tie = L.sm(31.2, 32.0, t);
      const sp = [L.lerp(SPOOL[0], HOOK[0] - 60, k), L.lerp(SPOOL[1], HOOK[1] + 60, k)];
      drawComp(c, cam, 0, t, { beanAt: [L.lerp(400, 600, k), L.lerp(1560, 1440, k)], ghostMode: 'guide', gx: L.lerp(840, 860, k), ghostHand: [sp[0] + 30, sp[1] - 26], tie: tie > 0 ? tie : 0, lvl: 0, tally: 0,
        hands: [[sp[0] - 24, sp[1] + 4], [sp[0] + 22, sp[1] + 4]], spoolAt: sp, mood: tie > 0.9 ? 'resolve' : 'calm', look: [0.8, -0.6] });
      if (t < 33.0) card(c, ['Build the line', 'before you need it.'], 520, 100, fade(t, 30.4, 32.95));
      else { c.fillStyle = `rgba(10,10,9,${0.5 * L.sm(33.0, 33.3, t)})`; c.fillRect(0, 0, 1080, 1920); card(c, ['This is', 'the bottleneck.'], 560, 116, fade(t, 33.05, 35.45)); }
      L.slate(c, 'SC9  EXTREME CLOSE  DROP IN');
      if (t >= 35.4) L.endCard(c, L.sm(35.4, 35.8, t), { line: 'The bottleneck is us.' });
    }
    if (t < 35.4) L.grain(c, t, { alpha: 0.05, n: 350 });
  }

  const cues = [{ t: 1.6, type: 'whoosh' }, { t: 5.2, type: 'whoosh' }, { t: tOfDay(6), type: 'bonk' }, { t: tOfDay(8), type: 'bonk' },
    { t: tOfDay(F.f2), type: 'pop' }, { t: tOfDay(F.f2 + LAT_WORST), type: 'ding' }, { t: tOfDay(F.f3 + LAT_TYP), type: 'ding' }, { t: tOfDay(DEAL), type: 'ding' },
    { t: 13.6, type: 'whoosh' }, { t: 20.2, type: 'hit' }, { t: 20.6 + LINE / 100, type: 'pop' }, { t: 26.0, type: 'hit' },
    { t: 26.3 + AIDEAL / 4, type: 'pop' }, { t: 26.3 + DEAL / 4, type: 'ding' }, { t: 31.2, type: 'ding' }, { t: 33.0, type: 'hit' }];
  return { draw, DUR,
    acts: [{ start: 0, end: 15.4, bpm: 0, drone: true }, { start: 9.0, end: 15.4, bpm: 52 }, { start: 16.4, end: 20.2, bpm: 0, drone: true },
      { start: 20.6, end: 30.2, bpm: 0, drone: true }, { start: 30.2, end: 40.5, bpm: 0, drone: true }],
    cues, _debug: { f2arr: tOfDay(F.f2 + LAT_WORST), f3arr: tOfDay(F.f3 + LAT_TYP), deal: tOfDay(DEAL), lineT: 20.6 + LINE / 100 } };
}
module.exports = makeScene;
