// the-truth-loop: seamless-loop, ink wash, mind. Analog: false-news-2018.
// One mapping: race 1 film second = 1 hour, h = t - 1.25 (h 0..14). Cold open t 0..1.25 = h 12.8..14.05 of the same
// timeline; loop tail t 30.8..32 = h 11.6..12.8, so the last frame flows into frame 1.
// Red: L.logistic fitted through the sourced endpoints (1 of 1,500 at 0 h, 99% at 10 h): doubling 0.58 h (same fit as the-fact-check).
// Green: knowers spread 6x slower (doubling 3.49 h); six fact-check links at L.lognormalQuantile((i+.5)/6, 13, 20).
// Snap: 1 s = 10 h in both panels; AI routed correction 1 h after the claim reaches each person (illustrative).
// See output/the-truth-loop/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const { createCanvas } = require('@napi-rs/canvas');
  const A = L.loadAnalog('false-news-2018');
  const DUR = 32.0, RED = L.RED, GREEN = L.GREEN;
  const INK = '#1a1a1d', PAPER = '#e8e3d6';
  const rgbaR = a => `rgba(255,59,48,${a})`, rgbaG = a => `rgba(52,210,123,${a})`, ink = a => `rgba(26,26,29,${a})`, pap = a => `rgba(232,227,214,${a})`;

  // ---------------- speed math ----------------
  const N = 1500, S0 = 1 / N;
  const R_RED = Math.log(0.99 * (1 - S0) / (0.01 * S0)) / A.threat.points[1].t;   // 1.19 /h
  const D_RED = Math.LN2 / R_RED;                                                // 0.58 h
  const D_TRUE = D_RED * 6;                                                      // truth ~6x slower (s1)
  const share = h => h <= 0 ? S0 : L.logistic(h, D_RED, S0);
  const shareTrue = h => h <= 0 ? S0 : L.logistic(h, D_TRUE, S0);
  const invShare = p => Math.max(0, Math.log(p * (1 - S0) / ((1 - p) * S0)) / R_RED);
  const AGG = A.solution.aggregation, MED = AGG.median, P90 = AGG.p90;           // 13, 20
  const AIH = A.ai_counterfactual.aggregation_median;                            // 1
  const FC = [0, 1, 2, 3, 4, 5].map(i => L.lognormalQuantile((i + 0.5) / 6, MED, P90));  // 8.2 .. 20.7
  const RACE0 = 1.25, H_END = 14;
  const GREEN_POST_H = MED;                                                      // protagonist's feed gets the median correction

  // ---------------- paper ----------------
  const paper = createCanvas(1080, 1920); {
    const p = paper.getContext('2d'), r = L.rng(11); p.fillStyle = PAPER; p.fillRect(0, 0, 1080, 1920);
    for (let i = 0; i < 90; i++) { const x = r() * 1080, y = r() * 1920, rad = 60 + r() * 260, g = p.createRadialGradient(x, y, 0, x, y, rad);
      const dk = r() < 0.5; g.addColorStop(0, dk ? 'rgba(120,112,98,0.05)' : 'rgba(255,253,246,0.07)'); g.addColorStop(1, 'rgba(0,0,0,0)'); p.fillStyle = g; p.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
    p.lineWidth = 1; for (let i = 0; i < 2600; i++) { const x = r() * 1080, y = r() * 1920, a = r() * Math.PI, l = 6 + r() * 26;
      p.strokeStyle = `rgba(90,84,74,${0.04 + r() * 0.07})`; p.beginPath(); p.moveTo(x, y); p.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); p.stroke(); }
    const v = p.createRadialGradient(540, 900, 500, 540, 900, 1250); v.addColorStop(0, 'rgba(60,56,50,0)'); v.addColorStop(1, 'rgba(60,56,50,0.22)'); p.fillStyle = v; p.fillRect(0, 0, 1080, 1920);
  }

  // ---------------- ink brushes ----------------
  // Wet brush along a polyline: many translucent dabs, width modulated by noise and taper.
  function brush(ctx, pts, w, { a = 0.16, seed = 1, col = [26, 26, 29], taper = true, step = 3 } = {}) {
    let tot = 0; const seg = []; for (let i = 0; i < pts.length - 1; i++) { const l = Math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]); seg.push(l); tot += l; }
    if (tot <= 0) return; const n = Math.max(2, Math.floor(tot / step)); let si = 0, acc = 0;
    ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${a})`;
    for (let k = 0; k <= n; k++) { const d = tot * k / n; while (si < seg.length - 1 && acc + seg[si] < d) { acc += seg[si]; si++; }
      const f = seg[si] ? (d - acc) / seg[si] : 0, x = L.lerp(pts[si][0], pts[si + 1][0], f), y = L.lerp(pts[si][1], pts[si + 1][1], f);
      const u = k / n, tp = taper ? Math.min(1, Math.sin(Math.PI * u) * 1.6 + 0.15) : 1, ww = w * tp * (0.7 + 0.6 * L.noise(k * 0.07, seed));
      ctx.beginPath(); ctx.arc(x + (L.noise(k * 0.3, seed + 3) - 0.5) * w * 0.25, y + (L.noise(k * 0.3, seed + 5) - 0.5) * w * 0.25, ww, 0, 7); ctx.fill(); }
  }
  const arcPts = (cx, cy, rx, ry, a0, a1, n = 60) => { const p = []; for (let i = 0; i <= n; i++) { const a = L.lerp(a0, a1, i / n); p.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); } return p; };
  function wash(ctx, x, y, r, col, a) { const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col(a)); g.addColorStop(0.6, col(a * 0.55)); g.addColorStop(1, col(0)); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2); }

  // ---------------- the protagonist (world coords, native scale at zoom 1) ----------------
  const FACE = [540, 700], RX = 250, RY = 310;
  const EYES = [[440, 700], [640, 700]];
  const PH = { x: 300, y: 1200, w: 480, h: 980 }, WIN = { x: 322, y: 1240, w: 436, h: 940 };
  const REFL = { w: 26, h: 48 };                     // phone reflection inside each iris
  const EYE_T = [EYES[0][0] - 3, EYES[0][1] + 10];   // camera target for the fall in (left reflection)

  // Feed: posts scroll at SP px/h; post jG (the correction) lands at LAND_Y at h = 13.
  const POST = 210, GAP = 22, PITCH = POST + GAP, SP = PITCH * 1.8, LAND_Y = 1690, JG = 100;
  const postY = (j, h) => LAND_Y + (j - JG) * PITCH - SP * (h - GREEN_POST_H);
  const postH = j => GREEN_POST_H + (LAND_Y + (j - JG) * PITCH - 1920) / SP;   // hour post j scrolls into view
  const HR_PROT = invShare(3 / N);                                               // 0.92 h: the claim reaches the protagonist
  const pr = L.rng(501), PU = []; for (let j = 0; j < 200; j++) PU.push({ u: pr(), img: pr() < 0.55, l1: 0.5 + pr() * 0.4, l2: 0.3 + pr() * 0.5 });
  let firstRed = -1; for (let j = 0; j < 200; j++) if (postH(j) >= HR_PROT) { firstRed = j; break; }
  const postKind = j => { if (j === JG) return 'g'; const hj = postH(j); if (hj < HR_PROT) return 'x'; if (j === firstRed) return 'r'; return PU[j].u < 0.8 * share(hj) ? 'r' : 'x'; };
  // Draw the feed in the phone window's local coordinates (x 0..WIN.w, y from WIN.y world).
  function drawFeed(ctx, h, hd = 1) {
    ctx.fillStyle = '#d8d3c6'; ctx.fillRect(WIN.x, WIN.y, WIN.w, WIN.h);
    const jl = Math.floor(JG + (WIN.y - LAND_Y + SP * (h - GREEN_POST_H)) / PITCH) - 1;
    for (let j = Math.max(0, jl); j < jl + 7 && j < 200; j++) {
      const y = postY(j, h); if (y > WIN.y + WIN.h || y + POST < WIN.y) continue; const k = postKind(j), P = PU[j], x = WIN.x + 16, w = WIN.w - 32;
      ctx.fillStyle = k === 'r' ? '#efe9dc' : k === 'g' ? '#efe9dc' : '#e2ddd0'; ctx.fillRect(x, y, w, POST);
      if (k === 'r') { ctx.fillStyle = RED; ctx.fillRect(x + 14, y + 14, w - 28, POST - 90); }
      else if (k === 'g') { ctx.fillStyle = GREEN; ctx.fillRect(x + 14, y + 14, w - 28, POST - 90);
        if (hd) { ctx.strokeStyle = '#0f3a22'; ctx.lineWidth = 12; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(x + w / 2 - 44, y + 62); ctx.lineTo(x + w / 2 - 10, y + 96); ctx.lineTo(x + w / 2 + 50, y + 34); ctx.stroke(); } }
      else if (P.img) { ctx.fillStyle = '#b9b4a8'; ctx.fillRect(x + 14, y + 14, w - 28, POST - 90); }
      ctx.fillStyle = k === 'x' ? '#a29d92' : '#8d887e'; ctx.fillRect(x + 14, y + POST - 62, (w - 28) * P.l1, 16); ctx.fillRect(x + 14, y + POST - 36, (w - 28) * P.l2, 14);
      if (!P.img && k === 'x') { ctx.fillRect(x + 14, y + 22, (w - 28) * 0.9, 16); ctx.fillRect(x + 14, y + 50, (w - 28) * 0.7, 16); ctx.fillRect(x + 14, y + 78, (w - 28) * 0.8, 16); }
    }
  }
  // Light on the face from the phone: red share of visible posts, green when the correction is on screen.
  function screenLight(h) { let r = 0, g = 0, n = 0; for (let j = 0; j < 200; j++) { const y = postY(j, h); if (y > WIN.y + WIN.h || y + POST < Math.max(WIN.y, 1100)) continue;
      const vis = (Math.min(1920, y + POST) - Math.max(WIN.y, y)) / POST; if (vis <= 0) continue; n += vis; const k = postKind(j); if (k === 'r') r += vis; if (k === 'g') g += vis; }
    return { r: n ? r / n : 0, g: Math.min(1, g) }; }

  function drawPhone(ctx, h) {
    ctx.fillStyle = '#26262a'; ctx.beginPath(); ctx.roundRect(PH.x, PH.y, PH.w, PH.h, 46); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.rect(WIN.x, WIN.y, WIN.w, WIN.h); ctx.clip(); drawFeed(ctx, h); ctx.restore();
    brush(ctx, [[PH.x + 10, PH.y + 30], [PH.x + 6, PH.y + PH.h]], 9, { a: 0.2, seed: 41, taper: false });
    brush(ctx, [[PH.x + PH.w - 8, PH.y + 30], [PH.x + PH.w - 4, PH.y + PH.h]], 9, { a: 0.2, seed: 42, taper: false });
  }

  function drawEye(ctx, [ex, ey], h, i, lit) {
    // eyeball: paper, lower lid lit by the screen
    ctx.save(); ctx.beginPath(); ctx.moveTo(ex - 78, ey); ctx.quadraticCurveTo(ex, ey - 62, ex + 78, ey); ctx.quadraticCurveTo(ex, ey + 50, ex - 78, ey); ctx.closePath();
    ctx.fillStyle = '#f1ede3'; ctx.fill(); ctx.clip();
    // iris: ink wash, looking down at the phone
    const ix = ex - 3, iy = ey + 10; wash(ctx, ix, iy, 56, ink, 0.55); ctx.fillStyle = ink(0.78); ctx.beginPath(); ctx.arc(ix, iy, 38, 0, 7); ctx.fill();
    ctx.fillStyle = ink(0.95); ctx.beginPath(); ctx.arc(ix, iy, 20, 0, 7); ctx.fill();
    // the phone, reflected
    ctx.save(); ctx.translate(ix - REFL.w / 2, iy - REFL.h / 2); ctx.scale(REFL.w / WIN.w, REFL.h / WIN.h); ctx.translate(-WIN.x, -WIN.y);
    ctx.globalAlpha = 0.9; ctx.beginPath(); ctx.rect(WIN.x, WIN.y, WIN.w, WIN.h); ctx.clip(); drawFeed(ctx, h); ctx.restore();
    ctx.fillStyle = 'rgba(250,248,240,0.8)'; ctx.beginPath(); ctx.ellipse(ix + 16, iy - 22, 6, 4, -0.5, 0, 7); ctx.fill();
    ctx.restore();
    brush(ctx, arcPts(ex, ey + 2, 82, 44, Math.PI * 1.05, Math.PI * 1.95, 30), 7, { a: 0.3, seed: 60 + i });   // upper lid
    brush(ctx, arcPts(ex, ey - 6, 70, 34, Math.PI * 0.2, Math.PI * 0.8, 20), 3, { a: 0.18, seed: 70 + i });   // lower lid
  }

  function drawPerson(ctx, h, detail) {
    const L0 = screenLight(h);
    // shoulders and neck (behind the phone)
    brush(ctx, [[180, 1900], [250, 1300], [440, 1150]], 70, { a: 0.07, seed: 3 });
    brush(ctx, [[900, 1900], [830, 1300], [640, 1150]], 70, { a: 0.07, seed: 4 });
    brush(ctx, [[470, 980], [460, 1150]], 22, { a: 0.12, seed: 5 }); brush(ctx, [[610, 980], [620, 1150]], 22, { a: 0.12, seed: 6 });
    // head: pale wash, brush outline
    ctx.fillStyle = '#ece7da'; ctx.beginPath(); ctx.ellipse(FACE[0], FACE[1], RX, RY, 0, 0, 7); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.ellipse(FACE[0], FACE[1], RX, RY, 0, 0, 7); ctx.clip();
    // screen light on the skin (red from below; green, when present, from the lower right; kept apart so they never mix)
    const ra = 0.42 * L0.r * (1 - 0.8 * L0.g); if (ra > 0.005) { const g = ctx.createRadialGradient(540, 1250, 100, 540, 1250, 760); g.addColorStop(0, rgbaR(ra)); g.addColorStop(1, rgbaR(0)); ctx.fillStyle = g; ctx.fillRect(200, 300, 700, 800); }
    if (L0.g > 0.01) { const g = ctx.createRadialGradient(560, 1200, 60, 560, 1200, 440); g.addColorStop(0, rgbaG(0.55 * L0.g)); g.addColorStop(1, rgbaG(0)); ctx.fillStyle = g; ctx.fillRect(200, 760, 700, 400); }
    ctx.restore();
    brush(ctx, arcPts(FACE[0], FACE[1], RX, RY, Math.PI * 0.05, Math.PI * 0.95, 60), 10, { a: 0.16, seed: 7 });
    brush(ctx, arcPts(FACE[0], FACE[1], RX, RY, Math.PI * 0.9, Math.PI * 2.1, 60), 8, { a: 0.14, seed: 8 });
    // hair: dark ink mass
    const hp = []; for (let i = 0; i <= 40; i++) { const a = L.lerp(Math.PI * 0.93, Math.PI * 2.07, i / 40); hp.push([FACE[0] + Math.cos(a) * (RX + 14), FACE[1] - 40 + Math.sin(a) * (RY + 16)]); }
    brush(ctx, hp, 60, { a: 0.12, seed: 9 }); brush(ctx, hp.map(([x, y]) => [x, y + 30]), 40, { a: 0.1, seed: 10 });
    if (detail) {
      EYES.forEach((e, i) => drawEye(ctx, e, h, i));
      brush(ctx, [[370, 610], [430, 594], [500, 612]], 9, { a: 0.26, seed: 20 }); brush(ctx, [[580, 612], [650, 594], [710, 610]], 9, { a: 0.26, seed: 21 });   // brows
      brush(ctx, [[545, 720], [528, 820], [560, 842]], 6, { a: 0.22, seed: 22 });                                            // nose
      brush(ctx, [[488, 910], [540, 916], [592, 908]], 6, { a: 0.3, seed: 23 });                                             // mouth, level
    }
    return L0;
  }

  // ---------------- the feed-world: 1,500 heads ----------------
  const ZW = 0.042, CR = 500 / (Math.sqrt(N + 14) * ZW), YS = 1.5, HR = 230;
  const cr = L.rng(2018); const CROWD = [];
  for (let k = 0; k < N; k++) { const rr = k === 0 ? 0 : CR * Math.sqrt(k + 14), a = k * 2.39996 + cr() * 0.3;
    CROWD.push({ x: FACE[0] + Math.cos(a) * rr, y: FACE[1] + Math.sin(a) * rr * YS, nr: rr / (CR * Math.sqrt(N + 14)), a, kn: 0, rk: 0 }); }
  // red order: distance from a seed just up-left of the protagonist + noise (spatial proxy for a reshare tree)
  const SEEDP = [CROWD[3].x, CROWD[3].y];
  const ord = CROWD.map((c, i) => ({ i, d: Math.hypot(c.x - SEEDP[0], (c.y - SEEDP[1]) / YS) * (0.75 + cr() * 0.5) })).sort((p, q) => p.d - q.d).map(o => o.i);
  const pi0 = ord.indexOf(0); ord.splice(pi0, 1); ord.splice(2, 0, 0);          // protagonist is rank 2 (the third person reached)
  ord.forEach((ci, r) => { CROWD[ci].rk = r; CROWD[ci].hr = r === 0 ? 0 : invShare((r + 1) / N); });
  const kOrd = CROWD.map((_, i) => i).filter(i => i !== 0).sort(() => 0).map(i => ({ i, u: cr() })).sort((p, q) => p.u - q.u).map(o => o.i);
  kOrd.forEach((ci, r) => { CROWD[ci].kn = (r + 1) / N; });                          // knower if kn <= shareTrue(h)
  const cOrd = CROWD.map((_, i) => ({ i, u: cr() })).sort((p, q) => p.u - q.u); cOrd.forEach((o, r) => { CROWD[o.i].cr = (r + 1) / N; });
  // six fact-check nodes on the rim, each linking to one head at FC[i]
  const FCN = FC.map((T, i) => { const a = -Math.PI / 2 + (i + 0.5) * Math.PI * 2 / 6 + 0.2, R = CR * Math.sqrt(N + 14) * 1.08;
    const x = FACE[0] + Math.cos(a) * R * 0.9, y = FACE[1] + Math.sin(a) * R * YS;
    let best = 1; CROWD.forEach((c, ci) => { if (Math.abs(c.nr - 0.55) < 0.06 && Math.abs(Math.atan2((c.y - FACE[1]) / YS, c.x - FACE[0]) - Math.atan2(Math.sin(a), Math.cos(a))) < 0.2) best = ci; });
    return { T, x, y, to: best }; });

  function drawCrowd(ctx, h, z, alpha) {
    if (alpha <= 0) return; ctx.save(); ctx.globalAlpha = alpha; const px = 1 / z;
    CROWD.forEach((c, i) => { if (i === 0) return;
      const red = h >= c.hr, kn = c.kn <= shareTrue(h);
      wash(ctx, c.x, c.y + 20, HR * 1.9, red && !kn ? rgbaR : ink, red && !kn ? 0.16 : 0.05);
      if (kn) { ctx.strokeStyle = GREEN; ctx.lineWidth = 3 / z; ctx.beginPath(); ctx.arc(c.x, c.y, HR * 2.2, 0, 7); ctx.stroke(); }
      ctx.fillStyle = kn ? GREEN : red ? RED : '#8b867b'; ctx.beginPath(); ctx.arc(c.x, c.y, HR * (kn ? 1.3 : red ? 0.9 : 0.7), 0, 7); ctx.fill();
      ctx.fillStyle = ink(0.35); ctx.fillRect(c.x - 70, c.y + 300, 140, 200); });
    // fact-check links (thread from the rim, 1 h to cross)
    FCN.forEach((n, i) => { const lit = h >= n.T; const tgt = CROWD[n.to];
      ctx.fillStyle = lit ? GREEN : rgbaG(0.4); ctx.fillRect(n.x - 520, n.y - 520, 1040, 1040);
      ctx.strokeStyle = PAPER; ctx.lineWidth = 90; ctx.strokeRect(n.x - 300, n.y - 300, 600, 600);
      if (!lit) return; const g = L.clamp(h - n.T, 0, 1);
      ctx.strokeStyle = GREEN; ctx.lineWidth = 7 * px; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(L.lerp(n.x, tgt.x, g), L.lerp(n.y, tgt.y, g)); ctx.stroke();
      if (g >= 1) { ctx.strokeStyle = GREEN; ctx.lineWidth = 5 * px; ctx.beginPath(); ctx.arc(tgt.x, tgt.y, HR * 1.5, 0, 7); ctx.stroke(); } });
    ctx.restore();
  }
  function drawProtagSimple(ctx, h, z, alpha) {
    if (alpha <= 0) return; ctx.save(); ctx.globalAlpha = alpha; const L0 = screenLight(h), red = h >= HR_PROT;
    wash(ctx, FACE[0], FACE[1] + 20, HR * 2.2, red ? rgbaR : ink, red ? 0.2 : 0.06);
    ctx.fillStyle = red ? RED : '#8b867b'; ctx.beginPath(); ctx.arc(FACE[0], FACE[1], HR * 0.9, 0, 7); ctx.fill();
    ctx.fillStyle = ink(0.35); ctx.fillRect(FACE[0] - 70, FACE[1] + 300, 140, 200);
    ctx.strokeStyle = ink(0.8); ctx.lineWidth = 3.5 / z; ctx.beginPath(); ctx.arc(FACE[0], FACE[1] + 100, HR * 2.6, 0, 7); ctx.stroke();
    ctx.restore();
  }

  // ---------------- the enso (lap timer, no digits) ----------------
  const ENSO = [540, 760], ER = 450, EA0 = -Math.PI / 2 + 0.12;
  const ensoA = hh => EA0 + (Math.PI * 2 - 0.24) * L.clamp(hh / H_END, 0, 1);
  function drawEnso(ctx, h, alpha) {
    if (alpha <= 0) return; ctx.save(); ctx.globalAlpha = alpha; const a1 = ensoA(h);
    if (a1 > EA0 + 0.01) { const n = Math.max(3, Math.round((a1 - EA0) * 40)); brush(ctx, arcPts(ENSO[0], ENSO[1], ER, ER, EA0, a1, n), 20, { a: 0.1, seed: 31, step: 5 });
      brush(ctx, arcPts(ENSO[0], ENSO[1], ER + 8, ER + 8, EA0, a1, n), 6, { a: 0.12, seed: 32, step: 5 }); }
    // everyone reached (10 h): a red dab; the correction (13 h): a green dab
    [[A.threat.points[1].t, RED], [GREEN_POST_H, GREEN]].forEach(([th, col]) => { if (h < th) return; const a = ensoA(th), x = ENSO[0] + Math.cos(a) * ER, y = ENSO[1] + Math.sin(a) * ER;
      const k = L.sm(th, th + 0.3, h); ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, 26 * k, 0, 7); ctx.fill(); });
    ctx.restore();
  }

  // ---------------- camera ----------------
  const Z_EYE = 14, Z_EYE2 = 20;
  function cam(t) {
    if (t < 4.0 || t >= 30.8) return { z: 1, cx: 540, cy: 960 };
    if (t < 7.5) { const f = L.ease.inOut((t - 4.0) / 3.5); return { z: Math.exp(L.lerp(0, Math.log(ZW), f)), cx: 540, cy: L.lerp(960, 760, f) }; }
    if (t < 11.2) return { z: ZW, cx: 540, cy: 760 };
    if (t < 15.25) { const f = L.ease.inOut((t - 11.2) / 4.05), z = Math.exp(L.lerp(Math.log(ZW), Math.log(Z_EYE), f));
      const s0x = (EYE_T[0] - 540) * ZW, s0y = (EYE_T[1] - 760) * ZW; return { z, cx: EYE_T[0] - s0x * (1 - f) / z, cy: EYE_T[1] - s0y * (1 - f) / z }; }
    if (t < 18.0) return { z: Z_EYE * (1 + 0.05 * L.sm(15.25, 18, t)), cx: EYE_T[0], cy: EYE_T[1] };
    return { z: L.lerp(Z_EYE, Z_EYE2, L.ease.out(L.clamp((t - 25) / 2.2, 0, 1))), cx: EYE_T[0], cy: EYE_T[1] };
  }
  function world(ctx, t, h) {
    ctx.drawImage(paper, 0, 0);
    const C = cam(t), z = C.z;
    ctx.save(); ctx.translate(540, 960); ctx.scale(z, z); ctx.translate(-C.cx, -C.cy);
    const det = L.sm(0.2, 0.34, z), crowdA = 1 - L.sm(0.16, 0.34, z);
    drawCrowd(ctx, h, z, crowdA);
    drawProtagSimple(ctx, h, z, 1 - det);
    if (det > 0) { ctx.save(); ctx.globalAlpha = det; drawPerson(ctx, h, true); drawPhone(ctx, h); ctx.restore(); }
    ctx.restore();
    // enso is a screen-space element of the locked-off close; it shrinks away with the pull-out
    if (z >= 0.3 && z <= 1.5) { const k = z; ctx.save(); ctx.translate(540, 960); ctx.scale(k, k); ctx.translate(-540, -960); drawEnso(ctx, h, L.sm(0.3, 0.8, z) * (1 - L.sm(1.05, 1.4, z))); ctx.restore(); }
  }

  // cards: dark ink serif on a pale wash so they read over any layer
  function card(ctx, lines, y, a, size = 84, col = INK) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a;
    const n = lines.length, hgt = size * 1.04 * n; ctx.fillStyle = pap(0.82); ctx.beginPath(); ctx.ellipse(540, y - size * 0.35 + (n - 1) * size * 0.52, 470, hgt * 0.5 + 44, 0, 0, 7); ctx.fill();
    ctx.restore(); L.title(ctx, lines.map(l => typeof l === 'string' ? { text: l, col } : l), y, size, { alpha: a, outline: false, col });
  }

  // ---------------- snap panels ----------------
  function panel(ctx, y0, hh, mode) {
    const X0 = 80, W = 920, H = 500, cx = X0 + 250, cy = y0 + H / 2, R = 215;
    ctx.fillStyle = 'rgba(240,236,226,0.9)'; ctx.fillRect(X0, y0, W, H);
    brush(ctx, [[X0, y0], [X0 + W, y0], [X0 + W, y0 + H], [X0, y0 + H], [X0, y0]], 5, { a: 0.25, seed: mode === 'ai' ? 81 : 80, taper: false, step: 4 });
    CROWD.forEach((c, i) => { const x = cx + Math.cos(c.a) * c.nr * R, y = cy + Math.sin(c.a) * c.nr * R; const red = hh >= c.hr, kn = c.kn <= shareTrue(hh);
      const ring = mode === 'ai' ? hh >= c.hr + AIH : c.cr <= (hh >= MED ? L.logistic(hh - MED, D_TRUE, S0) : 0);
      if (ring) { ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(x, y, 5.6, 0, 7); ctx.fill(); }
      ctx.fillStyle = kn ? GREEN : red ? RED : '#a39e93'; ctx.beginPath(); ctx.arc(x, y, ring ? 3.2 : 3.4, 0, 7); ctx.fill(); });
    // timeline 0..20 h, no digits
    const x0 = X0 + 500, x1 = X0 + W - 50, ty = y0 + H - 70, hx = v => L.lerp(x0, x1, v / 20);
    ctx.fillStyle = '#9a958a'; ctx.fillRect(x0, ty - 3, x1 - x0, 6);
    ctx.fillStyle = RED; ctx.fillRect(x0, ty - 8, (hx(Math.min(hh, 20)) - x0), 16);
    const gt = mode === 'ai' ? AIH : MED; if (hh >= gt) { ctx.fillStyle = GREEN; ctx.fillRect(hx(gt) - 7, ty - 40, 14, 80); }
    ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(hx(Math.min(hh, 20)), ty, 12, 0, 7); ctx.fill();
    return { X0, y0, W, H };
  }

  // ---------------- draw ----------------
  function draw(ctx, t) {
    // cold open and loop tail: the end of the previous lap, locked-off close
    if (t < RACE0 || t >= 30.8) {
      const h = t < RACE0 ? 12.8 + t : 12.8 - (DUR - t);
      world(ctx, t, h);
      card(ctx, ['The fix always lands late.'], 240, t < RACE0 ? 1 : L.sm(31.2, 31.6, t), 80);
      if (t < RACE0) { const b = L.sm(1.05, 1.25, t); if (b > 0) { ctx.fillStyle = ink(b); ctx.fillRect(0, 0, 1080, 1920); } }
      if (t >= 30.8) { const ea = 1 - L.sm(30.8, 31.4, t); if (ea > 0) L.endCard(ctx, ea, { line: 'Help close the gap.' }); }
      L.slate(ctx, 'SC1  CLOSE (locked)');
      return;
    }
    // RACE: one lap, h 0..14
    if (t < 15.25) {
      const h = t - RACE0; world(ctx, t, h);
      const b = 1 - L.sm(1.25, 1.5, t); if (b > 0) { ctx.fillStyle = ink(b); ctx.fillRect(0, 0, 1080, 1920); }
      card(ctx, ['One claim. One feed.'], 240, L.sm(2.3, 2.6, t) * (1 - L.sm(3.9, 4.2, t)), 84);
      card(ctx, ['Then everyone you follow.'], 260, L.sm(5.0, 5.3, t) * (1 - L.sm(7.4, 7.7, t)), 80);
      card(ctx, ['The correction exists.', { text: 'In pieces.', col: '#1f8f53' }], 250, L.sm(8.0, 8.3, t) * (1 - L.sm(10.9, 11.2, t)), 80);
      card(ctx, ['13 hours later.'], 280, L.sm(13.3, 13.6, t), 92);
      L.slate(ctx, t < 4 ? 'SC1  CLOSE (locked)' : t < 7.5 ? 'SC2  PULL OUT' : t < 11.2 ? 'SC2  WIDE' : 'SC3  FALL IN (eye)');
      return;
    }
    // FREEZE on the eye
    if (t < 18.0) {
      world(ctx, t, H_END); ctx.fillStyle = `rgba(20,20,22,${0.35 * L.sm(15.25, 15.6, t)})`; ctx.fillRect(0, 0, 1080, 1920);
      card(ctx, ['13 hours later.'], 280, 1 - L.sm(15.25, 15.5, t), 92);
      card(ctx, ['We slowed it down', 'so you could see it.'], 300, L.sm(15.7, 16.0, t), 86);
      L.slate(ctx, 'SC3  FREEZE'); return;
    }
    // SNAP
    if (t < 25.0) {
      ctx.drawImage(paper, 0, 0);
      if (t < 18.4) { ctx.fillStyle = ink(1 - L.sm(18.2, 18.4, t)); ctx.fillRect(0, 0, 1080, 1920); L.slate(ctx, 'SC4  SILENCE'); return; }
      const hh = L.clamp((t - 18.4) * 10, 0, 20);
      card(ctx, ['Same claim. True proportions.'], 290, 1 - L.sm(21.6, 21.9, t), 66);
      card(ctx, ['Speed is not belief.'], 300, L.sm(21.9, 22.2, t), 76);
      const P1 = panel(ctx, 380, hh, 'human');
      L.label(ctx, 'as it happened', 590, P1.y0 + 90, 58, { col: INK, font: SERIF, align: 'left' });
      if (hh >= MED) L.label(ctx, '13 h', 590, P1.y0 + 250, 120, { col: '#1f8f53', font: SERIF, align: 'left' });
      const P2 = panel(ctx, 920, hh, 'ai');
      L.label(ctx, 'routed', 590, P2.y0 + 80, 58, { col: INK, font: SERIF, align: 'left' });
      L.label(ctx, 'illustrative', 590, P2.y0 + 140, 48, { col: '#5e5a52', align: 'left' });
      if (hh >= AIH) L.label(ctx, '1 h', 590, P2.y0 + 290, 120, { col: '#1f8f53', font: SERIF, align: 'left' });
      if (hh >= 12) L.label(ctx, 'people still decide', 590, P2.y0 + 360, 44, { col: '#3b3935', align: 'left', alpha: L.sm(12, 16, hh) });
      L.slate(ctx, 'SC4  SNAP'); return;
    }
    // CLOSE++ into the eye, then END
    if (t < 27.4) {
      world(ctx, t, H_END); ctx.fillStyle = ink(1 - L.sm(25.0, 25.35, t)); ctx.fillRect(0, 0, 1080, 1920);
      card(ctx, ['This is the bottleneck.'], 300, L.sm(25.4, 25.7, t), 88);
      ctx.fillStyle = `rgba(13,17,24,${L.sm(27.1, 27.4, t)})`; ctx.fillRect(0, 0, 1080, 1920);
      L.slate(ctx, 'SC5  CLOSE++'); return;
    }
    L.endCard(ctx, 1, { line: 'Help close the gap.' }); L.slate(ctx, 'END');
  }

  return {
    draw, DUR,
    acts: [
      { start: 0, end: 15.25, bpm: 64, drone: true },
      { start: 15.25, end: 18.0, bpm: 0, drone: true },
      { start: 18.4, end: 25.0, bpm: 48, drone: true },
      { start: 25.0, end: 32.0, bpm: 0, drone: true },
    ],
    cues: [
      { t: 1.2, type: 'whoosh' }, { t: RACE0 + HR_PROT, type: 'pop' }, { t: 4.0, type: 'whoosh' },
      ...FC.filter(T => T < H_END).map(T => ({ t: RACE0 + T, type: 'pop' })),
      { t: 11.2, type: 'whoosh' }, { t: RACE0 + GREEN_POST_H, type: 'ding' },
      { t: 18.4, type: 'hit' }, { t: 25.0, type: 'stamp' }, { t: 27.4, type: 'ding' },
    ],
  };
}
if (typeof module !== 'undefined') module.exports = makeScene;
