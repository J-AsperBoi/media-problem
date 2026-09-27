// the-rice-committee: mockumentary, stick-figure animatic, cooking. Analog: rice-2008.
// ONE mapping for the race: 1 second = 1 week, week w at t = 2.8 + (w - 12) (weeks 12 -> 35.7, then held).
// Red = price-climb extent, reusing the-warehouse logistic fit through (5.3, 0.01 unverified shape anchor), (29.1, 0.875), (30.6, 1.0):
//   K 1.564, r 0.222/wk, m 28.02, clamped at 1; after the keys meet (wk 31.3) decays with k = ln(1/0.625)/4.4 (sourced June point).
// Green = three keys (stock f1, need f2 from wk 27.3, sign-off part of f4); map threads at two-sided lognormal quantiles.
// Snap = ai_counterfactual.aggregation_median 28.3 (illustrative), 1 s = 7 weeks in both panels. See output/the-rice-committee/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('rice-2008');
  const DUR = 42, RED = L.RED, GREEN = L.GREEN;
  const rgbaG = a => `rgba(52,210,123,${a})`, rgbaR = a => `rgba(255,59,48,${a})`;
  const BG = '#161a21', LINE = '#e8e4da', MID = '#7d838c';

  // ---------- data ----------
  const PTS = A.threat.points;
  const FIT = { K: 1.564, r: 0.222, m: 28.02 };
  const fit = w => FIT.K / (1 + Math.exp(-FIT.r * (w - FIT.m)));
  const AG = A.solution.aggregation;
  const W_DEAL = AG.median, W_NEED = AG.p10, W_AI = A.ai_counterfactual.aggregation_median;
  const W_JUNE = PTS[3].t, E_JUNE = PTS[3].extent;
  const KDEC = Math.log(1 / E_JUNE) / (W_JUNE - W_DEAL);
  const extentAt = (w, deal) => w <= deal ? Math.min(1, fit(w)) : Math.min(1, fit(deal)) * Math.exp(-KDEC * (w - deal));
  const ext = w => extentAt(w, W_DEAL);
  const SLO = Math.log(AG.median / AG.p10) / 1.2816, SHI = Math.log(AG.p90 / AG.median) / 1.2816;
  const zOf = q => { let lo = -8, hi = 8; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; (0.5 * (1 + L.erf(m / Math.SQRT2)) < q) ? lo = m : hi = m; } return (lo + hi) / 2; };
  const aq = q => { const z = zOf(q); return AG.median * Math.exp(z * (z < 0 ? SLO : SHI)); };
  const THREADS = [0.1, 0.3, 0.5, 0.7, 0.9].map((q, i) => ({ q, arr: aq(q), bend: [-420, -180, 0, 220, 460][i] }));

  const T0 = 2.8;
  const weekAt = t => {
    if (t < 1.5) return 30;                                                  // cold open: flash-forward
    if (t < T0) return L.lerp(30, 12, L.ease.inOut((t - 1.5) / (T0 - 1.5))); // labeled rewind
    return Math.min(W_JUNE, 12 + (t - T0));
  };
  const tOfW = w => T0 + (w - 12);
  const T_NEED = tOfW(W_NEED), T_DEAL = tOfW(W_DEAL);

  // ---------- world: a gray map with three rooms far apart ----------
  const SC = 0.28;
  const ROOMS = [
    { id: 'A', cx: 820, cy: 1500, wall: '#2b3038', role: 'the stock' },
    { id: 'B', cx: 2420, cy: 2700, wall: '#2e3036', role: 'the need' },
    { id: 'C', cx: 1000, cy: 4200, wall: '#2a2e33', role: 'the sign-off' },
  ];
  const rp = (R, lx, ly) => [R.cx + (lx - 540) * SC, R.cy + (ly - 960) * SC];
  const R0 = L.rng(2008);
  const blobs = ROOMS.map((R, k) => { const pts = [], n = 36, rr = 520 + R0() * 120; for (let i = 0; i < n; i++) { const a = i / n * Math.PI * 2, j = 0.72 + L.noise(i * 0.55, 20 + k) * 0.55; pts.push([R.cx + Math.cos(a) * rr * j * 1.1, R.cy + Math.sin(a) * rr * j * 1.35]); } return pts; });
  const sacks = Array.from({ length: 10 }, (_, i) => ({ x: (i < 5 ? 150 : 930) + (R0() - 0.5) * 60, y: 1250 - (i % 5) * 70 - R0() * 10, r: 60 + R0() * 18 }));

  // ---------- helpers ----------
  const cardA = (t, a, b) => (a <= 0 ? 1 : L.sm(a, a + 0.25, t)) * (1 - L.sm(b - 0.25, b, t));
  function card(c, lines, y, t, a, b, size = 92) { const al = cardA(t, a, b); if (al > 0) L.title(c, lines, y, size, { alpha: al }); }
  function lowerThird(c, who, role, t, a, b) {
    const al = cardA(t, a, b); if (al <= 0) return; c.save(); c.globalAlpha = al;
    c.fillStyle = 'rgba(13,17,24,0.82)'; c.fillRect(70, 1372, 640, 128); c.fillStyle = MID; c.fillRect(70, 1372, 8, 128);
    c.font = `44px "${HAND}"`; c.fillStyle = '#b9bec6'; c.textAlign = 'left'; c.fillText(who, 100, 1420);
    c.font = `58px "${SERIF}"`; c.fillStyle = '#fffdf7'; c.fillText('holds ' + role, 100, 1480); c.restore();
  }
  function key(c, x, y, size, ang, green, alpha = 1) {
    c.save(); c.globalAlpha *= alpha; c.translate(x, y); c.rotate(ang);
    const col = green ? GREEN : '#8a9099';
    if (green) { c.shadowColor = rgbaG(0.9); c.shadowBlur = size * 0.45; }
    c.fillStyle = green ? GREEN : 'rgba(0,0,0,0)'; c.strokeStyle = col; c.lineWidth = size * 0.07;
    // bow
    c.beginPath(); c.arc(0, 0, size * 0.26, 0, Math.PI * 2); c.arc(0, 0, size * 0.1, 0, Math.PI * 2, true); green ? c.fill() : c.stroke();
    // shaft + teeth
    c.beginPath(); c.rect(size * 0.22, -size * 0.055, size * 0.78, size * 0.11); c.rect(size * 0.72, size * 0.05, size * 0.09, size * 0.16); c.rect(size * 0.88, size * 0.05, size * 0.09, size * 0.22);
    green ? c.fill() : c.stroke(); c.restore();
  }
  // wall chart: x = week 0..40, y = extent. Pure function of w (and a deal week).
  function redLine(c, w, deal, X, Y, width, glow) {
    c.save(); c.strokeStyle = RED; c.lineWidth = width; c.lineCap = 'round'; c.lineJoin = 'round'; c.shadowColor = rgbaR(0.8); c.shadowBlur = glow;
    c.beginPath(); for (let k = 0; k <= 400; k++) { const wk = Math.min(w, k * 0.1); c[k ? 'lineTo' : 'moveTo'](X(wk), Y(extentAt(wk, deal))); if (k * 0.1 >= w) break; } c.stroke();
    c.fillStyle = RED; c.beginPath(); c.arc(X(w), Y(extentAt(w, deal)), width * 1.3, 0, 7); c.fill(); c.restore();
  }

  // ---------- one room, local coords 1080x1920 ----------
  function room(c, R, w, t, o = {}) {
    const e = ext(w);
    c.fillStyle = R.wall; c.fillRect(0, 0, 1080, 1920);
    // chart frame + grid on the back wall
    const cx0 = 110, cx1 = 970, cy0 = 250, cy1 = 1080;
    c.fillStyle = '#23272e'; c.fillRect(cx0, cy0, cx1 - cx0, cy1 - cy0);
    for (let i = 1; i < 5; i++) { L.sketchLine(c, cx0, cy0 + i * (cy1 - cy0) / 5, cx1, cy0 + i * (cy1 - cy0) / 5, { w: 2, col: '#3a404a', seed: i + 40, jitter: 1 }); }
    L.sketchLine(c, cx0, cy1, cx1, cy1, { w: 5, col: MID, seed: 3 }); L.sketchLine(c, cx0, cy0, cx0, cy1, { w: 5, col: MID, seed: 4 });
    // props
    if (R.id === 'A') sacks.forEach((s, i) => L.sketchCircle(c, s.x, s.y, s.r, { w: 4, col: '#5b616b', seed: 60 + i, fill: '#3a3f47', jitter: 4 }));
    if (R.id === 'C') { [0, 1, 2].forEach(i => L.sketchLine(c, 0, 1150 + i * 60, 90, 1150 + i * 60, { w: 4, col: '#4a5059', seed: 70 + i })); }
    if (R.id === 'B') { [0, 1].forEach(i => L.sketchLine(c, 985, 1120 + i * 90, 1080, 1120 + i * 90, { w: 5, col: '#4a5059', seed: 80 + i })); }
    // lights go out as the price climbs (loss as absence)
    const dim = 0.55 * L.clamp((e - 0.45) / 0.55, 0, 1);
    if (dim > 0) { c.fillStyle = `rgba(6,8,12,${dim.toFixed(3)})`; c.fillRect(0, 0, 1080, 1920); }
    // red glow on the wall grows with extent
    if (e > 0.05) { const g = c.createRadialGradient(540, cy1 - 760 * e, 20, 540, cy1 - 760 * e, 700); g.addColorStop(0, rgbaR(0.16 * e)); g.addColorStop(1, rgbaR(0)); c.fillStyle = g; c.fillRect(0, 0, 1080, 1920); }
    redLine(c, w, W_DEAL, wk => cx0 + (cx1 - cx0) * wk / 40, ex => cy1 - 20 - 760 * ex, 12, 26);
    // the official
    let mood = 'happy', look = [0, 0], armR = 2.0;
    if (R.id === 'A') { mood = t < 1.5 ? 'bored' : w < 21 ? 'happy' : 'glazed'; if (t > 11.8 && t < 13.6) look = [1, 0]; }
    if (R.id === 'B') { mood = w < 25 ? 'happy' : w < W_DEAL ? 'angry' : w < W_DEAL + 0.8 ? 'awe' : 'sad'; }
    if (R.id === 'C') { mood = w < W_DEAL ? 'bored' : 'happy'; }
    if (o.mood) mood = o.mood;
    const fig = L.stick(c, 540, 1330, 5.2, { pose: { armR, armL: 0.35 }, mood, t, seed: R.id.charCodeAt(0), boil: 1, look, col: LINE });
    const hand = [fig.neck[0] + Math.cos(Math.PI / 2 - armR) * 46 * 5.2, fig.neck[1] + 8 * 5.2 + Math.sin(Math.PI / 2 - armR) * 46 * 5.2];
    // desk
    c.fillStyle = '#1b1f25'; c.fillRect(0, 1320, 1080, 600); L.sketchLine(c, 0, 1322, 1080, 1322, { w: 6, col: MID, seed: 9, t, boil: 1 });
    c.fillStyle = '#2c3139'; c.fillRect(420, 1560, 240, 90); c.font = `70px "${SERIF}"`; c.fillStyle = '#b9bec6'; c.textAlign = 'center'; c.fillText(R.id, 540, 1628);
    if (R.id === 'B') { // bowl: rice per fixed budget, area ~ 300/price (internal only)
      const f = 300 / (300 + 800 * e), rr = 110 * Math.sqrt(f);
      c.fillStyle = '#d9d4c7'; c.beginPath(); c.ellipse(250, 1312, rr, rr * 0.55, 0, Math.PI, 0); c.fill();
      c.strokeStyle = MID; c.lineWidth = 7; c.beginPath(); c.arc(250, 1305, 120, 0, Math.PI); c.stroke(); L.sketchLine(c, 130, 1305, 370, 1305, { w: 7, col: MID, seed: 12 });
    }
    if (R.id === 'C') { c.fillStyle = '#3a3f47'; c.fillRect(800, 1250, 70, 70); c.fillRect(780, 1230, 110, 26); L.sketchCircle(c, 835, 1200, 30, { w: 5, col: MID, seed: 33, fill: '#3a3f47' }); }
    // keys
    const KS = 190, ka = -0.7;
    if (R.id === 'B') {
      const lit = w >= W_NEED; if (w >= W_NEED && w < W_NEED + 0.5) { c.save(); c.globalAlpha = 1 - (w - W_NEED) / 0.5; L.sketchCircle(c, hand[0], hand[1], 60 + 240 * (w - W_NEED), { w: 8, col: GREEN, seed: 5 }); c.restore(); }
      key(c, hand[0], hand[1], KS, ka, lit);
      // the other two keys arrive along the median thread and click in at the deal
      const arr = L.ease.out(L.clamp((w - (W_DEAL - 0.9)) / 0.9, 0, 1));
      if (arr > 0) { key(c, L.lerp(-260, hand[0] - 6, arr), L.lerp(700, hand[1] + 18, arr), KS, ka - 0.35 * arr, true);
        key(c, L.lerp(1340, hand[0] + 6, arr), L.lerp(560, hand[1] - 16, arr), KS, ka + 0.35 * arr, true); }
      if (w >= W_DEAL && w < W_DEAL + 0.6) { c.save(); c.globalAlpha = 1 - (w - W_DEAL) / 0.6; L.sketchCircle(c, hand[0] + 60, hand[1] - 40, 80 + 400 * (w - W_DEAL), { w: 10, col: GREEN, seed: 6 }); c.restore(); }
    } else if (w < W_DEAL - 0.9 || o.keep) key(c, hand[0], hand[1], KS, ka, true);
    else { const f = L.clamp((w - (W_DEAL - 0.9)) / 0.9, 0, 1); key(c, hand[0] + f * 500 * (R.id === 'A' ? 1 : -1), hand[1] - f * 300, KS, ka, true, 1 - f); }
    return hand;
  }

  // ---------- the map ----------
  function bez(p0, p1, p2, f) { const u = 1 - f; return [u * u * p0[0] + 2 * u * f * p1[0] + f * f * p2[0], u * u * p0[1] + 2 * u * f * p1[1] + f * f * p2[1]]; }
  function thread(c, a, b, bend, prog, width, alpha) {
    const mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], dx = b[0] - a[0], dy = b[1] - a[1], dl = Math.hypot(dx, dy); const ctrl = [mid[0] - dy / dl * bend, mid[1] + dx / dl * bend];
    c.save(); c.globalAlpha = alpha; c.strokeStyle = GREEN; c.lineWidth = width; c.lineCap = 'round'; c.shadowColor = rgbaG(0.8); c.shadowBlur = 20; c.setLineDash([width * 2.2, width * 1.6]);
    c.beginPath(); const n = 60; for (let k = 0; k <= n * prog; k++) { const p = bez(a, ctrl, b, k / n); k ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); } c.stroke();
    c.setLineDash([]); const tip = bez(a, ctrl, b, prog); c.fillStyle = GREEN; c.beginPath(); c.arc(tip[0], tip[1], width * 1.4, 0, 7); c.fill(); c.restore();
  }
  function world(c, w, t, zoom) {
    c.fillStyle = BG; c.fillRect(-4000, -4000, 11240, 13760);
    blobs.forEach(pts => { c.fillStyle = '#20252d'; c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fill(); c.strokeStyle = '#2f353f'; c.lineWidth = 10; c.stroke(); });
    // one giant price line under everything: one market, one price
    for (let i = 1; i < 6; i++) { c.fillStyle = '#1f242b'; c.fillRect(200, 5300 - i * 860, 2840, 6); }
    redLine(c, w, W_DEAL, wk => 200 + 2840 * wk / 40, ex => 5300 - 4300 * ex, 40, 60);
    // threads: stock (A) -> need (B), five lognormal quantiles; sign-off (C) -> B at the deal
    const aOut = rp(ROOMS[0], 1080, 1300), bIn = rp(ROOMS[1], 0, 1100), cOut = rp(ROOMS[2], 1080, 700), bIn2 = rp(ROOMS[1], 300, 1920);
    const thAlpha = L.clamp((1 / zoom - 0.5) / 1.5, 0, 1);
    if (thAlpha > 0) {
      THREADS.forEach(th => thread(c, aOut, bIn, th.bend, L.clamp(w / th.arr, 0, 1), 16, thAlpha * (w >= th.arr ? 1 : 0.8)));
      thread(c, cOut, bIn2, 240, L.clamp(w / W_DEAL, 0, 1), 16, thAlpha * 0.8);
    }
    ROOMS.forEach(R => {
      c.save(); c.translate(R.cx - 540 * SC, R.cy - 960 * SC); c.scale(SC, SC);
      c.beginPath(); c.rect(0, 0, 1080, 1920); c.clip(); room(c, R, w, t); c.restore();
      c.save(); c.strokeStyle = '#59606a'; c.lineWidth = 8; c.strokeRect(R.cx - 540 * SC, R.cy - 960 * SC, 1080 * SC, 1920 * SC); c.restore();
      if (thAlpha > 0) { c.save(); c.globalAlpha = thAlpha; c.font = `120px "${HAND}"`; c.textAlign = 'center'; c.fillStyle = '#b9bec6';
        c.fillText(R.role, R.cx, R.cy + 960 * SC + 130); c.restore(); }
    });
    if (thAlpha > 0 && w >= W_NEED) { c.save(); c.globalAlpha = thAlpha * L.sm(W_NEED, W_NEED + 0.3, w); c.strokeStyle = GREEN; c.lineWidth = 14; c.shadowColor = rgbaG(0.9); c.shadowBlur = 40;
      c.strokeRect(ROOMS[1].cx - 540 * SC - 14, ROOMS[1].cy - 960 * SC - 14, 1080 * SC + 28, 1920 * SC + 28); c.restore(); }
  }

  // ---------- camera: map-world, log zoom, handheld noise ----------
  const focusA = rp(ROOMS[0], 540, 900), focusA2 = rp(ROOMS[0], 540, 820), focusB = rp(ROOMS[1], 540, 900), focusC = rp(ROOMS[2], 540, 900);
  const focusBclose = rp(ROOMS[1], 600, 860), focusKeys = rp(ROOMS[1], 770, 930), MAPC = [1620, 2960];
  function move(p0, z0, p1, z1, f) { const z = Math.exp(L.lerp(Math.log(z0), Math.log(z1), f)); const g = (1 / z - 1 / z0) / (1 / z1 - 1 / z0 || 1); return [L.lerp(p0[0], p1[0], g), L.lerp(p0[1], p1[1], g), z]; }
  function cam(t) {
    if (t < 5.8) return [...focusA, 3.9];
    if (t < 8.8) return [...focusB, 3.9];
    if (t < 11.8) return [...focusC, 3.9];
    if (t < 13.6) { const f = L.ease.inOut((t - 11.8) / 1.8); return [L.lerp(focusA[0], focusA2[0], f), L.lerp(focusA[1], focusA2[1], f), L.lerp(3.9, 4.4, f)]; }
    if (t < 19.0) return move(focusA2, 4.4, MAPC, 0.33, L.ease.inOut(L.clamp((t - 13.6) / 3.6, 0, 1)));
    if (t < 25.8) return move(MAPC, 0.33, focusBclose, 5.2, L.ease.inOut(L.clamp((t - 19.0) / 2.3, 0, 1)));
    return [...focusBclose, 5.2];
  }
  const cuts = [5.8, 8.8, 11.8];
  function shoot(c, t, w, keys) {
    const [x, y, z] = keys || cam(t); const amp = 12, hx = (L.noise(t * 1.6, 1) - 0.5) * 2 * amp, hy = (L.noise(t * 1.3, 2) - 0.5) * 2 * amp, hr = (L.noise(t * 0.9, 3) - 0.5) * 0.012;
    let whip = 0; cuts.forEach(ct => { const d = t - ct; if (d > -0.2 && d < 0) whip = -Math.pow((d + 0.2) / 0.2, 2) * 900; if (d >= 0 && d < 0.2) whip = Math.pow(1 - d / 0.2, 2) * 900; });
    c.save(); c.translate(540 + hx + whip, 960 + hy); c.rotate(hr); c.scale(z, z); c.translate(-x, -y); world(c, w, t, z); c.restore();
    if (whip) { c.save(); c.globalAlpha = Math.min(1, Math.abs(whip) / 500) * 0.85; c.fillStyle = BG; c.fillRect(0, 0, 1080, 1920); const r = L.rng(Math.floor(t * 30));
      for (let i = 0; i < 40; i++) { c.fillStyle = `rgba(160,166,176,${0.15 + r() * 0.25})`; c.fillRect(-100 + r() * 400, r() * 1920, 700 + r() * 800, 3 + r() * 10); } c.restore(); }
  }

  // ---------- snap panel ----------
  function panel(c, y0, title, sub, meet, playW, t) {
    const x0 = 90, W = 900, H = 520; c.save(); c.fillStyle = '#1d2229'; c.fillRect(x0, y0, W, H); c.strokeStyle = MID; c.lineWidth = 4; c.strokeRect(x0, y0, W, H); c.beginPath(); c.rect(x0, y0, W, H); c.clip();
    c.font = `50px "${HAND}"`; c.fillStyle = '#fffdf7'; c.textAlign = 'left'; c.fillText(title, x0 + 30, y0 + 64);
    if (sub) { c.font = `46px "${HAND}"`; c.fillStyle = '#b9bec6'; c.fillText(sub, x0 + 30, y0 + 116); }
    const X = wk => x0 + 40 + (W - 80) * (wk - 12) / 28, Y = e => y0 + H - 40 - 300 * e;
    L.sketchLine(c, x0 + 40, y0 + H - 36, x0 + W - 40, y0 + H - 36, { w: 3, col: MID, seed: 7 });
    redLine(c, playW, meet, X, Y, 9, 16);
    // three keys ride the playhead and converge on the meeting week
    const g = L.clamp((playW - 12) / (meet - 12), 0, 1), px = X(Math.min(playW, meet)), my = y0 + H - 90;
    [[-120, true], [0, playW >= W_NEED], [120, true]].forEach(([dy, lit], i) => key(c, px - 30 + i * 6 * g, my + dy * 0.6 * (1 - g) - 40, 70, -0.5 + (i - 1) * 0.3 * g, lit));
    if (playW >= meet) { const a = L.sm(meet, meet + 0.6, playW); c.globalAlpha = a; L.sketchLine(c, X(meet), y0 + 150, X(meet), y0 + H - 36, { w: 5, col: GREEN, seed: 8 });
      c.font = `46px "${HAND}"`; c.fillStyle = GREEN; c.textAlign = X(meet) > x0 + W / 2 ? 'right' : 'left'; c.fillText('keys meet', X(meet) + (X(meet) > x0 + W / 2 ? -16 : 16), y0 + 190); c.globalAlpha = 1; }
    c.restore();
  }

  function draw(ctx, t) {
    const w = weekAt(t);
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    if (t < 28.4) {
      shoot(ctx, t, w);
      if (t > 25.6) { ctx.fillStyle = `rgba(10,12,16,${(0.66 * L.sm(25.6, 26.1, t)).toFixed(3)})`; ctx.fillRect(0, 0, 1080, 1920); }
      // cold open + rewind
      card(ctx, ['Everyone had a key.'], 330, t, 0, 1.5, 100);
      card(ctx, ['Months earlier.'], 330, t, 1.5, T0, 96);
      // interviews
      lowerThird(ctx, 'OFFICIAL A', 'the stock', t, 0.0, 1.5);
      lowerThird(ctx, 'OFFICIAL A', 'the stock', t, 3.0, 5.7);
      card(ctx, ['"We have plenty.', 'Nobody asked."'], 330, t, 3.3, 5.7, 90);
      lowerThird(ctx, 'OFFICIAL B', 'the need', t, 6.0, 8.7);
      card(ctx, ['"We\'ll ask once', 'it\'s official."'], 330, t, 6.2, 8.7, 90);
      lowerThird(ctx, 'OFFICIAL C', 'the sign-off', t, 9.0, 11.7);
      card(ctx, ['"Happy to sign.', 'If asked."'], 330, t, 9.2, 11.7, 90);
      if (t > 11.9 && t < 13.7) { const a = cardA(t, 11.95, 13.6); L.label(ctx, '(off camera)', 540, 300, 44, { alpha: a * 0.8, col: '#b9bec6' }); L.title(ctx, ['Who holds all three?'], 390, 88, { alpha: a }); }
      card(ctx, ['There is no committee.'], 300, t, 14.6, 16.7, 88);
      card(ctx, ['Three rooms. One price.'], 300, t, 16.8, 19.0, 88);
      card(ctx, ['"We asked. Publicly.', 'Still waiting."'], 300, t, 19.6, 22.0, 90);
      card(ctx, ['Week 31.', 'The keys met.'], 300, t, 22.4, 24.4, 100);
      card(ctx, ['Then the price turned.'], 300, t, 24.5, 25.9, 90);
      card(ctx, ['We slowed it down', 'so you could see it.'], 820, t, 26.0, 28.4, 100);
      L.slate(ctx, t < 1.5 ? 'SC1  CLOSE  HANDHELD' : t < T0 ? 'SC1  REWIND' : t < 11.8 ? 'SC2  CLOSE  HANDHELD  INTERVIEW ' + (t < 5.8 ? 'A' : t < 8.8 ? 'B' : 'C') : t < 13.6 ? 'SC2  PUSH IN  A' : t < 19 ? 'SC3  PULL OUT  WIDE' : t < 22.1 ? 'SC4  PUSH IN+  B' : 'SC5  CLOSE+  B');
    } else if (t < 28.8) {
      ctx.fillStyle = '#07080b'; ctx.fillRect(0, 0, 1080, 1920);
    } else if (t < 35.2) {
      const playW = t < 29.2 ? 12 : Math.min(40, 12 + (t - 29.2) * 7);
      const a1 = L.sm(28.8, 29.0, t), a2 = L.sm(28.95, 29.15, t);
      ctx.save(); ctx.globalAlpha = a1; panel(ctx, 250, 'As it happened', null, W_DEAL, playW, t); ctx.restore();
      ctx.save(); ctx.globalAlpha = a2; panel(ctx, 820, 'AI-assisted routing', 'illustrative', W_AI, playW, t); ctx.restore();
      if (t > 33.2) { const a = cardA(t, 33.3, 35.2); L.title(ctx, ['Week 31 vs 28.'], 1420, 96, { alpha: a }); L.label(ctx, '28 is illustrative', 540, 1492, 46, { alpha: a, col: '#b9bec6' }); }
      L.slate(ctx, 'SC6  LOCKED OFF  THE SNAP');
    } else if (t < 37.8) {
      const f = L.ease.inOut((t - 35.2) / 2.6), z = L.lerp(8.5, 10, f);
      shoot(ctx, t, W_JUNE, [focusKeys[0], focusKeys[1], z]);
      card(ctx, ['This is the bottleneck.'], 420, t, 35.5, 37.8, 100);
      L.slate(ctx, 'SC7  EXTREME CLOSE  KEYS');
    }
    if (t >= 37.8) { ctx.fillStyle = '#0d1118'; ctx.fillRect(0, 0, 1080, 1920); L.endCard(ctx, L.sm(37.8, 38.2, t), { line: 'The bottleneck is us.' }); }
    L.grain(ctx, t, { alpha: 0.05, n: 500 });
  }

  return { draw, DUR,
    acts: [{ start: 0, end: 28.4, bpm: 0, drone: true }, { start: 28.8, end: DUR, bpm: 0, drone: true }],
    cues: [{ t: 1.5, type: 'whoosh' }, ...cuts.map(ct => ({ t: ct - 0.1, type: 'whoosh' })), { t: 13.6, type: 'whoosh' }, { t: T_NEED, type: 'ding' },
      { t: 19.0, type: 'whoosh' }, { t: T_DEAL, type: 'pop' }, { t: 28.4, type: 'stamp' },
      { t: 29.2 + (W_AI - 12) / 7, type: 'ding' }, { t: 29.2 + (W_DEAL - 12) / 7, type: 'ding' }, { t: 37.8, type: 'hit' }] };
}
if (typeof module !== 'undefined') module.exports = makeScene;
