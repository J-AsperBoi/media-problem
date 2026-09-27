Tier: animatic

# One by One (slug: the-worm; on-screen title never uses the slug)

**Logline.** POV of a nurse at her station, present tense: the screens down her ward turn red one by one, walking toward her. The camera cranes up through the ceiling into the blueprint of the ward, then the city, where the green pieces sit far away: a patch, an alert unread in an inbox, and one researcher who finds a stop, partly by luck. We drop back into her eyes, closer, as the fix arrives after. Then the same week at true speed, beside an illustrative routed version where a line reaches her and she applies it.

- **Structure:** pov (research/VIRAL_STRUCTURES.md #6). Strictly first person, present tense copy.
- **Analog:** wannacry-2017 (research/analogs/wannacry-2017.json). The threat is never named; no company names on screen.
- **Medium:** blueprint. White/gray line drawing on a desaturated dark blue-gray (#1d2229 family); only red #ff3b30 and green #34d27b are saturated.
- **DUR:** 36 s, 1080x1920, 30 fps.

## Red model (same as scenes/the-worm-rewind.js)

The analog sources only t0 (07:45 UTC, s1), >230,000 systems within 24 h (s2), and the kill-switch domain registered at 7.3 h (s1). Data issue (from output/the-worm-rewind/notes.md): earlier films fit a logistic from one machine that put most of the spread after 7.3 h; that split is unsourced and implies the stop did not help. The one sourced figure near the kill-switch time is **Salim Neino (CEO, Kryptos Logic), prepared testimony to the US House Committee on Science, Space & Technology, June 15, 2017**: "between 1-2 million systems may have been affected in the hours prior to activating the kill-switch" (estimated from sinkhole sampling), and over 60 million infection attempts mitigated in the following month. Sources: https://www.congress.gov/115/meeting/house/106120/witnesses/HHRG-115-SY21-Wstate-NeinoS-20170615.pdf ; https://www.govinfo.gov/content/pkg/CHRG-115hhrg26234/html/CHRG-115hhrg26234.htm (quoted via search extracts in the earlier film's research; not re-read in full here). Different unit ("affected" vs "infected"), so it is **not** on screen and not fitted as a number; it is used only for direction: the bulk of the spread came **before** the stop.

- extent(h) = (σ(h) − σ(0)) / (σ(7.3) − σ(0)), σ(h) = 1/(1+e^(−1.16 (h − 4.0))); clamped to 1 after 7.3 h. **No new red after 7.3 h** (the initial variant stops encrypting new machines once the domain is registered, s1).
- Check: peak rate ≈ 1.16/4 × 230,000 / 0.969 ≈ 69,000 systems/h, consistent with Kryptos Logic's "tens of thousands per hour at the peak" (s3 note).
- Midpoint and steepness are NOT sourced; the shape inside 0–7.3 h is illustrative.
- Each screen drawn (14 in her ward, 60 in ten other buildings, 74 in all) = an equal slice of the hit systems; red time h_i = σ⁻¹(σ(0) + q_i(σ(7.3) − σ(0))), q_i = rank / N by a spread order (building entry order + position; in her ward from the far end toward her station) plus noise. So across the city the first screen goes red ≈ 0.4 h, half ≈ 4.0 h, the last ≈ 7.1 h, all before the stop; in her ward the first at 1.56 h (film 4.2 s), the last at 6.72 h (film 6.8 s). Applying a global curve to one ward is an illustrative simplification (not every NHS machine was hit); it is stated here, not on screen.

## Time mapping
- **Cold open (0–1.4 s):** frame at h = 6.6 (the ward almost fully red, her screen at the frame edge turning), then a quick desaturated wind-back to h = 0 (1.4–2.0 s), card "That morning."
- **Race (2.0–14.0 s):** log clock, h = 10^(f·log10 169) − 1, f = (t−2)/12: 0 → 168 h. On screen: a clock with hands (outbreak began 07:45 UTC) and "real hours, log clock"; no digits. Kill switch 7.3 h lands at t = 6.95 s; her building's route (47.8 h) at 11.1 s; 168 h at 14.0 s.
- **Snap (17.6–21.6 s, held to 24.4):** linear true proportional speed: 168 h in 4 s. Red saturates in ≈0.17 s.

## Speed math
- **Human aggregation (real):** per building, g = max(7.3, L.lognormalQuantile(u, 20, 168)) h; median 20 h (same-day emergency patch for unsupported systems, hour unverified, s6), p90 168 h (end of the NHS disruption week May 12–19, s4, verified), floor 7.3 h (first documented response, s1). σ = ln(168/20)/1.2816 = 1.66. Her building u = 0.7 → 47.8 h.
- **The green pieces:** the patch existed 1,416 h (59 days) before t0 (s5), the alert about two months earlier (s4, approximate, unverified date), the researcher's stop at 7.3 h (s1). Shown as pieces already lit across town (patch, alert) and one that lights at 7.3 h (researcher). "Partly luck" is said on screen: the stop was a hard-coded domain one person registered while investigating; it halted the initial variant, it did not undo the damage.
- **AI counterfactual (illustrative):** same buildings, same u: g_ai = L.lognormalQuantile(u, 1, 8.4) h. Median 1 h = ai_counterfactual.aggregation_median (basis in the analog: spotting the hard-coded domain is a few-hour expert task inside the ~17.4 h METR 50% horizon in RATES.md; matching unpatched machines to the 59-day-old patch and routing the alert is cheap inventory work given the ~40x/yr cost fall, Epoch). p90 scaled with the same spread: 1 × 168/20 = 8.4 h. Her building: 2.39 h. A screen stays clear only if its route arrives before its red time; the red timeline is identical in both panels. So in the routed version the far screens in her ward are still red; only the later ones are spared. People still apply the fix (her hand presses apply). Not a claim the event would certainly have been prevented.
- **On-screen numbers (two, like with like, p90 vs p90):** "1 week" = every place routed, real (p90 168 h, s4, verified). "8 h" = every place routed with the AI route (p90 of the counterfactual, labeled illustrative). The concept's "~1 h" is the AI *median*; comparing it to a human p90 would overstate the gap, so it drives the animation but is not shown.

## Shot list (camera, zoom cycles)
| t | shot | camera | beat |
|---|---|---|---|
| 0.0–1.4 | SC1 POV | eye level at the station, hands on keys, her screen at left edge turning red; corridor red; window with green pieces | "POV: the fix is across town." |
| 1.4–2.0 | SC1 wind-back | desaturate, hands of clock spin back | "That morning." |
| 2.0–4.2 | SC2 POV | locked, slight breathing | far screens go red, one by one |
| 4.2–6.9 | SC3 POV WALK | she steps out; dolly down corridor with bob, counter drops away | red walks toward her; her screen at edge turns |
| 6.9–10.6 | SC4 CRANE UP | tilt up to the ceiling, full-frame fade to top-down plan (z 2.4 on "you"), log-zoom out to the city (z 0.26) | kill switch lights; "Across town, one person finds a stop." / "Partly luck." |
| 10.6–12.2 | SC4 WIDE hold | slow drift | human routes crawl; hers arrives after the red; "The patch is already written." |
| 12.2–14.3 | SC5 DROP DOWN | log-zoom back to "you", full-frame fade into POV closer: bedside screen large at left, her hand raised | green arrives on a red screen; ceiling lights go out; "The fix arrives after." |
| 14.3–16.9 | SC6 | hold in the dark | "We slowed it down so you could see it." |
| 16.9–17.4 | freeze | silence | |
| 17.4–24.4 | SC7 SNAP WIDE | two stacked 940 px panels, city rotated | true speed ("1 week") vs frontier AI route ("8 h", illustrative) |
| 24.4–28.0 | SC8 DOLLY IN | closest: bedside screen, green "apply", her finger presses; far screens still red | "A line reaches her." / "She applies it." + illustrative |
| 28.0–30.8 | SC9 | — | "This is the bottleneck." |
| 30.8–36.0 | END | — | end card 5.2 s |

Zoom cycles: IN 0–6.9 → OUT 6.9–12.2 → IN+ 12.2–14.3 (closer than SC1); OUT (snap wide) 17.4–24.4 → IN++ 24.4–28.0 (closest).

## 3D translation note
- SC1–3: 24 mm handheld POV at 1.6 m, real hands in frame, a long ward corridor whose bedside screens are the only saturated light; the walk is a slow, heavy step cadence (about 1 step/s) toward the red.
- SC4 crane: continuous vertical rise straight up through the ceiling tiles (the ceiling reveals itself as a blueprint layer), to ~20 m over the ward plan, then ~1.5 km over a city drawn as a glowing architectural plan; 4 s, ease-in/out, hold 1.5 s at the top. Green pieces are tiny emissive objects at the plan's edges; routes are thin light lines drawn along streets.
- SC5 drop: faster than the rise (2 s), landing at 35 mm closer to the bedside screen than SC1; ceiling lights click off in sequence.
- SC8: 50 mm macro push to her fingertip on the apply button; screen light goes from gray to green.
- Richer in 3D: parallax of corridor bays, the red glow spilling on the floor, the vertical scale of the crane.

## Copy variants
- "POV: the fix is across town." (used, hook)
- "That morning." / "One screen." / "Then the next." / "Then the ward." (used)
- "Across town, one person finds a stop." / "Partly luck." (used)
- "The patch is already written." / "The fix arrives after." (used)
- "A line reaches her. She applies it." (used)
- "Patch shipped. Route missing." / "Every screen, one by one." / "The answer is across town."

## Tags
{"slug":"the-worm","structure":"pov","medium":"blueprint","family":"city","scale":"organization","pace":"sprint","emotion":"dread","protagonist":"one person","camera":"POV walk","analog":"wannacry-2017"}

Diversity check: OK (nearest fifty-nine-days 0.56, the-last-thirteen-days 0.67, the-balcony 0.67).

## Build notes
- Rendered 36.0 s (ffprobe), matches DUR.
- Debug: kill switch at film 6.95 s (after the last ward screen, 6.78 s); her building's human route 47.8 h (film 11.1 s); AI route 2.39 h (illustrative). In the routed version 12 of her 14 ward screens are spared (the two far ones were red at 1.56 h and 2.18 h, before any route could arrive); 58 of 74 screens city-wide. Those shares depend on the unsourced shape of the red inside 0-7.3 h, so they are never on screen; only the two p90s ("1 week", "8 h" illustrative) appear as numbers.
- Frame 1 (thumbnail): POV at the station, her hands on the counter, a red screen cut by the left frame edge, the whole corridor glowing red, green lights in the far window; card "POV: / the fix is / across town." with the last two lines in green.
- Crane up: the POV pitches up into the ceiling grid, then a full-frame fade to the top-down plan (her "you" marker, same red screens), log-zoom out to the city with the pieces (a patch, an alert unread, a researcher who lights at 7.3 h with a fading ring). Drop down reverses into a closer bedside POV where the green bar lands on an already-red screen and the lights go out.
- Camera note: the POV walk is a short one (1.5 m, 2.7 s) with step bob; not a long walk.
- Known weaknesses: hands are clean line drawings but read a bit like raised palms at the counter; kill-switch ring is faint; wide shot is busy (ten buildings and eleven route lines); snap panels are small-detail at phone size, though labels are 44-110 px; the red spread in her ward uses the global curve (stated in notes only).

## Scores
Hook 7, Speed accuracy 7, Snap impact 6, Emotion 7, Originality 6, Craft 7, Honesty 9
Overall: 7.0
Virality: 7% - The first-person red corridor with "the fix is across town" is a clear, native POV hook and the blueprint look is distinctive, but it is a grave explainer about a 2017 event with no outrage or payoff twist from a small account, so it most likely stalls well below 100k.
