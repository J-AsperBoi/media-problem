// the-mind-grid: split-screen-race, x-ray, body/biology. Analog: quebec-1989.
// Top half: x-ray of one engineer's head, neurons as a network. Bottom half: one province's grid, the SAME network.
// One stated mapping (log time, drawn as the split line): event seconds E = 10^((t - 6.5) / 1.5), clock frozen at t = 19.3.
// Red = analog threat.points endpoints (0 at 02:44, all down at 90 s), fitted with L.logistic (doubling 6.78 s, s0 0.01; fit is an assumption).
// Restore = threat.events (83% at 9 h). Green = 5 analog fragments; links arrive at L.lognormalQuantile(q, 759 h [modelled, never shown], p90 64000 h).
// AI snap = ai_counterfactual (~1 h routing of an existing warning), shown only as "before" the red, labeled illustrative.
// Neural imagery is metaphor only: the head runs on the grid's clock. See output/the-mind-grid/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('quebec-1989');
  const DUR = 37.6, RED = L.RED, GREEN = L.GREEN;
  const BG = '#0b0e13', BG2 = '#0d1118', INK = '#e8e4da', DIM = '#7c828c', BONE = '#d8dde3';
  const rgbaG = a => `rgba(52,210,123,${a})`, rgbaR = a => `rgba(255,59,48,${a})`, rgbaW = a => `rgba(216,221,227,${a})`;

  // ---------------- time mapping ----------------
  const TA = 6.5, SPD = 1.5, TSTOP = 19.3;
  const E = t => t < TA ? 0 : Math.pow(10, (Math.min(t, TSTOP) - TA) / SPD);   // event seconds after 02:44
  const tOfE = e => TA + SPD * Math.log10(e);
  const COL_S = A.threat.points[1].t * 3600;                                   // 90 s
  const S0 = 0.01, DBL = Math.LN2 / (Math.log(0.99 * (1 - S0) / 0.01 / S0) / COL_S); // logistic through (0, s0) and (90 s, 0.99): 6.78 s
  const share = e => e <= 0 ? 0 : L.logistic(e, DBL, S0);
  const RST_S = A.threat.events.find(ev => ev.t === 9).t * 3600;               // 9 h -> 83% restored
  const restored = e => e <= COL_S ? 0 : e <= RST_S ? 0.83 * (e - COL_S) / (RST_S - COL_S) : 0.83 + 0.17 * L.clamp((e - RST_S) / (86400 - RST_S), 0, 1); // tail to 24 h assumed
  const LOGMAX = Math.log10(3.6e8);

  // ---------------- network (unit coordinates, shared by head and grid) ----------------
  const rng = L.rng(313);
  const FR = [
    { id: 'f3', lbl: 'control room', u: 0.55, v: 0.42 },
    { id: 'f4', lbl: 'crews', u: -0.08, v: 0.7 },
    { id: 'f2', lbl: 'science', u: -0.74, v: 0.12 },
    { id: 'f1', lbl: 'forecast', u: -0.42, v: -0.52 },
    { id: 'f5', lbl: 'planners', u: 0.5, v: -0.46 }];
  const nodes = [{ u: -0.12, v: -0.95, origin: true }];
  FR.forEach(f => { f.idx = nodes.length; nodes.push({ u: f.u, v: f.v, frag: f }); });
  let guard = 0;
  while (nodes.length < 44 && guard++ < 5000) {
    const u = rng() * 2 - 1, v = rng() * 2 - 1; if (u * u + v * v > 0.95) continue;
    if (nodes.some(n => Math.hypot(n.u - u, n.v - v) < 0.235)) continue; nodes.push({ u, v });
  }
  const N = nodes.length, dist = (a, b) => Math.hypot(nodes[a].u - nodes[b].u, nodes[a].v - nodes[b].v);
  const edges = [], has = new Set(), addE = (a, b) => { const k = a < b ? a + '_' + b : b + '_' + a; if (a === b || has.has(k)) return; has.add(k); edges.push([a, b]); };
  { const inT = [true].concat(Array(N - 1).fill(false)); for (let k = 1; k < N; k++) { let best = null; // MST (Prim) for connectivity
      for (let i = 0; i < N; i++) if (inT[i]) for (let j = 0; j < N; j++) if (!inT[j]) { const d = dist(i, j); if (!best || d < best[2]) best = [i, j, d]; }
      inT[best[1]] = true; addE(best[0], best[1]); } }
  for (let i = 0; i < N; i++) { const o = [...Array(N).keys()].filter(j => j !== i).sort((a, b) => dist(i, a) - dist(i, b)); if (dist(i, o[1]) < 0.42) addE(i, o[1]); }
  const adj = nodes.map(() => []); edges.forEach(([a, b]) => { adj[a].push(b); adj[b].push(a); });
  const bfs = (s) => { const d = Array(N).fill(1e9), p = Array(N).fill(-1); d[s] = 0; const q = [s];
    while (q.length) { const x = q.shift(); adj[x].forEach(y => { if (d[y] > d[x] + 1) { d[y] = d[x] + 1; p[y] = x; q.push(y); } }); } return { d, p }; };
  // cascade order: hop distance from origin, ties by distance
  const hop = bfs(0).d; const order = [...Array(N).keys()].sort((a, b) => hop[a] - hop[b] || dist(0, a) - dist(0, b));
  order.forEach((i, r) => { nodes[i].rank = r; nodes[i].fallQ = (r + 0.5) / N; nodes[i].backQ = (N - r - 0.5) / N; });
  const invShare = s => { const x = s * (1 - S0) / (1 - s); return Math.log(x / S0) / (Math.LN2 / DBL); };
  nodes.forEach(n => { n.fallT = tOfE(Math.max(1, invShare(n.fallQ))); });
  // green links around the loop; arrival from lognormal quantiles of the analog aggregation
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;
  const links = FR.map((f, i) => { const g = FR[(i + 1) % FR.length]; const { p } = bfs(f.idx); const path = []; let x = g.idx; while (x !== -1) { path.unshift(x); x = p[x]; }
    const q = (i + 0.5) / FR.length, hrs = L.lognormalQuantile(q, MED, P90); return { path, hrs, t: tOfE(hrs * 3600) }; });
  links.forEach(l => { l.len = []; let s = 0; l.path.forEach((n, k) => { if (k) s += dist(l.path[k - 1], n); l.len.push(s); }); l.total = s;
    l.tries = []; const r2 = L.rng(Math.round(l.hrs)); for (let tt = 0.8 + r2() * 0.8; tt < l.t - 0.9; tt += 1.0 + r2() * 0.9) l.tries.push({ t: tt, f: 0.25 + r2() * 0.45, from: r2() < 0.5 }); });
  const pathPt = (l, f, P) => { const s = f * l.total; let k = 1; while (k < l.len.length - 1 && l.len[k] < s) k++;
    const a = P[l.path[k - 1]], b = P[l.path[k]], seg = (l.len[k] - l.len[k - 1]) || 1, g = L.clamp((s - l.len[k - 1]) / seg, 0, 1); return [L.lerp(a[0], b[0], g), L.lerp(a[1], b[1], g)]; };

  // ---------------- two embeddings of the same graph ----------------
  const HC = { x: 500, y: 430 }, HPOS = nodes.map(n => [HC.x + n.u * 200, HC.y + n.v * 165]);
  const PC = { x: 470, y: 1290 };
  const rF = a => 1 + 0.1 * Math.sin(3 * a + 1) + 0.06 * Math.sin(5 * a + 2) + 0.04 * Math.sin(8 * a);
  const GPOS = nodes.map(n => { const a = Math.atan2(n.v, n.u); return [PC.x + n.u * 300 * rF(a), PC.y + n.v * 285 * rF(a)]; });
  const curveOff = edges.map((e, i) => (L.rng(i + 7)() - 0.5) * 0.5);

  // ---------------- state at time t ----------------
  function state(t) {
    const tc = Math.min(t, TSTOP), e = E(tc), sh = share(e), rs = restored(e);
    const st = nodes.map(n => { const down = e > 0 && sh >= n.fallQ && rs < n.backQ; const flash = down ? 1 - L.clamp((tc - n.fallT) / 0.35, 0, 1) : 0; return { down, flash }; });
    return { tc, e, st };
  }

  // ---------------- drawing: network in one embedding ----------------
  function drawNet(ctx, P, S, t, kind) {
    const neural = kind === 'head';
    // edges
    edges.forEach(([a, b], i) => {
      const dn = S.st[a].down && S.st[b].down; const [x1, y1] = P[a], [x2, y2] = P[b];
      ctx.strokeStyle = dn ? rgbaR(0.55) : rgbaW(neural ? 0.28 : 0.3); ctx.lineWidth = dn ? 3 : (neural ? 2 : 2.5);
      ctx.beginPath(); ctx.moveTo(x1, y1);
      if (neural) { const mx = (x1 + x2) / 2 - (y2 - y1) * curveOff[i], my = (y1 + y2) / 2 + (x2 - x1) * curveOff[i]; ctx.quadraticCurveTo(mx, my, x2, y2); } else ctx.lineTo(x2, y2);
      ctx.stroke();
    });
    // green links (arrived) and signal pulses
    links.forEach(l => {
      const f = L.clamp((S.tc - (l.t - 0.6)) / 0.6, 0, 1);
      if (f > 0) { ctx.strokeStyle = GREEN; ctx.lineWidth = neural ? 5 : 6; ctx.lineCap = 'round'; ctx.beginPath();
        const n = 40; for (let k = 0; k <= n; k++) { const p = pathPt(l, f * k / n, P); k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.stroke();
        if (f < 1) { const p = pathPt(l, f, P); glow(ctx, p[0], p[1], 34, rgbaG, 0.9); } }
      if (t < TSTOP) l.tries.forEach(tr => { const lt = t - tr.t; if (lt < 0 || lt > 0.85 || tr.t > l.t - 0.6) return;
        const go = L.clamp(lt / 0.5, 0, 1) * tr.f, fadeA = 1 - L.clamp((lt - 0.5) / 0.35, 0, 1);
        const ff = tr.from ? go : 1 - go, f0 = tr.from ? 0 : 1;
        ctx.save(); ctx.globalAlpha = fadeA; ctx.strokeStyle = rgbaG(0.55); ctx.lineWidth = 3; ctx.setLineDash([8, 8]); ctx.beginPath();
        const n = 16; for (let k = 0; k <= n; k++) { const p = pathPt(l, L.lerp(f0, ff, k / n), P); k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); } ctx.stroke(); ctx.setLineDash([]);
        const p = pathPt(l, ff, P); glow(ctx, p[0], p[1], 22, rgbaG, 0.8 * fadeA); ctx.restore(); });
    });
    // nodes
    nodes.forEach((n, i) => { const [x, y] = P[i], s = S.st[i];
      if (s.flash > 0) glow(ctx, x, y, 60, rgbaR, 0.9 * s.flash);
      if (n.frag) { glow(ctx, x, y, 46, rgbaG, 0.5 + 0.15 * Math.sin(t * 5 + i)); ctx.fillStyle = GREEN;
        if (neural) { ctx.beginPath(); ctx.arc(x, y, 12, 0, 7); ctx.fill(); } else ctx.fillRect(x - 12, y - 12, 24, 24);
        if (s.down) { ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(x, y, 20, 0, 7); ctx.stroke(); }
        return; }
      const col = s.down ? rgbaR(0.75) : BONE;
      if (neural) { ctx.fillStyle = s.down ? rgbaR(0.35) : rgbaW(0.9); ctx.beginPath(); ctx.arc(x, y, 7, 0, 7); ctx.fill(); if (!s.down) glow(ctx, x, y, 16, rgbaW, 0.25); }
      else { ctx.strokeStyle = col; ctx.lineWidth = 2.5; ctx.strokeRect(x - 7, y - 7, 14, 14); if (!s.down) { ctx.fillStyle = rgbaW(0.8); ctx.fillRect(x - 3, y - 3, 6, 6); } }
    });
  }
  function glow(ctx, x, y, r, f, a) { if (a <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, f(a)); g.addColorStop(1, f(0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }

  // ---------------- head (x-ray) ----------------
  function drawHead(ctx, t, S) {
    // skin halo
    ctx.save(); ctx.strokeStyle = rgbaW(0.12); ctx.lineWidth = 26; ctx.beginPath(); ctx.ellipse(500, 560, 272, 356, 0, 0, 7); ctx.stroke();
    ctx.strokeStyle = rgbaW(0.35); ctx.lineWidth = 3; ctx.beginPath(); ctx.ellipse(500, 560, 272, 356, 0, 0, 7); ctx.stroke(); ctx.restore();
    // cranium
    const g = ctx.createRadialGradient(500, 440, 60, 500, 440, 260); g.addColorStop(0, 'rgba(216,221,227,0.03)'); g.addColorStop(0.85, 'rgba(216,221,227,0.10)'); g.addColorStop(1, 'rgba(216,221,227,0.30)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(500, 455, 245, 250, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = rgbaW(0.7); ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(500, 455, 245, 250, 0, 0, 7); ctx.stroke();
    // cheekbones + jaw
    ctx.strokeStyle = rgbaW(0.55); ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(275, 560); ctx.bezierCurveTo(290, 720, 350, 860, 500, 880); ctx.bezierCurveTo(650, 860, 710, 720, 725, 560); ctx.stroke();
    ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(330, 700); ctx.quadraticCurveTo(400, 690, 440, 710); ctx.moveTo(670, 700); ctx.quadraticCurveTo(600, 690, 560, 710); ctx.stroke();
    // nose cavity
    ctx.fillStyle = 'rgba(5,7,10,0.8)'; ctx.beginPath(); ctx.moveTo(500, 650); ctx.lineTo(474, 728); ctx.quadraticCurveTo(500, 740, 526, 728); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = rgbaW(0.5); ctx.lineWidth = 2.5; ctx.stroke();
    // teeth
    for (let k = -4; k <= 4; k++) { ctx.strokeStyle = rgbaW(0.45); ctx.lineWidth = 2; ctx.strokeRect(500 + k * 18 - 8, 792, 16, 26); }
    // network inside the cranium
    drawNet(ctx, HPOS, S, t, 'head');
    // orbits and eyes
    const wide = L.sm(TA, 8.5, S.tc) * (1 - L.sm(13, 15, S.tc)) + L.sm(19.4, 21.5, t) * 0.6;
    [430, 570].forEach((ex, k) => { const ey = 610;
      ctx.fillStyle = 'rgba(4,6,9,0.92)'; ctx.beginPath(); ctx.ellipse(ex, ey, 58, 50, 0, 0, 7); ctx.fill(); ctx.strokeStyle = rgbaW(0.6); ctx.lineWidth = 3; ctx.stroke();
      const er = 32 + 4 * wide; ctx.fillStyle = rgbaW(0.82); ctx.beginPath(); ctx.arc(ex, ey, er, 0, 7); ctx.fill();
      const px = ex + (k ? -5 : 5), py = ey + 10; ctx.fillStyle = '#0a0c10'; ctx.beginPath(); ctx.arc(px, py, 13 + 5 * wide, 0, 7); ctx.fill();
      ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(px + 5, py + 4, 4.5, 0, 7); ctx.fill();     // the green lamp, reflected
      ctx.fillStyle = rgbaW(0.9); ctx.beginPath(); ctx.arc(px - 5, py - 6, 3, 0, 7); ctx.fill();
      // brows: worried (inner ends up), rising with vertigo
      const d = k ? 1 : -1; ctx.strokeStyle = rgbaW(0.7); ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath();
      ctx.moveTo(ex - d * 18, ey - 70 - 10 * wide); ctx.lineTo(ex + d * 48, ey - 58 - 3 * wide); ctx.stroke(); });
    // green glow on the face from the lamp
    glow(ctx, 500, 900, 260, rgbaG, 0.16);
  }
  function drawConsole(ctx, t) {
    ctx.fillStyle = '#1a1f27'; ctx.fillRect(-400, 870, 1880, 80); ctx.strokeStyle = rgbaW(0.35); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-400, 870); ctx.lineTo(1480, 870); ctx.stroke();
    for (let k = 0; k < 9; k++) { if (k === 4) continue; ctx.fillStyle = rgbaW(0.18); ctx.fillRect(140 + k * 90, 892, 40, 16); }
    glow(ctx, 500, 900, 90, rgbaG, 0.85); ctx.fillStyle = GREEN; ctx.fillRect(478, 890, 44, 20);
    // x-ray hand resting on the console, left of the lamp (bones as lines)
    ctx.strokeStyle = rgbaW(0.55); ctx.lineWidth = 5; ctx.lineCap = 'round';
    const wx = 250, wy = 935; for (let k = 0; k < 4; k++) { const a = -1.25 + k * 0.2, l1 = 70, x1 = wx + Math.cos(a) * l1, y1 = wy + Math.sin(a) * l1;
      ctx.beginPath(); ctx.moveTo(wx + k * 6, wy); ctx.lineTo(x1, y1); ctx.stroke();
      let x = x1, y = y1; [34, 24, 18].forEach((s, j) => { const aa = a + 0.9 + j * 0.25; ctx.beginPath(); ctx.moveTo(x + 3, y); x += Math.cos(aa) * s; y += Math.sin(aa) * s * 0.4 - 2; ctx.lineTo(x, y); ctx.stroke(); }); }
  }

  // ---------------- province (bottom half) ----------------
  function drawProvince(ctx, t, S) {
    ctx.fillStyle = BG2; ctx.fillRect(-400, 950, 1880, 1400);
    ctx.save(); ctx.strokeStyle = rgbaW(0.12); ctx.lineWidth = 22; ctx.beginPath();
    for (let k = 0; k <= 80; k++) { const a = k / 80 * Math.PI * 2, rr = rF(a) * 1.12; const x = PC.x + Math.cos(a) * 300 * rr, y = PC.y + Math.sin(a) * 285 * rr; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.closePath(); ctx.stroke(); ctx.strokeStyle = rgbaW(0.45); ctx.lineWidth = 3; ctx.stroke(); ctx.restore();
    drawStorm(ctx, t, S, true); drawNet(ctx, GPOS, S, t, 'grid');
    FR.forEach(f => { const [x, y] = GPOS[f.idx]; L.label(ctx, f.lbl, x, y - 30, 40, { col: GREEN }); });
  }
  // storm glow (the red, arriving from outside), both halves
  function drawStorm(ctx, t, S, grid) {
    const pre = 1 - L.sm(8.8, 9.6, S.tc), beat = 0.75 + 0.25 * Math.sin(t * 7);
    if (pre <= 0) return;
    if (grid) glow(ctx, GPOS[0][0], GPOS[0][1] - 40, 240, rgbaR, 0.8 * pre * beat);
    else { glow(ctx, 345, 330, 330, rgbaR, 0.95 * pre * beat); glow(ctx, HPOS[0][0], HPOS[0][1] - 40, 200, rgbaR, 0.7 * pre * beat); }
  }
  // divider: the log-time ruler
  function drawRuler(ctx, t, S) {
    ctx.fillStyle = '#05070a'; ctx.fillRect(-400, 938, 1880, 24);
    const x0 = 90, x1 = 890, xe = e => x0 + (x1 - x0) * L.clamp(Math.log10(Math.max(1, e)) / LOGMAX, 0, 1);
    ctx.strokeStyle = rgbaW(0.6); ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, 950); ctx.lineTo(x1, 950); ctx.stroke();
    [['second', 1], ['minute', 60], ['hour', 3600], ['day', 86400], ['month', 2.63e6], ['year', 3.156e7]].forEach(([w, e], k) => { const x = xe(e);
      ctx.beginPath(); ctx.moveTo(x, 940); ctx.lineTo(x, 962); ctx.stroke(); L.label(ctx, w, x, 995, 30, { col: DIM }); });
    L.label(ctx, 'log time', x0, 928, 30, { col: DIM, align: 'left' });
    // red span of the fall on the ruler
    if (S.e > 0) { ctx.fillStyle = rgbaR(0.9); ctx.fillRect(x0, 945, xe(Math.min(S.e, COL_S)) - x0, 10); }
    links.forEach(l => { if (S.tc >= l.t) { ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(xe(l.hrs * 3600), 950, 8, 0, 7); ctx.fill(); } });
    if (S.tc >= links[4].t) L.label(ctx, '7 years', xe(links[4].hrs * 3600) - 10, 928, 34, { col: GREEN, align: 'right' });
    if (S.e > 0) { const x = xe(S.e); ctx.fillStyle = INK; ctx.beginPath(); ctx.moveTo(x, 936); ctx.lineTo(x - 9, 922); ctx.lineTo(x + 9, 922); ctx.fill(); }
  }

  // ---------------- camera (log zoom) ----------------
  const camK = [[0, 500, 632, 3.2], [3.0, 500, 632, 3.2], [6.3, 540, 960, 1], [19.3, 540, 960, 1], [22.3, 500, 618, 4.6], [24.8, 500, 614, 4.9]];
  function cam(t) {
    if (t <= camK[0][0]) return camK[0].slice(1);
    for (let i = 0; i < camK.length - 1; i++) { const a = camK[i], b = camK[i + 1]; if (t <= b[0]) {
      const f = L.ease.inOut((t - a[0]) / (b[0] - a[0])); const Z = Math.exp(L.lerp(Math.log(a[3]), Math.log(b[3]), f));
      const u = Math.abs(1 / b[3] - 1 / a[3]) < 1e-6 ? f : (1 / Z - 1 / a[3]) / (1 / b[3] - 1 / a[3]);
      return [L.lerp(a[1], b[1], u), L.lerp(a[2], b[2], u), Z]; } }
    return camK[camK.length - 1].slice(1);
  }
  function drawWorld(ctx, t, S) {
    const [cx, cy, z] = cam(t);
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    ctx.save(); ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-cx, -cy);
    drawProvince(ctx, t, S); ctx.fillStyle = BG; ctx.fillRect(-400, -400, 1880, 1350);
    drawStorm(ctx, t, S); drawHead(ctx, t, S); drawConsole(ctx, t); drawRuler(ctx, t, S);
    ctx.restore();
  }

  // ---------------- text ----------------
  const card = (ctx, t, a, b, lines, y = 270, size = 74) => { const al = L.sm(a, a + 0.3, t) * (1 - L.sm(b - 0.3, b, t)); if (al > 0) L.title(ctx, lines, y, size, { alpha: al }); };

  // ---------------- snap ----------------
  function drawTrueScale(ctx, lt) {
    ctx.fillStyle = BG2; ctx.fillRect(0, 0, 1080, 1920);
    L.title(ctx, ['At true scale,', 'the fall is invisible.'], 420, 78, { alpha: L.sm(0.1, 0.5, lt) });
    const a = L.sm(0.3, 0.8, lt); ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = rgbaW(0.16); ctx.fillRect(90, 900, 900, 70); ctx.strokeStyle = rgbaW(0.5); ctx.lineWidth = 2; ctx.strokeRect(90, 900, 900, 70);
    ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(990, 935, 16, 0, 7); ctx.fill();
    ctx.fillStyle = RED; ctx.fillRect(90, 860, 2, 150);   // 90 s of ~7 yr = 0.0004 px; drawn as a 2 px hairline
    L.label(ctx, 'the fall: too thin to see', 104, 845, 44, { col: RED, align: 'left' });
    L.label(ctx, 'lasting fix: 7 years', 890, 1040, 44, { col: GREEN, align: 'right' });
    L.label(ctx, 'linear time', 90, 1110, 34, { col: DIM, align: 'left' });
    ctx.restore();
  }
  function drawLanes(ctx, lt) {
    ctx.fillStyle = BG2; ctx.fillRect(0, 0, 1080, 1920);
    const x0 = 190, x1 = 990, xe = e => x0 + (x1 - x0) * L.clamp(Math.log10(Math.max(1, e)) / LOGMAX, 0, 1);
    const ys = [560, 840, 1120];
    // before zone + red band through all lanes
    ctx.fillStyle = rgbaW(0.05); ctx.fillRect(80, 470, x0 - 90, 740);
    ctx.fillStyle = rgbaR(0.12); ctx.fillRect(x0, 470, xe(COL_S) - x0, 740);
    ys.forEach(y => { ctx.strokeStyle = rgbaW(0.35); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(80, y); ctx.lineTo(x1, y); ctx.stroke(); });
    // lane 1: the fall
    L.label(ctx, 'the fall', 90, ys[0] - 40, 44, { col: RED, align: 'left' });
    const fr = L.clamp(lt / 0.5, 0, 1); ctx.fillStyle = RED; ctx.fillRect(x0, ys[0] - 14, (xe(COL_S) - x0) * fr, 28);
    // lane 2: as it happened
    L.label(ctx, 'as it happened', 90, ys[1] - 40, 44, { col: INK, align: 'left' });
    links.forEach((l, k) => { const a = L.sm(0.3 + k * 0.15, 0.5 + k * 0.15, lt); if (a <= 0) return; ctx.globalAlpha = a; ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(xe(l.hrs * 3600), ys[1], 14, 0, 7); ctx.fill(); ctx.globalAlpha = 1; });
    // lane 3: AI-routed (illustrative): the warning reaches control before the red; everything else unchanged
    L.label(ctx, 'AI-routed', 90, ys[2] - 40, 44, { col: INK, align: 'left' });
    L.label(ctx, '(illustrative)', 300, ys[2] - 40, 44, { col: DIM, align: 'left' });
    links.forEach(l => { ctx.strokeStyle = rgbaG(0.5); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(xe(l.hrs * 3600), ys[2], 13, 0, 7); ctx.stroke(); });
    const pop = L.sm(1.2, 1.45, lt); if (pop > 0) { glow(ctx, 135, ys[2], 90, rgbaG, 0.8 * pop); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(135, ys[2], 20 * L.ease.back(pop), 0, 7); ctx.fill();
      L.label(ctx, 'warning reaches control', 90, ys[2] + 80, 44, { col: GREEN, align: 'left', alpha: pop });
      L.label(ctx, 'before the red', 90, ys[2] + 132, 44, { col: GREEN, align: 'left', alpha: pop }); }
    L.label(ctx, 'steel: still years', 890, ys[2] + 80, 40, { col: DIM, align: 'right', alpha: L.sm(2.2, 2.5, lt) });
    // ruler
    ctx.strokeStyle = rgbaW(0.5); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(80, 1360); ctx.lineTo(x1, 1360); ctx.stroke();
    L.label(ctx, 'before', 135, 1400, 30, { col: DIM });
    [['sec', 1], ['min', 60], ['hour', 3600], ['day', 86400], ['month', 2.63e6], ['year', 3.156e7]].forEach(([w, e]) => { const x = xe(e); ctx.beginPath(); ctx.moveTo(x, 1350); ctx.lineTo(x, 1370); ctx.stroke(); L.label(ctx, w, x, 1400, 30, { col: DIM }); });
    L.label(ctx, 'log time', 90, 1450, 30, { col: DIM, align: 'left' });
  }

  // ---------------- main ----------------
  function draw(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    if (t < 24.8) {
      const S = state(t); drawWorld(ctx, t, S);
      card(ctx, t, -1, 3.0, ['The warning', 'was already here.'], 250, 78);
      card(ctx, t, 3.3, 6.3, ['One head. One grid.', 'Same wiring.'], 250, 70);
      card(ctx, t, 6.6, 9.9, ['Both fall', 'in 90 seconds.'], 250, 74);
      card(ctx, t, 10.1, 12.9, ['The signal never', 'reaches the hand.'], 250, 70);
      card(ctx, t, 13.2, 15.6, ['Lights back in hours.'], 250, 70);
      card(ctx, t, 15.9, 17.5, ['The pieces keep calling.'], 250, 66);
      card(ctx, t, 17.7, 20.3, ['The lasting fix', 'took 7 years.'], 250, 74);
      card(ctx, t, 22.3, 24.8, ['We slowed it down', 'so you could see it.'], 300, 76);
      L.slate(ctx, t < 3 ? 'SC1  CLOSE  LOCKED-OFF' : t < 6.3 ? 'SC1  PULL OUT  SPLIT' : t < 19.3 ? 'SC1  WIDE SPLIT  LOCKED-OFF' : t < 22.3 ? 'SC1  PUSH IN' : 'SC1  EXTREME CLOSE');
    } else if (t < 25.1) {
      drawWorld(ctx, TSTOP, state(TSTOP)); ctx.fillStyle = `rgba(232,228,218,${0.7 * (1 - (t - 24.8) / 0.3)})`; ctx.fillRect(0, 0, 1080, 1920); L.slate(ctx, 'SC2  FREEZE');
    } else if (t < 27.4) { drawTrueScale(ctx, t - 25.1); L.slate(ctx, 'SC2  SNAP  TRUE SCALE');
    } else if (t < 31.6) { drawLanes(ctx, t - 27.4);
      card(ctx, t, 27.4, 29.5, ['Same pieces, routed first.'], 300, 66);
      card(ctx, t, 29.5, 31.6, ['Operators still decide.'], 300, 66);
      L.slate(ctx, 'SC2  SNAP  THREE LANES');
    } else if (t < 33.6) {
      drawWorld(ctx, 19.25, state(TSTOP)); ctx.fillStyle = 'rgba(13,17,24,0.72)'; ctx.fillRect(0, 0, 1080, 1920);
      // (camera at 19.25 is the wide split: the loop returns to frame-1's world)
      L.title(ctx, ['This is the bottleneck.'], 780, 92, { alpha: L.sm(31.7, 32.1, t) }); L.slate(ctx, 'SC3  WIDE');
    } else { L.endCard(ctx, L.sm(33.6, 34.0, t)); }
    L.grain(ctx, t, { alpha: 0.05 });
  }

  const acts = [{ start: 0, end: 6.5, bpm: 60, drone: true }, { start: 6.5, end: 19.3, bpm: 150, drone: true }, { start: 19.3, end: 24.8, bpm: 0, drone: true },
    { start: 25.1, end: 31.6, bpm: 72, drone: true }, { start: 31.6, end: DUR, bpm: 0, drone: true }];
  const cues = [{ t: 0.05, type: 'hit' }, { t: 3.0, type: 'whoosh' }, { t: tOfE(COL_S), type: 'stamp' }, ...links.map(l => ({ t: l.t, type: 'pop' })),
    { t: 19.4, type: 'whoosh' }, { t: 24.8, type: 'hit' }, { t: 28.6, type: 'ding' }, { t: 31.7, type: 'stamp' }];
  return { draw, DUR, acts, cues, _debug: { links, DBL, nodes, edges } };
}
module.exports = makeScene;
