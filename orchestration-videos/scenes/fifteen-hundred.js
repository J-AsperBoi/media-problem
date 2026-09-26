// fifteen-hundred: split-screen-race, neon arcade, traffic, handheld chase. Analog: false-news-2018.
// Red: extent(h) = smoothstep(h/10) between the analog's sourced endpoints (0 at 0 h, 1,500 people at 10 h).
// Green (human): 7 gates released at L.lognormalQuantile(q, 13, 20) h, each car covers 1/7 of the route in (60 - max release) h.
// Green (AI, illustrative): released at L.lognormalQuantile(q, 1, 20/13) h after the claim passes (ai_counterfactual).
// Mapping: race 1 s = 1 h (h = t - 3); snap 1 s = 20 h. See output/fifteen-hundred/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('false-news-2018');
  const DUR = 38, RED = L.RED, GREEN = L.GREEN, BG = '#07080c';
  const RED_H = A.threat.points[A.threat.points.length - 1].t;          // 10 h
  const TRUE_H = A.threat.comparison_true_news[1].t;                     // 60 h
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90; // 13, 20
  const AIMED = A.ai_counterfactual.aggregation_median, AIP90 = AIMED * P90 / MED;
  const NSEG = 7, NDOT = 1500;

  // ---------- time mapping ----------
  const T_RACE = 3, H_RACE_END = 16, T_FREEZE = T_RACE + H_RACE_END; // 19
  const T_SNAP = 21.6, SNAP_RATE = 20;                                // 1 s = 20 h
  const hRace = t => L.clamp(t - T_RACE, 0, H_RACE_END);
  const hSnap = t => L.clamp((t - T_SNAP) * SNAP_RATE, 0, TRUE_H);

  // ---------- route: serpentine highway in a 1080x960 world ----------
  const route = []; const ys = [150, 360, 570, 780], X0 = 150, X1 = 930, RAD = 105;
  ys.forEach((y, i) => {
    const l2r = i % 2 === 0, xa = l2r ? X0 : X1, xb = l2r ? X1 : X0;
    for (let k = 0; k <= 30; k++) route.push([L.lerp(xa, xb, k / 30), y]);
    if (i < ys.length - 1) { const cx = xb, cy = y + RAD; for (let k = 1; k < 20; k++) { const a = -Math.PI / 2 + (l2r ? 1 : -1) * Math.PI * k / 20; route.push([cx + (l2r ? 1 : 1) * Math.cos(a) * RAD * (l2r ? 1 : 1), cy + Math.sin(a) * RAD]); } }
  });
  const cum = [0]; for (let i = 1; i < route.length; i++) cum.push(cum[i - 1] + Math.hypot(route[i][0] - route[i - 1][0], route[i][1] - route[i - 1][1]));
  const TOT = cum[cum.length - 1];
  function at(s) { s = L.clamp(s, 0, 1) * TOT; let i = 1; while (i < cum.length - 1 && cum[i] < s) i++;
    const f = (s - cum[i - 1]) / (cum[i] - cum[i - 1] || 1), a = route[i - 1], b = route[i];
    const ang = Math.atan2(b[1] - a[1], b[0] - a[0]); return { x: L.lerp(a[0], b[0], f), y: L.lerp(a[1], b[1], f), ang, nx: -Math.sin(ang), ny: Math.cos(ang) }; }

  // ---------- red: stated monotone ease between sourced endpoints ----------
  const ext = h => L.sm(0, RED_H, h);
  const hRedOf = s => { let lo = 0, hi = RED_H; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; ext(m) < s ? lo = m : hi = m; } return (lo + hi) / 2; };

  // ---------- green: seven ramps, lognormal releases ----------
  const perm = [2, 5, 0, 3, 6, 1, 4]; // seeded shuffle, hero ramp = seg 3 (median)
  const segs = [];
  for (let i = 0; i < NSEG; i++) { const q = (perm[i] + 0.5) / NSEG; segs.push({ i, s0: i / NSEG, s1: (i + 1) / NSEG, q, r: L.lognormalQuantile(q, MED, P90), rai: L.lognormalQuantile(q, AIMED, AIP90), side: i % 2 ? 1 : -1 }); }
  const maxR = Math.max(...segs.map(g => g.r)); const D = TRUE_H - maxR;
  const HERO = segs[3];
  segs.forEach(g => { const p = at(g.s0 + 0.02); g.jx = p.x; g.jy = p.y; g.gx = p.x + p.nx * g.side * 34; g.gy = p.y + p.ny * g.side * 34; g.rx = p.x + p.nx * g.side * 90; g.ry = p.y + p.ny * g.side * 90; g.ang = p.ang; g.hRed0 = hRedOf(g.s0); });

  // ---------- 1,500 people ----------
  const r = L.rng(1500); const dots = [];
  for (let i = 0; i < NDOT; i++) { const s = (i + r()) / NDOT, p = at(s); const sd = r() < 0.5 ? -1 : 1, d = sd * (18 + Math.pow(r(), 1.4) * 70);
    const g = segs[Math.min(NSEG - 1, Math.floor(s * NSEG))];
    const hR = hRedOf(s); dots.push({ x: p.x + p.nx * d + (r() - 0.5) * 8, y: p.y + p.ny * d + (r() - 0.5) * 8, s, hR, hG: g.r + D * (s - g.s0) * NSEG, hA: hR + g.rai }); }
  const lastDot = dots.reduce((b, d) => d.s > b.s ? d : b);
  const heroP = { x: lastDot.x, y: lastDot.y };
  // side streets and gray traffic
  const streets = []; for (let i = 0; i < 46; i++) { const a = dots[Math.floor(r() * NDOT)], b = dots[Math.floor(r() * NDOT)]; if (Math.hypot(a.x - b.x, a.y - b.y) < 260) streets.push([a.x, a.y, b.x, b.y]); }
  const traffic = []; for (let i = 0; i < 26; i++) traffic.push({ s0: r(), v: 0.004 + r() * 0.004, lane: r() < 0.5 ? -9 : 9 });

  // ---------- drawing helpers ----------
  const fade = (t, a, b, f = 0.3) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));
  function neonLine(ctx, pts, col, w, a = 1) {
    ctx.save(); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = col;
    [[w * 4, 0.08], [w * 2, 0.18], [w, 0.95]].forEach(([lw, al]) => { ctx.globalAlpha = al * a; ctx.lineWidth = lw; ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); });
    ctx.restore();
  }
  function head(ctx, x, y, rad, { mood = 'bored', look = [0, 0], col = '#d9dde4', lit } = {}) {
    ctx.save(); ctx.fillStyle = '#10131a'; ctx.beginPath(); ctx.arc(x, y, rad, 0, 7); ctx.fill();
    if (lit) { const g = ctx.createRadialGradient(x, y + rad, 0, x, y + rad, rad * 1.6); g.addColorStop(0, lit); g.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rad, 0, 7); ctx.fill(); }
    ctx.strokeStyle = col; ctx.lineWidth = rad * 0.12; ctx.beginPath(); ctx.arc(x, y, rad, 0, 7); ctx.stroke();
    const ex = rad * 0.36, ey = y - rad * 0.12; ctx.fillStyle = col;
    [-1, 1].forEach(d => {
      if (mood === 'glazed') { ctx.fillRect(x + d * ex - rad * 0.15, ey, rad * 0.3, rad * 0.08); }
      else { ctx.beginPath(); ctx.arc(x + d * ex + look[0] * rad * 0.08, ey + look[1] * rad * 0.08, rad * 0.11, 0, 7); ctx.fill(); }
      if (mood === 'angry') { ctx.lineWidth = rad * 0.1; ctx.beginPath(); ctx.moveTo(x + d * (ex + rad * 0.28), ey - rad * 0.36); ctx.lineTo(x + d * (ex - rad * 0.2), ey - rad * 0.18); ctx.stroke(); }
    });
    ctx.lineWidth = rad * 0.1; ctx.beginPath(); const my = y + rad * 0.42;
    if (mood === 'angry') { ctx.arc(x, my + rad * 0.16, rad * 0.26, 1.15 * Math.PI, 1.85 * Math.PI); }
    else { ctx.moveTo(x - rad * 0.22, my); ctx.lineTo(x + rad * 0.22, my); }
    ctx.stroke(); ctx.restore();
  }
  function car(ctx, x, y, ang, col, { a = 1, driver = null, t = 0, trail = null } = {}) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.globalAlpha = a;
    const Lc = 40, Wc = 22;
    // headlight beams (white, faint)
    const g = ctx.createLinearGradient(Lc / 2, 0, Lc / 2 + 70, 0); g.addColorStop(0, 'rgba(230,235,245,0.35)'); g.addColorStop(1, 'rgba(230,235,245,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(Lc / 2, -Wc * 0.35); ctx.lineTo(Lc / 2 + 70, -Wc * 0.9); ctx.lineTo(Lc / 2 + 70, Wc * 0.9); ctx.lineTo(Lc / 2, Wc * 0.35); ctx.fill();
    [[10, 0.12], [5, 0.3]].forEach(([w, al]) => { ctx.globalAlpha = a * al; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); ctx.roundRect(-Lc / 2, -Wc / 2, Lc, Wc, 7); ctx.stroke(); });
    ctx.globalAlpha = a; ctx.fillStyle = '#0c0e13'; ctx.beginPath(); ctx.roundRect(-Lc / 2, -Wc / 2, Lc, Wc, 7); ctx.fill();
    ctx.strokeStyle = col; ctx.lineWidth = 2.2; ctx.stroke();
    ctx.fillStyle = col; ctx.globalAlpha = a * 0.9; ctx.fillRect(-Lc / 2 + 2, -Wc / 2 + 3, 3, 4); ctx.fillRect(-Lc / 2 + 2, Wc / 2 - 7, 3, 4);
    ctx.restore();
    if (driver) { ctx.save(); ctx.globalAlpha = a; head(ctx, x + Math.cos(ang) * 2, y + Math.sin(ang) * 2, 7.5, driver); ctx.restore(); }
  }

  // world renderer. mode: 'red' | 'green' | 'human' | 'ai'
  function world(ctx, h, mode, t, z) {
    // arcade grid
    ctx.save(); ctx.strokeStyle = 'rgba(200,205,215,0.05)'; ctx.lineWidth = 1; ctx.beginPath();
    for (let x = -600; x <= 1680; x += 60) { ctx.moveTo(x, -600); ctx.lineTo(x, 1560); } for (let y = -600; y <= 1560; y += 60) { ctx.moveTo(-600, y); ctx.lineTo(1680, y); } ctx.stroke(); ctx.restore();
    ctx.save(); ctx.strokeStyle = 'rgba(190,195,205,0.16)'; ctx.lineWidth = 1.5; ctx.beginPath(); streets.forEach(([a, b, c, d]) => { ctx.moveTo(a, b); ctx.lineTo(c, d); }); ctx.stroke(); ctx.restore();
    neonLine(ctx, route, '#c9ced8', 5, 0.8);
    ctx.save(); ctx.setLineDash([10, 14]); ctx.strokeStyle = 'rgba(200,205,215,0.25)'; ctx.lineWidth = 1.2; ctx.beginPath(); route.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); ctx.restore();
    // ramps + gates
    const showGreen = mode !== 'red';
    segs.forEach(g => {
      neonLine(ctx, [[g.rx, g.ry], [g.jx, g.jy]], '#8d939e', 3, 0.7);
      const rel = mode === 'ai' ? g.hRed0 + g.rai : g.r; const open = L.clamp((h - rel) / 0.4, 0, 1);
      const bx = L.lerp(g.gx, g.jx, 0.15), by = L.lerp(g.gy, g.jy, 0.15); const bang = g.ang + Math.PI * 0.5 * open * 0.95;
      ctx.save(); ctx.translate(bx, by); ctx.rotate(bang); ctx.strokeStyle = '#e8ebf0'; ctx.lineWidth = 4; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.moveTo(-26, 0); ctx.lineTo(26, 0); ctx.stroke();
      ctx.setLineDash([6, 6]); ctx.strokeStyle = '#5c616b'; ctx.stroke(); ctx.restore();
      ctx.fillStyle = '#e8ebf0'; ctx.beginPath(); ctx.arc(bx - Math.cos(g.ang) * 26, by - Math.sin(g.ang) * 26, 3.5, 0, 7); ctx.fill();
    });
    // people
    const pr = z > 3 ? 2.6 : 3.2;
    const gray = new Path2DLike(), red = new Path2DLike(), grn = new Path2DLike(), core = new Path2DLike();
    dots.forEach(d => {
      const isR = h >= d.hR, gh = mode === 'ai' ? d.hA : d.hG, isG = showGreen && h >= gh;
      // reached by the correction: green ring, the claim stays as a small red core (speed is not belief)
      if (isG) { grn.add(d.x, d.y); (isR ? core : gray).add(d.x, d.y); } else (isR ? red : gray).add(d.x, d.y);
    });
    const redA = mode === 'green' ? 0.45 : 1;
    gray.fill(ctx, pr, 'rgba(170,176,188,0.55)');
    red.fill(ctx, pr * 3, `rgba(255,59,48,${0.13 * redA})`); red.fill(ctx, pr, `rgba(255,59,48,${redA})`);
    core.fill(ctx, pr * 0.55, `rgba(255,59,48,${0.7 * redA})`);
    grn.fill(ctx, pr * 2.6, 'rgba(52,210,123,0.12)'); grn.ring(ctx, pr * 1.5, GREEN, pr * 0.75);
    // gray traffic
    traffic.forEach((c, i) => { const s = (c.s0 + h * c.v) % 1, p = at(s); car(ctx, p.x + p.nx * c.lane, p.y + p.ny * c.lane, p.ang, '#8d939e', { a: 0.55 }); });
    // green cars
    if (showGreen) segs.forEach(g => {
      let x, y, ang, a = 1;
      if (mode === 'ai') {
        const rel = g.hRed0 + g.rai; if (h < rel) { x = L.lerp(g.rx, g.gx, 0.35); y = L.lerp(g.ry, g.gy, 0.35); ang = Math.atan2(g.jy - g.ry, g.jx - g.rx); }
        else { const s = Math.min(g.s1, ext(h - g.rai)); const p = at(s); x = p.x - p.nx * 8; y = p.y - p.ny * 8; ang = p.ang; if (s >= g.s1) a = 0.8; }
      } else {
        if (h < g.r) { x = L.lerp(g.rx, g.gx, 0.35); y = L.lerp(g.ry, g.gy, 0.35); ang = Math.atan2(g.jy - g.ry, g.jx - g.rx); }
        else { const u = (h - g.r) / D; const k = L.clamp(u / 0.03, 0, 1);
          const s = L.lerp(g.s0 + 0.02, g.s1, L.clamp(u, 0, 1)); const p = at(s);
          x = L.lerp(L.lerp(g.gx, g.jx, 0.5), p.x - p.nx * 8, k); y = L.lerp(L.lerp(g.gy, g.jy, 0.5), p.y - p.ny * 8, k); ang = k < 1 ? L.lerp(Math.atan2(g.jy - g.ry, g.jx - g.rx), p.ang, k) : p.ang; }
      }
      const hero = g === HERO && mode === 'green';
      car(ctx, x, y, ang, GREEN, { a, driver: { mood: hero ? (t > 12 ? 'angry' : 'bored') : 'bored', look: hero ? [Math.sin(t * 1.3) * 0.6, 0] : [0, 0] }, t });
      if (hero) { HERO.cx = x; HERO.cy = y; }
    });
    // red car + trail
    if (h > 0 || mode === 'red') {
      const wv = hh => Math.sin(hh * 7) * 9;
      const car0 = hh => { const p = at(ext(hh)); return { x: p.x + p.nx * wv(hh), y: p.y + p.ny * wv(hh), ang: p.ang }; };
      if (h < RED_H + 0.6) {
        const tr = []; for (let k = 0; k <= 14; k++) { const hh = Math.max(0, h - k * 0.12); tr.push([car0(hh).x, car0(hh).y]); }
        neonLine(ctx, tr, RED, 4, mode === 'green' ? 0.5 : 0.8);
        const c = car0(Math.min(h, RED_H)); car(ctx, c.x, c.y, c.ang + Math.cos(h * 7) * 0.25, RED, { a: (mode === 'green' ? 0.8 : 1) * (1 - L.sm(RED_H, RED_H + 0.6, h)) });
      }
    }
    // hero person at the end of the route (top lane IN+)
    if (mode === 'red') { const a = L.sm(3, 5, z); if (a > 0) { ctx.save(); ctx.globalAlpha = a; const lit = h >= lastDot.hR;
      head(ctx, heroP.x, heroP.y - 14, 9, { mood: 'glazed', lit: lit ? 'rgba(255,59,48,0.55)' : null });
      ctx.fillStyle = lit ? RED : '#3a3f49'; ctx.fillRect(heroP.x - 4, heroP.y - 1, 8, 12); ctx.restore(); } }
  }
  // batched dot drawing
  function Path2DLike() { this.p = []; }
  Path2DLike.prototype.add = function (x, y) { this.p.push(x, y); };
  Path2DLike.prototype.fill = function (ctx, rad, col) { if (!this.p.length) return; ctx.fillStyle = col; ctx.beginPath(); for (let i = 0; i < this.p.length; i += 2) { ctx.moveTo(this.p[i] + rad, this.p[i + 1]); ctx.arc(this.p[i], this.p[i + 1], rad, 0, 7); } ctx.fill(); };
  Path2DLike.prototype.ring = function (ctx, rad, col, w) { if (!this.p.length) return; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); for (let i = 0; i < this.p.length; i += 2) { ctx.moveTo(this.p[i] + rad, this.p[i + 1]); ctx.arc(this.p[i], this.p[i + 1], rad, 0, 7); } ctx.stroke(); };

  // lane: rect {y, h}; cam {x, y, z}; shake amount
  function lane(ctx, R, cam, h, mode, t, shake = 0, seed = 1) {
    ctx.save(); ctx.beginPath(); ctx.rect(0, R.y, 1080, R.h); ctx.clip();
    ctx.fillStyle = BG; ctx.fillRect(0, R.y, 1080, R.h);
    const sc = R.h / 960, sx = (L.noise(t * 2.3, seed) - 0.5) * shake, sy = (L.noise(t * 2.9, seed + 4) - 0.5) * shake, rot = (L.noise(t * 1.7, seed + 9) - 0.5) * 0.03 * shake / 40;
    ctx.translate(0, R.y + R.h / 2 - 960);
    ctx.translate(540, 960); ctx.scale(sc, sc); ctx.translate(-540, -960);
    L.camera(ctx, [[0, [cam.x + sx / cam.z, cam.y + sy / cam.z, cam.z, rot]]], 0);
    world(ctx, h, mode, t, cam.z);
    ctx.restore();
  }
  function card(ctx, lines, y, size, a, { band = true } = {}) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
    if (band) { const hh = size * (lines.length * 1.1 + 0.6); ctx.fillStyle = 'rgba(7,8,12,0.78)'; ctx.fillRect(0, y - size * 1.05, 1080, hh); }
    ctx.restore();
    // fit inside the safe column x 80..900: center at 490, max width 780
    ctx.save(); ctx.font = `${size}px "${SERIF}"`; const mw = Math.max(...lines.map(l => ctx.measureText(typeof l === 'string' ? l : l.text).width)); ctx.restore();
    const fs = mw * 1.06 > 780 ? size * 780 / (mw * 1.06) : size;
    const fitted = lines.map(l => { const o = typeof l === 'string' ? { text: l } : { ...l }; return o; });
    ctx.save(); ctx.translate(-50, 0); L.title(ctx, fitted, y, fs, { alpha: a }); ctx.restore();
  }
  function laneLabel(ctx, text, y, a, col = '#c9ced8') { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.font = `44px "${HAND}"`; ctx.textAlign = 'left';
    const w = ctx.measureText(text).width; ctx.fillStyle = 'rgba(7,8,12,0.8)'; ctx.fillRect(80, y - 42, w + 36, 58); ctx.strokeStyle = col; ctx.lineWidth = 2; ctx.strokeRect(80, y - 42, w + 36, 58);
    ctx.fillStyle = col; ctx.fillText(text, 98, y); ctx.restore(); }
  function divider(ctx, y, a = 1) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#000'; ctx.fillRect(0, y - 6, 1080, 12); ctx.strokeStyle = 'rgba(220,225,235,0.8)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(0, y - 6); ctx.lineTo(1080, y - 6); ctx.moveTo(0, y + 6); ctx.lineTo(1080, y + 6); ctx.stroke(); ctx.restore(); }

  // phone overlay (top lane hook): screen hole grows until it leaves the lane
  function phone(ctx, R, p) {
    if (p > 4.8) return; const cx = 540, cy = R.y + 520, w = 400 * p, hh = 700 * p;
    ctx.save(); ctx.beginPath(); ctx.rect(0, R.y, 1080, R.h); ctx.clip();
    ctx.beginPath(); ctx.rect(0, R.y, 1080, R.h); ctx.roundRect(cx - w / 2, cy - hh / 2, w, hh, 40 * p); ctx.fillStyle = '#050608'; ctx.fill('evenodd');
    // bezel
    ctx.strokeStyle = '#d4d8e0'; ctx.lineWidth = 5 * p; ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.roundRect(cx - w / 2 - 14 * p, cy - hh / 2 - 14 * p, w + 28 * p, hh + 28 * p, 52 * p); ctx.stroke();
    ctx.globalAlpha = 0.18; ctx.lineWidth = 22 * p; ctx.stroke(); ctx.globalAlpha = 1;
    // hand: fingers wrapped left, thumb reaching over the lower screen
    ctx.strokeStyle = '#c3c8d1'; ctx.lineWidth = 5 * p; ctx.fillStyle = '#12151c'; ctx.lineCap = 'round';
    for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.roundRect(cx - w / 2 - 70 * p, cy + (40 + k * 78) * p, 90 * p, 62 * p, 30 * p); ctx.fill(); ctx.stroke(); }
    const tx = cx + w / 2 + 40 * p, ty = cy + hh / 2 + 20 * p;
    ctx.save(); ctx.translate(tx, ty); ctx.rotate(-2.5); ctx.beginPath(); ctx.roundRect(-10 * p, -40 * p, 250 * p, 80 * p, 40 * p); ctx.fill(); ctx.stroke(); ctx.restore();
    ctx.restore();
  }

  // ---------- cameras ----------
  const CEN = { x: 540, y: 480 };
  function camTop(t, h) {
    const z = L.key([[0, 3.2], [8, 3.2], [11, 1], [13.2, 1], [16, 6.5], [19, 7]], t);
    const p = at(ext(Math.min(h, RED_H))); const follow = { x: L.lerp(p.x, CEN.x, 0.1), y: p.y };
    const w1 = L.ease.inOut(L.clamp((t - 8) / 3, 0, 1)), w2 = L.ease.inOut(L.clamp((t - 13.2) / 2.8, 0, 1));
    let x = L.lerp(follow.x, CEN.x, w1), y = L.lerp(follow.y, CEN.y, w1); x = L.lerp(x, heroP.x, w2); y = L.lerp(y, heroP.y - 8, w2);
    return { x, y, z };
  }
  function camBot(t, h) {
    const z = L.key([[0, 5.2], [8, 4.4], [11, 1], [13.2, 1], [16, 8], [19, 7.2]], t);
    const hx = HERO.cx != null ? HERO.cx : HERO.gx, hy = HERO.cy != null ? HERO.cy : HERO.gy;
    const w1 = L.ease.inOut(L.clamp((t - 8) / 3, 0, 1)) * (1 - L.ease.inOut(L.clamp((t - 13.2) / 2.8, 0, 1)));
    return { x: L.lerp(hx, CEN.x, w1), y: L.lerp(hy, CEN.y, w1), z };
  }
  // HERO car position is computed while drawing; precompute for camera (human mode, green)
  function heroPos(h) { const g = HERO; if (h < g.r) return { x: L.lerp(g.rx, g.gx, 0.35), y: L.lerp(g.ry, g.gy, 0.35) };
    const u = (h - g.r) / D, k = L.clamp(u / 0.03, 0, 1), s = L.lerp(g.s0 + 0.02, g.s1, L.clamp(u, 0, 1)), p = at(s);
    return { x: L.lerp(L.lerp(g.gx, g.jx, 0.5), p.x - p.nx * 8, k), y: L.lerp(L.lerp(g.gy, g.jy, 0.5), p.y - p.ny * 8, k) }; }

  const T_COLD = 1.3; const TOP = { y: 0, h: 960 }, BOT = { y: 960, h: 960 }, FULL = { y: 0, h: 1920 };

  function race(ctx, t) {
    const h = hRace(t);
    const shake = L.key([[0, 8], [3, 8], [5, 22], [8, 22], [11, 6], [13.2, 6], [16, 26], [19, 18]], t);
    if (t < T_COLD) {
      // cold open: flash-forward to hour 10 on the same timeline, close on the last person reached
      lane(ctx, TOP, { x: heroP.x - 20, y: heroP.y - 10, z: L.lerp(4.6, 5.0, t / T_COLD) }, RED_H, 'red', t, shake, 3);
    } else {
      lane(ctx, TOP, camTop(t, h), h, 'red', t, shake, 3);
      phone(ctx, TOP, L.key([[0, 1], [3.2, 1], [5.2, 5]], t, L.ease.in));
    }
    const hp = heroPos(h); HERO.cx = hp.x; HERO.cy = hp.y;
    lane(ctx, BOT, camBot(t, h), h, 'green', t, shake * 0.8, 11);
    divider(ctx, 960);
  }

  function draw(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    if (t < T_FREEZE) {
      race(ctx, t);
      L.slate(ctx, t < T_COLD ? 'SC0  COLD OPEN (FLASH-FORWARD)  CLOSE' : t < 3 ? 'SC1  CLOSE / CLOSE' : t < 8 ? 'SC2  DOLLY IN, HANDHELD CHASE' : t < 13.2 ? 'SC3  CRANE UP, WIDE' : 'SC4  DOLLY IN, CLOSER');
      laneLabel(ctx, '10 hours from now', 280, t < T_COLD ? 1 : 0);
      if (t >= T_COLD && t < T_COLD + 0.15) { ctx.fillStyle = `rgba(255,255,255,${0.3 * (1 - L.sm(T_COLD, T_COLD + 0.15, t))})`; ctx.fillRect(0, 0, 1080, 1920); }
      laneLabel(ctx, 'now', 280, fade(t, T_COLD, 3.0, 0.1));
      card(ctx, ['Two lanes. One race.'], 990, 100, t < 0.1 ? 1 : fade(t, 0, 2.8));
      laneLabel(ctx, 'the claim', 280, fade(t, 3.4, 7.6));
      laneLabel(ctx, 'the correction', 1240, fade(t, 3.4, 7.6), '#c9ced8');
      card(ctx, ['The answer is', { text: 'already here.', col: GREEN }], 930, 96, fade(t, 9.0, 11.6));
      card(ctx, [{ text: 'Red: everyone', col: RED }, 'in 10 hours.'], 930, 96, fade(t, 13.0, 15.6));
      card(ctx, ['Then the ramp opens.'], 990, 96, fade(t, 16.1, 18.9));
    } else if (t < T_SNAP) {
      race(ctx, T_FREEZE - 0.001);
      ctx.fillStyle = `rgba(7,8,12,${0.6 * L.sm(19, 19.5, t)})`; ctx.fillRect(0, 0, 1080, 1920);
      L.slate(ctx, 'FREEZE');
      card(ctx, ['We slowed it down', 'so you could see it.'], 900, 92, fade(t, 19.2, 21.5), { band: false });
    } else if (t < 29.4) {
      const h = hSnap(t);
      lane(ctx, TOP, { ...CEN, z: 1 }, h, 'human', t, 0, 3);
      lane(ctx, BOT, { ...CEN, z: 1 }, h, 'ai', t, 0, 11);
      divider(ctx, 960);
      L.slate(ctx, 'SC5  SNAP  LOCKED WIDE');
      const la = L.sm(21.6, 21.9, t);
      laneLabel(ctx, 'as it happened', 270, la);
      laneLabel(ctx, 'AI-routed (illustrative)', 1230, la, GREEN);
      if (t < 21.75) { ctx.fillStyle = `rgba(255,255,255,${0.35 * (1 - L.sm(21.6, 21.75, t))})`; ctx.fillRect(0, 0, 1080, 1920); }
      card(ctx, [{ text: 'Truth: 60 hours.', col: GREEN }], 990, 100, fade(t, 24.7, 27.0));
      card(ctx, ['Speed is not belief.'], 990, 100, fade(t, 27.1, 29.4));
    } else if (t < 32.6) {
      const lt = t - 29.4, h = 12.4; const hp = heroPos(h); HERO.cx = hp.x; HERO.cy = hp.y;
      const gx = L.lerp(HERO.gx, HERO.jx, 0.15), gy = L.lerp(HERO.gy, HERO.jy, 0.15);
      const z = L.lerp(5, 9, L.ease.inOut(L.clamp(lt / 3.2, 0, 1)));
      lane(ctx, FULL, { x: L.lerp(hp.x, gx, 0.55), y: L.lerp(hp.y, gy, 0.55), z: z / 2 }, h, 'green', 14 + lt, 10, 11);
      ctx.fillStyle = `rgba(7,8,12,${1 - L.sm(29.4, 29.8, t)})`; ctx.fillRect(0, 0, 1080, 1920);
      L.slate(ctx, 'SC6  EXTREME CLOSE  DOLLY IN');
      card(ctx, ['This is', 'the bottleneck.'], 470, 110, fade(t, 29.6, 32.6));
    } else {
      L.endCard(ctx, L.sm(32.6, 33.0, t), { line: 'The bottleneck is us.' });
    }
    L.grain(ctx, t, { alpha: 0.04, n: 300 });
  }

  return { draw, DUR,
    acts: [{ start: 0, end: 3, bpm: 0, drone: true }, { start: 3, end: 19, bpm: 132, drone: true }, { start: 21.6, end: 29.4, bpm: 0, drone: true }, { start: 29.4, end: 38, bpm: 0, drone: true }],
    cues: [{ t: 1.3, type: 'stamp' }, { t: 3, type: 'whoosh' }, { t: T_RACE + HERO.hRed0, type: 'whoosh' }, { t: 13, type: 'bonk' }, { t: T_RACE + HERO.r, type: 'pop' }, { t: T_SNAP, type: 'hit' }, { t: T_SNAP + Math.max(...dots.map(d => d.hA)) / SNAP_RATE, type: 'ding' }, { t: T_SNAP + TRUE_H / SNAP_RATE, type: 'ding' }, { t: 29.6, type: 'hit' }],
    _debug: { segs: segs.map(g => [g.r.toFixed(2), g.rai.toFixed(2), g.hRed0.toFixed(2)]), D, heroR: HERO.r, lastRed: lastDot.hR, maxAI: Math.max(...dots.map(d => d.hA)) } };
}
module.exports = makeScene;
