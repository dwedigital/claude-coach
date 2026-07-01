#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

echo "▶ Strava sync"
npx tsx scripts/sync-strava.ts

echo "▶ Eight Sleep sync"
npx tsx scripts/sync-eightsleep.ts

echo "▶ Garmin readiness (uses coach existing auth)"
COACH_PATH="${COACH_PROJECT_PATH:-$(cd "$(dirname "$0")/../../coach" && pwd)}"
if [[ -x "$COACH_PATH/scripts/garmin/pull-readiness.sh" ]]; then
  "$COACH_PATH/scripts/garmin/pull-readiness.sh" --last 1 --save || echo "  garmin pull failed (token may be stale)"
fi

echo "▶ Renpho body composition"
if [[ -x "$COACH_PATH/scripts/renpho/pull-weight.sh" ]]; then
  "$COACH_PATH/scripts/renpho/pull-weight.sh" --last 3 --save > /dev/null || echo "  renpho pull failed (check ~/.claude/channels/renpho/.env)"
fi

echo "✓ Sync complete $(date)"
