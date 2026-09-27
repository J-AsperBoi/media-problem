// half-a-lifeline: two-phones, shadow puppet, market, between nations. Analog: gfc-2008.
// Race mapping: film t 2.2..16.8 s <-> days 0..584 after the Aug 9 2007 freeze. 1 s = 40 days, linear on average;
// the clock advances in monthly steps at the analog's own data points (stop-start), each step eased over 0.23 s.
// Red = analog threat.points (monthly S&P fall share, s2); dark windows = share of the fall.
// Green: 13 office pairs, arrival = L.lognormalQuantile((i+.5)/13, 426, 1077); hero pair is the median (q=.5).
// AI snap: median 220, p90 556 (illustrative). Hook 0..1.8 s is a labeled flash-forward to day 433.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('gfc-2008');
  const DUR = 36, RED = L.RED, GREEN = L.GREEN;
  const INK = '#0b0b0d', CREAM = '#ece8de', G5 = '#9aa0aa';

  // ---------- data ----------
  const PTS = A.threat.points.map(p => [p.t, p.extent]);
  const TROUGH = PTS[PTS.length - 1][0]; // 584
  const extent = d => { if (d <= PTS[0][0]) return 0; for (let i = 0; i < PTS.length - 1; i++) { const [a, x] = PTS[i], [b, y] = PTS[i + 1]; if (d <= b) return L.lerp(x, y, (d - a) / (b - a)); } return 1; };
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;
  const AIMED = A.ai_counterfactual.aggregation_median, AIP90 = AIMED * P90 / MED;
  const T0 = 2.2, DPS = 40, TEND = T0 + TROUGH / DPS; // 16.8
  const FLASH = 433, BREAK = 403;
  // monthly tick grid = the data's own points (plus one mid-gap tick before the first market month)
  const G = [0, 31].concat(PTS.slice(1).map(p => p[0]));
  const LURCH = 0.23 * DPS; // days of linear time the step takes
  const dayLin = t => L.clamp((t - T0) * DPS, 0, TROUGH);
  const dayStep = t => {
    if (t < 1.8) return FLASH; if (t < T0) return 0;
    const d = dayLin(t); let k = 0; while (k < G.length - 1 && G[k + 1] <= d) k++;
    if (k === 0) return 0; return L.lerp(G[k - 1], G[k], L.ease.out(L.clamp((d - G[k]) / LURCH, 0, 1)));
  };
  // first tick at/after a day -> film time the tie begins
  const tieTime = day => { for (const g of G) if (g >= day) return T0 + g / DPS + 0.25; return 999; };

  // ---------- pairs ----------
  const NP = 13, HERO = 6;
  const qs = []; for (let i = 0; i < NP; i++) qs.push((i + 0.5) / NP);
  const others = qs.filter((_, i) => i !== 6); const rq = L.rng(7);
  for (let i = others.length - 1; i > 0; i--) { const j = Math.floor(rq() * (i + 1)); [others[i], others[j]] = [others[j], others[i]]; }
  const pairs = []; let k2 = 0;
  for (let i = 0; i < NP; i++) { const q = i === HERO ? 0.5 : others[k2++]; const arr = L.lognormalQuantile(q, MED, P90), ai = L.lognormalQuantile(q, AIMED, AIP90);
    pairs.push({ x: 90 + i * 75, q, arr, ai, tie: tieTime(arr), ph: i * 0.37 }); }
  const HEROTIE = pairs[HERO].tie;

  // ---------- world map geometry ----------
  const coastA = x => 760 + (x === 540 ? 0 : (L.noise(x / 110, 4) - 0.5) * 50);
  const coastB = x => 1160 + (x === 540 ? 0 : (L.noise(x / 120, 9) - 0.5) * 50);
  const ORIGIN = [860, 1720];
  const rw = L.rng(31), lights = [];
  const cityA = [[160, 420], [330, 560], [520, 380], [700, 600], [880, 450], [980, 660], [260, 690], [620, 700]];
  const cityB = [[140, 1300], [330, 1420], [540, 1260], [760, 1380], [900, 1560], [420, 1640], [650, 1560], [960, 1280]];
  const gauss = () => { let s = 0; for (let i = 0; i < 4; i++) s += rw(); return (s - 2) * 0.9; };
  [[cityA, 1], [cityB, 2]].forEach(([cs, side]) => { for (let i = 0; i < 520; i++) { const c = cs[i % cs.length];
    let x = c[0] + gauss() * 90, y = c[1] + gauss() * 70; x = L.clamp(x, 20, 1060);
    if (side === 1) y = L.clamp(y, 250, coastA(x) - 18); else y = L.clamp(y, coastB(x) + 18, 1840);
    lights.push({ x, y, side, base: Math.hypot(x - ORIGIN[0], y - ORIGIN[1]) + rw() * 260 }); } });
  lights.slice().sort((a, b) => a.base - b.base).forEach((l, i) => l.rank = (i + 1) / lights.length);
  const rankAt = (x, y) => { const d = Math.hypot(x - ORIGIN[0], y - ORIGIN[1]) + 130; let n = 0; for (const l of lights) if (l.base < d) n++; return n / lights.length; };
  pairs.forEach(p => { p.rA = rankAt(p.x, coastA(p.x)); p.rB = rankAt(p.x, coastB(p.x)); });

  // skyline (seen through each office window): buildings + pinhole lights with uniform ranks
  function makeSky(seed) { const r = L.rng(seed), b = []; let x = 200; while (x < 980) { const w = 50 + r() * 90, h = 110 + r() * 260; b.push({ x, w, h }); x += w + 4 + r() * 10; }
    const lw = []; b.forEach(bb => { for (let yy = 22; yy < bb.h - 16; yy += 30) for (let xx = 12; xx < bb.w - 14; xx += 22) if (r() < 0.7) lw.push({ x: bb.x + xx, dy: yy, h: bb.h, rk: 0 }); });
    const ord = lw.map((_, i) => i); for (let i = ord.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [ord[i], ord[j]] = [ord[j], ord[i]]; }
    ord.forEach((o, i) => lw[o].rk = (i + 1) / lw.length); return { b, lw }; }
  const SKY = [makeSky(41), makeSky(43)];

  // ---------- helpers ----------
  function screen(c, alpha = 1, cx = 540, cy = 900) { const g = c.createRadialGradient(cx, cy, 80, cx, cy, 1250); g.addColorStop(0, '#c9c3b8'); g.addColorStop(0.55, '#8e8981'); g.addColorStop(1, '#3a3835');
    c.save(); c.globalAlpha = alpha; c.fillStyle = g; c.fillRect(-400, -400, 1880, 2720); c.restore(); }
  function rrect(c, x, y, w, h, r) { c.beginPath(); c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.arc(x + w - r, y + r, r, -Math.PI / 2, 0); c.lineTo(x + w, y + h - r); c.arc(x + w - r, y + h - r, r, 0, Math.PI / 2);
    c.lineTo(x + r, y + h); c.arc(x + r, y + h - r, r, Math.PI / 2, Math.PI); c.lineTo(x, y + r); c.arc(x + r, y + r, r, Math.PI, 1.5 * Math.PI); c.closePath(); }
  function poly(c, pts, fill) { c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); c.fillStyle = fill; c.fill(); }
  function rope(c, pts, lw, alpha = 1, glow = 1) { c.save(); c.globalAlpha = alpha; c.lineCap = 'round'; c.lineJoin = 'round';
    c.strokeStyle = 'rgba(52,210,123,0.22)'; c.lineWidth = lw * 3.2 * glow; c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.stroke();
    c.strokeStyle = GREEN; c.lineWidth = lw; c.stroke();
    // twist marks
    c.strokeStyle = 'rgba(10,40,20,0.55)'; c.lineWidth = lw * 0.28; for (let i = 0; i < pts.length - 1; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[i + 1]; const len = Math.hypot(x2 - x1, y2 - y1), n = Math.floor(len / (lw * 2.2));
      const ux = (x2 - x1) / (len || 1), uy = (y2 - y1) / (len || 1); for (let j = 0; j < n; j++) { const px = x1 + ux * j * lw * 2.2, py = y1 + uy * j * lw * 2.2; c.beginPath(); c.moveTo(px - uy * lw * 0.45 - ux * lw * 0.3, py + ux * lw * 0.45 - uy * lw * 0.3); c.lineTo(px + uy * lw * 0.45 + ux * lw * 0.3, py - ux * lw * 0.45 + uy * lw * 0.3); c.stroke(); } }
    c.restore(); }
  function sagPts(x1, y1, x2, y2, sag, n = 16) { const out = []; for (let i = 0; i <= n; i++) { const f = i / n; out.push([L.lerp(x1, x2, f) + Math.sin(f * Math.PI) * sag * 0.25, L.lerp(y1, y2, f) + Math.sin(f * Math.PI) * sag]); } return out; }
  function fray(c, x, y, dx, dy, lw) { c.save(); c.strokeStyle = GREEN; c.lineWidth = lw * 0.35; c.lineCap = 'round'; for (let i = -2; i <= 2; i++) { c.beginPath(); c.moveTo(x, y); c.lineTo(x + dx * lw * 2.2 - dy * i * lw * 0.55, y + dy * lw * 2.2 + dx * i * lw * 0.55); c.stroke(); } c.restore(); }
  function knot(c, x, y, r, pulse = 0) { c.save(); const g = c.createRadialGradient(x, y, 0, x, y, r * 4); g.addColorStop(0, 'rgba(52,210,123,' + (0.55 + 0.25 * pulse) + ')'); g.addColorStop(1, 'rgba(52,210,123,0)');
    c.fillStyle = g; c.beginPath(); c.arc(x, y, r * 4, 0, 7); c.fill(); c.fillStyle = GREEN; c.beginPath(); c.ellipse(x, y, r * 1.2, r, 0, 0, 7); c.fill();
    c.strokeStyle = 'rgba(10,40,20,0.6)'; c.lineWidth = r * 0.25; c.beginPath(); c.moveTo(x - r * 0.7, y - r * 0.6); c.quadraticCurveTo(x, y + r * 0.2, x + r * 0.7, y - r * 0.6); c.stroke(); c.restore(); }
  function note(c, x, y, s, alpha) { c.save(); c.globalAlpha = alpha; c.fillStyle = INK; c.strokeStyle = INK; c.lineWidth = 3 * s; c.beginPath(); c.ellipse(x, y, 9 * s, 6.5 * s, -0.4, 0, 7); c.fill();
    c.beginPath(); c.moveTo(x + 8 * s, y - 2 * s); c.lineTo(x + 8 * s, y - 34 * s); c.quadraticCurveTo(x + 20 * s, y - 26 * s, x + 18 * s, y - 14 * s); c.stroke(); c.restore(); }
  function rod(c, x1, y1, x2, y2, w = 3) { c.save(); c.strokeStyle = INK; c.lineWidth = w; c.beginPath(); c.moveTo(x1, y1); c.lineTo(x2, y2); c.stroke(); c.fillStyle = '#6b665f'; c.beginPath(); c.arc(x1, y1, w * 1.8, 0, 7); c.fill(); c.restore(); }

  // ---------- office (room) layer ----------
  // m = 1: figure A (upper continent office), m = -1: figure B (mirrored). day = displayed day.
  function room(c, m, day, t, { tie = 999, connectedAlpha = 0 } = {}) {
    const X = x => 540 + m * (x - 540), ex = extent(day), sky = SKY[m === 1 ? 0 : 1];
    screen(c, 1, X(560), 700);
    // window content: sky, red glow rising to height = extent, skyline with lights
    const WX0 = Math.min(X(230), X(950)), WX1 = Math.max(X(230), X(950)), WY0 = 280, WY1 = 1090;
    c.save(); c.beginPath(); c.rect(WX0, WY0, WX1 - WX0, WY1 - WY0); c.clip();
    const sg = c.createLinearGradient(0, WY0, 0, WY1); sg.addColorStop(0, '#4c4945'); sg.addColorStop(1, '#8f8a82'); c.fillStyle = sg; c.fillRect(WX0, WY0, WX1 - WX0, WY1 - WY0);
    // distant ocean horizon line
    c.fillStyle = '#3f3c39'; c.fillRect(WX0, 700, WX1 - WX0, 6);
    if (ex > 0) { const top = WY1 - ex * (WY1 - WY0) * 1.05; const rg = c.createLinearGradient(0, top - 60, 0, WY1); rg.addColorStop(0, 'rgba(255,59,48,0)'); rg.addColorStop(0.25, 'rgba(255,59,48,0.55)'); rg.addColorStop(1, 'rgba(255,59,48,0.95)');
      c.fillStyle = rg; c.fillRect(WX0, top - 60, WX1 - WX0, WY1 - top + 60); }
    // lifeline out on the water toward the other shore (the far half is not visible)
    sky.b.forEach(b => { c.fillStyle = INK; c.fillRect(X(b.x + (m === 1 ? 0 : b.w)), WY1 - b.h, b.w, b.h); });
    sky.lw.forEach(w => { const on = w.rk > ex; const x = X(w.x + (m === 1 ? 0 : 10)); if (on) { c.fillStyle = '#efe6cf'; c.fillRect(x, WY1 - w.h + w.dy, 10, 14); } });
    c.restore();
    // wall (four slabs) + mullions
    const wg = c.createRadialGradient(X(600), 1300, 100, X(600), 1300, 1100); wg.addColorStop(0, '#6a655e'); wg.addColorStop(1, '#2c2a27');
    c.fillStyle = wg; c.fillRect(-400, -400, 1880, WY0 + 400); c.fillRect(-400, WY1, 1880, 1500); c.fillRect(-400, WY0, WX0 + 400, WY1 - WY0); c.fillRect(WX1, WY0, 800, WY1 - WY0);
    c.fillStyle = INK; c.fillRect(WX0 - 14, WY0 - 14, WX1 - WX0 + 28, 14); c.fillRect(WX0 - 14, WY0, 14, WY1 - WY0); c.fillRect(WX1, WY0, 14, WY1 - WY0);
    c.fillRect(X(590) - 9, WY0, 18, WY1 - WY0); c.fillRect(WX0, 690, WX1 - WX0, 16);
    // lamp light pooling on the wall below the window (a lit sill strip)
    c.fillStyle = INK; c.fillRect(WX0 - 30, WY1, WX1 - WX0 + 60, 26);
    // rope: from the figure's low hand, over the sill, out through the window toward the horizon
    const tieF = L.ease.out(L.clamp((t - tie) / 0.6, 0, 1));
    const hand2 = [X(860), 1560], sill = [X(800), 1085], far = [X(700 - 60 * tieF), 712];
    const rp = sagPts(hand2[0], hand2[1], sill[0], sill[1], 30 * (1 - tieF), 10).concat(sagPts(sill[0], sill[1], far[0], far[1], 12 * (1 - tieF), 10).slice(1));
    rope(c, rp, 16, 1, 1 + tieF * 0.6);
    if (tieF < 1) fray(c, far[0], far[1], m * -0.3, -0.95, 10 * (1 - tieF));
    if (tieF > 0) knot(c, far[0], far[1] - 4, 9, 0.5 + 0.5 * Math.sin(t * 5));
    // figure (seen from behind, over the shoulder): identical silhouette for A and B
    const bow = 0.12 + 0.04 * Math.sin(t * 0.9);
    c.fillStyle = INK;
    c.beginPath(); c.moveTo(X(-120), 1920); c.lineTo(X(-120), 1520); c.quadraticCurveTo(X(40), 1400, X(200), 1395); c.quadraticCurveTo(X(420), 1395, X(520), 1500); c.lineTo(X(560), 1920); c.closePath(); c.fill();
    c.beginPath(); c.ellipse(X(240 + 10), 1250 + bow * 60, 128, 150, m * bow, 0, 7); c.fill(); // head, bowed toward the phone
    c.beginPath(); c.ellipse(X(118), 1260 + bow * 60, 20, 34, 0, 0, 7); c.fill(); // ear
    c.fillRect(Math.min(X(200), X(290)), 1330, 90, 100); // neck
    // arm up to the phone
    poly(c, [[X(430), 1470], [X(520), 1420], [X(600), 1330], [X(545), 1300], [X(460), 1380], [X(380), 1440]], INK);
    // low arm to the rope hand
    poly(c, [[X(500), 1560], [X(560), 1510], [X(860), 1530], [X(870), 1600], [X(560), 1640]], INK);
    c.beginPath(); c.ellipse(X(870), 1560, 46, 40, 0, 0, 7); c.fill();
    for (let i = 0; i < 4; i++) { c.beginPath(); c.arc(X(890 + 0), 1530 + i * 20, 15, 0, 7); c.fill(); }
    rod(c, X(870), 1600, X(900), 1920, 4); rod(c, X(250), 1500, X(230), 1920, 5);
    // phone
    c.save(); c.translate(X(640), 1090); c.rotate(m * -0.09);
    rrect(c, -165, -290, 330, 580, 40); c.fillStyle = INK; c.fill();
    rrect(c, -145, -250, 290, 500, 18); const pg = c.createLinearGradient(0, -250, 0, 250); pg.addColorStop(0, '#e3ded3'); pg.addColorStop(1, '#bdb7ab'); c.fillStyle = pg; c.fill();
    // screen glow on the surroundings
    c.restore();
    c.save(); c.translate(X(640), 1090); c.rotate(m * -0.09); c.textAlign = 'center';
    const conn = L.clamp(connectedAlpha, 0, 1);
    c.globalAlpha = 1 - conn; c.fillStyle = INK; c.font = `58px "${SERIF}"`; c.fillText('ON HOLD', 0, -160);
    c.font = `38px "${HAND}"`; c.fillStyle = '#2b2a28'; c.fillText('Your call is', 0, -90); c.fillText('important to us.', 0, -48);
    // queue: dots fill as the hero pair's wait elapses (day / median arrival)
    const prog = L.clamp(day / pairs[HERO].arr, 0, 1), nd = 8;
    for (let i = 0; i < nd; i++) { c.beginPath(); c.arc(-105 + i * 30, 30, 9, 0, 7); c.fillStyle = i < Math.floor(prog * nd) ? '#2b2a28' : 'rgba(43,42,40,0.2)'; c.fill(); }
    c.font = `34px "${HAND}"`; c.fillStyle = '#4a4844'; c.fillText('please hold', 0, 100);
    // pulsing hold bar
    c.fillStyle = 'rgba(43,42,40,0.25)'; c.fillRect(-100, 150, 200, 10); c.fillStyle = '#2b2a28'; const pp = (t * 0.7) % 1; c.fillRect(-100 + pp * 160, 150, 40, 10);
    c.globalAlpha = conn; c.fillStyle = '#1d7a47'; c.font = `60px "${SERIF}"`; c.fillText('CONNECTED', 0, -140);
    c.beginPath(); c.arc(0, 10, 58, 0, 7); c.fillStyle = GREEN; c.fill(); c.fillStyle = '#0b2a18'; c.font = `70px "${SERIF}"`; c.fillText('~', 0, 32);
    c.font = `36px "${HAND}"`; c.fillStyle = '#2b2a28'; c.fillText('other shore', 0, 130);
    c.restore();
    // hand gripping the phone
    c.fillStyle = INK; for (let i = 0; i < 4; i++) { c.beginPath(); c.ellipse(X(488 + 0), 1080 + i * 58, 30, 24, 0, 0, 7); c.fill(); }
    c.beginPath(); c.ellipse(X(505), 1290, 60, 44, m * 0.4, 0, 7); c.fill();
    rod(c, X(520), 1300, X(600), 1920, 4);
    // hold notes rising while waiting
    if (conn < 1) for (let i = 0; i < 3; i++) { const f = ((t * 0.45 + i / 3) % 1); note(c, X(820 + Math.sin(f * 6 + i) * 30), 760 - f * 260, 1.4, (1 - conn) * Math.sin(f * Math.PI) * 0.9); }
  }

  // ---------- map layer ----------
  function map(c, day, t, z) {
    const ex = extent(day), lw = 5 / Math.pow(z, 0.55);
    screen(c, 1, 540, 960);
    // ocean wave rails
    c.save(); c.strokeStyle = 'rgba(11,11,13,0.55)'; c.lineWidth = 3;
    for (let r = 0; r < 6; r++) { const y = 820 + r * 64; c.beginPath(); for (let x = -40; x <= 1120; x += 10) { const yy = y + Math.sin(x / 38 + r * 1.3 + t * 0.8) * 7; x === -40 ? c.moveTo(x, yy) : c.lineTo(x, yy); } c.stroke(); }
    c.restore();
    // continents
    c.fillStyle = INK; c.beginPath(); c.moveTo(-400, -400); c.lineTo(1480, -400); for (let x = 1480; x >= -400; x -= 8) c.lineTo(x, coastA(L.clamp(x, -400, 1480))); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(-400, 2320); c.lineTo(1480, 2320); for (let x = 1480; x >= -400; x -= 8) c.lineTo(x, coastB(L.clamp(x, -400, 1480))); c.closePath(); c.fill();
    // red wash + lights (a light goes out when the red reaches its rank)
    c.save(); lights.forEach(l => { if (l.rank <= ex) { c.fillStyle = 'rgba(255,59,48,0.16)'; c.beginPath(); c.arc(l.x, l.y, 34, 0, 7); c.fill(); } }); c.restore();
    lights.forEach(l => { if (l.rank > ex) { c.fillStyle = '#efe6cf'; c.fillRect(l.x - 3, l.y - 4, 6, 8); } else { c.fillStyle = 'rgba(255,90,80,0.8)'; c.fillRect(l.x - 2, l.y - 2, 4, 4); } });
    // offices + ropes
    pairs.forEach((p, i) => {
      const yA = coastA(p.x), yB = coastB(p.x), hero = i === HERO, s = hero ? 1.3 : 1;
      [[yA, -1, p.rA], [yB, 1, p.rB]].forEach(([y, d, rk]) => { c.fillStyle = INK; c.fillRect(p.x - 16 * s, d < 0 ? y - 40 * s : y, 32 * s, 40 * s); c.fillRect(p.x - 4 * s, d < 0 ? y - 52 * s : y + 40 * s, 8 * s, 12 * s);
        c.fillStyle = rk > ex ? '#efe6cf' : 'rgba(255,59,48,0.9)'; c.fillRect(p.x - 8 * s, d < 0 ? y - 30 * s : y + 14 * s, 16 * s, 14 * s); });
      const f = L.ease.out(L.clamp((t - p.tie) / 0.35, 0, 1)), gap = 34 * (1 - f), mid = 960;
      rope(c, sagPts(p.x, yA + 2, p.x, mid - gap, 0, 6), lw * (hero ? 1.5 : 1)); rope(c, sagPts(p.x, yB - 2, p.x, mid + gap, 0, 6), lw * (hero ? 1.5 : 1));
      if (f < 1) { fray(c, p.x, mid - gap, 0, 1, lw * (hero ? 1.5 : 1)); fray(c, p.x, mid + gap, 0, -1, lw * (hero ? 1.5 : 1));
        for (let j = 0; j < 2; j++) { const ff = (t * 0.5 + p.ph + j * 0.5) % 1; note(c, p.x + 14 + Math.sin(ff * 5 + i) * 6, mid + 10 - ff * 60, 0.55, Math.sin(ff * Math.PI) * 0.6 * (1 - f)); } }
      else knot(c, p.x, mid, lw * (hero ? 1.7 : 1.2), 0.5 + 0.5 * Math.sin(t * 4 + i));
    });
  }

  // ---------- snap layer ----------
  const PX0 = 120, PX1 = 960, SPAN = 1100, px = d => PX0 + d / SPAN * (PX1 - PX0);
  function panel(c, y0, title, useAI, play, a) {
    c.save(); c.globalAlpha = a; const h = 470;
    c.fillStyle = '#16171a'; rrect(c, 80, y0, 920, h, 18); c.fill(); c.strokeStyle = '#3a3c42'; c.lineWidth = 2; c.stroke();
    L.label(c, title, 110, y0 + 62, 48, { col: CREAM, font: SERIF, align: 'left', alpha: a });
    const base = y0 + h - 70, top = y0 + 190;
    // red: share of the fall, identical in both panels, drawn up to the playhead (data ends at the trough)
    const dEnd = Math.min(play, TROUGH);
    if (dEnd > 0) { c.beginPath(); c.moveTo(px(0), base); for (let d = 0; d <= dEnd; d += 4) c.lineTo(px(d), base - extent(d) * (base - top)); c.lineTo(px(dEnd), base - extent(dEnd) * (base - top)); c.lineTo(px(dEnd), base); c.closePath(); c.fillStyle = 'rgba(255,59,48,0.85)'; c.fill(); }
    // axis
    c.strokeStyle = '#5a5d64'; c.lineWidth = 3; c.beginPath(); c.moveTo(PX0, base); c.lineTo(PX1, base); c.stroke();
    // the break
    c.setLineDash([10, 10]); c.strokeStyle = '#8a8d94'; c.lineWidth = 2; c.beginPath(); c.moveTo(px(BREAK), y0 + 95); c.lineTo(px(BREAK), base); c.stroke(); c.setLineDash([]);
    L.label(c, 'the break', px(BREAK), base + 52, 44, { col: G5, align: 'center', alpha: a });
    // knots: each pair's two halves tie at its arrival
    const ky = y0 + 160;
    pairs.forEach((p, i) => { const d = useAI ? p.ai : p.arr; if (d > SPAN) return; const on = play >= d, hero = i === HERO, r = hero ? 13 : 8;
      c.strokeStyle = on ? GREEN : 'rgba(52,210,123,0.35)'; c.lineWidth = hero ? 5 : 3; c.beginPath(); c.moveTo(px(d), ky - 40 - (hero ? 14 : 0)); c.lineTo(px(d), ky - (on ? 0 : 10)); c.moveTo(px(d), ky + (on ? 0 : 10)); c.lineTo(px(d), base); c.stroke();
      if (on) knot(c, px(d), ky, r, hero ? 1 : 0.3); });
    // playhead
    if (play > 0 && play < SPAN) { c.strokeStyle = CREAM; c.lineWidth = 3; c.beginPath(); c.moveTo(px(play), y0 + 90); c.lineTo(px(play), base + 12); c.stroke(); }
    L.label(c, 'first freeze', PX0, base + 52, 44, { col: G5, align: 'left', alpha: a }); L.label(c, 'three years', PX1, base + 52, 44, { col: G5, align: 'right', alpha: a });
    c.restore();
  }

  // ---------- hands layer (IN++) ----------
  function hands(c, lt) {
    screen(c, 1, 540, 980);
    const pull = L.ease.inOut(L.clamp(lt / 1.0, 0, 1)), cx = 540, cy = 1080, reach = 250 - 40 * pull;
    // ropes into the knot
    rope(c, sagPts(-100, 1010, cx - reach, cy, 20 * (1 - pull), 8), 26); rope(c, sagPts(cx - reach, cy, cx, cy, 0, 4), 26);
    rope(c, sagPts(cx, cy, cx + reach, cy, 0, 4), 26); rope(c, sagPts(cx + reach, cy, 1180, 1010, 20 * (1 - pull), 8), 26);
    knot(c, cx, cy, 30 + pull * 6, 0.5 + 0.5 * Math.sin(lt * 5));
    // two identical hands (mirrored), fingers as cut-out segments, on rods
    [-1, 1].forEach(m => { const hx = cx + m * reach; c.fillStyle = INK;
      poly(c, [[hx + m * 60, cy - 70], [hx + m * 520, cy - 150], [hx + m * 560, cy + 60], [hx + m * 60, cy + 80]], INK);
      rrect(c, Math.min(hx + m * 10, hx + m * 130), cy - 80, 120, 150, 30); c.fill();
      for (let i = 0; i < 4; i++) { rrect(c, Math.min(hx - m * 34, hx + m * 30), cy - 72 + i * 36, 64, 32, 14); c.fill(); }
      c.beginPath(); c.ellipse(hx + m * 40, cy - 86, 44, 22, m * 0.5, 0, 7); c.fill();
      rod(c, hx + m * 80, cy + 60, hx + m * 170, 1920, 5); });
  }

  // ---------- captions ----------
  const CAPS = [
    [0, 1.8, ['Half a lifeline.', 'On hold.'], 330],
    [2.4, 4.3, ['One office.', 'Half a lifeline.'], 330],
    [4.5, 6.5, ['The other half:', 'an ocean away.'], 330],
    [8.7, 10.3, ['Every call.', 'One queue.'], 330],
    [10.5, 12.3, ['Two continents.', 'Same red.'], 330],
    [12.8, 14.4, ['Then it broke.', 'Both shores.'], 330],
    [16.2, 18.2, ['Connected.', 'After the dark.'], 330],
    [18.6, 20.9, ['We slowed it down', 'so you could see it.'], 400],
    [22.2, 28.4, ['Same red. Half the wait.'], 262],
    [25.2, 28.4, ['Illustrative. People still decide.'], 1480],
    [28.8, 30.3, ['Nobody was careless.', 'The queue was.'], 420],
    [30.35, 31.6, ['This is the bottleneck.'], 420],
  ];
  const capA = (t, a, b) => (a === 0 ? 1 : L.sm(a, a + 0.25, t)) * (1 - L.sm(b - 0.25, b, t));
  function caption(c, lines, y, a) { if (a <= 0) return; const size = lines.length === 1 && lines[0].length > 26 ? 60 : 84; L.title(c, lines.map(s => ({ text: s, size })), y, size, { alpha: a }); }

  // ---------- camera ----------
  const roomAcam = [[0, [540, 960, 1.0, 0]], [2.2, [540, 960, 1.0, 0]], [6.6, [570, 1000, 1.12, 0]], [8.4, [560, 700, 2.8, 0]]];
  const mapCam = [[7.7, [540, 700, 9, 0]], [10.2, [540, 960, 1.0, 0]], [14.4, [540, 960, 1.04, 0]], [15.6, [540, 1210, 9, 0]]];
  const roomBcam = [[15.2, [540, 700, 2.8, 0]], [16.4, [560, 1030, 1.28, 0]], [18.4, [570, 1050, 1.34, 0]]];

  function draw(c, t) {
    c.fillStyle = '#0d1118'; c.fillRect(0, 0, 1080, 1920);
    const day = dayStep(t);
    let slate = '';
    if (t < 1.8) {
      c.save(); L.camera(c, [[0, [540, 960, 1.0, 0]]], t); room(c, 1, FLASH, t, {}); c.restore();
      c.save(); c.globalAlpha = 0.85; c.fillStyle = INK; rrect(c, 80, 236, 190, 58, 10); c.fill(); c.restore(); L.label(c, 'LATER', 175, 280, 44, { col: RED });
      slate = 'SC1  OTS  FLASH-FORWARD';
    } else if (t < T0) {
      const f = (t - 1.8) / 0.4; c.fillStyle = '#111214'; c.fillRect(0, 0, 1080, 1920);
      c.strokeStyle = 'rgba(200,195,185,0.25)'; c.lineWidth = 3; for (let i = 0; i < 18; i++) { const y = (i * 131 + f * 2400) % 1920; c.beginPath(); c.moveTo(0, y); c.lineTo(1080, y); c.stroke(); }
      L.title(c, ['REWIND'], 980, 110); slate = 'WIPE';
    } else if (t < 8.4) {
      c.save(); L.camera(c, roomAcam, t); room(c, 1, day, t, {}); c.restore();
      if (t > 7.7) { const a = L.sm(7.7, 8.4, t); c.save(); c.globalAlpha = a; c.fillStyle = '#0d1118'; c.fillRect(0, 0, 1080, 1920); L.camera(c, mapCam, t); map(c, day, t, L.key(mapCam, t)[2]); c.restore(); }
      slate = t < 6.6 ? 'SC2  OTS  CLOSE' : 'SC3  PULL OUT  THROUGH THE WINDOW';
    } else if (t < 15.2) {
      c.save(); L.camera(c, mapCam, t); map(c, day, t, L.key(mapCam, t)[2]); c.restore();
      slate = t < 10.2 ? 'SC3  CRANE UP' : t < 14.4 ? 'SC4  WIDE' : 'SC5  DROP IN';
    } else if (t < 21.0) {
      const conn = L.sm(HEROTIE, HEROTIE + 0.4, t);
      c.save(); L.camera(c, roomBcam, t); room(c, -1, day, t, { tie: HEROTIE, connectedAlpha: conn }); c.restore();
      if (t < 15.8) { const a = 1 - L.sm(15.2, 15.8, t); c.save(); c.globalAlpha = a; L.camera(c, mapCam, t); map(c, day, t, L.key(mapCam, t)[2]); c.restore(); }
      if (t > 18.4) { c.save(); c.globalAlpha = 0.62 * L.sm(18.4, 18.9, t); c.fillStyle = '#060607'; c.fillRect(0, 0, 1080, 1920); c.restore(); }
      slate = t < 18.4 ? 'SC6  OTS  CLOSE+' : 'SC7  FREEZE';
    } else if (t < 28.6) {
      const a = L.sm(21.5, 22.0, t), play = L.clamp((t - 22.1) / 3.0, 0, 1) * SPAN;
      panel(c, 340, 'AS IT HAPPENED', false, play, a); panel(c, 870, 'ROUTED · ILLUSTRATIVE', true, play, a);
      slate = 'SC8  SNAP  SAME CLOCK';
    } else if (t < 31.6) {
      c.save(); L.camera(c, [[28.6, [540, 1060, 1.0, 0]], [31.6, [540, 1070, 1.12, 0]]], t); hands(c, t - 28.6); c.restore();
      slate = 'SC9  EXTREME CLOSE';
    } else {
      L.endCard(c, L.sm(31.6, 31.9, t));
    }
    CAPS.forEach(([a, b, lines, y]) => caption(c, lines, y, capA(t, a, b)));
    if (t < 31.6 && slate) L.slate(c, slate);
    L.grain(c, t, { alpha: 0.05, n: 500 });
  }

  const acts = [
    { start: 0, end: 2.2, bpm: 0, drone: true }, { start: 2.2, end: 12.3, bpm: 0, drone: true }, { start: 12.3, end: 18.4, bpm: 0, drone: true },
    { start: 18.4, end: 21.0, bpm: 0, drone: true }, { start: 21.5, end: 28.6, bpm: 0, drone: true }, { start: 28.6, end: 31.6, bpm: 60, drone: true }, { start: 31.6, end: 36, bpm: 0, drone: true },
  ];
  const cues = [{ t: 1.8, type: 'whoosh' }, { t: 7.7, type: 'whoosh' }, { t: T0 + BREAK / DPS, type: 'stamp' }, { t: T0 + FLASH / DPS, type: 'hit' }, { t: HEROTIE, type: 'ding' },
    { t: 14.4, type: 'whoosh' }, { t: 21.5, type: 'hit' }, { t: 29.4, type: 'pop' }];
  return { draw, DUR, acts, cues };
}
module.exports = makeScene;
