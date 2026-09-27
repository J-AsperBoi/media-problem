// the-numb-hand: reverse-chronology, bean cartoon, body/biology. Analog: blackout-2003.
// The body is a metaphor for the grid (clearly metaphorical; every time comes from the analog, none from neuroscience).
// One mapping: rewind runs 1 film s = 15 min (0.25 h/s) backward, h 2.0 @ t4.5 -> 0.85 @ t9.1, freeze 1.2 s, -> 0 @ t13.7.
// Red: verified first trip h 0.85 only; cascade = L.logistic fitted through 0.01 @ 1.87 and 0.99 @ 1.98 (motion only).
// Green: fragment ready_at from the analog; links at L.lognormalQuantile(q, 1.5, 1.83). Snap: AI 0.25 h vs 1.5 h, illustrative.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('blackout-2003');
  const DUR = 35, RED = L.RED, GREEN = L.GREEN;
  const BG = '#11151c', SKIN = '#d9d4ca', INK = '#1b1f27';

  // ---------- time mapping ----------
  const HPS = 0.25, R0 = 4.5, FZ0 = 9.1, FZ1 = 10.3, T0F = 13.7;
  const hAt = t => t < R0 ? 2.0 : t < FZ0 ? 2.0 - (t - R0) * HPS : t < FZ1 ? 0.85 : Math.max(0, 0.85 - (t - FZ1) * HPS);
  const tOfRewind = h => h >= 0.85 ? R0 + (2.0 - h) / HPS : FZ1 + (0.85 - h) / HPS;

  // ---------- threat ----------
  const TRIP = A.threat.points.find(p => p.t === 0.85).t;
  const C0 = 1.87, C1 = 1.98;
  const DOUBLING = (C1 - C0) * Math.LN2 / Math.log(9801);
  const extent = h => h < C0 ? 0 : Math.min(1, L.logistic(h - C0, DOUBLING, 0.01) / L.logistic(C1 - C0, DOUBLING, 0.01));

  // ---------- green ----------
  const FR = {}; A.solution.fragments.forEach(f => FR[f.id] = f.ready_at);
  const AG = A.solution.aggregation, AI = A.ai_counterfactual.aggregation_median;
  const PAIRS = [['f4', 'R'], ['f1', 'R'], ['f1', 'f4'], ['f2', 'R'], ['f2', 'f4'], ['f3', 'R']];
  const LINKS = PAIRS.map((p, i) => ({ a: p[0], b: p[1], h: L.lognormalQuantile((i + 0.5) / PAIRS.length, AG.median, AG.p90) }));
  const GROW = 0.05, HOLDH = 0.12, DROP = 0.05;

  // ---------- body world (zoom 1 = full frame) ----------
  const BX = 360, BY = 1010, BS = 5.5;
  const H = [830, 1372];                        // hand centre (on the burner)
  const SH = [468, 1045], WR = [765, 1342], EL = [618, 1195];
  const PHONE = [192, 905];
  // nerve paths (world) from the hand up the arm; offsets keep them parallel inside the arm
  const armPath = off => { const dx = WR[0] - SH[0], dy = WR[1] - SH[1], n = Math.hypot(dx, dy), px = -dy / n * off, py = dx / n * off;
    return [[H[0] - 30, H[1] - 4 + off * 0.3], [WR[0] + px, WR[1] + py], [EL[0] + px, EL[1] + py], [SH[0] + px, SH[1] + py]]; };
  const NERVES = {
    pain: [...armPath(0), [400, 985], [345, 905]],
    f1: [...armPath(-14).slice(0, 3)],                           // ends in a loop at the elbow
    f4: [...armPath(14), [330, 1080], [250, 1010], [PHONE[0] + 20, PHONE[1] + 40]],  // to the other hand (the phone)
    f3: [...armPath(-7), [430, 960], [410, 870]],                // to the map at the top of the head
    f2: [[H[0] - 30, H[1] - 4], [H[0] - 5, H[1] - 12]]           // the hand's own nerve
  };
  const GLINT = { f1: EL, f4: [PHONE[0] + 20, PHONE[1] + 40], f3: [410, 870], f2: [H[0] - 5, H[1] - 12] };

  // ---------- grid inside the hand (local 1080x1920, placed at H with scale K) ----------
  const K = 0.1;
  const rng = L.rng(1403);
  const FP = { f1: [230, 720], f2: [850, 760], f3: [225, 1250], f4: [855, 1210], R: [540, 1300] };
  const towns = [];
  for (let tries = 0; towns.length < 40 && tries < 4000; tries++) {
    const x = 90 + rng() * 900, y = 470 + rng() * 1330;
    if (Math.abs(x - 540) < 70) continue;
    if (Object.values(FP).some(([fx, fy]) => Math.hypot(fx - x, fy - y) < 120)) continue;
    if (towns.some(o => Math.hypot(o.x - x, o.y - y) < 120)) continue;
    const win = []; const nw = 3 + Math.floor(rng() * 4);
    for (let k = 0; k < nw; k++) win.push([(k % 3) * 26 - 26, Math.floor(k / 3) * 26 - 13]);
    towns.push({ x, y, win });
  }
  const glines = []; const hasL = (i, j) => glines.some(l => (l.i === i && l.j === j) || (l.i === j && l.j === i));
  towns.forEach((a, i) => towns.map((b, j) => [j, Math.hypot(a.x - b.x, a.y - b.y)]).filter(p => p[0] !== i).sort((p, q) => p[1] - q[1]).slice(0, 2)
    .forEach(([j]) => { if (!hasL(i, j)) glines.push({ i, j }); }));
  const TPt = [540, 1760];
  let tripLine = 0, best = 1e9; glines.forEach((l, k) => { const mx = (towns[l.i].x + towns[l.j].x) / 2, my = (towns[l.i].y + towns[l.j].y) / 2; const d = Math.hypot(mx - TPt[0], my - TPt[1]); if (d < best) { best = d; tripLine = k; } });
  const TL = glines[tripLine]; const TPx = (towns[TL.i].x + towns[TL.j].x) / 2, TPy = (towns[TL.i].y + towns[TL.j].y) / 2;
  const items = [];
  towns.forEach((tw, i) => items.push({ k: 't', i, d: Math.hypot(tw.x - TPx, tw.y - TPy) }));
  glines.forEach((l, i) => items.push({ k: 'l', i, d: Math.hypot((towns[l.i].x + towns[l.j].x) / 2 - TPx, (towns[l.i].y + towns[l.j].y) / 2 - TPy) }));
  const maxD = Math.max(...items.map(o => o.d)); items.forEach(o => o.key = o.d / maxD * 0.85 + rng() * 0.15);
  items.sort((p, q) => p.key - q.key); items.forEach((o, n) => o.rank = (n + 0.5) / items.length);
  const RANK = { t: {}, l: {} }; items.forEach(o => RANK[o.k][o.i] = o.rank);
  // soft edge for the grid so no rectangle ever shows
  const edge = (x, y) => L.sm(0, 160, x) * L.sm(0, 160, 1080 - x) * L.sm(300, 520, y) * L.sm(0, 120, 1920 - y);

  // ---------- helpers ----------
  const fade = (t, a, b, f = 0.3) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));
  function glow(ctx, x, y, r, rgb, a) { if (a <= 0.005 || r <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); }
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
  function card(ctx, lines, y, size, a, col) { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center';
    let yy = y; lines.forEach((l, i) => { const o = typeof l === 'string' ? { text: l } : l; let fz = o.size || size; ctx.font = `${fz}px "${SERIF}"`;
      while (ctx.measureText(o.text).width > 800 && fz > 30) { fz -= 4; ctx.font = `${fz}px "${SERIF}"`; }
      if (i) yy += fz * 1.06; ctx.lineJoin = 'round'; ctx.lineWidth = fz * 0.14; ctx.strokeStyle = 'rgba(10,13,18,0.95)'; ctx.strokeText(o.text, 490, yy);
      ctx.fillStyle = o.col || col || '#f4f1ea'; ctx.fillText(o.text, 490, yy); }); ctx.restore(); }
  function slate(ctx, s) { ctx.save(); ctx.fillStyle = 'rgba(8,11,16,0.6)'; ctx.fillRect(40, 1818, 640, 58); ctx.restore(); L.slate(ctx, s); }
  const polyLen = pts => { let s = 0; for (let i = 1; i < pts.length; i++) s += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return s; };
  const polyAt = (pts, f) => { let d = f * polyLen(pts); for (let i = 1; i < pts.length; i++) { const s = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
    if (d <= s) return [L.lerp(pts[i - 1][0], pts[i][0], d / s), L.lerp(pts[i - 1][1], pts[i][1], d / s)]; d -= s; } return pts[pts.length - 1]; };
  function strokePoly(ctx, pts, col, w, dash) { ctx.save(); ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; if (dash) ctx.setLineDash(dash);
    ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore(); }

  // ---------- camera (log zoom, focus-preserving centre) ----------
  const CAM = [[0, [590, 1150, 1.6]], [1.6, [585, 1160, 1.7]], [4.5, [H[0], H[1], 10]], [9.1, [H[0], H[1] + 6, 10.8]], [10.3, [H[0], H[1] + 6, 10.8]],
    [12.7, [540, 1080, 0.95]], [13.7, [540, 1070, 1.0]], [16.5, [320, 950, 3.0]], [19.0, [320, 950, 3.3]]];
  function camAt(t) {
    if (t <= CAM[0][0]) return CAM[0][1];
    for (let i = 0; i < CAM.length - 1; i++) { const [a, P] = CAM[i], [b, Q] = CAM[i + 1];
      if (t <= b) { const e = L.ease.inOut((t - a) / (b - a)); const z = Math.exp(L.lerp(Math.log(P[2]), Math.log(Q[2]), e));
        const fc = Math.abs(1 / P[2] - 1 / Q[2]) < 1e-6 ? e : (1 / P[2] - 1 / z) / (1 / P[2] - 1 / Q[2]);
        return [L.lerp(P[0], Q[0], fc), L.lerp(P[1], Q[1], fc), z]; } }
    return CAM[CAM.length - 1][1];
  }
  const applyCam = (ctx, c) => { ctx.translate(540, 960); ctx.scale(c[2], c[2]); ctx.translate(-c[0], -c[1]); };

  // ---------- bean (after scenes/example_follow_the_green.js) ----------
  function beanFace(ctx, x, y, s, mood, look) {
    const bw = 46 * s, bh = 60 * s, ey = y - bh * 0.14, er = bw * (mood === 'panic' ? 0.17 : 0.14);
    [-1, 1].forEach(sd => { const ex = x + sd * bw * 0.19;
      ctx.fillStyle = '#fffdf7'; ctx.beginPath(); ctx.arc(ex, ey, er, 0, 7); ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 1.6 * s; ctx.stroke();
      ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(ex + look[0] * er * 0.45, ey + look[1] * er * 0.45, er * (mood === 'panic' ? 0.36 : 0.5), 0, 7); ctx.fill();
      if (mood === 'glazed') { ctx.fillStyle = SKIN; ctx.fillRect(ex - er * 1.15, ey - er * 1.15, er * 2.3, er * 1.05); ctx.strokeStyle = INK; ctx.lineWidth = 2.2 * s; ctx.beginPath(); ctx.moveTo(ex - er, ey - er * 0.1); ctx.lineTo(ex + er, ey - er * 0.1); ctx.stroke(); }
      if (mood === 'panic') { ctx.strokeStyle = INK; ctx.lineWidth = 3 * s; ctx.beginPath(); ctx.moveTo(ex - er, ey - er * 1.6 + sd * er * 0.3); ctx.lineTo(ex + er, ey - er * 1.6 - sd * er * 0.3); ctx.stroke(); }
      if (mood === 'alert') { ctx.strokeStyle = INK; ctx.lineWidth = 2.6 * s; ctx.beginPath(); ctx.moveTo(ex - er, ey - er * 1.5); ctx.lineTo(ex + er, ey - er * 1.5); ctx.stroke(); } });
    const my = y + bh * 0.15; ctx.strokeStyle = INK; ctx.fillStyle = INK; ctx.lineWidth = 3 * s; ctx.lineCap = 'round'; ctx.beginPath();
    if (mood === 'panic') { ctx.ellipse(x, my + bh * 0.03, bw * 0.09, bw * 0.12, 0, 0, 7); ctx.fill(); }
    else if (mood === 'alert') { ctx.ellipse(x, my + bh * 0.02, bw * 0.05, bw * 0.06, 0, 0, 7); ctx.fill(); }
    else { ctx.moveTo(x - bw * 0.1, my); ctx.lineTo(x + bw * 0.1, my); ctx.stroke(); }
  }
  function body(ctx, t, h, { mood, look, skinA, redOn, phoneLit }) {
    // kitchen
    ctx.fillStyle = '#1a2029'; ctx.fillRect(-2000, 1405, 5000, 3000);
    ctx.fillStyle = '#2a313b'; rr(ctx, 610, 1400, 440, 34, 10); ctx.fill();
    ctx.fillStyle = '#3a424d'; ctx.beginPath(); ctx.ellipse(H[0], 1405, 150, 26, 0, 0, 7); ctx.fill();
    ctx.strokeStyle = '#5a636e'; ctx.lineWidth = 4; [110, 72, 36].forEach(r => { ctx.beginPath(); ctx.ellipse(H[0], 1405, r, r * 0.17, 0, 0, 7); ctx.stroke(); });
    // red heat under the hand (threat): small spot from the first trip, then logistic flood
    const ex = extent(h);
    if (redOn && h >= TRIP) {
      glow(ctx, H[0], 1398, 90 + 460 * ex, '255,59,48', 0.55 + 0.35 * ex);
      ctx.strokeStyle = RED; ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(H[0], 1405, 72, 12, 0, 0, 7); ctx.stroke();
      if (ex > 0) for (let k = 0; k <= 10; k++) { const f = k / 10; if (f > ex) break; const p = [L.lerp(WR[0], SH[0], f), L.lerp(WR[1], SH[1], f)]; glow(ctx, p[0], p[1], 90, '255,59,48', 0.35 * ex); }
    }
    ctx.save(); ctx.globalAlpha = skinA;
    // right arm (to the stove) and hand
    ctx.strokeStyle = SKIN; ctx.lineCap = 'round'; ctx.lineWidth = 52; ctx.beginPath(); ctx.moveTo(SH[0], SH[1]); ctx.lineTo(EL[0], EL[1]); ctx.lineTo(WR[0], WR[1]); ctx.stroke();
    ctx.fillStyle = SKIN; rr(ctx, H[0] - 88, H[1] - 30, 176, 60, 30); ctx.fill();
    ctx.lineWidth = 26; ctx.beginPath(); ctx.moveTo(H[0] - 55, H[1] - 26); ctx.lineTo(H[0] - 30, H[1] - 50); ctx.stroke();
    // left arm to the phone
    ctx.lineWidth = 38; ctx.beginPath(); ctx.moveTo(BX - 110, BY + 20); ctx.lineTo(PHONE[0] + 20, PHONE[1] + 60); ctx.stroke();
    // body
    const bw = 46 * BS, bh = 60 * BS; ctx.fillStyle = SKIN; rr(ctx, BX - bw / 2, BY - bh / 2, bw, bh, bw / 2); ctx.fill();
    ctx.restore();
    if (skinA < 0.99) { ctx.save(); ctx.strokeStyle = 'rgba(217,212,202,0.5)'; ctx.lineWidth = 3; const bw = 46 * BS, bh = 60 * BS; rr(ctx, BX - bw / 2, BY - bh / 2, bw, bh, bw / 2); ctx.stroke(); rr(ctx, H[0] - 88, H[1] - 30, 176, 60, 30); ctx.stroke(); ctx.restore(); }
    ctx.save(); ctx.globalAlpha = Math.max(skinA, 0.6); beanFace(ctx, BX, BY, BS, mood, look); ctx.restore();
    // phone (attention: brightness)
    ctx.save(); ctx.translate(PHONE[0], PHONE[1]); ctx.rotate(-0.18);
    glow(ctx, 30, 0, 260, '200,210,225', 0.18 * phoneLit);
    ctx.fillStyle = '#2b313b'; rr(ctx, -52, -92, 104, 184, 16); ctx.fill();
    ctx.fillStyle = '#aab3bf'; rr(ctx, -44, -80, 88, 160, 10); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.rect(-44, -80, 88, 160); ctx.clip();
    const off = (t * 140) % 60; for (let k = -1; k < 4; k++) { ctx.fillStyle = k % 2 ? '#7e8793' : '#8f98a4'; rr(ctx, -38, -76 + k * 60 - off + 60, 76, 50, 8); ctx.fill(); }
    ctx.restore(); ctx.restore();
  }
  // nerve overlay (x-ray) in body world
  function nerves(ctx, t, h, xa, painState) {
    if (xa > 0.01) {
      ctx.save(); ctx.globalAlpha = xa;
      // pain nerve (the alarm)
      if (painState === 'alive') { strokePoly(ctx, NERVES.pain, '#fffdf7', 6); const p = polyAt(NERVES.pain, (t * 1.4) % 1); glow(ctx, p[0], p[1], 40, '255,253,247', 0.8); }
      else { strokePoly(ctx, NERVES.pain, '#6b7581', 5, [12, 12]);
        const [a, b] = [NERVES.pain[0], NERVES.pain[1]]; const m = [L.lerp(a[0], b[0], 0.5), L.lerp(a[1], b[1], 0.5)];
        ctx.strokeStyle = '#9aa0aa'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(m[0] - 12, m[1] - 12); ctx.lineTo(m[0] + 12, m[1] + 12); ctx.moveTo(m[0] + 12, m[1] - 12); ctx.lineTo(m[0] - 12, m[1] + 12); ctx.stroke(); }
      ['f1', 'f4', 'f3', 'f2'].forEach((id, k) => { const on = h >= FR[id]; const pts = NERVES[id];
        strokePoly(ctx, pts, on ? 'rgba(52,210,123,0.85)' : 'rgba(120,130,140,0.35)', 4);
        if (on) for (let q = 0; q < 3; q++) { const f = ((h - FR[id]) * 4 + q / 3) % 1; const p = polyAt(pts, f); glow(ctx, p[0], p[1], 22, '52,210,123', 0.9); } });
      // f1 loop at the elbow
      ctx.strokeStyle = h >= FR.f1 ? GREEN : 'rgba(120,130,140,0.35)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(EL[0] - 18, EL[1] - 30, 22, 0, 7); ctx.stroke();
      ctx.restore();
    }
    // glints under the skin: fragments that are ready (always visible)
    Object.entries(GLINT).forEach(([id, p]) => { if (h >= FR[id]) { glow(ctx, p[0], p[1], 34, '52,210,123', 0.7); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(p[0], p[1], 8, 0, 7); ctx.fill(); } });
  }
  // grid (inside the hand), drawn in local coords
  function grid(ctx, t, h, painState) {
    const ex = extent(h);
    ctx.fillStyle = '#0c1016';
    glines.forEach((l, k) => { const a = towns[l.i], b = towns[l.j]; const e = Math.min(edge(a.x, a.y), edge(b.x, b.y)); if (e < 0.02) return;
      const isTrip = k === tripLine && h >= TRIP; const out = RANK.l[k] < ex;
      ctx.save(); ctx.globalAlpha = e; ctx.strokeStyle = isTrip ? RED : out ? '#262c35' : '#4d5763'; ctx.lineWidth = isTrip ? 10 : 6; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      if (isTrip) glow(ctx, (a.x + b.x) / 2, (a.y + b.y) / 2, 150, '255,59,48', 0.55);
      ctx.restore(); });
    // alarm nerve (pain), vertical through the middle
    ctx.save();
    if (painState === 'alive') { ctx.strokeStyle = '#fffdf7'; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(540, 1850); ctx.lineTo(540, 360); ctx.stroke(); glow(ctx, 540, L.lerp(1850, 360, (t * 1.2) % 1), 90, '255,253,247', 0.8); }
    else { ctx.strokeStyle = '#59626d'; ctx.lineWidth = 12; ctx.setLineDash([30, 26]); ctx.beginPath(); ctx.moveTo(540, 1850); ctx.lineTo(540, 360); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = '#8a929c'; ctx.lineWidth = 8; ctx.beginPath(); ctx.moveTo(515, 1585); ctx.lineTo(565, 1635); ctx.moveTo(565, 1585); ctx.lineTo(515, 1635); ctx.stroke(); }
    ctx.restore();
    L.label(ctx, painState === 'alive' ? 'pain nerve' : 'pain nerve: numb', 580, 560, 46, { col: '#aab2bc', align: 'left', alpha: edge(600, 520) + 0.6 });
    // towns: lit windows = cells with power
    towns.forEach((tw, i) => { const e = edge(tw.x, tw.y); if (e < 0.02) return; const out = RANK.t[i] < ex;
      ctx.save(); ctx.globalAlpha = e;
      if (out && RANK.t[i] > ex - 0.25) glow(ctx, tw.x, tw.y, 110, '255,59,48', 0.5);
      tw.win.forEach(([dx, dy]) => { ctx.fillStyle = out ? '#262c35' : '#d8dde3'; ctx.fillRect(tw.x + dx - 10, tw.y + dy - 10, 20, 20); });
      ctx.restore(); });
    // links between fragments (human aggregation, lognormal)
    LINKS.forEach(c => { const pa = FP[c.a], pb = FP[c.b]; const d = h - c.h; if (d < 0 || d > GROW + HOLDH + DROP) return;
      const g = L.clamp(d / GROW, 0, 1), dropF = L.clamp((d - GROW - HOLDH) / DROP, 0, 1);
      if (dropF <= 0) { const e = [L.lerp(pa[0], pb[0], g), L.lerp(pa[1], pb[1], g)]; ctx.strokeStyle = GREEN; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(pa[0], pa[1]); ctx.lineTo(e[0], e[1]); ctx.stroke(); }
      else { const m = [(pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2]; ctx.save(); ctx.globalAlpha = 1 - dropF; ctx.strokeStyle = '#7d8793'; ctx.lineWidth = 6; ctx.setLineDash([14, 14]);
        ctx.beginPath(); ctx.moveTo(pa[0], pa[1]); ctx.lineTo(L.lerp(pa[0], m[0], 0.8), L.lerp(pa[1], m[1], 0.8)); ctx.moveTo(pb[0], pb[1]); ctx.lineTo(L.lerp(pb[0], m[0], 0.8), L.lerp(pb[1], m[1], 0.8)); ctx.stroke(); ctx.restore(); } });
    // fragments: green when ready; their fibres carry pulses up and away (the wrong places)
    ['f1', 'f2', 'f3', 'f4'].forEach((id, k) => { const [x, y] = FP[id]; const on = h >= FR[id];
      const fib = [[x, y], [x + (k % 2 ? 60 : -60), y - 200], [x + (k % 2 ? 90 : -90), 300]];
      strokePoly(ctx, fib, on ? 'rgba(52,210,123,0.7)' : 'rgba(110,120,130,0.4)', 7);
      if (on) { for (let q = 0; q < 3; q++) { const p = polyAt(fib, ((h - FR[id]) * 4 + q / 3) % 1); glow(ctx, p[0], p[1], 40, '52,210,123', 0.9); }
        glow(ctx, x, y, 120, '52,210,123', 0.45); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(x, y, 36, 0, 7); ctx.fill(); }
      else { ctx.strokeStyle = '#6b7581'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(x, y, 36, 0, 7); ctx.stroke(); } });
    // the reflex that could pull the hand away (the fix): never lit
    const [rx, ry] = FP.R; ctx.strokeStyle = '#9aa0aa'; ctx.lineWidth = 8; ctx.setLineDash([16, 12]); ctx.beginPath(); ctx.arc(rx, ry, 64, 0, 7); ctx.stroke(); ctx.setLineDash([]);
    L.label(ctx, 'reflex: pull away', rx + 90, ry - 84, 46, { col: '#c3cad2' });
  }

  function clock(ctx, h, a, rewinding) {
    if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a; const cx = 170, cy = 1420, r = 62;
    ctx.fillStyle = 'rgba(12,16,22,0.8)'; ctx.beginPath(); ctx.arc(cx, cy, r + 10, 0, 7); ctx.fill(); ctx.strokeStyle = '#8a929c'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy, r, 0, 7); ctx.stroke();
    const mins = 14 + h * 60, hrs = 2 + mins / 60; const ma = mins / 60 * Math.PI * 2, ha = hrs / 12 * Math.PI * 2;
    ctx.strokeStyle = '#e8e4da'; ctx.lineCap = 'round'; ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(ha) * r * 0.5, cy - Math.cos(ha) * r * 0.5); ctx.stroke();
    ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.sin(ma) * r * 0.85, cy - Math.cos(ma) * r * 0.85); ctx.stroke();
    if (rewinding) { ctx.fillStyle = 'rgba(12,16,22,0.85)'; rr(ctx, 280, 1370, 290, 100, 20); ctx.fill(); ctx.fillStyle = '#e8e4da'; [0, 1].forEach(k => { const x0 = 300 + k * 44; ctx.beginPath(); ctx.moveTo(x0, 1420); ctx.lineTo(x0 + 44, 1392); ctx.lineTo(x0 + 44, 1448); ctx.closePath(); ctx.fill(); });
      L.label(ctx, 'rewind', 420, 1434, 44, { col: '#e8e4da', align: 'left' }); }
    ctx.restore();
  }

  // ---------- snap panels ----------
  const SNAP0 = 19.4, SW1 = [20.2, 22.2], SW2 = [22.9, 24.9], SNAP1 = 27.4;
  const AX0 = 130, AX1 = 950, hx = h => AX0 + h / 2 * (AX1 - AX0);
  function panel(ctx, t, y0, sweep, ai) {
    const head = L.clamp((t - sweep[0]) / (sweep[1] - sweep[0]), 0, 1) * 2;
    ctx.save(); ctx.fillStyle = '#171d25'; rr(ctx, 60, y0, 940, 430, 18); ctx.fill(); ctx.strokeStyle = '#2c3440'; ctx.lineWidth = 3; ctx.stroke();
    ctx.font = `60px "${SERIF}"`; ctx.fillStyle = '#f4f1ea'; ctx.textAlign = 'left'; ctx.fillText(ai ? 'Routed' : 'As it happened', 100, y0 + 78);
    if (ai) L.label(ctx, 'illustrative', 290, y0 + 76, 48, { col: '#c8ced6', align: 'left' });
    const ay = y0 + 210;
    ctx.fillStyle = 'rgba(255,59,48,0.14)'; ctx.fillRect(hx(TRIP), ay - 50, hx(C0) - hx(TRIP), 100); ctx.strokeStyle = 'rgba(255,59,48,0.6)'; ctx.lineWidth = 2; ctx.strokeRect(hx(TRIP), ay - 50, hx(C0) - hx(TRIP), 100);
    if (head >= TRIP) L.label(ctx, 'the window', (hx(TRIP) + hx(C0)) / 2, ay - 64, 44, { col: '#ff8a80' });
    ctx.strokeStyle = '#5a6470'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(AX0, ay); ctx.lineTo(AX1, ay); ctx.stroke();
    ctx.strokeStyle = '#d7dce2'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(AX0, ay); ctx.lineTo(hx(head), ay); ctx.stroke();
    if (head >= C0) { const f = L.clamp((head - C0) / (C1 - C0), 0, 1);
      if (ai) { ctx.setLineDash([10, 10]); ctx.strokeStyle = RED; ctx.lineWidth = 4; ctx.strokeRect(hx(C0), ay - 74, hx(C1) - hx(C0) + 24, 148); ctx.setLineDash([]);
        ctx.font = `92px "${SERIF}"`; ctx.fillStyle = '#f4f1ea'; ctx.textAlign = 'center'; ctx.fillText('?', hx(C0) + 34, ay + 32); }
      else { ctx.fillStyle = RED; ctx.fillRect(hx(C0), ay - 74, (hx(C1) - hx(C0) + 24) * f, 148); } }
    const gh = ai ? AI : AG.median;
    if (head >= gh) { const x = hx(gh); glow(ctx, x, ay, 70, '52,210,123', 0.5); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(x, ay, 16, 0, 7); ctx.fill();
      if (ai) { ctx.strokeStyle = 'rgba(52,210,123,0.55)'; ctx.lineWidth = 10; ctx.beginPath(); ctx.moveTo(x, ay); ctx.lineTo(hx(Math.min(head, C0)), ay); ctx.stroke(); }
      ctx.strokeStyle = GREEN; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, ay + 18); ctx.lineTo(x, ay + 88); ctx.stroke();
      L.label(ctx, ai ? 'warning reaches the hand' : 'pieces noticed, never joined', ai ? x - 10 : Math.min(x + 60, 940), ay + 138, 46, { col: GREEN, align: ai ? 'left' : 'right' }); }
    if (head < 2) { ctx.fillStyle = '#fffdf7'; ctx.beginPath(); ctx.arc(hx(head), ay, 10, 0, 7); ctx.fill(); }
    ctx.restore();
  }

  // ---------- draw ----------
  function scenePart(ctx, t) {
    const h = hAt(t); const c = camAt(t);
    const pain = t >= T0F - 0.01 && t < 14.3 ? 'alive' : 'numb';
    const xr = L.sm(10.9, 12.2, t) * (1 - L.sm(15.6, 16.4, t) * 0.65);
    const ex = extent(h);
    const mood = ex > 0.25 ? 'panic' : 'glazed', look = ex > 0.25 ? [1, 0.8] : [-1, 0.4];
    ctx.save(); applyCam(ctx, c);
    body(ctx, t, h, { mood, look, skinA: 1 - 0.55 * xr, redOn: true, phoneLit: ex > 0.25 ? 0.3 : 1 });
    nerves(ctx, t, h, xr, pain);
    ctx.restore();
    // inside the hand: full-frame fade, then the grid under the same camera
    const gA = L.sm(Math.log(2.6), Math.log(6.5), Math.log(c[2]));
    if (gA > 0.01) {
      ctx.fillStyle = `rgba(12,16,22,${0.97 * gA})`; ctx.fillRect(0, 0, 1080, 1920);
      ctx.save(); ctx.globalAlpha = gA; applyCam(ctx, c); ctx.translate(H[0], H[1]); ctx.scale(K, K); ctx.translate(-540, -960);
      grid(ctx, t, h, pain); ctx.restore();
    }
    clock(ctx, h, fade(t, 1.8, 16.4, 0.4), t >= R0 && t < T0F && !(t >= FZ0 && t < FZ1));
  }

  function draw(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    if (t < SNAP0) {
      if (t < 19.0) scenePart(ctx, t);
      card(ctx, ['Why didn’t it hurt?'], 330, 100, t < 0.05 ? 1 : fade(t, -1, 1.7, 0.25));
      card(ctx, ['50 million people.', 'Lights out.'], 330, 88, fade(t, 2.0, 4.3));
      card(ctx, ['Rewind.'], 330, 110, fade(t, 4.4, 5.9, 0.2));
      card(ctx, ['The warning was there.', 'In pieces.'], 320, 84, fade(t, 6.1, 8.7));
      card(ctx, ['First burn. No pain.'], 330, 88, fade(t, 8.95, 10.6, 0.2));
      card(ctx, ['The head was scrolling.'], 330, 84, fade(t, 11.2, 13.5));
      card(ctx, ['Here, the pain nerve', 'went numb.'], 320, 84, fade(t, 14.35, 16.4));
      card(ctx, ['We slowed it down', 'so you could see it.'], 320, 84, fade(t, 16.6, 18.95, 0.35));
      if (t >= 9.1 && t < 10.3) { ctx.fillStyle = 'rgba(12,16,22,0.85)'; rr(ctx, 280, 1370, 200, 100, 20); ctx.fill(); L.label(ctx, 'freeze', 300, 1434, 44, { col: '#e8e4da', align: 'left', alpha: 0.9 }); }
      slate(ctx, t < 1.6 ? 'SC0  CLOSE  (the end first)' : t < 4.5 ? 'SC1  DOLLY IN  through the skin' : t < 10.3 ? 'SC2  INSIDE  1 s = 15 min, reversed' : t < 13.7 ? 'SC3  PULL OUT  whole body' : 'SC4  DOLLY IN  closer');
      if (t > 18.7) { ctx.fillStyle = `rgba(10,13,18,${L.sm(18.7, 19.0, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
    } else if (t < SNAP1) {
      ctx.fillStyle = '#0e1319'; ctx.fillRect(0, 0, 1080, 1920);
      card(ctx, ['Now forward.', 'Same body, same hour.'], 300, 80, fade(t, 19.5, 22.6));
      panel(ctx, t, 480, SW1, false);
      if (t >= 22.6) { ctx.save(); ctx.globalAlpha = L.sm(22.6, 22.9, t); panel(ctx, t, 980, SW2, true); ctx.restore(); }
      card(ctx, ['Same pieces, routed.'], 330, 84, fade(t, 22.8, 25.0));
      card(ctx, ['People still decide.'], 330, 84, fade(t, 25.1, SNAP1 + 0.2));
      if (t > 24.9) L.label(ctx, 'outcome unknown', hx(C0) - 10, 1470, 46, { col: '#e8e4da', align: 'right', alpha: L.sm(24.9, 25.2, t) });
      slate(ctx, 'SC5  INSERT  TWO TIMELINES');
      if (t < SNAP0 + 0.15) { ctx.fillStyle = `rgba(255,255,255,${0.25 * (1 - L.sm(SNAP0, SNAP0 + 0.15, t))})`; ctx.fillRect(0, 0, 1080, 1920); }
      if (t > SNAP1 - 0.3) { ctx.fillStyle = `rgba(14,19,25,${L.sm(SNAP1 - 0.3, SNAP1, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
    } else {
      // closest: the routed version (illustrative) at h = AI; a green signal climbs to the head, eyes leave the phone
      const zt = L.sm(SNAP1, 30.0, t); const c = [L.lerp(430, 395, zt), L.lerp(990, 975, zt), L.lerp(3.8, 4.5, zt)];
      const arrive = L.sm(27.8, 28.9, t);
      ctx.save(); applyCam(ctx, c);
      body(ctx, t, AI, { mood: arrive > 0.6 ? 'alert' : 'glazed', look: arrive > 0.6 ? [1, 0.9] : [-1, 0.4], skinA: 1, redOn: false, phoneLit: 1 - 0.7 * arrive });
      const route = NERVES.pain.slice(0, 4);
      ctx.save(); ctx.globalAlpha = 0.9; strokePoly(ctx, route.slice(1), 'rgba(52,210,123,0.35)', 5);
      const p = polyAt(route, Math.min(1, arrive)); glow(ctx, p[0], p[1], 50, '52,210,123', 0.9); ctx.restore();
      if (arrive >= 1) glow(ctx, SH[0], SH[1], 90, '52,210,123', 0.5 + 0.2 * Math.sin(t * 6));
      ctx.restore();
      if (t < SNAP1 + 0.3) { ctx.fillStyle = `rgba(14,19,25,${1 - L.sm(SNAP1, SNAP1 + 0.3, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
      L.label(ctx, 'illustrative', 490, 1460, 48, { col: '#c8ced6', alpha: fade(t, SNAP1 + 0.2, 30.9) });
      card(ctx, ['This is the bottleneck.'], 330, 92, fade(t, 28.3, 30.9, 0.35));
      slate(ctx, 'SC6  CLOSEST  (routed, illustrative)');
      if (t >= 30.8) L.endCard(ctx, L.sm(30.8, 31.2, t), { line: 'The bottleneck is us.' });
    }
    L.grain(ctx, t, { alpha: 0.04, n: 400 });
  }

  return {
    draw, DUR,
    acts: [{ start: 0, end: 1.6, bpm: 120 }, { start: 1.6, end: 4.5, bpm: 0, drone: true }, { start: 4.5, end: 9.1, bpm: 84, drone: true },
      { start: 10.3, end: 13.7, bpm: 56, drone: true }, { start: 13.7, end: 18.9, bpm: 0, drone: true }, { start: 27.4, end: 35, bpm: 0, drone: true }],
    cues: [{ t: 0.05, type: 'hit' }, { t: 1.6, type: 'whoosh' }, { t: 4.5, type: 'whoosh' },
      ...LINKS.map(c => ({ t: tOfRewind(c.h + GROW + HOLDH), type: 'pop' })),
      { t: 9.1, type: 'bonk' }, { t: 10.3, type: 'whoosh' }, { t: 14.3, type: 'stamp' }, { t: SNAP0, type: 'hit' },
      { t: SW2[0] + (SW2[1] - SW2[0]) * AI / 2, type: 'ding' }, { t: 28.9, type: 'ding' }, { t: 30.8, type: 'stamp' }]
  };
}
if (typeof module !== 'undefined') module.exports = makeScene;
