// the-worm-rewind ("Rewind"): ghost-rewind, subway map, crane up and drop down. Analog: wannacry-2017.
// Red: each station = an equal slice of the ~230,000 systems hit in 24 h (s2). Red times from an illustrative
//   logistic (mid 4.0 h, k 1.16/h) pinned to 0 at t0 and saturated by the 7.3 h kill switch (s1; Neino testimony
//   says the bulk was hit before the stop). Flat after 7.3 h. Shape inside 0-7.3 h is NOT sourced; no counts on screen.
// Green (real): per station max(7.3, lognormalQuantile(u, 20, 168)) h.  Ghost / AI: lognormalQuantile(u, 1, 8.4) h (illustrative).
// Mapping: race = log clock 0->168 h over film 2-14 s; snap = linear, 1 week in 4 s. See output/the-worm-rewind/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('wannacry-2017');
  const DUR = 36, RED = L.RED, GREEN = L.GREEN;
  const GHOST = '#8fa596', BG = '#12151b', INK = '#0b0d11', PAPER = '#d9d5cb';

  // ---------- data ----------
  const KS = A.threat.events[0].t;                          // 7.3 h kill switch (s1)
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;   // 20, 168
  const AIMED = A.ai_counterfactual.aggregation_median, AIP90 = AIMED * P90 / MED; // 1, 8.4
  const K = 1.16, MID = 4.0, sig = h => 1 / (1 + Math.exp(-K * (h - MID))), S0 = sig(0), SK = sig(KS);
  const redHourOfQ = q => { const v = S0 + q * (SK - S0); return MID - Math.log(1 / v - 1) / K; };

  // ---------- clock ----------
  const SPAN = 168, LOGS = Math.log10(SPAN + 1), hLog = f => Math.pow(10, L.clamp(f, 0, 1) * LOGS) - 1;
  const HOOK_H = 5, SNAP0 = 18.8, SNAP_S = 4;              // snap: 168 h in 4 s
  const hourAt = t => {
    if (t < 1) return HOOK_H;
    if (t < 2) return HOOK_H * (1 - L.ease.inOut(t - 1));
    if (t < 14) return hLog((t - 2) / 12);
    if (t < 16.5) return SPAN;
    if (t < 18) return hLog(1 - L.ease.inOut((t - 16.5) / 1.5));
    return 0;
  };
  const tOfHour = h => 2 + 12 * Math.log10(h + 1) / LOGS;
  const snapHour = t => L.clamp((t - SNAP0) / SNAP_S, 0, 1) * SPAN;

  // ---------- the network (subway map, world space) ----------
  const GX = c => 150 + c * 97.5, GY = r => 440 + r * 104;
  const LINES = [
    { col: '#9aa0aa', pts: [[0, 2], [1, 2], [2, 2], [3, 3], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4]] },
    { col: '#7b818b', pts: [[4, 0], [4, 1], [4, 2], [4, 3], [4, 4], [4, 5], [4, 6], [4, 7], [4, 8], [4, 9], [4, 10]] },
    { col: '#b3b6bb', pts: [[0, 8], [1, 8], [2, 7], [3, 6], [4, 6], [5, 6], [6, 6], [7, 7], [8, 8]] },
    { col: '#a39d92', pts: [[1, 0], [1, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7], [2, 8], [2, 9], [3, 10], [4, 10]] },
    { col: '#6c727c', pts: [[8, 1], [7, 1], [6, 2], [5, 3], [4, 4], [3, 5], [2, 6], [1, 7], [0, 8]] },
    { col: '#8d96a2', pts: [[6, 0], [6, 1], [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7], [6, 8], [6, 9], [7, 10], [8, 10]] },
  ];
  const nodes = {}, adj = {}, edges = [];
  const addNode = (c, r) => { const k = c + ',' + r; if (!nodes[k]) { nodes[k] = { k, c, r, x: GX(c), y: GY(r), lines: 0 }; adj[k] = []; } return nodes[k]; };
  LINES.forEach(ln => { ln.pts.forEach(([c, r], i) => { const n = addNode(c, r); n.lines++; if (i) { const p = addNode(...ln.pts[i - 1]); if (!adj[p.k].includes(n.k)) { adj[p.k].push(n.k); adj[n.k].push(p.k); edges.push([p.k, n.k]); } } }); });
  const PATCH = addNode(0, 0); PATCH.patch = true; adj[PATCH.k].push('1,0'); adj['1,0'].push(PATCH.k);
  const STOP = { x: GX(8), y: GY(0) };                         // the one-person kill switch, off-network
  const WARD = nodes['2,8'], ORIGIN = nodes['8,8'];
  const bfs = src => { const d = { [src]: 0 }, par = {}, q = [src]; while (q.length) { const u = q.shift(); adj[u].forEach(v => { if (d[v] === undefined) { d[v] = d[u] + 1; par[v] = u; q.push(v); } }); } return { d, par }; };
  const fromPatch = bfs(PATCH.k), fromOrigin = bfs(ORIGIN.k);
  const ST = Object.values(nodes).filter(n => !n.patch);
  const R = L.rng(512);
  ST.forEach(n => { n.noise = R() * 1.8; n.u = 0.03 + R() * 0.94; });
  WARD.u = 0.6;
  const byRed = ST.slice().sort((a, b) => (fromOrigin.d[a.k] + a.noise) - (fromOrigin.d[b.k] + b.noise));
  byRed.forEach((n, i) => { n.rh = redHourOfQ((i + 0.5) / byRed.length); });
  ST.forEach(n => { n.gh = Math.max(KS, L.lognormalQuantile(n.u, MED, P90)); n.ga = L.lognormalQuantile(n.u, AIMED, AIP90); n.saved = n.ga < n.rh; n.par = fromPatch.par[n.k]; });
  // a route edge (parent -> n) is lit when the first station at or below n in the tree is reached
  const kids = {}; ST.forEach(n => { (kids[n.par] = kids[n.par] || []).push(n.k); });
  const subMin = (k, f) => { const n = nodes[k]; let m = n.patch ? Infinity : f(n); (kids[k] || []).forEach(c => { m = Math.min(m, subMin(c, f)); }); return m; };
  ST.forEach(n => { n.eh = subMin(n.k, x => x.gh); n.ea = subMin(n.k, x => x.ga); });

  // ---------- helpers ----------
  const hex = c => [parseInt(c.slice(1, 3), 16), parseInt(c.slice(3, 5), 16), parseInt(c.slice(5, 7), 16)];
  const mix = (a, b, f) => { const A1 = hex(a), B1 = hex(b); return `rgb(${A1.map((v, i) => Math.round(L.lerp(v, B1[i], f))).join(',')})`; };
  const glow = (ctx, x, y, r, col, a) => { if (a <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); const [cr, cg, cb] = hex(col); g.addColorStop(0, `rgba(${cr},${cg},${cb},${a})`); g.addColorStop(1, `rgba(${cr},${cg},${cb},0)`); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); };
  const seg = (ctx, x1, y1, x2, y2, col, w) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); };
  const edgeP = (h, e) => L.clamp((h - e * 0.8) / (e * 0.2 + 0.02), 0, 1);
  const outlined = (ctx, text, x, y, size, col, { font = HAND, a = 1, align = 'center' } = {}) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.font = `${size}px "${font}"`; ctx.textAlign = align; ctx.lineJoin = 'round'; ctx.lineWidth = size * 0.16; ctx.strokeStyle = INK; ctx.strokeText(text, x, y); ctx.fillStyle = col; ctx.fillText(text, x, y); ctx.restore(); };

  // ---------- the map ----------
  // mode 'real' | 'ai'; ghost: draw AI routes as a dim desaturated layer; labels: station names
  function drawMap(ctx, h, { mode = 'real', ghost = 0, labels = 1, bg = true, pulseT = 0 } = {}) {
    if (bg) { ctx.fillStyle = BG; ctx.fillRect(-3000, -3000, 7080, 7920); }
    // faint street grid
    ctx.strokeStyle = 'rgba(255,255,255,0.03)'; ctx.lineWidth = 2;
    for (let x = 60; x <= 1020; x += 48.75) { ctx.beginPath(); ctx.moveTo(x, 380); ctx.lineTo(x, 1540); ctx.stroke(); }
    for (let y = 388; y <= 1540; y += 52) { ctx.beginPath(); ctx.moveTo(60, y); ctx.lineTo(1020, y); ctx.stroke(); }
    // tracks
    LINES.forEach(ln => { ctx.strokeStyle = ln.col; ctx.lineWidth = 15; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.beginPath(); ln.pts.forEach(([c, r], i) => i ? ctx.lineTo(GX(c), GY(r)) : ctx.moveTo(GX(c), GY(r))); ctx.stroke(); });
    seg(ctx, PATCH.x, PATCH.y, GX(1), GY(0), '#5a606a', 15);
    const isRed = n => h >= n.rh && !(mode === 'ai' && n.saved);
    // red runs along the tracks between hit stations
    edges.forEach(([a, b]) => { const A1 = nodes[a], B1 = nodes[b]; const ra = isRed(A1), rb = isRed(B1);
      if (ra && rb) seg(ctx, A1.x, A1.y, B1.x, B1.y, RED, 15);
      else if (ra || rb) { const [s, e] = ra ? [A1, B1] : [B1, A1]; const f = L.clamp((h - s.rh) / Math.max(0.3, e.rh - s.rh), 0, 1) * (mode === 'ai' && e.saved ? 0.45 : 1); seg(ctx, s.x, s.y, L.lerp(s.x, e.x, f), L.lerp(s.y, e.y, f), RED, 15); } });
    // ghost routes (the AI timeline, dim and desaturated)
    if (ghost > 0) { ctx.save(); ctx.globalAlpha = ghost; ctx.setLineDash([14, 10]);
      ST.forEach(n => { const p = edgeP(h, n.ea); if (p <= 0) return; const P = nodes[n.par]; seg(ctx, P.x, P.y, L.lerp(P.x, n.x, p), L.lerp(P.y, n.y, p), GHOST, 7); });
      ctx.setLineDash([]); ctx.restore(); }
    // the route (green line) for this timeline
    ST.forEach(n => { const e = mode === 'ai' ? n.ea : n.eh; const p = edgeP(h, e); if (p <= 0) return; const P = nodes[n.par]; seg(ctx, P.x, P.y, L.lerp(P.x, n.x, p), L.lerp(P.y, n.y, p), GREEN, 7); });
    // stations
    ST.forEach(n => {
      const g = mode === 'ai' ? n.ga : n.gh, red = isRed(n), routed = h >= g, rad = n.lines > 1 ? 20 : 15;
      if (red) glow(ctx, n.x, n.y, 70, RED, 0.35 * (1 - L.clamp((h - n.rh) / 3, 0, 0.6)));
      let fill = PAPER;
      if (red) fill = routed ? mix(RED, '#3a3d44', L.clamp((h - g) / Math.max(4, g * 0.5), 0, 0.85)) : RED;
      ctx.fillStyle = fill; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(n.x, n.y, rad, 0, 7); ctx.fill(); ctx.stroke();
      if (ghost > 0 && h >= n.ga && !routed) { ctx.save(); ctx.globalAlpha = ghost; ctx.strokeStyle = GHOST; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(n.x, n.y, rad + 8, 0, 7); ctx.stroke(); ctx.restore(); }
      if (routed) { ctx.strokeStyle = GREEN; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(n.x, n.y, rad + 8, 0, 7); ctx.stroke(); }
    });
    // the fix: existed 59 days before t0 (s5)
    glow(ctx, PATCH.x, PATCH.y, 110, GREEN, 0.4 + 0.1 * Math.sin(pulseT * 3));
    ctx.fillStyle = GREEN; ctx.strokeStyle = INK; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(PATCH.x, PATCH.y, 30, 0, 7); ctx.fill(); ctx.stroke();
    // the one-person stop at 7.3 h (s1)
    const ks = h >= KS; ctx.fillStyle = ks ? GREEN : '#3a3f48'; ctx.strokeStyle = INK; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(STOP.x, STOP.y, 16, 0, 7); ctx.fill(); ctx.stroke();
    if (ks) { const f = L.clamp((h - KS) / 2, 0, 1); ctx.strokeStyle = GREEN; ctx.globalAlpha = 1 - f; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(STOP.x, STOP.y, 16 + f * 90, 0, 7); ctx.stroke(); ctx.globalAlpha = 1; }
    if (labels > 0) {
      outlined(ctx, 'the fix', PATCH.x + 44, PATCH.y + 12, 40, GREEN, { align: 'left', a: labels });
      outlined(ctx, 'ward', WARD.x - 34, WARD.y + 12, 40, PAPER, { align: 'right', a: labels });
      if (ks) outlined(ctx, 'one person', STOP.x - 30, STOP.y + 12, 36, PAPER, { align: 'right', a: labels * L.clamp((h - KS) / 1.5, 0, 1) });
    }
  }

  // ---------- the ward ----------
  const WM = { cx: 540, cy: 760, s: 0.71 };                 // wall map transform (map center 540,960)
  const wall = (x, y) => [WM.cx + (x - 540) * WM.s, WM.cy + (y - 960) * WM.s];
  const NX = 440, NY = 1700, NS = 4.4;                       // nurse bean
  function nurse(ctx, { mood = 'calm', look = [0, -1], armA = 0, redLight = 0, hand = null } = {}) {
    const bw = 46 * NS, bh = 60 * NS, x = NX, y = NY - bh * 0.3;
    ctx.save();
    // arm (behind body edge), ends in a round hand
    const sx = x + bw * 0.36, sy = y + bh * 0.05;
    const hx = hand ? hand[0] : L.lerp(sx + 30, sx + 200, armA), hy = hand ? hand[1] : L.lerp(sy + 190, sy + 40, armA);
    ctx.strokeStyle = '#8b9099'; ctx.lineWidth = 34; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.quadraticCurveTo(L.lerp(sx, hx, 0.5) + 10, L.lerp(sy, hy, 0.5) + 40, hx, hy); ctx.stroke();
    ctx.fillStyle = '#a9adb4'; ctx.beginPath(); ctx.arc(hx, hy, 26, 0, 7); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
    // body
    ctx.beginPath(); ctx.roundRect(x - bw / 2, y - bh / 2, bw, bh, bw / 2); ctx.fillStyle = '#a4a8af'; ctx.fill();
    if (redLight > 0) { ctx.save(); ctx.clip(); const g = ctx.createLinearGradient(x + bw / 2, 0, x - bw / 4, 0); g.addColorStop(0, `rgba(255,59,48,${0.45 * redLight})`); g.addColorStop(1, 'rgba(255,59,48,0)'); ctx.fillStyle = g; ctx.fillRect(x - bw, y - bh, bw * 2, bh * 2); ctx.restore(); }
    ctx.strokeStyle = 'rgba(0,0,0,0.4)'; ctx.lineWidth = 6; ctx.beginPath(); ctx.roundRect(x - bw / 2, y - bh / 2, bw, bh, bw / 2); ctx.stroke();
    // cap
    ctx.fillStyle = '#e4e1da'; ctx.beginPath(); ctx.moveTo(x - bw * 0.3, y - bh * 0.42); ctx.lineTo(x + bw * 0.3, y - bh * 0.42); ctx.lineTo(x + bw * 0.22, y - bh * 0.56); ctx.lineTo(x - bw * 0.22, y - bh * 0.56); ctx.closePath(); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.stroke();
    // face
    const ey = y - bh * 0.16, er = bw * 0.13;
    [-1, 1].forEach(sd => { const ex = x + sd * bw * 0.19;
      ctx.fillStyle = '#f2efe8'; ctx.beginPath(); ctx.arc(ex, ey, er * (mood === 'panic' ? 1.15 : 1), 0, 7); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.stroke();
      ctx.fillStyle = '#1b1f27'; ctx.beginPath(); ctx.arc(ex + look[0] * er * 0.45, ey + look[1] * er * 0.45, er * (mood === 'panic' ? 0.4 : 0.5), 0, 7); ctx.fill();
      if (mood === 'sad' || mood === 'panic' || mood === 'resolve') { ctx.strokeStyle = '#1b1f27'; ctx.lineWidth = 6; const tilt = mood === 'resolve' ? -0.35 : 0.45; ctx.beginPath(); ctx.moveTo(ex - er * 1.1, ey - er * 1.5 - sd * er * tilt); ctx.lineTo(ex + er * 1.1, ey - er * 1.5 + sd * er * tilt); ctx.stroke(); } });
    const my = y + bh * 0.13; ctx.strokeStyle = '#1b1f27'; ctx.fillStyle = '#1b1f27'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath();
    if (mood === 'sad') { ctx.arc(x, my + bw * 0.12, bw * 0.12, 1.2 * Math.PI, 1.8 * Math.PI); ctx.stroke(); }
    else if (mood === 'panic') { ctx.ellipse(x, my, bw * 0.07, bw * 0.1, 0, 0, 7); ctx.fill(); }
    else if (mood === 'soft') { ctx.arc(x, my - bw * 0.05, bw * 0.12, 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke(); }
    else { ctx.moveTo(x - bw * 0.09, my); ctx.lineTo(x + bw * 0.09, my); ctx.stroke(); }
    ctx.restore(); return [hx, hy];
  }
  const KEY = [690, 1522];
  // screen: {kind: 'red'|'dark'|'route', p (route progress), pressed}
  function room(ctx, h, { lights = 1, mood = 'calm', look = [0, -1], armA = 0, screen = 'auto', routeP = 0, pressed = 0, ghostHand = 0, mapMode = 'real', ghost = 0.6, pulseT = 0, hand = null } = {}) {
    ctx.fillStyle = '#1b1f27'; ctx.fillRect(-3000, -3000, 7080, 7920);
    ctx.fillStyle = '#171a21'; ctx.fillRect(-3000, 1560, 7080, 3000);                 // floor
    ctx.strokeStyle = 'rgba(255,255,255,0.04)'; ctx.lineWidth = 3; for (let x = -200; x < 1300; x += 120) { ctx.beginPath(); ctx.moveTo(x, 1560); ctx.lineTo(x * 1.3 - 160, 2000); ctx.stroke(); }
    // wall map panel
    ctx.fillStyle = '#2b303a'; ctx.fillRect(160, 340, 760, 840); ctx.fillStyle = BG; ctx.fillRect(180, 360, 720, 800);
    ctx.save(); ctx.beginPath(); ctx.rect(180, 360, 720, 800); ctx.clip(); ctx.translate(WM.cx, WM.cy); ctx.scale(WM.s, WM.s); ctx.translate(-540, -960);
    drawMap(ctx, h, { mode: mapMode, ghost, labels: 1, bg: false, pulseT }); ctx.restore();
    // ceiling lamp and its light
    ctx.fillStyle = '#3a3f48'; ctx.fillRect(420, 150, 240, 26);
    if (lights > 0) { const g = ctx.createLinearGradient(0, 176, 0, 1600); g.addColorStop(0, `rgba(235,232,222,${0.16 * lights})`); g.addColorStop(1, 'rgba(235,232,222,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(420, 176); ctx.lineTo(660, 176); ctx.lineTo(1200, 1700); ctx.lineTo(-120, 1700); ctx.closePath(); ctx.fill(); ctx.fillStyle = `rgba(245,242,232,${0.9 * lights})`; ctx.fillRect(430, 170, 220, 8); }
    // desk, monitor
    ctx.fillStyle = '#2c313b'; ctx.fillRect(520, 1540, 600, 60); ctx.fillStyle = '#23272f'; ctx.fillRect(540, 1600, 560, 400);
    ctx.fillStyle = '#2f343d'; ctx.fillRect(770, 1440, 30, 100);
    ctx.fillStyle = '#353a44'; ctx.beginPath(); ctx.roundRect(590, 1170, 420, 290, 14); ctx.fill();
    const SX = 610, SY = 1190, SW = 380, SH = 250;
    const wardRed = h >= WARD.rh && !(mapMode === 'ai' && WARD.saved);
    const kind = screen === 'auto' ? (wardRed ? 'red' : 'calm') : screen;
    ctx.fillStyle = '#0e1116'; ctx.fillRect(SX, SY, SW, SH);
    if (kind === 'red') { const f = L.clamp((h - WARD.rh) / 2, 0, 1); ctx.fillStyle = mix('#0e1116', RED, 0.85 * f); ctx.fillRect(SX, SY, SW, SH); glow(ctx, SX + SW / 2, SY + SH / 2, 520, RED, 0.28 * f * Math.max(0.35, lights)); }
    if (kind === 'calm' || kind === 'route') { ctx.fillStyle = '#5c626c'; for (let i = 0; i < 5; i++) ctx.fillRect(SX + 30, SY + 36 + i * 38, 200 - i * 22, 12); }
    if (kind === 'route') {
      const wx = SX + 200, wy = SY + 70; seg(ctx, SX + 20, wy, wx, wy, '#6c727c', 10);
      seg(ctx, SX + 20, wy, L.lerp(SX + 20, wx, routeP), wy, GREEN, 7);
      ctx.fillStyle = PAPER; ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(wx, wy, 16, 0, 7); ctx.fill(); ctx.stroke();
      if (routeP >= 1) { ctx.strokeStyle = GREEN; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(wx, wy, 26, 0, 7); ctx.stroke(); }
      // apply button
      const ba = L.clamp(routeP * 3 - 2, 0, 1); ctx.save(); ctx.globalAlpha = ba;
      ctx.fillStyle = pressed > 0 ? mix('#2a2f38', GREEN, pressed) : '#2a2f38'; ctx.strokeStyle = pressed > 0 ? GREEN : PAPER; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.roundRect(SX + 20, SY + 150, 170, 70, 12); ctx.fill(); ctx.stroke();
      ctx.font = `44px "${HAND}"`; ctx.textAlign = 'center'; ctx.fillStyle = pressed > 0.5 ? INK : PAPER; ctx.fillText('apply', SX + 105, SY + 198); ctx.restore();
    }
    // keyboard
    ctx.fillStyle = '#3d424c'; ctx.beginPath(); ctx.roundRect(560, 1506, 300, 34, 6); ctx.fill();
    ctx.fillStyle = pressed > 0 ? GREEN : '#555b66'; ctx.fillRect(KEY[0] - 22, KEY[1] - 12, 44, 16);
    // ghost hand already on the key (the AI timeline's version of this moment)
    if (ghostHand > 0) { ctx.save(); ctx.globalAlpha = ghostHand; glow(ctx, KEY[0], KEY[1] - 26, 70, '#8fa596', 0.5); ctx.fillStyle = GHOST; ctx.beginPath(); ctx.arc(KEY[0], KEY[1] - 26, 26, 0, 7); ctx.fill(); ctx.restore(); }
    const hp = nurse(ctx, { mood, look, armA, redLight: kind === 'red' ? L.clamp((h - WARD.rh) / 2, 0, 1) : 0, hand });
    // darkness when the lights are out (loss as absence)
    if (lights < 1) { ctx.fillStyle = `rgba(5,6,9,${0.62 * (1 - lights)})`; ctx.fillRect(-3000, -3000, 7080, 7920); }
    return hp;
  }

  // ---------- overlays ----------
  function hudClock(ctx, h, a = 1, rewind = 0) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; const cx = 470, cy = 250, r = 48;
    ctx.fillStyle = 'rgba(11,13,17,0.75)'; ctx.beginPath(); ctx.arc(cx, cy, r + 6, 0, 7); ctx.fill();
    ctx.strokeStyle = PAPER; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke();
    for (let i = 0; i < 12; i++) { const an = i / 12 * 6.283; seg(ctx, cx + Math.sin(an) * r * 0.8, cy - Math.cos(an) * r * 0.8, cx + Math.sin(an) * r * 0.92, cy - Math.cos(an) * r * 0.92, PAPER, 3); }
    const clockH = 7.75 + h;                                  // outbreak began 07:45 UTC (s1)
    const ha = clockH / 12 * 6.283, ma = clockH * 6.283;
    seg(ctx, cx, cy, cx + Math.sin(ha) * r * 0.5, cy - Math.cos(ha) * r * 0.5, PAPER, 6);
    seg(ctx, cx, cy, cx + Math.sin(ma) * r * 0.78, cy - Math.cos(ma) * r * 0.78, PAPER, 3);
    ctx.font = `36px "${HAND}"`; ctx.textAlign = 'left'; ctx.fillStyle = '#b9bec8'; ctx.fillText(rewind ? 'rewinding' : 'real hours, log clock', cx + 66, cy + 12);
    ctx.restore();
  }
  function rewindFX(ctx, t, a) {
    if (a <= 0) return; ctx.save();
    ctx.fillStyle = `rgba(150,152,158,${0.22 * a})`; ctx.globalCompositeOperation = 'saturation'; ctx.fillRect(0, 0, 1080, 1920); ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = `rgba(14,16,20,${0.3 * a})`; ctx.fillRect(0, 0, 1080, 1920);
    const r = L.rng(90 + Math.floor(t * 15));
    for (let i = 0; i < 5; i++) { const y = r() * 1920; ctx.fillStyle = `rgba(230,228,220,${0.08 * a})`; ctx.fillRect(0, y, 1080, 3 + r() * 10); }
    ctx.globalAlpha = a * 0.85; ctx.fillStyle = PAPER;
    [0, 1].forEach(k => { const x = 880 - k * 56; ctx.beginPath(); ctx.moveTo(x, 250); ctx.lineTo(x + 50, 220); ctx.lineTo(x + 50, 280); ctx.closePath(); ctx.fill(); });
    ctx.restore();
  }
  const card = (ctx, lines, y, size, a, col) => L.title(ctx, lines.map(s => typeof s === 'string' ? { text: s, col } : s), y, size, { alpha: a });
  const fadeIO = (t, a, b, f = 0.25) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));

  // ---------- cameras ----------
  const WW = wall(WARD.x, WARD.y);                           // ward station on the wall, room coords
  const roomCam1 = [[0, [540, 1050, 1.15]], [1, [540, 1060, 1.17]], [2, [540, 1060, 1.17]], [5, [540, 1040, 1.3]], [6.1, [WW[0], WW[1], 3.4]]];
  const mapCamUp = [[6.1, [WARD.x, WARD.y, 3.4 * WM.s]], [6.5, [WARD.x, WARD.y, 3.4 * WM.s]], [9, [540, 960, 0.9]], [11, [560, 950, 0.93]]];
  const mapCamDown = [[11, [560, 950, 0.93]], [12.8, [WARD.x, WARD.y, 3.6 * WM.s]]];
  const roomCam2 = [[12.8, [WW[0], WW[1], 3.6]], [13.1, [WW[0], WW[1], 3.6]], [14.2, [470, 1330, 1.75]], [16.5, [470, 1320, 1.8]]];
  const roomCam3 = [[25.5, [600, 1250, 1.45]], [27, [620, 1380, 1.75]], [28.5, [622, 1388, 1.8]]];

  function mapLayer(ctx, t, h, keys, o = {}) { ctx.save(); L.camera(ctx, keys, t); drawMap(ctx, h, { ghost: 0.7, pulseT: t, ...o }); ctx.restore(); }
  function roomLayer(ctx, t, h, keys, o = {}) { ctx.save(); L.camera(ctx, keys, t); const hp = room(ctx, h, { pulseT: t, ...o }); ctx.restore(); return hp; }

  function panel(ctx, x, y, w, hh, h, mode, a) {
    ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = BG; ctx.fillRect(x, y, w, hh); ctx.strokeStyle = '#4a505a'; ctx.lineWidth = 4; ctx.strokeRect(x, y, w, hh);
    ctx.beginPath(); ctx.rect(x, y, w, hh); ctx.clip();
    const s = (hh - 30) / 1160; ctx.translate(x + 30 + 480 * s, y + hh / 2); ctx.scale(s, s); ctx.translate(-540, -960);
    drawMap(ctx, h, { mode, ghost: 0, labels: 0, bg: false });
    ctx.restore();
  }

  // ---------- draw ----------
  function draw(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    const h = hourAt(t);

    if (t < 6.1) {                                            // SC1-2 CLOSE (+ cold open and first rewind)
      const mood = t < 1 ? 'panic' : t < 3 ? 'calm' : h > WARD.rh - 0.5 ? 'panic' : 'calm';
      roomLayer(ctx, t, h, roomCam1, { mood, look: [0.2, -1], ghost: 0.75 });
      if (t >= 1 && t < 2) rewindFX(ctx, t, 1 - L.sm(1.8, 2, t) + (t < 1.1 ? L.sm(1, 1.1, t) - 1 : 0));
      hudClock(ctx, h, 1, t >= 1 && t < 2);
      card(ctx, ['The fix was', 'one stop away.'], 390, 100, t < 1.9 ? 1 - L.sm(1.7, 1.9, t) : 0);
      card(ctx, ['A ward. A city.', 'One line away.'], 420, 92, fadeIO(t, 2.4, 4.9));
      L.slate(ctx, t < 1 ? 'SC 1  CLOSE  eye level, hour 5' : t < 2 ? 'SC 1  REWIND to hour 0' : 'SC 2  CLOSE  push to wall map');
    } else if (t < 11) {                                      // SC3 CRANE UP through the wall map
      mapLayer(ctx, t, h, mapCamUp);
      if (t < 6.5) { ctx.save(); ctx.globalAlpha = 1 - L.sm(6.1, 6.5, t); roomLayer(ctx, t, h, [[0, [WW[0], WW[1], 3.4]]], { mood: 'panic', ghost: 0.75 }); ctx.restore(); }
      hudClock(ctx, h);
      card(ctx, ['Every stop,', 'the same week.'], 420, 92, fadeIO(t, 7.4, 9.1));
      card(ctx, ['The route runs', 'by hand.'], 420, 92, fadeIO(t, 9.2, 11.0));
      L.slate(ctx, t < 9 ? 'SC 3  CRANE UP  city map' : 'SC 3  WIDE  hold');
    } else if (t < 14) {                                      // SC4 DROP DOWN, closer
      if (t < 13.1) mapLayer(ctx, t, h, mapCamDown);
      if (t >= 12.8) { ctx.save(); ctx.globalAlpha = L.sm(12.8, 13.1, t); const lights = 1 - L.sm(13.3, 13.9, t);
        roomLayer(ctx, t, h, roomCam2, { mood: 'sad', look: [0.6, 0.2], lights, ghost: 0.6 * lights }); ctx.restore(); }
      hudClock(ctx, h);
      card(ctx, ['Her stop.', 'The fix came after.'], 420, 96, fadeIO(t, 11.4, 13.9));
      L.slate(ctx, 'SC 4  DROP DOWN  closer');
    } else if (t < 16.5) {                                    // SC5 the reveal line
      roomLayer(ctx, t, h, roomCam2, { mood: 'sad', look: [0.6, 0.2], lights: 0, ghost: 0 });
      ctx.fillStyle = 'rgba(8,9,12,0.35)'; ctx.fillRect(0, 0, 1080, 1920);
      card(ctx, ['We slowed it down', 'so you could see it.'], 560, 92, fadeIO(t, 14.1, 16.4));
      L.slate(ctx, 'SC 5  CLOSE  hold');
    } else if (t < 18.6) {                                    // SC6 REWIND the week, then freeze
      mapLayer(ctx, t, h, [[16.5, [540, 960, 0.92]], [18.6, [540, 960, 0.86]]], { ghost: 0 });
      rewindFX(ctx, t, t < 18 ? L.sm(16.5, 16.7, t) : 1 - L.sm(18, 18.15, t));
      if (t < 18) hudClock(ctx, h, 1, 1);
      card(ctx, ['Rewind.'], 460, 130, fadeIO(t, 16.6, 18.0));
      L.slate(ctx, t < 18 ? 'SC 6  WIDE  rewind the week' : 'SC 6  freeze');
    } else if (t < 25.5) {                                    // SC7 SNAP: true speed vs AI route (illustrative)
      const pa = L.sm(18.6, 18.8, t), sh = snapHour(t);
      ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
      panel(ctx, 70, 240, 940, 590, sh, 'real', pa);
      panel(ctx, 70, 880, 940, 590, sh, 'ai', pa);
      const lx = 700;
      outlined(ctx, 'real speed', lx, 330, 56, PAPER, { font: SERIF, a: pa });
      outlined(ctx, 'every stop routed', lx, 390, 44, '#b9bec8', { a: pa });
      outlined(ctx, '1 week', lx, 560, 120, PAPER, { font: SERIF, a: L.sm(22.7, 23.0, t) });
      outlined(ctx, 'frontier AI route', lx, 970, 52, GREEN, { font: SERIF, a: pa });
      outlined(ctx, 'every stop routed', lx, 1030, 44, '#b9bec8', { a: pa });
      outlined(ctx, '8 h', lx, 1200, 120, GREEN, { font: SERIF, a: L.sm(19.3, 19.6, t) });
      outlined(ctx, 'illustrative', lx, 1290, 52, PAPER, { a: pa });
      outlined(ctx, 'same red. same week. 1 s = 42 h', 540, 1540, 40, '#9aa0aa', { a: pa * 0.9 });
      L.slate(ctx, 'SC 7  SNAP  true speed, stacked');
    } else if (t < 28.5) {                                    // SC8 DOLLY IN: the line finds her, she decides
      const lt = t - 25.5, routeP = L.sm(0.2, 1.1, lt), reach = L.sm(0.9, 1.9, lt), pressed = L.sm(1.9, 2.05, lt);
      const start = [NX + 46 * NS * 0.36 + 30, NY - 60 * NS * 0.3 + 60 * NS * 0.05 + 190];
      const hand = [L.lerp(start[0], KEY[0], reach), L.lerp(start[1], KEY[1] - 26 + pressed * 6, reach)];
      roomLayer(ctx, t, 0, roomCam3, { mood: pressed > 0.5 ? 'soft' : 'resolve', look: [0.8, 0.3], screen: 'route', routeP, pressed, ghostHand: 0.8 * (1 - L.sm(1.7, 2.0, lt)), mapMode: 'ai', ghost: 0, hand, lights: 1 });
      outlined(ctx, 'illustrative', 540, 300, 48, PAPER, { a: L.sm(25.5, 25.8, t) });
      card(ctx, ['The line finds her.', { text: 'She decides.', col: GREEN }], 440, 92, fadeIO(t, 25.7, 28.5));
      L.slate(ctx, 'SC 8  DOLLY IN  closest');
    } else if (t < 31) {                                      // SC9
      ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
      card(ctx, ['This is', 'the bottleneck.'], 820, 124, fadeIO(t, 28.6, 31.0, 0.35));
      L.slate(ctx, 'SC 9  title');
    } else {
      L.endCard(ctx, L.sm(31, 31.5, t));
    }
    L.grain(ctx, t, { alpha: 0.05 });
  }

  const tKS = tOfHour(KS), tWard = tOfHour(WARD.rh);
  return { draw, DUR,
    acts: [{ start: 0, end: 14, bpm: 0, drone: true }, { start: 2, end: 11, bpm: 120 }, { start: 14, end: 18, bpm: 0, drone: true }, { start: 18.6, end: 25.5, bpm: 0, drone: true }, { start: 25.5, end: 36, bpm: 0, drone: true }],
    cues: [{ t: 1.0, type: 'whoosh' }, { t: 5.2, type: 'whoosh' }, { t: tWard, type: 'bonk' }, { t: tKS, type: 'pop' }, { t: 11.2, type: 'whoosh' }, { t: 16.5, type: 'whoosh' }, { t: 18.6, type: 'hit' }, { t: 27.45, type: 'ding' }, { t: 28.6, type: 'hit' }],
    _debug: { tKS, tWard, wardRed: WARD.rh, wardG: WARD.gh, wardAI: WARD.ga, saved: ST.filter(n => n.saved).length, N: ST.length } };
}
module.exports = makeScene;
