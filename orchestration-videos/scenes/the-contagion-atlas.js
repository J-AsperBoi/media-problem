// the-contagion-atlas: man-in-a-hole, stained glass, crane up and drop down. Analog: gfc-2008.
// Red = analog threat.points extent (monthly S&P 500 share of the fall) over 40 market panes of a rose window,
//   ranked by distance along the lead lines from one origin pane. Pane red iff extent(day) >= rank.
// Green = 12 keepers in side chapels; arrival = L.lognormalQuantile((i+.5)/12, 426, 1077) (human)
//   or (220, 556) (ai_counterfactual, illustrative). Shards are carried across the nave into the rosette.
// Mapping: 1 s = 40 days while the race runs (day = 40 (t - 2.1)). Snap axis: 0-1100 days in 3 s.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('gfc-2008');
  const DUR = 38, RED = L.RED, GREEN = L.GREEN;
  const STONE = '#15171c', LEAD = '#07080a';

  // ---------- time ----------
  const DPS = 40, T0 = 2.1, HOOKDAY = 433;
  const dayAt = t => t < 1.5 ? HOOKDAY : t < T0 ? HOOKDAY * (1 - L.ease.inOut((t - 1.5) / 0.6)) : Math.min(700, DPS * (t - T0));
  const tOfDay = d => T0 + d / DPS;

  // ---------- threat ----------
  const pts = A.threat.points;
  const extent = d => { if (d <= 0) return 0; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1]; if (d <= b.t) return L.lerp(a.extent, b.extent, (d - a.t) / (b.t - a.t)); } return pts[pts.length - 1].extent; };

  // ---------- green ----------
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;
  const AIMED = A.ai_counterfactual.aggregation_median, AIP90 = AIMED * P90 / MED;
  const NK = 12;
  const hum = [], ai = [];
  for (let i = 0; i < NK; i++) { const q = (i + 0.5) / NK; hum.push(L.lognormalQuantile(q, MED, P90)); ai.push(L.lognormalQuantile(q, AIMED, AIP90)); }

  // ---------- rose geometry ----------
  const RC = [540, 640], R_OC = 72, R_RS = 185, R_A = 300, R_B = 430, TAU = Math.PI * 2;
  const sector = (r0, r1, a0, a1, n = 10) => { const P = []; for (let i = 0; i <= n; i++) { const a = L.lerp(a0, a1, i / n); P.push([RC[0] + Math.cos(a) * r1, RC[1] + Math.sin(a) * r1]); }
    for (let i = n; i >= 0; i--) { const a = L.lerp(a0, a1, i / n); P.push([RC[0] + Math.cos(a) * r0, RC[1] + Math.sin(a) * r0]); } return P; };
  const R = L.rng(2008);
  const panes = [];
  const NA = 16, NB = 24, offB = TAU / 48;
  for (let i = 0; i < NA; i++) { const a0 = -Math.PI / 2 + i * TAU / NA, a1 = a0 + TAU / NA; panes.push({ ring: 0, a0, a1, r0: R_RS, r1: R_A, poly: sector(R_RS + 4, R_A - 4, a0, a1, 8) }); }
  for (let j = 0; j < NB; j++) { const a0 = -Math.PI / 2 + offB + j * TAU / NB, a1 = a0 + TAU / NB; panes.push({ ring: 1, a0, a1, r0: R_A, r1: R_B, poly: sector(R_A + 4, R_B - 4, a0, a1, 8) }); }
  panes.forEach((p, i) => { p.i = i; p.c = (p.a0 + p.a1) / 2; const rm = (p.r0 + p.r1) / 2; p.cx = RC[0] + Math.cos(p.c) * rm; p.cy = RC[1] + Math.sin(p.c) * rm; p.lum = 62 + R() * 50; p.warm = R() * 8; p.nb = []; });
  const N = panes.length;
  // adjacency along lead lines + edge geometry
  const edges = [];
  const wrapNear = (a, ref) => { while (a - ref > Math.PI) a -= TAU; while (ref - a > Math.PI) a += TAU; return a; };
  for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) { const p = panes[i], q = panes[j];
    if (p.ring === q.ring) { const n = p.ring ? NB : NA, ii = p.ring ? i - NA : i, jj = q.ring ? j - NA : j;
      if ((ii + 1) % n === jj || (jj + 1) % n === ii) { const ang = (ii + 1) % n === jj ? p.a1 : q.a1; edges.push({ a: i, b: j, type: 'radial', ang, r0: p.r0, r1: p.r1 }); p.nb.push(j); q.nb.push(i); } }
    else { const qc = wrapNear(q.c, p.c), wp = p.a1 - p.a0, wq = q.a1 - q.a0; const lo = Math.max(p.c - wp / 2, qc - wq / 2), hi = Math.min(p.c + wp / 2, qc + wq / 2);
      if (hi - lo > 0.01) { edges.push({ a: i, b: j, type: 'arc', r: R_A, lo, hi }); p.nb.push(j); q.nb.push(i); } } }
  // BFS from an origin pane (outer ring, lower right) -> rank
  const ORIGIN = NA + 7;
  const dist = new Array(N).fill(Infinity); dist[ORIGIN] = 0; const Q = [ORIGIN];
  while (Q.length) { const u = Q.shift(); panes[u].nb.forEach(v => { if (dist[v] === Infinity) { dist[v] = dist[u] + 1; Q.push(v); } }); }
  const order = panes.map(p => ({ p, k: dist[p.i] + R() * 1.6 })).sort((a, b) => a.k - b.k).map(o => o.p);
  order.forEach((p, k) => { p.rank = (k + 0.5) / N; p.firstRed = Infinity; for (let d = 0; d <= 700; d += 1) if (extent(d) >= p.rank) { p.firstRed = d; break; } });
  const isRed = (p, d) => extent(d) >= p.rank;

  // rosette petals (the assembled fix)
  const petals = []; for (let k = 0; k < NK; k++) { const a0 = -Math.PI / 2 + k * TAU / NK, a1 = a0 + TAU / NK;
    petals.push({ a0, a1, c: (a0 + a1) / 2, poly: sector(R_OC + 5, R_RS - 5, a0 + 0.035, a1 - 0.035, 10), cx: RC[0] + Math.cos((a0 + a1) / 2) * 128, cy: RC[1] + Math.sin((a0 + a1) / 2) * 128 }); }

  // ---------- nave, chapels, keepers ----------
  const WALLY = 1150;
  const wallX = y => 330 - (y - WALLY) * 450 / 850;
  const chapels = [];
  for (let side = 0; side < 2; side++) for (let k = 0; k < 6; k++) { const f = k / 5, y = L.lerp(1800, 1212, Math.pow(f, 0.8)), s = 0.42 + (y - 1212) / 588 * 1.08;
    const xl = wallX(y) + 64 * s; chapels.push({ side, k, y, s, x: side ? 1080 - xl : xl }); }
  // keeper order by arrival: index 0..11. Hero = left nearest chapel (side 0, k 0) takes the tail (index 11).
  const chIdx = chapels.map((_, i) => i).filter(i => i !== 0); for (let i = chIdx.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [chIdx[i], chIdx[j]] = [chIdx[j], chIdx[i]]; }
  const keepers = []; for (let o = 0; o < NK; o++) { const ch = chapels[o === NK - 1 ? 0 : chIdx[o]]; keepers.push({ o, ch, hum: hum[o], ai: ai[o], slotX: 540 + (o - 5.5) * 36, slotY: 1222 }); }
  const HERO = keepers[NK - 1];
  // chapel lancets mirror one market pane each; the hero's goes red in the break month
  const heroPane = order[20];
  const lancetPool = order.filter(p => p !== heroPane); for (let i = lancetPool.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [lancetPool[i], lancetPool[j]] = [lancetPool[j], lancetPool[i]]; }
  chapels.forEach((c, i) => c.pane = i === 0 ? heroPane : lancetPool[i]);
  const wb = L.rng(31); const blocks = []; for (let i = 0; i < 70; i++) blocks.push([wb() * 1500 - 210, wb() * 1300 - 150, 80 + wb() * 110]);

  // ---------- colours / helpers ----------
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const mix = (a, b, f) => { const X = hex(a), Y = hex(b); return `rgb(${X.map((v, i) => Math.round(L.lerp(v, Y[i], f))).join(',')})`; };
  const grayOf = p => { const l = Math.round(p.lum); return `rgb(${l + p.warm | 0},${l + p.warm * 0.6 | 0},${l})`; };
  const paneCol = (p, d) => isRed(p, d) ? mix(RED, '#2a1c1c', 0.4 * L.clamp((d - p.firstRed) / 400, 0, 1)) : grayOf(p);
  const polyPath = (ctx, P) => { ctx.beginPath(); P.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); };
  function glowDot(ctx, x, y, r, rgb, a) { if (a <= 0.004) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
  function shard(ctx, x, y, r, rot, { a = 1, glow = 1, col = GREEN } = {}) {
    ctx.save(); ctx.globalAlpha *= a; if (glow > 0) glowDot(ctx, x, y, r * 3.4, '52,210,123', 0.5 * glow);
    ctx.translate(x, y); ctx.rotate(rot); const P = [[-1, -0.55], [0.15, -1], [1, -0.15], [0.45, 0.9], [-0.75, 0.6]];
    ctx.beginPath(); P.forEach(([u, v], i) => i ? ctx.lineTo(u * r, v * r) : ctx.moveTo(u * r, v * r)); ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = LEAD; ctx.lineWidth = Math.max(1, r * 0.14); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.moveTo(-0.6 * r, -0.35 * r); ctx.lineTo(0.1 * r, -0.7 * r); ctx.lineTo(-0.1 * r, -0.2 * r); ctx.closePath(); ctx.fill();
    ctx.restore(); }
  const heroNum = d => keepers.filter(k => d >= k.hum).length;

  // ---------- the rose window ----------
  // lane: 'hum' | 'ai'. setOverride: optional function(k) -> 0..1 progress of the shard for staged shots.
  function rose(ctx, d, lane, { heat = true } = {}) {
    ctx.save();
    ctx.beginPath(); ctx.arc(RC[0], RC[1], R_B, 0, TAU); ctx.fillStyle = '#0b0c0f'; ctx.fill();
    panes.forEach(p => { polyPath(ctx, p.poly); ctx.fillStyle = paneCol(p, d); ctx.fill();
      const g = ctx.createLinearGradient(p.cx - 50, p.cy - 50, p.cx + 50, p.cy + 50); g.addColorStop(0, 'rgba(255,255,255,0.14)'); g.addColorStop(1, 'rgba(0,0,0,0.2)'); ctx.fillStyle = g; ctx.fill(); });
    // rosette
    const set = keepers.filter(k => d >= k[lane]).length;
    petals.forEach((pt, k) => { polyPath(ctx, pt.poly); const on = k < set; ctx.fillStyle = on ? GREEN : '#3b3e44'; ctx.fill();
      if (on) { const fr = 1 - L.clamp((d - keepers[k][lane]) / 20, 0, 1); if (fr > 0) { ctx.fillStyle = `rgba(215,255,230,${0.6 * fr})`; ctx.fill(); } } });
    ctx.beginPath(); ctx.arc(RC[0], RC[1], R_OC - 5, 0, TAU); ctx.fillStyle = set === NK ? GREEN : '#2c2f35'; ctx.fill();
    if (set === NK) glowDot(ctx, RC[0], RC[1], 200, '52,210,123', 0.35);
    // lead came
    ctx.strokeStyle = LEAD; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    panes.forEach(p => { ctx.lineWidth = 10; polyPath(ctx, p.poly); ctx.stroke(); });
    petals.forEach(pt => { ctx.lineWidth = 10; polyPath(ctx, pt.poly); ctx.stroke(); });
    [R_OC, R_RS, R_A].forEach(r => { ctx.lineWidth = 12; ctx.beginPath(); ctx.arc(RC[0], RC[1], r, 0, TAU); ctx.stroke(); });
    // hot lead: red crossing a lead line into a gray neighbour
    if (heat) edges.forEach(e => { const ra = isRed(panes[e.a], d), rb = isRed(panes[e.b], d); if (ra === rb) return;
      ctx.strokeStyle = 'rgba(255,59,48,0.9)'; ctx.lineWidth = 5; ctx.beginPath();
      if (e.type === 'radial') { ctx.moveTo(RC[0] + Math.cos(e.ang) * (e.r0 + 6), RC[1] + Math.sin(e.ang) * (e.r0 + 6)); ctx.lineTo(RC[0] + Math.cos(e.ang) * (e.r1 - 6), RC[1] + Math.sin(e.ang) * (e.r1 - 6)); }
      else ctx.arc(RC[0], RC[1], e.r, e.lo + 0.02, e.hi - 0.02);
      ctx.stroke(); });
    // tracery bosses
    ctx.fillStyle = '#3a3c42';
    for (let j = 0; j < NB; j++) { const a = -Math.PI / 2 + offB + j * TAU / NB; ctx.beginPath(); ctx.arc(RC[0] + Math.cos(a) * R_B, RC[1] + Math.sin(a) * R_B, 13, 0, TAU); ctx.fill(); }
    // stone frame
    ctx.beginPath(); ctx.arc(RC[0], RC[1], R_B + 10, 0, TAU); ctx.strokeStyle = '#3a3c42'; ctx.lineWidth = 26; ctx.stroke();
    ctx.beginPath(); ctx.arc(RC[0], RC[1], R_B + 26, 0, TAU); ctx.strokeStyle = '#23252a'; ctx.lineWidth = 8; ctx.stroke();
    ctx.restore();
    return set;
  }

  // ---------- figures ----------
  function bean(ctx, x, y, s, { col = '#9a9ea6', mood = 'calm', look = [0, -1], hold = false, light = null, lightA = 0, reach = 0 } = {}) {
    const bw = 46 * s, bh = 60 * s; ctx.save();
    ctx.beginPath(); ctx.roundRect(x - bw / 2, y - bh / 2, bw, bh, bw / 2); ctx.fillStyle = col; ctx.fill();
    if (light && lightA > 0) { ctx.save(); ctx.clip(); const g = ctx.createLinearGradient(x, y - bh / 2, x, y + bh * 0.3); g.addColorStop(0, `rgba(${light},${lightA})`); g.addColorStop(1, `rgba(${light},0)`); ctx.fillStyle = g; ctx.fillRect(x - bw, y - bh, bw * 2, bh * 2); ctx.restore(); }
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 2 * s; ctx.beginPath(); ctx.roundRect(x - bw / 2, y - bh / 2, bw, bh, bw / 2); ctx.stroke();
    const ey = y - bh * 0.16, er = bw * 0.13;
    [-1, 1].forEach(sd => { const ex = x + sd * bw * 0.19;
      ctx.fillStyle = '#f2efe8'; ctx.beginPath(); ctx.arc(ex, ey, er, 0, 7); ctx.fill();
      ctx.fillStyle = '#1b1f27'; ctx.beginPath(); ctx.arc(ex + look[0] * er * 0.45, ey + look[1] * er * 0.45, er * 0.5, 0, 7); ctx.fill();
      if (mood === 'sad' || mood === 'worry') { ctx.strokeStyle = '#1b1f27'; ctx.lineWidth = 2.2 * s; ctx.beginPath(); ctx.moveTo(ex - er * 1.1, ey - er * 1.3 - sd * er * 0.45); ctx.lineTo(ex + er * 1.1, ey - er * 1.3 + sd * er * 0.45); ctx.stroke(); } });
    const my = y + bh * 0.12; ctx.strokeStyle = '#1b1f27'; ctx.lineWidth = 2.6 * s; ctx.lineCap = 'round'; ctx.beginPath();
    if (mood === 'sad') ctx.arc(x, my + bw * 0.12, bw * 0.12, 1.2 * Math.PI, 1.8 * Math.PI);
    else if (mood === 'awe' || mood === 'worry') ctx.ellipse(x, my, bw * 0.06, bw * 0.08, 0, 0, 7);
    else if (mood === 'soft') ctx.arc(x, my - bw * 0.05, bw * 0.12, 0.2 * Math.PI, 0.8 * Math.PI);
    else { ctx.moveTo(x - bw * 0.08, my); ctx.lineTo(x + bw * 0.08, my); }
    ctx.stroke();
    if (hold) { ctx.strokeStyle = '#6f737b'; ctx.lineWidth = 6.5 * s; [-1, 1].forEach(sd => { ctx.beginPath(); ctx.moveTo(x + sd * bw * 0.46, y + bh * 0.02); ctx.lineTo(x + sd * bw * 0.16, y + bh * 0.3 - reach * bh * 0.5); ctx.stroke(); }); }
    ctx.restore(); return { hx: x, hy: y + bh * 0.3 - reach * bh * 0.5 };
  }
  function lancetPath(ctx, x, top, w, h) { ctx.beginPath(); ctx.moveTo(x - w / 2, top + h); ctx.lineTo(x - w / 2, top + w * 0.6); ctx.quadraticCurveTo(x - w / 2, top, x, top - w * 0.2); ctx.quadraticCurveTo(x + w / 2, top, x + w / 2, top + w * 0.6); ctx.lineTo(x + w / 2, top + h); ctx.closePath(); }
  function chapel(ctx, c, d) {
    const s = c.s, w = 170 * s, h = 300 * s, top = c.y - h;
    ctx.beginPath(); ctx.moveTo(c.x - w / 2, c.y); ctx.lineTo(c.x - w / 2, top + w / 2); ctx.arc(c.x, top + w / 2, w / 2, Math.PI, 0); ctx.lineTo(c.x + w / 2, c.y); ctx.closePath();
    ctx.fillStyle = '#0e0f13'; ctx.fill(); ctx.strokeStyle = '#34363c'; ctx.lineWidth = 10 * s; ctx.stroke();
    const red = isRed(c.pane, d), lw = 56 * s, lt = c.y - 285 * s, lh = 150 * s;
    if (red) glowDot(ctx, c.x, lt + lh * 0.6, 160 * s, '255,59,48', 0.28);
    lancetPath(ctx, c.x, lt, lw, lh); ctx.fillStyle = paneCol(c.pane, d); ctx.fill(); ctx.strokeStyle = LEAD; ctx.lineWidth = 6 * s; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(c.x, lt); ctx.lineTo(c.x, lt + lh); ctx.stroke();
    return red;
  }
  // keeper position at day d in a lane
  function keeperState(k, d, lane) {
    const arr = k[lane], c = k.ch;
    if (d < arr - 45) return { x: c.x, y: c.y, s: c.s * 1.5, carry: 0, rise: 0 };
    if (d < arr - 12) { const f = L.ease.inOut((d - (arr - 45)) / 33); const bob = Math.abs(Math.sin(f * 14)) * 4 * c.s;
      return { x: L.lerp(c.x, k.slotX, f), y: L.lerp(c.y, k.slotY, f) - bob, s: L.lerp(c.s, 0.6, f) * 1.5, carry: 1, rise: 0 }; }
    return { x: k.slotX, y: k.slotY, s: 0.9, carry: 1, rise: L.clamp((d - (arr - 12)) / 12, 0, 1) };
  }
  function drawKeeper(ctx, k, d, lane, t, { mood } = {}) {
    const st = keeperState(k, d, lane), bh = 60 * st.s, cy = st.y - bh / 2;
    const inChapel = st.carry === 0, redLit = inChapel && isRed(k.ch.pane, d);
    const set = keepers.filter(q => d >= q[lane]).length;
    const light = redLit ? '255,59,48' : (!inChapel && set > 0 ? '52,210,123' : null);
    const m = mood || (redLit ? 'worry' : st.rise >= 1 ? 'soft' : 'calm');
    const h = bean(ctx, st.x, cy, st.s, { mood: m, look: [0, -1], hold: st.rise < 1, light, lightA: redLit ? 0.55 : 0.18 + 0.3 * set / NK });
    if (st.rise < 1) shard(ctx, h.hx, h.hy, 9 * st.s, 0.7, { glow: 1 });
    if (st.rise > 0 && st.rise < 1) { const pt = petals[k.o], f = L.ease.inOut(st.rise); const x = L.lerp(h.hx, pt.cx, f), y = L.lerp(h.hy, pt.cy, f);
      ctx.strokeStyle = 'rgba(52,210,123,0.55)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(h.hx, h.hy); ctx.lineTo(x, y); ctx.stroke(); shard(ctx, x, y, 10, 0.7, { glow: 1.3 }); }
    return st;
  }
  function nave(ctx, d, lane, t) {
    ctx.fillStyle = STONE; ctx.fillRect(-3000, -3000, 7080, 7920);
    ctx.strokeStyle = 'rgba(255,255,255,0.035)'; ctx.lineWidth = 3; blocks.forEach(([x, y, w]) => ctx.strokeRect(x, y, w, w * 0.5));
    const set = rose(ctx, d, lane);
    // floor
    ctx.beginPath(); ctx.moveTo(330, WALLY); ctx.lineTo(750, WALLY); ctx.lineTo(1200 + 900, 2000 + 1200); ctx.lineTo(-120 - 900, 2000 + 1200); ctx.closePath(); ctx.fillStyle = '#1b1d22'; ctx.fill();
    ctx.fillStyle = '#2a2c32'; ctx.fillRect(-3000, WALLY - 6, 7080, 12);
    ctx.save(); ctx.clip();
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 3; for (let i = -8; i <= 8; i++) { ctx.beginPath(); ctx.moveTo(540 + i * 26, WALLY); ctx.lineTo(540 + i * 150, 2400); ctx.stroke(); }
    const ex = extent(d), redShare = panes.filter(p => isRed(p, d)).length / N;
    ctx.fillStyle = `rgba(255,59,48,${0.13 * redShare})`; ctx.fillRect(-3000, WALLY, 7080, 3000);
    // aisle
    ctx.beginPath(); ctx.moveTo(505, WALLY); ctx.lineTo(575, WALLY); ctx.lineTo(760, 2400); ctx.lineTo(320, 2400); ctx.closePath(); ctx.fillStyle = `rgba(52,210,123,${0.03 + 0.16 * set / NK})`; ctx.fill();
    ctx.restore();
    // chapels (far to near) and keepers
    const chs = chapels.slice().sort((a, b) => a.y - b.y); chs.forEach(c => chapel(ctx, c, d));
    const ks = keepers.map(k => ({ k, st: keeperState(k, d, lane) })).sort((a, b) => a.st.y - b.st.y);
    ks.forEach(({ k }) => drawKeeper(ctx, k, d, lane, t));
    return { set, ex };
  }

  // ---------- text ----------
  function card(ctx, lines, y, size, a) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center'; let yy = y;
    lines.forEach((l, i) => { const o = typeof l === 'string' ? { text: l } : l; let fz = o.size || size; ctx.font = `${fz}px "${SERIF}"`;
      while (ctx.measureText(o.text).width > 700 && fz > 30) { fz -= 4; ctx.font = `${fz}px "${SERIF}"`; }
      if (i) yy += fz * 1.06; ctx.lineJoin = 'round'; ctx.lineWidth = fz * 0.16; ctx.strokeStyle = 'rgba(8,9,11,0.95)'; ctx.strokeText(o.text, 540, yy);
      ctx.fillStyle = o.col || '#f4f1ea'; ctx.fillText(o.text, 540, yy); });
    ctx.restore(); }
  const fade = (t, a, b, f = 0.3) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));
  const slate = (ctx, s) => { ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(40, 1818, 600, 58); ctx.restore(); L.slate(ctx, s); };

  // ---------- camera ----------
  const HX = HERO.ch.x;
  const CK = [[0, HX + 10, 1600, 3.0], [2.1, HX + 10, 1600, 3.0], [6.5, HX + 12, 1605, 2.8], [10.0, 540, 1000, 0.86], [14.0, 540, 1000, 0.86], [16.0, HX + 5, 1680, 4.3], [19.6, HX + 5, 1684, 4.6]];
  const CK2 = [[30.0, 540, 900, 1.3], [30.4, 540, 900, 1.3], [32.2, HERO.slotX - 16, 1180, 7.5], [33.6, HERO.slotX - 16, 1182, 7.8]];
  function camAt(K, t) { if (t <= K[0][0]) return K[0].slice(1); for (let i = 0; i < K.length - 1; i++) { const a = K[i], b = K[i + 1]; if (t <= b[0]) { const f = L.ease.inOut((t - a[0]) / (b[0] - a[0]));
    return [L.lerp(a[1], b[1], f), L.lerp(a[2], b[2], f), Math.exp(L.lerp(Math.log(a[3]), Math.log(b[3]), f))]; } } return K[K.length - 1].slice(1); }
  function applyCam(ctx, [x, y, z], sx = 0, sy = 0) { ctx.translate(540 + sx, 960 + sy); ctx.scale(z, z); ctx.translate(-x, -y); }

  // ---------- snap ----------
  const SPAN = 1100, AX0 = 130, AX1 = 950;
  function panel(ctx, top, d, lane, a, title, sub) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = '#17191e'; ctx.beginPath(); ctx.roundRect(80, top, 920, 590, 24); ctx.fill();
    ctx.save(); ctx.translate(320, top + 262); ctx.scale(0.54, 0.54); ctx.translate(-RC[0], -RC[1]); rose(ctx, d, lane); ctx.restore();
    // axis: red extent (identical) + green pips
    const ay = top + 555, xOf = dd => L.lerp(AX0, AX1, dd / SPAN);
    ctx.beginPath(); ctx.moveTo(AX0, ay); for (let dd = 0; dd <= SPAN; dd += 5) ctx.lineTo(xOf(dd), ay - 46 * extent(dd)); ctx.lineTo(AX1, ay); ctx.closePath();
    ctx.fillStyle = 'rgba(255,59,48,0.25)'; ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.rect(AX0, ay - 60, xOf(d) - AX0, 70); ctx.clip();
    ctx.beginPath(); ctx.moveTo(AX0, ay); for (let dd = 0; dd <= SPAN; dd += 5) ctx.lineTo(xOf(dd), ay - 46 * extent(dd)); ctx.lineTo(AX1, ay); ctx.closePath(); ctx.fillStyle = RED; ctx.fill(); ctx.restore();
    ctx.fillStyle = '#4a4d55'; ctx.fillRect(AX0, ay, AX1 - AX0, 3);
    keepers.forEach(k => { const v = k[lane]; if (v > SPAN) return; const x = xOf(v), on = d >= v; ctx.beginPath(); ctx.moveTo(x, ay + 8); ctx.lineTo(x + 9, ay + 18); ctx.lineTo(x, ay + 28); ctx.lineTo(x - 9, ay + 18); ctx.closePath();
      ctx.fillStyle = on ? GREEN : '#2b2e35'; ctx.fill(); ctx.strokeStyle = on ? GREEN : '#5a5e66'; ctx.lineWidth = 2; ctx.stroke(); });
    ctx.fillStyle = '#f4f1ea'; ctx.fillRect(xOf(d) - 2, ay - 64, 4, 96);
    ctx.restore();
    L.label(ctx, title, 775, top + 150, 50, { alpha: a, col: '#e8e4da' });
    if (sub) L.label(ctx, sub, 775, top + 212, 48, { alpha: a, col: '#e8e4da' });
  }
  function snap(ctx, t) {
    ctx.fillStyle = '#0d0e11'; ctx.fillRect(0, 0, 1080, 1920);
    const a1 = L.sm(22.5, 22.7, t), a2 = L.sm(25.6, 25.9, t);
    const d1 = t < 25.7 ? SPAN * L.clamp((t - 22.5) / 3, 0, 1) : SPAN * L.clamp((t - 25.9) / 3, 0, 1);
    panel(ctx, 300, d1, 'hum', a1, 'as it happened', null);
    panel(ctx, 920, SPAN * L.clamp((t - 25.9) / 3, 0, 1), 'ai', a2, 'faster routing', 'illustrative');
    card(ctx, ['True speed.'], 262, 68, fade(t, 22.6, 25.5));
    card(ctx, ['Same red. Faster routing.'], 262, 64, fade(t, 25.9, 30.0));
  }

  // ---------- draw ----------
  function draw(ctx, t) {
    ctx.fillStyle = STONE; ctx.fillRect(0, 0, 1080, 1920);
    if (t < 19.6) {
      const d = dayAt(t);
      let sx = 0, sy = 0; if (t > 10 && t < 14.5) { const sl = Math.abs(extent(d + 5) - extent(d - 5)) / 10, amp = Math.min(12, 1300 * sl); sx = (L.noise(t * 18, 1) - 0.5) * 2 * amp; sy = (L.noise(t * 18, 2) - 0.5) * 2 * amp; }
      if (t > 1.5 && t < 2.1) sx += Math.sin(t * 90) * 5;
      ctx.save(); applyCam(ctx, camAt(CK, t), sx, sy);
      const { set } = nave(ctx, d, 'hum', t);
      // hero light: rosette green grows on the face in the climb
      if (t > 14) { const g = set / NK; glowDot(ctx, HX, HERO.ch.y - 150, 150, '52,210,123', 0.18 * g * L.sm(16.2, 18.5, t)); }
      ctx.restore();
      if (t > 1.5 && t < 2.1) { const rw = Math.sin((t - 1.5) / 0.6 * Math.PI); ctx.save(); ctx.globalAlpha = 0.25 * rw; ctx.fillStyle = '#dfe6e2'; for (let k = 0; k < 7; k++) ctx.fillRect(0, (k * 311 + t * 4000) % 1920, 1080, 6); ctx.restore(); }
      // cards
      if (t < 1.5) L.label(ctx, 'LATER', 540, 250, 46, { col: '#e8e4da', alpha: 0.9 });
      card(ctx, ['The fix was', 'one aisle away.'], 360, 100, t < 1.25 ? 1 : 1 - L.sm(1.25, 1.5, t));
      card(ctx, ['Every chapel', 'kept a fix.'], 330, 100, fade(t, 2.3, 4.3));
      card(ctx, ['Nobody carried', 'it across.'], 330, 100, fade(t, 4.4, 6.4));
      card(ctx, ['Each pane, a market.'], 1180, 88, fade(t, 7.3, 8.8));
      card(ctx, ['Each lead line, a debt.'], 1180, 88, fade(t, 8.9, 10.5));
      card(ctx, ['Slow drift.'], 1180, 100, fade(t, 10.6, 12.1));
      card(ctx, ['Then the drop.'], 1180, 100, fade(t, 12.25, 14.0));
      card(ctx, ['The fall stopped.'], 300, 96, fade(t, 16.8, 18.25));
      card(ctx, ['Most fixes', 'came after.'], 300, 96, fade(t, 18.3, 19.6, 0.2));
      slate(ctx, t < 1.5 ? 'SC1  CLOSE  (flash-forward)' : t < 2.1 ? 'SC1  REWIND' : t < 6.5 ? 'SC2  CLOSE' : t < 10 ? 'SC3  CRANE UP' : t < 14 ? 'SC4  WIDE' : t < 16 ? 'SC5  DROP DOWN' : 'SC6  CLOSE+');
    } else if (t < 22.0) {
      ctx.save(); applyCam(ctx, camAt(CK, 19.6)); nave(ctx, 700, 'hum', 19.6); ctx.restore();
      ctx.fillStyle = `rgba(8,9,11,${0.62 * L.sm(19.6, 19.95, t)})`; ctx.fillRect(0, 0, 1080, 1920);
      card(ctx, ['We slowed it down', 'so you could see it.'], 860, 96, fade(t, 19.7, 21.9));
      slate(ctx, 'SC7  FREEZE');
    } else if (t < 30.0) {
      snap(ctx, t); slate(ctx, 'SC8  SNAP  FLAT');
    } else {
      // IN++: routed lane, held tableau at the hero's (illustrative) arrival
      const d = L.lerp(752, 772, L.sm(30.6, 32.8, t));
      ctx.save(); applyCam(ctx, camAt(CK2, t)); nave(ctx, d, 'ai', t);
      // a second keeper's hand on the same shard
      const nb = keepers[NK - 2], st = keeperState(HERO, d, 'ai');
      const bh = 54, hx = st.x, hy = st.y - bh / 2 + bh * 0.3;
      if (d < HERO.ai) { ctx.strokeStyle = '#6f737b'; ctx.lineWidth = 5.8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(nb.slotX + 19, nb.slotY - 27); ctx.lineTo(L.lerp(nb.slotX + 22, hx - 5, 1), hy); ctx.stroke(); }
      // the route: a pale thread (not green) from the hero's chapel to the aisle foot
      ctx.save(); ctx.setLineDash([8, 7]); ctx.strokeStyle = `rgba(225,232,228,${0.5 * (1 - L.sm(32.6, 33.2, t))})`; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(HERO.ch.x, HERO.ch.y - 60); ctx.lineTo(hx, hy); ctx.stroke(); ctx.restore();
      ctx.restore();
      card(ctx, ['Same keepers.', 'Found sooner.'], 380, 100, fade(t, 30.4, 32.4));
      ctx.fillStyle = `rgba(8,9,11,${0.4 * L.sm(32.4, 32.8, t)})`; ctx.fillRect(0, 0, 1080, 1920);
      card(ctx, ['This is', 'the bottleneck.'], 380, 112, fade(t, 32.5, 33.9));
      slate(ctx, t < 32.2 ? 'SC9  DROP DOWN' : 'SC9  EXTREME CLOSE');
      if (t >= 33.6) L.endCard(ctx, L.sm(33.6, 34.0, t), { line: 'The bottleneck is us.' });
    }
    L.grain(ctx, t, { alpha: 0.045, n: 400 });
  }

  return { draw, DUR,
    acts: [{ start: 0, end: 19.6, bpm: 0, drone: true }, { start: 10, end: 16.7, bpm: 52 }, { start: 22.5, end: 30, bpm: 0, drone: true }, { start: 30, end: 38, bpm: 0, drone: true }],
    cues: [{ t: 1.5, type: 'whoosh' }, { t: 6.5, type: 'whoosh' }, { t: tOfDay(403), type: 'hit' }, { t: 14.0, type: 'whoosh' }, { t: 22.5, type: 'hit' }, { t: 25.9, type: 'pop' }, { t: 32.4, type: 'ding' }],
    _debug: { N, edges: edges.length, hum, ai, heroPaneRed: heroPane.firstRed, heroRank: heroPane.rank } };
}
module.exports = makeScene;
