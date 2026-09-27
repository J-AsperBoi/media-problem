# The Reference Desk

Tier: animatic
Slug: the-reference-desk
Structure: wait-for-it (research/VIRAL_STRUCTURES.md #4)
Analog: false-news-2018 (Vosoughi et al. 2018; Hoaxy lag, Shao et al. 2016)
Tags: medium children's-book flat · family library · scale organization · pace one long take · camera locked-off close-up with a single pull-out · emotion tenderness · protagonist one person

## Logline
One long take at a library reference desk. The librarian already has the right book open (green) and writes the correction card in the first hour. She drops it in the library's pneumatic tube. Through the window behind her, a red pamphlet passes hand to hand. The camera pulls out once: the tube loops the long way around the whole hill town while the pamphlet reaches every street. The camera comes back in closer. The card drops out of the tube two metres from her desk, and she pins it to the notice board 13 hours in. Everyone outside already has the red one. The promise on screen is "Watch the notice board."

The pamphlet's topic is never stated: it is a red rectangle with a blurred scribble. The readers are drawn as ordinary, calm townspeople. The broken part is the routing (the tube), not the people and not the librarian.

## Metaphor map
| on screen | analog |
|---|---|
| red pamphlet passed hand to hand, red lines between the hands | the false story's cascade (s1, s2): 1,500 people in about 10 h |
| the town: 1,500 people on 14 terraced streets | the paper's 1,500-user benchmark audience |
| green book open on her desk from hour 0 | f1/f2: the verified ruling and the accurate story already exist at t0 |
| a green dot on a few passers-by | f2: people who already knew the true version (truth spreads about 6x slower, s1) |
| her correction card in the tube, pinned at 13 h | f1: fact-check sharing lags the claim by about 13 h (s3) |
| five other branch libraries, each lighting up when their card is pinned | the other fact-checking outlets (six in s1), with lags spread lognormally (s3 range 10-20 h) |
| snap bottom lane: the card goes straight to the board at about 1 h and follows the pamphlet's own path | ai_counterfactual (illustrative) |

## Time mapping (one stated mapping)
- Cold open (t 0-1.2): flash-forward on the same timeline to hour 10 (stamped "later"). The window is full of red, and she is already looking at it. At t 1.2-2.0 a rewind (the wall clock's hand spins back and the red drains) returns to hour 0. Same camera, same take.
- Race: **film t = 2.0 + hours** (1 s = 1 h, linear) for hours 0 to 14 (t 2 to 16). The card is dropped in the tube at 1 h (t 3). The q=0.1 branch pins at 8.45 h (t 10.45). Our card pins at 13 h (t 15.0).
- Freeze at hour 14 (t 16-19).
- Snap: **1 s = 4 h** (linear), hours 0 to 24 over t 19.6 to 25.6, in both lanes at once.

## Speed math
**Threat (red).** The analog sources only the endpoints: 1 person at 0 h and 1,500 people at about 10 h (s2). Following the director's note, I did not draw a line between them. I used a logistic fit through the endpoints (the same fit as the-fact-check) with s0 = 1/1500 and share(10 h) = 0.99, so r = ln(99(1-s0)/s0)/10 = 1.19 /h. That gives a **doubling time of 0.58 h. This is a fit, not a sourced number.** People reached: 3 at 1 h, 11 at 2 h, 109 at 4 h, 687 at 6 h, 1,352 at 8 h, 1,485 at 10 h, and 1,500 by 13 h. Each person has a rank i in a hand-to-hand tree that grows outward from the first reader, who stands just outside her window. Order = distance from that reader plus seeded noise; parent = the nearest earlier-ranked person. Person i gets the pamphlet at the inverse logistic of (i+0.5)/1500. The pamphlet visibly travels from the parent's hand in the 0.25 h before that, and a red line stays between them.

**Green specks (f2, people who already knew).** The logistic is stretched 6x (s1: truth takes about 6x longer to reach 1,500), which gives a doubling time of 3.49 h. Random people in the town. At hour 14 only 16 of the 1,500 know.

**Human aggregation (f1).** Hoaxy lag: median 13 h, typical range 10-20 h, used as p90 = 20 (s3), via L.lognormalQuantile. Six libraries sit at quantiles q = 0.1, 0.3, 0.5, 0.7, 0.85, 0.95, which gives lags of 8.45, 10.9, **13.0 (ours)**, 15.5, 18.4 and 22.6 h. Only the first two and ours land inside the race window; the snap shows the rest. The tube's route is a metaphor. Only the arrival time is data: the card moves along the tube at a constant pace from 1 h to 13 h.
Snap top lane: the correction then follows the pamphlet's own path, reaching person i at t_i + 13 h. This is the Hoaxy reading: the fact-check volume is the claim's volume shifted by about 13 h.

**AI counterfactual (illustrative).** The analog's ai_counterfactual.aggregation_median is 1 h. Matching a circulating claim to an existing ruling is a task well under an hour, far inside the ~17.4 h METR 50% horizon in RATES.md, and falling cost (about 40x cheaper per year) makes screening affordable. Snap bottom lane: the card is pinned at 1 h, and person i is reached at t_i + 1 h (the same assumption as fifteen-hundred and the-fact-check).
**Speed is not belief.** Anyone the correction reaches keeps a red core inside a green ring, and a card says so. Reaching someone is not persuading them, and people still decide.

## Numbers on screen (two)
- "13 hours" / "13 h" (fact-check lag, s3, verified)
- "~1 h" (AI lane, labeled illustrative, from ai_counterfactual)
No other numerals appear: the wall clock has no numbers, and "1,500" and "10 hours" never appear as text.

## Shot list (one take, one camera)
| t | shot | camera |
|---|---|---|
| 0-1.2 | COLD OPEN, hour 10. CLOSE on the librarian at the desk, green book open, window behind her full of red. Card: "Watch the notice board." | locked, zoom 2.4 on the desk |
| 1.2-2.0 | REWIND to hour 0 (the clock spins back, the red drains). | locked |
| 2.0-5.5 | CLOSE. She writes the card and drops it in the tube (1 h). The first pamphlets pass through the window. "She already has the right book." / "Her card takes the long way." | locked |
| 5.5-9.5 | PULL OUT (the only pull-out): through the cutaway library to the hill town. The tube loops around every street, and red runs hand to hand. | zoom 2.4 -> 0.3, ease in-out |
| 9.5-11.4 | WIDE HOLD (hours 7.5-9.4). One branch library lights up at 8.45 h. "Hand to hand, the whole town." | locked wide |
| 11.4-14.0 | PUSH IN, closer than the start, onto the notice board. She walks over. | 0.3 -> 3.6 |
| 14.0-16.0 | CLOSE+: the card drops out of the tube and is pinned at 13 h. "Pinned. 13 hours in." | locked |
| 16.0-19.0 | FREEZE, dimmed. "We slowed it down so you could see it." | held |
| 19.0-27.5 | SNAP: two 940px lanes, as it happened (13 h lag) vs frontier AI routing (~1 h, illustrative), then "Speed is not belief." | panels |
| 27.5-30.5 | EXTREME CLOSE on her face and the pinned card, red window behind. "This is the bottleneck." | 3.8 -> 4.6 slow creep |
| 30.5-35.0 | End card (4.5 s). | |

Zoom cycle: IN (0-5.5) -> OUT (5.5-11.4) -> IN, closer (11.4-16) -> IN+ (27.5-30.5).

## 3D translation note
Shoot it as a single locked-off shot on a 50mm lens at desk height, about 1.2 m, facing her. The window behind her should be a real depth plane, with the terraced town rising up a hill behind it. The pull-out is a dolly back combined with a crane up, through a dollhouse cutaway of the library (the front wall hinges away), slowing to a stop about 150 m up and back so the whole hill town reads as one picture-book diorama. The tube is a gleaming gray pneumatic pipe you can follow with your eye, and the card is a tiny green glint inside it. The return is a slow 6 s push in on a longer lens (85mm) to the cork board, ending tighter than the opening. Characters are soft felt or clay picture-book figures. The librarian needs subtle facial animation (a brow lift, a half smile) because her tenderness carries the film. In 3D the pamphlet exchanges (hand to hand, red paper glints) and the green book's light on her face get much richer.

## Copy variants
- "Watch the notice board." (hook, used)
- "She already has the right book." (used)
- "Her card takes the long way." (used)
- "Hand to hand, the whole town." (used)
- "Pinned. 13 hours in." (used)
- "Speed is not belief." (used)
- Alts: "The answer was on the desk." / "Right book. Wrong route." / "Correction shipped. Nobody pinged." / "Two metres. Thirteen hours."

## Diversity
`node tools/diversity.js` -> OK: distinct enough (nearest before-the-price 0.56, the-truth-loop 0.56).
