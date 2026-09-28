# START HERE: The Bottleneck Is Us

This project is an overnight animation studio. An AI (Claude) researched real historical crises, wrote 78 film ideas and built **60 short vertical animatics** from them. An animatic is a rough draft of an animated film. Every film shows the same race: a red threat spreads while the green pieces of the answer fail to find each other in time.

**What happens next?** See [`ROADMAP.md`](ROADMAP.md).

**Just want to watch the films?** Open [`orchestration-videos/output/MORNING_REPORT.md`](orchestration-videos/output/MORNING_REPORT.md) for the summary and top picks. Each film lives in its own folder under [`orchestration-videos/output/`](orchestration-videos/output/) as a `.mp4` video file.

This page is also a beginner's map of how software projects are organised, so the rest of the project is easier to read.

---

## 1. The big three ideas: repository, commit, branch

Nearly every software project in the world uses these three ideas. They come from a tool called **Git**, and **GitHub** is a website that stores Git projects online.

| Word | Plain meaning | Everyday analogy | Learn more |
|---|---|---|---|
| **Repository** ("repo") | The whole project folder plus its complete history | A shared drive folder that remembers every version of every file | [GitHub: About repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/about-repositories) |
| **Commit** | One saved snapshot of the project, with a short note saying what changed and why | A "save point" in a video game, with a label | [Git book: Recording changes](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository) |
| **Branch** | A separate line of work, so changes can be made without touching the main version | A copy of a document you edit before merging it back into the original | [Git book: Branches in a nutshell](https://git-scm.com/book/en/v2/Git-Branching-Branches-in-a-Nutshell) |

**Where this project stands:** the 60 films are on a branch called `claude/new-session-5458zh`. That name was machine-generated; the branch holds all of tonight's work. The `main` branch still holds only the original uploaded files. GitHub shows `main` by default, so to see the films, pick the branch from the drop-down near the top-left of the GitHub page. Once the work is approved, it would normally be **merged** into `main` (see section 4).

A 10-minute hands-on tutorial covers all three ideas: [GitHub: Hello World](https://docs.github.com/en/get-started/start-your-journey/hello-world).

---

## 2. Map of this project

```
media-problem/                  ← the repository (you are here)
└── orchestration-videos/       ← the studio: everything lives in here
    ├── README.md               ← how to run the studio on a Mac
    ├── CLAUDE.md               ← the creative brief (the "rules of the studio")
    ├── OVERNIGHT_PROMPT.md     ← the instructions the AI followed overnight
    ├── RATES.md                ← the AI-speed numbers, each with a source
    ├── config.json             ← settings (e.g. the web link inside the QR codes)
    ├── package.json            ← the list of software ingredients (see below)
    ├── research/               ← facts: historical data + viral-video research
    ├── scenes/                 ← one recipe file per film (the "source code")
    ├── tools/                  ← the machinery that turns recipes into videos
    ├── output/                 ← the results: one folder per finished film
    ├── fonts/                  ← the two typefaces the films use
    └── landing/                ← a draft web page the QR codes can point to
```

Each folder has its own README explaining it. GitHub shows that README automatically when you open the folder.

### How common is this layout?

These are rough estimates from experience, not a measured statistic.

- **Almost universal (roughly 9 in 10 projects):**
  - a `README.md` at the top;
  - a list of ingredients (`package.json` for JavaScript, `requirements.txt` for Python, and so on);
  - a `.gitignore` file listing what not to save;
  - version history through commits and branches.
- **Very common (most projects):**
  - separating inputs (`research/`) from source code (`scenes/`, `tools/`) and outputs (`output/`);
  - a settings file (`config.json`).
- **Unusual, and specific to this project:**
  - `CLAUDE.md` and `OVERNIGHT_PROMPT.md`, which are instructions written *for an AI worker*. This is a new practice (2024–26) and is growing fast.
  - `output/` is saved in the repository. Most projects do *not* commit large generated files like videos. They regenerate them, or store them with [Git LFS](https://git-lfs.com/) or cloud storage. It's done here so you can watch the films straight from GitHub.

### How the other projects differ

| Kind of project | Typical top-level folders | Example of the pattern |
|---|---|---|
| Web app | `src/` (code), `public/` (images), `tests/` | [Create React App layout](https://create-react-app.dev/docs/folder-structure/) |
| Python library | `src/package_name/`, `tests/`, `docs/` | [Python packaging guide](https://packaging.python.org/en/latest/tutorials/packaging-projects/) |
| Data / research | `data/raw/`, `data/processed/`, `notebooks/`, `reports/` | [Cookiecutter Data Science](https://cookiecutter-data-science.drivendata.org/) |
| Many projects in one repo ("monorepo") | `apps/`, `packages/` | [Monorepo (Wikipedia)](https://en.wikipedia.org/wiki/Monorepo) |

This studio is closest to the **data/research** pattern: raw facts go in, a pipeline processes them, and reports and media come out.

---

## 3. How a film gets made

```
research/analogs/*.json  ──►  scenes/<film>.js  ──►  tools/render.js  ──►  output/<film>/<film>.mp4
   (real historical data)       (the film recipe)      (draws every frame)      (the finished video)
                                       ▲
                          CLAUDE.md rules + tools/lib.js building blocks
```

1. **Research** (`research/`): real timelines, such as how fast a blackout spread and how long people took to respond.
2. **Concept** (`output/CONCEPT_BANK.md`): a one-paragraph idea for a film.
3. **Scene** (`scenes/`): a JavaScript file that describes, frame by frame, what to draw at each moment.
4. **Render** (`tools/render.js`): draws 30 pictures per second and stitches them into a video with [FFmpeg](https://ffmpeg.org/about.html).
5. **Verify** (`tools/verify.js`): an automatic check of the film's length, colours and QR code.
6. **Log** (`output/LEDGER.jsonl`): one line per film with its tags and scores.

In software terms this is a **pipeline**: each stage's output is the next stage's input. It is the most common shape for data and media projects.

---

## 4. How to read the history (commits)

Every change in this project is a commit with a short message. From now on, each commit message starts with a **macro label** in brackets, so you can see at a glance which kind of change it is:

| Label | What kind of change | How common in industry |
|---|---|---|
| `[Docs]` | Explanations and guides like this one; no behaviour changes | Universal |
| `[Research]` | New facts or sources | Common in data projects |
| `[Film]` | A new or updated film | Specific to this project |
| `[Tooling]` | Changes to the machinery in `tools/` | Universal (often called "build" or "chore") |
| `[Cleanup]` | Removing junk or mistakes | Universal |
| `[WIP]` | "Work in progress": a safety save of unfinished work | Common |

The industry-standard version of this idea is called [Conventional Commits](https://www.conventionalcommits.org/), with labels like `feat:`, `fix:` and `docs:`. We use plain-English labels here because they're easier to learn first.

To see the history on GitHub, click **"commits"** (the clock icon) near the top of the file list.

**What's usually next:** when a branch's work is ready, someone opens a **pull request** (a proposal to merge the branch into `main`). Others review it, and then it's merged. See [GitHub: About pull requests](https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests). Nothing has been merged here yet; that's your call.

---

## 5. File types you'll see

| Ending | What it is | Opens in |
|---|---|---|
| `.md` | Markdown: plain text with simple formatting (`#` makes a heading) | GitHub shows it formatted. [Markdown basics](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) |
| `.js` | JavaScript code | A text editor |
| `.json` | Structured data (lists and labelled values) | A text editor. [What is JSON](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/JSON) |
| `.jsonl` | "JSON Lines": one JSON record per line, good for logs | A text editor. [jsonlines.org](https://jsonlines.org/) |
| `.mp4` | Video | GitHub can play small ones; otherwise download it |
| `.png` | Image | Anywhere |
| `.html` | A web page | A browser |
| `.ttf` | A font | Your computer's font viewer |
