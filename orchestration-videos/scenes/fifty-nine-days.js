// fifty-nine-days: game-hud-run, 8-bit, game. Analog: wannacry-2017.
// Race mapping: film t 2..14 s <-> hours 0..24 (1 s = 2 h, linear). hours(t) = 2 (t - 2).
// Red = SPREAD meter, linear between the two sourced endpoints (0 at 0 h, 230,000 at 24 h; shape unsourced, labeled REPORTED).
// Green = analog fragments (patch -1416 h, alert, off switch 7.3 h, emergency patch ~20 h).
// Human aggregation per organisation: max(7.3, L.lognormalQuantile(q, 20, 168)). AI snap: median 1 h, p90 8.4 h (illustrative).
// See output/fifty-nine-days/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const { createCanvas } = require('@napi-rs/canvas');
  const A = L.loadAnalog('wannacry-2017');
  const DUR = 35, RED = L.RED, GREEN = L.GREEN;
  const BG = '#15171b', G1 = '#26292e', G2 = '#34373d', G3 = '#474b53', G4 = '#62666f', G5 = '#8d929b', G6 = '#c3c6cc', G7 = '#e6e6e2';
  const DRED = '#5c1c18', DGREEN = '#1c5a37', SKIN = '#9a938b', SKIN2 = '#7b746d', HAIR = '#2b2b2e';

  // ---------- time mapping & data ----------
  const T0 = 2, HPS = 2;
  const hoursAt = t => Math.max(0, HPS * (Math.min(t, 14) - T0));
  const tOfHour = h => T0 + h / HPS;
  const P24 = A.threat.points[A.threat.points.length - 1].t; // 24
  const meter = h => L.clamp(h / P24, 0, 1);                   // linear placeholder between sourced endpoints
  const F = {}; A.solution.fragments.forEach(f => F[f.id] = f.ready_at);
  const KILL = F.f3, EPATCH = F.f4;                             // 7.3 h, ~20 h
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;
  const AIMED = A.ai_counterfactual.aggregation_median, AIP90 = AIMED * P90 / MED;
  const tKill = tOfHour(KILL);                                  // 5.65
  const HOSP_RED = 0.85;                                        // hospital cell flips when meter crosses this rank
  const tHospRed = tOfHour(HOSP_RED * P24);                     // 12.2

  // ---------- pixel font (3x5) ----------
  const GL = {
    A: '010101111101101', B: '110101110101110', C: '011100100100011', D: '110101101101110', E: '111100110100111', F: '111100110100100',
    G: '011100101101011', H: '101101111101101', I: '111010010010111', J: '001001001101010', K: '101101110101101', L: '100100100100111',
    M: '101111111101101', N: '110101101101101', O: '010101101101010', P: '110101110100100', Q: '010101101110011', R: '110101110101101',
    S: '011100010001110', T: '111010010010010', U: '101101101101111', V: '101101101101010', W: '101101111111101', X: '101101010101101',
    Y: '101101010010010', Z: '111001010100111', '0': '111101101101111', '1': '010110010010111', '2': '110001010100111', '3': '110001010001110',
    '4': '101101111001001', '5': '111100110001110', '6': '011100111101111', '7': '111001010010010', '8': '111101111101111', '9': '111101111001110',
    ',': '000000000010100', '.': '000000000000010', ':': '000010000010000', '-': '000000111000000', '(': '010100100100010', ')': '010001001001010',
    '!': '010010010000010', '/': '001001010100100', ' ': '000000000000000', '?': '110001010000010' };
  function ptext(c, str, x, y, u, col, align = 'left', a = 1) {
    if (a <= 0) return; str = String(str).toUpperCase(); const w = str.length * 4 * u - u;
    let x0 = align === 'center' ? x - w / 2 : align === 'right' ? x - w : x; x0 = Math.round(x0 / u) * u;
    c.save(); c.globalAlpha *= a; c.fillStyle = col;
    for (let i = 0; i < str.length; i++) { const g = GL[str[i]] || GL[' ']; for (let k = 0; k < 15; k++) if (g[k] === '1') c.fillRect(x0 + i * 4 * u + (k % 3) * u, y + Math.floor(k / 3) * u, u, u); }
    c.restore(); return w;
  }
  const px = (c, x, y, w, h, col) => { c.fillStyle = col; c.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h)); };

  // ---------- low-res buffer (180x320, upscaled x6 nearest) ----------
  const LW = 180, LH = 320, S = 6; const lr = createCanvas(LW, LH); const lx = lr.getContext('2d');
  function blit(ctx, zoom = 1, cx = 540, cy = 960) {
    ctx.save(); ctx.imageSmoothingEnabled = false; ctx.translate(cx, cy); ctx.scale(zoom, zoom); ctx.translate(-cx, -cy);
    ctx.drawImage(lr, 0, 0, LW * S, LH * S); ctx.restore();
  }

  // ---------- sprites ----------
  // Face, drawn on a grid of unit u; moods: tired | alarm | resolve
  function face(c, x, y, u, mood, a = 1) {
    c.save(); c.globalAlpha *= a;
    px(c, x, y + u, 10 * u, 10 * u, SKIN); px(c, x + u, y, 8 * u, u, SKIN);
    px(c, x, y, 10 * u, 3 * u, HAIR); px(c, x - u, y + u, u, 4 * u, HAIR); px(c, x + 10 * u, y + u, u, 4 * u, HAIR);
    px(c, x - u, y + 5 * u, u, 2 * u, SKIN2); px(c, x + 10 * u, y + 5 * u, u, 2 * u, SKIN2);
    const E = '#15171b';
    if (mood === 'tired') { px(c, x + 2 * u, y + 5 * u, 2 * u, u, E); px(c, x + 6 * u, y + 5 * u, 2 * u, u, E); px(c, x + 2 * u, y + 6 * u, 2 * u, u, SKIN2); px(c, x + 6 * u, y + 6 * u, 2 * u, u, SKIN2); px(c, x + 3 * u, y + 8 * u, 4 * u, u, E); }
    else if (mood === 'alarm') { px(c, x + 2 * u, y + 4 * u, 2 * u, 2 * u, G7); px(c, x + 6 * u, y + 4 * u, 2 * u, 2 * u, G7); px(c, x + 3 * u, y + 5 * u, u, u, E); px(c, x + 6 * u, y + 5 * u, u, u, E);
      px(c, x + 2 * u, y + 3 * u, 2 * u, u, HAIR); px(c, x + 6 * u, y + 3 * u, 2 * u, u, HAIR); px(c, x + 4 * u, y + 7 * u, 2 * u, 2 * u, E); }
    else { px(c, x + 2 * u, y + 5 * u, 2 * u, u, E); px(c, x + 6 * u, y + 5 * u, 2 * u, u, E); px(c, x + 2 * u, y + 4 * u, u, u, HAIR); px(c, x + 3 * u, y + 3 * u + u * 0, u, u, HAIR); px(c, x + 7 * u, y + 4 * u, u, u, HAIR); px(c, x + 6 * u, y + 3 * u, u, u, HAIR);
      px(c, x + 3 * u, y + 8 * u, 4 * u, u, E); px(c, x + 7 * u, y + 7 * u, u, u, E); }
    c.restore();
  }
  // green disk (the patch)
  function disk(c, x, y, u, a = 1) { c.save(); c.globalAlpha *= a; px(c, x, y, 8 * u, 8 * u, GREEN); px(c, x + 2 * u, y, 4 * u, 3 * u, DGREEN); px(c, x + 4 * u, y + u, u, u, GREEN); px(c, x + u, y + 5 * u, 6 * u, 3 * u, G6); px(c, x + 2 * u, y + 6 * u, 4 * u, u, G4); c.restore(); }
  // first-person hand holding the disk, in low-res units
  function hand(c, x, y, withDisk = true) {
    if (withDisk) disk(c, x + 6, y - 4, 3);
    px(c, x, y + 10, 30, 40, SKIN); px(c, x + 2, y + 50, 26, 20, '#4b4f57');           // palm + sleeve
    px(c, x + 30, y + 8, 7, 14, SKIN); px(c, x + 30, y + 22, 7, 3, SKIN2);              // thumb over disk edge
    for (let i = 0; i < 4; i++) { px(c, x - 5, y + 12 + i * 8, 8, 7, SKIN); px(c, x - 5, y + 18 + i * 8, 8, 1, SKIN2); } // fingers curled
    px(c, x + 28, y + 10, 2, 38, SKIN2);
  }
  // front-facing worker sprite (world units), u = pixel size
  function worker(c, x, y, u, mood) {
    face(c, x, y, u, mood);
    px(c, x - u, y + 11 * u, 12 * u, 7 * u, G4); px(c, x + 4 * u, y + 11 * u, 2 * u, 5 * u, G6);  // shirt + lanyard
    px(c, x - 3 * u, y + 12 * u, 2 * u, 5 * u, G4); px(c, x + 11 * u, y + 12 * u, 2 * u, 5 * u, G4);
    disk(c, x + 10 * u, y + 15 * u, u * 0.6);
    px(c, x + u, y + 18 * u, 3 * u, 4 * u, G3); px(c, x + 6 * u, y + 18 * u, 3 * u, 4 * u, G3);
  }

  // ---------- POV corridor (low-res) ----------
  const FOC = 72, XW = 1.45, YF = 1.45, YC = -1.55, NEAR = 0.3, END = 14;
  function quad(c, pts, col) { c.fillStyle = col; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fill(); }
  const monFlip = k => tHospRed + (k / END) * 1.6;
  function corridor(c, t, camZ, bob, { allRed = false, dim = 0, sway = 0 } = {}) {
    const vx = 90 + sway, vy = 140 + bob; const P = (X, Y, z) => [vx + X * FOC / z, vy + Y * FOC / z];
    px(c, 0, 0, LW, vy, G1); px(c, 0, vy, LW, LH - vy, G2);
    // end wall + terminal
    const ze = END - camZ; if (ze > NEAR) {
      const a = P(-XW, YC, ze), b = P(XW, YF, ze); px(c, a[0], a[1], b[0] - a[0], b[1] - a[1], '#3d4047');
      const d1 = P(-1.0, 0.55, ze), d2 = P(1.0, 0.75, ze); px(c, d1[0], d1[1], d2[0] - d1[0], d2[1] - d1[1], G4);
      const m1 = P(-0.55, -0.35, ze), m2 = P(0.55, 0.55, ze); px(c, m1[0], m1[1], m2[0] - m1[0], m2[1] - m1[1], G5);
      const s1 = P(-0.44, -0.26, ze), s2 = P(0.44, 0.36, ze);
      const termRed = allRed || t >= monFlip(END);
      px(c, s1[0], s1[1], s2[0] - s1[0], s2[1] - s1[1], termRed ? RED : '#22262a');
      if (!termRed) { const w = s2[0] - s1[0]; for (let i = 0; i < 3; i++) px(c, s1[0] + w * 0.12, s1[1] + (s2[1] - s1[1]) * (0.2 + i * 0.25), w * (0.6 - i * 0.12), Math.max(1, w * 0.04), G4); }
    }
    for (let k = END - 1; k >= 0; k--) {
      let z0 = k - camZ, z1 = k + 1 - camZ; if (z1 <= NEAR) continue; z0 = Math.max(z0, NEAR);
      const alt = k % 2 === 0;
      const redFloor = !allRed && t >= monFlip(k) && t < 15 ? 1 : allRed ? 1 : 0;
      quad(c, [P(-XW, YF, z0), P(XW, YF, z0), P(XW, YF, z1), P(-XW, YF, z1)], redFloor ? (alt ? '#3a2422' : '#32201f') : (alt ? '#383b41' : '#2f3237'));
      quad(c, [P(-XW, YC, z0), P(XW, YC, z0), P(XW, YC, z1), P(-XW, YC, z1)], alt ? '#2a2d32' : '#25282c');
      quad(c, [P(-XW, YC, z0), P(-XW, YF, z0), P(-XW, YF, z1), P(-XW, YC, z1)], alt ? '#4b4f57' : '#454850');
      quad(c, [P(XW, YC, z0), P(XW, YF, z0), P(XW, YF, z1), P(XW, YC, z1)], alt ? '#474a52' : '#41444b');
      // ceiling light
      if (alt) { const za = Math.max(k + 0.35 - camZ, NEAR), zb = k + 0.65 - camZ; if (zb > NEAR) quad(c, [P(-0.35, YC, za), P(0.35, YC, za), P(0.35, YC, zb), P(-0.35, YC, zb)], dim > 0.5 ? G3 : G6); }
      // door or wall monitor
      const side = alt ? 1 : -1;
      if (k % 3 === 1) { const za = Math.max(k + 0.15 - camZ, NEAR), zb = k + 0.75 - camZ; if (zb > NEAR) quad(c, [P(-side * XW, -0.9, za), P(-side * XW, YF, za), P(-side * XW, YF, zb), P(-side * XW, -0.9, zb)], '#33363c'); }
      const za = Math.max(k + 0.25 - camZ, NEAR), zb = k + 0.75 - camZ;
      if (zb > NEAR) { const red = allRed || t >= monFlip(k);
        quad(c, [P(side * XW, -0.75, za), P(side * XW, -0.05, za), P(side * XW, -0.05, zb), P(side * XW, -0.75, zb)], G5);
        quad(c, [P(side * XW, -0.66, za + 0.05), P(side * XW, -0.14, za + 0.05), P(side * XW, -0.14, zb - 0.05), P(side * XW, -0.66, zb - 0.05)], red ? RED : '#22262a'); }
    }
    if (dim > 0) { c.save(); c.globalAlpha = dim; px(c, 0, 0, LW, LH, '#0c0d10'); c.restore(); }
  }

  // ---------- terminal close-up (low-res) ----------
  const tr = L.rng(59); const floodKey = []; for (let y = 0; y < 27; y++) for (let x = 0; x < 34; x++) floodKey.push(Math.min(x, 33 - x, y * 1.2, (26 - y) * 1.2) / 13 + tr() * 0.35);
  function terminal(c, t, mode) { // mode: 'human' | 'routed'
    px(c, 0, 0, LW, LH, '#303338'); px(c, 0, 250, LW, 70, '#2a2c31');
    px(c, 8, 70, 164, 170, G5); px(c, 12, 74, 156, 162, '#7b8089');           // CRT bezel
    const sx = 20, sy = 82, sw = 140, sh = 110;
    px(c, sx, sy, sw, sh, '#1d2024');
    px(c, 40, 206, 100, 8, '#2a2d32'); px(c, 42, 208, 96, 4, '#101114');      // disk slot
    px(c, 146, 204, 8, 8, mode === 'routed' && t > 26.5 ? GREEN : G3);          // drive light
    const off = mode === 'human' && t >= 14.25;
    if (off) { px(c, sx, sy, sw, sh, '#0e0f11'); const k = L.clamp((t - 14.25) / 0.25, 0, 1); if (k < 1) px(c, sx, sy + sh / 2 - 1, sw * (1 - k), 2, G6); return; }
    // reflection of his face
    const mood = mode === 'routed' ? 'resolve' : (t < 13.55 ? 'tired' : 'alarm');
    face(c, 64, 112, 5, mood, mode === 'routed' ? 0.14 : 0.22);
    ptext(c, 'INBOX', sx + 6, sy + 6, 2, G5);
    px(c, sx + 6, sy + 22, 128, 1, G3);
    if (mode === 'human') {
      px(c, sx + 6, sy + 30, 10, 7, GREEN); px(c, sx + 7, sy + 31, 8, 1, DGREEN);
      ptext(c, 'ALERT', sx + 20, sy + 29, 2, G6);
      if (Math.floor(t * 3) % 2 === 0) ptext(c, 'UNREAD', sx + 64, sy + 29, 2, G7);
      ptext(c, 'RE: RE: RE:', sx + 6, sy + 49, 2, G4);
      ptext(c, 'LUNCH?', sx + 6, sy + 69, 2, G4);
      ptext(c, 'MEETING', sx + 6, sy + 89, 2, G4);
      // red flood from the edges (13.8 -> 14.2)
      const f = L.clamp((t - 13.8) / 0.4, 0, 1) * 1.4;
      if (f > 0) for (let y = 0; y < 27; y++) for (let x = 0; x < 34; x++) if (floodKey[y * 34 + x] < f) px(c, sx + 2 + x * 4, sy + 1 + y * 4, 4, 4, RED);
    } else {
      const applied = t >= 26.5;
      px(c, sx + 6, sy + 30, 10, 7, G4); ptext(c, 'ALERT', sx + 20, sy + 29, 2, G5); ptext(c, 'READ', sx + 64, sy + 29, 2, G5);
      if (applied) { ptext(c, 'PATCH', sx + 6, sy + 52, 3, GREEN); ptext(c, 'APPLIED', sx + 6, sy + 74, 3, GREEN); }
      else { const dots = '...'.slice(0, 1 + Math.floor(t * 4) % 3); ptext(c, 'READY' + dots, sx + 6, sy + 55, 2, G6); }
    }
    if (Math.floor(t * 2.5) % 2 === 0) px(c, sx + 124, sy + 96, 6, 8, G6);
  }

  // ---------- HUD (hi-res, screen space) ----------
  function hudMeter(ctx, m, { showNum = false, a = 1 } = {}) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = 'rgba(12,13,16,0.72)'; ctx.fillRect(60, 216, 860, showNum ? 260 : 166);
    ptext(ctx, 'SPREAD', 80, 236, 9, RED); ptext(ctx, 'REPORTED', 330, 236, 9, G5);
    px(ctx, 80, 300, 820, 64, G2); px(ctx, 86, 306, 808, 52, '#0f1013');
    const n = 20, sw = 808 / n; const fill = m * n;
    for (let i = 0; i < n; i++) { const f = L.clamp(fill - i, 0, 1); if (f > 0) px(ctx, 90 + i * sw, 310, (sw - 6) * f, 44, RED); }
    if (showNum) ptext(ctx, '230,000', 80, 384, 14, RED);
    ctx.restore();
  }
  function hudItems(ctx, t, a = 1) {
    if (a <= 0) return; const rows = [
      { ic: 'disk', name: 'PATCH', st: 'NOT APPLIED', on: true, at: 2.3 },
      { ic: 'mail', name: 'ALERT', st: 'UNREAD', on: true, at: 2.9 },
      { ic: 'key', name: 'OFF SWITCH', st: t >= tKill ? 'FOUND' : '???', on: t >= tKill, at: 3.5 }];
    rows.forEach((r, i) => { const y = 470 + i * 84, al = a * L.sm(r.at, r.at + 0.15, t); if (al <= 0) return;
      ctx.save(); ctx.globalAlpha = al; px(ctx, 80, y - 6, 60, 60, G1);
      const col = r.on ? GREEN : G3;
      if (r.ic === 'disk') disk(ctx, 86, y, 6); else if (r.ic === 'mail') { px(ctx, 86, y + 6, 48, 36, col); px(ctx, 92, y + 12, 36, 6, G1); }
      else { px(ctx, 86, y + 10, 18, 18, col); px(ctx, 104, y + 16, 30, 6, col); px(ctx, 122, y + 22, 6, 10, col); }
      const blink = r.name === 'OFF SWITCH' && t >= tKill && t < tKill + 1 && Math.floor(t * 8) % 2 === 0;
      ptext(ctx, r.name, 160, y + 2, 9, blink ? G7 : G6); ptext(ctx, r.st, 160 + r.name.length * 36 + 36, y + 2, 9, r.name === 'OFF SWITCH' && r.on ? GREEN : G4);
      ctx.restore(); });
  }

  // ---------- WORLD (design units; top-down pixel map) ----------
  const C = 30, COLS = 36, ROWS = 64, wr = L.rng(2017);
  const conts = [[300, 560, 230, 190], [700, 520, 240, 160], [540, 960, 260, 200], [260, 1250, 180, 230], [800, 1180, 200, 260], [560, 1480, 220, 130]];
  const land = [];
  for (let r = 0; r < ROWS; r++) for (let q = 0; q < COLS; q++) { const x = q * C + C / 2, y = r * C + C / 2;
    let v = 0; conts.forEach(([cx, cy, rx, ry]) => { v = Math.max(v, 1 - Math.hypot((x - cx) / rx, (y - cy) / ry)); });
    v += (L.noise(q * 0.45, 3) + L.noise(r * 0.45, 9) - 1) * 0.28; if (v > 0.08) land.push({ q, r, x: q * C, y: r * C }); }
  const cellAt = (x, y) => land.reduce((b, c) => Math.hypot(c.x + C / 2 - x, c.y + C / 2 - y) < Math.hypot(b.x + C / 2 - x, b.y + C / 2 - y) ? c : b);
  const HOSP = cellAt(555, 975), VENDOR = cellAt(700, 470), AGENCY = cellAt(500, 1060), KILLC = cellAt(250, 1300);
  // red order: many simultaneous seeds, jittered (red share of cells == meter at every zoom)
  const seeds = [cellAt(300, 560), cellAt(800, 1150), cellAt(560, 1480), cellAt(700, 560)];
  land.forEach(c => { const d = Math.min(...seeds.map(s => Math.hypot(s.x - c.x, s.y - c.y))); c.key = d / 400 + wr() * 0.9; });
  land.slice().sort((a, b) => a.key - b.key).forEach((c, i) => c.rank = (i + 0.5) / land.length);
  HOSP.rank = HOSP_RED; [VENDOR, AGENCY, KILLC].forEach(c => c.rank = 2);
  // 36 organisations (one is the hospital) with lognormal green arrival times
  const orgs = [HOSP]; const pool = land.filter(c => c.rank < 1.5 && c !== HOSP);
  while (orgs.length < 36) { const c = pool[Math.floor(wr() * pool.length)]; if (!orgs.includes(c) && orgs.every(o => Math.hypot(o.x - c.x, o.y - c.y) > 90)) orgs.push(c); }
  const qs = orgs.map((_, i) => (i + 0.5) / orgs.length); for (let i = qs.length - 1; i > 0; i--) { const j = Math.floor(wr() * (i + 1)); [qs[i], qs[j]] = [qs[j], qs[i]]; }
  const qH = qs.indexOf(qs.reduce((b, q) => Math.abs(q - 0.82) < Math.abs(b - 0.82) ? q : b)); [qs[0], qs[qH]] = [qs[qH], qs[0]];
  orgs.forEach((o, i) => { o.q = qs[i]; o.hum = Math.max(KILL, L.lognormalQuantile(o.q, MED, P90)); o.ai = L.lognormalQuantile(o.q, AIMED, AIP90); });
  function pline(ctx, x1, y1, x2, y2, f, w, col) { // stepped pixel line, drawn to fraction f
    const n = Math.max(1, Math.floor(Math.hypot(x2 - x1, y2 - y1) / w)); ctx.fillStyle = col;
    for (let i = 0; i <= n * f; i++) { const x = Math.round(L.lerp(x1, x2, i / n) / w) * w, y = Math.round(L.lerp(y1, y2, i / n) / w) * w; ctx.fillRect(x - w / 2, y - w / 2, w, w); } }
  function hospitalInterior(ctx, t, a) {
    if (a <= 0) return; const u = 1, x0 = HOSP.x, y0 = HOSP.y; ctx.save(); ctx.globalAlpha = a;
    px2(ctx, x0, y0, 30, 30, G3); px2(ctx, x0 + 1, y0 + 1, 28, 28, G2);
    px2(ctx, x0 + 1, y0 + 11, 28, 9, '#3a3d43');                                   // corridor
    for (let i = 0; i < 4; i++) { px2(ctx, x0 + 1 + i * 7, y0 + 1, 0.6, 10, G4); px2(ctx, x0 + 1 + i * 7, y0 + 20, 0.6, 9, G4); }
    px2(ctx, x0 + 1, y0 + 10.4, 28, 0.6, G4); px2(ctx, x0 + 1, y0 + 20, 28, 0.6, G4);
    for (let i = 0; i < 4; i++) { px2(ctx, x0 + 3 + i * 7, y0 + 4, 3, 2, G5); px2(ctx, x0 + 3.5 + i * 7, y0 + 4.5, 2, 1, t >= tHospRed ? RED : '#22262a'); }
    worker(ctx, WK.x, WK.y, 0.42, t < 9 ? 'tired' : 'alarm');
    ctx.restore(); }
  const px2 = (c, x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
  const WK = { x: HOSP.x + 12.9, y: HOSP.y + 11.4 };   // sprite top-left; face center ~ +2.1,+2.1
  function world(ctx, t, z = 1) {
    const LWd = L.clamp(6 / z, 0.5, 6);
    const h = hoursAt(t), m = meter(h);
    ctx.fillStyle = '#101216'; ctx.fillRect(-2000, -2000, 5080, 5920);
    land.forEach(c => { let col = G2; if (c.rank <= m) col = (c.q + c.r) % 2 ? RED : '#e0352b'; ctx.fillStyle = col; ctx.fillRect(c.x + 1, c.y + 1, C - 2, C - 2); });
    // organisations
    orgs.forEach(o => { const red = o.rank <= m; ctx.fillStyle = red ? '#7a2520' : G5; ctx.fillRect(o.x + 6, o.y + 6, 18, 18); ctx.fillStyle = red ? RED : G2; ctx.fillRect(o.x + 13, o.y + 9, 4, 12); ctx.fillRect(o.x + 9, o.y + 13, 12, 4); });
    // green lines: vendor -> each organisation, landing at its lognormal time
    orgs.forEach(o => { const f = L.clamp((h - (o.hum - 2)) / 2, 0, 1); if (f > 0) pline(ctx, VENDOR.x + 15, VENDOR.y + 15, o.x + 15, o.y + 15, f, LWd, GREEN);
      if (h >= o.hum) { ctx.strokeStyle = GREEN; ctx.lineWidth = Math.min(4, LWd); ctx.strokeRect(o.x + 3, o.y + 3, 24, 24); } });
    // alert agency -> hospital: tries, breaks (attention elsewhere)
    const tries = [[0.5, 0.45], [3.5, 0.7], [8.5, 0.35], [15, 0.6]];
    tries.forEach(([s, fmax]) => { const dt = h - s; if (dt > 0 && dt < 2.4) { const f = Math.min(fmax, dt / 1.4) * (dt > 1.8 ? 0 : 1); if (f > 0) pline(ctx, AGENCY.x + 15, AGENCY.y + 15, HOSP.x + 15, HOSP.y + 15, f, LWd * 0.7, '#2a8f58'); } });
    // fragment cells
    const pulse = h >= EPATCH && h < EPATCH + 3 ? 1 + 0.3 * Math.sin((h - EPATCH) * 6) : 1;
    [[VENDOR, 1], [AGENCY, 1], [KILLC, h >= KILL ? 1 : 0]].forEach(([c, on], i) => {
      ctx.fillStyle = on ? GREEN : G3; ctx.fillRect(c.x + 1, c.y + 1, C - 2, C - 2);
      if (on) { ctx.save(); ctx.globalAlpha = 0.25; const g = (i === 0 ? pulse : 1) * 14; ctx.fillRect(c.x - g, c.y - g, C + 2 * g, C + 2 * g); ctx.restore(); } });
    hospitalInterior(ctx, t, 1);
  }

  // ---------- cards ----------
  function card(ctx, lines, y, size, a) { if (a <= 0) return; L.title(ctx, lines, y, size, { alpha: a }); }
  const fade = (t, a, b, f = 0.2) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));
  function slate(ctx, s) { ctx.save(); ctx.fillStyle = 'rgba(12,13,16,0.7)'; ctx.fillRect(40, 1818, 560, 58); ctx.restore(); L.slate(ctx, s); }
  function scan(ctx, a = 0.12) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#000'; for (let y = 0; y < 1920; y += 6) ctx.fillRect(0, y, 1080, 2); ctx.restore(); }

  // ---------- snap panels ----------
  const SX0 = 100, SX1 = 980, SPAN = 168; const sxOf = h => SX0 + (SX1 - SX0) * Math.min(h, SPAN) / SPAN;
  function panel(ctx, y, title, sub, key, cursorH, a) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
    px(ctx, 80, y, 920, 470, '#1b1d22'); ctx.strokeStyle = G3; ctx.lineWidth = 6; ctx.strokeRect(83, y + 3, 914, 464);
    ptext(ctx, title, 110, y + 30, 10, G6); if (sub) ptext(ctx, sub, 110 + title.length * 40 + 30, y + 30, 10, G6);
    // day ticks (suns)
    for (let d = 0; d <= 7; d++) { const x = sxOf(d * 24); px(ctx, x - 3, y + 360, 6, 20, G4); if (d < 7) { px(ctx, x + 55, y + 398, 14, 14, G4); px(ctx, x + 58, y + 392, 8, 26, G4); px(ctx, x + 49, y + 401, 26, 8, G4); } }
    px(ctx, SX0, y + 368, SX1 - SX0, 4, G4);
    // same red: 0..24 h
    const rEnd = Math.min(cursorH, P24); if (rEnd > 0) px(ctx, SX0, y + 320, sxOf(rEnd) - SX0, 36, RED);
    // green pips (organisations) stacked by arrival
    orgs.forEach((o, i) => { const h = o[key]; if (h > cursorH) return; const x = Math.round((sxOf(h) - 8) / 6) * 6, yy = y + 200 + (i % 5) * 20; px(ctx, x, yy, 16, 16, GREEN); if (i === 0) { ctx.strokeStyle = G7; ctx.lineWidth = 4; ctx.strokeRect(x - 5, yy - 5, 26, 26); ptext(ctx, 'HIS', x + 30, yy - 12, 9, G7); } });
    // cursor
    if (cursorH < SPAN) px(ctx, sxOf(cursorH) - 2, y + 190, 4, 190, G6);
    ctx.restore();
  }
  function snap(ctx, t) {
    const lt = t - 17.4; ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    const cur = L.clamp((lt - 0.8) / 2.4, 0, 1) * SPAN;            // 1 s = 70 h, both panels share it
    const a = lt >= 0.5 ? 1 : 0;
    panel(ctx, 370, 'AS IT HAPPENED', null, 'hum', cur, a);
    panel(ctx, 870, 'ROUTED', null, 'ai', cur, a);
    ptext(ctx, 'ILLUSTRATIVE', 110, 870 + 92, 11, GREEN, 'left', a);
    // off switch marker in the human panel
    if (cur >= KILL) { const x = sxOf(KILL); ctx.save(); ctx.globalAlpha = a * L.sm(0, 0.3, (cur - KILL) / 70); px(ctx, x - 3, 370 + 84, 6, 236, G6); ptext(ctx, 'OFF SWITCH:', x + 16, 370 + 84, 9, GREEN); ptext(ctx, 'ONE PERSON, PARTLY LUCK', x + 16, 370 + 136, 9, G6); ctx.restore(); }
    card(ctx, ['At true proportions.'], 290, 84, fade(t, 18.2, 21.2));
    card(ctx, ['Same pieces.', 'Faster routing.'], 1440, 88, fade(t, 21.4, 25.4));
    if (lt >= 0.5 && lt < 0.9) { ctx.fillStyle = `rgba(230,230,226,${(1 - (lt - 0.5) / 0.4) * 0.5})`; ctx.fillRect(0, 0, 1080, 1920); }
  }

  // ---------- main ----------
  function draw(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    if (t < 2.0) {                                                 // SC1 cold open, hour 24
      const bob = Math.round(Math.sin(t * 3) * 1);
      corridor(lx, t, 10.4, bob, { allRed: true }); hand(lx, 104, 258 + bob); blit(ctx);
      if (t > 1.6) { const g = (t - 1.6) / 0.4; const r = L.rng(Math.floor(t * 30)); for (let i = 0; i < 14; i++) { const y = r() * 1920, hh = 20 + r() * 80; ctx.drawImage(ctx.canvas, 0, y, 1080, hh, (r() - 0.5) * 160 * g, y, 1080, hh); } }
      hudMeter(ctx, t < 1.6 ? 1 : 1 - (t - 1.6) / 0.4, { showNum: t < 1.6 });
      card(ctx, ['The patch shipped', '59 days ago.'], 1220, 104, 1 - L.sm(1.55, 1.7, t));
      if (t > 1.6) ptext(ctx, 'REWIND', 540, 900, 14, G7, 'center');
      scan(ctx); slate(ctx, 'SC1  POV  CLOSE  HOUR 24');
    } else if (t < 7.0) {                                          // SC2 POV walk
      const camZ = (t - 2) * 1.0, bob = Math.round(Math.sin(t * Math.PI * 3.2) * 2.2), sway = Math.round(Math.sin(t * Math.PI * 1.6) * 1.2);
      corridor(lx, t, camZ, bob, { sway }); hand(lx, 104 - sway, 262 + bob); blit(ctx);
      hudMeter(ctx, meter(hoursAt(t))); hudItems(ctx, t);
      if (t < 2.5) ptext(ctx, 'RUN START', 540, 900, 14, G7, 'center', 1 - L.sm(2.3, 2.5, t));
      card(ctx, ['Friday morning.'], 1260, 100, fade(t, 2.4, 3.8));
      card(ctx, ['The fix is', 'in an inbox.'], 1220, 100, fade(t, 3.9, 5.5));
      card(ctx, ['One stranger.', 'Partly luck.'], 1220, 100, fade(t, 5.65, 6.95));
      scan(ctx); slate(ctx, 'SC2  POV WALK  DOLLY FWD');
    } else if (t < 11.5) {                                         // SC3 spectator cam, crane up
      const f = L.ease.inOut(L.clamp((t - 7.4) / 3.4, 0, 1));
      const z = Math.exp(L.lerp(Math.log(34), Math.log(0.86), f));
      const fx = WK.x + 2.1 * 0.42 * 5, fy = WK.y + 0.42 * 9;
      const cx = L.lerp(fx, 540, L.sm(0.25, 1, f)), cy = L.lerp(fy, 960, L.sm(0.25, 1, f));
      ctx.save(); L.camera(ctx, [[0, [cx, cy, z, 0]]], 0); world(ctx, t, z); ctx.restore();
      hudMeter(ctx, meter(hoursAt(t)));
      card(ctx, ['Every piece', 'already existed.'], 1160, 96, fade(t, 7.5, 9.4));
      card(ctx, ['Nobody routed them.'], 1200, 96, fade(t, 9.6, 11.4));
      const la = L.sm(9.2, 9.5, t); ctx.save(); ctx.globalAlpha = la; px(ctx, 80, 420, 40, 40, RED); px(ctx, 80, 480, 40, 40, GREEN); ctx.restore();
      ctx.save(); ctx.globalAlpha = la * 0.72; px(ctx, 60, 404, 820, 136, '#0c0d10'); ctx.restore(); px(ctx, 80, 420, 40, 40, RED); px(ctx, 80, 480, 40, 40, GREEN); ptext(ctx, 'SPREAD', 140, 420, 9, G6, 'left', la); ptext(ctx, 'PIECES OF THE FIX', 140, 480, 9, G6, 'left', la);
      scan(ctx, 0.08); slate(ctx, t < 7.6 ? 'SC3  SPECTATOR CAM  HOLD' : 'SC3  CRANE UP  WIDE');
    } else if (t < 13.0) {                                         // SC4a POV, closer
      const camZ = 9.3 + (t - 11.5) * 1.0, bob = Math.round(Math.sin(t * Math.PI * 3.2) * 2.2);
      corridor(lx, t, camZ, bob); hand(lx, 104, 262 + bob); blit(ctx, L.lerp(1.0, 1.12, L.sm(11.5, 13, t)));
      hudMeter(ctx, meter(hoursAt(t))); hudItems(ctx, t);
      scan(ctx); slate(ctx, 'SC4  POV  DOLLY IN');
    } else if (t < 17.4) {                                         // SC4b terminal CU -> lights out -> freeze
      const tt = Math.min(t, 14.9);
      terminal(lx, tt, 'human'); hand(lx, 116, 268); blit(ctx, L.lerp(1.0, 1.08, L.sm(13, 14.9, tt)), 540, 900);
      if (t >= 14.25) { ctx.fillStyle = `rgba(8,9,11,${0.55 * L.sm(14.25, 14.7, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
      hudMeter(ctx, meter(hoursAt(tt)), { showNum: tt >= 14 });
      if (t >= 15) { ctx.fillStyle = `rgba(8,9,11,${0.5 * L.sm(15, 15.3, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
      card(ctx, ['We slowed it down', 'so you could see it.'], 1000, 92, fade(t, 15.2, 17.35));
      scan(ctx); slate(ctx, t < 15 ? 'SC4  EXTREME CLOSE  HOUR 24' : 'SC5  FREEZE');
    } else if (t < 25.5) {
      snap(ctx, t); scan(ctx, 0.06); slate(ctx, 'SC6  SNAP  FLAT');
    } else {                                                       // SC7 IN++: same hand, routed version
      const lt = t - 25.5, up = L.ease.inOut(L.clamp((lt - 0.2) / 0.8, 0, 1));
      terminal(lx, t, 'routed');
      if (t < 26.5) hand(lx, L.lerp(116, 62, up), L.lerp(268, 196, up)); else hand(lx, 62, L.lerp(214, 250, L.sm(26.6, 27.3, t)), false);
      blit(ctx, L.lerp(1.18, 1.3, L.sm(25.5, 31, t)), 540, 900);
      px(ctx, 60, 226, 560, 160, 'rgba(12,13,16,0.85)'); ptext(ctx, 'ROUTED', 80, 246, 10, G6); ptext(ctx, 'ILLUSTRATIVE', 80, 316, 10, GREEN);
      card(ctx, ['People still', 'apply the fix.'], 1330, 92, fade(t, 27.0, 28.9));
      card(ctx, ['This is', 'the bottleneck.'], 1330, 104, fade(t, 29.0, 31.3));
      scan(ctx); slate(ctx, 'SC7  POV  EXTREME CLOSE');
      if (t >= 31) L.endCard(ctx, L.sm(31, 31.4, t), { line: 'The bottleneck is us.' });
    }
  }

  return { draw, DUR,
    acts: [{ start: 0, end: 2, bpm: 0, drone: true }, { start: 2, end: 14.3, bpm: 150 }, { start: 2, end: 14.3, bpm: 0, drone: true },
      { start: 15.2, end: 17.4, bpm: 0, drone: true }, { start: 18.2, end: 25.5, bpm: 0, drone: true }, { start: 25.5, end: 35, bpm: 0, drone: true }],
    cues: [{ t: 1.6, type: 'whoosh' }, { t: tKill, type: 'ding' }, { t: 7.0, type: 'whoosh' }, { t: 14.0, type: 'stamp' }, { t: 17.9, type: 'hit' }, { t: 26.5, type: 'pop' }],
    _debug: { hosp: orgs[0].hum, frac24: orgs.filter(o => o.hum <= 24).length / orgs.length, aiMax: Math.max(...orgs.map(o => o.ai)), tKill, tHospRed } };
}
module.exports = makeScene;
