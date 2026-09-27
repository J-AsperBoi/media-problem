// seven-minutes: ticking-clock, isometric, machine. Analog: blackout-2003.
// One mapping: race t = 1..17 s, event hours h = (t - 1) * 0.125  (1 film second = 7.5 minutes).
// Red: first verified line trip at h = 0.85; cascade = L.logistic fitted through extent 0.01 @ 1.87 and 0.99 @ 1.98 (doubling 0.0083 h).
// Green: analog fragment ready_at times (brightness = attention); phone-line connections at L.lognormalQuantile(q, 1.5, 1.83).
// Snap: ai_counterfactual.aggregation_median 0.25 h vs human median 1.5 h, labeled illustrative. See output/seven-minutes/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('blackout-2003');
  const DUR = 38, RED = L.RED, GREEN = L.GREEN;
  const BG = '#10151c', INK = '#c3cad2', DIM = '#6b7581';

  // ---------- time mapping ----------
  const HPS = 0.125, T0 = 1.0;
  const hAt = t => t < T0 ? 2.0 : Math.min(2.0, (t - T0) * HPS);   // cold open = flash-forward to the end state
  const tOf = h => T0 + h / HPS;

  // ---------- threat ----------
  const TRIP = A.threat.points.find(p => p.t === 0.85).t;          // verified first trip (s6)
  const C0 = 1.87, C1 = 1.98;                                       // analog endpoints (motion only, never on screen)
  const DOUBLING = (C1 - C0) * Math.LN2 / Math.log(9801);          // fit: 0.01 -> 0.99 over C1 - C0
  const extent = h => h < C0 ? 0 : Math.min(1, L.logistic(h - C0, DOUBLING, 0.01) / L.logistic(C1 - C0, DOUBLING, 0.01));

  // ---------- green ----------
  const FR = {}; A.solution.fragments.forEach(f => FR[f.id] = f.ready_at);
  const AG = A.solution.aggregation, AI = A.ai_counterfactual.aggregation_median;
  const PAIRS = [['D', 'C'], ['D', 'A'], ['B', 'C'], ['C', 'A'], ['B', 'D'], ['D', 'A']];
  const CALLS = PAIRS.map((p, i) => ({ a: p[0], b: p[1], h: L.lognormalQuantile((i + 0.5) / PAIRS.length, AG.median, AG.p90) }));
  CALLS.forEach(c => c.t = tOf(c.h));
  const GROW = 0.35, HOLD = 0.9, DROP = 0.6;

  // ---------- local room geometry (authored at full frame; placed in the world at scale K) ----------
  const S = 600, WH = 820, OX = 540, OY = 1150, K = 0.11;
  const P = (x, y, z = 0) => [OX + (x - y) * 0.866, OY + (x + y) * 0.5 - z];
  const ROOMS = { A: [540, 1170], B: [282, 1000], C: [540, 792], D: [798, 1000] };
  const originOf = id => [ROOMS[id][0] - 540 * K, ROOMS[id][1] - 1040 * K];
  const toWorld = (id, lx, ly) => { const o = originOf(id); return [o[0] + lx * K, o[1] + ly * K]; };

  // ---------- region plate ----------
  const W = (gx, gy) => [540 + (gx - gy) * 480, 690 + (gx + gy) * 277];
  const rng = L.rng(2003);
  const towns = [];
  const nearRoom = (x, y) => Object.values(ROOMS).some(([rx, ry]) => Math.abs(x - rx) < 80 && y > ry - 125 && y < ry + 95);
  for (let tries = 0; towns.length < 46 && tries < 3000; tries++) {
    const gx = 0.06 + rng() * 0.88, gy = 0.06 + rng() * 0.88; const [x, y] = W(gx, gy);
    if (nearRoom(x, y)) continue; if (towns.some(o => Math.hypot(o.x - x, o.y - y) < 62)) continue;
    const blocks = []; const nb = 2 + Math.floor(rng() * 4);
    for (let b = 0; b < nb; b++) { const bx = (rng() - 0.5) * 30, by = (rng() - 0.5) * 16, w = 5 + rng() * 5, hgt = 8 + rng() * 22; const win = [];
      const nw = 2 + Math.floor(rng() * 4); for (let k = 0; k < nw; k++) win.push([rng() < 0.5 ? -1 : 1, rng() * 0.8 + 0.1, 0.15 + rng() * 0.7]); blocks.push({ bx, by, w, hgt, win }); }
    blocks.sort((p, q) => p.by - q.by);
    towns.push({ x, y, blocks });
  }
  // grid lines: each town to its two nearest neighbours (dedup)
  const lines = []; const has = (i, j) => lines.some(l => (l.i === i && l.j === j) || (l.i === j && l.j === i));
  towns.forEach((a, i) => { towns.map((b, j) => [j, Math.hypot(a.x - b.x, a.y - b.y)]).filter(p => p[0] !== i).sort((p, q) => p[1] - q[1]).slice(0, 2)
    .forEach(([j]) => { if (!has(i, j)) lines.push({ i, j }); }); });
  // first trip: the line whose midpoint is nearest the operator's room (southwest of it)
  const TP = [ROOMS.A[0] - 150, ROOMS.A[1] - 20];
  let tripLine = 0, best = 1e9; lines.forEach((l, k) => { const mx = (towns[l.i].x + towns[l.j].x) / 2, my = (towns[l.i].y + towns[l.j].y) / 2; const d = Math.hypot(mx - TP[0], my - TP[1]); if (d < best) { best = d; tripLine = k; } });
  const T_TRIP = lines[tripLine]; const TPx = (towns[T_TRIP.i].x + towns[T_TRIP.j].x) / 2, TPy = (towns[T_TRIP.i].y + towns[T_TRIP.j].y) / 2;
  // outage ranks (distance from the first trip + seeded jitter), normalised 0..1
  const items = [];
  towns.forEach((tw, i) => items.push({ kind: 't', i, d: Math.hypot(tw.x - TPx, tw.y - TPy) }));
  lines.forEach((l, i) => items.push({ kind: 'l', i, d: Math.hypot((towns[l.i].x + towns[l.j].x) / 2 - TPx, (towns[l.i].y + towns[l.j].y) / 2 - TPy) }));
  Object.keys(ROOMS).forEach(id => items.push({ kind: 'r', i: id, d: Math.hypot(ROOMS[id][0] - TPx, ROOMS[id][1] - TPy) }));
  const maxD = Math.max(...items.map(o => o.d)); items.forEach(o => o.key = o.d / maxD * 0.85 + rng() * 0.15);
  items.sort((p, q) => p.key - q.key); items.forEach((o, n) => o.rank = (n + 0.5) / items.length);
  const RANK = { t: {}, l: {}, r: {} }; items.forEach(o => RANK[o.kind][o.i] = o.rank);
  const isOut = (kind, i, h) => kind === 'l' && i === tripLine ? h >= TRIP : RANK[kind][i] < extent(h);

  // ---------- helpers ----------
  const fade = (t, a, b, f = 0.3) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));
  function glow(ctx, x, y, r, rgb, a) { if (a <= 0.005) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); }
  function poly(ctx, pts, fill, stroke, lw = 2) { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); if (fill) { ctx.fillStyle = fill; ctx.fill(); } if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.stroke(); } }
  const mix = (c1, c2, f) => { const a = c1.match(/\w\w/g).map(v => parseInt(v, 16)), b = c2.match(/\w\w/g).map(v => parseInt(v, 16)); return '#' + a.map((v, i) => Math.round(L.lerp(v, b[i], f)).toString(16).padStart(2, '0')).join(''); };
  function card(ctx, lines, y, size, a, col) { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center';
    let yy = y; lines.forEach((l, i) => { const o = typeof l === 'string' ? { text: l } : l; let fz = o.size || size; ctx.font = `${fz}px "${SERIF}"`;
      while (ctx.measureText(o.text).width > 800 && fz > 30) { fz -= 4; ctx.font = `${fz}px "${SERIF}"`; }
      if (i) yy += fz * 1.06; ctx.lineJoin = 'round'; ctx.lineWidth = fz * 0.14; ctx.strokeStyle = 'rgba(10,13,18,0.95)'; ctx.strokeText(o.text, 490, yy);
      ctx.fillStyle = o.col || col || '#f4f1ea'; ctx.fillText(o.text, 490, yy); }); ctx.restore(); }
  function slate(ctx, s) { ctx.save(); ctx.fillStyle = 'rgba(8,11,16,0.6)'; ctx.fillRect(40, 1818, 620, 58); ctx.restore(); L.slate(ctx, s); }
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }

  // bean character (after scenes/example_follow_the_green.js), faces with emotion
  function bean(ctx, x, y, s, { col = '#d9d4ca', mood = 'flat', look = [0, 0], arm = 0 } = {}) {
    const bw = 46 * s, bh = 60 * s; ctx.save(); ctx.lineCap = 'round';
    ctx.strokeStyle = col; ctx.lineWidth = 7 * s;
    [-1, 1].forEach(sd => { const ax = x + sd * bw * 0.42, ay = y + bh * 0.02; const ang = sd === 1 && arm ? L.lerp(Math.PI / 2 + 0.25, 0.95, arm) : Math.PI / 2 + sd * 0.25;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + Math.cos(ang) * bw * 0.6, ay + Math.sin(ang) * bw * 0.6); ctx.stroke(); });
    ctx.fillStyle = col; rr(ctx, x - bw / 2, y - bh / 2, bw, bh, bw / 2); ctx.fill();
    const ey = y - bh * 0.14, er = bw * (mood === 'panic' ? 0.17 : 0.14);
    [-1, 1].forEach(sd => { const ex = x + sd * bw * 0.19;
      ctx.fillStyle = '#fffdf7'; ctx.beginPath(); ctx.arc(ex, ey, er, 0, 7); ctx.fill(); ctx.strokeStyle = '#1b1f27'; ctx.lineWidth = 1.6 * s; ctx.stroke();
      ctx.fillStyle = '#1b1f27'; ctx.beginPath(); ctx.arc(ex + look[0] * er * 0.45, ey + look[1] * er * 0.45, er * (mood === 'panic' ? 0.36 : 0.5), 0, 7); ctx.fill();
      if (mood === 'flat' || mood === 'sad') { ctx.fillStyle = col; ctx.fillRect(ex - er * 1.15, ey - er * 1.15, er * 2.3, er * (mood === 'sad' ? 0.95 : 0.75)); }
      if (mood === 'sad') { ctx.strokeStyle = '#1b1f27'; ctx.lineWidth = 2.6 * s; ctx.beginPath(); ctx.moveTo(ex - er, ey - er * 0.2 - sd * er * 0.35); ctx.lineTo(ex + er, ey - er * 0.2 + sd * er * 0.35); ctx.stroke(); }
      if (mood === 'panic') { ctx.strokeStyle = '#1b1f27'; ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.moveTo(ex - er, ey - er * 1.6 + sd * er * 0.3); ctx.lineTo(ex + er, ey - er * 1.6 - sd * er * 0.3); ctx.stroke(); } });
    const my = y + bh * 0.15; ctx.strokeStyle = '#1b1f27'; ctx.fillStyle = '#1b1f27'; ctx.lineWidth = 3 * s; ctx.beginPath();
    if (mood === 'panic') { ctx.ellipse(x, my + bh * 0.03, bw * 0.09, bw * 0.12, 0, 0, 7); ctx.fill(); }
    else if (mood === 'sad') { ctx.arc(x, my + bw * 0.1, bw * 0.12, 1.2 * Math.PI, 1.8 * Math.PI); ctx.stroke(); }
    else if (mood === 'happy') { ctx.arc(x, my - bw * 0.04, bw * 0.13, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); }
    else { ctx.moveTo(x - bw * 0.1, my); ctx.lineTo(x + bw * 0.1, my); ctx.stroke(); }
    ctx.restore();
  }

  // paint helpers for the two back walls (u along the wall, y = -z)
  const onLeftWall = (ctx, fn) => { ctx.save(); ctx.transform(0.866, -0.5, 0, 1, OX - 0.866 * S, OY + 0.5 * S); fn(); ctx.restore(); };
  const onRightWall = (ctx, fn) => { ctx.save(); ctx.transform(0.866, 0.5, 0, 1, OX, OY); fn(); ctx.restore(); };
  function isoBox(ctx, x0, y0, x1, y1, z0, z1, top, left, right, stroke) {
    poly(ctx, [P(x0, y1, z0), P(x1, y1, z0), P(x1, y1, z1), P(x0, y1, z1)], left, stroke, 3);
    poly(ctx, [P(x1, y0, z0), P(x1, y1, z0), P(x1, y1, z1), P(x1, y0, z1)], right, stroke, 3);
    poly(ctx, [P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)], top, stroke, 3);
  }
  function clockHands(ctx, cx, cy, r, h, lw) {   // h = event hours since t0 (2:14 pm, analog t0 s2)
    const mins = 14 + h * 60, hrs = 2 + mins / 60;
    const ma = mins / 60 * Math.PI * 2, ha = hrs / 12 * Math.PI * 2;
    ctx.strokeStyle = INK; ctx.lineCap = 'round';
    ctx.lineWidth = lw * 1.5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(ha) * r * 0.5, cy - Math.cos(ha) * r * 0.5); ctx.stroke();
    ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(ma) * r * 0.82, cy - Math.cos(ma) * r * 0.82); ctx.stroke();
  }
  const WIN0 = (2 + (14 + TRIP * 60) / 60) / 12 * Math.PI * 2, WIN1 = (2 + (14 + C0 * 60) / 60) / 12 * Math.PI * 2; // hour-hand angles of the ~1 h window

  // ---------- one control room, local coordinates ----------
  // o: {h, lit 0..1, frag 0..1, mood, look, kind: 'A'|'B'|'C'|'D', detail, arm, redOut 0..1}
  function room(ctx, o) {
    const lit = o.lit, dark = 1 - lit;
    const wallL = mix('3a4553', '14181e', dark), wallR = mix('465262', '181c23', dark), floor = mix('2a323d', '101318', dark);
    poly(ctx, [P(0, 0), P(S, 0), P(S, S), P(0, S)], floor, '#0b0e12', 4);
    poly(ctx, [P(0, 0), P(0, S), P(0, S, WH), P(0, 0, WH)], wallL, '#0b0e12', 4);
    poly(ctx, [P(0, 0), P(S, 0), P(S, 0, WH), P(0, 0, WH)], wallR, '#0b0e12', 4);
    // floor tiles
    ctx.strokeStyle = `rgba(200,210,220,${0.05 + 0.04 * lit})`; ctx.lineWidth = 2;
    for (let k = 100; k < S; k += 100) { ctx.beginPath(); ctx.moveTo(...P(k, 0)); ctx.lineTo(...P(k, S)); ctx.moveTo(...P(0, k)); ctx.lineTo(...P(S, k)); ctx.stroke(); }
    // window on the left wall: outside sky; the red lives out there
    onLeftWall(ctx, () => {
      const u0 = 170, u1 = 400, z0 = 360, z1 = 700;
      ctx.fillStyle = '#0c1016'; ctx.fillRect(u0, -z1, u1 - u0, z1 - z0);
      ctx.save(); ctx.beginPath(); ctx.rect(u0, -z1, u1 - u0, z1 - z0); ctx.clip();
      const red = o.redOut; if (red > 0) { const g = ctx.createLinearGradient(0, -z0, 0, -z1); g.addColorStop(0, `rgba(255,59,48,${0.95 * red})`); g.addColorStop(1, `rgba(255,59,48,${0.25 * red})`); ctx.fillStyle = g; ctx.fillRect(u0, -z1, u1 - u0, z1 - z0); }
      // distant pylons and skyline
      ctx.fillStyle = red > 0.3 ? '#240a09' : '#1c232c';
      for (let k = 0; k < 7; k++) { const bx = u0 + 10 + k * 34, bh = 40 + ((k * 37) % 70); ctx.fillRect(bx, -z0 - bh, 26, bh); if (!red && lit > 0.5) { ctx.fillStyle = '#8f8a78'; ctx.fillRect(bx + 8, -z0 - bh + 12, 5, 5); ctx.fillRect(bx + 15, -z0 - bh + 28, 5, 5); ctx.fillStyle = '#1c232c'; } }
      ctx.strokeStyle = red > 0.3 ? '#3a0e0c' : '#2a323c'; ctx.lineWidth = 4;
      [[u0 + 40, -z0 - 150], [u0 + 180, -z0 - 170]].forEach(([px, py]) => { ctx.beginPath(); ctx.moveTo(px - 20, -z0); ctx.lineTo(px, py); ctx.lineTo(px + 20, -z0); ctx.moveTo(px - 28, py + 20); ctx.lineTo(px + 28, py + 20); ctx.stroke(); });
      ctx.beginPath(); ctx.moveTo(u0, -z0 - 120); ctx.quadraticCurveTo(u0 + 110, -z0 - 110, u0 + 152, -z0 - 150); ctx.quadraticCurveTo(u0 + 200, -z0 - 140, u1, -z0 - 130); ctx.stroke();
      ctx.restore();
      ctx.strokeStyle = '#0b0e12'; ctx.lineWidth = 10; ctx.strokeRect(u0, -z1, u1 - u0, z1 - z0); ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo((u0 + u1) / 2, -z1); ctx.lineTo((u0 + u1) / 2, -z0); ctx.stroke();
      // wall clock
      const cx = 505, cy = -600, r = 64;
      ctx.fillStyle = mix('d8d2c4', '4a4a46', dark); ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.fill(); ctx.strokeStyle = '#0b0e12'; ctx.lineWidth = 6; ctx.stroke();
      ctx.strokeStyle = '#2a2f36'; for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; ctx.lineWidth = k % 3 ? 2 : 4; ctx.beginPath(); ctx.moveTo(cx + Math.sin(a) * r * 0.78, cy - Math.cos(a) * r * 0.78); ctx.lineTo(cx + Math.sin(a) * r * 0.92, cy - Math.cos(a) * r * 0.92); ctx.stroke(); }
      const save = INK; ctx.save(); const mins = 14 + o.h * 60, hrs = 2 + mins / 60; const ma = mins / 60 * Math.PI * 2, ha = hrs / 12 * Math.PI * 2; ctx.strokeStyle = '#161a20'; ctx.lineCap = 'round';
      ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(ha) * r * 0.5, cy - Math.cos(ha) * r * 0.5); ctx.stroke();
      ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(ma) * r * 0.82, cy - Math.cos(ma) * r * 0.82); ctx.stroke(); ctx.restore();
    });
    // alarm panel on the right wall: every lamp dark. Silent.
    onRightWall(ctx, () => {
      const u0 = 150, u1 = 520, z0 = 400, z1 = 770;
      ctx.fillStyle = mix('222932', '111418', dark); ctx.fillRect(u0, -z1, u1 - u0, z1 - z0); ctx.strokeStyle = '#0b0e12'; ctx.lineWidth = 8; ctx.strokeRect(u0, -z1, u1 - u0, z1 - z0);
      if (o.detail) { ctx.font = `34px "${HAND}"`; ctx.fillStyle = mix('9aa3ad', '3a4048', dark); ctx.textAlign = 'center'; ctx.fillText('ALARMS', (u0 + u1) / 2, -z1 + 44); }
      for (let r = 0; r < 4; r++) for (let c = 0; c < 6; c++) { const x = u0 + 30 + c * 55, y = -z1 + 70 + r * 68; ctx.fillStyle = mix('39414b', '1a1d22', dark); ctx.fillRect(x, y, 38, 40); ctx.strokeStyle = '#0b0e12'; ctx.lineWidth = 3; ctx.strokeRect(x, y, 38, 40); }
    });
    // operator / occupant
    const [bx, by] = P(250, 200); const bcol = mix('d9d4ca', '55524d', dark * 0.85);
    bean(ctx, bx, by - 205, 4.3, { col: bcol, mood: o.mood, look: o.look, arm: o.arm || 0 });
    if (o.detail && lit > 0.2) glow(ctx, bx + 40, by - 250, 200, '200,215,230', 0.10 * lit);   // cool flat spill from the dead panel
    if (o.redOut > 0) glow(ctx, bx - 60, by - 260, 240, '255,59,48', 0.22 * o.redOut);
    // desk
    const dtop = mix('59636f', '1d2127', dark), dl = mix('3b434e', '14171b', dark), dr = mix('2f3640', '111418', dark);
    isoBox(ctx, 120, 330, 500, 440, 0, 165, dtop, dl, dr, '#0b0e12');
    // console screens on the desk (backs toward us), flat gray
    isoBox(ctx, 150, 330, 190, 400, 165, 290, mix('4b5460', '1a1d22', dark), mix('343b45', '121418', dark), mix('2a3038', '0f1114', dark), '#0b0e12');
    isoBox(ctx, 250, 330, 290, 400, 165, 270, mix('4b5460', '1a1d22', dark), mix('343b45', '121418', dark), mix('2a3038', '0f1114', dark), '#0b0e12');
    // phone
    isoBox(ctx, 170, 410, 230, 435, 165, 185, mix('3a414b', '15181c', dark), '#23282f', '#1c2026', '#0b0e12');
    // green fragment on the desk
    const g = o.frag; const [fx, fy] = P(420, 385, 165);
    glow(ctx, fx, fy - 40, 150, '52,210,123', 0.18 + 0.5 * g);
    if (o.kind === 'A') {   // load-shed lever
      isoBox(ctx, 395, 365, 445, 410, 165, 185, '#1f2a24', '#18201b', '#141a16', '#0b0e12');
      const tip = [fx + 20 - 40 * (o.pull || 0), fy - 95];
      ctx.strokeStyle = '#2b3530'; ctx.lineWidth = 10; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(fx, fy - 20); ctx.lineTo(tip[0], tip[1]); ctx.stroke();
      ctx.fillStyle = mix('1e5a3a', '34d27b', 0.35 + 0.65 * g); ctx.beginPath(); ctx.arc(tip[0], tip[1], 20, 0, 7); ctx.fill(); ctx.strokeStyle = '#0b0e12'; ctx.lineWidth = 4; ctx.stroke();
    } else {
      isoBox(ctx, 385, 355, 455, 415, 165, 245, mix('1e5a3a', '34d27b', 0.3 + 0.7 * g), mix('174a30', '2aa864', 0.3 + 0.7 * g), mix('123d27', '21864f', 0.3 + 0.7 * g), '#0b0e12');
    }
    // darkness overlay for the whole room (absence of light)
  }

  function drawRoomAt(ctx, id, o) { const [ox, oy] = originOf(id); ctx.save(); ctx.translate(ox, oy); ctx.scale(K, K); room(ctx, o); ctx.restore(); }

  function roomState(id, t) {
    const h = hAt(t); const out = RANK.r[id] < extent(h);
    const lit = out ? 0.12 : 1;
    const ready = { A: FR.f2, B: FR.f1, C: FR.f3, D: FR.f4 }[id];
    let frag = h >= ready ? 1 : 0.15;
    let mood = 'flat', look = [0, 0];
    if (id === 'A') { look = h < FR.f2 ? [0.9, -0.3] : [-0.2, 0]; mood = h >= FR.f2 ? 'panic' : 'flat'; if (out) { mood = 'sad'; look = [-0.9, 0]; } }
    else if (h >= ready) { mood = 'panic'; }
    if (out) frag *= 0.4;
    return { h, lit, frag, mood, look, kind: id, detail: id === 'A', redOut: id === 'A' ? extent(h) : 0 };
  }

  // ---------- the world ----------
  const roomTop = id => [ROOMS[id][0], ROOMS[id][1] - 105];
  const tier = (t) => t;
  function world(ctx, t) {
    const h = hAt(t), ext = extent(h);
    // plate
    const plate = [W(0, 0), W(1, 0), W(1, 1), W(0, 1)];
    poly(ctx, [[plate[0][0], plate[0][1]], [plate[1][0], plate[1][1]], [plate[1][0], plate[1][1] + 26], [plate[2][0], plate[2][1] + 26], [plate[3][0], plate[3][1] + 26], [plate[3][0], plate[3][1]]], '#161b22', '#0b0e12', 3);
    poly(ctx, plate, '#1e252e', '#0b0e12', 3);
    ctx.strokeStyle = 'rgba(190,200,210,0.05)'; ctx.lineWidth = 1.5;
    for (let k = 1; k < 12; k++) { const f = k / 12; ctx.beginPath(); ctx.moveTo(...W(f, 0)); ctx.lineTo(...W(f, 1)); ctx.moveTo(...W(0, f)); ctx.lineTo(...W(1, f)); ctx.stroke(); }
    // ground clock dial (the whole region is the clock)
    const [ccx, ccy] = W(0.5, 0.5), crx = 360, cry = 208;
    ctx.save(); ctx.strokeStyle = 'rgba(195,202,210,0.22)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(ccx, ccy, crx, cry, 0, 0, 7); ctx.stroke();
    for (let k = 0; k < 12; k++) { const a = k / 12 * Math.PI * 2; ctx.lineWidth = k % 3 ? 2 : 5; ctx.beginPath(); ctx.moveTo(ccx + Math.sin(a) * crx * 0.9, ccy - Math.cos(a) * cry * 0.9); ctx.lineTo(ccx + Math.sin(a) * crx, ccy - Math.cos(a) * cry); ctx.stroke(); }
    // the window: from the first trip to the point of no return (about one hour)
    if (h >= TRIP) { const pulse = 0.5 + 0.5 * Math.sin((t - tOf(TRIP)) * 3);
      ctx.beginPath(); ctx.moveTo(ccx, ccy); for (let k = 0; k <= 20; k++) { const a = L.lerp(WIN0, WIN1, k / 20); ctx.lineTo(ccx + Math.sin(a) * crx, ccy - Math.cos(a) * cry); } ctx.closePath();
      ctx.fillStyle = `rgba(255,59,48,${0.18 + 0.12 * pulse * (1 - ext)})`; ctx.fill(); ctx.strokeStyle = 'rgba(255,59,48,0.8)'; ctx.lineWidth = 3; ctx.stroke(); }
    ctx.restore();
    groundHands(ctx, t);
    // red haze where the cascade has passed
    towns.forEach((tw, i) => { if (isOut('t', i, h)) glow(ctx, tw.x, tw.y, 95, '255,59,48', 0.28); });
    // grid lines
    lines.forEach((l, k) => { const a = towns[l.i], b = towns[l.j]; const out = isOut('l', k, h);
      if (out) { ctx.save(); ctx.strokeStyle = 'rgba(255,59,48,0.35)'; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(a.x, a.y - 14); ctx.lineTo(b.x, b.y - 14); ctx.stroke(); ctx.restore(); }
      ctx.strokeStyle = out ? RED : 'rgba(170,180,190,0.35)'; ctx.lineWidth = out ? 4 : 2; ctx.beginPath(); ctx.moveTo(a.x, a.y - 14); ctx.lineTo(b.x, b.y - 14); ctx.stroke(); });
    // towns (back to front)
    towns.slice().sort((p, q) => p.y - q.y).forEach(tw => { const i = towns.indexOf(tw); const out = isOut('t', i, h);
      tw.blocks.forEach(bk => { const x = tw.x + bk.bx, y = tw.y + bk.by, w = bk.w, hh = bk.hgt;
        const topC = out ? '#2a2f36' : '#5a6470', lC = out ? '#1b1f25' : '#3c444f', rC = out ? '#15181d' : '#2e353e';
        poly(ctx, [[x - w * 0.866, y - w * 0.5], [x, y], [x, y - hh], [x - w * 0.866, y - w * 0.5 - hh]], lC);
        poly(ctx, [[x, y], [x + w * 0.866, y - w * 0.5], [x + w * 0.866, y - w * 0.5 - hh], [x, y - hh]], rC);
        poly(ctx, [[x, y - hh], [x + w * 0.866, y - w * 0.5 - hh], [x, y - w - hh], [x - w * 0.866, y - w * 0.5 - hh]], topC);
        if (!out) { ctx.fillStyle = '#efe4c2'; bk.win.forEach(([sd, fx, fz]) => { const px = x + sd * w * 0.866 * fx, py = y - (sd < 0 ? w * 0.5 * fx : w * 0.5 * fx) - hh * fz; ctx.fillRect(px - 1.5, py - 1.5, 3, 3); }); }
      }); });
    // rooms (back to front)
    ['C', 'B', 'D', 'A'].forEach(id => drawRoomAt(ctx, id, roomState(id, t)));
    // phone lines between rooms
    CALLS.forEach(c => {
      const dt = t - c.t; if (dt < 0 || dt > GROW + HOLD + DROP) return;
      const a = roomTop(c.a), b = roomTop(c.b), mx = (a[0] + b[0]) / 2, my = Math.min(a[1], b[1]) - 90;
      const q = (f) => [ (1 - f) * (1 - f) * a[0] + 2 * f * (1 - f) * mx + f * f * b[0], (1 - f) * (1 - f) * a[1] + 2 * f * (1 - f) * my + f * f * b[1] ];
      ctx.save(); ctx.lineCap = 'round';
      if (dt < GROW) { const f = L.ease.out(dt / GROW); ctx.strokeStyle = 'rgba(52,210,123,0.8)'; ctx.lineWidth = 3; ctx.setLineDash([10, 9]); ctx.beginPath(); for (let k = 0; k <= 24; k++) { const p = q(f * k / 24); k ? ctx.lineTo(...p) : ctx.moveTo(...p); } ctx.stroke(); }
      else if (dt < GROW + HOLD) { ctx.strokeStyle = 'rgba(52,210,123,0.25)'; ctx.lineWidth = 14; ctx.beginPath(); for (let k = 0; k <= 24; k++) { const p = q(k / 24); k ? ctx.lineTo(...p) : ctx.moveTo(...p); } ctx.stroke();
        ctx.strokeStyle = GREEN; ctx.lineWidth = 4; ctx.stroke(); }
      else { const f = (dt - GROW - HOLD) / DROP; ctx.globalAlpha = 1 - f; ctx.strokeStyle = '#8a939d'; ctx.lineWidth = 3;
        [[0, 0.45], [0.55, 1]].forEach(([s0, s1], side) => { ctx.beginPath(); for (let k = 0; k <= 12; k++) { const ff = L.lerp(s0, s1, k / 12); const p = q(ff); const sag = f * 60 * (side ? (1 - (ff - s0) / (s1 - s0)) : (ff - s0) / (s1 - s0)); k ? ctx.lineTo(p[0], p[1] + sag) : ctx.moveTo(p[0], p[1] + sag); } ctx.stroke(); }); }
      ctx.restore(); });
    // hour and minute hands of the ground clock drawn over everything faintly
    // room labels
    const labA = L.sm(8.6, 9.4, t) * (1 - L.sm(16.9, 17.4, t));
    if (labA > 0) { [['A', 'his room'], ['B', 'IT staff'], ['C', 'coordinator'], ['D', 'neighbors']].forEach(([id, s]) => { const [x, y] = ROOMS[id]; L.label(ctx, s, x, y + 104, 32, { col: '#9aa3ad', alpha: labA }); }); }
  }

  // ground-clock hands, drawn as long iso hands (separate so they sit above the plate but under rooms)
  // (handled inside world via clockHands with radius 0 -> no-op; real hands drawn here)
  function groundHands(ctx, t) { const h = hAt(t); const [ccx, ccy] = W(0.5, 0.5); const mins = 14 + h * 60, hrs = 2 + mins / 60; const ma = mins / 60 * Math.PI * 2, ha = hrs / 12 * Math.PI * 2;
    ctx.save(); ctx.strokeStyle = 'rgba(215,220,226,0.55)'; ctx.lineCap = 'round';
    ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(ccx, ccy); ctx.lineTo(ccx + Math.sin(ha) * 360 * 0.55, ccy - Math.cos(ha) * 208 * 0.55); ctx.stroke();
    ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(ccx, ccy); ctx.lineTo(ccx + Math.sin(ma) * 360 * 0.85, ccy - Math.cos(ma) * 208 * 0.85); ctx.stroke();
    ctx.fillStyle = 'rgba(215,220,226,0.7)'; ctx.beginPath(); ctx.ellipse(ccx, ccy, 9, 6, 0, 0, 7); ctx.fill(); ctx.restore(); }

  // ---------- camera ----------
  const lw = (id, lx, ly) => toWorld(id, lx, ly);
  const CLOSE = [...lw('A', 560, 1010), Math.log(11.6)];
  const WIDE = [540, 1000, Math.log(1.1)];
  const FACE = [...lw('A', 575, 1080), Math.log(15.5)];
  const CAM = [[0, CLOSE], [6.0, CLOSE], [9.5, WIDE], [16.9, WIDE], [19.4, FACE], [22, FACE]];
  function cam(ctx, t) { const [x, y, lz] = L.key(CAM, t); const z = Math.exp(lz); ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-x, -y); }

  // ---------- snap panels ----------
  const SNAP0 = 22.0, SW1 = [22.5, 24.5], SW2 = [25.0, 27.0], SNAP1 = 29.4;
  const AX0 = 110, AX1 = 950, hx = h => AX0 + (AX1 - AX0) * h / 2;
  function panel(ctx, t, y0, sweep, ai) {
    const head = L.clamp((t - sweep[0]) / (sweep[1] - sweep[0]), 0, 1) * 2;   // event hours revealed, same axis both panels
    ctx.save(); ctx.fillStyle = '#171d25'; rr(ctx, 70, y0, 920, 400, 18); ctx.fill(); ctx.strokeStyle = '#2c3440'; ctx.lineWidth = 3; ctx.stroke();
    ctx.font = `60px "${SERIF}"`; ctx.fillStyle = '#f4f1ea'; ctx.textAlign = 'left'; ctx.fillText(ai ? 'Routed' : 'As it happened', 110, y0 + 78);
    if (ai) L.label(ctx, 'illustrative', 300, y0 + 76, 46, { col: '#aab2bc', align: 'left' });
    const ay = y0 + 200;
    // window band (about one hour) and cascade
    ctx.fillStyle = 'rgba(255,59,48,0.16)'; ctx.fillRect(hx(TRIP), ay - 50, hx(C0) - hx(TRIP), 100); ctx.strokeStyle = 'rgba(255,59,48,0.7)'; ctx.lineWidth = 2; ctx.strokeRect(hx(TRIP), ay - 50, hx(C0) - hx(TRIP), 100);
    if (head >= TRIP) { ctx.font = `44px "${HAND}"`; ctx.fillStyle = '#ff8a80'; ctx.textAlign = 'center'; ctx.fillText('the window', (hx(TRIP) + hx(C0)) / 2, ay - 64); }
    // axis
    ctx.strokeStyle = '#5a6470'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(AX0, ay); ctx.lineTo(AX1, ay); ctx.stroke();
    ctx.strokeStyle = '#d7dce2'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(AX0, ay); ctx.lineTo(hx(head), ay); ctx.stroke();
    if (head >= C0) { const f = L.clamp((head - C0) / (C1 - C0), 0, 1);
      if (ai) { ctx.setLineDash([8, 8]); ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.strokeRect(hx(C0), ay - 70, hx(C1) - hx(C0) + 8, 140); ctx.setLineDash([]); }
      else { ctx.fillStyle = RED; ctx.fillRect(hx(C0), ay - 70, (hx(C1) - hx(C0) + 8) * f, 140); } }
    // green: when the pieces found each other
    const gh = ai ? AI : AG.median;
    if (head >= gh) { const x = hx(gh); glow(ctx, x, ay, 70, '52,210,123', 0.5); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(x, ay, 16, 0, 7); ctx.fill();
      if (ai) { ctx.strokeStyle = 'rgba(52,210,123,0.55)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(x, ay); ctx.lineTo(hx(Math.min(head, C0)), ay); ctx.stroke(); }
      ctx.strokeStyle = GREEN; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, ay + 18); ctx.lineTo(x, ay + 88); ctx.stroke();
      L.label(ctx, ai ? 'pieces routed to him' : 'pieces noticed each other', ai ? x - 10 : Math.min(x + 20, 900) , ay + 136, 46, { col: GREEN, align: ai ? 'left' : 'right' }); }
    // playhead
    if (head < 2) { ctx.fillStyle = '#fffdf7'; ctx.beginPath(); ctx.arc(hx(head), ay, 10, 0, 7); ctx.fill(); }
    ctx.restore();
  }
  function snap(ctx, t) {
    ctx.fillStyle = '#0e1319'; ctx.fillRect(0, 0, 1080, 1920);
    card(ctx, ['Same pieces. Same hour.'], 330, 84, fade(t, 22.3, 24.9));
    panel(ctx, t, 470, SW1, false);
    if (t >= 24.8) { ctx.save(); ctx.globalAlpha = L.sm(24.8, 25.1, t); panel(ctx, t, 960, SW2, true); ctx.restore(); }
    card(ctx, ['People still decide.'], 1500, 72, fade(t, 27.0, SNAP1 + 0.3), '#e8e4da');
    card(ctx, ['Same clock, sped up.'], 330, 84, fade(t, 25.0, 27.1));
    card(ctx, ['Lag, not stupidity.'], 330, 84, fade(t, 27.2, SNAP1 + 0.2));
  }

  // ---------- draw ----------
  function draw(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    if (t < SNAP0) {
      ctx.save(); cam(ctx, t); world(ctx, t); ctx.restore();
      if (t < T0) { L.label(ctx, 'later', 150, 470, 48, { col: '#ff8a80', align: 'left' }); }
      // dead stop: dim the frame after the cascade
      card(ctx, ['The alarm never rang.'], 330, 92, t < 0.05 ? 1 : fade(t, -1, 1.0, 0.25));
      card(ctx, ['The panel stayed quiet.'], 330, 84, fade(t, 1.25, 3.55));
      card(ctx, ['It had failed.', 'Nobody told him.'], 300, 84, fade(t, 3.75, 5.95));
      card(ctx, ['Four rooms. Four pieces.'], 330, 84, fade(t, 6.9, 9.4));
      card(ctx, ['The calls kept dropping.'], 300, 80, fade(t, 10.2, 12.6));
      card(ctx, ['The window: one hour.'], 300, 80, fade(t, 12.9, 15.6));
      card(ctx, ['50 million people.', 'In minutes.'], 300, 88, fade(t, 17.0, 19.3));
      card(ctx, ['We slowed it down', 'so you could see it.'], 320, 84, fade(t, 19.5, 22.0, 0.35));
      slate(ctx, t < T0 ? 'SC0  CLOSE  (flash-forward)' : t < 6 ? 'SC1  CLOSE  LOCKED-OFF' : t < 9.5 ? 'SC2  PULL-OUT' : t < 16.9 ? 'SC3  WIDE  1 s = 7.5 min' : t < 19.4 ? 'SC4  DOLLY IN  CLOSER' : 'SC4  HOLD  (dead stop)');
      if (t > 21.7) { ctx.fillStyle = `rgba(14,19,25,${L.sm(21.7, 22.0, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
    } else if (t < SNAP1) {
      snap(ctx, t); slate(ctx, 'SC5  INSERT  TWO TIMELINES');
      if (t > SNAP1 - 0.3) { ctx.fillStyle = `rgba(14,19,25,${L.sm(SNAP1 - 0.3, SNAP1, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
    } else {
      // back inside, closest: the lever lit, the line holding (illustrative)
      const zt = L.sm(SNAP1, 31.5, t);
      ctx.save();
      const [lx, ly] = P(400, 385, 200); const z = L.lerp(1.9, 2.25, zt);
      ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-L.lerp(500, lx - 20, zt), -L.lerp(1110, ly - 40, zt));
      room(ctx, { h: AI, lit: 1, frag: 1, mood: 'flat', look: [0.3, 0.8], kind: 'A', detail: true, redOut: 0, arm: 0, pull: L.sm(31.3, 32.0, t) });
      ctx.restore();
      if (t < SNAP1 + 0.3) { ctx.fillStyle = `rgba(14,19,25,${1 - L.sm(SNAP1, SNAP1 + 0.3, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
      L.label(ctx, 'illustrative', 490, 1440, 46, { col: '#c8ced6', alpha: fade(t, SNAP1 + 0.2, 33.3) });
      card(ctx, ['This is the bottleneck.'], 330, 92, fade(t, 30.4, 33.3, 0.35));
      slate(ctx, 'SC6  CLOSEST');
      if (t >= 33.2) L.endCard(ctx, L.sm(33.2, 33.6, t), { line: 'The bottleneck is us.' });
    }
    L.grain(ctx, t, { alpha: 0.04, n: 400 });
  }

  const cascadeT = tOf(C0);
  return {
    draw, DUR,
    acts: [{ start: 1.0, end: cascadeT - 0.35, bpm: 0, drone: true }, { start: 9.5, end: cascadeT - 0.35, bpm: 50 }, { start: 29.4, end: 38, bpm: 0, drone: true }],
    cues: [{ t: 1.0, type: 'hit' }, { t: 6.1, type: 'whoosh' }, { t: tOf(TRIP), type: 'bonk' },
      ...CALLS.map(c => ({ t: c.t + GROW, type: 'pop' })),
      { t: cascadeT, type: 'hit' }, { t: 17.0, type: 'whoosh' }, { t: 22.3, type: 'hit' }, { t: SW2[0] + (SW2[1] - SW2[0]) * AI / 2, type: 'ding' }, { t: 31.4, type: 'ding' }, { t: 33.2, type: 'stamp' }]
  };
}
if (typeof module !== 'undefined') module.exports = makeScene;
