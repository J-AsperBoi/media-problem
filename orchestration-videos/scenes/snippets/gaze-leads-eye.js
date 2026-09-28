// Snippet #10: gaze-leads-eye (4.0 s). Feature: gaze cue / eyeline + POV.
// Params (research/FILM_GRAMMAR.md §4 row 10): CU; pupils shift right at 0.8 s, head turns 25° at 0.92 s;
// cut at 2.0 s to POV of the red at the street end; hold.
// Gaze: pupils saccade in 0.07 s (0.80–0.87 s); the head follows 0.12 s after the eyes (0.92 s), turn dial 0 -> 0.3
// (character.js: 0.55 = three-quarter ~45°, so 0.3 ~ 25°), blended over 0.5 s inOut. Face goes calm -> notice at 1.1 s.
// POV: a simple perspective street from Ari's head height (1.6 m), locked off; the red fills the far end and creeps.
// Sound: a steady drone only (gaze is the feature). Drone act runs past both ends so there are no fades.
function makeScene(SERIF, HAND) {
  const L = require('../../tools/lib.js')(SERIF, HAND);
  const A = require('../../tools/character.js')(L);
  const DUR = 4.0, BG = '#161a21', T_EYES = 0.8, SACCADE = 0.07, T_HEAD = 0.92, TURN = 0.3, T_CUT = 2.0;

  // ---- shot 1: close-up, framed a little left so there's room on the side Ari looks toward ----
  function closeUp(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    const lx = 0.95 * L.ease.inOut(L.clamp((t - T_EYES) / SACCADE, 0, 1));
    A.ari(ctx, 470, 1000, 1, { framing: 'close', t, seed: 5, hold: true, glow: 0.8, look: [lx, -0.05],
      expression: [[0, 'calm'], [1.1, 'notice']], pose: [[0, { turn: 0 }], [T_HEAD, { turn: TURN, headTilt: 0.03 }]] });
  }

  // ---- shot 2: POV down the street ----
  const F = 900, EYE = 1.6, VP = [560, 880];                   // focal length px, eye height m, vanishing point
  const P = (X, Y, Z) => [VP[0] + F * X / Z, VP[1] - F * (Y - EYE) / Z];
  const quad = (ctx, pts, fill) => { ctx.beginPath(); pts.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); };
  const fog = (col, z) => { const f = L.clamp((z - 4) / 90, 0, 0.85); const c = [parseInt(col.slice(1, 3), 16), parseInt(col.slice(3, 5), 16), parseInt(col.slice(5, 7), 16)];
    return `rgb(${c.map((v, i) => Math.round(L.lerp(v, [22, 26, 33][i], f))).join(',')})`; };
  const rnd = L.rng(40), BLD = [];
  [-1, 1].forEach(side => { let z = 2.5; while (z < 64) { const len = 8 + rnd() * 14, H = 10 + rnd() * 16; BLD.push({ side, z0: z, z1: z + len, H, g: ['#3a3f48', '#353a43', '#40454e'][Math.floor(rnd() * 3)] }); z += len + 1 + rnd() * 3; } });
  BLD.sort((a, b) => b.z0 - a.z0);                             // far first
  const W = 7;                                                  // half street width, m
  const PEOPLE = [[-3.5, 16], [2.2, 24], [-1.2, 36], [4.0, 46]];

  function pov(ctx, lt) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    // ground + street
    ctx.fillStyle = '#1b2028'; ctx.fillRect(0, VP[1], 1080, 1920 - VP[1]);
    quad(ctx, [P(-W, 0, 0.8), P(W, 0, 0.8), P(W, 0, 400), P(-W, 0, 400)], '#20252e');
    // the red at the street end: a wall of red across the street, creeping closer (z 72 -> 64 m over the hold)
    const zr = 72 - 8 * L.clamp(lt / (DUR - T_CUT), 0, 1), [rx0, ry0] = P(-W - 3, 0, zr), [rx1, ry1] = P(W + 3, 9, zr);
    const glow = ctx.createRadialGradient((rx0 + rx1) / 2, ry0, 10, (rx0 + rx1) / 2, ry0, 420);
    glow.addColorStop(0, 'rgba(255,59,48,0.45)'); glow.addColorStop(1, 'rgba(255,59,48,0)'); ctx.fillStyle = glow; ctx.fillRect(0, 500, 1080, 900);
    quad(ctx, [P(-W - 3, 0, zr), P(W + 3, 0, zr), [rx1, ry1], P(-W - 3, 12, zr)], L.RED);
    quad(ctx, [P(-W, 0, zr), P(W, 0, zr), P(W, 0, zr - 25), P(-W, 0, zr - 25)], 'rgba(255,59,48,0.22)');   // spill on the road
    // buildings, far to near
    BLD.forEach(b => { const x = b.side * W;
      quad(ctx, [P(x, 0, b.z0), P(x, 0, b.z1), P(x, b.H, b.z1), P(x, b.H, b.z0)], fog(b.g, b.z0));
      for (let wy = 2.5; wy < b.H - 1; wy += 3.2) for (let wz = b.z0 + 1.2; wz < b.z1 - 1.2; wz += 3) {   // windows
        quad(ctx, [P(x, wy, wz), P(x, wy, wz + 1.4), P(x, wy + 1.6, wz + 1.4), P(x, wy + 1.6, wz)], fog('#262a32', wz)); }
      quad(ctx, [P(x, b.H, b.z0), P(x, b.H, b.z1), P(x + b.side * 10, b.H, b.z1), P(x + b.side * 10, b.H, b.z0)], fog('#2e333c', b.z0));   // roof edge
    });
    // a few gray people standing in the street (they haven't noticed)
    PEOPLE.slice().sort((a, b) => b[1] - a[1]).forEach(([X, Z]) => { const [x, y] = P(X, 0, Z), h = F * 1.7 / Z;
      ctx.fillStyle = fog('#4a4f58', Z); ctx.beginPath(); ctx.arc(x, y - h + h * 0.13, h * 0.13, 0, 7); ctx.fill();
      ctx.beginPath(); ctx.roundRect(x - h * 0.15, y - h * 0.74, h * 0.3, h * 0.74, h * 0.08); ctx.fill(); });
  }

  function draw(ctx, t) {
    if (t < T_CUT) closeUp(ctx, t); else pov(ctx, t - T_CUT);
    L.slate(ctx, t < T_CUT ? 'gaze-leads-eye · CLOSE · eyeline' : 'gaze-leads-eye · POV');
  }
  return { draw, DUR, acts: [{ start: -2, end: DUR + 2, bpm: 0, drone: true }], cues: [] };
}
if (typeof module !== 'undefined') module.exports = makeScene;
