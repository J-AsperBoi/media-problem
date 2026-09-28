// Snippet: Ari model sheet (4 s). The reference every film draws Ari from.
// Front + three-quarter full body, a waist shot holding the green fragment, and the 8 expression presets.
function makeScene(SERIF, HAND) {
  const L = require('../../tools/lib.js')(SERIF, HAND);
  const A = require('../../tools/character.js')(L);
  const DUR = 4, BG = '#161a21', CELL = '#1d222b', GUIDE = 'rgba(232,228,218,0.10)';
  const GRID = [['calm', 'notice', 'worry', 'fear'], ['tenderness', 'resolve', 'grief', 'awe']];
  const COLX = [190, 410, 630, 850], ROWY = [400, 700], CW = 200, CH = 220;

  function draw(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    // title
    L.label(ctx, 'Ari', 90, 318, 120, { font: SERIF, align: 'left', col: '#fffdf7' });
    L.label(ctx, 'model sheet', 262, 318, 48, { align: 'left', col: '#9aa0aa' });
    // small-size read test: the tuft should still read as Ari
    A.ari(ctx, 830, 330, 0.1, { t, seed: 5, hold: true, glow: 0.8 });
    A.ari(ctx, 940, 330, 0.05, { t, seed: 6, hold: true });

    // expression grid
    GRID.forEach((row, r) => row.forEach((name, c) => {
      const cx = COLX[c], y0 = ROWY[r];
      ctx.save(); ctx.fillStyle = CELL; ctx.beginPath(); ctx.roundRect(cx - CW / 2, y0, CW, CH, 22); ctx.fill(); ctx.clip();
      A.ari(ctx, cx, y0 + CH / 2 + 34, 0.155, { framing: 'close', expression: name, t, seed: 11 + r * 4 + c, look: name === 'awe' ? [0, -0.6] : name === 'grief' ? [0, 0.5] : [0, 0] });
      ctx.restore();
      L.label(ctx, name, cx, y0 + CH + 50, 44, { col: '#c9ccd2' });
    }));

    // full body: height guides (4 heads)
    const feet = 1880, s = 0.64, H = 1150 * s;
    ctx.strokeStyle = GUIDE; ctx.lineWidth = 2;
    for (let i = 0; i <= 4; i++) { const y = feet - i * H / 4; ctx.beginPath(); ctx.moveTo(70, y); ctx.lineTo(610, y); ctx.stroke(); }
    L.label(ctx, 'front', 200, 1052, 44, { col: '#c9ccd2' });
    L.label(ctx, 'three-quarter', 470, 1052, 44, { col: '#c9ccd2' });
    A.ari(ctx, 200, feet, s, { t, seed: 2, expression: 'calm' });
    A.ari(ctx, 470, feet, s, { t, seed: 3, expression: 'calm', pose: { turn: 0.55 }, look: [0.4, 0] });

    // waist shot holding the fragment
    L.label(ctx, 'holding', 820, 1052, 44, { col: '#c9ccd2' });
    ctx.save(); ctx.fillStyle = CELL; ctx.beginPath(); ctx.roundRect(650, 1080, 380, 800, 26); ctx.fill(); ctx.clip();
    A.ari(ctx, 840, 1500, 0.52, { framing: 'waist', t, seed: 4, hold: true, glow: 1 + 0.15 * Math.sin(t * 2), expression: 'tenderness', look: [0, 0.75], pose: { headTilt: -0.06 } });
    ctx.restore();
  }
  return { draw, DUR, acts: [{ start: 0, end: DUR, bpm: 0, drone: true }], cues: [] };
}
if (typeof module !== 'undefined') module.exports = makeScene;
