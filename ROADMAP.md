# Roadmap: what happens next, and why

_Approved by Jiji on 2026-09-28. The plain-language reason for each step is included, so you can follow the "why" as well as the "what"._

## The big idea: stop making whole films; make building blocks first

Round one built 60 complete films, at about 140,000 tokens each. That is expensive and slow to steer: to try one idea you pay for a whole film.

Round two works the way most film studios and game studios work. They first build a **library of small reusable pieces**: shots, moves, characters. Then they assemble films from those pieces. You pick the pieces you like on a review page, so each new version costs a fraction of a full film.

In software this is called **modularity**: small, tested parts that combine. It is one of the most common principles in engineering. ([Wikipedia: Modular programming](https://en.wikipedia.org/wiki/Modular_programming))

## Phases

### Phase 1: First principles (research, cheap). *In progress.*
1. **What can the tools actually do?** Research what Claude and other AI models can and can't do for animation, 3D, video and sound, and which pipelines exist: 2D code-drawn (what we use now), 3D (e.g. Blender, driven by code), AI video generators, and game engines. Output: `research/CAPABILITIES.md`.
2. **The grammar of film.** Break film into its smallest adjustable features: shot size, camera moves, pacing, cuts, colour, sound cues, text timing and character acting. For each one, what effect it has on a viewer, with sources. Output: `research/FILM_GRAMMAR.md`.
3. **People misusing AI, with real speeds.** Find sourced data on how fast harmful uses of AI spread, such as AI-generated false content, voice-clone scams and automated attacks. These become new red threats. Output: new files in `research/analogs/`.
4. **Brief updated (done):** AI is never the villain. The danger is people's choices in how they use it.

### Phase 2: The snippet lab (small, fast, cheap)
- **One central character**, a single recognisable person, reused across everything so viewers connect with an individual.
- **About 30 short snippets (3–5 s each)**, each isolating one feature from the film grammar: a fast push-in, a crane-up reveal, a freeze, a match cut, a slow dread hold, and so on.
- These become the reusable **scene kit** (proposal #2).

### Phase 3: The review page (proposal #4)
- A private web page that shows the snippets and films.
- You tap 👍/👎, pick features ("more of this camera move, this character, this pace") and leave comments. I read them directly.
- Your picks become the recipe for the next films, so we stop guessing.

### Phase 4: Quality machinery (proposals #1, #3)
- **Automatic render checks:** measure label sizes, safe zones, the count of numbers on screen and the illustrative labels, and reject bad renders before anyone watches them.
- **Model-split test:** a cheaper model drafts, and this model reviews. Test on 3 films, compare cost and quality, then decide.

### Phase 5: New films (AI-misuse theme, all three options)
- **"Same tool, two hands":** one person uses AI to connect the green pieces; another uses the same speed to spread the red.
- **Misuse as the red threat,** using the Phase 1 research.
- All built from the snippet kit and your review-page picks.

### Phase 6: Out into the world (proposals #6–9)
- Polish the top 5 films.
- **Real-world test:** post 5–10 films and compare real views with the estimates. *This needs the real landing-page URL from you.*
- **3D pilot:** one film rebuilt in 3D, using the pipeline chosen in Phase 1.
- **Stronger honest "snap":** better sourced evidence for the AI-speed comparison.

## What needs you
| When | What |
|---|---|
| Any time | The real web address for the QR codes (`config.json`) |
| Phase 3 | Reviewing snippets on the review page (about 10 minutes per round) |
| Phase 6 | Posting films, or approving where they get posted |
| Any time | Whether to move this work into `main` so GitHub shows it first |
