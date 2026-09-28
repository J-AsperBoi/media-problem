# dead-stop (snippet #6)

**Feature:** freeze frame + silence (group: time / sound).

**What the viewer should feel:** the floor drops out; "wait". A full stop resets attention before the key line (FILM_GRAMMAR.md §2 "Dead stop" [S29 Lang 2000; S30 Zacks event segmentation, High]); freeze frame = "sit with this" (§2 "Freeze frame", Craft: 400 Blows ending).

**What's on screen:** Ari stands full-body, calm, holding the green fragment; six gray passers-by cross behind, stepping on the beat. At 1.5 s everything (walkers, Ari's breath, fragment turn/pulse, grain) freezes on one frame. The camera then pushes in 3% over the remaining 2.5 s (inOut) so the frozen image isn't dead.

**Sound (the feature):** a walking-pace pulse, 150 bpm (kick on beats 0/0.4/0.8/1.2 s, hat on offbeats 0.2..1.4 s), act 0–1.5 s. The next kick (due 1.6 s) never comes. Measured: max −3.3 dB in 0–1.5 s, **−91 dB (digital silence) from 1.5 s to the end**.

**Deviation from the table:** the table says "motion with drone". `tools/audio.js` drones always fade in over 2 s and out over 1.5 s, so a drone can't be hard-cut; the beat pulse can, so it carries the stop. (A tools fix would be a `cut: true` flag on acts that skips the fade-out.)

**Params:** DUR 4.0 s; freeze at 1.5 s; push-in 3% (1.00 → 1.03, inOut, 1.5–4.0 s); pulse 150 bpm 0–1.5 s, no drone; Ari scale 0.92, feet (540,1560), calm, hold, glow 1, blink off (so the freeze can't catch a half-blink).

**Variants worth comparing:**
1. Freeze at 1.0 s vs 2.0 s (how much "normal" the viewer gets before the drop).
2. No push-in during the freeze (pure dead frame) vs 6% push-in.
3. Drone bed instead of a pulse (accepting the built-in 1.5 s fade), to hear whether a soft fade still reads as a "stop".
