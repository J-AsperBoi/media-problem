// eight-billion-heads ("One Body"): man-in-a-hole, x-ray, body/biology, multi-scale zoom, crane up and drop down. Analog: covid-2020.
// The planet is one x-ray body; its 96 organs are countries (each 1/96 of the 234 in the OWID file); every organ is a crowd of x-ray people.
// Red: analog threat.points extent (share of countries with a case, s1), piecewise-linear between the 11 sourced points; organ k red when extent >= (k+.5)/96.
// Green: per organ max(343, L.lognormalQuantile(q, 421, 490)) (s2; floor = first dose outside trials, f7). Hero organ q = 0.5 -> day 421.
// AI snap: ai_counterfactual median 363, same sigma, same floor, same supply. Labeled illustrative.
// Mapping: day = 30 * (t - 2) for t in [2, 22] (1 s = 30 days). Cold open = flash-forward to the same timeline. Snap replay: 1 s = 200 days.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('covid-2020');
  const DUR = 40.6, RED = L.RED, GREEN = L.GREEN, BG = '#05080c';
  const BONE = [221, 226, 229];
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${Math.max(0, Math.min(1, a))})`;
  const REDC = [255, 59, 48], GRC = [52, 210, 123];

  // ---------- speeds ----------
  const DPS = 30;
  const pts = [{ t: 0, extent: 0 }].concat(A.threat.points);
  const extent = d => { if (d <= 0) return 0; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1]; if (d <= b.t) return L.lerp(a.extent, b.extent, (d - a.t) / (b.t - a.t)); } return pts[pts.length - 1].extent; };
  const FR = {}; A.solution.fragments.forEach(f => FR[f.id] = f.ready_at);
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;
  const AIMED = A.ai_counterfactual.aggregation_median, AIP90 = AIMED * P90 / MED;
  const FLOOR = FR.f7; // 343: first dose outside trials

  // ---------- the planet-body (world = design space at zoom 1) ----------
  const CAPS = [
    { a: [540, 300], b: [540, 300], r: 135 },
    { a: [540, 430], b: [540, 520], r: 55 },
    { a: [540, 640], b: [540, 1090], r: 215 },
    { a: [345, 560], b: [200, 1080], r: 62 }, { a: [735, 560], b: [880, 1080], r: 62 },
    { a: [200, 1080], b: [150, 1440], r: 52 }, { a: [880, 1080], b: [930, 1440], r: 52 },
    { a: [450, 1180], b: [425, 1500], r: 88 }, { a: [630, 1180], b: [655, 1500], r: 88 },
    { a: [425, 1500], b: [405, 1790], r: 66 }, { a: [655, 1500], b: [675, 1790], r: 66 },
  ];
  const segD = (x, y, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l2 = dx * dx + dy * dy; let f = l2 ? ((x - a[0]) * dx + (y - a[1]) * dy) / l2 : 0; f = L.clamp(f, 0, 1); return Math.hypot(x - a[0] - f * dx, y - a[1] - f * dy); };
  const inside = (x, y, m) => CAPS.some(c => segD(x, y, c.a, c.b) < c.r - m);

  const R = L.rng(8021);
  const organs = [];
  let minD = 92;
  for (let tries = 0; organs.length < 96 && tries < 60000; tries++) {
    if (tries && tries % 12000 === 0) minD -= 6;
    const x = 60 + R() * 960, y = 160 + R() * 1660;
    if (!inside(x, y, 34)) continue;
    if (organs.some(o => Math.hypot(o.x - x, o.y - y) < minD)) continue;
    organs.push({ x, y });
  }
  const N = organs.length;
  organs.forEach((o, i) => { let nd = 1e9; organs.forEach((p, j) => { if (i !== j) nd = Math.min(nd, Math.hypot(o.x - p.x, o.y - p.y)); });
    o.r = Math.min(42, nd * 0.46); o.rx = o.r * (0.92 + R() * 0.16); o.ry = o.r * (0.86 + R() * 0.24); o.rot = (R() - 0.5) * 1.2; o.i = i; o.lum = 0.7 + R() * 0.3; });
  const nearest = (x, y, ex = []) => organs.filter(o => !ex.includes(o)).reduce((b, o) => Math.hypot(o.x - x, o.y - y) < Math.hypot(b.x - x, b.y - y) ? o : b);
  const HO = nearest(560, 800); HO.r = HO.rx = HO.ry = Math.max(HO.r, 40); HO.rot = 0;
  const ORIGIN = nearest(250, 600);

  // red order: distance from origin organ + seeded noise; hero organ placed at rank ~33 (extent 0.35 -> ~day 65)
  const order = organs.map(o => ({ o, k: Math.hypot(o.x - ORIGIN.x, o.y - ORIGIN.y) + R() * 380 })).sort((a, b) => a.k - b.k).map(e => e.o);
  { const hi = order.indexOf(HO), j = 33; order.splice(hi, 1); order.splice(j, 0, HO); }
  order.forEach((o, k) => { o.redDay = Infinity; const need = (k + 0.5) / N; for (let d = 0; d <= 700; d += 0.25) if (extent(d) >= need) { o.redDay = d; break; } });
  organs.forEach(o => { const dx = o.x - ORIGIN.x, dy = o.y - ORIGIN.y, l = Math.hypot(dx, dy) || 1; o.dir = [dx / l, dy / l]; });
  HO.dir = [1, 0];
  const SPAN_R = 6, SPAN_G = 5;

  // green quantiles (shuffled); hero organ gets the median
  const qs = organs.map((_, i) => (i + 0.5) / N); for (let i = qs.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [qs[i], qs[j]] = [qs[j], qs[i]]; }
  organs.forEach((o, i) => o.q = qs[i]);
  { const mid = organs.reduce((b, o) => Math.abs(o.q - 0.5) < Math.abs(b.q - 0.5) ? o : b); [mid.q, HO.q] = [HO.q, mid.q]; HO.q = 0.5; }
  organs.forEach(o => { o.gDay = Math.max(FLOOR, L.lognormalQuantile(o.q, MED, P90)); o.aiDay = Math.max(FLOOR, L.lognormalQuantile(o.q, AIMED, AIP90)); });

  // ---------- people (each organ is a crowd). Figure local units: 1 world unit = HS local px ----------
  const HS = 180;
  const H = { x: HO.x, y: HO.y + 2 };
  const people = [];
  organs.forEach(o => {
    const hero = o === HO, sx = hero ? 4.2 : 5.3, sy = 10.5;
    const port = hero ? [H.x, H.y] : [o.x - o.dir[0] * o.r * -0.2 + (540 - o.x) * 0.0, o.y];
    o.port = hero ? [H.x, H.y] : [o.x + (o.x < 540 ? 1 : -1) * o.r * 0.8, o.y];
    const nj = Math.ceil(o.r / sy), ni = Math.ceil(o.r / sx) + 1;
    for (let j = -nj; j <= nj; j++) for (let i = -ni; i <= ni; i++) {
      const gy = j * sy, gx = i * sx, off = (Math.abs(j) % 2) * sx * 0.5;
      let px = o.x + gx + off + (hero ? 0 : (R() - 0.5) * 1.6), py = o.y + gy + (hero ? 0 : (R() - 0.5) * 2);
      if (hero) { px = H.x + gx + off; py = H.y + gy; if (Math.abs(py - H.y) < 1 && Math.abs(px - H.x) < 0.5) continue; }
      const ex = (px - o.x) * Math.cos(-o.rot) - (py - o.y) * Math.sin(-o.rot), ey = (px - o.x) * Math.sin(-o.rot) + (py - o.y) * Math.cos(-o.rot);
      if ((ex / (o.rx - 3)) ** 2 + ((ey + 2) / (o.ry - 6)) ** 2 > 1) continue;
      people.push(mkP(o, px, py, false));
    }
  });
  function mkP(o, x, y, hero) {
    const proj = (x - o.x) * o.dir[0] + (y - o.y) * o.dir[1];
    const rd = o.redDay + SPAN_R * L.clamp((proj + 1.1 * o.r) / (2.3 * o.r), 0, 1);
    const gd = dist => o.gDay + SPAN_G * L.clamp(dist / (2 * o.r), 0, 1);
    return { o, x, y, hero, rd, gd: gd(Math.hypot(x - o.port[0], y - o.port[1])), ad: o.aiDay + SPAN_G * L.clamp(Math.hypot(x - o.port[0], y - o.port[1]) / (2 * o.r), 0, 1), look: R() * 2 - 1, ph: R() };
  }
  const HERO = mkP(HO, H.x, H.y, true); HERO.gd = HO.gDay;
  // fragment holders (analog fragment dates)
  const byOrgan = o => people.filter(p => p.o === o).reduce((b, p) => Math.hypot(p.x - o.x, p.y - o.y) < Math.hypot(b.x - o.x, b.y - o.y) ? p : b);
  const used = [HO];
  const holder = (x, y) => { const o = nearest(x, y, used); used.push(o); return byOrgan(o); };
  const FRAG = { f2: HERO, f3: holder(290, 330), f4: holder(700, 700), f5: holder(760, 1020), f6: holder(360, 1240), f7: holder(640, 1320) };
  Object.keys(FRAG).forEach(k => FRAG[k].frag = FR[k]);
  const gp = p => p.hero ? [p.x, p.y + 150 / HS] : [p.x + 300 / HS, p.y + 590 / HS]; // where the glint sits in the hand
  const LINKS = [['f2', 'f4', FR.f4], ['f3', 'f4', FR.f4], ['f4', 'f5', FR.f5], ['f5', 'f6', FR.f6], ['f6', 'f7', FR.f7]];

  // ---------- clock ----------
  const DHOOK = HO.redDay + SPAN_R * (1.1 * HO.r - 1.9) / (2.3 * HO.r); // flash-forward: red front 1.9 world units (~340 px) left of the hero
  const dayAt = t => t < 1.4 ? DHOOK : t < 2 ? DHOOK * (1 - L.ease.inOut((t - 1.4) / 0.6)) : Math.min(600, DPS * (t - 2));
  const tOfDay = d => 2 + d / DPS;

  // ---------- state helpers ----------
  const stateP = (p, day, ai) => { const g = ai ? p.ad : p.gd; const red = day >= p.rd ? 1 : 0; const gr = L.sm(g, g + 3, day);
    const dim = red ? 1 - 0.62 * L.sm(p.rd, p.rd + 110, day) : 1; return { red: red * (1 - gr), gr, glow: L.lerp(dim, 1, gr) }; };

  // ---------- drawing: planet-body ----------
  function flesh(ctx, z, a = 1) {
    ctx.save(); ctx.lineCap = 'round'; ctx.globalAlpha = a;
    const pass = (extra, col) => { ctx.strokeStyle = col; CAPS.forEach(c => { ctx.lineWidth = 2 * c.r + extra; ctx.beginPath(); ctx.moveTo(c.a[0], c.a[1]); ctx.lineTo(c.b[0] + 0.01, c.b[1]); ctx.stroke(); }); };
    pass(26, '#0b1117'); pass(6, '#27313a'); pass(0, '#0b1016'); ctx.restore();
  }
  function organ(ctx, o, day, z, ai) {
    const g = ai ? o.aiDay : o.gDay;
    const redF = L.clamp((day - o.redDay) / SPAN_R, 0, 1), grF = L.clamp((day - g) / SPAN_G, 0, 1);
    const dim = redF > 0 ? 1 - 0.72 * L.sm(o.redDay + SPAN_R, o.redDay + 150, day) : 1;
    const glow = L.lerp(dim, 1, grF) * o.lum;
    ctx.save(); ctx.translate(o.x, o.y); ctx.rotate(o.rot);
    ctx.beginPath(); ctx.ellipse(0, 0, o.rx, o.ry, 0, 0, Math.PI * 2);
    const rg = ctx.createRadialGradient(0, -o.ry * 0.2, 0, 0, 0, o.r * 1.05);
    rg.addColorStop(0, rgba([150, 160, 166], 0.30 * glow)); rg.addColorStop(1, rgba([90, 100, 108], 0.10 * glow));
    ctx.fillStyle = rg; ctx.fill();
    ctx.save(); ctx.clip();
    if (redF > 0 && grF < 1) { // red front crossing the organ along dir
      ctx.save(); ctx.rotate(Math.atan2(o.dir[1], o.dir[0]) - o.rot); const s = -o.r * 1.1 + redF * o.r * 2.3;
      const E = Math.min(o.r * 0.35, 36 / z); const lg = ctx.createLinearGradient(s - E, 0, s, 0); const ra = 0.62 * L.lerp(1, 0.3, (1 - dim) / 0.72) * (1 - grF);
      lg.addColorStop(0, rgba(REDC, ra)); lg.addColorStop(1, rgba(REDC, 0)); ctx.fillStyle = rgba(REDC, ra); ctx.fillRect(-o.r * 3, -o.r * 3, s - E + o.r * 3, o.r * 6);
      ctx.fillStyle = lg; ctx.fillRect(s - E, -o.r * 3, E, o.r * 6); ctx.restore();
    }
    if (grF > 0) { ctx.save(); ctx.rotate(-o.rot); const px = o.port[0] - o.x, py = o.port[1] - o.y, rr = grF * o.r * 2.3 + 0.01;
      const gg = ctx.createRadialGradient(px, py, 0, px, py, rr); gg.addColorStop(0, rgba(GRC, 0.42)); gg.addColorStop(0.85, rgba(GRC, 0.3)); gg.addColorStop(1, rgba(GRC, 0));
      ctx.fillStyle = gg; ctx.fillRect(-o.r * 3, -o.r * 3, o.r * 6, o.r * 6); ctx.restore(); }
    ctx.restore();
    ctx.beginPath(); ctx.ellipse(0, 0, o.rx, o.ry, 0, 0, Math.PI * 2);
    ctx.lineWidth = 2.2 / z; ctx.strokeStyle = grF > 0.5 ? rgba(GRC, 0.9) : redF > 0.5 ? rgba(REDC, 0.55 + 0.35 * dim) : rgba(BONE, 0.35 * glow); ctx.stroke();
    ctx.restore();
  }
  function bones(ctx, z, a) {
    if (a <= 0.01) return;
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const st = (w, al) => { ctx.lineWidth = w / z; ctx.strokeStyle = rgba(BONE, al * a); ctx.stroke(); };
    const both = (fn) => { ctx.beginPath(); fn(1); fn(-1); st(9, 0.07); st(2.2, 0.5); };
    // skull
    ctx.beginPath(); ctx.ellipse(540, 290, 112, 128, 0, 0, Math.PI * 2); st(9, 0.07); st(2.4, 0.55);
    ctx.beginPath(); ctx.ellipse(496, 300, 30, 24, 0, 0, Math.PI * 2); ctx.moveTo(614, 300); ctx.ellipse(584, 300, 30, 24, 0, 0, Math.PI * 2); st(2, 0.45);
    ctx.beginPath(); ctx.moveTo(540, 330); ctx.lineTo(528, 356); ctx.lineTo(552, 356); ctx.closePath(); st(2, 0.4);
    ctx.beginPath(); ctx.moveTo(470, 370); ctx.quadraticCurveTo(540, 450, 610, 370); st(2.2, 0.45);
    // spine
    for (let y = 440; y < 1150; y += 27) { ctx.beginPath(); ctx.rect(523, y, 34, 17); st(1.6, 0.35); }
    // clavicles + ribs
    both(s => { ctx.moveTo(540 + s * 12, 540); ctx.quadraticCurveTo(540 + s * 120, 505, 540 + s * 215, 530); });
    for (let i = 0; i < 7; i++) { const y0 = 590 + i * 58, w = 205 - i * 6; both(s => { ctx.moveTo(540 + s * 20, y0); ctx.quadraticCurveTo(540 + s * (w + 20), y0 - 10, 540 + s * (w - 30), y0 + 95); }); }
    // pelvis
    both(s => { ctx.moveTo(540 + s * 25, 1150); ctx.quadraticCurveTo(540 + s * 200, 1060, 540 + s * 170, 1190); ctx.quadraticCurveTo(540 + s * 120, 1240, 540 + s * 40, 1230); });
    // limbs (double bones)
    const limb = (x1, y1, x2, y2, g) => both(s => { const X1 = 540 + s * (x1 - 540), X2 = 540 + s * (x2 - 540); ctx.moveTo(X1 - g, y1); ctx.lineTo(X2 - g, y2); ctx.moveTo(X1 + g, y1); ctx.lineTo(X2 + g, y2); });
    limb(340, 560, 205, 1060, 7); limb(200, 1090, 150, 1420, 9); limb(470, 1230, 432, 1495, 9); limb(430, 1515, 408, 1780, 8);
    both(s => { for (let k = -2; k <= 2; k++) { ctx.moveTo(540 + s * (150 - 540) + k * 8, 1435); ctx.lineTo(540 + s * (150 - 540) + k * 12, 1490); } });
    ctx.restore();
  }

  // ---------- drawing: one x-ray person, figure-local px (origin = mid torso) ----------
  function fig(ctx, zl, o) {
    const { glow = 1, red = 0, gr = 0, mood = 'calm', look = [0, 0], pose = 'down', glint = 0, detail = zl > 0.14 } = o;
    const lw = w => w / zl;
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const col = gr > 0 ? [L.lerp(BONE[0], 170, gr * 0.5), L.lerp(BONE[1], 236, gr * 0.5), L.lerp(BONE[2], 200, gr * 0.5)] : BONE;
    if (red > 0 && detail) { const h = ctx.createRadialGradient(0, -80, 0, 0, -80, 620); h.addColorStop(0, rgba(REDC, 0.22 * red)); h.addColorStop(1, rgba(REDC, 0)); ctx.fillStyle = h; ctx.fillRect(-700, -800, 1400, 1500); }
    const st = (w, a) => { if (detail) { ctx.lineWidth = lw(w * 4); ctx.strokeStyle = rgba(col, a * 0.12 * glow); ctx.stroke(); } ctx.lineWidth = lw(w); ctx.strokeStyle = rgba(col, a * glow); ctx.stroke(); };
    // skull
    ctx.beginPath(); ctx.ellipse(0, -300, 125, 145, 0, 0, Math.PI * 2); ctx.fillStyle = rgba([10, 14, 19], 0.85); ctx.fill(); st(2.6, 0.95);
    if (detail) {
      ctx.beginPath(); ctx.moveTo(-100, -255); ctx.quadraticCurveTo(-95, -150, 0, -140); ctx.quadraticCurveTo(95, -150, 100, -255); st(2.2, 0.8);
      [-1, 1].forEach(s => { ctx.beginPath(); ctx.ellipse(s * 50, -310, 36, 29, s * 0.12, 0, Math.PI * 2); ctx.fillStyle = 'rgba(3,5,8,0.95)'; ctx.fill(); st(2, 0.8); });
      const pr = mood === 'awe' ? 12 : mood === 'sad' ? 7 : 9, pa = mood === 'sad' ? 0.55 : 1;
      [-1, 1].forEach(s => { ctx.beginPath(); ctx.arc(s * 50 + look[0] * 14, -310 + look[1] * 10 + (mood === 'sad' ? 6 : 0), pr, 0, Math.PI * 2); ctx.fillStyle = rgba(col, pa * glow); ctx.fill(); });
      if (mood === 'sad' || mood === 'worry') [-1, 1].forEach(s => { ctx.beginPath(); ctx.moveTo(s * 82, -350 + (mood === 'sad' ? 6 : 0)); ctx.lineTo(s * 24, -355 - (mood === 'worry' ? 10 : -2)); st(2.2, 0.7); });
      ctx.beginPath(); ctx.moveTo(0, -278); ctx.lineTo(-13, -252); ctx.lineTo(13, -252); ctx.closePath(); st(2, 0.7);
      // teeth as the mouth
      const c = mood === 'calm' ? 7 : mood === 'sad' ? -9 : 0, open = mood === 'awe' ? 16 : mood === 'worry' ? 5 : 0;
      [-1, 1].forEach(row => { if (row > 0 && !open) return; ctx.beginPath(); for (let i = 0; i <= 12; i++) { const x = -48 + i * 8, y = -212 + c * (1 - (x / 48) ** 2) + row * open * 0.5 - (open ? 0 : 0); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } st(2, 0.75);
        for (let i = 0; i <= 6; i++) { const x = -42 + i * 14, y = -212 + c * (1 - (x / 48) ** 2) + row * open * 0.5; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - row * 12 * (row < 0 ? -1 : 1) * -1); st(1.4, 0.55); } });
    } else { [-1, 1].forEach(s => { ctx.beginPath(); ctx.arc(s * 48, -305, 26, 0, Math.PI * 2); ctx.fillStyle = rgba(col, 0.55 * glow); ctx.fill(); }); }
    // neck + spine
    if (detail) { for (let y = -150; y < 500; y += 36) { ctx.beginPath(); ctx.rect(-19, y, 38, 22); st(1.6, 0.6); } }
    else { ctx.beginPath(); ctx.moveTo(0, -150); ctx.lineTo(0, 500); st(2.4, 0.8); }
    // clavicles, ribs
    ctx.beginPath(); [-1, 1].forEach(s => { ctx.moveTo(s * 10, -100); ctx.quadraticCurveTo(s * 120, -130, s * 225, -108); }); st(2.2, 0.85);
    const nr = detail ? 6 : 3;
    for (let i = 0; i < nr; i++) { const y0 = -60 + i * (detail ? 56 : 105), w = 225 - i * (detail ? 8 : 16);
      ctx.beginPath(); [-1, 1].forEach(s => { ctx.moveTo(s * 18, y0); ctx.quadraticCurveTo(s * (w + 20), y0 - 20, s * (w - 30), y0 + 90); }); st(2, 0.75); }
    // pelvis
    ctx.beginPath(); [-1, 1].forEach(s => { ctx.moveTo(s * 20, 520); ctx.quadraticCurveTo(s * 220, 420, s * 175, 580); ctx.quadraticCurveTo(s * 120, 640, s * 30, 620); }); st(2.2, 0.8);
    // legs
    ctx.beginPath(); [-1, 1].forEach(s => { ctx.moveTo(s * 100, 610); ctx.lineTo(s * 110, 950); ctx.lineTo(s * 104, 1250); ctx.lineTo(s * 150, 1262); }); st(2.4, 0.8);
    if (detail) { ctx.beginPath(); [-1, 1].forEach(s => { ctx.moveTo(s * 110 + 10, 955); ctx.lineTo(s * 104 + 10, 1240); }); st(1.4, 0.5); }
    // arms
    if (pose === 'cup') {
      [-1, 1].forEach(s => { ctx.beginPath(); ctx.moveTo(s * 225, -100); ctx.lineTo(s * 295, 230); st(2.6, 0.9);
        ctx.beginPath(); ctx.moveTo(s * 292, 238); ctx.lineTo(s * 100, 188); ctx.moveTo(s * 296, 256); ctx.lineTo(s * 104, 206); st(2, 0.8);
        hand(ctx, s, st); });
    } else { ctx.beginPath(); [-1, 1].forEach(s => { ctx.moveTo(s * 225, -100); ctx.lineTo(s * 275, 250); ctx.lineTo(s * 300, 560); }); st(2.4, 0.8); }
    ctx.restore();
    if (glint > 0) drawGlint(ctx, pose === 'cup' ? 0 : 300, pose === 'cup' ? 150 : 590, zl, glint, gr);
  }
  function hand(ctx, s, st) { // x-ray hand bones cupping toward the centre: metacarpals then two phalanges curling up
    const wx = s * 98, wy = 198;
    ctx.beginPath(); ctx.arc(wx, wy, 12, 0, Math.PI * 2); st(1.8, 0.7);
    for (let i = 0; i < 4; i++) { const sp = (i - 1.5);
      const k = [wx - s * 62, wy + 10 + sp * 17], p1 = [k[0] - s * 22, k[1] - 26 - Math.abs(sp) * 2], p2 = [p1[0] - s * 4, p1[1] - 24];
      ctx.beginPath(); ctx.moveTo(wx - s * 10, wy + sp * 6); ctx.lineTo(k[0], k[1]); st(1.6, 0.75);
      ctx.beginPath(); ctx.moveTo(k[0], k[1]); ctx.lineTo(p1[0], p1[1]); ctx.lineTo(p2[0], p2[1]); st(1.6, 0.75);
      [k, p1].forEach(q => { ctx.beginPath(); ctx.arc(q[0], q[1], 4, 0, Math.PI * 2); ctx.fillStyle = rgba(BONE, 0.7); ctx.fill(); }); }
    ctx.beginPath(); ctx.moveTo(wx - s * 6, wy - 12); ctx.lineTo(wx - s * 40, wy - 50); ctx.lineTo(wx - s * 58, wy - 78); st(1.8, 0.75);
  }
  function drawGlint(ctx, x, y, zl, a, gr, base = 40) {
    const minR = 6 / zl, r = Math.max(base * (1 + gr * 0.6), minR);
    const hr = r * (3.2 + gr * 3);
    const g = ctx.createRadialGradient(x, y, 0, x, y, hr); g.addColorStop(0, rgba(GRC, 0.55 * a)); g.addColorStop(1, rgba(GRC, 0));
    ctx.fillStyle = g; ctx.fillRect(x - hr, y - hr, hr * 2, hr * 2);
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = rgba(GRC, a); ctx.fill();
    ctx.beginPath(); ctx.arc(x - r * 0.3, y - r * 0.3, r * 0.3, 0, Math.PI * 2); ctx.fillStyle = rgba([235, 255, 240], 0.8 * a); ctx.fill();
  }

  // ---------- world ----------
  function world(ctx, day, z, cx, cy, heroMood, extraGlow = 0) {
    const vw = 540 / z, vh = 960 / z, inV = (x, y, m) => x > cx - vw - m && x < cx + vw + m && y > cy - vh - m && y < cy + vh + m;
    const lz = Math.log(z);
    flesh(ctx, z);
    organs.forEach(o => { if (inV(o.x, o.y, o.r)) organ(ctx, o, day, z, false); });
    bones(ctx, z, 1 - L.sm(Math.log(3), Math.log(9), lz));
    // routes: the answer reaching each organ (communication lines), flash then fade
    ctx.save(); ctx.lineCap = 'round';
    organs.forEach(o => { const a = L.sm(o.gDay - 2, o.gDay, day) * (1 - L.sm(o.gDay + 4, o.gDay + 40, day)); if (a <= 0 || o === FRAG.f7.o) return;
      ctx.beginPath(); ctx.moveTo(gp(FRAG.f7)[0], gp(FRAG.f7)[1]); ctx.lineTo(o.port[0], o.port[1]); ctx.lineWidth = 2 / z; ctx.strokeStyle = rgba(GRC, 0.7 * a); ctx.stroke(); });
    LINKS.forEach(([a, b, d]) => { const k = L.sm(d, d + 3, day); if (k <= 0) return; const A1 = gp(FRAG[a]), B1 = gp(FRAG[b]);
      ctx.beginPath(); ctx.moveTo(A1[0], A1[1]); ctx.lineTo(L.lerp(A1[0], B1[0], k), L.lerp(A1[1], B1[1], k)); ctx.lineWidth = 2.4 / z; ctx.strokeStyle = rgba(GRC, 0.75); ctx.stroke(); });
    ctx.restore();
    // crowd
    const ca = L.sm(Math.log(3.5), Math.log(7), lz);
    const zl = z / HS;
    if (ca > 0.01) {
      ctx.save(); ctx.globalAlpha = ca;
      people.forEach(p => { if (!inV(p.x, p.y, 8)) return; const s = stateP(p, day, false);
        ctx.save(); ctx.translate(p.x, p.y); ctx.scale(1 / HS, 1 / HS);
        fig(ctx, zl, { glow: s.glow * 0.8, red: s.red, gr: s.gr, mood: s.gr > 0.5 ? 'awe' : s.red ? 'sad' : 'calm', look: [p.look, 0], glint: p.frag !== undefined && day >= p.frag ? 1 : 0 });
        ctx.restore(); });
      ctx.restore();
    }
    // fragment glints at body scale (screen-constant size)
    Object.keys(FRAG).forEach(k => { const p = FRAG[k]; if (day < p.frag) return; const a = L.sm(p.frag, p.frag + 2, day) * (1 - ca * 0.9);
      if (a > 0.01) { const g = gp(p); ctx.save(); ctx.translate(g[0], g[1]); drawGlint(ctx, 0, 0, z, a, 0, 0); ctx.restore(); } });
    // hero (always the same person, drawn over the crowd)
    const hs = stateP(HERO, day, false);
    ctx.save(); ctx.globalAlpha = Math.max(ca, 0); ctx.translate(H.x, H.y); ctx.scale(1 / HS, 1 / HS);
    if (ca > 0.01) fig(ctx, zl, { glow: Math.min(1, hs.glow + extraGlow), red: hs.red, gr: hs.gr, mood: heroMood(day, hs), look: day < HERO.rd && day > 30 ? [-1, 0] : [0, 0.3], pose: 'cup', glint: 1 });
    ctx.restore();
  }
  const heroMood = (day, s) => s.gr > 0.3 ? 'awe' : s.red ? 'sad' : day > 40 ? 'worry' : 'calm';

  // ---------- camera (log-zoom, focus slides from the hero to the body centre as we rise) ----------
  const ZK = [[0, 175], [1.4, 186], [2.0, 186], [3.4, 192], [7.7, 1.0], [13.5, 1.06], [15.9, 235], [17.6, 245], [21.6, 1.0], [33.2, 1.0], [35.0, 330], [36.6, 345]];
  const FK = [[0, -80], [15.9, -80], [16, -100], [33.2, -100], [35.0, -240]]; // hero focus, local y
  const zoomAt = t => Math.exp(L.key(ZK.map(([a, b]) => [a, Math.log(b)]), t));
  const cam = t => { const z = zoomAt(t), fy = L.key(FK, t), hx = H.x, hy = H.y + fy / HS; const w = 1 - L.sm(0, Math.log(14), Math.log(z));
    return { z, x: L.lerp(hx, 540, w), y: L.lerp(hy, 960, w) }; };

  // ---------- snap panels ----------
  function panel(ctx, y0, day, ai, label, num, sub, active) {
    const X = 80, W = 920, Hh = 560;
    ctx.save(); ctx.fillStyle = '#0a0f15'; ctx.fillRect(X, y0, W, Hh); ctx.strokeStyle = rgba(BONE, 0.35); ctx.lineWidth = 2; ctx.strokeRect(X, y0, W, Hh);
    ctx.save(); ctx.beginPath(); ctx.rect(X, y0, W, Hh); ctx.clip();
    const s = 0.3; ctx.translate(X + 40 - 60 * s + 30, y0 + 20 - 150 * s + 20); ctx.scale(s, s); ctx.globalAlpha = active ? 1 : 0.55;
    flesh(ctx, s); organs.forEach(o => organ(ctx, o, day, s, ai)); bones(ctx, s, 0.6);
    ctx.lineCap = 'round';
    organs.forEach(o => { const g = ai ? o.aiDay : o.gDay; const a = L.sm(g - 2, g, day) * (1 - L.sm(g + 4, g + 40, day)); if (a <= 0) return;
      ctx.beginPath(); ctx.moveTo(FRAG.f7.x, FRAG.f7.y); ctx.lineTo(o.port[0], o.port[1]); ctx.lineWidth = 2.5 / s; ctx.strokeStyle = rgba(GRC, 0.6 * a); ctx.stroke(); });
    ctx.restore();
    const tx = 440;
    L.label(ctx, label, tx, y0 + 90, 46, { align: 'left', col: '#e8e4da' });
    if (sub) L.label(ctx, sub, tx, y0 + 146, 44, { align: 'left', col: '#b8bec4' });
    const med = ai ? AIMED : MED, na = L.sm(med, med + 12, day);
    L.label(ctx, 'median organ', tx, y0 + 300, 44, { align: 'left', col: '#9aa0aa', alpha: 0.5 + 0.5 * na });
    ctx.save(); ctx.globalAlpha = na; ctx.font = `180px "${SERIF}"`; ctx.fillStyle = GREEN; ctx.textAlign = 'left'; ctx.fillText(num, tx, y0 + 470); ctx.restore();
    // count of organs reached (bar, no number)
    const frac = organs.filter(o => (ai ? o.aiDay : o.gDay) <= day).length / N;
    ctx.fillStyle = '#1d252d'; ctx.fillRect(tx, y0 + 505, 420, 14); ctx.fillStyle = GREEN; ctx.fillRect(tx, y0 + 505, 420 * frac, 14);
    ctx.restore();
  }

  // ---------- text ----------
  const card = (ctx, t, a, b, lines, y = 300, size = 104, col) => { const al = L.sm(a, a + 0.35, t) * (1 - L.sm(b - 0.35, b, t)); if (al > 0) L.title(ctx, lines, y, size, { alpha: al, col }); };

  function draw(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    if (t < 25.4 || (t >= 33.2 && t < 36.6)) {
      const c = cam(t); const day = t >= 33.2 ? 600 : dayAt(t);
      const extra = t >= 33.2 ? L.sm(34.6, 36, t) * 0.3 : 0;
      ctx.save(); ctx.translate(540, 960); ctx.scale(c.z, c.z); ctx.translate(-c.x, -c.y);
      world(ctx, day, c.z, c.x, c.y, heroMood, extra);
      ctx.restore();
      // freeze/dead stop: dim the frame while the lines play
      if (t >= 21.8 && t < 25.4) { ctx.fillStyle = `rgba(5,8,12,${0.55 * L.sm(22.6, 23.2, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
      if (t < 25.4 && t > 25.1) { ctx.fillStyle = `rgba(5,8,12,${L.sm(25.1, 25.4, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
      if (t >= 33.2) { ctx.fillStyle = `rgba(5,8,12,${1 - L.sm(33.2, 33.6, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
    } else if (t < 33.2) {
      const dTop = t < 25.8 ? 0 : Math.min(600, 200 * (t - 25.8)), dBot = t < 29.0 ? 0 : Math.min(600, 200 * (t - 29.0));
      const fin = L.sm(25.4, 25.8, t) * (1 - L.sm(32.9, 33.2, t));
      ctx.save(); ctx.globalAlpha = fin;
      panel(ctx, 250, dTop, false, 'as it happened', String(MED), null, true);
      panel(ctx, 900, dBot, true, 'with AI routing', String(AIMED), 'illustrative · same supply', t >= 29.0);
      ctx.restore();
      if (t >= 29.0 && t < 29.25) { ctx.fillStyle = `rgba(255,255,255,${0.18 * (1 - (t - 29) / 0.25)})`; ctx.fillRect(0, 0, 1080, 1920); }
    }
    // cards
    card(ctx, t, -1, 1.7, ['One body.'], 330, 124);
    card(ctx, t, 2.0, 3.6, ['Eight billion heads.'], 330, 96);
    card(ctx, t, 5.2, 7.2, ['Each organ,', 'a few countries.'], 280, 100);
    card(ctx, t, 8.3, 10.3, ['The answer', 'was already here.'], 280, 100);
    card(ctx, t, 10.7, 12.9, ['In pieces.', { text: 'In a few hands.', col: '#b8bec4' }], 300, 96);
    card(ctx, t, 16.1, 17.7, ['On its own late day.'], 330, 96);
    card(ctx, t, 19.0, 21.6, ['Some waited', 'months more.'], 280, 100);
    card(ctx, t, 22.8, 24.1, ['We slowed it down'], 820, 104);
    card(ctx, t, 24.1, 25.4, ['so you could see it.'], 820, 104);
    card(ctx, t, 34.8, 36.6, ['This is the bottleneck.'], 330, 88);
    if (t >= 36.6) L.endCard(ctx, L.sm(36.6, 37.1, t));
    // slates
    const sl = t < 3.4 ? 'SC1  CLOSE  EYE LEVEL' : t < 7.7 ? 'SC2  CRANE UP' : t < 13.5 ? 'SC3  WIDE  HOLD' : t < 17.6 ? 'SC4  DROP DOWN  CLOSER' : t < 21.8 ? 'SC5  CRANE UP' : t < 25.4 ? 'SC6  FREEZE' : t < 33.2 ? 'SC7  SNAP  SPLIT' : t < 36.6 ? 'SC8  DROP DOWN  CLOSEST' : 'END';
    if (t < 36.6) L.slate(ctx, sl);
    L.grain(ctx, t, { alpha: 0.05 });
  }

  return { draw, DUR,
    acts: [{ start: 0, end: 7.7, bpm: 0, drone: true }, { start: 7.7, end: 13.5, bpm: 46, drone: true }, { start: 13.5, end: 21.8, bpm: 0, drone: true }, { start: 22.8, end: 36.6, bpm: 0, drone: true }, { start: 36.6, end: DUR, bpm: 0, drone: true }],
    cues: [{ t: 1.4, type: 'whoosh' }, { t: 3.4, type: 'whoosh' }, { t: tOfDay(FR.f7), type: 'ding' }, { t: 13.6, type: 'whoosh' }, { t: tOfDay(MED), type: 'ding' }, { t: 17.6, type: 'whoosh' }, { t: 29.0, type: 'hit' }, { t: 33.2, type: 'whoosh' }] };
}
module.exports = makeScene;
