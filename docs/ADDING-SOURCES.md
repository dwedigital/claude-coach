# Adding a Data Source

Coach Claude ships with adapters for Strava, Garmin, Eight Sleep, and Renpho. Anything else — Whoop, Oura, Fitbit, Apple Health, a custom API — is a matter of writing three small pieces.

## The pattern

Every data source has three touchpoints:

| Layer | Purpose | Lives in |
|-------|---------|----------|
| **1. Puller** | Fetches from the source, writes JSON to disk | `coach/scripts/<name>/` |
| **2. Loader** | Reads that JSON into typed objects | `dashboard/lib/<name>.ts` |
| **3. Card** | Renders it on the dashboard | `dashboard/components/<Name>Card.tsx` |

Coach Claude (the terminal coach) just needs (1) — it reads JSON directly. The dashboard needs (2) and (3) to visualise.

## Step by step — imagine adding **Oura ring**

### 1. The puller — `coach/scripts/oura/pull-sleep.sh`

Mirrors the existing Renpho/Garmin pattern.

```bash
#!/usr/bin/env bash
set -euo pipefail

ENV_FILE="$HOME/.claude/channels/oura/.env"
[[ -f "$ENV_FILE" ]] || { echo "Missing $ENV_FILE" >&2; exit 1; }

set -o allexport
source "$ENV_FILE"
set +o allexport

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec uv run --quiet "$SCRIPT_DIR/pull-sleep.py" "$@"
```

And `pull-sleep.py` — a `uv run` script with inline PEP 723 deps:

```python
# /// script
# requires-python = ">=3.11"
# dependencies = ["httpx>=0.27.0"]
# ///
import os, json, sys
from datetime import datetime, timezone
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
LOG_DIR = REPO_ROOT / "log" / "oura"

def main():
    token = os.environ.get("OURA_TOKEN")
    if not token:
        print("ERROR: OURA_TOKEN not set", file=sys.stderr); sys.exit(1)

    # Fetch from Oura API
    # ...
    # Write per-day JSON to log/oura/YYYY-MM-DD.json

if __name__ == "__main__":
    main()
```

**Contract:**
- Reads credentials from env vars (never argv)
- Writes to `coach/log/<source>/YYYY-MM-DD.json`
- Exits non-zero on any error, prints the error to stderr
- Supports `--last N` to backfill N recent days

### 2. The loader — `dashboard/lib/oura.ts`

```typescript
import fs from "node:fs";
import path from "node:path";
import { OURA_DIR } from "./paths";

export interface OuraReading {
  date: string;
  hrv: number | null;
  readiness: number | null;
  sleep_score: number | null;
}

export function loadOuraReadings(): OuraReading[] {
  if (!fs.existsSync(OURA_DIR)) return [];
  return fs
    .readdirSync(OURA_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort()
    .map((f) => {
      const raw = JSON.parse(fs.readFileSync(path.join(OURA_DIR, f), "utf8"));
      return {
        date: raw.date,
        hrv: raw.hrv ?? null,
        readiness: raw.readiness ?? null,
        sleep_score: raw.sleep_score ?? null,
      };
    });
}
```

Add `OURA_DIR` to `dashboard/lib/paths.ts`:

```typescript
export const OURA_DIR = path.join(COACH_PROJECT_PATH, "log/oura");
```

### 3. The card — `dashboard/components/OuraCard.tsx`

Reuse the existing `TrendChart` component:

```typescript
import { TrendChart } from "./TrendChart";
import { OuraReading } from "@/lib/oura";

export function OuraCard({ readings }: { readings: OuraReading[] }) {
  const data = readings.map((r) => ({ date: r.date.slice(5), primary: r.hrv }));
  const current = readings[readings.length - 1]?.hrv;
  return (
    <TrendChart
      title="Oura HRV"
      subtitle="Ring HRV · 28d"
      data={data}
      primaryLabel="HRV"
      current={current}
      unit="ms"
    />
  );
}
```

Then wire it into `dashboard/app/page.tsx`:

```typescript
import { OuraCard } from "@/components/OuraCard";
import { loadOuraReadings } from "@/lib/oura";
// ...
const ouraReadings = loadOuraReadings();
// ...
<OuraCard readings={ouraReadings} />
```

### 4. (Optional) Wire into `sync-all.sh`

Add to `dashboard/scripts/sync-all.sh`:

```bash
echo "▶ Oura sync"
if [[ -x "$COACH_PATH/scripts/oura/pull-sleep.sh" ]]; then
  "$COACH_PATH/scripts/oura/pull-sleep.sh" --last 1 --save > /dev/null || echo "  oura pull failed"
fi
```

Now the dashboard's Sync button pulls Oura too.

## Design principles for adapters

- **Fail soft.** Your source failing shouldn't kill the sync. Always exit non-zero but let downstream handle it.
- **Reuse `TrendChart`.** For simple time-series widgets, there's no need for a bespoke component. The shared chart handles theming, tooltips, deltas, units, precision.
- **One file per day.** Keeps the log directory git-diff-friendly and lets the dashboard load only what it needs.
- **Env vars, not config.** All credentials in `~/.claude/channels/<source>/.env` or `coach/.env` — never in code, never in argv.
- **Optional by design.** A missing source shouldn't hard-fail the loader — return an empty array and let the card render a "no data yet" state.

## Sources with known adapters in the ecosystem

If someone has already written a Python client for the source you want, you're 80% done — just wrap it in the puller pattern above.

- **Whoop** — [python-whoop](https://github.com/whoop-community/whoop-python) (unofficial)
- **Oura** — official REST API + [oura-ring](https://pypi.org/project/oura-ring/)
- **Fitbit** — official OAuth API + [fitbit-python](https://github.com/orcasgit/python-fitbit)
- **Apple Health** — via [Health Auto Export](https://www.healthyapps.dev/health-auto-export) CSV → parse to JSON
- **Withings scales** — official OAuth API + [withings-api](https://pypi.org/project/withings-api/)

## Sharing your adapter

If you build one that others might want, please open a PR — even if it's just the puller script. Adapters live under `coach/scripts/<source>/` and are self-contained.
