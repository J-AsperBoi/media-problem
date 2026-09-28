# The grammar of film: the smallest adjustable features

Status: Phase 1, step 2 (see `ROADMAP.md`). Researched 2026-09-28. Feeds Phase 2 (snippet lab) and Phase 3 (review page).

## 0. How to read this file

**The idea in one paragraph.** A film is built from a small set of dials: how close the camera is, how it moves, how fast time runs, where the cuts fall, where things sit in the frame, what is coloured, what you hear, what words appear, and how the character acts. Each dial does something fairly predictable to a viewer. If we make one short clip (3–5 s) per dial, all with the same character, Jiji can watch them side by side, say "more of this", and we assemble films from the dials she likes.

**Confidence labels** (same scale as `VIRAL_STRUCTURES.md`):
- **High**: lab or large-corpus evidence, replicated.
- **Medium**: one good study, or evidence from a nearby setting (lab clips, photos, ads) that probably transfers.
- **Craft**: working filmmakers agree on it and have for decades, but nobody has measured it properly. Useful, not proven.
- **Low / weak**: a blog, a single unreplicated claim, or a number nobody can trace. Don't quote it on screen.

**Method note.** Page-fetching was blocked for most sites, so claims come from web-search extracts and are cited to the page title and URL. Books (Bordwell & Thompson, Murch, Thomas & Johnston, McCloud) were reached through summaries, which is marked where it matters.

**Our codes.** Story beats (from `VIRAL_STRUCTURES.md`): **HOOK**, **RACE** (human speed), **SLOW** ("We slowed it down…"), **SNAP** (true speed + AI-speed), **NECK** ("This is the bottleneck."), **END**. Camera beats (CLAUDE.md §6b): **IN** (close), **OUT** (pull back, the sublime look-up), **IN+** (return, closer). Pipeline terms: `L.camera(ctx, [[t,[x,y,zoom,rot]],…], t)`, easings `L.ease.inOut | out | in | back`, 30 fps, 1080×1920. Zoom 1.0 = the character's full body fills about 60% of frame height (see §3.1).

---

## 1. The five findings that matter most for us

1. **Viewers look where the film tells them to, and all look at the same spot.** In edited films, for more than half the time, everyone's gaze sits inside about 12% of the screen. Motion, contrast and flicker drive this, and it is much weaker in unedited footage. (Mital, Smith, Hill & Henderson 2011, via Loschky et al., "What Would Jaws Do?", PLOS One, journals.plos.org/plosone/article?id=10.1371/journal.pone.0142474; Goldstein, Woods & Peli 2007.) **High.** For us: one moving thing at a time. This is also Jiji's taste ("one idea at a time").
2. **A single odd colour is found instantly, however busy the frame.** A target that differs by one basic feature such as colour "pops out" in parallel, with no search needed. (Treisman & Gelade 1980, feature integration theory, en.wikipedia.org/wiki/Feature_integration_theory; CUNY "Sensation and Perception" 5.4.) The odd one out is also remembered better (von Restorff isolation effect, en.wikipedia.org/wiki/Von_Restorff_effect). **High.** For us: this is the scientific reason the red/green-only rule works, even in a thumbnail.
3. **Closer shots make people read minds and feel more.** Close-ups raise viewers' tendency to attribute thoughts and feelings to a character, raise emotional intensity, and this holds for animated characters too. (Bálint et al., "Watching More Closely: Shot Scale Affects Film Viewers' Theory of Mind Tendency But Not Ability", pmc.ncbi.nlm.nih.gov/articles/PMC5776141; "Shot scale and viewers' responses to characters in animated films", research.vu.nl; Canini, Benini & Leonardi 2011, "Affective analysis on patterns of shot types in movies", ISPA.) **Medium-High.** For us: the IN beats should be close enough to see the eyes.
4. **Context changes what a face means (the Kuleshov effect), but only a little.** The same slightly-neutral face is rated as happier or more fearful depending on the shot next to it, and brain responses differ. (Mobbs et al. 2006, "The Kuleshov Effect: the influence of contextual framing on emotional attributions", academic.oup.com/scan/article/1/2/95/2362814; "Reexamining the Kuleshov effect", PLOS One 2024, journals.plos.org/plosone/article?id=10.1371/journal.pone.0308295.) An early replication (Prince & Hensley 1992) found no effect; a later one found a real but emotion-dependent effect (Barratt et al. 2016, "Does the Kuleshov Effect Really Exist?", researchgate.net/publication/300082821). **Medium.** For us: Ari can keep a near-neutral face while the red approaches; the viewer supplies the fear. Cheap and restrained, which is our tone.
5. **Cuts are invisible when they ride on motion and sound; they jolt when they don't.** Cuts during a sudden action ("match on action") were missed about 32% of the time, versus about 9% for cuts with no continuity; motion *after* the cut and the audio carried most of the effect. (Smith & Henderson 2008, "Edit Blindness", Journal of Eye Movement Research, bop.unibe.ch/JEMR/article/download/2264/3460; Smith & Martin-Portugues Santacreu 2016, "Match-Action: The Role of Motion and Audio…", Media Psychology, tandfonline.com/doi/abs/10.1080/15213269.2016.1160789; Smith 2012, "The Attentional Theory of Cinematic Continuity", Projections 6(1), eprints.bbk.ac.uk/6679.) **High.** For us: choose deliberately. Smooth cuts for the RACE (stay immersed); a hard, silent-then-loud cut for the SNAP (feel the jolt).

---

## 2. The taxonomy of adjustable features

Each row: **what it does to a viewer** (source, confidence) · **how we animate it** (one-line spec) · **beats it serves**. Sources are shortened here; full titles/URLs are in §6.

### 2.1 Shot size and framing
| Feature | What it does to a viewer | How we animate it | Beats |
|---|---|---|---|
| Extreme close-up (ECU: eyes, hands) | Maximum intimacy and emotional intensity; forces attention onto one detail [S11 Medium-High]. Enlarged eye whites alone trigger the brain's threat detector, even unseen [S25 High]. | zoom 4.0–6.0 on eyes or hands; hold ≥1.2 s; tiny drift (zoom +3% over the hold, ease inOut) so it isn't dead | HOOK, IN+ |
| Close-up (CU: head and shoulders) | More mind-reading, empathy, felt emotion [S11]. | zoom 2.5–3.0, head centred on upper third line | HOOK, RACE, NECK |
| Medium (waist up) | Neutral; shows gesture plus face; best for "what are they doing" | zoom 1.6–1.8 | RACE |
| Wide / full figure | Shows the body and the place; lower intensity [S11] | zoom 1.0 | RACE |
| Extreme wide (tiny figure, whole world) | Vastness, the core trigger of awe [S22 High for awe = vastness + need to re-think]; isolation [S37 Craft] | zoom 0.15–0.3; Ari ≤ 3% of frame height | OUT |
| Eye-level vs high vs low angle | Eye level reads as neutral and more trustworthy; low angle makes an already-powerful figure look stronger; high angle makes a figure look smaller [S26 Medium; effect is modest and depends on status] | 2D fake: shift horizon line ±300 px and scale figure's head:body ratio ±10%; rot 0 | Eye level for Ari always (we stand with them); high angle only in OUT |
| POV (see what they see) | Puts the viewer in the character's place; strongest after a look (eyeline) shot [S3 High on POV editing working] | cut from Ari's look to the looked-at thing, framed from Ari's head height | HOOK, RACE |

### 2.2 Camera movement
| Feature | What it does to a viewer | How we animate it | Beats |
|---|---|---|---|
| Slow push-in | Growing focus and tension; an expanding image reads as approach, and approach is an innate arousal signal [S12 Medium: looming research is mostly on fast expansion] | zoom ×1.25–1.4 over 3–5 s, ease inOut; target = eyes | RACE → before SNAP |
| Fast push-in (crash zoom) | Alarm, "look at this now"; looming at its purest [S12] | zoom ×2–3 in 0.25–0.4 s, ease out; + 'hit' cue | HOOK, SNAP |
| Pull-out / crane up (reveal) | The look-up moment: vastness produces awe, context re-frames what we saw close up [S22 High; S13-style craft] | zoom 3.0 → 0.2 over 3–4 s, ease inOut; hold 0.5 s before and ≥1 s after; y drifts up 200 px (crane feel) | OUT |
| Drop back in (return) | Re-immersion; each return closer = rising intensity (brief §6b) [Craft, consistent with S11] | zoom 0.2 → 4.5 over 1.2–2 s, ease in (accelerating fall), land with 0.1 s ease back overshoot | IN+ |
| Dolly zoom (vertigo) | Spatial wrongness, dizziness, sudden realisation, because the eye gets contradictory depth signals [S13 Craft; mechanism plausible, not lab-tested] | Ari's scale fixed; background layer scales 1.0 → 1.6 (or reverse) over 1.5–2.5 s, ease inOut; needs a separate background layer | Realisation before SLOW / NECK |
| Whip pan | Urgency, sudden redirect of attention, hides a cut [S36 Craft] | x shifts 1500 px in 0.2 s, ease inOut, + horizontal motion-blur (draw 6 offset copies at 15% alpha) + 'whoosh' | RACE (look to the red) |
| Handheld | Presence, "you are there", unease. EEG shows moving cameras engage viewers' motor areas more than static ones (strongest for steadicam) [S15 Medium]; another study: movement raises involvement, not necessarily emotion [S15] | add `L.noise(t*1.5)` offsets: ±8 px x/y, ±0.4° rot, per-seed; scale by 0–1 "shake" dial | RACE close shots |
| Orbit (camera circles subject) | Makes a moment feel important and suspended; shows a character from all sides [Craft, no measurement found] | 2D fake: rotate background layer ±12° and slide it ±200 px opposite to a slight figure turn (head profile swap at midpoint); 3 s | Decision moment, NECK |
| Locked-off (no movement) | Stillness makes any movement inside the frame dominate attention [S6 High: motion drives gaze]; reads as observation, dread when held | camera constant; only one element moves | RACE dread holds, SLOW |

### 2.3 Speed and time
| Feature | What it does to a viewer | How we animate it | Beats |
|---|---|---|---|
| Slow motion | Makes actions look more deliberate and intended (≈4× more unanimous "intentional" verdicts in a mock jury study) [S14 High]; lowers felt arousal, raises significance and empathy [S14 Medium] | local time `lt = t*0.25` for the moving element; ambient particles keep real speed to show it is slowed | Reach between hands, SLOW |
| Freeze frame | "Sit with this": stops time, forces attention on one image; ambiguity invites reflection [Craft; 400 Blows ending is the classic, via premiumbeat / Wikipedia "Freeze-frame shot"] | hold one frame 1.0–2.0 s; optional 3% push-in during the freeze; audio cut to silence | Dead stop before SLOW |
| Time-lapse | Compresses long time into one frame; shows scale of time (sublime "vast time in one frame", brief §4) [Craft] | background shadows/crowd at 40–200× speed while Ari moves at 1× or holds still | RACE (waiting), OUT |
| Speed ramp | A felt gear-change: slow → sudden fast (or reverse) marks a turning point; an obvious pattern interrupt [S29 High that such features trigger orienting; ramp specifics Craft] | playback rate keyed 1× → 20× over 0.6 s (ease in), or 20× → 0.25× (ease out) | SNAP |

### 2.4 Editing
Bordwell & Thompson: every cut sets four relations between shots: graphic (shape, light, movement), rhythmic (length), spatial and temporal [S1 High as a framework]. Murch ranks what a cut must serve: emotion first (his "51%"), then story, rhythm, eye-trace, 2D screen plane, 3D space [S2 Craft; the percentages are his estimates].

| Feature | What it does to a viewer | How we animate it | Beats |
|---|---|---|---|
| Straight cut on action | Invisible; keeps immersion [S4, S5 High] | cut on the first frame of a sudden motion; motion continues after the cut; sound bridges it | RACE |
| Match cut (graphic) | Links two things by shape: "this is that". Continuity of shape/position keeps the eye in place across the cut [S1, S3 High on eye-trace; meaning-link Craft] | outgoing object's centre and radius = incoming object's centre and radius (±5 px) on the cut frame | IN→OUT bridge (green in hand → green dot on map) |
| Jump cut | Visible skip in time: impatience, time passing, unease [Wikipedia "Jump cut"; Craft] | same framing, Ari's pose/position changes, 3–4 cuts at 0.5–0.8 s | RACE (waiting) |
| Smash cut | Shock: quiet → loud with no transition [Craft]; startle is strongest after silence [S19 Medium] | hard cut on a frame boundary; audio from near-silence to a 'hit' on the same frame | SNAP |
| Crossfade / dissolve | Soft link, memory, time passing; lowers energy [Craft] | alpha crossfade 0.5–1.0 s, ease inOut | epilogue only (sparingly) |
| Rhythm / shot length | Viewers segment film into events at changes of place, time, character or goal [S30 High]; film shot lengths have shrunk from ~12 s (1950s) to ~4 s (2010) [S9 High]; Hollywood rhythms approach a "1/f" pattern that matches attention fluctuations [S7 High on the pattern; Medium on it causing engagement]; cut density rises into climaxes [S8 Medium] | accelerating: 1.2, 0.9, 0.7, 0.5, 0.35 s; decelerating reverses it; a dread hold = one shot ≥4 s | RACE build → SNAP |

### 2.5 Composition
| Feature | What it does to a viewer | How we animate it | Beats |
|---|---|---|---|
| Rule of thirds | **Weak evidence.** Measured thirds-compliance does not predict how much people like an image; experts care more than novices [S27 Medium on the null result]. Use it as a tidy default, not a lever. | subject at x=360 or 720, y=640 or 1280 | any |
| Centred, symmetric | Formal, confronting, "this is the one" [Craft] | subject at x=540 | HOOK, NECK |
| Negative space | Isolation, vulnerability, "the silence becomes visible" [S37 Craft; blog-level sources only] | Ari ≤ 10% of frame area, placed low (y≈1500); ≥70% of frame empty gray | RACE, OUT |
| Scale contrast | Vastness → awe [S22 High]; tiny figure against huge structure is the brief's core image (§4) | structure ≥ 20× Ari's height; keep both in frame | OUT |
| Eyelines / gaze direction | People automatically look where a face looks, even when told it is useless [S23 High]; the cut to what they see then feels natural [S3] | Ari's pupils shift then head turns 25° toward frame edge; next shot = what they see | HOOK, RACE |
| Split frame | Direct comparison; eye jumps between halves (only works if each half has one clear mover) [Craft; S6 caution] | two panels 1080×940, 40 px gutter; same scale both sides | SNAP |

### 2.6 Light and colour
| Feature | What it does to a viewer | How we animate it | Beats |
|---|---|---|---|
| Saturation isolation (our red/green rule) | Pop-out: found instantly, remembered better [S16, S17 High]; saturation raises arousal more than brightness does [S18 High: arousal ≈ −0.31·brightness + 0.60·saturation] | everything in grays (≤10% saturation); red `#ff3b30`, green `#34d27b` only | all |
| Red at the frame edge | Peripheral colour + motion captures attention and leaves a question open (what is that?) [S16 High; curiosity gap per VIRAL P5] | red shape enters within 40 px of an edge, ≤5% of frame, creeps 20 px/s | HOOK |
| Glow = attention | Brighter things are looked at first [S6 High, contrast drives gaze] | green fragment radius-glow 1.0 → 1.6 and alpha 0.6 → 1.0 when Ari looks at it | RACE |
| Darkness / lights out | Loss shown as absence (brief §1); darker scenes read as more arousing and heavier (black most arousing achromatic colour) [S18 Medium] | lights switch off one by one on a lognormal schedule (`L.lognormalCDF`), 0.1 s fade each | RACE end, before SLOW |
| Colour drain | Grief without gore; the world "gives up" colour [Craft] | saturation of green 1.0 → 0 over 1.5 s, ease in | before SLOW |

### 2.7 Sound
| Feature | What it does to a viewer | How we animate it | Beats |
|---|---|---|---|
| Silence before impact | Clears the ear for the hit and puts viewers in anxious anticipation, so the following sound startles more [S19 Medium, film-theory + physiology]; silence itself is a pattern interrupt (VIRAL P4) | cut all audio 0.8–1.5 s before the hit; visual freeze or near-freeze | SNAP |
| Low drone | Unease, weight, the "drone of dread". Evidence is thin: one public concert with a near-inaudible 17 Hz tone reported ~22% more odd feelings [S21 **Low**: not peer-reviewed]. Treat as Craft. | `acts` with `drone: true`; fade in 1 s; never louder than −18 dB | RACE, OUT |
| Heartbeat pulse | Heart rates in an audience synchronise with narrative, more with audio than visuals [S20 Medium]; bodily rhythms entrain to audio rhythms [S20]; a heartbeat makes one body the viewer's body [Craft] | 60 bpm → 110 bpm, two-thump 'bonk' pairs; sync a 2% scale pulse on Ari | HOOK, RACE |
| Single sharp hit | Orienting response and startle; one clean hit marks the turning point [S29 High, S19 Medium] | one 'hit' or 'stamp' cue on the exact SNAP frame; nothing else in the same 0.5 s | SNAP |

### 2.8 Text
| Feature | What it does to a viewer | How we animate it | Beats |
|---|---|---|---|
| Timing (how long on screen) | Viewers need enough fixation time; subtitle norms: ~17 characters/second comfortable, ≥ 5/6 s minimum; eye tracking shows viewers can keep up with up to 20 cps [S28 Medium-High]. Our rule (≥1.2 s, ≤7 words) is safely inside this. | on-screen time = max(1.2 s, chars/15 + 0.4 s); fade in 0.3 s, fade out 0.4 s | all cards |
| Size | Big type reads on a phone and in a thumbnail [VIRAL P9 Medium] | one-word card: SERIF 180–220 px; line cards: 96–120 px | HOOK, SLOW, NECK |
| Placement | Must dodge platform UI; keep key words x 80–900, y 220–1500 (VIRAL P9) | centre at y≈700 for cards; never cover Ari's eyes | all |
| Word-by-word reveal | Controls reading order; each word is a small orienting event [S29] | 0.35 s per word, fade 0.15 s each | SLOW, NECK |

### 2.9 Character acting
| Feature | What it does to a viewer | How we animate it | Beats |
|---|---|---|---|
| Facial expression | Faces carry which emotion; **eye whites** are the fastest fear signal [S25 High]. At high intensity, faces alone are ambiguous (joy vs agony) [S24 High]. | rig dials: brow angle, eye-white area, pupil size, mouth curve; blend over 0.2–0.4 s (ease out) | HOOK, IN+ |
| Posture | The body tells positive vs negative emotion better than the face at peaks [S24 High] | spine curve, shoulder height, head drop; slump over 0.8 s, rise over 0.5 s | RACE, NECK |
| Gesture (hands) | Hands show intent and choice; the brief requires a visible human hand choosing what AI does | cupped hands (holding), open hand (offering), finger press (choosing); anticipation pull-back 0.15 s before each [S35 Craft] | RACE, SNAP |
| Gaze | Viewers follow it automatically [S23 High]; look at camera = direct address, strongest attention capture ("Attention capture by direct gaze", PMC4072644) | pupils lead, head follows after 0.12 s | HOOK, NECK |
| Anticipation / follow-through | Readable, alive motion: a small wind-up before a big move, overshoot after [S35 Craft, Thomas & Johnston] | every major pose change: 10–15% counter-move first, ease back on landing | all |

### 2.10 Story beats
| Feature | What it does to a viewer | How we animate it | Beats |
|---|---|---|---|
| Hook | The first second decides whether they stay (VIRAL P1 High) | frame 1 = ECU of Ari + red at edge + green in hand; no fade from black | HOOK |
| Suspense (the viewer knows, the character doesn't) | Hitchcock: tell the audience about the bomb and 15 seconds of shock become 15 minutes of suspense [S31 Craft, very widely accepted] | show the red to the viewer before Ari notices it; Ari busy with something small | HOOK, RACE |
| Reveal | Surprise updates what you thought you saw; memorable when it re-frames earlier shots [Low-Medium, general narrative research; VIRAL P5 on curiosity] | pull-out that shows what was outside the frame; hold ≥1 s after | OUT, SNAP |
| Reversal | Same situation, opposite meaning (e.g. same AI speed, other hand) [Craft] | mirror the composition; swap only the colour and the hand's choice | SNAP, AI-misuse films |
| Dead stop | A full stop resets attention before the key line [S29, S30] | freeze + silence 1–1.5 s | before SLOW |

---

## 3. The central character: **Ari**

### 3.1 Design (precise enough to draw in code and to model in 3D later)
**Name:** Ari (gender-neutral across many languages). **Role:** the one person we stand next to in every film; they hold a green fragment.

**Why this design.** Simple faces invite identification: the less detail, the more viewers project themselves into the face (McCloud's "amplification through simplification" [S32 Craft]). Slightly larger head and eyes add warmth and care without making Ari a child (baby-schema features raise caretaking motivation [S33 High]; we use a mild dose). For 3D later, a stylised shape needs a matching stylised surface; mixing cartoon shapes with realistic skin looks eerie, and cartoon faces rate as more appealing [S34 Medium-High]. Big eye whites are kept because they are our strongest cheap fear signal [S25].

**Proportions.** 4 heads tall (head = 25% of height). At zoom 1.0 in 1080×1920: total height 1150 px, head 290 px wide × 300 px tall.

**Head.** A soft rounded rectangle, slightly wider at the cheeks (like an egg on its side, corner radius 45%). No ears drawn in front view. No nose (a 12 px shadow tick in 3/4 view only).

**Eyes (the main instrument).** Two white ovals 56×64 px, centres 110 px apart, on the head's midline. Dark pupils 22 px, can shrink to 14 px (fear) or grow to 28 px (tenderness). Upper lid line can cover 0–45% of the eye (tired → alert). Eye-white area is a named dial.

**Brows.** Two thick rounded strokes, 60 px long, 12 px thick. Angle dial −25° (worry, inner ends up) to +20° (resolve, inner ends down). Height dial ±18 px.

**Mouth.** One stroke, 50 px wide, curve dial −1 (down) to +1 (up); can open into an oval (awe, alarm).

**Hair.** One soft, short rounded cap (like a knit beanie or a smooth crop) in dark gray `#3a3d44`, covering the top 30% of the head, with **one small tuft** sticking up on the left. The tuft is Ari's silhouette signature (readable at 3% of frame height) and gives secondary motion (it lags 0.1 s behind head moves).

**Body.** A rounded trapezoid torso in a **mid-gray hooded jacket** `#6b6f78`, hood down (the hood's collar gives a readable neckline in any angle). Plain darker-gray trousers `#4a4d55`. Simple rounded shoes. No logos, no gendered clothing cues.

**Hands.** Mitten hands with a separate thumb (four fingers optional at ECU). Hands are 60% of head width: large on purpose, because hands hold the green fragment and make choices.

**Skin.** A single desaturated warm gray `#bdb6ab` (≤10% saturation), so Ari never competes with red or green and doesn't signal any specific ethnicity. Outline `#e8e4da` 5 px (matches `L.stick` line colour) on the dark background `#161a21`.

**The green fragment.** Held in cupped hands at chest height: a small irregular shard, 70 px, `#34d27b`, soft glow. Its glow lights the underside of Ari's face (a 25%-alpha green wash on the chin), the only colour ever on Ari.

**Expression presets** (dial values: brow angle / eye-white / pupil / lid / mouth):
| Preset | Brows | Eye whites | Pupil | Lid | Mouth |
|---|---|---|---|---|---|
| calm (default) | 0° | 1.0 | 22 | 15% | +0.2 |
| notice | +5°, raised 10 px | 1.15 | 20 | 5% | 0 |
| worry | −20° | 1.2 | 18 | 5% | −0.4 |
| fear | −25°, raised 18 px | 1.5 | 14 | 0% | open oval |
| awe | −8°, raised 18 px | 1.3 | 24 | 0% | small oval |
| grief | −22°, lowered 6 px | 0.9 | 22 | 40% | −0.8 |
| resolve | +15°, lowered 8 px | 1.0 | 22 | 20% | flat |
| tenderness | −10° | 1.0 | 28 | 25% | +0.5 |

**Build note.** A new `L.ari(ctx, x, y, s, {preset, dials, pose, look, t, seed})` next to `L.stick` in `tools/lib.js`; same pure-function rules (no Math.random at draw time). At wide shots (Ari < 60 px tall) fall back to silhouette + tuft + green dot.

**3D later.** Sphere-ish head, capsule body, matte (clay/felt-like) materials so shape and surface stay equally stylised [S34]; eyes as separate white geometry with pupils as decals; same dials become blend shapes. Lens guide: ECU 85 mm, CU 50 mm, wide 24 mm, crane shots on 35 mm.

---

## 4. First snippet list (32 snippets)

Every snippet: 3–5 s, 30 fps, 1080×1920, Ari only (other people are gray silhouettes), dark background, red/green rule, no text unless the feature *is* text. One feature per clip; everything else stays at the neutral default (locked-off camera, calm preset, 1× speed, room-tone only). Slug = `scenes/snippets/<slug>.js`.

**Order.** 1–10 cover the features our films depend on most: the hook, the camera out-and-in cycle, the dead stop and the snap. 11–32 fill out the taxonomy.

| # | slug | feature | viewer should feel | parameters |
|---|---|---|---|---|
| 1 | `hook-eyes-ecu` | extreme close-up | "who is this, what's wrong?" instantly | 3.0 s; zoom 5.0 on eyes from frame 1; drift +3% (inOut); preset notice; green glow on chin |
| 2 | `red-at-the-edge` | saturation isolation / edge colour | eye jumps to the red at once; unease | 4.0 s; wide on Ari (zoom 1.0) all gray; red enters right edge at 0.5 s, creeps 20 px/s, ≤5% of frame; Ari doesn't notice |
| 3 | `slow-push-in` | slow push-in | tension slowly tightening | 4.0 s; zoom 1.6 → 2.2 (inOut) to eyes; preset calm → worry at 3.0 s |
| 4 | `crane-up-reveal` | pull-out / crane up (OUT) | vertigo then awe: "it's everywhere" | 5.0 s; hold ECU 0.5 s; zoom 3.0 → 0.2 over 3.0 s (inOut), y −200 px; hold wide 1.5 s: hundreds of gray dots, red spreading, 6 green dots scattered |
| 5 | `drop-back-in-closer` | return push-in (IN+) | pulled back into one person, harder than before | 4.0 s; wide hold 0.5 s; zoom 0.2 → 4.5 in 1.5 s (ease in), land with back overshoot 0.1 s; preset fear on landing; hold 2 s |
| 6 | `dead-stop` | freeze frame + silence | the floor drops out; "wait" | 4.0 s; 1.5 s of motion with drone; frame freezes at 1.5 s; audio cut to zero; 3% push-in during freeze; hold to end |
| 7 | `snap-speed-ramp` | speed ramp | a gear change; "oh, it's that fast" | 4.0 s; red spread at 1× for 1.5 s; rate ramps 1× → 20× over 0.6 s (ease in); 1.9 s at 20× |
| 8 | `silence-then-hit` | silence before a single hit | startle, then clarity | 3.0 s; near-silence 1.2 s; one 'hit' at 1.2 s synced to a hard cut from Ari's face to the green pieces snapping together |
| 9 | `one-word-card` | text timing and size | one idea lands and stays | 3.0 s; the word "Lag." SERIF 200 px, centre y 700, fade in 0.3 s, hold 2.0 s, fade 0.4 s; Ari small, below, out of focus (40% alpha) |
| 10 | `gaze-leads-eye` | gaze cue / eyeline + POV | your eyes go where Ari looks; you see what they see | 4.0 s; CU; pupils shift right at 0.8 s, head turns 25° at 0.92 s; cut at 2.0 s to POV of red at street end; hold |
| 11 | `match-cut-green` | graphic match cut | "that fragment is one of many" | 3.5 s; ECU of green shard in hands (centre 540,1100, r 70); cut at 1.5 s to map where one green dot sits at same centre/radius; others appear 0.3 s later |
| 12 | `smash-cut-quiet-loud` | smash cut | jolt | 3.0 s; 1.8 s quiet, Ari calm, time-lapse clouds; hard cut to red flood filling frame + 'stamp' |
| 13 | `jump-cut-waiting` | jump cuts | impatience; time slipping | 4.0 s; locked medium shot; 5 cuts at 0.8 s; each: Ari in a new waiting pose, shadow angle jumps, green glow a little dimmer |
| 14 | `rhythm-accelerate` | shot-length rhythm | pulse quickening | 4.5 s; 6 shots of Ari/red/green with lengths 1.2, 0.9, 0.7, 0.5, 0.35, 0.35 s; heartbeat speeds with them |
| 15 | `crossfade-memory` | dissolve | softness, memory | 4.0 s; Ari CU crossfades (1.0 s, inOut) into a wide of two people exchanging a green piece |
| 16 | `dolly-zoom-realise` | dolly zoom | the world warps; sudden realisation | 3.5 s; Ari CU fixed size; background street scales 1.0 → 1.6 over 2.0 s (inOut); preset notice → fear |
| 17 | `whip-to-red` | whip pan | urgency, redirected attention | 3.0 s; CU Ari 1.2 s; whip x +1500 px in 0.2 s with 6-copy blur + 'whoosh'; land on red; hold |
| 18 | `handheld-close` | handheld | presence, nervous "I'm here" | 4.0 s; medium CU, Ari walking; shake ±8 px, ±0.4°, noise freq 1.5 |
| 19 | `orbit-decision` | orbit | a suspended important moment | 4.0 s; background rotates ±12° and slides opposite; Ari turns front → 3/4 at 2.0 s; preset resolve |
| 20 | `locked-off-dread` | locked-off hold | stillness; the only movement is the threat | 5.0 s; wide, Ari still; red advances across frame at data-speed placeholder; drone |
| 21 | `slow-mo-reach` | slow motion | significance; "they mean it" | 4.0 s; Ari's hand reaches to a stranger's hand at 0.25×; dust particles at 1× to prove it's slowed |
| 22 | `time-lapse-wait` | time-lapse | vast time passing around one person | 4.0 s; Ari still on a bench; crowd and shadows at 100×, day → night sky tint (grays only) |
| 23 | `negative-space-alone` | negative space | alone, fragile | 4.0 s; Ari 8% of frame area at y 1500, 75% empty gray above; slight 2% push-in |
| 24 | `scale-contrast-giant` | scale contrast | tiny against something vast (awe) | 4.0 s; tilt-up 2D: Ari at bottom, gray structure 25× their height; y pans up 1200 px (inOut) |
| 25 | `glow-is-attention` | glow = attention | "that matters" | 3.5 s; Ari looks down at the shard at 1.0 s; glow radius 1.0 → 1.6, alpha 0.6 → 1.0 over 0.8 s (out) |
| 26 | `lights-go-out` | darkness / loss as absence | quiet grief without harm shown | 4.5 s; wide of 40 lit windows; lights switch off on lognormal schedule, 0.1 s each; Ari's shard last to stay lit |
| 27 | `drone-under-hold` | low drone | weight, unease | 4.0 s; identical to a neutral wide hold; only change is a drone fading in over 1 s (A/B with a silent copy) |
| 28 | `heartbeat-pulse` | heartbeat | "this is my body" | 4.0 s; CU; heartbeat 60 → 110 bpm; Ari's chest and shard glow pulse 2% on each beat |
| 29 | `eyes-widen-fear` | facial expression (eye whites) | a jolt of fear from the eyes alone | 3.0 s; ECU; calm → fear over 0.3 s (out) at 1.2 s; everything else frozen |
| 30 | `posture-slump-rise` | posture | defeat, then resolve, read from the body | 5.0 s; full figure, face kept neutral; slump over 0.8 s at 0.8 s; hold; rise over 0.5 s at 3.2 s |
| 31 | `hand-chooses` | gesture: the human hand chooses | agency; the tool follows a person | 4.0 s; CU hands; finger pulls back 0.15 s (anticipation), presses a gray button; thin green lines spread out from it to 5 dots |
| 32 | `same-tool-two-hands` | reversal | "it was the choice, not the tool" | 5.0 s; split frame; identical hands press identical buttons at 1.0 s; left spreads green lines, right spreads red; mirrored composition |

**What to watch for on the review page.** Some snippets exist in pairs so Jiji can compare one dial: 3 vs 5 (slow vs fast push), 20 vs 18 (still vs handheld), 27 vs its silent copy, 12 vs 15 (hard vs soft transition). Suggested extra A/B variants for the page (cheap, same code with one number changed): push-in speed (3 s vs 1.5 s), return depth (zoom 3.0 vs 4.5 vs 6.0), text size (140 vs 200 px), hold length after the pull-out (0.5 vs 1.5 s).

---

## 5. Recipes: how features combine

A recipe is a short list of snippets played as one 3–8 s beat. The review page can offer each as "combine these", show the parts under it, and let Jiji swap one part for another in the same group (e.g. swap `slow-push-in` for `handheld-close`). Rule of thumb from the attention research: **one new moving element at a time** [S6], and **at most one pattern interrupt per ~4 s** outside the SNAP (orienting responses last 4–6 s, and piling them up hurts memory [S29 Medium]).

| Recipe | Beat | Ingredients (in order) | Why it works |
|---|---|---|---|
| **The hook** | HOOK 0–1.5 s | `hook-eyes-ecu` + `red-at-the-edge` + `heartbeat-pulse` (+ optional `one-word-card`) | close-up = empathy [S11]; red pops out [S16]; the viewer sees danger Ari hasn't = suspense [S31]; open question [VIRAL P5] |
| **The notice** | HOOK→RACE | `gaze-leads-eye` + `whip-to-red` + `eyes-widen-fear` | viewers follow the gaze [S23], land on the threat, get the fear from the eyes [S25] |
| **The look-up** (sublime OUT) | OUT | `slow-push-in` (short) + `match-cut-green` + `crane-up-reveal` + `drone-under-hold` | brief push then pull reverses expectation; match cut ties the one to the many; vastness → awe [S22] |
| **The return** (IN+) | IN+ | `drop-back-in-closer` + `eyes-widen-fear` or `posture-slump-rise` | accelerating fall + closer framing = stronger emotion than the first IN [S11] |
| **The slow dread** | RACE | `locked-off-dread` + `negative-space-alone` + `jump-cut-waiting` + `lights-go-out` | stillness makes the red's motion dominate [S6]; isolation; time passing; loss as absence |
| **The dead stop** | end of RACE → SLOW | `lights-go-out` + `dead-stop` + `one-word-card` ("We slowed it down…" word-by-word) | full stop resets attention before the key line [S29, S30] |
| **The snap** | SNAP | `silence-then-hit` + `snap-speed-ramp` + split frame (`same-tool-two-hands` layout, with human vs AI-speed lanes) | silence sharpens the hit [S19]; speed ramp = felt gear change; split frame for direct comparison |
| **The choice** | SNAP (AI films) | `hand-chooses` + `same-tool-two-hands` + `orbit-decision` | puts a human hand on every AI action (brief §1 honesty rule); reversal makes the point without words |
| **The bottleneck line** | NECK | `slow-push-in` to CU + `posture-slump-rise` (rise half) + word-by-word card | resolve read from the body [S24]; text in the calm |
| **The loop join** | END → frame 1 | last 0.3 s dissolves back to `hook-eyes-ecu` framing | seamless replay (VIRAL P3) |

**A whole-film skeleton from recipes** (≈36 s): hook (1.5) → notice (3) → slow dread (5) → look-up (5) → return (3) → dead stop (2.5) → SLOW text (2.5) → snap (7) → bottleneck line (2.5) → END card (4.5). This keeps the brief's one out-and-back-in cycle and adds a second smaller one inside the snap.

**Suggested review-page data shape** (one entry per snippet, so recipes and swaps can be built from tags):
`{ slug, group: "camera"|"shot"|"time"|"edit"|"composition"|"colour"|"sound"|"text"|"acting"|"story", feature, beats: ["HOOK","OUT"], feel, params: {...}, variantOf: null|slug }`

---

## 6. Sources

Confidence in brackets is for how we use it here.
- **S1** Bordwell & Thompson, *Film Art: An Introduction* (ch. 6, editing: graphic, rhythmic, spatial, temporal relations). Via summary: mediafactory.org.au "Bordwell & Thompson 2013, Chapter 6 The relation of shot and shot: editing"; Wikipedia "Film editing". [High as framework; book reached via summaries]
- **S2** Walter Murch, *In the Blink of an Eye* (Rule of Six). Via studiobinder.com/blog/walter-murch-rule-of-six and nofilmschool.com/2018/08/editing-eye-trace-mind-rule-six-incorrect. [Craft]
- **S3** Tim J. Smith, "The Attentional Theory of Cinematic Continuity", *Projections* 6(1), 2012. eprints.bbk.ac.uk/6679; berghahnjournals.com/view/journals/projections/6/1/proj060102.xml. [High]
- **S4** Smith & Henderson, "Edit Blindness: The relationship between attention and global change blindness in dynamic scenes", *J. Eye Movement Research* 2(2), 2008. bop.unibe.ch/JEMR/article/download/2264/3460. [High]
- **S5** Smith & Martin-Portugues Santacreu, "Match-Action: The Role of Motion and Audio in Creating Global Change Blindness in Film", *Media Psychology* 20(2), 2017. tandfonline.com/doi/abs/10.1080/15213269.2016.1160789. [High]
- **S6** Mital, Smith, Hill & Henderson 2011 (attentional synchrony), cited in Loschky et al., "What Would Jaws Do? The Tyranny of Film…", PLOS One 2015, journals.plos.org/plosone/article?id=10.1371/journal.pone.0142474; Smith & Mital, "Attentional synchrony and the influence of viewing task…", JOV, jov.arvojournals.org/article.aspx?articleid=2193975. [High]
- **S7** Cutting, DeLong & Nothelfer, "Attention and the Evolution of Hollywood Film", *Psychological Science* 21, 2010. journals.sagepub.com/doi/10.1177/0956797610361679. [High on 1/f trend; Medium on it causing attention]
- **S8** Cutting, "Narrative theory and the dynamics of popular movies", *Psychonomic Bulletin & Review* 23, 2016. pmc.ncbi.nlm.nih.gov/articles/PMC5133278. [Medium]
- **S9** Cutting & Candan, "Shot durations, shot classes, and the increased pace of popular movies" (academia.edu/54068159); Cutting et al., "Shot Structure in Hollywood Film". [High on the ~12 s → ~4 s decline]
- **S10** Mobbs et al., "The Kuleshov Effect: the influence of contextual framing on emotional attributions", *SCAN* 1(2), 2006, academic.oup.com/scan/article/1/2/95/2362814; "Reexamining the Kuleshov effect", PLOS One 2024; Barratt et al. 2016, "Does the Kuleshov Effect Really Exist?", researchgate.net/publication/300082821 (Prince & Hensley 1992 found none). [Medium: real but small and contested]
- **S11** Rooney & Bálint, "Watching More Closely: Shot Scale Affects Film Viewers' Theory of Mind Tendency But Not Ability", *Frontiers in Psychology* 2018, pmc.ncbi.nlm.nih.gov/articles/PMC5776141; "Shot scale and viewers' responses to characters in animated films", research.vu.nl; Canini, Benini & Leonardi, "Affective analysis on patterns of shot types in movies", ISPA 2011. [Medium-High]
- **S12** "Visual looming is a primitive for human emotion", bioRxiv 2023, biorxiv.org/content/10.1101/2023.08.29.555380v1.full; looming-threat literature (Frontiers in Psychology 2016, "Dysfunctional Freezing Responses to Approaching Stimuli"). [Medium; preprint, and a slow push-in is much gentler than lab looming]
- **S13** Dolly zoom: The Conversation, "How Hitchcock's Vertigo gave us the dolly zoom", theconversation.com/…-282059; Wikipedia "Dolly zoom". [Craft]
- **S14** Caruso, Burns & Converse, "Slow motion increases perceived intent", *PNAS* 2016, pnas.org/doi/10.1073/pnas.1603865113; Wöllner et al., "Slow motion in films and video clips: Music influences perceived duration and emotion…", PLOS One 2018, journals.plos.org/plosone/article?id=10.1371/journal.pone.0199161. [High / Medium]
- **S15** Heimann et al., "Embodying the camera: An EEG study on the effect of camera movements on film spectators' sensorimotor cortex activation", PLOS One 2019, journals.plos.org/plosone/article?id=10.1371/journal.pone.0211026; "An embodiment of the cinematographer: emotional and perceptual responses to different camera movement techniques", Frontiers in Neuroscience 2023, frontiersin.org/…/fnins.2023.1160843/full. [Medium]
- **S16** Treisman & Gelade 1980, feature integration theory. en.wikipedia.org/wiki/Feature_integration_theory; pressbooks.cuny.edu/sensationandperception/chapter/feature-integration-theory. [High]
- **S17** Von Restorff isolation effect. en.wikipedia.org/wiki/Von_Restorff_effect. [High]
- **S18** Valdez & Mehrabian, "Effects of color on emotions", *J. Exp. Psych.: General* 1994 (semanticscholar.org); Wilms & Oberfeld, "Color and emotion: effects of hue, saturation, and brightness", *Psychological Research* 2018, link.springer.com/article/10.1007/s00426-017-0880-8. [High on saturation → arousal]
- **S19** "Acoustic Startles in Horror Films: A Neurofilmological Approach", *Projections* 13(1), 2019, berghahnjournals.com/view/journals/projections/13/1/proj130104.xml; "(Re)Considering the jump scare in four elements", pmc.ncbi.nlm.nih.gov/articles/PMC12815854. [Medium]
- **S20** "Narrative predicts cardiac synchrony in audiences", *Scientific Reports* 2024, nature.com/articles/s41598-024-73066-8. [Medium; heartbeat *sound effect* itself is Craft]
- **S21** "Soundless Music" infrasound concert (Wiseman, Angliss, O'Keeffe, 2003), via en.wikipedia.org/wiki/Sarah_Angliss and "Perception of infrasound". [**Low**: public event, not peer-reviewed]
- **S22** Keltner & Haidt, "Approaching awe, a moral, spiritual, and aesthetic emotion", *Cognition and Emotion* 17(2), 2003, tandfonline.com/doi/abs/10.1080/02699930302297; APS Observer "All About Awe". [High]
- **S23** Friesen & Kingstone 1998, gaze cueing; review in "The Gaze-Cueing Effect in the United States and Japan", Frontiers in Psychology 2017, pmc.ncbi.nlm.nih.gov/articles/PMC5775299; "Attention Capture by Direct Gaze is Robust…", pmc.ncbi.nlm.nih.gov/articles/PMC4072644. [High]
- **S24** Aviezer, Trope & Todorov, "Body Cues, Not Facial Expressions, Discriminate Between Intense Positive and Negative Emotions", *Science* 338, 2012, science.org/doi/10.1126/science.1224313. [High]
- **S25** Whalen et al., "Human Amygdala Responsivity to Masked Fearful Eye Whites", *Science* 306, 2004, science.org/doi/10.1126/science.1103617. [High]
- **S26** Baranowski & Hecht, "Effect of Camera Angle on Perception of Trust and Attractiveness", *Empirical Studies of the Arts* 2018, journals.sagepub.com/doi/abs/10.1177/0276237417710762; Kraft 1987, *Memory & Cognition* 15 (via visual-memory.co.uk "Notes on The Gaze"). [Medium; effects modest]
- **S27** Amirshahi et al., "Evaluating the Rule of Thirds in Photographs and Paintings", *Art & Perception* 2, 2014, uniklinikum-jena.de/anatomie1_media/Inhalte/AmirshahiARTP2014.pdf. [Medium: evidence *against* a strong effect]
- **S28** Szarkowska & Gerber-Morón, "Viewers can keep up with fast subtitles: Evidence from eye movements", PLOS One 2018, journals.plos.org/plosone/article?id=10.1371/journal.pone.0199331; Netflix timed-text norms via subtitling.net / closedcaptioncreator.com. [Medium-High; norms are industry, not lab]
- **S29** Lang, "The Limited Capacity Model of Mediated Message Processing", *J. Communication* 50(1), 2000, onlinelibrary.wiley.com/doi/abs/10.1111/j.1460-2466.2000.tb02833.x; orienting-response heart-rate literature ("The Impact of Cognitive Load on the Cardiac Orienting Response…", pmc.ncbi.nlm.nih.gov/articles/PMC6634355). [High that cuts/sounds cause orienting; Medium on the 4–6 s window]
- **S30** Zacks et al., event segmentation theory; Magliano & Zacks, "The Impact of Continuity Editing in Narrative Film on Event Segmentation", *Cognitive Science* 2011, onlinelibrary.wiley.com/doi/10.1111/j.1551-6709.2011.01202.x; "The Brain's Cutting-Room Floor", Frontiers 2010. [High]
- **S31** Hitchcock's "bomb under the table" (Hitchcock/Truffaut, 1966). davidbordwell.net/blog/2013/11/29/hitchcock-lessing-and-the-bomb-under-the-table. [Craft, near-universal]
- **S32** Scott McCloud, *Understanding Comics* (1993), "amplification through simplification". en.wikipedia.org/wiki/Understanding_Comics. [Craft]
- **S33** Glocker et al., "Baby Schema in Infant Faces Induces Cuteness Perception and Motivation for Caretaking in Adults", *Ethology* 2009, onlinelibrary.wiley.com/doi/abs/10.1111/j.1439-0310.2008.01603.x. [High for infant faces; Medium transferred to an adult cartoon]
- **S34** Zell et al., "To stylize or not to stylize? The effect of shape and material stylization on the perception of computer-generated faces", SIGGRAPH Asia 2015 (academia.edu/109622422); Kätsyri et al., "Virtual Faces Evoke Only a Weak Uncanny Valley Effect", *Perception* 2019. [Medium-High]
- **S35** Thomas & Johnston, *The Illusion of Life* (1981), twelve principles of animation. Via adobe.com/creativecloud/animation/discover/principles-of-animation.html. [Craft]
- **S36** Whip pan: en.wikipedia.org/wiki/Whip_pan; studiobinder.com/blog/swish-pan-whip-pan-definition-film. [Craft]
- **S37** Negative space: filmmakersacademy.com/blog-negative-space-film; art-blog sources on isolation. [**Low / Craft**: no controlled study found]

**Weak claims we deliberately did not use:** the "orienting response every second keeps attention" line from an e-learning blog (bryantanner.wordpress.com; untraced figure); dopamine-and-twists claims from writing blogs; any claim that the rule of thirds makes images more liked; exact infrasound effects.

**Gaps worth a later look:** no controlled studies found on orbit shots, crossfades, or time-lapse; the looming evidence is for fast expansions, not cinematic push-ins; almost all shot-scale work uses live-action or long-form film, not 4-second vertical clips. The snippet lab plus Jiji's review picks are effectively our own small experiment on these gaps.
