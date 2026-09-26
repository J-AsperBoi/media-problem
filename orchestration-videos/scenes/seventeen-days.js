// seventeen-days ("Two Skies, One Clock"): split-screen-race, particle/data, cosmos, continuous zoom through scales.
// Analog: covid-2020. Every star is a country (217). Top sky: red on the analog's country-share points.
// Lake (the same sky mirrored): green per country on L.lognormalQuantile(median 421, p90 490), floored at day 343.
// Mapping: from t=4.2 s, day = 30*(t-4.2) (1 s = 30 days, linear), frozen at t=22. Snap: 1 s = 132 days. See output/seventeen-days/notes.md.
function makeScene(SERIF, HAND) {
  const L = require('../tools/lib.js')(SERIF, HAND);
  const A = L.loadAnalog('covid-2020');
  const DUR = 37, RED = L.RED, GREEN = L.GREEN;
  const N = 217, HZ = 960; // countries, horizon y (world)

  // ---------- time ----------
  const T0 = 4.2, DPS = 30, TFREEZE = 22.0;
  const dayAt = t => {
    if (t < 3.3) return 421;
    if (t < T0) return L.lerp(421, 0, L.ease.inOut((t - 3.3) / (T0 - 3.3)));
    return DPS * (Math.min(t, TFREEZE) - T0);
  };
  const tOfDay = d => T0 + d / DPS;

  // ---------- threat extent (analog points, piecewise linear, day-0 anchor = origin country) ----------
  const pts = [{ t: 0, extent: 1 / 234 }].concat(A.threat.points);
  const extent = d => { if (d < 0) return 0; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1]; if (d <= b.t) return L.lerp(a.extent, b.extent, (d - a.t) / (b.t - a.t)); } return pts[pts.length - 1].extent; };
  const dayOfExtent = q => { if (q <= pts[0].extent) return 0; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1]; if (q <= b.extent) return L.lerp(a.t, b.t, (q - a.extent) / (b.extent - a.extent)); } return Infinity; };

  // ---------- green ----------
  const F = {}; A.solution.fragments.forEach(f => F[f.id] = f.ready_at);
  const MED = A.solution.aggregation.median, P90 = A.solution.aggregation.p90;
  const AIMED = A.ai_counterfactual.aggregation_median; // 363, illustrative
  const FLOOR = F.f7; // 343: first dose outside trials
  const LATEST = 658; // observed latest first dose (analog notes)

  // ---------- stars ----------
  const r = L.rng(1717);
  const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const FACE = { x: 540, y: 948, hr: 2.2 };
  const crowd = []; for (let x = 246; x <= 834; x += 14) crowd.push({ x, h: 1 + (r() - 0.5) * 0.12, tilt: (r() - 0.5) * 0.3, me: x === 540 });
  const pos = [];
  const okPos = (x, y, md) => { for (const p of pos) if (Math.hypot(p.x - x, p.y - y) < md) return false; for (const c of crowd) if (Math.hypot(c.x - x, 948 - y) < 5) return false; return true; };
  // 34 stars in a log-radial halo around the protagonist's head (so every zoom level has stars), the rest spread over the sky
  let guard = 0;
  while (pos.length < 34 && guard++ < 5000) { const rad = Math.exp(L.lerp(Math.log(4.6), Math.log(140), r())), ang = L.lerp(-Math.PI + 0.25, -0.25, r());
    const x = FACE.x + Math.cos(ang) * rad, y = FACE.y + Math.sin(ang) * rad; if (y > 944) continue; if (okPos(x, y, rad * 0.55)) pos.push({ x, y }); }
  guard = 0;
  while (pos.length < N && guard++ < 50000) { const x = 50 + r() * 980, y = 60 + r() * 840; if (okPos(x, y, 44)) pos.push({ x, y }); }
  const qr = shuffle(Array.from({ length: N }, (_, i) => (i + 0.5) / N));
  const qg = shuffle(Array.from({ length: N }, (_, i) => (i + 0.5) / N));
  const stars = pos.map((p, i) => ({ x: p.x, y: p.y, ph: r() * 6.28, redDay: dayOfExtent(qr[i]), q: qg[i] }));
  // the protagonist's country: the median one (day 421)
  let meI = 0; stars.forEach((s, i) => { if (Math.abs(s.q - 0.5) < Math.abs(stars[meI].q - 0.5)) meI = i; });
  stars[meI].q = 0.5;
  stars.forEach(s => {
    s.gDay = s.q > 1 - 1 / N ? LATEST : Math.max(FLOOR, L.lognormalQuantile(s.q, MED, P90));
    s.aiDay = Math.max(FLOOR, s.gDay * AIMED / MED);
  });
  stars[0].redDay = 0; // origin
  // red parent: nearest star already red
  stars.forEach(s => { let best = null, bd = 1e9; stars.forEach(o => { if (o !== s && o.redDay < s.redDay) { const d = Math.hypot(o.x - s.x, o.y - s.y); if (d < bd) { bd = d; best = o; } } }); s.parent = best; });
  const ME = stars[meI];
  // fragments at the shore (lake side), under the crowd
  const frags = [['f1', -8, 972], ['f2', 8, 974], ['f3', -18, 982], ['f4', 18, 984], ['f5', -6, 992], ['f6', 10, 996], ['f7', 0, 986]]
    .map(([id, dx, y]) => ({ id, x: 540 + dx, y, day: Math.max(0, F[id]) }));
  const SRC = { x: 540, y: 986 };

  // ---------- camera: log zoom keyframes ----------
  const ZK = [[0, Math.log(110)], [3.3, Math.log(110)], [4.2, Math.log(55)], [5.3, Math.log(55)], [9.8, 0], [16.8, 0], [18.2, Math.log(170)], [19.8, Math.log(170)], [21.8, Math.log(1.25)], [99, Math.log(1.25)]];
  const EYE = { x: FACE.x + 0.78, y: FACE.y - 0.35 };
  const cam = t => {
    const z = Math.exp(L.key(ZK, t));
    const f = L.clamp(Math.log(z) / Math.log(40), 0, 1), fe = t > 16.8 && t < 21.8 ? L.clamp((Math.log(z) - Math.log(60)) / Math.log(170 / 60), 0, 1) : 0;
    const cx = L.lerp(L.lerp(540, FACE.x, f), EYE.x, fe), cy = L.lerp(L.lerp(HZ, FACE.y, f), EYE.y, fe);
    return { z, cx, cy, close: f };
  };

  // ---------- drawing helpers ----------
  const dot = (ctx, x, y, rad, col, a = 1) => { if (a <= 0) return; ctx.globalAlpha = a; ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x, y, rad, 0, 7); ctx.fill(); ctx.globalAlpha = 1; };
  const glowDot = (ctx, x, y, rad, col, a = 1, flare = 0) => { dot(ctx, x, y, rad * (3.2 + flare * 4), col, 0.10 * a); dot(ctx, x, y, rad * (1.8 + flare * 2), col, 0.22 * a); dot(ctx, x, y, rad, col, a); };
  const fade = (t, a, b, f = 0.3) => L.sm(a, a + f, t) * (1 - L.sm(b - f, b, t));
  function card(ctx, lines, y, size, a) {
    if (a <= 0) return; ctx.save(); ctx.globalAlpha = a; ctx.textAlign = 'center'; let yy = y;
    lines.forEach((l, i) => { const o = typeof l === 'string' ? { text: l } : l; let fz = o.size || size; ctx.font = `${fz}px "${SERIF}"`;
      while (ctx.measureText(o.text).width > 780 && fz > 30) { fz -= 3; ctx.font = `${fz}px "${SERIF}"`; }
      if (i) yy += fz * 1.1;
      ctx.lineJoin = 'round'; ctx.lineWidth = fz * 0.16; ctx.strokeStyle = 'rgba(6,8,12,0.9)'; ctx.strokeText(o.text, 490, yy);
      ctx.fillStyle = o.col || '#f2efe8'; ctx.fillText(o.text, 490, yy); });
    ctx.restore();
  }

  function person(ctx, sx, sy, k, c, t, day) {
    // sx, sy: screen position of head centre; k: pixels per world unit
    const hr = FACE.hr * k * c.h, a = c.me ? 1 : 0.9;
    ctx.save(); ctx.translate(sx, sy); ctx.rotate(c.me ? 0 : c.tilt * 0.3);
    // body: shoulders to feet
    ctx.fillStyle = c.me ? '#4b5059' : '#3a3e46';
    const top = 2.9 * k, feet = (HZ - FACE.y) * k, sw = 3.4 * k;
    ctx.beginPath(); ctx.moveTo(-sw, feet); ctx.lineTo(-sw, top + 1.4 * k); ctx.quadraticCurveTo(-sw, top, -sw + 1.4 * k, top); ctx.lineTo(sw - 1.4 * k, top); ctx.quadraticCurveTo(sw, top, sw, top + 1.4 * k); ctx.lineTo(sw, feet); ctx.closePath(); ctx.fill();
    ctx.fillRect(-0.7 * k, hr * 0.7, 1.4 * k, top - hr * 0.6);
    // head
    ctx.fillStyle = c.me ? '#8d939d' : '#666b74'; ctx.beginPath(); ctx.ellipse(0, 0, hr * 0.92, hr, 0, 0, 7); ctx.fill();
    if (k > 6) {
      const red = extent(day), meLit = day >= ME.gDay;
      // light from the red sky on the crown, from the lake on the chin
      ctx.save(); ctx.beginPath(); ctx.ellipse(0, 0, hr * 0.92, hr, 0, 0, 7); ctx.clip();
      ctx.globalAlpha = 0.55 * red; ctx.strokeStyle = RED; ctx.lineWidth = hr * 0.16; ctx.beginPath(); ctx.ellipse(0, hr * 0.05, hr * 0.92, hr, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.stroke();
      if (c.me && meLit) { ctx.globalAlpha = 0.35; ctx.strokeStyle = GREEN; ctx.lineWidth = hr * 0.1; ctx.beginPath(); ctx.ellipse(0, -hr * 0.03, hr * 0.92, hr, 0, Math.PI * 0.2, Math.PI * 0.8); ctx.stroke(); }
      ctx.restore();
      // eyes looking up
      [-1, 1].forEach(d => {
        const ex = d * hr * 0.34, ey = -hr * 0.12, er = hr * 0.2;
        ctx.fillStyle = '#e9e6de'; ctx.beginPath(); ctx.ellipse(ex, ey, er, er * 1.05, 0, 0, 7); ctx.fill();
        const px = ex + d * er * 0.05, py = ey - er * 0.38, pr = er * 0.62;
        ctx.fillStyle = '#12151b'; ctx.beginPath(); ctx.arc(px, py, pr, 0, 7); ctx.fill();
        // reflections: the red sky, and (if lit) their green star
        if (red > 0.02) { ctx.globalAlpha = Math.min(1, red * 1.2); ctx.strokeStyle = RED; ctx.lineWidth = pr * 0.16; ctx.beginPath(); ctx.arc(px, py, pr * 0.72, Math.PI * 1.15, Math.PI * 1.75); ctx.stroke(); ctx.globalAlpha = 1; }
        if (c.me && meLit) { const fl = 1 - L.sm(ME.gDay, ME.gDay + 20, day); glowDot(ctx, px + pr * 0.28, py - pr * 0.3, pr * 0.3, GREEN, 1, fl); }
        else { dot(ctx, px + pr * 0.3, py - pr * 0.32, pr * 0.12, '#cfd3da', 0.7); }
      });
      // mouth: a small "o" of awe
      ctx.strokeStyle = '#2a2e36'; ctx.lineWidth = hr * 0.05; ctx.beginPath(); ctx.ellipse(0, hr * 0.5, hr * 0.08, hr * 0.11, 0, 0, 7); ctx.stroke();
    }
    ctx.restore();
  }

  // ---------- the world (sky + lake + crowd), drawn through the camera ----------
  function world(ctx, t, day) {
    const { z, cx, cy, close } = cam(t);
    const P = (x, y) => [540 + (x - cx) * z, 960 + (y - cy) * z];
    const hy = P(0, HZ)[1];
    // background: sky above horizon, lake below
    const g = ctx.createLinearGradient(0, Math.min(hy, 1920) - 1400, 0, Math.min(hy, 1920));
    g.addColorStop(0, '#07090d'); g.addColorStop(1, '#131722'); ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1920);
    if (hy < 1920) { const gl = ctx.createLinearGradient(0, hy, 0, hy + 900); gl.addColorStop(0, '#10141c'); gl.addColorStop(1, '#06080b'); ctx.fillStyle = gl; ctx.fillRect(0, Math.max(0, hy), 1080, 1920); }
    const red = extent(day);
    let lit = 0; stars.forEach(s => { if (day >= s.gDay) lit++; }); const green = lit / N;
    // close-up ambient light: red from above, green from the lake below
    if (close > 0.02) {
      const gr = ctx.createLinearGradient(0, 0, 0, 900); gr.addColorStop(0, `rgba(255,59,48,${0.55 * red * close})`); gr.addColorStop(1, 'rgba(255,59,48,0)'); ctx.fillStyle = gr; ctx.fillRect(0, 0, 1080, 900);
      const gg = ctx.createLinearGradient(0, 1920, 0, 1300); gg.addColorStop(0, `rgba(52,210,123,${0.35 * green * close})`); gg.addColorStop(1, 'rgba(52,210,123,0)'); ctx.fillStyle = gg; ctx.fillRect(0, 1300, 1080, 620);
    }
    const srad = L.clamp(4.2 * Math.pow(z, 0.18), 4, 9);
    const on = (x, y, m = 60) => x > -m && x < 1080 + m && y > -m && y < 1980;
    // red spread lines (star to star)
    ctx.lineCap = 'round';
    stars.forEach(s => { if (!s.parent || day < s.redDay || day > s.redDay + 14) return; const a = 1 - (day - s.redDay) / 14; const [x1, y1] = P(s.parent.x, s.parent.y), [x2, y2] = P(s.x, s.y);
      ctx.globalAlpha = 0.6 * a; ctx.strokeStyle = RED; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); });
    ctx.globalAlpha = 1;
    // sky stars
    stars.forEach(s => { const [x, y] = P(s.x, s.y); if (!on(x, y)) return; const tw = 0.8 + 0.2 * Math.sin(t * 2.1 + s.ph);
      if (day >= s.redDay) { const fl = 1 - L.sm(s.redDay, s.redDay + 6, day); glowDot(ctx, x, y, srad * 1.15, RED, 1, fl); }
      else dot(ctx, x, y, srad * 0.7, '#7d838d', 0.75 * tw); });
    // lake: mirrored stars (reflection), routing threads, fragments
    if (hy < 1990) {
      // green routing threads from the assembled answer to each country
      const [sx, sy] = P(SRC.x, SRC.y);
      stars.forEach(s => { if (day < s.gDay - 8 || day > s.gDay + 10) return; const [x, y] = P(s.x, 2 * HZ - s.y);
        const f = L.clamp((day - (s.gDay - 8)) / 8, 0, 1), a = day > s.gDay ? 1 - (day - s.gDay) / 10 : 1;
        ctx.globalAlpha = 0.45 * a; ctx.strokeStyle = GREEN; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(L.lerp(sx, x, f), L.lerp(sy, y, f)); ctx.stroke(); });
      ctx.globalAlpha = 1;
      stars.forEach(s => { const [x, y] = P(s.x, 2 * HZ - s.y); if (!on(x, y)) return; const tw = 0.8 + 0.2 * Math.sin(t * 1.7 + s.ph * 1.3);
        if (day >= s.gDay) { const fl = 1 - L.sm(s.gDay, s.gDay + 8, day); glowDot(ctx, x, y, srad * 1.15, GREEN, 1, fl); }
        else dot(ctx, x, y, srad * 0.6, '#5d636d', 0.55 * tw); });
      // fragments: pieces of the answer, linked as they appear
      const fr = Math.max(3, 0.9 * z);
      const litF = frags.filter(f => day >= f.day);
      ctx.strokeStyle = GREEN; ctx.lineWidth = Math.max(1.2, 0.25 * z); ctx.globalAlpha = 0.55;
      for (let i = 1; i < litF.length; i++) { const [x1, y1] = P(litF[i - 1].x, litF[i - 1].y), [x2, y2] = P(litF[i].x, litF[i].y); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
      ctx.globalAlpha = 1;
      litF.forEach(f => { const [x, y] = P(f.x, f.y); if (on(x, y)) glowDot(ctx, x, y, fr, GREEN, 0.95, 1 - L.sm(f.day, f.day + 10, day)); });
      // horizon line / shoreline + the shared clock tick
      ctx.fillStyle = '#2b303a'; ctx.fillRect(0, hy - 1, 1080, 2);
      if (close < 0.3 && day >= 0) { const cxk = 80 + 920 * L.clamp(day / 660, 0, 1); dot(ctx, cxk, hy, 5, '#c9ccd2', 0.8 * (1 - close * 3)); }
    }
    // crowd on the shore
    crowd.forEach(c => { const [x, y] = P(c.x, FACE.y); if (x < -400 || x > 1480) return; person(ctx, x, y, z, c, t, day); });
    return { z, red, green };
  }

  function panel(ctx, ox, oy, w, h, day, ai, label, a) {
    ctx.save(); ctx.globalAlpha = a;
    ctx.fillStyle = '#080a0f'; ctx.fillRect(ox, oy, w, h); ctx.strokeStyle = '#3a404c'; ctx.lineWidth = 3; ctx.strokeRect(ox, oy, w, h);
    const hz = oy + h / 2; ctx.fillStyle = '#2b303a'; ctx.fillRect(ox, hz - 1, w, 2);
    const X = x => ox + 12 + (x / 1080) * (w - 24), Y = y => oy + 8 + (y / HZ) * (h / 2 - 12);
    stars.forEach(s => { const x = X(s.x), y = Y(s.y); if (day >= s.redDay) glowDot(ctx, x, y, 4.5, RED, a); else dot(ctx, x, y, 3, '#6b717b', 0.7 * a); });
    stars.forEach(s => { const d = ai ? s.aiDay : s.gDay; const x = X(s.x), y = hz + (hz - Y(s.y)); if (day >= d) glowDot(ctx, x, y, 4.5, GREEN, a, 1 - L.sm(d, d + 15, day)); else dot(ctx, x, y, 3, '#4d525b', 0.7 * a); });
    // half-lit marker on the clock axis (x = day)
    const med = ai ? AIMED : MED, mx = ox + (med / 660) * w;
    if (day >= med) { ctx.globalAlpha = a; ctx.fillStyle = GREEN; ctx.fillRect(mx - 2, hz - 26, 4, 52); L.label(ctx, 'half lit', mx - 12, oy + h - 22, 44, { col: GREEN, alpha: a, align: 'right', font: HAND }); }
    ctx.globalAlpha = a; L.label(ctx, label, ox + 6, oy - 20, 50, { col: '#e8e4da', alpha: a, align: 'left', font: SERIF });
    ctx.restore();
  }

  function draw(ctx, t) {
    ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
    if (t < 24.3) {
      const day = dayAt(t);
      world(ctx, t, day);
      // cards
      if (t < 3.3) { L.label(ctx, 'day 421', 490, 250, 56, { col: '#c9ccd2', font: SERIF, alpha: 0.9 });
        card(ctx, ['Every star is a country.'], 390, 92, fade(t, -1, 1.75, 0.25));
        card(ctx, [{ text: 'Above, the spread.', col: '#ff6a60' }, { text: 'Below, the answer.', col: '#5fe39a' }], 360, 88, fade(t, 1.75, 3.35, 0.25)); }
      card(ctx, ['From the first day.'], 390, 86, fade(t, 3.4, 5.1));
      card(ctx, [{ text: 'day 96:', col: '#ff6a60' }, 'nearly every star red'], 330, 84, fade(t, 7.3, 9.6));
      card(ctx, ['The answer was already here.'], 1420, 76, fade(t, 10.2, 12.5));
      card(ctx, [{ text: 'In pieces.', col: '#5fe39a' }], 1420, 96, fade(t, 12.7, 15.0));
      card(ctx, [{ text: 'day 421.', col: '#5fe39a' }, 'Their star lights.'], 330, 92, fade(t, 18.25, 19.9));
      card(ctx, ['Some waited far longer.'], 1440, 76, fade(t, 20.4, 22.1));
      // freeze
      if (t >= TFREEZE) { const f = L.sm(TFREEZE, TFREEZE + 0.4, t); ctx.fillStyle = `rgba(4,5,8,${0.6 * f})`; ctx.fillRect(0, 0, 1080, 1920);
        card(ctx, ['We slowed it down', 'so you could see it.'], 860, 96, fade(t, TFREEZE + 0.2, 23.95, 0.3));
        if (t > 23.9) { ctx.fillStyle = `rgba(0,0,0,${L.sm(23.9, 24.1, t)})`; ctx.fillRect(0, 0, 1080, 1920); } }
      const sl = t < 3.3 ? 'SC1 ECU FACE  cold open' : t < 4.2 ? 'SC2 CLOSE  REWIND' : t < 5.3 ? 'SC3 CLOSE' : t < 9.8 ? 'SC4 CONTINUOUS ZOOM OUT' : t < 16.8 ? 'SC5 WIDE  LOCKED' : t < 19.8 ? 'SC6 DOLLY IN  ECU EYE' : t < TFREEZE ? 'SC7 PULL OUT' : 'SC8 FREEZE';
      L.slate(ctx, sl);
    } else if (t < 33.2) {
      ctx.fillStyle = '#050608'; ctx.fillRect(0, 0, 1080, 1920);
      const rd = L.clamp((t - 24.6) * 132, 0, 660), a = L.sm(24.3, 24.5, t) * (1 - L.sm(31.0, 31.4, t) * 0.75);
      panel(ctx, 70, 330, 940, 560, rd, false, 'as it happened', a);
      panel(ctx, 70, 1110, 940, 560, rd, true, 'faster routing (illustrative)', a);
      // one clock across both panels
      const cxk = 70 + (rd / 660) * 940; ctx.globalAlpha = 0.55 * a; ctx.fillStyle = '#c9ccd2'; ctx.fillRect(cxk - 1.5, 330, 3, 1340); ctx.globalAlpha = 1;
      card(ctx, ['Same supply. Better routing.'], 990, 64, fade(t, 29.8, 31.3, 0.25));
      card(ctx, ['This is the bottleneck.'], 900, 104, fade(t, 31.3, 33.4, 0.3));
      L.slate(ctx, t < 31.2 ? 'SC9 SNAP  LOCKED  two clocks, true proportion' : 'SC10 NECK');
    } else {
      ctx.fillStyle = '#050608'; ctx.fillRect(0, 0, 1080, 1920);
      L.endCard(ctx, L.sm(33.2, 33.6, t));
    }
    L.grain(ctx, t, { alpha: 0.035, n: 350 });
  }

  return {
    draw, DUR,
    acts: [{ start: 0, end: 22.0, bpm: 0, drone: true }, { start: 9.8, end: 15.6, bpm: 54 }, { start: 24.3, end: 37, bpm: 0, drone: true }],
    cues: [{ t: 3.3, type: 'whoosh' }, { t: 5.3, type: 'whoosh' }, { t: tOfDay(ME.gDay), type: 'ding' }, { t: 24.3, type: 'hit' }, { t: 24.6 + AIMED / 132, type: 'pop' }, { t: 24.6 + MED / 132, type: 'pop' }],
    _debug: { meDay: ME.gDay, n: stars.length, red96: extent(96), lateDark: stars.filter(s => s.gDay > 534).length, aiFloor: stars.filter(s => s.aiDay === FLOOR).length }
  };
}
module.exports = makeScene;
