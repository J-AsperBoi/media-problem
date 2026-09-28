# `scenes/` — the film recipes (source code)

**What this is:** One JavaScript file per film. Each file is a *recipe*: given a moment in time (e.g. 12.4 seconds in), it says exactly what to draw. The `example_*.js` files came with the project as style samples; every other file is one of the 60 films.

**Why it exists:** Keeping each film in its own file means one film can be changed without risking the others. The recipe is "pure": the same time always draws the same picture, which makes renders repeatable.

**How common is this?** Very common. Almost every project has a folder of source code, usually called `src/`. This project calls it `scenes/` because each file is a scene.

**How other projects differ:** Web apps split code into `components/`, `pages/` and so on. Games use `levels/` or `scenes/` (Unity and Godot use that exact word).

**Learn more:** [What is JavaScript (MDN)](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/What_is_JavaScript) · [The Canvas drawing API these recipes use (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

← Back to the [project map](../README.md) · Finished videos are in [`../output/`](../output/)
