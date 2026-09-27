// six-to-twelve-hours: two-phones, text-only typography, language, between nations, over-the-shoulder. Analog: cuban-missile-1962.
// Deliberate anachronism: 1962 messages in a modern chat UI. Two identical gray phones across a gulf; "Delivered" takes 6-12 h.
// Mapping: race 1 s = 6 story hours while the clock runs; stop-start = the clock freezes at message events (see notes.md).
// Red: alert strip lit by threat.points extent (step function, unverified -> motion only). Green: documented fragments f1-f4.
// Snap: same mapping (12 h decode = 2 s vs minutes, illustrative), then the whole record day 0-260 with lognormalCDF lanes.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A_ = L.loadAnalog('cuban-missile-1962');
  const DUR = 39, RED = L.RED, GREEN = L.GREEN, BG = '#0b0d11';
  const GRAY = '#9aa0aa', DGRAY = '#4a4f58', INK = '#e8e4da';
  const LAT = A_.solution.message_latency_hours;               // typical 6, worst 12
  const AG = A_.solution.aggregation, AI_MED = A_.ai_counterfactual.aggregation_median; // 12 / 247, 11
  const PTS = A_.threat.points;
  const extentAt = day => { let e = 0; PTS.forEach(p => { if (day >= p.t) e = p.extent; }); return e; };
  const DAY0 = 8;                                               // H = hours after day 8
  const F2 = (A_.solution.fragments[1].ready_at - DAY0) * 24;    // 48
  const F3 = (A_.solution.fragments[2].ready_at - DAY0) * 24;    // 72
  const F4 = (A_.solution.fragments[3].ready_at - DAY0) * 24;    // 84
  const DEAL = (AG.median - DAY0) * 24;                          // 96
  const F2_ARR = F2 + LAT.worst, F3_ARR = F3 + LAT.typical;      // 60, 78
  const FLASH_H = 74;                                            // day-11 event, placed inside day 11

  // ---------- stop-start clock: [filmStart, filmEnd, H0, H1]; 1 s = 6 h in every run ----------
  const RUNS = [[1.4, 9.8, -2.4, F2], [10.8, 12.8, F2, F2_ARR], [13.8, 16.8, F2_ARR, F3_ARR], [17.6, 20.8, F3_ARR, DEAL + 1.2]];
  const Hof = t => { if (t < 1.4) return FLASH_H; let h = -2.4; for (const [a, b, h0, h1] of RUNS) { if (t < a) return h; h = t < b ? L.lerp(h0, h1, (t - a) / (b - a)) : h1; if (t < b) return h; } return h; };
  const running = t => RUNS.some(([a, b]) => t >= a && t < b);
  const tOfH = H => { for (const [a, b, h0, h1] of RUNS) if (H >= h0 && H <= h1) return a + (b - a) * (H - h0) / (h1 - h0); return 0; };
  const T_DEAD = 20.8, T_SLOW = 21.6, T_SNAP = 24.0, T_REC = 27.6, T_IN2 = 30.4, T_NECK = 32.6, T_END = 35.0;

  // ---------- world ----------
  const PS = 0.2, PA = [540, 1560], PB = [540, 360];            // phones (A near, B far and rotated 180 deg)
  const view = (pt, z, sx, sy) => [pt[0] - (sx - 540) / z, pt[1] - (sy - 960) / z, z];
  const V = {
    cold: view(PA, 4.9, 500, 850), close: view(PA, 4.73, 500, 850), close2: view(PA, 5.0, 500, 850),
    wide: [540, 960, 0.92], wide2: [540, 960, 0.97],
    inA: view([PA[0], PA[1] + 2], 5.8, 510, 800), inB: view([PA[0], PA[1] + 2], 6.2, 510, 800),
    closest: view([PA[0] + 22, PA[1] + 50], 6.6, 500, 900), closest2: view([PA[0] + 22, PA[1] + 50], 7.1, 500, 900),
  };
  const CAM = [[0, V.cold], [1.4, V.cold], [1.4001, V.close], [5.0, V.close2], [8.6, V.wide], [12.8, V.wide2], [14.8, V.inA], [T_DEAD, V.inB],
    [T_IN2, V.inB], [T_IN2 + 0.0001, V.closest], [T_END, V.closest2]];
  const camAt = t => {
    if (t <= CAM[0][0]) return CAM[0][1];
    for (let i = 0; i < CAM.length - 1; i++) { const [ta, a] = CAM[i], [tb, b] = CAM[i + 1];
      if (t <= tb) { const f = L.ease.inOut((t - ta) / (tb - ta)); const z = Math.exp(L.lerp(Math.log(a[2]), Math.log(b[2]), f));
        const w = Math.abs(a[2] - b[2]) < 1e-6 ? f : (1 / z - 1 / a[2]) / (1 / b[2] - 1 / a[2]);
        return [L.lerp(a[0], b[0], w), L.lerp(a[1], b[1], w), z]; } }
    return CAM[CAM.length - 1][1];
  };

  // ---------- helpers ----------
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r); };
  const scaleOf = c => { const m = c.getTransform(); return Math.hypot(m.a, m.b); };
  const text = (c, s, x, y, size, col, { font = HAND, align = 'left', alpha = 1 } = {}) => { if (alpha <= 0.001) return; c.save(); c.globalAlpha *= alpha; c.font = `${size}px "${font}"`; c.textAlign = align; c.fillStyle = col; c.fillText(s, x, y); c.restore(); };
  const typed = (s, f) => s.slice(0, Math.floor(L.clamp(f, 0, 1) * s.length + 1e-6));
  const pop = (H, h0, d = 1.2) => L.ease.out(L.clamp((H - h0) / d, 0, 1));
  const flashAt = H => Math.exp(-Math.pow((H - FLASH_H) / 1.6, 2));
  const WORDS = 'we both step back if yours leave ours leave too and no one moves first and the ships turn and the sites come down and nobody says who blinked'.split(' ');
  const lr = L.rng(62); const LETTER = []; for (let i = 0; i < 6; i++) { let s = ''; while (s.length < 30) s += WORDS[Math.floor(lr() * WORDS.length)] + ' '; LETTER.push(s.trim()); }
  const DRAFT = 'We both step back.', F3TXT = 'Ours out. Yours out too.';

  // ---------- the phone (local units: 720 x 1320). side 'A' or 'B'. ----------
  function phone(c, side, H, t) {
    const day = DAY0 + H / 24, ext = extentAt(day), fl = flashAt(H), dealK = pop(H, DEAL, 0.6);
    const isA = side === 'A';
    // body + glows
    c.save(); c.shadowColor = dealK > 0 ? GREEN : RED; c.shadowBlur = (40 + 60 * fl) * scaleOf(c); c.globalAlpha *= dealK > 0 ? 0.6 * dealK : 0.35 + 0.65 * Math.max(ext, fl);
    c.fillStyle = '#12151b'; rr(c, -360, -660, 720, 1320, 70); c.fill(); c.restore();
    c.fillStyle = '#12151b'; rr(c, -360, -660, 720, 1320, 70); c.fill(); c.strokeStyle = '#5b606a'; c.lineWidth = 6; c.stroke();
    c.fillStyle = '#171b22'; rr(c, -332, -630, 664, 1260, 50); c.fill();
    // red edge of the screen (alert glow)
    c.save(); c.strokeStyle = RED; c.shadowColor = RED; c.shadowBlur = (30 + 50 * fl) * scaleOf(c); c.lineWidth = 8 + 10 * fl; c.globalAlpha *= L.clamp(ext * 0.7 + fl * 0.6, 0, 1);
    rr(c, -330, -628, 660, 1256, 48); c.stroke(); c.restore();
    // status bar: numeral-free clock + day tallies
    const cx = -290, cy = -595; c.strokeStyle = GRAY; c.lineWidth = 3; c.beginPath(); c.arc(cx, cy, 18, 0, 7); c.stroke();
    if (running(t)) { c.fillStyle = 'rgba(154,160,170,0.25)'; c.beginPath(); c.arc(cx, cy, 15, 0, 7); c.fill(); }
    const ha = H / 12 * Math.PI * 2 - Math.PI / 2; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(ha) * 11, cy + Math.sin(ha) * 11); c.stroke();
    c.strokeStyle = DGRAY; c.lineWidth = 3; for (let i = 0; i < Math.floor(day); i++) { const x = -255 + i * 12; c.beginPath(); c.moveTo(x, cy - 13); c.lineTo(x, cy + 13); c.stroke(); }
    // alert strip: 4 segments lit by extent
    const lit = Math.round(ext / 0.25);
    for (let i = 0; i < 4; i++) { const x = -310 + i * 157;
      if (i < lit) { c.save(); c.fillStyle = RED; c.shadowColor = RED; c.shadowBlur = (18 + 40 * fl) * scaleOf(c); c.globalAlpha *= 0.85 + 0.15 * fl; rr(c, x, -560, 147, 40, 12); c.fill(); c.restore(); }
      else { c.strokeStyle = '#3a3f48'; c.lineWidth = 3; rr(c, x, -560, 147, 40, 12); c.stroke(); } }
    if (fl > 0.02) { c.save(); c.globalAlpha *= 0.28 * fl; c.fillStyle = RED; rr(c, -332, -630, 664, 1260, 50); c.fill(); c.restore(); }
    // header
    c.fillStyle = '#3a3f48'; c.beginPath(); c.arc(-272, -465, 30, 0, 7); c.fill();
    text(c, 'Them', -222, -448, 54, INK, { font: SERIF });
    c.strokeStyle = DGRAY; c.lineWidth = 2; c.beginPath(); c.moveTo(-310, -412); c.lineTo(310, -412); c.stroke();
    // old gray exchange: identical on both phones
    const bub = (x, y, w, h, col, fill) => { c.fillStyle = fill; rr(c, x, y, w, h, 28); c.fill(); c.strokeStyle = col; c.lineWidth = 3; c.stroke(); };
    bub(-310, -392, 290, 72, DGRAY, '#1d2129'); text(c, 'Stand down.', -284, -344, 38, GRAY);
    bub(40, -308, 270, 72, DGRAY, '#262b34'); text(c, 'You first.', 286, -260, 38, INK, { align: 'right' });
    const receipt = (s, x, y, col = GRAY, al = 1) => text(c, s, x, y, 28, col, { align: 'right', alpha: al });
    const letterVisible = isA ? H >= F2_ARR : H >= F2;
    if (!letterVisible) receipt('Sent', 306, -210);
    // f2: the long letter
    if (letterVisible) { const k = pop(H, isA ? F2_ARR : F2), x = isA ? -310 : -210;
      c.save(); c.globalAlpha *= k; c.translate(0, (1 - k) * 60);
      bub(x, -220, 520, 300, GREEN, 'rgba(52,210,123,0.08)');
      text(c, 'We both step back,', x + 26, -170, 38, GREEN);
      LETTER.forEach((s, i) => text(c, s, x + 26, -128 + i * 30, 23, GREEN, { alpha: 0.6 }));
      text(c, 'long letter', x + 26, 64, 26, GRAY);
      c.restore();
      if (!isA && H < F3) receipt(H >= F2_ARR ? 'Delivered' : 'Sent', 306, 112);
    }
    // f3: the second offer
    const f3Vis = isA ? H >= F3_ARR : H >= F3;
    if (f3Vis) { const k = pop(H, isA ? F3_ARR : F3), x = isA ? -310 : -150;
      c.save(); c.globalAlpha *= k; bub(x, 100, 460, 72, GREEN, 'rgba(52,210,123,0.08)'); text(c, F3TXT, x + 24, 148, 36, GREEN); c.restore();
      if (!isA && H < DEAL) receipt(H >= F3_ARR ? 'Delivered' : 'Sent', 306, 204); }
    // deal: A's draft finally sent
    if (H >= DEAL) { const x = isA ? -110 : -310;
      c.save(); c.globalAlpha *= dealK; c.fillStyle = '#132019'; rr(c, x, 216, 420, 76, 28); c.fill(); c.shadowColor = 'rgba(52,210,123,0.8)'; c.shadowBlur = 18 * scaleOf(c); c.strokeStyle = GREEN; c.lineWidth = 5; c.stroke(); c.restore();
      text(c, DRAFT, x + 24, 266, 38, GREEN, { alpha: dealK });
      if (isA) receipt('Sent', 306, 322, GRAY, dealK); }
    // f4: private line banner
    if (H >= F4) { const k = pop(H, F4, 0.8);
      c.save(); c.globalAlpha *= k; c.translate(0, (1 - k) * -60); c.fillStyle = '#10141a'; rr(c, -318, -404, 636, 70, 20); c.fill(); c.strokeStyle = GREEN; c.lineWidth = 3; c.stroke();
      text(c, 'private line: yes, quietly.', -290, -357, 34, GREEN); c.restore(); }
    // typing indicator on A while a message is in transit
    if (isA && ((H >= F2 && H < F2_ARR) || (H >= F3 && H < F3_ARR))) { const dots = '.'.repeat(1 + Math.floor((t * 3) % 3));
      text(c, 'Them is typing' + dots, -300, 400, 36, GRAY); text(c, '(decoding)', -300, 440, 30, DGRAY); }
    // input box
    c.fillStyle = '#20252e'; rr(c, -310, 478, 540, 84, 40); c.fill();
    let draft = null;
    if (isA && H < DEAL) draft = DRAFT;
    if (!isA && H < F2) draft = DRAFT;
    if (!isA && H >= F3 - 6 && H < F3) draft = typed(F3TXT, (H - (F3 - 6)) / 5);
    const cur = (t * 2) % 1 < 0.5 ? '|' : '';
    if (draft) { text(c, draft + cur, -282, 534, 40, GREEN); }
    else text(c, 'Message', -282, 534, 36, DGRAY);
    c.fillStyle = draft ? 'rgba(52,210,123,0.25)' : '#20252e'; c.beginPath(); c.arc(275, 520, 38, 0, 7); c.fill();
    c.strokeStyle = draft ? GREEN : DGRAY; c.lineWidth = 4; c.beginPath(); c.moveTo(275, 540); c.lineTo(275, 500); c.moveTo(260, 514); c.lineTo(275, 500); c.lineTo(290, 514); c.stroke();
  }

  // A person as type: head + shoulder from behind, filled with the word "we". Local world units around the phone.
  function silhouette(c) {
    const hx = 98, hy = 118; c.save(); c.beginPath(); c.arc(hx, hy, 32, 0, 7);
    c.moveTo(hx - 110, hy + 190); c.quadraticCurveTo(hx - 104, hy + 48, hx - 20, hy + 24); c.lineTo(hx + 20, hy + 24); c.quadraticCurveTo(hx + 104, hy + 48, hx + 110, hy + 190); c.closePath();
    c.fillStyle = 'rgba(10,12,16,0.94)'; c.fill(); c.strokeStyle = '#5d636d'; c.lineWidth = 0.6; c.stroke(); c.clip();
    c.font = `7px "${SERIF}"`; c.fillStyle = 'rgba(154,160,170,0.42)'; c.textAlign = 'left';
    const row = 'we '.repeat(30); for (let j = 0; j < 32; j++) c.fillText(row, hx - 120 - (j * 3) % 8, hy - 34 + j * 7);
    c.restore();
  }

  // Gulf: static rows of the words a message passes through.
  const gr = L.rng(1962); const GULF = []; for (let y = 560; y < 1380; y += 34) GULF.push({ y, off: -gr() * 200, a: 0.1 + gr() * 0.12 });
  const GULF_ROW = 'encode · wire · relay · decode · translate · '.repeat(6);
  const Y_B = PB[1] + 150, Y_A = PA[1] - 150;
  function crawler(c, H, h0, h1, s, xoff) {
    if (H < h0) return; const p = L.clamp((H - h0) / (h1 - h0), 0, 1), y = L.lerp(Y_B, Y_A, p), x = 540 + xoff;
    c.save(); c.strokeStyle = GREEN; c.globalAlpha = 0.35; c.lineWidth = 2; c.setLineDash([6, 8]); c.beginPath(); c.moveTo(x, Y_B); c.lineTo(x, y); c.stroke(); c.setLineDash([]); c.restore();
    if (p < 1) { text(c, s, x, y, 28, GREEN, { align: 'center' }); text(c, 'decoding', x, y + 30, 20, GRAY, { align: 'center' }); }
  }
  function world(c, t, H) {
    const cam = camAt(t); c.save(); L.camera(c, [[0, [cam[0], cam[1], cam[2], 0]]], 0);
    c.fillStyle = BG; c.fillRect(-400, -400, 1880, 2720);
    const ext = extentAt(DAY0 + H / 24), fl = flashAt(H);
    // red haze around both phones
    [PA, PB].forEach(P => { const g = c.createRadialGradient(P[0], P[1], 60, P[0], P[1], 620); g.addColorStop(0, `rgba(255,59,48,${0.22 * ext + 0.25 * fl})`); g.addColorStop(1, 'rgba(255,59,48,0)'); c.fillStyle = g; c.fillRect(P[0] - 640, P[1] - 640, 1280, 1280); });
    // gulf text
    c.save(); c.font = `18px "${SERIF}"`; c.textAlign = 'left'; GULF.forEach(r => { c.globalAlpha = r.a; c.fillStyle = GRAY; c.fillText(GULF_ROW, r.off - 100, r.y); }); c.restore();
    // messages crossing (speed = real latency at the stated mapping)
    crawler(c, H, F2, F2_ARR, DRAFT.slice(0, -1) + ' ...', -120);
    crawler(c, H, F3, F3_ARR, F3TXT, 120);
    if (H >= F4) { const k = pop(H, F4, 0.8); c.save(); c.globalAlpha = 0.5 * k; c.strokeStyle = GREEN; c.lineWidth = 2; c.beginPath(); c.moveTo(560, Y_A); c.quadraticCurveTo(900, 960, 560, Y_B); c.stroke(); c.restore(); }
    if (H >= DEAL) { const k = pop(H, DEAL, 0.6); c.save(); c.globalAlpha = k; c.strokeStyle = GREEN; c.shadowColor = GREEN; c.shadowBlur = 20; c.lineWidth = 6; c.beginPath(); c.moveTo(540, Y_B); c.lineTo(540, Y_A); c.stroke(); c.restore(); }
    // phones + shoulders (B is the same thing, rotated to face A)
    [[PA, 0, 'A'], [PB, Math.PI, 'B']].forEach(([P, rot, side]) => { c.save(); c.translate(P[0], P[1]); c.rotate(rot);
      c.save(); c.scale(PS, PS); phone(c, side, H, t); c.restore(); silhouette(c); c.restore(); });
    c.restore();
  }

  // ---------- cards (screen space) ----------
  const band = (c, y, a) => { const g = c.createLinearGradient(0, y - 180, 0, y + 100); g.addColorStop(0, 'rgba(11,13,17,0)'); g.addColorStop(0.5, `rgba(11,13,17,${0.85 * a})`); g.addColorStop(1, 'rgba(11,13,17,0)'); c.fillStyle = g; c.fillRect(0, y - 180, 1080, 280); };
  const CARDS = [
    [0, 1.4, ['Still typing.', 'For hours.'], 1030, 0],
    [2.0, 3.6, ['The way out', 'is typed.'], 880],
    [3.7, 5.2, ['Typed. Not sent.'], 880],
    [6.6, 8.5, ['Same words.', 'Both screens.'], 1010],
    [9.7, 11.0, ['Sent.'], 1000],
    [11.1, 12.8, ['Nearly 12 hours', 'to decode.'], 1010],
    [14.5, 16.0, ['Alarms are instant.'], 1250],
    [18.4, 20.4, ['Same words.', 'Typed all along.'], 1250],
    [T_IN2 + 0.3, T_NECK, ['The words were', 'never the problem.'], 620],
  ];
  function cards(c, t) { CARDS.forEach(([a, b, lines, y, fin]) => { if (t < a || t >= b) return;
    const al = Math.min(fin === 0 ? 1 : L.clamp((t - a) / 0.2, 0, 1), L.clamp((b - t) / 0.2, 0, 1));
    const y0 = y - (lines.length - 1) * 50; band(c, y0 + (lines.length - 1) * 50, al); L.title(c, lines, y0, 100, { alpha: al }); }); }

  // ---------- snap sheets ----------
  const panel = (c, y0, h) => { c.strokeStyle = '#3a3f48'; c.lineWidth = 3; rr(c, 80, y0, 920, h, 26); c.stroke(); };
  function chatPanel(c, y0, label, sub, fillDur, doneTxt, t0, t) {
    panel(c, y0, 430); text(c, label, 120, y0 + 70, 54, INK);
    if (sub) text(c, sub, 120, y0 + 124, 48, GRAY);
    const by = y0 + 150; c.fillStyle = 'rgba(52,210,123,0.08)'; rr(c, 120, by, 560, 84, 30); c.fill(); c.strokeStyle = GREEN; c.lineWidth = 3; c.stroke();
    text(c, DRAFT, 150, by + 58, 46, GREEN);
    const f = L.clamp((t - t0) / fillDur, 0, 1);
    c.fillStyle = '#20252e'; rr(c, 120, y0 + 272, 780, 26, 13); c.fill();
    if (f > 0) { c.fillStyle = GREEN; rr(c, 120, y0 + 272, Math.max(26, 780 * f), 26, 13); c.fill(); }
    if (t < t0) text(c, 'Sent', 120, y0 + 380, 48, GRAY);
    else if (f < 1) text(c, 'decoding' + '.'.repeat(1 + Math.floor((t * 3) % 3)), 120, y0 + 380, 48, GRAY);
    else text(c, doneTxt, 120, y0 + 380, 52, INK);
  }
  function snapChats(c, t) {
    const a = L.clamp((t - T_SNAP) / 0.25, 0, 1); c.save(); c.globalAlpha = a;
    L.title(c, ['Same words. Same clock.'], 300, 64, { col: GRAY, outline: false });
    const t0 = T_SNAP + 0.6;
    chatPanel(c, 360, 'as it was', null, LAT.worst / 6, 'Delivered · 12 hours', t0, t);           // 1 s = 6 h
    chatPanel(c, 830, 'frontier AI translating', 'illustrative', (10 / 60) / 6, 'Delivered · minutes', t0, t);
    text(c, 'People still read. People decide.', 540, 1400, 54, INK, { font: SERIF, align: 'center', alpha: L.clamp((t - (T_SNAP + 2.2)) / 0.4, 0, 1) });
    c.restore(); L.slate(c, 'SC8  SNAP  SAME CLOCK (1 s = 6 h)');
  }
  function snapRecord(c, t) {
    const a = L.clamp((t - T_REC) / 0.25, 0, 1); c.save(); c.globalAlpha = a;
    L.title(c, ['The whole record, to scale.'], 300, 64, { col: GRAY, outline: false });
    panel(c, 360, 880);
    const X0 = 130, X1 = 950, SPAN = 260, xd = d => X0 + (X1 - X0) * d / SPAN;
    const dp = L.clamp((t - (T_REC + 0.3)) / 1.6, 0, 1) * SPAN;
    const lane = (y, label, sub, med) => {
      text(c, label, 120, y - 150, 50, INK); if (sub) text(c, sub, 120, y - 100, 46, GRAY);
      c.strokeStyle = '#5d636d'; c.lineWidth = 2; c.beginPath(); c.moveTo(X0, y); c.lineTo(X1, y); c.stroke();
      // red: alert extent, step function, fading after day 12 (de-escalation undated)
      c.beginPath(); c.moveTo(X0, y); const n = 260; for (let i = 0; i <= n; i++) { const d = Math.min(dp, SPAN * i / n); const e = extentAt(d) * (d > 12 ? Math.exp(-(d - 12) / 6) : 1); c.lineTo(xd(d), y - 70 * e); } c.lineTo(xd(dp), y); c.closePath(); c.fillStyle = RED; c.fill();
      // green: share assembled, lognormal from the analog (median, p90 247)
      c.beginPath(); c.moveTo(X0, y); for (let i = 0; i <= n; i++) { const d = Math.min(dp, SPAN * i / n); c.lineTo(xd(d), y + 90 * L.lognormalCDF(d, med, AG.p90)); } c.lineTo(xd(dp), y); c.closePath(); c.fillStyle = 'rgba(52,210,123,0.55)'; c.fill();
      if (dp >= med) { c.fillStyle = GREEN; c.beginPath(); c.arc(xd(med), y + 45, 11, 0, 7); c.fill(); }
    };
    lane(640, 'as it was', null, AG.median);
    lane(1010, 'frontier AI translating', 'illustrative, about a day sooner', AI_MED);
    if (dp >= AG.p90) { const x = xd(AG.p90); c.save(); c.strokeStyle = GREEN; c.lineWidth = 4; c.setLineDash([12, 10]); c.beginPath(); c.moveTo(x, 520); c.lineTo(x, 1180); c.stroke(); c.restore();
      text(c, 'direct line', x - 16, 1170, 40, GREEN, { align: 'right' }); }
    c.strokeStyle = INK; c.lineWidth = 3; c.beginPath(); c.moveTo(xd(dp), 520); c.lineTo(xd(dp), 1180); c.stroke();
    text(c, 'The direct line took 247 days.', 540, 1400, 62, INK, { font: SERIF, align: 'center', alpha: L.clamp((t - (T_REC + 2.0)) / 0.3, 0, 1) });
    c.restore(); L.slate(c, 'SC9  THE WHOLE RECORD (1 s = 160 days)');
  }

  // ---------- draw ----------
  function draw(c, t) {
    c.fillStyle = BG; c.fillRect(0, 0, 1080, 1920);
    if (t >= T_END) { L.endCard(c, L.clamp((t - T_END) / 0.4, 0, 1)); return; }
    const tw = t >= T_DEAD && t < T_IN2 ? T_DEAD : t;
    const H = Hof(tw);
    world(c, tw, H);
    if (t >= T_DEAD && t < T_IN2) { const a = L.clamp((t - T_SLOW) / 0.4, 0, 1);
      c.fillStyle = `rgba(11,13,17,${0.25 + 0.5 * a})`; c.fillRect(0, 0, 1080, 1920);
      if (t < T_SNAP) L.title(c, ['We slowed it down', 'so you could see it.'], 900, 92, { alpha: a }); }
    if (t >= T_SNAP && t < T_IN2 + 0.4) { const a = t < T_IN2 ? 1 : 1 - (t - T_IN2) / 0.4; c.save(); c.globalAlpha = a; c.fillStyle = BG; c.fillRect(0, 0, 1080, 1920); c.restore();
      if (t < T_IN2) { if (t < T_REC) snapChats(c, t); else snapRecord(c, t); L.grain(c, t, { alpha: 0.04 }); return; } }
    if (t >= T_NECK) { const a = L.clamp((t - T_NECK) / 0.4, 0, 1); c.fillStyle = `rgba(11,13,17,${0.72 * a})`; c.fillRect(0, 0, 1080, 1920);
      L.title(c, ['This is the bottleneck.'], 960, 100, { alpha: a }); }
    cards(c, t);
    const sl = t < 1.4 ? 'SC1  OTS CLOSE  COLD OPEN (later)' : t < 5 ? 'SC2  OTS CLOSE' : t < 8.6 ? 'SC3  PULL OUT' : t < 12.8 ? 'SC4  WIDE  THE GULF' :
      t < 14.8 ? 'SC5  DOLLY IN' : t < T_DEAD ? 'SC6  OTS CLOSER' : t < T_SNAP ? 'SC7  FREEZE' : 'SC10  OTS CLOSEST';
    L.slate(c, sl + (running(t) ? '' : t < T_DEAD && t > 1.4 ? '  (clock stopped)' : ''));
    L.grain(c, t, { alpha: 0.04 });
  }

  return {
    draw, DUR,
    acts: [{ start: 0, end: 1.4, bpm: 0, drone: true }, { start: 1.4, end: T_DEAD, bpm: 50, drone: true }, { start: T_DEAD, end: T_SLOW, bpm: 0, drone: false },
      { start: T_SLOW, end: T_SNAP, bpm: 0, drone: true }, { start: T_SNAP, end: T_SNAP + 0.5, bpm: 0, drone: false }, { start: T_SNAP + 0.5, end: T_IN2, bpm: 0, drone: true },
      { start: T_IN2, end: T_END, bpm: 44, drone: true }, { start: T_END, end: DUR, bpm: 0, drone: true }],
    cues: [{ t: 0.05, type: 'hit' }, { t: tOfH(0), type: 'hit' }, { t: 5.0, type: 'whoosh' }, { t: 9.8, type: 'pop' }, { t: 12.8, type: 'ding' }, { t: 12.9, type: 'whoosh' },
      { t: tOfH(FLASH_H), type: 'hit' }, { t: 16.8, type: 'ding' }, { t: tOfH(F4), type: 'ding' }, { t: tOfH(DEAL), type: 'stamp' }, { t: T_SNAP, type: 'hit' }, { t: T_NECK, type: 'stamp' }],
  };
}
module.exports = makeScene;
