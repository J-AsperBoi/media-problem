# Standing brief for an animatic subagent

You own ONE animatic end to end, in /home/user/media-problem/orchestration-videos. Your concept, slug, and analog are given below this brief.

Read first: CLAUDE.md (all of it), RATES.md, research/analogs/<your analog>.json, the entry for your structure template in research/VIRAL_STRUCTURES.md, tools/lib.js, and one example scene in scenes/ for drawing style (not plot).

Rules (CLAUDE.md sections 1, 3, 6, 6b, 8, 11, 12):
- 25–45s, 1080x1920, 30fps. Scene at scenes/<slug>.js, `module.exports = makeScene`, `draw(ctx,t)` pure in t; all randomness from L.rng at setup.
- Red #ff3b30 is only the threat, green #34d27b only solution fragments; everything else desaturated gray. Never name the threat.
- Speeds come from the analog file: threat via its points or L.logistic with its doubling_time; human aggregation via L.lognormalQuantile/L.lognormalCDF with its median/p10/p90; AI snap via ai_counterfactual (labeled "illustrative" on screen). One stated time mapping. Only numbers marked verified go on screen; at most two numbers on screen.
- Mandatory beats: hook in the first second (frame 1 = thumbnail), human-speed race, "We slowed it down so you could see it.", the snap (true speed, then AI-speed side by side, labeled illustrative), "This is the bottleneck.", then L.endCard held at least 3s.
- Camera: start first person / close in, pull out to reveal the whole race, come back in closer. At least one out-and-in cycle; use L.camera keyframes with easing; L.slate each shot.
- Text between y 220–1500 and x 80–900 (the right column is covered by platform UI). At most ~7 words per card, each card at least 1.2s. Serif titles, few words, the sublime tone. acts with drone: true, sparse cues.
- Honesty rules in CLAUDE.md section 1 always apply.

Loop:
1. Write output/<slug>/notes.md (Tier: animatic, title, logline, structure, analog id, time mapping and the speed math for threat / human aggregation / AI counterfactual, shot list with camera moves and zoom-cycle timestamps, 3D translation note, copy variants, tags).
2. `node tools/diversity.js '<json tags>'` — if TOO SIMILAR, change dimensions (not the analog or structure you were assigned) and note it.
3. Build. `node tools/render.js scenes/<slug>.js --preview`, then Read output/<slug>/contact_sheet.png and actually look. Fix what's broken; preview again only if something was broken. Budget ~30 minutes.
4. `node tools/render.js scenes/<slug>.js`; confirm with `ffprobe -v error -show_entries format=duration -of csv=p=0 output/<slug>/<slug>.mp4` that duration ≈ DUR.
5. Append scores to notes.md: Hook, Speed accuracy, Snap impact, Emotion, Originality, Craft, Honesty (1–10), `Overall: <avg>`, `Virality: <N>%` + one sentence (be harsh: most films belong in single digits or low teens).
6. Append ONE JSON line to output/LEDGER.jsonl: {"slug","structure","medium","family","scale","pace","emotion","protagonist","camera","analog","overall","virality":<number>}. Use `>>` so you never overwrite others' lines.

Do not git commit (the coordinator does). Do not edit tools/, CLAUDE.md, config.json, or other films. Save work as you go (a usage limit may cut you off). Report: output path, duration, Overall, Virality, and anything that failed.

## Director's notes from earlier films (apply these)
- Your concept comes from output/concepts.json (via tools/pick.js). Treat the logline as a starting point; the analog file wins on facts.
- Characters: use L.stick or the bean from scenes/example_follow_the_green.js for faces with emotion; avoid blobby freehand hands.
- Crossfades between zoom levels must not show rectangular patches; fade full-frame layers.
- Where the analog's AI counterfactual is small, don't inflate it. Make the snap land through staging instead: freeze, silence, one sharp cue, then the two timelines side by side.
- Frame 1 is the thumbnail: red and green both visible, one face or hand, one short line of text.
