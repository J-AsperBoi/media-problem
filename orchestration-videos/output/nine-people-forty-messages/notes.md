# Nine People, Forty Messages

Tier: animatic
Slug: nine-people-forty-messages
Title: Nine People, Forty Messages
Logline: POV: you are scrolling the family group chat through a heat wave. Nine people, forty messages, no plan. Four relatives each hold one green piece (the forecast, a doctor friend, a cooler flat, and you, the spare key, typed but not sent) and the pieces keep scrolling past each other instead of landing on Gran's door. Red is the heat in the chat header, rising.
Structure: `pov` (VIRAL_STRUCTURES.md #6), sprint pace.
Analog: `heatwave-2003` (France, August 2003).
Medium: text-only typography. Everything is type: the chat, the city (street words: "river", "ring road", "market"...), Gran's door (a frame with a nameplate), your head and shoulder in the foreground as a silhouette filled with the word "you". Red = only the heat (the chat header fill and a city haze). Green = only the four pieces.
Tender, not mocking: every message means well (lunch plans, "someone check on Gran?", "she hates being fussed"); the routing is what breaks.

Diversity: assigned tags came back TOO SIMILAR to the-balcony (0.44: same analog, structure, family, scale, emotion). Changed the metaphor family from `family` to `traffic` (messages as traffic, pieces that never get routed); the analog, structure and everything else kept. Result: OK (nearest the-two-feeds 0.56, the-balcony 0.56).

## Time mapping (one mapping)
- Race: **1 s = 1 day**, day = t - 1.4 for t in [1.4, 15.4] (days 0 to 14; day 0 = Aug 1, 2003, never shown). The day is shown as the chat's own weekday dividers ("Saturday", "Sunday"...), not numbers; Aug 1, 2003 was a Friday, so day 11 = Tuesday, day 12 = Wednesday.
- Cold open (0 to 1.4 s): flash-forward to day 11 (Tuesday) of the same timeline: header near its reddest, your unsent draft in the compose bar.
- Snap: both lanes on one shared clock, days 0 to 19 swept in 4.5 s (1 s = 4.2 days), the same scale in both lanes.

## Speed math
**Threat (red).** Same fit as nineteen-days / the-heat-map / the-balcony. The analog sources only the endpoints (extent 0 on day 0; 1.0 = all ~14,800 excess deaths by day 19, s2) and the peak (daily excess > 1,000 on days 11-12, s2). `L.logistic` fitted with its midpoint at day 11.5 and extent 0.99 at day 19: k = ln(99)/7.5 = 0.613/day, early doubling 1.13 days, s0 = 0.00086.
- Heat curve rho(d) = 4 s(1-s) (s the raw logistic): d1 0.006, d3 0.022, d4.6 0.057, d8 0.38, d9.1 0.61, d11 0.98, d11.5 1.00, d12 0.98, d14 0.59. This is the "heat" on screen: the chat header's red fill and glow, and the red haze over the city, are rho(d). It is a fit to the sourced mortality peak (temperature peak day 11, heat wave days 1-14 bracket it), stated as such.

**The forty messages (chat timestamps follow the heat curve).** Message rate r(d) = 0.25 + rho(d) (a baseline of ordinary family chatter plus chatter that rises with the heat; the baseline weight is a vibe, the shape is the fitted curve). The 40 messages sit at the quantiles (i + 0.5)/40 of the cumulative rate over days 0-12: 0.33, 0.99, 1.65, 2.29 ... 11.66, 11.79, 11.93. Seven messages in the first 4.6 days, then the chat accelerates to about six a day at the peak: the chat gets busier exactly as the heat rises, and the pieces scroll away faster.
- Pieces posted: Joe's forecast is message 2 (day 0.99; the analog's forecast fragment is ready at day 1, f1). Maya's doctor friend is message 11 (day 6.2). Sami's cooler flat is message 17 (day 8.2). Your spare key is typed on day 2.6-3.2 and left unsent.
- Gran posts messages 1, 4, 13, 22 (days 0.3, 2.3, 7.0, 9.3); her last is "staying in today. love you all x".

**Human aggregation (green).** Analog aggregation median 12, p10 9.5, p90 305 (days). Two-sided lognormal (as in the-balcony): sigma_low = ln(12/9.5)/1.2816 = 0.182, sigma_high = ln(305/12)/1.2816 = 2.525. The day each piece is actually routed to Gran's door, at quantiles:
- Maya's doctor friend q = 0.1: day **9.5**
- Joe's forecast q = 0.3: day **10.9**
- your spare key q = 0.5: day **12.0** (the median; the analog's Plan Blanc, Aug 13, verified)
- Sami's cooler flat q = 0.9: day **305**: never within the film; its line keeps falling short.
Before a piece's day, its green line reaches part way toward the door and falls back (attempt rhythm is a vibe; arrival days are data). The quantile each relative is assigned is illustrative; the spread is the analog's.

**Loss as absence.** Gran's status "last seen today" stops updating when the heat curve peaks (day 11.5, E = 0.5, the same threshold the-balcony used for the neighbor's room): it freezes at "last seen Tuesday" while the chat moves on to Wednesday, and her name grays. That timing is the curve; it is symbolic, not a claim about any person. No bodies, no suffering. Your key reaches her door on day 12, half a day after.

**AI counterfactual (illustrative).** `ai_counterfactual.aggregation_median` = 3 days (analog basis: joining a known forecast with the heat-mortality relationship and routing a warning is a short expert task, inside the ~17.4 h METR 50% time horizon in RATES.md; cost at fixed capability falls ~40x/year, Epoch, so watching every family chat's pieces is affordable). Same lognormal shape scaled by 3/12: 2.4 / 2.7 / 3.0 / 76 days. On day 3 the heat curve is 0.02 (well before the peak). On screen it is labeled illustrative, the red curve is drawn identically in both lanes, and the caveat line is "People still decide who goes." In the IN++ shot frontier AI is a neutral gray line ("suggested: key + doctor + cool room, you decide"), never green: it connects, people choose and go. Not a claim that any real death would have been prevented.

## Numbers on screen (two)
- "day 12" (median aggregation = Plan Blanc, Aug 13, verified in the analog) and "day 3" (AI counterfactual, labeled illustrative).
- "Nine people. Forty messages." are counts of the on-screen objects (exactly nine chat members and forty rendered messages), not data claims. No dates on screen; weekdays are the chat's clock.

## Shot list (DUR 36 s)
| t | shot | camera | what happens |
|---|---|---|---|
| 0.0-1.4 | SC1 COLD OPEN | OTS CLOSE, your phone (flash-forward, Tuesday) | Header glowing red; chat busy; your green draft "I have Gran's spare key." unsent. Card: "POV: you have the missing piece." |
| 1.4-6.0 | SC2 OTS | CLOSE, slow push | Day 0. Gray chatter; Joe's green forecast lands (day 1) and scrolls up; you type the key message and stop. Cards: "Nine people. Forty messages." / "No plan." |
| 6.0-9.0 | SC3 PULL OUT | DOLLY OUT from your phone to the city of words | Nine phones scattered across a city spelled in type; gray message threads flash between them; four green lines reach toward Gran's door and fall short. Card: "Every piece is already here." |
| 9.0-10.5 | SC4 WIDE | hold, slow drift | Chat traffic at the peak rate; the heat haze rising. |
| 10.5-13.4 | SC5 DIVE | DOLLY IN to Gran's door, closer than SC2 | Doctor (9.5) and forecast (10.9) lines land at the door as green words; day 11.5 her status freezes, name grays; day 12 the key lands. Card: "Everyone means well." |
| 13.4-15.4 | SC6 CLOSEST | slow push on the door | "Day 12. After the peak." |
| 15.4-18.0 | SC7 FREEZE | locked | Dim, silence. "We slowed it down so you could see it." |
| 18.0-25.5 | SC8 SNAP | flat, two lanes 920 px wide | One hit. Same clock sped up. Human lane: green at day 12, after the red peak. AI lane (illustrative): day 3. Caveat. |
| 25.5-28.5 | SC9 IN++ | OTS CLOSEST on your phone, day 3 (illustrative) | The four pieces pinned together as one green plan; your key message sent; a neutral "suggested by frontier AI, you decide" line; Gran: "see you soon, love". Card: "Not them. The routing." |
| 28.5-31.0 | SC10 | hold | "This is the bottleneck." |
| 31.0-36.0 | END | | L.endCard, 5 s. |

Zoom cycles: Cycle 1: IN (phone fills frame, zoom ~13) 0-6.0 -> OUT 6.0-9.0 (to city, zoom 1) -> IN+ 10.5-15.4 (Gran's door, zoom ~20-24). Cycle 2: SNAP flat 18-25.5 -> IN++ 25.5-28.5 (your phone at 1.35x the first OTS).

## 3D translation note
- Key shots: the OTS (35 mm, just behind your right ear at seated height, shallow focus on the screen, the header's red light spilling onto the letters of your shoulder); the dolly out (one continuous pull up through the ceiling to an aerial of a city at dusk, nine phone screens the only lights, 3 s, eased, a hold at the top); the dive to Gran's door (slower, ending at 50 mm on the nameplate, closer than the first OTS).
- Characters and props: people as volumetric letterforms of their names; the city as street names laid on the ground like road paint; green pieces as glowing words that travel along streets toward the door; the door solid and ordinary.
- Richer in 3D: the red heat as shimmer and haze over the city (never flame), phone light on faces-of-type, the green lines routed along real streets and stopping at intersections.

## Copy variants
- "POV: you have the missing piece." (used) / "POV: you have Gran's spare key."
- "Nine people. Forty messages." / "No plan." / "Every piece is already here." / "Everyone means well."
- "Day 12. After the peak." / "Not them. The routing." / "People still decide who goes."
- Unused: "Seen by eight." / "Typed. Not sent." / "Everyone assumed someone closer."

## Tags
{"structure":"pov","medium":"text-only typography","family":"traffic","scale":"family","pace":"sprint","emotion":"loneliness","protagonist":"a crowd","camera":"over-the-shoulder","analog":"heatwave-2003"}
Diversity check: OK after changing family to traffic (nearest the-two-feeds 0.56, the-balcony 0.56).
