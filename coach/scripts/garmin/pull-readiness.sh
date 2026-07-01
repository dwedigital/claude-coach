#!/usr/bin/env bash
# Wrapper for garmin_pull.py: loads Garmin creds, runs via uv.
#
# Usage:
#   ./scripts/garmin/pull-readiness.sh                 # today
#   ./scripts/garmin/pull-readiness.sh --date 2026-04-20
#   ./scripts/garmin/pull-readiness.sh --last 7 --save

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
exec uv run --quiet "$SCRIPT_DIR/garmin_pull.py" "$@"
