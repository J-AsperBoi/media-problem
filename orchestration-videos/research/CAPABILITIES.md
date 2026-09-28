# What the tools can actually do: capabilities and pipelines

_Phase 1, step 1 of the [roadmap](../../ROADMAP.md). Researched 2026-09-28. Written for a smart beginner; technical words are explained where they first appear._

**How to read the sources.** Each claim links the page it came from. Pages marked **(official)** come from the company that makes the tool. Pages marked **(weak)** are third-party blogs, comparison sites or vendor marketing: useful for a rough picture, but check them before relying on them. Anything measured directly in this studio's container is marked **(measured here)**.

---

## The short answer

- **Claude writes code and looks at pictures. It does not make pictures, video or sound directly.** Everything it "draws" is code that another program (a renderer) turns into pixels.
- So the best pipelines for us are the ones where **the whole film is code**: every speed, position and colour is a number an agent can set and check.
- **Phase 2 (snippet lab): stay 2D, keep our current canvas pipeline,** and add a proper reusable character "rig" (a puppet made of code). Cheapest, fastest, already proven on 60 films, and data-accurate by design.
- **Phase 6 (3D pilot): Blender, driven by Python code,** rendered on the CPU in this container. It is free, fully scriptable, and the only 3D option that works here without a graphics card. A three.js (3D-in-a-web-page) version is the fallback.
- **AI video generators are not suitable for the data-driven parts**: they can't hold exact speeds, counts or text. They could, at most, supply textures or a character look in a later hybrid, and only if Jiji relaxes the "no paid APIs" rule in `CLAUDE.md`.

---

## 1. What Claude can and cannot do for animation

### The current lineup (September 2026)
Anthropic's official list is the [Models overview (official)](https://platform.claude.com/docs/en/about-claude/models/overview). As reported in search summaries of that page and of pricing guides:

| Model | Role | API price per million tokens (input / output) |
|---|---|---|
| Claude Opus 5.5 (released 2026-09-22) | Newest top general model, 1M-token context | $4 / $20 |
| Claude Fable 5 / 5.1 | Most capable widely released tier, for demanding long-running agents | about $10 / $50 |
| Claude Sonnet 5 | Balanced price and quality | $2 / $10 |
| Claude Haiku 4.5 | Fast and cheap | $1 / $5 |
| Claude Mythos 5.1 | Restricted access only | n/a |

Prices: [Sentra: Claude API Pricing 2026 (weak)](https://www.sentra.app/articles/claude-api-pricing), [Second Talent: Every Claude model compared (weak)](https://www.secondtalent.com/resources/every-claude-ai-model-explained-compared/). Confirm on Anthropic's own pricing page before budgeting. Two cost levers: **prompt caching** (re-sending the same long instructions, such as `CLAUDE.md`, costs about 10% of normal) and the **Batch API** (half price if you can wait for results), per [Sentra (weak)](https://www.sentra.app/articles/claude-api-pricing).

A **token** is a chunk of text of roughly three-quarters of a word. Round one's ~140,000 tokens per film works out to a few dollars per film at Opus 5.5 API prices, depending on the input/output mix. On a subscription plan (Pro/Max), usage comes out of a **weekly allowance** shared across the Claude apps and Claude Code, and Anthropic doesn't publish exact numbers ([Claude Help Center: What is the Max plan? (official)](https://support.claude.com/en/articles/11049741-what-is-the-max-plan); [ai-toolbox: Claude usage limits 2026 (weak)](https://www.ai-toolbox.co/claude-management-and-productivity/claude-usage-limits-2026)). This is why the snippet approach matters: small pieces use up the allowance much more slowly than whole films.

### What Claude is good at here
| Ability | What it means for us | Source |
|---|---|---|
| **Writing code** | Scene files, camera moves, curves from data, Blender scripts, web animation code. This is the core skill every pipeline below relies on. | METR measured Claude Opus 4.6 finishing, half the time, software tasks that take a human expert about 14.5 hours (very noisy estimate: 6–98 h). [METR on X (official for METR)](https://x.com/METR_Evals/status/2024923422867030027); background on the metric: [METR: Time horizons](https://metr.org/time-horizons/), [MIT Tech Review: "the most misunderstood graph in AI"](https://www.technologyreview.com/2026/02/05/1132254/this-is-the-most-misunderstood-graph-in-ai/) |
| **Looking at images** ("vision") | It can review rendered frames and contact sheets: is the text in the safe zone, is the red readable, does the character look right. | [Claude Docs: Vision (official)](https://platform.claude.com/docs/en/build-with-claude/vision) |
| **Long agentic work** | It can run a loop by itself for hours: write, render, look, fix. Round one's overnight studio already proved this. | Same METR source; our own round-one results |
| **Reading long material** | Up to about 1M tokens of context on Opus 5.5, so the brief, research files and toolkit fit at once. | [Models overview (official)](https://platform.claude.com/docs/en/about-claude/models/overview) |

### What Claude cannot do (or does poorly)
- **It cannot generate images, video or audio.** The official vision page says Claude interprets images; it doesn't create or edit them ([Vision docs (official)](https://platform.claude.com/docs/en/build-with-claude/vision)). All our pixels and sounds come from code it writes (our `audio.js` synthesises the drones and cues).
- **It can't watch a video.** It sees still frames. That's why `render.js --preview` makes a contact sheet. Motion problems between frames (jitter, a jump cut that's too fast) are easy for it to miss, so we should also check timing with numbers, not just eyes.
- **Its spatial judgement from images is approximate.** The docs warn it struggles with precise positions and exact counts of many small objects, and with images under ~200 px ([Vision docs (official)](https://platform.claude.com/docs/en/build-with-claude/vision)). So "measure label sizes and safe zones" (Phase 4) should be done by code that reads the scene's own numbers, with Claude's eyes as a second check.
- **Image limits:** each image is cut into 28×28-pixel tiles, and each tile costs a token. The newest models accept up to about 2,576 px on the long edge. Many images per request are allowed, but request size limits (32 MB) bite first ([Vision docs (official)](https://platform.claude.com/docs/en/build-with-claude/vision)). A 1080×1920 frame costs roughly as much as a few pages of text, so looking at contact sheets is cheap. Looking at every frame is not.
- **It won't identify real people in images,** which suits our "no real named people" rule anyway.
- **Organic 3D modelling and rigging are weak spots.** Reports on Claude driving Blender say it's reliable for simple shapes, placement, lighting and materials, but struggles with intricate organic shapes (faces, hands) and rigging, meaning the internal skeleton that makes a character move ([MindStudio: Claude + Blender MCP (weak)](https://www.mindstudio.ai/blog/claude-blender-mcp-real-world-performance)). A stylised, simple character is the right call.

---

## 2. Pipeline options

"Data-accurate motion" means the red spreads and the green assembles at speeds computed from `research/analogs/*.json`. Any pipeline where an agent can't set exact positions per frame fails our core honesty rule (brief section 3).

### a) Current: 2D code-drawn canvas (baseline)
- **How it works:** each scene is a JavaScript function `draw(ctx, t)` that paints one frame at time `t` on a canvas (a blank digital drawing surface) using [@napi-rs/canvas](https://github.com/Brooooooklyn/canvas). `render.js` calls it 30 times per second of film and pipes the frames into [FFmpeg](https://ffmpeg.org/), the standard free video tool, which makes the MP4 and adds synthesised audio.
- **What the agent controls:** everything, to the pixel. Timing is a pure function of `t`, so the same input always gives the same frame. Data curves (`L.logistic`, `L.lognormalCDF`) drive motion directly.
- **Quality ceiling:** flat 2D. Good for stylised looks (animatic, ink, blueprint, 8-bit). Rich lighting, depth and realistic characters are hard, because every shading effect has to be hand-coded. Our stick figure (`L.stick`) is expressive but basic.
- **Cost/speed:** about **43 ms to draw one 1080×1920 frame** on this container's 4 CPU cores **(measured here)**, so a 38-second film draws in about 50 seconds plus encoding. No licence costs. The expensive part is Claude's tokens, not rendering.
- **Fit for 25–45 s vertical data films:** excellent. It's proven on 60+ films.
- **Verdict: keep as the Phase 2 workhorse.** Its weakness is the *character*, not the pipeline. Fix that with a reusable character module (section 3).

### b) Web animation stacks
| Tool | How it works | Agent control | Notes |
|---|---|---|---|
| [Remotion](https://www.remotion.dev/) | Video as a React web page; a headless (windowless) Chrome browser screenshots every frame | Full, frame-exact (`useCurrentFrame()`) | Anything a browser can show: CSS, SVG, web fonts, even three.js 3D. Free for individuals and organisations of up to 3 people, including commercial use ([Remotion: License & Pricing (official)](https://www.remotion.dev/docs/license/pricing)). Slower per frame than our canvas because a browser sits in the middle. |
| [Motion Canvas](https://motioncanvas.io/) / [Revideo](https://docs.re.video/) | TypeScript "generator" timelines drawing on a canvas; Revideo is a fork built for automated, headless rendering | Full | MIT licence (free). Great for explainer-style motion graphics. Motion Canvas is built around a live editor for humans; Revideo is better for agents ([PkgPulse comparison (weak)](https://www.pkgpulse.com/blog/remotion-vs-motion-canvas-vs-revideo-programmatic-video-2026); [Midrender: next chapter of Revideo (weak)](https://midrender.com/revideo)). |
| [Manim](https://docs.manim.community/) (Community Edition) | Python library made for 3Blue1Brown-style maths videos | Full | Beautiful for graphs, equations and morphing shapes. LaTeX (maths typesetting) is optional, and FFmpeg now ships inside it ([Manim docs: installation (official)](https://docs.manim.community/en/stable/installation/conda.html)). Its "maths lecture" look is recognisable, and it's weak on characters. |
| [p5.js](https://p5js.org/) | Creative-coding sketches in the browser | Full | Essentially what we already have, but browser-based; no real gain. |

- **Quality ceiling:** higher polish for typography, layout and motion graphics (springs, text effects, SVG illustrations) than our hand-rolled toolkit, but still 2D, with the same character problem.
- **Verdict: not worth switching to for Phase 2.** Our toolkit already does the parts that matter (keyframed camera, data curves, deterministic frames). Moving means rewriting 65 scenes' worth of know-how. **Worth borrowing ideas** (spring easing, text animation helpers) into `lib.js`. Remotion is the stack to revisit if we ever want text-heavy UI-style films or a browser-based review tool that plays scenes live.

### c) 3D via code
**What a 3D pipeline gives:** real cameras (lens, depth of field, true crane and dolly moves), lighting and shadows, and scale. That's exactly what the brief's "inside, then above, then back inside" camera language wants. Every scene's `notes.md` already carries a "3D translation note".

| Tool | How it works | Headless Linux, no GPU (our container) | Verdict |
|---|---|---|---|
| **[Blender](https://www.blender.org/) + Python (`bpy`)** | Free, professional 3D suite. Every action (make an object, keyframe a camera, set a material, render) is scriptable in Python. Also available as a pip package, `bpy`. | **Works, with caveats.** The **Cycles** renderer (realistic) runs on CPU but is slow: roughly seconds to minutes per frame, depending on quality ([SURF Blender course: GPU rendering](https://surf-visualization.github.io/blender-course/basics/rendering_lighting_materials/gpu_rendering/)). **EEVEE** (the fast renderer) needs OpenGL graphics. Without a GPU it can run through software emulation (Mesa "llvmpipe" plus a fake screen, `xvfb`), but it's slow and fragile in containers ([nytimes/rd-blender-docker issue #37](https://github.com/nytimes/rd-blender-docker/issues/37); [Blender Artists thread (weak)](https://blenderartists.org/t/belender-4-2-1-eevee-does-not-work-inside-docker/1551491)). **Workbench** (flat preview shading) is quick. | **Best 3D choice.** Most capable, free, deterministic, huge documentation. **Grease Pencil** draws 2D strokes inside 3D space, with "Line Art" outlines for toon looks ([Blender manual: Grease Pencil (official)](https://docs.blender.org/manual/en/latest/grease_pencil/introduction.html)). That could keep our hand-drawn identity in 3D. |
| **[three.js](https://threejs.org/)** | 3D in a web page (JavaScript) | Works via headless Chrome with software graphics (SwiftShader). Frames must be captured deterministically: freeze the clock and step time manually ([puppeteer-capture (GitHub)](https://github.com/alexey-pelykh/puppeteer-capture)). One agent project found it silently fell back to noisy CPU rendering, which it had to detect ([Crow issue #293 (weak)](https://github.com/nibor1896/Crow/issues/293)). | Good fallback, and same language as our current code. Needs more hand-building than Blender (no modelling tools, weaker lighting). Can be embedded in Remotion. |
| **[Godot](https://godotengine.org/)** | Free game engine with a "Movie Maker" mode that records frames offline | Its headless mode **turns off rendering**, so Movie Maker needs a window (a fake one via `xvfb` plus software OpenGL) ([Godot docs: Creating movies (official)](https://docs.godotengine.org/en/stable/tutorials/animation/creating_movies.html)) | Possible, but built for interactive games, not scripted films. No advantage over Blender here. |
| **Unity / Unreal** | Commercial game engines | Heavy (tens of GB), licence sign-in, effectively need a GPU for their quality level | **Not feasible in this container.** Out of scope. |

- **Agent control:** complete in Blender and three.js. Positions, camera paths and timing are set from the same analog data. Claude can drive Blender reliably for primitives, layout, lights, cameras and materials, but not for sculpting detailed organic characters ([MindStudio (weak)](https://www.mindstudio.ai/blog/claude-blender-mcp-real-world-performance)). There's even an open-source "Blender MCP" bridge that lets Claude run Python inside a live Blender ([blendermcp.org (weak)](https://blendermcp.org/)). We don't need it, since plain scripts and command-line renders are simpler and repeatable.
- **Speed in this container:** 4 CPU cores, 15 GB RAM, **no GPU (measured here)**. Realistic plan: stylised materials, low sample counts, and Workbench or low-sample Cycles. Budget minutes to hours per 30-second film. **Test this first** with one 5-second shot before promising anything.
- **Verdict: Blender for the Phase 6 pilot,** with a deliberately stylised look (clay, paper, toon plus Line Art) that renders fast on a CPU and hides the lack of detailed modelling.

### d) AI video and image generators (2026)
- **How they work:** you give a text prompt and/or a reference image, and a large model "imagines" a clip, usually 5–10 seconds, sometimes with sound. Leaders as of September 2026 include Kling 3.0, Google Veo 3.1, Runway Gen-4.5 and Seedance 2.0. OpenAI's Sora 2 API shut down on 2026-09-24 ([Pinggy: best video generation models 2026 (weak)](https://pinggy.io/blog/best_video_generation_ai_models/); [PixVerse: best AI video generators (weak; vendor)](https://pixverse.ai/en/blog/best-ai-video-generators)).
- **What an agent controls:** the prompt, reference images, start/end frames, and sometimes a camera-move preset. It **cannot** control exact positions, speeds or counts per frame.
- **Data accuracy:** poor. Documented weaknesses include imprecise motion control, garbled or popping on-screen text, unrealistic physics (objects changing size, passing through things), and short clip lengths ([AI Handbook: models, coherence, constraints (weak)](https://www.aihandbook.io/generative-ai-handbook/ai-video-generation/); [is4.ai: limitations 2026 (weak)](https://is4.ai/blog/our-blog-1/ai-video-generation-limitations-traditional-methods-2026-357); [arXiv survey: Bridging text and video generation](https://arxiv.org/pdf/2510.04999)). A red wave that must cover 40% of the map at second 12 cannot be guaranteed. **That breaks brief section 3.**
- **Character consistency:** better than a year ago but still not solved. Using a reference image of the character on every clip "cuts drift significantly", yet pure text-to-video still drifts ([Pinggy (weak)](https://pinggy.io/blog/best_video_generation_ai_models/)). Image models such as Google's "Nano Banana 2" accept up to ~14 reference images to hold a face and outfit steady, with advice to re-anchor to the original reference every 5–8 generations ([Gen NanoBanana guide (weak)](https://gennanobanana.com/guides/ai-reference-images); [Prompt Architects (weak)](https://prompt-architects.com/blog/650-keeping-the-same-character-across-many-images)).
- **Cost/speed:** paid APIs, roughly **$0.10–$0.75 per second of video** as of mid-2026 ([Pinggy (weak)](https://pinggy.io/blog/best_video_generation_ai_models/)). Across many retries, a 40-second film could cost tens of dollars. Free open-weight models (Wan 2.2, LTX-2) need a graphics card with 8–32+ GB of video memory and take minutes per 5-second clip even on a top gaming GPU ([Spheron GPU guide (weak)](https://www.spheron.network/blog/ai-video-generation-gpu-guide/); [LTX blog (weak; vendor)](https://ltx.io/blog/open-source-video-generation-models-guide)). **Not runnable in this CPU-only container.**
- **Policy:** `CLAUDE.md` section 13 forbids paid APIs, and this container can't run the free models. Claude can't call these generators natively; it would need an API key and paid access.
- **Verdict: not for the core films.** Possible later for short, non-data mood shots (a close-up of hands, a skyline) if Jiji approves spending. Each such shot must then be labelled internally as non-data.

### e) Hybrid: code for motion, generated art for looks
- **How it works:** code controls *where things are and when* (the data-true layer), while generated or hand-made images supply *what they look like* (textures, painted backgrounds, a character's face drawn in several expressions). Example: a set of character drawings (a "sprite sheet") is generated once, and our canvas code moves, scales and swaps them per frame. In 3D, a generated image becomes a texture on a Blender object.
- **Agent control:** motion stays 100% exact. Only the artwork is uncontrolled, and it's made once, reviewed and frozen.
- **Quality ceiling:** the highest of any option that stays honest. It pairs painterly or illustrated looks with true motion.
- **Cost:** a one-off cost for a small art set (dozens of images, not thousands of video seconds). But it still needs an image generator, which means a paid API or a GPU. The zero-cost version is **code-drawn art assets** (SVG or canvas paths Claude writes once and reuses), which is what section 3 recommends.
- **Verdict: the right long-term direction.** Start with code-drawn assets now. Add generated textures later only if Jiji approves an image-generation budget.

### Summary table
| Pipeline | Data accuracy | Character consistency | Quality ceiling | Cost in this container | Runs here today? |
|---|---|---|---|---|---|
| a) 2D canvas (current) | Exact | Exact if coded once | Medium (stylised 2D) | ~free, ~1 min render | **Yes** |
| b) Remotion / Revideo / Manim | Exact | Exact if coded once | Medium-high 2D | free (Remotion free for ≤3 people) | Installable (npm/pip reachable; Chromium present) |
| c) Blender / three.js | Exact | Exact (one model file) | High 3D | free; slow CPU renders | Installable (not installed) |
| d) AI video generators | Poor | Fair with references, drifts | Very high realism | Paid, per second | **No** (paid API / GPU) |
| e) Hybrid | Exact | Good | High | Free with code-drawn art; paid for generated art | Partly |

---

## 3. A consistent central character in each pipeline

The roadmap wants **one recognisable person** across ~30 snippets. The key idea from studio practice is a **character model sheet**: one reference definition that everything draws from. In software that means **one module that every scene imports**, never redrawn per scene.

| Pipeline | How to make them consistent |
|---|---|
| a) 2D canvas | Build `tools/character.js`: one function, `drawHero(ctx, x, y, scale, {pose, mood, look, t})`, with fixed proportions, a signature silhouette (e.g. a distinctive haircut, scarf or coat shape), a fixed palette (desaturated grey clothing; only the green fragment they hold is saturated), and a small library of named poses and expressions. A "turnaround" test render (front, three-quarter, side, back, each mood) acts as the model sheet Jiji approves in Phase 3. Consistency is guaranteed because it's literally the same code. |
| b) Web stacks | Same idea, as a React/SVG component or Manim class. Same guarantee. |
| c) 3D | One Blender file (`hero.blend`) holding the modelled, rigged character, linked (not copied) into every scene, so fixes propagate. Keep it simple and stylised (a "bean"/clay figure or low-poly), since Claude is weak at organic modelling and rigging. A human-made or free-licensed base model could be imported and posed by code. |
| d) AI generators | Reference-image anchoring: one canonical front-facing image passed with every request, plus re-anchoring. It still drifts. Consistency can't be guaranteed, only reduced. |
| e) Hybrid | Generate or draw a **fixed sprite set** once (expressions × poses), review and freeze it, then let code choose which sprite to show per frame. It's consistent because the images never change after approval. |

**Carry-over tip:** design the 2D hero with the 3D pilot in mind (a simple silhouette that also works as a clay-style 3D figure), so the Phase 6 character is recognisably the same person.

---

## 4. Recommendation

### Phase 2 snippet lab: the current 2D canvas pipeline, extended
1. **Keep** `@napi-rs/canvas` + FFmpeg. It's exact, fast (~43 ms/frame), free, and already understood by our agents.
2. **Add a character module** (`tools/character.js`) and a model-sheet render first. Every snippet imports it.
3. **Add a snippet harness:** a render mode for 3–5 s clips, with the metadata (which film-grammar feature it isolates) stored beside it, feeding the Phase 3 review page.
4. **Borrow**, don't switch: spring easing and text-animation helpers from Remotion/Motion Canvas ideas, added to `lib.js`.
5. Why not a new stack? Switching costs rewrite time and token budget and gains little in accuracy. The snippet lab is about testing *film grammar*, which our pipeline can already express.

### Phase 6 3D pilot: Blender driven by Python, stylised look, CPU rendering
1. **Why Blender:** free, fully scriptable, deterministic, real cameras for the brief's crane/dolly language, Grease Pencil and Line Art to keep a hand-drawn feel, and it's the only serious 3D option that works headless without a GPU.
2. **Look:** stylised (clay, paper cutout or toon with outlines), few objects, instanced crowds (many copies of one simple figure). This plays to Claude's strengths (layout, cameras, lights, data-driven placement) and away from its weaknesses (detailed faces, rigging).
3. **Renderer:** try **EEVEE via xvfb + software OpenGL** and **Cycles at low samples with denoising** on one 5-second test shot, measure seconds per frame, then decide. If both are too slow, render at 540×960 and upscale, or ask Jiji whether a GPU machine is available.
4. **Fallback:** three.js in headless Chromium (already on this machine), rendered deterministically. Or Remotion + three.js if we want the 3D and 2D layers in one project.
5. **The same analog data drives both versions,** so the pilot can be compared side by side with its 2D original.

### Not recommended now
- **AI video generators** for any data-carrying shot (can't hold exact speeds or counts; paid; CPU-only container can't run open models).
- **Unity/Unreal** (too heavy, need a GPU and licence sign-in).

### What's in this container and what would need installing
Checked 2026-09-28 **(measured here)**:

| Item | Status |
|---|---|
| Node.js | v22.22.2 installed (`/opt/node22/bin/node`); npm registry reachable |
| FFmpeg | 7.0.2 static build installed |
| Python | 3.11.15 is the default `python3`; **3.12 and 3.13 also present** (`/usr/bin/python3.13`); `pip` and `uv` available; PyPI reachable |
| Headless Chromium | **present**, Playwright's bundle at `/opt/pw-browsers` (chromium-1194 and headless shell), so Remotion/three.js capture is possible without downloading a browser |
| `xvfb-run` (fake screen) | installed |
| GPU | **none** (no `nvidia-smi`); 4 CPU cores, 15 GB RAM, ~29 GB free disk |
| Blender | **not installed.** Options: (1) `pip install bpy==5.2.2` under Python 3.13 (Linux wheel exists on PyPI, several hundred MB); (2) `bpy==4.5.0` wheel for the default Python 3.11 (~370 MB); (3) `apt install blender` gives the older 4.0.2. The official download site (download.blender.org) is **blocked** by this container's network proxy. |
| Manim / Remotion / Revideo / three.js | not installed; all installable from npm/PyPI (Manim needs system Cairo/Pango libraries via apt) |

Nothing was installed for this report. Suggested first install when Phase 6 starts: `bpy` 5.2.2 into a Python 3.13 virtual environment (via `uv`) inside the studio folder, then a 5-second timing test.

---

## Sources (all links used above)
- Anthropic: [Models overview](https://platform.claude.com/docs/en/about-claude/models/overview) · [Vision](https://platform.claude.com/docs/en/build-with-claude/vision) · [Max plan](https://support.claude.com/en/articles/11049741-what-is-the-max-plan)
- METR: [time horizon for Claude Opus 4.6](https://x.com/METR_Evals/status/2024923422867030027) · [Time horizons](https://metr.org/time-horizons/) · [MIT Technology Review explainer](https://www.technologyreview.com/2026/02/05/1132254/this-is-the-most-misunderstood-graph-in-ai/)
- Pricing (weak): [Sentra](https://www.sentra.app/articles/claude-api-pricing) · [Second Talent](https://www.secondtalent.com/resources/every-claude-ai-model-explained-compared/) · [ai-toolbox usage limits](https://www.ai-toolbox.co/claude-management-and-productivity/claude-usage-limits-2026)
- Web stacks: [Remotion licence](https://www.remotion.dev/docs/license/pricing) · [PkgPulse comparison (weak)](https://www.pkgpulse.com/blog/remotion-vs-motion-canvas-vs-revideo-programmatic-video-2026) · [Revideo/Midrender (weak)](https://midrender.com/revideo) · [Manim install docs](https://docs.manim.community/en/stable/installation/conda.html)
- 3D: [Blender Grease Pencil manual](https://docs.blender.org/manual/en/latest/grease_pencil/introduction.html) · [SURF Blender course](https://surf-visualization.github.io/blender-course/basics/rendering_lighting_materials/gpu_rendering/) · [rd-blender-docker EEVEE issue](https://github.com/nytimes/rd-blender-docker/issues/37) · [Godot: Creating movies](https://docs.godotengine.org/en/stable/tutorials/animation/creating_movies.html) · [puppeteer-capture](https://github.com/alexey-pelykh/puppeteer-capture) · [Crow issue #293 (weak)](https://github.com/nibor1896/Crow/issues/293) · [MindStudio on Claude + Blender (weak)](https://www.mindstudio.ai/blog/claude-blender-mcp-real-world-performance) · [blendermcp.org (weak)](https://blendermcp.org/)
- AI generators (all weak/vendor unless noted): [Pinggy](https://pinggy.io/blog/best_video_generation_ai_models/) · [PixVerse](https://pixverse.ai/en/blog/best-ai-video-generators) · [AI Handbook](https://www.aihandbook.io/generative-ai-handbook/ai-video-generation/) · [is4.ai](https://is4.ai/blog/our-blog-1/ai-video-generation-limitations-traditional-methods-2026-357) · [arXiv survey (peer-reviewed-style preprint)](https://arxiv.org/pdf/2510.04999) · [Spheron GPU guide](https://www.spheron.network/blog/ai-video-generation-gpu-guide/) · [LTX blog](https://ltx.io/blog/open-source-video-generation-models-guide) · [Gen NanoBanana](https://gennanobanana.com/guides/ai-reference-images) · [Prompt Architects](https://prompt-architects.com/blog/650-keeping-the-same-character-across-many-images)
