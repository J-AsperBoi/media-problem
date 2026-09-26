# The Bottleneck Is Us: studio brief

You work in an overnight animation studio making short vertical films for Jiji. Read all of this before building anything. It is the source of truth.

## 0. What success means tonight

In the morning Jiji reviews a **portfolio** and picks directions for later steps (iteration, then a 3D tool). Success is:
1. **The most diverse range of structures, styles, and metaphors** (measured by `tools/diversity.js`),
2. **with the highest estimated likelihood of going viral** (each film gets a virality percentage, section 8),
3. **every one of them mathematically sound** (real speeds from real historical data, section 3),
4. **and as many finished options as possible.** Many good, different rough cuts beat a few polished ones.

## 1. The one idea every film shares

> A threat spreads through the population. The pieces of the solution already exist, scattered through the same population. The threat moves faster than the pieces can find each other, assemble, and deploy.

This is the core mechanic of **every** film. Structures, styles, and metaphors change; this doesn't.

- **Red is the threat** (`#ff3b30`): distributed, spreading at its real speed.
- **Green is the solution** (`#34d27b`): distributed as fragments held by different people, places, and institutions. Fragments light up, reach toward each other, and try to assemble into one working whole.
- **Everything else is desaturated.** Only red and green are ever saturated, so the race reads instantly, even as a thumbnail.
- **Never name the threat,** not during the film and not at the end. It is simply red. What's universal is the race, not the specific danger.
- **The emotional core is fragility:** humans forgot that we can all die at any point, and that the answer is usually already here, in pieces.

### The AI-vs-human speed contrast (the snap)
Every film shows the same green fragments aggregating at two speeds: human coordination speed (from the historical data) and AI-assisted coordination speed (computed from real AI rates in RATES.md, labeled illustrative). AI appears as a fast connective force that helps people find each other and assemble what they already have. People still decide and deploy.

### Honesty rules
- Argue in the open, with clarity and truth. No covert fear tactics; never exaggerate how likely a threat is.
- The AI-speed version is a counterfactual. Label it illustrative, show its basis in notes.md, and never claim AI would certainly have prevented a real event.
- Don't claim AI is harmless, don't argue against human oversight of AI, and don't show AI taking control.
- Individuals aren't stupid; the routing is broken. Satirize systems, not groups of people.
- Loss is shown only as absence: lights going out, color draining. Never bodies, gore, or suffering. No explicit content (engagement bait is blurred gray tiles). No real named politicians or celebrities, no partisan cues, no AI company or model names on screen ("frontier AI").

## 2. Research drives everything (Phase 0, before any film is built)

All research lives in `research/`. It has two parts.

### 2a. Ten threats and their historical analogs
1. Identify the **10 threats people discuss most online** (pandemics, climate extremes, nuclear escalation, financial contagion, grid failure, antibiotic resistance, food shocks, misinformation cascades, cyberattacks on infrastructure, asteroid or solar events, and so on; decide from actual evidence of online discussion, and note it).
2. For each, find the **closest historical analog with a verifiable dataset of speeds**. Seeds to check (verify, don't assume): the 2003 Northeast blackout cascade; the 1989 Quebec geomagnetic blackout; the 2008 financial crisis; COVID-19; the 1918 influenza; the Cuban Missile Crisis and the 1983 Soviet false alarm; the 2003 European heat wave; the spread of false vs. true news on social media (published studies exist); the 2017 WannaCry or NotPetya malware spread; the rise of antibiotic resistance after penicillin; the 1815 Tambora eruption and the "year without a summer."
3. For each analog, write `research/analogs/<id>.json` following `research/analogs/SCHEMA.md`: a dated timeline of how fast the threat spread, where the solution fragments already existed, how long they took to aggregate and deploy (with the real variance), and the AI-speed counterfactual with its basis. Every number needs a source; mark anything unverified and don't use it on screen.
4. Summarize all ten in `research/THREATS.md`: threat, analog, key speeds, the gap between threat speed and aggregation speed, and why it's a good film.

### 2b. How viral short-form videos are structured
Research what actually drives retention and sharing in short vertical video (published analyses, platform guidance, creator research), then write `research/VIRAL_STRUCTURES.md` with:
- the principles that hold up (hook timing, retention curves, loops, pattern interrupts, open loops, share motives), each with its source;
- **at least 12 structural templates**, each a named story shape with a beat map in seconds. Seeds: ticking clock; split-screen race; "man in a hole" (Vonnegut's story shapes); "wait for it" reveal; one continuous zoom across scales (Powers of Ten); POV; countdown list; mockumentary; sports-commentary play-by-play; video-game HUD run; before/after; "based on a true story" reveal.

Every film declares one template from this file. The template is the most important diversity dimension.

## 3. Mathematical soundness

- **Speeds come from the analog files.** The red spread and the green aggregation are driven by the data in `research/analogs/<id>.json`, mapped to screen time with one honest, stated mapping (proportional time, or a labeled log or compression scale such as "1 second = 1 week").
- **Show real variance.** Human aggregation isn't only slow, it's unpredictable. Use `L.lognormalCDF` or the dataset's own spread so some fragments connect early and some absurdly late.
- **Show real growth.** Spread curves use the data or a fitted curve (`L.logistic` with a real doubling time), not an arbitrary animation.
- **The snap is computed.** The AI-speed aggregation uses rates from RATES.md; show the math in notes.md.
- **No arbitrary motion.** Every movement, size, and speed means something. Relationships between characters and metaphors can be a vibe; speeds cannot.

### Shared visual grammar
| Visual property | Means |
|---|---|
| red `#ff3b30` | the threat, and only the threat |
| green `#34d27b` | solution fragments and the assembled solution, and only that |
| gray | everything and everyone else |
| size | resources (money, power) |
| brightness / glow | attention |
| lines between people | real communication; they break when attention is elsewhere |
| speed | real speed from the data |

## 4. Tone: the sublime
Awe mixed with dread at something vast. Grave, heavy, serious; the "oh no, this is real" moment in a great film, then the sense that it can be answered.
- Restraint over noise: slow camera, long holds, negative space, silence before impacts.
- Scale does the work: tiny figures against enormous structures; vast time in one frame.
- Pace changes are the craft: slow dread, a sudden sprint, a dead stop, the snap.
- Comedy only as early contrast (absurd busyness), never the ending.
- Sound: low drones (`acts` with `drone: true`), heartbeat-like pulses, near silence, one sharp snap.
- Type: large serif, slow fades, few words.
- Respect the audience: they are the smart people stuck in the machine.

## 5. Theme atlas (where the green fragments and the red can live)
| Scale | Dysfunction | Image seeds |
|---|---|---|
| Mind | competing drives in one skull | a committee of tiny selves voting at once |
| Body | signals that don't reach the part that can act | the hand on the stove while the head scrolls |
| Family | love plus crossed wires | nine people, forty messages, no plan |
| Organization | meetings about meetings, money in random directions | commutes, blah-blah volleys, nodes ballooning for no reason |
| Nation | institutions frozen at the speed of their era | a 1787 machine running 2026 traffic |
| Between nations | games nobody can quit | two players both losing |
| Economy | capital parked, incentives pointed sideways | gold piling up while green fragments starve |
| History | past decisions still steering | ghosts holding the wheel |
| The gap | people exploiting the space between old rules and now | creatures living in the cracks of an old map |

Keep it nonpartisan: the target is institutional lag and exploited gaps, never a party, country, or named leader.

## 6. The film's shape
Length 25–45s, vertical 1080×1920, 30fps. Whatever template it uses, every film contains:
1. **A hook in the first second**, usually first person and close in, that makes red vs. green legible (frame 1 is the thumbnail). See section 6b for the camera rhythm.
2. **The race at human speed**, slowed enough to follow, with the green fragments failing to assemble in time.
3. **"We slowed it down so you could see it."**
4. **The snap:** the same timeline at true proportional speed, then the AI-speed aggregation beside it, labeled illustrative.
5. **"This is the bottleneck."**
6. **The call to action:** `L.endCard(ctx, alpha)` (QR code encoding `config.json` ctaUrl plus `?src=<slug>`), held at least 3 seconds.

## 6b. Camera: inside, then above, then back inside

The camera language is non-negotiable. A film that stays at map level has failed, however good its data.

- **Default is first person, close in.** Start inside the phenomenon: at eye level with one person holding one green fragment, with the red at the edge of the frame or coming down the street. Tight framing, their face, their hands, their small world. The viewer should feel like they're standing there.
- **Zoom out for perspective.** At a key moment, pull back (crane up, dolly out, or a continuous zoom through scales) to reveal the whole race: the red spreading across the population, the green fragments scattered and failing to connect. This is the look-up moment, the sublime one.
- **Zoom back in for immersion.** Then return to a person, closer than before. The feeling of immersion should increase each time the camera comes back down.
- **Rhythm:** at least one out-and-back-in cycle per film; two or three cycles for longer pieces. Each return goes closer and hits harder.
- **Keep the math true across zooms.** The red's speed and the green's arrival times stay consistent at every scale; only the framing changes.
- **Use the toolkit:** `L.camera(ctx, keys, t)` with keyframes (see the example animatic), easing on every move, holds before and after big pulls. Slate each shot (`L.slate`) with its framing: CLOSE, POV, WIDE, CRANE UP, DOLLY IN.
- **In notes.md,** list the zoom cycles with timestamps, and in the 3D translation note say how each move should feel in true 3D (lens, height, speed).

## 7. Copy deck
Networking and software words that live in gaming culture: lag, ping, patch, bottleneck, legacy code, shipped.
- Campaign line: **The bottleneck is us.**
- Openers: "One body. Eight billion heads." / "Civilization has lag." / "The answer is already here. In pieces."
- Reveal: "We slowed it down so you could see it." Then the snap. Then "This is the bottleneck."
- Call to action: "Scan. Help close the gap."
- Invent variants in this register and log them in notes.md.
- Never: "Moloch," "sheeple," "wake up," "mass manipulation," absolute claims, profanity on screen, the name of the threat.

## 8. Virality craft and the virality estimate
- Hook in the first second; make the viewer track red vs. green like a game.
- Sound-off legible. Text between y=220 and 1500, x=80 and 1000. At most ~7 words per card, each on screen at least 1.2s.
- At most two numbers on screen, each sourced.
- Seamless loop where possible.
- Apply the principles in `research/VIRAL_STRUCTURES.md`.

**Virality estimate (every film):** your estimated chance it passes 100,000 views if posted natively to TikTok, Reels, and Shorts from a small account. Be calibrated and harsh; most short videos never get there, so most estimates belong in the single digits or low teens, and anything above 30% needs a strong argument. One sentence of reasoning. This is a judgment call, not a measurement.

## 9. Diversity is the grade
Tag every film on these dimensions and log it to `output/LEDGER.jsonl`:
- **structure:** the template name from `research/VIRAL_STRUCTURES.md`
- **medium:** stick-figure animatic, bean cartoon, paper cutout, blueprint, ink wash, 8-bit, isometric, constructivist poster, neon arcade, children's-book flat, particle/data, woodblock, subway map, shadow puppet, stained glass, chalkboard, x-ray, topographic map, embroidery, text-only typography
- **family (metaphor world):** body/biology, machine, game, music, ecology, city, cosmos, market, language, myth/ritual, weather/fluids, sport, cooking, dance, traffic, library, theater
- **scale:** mind, body, family, organization, nation, between nations, economy, history, multi-scale zoom
- **pace:** slow build, sprint, stop-start, accelerating, one long take
- **camera:** POV walk, over-the-shoulder, continuous zoom through scales, crane up and drop down, handheld chase, locked-off close-up with a single pull-out
- **emotion:** dread, awe, vertigo, loneliness, grief, resolve, tenderness, anger
- **protagonist:** one person, a crowd, a green fragment, the red itself, an institution, AI
- **analog:** the research analog id driving the speeds

Check each concept with `node tools/diversity.js '<json tags>'` before building; if it's TOO SIMILAR, change dimensions.

## 10. Jiji's taste (use it to rank the morning picks)
She responds most to: nested structures organizing chaos; networks visibly connecting and breaking; characters with emotion; zooming between micro and macro; the irony of perfect synchronization on pointless things; real data with a legend; people on the same level who can't hear each other; cinematic pacing that directs attention one idea at a time; grave seriousness that stays non-horrific; neuroscience, incentive design, and decentralized coordination.
She pushes back on: arbitrary encodings; everything on screen at once; gore or anything disturbing; preachiness; repeating one idea.

## 11. Pipeline
- Scene: `scenes/<slug>.js`, `module.exports = makeScene` where `makeScene(SERIF, HAND)` returns `{ draw(ctx, t), DUR, acts, cues }`.
- Toolkit: `const L = require('../tools/lib.js')(SERIF, HAND);` gives camera keyframes, shots, stick figures, sketch lines, titles, labels, slates, grain, easing, seeded RNG, noise, `L.logistic`, `L.lognormalCDF`, `L.loadAnalog(id)`, `L.mapTime`, the end card, and QR codes.
- `draw` must be a pure function of t: randomness built at setup with `L.rng(seed)`, never Math.random at draw time, no state between frames.
- Fonts: SERIF (Instrument Serif), HAND (Patrick Hand). No emoji. Cue types: ding, bonk, whoosh, pop, stamp, hit.
- Preview: `node tools/render.js scenes/<slug>.js --preview`, then open `output/<slug>/contact_sheet.png` and actually look at it.
- Render: `node tools/render.js scenes/<slug>.js`. Gallery: `node tools/gallery.js`. Diversity: `node tools/diversity.js`.
- Example scenes in `scenes/` show the drawing style and toolkit use; their stories predate this brief, so follow this brief, not their plots.

## 12. Per-film loop
1. Write `output/<slug>/notes.md`: `Tier: animatic`, title, logline, structure template, analog id, the time mapping and speed math (threat spread, human aggregation, AI-speed counterfactual), the shot list with camera moves, a short **3D translation note** (key shots, camera, characters and props, what gets richer in 3D), and tags.
2. Diversity check, then build.
3. Preview once, critique, fix what's broken; preview again only if something was broken. Aim for about 20–40 minutes per animatic.
4. Render; confirm with ffprobe that duration matches DUR.
5. Score 1–10: Hook, Speed accuracy, Snap impact, Emotion, Originality, Craft, Honesty, then `Overall: <average>`, then `Virality: <N>%` with one sentence of reasoning.
6. Append a JSON line to `output/LEDGER.jsonl`: `{"slug":..., "structure":..., "medium":..., "family":..., "scale":..., "pace":..., "emotion":..., "protagonist":..., "camera":..., "analog":..., "overall":..., "virality":<number>}`.

## 13. Boundaries
Work only inside this folder. No global installs, no paid APIs. Use the web for research (section 2) and fact checks only. If a render breaks, debug with previews rather than rewriting from scratch.
