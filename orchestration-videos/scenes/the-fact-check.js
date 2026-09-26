// the-fact-check: powers-of-ten-zoom, particle/data, language, continuous zoom through scales. Analog: false-news-2018.
// Red: L.logistic fitted through the sourced endpoints (1 person at 0 h, 99% of 1,500 at 10 h): doubling 0.58 h.
// Green (knew): same shape stretched 6x (truth takes ~6x longer, s1), doubling 3.49 h, 99% at 60 h (s2).
// Fact-check links: L.lognormalQuantile(q, 13, 20) h (Hoaxy). AI (illustrative): L.lognormalQuantile(q, 1, 20/13) h.
// Mapping: race 1 s = 1 h (h = t - 4.6); snap 1 s = 20 h. World units are meters. See output/the-fact-check/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('false-news-2018');
  const DUR = 39, RED = L.RED, GREEN = L.GREEN, BG = '#05060a';
  const N = 1500, S0 = 1 / N;
  const RED_H = A.threat.points[A.threat.points.length - 1].t;               // 10 h
  const TRUE_H = A.threat.comparison_true_news[1].t;                          // 60 h
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90; // 13, 20
  const AIMED = A.ai_counterfactual.aggregation_median, AIP90 = AIMED * P90 / MED;
  const R_FIT = Math.log(0.99 * (1 - S0) / (0.01 * S0)) / RED_H;              // share(10 h) = 0.99
  const D_RED = Math.LN2 / R_FIT, D_TRUE = D_RED * TRUE_H / RED_H;            // 0.58 h, 3.49 h
  const invLog = (share, d) => { const x = share * (1 - S0) / (1 - share); return Math.max(0, Math.log(x / S0) / (Math.LN2 / d)); };

  // ---------- time mapping ----------
  const T0 = 4.6, T_FREEZE = 18.6, H_FREEZE = T_FREEZE - T0; // 14 h
  const T_SNAP = 21.0, T_REPLAY = 21.4, SNAP_RATE = 10, T_IN = 30.0, T_END = 34.0;
  const hRace = t => t - T0;
  const hSnap = t => L.clamp((t - T_REPLAY) * SNAP_RATE, 0, TRUE_H);

  // ---------- our cascade: 1,500 people, reshare tree ----------
  const rr = L.rng(1013);
  const X = new Float64Array(N), Y = new Float64Array(N), par = new Int32Array(N), hR = new Float64Array(N), hT = new Float64Array(N), tpar = new Int32Array(N);
  for (let i = 1; i < N; i++) { const p = Math.floor(Math.pow(rr(), 2.2) * i), a = rr() * Math.PI * 2, d = 12 * Math.pow(i + 1, 0.9) * (0.4 + 0.8 * rr());
    par[i] = p; X[i] = X[p] + Math.cos(a) * d; Y[i] = Y[p] + Math.sin(a) * d * 1.25; }
  for (let i = 0; i < N; i++) hR[i] = i === 0 ? 0 : invLog((i + 0.5) / N, D_RED);
  const P = 1250; // the protagonist: she already knew
  const order = [...Array(N).keys()].filter(i => i !== P); for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rr() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
  order.unshift(P); const trank = new Int32Array(N);
  order.forEach((node, j) => { trank[node] = j; hT[node] = j === 0 ? 0 : invLog((j + 0.5) / N, D_TRUE); tpar[node] = j === 0 ? -1 : order[Math.floor(rr() * j)]; });
  let cx0 = 0, cy0 = 0; for (let i = 0; i < N; i++) { cx0 += X[i]; cy0 += Y[i]; } cx0 /= N; cy0 /= N;
  const PHX = X[P], PHY = Y[P];

  // ---------- nation: other cascades, fact-check orgs, dust ----------
  const orgs = []; while (orgs.length < 6) { const x = (rr() - 0.5) * 700e3, y = (rr() - 0.5) * 1300e3; if (Math.hypot(x, y) > 120e3 && orgs.every(o => Math.hypot(o.x - x, o.y - y) > 260e3)) orgs.push({ x, y }); }
  const casc = [{ x: 0, y: 0, o: 0, q: 0.5 }];
  let guard = 0; while (casc.length < 171 && guard++ < 40000) { const x = (rr() - 0.5) * 1000e3, y = (rr() - 0.5) * 1700e3;
    if (casc.every(c => Math.hypot(c.x - x, c.y - y) > 46e3)) casc.push({ x, y, o: 0.3 + 3.7 * rr() }); }
  const qs = casc.slice(1).map((_, i) => (i + 0.5) / (casc.length - 1)); for (let i = qs.length - 1; i > 0; i--) { const j = Math.floor(rr() * (i + 1)); [qs[i], qs[j]] = [qs[j], qs[i]]; }
  casc.forEach((c, i) => { if (i) c.q = qs[i - 1]; c.lag = L.lognormalQuantile(c.q, MED, P90); c.rai = L.lognormalQuantile(c.q, AIMED, AIP90);
    c.link = c.o + c.lag; c.linkAI = c.o + c.rai; let best = 0, bd = 1e18; orgs.forEach((g, k) => { const d = Math.hypot(g.x - c.x, g.y - c.y); if (d < bd) { bd = d; best = k; } }); c.org = orgs[best]; });
  const K = 160, OX = [], OY = [], OR = [], OT = [], OC = [];
  for (let c = 1; c < casc.length; c++) { const lx = [0], ly = [0]; const perm = [...Array(K).keys()]; for (let i = K - 1; i > 0; i--) { const j = Math.floor(rr() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
    for (let j = 0; j < K; j++) { if (j) { const p = Math.floor(Math.pow(rr(), 2.2) * j), a = rr() * 6.283, ii = (j + 0.5) * N / K, d = 12 * Math.pow(ii + 1, 0.9) * (0.4 + 0.8 * rr()); lx.push(lx[p] + Math.cos(a) * d); ly.push(ly[p] + Math.sin(a) * d * 1.25); }
      OX.push(casc[c].x + lx[j]); OY.push(casc[c].y + ly[j]); OR.push(casc[c].o + (j ? invLog((j + 0.5) / K, D_RED) : 0)); OT.push(casc[c].o + (perm[j] ? invLog((perm[j] + 0.5) / K, D_TRUE) : 0)); OC.push(c); } }
  const dustN = [], dustC = [];
  for (let i = 0; i < 2600; i++) dustN.push([(rr() - 0.5) * 1800e3, (rr() - 0.5) * 3000e3]);
  for (let i = 0; i < 2600; i++) { const a = rr() * 6.283, d = Math.pow(rr(), 0.7) * 40e3; dustC.push([cx0 + Math.cos(a) * d, cy0 + Math.sin(a) * d * 1.3]); }
  const bokeh = []; for (let i = 0; i < 34; i++) bokeh.push({ x: rr(), y: rr(), r: 30 + rr() * 120, red: rr(), z: rr() });

  // ---------- micro: phone, feed, word ----------
  const PW = 0.070, PH = 0.146, SW = 0.064, SH = 0.132;
  const WORD = { x: -0.009, y: -0.028 };            // word center relative to phone center
  function wordParticles(seed) { const r = L.rng(seed), pts = []; const nl = 5, lw = 0.0021, gap = 0.0006, H = 0.0030, x0 = -(nl * lw + (nl - 1) * gap) / 2;
    for (let l = 0; l < nl; l++) { const lx = x0 + l * (lw + gap); for (let k = 0; k < 16; k++) { const s = r(); let px, py;
      if (s < 0.4) { px = lx + (r() < 0.5 ? 0.0002 : lw - 0.0002); py = -H / 2 + r() * H; } else { px = lx + r() * lw; py = [-H / 2, 0, H / 2][Math.floor(r() * 3)] + (r() - 0.5) * 0.0003; }
      pts.push([px, py, l]); } } return pts; }
  const WP = wordParticles(21), WP2 = wordParticles(77);
  const feedR = L.rng(55), feedLines = []; for (let p = 0; p < 5; p++) { const lines = []; for (let k = 0; k < 3; k++) lines.push(0.020 + feedR() * 0.02); feedLines.push(lines); }

  // ---------- camera ----------
  const sKeys = [[1.3, -1.72], [2.6, -1.72], [4.3, 0.12], [5.0, 0.18], [6, 1.3], [8, 2.55], [10, 3.55], [12, 4.3], [13, 4.45], [16, 5.62], [18.6, 5.64]];
  const sLin = t => L.key(sKeys, t, f => f);
  const sOut = t => { let a = 0; for (let k = -4; k <= 4; k++) a += sLin(t + k * 0.09); return a / 9; };
  const S_IN0 = 5.64, S_IN1 = -0.62;
  function camAt(t) {
    if (t < 1.3) return { cx: PHX + 0.005, cy: PHY - 0.16, W: L.lerp(0.95, 0.88, t / 1.3) };
    if (t < T_FREEZE + 3) { const s = sOut(Math.min(t, T_FREEZE)), W = Math.pow(10, s);
      const fw = 1 - L.sm(-1.6, 0.0, s), fc = L.sm(2.8, 4.2, s) * (1 - L.sm(4.6, 5.5, s));
      return { cx: WORD.x * fw + cx0 * 0.6 * fc, cy: WORD.y * fw - 0.1 * L.sm(-0.6, 0.1, s) * (1 - L.sm(0.3, 1.2, s)) + cy0 * 0.6 * fc, W }; }
    const f = L.ease.inOut(L.clamp((t - T_IN) / (T_END - T_IN - 0.3), 0, 1)), s = L.lerp(S_IN0, S_IN1, f), W = Math.pow(10, s), W0 = Math.pow(10, S_IN0);
    const tx = PHX + 0.004, ty = PHY - 0.13, g = Math.pow(W / W0, 1.15);
    return { cx: tx + (0 - tx) * g, cy: ty + (0 - ty) * g, W: W * (1 - 0.03 * L.sm(T_END - 0.3, DUR, t)) };
  }

  // ---------- batched particles ----------
  function Batch() { this.p = []; }
  Batch.prototype.add = function (x, y) { this.p.push(x, y); };
  Batch.prototype.fill = function (ctx, rad, col) { if (!this.p.length) return; ctx.fillStyle = col; ctx.beginPath(); for (let i = 0; i < this.p.length; i += 2) { ctx.moveTo(this.p[i] + rad, this.p[i + 1]); ctx.arc(this.p[i], this.p[i + 1], rad, 0, 6.2832); } ctx.fill(); };
  Batch.prototype.ring = function (ctx, rad, col, w) { if (!this.p.length) return; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); for (let i = 0; i < this.p.length; i += 2) { ctx.moveTo(this.p[i] + rad, this.p[i + 1]); ctx.arc(this.p[i], this.p[i + 1], rad, 0, 6.2832); } ctx.stroke(); };

  // ---------- figure (a person as particles) ----------
  function face(ctx, hx, hy, hr, mood, look, litCol, a) {
    ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = '#0b0d12'; ctx.beginPath(); ctx.arc(hx, hy, hr, 0, 6.2832); ctx.fill();
    if (litCol) { const g = ctx.createRadialGradient(hx, hy + hr * 1.1, 0, hx, hy + hr * 1.1, hr * 1.9); g.addColorStop(0, litCol); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(hx, hy, hr, 0, 6.2832); ctx.fill(); }
    // particle outline
    const n = Math.max(14, Math.min(80, Math.round(hr * 0.5))), pr = L.clamp(hr * 0.035, 1.1, 5);
    ctx.fillStyle = '#c7ccd6'; ctx.beginPath(); for (let i = 0; i < n; i++) { const an = i / n * 6.2832, x = hx + Math.cos(an) * hr, y = hy + Math.sin(an) * hr; ctx.moveTo(x + pr, y); ctx.arc(x, y, pr, 0, 6.2832); } ctx.fill();
    if (hr > 16) { const ex = hr * 0.36, ey = hy - hr * 0.08, er = hr * (mood === 'awe' ? 0.11 : 0.085);
      ctx.fillStyle = '#e8ebf0'; [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(hx + d * ex + look[0] * hr * 0.09, ey + look[1] * hr * 0.09, er, 0, 6.2832); ctx.fill(); });
      ctx.strokeStyle = '#e8ebf0'; ctx.lineWidth = Math.max(1.5, hr * 0.06); ctx.lineCap = 'round'; ctx.beginPath(); const my = hy + hr * 0.42;
      if (mood === 'awe') ctx.ellipse(hx, my, hr * 0.09, hr * 0.12, 0, 0, 6.2832);
      else if (mood === 'sad') { ctx.arc(hx, my + hr * 0.16, hr * 0.2, 1.2 * Math.PI, 1.8 * Math.PI); }
      else { ctx.moveTo(hx - hr * 0.16, my); ctx.lineTo(hx + hr * 0.16, my); }
      ctx.stroke(); }
    ctx.restore();
  }
  function shoulders(ctx, x, y, k, a) { const n = 40, pr = L.clamp(k * 0.004, 1, 4); ctx.save(); ctx.globalAlpha = a * 0.8; ctx.fillStyle = '#aab0bb'; ctx.beginPath();
    for (let i = 0; i <= n; i++) { const an = Math.PI + i / n * Math.PI, px = x + Math.cos(an) * 0.26 * k, py = y + 0.33 * k + Math.sin(an) * 0.30 * k; ctx.moveTo(px + pr, py); ctx.arc(px, py, pr, 0, 6.2832); } ctx.fill(); ctx.restore(); }
  function phone(ctx, x, y, k, col, a, { detail = false, word = null, wordCol = '#9aa0aa', typed = 5, glow = 0.5 } = {}) {
    ctx.save(); ctx.globalAlpha = a;
    if (glow > 0 && col) { const g = ctx.createRadialGradient(x, y, 0, x, y, 0.45 * k); g.addColorStop(0, col.replace('1)', (0.28 * glow) + ')')); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(x - 0.45 * k, y - 0.45 * k, 0.9 * k, 0.9 * k); }
    ctx.fillStyle = '#0e1015'; ctx.strokeStyle = '#6d737e'; ctx.lineWidth = Math.max(1, 0.0012 * k); ctx.beginPath(); ctx.roundRect(x - PW / 2 * k, y - PH / 2 * k, PW * k, PH * k, 0.009 * k); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#161a22'; ctx.beginPath(); ctx.roundRect(x - SW / 2 * k, y - SH / 2 * k, SW * k, SH * k, 0.006 * k); ctx.fill();
    if (detail && k * SW > 20) {
      ctx.save(); ctx.beginPath(); ctx.roundRect(x - SW / 2 * k, y - SH / 2 * k, SW * k, SH * k, 0.006 * k); ctx.clip();
      for (let p = 0; p < 5; p++) { const ty = y + (-0.058 + p * 0.029) * k - 0.0125 * k + 0.029 * k * 0; const top = y + (WORD.y - 0.0125 + (p - 1) * 0.029) * k;
        ctx.fillStyle = p === 1 ? '#232833' : '#1d212a'; ctx.beginPath(); ctx.roundRect(x - 0.029 * k, top, 0.058 * k, 0.025 * k, 0.002 * k); ctx.fill();
        ctx.fillStyle = '#3a404b'; ctx.beginPath(); ctx.arc(x - 0.023 * k, top + 0.007 * k, 0.0035 * k, 0, 6.2832); ctx.fill();
        if (k * 0.001 > 0.6) { const pr = Math.max(0.6, 0.00016 * k); ctx.fillStyle = '#4a505b'; ctx.beginPath();
          feedLines[p].forEach((len, li) => { if (p === 1 && li === 1) return; const ly = top + (0.014 + li * 0.0045) * k; for (let s = 0; s < len; s += 0.0009) { const px = x + (-0.026 + s) * k; ctx.moveTo(px + pr, ly); ctx.arc(px, ly, pr, 0, 6.2832); } }); ctx.fill(); } }
      if (word) { const wx = x + WORD.x * k, wy = y + (WORD.y + 0.0017) * k, pr = Math.max(0.5, 0.00019 * k);
        if (wordCol !== '#9aa0aa' && k > 2000) { const g = ctx.createRadialGradient(wx, wy, 0, wx, wy, 0.012 * k); g.addColorStop(0, wordCol === RED ? 'rgba(255,59,48,0.35)' : 'rgba(52,210,123,0.35)'); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.fillRect(wx - 0.012 * k, wy - 0.012 * k, 0.024 * k, 0.024 * k); }
        ctx.fillStyle = wordCol; ctx.beginPath(); word.forEach(([px, py, l]) => { if (l >= typed) return; ctx.moveTo(wx + px * k + pr, wy + py * k); ctx.arc(wx + px * k, wy + py * k, pr, 0, 6.2832); }); ctx.fill(); }
      ctx.restore();
    } else if (col) { ctx.fillStyle = col.replace('1)', '0.55)'); ctx.fillRect(x - SW / 2 * k, y - SH / 2 * k, SW * k, SH * k); }
    ctx.restore();
  }

  // ---------- world renderer ----------
  // cam {cx, cy, W}; vp {x, y, w, h} viewport; mode 'human' | 'ai'
  function world(ctx, cam, h, mode, t, vp = { x: 0, y: 0, w: 1080, h: 1920 }, opt = {}) {
    const k = vp.w / cam.W, ox = vp.x + vp.w / 2, oy = vp.y + vp.h / 2, s = Math.log10(cam.W);
    const px = x => ox + (x - cam.cx) * k, py = y => oy + (y - cam.cy) * k;
    const inV = (x, y, m = 40) => x > vp.x - m && x < vp.x + vp.w + m && y > vp.y - m && y < vp.y + vp.h + m;
    const isG = (i, hr, ht, rai) => h >= ht || (mode === 'ai' && h >= hr + rai);
    // dust: gray people outside the cascade
    const dA = L.sm(3.0, 4.2, s) * (1 - L.sm(4.6, 5.2, s)); if (dA > 0.01) { const b = new Batch(); dustC.forEach(([x, y]) => { const X1 = px(x), Y1 = py(y); if (inV(X1, Y1)) b.add(X1, Y1); }); ctx.globalAlpha = dA * 0.5; b.fill(ctx, 1.2, '#6b717c'); ctx.globalAlpha = 1; }
    const nA = L.sm(4.6, 5.3, s); if (nA > 0.01) { const b = new Batch(); dustN.forEach(([x, y]) => { const X1 = px(x), Y1 = py(y); if (inV(X1, Y1)) b.add(X1, Y1); }); ctx.globalAlpha = nA * 0.45; b.fill(ctx, 1.1, '#5d636e'); ctx.globalAlpha = 1; }
    // fact-check links (dotted green particles) and orgs
    const lA = L.sm(4.3, 5.0, s);
    if (lA > 0.01) {
      casc.forEach(c => { const lt = mode === 'ai' ? c.linkAI : c.link, grow = mode === 'ai' ? 0.3 : 0.9; const f = L.clamp((h - (lt - grow)) / grow, 0, 1); if (f <= 0) return;
        const x1 = px(c.org.x), y1 = py(c.org.y), x2 = px(c.x), y2 = py(c.y), ex = L.lerp(x1, x2, f), ey = L.lerp(y1, y2, f), len = Math.hypot(ex - x1, ey - y1);
        ctx.globalAlpha = lA * 0.75; ctx.fillStyle = GREEN; ctx.beginPath(); for (let d = 0; d < len; d += 9) { const u = d / Math.max(1, Math.hypot(x2 - x1, y2 - y1)), qx = L.lerp(x1, x2, u), qy = L.lerp(y1, y2, u); ctx.moveTo(qx + 1.4, qy); ctx.arc(qx, qy, 1.4, 0, 6.2832); } ctx.fill();
        if (f >= 1) { ctx.globalAlpha = lA * 0.8; ctx.strokeStyle = GREEN; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(x2, y2, Math.max(12, 13e3 * k), 0, 6.2832); ctx.stroke(); }
        ctx.globalAlpha = 1; });
    }
    const oA = L.sm(3.6, 4.4, s); if (oA > 0.01) orgs.forEach(g => { const X1 = px(g.x), Y1 = py(g.y); if (!inV(X1, Y1)) return; ctx.globalAlpha = oA;
      const gr = ctx.createRadialGradient(X1, Y1, 0, X1, Y1, 34); gr.addColorStop(0, 'rgba(52,210,123,0.5)'); gr.addColorStop(1, 'rgba(52,210,123,0)'); ctx.fillStyle = gr; ctx.fillRect(X1 - 34, Y1 - 34, 68, 68);
      ctx.fillStyle = GREEN; ctx.beginPath(); ctx.moveTo(X1, Y1 - 9); ctx.lineTo(X1 + 9, Y1); ctx.lineTo(X1, Y1 + 9); ctx.lineTo(X1 - 9, Y1); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; });
    // other cascades
    if (s > 4.2) { const gA = L.sm(4.2, 4.8, s); const gray = new Batch(), red = new Batch(), grn = new Batch(), core = new Batch(), gOnly = new Batch();
      for (let i = 0; i < OX.length; i++) { const X1 = px(OX[i]), Y1 = py(OY[i]); if (!inV(X1, Y1, 10)) continue; const c = casc[OC[i]];
        const r = h >= OR[i], g = isG(i, OR[i], OT[i], c.rai); if (g) { grn.add(X1, Y1); if (r) core.add(X1, Y1); else gOnly.add(X1, Y1); } else (r ? red : gray).add(X1, Y1); }
      ctx.globalAlpha = gA; gray.fill(ctx, 1.3, 'rgba(150,156,168,0.6)'); red.fill(ctx, 3.2, 'rgba(255,59,48,0.14)'); red.fill(ctx, 1.5, RED);
      grn.fill(ctx, 4.5, 'rgba(52,210,123,0.14)'); grn.ring(ctx, 2.1, GREEN, 1.3); core.fill(ctx, 1.0, RED); gOnly.fill(ctx, 1.4, GREEN); ctx.globalAlpha = 1; }
    // our cascade: edges
    const edgeW = L.clamp(k * 0.012, 0.8, 5), eA = 0.55 * (1 - 0.6 * L.sm(4.4, 5.2, s));
    ctx.lineCap = 'round';
    const heads = new Batch();
    ctx.strokeStyle = RED; ctx.lineWidth = edgeW; ctx.globalAlpha = eA; ctx.beginPath();
    for (let i = 1; i < N; i++) { const p = par[i], g = Math.min(0.5, hR[i] - hR[p] + 0.05), f = L.clamp((h - (hR[i] - g)) / g, 0, 1); if (f <= 0) continue;
      const x1 = px(X[p]), y1 = py(Y[p]), x2 = L.lerp(x1, px(X[i]), f), y2 = L.lerp(y1, py(Y[i]), f);
      if (Math.max(x1, x2) < -50 || Math.min(x1, x2) > vp.x + vp.w + 50 || Math.max(y1, y2) < vp.y - 50 || Math.min(y1, y2) > vp.y + vp.h + 50) continue;
      ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); if (f < 1) heads.add(x2, y2); }
    ctx.stroke(); ctx.globalAlpha = 1; heads.fill(ctx, edgeW * 2.2, 'rgba(255,90,80,0.9)');
    // truth edges (green, slow)
    ctx.strokeStyle = GREEN; ctx.lineWidth = edgeW * 0.9; ctx.globalAlpha = 0.5; ctx.beginPath(); const gheads = new Batch();
    for (let i = 0; i < N; i++) { const p = tpar[i]; if (p < 0) continue; const g = Math.min(2.5, hT[i] - hT[p] + 0.1), f = L.clamp((h - (hT[i] - g)) / g, 0, 1); if (f <= 0) continue;
      const x1 = px(X[p]), y1 = py(Y[p]), x2 = L.lerp(x1, px(X[i]), f), y2 = L.lerp(y1, py(Y[i]), f); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); if (f < 1) gheads.add(x2, y2); }
    ctx.stroke(); ctx.globalAlpha = 1; gheads.fill(ctx, edgeW * 2, GREEN);
    // our cascade: people as dots, fading into figures when close
    const figA = L.sm(4, 14, 0.1 * k), dotA = 1 - figA;
    const dotR = L.clamp(0.28 * k, 1.5, 7) * (s > 4.9 ? 0.8 : 1);
    { const gray = new Batch(), red = new Batch(), grn = new Batch(), core = new Batch(), gOnly = new Batch();
      for (let i = 0; i < N; i++) { const X1 = px(X[i]), Y1 = py(Y[i]); if (!inV(X1, Y1, 20)) continue; const r = h >= hR[i], g = isG(i, hR[i], hT[i], casc[0].rai);
        if (g) { grn.add(X1, Y1); if (r) core.add(X1, Y1); else gOnly.add(X1, Y1); } else (r ? red : gray).add(X1, Y1); }
      ctx.globalAlpha = dotA; gray.fill(ctx, dotR, 'rgba(150,156,168,0.7)'); red.fill(ctx, dotR * 2.6, 'rgba(255,59,48,0.13)'); red.fill(ctx, dotR, RED);
      const spk = s > 2.2 && s < 5 ? 1 : 0.5; grn.fill(ctx, dotR * 5, `rgba(52,210,123,${0.10 * spk})`); grn.ring(ctx, spk === 1 ? Math.max(11, dotR * 3.5) : dotR * 2.2, GREEN, Math.max(2, dotR * 0.5)); if (spk === 1) grn.fill(ctx, 26, 'rgba(52,210,123,0.12)');
      core.fill(ctx, dotR * 0.8, RED); gOnly.fill(ctx, dotR, GREEN); ctx.globalAlpha = 1; }
    if (figA > 0.01) {
      for (let i = 0; i < N; i++) { const X1 = px(X[i]), Y1 = py(Y[i]); if (!inV(X1, Y1, 0.6 * k)) continue;
        const r = h >= hR[i], g = isG(i, hR[i], hT[i], casc[0].rai); const col = g ? 'rgba(52,210,123,1)' : r ? 'rgba(255,59,48,1)' : 'rgba(150,156,168,1)';
        shoulders(ctx, X1, Y1 - 0.02 * k, k, figA);
        const litCol = g ? 'rgba(52,210,123,0.55)' : r ? 'rgba(255,59,48,0.55)' : 'rgba(170,176,188,0.25)';
        const mood = i === P ? (opt.mood || 'flat') : (r ? 'glazed' : 'flat');
        const look = i === P ? (opt.look || [0, 1]) : [0, 1];
        face(ctx, X1 + 0.004 * k, Y1 - 0.27 * k, 0.1 * k, mood === 'glazed' ? 'flat' : mood, look, litCol, figA);
        const typed = i === 0 ? (opt.typed ?? 5) : 5;
        const wordCol = i === 0 ? (h >= 0 ? RED : '#9aa0aa') : (i === P ? GREEN : null);
        phone(ctx, X1, Y1, k, col, figA, { detail: i === 0 || i === P, word: i === 0 ? WP : i === P ? WP2 : null, wordCol, typed, glow: i === 0 && h < 0 ? 0.2 : 1 }); }
    }
  }
  // close-scale atmosphere: out-of-focus lights of other people, red share = red share of the cascade
  function atmosphere(ctx, cam, h, t) {
    const s = Math.log10(cam.W), a = 1 - L.sm(0.3, 1.2, s); if (a <= 0.01) return; const share = L.logistic(Math.max(0, h), D_RED, S0), hasSent = h >= 0;
    ctx.save(); bokeh.forEach((b, i) => { const isRed = hasSent && b.red < share, x = (b.x * 1300 - 110) + Math.sin(t * 0.2 + i) * 6, y = b.y * 2100 - 90, r = b.r * (0.7 + 0.5 * b.z);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r); const c = isRed ? '255,59,48' : '150,156,168'; g.addColorStop(0, `rgba(${c},${(isRed ? 0.22 : 0.07) * a})`); g.addColorStop(1, `rgba(${c},0)`); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); });
    if (hasSent) { const g = ctx.createRadialGradient(540, 960, 500, 540, 960, 1250); g.addColorStop(0, 'rgba(255,59,48,0)'); g.addColorStop(1, `rgba(255,59,48,${0.32 * share * a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920); }
    ctx.restore(); }

  // ---------- text ----------
  const fade = (t, a, b, f = 0.3) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));
  function card(ctx, lines, y, size, a) {
    if (a <= 0) return; ctx.save(); ctx.font = `${size}px "${SERIF}"`; const mw = Math.max(...lines.map(l => ctx.measureText(typeof l === 'string' ? l : l.text).width)); ctx.restore();
    const fs = mw * 1.06 > 780 ? size * 780 / (mw * 1.06) : size; const hh = fs * (lines.length * 1.05 + 0.9);
    ctx.save(); ctx.globalAlpha = a; const g = ctx.createLinearGradient(0, y - fs * 1.2, 0, y - fs * 1.2 + hh); g.addColorStop(0, 'rgba(5,6,10,0)'); g.addColorStop(0.25, 'rgba(5,6,10,0.72)'); g.addColorStop(0.75, 'rgba(5,6,10,0.72)'); g.addColorStop(1, 'rgba(5,6,10,0)'); ctx.fillStyle = g; ctx.fillRect(0, y - fs * 1.2, 1080, hh); ctx.restore();
    ctx.save(); ctx.translate(-50, 0); L.title(ctx, lines, y, fs, { alpha: a }); ctx.restore(); }
  function tag(ctx, text, x, y, a, col = '#c9ced8') { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.font = `44px "${HAND}"`; ctx.textAlign = 'left'; const w = ctx.measureText(text).width;
    ctx.fillStyle = 'rgba(5,6,10,0.8)'; ctx.fillRect(x, y - 42, w + 36, 58); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.strokeRect(x, y - 42, w + 36, 58); ctx.fillStyle = col; ctx.fillText(text, x + 18, y); ctx.restore(); }
  const LEVELS = [[-1.45, 'one word'], [-1.0, 'one post'], [-0.5, 'one feed'], [0.9, 'one person'], [2.3, 'one street'], [4.95, 'one city'], [99, 'a nation']];
  function gauge(ctx, s, a) { if (a <= 0) return; let idx = LEVELS.findIndex(l => s < l[0]); ctx.save(); ctx.globalAlpha = a;
    for (let i = 0; i < LEVELS.length; i++) { const x = 104 + i * 38, on = i === idx; ctx.fillStyle = on ? '#fffdf7' : 'rgba(200,205,215,0.3)'; ctx.beginPath(); ctx.arc(x, 1482, on ? 7 : 4.5, 0, 6.2832); ctx.fill(); }
    ctx.font = `46px "${HAND}"`; ctx.textAlign = 'left'; ctx.fillStyle = '#e8e4da'; ctx.fillText(LEVELS[idx][1], 90, 1450); ctx.restore(); }

  // ---------- panels (snap) ----------
  const TOPP = { x: 0, y: 150, w: 1080, h: 760 }, BOTP = { x: 0, y: 1010, w: 1080, h: 760 };
  function panel(ctx, vp, h, mode, t) { ctx.save(); ctx.beginPath(); ctx.rect(vp.x, vp.y, vp.w, vp.h); ctx.clip(); ctx.fillStyle = BG; ctx.fillRect(vp.x, vp.y, vp.w, vp.h);
    world(ctx, { cx: 20e3, cy: 10e3, W: 420e3 }, h, mode, t, vp); ctx.restore();
    ctx.save(); ctx.strokeStyle = 'rgba(200,205,215,0.5)'; ctx.lineWidth = 2; ctx.strokeRect(vp.x + 1, vp.y + 1, vp.w - 2, vp.h - 2);
    ctx.fillStyle = 'rgba(200,205,215,0.25)'; ctx.fillRect(80, vp.y + vp.h - 34, 820, 6); ctx.fillStyle = mode === 'ai' ? GREEN : '#e8e4da'; ctx.fillRect(80, vp.y + vp.h - 34, 820 * h / TRUE_H, 6); ctx.restore(); }

  function draw(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    if (t < T_SNAP) {
      const cam = camAt(t), h = t < 1.3 ? RED_H : t < T_FREEZE ? hRace(t) : H_FREEZE, s = Math.log10(cam.W);
      const typed = t < 1.3 ? 5 : Math.floor(L.clamp((t - 1.5) / 0.32, 0, 5));
      atmosphere(ctx, cam, h, t);
      world(ctx, cam, h, 'human', t, undefined, { typed, mood: 'awe', look: [-0.4, 0.2] });
      if (t >= T0 && t < T0 + 0.25) { ctx.fillStyle = `rgba(255,59,48,${0.3 * (1 - L.sm(T0, T0 + 0.25, t))})`; ctx.fillRect(0, 0, 1080, 1920); }
      if (t >= 1.3 && t < 1.42) { ctx.fillStyle = `rgba(255,255,255,${0.3 * (1 - L.sm(1.3, 1.42, t))})`; ctx.fillRect(0, 0, 1080, 1920); }
      if (t >= T_FREEZE) { ctx.fillStyle = `rgba(5,6,10,${0.62 * L.sm(T_FREEZE, T_FREEZE + 0.5, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
      L.slate(ctx, t < 1.3 ? 'SC0  COLD OPEN (FLASH-FORWARD)  CLOSE' : t < 2.7 ? 'SC1  EXTREME CLOSE' : t < 16 ? 'SC2  CONTINUOUS ZOOM OUT' : t < T_FREEZE ? 'SC3  WIDE HOLD' : 'FREEZE');
      if (t < 1.3) { tag(ctx, 'later', 80, 300, 1); card(ctx, ['She already knew.'], 450, 104, 1); }
      gauge(ctx, s, fade(t, 1.4, T_FREEZE, 0.3));
      card(ctx, ['One word.'], 450, 110, fade(t, 1.5, 3.3));
      card(ctx, ['The truth was', { text: 'already here.', col: GREEN }], 400, 96, fade(t, 8.9, 11.3));
      card(ctx, ['Too far apart.'], 430, 104, fade(t, 11.7, 14.0));
      card(ctx, [{ text: 'Fact-checks:', col: GREEN }, '13 hours behind.'], 400, 96, fade(t, 15.6, 18.5));
      card(ctx, ['We slowed it down', 'so you could see it.'], 900, 92, fade(t, 18.8, 21.0));
    } else if (t < T_IN) {
      const h = hSnap(t);
      panel(ctx, TOPP, h, 'human', t); panel(ctx, BOTP, h, 'ai', t);
      L.slate(ctx, 'SC4  SNAP  LOCKED WIDE');
      const la = L.sm(T_SNAP, T_SNAP + 0.2, t);
      tag(ctx, 'as it happened', 80, 240, la); tag(ctx, 'AI-routed (illustrative)', 80, 1100, la, GREEN);
      if (t < T_SNAP + 0.15) { ctx.fillStyle = `rgba(255,255,255,${0.2 * (1 - L.sm(T_SNAP, T_SNAP + 0.15, t))})`; ctx.fillRect(0, 0, 1080, 1920); }
      card(ctx, [{ text: 'Truth: 60 hours.', col: GREEN }], 985, 84, fade(t, 26.3, 28.2));
      card(ctx, ['Speed is not belief.'], 985, 84, fade(t, 28.3, 29.95));
    } else if (t < T_END) {
      const cam = camAt(t), h = H_FREEZE, s = Math.log10(cam.W);
      atmosphere(ctx, cam, h, t);
      world(ctx, cam, h, 'human', t, undefined, { mood: 'sad', look: [-0.6, 0.5] });
      ctx.fillStyle = `rgba(5,6,10,${1 - L.sm(T_IN, T_IN + 0.35, t)})`; ctx.fillRect(0, 0, 1080, 1920);
      L.slate(ctx, 'SC5  CONTINUOUS ZOOM IN  CLOSER');
      gauge(ctx, s, fade(t, T_IN + 0.2, T_END - 0.8, 0.3));
      card(ctx, ['This is', 'the bottleneck.'], 420, 110, fade(t, 31.9, T_END, 0.35));
    } else {
      const cam = camAt(T_END - 0.001); atmosphere(ctx, cam, H_FREEZE, t); world(ctx, cam, H_FREEZE, 'human', t, undefined, { mood: 'sad', look: [-0.6, 0.5] });
      L.endCard(ctx, L.sm(T_END, T_END + 0.5, t), { line: 'The bottleneck is us.' });
    }
    L.grain(ctx, t, { alpha: 0.035, n: 260 });
  }

  const lastAI = Math.max(...casc.map((c, i) => 0)), ourLink = casc[0].link;
  return { draw, DUR,
    acts: [{ start: 0, end: T0, bpm: 0, drone: true }, { start: T0, end: T_FREEZE, bpm: 0, drone: true }, { start: T_REPLAY, end: T_IN, bpm: 0, drone: true }, { start: T_IN, end: DUR, bpm: 0, drone: true }],
    cues: [{ t: 1.3, type: 'stamp' }, ...[0, 1, 2, 3, 4].map(i => ({ t: 1.5 + i * 0.32, type: 'pop' })), { t: T0, type: 'ding' }, { t: 5.0, type: 'whoosh' }, { t: T0 + ourLink, type: 'pop' }, { t: T_SNAP, type: 'hit' }, { t: T_REPLAY + TRUE_H / SNAP_RATE, type: 'ding' }, { t: T_IN, type: 'whoosh' }, { t: 31.9, type: 'hit' }],
    _debug: { D_RED, D_TRUE, ourLink, nCasc: casc.length, hRP: hR[P], P: [PHX, PHY], c0: [cx0, cy0], linkedAtFreeze: casc.filter(c => c.link <= H_FREEZE).length } };
}
module.exports = makeScene;
