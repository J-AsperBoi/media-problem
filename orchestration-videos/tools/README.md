# `tools/` — the machinery

**What this is:** The shared machinery that every film uses:
- `lib.js`: the toolkit of building blocks (camera moves, stick figures, text, growth curves, the QR end card).
- `render.js`: turns a recipe into a video.
- `verify.js`: an automatic quality check on the finished video (length, colours, QR code).
- `lint.js`: an automatic check that runs *before* rendering. It watches every word a film draws and flags text that is too small for a phone (under 44 px), text outside the safe zone (it could be hidden by app buttons), more than two numbers, banned words that name the threat, and an AI-speed version missing its "illustrative" label. Run `node tools/lint.js --all`. The latest results are in `../output/LINT_REPORT.txt`. **Known blind spot:** text drawn as shapes (like the 8-bit pixel font) can't be read, so `fifty-nine-days` shows a false "missing illustrative" failure.
- `diversity.js`: scores how different the films are from each other.
- `pick.js`: chooses which idea to build next.
- `gallery.js`: builds the viewing page `output/index.html`.
- `audio.js`: the scratch soundtrack.
- `ANIMATIC_AGENT_PROMPT.md`: the standing instructions given to each AI film-maker.

**Why it exists:** Code that many files need lives in one place, so a fix here fixes every film. It also keeps the film recipes short.

**How common is this?** Universal. Shared helpers are usually in `lib/`, `utils/` or `scripts/`. Automatic checks like `verify.js` are the beginner version of **tests** and **CI** (continuous integration), which almost every professional project runs on every change.

**How other projects differ:** Larger projects put tests in their own `tests/` folder and run them automatically on GitHub with GitHub Actions. This project runs its checks by hand.

**Learn more:** [What is continuous integration (GitHub)](https://docs.github.com/en/actions/about-github-actions/about-continuous-integration-with-github-actions) · [Node.js intro](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs) · [FFmpeg](https://ffmpeg.org/about.html)

← Back to the [project map](../README.md)
