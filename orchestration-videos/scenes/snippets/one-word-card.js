// Snippet #9: one-word-card (3.0 s). Feature: text timing and size.
// Params (research/FILM_GRAMMAR.md §4 row 9): the word "Lag." SERIF 200 px, centre y 700, fade in 0.3 s, hold 2.0 s,
// fade out 0.4 s; Ari small, below, out of focus (40% alpha).
// The card starts at 0.15 s so the viewer sees one empty frame beat first; it is gone at 2.85 s.
// Sound: a quiet drone only (text is the feature, not sound). The drone act runs past both ends so it has no fades.
function makeScene(SERIF, HAND) {
  const L = require('../../tools/lib.js')(SERIF, HAND);
  const A = require('../../tools/character.js')(L);
  const DUR = 3.0, BG = '#161a21', WORD = 'Lag.', SIZE = 200, CY = 700;
  const T_IN = 0.15, FADE_IN = 0.3, HOLD = 2.0, FADE_OUT = 0.4, BLUR = 7, ARI_ALPHA = 0.4;

  const layer = require('@napi-rs/canvas').createCanvas(1080, 1920), lctx = layer.getContext('2d');  // redrawn fully every frame

  function draw(ctx, t) {
    ctx.fillStyle = BG; ctx.fillRect(0, 0, 1080, 1920);
    // Ari: small, below the word, soft focus and 40% alpha so the word is the only sharp thing
    // (drawn sharp and opaque to a scratch layer first, so overlapping parts don't show through each other)
    lctx.setTransform(1, 0, 0, 1, 0, 0); lctx.clearRect(0, 0, 1080, 1920);
    A.ari(lctx, 540, 1480, 0.42, { t, seed: 12, expression: 'calm', hold: true, glow: 1, look: [0, -0.3] });
    ctx.save(); ctx.globalAlpha = ARI_ALPHA; ctx.filter = `blur(${BLUR}px)`; ctx.drawImage(layer, 0, 0); ctx.restore();
    // the card: alpha envelope fade-in (out ease) / hold / fade-out (inOut)
    const a = t < T_IN ? 0 : t < T_IN + FADE_IN ? L.ease.out((t - T_IN) / FADE_IN)
      : t < T_IN + FADE_IN + HOLD ? 1 : L.clamp(1 - L.ease.inOut((t - T_IN - FADE_IN - HOLD) / FADE_OUT), 0, 1);
    if (a > 0) {
      ctx.save(); ctx.font = `${SIZE}px "${SERIF}"`; ctx.textBaseline = 'alphabetic';   // put the glyphs' visual centre at y 700
      const m = ctx.measureText(WORD);
      const base = CY + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2;
      ctx.restore();
      L.title(ctx, [WORD], base, SIZE, { alpha: a });
    }
    L.slate(ctx, 'one-word-card · text timing and size');
  }
  return { draw, DUR, acts: [{ start: -2, end: DUR + 2, bpm: 0, drone: true }], cues: [] };
}
if (typeof module !== 'undefined') module.exports = makeScene;
