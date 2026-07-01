# Claude Coach

**A personal endurance coach built entirely from files and Claude Code.**

Plans, activity reviews, readiness reads, race strategies — all live as plain markdown in one project folder. Claude reads them, writes them, and coaches from them. An optional Next.js dashboard renders it all.

> Built by [dwedigital](https://github.com/dwedigital) · Uses [Claude Code](https://claude.com/claude-code) · MIT licensed

![Coach Dashboard](docs/dashboard.png)

---

## What's in the box

```
claude-coach/
├── coach/            # The coach mechanic — markdown files + scripts
│   ├── CLAUDE.md     # System prompt (the coach's brain)
│   ├── athlete/      # Your profile (zones, FTP, constraints)
│   ├── plans/        # Training plans
│   ├── goals/        # Race targets
│   ├── log/          # Reviews, readiness reads, source data
│   └── scripts/      # Data pullers (Garmin, Renpho, etc)
│
├── dashboard/        # Optional Next.js dashboard (read-only view)
│
└── docs/             # Quickstart, source adapters, customisation
```

You can use just `coach/` (talk to Claude in your terminal) — the dashboard is optional glasses on top.

---

## Quickstart

Full setup guide: **[docs/QUICKSTART.md](docs/QUICKSTART.md)**

TL;DR:

```bash
# 1. Clone
gh repo clone dwedigital/claude-coach
cd claude-coach

# 2. Configure the coach
cp coach/athlete/profile.example.md coach/athlete/profile.md
# ...edit with your zones, FTP, weight, targets

# 3. (Optional) Configure data sources
cp coach/.env.example coach/.env
# ...fill in the credentials for whichever sources you use

# 4. (Optional) Run the dashboard
cd dashboard
cp .env.example .env.local
npm install
npm run dev
# → http://localhost:3000
```

---

## Data sources

Wire in whichever you have. All are optional.

| Source | What it gives you | Adapter status |
|--------|------------------|----------------|
| **Strava** | Activities, HR streams, laps | ✅ Built-in (MCP fork or REST API) |
| **Garmin Connect** | Recovery, HRV, sleep, training readiness | ✅ Built-in (via `garmin_pull.py`) |
| **Eight Sleep** | Sleep stages, rMSSD HRV, heart rate | ✅ Built-in (MCP or local API) |
| **Renpho scales** | Weight, body fat, muscle mass, visceral fat | ✅ Built-in (unofficial Python API) |
| **Whoop / Oura / Fitbit / Apple Health** | — | Adapter pattern — see [docs/ADDING-SOURCES.md](docs/ADDING-SOURCES.md) |

---

## What makes it different

- **Terminal-first coach** — you talk to Claude, it reads/writes markdown, no chat UI. Full audit trail.
- **Files-as-memory** — everything is greppable, git-versionable, portable. No lock-in.
- **Coach voice is customisable** — edit `coach/CLAUDE.md` to change the personality, workflows, rules.
- **Dashboard is optional** — the coach works standalone in a terminal; the dashboard is just a viewer.
- **Extensible** — plug in whatever data source you want by writing a small adapter.

---

## Documentation

- **[docs/QUICKSTART.md](docs/QUICKSTART.md)** — Full setup, step by step
- **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** — How it all fits together
- **[docs/ADDING-SOURCES.md](docs/ADDING-SOURCES.md)** — Wire in a new data source
- **[docs/CUSTOMISING-COACH.md](docs/CUSTOMISING-COACH.md)** — Coach voice, plan format, cards

---

## Security & privacy

Your training data stays local. The `.gitignore` excludes:

- Your actual `athlete/profile.md`, `plans/current-plan.md`, `goals/*.md`
- All contents of `log/` (reviews, readiness, source dumps)
- All `.env*` files
- Any cached auth tokens

**Never commit your personal data.** The template includes strong `.gitignore` rules, but caution when adding new file types.

---

## License

MIT — do whatever you want. Attribution appreciated but not required.

---

## Credits

Built by Dave Edwards ([dwedigital](https://github.com/dwedigital)) as a personal triathlon coach, then extracted into this template for anyone else who wants to try the pattern. Inspired by the "software that keeps working forever" idea — no cloud, no accounts, no lock-in, just files and a good LLM.
