#!/usr/bin/env bash
# Overnight runner. Loops Claude Code in headless mode; when usage runs out, waits and retries.
# Usage:  caffeinate -i ./run_overnight.sh        (caffeinate keeps a Mac awake)
# Options (env vars): STOP_HOUR=8  WAIT_MIN=120  MAX_ROUNDS=20  MAX_TURNS=250
set -u
cd "$(dirname "$0")"
STOP_HOUR=${STOP_HOUR:-8}; WAIT_MIN=${WAIT_MIN:-120}; MAX_ROUNDS=${MAX_ROUNDS:-20}; MAX_TURNS=${MAX_TURNS:-250}

# Never bill pay-per-token API credits: force Claude Code to use your subscription login.
unset ANTHROPIC_API_KEY

mkdir -p logs output
count_videos(){ find output -name '*.mp4' | wc -l | tr -d ' '; }
round=0
while [ "$round" -lt "$MAX_ROUNDS" ]; do
  h=$((10#$(date +%H)))
  if [ "$h" -ge "$STOP_HOUR" ] && [ "$h" -lt 18 ]; then echo "$(date): morning, stopping."; break; fi
  round=$((round+1)); before=$(count_videos); log="logs/round_${round}_$(date +%H%M).log"
  echo "$(date): round $round starting ($before videos so far)"
  claude -p "$(cat OVERNIGHT_PROMPT.md)" \
    --max-turns "$MAX_TURNS" \
    --allowedTools "Bash,Read,Write,Edit,Glob,Grep,Task,Agent,WebSearch,WebFetch" \
    > "$log" 2>&1
  after=$(count_videos)
  echo "$(date): round $round ended ($after videos)"
  if grep -qiE "usage limit|limit reached|rate.?limit|out of credit|credit balance|resets at" "$log" || [ "$after" -le "$before" ]; then
    echo "$(date): usage limit or no progress. Sleeping ${WAIT_MIN} minutes."
    sleep $((WAIT_MIN*60))
  fi
done
node tools/gallery.js
echo "$(date): done. Open output/index.html and output/MORNING_REPORT.md"
