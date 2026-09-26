// the-two-feeds: two-phones, text-only typography, language, family, over-the-shoulder. Analog: false-news-2018.
// Red: extent(h) = smoothstep(h/10) between the analog's sourced endpoints (0 at 0 h, whole 1,500 audience at ~10 h).
// Green (human): each home's correction at L.lognormalQuantile(q, 13, 20) h (Hoaxy lag, median 13, typical 10-20 h).
// Green (AI, illustrative): lognormal median 1 h (ai_counterfactual), p90 scaled by the same ratio (20/13).
// Mapping: race 1 s = 1 h (h = t - 1.5); snap 1 s = 5 h. See output/the-two-feeds/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('false-news-2018');
  const DUR = 36, RED = L.RED, GREEN = L.GREEN, BG = '#0b0d11';
  const GRAY = '#9aa0aa', DGRAY = '#4a4f58', INK = '#e8e4da';
  const RED_H = A.threat.points[A.threat.points.length - 1].t;                 // 10 h
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;  // 13, 20
  const AIMED = A.ai_counterfactual.aggregation_median, AIP90 = AIMED * P90 / MED; // 1, 1.54
  const extent = h => { const x = L.clamp(h / RED_H, 0, 1); return x * x * (3 - 2 * x); };
  const invExtent = q => { let lo = 0, hi = 1; for (let i = 0; i < 40; i++) { const m = (lo + hi) / 2; const v = m * m * (3 - 2 * m); v < q ? lo = m : hi = m; } return RED_H * (lo + hi) / 2; };

  // ---------- time mapping ----------
  const T0 = 1.5, H_END = 16, T_FREEZE = T0 + H_END;         // race: 1 s = 1 h, ends 17.5
  const hAt = t => t < 1.4 ? 13 : L.clamp(t - T0, 0, H_END);   // cold open = flash-forward to hour 13
  const T_SNAP = 20, T_SWEEP = 20.8, SNAP_RATE = 5, SNAP_H = 20;  // snap: 1 s = 5 h
  const T_IN2 = 26.5, T_NECK = 29, T_END = 31.5;

  // ---------- world: 1,500 homes (30 x 50) in design space; our room lives in one cell ----------
  const COLS = 30, ROWS = 50, CW = 1080 / COLS, CH = 1920 / ROWS, N = COLS * ROWS;
  const HOME = 24 * COLS + 14;
  const CC = [(14 + 0.5) * CW, (24 + 0.5) * CH];
  const RC = [545, 1000], RS = 0.04, PS = 0.15;                 // room->world scale, phone->room scale
  const NP = [470, 960], SP = [625, 950];                        // phone centers in room
  const NH = [NP[0] - 80, NP[1] + 130], SH = [SP[0] + 80, SP[1] + 130];
  const roomW = (x, y) => [CC[0] + (x - RC[0]) * RS, CC[1] + (y - RC[1]) * RS];
  const phoneW = (P, x, y) => roomW(P[0] + x * PS, P[1] + y * PS);

  // Ranks: red spreads outward from a few seeds (cascade look); count always equals extent(h).
  const rnd = L.rng(1847);
  const homes = []; for (let i = 0; i < N; i++) homes.push({ x: (i % COLS + 0.5) * CW, y: (Math.floor(i / COLS) + 0.5) * CH });
  const rank = (seeds, jitter) => { const d = homes.map((p, i) => ({ i, d: Math.min(...seeds.map(s => Math.hypot(p.x - s[0], p.y - s[1]))) + rnd() * jitter }));
    d.sort((a, b) => a.d - b.d); const q = new Array(N); d.forEach((o, k) => { q[o.i] = (k + 0.5) / N; }); return q; };
  const redQ = rank([[500, 900], [180, 300], [880, 1500]], 260);
  const grnQ = rank([[900, 250], [150, 1650]], 420);
  const fix = (arr, target) => { let best = 0; for (let i = 0; i < N; i++) if (Math.abs(arr[i] - target) < Math.abs(arr[best] - target)) best = i; const tmp = arr[HOME]; arr[HOME] = arr[best]; arr[best] = tmp; };
  fix(redQ, extent(1)); fix(grnQ, 0.5);
  homes.forEach((p, i) => { p.hr = invExtent(redQ[i]); p.hg = L.lognormalQuantile(grnQ[i], MED, P90); });
  homes[HOME].hr = 1; homes[HOME].hg = MED;

  // ---------- camera (log-zoom keyframes) ----------
  const view = (pt, z, sx, sy) => [pt[0] - (sx - 540) / z, pt[1] - (sy - 960) / z, z];
  const ZP = 1 / (RS * PS); // zoom at which phone units = screen px
  const V = {
    cold: view(roomW(545, 1000), 100, 540, 900),
    nana: view(phoneW(NP, 0, 0), ZP * 1.0, 600, 820),
    nana2: view(phoneW(NP, 0, 0), ZP * 1.05, 600, 800),
    room: view(roomW(545, 1000), 25, 540, 960),
    field: view([540, 960], 1, 540, 960),
    field2: view([530, 950], 1.06, 540, 960),
    room2: view(roomW(620, 980), 32, 540, 960),
    sam: view(phoneW(SP, 0, -60), ZP * 1.2, 480, 800),
    sam2: view(phoneW(SP, 0, -60), ZP * 1.26, 480, 800),
    nanaMid: view(phoneW(NP, 0, 60), ZP * 1.0, 560, 880),
    close: view(phoneW(NP, 0, 150), ZP * 1.45, 500, 900),
    close2: view(phoneW(NP, 0, 150), ZP * 1.55, 500, 900),
  };
  const CAM = [[0, V.cold], [1.4, V.cold], [1.4001, V.nana], [4.5, V.nana2], [6.2, V.room], [6.6, V.room], [8.0, V.field], [11.5, V.field2],
    [12.8, V.room2], [14.3, V.sam], [16.2, V.sam2], [16.9, V.nanaMid], [T_IN2, V.nanaMid], [T_IN2 + 0.0001, V.close], [T_END, V.close2]];
  const camAt = t => {
    if (t <= CAM[0][0]) return CAM[0][1];
    for (let i = 0; i < CAM.length - 1; i++) { const [ta, a] = CAM[i], [tb, b] = CAM[i + 1];
      if (t <= tb) { const f = L.ease.inOut((t - ta) / (tb - ta)); const z = Math.exp(L.lerp(Math.log(a[2]), Math.log(b[2]), f));
        const w = Math.abs(a[2] - b[2]) < 1e-6 ? f : (1 / z - 1 / a[2]) / (1 / b[2] - 1 / a[2]);
        return [L.lerp(a[0], b[0], w), L.lerp(a[1], b[1], w), z]; } }
    return CAM[CAM.length - 1][1];
  };

  // ---------- drawing helpers ----------
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r); };
  const scaleOf = c => { const m = c.getTransform(); return Math.hypot(m.a, m.b); };
  const text = (c, s, x, y, size, col, { font = HAND, align = 'left', alpha = 1 } = {}) => { c.save(); c.globalAlpha *= alpha; c.font = `${size}px "${font}"`; c.textAlign = align; c.fillStyle = col; c.fillText(s, x, y); c.restore(); };
  // Redacted red line: word-chunks, blurred, so the claim is never legible.
  const redBars = (c, x, y, widths, hgt, a) => { c.save(); c.globalAlpha *= a; c.fillStyle = RED; c.shadowColor = RED; c.shadowBlur = 16 * scaleOf(c);
    widths.forEach((row, j) => { let xx = x; row.forEach(w => { rr(c, xx, y + j * hgt * 1.7, w, hgt, hgt / 2); c.fill(); xx += w + hgt * 0.5; }); }); c.restore(); };
  const CLAIM = [[150, 90, 210, 60], [80, 240, 130], [190, 70, 160, 100], [120, 180]];
  const typed = (s, f) => s.slice(0, Math.floor(L.clamp(f, 0, 1) * s.length + 1e-6));
  const phoneBody = (c, glow) => {
    if (glow) { c.save(); c.shadowColor = glow; c.shadowBlur = 60 * scaleOf(c); c.fillStyle = '#12151b'; rr(c, -360, -660, 720, 1320, 70); c.fill(); c.restore(); }
    c.fillStyle = '#12151b'; rr(c, -360, -660, 720, 1320, 70); c.fill(); c.strokeStyle = '#5b606a'; c.lineWidth = 6; c.stroke();
    c.fillStyle = '#171b22'; rr(c, -332, -630, 664, 1260, 50); c.fill();
  };
  const bubble = (c, x, y, w, h, col, fill) => { c.fillStyle = fill; rr(c, x, y, w, h, 28); c.fill(); c.strokeStyle = col; c.lineWidth = 3; c.stroke(); };

  // Nana's phone. t is film time (for the IN++ extras), h is story hour.
  function nanaPhone(c, h, t) {
    phoneBody(c, h >= 1 ? 'rgba(255,59,48,0.55)' : null);
    text(c, 'Family', 0, -555, 50, GRAY, { font: SERIF, align: 'center' });
    c.strokeStyle = DGRAY; c.lineWidth = 2; c.beginPath(); c.moveTo(-300, -520); c.lineTo(300, -520); c.stroke();
    bubble(c, -300, -500, 460, 76, DGRAY, '#1d2129'); text(c, 'Joe: who has the blue dish?', -276, -450, 36, GRAY);
    bubble(c, -300, -410, 470, 76, DGRAY, '#1d2129'); text(c, 'Ana: running late, save soup', -276, -360, 36, GRAY);
    if (h >= 1) { // the claim arrives at hour 1
      const k = L.ease.out(L.clamp((h - 1) / 0.35, 0, 1)), dy = (1 - k) * 120;
      c.save(); c.globalAlpha *= k; c.translate(0, dy);
      bubble(c, -300, -310, 600, 330, RED, 'rgba(255,59,48,0.10)');
      text(c, 'Forwarded many times', -270, -262, 32, GRAY);
      redBars(c, -270, -225, CLAIM, 30, 1);
      c.restore();
    }
    const SHARE = 'sharing, just in case. love you all';
    if (h >= 2.8) { bubble(c, -40, 45, 340, 120, DGRAY, '#262b34'); text(c, 'sharing, just in case.', 280, 95, 36, INK, { align: 'right' }); text(c, 'love you all', 280, 142, 36, INK, { align: 'right' }); }
    if (h >= 14.9) { const k = L.ease.out(L.clamp((h - 14.9) / 0.35, 0, 1));
      c.save(); c.globalAlpha *= k; c.translate(0, (1 - k) * 80);
      const two = t >= T_IN2 + 0.5; const a2 = L.clamp((t - T_IN2 - 0.5) / 0.4, 0, 1);
      bubble(c, -300, 200, 480, two ? 150 : 90, GREEN, 'rgba(52,210,123,0.10)');
      text(c, 'Sam: Nana, sit with me?', -276, 256, 38, GREEN);
      if (two) text(c, "let's look at it together.", -276, 316, 38, GREEN, { alpha: a2 });
      c.restore(); }
    if (t >= T_IN2 + 1.1 && t < T_FREEZE + 100) { const a = L.clamp((t - T_IN2 - 1.1) / 0.3, 0, 1); const dots = '.'.repeat(1 + Math.floor((t * 3) % 3));
      text(c, 'Nana is typing' + dots, -290, 430, 34, GRAY, { alpha: a }); }
    // input bar
    c.fillStyle = '#20252e'; rr(c, -310, 520, 620, 80, 40); c.fill();
    if (h >= 1.9 && h < 2.8) text(c, typed(SHARE, (h - 1.9) / 0.8), -280, 573, 30, INK);
    else text(c, 'Message', -280, 573, 32, DGRAY);
  }

  // Sam's phone: a different feed. Gray engagement tiles scroll; the green check arrives at the median lag.
  const tileR = L.rng(77); const TILES = []; for (let i = 0; i < 8; i++) TILES.push({ b: [0, 1, 2].map(() => [tileR() * 400 - 200, tileR() * 140 - 70, 40 + tileR() * 60]) });
  function samPhone(c, h) {
    phoneBody(c, h >= MED ? 'rgba(52,210,123,0.5)' : null);
    text(c, 'For you', 0, -555, 50, GRAY, { font: SERIF, align: 'center' });
    c.save(); rr(c, -332, -520, 664, 1150, 40); c.clip();
    const scroll = Math.min(h, MED) * 90 % 300;
    for (let i = 0; i < 6; i++) { const y = -500 + i * 300 - scroll; const T = TILES[(i + Math.floor(Math.min(h, MED) * 90 / 300)) % 8];
      c.fillStyle = '#232830'; rr(c, -300, y, 600, 270, 26); c.fill();
      c.save(); c.shadowColor = '#6b7079'; c.shadowBlur = 30 * scaleOf(c); c.fillStyle = '#4d535d'; T.b.forEach(([bx, by, br]) => { c.beginPath(); c.arc(bx, y + 135 + by, br, 0, 7); c.fill(); }); c.restore(); }
    c.restore();
    if (h >= MED) { const k = L.ease.out(L.clamp((h - MED) / 0.35, 0, 1));
      c.save(); c.globalAlpha *= k; c.translate(0, (1 - k) * -120);
      c.fillStyle = '#12161b'; rr(c, -310, -505, 620, 360, 30); c.fill(); c.strokeStyle = GREEN; c.lineWidth = 4; c.stroke();
      text(c, 'CHECKED', -270, -440, 52, GREEN, { font: SERIF });
      redBars(c, -270, -405, [[110, 70, 150]], 18, 0.8);
      c.strokeStyle = GRAY; c.lineWidth = 3; c.beginPath(); c.moveTo(-275, -396); c.lineTo(80, -396); c.stroke();
      text(c, 'This claim is false.', -270, -310, 48, GREEN);
      text(c, 'independent fact-checkers', -270, -250, 32, GRAY);
      c.restore(); }
    // DM compose to Nana
    if (h >= 13.35) { const a = L.clamp((h - 13.35) / 0.2, 0, 1); c.save(); c.globalAlpha *= a;
      c.fillStyle = '#171b22'; rr(c, -332, 250, 664, 380, 40); c.fill();
      text(c, 'To: Nana', -290, 310, 36, GRAY);
      const D1 = "that's fake", D2 = 'Nana, sit with me?';
      let draft = '';
      if (h < 13.9) draft = typed(D1, (h - 13.4) / 0.4); else if (h < 14.05) draft = D1; else if (h < 14.3) draft = D1.slice(0, Math.max(0, Math.round(D1.length * (1 - (h - 14.05) / 0.2))));
      else if (h < 14.9) draft = typed(D2, (h - 14.3) / 0.5);
      if (h >= 14.9) { bubble(c, -30, 350, 330, 86, GREEN, 'rgba(52,210,123,0.10)'); text(c, 'Nana, sit with me?', 280, 405, 36, GREEN, { align: 'right' }); }
      c.fillStyle = '#20252e'; rr(c, -310, 520, 620, 80, 40); c.fill();
      if (draft) { text(c, draft + ((h * 4) % 1 < 0.5 ? '|' : ''), -280, 573, 34, INK); } else text(c, 'Message', -280, 573, 32, DGRAY);
      if (h >= 13.4 && h < 14.9) text(c, 'Sam is typing...', -290, 480, 30, GRAY, { alpha: 0.8 });
      c.restore(); }
  }

  // A person as type: silhouette from behind, filled with their own name.
  function silhouette(c, hx, hy, name, seed) {
    c.save(); c.beginPath(); c.arc(hx, hy, 45, 0, 7);
    c.moveTo(hx - 150, hy + 230); c.quadraticCurveTo(hx - 145, hy + 80, hx - 42, hy + 62); c.lineTo(hx + 42, hy + 62); c.quadraticCurveTo(hx + 145, hy + 80, hx + 150, hy + 230); c.closePath();
    c.fillStyle = '#0e1116'; c.fill(); c.strokeStyle = '#6b7079'; c.lineWidth = 2; c.stroke(); c.clip();
    c.font = `11px "${SERIF}"`; c.fillStyle = 'rgba(154,160,170,0.45)'; c.textAlign = 'left';
    const row = (name + ' ').repeat(20); for (let j = 0; j < 24; j++) c.fillText(row, hx - 170 - (j * 7 + seed) % 30, hy - 50 + j * 12);
    c.restore();
  }

  function room(c, h, t, alpha) {
    c.save(); c.globalAlpha *= alpha;
    // the room is words
    c.strokeStyle = '#3a3f48'; c.lineWidth = 2; c.strokeRect(410, 560, 270, 170); text(c, 'window', 545, 660, 44, '#5d636d', { font: SERIF, align: 'center' });
    text(c, 'lamp', 240, 820, 38, '#5d636d', { align: 'center' });
    text(c, 'kettle', 850, 820, 34, '#5d636d', { align: 'center' });
    text(c, 'c   o   u   c   h', 545, 1420, 64, '#4d535d', { font: SERIF, align: 'center' });
    // phones (nested: phone units -> room)
    [[NP, nanaPhone], [SP, samPhone]].forEach(([P, fn]) => { c.save(); c.translate(P[0], P[1]); c.scale(PS, PS); fn(c, h, t); c.restore(); });
    silhouette(c, NH[0], NH[1], 'Nana', 3); silhouette(c, SH[0], SH[1], 'Sam', 11);
    text(c, 'Nana', NH[0], NH[1] + 280, 34, GRAY, { font: SERIF, align: 'center', alpha: L.sm(40, 22, camAt(t)[2]) });
    text(c, 'Sam', SH[0], SH[1] + 280, 34, GRAY, { font: SERIF, align: 'center', alpha: L.sm(40, 22, camAt(t)[2]) });
    c.restore();
  }

  function field(c, h, alpha, homeAlpha) {
    if (alpha <= 0.01) return; c.save(); c.globalAlpha *= alpha;
    for (let i = 0; i < N; i++) { const p = homes[i]; const a = i === HOME ? homeAlpha : 1; if (a <= 0.01) continue;
      c.globalAlpha = alpha * a;
      c.fillStyle = p.hr <= h ? RED : '#3a3f48'; rr(c, p.x - 15, p.y - 4, 14, 7, 3.5); c.fill();
      c.fillStyle = p.hg <= h ? GREEN : '#2a2e36'; rr(c, p.x + 2, p.y - 4, 13, 7, 3.5); c.fill(); }
    c.restore();
  }

  function world(c, t, h) {
    const cam = camAt(t); c.save(); L.camera(c, [[0, [cam[0], cam[1], cam[2], 0]]], 0);
    const z = cam[2], roomA = L.sm(3, 9, z);
    field(c, h, 1 - L.sm(4, 14, z), 1 - roomA);
    if (roomA > 0.01) { c.save(); c.translate(CC[0], CC[1]); c.scale(RS, RS); c.translate(-RC[0], -RC[1]); room(c, h, t, roomA); c.restore(); }
    c.restore();
    return z;
  }

  // ---------- cards ----------
  const band = (c, y, a) => { const g = c.createLinearGradient(0, y - 170, 0, y + 90); g.addColorStop(0, 'rgba(11,13,17,0)'); g.addColorStop(0.5, `rgba(11,13,17,${0.8 * a})`); g.addColorStop(1, 'rgba(11,13,17,0)'); c.fillStyle = g; c.fillRect(0, y - 170, 1080, 260); };
  const CARDS = [
    [0, 1.4, ['Same couch.', 'Different feeds.'], 1330, 0.0],
    [2.7, 4.4, ['It finds her first.'], 1420],
    [8.4, 10.6, ['Faster than', 'anything true.'], 1330],
    [12.2, 13.9, ['The answer is', 'in the room.'], 1330],
    [14.6, 16.3, ['Right answer.', 'Wrong phone.'], 1330],
    [T_IN2 + 0.6, T_NECK, ['Not her.', 'The wiring.'], 1400],
  ];
  function cards(c, t) { CARDS.forEach(([a, b, lines, y, fin]) => { if (t < a || t >= b) return;
    const al = Math.min(fin === 0 ? 1 : L.clamp((t - a) / 0.2, 0, 1), L.clamp((b - t) / 0.2, 0, 1)); band(c, y - (lines.length - 1) * 50, al);
    L.title(c, lines, y - (lines.length - 1) * 100, 100, { alpha: al }); }); }

  const clock = (c, h, a = 1) => { c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(11,13,17,0.7)'; rr(c, 70, 205, 250, 70, 18); c.fill();
    text(c, `hour ${Math.floor(h)}`, 100, 257, 48, INK); c.restore(); };

  // ---------- snap panels ----------
  function snapRow(c, y0, title, sub, med, p90, mark, hp, a) {
    c.save(); c.globalAlpha = a;
    c.strokeStyle = '#3a3f48'; c.lineWidth = 3; rr(c, 80, y0, 920, 470, 26); c.stroke();
    text(c, title, 120, y0 + 66, 52, INK);
    if (sub) text(c, sub, 120, y0 + 122, 46, GRAY);
    const X0 = 130, X1 = 890, mid = y0 + 320, HH = 110, xs = hh => X0 + (X1 - X0) * hh / SNAP_H;
    c.strokeStyle = '#5d636d'; c.lineWidth = 2; c.beginPath(); c.moveTo(X0, mid); c.lineTo(X1, mid); c.stroke();
    // red area (claim reach) above, green area (correction reach) below
    const area = (fn, dir, col) => { c.beginPath(); c.moveTo(X0, mid); const n = 120; for (let i = 0; i <= n; i++) { const hh = hp * i / n; c.lineTo(xs(hh), mid - dir * HH * fn(hh)); } c.lineTo(xs(hp), mid); c.closePath(); c.fillStyle = col; c.fill(); };
    area(extent, 1, RED); area(hh => L.lognormalCDF(hh, med, p90), -1, GREEN);
    text(c, 'the claim', X0 + 4, mid - HH - 16, 38, RED, { alpha: L.clamp(hp / 1.5, 0, 1) });
    text(c, 'the correction', X0 + 4, mid + HH + 46, 38, GREEN, { alpha: hp >= med ? 1 : 0.35 });
    if (hp >= med) { const x = xs(med), k = L.clamp((hp - med) / 1.5, 0, 1); c.strokeStyle = GREEN; c.lineWidth = 4; c.beginPath(); c.moveTo(x, mid - HH - 10); c.lineTo(x, mid + HH * 0.6); c.stroke();
      text(c, mark, Math.max(x + 14, X0 + 330), mid - 30, 60, GREEN, { font: SERIF, alpha: k }); }
    c.strokeStyle = INK; c.lineWidth = 3; c.beginPath(); c.moveTo(xs(hp), mid - HH - 20); c.lineTo(xs(hp), mid + HH + 10); c.stroke();
    c.restore();
  }
  function snap(c, t) {
    c.fillStyle = BG; c.fillRect(0, 0, 1080, 1920);
    const a = L.clamp((t - T_SNAP) / 0.3, 0, 1), hp = L.clamp((t - T_SWEEP) * SNAP_RATE, 0, SNAP_H);
    L.title(c, ['Same clock, sped up.'], 300, 70, { alpha: a, col: GRAY });
    snapRow(c, 360, 'How it is routed now', null, MED, P90, `${MED} h`, hp, a);
    snapRow(c, 880, 'Routed with frontier AI', 'illustrative', AIMED, AIP90, `~${AIMED} h`, hp, L.clamp((t - T_SNAP - 0.3) / 0.3, 0, 1));
    const ca = L.clamp((t - 23.2) / 0.4, 0, 1);
    L.title(c, ["Sooner isn't believed.", 'People still decide.'], 1425, 56, { alpha: ca, col: INK });
    L.slate(c, 'SC9  FLAT  SNAP (1 s = 5 h)');
  }

  // ---------- draw ----------
  function draw(c, t) {
    c.fillStyle = BG; c.fillRect(0, 0, 1080, 1920);
    if (t >= T_SNAP && t < T_IN2) { snap(c, t); L.grain(c, t, { alpha: 0.04 }); return; }
    if (t >= T_END) { L.endCard(c, L.clamp((t - T_END) / 0.4, 0, 1)); return; }
    const frozen = t >= T_FREEZE && t < T_SNAP;
    const tw = frozen ? T_FREEZE - 0.001 : t;
    const h = t >= T_IN2 ? 16 : hAt(tw);
    const z = world(c, tw, h);
    if (t < T_FREEZE) clock(c, h);
    // absence: when the race ends, the room's color drains except the two lines that matter
    if (frozen) { const a = L.clamp((t - T_FREEZE) / 0.4, 0, 1); c.fillStyle = `rgba(11,13,17,${0.72 * a})`; c.fillRect(0, 0, 1080, 1920);
      L.title(c, ['We slowed it down', 'so you could see it.'], 880, 92, { alpha: a }); }
    if (t >= T_NECK) { const a = L.clamp((t - T_NECK) / 0.4, 0, 1); c.fillStyle = `rgba(11,13,17,${0.72 * a})`; c.fillRect(0, 0, 1080, 1920);
      L.title(c, ['This is the bottleneck.'], 960, 100, { alpha: a }); }
    cards(c, t);
    const sl = t < 1.4 ? 'SC1  OTS WIDE  COLD OPEN (hour 13)' : t < 4.5 ? 'SC2  CLOSE  OVER THE SHOULDER' : t < 8 ? 'SC3  DOLLY OUT' : t < 11.5 ? 'SC4  WIDE  1,500 HOMES' :
      t < 14.3 ? 'SC5  DOLLY IN' : t < 16.2 ? 'SC6  CLOSE+  OVER THE SHOULDER' : t < T_FREEZE ? 'SC7  WHIP PAN' : t < T_SNAP ? 'SC8  FREEZE' : t < T_NECK ? 'SC10  CLOSEST  OTS' : 'SC11  HOLD';
    L.slate(c, sl);
    L.grain(c, t, { alpha: 0.04 });
  }

  return {
    draw, DUR,
    acts: [{ start: 0, end: 1.4, bpm: 0, drone: true }, { start: 1.4, end: T_FREEZE, bpm: 132, drone: true }, { start: T_FREEZE, end: T_SNAP, bpm: 0, drone: false },
      { start: T_SNAP, end: T_IN2, bpm: 0, drone: true }, { start: T_IN2, end: T_END, bpm: 60, drone: true }, { start: T_END, end: DUR, bpm: 0, drone: true }],
    cues: [{ t: 1.4, type: 'whoosh' }, { t: T0 + 1, type: 'ding' }, { t: T0 + 2.8, type: 'pop' }, { t: 4.6, type: 'whoosh' }, { t: 11.6, type: 'whoosh' },
      { t: T0 + MED, type: 'ding' }, { t: T0 + 14.9, type: 'pop' }, { t: T_SNAP, type: 'hit' }, { t: T_NECK, type: 'stamp' }],
  };
}
module.exports = makeScene;
