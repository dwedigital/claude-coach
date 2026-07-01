# Customising the Coach

The coach is not a program you configure — it's a Claude instance shaped by a system prompt (`coach/CLAUDE.md`) plus sport-specific playbooks (`coach/playbooks/`). To change the coach's voice, workflows, or rules, you edit those files.

## The sport-agnostic core vs. playbooks

The template splits knowledge across two levels:

- **`coach/CLAUDE.md`** — the discipline-agnostic core: methodology, workflows, rules that apply to any endurance/fitness pursuit
- **`coach/playbooks/*.md`** — sport-specific extensions (triathlon, running, cycling, and any you add)

**When to edit which:**

- Change how the coach *talks* → CLAUDE.md
- Change coaching methodology (periodisation, load model, intensity distribution) → CLAUDE.md
- Add a session type unique to one sport → that sport's playbook
- Add race-day protocols for one sport → that sport's playbook
- Add a whole new sport (strength, rowing, climbing) → new file in `playbooks/`

## The three levers

### 1. The persona (voice, tone, style)

Top of `coach/CLAUDE.md` — the first paragraph tells Claude who to be.

The template ships with:

```markdown
You are **Coach Claude**, a personal training coach. You are direct, knowledgeable, and supportive — but not soft. Think experienced club coach who knows the athlete personally. Use their first name. Call out missed sessions and half-hearted efforts honestly. No corporate language, no cheerleading.
```

Change it to whatever fits — chattier, sterner, more scientific, more zen. The rest of the file inherits from it.

### 2. The hard rules (things Claude must always/never do)

Under the **"Hard Rules"** section. Examples in the template:

- Always log activity reviews to `log/reviews/YYYY-MM-DD-*.md`
- Always log weekly reviews to `log/weekly/YYYY-WNN.md`
- Always update the plan if a session was missed/swapped

Add your own. Rules go here when they must apply regardless of context.

### 3. The workflows (what to do for specific requests)

Under **"Workflows"** — labelled by request type. Each workflow is a step-by-step recipe Claude follows.

Template ships with:

- "What's my session today?"
- "Review my last activity"
- "Weekly review"
- "How am I recovering?" (readiness check)
- "Push tomorrow's session to Garmin"
- Plan adjustment for travel / illness / life

You can add:

- "Race-day brief" — how to build a race-morning routine
- "Nutrition plan for [event distance]"
- "Analyse my swim technique from this Strava swim"
- Whatever workflows match how *you* actually talk to your coach

## The philosophy section

Everything under **"Coaching Philosophy (discipline-agnostic core)"** in CLAUDE.md is Claude's mental model. Change it to match your training methodology:

- **80/20 polarised** (default) or **sweet-spot** or **pyramidal**
- **Periodisation model** (linear / block / undulating)
- **Recovery model** (how you view sleep, HRV, load)
- **Intensity anchoring** (RPE-first vs HR-first vs power-first)

**Sport-specific priorities** (swim technique vs volume, bike power vs endurance, run cadence vs stride) live in `playbooks/*.md`, not here.

## Adding a new sport

If you want the coach to handle a discipline the template doesn't ship with (rowing, climbing, powerlifting, hybrid athletics), copy an existing playbook as a starting point:

```bash
cp coach/playbooks/running.md coach/playbooks/rowing.md
```

Edit `rowing.md` to cover:
- **Session types** (steady state, race pieces, technical work)
- **Zone anchoring** (2k pace, HR, stroke rate)
- **Discipline-specific priorities**
- **Progression rules and injury prevention**
- **Race-week protocol** for your target event

Then update `athlete/profile.md` to declare `[x] Rowing` under disciplines trained. Coach reads the new playbook automatically.

## The athlete profile — what Claude "knows" about you

`coach/athlete/profile.md` is Claude's factual knowledge of your body and constraints:

- Zones (HR, pace, power)
- FTP, CSS, threshold pace
- Weight, height, age
- Injuries, medical conditions
- Full-time job constraints (training hours available)
- Equipment (bike, watch, HR monitor, shoes)
- Preferences (morning vs evening, race distance targets)

Update it whenever any of these change. Coach reads it every interaction.

## Format conventions

The dashboard parses plans and reviews from markdown, so the format matters:

- **Plans** use markdown tables — see `coach/plans/examples/6-week-super-sprint.md` for the shape
- **Reviews** use frontmatter + a body — see `coach/log/reviews/README.md`
- **Weekly** logs go to `log/weekly/YYYY-WNN.md`
- **Dates** are `YYYY-MM-DD` everywhere
- **Weeks** are ISO week numbers `YYYY-WNN`
- **Distances** in km, paces in min/km, durations in HH:MM

If you change these, update:
- `coach/CLAUDE.md` (so Claude knows the new format)
- `dashboard/lib/plan.ts` (so the parser matches)
- `dashboard/lib/reviews.ts` (same)

## Memory — long-term coach learnings

Claude Code auto-saves memories at `~/.claude/projects/<project-slug>/memory/`. These persist across sessions — your coach remembers past feedback ("don't prescribe morning swims"), observations ("Dave pushes too hard when feeling good"), and race protocols.

Memories are user-owned and **not in this repo**. They accumulate as you talk to your coach.

Consult and edit them via the `/memory` slash command in Claude Code, or by directly editing files under `~/.claude/projects/<slug>/memory/`.

## Extending the dashboard to match

If you add a new plan format or a new metric to the profile, the dashboard needs to know:

- **New plan column** → edit `dashboard/lib/plan.ts` (parser) + `dashboard/components/TodaySessionCard.tsx` + `WeekCalendar.tsx`
- **New profile field** → edit `dashboard/lib/profile.ts` (parser) + `dashboard/components/AthleteStatsCard.tsx`
- **New card** → new component under `dashboard/components/`, wire into `dashboard/app/page.tsx`

See [ADDING-SOURCES.md](ADDING-SOURCES.md) for the general pattern.

## Sharing your coach

If you build a version for a different sport (climbing coach, powerlifting coach, marathon coach), please open a PR with a link — the template can point to community forks so others get inspired.
