// the-storm-doc: nature-documentary, particle/data, cosmos. Analog: quebec-1989. The red itself is the protagonist.
// One stated mapping (log time): E = 10^((t - 14) / 1.6) s for 14 <= t <= 27.6. Before t = 14: pre-event, no clock.
// Red = logistic fit through sourced endpoints (1% at t0, 99% at 90 s; doubling 6.78 s). Restore = 83% at 9 h (s3).
// Green = 5 fragments; ring links at L.lognormalQuantile(q, 759 h [modelled, never shown], 64000 h).
// AI snap = ai_counterfactual (~1 h routing of an existing warning), labeled illustrative. See output/the-storm-doc/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('quebec-1989');
  const DUR = 44, RED = L.RED, GREEN = L.GREEN, BG = '#0b0e13', PALE = '#d9d3c3';
  const rgbaG = a => `rgba(52,210,123,${a})`, rgbaR = a => `rgba(255,59,48,${a})`, rgbaW = a => `rgba(232,228,218,${a})`;
  const GC = 'rgba(52,210,123,A)', RC = 'rgba(255,59,48,A)', WC = 'rgba(236,230,212,A)';

  // ---------------- clock ----------------
  const TA = 14, SPD = 1.6, TSTOP = 27.6, SNAP0 = 30.8, SNAP1 = 37, POST = 37;
  const E = t => (t < TA || t >= POST) ? 0 : Math.pow(10, (Math.min(t, TSTOP) - TA) / SPD);
  const tOfE = e => TA + SPD * Math.log10(Math.max(1, e));
  const COL_S = A.threat.points[1].t * 3600;                 // 90 s (sourced)
  const S0 = 0.01, RR = Math.log(0.99 * (1 - S0) / (S0 * 0.01)) / COL_S, DBL = Math.LN2 / RR; // 6.78 s
  const share = e => e <= 0 ? 0 : L.logistic(e, DBL, S0);
  const eOfShare = y => y <= S0 ? 0 : Math.log(y * (1 - S0) / (S0 * (1 - y))) / RR;
  const RST_S = A.threat.events.find(ev => ev.t === 9).t * 3600; // 9 h (sourced, 83%)
  const restored = e => e <= COL_S ? 0 : e <= RST_S ? 0.83 * (e - COL_S) / (RST_S - COL_S) : 0.83 + 0.17 * L.clamp((e - RST_S) / (86400 - RST_S), 0, 1); // tail: assumption
  const dark = (fr, rr, e) => fr < share(e) && !(rr < restored(e));
  const tFall = fr => { const e = eOfShare(fr); return e <= 1 ? TA : tOfE(e); };

  // ---------------- camera: lev = log10(frame width in metres) ----------------
  const levA = [[0, 0.48], [3.0, 0.40], [10.0, 11.35], [10.9, 11.4], [13.8, 6.25], [17.4, 6.30], [19.6, 0.15], [22.4, 0.15], [24.8, 6.30], [27.8, 6.45], [30.8, 6.45]];
  const levB = [[37, 6.30], [39, -0.10], [40.4, -0.15]];
  const levAt = t => t < POST ? L.key(levA, t) : L.key(levB, t);
  // where the origin (the fridge's kitchen) sits on screen, as a function of lev
  const offKeys = [[-0.15, [723, 1905]], [0.15, [617, 1343]], [0.40, [561, 1154]], [0.5, [561, 1121]], [1.6, [540, 1028]], [3.0, [540, 1100]], [5.5, [540, 1175]], [6.45, [540, 1175]], [7.4, [594, 760]], [9.5, [594, 760]], [11.2, [757, 1250]]];
  function camAt(lev) { const S = 1080 / Math.pow(10, lev); const [ox, oy] = L.key(offKeys, lev, f => f); return { S, lev, cx: (540 - ox) / S, cy: (960 - oy) / S }; }
  const toS = (c, x, y) => [540 + (x - c.cx) * c.S, 960 + (y - c.cy) * c.S];

  // ---------------- helpers ----------------
  function glow(ctx, x, y, rad, col, a = 1) { if (a <= 0.003 || rad <= 0) return; ctx.save(); ctx.globalAlpha *= a;
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, col.replace('A', '0.55')); g.addColorStop(1, col.replace('A', '0'));
    ctx.fillStyle = g; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2); ctx.restore(); }
  // batch of square dots [[x,y,r],...] in current transform
  function dots(ctx, pts, col, a = 1) { if (a <= 0.003) return; ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = col; ctx.beginPath(); for (const p of pts) ctx.rect(p[0] - p[2], p[1] - p[2], p[2] * 2, p[2] * 2); ctx.fill(); ctx.restore(); }
  const fade = (t, a, b, f = 0.3) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));
  // documentary lower third: left aligned serif, short rule above
  function lower(ctx, lines, a, { y = 1230, size = 76, big = false } = {}) {
    if (a <= 0.003) return; ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'left';
    const n = lines.length; let fz0 = big ? 104 : size; const top = y - (n - 1) * fz0 * 1.08;
    ctx.fillStyle = rgbaW(0.75); ctx.fillRect(92, top - fz0 - 22, 90 * L.ease.out(L.clamp(a * 1.4, 0, 1)), 4);
    lines.forEach((l, i) => { const o = typeof l === 'string' ? { text: l } : l; let fz = fz0; ctx.font = `${fz}px "${SERIF}"`;
      while (ctx.measureText(o.text).width > 800 && fz > 30) { fz -= 4; ctx.font = `${fz}px "${SERIF}"`; }
      const yy = top + i * fz0 * 1.08; ctx.lineJoin = 'round'; ctx.lineWidth = fz * 0.18; ctx.strokeStyle = BG; ctx.strokeText(o.text, 92, yy);
      if (o.parts) { let x = 92; o.parts.forEach(([s, c]) => { ctx.fillStyle = c; ctx.fillText(s, x, yy); x += ctx.measureText(s).width; }); }
      else { ctx.fillStyle = o.col || '#fffdf7'; ctx.fillText(o.text, 92, yy); } });
    ctx.restore(); }
  function centerCard(ctx, lines, y, size, a) { if (a <= 0.003) return; L.title(ctx, lines.map(s => ({ text: s })), y, size, { alpha: a }); }

  // ---------------- KITCHEN (world metres; floor y = 0.8; fridge x 0.25..1.0) ----------------
  const kr = L.rng(11);
  const Kpts = { dust: [], floor: [], counter: [], window: [], glass: [], fridge: [], fbody: [], wire: [], lamp: [] };
  const line = (arr, x1, y1, x2, y2, sp, r, j = 0.004) => { const n = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) / sp)); for (let i = 0; i <= n; i++) { const f = i / n; arr.push([L.lerp(x1, x2, f) + (kr() - 0.5) * j, L.lerp(y1, y2, f) + (kr() - 0.5) * j, r * (0.7 + kr() * 0.6)]); } };
  const rectO = (arr, x0, y0, x1, y1, sp, r) => { line(arr, x0, y0, x1, y0, sp, r); line(arr, x1, y0, x1, y1, sp, r); line(arr, x1, y1, x0, y1, sp, r); line(arr, x0, y1, x0, y0, sp, r); };
  const fill = (arr, x0, y0, x1, y1, n, r) => { for (let i = 0; i < n; i++) arr.push([L.lerp(x0, x1, kr()), L.lerp(y0, y1, kr()), r * (0.5 + kr())]); };
  fill(Kpts.dust, -1.8, -2.0, 1.7, 0.8, 520, 0.006);
  line(Kpts.floor, -2.4, 0.8, 2.4, 0.8, 0.018, 0.009); for (let k = 1; k < 6; k++) line(Kpts.floor, -2.4, 0.8 + k * 0.12, 2.4, 0.8 + k * 0.12, 0.05 + k * 0.012, 0.006);
  rectO(Kpts.counter, -1.8, 0.0, -0.95, 0.8, 0.022, 0.008); line(Kpts.counter, -1.8, 0.04, -0.95, 0.04, 0.03, 0.006); rectO(Kpts.counter, -1.7, 0.16, -1.4, 0.72, 0.035, 0.006); rectO(Kpts.counter, -1.35, 0.16, -1.05, 0.72, 0.035, 0.006);
  rectO(Kpts.window, -1.45, -1.35, -0.8, -0.45, 0.016, 0.009); line(Kpts.window, -1.125, -1.35, -1.125, -0.45, 0.02, 0.007); line(Kpts.window, -1.5, -0.43, -0.75, -0.43, 0.016, 0.01);
  fill(Kpts.glass, -1.44, -1.34, -0.81, -0.46, 160, 0.004);
  rectO(Kpts.fridge, 0.25, -1.05, 1.0, 0.8, 0.014, 0.009); line(Kpts.fridge, 0.25, -0.45, 1.0, -0.45, 0.016, 0.008); line(Kpts.fridge, 0.33, -0.95, 0.33, -0.6, 0.012, 0.011); line(Kpts.fridge, 0.33, -0.3, 0.33, 0.2, 0.012, 0.011);
  fill(Kpts.fbody, 0.27, -1.03, 0.98, 0.78, 380, 0.005);
  line(Kpts.wire, 1.25, 0.35, 1.25, -1.95, 0.03, 0.008); line(Kpts.wire, 1.25, 0.35, 1.0, 0.55, 0.03, 0.008); rectO(Kpts.wire, 1.2, 0.3, 1.3, 0.42, 0.02, 0.006);
  line(Kpts.lamp, -0.25, -1.95, -0.25, -1.55, 0.03, 0.006); line(Kpts.lamp, -0.42, -1.45, -0.08, -1.45, 0.02, 0.007); line(Kpts.lamp, -0.42, -1.45, -0.25, -1.56, 0.02, 0.007); line(Kpts.lamp, -0.08, -1.45, -0.25, -1.56, 0.02, 0.007);
  const kRed = []; for (let i = 0; i < 260; i++) kRed.push({ x: -1.44 + kr() * 0.63, y: -1.34 + kr() * 0.88, ph: kr() * 6.28, sp: 0.4 + kr() * 0.8, r: 0.006 + kr() * 0.012 });
  const kRedOut = []; for (let i = 0; i < 160; i++) kRedOut.push({ x: -2.6 + kr() * 1.0, y: -2.2 + kr() * 2.0, ph: kr() * 6.28, sp: 0.3 + kr() * 0.6, r: 0.01 + kr() * 0.016 });
  const PERSON = { x: -0.35, hip: 0.8 - 52 * 0.0106, s: 0.0106 };
  const PHONE = { x: 0.06, y: -0.62 };

  // ---------------- PROVINCE (world metres; origin = the kitchen, in the south) ----------------
  const PC = { x: 0, y: -650e3 }, PRX = 520e3, PRY = 820e3;
  const rF = a => 1 + 0.12 * Math.sin(3 * a + 1) + 0.07 * Math.sin(5 * a + 2) + 0.04 * Math.sin(8 * a);
  const inside = (x, y) => { const dx = (x - PC.x) / PRX, dy = (y - PC.y) / PRY; return Math.hypot(dx, dy) < rF(Math.atan2(dy, dx)); };
  const bpt = (a, k = 1) => ({ x: PC.x + Math.cos(a) * PRX * rF(a) * k, y: PC.y + Math.sin(a) * PRY * rF(a) * k });
  const ORN = { x: PC.x + 40e3, y: PC.y - 700e3 };
  const pr = L.rng(1989);
  const plights = [];
  while (plights.length < 1500) { const x = PC.x + (pr() * 2 - 1) * PRX * 1.2, y = PC.y + (pr() * 2 - 1) * PRY * 1.15; if (!inside(x, y)) continue;
    const south = (y - (PC.y - PRY)) / (2 * PRY); if (pr() > 0.12 + 0.88 * south * south) continue; plights.push({ x, y, s: 1.4 + pr() * 1.8, rr: pr() }); }
  // transmission corridors: north stations -> southern load (origin)
  const corridors = [[ORN, { x: -160e3, y: -380e3 }, { x: -30e3, y: -40e3 }], [{ x: ORN.x + 220e3, y: ORN.y + 60e3 }, { x: 150e3, y: -420e3 }, { x: 20e3, y: -30e3 }], [{ x: ORN.x - 260e3, y: ORN.y + 120e3 }, { x: -300e3, y: -500e3 }, { x: -90e3, y: -80e3 }]];
  corridors.forEach(cc => { for (let k = 0; k < cc.length - 1; k++) { const a = cc[k], b = cc[k + 1]; const n = 60; for (let i = 0; i < n; i++) { const f = i / n; plights.push({ x: L.lerp(a.x, b.x, f) + (pr() - 0.5) * 6e3, y: L.lerp(a.y, b.y, f) + (pr() - 0.5) * 6e3, s: 1.3, rr: pr(), wire: true }); } } });
  plights.forEach(p => p.d = Math.hypot(p.x - ORN.x, p.y - ORN.y));
  const dOrigin = Math.hypot(ORN.x, ORN.y);
  const sorted = plights.slice().sort((a, b) => a.d - b.d); sorted.forEach((p, i) => { p.fr = 0.985 * i / sorted.length; p.tf = tFall(p.fr); });
  const FR0 = 0.985 * sorted.filter(p => p.d < dOrigin).length / sorted.length, RR0 = 0.80; // kitchen ranks
  const kitchenDark = e => dark(FR0, RR0, e);
  const T_QUIET = tFall(FR0), T_HUM = tOfE(COL_S + RR0 / 0.83 * (RST_S - COL_S));
  // pre-event red band north of the province
  const pRed = []; for (let i = 0; i < 420; i++) { const a = -Math.PI / 2 + (pr() - 0.5) * 1.9; const k = 1.08 + pr() * 0.35; const p = bpt(a, k); pRed.push({ x: p.x, y: p.y - pr() * 120e3, ph: pr() * 6.28, s: 1.5 + pr() * 2.2 }); }
  // green fragments: ring
  const FR = A.solution.fragments, MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;
  const ring = [{ id: 'f3', lbl: 'engineers', a: 1.05 }, { id: 'f4', lbl: 'line crews', a: 2.15 }, { id: 'f2', lbl: 'scientists', a: -2.75 }, { id: 'f1', lbl: 'forecasters', a: -1.55 }, { id: 'f5', lbl: 'planners', a: -0.25 }];
  ring.forEach(n => Object.assign(n, bpt(n.a, 0.78)));
  const links = ring.map((n, i) => { const hrs = L.lognormalQuantile((i + 0.5) / ring.length, MED, P90); let a1 = ring[(i + 1) % ring.length].a; while (a1 < n.a) a1 += Math.PI * 2; return { a0: n.a, a1, hrs, t: tOfE(hrs * 3600) }; });
  const RING_T = links[links.length - 1].t;

  // ---------------- HOUSE / TOWN ----------------
  const hr_ = L.rng(5);
  const H = { out: [], roof: [], ground: [], win: [], pole: [], tree: [] };
  const hline = (arr, x1, y1, x2, y2, sp, r) => { const n = Math.max(2, Math.round(Math.hypot(x2 - x1, y2 - y1) / sp)); for (let i = 0; i <= n; i++) { const f = i / n; arr.push([L.lerp(x1, x2, f) + (hr_() - 0.5) * 0.05, L.lerp(y1, y2, f) + (hr_() - 0.5) * 0.05, r * (0.7 + hr_() * 0.6)]); } };
  hline(H.out, -7, 0.8, -7, -6.5, 0.12, 0.07); hline(H.out, 7, 0.8, 7, -6.5, 0.12, 0.07); hline(H.out, -7, -6.5, 7, -6.5, 0.12, 0.07); hline(H.out, -7, -2.3, 7, -2.3, 0.18, 0.05);
  hline(H.out, -1.8, -2.3, -1.8, 0.8, 0.18, 0.04); hline(H.out, 1.7, -2.3, 1.7, 0.8, 0.18, 0.04);
  hline(H.roof, -8, -6.5, 0, -12, 0.12, 0.07); hline(H.roof, 8, -6.5, 0, -12, 0.12, 0.07);
  hline(H.ground, -60, 0.85, 60, 0.85, 0.2, 0.07); for (let i = 0; i < 400; i++) H.ground.push([(hr_() * 2 - 1) * 60, 0.9 + hr_() * 3, 0.04]);
  [[-4.5, -4.8], [4.5, -4.8], [-4.8, -0.9], [4.6, -0.9]].forEach(([x, y]) => { const w = []; hline(w, x - 1, y - 0.8, x + 1, y - 0.8, 0.14, 0.04); hline(w, x - 1, y + 0.8, x + 1, y + 0.8, 0.14, 0.04); hline(w, x - 1, y - 0.8, x - 1, y + 0.8, 0.14, 0.04); hline(w, x + 1, y - 0.8, x + 1, y + 0.8, 0.14, 0.04); H.win.push(...w); });
  hline(H.pole, 16, 0.8, 16, -10, 0.12, 0.07); hline(H.pole, 14.8, -9.2, 17.2, -9.2, 0.12, 0.06);
  for (let i = 0; i <= 40; i++) { const f = i / 40; H.pole.push([L.lerp(16, 7, f), L.lerp(-9.2, -6.2, f) + Math.sin(f * Math.PI) * 0.8, 0.05]); }
  for (let i = 0; i <= 60; i++) { const f = i / 60; H.pole.push([L.lerp(16, 60, f), -9.2 + Math.sin(f * Math.PI) * 1.2, 0.05]); }
  for (let i = 0; i < 260; i++) { const a = hr_() * 6.28, rr = Math.sqrt(hr_()); H.tree.push([-22 + Math.cos(a) * 4 * rr, -7 + Math.sin(a) * 5 * rr, 0.06]); } hline(H.tree, -22, 0.8, -22, -3, 0.15, 0.08);
  const hRed = []; for (let i = 0; i < 300; i++) hRed.push({ x: -45 + hr_() * 35, y: -26 + hr_() * 12, ph: hr_() * 6.28, r: 0.08 + hr_() * 0.12 });
  const snow = []; for (let i = 0; i < 160; i++) snow.push({ x: (hr_() * 2 - 1) * 30, y: -30 + hr_() * 32, v: 0.6 + hr_() * 0.8, ph: hr_() * 6.28 });
  const town = [];
  for (let i = 0; i < 1100; i++) { const street = Math.round((hr_() * 2 - 1) * 22), vertical = hr_() < 0.5; const along = (hr_() * 2 - 1) * 2800, side = (hr_() < 0.5 ? -1 : 1) * 22;
    const x = vertical ? street * 130 + side : along, y = vertical ? along * 0.9 - 1000 : street * 110 - 1000 + side;
    if (Math.hypot(x, y + 1000) > 2900) continue; town.push({ x, y, fr: L.clamp(FR0 + (hr_() - 0.5) * 0.03, 0, 0.984), rr: hr_(), s: 1.3 + hr_() * 1.4 }); }
  const tRed = []; for (let i = 0; i < 300; i++) tRed.push({ x: (hr_() * 2 - 1) * 3500, y: -4400 + hr_() * 900, ph: hr_() * 6.28, s: 1.5 + hr_() * 2 });

  // ---------------- PLANET / FAR ----------------
  const R = 6.371e6, EC = { x: -0.25 * R, y: 0.968 * R };   // origin sits on the limb, north-up
  const SD = { x: -0.6, y: -0.8 };                           // direction to the gray disc
  const SUN = { x: EC.x + SD.x * 1.5e11, y: EC.y + SD.y * 1.5e11 };
  const gr = L.rng(77);
  const planet = []; for (let i = 0; i < 1700; i++) { const a = gr() * 6.28, rr = Math.sqrt(gr()); const nx = Math.cos(a) * rr, ny = Math.sin(a) * rr; const lit = L.clamp(nx * SD.x + ny * SD.y + 0.35 * Math.sqrt(1 - rr * rr), 0, 1); planet.push({ x: EC.x + nx * R, y: EC.y + ny * R, b: 0.18 + 0.55 * lit }); }
  const field = []; [1.6, 2.2, 3.1, 4.4].forEach(Lv => { for (let i = 0; i <= 90; i++) { const lam = -1.3 + 2.6 * i / 90; const r = Lv * R * Math.cos(lam) ** 2; if (r < R * 1.02) continue; [-1, 1].forEach(sd => field.push({ x: EC.x + sd * r * Math.cos(lam) * (sd < 0 ? 0.72 : 1.15), y: EC.y - r * Math.sin(lam) })); } });
  const planetLights = []; for (let i = 0; i < 40; i++) planetLights.push({ x: (gr() - 0.5) * 7e5, y: -gr() * 1.2e6 + 1e5, fr: gr() * 0.98, rr: gr() });
  const flow = []; for (let i = 0; i < 420; i++) flow.push({ o: (gr() * 2 - 1) * 4.2 * R, ph: gr(), s: 1.4 + gr() * 2 });
  const sunDots = []; for (let i = 0; i < 900; i++) { const a = gr() * 6.28, rr = Math.sqrt(gr()); sunDots.push({ x: Math.cos(a) * rr, y: Math.sin(a) * rr, b: 0.35 + 0.5 * Math.sqrt(1 - rr * rr) }); }
  const cme = []; for (let i = 0; i < 560; i++) cme.push({ a: (gr() - 0.5) * 0.55, k: Math.pow(gr(), 0.5), ph: gr() * 6.28, s: 1.4 + gr() * 2.2 });
  const stars = []; const st = L.rng(33); for (let i = 0; i < 260; i++) stars.push({ x: st() * 1080, y: st() * 1920, s: 0.8 + st() * 1.8, p: st() * 6 });
  const cmeP = t => L.lerp(0.35, 0.97, L.sm(3, 13.8, t));  // staged position, no clock before t0

  // ---------------- layers ----------------
  function drawKitchen(ctx, t, c, a, e) {
    if (a <= 0.003) return;
    const on = !kitchenDark(e), pre = t < TA || t >= POST;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(540, 960); ctx.scale(c.S, c.S); ctx.translate(-c.cx, -c.cy);
    const lightK = on ? 1 : 0.45;
    // fridge glow
    if (on) { glow(ctx, 0.62, -0.2, 1.6, WC, 0.35); }
    dots(ctx, Kpts.dust, '#8a8f98', 0.35 * lightK);
    dots(ctx, Kpts.floor, '#80868f', 0.75 * lightK);
    dots(ctx, Kpts.counter, '#9aa0aa', 0.8 * lightK);
    dots(ctx, Kpts.lamp, '#9aa0aa', 0.7 * lightK);
    dots(ctx, Kpts.glass, '#5a616c', 0.8);
    // the red outside the window (pre-event it waits; it returns faintly in the present)
    const ra = pre ? (t >= POST ? 0.55 : 1) : 0.25;
    ctx.save(); ctx.beginPath(); ctx.rect(-1.44, -1.34, 0.63, 0.88); ctx.clip();
    glow(ctx, -1.12, -0.9, 0.75, RC, 0.9 * ra);
    ctx.fillStyle = RED; ctx.globalAlpha = a * ra; ctx.beginPath();
    kRed.forEach(p => { const x = p.x + Math.sin(t * p.sp + p.ph) * 0.05 + (L.noise(t * 0.6 + p.ph, 3) - 0.5) * 0.08, y = p.y + Math.cos(t * p.sp * 0.8 + p.ph) * 0.04; ctx.rect(x - p.r, y - p.r, p.r * 2, p.r * 2); });
    ctx.fill(); ctx.restore();
    // red light spill on the floor / wall near the window
    glow(ctx, -1.1, -0.2, 1.0, RC, 0.35 * ra);
    // swarm outside the room's left edge (visible as the camera pulls)
    ctx.save(); ctx.globalAlpha = a * ra; ctx.fillStyle = RED; ctx.beginPath(); kRedOut.forEach(p => { const x = p.x + Math.sin(t * p.sp + p.ph) * 0.1, y = p.y + Math.cos(t * p.sp + p.ph) * 0.08; ctx.rect(x - p.r, y - p.r, p.r * 2, p.r * 2); }); ctx.fill(); ctx.restore();
    dots(ctx, Kpts.window, '#b3b8c0', 0.9);
    // wire: gray; dim red while dark (the red passed through here)
    dots(ctx, Kpts.wire, on ? '#7c828c' : RED, on ? 0.6 : 0.45);
    // fridge
    dots(ctx, Kpts.fbody, '#6b717b', 0.5 * lightK);
    dots(ctx, Kpts.fridge, on ? '#d8d3c6' : '#6b717b', 0.95);
    if (on) { glow(ctx, 0.9, -0.95, 0.12, WC, 1); ctx.fillStyle = '#fffdf7'; ctx.fillRect(0.885, -0.965, 0.03, 0.03); }
    // hum: rings of dots emitted every 0.55 s while powered at emission time
    const PER = 0.55, LIFE = 2.2;
    for (let k = 0; k < 5; k++) { const te = Math.floor(t / PER) * PER - k * PER; const age = t - te; if (age < 0 || age > LIFE) continue;
      const powered = te >= POST ? true : !kitchenDark(E(te)); if (!powered) continue;
      const rad = 0.12 + age * 0.34, al = (1 - age / LIFE) * 0.8; ctx.fillStyle = rgbaW(al * 0.9); ctx.beginPath();
      for (let i = 0; i < 26; i++) { const an = -Math.PI * 0.95 + i / 25 * Math.PI * 0.9; const x = 0.62 + Math.cos(an) * rad * 1.3, y = -1.05 + Math.sin(an) * rad * 0.8; ctx.rect(x - 0.007, y - 0.007, 0.014, 0.014); } ctx.fill(); }
    // person (stick, readable face) holding the phone
    const pc = on ? '#cfcabd' : '#8d929b';
    L.stick(ctx, PERSON.x, PERSON.hip, PERSON.s, { mood: t > 19.6 && t < POST && !on ? 'sad' : 'awe', col: pc, look: [1, 0.5], seed: 7, pose: { armL: 0.25, armR: 2.2 } });
    // phone: green warning
    glow(ctx, PHONE.x, PHONE.y, 0.55, GC, 0.9); glow(ctx, PERSON.x + 0.05, -0.66, 0.35, GC, 0.35);
    ctx.fillStyle = '#1b1f27'; ctx.fillRect(PHONE.x - 0.045, PHONE.y - 0.08, 0.09, 0.16); ctx.fillStyle = GREEN; ctx.fillRect(PHONE.x - 0.037, PHONE.y - 0.07, 0.074, 0.14);
    ctx.fillStyle = 'rgba(13,17,24,0.6)'; for (let k = 0; k < 4; k++) ctx.fillRect(PHONE.x - 0.028, PHONE.y - 0.05 + k * 0.028, k % 2 ? 0.04 : 0.056, 0.009);
    ctx.restore();
  }
  function drawHouse(ctx, t, c, a, e) {
    if (a <= 0.003) return; const on = !kitchenDark(e), pre = t < TA || t >= POST;
    ctx.save(); ctx.globalAlpha = a; ctx.translate(540, 960); ctx.scale(c.S, c.S); ctx.translate(-c.cx, -c.cy);
    const ra = pre ? (t >= POST ? 0.5 : 1) : 0.2;
    glow(ctx, -28, -20, 16, RC, 0.8 * ra);
    ctx.save(); ctx.globalAlpha = a * ra; ctx.fillStyle = RED; ctx.beginPath(); hRed.forEach(p => { const x = p.x + Math.sin(t * 0.7 + p.ph) * 1.2, y = p.y + Math.cos(t * 0.5 + p.ph) * 0.8; ctx.rect(x - p.r, y - p.r, p.r * 2, p.r * 2); }); ctx.fill(); ctx.restore();
    ctx.fillStyle = 'rgba(220,224,228,0.55)'; ctx.beginPath(); snow.forEach(s => { const y = ((s.y + t * s.v + 30) % 32) - 30, x = s.x + Math.sin(t + s.ph) * 0.4; ctx.rect(x - 0.05, y - 0.05, 0.1, 0.1); }); ctx.fill();
    dots(ctx, H.ground, '#7c828c', 0.6); dots(ctx, H.tree, '#5f656f', 0.7); dots(ctx, H.pole, on ? '#8d929b' : RED, on ? 0.8 : 0.4);
    dots(ctx, H.out, '#b3b8c0', 0.85); dots(ctx, H.roof, '#b3b8c0', 0.85); dots(ctx, H.win, '#6b717b', 0.8);
    if (on) glow(ctx, 0, -0.7, 2.6, WC, 0.55);
    ctx.restore();
  }
  function drawTown(ctx, t, c, a, e) {
    if (a <= 0.003) return; ctx.save(); ctx.globalAlpha = a; const pre = t < TA || t >= POST;
    const ra = pre ? (t >= POST ? 0.5 : 1) : 0.15; const [gx, gy] = toS(c, 0, -4000);
    glow(ctx, gx, gy, 900 * c.S * 3, RC, 0.5 * ra);
    ctx.fillStyle = RED; ctx.globalAlpha = a * ra; ctx.beginPath(); tRed.forEach(p => { const [x, y] = toS(c, p.x + Math.sin(t * 0.5 + p.ph) * 60, p.y + Math.cos(t * 0.4 + p.ph) * 40); ctx.rect(x - p.s, y - p.s, p.s * 2, p.s * 2); }); ctx.fill();
    ctx.globalAlpha = a;
    const onP = [], offP = []; town.forEach(p => { const [x, y] = toS(c, p.x, p.y); if (x < -20 || x > 1100 || y < -20 || y > 1940) return; (dark(p.fr, p.rr, e) ? offP : onP).push([x, y, p.s]); });
    dots(ctx, offP, '#3a3f48', 1); dots(ctx, onP, '#e6dfcb', 0.9);
    const [ox, oy] = toS(c, 0, 0); const ma = L.sm(2.5, 2.9, c.lev) * (1 - L.sm(3.6, 4.1, c.lev));
    if (ma > 0) { ctx.strokeStyle = rgbaW(0.7 * ma); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(ox, oy, 20, 0, 7); ctx.stroke(); }
    ctx.restore();
  }
  function drawProvince(ctx, t, c, a, e) {
    if (a <= 0.003) return; ctx.save(); ctx.globalAlpha = a;
    // outline
    ctx.fillStyle = rgbaW(0.35); ctx.beginPath(); for (let i = 0; i < 260; i++) { const [x, y] = toS(c, bpt(i / 260 * Math.PI * 2).x, bpt(i / 260 * Math.PI * 2).y); ctx.rect(x - 1.2, y - 1.2, 2.4, 2.4); } ctx.fill();
    // pre-event red band in the north (fades as it enters the grid)
    const pre = (t < TA) ? 1 : (t >= POST ? 0.4 : 1 - L.sm(TA, TA + 1.5, t));
    if (pre > 0) { const [gx, gy] = toS(c, ORN.x, ORN.y - 250e3); glow(ctx, gx, gy, 520e3 * c.S, RC, 0.55 * pre);
      ctx.fillStyle = RED; ctx.globalAlpha = a * pre; ctx.beginPath(); pRed.forEach(p => { const [x, y] = toS(c, p.x + Math.sin(t * 0.6 + p.ph) * 25e3, p.y + Math.cos(t * 0.5 + p.ph) * 18e3); ctx.rect(x - p.s, y - p.s, p.s * 2, p.s * 2); }); ctx.fill(); ctx.globalAlpha = a; }
    const onP = [], hot = [], dim = [], wireOn = [];
    for (const p of plights) { const [x, y] = toS(c, p.x, p.y); const s = p.s * (p.wire ? 1 : 1);
      if (dark(p.fr, p.rr, e)) { (t - p.tf < 0.9 ? hot : dim).push([x, y, s * (t - p.tf < 0.9 ? 1.5 : 1)]); }
      else (p.wire ? wireOn : onP).push([x, y, s]); }
    dots(ctx, wireOn, '#9aa0aa', 0.75); dots(ctx, onP, '#e6dfcb', 0.9);
    dots(ctx, dim, RED, 0.3);
    if (hot.length) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; hot.forEach(h => glow(ctx, h[0], h[1], 10, RC, 0.35)); ctx.restore(); dots(ctx, hot, RED, 1); }
    // origin marker ("here")
    const [ox, oy] = toS(c, 0, 0); ctx.strokeStyle = rgbaW(0.75); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(ox, oy, 16, 0, 7); ctx.stroke();
    // green fragments + ring links (screen space)
    const ga = t >= 12.5 ? 1 : 0;
    if (ga > 0) {
      links.forEach(ln => { const pts = []; for (let i = 0; i <= 40; i++) { const p = bpt(ln.a0 + (ln.a1 - ln.a0) * i / 40, 0.78); pts.push(toS(c, p.x, p.y)); }
        ctx.fillStyle = rgbaW(0.25); ctx.beginPath(); pts.forEach((p, i) => { if (i % 2 === 0) ctx.rect(p[0] - 1.5, p[1] - 1.5, 3, 3); }); ctx.fill();
        const f = t >= POST ? 0 : L.ease.out(L.clamp((t - (ln.t - 0.6)) / 0.6, 0, 1));
        if (f > 0) { const n = Math.round(40 * f); ctx.strokeStyle = rgbaG(0.3); ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath(); for (let i = 0; i <= n; i++) i ? ctx.lineTo(pts[i][0], pts[i][1]) : ctx.moveTo(pts[i][0], pts[i][1]); ctx.stroke(); ctx.strokeStyle = GREEN; ctx.lineWidth = 5; ctx.stroke(); }
        // failed reach: a dot runs out and dies (visual rhythm, not data)
        if (t > TA && t < ln.t - 0.6) { const q = (((t - TA) * 0.8 + ln.a0) % 1 + 1) % 1; const idx = Math.floor(q * 18); ctx.fillStyle = rgbaG(0.9 * (1 - q)); ctx.beginPath(); ctx.arc(pts[idx][0], pts[idx][1], 5, 0, 7); ctx.fill(); } });
      ring.forEach((n, i) => { const [x, y] = toS(c, n.x, n.y); const pulse = 0.85 + 0.15 * Math.sin(t * 2.2 + i * 1.3);
        glow(ctx, x, y, 44 * pulse, GC, 1); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(x, y, 10 * pulse, 0, 7); ctx.fill();
        const la = L.sm(5.8, 6.1, c.lev) * (1 - L.sm(6.9, 7.2, c.lev)); if (la > 0) { const lx = L.clamp(x, 170, 800), ly = y + (n.y < PC.y ? -26 : 58);
          ctx.save(); ctx.globalAlpha = a * la; ctx.font = `44px "${HAND}"`; ctx.textAlign = 'center'; ctx.lineWidth = 8; ctx.strokeStyle = BG; ctx.lineJoin = 'round'; ctx.strokeText(n.lbl, lx, ly); ctx.fillStyle = PALE; ctx.fillText(n.lbl, lx, ly); ctx.restore(); } });
      if (t >= RING_T && t < POST) { const rc = L.sm(RING_T, RING_T + 0.4, t); ctx.globalAlpha = a * rc * (0.55 + 0.45 * Math.sin((t - RING_T) * 4) ** 2); ctx.fillStyle = GREEN; ctx.beginPath();
        for (let i = 0; i < 160; i++) { const p = bpt(i / 160 * Math.PI * 2, 0.9); const [x, y] = toS(c, p.x, p.y); ctx.rect(x - 2, y - 2, 4, 4); } ctx.fill(); }
    }
    ctx.restore();
  }
  function drawPlanet(ctx, t, c, a, e) {
    if (a <= 0.003) return; ctx.save(); ctx.globalAlpha = a;
    const [ex, ey] = toS(c, EC.x, EC.y), rp = R * c.S;
    ctx.fillStyle = '#12161d'; ctx.beginPath(); ctx.arc(ex, ey, rp, 0, 7); ctx.fill();
    const lv = [[], [], []]; planet.forEach(p => { const [x, y] = toS(c, p.x, p.y); lv[Math.min(2, Math.floor(p.b * 3.3))].push([x, y, 1.3]); });
    dots(ctx, lv[0], '#4a505a', 1); dots(ctx, lv[1], '#7c828c', 1); dots(ctx, lv[2], '#b3b8c0', 1);
    const fp = field.map(f => { const [x, y] = toS(c, f.x, f.y); return [x, y, 1.2]; }); dots(ctx, fp, '#8d929b', 0.45);
    const pl = planetLights.map(p => { const [x, y] = toS(c, p.x, p.y); return [x, y, 1.6, dark(p.fr, p.rr, e)]; });
    dots(ctx, pl.filter(p => !p[3]), '#f0e9d4', 1);
    // red flow toward the planet from the disc's direction (pre-event, staged)
    const pre = t < TA ? 1 : (t >= POST ? 0.3 : 1 - L.sm(TA, TA + 1, t));
    if (pre > 0) { const px = -SD.y, py = SD.x; ctx.fillStyle = RED; ctx.globalAlpha = a * pre; ctx.beginPath();
      flow.forEach(f => { const q = (t * 0.22 + f.ph) % 1; const bow = 1.9 * R + Math.abs(f.o) * 0.35; const dd = bow + 8 * R * (1 - q); const bend = Math.abs(f.o) < 2.2 * R ? (1 - q) : 1;
        const x = EC.x + SD.x * dd + px * f.o * (0.6 + 0.4 * bend + (1 - bend)), y = EC.y + SD.y * dd + py * f.o * (0.6 + 0.4 * bend);
        const [sx, sy] = toS(c, x, y); ctx.rect(sx - f.s, sy - f.s, f.s * 2, f.s * 2); }); ctx.fill();
      ctx.globalAlpha = a * pre; const [bx, by] = toS(c, EC.x + SD.x * 2.2 * R, EC.y + SD.y * 2.2 * R); glow(ctx, bx, by, 3 * R * c.S, RC, 0.5); }
    ctx.restore();
  }
  function drawFar(ctx, t, c, a) {
    if (a <= 0.003) return; ctx.save(); ctx.globalAlpha = a;
    const [sx, sy] = toS(c, SUN.x, SUN.y), [ex, ey] = toS(c, EC.x, EC.y);
    const RS = Math.max(7e8 * c.S, 72);
    // orbit arc (dotted)
    ctx.fillStyle = rgbaW(0.22); ctx.beginPath(); const orb = 1.5e11 * c.S; for (let i = 0; i < 200; i++) { const an = Math.atan2(-SD.y, -SD.x) - 0.6 + 1.2 * i / 200; ctx.rect(sx + Math.cos(an) * orb - 1.2, sy + Math.sin(an) * orb - 1.2, 2.4, 2.4); } ctx.fill();
    // gray disc (desaturated; sizes enlarged)
    glow(ctx, sx, sy, RS * 2.6, 'rgba(200,204,210,A)', 0.55);
    const g1 = [], g2 = []; sunDots.forEach(d => (d.b > 0.6 ? g1 : g2).push([sx + d.x * RS, sy + d.y * RS, 1.6])); dots(ctx, g2, '#8d929b', 1); dots(ctx, g1, '#c9ccd1', 1);
    // planet dot
    ctx.fillStyle = '#9aa0aa'; ctx.beginPath(); ctx.arc(ex, ey, 9, 0, 7); ctx.fill();
    // the red: a cloud between them (staged position, no clock)
    const P = cmeP(t), D = 1.5e11 * P, ux = -SD.x, uy = -SD.y, ang0 = Math.atan2(uy, ux);
    ctx.fillStyle = RED; ctx.beginPath();
    cme.forEach(q => { const an = ang0 + q.a * (0.6 + 0.4 * q.k); const dd = D * (0.72 + 0.28 * q.k) + Math.sin(t + q.ph) * 1.5e9; const [x, y] = toS(c, SUN.x + Math.cos(an) * dd, SUN.y + Math.sin(an) * dd); ctx.rect(x - q.s, y - q.s, q.s * 2, q.s * 2); });
    ctx.fill(); const [fx, fy] = toS(c, SUN.x + ux * D * 0.9, SUN.y + uy * D * 0.9); glow(ctx, fx, fy, 0.35 * D * c.S, RC, 0.6);
    L.label(ctx, 'sizes enlarged', 92, 1480, 44, { col: rgbaW(0.6), align: 'left', alpha: a });
    ctx.restore();
  }

  // ---------------- log ruler ----------------
  const RX0 = 100, RW = 780, RDEC = 8.6, RY_ = 1420;
  const rpos = s => RX0 + RW * L.clamp(Math.log10(Math.max(1, s)) / RDEC, 0, 1);
  const TICKS = [['second', 1], ['minute', 60], ['hour', 3600], ['day', 86400], ['month', 2.63e6], ['year', 3.156e7]];
  function ruler(ctx, t, a) {
    if (a <= 0.003) return; const e = E(t); ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = 'rgba(11,14,19,0.72)'; ctx.fillRect(80, RY_ - 92, 900, 172);
    ctx.fillStyle = rgbaW(0.55); for (let x = RX0; x <= RX0 + RW; x += 6) ctx.fillRect(x, RY_ - 1.5, 3, 3);
    ctx.font = `44px "${HAND}"`; ctx.textAlign = 'center';
    TICKS.forEach(([w, s]) => { const x = rpos(s); ctx.fillStyle = rgbaW(0.7); ctx.fillRect(x - 1.5, RY_ - 10, 3, 20); ctx.fillStyle = rgbaW(0.8); ctx.fillText(w, x, RY_ + 56); });
    ctx.textAlign = 'left'; ctx.fillStyle = rgbaW(0.85); ctx.fillText('log time', RX0 - 8, RY_ - 44);
    if (e > 0) { ctx.fillStyle = RED; ctx.fillRect(RX0, RY_ - 7, rpos(Math.min(e, COL_S)) - RX0, 14); }
    links.forEach(ln => { if (e >= ln.hrs * 3600) { ctx.fillStyle = GREEN; ctx.fillRect(rpos(ln.hrs * 3600) - 4, RY_ - 26, 8, 36); } });
    if (e > 0) { const x = rpos(e); ctx.fillStyle = '#fffdf7'; ctx.beginPath(); ctx.moveTo(x, RY_ - 16); ctx.lineTo(x - 11, RY_ - 34); ctx.lineTo(x + 11, RY_ - 34); ctx.fill(); }
    ctx.restore();
  }

  // ---------------- snap ----------------
  function snap(ctx, t) {
    const lt = t - SNAP0; ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    // faint particle ghost of the province
    ctx.save(); ctx.globalAlpha = 0.07; const gc = { S: 6.07e-4 * 0.9, cx: 0, cy: -650e3 }; ctx.fillStyle = '#e8e4da'; ctx.beginPath(); for (let i = 0; i < plights.length; i += 2) { const [x, y] = toS(gc, plights[i].x, plights[i].y); ctx.rect(x - 1.5, y - 1.5, 3, 3); } ctx.fill(); ctx.restore();
    if (lt < 0.25) { ctx.fillStyle = `rgba(255,253,247,${0.5 * (1 - lt / 0.25)})`; ctx.fillRect(0, 0, 1080, 1920); }
    if (lt < 2.7) {
      centerCard(ctx, ['At true proportions.'], 400, 92, fade(t, SNAP0 + 0.2, SNAP0 + 2.7, 0.25));
      const y = 840, x0 = 90, w = 900, f = L.ease.inOut(L.clamp((lt - 0.4) / 1.5, 0, 1));
      ctx.fillStyle = rgbaW(0.12); ctx.fillRect(x0, y - 16, w, 32); ctx.fillStyle = rgbaW(0.45); ctx.fillRect(x0, y - 16, w * f, 32);
      ctx.fillStyle = RED; ctx.fillRect(x0, y - 60, 2, 120);
      L.label(ctx, 'the dark: too thin to see', x0 - 2, y - 84, 48, { col: rgbaW(0.85), align: 'left' });
      if (f >= 1) { glow(ctx, x0 + w - 10, y, 50, GC, 1); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(x0 + w - 10, y, 12, 0, 7); ctx.fill(); L.label(ctx, 'the lasting fix', 895, y + 92, 48, { col: rgbaW(0.85), align: 'right' }); }
      L.label(ctx, 'linear time', x0, y + 92, 44, { col: rgbaW(0.6), align: 'left' });
      return;
    }
    const k = lt - 2.7, a2 = L.sm(0, 0.3, k), aB = L.sm(0.8, 1.2, k);
    centerCard(ctx, ['Same pieces, routed first.'], 340, 80, fade(t, SNAP0 + 2.8, SNAP1, 0.3));
    const row = (y, label, sub, ai, al) => { if (al <= 0) return; ctx.save(); ctx.globalAlpha = al;
      ctx.fillStyle = 'rgba(232,228,218,0.05)'; ctx.fillRect(80, y - 260, 900, 350); ctx.strokeStyle = rgbaW(0.18); ctx.lineWidth = 2; ctx.strokeRect(80, y - 260, 900, 350);
      ctx.font = `58px "${SERIF}"`; ctx.textAlign = 'left'; ctx.fillStyle = '#fffdf7'; ctx.fillText(label, 110, y - 190);
      if (sub) { const wl = ctx.measureText(label).width; ctx.font = `48px "${HAND}"`; ctx.fillStyle = GREEN; ctx.fillText(sub, 110, y - 136); }
      ctx.fillStyle = rgbaW(0.4); for (let x = RX0 - 10; x < RX0 + 140; x += 16) ctx.fillRect(x, y - 1.5, 8, 3);
      L.label(ctx, 'before', RX0 + 55, y + 56, 44, { col: rgbaW(0.75) });
      const rx = RX0 + 185, rw = RW - 185, pos = s => rx + rw * L.clamp(Math.log10(Math.max(1, s)) / RDEC, 0, 1);
      ctx.fillStyle = rgbaW(0.6); ctx.fillRect(rx, y - 1.5, rw, 3);
      ctx.font = `44px "${HAND}"`; ctx.textAlign = 'center';
      [['second', 1], ['hour', 3600], ['year', 3.156e7]].forEach(([w, s]) => { const x = pos(s); ctx.fillStyle = rgbaW(0.6); ctx.fillRect(x - 1.5, y - 10, 3, 20); ctx.fillStyle = rgbaW(0.75); ctx.fillText(w, x, y + 56); });
      ctx.fillStyle = RED; ctx.fillRect(rx, y - 8, pos(COL_S) - rx, 16);
      [links[0], links[4]].forEach(ln => { ctx.fillStyle = GREEN; ctx.fillRect(pos(ln.hrs * 3600) - 4, y - 26, 8, 38); });
      const wx = RX0 + 10;
      if (!ai) { ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(wx, y - 52, 9, 0, 7); ctx.fill(); ctx.fillStyle = rgbaW(0.35); for (let x = wx + 16; x < rx - 6; x += 16) ctx.fillRect(x, y - 53.5, 7, 3);
        L.label(ctx, 'warning, unrouted', wx - 10, y - 76, 44, { col: rgbaW(0.7), align: 'left' }); }
      else { const f = L.ease.out(L.clamp((k - 1.3) / 0.5, 0, 1)); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(wx, y - 52, 9, 0, 7); ctx.fill();
        ctx.strokeStyle = GREEN; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(wx, y - 52); ctx.lineTo(L.lerp(wx, rx - 6, f), y - 52); ctx.stroke();
        if (f >= 1) { glow(ctx, rx - 6, y - 52, 44, GC, 1); ctx.beginPath(); ctx.arc(rx - 6, y - 52, 12, 0, 7); ctx.fill(); }
        L.label(ctx, 'warning reaches operators', wx - 10, y - 76, 44, { col: rgbaW(0.85), align: 'left' }); }
      ctx.restore(); };
    row(780, 'As it happened', null, false, a2);
    row(1200, 'AI-routed warning', 'illustrative', true, aB);
    L.label(ctx, 'Operators still decide.', 490, 1366, 48, { col: rgbaW(0.85), alpha: L.sm(2.0, 2.3, k), font: SERIF });
    L.label(ctx, 'Steel still takes years.', 490, 1426, 48, { col: rgbaW(0.85), alpha: L.sm(2.6, 2.9, k), font: SERIF });
  }

  // ---------------- main ----------------
  function draw(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    if (t >= SNAP0 && t < SNAP1) { snap(ctx, t); L.slate(ctx, 'SC2  SNAP  FLAT'); L.grain(ctx, t, { alpha: 0.035, n: 300 }); return; }
    const lev = levAt(t), c = camAt(lev), e = E(t);
    const sa = L.sm(6.4, 7.3, lev);
    if (sa > 0) { ctx.save(); ctx.globalAlpha = sa; ctx.fillStyle = '#9aa0aa'; ctx.beginPath(); stars.forEach(s => { const tw = 0.6 + 0.4 * Math.sin(t * 1.3 + s.p); ctx.rect(s.x, s.y, s.s * tw, s.s * tw); }); ctx.fill(); ctx.restore(); }
    drawFar(ctx, t, c, L.sm(9.0, 9.9, lev));
    drawPlanet(ctx, t, c, L.sm(6.55, 7.15, lev) * (1 - L.sm(10.0, 10.7, lev)), e);
    drawProvince(ctx, t, c, L.sm(4.0, 4.9, lev) * (1 - L.sm(6.95, 7.5, lev)), e);
    drawTown(ctx, t, c, L.sm(2.1, 2.6, lev) * (1 - L.sm(4.1, 4.8, lev)), e);
    drawHouse(ctx, t, c, L.sm(0.85, 1.25, lev) * (1 - L.sm(2.3, 2.8, lev)), e);
    drawKitchen(ctx, t, c, 1 - L.sm(0.95, 1.4, lev), e);
    // ruler
    ruler(ctx, t, L.sm(13.4, 13.9, t) * (1 - L.sm(27.8, 28.3, t)) * (t < POST ? 1 : 0));
    // captions (documentary lower thirds)
    lower(ctx, [{ text: 'Observe the red.', parts: [['Observe the ', '#fffdf7'], ['red.', RED]] }], 1 - L.sm(2.7, 3.0, t), { big: true });
    lower(ctx, ['It gathers where no one looks.'], fade(t, 3.2, 5.6));
    lower(ctx, ['It crosses the dark in silence.'], fade(t, 5.9, 8.0));
    lower(ctx, ['It was born far away.'], fade(t, 8.2, 10.8));
    lower(ctx, ['It hunts the long wires.'], fade(t, 11.0, 13.6));
    lower(ctx, ['It takes a province', 'in 90 seconds.'], fade(t, 14.0, 17.3), { y: 1270 });
    lower(ctx, ['Then, one kitchen.'], fade(t, 17.5, 19.5));
    lower(ctx, ['The fridge stops humming.'], fade(t, 19.6, 21.15));
    lower(ctx, [{ text: 'The warning was already here.', col: '#fffdf7' }], fade(t, 21.25, 22.7));
    lower(ctx, ['The other pieces took longer.'], fade(t, 22.8, 24.9));
    lower(ctx, ['The lasting fix took', '7 years.'], fade(t, 25.1, 27.7), { y: 1270 });
    if (t > 27.7 && t < SNAP0) { ctx.fillStyle = `rgba(11,14,19,${0.6 * L.sm(27.7, 28.1, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
    centerCard(ctx, ['We slowed it down', 'so you could see it.'], 860, 92, fade(t, 27.9, 30.8));
    if (t >= POST) lower(ctx, ['This is the bottleneck.'], fade(t, 38.4, 40.6), { size: 84 });
    // slates
    const sl = t < 3 ? 'SC1  CLOSE  EYE LEVEL' : t < 10 ? 'SC1  CONTINUOUS ZOOM OUT' : t < 10.9 ? 'SC1  HOLD' : t < 13.8 ? 'SC1  ZOOM IN' : t < 17.4 ? 'SC1  WIDE  HOLD' : t < 19.6 ? 'SC1  ZOOM IN  CLOSER' : t < 22.4 ? 'SC1  CLOSE' : t < 24.8 ? 'SC1  PULL OUT' : t < SNAP0 ? 'SC1  WIDE' : t < 39 ? 'SC3  DROP DOWN' : 'SC3  EXTREME CLOSE';
    L.slate(ctx, sl);
    L.grain(ctx, t, { alpha: 0.035, n: 300 });
    if (t >= 40) L.endCard(ctx, L.sm(40, 40.4, t), { line: 'This is the bottleneck.' });
  }

  return { draw, DUR,
    acts: [{ start: 0, end: 14, bpm: 0, drone: true }, { start: 14, end: 17.2, bpm: 72 }, { start: 21.2, end: SNAP0, bpm: 0, drone: true }, { start: 31.3, end: SNAP1, bpm: 0, drone: true }, { start: SNAP1, end: DUR, bpm: 0, drone: true }],
    cues: [{ t: 3.0, type: 'whoosh' }, { t: 10.9, type: 'whoosh' }, { t: 17.13, type: 'hit' }, { t: 17.4, type: 'whoosh' }, { t: T_HUM, type: 'ding' }, { t: RING_T, type: 'ding' }, { t: SNAP0, type: 'hit' }, { t: SNAP0 + 2.7 + 1.8, type: 'pop' }, { t: SNAP1, type: 'whoosh' }, { t: 38.4, type: 'hit' }],
    _debug: { DBL, FR0, T_QUIET, T_HUM, links: links.map(l => [l.hrs.toFixed(1), l.t.toFixed(2)]), RING_T } };
}
module.exports = makeScene;
