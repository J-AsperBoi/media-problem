// lights-of-ontario: seamless-loop, subway map, nation. Analog: blackout-2003.
// One mapping: 1 film second = 10 minutes. Race: h = 0.1 + t/6 (h = hours after 14:14), t in [0, 11.4].
// Red = analog threat.points (extent interpolated; station i dark when extent > rank_i/N, rank by path distance from seed).
// Green = fragments f1-f4 at ready_at; line attempts at documented times / lognormal quantiles (median 1.5, p90 1.83); none completes.
// Routed panel = ai_counterfactual 0.25 h, labeled illustrative. Last frame == frame 1 (loop). See output/lights-of-ontario/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('blackout-2003');
  const DUR = 31.0, RED = L.RED, GREEN = L.GREEN;
  const BG = '#10131a', CREAM = '#efe8d4', DARKST = '#1b1e24', INK = '#0b0d12';
  const rgbaG = a => `rgba(52,210,123,${a})`, rgbaR = a => `rgba(255,59,48,${a})`, rgbaC = a => `rgba(239,232,212,${a})`;

  // ---------------- time mapping ----------------
  const H0 = 0.1, SPF = 6, RACE_END = 11.4;
  const raceH = t => H0 + t / SPF;
  const PTS = A.threat.points;
  const extent = h => { if (h <= PTS[0].t) return 0; for (let i = 0; i < PTS.length - 1; i++) { const a = PTS[i], b = PTS[i + 1]; if (h <= b.t) return L.lerp(a.extent, b.extent, (h - a.t) / (b.t - a.t)); } return 1; };
  const TRIPS = PTS.filter(p => p.t > 0 && p.extent === 0).map(p => p.t);     // 0.85, 1.30, 1.45
  const FR = {}; A.solution.fragments.forEach(f => FR[f.id] = f);
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;
  const AIH = A.ai_counterfactual.aggregation_median;                          // 0.25 h

  // ---------------- network ----------------
  const LINES = [
    { col: '#8a8f98', p: [[90, 540], [400, 540], [560, 700], [990, 700]] },
    { col: '#6b7079', p: [[220, 420], [220, 960], [460, 1200], [460, 1640]] },
    { col: '#a3a8b0', p: [[90, 1080], [990, 1080]] },
    { col: '#777c84', p: [[720, 420], [720, 1640]] },
    { col: '#5d626a', p: [[340, 440], [580, 440], [880, 740], [880, 1200], [660, 1420], [120, 1420]] },
    { col: '#959aa2', p: [[160, 1600], [600, 1600], [860, 1340], [990, 1340]] },
  ];
  const segs = []; LINES.forEach((ln, li) => { for (let i = 0; i < ln.p.length - 1; i++) segs.push({ li, i, a: ln.p[i], b: ln.p[i + 1] }); });
  const inter = (s, u) => { const [x1, y1] = s.a, [x2, y2] = s.b, [x3, y3] = u.a, [x4, y4] = u.b; const d = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4); if (Math.abs(d) < 1e-9) return null;
    const tt = ((x1 - x3) * (y3 - y4) - (y1 - y3) * (x3 - x4)) / d, uu = -((x1 - x2) * (y1 - y3) - (y1 - y2) * (x1 - x3)) / d;
    if (tt < -1e-6 || tt > 1 + 1e-6 || uu < -1e-6 || uu > 1 + 1e-6) return null; return [x1 + tt * (x2 - x1), y1 + tt * (y2 - y1), tt, uu]; };
  // per line: list of distances along the line that must hold a station
  const STN = []; const findSt = (x, y) => { for (let i = 0; i < STN.length; i++) if (Math.hypot(STN[i].x - x, STN[i].y - y) < 26) return i; STN.push({ x, y, adj: [] }); return STN.length - 1; };
  const lineStations = LINES.map((ln, li) => {
    const segLen = []; let tot = 0; for (let i = 0; i < ln.p.length - 1; i++) { const l = Math.hypot(ln.p[i + 1][0] - ln.p[i][0], ln.p[i + 1][1] - ln.p[i][1]); segLen.push([tot, l]); tot += l; }
    const must = [0, tot]; segLen.forEach(([s0]) => must.push(s0));
    segs.filter(s => s.li === li).forEach(s => segs.filter(u => u.li !== li).forEach(u => { const X = inter(s, u); if (X) must.push(segLen[s.i][0] + X[2] * segLen[s.i][1]); }));
    must.sort((a, b) => a - b); const ds = []; must.forEach(d => { if (!ds.length || d - ds[ds.length - 1] > 30) ds.push(d); });
    const all = []; for (let k = 0; k < ds.length - 1; k++) { all.push(ds[k]); const gap = ds[k + 1] - ds[k], n = Math.round(gap / 115); for (let j = 1; j < n; j++) all.push(ds[k] + gap * j / n); } all.push(ds[ds.length - 1]);
    const at = d => { for (let i = segLen.length - 1; i >= 0; i--) if (d >= segLen[i][0] - 1e-6) { const f = Math.min(1, (d - segLen[i][0]) / segLen[i][1]); return [L.lerp(ln.p[i][0], ln.p[i + 1][0], f), L.lerp(ln.p[i][1], ln.p[i + 1][1], f)]; } };
    return all.map(d => { const [x, y] = at(d); return findSt(x, y); });
  });
  const EDGES = []; lineStations.forEach((ids, li) => { for (let k = 0; k < ids.length - 1; k++) { const a = ids[k], b = ids[k + 1]; if (a === b) continue; const w = Math.hypot(STN[a].x - STN[b].x, STN[a].y - STN[b].y);
    EDGES.push({ a, b, li, w }); STN[a].adj.push([b, w]); STN[b].adj.push([a, w]); } });
  const nearest = (x, y) => { let bi = 0; STN.forEach((s, i) => { if (Math.hypot(s.x - x, s.y - y) < Math.hypot(STN[bi].x - x, STN[bi].y - y)) bi = i; }); return bi; };
  const SEED = nearest(220, 540);
  const FS = { f1: nearest(400, 540), f3: nearest(880, 740), f4: nearest(340, 1080), f2: nearest(860, 1340) };
  // Dijkstra from seed -> rank
  const dist = STN.map(() => Infinity); dist[SEED] = 0; const done = STN.map(() => false);
  for (let it = 0; it < STN.length; it++) { let u = -1; STN.forEach((_, i) => { if (!done[i] && (u < 0 || dist[i] < dist[u])) u = i; }); if (u < 0 || dist[u] === Infinity) break; done[u] = true; STN[u].adj.forEach(([v, w]) => { if (dist[u] + w < dist[v]) dist[v] = dist[u] + w; }); }
  const r0 = L.rng(1408); const order = STN.map((_, i) => i).sort((a, b) => (dist[a] + r0() * 0) - dist[b]);
  const N = STN.length; order.forEach((i, k) => { STN[i].rank = (k + 1) / N; });
  // h at which each station goes dark: smallest h with extent(h) >= rank (bisection on the monotone piecewise-linear curve)
  STN.forEach(s => { let lo = 1.8, hi = 2.0; for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; extent(m) >= s.rank ? hi = m : lo = m; } s.hDark = hi; });
  // trip edges: the first edges out of the seed along shortest paths
  const tripEdges = EDGES.map((e, i) => ({ e, i })).filter(({ e }) => e.a === SEED || e.b === SEED).slice(0, 3).map(o => o.e);
  while (tripEdges.length < 3) tripEdges.push(tripEdges[0]);
  // green line attempts (never complete)
  const lq = q => L.lognormalQuantile(q, MED, P90);
  const ATT = [
    { a: 'f1', b: 'f2', h: 0.16, reach: 0.35 },
    { a: 'f4', b: 'f2', h: 0.90, reach: 0.45 },
    { a: 'f2', b: 'f3', h: Math.max(lq(0.60), FR.f2.ready_at), reach: 0.55 },
    { a: 'f2', b: 'f4', h: Math.max(lq(0.80), FR.f2.ready_at), reach: 0.5 },
    { a: 'f3', b: 'f1', h: Math.max(lq(0.90), FR.f3.ready_at), reach: 0.4 },
  ];
  const LBL = { f1: ['knows the alarms are dead', 20, 76, 'center'], f2: ['can cut the load', -40, 70, 'center'], f3: ['has the map', -30, -48, 'right'], f4: ['saw lines trip', 0, 72, 'center'] };

  // ---------------- network drawing ----------------
  // st: { h, mode: 'human'|'ai'|'relight', relit (0..1), k (mark scale), labels }
  function isDark(i, st) { if (st.mode === 'ai') return false; const s = STN[i]; if (st.mode === 'relight') return s.rank > st.relit; return st.h >= s.hDark; }
  function fragLit(id, st) { if (st.mode === 'relight') return st.h >= FR[id].ready_at; if (st.mode === 'ai') return st.h >= Math.min(FR[id].ready_at, aiLinkH(id)); return st.h >= FR[id].ready_at; }
  const AI_LINKS = [{ b: 'f2', h0: 0.10, h1: 0.22 }, { b: 'f4', h0: 0.12, h1: 0.24 }, { b: 'f3', h0: 0.13, h1: AIH }];
  function aiLinkH(id) { if (id === 'f1') return 0; const l = AI_LINKS.find(x => x.b === id); return l ? l.h1 : 9; }
  function drawNet(ctx, st) {
    const k = st.k || 1;
    // edges
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    EDGES.forEach(e => { const da = isDark(e.a, st), db = isDark(e.b, st);
      ctx.strokeStyle = (da && db) ? '#2a2e35' : (da || db) ? '#3d4149' : LINES[e.li].col; ctx.lineWidth = 11 * (st.lw || 1);
      ctx.beginPath(); ctx.moveTo(STN[e.a].x, STN[e.a].y); ctx.lineTo(STN[e.b].x, STN[e.b].y); ctx.stroke(); });
    // red: cascade front (edges with a station that went dark in the last 0.03 h)
    if (st.mode === 'human') EDGES.forEach(e => { const fa = st.h - STN[e.a].hDark, fb = st.h - STN[e.b].hDark; const f = Math.max(fa >= 0 && fa < 0.03 ? 1 - fa / 0.03 : 0, fb >= 0 && fb < 0.03 ? 1 - fb / 0.03 : 0);
      if (f > 0) { ctx.strokeStyle = rgbaR(f); ctx.lineWidth = 13 * (st.lw || 1); ctx.beginPath(); ctx.moveTo(STN[e.a].x, STN[e.a].y); ctx.lineTo(STN[e.b].x, STN[e.b].y); ctx.stroke(); } });
    // red: line trips
    TRIPS.forEach((th, j) => { if (st.mode === 'relight' || st.h < th) return; if (st.mode === 'ai' && j > 0) return; const e = tripEdges[j];
      let a = 1; if (st.mode === 'ai') a = 1 - L.sm(0.92, 1.0, st.h); if (st.mode === 'human' && isDark(e.a, st) && isDark(e.b, st)) a = 0.55;
      const g = L.sm(th, th + 0.04, st.h); const S = STN[e.a === SEED ? e.a : e.b], E = STN[e.a === SEED ? e.b : e.a];
      if (st.mode === 'ai' && a < 1) { ctx.strokeStyle = '#6d7078'; ctx.lineWidth = 13 * (st.lw || 1); ctx.beginPath(); ctx.moveTo(S.x, S.y); ctx.lineTo(L.lerp(S.x, E.x, g), L.lerp(S.y, E.y, g)); ctx.stroke(); }
      ctx.strokeStyle = rgbaR(a); ctx.lineWidth = 14 * (st.lw || 1); ctx.beginPath(); ctx.moveTo(S.x, S.y); ctx.lineTo(L.lerp(S.x, E.x, g), L.lerp(S.y, E.y, g)); ctx.stroke(); });
    // green: attempts (human) or routed links (ai)
    if (st.mode === 'human') ATT.forEach(at => { const d = st.h - at.h; if (d < 0 || d > 0.2) return; const grow = L.sm(0, 0.1, d), fade = 1 - L.sm(0.1, 0.2, d);
      const P = STN[FS[at.a]], Q = STN[FS[at.b]]; const ex = L.lerp(P.x, Q.x, at.reach * grow), ey = L.lerp(P.y, Q.y, at.reach * grow);
      ctx.save(); ctx.setLineDash([18, 14]); ctx.strokeStyle = rgbaG(0.9 * fade); ctx.lineWidth = 7 * k; ctx.beginPath(); ctx.moveTo(P.x, P.y); ctx.lineTo(ex, ey); ctx.stroke(); ctx.restore();
      ctx.fillStyle = rgbaG(fade); ctx.beginPath(); ctx.arc(ex, ey, 7 * k, 0, 7); ctx.fill(); });
    if (st.mode === 'ai') AI_LINKS.forEach(l => { const g = L.sm(l.h0, l.h1, st.h); if (g <= 0) return; const P = STN[FS.f1], Q = STN[FS[l.b]];
      ctx.strokeStyle = rgbaG(0.25); ctx.lineWidth = 22 * k; ctx.beginPath(); ctx.moveTo(P.x, P.y); ctx.lineTo(L.lerp(P.x, Q.x, g), L.lerp(P.y, Q.y, g)); ctx.stroke();
      ctx.strokeStyle = GREEN; ctx.lineWidth = 8 * k; ctx.beginPath(); ctx.moveTo(P.x, P.y); ctx.lineTo(L.lerp(P.x, Q.x, g), L.lerp(P.y, Q.y, g)); ctx.stroke(); });
    // stations
    STN.forEach((s, i) => { const dk = isDark(i, st); const rr = 13 * Math.max(1, k * 0.8);
      if (!dk) { ctx.fillStyle = rgbaC(0.14); ctx.beginPath(); ctx.arc(s.x, s.y, rr * 2.1, 0, 7); ctx.fill(); }
      ctx.fillStyle = dk ? DARKST : CREAM; ctx.strokeStyle = dk ? '#3a3f48' : INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(s.x, s.y, rr, 0, 7); ctx.fill(); ctx.stroke();
      if (st.mode === 'human') { const f = st.h - s.hDark; if (f >= 0 && f < 0.03) { ctx.strokeStyle = rgbaR(1 - f / 0.03); ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(s.x, s.y, rr + 8, 0, 7); ctx.stroke(); } } });
    // red seed: the alarm system failing silently from t0
    if (st.mode !== 'none') { const s = STN[SEED], rk = st.seedK || Math.max(1, k); ctx.fillStyle = rgbaR(0.22); ctx.beginPath(); ctx.arc(s.x, s.y, 34 * rk, 0, 7); ctx.fill();
      ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(s.x, s.y, 17 * rk, 0, 7); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke(); }
    // green fragments
    Object.entries(FS).forEach(([id, si]) => { const s = STN[si]; if (!fragLit(id, st)) return; const dk = isDark(si, st); const rk = Math.max(1, k); const zf = st.zf == null ? 1 : st.zf;
      ctx.save(); ctx.globalAlpha = zf; ctx.fillStyle = rgbaG(dk ? 0.12 : 0.25); ctx.beginPath(); ctx.arc(s.x, s.y, 32 * rk, 0, 7); ctx.fill();
      ctx.strokeStyle = dk ? rgbaG(0.6) : GREEN; ctx.lineWidth = 7 * rk; ctx.beginPath(); ctx.arc(s.x, s.y, 20 * rk, 0, 7); ctx.stroke();
      ctx.fillStyle = dk ? DARKST : GREEN; ctx.beginPath(); ctx.arc(s.x, s.y, 10 * rk, 0, 7); ctx.fill(); ctx.restore();
      if (st.labels) { const [txt, dx, dy, al] = LBL[id]; ctx.save(); ctx.globalAlpha = st.labels; ctx.font = `42px "${HAND}"`; ctx.textAlign = al; ctx.lineWidth = 9; ctx.strokeStyle = BG; ctx.lineJoin = 'round';
        ctx.strokeText(txt, s.x + dx, s.y + dy); ctx.fillStyle = dk ? '#7fbf9a' : GREEN; ctx.fillText(txt, s.x + dx, s.y + dy); ctx.restore(); } });
  }

  // ---------------- platform scene ----------------
  const PLAT = {
    f1: { poster: [50, 420, 0.6], hx: 800, arm: 'L', face: [800, 1302], frag: 'f1' },
    f2: { poster: [362, 420, 0.6], hx: 230, arm: 'R', face: [230, 1302], frag: 'f2' },
  };
  const crowdR = L.rng(77); const CROWD = [0, 1, 2, 3].map(i => ({ dx: 0.2 + i * 0.2 + (crowdR() - 0.5) * 0.06, s: 1.5 + crowdR() * 0.3, look: crowdR() - 0.5, mood: ['glazed', 'bored', 'glazed', 'bored'][i] }));
  function drawPlatform(ctx, which, st, { mood = 'sad', look = [-1, 0.3], lampsOn = true } = {}) {
    const P = PLAT[which];
    // wall and floor as oversized rects so they fill the frame at any scale
    ctx.fillStyle = lampsOn ? '#1d2129' : '#0c0e12'; ctx.fillRect(-3000, -3000, 7080, 4710);
    ctx.strokeStyle = lampsOn ? '#252a33' : '#121418'; ctx.lineWidth = 2; ctx.beginPath(); for (let y = -3000; y < 1710; y += 60) { ctx.moveTo(-3000, y); ctx.lineTo(4080, y); } ctx.stroke();
    ctx.fillStyle = lampsOn ? '#2b2f37' : '#131519'; ctx.fillRect(-3000, 1710, 7080, 60);
    ctx.fillStyle = lampsOn ? '#8d897f' : '#34332f'; ctx.fillRect(-3000, 1712, 7080, 14);
    ctx.fillStyle = '#07080a'; ctx.fillRect(-3000, 1770, 7080, 3000);
    // ceiling lamps
    for (let x = -1500; x < 2600; x += 360) { ctx.fillStyle = lampsOn ? CREAM : '#24272d'; ctx.fillRect(x, 150, 220, 26); if (lampsOn) { ctx.fillStyle = rgbaC(0.07); ctx.fillRect(x - 40, 176, 300, 60); } }
    // wall map poster
    const [px, py, ps] = P.poster, pw = 1080 * ps, ph = 1920 * ps;
    ctx.fillStyle = '#3a3e46'; ctx.fillRect(px - 16, py - 16, pw + 32, ph + 32);
    ctx.save(); ctx.beginPath(); ctx.rect(px, py, pw, ph); ctx.clip(); ctx.fillStyle = BG; ctx.fillRect(px, py, pw, ph);
    ctx.translate(px, py); ctx.scale(ps, ps); drawNet(ctx, { ...st, k: 2.2, lw: 1.2, seedK: 3.2, zf: 1 }); ctx.restore();
    if (!lampsOn) { ctx.fillStyle = 'rgba(8,9,12,0.55)'; ctx.fillRect(px - 16, py - 16, pw + 32, ph + 32); }
    // crowd further down the platform (gray, small)
    const cxs = which === 'f1' ? [110, 260, 420, 560] : [560, 700, 830, 960];
    CROWD.forEach((c, i) => L.stick(ctx, cxs[i], 1640, c.s, { mood: c.mood, col: lampsOn ? '#7d828b' : '#3b3e44', seed: 30 + i, look: [c.look, 0], pose: { armL: 0.25, armR: 0.3 } }));
    // hero with green phone
    const s = 3.0, hy = 1560, hx = P.hx, col = lampsOn ? '#d9d5cb' : '#8f949c';
    const pose = P.arm === 'L' ? { armL: 2.4, armR: 0.35 } : { armL: 0.35, armR: 2.4 };
    const lit = fragLit(P.frag, st);
    const hand = [hx + (P.arm === 'L' ? -1 : 1) * Math.sin(2.4) * 46 * s, hy - 60 * s + 8 * s + Math.cos(2.4) * 46 * s];
    if (lit) { const g = ctx.createRadialGradient(hand[0], hand[1], 10, hand[0], hand[1], 260); g.addColorStop(0, rgbaG(0.35)); g.addColorStop(1, rgbaG(0)); ctx.fillStyle = g; ctx.fillRect(hand[0] - 260, hand[1] - 260, 520, 520); }
    L.stick(ctx, hx, hy, s, { mood, col, seed: which === 'f1' ? 5 : 9, look, pose });
    ctx.save(); ctx.translate(hand[0], hand[1] - 20); ctx.rotate(P.arm === 'L' ? 0.25 : -0.25);
    ctx.fillStyle = lit ? GREEN : '#4a4e56'; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.roundRect(-30, -52, 60, 104, 10); ctx.fill(); ctx.stroke(); ctx.restore();
  }

  // ---------------- camera (log-zoom) ----------------
  const LZP = 6.0;             // platform native scale
  const LZ = [[0, 6.0], [2.4, 6.0], [6.2, 0.0], [10.85, 0.15]];
  function lzAt(t) {
    if (t <= 10.85) return L.key(LZ, t);
    if (t <= 11.6) { const f = (t - 10.85) / 0.75; return L.lerp(0.15, 7.0, f * f * f * 0.55 + f * f * 0.45); }
    if (t <= 15.0) return L.lerp(7.0, 7.2, L.sm(11.6, 15.0, t));
    if (t >= 21.0 && t < 24.8) return L.lerp(7.2, 7.7, L.sm(21.0, 24.6, t));
    if (t >= 28.6) return L.lerp(2.5, 6.0, L.ease.inOut(L.clamp((t - 28.6) / 2.0, 0, 1)));
    return 7.2;
  }
  function world(ctx, t, lz, which, st, pOpts) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    const S = STN[FS[which]], z = Math.pow(2, lz), w = L.sm(0.3, 3.5, lz);
    const cx = L.lerp(540, S.x, w), cy = L.lerp(990, S.y, w); st = { ...st, zf: 1 - L.sm(2.6, 4.2, lz) };
    const pa = L.sm(5.1, 5.9, lz);
    if (pa < 1) { ctx.save(); ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-cx, -cy); drawNet(ctx, st); ctx.restore(); }
    if (pa > 0) { const ps = Math.pow(2, lz - LZP); const P = PLAT[which]; const pv = L.sm(6.0, 7.2, lz);
      const pcx = L.lerp(540, P.face[0], pv), pcy = L.lerp(960, P.face[1] + 60, pv);
      ctx.save(); ctx.globalAlpha = pa; ctx.translate(540, 960); ctx.scale(ps, ps); ctx.translate(-pcx, -pcy); drawPlatform(ctx, which, st, pOpts); ctx.restore(); }
  }
  const card = (ctx, lines, y, a, size = 96) => { if (a > 0) L.title(ctx, lines, y, size, { alpha: a }); };

  // ---------------- snap panels ----------------
  function panel(ctx, y0, hh, mode, title, sub, numTxt) {
    const X0 = 80, W = 920, H = 560;
    ctx.fillStyle = '#161a22'; ctx.fillRect(X0, y0, W, H); ctx.strokeStyle = '#3a3f48'; ctx.lineWidth = 3; ctx.strokeRect(X0, y0, W, H);
    ctx.save(); ctx.beginPath(); ctx.rect(X0 + 16, y0 + 16, 297, 528); ctx.clip(); ctx.fillStyle = BG; ctx.fillRect(X0 + 16, y0 + 16, 297, 528);
    ctx.translate(X0 + 16, y0 + 16); ctx.scale(0.275, 0.275); drawNet(ctx, { h: hh, mode, k: 2.2, lw: 1.5, seedK: 2.6 }); ctx.restore();
    L.label(ctx, title, 370, y0 + 80, 56, { col: '#e8e4da', font: SERIF, align: 'left' });
    if (sub) L.label(ctx, sub, 370, y0 + 140, 46, { col: '#9aa0aa', align: 'left' });
    return { X0, W, y0, H };
  }
  function timeline(ctx, P, hh, marks) {
    const x0 = P.X0 + 310, x1 = P.X0 + P.W - 50, y = P.y0 + P.H - 80, hx = h => L.lerp(x0, x1, h / 2.0);
    ctx.strokeStyle = '#5d626a'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
    marks.forEach(m => { if (hh < m.h) return; ctx.fillStyle = m.col; ctx.fillRect(hx(m.h) - 5, y - 34, 10, 68); });
    ctx.fillStyle = '#e8e4da'; ctx.beginPath(); ctx.arc(hx(hh), y, 11, 0, 7); ctx.fill();
  }

  // ---------------- draw ----------------
  function draw(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    // RACE: one long take
    if (t < 11.6) {
      const h = Math.min(raceH(t), 2.0), lz = lzAt(t), which = t < 8 ? 'f1' : 'f2';
      const st = { h, mode: 'human', labels: L.sm(6.2, 6.8, t) * (1 - L.sm(10.6, 10.85, t)) };
      world(ctx, t, lz, which, st, which === 'f1' ? { mood: 'sad', look: [-1, 0.3] } : { mood: 'awe', look: [0.3, -1], lampsOn: h < STN[FS.f2].hDark });
      card(ctx, ['Four stations.', 'No line between.'], 280, 1 - L.sm(2.0, 2.4, t));
      card(ctx, ['Every station,', 'a lit window.'], 1330, L.sm(3.4, 3.7, t) * (1 - L.sm(5.8, 6.1, t)));
      card(ctx, ['The answer was here.', { text: 'In pieces.', col: GREEN }], 270, L.sm(6.4, 6.7, t) * (1 - L.sm(9.6, 9.9, t)), 88);
      L.slate(ctx, t < 2.4 ? 'SC1  CLOSE' : t < 6.2 ? 'SC1  PULL OUT (one take)' : t < 10.85 ? 'SC1  WIDE' : 'SC1  FALL IN');
      return;
    }
    // Dead stop, then SLOW, on the dark platform
    if (t < 15.0) {
      world(ctx, t, lzAt(t), 'f2', { h: 2.0, mode: 'human' }, { mood: 'awe', look: [0.3, -1], lampsOn: false });
      ctx.fillStyle = `rgba(6,7,9,${0.35 * L.sm(12.2, 12.6, t)})`; ctx.fillRect(0, 0, 1080, 1920);
      card(ctx, ['We slowed it down', 'so you could see it.'], 420, L.sm(12.4, 12.8, t) * (1 - L.sm(14.6, 14.95, t)), 92);
      L.slate(ctx, 'SC2  CLOSE+');
      return;
    }
    // SNAP
    if (t < 21.0) {
      ctx.fillStyle = '#07080b'; ctx.fillRect(0, 0, 1080, 1920);
      if (t < 15.3) { L.slate(ctx, 'SC3  FREEZE'); return; }
      const hh = L.lerp(H0, 2.0, L.clamp((t - 15.9) / 3.8, 0, 1));
      L.label(ctx, 'same afternoon, true proportions', 540, 290, 46, { col: '#9aa0aa' });
      const P1 = panel(ctx, 330, hh, 'human', 'as it happened', 'lines never drawn');
      timeline(ctx, P1, hh, [{ h: MED, col: GREEN }, { h: 1.87, col: RED }]);
      if (hh >= MED) L.label(ctx, '~1.5 h to notice', 370, P1.y0 + 260, 64, { col: GREEN, font: SERIF, align: 'left' });
      const P2 = panel(ctx, 930, hh, 'ai', 'routed', 'illustrative', null);
      timeline(ctx, P2, hh, [{ h: AIH, col: GREEN }, { h: 0.85, col: RED }]);
      if (hh >= AIH) L.label(ctx, '15 min', 370, P2.y0 + 260, 64, { col: GREEN, font: SERIF, align: 'left' });
      if (hh >= 0.9) L.label(ctx, 'people still decide', 370, P2.y0 + 330, 46, { col: '#c9c4b8', align: 'left' });
      ctx.fillStyle = `rgba(7,8,11,${1 - L.sm(15.3, 15.5, t)})`; ctx.fillRect(0, 0, 1080, 1920);
      L.slate(ctx, 'SC3  SNAP');
      return;
    }
    // CLOSE++ and "This is the bottleneck."
    if (t < 24.8) {
      world(ctx, t, lzAt(t), 'f2', { h: 2.0, mode: 'human' }, { mood: 'sad', look: [0.6, 0.4], lampsOn: false });
      ctx.fillStyle = `rgba(7,8,11,${1 - L.sm(21.0, 21.4, t)})`; ctx.fillRect(0, 0, 1080, 1920);
      card(ctx, ['This is the bottleneck.'], 460, L.sm(21.4, 21.8, t), 96);
      ctx.fillStyle = `rgba(13,17,24,${L.sm(24.4, 24.8, t)})`; ctx.fillRect(0, 0, 1080, 1920);
      L.slate(ctx, 'SC4  CLOSE++');
      return;
    }
    // END + LOOP TAIL: the map re-lights behind the card, then the camera settles on frame 1
    const relit = L.sm(28.6, 29.8, t);
    if (t >= 28.6) {
      world(ctx, t, lzAt(t), 'f1', relit < 1 ? { h: H0, mode: 'relight', relit } : { h: H0, mode: 'human' }, { mood: 'sad', look: [-1, 0.3] });
      card(ctx, ['Four stations.', 'No line between.'], 280, L.sm(30.2, 30.7, t));
    }
    const ea = L.sm(24.8, 25.0, t) * (1 - L.sm(28.6, 29.6, t));
    if (ea > 0) L.endCard(ctx, ea, { line: 'Help close the gap.' });
    if (t >= 30.0) L.slate(ctx, 'SC1  CLOSE'); else if (t < 28.6) L.slate(ctx, 'END');
  }

  return {
    draw, DUR,
    acts: [
      { start: 0, end: 10.6, bpm: 0, drone: true },
      { start: 10.6, end: 11.6, bpm: 96, drone: true },
      { start: 12.4, end: 15.0, bpm: 0, drone: true },
      { start: 15.3, end: 21.0, bpm: 52, drone: true },
      { start: 21.0, end: 31.0, bpm: 0, drone: true },
    ],
    cues: [
      { t: 2.4, type: 'whoosh' }, { t: 4.5, type: 'pop' }, { t: 8.4, type: 'pop' }, { t: 10.85, type: 'whoosh' },
      { t: 15.3, type: 'hit' }, { t: 16.2, type: 'ding' }, { t: 24.8, type: 'ding' }, { t: 28.6, type: 'whoosh' },
    ],
  };
}
if (typeof module !== 'undefined') module.exports = makeScene;
