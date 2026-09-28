# `research/analogs/` — one data file per historical event

**What this is:** Ten `.json` files, one per event: the 2003 blackout, COVID-19, the 2008 financial crisis, and so on. Each one records how fast the threat spread, which pieces of the answer already existed, how long people took to connect them, and an *illustrative* AI-speed version. `SCHEMA.md` describes the required shape of each file.

**Why it exists:** A fixed shape, called a **schema**, lets every film read any event the same way. Anything unconfirmed is marked `"verified": false`, and those numbers are never shown on screen.

**How common is this?** Schemas are universal in software (databases, APIs, forms). Writing one as a plain `SCHEMA.md` is the lightweight version. Big projects use formal tools such as JSON Schema.

**How other projects differ:** Production systems keep this kind of data in a database rather than in files.

**Learn more:** [JSON Schema: getting started](https://json-schema.org/learn/getting-started-step-by-step)

← Back to the [project map](../README.md)
