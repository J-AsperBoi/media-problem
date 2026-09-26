// THE CURE, BEFORE AND AFTER (animatic). Structure: before-after. Analog: penicillin-resistance-1946.
// A stick-figure ritual around one green vial (BEFORE), the same frame years later (AFTER).
// Red = L.logistic(year, 0.56 [derived doubling time], s0 0.125): 40 stones, stone i red when share > q_i.
// Green links = L.lognormalQuantile(q, median 13, p90 69); AI snap = ai_counterfactual median 2.5 (illustrative, coordination only).
// Race mapping: film_t = 4.8 + 14 * log10(1 + year) / log10(16), years 0..15 (log time). Snap: linear, 15 years in 3 s.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('penicillin-resistance-1946');
  const DUR = 39.5, BG = '#161a21', INK = '#e8e4da', DIM = '#8a909a', MUTE = '#5d636e', RED = L.RED, GREEN = L.GREEN;
  const DBL = A.threat.doubling_time, S0 = A.threat.points[0].extent;           // 0.56 yr (derived), 0.125
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;  // 13, 69
  const AIMED = A.ai_counterfactual.aggregation_median, AIP90 = AIMED * P90 / MED; // 2.5, 13.3
  const WARN = 1.5, DRUG = 13, AGAIN = 15, SPAN = 15, DATA_END = 1.75;
  const RACE0 = 4.8, RACE_LEN = 14;
  const share = y => L.logistic(y, DBL, S0);
  const tOfYear = y => RACE0 + L.mapTime(y, SPAN, RACE_LEN, 'log');
  const yearAt = t => t < RACE0 ? 0 : L.clamp(L.unmapTime(t - RACE0, SPAN, RACE_LEN, 'log'), 0, SPAN);
  const T_DRUG = tOfYear(DRUG), T_AGAIN = tOfYear(AGAIN);

  // ---------- sheet layout (design space) ----------
  const COLX = [60, 555], ROWY = [560, 820, 1080, 1340], PW = 465, PH = 240;
  const r = L.rng(1946);
  // 40 stones on a ritual ring in the ward panel; each has a fixed threshold (the share of samples it stands for)
  const qs = []; for (let i = 0; i < 40; i++) qs.push((i + 0.5) / 40);
  for (let i = qs.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [qs[i], qs[j]] = [qs[j], qs[i]]; }
  const stones = qs.map((q, i) => { const a = i / 40 * Math.PI * 2 + (r() - 0.5) * 0.08; return { q, x: 232 + Math.cos(a) * 205, y: 172 + Math.sin(a) * 52, seed: 10 + i }; });
  // the two stones that turn red again in 1961 (qualitative): the two visible in the close shot with the lowest thresholds
  const again = new Set(stones.map((s, i) => ({ s, i })).filter(o => o.s.x > 60 && o.s.x < 270 && o.s.y > 160).sort((a, b) => a.s.q - b.s.q).slice(0, 2).map(o => o.i));
  // 10 links between the four groups' fragments, connecting at lognormal quantiles
  const NODE = [[172, 80], [178, 132], [220, 140], [236, 128]]; // ward vial, lab warning, biochemists, chemists (local panel coords)
  const PAIRS = [[0, 1], [1, 2], [0, 2], [2, 3], [1, 3], [0, 3], [0, 1], [1, 2], [2, 3], [0, 3]];
  const LINKS = PAIRS.map((p, i) => ({ a: p[0], b: p[1], at: L.lognormalQuantile((i + 0.5) / 10, MED, P90), ai: L.lognormalQuantile((i + 0.5) / 10, AIMED, AIP90), bend: (i % 2 ? 1 : -1) * (60 + 30 * (i % 3)), ph: r(), seed: 200 + i }));
  const node = (k, col) => [COLX[col] + NODE[k][0], ROWY[k] + NODE[k][1]];
  const nodeLit = (k, y) => k === 0 ? true : k === 1 ? y >= WARN : k === 2 ? true : y >= DRUG;

  // ---------- drawing helpers ----------
  const fade = (t, a, b, e = 0.3) => L.sm(a, a + e, t) * (1 - L.sm(b - e, b, t));
  function glow(ctx, x, y, rad, rgb, a) { if (a <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, rad); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2); }
  function vial(ctx, x, y, s, lit, t) { // a small glass vial; lit = 0..1 green strength
    glow(ctx, x, y, 60 * s, '52,210,123', 0.55 * lit);
    ctx.fillStyle = `rgba(52,210,123,${0.25 + 0.75 * lit})`; ctx.fillRect(x - 6 * s, y - 6 * s, 12 * s, 18 * s);
    ctx.strokeStyle = INK; ctx.lineWidth = 2.2 * s; ctx.strokeRect(x - 7 * s, y - 14 * s, 14 * s, 27 * s);
    ctx.fillStyle = MUTE; ctx.fillRect(x - 8 * s, y - 19 * s, 16 * s, 6 * s);
  }
  function border(ctx, x, y, t, seed, col = DIM) { const o = { w: 3, col, seed, t, boil: 1, jitter: 1.6 };
    L.sketchLine(ctx, x, y, x + PW, y, o); L.sketchLine(ctx, x + PW, y, x + PW, y + PH, { ...o, seed: seed + 1 });
    L.sketchLine(ctx, x + PW, y + PH, x, y + PH, { ...o, seed: seed + 2 }); L.sketchLine(ctx, x, y + PH, x, y, { ...o, seed: seed + 3 }); }
  function stoneRed(i, y) { const s = stones[i]; if (y < DRUG) return share(y) > s.q ? 1 : 0; if (y < AGAIN) return (share(DRUG) > s.q ? 1 : 0) * (1 - L.sm(DRUG, DRUG + 0.35, y)); return again.has(i) ? L.sm(AGAIN - 0.05, AGAIN, y) : 0; }

  // the ward: ritual ring of stones, dancers, one figure holding the vial
  function ward(ctx, ox, oy, y, t, o = {}) {
    ctx.save(); ctx.translate(ox, oy);
    ctx.fillStyle = '#1c212a'; ctx.fillRect(0, 0, PW, PH);
    const vialLit = y < DRUG ? 1 - share(y) : L.sm(DRUG - 0.1, DRUG + 0.2, y); // glow = share of stones the answer still works on
    const sh = share(Math.min(y, DRUG));
    // stones (back half first)
    const drawStone = (s, i) => { const red = stoneRed(i, y); if (red > 0) glow(ctx, s.x, s.y, 26, '255,59,48', 0.5 * red);
      L.sketchCircle(ctx, s.x, s.y, 8, { w: 2, col: red > 0.5 ? RED : '#6b717c', seed: s.seed, t, boil: 1, jitter: 1.2, fill: red > 0.5 ? RED : '#343944' }); };
    stones.forEach((s, i) => { if (s.y < 172) drawStone(s, i); });
    // ritual phase: dancing at the arrival; slows and glazes as the red learns; returns at the new vial
    const joy = y < DRUG ? 1 - L.sm(0.1, 0.9, y) : y < AGAIN ? 1 : 0.1;
    const moodCrowd = y < 0.3 || (y >= DRUG && y < AGAIN) ? 'happy' : y >= AGAIN ? 'panic' : 'glazed';
    const dancers = [[62, 196, 0.72, 0], [305, 170, 0.66, 1], [390, 198, 0.74, 2], [248, 214, 0.7, 3]];
    dancers.forEach(([x, yy, s, k]) => { const w = Math.sin(t * 5 + k * 1.7);
      L.stick(ctx, x, yy, s, { mood: moodCrowd, t, seed: 40 + k, boil: 1, look: [x < 172 ? 1 : -1, -0.6],
        pose: { armL: L.lerp(0.5, 2.5 + 0.35 * w, joy), armR: L.lerp(0.45, 2.5 - 0.35 * w, joy), legs: 0.5 * w * joy, lean: 0.08 * w * joy } }); });
    // main figure: the vial held high like a relic
    const main = o.mood || (y < 0.3 ? 'awe' : y < DRUG ? (sh > 0.35 ? 'sad' : 'glazed') : y < AGAIN ? 'happy' : 'panic');
    L.stick(ctx, 150, 178, 0.95, { mood: main, t, seed: 7, boil: 1, look: [0.8, -0.9], pose: { armR: 2.6, armL: L.lerp(0.5, 2.2 + 0.25 * Math.sin(t * 5), joy), lean: -0.05 } });
    vial(ctx, NODE[0][0], NODE[0][1], 1, vialLit, t);
    stones.forEach((s, i) => { if (s.y >= 172) drawStone(s, i); });
    ctx.restore();
  }
  function lab(ctx, ox, oy, y, t) { ctx.save(); ctx.translate(ox, oy); ctx.fillStyle = '#1c212a'; ctx.fillRect(0, 0, PW, PH);
    L.sketchLine(ctx, 60, 172, 330, 172, { w: 3, col: DIM, seed: 61, t, boil: 1 }); L.sketchLine(ctx, 90, 172, 90, 228, { w: 3, col: DIM, seed: 62 }); L.sketchLine(ctx, 300, 172, 300, 228, { w: 3, col: DIM, seed: 63 });
    const lit = L.sm(WARN, WARN + 0.15, y); const hi = L.sm(WARN, WARN + 0.1, y) * (1 - L.sm(WARN + 0.5, WARN + 1.5, y));
    L.stick(ctx, 120, 176, 0.8, { mood: y < WARN ? 'glazed' : hi > 0.3 ? 'panic' : 'sad', t, seed: 64, boil: 1, look: [1, -0.3], pose: { armR: L.lerp(0.9, 2.2, lit), armL: 0.6 } });
    glow(ctx, NODE[1][0], NODE[1][1], 50, '52,210,123', 0.6 * lit);
    ctx.fillStyle = lit > 0.5 ? GREEN : '#4a505b'; ctx.fillRect(NODE[1][0] - 13, NODE[1][1] - 17, 26, 34);
    for (let k = 0; k < 3; k++) { ctx.fillStyle = '#161a21'; ctx.fillRect(NODE[1][0] - 8, NODE[1][1] - 10 + k * 9, 16, 2.5); }
    ctx.restore(); }
  function bench(ctx, ox, oy, y, t, k) { ctx.save(); ctx.translate(ox, oy); ctx.fillStyle = '#1c212a'; ctx.fillRect(0, 0, PW, PH);
    L.sketchLine(ctx, 110, 168, 360, 168, { w: 3, col: DIM, seed: 70 + k, t, boil: 1 });
    const lit = k === 2 ? 1 : L.sm(DRUG - 0.2, DRUG, y); const [nx, ny] = NODE[k];
    const mood = k === 2 ? 'glazed' : y < DRUG ? 'bored' : 'happy';
    L.stick(ctx, 90, 180, 0.76, { mood, t, seed: 80 + k, boil: 1, look: [1, 0], pose: { armR: 1.3, armL: 0.4 } });
    L.stick(ctx, 380, 180, 0.76, { mood, t, seed: 90 + k, boil: 1, look: [-1, 0], pose: { armL: 1.3, armR: 0.4 } });
    if (k === 2) { glow(ctx, nx, ny, 50, '52,210,123', 0.5); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(nx - 8, ny, 11, 0, 7); ctx.fill(); ctx.fillRect(nx, ny - 4, 26, 8); ctx.fillRect(nx + 16, ny, 6, 12); }
    else vial(ctx, nx, ny + 8, 1.1, 0.12 + 0.88 * lit, t);
    ctx.restore(); }
  const LABELS = ['the ward', 'a hospital lab', 'biochemists', 'chemists'];
  function panelSet(ctx, col, y, t, la = 1) { const x = COLX[col];
    ward(ctx, x, ROWY[0], y, t); lab(ctx, x, ROWY[1], y, t); bench(ctx, x, ROWY[2], y, t, 2); bench(ctx, x, ROWY[3], y, t, 3);
    ROWY.forEach((ry, k) => { border(ctx, x, ry, t, 300 + col * 10 + k * 4); if (la > 0) L.label(ctx, LABELS[k], x + 14, ry + 34, 30, { align: 'left', col: DIM, alpha: la }); }); }
  function links(ctx, y, t, alpha) { if (alpha <= 0) return; ctx.save(); ctx.globalAlpha = alpha;
    const pts = (l, f0, f1) => { const [ax, ay] = node(l.a, 1), [bx, by] = node(l.b, 1); const mx = (ax + bx) / 2 + l.bend * 1.6, my = (ay + by) / 2; const out = [];
      for (let i = 0; i <= 30; i++) { const f = L.lerp(f0, f1, i / 30); out.push([(1 - f) * (1 - f) * ax + 2 * (1 - f) * f * mx + f * f * bx, (1 - f) * (1 - f) * ay + 2 * (1 - f) * f * my + f * f * by]); } return out; };
    const stroke = (p, w, col, dash) => { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.setLineDash(dash || []); ctx.beginPath(); p.forEach(([x, yy], i) => i ? ctx.lineTo(x, yy) : ctx.moveTo(x, yy)); ctx.stroke(); ctx.setLineDash([]); };
    LINKS.forEach(l => { if (y >= l.at) { stroke(pts(l, 0, 1), 5, GREEN); return; }
      if (!nodeLit(l.a, y) && !nodeLit(l.b, y)) return;
      const ph = (t * 0.45 + l.ph) % 1; if (ph > 0.8) return; // the reach grows, then breaks (attention elsewhere)
      const from = nodeLit(l.a, y) ? 0 : 1; const len = ph / 0.8 * 0.55;
      stroke(pts(l, from, from ? 1 - len : len), 3, 'rgba(52,210,123,0.55)', [10, 9]); });
    ctx.restore(); }
  function sheet(ctx, t, y, z) { const la = 1 - L.sm(1.5, 2.4, z); // world text and links only read at the wide; hidden in the close shots
    panelSet(ctx, 0, 0, t, la); panelSet(ctx, 1, y, t, la);
    if (la <= 0) return;
    ctx.save(); ctx.globalAlpha = la; ctx.textAlign = 'left'; ctx.font = `44px "${SERIF}"`; ctx.fillStyle = INK; ctx.fillText('BEFORE', 80, 526); ctx.fillText('AFTER', 575, 526);
    // time bar over the AFTER column (log time, no numerals)
    const x0 = 710, x1 = 1000; ctx.strokeStyle = DIM; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x0, 512); ctx.lineTo(x1, 512); ctx.stroke();
    ctx.fillStyle = INK; ctx.fillRect(x0, 506, (x1 - x0) * Math.log10(1 + y) / Math.log10(1 + SPAN), 12);
    ctx.restore(); L.label(ctx, 'log time', x0, 490, 26, { align: 'left', col: DIM, alpha: la });
    links(ctx, y, t, la);
  }

  // ---------- camera ----------
  const CLOSE_B = [225, 660, 4.6], CLOSE_A = [720, 660, 4.6], WIDE = [540, 1000, 1];
  function cam(ctx, v) { ctx.translate(540, 960); ctx.scale(v[2], v[2]); ctx.translate(-v[0], -v[1]); }
  const RACE_CAM = [[4.8, CLOSE_A], [9.0, CLOSE_A], [12.0, WIDE], [16.6, WIDE], [18.1, [712, 650, 6]], [20.6, [712, 650, 6]]];
  const camAt = t => L.key(RACE_CAM, t, f => L.ease.inOut(f));
  function world(ctx, t, y, v) { ctx.save(); cam(ctx, v); sheet(ctx, t, y, v[2]); ctx.restore(); }

  // ---------- text ----------
  const card = (ctx, lines, y, size, a) => { if (a > 0) L.title(ctx, lines, y, size, { alpha: a }); };
  const tag = (ctx, text, a, col = INK) => { if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = 'rgba(13,17,24,0.8)'; ctx.fillRect(70, 1440, text.length * 30 + 40, 72);
    ctx.font = `56px "${SERIF}"`; ctx.fillStyle = col; ctx.textAlign = 'left'; ctx.fillText(text, 90, 1495); ctx.restore(); };
  const sub = (ctx, text, y, a) => L.label(ctx, text, 540, y, 44, { alpha: a, col: '#b8bcc4' });

  // ---------- snap ----------
  const SNAP0 = 23.0, SWEEP0 = 23.6, SWEEP = 3.0;
  function snap(ctx, t) {
    ctx.fillStyle = '#10141a'; ctx.fillRect(0, 0, 1080, 1920);
    const head = L.clamp((t - SWEEP0) / SWEEP, 0, 1) * SPAN;
    L.label(ctx, 'the same record, true speed', 540, 272, 50, { col: INK });
    const X0 = 120, X1 = 900, xOf = yy => X0 + (X1 - X0) * yy / SPAN;
    [{ y0: 320, label: 'as it was', med: MED, p90: P90 }, { y0: 850, label: 'routed coordination', med: AIMED, p90: AIP90, ai: true }].forEach((ln, li) => {
      const base = ln.y0 + 400, H = 240;
      ctx.fillStyle = '#1c212a'; ctx.fillRect(70, ln.y0, 940, 480); border2(ctx, 70, ln.y0, 940, 480, t, 500 + li * 5);
      L.label(ctx, ln.label, X0, ln.y0 + 66, 54, { align: 'left', col: INK });
      if (ln.ai) { ctx.fillStyle = 'rgba(232,228,218,0.14)'; ctx.fillRect(610, ln.y0 + 24, 260, 60); L.label(ctx, 'illustrative', 740, ln.y0 + 68, 48, { col: '#fffdf7' }); }
      ctx.strokeStyle = DIM; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(X0, base); ctx.lineTo(X1, base); ctx.stroke();
      for (let yy = 0; yy <= SPAN; yy++) { ctx.beginPath(); ctx.moveTo(xOf(yy), base); ctx.lineTo(xOf(yy), base + 12); ctx.stroke(); }
      L.label(ctx, 'years, true speed', X0, base + 56, 44, { align: 'left', col: DIM });
      // red: solid where there is data (to year 1.75), lighter where it is the logistic fit
      const area = (a, b, col) => { if (b <= a) return; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(xOf(a), base);
        for (let yy = a; yy <= b + 1e-6; yy += 0.05) ctx.lineTo(xOf(yy), base - H * share(yy)); ctx.lineTo(xOf(b), base); ctx.closePath(); ctx.fill(); };
      area(0, Math.min(head, DATA_END), 'rgba(255,59,48,0.9)'); area(DATA_END, head, 'rgba(255,59,48,0.35)');
      if (head > 4) L.label(ctx, 'fit', xOf(4.5), base - H * 0.55, 44, { col: RED, align: 'left' });
      // green: share of links connected (lognormal)
      ctx.strokeStyle = GREEN; ctx.lineWidth = 6; ctx.beginPath();
      for (let yy = 0; yy <= head; yy += 0.05) { const py = base - H * L.lognormalCDF(yy, ln.med, ln.p90); yy ? ctx.lineTo(xOf(yy), py) : ctx.moveTo(xOf(yy), py); } ctx.stroke();
      if (head >= ln.med) { const x = xOf(ln.med), py = base - H * 0.5; glow(ctx, x, py, 90, '52,210,123', 0.7); ctx.fillStyle = GREEN; ctx.beginPath(); ctx.arc(x, py, 16, 0, 7); ctx.fill();
        L.label(ctx, 'pieces meet', ln.ai ? x + 30 : x - 30, py - 30, 44, { col: GREEN, align: ln.ai ? 'left' : 'right' }); }
      if (head > 0 && head < SPAN) { ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(xOf(head), ln.y0 + 96); ctx.lineTo(xOf(head), base + 14); ctx.stroke(); }
    });
    L.label(ctx, 'coordination only. Chemistry still takes years.', 540, 1400, 44, { col: INK, alpha: L.sm(SWEEP0 + 1.0, SWEEP0 + 1.4, t) });
    const tm = SWEEP0 + SWEEP * MED / SPAN; card(ctx, [{ text: '13 years.', col: GREEN }], 470, 88, L.sm(tm + 0.05, tm + 0.4, t));
    if (t > SWEEP0 - 0.3 && t < SWEEP0 + 0.1) { ctx.fillStyle = `rgba(255,253,247,${0.35 * (1 - Math.abs(t - SWEEP0) / 0.3)})`; ctx.fillRect(0, 0, 1080, 1920); }
  }
  function border2(ctx, x, y, w, h, t, seed) { const o = { w: 3, col: DIM, seed, t, boil: 1, jitter: 2 };
    L.sketchLine(ctx, x, y, x + w, y, o); L.sketchLine(ctx, x + w, y, x + w, y + h, { ...o, seed: seed + 1 }); L.sketchLine(ctx, x + w, y + h, x, y + h, { ...o, seed: seed + 2 }); L.sketchLine(ctx, x, y + h, x, y, { ...o, seed: seed + 3 }); }

  // ---------- main ----------
  function draw(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    if (t < 1.2) { // cold open: flash-forward, same frame, year 1.75
      world(ctx, t, DATA_END, CLOSE_A);
      tag(ctx, 'AFTER', 1, RED); card(ctx, ['Watch the red learn.'], 330, 104, 1);
      if (t > 1.05) { ctx.fillStyle = `rgba(255,253,247,${(t - 1.05) / 0.15})`; ctx.fillRect(0, 0, 1080, 1920); }
      L.slate(ctx, 'SC1  CLOSE  COLD OPEN (later)');
    } else if (t < RACE0 + 0.7) { // BEFORE: frozen at the arrival; dissolve into the AFTER frame
      world(ctx, t, 0, CLOSE_B);
      tag(ctx, 'BEFORE', 1, GREEN);
      if (t < 1.6) { ctx.fillStyle = `rgba(255,253,247,${1 - (t - 1.2) / 0.4})`; ctx.fillRect(0, 0, 1080, 1920); }
      card(ctx, ['An answer arrives.'], 330, 100, fade(t, 1.5, 3.1));
      card(ctx, ['One in eight', 'already knows.'], 300, 96, fade(t, 3.1, RACE0 + 0.1)); sub(ctx, "one hospital's samples", 460, fade(t, 3.3, RACE0 + 0.1));
      const a = L.sm(RACE0, RACE0 + 0.7, t); if (a > 0) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920); world(ctx, t, yearAt(t), CLOSE_A); tag(ctx, 'AFTER', 1, RED); ctx.restore(); }
      L.slate(ctx, t < RACE0 ? 'SC2  CLOSE  BEFORE (locked)' : 'SC3  CLOSE  AFTER (same frame)');
    } else if (t < 20.6) { // AFTER: the race, the single pull-out, the wide, the push back in
      const y = yearAt(t), v = camAt(t); world(ctx, t, y, v);
      const close = 1 - L.sm(9.0, 9.8, t) + L.sm(17.2, 18.1, t); tag(ctx, 'AFTER', L.clamp(close, 0, 1), RED);
      card(ctx, ['Same frame.', 'Years later.'], 300, 100, fade(t, 5.5, 7.2));
      card(ctx, ['The red is learning.'], 330, 100, fade(t, 7.3, 9.1));
      card(ctx, ['The next answer:', 'in pieces.'], 290, 96, fade(t, 10.6, 13.1));
      card(ctx, ['Held apart', 'for years.'], 290, 96, fade(t, 13.3, 16.3));
      card(ctx, [{ text: '13 years.', col: GREEN }], 330, 110, fade(t, T_DRUG, T_AGAIN + 0.05, 0.2));
      card(ctx, ['The red learns again.'], 330, 100, fade(t, T_AGAIN + 0.05, 20.5, 0.25));
      if (t > 19.6) { ctx.fillStyle = `rgba(8,10,14,${0.55 * L.sm(19.6, 20.6, t)})`; ctx.fillRect(0, 0, 1080, 1920); }
      L.slate(ctx, t < 9.0 ? 'SC3  CLOSE  AFTER (locked)' : t < 12 ? 'SC4  THE PULL-OUT' : t < 16.6 ? 'SC5  WIDE  (hold)' : t < 18.1 ? 'SC6  DOLLY IN' : 'SC6  CLOSER  (dead stop)');
    } else if (t < SNAP0) {
      card(ctx, ['We slowed it down', 'so you could see it.'], 820, 92, fade(t, 20.8, SNAP0, 0.4)); L.slate(ctx, 'SC7  CARD');
    } else if (t < 30) {
      snap(ctx, t); L.slate(ctx, 'SC8  THE SNAP  (two lanes, true speed)');
    } else {
      ctx.save(); cam(ctx, L.key([[30, [712, 660, 6.8]], [34, [712, 645, 8]]], t)); ward(ctx, COLX[1], ROWY[0], AGAIN, t, { mood: 'awe' }); border(ctx, COLX[1], ROWY[0], t, 311); ctx.restore();
      const a = 1 - L.sm(30, 30.7, t); if (a > 0) { ctx.save(); ctx.globalAlpha = a; snap(ctx, 30); ctx.restore(); }
      card(ctx, ['The pieces were', 'already here.'], 300, 96, fade(t, 30.6, 32.1));
      card(ctx, ['This is the bottleneck.'], 330, 96, fade(t, 32.2, 34.1, 0.3));
      L.slate(ctx, 'SC9  CLOSEST');
      if (t >= 34) L.endCard(ctx, L.sm(34, 34.4, t), { line: 'The bottleneck is us.' });
    }
    L.grain(ctx, t, { alpha: 0.05, n: 500 });
  }

  // a soft pop each time a visible stone turns red during the locked AFTER close
  const cues = [{ t: 1.15, type: 'hit' }, { t: RACE0, type: 'whoosh' }, { t: 9.0, type: 'whoosh' }, { t: tOfYear(WARN), type: 'ding' },
    { t: T_DRUG, type: 'ding' }, { t: T_AGAIN, type: 'bonk' }, { t: SWEEP0, type: 'hit' }, { t: SWEEP0 + SWEEP * AIMED / SPAN, type: 'ding' },
    { t: SWEEP0 + SWEEP * MED / SPAN, type: 'pop' }, { t: 30, type: 'whoosh' }, { t: 34, type: 'hit' }];
  stones.forEach(s => { if (s.q <= S0 || s.x > 290) return; const y = Math.log(s.q * (1 - S0) / (S0 * (1 - s.q))) / (Math.LN2 / DBL); const tt = tOfYear(y); if (tt > RACE0 + 0.8 && tt < 9.0) cues.push({ t: tt, type: 'pop' }); });
  return {
    draw, DUR,
    acts: [{ start: 0, end: 4.8, bpm: 52, drone: true }, { start: 4.8, end: 12, bpm: 60, drone: true }, { start: 12, end: 19.6, bpm: 72, drone: true }, { start: 26.6, end: 39.5, bpm: 0, drone: true }],
    cues: cues.sort((a, b) => a.t - b.t),
  };
}
module.exports = makeScene;
