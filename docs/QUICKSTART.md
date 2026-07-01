# Quickstart

Get your own Claude Coach running in about 20 minutes.

## Prerequisites

- **[Claude Code](https://claude.com/claude-code)** installed and authenticated
- **Node.js 18+** (for the dashboard, optional)
- **[uv](https://docs.astral.sh/uv/)** (for Python data-source scripts, optional)
- A GitHub account (to fork this repo)

## 1. Fork and clone

```bash
# Fork on GitHub, then:
gh repo clone <your-username>/claude-coach
cd claude-coach
```

## 2. Set up your athlete profile

The coach's world starts with knowing *you*.

```bash
cp coach/athlete/profile.example.md coach/athlete/profile.md
```

Now edit `coach/athlete/profile.md`. Fill in:

- Weight, height, age
- Heart-rate zones (Z1-Z5) — from a lab test if you have one, else estimate from max HR
- Discipline benchmarks (running pace, cycling FTP, swim CSS)
- Any injuries, constraints, preferences

Your profile is **gitignored** — it stays on your machine.

## 3. Write your first plan

Copy an example plan or start blank:

```bash
cp coach/plans/examples/6-week-super-sprint.md coach/plans/current-plan.md
```

Or ask Claude to build one for you — see `docs/CUSTOMISING-COACH.md`.

## 4. Connect data sources (optional)

Pick any you use. All are opt-in.

### Strava

```bash
cp coach/.env.example coach/.env
# Fill in STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN
```

Get your Strava app credentials at [strava.com/settings/api](https://www.strava.com/settings/api).

### Garmin Connect

Add to `coach/.env`:
```
GARMIN_EMAIL=your@email.com
GARMIN_PASSWORD=your-password
```

Test with:
```bash
./coach/scripts/garmin/pull-readiness.sh
```

### Eight Sleep

Add to `coach/.env`:
```
ES_EMAIL=your@email.com
ES_PASSWORD=your-password
```

### Renpho scales

**Requires a legacy Renpho account** (not the newer "Renpho Health" app). Add to `coach/.env`:
```
RENPHO_EMAIL=your@email.com
RENPHO_PASSWORD=your-password
```

Test with:
```bash
./coach/scripts/renpho/pull-weight.sh
```

### Other sources (Whoop, Oura, Fitbit, Apple Health)

See **[docs/ADDING-SOURCES.md](ADDING-SOURCES.md)** for the adapter pattern.

## 5. Talk to your coach

From your terminal, in the repo root:

```bash
claude
```

Then try:

- **"What's my session today?"** — coach reads plan, presents session
- **"Review my last activity"** — coach pulls Strava, writes a review
- **"How's my recovery?"** — coach cross-references sleep + HRV + load
- **"Weekly review"** — coach synthesises the week, may adjust upcoming plan

## 6. (Optional) Run the dashboard

```bash
cd dashboard
cp .env.example .env.local
# Edit .env.local with the same source credentials plus COACH_PROJECT_PATH
npm install
npm run dev
```

Open http://localhost:3000. The dashboard is **read-only** — it renders whatever's in your coach files. Claude in the terminal remains the writer.

## Troubleshooting

- **Claude can't find files** — check that `coach/CLAUDE.md` is at the repo root and you're running `claude` from the repo dir
- **Data source auth fails** — see the specific source's `README.md` in `coach/scripts/<source>/`
- **Dashboard shows "No plan loaded"** — confirm `coach/plans/current-plan.md` exists and matches the expected markdown-table format (see the example plan)
- **Dashboard shows "No readings yet" for a source** — verify the source's script runs standalone and creates files in `coach/log/<source>/`

## Next steps

- **[Customise the coach](CUSTOMISING-COACH.md)** — voice, workflows, rules
- **[Add a new data source](ADDING-SOURCES.md)** — Oura, Whoop, Apple Health, anything with an API
- **[Understand the architecture](ARCHITECTURE.md)** — how the pieces fit
