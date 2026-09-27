Tier: animatic

# Recipe for a Worm (slug: recipe-for-a-worm)

**Logline.** An 8-bit cooking show. A pixel chef in a pixel kitchen that is really a hospital IT closet reads today's recipe: "Take one unpatched machine. Leave out for 59 days." The green patch disk sits on the counter gathering dust while unread alerts pile up. At ~8 s the show freezes: "This recipe really happened." Over his shoulder the oven-server glows red; the camera pulls out to a grid of 81 kitchens all cooking the same dish; one stranger far away stops it, partly by luck; we drop back in, closer, to the chef, furious, the fix still on his counter. Then the snap: the same week at true proportions, and the same fix routed sooner (illustrative). A pixel hand puts the disk in.

- Structure: `recipe-parody` (VIRAL_STRUCTURES.md #16): comedy as early contrast, then the grave turn at ~8 s.
- Analog: `wannacry-2017`. Never named on screen; no company names; no "worm", "ransomware", "virus", "malware", "hack" on screen (the slug is internal).
- Medium: 8-bit. Chunky grid-aligned pixels (1 art pixel = 30 local units), a gray palette; only red (#ff3b30, the threat) and green (#34d27b, the patch disk, routes, the stop) are saturated.
- Protagonist: an institution. The chef is the hospital personified (a gray cross on his toque). The satire is the recipe (a fix left sitting for 59 days, alerts unread), i.e. the system, not the IT staff.
- DUR 38 s, 1080x1920, 30 fps. Scene: `scenes/recipe-for-a-worm.js`.

## Time mapping (one stated mapping per section)
- **Cold open (0-1.8 s):** flash-forward to hour 6 of the same timeline (oven-server red, closet lights out), then a pixel REWIND (1.8-2.4 s) to 59 days before.
- **Prep (2.4-7.8 s, comedy):** fast-forward, 59 days in 3.6 s (2.6-6.2 s, 1 s ≈ 16 days); the wall calendar flips once per 1.1 day (no digits). Hour 0 (07:45 UTC, May 12, 2017, a Friday) arrives at 7.4 s as a single red pixel in the oven.
- **Freeze (8.0-9.6 s):** the clock stops.
- **Race (9.6-18.6 s): log clock**, h = 10^(f·log10 169) − 1, f = (t − 9.6)/9, so 0 → 168 h (one week). A pixel kitchen timer shows it; a HUD label says "REAL HOURS, LOG CLOCK". Kill switch 7.3 h lands at t = 13.31 s; 20 h at 14.93 s; the hero kitchen's route (61 h) at 16.84 s.
- **Snap (21.8-28.2 s): linear, true proportions, 1 week in 3 s (1 s = 56 h)**, first "as it happened" alone (21.8-24.8), then both panels on the same clock (25.2-28.2).

## Speed math
**Threat (red): the-worm-rewind model.** extent(h) = (σ(h) − σ(0)) / (σ(7.3) − σ(0)), σ(h) = 1/(1 + e^(−1.16 (h − 4.0))), clamped to 1 after 7.3 h. Constraints: 0 at t0 (s1); saturated by the 7.3 h kill switch, when the initial variant stops encrypting new machines (s1); consistent with ">230,000 systems in >150 countries within 24 h" (s2). The direction (bulk before the stop) comes from Salim Neino's (Kryptos Logic) prepared testimony to the US House Science Committee, June 15, 2017 ("between 1-2 million systems may have been affected in the hours prior to activating the kill-switch"; congress.gov/115/meeting/house/106120/witnesses/HHRG-115-SY21-Wstate-NeinoS-20170615.pdf), used only for direction, never as a number (different unit: "affected" from sinkhole sampling). Peak rate check: 1.16/4 × 230,000 / 0.969 ≈ 69,000 systems/h, consistent with Kryptos Logic's "tens of thousands per hour at the peak" (s3). Midpoint and steepness are NOT sourced; no count is ever shown against time.
- Each of the 81 kitchens = an equal slice of the systems hit. Kitchen i turns red at h_i = σ⁻¹(σ(0) + q_i (σ(7.3) − σ(0))), q_i ranked by grid distance from an origin kitchen plus noise (L.rng). The hero kitchen is given q = 0.05 (red at ≈ 1.5 h, t ≈ 11.1 s): an early one, so we see it happen over his shoulder.

**Human aggregation (green, real).** Per kitchen, route (the fix reaches someone who applies it) at g_i = max(7.3, L.lognormalQuantile(u_i, 20, 168)) h: median 20 h (same-day emergency patch for old systems, hour unverified, s6), p90 168 h (end of the NHS disruption week, s4), floored at the 7.3 h kill switch (first documented stop, s1). σ = ln(168/20)/1.2816 = 1.66. u_i stratified (i + 0.5)/81, shuffled. The hero kitchen u = 0.75 → 61 h (day three). The patch disk sits on every counter from 59 days before t0 (f1, s5, 1,416 h); green threads from a "patch" pantry to each kitchen show the routing, arriving at g_i. The unread-alert stack (f2) is `verified:false`: drawn as a gray memo pile, never dated or counted.

**AI counterfactual (illustrative).** Analog `ai_counterfactual.aggregation_median` = 1 h; same spread, so p90 = 1 × 168/20 = 8.4 h; per kitchen a_i = L.lognormalQuantile(u_i, 1, 8.4) with the same u_i. Basis (analog): spotting the hard-coded domain is a few-hour expert task inside the ~17.4 h METR 50% time horizon (RATES.md); matching unpatched machines to a 59-day-old critical patch and routing the alert to whoever can apply it is inventory work made cheap by the ~40x/yr cost fall at fixed capability (Epoch, RATES.md). In the AI panel a kitchen stays gray only if its route beats its red hour; the red timeline is identical in both panels. Humans still apply the patch (the last shot is the chef's own hand). Not a claim the event would certainly have been prevented.

**Numbers on screen (two):** "59 days" (patch released March 14, 2017, 59 days before t0; s5) and "1 week" (the snap axis length = human p90, NHS week May 12-19; s4). Deviation from concept.json's "1 week vs 1 h": the brief caps numbers at two and 59 days is the recipe itself, so the AI p90 (8.4 h) is not printed; it is shown proportionally on the same "1 week" axis as green pips clustered at the left, labeled "illustrative". Both panels plot p90-comparable distributions, not a median against a p90.

**The stop, honestly:** "One stranger stopped it. Partly luck." One independent researcher registered the hard-coded domain at 7.3 h (s1), to track it, not knowing it would stop it.

## Shot list and camera (world = 9x9 grid of kitchens, each kitchen is the full closet drawn at 1/9 scale; one continuous camera, no crossfades)
| t | shot | camera | beat |
|---|---|---|---|
| 0.0-1.8 | SC1 CLOSE OTS cold open, hour 6 | Z 11.2 → 11.9 push | chef profile (angry), green disk on counter, oven-server red, lights out. "Take one unpatched machine." |
| 1.8-2.4 | REWIND | hold | pixel rewind bands to 59 days earlier |
| 2.4-7.8 | SC2 OTS comedy | Z 10.8 → 11.7 slow push | disk drops in, dust gathers, calendar flips, memos pile. "Leave out for 59 days." / "Garnish with unread alerts." / "Serve warm on a Friday." One red pixel at 7.4 s. |
| 8.0-9.6 | FREEZE | locked | dim, hit. "This recipe really happened." |
| 9.6-12.0 | SC3 OTS | push Z 11.7 → 12.6 | red enters, oven glows, monitors go dark. "It spreads on its own." |
| 12.0-15.4 | SC4 PULL OUT | Z 12.6 → 0.78 (1/Z-linear) | 81 kitchens, red by rank, green threads crawling; kill switch at 13.3 s from a lone figure above the grid. "Every kitchen, same recipe." / "One stranger stopped it. Partly luck." |
| 15.4-18.6 | SC5 DROP IN, closer | Z 0.78 → 14.4 | the chef, angry, steam; his route arrives at 61 h (16.8 s). "The fix sat on the counter." |
| 18.6-21.2 | SC6 | hold, dim | "We slowed it down so you could see it." |
| 21.2-21.8 | freeze | - | silence |
| 21.8-29.8 | SC7 SNAP | screen space, two 940 px panels | stamp; true speed alone, then both. "Same fix. Routed sooner." |
| 29.8-32.8 | SC8 IN++ | Z 19.8 on the counter and slot | the chef's hand puts the disk in (routed version, labeled illustrative). "This is the bottleneck." |
| 32.8-38.0 | END | - | L.endCard, 5.2 s |

**Zoom cycles.** Cycle 1: IN 0-12 (Z 11-12.6) → OUT 12-15.4 (Z 0.78) → IN+ 15.4-18.6 (Z 14.4, face). Cycle 2: OUT to the snap panels 21.8-29.8 → IN++ 29.8-32.8 (Z 19.8, hand and disk).

## 3D translation note
- SC1-SC3: 35 mm over the chef's right shoulder at his eye height, voxel/pixel-art closet (think chunky voxels), the toque soft in the foreground, the oven-server sharp; red light spills pixel by pixel along the floor cables.
- SC4: a straight vertical pull through the ceiling (4 s, ease both ends) into a top-down grid of 81 identical voxel kitchens, like a cooking-game level select; red glows per kitchen; green threads are thin emissive lines from a pantry at the grid's edge. The stranger is a single lit window outside the grid.
- SC5: a faster drop than the rise, ending at 85 mm on his face, closer than SC1.
- SC8: 100 mm macro on the voxel hand and the green disk entering the slot.
- Characters: one chef sprite with swappable brows, eye and mouth (deadpan, smug, stunned, angry, determined).

## Copy variants
- "Take one unpatched machine." / "Leave out for 59 days." / "Garnish with unread alerts." / "Serve warm on a Friday."
- "This recipe really happened." / "It spreads on its own." / "Every kitchen, same recipe." / "One stranger stopped it. Partly luck."
- "The fix sat on the counter." / "Same fix. Routed sooner."
- Alternates: "Prep time: two months." / "Serves 150 countries." / "Best before: March." / "Chef's note: the fix was included."

## Tags
{"slug":"recipe-for-a-worm","structure":"recipe-parody","medium":"8-bit","family":"cooking","scale":"organization","pace":"sprint","camera":"over-the-shoulder","emotion":"anger","protagonist":"an institution","analog":"wannacry-2017"}
Diversity check: OK (nearest the-department-of-later 0.56, recipe-for-a-shortage 0.56, fifty-nine-days 0.67).
