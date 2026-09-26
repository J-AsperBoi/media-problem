# Analog data file schema

One file per historical analog: `research/analogs/<id>.json`. Scenes load it with `L.loadAnalog('<id>')`. Every numeric field needs a source in `sources`; set `"verified": false` on anything not yet confirmed, and never put unverified numbers on screen.

```json
{
  "id": "blackout-2003",
  "threat_internal_label": "grid cascade (never shown on screen)",
  "analog": "2003 Northeast blackout",
  "time_unit": "hours",
  "sources": [{"key": "s1", "title": "...", "url": "...", "accessed": "2026-09-27"}],

  "threat": {
    "model": "logistic | timeline",
    "doubling_time": 0.5,
    "points": [{"t": 0, "extent": 0.001, "src": "s1"}, {"t": 3, "extent": 0.9, "src": "s1"}],
    "notes": "extent = share of the affected population/system, 0..1"
  },

  "solution": {
    "fragments": [
      {"id": "f1", "who": "operators at one utility", "had": "the warning data", "ready_at": 0, "src": "s1"}
    ],
    "aggregation": {"median": 72, "p10": 20, "p90": 400, "src": "s1", "notes": "time for fragments to connect and act, with real spread"},
    "deploy": {"median": 24, "src": "s1"}
  },

  "ai_counterfactual": {
    "aggregation_median": 0.5,
    "basis": "which RATES.md entries and what reasoning",
    "label": "illustrative"
  },

  "verified": true,
  "gap_summary": "one line: how much faster the threat moved than the solution aggregated"
}
```

`t` values are in `time_unit` from the start of the event. Use `L.mapTime(t, analog, filmSeconds)` to place them on screen with one stated mapping.
