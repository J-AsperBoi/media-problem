// The Committee in My Head: countdown-list, bean cartoon, mind scale. Analog false-news-2018.
// Red: L.logistic fitted through the sourced endpoints (1 person at 0 h, 99% of 1,500 at 10 h): doubling 0.58 h (same fit as the-fact-check).
// Green from outside: Hoaxy fact-check lag, lognormal median 13 h, p90 20 h. AI lane: ai_counterfactual median 1 h (illustrative).
// Race mapping: 1 s = 45 min, clock stopped during the three countdown slams. Snap: 1 s = 5 h.
const { createCanvas } = require('@napi-rs/canvas');
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('false-news-2018');
  const DUR = 41;
  const RED = L.RED, GREEN = L.GREEN, BG = '#12151b', WALL = '#20252e', SKIN = '#7d838d', GRAY = '#9aa0aa', LG = '#c9c4b8', DG = '#3a3f4a', INK = '#1b1f27', PAPER = '#fffdf7';
  // ---- speed math ----
  const S0 = 1 / 1500, R = Math.log(99 * 1499) / 10, DBL = Math.LN2 / R, DBL_TRUE = DBL * 6;
  const share = h => h <= 0 ? 0 : L.logistic(h, DBL, S0);
  const invShare = (p, r = R) => Math.log((p / (1 - p)) * (1 - S0) / S0) / r;
  const H_MED = A.solution.aggregation.median, H_P90 = A.solution.aggregation.p90; // 13, 20
  const AI_MED = A.ai_counterfactual.aggregation_median; // 1
  const RATE = 0.75, T0 = 2.4, T_END_RACE = 21.6, STOPS = [[5.0, 5.6], [9.0, 9.6], [17.4, 18.0]];
  function hAt(t) {
    if (t < 1.4) return 11; // cold open: flash-forward, same timeline
    if (t < T0) return -1;
    const tt = Math.min(t, T_END_RACE); let run = tt - T0;
    STOPS.forEach(([a, b]) => { run -= L.clamp(tt - a, 0, b - a); });
    return Math.min(13.0, run * RATE);
  }
  // film time at which h = 13 (correction lands), solved numerically
  let T_CORR = T0; while (hAt(T_CORR) < H_MED - 1e-6 && T_CORR < T_END_RACE) T_CORR += 1 / 300;
  const NV = 9, voteH = Array.from({ length: NV }, (_, k) => invShare((k + 0.5) / NV));
  const ORDER = [4, 3, 5, 6, 2, 7, 1, 0, 8]; // which seat turns in which rank (chair first: it reads the eyes)
  const seatRedH = new Array(NV); ORDER.forEach((seat, k) => seatRedH[seat] = voteH[k]);
  seatRedH[4] = voteH[0];

  // ---- helpers ----
  const rr = (c, x, y, w, h, r) => { c.beginPath(); c.roundRect(x, y, w, h, r); };
  function card(c, text, y, size, a, { col = PAPER, x = 490, maxW = 790, font = SERIF } = {}) {
    if (a <= 0) return; c.save(); c.globalAlpha = a; c.font = `${size}px "${font}"`; let fz = size; while (c.measureText(text).width > maxW && fz > 30) { fz -= 2; c.font = `${fz}px "${font}"`; }
    c.textAlign = 'center'; c.lineJoin = 'round'; c.lineWidth = fz * 0.14; c.strokeStyle = '#0a0c10'; c.strokeText(text, x, y); c.fillStyle = col; c.fillText(text, x, y); c.restore(); }
  const win = (t, a, b, f = 0.3) => Math.min(L.sm(a, a + f, t), 1 - L.sm(b - f, b, t));
  function glow(c, x, y, r, col = GREEN, a = 1) { c.save(); c.globalAlpha = a * 0.22; c.fillStyle = col; c.beginPath(); c.arc(x, y, r * 2.4, 0, 7); c.fill(); c.globalAlpha = a * 0.35; c.beginPath(); c.arc(x, y, r * 1.5, 0, 7); c.fill(); c.globalAlpha = a; c.beginPath(); c.arc(x, y, r, 0, 7); c.fill(); c.restore(); }

  // Bean (from example_follow_the_green.js), plus 'angry' and 'asleep' moods and a raised-arm option.
  function bean(c, x, y, s, o) {
    const bw = 46 * s, bh = 60 * s, col = o.col || '#ebe5d8', mood = o.mood || 'happy', t = o.t || 0; c.save();
    if (o.arms) { c.strokeStyle = col; c.lineWidth = 7 * s; c.lineCap = 'round'; const wv = o.wave || 0;
      [-1, 1].forEach(sd => { const ax = x + sd * bw * 0.42, ay = y + bh * 0.02; let ang = Math.PI / 2 + sd * (0.2 + 0.2 * Math.sin(wv));
        if (o.raise === sd) ang = -Math.PI / 2 + sd * (0.35 + 0.25 * Math.sin(wv)); if (o.hold === sd) ang = sd > 0 ? -0.35 : Math.PI + 0.35;
        c.beginPath(); c.moveTo(ax, ay); c.lineTo(ax + Math.cos(ang) * bw * 0.55, ay + Math.sin(ang) * bw * 0.55); c.stroke(); }); }
    c.fillStyle = col; rr(c, x - bw / 2, y - bh / 2, bw, bh, bw / 2); c.fill();
    const ey = y - bh * 0.14, er = bw * (mood === 'panic' ? 0.17 : 0.14), lk = o.look || [0, 0];
    [-1, 1].forEach(sd => { const ex = x + sd * bw * 0.19;
      if (mood === 'asleep') { c.strokeStyle = INK; c.lineWidth = 2.5 * s; c.beginPath(); c.arc(ex, ey, er * 0.8, 0.15 * Math.PI, 0.85 * Math.PI); c.stroke(); return; }
      c.fillStyle = PAPER; c.beginPath(); c.arc(ex, ey, er, 0, 6.283); c.fill(); c.strokeStyle = INK; c.lineWidth = 1.6 * s; c.stroke();
      c.fillStyle = INK; c.beginPath(); c.arc(ex + lk[0] * er * 0.4, ey + lk[1] * er * 0.4, er * (mood === 'panic' ? 0.38 : 0.5), 0, 6.283); c.fill();
      if (mood === 'panic') { c.strokeStyle = INK; c.lineWidth = 3 * s; c.beginPath(); c.moveTo(ex - er, ey - er * 1.6 + sd * er * 0.3); c.lineTo(ex + er, ey - er * 1.6 - sd * er * 0.3); c.stroke(); }
      if (mood === 'angry') { c.strokeStyle = INK; c.lineWidth = 3.4 * s; c.beginPath(); c.moveTo(ex - sd * er * 1.2, ey - er * 1.7); c.lineTo(ex + sd * er * 0.9, ey - er * 1.0); c.stroke(); }
      if (mood === 'sad') { c.strokeStyle = INK; c.lineWidth = 3 * s; c.beginPath(); c.moveTo(ex - sd * er * 1.1, ey - er * 1.1); c.lineTo(ex + sd * er * 0.9, ey - er * 1.6); c.stroke(); } });
    const my = y + bh * 0.14; c.strokeStyle = INK; c.fillStyle = INK; c.lineWidth = 3 * s; c.lineCap = 'round';
    if (mood === 'panic') { c.beginPath(); c.ellipse(x, my + bh * 0.03, bw * 0.1, bw * 0.13, 0, 0, 6.283); c.fill(); }
    else if (mood === 'angry') { c.beginPath(); c.moveTo(x - bw * 0.14, my + bw * 0.05); c.quadraticCurveTo(x, my - bw * 0.06, x + bw * 0.14, my + bw * 0.05); c.stroke(); }
    else if (mood === 'sad') { c.beginPath(); c.arc(x, my + bw * 0.1, bw * 0.12, 1.15 * Math.PI, 1.85 * Math.PI); c.stroke(); }
    else if (mood === 'flat' || mood === 'asleep') { c.beginPath(); c.moveTo(x - bw * 0.1, my); c.lineTo(x + bw * 0.1, my); c.stroke(); }
    else { c.beginPath(); c.arc(x, my - bw * 0.04, bw * 0.14, 0.15 * Math.PI, 0.85 * Math.PI); c.stroke(); }
    c.restore(); return { hands: [[x - bw * 0.42 - bw * 0.5, y - bh * 0.18], [x + bw * 0.42 + bw * 0.5, y - bh * 0.18]], top: y - bh / 2 }; }

  // ---- the room inside the skull (world coords; room centre 540,980) ----
  const SK = { x: 540, y: 980, rx: 500, ry: 660 }, HEAD = { rx: 545, ry: 710 };
  const seats = Array.from({ length: NV }, (_, k) => ({ x: 250 + k * 72.5, y: 965 }));
  const MEM = { x: 300, y: 1330 }, FRI = { x: 790, y: 1330 }, DOUBT = { x: 470, y: 1455 };
  const T_GAVEL = 20.2;
  function drawRoom(c, t, h, { xray = false } = {}) {
    const redShare = share(h);
    // head exterior + skull interior
    c.fillStyle = SKIN; c.beginPath(); c.ellipse(SK.x, SK.y + 20, HEAD.rx, HEAD.ry, 0, 0, 7); c.fill();
    c.fillStyle = WALL; c.beginPath(); c.ellipse(SK.x, SK.y, SK.rx, SK.ry, 0, 0, 7); c.fill();
    c.save(); c.beginPath(); c.ellipse(SK.x, SK.y, SK.rx, SK.ry, 0, 0, 7); c.clip();
    c.fillStyle = '#1a1e26'; c.fillRect(0, 1200, 1080, 600); // floor
    c.strokeStyle = '#2b313c'; c.lineWidth = 3; for (let i = 0; i < 9; i++) { c.beginPath(); c.moveTo(540 + (i - 4) * 60, 1200); c.lineTo(540 + (i - 4) * 260, 1700); c.stroke(); }
    // eye windows: they show the phone
    [[380, 610], [700, 610]].forEach(([ex, ey]) => { c.save(); c.beginPath(); c.ellipse(ex, ey, 125, 98, 0, 0, 7); c.fillStyle = '#2d333e'; c.fill(); c.clip();
      for (let k = 0; k < 4; k++) { c.fillStyle = '#3c434f'; rr(c, ex - 90, ey - 90 + k * 50 - ((t * 20) % 50), 180, 38, 8); c.fill(); }
      if (h >= 0) { const a = 0.55 + 0.45 * redShare; c.globalAlpha = a; c.fillStyle = RED; rr(c, ex - 95, ey - 60, 190, 80, 10); c.fill(); c.globalAlpha = 1; c.fillStyle = 'rgba(255,255,255,0.35)'; c.fillRect(ex - 75, ey - 40, 110, 10); c.fillRect(ex - 75, ey - 20, 80, 10); }
      if (h >= H_MED) { c.globalAlpha = L.sm(0, 0.3, t - T_CORR) || (t > 27 ? 1 : 0); c.fillStyle = GREEN; rr(c, ex - 95, ey + 30, 190, 55, 10); c.fill(); c.globalAlpha = 1; }
      c.restore(); c.strokeStyle = '#59606c'; c.lineWidth = 8; c.beginPath(); c.ellipse(ex, ey, 125, 98, 0, 0, 7); c.stroke(); });
    // red spill light from the eyes onto the room = attention
    if (h > 0) { c.save(); c.globalAlpha = 0.10 + 0.14 * redShare; c.fillStyle = RED; c.beginPath(); c.moveTo(250, 640); c.lineTo(830, 640); c.lineTo(1000, 1250); c.lineTo(80, 1250); c.fill(); c.restore(); }
    // wall clock (no numerals): one turn = 12 h
    c.strokeStyle = '#6a717d'; c.lineWidth = 5; c.beginPath(); c.arc(540, 440, 48, 0, 7); c.stroke(); for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; c.beginPath(); c.moveTo(540 + Math.cos(a) * 38, 440 + Math.sin(a) * 38); c.lineTo(540 + Math.cos(a) * 44, 440 + Math.sin(a) * 44); c.stroke(); }
    { const a = Math.max(0, h) / 12 * 6.283 - Math.PI / 2; c.lineWidth = 6; c.beginPath(); c.moveTo(540, 440); c.lineTo(540 + Math.cos(a) * 34, 440 + Math.sin(a) * 34); c.stroke(); }
    // agenda easel
    c.fillStyle = '#d8d4ca'; rr(c, 95, 700, 150, 170, 6); c.fill(); c.strokeStyle = '#6a717d'; c.lineWidth = 5; c.beginPath(); c.moveTo(120, 870); c.lineTo(105, 960); c.moveTo(220, 870); c.lineTo(235, 960); c.stroke();
    c.fillStyle = '#3a3f4a'; c.textAlign = 'left'; c.font = `28px "${HAND}"`; c.fillText('AGENDA', 110, 740); c.font = `26px "${HAND}"`; c.fillText('1. React', 110, 790); c.fillText('2. React', 110, 830);
    // tally bar = share(h)
    c.fillStyle = '#2d333e'; rr(c, 290, 745, 500, 34, 12); c.fill(); if (redShare > 0) { c.fillStyle = RED; rr(c, 290, 745, Math.max(24, 500 * redShare), 34, 12); c.fill(); }
    // voters
    const gav = L.sm(T_GAVEL - 0.25, T_GAVEL, t) - L.sm(T_GAVEL, T_GAVEL + 0.15, t);
    seats.forEach((st, k) => { const isRed = h >= seatRedH[k]; const bob = Math.sin(t * 3 + k) * 3;
      let mood = isRed ? 'panic' : 'happy', look = [0, -1];
      if (!isRed && k === 1) mood = 'asleep'; if (k === 4 && !isRed) mood = 'flat';
      const b = bean(c, st.x, st.y + bob, 1.15, { col: GRAY, mood, look, arms: true, raise: isRed ? 1 : 0, wave: t * 2 + k, t });
      if (isRed) { const hx = b.hands[1][0] - 6, hy = b.hands[1][1] - 28; c.strokeStyle = '#6a717d'; c.lineWidth = 4; c.beginPath(); c.moveTo(hx, hy + 30); c.lineTo(hx, hy - 20); c.stroke(); c.fillStyle = RED; rr(c, hx - 20, hy - 50, 40, 32, 5); c.fill(); }
      if (k === 1 && !isRed) { c.fillStyle = LG; c.font = `${26 + 6 * ((t * 0.8) % 1)}px "${HAND}"`; c.globalAlpha = 1 - ((t * 0.8) % 1); c.fillText('z', st.x + 20 + 20 * ((t * 0.8) % 1), st.y - 50 - 40 * ((t * 0.8) % 1)); c.globalAlpha = 1; }
      if (k === 7 && !isRed) { c.strokeStyle = '#b8b0a0'; c.lineWidth = 7; c.beginPath(); c.arc(st.x - 34, st.y - 10 + Math.sin(t * 5) * 6, 11, 0, 7); c.stroke(); }
    });
    // chair's gavel
    { const gx = seats[4].x + 40, gy = 1000 - 40 * (1 - gav); c.save(); c.translate(gx, gy); c.rotate(-0.9 * (1 - gav)); c.fillStyle = '#8a7f6a'; c.fillRect(-4, -40, 8, 44); c.fillRect(-18, -52, 36, 18); c.restore(); }
    // dais table
    c.fillStyle = DG; rr(c, 190, 1000, 700, 90, 10); c.fill(); c.fillStyle = '#2e333d'; c.fillRect(200, 1090, 20, 110); c.fillRect(860, 1090, 20, 110);
    // filing cabinet
    c.fillStyle = '#3f4550'; rr(c, 120, 1190, 120, 230, 6); c.fill(); c.strokeStyle = '#59606c'; c.lineWidth = 4; for (let i = 0; i < 3; i++) { c.strokeRect(132, 1204 + i * 72, 96, 60); c.fillStyle = '#6a717d'; c.fillRect(165, 1228 + i * 72, 30, 8); }
    // phone table
    c.fillStyle = '#3f4550'; rr(c, 850, 1320, 100, 18, 4); c.fill(); c.fillRect(890, 1338, 14, 90); c.fillStyle = '#5a616d'; rr(c, 862, 1286, 76, 36, 12); c.fill(); c.fillStyle = '#6a717d'; rr(c, 856, 1270, 88, 18, 9); c.fill();
    // the three pieces
    const lineBreak = (x1, y1, x2, y2, grow, broken) => { const n = 14; for (let i = 0; i < n; i++) { const f0 = i / n, f1 = (i + 0.6) / n; if (f1 > grow) break;
      if (broken > 0 && f0 > 0.45 && f0 < 0.45 + 0.5 * broken) continue; c.strokeStyle = broken > 0.5 ? '#59606c' : GREEN; c.lineWidth = 6; c.beginPath(); c.moveTo(L.lerp(x1, x2, f0), L.lerp(y1, y2, f0)); c.lineTo(L.lerp(x1, x2, f1), L.lerp(y1, y2, f1)); c.stroke(); } };
    // #3 memory: its line to the chair grows then breaks (the chair is looking at the eyes)
    if (t > 5.8 && t < 34) lineBreak(MEM.x + 40, MEM.y - 70, seats[4].x, seats[4].y + 20, L.sm(5.8, 7.2, t), L.sm(7.6, 8.4, t));
    const memB = bean(c, MEM.x, MEM.y, 1.35, { col: GRAY, mood: t > 7.8 ? 'sad' : 'happy', look: [0.6, -1], arms: true, raise: 1, wave: t * 6, t });
    glow(c, memB.hands[1][0] - 6, memB.hands[1][1] - 20, 17);
    // #2 friend who'd know: a line out through the skull wall to the right
    if (t > 10 && t < 34) { const on = L.sm(10, 10.8, t); c.save(); c.setLineDash([16, 14]); c.lineDashOffset = -t * 60; c.strokeStyle = GREEN; c.lineWidth = 5; c.globalAlpha = on * (0.55 + 0.45 * Math.sin(t * 9)) * (1 - 0.8 * L.sm(13.6, 14.4, t)); c.beginPath(); c.moveTo(FRI.x + 50, FRI.y - 70); c.quadraticCurveTo(980, 1100, 1100, 980); c.stroke(); c.restore(); }
    const friB = bean(c, FRI.x, FRI.y, 1.35, { col: GRAY, mood: t > 14.4 ? 'sad' : 'happy', look: [0.8, -0.3], arms: true, raise: 1, wave: t * 5 + 1, t });
    glow(c, friB.hands[1][0] - 6, friB.hands[1][1] - 20, 17);
    // #1 doubt: the smallest self
    const angry = t > 18.0 && t < 21.6, jump = angry ? Math.abs(Math.sin(t * 7)) * 16 : 0;
    const dB = bean(c, DOUBT.x, DOUBT.y - jump, 1.0, { col: GRAY, mood: t >= 21.6 ? 'sad' : (angry ? 'angry' : 'flat'), look: [0.3, -1], arms: true, raise: 1, wave: t * (angry ? 9 : 2), t });
    { const gx = dB.hands[1][0] - 4, gy = dB.hands[1][1] - 16; glow(c, gx, gy, 16, GREEN, t > T_GAVEL && t < T_CORR ? 0.75 : 1); c.fillStyle = INK; c.font = `26px "${SERIF}"`; c.textAlign = 'center'; c.fillText('?', gx, gy + 9); }
    // MOTION CARRIES stamp
    if (t > T_GAVEL && t < 25.0) { const p = L.sm(T_GAVEL, T_GAVEL + 0.18, t); c.save(); c.translate(560, 1160); c.rotate(-0.12); c.scale(L.lerp(1.8, 1, p), L.lerp(1.8, 1, p)); c.globalAlpha = p * (1 - L.sm(22.4, 22.8, t)); c.strokeStyle = LG; c.lineWidth = 7; rr(c, -230, -50, 460, 90, 10); c.stroke(); c.fillStyle = LG; c.font = `60px "${HAND}"`; c.textAlign = 'center'; c.fillText('MOTION CARRIES', 0, 16); c.restore(); }
    c.restore(); // end skull clip
    c.strokeStyle = '#59606c'; c.lineWidth = 10; c.beginPath(); c.ellipse(SK.x, SK.y, SK.rx, SK.ry, 0, 0, 7); c.stroke();
  }

  // ---- over-the-shoulder layer ----
  const PH = { x: 690, y: 820, w: 340, h: 620, rot: -0.07 };
  function drawOTS(c, t, h, later) {
    c.fillStyle = '#15181e'; c.fillRect(-2000, -2000, 5000, 6000);
    // back wall and lamp glow (gray)
    c.fillStyle = '#1b1f27'; c.fillRect(-2000, -2000, 5000, 3200);
    // the phone
    c.save(); c.translate(PH.x, PH.y); c.rotate(PH.rot);
    c.fillStyle = '#0c0e12'; rr(c, -PH.w / 2 - 14, -PH.h / 2 - 14, PH.w + 28, PH.h + 28, 40); c.fill();
    c.fillStyle = '#262b34'; rr(c, -PH.w / 2, -PH.h / 2, PH.w, PH.h, 28); c.fill();
    c.save(); rr(c, -PH.w / 2, -PH.h / 2, PH.w, PH.h, 28); c.clip();
    const scroll = later ? 0 : (t < T0 ? t * 260 : T0 * 260 + L.ease.out(L.clamp((t - T0) / 0.5, 0, 1)) * 40);
    for (let k = -1; k < 8; k++) { const y = -PH.h / 2 + 20 + k * 150 - (scroll % 150); c.fillStyle = '#3a404b'; rr(c, -PH.w / 2 + 20, y, PH.w - 40, 130, 14); c.fill(); c.fillStyle = '#4a515d'; c.fillRect(-PH.w / 2 + 40, y + 20, 160, 14); c.fillRect(-PH.w / 2 + 40, y + 46, 220, 12); }
    if (h >= 0) { const a = later ? 1 : L.sm(T0, T0 + 0.25, t); const sc = later ? 1 : L.lerp(1.25, 1, L.ease.back(L.clamp((t - T0) / 0.35, 0, 1)));
      c.save(); c.scale(sc, sc); c.globalAlpha = a; c.fillStyle = RED; rr(c, -PH.w / 2 + 16, -150, PH.w - 32, later ? 380 : 300, 18); c.fill();
      c.fillStyle = 'rgba(255,255,255,0.45)'; c.fillRect(-PH.w / 2 + 40, -120, 200, 18); c.fillRect(-PH.w / 2 + 40, -88, 150, 14);
      c.fillStyle = 'rgba(255,255,255,0.18)'; rr(c, -PH.w / 2 + 40, -58, PH.w - 80, 150, 10); c.fill();
      if (later) { for (let i = 0; i < 9; i++) { c.fillStyle = 'rgba(255,255,255,0.6)'; c.beginPath(); c.arc(-PH.w / 2 + 50 + i * 30, 205, 9, 0, 7); c.fill(); } }
      c.restore(); }
    c.restore(); c.restore();
    // red rim light on the head = attention
    const redA = h >= 0 ? (later ? 1 : L.sm(T0, T0 + 0.4, t)) * (0.35 + 0.5 * share(Math.max(h, 0.5))) : 0;
    // arm and hand
    c.strokeStyle = '#6d737d'; c.lineWidth = 70; c.lineCap = 'round'; c.beginPath(); c.moveTo(520, 1700); c.quadraticCurveTo(700, 1450, 700, 1180); c.stroke();
    c.fillStyle = '#6d737d'; rr(c, 630, 1080, 130, 110, 50); c.fill();
    // shoulders and head from behind
    c.fillStyle = '#5c626c'; rr(c, -120, 1560, 820, 600, 240); c.fill();
    c.fillStyle = SKIN; c.beginPath(); c.ellipse(310, 1230, 300, 390, 0.05, 0, 7); c.fill();
    c.fillStyle = '#737983'; c.beginPath(); c.ellipse(598, 1250, 34, 70, 0.1, 0, 7); c.fill(); // ear
    if (redA > 0) { c.save(); c.globalAlpha = redA * 0.5; c.strokeStyle = RED; c.lineWidth = 14; c.beginPath(); c.ellipse(310, 1230, 296, 386, 0.05, -1.2, 0.5); c.stroke(); c.restore(); }
  }
  // the room seen through the back of the head (x-ray): room centre -> head centre, scale XS
  const XS = 0.5, XC = [310, 1230];
  function xrayRoom(c, t, h, a) { if (a <= 0) return; c.save(); c.globalAlpha = a; c.beginPath(); c.ellipse(XC[0], XC[1], 290, 380, 0.05, 0, 7); c.clip();
    c.translate(XC[0], XC[1]); c.scale(XS, XS); c.translate(-SK.x, -SK.y); drawRoom(c, t, h); c.restore(); }

  // ---- city of skulls ----
  const rnd = L.rng(1109); const heads = [];
  for (let gy = -14; gy <= 14; gy++) for (let gx = -8; gx <= 8; gx++) { if (!gx && !gy) continue; const x = gx * 84 + (gy % 2) * 42 + (rnd() - 0.5) * 30, y = gy * 84 + (rnd() - 0.5) * 30; heads.push({ x, y, d: Math.hypot(x + 60, y - 40) + rnd() * 260 }); }
  heads.sort((a, b) => a.d - b.d); const NH = heads.length;
  heads.forEach((hd, i) => { hd.hRed = invShare((i + 0.5) / NH); let best = -1, bd = 1e9; for (let j = 0; j < i; j++) { const dd = Math.hypot(heads[j].x - hd.x, heads[j].y - hd.y); if (dd < bd) { bd = dd; best = j; } } hd.parent = best; });
  const FRIEND = heads.reduce((b, hd) => Math.abs(Math.hypot(hd.x - 250, hd.y + 230)) < Math.abs(Math.hypot(b.x - 250, b.y + 230)) ? hd : b, heads[0]);
  FRIEND.friend = true; FRIEND.hRed = 1e9;
  // truth-knowers (true version spreads 6x slower, ranked from the friend)
  const byF = heads.slice().sort((a, b) => Math.hypot(a.x - FRIEND.x, a.y - FRIEND.y) - Math.hypot(b.x - FRIEND.x, b.y - FRIEND.y));
  byF.forEach((hd, j) => { hd.hTrue = j === 0 ? 0 : invShare((j + 0.5) / NH, R / 6); });
  function drawCity(c, t, h) {
    c.fillStyle = '#0f1217'; c.fillRect(-3000, -3000, 6000, 6000);
    heads.forEach(hd => { if (hd.parent >= 0 && h >= hd.hRed) { const p = heads[hd.parent]; c.strokeStyle = 'rgba(255,59,48,0.35)'; c.lineWidth = 3; c.beginPath(); c.moveTo(p.x, p.y); c.lineTo(hd.x, hd.y); c.stroke(); } });
    // our line to the friend (attention): flickers and breaks
    { const brk = L.sm(13.4, 14.2, t); c.save(); c.setLineDash([14, 12]); c.lineDashOffset = -t * 50; c.strokeStyle = GREEN; c.lineWidth = 4; c.globalAlpha = (0.5 + 0.5 * Math.sin(t * 9)) * (1 - brk); c.beginPath(); c.moveTo(0, 0); c.lineTo(FRIEND.x * (1 - 0.5 * brk), FRIEND.y * (1 - 0.5 * brk)); c.stroke(); c.restore(); }
    const drawHead = (x, y, fill, ring) => { c.fillStyle = '#3a404b'; c.beginPath(); c.ellipse(x, y + 26, 34, 14, 0, 0, 7); c.fill(); c.fillStyle = SKIN; c.beginPath(); c.ellipse(x, y + 1.5, 30, 39, 0, 0, 7); c.fill(); if (fill) { c.fillStyle = fill; c.beginPath(); c.arc(x, y, 14, 0, 7); c.fill(); } if (ring) { c.strokeStyle = ring; c.lineWidth = 4; c.beginPath(); c.ellipse(x, y + 1.5, 36, 45, 0, 0, 7); c.stroke(); } };
    heads.forEach(hd => { const red = h >= hd.hRed, grn = h >= hd.hTrue; drawHead(hd.x, hd.y, grn ? null : (red ? RED : null), null); if (grn) glow(c, hd.x, hd.y, 13); });
    drawHead(0, 0, RED, PAPER); // us
    L.label(c, 'me', 0, -58, 34, { col: LG }); L.label(c, 'a friend who knew', FRIEND.x, FRIEND.y - 60, 30, { col: LG, alpha: 1 - L.sm(15.6, 16.2, t) });
  }

  // ---- snap panels ----
  const qs = Array.from({ length: 19 }, (_, i) => 0.05 + i * 0.05);
  const humTicks = qs.map(q => L.lognormalQuantile(q, H_MED, H_P90)), aiTicks = qs.map(q => L.lognormalQuantile(q, AI_MED, H_P90 / H_MED));
  const SNAP_A = 27.6, SNAP_RATE = 5, HMAX = 20;
  function panel(c, y0, ai, hp, a) {
    c.save(); c.globalAlpha = a; const X0 = 90, X1 = 990, gx0 = 200, gx1 = 960, gy0 = y0 + 140, gy1 = y0 + 390, hx = hh => gx0 + (gx1 - gx0) * hh / HMAX;
    c.fillStyle = '#1b1f27'; rr(c, X0 - 20, y0, X1 - X0 + 20, 470, 22); c.fill(); c.strokeStyle = '#3a404b'; c.lineWidth = 3; c.stroke();
    c.font = `58px "${SERIF}"`; c.textAlign = 'left'; c.fillStyle = PAPER; c.fillText(ai ? 'Routed' : 'As it happened', X0 + 10, y0 + 72);
    if (ai) { c.font = `46px "${HAND}"`; c.fillStyle = LG; c.fillText('illustrative', X0 + 230, y0 + 70); }
    // red: the same logistic in both lanes (routing does not stop the claim)
    c.fillStyle = RED; c.beginPath(); c.moveTo(gx0, gy1); for (let hh = 0; hh <= Math.min(hp, HMAX); hh += 0.1) c.lineTo(hx(hh), gy1 - (gy1 - gy0) * share(hh)); c.lineTo(hx(Math.min(hp, HMAX)), gy1); c.closePath(); c.globalAlpha = a * 0.85; c.fill(); c.globalAlpha = a;
    c.strokeStyle = '#59606c'; c.lineWidth = 3; c.beginPath(); c.moveTo(gx0, gy1); c.lineTo(gx1, gy1); c.stroke();
    c.font = `34px "${HAND}"`; c.fillStyle = GRAY; c.textAlign = 'right'; c.fillText('hours', gx1, gy1 + 48);
    // three pieces already in the head (ready at 0)
    const pY = [gy0 + 30, gy0 + 110, gy0 + 190], pX = 130, tj = ai ? AI_MED : H_MED;
    const joined = hp >= tj && ai;
    pY.forEach((py, i) => { if (joined) { c.strokeStyle = GREEN; c.lineWidth = 6; c.beginPath(); c.moveTo(pX, py); c.lineTo(hx(tj), gy0 + 110); c.stroke(); } else { c.save(); c.setLineDash([8, 12]); c.strokeStyle = '#59606c'; c.lineWidth = 3; c.beginPath(); c.moveTo(pX, py); c.lineTo(pX + 50, py); c.stroke(); c.restore(); } glow(c, pX, py, 13); });
    // variance: other cascades' correction lags (lognormal quantiles)
    (ai ? aiTicks : humTicks).forEach(v => { if (v <= hp && v <= HMAX) { c.fillStyle = GREEN; c.globalAlpha = a * 0.6; c.fillRect(hx(v) - 3, gy1 + 6, 6, 22); c.globalAlpha = a; } });
    // this person's correction
    if (hp >= tj) { const x = hx(tj); c.strokeStyle = GREEN; c.lineWidth = 8; c.beginPath(); c.moveTo(x, gy0 - 20); c.lineTo(x, gy1); c.stroke(); glow(c, x, gy0 + 110, 16);
      c.font = `50px "${SERIF}"`; c.fillStyle = GREEN; c.textAlign = ai ? 'left' : 'right'; c.fillText(ai ? '~1 hour' : '13 hours', ai ? x + 26 : x - 26, gy0 - 2); }
    // playhead
    if (hp < HMAX) { c.strokeStyle = LG; c.lineWidth = 3; c.beginPath(); c.moveTo(hx(hp), gy0 - 30); c.lineTo(hx(hp), gy1); c.stroke(); }
    c.restore();
  }

  // ---- countdown numerals ----
  const SLAMS = [{ t: 5.0, n: '3', text: 'A memory.', end: 9.0 }, { t: 9.0, n: '2', text: "A friend who'd know.", end: 11.4 }, { t: 17.4, n: '1', text: 'A doubt.', end: 21.4 }];
  function countdown(c, t) {
    SLAMS.forEach(s => { if (t < s.t || t > s.end) return; const lt = t - s.t;
      if (lt < 0.6) { c.save(); c.globalAlpha = 0.55 * (1 - L.sm(0.4, 0.6, lt)); c.fillStyle = '#000'; c.fillRect(0, 0, 1080, 1920); c.restore(); }
      const fly = L.ease.inOut(L.clamp((lt - 0.45) / 0.35, 0, 1)); const x = L.lerp(490, 150, fly), y = L.lerp(1060, 1488, fly), size = L.lerp(520, 150, fly) * L.lerp(1.4, 1, L.ease.out(L.clamp(lt / 0.15, 0, 1)));
      const a = 1 - L.sm(s.end - 0.3, s.end, t); card(c, s.n, y, size, a, { x, maxW: 2000 });
      if (lt > 0.6) card(c, s.text, 1470, 76, a * L.sm(0.6, 0.9, lt), { x: 560, maxW: 580 }); });
  }

  const bufA = createCanvas(1080, 1920), cA = bufA.getContext('2d');
  function layer(c, a, fn) { if (a <= 0) return; if (a >= 1) { c.save(); fn(c); c.restore(); return; }
    cA.setTransform(1, 0, 0, 1, 0, 0); cA.globalAlpha = 1; cA.clearRect(0, 0, 1080, 1920); cA.save(); fn(cA); cA.restore(); c.save(); c.globalAlpha = a; c.drawImage(bufA, 0, 0); c.restore(); }

  // camera keys
  const OTS_K = [[0, [540, 960, 1.0, 0]], [1.4, [540, 960, 1.0, 0]], [3.8, [560, 990, 1.1, 0]], [5.0, [XC[0], XC[1], 3.0, 0]]];
  const ROOM_K = [[4.6, [540, 980, 1.5]], [5.0, [540, 1000, 1.5]], [5.6, [540, 1000, 1.2]], [7.4, [340, 1180, 1.6]], [9.0, [340, 1180, 1.6]], [9.9, [720, 1180, 1.6]], [11.2, [740, 1180, 1.7]], [12.6, [540, 980, 0.3]],
    [16.6, [540, 980, 0.3]], [17.6, [500, 1300, 2.1]], [21.6, [500, 1310, 2.2]], [22.8, [540, 1000, 1.05]], [25.0, [540, 1000, 1.05]], [34.0, [490, 1360, 2.2]], [36.8, [480, 1400, 3.2]]];
  const CITY_K = [[12.3, [0, 0, 5.4]], [14.4, [60, -40, 0.85]], [16.0, [60, -40, 0.85]], [16.9, [0, 0, 5.4]]];
  const cam3 = (c, keys, t) => { const k = L.key(keys, t); L.camera(c, [[0, [k[0], k[1], k[2], 0]]], 0); };

  function draw(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    const h = hAt(t);
    if (t < 1.4) { // SC0 cold open, flash-forward
      layer(ctx, 1, c => { cam3(c, OTS_K, t); drawOTS(c, t, 11, true); xrayRoom(c, 30, 11, 0.92); });
      L.label(ctx, 'later', 700, 620, 48, { col: LG });
      card(ctx, 'Three pieces.', 330, 104, 1); card(ctx, 'Already in my head.', 440, 92, 1);
      L.slate(ctx, 'SC0  OTS CLOSE  cold open, later');
    } else if (t < 5.0) { // SC1 over the shoulder, dolly in through the skull
      const xa = L.sm(3.8, 4.6, t);
      layer(ctx, 1, c => { cam3(c, OTS_K, t); drawOTS(c, t, h, false); xrayRoom(c, t, h, xa); });
      layer(ctx, L.sm(4.6, 4.95, t), c => { cam3(c, ROOM_K, t); drawRoom(c, t, h); });
      card(ctx, 'A claim lands.', 330, 96, win(t, 2.5, 4.3));
      L.slate(ctx, t < 3.8 ? 'SC1  OTS CLOSE' : 'SC1  DOLLY IN  through the skull');
    } else if (t < 12.9) { // SC2-SC4a: the room, then crane out
      const ca = L.sm(12.3, 12.8, t);
      layer(ctx, 1, c => { cam3(c, ROOM_K, t); drawRoom(c, t, h); });
      layer(ctx, ca, c => { cam3(c, CITY_K, t); drawCity(c, t, h); });
      card(ctx, 'Inside: the committee.', 330, 84, win(t, 5.7, 7.2));
      countdown(ctx, t);
      L.slate(ctx, t < 9 ? 'SC2  ROOM  push to the cabinet' : t < 11.2 ? 'SC3  ROOM  push right' : 'SC4  CRANE OUT');
    } else if (t < 17.0) { // SC4 city of skulls, drop down
      layer(ctx, 1, c => { cam3(c, CITY_K, t); drawCity(c, t, h); });
      layer(ctx, L.sm(16.6, 16.95, t), c => { cam3(c, ROOM_K, t); drawRoom(c, t, h); });
      card(ctx, 'All around me, it spreads.', 330, 84, win(t, 14.2, 16.2));
      L.slate(ctx, t < 16 ? 'SC4  WIDE  city of skulls' : 'SC5  DROP DOWN');
    } else if (t < 27.4) { // SC6 closest: the doubt, the gavel, the correction, the dead stop
      const tf = Math.min(t, 24.95); const dim = L.sm(25.0, 25.4, t);
      layer(ctx, 1, c => { cam3(c, ROOM_K, tf); drawRoom(c, tf, hAt(tf)); });
      if (dim > 0) { ctx.save(); ctx.globalAlpha = 0.65 * dim; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, 1080, 1920); ctx.restore(); }
      countdown(ctx, t);
      card(ctx, 'The correction: 13 hours later.', 330, 80, win(t, 21.7, 23.4));
      card(ctx, 'It was already in the room.', 330, 84, win(t, 23.4, 25.0));
      card(ctx, 'We slowed it down', 820, 96, win(t, 25.2, 27.3)); card(ctx, 'so you could see it.', 925, 96, win(t, 25.2, 27.3));
      L.slate(ctx, t < 21.6 ? 'SC6  CLOSE  the doubt' : t < 25 ? 'SC6  TILT UP  to the eyes' : 'DEAD STOP');
    } else if (t < 34.0) { // SC7 the snap
      const hp = L.clamp((t - SNAP_A) * SNAP_RATE, 0, HMAX), a = L.sm(27.4, 27.6, t);
      if (t < 27.55) { ctx.fillStyle = '#e8e4da'; ctx.globalAlpha = 1 - L.sm(27.4, 27.55, t); ctx.fillRect(0, 0, 1080, 1920); ctx.globalAlpha = 1; }
      panel(ctx, 250, false, hp, a); panel(ctx, 790, true, hp, a);
      card(ctx, 'Speed is not belief.', 1420, 88, L.sm(31.8, 32.2, t));
      L.slate(ctx, 'SC7  SNAP  1 s = 5 h, both lanes');
    } else if (t < 36.8) { // SC8 dolly in, closest
      layer(ctx, 1, c => { cam3(c, ROOM_K, t); drawRoom(c, 24.9, 13); });
      card(ctx, 'This is the bottleneck.', 330, 96, L.sm(34.3, 34.8, t));
      L.slate(ctx, 'SC8  DOLLY IN  closest');
    } else { L.endCard(ctx, L.sm(36.8, 37.3, t)); }
    L.grain(ctx, t, { alpha: 0.05, n: 400 });
  }
  return {
    draw, DUR,
    acts: [{ start: 0, end: 12.3, bpm: 0, drone: true }, { start: 12.3, end: 25.0, bpm: 0, drone: true }, { start: 27.4, end: 34.0, bpm: 0, drone: true }, { start: 34.0, end: DUR, bpm: 0, drone: true }],
    cues: [{ t: T0, type: 'pop' }, { t: 3.9, type: 'whoosh' }, { t: 5.0, type: 'stamp' }, { t: 9.0, type: 'stamp' }, { t: 11.3, type: 'whoosh' }, { t: 16.2, type: 'whoosh' }, { t: 17.4, type: 'stamp' },
      { t: T_GAVEL, type: 'bonk' }, { t: T_CORR, type: 'ding' }, { t: 27.4, type: 'hit' }, { t: SNAP_A + AI_MED / SNAP_RATE, type: 'ding' }, { t: SNAP_A + H_MED / SNAP_RATE, type: 'pop' }, { t: 34.3, type: 'hit' }],
  };
}
module.exports = makeScene;
