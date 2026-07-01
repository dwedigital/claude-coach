#!/usr/bin/env bash
# Wrapper for garmin_activity.py: loads Garmin creds, runs via uv.
#
# Usage:
#   ./scripts/garmin/pull-activity.sh                       # list today's activities
#   ./scripts/garmin/pull-activity.sh --date 2026-04-20     # list that date
#   ./scripts/garmin/pull-activity.sh --id 18221842604      # full detail for one

set -euo pipefail

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
exec uv run --quiet "$SCRIPT_DIR/garmin_activity.py" "$@"
