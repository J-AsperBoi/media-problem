// Snippet #6: dead-stop (4.0 s). Feature: freeze frame + silence.
// Params (research/FILM_GRAMMAR.md §4 row 6): 1.5 s of motion with sound; the frame freezes at 1.5 s; audio to zero;
// 3% push-in during the freeze; hold to the end.
// Sound: a walking-pace pulse (150 bpm kick + offbeat hat) runs 0–1.5 s and stops dead; nothing after it.
// (tools/audio.js drones always fade out over 1.5 s, so a drone cannot be hard-cut; the pulse can, so the pulse carries the stop.)
// Motion: gray passers-by cross behind Ari, stepping on the beat; Ari breathes, the fragment glows and turns.
function makeScene(SERIF, HAND) {
  const L = require('../../tools/lib.js')(SERIF, HAND);
  const A = require('../../tools/character.js')(L);
  const DUR = 4.0, BG = '#161a21', T_FREEZE = 1.5, PUSH = 0.03, BPM = 150, STEP = 60 / BPM;
  const FX = 540, FY = 1560, S = 0.92;                       // Ari's feet, scale
  const HORIZON = 1150;
  // passers-by: [lane y (feet), height px, speed px/s (+ right, - left), x at t=0, gray, phase]
  const WALKERS = [
    [1180, 300, 150, -40, '#2a2f38', 0.0], [1195, 330, -170, 820, '#2d323b', 0.5], [1215, 360, 190, 330, '#30353e', 0.25],
    [1170, 280, -140, 1130, '#282c35', 0.75], [1230, 390, -210, 470, '#33383f', 0.1], [1200, 320, 160, 700, '#2c313a', 0.6],
  ];

  function walker(ctx, x, feet, h, col, t, ph) {
    const step = (t / STEP + ph) % 1, bob = Math.abs(Math.sin(Math.PI * step)) * h * 0.025;  // one bob per beat
    const hr = h * 0.13, bw = h * 0.3, top = feet - h + hr * 2 - bob;
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(x, feet - h + hr - bob, hr, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.roundRect(x - bw / 2, top + hr * 0.3, bw, h * 0.45, [bw * 0.35, bw * 0.35, 6, 6]); ctx.fill();
    const sw = Math.sin(Math.PI * 2 * step) * h * 0.07, legTop = top + hr * 0.3 + h * 0.42;
    ctx.lineCap = 'round'; ctx.strokeStyle = col; ctx.lineWidth = bw * 0.32;
    [-1, 1].forEach(d => { ctx.beginPath(); ctx.moveTo(x + d * bw * 0.2, legTop); ctx.lineTo(x + d * bw * 0.2 + d * sw, feet); ctx.stroke(); });
  }

  function world(ctx, tw) {   // everything that lives in scene time; tw is clamped at the freeze
    ctx.fillStyle = BG; ctx.fillRect(-200, -200, 1480, 2320);
    ctx.fillStyle = '#1b2028'; ctx.fillRect(-200, HORIZON, 1480, 1200);                    // street
    ctx.strokeStyle = 'rgba(154,160,170,0.18)'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-200, HORIZON); ctx.lineTo(1280, HORIZON); ctx.stroke();
    WALKERS.slice().sort((a, b) => a[0] - b[0]).forEach(([fy, h, v, x0, col, ph]) => {
      const span = 1480, x = ((x0 + v * tw + 200) % span + span) % span - 200;             // wrap across the frame
      walker(ctx, x, fy, h, col, tw, ph);
    });
    A.ari(ctx, FX, FY, S, { t: tw, seed: 7, blink: false, expression: 'calm', hold: true, glow: 1, look: [0.15, 0] });
    L.grain(ctx, tw, { alpha: 0.05 });
  }

  function draw(ctx, t) {
    const tw = Math.min(t, T_FREEZE);
    const z = 1 + PUSH * L.ease.inOut(L.clamp((t - T_FREEZE) / (DUR - T_FREEZE), 0, 1));
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    ctx.save(); L.camera(ctx, [[0, [540, 960, z, 0]]], t); world(ctx, tw); ctx.restore();
    L.slate(ctx, 'dead-stop · freeze frame + silence');
  }
  // Pulse 0–1.5 s: kicks at 0, .4, .8, 1.2; hats at .2, .6, 1.0, 1.4. The kick due at 1.6 never comes.
  return { draw, DUR, acts: [{ start: 0, end: T_FREEZE, bpm: BPM, drone: false }], cues: [] };
}
if (typeof module !== 'undefined') module.exports = makeScene;
