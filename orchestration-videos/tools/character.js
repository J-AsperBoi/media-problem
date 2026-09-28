// Ari: the studio's one central character, drawn entirely in code.
// Spec: research/FILM_GRAMMAR.md section 3. Plain-language guide: tools/character.md.
//
// Usage inside a scene:
//   const L = require('../tools/lib.js')(SERIF, HAND);        // (../../tools from scenes/snippets/)
//   const A = require('../tools/character.js')(L);
//   A.ari(ctx, 540, 1700, 1, { expression: 'worry', hold: true, t });
//
// Coordinates: framing 'full' (default) puts Ari's FEET at (x, y); scale 1 = 1150 px tall.
// Other framings ('waist', 'close', 'eyes-ecu') put the CENTRE OF THAT SHOT at (x, y);
// scale 1 then fills a 1080x1920 frame the standard way (see A.FRAMING).
// Pure function of t: no Math.random, no state kept between frames.
module.exports = (L) => {
  const A = {};
  const TAU = Math.PI * 2, clamp = L.clamp, lerp = L.lerp;

  // ---------- palette: Ari is grays; only the fragment is saturated ----------
  const P = A.PALETTE = {
    skin: '#bdb6ab', skinShade: '#a39c91', nose: '#8d867c', outline: '#e8e4da', edge: 'rgba(18,20,26,0.55)',
    hair: '#3a3d44', hairHi: '#4a4e57', hoodie: '#6b6f78', hoodieShade: '#5a5e67', hoodieDark: '#4f535b', strings: '#a9adb4',
    trousers: '#4a4d55', trousersShade: '#40434a', shoe: '#2c2f35', sole: '#5d616a', white: '#f4f1ea', pupil: '#1a1d23', iris: '#5b5f68',
    ink: '#2a2c32', silhouette: '#9aa0aa', bg: '#161a21', green: L.GREEN, greenHi: '#a6f5c8',
  };

  // ---------- expressions (dials) ----------
  // brow: degrees, + = resolve (inner ends down), - = worry (inner ends up). browY: px, + = raised.
  // white: eye-white area (1 = 56x64 px). pupil: px diameter. lid: 0..0.45 of the eye covered by the upper lid.
  // mouth: curve -1 (down) .. +1 (up). open: 0 = a line, 1 = a tall oval (0.5 = small oval).
  A.EXPRESSIONS = {
    calm:       { brow: 0,   browY: 0,  white: 1.0,  pupil: 22, lid: 0.15, mouth: 0.2,  open: 0 },
    notice:     { brow: 5,   browY: 10, white: 1.15, pupil: 20, lid: 0.05, mouth: 0,    open: 0 },
    worry:      { brow: -20, browY: 2,  white: 1.2,  pupil: 18, lid: 0.05, mouth: -0.4, open: 0 },
    fear:       { brow: -25, browY: 18, white: 1.5,  pupil: 14, lid: 0,    mouth: -0.3, open: 1 },
    awe:        { brow: -8,  browY: 18, white: 1.3,  pupil: 24, lid: 0,    mouth: 0,    open: 0.5 },
    grief:      { brow: -22, browY: -6, white: 0.9,  pupil: 22, lid: 0.4,  mouth: -0.8, open: 0 },
    resolve:    { brow: 15,  browY: -8, white: 1.0,  pupil: 22, lid: 0.2,  mouth: 0,    open: 0 },
    tenderness: { brow: -10, browY: 0,  white: 1.0,  pupil: 28, lid: 0.25, mouth: 0.5,  open: 0 },
  };
  A.EXPRESSION_NAMES = Object.keys(A.EXPRESSIONS);

  // ---------- pose dials ----------
  // armL/armR: 0 = hanging, 0.5 = straight out, 1 = straight up (ignored while holding).
  // headTilt: radians (+ = clockwise). lean: -1..1 (whole upper body). slump: 0..1 (defeat).
  // turn: -1..1 (0 = front, 0.55 = three-quarter facing screen right, -0.55 = facing left).
  A.POSE = { armL: 0, armR: 0, headTilt: 0, lean: 0, slump: 0, turn: 0 };

  // Blend two dial sets (works for expressions and poses).
  A.mix = (a, b, f) => { const o = {}; for (const k in a) o[k] = (k in b && typeof a[k] === 'number') ? lerp(a[k], b[k], f) : a[k]; for (const k in b) if (!(k in o)) o[k] = b[k]; return o; };
  // Resolve a preset name, a raw dial object, or {preset:'fear', lid:0.3} into full dials.
  A.expr = e => {
    if (!e) return { ...A.EXPRESSIONS.calm };
    if (typeof e === 'string') { if (!A.EXPRESSIONS[e]) throw new Error('Ari: unknown expression "' + e + '"'); return { ...A.EXPRESSIONS[e] }; }
    const base = e.preset ? A.expr(e.preset) : { ...A.EXPRESSIONS.calm }; const o = { ...base, ...e }; delete o.preset; return o;
  };
  A.pose = p => ({ ...A.POSE, ...(typeof p === 'object' && p ? p : {}) });
  // Keyframed dials over time: keys = [[time, value], ...]. Each change blends in over `blend` seconds
  // (ease out), starting from wherever the previous blend had got to. Pure function of t.
  A.at = (keys, t, resolve = A.expr, blend = 0.3, ease = L.ease.out) => {
    let i = -1; for (let k = 0; k < keys.length; k++) if (t >= keys[k][0]) i = k;
    if (i <= 0) return resolve(keys[0][1]);
    const from = A.at(keys.slice(0, i), keys[i][0], resolve, blend, ease), to = resolve(keys[i][1]);
    return A.mix(from, to, ease(clamp((t - keys[i][0]) / blend, 0, 1)));
  };
  A.exprAt = (keys, t, blend = 0.3) => A.at(keys, t, A.expr, blend);
  A.poseAt = (keys, t, blend = 0.5) => A.at(keys, t, A.pose, blend, L.ease.inOut);

  // ---------- framing ----------
  // zoom = how much bigger than the full-body shot; cy = which body height (local px above the feet) sits at the frame centre.
  A.FRAMING = {
    full:       { zoom: 1,   cy: -575 },  // whole body, 1150 px tall
    waist:      { zoom: 1.8, cy: -820 },  // head to hips
    close:      { zoom: 3,   cy: -960 },  // head and collar
    'eyes-ecu': { zoom: 5,   cy: -1000 }, // eyes fill the width
  };
  // Camera keyframe [x, y, zoom] for L.camera, framing an Ari whose feet are at (x, y) at `scale`.
  // Lets a film push in from 'full' to 'eyes-ecu' with L.camera keys instead of redrawing Ari.
  A.cameraFor = (framing, x, y, scale = 1) => { const f = A.FRAMING[framing] || A.FRAMING.full; return [x, y + f.cy * scale, f.zoom]; };

  // ---------- small helpers ----------
  const hash = (n, s = 0) => { const v = Math.sin((n + s * 13.37) * 91.7 + 7.1) * 43758.5453; return v - Math.floor(v); };
  // Blink: one quick blink every 3.6 s window at a seeded moment. Returns 0..1 (1 = eyes shut).
  A.blink = (t, seed = 1) => { const W = 3.6, k = Math.floor(t / W), bt = k * W + 0.5 + hash(k, seed) * 2.4, d = Math.abs(t - bt); return d < 0.09 ? 1 - L.ease.inOut(d / 0.09) : 0; };
  A.breath = t => Math.sin(t * TAU / 3.8);  // 16 breaths a minute, calm

  function poly(ctx, pts) { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); }
  function smoothPoly(ctx, pts) { // closed curve through midpoints (smooth, no Path2D needed)
    const n = pts.length; ctx.beginPath(); const m = i => [(pts[i % n][0] + pts[(i + 1) % n][0]) / 2, (pts[i % n][1] + pts[(i + 1) % n][1]) / 2];
    const s = m(n - 1); ctx.moveTo(s[0], s[1]); for (let i = 0; i < n; i++) { const e = m(i); ctx.quadraticCurveTo(pts[i][0], pts[i][1], e[0], e[1]); } ctx.closePath(); }
  // Draw a closed shape in one of two passes: 'o' = light silhouette outline, 'f' = fill + faint inner edge.
  function shape(ctx, mode, build, fill, ol, edge = true) {
    build(ctx); ctx.lineJoin = 'round';
    if (mode === 'o') { ctx.lineWidth = ol * 2; ctx.strokeStyle = P.outline; ctx.stroke(); ctx.fillStyle = P.outline; ctx.fill(); }
    else { ctx.fillStyle = fill; ctx.fill(); if (edge) { ctx.lineWidth = 3; ctx.strokeStyle = P.edge; ctx.stroke(); } }
  }
  // A thick rounded stroke (sleeve, trouser leg) in the same two passes.
  function limb(ctx, mode, pts, w, col, ol) {
    ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    if (mode === 'o') { ctx.lineWidth = w + ol * 2; ctx.strokeStyle = P.outline; ctx.stroke(); }
    else { ctx.lineWidth = w; ctx.strokeStyle = P.edge; ctx.stroke(); ctx.lineWidth = w - 5; ctx.strokeStyle = col; ctx.stroke(); }
  }

  // Head outline: a soft rounded rectangle, a little wider at the cheeks. Centre (0,0), 290 x 300.
  function headPts(grow = 0, turn = 0) {
    const pts = [], n = 64;
    for (let i = 0; i < n; i++) {
      const a = i / n * TAU, c = Math.cos(a), s = Math.sin(a);
      let x = Math.sign(c) * Math.pow(Math.abs(c), 0.72) * (145 + grow), y = Math.sign(s) * Math.pow(Math.abs(s), 0.78) * (150 + grow);
      const v = y / 150; x *= 1 - 0.07 * Math.max(0, -v) - 0.14 * Math.pow(Math.max(0, v), 2.2); // narrower crown, rounder chin
      x -= turn * 10 * (1 - Math.abs(v)) * Math.sign(x) * (x * turn < 0 ? -0.6 : 1); // back of head bulges in 3/4
      pts.push([x, y]);
    }
    return pts;
  }
  // Hair fringe height at x (local head coords): a soft sweep, lower on the tuft side.
  const fringe = (x, turn) => { const u = (x - turn * 40) / 150;
    return -74 + 30 * Math.pow(Math.abs(u), 3) + 9 * u - 6 * Math.pow(Math.abs(Math.sin(u * 7.5 + 0.4)), 0.7); }; // longer at the temples, a gentle sweep, soft scallops

  // Mitten hand: wrist at (0,0) pointing down local +y. side = +1 thumb on local +x.
  const HW = 98, HLEN = 122;
  function mitten(ctx, mode, wx, wy, ang, side, col, ol, fingers) {
    ctx.save(); ctx.translate(wx, wy); ctx.rotate(ang - Math.PI / 2);
    const thumb = c => { c.beginPath(); c.ellipse(side * HW * 0.42, HLEN * 0.28, 21, 40, -side * 0.55, 0, TAU); };
    shape(ctx, mode, thumb, col, ol);
    shape(ctx, mode, c => { c.beginPath(); c.roundRect(-HW / 2, -8, HW, HLEN, [HW * 0.3, HW * 0.3, HW * 0.5, HW * 0.5]); }, col, ol);
    if (mode === 'f' && fingers) { ctx.strokeStyle = P.edge; ctx.lineWidth = 3; ctx.lineCap = 'round';
      for (let k = -1; k <= 1; k++) { ctx.beginPath(); ctx.moveTo(k * HW * 0.22 - side * 6, HLEN * 0.72); ctx.lineTo(k * HW * 0.22 - side * 6, HLEN - 12); ctx.stroke(); } }
    ctx.restore();
  }

  // The green fragment: an irregular shard, 70 px, with a soft glow. glow 0..2.
  const SHARD = [[0, -46], [24, -26], [34, 4], [18, 38], [-6, 44], [-30, 18], [-28, -18]];
  A.fragment = (ctx, x, y, s = 1, { glow = 1, t = 0, rot = 0 } = {}) => {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    const pulse = 1 + 0.04 * Math.sin(t * TAU / 1.9), R = 115 * (0.7 + 0.35 * glow) * pulse;
    if (glow > 0) { const g = ctx.createRadialGradient(0, 0, 10, 0, 0, R); g.addColorStop(0, `rgba(52,210,123,${(0.42 * Math.min(glow, 2) / 2 + 0.12 * glow).toFixed(3)})`); g.addColorStop(1, 'rgba(52,210,123,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, R, 0, TAU); ctx.fill(); }
    ctx.rotate(rot + 0.05 * Math.sin(t * 1.3));
    poly(ctx, SHARD); ctx.fillStyle = P.green; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = P.greenHi; ctx.lineJoin = 'round'; ctx.stroke();
    poly(ctx, [[0, -46], [24, -26], [6, -4], [-28, -18]]); ctx.fillStyle = 'rgba(166,245,200,0.55)'; ctx.fill();
    ctx.restore();
  };

  // Far-away fallback: silhouette + big tuft + green dot (readable at ~3% of frame height).
  function silhouette(ctx, hold, glow, turn) {
    ctx.fillStyle = P.silhouette;
    ctx.beginPath(); ctx.roundRect(-78, -330, 156, 330, [30, 30, 12, 12]); ctx.fill();          // hoodie + legs block
    ctx.beginPath(); ctx.ellipse(0, -420, 110, 115, 0, 0, TAU); ctx.fill();                     // head
    ctx.save(); ctx.translate(-40 - turn * 20, -515); ctx.beginPath(); ctx.moveTo(-30, 10); ctx.quadraticCurveTo(-60, -60, -95, -120);
    ctx.quadraticCurveTo(-20, -90, 40, 5); ctx.closePath(); ctx.fill(); ctx.restore();          // tuft, exaggerated
    ctx.fillStyle = P.bg; ctx.fillRect(-6, -150, 12, 150);                                       // leg gap
    if (hold) { const g = ctx.createRadialGradient(0, -250, 0, 0, -250, 140); g.addColorStop(0, `rgba(52,210,123,${0.5 * glow})`); g.addColorStop(1, 'rgba(52,210,123,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, -250, 140, 0, TAU); ctx.fill(); ctx.fillStyle = P.green; ctx.beginPath(); ctx.arc(0, -250, 48, 0, TAU); ctx.fill(); }
  }

  // ---------- the character ----------
  // opts: framing, expression (name | dials | {preset,...} | keyframes [[t, name], ...]), exprBlend,
  //       pose (dials | keyframes), poseAt (fn t -> pose, gives the tuft its lag), look [x,y] -1..1,
  //       hold (bool: cupped hands), fragment (bool, default = hold), glow (0..2), t, idle (bool), blink (bool), seed.
  A.ari = (ctx, x, y, scale = 1, opts = {}) => {
    const t = opts.t || 0, idle = opts.idle !== false, seed = opts.seed || 1;
    const fr = A.FRAMING[opts.framing || 'full'] || A.FRAMING.full;
    const E = Array.isArray(opts.expression) ? A.exprAt(opts.expression, t, opts.exprBlend || 0.3) : A.expr(opts.expression);
    const poseFn = opts.poseAt || (Array.isArray(opts.pose) ? (tt => A.poseAt(opts.pose, tt)) : null);
    const Pz = poseFn ? A.pose(poseFn(t)) : A.pose(opts.pose);
    const look = opts.look || [0, 0], hold = !!opts.hold, showFrag = opts.fragment ?? hold, glow = opts.glow ?? 1;
    const T = clamp(Pz.turn, -1, 1), aT = Math.abs(T);

    ctx.save();
    ctx.translate(x, y);
    const k = scale * fr.zoom; ctx.scale(k, k);
    if (opts.framing && opts.framing !== 'full') ctx.translate(0, -fr.cy);
    const m = ctx.getTransform(), screenK = Math.sqrt(Math.abs(m.a * m.d - m.b * m.c));
    if (1150 * screenK < 60) { silhouette(ctx, hold && showFrag, glow, T); ctx.restore(); return; }
    const ol = Math.max(5, 1.6 / screenK); // 5 px at zoom 1, never thinner than ~1.6 screen px
    const fine = screenK > 1.6;             // extra detail (fingers) in close shots

    // idle motion and dials
    const br = idle ? A.breath(t) : 0, S = clamp(Pz.slump, 0, 1);
    const shoulderY = -815 + S * 30 - br * 3, lean = clamp(Pz.lean, -1, 1) * 0.18;
    const headCX = T * 6, headCY = -1000 + S * 55 - br * 4.5, neckBase = [0, -850 + S * 30 - br * 3];
    const tilt = Pz.headTilt + (idle ? 0.012 * Math.sin(t * 0.9 + seed) : 0) + S * 0.05;
    let tuftSway = idle ? 0.05 * Math.sin(t * 1.7 + seed) : 0;
    if (poseFn) { const p0 = A.pose(poseFn(t - 0.1)); tuftSway += 1.1 * ((p0.headTilt - Pz.headTilt) + (p0.lean - Pz.lean) * 0.18) - 0.6 * (p0.turn - Pz.turn); }
    const blinkAmt = (opts.blink !== false && idle) ? A.blink(t, seed) : 0;
    const armsDown = S * 0.06;

    // arm geometry (not holding): shoulder -> elbow -> wrist, raise 0..1
    const arm = d => {
      const raise = clamp(d < 0 ? Pz.armL : Pz.armR, 0, 1), a = 0.1 - armsDown + raise * Math.PI * 0.95;
      const sx = d * (118 - (d * T > 0 ? 34 : 0) * aT) + T * 20, sy = shoulderY + 10;
      const ex = sx + d * Math.sin(a) * 170, ey = sy + Math.cos(a) * 170;
      const a2 = a - 0.18 * (1 - raise * 0.6);
      const wx = ex + d * Math.sin(a2) * 150, wy = ey + Math.cos(a2) * 150;
      return { pts: [[sx, sy], [ex, ey], [wx, wy]], ang: Math.atan2(wy - ey, wx - ex) };
    };
    const holdArm = d => ({ pts: [[d * (118 - (d * T > 0 ? 34 : 0) * aT) + T * 20, shoulderY + 10], [d * 158 + T * 10, -640 + S * 20], [d * 112 + T * 18, -598 + S * 22]] });
    const far = d => d * T > 0.2; // this arm/eye is on the far side in a 3/4 view

    const parts = [];
    // arms behind the torso (far side in 3/4)
    const drawArm = (mode, d) => {
      if (hold) { limb(ctx, mode, holdArm(d).pts, 68, P.hoodie, ol); return; }
      const g = arm(d); limb(ctx, mode, g.pts, 68, P.hoodie, ol);
      const [wx, wy] = g.pts[2]; mitten(ctx, mode, wx, wy, g.ang, -d, P.skin, ol, fine);
    };
    // legs + shoes (never lean)
    parts.push(mode => {
      [-1, 1].sort((a, b) => (far(a) ? -1 : 0) - (far(b) ? -1 : 0)).forEach(d => {
        const lx = d * (54 - T * d * 22) + T * 16;
        shape(ctx, mode, c => { c.beginPath(); c.moveTo(lx - 50, -478); c.lineTo(lx + 50, -478); c.quadraticCurveTo(lx + 46 + d * 4, -250, lx + 40 + d * 6, -50);
          c.lineTo(lx - 40 + d * 6, -50); c.quadraticCurveTo(lx - 46 + d * 4, -250, lx - 50, -478); c.closePath(); }, P.trousers, ol);
        const sx = lx + d * 12 * (1 - aT) + T * 44;
        shape(ctx, mode, c => { c.beginPath(); c.roundRect(sx - 64, -66, 128, 66, [34, 34, 16, 16]); }, P.shoe, ol);
        if (mode === 'f') { ctx.fillStyle = P.sole; ctx.fillRect(sx - 60, -15, 120, 8); }
      });
    });
    // upper body under lean
    parts.push(mode => {
      ctx.save(); ctx.translate(0, -460); ctx.rotate(lean); ctx.translate(0, 460);
      [-1, 1].forEach(d => { if (far(d)) drawArm(mode, d); });
      // hood (down) lying behind the neck
      shape(ctx, mode, c => { c.beginPath(); c.ellipse(T * -50, shoulderY - 30, 112, 40, 0, 0, TAU); }, P.hoodieShade, ol);
      // neck
      shape(ctx, mode, c => { c.beginPath(); c.roundRect(-36 + T * 12, neckBase[1] - 40, 72, 70, 20); }, P.skinShade, ol);
      // torso: rounded trapezoid hoodie
      const sw = 128 * (1 - 0.1 * aT), hw = 120 * (1 - 0.1 * aT), tx = T * 18, top = shoulderY;
      const torso = c => { c.beginPath(); c.moveTo(tx - 60, top - 26);
        c.quadraticCurveTo(tx - sw, top - 18, tx - sw - 4, top + 50); c.lineTo(tx - hw, -478); c.quadraticCurveTo(tx - hw, -448, tx - hw + 26, -448);
        c.lineTo(tx + hw - 26, -448); c.quadraticCurveTo(tx + hw, -448, tx + hw, -478); c.lineTo(tx + sw + 4, top + 50);
        c.quadraticCurveTo(tx + sw, top - 18, tx + 60, top - 26); c.closePath(); };
      shape(ctx, mode, torso, P.hoodie, ol);
      if (mode === 'f') {
        ctx.save(); torso(ctx); ctx.clip(); ctx.fillStyle = 'rgba(40,43,50,0.22)'; ctx.beginPath(); // side shade gives volume; widens on the far side when turned
        ctx.moveTo(tx + sw * (0.62 - 0.6 * T), top - 40); ctx.quadraticCurveTo(tx + sw * (0.5 - 0.6 * T), -640, tx + hw * (0.6 - 0.6 * T), -440); ctx.lineTo(tx + 200, -440); ctx.lineTo(tx + 200, top - 40); ctx.fill(); ctx.restore();
        const cx = tx + T * 62;
        ctx.fillStyle = P.hoodieShade; ctx.beginPath(); ctx.roundRect(tx - hw + 2, -486, hw * 2 - 4, 36, [0, 0, 24, 24]); ctx.fill(); // hem band
        ctx.strokeStyle = P.hoodieDark; ctx.lineWidth = 22; ctx.lineCap = 'round'; ctx.beginPath();                                   // collar U
        ctx.moveTo(cx - 64, top - 22); ctx.quadraticCurveTo(cx, top + 62, cx + 64, top - 22); ctx.stroke();
        ctx.strokeStyle = P.strings; ctx.lineWidth = 6; [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(cx + d * 20, top + 26); ctx.quadraticCurveTo(cx + d * 24, top + 70, cx + d * 20 + T * 6, top + 104); ctx.stroke();
          ctx.fillStyle = P.strings; ctx.beginPath(); ctx.arc(cx + d * 20 + T * 6, top + 108, 6, 0, TAU); ctx.fill(); });
        if (!hold) { ctx.strokeStyle = P.hoodieDark; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(cx - 78, -505); ctx.lineTo(cx - 62, -610); ctx.lineTo(cx + 62, -610); ctx.lineTo(cx + 78, -505); ctx.stroke(); } // pocket
      }
      [-1, 1].forEach(d => { if (!far(d)) drawArm(mode, d); });
      ctx.restore();
    });
    // head (with hair, tuft, face), under lean + tilt
    parts.push(mode => {
      ctx.save(); ctx.translate(0, -460); ctx.rotate(lean); ctx.translate(0, 460);
      ctx.translate(neckBase[0], neckBase[1]); ctx.rotate(tilt); ctx.translate(-neckBase[0], -neckBase[1]);
      ctx.translate(headCX, headCY);
      // ear (3/4 only, on the side we see more of)
      if (aT > 0.15) shape(ctx, mode, c => { c.beginPath(); c.ellipse(-Math.sign(T) * 136, 22, 18 * Math.min(1, aT * 1.6), 30, 0, 0, TAU); }, P.skinShade, ol);
      // tuft (silhouette signature), sways from its base
      const tuft = c => { c.save(); c.translate(-52 - T * 30, -146); c.rotate(tuftSway - 0.05); c.beginPath(); c.moveTo(-34, 10);
        c.quadraticCurveTo(-44, -38, -86, -76); c.quadraticCurveTo(-60, -80, -34, -62); c.quadraticCurveTo(-18, -58, 2, -84);
        c.quadraticCurveTo(14, -40, 30, 8); c.closePath(); c.restore(); };
      shape(ctx, mode, tuft, P.hair, ol);
      const hp = headPts(0, T);
      shape(ctx, mode, c => smoothPoly(c, hp), P.skin, ol, true);
      // hair cap: head outline grown a little, above the fringe line
      const cap = headPts(7, T).map(([px, py]) => [px, py - 3]).filter(([px, py]) => py < fringe(px, T)); cap.sort((a, b) => Math.atan2(a[1], a[0]) - Math.atan2(b[1], b[0]));
      const capPts = []; for (let i = 0; i <= 90; i++) { const px = lerp(cap[cap.length - 1][0], cap[0][0], i / 90); capPts.push([px, fringe(px, T)]); }
      const capPoly = cap.concat(capPts);
      if (mode === 'o') { shape(ctx, mode, c => poly(c, capPoly), P.hair, ol); }
      else {
        // skin shading under the cap + green wash from the fragment on the chin
        ctx.save(); smoothPoly(ctx, hp); ctx.clip();
        const sh = ctx.createLinearGradient(0, -90, 0, -30); sh.addColorStop(0, 'rgba(110,102,92,0.35)'); sh.addColorStop(1, 'rgba(110,102,92,0)'); ctx.fillStyle = sh; ctx.fillRect(-160, -90, 320, 60);
        const side = ctx.createLinearGradient(40 - T * 120, 0, 150, 0); side.addColorStop(0, 'rgba(110,102,92,0)'); side.addColorStop(1, 'rgba(110,102,92,0.22)'); ctx.fillStyle = side; ctx.fillRect(-160, -160, 320, 320);
        if (hold && showFrag && glow > 0) { const g = ctx.createLinearGradient(0, 150, 0, 40); g.addColorStop(0, `rgba(52,210,123,${(0.25 * Math.min(glow, 2)).toFixed(3)})`); g.addColorStop(1, 'rgba(52,210,123,0)'); ctx.fillStyle = g; ctx.fillRect(-160, 30, 320, 130); }
        ctx.restore();
        poly(ctx, capPoly); ctx.fillStyle = P.hair; ctx.fill();
        ctx.strokeStyle = P.hairHi; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(40 + T * 30, -128); ctx.quadraticCurveTo(80 + T * 20, -118, 100 + T * 10, -92); ctx.stroke(); // soft sheen
        drawFace(ctx);
      }
      ctx.restore();
    });
    // cupped hands + the fragment
    if (hold) parts.push(mode => {
      ctx.save(); ctx.translate(0, -460); ctx.rotate(lean); ctx.translate(0, 460);
      const fx = T * 14, fy = -665 + S * 22;
      if (mode === 'f' && showFrag) A.fragment(ctx, fx, fy, 1, { glow, t: idle ? t : 0 });
      [-1, 1].forEach(d => { const w = holdArm(d).pts[2]; mitten(ctx, mode, w[0], w[1], d < 0 ? -0.22 : Math.PI + 0.22, d < 0 ? 1 : -1, P.skin, ol, fine); });
      ctx.restore();
    });

    // face: eyes (the main instrument), brows, mouth, 3/4 nose tick
    function drawFace(c) {
      const fx = T * 62, py = S * 12; // features slide with turn, drop with slump (head pitches down)
      [-1, 1].forEach(d => {
        const fs = far(d) ? 1 - 0.38 * aT : 1 + 0.06 * aT;
        const ex = fx + d * 55 * (1 - 0.18 * aT) + (far(d) ? -d * 6 : 0), ey = 20 + py;
        const ew = 56 * Math.pow(E.white, 0.42) * fs, eh = 64 * Math.pow(E.white, 0.6);
        const lid = clamp(E.lid + blinkAmt * (1 - E.lid), 0, 1);
        c.save(); c.beginPath(); c.ellipse(ex, ey, ew / 2, eh / 2, 0, 0, TAU); c.fillStyle = P.white; c.fill(); c.clip();
        const pr = E.pupil / 2, mx = Math.max(0, ew / 2 - pr - 3), my = Math.max(0, eh / 2 - pr - 3);
        const px = ex + clamp(look[0], -1, 1) * mx + T * 6, pyy = ey + clamp(look[1], -1, 1) * my;
        const ir = pr + 7; c.fillStyle = P.iris; c.beginPath(); c.ellipse(px, pyy, ir * (far(d) ? 0.8 : 1), ir, 0, 0, TAU); c.fill();
        c.fillStyle = P.pupil; c.beginPath(); c.ellipse(px, pyy, pr * (far(d) ? 0.8 : 1), pr, 0, 0, TAU); c.fill();
        c.fillStyle = '#ffffff'; c.beginPath(); c.arc(px + pr * 0.38, pyy - pr * 0.4, Math.max(2.5, pr * 0.3), 0, TAU); c.fill();
        const ly = ey - eh / 2 + lid * eh;
        if (lid > 0.001) { c.fillStyle = P.skin; c.fillRect(ex - ew, ey - eh, ew * 2, ly - (ey - eh));
          c.strokeStyle = P.ink; c.lineWidth = 5; c.beginPath(); c.moveTo(ex - ew, ly - 2); c.quadraticCurveTo(ex, ly + 5, ex + ew, ly - 2); c.stroke(); }
        c.restore();
        c.save(); c.beginPath(); c.rect(ex - ew, ly - 1, ew * 2, eh * 2); c.clip(); // no outline above a lowered lid
        c.strokeStyle = P.ink; c.lineWidth = 3.5; c.beginPath(); c.ellipse(ex, ey, ew / 2, eh / 2, 0, 0, TAU); c.stroke(); c.restore();
        // brow: thick rounded stroke, 60 px, inner end up for worry (-), down for resolve (+)
        const ang = E.brow * Math.PI / 180, by = ey - eh / 2 - 22 - E.browY, bl = 30 * fs, bx = ex - d * 2;
        const ix = bx - d * bl * Math.cos(ang), iy = by + bl * Math.sin(ang), ox = bx + d * bl * Math.cos(ang), oy = by - bl * Math.sin(ang);
        const brow = () => { c.beginPath(); c.moveTo(ix, iy); c.quadraticCurveTo(bx, by - 7, ox, oy); }; c.lineCap = 'round';
        c.strokeStyle = P.skin; c.lineWidth = 21; brow(); c.stroke();   // skin halo keeps a raised brow readable against the fringe
        c.strokeStyle = P.hair; c.lineWidth = 13; brow(); c.stroke();
      });
      if (aT > 0.15) { c.strokeStyle = P.nose; c.lineWidth = 5; c.lineCap = 'round'; c.beginPath(); c.moveTo(fx + T * 40, 50 + py); c.quadraticCurveTo(fx + T * 52, 64 + py, fx + T * 34, 70 + py); c.stroke(); }
      // mouth: one stroke; curve -1..1; opens into an oval
      const mx = fx * 0.95, my = 92 + py, op = clamp(E.open, 0, 1), hw = 25 * (1 - 0.35 * op) * (1 - 0.25 * aT), K = 16 * E.mouth, H = 26 * op;
      c.beginPath(); c.moveTo(mx - hw, my - K * 0.2);
      c.bezierCurveTo(mx - hw * 0.8, my + K - H, mx + hw * 0.8, my + K - H, mx + hw, my - K * 0.2);
      c.bezierCurveTo(mx + hw * 0.8, my + K + H, mx - hw * 0.8, my + K + H, mx - hw, my - K * 0.2);
      c.closePath(); if (op > 0.02) { c.fillStyle = P.ink; c.fill(); }
      c.strokeStyle = P.ink; c.lineWidth = 7; c.lineCap = 'round'; c.lineJoin = 'round'; c.stroke();
    }

    parts.forEach(p => p('o'));
    parts.forEach(p => p('f'));
    ctx.restore();
  };

  return A;
};
