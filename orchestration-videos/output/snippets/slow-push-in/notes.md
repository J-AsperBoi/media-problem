# slow-push-in

**Feature:** slow push-in to the eyes. Group: camera.

**What the viewer should feel:** tension slowly tightening. An expanding image reads as approach, and approach is an innate arousal signal (FILM_GRAMMAR.md §2.2, [S12] looming research; Medium, since the evidence is mostly on fast expansion). Closer framing also raises felt emotion ([S11]).

**Exact parameters used**
- Duration 4.0 s, 1080x1920, 30 fps. Ari drawn once at full size (feet 540,1700), camera moves.
- Zoom 1.6 -> 2.2 (x1.375) across the full 4.0 s, `L.ease.inOut`.
- Camera centre y from 860 px above the feet (head + chest) to 980 px above the feet (eye line), so the move lands on the eyes. No x or rotation.
- Expression `calm` -> `worry` at 3.0 s (0.3 s ease-out blend). Idle breathing/blinks on (seed 9).
- No red, no green, no text. Quiet drone.

**Variants worth comparing**
1. Faster push: same zoom range in 1.5 s then hold 2.5 s (A/B with `drop-back-in-closer`, and the "3 s vs 1.5 s" test in §4).
2. Deeper push: 1.6 -> 3.0 (close-up) over 4 s: does the extra travel read as more tension or just "zoom"?
3. Expression stays `calm` throughout: is the tension from the camera alone, or from the face change at 3.0 s?
