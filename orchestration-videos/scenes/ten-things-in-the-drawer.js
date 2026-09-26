// ten-things-in-the-drawer ("3 things we already had"): countdown-list, embroidery, market. Analog: gfc-2008.
// Race mapping (linear): day = 40 * (t - 1.5), days 0..584 over t 1.5..16.1. See output/ten-things-in-the-drawer/notes.md.
// Red thread: drawn length = extent(day) (piecewise-linear over threat.points) x fixed path length.
// Green links: L.lognormalQuantile(q, 426, 1077); AI: same x 220/426 (ai_counterfactual, illustrative).
// Only f2 (verified) wording is on screen: "central banks", "swap lines", "coordinated liquidity".
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('gfc-2008');
  const DUR = 36, RED = L.RED, GREEN = L.GREEN;
  const LINEN = '#cdc7ba', LINEN2 = '#bfb8aa', STITCH = '#5c5750', PENCIL = 'rgba(70,66,60,0.35)', WOOD = '#6f6960', WOOD2 = '#4d4943', TABLE = '#1c1b1a';
  const SKIN = '#b4ada3', SKIN_D = '#3a3632';

  // ---------- speed math ----------
  const PTS = A.threat.points;
  const extent = d => { if (d <= PTS[0].t) return 0; for (let i = 0; i < PTS.length - 1; i++) { const a = PTS[i], b = PTS[i + 1]; if (d <= b.t) return L.lerp(a.extent, b.extent, (d - a.t) / (b.t - a.t)); } return 1; };
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;   // 426, 1077
  const AIMED = A.ai_counterfactual.aggregation_median;                          // 220
  const F2 = A.solution.fragments.find(f => f.id === 'f2');                      // verified, ready_at 125
  const NL = 8;
  const HUM = [], AI = []; for (let i = 0; i < NL; i++) { const q = L.lognormalQuantile((i + 0.5) / NL, MED, P90); HUM.push(q); AI.push(q * AIMED / MED); }
  const R0 = 1.5, DPS = 40, END_DAY = PTS[PTS.length - 1].t;                    // 584
  const dayAt = t => L.clamp((t - R0) * DPS, 0, END_DAY);
  const tOf = d => R0 + d / DPS;
  const STITCH_DAYS = 25;

  // ---------- setup ----------
  const r = L.rng(2008);
  const C = [540, 880], RH = 440, CS = 13;
  const BANK = ['...X...', '..XXX..', '.XXXXX.', 'XXXXXXX', 'X.X.X.X', 'X.X.X.X', 'XXXXXXX'];
  const HOUSE = ['..X..', '.XXX.', 'XXXXX', '.X.X.', '.XXX.'];
  const FACT = ['X......', 'X..X..X', 'X.XX.XX', 'XXXXXXX', 'X.X.X.X', 'XXXXXXX'];
  const SHOP = ['XXXXX', 'X...X', 'XXXXX', 'X.X.X', 'XXXXX'];
  const BANKS = [[330, 660], [750, 630], [560, 850], [310, 1060], [770, 1040]];
  const items = [];
  BANKS.forEach(([x, y], i) => items.push({ x, y, pat: BANK, kind: 'bank', i }));
  const FACTS = [[470, 520], [700, 770], [880, 850], [200, 800]];
  FACTS.forEach(([x, y]) => items.push({ x, y, pat: FACT, kind: 'fact' }));
  items.push({ x: 230, y: 1120, pat: SHOP, kind: 'fund' });
  let guard = 0;
  while (items.length < 40 && guard++ < 4000) { const a = r() * Math.PI * 2, d = Math.sqrt(r()) * 370, x = C[0] + Math.cos(a) * d, y = C[1] + Math.sin(a) * d;
    if (items.every(o => Math.hypot(o.x - x, o.y - y) > (o.kind === 'house' ? 80 : 115))) items.push({ x, y, pat: r() < 0.8 ? HOUSE : SHOP, kind: 'house' }); }
  items.forEach(o => { o.cells = []; const h = o.pat.length, w = o.pat[0].length;
    o.pat.forEach((row, ry) => [...row].forEach((ch, rx) => { if (ch === 'X') o.cells.push([o.x + (rx - (w - 1) / 2) * CS, o.y + (ry - (h - 1) / 2) * CS, r(), r()]); })); });

  // red path, Catmull-Rom sampled
  const WP = [[230, 1120], [300, 1010], [240, 900], [290, 780], [420, 730], [520, 640], [640, 580], [760, 690], [690, 820], [620, 930], [700, 1030], [820, 1100], [885, 1170], [930, 1300], [950, 1480]];
  const PATH = []; for (let i = 0; i < WP.length - 1; i++) { const p0 = WP[Math.max(0, i - 1)], p1 = WP[i], p2 = WP[i + 1], p3 = WP[Math.min(WP.length - 1, i + 2)];
    for (let k = 0; k < 16; k++) { const s = k / 16, s2 = s * s, s3 = s2 * s; PATH.push([0, 1].map(j => 0.5 * (2 * p1[j] + (-p0[j] + p2[j]) * s + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * s2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * s3))); } }
  PATH.push(WP[WP.length - 1]);
  const CUM = [0]; for (let i = 1; i < PATH.length; i++) CUM.push(CUM[i - 1] + Math.hypot(PATH[i][0] - PATH[i - 1][0], PATH[i][1] - PATH[i - 1][1]));
  const PLEN = CUM[CUM.length - 1];
  // when the thread reaches each building (fraction of path at nearest approach within 70 px)
  items.forEach(o => { let best = 1e9, f = 2; PATH.forEach((p, i) => { const d = Math.hypot(p[0] - o.x, p[1] - o.y); if (d < best) { best = d; f = CUM[i] / PLEN; } }); o.hitAt = best < 75 ? f : 2; });

  // green: swap lines (f2) = spokes from the centre bank; human links from the lognormal
  const SPOKES = [0, 1, 3, 4].map((b, k) => ({ a: BANKS[2], b: BANKS[b], d0: 60 + k * 16, d1: 60 + (k + 1) * 16.25 }));
  const near = (x, y, kind) => items.filter(o => o.kind === kind).sort((p, q) => Math.hypot(p.x - x, p.y - y) - Math.hypot(q.x - x, q.y - y));
  const H = items.filter(o => o.kind === 'house');
  const LINKS = [
    [BANKS[2], near(450, 1000, 'house')[0]], [BANKS[2], [700, 770]], [BANKS[0], near(200, 560, 'house')[0]], [BANKS[1], near(860, 560, 'house')[0]],
    [BANKS[3], [200, 800]], [BANKS[4], near(640, 1220, 'house')[0]], [BANKS[0], [470, 520]], [BANKS[4], [880, 850]],
  ].map(([a, b], i) => { const bx = Array.isArray(b) ? b[0] : b.x, by = Array.isArray(b) ? b[1] : b.y; const mx = (a[0] + bx) / 2, my = (a[1] + by) / 2;
    const nx = -(by - a[1]), ny = bx - a[0], nl = Math.hypot(nx, ny) || 1, bend = (r() - 0.5) * 0.35 * nl; return { a, b: [bx, by], c: [mx + nx / nl * bend, my + ny / nl * bend], i }; });
  const weave = []; for (let k = -RH; k <= RH; k += 9) weave.push(k);
  const specks = []; for (let i = 0; i < 260; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * RH; specks.push([C[0] + Math.cos(a) * d, C[1] + Math.sin(a) * d, r()]); }

  // ---------- drawing helpers ----------
  const qpt = (l, s) => { const u = 1 - s; return [u * u * l.a[0] + 2 * u * s * l.c[0] + s * s * l.b[0], u * u * l.a[1] + 2 * u * s * l.c[1] + s * s * l.b[1]]; };
  function running(ctx, pt, p, col, w, dash = 0.045) { // running stitch along param 0..p
    if (p <= 0) return; ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round';
    for (let s = 0; s < p; s += dash * 2) { const e = Math.min(p, s + dash); const A0 = pt(s), B0 = pt(e); ctx.beginPath(); ctx.moveTo(A0[0], A0[1]); ctx.lineTo(B0[0], B0[1]); ctx.stroke(); } }
  function pencil(ctx, pt) { ctx.fillStyle = PENCIL; for (let s = 0; s <= 1; s += 0.035) { const q = pt(s); ctx.beginPath(); ctx.arc(q[0], q[1], 1.8, 0, 7); ctx.fill(); } }
  function knot(ctx, x, y, rad, a = 1) { ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = 'rgba(52,210,123,0.22)'; ctx.beginPath(); ctx.arc(x, y, rad * 2.1, 0, 7); ctx.fill();
    ctx.fillStyle = '#1f7a45'; ctx.beginPath(); ctx.arc(x, y, rad, 0, 7); ctx.fill(); ctx.fillStyle = GREEN;
    for (let k = 0; k < 5; k++) { const an = k * 1.257; ctx.beginPath(); ctx.arc(x + Math.cos(an) * rad * 0.42, y + Math.sin(an) * rad * 0.42, rad * 0.5, 0, 7); ctx.fill(); }
    ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.beginPath(); ctx.arc(x - rad * 0.3, y - rad * 0.35, rad * 0.22, 0, 7); ctx.fill(); ctx.restore(); }
  function xstitch(ctx, x, y, j1, j2) { const h = CS * 0.36; ctx.beginPath(); ctx.moveTo(x - h, y - h + j1); ctx.lineTo(x + h, y + h); ctx.moveTo(x + h, y - h); ctx.lineTo(x - h, y + h + j2); ctx.stroke(); }

  // the world: hoop on linen in an open drawer. linkDay(i) = day link i completes.
  function world(ctx, day, linkDays, { hand = null, pulse = 0, t = 0 } = {}) {
    ctx.fillStyle = TABLE; ctx.fillRect(-300, -300, 1700, 2600);
    // drawer
    ctx.fillStyle = '#2b2927'; ctx.fillRect(40, 300, 1000, 1300); ctx.strokeStyle = '#3d3a37'; ctx.lineWidth = 14; ctx.strokeRect(40, 300, 1000, 1300);
    ctx.fillStyle = '#34312e'; ctx.fillRect(20, 1580, 1040, 90); ctx.fillStyle = '#4a4642'; ctx.fillRect(470, 1612, 140, 22);
    // loose linen under the hoop
    ctx.fillStyle = LINEN2; ctx.beginPath(); ctx.moveTo(90, 380); ctx.lineTo(1000, 350); ctx.lineTo(1010, 1440); ctx.lineTo(80, 1420); ctx.closePath(); ctx.fill();
    // taut linen in the hoop
    ctx.save(); ctx.beginPath(); ctx.arc(C[0], C[1], RH, 0, 7); ctx.clip();
    ctx.fillStyle = LINEN; ctx.fillRect(C[0] - RH, C[1] - RH, RH * 2, RH * 2);
    ctx.strokeStyle = 'rgba(90,84,74,0.10)'; ctx.lineWidth = 1.2; ctx.beginPath();
    weave.forEach(k => { ctx.moveTo(C[0] + k, C[1] - RH); ctx.lineTo(C[0] + k, C[1] + RH); ctx.moveTo(C[0] - RH, C[1] + k); ctx.lineTo(C[0] + RH, C[1] + k); }); ctx.stroke();
    specks.forEach(([x, y, v]) => { ctx.fillStyle = v < 0.5 ? 'rgba(80,74,66,0.18)' : 'rgba(255,255,255,0.22)'; ctx.fillRect(x, y, 2.5, 1.5); });
    // roads and river (gray running stitch)
    const ext = extent(day), red = ext * PLEN;
    running(ctx, s => [C[0] - RH + s * RH * 2, 960 + Math.sin(s * 6) * 40], 1, 'rgba(92,87,80,0.55)', 3, 0.012);
    running(ctx, s => [600 + Math.sin(s * 5) * 50, C[1] - RH + s * RH * 2], 1, 'rgba(92,87,80,0.55)', 3, 0.012);
    // pattern pencil + green links
    LINKS.forEach((l, i) => { const pt = s => qpt(l, s); pencil(ctx, pt); const p = L.clamp((day - (linkDays[i] - STITCH_DAYS)) / STITCH_DAYS, 0, 1); running(ctx, pt, p, GREEN, 5, 0.03); });
    SPOKES.forEach(sp => { const pt = s => [L.lerp(sp.a[0], sp.b[0], s), L.lerp(sp.a[1], sp.b[1], s)]; pencil(ctx, pt); running(ctx, pt, L.clamp((day - sp.d0) / (sp.d1 - sp.d0), 0, 1), GREEN, 5, 0.025); });
    // buildings
    ctx.lineCap = 'round';
    items.forEach(o => { const gone = L.sm(o.hitAt, o.hitAt + 0.04, ext); ctx.lineWidth = 3.2; ctx.strokeStyle = STITCH; ctx.globalAlpha = 1 - 0.8 * gone;
      o.cells.forEach(([x, y, j1, j2]) => xstitch(ctx, x, y, (j1 - 0.5) * 3, (j2 - 0.5) * 3));
      if (gone > 0) { ctx.globalAlpha = gone * 0.7; ctx.fillStyle = 'rgba(60,56,50,0.5)'; o.cells.forEach(([x, y, j1]) => { if (j1 < 0.5) { ctx.beginPath(); ctx.arc(x, y, 1.6, 0, 7); ctx.fill(); } }); }
      ctx.globalAlpha = 1; });
    BANKS.forEach(([x, y]) => knot(ctx, x, y - 3.4 * CS, 12 + pulse * 5 * (0.5 + 0.5 * Math.sin(t * 5))));
    LINKS.forEach((l, i) => { if (day >= linkDays[i]) knot(ctx, l.b[0], l.b[1] - 3 * CS, 8); });
    // red thread (couched): drawn length = extent x path length
    if (red > 0) { ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      const seg = w => { ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(PATH[0][0], PATH[0][1]);
        for (let i = 1; i < PATH.length; i++) { if (CUM[i] <= red) ctx.lineTo(PATH[i][0], PATH[i][1]); else { const f = (red - CUM[i - 1]) / (CUM[i] - CUM[i - 1]); ctx.lineTo(L.lerp(PATH[i - 1][0], PATH[i][0], f), L.lerp(PATH[i - 1][1], PATH[i][1], f)); break; } } ctx.stroke(); };
      ctx.strokeStyle = 'rgba(40,10,8,0.35)'; ctx.save(); ctx.translate(2, 3); seg(10); ctx.restore();
      ctx.strokeStyle = RED; seg(8); ctx.strokeStyle = 'rgba(255,190,180,0.55)'; ctx.setLineDash([6, 10]); seg(2.5); ctx.setLineDash([]);
      // couching stitches
      ctx.strokeStyle = 'rgba(70,60,55,0.7)'; ctx.lineWidth = 2; for (let s = 30; s < Math.min(red, PLEN * 0.83); s += 60) { let i = CUM.findIndex(c => c >= s); if (i < 1) continue; const a = PATH[i - 1], b = PATH[i]; const dx = b[0] - a[0], dy = b[1] - a[1], dl = Math.hypot(dx, dy) || 1;
        ctx.beginPath(); ctx.moveTo(a[0] - dy / dl * 9, a[1] + dx / dl * 9); ctx.lineTo(a[0] + dy / dl * 9, a[1] - dx / dl * 9); ctx.stroke(); } }
    ctx.restore();
    // the bit of red that has run off the hoop (drawn outside the clip)
    if (red > PLEN * 0.83) { ctx.save(); ctx.beginPath(); ctx.rect(-300, -300, 1700, 2600); ctx.arc(C[0], C[1], RH, 0, 7, true); ctx.clip('evenodd');
      ctx.strokeStyle = RED; ctx.lineWidth = 8; ctx.lineCap = 'round'; ctx.beginPath(); let started = false;
      for (let i = 1; i < PATH.length; i++) { if (CUM[i] > red) { const f = (red - CUM[i - 1]) / (CUM[i] - CUM[i - 1]); ctx.lineTo(L.lerp(PATH[i - 1][0], PATH[i][0], f), L.lerp(PATH[i - 1][1], PATH[i][1], f)); break; }
        if (CUM[i] > PLEN * 0.78) { started ? ctx.lineTo(PATH[i][0], PATH[i][1]) : ctx.moveTo(PATH[i][0], PATH[i][1]); started = true; } } ctx.stroke(); ctx.restore(); }
    // hoop ring
    ctx.strokeStyle = WOOD2; ctx.lineWidth = 34; ctx.beginPath(); ctx.arc(C[0], C[1], RH + 14, 0, 7); ctx.stroke();
    ctx.strokeStyle = WOOD; ctx.lineWidth = 24; ctx.beginPath(); ctx.arc(C[0], C[1], RH + 14, 0, 7); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(C[0], C[1], RH + 8, 3.6, 5.4); ctx.stroke();
    ctx.fillStyle = WOOD2; ctx.fillRect(C[0] - 24, C[1] - RH - 52, 48, 34); ctx.fillStyle = '#8c867c'; ctx.fillRect(C[0] - 8, C[1] - RH - 70, 16, 30);
    if (hand) drawHand(ctx, hand);
  }

  // ---------- the hand (clean capsules, not freehand blobs) ----------
  function cap(ctx, pts, w) { ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = SKIN_D; ctx.lineWidth = w + 6; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); }
  function capFill(ctx, pts, w, col = SKIN) { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.beginPath(); pts.forEach((p, i) => i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])); ctx.stroke(); }
  function drawHand(ctx, { bob = 0, slack = 0, threadTo = BANKS[2] }) {
    ctx.save(); const ox = -bob * 6, oy = -bob * 9; ctx.translate(ox, oy);
    const tip = [612, 912], eye = [668, 994];
    // green thread from the needle eye back to the last stitch
    ctx.strokeStyle = 'rgba(20,60,35,0.35)'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(eye[0] + 2, eye[1] + 3);
    const sx = threadTo[0] - ox, sy = threadTo[1] - oy; ctx.quadraticCurveTo(700 + slack * 40, 900 + slack * 120, sx + 2, sy + 3); ctx.stroke();
    ctx.strokeStyle = GREEN; ctx.lineWidth = 3.5; ctx.beginPath(); ctx.moveTo(eye[0], eye[1]); ctx.quadraticCurveTo(700 + slack * 40, 900 + slack * 120, sx, sy); ctx.stroke();
    // needle
    ctx.strokeStyle = '#2c2b2a'; ctx.lineWidth = 6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(tip[0], tip[1]); ctx.lineTo(eye[0] + 6, eye[1] + 8); ctx.stroke();
    ctx.strokeStyle = '#e4e2dc'; ctx.lineWidth = 3.4; ctx.beginPath(); ctx.moveTo(tip[0], tip[1]); ctx.lineTo(eye[0] + 6, eye[1] + 8); ctx.stroke();
    ctx.strokeStyle = '#2c2b2a'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.ellipse(eye[0] + 2, eye[1] + 3, 1.6, 4.5, -0.9, 0, 7); ctx.stroke();
    // hand: palm, curled fingers, index + thumb pinching the needle
    const palm = [[760, 1110], [860, 1230], [930, 1330]];
    const idx = [[745, 1050], [690, 1000], [655, 962]];
    const mid = [[775, 1080], [735, 1045], [712, 1060]];
    const rng2 = [[800, 1110], [770, 1090], [752, 1105]];
    const thumb = [[785, 1130], [720, 1060], [676, 1004]];
    cap(ctx, palm, 150); cap(ctx, rng2, 34); cap(ctx, mid, 38); cap(ctx, idx, 40);
    capFill(ctx, palm, 150); capFill(ctx, rng2, 34); capFill(ctx, mid, 38); capFill(ctx, idx, 40);
    cap(ctx, thumb, 44); capFill(ctx, thumb, 44, '#bdb6ac');
    // nails and creases
    ctx.fillStyle = '#cfc9c0'; ctx.save(); ctx.translate(657, 964); ctx.rotate(-2.3); ctx.beginPath(); ctx.ellipse(0, 0, 10, 7, 0, 0, 7); ctx.fill(); ctx.restore();
    ctx.save(); ctx.translate(680, 1008); ctx.rotate(-2.2); ctx.beginPath(); ctx.ellipse(0, 0, 11, 8, 0, 0, 7); ctx.fill(); ctx.restore();
    ctx.strokeStyle = 'rgba(58,54,50,0.55)'; ctx.lineWidth = 2.5; [[700, 1003, 0.8], [735, 1040, 0.8], [733, 1073, 0.7], [755, 1093, 0.9]].forEach(([x, y, a]) => { ctx.beginPath(); ctx.arc(x, y, 9, a, a + 1.2); ctx.stroke(); });
    ctx.restore(); }

  // ---------- text ----------
  const fade = (t, a, b, f = 0.3) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));
  function card(ctx, lines, y, size, a) { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center'; let yy = y;
    lines.forEach((l, i) => { const o = typeof l === 'string' ? { text: l } : l; let fz = o.size || size; ctx.font = `${o.italic ? 'italic ' : ''}${fz}px "${SERIF}"`;
      while (ctx.measureText(o.text).width > 780 && fz > 30) { fz -= 4; ctx.font = `${fz}px "${SERIF}"`; }
      if (i) yy += fz * 1.05; ctx.lineJoin = 'round'; ctx.lineWidth = fz * 0.16; ctx.strokeStyle = 'rgba(16,15,14,0.92)'; ctx.strokeText(o.text, 490, yy);
      ctx.fillStyle = o.col || '#f6f2ea'; ctx.fillText(o.text, 490, yy); }); ctx.restore(); }
  function count(ctx, n, text, a) { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a;
    const g = ctx.createLinearGradient(0, 200, 0, 700); g.addColorStop(0, 'rgba(16,15,14,0.72)'); g.addColorStop(1, 'rgba(16,15,14,0)'); ctx.fillStyle = g; ctx.fillRect(0, 200, 1080, 500); ctx.restore();
    card(ctx, [{ text: String(n), size: 230, col: GREEN }], 470, 230, a); if (text) card(ctx, [text], 580, 92, a); }
  function slate(ctx, s) { ctx.save(); ctx.fillStyle = 'rgba(10,10,10,0.6)'; ctx.fillRect(40, 1818, 660, 58); ctx.restore(); L.slate(ctx, s); }
  // stitched calendar ribbon: one cross-stitch per 30 days (screen space)
  function calendar(ctx, day, a) { if (a <= 0.01) return; ctx.save(); ctx.globalAlpha = a; const n = Math.round(END_DAY / 30), x0 = 130, w = 740, step = w / (n - 1);
    ctx.fillStyle = 'rgba(16,15,14,0.55)'; ctx.fillRect(90, 1390, 820, 84); ctx.fillStyle = LINEN; ctx.fillRect(100, 1400, 800, 64);
    ctx.fillStyle = PENCIL; for (let i = 0; i < n; i++) { ctx.beginPath(); ctx.arc(x0 + i * step, 1432, 2.2, 0, 7); ctx.fill(); }
    ctx.strokeStyle = STITCH; ctx.lineWidth = 3.4; ctx.lineCap = 'round'; const done = day / 30;
    for (let i = 0; i < n; i++) { if (i + 1 > done + 0.001) break; const x = x0 + i * step, h = 12; ctx.beginPath(); ctx.moveTo(x - h, 1420); ctx.lineTo(x + h, 1444); ctx.moveTo(x + h, 1420); ctx.lineTo(x - h, 1444); ctx.stroke(); }
    ctx.restore(); }

  // ---------- camera ----------
  const CAM = [[0, [600, 930, 3.0]], [6.4, [600, 930, 3.0]], [9.6, [540, 905, 1.0]], [13.8, [540, 905, 1.0]], [16.1, [636, 960, 4.2]], [19.8, [640, 965, 4.4]]];
  const CAM2 = [[28.4, [640, 965, 4.4]], [32, [636, 958, 5.4]]];
  const handState = (day, t) => { let active = 0;
    SPOKES.forEach(sp => { if (day > sp.d0 && day < sp.d1) active = 1; });
    HUM.forEach(q => { if (day > q - STITCH_DAYS && day < q) active = 1; });
    return { bob: active ? Math.max(0, Math.sin(t * 9)) : 0, slack: 0 }; };

  function snapPanel(ctx, y0, label, sub, day, linkDays, medDay, a) { if (a <= 0.01) return;
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#141312'; ctx.fillRect(80, y0, 920, 520); ctx.strokeStyle = '#5a5650'; ctx.lineWidth = 3; ctx.strokeRect(80, y0, 920, 520);
    ctx.save(); ctx.beginPath(); ctx.rect(80, y0, 920, 520); ctx.clip(); ctx.translate(330, y0 + 262); ctx.scale(0.49, 0.49); ctx.translate(-C[0], -C[1]); world(ctx, day, linkDays); ctx.restore();
    L.label(ctx, label, 620, y0 + 70, 46, { col: '#f0ece4', align: 'left' });
    if (sub) L.label(ctx, sub, 620, y0 + 126, 52, { col: '#f0ece4', align: 'left', font: SERIF });
    // month grid: 5 x 4, one cross-stitch per 30 days; green knot on the median piece's month
    const n = Math.round(END_DAY / 30); ctx.fillStyle = LINEN; ctx.fillRect(610, y0 + 170, 350, 300);
    for (let i = 0; i < n; i++) { const cx = 650 + (i % 5) * 68, cy = y0 + 210 + Math.floor(i / 5) * 72;
      ctx.fillStyle = PENCIL; ctx.beginPath(); ctx.arc(cx, cy, 2.5, 0, 7); ctx.fill();
      if (day / 30 >= i + 1) { ctx.strokeStyle = STITCH; ctx.lineWidth = 4; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx - 16, cy - 16); ctx.lineTo(cx + 16, cy + 16); ctx.moveTo(cx + 16, cy - 16); ctx.lineTo(cx - 16, cy + 16); ctx.stroke(); }
      if (day >= medDay && Math.floor(medDay / 30) === i) knot(ctx, cx, cy, 17); }
    ctx.restore(); }

  function draw(ctx, t) {
    ctx.fillStyle = TABLE; ctx.fillRect(0, 0, 1080, 1920);
    if (t < 19.8 || t >= 28.4) {
      let day, cam, hs;
      if (t < 1.4) { day = 433; cam = CAM; } else if (t < 19.8) { day = dayAt(t); cam = CAM; } else { day = END_DAY; cam = CAM2; }
      hs = t < 1.4 ? { bob: 0, slack: 0 } : handState(day, t);
      if (t >= 16.1) hs = { bob: 0, slack: L.sm(16.1, 19, t) * 0.6 + (t >= 28.4 ? 0.6 : 0) };
      const pulse = t > 1.5 && t < 3.0 ? 1 : 0;
      ctx.save(); L.camera(ctx, cam, t); world(ctx, day, HUM, { hand: hs, pulse, t }); ctx.restore();
      // vignette
      const vg = ctx.createRadialGradient(540, 960, 500, 540, 960, 1150); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.55)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, 1080, 1920);
      if (t < 16.1) calendar(ctx, day, t < 1.4 ? 1 : L.sm(1.5, 1.8, t) * (1 - L.sm(6.4, 7, t)) + L.sm(13.8, 14.4, t));
      // cards
      if (t < 1.4) { card(ctx, [{ text: '3 things', size: 150, col: GREEN }, { text: 'we already had', size: 100 }], 400, 120, 1); slate(ctx, 'SC1  CLOSE  (FLASH-FORWARD)'); }
      else if (t < 6.4) { count(ctx, 3, 'central banks', fade(t, 1.5, 3.0, 0.2)); count(ctx, 2, 'swap lines', fade(t, 3.0, 4.75, 0.2)); count(ctx, 1, 'coordinated liquidity', fade(t, 4.75, 6.4, 0.2)); slate(ctx, 'SC2  CLOSE  LOCKED-OFF'); }
      else if (t < 13.8) { card(ctx, ['Every piece,', 'already stitched.'], 1560 - 1320 + 60, 88, fade(t, 9.7, 11.5)); card(ctx, ['Nobody tied', 'them together.'], 300, 88, fade(t, 12.3, 13.8)); slate(ctx, t < 9.6 ? 'SC3  PULL OUT' : 'SC3  WIDE'); }
      else if (t < 19.8) { card(ctx, ['We slowed it down'], 330, 96, fade(t, 17.1, 19.7)); card(ctx, ['so you could see it.'], 440, 96, fade(t, 17.6, 19.7)); slate(ctx, t < 16.1 ? 'SC4  DOLLY IN' : 'SC4  CLOSE  (STOP)'); }
      else { card(ctx, ['This is the', 'bottleneck.'], 330, 110, L.sm(29, 29.5, t)); slate(ctx, 'SC6  EXTREME CLOSE'); }
      if (t >= 1.4 && t < 1.62) { ctx.fillStyle = `rgba(240,236,228,${(1 - (t - 1.4) / 0.22) * 0.8})`; ctx.fillRect(0, 0, 1080, 1920); }
    } else {
      // SNAP
      count(ctx, 0, '', fade(t, 19.8, 21.0, 0.15));
      const pa = L.sm(21.0, 21.3, t);
      const d1 = t < 23 ? L.clamp((t - 21.2) / 1.6, 0, 1) * END_DAY : L.clamp((t - 23.0) / 2.4, 0, 1) * END_DAY;
      const d2 = L.clamp((t - 23.0) / 2.4, 0, 1) * END_DAY;
      snapPanel(ctx, 250, 'as it happened', null, d1, HUM, MED, pa);
      snapPanel(ctx, 800, 'found sooner', 'illustrative', d2, AI, AIMED, L.sm(22.8, 23.1, t));
      card(ctx, ['Same pieces. Found sooner.'], 1440, 76, fade(t, 25.4, 28.4));
      slate(ctx, 'SC5  SNAP  SPLIT');
    }
    if (t > 31.6) L.endCard(ctx, L.sm(31.6, 32.1, t));
    L.grain(ctx, t, { alpha: 0.04, n: 300 });
  }

  const cues = [{ t: 1.4, type: 'whoosh' }, { t: 1.6, type: 'pop' }, { t: 3.0, type: 'pop' }, { t: 4.75, type: 'pop' }, { t: 6.4, type: 'whoosh' },
    { t: tOf(403), type: 'bonk' }, { t: 13.8, type: 'whoosh' }, { t: 21.0, type: 'hit' }, { t: 25.4, type: 'ding' }, { t: 28.4, type: 'whoosh' }];
  HUM.forEach(q => { if (q <= END_DAY) cues.push({ t: tOf(q), type: 'pop' }); });
  return { draw, DUR,
    acts: [{ start: 0, end: 11.5, bpm: 52, drone: true }, { start: 12.4, end: 16.1, bpm: 0, drone: true }, { start: 17.3, end: 36, bpm: 0, drone: true }],
    cues: cues.sort((a, b) => a.t - b.t) };
}
if (typeof module !== 'undefined') module.exports = makeScene;
