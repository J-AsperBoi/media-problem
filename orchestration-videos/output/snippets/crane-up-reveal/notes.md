# crane-up-reveal

**Feature:** pull-out / crane up (the OUT beat, the look-up). Group: camera.

**What the viewer should feel:** vertigo then awe, "it's everywhere". Vastness is the core trigger of awe ([S22], High: awe = vastness + a need to re-think); context re-frames what we just saw close up (FILM_GRAMMAR.md §2.2 pull-out row; CLAUDE.md §6b "the sublime look-up").

**Exact parameters used**
- Duration 5.0 s, 1080x1920, 30 fps.
- 0.0-0.5 s: hold on Ari at zoom 3.0 (close framing: head + collar + the glowing fragment), expression `calm`, `hold: true`, glow 1.2.
- 0.5-3.5 s: pull out zoom 3.0 -> 0.045, `L.ease.inOut`, **interpolated in log space** (z = exp(lerp(ln 3, ln 0.045, f))) so the apparent speed is even rather than all-at-the-end. Camera centre slides from head (960 above feet) to body centre (575 above feet).
- Crane feel: the frame drifts up 200 screen px over the pull (same ease), so Ari settles 200 px below centre.
- 3.5-5.0 s: hold wide 1.5 s.
- World (identical code block in `drop-back-in-closer.js`): ~1,700 gray figures (about 1,000 on screen at the wide hold) on a jittered 800 x 1250 grid, drawn with Ari's small-size silhouette geometry (copied from `character.js` silhouette mode, scaled to full body height, with a thin dark edge so overlaps separate). A clear patch around Ari (±1500 x ±2300 world px) keeps neighbours out of the close shots; at the wide it reads as a small dark gap that helps you find Ari. Crowd fades to 30% alpha while figures are large on screen (>150 px), full alpha when small.
- Red: a front spreading from the far upper right (origin 14000,-22000; radius 9000 + 1400*c world units, noisy edge); figures inside turn `#ff3b30`, plus a 10% red ground wash. Red clock c = t here. **Speed is illustrative, not from an analog** (feature snippet only).
- Green: Ari plus 5 other holders (6 green points), placed where the red doesn't reach in either clip; soft pulsing glow.
- Sound: quiet drone only. No text.

**Deliberate deviation from the row-4 spec:** the wide end is zoom **0.045**, not 0.2. With zoom 1.0 = full body at 60% of frame height, zoom 0.2 makes Ari 230 px tall (12% of frame): too big for "hundreds of gray dots", for the silhouette mode the brief asked for (<60 px), and for FILM_GRAMMAR.md §2.1's extreme-wide rule "Ari <= 3% of frame height". At 0.045 Ari is 52 px (2.7%). The zoom-0.2 version is listed as a variant below.

**Variants worth comparing**
1. Literal spec: wide end zoom 0.2 (crowd figures ~230 px, ~130 on screen): a "crowd" rather than a "population".
2. Hold after the pull 0.5 s vs 1.5 s (§4 suggested A/B).
3. Linear-zoom interpolation (L.key default) vs log: the linear version rushes the last part of the pull and feels more like a fall away.
