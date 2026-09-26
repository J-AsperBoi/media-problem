# Viral structures for short vertical films

Status: complete (Phase 0 Part B). 11 principles, 18 templates. Researched 2026-09-26.

## 0. How to read this file
- Section 1 lists principles. Each has a **source** and a **confidence** note: **High** (primary data or official platform statement, consistent across sources), **Medium** (primary source but ad-context, self-reported, or indirect), **Low** (creator/agency folklore, secondary summaries, numbers we could not trace to a primary).
- Research method: WebFetch was blocked for most domains (e.g. `ads.tiktok.com` refused by the egress proxy), so claims were gathered from web-search result extracts and cited to the underlying page URL/title. Where only a secondary blog carried a number, it is marked Low and should not appear on screen or be quoted as fact.
- Section 2 lists structural templates. The kebab-case name in each heading is the stable `structure` tag for `output/LEDGER.jsonl`. Do not rename them.
- Every beat map assumes a ~36s film at 30fps (1080x1920) unless it says otherwise, and includes the six mandatory beats from CLAUDE.md section 6: **HOOK** (frame 1 legible), **RACE** (human speed, slowed), **SLOW** ("We slowed it down so you could see it."), **SNAP** (true speed + AI-speed side by side, labeled illustrative), **NECK** ("This is the bottleneck."), **END** (end card, >=3s). Camera cycles follow section 6b: **IN** (close, first person) -> **OUT** (pull back to the whole race) -> **IN+** (return, closer than before).

## 1. Principles

### P1. The first second decides; the first 3 seconds are the gate
- **Claim.** Platforms measure and reward whether the viewer stays past the opening. YouTube exposes a dedicated Shorts metric, "Viewed (vs. swiped away)", the share of feed impressions where the viewer did not swipe. TikTok for Business tells advertisers to introduce the proposition in the first 3 seconds and states that ~90% of ad-recall impact is captured in the first 6 seconds. Meta's Reels ad guidance frames the hook as the first ~2-3 seconds.
- **Sources.** YouTube Help, "Content tab analytics tips - Shorts" (support.google.com/youtube/answer/12942217) and YouTube Community post "New YouTube Shorts metric - Viewed vs Swiped Away" (support.google.com/youtube/community-video/273390203). TikTok for Business, "Creative Codes: 6 principles" (ads.tiktok.com/business/en/creative-codes) and "Creative best practices for performance ads" (ads.tiktok.com/help/article/creative-best-practices). Meta for Business post "Get your Reels ads to perform better with Meta's simple creative tips" (facebook.com/metaforbusiness/posts/...1101098328724538).
- **Confidence.** High that the opening is the main gate (all three platforms say so, and it is the metric they surface). Medium on the 90%/6s figure (TikTok's own ad-recall meta-analysis; ad context, not organic). **Low** on widely repeated numbers like "71% decide in 3 seconds", "keep swipe-away under 25%", "60% viewed-vs-swiped is the floor" (these appear only on agency/tool blogs such as teleprompter.com, shortimize.com, reelrise.app; no primary found). Don't quote them.
- **For us.** Frame 1 must already show red vs. green at readable scale (it is also the thumbnail). No title card, no logo, no slow fade-in from black.

### P2. Retention curves: a cliff at the start, then a slope; the ending must not leak
- **Claim.** Short-video retention typically drops steeply in the first seconds and then declines slowly; platform ranking weighs watch time / completion. TikTok's leaked internal "TikTok Algo 101" document (reported by the New York Times, Dec 2021) describes optimizing for "retention" (does the user return) and "time spent", with a score combining predicted like, comment, and playtime. Instagram head Adam Mosseri (Jan 2025) named watch time, likes per reach and sends per reach as the top Reels signals. MrBeast's leaked production memo (Sept 2024) says the first minute is where most viewers leave, for long-form; the same shape holds scaled down.
- **Sources.** NYT via coverage: TechTimes "TikTok's Secret Algorithm Unveils in Leaked Document 'Algo 101'" (techtimes.com/articles/269024), Pixel Envy linklog (pxlnv.com/linklog/tiktok-leak-nyt). Mosseri statements via dataslayer.ai "Instagram Algorithm 2026: 5 Ranking Signals Mosseri Confirmed" and socialync.io (secondary summaries of his video posts). "How to succeed in MrBeast production" via simonwillison.net/2024/Sep/15 and tubefilter.com/2024/09/17.
- **Confidence.** Medium-High on the shape and on watch time being a primary signal (multiple independent platform statements). Medium on the 2021 TikTok doc (leaked, dated, secondhand). Low on any precise "good retention %" benchmark.
- **For us.** Every beat must earn the next one. The slow dread of the RACE is the leak risk: keep something changing every ~2-3s (a fragment lighting, a line breaking) even while the camera holds.

### P3. Loops and rewatches count
- **Claim.** Since 31 March 2025 YouTube counts a Shorts view on every start or replay (the old thresholded count became "engaged views"). YouTube Studio retention for Shorts can exceed 100% at a timestamp when viewers rewatch or loop. TikTok and Reels auto-loop by default, so a seamless end-to-start join turns completion into a second partial view.
- **Sources.** YouTube Community announcement "A change to how we count views on Shorts" (support.google.com/youtube/thread/333869549); ppc.land "YouTube changes how Shorts views are counted from March 31"; Sprout Social support note "YouTube Shorts View Count Update - March 2025". The >100% retention observation: shortimize.com, virvid.ai (creator/tool blogs).
- **Confidence.** High on the view-count rule (official). Medium on loops boosting distribution (logical given watch-time signals and auto-loop, and widely observed by creators, but no platform states a loop bonus). Low on any quantified replay-rate uplift.
- **For us.** Our END card is a 3s+ hold, which breaks a pure loop. Design the last frame of the end card (or a final 0.3s after it) to match frame 1's composition and color so the auto-replay feels continuous. The `seamless-loop` template pushes this furthest.

### P4. Pattern interrupts reset attention, but only if they carry meaning
- **Claim.** Cuts, sudden motion, new sounds, and scene changes trigger an orienting response that briefly allocates attention to the screen (Lang's Limited Capacity Model of Motivated Mediated Message Processing, LC4MP; decades of TV psychophysiology). Too many in a row overload the viewer and reduce encoding. TikTok's Creative Codes list "attention triggers" (music, transitions, movement, text overlays) as a code.
- **Sources.** Lang, "The Limited Capacity Model of Mediated Message Processing", Journal of Communication 50(1), 2000 (academic.oup.com/joc/article/50/1/46/4110103); Annals of the ICA review "LC4MP: Taking Stock of the Past" (academic.oup.com/anncom/article/42/4/270/7905951). TikTok Creative Codes (above).
- **Confidence.** High that structural features elicit orienting responses (well-replicated lab work). Medium on how that translates to swipe behavior. **Low** on creator rules like "an interrupt every 2-3 seconds" (folk heuristic, no primary).
- **For us.** Our interrupts are the pace changes the brief already asks for: the dead stop before SLOW, the camera pull-out, the single sharp snap sound. Each one must mean something (section 3 "no arbitrary motion"). Silence is an interrupt too.

### P5. Open loops / curiosity gaps pull viewers forward; completion is the payoff
- **Claim.** Curiosity arises from a perceived gap between what one knows and wants to know; it is strongest when the viewer has some information and the gap looks closable (Loewenstein 1994, information-gap theory). The "Zeigarnik effect" (better memory for unfinished tasks), often cited by creators, did **not** hold up in a 2025 meta-analysis of 59 studies; the related **Ovsiankina** effect (a tendency to resume/complete interrupted tasks) did.
- **Sources.** Loewenstein, "The Psychology of Curiosity: A Review and Reinterpretation", Psychological Bulletin 1994 (cmu.edu/dietrich/sds/docs/loewenstein/PsychofCuriosity.pdf). Ghibellini & Meier, "Interruption, recall and resumption: a meta-analysis of the Zeigarnik and Ovsiankina effects", Humanities and Social Sciences Communications 12, 2025 (nature.com/articles/s41599-025-05000-w).
- **Confidence.** High on the information-gap mechanism in lab settings. Medium on its size in feeds. Don't cite Zeigarnik as a memory effect.
- **For us.** Pose the question in the HOOK ("Will the green pieces meet before the red arrives?") and withhold the answer until the SNAP. A small, specific question (one person, one fragment, one street) beats a vast vague one.

### P6. Share motives: high-arousal emotion, especially awe; practical and social value
- **Claim.** In ~7,000 New York Times articles, content evoking high-arousal emotions (awe; anger; anxiety) was more likely to make the most-emailed list, while low-arousal sadness was less shared; positive content beat negative on average, and results held controlling for surprise, interest, and practical usefulness (each also positively linked to sharing). Berger's 2014 review lists five functions of word of mouth: impression management, emotion regulation, information acquisition, social bonding, persuasion. Mosseri calls "sends per reach" (DM shares) the strongest signal for reaching new audiences.
- **Sources.** Berger & Milkman, "What Makes Online Content Viral?", Journal of Marketing Research 49(2), 2012 (journals.sagepub.com/doi/10.1509/jmr.10.0353; author PDF jonahberger.com/wp-content/uploads/2013/02/ViralityB.pdf). Berger, "Word of mouth and interpersonal communication: A review and directions for future research", Journal of Consumer Psychology 24(4), 2014 (faculty.wharton.upenn.edu/wp-content/uploads/2014/12/WOM-Review.pdf). Mosseri via dataslayer.ai / socialync.io (secondary).
- **Confidence.** High on arousal predicting sharing (large observational + experimental; replicated conceptually). Medium on transfer from news articles to short video. Medium-Low on Mosseri's "3-5x" weight for sends (secondary blogs; don't quote).
- **Caution (honesty rules).** Moral-emotional words (Brady et al. 2017, PNAS, ~20% more retweets per word, mostly within like-minded networks; a 2025 PNAS Nexus pre-registered replication and meta-analysis, academic.oup.com/pnasnexus/article/4/11/pgaf327, confirmed the effect as robust with a pooled estimate of roughly +12-15% shares per moral-emotional word) and out-group animosity (Rathje et al. 2021, PNAS, ~67% higher share odds per out-group term) also drive sharing. We deliberately **do not** use these levers: CLAUDE.md forbids targeting groups and covert fear. Our high-arousal target is **awe plus resolve**, with anxiety kept honest and bounded.
- **For us.** The sublime pull-out is the share moment ("look at this"); the SNAP is the "I have to show someone" moment; the end card gives resolve (something to do), which converts anxiety into action rather than despair.

### P7. Story shape: fall-then-rise beats flat; double dips do well
- **Claim.** Sentiment analysis of 1,327 Project Gutenberg stories found six core emotional arcs: rags to riches (rise), tragedy (fall), man in a hole (fall-rise), Icarus (rise-fall), Cinderella (rise-fall-rise), Oedipus (fall-rise-fall). Measured by downloads, Icarus, Oedipus, and two sequential man-in-a-hole arcs were the most popular. Vonnegut's "Shapes of Stories" lecture is the informal origin of the good/ill-fortune graph.
- **Sources.** Reagan, Mitchell, Kiley, Danforth & Dodds, "The emotional arcs of stories are dominated by six basic shapes", EPJ Data Science 5:31, 2016 (link.springer.com/article/10.1140/epjds/s13688-016-0093-1; arXiv 1606.07772). Vonnegut lecture: secondary summaries (e.g. thestory.au "Kurt Vonnegut graphed the world's most popular stories").
- **Confidence.** Medium: robust for long-form novels; there is no direct evidence for 35-second films. Use as a design vocabulary, not a prediction.
- **For us.** Our mandatory arc is naturally **man-in-a-hole** (race lost at human speed -> snap shows it can be won) or **double man-in-a-hole** when the camera's second descent adds a second dip. Avoid pure tragedy (low-arousal sadness is least shared, P6).

### P8. Sound-off legibility, but sound-on design
- **Claim.** Meta's internal tests found captioned video ads increased view time by ~12% on average, and the company advises designing for sound off in feed. Reels and TikTok are majority sound-on; TikTok's Creative Codes make sound one of six codes. The safe answer is: the story must read with sound off, and sound must add a layer when on.
- **Sources.** Meta for Business, "Capture attention with updated features for video ads" (facebook.com/business/news/updated-features-for-video-ads) and "Want to make better video ads for mobile?" (facebook.com/business/news/want-to-better-video-ads-for-mobile-well-show-you-how). TikTok Creative Codes (above).
- **Confidence.** High on "design for both". Medium on the 12% (Meta internal, older feed context). Low on "70-80% of Reels viewers have sound on" (agency blogs only).
- **For us.** Red vs. green must read without audio; the three key lines are on-screen text. The drone and the one sharp snap sound are additive.

### P9. On-screen text: few words, big type, inside the safe zone, on screen long enough
- **Claim.** Platform UI covers the top (~130-140px), bottom (~320px: caption, username, sound) and the right column (~120-165px: like/comment/share). TikTok notes the safe zone varies with caption length and ad format. Meta's guidance recommends short lines (about 5-7 words).
- **Sources.** Safe-zone figures from creator-tool guides (kreatli.com/guides/tiktok-safe-zone, syllaby.io "Aspect ratios & safe zones for Shorts, Reels and TikTok"); Meta line-length via adlibrary.com and benly.ai summaries.
- **Confidence.** Medium on approximate margins (consistent across guides, not pixel-official). Low on exact pixel values.
- **For us.** CLAUDE.md's text box (y 220-1500, x 80-1000) fits the top/bottom margins but the right edge **x=1000 sits under TikTok's action column** (which starts near x~915-960). Keep key words and all numbers inside x 80-900; let only non-essential decoration reach 1000. Keep <=7 words/card, >=1.2s each (reading speed), large serif.

### P10. Native look, one idea at a time, and a promise kept
- **Claim.** TikTok's Creative Codes report that "TikTok-first" content is more attention-grabbing and that ads follow a hook -> body -> close structure. MrBeast's memo stresses that the opening must confirm the promise made by the thumbnail. Kuaishou-scale analysis (248M videos) shows short-form platforms are structurally different from long-form: shorter by multiples and skewed to life-related content.
- **Sources.** TikTok Creative Codes (ads.tiktok.com/business/en/creative-codes; one-pager PDF ads.tiktok.com/business/library/Creative_Codes_One_Pager_CA.pdf). MrBeast memo (above). "Shorter Is Different: Characterizing the Dynamics of Short-Form Video Platforms", arXiv 2410.16058.
- **Confidence.** Medium (ad-oriented and self-reported by the platform; percentages are survey-based).
- **For us.** Frame 1 promises "red vs. green race"; the film must deliver that race immediately, not after context. One idea per shot (matches Jiji's taste, section 10).

### P11. Recommendation is noisy; make many different bets
- **Claim.** A 2026 CHI study using vision-language models to analyze TikTok watch histories could predict whether a user watches >10% of a video with only ~70% accuracy, and found users favor novelty; recommendation sequences matter. Small-account outcomes have high variance.
- **Sources.** "Counting How the Seconds Count: Understanding Algorithm-User Interplay in TikTok via ML-driven Analysis of Video Content", arXiv 2503.20030 / CHI 2026 (doi.org/10.1145/3772318.3790311).
- **Confidence.** Medium.
- **For us.** Supports the brief's portfolio strategy: structural diversity is a hedge. Keep virality estimates harsh and low.

### Weak or folklore claims to avoid quoting
- "71% of viewers decide in the first 3 seconds" (untraced; agency blogs).
- "Keep swipe-away below 25%/35%", "viewed-vs-swiped under 60% means your hook is broken" (tool blogs).
- "Sound-on creative outperforms silent by 35%" (untraced).
- "Pattern interrupt every 2-3 seconds" (folk heuristic).
- Zeigarnik "people remember unfinished things better" (failed meta-analysis, P5).

## 2. Structural templates

Beat keys: HOOK, RACE, SLOW ("We slowed it down so you could see it."), SNAP (true speed + AI-speed side by side, labeled illustrative), NECK ("This is the bottleneck."), END (end card, >=3s). Camera keys: IN (close, first person), OUT (pull back to reveal the whole race), IN+ / IN++ (return, closer each time). Times are in seconds for the stated DUR; scale proportionally for 30-40s, but never shorten END below 3.0s.

Quick index (the `structure` tag is the heading name):

| # | structure | shape (P7) | best pace | cycles |
|---|---|---|---|---|
| 1 | ticking-clock | man in a hole | accelerating | 2 |
| 2 | split-screen-race | man in a hole | sprint | 1 (+ mirrored) |
| 3 | man-in-a-hole | double man in a hole | slow build | 2 |
| 4 | wait-for-it | Icarus -> rise | slow build | 1 |
| 5 | powers-of-ten-zoom | man in a hole | one long take | 1 huge |
| 6 | pov | man in a hole | stop-start | 2 |
| 7 | countdown-list | stepped descent -> rise | stop-start | 3 small |
| 8 | mockumentary | comedy -> dread -> resolve | stop-start | 2 |
| 9 | sports-play-by-play | Cinderella | sprint | 2 |
| 10 | game-hud-run | Oedipus -> rise | sprint | 2 |
| 11 | before-after | tragedy / rags to riches pair | slow build | 1 per half |
| 12 | based-on-a-true-story | man in a hole + reveal | slow build | 2 |
| 13 | reverse-chronology | inverted Icarus | stop-start | 2 |
| 14 | nature-documentary | man in a hole | slow build | 2 |
| 15 | seamless-loop | circle | one long take | 1 |
| 16 | recipe-parody | comedy -> man in a hole | stop-start | 2 |
| 17 | two-phones | man in a hole | stop-start | 2 |
| 18 | ghost-rewind | Oedipus | stop-start | 2 |

---

### 1. `ticking-clock`
**One line.** A visible countdown (the red's real arrival time) sits on screen from frame 1; the green fragments race it and lose, then the snap shows the same clock with time to spare.
**Beat map (DUR 36s).**
| t | beat | what happens |
|---|---|---|
| 0.0-1.0 | HOOK | CLOSE on hands holding a green fragment; a large red clock digit reads the real time-to-arrival (mapped). |
| 1.0-4.0 | RACE | Clock ticks at the stated mapping; a second green light flickers on across the street. |
| 4.0-9.0 | RACE / OUT | CRANE UP: the clock becomes the whole city; red spreading at data speed; green dots scattered, lines forming and breaking. |
| 9.0-15.0 | RACE / IN+ | DOLLY IN to a second person, closer than the first; clock under 10 units; lines fail. Clock hits zero; lights go gray. |
| 15.0-16.5 | beat | Dead stop. Silence. |
| 16.5-19.0 | SLOW | "We slowed it down so you could see it." |
| 19.0-26.0 | SNAP / OUT | WIDE split: left, true proportional speed (the clock is a blur); right, AI-speed aggregation finishing with clock time left (labeled illustrative). One sharp snap sound. |
| 26.0-28.5 | IN++ | Push to the green fragment in the first person's hands, now glowing whole. |
| 28.5-31.0 | NECK | "This is the bottleneck." |
| 31.0-36.0 | END | End card, 5.0s. |
**Camera.** Cycle 1: IN 0-4 -> OUT 4-9 -> IN+ 9-15. Cycle 2: OUT 19-26 -> IN++ 26-28.5.
**Principles.** P1 (the clock is the thumbnail hook), P5 (explicit open question: will they beat the clock), P2 (the clock gives a reason to stay each second), P4 (dead stop at zero).
**Risk.** Clocks are a cliche; the clock must be the real mapped time, not a fake deadline (honesty rule). The two numbers on screen are the clock and one data figure; no more.

### 2. `split-screen-race`
**One line.** The frame is divided from frame 1: red's lane on top, green's assembly lane below, like a drag race; the snap adds a third lane.
**Beat map (DUR 34s).**
| t | beat | what happens |
|---|---|---|
| 0.0-1.0 | HOOK | Horizontal split: top half a red front at the edge of a street; bottom half one person's hand holding a green piece. Both CLOSE. |
| 1.0-7.0 | RACE | Top lane: red advances at data speed. Bottom lane: fragments try to connect (lognormal delays). |
| 7.0-12.0 | OUT | Both halves pull back together (synchronized CRANE UP): top shows red over the region, bottom shows scattered green. |
| 12.0-16.0 | IN+ | Both halves dive to one face each; red reaches the bottom lane's person first; green goes gray. |
| 16.0-18.5 | SLOW | Split line dissolves; "We slowed it down so you could see it." |
| 18.5-25.0 | SNAP | Three lanes: red at true speed / green at human speed / green at AI speed (illustrative). AI lane finishes first. |
| 25.0-27.5 | beat | AI lane's assembled green expands to fill the frame. |
| 27.5-30.0 | NECK | "This is the bottleneck." |
| 30.0-34.0 | END | 4.0s. |
**Camera.** One mirrored cycle: IN 0-7 -> OUT 7-12 -> IN+ 12-16; SNAP is locked-off wide.
**Principles.** P1 (the split is instantly legible as a race), P3 (end frame returns to the split for a loop), P8 (fully readable sound-off), P6 (competitive arousal).
**Risk.** Split screens halve the size of everything; keep each lane to one idea and at least 540px tall. Diversity risk: close to `ticking-clock` if a clock is added; don't add one.

### 3. `man-in-a-hole`
**One line.** Vonnegut's shape told twice: a warm ordinary moment, the fall (red arrives, green fails), a partial climb, a second deeper fall, then the snap as the climb out.
**Beat map (DUR 38s).**
| t | beat | what happens |
|---|---|---|
| 0.0-1.0 | HOOK | CLOSE: a person laughing at a table holding a green fragment; a thin red line already under the door. |
| 1.0-5.0 | RACE (fall 1) | Red seeps in; they call someone; the line connects, then breaks. |
| 5.0-10.0 | OUT | CRANE UP through the roof: thousands of such tables; red spreading; green lights scattered. |
| 10.0-13.0 | RACE (climb) | A few green lines connect; a cluster forms. Hope. |
| 13.0-17.0 | IN+ (fall 2) | DROP DOWN to a second person, closer: the cluster arrives one beat too late; lights go gray. |
| 17.0-18.5 | beat | Silence. Absence only. |
| 18.5-21.0 | SLOW | "We slowed it down so you could see it." |
| 21.0-28.0 | SNAP / OUT | WIDE: true-speed replay beside AI-speed aggregation (illustrative) where the cluster forms before the red. |
| 28.0-30.5 | IN++ | Back to the first person's table, tighter than frame 1; their fragment glowing whole. |
| 30.5-33.0 | NECK | "This is the bottleneck." |
| 33.0-38.0 | END | 5.0s. |
**Camera.** Cycle 1: IN 0-5 -> OUT 5-13 -> IN+ 13-17. Cycle 2: OUT 21-28 -> IN++ 28-30.5.
**Principles.** P7 (double man-in-a-hole is among the most successful arcs in Reagan et al.), P6 (awe at the pull-out, resolve at the end), P4 (silence at 17s).
**Risk.** The slowest opening of the set; the frame-1 red line must be vivid or viewers swipe. Two dips in 38s can feel rushed; keep the climb short.

### 4. `wait-for-it`
**One line.** A deliberately calm, strange shot with an on-screen promise ("watch the green one") that pays off in a single reveal: the fragments were one piece all along, and the snap shows how fast they could have clicked.
**Beat map (DUR 35s).**
| t | beat | what happens |
|---|---|---|
| 0.0-1.0 | HOOK | CLOSE: one green fragment in a palm, red glow at the frame's edge; text "Watch the green." |
| 1.0-8.0 | RACE | Slow. Other green fragments appear one by one elsewhere in the frame edges, each at its real (lognormal) discovery time. Red creeps. |
| 8.0-14.0 | OUT | Slow CRANE UP: the fragments are the scattered pieces of one shape. Red closes around them before they meet. |
| 14.0-15.0 | beat | Hold. |
| 15.0-17.5 | SLOW | "We slowed it down so you could see it." |
| 17.5-24.5 | SNAP | Side by side: true speed (it is over in a flash) and AI-speed (illustrative): the pieces fly together into one shape. The reveal. |
| 24.5-27.0 | IN+ | DOLLY IN to the same palm, closer: the whole shape now sits in it. |
| 27.0-30.0 | NECK | "This is the bottleneck." |
| 30.0-35.0 | END | 5.0s. |
**Camera.** One slow cycle: IN 0-8 -> OUT 8-24.5 -> IN+ 24.5-27.
**Principles.** P5 (explicit promise creates the gap), P3 (the reveal rewards rewatching to spot the pieces), P6 (awe at the assembled shape).
**Risk.** Long build is a retention leak (P2); something must change every ~2s. The payoff has to be visually surprising; if the shape is guessable by 5s, curiosity dies.

### 5. `powers-of-ten-zoom`
**One line.** One continuous zoom through scales, from a single hand to a planet and back, keeping the red's speed and green's arrival times true at every scale.
**Beat map (DUR 36s).**
| t | beat | what happens |
|---|---|---|
| 0.0-1.0 | HOOK | Extreme CLOSE: a fingertip touching a green fragment; red reflected in the eye beside it. |
| 1.0-4.0 | RACE | Hand -> person (1 scale). Scale label in corner: "1 m". |
| 4.0-12.0 | OUT | Continuous zoom out, one power of ten roughly every 1.3s: room, street, city, region, continent. Red spreads at each scale at the same mapped speed; green dots connect slowly. |
| 12.0-15.0 | RACE | Hold at the widest scale: red covers the planet's night side; green still scattered. |
| 15.0-17.5 | SLOW | "We slowed it down so you could see it." |
| 17.5-24.0 | SNAP | Planet scale split: true-speed replay (seconds) beside AI-speed aggregation (illustrative), green lines lighting across continents. |
| 24.0-28.5 | IN+ | Continuous zoom back in, faster, to a *different* person's eye, closer than frame 1. |
| 28.5-31.0 | NECK | "This is the bottleneck." |
| 31.0-36.0 | END | 5.0s. |
**Camera.** One huge cycle: IN 0-4 -> OUT 4-17.5 -> IN+ 24-28.5.
**Principles.** P6 (awe from scale, the strongest share emotion), P4 (each scale change is a structural interrupt), P3 (ending close on an eye loops visually to frame 1).
**Risk.** Technically demanding; the math must hold across scales (section 6b). Very recognizable homage; keep the scale labels honest. Too many scales in too few seconds blurs into noise.

### 6. `pov`
**One line.** The viewer *is* the person holding one green fragment, first-person camera, text "POV: you have the missing piece."
**Beat map (DUR 36s).**
| t | beat | what happens |
|---|---|---|
| 0.0-1.0 | HOOK | First-person hands, green fragment; red visible at the end of the street; text "POV: you have the missing piece." |
| 1.0-6.0 | RACE | POV walk: you try to hand it on; the phone shows a message delivered but unread (gray tile). |
| 6.0-10.0 | RACE | Stop-start: a door closes, a queue, a form. Red nearer each time you look up. |
| 10.0-15.0 | OUT | Camera lifts out of your head (CRANE UP): you are one dot among many green dots, none connected. |
| 15.0-18.0 | IN+ | DROP DOWN back into your eyes, closer; red reaches the corner; your fragment dims. |
| 18.0-20.5 | SLOW | "We slowed it down so you could see it." |
| 20.5-27.0 | SNAP | Split: your walk at true speed / the AI-speed version (illustrative) where the right hand finds yours in time. |
| 27.0-29.0 | IN++ | Another hand's green piece clicks into yours, extreme close. |
| 29.0-31.5 | NECK | "This is the bottleneck." |
| 31.5-36.0 | END | 4.5s. |
**Camera.** Cycle 1: IN 0-10 -> OUT 10-15 -> IN+ 15-18. Cycle 2: SNAP wide 20.5-27 -> IN++ 27-29.
**Principles.** P1 (POV text framing is a native, recognizable hook), P6 (identification raises arousal), P10 (native format).
**Risk.** "POV:" is heavily used; the text must be specific. First-person can feel like an ad; keep hands human and imperfect.

### 7. `countdown-list`
**One line.** "3 reasons the answer arrived too late", each reason a short vignette of the same race (lost message, wrong queue, no one knew), then the snap as reason zero.
**Beat map (DUR 38s).**
| t | beat | what happens |
|---|---|---|
| 0.0-1.0 | HOOK | Big "3" on screen over a CLOSE of a green fragment; red edge. |
| 1.0-7.0 | RACE #3 | "The message" : a green line breaks because attention is elsewhere. CLOSE -> quick OUT -> IN. |
| 7.0-13.0 | RACE #2 | "The queue": fragments wait in lognormal order. CLOSE -> OUT -> IN, closer. |
| 13.0-19.0 | RACE #1 | "Nobody knew the others existed": full CRANE UP, all fragments visible, never connected; red covers them. DROP DOWN, closest yet. |
| 19.0-21.5 | SLOW | "We slowed it down so you could see it." |
| 21.5-28.0 | SNAP | "0": true speed beside AI-speed (illustrative); all three failure points bridged. |
| 28.0-30.5 | IN | Close on fragments joined. |
| 30.5-33.0 | NECK | "This is the bottleneck." |
| 33.0-38.0 | END | 5.0s. |
**Camera.** Three small cycles (1-7, 7-13, 13-19), each return closer.
**Principles.** P5 (the countdown is a built-in open loop: viewers wait for #1), P4 (each number is an interrupt), P6 (practical value: "reasons").
**Risk.** Listicles feel cheap and repetitive (Jiji pushes back on repeating one idea); each item must be a different mechanism. Three numbers on screen plus data could break the "at most two numbers" rule: treat list numerals as labels, and show only one data number.

### 8. `mockumentary`
**One line.** Deadpan talking-head interviews with the people holding each fragment ("I did send the email"), comedy of absurd busyness that turns grave when the camera pulls out.
**Beat map (DUR 38s).**
| t | beat | what happens |
|---|---|---|
| 0.0-1.0 | HOOK | CLOSE interview framing: a person holding a green fragment, lower-third "Holds piece 3 of 7." Red visible through the window behind them. |
| 1.0-9.0 | RACE | Quick cuts between three interviewees, each confident their piece reached someone. Every cut, the red in the window is nearer. |
| 9.0-11.0 | beat | Interviewer's off-camera question as text: "Did anyone have all seven?" Silence. |
| 11.0-16.0 | OUT | Camera leaves the interview set (CRANE UP): the three offices are next door to each other; red flooding the block. |
| 16.0-19.0 | IN+ | DROP DOWN to the first interviewee, tighter, no longer joking; lights going out behind. |
| 19.0-21.5 | SLOW | "We slowed it down so you could see it." |
| 21.5-28.0 | SNAP | Split: true speed / AI-speed (illustrative), connective lines linking the three offices. |
| 28.0-30.5 | IN++ | The three pieces on one desk, extreme close. |
| 30.5-33.0 | NECK | "This is the bottleneck." |
| 33.0-38.0 | END | 5.0s. |
**Camera.** Cycle 1: IN 0-11 -> OUT 11-16 -> IN+ 16-19. Cycle 2: SNAP 21.5-28 -> IN++ 28-30.5.
**Principles.** P6 (humor then dread = two arousal peaks), P4 (tonal pivot at 9s is the big interrupt), P10 (native format), CLAUDE.md "comedy only as early contrast".
**Risk.** Satire must hit systems, not people (honesty rule); interviewees are competent and sincere. Comedy may not survive sound-off; the lower-thirds carry the joke.

### 9. `sports-play-by-play`
**One line.** Text-only (sound-off-safe) commentator captions call the race like a match: "Green has the ball... and it's stuck at midfield."
**Beat map (DUR 36s).**
| t | beat | what happens |
|---|---|---|
| 0.0-1.0 | HOOK | CLOSE on a player-like figure holding a green piece; caption "AND WE'RE LIVE." Red team on the edge. |
| 1.0-6.0 | RACE | Handheld chase framing; captions call each pass; a pass goes to an empty spot (attention elsewhere). |
| 6.0-11.0 | OUT | Stadium-camera CRANE UP: the whole field; red sweeping; green players scattered, not passing. Scoreboard (one real number: elapsed mapped time). |
| 11.0-15.0 | IN+ | Sideline DOLLY IN to the ball carrier, closer: tackled by the clock; stadium lights go gray. Caption: "...and that's the game." |
| 15.0-17.5 | SLOW | "We slowed it down so you could see it." (styled as instant replay) |
| 17.5-24.0 | SNAP | "REPLAY": true-speed replay beside AI-speed (illustrative) where passes connect; caption drops to silence. |
| 24.0-26.5 | IN++ | Close on hands receiving the final piece. |
| 26.5-29.0 | NECK | "This is the bottleneck." |
| 29.0-33.0 | beat | Crowd shot drains to gray except green. |
| 33.0-36.0 | END | 3.0s (extend to 4-5s if DUR allows). |
**Camera.** Cycle 1: IN 0-6 -> OUT 6-11 -> IN+ 11-15. Cycle 2: SNAP wide -> IN++ 24-26.5.
**Principles.** P6 (sports arousal, competition), P8 (captions carry it), P4 (the "REPLAY" graphic is a native interrupt), P7 (Cinderella: pass connects, falls, rises).
**Risk.** Sports framing can trivialize loss; the commentary must stop cold when the lights go gray. Don't let the teams read as real-world groups (keep red faceless, a front not a team of people).

### 10. `game-hud-run`
**One line.** A video-game run with a HUD: ping, a party-finder with green members, a quest timer, a "LAG" warning; the run fails at human ping, then is replayed at AI-assisted ping.
**Beat map (DUR 36s).**
| t | beat | what happens |
|---|---|---|
| 0.0-1.0 | HOOK | First-person HUD: "PARTY 1/6", green item in hand, red zone closing on the minimap. |
| 1.0-6.0 | RACE | Party invites sent; ping indicator spikes (mapped to real coordination delays); invites time out. |
| 6.0-11.0 | OUT | Camera zooms out of the HUD to the map (spectator cam): all six players on the same server, never matched; red zone shrinking at data speed. |
| 11.0-15.0 | IN+ | Back into the HUD, tighter; "CONNECTION LOST"; screen desaturates. |
| 15.0-17.5 | SLOW | "We slowed it down so you could see it." |
| 17.5-24.0 | SNAP | Split HUDs: "HUMAN PING" (true speed) / "AI-ASSIST (ILLUSTRATIVE)"; party fills 6/6 before the zone. |
| 24.0-26.5 | IN++ | Six hands, six pieces clicking; "PATCH APPLIED". |
| 26.5-29.5 | NECK | "This is the bottleneck." |
| 29.5-30.5 | beat | HUD fades; silence. |
| 30.5-36.0 | END | 5.5s. |
**Camera.** Cycle 1: IN 0-6 -> OUT 6-11 -> IN+ 11-15. Cycle 2: SNAP -> IN++ 24-26.5.
**Principles.** P1 (HUD reads as game instantly; CLAUDE.md "track red vs. green like a game"), P10 (native gaming register matches copy deck), P7 (Oedipus fall-rise-fall then rise).
**Risk.** HUD clutter violates "one idea at a time" and the two-number limit: only one HUD number live at a time. Don't show AI "playing for" people; AI is matchmaking, people play.

### 11. `before-after`
**One line.** Two halves of one film: the same 12 seconds shown "before" (human routing) and "after" (AI-assisted routing), with the snap as the hinge.
**Beat map (DUR 36s).**
| t | beat | what happens |
|---|---|---|
| 0.0-1.0 | HOOK | CLOSE on a person holding green; label "BEFORE" in the corner; red at the frame edge. |
| 1.0-5.0 | RACE (before) | Fragments try to find each other; lines break. |
| 5.0-9.0 | OUT | CRANE UP: whole race; red wins. |
| 9.0-12.0 | IN+ | DROP DOWN, closer; lights out. |
| 12.0-14.5 | SLOW | "We slowed it down so you could see it." |
| 14.5-18.0 | SNAP (true) | The before at true speed: over in ~1s; beat of black. |
| 18.0-27.0 | SNAP (after) | Label "AFTER (ILLUSTRATIVE)": exact same shots and camera (IN -> OUT -> IN+), same red speed, green aggregation at AI speed; lines hold; green wins. |
| 27.0-29.5 | NECK | "This is the bottleneck." |
| 29.5-33.0 | END | 3.5s. |
| 33.0-36.0 | END (cont.) | Hold end card; final 0.3s dissolves to frame 1's composition for the loop. |
**Camera.** Cycle 1 (before): IN 0-5 -> OUT 5-9 -> IN+ 9-12. Cycle 2 (after) mirrors it shot for shot at 18-27, ending closer.
**Principles.** P5 (the viewer wants to see the "after"), P3 (the matched halves invite rewatch comparison), P8 (labels do the work).
**Risk.** Repeating the same shots risks "repeating one idea"; the after must look visibly different (lines holding, glow). Must not imply AI would certainly have saved the real event: "illustrative" stays on screen.

### 12. `based-on-a-true-story`
**One line.** Plays as an abstract fable; a late text card reveals the timings were taken from a real historical event (never naming the threat), turning the fable into data.
**Beat map (DUR 38s).**
| t | beat | what happens |
|---|---|---|
| 0.0-1.0 | HOOK | CLOSE: a hand, a green piece, a red horizon, storybook framing. |
| 1.0-6.0 | RACE | The fable: fragments held by a baker, a clerk, a sailor; messages travel slowly. |
| 6.0-11.0 | OUT | CRANE UP over the village map; red spreading at the dataset's speed. |
| 11.0-15.0 | IN+ | DROP DOWN to the clerk, closer; too late; lights go out. |
| 15.0-17.5 | SLOW | "We slowed it down so you could see it." |
| 17.5-20.5 | reveal | Text: "Every timing you just saw is real." then "Year: 18xx/19xx/20xx." (analog year only; no threat name). |
| 20.5-27.0 | SNAP | True speed beside AI-speed (illustrative). |
| 27.0-29.5 | IN++ | Close on the clerk's hand now holding the joined piece. |
| 29.5-32.5 | NECK | "This is the bottleneck." |
| 32.5-38.0 | END | 5.5s. |
**Camera.** Cycle 1: IN 0-6 -> OUT 6-11 -> IN+ 11-15. Cycle 2: SNAP wide -> IN++ 27-29.5.
**Principles.** P5 (the reveal closes a gap viewers did not know they had), P6 (surprise is independently linked to sharing in Berger & Milkman), P7.
**Risk.** The reveal claim must be literally true: every on-screen timing traceable to the analog file. The year counts as one of the two numbers.

### 13. `reverse-chronology`
**One line.** Opens on the aftermath (a gray, lights-out city) and rewinds step by step to the moment the pieces almost met, then the snap plays it forward at both speeds.
**Beat map (DUR 36s).**
| t | beat | what happens |
|---|---|---|
| 0.0-1.0 | HOOK | CLOSE on a gray hand still holding a faintly glowing green fragment; text "Rewind." |
| 1.0-6.0 | RACE (rewind) | Stop-start rewind jumps (with a timecode tick): red recedes, lights return. |
| 6.0-11.0 | OUT | Rewind in a CRANE UP: we see the whole map un-spreading, green fragments un-disconnecting. |
| 11.0-14.0 | IN+ | Rewind stops at the near-miss: two hands one street apart. DOLLY IN, closer. Freeze. |
| 14.0-16.5 | SLOW | "We slowed it down so you could see it." |
| 16.5-23.5 | SNAP | Now forward: true speed / AI-speed (illustrative) side by side; in the AI lane the two hands meet. |
| 23.5-26.0 | IN++ | Extreme close: the pieces touching. |
| 26.0-29.0 | NECK | "This is the bottleneck." |
| 29.0-36.0 | END | 7.0s (or trim DUR). |
**Camera.** Cycle 1: IN 0-6 -> OUT 6-11 -> IN+ 11-14. Cycle 2: SNAP -> IN++ 23.5-26.
**Principles.** P5 ("how did we get here?" is a strong gap), P4 (rewind is an interrupt), P3 (final close matches the opening hand, forming a loop).
**Risk.** Opening on aftermath risks low-arousal sadness (P6); keep the one glowing fragment in frame 1 as hope. Rewind must still use real speeds (reversed, same mapping).

### 14. `nature-documentary`
**One line.** Hushed nature-doc captions observe humans as a species: "Here, a rare specimen holds one piece of the answer. She does not know the others exist."
**Beat map (DUR 38s).**
| t | beat | what happens |
|---|---|---|
| 0.0-1.0 | HOOK | Telephoto CLOSE, shallow focus: a person with a green fragment; red on the horizon like weather; caption begins. |
| 1.0-7.0 | RACE | Slow observation; a second "specimen" with a fragment across a river; they signal, the signal fails. |
| 7.0-13.0 | OUT | Aerial CRANE UP, migration-style shot: the whole "herd", green dots scattered, red moving like a front. |
| 13.0-17.0 | IN+ | DROP DOWN, closer than the opening: the first specimen as the red reaches her; color drains. Narrator caption goes silent. |
| 17.0-19.5 | SLOW | "We slowed it down so you could see it." |
| 19.5-26.5 | SNAP | Split: true speed / AI-speed (illustrative) "migration" where the herd converges. |
| 26.5-29.0 | IN++ | Macro close on two hands exchanging pieces. |
| 29.0-32.0 | NECK | "This is the bottleneck." |
| 32.0-38.0 | END | 6.0s. |
**Camera.** Cycle 1: IN 0-7 -> OUT 7-13 -> IN+ 13-17. Cycle 2: SNAP -> IN++ 26.5-29.
**Principles.** P6 (awe from landscape and scale), P10 (a familiar, trusted format), P7.
**Risk.** Condescension: "observing humans" must feel tender, not mocking (respect the audience). Captions add words: keep each card <=7 words.

### 15. `seamless-loop`
**One line.** Built as a circle: the last frame of the end-card tail matches frame 1 so auto-replay continues the race; each lap the viewer notices more.
**Beat map (DUR 34s).**
| t | beat | what happens |
|---|---|---|
| 0.0-1.0 | HOOK | CLOSE on an eye reflecting red and green; one green fragment in the hand below. |
| 1.0-6.0 | RACE | One long take: pull back slowly from the eye. |
| 6.0-12.0 | OUT | The long take becomes a crane: the whole race; green fails. |
| 12.0-15.0 | IN+ | Continuous descent into a different person's eye, closer. |
| 15.0-17.5 | SLOW | "We slowed it down so you could see it." |
| 17.5-23.5 | SNAP | Within the eye's reflection: true speed / AI speed (illustrative). |
| 23.5-26.0 | NECK | "This is the bottleneck." |
| 26.0-30.0 | END | 4.0s end card. |
| 30.0-34.0 | tail | End card dissolves into the eye from frame 1; red and green reflections at exactly frame-1 positions at t=34. |
**Camera.** One cycle in a single long take: IN 0-6 -> OUT 6-12 -> IN+ 12-17.5, and the loop tail returns to IN.
**Principles.** P3 (loops add views and >100% retention), P2 (no hard ending to swipe on), P1.
**Risk.** The mandatory 3s end card is a hard stop; if the dissolve reads as "over", the loop fails. A loop that is too clever confuses first-time viewers.

### 16. `recipe-parody`
**One line.** A top-down recipe video: "How to make one working answer: you'll need 5 pieces, already in your kitchen", but the ingredients are in five different kitchens.
**Beat map (DUR 36s).**
| t | beat | what happens |
|---|---|---|
| 0.0-1.0 | HOOK | Top-down CLOSE of hands and a bowl; one green ingredient; red simmering at the edge of the counter. Text "You'll need 5 pieces." |
| 1.0-7.0 | RACE | Quick recipe cuts: step 1 done; step 2 needs a piece from next door; the "delivery" line breaks. |
| 7.0-12.0 | OUT | Camera rises through the ceiling: five kitchens across a city, each with one piece; red spreading like a boiling-over. |
| 12.0-16.0 | IN+ | DROP DOWN to the bowl, closer: red boils over; burners go gray. |
| 16.0-18.5 | SLOW | "We slowed it down so you could see it." |
| 18.5-25.0 | SNAP | Split: true speed / AI-speed (illustrative), pieces routed to one bowl in time. |
| 25.0-27.5 | IN++ | Extreme close: the finished dish glowing green. |
| 27.5-30.0 | NECK | "This is the bottleneck." |
| 30.0-36.0 | END | 6.0s. |
**Camera.** Cycle 1: IN 0-7 -> OUT 7-12 -> IN+ 12-16. Cycle 2: SNAP -> IN++ 25-27.5.
**Principles.** P10 (familiar, native format lowers swipe risk), P6 (humor then resolve), P5 (a recipe promises a finished dish).
**Risk.** Tone: comedy must end early (CLAUDE.md). Overlaps the `cooking` family tag; pair with a non-cooking metaphor or accept the tag.

### 17. `two-phones`
**One line.** Two phone screens side by side in close-up: two people who each hold half the answer, typing, deleting, not sending; the red is in both notification bars.
**Beat map (DUR 36s).**
| t | beat | what happens |
|---|---|---|
| 0.0-1.0 | HOOK | Two phones, CLOSE; each shows a green half; a red notification slides in on both. |
| 1.0-7.0 | RACE | Typing indicators appear and vanish (lognormal delays); messages sit unsent; one gets buried by gray blurred tiles (engagement bait). |
| 7.0-12.0 | OUT | Pull back past the phones: the two people are on the same bus; beyond, the city with red spreading and thousands of paired green halves. |
| 12.0-15.0 | IN+ | Back to the screens, closer: one taps send just as the lights go gray. |
| 15.0-17.5 | SLOW | "We slowed it down so you could see it." |
| 17.5-24.0 | SNAP | True speed / AI-speed (illustrative): a connective suggestion links the halves; the humans still press send. |
| 24.0-26.5 | IN++ | Two thumbs, two halves forming one. |
| 26.5-29.0 | NECK | "This is the bottleneck." |
| 29.0-36.0 | END | 7.0s (or trim DUR). |
**Camera.** Cycle 1: IN 0-7 -> OUT 7-12 -> IN+ 12-15. Cycle 2: SNAP -> IN++ 24-26.5.
**Principles.** P6 (social bonding motive; everyone recognizes the unsent message), P10 (screens are native to the feed), P9 (text lives naturally on the phones; keep it inside the safe zone).
**Risk.** Screen-in-screen text can be too small on a phone; enlarge UI. Must not caricature phone users (satirize routing, not people).

### 18. `ghost-rewind`
**One line.** A ghostly "what could have been" green layer plays on top of reality from frame 1, a translucent version of the fragments meeting in time, which the real ones keep failing to match.
**Beat map (DUR 36s).**
| t | beat | what happens |
|---|---|---|
| 0.0-1.0 | HOOK | CLOSE: a person with a green fragment; a translucent ghost of their hand already joined to another. Red at the edge. |
| 1.0-6.0 | RACE | Real fragments lag behind their ghosts (lognormal); the gap between ghost and real is visible. |
| 6.0-11.0 | OUT | CRANE UP: ghost network complete across the city; real network fragmented; red spreading. |
| 11.0-15.0 | IN+ | DROP DOWN, closer: the ghost fades as the lights go out. |
| 15.0-17.5 | SLOW | "We slowed it down so you could see it." |
| 17.5-24.0 | SNAP | Reveal: the ghost was the AI-speed timeline (illustrative); side by side with true speed. |
| 24.0-26.5 | IN++ | The ghost hand and the real hand align. |
| 26.5-29.5 | NECK | "This is the bottleneck." |
| 29.5-36.0 | END | 6.5s. |
**Camera.** Cycle 1: IN 0-6 -> OUT 6-11 -> IN+ 11-15. Cycle 2: SNAP -> IN++ 24-26.5.
**Principles.** P5 (the ghost is an unexplained layer that begs a question), P3 (rewatch to understand the ghost), P7 (Oedipus shape).
**Risk.** Two overlapping layers break "one idea at a time" and the red/green-only saturation rule; the ghost must be a desaturated, dim green. Viewers may not understand the ghost until the snap: that is the point, but it must not look like a rendering error.

## 3. What this means for our films
1. **Frame 1 is the whole pitch.** Red and green, a human hand or face, and a clear "who gets there first?" question, all visible at thumbnail size. No fades from black, no title cards (P1, P5, P10).
2. **Our mandatory arc is already a strong shape.** Race lost -> slow reveal -> snap -> resolve is man-in-a-hole; a second camera descent makes it a double man-in-a-hole, the pattern Reagan et al. found most downloaded (P7). Don't end on the loss: low-arousal sadness is the least shared emotion (P6).
3. **Aim for awe and resolve, not outrage.** The pull-out (sublime scale) and the snap (surprise) are our share moments. We skip the out-group and moral-outrage levers on purpose (honesty rules), and accept a lower ceiling for it (P6).
4. **The slow middle is where we leak viewers.** Keep a meaningful change every ~2-3s during RACE (a light, a broken line, a camera move). Pace changes, silence, and the snap sound are our pattern interrupts; none may be arbitrary (P2, P4).
5. **Sound-off first, sound-on bonus.** All three lines as large text; no meaning carried only by audio (P8).
6. **Text safe zone tighter than the brief.** Keep numbers and key words inside x 80-900 (not 1000) to clear TikTok's right-hand action column; y 220-1500 is fine (P9).
7. **Close the loop.** The end card's last frames should echo frame 1 so auto-replay continues; YouTube now counts replays as views (P3).
8. **Label the counterfactual on screen, every time.** "Illustrative" next to the AI lane; the `based-on-a-true-story` and `before-after` templates depend on it being literally true.
9. **Structural variety is the hedge.** Recommendation is noisy (P11); 18 templates exist so the portfolio does not bet on one shape. Estimates stay harsh: a small account with a grave, non-trending, non-outrage film should mostly sit in the single digits to low teens.
10. **Best bets by principle coverage:** `powers-of-ten-zoom` (awe + scale + loopable), `split-screen-race` (instantly legible race), `game-hud-run` (native register of our copy deck), `wait-for-it` and `ghost-rewind` (strongest open loops), `seamless-loop` (rewatch).

## 4. Sources
Primary / academic (preferred):
- Berger, J. & Milkman, K. L. (2012). What Makes Online Content Viral? Journal of Marketing Research 49(2). https://journals.sagepub.com/doi/10.1509/jmr.10.0353 (author PDF: http://jonahberger.com/wp-content/uploads/2013/02/ViralityB.pdf)
- Berger, J. (2014). Word of mouth and interpersonal communication: A review and directions for future research. Journal of Consumer Psychology 24(4). https://faculty.wharton.upenn.edu/wp-content/uploads/2014/12/WOM-Review.pdf
- Reagan, A. J., Mitchell, L., Kiley, D., Danforth, C. M. & Dodds, P. S. (2016). The emotional arcs of stories are dominated by six basic shapes. EPJ Data Science 5:31. https://link.springer.com/article/10.1140/epjds/s13688-016-0093-1 (arXiv 1606.07772)
- Loewenstein, G. (1994). The Psychology of Curiosity: A Review and Reinterpretation. Psychological Bulletin 116(1). https://www.cmu.edu/dietrich/sds/docs/loewenstein/PsychofCuriosity.pdf
- Ghibellini, R. & Meier, B. (2025). Interruption, recall and resumption: a meta-analysis of the Zeigarnik and Ovsiankina effects. Humanities and Social Sciences Communications 12. https://www.nature.com/articles/s41599-025-05000-w
- Lang, A. (2000). The Limited Capacity Model of Mediated Message Processing. Journal of Communication 50(1). https://academic.oup.com/joc/article/50/1/46/4110103 ; review: https://academic.oup.com/anncom/article/42/4/270/7905951
- Brady, W. J. et al. (2017). Emotion shapes the diffusion of moralized content in social networks. PNAS. https://www.pnas.org/doi/10.1073/pnas.1618923114 ; replication: Brady, Rathje, Globig & Van Bavel (2025), PNAS Nexus 4(11) pgaf327. https://academic.oup.com/pnasnexus/article/4/11/pgaf327/8285703
- Rathje, S., Van Bavel, J. J. & van der Linden, S. (2021). Out-group animosity drives engagement on social media. PNAS. https://www.pnas.org/doi/10.1073/pnas.2024292118
- "Counting How the Seconds Count: Understanding Algorithm-User Interplay in TikTok via ML-driven Analysis of Video Content" (CHI 2026). https://arxiv.org/abs/2503.20030
- "Shorter Is Different: Characterizing the Dynamics of Short-Form Video Platforms" (2024). https://arxiv.org/abs/2410.16058

Platform (official, some ad-oriented):
- YouTube Help, Content tab analytics tips - Shorts. https://support.google.com/youtube/answer/12942217
- YouTube Community, New YouTube Shorts metric - Viewed vs Swiped Away. https://support.google.com/youtube/community-video/273390203
- YouTube Community, A change to how we count views on Shorts (March 2025). https://support.google.com/youtube/thread/333869549
- TikTok for Business, Creative Codes. https://ads.tiktok.com/business/en/creative-codes ; one-pager https://ads.tiktok.com/business/library/Creative_Codes_One_Pager_CA.pdf
- TikTok Ads Help, Creative best practices for performance ads. https://ads.tiktok.com/help/article/creative-best-practices (fetch blocked; content via search extracts)
- Meta for Business, Capture attention with updated features for video ads. https://www.facebook.com/business/news/updated-features-for-video-ads
- Meta for Business, Want to make better video ads for mobile? https://www.facebook.com/business/news/want-to-better-video-ads-for-mobile-well-show-you-how

Leaked / reported (Medium confidence):
- "TikTok Algo 101" (NYT, Dec 2021), via https://www.techtimes.com/articles/269024/20211206/tiktok-algo-101-leaked-document-tiktok-secret-algorithm-tiktok.htm and https://pxlnv.com/linklog/tiktok-leak-nyt/
- "How to succeed in MrBeast production" (Sept 2024), via https://simonwillison.net/2024/Sep/15/how-to-succeed-in-mrbeast-production/ and https://www.tubefilter.com/2024/09/17/mrbeast-internal-production-guide-leaked-key-points/

Secondary / weak (Low confidence; used only for context or flagged):
- Mosseri ranking-signal summaries: https://www.dataslayer.ai/blog/instagram-algorithm-2025-complete-guide-for-marketers , https://www.socialync.io/blog/adam-mosseri-shares-instagram-algorithm-2026
- Retention benchmarks and loop claims: https://www.shortimize.com/blog/youtube-shorts-retention-rate , https://virvid.ai/blog/looping-structure-shorts-retention-2026 , https://reelrise.app/guide/viewed-vs-swiped-away-the-only-youtube-shorts-metric-that-matters/
- Safe zones: https://kreatli.com/guides/tiktok-safe-zone , https://syllaby.io/blog/aspect-ratios-safe-zones-shorts-reels-tiktok/
- Hook statistics: https://www.teleprompter.com/blog/tiktok-3-second-rule (source of the untraced "71%" figure)
- Vonnegut lecture summary: https://thestory.au/articles/kurt-vonnegut-story-shapes/
- YouTube view-count change coverage: https://ppc.land/youtube-changes-how-shorts-views-are-counted-from-march-31/
