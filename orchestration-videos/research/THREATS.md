# Threats and historical analogs (Phase 0, Part A)

Researched 2026-09-26. The data for each analog is in `analogs/<id>.json`. Those files hold every number and its source, and each one flags unconfirmed fields with `"verified": false`. **The threat labels below are internal only. Never name a threat on screen.**

Research method: direct page fetches were blocked for most domains in this environment. Numbers therefore come from (a) datasets downloaded and computed directly (the Our World in Data COVID files and the Shiller S&P 500 monthly series via raw.githubusercontent.com), or (b) search-result snippets, cited to the underlying page. Where a date was well established but did not appear verbatim in a snippet, the field is marked `verified: false`.

## How to read the numbers

- **Threat to peak**: time from the analog's t0 until the threat reaches its peak or near-full extent.
- **Human aggregation**: median, with p10 and p90, of the time for the existing solution fragments to connect and act. For most analogs there is no measured population of response times, so the spread is **derived from documented response dates**: roughly, the first connection is p10, the main response is the median, and the lasting structural fix is p90. Each file says exactly how. COVID is the exception: its spread is a real cross-country distribution computed from data.
- **Gap ratio** = human aggregation median ÷ threat time to peak. A ratio near or below 1 still means losing when the response lands after the damage peak. The "lands" column says which.
- **AI counterfactual**: illustrative only. It rests on RATES.md entries, usually the METR time horizon (~17.4 h at 50% success) and Epoch's falling cost at fixed capability (~40x/yr). Every assumption is modest and stated in the file. It never claims that the event would certainly have been prevented. Humans still decide and deploy.

## Summary table

| # | Internal label | Analog id | Unit | Threat to peak | Human aggregation median (p10–p90) | Lands | Gap ratio | AI counterfactual (illustrative) |
|---|---|---|---|---|---|---|---|---|
| 1 | pandemic | `covid-2020` | days | 64% of countries by day 75, 88% by day 96 | **421** (363–490), computed across 217 countries | ~11 months after the spread | 4.4x | 363 |
| 2 | misinformation cascade | `false-news-2018` | hours | false story reaches 1,500 people in ~10 | **13** (10–20) fact-check lag | after the audience is reached | 1.3x (truth itself: 6x) | 1 |
| 3 | extreme heat | `heatwave-2003` | days | ~14,800 excess deaths over days 0–19, peak days 11–12 | **12** (9.5–305) | after the peak | 1.0x to the peak, 16x to the lasting fix | 3 |
| 4 | grid cascade | `blackout-2003` | hours | flat for ~1.9 h, then 1%→100% of ~50M people in ~7 min | **1.5** (0.1–1.83), a lower bound: never assembled | never, before the point of no return (t=1.87) | window 1.0 h vs ≥1.87 h needed | 0.25 |
| 5 | cyberattack on infrastructure | `wannacry-2017` | hours | >230,000 systems in >150 countries in 24 | **20** (7.3–168) | kill switch at 7.3 h by one person; the patch had existed 59 days earlier | 0.8x (p90 7x) | 1 |
| 6 | financial contagion | `gfc-2008` | days | trough at day 584; 32% of the whole fall in one month after day 403 | **426** (125–1077) | 23 days after the crash began | 0.7x overall; 1.8x to the structural fix | 220 |
| 7 | solar storm / grid | `quebec-1989` | hours | whole grid down in ~90 s (0.025 h) | p10 **9** (83% restored), p90 **64,000** (hardening done in 1996); median is modelled | long after | 360x to 2.5 million x | 1 |
| 8 | nuclear escalation | `cuban-missile-1962` | days | two alert steps in 8 days (DEFCON 2 on day 8) | **12** (10–247); each message took 6–12 h to cross and decode | 4 days after the highest alert | 1.5x | 11 |
| 9 | antibiotic resistance | `penicillin-resistance-1946` | years | hospital resistance 12.5%→59% in ~1.75 yr (derived doubling 0.56 yr) | **13** (1.5–69) | after resistance became the norm | 7.4x | 2.5 |
| 10 | food price shock | `rice-2008` | weeks | ~$300→$1,100/t, peak at week ~30.6 | **31.3** (27.3–205) | at the peak | 1.0x | 28.3 |

## Evidence these are the most-discussed threats (short)

- **WEF Global Risks Report 2026** (Jan 2026). Top two-year risks: geoeconomic confrontation, misinformation/disinformation (ranked #2), interstate conflict, extreme weather, and societal polarization. Top ten-year risks: extreme weather (#1), biodiversity loss, and critical change to Earth systems, with misinformation #4. [WEF press release](https://www.weforum.org/press/2026/01/global-risks-report-2026-geopolitical-and-economic-risks-rise-in-new-age-of-competition/); [WEF top-10 story](https://www.weforum.org/stories/2026/01/global-risks-2026-top-10-two-and-ten-year-horizon/); [PreventionWeb summary](https://www.preventionweb.net/news/global-risks-report-2026-geopolitical-and-economic-risks-rise-new-age-competition).
- **Pew Research Center, spring 2025, 25 countries.** Share calling each a "major threat" (median): false information online 72%, climate change 67%, spread of infectious diseases 60%. The global economy and terrorism also rank high, and concern about cyberattacks from other countries rose sharply over five years. [Pew: international opinion on global threats](https://www.pewresearch.org/global/2025/08/19/international-opinion-on-global-threats/); [Pew: false information](https://www.pewresearch.org/global/2025/08/19/false-information-online-as-a-threat/).
- **Ipsos What Worries the World 2025.** War and conflict lead (52% in the 2025 Global Consumer Awareness Survey), climate change is at 31% there, and climate concern in the monthly tracker fell to 13% by Dec 2025. [Ipsos Dec 2025](https://www.ipsos.com/en-ch/what-worries-world-december-2025); [FSC summary](https://fsc.org/en/newscentre/general-news/climate-change-falls-over-20-behind-top-global-concern-in-2025-new-ipsos).
- **Nuclear war:** 46% of surveyed Americans are worried about US nuclear war within 10 years (YouGov, reported by [The Hill](https://thehill.com/policy/defense/5625003-americans-concern-nuclear-war-survey/)).
- **Antibiotic resistance:** 72% of Americans are worried (poll via [CIDRAP](https://www.cidrap.umn.edu/antimicrobial-stewardship/poll-us-public-aware-antibiotic-resistance-sketchy-details); poll year not confirmed).
- **Solar storms:** Google searches for "northern lights" in May 2024 were 8x higher than in any other month on record ([Space.com analysis of Google Trends](https://www.space.com/sun-space-weather-search-trends-may-2024-analysis)).
- Grid failure and food shocks are inferred from the WEF and Pew categories (critical infrastructure, the economy) and from the May 2024 storm coverage. They were not measured directly. **Not included:** AI risk, which the WEF 2026 lists, because it would be circular for this campaign, and biodiversity loss, which has no fast-speed analog.

---

## 1. Pandemic → `covid-2020`
- **Analog:** COVID-19, from the WHO notification (Dec 31, 2019) to vaccines reaching each country.
- **Threat speed:** the share of 234 countries/territories with a confirmed case rose from 10% (day 33) to 26% (day 61), 64% (day 75) and 88% (day 96). The early Wuhan doubling time was 7.4 days (Li et al., NEJM 2020).
- **Human aggregation:** the genome was shared on day 11 and the vaccine sequence was finalized on day 13. The first authorization came on day 337. The first dose reached the median country on **day 421**, with p10 day 363 and p90 day 490, a real cross-country distribution from the OWID vaccination data. Then a median of 95 more days to reach 10% of the population.
- **Gap:** 4.4x. The threat covered most of the world in ~3 months; the assembled answer needed ~14 months for the median country.
- **AI counterfactual:** day 363. Assumption: better routing brings the median country to what the fastest tenth actually got. No extra vaccine is assumed. Design was already fast (2 days), so AI gets no credit there.
- **Why it's a good film:** the strongest dataset in the set, with real per-country arrival times for the green. Every viewer lived through it. It suits a split-screen race: red dots cover the map in weeks while green dots arrive one country at a time with a long, uneven tail.

## 2. Misinformation cascade → `false-news-2018`
- **Analog:** true vs false news on Twitter 2006–2017 (Vosoughi, Roy & Aral, *Science* 2018), plus fact-check lag (Hoaxy, Shao et al. 2016).
- **Threat speed:** the average false story reaches 1,500 people in ~10 h; true stories take ~60 h (6x slower). Falsehood is 70% more likely to be retweeted.
- **Human aggregation:** sharing of fact-checks lags misinformation by ~13 h (typically 10–20 h).
- **Gap:** the correction starts moving after the audience has already been reached (1.3x). The truth itself is 6x slower.
- **AI counterfactual:** ~1 h to match a rising claim to an existing ruling and route it. Caveat stated: speed does not mean people will accept the correction.
- **Why it's a good film:** it happens on a phone screen, in first person. The fragments are literally people who already know the truth. Pew shows this is the most widely named threat (72%).

## 3. Extreme heat → `heatwave-2003`
- **Analog:** the August 2003 heat wave in France. Europe-wide, the summer death toll exceeded 70,000.
- **Threat speed:** ~14,800 excess deaths in France between Aug 1 and 20, peaking Aug 12–13 at more than 1,000 excess per day. Temperatures ran 11–12 °C above normal for 9 days.
- **Human aggregation:** ER doctors raised the alarm around day 9.5 (unverified day). The hospital emergency plan ("Plan Blanc") came on day 12, after the peak. The national heat plan came on day 305 (June 1, 2004).
- **Gap:** the emergency response landed just after the peak. The lasting fix was 16x the length of the event.
- **AI counterfactual:** day 3. Joining the forecast (available at the start) to known heat-mortality risk and routing warnings to care services. It reduces rather than eliminates harm.
- **Why it's a good film:** silent and slow, with isolated people in hot apartments. The fragments (forecast, doctors, caregivers) sit a few streets apart. WEF ranks extreme weather #1 over ten years. Show loss only as absence, e.g. windows going dark.

## 4. Grid cascade → `blackout-2003`
- **Analog:** the Northeast blackout of Aug 14, 2003.
- **Threat speed:** nothing visible for ~1.9 h after the FirstEnergy alarms failed silently at 14:14. Then the cascade took ~50 million people from 1% to 100% in about 7 minutes (the 16:06–16:13 times are marked unverified).
- **Human aggregation:** FE IT staff knew at 14:20 (+0.1 h). FE operators realized at ~15:42–15:45 (+1.5 h). The MISO state estimator was restored at 16:04 (+1.83 h). The Task Force's fix, shedding 1,500 MW around Cleveland before 16:06, had a one-hour window and **never happened**.
- **Gap:** the aggregation numbers are lower bounds, because the pieces never assembled. Restoring New York City took ~29 h.
- **AI counterfactual:** ~15 min from alarm loss to a routed warning. The fragments were all machine signals already inside control rooms.
- **Why it's a good film:** a perfect ticking clock. Every piece sits in a lit control room and the people in them cannot hear each other. The flat line and then a sudden drop is a great pace change.

## 5. Cyberattack on infrastructure → `wannacry-2017`
- **Analog:** the WannaCry worm, May 12, 2017.
- **Threat speed:** more than 230,000 systems in more than 150 countries within 24 h ("tens of thousands per hour" at peak).
- **Human aggregation:** one researcher registered the kill-switch domain at 7.3 h. Microsoft's emergency patch for unsupported systems came the same day (~20 h, hour unverified). NHS disruption lasted a week (168 h). The patch itself had existed for **59 days** before the attack, and NHS Digital had warned trusts to apply it.
- **Gap:** 0.8x at the median, but only because of one individual's luck. The institutional pieces took up to a week, and the fix was already two months old.
- **AI counterfactual:** ~1 h to the first working stop, with the old patch routed to unpatched machines before t0.
- **Why it's a good film:** "the answer was already here" is literal. Satirize the patch queue, not the people in it.

## 6. Financial contagion → `gfc-2008`
- **Analog:** the 2007–2009 global financial crisis. t0 is BNP Paribas freezing three funds on Aug 9, 2007.
- **Threat speed:** 18 months of slow drift, then the monthly-average S&P 500 went from 41% to 73% of its eventual 51% peak-to-trough fall in the single month after Lehman (day 403). The trough came in March 2009.
- **Human aggregation:** coordinated central-bank liquidity on day 125. The coordinated rate cut and recapitalizations on day 426 (median). The structural reform law on day 1077. Most of these dates are marked unverified pending a confirming snippet.
- **Gap:** the median response came 23 days after the crash phase began. Structural reform took 1.8x the whole crisis.
- **AI counterfactual:** day 220 (Bear Stearns). Assumption: a shared exposure map assembled at the first big failure. Political decisions stay human.
- **Why it's a good film:** "money parked, incentives pointed sideways" (Economy row of the atlas). The slow drift, then a sprint, is a strong pace shape. Keep it nonpartisan.

## 7. Solar storm / grid → `quebec-1989`
- **Analog:** the March 13, 1989 geomagnetic storm and the Hydro-Québec blackout.
- **Threat speed:** the whole grid went down in ~90 seconds, affecting ~6 million people.
- **Human aggregation:** it took more than 9 h to restore 83% of power. The lasting fix (series compensation, ~$1.2B per NOAA) was completed in 1996, ~7 years later. The **median is modelled** as the geometric mean because no documented midpoint exists, so don't put it on screen. Forecast centres had warned of a possible storm beforehand (exact timing unverified).
- **Gap:** 360x to restoration and ~2.5 million x to the lasting fix. This is the most extreme ratio in the set, so it needs a labeled log time scale.
- **AI counterfactual:** ~1 h to route the existing forecast into an operator posture. It does not shorten construction.
- **Why it's a good film:** cosmic scale meets one sleeping city, which suits Powers of Ten from the sun to a light switch. Very sublime. It also connects to the record May 2024 search interest in aurora.

## 8. Nuclear escalation → `cuban-missile-1962`
- **Analog:** the Cuban Missile Crisis, Oct 16–28, 1962, with message-latency data.
- **Threat speed:** US alert levels went from normal to DEFCON 3 (day 6) and then to SAC at DEFCON 2 (day 8); the U-2 was shot down on day 11. The DEFCON dates are marked unverified.
- **Human aggregation:** the first settlement letter came on day 10 and the public resolution on day 12. Each message took **~6–12 h** to arrive and be decoded, so both sides used TV and radio because it was faster. The hotline agreement came on day 247.
- **Gap:** 1.5x. The fix for the latency itself took 247 days.
- **AI counterfactual:** day 11, deliberately modest. It only removes transport and translation latency. The film must not suggest AI near nuclear decisions.
- **Why it's a good film:** "two players both losing" (the Between-nations row of the atlas). Messages crawl across the screen while clocks tick. The alternative analog, the 1983 false alarm, was not researched this pass.

## 9. Antibiotic resistance → `penicillin-resistance-1946`
- **Analog:** penicillin-resistant *S. aureus* at Hammersmith Hospital (London) after penicillin's introduction, through methicillin (1959) and MRSA (1961).
- **Threat speed:** 12.5% of isolates were resistant in April 1946, 38% in June 1947 and 59% in 1948. The logistic doubling time of 0.56 yr is derived here from the first two points, and it predicts the third within 3 points.
- **Human aggregation:** Mary Barber's warning (~1.5 yr). A new drug, methicillin, at ~13 yr. A global action plan at ~69 yr (unverified). MRSA appeared 2 years after methicillin.
- **Gap:** 7.4x, and the deployed fix was beaten in 2 years.
- **AI counterfactual:** 2.5 yr, for the stewardship/coordination fragment only. It explicitly does not speed up drug trials.
- **Why it's a good film:** it is a race that never ends: red adapts, green re-assembles. It suits a Body/biology metaphor, and one hospital ward is a natural setting for the close camera.

## 10. Food price shock → `rice-2008`
- **Analog:** the 2008 rice crisis, which Tambora 1815 replaced (see below).
- **Threat speed:** export bans and panic buying took Thai rice from ~$300/t to more than $1,000/t in ~6 months, peaking at more than $1,100/t in May 2008, during record harvests.
- **Human aggregation:** Japan held more than 1.5 million tonnes of idle imported rice the whole time. The need was public by April 2008 (a failed Philippine tender, week 27.3). The Japan–Philippines deal came in mid-May (week 31.3). Prices fell to ~$800/t within ~4 weeks. The standing G20 fix (AMIS, 2011) came at week ~205 (unverified).
- **Gap:** 1.0x. The connection landed exactly at the peak, and once made it worked in weeks.
- **AI counterfactual:** week 28.3, matching a public need to a known idle stock within 1 week.
- **Why it's a good film:** the purest version of the campaign line. The answer sat in a warehouse and one phone call's worth of connection fixed it. "Nine people, forty messages, no plan" at the scale of nations.

## Seeds considered but not used
- **Tambora 1815 / "year without a summer":** real, and grain prices in southern Germany quadrupled within 12 months, peaking in May–July 1817 (J. Nutr. 2002, "Emergency Relief during Europe's Famine of 1817"). No monthly dataset or dated response spread could be verified, so it was replaced by `rice-2008`. It is worth revisiting as a second food/climate analog.
- **1918 influenza:** not researched this pass. COVID has better data.
- **1983 Soviet false alarm (Petrov):** not researched this pass. It would give a minutes-scale nuclear analog.
- **NotPetya 2017:** not researched this pass. WannaCry has clearer dates.

## Unverified items to check before anything goes on screen
- `blackout-2003`: the 15:32 and 15:41 line trips, the end of the cascade at 16:10–16:13, and the times of neighbour calls.
- `covid-2020`: the "2P" spike date, and the People's Vaccine Alliance URL (the figure itself is in RATES.md).
- `wannacry-2017`: the hour of Microsoft's emergency patch (~20 h), and the exact dates of the CareCERT alerts.
- `heatwave-2003`: the day of the ER doctors' alarm, Météo-France forecast timing, and earlier heat-health warning systems abroad. No daily death series was retrieved (endpoints only).
- `gfc-2008`: the dates of Bear Stearns, TARP, the Oct 8 cut, the G20 summit and Dodd-Frank (well established but not seen in a snippet), and the 2005 warning paper.
- `quebec-1989`: the timing of the warnings, the flare hour, the 1972 storm reference, and the median, which is modelled rather than measured.
- `cuban-missile-1962`: the DEFCON dates, the U-2 shoot-down date, the back-channel timing, and the Jupiter fragment.
- `penicillin-resistance-1946`: the month of the 59% figure, the 1940 penicillinase date, and the 2015 WHO plan.
- `rice-2008`: the ~$300 Nov 2007 baseline, the day of India's ban (month confirmed), the timing of the CGD proposal, and AMIS 2011.
