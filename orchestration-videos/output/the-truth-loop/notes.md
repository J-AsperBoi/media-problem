# The Truth Loop

Tier: animatic
Slug: the-truth-loop
Structure: seamless-loop (research/VIRAL_STRUCTURES.md #15)
Analog: false-news-2018 (Vosoughi, Roy & Aral, Science 2018; Hoaxy lag, Shao et al. 2016)
DUR: 32 s, 1080x1920, 30 fps. Medium: ink wash on rice paper.

## Logline
A loop inside one mind. One face, lit by a phone, inside an ink enso that fills like a level timer. The red claim arrives, the feed fills with it, the camera pulls out once to show the whole feed-world of 1,500 heads going red in ten hours while the green pieces (people who already knew, six fact-checkers) sit scattered at the edges. It falls back in, closer, into the eye: the green correction lands on the phone about 13 hours in, exactly as the enso closes and the loop restarts. It never quite lands. Last frame = first frame.

This analog's sixth film. Siblings: highway split, couch typography (the-two-feeds), particle zoom (the-fact-check, fifteen-hundred), chalkboard rewind (the-rumor-rewound), bean committee (the-committee-in-my-head). This one is the only pure loop, and the only ink wash.

## Time mapping (one mapping, linear)
- **Race: 1 film second = 1 hour.** h = t - 1.25 for t in [1.25, 15.25] (h 0 to 14).
- Cold open t 0 to 1.25 = h 12.8 to 14.05 of the *same* timeline (the end of the previous lap); the loop tail t 30.8 to 32.0 = h 11.6 to 12.8, so the last frame flows into frame 1.
- Snap (t 18.4 to 20.4): **1 s = 10 h** in both panels, 0 to 20 h, then hold.
- The loop restart at h = 14 is staging (a new lap), not data. The on-screen claim is that the correction is ~13 h behind, which is sourced.

## Speed math
**Red (claim, one cascade of 1,500).** Endpoints only in the analog (1 person at 0 h, 1,500 at ~10 h, s2), so per director's notes a logistic fit, the same one as the-fact-check: s0 = 1/1500, share(10 h) = 0.99, r = ln(99 (1 - s0)/s0)/10 = 1.19 /h, doubling 0.58 h (a fit, not a sourced number). People reached: ~3 at 1 h, ~109 at 4 h, ~687 at 6 h, ~1,485 at 10 h.
- Wide shot: each of 1,500 heads has a rank (distance from the seed + noise, a spatial proxy for a reshare tree; staging) and goes red at the inverse logistic of its rank.
- The protagonist is rank 3, reached at h = ln 3 / 1.19 = 0.92 h. That is when the red claim first appears in the feed.
- Feed: 1.8 posts scroll past per hour (staging). Post j is red if u_j < 0.8 x share(h_j), where h_j is the hour it scrolled in (so the feed fills with reshares as the audience fills).

**Green 1: people who already knew (f2, ready at 0 h).** The true version spreads 6x slower (s1) through the same crowd: doubling 3.49 h, 99% at 60 h (s2). At 14 h this is ~16 of 1,500 heads (green in the wide shot). Scattered, far apart.

**Green 2: fact-checks (f1), human.** Six fact-checking organisations (six in s1), green nodes at the edge of the crowd. Each sends its link at L.lognormalQuantile((i+0.5)/6, median 13, p90 20) (Hoaxy lag, median ~13 h, typical 10-20 h used as p90 = 20; sigma = ln(20/13)/1.2816 = 0.336): 8.2, 10.3, 12.2, 13.9, 16.4, 20.7 h. Four land inside the 14 h lap, all after the crowd is ~99% red (10 h); two land after the lap restarts. The protagonist's own feed gets the median one: the green post lands at 13 h. Real variance: some early, some absurdly late.

**AI counterfactual (illustrative).** ai_counterfactual.aggregation_median = 1 h: matching a circulating claim to an existing verified ruling is a well-under-1-hour expert task, far inside the ~17.4 h METR 50% time horizon (RATES.md), and RATES.md's ~40x/yr cost decline makes screening every rising claim affordable. In the routed panel each person gets the correction 1 h after the claim reaches them (routed along the claim's own path, the same assumption as fifteen-hundred and the-fact-check). The red still fills at exactly the same speed: **speed is not belief**. Each reached head keeps its red core inside a green ring; people still decide.
Human panel: the correction starts moving at 13 h and then spreads at the true-news pace (doubling 3.49 h), so by 20 h only a few percent of heads have a green ring.

## Numbers on screen (two, both sourced)
- "13 hours" / "13 h" (fact-check lag, s3)
- "1 h" (AI counterfactual, labeled illustrative)
No other numerals: the hour dial is an ink enso with no digits; red dab = everyone reached (10 h), green dab = the correction (13 h).

## Shot list and camera
| t | shot | camera | what happens |
|---|---|---|---|
| 0.0-1.2 | SC1 CLOSE (cold open, h 12.8-14) | locked-off, face + phone | red feed, green post sliding in at the bottom, enso almost closed. "The fix always lands late." |
| 1.2-1.4 | blink | ink wash floods and recedes | lap restarts, h = 0 |
| 1.4-4.0 | SC1 CLOSE | locked-off | gray scroll; at 0.9 h the red claim appears; face lights red. "One claim. One feed." |
| 4.0-7.5 | SC2 PULL OUT (the single pull-out) | zoom 1 -> 0.042, log eased | face becomes one head of 1,500; red floods outward. "Then everyone you follow." |
| 7.5-11.2 | SC2 WIDE hold | locked | crowd ~99% red at 10 h; green knowers scattered; fact-check links crawl in late. "The correction exists. In pieces." |
| 11.2-15.2 | SC3 FALL IN (closer) | zoom 0.042 -> 14, into the left eye | the phone reflected in the eye: green post lands at 13 h as the enso closes. "13 hours later." |
| 15.2-18.0 | FREEZE | dead stop, dim | "We slowed it down so you could see it." |
| 18.0-25.0 | SC4 SNAP | two panels, 920 px wide | as it happened (13 h) vs routed (1 h, illustrative). "Speed is not belief." |
| 25.0-27.4 | SC5 CLOSE++ | eye, zoom 20 | "This is the bottleneck." |
| 27.4-30.8 | END | | L.endCard held 3.2 s at full |
| 30.8-32.0 | LOOP TAIL | card fades to SC1 CLOSE at h 11.6-12.8 | last frame = frame 1 |
Zoom cycle: IN (locked close) 0-4.0 -> OUT 4.0-7.5 -> hold -> IN+ 11.2-15.2 (eye, 14x closer than the opening) -> IN++ 25-27.4 (20x).

## 3D translation note
A single locked-off 85 mm portrait at night, the only light a phone screen below frame: the face is sumi-ink and wet paper, the light a red stain that bleeds into the paper grain. The enso is a physical brush ring floating in depth around the head. The pull-out is one smooth, accelerating dolly-back on a straight axis, 4 s, widening to 16 mm, until the head is one lantern in a vast ink field of 1,500 lanterns igniting red outward in a wave; six green lanterns hang at the horizon throwing slow thread-like arcs. The fall back in is a 4 s plunge along the same axis past the head, into the cornea, where the phone's reflection fills frame. Richer in 3D: wet-ink bleeding simulation on every light change, depth-of-field between heads, real curvature in the eye reflection.

## Copy variants
- "The fix always lands late." (used, cold open)
- "One claim. One feed." (used)
- "Then everyone you follow." (used)
- "The correction exists. In pieces." (used)
- "13 hours later." (used)
- "Speed is not belief." (used, snap)
- Unused: "Every lap, the same lag." / "Your mind has lag." / "Refresh. Refresh. Refresh." / "The patch ships after the crash."

## Tags
{"structure":"seamless-loop","medium":"ink wash","family":"game","scale":"mind","pace":"one long take","camera":"locked-off close-up with a single pull-out","emotion":"vertigo","protagonist":"one person","analog":"false-news-2018"}
Diversity: the assigned tags (pace sprint) were TOO SIMILAR to the-mind-grid (0.44); changing family alone did not help. Changed pace sprint -> one long take (fits a locked-off loop): OK, nearest the-mind-grid 0.56. Game family: the enso is a level timer and the loop is a respawn.

## Result
Rendered output/the-truth-loop/the-truth-loop.mp4, 32.00 s (ffprobe). tools/verify.js: PASS (stray 0.08%, QR found). Last frame (h 12.77, card up) matches frame 1 (h 12.8) to within one frame of motion.

## Scores
- Hook: 7 (face lit green-and-red inside an ink ring with the green post sliding in, plus "The fix always lands late."; legible, but it's calm rather than arresting)
- Speed accuracy: 8 (logistic fit through sourced endpoints, lognormal fact-check lags with the real 10-20 h spread, one 1 s = 1 h mapping; the post scroll rate and loop restart are staging)
- Snap impact: 7 (freeze, silence, hit, then two 920 px panels; the routed crowd going green-ringed while red cores stay is clear, and "Speed is not belief" keeps it honest)
- Emotion: 6 (the fall into the eye with the correction landing in the reflection gives some vertigo; the face stays fairly neutral)
- Originality: 7 (only ink-wash film and only pure loop in this analog set; enso as a lap timer)
- Craft: 6 (the brush textures read as ink; the shoulders read a bit like braids and the wide shot is dense)
- Honesty: 9 (topic never named, person not mocked, AI labeled illustrative, "people still decide", only 13 and 1 on screen)
Overall: 7.1
Virality: 9% — a seamless loop with a relatable face-in-phone hook helps replays, but it's a quiet ink piece with an abstract claim and a data snap, which rarely breaks out from a small account.
