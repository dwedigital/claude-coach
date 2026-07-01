# Architecture

## The one-page picture

```
   Strava            Eight Sleep          Garmin             Renpho
      \                   |                  |                  /
       \                  |                  |                 /
        \                 |                  |                /
         └────────────────┴──────┬───────────┴───────────────┘
                                 │
                                 ▼
                          coach/scripts/
                       (pull → log JSON)
                                 │
                                 ▼
                         coach/log/*/*.json
                         coach/log/reviews/*.md
                         coach/plans/current-plan.md
                         coach/athlete/profile.md
                         coach/goals/*.md
                                 │
                    ┌────────────┴────────────┐
                    ▼                         ▼
              Coach Claude              Dashboard (Next.js)
           (Claude Code CLI)             (read-only viewer)
                    │
                    ▼
                 You talk
                 to it in
              the terminal
```

## The pieces

### `coach/` — the coach mechanic

The coach is not a program. It's a folder of markdown files plus a system prompt (`CLAUDE.md`) that tells Claude how to think about them.

**Read-only inputs** (Claude reads, doesn't write):
- `athlete/profile.md` — your zones, FTP, constraints
- `plans/current-plan.md` — your active training plan
- `goals/*.md` — race targets
- `log/garmin/*.json`, `log/renpho/*.json` — raw source data

**Read-write outputs** (Claude writes):
- `log/reviews/YYYY-MM-DD-*.md` — one review per activity
- `log/weekly/YYYY-WNN.md` — weekly retros
- `log/readiness/YYYY-MM-DD.md` — cross-source recovery reads
- `plans/current-plan.md` — plan adjustments (rare)

### `coach/scripts/` — data source pullers

Each script fetches from one source and writes JSON into `coach/log/<source>/`.

```
scripts/
├── garmin/pull-readiness.sh    # Recovery, HRV, sleep, training readiness
├── renpho/pull-weight.sh       # Weight + body composition
└── strava/                     # Activities (via MCP fork or REST)
```

Each script:
- Reads credentials from `coach/.env` (never argv)
- Fails soft — one source failing doesn't kill others
- Writes `log/<source>/YYYY-MM-DD.json` (or similar)
- Can be called standalone or from `dashboard/scripts/sync-all.sh`

### `dashboard/` — the Next.js viewer

**Read-only by design.** Renders whatever's in `coach/`. Never writes back.

- **`app/page.tsx`** — the main dashboard grid (rows of cards)
- **`app/about/page.tsx`** — public-facing "about" page (shown at /about)
- **`app/api/sync/route.ts`** — POST endpoint that spawns `sync-all.sh`
- **`components/*.tsx`** — the cards themselves
- **`lib/*.ts`** — server-side loaders that read markdown/JSON from `coach/`

### Cross-project link

The dashboard reads the coach's files. This is configured in one place:

```typescript
// dashboard/lib/paths.ts
export const COACH_PROJECT_PATH = process.env.COACH_PROJECT_PATH || "";
```

Set `COACH_PROJECT_PATH` in `dashboard/.env.local` to the absolute path of your `coach/` dir (if separate) or `../coach` (if in the monorepo).

## Data flow — a day in the life

1. **You wake up.** Optionally run `./dashboard/scripts/sync-all.sh` (or click Sync in the dashboard) to pull yesterday's data.
2. **You ask Claude:** "What's my session today?" — Claude reads `plans/current-plan.md`, finds today's row, presents it.
3. **You train.** Strava captures the activity.
4. **You ask Claude:** "Review my last activity" — Claude calls the Strava MCP, pulls the activity + streams, compares to plan, writes `log/reviews/YYYY-MM-DD-*.md`, updates the Strava activity title/description.
5. **Weekly retro:** "How's my week going?" — Claude reads the week's reviews + activities, computes volume/intensity, writes `log/weekly/`, may adjust upcoming week in `plans/current-plan.md`.

## Design principles

- **Files as the interface.** Everything a coach knows is a file. No hidden state. Fully greppable, git-versionable.
- **Terminal-first.** The coach is Claude Code. The dashboard is optional.
- **One-way data flow.** Sources → files → coach → files. Dashboard reads files, never writes. Prevents fights over source of truth.
- **Soft failures.** One data source down doesn't stop the coach or dashboard from working with what's there.
- **User owns the data.** Nothing leaves your machine (except when Claude calls MCP tools you've explicitly wired up).

## Where to extend

- **Add a data source** → new script in `coach/scripts/<name>/` + a loader in `dashboard/lib/<name>.ts` + a card in `dashboard/components/<Name>Card.tsx`. See [ADDING-SOURCES.md](ADDING-SOURCES.md).
- **Change coach voice** → edit `coach/CLAUDE.md`. See [CUSTOMISING-COACH.md](CUSTOMISING-COACH.md).
- **Add a dashboard card** → new component + row in `dashboard/app/page.tsx`.
- **Change plan format** → coach's plan parser is in `dashboard/lib/plan.ts` (dashboard-side) and understood by CLAUDE.md workflows (coach-side). Both need to move together.
