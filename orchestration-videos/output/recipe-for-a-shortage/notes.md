Tier: animatic

# Recipe for a Shortage

**Logline.** A deadpan cooking-show chef writes today's recipe on a chalkboard: "Step one: have enough rice. Step two: don't tell anyone." The red price dial on the board creeps up. The recipe steps are absurd until the board freezes and we learn it really happened: the camera pulls out over his shoulder until the chalkboard is a map of the world's kitchens, every dial red, the idle rice glowing green in a far corner. Back in, closer: he is furious, and the green line finally arrives. Then the snap: the same timeline, and the same rice routed a few weeks sooner (illustrative).

- Structure: `recipe-parody` (VIRAL_STRUCTURES.md #16): comedy as early contrast, then man-in-a-hole.
- Analog: `rice-2008`. The threat is never named: it is only red chalk on a price dial. No countries, flags, officials. The chef is an everyman host; the recipe satirizes the system (locked doors, silence, waiting), never people.
- Medium: chalkboard. White and gray chalk on a dark slate; only red chalk (price) and green chalk (the rice stock, the need, the connecting line) are saturated.
- DUR 40 s, 1080x1920, 30 fps. Scene: `scenes/recipe-for-a-shortage.js`.

## Time mapping (one stated mapping)
- **Race: linear, 1 second = 2 weeks** while the clock runs. Week 0 = t0 of the analog (first major export ban, Oct 2007). Week w is on screen at t = 3.0 + w/2 for w <= 14, and t = 11.0 + (w - 14)/2 after the hard stop.
- **One hard stop** (stop-start pace): t = 10.0-11.0 the board freezes at week 14 (still frame, silence, one hit). The clock does not run during the freeze.
- Need goes public (f2, week 27.3): t = 17.65. Deal (f4, week 31.3): t = 19.65. June point (week 35.7): t = 21.85.
- **Cold open (t = 0-2.2):** flash-forward to week 30 on the same timeline (dial near its peak), then an eraser wipe rewinds to week 0 (2.2-3.0).
- **Snap (t = 25.8-29.4): weeks 0-36 in 1.8 s (1 s = 20 weeks)**, first "as it happened" alone, then both lanes together on the same clock.

## Speed math
**Threat (red) = price extent** (extent = (price - 300)/800, analog notes), drawn as a red chalk arc on an oven-style "price" dial (0 = empty dial, 1 = full sweep). Sourced anchors: 0.875 at week 29.1 (s2), 1.0 at week 30.6 (s3); the week 5.3 point is `verified:false` and used only as a shape anchor (0.01), never on screen. Spread is not linear, so a logistic K/(1+exp(-r(w-m))) is fitted through the three anchors: **K = 1.564, r = 0.222/week (early doubling 3.1 weeks), m = 28.02** (same fit as the-warehouse; recomputed: 0.875 at 29.1, 1.000 at 30.6). Extent = min(fit, 1) until the deal.
- After the deal (week 31.3) extent decays exponentially: 1.0 -> 0.625 at week 35.7 (s3), k = ln(1.6)/4.4 = 0.107/week (analog `deploy.median` 4.4 weeks). Nothing is drawn after week 35.7 (no unsourced extrapolation).
- Price is one market, so every kitchen's dial on the board shows the same level.

**Human aggregation (green).** Analog: median 31.3 (deal, s1), p10 27.3 (failed tender, s1), p90 205.3 (AMIS, `verified:false`, used only as a distribution tail, never shown). Skewed, so two-sided lognormal via `L.lognormalQuantile`: upper half uses (median 31.3, p90 205.3); lower half uses a mirrored p90' = 31.3^2/27.3 = 35.9 (sigma_lo = 0.107). Five green chalk threads leave the warehouse at week 0 and grow linearly to arrive at q = 0.1, 0.3, 0.5, 0.7, 0.9 -> weeks 27.3, 29.6, 31.3, 67.6, 205.3. The q = 0.5 thread (the deal) runs to the chef's station; the late ones visibly dangle mid-board. The need (f2) lights green in the chef's station at week 27.3. f3 and f5 are `verified:false` and stay off screen.

**AI counterfactual (illustrative).** `ai_counterfactual.aggregation_median` = 28.3: matching a public shortage (withdrawn tender, week 27.3) with a known idle stock and drafting terms is a short analysis-and-routing task inside the ~17.4 h 50% task horizon (RATES.md, METR). Assumed surfaced within 1 week of the need going public; governments still negotiate and decide. Not assumed: earlier detection. AI lane: fit until week 28.3 (extent 0.806), then the same measured decay k = 0.107/week. The gain is ~3 weeks and is not inflated: the snap lands through staging (freeze, silence, one stamp, then two 920 px panels on one clock).

**Numbers on screen (two):** "Week 31" (deal, s1) and "Week 28 · illustrative" (analog counterfactual). Nothing else numeric.

## Shot list and camera (L.camera keyframes, eased)
| t | shot | camera |
|---|---|---|
| 0.0-2.2 | SC1 CLOSE OTS cold open (week 30): chef turned to camera, deadpan, green chalk in hand; red dial nearly full; green "rice?" note. Card "Step one: have enough rice." | z 1.20 -> 1.26 push |
| 2.2-3.0 | Eraser wipe: board rewinds to week 0. | hold |
| 3.0-10.0 | SC2 OVER THE SHOULDER: he writes the steps (comedy). Cards: "Step two: don't tell anyone." / "Step three: lock every kitchen door." / "Step four: let it simmer." Dial creeps. | z 1.0 -> 1.1 slow push |
| 10.0-11.0 | HARD STOP: freeze, one hit. "This recipe really happened." | locked |
| 11.0-16.5 | SC3 PULL OUT: over his shoulder, out past the station, until the board is a map of ~90 kitchens, every dial red; the warehouse (2x2 tiles, size = resources) glows green in the far corner; five threads crawl. "Every kitchen. One price." / "The rice sat in a warehouse." | z 1.1 -> 0.245 |
| 16.5-19.6 | SC4 DROP BACK IN, closer: need lights green (week 27.3), "Step five: someone finally asks." Down to his face, angry. | z 0.245 -> 1.9 |
| 19.6-22.5 | SC5 CLOSE+: deal thread arrives (week 31.3), red falls. "Step six: it moves." | z 1.9 -> 2.05 |
| 22.5-25.0 | Dead stop, dim: "We slowed it down so you could see it." | hold |
| 25.0-25.8 | Freeze, silence. | - |
| 25.8-32.0 | SC6 SNAP: stamp. Panel A alone at true proportional pace, then A and B together, same clock. "Week 31" vs "Week 28 · illustrative". "Same rice. Found sooner." | locked, screen space |
| 32.0-35.4 | SC7 IN++: extreme close on his hand, green chalk, green line, dial low. "This is the bottleneck." | z 2.8 |
| 35.4-40.0 | END: L.endCard("The bottleneck is us."), 4.6 s | hold |

**Zoom cycles.** Cycle 1: IN 0-10 (z 1.0-1.26), OUT 11.0-16.5 (to 0.245), IN+ 16.5-22.5 (to 2.05). Cycle 2: OUT to the snap panels 25.8-32, IN++ 32-35.4 (z 2.8, hand and chalk).

## 3D translation note
- SC1/SC2: 35 mm over-the-shoulder at his shoulder height, his ear and toque soft in the foreground, the board sharp; chalk dust hangs in a key light. The dial is a real chalk drawing that the red fills stroke by stroke.
- SC3: a slow dolly back on a long track then a crane rise (6 s, ease both ends) until he is a tiny white figure in front of a chalkboard the size of a building face; every kitchen is a hand-drawn vignette with its own dial. The warehouse is drawn larger and the green glows like phosphor.
- SC4: faster drop than the rise, ending at 85 mm on his face, closer than SC1.
- SC7: 100 mm macro on the chalk tip and the green line, shallow depth of field, chalk grain visible.
- Characters: one chef with a readable face (brows, lids, mouth swap per beat); the kitchens hold small chalk stick people.

## Copy variants
- "Step one: have enough rice." / "Step two: don't tell anyone." / "Step three: lock every kitchen door." / "Step four: let it simmer."
- "This recipe really happened." / "Every kitchen. One price." / "The rice sat in a warehouse."
- "Step five: someone finally asks." / "Step six: it moves."
- "Same rice. Found sooner." / "Serves everyone. Eventually." / "Prep time: too long."

## Tags
{"structure":"recipe-parody","medium":"chalkboard","family":"cooking","scale":"economy","pace":"stop-start","camera":"over-the-shoulder","emotion":"anger","protagonist":"one person","analog":"rice-2008"}
Diversity check: OK (nearest the-warehouse 0.56, same analog/family/scale by assignment).
