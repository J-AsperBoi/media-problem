// the-crash-call: sports-play-by-play, isometric, sport. Analog: gfc-2008.
// Race mapping: film t 2.2..16.8 s <-> days 0..584 after the Aug 9 2007 freeze. 1 s = 40 days, linear.
// Red = analog threat.points (monthly S&P fall share, s2), piecewise linear; red area of the grid = share of the fall.
// Green passes: L.lognormalQuantile(q, 426, 1077) per pitch. AI snap: median 220, p90 556 (illustrative).
// Hook 0..1.8 s is a labeled flash-forward to day 433. See output/the-crash-call/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('gfc-2008');
  const DUR = 36, RED = L.RED, GREEN = L.GREEN;
  const BG = '#101318', CREAM = '#ece8de', G2 = '#2a2f37', G3 = '#23272e', G5 = '#9aa0aa';

  // ---------- data ----------
  const PTS = A.threat.points.map(p => [p.t, p.extent]);
  const TROUGH = PTS[PTS.length - 1][0];                    // 584
  const extent = d => { if (d <= PTS[0][0]) return 0; for (let i = 0; i < PTS.length - 1; i++) { const [a, x] = PTS[i], [b, y] = PTS[i + 1]; if (d <= b) return L.lerp(x, y, (d - a) / (b - a)); } return 1; };
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;
  const AIMED = A.ai_counterfactual.aggregation_median, AIP90 = AIMED * P90 / MED;
  const T0 = 2.2, DPS = 40, TEND = T0 + TROUGH / DPS;      // 16.8
  const FLASH = 433;                                         // Oct 2008 point, the month after the break
  const dayAt = t => t < 1.8 ? FLASH : t < T0 ? 0 : Math.min(TROUGH, (t - T0) * DPS);
  const BREAK = 403;

  // ---------- isometric world ----------
  const S = 23.6, C = 0.866, NU = 26, NV = 23, HP = 0.4;
  const OX = 540 - 1.5 * C * S, OY = 990 - 24.5 * 0.5 * S;
  const P = (u, v, h = 0) => [OX + (u - v) * C * S, OY + (u + v) * 0.5 * S - h * S];
  const isGapU = u => u % 9 === 8, isGapV = v => v % 6 === 5;
  const rr = L.rng(11), cells = [];
  for (let u = 0; u < NU; u++) for (let v = 0; v < NV; v++) cells.push({ u, v, gap: isGapU(u) || isGapV(v), base: Math.hypot(u + 0.5, v + 0.5) + rr() * 3.2 });
  cells.slice().sort((a, b) => a.base - b.base).forEach((c, i) => c.rank = (i + 1) / cells.length);
  const cellAt = {}; cells.forEach(c => cellAt[c.u + ',' + c.v] = c);

  const HUB = [13, 11.5], HUBH = 7.5;
  const pitches = [];
  for (let pr = 0; pr < 4; pr++) for (let pc = 0; pc < 3; pc++) pitches.push({ pc, pr, u0: pc * 9, v0: pr * 6, u1: pc * 9 + 8, v1: pr * 6 + 5, type: (pc + pr * 2) % 4 });
  const HERO = pitches.findIndex(p => p.pc === 2 && p.pr === 2), NEIGH = pitches.findIndex(p => p.pc === 2 && p.pr === 3);
  // stratified quantiles, shuffled; hero takes the last (the tail)
  const rq = L.rng(5), qs = []; for (let i = 0; i < 11; i++) qs.push((i + 0.5) / 12);
  for (let i = qs.length - 1; i > 0; i--) { const j = Math.floor(rq() * (i + 1)); [qs[i], qs[j]] = [qs[j], qs[i]]; }
  let k = 0; pitches.forEach((p, i) => { p.q = i === HERO ? 11.5 / 12 : qs[k++]; p.arr = L.lognormalQuantile(p.q, MED, P90); p.ai = L.lognormalQuantile(p.q, AIMED, AIP90); });
  const rp = L.rng(23);
  pitches.forEach((p, i) => {
    p.pu = p.u0 + 3.2 + rp() * 1.6; p.pv = p.v0 + 1.8 + rp() * 1.4; p.per = 2.3 + rp() * 0.9; p.ph = rp() * 3; p.seed = i + 3;
    if (i === NEIGH) { p.pu = 22; p.pv = 18.9; }
    // wall target: from player toward the hub until the pitch edge
    let dx = HUB[0] - p.pu, dy = HUB[1] - p.pv; if (i === HERO || i === NEIGH) { dx = 0; dy = i === HERO ? 1 : -1; }
    const dl = Math.hypot(dx, dy); dx /= dl; dy /= dl; let s = 99;
    if (dx > 0) s = Math.min(s, (p.u1 - p.pu) / dx); if (dx < 0) s = Math.min(s, (p.u0 - p.pu) / dx);
    if (dy > 0) s = Math.min(s, (p.v1 - p.pv) / dy); if (dy < 0) s = Math.min(s, (p.v0 - p.pv) / dy);
    p.wall = [p.pu + dx * s * 0.97, p.pv + dy * s * 0.97];
  });

  // ---------- drawing helpers ----------
  function poly(c, pts, fill, stroke, lw) { c.beginPath(); pts.forEach((q, i) => i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1])); c.closePath(); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.lineWidth = lw; c.stroke(); } }
  const cellPts = (u, v, h) => [P(u, v, h), P(u + 1, v, h), P(u + 1, v + 1, h), P(u, v + 1, h)];
  function isoLine(c, pts, h) { c.beginPath(); pts.forEach((q, i) => { const [x, y] = P(q[0], q[1], h); i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke(); }
  function isoCircle(c, cu, cv, r, h) { const pts = []; for (let i = 0; i <= 28; i++) { const a = i / 28 * Math.PI * 2; pts.push([cu + Math.cos(a) * r, cv + Math.sin(a) * r]); } isoLine(c, pts, h); }
  function markings(c, p) {
    const h = HP, u0 = p.u0, v0 = p.v0, box = (a, b, cc, d) => isoLine(c, [[u0 + a, v0 + b], [u0 + cc, v0 + b], [u0 + cc, v0 + d], [u0 + a, v0 + d], [u0 + a, v0 + b]], h);
    c.strokeStyle = 'rgba(215,220,228,0.5)'; c.lineWidth = 0.9;
    box(0.3, 0.3, 7.7, 4.7);
    if (p.type === 0) { isoLine(c, [[u0 + 4, v0 + 0.3], [u0 + 4, v0 + 4.7]], h); isoCircle(c, u0 + 4, v0 + 2.5, 0.9, h); box(0.3, 1.4, 1.4, 3.6); box(6.6, 1.4, 7.7, 3.6); }
    else if (p.type === 1) { c.lineWidth = 1.6; isoLine(c, [[u0 + 4, v0 + 0.3], [u0 + 4, v0 + 4.7]], h); c.lineWidth = 0.9; isoLine(c, [[u0 + 0.3, v0 + 0.9], [u0 + 7.7, v0 + 0.9]], h); isoLine(c, [[u0 + 0.3, v0 + 4.1], [u0 + 7.7, v0 + 4.1]], h); isoLine(c, [[u0 + 2, v0 + 0.9], [u0 + 2, v0 + 4.1]], h); isoLine(c, [[u0 + 6, v0 + 0.9], [u0 + 6, v0 + 4.1]], h); isoLine(c, [[u0 + 2, v0 + 2.5], [u0 + 6, v0 + 2.5]], h); }
    else if (p.type === 2) { isoLine(c, [[u0 + 4, v0 + 0.3], [u0 + 4, v0 + 4.7]], h); isoCircle(c, u0 + 4, v0 + 2.5, 0.7, h); box(0.3, 1.7, 2, 3.3); box(6, 1.7, 7.7, 3.3); isoCircle(c, u0 + 2, v0 + 2.5, 0.8, h); isoCircle(c, u0 + 6, v0 + 2.5, 0.8, h); }
    else { c.strokeStyle = 'rgba(215,220,228,0.28)'; for (let i = 1; i < 8; i++) isoLine(c, [[u0 + i, v0 + 0.3], [u0 + i, v0 + 4.7]], h); for (let j = 1; j < 5; j++) isoLine(c, [[u0 + 0.3, v0 + j], [u0 + 7.7, v0 + j]], h); }
  }
  function wall(c, a, b, h, hh, flash = 0) {
    if (hh <= 0.01) return; const q = [P(a[0], a[1], h), P(b[0], b[1], h), P(b[0], b[1], h + hh), P(a[0], a[1], h + hh)];
    poly(c, q, 'rgba(200,212,228,0.10)', null); c.strokeStyle = `rgba(225,232,242,${0.4 + flash * 0.6})`; c.lineWidth = 0.8 + flash * 1.5;
    c.beginPath(); c.moveTo(q[3][0], q[3][1]); c.lineTo(q[2][0], q[2][1]); c.stroke();
  }
  function bean(c, x, y, s, o) { // x,y = feet
    const bw = 46 * s, bh = 60 * s, col = o.col || '#b9bec8', mood = o.mood || 'happy'; y -= bh * 0.72;
    c.save(); c.strokeStyle = col; c.lineCap = 'round'; c.lineWidth = 7 * s;
    const wv = o.wave || 0;
    [-1, 1].forEach(sd => { const ax = x + sd * bw * 0.42, ay = y + bh * 0.02; const ang = o.armsUp ? (-Math.PI / 2 + sd * (0.5 + 0.35 * Math.sin(wv))) : (Math.PI / 2 + sd * (0.35 + 0.2 * Math.sin(wv))); c.beginPath(); c.moveTo(ax, ay); c.lineTo(ax + Math.cos(ang) * bw * 0.55, ay + Math.sin(ang) * bw * 0.55); c.stroke(); });
    const lg = o.legs || 0; [-1, 1].forEach(sd => { c.beginPath(); c.moveTo(x + sd * bw * 0.18, y + bh * 0.42); c.lineTo(x + sd * bw * 0.18 + Math.sin(lg) * sd * bw * 0.3, y + bh * 0.72); c.stroke(); });
    c.fillStyle = col; c.beginPath(); c.roundRect(x - bw / 2, y - bh / 2, bw, bh, bw / 2); c.fill();
    c.fillStyle = 'rgba(0,0,0,0.13)'; c.beginPath(); c.roundRect(x - bw / 2, y + bh * 0.05, bw, bh * 0.45, [0, 0, bw / 2, bw / 2]); c.fill();
    const ey = y - bh * 0.14, er = bw * (mood === 'panic' ? 0.17 : 0.14), lk = o.look || [0, 0];
    [-1, 1].forEach(sd => { const ex = x + sd * bw * 0.19;
      c.fillStyle = '#fffdf7'; c.beginPath(); c.arc(ex, ey, er, 0, 6.283); c.fill(); c.strokeStyle = '#1b1f27'; c.lineWidth = 1.6 * s; c.stroke();
      c.fillStyle = '#1b1f27'; c.beginPath(); c.arc(ex + lk[0] * er * 0.4, ey + lk[1] * er * 0.4, er * (mood === 'panic' ? 0.38 : 0.5), 0, 6.283); c.fill();
      if (mood === 'angry' || mood === 'panic') { c.strokeStyle = '#1b1f27'; c.lineWidth = 3.2 * s; c.beginPath();
        if (mood === 'angry') { c.moveTo(ex - sd * er * 1.3, ey - er * 1.9); c.lineTo(ex + sd * er * 1.0, ey - er * 1.1); } else { c.moveTo(ex - er, ey - er * 1.6 + sd * er * 0.3); c.lineTo(ex + er, ey - er * 1.6 - sd * er * 0.3); } c.stroke(); } });
    const my = y + bh * 0.14; c.strokeStyle = '#1b1f27'; c.lineWidth = 3 * s; c.beginPath();
    if (mood === 'angry') { c.moveTo(x - bw * 0.13, my + bw * 0.03); c.quadraticCurveTo(x, my - bw * 0.05, x + bw * 0.13, my + bw * 0.03); c.stroke(); }
    else if (mood === 'panic') { c.fillStyle = '#1b1f27'; c.ellipse(x, my + bh * 0.03, bw * 0.09, bw * 0.12, 0, 0, 6.283); c.fill(); }
    else if (mood === 'flat') { c.moveTo(x - bw * 0.1, my); c.lineTo(x + bw * 0.1, my); c.stroke(); }
    else { c.arc(x, my - bw * 0.04, bw * 0.14, 0.15 * Math.PI, 0.85 * Math.PI); c.stroke(); }
    c.restore();
  }
  function ball(c, u, v, h, lit = 1, big = 1) {
    const [x, y] = P(u, v, h); const r = 5.2 * big; const [sx, sy] = P(u, v, HP);
    c.fillStyle = 'rgba(0,0,0,0.3)'; c.beginPath(); c.ellipse(sx, sy, r * 1.1, r * 0.5, 0, 0, 7); c.fill();
    c.fillStyle = `rgba(52,210,123,${0.18 * lit})`; c.beginPath(); c.arc(x, y - r, r * 2.3, 0, 7); c.fill();
    c.fillStyle = GREEN; c.beginPath(); c.arc(x, y - r, r, 0, 7); c.fill();
    c.fillStyle = 'rgba(255,255,255,0.35)'; c.beginPath(); c.arc(x - r * 0.35, y - r * 1.35, r * 0.3, 0, 7); c.fill();
  }

  // ---------- players ----------
  function kickBall(p, t, per, ph) { // ball out to the wall and back; returns {u,v,h,flash}
    const f = ((t + ph) / per) % 1, fu = p.pu + 0.35, fv = p.pv + 0.3;
    if (f < 0.16) { const e = L.ease.out(f / 0.16); return { u: L.lerp(fu, p.wall[0], e), v: L.lerp(fv, p.wall[1], e), h: HP + Math.sin(e * Math.PI) * 0.3, flash: 0 }; }
    if (f < 0.34) { const e = L.ease.inOut((f - 0.16) / 0.18); return { u: L.lerp(p.wall[0], fu, e), v: L.lerp(p.wall[1], fv, e), h: HP, flash: 1 - L.clamp((f - 0.16) / 0.08, 0, 1) }; }
    return { u: fu, v: fv, h: HP, flash: 0 };
  }
  function heroState(t) {
    const p = pitches[HERO]; let u = 22, v = 15.9, legs = 0, mood = 'angry', look = [-0.5, -0.8], b = null, flash = 0, wallPt = [22.3, 16.97];
    const kick = (t0, from) => { // kick at t0 toward the +v wall, bonk at t0+0.35, back at t0+0.8
      const lt = t - t0; if (lt < 0 || lt > 0.8) return null; if (lt < 0.35) { const e = L.ease.out(lt / 0.35); return { u: L.lerp(from[0], wallPt[0], e), v: L.lerp(from[1], wallPt[1], e), h: HP + Math.sin(e * Math.PI) * 0.35 }; }
      const e = L.ease.inOut((lt - 0.35) / 0.45); flash = 1 - L.clamp((lt - 0.35) / 0.3, 0, 1); return { u: L.lerp(wallPt[0], from[0], e), v: L.lerp(wallPt[1], from[1], e), h: HP }; };
    if (t >= T0 && t < 7.0) {
      const run = L.clamp((t - T0) / 2.0, 0, 1), e = L.ease.inOut(run);
      u = L.lerp(19.6, 21.9, e); v = L.lerp(13.4, 15.7, e); legs = run < 1 ? t * 14 : 0;
      mood = t < 4.9 ? 'happy' : 'angry'; look = t < 4.9 ? [0.4, 0.8] : [0, 0.2];
      if (t > 5.4) { const e2 = L.sm(5.4, 7.0, t); u = L.lerp(21.9, 22, e2); v = L.lerp(15.7, 15.9, e2); legs = Math.sin(t * 9) * 0.4; }
      b = kick(4.3, [u + 0.35, v + 0.4]); if (!b) b = { u: u + 0.45 + (t < 4.3 ? Math.sin(t * 9) * 0.1 : 0), v: v + 0.45, h: HP + (t < 4.2 ? Math.abs(Math.sin(t * 7)) * 0.2 : 0) };
    } else if (t >= 15.2) {
      look = t < 15.5 ? [-0.6, -0.8] : [0, 0.6]; b = kick(15.6, [u + 0.35, v + 0.4]); if (!b) b = { u: u + 0.35, v: v + 0.4, h: HP };
      if (t > 16.4) look = [0.1, -0.2];
    } else b = { u: u + 0.35, v: v + 0.4, h: HP };
    return { u, v, legs, mood, look, ball: b, flash, wallPt };
  }

  // ---------- world ----------
  function drawWorld(c, day, t, o = {}) {
    const ex = extent(day), red = cell => ex >= cell.rank;
    // slab
    poly(c, [P(0, NV), P(NU, NV), P(NU, NV, -1.4), P(0, NV, -1.4)], '#14171c');
    poly(c, [P(NU, 0), P(NU, NV), P(NU, NV, -1.4), P(NU, 0, -1.4)], '#0f1115');
    poly(c, [P(0, 0), P(NU, 0), P(NU, NV), P(0, NV)], '#1b1f26');
    cells.forEach(cl => { if (cl.gap && red(cl)) poly(c, cellPts(cl.u, cl.v, 0), RED); });
    // hub arcs collected, drawn on top
    const arcs = [];
    const order = pitches.map((p, i) => i).sort((a, b) => (pitches[a].pc + pitches[a].pr) - (pitches[b].pc + pitches[b].pr));
    order.forEach(i => {
      const p = pitches[i];
      poly(c, [P(p.u0, p.v1, HP), P(p.u1, p.v1, HP), P(p.u1, p.v1, 0), P(p.u0, p.v1, 0)], G2);
      poly(c, [P(p.u1, p.v0, HP), P(p.u1, p.v1, HP), P(p.u1, p.v1, 0), P(p.u1, p.v0, 0)], G3);
      const tint = [0, 4, -3, 2][p.type];
      for (let u = p.u0; u < p.u1; u++) for (let v = p.v0; v < p.v1; v++) { const g = (u % 2 ? 67 : 61) + tint; poly(c, cellPts(u, v, HP), `rgb(${g},${g + 5},${g + 12})`); }
      markings(c, p);
      for (let u = p.u0; u < p.u1; u++) for (let v = p.v0; v < p.v1; v++) { const cl = cellAt[u + ',' + v]; if (red(cl)) poly(c, cellPts(u, v, HP), 'rgba(255,59,48,0.93)'); }
      // back walls
      const wh = 0.75, drop = o.wallDrop || 0;
      wall(c, [p.u0, p.v0], [p.u1, p.v0], HP, wh * (i === NEIGH ? 1 - drop : 1)); wall(c, [p.u0, p.v0], [p.u0, p.v1], HP, wh);
      // player + ball
      const connected = day >= p.arr && !o.noConnect;
      let st, flash = 0, pu = p.pu, pv = p.pv, mood = connected ? 'happy' : (ex > p.q * 0.8 ? 'angry' : 'flat'), look = [0, 0], legs = 0, armsUp = false;
      if (i === HERO) { const h = heroState(t); pu = h.u; pv = h.v; st = h.ball; flash = h.flash; mood = h.mood; look = h.look; legs = h.legs; }
      else {
        pu += (L.noise(t * 0.5, p.seed) - 0.5) * 0.8; pv += (L.noise(t * 0.5, p.seed + 9) - 0.5) * 0.8;
        if (i === NEIGH && !o.pass) { armsUp = true; look = [0, -1]; }
        if (o.pass && i === NEIGH) { pu = 22.2; pv = 18.6; mood = 'happy'; look = [0, -1]; armsUp = t > 29.3; }
        if (connected) st = { u: pu + 0.35, v: pv + 0.3, h: HP + Math.abs(Math.sin(t * 3 + p.ph)) * 0.08 };
        else { const kb = kickBall({ ...p, pu, pv }, t, p.per, p.ph); st = kb; flash = kb.flash; look = [Math.sign(p.wall[0] - p.pu - (p.wall[1] - p.pv)) * 0.6, 0.5]; }
      }
      if (o.heroPos && i === HERO) { pu = o.heroPos[0]; pv = o.heroPos[1]; st = o.heroBall; mood = o.heroMood; look = [0, 0.8]; legs = 0; }
      const [fx, fy] = P(pu, pv, HP);
      const behind = st.u + st.v < pu + pv;
      const drawBall = () => { if (!(o.hideHeroBall && i === HERO)) ball(c, st.u, st.v, st.h, connected ? 1.6 : 1); };
      if (behind) drawBall();
      bean(c, fx, fy, 0.45, { col: i === HERO ? '#c7ccd4' : '#8d939c', mood, look, legs, armsUp, wave: t * 6 + p.ph });
      if (!behind) drawBall();
      if (connected) { const dd = L.clamp((day - p.arr) / 25, 0, 1); arcs.push([st.u, st.v, st.h, dd]); }
      // front walls (flash where the ball hits)
      const fw = wh * (i === HERO ? 1 - drop : 1);
      const hitV = (p.wall[1] > p.v1 - 0.3 || i === HERO) ? flash : 0, hitU = (p.wall[0] > p.u1 - 0.3 && i !== HERO) ? flash : 0;
      wall(c, [p.u0, p.v1], [p.u1, p.v1], HP, fw, hitV); wall(c, [p.u1, p.v0], [p.u1, p.v1], HP, wh, hitU);
      if (flash > 0) { const w = i === HERO ? heroState(t).wallPt : p.wall; const [x, y] = P(w[0], w[1], HP + 0.35); c.strokeStyle = `rgba(255,255,255,${flash * 0.9})`; c.lineWidth = 1.2; c.beginPath(); c.ellipse(x, y, 4 + (1 - flash) * 10, 2 + (1 - flash) * 5, 0, 0, 7); c.stroke(); }
    });
    // hub ring + arcs
    if (!o.noHub) {
      const [hx, hy] = P(HUB[0], HUB[1], HUBH);
      arcs.forEach(([u, v, h, dd]) => { const [x, y] = P(u, v, h + 0.2); const mx = (x + hx) / 2, my = Math.min(y, hy) - 40; c.strokeStyle = 'rgba(52,210,123,0.85)'; c.lineWidth = 1.3; c.beginPath(); c.moveTo(x, y);
        const N = 20; for (let s = 1; s <= N * dd; s++) { const f = s / N; c.lineTo((1 - f) * (1 - f) * x + 2 * f * (1 - f) * mx + f * f * hx, (1 - f) * (1 - f) * y + 2 * f * (1 - f) * my + f * f * hy); } c.stroke(); });
      const R = 24; c.lineWidth = 6;
      pitches.forEach((p, i) => { const a0 = -Math.PI / 2 + i / 12 * Math.PI * 2 + 0.04, a1 = a0 + Math.PI * 2 / 12 - 0.08; const on = day >= p.arr && !o.noConnect;
        c.strokeStyle = on ? GREEN : '#3a404a'; c.beginPath(); c.ellipse(hx, hy, R, R * 0.55, 0, a0, a1); c.stroke(); });
    }
    return ex;
  }

  // ---------- camera ----------
  const WIDE = [540, 990];
  function camState(t) {
    const h = heroState(t), [hx, hy] = P(h.u, h.v, HP);
    const focus = [hx, hy - 16];
    let z, wf;
    if (t < 1.8) { z = L.lerp(8, 8.8, t / 1.8); wf = 0; }
    else if (t < 7.0) { z = Math.exp(L.lerp(Math.log(7.5), Math.log(6), L.ease.inOut(L.clamp((t - T0) / 4.8, 0, 1)))); wf = 0; }
    else if (t < 10.5) { const e = L.ease.inOut((t - 7) / 3.5); z = Math.exp(L.lerp(Math.log(6), Math.log(1.05), e)); wf = L.ease.inOut(L.clamp((t - 7) / 3.2, 0, 1)); }
    else if (t < 13.4) { z = 1.05; wf = 1; }
    else if (t < 15.2) { const e = L.ease.inOut((t - 13.4) / 1.8); z = Math.exp(L.lerp(Math.log(1.05), Math.log(13), e)); wf = 1 - L.ease.inOut(L.clamp((t - 13.4) / 1.5, 0, 1)); }
    else { z = L.lerp(13, 14.2, L.clamp((t - 15.2) / 2.9, 0, 1)); wf = 0; }
    // handheld: amplitude grows with the red's slope (data), capped
    const d = dayAt(t), slope = Math.abs(extent(d + 5) - extent(d - 5)) / 10;
    let amp = t < T0 ? 14 : t < 7 ? 18 : 7 + Math.min(26, slope * 2200);
    if (t >= 15.2) amp = 12;
    const sx = (L.noise(t * 2.2, 1) - 0.5) * 2 * amp + (L.noise(t * 8, 2) - 0.5) * amp * 0.5;
    const sy = (L.noise(t * 2.0, 3) - 0.5) * 2 * amp + (L.noise(t * 7.5, 4) - 0.5) * amp * 0.5;
    const rot = (L.noise(t * 1.4, 5) - 0.5) * 0.02 * (amp / 14);
    return { x: L.lerp(focus[0], WIDE[0], wf), y: L.lerp(focus[1], WIDE[1], wf), z, sx, sy, rot };
  }
  function applyCam(c, cs) { c.translate(cs.sx, cs.sy); L.camera(c, [[0, [cs.x, cs.y, cs.z, cs.rot]]], 0); }

  // ---------- HUD / text ----------
  function hud(c, day, a = 1) {
    c.save(); c.globalAlpha = a; c.fillStyle = 'rgba(13,16,21,0.88)'; c.beginPath(); c.roundRect(80, 222, 820, 116, 16); c.fill();
    c.font = `40px "${HAND}"`; c.textAlign = 'left'; c.fillStyle = RED; c.fillText('RED', 104, 272);
    c.fillStyle = '#2b3038'; c.fillRect(186, 250, 300, 26); c.fillStyle = RED; c.fillRect(186, 250, 300 * extent(day), 26);
    c.fillStyle = CREAM; c.fillText('PASSES', 520, 272);
    pitches.forEach((p, i) => { c.fillStyle = day >= p.arr ? GREEN : '#3a404a'; c.beginPath(); c.arc(666 + i * 19, 262, 7.5, 0, 7); c.fill(); });
    c.fillStyle = G5; c.font = `30px "${HAND}"`; c.fillText('SEASON', 104, 322); c.fillStyle = '#2b3038'; c.fillRect(214, 308, 660, 8); c.fillStyle = G5; c.fillRect(214, 308, 660 * day / TROUGH, 8);
    c.restore();
  }
  function caption(c, text, a, { y = 1420, size = 64 } = {}) {
    if (a <= 0) return; c.save(); c.globalAlpha *= a; let fz = size; c.font = `${fz}px "${SERIF}"`; let w = c.measureText(text).width;
    if (w > 760) { fz *= 760 / w; c.font = `${fz}px "${SERIF}"`; w = c.measureText(text).width; }
    const cx = 490, x0 = cx - w / 2 - 30, h = fz * 1.35;
    c.fillStyle = 'rgba(13,16,21,0.9)'; c.fillRect(x0, y - h * 0.8, w + 60, h); c.fillStyle = GREEN; c.fillRect(x0, y - h * 0.8, 8, h);
    c.fillStyle = CREAM; c.textAlign = 'center'; c.fillText(text, cx, y); c.restore();
  }
  const capA = (t, a, b) => L.sm(a, a + 0.12, t) * (1 - L.sm(b - 0.12, b, t));
  const CAPS = [
    [2.35, 3.9, 'Opening whistle. Green has the ball.'], [3.95, 5.2, 'Looks for the pass...'], [5.25, 6.95, 'Off the glass. Nobody there.'],
    [7.3, 8.8, 'Every pitch has a ball.'], [8.9, 10.45, 'Nobody passes across the lines.'], [10.6, 12.2, 'Red has drifted all season.'],
    [12.28, 13.5, 'RED BREAKS THROUGH!'], [16.85, 18.1, "...and that's the season."],
    [25.7, 26.95, 'Same players. Faster passes.'], [27.0, 28.2, 'Illustrative. Not a promise.'],
    [28.35, 30.0, 'AI finds the open player. People pass.'],
  ];
  function tag(c, text, x, y, size, col = CREAM, bg = 'rgba(13,16,21,0.9)') { c.save(); c.font = `${size}px "${HAND}"`; const w = c.measureText(text).width; c.fillStyle = bg; c.fillRect(x - 16, y - size * 0.92, w + 32, size * 1.25); c.fillStyle = col; c.textAlign = 'left'; c.fillText(text, x, y); c.restore(); }

  // ---------- snap panels ----------
  const AX0 = 110, AX1 = 970, DMAX = 1100, dx = d => AX0 + (AX1 - AX0) * Math.min(d, DMAX) / DMAX;
  function panel(c, y0, title, sub, key, sweep, a) {
    c.save(); c.globalAlpha = a; c.fillStyle = '#171b21'; c.beginPath(); c.roundRect(80, y0, 920, 440, 18); c.fill();
    c.font = `48px "${SERIF}"`; c.textAlign = 'left'; c.fillStyle = CREAM; c.fillText(title, 110, y0 + 64);
    const base = y0 + 290, H = 170, sd = Math.min(sweep, TROUGH);
    // red area (data), revealed by the playhead
    c.fillStyle = 'rgba(255,59,48,0.9)'; c.beginPath(); c.moveTo(dx(0), base);
    for (let d = 0; d <= sd; d += 4) c.lineTo(dx(d), base - H * extent(d)); c.lineTo(dx(sd), base); c.closePath(); c.fill();
    c.strokeStyle = '#4a505a'; c.lineWidth = 3; c.beginPath(); c.moveTo(AX0, base); c.lineTo(AX1, base); c.stroke();
    // the break
    c.setLineDash([8, 8]); c.strokeStyle = '#7d838d'; c.beginPath(); c.moveTo(dx(BREAK), y0 + 96); c.lineTo(dx(BREAK), y0 + 390); c.stroke(); c.setLineDash([]);
    c.font = `44px "${HAND}"`; c.fillStyle = G5; c.textAlign = 'left'; c.fillText('the break', dx(BREAK) + 12, y0 + 128);
    c.fillText('whistle', AX0, y0 + 425);
    // pips
    pitches.forEach((p, i) => { const d = p[key]; if (d > sweep) return; const x = dx(d), y = base + 42 + (i % 2) * 24;
      const pre = d < BREAK; c.fillStyle = pre ? GREEN : 'rgba(52,210,123,0.45)'; c.beginPath(); c.arc(x, y, 11, 0, 7); c.fill(); });
    const late = pitches.filter(p => p[key] > DMAX);
    if (late.length && sweep >= DMAX) { c.fillStyle = 'rgba(52,210,123,0.45)'; c.beginPath(); c.moveTo(AX1 + 14, base + 54); c.lineTo(AX1, base + 42); c.lineTo(AX1, base + 66); c.fill(); c.textAlign = 'right'; c.fillStyle = G5; c.fillText('still waiting', 900, y0 + 425); }
    // playhead
    if (sweep < DMAX) { c.strokeStyle = CREAM; c.lineWidth = 3; c.beginPath(); c.moveTo(dx(sweep), y0 + 96); c.lineTo(dx(sweep), y0 + 400); c.stroke(); }
    c.restore();
  }

  // ---------- draw ----------
  function draw(c, t) {
    c.fillStyle = BG; c.fillRect(0, 0, 1080, 1920);
    if (t < 1.8 || (t >= T0 && t < 18.1)) {
      const d = dayAt(t), cs = camState(t);
      c.save(); applyCam(c, cs); drawWorld(c, d, t, { hideHeroBall: t >= TEND }); c.restore();
      if (t >= TEND) { // lights out: color drains, only the green ball keeps it
        const g = L.sm(TEND, TEND + 0.35, t); c.save(); c.globalAlpha = g; c.globalCompositeOperation = 'saturation'; c.fillStyle = '#808080'; c.fillRect(0, 0, 1080, 1920); c.restore();
        c.fillStyle = `rgba(8,10,13,${0.45 * g})`; c.fillRect(0, 0, 1080, 1920);
        const h = heroState(t); c.save(); applyCam(c, cs); ball(c, h.ball.u, h.ball.v, h.ball.h, 1.5); c.restore();
      }
      hud(c, d, t >= TEND ? 1 - L.sm(TEND, TEND + 0.4, t) : 1);
      if (t < 1.8) { caption(c, "AND WE'RE LIVE.", 1, { size: 84 }); tag(c, 'LATER THIS SEASON', 104, 420, 44, RED); L.slate(c, 'SC1  CLOSE  FLASH-FORWARD'); }
      else if (t < 7) L.slate(c, 'SC2  CLOSE  HANDHELD CHASE');
      else if (t < 10.5) L.slate(c, 'SC3  CRANE UP');
      else if (t < 13.4) L.slate(c, 'SC3  WIDE');
      else if (t < 15.2) L.slate(c, 'SC4  DROP DOWN');
      else L.slate(c, 'SC4  CLOSE+');
      if (t >= 13.5 && t < 16.0) { const a = L.sm(13.5, 13.7, t) * (1 - L.sm(15.8, 16.0, t));
        L.title(c, [{ text: '32%', size: 230 }, { text: 'of the whole fall', size: 84 }, { text: 'in one month.', size: 84 }], 590, 84, { alpha: a }); }
    } else if (t >= 1.8 && t < T0) { // REWIND wipe (full frame)
      const f = (t - 1.8) / 0.4; c.fillStyle = '#e8e4da'; c.fillRect(0, 0, 1080, 1920);
      c.fillStyle = BG; for (let i = 0; i < 12; i++) c.fillRect(0, i * 160 + ((f * 900 + i * 37) % 160), 1080, 6);
      L.title(c, ['REWIND'], 900, 150, { col: '#101318', outline: false });
      L.label(c, 'back to the whistle', 540, 1010, 50, { col: '#3a404a' });
    } else if (t < 20.6) { // REPLAY: frozen gray wide
      const tf = 12.0; c.save(); c.translate(540, 990); c.scale(0.95, 0.95); c.translate(-540, -990); drawWorld(c, TROUGH, tf, {}); c.restore();
      c.save(); c.globalCompositeOperation = 'saturation'; c.fillStyle = '#808080'; c.fillRect(0, 0, 1080, 1920); c.restore();
      c.fillStyle = 'rgba(8,10,13,0.62)'; c.fillRect(0, 0, 1080, 1920);
      tag(c, 'INSTANT REPLAY', 104, 290, 52, CREAM, 'rgba(60,66,76,0.95)');
      const a = L.sm(18.3, 18.5, t);
      L.title(c, ['We slowed it down', 'so you could see it.'], 820, 96, { alpha: a });
      L.slate(c, 'SC5  REPLAY  LOCKED');
    } else if (t < 28.2) { // SNAP
      const hit = 21.1;
      if (t >= hit) {
        const a = L.sm(hit, hit + 0.15, t);
        const s1 = L.lerp(0, DMAX, L.clamp((t - hit) / 3.0, 0, 1)), s2 = L.lerp(0, DMAX, L.clamp((t - hit - 1.5) / 3.0, 0, 1));
        panel(c, 360, 'AS IT HAPPENED', null, 'arr', s1, a);
        panel(c, 850, 'ROUTED', null, 'ai', s2, L.sm(hit + 1.3, hit + 1.5, t));
        c.save(); c.globalAlpha = L.sm(hit + 1.3, hit + 1.5, t); c.font = `48px "${HAND}"`; c.fillStyle = GREEN; c.textAlign = 'left'; c.fillText('ILLUSTRATIVE', 330, 914); c.restore();
        L.label(c, 'same red in both', 540, 1360, 44, { col: G5, alpha: L.sm(hit + 4.6, hit + 4.8, t) * (1 - L.sm(25.55, 25.7, t)) });
      }
      L.slate(c, 'SC6  SNAP  LOCKED');
    } else if (t < 31.6) { // IN++: the pass
      const lt = t - 28.2, drop = L.sm(28.4, 28.9, t), pf = L.ease.inOut(L.clamp((t - 28.9) / 0.7, 0, 1));
      const hu = 22, hv = 16.2, from = [hu + 0.3, hv + 0.45], to = [22.3, 18.3];
      const bu = L.lerp(from[0], to[0], pf), bv = L.lerp(from[1], to[1], pf), bh = HP + Math.sin(pf * Math.PI) * 0.6;
      const [x0, y0] = P(22.1, 17.5, HP);
      c.save(); c.translate((L.noise(t * 1.6, 7) - 0.5) * 8, (L.noise(t * 1.6, 8) - 0.5) * 8);
      L.camera(c, [[0, [x0, y0 - 18, L.lerp(12, 15, L.ease.out(L.clamp(lt / 3.4, 0, 1))), 0]]], 0);
      drawWorld(c, 220, t, { wallDrop: drop, pass: true, heroPos: [hu, hv], heroBall: { u: bu, v: bv, h: bh }, heroMood: pf > 0.8 ? 'happy' : 'flat', noHub: true, noConnect: true });
      if (pf >= 1) { const [a1, b1] = P(from[0], from[1], HP + 0.5), [a2, b2] = P(to[0], to[1], HP + 0.5); c.strokeStyle = 'rgba(52,210,123,0.8)'; c.lineWidth = 0.8; c.beginPath(); c.moveTo(a1, b1); c.lineTo(a2, b2); c.stroke(); }
      c.restore();
      if (t >= 30.05) { c.fillStyle = `rgba(13,16,21,${0.55 * L.sm(30.05, 30.3, t)})`; c.fillRect(0, 0, 1080, 1920); L.title(c, ['This is the bottleneck.'], 560, 96, { alpha: L.sm(30.05, 30.3, t) }); }
      L.slate(c, 'SC7  EXTREME CLOSE  DOLLY IN');
    } else {
      L.endCard(c, L.sm(31.6, 31.9, t));
    }
    CAPS.forEach(([a, b, text]) => caption(c, text, capA(t, a, b)));
    L.grain(c, t, { alpha: 0.05, n: 500 });
  }

  const acts = [
    { start: 0, end: 2.2, bpm: 100, drone: true }, { start: 2.2, end: 7, bpm: 96, drone: true }, { start: 7, end: 10.5, bpm: 110, drone: true },
    { start: 10.5, end: 13.4, bpm: 138, drone: true }, { start: 13.4, end: 16.8, bpm: 160, drone: true }, { start: 16.8, end: 20.6, bpm: 0, drone: true },
    { start: 21.1, end: 28.2, bpm: 0, drone: true }, { start: 28.2, end: 31.6, bpm: 72, drone: true }, { start: 31.6, end: 36, bpm: 0, drone: true },
  ];
  const cues = [{ t: 1.8, type: 'whoosh' }, { t: 4.65, type: 'bonk' }, { t: 7.0, type: 'whoosh' }, { t: 12.28, type: 'hit' }, { t: 13.4, type: 'whoosh' },
    { t: 15.95, type: 'bonk' }, { t: 16.8, type: 'stamp' }, { t: 21.1, type: 'hit' }, { t: 29.3, type: 'pop' }, { t: 30.05, type: 'ding' }];
  return { draw, DUR, acts, cues };
}
if (typeof module !== 'undefined') module.exports = makeScene;
