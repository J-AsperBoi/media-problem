// the-orchestra: wait-for-it, ink wash, music, nation. Analog: heatwave-2003.
// Mapping: race 1 s = 1 day (day = t - 1.5, days 0..19). Cold open = day 11.5 (the peak). Snap: 19 days in 4.5 s.
// Red: L.logistic fitted through the sourced endpoints (0 at day 0, 1 at day 19), midpoint at the sourced peak (day 11.5):
// k = ln(99)/7.5, doubling 1.13 d, normalized. rho = 4 s(1-s) drives the red wash AND the tempo of every bow
// (strokes/s = 0.6 + 1.4 rho). Chairs empty when E crosses thresholds (symbolic). Green: two-sided lognormal from
// p10/median/p90 (9.5/12/305). AI: ai_counterfactual median 3 d, illustrative. See output/the-orchestra/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const { createCanvas } = require('@napi-rs/canvas');
  const A = L.loadAnalog('heatwave-2003');
  const DUR = 40, RED = L.RED, GREEN = L.GREEN;
  const PAPER = '#c8c1b1', INK = '#1c1b19', PALE = '#ece6d6';
  const ink = a => `rgba(28,27,25,${a.toFixed(3)})`, rgbaR = a => `rgba(255,59,48,${a.toFixed(3)})`, rgbaG = a => `rgba(52,210,123,${a.toFixed(3)})`;
  const pap = a => `rgba(200,193,177,${a.toFixed(3)})`;

  // ---------- data ----------
  const DEND = A.threat.points[A.threat.points.length - 1].t; // 19
  const PEAK = 11.5; // sourced: daily excess > 1,000 on days 11 and 12
  const kk = Math.log(99) / (DEND - PEAK), DBL = Math.LN2 / kk, S0 = Math.exp(-kk * PEAK) / (1 + Math.exp(-kk * PEAK));
  const raw = d => L.logistic(d, DBL, S0), R0 = raw(0), R1 = raw(DEND);
  const E = d => L.clamp((raw(d) - R0) / (R1 - R0), 0, 1);
  const rho = d => { const s = raw(L.clamp(d, 0, DEND)); return 4 * s * (1 - s); };
  const f = d => 0.6 + 1.4 * rho(d); // bow strokes per film second = the fitted heat curve
  const AG = A.solution.aggregation, MED = AG.median, P10 = AG.p10, P90 = AG.p90;
  const SLO = Math.log(MED / P10) / 1.2816, SHI = Math.log(P90 / MED) / 1.2816;
  const zOf = q => { let lo = -8, hi = 8; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; (0.5 * (1 + L.erf(m / Math.SQRT2)) < q) ? lo = m : hi = m; } return (lo + hi) / 2; };
  const hq = q => { const z = zOf(q); return MED * Math.exp(z * (z < 0 ? SLO : SHI)); };
  const AIM = A.ai_counterfactual.aggregation_median, aq = q => hq(q) * AIM / MED;
  const QS = [0.06, 0.2, 0.35, 0.5, 0.65, 0.8, 0.9, 0.95];
  const HUM = QS.map(hq), AIA = QS.map(aq); // 9.0 10.3 11.2 12.0 31.7 100 305 763 ; x 3/12
  const FLY = 0.6; // days for a page to travel down its line (drawing only)

  // stroke phase = integral of f over days
  const STEP = 0.01, PH = [0];
  for (let i = 1; i <= DEND / STEP + 1; i++) PH[i] = PH[i - 1] + STEP * f((i - 0.5) * STEP);
  const phDay = d => { d = L.clamp(d, 0, DEND); const i = Math.floor(d / STEP), fr = d / STEP - i; return L.lerp(PH[i], PH[Math.min(i + 1, PH.length - 1)], fr); };
  const T0 = 1.5, TSLOW = 20.5, TBLK = 23.0, TSNAP = 23.6, SN0 = 24.4, SNL = 4.5, TIN = 31.0, TEND = 36.0;
  const phase = t => {
    if (t < T0) return 100 + f(PEAK) * t;
    const d = t - T0; if (d <= DEND) return phDay(d);
    return phDay(DEND) + f(DEND) * (d - DEND);
  };
  const bowOf = ph => { const n = Math.floor(ph), fr = L.ease.inOut(ph - n); return (n % 2 === 0) ? fr : 1 - fr; };
  const pulseOf = ph => Math.exp(-(ph - Math.floor(ph)) * 5);

  // ---------- world ----------
  const P0 = [540, 1400], DESK = [540, 1335], COND = [540, 1470];
  const rnd = L.rng(2003);
  const players = [];
  for (let i = 0; i < 6; i++) {
    const R = 230 + 85 * i, n = 8 + 3 * i;
    for (let j = 0; j < n; j++) {
      const th = L.lerp(160, 20, (j + 0.5) / n) * Math.PI / 180;
      players.push({ id: players.length, row: i, j, n, th, x: P0[0] + R * Math.cos(th), y: P0[1] - R * Math.sin(th) * 0.8, s: 0.5, gone: 99, holder: -1, seed: 10 + players.length });
    }
  }
  const pick = (row, frac) => players.find(p => p.row === row && p.j === Math.min(p.n - 1, Math.round(frac * (p.n - 1))));
  const her = players.filter(p => p.row === 1).reduce((a, b) => Math.abs(a.th - 118 * Math.PI / 180) < Math.abs(b.th - 118 * Math.PI / 180) ? a : b);
  const nb = players.find(p => p.row === 1 && p.j === her.j + 1);
  const HOLD = [pick(3, 0.8), pick(4, 0.22), pick(2, 0.62), her, pick(5, 0.55), pick(5, 0.92), pick(0, 0.88), pick(4, 0.04)];
  HOLD.forEach((p, k) => p.holder = k);
  const LABELS = { 1: 'a neighbor with a key', 3: 'a doctor', 5: 'a forecaster' };
  // 14 of 93 chairs empty at evenly spaced E thresholds (symbolic share; timing = curve). Neighbor gets 0.532.
  const TH = []; for (let k = 0; k < 14; k++) TH.push(0.08 + k * 0.84 / 13);
  nb.gone = TH[7];
  const pool = players.filter(p => p.holder < 0 && p !== nb && Math.abs(p.x - her.x) + Math.abs(p.y - her.y) > 60);
  TH.forEach((th, k) => { if (k === 7) return; let p; do { p = pool[Math.floor(rnd() * pool.length)]; } while (p.gone < 99); p.gone = th; });
  const order = players.slice().sort((a, b) => a.y - b.y);
  const slot = k => { const c = k % 4, r = Math.floor(k / 4); return [DESK[0] - 56 + (c + 0.5) * 28, DESK[1] - 24 + (r + 0.5) * 24]; };
  const pageAt = p => [p.x + 25 * p.s, p.y - 46 * p.s];

  // nation: other halls
  const NC = [540, 1250], NR = 1850;
  const outline = []; for (let i = 0; i < 16; i++) { const a = i / 16 * Math.PI * 2; const r = NR * (0.86 + 0.28 * L.noise(i * 0.9, 7)); outline.push([NC[0] + Math.cos(a) * r, NC[1] + Math.sin(a) * r * 1.05]); }
  const halls = []; let guard = 0;
  while (halls.length < 36 && guard++ < 5000) {
    const a = rnd() * Math.PI * 2, r = Math.sqrt(rnd()) * NR * 0.86, x = NC[0] + Math.cos(a) * r, y = NC[1] + Math.sin(a) * r;
    if (Math.hypot(x - 540, y - 1130) < 950) continue;
    if (halls.some(h => Math.hypot(h.x - x, h.y - y) < 470)) continue;
    const k = 0.75 + rnd() * 0.35, lamps = [];
    [[150, 7], [220, 10], [290, 13]].forEach(([R, n]) => { for (let j = 0; j < n; j++) { const th = L.lerp(160, 20, (j + 0.5) / n) * Math.PI / 180; lamps.push({ dx: R * k * Math.cos(th), dy: -R * k * Math.sin(th) * 0.8, gone: rnd() < 0.15 ? 0.08 + rnd() * 0.84 : 99, green: -1 }); } });
    const g1 = Math.floor(rnd() * lamps.length); let g2 = Math.floor(rnd() * lamps.length); if (g2 === g1) g2 = (g1 + 5) % lamps.length;
    [g1, g2].forEach(gi => { lamps[gi].gone = 99; lamps[gi].green = hq(0.03 + rnd() * 0.94); lamps[gi].ph = rnd() * 6; });
    halls.push({ x, y, k, lamps });
  }
  const blobs = [{ x: 540, y: 820, r: 1100, w: 1 }, { x: 180, y: 1150, r: 700, w: 0.7 }, { x: 920, y: 1050, r: 800, w: 0.8 }];
  for (let i = 0; i < 26; i++) { const a = rnd() * 6.283, r = Math.sqrt(rnd()) * NR; blobs.push({ x: NC[0] + Math.cos(a) * r, y: NC[1] + Math.sin(a) * r, r: 600 + rnd() * 500, w: 0.5 + rnd() * 0.5 }); }

  // ---------- textures ----------
  const paper = createCanvas(1080, 1920), px = paper.getContext('2d');
  px.fillStyle = PAPER; px.fillRect(0, 0, 1080, 1920);
  const tr = L.rng(77);
  for (let i = 0; i < 70; i++) { const x = tr() * 1080, y = tr() * 1920, r = 80 + tr() * 320, g = px.createRadialGradient(x, y, 0, x, y, r); const dark = tr() < 0.6;
    g.addColorStop(0, dark ? 'rgba(60,55,48,0.07)' : 'rgba(245,240,228,0.08)'); g.addColorStop(1, 'rgba(0,0,0,0)'); px.fillStyle = g; px.fillRect(x - r, y - r, 2 * r, 2 * r); }
  px.strokeStyle = 'rgba(60,55,48,0.07)'; px.lineWidth = 1;
  for (let i = 0; i < 500; i++) { const x = tr() * 1080, y = tr() * 1920, a = tr() * 6.28, l = 6 + tr() * 22; px.beginPath(); px.moveTo(x, y); px.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); px.stroke(); }
  const vig = createCanvas(1080, 1920), vx = vig.getContext('2d');
  { const g = vx.createRadialGradient(540, 960, 500, 540, 960, 1250); g.addColorStop(0, 'rgba(20,19,17,0)'); g.addColorStop(1, 'rgba(20,19,17,0.55)'); vx.fillStyle = g; vx.fillRect(0, 0, 1080, 1920); }

  // ---------- camera ----------
  const HX = her.x + 30, HY = her.y - 30, NX = nb.x - 18, NY = nb.y - 26;
  const CAM = [
    [0, [HX, HY, 7]], [T0, [HX, HY, 7]], [6.5, [HX + 3, HY - 3, 7.3]], [8.5, [540, 1080, 0.78]], [9.5, [540, 1080, 0.78]],
    [10.7, [540, 1300, 0.27]], [11.8, [540, 1300, 0.27]], [12.8, [540, 1110, 0.86]], [14.2, [540, 1110, 0.86]],
    [16.0, [NX, NY, 9.5]], [TSLOW, [NX, NY + 2, 10]], [TBLK, [NX, NY + 2, 10.1]],
  ];
  const CAMIN = [[TIN, [540, 1110, 0.86]], [TIN + 3, [540, DESK[1] + 5, 5.2]], [TEND, [540, DESK[1] + 5, 5.5]]];
  const camAt = t => { const ks = t < TIN ? CAM : CAMIN; const v = L.key(ks, t); return v; };
  const coldEase = t => t; // cold open is locked

  // ---------- drawing helpers ----------
  const line = (ctx, x1, y1, x2, y2, w, col, seed, jit = 0.6) => L.sketchLine(ctx, x1, y1, x2, y2, { w, col, seed, jitter: jit });
  function face(ctx, x, y, s, mood, look) {
    const hx = x, hy = y - 70 * s;
    ctx.beginPath(); ctx.arc(hx, hy, 13 * s, 0, 6.283); ctx.fillStyle = '#d9d2c2'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = 2.2 * s; ctx.stroke();
    ctx.fillStyle = INK; [-1, 1].forEach(dd => { ctx.beginPath(); ctx.arc(hx + dd * 4.6 * s + look[0] * 1.8 * s, hy - 2 * s + look[1] * 1.6 * s, 1.6 * s, 0, 6.283); ctx.fill(); });
    ctx.lineWidth = 1.6 * s; ctx.beginPath();
    if (mood === 'sad') { ctx.arc(hx + look[0] * 1.2 * s, hy + 8.5 * s, 3.6 * s, 1.15 * Math.PI, 1.85 * Math.PI); ctx.moveTo(hx - 8 * s, hy - 6 * s); ctx.lineTo(hx - 3 * s, hy - 8.5 * s); ctx.moveTo(hx + 8 * s, hy - 6 * s); ctx.lineTo(hx + 3 * s, hy - 8.5 * s); }
    else { ctx.moveTo(hx - 3.5 * s + look[0] * s, hy + 6 * s); ctx.lineTo(hx + 3.5 * s + look[0] * s, hy + 6 * s); }
    ctx.stroke();
  }
  function glow(ctx, x, y, r, a) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, rgbaG(0.55 * a)); g.addColorStop(1, rgbaG(0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, 2 * r, 2 * r); }
  function lamp(ctx, x, y, r, lit, pulse) {
    if (lit > 0.01) { const R = r * (3.2 + 1.2 * pulse), g = ctx.createRadialGradient(x, y, 0, x, y, R); g.addColorStop(0, `rgba(255,250,232,${(0.55 * lit).toFixed(3)})`); g.addColorStop(1, 'rgba(255,250,232,0)'); ctx.fillStyle = g; ctx.fillRect(x - R, y - R, 2 * R, 2 * R); }
    ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fillStyle = lit > 0.5 ? '#fffbea' : '#2a2825'; ctx.fill(); ctx.strokeStyle = INK; ctx.lineWidth = r * 0.35; ctx.stroke();
  }
  function page(ctx, x, y, w, h, fill, s) { ctx.save(); ctx.translate(x, y); ctx.rotate(-0.08); ctx.fillStyle = fill; ctx.fillRect(-w / 2, -h / 2, w, h); ctx.strokeStyle = INK; ctx.lineWidth = 1.4 * s; ctx.strokeRect(-w / 2, -h / 2, w, h); ctx.restore(); }

  function drawPlayer(ctx, p, d, ph, tt, zs, arrs) {
    const s = p.s, x = p.x, y = p.y, alive = 1 - L.sm(p.gone, p.gone + 0.035, E(d));
    const pulse = pulseOf(ph);
    const [pgx, pgy] = pageAt(p);
    const hasPage = p.holder >= 0 && d < arrs[p.holder];
    if (zs < 0.2) { // far LOD
      ctx.fillStyle = ink(0.8 * alive + 0.15); ctx.beginPath(); ctx.arc(x, y - 55 * s, 11 * s, 0, 6.283); ctx.fill();
      if (hasPage) { glow(ctx, pgx, pgy, 40 * s, 1); ctx.fillStyle = GREEN; ctx.fillRect(pgx - 14 * s, pgy - 11 * s, 28 * s, 22 * s); }
      lamp(ctx, x + 26 * s, y - 62 * s, 5 * s, alive, pulse); return;
    }
    ctx.fillStyle = ink(0.07); ctx.beginPath(); ctx.ellipse(x, y + 20 * s, 30 * s, 8 * s, 0, 0, 6.283); ctx.fill();
    const w = 2.3 * s, sd = p.seed;
    // chair
    line(ctx, x - 13 * s, y - 42 * s, x + 13 * s, y - 42 * s, w, INK, sd); line(ctx, x - 13 * s, y - 42 * s, x - 13 * s, y + 22 * s, w, INK, sd + 1);
    line(ctx, x + 13 * s, y - 42 * s, x + 13 * s, y + 22 * s, w, INK, sd + 2); line(ctx, x - 15 * s, y, x + 15 * s, y, w * 1.3, INK, sd + 3);
    if (alive > 0.01) {
      ctx.save(); ctx.globalAlpha *= alive;
      ctx.fillStyle = ink(0.16); ctx.beginPath(); ctx.moveTo(x - 9 * s, y - 2 * s); ctx.lineTo(x - 10 * s, y - 52 * s); ctx.lineTo(x + 10 * s, y - 52 * s); ctx.lineTo(x + 9 * s, y - 2 * s); ctx.fill();
      line(ctx, x, y - 2 * s, x, y - 56 * s, w * 1.2, INK, sd + 4);
      line(ctx, x - 5 * s, y, x - 7 * s, y + 22 * s, w, INK, sd + 5); line(ctx, x + 5 * s, y, x + 7 * s, y + 22 * s, w, INK, sd + 6);
      const mine = p === her, look = mine ? (d >= 12.3 ? [1, 0.3] : [0.6, 0.9]) : [L.clamp((540 - x) / 400, -1, 1), 1];
      const mood = mine && d >= 12.3 ? 'sad' : (p.gone < 99 && E(d) > p.gone - 0.06 ? 'sad' : 'flat');
      face(ctx, x, y, s, mood, look);
      // violin + bow (all bows share one phase)
      const vx = x - 13 * s, vy = y - 50 * s; ctx.save(); ctx.translate(vx, vy); ctx.rotate(-0.45);
      ctx.beginPath(); ctx.ellipse(0, 0, 9 * s, 4.5 * s, 0, 0, 6.283); ctx.fillStyle = ink(0.55); ctx.fill(); ctx.restore();
      line(ctx, x - 5 * s, y - 50 * s, x - 25 * s, y - 43 * s, w, INK, sd + 7);
      const b = bowOf(ph), ax = Math.cos(0.3), ay = Math.sin(0.3), bc = [vx + 4 * s + ax * (b - 0.5) * 28 * s, vy - 2 * s + ay * (b - 0.5) * 28 * s];
      line(ctx, bc[0] - ax * 24 * s, bc[1] - ay * 24 * s, bc[0] + ax * 24 * s, bc[1] + ay * 24 * s, 1.5 * s, INK, sd + 8, 0.2);
      line(ctx, x + 5 * s, y - 50 * s, bc[0] + ax * 22 * s, bc[1] + ay * 22 * s, w, INK, sd + 9);
      ctx.restore();
    }
    // stand + page + lamp
    line(ctx, x + 25 * s, y + 22 * s, x + 25 * s, y - 38 * s, w, INK, sd + 10);
    if (hasPage) { glow(ctx, pgx, pgy, 34 * s, 0.8 + 0.2 * pulse); page(ctx, pgx, pgy, 26 * s, 20 * s, GREEN, s); }
    else page(ctx, pgx, pgy, 26 * s, 20 * s, alive > 0.5 ? PALE : '#3a3833', s);
    lamp(ctx, x + 26 * s, y - 62 * s, 3.4 * s, alive, pulse);
  }

  function drawStand(ctx, d, arrs, missingGlow) {
    // conductor's desk: the gray summer program, with green pieces laid on top as they arrive
    const [dx, dy] = DESK;
    line(ctx, dx, dy + 25, dx, dy + 75, 3, INK, 501);
    ctx.fillStyle = '#8d877a'; ctx.fillRect(dx - 60, dy - 28, 120, 56); ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.strokeRect(dx - 60, dy - 28, 120, 56);
    line(ctx, dx, dy - 28, dx, dy + 28, 1.6, INK, 502, 0.3);
    ctx.save(); ctx.font = `8px "${HAND}"`; ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.fillText('SUMMER PROGRAM', dx, dy - 31); ctx.restore();
    for (let k = 0; k < 8; k++) {
      const [sx, sy] = slot(k), arrived = d >= arrs[k] + FLY;
      if (arrived) { glow(ctx, sx, sy, 22, 0.6); ctx.fillStyle = GREEN; ctx.fillRect(sx - 12.5, sy - 10.5, 25, 21); ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.strokeRect(sx - 12.5, sy - 10.5, 25, 21); }
      else if (missingGlow > 0) { ctx.save(); ctx.setLineDash([3, 2.5]); ctx.strokeStyle = rgbaG(0.9 * missingGlow); ctx.lineWidth = 1.2; ctx.strokeRect(sx - 12.5, sy - 10.5, 25, 21); ctx.restore(); }
    }
  }

  function drawConductor(ctx, ph) {
    const [x, y] = COND, s = 0.72, w = 2.6 * s, b = bowOf(ph);
    ctx.fillStyle = ink(0.1); ctx.beginPath(); ctx.ellipse(x, y + 40 * s, 40 * s, 10 * s, 0, 0, 6.283); ctx.fill();
    ctx.fillStyle = ink(0.75); ctx.beginPath(); ctx.moveTo(x - 16 * s, y); ctx.lineTo(x - 18 * s, y - 66 * s); ctx.lineTo(x + 18 * s, y - 66 * s); ctx.lineTo(x + 16 * s, y); ctx.fill();
    line(ctx, x - 7 * s, y, x - 8 * s, y + 40 * s, w * 1.3, INK, 601); line(ctx, x + 7 * s, y, x + 8 * s, y + 40 * s, w * 1.3, INK, 602);
    ctx.beginPath(); ctx.arc(x, y - 82 * s, 14 * s, 0, 6.283); ctx.fillStyle = INK; ctx.fill();
    const hx = x + 34 * s, hy = y - 96 * s + (1 - b) * 26 * s; // baton hand rides the same beat
    line(ctx, x + 16 * s, y - 62 * s, hx, hy, w * 1.2, INK, 603);
    line(ctx, hx, hy, hx + 26 * s, hy - 22 * s + b * 10 * s, 1.4 * s, INK, 604, 0.1);
    line(ctx, x - 16 * s, y - 62 * s, x - 30 * s, y - 88 * s + b * 10 * s, w * 1.2, INK, 605);
  }

  // one hall; used full-size in the world and scaled in the snap panels
  function drawHall(ctx, d, arrs, ph, tt, zoom, vis, opts = {}) {
    const [px0, py0] = P0;
    ctx.fillStyle = ink(0.06); ctx.beginPath(); ctx.ellipse(px0, py0, 720, 576, 0, Math.PI, 2 * Math.PI); ctx.fill();
    ctx.lineCap = 'butt';
    for (let i = 0; i < 6; i++) { const R = 230 + 85 * i; ctx.strokeStyle = ink(0.055); ctx.lineWidth = 60; ctx.beginPath(); ctx.ellipse(px0, py0, R, R * 0.8, 0, Math.PI + 0.25, 2 * Math.PI - 0.25); ctx.stroke(); }
    ctx.strokeStyle = ink(0.08); ctx.lineWidth = 130; ctx.beginPath(); ctx.ellipse(px0, py0, 800, 640, 0, Math.PI + 0.05, 2 * Math.PI - 0.05); ctx.stroke();
    ctx.strokeStyle = ink(0.5); ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(px0, py0, 730, 584, 0, Math.PI + 0.05, 2 * Math.PI - 0.05); ctx.stroke();
    const zs = zoom * 0.5;
    order.forEach(p => { if (vis && (p.x < vis[0] - 60 || p.x > vis[2] + 60 || p.y < vis[1] - 60 || p.y > vis[3] + 60)) return; drawPlayer(ctx, p, d, ph, tt, zs, arrs); });
    // green lines toward the podium: reach and break until the page's day, then the page travels down the line
    HOLD.forEach((p, k) => {
      const [ax, ay] = pageAt(p), [bx, by] = slot(k), a = arrs[k];
      if (d < a) {
        const reach = 0.18 + 0.34 * (0.5 + 0.5 * Math.sin(tt * 1.6 + k * 2.3)) * (0.6 + 0.4 * L.noise(tt * 0.8, k));
        const ex = L.lerp(ax, bx, reach), ey = L.lerp(ay, by, reach);
        L.sketchLine(ctx, ax, ay, ex, ey, { w: 3.2 / Math.max(zoom, 0.35) * 0.9, col: rgbaG(0.9), seed: 300 + k, jitter: 2 });
        ctx.fillStyle = rgbaG(0.5); ctx.beginPath(); ctx.arc(L.lerp(ax, bx, reach + 0.04), L.lerp(ay, by, reach + 0.04), 2.5 / Math.max(zoom, 0.35), 0, 6.283); ctx.fill();
      } else {
        const fa = 1 - L.sm(a + FLY, a + FLY + 1.2, d);
        if (fa > 0) L.sketchLine(ctx, ax, ay, bx, by, { w: 3.2 / Math.max(zoom, 0.35) * 0.9, col: rgbaG(0.9 * fa), seed: 300 + k, jitter: 2 });
        const fp = L.clamp((d - a) / FLY, 0, 1);
        if (fp < 1) { const e = L.ease.inOut(fp), x = L.lerp(ax, bx, e), y = L.lerp(ay, by, e) - Math.sin(e * Math.PI) * 30; glow(ctx, x, y, 24, 1); ctx.fillStyle = GREEN; ctx.fillRect(x - 12, y - 10, 24, 20); }
      }
    });
    drawStand(ctx, d, arrs, opts.missing || 0);
    drawConductor(ctx, ph);
  }

  function drawNation(ctx, d, ph, tt, vis) {
    ctx.strokeStyle = ink(0.07); ctx.lineWidth = 90; ctx.lineJoin = 'round'; ctx.beginPath(); outline.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.stroke();
    ctx.strokeStyle = ink(0.45); ctx.lineWidth = 9; ctx.stroke();
    const pulse = pulseOf(ph);
    halls.forEach((h, hi) => {
      if (vis && (h.x < vis[0] - 400 || h.x > vis[2] + 400 || h.y < vis[1] - 400 || h.y > vis[3] + 400)) return;
      ctx.lineCap = 'butt';
      [150, 220, 290].forEach(R => { ctx.strokeStyle = ink(0.07); ctx.lineWidth = 55; ctx.beginPath(); ctx.ellipse(h.x, h.y, R * h.k, R * h.k * 0.8, 0, Math.PI + 0.25, 2 * Math.PI - 0.25); ctx.stroke(); });
      ctx.strokeStyle = ink(0.4); ctx.lineWidth = 5; ctx.beginPath(); ctx.ellipse(h.x, h.y, 340 * h.k, 272 * h.k, 0, Math.PI + 0.05, 2 * Math.PI - 0.05); ctx.stroke();
      h.lamps.forEach((lp, li) => {
        const x = h.x + lp.dx, y = h.y + lp.dy;
        if (lp.green > 0) {
          const pod = [h.x, h.y - 10];
          if (d < lp.green) { const reach = 0.2 + 0.3 * (0.5 + 0.5 * Math.sin(tt * 1.5 + lp.ph));
            ctx.strokeStyle = rgbaG(0.85); ctx.lineWidth = 7; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(L.lerp(x, pod[0], reach), L.lerp(y, pod[1], reach)); ctx.stroke();
            glow(ctx, x, y, 60, 1); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(x, y, 17, 0, 6.283); ctx.fill(); }
          else { glow(ctx, pod[0], pod[1], 60, 1); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(pod[0], pod[1], 17, 0, 6.283); ctx.fill(); lamp(ctx, x, y, 12, 1, pulse); }
          return;
        }
        const alive = 1 - L.sm(lp.gone, lp.gone + 0.035, E(d)); lamp(ctx, x, y, 12, alive, pulse);
      });
      ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(h.x, h.y + 10, 9, 0, 6.283); ctx.fill();
    });
  }

  function redWash(ctx, d, vis) {
    const A0 = 0.46 * rho(d); if (A0 < 0.004) return;
    blobs.forEach(b => {
      if (vis && (b.x + b.r < vis[0] || b.x - b.r > vis[2] || b.y + b.r < vis[1] || b.y - b.r > vis[3])) return;
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r); g.addColorStop(0, rgbaR(A0 * b.w)); g.addColorStop(0.6, rgbaR(A0 * b.w * 0.55)); g.addColorStop(1, rgbaR(0));
      ctx.fillStyle = g; const x0 = Math.max(b.x - b.r, vis ? vis[0] : -1e9), y0 = Math.max(b.y - b.r, vis ? vis[1] : -1e9), x1 = Math.min(b.x + b.r, vis ? vis[2] : 1e9), y1 = Math.min(b.y + b.r, vis ? vis[3] : 1e9);
      ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    });
  }

  function world(ctx, t, d, ph, cam, missing) {
    const [cx, cy, z] = cam, vis = [cx - 540 / z, cy - 960 / z, cx + 540 / z, cy + 960 / z];
    ctx.save(); ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-cx, -cy);
    redWash(ctx, d, vis);
    drawNation(ctx, d, ph, t, vis);
    drawHall(ctx, d, HUM, ph, t, z, vis, { missing });
    ctx.restore();
    // ceiling heat bleeding down (same rho), only when we are inside the hall
    const wz = L.sm(0.5, 1.2, z), r = rho(d);
    if (wz * r > 0.01) { const g = ctx.createLinearGradient(0, 0, 0, 900); g.addColorStop(0, rgbaR(0.62 * r * wz)); g.addColorStop(1, rgbaR(0)); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 900); }
    // role labels at the wide shots (screen space)
    const la = L.sm(0.55, 0.75, z) * (1 - L.sm(1.3, 2.2, z)) * (t > 7.5 && t < 15 ? 1 : 0);
    if (la > 0.01) Object.entries(LABELS).forEach(([k, txt]) => {
      const p = HOLD[+k]; if (d >= HUM[+k] + FLY) return; const [ax, ay] = pageAt(p);
      const sx = 540 + (ax - cx) * z, sy = 960 + (ay - cy) * z - 34;
      const x = L.clamp(sx, 200, 780);
      ctx.save(); ctx.globalAlpha = la; ctx.font = `38px "${HAND}"`; ctx.textAlign = 'center'; ctx.lineWidth = 9; ctx.strokeStyle = pap(0.9); ctx.lineJoin = 'round';
      ctx.strokeText(txt, x, sy); ctx.fillStyle = '#12492c'; ctx.fillText(txt, x, sy); ctx.restore();
    });
  }

  function card(ctx, lines, y, size, a, col = INK, halo = pap(0.85)) {
    if (a <= 0.005) return;
    ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center'; let yy = y;
    lines.forEach((l, i) => { const o = typeof l === 'string' ? { text: l } : l, fz = o.size || size; if (i) yy += fz * 1.08;
      ctx.font = `${fz}px "${SERIF}"`; ctx.lineJoin = 'round'; ctx.lineWidth = fz * 0.2; ctx.strokeStyle = o.halo || halo; ctx.strokeText(o.text, 540, yy);
      ctx.fillStyle = o.col || col; ctx.fillText(o.text, 540, yy); });
    ctx.restore();
  }
  const win = (t, a, b) => L.sm(a, a + 0.25, t) * (1 - L.sm(b - 0.25, b, t));
  const CARDS = [
    [-1, T0, ['Watch the', { text: 'green page.', col: '#0f6b3a' }], 330, 118],
    [1.7, 3.9, ['Every bow', 'on the same beat.'], 330, 104],
    [4.1, 6.4, ["Her page can't", 'reach the podium.'], 330, 104],
    [7.8, 10.2, ['Perfect time.', 'Wrong score.'], 330, 110],
    [10.4, 12.3, ['Every hall.', 'The same beat.'], 300, 104],
    [12.4, 13.6, ['Wait for it.'], 330, 118],
    [13.6, 15.5, ['Day 12.', 'The plan arrives.'], 330, 110],
    [15.6, 17.6, ['After the peak.'], 330, 110],
    [17.8, 20.4, ['Some lamps were', 'already out.'], 330, 100],
  ];

  function snapPanel(ctx, t, y0, arrs, dl, title, sub, arrDay, isAI) {
    const X0 = 80, W = 920, H = 560;
    ctx.save(); ctx.fillStyle = PAPER; ctx.fillRect(X0, y0, W, H); ctx.beginPath(); ctx.rect(X0, y0, W, H); ctx.clip();
    const sc = 0.56, ph = phDay(dl);
    ctx.save(); ctx.translate(540, y0 + 268); ctx.scale(sc, sc); ctx.translate(-540, -1160);
    redWash(ctx, dl, null); drawHall(ctx, dl, arrs, ph, t, sc, null); ctx.restore();
    // heat strip (same fitted curve in both lanes)
    const sx0 = 110, sx1 = 890, sy = y0 + H - 18, sh = 70, X = dd => L.lerp(sx0, sx1, dd / DEND);
    ctx.fillStyle = pap(0.8); ctx.fillRect(X0, sy - sh - 14, W, sh + 32);
    ctx.fillStyle = rgbaR(0.85); ctx.beginPath(); ctx.moveTo(X(0), sy);
    for (let dd = 0; dd <= dl; dd += 0.1) ctx.lineTo(X(dd), sy - sh * rho(dd)); ctx.lineTo(X(dl), sy); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = ink(0.5); ctx.lineWidth = 2; ctx.beginPath(); for (let dd = 0; dd <= DEND; dd += 0.1) { const yy = sy - sh * rho(dd); dd ? ctx.lineTo(X(dd), yy) : ctx.moveTo(X(dd), yy); } ctx.stroke();
    ctx.strokeStyle = INK; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X(dl), sy + 6); ctx.lineTo(X(dl), sy - sh - 8); ctx.stroke();
    if (dl >= arrDay) { ctx.fillStyle = GREEN; ctx.fillRect(X(arrDay) - 5, sy - sh - 12, 10, sh + 18); }
    ctx.restore();
    ctx.strokeStyle = ink(0.8); ctx.lineWidth = 4; ctx.strokeRect(X0, y0, W, H);
    // labels (>= 44px, inside x 80-900)
    ctx.save(); ctx.fillStyle = pap(0.88); ctx.fillRect(X0, y0, W, 70); ctx.restore();
    L.label(ctx, title, 106, y0 + 52, 50, { col: isAI ? '#0f6b3a' : INK, align: 'left' });
    if (sub) L.label(ctx, sub, 890, y0 + 52, 44, { col: '#3a3833', align: 'right' });
    const ta = L.sm(arrDay / DEND * SNL + SN0 + 0.1, arrDay / DEND * SNL + SN0 + 0.4, t);
    if (ta > 0) L.label(ctx, isAI ? 'before the peak' : 'after the peak', 890, y0 + H - 110, 44, { col: INK, align: 'right', alpha: ta });
  }

  function draw(ctx, t) {
    ctx.drawImage(paper, 0, 0);
    if (t < TBLK) {
      const d = t < T0 ? PEAK : Math.min(t - T0, DEND), ph = phase(t), cam = camAt(t);
      world(ctx, t, d, ph, cam, 0);
      ctx.drawImage(vig, 0, 0);
      CARDS.forEach(([a, b, lines, y, size]) => card(ctx, lines, y, size, a < 0 ? (1 - L.sm(b - 0.12, b, t)) : win(t, a, b)));
      if (t < T0) { L.label(ctx, 'flash-forward: the peak', 540, 590, 44, { col: '#3a3833', alpha: 0.9 }); }
      if (t >= T0 && t < T0 + 0.25) { ctx.fillStyle = `rgba(236,230,214,${(1 - (t - T0) / 0.25).toFixed(3)})`; ctx.fillRect(0, 0, 1080, 1920); }
      if (t >= TSLOW) { const k = L.sm(TSLOW, TSLOW + 0.6, t); ctx.fillStyle = `rgba(18,17,15,${(0.78 * k).toFixed(3)})`; ctx.fillRect(0, 0, 1080, 1920);
        card(ctx, ['We slowed it down', 'so you could see it.'], 820, 96, win(t, TSLOW + 0.2, TBLK), PALE, 'rgba(18,17,15,0.8)'); }
      const sl = t < T0 ? 'SC1 CLOSE  cold open' : t < 6.5 ? 'SC2 CLOSE  eye level' : t < 9.5 ? 'SC3 CRANE UP  hall' : t < 11.8 ? 'SC4 CRANE UP  nation' : t < 14.2 ? 'SC5 DROP DOWN  hall' : t < TSLOW ? 'SC6 DROP DOWN  CLOSE++' : 'SLOW';
      L.slate(ctx, sl);
    } else if (t < TSNAP) {
      ctx.fillStyle = '#121110'; ctx.fillRect(0, 0, 1080, 1920);
    } else if (t < TIN) {
      ctx.fillStyle = '#121110'; ctx.fillRect(0, 0, 1080, 1920);
      const dl = L.clamp((t - SN0) / SNL * DEND, 0, DEND);
      card(ctx, ['Same days. Full speed.'], 268, 76, L.sm(TSNAP, TSNAP + 0.3, t), PALE, 'rgba(18,17,15,0.8)');
      snapPanel(ctx, t, 320, HUM, dl, 'People: day 12', null, HUM[3], false);
      snapPanel(ctx, t, 940, AIA, dl, 'Frontier AI: day 3', 'illustrative', AIA[3], true);
      L.label(ctx, 'same red in both', 540, 1560, 44, { col: '#a8a294', alpha: L.sm(29, 29.5, t) });
      L.slate(ctx, 'SC7 SNAP  true speed vs illustrative');
      if (t < TSNAP + 0.12) { ctx.fillStyle = `rgba(255,255,255,${(0.5 * (1 - (t - TSNAP) / 0.12)).toFixed(3)})`; ctx.fillRect(0, 0, 1080, 1920); }
      if (t > TIN - 0.4) { ctx.fillStyle = `rgba(18,17,15,${L.sm(TIN - 0.4, TIN, t).toFixed(3)})`; ctx.fillRect(0, 0, 1080, 1920); }
    } else if (t < TEND) {
      const ph = phase(T0 + DEND + 3.5 + (t - TIN)), cam = camAt(t);
      world(ctx, t, DEND, ph, cam, L.sm(TIN + 1.5, TIN + 2.5, t));
      ctx.drawImage(vig, 0, 0);
      card(ctx, ['The score was', 'already here.'], 330, 108, win(t, TIN + 0.5, TIN + 2.7));
      card(ctx, ['This is', 'the bottleneck.'], 330, 116, win(t, TIN + 2.9, TEND + 0.3));
      L.slate(ctx, 'SC8 DOLLY IN+  podium');
      if (t < TIN + 0.5) { ctx.fillStyle = `rgba(18,17,15,${(1 - L.sm(TIN, TIN + 0.5, t)).toFixed(3)})`; ctx.fillRect(0, 0, 1080, 1920); }
    } else {
      ctx.fillStyle = '#0d1118'; ctx.fillRect(0, 0, 1080, 1920);
      L.endCard(ctx, L.sm(TEND, TEND + 0.4, t), { line: 'The bottleneck is us.' });
    }
    L.grain(ctx, t, { alpha: 0.05, n: 500 });
  }

  // ---------- sound: drone + one pulse on the same stroke phase as the bows ----------
  const cues = [];
  { let n = Math.floor(phase(0)) + 1; for (let t = 0; t < TBLK; t += 1 / 300) { if (Math.abs(t - T0) < 1 / 600) n = Math.floor(phase(t)) + 1; if (phase(t) >= n) { cues.push({ t: +t.toFixed(3), type: 'bonk' }); n++; } } }
  cues.push({ t: T0, type: 'whoosh' }, { t: 6.6, type: 'whoosh' }, { t: 9.6, type: 'whoosh' }, { t: 11.9, type: 'whoosh' }, { t: 14.3, type: 'whoosh' },
    { t: T0 + HUM[3], type: 'ding' }, { t: T0 + HUM[3] + FLY, type: 'stamp' }, { t: TSNAP, type: 'hit' },
    { t: SN0 + AIA[3] / DEND * SNL, type: 'ding' }, { t: SN0 + HUM[3] / DEND * SNL, type: 'pop' }, { t: TIN + 3, type: 'hit' }, { t: TEND, type: 'pop' });
  return { draw, DUR, cues,
    acts: [{ start: 0, end: TBLK, bpm: 0, drone: true }, { start: TSNAP, end: TEND, bpm: 0, drone: true }, { start: TEND, end: DUR, bpm: 0, drone: true }] };
}
if (typeof module !== 'undefined') module.exports = makeScene;
