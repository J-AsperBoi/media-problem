Tier: animatic

# Rewind (slug: the-worm-rewind)

**Logline.** A nurse at a ward terminal watches red run through the station map on her wall. We rewind the whole city network like a ghostly tape, then play it forward again: a quiet green line (frontier AI, illustrative) routes the fix that already existed to her stop. She still presses the key.

- **Structure:** ghost-rewind (research/VIRAL_STRUCTURES.md #18). The dim, desaturated green "ghost route" on the map from the first seconds is the AI-speed timeline; it is revealed as such (labeled illustrative) at the snap.
- **Analog:** wannacry-2017 (research/analogs/wannacry-2017.json). Never named on screen; no company names.
- **Protagonist:** AI, as a connective line only: a green route drawn between stations. It never acts on the ward; the nurse decides and applies. Frame of every AI shot says "illustrative".
- **DUR:** 36 s, 1080x1920, 30 fps.

## Data problem, and what I did about it

The analog sources only t0 (07:45 UTC), the >230,000 systems within 24 h (s2), and the kill-switch registration at 7.3 h (s1). Earlier films fit a logistic from one machine that put most infections after 7.3 h. That split is unsourced and implies the stop did not help.

Web search (2026-09-26) found one sourced figure near the kill-switch time:
- **Salim Neino (CEO, Kryptos Logic), prepared testimony to the US House Committee on Science, Space & Technology, June 15, 2017:** based on the velocity of the attack, estimated by sampling data from Kryptos Logic's infrastructure, "between 1-2 million systems may have been affected in the hours prior to activating the kill-switch", contrary to the more conservative widely reported ~200,000. The same testimony says Kryptos Logic mitigated over 60 million infection attempts in the month after the domain was registered. Sources: https://www.congress.gov/115/meeting/house/106120/witnesses/HHRG-115-SY21-Wstate-NeinoS-20170615.pdf ; hearing record https://www.govinfo.gov/content/pkg/CHRG-115hhrg26234/html/CHRG-115hhrg26234.htm . (Direct fetch was blocked by the sandbox proxy; quoted via search-engine extracts of the testimony. Treat as verified-by-snippet, not re-read in full.)

This is an estimate in a different unit ("affected", from sinkhole sampling) than the 230,000 ("infected systems", Europol/Kaspersky), so I do **not** put it on screen and do **not** fit through it as a number. I use it only for its direction: the bulk of the spread happened **before** the 7.3 h kill switch, and the stop then prevented a very large number of further attempts. That flips the earlier films' split.

**Red model used (shape illustrative, endpoints sourced):**
- extent(h) = (σ(h) − σ(0)) / (σ(7.3) − σ(0)), σ(h) = 1/(1+e^(−1.16 (h − 4.0))), clamped to 1 after 7.3 h (initial variant stops encrypting new machines at the kill switch, s1).
- Constraints: 0 at t0 (s1); saturated (≥ the reported total) by 7.3 h (direction from Neino testimony); flat after 7.3 h, still consistent with ">230,000 within 24 h" (s2).
- Check: peak rate = 1.16/4 × 230,000 / 0.969 ≈ 69,000 systems per hour, consistent with Kryptos Logic's "tens of thousands of infected systems per hour at the peak" (analog s3 note).
- The midpoint (4.0 h) and steepness are NOT sourced; the exact shape inside 0–7.3 h is uncertain. On screen no count is ever shown against time; red is shown only as stations turning red, saturating before the stop. Each station = an equal slice of the ~230,000 hit systems, red at h_i = σ⁻¹(σ(0) + q_i (σ(7.3) − σ(0))), q_i ranked by network distance from a red entry station plus noise.

## Time mapping (one stated mapping per section)
- **Race (film 2.0–14.0 s):** logarithmic clock, h = 10^(f · log10 169) − 1, f = (t − 2)/12, so 0 → 168 h (one week). Labeled on screen "real hours, log clock". Kill switch 7.3 h lands at t ≈ 6.95 s; 20 h at 9.1 s; 168 h at 14.0 s. A wall clock with hands shows the real hour (hour hand 12 h/rev), no digits.
- **Cold open (0–1.0 s):** frame at h = 5 (red large on the wall map and terminal), then a desaturated rewind to h = 0 (1.0–2.0 s). Same timeline, clearly rewound (hands spin back).
- **Second rewind (16.5–18.0 s):** 168 h → 0, ghostly.
- **Snap (18.8–22.8 s):** linear, true proportional speed: 1 week in 4 s (1 s = 42 h). Red saturates in ~0.17 s.

## Speed math
- **Human aggregation (green, real):** per station, g_i = max(7.3, L.lognormalQuantile(u_i, 20, 168)) h. median 20 h (Microsoft's same-day emergency patch, hour unverified, s6), p90 168 h (end of the NHS disruption week, s4), floor 7.3 h = the first documented response (kill switch, s1). σ = ln(168/20)/1.2816 = 1.66. So no station gets its human route before red arrives: the fix reached people after the damage.
- **AI counterfactual (ghost, then snap):** same stations, same u_i, g_i = L.lognormalQuantile(u_i, 1, 8.4) h: ai_counterfactual.aggregation_median = 1 h (analog basis: spotting the hard-coded domain is a few-hour expert task inside the ~17.4 h METR 50% horizon in RATES.md; matching unpatched machines to the 59-day-old patch is cheap inventory work given the ~40x/yr cost fall, Epoch). p90 scaled with the same spread: 1 × 168/20 = 8.4 h. In the AI panel a station stays safe only if its AI route arrives before its red time; the red timeline is identical in both panels. Illustrative, not a claim the event would certainly have been prevented. Humans still approve and apply (shown: the nurse presses the key).
- **The ward (hero station):** u = 0.6 → human route 30.5 h, AI route 1.5 h; its red time is computed from its rank (printed in _debug). The ward is red in the real timeline and saved only in the illustrative one.
- **On-screen numbers (two):** "1 week" = every stop routed, real (p90 = 168 h, NHS week May 12–19, s4, verified). "8 h" = every stop routed with the AI route (p90 of the counterfactual, labeled illustrative). Deviation from concept.json's "1 week vs 1 h": 1 h is the AI *median* while 1 week is the human *p90*; comparing unlike statistics would overstate the gap, so both numbers are p90s. The 1 h median still drives the animation.

## Shot list (camera, zoom cycles)
| t | shot | camera | beat |
|---|---|---|---|
| 0.0–1.0 | SC1 CLOSE | eye level on nurse, wall map behind, terminal red | cold open at hour 5; "The fix was one stop away." |
| 1.0–2.0 | SC1 REWIND | slight push | desaturated rewind to hour 0 |
| 2.0–5.0 | SC2 CLOSE | slow push to wall map | red enters map; ghost route already spreading |
| 5.0–9.0 | SC3 CRANE UP | room fades full-frame into the city map; zoom 2.4 → 0.9 | red saturates; kill switch pops green at 7.3 h |
| 9.0–11.0 | SC3 WIDE hold | slow drift | human routes creep; ghost complete long ago |
| 11.0–14.0 | SC4 DROP DOWN | map zooms onto ward stop, fades into the room, closer than SC1 | ward lights go out |
| 14.0–16.5 | SC5 | locked | "We slowed it down so you could see it." |
| 16.5–18.0 | SC6 REWIND | wide, ghostly | week runs backward |
| 18.0–18.6 | freeze | — | silence |
| 18.6–25.5 | SC7 SNAP WIDE | two stacked panels 940 px | true speed vs AI route (illustrative) |
| 25.5–28.5 | SC8 DOLLY IN | closest: face, hand, terminal | green line arrives; ghost hand and real hand align; she presses |
| 28.5–31.0 | SC9 | — | "This is the bottleneck." |
| 31.0–36.0 | END | — | end card, 5 s |

Zoom cycles: IN 0–5 → OUT 5–11 → IN+ 11–14; OUT (snap wide) 16.5–25.5 → IN++ 25.5–28.5.

## 3D translation note
- SC1/SC8: 35 mm then 50 mm at eye height (1.5 m) in a dim ward; the wall map is an illuminated transit-style panel; the terminal screen is the only warm light. SC8 is a slow 85 mm push to her hand on the key, the ghost hand a volumetric green-gray glow that her hand fills.
- SC3 crane: a physical rise from eye level through the ceiling to ~400 m over a city where the transit map is literally laid on the streets as light rails; 6–8 s, ease in/out, hold at the top. Red runs along the rails like traffic; the green route is a thin emissive line being drawn.
- SC4 drop: faster than the rise (4 s), ending closer than SC1.
- Rewinds: whole scene desaturates, particles reverse, clock hands spin back; subtle tape-line distortion.
- Richer in 3D: parallax of stations, the scale of the city under one thin green line.

## Copy variants
- "The fix was one stop away." (used)
- "Rewind." / "Play it again, routed."
- "The line finds her. She decides." (used)
- "Same city. Same week. Different route."
- "Patch shipped. Route missing."
- "Civilization has lag. Rewind it."

## Tags
{"slug":"the-worm-rewind","structure":"ghost-rewind","medium":"subway map","family":"traffic","scale":"city","pace":"sprint","emotion":"resolve","protagonist":"AI","camera":"crane up and drop down","analog":"wannacry-2017"}

Diversity check: OK (nearest fifty-nine-days 0.67, the-relay 0.67).

## Build notes
- Rendered 36.0 s (ffprobe), matches DUR.
- Debug: kill switch lands at film 6.95 s; ward red at 3.7 h (film 5.6 s); ward human route 30.5 h, AI route 1.5 h (illustrative). In the AI panel 40 of 51 stations are routed before their red arrives. That share depends on the unsourced shape of the red inside 0-7.3 h, so it is never stated on screen; only the two p90s ("1 week", "8 h illustrative") appear as numbers.
- Frame 1 (thumbnail): nurse, red-lit terminal and a red wall map, the green "the fix" station top-left, "The fix was one stop away."
- Crane up is a match-cut: the room camera pushes into the ward stop on the wall map, then the full-frame city map (same transform) pulls out; drop-down reverses it. No rectangular crossfade patches.
- Sprint on screen. The race is log-clocked (labeled). The snap is linear (1 s = 42 h, labeled).
- Known weaknesses: the dashed ghost route over red tracks can read as striping; the wall map labels are small in the close shots; the nurse bean is simple.

## Scores
Hook 7, Speed accuracy 7, Snap impact 6, Emotion 6, Originality 7, Craft 7, Honesty 9
Overall: 7.0
Virality: 6% - The thumbnail has a clear red-vs-green question and a face, and the rewind device is a real open loop, but a grave subway-map explainer about a 2017 event from a small account, with no outrage hook, most likely stalls well under 100k.
