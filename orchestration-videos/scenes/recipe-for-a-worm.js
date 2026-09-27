// recipe-for-a-worm ("Recipe"): recipe-parody, 8-bit, cooking, over-the-shoulder. Analog: wannacry-2017.
// A pixel cooking show whose kitchen is a hospital IT closet. World = 9x9 grid of kitchens; each kitchen is the full
//   closet (1080x1920 local) drawn at 1/9 scale, so the pull-out is one continuous camera (no crossfades).
// Red: the-worm-rewind model. Logistic (mid 4.0 h, k 1.16/h) pinned to 0 at t0, saturated by the 7.3 h kill switch
//   (s1; Neino/Kryptos Logic House testimony 2017-06-15: the bulk was hit before the stop), flat after. Shape unsourced.
//   Each kitchen = equal slice; red hour by rank (grid distance from the origin = the hero kitchen, plus noise).
// Green (real): route per kitchen max(7.3, lognormalQuantile(u, 20, 168)) h. AI (illustrative): lognormalQuantile(u, 1, 8.4) h.
// Mapping: prep = 59 days in 3.6 s (fast-forward); race = log clock 0->168 h over film 9.6-18.6 s; snap = linear, 1 week in 3 s.
// See output/recipe-for-a-worm/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('wannacry-2017');
  const DUR = 38, RED = L.RED, GREEN = L.GREEN;
  const BG = '#131519', G0 = '#0c0d10', G1 = '#1c1e23', G2 = '#2a2d33', G3 = '#3d4148', G4 = '#5a5f68', G5 = '#848993', G6 = '#b4b8bf', G7 = '#e3e3df';
  const P = 30;                                       // one art pixel in closet-local units

  // ---------- data ----------
  const KS = A.threat.events[0].t;                                        // 7.3 h (s1)
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;   // 20, 168
  const AIMED = A.ai_counterfactual.aggregation_median, AIP90 = AIMED * P90 / MED; // 1, 8.4
  const K = 1.16, MID = 4.0, sig = h => 1 / (1 + Math.exp(-K * (h - MID))), S0 = sig(0), SK = sig(KS);
  const extent = h => h <= 0 ? 0 : h >= KS ? 1 : (sig(h) - S0) / (SK - S0);   // saturates at the kill switch, flat after
  const redHourOfQ = q => { const v = S0 + q * (SK - S0); return MID - Math.log(1 / v - 1) / K; };

  // ---------- clocks ----------
  const R0 = 9.6, RS = 9, SPAN = 168, LOGS = Math.log10(SPAN + 1);
  const tOfHour = h => R0 + RS * Math.log10(h + 1) / LOGS;
  const hourAt = t => {                                // -1 = before t0
    if (t < 1.8) return 6;                             // cold open: hour 6, same timeline
    if (t < R0) return -1;
    if (t < R0 + RS) return Math.pow(10, (t - R0) / RS * LOGS) - 1;
    return SPAN;
  };
  const SNAP_A = 21.8, SNAP_B = 25.2, SNAP_S = 3;       // 168 h in 3 s

  // ---------- grid of kitchens ----------
  const COLS = 9, ROWS = 9, CW = 1080 / COLS, CH = 1920 / ROWS, SC = 1 / 9;
  const HC = 4, HR = 5;                                // hero kitchen
  const R = L.rng(2017);
  const cells = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) cells.push({ c, r, x: c * CW, y: r * CH, hero: c === HC && r === HR, noise: R() * 2.2 });
  // red ranked by grid distance from the hero kitchen (+noise); the hero itself is inserted at rank 12 of 81 (q = 0.154):
  //   the red comes from next door, and the hero is a kitchen the illustrative routing would have reached first.
  const byRed = cells.filter(n => !n.hero).sort((a, b) => (Math.hypot(a.c - HC, (a.r - HR) * 1.1) + a.noise) - (Math.hypot(b.c - HC, (b.r - HR) * 1.1) + b.noise));
  byRed.splice(12, 0, cells.find(n => n.hero));
  byRed.forEach((n, i) => { n.rank = i; n.rh = redHourOfQ((i + 0.5) / byRed.length); n.tr = tOfHour(n.rh); });
  const us = cells.map((_, i) => (i + 0.5) / cells.length);
  for (let i = us.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [us[i], us[j]] = [us[j], us[i]]; }
  cells.forEach((n, i) => { n.u = us[i]; });
  const HERO = cells.find(n => n.hero);
  { const k = cells.reduce((b, n) => Math.abs(n.u - 0.685) < Math.abs(b.u - 0.685) ? n : b, cells[0]); const tmp = k.u; k.u = HERO.u; HERO.u = tmp; }  // stratum 55/81
  cells.forEach(n => { n.gh = Math.max(KS, L.lognormalQuantile(n.u, MED, P90)); n.ga = L.lognormalQuantile(n.u, AIMED, AIP90); n.tg = tOfHour(n.gh); n.saved = n.ga < n.rh; });
  const tKS = tOfHour(KS);
  const PANTRY = { x: 150, y: -190 }, STRANGER = { x: 930, y: -190 };
  const _debug = { heroRed: HERO.rh, heroRoute: HERO.gh, heroAI: HERO.ga, tHeroRed: HERO.tr, tHeroRoute: HERO.tg, tKS, savedAI: cells.filter(n => n.saved).length };
  if (process.env.DEBUG_SCENE) console.log(_debug);

  // ---------- pixel helpers ----------
  const GL = {
    A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111', F: '111100110100100',
    G: '011100101101011', H: '101101111101101', I: '111010010010111', J: '001001001101010', K: '101101110101101', L: '100100100100111',
    M: '101111111101101', N: '110101101101101', O: '010101101101010', P: '110101110100100', Q: '010101101110011', R: '110101110101101',
    S: '011100010001110', T: '111010010010010', U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101',
    Y: '101101010010010', Z: '111001010100111', ',': '000000000010100', '.': '000000000000010', ':': '000010000010000', '-': '000000111000000',
    '<': '001010100010001', '>': '100010001010100', '!': '010010010000010', ' ': '000000000000000' };
  function ptext(c, str, x, y, u, col, align = 'left', a = 1) {
    if (a <= 0) return; str = String(str).toUpperCase(); const w = str.length * 4 * u - u;
    const x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x;
    c.save(); c.globalAlpha *= a; c.fillStyle = col;
    for (let i = 0; i < str.length; i++) { const g = GL[str[i]] || GL[' ']; for (let k = 0; k < 15; k++) if (g[k] === '1') c.fillRect(x0 + i * 4 * u + (k % 3) * u, y + Math.floor(k / 3) * u, u, u); }
    c.restore();
  }
  const pr = (c, gx, gy, gw, gh, col) => { c.fillStyle = col; c.fillRect(gx * P, gy * P, gw * P, gh * P); };
  const hex = col => [parseInt(col.slice(1, 3), 16), parseInt(col.slice(3, 5), 16), parseInt(col.slice(5, 7), 16)];
  const glow = (c, x, y, r, col, a) => { if (a <= 0.003) return; const g = c.createRadialGradient(x, y, 0, x, y, r); const [cr, cg, cb] = hex(col);
    g.addColorStop(0, `rgba(${cr},${cg},${cb},${a})`); g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); };
  function sprite(c, rows, pal, x, y, u) { rows.forEach((row, j) => { for (let i = 0; i < row.length; i++) { const k = row[i]; if (k === '.') continue; c.fillStyle = pal[k]; c.fillRect(x + i * u, y + j * u, u + 0.5, u + 0.5); } }); }

  // chef: 16x22, facing right (toward the oven), 3/4 back view
  const CHEF = [
    '....WWWWWW......', '...WWWWWWWW.....', '..WWWWWWWWWW....', '..WWWWXWWWWW....', '..WWWXXXWWWW....', '..WWWWXWWWWW....',
    '...wwwwwwwww....', '...HHHHSSSSSS...', '..HHHHSSSSSSS...', '..HHHSSSSSSSSS..', '..HHHSSSSSSSSSS.', '..HHsSSSSSSSSS..',
    '..HHsSSSSSSSS...', '...HssSSSSSSS...', '....sssSSSSS....', '.....ssssss.....', '..CCCCCCCCCCC...', '.CCCCCCCCCCCCCC.',
    'CCCCcCCCCCCWCCCC', 'CCCCcCCCCCCCCCCC', 'CCCCcCCCCCCWCCCC', 'CCCCcCCCCCCCCCCC'];
  const CPAL = { W: '#e6e6e2', w: '#b3b6bc', X: '#7c8089', H: '#2c2d31', S: '#a39b92', s: '#7f7870', C: '#cfd1d5', c: '#9ea2a9' };
  const FACE = {
    smug:    { brow: [[9, 7], [10, 7], [11, 7]], eye: [[10, 9], [11, 9]], mouth: [[10, 12], [11, 12], [12, 11]] },
    stunned: { brow: [[9, 7], [10, 7], [11, 7]], eye: [[10, 9], [10, 10]], mouth: [[11, 12], [11, 13], [12, 12], [12, 13]] },
    angry:   { brow: [[9, 7], [10, 8], [11, 8]], eye: [[10, 9]], mouth: [[10, 12], [12, 12], [13, 12]], teeth: [[11, 12]] },
    set:     { brow: [[9, 8], [10, 8], [11, 8]], eye: [[10, 9]], mouth: [[11, 12], [12, 12]] },
  };
  function drawChef(c, x, y, u, mood, t, steam = 0) {
    sprite(c, CHEF, CPAL, x, y, u);
    const f = FACE[mood] || FACE.set; c.fillStyle = '#111215';
    f.brow.concat(f.eye, f.mouth).forEach(([i, j]) => c.fillRect(x + i * u, y + j * u, u, u));
    if (f.teeth) { c.fillStyle = '#e6e6e2'; f.teeth.forEach(([i, j]) => c.fillRect(x + i * u, y + j * u, u, u)); }
    c.fillStyle = CPAL.s; c.fillRect(x + 6 * u, y + 10 * u, u, 2 * u);                  // ear
    if (steam > 0) { for (let k = 0; k < 6; k++) { const ph = ((t * 1.3 + k / 6) % 1); c.fillStyle = `rgba(200,202,206,${steam * (1 - ph) * 0.8})`;
      const sx = x + (k % 2 ? 1 : 12) * u + Math.round(Math.sin(k * 2 + ph * 6)) * u, sy = y + 2 * u - ph * 6 * u; c.fillRect(sx, Math.round(sy / u) * u, u, u); } }
  }

  // red pixels boiling over from the oven: deterministic floor/wall tiles ranked by distance from the oven door
  const SPILL = [];
  { const r2 = L.rng(59); for (let i = 0; i < 170; i++) { const gx = Math.floor(r2() * 34) + 1, gy = 26 + Math.floor(r2() * 37); const d = Math.hypot(gx - 25, (gy - 38) * 0.8) + r2() * 5;
      if (gx >= 20 && gx <= 32 && gy >= 14 && gy <= 44) continue; SPILL.push({ gx, gy, d }); } SPILL.sort((a, b) => a.d - b.d); SPILL.forEach((s, i) => { s.q = i / SPILL.length; }); }
  const EDGE = [];                                   // red outside the closet door (left wall), filled by the global extent
  { const r4 = L.rng(512); for (let i = 0; i < 70; i++) { const gx = Math.floor(r4() * 4), gy = 24 + Math.floor(r4() * 40); EDGE.push({ gx, gy, d: gx + r4() * 2.5 }); }
    EDGE.sort((a, b) => a.d - b.d); EDGE.forEach((e, i) => { e.q = i / EDGE.length; }); }
  const CABLE = []; for (let x = 20; x >= 6; x--) CABLE.push([x, 45]); for (let y = 44; y >= 28; y--) CABLE.push([6, y]);

  // ---------- the closet (local 1080x1920), full detail ----------
  // st: {rp: red progress 0..1, fix: 0..1, dust, memos, disk: 'counter'|'none'|{x,y,s}, cal, timer, seed, chef, mood, steam, t, thread}
  function drawCloset(c, st) {
    const lights = 1 - 0.75 * L.sm(0.25, 0.6, st.rp);   // a patch does not undo what is already hit
    pr(c, 0, 0, 36, 44, G2); pr(c, 0, 44, 36, 20, G1);
    for (let x = 0; x < 36; x += 4) pr(c, x, 44, 2, 1, G2);                                 // floor tiles
    for (let y = 46; y < 64; y += 4) for (let x = (y / 4) % 2 ? 0 : 2; x < 36; x += 4) pr(c, x, y, 2, 2, '#202227');
    pr(c, 6, 2, 24, 1, lights > 0.6 ? G6 : G3);                                              // ceiling light
    // recipe board
    pr(c, 2, 6, 16, 12, G4); pr(c, 3, 7, 14, 10, G1); ptext(c, 'RECIPE', 3.6 * P, 8 * P, 14, G6);
    for (let k = 0; k < 4; k++) pr(c, 4, 11 + k * 1.5, k === 0 ? 11 : 7 + (k * 3) % 5, 0.6, G4);
    // calendar (pages flip during prep)
    pr(c, 19, 7, 7, 8, G6); pr(c, 19, 7, 7, 2, G4);
    for (let k = 0; k < 3; k++) pr(c, 20, 10 + k * 1.5, 5, 0.6, G5);
    if (st.cal > 0) { const ph = st.cal % 1; pr(c, 19, 9, 7, 6 * (1 - ph), '#cfd1d5'); }
    if (st.fri) ptext(c, 'FRI', 22.5 * P, 10.5 * P, 18, G1, 'center');
    // kitchen timer (log clock of the week), pixel dial
    const TX = 30, TY = 10.5;
    for (let j = -3; j <= 3; j++) for (let i = -3; i <= 3; i++) if (Math.hypot(i, j) < 3.4) pr(c, TX + i, TY + j, 1, 1, Math.hypot(i, j) > 2.5 ? G4 : G6);
    { const a = -Math.PI / 2 + st.timer * Math.PI * 2; for (let k = 0; k <= 2; k++) pr(c, TX + Math.round(Math.cos(a) * k), TY + Math.round(Math.sin(a) * k), 1, 1, G1); }
    // monitors (the ward screens): on -> red-hit -> dark
    [[3, 21], [10, 21]].forEach(([mx, my], m) => {
      pr(c, mx, my, 6, 5, G4); const hit = L.clamp((st.rp - 0.55 - m * 0.12) / 0.15, 0, 1);
      if (hit <= 0) { pr(c, mx + 0.5, my + 0.5, 5, 4, G5); for (let k = 0; k < 3; k++) pr(c, mx + 1, my + 1 + k * 1.1, 2 + (k * 2 + m) % 3, 0.5, G3); }
      else if (hit < 1) { pr(c, mx + 0.5, my + 0.5, 5, 4, RED); }
      else pr(c, mx + 0.5, my + 0.5, 5, 4, G0);
      pr(c, mx + 2.5, my + 5, 1, 1, G4);
    });
    // cable from oven to the monitors
    CABLE.forEach(([x, y], i) => { const on = st.rp * 1.4 * CABLE.length > i; pr(c, x, y, 1, 1, on ? RED : G3); });
    // counter
    pr(c, 1, 34, 18, 2, G5); pr(c, 1, 36, 18, 10, G3); pr(c, 9.5, 36, 0.5, 10, G2);
    pr(c, 7.5, 39, 1, 2, G5); pr(c, 11, 39, 1, 2, G5);
    // unread alerts pile (gray memos)
    for (let k = 0; k < st.memos; k++) { const mx = 3 + (k % 2) * 0.5, my = 33 - k; pr(c, mx, my, 5, 1, G6); pr(c, mx + 0.5, my + 0.3, 3, 0.3, G4); pr(c, mx + 4, my, 1, 1, G4); }
    // the patch disk
    const drawDisk = (x, y, s = 1, hs = 1) => { c.save(); c.translate(x, y); c.scale(s, s * hs);
      pr(c, 0, 0, 5, 5, GREEN); pr(c, 1, 0, 3, 1.6, '#146b3c'); pr(c, 2.6, 0.2, 0.8, 1.2, GREEN); pr(c, 1, 3, 3, 2, '#d8f5e4'); c.restore(); };
    // oven-server
    pr(c, 20, 14, 13, 31, G1); pr(c, 20.5, 14.5, 12, 30, G3);
    for (let k = 0; k < 4; k++) pr(c, 22 + k * 2.5, 15.5, 1.5, 0.5, G2);                     // vents
    pr(c, 22, 18, 6, 1.2, G0);                                                              // disk slot
    for (let k = 0; k < 5; k++) pr(c, 30, 18 + k * 1.6, 1, 0.8, G4);                         // LEDs
    if (st.fix > 0) { c.save(); c.globalAlpha = st.fix; pr(c, 30, 18, 1, 0.8, GREEN); glow(c, 30.5 * P, 18.4 * P, 160, GREEN, 0.5); c.restore(); }
    pr(c, 21.5, 27, 10, 15, G4); pr(c, 22, 28, 9, 1, G5);                                  // oven door + handle
    pr(c, 22.5, 30, 8, 10, G0);                                                              // window
    if (st.seed > 0 && st.rp <= 0) { pr(c, 26, 35, 1, 1, RED); glow(c, 26.5 * P, 35.5 * P, 120, RED, 0.5 * st.seed); }
    // darkness (lights out), then red on top
    if (lights < 1) { c.fillStyle = `rgba(6,7,9,${(1 - lights) * 0.85})`; c.fillRect(0, 0, 1080, 1920); }
    const redA = st.rp;
    if (st.edge > 0) EDGE.forEach(e => { if (e.q < st.edge * 0.9) pr(c, e.gx, e.gy, 1, 1, RED); });
    if (redA > 0) {
      const fl = st.t ? 0.85 + 0.15 * L.noise(st.t * 6, 3) : 1;
      glow(c, 26.5 * P, 35 * P, 760, RED, 0.42 * redA * fl);
      for (let j = 0; j < 10; j++) for (let i = 0; i < 8; i++) { const v = L.noise(i * 1.3 + j * 7.1 + Math.floor((st.t || 0) * 8) * 0.37, 11);
        if (v < 0.35 + 0.65 * redA) { c.fillStyle = v < 0.3 ? RED : '#b3261f'; c.fillRect((22.5 + i) * P, (30 + j) * P, P, P); } }
      SPILL.forEach(s => { if (s.q < redA * 0.9 - 0.05) pr(c, s.gx, s.gy, 1, 1, RED); });
      CABLE.forEach(([x, y], i) => { if (redA * 1.4 * CABLE.length > i) pr(c, x, y, 1, 1, RED); });
    }
    // the patch disk, drawn above the dark and the red: it is always there, in plain sight
    if (st.disk === 'counter') {
      drawDisk(12 * P, 29 * P);
      if (st.dust > 0) { const r3 = L.rng(7); for (let k = 0; k < 26; k++) { const dx = r3() * 5, dy = r3() * 2.2, th = r3(); if (th < st.dust) { c.fillStyle = th < st.dust - 0.3 ? G5 : G4; c.fillRect((12 + dx) * P, (29 + dy) * P, P * 0.5, P * 0.5); } } }
    } else if (st.disk && st.disk.x !== undefined) drawDisk(st.disk.x, st.disk.y, 1, st.disk.hs ?? 1);
    if (st.fix > 0) { c.save(); c.globalAlpha = st.fix; pr(c, 30, 18, 1, 0.8, GREEN); glow(c, 30.5 * P, 18.4 * P, 160, GREEN, 0.5); c.restore(); }
    // green routing thread arriving from above (drawn in local units)
    if (st.thread > 0) { const n = 34, m = Math.floor(n * st.thread); c.fillStyle = GREEN;
      for (let k = 0; k < m; k++) { const f = k / n; const x = L.lerp(14.5, 14.5, f), y = L.lerp(-2, 28.5, f); if (k % 2 === 0) c.fillRect(x * P, y * P, P * 0.7, P * 0.7); }
      glow(c, 14.5 * P, L.lerp(-2, 28.5, st.thread) * P, 110, GREEN, 0.55); }
    if (st.chef) drawChef(c, -40, 1330, 36, st.mood, st.t || 0, st.steam || 0);
    if (st.hand) drawHand(c, st.hand);
  }
  function drawHand(c, h) {
    // sleeve from off-frame bottom-left to the wrist, stepped pixels
    const x0 = 200, y0 = 2000, n = 40; c.fillStyle = CPAL.C;
    for (let k = 0; k <= n; k++) { const f = k / n; const x = Math.round(L.lerp(x0, h.x - 60, f) / P) * P, y = Math.round(L.lerp(y0, h.y + 80, f) / P) * P; c.fillRect(x - 60, y - 60, 120, 120); }
    c.fillStyle = CPAL.c; for (let k = 0; k <= n; k += 2) { const f = k / n; const x = Math.round(L.lerp(x0, h.x - 60, f) / P) * P, y = Math.round(L.lerp(y0, h.y + 80, f) / P) * P; c.fillRect(x - 60, y + 30, 120, 30); }
    sprite(c, ['.SSSS.', 'SSSSSS', 'SSSSSs', 'SSSSSs', '.ssss.'], CPAL, h.x - 3 * P, h.y - 1 * P, P);
  }
  // simplified kitchen for the grid
  function drawMini(c, n, red, fix) {
    const lightsOut = red;
    pr(c, 0, 0, 36, 44, lightsOut > 0.5 ? G1 : G2); pr(c, 0, 44, 36, 20, G0);
    pr(c, 2, 6, 16, 12, G3); pr(c, 1, 34, 18, 12, G4);
    pr(c, 12, 29, 5, 5, GREEN);                                                              // the patch, on every counter
    pr(c, 20, 14, 13, 31, G3); pr(c, 22.5, 30, 8, 10, G0);
    const ra = red;                                                                          // flat after: routing arrives too late to undo it
    if (ra > 0) { pr(c, 22.5, 30, 8, 10, RED); c.save(); c.globalAlpha = ra; pr(c, 0, 44, 36, 2, RED); c.restore(); }
    if (fix > 0) { c.save(); c.globalAlpha = fix; pr(c, 30, 18, 2, 2, GREEN); c.restore(); }
    pr(c, 1, 44, 7, 3, '#e6e6e2'); pr(c, 2, 47, 5, 4, '#a39b92'); pr(c, 0, 51, 9, 13, '#cfd1d5');   // chef
  }

  // ---------- world camera ----------
  const W = (lx, ly) => [HERO.x + lx * SC, HERO.y + ly * SC];
  const CAM = [
    [0, ...W(560, 1120), 11.2], [1.8, ...W(560, 1120), 11.9], [2.4, ...W(540, 1090), 10.8], [7.8, ...W(540, 1090), 11.7],
    [R0, ...W(540, 1090), 11.7], [12.4, ...W(560, 1070), 12.6], [15.4, 540, 880, 0.78], [16.6, ...W(420, 1380), 14.4],
    [18.6, ...W(420, 1400), 15.2], [21.8, ...W(420, 1400), 15.2]];
  function camAt(t) {
    if (t <= CAM[0][0]) return CAM[0].slice(1);
    for (let i = 0; i < CAM.length - 1; i++) { const a = CAM[i], b = CAM[i + 1]; if (t <= b[0]) {
      const f = L.ease.inOut((t - a[0]) / (b[0] - a[0])); if (Math.abs(a[3] - b[3]) < 1e-6) return [L.lerp(a[1], b[1], f), L.lerp(a[2], b[2], f), a[3]];
      const Z = a[3] * Math.pow(b[3] / a[3], f); const g = (1 / Z - 1 / a[3]) / (1 / b[3] - 1 / a[3]);
      return [L.lerp(a[1], b[1], g), L.lerp(a[2], b[2], g), Z]; } }
    return CAM[CAM.length - 1].slice(1);
  }

  // hero state by film time
  function heroState(t) {
    const H = hourAt(t), tt = t < 8 ? t : (t < R0 ? 8 : t);
    const st = { edge: H > 0 ? extent(H) : 0, rp: 0, fix: 0, dust: 0, memos: 0, disk: 'counter', cal: 0, timer: 0, seed: 0, chef: true, mood: 'set', steam: 0, t, thread: 0, fri: false };
    if (t < 1.8) { Object.assign(st, { rp: 1, dust: 1, memos: 4, timer: Math.log10(H + 1) / LOGS, mood: 'angry', seed: 0, fri: true }); return st; }
    if (t < R0) {
      st.disk = tt < 2.6 ? 'none' : (tt < 2.8 ? { x: 12 * P, y: L.lerp(-6, 29, L.ease.in((tt - 2.6) / 0.2)) * P } : 'counter');
      st.dust = L.sm(2.9, 6.2, tt); st.cal = tt > 2.6 && tt < 6.2 ? (tt - 2.6) * 5 : 0; st.fri = tt >= 6.1;
      st.memos = [4.5, 4.9, 5.3, 5.7].filter(x => tt >= x).length;
      st.seed = L.sm(7.4, 7.6, tt); st.mood = tt < 8 ? 'smug' : 'stunned'; return st;
    }
    st.dust = 1; st.memos = 4; st.fri = true; st.timer = Math.log10(H + 1) / LOGS;
    st.rp = L.clamp((H - HERO.rh) / 1.5, 0, 1); st.seed = 1;
    st.thread = L.clamp(Math.log(1 + H) / Math.log(1 + HERO.gh), 0, 1);
    st.fix = L.sm(HERO.tg, HERO.tg + 0.35, t);
    st.mood = t < 15 ? 'stunned' : 'angry'; st.steam = L.sm(15.8, 16.4, t);
    return st;
  }

  function drawWorld(ctx, t, cam, override) {
    const [cx, cy, Z] = cam; const H = override ? -1 : hourAt(t);
    ctx.save(); ctx.translate(540, 960); ctx.scale(Z, Z); ctx.translate(-cx, -cy);
    const vx0 = cx - 540 / Z, vx1 = cx + 540 / Z, vy0 = cy - 960 / Z, vy1 = cy + 960 / Z;
    ctx.fillStyle = G0; ctx.fillRect(vx0 - 10, vy0 - 10, vx1 - vx0 + 20, vy1 - vy0 + 20);
    const wideA = L.clamp((6 - Z) / 3, 0, 1);
    // red halos behind infected kitchens (thumbnail legibility at wide scale)
    if (wideA > 0) cells.forEach(n => { const red = H >= n.rh ? (t >= R0 ? L.sm(n.tr, n.tr + 0.2, t) : 1) : 0; const fix = H >= n.gh ? L.sm(n.tg, n.tg + 0.3, t) : 0;
      if (red > 0) glow(ctx, n.x + CW / 2, n.y + CH * 0.6, 150, RED, 0.3 * red * wideA); });
    cells.forEach(n => {
      if (n.x + CW < vx0 || n.x > vx1 || n.y + CH < vy0 || n.y > vy1) return;
      ctx.save(); ctx.translate(n.x, n.y); ctx.scale(SC, SC);
      ctx.beginPath(); ctx.rect(0, 0, 1080, 1920); ctx.clip();
      if (n.hero) drawCloset(ctx, override || heroState(t));
      else { const red = H >= n.rh ? (t >= R0 ? L.sm(n.tr, n.tr + 0.2, t) : 1) : 0; const fix = H >= n.gh ? L.sm(n.tg, n.tg + 0.3, t) : 0; drawMini(ctx, n, red, fix); }
      ctx.restore();
      // cell frame; green when its route has arrived
      const fix = H >= n.gh ? L.sm(n.tg, n.tg + 0.3, t) : 0;
      ctx.strokeStyle = G0; ctx.lineWidth = 6; ctx.strokeRect(n.x + 3, n.y + 3, CW - 6, CH - 6);
      if (fix > 0 && wideA > 0) { ctx.save(); ctx.globalAlpha = fix * wideA; ctx.strokeStyle = GREEN; ctx.lineWidth = 5; ctx.strokeRect(n.x + 6, n.y + 6, CW - 12, CH - 12); ctx.restore(); }
    });
    if (wideA > 0) {
      ctx.save(); ctx.globalAlpha = wideA;
      // hero marker
      ctx.strokeStyle = G7; ctx.lineWidth = 4; ctx.strokeRect(HERO.x + 1, HERO.y + 1, CW - 2, CH - 2);
      // the pantry where the patch has sat since March, and the routes out of it
      ctx.fillStyle = G2; ctx.fillRect(PANTRY.x - 110, PANTRY.y - 80, 220, 150); ctx.fillStyle = GREEN; ctx.fillRect(PANTRY.x - 30, PANTRY.y - 50, 60, 60);
      ptext(ctx, 'THE FIX', PANTRY.x, PANTRY.y + 30, 7, G6, 'center');
      if (H >= 0) cells.forEach(n => { const p = L.clamp(Math.log(1 + H) / Math.log(1 + n.gh), 0, 1); if (p <= 0) return;
        const tx = n.x + CW / 2, ty = n.y + CH * 0.2, d = Math.hypot(tx - PANTRY.x, ty - PANTRY.y), m = Math.floor(d * p / 16);
        ctx.fillStyle = p >= 1 ? 'rgba(52,210,123,0.35)' : 'rgba(52,210,123,0.8)';
        for (let k = 0; k < m; k++) { const f = k * 16 / d; ctx.fillRect(L.lerp(PANTRY.x, tx, f) - 3, L.lerp(PANTRY.y, ty, f) - 3, 6, 6); } });
      // the stranger: one lit window outside the grid
      const ks = H >= KS ? L.sm(tKS, tKS + 0.2, t) : 0;
      ctx.fillStyle = G2; ctx.fillRect(STRANGER.x - 90, STRANGER.y - 80, 180, 150); ctx.fillStyle = ks > 0 ? GREEN : G3; ctx.fillRect(STRANGER.x - 60, STRANGER.y - 55, 120, 70);
      ctx.fillStyle = G1; ctx.fillRect(STRANGER.x - 10, STRANGER.y - 35, 20, 20); ctx.fillRect(STRANGER.x - 18, STRANGER.y - 15, 36, 30);
      ptext(ctx, 'ONE PERSON', STRANGER.x, STRANGER.y + 30, 6, G6, 'center');
      if (ks > 0) { glow(ctx, STRANGER.x, STRANGER.y - 20, 200, GREEN, 0.6 * ks);
        const rr = (t - tKS) * 2200; if (rr > 0 && rr < 2600) { ctx.strokeStyle = `rgba(52,210,123,${0.7 * (1 - rr / 2600)})`; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(STRANGER.x, STRANGER.y, rr, 0, 7); ctx.stroke(); } }
      ctx.restore();
    }
    ctx.restore();
    return wideA;
  }

  // ---------- screen-space text ----------
  function band(ctx, y0, y1, a) { ctx.save(); ctx.globalAlpha = a * 0.72; ctx.fillStyle = G0; ctx.fillRect(0, y0, 1080, y1 - y0); ctx.restore(); }
  function card(ctx, t, t0, t1, lines, y, size = 92, bandOn = true) {
    const a = Math.min(t0 < 0 ? 1 : L.sm(t0, t0 + 0.15, t), 1 - L.sm(t1 - 0.15, t1, t)); if (a <= 0) return;
    if (bandOn) band(ctx, y - size * 1.05, y + (lines.length - 1) * size * 1.04 + size * 0.5, a);
    L.title(ctx, lines, y, size, { alpha: a });
  }
  function scanlines(ctx) { ctx.fillStyle = 'rgba(0,0,0,0.13)'; for (let y = 0; y < 1920; y += 6) ctx.fillRect(0, y, 1080, 2); }
  function hud(ctx, label, f, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = 'rgba(12,13,16,0.75)'; ctx.fillRect(70, 222, 840, 96); ptext(ctx, label, 90, 236, 6, G6);
    ctx.fillStyle = G3; ctx.fillRect(90, 282, 800, 18); ctx.fillStyle = G6; for (let k = 0; k < Math.floor(f * 40); k++) ctx.fillRect(90 + k * 20, 282, 16, 18); ctx.restore(); }

  // ---------- snap panels ----------
  function panel(ctx, y, title, H, mode, a) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = G1; ctx.fillRect(70, y, 940, 400); ctx.strokeStyle = G3; ctx.lineWidth = 4; ctx.strokeRect(70, y, 940, 400);
    ctx.font = `54px "${HAND}"`; ctx.textAlign = 'left'; ctx.fillStyle = mode === 'ai' ? '#d9f3e4' : G7; ctx.fillText(title, 100, y + 68);
    const sx = 100, sy = y + 100, cw = 28, chh = 40, gap = 3;
    cells.forEach((n, i) => { const col = i % 27, row = Math.floor(i / 27); const x = sx + col * (cw + gap), yy = sy + row * (chh + 4);
      const route = mode === 'ai' ? n.ga : n.gh; const routed = H >= route, wasRed = n.rh < route, red = H >= n.rh && !routed && wasRed;
      const hit = H >= n.rh && wasRed; let fill = G3; if (hit) fill = RED; else if (routed) fill = GREEN;
      ctx.fillStyle = fill; ctx.fillRect(x, yy, cw, chh);
      if (routed && wasRed) { ctx.strokeStyle = GREEN; ctx.lineWidth = 3; ctx.strokeRect(x + 1.5, yy + 1.5, cw - 3, chh - 3); }
      if (n.hero) { ctx.strokeStyle = G7; ctx.lineWidth = 3; ctx.strokeRect(x - 3, yy - 3, cw + 6, chh + 6); } });
    // axis: one week, true proportions; a pip per kitchen at its route time
    const ax = 100, aw = 837, ay = y + 300;
    ctx.fillStyle = G3; ctx.fillRect(ax, ay, aw, 10);
    cells.forEach((n, i) => { const route = mode === 'ai' ? n.ga : n.gh; if (H < route) return; const x = ax + aw * Math.min(route / SPAN, 1) - 4;
      ctx.fillStyle = GREEN; ctx.fillRect(x, ay - 14 - (i % 4) * 9, 8, 8); });
    const px = ax + aw * Math.min(H / SPAN, 1); ctx.fillStyle = G7; ctx.fillRect(px - 3, ay - 50, 6, 70);
    ctx.font = `46px "${HAND}"`; ctx.textAlign = 'right'; ctx.fillStyle = G6; ctx.fillText('1 week', ax + aw, ay + 64);
    ctx.textAlign = 'left'; ctx.fillStyle = G5; ctx.fillText('start', ax, ay + 64);
    ctx.restore();
  }

  function draw(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    // ----- world shots -----
    if (t < SNAP_A) {
      let ov = null, tw = t;
      if (t >= 8.0 && t < R0) { tw = 8.0; ov = heroState(8.0); }                       // freeze
      if (t >= 1.8 && t < 2.4) { ov = t < 2.1 ? heroState(0.5) : heroState(2.45); }
      const cam = camAt(ov && t >= 8 ? 8.0 : t);
      const wideA = drawWorld(ctx, tw, cam, ov);
      // rewind glitch
      if (t >= 1.8 && t < 2.4) { const r = L.rng(Math.floor(t * 30)); ctx.fillStyle = 'rgba(160,165,172,0.28)'; ctx.fillRect(0, 0, 1080, 1920);
        for (let k = 0; k < 9; k++) { ctx.fillStyle = `rgba(20,21,25,${0.4 + r() * 0.4})`; ctx.fillRect(0, r() * 1920, 1080, 20 + r() * 60); }
        ptext(ctx, '<< REWIND', 540, 900, 16, G7, 'center'); }
      if (t >= 8.0 && t < R0) { ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0, 0, 1080, 1920); }
      // HUDs
      hud(ctx, 'PREP TIME: FAST-FORWARD', L.clamp((t - 2.6) / 3.6, 0, 1), L.sm(2.5, 2.7, t) * (1 - L.sm(7.6, 7.8, t)));
      hud(ctx, 'REAL HOURS, LOG CLOCK', L.clamp((t - R0) / RS, 0, 1), L.sm(R0, R0 + 0.2, t) * (1 - L.sm(18.5, 18.8, t)));
      // cards
      card(ctx, t, -1, 1.8, ['Take one', 'unpatched machine.'], 430, 100);
      card(ctx, t, 2.5, 4.4, ['Leave out', 'for 59 days.'], 470, 100);
      card(ctx, t, 4.45, 6.05, ['Garnish with', 'unread alerts.'], 470, 100);
      card(ctx, t, 6.1, 7.9, ['Serve warm', 'on a Friday.'], 470, 100);
      card(ctx, t, 8.05, R0, ['This recipe', 'really happened.'], 880, 108, false);
      card(ctx, t, 10.4, 12.4, ['It spreads', 'on its own.'], 470, 96);
      card(ctx, t, 12.5, 13.7, ['Every kitchen,', 'same recipe.'], 1330, 92);
      card(ctx, t, 13.75, 15.7, ['One stranger stopped it.', 'Partly luck.'], 1330, 88);
      card(ctx, t, 16.2, 18.5, ['The fix sat', 'on the counter.'], 440, 100);
      if (t >= 18.6) { const d = L.sm(18.6, 19.0, t); ctx.fillStyle = `rgba(0,0,0,${0.55 * d})`; ctx.fillRect(0, 0, 1080, 1920); }
      card(ctx, t, 18.8, 21.2, ['We slowed it down', 'so you could see it.'], 900, 92, false);
      if (t >= 21.2) { ctx.fillStyle = G0; ctx.fillRect(0, 0, 1080, 1920); }
      const shot = t < 1.8 ? 'SC1 CLOSE OTS  COLD OPEN' : t < 2.4 ? 'REWIND' : t < 8 ? 'SC2 OTS  PREP' : t < R0 ? 'FREEZE' : t < 12.4 ? 'SC3 OTS' : t < 15.4 ? 'SC4 PULL OUT' : t < 18.6 ? 'SC5 DROP IN' : 'SC6 HOLD';
      scanlines(ctx); L.slate(ctx, shot);
      return;
    }
    // ----- the snap -----
    if (t < 29.8) {
      ctx.fillStyle = G0; ctx.fillRect(0, 0, 1080, 1920);
      const bothOn = t >= 25.0;
      const HA = bothOn ? L.clamp((t - SNAP_B) / SNAP_S, 0, 1) * SPAN : L.clamp((t - SNAP_A) / SNAP_S, 0, 1) * SPAN;
      const HB = L.clamp((t - SNAP_B) / SNAP_S, 0, 1) * SPAN;
      if (t < 22.0) { ctx.fillStyle = `rgba(230,230,226,${0.35 * (1 - (t - SNAP_A) / 0.2)})`; ctx.fillRect(0, 0, 1080, 1920); }
      panel(ctx, 330, 'As it happened', HA, 'real', L.sm(SNAP_A, SNAP_A + 0.1, t));
      panel(ctx, 790, 'Routed sooner · illustrative', HB, 'ai', L.sm(25.0, 25.2, t));
      if (!bothOn) ptext(ctx, 'TRUE SPEED', 540, 1260, 9, G5, 'center', L.sm(21.9, 22.1, t));
      card(ctx, t, 28.3, 29.8, ['Same fix.', 'Routed sooner.'], 1340, 92);
      scanlines(ctx); L.slate(ctx, 'SC7 SNAP  TRUE SPEED / ILLUSTRATIVE'); return;
    }
    // ----- IN++: the chef's own hand puts the fix in (routed-sooner version) -----
    if (t < 32.8) {
      const lt = t - 29.8;
      const thread = L.clamp(lt / 0.5, 0, 1);
      let hand, disk = 'counter', fix = 0;
      const DX = 12 * P, DY = 29 * P, SX = 22.5 * P, SY = 17.6 * P;
      if (lt < 0.5) hand = null;
      else if (lt < 1.0) { const f = L.ease.inOut((lt - 0.5) / 0.5); hand = { x: L.lerp(300, DX + 60, f), y: L.lerp(1500, DY + 180, f) }; }
      else if (lt < 1.7) { const f = L.ease.inOut((lt - 1.0) / 0.7); const x = L.lerp(DX, SX, f), y = L.lerp(DY, SY, f); disk = { x, y }; hand = { x: x + 60, y: y + 180 }; }
      else if (lt < 1.95) { const f = (lt - 1.7) / 0.25; disk = { x: SX, y: SY + 30 * f, hs: 1 - f }; hand = { x: SX + 60, y: SY + 180 }; }
      else { disk = 'none'; const f = L.ease.inOut(L.clamp((lt - 2.1) / 0.6, 0, 1)); hand = { x: L.lerp(SX + 60, 300, f), y: L.lerp(SY + 180, 1700, f) }; }
      fix = L.sm(1.95, 2.3, lt);
      // illustrative: this kitchen's route (a_i = HERO.ga h) beats its red hour (HERO.rh h); red is only next door (global extent at a_i)
      const st = { edge: extent(HERO.ga), rp: 0, fix, dust: 0, memos: 0, disk, cal: 0, timer: Math.log10(HERO.ga + 1) / LOGS, seed: 0, chef: false, mood: 'set', steam: 0, t, thread: thread * (1 - L.sm(1.9, 2.3, lt)), fri: true, hand };
      const Z = L.lerp(15.3, 16.7, L.ease.out(L.clamp(lt / 3, 0, 1)));
      ctx.save(); ctx.translate(540, 960); ctx.scale(Z * SC, Z * SC); ctx.translate(-600, -760);
      ctx.fillStyle = G0; ctx.fillRect(-2000, -2000, 5000, 6000); drawCloset(ctx, st); ctx.restore();
      if (lt < 0.3) { ctx.fillStyle = `rgba(12,13,16,${1 - lt / 0.3})`; ctx.fillRect(0, 0, 1080, 1920); }
      card(ctx, t, 30.2, 32.8, ['This is', 'the bottleneck.'], 330, 104);
      ctx.save(); ctx.globalAlpha = L.sm(30.0, 30.3, t) * (1 - L.sm(32.6, 32.8, t)); ctx.fillStyle = 'rgba(12,13,16,0.75)'; ctx.fillRect(70, 1410, 840, 80);
      ctx.font = `48px "${HAND}"`; ctx.textAlign = 'center'; ctx.fillStyle = '#d9f3e4'; ctx.fillText('routed sooner · illustrative', 490, 1466); ctx.restore();
      scanlines(ctx); L.slate(ctx, 'SC8 IN++  HAND, CLOSEST'); return;
    }
    L.endCard(ctx, L.sm(32.8, 33.3, t));
  }

  const cues = [
    { t: 0.05, type: 'pop' }, { t: 1.8, type: 'whoosh' }, { t: 2.8, type: 'ding' }, { t: 4.5, type: 'pop' }, { t: 4.9, type: 'pop' }, { t: 5.3, type: 'pop' }, { t: 5.7, type: 'pop' },
    { t: 7.4, type: 'pop' }, { t: 8.0, type: 'hit' }, { t: HERO.tr, type: 'pop' }, { t: 12.4, type: 'whoosh' }, { t: tKS, type: 'ding' }, { t: 15.4, type: 'whoosh' }, { t: HERO.tg, type: 'bonk' },
    { t: SNAP_A, type: 'stamp' }, { t: SNAP_B + 0.15, type: 'ding' }, { t: 29.8, type: 'whoosh' }, { t: 31.75, type: 'pop' },
  ];
  return {
    draw, DUR, _debug,
    acts: [{ start: 0, end: 7.9, bpm: 120 }, { start: R0, end: 21.2, bpm: 0, drone: true }, { start: 21.8, end: 33, bpm: 0, drone: true }],
    cues,
  };
}
if (typeof module !== 'undefined') module.exports = makeScene;
