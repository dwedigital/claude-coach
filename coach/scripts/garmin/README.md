# Garmin Connect integration

Three scripts:

- **`pull-readiness.sh`** — sleep / HRV / body battery / RHR / training readiness for recovery correlation.
- **`pull-activity.sh`** — list activities for a date, or full detail for one activity (summary + **typed splits** + HR time-in-zones + splits). Use this when reviewing a structured session — `typed_splits` labels each lap as `INTERVAL_WARMUP` / `INTERVAL_ACTIVE` / `INTERVAL_RECOVERY` / `INTERVAL_COOLDOWN`, which Strava cannot tell you. Required for structured swim / run / bike reviews.
- **`push-workouts.sh`** — push a pre-generated workouts JSON file to Garmin Connect (they sync to the watch). Thin wrapper: loads creds, execs `garmin_push.py`. Workout JSON is authored by Claude from `plans/current-plan.md` in-conversation — the wrapper doesn't generate it.

## One-time setup

```bash
# Store credentials (email + password login, no SSO, no MFA)
mkdir -p ~/.claude/channels/garmin
cat > ~/.claude/channels/garmin/.env <<'EOF'
GARMIN_EMAIL=you@example.com
GARMIN_PASSWORD=your-password
EOF
chmod 600 ~/.claude/channels/garmin/.env
```

No pip install needed — all three scripts use `uv` with PEP 723 inline deps.

## Push usage

```bash
# Write workouts JSON first (Claude does this from plans/current-plan.md),
# then push:
./scripts/garmin/push-workouts.sh /tmp/strava-coach-garmin-workouts.json
```

The JSON schema is documented at the top of `garmin_push.py` (warmup / active / recovery / cooldown / repeat; swim / run / bike).

## Pull usage — readiness

```bash
# Today's recovery data, JSON to stdout
./scripts/garmin/pull-readiness.sh

# Specific date
./scripts/garmin/pull-readiness.sh --date 2026-04-20

# Last 7 days + write per-day files to log/garmin/
./scripts/garmin/pull-readiness.sh --last 7 --save
```

## Pull usage — activity

```bash
# List today's activities (find the Garmin activity ID)
./scripts/garmin/pull-activity.sh

# List activities on a specific date
./scripts/garmin/pull-activity.sh --date 2026-04-20

# Full detail for one activity (typed splits + HR time-in-zones + splits)
./scripts/garmin/pull-activity.sh --id 22626947704
```

Typical review flow: list to find the ID, then detail to get the typed splits. Output is JSON on stdout, suitable for piping into downstream analysis.

Session tokens are cached at `~/.claude/channels/garmin/tokens/` after the first successful login, so repeat calls skip re-auth (and avoid Garmin's aggressive login rate limits).

## What's supported

- **Swim** — distance-based steps, drill sets with rest intervals, repeat groups.
- **Run** — time-based WU/CD/intervals with descriptive pace/HR targets in step notes.
- **Bike** — time-based endurance blocks with embedded Z3 segments.
- **Brick** — emitted as two separate workouts (bike + run). Multisport native format is clunky; two workouts is cleaner on the watch.

Strength sessions are skipped — Garmin's structured-workout format doesn't represent them usefully. Follow the plan-file prescription for those.

## Caveats

- **Unofficial API.** `garminconnect` uses Garmin's internal web API; can break when Garmin updates. Rare but possible.
- **No hard targets wired yet.** Pace/HR targets live in the step description so the watch shows them mid-session, but the watch doesn't force you to stay in a zone. Add proper targets later if wanted.
- **MFA not handled.** If you enable MFA on Garmin, login will fail and we'll need a session-token path.
