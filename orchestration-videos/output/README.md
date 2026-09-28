# `output/` — the finished films

**What this is:** one folder per film. Each holds:
- the video (`<name>.mp4`);
- `notes.md`: the plan, the math behind the speeds, the shot list, a note on how to build it in 3D, and scores;
- `poster.png`: the thumbnail;
- `contact_sheet.png`: a grid of stills from the film.

The loose files here are the project's reports:

| File | What it is |
|---|---|
| [`MORNING_REPORT.md`](MORNING_REPORT.md) | **Read this first.** The summary, top picks and open questions |
| [`CONCEPT_BANK.md`](CONCEPT_BANK.md) | All 78 film ideas, built or not |
| `concepts.js` / `concepts.json` | The same ideas as data the tools can read |
| `LEDGER.jsonl` | One line per finished film with its tags and scores (a log) |
| `index.html` | A viewing page for every film. Download the folder and open it in a browser |

**Why it exists:** keeping outputs separate from source code (`../scenes/`) means you can always delete and regenerate them.

**How common is this?** Almost every project has an output folder (`dist/`, `build/` or `out/`). **Unusual here:** these outputs are *saved in the repository*. Most projects exclude big generated files (via `.gitignore`) or store them with [Git LFS](https://git-lfs.com/). They are saved here so you can watch the films directly on GitHub.

**Learn more:** [Ignoring files (GitHub)](https://docs.github.com/en/get-started/getting-started-with-git/ignoring-files)

← Back to the [project map](../../README.md)

## Film index

The index lists all 60 finished films, sorted by estimated chance of reaching 100k views. The folder name (the "slug") is the short internal name; the bold title is what appears on screen. *Virality* is a harsh guess at the chance of passing 100,000 views. *Overall* is the average self-score out of 10.

| On-screen title | Folder | Story structure | Art style | Historical event | Virality | Overall |
|---|---|---|---|---|---|---|
| **Nine People, Forty Messages** | [`nine-people-forty-messages`](nine-people-forty-messages/) · [video](nine-people-forty-messages/nine-people-forty-messages.mp4) · [notes](nine-people-forty-messages/notes.md) | pov | text-only typography | heatwave-2003 | 10% | 7.0 |
| **Eight Billion Heads** | [`eight-billion-heads`](eight-billion-heads/) · [video](eight-billion-heads/eight-billion-heads.mp4) · [notes](eight-billion-heads/notes.md) | man-in-a-hole | x-ray | covid-2020 | 9% | 7.4 |
| **The Storm Doc** | [`the-storm-doc`](the-storm-doc/) · [video](the-storm-doc/the-storm-doc.mp4) · [notes](the-storm-doc/notes.md) | nature-documentary | particle/data | quebec-1989 | 9% | 7.3 |
| **The Truth Loop** | [`the-truth-loop`](the-truth-loop/) · [video](the-truth-loop/the-truth-loop.mp4) · [notes](the-truth-loop/notes.md) | seamless-loop | ink wash | false-news-2018 | 9% | 7.1 |
| **Recipe for a Worm (slug: recipe-for-a-worm)** | [`recipe-for-a-worm`](recipe-for-a-worm/) · [video](recipe-for-a-worm/recipe-for-a-worm.mp4) · [notes](recipe-for-a-worm/notes.md) | recipe-parody | 8-bit | wannacry-2017 | 9% | 6.9 |
| **Keep the Lights (slug: keep-the-lights)** | [`keep-the-lights`](keep-the-lights/) · [video](keep-the-lights/keep-the-lights.mp4) · [notes](keep-the-lights/notes.md) | wait-for-it | shadow puppet | blackout-2003 | 8% | 7.6 |
| **The Fact-Check** | [`the-fact-check`](the-fact-check/) · [video](the-fact-check/the-fact-check.mp4) · [notes](the-fact-check/notes.md) | powers-of-ten-zoom | particle/data | false-news-2018 | 8% | 7.4 |
| **The Heat Map** | [`the-heat-map`](the-heat-map/) · [video](the-heat-map/the-heat-map.mp4) · [notes](the-heat-map/notes.md) | powers-of-ten-zoom | topographic map | heatwave-2003 | 8% | 7.4 |
| **Six to Twelve Hours** | [`six-to-twelve-hours`](six-to-twelve-hours/) · [video](six-to-twelve-hours/six-to-twelve-hours.mp4) · [notes](six-to-twelve-hours/notes.md) | two-phones | text-only typography | cuban-missile-1962 | 8% | 7.3 |
| **The Committee in My Head** | [`the-committee-in-my-head`](the-committee-in-my-head/) · [video](the-committee-in-my-head/the-committee-in-my-head.mp4) · [notes](the-committee-in-my-head/notes.md) | countdown-list | bean cartoon | false-news-2018 | 8% | 7.3 |
| **The Hum (slug: the-hum)** | [`the-hum`](the-hum/) · [video](the-hum/the-hum.mp4) · [notes](the-hum/notes.md) | seamless-loop | particle/data | blackout-2003 | 8% | 7.3 |
| **The Crash Call** | [`the-crash-call`](the-crash-call/) · [video](the-crash-call/the-crash-call.mp4) · [notes](the-crash-call/notes.md) | sports-play-by-play | isometric | gfc-2008 | 8% | 7.1 |
| **The Ballroom** | [`the-ballroom`](the-ballroom/) · [video](the-ballroom/the-ballroom.mp4) · [notes](the-ballroom/notes.md) | seamless-loop | paper cutout | quebec-1989 | 8% | 7.1 |
| **Half a Lifeline** | [`half-a-lifeline`](half-a-lifeline/) · [video](half-a-lifeline/half-a-lifeline.mp4) · [notes](half-a-lifeline/notes.md) | two-phones | shadow puppet | gfc-2008 | 8% | 7.1 |
| **The Two Feeds** | [`the-two-feeds`](the-two-feeds/) · [video](the-two-feeds/the-two-feeds.mp4) · [notes](the-two-feeds/notes.md) | two-phones | text-only typography | false-news-2018 | 8% | 7.0 |
| **The Migration** | [`the-migration`](the-migration/) · [video](the-migration/the-migration.mp4) · [notes](the-migration/notes.md) | nature-documentary | ink wash | rice-2008 | 8% | 7.0 |
| **The Numb Hand (slug: the-numb-hand)** | [`the-numb-hand`](the-numb-hand/) · [video](the-numb-hand/the-numb-hand.mp4) · [notes](the-numb-hand/notes.md) | reverse-chronology | bean cartoon | blackout-2003 | 8% | 7.0 |
| **The Arms Race** | [`the-arms-race`](the-arms-race/) · [video](the-arms-race/the-arms-race.mp4) · [notes](the-arms-race/notes.md) | split-screen-race | neon arcade | penicillin-resistance-1946 | 8% | 7.0 |
| **The Warning Memo** | [`the-warning-memo`](the-warning-memo/) · [video](the-warning-memo/the-warning-memo.mp4) · [notes](the-warning-memo/notes.md) | mockumentary | constructivist poster | quebec-1989 | 8% | 7.0 |
| **Recipe for a Shortage** | [`recipe-for-a-shortage`](recipe-for-a-shortage/) · [video](recipe-for-a-shortage/recipe-for-a-shortage.mp4) · [notes](recipe-for-a-shortage/notes.md) | recipe-parody | chalkboard | rice-2008 | 8% | 6.7 |
| **The Stacks** | [`the-stacks`](the-stacks/) · [video](the-stacks/the-stacks.mp4) · [notes](the-stacks/notes.md) | based-on-a-true-story | woodblock | penicillin-resistance-1946 | 7% | 7.3 |
| **Seven Minutes (slug: seven-minutes)** | [`seven-minutes`](seven-minutes/) · [video](seven-minutes/seven-minutes.mp4) · [notes](seven-minutes/notes.md) | ticking-clock | isometric | blackout-2003 | 7% | 7.3 |
| **One in Eight (slug: one-in-eight)** | [`one-in-eight`](one-in-eight/) · [video](one-in-eight/one-in-eight.mp4) · [notes](one-in-eight/notes.md) | countdown-list | constructivist poster | penicillin-resistance-1946 | 7% | 7.3 |
| **The Matchmaker** | [`the-matchmaker`](the-matchmaker/) · [video](the-matchmaker/the-matchmaker.mp4) · [notes](the-matchmaker/notes.md) | powers-of-ten-zoom | blueprint | rice-2008 | 7% | 7.3 |
| **The Mind Grid** | [`the-mind-grid`](the-mind-grid/) · [video](the-mind-grid/the-mind-grid.mp4) · [notes](the-mind-grid/notes.md) | split-screen-race | x-ray | quebec-1989 | 7% | 7.1 |
| **Nineteen Days** | [`nineteen-days`](nineteen-days/) · [video](nineteen-days/nineteen-days.mp4) · [notes](nineteen-days/notes.md) | ticking-clock | x-ray | heatwave-2003 | 7% | 7.1 |
| **Any Percent** | [`vaccine-speedrun`](vaccine-speedrun/) · [video](vaccine-speedrun/vaccine-speedrun.mp4) · [notes](vaccine-speedrun/notes.md) | game-hud-run | neon arcade | covid-2020 | 7% | 7.1 |
| **The Rumor, Rewound** | [`the-rumor-rewound`](the-rumor-rewound/) · [video](the-rumor-rewound/the-rumor-rewound.mp4) · [notes](the-rumor-rewound/notes.md) | reverse-chronology | chalkboard | false-news-2018 | 7% | 7.1 |
| **The Switchboard (slug: the-switchboard)** | [`the-switchboard`](the-switchboard/) · [video](the-switchboard/the-switchboard.mp4) · [notes](the-switchboard/notes.md) | pov | stick-figure animatic | blackout-2003 | 7% | 7.1 |
| **The Long Season (slug: the-long-season)** | [`the-long-season`](the-long-season/) · [video](the-long-season/the-long-season.mp4) · [notes](the-long-season/notes.md) | sports-play-by-play | stained glass | penicillin-resistance-1946 | 7% | 7.1 |
| **The Reference Desk** | [`the-reference-desk`](the-reference-desk/) · [video](the-reference-desk/the-reference-desk.mp4) · [notes](the-reference-desk/notes.md) | wait-for-it | children's-book flat | false-news-2018 | 7% | 7.1 |
| **The Mold Strikes Back** | [`the-mold-strikes-back`](the-mold-strikes-back/) · [video](the-mold-strikes-back/the-mold-strikes-back.mp4) · [notes](the-mold-strikes-back/notes.md) | nature-documentary | x-ray | penicillin-resistance-1946 | 7% | 7.0 |
| **The Balcony** | [`the-balcony`](the-balcony/) · [video](the-balcony/the-balcony.mp4) · [notes](the-balcony/notes.md) | pov | shadow puppet | heatwave-2003 | 7% | 7.0 |
| **The Contagion Atlas** | [`the-contagion-atlas`](the-contagion-atlas/) · [video](the-contagion-atlas/the-contagion-atlas.mp4) · [notes](the-contagion-atlas/notes.md) | man-in-a-hole | stained glass | gfc-2008 | 7% | 7.0 |
| **One by One (slug: the-worm; on-screen title never uses the slug)** | [`the-worm`](the-worm/) · [video](the-worm/the-worm.mp4) · [notes](the-worm/notes.md) | pov | blueprint | wannacry-2017 | 7% | 7.0 |
| **Before the Price** | [`before-the-price`](before-the-price/) · [video](before-the-price/before-the-price.mp4) · [notes](before-the-price/notes.md) | before-after | children's-book flat | rice-2008 | 7% | 7.0 |
| **Cracks in the Map** | [`cracks-in-the-map`](cracks-in-the-map/) · [video](cracks-in-the-map/cracks-in-the-map.mp4) · [notes](cracks-in-the-map/notes.md) | nature-documentary | topographic map | gfc-2008 | 7% | 7.0 |
| **The Department of Later** | [`the-department-of-later`](the-department-of-later/) · [video](the-department-of-later/the-department-of-later.mp4) · [notes](the-department-of-later/notes.md) | mockumentary | bean cartoon | gfc-2008 | 7% | 6.9 |
| **Lights of Ontario** | [`lights-of-ontario`](lights-of-ontario/) · [video](lights-of-ontario/lights-of-ontario.mp4) · [notes](lights-of-ontario/notes.md) | seamless-loop | subway map | blackout-2003 | 7% | 6.9 |
| **Wall of Ice** | [`wall-of-ice`](wall-of-ice/) · [video](wall-of-ice/wall-of-ice.mp4) · [notes](wall-of-ice/notes.md) | based-on-a-true-story | paper cutout | quebec-1989 | 7% | 6.9 |
| **Before the Dark** | [`before-the-dark`](before-the-dark/) · [video](before-the-dark/before-the-dark.mp4) · [notes](before-the-dark/notes.md) | before-after | woodblock | blackout-2003 | 7% | 6.7 |
| **Two Skies, One Clock  (slug: seventeen-days)** | [`seventeen-days`](seventeen-days/) · [video](seventeen-days/seventeen-days.mp4) · [notes](seventeen-days/notes.md) | split-screen-race | particle/data | covid-2020 | 7% | 6.7 |
| **The Rice Committee** | [`the-rice-committee`](the-rice-committee/) · [video](the-rice-committee/the-rice-committee.mp4) · [notes](the-rice-committee/notes.md) | mockumentary | stick-figure animatic | rice-2008 | 7% | 6.7 |
| **Fifty-Nine Days** | [`fifty-nine-days`](fifty-nine-days/) · [video](fifty-nine-days/fifty-nine-days.mp4) · [notes](fifty-nine-days/notes.md) | game-hud-run | 8-bit | wannacry-2017 | 7% | 6.6 |
| **The Window (ghost-rewind-covid)** | [`ghost-rewind-covid`](ghost-rewind-covid/) · [video](ghost-rewind-covid/ghost-rewind-covid.mp4) · [notes](ghost-rewind-covid/notes.md) | ghost-rewind | stained glass | covid-2020 | 6% | 7.3 |
| **The Cure, Before and After** | [`the-cure-before-after`](the-cure-before-after/) · [video](the-cure-before-after/the-cure-before-after.mp4) · [notes](the-cure-before-after/notes.md) | before-after | stick-figure animatic | penicillin-resistance-1946 | 6% | 7.1 |
| **The Ghost Line (slug: ghost-hotline)** | [`ghost-hotline`](ghost-hotline/) · [video](ghost-hotline/ghost-hotline.mp4) · [notes](ghost-hotline/notes.md) | ghost-rewind | ink wash | cuban-missile-1962 | 6% | 7.1 |
| **The Interpreter** | [`the-interpreter`](the-interpreter/) · [video](the-interpreter/the-interpreter.mp4) · [notes](the-interpreter/notes.md) | game-hud-run | embroidery | cuban-missile-1962 | 6% | 7.1 |
| **Fifteen Hundred** | [`fifteen-hundred`](fifteen-hundred/) · [video](fifteen-hundred/fifteen-hundred.mp4) · [notes](fifteen-hundred/notes.md) | split-screen-race | neon arcade | false-news-2018 | 6% | 7.0 |
| **Rewind (slug: the-worm-rewind)** | [`the-worm-rewind`](the-worm-rewind/) · [video](the-worm-rewind/the-worm-rewind.mp4) · [notes](the-worm-rewind/notes.md) | ghost-rewind | subway map | wannacry-2017 | 6% | 7.0 |
| **Day 305** | [`day-three-hundred-five`](day-three-hundred-five/) · [video](day-three-hundred-five/day-three-hundred-five.mp4) · [notes](day-three-hundred-five/notes.md) | reverse-chronology | children's-book flat | heatwave-2003 | 6% | 6.9 |
| **The Relay** | [`the-relay`](the-relay/) · [video](the-relay/the-relay.mp4) · [notes](the-relay/notes.md) | sports-play-by-play | constructivist poster | wannacry-2017 | 6% | 6.9 |
| **The Orchestra** | [`the-orchestra`](the-orchestra/) · [video](the-orchestra/the-orchestra.mp4) · [notes](the-orchestra/notes.md) | wait-for-it | ink wash | heatwave-2003 | 6% | 6.9 |
| **Two Days** | [`two-days`](two-days/) · [video](two-days/two-days.mp4) · [notes](two-days/notes.md) | based-on-a-true-story | ink wash | covid-2020 | 6% | 6.7 |
| **Ninety Seconds** | [`ninety-seconds`](ninety-seconds/) · [video](ninety-seconds/ninety-seconds.mp4) · [notes](ninety-seconds/notes.md) | wait-for-it | topographic map | quebec-1989 | 6% | 6.7 |
| **The Warehouse** | [`the-warehouse`](the-warehouse/) · [video](the-warehouse/the-warehouse.mp4) · [notes](the-warehouse/notes.md) | man-in-a-hole | paper cutout | rice-2008 | 6% | 6.7 |
| **The Hold Music** | [`the-hold-music`](the-hold-music/) · [video](the-hold-music/the-hold-music.mp4) · [notes](the-hold-music/notes.md) | wait-for-it | bean cartoon | cuban-missile-1962 | 6% | 6.7 |
| **The Last Crate** | [`the-last-crate`](the-last-crate/) · [video](the-last-crate/the-last-crate.mp4) · [notes](the-last-crate/notes.md) | ticking-clock | woodblock | covid-2020 | 6% | 6.7 |
| **The Last Thirteen Days** | [`the-last-thirteen-days`](the-last-thirteen-days/) · [video](the-last-thirteen-days/the-last-thirteen-days.mp4) · [notes](the-last-thirteen-days/notes.md) | ticking-clock | blueprint | cuban-missile-1962 | 5% | 6.7 |
| **Three Things We Already Had (slug: ten-things-in-the-drawer)** | [`ten-things-in-the-drawer`](ten-things-in-the-drawer/) · [video](ten-things-in-the-drawer/ten-things-in-the-drawer.mp4) · [notes](ten-things-in-the-drawer/notes.md) | countdown-list | embroidery | gfc-2008 | 4% | 6.9 |

**Not yet rendered:** [`the-green-screen`](the-green-screen/). Its scene and notes are written but it has never been run. See the morning report.
