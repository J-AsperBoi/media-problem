// the-balcony: pov, shadow puppet, family. Analog: heatwave-2003.
// Mapping: race 1 s = 1 day (day = t - 1.4, days 0..19). Snap: 19 days in 4.5 s, same clock both lanes.
// Red extent E(d): L.logistic fitted through the sourced endpoints (0 at day 0, 1 at day 19) with its midpoint at the
// sourced peak (day 11.5): k = ln(99)/7.5, doubling 1.13 d, normalized. Green: two-sided lognormal from p10/median/p90.
// AI: ai_counterfactual.aggregation_median (3) with the same shape scaled 3/12, labeled illustrative. See output/the-balcony/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('heatwave-2003');
  const DUR = 40, RED = L.RED, GREEN = L.GREEN;
  const INK = '#141112', INK2 = '#221d1c', SC_L = '#e2d6c1', SC_M = '#bfb3a0', SC_E = '#7c7469';
  const rgbaR = a => `rgba(255,59,48,${a})`, rgbaG = a => `rgba(52,210,123,${a})`;

  // ---------- data ----------
  const pts = A.threat.points, D0 = pts[0].t, DEND = pts[pts.length - 1].t; // 0, 19
  const PEAK = 11.5; // sourced: daily excess > 1,000 on days 11 and 12
  const kk = Math.log(99) / (DEND - PEAK), DBL = Math.LN2 / kk, S0 = Math.exp(-kk * PEAK) / (1 + Math.exp(-kk * PEAK));
  const raw = d => L.logistic(d, DBL, S0), R0 = raw(D0), R1 = raw(DEND);
  const E = d => L.clamp((raw(d) - R0) / (R1 - R0), 0, 1);
  const AG = A.solution.aggregation, MED = AG.median, P10 = AG.p10, P90 = AG.p90;
  const SLO = Math.log(MED / P10) / 1.2816, SHI = Math.log(P90 / MED) / 1.2816;
  const zOf = q => { let lo = -8, hi = 8; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; (0.5 * (1 + L.erf(m / Math.SQRT2)) < q) ? lo = m : hi = m; } return (lo + hi) / 2; };
  const hq = q => { const z = zOf(q); return MED * Math.exp(z * (z < 0 ? SLO : SHI)); };
  const AIM = A.ai_counterfactual.aggregation_median, aq = q => hq(q) * AIM / MED;
  const QS = [0.2, 0.5, 0.8];
  const HUM = QS.map(hq), AIA = QS.map(aq); // 10.3 / 12 / 100.4 ; 2.6 / 3 / 25.1
  const DARK_AT = [0.1, 0.3, 0.5, 0.7, 0.9]; // E thresholds for rooms going dark (timing = curve; count symbolic)
  const T0 = 1.4, dayAt = t => t < T0 ? 13 : L.clamp(t - T0, 0, DEND);
  const NEIGH_OUT = d => E(d) >= 0.5;

  // ---------- helpers ----------
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r); };
  const fade = (t, a, b, f = 0.3) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));
  function card(c, lines, y, size, a, { col = '#fffdf7' } = {}) {
    if (a <= 0.001) return; c.save(); c.globalAlpha = a; c.textAlign = 'center'; let yy = y;
    lines.forEach((l, i) => { const o = typeof l === 'string' ? { text: l } : l; let fz = o.size || size; c.font = `${fz}px "${SERIF}"`;
      while (c.measureText(o.text).width > 790 && fz > 30) { fz -= 4; c.font = `${fz}px "${SERIF}"`; }
      if (i) yy += fz * 1.06; c.lineJoin = 'round'; c.lineWidth = fz * 0.16; c.strokeStyle = INK; c.strokeText(o.text, 490, yy);
      c.fillStyle = o.col || col; c.fillText(o.text, 490, yy); });
    c.restore();
  }
  function tag(c, text, x, y, size, a, { col = '#fffdf7', font = HAND, align = 'left' } = {}) {
    if (a <= 0.001) return; c.save(); c.globalAlpha = a; c.font = `${size}px "${font}"`; c.textAlign = align; c.lineJoin = 'round';
    c.lineWidth = size * 0.16; c.strokeStyle = INK; c.strokeText(text, x, y); c.fillStyle = col; c.fillText(text, x, y); c.restore();
  }
  function slate(c, s) { c.save(); c.fillStyle = 'rgba(20,17,18,0.6)'; c.fillRect(40, 1818, 600, 58); c.restore(); L.slate(c, s); }
  // backlit screen: warm gray, lamp hot spot, red tint by amount
  function screen(c, x, y, w, h, cx, cy, rad, redA, flick = 1) {
    const g = c.createRadialGradient(cx, cy, 0, cx, cy, rad);
    g.addColorStop(0, SC_L); g.addColorStop(0.55, SC_M); g.addColorStop(1, SC_E);
    c.fillStyle = g; c.fillRect(x, y, w, h);
    if (flick < 1) { c.fillStyle = `rgba(20,17,18,${(1 - flick).toFixed(3)})`; c.fillRect(x, y, w, h); }
    if (redA > 0) { c.fillStyle = rgbaR(redA); c.fillRect(x, y, w, h); }
  }
  const glow = (c, x, y, r, col, a) => { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col(a)); g.addColorStop(1, col(0)); c.fillStyle = g; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); };
  // lamp flicker marks each night (day boundary): brief dim
  const night = d => 1 - 0.28 * Math.exp(-Math.pow(((d % 1) + 1) % 1 - 0.95, 2) / 0.0015);

  // shadow puppet in profile: feet at (x,y); dir 1 = facing right. prop: 'phone' | 'bag' | 'list' | 'bottle' | null
  function puppet(c, x, y, s, { dir = 1, prop = null, tilt = 0, reach = 0, t = 0, seed = 0, hair = 'bun', green = 1 } = {}) {
    c.save(); c.translate(x, y); c.scale(dir * s, s); c.fillStyle = INK; c.strokeStyle = INK;
    const sway = Math.sin(t * 1.3 + seed) * 0.02; c.rotate(sway);
    // rod
    c.lineWidth = 2.2; c.globalAlpha = 0.6; c.beginPath(); c.moveTo(-6, -70); c.lineTo(-30, 70); c.stroke(); c.globalAlpha = 1;
    // legs
    c.fillRect(-11, -30, 8, 30); c.fillRect(3, -30, 8, 30);
    // skirt/coat
    c.beginPath(); c.moveTo(-16, -100); c.lineTo(16, -100); c.lineTo(24, -26); c.lineTo(-24, -26); c.closePath(); c.fill();
    // head (tilt = sorrow/weight)
    c.save(); c.translate(2, -112); c.rotate(tilt);
    c.beginPath(); c.arc(0, -14, 13, 0, 7); c.fill();
    c.beginPath(); c.moveTo(11, -18); c.lineTo(19, -10); c.lineTo(11, -7); c.fill(); // nose
    if (hair === 'bun') { c.beginPath(); c.arc(-12, -22, 7, 0, 7); c.fill(); }
    c.restore(); c.fillRect(-3, -106, 7, 8); // neck
    // arm to prop
    const ax = 10 + reach * 18, ay = -70 - reach * 16;
    c.lineWidth = 7; c.lineCap = 'round'; c.beginPath(); c.moveTo(4, -96); c.lineTo(ax, ay); c.stroke();
    if (prop === 'bottle') { c.fillRect(ax - 4, ay - 26, 12, 30); c.fillRect(ax - 1, ay - 32, 6, 7); }
    else if (prop) {
      c.save(); c.globalAlpha = green; glow(c, ax + 4, ay - 8, 34, rgbaG, 0.55); c.fillStyle = GREEN;
      if (prop === 'phone') rr(c, ax - 2, ay - 22, 12, 20, 3);
      else if (prop === 'bag') rr(c, ax - 6, ay - 4, 26, 18, 4);
      else rr(c, ax - 2, ay - 26, 18, 24, 2);
      c.fill(); c.restore();
    }
    c.restore();
  }
  // green line from a holder toward a target; before its arrival day it reaches part way and snaps back.
  function reachLine(c, x1, y1, x2, y2, d, arrive, seed, w = 5) {
    if (d >= arrive) { c.save(); c.strokeStyle = GREEN; c.lineWidth = w; c.lineCap = 'round'; glowLine(c, x1, y1, x2, y2, w); c.restore(); return 1; }
    const per = 1.6 + (seed % 3) * 0.35, ph = ((d + seed * 0.53) % per) / per; // attempt rhythm (vibe; arrival days are data)
    const f = L.sm(0, 0.7, ph) * (0.35 + 0.35 * ((seed * 7) % 5) / 5), brk = L.sm(0.72, 0.8, ph);
    if (f <= 0.01) return 0; const ex = L.lerp(x1, x2, f), ey = L.lerp(y1, y2, f);
    c.save(); c.globalAlpha = 1 - brk; c.strokeStyle = GREEN; c.lineCap = 'round'; c.lineWidth = w;
    c.setLineDash([w * 3, w * 2]); c.beginPath(); c.moveTo(x1, y1); c.lineTo(ex, ey); c.stroke(); c.setLineDash([]);
    if (brk > 0) { c.fillStyle = GREEN; for (let k = 0; k < 3; k++) { c.beginPath(); c.arc(ex + (k - 1) * w * 2 * brk, ey + brk * 30 * (k + 1), w * 0.6, 0, 7); c.fill(); } }
    c.restore(); return 0;
  }
  function glowLine(c, x1, y1, x2, y2, w) {
    c.save(); c.strokeStyle = rgbaG(0.25); c.lineWidth = w * 4; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke();
    c.strokeStyle = GREEN; c.lineWidth = w; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); c.restore();
  }

  // ---------- world: the building as a shadow-puppet screen ----------
  const BX0 = 120, BX1 = 960, BY0 = 330, GROUND = 1720, FH = 270;
  const lvlTop = i => GROUND - (i + 1) * FH;
  const rooms = []; // {lvl, side, x, y, w, h, holder, dark}
  for (let i = 0; i < 5; i++) for (const side of [0, 1]) rooms.push({ lvl: i, side, x: side ? 630 : 150, y: lvlTop(i) + 22, w: 300, h: FH - 44 });
  const room = (lvl, side) => rooms.find(r => r.lvl === lvl && r.side === side);
  // dark order (top floors first); neighbor = level 4 right = 0.5
  [[4, 0, 0], [3, 1, 1], [4, 1, 2], [3, 0, 3], [2, 1, 4]].forEach(([l, s, k]) => room(l, s).dark = DARK_AT[k]);
  const NB = room(4, 1); NB.neighbor = true;
  const HOLD = [ // quantile order: doctor 0.2, daughter 0.5, clerk 0.8
    { r: room(0, 0), prop: 'bag', name: 'doctor', seed: 1 },
    { r: room(2, 0), prop: 'phone', name: 'daughter', seed: 2 },
    { r: room(1, 1), prop: 'list', name: 'clerk', seed: 3 }];
  HOLD.forEach((h, i) => { h.r.holder = h; h.arrive = HUM[i]; h.px = h.r.x + (h.r.side ? 110 : 190); h.py = h.r.y + h.r.h - 8; });
  const DOOR = { x: 612, y: lvlTop(4) + 150, w: 18, h: 98 }; // on the fourth landing
  const rngF = L.rng(5); const furn = rooms.map(() => ({ a: rngF(), b: rngF(), c: rngF() }));

  function drawWorld(c, d, t) {
    const e = E(d), redLine = BY0 + e * (GROUND - BY0);
    screen(c, -700, -700, 2480, 3400, 540, 900, 1500, 0, night(d));
    // heat from above: red wash down to redLine
    const g = c.createLinearGradient(0, -700, 0, redLine + 60); g.addColorStop(0, rgbaR(0.5 + 0.45 * e)); g.addColorStop(0.85, rgbaR(0.25 + 0.3 * e)); g.addColorStop(1, rgbaR(0));
    c.fillStyle = g; c.fillRect(-700, -700, 2480, redLine + 760);
    glow(c, 540, 120, 380, rgbaR, 0.35 + 0.6 * e); c.fillStyle = rgbaR(0.55 + 0.45 * e); c.beginPath(); c.arc(540, 120, 90, 0, 7); c.fill();
    // building
    c.fillStyle = INK; c.fillRect(BX0, BY0, BX1 - BX0, GROUND - BY0); c.fillRect(-700, GROUND, 2480, 1200);
    c.beginPath(); c.moveTo(BX0 - 20, BY0); c.lineTo(540, BY0 - 90); c.lineTo(BX1 + 20, BY0); c.fill();
    // balcony (neighbor)
    c.fillRect(BX1, NB.y + NB.h - 12, 70, 12); for (let k = 0; k < 5; k++) c.fillRect(BX1 + 6 + k * 14, NB.y + NB.h - 70, 4, 60); c.fillRect(BX1, NB.y + NB.h - 74, 70, 6);
    // stairwell
    for (let i = 0; i < 5; i++) {
      const y0 = lvlTop(i) + 10, y1 = lvlTop(i) + FH - 10; screen(c, 470, y0, 140, y1 - y0, 540, (y0 + y1) / 2, 200, 0, 0.72 * night(d));
      if (y0 < redLine) { c.fillStyle = rgbaR(0.3 * L.clamp((redLine - y0) / FH, 0, 1)); c.fillRect(470, y0, 140, y1 - y0); }
      c.fillStyle = INK; c.beginPath(); c.moveTo(470, y1); for (let s = 0; s <= 8; s++) { const sx = 470 + s * 16, sy = y1 - s * 26; c.lineTo(sx, sy); c.lineTo(sx + 16, sy); } c.lineTo(610, y1); c.fill();
      c.fillRect(470, y1 - 8, 140, 10);
    }
    // rooms
    rooms.forEach((r, i) => {
      const out = r.dark !== undefined && e >= r.dark, fo = r.dark !== undefined ? L.clamp((e - r.dark) / 0.03, 0, 1) : 0;
      screen(c, r.x, r.y, r.w, r.h, r.x + r.w * 0.5, r.y + r.h * 0.35, r.w * 0.9, 0, night(d));
      if (r.y < redLine) { c.fillStyle = rgbaR(0.42 * L.clamp((redLine - r.y) / r.h, 0, 1)); c.fillRect(r.x, r.y, r.w, r.h); }
      const f = furn[i]; c.fillStyle = INK;
      // window with curtain, lamp, chair or table
      c.fillRect(r.x + (r.side ? r.w - 70 : 20), r.y + 40, 50, 90); c.fillStyle = SC_L; c.fillRect(r.x + (r.side ? r.w - 64 : 26), r.y + 46, 38, 78);
      if (r.y < redLine) { c.fillStyle = rgbaR(0.7); c.fillRect(r.x + (r.side ? r.w - 64 : 26), r.y + 46, 38, 78); }
      c.fillStyle = INK; const lx = r.x + 60 + f.a * 150; c.fillRect(lx, r.y + r.h - 110, 4, 110); c.beginPath(); c.moveTo(lx - 16, r.y + r.h - 110); c.lineTo(lx + 20, r.y + r.h - 110); c.lineTo(lx + 12, r.y + r.h - 138); c.lineTo(lx - 8, r.y + r.h - 138); c.fill();
      if (!r.holder) { const cx = r.x + (r.side ? 70 : 180) + f.b * 40; c.fillRect(cx, r.y + r.h - 60, 60, 12); c.fillRect(cx, r.y + r.h - 110, 12, 110); c.fillRect(cx + 48, r.y + r.h - 50, 10, 50); c.fillRect(cx + 4, r.y + r.h - 50, 8, 50); }
      if (r.neighbor) { c.fillRect(r.x + 120, r.y + r.h - 14, 90, 14); } // rug/threshold
      if (fo > 0) { c.fillStyle = `rgba(22,18,18,${(0.9 * fo).toFixed(3)})`; c.fillRect(r.x, r.y, r.w, r.h); }
    });
    // light under the neighbor's door (landing side)
    const lit = 1 - L.clamp((e - 0.5) / 0.03, 0, 1);
    c.fillStyle = INK2; c.fillRect(DOOR.x, DOOR.y, DOOR.w, DOOR.h);
    if (lit > 0) { c.fillStyle = `rgba(245,232,200,${lit})`; c.fillRect(DOOR.x - 2, DOOR.y + DOOR.h - 5, DOOR.w + 4, 5); glow(c, DOOR.x + 6, DOOR.y + DOOR.h, 24, a => `rgba(245,232,200,${a})`, 0.6 * lit); }
    // holders and their lines toward the door
    HOLD.forEach(h => {
      reachLine(c, h.px + (h.r.side ? 14 : 20), h.py - 80, DOOR.x, DOOR.y + 60, d, h.arrive, h.seed, 5);
      puppet(c, h.px, h.py, 1.05, { dir: h.r.side ? -1 : 1, prop: h.prop, tilt: h.prop === 'phone' ? 0.25 : 0.1, reach: d >= h.arrive ? 1 : 0.4, t, seed: h.seed, hair: h.prop === 'bag' ? 'none' : 'bun' });
    });
    // you, on the fourth landing
    puppet(c, 560, lvlTop(4) + FH - 18, 0.95, { dir: 1, prop: 'bottle', tilt: 0.2, reach: 0.6, t, seed: 9 });
  }

  // ---------- POV layers (screen space, full-frame) ----------
  function courtyard(c, x, y, w, h, d) {
    const e = E(d); screen(c, x, y, w, h, x + w / 2, y + h * 0.2, h, 0);
    c.fillStyle = rgbaR(0.35 + 0.6 * e); c.fillRect(x, y, w, h);
    glow(c, x + w * 0.7, y + h * 0.18, w * 0.7, rgbaR, 0.6 + 0.4 * e);
    // opposite wing: silhouette with lit windows; three hold green
    c.fillStyle = INK; c.fillRect(x, y + h * 0.36, w, h);
    const W = [[0.12, 0.44, 0], [0.5, 0.44, -1], [0.12, 0.62, 1], [0.5, 0.62, -1], [0.12, 0.8, -1], [0.5, 0.8, 2]];
    W.forEach(([fx, fy, hi]) => { const wx = x + w * fx, wy = y + h * fy, ww = w * 0.3, wh = h * 0.12;
      screen(c, wx, wy, ww, wh, wx + ww / 2, wy + wh / 2, ww, 0, night(d) * 0.9);
      if (hi >= 0) { const px = wx + ww * 0.5, py = wy + wh; glow(c, px + 8, py - wh * 0.55, ww * 0.45, rgbaG, 0.55);
        c.fillStyle = INK; c.beginPath(); c.arc(px, py - wh * 0.72, wh * 0.14, 0, 7); c.fill(); c.fillRect(px - wh * 0.14, py - wh * 0.56, wh * 0.28, wh * 0.56);
        c.fillStyle = GREEN; c.fillRect(px + wh * 0.16, py - wh * 0.6, wh * 0.16, wh * 0.22); } });
    // mullions
    c.fillStyle = INK; c.fillRect(x + w / 2 - 7, y, 14, h); c.fillRect(x, y + h * 0.33, w, 12);
  }
  // your forearm + hand as clean shapes; kind: 'fist' | 'palm' | 'bottle'
  function arm(c, x0, y0, x1, y1, kind, k = 1) {
    c.save(); c.fillStyle = INK; c.strokeStyle = INK; c.lineCap = 'round'; c.shadowColor = 'rgba(245,228,196,0.85)'; c.shadowBlur = 26;
    c.lineWidth = 92 * k; c.beginPath(); c.moveTo(x0, y0); c.lineTo(x1, y1); c.stroke();
    const ang = Math.atan2(y1 - y0, x1 - x0); c.translate(x1, y1); c.rotate(ang);
    if (kind === 'fist') { rr(c, -10 * k, -52 * k, 104 * k, 104 * k, 30 * k); c.fill(); rr(c, 20 * k, -70 * k, 50 * k, 34 * k, 16 * k); c.fill(); }
    else if (kind === 'palm') { rr(c, -10 * k, -56 * k, 110 * k, 112 * k, 26 * k); c.fill(); for (let f = 0; f < 4; f++) { rr(c, 80 * k, (-50 + f * 28) * k, 90 * k - Math.abs(f - 1.4) * 14 * k, 24 * k, 12 * k); c.fill(); } rr(c, 10 * k, -86 * k, 70 * k, 30 * k, 15 * k); c.fill(); }
    else { rr(c, -10 * k, -50 * k, 90 * k, 100 * k, 28 * k); c.fill(); }
    c.restore();
  }
  function bottle(c, x, y, k = 1) {
    c.save(); c.fillStyle = 'rgba(20,17,18,0.62)'; rr(c, x - 40 * k, y - 230 * k, 80 * k, 230 * k, 18 * k); c.fill();
    c.fillStyle = INK; c.fillRect(x - 18 * k, y - 270 * k, 36 * k, 44 * k); c.fillStyle = 'rgba(226,214,193,0.35)'; c.fillRect(x - 34 * k, y - 150 * k, 68 * k, 6 * k); c.restore();
  }
  function povDoor(c, d, t, { k = 1, hand = 'fist', threads = false, knot = 0 } = {}) {
    const e = E(d); c.save(); c.translate(540, 960); c.scale(k, k); c.translate(-540, -960);
    screen(c, -200, -200, 1480, 2320, 420, 700, 1300, 0.12 + 0.3 * e, night(d));
    courtyard(c, 70, 330, 380, 700, d);
    c.fillStyle = INK; c.fillRect(56, 318, 408, 14); c.fillRect(56, 1026, 408, 18); c.fillRect(56, 318, 14, 720); c.fillRect(450, 318, 14, 720);
    // floor
    c.fillStyle = INK; c.fillRect(-200, 1690, 1480, 600); c.fillStyle = 'rgba(191,179,160,0.12)'; for (let i = 0; i < 6; i++) c.fillRect(-200, 1720 + i * 70, 1480, 3);
    // door
    c.fillStyle = INK; c.fillRect(500, 250, 520, 1440); c.fillStyle = INK2; c.fillRect(540, 290, 440, 1390);
    c.strokeStyle = 'rgba(191,179,160,0.14)'; c.lineWidth = 4; c.strokeRect(590, 350, 340, 560); c.strokeRect(590, 990, 340, 600);
    c.fillStyle = INK; c.beginPath(); c.arc(610, 1000, 22, 0, 7); c.fill(); c.fillStyle = 'rgba(191,179,160,0.3)'; c.beginPath(); c.arc(610, 1000, 10, 0, 7); c.fill();
    c.fillStyle = 'rgba(191,179,160,0.25)'; rr(c, 720, 560, 80, 22, 6); c.fill(); // name slot, blank
    const lit = 1 - L.clamp((e - 0.5) / 0.03, 0, 1);
    if (lit > 0) { c.fillStyle = `rgba(245,232,200,${lit})`; c.fillRect(540, 1672, 440, 12); glow(c, 760, 1690, 260, a => `rgba(245,232,200,${a})`, 0.45 * lit); }
    // threads: holders' lines arriving from the left (after arrival day), or still breaking
    if (threads) {
      const tgt = [860, 930];
      HOLD.forEach((h, i) => {
        const sy = [760, 1200, 1500][i];
        if (d >= h.arrive || knot > 0) glowLine(c, -200, sy, L.lerp(tgt[0], 730, knot) - 20 + i * 20, L.lerp(tgt[1] + (i - 1) * 40, 900, knot), 7);
        else reachLine(c, -200, sy, tgt[0], tgt[1], d, h.arrive, h.seed, 7);
      });
    }
    // hands
    if (hand === 'fist') {
      const ph = ((d % 1) + 1) % 1, tap = ph < 0.4 ? Math.max(0, Math.sin(ph / 0.4 * Math.PI * 3)) : 0;
      arm(c, 260, 2100, 690 + tap * 26, 1020 - tap * 10, 'fist');
    } else if (hand === 'palm') arm(c, 380, 2150, 720, 930, 'palm', 1.05);
    bottle(c, 330, 1880); arm(c, 120, 2150, 300, 1780, 'bottle');
    if (knot > 0) { glow(c, 730, 900, 200, rgbaG, 0.75 * knot); c.fillStyle = rgbaG(0.9 * knot); c.beginPath(); c.arc(730, 900, 22, 0, 7); c.fill(); }
    c.restore();
  }
  function povClimb(c, d, t, p) { // p: flights climbed 0..4
    const e = E(d), f = ((p % 1) + 1) % 1, bob = Math.sin(p * Math.PI * 2 * 8) * 14;
    c.save(); c.translate(0, bob);
    screen(c, -100, -100, 1280, 2120, 540, 700, 1300, 0.08 + 0.3 * e, night(d));
    // landing window sliding past (one per flight)
    const wy = -1500 + f * 2600; courtyard(c, 90, wy, 360, 620, d);
    c.fillStyle = INK; c.fillRect(76, wy - 12, 388, 14); c.fillRect(76, wy + 620, 388, 16); c.fillRect(76, wy - 12, 14, 640); c.fillRect(450, wy - 12, 14, 640);
    // stairs: steps rising to the upper right, scrolling toward you
    const step = 150, off = (p * 8 % 1) * step;
    c.fillStyle = INK; for (let s = -1; s < 12; s++) { const y = 1920 - s * step + off, x0 = 260 + s * 40; c.fillRect(x0, y - 26, 1200, 26); c.fillStyle = 'rgba(20,17,18,0.55)'; c.fillRect(x0, y, 1200, step - 26); c.fillStyle = INK; }
    // banister: diagonal rail + balusters
    c.strokeStyle = INK; c.lineWidth = 26; c.lineCap = 'round'; c.beginPath(); c.moveTo(1150, 2000); c.lineTo(820, 420); c.stroke();
    c.lineWidth = 12; for (let s = 0; s < 12; s++) { const q = ((s + (p * 8 % 1)) / 12); const bx = L.lerp(1150, 820, q), by = L.lerp(2000, 420, q); c.beginPath(); c.moveTo(bx, by); c.lineTo(bx + 30, by + 360 - q * 200); c.stroke(); }
    c.restore();
    // your hand with the water, swinging with each step
    const sw = Math.sin(p * Math.PI * 2 * 4) * 30; bottle(c, 470 + sw, 1900); arm(c, 280, 2200, 450 + sw, 1810, 'bottle');
  }

  // ---------- snap panel ----------
  function panel(c, y0, title, sub, arr, med, clk, a, labA) {
    const x0 = 70, W = 920, H = 520; c.save(); c.globalAlpha = a;
    c.fillStyle = INK; rr(c, x0 - 8, y0 - 8, W + 16, H + 16, 16); c.fill(); screen(c, x0, y0, W, H, x0 + W / 2, y0 + H / 2, W * 0.7, 0);
    // mini building
    const bx = 100, by = y0 + 140, bw = 250, bh = 350, e = E(clk), redY = by + e * bh;
    c.fillStyle = INK; c.fillRect(bx, by, bw, bh);
    for (let i = 0; i < 5; i++) for (let s = 0; s < 2; s++) { const rx = bx + 14 + s * 124, ry = by + 10 + i * 68; screen(c, rx, ry, 98, 54, rx + 49, ry + 29, 80, ry < redY ? 0.5 : 0); }
    const door = [bx + 125, by + 60], hp = [[bx + 60, by + 300], [bx + 60, by + 180], [bx + 190, by + 240]];
    hp.forEach(([hx, hy], i) => { if (clk >= arr[i]) glowLine(c, hx, hy, door[0], door[1], 5); else reachLine(c, hx, hy, door[0], door[1], clk * 6, 1e9, i + 1, 4);
      glow(c, hx, hy, 26, rgbaG, 0.6); c.fillStyle = GREEN; c.beginPath(); c.arc(hx, hy, 9, 0, 7); c.fill(); });
    // chart: red extent curve E(d), same in both lanes; green marker at the plan (median)
    const cx0 = 400, cx1 = 950, cy0 = y0 + 170, cy1 = y0 + H - 50, X = dd => L.lerp(cx0, cx1, dd / DEND), Y = v => L.lerp(cy1, cy0, v);
    c.strokeStyle = 'rgba(20,17,18,0.6)'; c.lineWidth = 3; c.beginPath(); c.moveTo(cx0, cy0); c.lineTo(cx0, cy1); c.lineTo(cx1, cy1); c.stroke();
    c.fillStyle = rgbaR(0.85); c.beginPath(); c.moveTo(X(0), Y(0)); for (let dd = 0; dd <= clk + 1e-6; dd += 0.1) c.lineTo(X(dd), Y(E(dd))); c.lineTo(X(clk), Y(0)); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(20,17,18,0.5)'; c.setLineDash([8, 8]); c.lineWidth = 3; c.beginPath(); c.moveTo(X(PEAK), cy0 - 10); c.lineTo(X(PEAK), cy1); c.stroke(); c.setLineDash([]);
    tag(c, 'peak', X(PEAK) - 8, cy0 - 20, 44, 1, { col: '#e8e4da', align: 'right' });
    if (clk >= med) { c.fillStyle = GREEN; c.fillRect(X(med) - 5, cy0 - 30, 10, cy1 - cy0 + 30); glow(c, X(med), cy1 - 40, 60, rgbaG, 0.5); }
    // clock hand along the axis
    c.fillStyle = INK; c.beginPath(); c.moveTo(X(clk), cy1 + 4); c.lineTo(X(clk) - 12, cy1 + 26); c.lineTo(X(clk) + 12, cy1 + 26); c.fill();
    tag(c, title, 100, y0 + 70, 62, 1, { font: SERIF });
    tag(c, sub, 100, y0 + 124, 48, labA, { col: GREEN });
    c.restore();
  }

  // ---------- camera for the pull-out ----------
  const CAM = [[11.0, [560, 560, 6, 0]], [12.4, [560, 640, 2.6, 0]], [15.2, [540, 1010, 0.9, 0]], [16.0, [540, 1010, 0.9, 0]], [17.6, [600, 610, 7.5, 0]]];

  function draw(c, t) {
    c.fillStyle = INK; c.fillRect(0, 0, 1080, 1920);
    const d = dayAt(t);
    if (t < T0) {
      povDoor(c, 13, t, { k: 1.05 });
      card(c, ['POV: she still', "hasn't answered."], 250, 96, 1);
      slate(c, 'SC1  CLOSE  POV  (flash-forward)');
      if (t > 1.2) { c.fillStyle = `rgba(20,17,18,${L.sm(1.2, 1.4, t)})`; c.fillRect(0, 0, 1080, 1920); }
    } else if (t < 11.0) {
      const doorA = L.sm(5.8, 6.4, t);
      if (doorA < 1) povClimb(c, d, t, 4 * L.sm(T0, 6.2, t) ** 0.9);
      if (doorA > 0) { c.save(); c.globalAlpha = doorA; povDoor(c, d, t, { k: L.lerp(1, 1.08, L.sm(6.2, 11, t)) }); c.restore(); }
      if (t < 1.7) { c.fillStyle = `rgba(20,17,18,${1 - L.sm(1.4, 1.7, t)})`; c.fillRect(0, 0, 1080, 1920); }
      card(c, ['Four flights.', 'Every morning.'], 260, 100, fade(t, 1.8, 3.8));
      card(c, ['Water for the', 'woman upstairs.'], 260, 100, fade(t, 4.0, 6.0));
      card(c, ['She never opens', 'the door.'], 260, 100, fade(t, 6.5, 8.6));
      card(c, ['Other people', 'knew, too.', ], 260, 100, fade(t, 8.9, 11.0));
      slate(c, t < 6.2 ? 'SC2  POV WALK  UP' : 'SC3  POV  DOOR  PUSH IN');
    } else if (t < 17.6) {
      c.save(); L.camera(c, CAM, t); drawWorld(c, d, t); c.restore();
      const povA = 1 - L.sm(11.0, 11.8, t);
      if (povA > 0) { c.save(); c.globalAlpha = povA; povDoor(c, d, t, { k: 1.08 }); c.restore(); }
      const inA = L.sm(17.0, 17.6, t);
      if (inA > 0) { c.save(); c.globalAlpha = inA; povDoor(c, d, t, { k: 1.3, hand: 'palm', threads: true }); c.restore(); }
      card(c, ['Every piece was', 'in the building.'], 250, 92, fade(t, 12.0, 14.2));
      card(c, ['In separate rooms.'], 250, 96, fade(t, 14.3, 16.3));
      slate(c, t < 15.2 ? 'SC4  PULL OUT  CRANE UP' : t < 16.0 ? 'SC4  WIDE  HOLD' : 'SC5  DROP DOWN');
    } else if (t < 23.0) {
      povDoor(c, d, t, { k: L.lerp(1.3, 1.4, L.sm(17.6, 20.4, t)), hand: 'palm', threads: true });
      if (t > 20.4) { c.fillStyle = `rgba(20,17,18,${0.6 * L.sm(20.4, 20.8, t)})`; c.fillRect(0, 0, 1080, 1920); }
      card(c, ['Nobody put', 'them together.'], 260, 100, fade(t, 17.8, 20.2));
      card(c, ['We slowed it down', 'so you could see it.'], 700, 96, fade(t, 20.6, 22.9));
      slate(c, 'SC5  CLOSE+  POV');
    } else if (t < 23.6) {
      c.fillStyle = INK; c.fillRect(0, 0, 1080, 1920);
    } else if (t < 31.5) {
      const clk = DEND * L.clamp((t - 24.0) / 4.5, 0, 1), a = L.sm(23.6, 23.9, t);
      tag(c, 'Same days. Full speed.', 490, 262, 56, a, { font: SERIF, align: 'center' });
      panel(c, 300, 'People', 'plan: day 12', HUM, HUM[1], clk, a, L.sm(0, 0.3, clk - HUM[1]));
      panel(c, 900, 'Frontier AI', 'day 3 · illustrative', AIA, AIA[1], clk, a, L.sm(0, 0.3, clk - AIA[1]));
      tag(c, 'after the peak', 490, 866, 48, fade(t, 28.8, 31.5), { align: 'center', col: '#fffdf7' });
      tag(c, 'before the peak', 490, 1476, 48, fade(t, 28.8, 31.5), { align: 'center', col: '#fffdf7' });
      tag(c, 'illustrative', 900, 970, 48, a, { align: 'right', col: '#e8e4da' });
      slate(c, 'SC6  SNAP  WIDE SPLIT');
      if (t > 31.2) { c.fillStyle = `rgba(20,17,18,${L.sm(31.2, 31.5, t)})`; c.fillRect(0, 0, 1080, 1920); }
    } else {
      const knot = L.sm(31.8, 33.0, t);
      povDoor(c, DEND, t, { k: L.lerp(1.45, 1.55, L.sm(31.5, 35.8, t)), hand: 'palm', threads: true, knot });
      c.fillStyle = `rgba(20,17,18,${0.35 * L.sm(32.4, 33.0, t)})`; c.fillRect(0, 0, 1080, 1920);
      card(c, ['This is the', 'bottleneck.'], 1250, 130, fade(t, 32.8, 35.8, 0.35));
      slate(c, 'SC7  CLOSE++  POV');
      if (t < 31.8) { c.fillStyle = `rgba(20,17,18,${1 - L.sm(31.5, 31.8, t)})`; c.fillRect(0, 0, 1080, 1920); }
    }
    if (t >= 35.8) L.endCard(c, L.sm(35.8, 36.2, t), { line: 'The bottleneck is us.' });
    L.grain(c, t, { alpha: 0.05, n: 500 });
  }

  return { draw, DUR,
    acts: [{ start: 0, end: 23.0, bpm: 0, drone: true }, { start: 23.6, end: 31.5, bpm: 0, drone: true }, { start: 31.5, end: 40, bpm: 0, drone: true }],
    cues: [{ t: 0.15, type: 'bonk' }, { t: 1.4, type: 'whoosh' }, { t: 7.5, type: 'bonk' }, { t: 11.0, type: 'whoosh' }, { t: 16.0, type: 'whoosh' },
      { t: 23.6, type: 'hit' }, { t: 24.0 + 4.5 * AIA[1] / DEND, type: 'ding' }, { t: 24.0 + 4.5 * HUM[1] / DEND, type: 'pop' }, { t: 32.8, type: 'hit' }] };
}
if (typeof module !== 'undefined') module.exports = makeScene;
