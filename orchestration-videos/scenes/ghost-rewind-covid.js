// ghost-rewind-covid ("The Window"): ghost-rewind, stained glass, crane up and drop down. Analog: covid-2020.
// Red = analog threat.points extent (piecewise-linear between 11 sourced points) over ~80 panes.
// Green = per-pane L.lognormalQuantile(q, 421, 490), floor day 339 (earliest first dose in data).
// Ghost = ai_counterfactual (median 363, same sigma, same floor), labelled illustrative at the snap.
// Mapping: 1 s = 35 days while the clock runs; holds freeze the clock. See output/ghost-rewind-covid/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('covid-2020');
  const DUR = 37, RED = L.RED, GREEN = L.GREEN;
  const STONE = '#15171c', LEAD = '#08090b';

  // ---------- time mapping ----------
  const DPS = 35, HOOKDAY = 96;
  const dayAt = t => {
    if (t < 1.5) return HOOKDAY;
    if (t < 2.1) return HOOKDAY * (1 - L.ease.inOut((t - 1.5) / 0.6));
    if (t < 6.6) return DPS * (t - 2.1);
    if (t < 7.8) return DPS * 4.5;
    return Math.min(490, DPS * 4.5 + DPS * (t - 7.8));
  };
  const tOfDay = d => d <= 157.5 ? 2.1 + d / DPS : 7.8 + (d - 157.5) / DPS;

  // ---------- threat ----------
  const pts = [{ t: 0, extent: 0 }].concat(A.threat.points);
  const extent = d => { if (d <= 0) return 0; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1]; if (d <= b.t) return L.lerp(a.extent, b.extent, (d - a.t) / (b.t - a.t)); } return pts[pts.length - 1].extent; };

  // ---------- green ----------
  const F = {}; A.solution.fragments.forEach(f => F[f.id] = f.ready_at);
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;
  const AIMED = A.ai_counterfactual.aggregation_median, AIP90 = AIMED * P90 / MED;
  const FLOOR = 339; // earliest first dose in the data (analog aggregation notes)

  // ---------- window geometry (world space) ----------
  const WX0 = 120, WX1 = 960, WTOP = 110, WSPR = 560, WBOT = 1480;
  const arch = [[WX0, WBOT], [WX0, WSPR]];
  const q2 = (p0, c, p2, f) => [(1 - f) * (1 - f) * p0[0] + 2 * (1 - f) * f * c[0] + f * f * p2[0], (1 - f) * (1 - f) * p0[1] + 2 * (1 - f) * f * c[1] + f * f * p2[1]];
  for (let i = 1; i <= 20; i++) arch.push(q2([WX0, WSPR], [WX0, WTOP + 90], [540, WTOP], i / 20));
  for (let i = 1; i <= 20; i++) arch.push(q2([540, WTOP], [WX1, WTOP + 90], [WX1, WSPR], i / 20));
  arch.push([WX1, WBOT]);
  const inPoly = (x, y, P) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i], [xj, yj] = P[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
  const archPath = ctx => { ctx.beginPath(); arch.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); };

  const R = L.rng(4217);
  const COLS = 7, ROWS = 12, CW = (WX1 - WX0) / COLS, CH = (WBOT - WTOP) / ROWS;
  const V = [];
  for (let r = 0; r <= ROWS; r++) { V.push([]); for (let c = 0; c <= COLS; c++) {
    const edgeX = c === 0 || c === COLS, edgeY = r === 0 || r === ROWS;
    V[r].push([WX0 + c * CW + (edgeX ? 0 : (R() - 0.5) * CW * 0.55), WTOP + r * CH + (edgeY ? 0 : (R() - 0.5) * CH * 0.55)]); } }
  const panes = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const poly = [V[r][c], V[r][c + 1], V[r + 1][c + 1], V[r + 1][c]];
    const cx = poly.reduce((s, p) => s + p[0], 0) / 4, cy = poly.reduce((s, p) => s + p[1], 0) / 4;
    if (!inPoly(cx, cy, arch)) continue;
    const split = R() < 0.55 ? (() => { const a = Math.floor(R() * 4), b = (a + 2) % 4, fa = 0.3 + R() * 0.4, fb = 0.3 + R() * 0.4;
      const pa = poly[a], pa2 = poly[(a + 1) % 4], pb = poly[b], pb2 = poly[(b + 1) % 4];
      return [[L.lerp(pa[0], pa2[0], fa), L.lerp(pa[1], pa2[1], fa)], [L.lerp(pb[0], pb2[0], fb), L.lerp(pb[1], pb2[1], fb)]]; })() : null;
    panes.push({ poly, cx, cy, r, c, lum: 70 + R() * 55, warm: R() * 8, split, i: panes.length });
  }
  const N = panes.length;
  const nearestPane = (x, y, ex = []) => panes.filter(p => !ex.includes(p)).reduce((b, p) => Math.hypot(p.cx - x, p.cy - y) < Math.hypot(b.cx - x, b.cy - y) ? p : b);
  const HERO = nearestPane(540, 1420);

  // red rank: distance from an origin pane + noise
  const origin = nearestPane(820, 760);
  const order = panes.map(p => ({ p, k: Math.hypot(p.cx - origin.cx, p.cy - origin.cy) + R() * 420 })).sort((a, b) => a.k - b.k).map(o => o.p);
  let hr = order.indexOf(HERO); if (hr > N * 0.55) { const j = Math.floor(N * 0.45); [order[hr], order[j]] = [order[j], order[hr]]; }
  order.forEach((p, k) => { p.redDay = Infinity; const need = (k + 0.5) / N; for (let d = 0; d <= 700; d += 0.5) if (extent(d) >= need) { p.redDay = d; break; } });

  // green arrival quantiles (shuffled), hero gets the median
  const qs = panes.map((_, i) => (i + 0.5) / N); for (let i = qs.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [qs[i], qs[j]] = [qs[j], qs[i]]; }
  panes.forEach((p, i) => p.q = qs[i]);
  const mid = panes.reduce((b, p) => Math.abs(p.q - 0.5) < Math.abs(b.q - 0.5) ? p : b); [mid.q, HERO.q] = [HERO.q, mid.q];
  panes.forEach(p => { p.gDay = Math.max(FLOOR, L.lognormalQuantile(p.q, MED, P90)); p.aiDay = Math.max(FLOOR, L.lognormalQuantile(p.q, AIMED, AIP90)); });

  // fragments already sitting in the window (analog dates)
  const used = [HERO];
  const fp = (x, y) => { const p = nearestPane(x, y, used); used.push(p); return p; };
  const SH = [
    { id: 'f2', p: fp(300, 640), lbl: 'platform' }, { id: 'f3', p: fp(720, 470), lbl: 'genome' },
    { id: 'f4', p: fp(560, 780), lbl: 'design' }, { id: 'f5', p: fp(330, 1000), lbl: 'trial' },
    { id: 'f6', p: fp(720, 1060), lbl: 'approval' }, { id: 'f7', p: fp(480, 1230), lbl: 'first dose' }];
  SH.forEach(s => { s.day = F[s.id]; s.x = s.p.cx + (R() - 0.5) * 30; s.y = s.p.cy + (R() - 0.5) * 30; s.rot = R() * 6; });
  const S = {}; SH.forEach(s => S[s.id] = s);
  const chain = [['f3', 'f4', F.f4], ['f2', 'f4', F.f4], ['f4', 'f5', F.f5], ['f5', 'f6', F.f6], ['f6', 'f7', F.f7]];
  // distribution tree: each pane links to nearest pane already lit (or to the first-dose shard)
  function tree(key) { const srt = panes.slice().sort((a, b) => a[key] - b[key]); const lit = [];
    srt.forEach(p => { let par = S.f7; let best = Math.hypot(p.cx - par.x, p.cy - par.y);
      lit.forEach(o => { const d = Math.hypot(p.cx - o.cx, p.cy - o.cy); if (d < best) { best = d; par = { x: o.cx, y: o.cy }; } });
      p[key + 'Par'] = { x: par.x, y: par.y }; lit.push(p); }); }
  tree('gDay'); tree('aiDay');

  // crowd on the floor
  const crowd = []; const cr = L.rng(77);
  [[170, 1655, 1.0], [260, 1690, 1.1], [345, 1650, 0.95], [425, 1700, 1.15], [660, 1705, 1.12], [745, 1655, 1.0], [830, 1690, 1.08], [915, 1650, 0.95],
   [215, 1760, 1.2], [870, 1765, 1.2], [385, 1790, 1.25], [700, 1800, 1.25]].forEach(([x, y, s]) => crowd.push({ x, y, s, ph: cr() * 6, lk: (cr() - 0.5) * 0.6, pane: nearestPane(x, WBOT - 60) }));
  crowd.sort((a, b) => a.y - b.y);
  const HX = 540, HY = 1720, HS = 1.35;

  // ---------- colours ----------
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const mix = (a, b, f) => { const A2 = hex(a), B = hex(b); return `rgb(${A2.map((v, i) => Math.round(L.lerp(v, B[i], f))).join(',')})`; };
  function paneState(p, d, mode) {
    const g = mode === 'ai' ? p.aiDay : p.gDay;
    if (d >= g) return { kind: 'green', col: GREEN, fresh: 1 - L.clamp((d - g) / 14, 0, 1) };
    if (d >= p.redDay) { const w = L.clamp((d - p.redDay) / 300, 0, 1); return { kind: 'red', col: mix(RED, '#26272b', 0.82 * w), w }; }
    const l = Math.round(p.lum); return { kind: 'gray', col: `rgb(${l + p.warm | 0},${l + p.warm * 0.6 | 0},${l})` };
  }
  const polyPath = (ctx, P) => { ctx.beginPath(); P.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); };
  function glowDot(ctx, x, y, r, rgb, a) { if (a <= 0.004) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); }
  function shard(ctx, x, y, r, rot, { col = GREEN, a = 1, glow = 1 } = {}) {
    ctx.save(); ctx.globalAlpha *= a; if (glow > 0) glowDot(ctx, x, y, r * 3.2, col === GREEN ? '52,210,123' : '190,205,196', 0.45 * glow);
    ctx.translate(x, y); ctx.rotate(rot); const P = [[-1, -0.55], [0.15, -1], [1, -0.15], [0.45, 0.9], [-0.75, 0.6]];
    ctx.beginPath(); P.forEach(([u, v], i) => i ? ctx.lineTo(u * r, v * r) : ctx.moveTo(u * r, v * r)); ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = LEAD; ctx.lineWidth = Math.max(1.5, r * 0.14); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.moveTo(-0.6 * r, -0.35 * r); ctx.lineTo(0.1 * r, -0.7 * r); ctx.lineTo(-0.1 * r, -0.2 * r); ctx.closePath(); ctx.fill();
    ctx.restore(); }

  // ---------- the window ----------
  // mode: 'human' (real green, ghost panes on top if ghost) | 'ai' (ghost timeline as the real green, for the snap panel)
  function drawWindow(ctx, d, { mode = 'human', ghost = true, labels = 0, links = true, ghostA = 1 } = {}) {
    ctx.save(); archPath(ctx); ctx.fillStyle = '#0c0d10'; ctx.fill(); ctx.clip();
    panes.forEach(p => { const s = paneState(p, d, mode); p._s = s;
      polyPath(ctx, p.poly); ctx.fillStyle = s.col; ctx.fill();
      // glass texture: a soft highlight toward the top-left
      const g = ctx.createLinearGradient(p.cx - 60, p.cy - 60, p.cx + 60, p.cy + 60); g.addColorStop(0, 'rgba(255,255,255,0.13)'); g.addColorStop(1, 'rgba(0,0,0,0.18)');
      ctx.fillStyle = g; ctx.fill();
      if (s.kind === 'green' && s.fresh > 0) { ctx.fillStyle = `rgba(210,255,225,${0.5 * s.fresh})`; ctx.fill(); }
      if (mode === 'human' && ghost && s.kind !== 'green' && d >= p.aiDay) {
        const ga = ghostA * L.clamp((d - p.aiDay) / 10, 0, 1); ctx.fillStyle = `rgba(163,190,172,${0.62 * ga})`; ctx.fill();
        ctx.save(); ctx.setLineDash([10, 8]); ctx.strokeStyle = `rgba(225,235,228,${0.7 * ga})`; ctx.lineWidth = 3; polyPath(ctx, p.poly.map(([x, y]) => [L.lerp(x, p.cx, 0.2), L.lerp(y, p.cy, 0.2)])); ctx.stroke(); ctx.restore(); }
    });
    // lead came
    ctx.strokeStyle = LEAD; ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    panes.forEach(p => { ctx.lineWidth = 11; polyPath(ctx, p.poly); ctx.stroke();
      if (p.split) { ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(p.split[0][0], p.split[0][1]); ctx.lineTo(p.split[1][0], p.split[1][1]); ctx.stroke(); } });
    // links: assembly chain + distribution threads (real green only)
    if (links) {
      ctx.lineCap = 'round';
      chain.forEach(([a, b, day]) => { if (d < day) return; const f = L.clamp((d - day) / 6, 0, 1), A2 = S[a], B = S[b];
        ctx.strokeStyle = GREEN; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(A2.x, A2.y); ctx.lineTo(L.lerp(A2.x, B.x, f), L.lerp(A2.y, B.y, f)); ctx.stroke(); });
      const key = mode === 'ai' ? 'aiDay' : 'gDay';
      panes.forEach(p => { const day = p[key]; if (d < day) return; const par = p[key + 'Par'], f = L.clamp((d - day) / 5, 0, 1);
        ctx.strokeStyle = 'rgba(52,210,123,0.85)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(par.x, par.y); ctx.lineTo(L.lerp(par.x, p.cx, f), L.lerp(par.y, p.cy, f)); ctx.stroke(); });
    }
    SH.forEach(s => { if (d >= s.day) shard(ctx, s.x, s.y, 20, s.rot); });
    ctx.restore();
    // stone frame
    ctx.save(); archPath(ctx); ctx.strokeStyle = '#3a3c42'; ctx.lineWidth = 26; ctx.stroke(); ctx.strokeStyle = '#1c1d22'; ctx.lineWidth = 8; ctx.stroke(); ctx.restore();
    if (labels > 0) SH.forEach(s => { if (d < s.day) return; ctx.save(); ctx.globalAlpha = labels; ctx.font = `44px "${HAND}"`; ctx.textAlign = 'center';
      ctx.lineWidth = 9; ctx.strokeStyle = '#0c0d10'; ctx.lineJoin = 'round'; ctx.strokeText(s.lbl, s.x, s.y + 58); ctx.fillStyle = '#e8e4da'; ctx.fillText(s.lbl, s.x, s.y + 58); ctx.restore(); });
  }

  // ---------- figures ----------
  function bean(ctx, x, y, s, { col = '#9a9ea6', mood = 'calm', look = [0, -1], hold = false, light = null, lightA = 0 } = {}) {
    const bw = 46 * s, bh = 60 * s; ctx.save();
    ctx.beginPath(); ctx.roundRect(x - bw / 2, y - bh / 2, bw, bh, bw / 2); ctx.fillStyle = col; ctx.fill();
    if (light && lightA > 0) { ctx.save(); ctx.clip(); const g = ctx.createLinearGradient(x, y - bh / 2, x, y + bh * 0.3); g.addColorStop(0, light.replace('rgb', 'rgba').replace(')', `,${lightA})`)); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(x - bw, y - bh, bw * 2, bh * 2); ctx.restore(); }
    ctx.strokeStyle = 'rgba(0,0,0,0.35)'; ctx.lineWidth = 2 * s; ctx.beginPath(); ctx.roundRect(x - bw / 2, y - bh / 2, bw, bh, bw / 2); ctx.stroke();
    const ey = y - bh * 0.16, er = bw * 0.13;
    [-1, 1].forEach(sd => { const ex = x + sd * bw * 0.19;
      ctx.fillStyle = '#f2efe8'; ctx.beginPath(); ctx.arc(ex, ey, er, 0, 7); ctx.fill();
      ctx.fillStyle = '#1b1f27'; ctx.beginPath(); ctx.arc(ex + look[0] * er * 0.45, ey + look[1] * er * 0.45, er * 0.5, 0, 7); ctx.fill();
      if (mood === 'sad') { ctx.strokeStyle = '#1b1f27'; ctx.lineWidth = 2.2 * s; ctx.beginPath(); ctx.moveTo(ex - er * 1.1, ey - er * 1.3 - sd * er * 0.45); ctx.lineTo(ex + er * 1.1, ey - er * 1.3 + sd * er * 0.45); ctx.stroke(); } });
    const my = y + bh * 0.12; ctx.strokeStyle = '#1b1f27'; ctx.lineWidth = 2.6 * s; ctx.lineCap = 'round'; ctx.beginPath();
    if (mood === 'sad') ctx.arc(x, my + bw * 0.12, bw * 0.12, 1.2 * Math.PI, 1.8 * Math.PI);
    else if (mood === 'awe') { ctx.ellipse(x, my, bw * 0.06, bw * 0.08, 0, 0, 7); }
    else if (mood === 'soft') ctx.arc(x, my - bw * 0.05, bw * 0.12, 0.2 * Math.PI, 0.8 * Math.PI);
    else { ctx.moveTo(x - bw * 0.08, my); ctx.lineTo(x + bw * 0.08, my); }
    ctx.stroke();
    if (hold) { ctx.strokeStyle = '#6f737b'; ctx.lineWidth = 6.5 * s; [-1, 1].forEach(sd => { ctx.beginPath(); ctx.moveTo(x + sd * bw * 0.46, y + bh * 0.02); ctx.lineTo(x + sd * bw * 0.16, y + bh * 0.3); ctx.stroke(); }); }
    ctx.restore(); return { hx: x, hy: y + bh * 0.3 };
  }
  // The ghost: pale, translucent, gentle. arm: 0 = at rest, 1 = raised toward the window.
  function ghostFig(ctx, x, y, s, t, { a = 0.4, arm = 0, joined = true, handTo = null } = {}) {
    if (a <= 0) return; const bw = 46 * s, bh = 64 * s; y += Math.sin(t * 1.6) * 4 * s;
    ctx.save(); glowDot(ctx, x, y, bw * 1.5, '215,225,220', 0.16 * a / 0.4);
    ctx.globalAlpha = a; ctx.fillStyle = '#d5ddd8';
    ctx.beginPath(); ctx.moveTo(x - bw / 2, y); ctx.arc(x, y - bh / 2 + bw / 2, bw / 2, Math.PI, 0); ctx.lineTo(x + bw / 2, y + bh * 0.42);
    for (let k = 0; k < 4; k++) ctx.quadraticCurveTo(x + bw / 2 - (k + 0.5) * bw / 4, y + bh * 0.52, x + bw / 2 - (k + 1) * bw / 4, y + bh * 0.42);
    ctx.closePath(); ctx.fill();
    ctx.strokeStyle = '#48504c'; ctx.lineWidth = 2.4 * s; ctx.lineCap = 'round';
    [-1, 1].forEach(sd => { ctx.beginPath(); ctx.arc(x + sd * bw * 0.19, y - bh * 0.2, bw * 0.08, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke(); });
    ctx.beginPath(); ctx.arc(x, y - bh * 0.02, bw * 0.1, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
    // arm
    ctx.strokeStyle = '#d5ddd8'; ctx.lineWidth = 7 * s;
    const hx = handTo ? handTo[0] : L.lerp(x - bw * 0.2, x - bw * 0.05, arm), hy = handTo ? handTo[1] : L.lerp(y + bh * 0.3, y - bh * 1.05, arm);
    ctx.beginPath(); ctx.moveTo(x - bw * 0.42, y + bh * 0.05); ctx.lineTo(hx, hy); ctx.stroke();
    ctx.restore();
    // its shard, already joined to a second (dim, desaturated)
    if (joined) { ctx.save(); ctx.globalAlpha = a * 1.6; shard(ctx, hx - 9 * s, hy, 11 * s, 0.4, { col: '#9fb8a8', glow: 0.5 }); shard(ctx, hx + 9 * s, hy - 3 * s, 10 * s, 2.6, { col: '#9fb8a8', glow: 0 }); ctx.restore(); }
    return [hx, hy];
  }

  // ---------- the nave ----------
  const wr = L.rng(9); const blocks = []; for (let i = 0; i < 90; i++) blocks.push([wr() * 1400 - 160, wr() * 1700 - 100, 90 + wr() * 120]);
  function nave(ctx, d, t, opt = {}) {
    ctx.fillStyle = STONE; ctx.fillRect(-2000, -2000, 5080, 5920);
    ctx.strokeStyle = 'rgba(255,255,255,0.035)'; ctx.lineWidth = 3; blocks.forEach(([x, y, w]) => ctx.strokeRect(x, y, w, w * 0.5));
    // floor
    ctx.fillStyle = '#1b1d22'; ctx.fillRect(-2000, WBOT + 40, 5080, 3000);
    ctx.fillStyle = '#26282e'; ctx.fillRect(-2000, WBOT + 30, 5080, 18);
    drawWindow(ctx, d, opt);
    // light pools on the floor from the bottom rows
    panes.forEach(p => { if (p.cy < WBOT - 260 || !p._s) return; const s = p._s; if (s.kind === 'gray') return;
      const rgb = s.kind === 'green' ? '52,210,123' : '255,59,48', a = s.kind === 'green' ? 0.2 : 0.2 * (1 - 0.85 * s.w);
      ctx.save(); ctx.translate(p.cx, WBOT + 170 + (WBOT - p.cy) * 0.35); ctx.scale(1, 0.32); glowDot(ctx, 0, 0, 150, rgb, a); ctx.restore(); });
    // crowd
    crowd.forEach(c => { const s = c.pane._s; bean(ctx, c.x, c.y + Math.sin(t * 0.8 + c.ph) * 1.5, c.s, { mood: s && s.kind === 'red' && s.w > 0.3 ? 'sad' : 'calm', look: [c.lk, -1],
      light: s && s.kind !== 'gray' ? (s.kind === 'green' ? 'rgb(52,210,123)' : 'rgb(255,59,48)') : null, lightA: s && s.kind === 'red' ? 0.35 * (1 - s.w) : 0.35 }); });
  }
  function hero(ctx, d, t, { mood = 'calm' } = {}) {
    const s = HERO._s || paneState(HERO, d, 'human');
    const light = s.kind === 'green' ? 'rgb(52,210,123)' : s.kind === 'red' ? 'rgb(255,59,48)' : null;
    const la = s.kind === 'red' ? 0.55 * (1 - 0.8 * s.w) : 0.5;
    const h = bean(ctx, HX, HY, HS, { mood, look: [0, -1], hold: true, light, lightA: la });
    return h;
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
  const slate = (ctx, s) => { ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(40, 1818, 560, 58); ctx.restore(); L.slate(ctx, s); };

  // ---------- camera ----------
  const CK = [[0, 540, 1540, 3.0], [2.1, 540, 1540, 3.0], [3.8, 540, 1520, 3.2], [6.6, 540, 880, 0.95], [10.4, 540, 880, 0.95], [13.0, 540, 1575, 4.2], [17.3, 540, 1590, 4.6]];
  const CK2 = [[27, 540, 1480, 2.4], [28.6, 540, 1700, 6.0], [32, 540, 1705, 6.6]];
  function camAt(K, t) { if (t <= K[0][0]) return K[0].slice(1); for (let i = 0; i < K.length - 1; i++) { const a = K[i], b = K[i + 1]; if (t <= b[0]) { const f = L.ease.inOut((t - a[0]) / (b[0] - a[0]));
    return [L.lerp(a[1], b[1], f), L.lerp(a[2], b[2], f), Math.exp(L.lerp(Math.log(a[3]), Math.log(b[3]), f))]; } } return K[K.length - 1].slice(1); }
  function applyCam(ctx, [x, y, z], sh = 0) { ctx.translate(540 + sh, 960); ctx.scale(z, z); ctx.translate(-x, -y); }

  // ---------- snap panels ----------
  const SNAPD = 560;
  function miniWindow(ctx, cx, top, d, mode) { const sc = 0.4; ctx.save(); ctx.translate(cx, top); ctx.scale(sc, sc); ctx.translate(-540, -WTOP);
    ctx.fillStyle = STONE; ctx.fillRect(WX0 - 40, WTOP - 40, WX1 - WX0 + 80, WBOT - WTOP + 80); drawWindow(ctx, d, { mode, ghost: false, links: true }); ctx.restore(); }
  function share(d, key) { return panes.filter(p => d >= p[key]).length / N; }
  function snap(ctx, t) {
    ctx.fillStyle = '#0d0e11'; ctx.fillRect(0, 0, 1080, 1920);
    const a = L.sm(19.8, 20.2, t);
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#17191e'; ctx.beginPath(); ctx.roundRect(60, 420, 960, 1060, 26); ctx.fill(); ctx.restore();
    const dA = t < 22.6 ? SNAPD * L.clamp((t - 20.3) / 2.2, 0, 1) : SNAPD * L.clamp((t - 22.9) / 2.2, 0, 1);
    const dB = SNAPD * L.clamp((t - 22.9) / 2.2, 0, 1);
    ctx.save(); ctx.globalAlpha = a;
    miniWindow(ctx, 300, 470, dA, 'human');
    ctx.globalAlpha = a * (t < 22.6 ? 0.35 : 1); miniWindow(ctx, 780, 470, dB, 'ai'); ctx.restore();
    // labels
    L.label(ctx, 'as it happened', 300, 1080, 46, { alpha: a, col: '#e8e4da' });
    L.label(ctx, 'the ghost:', 770, 1060, 44, { alpha: a, col: '#c9d4cd' });
    L.label(ctx, 'faster routing', 770, 1108, 44, { alpha: a, col: '#c9d4cd' });
    L.label(ctx, 'illustrative', 770, 1156, 46, { alpha: a, col: '#e8e4da' });
    // lit-share bars
    [[300, dA, 'gDay', 1], [770, dB, 'aiDay', t < 22.6 ? 0.35 : 1]].forEach(([x, d, key, al]) => { ctx.save(); ctx.globalAlpha = a * al;
      ctx.fillStyle = '#2b2e35'; ctx.fillRect(x - 170, 1200, 340, 22); ctx.fillStyle = GREEN; ctx.fillRect(x - 170, 1200, 340 * share(d, key), 22);
      ctx.fillStyle = '#e8e4da'; ctx.fillRect(x - 1, 1192, 3, 38); ctx.restore(); });
    const na = L.sm(25.1, 25.5, t);
    L.label(ctx, 'half the window lit by', 540, 1290, 46, { alpha: na, col: '#b9bec8' });
    ctx.save(); ctx.globalAlpha = na; ctx.textAlign = 'center'; ctx.font = `92px "${SERIF}"`; ctx.fillStyle = '#f4f1ea'; ctx.fillText('day 421', 300, 1400); ctx.fillStyle = '#dfe8e2'; ctx.fillText('day 363', 770, 1400); ctx.restore();
    card(ctx, ['True speed.'], 330, 96, fade(t, 20.3, 22.5));
    card(ctx, ['Now beside the ghost.'], 330, 86, fade(t, 22.7, 24.9));
    card(ctx, ['The ghost was', 'faster routing.'], 270, 92, L.sm(25.0, 25.4, t));
    if (t < 19.95) { ctx.fillStyle = `rgba(255,255,255,${0.5 * (1 - L.sm(19.8, 19.95, t))})`; ctx.fillRect(0, 0, 1080, 1920); }
  }

  // ---------- draw ----------
  function draw(ctx, t) {
    ctx.fillStyle = STONE; ctx.fillRect(0, 0, 1080, 1920);
    if (t < 17.3) {
      const d = dayAt(t); const sh = (t > 1.5 && t < 2.1) ? Math.sin(t * 90) * 6 : 0;
      ctx.save(); applyCam(ctx, camAt(CK, t), sh);
      const labels = fade(t, 6.8, 10.3, 0.4);
      nave(ctx, d, t, { labels });
      hero(ctx, d, t, { mood: t < 2.1 ? 'awe' : (d > HERO.redDay + 120 && d < HERO.gDay ? 'sad' : 'calm') });
      shard(ctx, HX, HY + 20, 13, 0.7, { glow: d >= HERO.gDay ? 1.6 : 1 });
      // ghost beside her; raises a hand to rewind
      const arm = t < 1.5 ? L.sm(0.6, 1.4, t) : (t < 2.3 ? 1 : 1 - L.sm(2.3, 3.0, t));
      ghostFig(ctx, 612, 1685, 1.35, t, { a: 0.42, arm, joined: true });
      ctx.restore();
      if (t > 1.5 && t < 2.1) { // rewind streaks
        const rw = Math.sin((t - 1.5) / 0.6 * Math.PI); ctx.save(); ctx.globalAlpha = 0.25 * rw; ctx.fillStyle = '#dfe6e2'; for (let k = 0; k < 7; k++) ctx.fillRect(0, (k * 311 + t * 4000) % 1920, 1080, 6); ctx.restore(); }
      // cards
      card(ctx, ['Every piece was', 'already here.'], 1000, 100, t < 1.2 ? 1 : 1 - L.sm(1.2, 1.45, t));
      card(ctx, ['Rewind the year.'], 1000, 100, fade(t, 2.15, 3.7));
      card(ctx, ['The red took weeks.'], 300, 96, fade(t, 6.7, 8.6));
      card(ctx, ['Our answer took seasons.'], 300, 90, fade(t, 8.7, 10.4));
      card(ctx, ['Then it had to travel.'], 300, 90, fade(t, 10.5, 12.5));
      card(ctx, ['The ghost always', 'came first.'], 1180, 96, fade(t, 13.6, 15.25));
      card(ctx, ['The real light', 'came later.'], 1180, 96, fade(t, 15.4, 17.3));
      slate(ctx, t < 1.5 ? 'SC1  CLOSE  (flash-forward)' : t < 2.1 ? 'SC1  REWIND' : t < 3.8 ? 'SC2  CLOSE' : t < 6.6 ? 'SC3  CRANE UP' : t < 10.4 ? 'SC4  WIDE' : t < 13 ? 'SC5  DROP DOWN' : 'SC6  CLOSE+');
    } else if (t < 19.8) {
      ctx.save(); applyCam(ctx, camAt(CK, 17.3)); nave(ctx, 490, 17.3, {}); hero(ctx, 490, 17.3, {}); shard(ctx, HX, HY + 20, 13, 0.7, { glow: 1.6 });
      ghostFig(ctx, 612, 1685, 1.35, 17.3, { a: 0.42, arm: 0, joined: true }); ctx.restore();
      ctx.fillStyle = `rgba(8,9,11,${0.62 * L.sm(17.3, 17.7, t)})`; ctx.fillRect(0, 0, 1080, 1920);
      card(ctx, ['We slowed it down', 'so you could see it.'], 860, 96, fade(t, 17.45, 19.75));
      slate(ctx, 'SC7  FREEZE');
    } else if (t < 27) {
      snap(ctx, t); slate(ctx, 'SC8  SNAP  FLAT');
    } else {
      // IN++: ghost hand and real hand meet on the same shard
      ctx.save(); applyCam(ctx, camAt(CK2, t));
      nave(ctx, 490, t, { ghost: false }); hero(ctx, 490, t, { mood: 'soft' });
      const al = L.sm(28.2, 29.8, t);
      shard(ctx, HX, HY + 20, 13 + 3 * al, 0.7, { glow: 1.4 + al });
      const gx = L.lerp(612, 575, al);
      ghostFig(ctx, gx, 1685, 1.35, t, { a: L.lerp(0.42, 0.3, al), arm: 0, joined: al < 0.95, handTo: [L.lerp(gx - 12, HX + 6, al), L.lerp(1720, HY + 20, al)] });
      ctx.restore();
      card(ctx, ['Same pieces.', 'Found sooner.'], 420, 100, fade(t, 27.3, 29.4));
      ctx.fillStyle = `rgba(8,9,11,${0.45 * L.sm(29.4, 29.8, t)})`; ctx.fillRect(0, 0, 1080, 1920);
      card(ctx, ['This is', 'the bottleneck.'], 420, 112, fade(t, 29.5, 32.1));
      slate(ctx, 'SC9  EXTREME CLOSE  DROP IN');
      if (t >= 32) L.endCard(ctx, L.sm(32, 32.4, t), { line: 'The bottleneck is us.' });
    }
    L.grain(ctx, t, { alpha: 0.045, n: 400 });
  }

  return { draw, DUR,
    acts: [{ start: 0, end: 17.3, bpm: 0, drone: true }, { start: 10.4, end: 17.3, bpm: 50 }, { start: 19.8, end: 27, bpm: 0, drone: true }, { start: 27, end: 37, bpm: 0, drone: true }],
    cues: [{ t: 1.5, type: 'whoosh' }, { t: 3.8, type: 'whoosh' }, { t: tOfDay(HERO.aiDay), type: 'pop' }, { t: tOfDay(HERO.gDay), type: 'ding' }, { t: 19.8, type: 'hit' }, { t: 25.1, type: 'pop' }, { t: 29.5, type: 'hit' }],
    _debug: { N, heroG: HERO.gDay, heroAI: HERO.aiDay, heroRed: HERO.redDay, tG: tOfDay(HERO.gDay), tAI: tOfDay(HERO.aiDay) } };
}
module.exports = makeScene;
