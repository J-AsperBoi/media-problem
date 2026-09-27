// wall-of-ice: based-on-a-true-story, paper cutout, family scale, POV walk. Analog: quebec-1989.
// One mapping (log time, with a stated pause): E (s after 02:44) = 10^((c - 2.4) / 1.6), c = running clock;
//   c = t until 6.2, paused 6.2..16.2 (crane + kitchen are ~4 min into the dark), then c = t - 10; frozen at t = 26.
// Red = siblings' logistic fit through the sourced endpoints (1% at t0, 99% at 90 s; doubling 6.78 s). Restore 83% by 9 h (s3), rest by 24 h (assumed).
// Green = 5 fragments; loop links arrive at L.lognormalQuantile(q, 759 h, 64000 h), q = .1 .3 .5 .7 .9. Median never on screen.
// Snap: ai_counterfactual (~1 h routing of an existing warning) shown only as "before", labeled illustrative.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('quebec-1989');
  const DUR = 43.6, RED = L.RED, GREEN = L.GREEN;
  const rgbaG = a => `rgba(52,210,123,${a})`, rgbaR = a => `rgba(255,59,48,${a})`;
  const CREAM = '#e8e4da', BG = '#0e1015';

  // ---------------- time mapping + speed math ----------------
  const T0 = 2.4, K = 1.6, PA = 6.2, PB = 16.2, TEND = 26.0, PAUSE = PB - PA;
  const clockC = t => t < PA ? t : t < PB ? PA : Math.min(t, TEND) - PAUSE;
  const Eat = t => { if (t < 1.4) return 58 + 3 * t; if (t < T0) return 0; return Math.pow(10, (clockC(t) - T0) / K); };
  const tOfE = E => { const c = E <= 1 ? T0 : T0 + K * Math.log10(E); return c < PA ? c : c + PAUSE; };
  const FALL_S = A.threat.points[1].t * 3600;                      // 90 s
  const S0 = 0.01, DBL = FALL_S / (Math.log((0.99 / 0.01) * (1 - S0) / S0) / Math.LN2); // 6.78 s
  const share = E => L.logistic(Math.max(0, E), DBL, S0);
  const RESTORE_S = A.threat.events.find(e => e.t === 9).t * 3600; // 9 h -> 83%
  const restored = E => E <= FALL_S ? 0 : E <= RESTORE_S ? 0.83 * (E - FALL_S) / (RESTORE_S - FALL_S) : Math.min(1, 0.83 + 0.17 * (E - RESTORE_S) / (86400 - RESTORE_S));
  const isDark = (rank, E) => rank < share(E) && rank <= 1 - restored(E);
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;
  const LINK_H = [0.1, 0.3, 0.5, 0.7, 0.9].map(q => L.lognormalQuantile(q, MED, P90));
  const LINK_T = LINK_H.map(h => tOfE(h * 3600));
  const logX = (E, x0 = 90, w = 800, span = 8.6) => x0 + w * L.clamp(Math.log10(Math.max(1, E)) / span, 0, 1);

  // ---------------- helpers ----------------
  const poly = (ctx, pts) => { ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.closePath(); };
  const paper = (ctx, pts, fill, sh = 1) => { ctx.save(); if (sh) { ctx.shadowColor = `rgba(0,0,0,${0.5 * sh})`; ctx.shadowBlur = 14; ctx.shadowOffsetX = 5; ctx.shadowOffsetY = 9; }
    ctx.fillStyle = fill; poly(ctx, pts); ctx.fill(); ctx.restore(); };
  const jag = (pts, seed, amp = 3, step = 16) => { const out = []; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length];
      const n = Math.max(1, Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / step)); const nx = -(b[1] - a[1]), ny = b[0] - a[0], nl = Math.hypot(nx, ny) || 1;
      for (let k = 0; k < n; k++) { const f = k / n, j = (L.noise((i * 37 + k) * 1.31, seed) - 0.5) * 2 * amp; out.push([L.lerp(a[0], b[0], f) + nx / nl * j, L.lerp(a[1], b[1], f) + ny / nl * j]); } } return out; };
  const rect = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
  const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
  const shade = (h, b) => { const c = hex(h), d = [12, 14, 20]; return `rgb(${c.map((v, i) => Math.round(d[i] + (v - d[i]) * b)).join(',')})`; };
  const glow = (ctx, x, y, r, col, a) => { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col(a)); g.addColorStop(1, col(0)); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); };
  const creamA = a => `rgba(232,228,218,${a})`;
  const win = (t, a, b, f = 0.35) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));
  const card = (ctx, lines, y, a, size = 92) => { if (a > 0.01) L.title(ctx, lines, y, size, { alpha: a }); };
  const R0 = L.rng(1989);
  const FLAKES = Array.from({ length: 140 }, () => ({ x: R0() * 1080, y: R0() * 2000, s: 2 + R0() * 5, v: 40 + R0() * 70, p: R0() * 6 }));
  const snow = (ctx, t, a = 0.5) => { ctx.save(); ctx.fillStyle = '#c9ccd2'; FLAKES.forEach(f => { const y = (f.y + f.v * t) % 2000 - 40, x = f.x + Math.sin(t * 0.8 + f.p) * 18;
    ctx.globalAlpha = a * (0.4 + f.s / 9); ctx.beginPath(); ctx.arc(x, y, f.s, 0, 7); ctx.fill(); }); ctx.restore(); };

  // ---------------- the province (world coords, z=1 == design px) ----------------
  const PC = [540, 830], PRX = 380, PRY = 470;
  const rAt = th => 1 + 0.11 * (L.noise(th * 2.1 + 3, 5) - 0.5) * 2 + 0.05 * (L.noise(th * 6.3, 9) - 0.5) * 2;
  const OUT = []; for (let i = 0; i < 120; i++) { const th = i / 120 * Math.PI * 2; OUT.push([PC[0] + Math.cos(th) * PRX * rAt(th), PC[1] + Math.sin(th) * PRY * rAt(th)]); }
  const insideP = (x, y) => { const dx = (x - PC[0]) / PRX, dy = (y - PC[1]) / PRY; return Math.hypot(dx, dy) < rAt((Math.atan2(dy, dx) + 2 * Math.PI) % (2 * Math.PI)) * 0.92; };
  const O = [500, 420];
  const H = [560, 1200];                     // our town / our house (also the crews' depot, f4)
  const FR = { f1: { p: [240, 1225], name: 'warning' }, f2: { p: [330, 1000], name: 'science' }, f3: { p: [650, 930], name: 'control room' },
    f4: { p: H, name: 'crews' }, f5: { p: [800, 1120], name: 'planners' } };
  const LOOP = [['f3', 'f4'], ['f4', 'f2'], ['f2', 'f1'], ['f1', 'f5'], ['f5', 'f3']];
  const TOWNS = []; while (TOWNS.length < 90) { const x = 170 + R0() * 740, y = 380 + R0() * 920; if (!insideP(x, y)) continue; if (R0() > L.lerp(0.15, 1, (y - 380) / 920)) continue; TOWNS.push({ x, y, s: 3 + R0() * 4 }); }
  TOWNS.push({ x: H[0], y: H[1], s: 7, home: true });
  const dO = p => Math.hypot(p[0] - O[0], p[1] - O[1]);
  const DS = TOWNS.map(c => dO([c.x, c.y])).sort((a, b) => a - b);
  const rankOfD = d => { let k = 0; while (k < DS.length && DS[k] < d) k++; return (k + 0.5) / DS.length; };
  TOWNS.forEach(c => { c.rank = rankOfD(dO([c.x, c.y])); });
  const HOUSE_RANK = rankOfD(dO(H));
  const T_HOUSE = tOfE((() => { let lo = 0, hi = 90; for (let i = 0; i < 50; i++) { const m = (lo + hi) / 2; share(m) < HOUSE_RANK ? lo = m : hi = m; } return lo; })());
  if (process.env.WOI_DEBUG) console.log('houseRank', HOUSE_RANK.toFixed(3), 'T_HOUSE', T_HOUSE.toFixed(2), 'DBL', DBL.toFixed(2), 'LINK_T', LINK_T.map(v => v.toFixed(2)).join(' '));
  const CORR = [[O, [420, 760], [330, 1000], [240, 1225]], [O, [540, 900], H], [O, [600, 700], [650, 930], [740, 1180]], [O, [720, 640], [800, 1120]], [O, [430, 620], [300, 780]]];
  const LINES = CORR.map((pts, ci) => { const s = []; for (let i = 0; i < pts.length - 1; i++) for (let k = 0; k < 14; k++) { const f = k / 14; const x = L.lerp(pts[i][0], pts[i + 1][0], f), y = L.lerp(pts[i][1], pts[i + 1][1], f);
    s.push([x + (L.noise(s.length * 0.7, ci) - 0.5) * 10, y]); } s.push(pts[pts.length - 1]); return s.map(p => ({ p, rank: rankOfD(dO(p)) })); });
  const ROOFS = []; { const R = L.rng(77); for (let gx = -6; gx <= 6; gx++) for (let gy = -5; gy <= 5; gy++) { if (gx === 0 && gy === 0) continue; if (R() < 0.3) continue;
    ROOFS.push({ x: H[0] + gx * 3.6 + (R() - 0.5) * 0.8, y: H[1] + gy * 3.2 + (R() - 0.5) * 0.6, w: 1.8 + R() * 0.9, h: 1.4 + R() * 0.6, rank: HOUSE_RANK + (R() - 0.5) * 0.02 }); } }

  // world map at camera {x, y, z}
  function map(ctx, t, cam, E, o = {}) {
    const z = cam.z, sp = (x, y) => [540 + (x - cam.x) * z, 960 + (y - cam.y) * z];
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    ctx.save(); ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-cam.x, -cam.y);
    const detail = L.sm(3, 8, z), far = 1 - L.sm(2.5, 6, z);
    // paper sea layers + province card
    ctx.fillStyle = '#12151b'; ctx.fillRect(cam.x - 600 / z, cam.y - 1000 / z, 1200 / z, 2000 / z);
    paper(ctx, jag(OUT.map(p => [p[0] + 14, p[1] + 10]), 3, 5), '#181c23', 0);
    paper(ctx, jag(OUT, 4, 4), '#262b34', 1);
    // river ribbon
    ctx.strokeStyle = '#1a1e25'; ctx.lineWidth = 16; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(180, 1330); ctx.quadraticCurveTo(560, 1240, 960, 1010); ctx.stroke();
    // lines (pylon corridors): gray when live, red when down
    LINES.forEach(seg => { for (let i = 0; i < seg.length - 1; i++) { const d = isDark(seg[i].rank, E);
      ctx.strokeStyle = d ? RED : '#6b7380'; ctx.lineWidth = (d ? 5 : 3) / Math.max(1, z * 0.6); if (d) { ctx.shadowColor = rgbaR(0.8); ctx.shadowBlur = 12; } else ctx.shadowBlur = 0;
      ctx.beginPath(); ctx.moveTo(seg[i].p[0], seg[i].p[1]); ctx.lineTo(seg[i + 1].p[0], seg[i + 1].p[1]); ctx.stroke(); } }); ctx.shadowBlur = 0;
    // towns (lights)
    if (far > 0.01) TOWNS.forEach(c => { if (c.home && z > 2) return; const on = !isDark(c.rank, E); ctx.globalAlpha = far;
      if (on) { glow(ctx, c.x, c.y, c.s * 3.2, creamA, 0.35); ctx.fillStyle = '#d8d2c0'; } else ctx.fillStyle = '#141820';
      ctx.beginPath(); ctx.arc(c.x, c.y, c.s * 0.7, 0, 7); ctx.fill(); ctx.globalAlpha = 1; });
    // our town, close up: roofs in snow
    if (detail > 0.01) { ctx.globalAlpha = detail;
      ctx.fillStyle = '#1c2027'; ctx.fillRect(H[0] - 26, H[1] - 1.2, 52, 1.0); ctx.fillRect(H[0] - 1.9, H[1] - 20, 0.9, 40);
      const roof = (x, y, w, h, lit, seed, me) => { if (lit) glow(ctx, x, y, w * 1.6, creamA, 0.28);
        paper(ctx, jag(rect(x - w / 2, y - h / 2, x + w / 2, y + h / 2), seed, 0.06, 0.4), me ? '#9ea3ab' : '#858a93', 1);
        ctx.fillStyle = '#6a6f78'; ctx.fillRect(x - w / 2, y - 0.04, w, 0.08); };
      ROOFS.forEach((r, i) => roof(r.x, r.y, r.w, r.h, !isDark(r.rank, E), 20 + i, false));
      roof(H[0], H[1], 2.6, 2.0, !isDark(HOUSE_RANK, E), 9, true);
      ctx.fillStyle = '#50565f'; ctx.fillRect(H[0] + 0.6, H[1] - 0.8, 0.35, 0.35); // chimney
      glow(ctx, H[0] - 0.4, H[1] + 0.3, 1.2, rgbaG, 0.45 * (o.homeGlow ?? 1));   // the lamp inside
      ctx.globalAlpha = 1; }
    // links (green) + failed attempts
    const P = id => FR[id].p;
    const arc = (a, b, f) => { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1]; const cx = mx - dy * 0.18, cy = my + dx * 0.18; const pts = [];
      for (let i = 0; i <= 30 * f; i++) { const u = i / 30; pts.push([(1 - u) * (1 - u) * a[0] + 2 * (1 - u) * u * cx + u * u * b[0], (1 - u) * (1 - u) * a[1] + 2 * (1 - u) * u * cy + u * u * b[1]]); } return pts; };
    const lw = 5 / Math.max(1, z * 0.7);
    if (o.links !== false) LOOP.forEach(([a, b], i) => { const lt = t - LINK_T[i];
      if (lt >= 0 && o.clockLive) { const pts = arc(P(a), P(b), L.clamp(lt / 0.45, 0.02, 1)); ctx.strokeStyle = GREEN; ctx.lineWidth = lw * 1.2; ctx.shadowColor = rgbaG(0.8); ctx.shadowBlur = 14;
        ctx.beginPath(); pts.forEach((p, k) => k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.shadowBlur = 0; }
      else { const per = 1.3 + i * 0.17, ph = ((t + i * 0.41) % per) / per; if (ph < 0.75) { const f = ph / 0.75, pts = arc(P(a), P(b), 0.42 * f);
        const s = Math.max(0, pts.length - 6); ctx.strokeStyle = rgbaG(0.75 * (1 - f)); ctx.lineWidth = lw; ctx.setLineDash([10 / z, 8 / z]);
        ctx.beginPath(); pts.slice(s).forEach((p, k) => k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); ctx.setLineDash([]); } } });
    // fragment buildings (screen-constant size)
    Object.entries(FR).forEach(([id, f]) => { if (id === 'f4' && z > 2) return; const s = 30 / Math.max(1, z * 0.8), [x, y] = f.p;
      glow(ctx, x, y, s * 2.4, rgbaG, 0.45 + 0.1 * Math.sin(t * 3 + x));
      paper(ctx, [[x - s * 0.6, y + s * 0.5], [x - s * 0.6, y - s * 0.2], [x, y - s * 0.75], [x + s * 0.6, y - s * 0.2], [x + s * 0.6, y + s * 0.5]], '#4d5561', 1);
      ctx.fillStyle = GREEN; ctx.fillRect(x - s * 0.22, y - s * 0.1, s * 0.44, s * 0.38); });
    ctx.restore();
    // labels in screen space
    const la = (o.labels ?? 0) * (1 - L.sm(1.4, 2.2, z));
    if (la > 0.01) { const place = { f1: [30, 14, 'left'], f2: [-30, -30, 'right'], f3: [0, -44, 'center'], f4: [0, 70, 'center'], f5: [-34, -34, 'right'] };
      Object.entries(FR).forEach(([id, f]) => { const [x, y] = sp(f.p[0], f.p[1]), [dx, dy, al] = place[id];
        L.label(ctx, f.name, x + dx, y + dy, 44, { col: '#bff0d2', alpha: la, align: al }); }); }
    if (o.ringGlow) { const [x, y] = sp(560, 1080); ctx.save(); ctx.globalCompositeOperation = 'screen'; glow(ctx, x, y, 360 * z, rgbaG, 0.18 * o.ringGlow); ctx.restore(); }
  }
  const zoomCam = (a, b, u) => { const z = Math.exp(L.lerp(Math.log(a.z), Math.log(b.z), u)); const w = (1 / z - 1 / a.z) / (1 / b.z - 1 / a.z);
    return { z, x: L.lerp(a.x, b.x, w), y: L.lerp(a.y, b.y, w) }; };
  const CAM_HOUSE = { x: H[0], y: H[1], z: 70 }, CAM_WIDE = { x: 540, y: 900, z: 1.0 }, CAM_HIGH = { x: 540, y: 880, z: 0.88 };

  // ---------------- outside view (through a window) ----------------
  function outside(ctx, x0, y0, w, h, E, t, b) {
    ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, w, h); ctx.clip();
    ctx.fillStyle = '#1a1f29'; ctx.fillRect(x0, y0, w, h);
    const hz = y0 + h * 0.58; ctx.fillStyle = '#4f545d'; ctx.fillRect(x0, hz, w, h);
    paper(ctx, jag([[x0, hz + 4], [x0 + w * 0.3, hz - h * 0.05], [x0 + w * 0.6, hz + 2], [x0 + w, hz - h * 0.04], [x0 + w, y0 + h], [x0, y0 + h]], 12, h * 0.01, h * 0.05), '#5e636c', 0.6);
    // far lights along the horizon: they go out as the red passes
    const fr = L.clamp(share(E) / HOUSE_RANK, 0, 1);
    const back = restored(E);
    for (let i = 0; i < 9; i++) { const f = (i + 0.5) / 9, lx = x0 + w * (0.08 + 0.84 * f), on = !(f * HOUSE_RANK < share(E) && f * HOUSE_RANK <= 1 - back);
      ctx.fillStyle = on ? '#d8d2c0' : '#262a31'; ctx.fillRect(lx, hz - h * 0.03, w * 0.012, h * 0.018); }
    // pylons from far (left, horizon) to near (right)
    const FP = [x0 + w * 0.06, hz - h * 0.02], NP = [x0 + w * 0.9, y0 + h * 0.2];
    const g = f => Math.pow(f, 1.8);
    const top = f => [L.lerp(FP[0], NP[0], g(f)), L.lerp(FP[1], NP[1], g(f))];
    const baseY = f => L.lerp(hz, y0 + h * 1.02, g(f));
    [0, 0.25, 0.45, 0.62, 0.78, 0.9, 1].forEach(f => { const [tx, ty] = top(f), by = baseY(f), s = L.lerp(0.02, 0.12, g(f)) * w;
      ctx.strokeStyle = '#7b8390'; ctx.lineWidth = Math.max(1, s * 0.07); ctx.beginPath(); ctx.moveTo(tx - s * 0.35, by); ctx.lineTo(tx, ty); ctx.lineTo(tx + s * 0.35, by);
      ctx.moveTo(tx - s * 0.5, ty + s * 0.15); ctx.lineTo(tx + s * 0.5, ty + s * 0.15); ctx.stroke(); });
    const wire = (f0, f1, col, lw) => { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); for (let i = 0; i <= 40; i++) { const f = L.lerp(f0, f1, i / 40), [x, y] = top(f); const sag = Math.sin((f * 6) % 1 * Math.PI) * h * 0.01;
      i ? ctx.lineTo(x, y + sag) : ctx.moveTo(x, y + sag); } ctx.stroke(); };
    wire(0, 1, '#8a919c', Math.max(1.5, w * 0.004));
    const rf = fr * (1 - L.sm(0.02, 0.6, back));
    if (E > 0 && rf > 0) { ctx.save(); ctx.shadowColor = rgbaR(0.9); ctx.shadowBlur = 18; wire(0, rf, RED, Math.max(3, w * 0.012)); ctx.restore();
      const [hx, hy] = top(rf), r = L.lerp(w * 0.012, w * 0.05, g(rf));
      if (back < 0.05) { glow(ctx, hx, hy, r * 5, rgbaR, 0.55); ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(hx, hy, r, 0, 7); ctx.fill(); } }
    snow(ctx, t, 0.35);
    ctx.restore();
  }

  // ---------------- the hallway (one-point perspective, paper walls) ----------------
  const F = 620;
  function hall(ctx, t, cz, b, o = {}) {
    const bob = o.bob || 0, hzY = 900 + bob + (o.tilt || 0);
    const P3 = (x, y, z) => { const d = Math.max(0.22, z - cz); return [540 + F * x / d, hzY - F * y / d]; };
    const quad = (a, b2, c, d) => [P3(...a), P3(...b2), P3(...c), P3(...d)];
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    const zn = cz + 0.25, ZE = 6, ZK = 7.4, FY = -1.05, CY = 0.95, WX = 0.9;
    // kitchen (seen through the door)
    paper(ctx, quad([-1.8, CY, ZK], [1.8, CY, ZK], [1.8, FY, ZK], [-1.8, FY, ZK]), shade('#4a515b', b), 0);
    const w0 = P3(-0.95, 0.75, ZK), w1 = P3(0.95, -0.25, ZK);
    outside(ctx, w0[0], w0[1], w1[0] - w0[0], w1[1] - w0[1], o.E, t, b);
    ctx.strokeStyle = shade('#6b7380', b); ctx.lineWidth = Math.max(3, (w1[0] - w0[0]) * 0.02); ctx.strokeRect(w0[0], w0[1], w1[0] - w0[0], w1[1] - w0[1]);
    const mid = [(w0[0] + w1[0]) / 2, (w0[1] + w1[1]) / 2]; ctx.beginPath(); ctx.moveTo(mid[0], w0[1]); ctx.lineTo(mid[0], w1[1]); ctx.moveTo(w0[0], mid[1]); ctx.lineTo(w1[0], mid[1]); ctx.stroke();
    paper(ctx, quad([-1.8, FY, 6], [1.8, FY, 6], [1.8, FY, ZK], [-1.8, FY, ZK]), shade('#3d424a', b), 0);
    // helmet + coat on the kitchen wall hook (Maman's): the green lamp
    const hk = P3(-1.25, 0.3, ZK), hs = F / Math.max(0.22, ZK - cz) * 0.22;
    paper(ctx, jag([[hk[0] - hs * 0.5, hk[1] + hs * 0.4], [hk[0] - hs * 0.8, hk[1] + hs * 2.4], [hk[0] + hs * 0.8, hk[1] + hs * 2.4], [hk[0] + hs * 0.5, hk[1] + hs * 0.4]], 31, hs * 0.03, hs * 0.3), shade('#39404a', b), 1);
    ctx.fillStyle = shade('#5d6470', b); ctx.beginPath(); ctx.ellipse(hk[0], hk[1], hs * 0.62, hs * 0.5, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(hk[0] - hs * 0.75, hk[1] - 2, hs * 1.5, hs * 0.14);
    glow(ctx, hk[0], hk[1] - hs * 0.25, hs * 1.6, rgbaG, 0.55); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(hk[0], hk[1] - hs * 0.25, hs * 0.17, 0, 7); ctx.fill();
    // table edge
    paper(ctx, quad([0.2, -0.3, 6.9], [1.5, -0.3, 6.9], [1.5, FY, 6.9], [0.2, FY, 6.9]), shade('#2e333b', b), 1);
    // end wall with the doorway
    const ew = shade('#5c636e', b);
    paper(ctx, quad([-WX, CY, ZE], [-0.6, CY, ZE], [-0.6, FY, ZE], [-WX, FY, ZE]), ew, 0);
    paper(ctx, quad([0.6, CY, ZE], [WX, CY, ZE], [WX, FY, ZE], [0.6, FY, ZE]), ew, 0);
    paper(ctx, quad([-0.6, CY, ZE], [0.6, CY, ZE], [0.6, 0.62, ZE], [-0.6, 0.62, ZE]), ew, 0);
    ctx.strokeStyle = shade('#737b88', b); ctx.lineWidth = Math.max(2, F / Math.max(0.22, ZE - cz) * 0.03); poly(ctx, [P3(-0.6, FY, ZE), P3(-0.6, 0.62, ZE), P3(0.6, 0.62, ZE), P3(0.6, FY, ZE)]); ctx.stroke();
    // floor, ceiling, walls
    paper(ctx, quad([-WX, FY, zn], [WX, FY, zn], [WX, FY, ZE], [-WX, FY, ZE]), shade('#3f444c', b), 0);
    for (let k = 0; k < 7; k++) { const z = Math.floor(cz) + k + 0.5; if (z < zn || z > ZE) continue; ctx.strokeStyle = shade('#353a42', b); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(...P3(-WX, FY, z)); ctx.lineTo(...P3(WX, FY, z)); ctx.stroke(); }
    paper(ctx, quad([-0.35, FY, Math.max(zn, 0.4)], [0.35, FY, Math.max(zn, 0.4)], [0.35, FY, 5.9], [-0.35, FY, 5.9]), shade('#4b4f55', b), 0); // runner rug
    paper(ctx, quad([-WX, CY, zn], [WX, CY, zn], [WX, CY, ZE], [-WX, CY, ZE]), shade('#474d57', b), 0);
    paper(ctx, quad([-WX, CY, zn], [-WX, CY, ZE], [-WX, FY, ZE], [-WX, FY, zn]), shade('#59606b', b), 0);
    paper(ctx, quad([WX, CY, zn], [WX, CY, ZE], [WX, FY, ZE], [WX, FY, zn]), shade('#525964', b), 0);
    const onWall = (sx, z0, z1, y0, y1, col, sh = 1) => { if (z1 < zn) return; const za = Math.max(z0, zn); paper(ctx, quad([sx, y1, za], [sx, y1, z1], [sx, y0, z1], [sx, y0, za]), col, sh); };
    onWall(-WX, 1.6, 2.5, FY, 0.6, shade('#3a404a', b)); onWall(WX, 3.2, 4.1, FY, 0.6, shade('#3a404a', b));
    onWall(-WX, 3.6, 4.3, 0.02, 0.42, shade('#6b7380', b)); onWall(-WX, 3.68, 4.22, 0.08, 0.36, shade('#2f343c', b), 0);
    onWall(WX, 1.2, 1.9, 0.1, 0.4, shade('#6b7380', b)); onWall(WX, 1.27, 1.83, 0.15, 0.35, shade('#2f343c', b), 0);
    // nightlight
    if (1.1 > zn) { const [nx, ny] = P3(WX - 0.01, -0.75, 1.1); if (b > 0.5) glow(ctx, nx, ny, 120 * (b - 0.4), creamA, 0.4); ctx.fillStyle = shade('#d8d2c0', Math.max(0.3, b)); ctx.fillRect(nx - 8, ny - 12, 16, 24); }
    // ceiling lamp light
    if (b > 0.5) { ctx.save(); ctx.globalCompositeOperation = 'screen'; const [lx, ly] = P3(0, 0.6, 7); glow(ctx, lx, ly + 60, 300, creamA, 0.18 * (b - 0.4)); ctx.restore(); }
    // red spill from the window when the red is near
    const fr = L.clamp(share(o.E) / HOUSE_RANK, 0, 1) * (1 - L.sm(0.02, 0.6, restored(o.E)));
    if (o.E > 0 && fr > 0.5) { ctx.save(); ctx.globalCompositeOperation = 'screen'; glow(ctx, w1[0] - (w1[0] - w0[0]) * 0.15, (w0[1] + w1[1]) / 2, (w1[0] - w0[0]) * 0.9, rgbaR, 0.28 * (fr - 0.5) * 2); ctx.restore(); }
  }
  // torch beam + the child's hand holding it (screen space, bottom right)
  function beam(ctx, lens, spot, r, a) { if (a <= 0) return; ctx.save(); ctx.globalCompositeOperation = 'screen';
    const dx = spot[0] - lens[0], dy = spot[1] - lens[1], d = Math.hypot(dx, dy), nx = -dy / d, ny = dx / d;
    const g = ctx.createLinearGradient(lens[0], lens[1], spot[0], spot[1]); g.addColorStop(0, creamA(0.22 * a)); g.addColorStop(1, creamA(0.05 * a));
    ctx.fillStyle = g; poly(ctx, [[lens[0] + nx * 20, lens[1] + ny * 20], [spot[0] + nx * r, spot[1] + ny * r], [spot[0] - nx * r, spot[1] - ny * r], [lens[0] - nx * 20, lens[1] - ny * 20]]); ctx.fill();
    glow(ctx, spot[0], spot[1], r * 1.25, creamA, 0.42 * a); ctx.restore(); }
  function handTorch(ctx, x, y, ang, on, s = 1) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(s, s);
    paper(ctx, jag(rect(-78, -70, 78, 460), 41, 2.5), '#3f4652', 1);
    ctx.fillStyle = '#353b46'; for (let k = 0; k < 5; k++) ctx.fillRect(-78, -20 + k * 70, 156, 22);
    paper(ctx, jag([[-30, -110], [30, -110], [30, -330], [-30, -330]], 43, 1.5), '#6b7380', 1);
    paper(ctx, jag([[-44, -330], [44, -330], [52, -390], [-52, -390]], 44, 1.5), '#7b8390', 1);
    ctx.fillStyle = on ? '#fffdf7' : '#3a414c'; ctx.beginPath(); ctx.ellipse(0, -390, 50, 12, 0, 0, 7); ctx.fill();
    paper(ctx, jag([[-62, -60], [62, -60], [66, -190], [-58, -196]], 42, 2), '#8e8882', 1);                // fist
    ctx.strokeStyle = '#6f6a65'; ctx.lineWidth = 4; [-150, -118, -86].forEach(yy => { ctx.beginPath(); ctx.moveTo(20, yy); ctx.lineTo(64, yy - 2); ctx.stroke(); });
    paper(ctx, jag([[-58, -190], [-20, -200], [-16, -150], [-60, -140]], 45, 1.5), '#9a948d', 0.6);          // thumb
    ctx.restore();
    const lx = x + 390 * s * Math.sin(ang), ly = y - 390 * s * Math.cos(ang); return [lx, ly];
  }

  // ---------------- log-time ruler (paper strip) ----------------
  function ruler(ctx, E, paused, a = 1) { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a;
    paper(ctx, jag(rect(70, 1336, 910, 1488), 51, 2), 'rgba(18,21,27,0.92)', 1);
    L.label(ctx, 'log time', 90, 1382, 44, { col: '#9aa0aa', align: 'left' });
    if (paused) L.label(ctx, 'paused', 890, 1382, 44, { col: CREAM, align: 'right' });
    const y = 1408; ctx.strokeStyle = '#6b7380'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(90, y); ctx.lineTo(890, y); ctx.stroke();
    [['second', 1, 'left'], ['minute', 60], ['hour', 3600], ['day', 86400], ['month', 2.63e6], ['year', 3.156e7]].forEach(([w, e, al]) => { const x = logX(e);
      ctx.fillStyle = '#6b7380'; ctx.fillRect(x - 2, y - 12, 4, 24); L.label(ctx, w, al ? x - 4 : x, 1466, 44, { col: '#b9bec6', align: al || 'center' }); });
    if (E > 0) { ctx.strokeStyle = RED; ctx.lineWidth = 12; ctx.beginPath(); ctx.moveTo(90, y); ctx.lineTo(logX(Math.min(E, FALL_S)), y); ctx.stroke(); }
    LINK_H.forEach(hh => { if (E >= hh * 3600) { ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(logX(hh * 3600), y, 10, 0, 7); ctx.fill(); } });
    const px = logX(E); ctx.fillStyle = CREAM; poly(ctx, [[px, y - 16], [px - 12, y - 36], [px + 12, y - 36]]); ctx.fill();
    ctx.restore(); }

  // ---------------- kitchen (the tender close) ----------------
  function maman(ctx, lt, o) {
    const hx = 560, hy = 860, r = 118;
    // coat body
    paper(ctx, jag([[hx - 250, 1560], [hx - 210, 1060], [hx - 90, 990], [hx + 90, 990], [hx + 210, 1060], [hx + 250, 1560]], 61, 3), '#3a414c', 1);
    paper(ctx, jag([[hx - 90, 992], [hx, 1110], [hx + 90, 992], [hx + 60, 960], [hx - 60, 960]], 62, 2), '#4d5561', 1); // collar
    ctx.fillStyle = '#2e343d'; for (let k = 0; k < 4; k++) { ctx.beginPath(); ctx.arc(hx, 1150 + k * 80, 9, 0, 7); ctx.fill(); }
    // hair back
    paper(ctx, jag([[hx - r * 1.12, hy + r * 0.3], [hx - r * 1.1, hy - r * 0.7], [hx - r * 0.5, hy - r * 1.18], [hx + r * 0.5, hy - r * 1.18], [hx + r * 1.1, hy - r * 0.7], [hx + r * 1.12, hy + r * 0.3]], 63, 3), '#22262d', 1);
    ctx.fillStyle = '#22262d'; ctx.beginPath(); ctx.arc(hx + r * 0.7, hy - r * 1.05, r * 0.38, 0, 7); ctx.fill();
    // face
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.45)'; ctx.shadowBlur = 14; ctx.shadowOffsetX = 5; ctx.shadowOffsetY = 9;
    ctx.fillStyle = '#9d968e'; ctx.beginPath(); ctx.ellipse(hx, hy, r * 0.86, r, 0, 0, 7); ctx.fill(); ctx.restore();
    paper(ctx, jag([[hx - r * 0.9, hy - r * 0.35], [hx - r * 0.6, hy - r * 0.95], [hx + r * 0.2, hy - r * 1.02], [hx + r * 0.8, hy - r * 0.7], [hx + r * 0.1, hy - r * 0.62], [hx - r * 0.5, hy - r * 0.45]], 64, 2), '#22262d', 1); // fringe
    const up = L.sm(0.8, 1.3, lt), tender = L.sm(1.6, 2.0, lt) * (1 - L.sm(3.6, 3.9, lt));
    ctx.strokeStyle = '#1b1f27'; ctx.fillStyle = '#1b1f27'; ctx.lineWidth = 6; ctx.lineCap = 'round';
    [-1, 1].forEach(d => { const ex = hx + d * r * 0.36, ey = hy - r * 0.08;
      if (tender > 0.5) { ctx.beginPath(); ctx.arc(ex, ey + 6, 16, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke(); }
      else { ctx.beginPath(); ctx.ellipse(ex, ey + L.lerp(12, -2, up), 10, L.lerp(5, 11, up), 0, 0, 7); ctx.fill(); } });
    ctx.beginPath(); ctx.arc(hx, hy + r * 0.34, L.lerp(16, 34, Math.max(up * 0.5, tender)), 0.2 * Math.PI, 0.8 * Math.PI); ctx.stroke();
    ctx.fillStyle = 'rgba(200,170,160,0.35)'; [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(hx + d * r * 0.5, hy + r * 0.3, 20, 0, 7); ctx.fill(); });
  }
  function glove(ctx, x, y, s, rot, col = '#5a616c') { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    paper(ctx, jag([[-46, 70], [-46, -40], [-30, -70], [30, -70], [46, -40], [46, 70]], 71, 1.5), col, 1);
    paper(ctx, jag([[-46, -10], [-80, -40], [-70, -60], [-40, -38]], 72, 1.5), col, 0.6);
    ctx.strokeStyle = '#3a404a'; ctx.lineWidth = 4; [-16, 0, 16].forEach(xx => { ctx.beginPath(); ctx.moveTo(xx, -70); ctx.lineTo(xx, -40); ctx.stroke(); });
    ctx.fillStyle = '#2b313b'; ctx.fillRect(-48, 50, 96, 24); ctx.restore(); }
  function helmet(ctx, x, y, s, ring = 0, t = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.save(); ctx.shadowColor = 'rgba(0,0,0,0.5)'; ctx.shadowBlur = 14; ctx.shadowOffsetX = 5; ctx.shadowOffsetY = 9;
    ctx.fillStyle = '#5d6470'; ctx.beginPath(); ctx.ellipse(0, 0, 120, 96, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(-150, -6, 300, 24); ctx.restore();
    ctx.fillStyle = '#4d5561'; ctx.fillRect(-8, -94, 16, 90);
    glow(ctx, 0, -40, 130, rgbaG, 0.55); ctx.fillStyle = '#2b313b'; ctx.beginPath(); ctx.arc(0, -40, 36, 0, 7); ctx.fill();
    ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(0, -40, 27, 0, 7); ctx.fill();
    if (ring > 0) { ctx.strokeStyle = GREEN; ctx.lineWidth = 5; ctx.shadowColor = rgbaG(0.9); ctx.shadowBlur = 16; ctx.beginPath();
      for (let k = 0; k <= 5 * ring; k++) { const a = -Math.PI / 2 + k / 5 * Math.PI * 2, px = Math.cos(a) * 62, py = -40 + Math.sin(a) * 62; k ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
      ctx.fillStyle = GREEN; for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + k / 5 * Math.PI * 2; ctx.beginPath(); ctx.arc(Math.cos(a) * 62, -40 + Math.sin(a) * 62, 9, 0, 7); ctx.fill(); } }
    ctx.restore(); }
  function kitchen(ctx, t, lt) {
    const E = Eat(t), push = 1 + 0.07 * L.ease.inOut(L.clamp(lt / 4, 0, 1));
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    ctx.save(); ctx.translate(560, 900); ctx.scale(push, push); ctx.translate(-560, -900);
    paper(ctx, rect(-100, -100, 1180, 2020), '#191d24', 0);
    outside(ctx, 640, 380, 360, 300, E, t, 0.3);
    ctx.strokeStyle = '#2f343c'; ctx.lineWidth = 12; ctx.strokeRect(640, 380, 360, 300); ctx.beginPath(); ctx.moveTo(820, 380); ctx.lineTo(820, 680); ctx.stroke();
    paper(ctx, jag(rect(40, 300, 260, 700), 81, 2), '#20252d', 1);   // cupboard
    ctx.fillStyle = '#2b313b'; ctx.fillRect(210, 490, 16, 40);
    maman(ctx, lt, {});
    // table
    paper(ctx, jag([[-40, 1300], [1120, 1300], [1120, 1920], [-40, 1920]], 83, 3), '#2b3038', 1);
    ctx.fillStyle = '#23272e'; ctx.fillRect(-40, 1300, 1160, 22);
    // helmet: on the table, then lifted by her glove
    const lift = L.ease.inOut(L.sm(2.2, 3.0, lt));
    const hx = L.lerp(330, 360, lift), hy = L.lerp(1290, 1150, lift);
    helmet(ctx, hx, hy, 0.95);
    glove(ctx, L.lerp(250, 300, lift), L.lerp(1420, 1180, lift) + (lift > 0 ? 0 : 60), 1.0, 0.2, '#5a616c');
    // her other glove reaches toward the child (toward camera, bottom left)
    const reach = L.ease.inOut(L.sm(3.0, 3.8, lt));
    if (lt > 2.9) glove(ctx, L.lerp(760, 380, reach), L.lerp(1360, 1640, reach), L.lerp(1.0, 1.9, reach), L.lerp(-0.3, 0.5, reach));
    ctx.restore();
    // torch beam on her face
    const lens = handTorch(ctx, 760, 1980, -0.34, true, 1.0);
    beam(ctx, lens, [560 + Math.sin(lt * 1.3) * 10, 880], 190, L.sm(0.1, 0.5, lt));
    snow(ctx, t, 0.0);
  }

  // ---------------- snap ----------------
  function snap(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920); L.grain(ctx, t, { alpha: 0.05 });
    const A1 = win(t, 31.55, 33.9, 0.25), A2 = L.sm(33.9, 34.2, t);
    if (A1 > 0.01) { ctx.save(); ctx.globalAlpha = A1;
      L.title(ctx, ['At true scale'], 470, 84);
      L.label(ctx, 'the lasting fix', 90, 650, 50, { col: '#b9bec6', align: 'left' });
      paper(ctx, jag(rect(90, 690, 990, 770), 91, 2), '#4d5561', 1);
      ctx.fillStyle = RED; ctx.fillRect(90, 670, 2, 120); glow(ctx, 91, 730, 40, rgbaR, 0.5);
      ctx.strokeStyle = RED; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(100, 850); ctx.lineTo(94, 800); ctx.stroke();
      L.label(ctx, 'the dark: too thin to see', 90, 900, 48, { col: '#ffb3ad', align: 'left' });
      ctx.restore(); }
    if (A2 > 0.01) { ctx.save(); ctx.globalAlpha = A2;
      const lane = (y, title, sub, ai) => {
        L.label(ctx, title, 90, y - 80, 52, { col: CREAM, align: 'left' });
        if (sub) L.label(ctx, sub, 90, y - 28, 46, { col: '#8fe8b4', align: 'left' });
        const x0 = 190; paper(ctx, jag(rect(80, y - 4, 990, y + 110), 92 + y, 2), '#161a21', 1);
        ctx.strokeStyle = '#6b7380'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0, y + 50); ctx.lineTo(980, y + 50); ctx.stroke();
        const lx = e => logX(e, x0, 700, 8.6);
        [['sec', 1], ['hour', 3600], ['year', 3.156e7]].forEach(([w, e]) => { ctx.fillStyle = '#6b7380'; ctx.fillRect(lx(e) - 2, y + 40, 4, 20); L.label(ctx, w, lx(e), y + 100, 44, { col: '#9aa0aa' }); });
        L.label(ctx, 'before', 88, y + 100, 44, { col: '#9aa0aa', align: 'left' });
        ctx.strokeStyle = RED; ctx.lineWidth = 14; ctx.beginPath(); ctx.moveTo(x0, y + 50); ctx.lineTo(lx(FALL_S), y + 50); ctx.stroke();
        LINK_H.forEach((hh, i) => { if (ai && i === 0) return; ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(lx(hh * 3600), y + 50, 11, 0, 7); ctx.fill(); });
        if (ai) { const p = L.sm(34.9, 35.4, t); ctx.fillStyle = GREEN; glow(ctx, 130, y + 50, 50 * p, rgbaG, 0.6); ctx.beginPath(); ctx.arc(130, y + 50, 16 * p, 0, 7); ctx.fill();
          ctx.strokeStyle = GREEN; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(146, y + 50); ctx.lineTo(L.lerp(146, x0 - 6, p), y + 50); ctx.stroke(); }
      };
      lane(640, 'As it happened', null, false);
      lane(1000, 'Warning routed first', 'illustrative', true);
      ctx.restore();
      card(ctx, ['Operators still decide.'], 1340, L.sm(35.3, 35.6, t), 68);
      L.label(ctx, 'Steel still takes years.', 540, 1440, 48, { col: '#b9bec6', alpha: L.sm(35.8, 36.1, t) }); }
    const fl = 1 - L.sm(31.4, 31.75, t); if (fl > 0) { ctx.fillStyle = `rgba(255,253,247,${0.85 * fl})`; ctx.fillRect(0, 0, 1080, 1920); }
  }

  // ---------------- draw ----------------
  function draw(ctx, t) {
    const E = Eat(t);
    // SC1 cold open: flash-forward at the doorway
    if (t < 1.4) {
      const flick = 0.55 + 0.35 * L.noise(t * 22, 3);
      hall(ctx, t, 5.05 + 0.15 * L.ease.out(t / 1.4), flick, { E });
      handTorch(ctx, 780, 1960, -0.3, false, 1.0);
      card(ctx, ['The answer', 'was already here.'], 330, 1, 96);
      L.grain(ctx, t, { alpha: 0.05 }); L.slate(ctx, 'SC1  COLD OPEN  CLOSE POV');
      const w = L.sm(1.2, 1.4, t); if (w > 0) { ctx.fillStyle = `rgba(14,16,21,${w})`; ctx.fillRect(0, 0, 1080, 1920); }
      return;
    }
    // SC2 POV walk (clock starts at 2.4)
    if (t < PA + 0.8) {
      const u = L.clamp((t - 1.4) / (PA - 1.4), 0, 1), cz = L.lerp(0, 3.3, L.ease.inOut(u) * 0.6 + u * 0.4);
      const step = cz * 3.1, bob = Math.sin(step * Math.PI) * 9;
      let b = 1; if (t > T_HOUSE - 0.35) b = t < T_HOUSE ? 0.6 + 0.4 * L.noise(t * 30, 7) : 0.28;
      const tilt = 1500 * L.ease.in(L.sm(PA, PA + 0.8, t));
      const tOn = T_HOUSE + 0.35, on = t > tOn;
      hall(ctx, t, cz, b, { E, bob, tilt });
      const lens = handTorch(ctx, 780 + bob * 0.5, 1960 + bob, -0.3 - 0.25 * L.sm(PA, PA + 0.6, t), on, 1.0);
      beam(ctx, lens, [L.lerp(560, 540, u), L.lerp(1120, 900, u) + bob - tilt * 0.6], 170, on ? L.sm(tOn, tOn + 0.1, t) : 0);
      ruler(ctx, E, false, L.sm(2.2, 2.6, t) * (1 - L.sm(PA + 0.2, PA + 0.6, t)));
      card(ctx, ['Moments earlier.'], 330, win(t, 1.4, 3.0), 96);
      card(ctx, ['Dark in seconds.'], 330, win(t, T_HOUSE + 0.1, PA + 0.8), 104);
      L.grain(ctx, t, { alpha: 0.05 }); L.slate(ctx, t < PA ? 'SC2  POV WALK' : 'SC3  CRANE UP (tilt)');
      if (t > PA + 0.5) { ctx.save(); ctx.globalAlpha = L.sm(PA + 0.5, PA + 0.8, t); map(ctx, t, CAM_HOUSE, E, {}); ctx.restore(); }
      return;
    }
    // SC3 crane up to the province (clock paused), SC4 drop down
    if (t < 12.2) {
      let cam; if (t < 10.2) cam = zoomCam(CAM_HOUSE, CAM_WIDE, L.ease.inOut(L.sm(7.0, 9.6, t))); else cam = zoomCam(CAM_WIDE, CAM_HOUSE, L.ease.inOut(L.sm(10.2, 11.8, t)));
      map(ctx, t, cam, E, { labels: win(t, 8.3, 10.4, 0.3) });
      snow(ctx, t, 0.25);
      ruler(ctx, E, true, win(t, 7.4, 11.4, 0.4));
      card(ctx, ['The pieces were', 'in different buildings.'], 300, win(t, 8.3, 10.6), 88);
      L.grain(ctx, t, { alpha: 0.05 }); L.slate(ctx, t < 10.2 ? 'SC3  CRANE UP' : 'SC4  DROP DOWN');
      if (t > 11.6) { ctx.save(); ctx.globalAlpha = L.sm(11.6, 12.2, t); kitchen(ctx, t, 0); ctx.restore(); }
      return;
    }
    // SC5 kitchen close (clock paused)
    if (t < PB + 0.4) {
      kitchen(ctx, t, t - 12.2);
      ruler(ctx, E, true, 0.9 * (1 - L.sm(PB - 0.2, PB + 0.2, t)));
      card(ctx, ['Maman was', 'one of the pieces.'], 300, win(t, 12.8, 15.6), 96);
      L.grain(ctx, t, { alpha: 0.05 }); L.slate(ctx, 'SC5  KITCHEN CLOSE');
      if (t > PB) { ctx.save(); ctx.globalAlpha = L.sm(PB, PB + 0.4, t); map(ctx, t, CAM_HOUSE, E, { clockLive: true }); ctx.restore(); }
      return;
    }
    // SC6 crane up 2: the clock runs on
    if (t < 28.6) {
      let cam; if (t < 18.6) cam = zoomCam(CAM_HOUSE, CAM_WIDE, L.ease.inOut(L.sm(PB + 0.3, 18.6, t))); else cam = zoomCam(CAM_WIDE, CAM_HIGH, L.ease.inOut(L.sm(21, 26, t)));
      const ring = L.sm(LINK_T[4], LINK_T[4] + 0.6, t);
      map(ctx, t, cam, E, { clockLive: true, labels: win(t, 18.4, 26.2, 0.4), ringGlow: ring });
      snow(ctx, t, 0.2);
      ruler(ctx, E, t >= TEND, L.sm(17.0, 17.5, t) * (1 - L.sm(28.2, 28.6, t)));
      card(ctx, ['The light came back', 'in hours.'], 300, win(t, LINK_T[0] - 0.2, 22.3), 88);
      card(ctx, ['The lasting fix', 'took 7 years.'], 300, win(t, 22.7, 26.1), 96);
      card(ctx, ['We slowed it down', 'so you could see it.'], 300, win(t, 26.1, 28.6), 92);
      L.grain(ctx, t, { alpha: 0.05 }); L.slate(ctx, t < 18.6 ? 'SC6  CRANE UP' : t < 26 ? 'SC6  WIDE, RISING' : 'SC6  HOLD');
      const fo = L.sm(28.3, 28.6, t); if (fo > 0) { ctx.fillStyle = `rgba(14,16,21,${fo})`; ctx.fillRect(0, 0, 1080, 1920); }
      return;
    }
    // SC7 reveal
    if (t < 31.4) {
      ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920); snow(ctx, t, 0.3); L.grain(ctx, t, { alpha: 0.06 });
      card(ctx, ['This happened.'], 760, L.sm(28.7, 29.1, t), 112);
      card(ctx, ['1989.'], 1010, L.sm(29.8, 30.1, t), 190);
      L.label(ctx, 'the family is imagined', 540, 1180, 44, { col: '#9aa0aa', alpha: L.sm(30.0, 30.3, t) });
      L.slate(ctx, 'SC7  REVEAL');
      return;
    }
    // SC8 snap
    if (t < 37.0) { snap(ctx, t); L.slate(ctx, 'SC8  SNAP'); const fo = L.sm(36.7, 37.0, t); if (fo > 0) { ctx.fillStyle = `rgba(14,16,21,${fo})`; ctx.fillRect(0, 0, 1080, 1920); } return; }
    // SC9 extreme close on the hands, then END
    if (t < 40.0) {
      const lt = t - 37.0, push = 1 + 0.1 * L.ease.inOut(L.clamp(lt / 2.6, 0, 1));
      ctx.fillStyle = '#191d24'; ctx.fillRect(0, 0, 1080, 1920);
      ctx.save(); ctx.translate(540, 1100); ctx.scale(push, push); ctx.translate(-540, -1100);
      paper(ctx, jag([[-40, 1180], [1120, 1180], [1120, 1960], [-40, 1960]], 97, 3), '#2b3038', 1);
      helmet(ctx, 540, 1170, 2.4, L.sm(37.3, 38.2, t), t);
      glove(ctx, 250, 1260, 2.0, 0.35, '#5a616c');
      ctx.save(); ctx.translate(840, 1300); ctx.rotate(-0.3); ctx.scale(1.8, 1.8);
      paper(ctx, jag([[-50, 90], [-54, -20], [-36, -76], [20, -86], [50, -40], [52, 90]], 98, 3), '#6b6570', 1);
      paper(ctx, jag([[-54, 10], [-86, -24], [-74, -50], [-44, -26]], 99, 2), '#6b6570', 0.6);
      ctx.fillStyle = '#57525c'; for (let k = 0; k < 6; k++) ctx.fillRect(-52 + k * 18, 64, 9, 30); ctx.restore();
      ctx.restore();
      ctx.save(); ctx.globalCompositeOperation = 'screen'; glow(ctx, 600, 1000, 520, creamA, 0.16); ctx.restore();
      card(ctx, ['This is the bottleneck.'], 380, L.sm(37.6, 38.0, t), 96);
      L.grain(ctx, t, { alpha: 0.05 }); L.slate(ctx, 'SC9  EXTREME CLOSE');
      if (t > 39.6) L.endCard(ctx, L.sm(39.6, 40.0, t), { line: 'Help close the gap.' });
      return;
    }
    L.endCard(ctx, 1, { line: 'Help close the gap.' }); L.slate(ctx, 'END');
  }

  return {
    draw, DUR,
    acts: [
      { start: 0, end: 6.2, bpm: 0, drone: true },
      { start: 6.2, end: 16.2, bpm: 56, drone: true },
      { start: 16.2, end: 28.6, bpm: 0, drone: true },
      { start: 28.6, end: 31.0, bpm: 0, drone: true },
      { start: 31.4, end: 39.6, bpm: 0, drone: true },
      { start: 39.6, end: 43.6, bpm: 0, drone: true },
    ],
    cues: [
      { t: 0.1, type: 'bonk' }, { t: 1.3, type: 'whoosh' }, { t: T_HOUSE, type: 'stamp' }, { t: T_HOUSE + 0.35, type: 'pop' },
      { t: 6.3, type: 'whoosh' }, { t: 10.2, type: 'whoosh' }, { t: 14.2, type: 'ding' }, { t: 16.3, type: 'whoosh' },
      { t: LINK_T[0], type: 'pop' }, { t: LINK_T[1], type: 'pop' }, { t: LINK_T[2], type: 'pop' }, { t: LINK_T[3], type: 'pop' }, { t: LINK_T[4], type: 'ding' },
      { t: 29.8, type: 'stamp' }, { t: 31.4, type: 'hit' }, { t: 34.9, type: 'ding' }, { t: 37.3, type: 'ding' }, { t: 39.6, type: 'ding' },
    ],
  };
}
if (typeof module !== 'undefined') module.exports = makeScene;
