# Seven Minutes (slug: seven-minutes)

Tier: animatic

**Title:** The Alarm Never Rang
**Logline:** One operator's face, lit by an alarm panel that has gone quiet without anyone telling him. The clock sweeps through almost two hours of nothing. Four control rooms each hold one piece of the picture, and the phone lines between them reach and drop. Then the red takes the whole region in minutes.

**Structure:** `ticking-clock` (research/VIRAL_STRUCTURES.md #1). The clock is a real clock driven by the stated mapping: a wall clock in the close shot and a clock dial on the ground of the whole region in the wide. Neither shows numerals.
**Analog:** `blackout-2003`

## Diversity check
The first tags (blueprint / stop-start / dread) came back TOO SIMILAR to the-last-thirteen-days (distance 0.22), because that film already used ticking-clock + blueprint + machine + dread + one person + locked-off.
I changed three dimensions and kept the assigned structure and analog: **medium blueprint -> isometric** (cutaway iso control rooms), **emotion dread -> loneliness** (four rooms, each alone with its piece), **pace stop-start -> slow build** (flat for about 1.9 h, then a sprint).
Result: OK (nearest the-last-thirteen-days 0.56, the-balcony 0.67, nineteen-days 0.67).

Tags: {"structure":"ticking-clock","medium":"isometric","family":"machine","scale":"organization","pace":"slow build","emotion":"loneliness","protagonist":"one person","camera":"locked-off close-up with a single pull-out","analog":"blackout-2003"}

## Time mapping (one mapping, stated)
Race runs film t = 1.0 to 17.0 s. **Event hours h = (t - 1) x 0.125, so 1 film second = 7.5 minutes**, linear. h = 0 is the analog's t0 (the moment the control-room alarms started failing without anyone noticing, sourced s2). The cascade finishes at h = 1.98, which is film t = 16.84.
The cold open (t < 1) is a flash-forward to the end state (h = 2.0), in the same room and the same framing, and it is labeled "later".
The snap panels use their own shared linear axis (0 to 2 h across 840 px). Both panels use the same axis.

## Speed math
- **Threat (red).** The analog has only verified points at h = 0 (extent 0) and h = 0.85 (first line trip, s6, extent 0), plus the fact that the cascade followed soon after 16:05 and reached about 50 million people (s3). I use only those.
  - At h = 0.85 (t = 7.8) one transmission line near the operator's room turns red. The red window wedge on the ground clock opens here.
  - The analog's own notes flag the 15:32 and 15:41 trips as unverified. They are **not drawn**.
  - The cascade uses **L.logistic fitted through the analog's endpoints**: extent 0.01 at h = 1.87 and 0.99 at h = 1.98. That gives x = 0.01·e^{rt} and e^{r·0.11} = 9801, so r = 83.6 /h. **Doubling time = ln2/r = 0.0083 h ≈ 30 s** of real time. On screen that is 0.9 s, so the cascade happens at the same mapping as everything else. It is not linear.
  - Each of the ~520 city windows, each grid line and each room gets an outage rank, ordered by distance from the first trip plus seeded jitter. A window goes dark when rank/N < extent(h).
  - The 1.87 and 1.98 endpoints are verified:false in the file, so they drive motion only. No time appears on screen, and the red window wedge on the clock has no numerals.
- **Human aggregation (green).** Fragment ready times come from analog `solution.fragments`, with brightness meaning attention:
  - f1: IT staff know the servers are failing at h = 0.1 (t = 1.8). They are bright from then on, but no line reaches the operator.
  - f4: the neighbors see the trips from h = 0.85. The exact call times are verified:false, so no time is shown.
  - f2: the operator realizes at h = 1.5 (t = 13). His face goes to panic and his lever brightens.
  - f3: the coordinator's state estimator comes back at h = 1.83 (t = 15.6).
  - The six phone lines between the four rooms connect at **L.lognormalQuantile(q, median 1.5 h, p90 1.83 h)** with q = (i + 0.5)/6. That gives h ≈ 1.21, 1.35, 1.45, 1.55, 1.66 and 1.86. Each line grows for 0.35 s, holds green for 0.9 s, then breaks. They never all hold at once, because the pieces never assembled into the load-shed decision (analog aggregation notes).
- **The window.** The fix (shed about 1,500 MW) could have been applied from h = 0.85 until the point of no return, "about 1 hour" (f5, s6). On screen it is the red wedge on the clock, and the card says "one hour".
- **AI counterfactual (snap).** `ai_counterfactual.aggregation_median` = 0.25 h against the human 1.5 h. Basis, from the analog: all fragments were machine-readable signals already inside the control rooms. Joining "alarms are dead + lines tripping + shed load" is a sub-1-hour expert reading task, well inside the ~17.4 h METR 50% time horizon (RATES.md, May-Aug 2026). The routing lands about 36 min before the first contingency. **Labeled "illustrative" on screen.** People still decide and shed load. In the AI panel the cascade is drawn as a dashed outline with "People still decide." We do not claim it would have been prevented.

## On-screen numbers (max two)
1. "one hour" (the window, from f5/s6)
2. "50 million" (people affected, confirmed by snippets in s3 per the analog notes)

"7 minutes" is **not** on screen because it depends on verified:false times. The card says "in minutes". No utility or organization names appear.

## Shot list (DUR 38 s)
| t | shot | camera | beat |
|---|---|---|---|
| 0.0-1.0 | SC0 COLD OPEN | locked-off CLOSE on operator (zoom 11.6) | flash-forward to h=2: room dark, window full of red, green lever dim within reach. Card "The alarm never rang." Label "later". |
| 1.0-6.0 | SC1 CLOSE LOCKED-OFF | hold | t0. Room lit, alarm panel dark and silent, clock sweeping. Cards "The panel stayed quiet." / "It had failed. Nobody told him." |
| 6.0-9.5 | SC2 PULL-OUT (the single pull-out) | zoom 11.6 -> 1.0, eased, 3.5 s | Room A shrinks into an iso cutaway on a region plate. The ground clock dial is revealed. First line trips red at 7.8. Card "Four rooms. Four pieces." |
| 9.5-16.9 | SC3 WIDE hold | locked | Phone lines reach, connect green, drop. Cards "The calls kept dropping." / "The window: one hour." Cascade 15.96-16.84, red floods and lights go out. |
| 16.9-19.4 | SC4 DOLLY IN, closer | 1.0 -> 15.5 on his face | Dark room, red window, sad face. Card "50 million people. In minutes." |
| 19.4-22.0 | SC4 hold (dead stop) | locked | "We slowed it down so you could see it." |
| 22.0-29.4 | SC5 INSERT: TWO TIMELINES | flat full-frame panels | Freeze, silence, one hit. Panel 1 "As it happened" sweeps 0->2 h. Panel 2 "Routed (illustrative)" sweeps the same axis. |
| 29.4-33.2 | SC6 CLOSEST | zoom 19 on hand and lever | Back inside: the lever is lit, the phone line holds. Card "This is the bottleneck." |
| 33.2-38.0 | END | - | L.endCard, 4.8 s |

**Zoom cycles:** in 0-6 (locked close) -> OUT 6.0-9.5 -> IN+ 16.9-19.4 (zoom 15.5 > 11.6) -> [flat insert] -> IN++ 29.4 (zoom 19).

## 3D translation note
- **SC0/SC1:** 50 mm lens at eye level, locked on a tripod. The operator is a soft vinyl-toy bean at a real console. The only light is a cool, dead-flat spill from the monitors. The alarm board on the wall has physical lamps, all off, and the silence should be audible. A real wall clock second hand ticks.
- **SC2:** one continuous crane and dolly-out through the room's missing ceiling, about 4 s, easing in and out. It rises to a true isometric orthographic camera over a tabletop region model: four cutaway control rooms like dollhouses, tiny towns with lit windows, and a clock dial etched into the table.
- **SC3:** the orthographic camera is fully locked. Phone lines are glowing fiber strands that arc between rooms and snap. The cascade should be a physical wave of windows going dark across the model in under a second, with a red emissive glow creeping along the pylons.
- **SC4:** a slow push back down into room A, ending tighter than SC1 (85 mm). The only light is the red from the window.
- **SC6:** macro on the hand and lever.
- 3D gets richer through real light falloff: the face really lit by dead screens, then only by red.

## Copy variants
- "The alarm never rang." (hook)
- "The panel stayed quiet."
- "It had failed. Nobody told him."
- "Four rooms. Four pieces."
- "The calls kept dropping."
- "The window: one hour."
- "50 million people. In minutes."
- Alternates: "Silence looked like safety." / "Everyone had a piece. No one had the picture." / "The grid had lag." / "Nobody was asleep. The routing was."
