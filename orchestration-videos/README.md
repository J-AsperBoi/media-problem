> **What this folder is:** the studio. Everything for the films lives here. The top of the repo has a [beginner's project map](../README.md). This file covers *running* the studio on your own Mac. It is a standard "getting started" README, the kind nearly every project has.

# Overnight film studio

## One-time setup (Mac)
1. `brew install node ffmpeg`
2. In this folder: `npm install`
3. Test: `node tools/render.js scenes/example_animatic_eight_billion_heads.js`, then open `output/example_animatic_eight_billion_heads/`.

## Before bed (10 minutes, don't skip)
0. Put your landing page URL in `config.json` (`ctaUrl`). Every video's QR code points there with `?src=<video>` so you can see which video drives signups.
1. Open Claude Code in this folder and say: "Read CLAUDE.md and make one animatic." Approve what it asks. This catches problems while you're awake.
2. Delete that test output if you like, or keep it.
3. Make sure you're logged into Claude Code with your subscription. The runner unsets ANTHROPIC_API_KEY so it can't bill API credits.
4. Plug in and start: `caffeinate -i ./run_overnight.sh`

## What happens overnight
- Research first: the 10 most-discussed threats, a real historical analog with speed data for each, and an analysis of viral video structures. Everything lands in `research/`.
- A 60-concept bank gets written (cheap).
- ~12 animatics per round, chosen for maximum difference, built by parallel subagents.
- If usage runs out, the runner sleeps 2 hours and resumes where it left off. It stops at 8am.

## In the morning
- `output/index.html`: every animatic, best first, plus the diversity score.
- `output/MORNING_REPORT.md`: top 5 picks with notes on moving each into 3D.
- `output/CONCEPT_BANK.md`: all 100 ideas, including the unbuilt ones.
- Audio is a tempo-matched scratch track; real music goes on in CapCut.

## If something breaks
Check `logs/`. If `claude -p` rejects a flag (they change between versions), run `claude --help` and adjust `run_overnight.sh`.
