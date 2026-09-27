// cracks-in-the-map: nature-documentary, topographic map, continuous zoom through scales. Analog: gfc-2008.
// Red = threat.points extent (monthly S&P 500 share of the peak-to-trough fall), drawn as the exact share of the
//   crack network's total length. Order fixed at setup: seams (the old sheet lines = the rules) by distance from an
//   origin until 41%, then five terrain faults in parallel, then remaining seams by distance from the flood.
// Green = 12 surveyors, arrival = L.lognormalQuantile((i+.5)/12, 426, 1077) (human) or (220, 556) (AI, illustrative).
// Mapping: race 1 s = 40 days (day = 40 (t - 2.3)). Snap: 0-1100 days in 3 s per lane.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('gfc-2008');
  const DUR = 40, RED = L.RED, GREEN = L.GREEN;
  const TAU = Math.PI * 2;

  // ---------- time ----------
  const DPS = 40, T0 = 2.3, HOOKDAY = 433, RACE_END = 600;
  const dayAt = t => t < 2.0 ? HOOKDAY : Math.min(RACE_END, Math.max(0, DPS * (t - T0)));
  const tOfDay = d => T0 + d / DPS;

  // ---------- threat ----------
  const pts = A.threat.points;
  const extent = d => { if (d <= 0) return 0; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1]; if (d <= b.t) return L.lerp(a.extent, b.extent, (d - a.t) / (b.t - a.t)); } return pts[pts.length - 1].extent; };

  // ---------- green ----------
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;
  const AIMED = A.ai_counterfactual.aggregation_median, AIP90 = AIMED * P90 / MED;
  const NK = 12, hum = [], ai = [];
  for (let i = 0; i < NK; i++) { const q = (i + 0.5) / NK; hum.push(L.lognormalQuantile(q, MED, P90)); ai.push(L.lognormalQuantile(q, AIMED, AIP90)); }

  // ---------- terrain ----------
  const MX0 = 40, MX1 = 1040, MY0 = 100, MY1 = 1820;
  const hash = (i, j, s) => { const v = Math.sin(i * 127.1 + j * 311.7 + s * 74.7) * 43758.5453; return v - Math.floor(v); };
  const vn = (x, y, s) => { const i = Math.floor(x), j = Math.floor(y), fx = x - i, fy = y - j, u = fx * fx * (3 - 2 * fx), v = fy * fy * (3 - 2 * fy);
    return L.lerp(L.lerp(hash(i, j, s), hash(i + 1, j, s), u), L.lerp(hash(i, j + 1, s), hash(i + 1, j + 1, s), u), v); };
  const H = (x, y) => 0.55 * vn(x / 300, y / 300, 1) + 0.28 * vn(x / 140, y / 140, 2) + 0.17 * vn(x / 62, y / 62, 3);
  const LEVELS = []; for (let v = 0.12; v < 0.92; v += 0.042) LEVELS.push(v);
  function contours(x0, y0, cell, nx, ny) {
    const g = new Float32Array((nx + 1) * (ny + 1)); for (let j = 0; j <= ny; j++) for (let i = 0; i <= nx; i++) g[j * (nx + 1) + i] = H(x0 + i * cell, y0 + j * cell);
    return LEVELS.map(lv => { const out = [];
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const a = g[j * (nx + 1) + i], b = g[j * (nx + 1) + i + 1], c = g[(j + 1) * (nx + 1) + i + 1], d = g[(j + 1) * (nx + 1) + i];
        const P = []; const X = x0 + i * cell, Y = y0 + j * cell;
        if ((a < lv) !== (b < lv)) P.push(X + cell * (lv - a) / (b - a), Y);
        if ((b < lv) !== (c < lv)) P.push(X + cell, Y + cell * (lv - b) / (c - b));
        if ((d < lv) !== (c < lv)) P.push(X + cell * (lv - d) / (c - d), Y + cell);
        if ((a < lv) !== (d < lv)) P.push(X, Y + cell * (lv - a) / (d - a));
        if (P.length >= 4) out.push(P[0], P[1], P[2], P[3]); if (P.length === 8) out.push(P[4], P[5], P[6], P[7]);
      } return new Float32Array(out); });
  }
  const COARSE = contours(MX0, MY0, 6, Math.round((MX1 - MX0) / 6), Math.round((MY1 - MY0) / 6));

  // ---------- the old map: sheet lattice (the rules) ----------
  const R = L.rng(2007);
  const NXN = 5, NYN = 8, SW = (MX1 - MX0) / 4, SH = (MY1 - MY0) / 7;
  const node = []; for (let j = 0; j < NYN; j++) for (let i = 0; i < NXN; i++) { const border = i === 0 || i === NXN - 1 || j === 0 || j === NYN - 1;
    node.push({ i, j, x: MX0 + i * SW + (border ? 0 : (R() - 0.5) * 44), y: MY0 + j * SH + (border ? 0 : (R() - 0.5) * 44), nb: [] }); }
  const NI = (i, j) => j * NXN + i;
  const jag = (x1, y1, x2, y2, n, amp, seed) => { const P = []; const nx = -(y2 - y1), ny = x2 - x1, nl = Math.hypot(nx, ny) || 1;
    for (let k = 0; k <= n; k++) { const f = k / n, env = Math.sin(Math.PI * f); const j = ((L.noise(k * 0.35, seed) - 0.5) * 2 * amp + (hash(k, seed, 9) - 0.5) * 3.2) * (k === 0 || k === n ? 0 : Math.max(env, 0.35));
      P.push([L.lerp(x1, x2, f) + nx / nl * j, L.lerp(y1, y2, f) + ny / nl * j]); } return P; };
  const seams = [];
  const addSeam = (a, b) => { const A1 = node[a], B1 = node[b]; const P = jag(A1.x, A1.y, B1.x, B1.y, 40, 7, seams.length * 3 + 11); let l = 0; for (let k = 1; k < P.length; k++) l += Math.hypot(P[k][0] - P[k - 1][0], P[k][1] - P[k - 1][1]);
    const e = { a, b, P, len: l }; seams.push(e); A1.nb.push([b, l]); B1.nb.push([a, l]); };
  for (let i = 1; i <= 3; i++) for (let j = 0; j < NYN - 1; j++) addSeam(NI(i, j), NI(i, j + 1));
  for (let j = 1; j <= 6; j++) for (let i = 0; i < NXN - 1; i++) addSeam(NI(i, j), NI(i + 1, j));
  const ORIGIN = NI(1, 5), O = node[ORIGIN];
  // Dijkstra over seams from the origin
  const dA = node.map(() => Infinity); dA[ORIGIN] = 0; const done = new Set();
  while (done.size < node.length) { let u = -1, best = Infinity; node.forEach((_, k) => { if (!done.has(k) && dA[k] < best) { best = dA[k]; u = k; } }); if (u < 0) break; done.add(u);
    node[u].nb.forEach(([v, w]) => { if (dA[u] + w < dA[v]) dA[v] = dA[u] + w; }); }

  // faults: meander from the origin toward the map edges, following no rule
  const faultTargets = [[1020, 150], [70, 170], [1030, 1180], [760, 1810], [60, 860]];
  const faults = faultTargets.map((tg, f) => { const P = [[O.x, O.y]]; let x = O.x, y = O.y; const n = 120; const rr = L.rng(90 + f);
    for (let k = 1; k <= n; k++) { const fr = k / n; const bx = L.lerp(O.x, tg[0], fr), by = L.lerp(O.y, tg[1], fr); const dx = tg[0] - O.x, dy = tg[1] - O.y, dl = Math.hypot(dx, dy);
      const m = Math.sin(fr * Math.PI * (2.2 + f * 0.4) + f) * 75 * Math.sin(Math.PI * fr) + (L.noise(k * 0.3, 40 + f) - 0.5) * 22;
      x = bx - dy / dl * m + (rr() - 0.5) * 3; y = by + dx / dl * m + (rr() - 0.5) * 3; P.push([x, y]); } return { P }; });

  // subsegments with rank = cumulative share of total length
  const subs = [];
  seams.forEach((e, ei) => { let s = 0; for (let k = 0; k < e.P.length - 1; k++) { const [x1, y1] = e.P[k], [x2, y2] = e.P[k + 1]; const l = Math.hypot(x2 - x1, y2 - y1); const sm = s + l / 2;
    subs.push({ kind: 'seam', x1, y1, x2, y2, l, mx: (x1 + x2) / 2, my: (y1 + y2) / 2, dA: Math.min(dA[e.a] + sm, dA[e.b] + e.len - sm) }); s += l; } });
  faults.forEach((F, fi) => { let tot = 0; for (let k = 0; k < F.P.length - 1; k++) tot += Math.hypot(F.P[k + 1][0] - F.P[k][0], F.P[k + 1][1] - F.P[k][1]); let s = 0;
    for (let k = 0; k < F.P.length - 1; k++) { const [x1, y1] = F.P[k], [x2, y2] = F.P[k + 1]; const l = Math.hypot(x2 - x1, y2 - y1);
      subs.push({ kind: 'fault', x1, y1, x2, y2, l, mx: (x1 + x2) / 2, my: (y1 + y2) / 2, frac: (s + l / 2) / tot }); s += l; } });
  const Ltot = subs.reduce((a, s) => a + s.l, 0);
  const seamSubs = subs.filter(s => s.kind === 'seam').sort((a, b) => a.dA - b.dA), faultSubs = subs.filter(s => s.kind === 'fault').sort((a, b) => a.frac - b.frac);
  const STAGE_A = 0.412; let cum = 0; const ordered = []; let k0 = 0;
  while (k0 < seamSubs.length && cum + seamSubs[k0].l <= STAGE_A * Ltot) { ordered.push(seamSubs[k0]); cum += seamSubs[k0].l; k0++; }
  const rest = seamSubs.slice(k0); const flooded = ordered.concat(faultSubs);
  rest.forEach(s => { let m = Infinity; for (let q = 0; q < flooded.length; q += 2) { const f = flooded[q]; const dd = (f.mx - s.mx) ** 2 + (f.my - s.my) ** 2; if (dd < m) m = dd; } s.dC = m; });
  rest.sort((a, b) => a.dC - b.dC);
  cum = 0; ordered.concat(faultSubs, rest).forEach(s => { s.rank = cum / Ltot; cum += s.l; });
  const FAULT_SHARE = faultSubs.reduce((a, s) => a + s.l, 0) / Ltot; // logged for notes
  if (process.env.CRACK_DEBUG) console.log('fault share', FAULT_SHARE.toFixed(3), 'stage A', (ordered.reduce((a, s) => a + s.l, 0) / Ltot).toFixed(3));

  // ---------- hero + surveyors ----------
  const heroSeam = seams.find(e => e.a === ORIGIN && e.b === NI(2, 5));
  const HP = heroSeam.P[5]; const BS = 0.5, BH = 60 * BS;
  const HERO = { x: HP[0] + 2, y: HP[1] - 9 - BH / 2, crackY: HP[1] };
  const MOS = { x: MX0 + 2.5 * SW, y: MY0 + 0.5 * SH, cols: 4, rows: 3, slot: 38, gap: 6 };
  const slotPos = k => { const c = k % MOS.cols, r = Math.floor(k / MOS.cols); const w = MOS.cols * MOS.slot + (MOS.cols - 1) * MOS.gap, h = MOS.rows * MOS.slot + (MOS.rows - 1) * MOS.gap;
    return [MOS.x - w / 2 + c * (MOS.slot + MOS.gap) + MOS.slot / 2, MOS.y - h / 2 + r * (MOS.slot + MOS.gap) + MOS.slot / 2]; };
  const distToLattice = (x, y) => { let m = Infinity; for (let i = 1; i <= 3; i++) m = Math.min(m, Math.abs(x - (MX0 + i * SW))); for (let j = 1; j <= 6; j++) m = Math.min(m, Math.abs(y - (MY0 + j * SH))); return m; };
  const cands = []; for (let y = MY0 + 60; y < MY1 - 60; y += 16) for (let x = MX0 + 60; x < MX1 - 60; x += 16) { const h = H(x, y); let isMin = true;
    for (let a = 0; a < 8 && isMin; a++) { const an = a / 8 * TAU; if (H(x + Math.cos(an) * 40, y + Math.sin(an) * 40) < h) isMin = false; } if (isMin && distToLattice(x, y) > 34) cands.push([x, y, h]); }
  cands.sort((a, b) => a[2] - b[2]);
  const spots = [];
  for (const c of cands) { if (spots.length >= NK - 1) break; if (Math.hypot(c[0] - HERO.x, c[1] - HERO.y) < 230) continue; if (Math.hypot(c[0] - MOS.x, c[1] - MOS.y) < 170) continue;
    if (spots.some(s => Math.hypot(s[0] - c[0], s[1] - c[1]) < 250)) continue; spots.push(c); }
  // fallback grid if the terrain gave too few valleys
  for (let j = 0; spots.length < NK - 1 && j < 7; j++) for (let i = 0; spots.length < NK - 1 && i < 4; i++) { const x = MX0 + (i + 0.5) * SW, y = MY0 + (j + 0.5) * SH;
    if (Math.hypot(x - HERO.x, y - HERO.y) < 230 || Math.hypot(x - MOS.x, y - MOS.y) < 170 || spots.some(s => Math.hypot(s[0] - x, s[1] - y) < 230)) continue; spots.push([x, y, 0]); }
  const order = spots.map((_, i) => i); for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  const surv = []; for (let o = 0; o < NK - 1; o++) { const s = spots[order[o]]; surv.push({ o, x: s[0], y: s[1], hum: hum[o], ai: ai[o], ph: R() * TAU }); }
  surv.push({ o: NK - 1, x: HERO.x, y: HERO.y, hum: hum[NK - 1], ai: ai[NK - 1], hero: true, ph: 0 });
  // signals between neighbours that break (communication without routing)
  const sig = []; const sr = L.rng(77);
  for (let k = 0; k < 11; k++) { const a = surv[Math.floor(sr() * NK)]; let b = null, bd = Infinity; surv.forEach(s => { if (s === a) return; const d = Math.hypot(s.x - a.x, s.y - a.y) + sr() * 120; if (d < bd) { bd = d; b = s; } });
    sig.push({ a, b, d0: 20 + sr() * 540, reach: 0.35 + sr() * 0.35 }); }

  // ---------- colours / helpers ----------
  const fade = (t, a, b, f = 0.35) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));
  function glowDot(ctx, x, y, r, rgb, a) { if (a <= 0.004) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  function sheetArt(ctx, x, y, w, h, seed, a = 1) {
    ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = GREEN; ctx.fillRect(x - w / 2, y - h / 2, w, h);
    ctx.beginPath(); ctx.rect(x - w / 2, y - h / 2, w, h); ctx.clip();
    ctx.strokeStyle = 'rgba(10,50,28,0.55)'; ctx.lineWidth = Math.max(0.4, w * 0.035);
    for (let k = 0; k < 5; k++) { ctx.beginPath(); for (let q = 0; q <= 12; q++) { const u = q / 12, px = x - w / 2 + u * w, py = y - h / 2 + h * (0.15 + k * 0.18) + Math.sin(u * 5 + seed + k) * h * 0.07; q ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); }
    ctx.restore(); }
  function bean(ctx, x, y, s, { mood = 'calm', look = [0, 0], sheet = 0, sheetGlow = 1, seed = 0, col = '#9a9ea6' } = {}) {
    const bw = 46 * s, bh = 60 * s; ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.beginPath(); ctx.ellipse(x, y + bh * 0.5, bw * 0.55, bh * 0.1, 0, 0, TAU); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x - bw / 2, y - bh / 2, bw, bh, bw / 2); ctx.fillStyle = col; ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 2 * s; ctx.stroke();
    const ey = y - bh * 0.16, er = bw * 0.13;
    [-1, 1].forEach(sd => { const ex = x + sd * bw * 0.19;
      ctx.fillStyle = '#f2efe8'; ctx.beginPath(); ctx.arc(ex, ey, er, 0, TAU); ctx.fill();
      ctx.fillStyle = '#1b1f27'; ctx.beginPath(); ctx.arc(ex + look[0] * er * 0.45, ey + look[1] * er * 0.45, er * 0.5, 0, TAU); ctx.fill();
      if (mood === 'sad' || mood === 'worry') { ctx.strokeStyle = '#1b1f27'; ctx.lineWidth = 2.2 * s; ctx.beginPath(); ctx.moveTo(ex - er * 1.1, ey - er * 1.35 - sd * er * 0.45); ctx.lineTo(ex + er * 1.1, ey - er * 1.35 + sd * er * 0.45); ctx.stroke(); } });
    const my = y + bh * 0.1; ctx.strokeStyle = '#1b1f27'; ctx.lineWidth = 2.6 * s; ctx.lineCap = 'round'; ctx.beginPath();
    if (mood === 'sad') ctx.arc(x, my + bw * 0.12, bw * 0.12, 1.2 * Math.PI, 1.8 * Math.PI);
    else if (mood === 'worry' || mood === 'awe') ctx.ellipse(x, my, bw * 0.06, bw * 0.08, 0, 0, TAU);
    else if (mood === 'soft') ctx.arc(x, my - bw * 0.05, bw * 0.12, 0.2 * Math.PI, 0.8 * Math.PI);
    else { ctx.moveTo(x - bw * 0.08, my); ctx.lineTo(x + bw * 0.08, my); }
    ctx.stroke();
    if (sheet > 0) { const sx = x, sy = y + bh * 0.38, w = bw * 0.95, h = bh * 0.3;
      glowDot(ctx, sx, sy, bw * 1.1, '52,210,123', 0.35 * sheetGlow * sheet);
      sheetArt(ctx, sx, sy, w, h, seed, sheet);
      ctx.strokeStyle = '#6f737b'; ctx.lineWidth = 6.5 * s; [-1, 1].forEach(sd => { ctx.beginPath(); ctx.moveTo(x + sd * bw * 0.47, y + bh * 0.02); ctx.lineTo(x + sd * w * 0.48, sy); ctx.stroke(); }); }
    ctx.restore(); }

  // ---------- the world (map) ----------
  // Z = on-screen scale, so strokes can hold a minimum pixel width.
  const FINE_R = { x0: HERO.x - 200, y0: HERO.y - 280, w: 400, h: 560 };
  let FINE = null; const fine = () => FINE || (FINE = contours(FINE_R.x0, FINE_R.y0, 2, FINE_R.w / 2, FINE_R.h / 2));
  function strokeLevels(ctx, set, Z, mini) {
    set.forEach((seg, li) => { const idx = li % 4 === 0; if (mini && !idx && li % 2) return;
      ctx.strokeStyle = idx ? '#5a5f68' : '#3a3e45'; ctx.lineWidth = Math.max(idx ? 1.6 : 1.0, (idx ? 2.4 : 1.3) * Math.min(Z, 3)) / Z;
      ctx.beginPath(); for (let k = 0; k < seg.length; k += 4) { ctx.moveTo(seg[k], seg[k + 1]); ctx.lineTo(seg[k + 2], seg[k + 3]); } ctx.stroke(); }); }
  const BINS = 8;
  function world(ctx, d, lane, Z, { mini = false, heroMood = 'calm', heroLook = [0, 0], drain = 0 } = {}) {
    const E = extent(d);
    ctx.fillStyle = '#0c0d10'; ctx.fillRect(-4000, -4000, 9000, 9000);
    ctx.fillStyle = '#1a1c20'; ctx.fillRect(MX0, MY0, MX1 - MX0, MY1 - MY0);
    // contours: coarse outside the hero's fine patch, fine inside
    ctx.save();
    if (!mini && Z > 2.2) { ctx.beginPath(); ctx.rect(-4000, -4000, 9000, 9000); ctx.rect(FINE_R.x0 + 2, FINE_R.y0 + 2, FINE_R.w - 4, FINE_R.h - 4); ctx.clip('evenodd'); }
    ctx.beginPath(); ctx.rect(MX0, MY0, MX1 - MX0, MY1 - MY0); ctx.clip(); strokeLevels(ctx, COARSE, Z, mini); ctx.restore();
    if (!mini && Z > 2.2) { ctx.save(); ctx.beginPath(); ctx.rect(FINE_R.x0 + 2, FINE_R.y0 + 2, FINE_R.w - 4, FINE_R.h - 4); ctx.clip(); strokeLevels(ctx, fine(), Z, false); ctx.restore(); }
    // map border + corner ticks (the old survey)
    ctx.strokeStyle = '#4a4e56'; ctx.lineWidth = Math.max(1.2, 3) / Math.max(Z, 0.3); ctx.strokeRect(MX0, MY0, MX1 - MX0, MY1 - MY0);
    // cracks (dark gaps)
    const gapW = Math.max(1.4 / Z, 2.4);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = '#2e3137'; ctx.lineWidth = gapW + Math.max(1 / Z, 1.4); ctx.beginPath(); subs.forEach(s => { ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2); }); ctx.stroke();
    ctx.strokeStyle = '#050607'; ctx.lineWidth = gapW; ctx.beginPath(); subs.forEach(s => { ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2); }); ctx.stroke();
    // red: exactly extent(d) of the network's length
    const bins = []; for (let b = 0; b < BINS; b++) bins.push([]);
    subs.forEach(s => { if (E > s.rank && E > 0) { const dep = L.clamp((E - s.rank) / 0.4, 0, 1); bins[Math.min(BINS - 1, Math.floor(dep * BINS))].push(s); } });
    for (let b = 0; b < BINS; b++) { if (!bins[b].length) continue; const w = Math.max(1.3 / Z, (1.8 + 9 * (b + 0.5) / BINS) * Math.min(1, 5 / Z));
      ctx.beginPath(); bins[b].forEach(s => { ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2); });
      ctx.strokeStyle = 'rgba(255,59,48,0.22)'; ctx.lineWidth = w * 2.8; ctx.stroke();
      ctx.strokeStyle = RED; ctx.lineWidth = w; ctx.stroke(); }
    // seed: t0 freeze at the origin
    if (d >= 0) glowDot(ctx, O.x, O.y, Math.max(6, 14 / Math.sqrt(Z)), '255,59,48', 0.9);
    ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(O.x, O.y, Math.max(2.4, 1.5 / Z), 0, TAU); ctx.fill();
    // the table: new map mosaic
    const w = MOS.cols * MOS.slot + (MOS.cols - 1) * MOS.gap + 16, h = MOS.rows * MOS.slot + (MOS.rows - 1) * MOS.gap + 16;
    ctx.fillStyle = '#101115'; ctx.fillRect(MOS.x - w / 2, MOS.y - h / 2, w, h); ctx.strokeStyle = '#6a6e76'; ctx.lineWidth = Math.max(1.2 / Z, 2); ctx.strokeRect(MOS.x - w / 2, MOS.y - h / 2, w, h);
    const arrived = surv.filter(s => d >= s[lane]).sort((a, b) => a[lane] - b[lane]);
    for (let k = 0; k < NK; k++) { const [sx, sy] = slotPos(k); if (k < arrived.length) sheetArt(ctx, sx, sy, MOS.slot, MOS.slot, k); else { ctx.strokeStyle = '#3a3d44'; ctx.lineWidth = Math.max(1 / Z, 1.5); ctx.strokeRect(sx - MOS.slot / 2, sy - MOS.slot / 2, MOS.slot, MOS.slot); } }
    if (arrived.length === NK) glowDot(ctx, MOS.x, MOS.y, 160, '52,210,123', 0.4);
    // routing: a sheet travels to the table over its last 30 days
    surv.forEach(s => { const arr = s[lane]; const p = L.clamp((d - (arr - 30)) / 30, 0, 1); if (p <= 0) return;
      const k = arrived.indexOf(s); const [tx, ty] = slotPos(k >= 0 ? k : arrived.length);
      ctx.strokeStyle = `rgba(52,210,123,${p >= 1 ? 0.55 : 0.9})`; ctx.lineWidth = Math.max(1.5 / Z, 3); ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(L.lerp(s.x, tx, p), L.lerp(s.y, ty, p)); ctx.stroke();
      if (p < 1) sheetArt(ctx, L.lerp(s.x, tx, p), L.lerp(s.y, ty, p), 16, 12, s.o); });
    // failed signals (only in the observed world)
    if (!mini) sig.forEach(g => { const p = (d - g.d0) / 45; if (p <= 0 || p >= 1.4) return; const reach = Math.min(p, 1) * g.reach, a = p < 1 ? 0.8 : 0.8 * (1 - (p - 1) / 0.4);
      ctx.save(); ctx.globalAlpha = a; ctx.setLineDash([6, 8]); ctx.strokeStyle = '#9aa0aa'; ctx.lineWidth = Math.max(1.4 / Z, 2.5);
      ctx.beginPath(); ctx.moveTo(g.a.x, g.a.y); ctx.lineTo(L.lerp(g.a.x, g.b.x, reach), L.lerp(g.a.y, g.b.y, reach)); ctx.stroke(); ctx.setLineDash([]);
      if (p > 1) { const bx = L.lerp(g.a.x, g.b.x, g.reach), by = L.lerp(g.a.y, g.b.y, g.reach); ctx.beginPath(); ctx.moveTo(bx - 6, by - 6); ctx.lineTo(bx + 6, by + 6); ctx.moveTo(bx + 6, by - 6); ctx.lineTo(bx - 6, by + 6); ctx.stroke(); }
      ctx.restore(); });
    // surveyors
    surv.forEach(s => { const held = d < s[lane] - 30;
      if (mini) { if (held) { glowDot(ctx, s.x, s.y, 34, '52,210,123', 0.6); ctx.fillStyle = GREEN; ctx.fillRect(s.x - 9, s.y - 7, 18, 14); } else { ctx.fillStyle = '#9a9ea6'; ctx.beginPath(); ctx.arc(s.x, s.y, 7, 0, TAU); ctx.fill(); } return; }
      const bob = Math.sin(d * 0.05 + s.ph) * 0.6;
      bean(ctx, s.x, s.y + bob, BS, s.hero ? { mood: heroMood, look: heroLook, sheet: held ? 1 : 0, sheetGlow: 1 - drain * 0.5, seed: s.o } : { mood: held ? 'calm' : 'soft', look: [Math.sin(s.ph), -0.3], sheet: held ? 1 : 0, seed: s.o });
      if (held && Z < 2) glowDot(ctx, s.x, s.y + 8, 30, '52,210,123', 0.35); });
  }

  // ---------- camera ----------
  const HC = [HERO.x, HERO.y + 10], HC2 = [HERO.x, HERO.y + 14], MC = [540, 960];
  const lz = Math.log;
  function cam(t) {
    if (t < 2.3) return [HC[0], HC[1], 13];
    if (t < 6.5) return [HC[0], HC[1], Math.exp(L.lerp(lz(13), lz(10), L.ease.inOut((t - 2.3) / 4.2)))];
    if (t < 11) { const u = L.ease.inOut((t - 6.5) / 4.5), g = u * u; return [L.lerp(HC[0], MC[0], g), L.lerp(HC[1], MC[1], g), Math.exp(L.lerp(lz(10), lz(0.95), u))]; }
    if (t < 14.3) return [MC[0], MC[1], L.lerp(0.95, 0.92, L.ease.inOut((t - 11) / 3.3))];
    if (t < 17.5) { const u = L.ease.inOut((t - 14.3) / 3.2), g = 1 - (1 - u) * (1 - u); return [L.lerp(MC[0], HC2[0], g), L.lerp(MC[1], HC2[1], g), Math.exp(L.lerp(lz(0.92), lz(20), u))]; }
    return [HC2[0], HC2[1], 20];
  }

  // ---------- text ----------
  function caption(ctx, lines, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
    const g = ctx.createLinearGradient(0, 1230, 0, 1560); g.addColorStop(0, 'rgba(8,9,11,0)'); g.addColorStop(0.35, 'rgba(8,9,11,0.7)'); g.addColorStop(1, 'rgba(8,9,11,0.7)'); ctx.fillStyle = g; ctx.fillRect(0, 1230, 1080, 330);
    ctx.fillStyle = '#9aa0aa'; ctx.fillRect(100, 1318, 120, 3);
    ctx.font = `66px "${SERIF}"`; ctx.textAlign = 'left'; ctx.fillStyle = '#ece8df'; lines.forEach((l, i) => ctx.fillText(l, 100, 1400 + i * 72)); ctx.restore(); }
  function card(ctx, lines, y, size, a) { if (a > 0) L.title(ctx, lines, y, size, { alpha: a }); }
  function timebar(ctx, d, a) { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a * 0.85;
    ctx.fillStyle = '#3a3d44'; ctx.fillRect(100, 250, 780, 4); for (let m = 0; m <= 20; m++) ctx.fillRect(100 + 780 * m * 30 / RACE_END - 1, 244, 2, 16);
    ctx.fillStyle = '#e8e4da'; ctx.fillRect(100, 250, 780 * d / RACE_END, 4); ctx.beginPath(); ctx.arc(100 + 780 * d / RACE_END, 252, 9, 0, TAU); ctx.fill();
    ctx.restore(); L.label(ctx, '1 second = 40 days', 100, 312, 40, { alpha: a * 0.8, align: 'left', col: '#c9ccd2' }); }

  // ---------- snap ----------
  const SPAN = 1100, AX0 = 430, AX1 = 950;
  function panel(ctx, top, d, lane, a, title, sub) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = '#15171b'; ctx.beginPath(); ctx.roundRect(80, top, 920, 560, 24); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.roundRect(100, top + 20, 300, 520, 14); ctx.clip();
    const sc = 0.295; ctx.translate(250, top + 280); ctx.scale(sc, sc); ctx.translate(-540, -960); world(ctx, d, lane, sc, { mini: true }); ctx.restore();
    // shared axis: red extent (identical) + green arrivals by position only
    const ay = top + 470, xOf = dd => L.lerp(AX0, AX1, dd / SPAN);
    const curve = () => { ctx.beginPath(); ctx.moveTo(AX0, ay); for (let dd = 0; dd <= SPAN; dd += 5) ctx.lineTo(xOf(dd), ay - 90 * extent(dd)); ctx.lineTo(AX1, ay); ctx.closePath(); };
    curve(); ctx.fillStyle = 'rgba(255,59,48,0.2)'; ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.rect(AX0, ay - 100, xOf(d) - AX0, 110); ctx.clip(); curve(); ctx.fillStyle = RED; ctx.fill(); ctx.restore();
    ctx.fillStyle = '#4a4d55'; ctx.fillRect(AX0, ay, AX1 - AX0, 3);
    surv.forEach(s => { const v = s[lane]; const on = d >= v;
      if (v > SPAN) { const x = AX1 + 4; ctx.beginPath(); ctx.moveTo(x, ay + 8); ctx.lineTo(x + 18, ay + 20); ctx.lineTo(x, ay + 32); ctx.closePath(); ctx.strokeStyle = '#8a8e96'; ctx.lineWidth = 3; ctx.stroke(); return; }
      const x = xOf(v); ctx.beginPath(); ctx.moveTo(x, ay + 8); ctx.lineTo(x + 10, ay + 20); ctx.lineTo(x, ay + 32); ctx.lineTo(x - 10, ay + 20); ctx.closePath();
      ctx.fillStyle = on ? GREEN : '#2b2e35'; ctx.fill(); ctx.strokeStyle = on ? GREEN : '#5a5e66'; ctx.lineWidth = 2; ctx.stroke(); });
    ctx.fillStyle = '#f4f1ea'; ctx.fillRect(xOf(Math.min(d, SPAN)) - 2, ay - 104, 4, 140);
    // big mosaic
    const n = surv.filter(s => d >= s[lane]).length;
    for (let k = 0; k < NK; k++) { const c = k % 4, r = Math.floor(k / 4), x = 580 + c * 50, y = top + 180 + r * 50;
      if (k < n) sheetArt(ctx, x + 22, y + 22, 44, 44, k); else { ctx.strokeStyle = '#4a4e56'; ctx.lineWidth = 2.5; ctx.strokeRect(x, y, 44, 44); } }
    if (n === NK) glowDot(ctx, 680, top + 250, 150, '52,210,123', 0.35);
    ctx.restore();
    L.label(ctx, title, 670, top + 88, 54, { alpha: a, col: '#ece8df', font: SERIF });
    if (sub) L.label(ctx, sub, 670, top + 148, 48, { alpha: a, col: '#c9ccd2' });
  }
  const S1 = 21.6, S2 = 25.6;
  function snap(ctx, t) {
    ctx.fillStyle = '#0b0c0f'; ctx.fillRect(0, 0, 1080, 1920);
    const a1 = L.sm(21.3, 21.6, t), a2 = L.sm(S2 - 0.1, S2 + 0.1, t);
    const d1 = SPAN * L.clamp((t - S1) / 3, 0, 1);
    const freeze = L.sm(24.6, 24.9, t) * (1 - L.sm(S2 - 0.1, S2, t));
    panel(ctx, 330, d1, 'hum', a1 * (1 - 0.35 * freeze), 'as it happened', 'true speed');
    panel(ctx, 940, SPAN * L.clamp((t - S2) / 3, 0, 1), 'ai', a2, 'faster routing', 'illustrative');
    if (t < S2) card(ctx, ['Watch the green.'], 262, 64, fade(t, 21.4, 25.4));
    else card(ctx, ['Same red. Faster routing.'], 262, 64, fade(t, S2 + 0.1, 29.4));
  }

  // ---------- macro (routed lane) ----------
  function macro(ctx, t) {
    const lt = t - 29.4;
    ctx.save(); const z = 7; ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-HERO.x - 20, -HERO.y - 6); world(ctx, 770, 'ai', z, { heroMood: 'soft' }); ctx.restore();
    ctx.fillStyle = 'rgba(8,9,11,0.55)'; ctx.fillRect(0, 0, 1080, 1920);
    const p = L.ease.inOut(L.clamp((lt - 0.4) / 1.2, 0, 1));
    const lx = 290, rx = 790, y = 900, s = 5.2;
    bean(ctx, lx, y, s, { mood: p > 0.9 ? 'soft' : 'calm', look: [1, 0] });
    bean(ctx, rx, y, s, { mood: p > 0.9 ? 'soft' : 'calm', look: [-1, 0] });
    // two sheets meet; their contours continue across the seam
    const w = 210, h = 150, cx = 540, cy = 1060;
    const xl = L.lerp(lx + 40, cx - w / 2, p), xr = L.lerp(rx - 40, cx + w / 2, p);
    glowDot(ctx, cx, cy, 260 + 80 * p, '52,210,123', 0.25 + 0.3 * p);
    [[xl, -1], [xr, 1]].forEach(([x, sd]) => { ctx.fillStyle = GREEN; ctx.fillRect(x - w / 2, cy - h / 2, w, h);
      ctx.save(); ctx.beginPath(); ctx.rect(x - w / 2, cy - h / 2, w, h); ctx.clip(); ctx.strokeStyle = 'rgba(10,50,28,0.6)'; ctx.lineWidth = 4;
      for (let k = 0; k < 5; k++) { ctx.beginPath(); for (let q = 0; q <= 20; q++) { const px = x - w / 2 + q / 20 * w, gx = (px - x) + (sd < 0 ? cx - w / 2 : cx + w / 2);
        const py = cy - h / 2 + h * (0.14 + k * 0.18) + Math.sin(gx * 0.025 + k) * 12; q ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); } ctx.restore(); });
    ctx.strokeStyle = '#6f737b'; ctx.lineWidth = 6.5 * s; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(lx + 23 * s * 0.94, y); ctx.lineTo(xl - w / 2 + 10, cy); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(rx - 23 * s * 0.94, y); ctx.lineTo(xr + w / 2 - 10, cy); ctx.stroke();
    if (p >= 1) { ctx.fillStyle = `rgba(215,255,230,${0.5 * (1 - L.clamp((lt - 1.6) / 0.5, 0, 1))})`; ctx.fillRect(cx - w, cy - h / 2, 2 * w, h); }
    L.label(ctx, 'illustrative', 540, 300, 48, { col: '#c9ccd2' });
    caption(ctx, ['The pieces were already here.'], fade(t, 29.6, 32.2));
  }

  // ---------- draw ----------
  function draw(ctx, t) {
    ctx.fillStyle = '#0c0d10'; ctx.fillRect(0, 0, 1080, 1920);
    if (t < 18.6) {
      const d = dayAt(t), [cx, cy, z] = cam(t);
      const heroMood = t < 2 ? 'worry' : d < 70 ? 'calm' : d < 400 ? 'worry' : 'sad';
      const heroLook = t < 2 ? [0.2, 1] : d < 70 ? [0, 0.6] : d < 400 ? [0.3, 1] : [0, 0];
      ctx.save(); ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-cx, -cy);
      world(ctx, d, 'hum', z, { heroMood, heroLook, drain: L.sm(14.3, 17.5, t) }); ctx.restore();
      // vignette deepens on the return (attention narrowing)
      const vg = 0.35 + 0.35 * L.sm(14.3, 17.5, t); const g = ctx.createRadialGradient(540, 860, 300, 540, 960, 1150); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${vg})`); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920);
      // fade through black: flash-forward -> t0
      const fb = L.sm(1.65, 2.0, t) * (1 - L.sm(2.0, 2.4, t)); if (fb > 0) { ctx.fillStyle = `rgba(0,0,0,${fb})`; ctx.fillRect(0, 0, 1080, 1920); }
      if (t < 1.75) { L.title(ctx, ['It lives in the cracks.'], 420, 92, { alpha: 1 - L.sm(1.55, 1.75, t) }); L.label(ctx, 'later', 100, 312, 40, { align: 'left', col: '#c9ccd2', alpha: 0.8 * (1 - L.sm(1.55, 1.75, t)) }); }
      timebar(ctx, d, L.sm(2.3, 2.7, t) * (1 - L.sm(17.3, 17.6, t)));
      card(ctx, ['Go back. Before the flood.'], 420, 76, fade(t, 2.1, 3.6));
      caption(ctx, ['A surveyor, alone', 'in her valley.'], fade(t, 3.6, 5.3));
      caption(ctx, ['She holds one', 'corrected sheet.'], fade(t, 5.3, 7.0));
      caption(ctx, ['The rules were drawn', 'for older ground.'], fade(t, 7.1, 9.2));
      caption(ctx, ['Each valley keeps', 'one sheet.'], fade(t, 9.3, 11.2));
      caption(ctx, ['Then the red', 'finds the faults.'], fade(t, 11.4, 13.8));
      caption(ctx, ['Her sheet has', 'not arrived.'], fade(t, 14.7, 17.1));
      L.slate(ctx, t < 2.3 ? 'SC1  CLOSE  COLD OPEN' : t < 6.5 ? 'SC2  CLOSE  EYE LEVEL' : t < 11 ? 'SC3  CONTINUOUS ZOOM OUT' : t < 14.3 ? 'SC4  WIDE  WHOLE MAP' : t < 17.5 ? 'SC5  ZOOM IN  CLOSER' : 'SC5  HOLD  SILENCE');
      if (t > 17.5) { const k = L.sm(17.6, 18.6, t); ctx.fillStyle = `rgba(0,0,0,${0.55 * k})`; ctx.fillRect(0, 0, 1080, 1920); }
    } else if (t < 21.3) {
      // map dimmed behind the card
      ctx.save(); const [cx, cy, z] = cam(17.5); ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-cx, -cy); world(ctx, RACE_END, 'hum', z, { heroMood: 'sad' }); ctx.restore();
      ctx.fillStyle = `rgba(8,9,11,${0.55 + 0.35 * L.sm(20.8, 21.3, t)})`; ctx.fillRect(0, 0, 1080, 1920);
      card(ctx, ['We slowed it down', 'so you could see it.'], 860, 96, fade(t, 18.7, 21.2));
      L.slate(ctx, 'SC5  HOLD');
    } else if (t < 29.4) { snap(ctx, t); L.slate(ctx, 'SC6  SNAP  WIDE'); }
    else if (t < 32.2) { macro(ctx, t); L.slate(ctx, 'SC7  MACRO  DOLLY IN'); }
    else {
      ctx.save(); const z = 7; ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-HERO.x - 20, -HERO.y - 6); world(ctx, 770, 'ai', z, { heroMood: 'soft' }); ctx.restore();
      ctx.fillStyle = 'rgba(8,9,11,0.8)'; ctx.fillRect(0, 0, 1080, 1920);
      card(ctx, ['This is', 'the bottleneck.'], 820, 112, fade(t, 32.3, 34.8));
      L.slate(ctx, 'SC8  CARD');
      if (t >= 34.5) L.endCard(ctx, L.sm(34.5, 34.9, t), { line: 'The bottleneck is us.' });
    }
    L.grain(ctx, t, { alpha: 0.05, n: 500 });
  }

  return { draw, DUR,
    acts: [{ start: 0, end: 17.5, bpm: 0, drone: true }, { start: 9.0, end: 17.5, bpm: 48 }, { start: 18.6, end: 24.6, bpm: 0, drone: true }, { start: S2, end: 40, bpm: 0, drone: true }],
    cues: [{ t: 2.0, type: 'whoosh' }, { t: 6.6, type: 'whoosh' }, { t: tOfDay(403), type: 'hit' }, { t: 14.4, type: 'whoosh' }, { t: S2, type: 'hit' }, { t: 30.9, type: 'pop' }, { t: 32.3, type: 'ding' }] };
}
module.exports = makeScene;
