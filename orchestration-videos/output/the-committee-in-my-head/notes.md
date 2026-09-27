# The Committee in My Head

Tier: animatic
Slug: the-committee-in-my-head
Structure: countdown-list (research/VIRAL_STRUCTURES.md #7)
Analog: false-news-2018 (Vosoughi, Roy & Aral, Science 2018; Hoaxy lag, Shao et al. 2016)
DUR: 41 s, 1080x1920, 30 fps

## Logline
Over one person's shoulder, a phone. A red post lands. Push through the back of the skull into a meeting room: a committee of tiny bean selves, seated like a hearing panel, looking out through the eyes at the phone. The agenda says "1. React. 2. React." Countdown of the three pieces I already had: #3 a memory (a self at the filing cabinet holding a green card), #2 a friend who'd know (a self at a rotary phone, a line out of the skull), crane out to a city of skulls where the red fills every head at the cascade's speed and the friend glows green three blocks away, never reached; drop back in closer than before, #1 a doubt (the smallest self, green "?" raised, angry, ignored). The gavel falls. The correction lands 13 hours in. It was already in the room.

This analog's fifth film (after fifteen-hundred, the-two-feeds, the-fact-check, the-rumor-rewound). This one is the MIND (CLAUDE.md §5: a committee of tiny selves voting at once). Neuroscience stays metaphorical: no brain timings, the committee is a picture, not a claim about neurons.

## Time mapping
- Race (t 2.4 to 21.6 s): **1 second = 45 minutes** (h = 0.75 x running seconds), with the clock **stopped** during each countdown slam (0.6 s each at t 5.0, 9.0, 17.4; stop-start pace). h = 0 at t 2.4 (the post lands on this person's phone; taken as the cascade's t0: this person is among the first reached). h reaches 13.0 at t 21.53.
- Cold open (t 0 to 1.4) is a flash-forward on the same timeline to h = 11, labeled "later".
- Freeze at h = 13 (t 21.6 to 27.4): cards, then "We slowed it down so you could see it."
- Snap (t 27.6 to 31.6): **1 second = 5 hours**, 0 to 20 h, the same mapping in both panels.
- The dial in the room (a clock face with no numerals) shows h: one turn = 12 h.

## Speed math
**Threat (red), the committee's vote.** The red a person feels is social proof: how much of their feed already carries the claim. The analog sources only endpoints (1 person at 0 h, 1,500 people at ~10 h, s2), so per the director's notes the path is **L.logistic fitted through the endpoints** (same fit as the-fact-check): s0 = 1/1500, share(10 h) = 0.99, r = ln(99 x 1499)/10 = 1.19 /h, **doubling 0.58 h (a fit, not a sourced number)**. Shares: 0.7% at 2 h, 7% at 4 h, 20% at 5 h, 46% at 6 h, 74% at 7 h, 90% at 8 h, 99% at 10 h.
The 9 voting selves raise red paddles one by one: voter k turns red when share(h) passes (k + 0.5)/9 (inverse logistic). So the vote is barely red during #3 (h 2-4.5: 0-1 paddle), tilting during #2 (h 4.5-5.7: 1-3 paddles), and all red when the camera drops back in (h 10.4). The tally bar under the eye-windows is share(h) directly.

**City of skulls (the cascade).** 300 heads, each standing for 5 of the 1,500-person audience. Head rank = distance from our head plus noise; head i turns red at inverse logistic of (i + 0.5)/300. The friend (f2, people who already knew the true version) is green from h 0. Other people who knew turn green on the truth curve: same logistic stretched 6x (s1: truth takes ~6x longer), doubling 3.49 h; by h 9.3 (end of the city shot) no head besides the friend has it yet (the next one is due at ~10 h). The line from our head to the friend is attention: it flickers and breaks while the red volume rises.

**Human aggregation (green from outside, f1).** Hoaxy: fact-check sharing lags misinformation by ~13 h, typical 10-20 h (s3). L.lognormalQuantile with median 13, p90 20. This person's correction lands at the median, h = 13 (t 21.53). In the snap, a strip of 19 faint green ticks shows other cascades' lags at quantiles 0.05..0.95: 7.8 h to 25 h (q = 0.1 gives 8.5 h, a bit under the authors' 10 h; stated).

**AI counterfactual (illustrative).** ai_counterfactual.aggregation_median = 1 h: matching a circulating claim to an existing verified ruling and routing it to the people sharing it is a well-under-1-hour expert task, far inside the ~17.4 h METR 50% time horizon (RATES.md), and the ~40x/yr cost drop makes screening every rising claim affordable. Same spread shape: L.lognormalQuantile(q, 1, 20/13) = 0.6-1.9 h. In the illustrative lane the three in-head pieces also connect at ~1 h (the routed correction is the prompt that pulls memory, friend, and doubt to the table). At 1 h the red share is 0.2% (about 3 of 1,500) vs 100% at 13 h.
**Speed is not belief:** the red curve is drawn the same in both lanes (routing does not stop the claim), and the card says it. People still vote.

## Numbers on screen (two data numbers)
- "13 hours" / "13 h" (fact-check lag, s3, verified)
- "~1 hour" / "~1 h" labeled illustrative (ai_counterfactual)
The countdown numerals 3, 2, 1 are list labels, not data.

## Shot list and camera
| t | shot | camera | what happens |
|---|---|---|---|
| 0.0-1.4 | SC0 COLD OPEN, OTS CLOSE | over right shoulder, head fills lower left | flash-forward "later" (h 11): phone red; x-ray window in the skull shows red paddles and three green glows. "Three pieces. Already in my head." |
| 1.4-3.8 | SC1 OTS CLOSE | slow push 1.0 -> 1.12 | gray feed scrolling; red post lands at t 2.4 (h 0). "A claim lands." |
| 3.8-5.0 | SC1 DOLLY IN | 1.12 -> 7 into the back of the skull, full-frame crossfade to the room | |
| 5.0-9.0 | SC2 ROOM, "3 A memory." | wide 1.0 -> push to the filing cabinet (1.7) | comedy: one self asleep, one with a donut, chair staring at the eyes; memory-self waves a green card, its line to the chair breaks |
| 9.0-11.2 | SC3 "2 A friend who'd know." | push right to the phone-self (1.7) | green line out through the skull wall |
| 11.2-14.4 | SC4 CRANE OUT | room 1.7 -> 0.3 (skull seen from behind), crossfade, city 5.5 -> 0.9 | 300 heads fill red at the logistic; friend green, line to friend breaks |
| 14.4-16.0 | SC4 WIDE HOLD | 0.9 | "All around me, it spreads." |
| 16.0-17.4 | SC5 DROP DOWN | city 0.9 -> 5.5, crossfade, room 0.3 -> 2.4 on the doubt-self | |
| 17.4-21.6 | SC6 CLOSEST, "1 A doubt." | 2.4, slight drift | smallest self raises green "?", angry; paddles all red; gavel: MOTION CARRIES; the eye-windows go green at h 13 |
| 21.6-25.0 | SC6 HOLD | tilt up to the eyes | "The correction: 13 hours later." / "It was already in the room." |
| 25.0-27.4 | DEAD STOP | frozen, dimmed | "We slowed it down so you could see it." |
| 27.4-34.0 | SC7 SNAP, two stacked panels (920 px wide) | locked | as it happened vs routed (illustrative), 0-20 h at 1 s = 5 h. "Speed is not belief." |
| 34.0-36.8 | SC8 DOLLY IN++ | room 2.4 -> 3.4 on the doubt-self, closer than any shot | "This is the bottleneck." |
| 36.8-41.0 | END | | L.endCard, 4.2 s |
Zoom cycles: IN 1.4-5.0 (shoulder -> skull) -> OUT 11.2-16 (room -> city of skulls) -> IN+ 16-17.4 (to 2.4 on the doubt-self) -> IN++ 34-36.8 (to 3.4).

## 3D translation note
Over-the-shoulder 50 mm at 40 cm behind a person on a couch at night, the phone the only light. The dolly-in is a slow 3 s push into the back of the head that becomes a dissolve through a translucent skull (subsurface glow) into a wood-paneled chamber: a hearing-room dais of small soft bean characters (clay-like, felt texture) facing us, the two eyes behind them as tall arched windows showing the phone's glow. Crane out: the camera backs out through the skull and rises straight up at 2 m/s, then accelerating to 20 m, over a night neighborhood rendered as rows of heads-from-behind in windows; red light blooming head to head. Drop back down in a 1.4 s fall, ending at 85 mm eye level with the smallest self. Richer in 3D: depth of field on the dais, red paddle light casting on faces, the eye-windows as practical light sources, the green "?" as the only warm key light in the final close.

## Copy variants
- "Three pieces. Already in my head." (used, cold open)
- "A claim lands." (used)
- "A memory." / "A friend who'd know." / "A doubt." (used, countdown)
- "All around me, it spreads." (used)
- "The correction: 13 hours later." (used)
- "It was already in the room." (used)
- "Speed is not belief." (used)
- Variants: "My head has lag." / "The meeting ran on the wrong agenda." / "Motion carries. Nobody asked the doubt."

## Tags
{"structure":"countdown-list","medium":"bean cartoon","family":"body/biology","scale":"mind","pace":"stop-start","emotion":"anger","protagonist":"one person","camera":"over-the-shoulder","analog":"false-news-2018"}
Diversity check: first TOO SIMILAR with family "theater" (nearest the-department-of-later 0.44: same medium, family, pace, emotion, camera). Changed family to body/biology (the whole film lives inside a skull, and the city is made of heads). Now OK (nearest the-department-of-later 0.56).

## Build notes
- Preview 1 fixed: countdown numeral was not flying to its badge (overlapped the item text); "later" label moved inside the phone; #1 close reframed (z 2.1-2.2) with the doubt-self enlarged and the MOTION CARRIES stamp moved onto the floor so it stays in frame.
- Rendered 41.0 s (ffprobe), matches DUR.

## Scores
- Hook: 6 (over-the-shoulder red phone plus an x-ray skull with a tiny red committee reads; the three green glows in frame 1 are small on a phone)
- Speed accuracy: 8 (logistic fit through sourced endpoints drives both the paddles and the city, Hoaxy lognormal for the correction and the tick strip, AI lane from the analog; "person reached at h 0" and the city layout are stated staging)
- Snap impact: 6 (two 920 px panels, the green at ~1 h next to a flat red line vs 13 h after the red saturates reads; but it is a chart after a cartoon, and the panels are sparse)
- Emotion: 7 (the angry little doubt-self jumping with its "?" while the gavel falls is the strongest beat; the anger is aimed at the routing, not the person)
- Originality: 8 (a hearing-room committee inside a skull looking out through the eyes at the phone; the city made of heads)
- Craft: 7 (matched-scale crossfades skull to city and back, no patches; the room is dense and the wide city shot is wallpaper-like)
- Honesty: 9 (threat never named, AI labeled illustrative, "Speed is not belief." with the same red curve in both lanes, neuroscience kept metaphorical)
Overall: 7.3
Virality: 8% - the committee-in-the-head bit is relatable and shareable, but the payoff is a chart and the film asks viewers to track three pieces plus a city in 41 s, which most will not finish.
