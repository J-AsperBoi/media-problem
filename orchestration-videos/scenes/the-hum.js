// the-hum: seamless-loop, particle/data, music, city. Analog: blackout-2003.
// One mapping: race t = 1..17 s, event hours h = (t - 1) * 0.125 (1 film second = 7.5 minutes).
// Cold open t 0..1 = h 0.85..0.975 of the same timeline; loop tail t 35.4..36 = h 0.775..0.85, so the last frame flows into frame 1.
// Red: only the verified first line trip (h 0.85) is drawn; the cascade is L.logistic fitted through extent 0.01 @ 1.87 and 0.99 @ 1.98
// (motion only, never timed on screen). Green: four listeners at fragment ready_at; six links at L.lognormalQuantile(q, 1.5, 1.83).
// Snap: ai_counterfactual 0.25 h vs human median 1.5 h, labeled illustrative, routed outcome uncertain ("?"). See output/the-hum/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('blackout-2003');
  const DUR = 36.0, RED = L.RED, GREEN = L.GREEN;
  const rgbaR = a => `rgba(255,59,48,${a})`, rgbaG = a => `rgba(52,210,123,${a})`;

  // ---------------- time mapping ----------------
  const HPS = 0.125, T0 = 1.0;
  const TRIP = A.threat.points.find(p => p.t === 0.85).t;            // verified (s6)
  const hAt = t => t < T0 ? TRIP + t * HPS : t >= 35.0 ? TRIP - (DUR - t) * HPS : Math.min(2.0, (t - T0) * HPS);
  const tOf = h => T0 + h / HPS;

  // ---------------- threat: logistic through the analog endpoints ----------------
  const C0 = 1.87, C1 = 1.98;
  const DOUBLING = (C1 - C0) * Math.LN2 / Math.log(9801);           // 0.0083 h
  const EN = L.logistic(C1 - C0, DOUBLING, 0.01);
  const extent = h => h < C0 ? 0 : Math.min(1, L.logistic(h - C0, DOUBLING, 0.01) / EN);
  const hOfExtent = e => { let lo = C0, hi = C1 + 0.02; for (let k = 0; k < 40; k++) { const m = (lo + hi) / 2; extent(m) >= e ? hi = m : lo = m; } return hi; };

  // ---------------- green ----------------
  const FR = {}; A.solution.fragments.forEach(f => FR[f.id] = f.ready_at);
  const AG = A.solution.aggregation, AI = A.ai_counterfactual.aggregation_median;

  // ---------------- 3D world ----------------
  const F = 1100;
  const LY = 119.2;                                                   // listener at a top-floor window
  const LIS = {
    L1: { p: [-0.7, LY, 153.5], ready: FR.f1, name: 'IT desk' },
    L2: { p: [-1150, 70, 2100], ready: FR.f2, name: 'operators' },
    L3: { p: [900, 120, 4300], ready: FR.f3, name: 'coordinator' },
    L4: { p: [-500, 40, 3500], ready: FR.f4, name: 'neighbors' },
  };
  const TP = [250, 2600];                                             // where the first line tripped (cascade origin)
  const WIRE = [[1.2, LY + 4.8, 158], [15, 60, 330], [60, 52, 900], [150, 52, 1700], [TP[0], 52, TP[1]], [380, 52, 3600]];

  const rng = L.rng(2003);
  const P = [];                                                       // particles = household lights
  // the listener's own tower
  for (let y = 6; y < LY - 3; y += 7) for (let c = 0; c < 3; c++) P.push({ X: -6 + c * 5, Y: y, Z: 158 + rng() * 4 });
  for (let b = 0; b < 1100 && P.length < 8000; b++) {
    const X = (rng() - 0.5) * 5400, Z = 260 + Math.pow(rng(), 0.85) * 5900;
    if (Math.abs(X) < 120 && Z < 700) continue;
    const central = Math.exp(-((X / 1600) ** 2) - (((Z - 3000) / 1800) ** 2));
    const H = 10 + Math.pow(rng(), 2.2) * 90 + central * rng() * 170;
    const cols = 1 + Math.floor(rng() * 3), dx = rng() * 2 - 1;
    for (let y = 5; y < H; y += 7) for (let c = 0; c < cols; c++) if (rng() < 0.82) P.push({ X: X + c * 7 * (1 + dx * 0.2), Y: y, Z: Z + c * 3 * dx });
  }
  // outage rank: distance from the trip + seeded jitter, then made uniform
  const maxD = Math.max(...P.map(p => Math.hypot(p.X - TP[0], p.Z - TP[1])));
  P.forEach(p => { p.key = Math.hypot(p.X - TP[0], p.Z - TP[1]) / maxD * 0.85 + rng() * 0.15; p.b = 0.55 + rng() * 0.45; });
  const ord = P.slice().sort((a, b) => a.key - b.key); ord.forEach((p, i) => { p.rank = (i + 0.5) / P.length; p.hDark = hOfExtent(p.rank); });
  const listenerRank = id => { const q = LIS[id].p; const d = Math.hypot(q[0] - TP[0], q[2] - TP[1]) / maxD * 0.85 + 0.07; return hOfExtent(Math.min(0.99, d)); };
  Object.keys(LIS).forEach(id => LIS[id].hDark = listenerRank(id));

  // the note: standing wave. Symbol of synchrony; its frequency is not a data value.
  const K = 2 * Math.PI / 2400, W = 2 * Math.PI / 1.15;
  const wave = (X, t) => Math.sin(K * (X + 2700)) * Math.sin(W * t);
  const STR_Y = 430, STR_Z = 3300;
  const sRank = X => Math.min(1, Math.abs(X - TP[0]) / 2900) * 0.97 + 0.015;   // string goes dark outward from the trip

  // links between listeners: human speed (lognormal quantiles)
  const PAIRS = [['L1', 'L2'], ['L4', 'L2'], ['L1', 'L3'], ['L2', 'L3'], ['L4', 'L1'], ['L3', 'L4']];
  const LINKS = PAIRS.map((p, i) => ({ a: p[0], b: p[1], h: L.lognormalQuantile((i + 0.5) / PAIRS.length, AG.median, AG.p90) }));
  LINKS.forEach(l => l.t = tOf(l.h));
  const GROW = 0.35, HOLD = 0.9, DROP = 0.6;

  // ---------------- camera ----------------
  // cam = [x, log(height), z, pitch]
  const C_CLOSE = [0.15, Math.log(120.5), 149.6, -0.26];
  const C_WIDE = [0, Math.log(1500), -900, -0.42];
  const C_WIDE2 = [0, Math.log(1350), -650, -0.42];
  const C_CLOSER = [-0.2, Math.log(120.1), 150.9, -0.2];
  const C_CLOSEST = [-0.3, Math.log(120.1), 150.6, -0.2];
  const CAM = [[0, C_CLOSE], [1.0, C_CLOSE], [4.2, [0.2, Math.log(120.7), 149.2, -0.26]], [7.6, C_WIDE], [16.9, C_WIDE2], [19.3, C_CLOSER], [21.9, [-0.22, Math.log(120.1), 151.1, -0.2]]];
  const camAt = t => {
    if (t < T0 || t >= 35.0) return C_CLOSE;
    if (t >= 29.2) return L.key([[29.2, C_CLOSEST], [31.6, [-0.33, Math.log(120.05), 151.1, -0.18]]], t);
    return L.key(CAM, t);
  };
  function mkProj(c) {
    const [cx, ly, cz, p] = c, cy = Math.exp(ly), sp = Math.sin(p), cp = Math.cos(p);
    return (X, Y, Z) => { const dx = X - cx, dy = Y - cy, dz = Z - cz; const zc = dy * sp + dz * cp; if (zc < 0.2) return null; const yc = dy * cp - dz * sp;
      return [540 + F * dx / zc, 960 - F * yc / zc, zc]; };
  }

  // ---------------- helpers ----------------
  const fade = (t, a, b, f = 0.3) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));
  function glow(ctx, x, y, r, rgb, a) { if (a <= 0.005 || r <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); }
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function card(ctx, lines, y, size, a, col) { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center';
    let yy = y; lines.forEach((l, i) => { const o = typeof l === 'string' ? { text: l } : l; let fz = o.size || size; ctx.font = `${fz}px "${SERIF}"`;
      while (ctx.measureText(o.text).width > 800 && fz > 30) { fz -= 4; ctx.font = `${fz}px "${SERIF}"`; }
      if (i) yy += fz * 1.06; ctx.lineJoin = 'round'; ctx.lineWidth = fz * 0.14; ctx.strokeStyle = 'rgba(8,10,14,0.95)'; ctx.strokeText(o.text, 490, yy);
      ctx.fillStyle = o.col || col || '#f4f1ea'; ctx.fillText(o.text, 490, yy); }); ctx.restore(); }
  function slate(ctx, s) { ctx.save(); ctx.fillStyle = 'rgba(8,11,16,0.6)'; ctx.fillRect(40, 1818, 640, 58); ctx.restore(); L.slate(ctx, s); }

  // bean character (after scenes/example_follow_the_green.js), with an ear for the wrong note
  function bean(ctx, x, y, s, { col = '#d9d4ca', mood = 'flat', look = [0, 0], ear = 0, t = 0 } = {}) {
    const bw = 46 * s, bh = 60 * s; ctx.save(); ctx.lineCap = 'round';
    ctx.strokeStyle = col; ctx.lineWidth = 7 * s;
    [-1, 1].forEach(sd => { const ax = x + sd * bw * 0.42, ay = y + bh * 0.05; const ang = Math.PI / 2 + sd * 0.9;
      ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(ax + Math.cos(ang) * bw * 0.45, ay + Math.sin(ang) * bw * 0.45); ctx.stroke(); });
    ctx.fillStyle = col; rr(ctx, x - bw / 2, y - bh / 2, bw, bh, bw / 2); ctx.fill();
    // ear (right side)
    const exx = x + bw * 0.5, eyy = y - bh * 0.1;
    ctx.beginPath(); ctx.ellipse(exx, eyy, bw * 0.09, bw * 0.14, 0, 0, 7); ctx.fill(); ctx.strokeStyle = '#8e8a82'; ctx.lineWidth = 2 * s; ctx.beginPath(); ctx.arc(exx - bw * 0.01, eyy, bw * 0.06, -1.2, 1.2); ctx.stroke();
    const ey = y - bh * 0.14, er = bw * (mood === 'panic' ? 0.17 : 0.14);
    [-1, 1].forEach(sd => { const ex = x + sd * bw * 0.19;
      ctx.fillStyle = '#fffdf7'; ctx.beginPath(); ctx.arc(ex, ey, er, 0, 7); ctx.fill(); ctx.strokeStyle = '#1b1f27'; ctx.lineWidth = 1.6 * s; ctx.stroke();
      ctx.fillStyle = '#1b1f27'; ctx.beginPath(); ctx.arc(ex + look[0] * er * 0.45, ey + look[1] * er * 0.45, er * (mood === 'panic' ? 0.36 : 0.5), 0, 7); ctx.fill();
      if (mood === 'flat' || mood === 'sad') { ctx.fillStyle = col; ctx.fillRect(ex - er * 1.15, ey - er * 1.15, er * 2.3, er * (mood === 'sad' ? 0.95 : 0.7)); }
      if (mood === 'sad') { ctx.strokeStyle = '#1b1f27'; ctx.lineWidth = 2.6 * s; ctx.beginPath(); ctx.moveTo(ex - er, ey - er * 0.2 - sd * er * 0.35); ctx.lineTo(ex + er, ey - er * 0.2 + sd * er * 0.35); ctx.stroke(); }
      if (mood === 'panic') { ctx.strokeStyle = '#1b1f27'; ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.moveTo(ex - er, ey - er * 1.6 + sd * er * 0.3); ctx.lineTo(ex + er, ey - er * 1.6 - sd * er * 0.3); ctx.stroke(); } });
    const my = y + bh * 0.15; ctx.strokeStyle = '#1b1f27'; ctx.fillStyle = '#1b1f27'; ctx.lineWidth = 3 * s; ctx.beginPath();
    if (mood === 'panic') { ctx.ellipse(x, my + bh * 0.03, bw * 0.08, bw * 0.11, 0, 0, 7); ctx.fill(); }
    else if (mood === 'sad') { ctx.arc(x, my + bw * 0.1, bw * 0.12, 1.2 * Math.PI, 1.8 * Math.PI); ctx.stroke(); }
    else { ctx.moveTo(x - bw * 0.1, my); ctx.lineTo(x + bw * 0.1, my); ctx.stroke(); }
    ctx.restore();
    // the wrong note, heard: a green glint in the ear
    if (ear > 0) { const pulse = 0.8 + 0.2 * Math.sin(t * 5);
      glow(ctx, exx, eyy, bw * 0.75, '52,210,123', 0.55 * ear * pulse);
      ctx.save(); ctx.globalAlpha = ear; ctx.fillStyle = GREEN; ctx.beginPath(); const r = bw * 0.1 * pulse;
      ctx.moveTo(exx, eyy - r * 1.8); ctx.lineTo(exx + r * 0.6, eyy); ctx.lineTo(exx, eyy + r * 1.8); ctx.lineTo(exx - r * 0.6, eyy); ctx.closePath(); ctx.fill();
      ctx.strokeStyle = rgbaG(0.8); ctx.lineWidth = 2.5 * s; [1, 1.7].forEach(k => { ctx.beginPath(); ctx.arc(exx, eyy, bw * 0.18 * k, -0.8, 0.8); ctx.stroke(); }); ctx.restore(); }
  }

  // ---------------- the world ----------------
  // o: {h, t (for motion), routed (bool: SC6 illustrative link), labels alpha}
  function world(ctx, t, o) {
    const cam = camAt(t), pr = mkProj(cam), h = o.h, ext = extent(h);
    const pitch = cam[3], hy = 960 + F * Math.tan(pitch);
    // sky and ground
    const g = ctx.createLinearGradient(0, 0, 0, hy); g.addColorStop(0, '#07090d'); g.addColorStop(1, '#161b23'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, Math.max(0, hy));
    ctx.fillStyle = '#090b0f'; ctx.fillRect(0, hy, 1080, 1920 - hy);
    // city haze (attention): warm while singing, gone where dark
    // particles
    const aliveAmp = 14;
    for (let i = 0; i < P.length; i++) { const p = P[i]; const dark = h >= p.hDark;
      const y = p.Y + (dark ? 0 : aliveAmp * wave(p.X, t) * (0.4 + 0.6 * Math.min(1, p.Y / 60)));
      const q = pr(p.X, y, p.Z); if (!q) continue; const [x, yy, zc] = q; if (x < -20 || x > 1100 || yy < -20 || yy > 1940) continue;
      const sz = L.clamp(F * 3.6 / zc, 2.2, 12);
      if (dark) { const since = (h - p.hDark) / HPS;                    // film seconds since it went out
        if (since < 0.45) { ctx.fillStyle = rgbaR(1 - since / 0.45); ctx.fillRect(x - sz, yy - sz, sz * 2, sz * 2); }
        else { ctx.fillStyle = '#20242b'; ctx.fillRect(x - sz * 0.4, yy - sz * 0.4, sz * 0.8, sz * 0.8); } }
      else { const v = Math.round(150 + 90 * p.b); ctx.fillStyle = `rgb(${v},${v - 8},${v - 30})`; ctx.fillRect(x - sz / 2, yy - sz / 2, sz, sz); }
    }
    // the note: a standing wave strung over the city
    const pts = []; for (let k = 0; k <= 140; k++) { const X = -2700 + k * 5400 / 140; const dead = ext > sRank(X);
      let d = dead ? 0 : 110 * wave(X, t); let wrong = 0;
      if (h >= TRIP && !dead) { const near = Math.exp(-(((X - TP[0]) / 420) ** 2)); wrong = near; d += near * 60 * Math.sin(X / 70 + t * 23) * (0.6 + 0.4 * L.noise(t * 9, 4)); }
      const q = pr(X, STR_Y + d, STR_Z); pts.push(q ? [...q, dead, wrong] : null); }
    const strokeRun = (filter, style, lw) => { ctx.strokeStyle = style; ctx.lineWidth = lw; ctx.beginPath(); let on = false;
      pts.forEach((q, k) => { if (!q || !filter(q)) { on = false; return; } if (!on) { ctx.moveTo(q[0], q[1]); on = true; } else ctx.lineTo(q[0], q[1]); }); ctx.stroke(); };
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    const sw = pts[70] ? L.clamp(F * 5 / pts[70][2], 2, 6) : 3;
    strokeRun(q => !q[3], 'rgba(230,226,214,0.12)', sw * 5);
    strokeRun(q => !q[3], 'rgba(236,232,220,0.85)', sw);
    strokeRun(q => q[3], 'rgba(60,64,72,0.9)', sw * 0.8);
    strokeRun(q => !q[3] && q[4] > 0.25, rgbaR(0.28), sw * 6);
    strokeRun(q => !q[3] && q[4] > 0.25, RED, sw * 1.3);
    ctx.restore();

    // the wire (one transmission line) and its towers
    const wpts = []; for (let s = 0; s < WIRE.length - 1; s++) { const a = WIRE[s], b = WIRE[s + 1], span = Math.hypot(b[0] - a[0], b[2] - a[2]);
      for (let k = 0; k < 16; k++) { const f = k / 16; wpts.push([L.lerp(a[0], b[0], f), L.lerp(a[1], b[1], f) - span * 0.035 * 4 * f * (1 - f), L.lerp(a[2], b[2], f)]); } }
    wpts.push(WIRE[WIRE.length - 1]);
    WIRE.slice(1).forEach(w => { const a = pr(w[0], 0, w[2]), b = pr(w[0], w[1] + 4, w[2]); if (a && b) { ctx.strokeStyle = 'rgba(120,126,136,0.7)'; ctx.lineWidth = L.clamp(F * 1.2 / b[2], 1, 6); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(b[0] - F * 8 / b[2], b[1] + F * 4 / b[2]); ctx.lineTo(b[0] + F * 8 / b[2], b[1] + F * 4 / b[2]); ctx.stroke(); } });
    const tripped = h >= TRIP, flick = tripped ? 0.7 + 0.3 * L.noise(t * 14, 2) : 0;
    ctx.save(); ctx.lineCap = 'round';
    for (let k = 0; k < wpts.length - 1; k++) { const a = pr(...wpts[k]), b = pr(...wpts[k + 1]); if (!a || !b) continue; const lw = L.clamp(F * 0.16 / Math.min(a[2], b[2]), 2, 26);
      if (tripped) { ctx.strokeStyle = rgbaR(0.3 * flick); ctx.lineWidth = lw * 4 + 8; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
      ctx.strokeStyle = tripped ? rgbaR(flick) : 'rgba(150,155,164,0.85)'; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); }
    ctx.restore();
    if (tripped) { const q = pr(TP[0], 52, TP[1]); if (q) glow(ctx, q[0], q[1], L.clamp(F * 420 / q[2], 160, 320), '255,59,48', 0.45 * flick); }

    // links between listeners (human speed)
    const arc = (a, b, f) => { const pa = LIS[a].p, pb = LIS[b].p, m = [(pa[0] + pb[0]) / 2, Math.max(pa[1], pb[1]) + Math.hypot(pa[0] - pb[0], pa[2] - pb[2]) * 0.28, (pa[2] + pb[2]) / 2];
      return [0, 1, 2].map(i => (1 - f) * (1 - f) * pa[i] + 2 * f * (1 - f) * m[i] + f * f * pb[i]); };
    if (!o.routed) LINKS.forEach(l => { const dt = t - l.t; if (t >= 17 || dt < 0 || dt > GROW + HOLD + DROP) return;
      ctx.save(); ctx.lineCap = 'round';
      const path = (s0, s1, sag) => { ctx.beginPath(); let on = false; for (let k = 0; k <= 30; k++) { const f = L.lerp(s0, s1, k / 30); const w = arc(l.a, l.b, f); const q = pr(w[0], w[1] - (sag ? sag(f) : 0), w[2]); if (!q) continue; on ? ctx.lineTo(q[0], q[1]) : (ctx.moveTo(q[0], q[1]), on = true); } };
      if (dt < GROW) { path(0, L.ease.out(dt / GROW)); ctx.setLineDash([12, 10]); ctx.strokeStyle = rgbaG(0.85); ctx.lineWidth = 3; ctx.stroke(); }
      else if (dt < GROW + HOLD) { path(0, 1); ctx.strokeStyle = rgbaG(0.25); ctx.lineWidth = 14; ctx.stroke(); ctx.strokeStyle = GREEN; ctx.lineWidth = 4; ctx.stroke(); }
      else { const f = (dt - GROW - HOLD) / DROP; ctx.globalAlpha = 1 - f; ctx.strokeStyle = '#8a939d'; ctx.lineWidth = 3;
        path(0, 0.45, ff => f * 500 * ff / 0.45); ctx.stroke(); path(0.55, 1, ff => f * 500 * (1 - ff) / 0.45); ctx.stroke(); }
      ctx.restore(); });

    // the other three listeners: brighter lights with a listening ring
    ['L2', 'L3', 'L4'].forEach(id => { const Ls = LIS[id]; const q = pr(...Ls.p); if (!q) return; const heard = h >= Ls.ready, dark = h >= Ls.hDark;
      const r = L.clamp(F * 26 / q[2], 5, 40);
      if (dark) { ctx.fillStyle = '#2a2e35'; ctx.beginPath(); ctx.arc(q[0], q[1], r * 0.35, 0, 7); ctx.fill(); return; }
      if (heard) glow(ctx, q[0], q[1], r * 4, '52,210,123', 0.45 + 0.15 * Math.sin(t * 5 + q[0]));
      ctx.fillStyle = heard ? GREEN : '#e6e1d4'; ctx.beginPath(); ctx.arc(q[0], q[1], r * 0.45, 0, 7); ctx.fill();
      ctx.strokeStyle = heard ? rgbaG(0.9) : 'rgba(200,200,196,0.5)'; ctx.lineWidth = 2.5; [1, 1.6].forEach(k => { ctx.beginPath(); ctx.arc(q[0], q[1], r * k, -0.9, 0.9); ctx.stroke(); ctx.beginPath(); ctx.arc(q[0], q[1], r * k, Math.PI - 0.9, Math.PI + 0.9); ctx.stroke(); });
      if (o.labels > 0) L.label(ctx, Ls.name, q[0], q[1] + r * 1.6 + 36, 36, { col: heard ? '#bfe9cf' : '#aab2bc', alpha: o.labels }); });

    // the listener at the window (billboard at depth)
    const Lp = LIS.L1.p, qb = pr(...Lp);
    if (qb) { const u = F / qb[2];                                    // px per metre at the listener
      const wx0 = qb[0] - 0.8 * u, wx1 = qb[0] + 0.95 * u, wy0 = qb[1] - 0.95 * u, wy1 = qb[1] + 1.0 * u;
      if (u > 3) {
        ctx.fillStyle = '#12151a'; ctx.fillRect(wx0 - 0.3 * u, wy0 - 0.3 * u, (wx1 - wx0) + 0.6 * u, 2400);   // her building, down to the street
        for (let k = 1; k < 6; k++) { const yy = wy0 + k * 2.8 * u; if (yy > 1960) break; const lit = !(h >= LIS.L1.hDark && !o.routed) && k !== 3; ctx.fillStyle = lit ? '#3a3730' : '#191b20'; ctx.fillRect(wx0, yy, wx1 - wx0, wy1 - wy0); ctx.strokeStyle = '#07080a'; ctx.lineWidth = Math.max(2, 0.09 * u); ctx.strokeRect(wx0, yy, wx1 - wx0, wy1 - wy0); }
        const cityDark = h >= 1.98 && !o.routed;
        const wg = ctx.createLinearGradient(0, wy0, 0, wy1); wg.addColorStop(0, cityDark ? '#15171b' : '#3a3730'); wg.addColorStop(1, cityDark ? '#0f1114' : '#2a2824'); ctx.fillStyle = wg; ctx.fillRect(wx0, wy0, wx1 - wx0, wy1 - wy0);
        ctx.strokeStyle = '#07080a'; ctx.lineWidth = Math.max(2, 0.09 * u); ctx.strokeRect(wx0, wy0, wx1 - wx0, wy1 - wy0);
        const mood = o.routed ? 'flat' : h >= 1.98 ? 'sad' : h >= TRIP ? 'panic' : 'flat';
        const look = o.routed ? [1, -0.3] : h >= 1.98 ? [0.5, 0.4] : h >= TRIP ? [0.9, -0.8] : h >= LIS.L1.ready ? [0.2, -0.9] : [0.9, -0.2];
        const ear = o.routed ? 1 : L.clamp((h - LIS.L1.ready) / 0.03, 0, 1);
        if (h >= TRIP && !o.routed) glow(ctx, qb[0] + 0.8 * u, qb[1] - 0.6 * u, 2.2 * u, '255,59,48', 0.16 * flick);
        bean(ctx, qb[0], qb[1] + 0.1 * u, u / 60 * 1.2, { col: cityDark ? '#a9a49b' : '#d9d4ca', mood, look, ear, t });
        ctx.fillStyle = '#1d2026'; ctx.fillRect(wx0 - 0.15 * u, wy1 - 0.12 * u, (wx1 - wx0) + 0.3 * u, 0.24 * u);            // sill
      } else {
        const heard = h >= LIS.L1.ready; if (heard) glow(ctx, qb[0], qb[1], 60, '52,210,123', 0.5);
        ctx.fillStyle = heard ? GREEN : '#e6e1d4'; ctx.beginPath(); ctx.arc(qb[0], qb[1], 9, 0, 7); ctx.fill();
        ctx.strokeStyle = heard ? rgbaG(0.9) : 'rgba(200,200,196,0.5)'; ctx.lineWidth = 2.5; [22, 36].forEach(r => { ctx.beginPath(); ctx.arc(qb[0], qb[1], r, -0.9, 0.9); ctx.stroke(); ctx.beginPath(); ctx.arc(qb[0], qb[1], r, Math.PI - 0.9, Math.PI + 0.9); ctx.stroke(); });
        if (o.labels > 0) L.label(ctx, 'IT desk', qb[0] + 60, qb[1] + 12, 36, { col: '#bfe9cf', alpha: o.labels, align: 'left' });
      }
    }
    // SC6 (illustrative): the routed link from her ear out over the city, holding
    if (o.routed && qb) { const u = F / qb[2]; const ex = qb[0] + 46 * u / 60 * 1.2 * 0.5, ey = qb[1] + 0.1 * u - 60 * u / 60 * 1.2 * 0.1;
      const tq = pr(...LIS.L3.p) || [760, 700], target = [Math.min(tq[0], 860), tq[1]]; const f = o.routed;
      ctx.save(); ctx.lineCap = 'round'; ctx.beginPath(); for (let k = 0; k <= 30; k++) { const s = k / 30 * f; const x = L.lerp(ex, target[0], s), y = L.lerp(ey, target[1], s) - Math.sin(s * Math.PI) * 160; k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
      ctx.strokeStyle = rgbaG(0.25); ctx.lineWidth = 18; ctx.stroke(); ctx.strokeStyle = GREEN; ctx.lineWidth = 5; ctx.stroke();
      if (f > 0.97) { glow(ctx, target[0], target[1], 70, '52,210,123', 0.7); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(target[0], target[1], 11, 0, 7); ctx.fill(); }
      ctx.restore(); }
  }

  // ---------------- snap panels ----------------
  const SNAP0 = 21.9, SW1 = [22.6, 24.6], SW2 = [25.4, 27.4], SNAP1 = 29.2;
  const AX0 = 130, AX1 = 930, hx = h => AX0 + (AX1 - AX0) * h / 2;
  function panel(ctx, t, y0, sweep, ai) {
    const head = L.clamp((t - sweep[0]) / (sweep[1] - sweep[0]), 0, 1) * 2;
    ctx.save(); ctx.fillStyle = '#141920'; rr(ctx, 70, y0, 940, 430, 18); ctx.fill(); ctx.strokeStyle = '#2c3440'; ctx.lineWidth = 3; ctx.stroke();
    ctx.font = `62px "${SERIF}"`; ctx.fillStyle = '#f4f1ea'; ctx.textAlign = 'left'; ctx.fillText(ai ? 'Routed' : 'As it happened', 110, y0 + 80);
    if (ai) L.label(ctx, 'illustrative', 320, y0 + 78, 48, { col: '#c8ced6', align: 'left' });
    const ay = y0 + 230;
    // the note as a string along the timeline: vibrating while alive
    ctx.lineCap = 'round';
    const cas = ai ? 0 : L.clamp((head - C0) / (C1 - C0), 0, 1);
    ctx.beginPath(); for (let k = 0; k <= 160; k++) { const hh = k / 160 * head; const x = hx(hh); const alive = ai ? 1 : hh < C0 ? 1 : 0;
      const y = ay + alive * 22 * Math.sin(k * 0.3) * Math.sin(W * t) * (hh >= TRIP && hh < C0 && !ai ? 1.25 : 1); k ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.strokeStyle = '#d7dce2'; ctx.lineWidth = 4; ctx.stroke();
    // window band (about one hour)
    ctx.fillStyle = rgbaR(0.12); ctx.fillRect(hx(TRIP), ay - 70, hx(C0) - hx(TRIP), 140); ctx.strokeStyle = rgbaR(0.6); ctx.lineWidth = 2; ctx.strokeRect(hx(TRIP), ay - 70, hx(C0) - hx(TRIP), 140);
    if (head >= TRIP) { ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(hx(TRIP), ay, 12, 0, 7); ctx.fill(); L.label(ctx, 'the window', (hx(TRIP) + hx(C0)) / 2, ay - 84, 44, { col: '#ff8a80' }); }
    if (head >= C0) {
      if (ai) { ctx.setLineDash([10, 9]); ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.strokeRect(hx(C0), ay - 80, hx(C1) - hx(C0) + 22, 160); ctx.setLineDash([]);
        ctx.font = `76px "${SERIF}"`; ctx.fillStyle = RED; ctx.textAlign = 'center'; ctx.fillText('?', hx(C0) + 17, ay - 96); }
      else { ctx.fillStyle = RED; ctx.fillRect(hx(C0), ay - 80, (hx(C1) - hx(C0) + 22) * cas, 160); } }
    const gh = ai ? AI : AG.median;
    if (head >= gh) { const x = hx(gh); glow(ctx, x, ay, 80, '52,210,123', 0.55); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(x, ay, 17, 0, 7); ctx.fill();
      if (ai) { ctx.strokeStyle = rgbaG(0.6); ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(x, ay); ctx.lineTo(hx(Math.min(head, C0)), ay); ctx.stroke(); }
      ctx.strokeStyle = GREEN; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, ay + 20); ctx.lineTo(x, ay + 100); ctx.stroke();
      L.label(ctx, ai ? 'the note, routed' : 'they found each other', ai ? x - 12 : Math.min(x + 30, 900), ay + 150, 46, { col: GREEN, align: ai ? 'left' : 'right' }); }
    if (head < 2) { ctx.fillStyle = '#fffdf7'; ctx.beginPath(); ctx.arc(hx(head), ay, 10, 0, 7); ctx.fill(); }
    ctx.restore();
  }
  function snap(ctx, t) {
    ctx.fillStyle = '#0c1016'; ctx.fillRect(0, 0, 1080, 1920);
    card(ctx, ['Same notes. Same hour.'], 330, 84, fade(t, 22.1, 25.2));
    panel(ctx, t, 440, SW1, false);
    if (t >= 25.1) { ctx.save(); ctx.globalAlpha = L.sm(25.1, 25.4, t); panel(ctx, t, 940, SW2, true); ctx.restore(); }
    card(ctx, ['Same clock, sped up.'], 330, 84, fade(t, 25.3, 27.5));
    card(ctx, ['People still decide.'], 330, 84, fade(t, 27.6, SNAP1 + 0.2));
    card(ctx, ['Outcome uncertain.'], 1470, 60, fade(t, 27.6, SNAP1 + 0.2), '#c8ced6');
  }

  // ---------------- draw ----------------
  function draw(ctx, t) {
    ctx.fillStyle = '#090b0f'; ctx.fillRect(0, 0, 1080, 1920);
    if (t < T0 || t >= 35.0) {
      // cold open / loop tail: the same close frame, one lap later
      const tw = t < T0 ? t : t - DUR;                                 // continuous motion across the loop join
      world(ctx, tw, { h: hAt(t), labels: 0 });
      card(ctx, ['One wrong note.'], 330, 96, t < T0 ? 1 - L.sm(0.8, 1.0, t) : L.sm(35.5, 35.8, t));
      L.label(ctx, 'later', 130, 440, 46, { col: '#ff8a80', align: 'left', alpha: t < T0 ? 1 - L.sm(0.8, 1.0, t) : L.sm(35.5, 35.8, t) });
      slate(ctx, 'SC0  CLOSE  EYE LEVEL');
      if (t >= 35.0) L.endCard(ctx, 1 - L.sm(35.0, 35.4, t), { line: 'The bottleneck is us.' });
    } else if (t < SNAP0) {
      const labels = fade(t, 7.3, 16.95, 0.4);
      world(ctx, t, { h: hAt(t), labels });
      card(ctx, ['A whole city,', 'singing one note.'], 300, 88, fade(t, 1.15, 4.1));
      card(ctx, ['Someone heard it slip.'], 300, 84, fade(t, 4.3, 7.4));
      card(ctx, ['Four heard a wrong note.'], 300, 84, fade(t, 7.9, 10.3));
      card(ctx, ['No one to tell.'], 300, 88, fade(t, 10.5, 12.9));
      card(ctx, ['The window: one hour.'], 300, 84, fade(t, 13.1, 15.8));
      card(ctx, ['50 million people.', 'In minutes.'], 300, 88, fade(t, 17.0, 19.3));
      card(ctx, ['We slowed it down', 'so you could see it.'], 300, 84, fade(t, 19.4, 21.9, 0.35));
      slate(ctx, t < 4.2 ? 'SC1  CLOSE  EYE LEVEL' : t < 7.6 ? 'SC2  CRANE UP' : t < 16.9 ? 'SC3  HIGH WIDE  1 s = 7.5 min' : t < 19.3 ? 'SC4  DROP DOWN  CLOSER' : 'SC4  HOLD  (dead stop)');
      if (t > SNAP0 - 0.3) { ctx.fillStyle = `rgba(12,16,22,${L.sm(SNAP0 - 0.3, SNAP0, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
    } else if (t < SNAP1) {
      snap(ctx, t); slate(ctx, 'SC5  INSERT  TWO TIMELINES');
      if (t > SNAP1 - 0.3) { ctx.fillStyle = `rgba(12,16,22,${L.sm(SNAP1 - 0.3, SNAP1, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
    } else {
      world(ctx, t, { h: AI, labels: 0, routed: L.ease.out(L.sm(29.5, 30.6, t)) });
      if (t < SNAP1 + 0.3) { ctx.fillStyle = `rgba(12,16,22,${1 - L.sm(SNAP1, SNAP1 + 0.3, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
      card(ctx, ['illustrative'], 1480, 60, fade(t, SNAP1 + 0.2, 31.8), '#c8ced6');
      card(ctx, ['This is the bottleneck.'], 300, 92, fade(t, 29.9, 31.8, 0.35));
      slate(ctx, 'SC6  CLOSEST  (illustrative)');
      if (t >= 31.6) L.endCard(ctx, L.sm(31.6, 31.9, t), { line: 'The bottleneck is us.' });
    }
    L.grain(ctx, t, { alpha: 0.035, n: 400 });
  }

  const cascadeT = tOf(C0);
  return {
    draw, DUR,
    acts: [{ start: 0, end: cascadeT - 0.3, bpm: 0, drone: true }, { start: 7.8, end: cascadeT - 0.3, bpm: 50 }, { start: 29.2, end: 36, bpm: 0, drone: true }],
    cues: [{ t: 1.0, type: 'hit' }, { t: tOf(LIS.L1.ready), type: 'ding' }, { t: 4.3, type: 'whoosh' }, { t: tOf(TRIP), type: 'bonk' },
      ...LINKS.map(l => ({ t: l.t + GROW, type: 'pop' })),
      { t: cascadeT, type: 'hit' }, { t: 16.95, type: 'whoosh' }, { t: 22.2, type: 'hit' }, { t: SW2[0] + (SW2[1] - SW2[0]) * AI / 2, type: 'ding' }, { t: 30.0, type: 'ding' }, { t: 31.6, type: 'stamp' }]
  };
}
if (typeof module !== 'undefined') module.exports = makeScene;
