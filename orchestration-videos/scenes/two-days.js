// two-days: based-on-a-true-story, ink wash, continuous zoom through scales. Analog: covid-2020.
// Speeds: red = analog threat.points (map) and L.logistic with doubling_time 7.4 (inside a city);
// green = analog fragment dates + L.lognormalQuantile(median 421, p90 490) per country; AI snap = ai_counterfactual (illustrative).
// Mapping: from t=4s, day = 13 + 30*(t-4) (1 s = 30 days, linear). See output/two-days/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('covid-2020');
  const DUR = 40, RED = L.RED, GREEN = L.GREEN, PAPER = '#e6e0d2', INK = '28,29,33';
  const C = { x: 540, y: 960 };
  const ink = a => `rgba(${INK},${a})`;

  // ---------- time mapping ----------
  const T0 = 4, D0 = 13, DPS = 30, TSTOP = 21;
  const dayAt = t => D0 + DPS * (Math.min(t, TSTOP) - T0);
  const tOfDay = d => T0 + (d - D0) / DPS;

  // ---------- threat: piecewise-linear extent from analog points ----------
  const pts = [{ t: 0, extent: 0 }].concat(A.threat.points);
  const extent = d => { if (d <= 0) return 0; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1]; if (d <= b.t) return L.lerp(a.extent, b.extent, (d - a.t) / (b.t - a.t)); } return pts[pts.length - 1].extent; };
  const DOUBLING = A.threat.doubling_time;

  // ---------- green: fragments and per-country arrivals ----------
  const F = {}; A.solution.fragments.forEach(f => F[f.id] = f.ready_at);
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;
  const AIMED = A.ai_counterfactual.aggregation_median, AIP90 = AIMED * P90 / MED;
  const FIRST = F.f7; // first dose outside trials: nobody doses earlier

  // ---------- helpers ----------
  function wash(ctx, x, y, rx, ry, a, rgb = INK) {
    if (a <= 0.003 || rx <= 0) return;
    ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / rx);
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(0.55, `rgba(${rgb},${a * 0.7})`); g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, rx, 0, 7); ctx.fill(); ctx.restore();
  }
  function brush(ctx, x1, y1, x2, y2, w, a, seed = 1, rgb = INK) {
    L.sketchLine(ctx, x1, y1, x2, y2, { w, col: `rgba(${rgb},${a})`, seed, jitter: w * 0.25 });
    L.sketchLine(ctx, x1, y1, x2, y2, { w: w * 0.45, col: `rgba(${rgb},${a * 0.8})`, seed: seed + 7, jitter: w * 0.35 });
  }
  function poly(ctx, arr, w, a, rgb = INK) { ctx.strokeStyle = `rgba(${rgb},${a})`; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath(); arr.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.stroke(); }
  function glow(ctx, x, y, r, a = 1) { if (a <= 0) return; ctx.save(); ctx.globalAlpha *= a; wash(ctx, x, y, r * 3.2, r * 3.2, 0.45, '52,210,123'); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(x, y, r, 0, 7); ctx.fill(); ctx.restore(); }
  function redBloom(ctx, x, y, r, a = 1) { if (a <= 0) return; wash(ctx, x, y, r, r, 0.85 * a, '255,59,48'); ctx.save(); ctx.globalAlpha *= a; ctx.fillStyle = RED; ctx.beginPath(); ctx.arc(x, y, r * 0.28, 0, 7); ctx.fill(); ctx.restore(); }
  function card(ctx, lines, y, size, a, { col = ink(0.95) } = {}) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center'; let yy = y;
    lines.forEach((l, i) => { const o = typeof l === 'string' ? { text: l } : l; let fz = o.size || size; ctx.font = `${fz}px "${SERIF}"`;
      while (ctx.measureText(o.text).width > 800 && fz > 30) { fz -= 4; ctx.font = `${fz}px "${SERIF}"`; }
      if (i) yy += fz * 1.08;
      ctx.lineJoin = 'round'; ctx.lineWidth = fz * 0.2; ctx.strokeStyle = 'rgba(230,224,210,0.92)'; ctx.strokeText(o.text, 540, yy);
      ctx.fillStyle = o.col || col; ctx.fillText(o.text, 540, yy); });
    ctx.restore();
  }
  const fade = (t, a, b, f = 0.35) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));
  function slate(ctx, s) { ctx.save(); ctx.fillStyle = ink(0.55); ctx.fillRect(40, 1818, 520, 58); ctx.restore(); L.slate(ctx, s); }

  // ---------- paper texture (screen space) ----------
  const pr = L.rng(11); const blot = [];
  for (let i = 0; i < 26; i++) blot.push({ x: pr() * 1080, y: pr() * 1920, r: 120 + pr() * 320, a: 0.02 + pr() * 0.035 });
  function paper(ctx) { ctx.fillStyle = PAPER; ctx.fillRect(0, 0, 1080, 1920); blot.forEach(b => wash(ctx, b.x, b.y, b.r, b.r * 0.8, b.a, '90,84,72')); }

  // ---------- MAP (depth 0): landmass + 60 country nodes ----------
  const mr = L.rng(2026); const N = 60;
  const landR = a => 1 + 0.16 * Math.sin(a * 3 + 1) + 0.1 * Math.sin(a * 5 + 2.3) + 0.06 * Math.sin(a * 9 + 0.7);
  const inLand = (x, y) => { const dx = (x - 540) / 440, dy = (y - 1000) / 700; const a = Math.atan2(dy, dx); return Math.hypot(dx, dy) < landR(a) * 0.92; };
  const nodes = [];
  while (nodes.length < N) { const x = 100 + mr() * 880, y = 300 + mr() * 1400; if (!inLand(x, y)) continue; if (nodes.some(n => Math.hypot(n.x - x, n.y - y) < 95)) continue; nodes.push({ x, y, i: nodes.length }); }
  const nearest = (x, y, ex = []) => nodes.filter(n => !ex.includes(n)).reduce((b, n) => Math.hypot(n.x - x, n.y - y) < Math.hypot(b.x - x, b.y - y) ? n : b);
  const origin = nearest(330, 520);
  nodes.map(n => ({ n, k: Math.hypot(n.x - origin.x, n.y - origin.y) + mr() * 260 })).sort((a, b) => a.k - b.k).forEach((o, r) => { o.n.redRank = r; o.n.redDay = null; });
  // day each node turns red (first day extent >= (rank+0.5)/N), scanning the data curve
  nodes.forEach(n => { const need = (n.redRank + 0.5) / N; for (let d = 0; d <= 700; d += 0.5) if (extent(d) >= need) { n.redDay = d; break; } });
  // fragment nodes
  const labN = nearest(700, 760, [origin]);
  const used = [origin, labN];
  const pick = (x, y) => { const n = nearest(x, y, used); used.push(n); return n; };
  const frag = { f3: pick(420, 640), f4: labN, f2: pick(820, 540), f5: pick(760, 1180), f6: pick(420, 1320), f7: pick(560, 1560) };
  const fragLbl = { f2: 'platform', f3: 'sequencers', f4: 'designers', f5: 'trial sites', f6: 'regulators', f7: 'clinics' };
  const chain = [['f3', 'f4', F.f4], ['f2', 'f4', F.f4], ['f4', 'f5', F.f5], ['f5', 'f6', F.f6], ['f6', 'f7', F.f7]];
  // per-country arrival quantiles (shuffled), human and AI (same q, same sigma)
  const qs = nodes.map((_, i) => (i + 0.5) / N); for (let i = qs.length - 1; i > 0; i--) { const j = Math.floor(mr() * (i + 1)); [qs[i], qs[j]] = [qs[j], qs[i]]; }
  nodes.forEach((n, i) => { n.q = qs[i]; n.gDay = Math.max(FIRST, L.lognormalQuantile(n.q, MED, P90)); n.aiDay = Math.max(FIRST, L.lognormalQuantile(n.q, AIMED, AIP90)); });
  // the face lives in a late country (q closest to 0.9), not a fragment node
  const faceN = nodes.filter(n => !used.includes(n)).reduce((b, n) => Math.abs(n.q - 0.9) < Math.abs(b.q - 0.9) ? n : b);
  const land = []; for (let i = 0; i <= 90; i++) { const a = i / 90 * Math.PI * 2; const r = landR(a); land.push([540 + Math.cos(a) * 440 * r, 1000 + Math.sin(a) * 700 * r]); }

  function drawMap(ctx, day, t, s) {
    // landmass: layered washes + brush outline
    wash(ctx, 540, 1000, 520, 820, 0.10); wash(ctx, 470, 880, 330, 520, 0.08); wash(ctx, 640, 1250, 300, 420, 0.07);
    poly(ctx, land, 5, 0.45); poly(ctx, land.map(([x, y], i) => [x + Math.sin(i) * 4, y + Math.cos(i * 1.3) * 4]), 2, 0.3);
    // chain lines between fragments
    chain.forEach(([a, b, d], k) => { const p = L.clamp((t - tOfDay(d)) / 0.25, 0, 1); const lit = d <= D0 ? 1 : p; if (lit <= 0) return;
      const na = frag[a], nb = frag[b]; ctx.strokeStyle = GREEN; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(na.x, na.y); ctx.lineTo(L.lerp(na.x, nb.x, lit), L.lerp(na.y, nb.y, lit)); ctx.stroke(); });
    // delivery lines from clinics to each country, arriving at its lognormal day
    const hub = frag.f7;
    nodes.forEach(n => { if (n === hub) return; const tA = tOfDay(n.gDay), tS = tOfDay(FIRST); if (t < tS) return;
      const p = L.clamp((t - tS) / (tA - tS), 0, 1); ctx.strokeStyle = 'rgba(52,210,123,0.35)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(hub.x, hub.y); ctx.lineTo(L.lerp(hub.x, n.x, p), L.lerp(hub.y, n.y, p)); ctx.stroke(); });
    // nodes
    nodes.forEach(n => {
      wash(ctx, n.x, n.y, 30, 30, 0.25); ctx.fillStyle = ink(0.7); ctx.beginPath(); ctx.arc(n.x, n.y, 7, 0, 7); ctx.fill();
      if (n.redDay !== null && day >= n.redDay) { const age = day - n.redDay; redBloom(ctx, n.x, n.y, 26 + 20 * L.clamp(age / 60, 0, 1), L.clamp(age / 6, 0.2, 1)); }
      if (day >= n.gDay) { const age = day - n.gDay; ctx.strokeStyle = GREEN; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(n.x, n.y, 17, 0, 7); ctx.stroke(); glow(ctx, n.x, n.y, 6, L.clamp(age / 5, 0.3, 1)); }
    });
    // fragment nodes: gray outline until ready, then lit green
    Object.keys(frag).forEach(id => { const n = frag[id], ready = F[id] <= D0 || t >= tOfDay(F[id]);
      if (ready) glow(ctx, n.x, n.y, 11); else { ctx.strokeStyle = ink(0.6); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(n.x, n.y, 11, 0, 7); ctx.stroke(); }
      if (s > 0.6 && s < 2.5) { const right = n.x < 700; L.label(ctx, fragLbl[id], n.x + (right ? 26 : -26), n.y - 16, 32, { col: ink(0.8), align: right ? 'left' : 'right', alpha: L.sm(0.6, 0.9, s) }); } });
  }

  // ---------- CITY (depth 1) ----------
  function makeCity(seed) { const r = L.rng(seed); const blocks = [];
    for (let gx = 0; gx < 9; gx++) for (let gy = 0; gy < 15; gy++) { const x = 60 + gx * 120 + (r() - 0.5) * 16, y = 80 + gy * 120 + (r() - 0.5) * 16; if (Math.hypot(x - 540, y - 960) < 70) continue; blocks.push({ x, y, w: 70 + r() * 30, h: 70 + r() * 30, a: 0.12 + r() * 0.2 }); }
    const ex = r() * 1080, ey = r() * 1920; blocks.map(b => ({ b, k: Math.hypot(b.x - ex, b.y - ey) + r() * 300 })).sort((a, b) => a.k - b.k).forEach((o, i) => o.b.rank = i);
    const river = []; const ry = 300 + r() * 400; for (let i = 0; i <= 20; i++) river.push([i * 54, ry + Math.sin(i * 0.5 + seed) * 120 + i * 30]);
    return { blocks, river, n: blocks.length };
  }
  const city1 = makeCity(7), city2 = makeCity(19);
  function cityRedShare(node, day) { if (node.redDay === null || day < node.redDay) return 0; return L.logistic(day - node.redDay, DOUBLING, 1 / 140); }
  function drawCity(ctx, cty, node, day, t, centerGreen) {
    wash(ctx, 540, 960, 700, 1150, 0.9, '230,224,210');
    poly(ctx, cty.river, 26, 0.12); poly(ctx, cty.river, 6, 0.25);
    for (let i = 0; i < 9; i++) brush(ctx, 30 + i * 120, 20, 30 + i * 120, 1900, 3, 0.18, i);
    for (let j = 0; j < 16; j++) brush(ctx, 0, 20 + j * 120, 1080, 20 + j * 120, 3, 0.18, j + 30);
    const share = cityRedShare(node, day);
    cty.blocks.forEach(b => { wash(ctx, b.x, b.y, b.w * 0.6, b.h * 0.6, b.a);
      if ((b.rank + 0.5) / cty.n <= share) wash(ctx, b.x, b.y, b.w * 0.55, b.h * 0.55, 0.55, '255,59,48'); });
    ctx.fillStyle = ink(0.8); ctx.fillRect(505, 925, 70, 70);
    if (centerGreen > 0) glow(ctx, 540, 960, 16, centerGreen);
  }

  // ---------- LAB (depth 2, chain 1) ----------
  const desks = [[290, 640], [790, 640], [290, 1280], [790, 1280], [540, 1380], [540, 560]];
  function person(ctx, x, y, s, a = 0.75) { wash(ctx, x, y + 40 * s, 60 * s, 34 * s, a * 0.6); ctx.fillStyle = ink(a); ctx.beginPath(); ctx.arc(x, y, 22 * s, 0, 7); ctx.fill(); }
  function drawLab(ctx, day, t) {
    wash(ctx, 540, 960, 720, 1150, 0.95, '230,224,210');
    brush(ctx, 120, 400, 960, 400, 8, 0.6, 3); brush(ctx, 120, 1520, 960, 1520, 8, 0.6, 4); brush(ctx, 120, 400, 120, 1520, 8, 0.6, 5); brush(ctx, 960, 400, 960, 1520, 8, 0.6, 6);
    // window on the right wall shows the city's red
    const share = cityRedShare(labN, day); ctx.fillStyle = ink(0.15); ctx.fillRect(950, 600, 30, 700); wash(ctx, 990, 950, 60, 360, 0.2 + 0.6 * share, '255,59,48');
    desks.forEach(([x, y], i) => { ctx.fillStyle = ink(0.28); ctx.fillRect(x - 90, y - 40, 180, 60); ctx.fillStyle = ink(0.6); ctx.fillRect(x - 30, y - 34, 60, 10); person(ctx, x, y + 60, 1); });
    ctx.fillStyle = ink(0.35); ctx.fillRect(470, 900, 140, 60); ctx.fillStyle = ink(0.8); ctx.fillRect(505, 910, 70, 24); glow(ctx, 540, 922, 7); person(ctx, 540, 1000, 1.1, 0.85);
  }

  // ---------- CLINIC (depth 2, chain 2) ----------
  function drawClinic(ctx, day, t) {
    wash(ctx, 540, 960, 720, 1150, 0.95, '230,224,210');
    brush(ctx, 120, 420, 960, 420, 8, 0.6, 13); brush(ctx, 120, 1500, 960, 1500, 8, 0.6, 14); brush(ctx, 120, 420, 120, 1500, 8, 0.6, 15); brush(ctx, 960, 420, 960, 1500, 8, 0.6, 16);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { const x = 270 + c * 180, y = 620 + r * 230; if (Math.abs(x - 540) < 100 && Math.abs(y - 960) < 120) continue; ctx.fillStyle = ink(0.2); ctx.fillRect(x - 50, y + 10, 100, 40); person(ctx, x, y, 0.9, 0.6); }
    const share = cityRedShare(faceN, day); wash(ctx, 130, 960, 50, 380, 0.2 + 0.5 * share, '255,59,48');
    person(ctx, 540, 960, 1.2, 0.9);
    const tA = tOfDay(faceN.gDay); if (t > tA - 0.6) { const p = L.clamp((t - (tA - 0.6)) / 0.6, 0, 1); glow(ctx, L.lerp(960, 560, p), L.lerp(1460, 990, p), 6); }
  }

  // ---------- HANDS (depth 3, chain 1) ----------
  const hr = L.rng(41); const rows = [];
  for (let i = 0; i < 12; i++) { let s = ''; for (let k = 0; k < 22; k++) s += 'ACGT'[Math.floor(hr() * 4)]; rows.push(s); }
  const GROW = 6;
  function drawHands(ctx, t, glowA) {
    wash(ctx, 540, 1650, 800, 520, 0.16);
    // window with the red horizon (top right, out of focus)
    ctx.fillStyle = ink(0.12); ctx.fillRect(760, 120, 300, 200); wash(ctx, 900, 300, 220, 60, 0.75, '255,59,48'); wash(ctx, 980, 300, 90, 40, 0.8, '255,59,48');
    brush(ctx, 760, 120, 1060, 120, 6, 0.5, 2); brush(ctx, 760, 320, 1060, 320, 6, 0.5, 3); brush(ctx, 760, 120, 760, 320, 6, 0.5, 4);
    // monitor
    ctx.fillStyle = ink(0.86); ctx.fillRect(150, 360, 780, 560); brush(ctx, 150, 360, 930, 360, 10, 0.9, 9); brush(ctx, 150, 920, 930, 920, 10, 0.9, 10);
    ctx.fillStyle = ink(0.5); ctx.fillRect(500, 920, 80, 70);
    ctx.save(); ctx.font = `34px "${HAND}"`; ctx.textAlign = 'left';
    rows.forEach((s, i) => { const y = 420 + i * 42; if (i === GROW) { ctx.save(); ctx.globalAlpha = glowA; wash(ctx, 540, y - 10, 400, 34, 0.5, '52,210,123'); ctx.fillStyle = GREEN; ctx.fillText(s, 200, y); ctx.restore(); }
      else { ctx.fillStyle = 'rgba(200,196,186,0.45)'; ctx.fillText(s, 200, y); } });
    ctx.restore();
    // keyboard
    ctx.fillStyle = ink(0.22); ctx.fillRect(200, 1200, 680, 150);
    for (let r = 0; r < 3; r++) for (let k = 0; k < 12; k++) { ctx.fillStyle = ink(0.28); ctx.fillRect(220 + k * 55, 1215 + r * 45, 44, 34); }
    // hands: palms, fingers, sleeves (ink brush)
    const tap = Math.max(0, Math.sin(t * 5.5)) * 10;
    [[400, 1370, -1], [680, 1370, 1]].forEach(([x, y, d], h) => {
      wash(ctx, x + d * 40, y + 260, 150, 200, 0.45); // sleeve
      wash(ctx, x, y + 40, 95, 70, 0.55); // palm
      for (let f = 0; f < 4; f++) { const fx = x - 60 + f * 40, dy = (h === 1 && f === 1) ? tap : 0; brush(ctx, fx, y + 10, fx + d * -6, y - 90 + Math.abs(f - 1.5) * 14 + dy, 20, 0.62, f + h * 10); }
      brush(ctx, x - d * 80, y + 50, x - d * 120, y - 10, 22, 0.6, 30 + h);
    });
  }

  // ---------- FACE (depth 3, chain 2) ----------
  function drawFace(ctx, day, t) {
    wash(ctx, 540, 960, 720, 1150, 0.95, '230,224,210');
    // window behind: the red came long ago
    const share = cityRedShare(faceN, day); ctx.fillStyle = ink(0.1); ctx.fillRect(700, 260, 300, 520); wash(ctx, 850, 700, 190, 120, 0.25 + 0.45 * share, '255,59,48');
    brush(ctx, 700, 260, 700, 780, 6, 0.45, 51); brush(ctx, 700, 780, 1000, 780, 6, 0.45, 52);
    // hair and head mass
    wash(ctx, 400, 700, 330, 360, 0.55); wash(ctx, 330, 900, 250, 400, 0.4);
    // profile facing right
    const prof = [[470, 420], [560, 470], [610, 590], [615, 700], [650, 790], [700, 860], [660, 885], [665, 930], [650, 965], [665, 1000], [640, 1060], [585, 1090], [520, 1100], [470, 1180]];
    poly(ctx, prof, 14, 0.8); poly(ctx, prof.map(([x, y]) => [x - 5, y + 3]), 5, 0.35);
    wash(ctx, 520, 820, 110, 160, 0.12);
    // neck and shoulder
    brush(ctx, 470, 1180, 450, 1320, 14, 0.7, 60); brush(ctx, 450, 1320, 840, 1470, 18, 0.6, 61); wash(ctx, 460, 1500, 420, 200, 0.4);
    // eye, open, looking right
    const eye = [585, 745]; poly(ctx, [[555, 745], [575, 735], [598, 742]], 5, 0.85); ctx.fillStyle = ink(0.9); ctx.beginPath(); ctx.arc(eye[0], eye[1] + 3, 7, 0, 7); ctx.fill();
    brush(ctx, 540, 705, 600, 700, 7, 0.6, 62); // brow
    // green arrives at this country's lognormal day: a point of light crosses the room to the shoulder
    const tA = tOfDay(faceN.gDay);
    if (t > tA - 0.7) { const p = L.ease.out(L.clamp((t - (tA - 0.7)) / 0.7, 0, 1)); const gx = L.lerp(1100, 700, p), gy = L.lerp(1300, 1400, p); glow(ctx, gx, gy, 12);
      if (p >= 1) { glow(ctx, eye[0] + 3, eye[1], 3, L.sm(tA, tA + 0.4, t)); wash(ctx, 640, 1200, 260, 200, 0.12 * L.sm(tA, tA + 0.6, t), '52,210,123'); } }
  }

  // ---------- nesting & camera ----------
  // chain: anchors in parent-local coords for depth 1..3
  const chains = {
    one: { anchors: [labN, { x: 540, y: 960 }, { x: 540, y: 950 }] },
    two: { anchors: [faceN, { x: 540, y: 960 }, { x: 540, y: 960 }] },
  };
  function origins(ch) { const o = [{ x: 540, y: 960, k: 1 }]; let cur = { x: ch.anchors[0].x, y: ch.anchors[0].y, k: 0.1 }; o.push(cur);
    for (let d = 1; d < 3; d++) { const a = ch.anchors[d]; cur = { x: cur.x + (a.x - 540) * cur.k, y: cur.y + (a.y - 960) * cur.k, k: cur.k * 0.1 }; o.push(cur); } return o; }
  const O1 = origins(chains.one), O2 = origins(chains.two);
  const HANDS = O1[3], FACE = O2[3], MAPC = { x: 540, y: 1000 };
  // camera: F = visible width in map units; center interpolated linearly in F (focal point stays locked)
  function cam(t) {
    const Fh = 1.08, Fm = 1080;
    if (t < 4) { const F = L.lerp(Fh, Fh * 0.9, L.ease.inOut(t / 4)); return { x: HANDS.x, y: HANDS.y, F }; }
    if (t < 11) { const f = L.ease.inOut((t - 4) / 7); const F = Fh * 0.9 * Math.pow(Fm * 1.05 / (Fh * 0.9), f); const w = (F - Fh * 0.9) / (Fm * 1.05 - Fh * 0.9); return { x: L.lerp(HANDS.x, MAPC.x, w), y: L.lerp(HANDS.y, MAPC.y, w), F }; }
    if (t < 15) { const F = L.lerp(Fm * 1.05, Fm * 0.98, L.ease.inOut((t - 11) / 4)); return { x: MAPC.x, y: MAPC.y, F }; }
    const Fe = Fh / 1.45; const f = L.ease.inOut(L.clamp((t - 15) / 4.4, 0, 1)); const Fs = Fm * 0.98; const F = Fs * Math.pow(Fe / Fs, f);
    const w = (F - Fe) / (Fs - Fe); const F2 = t > 19.4 ? Fe * (1 - 0.06 * L.ease.inOut(L.clamp((t - 19.4) / 4, 0, 1))) : F;
    return { x: L.lerp(FACE.x, MAPC.x, w), y: L.lerp(FACE.y, MAPC.y, w), F: F2 };
  }
  const layerA = s => (s < 0.045 || s > 11) ? 0 : L.sm(0.045, 0.16, s) * (1 - L.sm(3.2, 11, s));
  function world(ctx, t, cm, which) {
    const S = 1080 / cm.F, day = dayAt(t);
    const O = which === 'two' ? O2 : O1;
    const draws = [
      (c, s) => drawMap(c, day, t, s),
      (c) => which === 'two' ? drawCity(c, city2, faceN, day, t, day >= faceN.gDay ? 1 : 0) : drawCity(c, city1, labN, day, t, 1),
      (c) => which === 'two' ? drawClinic(c, day, t) : drawLab(c, day, t),
      (c) => which === 'two' ? drawFace(c, day, t) : drawHands(c, t, 1),
    ];
    for (let d = 0; d < 4; d++) {
      const s = S * O[d].k; let a = d === 0 ? (1 - L.sm(3.2, 11, s)) : d === 3 ? L.sm(0.045, 0.16, s) : layerA(s);
      if (d === 0 && s > 11) a = 0; if (a <= 0.01) continue;
      ctx.save(); ctx.globalAlpha = a; ctx.translate(540, 960); ctx.scale(S, S); ctx.translate(-cm.x, -cm.y);
      ctx.translate(O[d].x, O[d].y); ctx.scale(O[d].k, O[d].k); ctx.translate(-540, -960); draws[d](ctx, s); ctx.restore();
    }
  }

  // ---------- SNAP (flat graphic) ----------
  const grid = nodes.map((n, i) => ({ n, gx: 200 + (i % 10) * 70, gy: (Math.floor(i / 10)) * 58 }));
  function panel(ctx, y0, day, label, sub, ai, a) {
    ctx.save(); ctx.globalAlpha = a;
    wash(ctx, 540, y0 + 190, 470, 250, 0.08);
    L.label(ctx, label, 540, y0, 44, { col: ink(0.9), font: SERIF });
    if (sub) L.label(ctx, sub, 540, y0 + 44, 36, { col: ink(0.75) });
    grid.forEach(({ n, gx, gy }) => { const x = gx + 15, y = y0 + 90 + gy;
      ctx.fillStyle = ink(0.55); ctx.beginPath(); ctx.arc(x, y, 6, 0, 7); ctx.fill();
      if (n.redDay !== null && day >= n.redDay) redBloom(ctx, x, y, 22, 1);
      const gd = ai ? n.aiDay : n.gDay; if (day >= gd) { ctx.strokeStyle = GREEN; ctx.lineWidth = 5; ctx.beginPath(); ctx.arc(x, y, 15, 0, 7); ctx.stroke(); glow(ctx, x, y, 5); } });
    // timeline bar (no numbers): ink progress, red and green halfway marks
    const bx = 200, bw = 680, by = y0 + 450, f = L.clamp(day / 560, 0, 1);
    ctx.fillStyle = ink(0.15); ctx.fillRect(bx, by, bw, 10); ctx.fillStyle = ink(0.7); ctx.fillRect(bx, by, bw * f, 10);
    const redHalf = nodes.map(n => n.redDay).filter(d => d !== null).sort((p, q) => p - q)[N / 2 - 1];
    const gHalf = MED; const aHalf = AIMED;
    if (day >= redHalf) { ctx.fillStyle = RED; ctx.fillRect(bx + bw * redHalf / 560 - 4, by - 18, 8, 46); }
    const gh = ai ? aHalf : gHalf; if (day >= gh) { ctx.fillStyle = GREEN; ctx.fillRect(bx + bw * gh / 560 - 4, by - 18, 8, 46); }
    ctx.restore();
  }
  function snap(ctx, t) {
    const lt = t - 23.4;
    const dA = lt < 2.6 ? L.clamp((lt - 0.4) * 280, 0, 560) : L.clamp((lt - 2.6) * 280, 0, 560);
    const dB = L.clamp((lt - 2.6) * 280, 0, 560);
    panel(ctx, 470, dA, 'As it happened', null, false, 1);
    panel(ctx, 1010, dB, 'AI-assisted routing', 'illustrative', true, L.sm(2.4, 2.7, lt));
    card(ctx, ['At true proportions.'], 330, 84, fade(t, 23.5, 26.0, 0.3));
    card(ctx, ['Same pieces. Faster routing.'], 330, 76, fade(t, 26.0, 29.2, 0.3));
  }

  // ---------- main ----------
  function draw(ctx, t) {
    paper(ctx);
    if (t < 23.4) {
      const which = t < 15 ? 'one' : 'two'; world(ctx, t, cam(t), which);
      if (t < 4) slate(ctx, 'SC1  CLOSE  PUSH IN'); else if (t < 11) slate(ctx, 'SC2  CONTINUOUS ZOOM OUT'); else if (t < 15) slate(ctx, 'SC3  WIDE  HOLD'); else if (t < 19.4) slate(ctx, 'SC4  ZOOM IN'); else slate(ctx, 'SC4  CLOSE  HOLD');
      card(ctx, ['The design took', '2 days.'], 1060, 96, fade(t, -1, 3.9));
      card(ctx, ['Then it had to', 'reach everyone.'], 1180, 92, fade(t, 4.6, 7.8));
      card(ctx, ['Every piece', 'already existed.'], 240, 92, fade(t, 11.2, 14.7));
      card(ctx, ['Some waited', 'far longer.'], 300, 92, fade(t, 16.0, 18.7));
      if (t > 21) { ctx.fillStyle = `rgba(230,224,210,${0.55 * L.sm(21, 21.4, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
      card(ctx, ['We slowed it down', 'so you could see it.'], 360, 90, fade(t, 21.0, 23.4, 0.3));
    } else if (t < 29.2) {
      snap(ctx, t); slate(ctx, 'SC5  SNAP  FLAT');
    } else {
      // IN++: back to the first hands, closest yet
      const lt = t - 29.2, Fh = 1.08; const F = Fh / L.lerp(1.5, 1.95, L.ease.inOut(L.clamp(lt / 6.6, 0, 1)));
      const cm = { x: HANDS.x, y: HANDS.y + 0.12, F };
      world(ctx, t, cm, 'one');
      slate(ctx, 'SC6  EXTREME CLOSE  DOLLY IN'); wash(ctx, 540, 1100, 520, 190, 0.8, '230,224,210');
      card(ctx, ['Based on a', 'true story.'], 1080, 104, fade(t, 29.6, 31.4, 0.3));
      card(ctx, ['Every timing came', 'from real data.', { text: '2020', size: 120 }], 1040, 84, fade(t, 31.5, 33.6, 0.3));
      card(ctx, ['This is', 'the bottleneck.'], 1080, 108, fade(t, 33.7, 35.9, 0.3));
      if (t >= 35.8) L.endCard(ctx, L.sm(35.8, 36.2, t), { line: 'The bottleneck is us.' });
    }
    L.grain(ctx, t, { alpha: 0.05, n: 400 });
  }

  return { draw, DUR,
    acts: [{ start: 0, end: 21, bpm: 0, drone: true }, { start: 11, end: 15, bpm: 54 }, { start: 23.4, end: 29.2, bpm: 0, drone: true }, { start: 29.2, end: 40, bpm: 0, drone: true }],
    cues: [{ t: 4, type: 'whoosh' }, { t: tOfDay(faceN.gDay), type: 'ding' }, { t: 23.4, type: 'hit' }, { t: 29.6, type: 'pop' }, { t: 33.7, type: 'hit' }],
    _debug: { faceDay: faceN.gDay, faceT: tOfDay(faceN.gDay), labRed: labN.redDay, faceRed: faceN.redDay, HANDS, FACE } };
}
module.exports = makeScene;
