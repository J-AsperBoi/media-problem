# drop-back-in-closer

**Feature:** return push-in (IN+): drop from the wide back into one person, closer than before. Group: camera.

**What the viewer should feel:** pulled back into one person, harder than before. Each return closer = rising intensity (CLAUDE.md §6b; FILM_GRAMMAR.md §2.2 "Drop back in" row, Craft, consistent with [S11]: closer framing raises felt emotion). The accelerating fall is the looming signal ([S12]).

**Exact parameters used**
- Duration 4.0 s, 1080x1920, 30 fps.
- 0.0-0.5 s: wide hold at zoom 0.045, crane offset 200 px: **the exact end frame of `crane-up-reveal`** (checked: 0.000% of pixels differ between crane-up-reveal's last frame and this clip's first frame), so the two cut together.
- 0.5-2.0 s: fall zoom 0.045 -> 4.77 (4.5 x 1.06 overshoot) with `L.ease.in` (accelerating), interpolated in log space; camera centre slides from body centre to the eye line (980 above feet); crane offset 200 -> 0 px on the same curve.
- 2.0-2.1 s: settle 4.77 -> 4.5 (ease out) = the 0.1 s back-overshoot landing.
- Expression `calm` -> `fear` at 2.0 s (landing, 0.3 s blend). `hold: true`, glow 1.2 (green chin wash visible in the landing).
- 2.1-4.0 s: hold on the eyes at zoom 4.5 (closer than crane-up-reveal's start at 3.0).
- World: identical code block to `crane-up-reveal.js` (verified with diff). Red clock c = 5 + t, so the red keeps spreading from where the reveal left it. Red speed illustrative.
- Sound: quiet drone only. No text.

**Deviation from the row-5 spec:** starts from zoom 0.045, not 0.2, to match `crane-up-reveal` (see its notes for why).

**Variants worth comparing**
1. Return depth zoom 3.0 vs 4.5 vs 6.0 (§4 suggested A/B).
2. Fall 1.0 s vs 1.5 s vs 2.0 s (faster = more of a plunge; slower = more of a descent).
3. No overshoot (plain ease-in stop) vs 6% overshoot, or add a single 'hit' cue on landing (tests sound as a separate feature).
