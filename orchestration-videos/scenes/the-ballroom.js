// the-ballroom: seamless-loop, paper cutout, dance, nation. Analog: quebec-1989.
// One mapping: film t<3 holds E=0 (the first missed step); then E (s after 02:44) = 10^((t-3)/1.7); frozen at t=17.5.
// Red = logistic fit through the sourced endpoints (1% at t0, 99% at 90 s; doubling 6.78 s). Restore: 83% by 9 h (s3), rest by 24 h (assumed).
// Green = 5 fragments, ribbons arrive at L.lognormalQuantile(q, 759 h, 64000 h), q = .1 .3 .5 .7 .9. Median never on screen.
// Snap: ai_counterfactual (~1 h routing of an existing warning), shown only as "before the stumble", labeled illustrative.
// Loop: dance phase 2*pi*t/1.85, DUR = 37 = 20 turns; the tail redraws the t=0 close shot. See output/the-ballroom/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('quebec-1989');
  const DUR = 37.0, RED = L.RED, GREEN = L.GREEN, BEAT = 1.85;
  const BG = '#111318', CREAM = '#fffdf7';
  const rgbaG = a => `rgba(52,210,123,${a})`, rgbaR = a => `rgba(255,59,48,${a})`;

  // ---------------- time mapping + speed math ----------------
  const T0 = 3.0, K = 1.7, TFREEZE = 17.5;
  const Eat = t => t < T0 ? 0 : Math.pow(10, (Math.min(t, TFREEZE) - T0) / K);
  const tOfE = E => E <= 1 ? T0 : T0 + K * Math.log10(E);
  const FALL_S = A.threat.points[1].t * 3600;                 // 90 s
  let S0 = 0.01, DBL = 6.78;   // set after the floor is built: S0 = one couple (1/N), DBL so share(90 s) = 0.99
  const share = E => L.logistic(E, DBL, S0);
  const shareInv = s => { const r = Math.LN2 / DBL, x = s * (1 - S0) / (1 - s); return Math.log(x / S0) / r; };
  const RESTORE_S = A.threat.events.find(e => e.t === 9).t * 3600; // 9 h -> 83%
  const recoverE = need => need <= 0.83 ? FALL_S + need / 0.83 * (RESTORE_S - FALL_S) : RESTORE_S + (need - 0.83) / 0.17 * (86400 - RESTORE_S);
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;
  const LINK_T = [0.1, 0.3, 0.5, 0.7, 0.9].map(q => tOfE(L.lognormalQuantile(q, MED, P90) * 3600)); // 10.67 .. 17.22
  const phase = t => 2 * Math.PI * t / BEAT - 0.35;

  // ---------------- the floor (a province-shaped ballroom) ----------------
  const FC = [540, 960], RX = 480, RY = 620;
  const rAt = th => 1 + 0.10 * (L.noise(th * 2.2 + 3, 7) - 0.5) * 2 + 0.05 * (L.noise(th * 6.1, 11) - 0.5) * 2;
  const inside = (x, y) => { const dx = (x - FC[0]) / RX, dy = (y - FC[1]) / RY; const th = Math.atan2(dy, dx) + Math.PI; return Math.hypot(dx, dy) < rAt(th) * 0.93; };
  const OUTLINE = []; for (let i = 0; i < 160; i++) { const th = i / 160 * 2 * Math.PI; const rr = rAt(th); OUTLINE.push([FC[0] - Math.cos(th) * RX * rr, FC[1] - Math.sin(th) * RY * rr]); }
  const R = L.rng(1989), S = 34, CP = [];
  for (let row = 0; row * S * 0.866 < 1400; row++) for (let col = 0; col * S < 1000; col++) {
    const x = 40 + col * S + (row % 2) * S / 2 + (R() - 0.5) * 8, y = 260 + row * S * 0.866 + (R() - 0.5) * 8;
    if (inside(x, y)) CP.push({ x, y, j: R() - 0.5, tone: R() }); }
  // protagonist couple: the southern-most couple near the middle
  let P = null; CP.forEach(c => { if (Math.abs(c.x - 560) < 40 && (!P || c.y > P.y)) P = c; });
  // the edge couple that misses the step: behind-left of the protagonist
  let O = null; CP.forEach(c => { if (c === P) return; const d = Math.hypot(c.x - (P.x - 17), c.y - (P.y - 29.4)); if (!O || d < O._d) { O = c; O._d = d; } });
  S0 = 1 / CP.length; DBL = FALL_S / (Math.log((0.99 / 0.01) * (1 - S0) / S0) / Math.LN2);
  if (process.env.BALLROOM_DEBUG) console.log("N", CP.length, "DBL", DBL.toFixed(2));
  // rank = order by distance from O
  const order = CP.map((c, i) => i).sort((a, b) => Math.hypot(CP[a].x - O.x, CP[a].y - O.y) - Math.hypot(CP[b].x - O.x, CP[b].y - O.y));
  order.forEach((i, k) => { CP[i].rank = (k + 0.5) / CP.length; });
  CP.forEach(c => {
    if (c.rank < S0) { c.pre = -1.2 + (c.rank / S0) * 0.6; c.tFall = c.pre; }         // the first 1%: already out at t0
    else { const E = shareInv(c.rank); c.tFall = tOfE(E); }
    c.tRec = tOfE(recoverE(1 - c.rank));
  });
  O.pre = -1.2; O.tFall = -1.2;
  // green fragments: nearest couples to five places; P is the warning (f1)
  const near = (x, y) => { let b = null; CP.forEach(c => { if (c === P || c.frag) return; if (!b || Math.hypot(c.x - x, c.y - y) < Math.hypot(b.x - x, b.y - y)) b = c; }); return b; };
  P.frag = 'f1';
  const F = { f1: P }; [['f3', 850, 860], ['f4', 770, 1290], ['f2', 250, 1060], ['f5', 470, 520]].forEach(([id, x, y]) => { const c = near(x, y); c.frag = id; F[id] = c; });
  const LINKS = [['f3', 'f4'], ['f4', 'f1'], ['f1', 'f2'], ['f2', 'f5'], ['f5', 'f3']].map(([a, b], i) => ({ a: F[a], b: F[b], t: LINK_T[i], seed: i * 13 + 5 }));
  const SORTED = CP.slice().sort((a, b) => a.y - b.y);

  // ---------------- camera ----------------
  const CLOSE = { cx: P.x - 4, cy: P.y, z: 22, tilt: 0.28, k: 0.3, sy0: 1500 };
  const WIDE = { cx: 540, cy: 960, z: 0.85, tilt: 1, k: 0, sy0: 875 };
  const HIGH = { ...WIDE, z: 0.74 };
  const CLOSE2 = { cx: P.x, cy: P.y + 1, z: 30, tilt: 0.3, k: 0.3, sy0: 1560 };
  const mix = (a, b, u) => { const z = Math.exp(L.lerp(Math.log(a.z), Math.log(b.z), u)); const w = (1 / z - 1 / a.z) / (1 / b.z - 1 / a.z);
    const uk = L.ease.inOut(L.clamp(u * 1.25, 0, 1));
    return { z, cx: L.lerp(a.cx, b.cx, w), cy: L.lerp(a.cy, b.cy, w), tilt: L.lerp(a.tilt, b.tilt, uk), k: L.lerp(a.k, b.k, uk), sy0: L.lerp(a.sy0, b.sy0, w) }; };
  const camAt = t => {
    if (t < 2.6) return { ...CLOSE, z: CLOSE.z * (1 + 0.03 * t / 2.6) };
    if (t < 6.2) return mix({ ...CLOSE, z: CLOSE.z * 1.03 }, WIDE, L.ease.inOut((t - 2.6) / 3.6));
    if (t < 11.2) return WIDE;
    if (t < 17.6) return mix(WIDE, HIGH, L.ease.inOut((t - 11.2) / 6.4));
    if (t < 26.5) return HIGH;
    if (t < 29.6) { const u = L.ease.inOut((t - 26.5) / 3.1); return mix(HIGH, CLOSE2, u); }
    return { ...CLOSE2, z: CLOSE2.z * (1 + 0.02 * (t - 29.6)) };
  };
  const proj = (c, x, y) => { const dy = y - c.cy; const den = Math.max(0.08, 1 - c.k * dy / S); const f = 1 / den;
    return [540 + (x - c.cx) * c.z * f, c.sy0 + dy * c.z * c.tilt * f, c.z * f, den]; };

  // ---------------- paper helpers ----------------
  const poly = (ctx, pts, col, sh = 0.35) => {
    if (sh) { ctx.fillStyle = `rgba(0,0,0,${sh})`; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x + 3, y + 4) : ctx.moveTo(x + 3, y + 4)); ctx.closePath(); ctx.fill(); }
    ctx.fillStyle = col; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill(); };
  const disc = (ctx, x, y, r, col, sh = 0.35) => { if (sh) { ctx.fillStyle = `rgba(0,0,0,${sh})`; ctx.beginPath(); ctx.arc(x + r * 0.12 + 1, y + r * 0.16 + 1, r, 0, 7); ctx.fill(); }
    ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); };
  const jit = (pts, u, seed) => pts.map(([x, y], i) => [x + (L.noise(i * 1.3, seed) - 0.5) * 0.5 * u, y + (L.noise(i * 1.7 + 9, seed) - 0.5) * 0.5 * u]);
  const shade = (hex, f) => { const n = parseInt(hex.slice(1), 16); const r = n >> 16, g = (n >> 8) & 255, b = n & 255; const m = (v, bg) => Math.round(bg + (v - bg) * f);
    return `rgb(${m(r, 17)},${m(g, 19)},${m(b, 24)})`; };

  // One cut-paper dancer, feet at (x, y), u = px per world unit (figure is 22 units tall).
  // who: 'w' | 'm'; st: {col:'n'|'red'|'dim', face, mood, rot, ribbon, fade}
  function dancer(ctx, x, y, u, who, st, seed, t) {
    const fd = st.fade ?? 1;
    const pal = st.col === 'red' ? { dress: RED, suit: RED, skin: '#ff8a80', hair: '#b3261e' }
      : st.col === 'dim' ? { dress: '#6e2a26', suit: '#5a2320', skin: '#7d3a35', hair: '#3d1714' }
      : { dress: who === 'w' ? '#d7cfbd' : '#d7cfbd', suit: '#6d6e76', skin: '#e9dfcd', hair: '#4b4741' };
    const P2 = k => shade(k, fd);
    ctx.save(); ctx.translate(x, y); if (st.rot) ctx.rotate(st.rot);
    const s = u;
    if (who === 'w') {
      poly(ctx, jit([[-1.6 * s, -15.5 * s], [1.6 * s, -15.5 * s], [5 * s, -0.2 * s], [-5 * s, -0.2 * s]], s, seed), P2(pal.dress));
      poly(ctx, jit([[-1.2 * s, -16.5 * s], [1.2 * s, -16.5 * s], [1.6 * s, -12.5 * s], [-1.6 * s, -12.5 * s]], s, seed + 1), P2(pal.dress), 0);
    } else {
      poly(ctx, jit([[-1.9 * s, -9 * s], [-0.3 * s, -9 * s], [-0.5 * s, 0], [-1.9 * s, 0]], s, seed), P2(pal.suit));
      poly(ctx, jit([[0.3 * s, -9 * s], [1.9 * s, -9 * s], [1.9 * s, 0], [0.5 * s, 0]], s, seed + 2), P2(pal.suit));
      poly(ctx, jit([[-2.6 * s, -16.5 * s], [2.6 * s, -16.5 * s], [2.2 * s, -8.5 * s], [-2.2 * s, -8.5 * s]], s, seed + 3), P2(pal.suit));
    }
    // arms: one reaching toward the partner (st.reach = -1/1), the other raised when holding a ribbon
    const shY = -15.6 * s; ctx.strokeStyle = P2(who === 'w' ? pal.skin : pal.suit); ctx.lineCap = 'round'; ctx.lineWidth = 1.1 * s;
    const rd = st.reach || 1; ctx.beginPath(); ctx.moveTo(0, shY); ctx.lineTo(rd * 4.2 * s, shY + 2.2 * s); ctx.stroke();
    let hand = null;
    if (st.ribbon) { ctx.beginPath(); ctx.moveTo(0, shY); ctx.lineTo(-rd * 3.2 * s, shY - 3.6 * s); ctx.stroke(); hand = [-rd * 3.2 * s, shY - 3.6 * s]; }
    else { ctx.beginPath(); ctx.moveTo(0, shY); ctx.lineTo(-rd * 2.4 * s, shY + 3.2 * s); ctx.stroke(); }
    // head
    const hx = 0, hy = -19.2 * s, hr = 2.7 * s;
    disc(ctx, hx, hy, hr, P2(pal.skin), 0.3);
    if (st.face) {
      if (who === 'w') { ctx.fillStyle = P2(pal.hair); ctx.beginPath(); ctx.arc(hx, hy - 0.4 * s, hr * 1.02, Math.PI * 1.02, Math.PI * 1.98); ctx.fill(); ctx.beginPath(); ctx.arc(hx + hr * 0.2, hy - hr * 1.05, hr * 0.45, 0, 7); ctx.fill(); }
      else { ctx.fillStyle = P2(pal.hair); ctx.beginPath(); ctx.arc(hx, hy - 0.2 * s, hr * 1.02, Math.PI * 1.05, Math.PI * 1.95); ctx.fill(); }
      if (u > 5) {
        const ink = st.col === 'n' ? P2('#2a2724') : '#3a0d0a', lk = st.look || 0; ctx.fillStyle = ink; ctx.strokeStyle = ink; ctx.lineWidth = Math.max(1.2, 0.28 * s); ctx.lineCap = 'round';
        const ey = hy + 0.1 * s, ex = 0.95 * s;
        [-1, 1].forEach(d => { if (st.mood === 'tender') { ctx.beginPath(); ctx.arc(hx + d * ex + lk * 0.4 * s, ey + 0.1 * s, 0.45 * s, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke(); }
          else { ctx.beginPath(); ctx.arc(hx + d * ex + lk * 0.4 * s, ey, (st.mood === 'panic' ? 0.42 : 0.32) * s, 0, 7); ctx.fill(); } });
        ctx.beginPath(); const my = hy + 1.25 * s;
        if (st.mood === 'panic') ctx.ellipse(hx + lk * 0.3 * s, my + 0.1 * s, 0.35 * s, 0.5 * s, 0, 0, 7);
        else if (st.mood === 'sad') ctx.arc(hx, my + 0.7 * s, 0.7 * s, Math.PI * 1.2, Math.PI * 1.8);
        else ctx.arc(hx + lk * 0.3 * s, my - 0.35 * s, 0.75 * s, Math.PI * 0.2, Math.PI * 0.8);
        st.mood === 'panic' ? ctx.fill() : ctx.stroke();
        if (st.mood === 'tender' || st.blush) { ctx.fillStyle = 'rgba(210,190,180,0.35)'; [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(hx + d * 1.7 * s, hy + 0.9 * s, 0.5 * s, 0, 7); ctx.fill(); }); }
      }
    } else { ctx.fillStyle = P2(pal.hair); ctx.beginPath(); ctx.arc(hx, hy, hr * 0.98, 0, 7); ctx.fill(); if (who === 'w') { ctx.beginPath(); ctx.arc(hx, hy - hr * 0.7, hr * 0.5, 0, 7); ctx.fill(); } }
    ctx.restore();
    if (hand && st.rot === undefined) return [x + hand[0], y + hand[1]];
    if (hand) { const c = Math.cos(st.rot), sn = Math.sin(st.rot); return [x + hand[0] * c - hand[1] * sn, y + hand[0] * sn + hand[1] * c]; }
    return null;
  }
  // green ribbon from a hand: a flowing strip
  function ribbon(ctx, x, y, u, t, dir, len = 16, alpha = 1) {
    ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = GREEN; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.shadowColor = rgbaG(0.6); ctx.shadowBlur = Math.min(30, u * 1.4);
    ctx.lineWidth = Math.max(2, u * 0.75); ctx.beginPath();
    for (let i = 0; i <= 24; i++) { const f = i / 24; const px = x + dir * f * len * u * 0.9, py = y - f * len * u * 0.25 + Math.sin(f * 7 - t * 5) * f * u * 1.6;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke(); ctx.restore(); }

  // ---------------- state of one couple at film time t ----------------
  // mode: 'race' uses the event clock; 'after' = everyone back in time; 'loop' = the t0 state at local time lt (lt<0 in the tail)
  function coupleState(c, t, mode) {
    if (mode === 'after') return { out: false, ph: phase(t) };
    const tf = c.pre !== undefined ? c.pre : c.tFall;
    if (mode === 'loop' || t < 17.6) {
      if (t < tf || (mode !== 'loop' && t >= c.tRec)) return { out: false, ph: phase(t) };
      return { out: true, since: t - tf, ph: phase(tf) + c.j * 1.2 };
    }
    return { out: t < c.tRec, since: 9, ph: t < c.tRec ? phase(tf) + c.j * 1.2 : phase(t) };
  }

  // ---------------- the world ----------------
  function world(ctx, t, cam, mode, opts = {}) {
    const lt = t;
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    // count lit share for the room light
    let outN = 0; const states = SORTED.map(c => { const s = coupleState(c, lt, mode); if (s.out) outN++; return s; });
    const lit = 1 - outN / CP.length;
    // wall + chandeliers (only in the eye-level views)
    const wallA = L.clamp(cam.k / 0.3, 0, 1);
    if (wallA > 0.01) {
      const hz = cam.sy0 - S * cam.z * cam.tilt / Math.max(0.05, cam.k);
      ctx.save(); ctx.globalAlpha = wallA;
      const g = ctx.createLinearGradient(0, 0, 0, hz); g.addColorStop(0, '#15171c'); g.addColorStop(1, shade('#3a3a3e', 0.6 + 0.4 * lit)); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, hz);
      for (let i = 0; i < 6; i++) { const wx = (i * 230 - (cam.cx - CLOSE.cx) * cam.z * 0.15) % 1380 - 150; poly(ctx, [[wx, hz - 520], [wx + 110, hz - 520], [wx + 110, hz - 40], [wx, hz - 40]], shade('#4a4a50', 0.5 + 0.5 * lit), 0.3);
        ctx.fillStyle = shade('#2c2d32', 1); ctx.beginPath(); ctx.arc(wx + 55, hz - 520, 55, Math.PI, 0); ctx.fill(); }
      for (let i = 0; i < 3; i++) { const cxh = 180 + i * 360 - (cam.cx - CLOSE.cx) * cam.z * 0.3, cyh = 150 + (i % 2) * 60;
        ctx.strokeStyle = '#55565c'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(cxh, 0); ctx.lineTo(cxh, cyh - 40); ctx.stroke();
        ctx.save(); ctx.globalAlpha = wallA * (0.15 + 0.5 * lit); ctx.fillStyle = '#fff4dc'; ctx.beginPath(); ctx.arc(cxh, cyh + 10, 70, 0, 7); ctx.fill(); ctx.restore();
        poly(ctx, [[cxh - 70, cyh - 40], [cxh + 70, cyh - 40], [cxh + 40, cyh + 30], [cxh - 40, cyh + 30]], shade('#bdb6a6', 0.4 + 0.6 * lit), 0.3); }
      ctx.restore();
    }
    // floor
    const fl = OUTLINE.map(([x, y]) => proj(cam, x, y));
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.beginPath(); fl.forEach(([x, y], i) => i ? ctx.lineTo(x + 6, y + 10) : ctx.moveTo(x + 6, y + 10)); ctx.closePath(); ctx.fill();
    ctx.fillStyle = shade('#46474c', 0.45 + 0.55 * lit); ctx.beginPath(); fl.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = shade('#6a6a6e', 0.5 + 0.5 * lit); ctx.lineWidth = 3; ctx.stroke();
    // links (green ribbons across the floor) — only visible from above
    const topA = L.clamp((1 - cam.k / 0.3) * 1.2 - 0.2, 0, 1) * (opts.links === false ? 0 : 1);
    if (topA > 0.01 && mode === 'race') drawLinks(ctx, t, cam, topA);
    if (topA > 0.01 && mode === 'after') drawLinks(ctx, 40, cam, topA);
    // couples, far to near
    const detail = [];
    for (let i = 0; i < SORTED.length; i++) {
      const c = SORTED[i], s = states[i];
      const [px, py, u, den] = proj(cam, c.x, c.y);
      if (den < 0.3 || px < -300 || px > 1380 || py < -200 || py > 2400) continue;
      if (u * 22 < 26) {  // dot mode
        const r = Math.max(2, 4.6 * u), orb = 7.5 * u;
        const ax = px + Math.cos(s.ph) * orb, ay = py + Math.sin(s.ph) * orb * cam.tilt, bx = px - Math.cos(s.ph) * orb, by = py - Math.sin(s.ph) * orb * cam.tilt;
        let ca = '#e9e2d0', cb = '#8e8b85';
        if (s.out) { const fresh = s.since < 0.4 || c === O; ca = fresh ? RED : rgbaR(0.8); cb = fresh ? RED : rgbaR(0.55); }
        if (c.frag) { ca = GREEN; ctx.save(); ctx.fillStyle = rgbaG(0.25); ctx.beginPath(); ctx.arc(ax, ay, r * 3.2, 0, 7); ctx.fill(); ctx.restore(); }
        disc(ctx, bx, by, r, cb, u > 0.6 ? 0.3 : 0); disc(ctx, ax, ay, r, ca, u > 0.6 ? 0.3 : 0);
      } else detail.push({ c, s, px, py, u, den });
    }
    // detailed couples (eye level)
    detail.forEach(({ c, s, px, py, u, den }) => {
      const fade = L.clamp(1.25 - (1 - 1 / den) * -1.1 * 0 - (den - 1) * 0.45, 0.35, 1);
      const orb = 5.2;
      const parts = [['w', s.ph], ['m', s.ph + Math.PI]].map(([who, th]) => { const wx = c.x + Math.cos(th) * orb, wy = c.y + Math.sin(th) * orb; const [x, y, uu] = proj(cam, wx, wy); return { who, th, x, y, uu, wy }; });
      parts.sort((a, b) => a.wy - b.wy);
      const isO = c === O, fresh = s.out && (s.since < 0.4 || isO);
      const col = s.out ? (fresh ? 'red' : 'dim') : 'n';
      let wob = 0; if (fresh) wob = isO ? 0.22 * Math.sin(t * 7) + 0.12 : 0.18 * Math.sin(s.since * 30) * (1 - s.since / 0.4);
      parts.forEach(p => {
        const facing = Math.sin(p.th) < 0.45, other = parts.find(q => q !== p), reach = other.x > p.x ? 1 : -1;
        const holds = c.frag && p.who === 'w';
        const mood = opts.moodFor ? opts.moodFor(c, p.who, s) : (s.out ? (isO ? 'panic' : 'sad') : 'happy');
        const hand = dancer(ctx, p.x, p.y, p.uu, p.who, { col, face: facing, mood, rot: wob || undefined, reach, ribbon: holds, fade, look: reach * 0.6, blush: opts.blush && c === P }, (c.x * 7 + c.y) | 0 + (p.who === 'w' ? 0 : 50), t);
        if (holds && hand && !(opts.tie && c === P)) ribbon(ctx, hand[0], hand[1], p.uu, t, c === P ? 1 : -reach, 14);
      });
      if (opts.tie && c === P) opts.tie(ctx, parts, t);
      // the missed step: a red ripple on the floor under O
      if (isO && s.out) { const st = s.since; for (let k = 0; k < 2; k++) { const rr = 4 + ((st * 0.9 + k * 0.5) % 1) * 16, a = 1 - ((st * 0.9 + k * 0.5) % 1);
        ctx.strokeStyle = rgbaR(0.85 * a); ctx.lineWidth = Math.max(2, 0.5 * u); ctx.beginPath(); ctx.ellipse(px, py + 0.5 * u, rr * u, rr * u * cam.tilt, 0, 0, 7); ctx.stroke(); } }
    });
    return lit;
  }

  function drawLinks(ctx, t, cam, a) {
    LINKS.forEach(lk => {
      const [ax, ay] = proj(cam, lk.a.x, lk.a.y), [bx, by] = proj(cam, lk.b.x, lk.b.y);
      const mx = (ax + bx) / 2 - (by - ay) * 0.14, my = (ay + by) / 2 + (bx - ax) * 0.14;
      let reach;
      if (t >= lk.t) reach = 1;
      else if (t < 7.0) reach = 0;
      else { const tries = 0.12 + 0.3 * Math.abs(Math.sin((t - 7) * 1.7 + lk.seed)); reach = t > lk.t - 0.8 ? L.lerp(tries, 1, L.ease.in((t - (lk.t - 0.8)) / 0.8)) : tries * L.sm(7.0, 7.6, t); }
      const bez = (f, x0, x1, xm) => (1 - f) * (1 - f) * x0 + 2 * f * (1 - f) * xm + f * f * x1;
      const seg = (from, to) => { ctx.beginPath(); for (let i = 0; i <= 30; i++) { const f = L.lerp(from, to, i / 30); const x = bez(f, ax, bx, mx), y = bez(f, ay, by, my); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); };
      ctx.save(); ctx.globalAlpha = a; ctx.lineCap = 'round';
      ctx.strokeStyle = 'rgba(200,200,200,0.12)'; ctx.lineWidth = 2; ctx.setLineDash([6, 12]); seg(0, 1); ctx.setLineDash([]);
      ctx.strokeStyle = GREEN; ctx.shadowColor = rgbaG(0.7); ctx.shadowBlur = 14; ctx.lineWidth = reach >= 1 ? 7 : 5;
      if (reach >= 1) seg(0, 1); else if (reach > 0) { seg(0, reach / 2); seg(1 - reach / 2, 1); }
      if (t >= lk.t && t < lk.t + 0.5) { ctx.globalAlpha = a * (1 - (t - lk.t) / 0.5); ctx.lineWidth = 18; seg(0, 1); }
      ctx.restore();
    });
  }

  // ---------------- log ruler ----------------
  const TICKS = [['second', 1], ['minute', 60], ['hour', 3600], ['day', 86400], ['month', 2.63e6], ['year', 3.156e7], ['decade', 3.156e8]];
  const LMAX = Math.log10(3.4e8);
  function ruler(ctx, x0, x1, y, E, { size = 38, a = 1, title = 'log time', red = true, greens = [], before = null } = {}) {
    const X = e => x0 + (x1 - x0) * L.clamp(Math.log10(Math.max(1, e)) / LMAX, 0, 1);
    ctx.save(); ctx.globalAlpha = a;
    ctx.strokeStyle = '#8d9098'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(x1, y); ctx.stroke();
    TICKS.forEach(([w, e], i) => { const x = X(e); ctx.beginPath(); ctx.moveTo(x, y - 12); ctx.lineTo(x, y + 12); ctx.stroke();
      L.label(ctx, w, x, i % 2 ? y + 12 + size : y - 22, size, { col: '#b6b8bf', align: i === 0 ? 'left' : i === TICKS.length - 1 ? 'right' : 'center' }); });
    if (title) L.label(ctx, title, x0, y - 22 - size * 1.2, size * 0.9, { col: '#8d9098', align: 'left' });
    if (red && E > 0) { ctx.fillStyle = RED; const xr = X(Math.min(E, FALL_S)); ctx.fillRect(x0, y - 10, Math.max(4, xr - x0), 20); }
    greens.forEach(g => { if (E >= g.e) { disc(ctx, X(g.e), y, g.r || 13, GREEN, 0); } });
    if (E > 0 && E < 3.3e8) { ctx.fillStyle = CREAM; ctx.fillRect(X(E) - 2, y - 26, 4, 52); }
    ctx.restore(); return X;
  }

  const card = (ctx, lines, y, a, size = 96) => { if (a > 0) L.title(ctx, lines, y, size, { alpha: a }); };
  const win = (t, a, b, f = 0.25) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));

  // the opening shot (also the loop tail): local time lt, where lt = t for the opening and t - DUR in the tail
  function opening(ctx, lt, tGlobal) {
    const cam = { ...CLOSE, z: CLOSE.z * (1 + 0.03 * L.clamp(lt, -1, 2.6) / 2.6) };
    world(ctx, lt, cam, 'loop', { moodFor: (c, who, s) => s.out ? (c === O ? 'panic' : 'sad') : (c === P ? (who === 'w' ? 'happy' : 'happy') : 'happy') });
  }

  function draw(ctx, t) {
    // ---- SC1: close, crane up, wide, higher (one take) ----
    if (t < 19.8) {
      if (t < 2.6) opening(ctx, t, t);
      else {
        const cam = camAt(t);
        world(ctx, t, cam, 'race');
      }
      // ruler during the race (from above)
      const ra = L.sm(6.0, 6.6, t) * (1 - L.sm(17.6, 17.9, t));
      if (ra > 0) { ctx.save(); ctx.globalAlpha = ra * 0.8; ctx.fillStyle = BG; ctx.fillRect(0, 1380, 1080, 150); ctx.restore();
        ruler(ctx, 110, 880, 1455, Eat(t), { a: ra, size: 36, greens: LINK_T.map((lt, i) => ({ e: L.lognormalQuantile([0.1, 0.3, 0.5, 0.7, 0.9][i], MED, P90) * 3600, r: 10 })).filter(g => tOfE(g.e) <= t) }); }
      card(ctx, ['One missed step.'], 330, t < 0.05 ? 1 : 1 - L.sm(2.3, 2.6, t), 104);
      card(ctx, ['Everyone on', 'the same beat.'], 300, win(t, 2.9, 4.9), 92);
      card(ctx, ['Out of time', 'in 90 seconds.'], 290, win(t, 6.4, 8.8), 96);
      card(ctx, ['Some knew', { text: 'the recovery step.', col: GREEN }], 290, win(t, 9.0, 11.6), 90);
      card(ctx, ['Never close enough', 'to lead.'], 290, win(t, 12.0, 14.4), 90);
      card(ctx, ['The lasting fix took', '7 years.'], 290, win(t, 14.8, 17.4), 90);
      if (t >= 17.6) { ctx.fillStyle = `rgba(8,9,12,${0.45 * L.sm(17.6, 18.0, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
      card(ctx, ['We slowed it down', 'so you could see it.'], 860, win(t, 17.8, 19.7), 96);
      L.slate(ctx, t < 2.6 ? 'SC1  CLOSE (eye level)' : t < 6.2 ? 'SC1  CRANE UP (one take)' : t < 11.2 ? 'SC1  WIDE' : t < 17.6 ? 'SC1  CRANE HIGHER' : 'SC1  HOLD');
      L.grain(ctx, t, { alpha: 0.05 });
      return;
    }
    // ---- SC2: the snap ----
    if (t < 26.5) {
      ctx.fillStyle = '#07080b'; ctx.fillRect(0, 0, 1080, 1920);
      if (t < 20.1) { L.slate(ctx, 'SC2  FREEZE'); return; }
      if (t < 22.3) {
        const a = L.sm(20.1, 20.4, t) * (1 - L.sm(22.0, 22.3, t));
        ctx.save(); ctx.globalAlpha = a;
        L.title(ctx, ['True proportions'], 470, 84, { alpha: a });
        L.label(ctx, 'the whole story, to scale', 540, 560, 46, { col: '#9aa0aa' });
        ctx.fillStyle = '#2a2c32'; ctx.fillRect(90, 820, 900, 60); ctx.strokeStyle = '#6d7078'; ctx.lineWidth = 3; ctx.strokeRect(90, 820, 900, 60);
        const grow = L.ease.out(L.clamp((t - 20.4) / 1.0, 0, 1));
        ctx.fillStyle = RED; ctx.fillRect(90, 800, 2, 100);
        if (grow > 0) disc(ctx, 90 + 900 * grow, 850, 22, GREEN, 0);
        ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(92, 905); ctx.lineTo(150, 990); ctx.stroke();
        L.label(ctx, 'the fall: too thin to see', 110, 1040, 50, { col: '#ff6f66', align: 'left' });
        L.label(ctx, 'the lasting fix, 7 years', 880, 760, 48, { col: '#8fe8b4', align: 'right', alpha: L.sm(21.0, 21.3, t) });
        ctx.restore(); L.slate(ctx, 'SC2  SNAP: TRUE SCALE'); return;
      }
      const a = L.sm(22.3, 22.6, t);
      const sweep = L.clamp((t - 22.5) / 1.4, 0, 1), E = Math.pow(10, sweep * LMAX);
      const Ef = L.lognormalQuantile(0.9, MED, P90) * 3600;
      const greens = [{ e: RESTORE_S, r: 15 }, { e: Ef, r: 15 }];
      ctx.save(); ctx.globalAlpha = a;
      L.label(ctx, 'the same night, log time', 540, 300, 48, { col: '#9aa0aa' });
      // panel A
      const pa = [90, 380, 900, 470];
      ctx.strokeStyle = '#4b4e56'; ctx.lineWidth = 3; ctx.strokeRect(...pa);
      L.label(ctx, 'as it happened', 120, 450, 60, { col: CREAM, font: SERIF, align: 'left' });
      ruler(ctx, 250, 930, 660, E, { size: 44, title: null, greens });
      ctx.strokeStyle = GREEN; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(160, 660, 17, 0, 7); ctx.stroke();
      L.label(ctx, 'warning: never reached the floor', 120, 800, 46, { col: '#c9c4b8', align: 'left' });
      // panel B
      const bA = L.sm(24.0, 24.3, t);
      ctx.globalAlpha = 1;
      const pb = [90, 920, 900, 470];
      ctx.strokeStyle = '#4b4e56'; ctx.strokeRect(...pb);
      L.label(ctx, 'warning routed first', 120, 990, 60, { col: CREAM, font: SERIF, align: 'left' });
      L.label(ctx, 'illustrative', 880, 990, 48, { col: '#9aa0aa', align: 'right' });
      ruler(ctx, 250, 930, 1200, Math.pow(10, L.clamp((t - 24.2) / 1.2, 0, 1) * LMAX), { size: 44, title: null, greens });
      const pop = L.sm(24.3, 24.6, t);
      ctx.save(); ctx.fillStyle = rgbaG(0.25 * pop); ctx.beginPath(); ctx.arc(160, 1200, 40, 0, 7); ctx.fill(); ctx.restore();
      disc(ctx, 160, 1200, 17 * pop, GREEN, 0);
      ctx.strokeStyle = GREEN; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(180, 1200); ctx.lineTo(L.lerp(180, 248, pop), 1200); ctx.stroke();
      L.label(ctx, 'before the missed step', 120, 1340, 46, { col: '#8fe8b4', align: 'left', alpha: pop });
      ctx.restore();
      ctx.fillStyle = `rgba(7,8,11,${1 - bA})`; ctx.fillRect(0, 900, 1080, 520);
      ctx.fillStyle = `rgba(7,8,11,${1 - a})`; ctx.fillRect(0, 0, 1080, 1920);
      L.title(ctx, ['People still decide.'], 1500, 64, { alpha: L.sm(25.0, 25.3, t) });
      L.slate(ctx, 'SC2  SNAP: SIDE BY SIDE');
      return;
    }
    // ---- SC3: drop down, closer than before; she ties the ribbon ----
    if (t < 30.6) {
      const cam = camAt(t);
      const tie = (c2, parts, tt) => {
        const w = parts.find(p => p.who === 'w'), m = parts.find(p => p.who === 'm');
        const k = L.sm(28.2, 29.4, tt), hx = L.lerp(w.x, m.x, 0.5), hy = Math.min(w.y, m.y) - 13.4 * w.uu;
        ctx.save(); ctx.strokeStyle = GREEN; ctx.shadowColor = rgbaG(0.6); ctx.shadowBlur = 24; ctx.lineCap = 'round'; ctx.lineWidth = Math.max(3, 0.7 * w.uu);
        // the long ribbon, taut now: part of the closed ring, leaving frame
        ctx.beginPath(); ctx.moveTo(hx, hy); ctx.quadraticCurveTo(hx - 300, hy - 200, -40, hy - 520); ctx.stroke();
        // the loop around their joined hands
        ctx.beginPath(); ctx.ellipse(hx, hy, (1.4 + 0.4 * (1 - k)) * w.uu, 0.9 * w.uu, 0.3, 0, Math.PI * 2 * Math.max(0.05, k)); ctx.stroke();
        ctx.restore(); };
      const tt = t < 29.6 ? t : 29.6 + (t - 29.6) * 0.35;
      world(ctx, tt, cam, 'after', { tie: t > 27.2 ? tie : null, moodFor: (c, who) => (c === P && t > 28.0) ? 'tender' : 'happy' });
      card(ctx, ['This is the bottleneck.'], 360, win(t, 28.0, 30.6, 0.3), 98);
      if (t > 30.4) L.endCard(ctx, L.sm(30.4, 30.6, t), { line: 'Help close the gap.' });
      L.slate(ctx, t < 29.6 ? 'SC3  DROP DOWN' : 'SC3  CLOSE+ (tender)');
      L.grain(ctx, t, { alpha: 0.05 });
      return;
    }
    // ---- END + LOOP TAIL ----
    if (t >= 34.4) {
      opening(ctx, t - DUR, t);
      card(ctx, ['One missed step.'], 330, L.sm(35.7, 36.3, t), 104);
      L.grain(ctx, t, { alpha: 0.05 });
    }
    const ea = 1 - L.sm(34.4, 35.2, t);
    if (ea > 0) L.endCard(ctx, ea, { line: 'Help close the gap.' });
    L.slate(ctx, t < 34.4 ? 'END' : 'SC1  CLOSE (loop)');
  }

  return {
    draw, DUR,
    acts: [
      { start: 0, end: 6.3, bpm: 97, drone: true },     // the shared beat (3/4 feel, 1.85 s per turn ~ 97 bpm)
      { start: 6.3, end: 17.6, bpm: 0, drone: true },
      { start: 17.6, end: 19.8, bpm: 0, drone: true },
      { start: 20.1, end: 26.5, bpm: 0, drone: true },
      { start: 26.5, end: 34.4, bpm: 0, drone: true },
      { start: 34.4, end: 37.0, bpm: 97, drone: true },
    ],
    cues: [
      { t: 0.15, type: 'bonk' }, { t: 2.6, type: 'whoosh' }, { t: 6.3, type: 'stamp' },
      { t: LINK_T[0], type: 'pop' }, { t: LINK_T[1], type: 'pop' }, { t: LINK_T[2], type: 'pop' }, { t: LINK_T[3], type: 'pop' }, { t: LINK_T[4], type: 'ding' },
      { t: 20.1, type: 'hit' }, { t: 24.3, type: 'ding' }, { t: 26.5, type: 'whoosh' }, { t: 30.4, type: 'ding' }, { t: 34.4, type: 'whoosh' },
    ],
  };
}
if (typeof module !== 'undefined') module.exports = makeScene;
