# Playbooks

Sport-specific playbooks that extend the coach's core methodology.

The main `coach/CLAUDE.md` covers **discipline-agnostic** coaching: periodisation, intensity distribution (80/20 polarised), RPE zones, rest days, load management. Everything that applies to any endurance/fitness pursuit.

The playbooks in this directory extend that core with **discipline-specific** knowledge — session types, race prep, technique focus, tapering — for particular sports.

## How the coach uses these

When `athlete/profile.md` declares which disciplines the athlete trains, Coach Claude cross-references the matching playbook(s) for prescriptions and reviews. If you don't train swim/bike/run, delete the relevant playbook so it doesn't clutter the coach's reading list.

## Included playbooks

| File | Applies to |
|------|-----------|
| [`triathlon.md`](triathlon.md) | Multi-sport athletes (sprint / Olympic / 70.3 / IM) — brick sessions, transitions, race-day sequencing |
| [`running.md`](running.md) | Runners (5k → marathon → ultra) — LT/tempo runs, long-run pacing, injury prevention |
| [`cycling.md`](cycling.md) | Cyclists — FTP-anchored zones, sweet-spot, hill repeats, fondos |
| [`swim-technique-resources.md`](swim-technique-resources.md) | Swim technique references, drill catalogue |

## Adding your own

Playbooks are just markdown. Copy an existing one and adapt for:

- **Strength / powerlifting** — linear vs block periodisation, RPE for strength, deload weeks
- **CrossFit / hybrid** — mixed-modal programming, WOD structure
- **Rowing** — 2k prep, steady-state vs pieces
- **Climbing** — hangboard blocks, projecting vs endurance
- **Team sport S&C** — in-season vs off-season structure

Then reference the new playbook in `coach/CLAUDE.md` (or just leave it — the coach picks up markdown files in `playbooks/` automatically when reading context).

## Design principle

Keep `CLAUDE.md` lean. If a rule only applies to one sport, it belongs in that sport's playbook, not the shared prompt.
