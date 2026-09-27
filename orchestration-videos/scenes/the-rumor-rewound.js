// the-rumor-rewound: reverse-chronology, chalkboard, language, handheld chase. Analog: false-news-2018.
// Red: L.logistic fitted through the sourced endpoints (1 person at 0 h, 99% of 1,500 at 10 h): doubling 0.58 h (same fit as the-fact-check).
// Green: 14 people who already knew; correction lag per knower L.lognormalQuantile(q, 13, 20) h (Hoaxy). AI (illustrative): (q, 1, 20/13) h.
// Correction reach: hC_i = hR_i + lag_k (Hoaxy's lagged cross-correlation). Mapping: rewind 1 s = 1 h backward; snap 1 s = 4 h forward.
// See output/the-rumor-rewound/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('false-news-2018');
  const DUR = 36, RED = L.RED, GREEN = L.GREEN, BOARD = '#1d2021', CHALK = '#e9e6dc', DIM = '#7c8083';
  const N = 1500, S0 = 1 / N;
  const RED_H = A.threat.points[A.threat.points.length - 1].t;                 // 10 h
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;   // 13, 20
  const AIMED = A.ai_counterfactual.aggregation_median, AIP90 = AIMED * P90 / MED;
  const R_FIT = Math.log(0.99 * (1 - S0) / (0.01 * S0)) / RED_H, D_RED = Math.LN2 / R_FIT; // 0.58 h
  const invLog = share => { const x = share * (1 - S0) / (1 - share); return Math.max(0, Math.log(x / S0) / R_FIT); };

  // ---------- time mapping ----------
  // rewind: h = 10 - (t - 2) to h 5 at t 7; dead stop 7-10.2; h = 5 - (t - 10.2) to 0 at 15.2.
  const hRew = t => t < 2 ? 10 : t < 7 ? 10 - (t - 2) : t < 10.2 ? 5 : Math.max(0, 5 - (t - 10.2));
  const rewinding = t => (t >= 2 && t < 7) || (t >= 10.2 && t < 15.2);
  const T_REPLAY = 20.3, SNAP_RATE = 4, SNAP_SPAN = 24;
  const hSnap = t => L.clamp((t - T_REPLAY) * SNAP_RATE, 0, SNAP_SPAN);

  // ---------- the audience: 1,500 people, reshare tree, radial layout ----------
  const rr = L.rng(20181);
  const CX = 540, CY = 900, R = 470;
  const X = new Float64Array(N), Y = new Float64Array(N), TH = new Float64Array(N), par = new Int32Array(N), hR = new Float64Array(N);
  X[0] = CX; Y[0] = CY; par[0] = -1;
  for (let i = 1; i < N; i++) {
    const p = Math.floor(Math.pow(rr(), 2.2) * i); par[i] = p;
    TH[i] = p === 0 ? rr() * Math.PI * 2 : TH[p] + (rr() - 0.5) * 1.1;
    const rad = Math.max(R * Math.sqrt((i + 0.5) / N) * (0.85 + 0.3 * rr()), Math.hypot(X[p] - CX, Y[p] - CY) + 6);
    X[i] = CX + Math.cos(TH[i]) * rad; Y[i] = CY + Math.sin(TH[i]) * rad * 1.12;
  }
  for (let i = 0; i < N; i++) hR[i] = i === 0 ? 0 : invLog((i + 0.5) / N);

  // cold-open leaf (reached late, ~9.6 h) and the knower beside him
  let LEAF = 1465; { let best = 1e9; for (let i = 1440; i < 1490; i++) { const d = Math.abs(Math.hypot(X[i] - CX, Y[i] - CY) - R * 0.8); if (d < best) { best = d; LEAF = i; } } }
  let KL = 300; { let bd = 1e9; for (let i = 200; i < 1300; i++) { const d = Math.hypot(X[i] - X[LEAF], Y[i] - Y[LEAF]); if (d < bd) { bd = d; KL = i; } } }
  X[KL] = X[LEAF] + 9.5; Y[KL] = Y[LEAF] + 1.5;          // staging: he sits beside her (layout is not data)
  let KR = 5; { let bd = 1e9; for (let i = 3; i < 60; i++) { const d = Math.hypot(X[i] - CX, Y[i] - CY); if (d < bd) { bd = d; KR = i; } } }
  X[KR] = CX + 9; Y[KR] = CY + 1.5;                       // staging: a knower one seat from the first thumb
  // push neighbours out of the close-up framings
  const clear = (ax, ay, rad, keep) => { for (let i = 0; i < N; i++) { if (keep.includes(i)) continue; const dx = X[i] - ax, dy = Y[i] - ay, d = Math.hypot(dx, dy);
    if (d < rad) { const f = rad / (d || 1); X[i] = ax + (dx || 1) * f; Y[i] = ay + dy * f; } } };
  for (let pass = 0; pass < 2; pass++) { clear(X[LEAF], Y[LEAF], 22, [LEAF, KL]); clear(X[KL], Y[KL], 22, [LEAF, KL]); clear(X[0], Y[0], 24, [0, KR]); clear(X[KR], Y[KR], 24, [0, KR]); }

  // knowers: KR, KL + 12 spread by farthest-point sampling among ranks 60-1400
  const knowers = [KR, KL];
  while (knowers.length < 14) { let best = -1, bd = -1; for (let i = 60; i < 1400; i += 3) { if (knowers.includes(i)) continue;
      const d = Math.min(...knowers.map(k => Math.hypot(X[k] - X[i], Y[k] - Y[i]))) * (0.8 + 0.4 * rr()); if (d > bd) { bd = d; best = i; } } knowers.push(best); }
  const qs = knowers.map((_, k) => (k + 0.5) / knowers.length); for (let i = qs.length - 1; i > 0; i--) { const j = Math.floor(rr() * (i + 1)); [qs[i], qs[j]] = [qs[j], qs[i]]; }
  { const iKL = qs.findIndex(q => Math.abs(q - 7.5 / 14) < 1e-9); [qs[1], qs[iKL]] = [qs[iKL], qs[1]]; } // KL = the median-ish knower (13.4 h)
  const K = knowers.map((n, k) => ({ n, lag: L.lognormalQuantile(qs[k], MED, P90), lagAI: L.lognormalQuantile(qs[k], AIMED, AIP90) }));
  const isK = new Int8Array(N); knowers.forEach(n => isK[n] = 1);
  const own = new Int32Array(N); for (let i = 0; i < N; i++) { let b = 0, bd = 1e18; K.forEach((k, j) => { const d = (X[k.n] - X[i]) ** 2 + (Y[k.n] - Y[i]) ** 2; if (d < bd) { bd = d; b = j; } }); own[i] = b; }
  const hC = new Float64Array(N), hCAI = new Float64Array(N); for (let i = 0; i < N; i++) { hC[i] = hR[i] + K[own[i]].lag; hCAI[i] = hR[i] + K[own[i]].lagAI; }
  const lagSorted = K.map(k => k.lag).sort((a, b) => a - b);

  // ancestry chain of the leaf, for the handheld chase
  const chain = []; for (let c = LEAF; c >= 0; c = par[c]) chain.push(c);
  const chase = h => { if (h >= hR[chain[0]]) return [X[chain[0]], Y[chain[0]]];
    for (let k = 0; k < chain.length - 1; k++) { const a = chain[k + 1], b = chain[k]; if (h >= hR[a]) { const f = L.ease.inOut(L.clamp((h - hR[a]) / (hR[b] - hR[a]), 0, 1)); return [L.lerp(X[a], X[b], f), L.lerp(Y[a], Y[b], f)]; } }
    return [X[0], Y[0]]; };

  // board smudges (screen space)
  const smudges = []; for (let i = 0; i < 14; i++) smudges.push({ x: rr() * 1080, y: rr() * 1920, rx: 120 + rr() * 320, ry: 50 + rr() * 120, a: rr() * 3, o: 0.018 + rr() * 0.025 });

  // ---------- camera ----------
  const lz = (a, b, f) => Math.exp(L.lerp(Math.log(a), Math.log(b), f));
  const OPEN = [X[LEAF] + 4.75, Y[LEAF] + 0.5], ROOTF = [CX + 4.5, CY + 0.5], ROOTF2 = [CX + 3.2, CY + 1.2];
  function cam(t) {
    let x, y, z, r, shake;
    if (t < 2) { [x, y] = OPEN; z = L.lerp(40, 42, t / 2); r = 0; shake = 10; }
    else if (t < 7) { const f = L.ease.inOut((t - 2) / 5), c = chase(hRew(t)), s = L.sm(2, 2.8, t);
      const cx = L.lerp(L.lerp(OPEN[0], c[0], s), CX, Math.pow(f, 1.6)), cy = L.lerp(L.lerp(OPEN[1], c[1], s), CY, Math.pow(f, 1.6));
      x = cx; y = cy; z = lz(42, 1, f); r = 0.3 * f; shake = 34; }
    else if (t < 10.2) { x = CX; y = CY; z = 1 + 0.03 * L.sm(7, 10.2, t); r = L.lerp(0.3, 0.24, L.sm(7, 10.2, t)); shake = 8; }
    else if (t < 15.2) { const f = L.ease.inOut((t - 10.2) / 5); x = L.lerp(CX, ROOTF[0], f); y = L.lerp(CY, ROOTF[1], f); z = lz(1.03, 40, f); r = L.lerp(0.24, 0, f); shake = 30; }
    else if (t < 20) { x = ROOTF[0]; y = ROOTF[1]; z = L.lerp(40, 44, L.sm(15.2, 17.2, t)); r = 0; shake = 6; }
    else { x = ROOTF2[0]; y = ROOTF2[1]; z = L.lerp(62, 74, L.sm(28.6, 32, t)); r = 0; shake = 5; }
    const sx = (L.noise(t * 2.3, 1) - 0.5) * shake / z, sy = (L.noise(t * 2.1, 7) - 0.5) * shake / z, sr = (L.noise(t * 1.7, 3) - 0.5) * 0.012 * shake / 20;
    return [x + sx, y + sy, z, r + sr];
  }

  // ---------- drawing helpers ----------
  const rrect = (c, x, y, w, h, r) => { c.beginPath(); c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.arcTo(x + w, y, x + w, y + r, r); c.lineTo(x + w, y + h - r); c.arcTo(x + w, y + h, x + w - r, y + h, r);
    c.lineTo(x + r, y + h); c.arcTo(x, y + h, x, y + h - r, r); c.lineTo(x, y + r); c.arcTo(x, y, x + r, y, r); c.closePath(); };
  function glow(c, x, y, r, col, a) { const g = c.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col); g.addColorStop(1, 'rgba(0,0,0,0)'); c.save(); c.globalAlpha = a; c.fillStyle = g; c.fillRect(x - r, y - r, 2 * r, 2 * r); c.restore(); }
  // chalk bean: outline body, readable face, phone; s in world units (body width 46 s)
  function bean(c, x, y, s, { mood = 'bored', look = [0, 0], lit = 0, frag = 0, thumb = 0, t = 0, alpha = 1 } = {}) {
    const bw = 46 * s, bh = 60 * s; c.save(); c.globalAlpha = alpha;
    if (lit > 0) glow(c, x, y - bh * 0.1, bw * 1.25, 'rgba(255,59,48,0.55)', lit);
    if (frag > 0) glow(c, x - bw * 0.62, y + bh * 0.12, bw * 0.7, 'rgba(52,210,123,0.6)', frag);
    c.fillStyle = BOARD; rrect(c, x - bw / 2, y - bh / 2, bw, bh, bw / 2); c.fill();
    c.strokeStyle = CHALK; c.lineWidth = 3.2 * s; c.globalAlpha = alpha * 0.9; c.stroke();
    c.globalAlpha = alpha * 0.2; c.lineWidth = 8 * s; c.stroke(); c.globalAlpha = alpha;
    const ey = y - bh * 0.14, er = bw * (mood === 'panic' ? 0.16 : 0.13);
    [-1, 1].forEach(sd => { const ex = x + sd * bw * 0.19; c.fillStyle = CHALK; c.beginPath(); c.arc(ex, ey, er, 0, 6.283); c.fill();
      c.fillStyle = BOARD; c.beginPath(); c.arc(ex + look[0] * er * 0.45, ey + look[1] * er * 0.45, er * (mood === 'panic' ? 0.36 : 0.5), 0, 6.283); c.fill();
      if (mood === 'bored') { c.fillStyle = BOARD; c.fillRect(ex - er * 1.2, ey - er * 1.2, er * 2.4, er * 1.05); c.strokeStyle = CHALK; c.lineWidth = 2 * s; c.beginPath(); c.moveTo(ex - er, ey - er * 0.12); c.lineTo(ex + er, ey - er * 0.12); c.stroke(); } });
    c.strokeStyle = CHALK; c.lineWidth = 2.6 * s; c.beginPath(); const my = y + bh * 0.1;
    if (mood === 'panic') c.ellipse(x, my, 3.5 * s, 5.5 * s, 0, 0, 6.283); else if (mood === 'sad') c.arc(x, my + 6 * s, 6 * s, 1.2 * Math.PI, 1.8 * Math.PI); else { c.moveTo(x - 5 * s, my); c.lineTo(x + 5 * s, my); } c.stroke();
    // phone in front, lit red when reached
    const pw = bw * 0.42, ph = bh * 0.3, px = x + bw * 0.1, py = y + bh * 0.2;
    c.fillStyle = lit > 0 ? `rgba(255,59,48,${0.35 + 0.55 * lit})` : '#34383a'; rrect(c, px - pw / 2, py - ph / 2, pw, ph, 3 * s); c.fill(); c.strokeStyle = CHALK; c.lineWidth = 2 * s; c.stroke();
    if (thumb > 0) { c.strokeStyle = CHALK; c.lineWidth = 3 * s; c.beginPath(); c.arc(px + pw * 0.15, py + ph * 0.1 - thumb * 2 * s, 4.2 * s, 0, 6.283); c.fillStyle = BOARD; c.fill(); c.stroke(); }
    if (frag > 0) { const fx = x - bw * 0.62, fy = y + bh * 0.12; c.fillStyle = GREEN; c.globalAlpha = alpha * frag; c.save(); c.translate(fx, fy); c.rotate(-0.25); rrect(c, -5.5 * s, -7 * s, 11 * s, 14 * s, 2 * s); c.fill(); c.restore();
      c.strokeStyle = CHALK; c.globalAlpha = alpha; c.lineWidth = 3 * s; c.beginPath(); c.moveTo(x - bw * 0.45, y + bh * 0.02); c.lineTo(fx + 3 * s, fy + 2 * s); c.stroke(); }
    c.restore();
  }
  // chalk clock: 12 h dial, ticks, no numerals
  function clock(c, x, y, r, h, a = 1, rew = 0, stop = 0) {
    c.save(); c.globalAlpha = a; c.strokeStyle = CHALK; c.lineWidth = 4; c.beginPath(); c.arc(x, y, r, 0, 6.283); c.stroke();
    for (let k = 0; k < 12; k++) { const an = k / 12 * 6.283 - Math.PI / 2; c.lineWidth = k % 3 ? 2 : 4; c.beginPath(); c.moveTo(x + Math.cos(an) * r * 0.8, y + Math.sin(an) * r * 0.8); c.lineTo(x + Math.cos(an) * r * 0.93, y + Math.sin(an) * r * 0.93); c.stroke(); }
    const an = (h % 12) / 12 * 6.283 - Math.PI / 2; c.strokeStyle = RED; c.lineWidth = 6; c.lineCap = 'round'; c.beginPath(); c.moveTo(x, y); c.lineTo(x + Math.cos(an) * r * 0.66, y + Math.sin(an) * r * 0.66); c.stroke();
    c.fillStyle = CHALK; c.beginPath(); c.arc(x, y, 5, 0, 6.283); c.fill();
    if (rew > 0) { c.globalAlpha = a * rew; c.fillStyle = CHALK; [0, 1].forEach(k => { const bx = x + r + 34 + k * 34; c.beginPath(); c.moveTo(bx, y - 20); c.lineTo(bx - 32, y); c.lineTo(bx, y + 20); c.closePath(); c.fill(); }); }
    if (stop > 0) { c.globalAlpha = a * stop; c.fillStyle = CHALK; c.fillRect(x + r + 26, y - 20, 12, 40); c.fillRect(x + r + 48, y - 20, 12, 40); }
    c.restore();
  }
  function board(c, t) { c.fillStyle = BOARD; c.fillRect(0, 0, 1080, 1920);
    smudges.forEach(s => { c.save(); c.globalAlpha = s.o; c.fillStyle = '#ffffff'; c.translate(s.x, s.y); c.rotate(s.a); c.beginPath(); c.ellipse(0, 0, s.rx, s.ry, 0, 0, 6.283); c.fill(); c.restore(); }); }

  // the tree at hour h, drawn in world space under the camera
  function drawTree(c, h, z, view, t) {
    const lw = 2.6 / Math.pow(z, 0.7), dr = 3.8 / Math.pow(z, 0.65), beanA = L.sm(4, 9, z);
    const inView = i => X[i] > view[0] && X[i] < view[2] && Y[i] > view[1] && Y[i] < view[3];
    // unreached people: gray chalk dots
    if (beanA < 1) { c.globalAlpha = 0.75 * (1 - beanA); c.fillStyle = DIM; c.beginPath();
      for (let i = 0; i < N; i++) if (hR[i] > h && !isK[i] && inView(i)) { c.moveTo(X[i] + dr * 0.8, Y[i]); c.arc(X[i], Y[i], dr * 0.8, 0, 6.283); } c.fill(); }
    // reshare edges: red chalk, tip retracting in rewind
    const edges = () => { c.beginPath(); for (let i = 1; i < N; i++) { const p = par[i]; if (h < hR[p]) continue; const W = Math.min(0.3, hR[i] - hR[p] + 1e-6); const g = L.clamp((h - (hR[i] - W)) / W, 0, 1); if (g <= 0) continue;
      if (!inView(i) && !inView(p)) { const mx = (X[i] + X[p]) / 2, my = (Y[i] + Y[p]) / 2; if (!(mx > view[0] && mx < view[2] && my > view[1] && my < view[3])) continue; }
      c.moveTo(X[p], Y[p]); c.lineTo(L.lerp(X[p], X[i], g), L.lerp(Y[p], Y[i], g)); } };
    c.strokeStyle = RED; c.lineCap = 'round'; edges(); c.globalAlpha = 0.18; c.lineWidth = lw * 2.6; c.stroke(); c.globalAlpha = 0.85; c.lineWidth = lw; c.stroke();
    // reached people: red dots
    if (beanA < 1) { c.globalAlpha = 1 - beanA; c.fillStyle = RED; c.beginPath(); for (let i = 0; i < N; i++) if (hR[i] <= h && !isK[i] && inView(i)) { c.moveTo(X[i] + dr, Y[i]); c.arc(X[i], Y[i], dr, 0, 6.283); } c.fill(); }
    c.globalAlpha = 1;
    // knowers: green dot + correction arc (fills at lag_k)
    const kA = t < 2 ? 1 : t < 7 ? 1 - 0.75 * L.sm(2.5, 4.5, t) : t < 10.2 ? L.lerp(0.25, 1, L.sm(7.0, 7.8, t)) : 1;
    K.forEach(k => { const i = k.n; if (!inView(i)) return; const ar = L.lerp(16 / Math.pow(z, 0.85), 7.2, beanA), f = L.clamp(h / k.lag, 0, 1);
      if (beanA < 1) glow(c, X[i], Y[i], 40 / Math.pow(z, 0.8), 'rgba(52,210,123,0.7)', kA * (1 - beanA));
      c.globalAlpha = kA * 0.35; c.strokeStyle = DIM; c.lineWidth = lw * 1.1; c.beginPath(); c.arc(X[i], Y[i], ar, 0, 6.283); c.stroke();
      c.globalAlpha = kA; c.strokeStyle = GREEN; c.lineWidth = lw * 1.8; c.beginPath(); c.arc(X[i], Y[i], ar, -Math.PI / 2, -Math.PI / 2 + f * 6.283); c.stroke();
      if (beanA < 1) { c.globalAlpha = kA * (1 - beanA); c.fillStyle = GREEN; c.beginPath(); c.arc(X[i], Y[i], dr * 1.5, 0, 6.283); c.fill(); } c.globalAlpha = 1; });
    // people as chalk beans when close
    if (beanA > 0) { for (let i = 0; i < N; i++) { if (!inView(i)) continue; const red = !isK[i] && hR[i] <= h, fresh = red ? L.clamp(1 - (h - hR[i]) / 3, 0.35, 1) : 0;
      const mood = isK[i] ? 'sad' : red ? 'panic' : 'bored', look = isK[i] ? [-1, 0.3] : [0.2, 1];
      bean(c, X[i], Y[i] - 1.2, 0.16, { mood, look, lit: red ? fresh : 0, frag: isK[i] ? 1 : 0, thumb: i === 0 ? 1 : 0, t, alpha: beanA }); } }
  }
  function drawBoardShot(c, t, h) {
    board(c, t); const [x, y, z, r] = cam(t);
    const half = 1150 / z; const view = [x - half, y - half, x + half, y + half * 1.2];
    c.save(); L.camera(c, [[0, [x, y, z, r]]], 0); drawTree(c, h, z, view, t);
    if (h <= 0.05 && z > 20) { const sp = 0.5 + 0.5 * Math.sin(t * 9); glow(c, X[0] + 0.9, Y[0] + 2.2, 2.4, 'rgba(255,59,48,0.95)', 0.6 + 0.4 * sp); }
    c.restore();
  }

  // ---------- snap panels ----------
  const PANELS = [{ y: 360, lab: 'as it happened', ai: false }, { y: 1010, lab: 'AI-routed (illustrative)', ai: true }], PW = 960, PH = 620, SC = 0.5;
  function panel(c, P, h, a) {
    c.save(); c.globalAlpha = a; c.fillStyle = '#23272a'; rrect(c, 60, P.y, PW, PH, 22); c.fill(); c.strokeStyle = CHALK; c.lineWidth = 3; c.globalAlpha = a * 0.6; c.stroke(); c.globalAlpha = a;
    c.beginPath(); rrect(c, 60, P.y, PW, PH, 22); c.clip();
    const ox = 500, oy = P.y + PH / 2 + 22, px = i => ox + (X[i] - CX) * SC, py = i => oy + (Y[i] - CY) * SC;
    c.fillStyle = DIM; c.globalAlpha = a * 0.7; c.beginPath(); for (let i = 0; i < N; i++) if (hR[i] > h && !isK[i]) { c.moveTo(px(i) + 2.2, py(i)); c.arc(px(i), py(i), 2.2, 0, 6.283); } c.fill();
    c.strokeStyle = RED; c.lineWidth = 1.4; c.globalAlpha = a * 0.7; c.beginPath(); for (let i = 1; i < N; i++) if (hR[i] <= h) { c.moveTo(px(par[i]), py(par[i])); c.lineTo(px(i), py(i)); } c.stroke();
    c.globalAlpha = a; c.fillStyle = RED; c.beginPath(); for (let i = 0; i < N; i++) if (hR[i] <= h && !isK[i]) { c.moveTo(px(i) + 2.6, py(i)); c.arc(px(i), py(i), 2.6, 0, 6.283); } c.fill();
    const hc = P.ai ? hCAI : hC; c.strokeStyle = GREEN; c.lineWidth = 2.2; c.beginPath(); for (let i = 0; i < N; i++) if (hc[i] <= h && !isK[i]) { c.moveTo(px(i) + 5.2, py(i)); c.arc(px(i), py(i), 5.2, 0, 6.283); } c.stroke();
    K.forEach(k => { const f = L.clamp(h / (P.ai ? k.lagAI : k.lag), 0, 1); glow(c, px(k.n), py(k.n), 26, 'rgba(52,210,123,0.7)', a); c.fillStyle = GREEN; c.beginPath(); c.arc(px(k.n), py(k.n), 5, 0, 6.283); c.fill();
      c.strokeStyle = GREEN; c.lineWidth = 3; c.beginPath(); c.arc(px(k.n), py(k.n), 12, -Math.PI / 2, -Math.PI / 2 + f * 6.283); c.stroke(); });
    c.restore();
    L.label(c, P.lab, 100, P.y + 62, 48, { align: 'left', col: P.ai ? GREEN : CHALK, alpha: a });
    clock(c, 140, P.y + PH - 80, 44, h, a);
  }

  // ---------- cards ----------
  const CARDS = [
    [0, 1.8, ['1,500 people have it.'], 84],
    [2.0, 3.5, ['Rewind.'], 96],
    [3.6, 5.4, ['Back through every share.'], 78],
    [7.2, 8.7, ['They already knew.'], 84],
    [8.8, 10.3, ['Correction ping: 13 hours.'], 76],
    [11.6, 13.4, ['Back to the first thumb.'], 78],
    [15.4, 16.9, ['One thumb.'], 96],
    [17.3, 19.3, ['We slowed it down', 'so you could see it.'], 84],
    [26.5, 28.2, ['Speed is not belief.'], 72],
    [28.8, 31.6, ['This is the bottleneck.'], 84],
  ];
  function cards(c, t) { CARDS.forEach(([a, b, lines, sz]) => { if (t < a - 0.2 || t > b + 0.2) return; const al = a === 0 ? (t < b ? 1 : 1 - L.sm(b, b + 0.2, t)) : L.sm(a, a + 0.25, t) * (1 - L.sm(b - 0.2, b, t));
    const y = (a > 26 && a < 27) ? 300 : (a > 17 && a < 18) ? 900 : 470; L.title(c, lines, y, sz, { alpha: al, col: '#f4f1e8' }); }); }

  function ruler(c, t, h) {
    const a = L.sm(7.3, 7.8, t) * (1 - L.sm(10.0, 10.4, t)); if (a <= 0) return; const x0 = 140, x1 = 860, y = 1420, px = hh => x0 + (x1 - x0) * Math.min(hh, 30) / 30;
    c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(29,32,33,0.85)'; c.fillRect(100, 1330, 820, 190);
    c.strokeStyle = CHALK; c.lineWidth = 3; c.beginPath(); c.moveTo(x0, y); c.lineTo(x1, y); c.stroke();
    c.strokeStyle = RED; c.globalAlpha = a * 0.35; c.lineWidth = 12; c.beginPath(); c.moveTo(x0, y); c.lineTo(px(RED_H), y); c.stroke();
    c.globalAlpha = a; c.beginPath(); c.moveTo(x0, y); c.lineTo(px(h), y); c.stroke(); c.lineWidth = 4; c.beginPath(); c.moveTo(px(RED_H), y - 26); c.lineTo(px(RED_H), y + 12); c.stroke();
    L.label(c, 'everyone', px(RED_H), y - 38, 44, { col: RED, alpha: a });
    c.strokeStyle = GREEN; c.lineWidth = 4; lagSorted.forEach(l => { const xx = px(l); c.beginPath(); c.moveTo(xx, y - 4); c.lineTo(xx, y + 26); c.stroke(); });
    L.label(c, '13 hours', px(MED), y + 74, 44, { col: GREEN, alpha: a }); c.restore();
  }

  function draw(c, t) {
    if (t < 17.2) { const h = hRew(t); drawBoardShot(c, t, h);
      clock(c, 170, 300, 62, h, 1 - L.sm(15.4, 15.8, t), rewinding(t) ? (0.55 + 0.45 * Math.sin(t * 12)) : 0, (t >= 7 && t < 10.2) || (t >= 15.2) ? 1 : 0);
      ruler(c, t, h);
      L.slate(c, t < 2 ? 'SC0  CLOSE  COLD OPEN  hour 10' : t < 7 ? 'SC1  HANDHELD CHASE  PULL OUT' : t < 10.2 ? 'SC2  WIDE  DEAD STOP' : t < 15.2 ? 'SC3  CHASE IN' : 'SC4  CLOSE  first thumb');
      c.fillStyle = '#000'; c.globalAlpha = L.sm(16.9, 17.2, t); c.fillRect(0, 0, 1080, 1920); c.globalAlpha = 1; }
    else if (t < 20.0) { c.fillStyle = '#0d1011'; c.fillRect(0, 0, 1080, 1920); L.slate(c, 'CARD'); }
    else if (t < 28.6) { board(c, t); const a = L.sm(20.0, 20.4, t); const h = hSnap(t); PANELS.forEach(P => panel(c, P, h, a)); L.slate(c, 'SC5  SNAP  1 s = 4 h');
      c.fillStyle = '#000'; c.globalAlpha = L.sm(28.3, 28.6, t); c.fillRect(0, 0, 1080, 1920); c.globalAlpha = 1; }
    else { drawBoardShot(c, t, 0); L.slate(c, 'SC6  EXTREME CLOSE'); c.fillStyle = '#000'; c.globalAlpha = 1 - L.sm(28.6, 29.0, t); c.fillRect(0, 0, 1080, 1920); c.globalAlpha = 1; }
    cards(c, t);
    L.grain(c, t, { alpha: 0.05, n: 700 });
    if (t >= 31.6) L.endCard(c, L.sm(31.6, 32.0, t));
  }

  return { draw, DUR,
    acts: [{ start: 0, end: 2, bpm: 0, drone: true }, { start: 2, end: 7, bpm: 150, drone: true }, { start: 7, end: 10.2, bpm: 0, drone: true },
      { start: 10.2, end: 15.2, bpm: 150, drone: true }, { start: 15.2, end: 19.4, bpm: 0, drone: true }, { start: 19.4, end: 20.0, bpm: 0 },
      { start: 20.0, end: 28.5, bpm: 96, drone: true }, { start: 28.5, end: 36, bpm: 0, drone: true }],
    cues: [{ t: 2.0, type: 'whoosh' }, { t: 7.0, type: 'stamp' }, { t: 10.2, type: 'whoosh' }, { t: 15.2, type: 'pop' }, { t: 19.9, type: 'hit' }, { t: 26.5, type: 'ding' }, { t: 31.8, type: 'stamp' }] };
}
module.exports = makeScene;
