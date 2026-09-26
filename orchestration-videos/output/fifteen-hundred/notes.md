# Fifteen Hundred

Tier: animatic
Slug: fifteen-hundred
Structure: split-screen-race (research/VIRAL_STRUCTURES.md #2)
Analog: false-news-2018 (Vosoughi, Roy & Aral, Science 2018; Hoaxy lag, Shao et al. 2016)
DUR: 38 s, 1080x1920, 30 fps

## Logline
Two neon highway lanes, one above the other, run over the same map of 1,500 people. Top: a red car (a claim) weaves through all of them in 10 hours. Bottom: the green cars (fact-checks, and the people who already know the true version) sit behind on-ramp gates for ~13 hours. By the time the ramps open, the road is already red. Snap: the whole 60 h replayed at one speed, beside an AI-routed version (illustrative) where the correction trails the claim by about an hour. Caveat on screen: speed is not belief.

## Time mapping (one mapping per section, both linear, both stated here)
- Race (t 3.0 to 19.0 s): **1 second = 1 hour** (h = t - 3). Covers h 0 to 16.
- Snap (t 21.6 to 24.6 s): **1 second = 20 hours** (h = 20 (t - 21.6)). Covers the full 0 to 60 h. Same mapping for both snap lanes.
- Freeze at h = 16 between 19.0 and 21.6 s ("We slowed it down so you could see it.").

## Speed math
The world: one serpentine highway with 1,500 people (dots) placed along it, each with a route position s in [0,1] (stratified, so the share reached equals the route share passed).

**Threat (red).** Analog gives only endpoints: 0 at t=0, 1,500 people (extent 1.0) at ~10 h (s2). The analog notes say no doubling time was found and to use a stated monotone ease. Stated ease: extent(h) = smoothstep(h/10). The red car's route position is extent(h); a person turns red at hRed(s) = 10 * smoothstep^-1(s). Red reaches everyone at h=10 -> t=13.0 s in the race, t=22.1 s in the snap.

**Human aggregation (green).** 7 green cars, one per on-ramp, one per 1/7 of the route. Gate release times are per-car lognormal quantiles, L.lognormalQuantile((i+0.5)/7, median 13 h, p90 20 h) (Hoaxy: fact-check sharing lags by 10-20 h, ~13 h characteristic; p10/p90 treated as the authors' typical range):
7.9, 10.0, 11.5, 13.0, 14.7, 17.0, 21.3 h (shuffled across ramps with a seeded permutation; the hero ramp is the median, 13.0 h, so its gate lifts at t = 16.0 s).
After release, each car covers its 1/7 of the route in D = 60 - 21.3 = 38.7 h, so the last person gets the true version at 60 h, matching the sourced true-news time to reach 1,500 people (s2, used as the analog's deploy proxy). A person turns green-ringed at r_i + D * (s - s0_i)/(1/7).
During the race (h <= 16) only 4 of 7 gates have opened and they have barely moved; red has been everywhere since h = 10.

**AI counterfactual (illustrative).** ai_counterfactual.aggregation_median = 1 h (basis: matching a circulating claim to an existing ruling is a well-under-1-hour task, inside the ~17.4 h METR 50% horizon in RATES.md; cost ~40x/yr cheaper makes screening affordable). Same spread as human: r_ai_i = L.lognormalQuantile(q_i, 1, 20/13) = 0.61 to 1.64 h. Illustrative assumption (stated here, labeled on screen): the correction is routed along the claim's own path, so each person gets it r_ai_i hours after the claim: hGreenAI(s) = hRed(s) + r_ai_i. Last person reached at ~11.6 h -> t = 22.2 s in the snap, vs 60 h -> t = 24.6 s human.
Caveat on screen: "Speed is not belief." Reaching someone with a correction does not mean they accept it; people still decide (analog basis text).

## Numbers on screen (two, both verified in the analog)
- "10 hours" (false story to 1,500 people, s2/s1)
- "60 hours" (true story to 1,500 people, s2/s1)
"1,500" is shown only as 1,500 drawn dots, not as a numeral.

## Shot list and camera (two lanes, synchronized cameras, handheld shake from L.noise)
| t | shot | top lane (red) | bottom lane (green) |
|---|---|---|---|
| 0.0-1.3 | SC0 COLD OPEN (flash-forward, same timeline, labeled "10 hours from now") / CLOSE | z 4.6 on the last person reached at h=10: red car, red dots, face lit red | green car behind a gate, driver's face |
| 1.3-3.0 | SC1 CLOSE / CLOSE (labeled "now", h=0) | thumb on a phone; the red car on the screen | green car behind a gate, driver's face |
| 3.0-8.0 | SC2 DOLLY IN (into the phone) / CLOSE | phone screen grows to full lane; handheld chase on the red car (z 3.2) | driver waits; at ~7.7 s the red car blasts past the ramp |
| 8.0-11.0 | SC3 CRANE UP both | out to z 1: whole map, red sweeping | out to z 1: seven green cars at seven gates |
| 11.0-13.2 | SC3 WIDE hold | red reaches the last dot at 13.0 | gates mostly closed |
| 13.2-19.0 | SC4 DOLLY IN both, closer | z 6.5 on the last person reached, phone lit red | z 8 on the driver, angry; gate lifts at 16.0, car pulls out into a red road |
| 19.0-21.6 | freeze, silence | "We slowed it down so you could see it." | |
| 21.6-29.4 | SC5 SNAP, locked-off WIDE | as it happened, 0-60 h | AI-routed, illustrative |
| 29.4-32.6 | SC6 EXTREME CLOSE, full frame, DOLLY IN | the closed gate: "This is the bottleneck." | |
| 32.6-38.0 | END | L.endCard, 5.4 s | |
Zoom cycle: IN 0-8 -> OUT 8-11 -> IN+ 13.2-16 (closer than start) -> (snap wide) -> IN++ 29.4-32.6 on the gate.

## 3D translation note
Two stacked vertical frames, each a real camera over a night highway model lit only by emissive road edges and house lights. SC1: 50 mm macro on a thumb over a phone (top) and a long-lens eye-level on the driver behind a boom barrier (bottom). SC2: the top camera flies through the phone glass into a low chase drone 3 m above the red car, handheld jitter, 24 mm. SC3: both cameras crane to ~800 m over 3 s with ease, synchronized. SC4: fast drop to 1.5 m, 85 mm on the driver's face lit by the red car's taillights; boom lifts. SNAP: orthographic top-down, locked. SC6: slow push on the boom barrier's hinge. Richer in 3D: rain on the windshield, the red car's light trail painting 1,500 windows, the barrier's mechanical slowness.

## Copy variants
- "Two lanes. One race." (used) / "Same road. Different on-ramps."
- "The answer is already here." (used)
- "Red: everyone in 10 hours." (used)
- "Then the ramp opens." (used) / "Green light. Empty road." 
- "Truth: 60 hours." (used)
- "Speed is not belief." (used)
- "Your correction has 13 hours of lag." / "Truth is stuck on the ramp."

## Tags
{"structure":"split-screen-race","medium":"neon arcade","family":"traffic","scale":"nation","pace":"sprint","camera":"handheld chase","emotion":"anger","protagonist":"the red itself","analog":"false-news-2018"}
Diversity check: OK (nearest two-days, distance 1.00).

## Resume log (after container restart)
- Frame 1 hook: added a 1.3 s cold open (flash-forward to h = 10 on the same timeline, labeled "10 hours from now"), then a white-flash cut back to "now" (h = 0) and the phone. Red is big in frame 1; green driver's face below. Frame 1 has red + green + a face + one line of text.
- Cards now auto-fit inside x 80-900 (centered at x 490, max width 780 px).
- Snap legibility: people reached by the correction now show a green ring with a small red core (the claim is still there; speed is not belief) instead of a thin green ring over a full red dot, which read as olive at phone size.
- Labels already 44 px; snap lanes full 1080 px wide.

## Render
output/fifteen-hundred/fifteen-hundred.mp4, ffprobe duration 38.000 s (DUR 38), 1080x1920, 30 fps, with audio.

## Scores
- Hook: 7 (cold open puts a big red car, a red-lit face and red dots in frame 1 over a green driver; still an abstract "two lanes" premise)
- Speed accuracy: 8 (sourced 10 h / 60 h endpoints, Hoaxy lognormal gate releases, one linear mapping per section; the path between endpoints is a stated ease, not data)
- Snap impact: 6 (freeze, flash, locked-off side by side is clean, but the snap's 3 s top lane and the AI lane both end all-green, so the difference is mostly in timing, not image)
- Emotion: 6 (angry driver behind the gate works; the crowd is dots)
- Originality: 7 (split-screen highway with on-ramp gates is a fresh traffic metaphor for correction lag)
- Craft: 6 (neon look reads at phone size; SC4/SC6 camera centering and the gate close-up are functional rather than beautiful)
- Honesty: 9 (both on-screen numbers verified; AI lane labeled illustrative with a stated routing assumption; "Speed is not belief." caveat on screen)
Overall: 7.0
Virality: 6% + the "false news is 6x faster" fact is shareable and the split-screen race is easy to track, but an abstract highway of dots from a small account rarely clears 100k.
