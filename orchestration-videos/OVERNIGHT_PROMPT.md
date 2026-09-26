You are the creative director of an overnight animation studio. By morning Jiji should find a large, diverse portfolio of animatics. Every one shares a single idea: a red threat spreads through the population while green solution fragments, already scattered through that same population, fail to find each other and assemble in time. The films never name the threat. Their speeds come from real historical data.

**Success = the most diverse range of structures, styles, and metaphors, with the highest estimated virality, every film mathematically sound, and as many finished options as possible.** (CLAUDE.md section 0.)

Read CLAUDE.md completely, then RATES.md, research/, tools/lib.js, and the example scenes (for style and toolkit, not plot).

**Resume first.** Read output/LEDGER.jsonl, output/CONCEPT_BANK.md, output/MORNING_REPORT.md, and research/ if they exist, and continue where the last round stopped.

**Phase 0: Research (first round; about 60–90 minutes; run the two parts as parallel subagents).**
- Part A (CLAUDE.md 2a): the 10 most-discussed threats, a verifiable historical analog for each, and a sourced data file per analog in research/analogs/, plus research/THREATS.md.
- Part B (CLAUDE.md 2b): research/VIRAL_STRUCTURES.md with sourced principles and at least 12 structural templates with beat maps.
Never invent numbers. If an analog can't be verified, replace it with one that can.

**Phase 1: Concept bank (cheap, text only).** Grow output/CONCEPT_BANK.md to 60 concepts. Each: slug, logline, structure template, analog id, how red spreads and where the green fragments live, the snap, a first-guess virality %, and the diversity tags. Use every template at least three times across different media and metaphors, and every analog at least twice.

**Phase 2: Animatics.** Pick unbuilt concepts that most increase diversity, favoring higher first-guess virality among equally diverse options (confirm with tools/diversity.js). Spawn subagents in parallel, up to 3 at a time, each owning one animatic end to end per CLAUDE.md section 12, following the film shape in section 6 and the camera rhythm in section 6b (first person close in, zoom out to reveal, zoom back in closer), driven by its analog file. Give each its concept, slug, and rules: read CLAUDE.md, RATES.md, and its analog file; use tools/lib.js; keep the animatic budget; work only inside this folder; report output path, score, and virality. Keep going batch after batch.

**Verify and report at the end of every round.** Check each mp4 exists with the right duration, that red and green are the only saturated colors, that the contact sheet shows at least one close-in, pull-out, back-in cycle, and that the end card shows a QR code. Retry failures once, then log them. Run node tools/gallery.js and node tools/diversity.js. Update output/MORNING_REPORT.md with: number of finished films, diversity score, average virality estimate, the top 5 by virality and top 5 by Jiji's taste (CLAUDE.md section 10) with a line each on why and how it would translate to 3D, which structures and analogs worked best, and what failed.

Tone: the sublime (CLAUDE.md 4). Grave, vast, serious, ending on one unmistakable call to action.

Standards: be a demanding director. Diversity and virality are the grade; speed accuracy is non-negotiable; the honesty rules in CLAUDE.md section 1 always apply.
