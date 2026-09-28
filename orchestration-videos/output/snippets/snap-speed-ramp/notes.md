# snap-speed-ramp (snippet #7)

**Feature:** speed ramp (playback rate) (group: time).

**What the viewer should feel:** a gear change; "oh, it's that fast". A felt slow → sudden-fast change marks a turning point and is a pattern interrupt (FILM_GRAMMAR.md §2 "Speed ramp": S29 Lang 2000, High that such changes trigger orienting; ramp specifics Craft).

**What's on screen:** locked-off wide. Ari in the foreground (calm, holding the fragment), three gray passers-by mid-field, a crowd of ~260 gray dots behind. The red spreads through the crowd nearest-first from a point on the right. Everything runs on ONE scene clock, so at 20× the walkers zip, Ari's breathing/blinks speed up, and the red floods. A small "1×" / "20×" readout (64 px, top left) names the dial being tested.

**Sound:** a drone under everything, plus one clock tick (kick + offbeat hat) per scene-second. Each tick is its own act with bpm = 1 / gap-to-next-tick, so the ticks go 1/s → a 20/s roll exactly in step with the picture. Levels: mean −16 dB during 1×, −10.5 dB during 20× (the roll is louder by summing).

**Params:** DUR 4.0 s; rate 1× for 0–1.5 s; ramp 1× → 20× over 1.5–2.1 s with ease-in (f³); 20× for 2.1–4.0 s. Scene clock τ(t) = ∫rate: τ(1.5)=1.5, τ(2.1)=4.95, τ(4.0)=42.95. Red share = L.logistic(τ, doubling 2.5 scene-s, start 3%); ~95% at τ≈23 (film t≈3.0 s), leaving ~1 s of near-full red. The doubling time is a placeholder, not from an analog; a film would use its analog's.

**Weak spots:** at 1× the red grows only ~4 dots in 1.5 s, so "slow" reads as "almost still"; the readout text is the one text element (it helps the comparison but a film may not want it).

**Variants worth comparing:**
1. Reverse ramp 20× → 0.25× (ease out), the "slow-mo landing" version.
2. Ramp over 0.2 s (near-cut) vs 1.2 s (a long acceleration).
3. No readout and no ticks (drone only), to see if the picture alone sells the gear change.
