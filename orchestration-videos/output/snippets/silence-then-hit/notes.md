# silence-then-hit (snippet #8)

**Feature:** silence before a single hit (group: sound).

**What the viewer should feel:** startle, then clarity. Silence clears the ear and builds anxious anticipation so the following sound startles more (FILM_GRAMMAR.md §2 "Silence before impact", S19 Medium); one clean hit on the turning-point frame triggers orienting (§2 "Single sharp hit", S29 High / S19 Medium).

**What's on screen:** 0–1.2 s: close-up of Ari, near-still (no blink), expression notice with the lid slightly lowered, glancing down at the glowing fragment. Hard cut at 1.2 s (frame 36) to four green pieces with gaps; they slam shut within 2 frames (ease out, 0.067 s), recoil a few px, one pale-green ring expands over 0.5 s, the glow flares then settles, and the seams fade over 0.6 s so the four become one whole.

**Sound (the feature):** `acts: []`, so there is no drone, no beat, nothing: 0–1.2 s measured at −91 dB (digital silence). One `hit` cue at exactly 1.2 s (−0.4 dB peak), which decays over its 1.5 s length; the last 0.25 s is silent again.

**Params:** DUR 3.0 s; silence 0–1.2 s; hit + cut at 1.2 s; snap 0.067 s (ease out), gap 70 px → 0, spin 0.12 rad → 0; ring 0.5 s; seam fade 0.6 s; pieces scaled 1.45 (whole ≈ 550 px wide).

**Weak spots:** "near-silence" in the table became total silence. On a phone feed, total silence can read as "my sound is off"; variant 1 tests that.

**Variants worth comparing:**
1. True near-silence: a very faint room-tone drone for 0–1.2 s (needs a quieter drone than audio.js offers; a quiet pulse at low bpm is the nearest).
2. Silence 0.8 s vs 1.5 s (the table's range) before the hit.
3. `stamp` instead of `hit` (short and dry vs long and booming).
