// the-switchboard: pov, stick-figure animatic, machine. Analog: blackout-2003. Protagonist: frontier AI as a switchboard (never a face).
// One mapping: race t = 1.4..13.4 s, event hours h = (t - 1.4) / 6  (1 film second = 10 minutes).
// Red: verified first trip at h = 0.85; cascade = L.logistic fitted through extent 0.01 @ 1.87 and 0.99 @ 1.98.
// Green: analog fragment ready_at (brightness = attention); human calls at L.lognormalQuantile(q, 1.5, 1.83).
// Board (illustrative): ai_counterfactual.aggregation_median 0.25 h. People pick up and decide. See output/the-switchboard/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('blackout-2003');
  const DUR = 38, RED = L.RED, GREEN = L.GREEN;
  const BG = '#10151c', INK = '#c9cfd6', DIM = '#5d6671', WIRE = '#3b444f';

  // ---------- time mapping ----------
  const T0 = 1.4, HPS = 1 / 6;
  const hAt = t => t < T0 ? 2.0 : Math.min(2.0, (t - T0) * HPS);
  const tOf = h => T0 + h / HPS;

  // ---------- threat ----------
  const TRIP = A.threat.points.find(p => p.t === 0.85).t;
  const C0 = 1.87, C1 = 1.98;
  const DOUBLING = (C1 - C0) * Math.LN2 / Math.log(9801);
  const extent = h => h < C0 ? 0 : Math.min(1, L.logistic(h - C0, DOUBLING, 0.01) / L.logistic(C1 - C0, DOUBLING, 0.01));

  // ---------- green ----------
  const FR = {}; A.solution.fragments.forEach(f => FR[f.id] = f.ready_at);
  const AG = A.solution.aggregation, AIH = A.ai_counterfactual.aggregation_median;
  const READY = { B: FR.f1, D: FR.f4, A: FR.f2, C: FR.f3 };   // IT desk, neighbors, operators, coordinator
  const PAIRS = [['D', 'A'], ['C', 'D'], ['D', 'A'], ['C', 'A'], ['C', 'D'], ['D', 'A']];   // never B->A: IT did not tell operators (s2)
  const CALLS = PAIRS.map((p, i) => ({ a: p[0], b: p[1], h: L.lognormalQuantile((i + 0.5) / PAIRS.length, AG.median, AG.p90) }));
  CALLS.forEach(c => c.t = tOf(c.h));
  const GROW = 0.35, HOLD = 0.9, DROP = 0.6;

  // ---------- world layout (wide = zoom 1) ----------
  const ROOMS = { C: [540, 470], B: [250, 870], D: [830, 870], A: [540, 1270] };
  const BOARD = [540, 870];
  const phoneOf = id => [ROOMS[id][0] + 68, ROOMS[id][1] + 12];
  const headOf = id => [ROOMS[id][0] - 30, ROOMS[id][1] - 24];
  const jackOf = id => ({ A: [BOARD[0], BOARD[1] + 62], C: [BOARD[0], BOARD[1] - 62], B: [BOARD[0] - 82, BOARD[1]], D: [BOARD[0] + 82, BOARD[1]] })[id];
  const inBox = (x, y, pad) => Object.values(ROOMS).some(([rx, ry]) => Math.abs(x - rx) < 125 + pad && Math.abs(y - ry) < 100 + pad) || (Math.abs(x - BOARD[0]) < 100 + pad && Math.abs(y - BOARD[1]) < 80 + pad);

  const rng = L.rng(1408);
  const towns = [];
  for (let k = 0; towns.length < 44 && k < 4000; k++) {
    const x = 70 + rng() * 940, y = 300 + rng() * 1230;
    if (inBox(x, y, 20)) continue; if (towns.some(o => Math.hypot(o.x - x, o.y - y) < 95)) continue;
    const win = []; const n = 3 + Math.floor(rng() * 5); for (let i = 0; i < n; i++) win.push([(rng() - 0.5) * 34, (rng() - 0.5) * 22]);
    towns.push({ x, y, win });
  }
  const lines = []; const has = (i, j) => lines.some(l => (l.i === i && l.j === j) || (l.i === j && l.j === i));
  towns.forEach((a, i) => towns.map((b, j) => [j, Math.hypot(a.x - b.x, a.y - b.y)]).filter(p => p[0] !== i).sort((p, q) => p[1] - q[1]).slice(0, 2)
    .forEach(([j]) => { if (!has(i, j)) lines.push({ i, j }); }));
  const TP = [735, 1085];
  let tripLine = 0, best = 1e9;
  lines.forEach((l, k) => { const mx = (towns[l.i].x + towns[l.j].x) / 2, my = (towns[l.i].y + towns[l.j].y) / 2, d = Math.hypot(mx - TP[0], my - TP[1]); if (d < best) { best = d; tripLine = k; } });
  const TL = lines[tripLine], TPx = (towns[TL.i].x + towns[TL.j].x) / 2, TPy = (towns[TL.i].y + towns[TL.j].y) / 2;
  const items = [];
  towns.forEach((tw, i) => items.push({ kind: 't', i, d: Math.hypot(tw.x - TPx, tw.y - TPy) }));
  lines.forEach((l, i) => items.push({ kind: 'l', i, d: Math.hypot((towns[l.i].x + towns[l.j].x) / 2 - TPx, (towns[l.i].y + towns[l.j].y) / 2 - TPy) }));
  Object.keys(ROOMS).forEach(id => items.push({ kind: 'r', i: id, d: Math.hypot(ROOMS[id][0] - TPx, ROOMS[id][1] - TPy) }));
  const maxD = Math.max(...items.map(o => o.d)); items.forEach(o => o.key = o.d / maxD * 0.85 + rng() * 0.15);
  items.sort((p, q) => p.key - q.key); items.forEach((o, n) => o.rank = (n + 0.5) / items.length);
  const RANK = { t: {}, l: {}, r: {} }; items.forEach(o => RANK[o.kind][o.i] = o.rank);
  const isOut = (kind, i, h) => (kind === 'l' && i === tripLine) ? h >= TRIP : RANK[kind][i] < extent(h);

  // ---------- helpers ----------
  const fade = (t, a, b, f = 0.3) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));
  function glow(ctx, x, y, r, rgb, a) { if (a <= 0.005) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); }
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function card(ctx, lines, y, size, a, col) { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center';
    let yy = y; lines.forEach((l, i) => { const o = typeof l === 'string' ? { text: l } : l; let fz = o.size || size; ctx.font = `${fz}px "${SERIF}"`;
      while (ctx.measureText(o.text).width > 800 && fz > 30) { fz -= 4; ctx.font = `${fz}px "${SERIF}"`; }
      if (i) yy += fz * 1.06; ctx.lineJoin = 'round'; ctx.lineWidth = fz * 0.14; ctx.strokeStyle = 'rgba(10,13,18,0.95)'; ctx.strokeText(o.text, 490, yy);
      ctx.fillStyle = o.col || col || '#f4f1ea'; ctx.fillText(o.text, 490, yy); }); ctx.restore(); }
  function slate(ctx, s) { ctx.save(); ctx.fillStyle = 'rgba(8,11,16,0.6)'; ctx.fillRect(40, 1818, 640, 58); ctx.restore(); L.slate(ctx, s); }
  const along = (p, q, f) => [L.lerp(p[0], q[0], f), L.lerp(p[1], q[1], f)];
  // wire path from a room's phone to its board jack (a gentle sag), sampled
  function wirePts(id, n = 24) { const p = phoneOf(id), q = jackOf(id), pts = [];
    for (let i = 0; i <= n; i++) { const f = i / n; const [x, y] = along(p, q, f); const sag = Math.sin(f * Math.PI) * 26; pts.push([x + (id === 'A' || id === 'C' ? sag : 0), y + (id === 'B' || id === 'D' ? sag : 0)]); } return pts; }
  const WIRES = {}; Object.keys(ROOMS).forEach(id => WIRES[id] = wirePts(id));
  const wireAt = (id, f) => { const P = WIRES[id], n = P.length - 1, k = L.clamp(f, 0, 1) * n, i = Math.min(n - 1, Math.floor(k)); return along(P[i], P[i + 1], k - i); };
  function strokeWire(ctx, id, f0, f1, col, w, dash) { const P = WIRES[id], n = P.length - 1; ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; if (dash) ctx.setLineDash(dash);
    ctx.beginPath(); const s = wireAt(id, f0); ctx.moveTo(s[0], s[1]); for (let i = 0; i <= n; i++) { const f = i / n; if (f > f0 && f < f1) ctx.lineTo(P[i][0], P[i][1]); } const e = wireAt(id, f1); ctx.lineTo(e[0], e[1]); ctx.stroke(); ctx.restore(); }

  // ---------- one room (cutaway box, stick operator, phone, fragment) ----------
  function room(ctx, id, o) {
    const [cx, cy] = ROOMS[id]; const out = o.out, lit = out ? 0.25 : 1;
    // walls
    ctx.fillStyle = out ? '#131820' : '#1c232d'; ctx.fillRect(cx - 120, cy - 92, 240, 158);
    // window behind the head: outside view
    const wx = cx - 110, wy = cy - 84, ww = 120, wh = 92;
    ctx.fillStyle = out ? RED : '#28313c'; ctx.fillRect(wx, wy, ww, wh);
    if (out) { glow(ctx, cx - 50, cy - 38, 220, '255,59,48', 0.35); }
    else { ctx.fillStyle = '#6f6a5c'; for (let k = 0; k < 7; k++) ctx.fillRect(wx + 8 + k * 16, wy + wh - 16 - (k % 3) * 9, 5, 7); }
    L.sketchLine(ctx, wx, wy, wx + ww, wy, { w: 2.5, col: DIM, seed: 3 }); L.sketchLine(ctx, wx, wy + wh, wx + ww, wy + wh, { w: 2.5, col: DIM, seed: 4 });
    L.sketchLine(ctx, wx, wy, wx, wy + wh, { w: 2.5, col: DIM, seed: 5 }); L.sketchLine(ctx, wx + ww, wy, wx + ww, wy + wh, { w: 2.5, col: DIM, seed: 6 });
    L.sketchLine(ctx, wx + ww / 2, wy, wx + ww / 2, wy + wh, { w: 1.5, col: DIM, seed: 7 });
    // alarm lamps on the wall (dead, gray: the alarm that never rang)
    if (id === 'A') for (let k = 0; k < 4; k++) { ctx.fillStyle = '#39414c'; ctx.beginPath(); ctx.arc(cx + 30 + k * 20, cy - 70, 5.5, 0, 7); ctx.fill(); ctx.strokeStyle = '#59626d'; ctx.lineWidth = 1.2; ctx.stroke(); }
    // desk
    L.sketchLine(ctx, cx - 2, cy + 24, cx + 108, cy + 24, { w: 3, col: INK, seed: 11 + cy });
    L.sketchLine(ctx, cx + 4, cy + 24, cx + 4, cy + 60, { w: 2.5, col: DIM, seed: 12 }); L.sketchLine(ctx, cx + 102, cy + 24, cx + 102, cy + 60, { w: 2.5, col: DIM, seed: 13 });
    // fragment (green; brightness = attention)
    const on = o.ready ? 1 : 0.28; ctx.save(); ctx.globalAlpha = lit < 1 ? Math.min(on, 0.45) : on;
    if (on > 0.5 && !out) glow(ctx, cx + 30, cy + 6, 70, '52,210,123', 0.45);
    ctx.strokeStyle = GREEN; ctx.fillStyle = GREEN; ctx.lineWidth = 3; ctx.lineCap = 'round';
    if (id === 'A') { ctx.fillRect(cx + 16, cy + 18, 26, 6); ctx.beginPath(); ctx.moveTo(cx + 29, cy + 18); ctx.lineTo(cx + 38, cy - 4); ctx.stroke(); ctx.beginPath(); ctx.arc(cx + 38, cy - 6, 5, 0, 7); ctx.fill(); }
    if (id === 'B') { ctx.strokeRect(cx + 14, cy - 26, 30, 50); for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.arc(cx + 22, cy - 18 + k * 12, 2.5, 0, 7); ctx.fill(); ctx.fillRect(cx + 28, cy - 19 + k * 12, 11, 2); } }
    if (id === 'C') { ctx.strokeRect(cx + 10, cy - 30, 44, 32); ctx.beginPath(); ctx.moveTo(cx + 14, cy - 10); ctx.lineTo(cx + 24, cy - 22); ctx.lineTo(cx + 34, cy - 14); ctx.lineTo(cx + 50, cy - 24); ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx + 32, cy + 2); ctx.lineTo(cx + 32, cy + 24); ctx.stroke(); }
    if (id === 'D') { ctx.strokeRect(cx + 10, cy - 30, 44, 32); ctx.beginPath(); for (let k = 0; k <= 20; k++) { const x = cx + 13 + k * 1.9, y = cy - 14 + Math.sin(k * 0.9) * (k > 12 ? 10 : 3); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); ctx.beginPath(); ctx.moveTo(cx + 32, cy + 2); ctx.lineTo(cx + 32, cy + 24); ctx.stroke(); }
    ctx.restore();
    // phone on the desk (gray); receiver lifted if picked up
    const [px, py] = phoneOf(id);
    ctx.fillStyle = '#4a535e'; rr(ctx, px - 14, py + 2, 28, 10, 3); ctx.fill();
    const pick = o.pick || 0; const [hx, hy] = headOf(id);
    const rx = L.lerp(px, hx + 16, pick), ry = L.lerp(py - 1, hy + 2, pick);
    ctx.save(); ctx.translate(rx, ry); ctx.rotate(L.lerp(0, -1.2, pick)); ctx.fillStyle = '#8b939d'; rr(ctx, -15, -4, 30, 7, 3); ctx.fill(); ctx.restore();
    ctx.strokeStyle = '#59626d'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(px - 12, py + 7); ctx.quadraticCurveTo((px + rx) / 2 - 10, Math.max(py, ry) + 14, rx - 10, ry + 2); ctx.stroke();
    // operator
    const armR = L.lerp(0.35, 2.55, pick);
    L.stick(ctx, cx - 30, cy + 28, 0.6, { mood: o.mood || 'bored', look: o.look || [0, 0], col: out ? '#aeb4bc' : '#e8e4da', seed: cy, pose: { armL: 0.3, armR } });
    // room frame
    ctx.strokeStyle = out ? '#3a4049' : '#6b7581'; ctx.lineWidth = 3; ctx.strokeRect(cx - 120, cy - 92, 240, 158);
  }

  // ---------- the world at event hour h ----------
  // mode 'real': no board existed. mode 'ai': the board exists (illustrative); route = which wires are lit, f in 0..1 each.
  function world(ctx, t, h, mode, o = {}) {
    // grid lines + towns
    lines.forEach((l, k) => { const a = towns[l.i], b = towns[l.j], out = mode === 'real' && isOut('l', k, h);
      L.sketchLine(ctx, a.x, a.y, b.x, b.y, { w: out ? 3 : 2, col: out ? RED : '#2e3640', seed: k + 40, jitter: 2 }); });
    if (mode === 'real' && h >= TRIP && h < C0) glow(ctx, TPx, TPy, 90, '255,59,48', 0.35 + 0.15 * Math.sin(t * 6));
    towns.forEach((tw, i) => { const out = mode === 'real' && isOut('t', i, h); ctx.fillStyle = out ? '#1b2028' : '#8a8472';
      tw.win.forEach(([dx, dy]) => ctx.fillRect(tw.x + dx, tw.y + dy, 5, 7)); });
    if (mode === 'real') { const e = extent(h); if (e > 0) { glow(ctx, TPx, TPy, 200 + 1100 * e, '255,59,48', 0.28 * e); } }
    // wires to the center
    Object.keys(ROOMS).forEach(id => strokeWire(ctx, id, 0, 1, WIRE, 3));
    // human calls (real only): direct room-to-room arcs that connect and drop
    if (mode === 'real') CALLS.forEach((c, k) => { if (t < c.t || t > c.t + GROW + HOLD + DROP) return; const p = phoneOf(c.a), q = phoneOf(c.b);
      const g = L.clamp((t - c.t) / GROW, 0, 1), d = L.clamp((t - c.t - GROW - HOLD) / DROP, 0, 1);
      const mx = (p[0] + q[0]) / 2 + (q[1] - p[1]) * 0.25, my = (p[1] + q[1]) / 2 - (q[0] - p[0]) * 0.25;
      ctx.save(); ctx.lineCap = 'round'; ctx.strokeStyle = d > 0 ? `rgba(52,210,123,${0.8 * (1 - d)})` : GREEN; ctx.lineWidth = 4; if (d > 0) ctx.setLineDash([10, 12]);
      ctx.beginPath(); ctx.moveTo(p[0], p[1]); for (let i = 1; i <= 20; i++) { const f = i / 20 * g, x = (1 - f) * (1 - f) * p[0] + 2 * f * (1 - f) * mx + f * f * q[0], y = (1 - f) * (1 - f) * p[1] + 2 * f * (1 - f) * my + f * f * q[1];
        const brk = d > 0 && Math.abs(i / 20 - 0.5) < d * 0.3; brk ? ctx.moveTo(x, y) : ctx.lineTo(x, y); } ctx.stroke(); ctx.restore(); });
    // the board
    const [bx, by] = BOARD;
    if (mode === 'real') {
      ctx.save(); ctx.setLineDash([9, 9]); ctx.strokeStyle = '#4c5561'; ctx.lineWidth = 3; ctx.strokeRect(bx - 82, by - 62, 164, 124); ctx.restore();
      L.label(ctx, 'no board', bx, by + 8, 26, { col: '#6b7581' });
    } else {
      ctx.fillStyle = '#2a3038'; rr(ctx, bx - 82, by - 62, 164, 124, 8); ctx.fill(); ctx.strokeStyle = '#8b939d'; ctx.lineWidth = 3; ctx.stroke();
      for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) { ctx.fillStyle = '#12161c'; ctx.beginPath(); ctx.arc(bx - 55 + c * 22, by + 6 + r * 17, 4, 0, 7); ctx.fill(); }
      const lamps = ['B', 'C', 'D', 'A'];
      lamps.forEach((id, k) => { const lx = bx - 48 + k * 32, ly = by - 34, on = (o.lamp && o.lamp[id]) || 0;
        ctx.fillStyle = on > 0.05 ? GREEN : '#46505b'; ctx.globalAlpha = 0.35 + 0.65 * Math.max(on, 0.3); ctx.beginPath(); ctx.arc(lx, ly, 8, 0, 7); ctx.fill(); ctx.globalAlpha = 1;
        if (on > 0.05) glow(ctx, lx, ly, 40, '52,210,123', 0.5 * on); });
      // lit wires (routed lines)
      if (o.route) Object.entries(o.route).forEach(([id, r]) => { if (!r) return; const [f0, f1] = Array.isArray(r) ? r : [0, r]; if (f1 > f0) { strokeWire(ctx, id, f0, f1, 'rgba(52,210,123,0.35)', 12); strokeWire(ctx, id, f0, f1, GREEN, 4); } });
    }
    // rooms
    Object.keys(ROOMS).forEach(id => {
      const out = mode === 'real' && isOut('r', id, h), ready = h >= READY[id] || (o.ready && o.ready[id]);
      let mood = 'bored', look = [0, 0];
      if (mode === 'real') {
        if (id === 'B' && ready) { mood = 'panic'; look = [1, 0.5]; }
        if (id === 'D' && ready) { mood = 'panic'; look = [-1, 0.3]; }
        if (id === 'A' && ready) { mood = 'panic'; look = [0.5, 0.6]; }
        if (id === 'C') mood = ready ? 'awe' : 'glazed';
        if (out) { mood = 'sad'; look = [0, 0.8]; }
      } else { mood = (o.mood && o.mood[id]) || 'bored'; look = (o.look && o.look[id]) || [0.4, 0.2]; }
      room(ctx, id, { out, ready, mood, look, pick: o.pick && o.pick[id] });
    });
    // the signal pulse (the POV)
    if (o.pulse) { const [x, y, col, a] = o.pulse; if (a > 0.01) { glow(ctx, x, y, 34, col === 'g' ? '52,210,123' : '220,225,232', 0.7 * a); ctx.fillStyle = col === 'g' ? GREEN : '#e8ecf0'; ctx.globalAlpha = a; ctx.beginPath(); ctx.arc(x, y, 5.5, 0, 7); ctx.fill(); ctx.globalAlpha = 1; } }
  }

  // ---------- camera (log-zoom interpolation) ----------
  function camAt(keys, t) {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 0; i < keys.length - 1; i++) { const [a, P] = keys[i], [b, Q] = keys[i + 1];
      if (t <= b) { const f = L.ease.inOut((t - a) / (b - a)); const z = Math.exp(L.lerp(Math.log(P[2]), Math.log(Q[2]), f));
        // keep the screen-space motion smooth: interpolate position weighted by zoom
        const w = (1 / z - 1 / P[2]) / ((1 / Q[2] - 1 / P[2]) || 1); const g = Math.abs(Q[2] - P[2]) > 0.3 ? L.clamp(w, 0, 1) : f;
        return [L.lerp(P[0], Q[0], g), L.lerp(P[1], Q[1], g), z]; } }
    return keys[keys.length - 1][1];
  }
  function applyCam(ctx, c) { ctx.translate(540, 960); ctx.scale(c[2], c[2]); ctx.translate(-c[0], -c[1]); }
  const HA = headOf('A');
  // real-night walk: signal from A's phone to the empty center, then out along D's wire to the neighbors
  const W1 = [4.6, 5.9], W2 = [6.35, 7.45];
  const pulseReal = t => {
    if (t >= W1[0] && t <= W1[1]) return wireAt('A', L.ease.inOut((t - W1[0]) / (W1[1] - W1[0])));
    if (t > W1[1] && t < W2[0]) return jackOf('A');
    if (t >= W2[0] && t <= W2[1]) return wireAt('D', 1 - L.ease.inOut((t - W2[0]) / (W2[1] - W2[0])));
    return null;
  };
  function camReal(t) {
    if (t < 4.4) return camAt([[0, [HA[0] + 10, HA[1] + 8, 8]], [T0, [HA[0] + 10, HA[1] + 8, 8]], [4.4, [HA[0] + 12, HA[1] + 10, 8.6]]], t);
    if (t < 4.9) { const p = wireAt('A', 0); const f = L.ease.inOut((t - 4.4) / 0.5); return [L.lerp(HA[0] + 12, p[0], f), L.lerp(HA[1] + 10, p[1], f), Math.exp(L.lerp(Math.log(8.6), Math.log(3.8), f))]; }
    if (t < W1[0]) return [...wireAt('A', 0), 3.8];
    if (t <= W2[1]) { const p = pulseReal(Math.min(Math.max(t, W1[0]), W2[1])) || jackOf('A'); const z = t < W2[0] ? 3.8 : L.lerp(3.8, 4.2, (t - W2[0]) / (W2[1] - W2[0])); return [p[0], p[1] - 30, z]; }
    const pD = wireAt('D', 0);
    if (t < 7.9) return [pD[0], pD[1] - 30, 4.2];
    return camAt([[7.9, [pD[0], pD[1] - 30, 4.2]], [9.8, [540, 880, 1.0]], [13.3, [540, 880, 1.0]], [15.2, [HA[0] + 4, HA[1] + 10, 11]], [18.2, [HA[0] + 4, HA[1] + 8, 11.6]]], t);
  }

  // ---------- counterfactual (IN++) ----------
  const CF0 = 26.4, CF1 = 33.6;
  const RB = [26.9, 27.9], RA = [28.0, 29.0];   // green signal: B wire (phone -> board), then A wire (board -> phone)
  function cfState(t) {
    const fb = L.clamp((t - RB[0]) / (RB[1] - RB[0]), 0, 1), fa = L.clamp((t - RA[0]) / (RA[1] - RA[0]), 0, 1);
    const route = { B: L.ease.inOut(fb), A: fa > 0 ? [1 - L.ease.inOut(fa), 1] : 0 };
    const lamp = { B: L.sm(26.5, 26.9, t), A: L.sm(RA[0], RA[0] + 0.3, t) };
    const pick = { A: L.sm(29.3, 29.9, t), B: L.sm(28.2, 28.7, t) };
    const mood = { A: t > 29.0 ? (t > 29.9 ? 'bored' : 'awe') : 'bored', B: 'awe' };
    const look = { A: t > 28.8 ? [0.9, 0.6] : [0.3, 0.2], B: [1, 0] };
    let pulse = null;
    if (t >= RB[0] && t <= RB[1]) { const p = wireAt('B', L.ease.inOut(fb)); pulse = [p[0], p[1], 'g', 1]; }
    else if (t > RB[1] && t < RA[0]) { const p = jackOf('B'); pulse = [p[0], p[1], 'g', 1]; }
    else if (t >= RA[0] && t <= RA[1] + 0.3) { const p = wireAt('A', 1 - L.ease.inOut(fa)); pulse = [p[0], p[1], 'g', 1 - L.sm(RA[1], RA[1] + 0.3, t)]; }
    return { route, lamp, pick, mood, look, pulse, ready: { A: t > 29.0 } };
  }
  function camCF(t) {
    const b = jackOf('B'), pa = wireAt('A', 0);
    if (t < RB[0]) return [BOARD[0] - 60, BOARD[1] - 10, 3.0];
    if (t <= RA[1]) { const s = cfState(t).pulse; const p = s ? [s[0], s[1]] : BOARD;
      const z = t < RA[0] ? 3.0 : L.lerp(3.0, 4.0, (t - RA[0]) / (RA[1] - RA[0]));
      const k = L.sm(RB[0], RB[0] + 0.4, t); return [L.lerp(BOARD[0] - 60, p[0], k), L.lerp(BOARD[1] - 10, p[1] - 20, k), z]; }
    return camAt([[RA[1], [pa[0], pa[1] - 20, 4.0]], [30.4, [HA[0] + 8, HA[1] + 14, 12]], [CF1, [HA[0] + 8, HA[1] + 12, 12.6]]], t);
  }

  // ---------- snap panels ----------
  const SNAP0 = 18.2, SW1 = [18.9, 20.5], SW2 = [21.2, 22.8];
  const AX0 = 330, AX1 = 880, hx = h => L.lerp(AX0, AX1, h / 2);
  const LANES = [['B', 'IT desk'], ['D', 'neighbors'], ['A', 'operators'], ['C', 'coordinator']];
  function panel(ctx, t, y0, sweep, ai) {
    const head = L.clamp((t - sweep[0]) / (sweep[1] - sweep[0]), 0, 1) * 2;
    ctx.save(); ctx.fillStyle = '#171d25'; rr(ctx, 90, y0, 900, 500, 18); ctx.fill(); ctx.strokeStyle = '#2c3440'; ctx.lineWidth = 3; ctx.stroke();
    ctx.font = `58px "${SERIF}"`; ctx.fillStyle = '#f4f1ea'; ctx.textAlign = 'left'; ctx.fillText(ai ? 'With a board' : 'That night', 120, y0 + 72);
    if (ai) L.label(ctx, 'illustrative', 440, y0 + 70, 46, { col: '#aab2bc', align: 'left' });
    const ly = k => y0 + 140 + k * 72;
    LANES.forEach(([id, name], k) => { const y = ly(k); L.label(ctx, name, 310, y + 14, 44, { col: '#aab2bc', align: 'right' });
      ctx.strokeStyle = '#3a434e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(AX0, y); ctx.lineTo(AX1, y); ctx.stroke();
      let r = READY[id]; if (ai && id === 'A') r = AIH;   // the board routes the IT desk's piece to the operators
      if (head > r) { ctx.strokeStyle = GREEN; ctx.lineWidth = 9; ctx.beginPath(); ctx.moveTo(hx(r), y); ctx.lineTo(hx(Math.min(head, ai ? 2 : (id === 'C' ? 2 : C0))), y); ctx.stroke();
        ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(hx(r), y, 11, 0, 7); ctx.fill(); } });
    // grid lane
    const gy = ly(4);
    L.label(ctx, 'the grid', 310, gy + 14, 44, { col: '#aab2bc', align: 'right' });
    ctx.strokeStyle = '#3a434e'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(AX0, gy); ctx.lineTo(AX1, gy); ctx.stroke();
    if (head >= TRIP) { ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(hx(TRIP), gy, 9, 0, 7); ctx.fill(); }
    if (head >= C0) { const f = L.clamp((head - C0) / (C1 - C0), 0, 1);
      if (ai) { ctx.setLineDash([8, 8]); ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.strokeRect(hx(C0) - 4, gy - 30, hx(2) - hx(C0) + 8, 60); ctx.setLineDash([]);
        L.label(ctx, '?', hx(C0) - 30, gy + 16, 56, { col: '#ff8a80' }); }
      else { ctx.fillStyle = RED; ctx.fillRect(hx(C0) - 4, gy - 30, (hx(2) - hx(C0) + 8) * f, 60); } }
    // routing (ai) / noticing (human)
    if (ai) {
      [[AIH, 0, 2], [TRIP, 1, 2]].forEach(([hh, k0, k1]) => { if (head < hh) return; const x = hx(hh);
        ctx.strokeStyle = GREEN; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x, ly(k0)); ctx.lineTo(x, ly(k1)); ctx.stroke(); glow(ctx, x, (ly(k0) + ly(k1)) / 2, 60, '52,210,123', 0.35); });
      if (head >= AIH) L.label(ctx, 'routed', hx(AIH) + 14, ly(2) + 56, 44, { col: GREEN, align: 'left' });
    } else if (head >= AG.median) { const x = hx(AG.median); ctx.strokeStyle = GREEN; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, ly(2) + 14); ctx.lineTo(x, ly(2) + 40); ctx.stroke();
      L.label(ctx, '1.5 hours to notice', x + 20, ly(2) + 58, 44, { col: GREEN, align: 'right' }); }
    if (head < 2) { ctx.strokeStyle = 'rgba(255,253,247,0.7)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(hx(head), ly(0) - 30); ctx.lineTo(hx(head), gy + 30); ctx.stroke(); }
    ctx.restore();
  }
  function snap(ctx, t) {
    ctx.fillStyle = '#0e1319'; ctx.fillRect(0, 0, 1080, 1920);
    card(ctx, ['Same pieces. Same night.'], 300, 80, fade(t, 18.4, 21.0));
    panel(ctx, t, 360, SW1, false);
    if (t >= 20.9) { ctx.save(); ctx.globalAlpha = L.sm(20.9, 21.2, t); panel(ctx, t, 900, SW2, true); ctx.restore(); }
    card(ctx, ['It lights a line.', 'People still decide.'], 1500, 64, fade(t, 23.0, CF0 - 0.1), '#e8e4da');
    card(ctx, ['Same night, with a board.'], 300, 80, fade(t, 21.1, 23.6));
    card(ctx, ['Lag, not stupidity.'], 300, 80, fade(t, 23.8, CF0 - 0.1));
  }

  // ---------- draw ----------
  function draw(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    if (t < SNAP0) {
      const h = hAt(t), p = pulseReal(t);
      ctx.save(); applyCam(ctx, camReal(t));
      world(ctx, t, h, 'real', { pulse: p ? [p[0], p[1], 'w', t > W2[1] - 0.2 ? 1 - L.sm(W2[1] - 0.2, W2[1], t) : (t > W1[1] ? 0.35 + 0.3 * Math.sin(t * 20) : 1)] : null });
      ctx.restore();
      if (t < T0) L.label(ctx, 'that evening', 100, 1440, 46, { col: '#c8ced6', align: 'left' });
      card(ctx, ['POV: you\'re a switchboard.'], 330, 88, t < 0.05 ? 1 : fade(t, -1, T0 + 0.1, 0.25));
      card(ctx, ['That night,', 'you didn\'t exist.'], 300, 88, fade(t, T0 + 0.15, 4.3));
      card(ctx, ['Every line ran to nothing.'], 330, 80, fade(t, 4.6, 7.0));
      card(ctx, ['Each room held one piece.'], 300, 80, fade(t, 7.2, 9.5));
      card(ctx, ['No one saw the whole board.'], 270, 76, fade(t, 9.8, 12.3));
      card(ctx, ['50 million people.', 'Dark.'], 300, 88, fade(t, 13.4, 15.5));
      card(ctx, ['We slowed it down', 'so you could see it.'], 300, 84, fade(t, 15.7, 18.1, 0.35));
      slate(ctx, t < T0 ? 'SC0  CLOSE  (flash-forward)' : t < 4.4 ? 'SC1  CLOSE' : t < 7.9 ? 'SC2  POV WALK  (the signal)' : t < 9.8 ? 'SC3  PULL OUT' : t < 13.3 ? 'SC3  WIDE  1 s = 10 min' : t < 15.6 ? 'SC4  DOLLY IN  CLOSER' : 'SC4  HOLD  (dead stop)');
      if (t > 17.9) { ctx.fillStyle = `rgba(14,19,25,${L.sm(17.9, SNAP0, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
    } else if (t < CF0) {
      snap(ctx, t); slate(ctx, 'SC5  INSERT  TWO TIMELINES');
      if (t > CF0 - 0.3) { ctx.fillStyle = `rgba(14,19,25,${L.sm(CF0 - 0.3, CF0, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
    } else {
      const s = cfState(t);
      ctx.save(); applyCam(ctx, camCF(t)); world(ctx, t, AIH, 'ai', s); ctx.restore();
      if (t < CF0 + 0.3) { ctx.fillStyle = `rgba(14,19,25,${1 - L.sm(CF0, CF0 + 0.3, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
      L.label(ctx, 'illustrative', 100, 470, 46, { col: '#c8ced6', align: 'left', alpha: fade(t, CF0 + 0.2, CF1) });
      card(ctx, ['Now the board', 'lights the line.'], 300, 84, fade(t, 26.6, 28.9));
      card(ctx, ['They pick up.', 'They decide.'], 300, 88, fade(t, 29.1, 31.2));
      card(ctx, ['This is the bottleneck.'], 330, 92, fade(t, 31.3, CF1 + 0.1, 0.35));
      slate(ctx, t < 30.4 ? 'SC6  POV WALK  (lit line)' : 'SC6  CLOSEST');
      if (t >= CF1) L.endCard(ctx, L.sm(CF1, CF1 + 0.4, t), { line: 'The bottleneck is us.' });
    }
    L.grain(ctx, t, { alpha: 0.04, n: 400 });
  }

  const cascadeT = tOf(C0);
  return {
    draw, DUR,
    acts: [{ start: T0, end: cascadeT - 0.3, bpm: 0, drone: true }, { start: 9.8, end: cascadeT - 0.3, bpm: 62 }, { start: CF0, end: DUR, bpm: 0, drone: true }],
    cues: [{ t: T0, type: 'hit' }, { t: W1[0], type: 'whoosh' }, { t: W1[1], type: 'bonk' }, { t: tOf(TRIP), type: 'bonk' }, { t: 7.95, type: 'whoosh' },
      ...CALLS.map(c => ({ t: c.t + GROW, type: 'pop' })),
      { t: cascadeT, type: 'hit' }, { t: 13.4, type: 'whoosh' }, { t: 18.4, type: 'hit' }, { t: SW2[0] + (SW2[1] - SW2[0]) * AIH / 2, type: 'ding' },
      { t: RB[0], type: 'ding' }, { t: RA[1], type: 'ding' }, { t: CF1, type: 'stamp' }]
  };
}
if (typeof module !== 'undefined') module.exports = makeScene;
