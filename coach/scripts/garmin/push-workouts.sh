#!/usr/bin/env bash
# Wrapper for garmin_push.py: loads Garmin creds, runs via uv.
#
# Input: a JSON file describing one or more workouts (schema documented in
# garmin_push.py). In the coach workflow, Claude writes this JSON directly
# from the active plan — no interactive prompt, no claude-p subprocess.
#
# Usage:
#   ./scripts/garmin/push-workouts.sh /tmp/strava-coach-garmin-workouts.json

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $(basename "$0") <workouts.json>" >&2
  exit 1
fi

ENV_FILE="$HOME/.claude/channels/garmin/.env"
if [[ ! -f "$ENV_FILE" ]]; then
  echo "ERROR: $ENV_FILE not found. Expected GARMIN_EMAIL and GARMIN_PASSWORD." >&2
  exit 1
fi

set -o allexport
# shellcheck source=/dev/null
source "$ENV_FILE"
set +o allexport

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec uv run --quiet "$SCRIPT_DIR/garmin_push.py" "$@"
