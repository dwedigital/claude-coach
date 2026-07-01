#!/usr/bin/env bash
# Wrapper for pull-weight.py: loads Renpho creds, runs via uv.
#
# Usage:
#   ./scripts/renpho/pull-weight.sh                    # latest reading
#   ./scripts/renpho/pull-weight.sh --last 30          # last 30 days
#   ./scripts/renpho/pull-weight.sh --last 30 --save   # persist per-day JSON

set -euo pipefail

ENV_FILE="$HOME/.claude/channels/renpho/.env"
if [[ ! -f "$ENV_FILE" ]]; then
  cat >&2 <<EOF
ERROR: $ENV_FILE not found.

Create it with your LEGACY Renpho account (renpho.qnclouds.com — NOT Renpho Health):

  mkdir -p ~/.claude/channels/renpho
  cat > ~/.claude/channels/renpho/.env <<'CREDS'
RENPHO_EMAIL=your@email.com
RENPHO_PASSWORD=yourpassword
CREDS
  chmod 600 ~/.claude/channels/renpho/.env

If you only have a Renpho Health account, this integration will not work.
EOF
  exit 1
fi

set -o allexport
# shellcheck source=/dev/null
source "$ENV_FILE"
set +o allexport

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec uv run --quiet "$SCRIPT_DIR/pull-weight.py" "$@"
