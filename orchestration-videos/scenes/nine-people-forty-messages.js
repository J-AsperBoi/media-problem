// nine-people-forty-messages: pov, text-only typography, traffic, family scale, over-the-shoulder. Analog: heatwave-2003.
// Mapping: race 1 s = 1 day (day = t - 1.4, days 0..14). Snap: days 0..19 in 4.5 s, same clock both lanes.
// Red (the heat in the chat header / city haze): rho(d) = 4 s(1-s), s = L.logistic fitted with midpoint at the sourced
// peak (day 11.5) and 0.99 at day 19 (k = ln(99)/7.5, doubling 1.13 d), same fit as nineteen-days / the-heat-map.
// Chat: 40 messages at quantiles of the cumulative rate 0.25 + rho(d) over days 0..12.
// Green: two-sided lognormal (median 12, p10 9.5, p90 305) -> pieces routed to Gran's door on days 9.5 / 10.9 / 12 / 305.
// AI (illustrative): ai_counterfactual.aggregation_median = 3, same shape scaled 3/12. See output/<slug>/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('heatwave-2003');
  const DUR = 36, RED = L.RED, GREEN = L.GREEN, BG = '#0b0d11';
  const GRAY = '#9aa0aa', DGRAY = '#4a4f58', INK = '#e8e4da', DIM = '#2c3038';
  const rgbaR = a => `rgba(255,59,48,${a})`, rgbaG = a => `rgba(52,210,123,${a})`;

  // ---------- data ----------
  const pts = A.threat.points, DEND = pts[pts.length - 1].t; // 19
  const PEAK = 11.5;                                          // sourced: daily excess > 1,000 on days 11-12
  const kk = Math.log(99) / (DEND - PEAK), DBL = Math.LN2 / kk, S0 = Math.exp(-kk * PEAK) / (1 + Math.exp(-kk * PEAK));
  const raw = d => L.logistic(d, DBL, S0);
  const rho = d => { const s = raw(d); return 4 * s * (1 - s); };           // heat curve, 1 at day 11.5
  const AG = A.solution.aggregation, MED = AG.median, P10 = AG.p10, P90 = AG.p90;
  const SLO = Math.log(MED / P10) / 1.2816, SHI = Math.log(P90 / MED) / 1.2816;
  const zOf = q => { let lo = -8, hi = 8; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; (0.5 * (1 + L.erf(m / Math.SQRT2)) < q) ? lo = m : hi = m; } return (lo + hi) / 2; };
  const hq = q => { const z = zOf(q); return MED * Math.exp(z * (z < 0 ? SLO : SHI)); };
  const AIM = A.ai_counterfactual.aggregation_median, aq = q => hq(q) * AIM / MED;

  // Chat timestamps: 40 messages at quantiles of the cumulative rate r(d) = 0.25 + rho(d), days 0..12.
  const NMSG = 40, CHAT_END = 12, dd = 0.002, CUM = [0];
  for (let d = dd; d <= CHAT_END + 1e-9; d += dd) CUM.push(CUM[CUM.length - 1] + (0.25 + rho(d)) * dd);
  const TOT = CUM[CUM.length - 1];
  const msgDay = i => { const q = (i + 0.5) / NMSG * TOT; let lo = 0, hi = CUM.length - 1; while (lo < hi) { const m = (lo + hi) >> 1; CUM[m] < q ? lo = m + 1 : hi = m; } return lo * dd; };
  const G = 'g', P = 'p';
  const TEXTS = [
    ['Gran', 'morning all x'], ['Joe', 'forecast says it gets worse all week', G], ['Ana', "who's doing Sunday lunch?"], ['Gran', "don't fuss, I have my fan"],
    ['Tom', 'photo', P], ['Leo', 'lol the dog'], ['Rosa', 'too hot to cook tbh'], ['Ana', 'lunch at ours then?'],
    ['Tom', "can't, working"], ['Rosa', 'someone check on Gran?'], ['Maya', 'my friend is a doctor, happy to call her', G], ['Leo', 'she hates being fussed'],
    ['Gran', 'too hot for the garden today'], ['Ana', 'photo', P], ['Tom', 'is anyone near Gran?'], ['Joe', "I'm two hours away"],
    ['Sami', 'our flat is cool, room for one', G], ['Rosa', "Leo's closer?"], ['Leo', 'not really, other side of the river'], ['Ana', "who has her landline number"],
    ['Tom', 'photo', P], ['Gran', 'staying in today. love you all x'], ['Rosa', "see, she's fine"], ['Joe', 'drink water everyone'],
    ['Leo', 'photo', P], ['Ana', "I'll ring her tonight"], ['Tom', 'trains are cancelled'], ['Rosa', 'anyone?'],
    ['Joe', "it's worse tomorrow"], ['Sami', "offer's still open x"], ['Ana', "she's not picking up"], ['Leo', 'she naps'],
    ['Rosa', 'can someone go round'], ['Tom', "I'm stuck at work"], ['Maya', 'my friend says keep her cool'], ['Ana', "who's closest??"],
    ['Joe', 'I can go tomorrow'], ['Rosa', 'does anyone have a key?'], ['Leo', 'on my way to the station'], ['Ana', 'Gran? x'],
  ];
  const wrap = s => { if (s.length <= 28) return [s]; const w = s.split(' '); let a = '', i = 0; while (i < w.length && (a + ' ' + w[i]).trim().length <= 28) { a = (a + ' ' + w[i]).trim(); i++; } return [a, w.slice(i).join(' ')]; };
  const MSGS = TEXTS.map(([who, s, kind], i) => ({ who, kind, lines: kind === P ? [] : wrap(s), day: msgDay(i) }));
  MSGS.forEach(m => { m.h = m.kind === P ? 34 + 150 + 22 : 34 + 24 + 50 * m.lines.length + 22; });
  const WD = ['Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];
  const wd = d => WD[Math.floor(d) % 7];
  const ITEMS = []; let lastDay = -1;
  MSGS.forEach(m => { const dI = Math.floor(m.day); if (dI !== lastDay) { ITEMS.push({ div: true, day: dI, text: wd(dI), h: 86 }); lastDay = dI; } ITEMS.push(m); });

  // The four pieces: who holds them, when posted, when routed to Gran's door (two-sided lognormal quantiles).
  const PIECES = [
    { who: 'Maya', word: 'a doctor friend', post: MSGS[10].day, q: 0.1 },
    { who: 'Joe', word: 'the forecast', post: MSGS[1].day, q: 0.3 },
    { who: 'you', word: 'the spare key', post: 99, q: 0.5 },  // typed day 2.6-3.2, never sent in the race
    { who: 'Sami', word: 'a cooler flat', post: MSGS[16].day, q: 0.9 },
  ];
  PIECES.forEach(p => { p.at = hq(p.q); p.ai = aq(p.q); });   // 9.5 / 10.9 / 12.0 / 305 ; 2.4 / 2.7 / 3.0 / 76
  const GRAN_OUT = PEAK;                                     // "last seen" freezes at the peak (symbolic, see notes)

  // ---------- time ----------
  const T0 = 1.4, T_FREEZE = 15.4, T_SNAP = 18, T_SWEEP = 18.7, SWEEP = 4.5, T_IN2 = 25.5, T_NECK = 28.5, T_END = 31;
  const dayAt = t => t < T0 ? 11.4 : L.clamp(t - T0, 0, 14);

  // ---------- world: a city made of words; nine phones; Gran's door ----------
  const PS = 0.075, ZP = 1 / PS;
  const PH = {
    you: [300, 1330], Joe: [170, 430], Maya: [585, 1010], Sami: [900, 1180], Leo: [200, 870],
    Ana: [650, 1560], Rosa: [930, 1720], Tom: [440, 270], Gran: [820, 610],
  };
  const DOOR = [760, 640], DW = 36, DH = 64;
  const NAMES = ['Gran', 'Joe', 'Maya', 'Sami', 'Leo', 'Ana', 'Rosa', 'Tom', 'you'];
  const STREETS = [
    ['r i v e r   r i v e r   r i v e r   r i v e r   r i v e r', 40, 1140, -0.32, 34],
    ['ring road   ring road   ring road   ring road', 60, 700, 0.18, 26],
    ['high street   high street   high street', 380, 1900, -1.2, 24],
    ['market', 330, 560, 0, 30], ['school', 760, 900, 0, 26], ['station', 120, 1570, 0, 28], ['park', 820, 1420, 0, 30],
    ['bridge', 470, 1230, -0.32, 24], ['flats', 980, 450, 0, 24], ['bakery', 560, 760, 0, 22], ['bus stop', 680, 1290, 0, 22],
  ];

  // ---------- helpers ----------
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r); };
  const scaleOf = c => { const m = c.getTransform(); return Math.hypot(m.a, m.b); };
  const text = (c, s, x, y, size, col, { font = HAND, align = 'left', alpha = 1 } = {}) => { if (alpha <= 0.001) return; c.save(); c.globalAlpha *= alpha; c.font = `${size}px "${font}"`; c.textAlign = align; c.fillStyle = col; c.fillText(s, x, y); c.restore(); };
  const typed = (s, f) => s.slice(0, Math.floor(L.clamp(f, 0, 1) * s.length + 1e-6));
  const DRAFT = "I have Gran's spare key.";

  function phoneBody(c, heat) {
    if (heat > 0.02) { c.save(); c.shadowColor = rgbaR(0.85 * heat); c.shadowBlur = 90 * heat * scaleOf(c); c.fillStyle = '#12151b'; rr(c, -360, -660, 720, 1320, 70); c.fill(); c.restore(); }
    c.fillStyle = '#12151b'; rr(c, -360, -660, 720, 1320, 70); c.fill(); c.strokeStyle = '#5b606a'; c.lineWidth = 6; c.stroke();
    c.fillStyle = '#161a20'; rr(c, -332, -630, 664, 1260, 50); c.fill();
  }
  // The header is the heat: its red fill is rho(d).
  function header(c, heat, title, sub, granGray) {
    c.save(); rr(c, -332, -630, 664, 170, [50, 50, 0, 0]); c.clip();
    c.fillStyle = '#1d2129'; c.fillRect(-332, -630, 664, 170);
    c.fillStyle = rgbaR(0.92 * heat); c.fillRect(-332, -630, 664, 170);
    c.restore();
    text(c, title, 0, -560, 54, '#fffdf7', { font: SERIF, align: 'center' });
    c.save(); c.font = `27px "${HAND}"`; c.textAlign = 'left';
    const parts = sub; let w = 0; parts.forEach(p => { w += c.measureText(p).width; }); let x = -w / 2;
    parts.forEach((p, i) => { c.fillStyle = (i === 0 && granGray) ? 'rgba(20,22,27,0.9)' : 'rgba(255,253,247,0.8)'; c.fillText(p, x, -505); x += c.measureText(p).width; });
    c.restore();
  }
  const SUB = ['Gran', ', Joe, Maya, Sami, Leo, Ana, Rosa, Tom, you'];

  function msgDraw(c, m, y, a) {
    c.save(); c.globalAlpha *= a;
    const green = m.kind === G;
    text(c, m.who, -290, y + 28, 28, green ? GREEN : GRAY);
    if (m.kind === P) { c.fillStyle = '#232830'; rr(c, -300, y + 40, 280, 150, 24); c.fill(); text(c, 'photo', -160, y + 128, 34, DGRAY, { align: 'center' }); c.restore(); return; }
    let w = 0; c.font = `34px "${HAND}"`; m.lines.forEach(l => { w = Math.max(w, c.measureText(l).width); });
    const bh = 24 + 50 * m.lines.length;
    if (green) { c.save(); c.shadowColor = GREEN; c.shadowBlur = 20 * scaleOf(c); c.strokeStyle = GREEN; c.lineWidth = 3; rr(c, -300, y + 38, w + 48, bh, 26); c.stroke(); c.restore(); }
    c.fillStyle = green ? 'rgba(52,210,123,0.10)' : '#20242c'; rr(c, -300, y + 38, w + 48, bh, 26); c.fill();
    c.strokeStyle = green ? GREEN : '#2e333c'; c.lineWidth = 3; c.stroke();
    m.lines.forEach((l, j) => text(c, l, -276, y + 38 + 48 + j * 50, 34, green ? GREEN : INK));
    c.restore();
  }

  // Your phone during the race (and the cold open): the chat as of `day`.
  function youPhone(c, day, t) {
    const heat = rho(day);
    phoneBody(c, heat);
    header(c, heat, 'Family', SUB, day >= GRAN_OUT);
    c.save(); rr(c, -332, -460, 664, 955, 0); c.clip();
    let y = 490;
    for (let i = ITEMS.length - 1; i >= 0; i--) {
      const it = ITEMS[i]; if (it.day > day) continue;
      const k = L.ease.out(L.clamp((day - it.day) / 0.12, 0, 1));
      y -= it.h * k; if (y + it.h < -470) break;
      if (it.div) { c.save(); c.globalAlpha *= k; c.font = `30px "${HAND}"`; const w = c.measureText(it.text).width + 50; c.fillStyle = '#262b34'; rr(c, -w / 2, y + 16, w, 52, 26); c.fill(); c.restore();
        text(c, it.text, 0, y + 52, 30, GRAY, { align: 'center', alpha: k }); }
      else msgDraw(c, it, y, k);
    }
    c.restore();
    // compose bar: your piece, typed, never sent
    c.fillStyle = '#20252e'; rr(c, -310, 515, 540, 84, 42); c.fill();
    c.strokeStyle = '#3a3f48'; c.lineWidth = 3; c.beginPath(); c.arc(270, 557, 38, 0, 7); c.stroke();
    c.strokeStyle = DGRAY; c.lineWidth = 5; c.beginPath(); c.moveTo(256, 557); c.lineTo(286, 557); c.moveTo(274, 545); c.lineTo(286, 557); c.lineTo(274, 569); c.stroke();
    const draft = day >= 3.2 ? DRAFT : day >= 2.6 ? typed(DRAFT, (day - 2.6) / 0.6) : '';
    if (draft) { c.save(); c.shadowColor = GREEN; c.shadowBlur = 16 * scaleOf(c); text(c, draft + ((t * 2) % 1 < 0.5 ? '|' : ''), -278, 570, 36, GREEN); c.restore(); }
    else text(c, 'Message', -278, 570, 34, DGRAY);
  }

  // Your phone in the illustrative day-3 counterfactual: the same pieces, pinned together.
  function youPhoneAI(c, t) {
    const day = 3, heat = rho(day);
    phoneBody(c, heat);
    header(c, heat, 'Family', SUB, false);
    const k1 = L.ease.out(L.clamp((t - T_IN2 - 0.3) / 0.4, 0, 1)), k2 = L.ease.out(L.clamp((t - T_IN2 - 1.1) / 0.3, 0, 1)), k3 = L.ease.out(L.clamp((t - T_IN2 - 1.8) / 0.3, 0, 1));
    text(c, 'Monday', 0, -380, 32, GRAY, { align: 'center' });
    // neutral routing note (frontier AI is gray: it connects, it does not decide)
    c.save(); c.globalAlpha *= k1; c.translate(0, (1 - k1) * 60);
    c.fillStyle = '#1c2027'; rr(c, -310, -340, 620, 440, 30); c.fill(); c.strokeStyle = '#c9c6bd'; c.lineWidth = 3; c.setLineDash([12, 10]); c.stroke(); c.setLineDash([]);
    text(c, 'suggested by frontier AI', -280, -290, 30, '#c9c6bd');
    [['the forecast', 'Joe'], ['a doctor friend', 'Maya'], ['a cooler flat', 'Sami'], ['the spare key', 'you']].forEach(([w, who], j) => {
      const yy = -225 + j * 72; c.save(); c.shadowColor = GREEN; c.shadowBlur = 14 * scaleOf(c); text(c, w, -280, yy, 40, GREEN); c.restore(); text(c, who, 280, yy, 32, GRAY, { align: 'right' }); });
    text(c, 'you decide', -280, 70, 30, '#c9c6bd');
    c.restore();
    // your key, sent
    c.save(); c.globalAlpha *= k2; c.translate(0, (1 - k2) * 50);
    c.fillStyle = '#14201a'; rr(c, -70, 130, 380, 90, 28); c.fill(); c.save(); c.shadowColor = GREEN; c.shadowBlur = 20 * scaleOf(c); c.strokeStyle = GREEN; c.lineWidth = 3; rr(c, -70, 130, 380, 90, 28); c.stroke(); c.restore();
    c.strokeStyle = GREEN; c.lineWidth = 3; rr(c, -70, 130, 380, 90, 28); c.stroke();
    text(c, "Going now. I've got the key.", 290, 188, 30, GREEN, { align: 'right' });
    c.restore();
    c.save(); c.globalAlpha *= k3; c.translate(0, (1 - k3) * 50);
    text(c, 'Gran', -290, 268, 28, GRAY); c.fillStyle = '#20242c'; rr(c, -300, 280, 330, 76, 26); c.fill();
    text(c, 'see you soon, love x', -276, 330, 34, INK);
    c.restore();
    c.fillStyle = '#20252e'; rr(c, -310, 515, 540, 84, 42); c.fill(); text(c, 'Message', -278, 570, 34, DGRAY);
  }

  // Other phones: seen from far, just their heat header and gray lines of chat.
  function miniPhone(c, name, day) {
    const heat = rho(day); phoneBody(c, heat);
    const gran = name === 'Gran', out = gran && day >= GRAN_OUT;
    c.save(); rr(c, -332, -630, 664, 170, [50, 50, 0, 0]); c.clip(); c.fillStyle = rgbaR(0.92 * heat); c.fillRect(-332, -630, 664, 170); c.restore();
    const n = MSGS.filter(m => m.day <= day).length;
    for (let j = 0; j < 7; j++) { const idx = n - 7 + j; if (idx < 0) continue; const m = MSGS[idx];
      c.fillStyle = m.kind === G ? GREEN : '#2e333c'; rr(c, -290, -400 + j * 140, 200 + (idx * 97) % 300, 90, 30); c.fill(); }
    if (out) { c.fillStyle = 'rgba(11,13,17,0.75)'; rr(c, -360, -660, 720, 1320, 70); c.fill(); }
  }

  // Gran's door: type on a plain frame. Pieces that reach it appear on it as green words.
  function door(c, day, z) {
    const x = DOOR[0] - DW / 2, y = DOOR[1] - DH / 2, out = day >= GRAN_OUT;
    c.fillStyle = '#15181e'; c.fillRect(x - 3, y - 3, DW + 6, DH + 3);
    c.fillStyle = '#1b1f26'; c.fillRect(x, y, DW, DH);
    c.strokeStyle = '#6b7079'; c.lineWidth = 0.5; c.strokeRect(x, y, DW, DH); c.strokeRect(x + 3, y + 3, DW - 6, DH - 6);
    // nameplate
    const nameCol = out ? '#3a3f48' : INK;
    c.strokeStyle = out ? '#2c3038' : '#6b7079'; c.lineWidth = 0.3; c.strokeRect(DOOR[0] - 8, y + 6.5, 16, 6);
    text(c, 'Gran', DOOR[0], y + 11.6, 4.2, nameCol, { font: SERIF, align: 'center' });
    // knob
    c.fillStyle = '#6b7079'; c.beginPath(); c.arc(x + DW - 5, DOOR[1] + 6, 1.3, 0, 7); c.fill();
    // pieces on the door
    const slots = [-6.5, -0.5, 5.5, 11.5];
    PIECES.forEach((p, j) => { const yy = DOOR[1] + slots[j];
      if (day >= p.at) { const k = L.clamp((day - p.at) / 0.25, 0, 1); c.save(); c.shadowColor = GREEN; c.shadowBlur = 14 * k * scaleOf(c) / 3; text(c, p.word, DOOR[0] - 1, yy, 2.9, GREEN, { font: HAND, align: 'center', alpha: k }); c.restore(); }
      else { c.save(); c.setLineDash([0.8, 0.8]); c.strokeStyle = '#2f343d'; c.lineWidth = 0.2; c.strokeRect(DOOR[0] - 13, yy - 2.9, 24, 4); c.restore(); } });
    // status line above the door: stops updating at the peak
    const st = out ? 'Gran  ·  last seen ' + wd(GRAN_OUT) : 'Gran  ·  last seen today';
    text(c, st, DOOR[0], y - 5, 3.1, out ? '#4a4f58' : GRAY, { align: 'center', alpha: L.sm(4, 9, z) });
    text(c, 'Gran', DOOR[0], y + DH + 12, 16, out ? '#3a3f48' : GRAY, { font: SERIF, align: 'center', alpha: 1 - L.sm(3, 6, z) });
  }

  function world(c, day, z, t, youMode) {
    // city words
    STREETS.forEach(([s, x, y, rot, size]) => { c.save(); c.translate(x, y); c.rotate(rot); text(c, s, 0, 0, size, '#2a2e36', { font: SERIF }); c.restore(); });
    const lw = px => px / z;
    // the forty messages: gray threads from each sender to everyone else, fading
    MSGS.forEach(m => { if (day < m.day || day > m.day + 0.7) return; const a = 1 - (day - m.day) / 0.7, p = L.clamp((day - m.day) / 0.3, 0, 1);
      const s = PH[m.who]; NAMES.forEach(n => { if (n === m.who) return; const e = PH[n];
        c.strokeStyle = m.kind === G ? rgbaG(0.55 * a) : `rgba(154,160,170,${0.4 * a})`; c.lineWidth = lw(2.5); c.beginPath(); c.moveTo(s[0], s[1]); c.lineTo(L.lerp(s[0], e[0], p), L.lerp(s[1], e[1], p)); c.stroke(); }); });
    // green pieces reaching for the door
    PIECES.forEach((p, j) => { const s = PH[p.who], e = DOOR; let f;
      if (day >= p.at) f = L.lerp(0.55, 1, L.ease.out(L.clamp((day - p.at) / 0.3, 0, 1)));
      else if (day >= p.post) f = 0.18 + 0.3 * (0.5 + 0.5 * Math.sin((day - p.post) * 5.1 + j * 1.7));
      else return;
      c.save(); c.strokeStyle = GREEN; c.shadowColor = GREEN; c.shadowBlur = 12; c.lineWidth = lw(day >= p.at ? 6 : 4); c.lineCap = 'round';
      c.beginPath(); c.moveTo(s[0], s[1]); c.lineTo(L.lerp(s[0], e[0], f), L.lerp(s[1], e[1], f)); c.stroke(); c.restore(); });
    // your unsent piece: a faint green glow that never leaves your phone
    if (day >= 3.2 && day < PIECES[2].at) { c.save(); const g = c.createRadialGradient(PH.you[0], PH.you[1], 0, PH.you[0], PH.you[1], 80); g.addColorStop(0, rgbaG(0.25)); g.addColorStop(1, rgbaG(0)); c.fillStyle = g; c.fillRect(PH.you[0] - 80, PH.you[1] - 80, 160, 160); c.restore(); }
    door(c, day, z);
    // phones
    NAMES.forEach(n => { const p = PH[n]; c.save(); c.translate(p[0], p[1]); c.scale(PS, PS);
      if (n === 'you') { youMode === 'ai' ? youPhoneAI(c, t) : youPhone(c, day, t); } else miniPhone(c, n, day); c.restore();
      if (n !== 'Gran') text(c, n, p[0], p[1] + 70, 18, GRAY, { font: SERIF, align: 'center', alpha: 1 - L.sm(3, 6, z) }); });
    // your shoulder, over the phone (OTS): a silhouette filled with your name
    const sa = L.sm(3, 8, z); if (sa > 0.01) { c.save(); c.globalAlpha *= sa; c.translate(PH.you[0], PH.you[1]); c.scale(PS, PS); shoulder(c); c.restore(); }
  }
  function shoulder(c) {
    const hx = -480, hy = 640;
    c.save(); c.beginPath(); c.arc(hx, hy, 175, 0, 7);
    c.moveTo(-1100, 1400); c.quadraticCurveTo(-1000, 880, -560, 820); c.lineTo(-400, 820); c.quadraticCurveTo(-180, 900, -150, 1400); c.closePath();
    c.fillStyle = '#0d0f14'; c.fill(); c.strokeStyle = '#5b606a'; c.lineWidth = 4; c.stroke(); c.clip();
    c.font = `26px "${SERIF}"`; c.fillStyle = 'rgba(154,160,170,0.35)'; const row = 'you '.repeat(40);
    for (let j = 0; j < 40; j++) c.fillText(row, -1150 - (j * 17) % 60, 440 + j * 26);
    c.restore();
  }

  // ---------- camera (log-zoom keyframes) ----------
  const view = (pt, z, sx, sy) => [pt[0] - (sx - 540) / z, pt[1] - (sy - 960) / z, z];
  const V = {
    cold: view(PH.you, ZP * 1.02, 480, 930), you: view(PH.you, ZP, 480, 930), you2: view(PH.you, ZP * 1.05, 480, 930),
    mid: view([420, 1150], 3.2, 540, 960), city: view([545, 960], 1, 540, 960), city2: view([555, 930], 1.06, 540, 960),
    door: view(DOOR, 17, 490, 1060), door2: view(DOOR, 20, 490, 1060),
    close: view([PH.you[0], PH.you[1] + 150 * PS], ZP * 1.35, 480, 840), close2: view([PH.you[0], PH.you[1] + 150 * PS], ZP * 1.42, 480, 840),
  };
  const CAM = [[0, V.cold], [T0, V.cold], [T0 + 0.0001, V.you], [6.0, V.you2], [9.0, V.city], [10.5, V.city2], [13.4, V.door], [T_FREEZE, V.door2]];
  const CAM2 = [[T_IN2, V.close], [T_END, V.close2]];
  const camAt = (keys, t) => {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 0; i < keys.length - 1; i++) { const [ta, a] = keys[i], [tb, b] = keys[i + 1];
      if (t <= tb) { const f = L.ease.inOut((t - ta) / (tb - ta)); const z = Math.exp(L.lerp(Math.log(a[2]), Math.log(b[2]), f));
        const w = Math.abs(a[2] - b[2]) < 1e-6 ? f : (1 / z - 1 / a[2]) / (1 / b[2] - 1 / a[2]);
        return [L.lerp(a[0], b[0], w), L.lerp(a[1], b[1], w), z]; } }
    return keys[keys.length - 1][1];
  };

  // ---------- cards ----------
  function card(c, lines, y, size, a, { col = '#fffdf7' } = {}) {
    if (a <= 0.001) return;
    const g = c.createLinearGradient(0, y - size * 1.6 - 60, 0, y + size * (lines.length - 1) + 80);
    g.addColorStop(0, 'rgba(11,13,17,0)'); g.addColorStop(0.5, `rgba(11,13,17,${0.82 * a})`); g.addColorStop(1, 'rgba(11,13,17,0)');
    c.fillStyle = g; c.fillRect(0, y - size * 1.6 - 60, 1080, size * (lines.length + 1.6) + 140);
    c.save(); c.globalAlpha = a; c.textAlign = 'center'; let yy = y;
    lines.forEach((l, i) => { let fz = size; c.font = `${fz}px "${SERIF}"`; while (c.measureText(l).width > 780 && fz > 30) { fz -= 4; c.font = `${fz}px "${SERIF}"`; }
      if (i) yy += size * 1.06; c.lineJoin = 'round'; c.lineWidth = fz * 0.14; c.strokeStyle = '#0b0d11'; c.strokeText(l, 490, yy); c.fillStyle = col; c.fillText(l, 490, yy); });
    c.restore();
  }
  const CARDS = [
    [0, T0, ['POV: you have', 'the missing piece.'], 1180, 96, true],
    [1.9, 3.7, ['Nine people.', 'Forty messages.'], 1180, 100],
    [3.9, 5.7, ['No plan.'], 1240, 120],
    [7.0, 9.2, ['Every piece is', 'already here.'], 1300, 100],
    [10.7, 12.6, ['Everyone means well.'], 1400, 96],
    [13.6, T_FREEZE, ['Day 12.', 'After the peak.'], 1370, 104],
    [T_IN2 + 0.7, T_NECK, ['Not them.', 'The routing.'], 1330, 104],
  ];
  const drawCards = (c, t) => CARDS.forEach(([a, b, lines, y, size, hard]) => { if (t < a || t >= b) return;
    const al = Math.min(hard ? 1 : L.clamp((t - a) / 0.2, 0, 1), L.clamp((b - t) / 0.2, 0, 1)); card(c, lines, y, size, al); });
  const chip = (c, s, a) => { if (a <= 0.01) return; c.save(); c.globalAlpha = a; c.font = `46px "${HAND}"`; const w = c.measureText(s).width + 50;
    c.fillStyle = 'rgba(11,13,17,0.78)'; rr(c, 80, 222, w, 72, 20); c.fill(); c.fillStyle = INK; c.fillText(s, 105, 274); c.restore(); };

  // ---------- snap ----------
  function lane(c, y0, title, sub, arrivals, mark, dp, a) {
    c.save(); c.globalAlpha = a;
    c.strokeStyle = '#3a3f48'; c.lineWidth = 3; rr(c, 80, y0, 920, 500, 26); c.stroke();
    text(c, title, 120, y0 + 68, 52, INK);
    if (sub) text(c, sub, 120, y0 + 126, 48, GRAY);
    const X0 = 130, X1 = 890, base = y0 + 430, HH = 210, xs = d => X0 + (X1 - X0) * d / DEND;
    c.strokeStyle = '#5d636d'; c.lineWidth = 2; c.beginPath(); c.moveTo(X0, base); c.lineTo(X1, base); c.stroke();
    // the heat: identical in both lanes
    c.beginPath(); c.moveTo(X0, base); const n = 150; for (let i = 0; i <= n; i++) { const d = dp * i / n; c.lineTo(xs(d), base - HH * rho(d)); } c.lineTo(xs(dp), base); c.closePath();
    c.fillStyle = rgbaR(0.85); c.fill();
    if (dp >= PEAK) text(c, 'peak', xs(PEAK), base - HH - 14, 44, GRAY, { align: 'center', alpha: L.clamp((dp - PEAK) / 1.5, 0, 1) });
    // the pieces arriving at the door
    arrivals.forEach((d, j) => { if (d > dp) return; const x = xs(d), main = j === 2;
      c.save(); c.strokeStyle = GREEN; c.shadowColor = GREEN; c.shadowBlur = main ? 18 : 8; c.lineWidth = main ? 8 : 4;
      c.beginPath(); c.moveTo(x, base + 30); c.lineTo(x, base - HH - (main ? 60 : 20)); c.stroke(); c.restore(); });
    if (dp >= arrivals[2]) text(c, mark, 900, y0 + 90, 80, GREEN, { font: SERIF, align: 'right', alpha: L.clamp((dp - arrivals[2]) / 1.2, 0, 1) });
    c.strokeStyle = INK; c.lineWidth = 3; c.beginPath(); c.moveTo(xs(dp), base - HH - 30); c.lineTo(xs(dp), base + 12); c.stroke();
    c.restore();
  }
  function snap(c, t) {
    c.fillStyle = BG; c.fillRect(0, 0, 1080, 1920);
    const a = L.clamp((t - T_SNAP) / 0.3, 0, 1), dp = L.clamp((t - T_SWEEP) / SWEEP * DEND, 0, DEND);
    L.title(c, ['Same clock, sped up.'], 290, 72, { alpha: a, col: GRAY });
    lane(c, 350, "How it's routed now", null, PIECES.map(p => p.at), 'day 12', dp, a);
    lane(c, 900, 'Routed with frontier AI', 'illustrative', PIECES.map(p => p.ai), 'day 3', dp, L.clamp((t - T_SNAP - 0.3) / 0.3, 0, 1));
    card(c, ['People still decide who goes.'], 1480, 60, L.clamp((t - 22.4) / 0.4, 0, 1), { col: INK });
    L.slate(c, 'SC8  FLAT  SNAP (days 0-19 in 4.5 s, both lanes)');
  }

  // ---------- draw ----------
  function scene(c, t, keys, day, mode) {
    const cam = camAt(keys, t), z = cam[2];
    // the heat haze over the city (behind everything; only once we leave the phone)
    const hz = rho(day) * L.clamp(1 - L.sm(6, 11, z), 0, 1) * (mode === 'ai' ? 0 : 1);
    if (hz > 0.005) { const g = c.createRadialGradient(560, 900, 100, 560, 900, 1200); g.addColorStop(0, rgbaR(0.28 * hz)); g.addColorStop(1, rgbaR(0.06 * hz)); c.fillStyle = g; c.fillRect(0, 0, 1080, 1920); }
    c.save(); L.camera(c, [[0, [cam[0], cam[1], cam[2], 0]]], 0); world(c, day, z, t, mode); c.restore();
    return z;
  }
  function draw(c, t) {
    c.fillStyle = BG; c.fillRect(0, 0, 1080, 1920);
    if (t >= T_END) { L.endCard(c, L.clamp((t - T_END) / 0.4, 0, 1)); return; }
    if (t >= T_SNAP && t < T_IN2) { snap(c, t); L.grain(c, t, { alpha: 0.04 }); return; }
    if (t >= T_IN2) {
      scene(c, t, CAM2, 3, 'ai');
      if (t >= T_NECK) { const a = L.clamp((t - T_NECK) / 0.4, 0, 1); c.fillStyle = `rgba(11,13,17,${0.78 * a})`; c.fillRect(0, 0, 1080, 1920); L.title(c, ['This is the bottleneck.'], 960, 96, { alpha: a }); }
      drawCards(c, t);
      if (t < T_NECK) { c.save(); c.font = `46px "${HAND}"`; c.fillStyle = 'rgba(11,13,17,0.85)'; rr(c, 600, 1150, 290, 72, 20); c.fill(); c.strokeStyle = '#c9c6bd'; c.lineWidth = 2; c.stroke(); c.fillStyle = INK; c.fillText('illustrative', 625, 1202); c.restore(); }
      L.slate(c, t < T_NECK ? 'SC9  OTS CLOSEST  (day 3, illustrative)' : 'SC10  HOLD');
      L.grain(c, t, { alpha: 0.04 }); return;
    }
    const frozen = t >= T_FREEZE, tw = frozen ? T_FREEZE - 0.001 : t, day = dayAt(tw);
    const z = scene(c, tw, CAM, day, 'race');
    chip(c, wd(day), (t >= T0 ? 1 : 0) * (1 - L.sm(6, 9, z)) * (frozen ? 0 : 1));
    if (frozen) { const a = L.clamp((t - T_FREEZE) / 0.4, 0, 1); c.fillStyle = `rgba(11,13,17,${0.75 * a})`; c.fillRect(0, 0, 1080, 1920);
      L.title(c, ['We slowed it down', 'so you could see it.'], 880, 92, { alpha: a }); }
    drawCards(c, t);
    const sl = t < T0 ? 'SC1  OTS CLOSE  COLD OPEN (Tuesday)' : t < 6 ? 'SC2  OVER THE SHOULDER' : t < 9 ? 'SC3  DOLLY OUT  nine phones' : t < 10.5 ? 'SC4  WIDE' :
      t < 13.4 ? "SC5  DOLLY IN  Gran's door" : t < T_FREEZE ? 'SC6  CLOSEST' : 'SC7  FREEZE';
    L.slate(c, sl);
    L.grain(c, t, { alpha: 0.04 });
  }

  const cues = [{ t: T0, type: 'whoosh' }, { t: T0 + MSGS[1].day, type: 'ding' }, { t: T0 + 2.6, type: 'pop' }, { t: 6.0, type: 'whoosh' },
    { t: T0 + MSGS[10].day, type: 'ding' }, { t: T0 + MSGS[16].day, type: 'ding' }, { t: 10.5, type: 'whoosh' },
    { t: T0 + PIECES[0].at, type: 'pop' }, { t: T0 + PIECES[1].at, type: 'pop' }, { t: T0 + PIECES[2].at, type: 'ding' },
    { t: T_SNAP, type: 'hit' }, { t: T_IN2 + 1.1, type: 'pop' }, { t: T_NECK, type: 'stamp' }];
  return {
    draw, DUR, cues,
    acts: [{ start: 0, end: T0, bpm: 0, drone: true }, { start: T0, end: T_FREEZE, bpm: 132, drone: true }, { start: T_FREEZE, end: T_SNAP, bpm: 0, drone: false },
      { start: T_SNAP, end: T_IN2, bpm: 0, drone: true }, { start: T_IN2, end: T_END, bpm: 60, drone: true }, { start: T_END, end: DUR, bpm: 0, drone: true }],
  };
}
module.exports = makeScene;
