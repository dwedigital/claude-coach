#!/usr/bin/env bash
#
# One-shot bootstrap for a fresh clone. Idempotent — never overwrites
# anything you've already created. The mechanical half of setup; the
# conversational half (profile interview, zones, first plan) is the
# /onboard skill — this script hands you off to it at the end.
#
#   ./scripts/setup.sh                  # bootstrap coach files + checks
#   ./scripts/setup.sh --with-dashboard # also install dashboard deps

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

WITH_DASHBOARD=0
[[ "${1:-}" == "--with-dashboard" ]] && WITH_DASHBOARD=1

ok()   { echo "  ✓ $*"; }
warn() { echo "  ⚠ $*"; }
info() { echo "  → $*"; }

echo "▶ Checking prerequisites"
if command -v claude >/dev/null 2>&1; then
  ok "claude CLI found"
else
  warn "claude CLI not found — install from https://claude.com/claude-code (required)"
fi
if command -v node >/dev/null 2>&1; then
  ok "node $(node --version) found"
else
  warn "node not found — only needed for the optional dashboard"
fi
if command -v uv >/dev/null 2>&1; then
  ok "uv found"
else
  warn "uv not found — only needed for Garmin/Renpho pull scripts (https://docs.astral.sh/uv/)"
fi

echo ""
echo "▶ Bootstrapping coach files (never overwrites)"

if [[ -f coach/athlete/profile.md ]]; then
  ok "coach/athlete/profile.md already exists — leaving it alone"
else
  cp coach/athlete/profile.example.md coach/athlete/profile.md
  ok "created coach/athlete/profile.md from template (the /onboard skill fills it in)"
fi

if [[ -f coach/.env ]]; then
  ok "coach/.env already exists — leaving it alone"
else
  cp coach/.env.example coach/.env
  ok "created coach/.env from template (fill in only the data sources you use — all optional)"
fi

if [[ -f coach/plans/current-plan.md ]]; then
  ok "coach/plans/current-plan.md already exists — leaving it alone"
else
  info "no current plan yet — the /onboard skill offers to build one, or copy an example:"
  for f in coach/plans/examples/*.md; do
    info "    cp $f coach/plans/current-plan.md"
  done
fi

if [[ $WITH_DASHBOARD -eq 1 ]]; then
  echo ""
  echo "▶ Dashboard"
  if [[ -f dashboard/.env.local ]]; then
    ok "dashboard/.env.local already exists"
  else
    cp dashboard/.env.example dashboard/.env.local
    ok "created dashboard/.env.local from template"
  fi
  (cd dashboard && npm install)
  ok "dashboard dependencies installed — run: cd dashboard && npm run dev"
fi

echo ""
echo "✓ Bootstrap complete. Next:"
echo ""
echo "    claude"
echo ""
echo "  then type:  /onboard"
echo ""
echo "  The coach will interview you and write your profile, zones, and first plan."
echo "  (Manual alternative: edit coach/athlete/profile.md yourself — see docs/QUICKSTART.md)"
