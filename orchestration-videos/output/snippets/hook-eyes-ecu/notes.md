# hook-eyes-ecu

**Feature:** extreme close-up (ECU) on the eyes, from frame 1. Group: shot.

**What the viewer should feel:** "who is this, what's wrong?" instantly. Close shots raise viewers' mind-reading and felt emotion, including for animated characters (FILM_GRAMMAR.md §1 finding 3, [S11] Bálint et al.; Medium-High); eye whites alone engage the threat detector ([S25], High). ECU = maximum intimacy, forces attention onto one detail (§2.1).

**Exact parameters used**
- Duration 3.0 s, 1080x1920, 30 fps.
- Ari drawn once at full size (feet at 540,1700), camera `A.cameraFor('eyes-ecu')` = zoom 5.0, centred on the eye line.
- Drift: zoom 5.0 -> 5.15 (+3%) over the full 3.0 s, `L.ease.inOut` (L.key default). No x/y/rotation movement.
- Expression: preset `notice`, constant. Idle breathing + blinks on (seed 7).
- `hold: true`, `glow: 1.6` -> green wash on the chin/lower face from the (off-frame) fragment.
- Sound: quiet drone only. No text card.

**Variants worth comparing**
1. Zoom 6.0 (eyes only, brows cropped) vs 5.0: how tight before it stops reading as a face?
2. Drift +8% instead of +3%: does a more noticeable creep add tension or distract?
3. Expression `worry` instead of `notice`, or glow 0.8 vs 1.6 (is the green chin wash the hook, or the eyes?).
