#!/usr/bin/env bash
#
# Sync code files from the private dev copies into this public template repo.
# NEVER copies personal data (logs, real plans, real profile, credentials).
#
# Run from the claude-coach repo root:
#   ./scripts/sync-from-private.sh --dry-run    # preview
#   ./scripts/sync-from-private.sh              # actually copy
#
# Then review with `git status` + `git diff` before committing.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# --- Configure these paths for your setup ---
COACH_PRIVATE="${COACH_PRIVATE:-$HOME/dwe_os/personal/code/vibe_projects/009_strava_coach}"
DASHBOARD_PRIVATE="${DASHBOARD_PRIVATE:-$HOME/dwe_os/personal/code/vibe_projects/021_coach_dashboard}"

DRY_RUN=0
if [[ "${1:-}" == "--dry-run" ]]; then
  DRY_RUN=1
  echo "▶ DRY RUN — no files will be copied"
fi

log() { echo "  $*"; }
copy() {
  local src="$1" dst="$2"
  if [[ ! -e "$src" ]]; then
    log "SKIP (not found): $src"
    return
  fi
  if [[ $DRY_RUN -eq 1 ]]; then
    log "would copy: ${src#$HOME/} → ${dst#$REPO_ROOT/}"
  else
    mkdir -p "$(dirname "$dst")"
    if [[ -d "$src" ]]; then
      rsync -a --delete \
        --exclude='.env' --exclude='.env.*' \
        --exclude='*.token' --exclude='*.secret' \
        --exclude='tokens/' --exclude='session.json' \
        --exclude='__pycache__/' --exclude='*.pyc' \
        --exclude='node_modules/' --exclude='.next/' --exclude='data/' \
        "$src/" "$dst/"
    else
      cp "$src" "$dst"
    fi
    log "copied: ${src#$HOME/} → ${dst#$REPO_ROOT/}"
  fi
}

echo "▶ Coach — scripts (verbatim)"
copy "$COACH_PRIVATE/scripts/garmin" "$REPO_ROOT/coach/scripts/garmin"
copy "$COACH_PRIVATE/scripts/renpho" "$REPO_ROOT/coach/scripts/renpho"
copy "$COACH_PRIVATE/scripts/weekly-review-prompt.tmpl.md" "$REPO_ROOT/coach/scripts/weekly-review-prompt.tmpl.md"
# weekly-review.sh — has Telegram chat ID + hardcoded paths — needs manual sanitisation, not synced

echo "▶ Coach — CLAUDE.md (SANITISATION REQUIRED — will diff-alert)"
copy "$COACH_PRIVATE/CLAUDE.md" "$REPO_ROOT/coach/CLAUDE.md.PRIVATE"
if [[ $DRY_RUN -eq 0 ]]; then
  log "wrote coach/CLAUDE.md.PRIVATE — manually sanitise then rename to CLAUDE.md"
fi

echo "▶ Coach — shareable reference (swim resources)"
copy "$COACH_PRIVATE/athlete/swim-resources.md" "$REPO_ROOT/coach/athlete/swim-resources.md"

echo "▶ Coach — coaching/ knowledge base (SANITISATION REQUIRED — will diff-alert)"
if [[ -d "$COACH_PRIVATE/coaching" ]]; then
  for f in "$COACH_PRIVATE/coaching"/*.md; do
    [[ -e "$f" ]] || continue
    base="$(basename "$f")"
    copy "$f" "$REPO_ROOT/coach/coaching/${base}.PRIVATE"
  done
  if [[ $DRY_RUN -eq 0 ]]; then
    log "wrote coach/coaching/*.md.PRIVATE — sanitise (athlete name, personal HRV/RHR baselines, race/location specifics, private memory refs) then rename each to *.md"
  fi
fi

echo "▶ Dashboard — code (app, components, lib, scripts, public, config)"
copy "$DASHBOARD_PRIVATE/app" "$REPO_ROOT/dashboard/app"
copy "$DASHBOARD_PRIVATE/components" "$REPO_ROOT/dashboard/components"
copy "$DASHBOARD_PRIVATE/lib" "$REPO_ROOT/dashboard/lib"
copy "$DASHBOARD_PRIVATE/scripts" "$REPO_ROOT/dashboard/scripts"
copy "$DASHBOARD_PRIVATE/public" "$REPO_ROOT/dashboard/public"
copy "$DASHBOARD_PRIVATE/package.json" "$REPO_ROOT/dashboard/package.json"
copy "$DASHBOARD_PRIVATE/tsconfig.json" "$REPO_ROOT/dashboard/tsconfig.json"
copy "$DASHBOARD_PRIVATE/tailwind.config.ts" "$REPO_ROOT/dashboard/tailwind.config.ts"
copy "$DASHBOARD_PRIVATE/postcss.config.mjs" "$REPO_ROOT/dashboard/postcss.config.mjs"
copy "$DASHBOARD_PRIVATE/next.config.mjs" "$REPO_ROOT/dashboard/next.config.mjs"
copy "$DASHBOARD_PRIVATE/next-env.d.ts" "$REPO_ROOT/dashboard/next-env.d.ts"

echo ""
echo "▶ Post-sync sanitisation pass — REQUIRED before commit"
echo ""
echo "  Common hotspots to check:"
echo "    dashboard/lib/paths.ts           — hardcoded absolute path fallbacks"
echo "    dashboard/scripts/sync-all.sh    — hardcoded fallback path"
echo "    dashboard/app/page.tsx           — athlete name → env var (NEXT_PUBLIC_ATHLETE_NAME)"
echo "    dashboard/app/about/page.tsx     — footer credit line"
echo "    coach/CLAUDE.md.PRIVATE          — pronoun pass, name refs, race specifics"
echo "    coach/coaching/*.md.PRIVATE      — name refs, personal HRV/RHR baselines, private memory refs"
echo ""
echo "  Then:"
echo "    1. Rename coach/CLAUDE.md.PRIVATE → coach/CLAUDE.md and coach/coaching/*.md.PRIVATE → *.md after sanitising"
echo "    2. Add your own leak patterns via LEAK_PATTERNS env var"
echo "    3. git status && git diff — review before commit"
echo ""

# Configurable leak patterns. Add your own via:
#   LEAK_PATTERNS='your@email|YourName|12345678' ./scripts/sync-from-private.sh
LEAK_PATTERNS="${LEAK_PATTERNS:-/Users/}"

if [[ $DRY_RUN -eq 0 ]]; then
  echo "▶ Running leak check (patterns: $LEAK_PATTERNS)..."
  hits=$(grep -rn -E "$LEAK_PATTERNS" \
    "$REPO_ROOT/coach" "$REPO_ROOT/dashboard" \
    --include='*.ts' --include='*.tsx' --include='*.py' --include='*.sh' \
    --include='*.md' --include='*.json' --include='*.mjs' \
    --exclude='*.md.PRIVATE' \
    2>/dev/null || true)
  if [[ -n "$hits" ]]; then
    echo ""
    echo "⚠  Personal-data hits still present — MUST fix before commit:"
    echo "$hits"
    echo ""
    exit 1
  else
    echo "  ✓ no personal-data hits in synced code (excluding *.md.PRIVATE staging files)"
  fi
fi

echo ""
echo "✓ sync complete"
