// Shared toolkit for scenes. Usage inside a scene:
//   const L = require('../tools/lib.js')(SERIF, HAND);
// Everything is deterministic: pass t in, get pixels out.
module.exports = function (SERIF, HAND) {
  const L = {};
  L.clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  L.lerp = (a, b, f) => a + (b - a) * f;
  L.sm = (a, b, t) => { t = L.clamp((t - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
  L.ease = { inOut: f => f * f * (3 - 2 * f), out: f => 1 - Math.pow(1 - f, 3), in: f => f * f * f,
    back: f => { const c = 1.7; return 1 + (c + 1) * Math.pow(f - 1, 3) + c * Math.pow(f - 1, 2); } };
  L.rng = seed => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let x = Math.imul(seed ^ seed >>> 15, 1 | seed);
    x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; };
  L.noise = (x, s = 0) => { const i = Math.floor(x), f = x - i, h = n => { const v = Math.sin((n + s * 57.1) * 127.1) * 43758.5; return v - Math.floor(v); };
    return L.lerp(h(i), h(i + 1), f * f * (3 - 2 * f)); };

  // Keyframed value: keys = [[t, value], ...]; value may be a number or array.
  L.key = (keys, t, easeFn = L.ease.inOut) => {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 0; i < keys.length - 1; i++) { const [a, A] = keys[i], [b, B] = keys[i + 1];
      if (t <= b) { const f = easeFn((t - a) / (b - a)); return Array.isArray(A) ? A.map((v, k) => L.lerp(v, B[k], f)) : L.lerp(A, B, f); } }
    return keys[keys.length - 1][1];
  };
  // Camera: keys of [t, [x, y, zoom, rotation]] in design space (1080x1920). Call inside save/restore.
  L.camera = (ctx, keys, t) => { const [x, y, z, r] = L.key(keys, t); ctx.translate(540, 960); ctx.rotate(r || 0); ctx.scale(z, z); ctx.translate(-x, -y); };
  // Shots: [{start, end, draw(ctx, localT, dur, t)}] -> dispatches the active shot. Returns the shot index.
  L.shots = (ctx, shots, t) => { for (let i = 0; i < shots.length; i++) { const s = shots[i];
    if (t >= s.start && t < s.end) { ctx.save(); s.draw(ctx, t - s.start, s.end - s.start, t); ctx.restore(); return i; } } return -1; };

  // Hand-drawn wobble line (animatic look). Deterministic per seed; set boil>0 for "line boil" at ~8fps.
  L.sketchLine = (ctx, x1, y1, x2, y2, { w = 4, col = '#e8e4da', seed = 1, jitter = 3, t = 0, boil = 0 } = {}) => {
    const b = boil ? Math.floor(t * 8) : 0, n = Math.max(2, Math.floor(Math.hypot(x2 - x1, y2 - y1) / 40));
    ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.beginPath();
    for (let i = 0; i <= n; i++) { const f = i / n, j = (L.noise(i * 1.7, seed + b) - 0.5) * 2 * jitter;
      const nx = -(y2 - y1), ny = x2 - x1, nl = Math.hypot(nx, ny) || 1; const x = L.lerp(x1, x2, f) + nx / nl * j, y = L.lerp(y1, y2, f) + ny / nl * j;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); };
  L.sketchCircle = (ctx, x, y, r, { w = 4, col = '#e8e4da', seed = 1, jitter = 3, t = 0, boil = 0, fill } = {}) => {
    const b = boil ? Math.floor(t * 8) : 0; ctx.beginPath();
    for (let i = 0; i <= 24; i++) { const a = i / 24 * Math.PI * 2, rr = r + (L.noise(i * 0.9, seed + b) - 0.5) * 2 * jitter; const px = x + Math.cos(a) * rr, py = y + Math.sin(a) * rr; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); }
    if (fill) { ctx.fillStyle = fill; ctx.fill(); } ctx.strokeStyle = col; ctx.lineWidth = w; ctx.stroke(); };

  // Stick figure with a readable face. pose: {armL, armR (radians from down), legs (stride -1..1), lean, headTilt}
  // mood: happy | sad | panic | bored | angry | awe | glazed
  L.stick = (ctx, x, y, s = 1, { pose = {}, mood = 'happy', col = '#e8e4da', t = 0, seed = 1, boil = 0, look = [0, 0] } = {}) => {
    const o = { w: 4 * s, col, seed, t, boil, jitter: 1.5 * s }; const lean = pose.lean || 0;
    const hip = [x + lean * 10 * s, y], neck = [x + lean * 30 * s, y - 60 * s], head = [neck[0] + lean * 8 * s, neck[1] - 26 * s];
    L.sketchLine(ctx, hip[0], hip[1], neck[0], neck[1], o);
    const leg = (d, st) => L.sketchLine(ctx, hip[0], hip[1], hip[0] + d * 14 * s + st * 16 * s, y + 52 * s, o);
    leg(-1, pose.legs || 0); leg(1, -(pose.legs || 0));
    const arm = (d, a) => { const ang = Math.PI / 2 - d * a; L.sketchLine(ctx, neck[0], neck[1] + 8 * s, neck[0] + Math.cos(ang) * 46 * s * d * (d < 0 ? -1 : 1), neck[1] + 8 * s + Math.sin(ang) * 46 * s, o); };
    arm(-1, pose.armL ?? 0.4); arm(1, pose.armR ?? 0.4);
    L.sketchCircle(ctx, head[0], head[1], 22 * s, { ...o, fill: '#161a21' });
    const ex = 8 * s, ey = head[1] - 3 * s; ctx.fillStyle = col;
    if (mood === 'glazed') { ctx.fillRect(head[0] - ex - 4 * s, ey, 8 * s, 2.5 * s); ctx.fillRect(head[0] + ex - 4 * s, ey, 8 * s, 2.5 * s); }
    else { const er = (mood === 'panic' || mood === 'awe') ? 4 * s : 3 * s; [-1, 1].forEach(d => { ctx.beginPath(); ctx.arc(head[0] + d * ex + look[0] * 2 * s, ey + look[1] * 2 * s, er, 0, 7); ctx.fill(); }); }
    if (mood === 'angry') { ctx.strokeStyle = col; ctx.lineWidth = 2.5 * s; [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(head[0] + d * (ex + 6 * s), ey - 9 * s); ctx.lineTo(head[0] + d * (ex - 4 * s), ey - 5 * s); ctx.stroke(); }); }
    const my = head[1] + 9 * s; ctx.strokeStyle = col; ctx.lineWidth = 2.5 * s; ctx.beginPath();
    if (mood === 'happy') ctx.arc(head[0], my - 4 * s, 6 * s, 0.2 * Math.PI, 0.8 * Math.PI);
    else if (mood === 'sad') ctx.arc(head[0], my + 4 * s, 6 * s, 1.2 * Math.PI, 1.8 * Math.PI);
    else if (mood === 'panic' || mood === 'awe') { ctx.ellipse(head[0], my, 4 * s, (mood === 'panic' ? 6 : 4) * s, 0, 0, 7); }
    else { ctx.moveTo(head[0] - 6 * s, my); ctx.lineTo(head[0] + 6 * s, my); }
    ctx.stroke(); return { head, neck, hip };
  };

  // Text
  L.title = (ctx, lines, y, size = 110, { col = '#fffdf7', font = SERIF, alpha = 1, outline = true } = {}) => {
    ctx.save(); ctx.globalAlpha = alpha; ctx.textAlign = 'center'; let yy = y;
    lines.forEach((l, i) => { const L2 = typeof l === 'string' ? { text: l } : l; const fz = L2.size || size; if (i) yy += fz * 1.04;
      ctx.font = `${fz}px "${L2.font || font}"`; if (outline) { ctx.lineWidth = fz * 0.12; ctx.strokeStyle = '#0d1118'; ctx.lineJoin = 'round'; ctx.strokeText(L2.text, 540, yy); }
      ctx.fillStyle = L2.col || col; ctx.fillText(L2.text, 540, yy); }); ctx.restore(); };
  L.label = (ctx, text, x, y, size = 40, { col = '#e8e4da', font = HAND, alpha = 1, align = 'center' } = {}) => {
    ctx.save(); ctx.globalAlpha = alpha; ctx.font = `${size}px "${font}"`; ctx.textAlign = align; ctx.fillStyle = col; ctx.fillText(text, x, y); ctx.restore(); };
  // Animatic shot slate in the corner: "SC 3  WIDE  DOLLY IN"
  L.slate = (ctx, text) => { ctx.save(); ctx.globalAlpha = 0.55; ctx.font = `30px "${HAND}"`; ctx.fillStyle = '#e8e4da'; ctx.textAlign = 'left'; ctx.fillText(text, 60, 1860); ctx.restore(); };
  // Paper/grain texture that is cheap: sparse deterministic specks.
  L.grain = (ctx, t, { alpha = 0.06, n = 600, seed = 3 } = {}) => { const r = L.rng(seed + Math.floor(t * 12)); ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = '#ffffff';
    for (let i = 0; i < n; i++) ctx.fillRect(r() * 1080, r() * 1920, 2, 2); ctx.restore(); };
  // Orchestration ratio helper: vectors [[dx,dy],...] -> {sumOfLengths, lengthOfSum, ratio}
  L.orchestration = vs => { let sx = 0, sy = 0, sl = 0; vs.forEach(([x, y]) => { sx += x; sy += y; sl += Math.hypot(x, y); }); const ls = Math.hypot(sx, sy); return { sumOfLengths: sl, lengthOfSum: ls, ratio: sl ? ls / sl : 0, net: [sx, sy] }; };
  // ---- Speed math ----
  // Logistic spread: share (0..1) at time t, from a starting share s0 and a real doubling time (early phase).
  L.logistic = (t, doubling, s0 = 0.001) => { const r = Math.LN2 / doubling; const x = s0 * Math.exp(r * t); return x / (1 - s0 + x); };
  // Lognormal CDF: share of fragments that have connected by time t, given the median and a p90 (real variance).
  L.erf = x => { const s = Math.sign(x); x = Math.abs(x); const a1 = .254829592, a2 = -.284496736, a3 = 1.421413741, a4 = -1.453152027, a5 = 1.061405429, p = .3275911;
    const k = 1 / (1 + p * x); return s * (1 - (((((a5 * k + a4) * k) + a3) * k + a2) * k + a1) * k * Math.exp(-x * x)); };
  L.lognormalCDF = (t, median, p90) => { if (t <= 0) return 0; const sigma = Math.log(p90 / median) / 1.2816; return 0.5 * (1 + L.erf(Math.log(t / median) / (sigma * Math.SQRT2))); };
  // Per-fragment arrival time at quantile q (0..1), for giving each green fragment its own real-variance connection time.
  L.lognormalQuantile = (q, median, p90) => { const sigma = Math.log(p90 / median) / 1.2816; let lo = -8, hi = 8;
    for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; (0.5 * (1 + L.erf(m / Math.SQRT2)) < q) ? lo = m : hi = m; } return median * Math.exp(sigma * (lo + hi) / 2); };
  L.loadAnalog = id => JSON.parse(require('fs').readFileSync(require('path').join(__dirname, '..', 'research', 'analogs', id + '.json'), 'utf8'));
  // Map event time (analog units) to film seconds with ONE stated mapping: linear over [0, span] or log.
  L.mapTime = (tEvent, span, filmSeconds, mode = 'linear') => mode === 'log' ? filmSeconds * Math.log10(1 + tEvent) / Math.log10(1 + span) : filmSeconds * tEvent / span;
  L.unmapTime = (tFilm, span, filmSeconds, mode = 'linear') => mode === 'log' ? Math.pow(10, tFilm / filmSeconds * Math.log10(1 + span)) - 1 : tFilm / filmSeconds * span;
  L.RED = '#ff3b30'; L.GREEN = '#34d27b';

  // Project config (config.json) and a QR code that tags each video: <ctaUrl>?src=<scene slug>
  const path = require('path'), fs = require('fs');
  L.config = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'config.json'), 'utf8'));
  L.ctaUrl = () => { const u = L.config.ctaUrl; const slug = process.env.SCENE_SLUG || 'unknown'; return u + (u.includes('?') ? '&' : '?') + 'src=' + encodeURIComponent(slug); };
  let qrCache = null;
  L.qr = (ctx, x, y, size, { fg = '#0d1118', bg = '#fffdf7', pad = 4 } = {}) => {
    if (!qrCache) qrCache = require('qrcode').create(L.ctaUrl(), { errorCorrectionLevel: 'M' }).modules;
    const n = qrCache.size, cell = size / (n + pad * 2); ctx.fillStyle = bg; ctx.fillRect(x, y, size, size); ctx.fillStyle = fg;
    for (let r = 0; r < n; r++) for (let c = 0; c < n; c++) if (qrCache.get(r, c)) ctx.fillRect(x + (c + pad) * cell, y + (r + pad) * cell, Math.ceil(cell), Math.ceil(cell));
  };
  // Standard call-to-action end card. a = 0..1 fade. Keep it on screen at least 3 seconds.
  L.endCard = (ctx, a, { line = 'This is the bottleneck.', sub = L.config.ctaLine } = {}) => {
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#0d1118'; ctx.fillRect(0, 0, 1080, 1920);
    L.title(ctx, [line], 520, 104, { alpha: a }); L.qr(ctx, 340, 760, 400);
    L.label(ctx, sub, 540, 1290, 46, { alpha: a, col: '#e8e4da' }); L.label(ctx, 'scan to join', 540, 1350, 36, { alpha: a * 0.7, col: '#9aa0aa' }); ctx.restore(); };
  return L;
};
