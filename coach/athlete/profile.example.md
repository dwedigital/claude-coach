# Athlete Profile: [Your Name]

> **Template.** Copy this file to `athlete/profile.md` and fill in your details — or better, run the `/onboard` skill and let the coach interview you and fill it in.
>
> **Modular by design.** Delete the discipline sections you don't train — the coach reads what's here and adapts. If you're a marathoner, keep "Run", delete "Bike"/"Swim". If you're a triathlete, keep all three. Same for cycling, swimming, gym-only.
>
> Your actual `profile.md` is `.gitignored` — it stays local.
>
> The evidence base behind how the coach uses these numbers lives in `../coaching/` (signal hierarchy, readiness rules, methodology, protocols).

## Personal
- **Name:** [First Last]
- **Age:** [40] (DOB: YYYY-MM-DD)
- **Weight:** [80 kg]
- **Height:** [180 cm]
- **Location:** [City, Country]

## Disciplines trained

Tell the coach which sports/disciplines you actually do. This drives which `playbooks/` the coach reads.

- [x] Running
- [ ] Cycling
- [ ] Swimming
- [ ] Triathlon (multi-sport)
- [ ] Strength / lifting
- [ ] Other: [rowing / climbing / hybrid / etc]

## Test data / benchmarks

If you've done a **VO2max test** or lactate threshold test, log it here (anchors your zones):
- **VO2max:** [55 ml/kg/min]
- **Max HR:** [175 bpm]
- **VT1 (aerobic threshold):** HR [140 bpm] / pace [5:00/km]
- **VT2 (lactate threshold):** HR [160 bpm] / pace [4:00/km]
- **Test date:** YYYY-MM-DD

No lab test? Delete this block and rely on HR-max-based zones (below).

## Heart Rate Zones

If you have a lab test, use those anchor points. Otherwise, % of max HR is a reasonable starter:
- Z1: <65% HRmax · Z2: 65-75% · Z3: 76-85% · Z4: 86-92% · Z5: 93%+

| Zone | Name | HR (bpm) | RPE |
|------|------|----------|-----|
| Z1 | Recovery | <[125] | 1-2 |
| Z2 | Endurance | [125-146] | 3-4 |
| Z3 | Tempo | [146-154] | 5-6 |
| Z4 | Threshold | [154-170] | 7-8 |
| Z5 | VO2max+ | [170+] | 9-10 |

## Recovery & Readiness Baselines

> The coach uses these for daily proceed/modify/rest calls — see `../coaching/readiness-rules.md` for how. **Leave blank at first**: baselines need ~4 weeks of your own data (a wearable, sleep sensor, or morning HRV app). Ask the coach to derive them once you have the history, and to recalibrate every ~4 weeks.
>
> **One row per device/stream — never compare numbers across devices.** A watch's HRV and a bed sensor's HRV are different scales.

| Stream | Device | Baseline | Normal range | Last calibrated |
|---|---|---|---|---|
| Nocturnal HRV (rMSSD) | [device] | [—] | [—] | YYYY-MM-DD |
| Morning / watch HRV | [device] | [—] | [—] | YYYY-MM-DD |
| Resting HR | [device] | [—] | [—] | YYYY-MM-DD |
| Sleep duration | [device] | [typical hrs] | [range] | YYYY-MM-DD |
| Sleep composition | [device] | [deep %, REM %] | — | YYYY-MM-DD |

## Training History
- **Years training:** [X]
- **All-time running:** [X km across N activities]
- **All-time cycling:** [X km across N activities]
- **Swimming background:** [experienced / newer / building volume]
- **Current weekly hours:** [~6-8 hours/week]
- **Preferred training times:** [mornings / evenings / mixed]

---

## RUN (delete this section if you don't run)

### Current fitness
- **Easy pace:** [5:00-5:30/km] (Z2, HR <[146])
- **Threshold pace:** [~4:05-4:10/km] @ HR [160-170]
- **Best 5k / 10k / half / marathon:** [times + dates]
- **Estimated race pace:** [10km ~4:15/km / half ~4:30/km / marathon ~4:45/km]
- **Cadence:** [~87 spm easy, 92+ at threshold]
- **Shoe rotation:** [daily / long / race — brand + model]

### Zone anchoring
Pace ranges per zone:

| Zone | Pace/km | Use |
|------|---------|-----|
| Z1 | >[5:30] | Recovery |
| Z2 | [5:00-5:30] | Easy / long runs |
| Z3 | [4:20-4:50] | Tempo |
| Z4 | [4:00-4:15] | Threshold |
| Z5 | [<4:00] | Intervals |

---

## BIKE (delete this section if you don't cycle)

### Current fitness
- **FTP:** [220W] (tested YYYY-MM-DD)
- **W/kg:** [2.75]
- **Longest ride:** [X km]
- **Bike:** [make + model, groupset]
- **Power meter:** [device / none]

### Power zones (from FTP)

| Zone | Name | Power | % FTP |
|------|------|-------|-------|
| Z1 | Recovery | <120W | <55% |
| Z2 | Endurance | 120-165W | 55-75% |
| Z3 | Tempo/sweet-spot | 165-200W | 76-90% |
| Z4 | Threshold | 200-230W | 91-105% |
| Z5 | VO2max | 230-265W | 106-120% |

### Bike-specific HR
Bike HR runs 5-10 bpm lower than run HR at same effort. Track separately if you race both.
- **Bike threshold HR:** [~155 bpm]
- **Bike Z2 HR ceiling:** [<140 bpm]

---

## SWIM (delete this section if you don't swim)

### Current fitness
- **CSS (Critical Swim Speed):** [~1:55/100m]
- **Race pace projection:** [1500m ~29:00]
- **Pool / OW access:** [describe]
- **Technique focus areas:** [head position, catch, breathing pattern, etc]

### Swim pace bands (from CSS)
| Band | Pace /100m |
|------|-----------|
| Easy / recovery | [2:08-2:18] |
| Z2 endurance | [2:02-2:12] |
| Threshold (CSS) | [1:55-2:00] |
| Speed / race | [1:48-1:53] |

---

## STRENGTH / S&C (delete if you don't lift)

### Current numbers
- **Squat / bench / deadlift 1RMs:** [X / Y / Z kg]
- **Weekly sessions:** [1-2]
- **Programming:** [linear / block / autoregulated]
- **Standing S&C class:** [day + duration] (if applicable)

---

## Equipment
- **Watch:** [Garmin FR X / Apple Watch / etc]
- **HR monitor:** [chest strap / optical]
- **Power meter (run):** [Stryd / none]
- **Bike:** [details]
- **Run shoes:** [rotation]
- **Swim gear:** [pull buoy, fins, etc]

## Supplements

Log what you actually use, and why. Coach factors these in without prescribing new ones.

### Daily
- [e.g. Creatine monohydrate 3-5g/day]
- [e.g. Vitamin D3 2000 IU]

### Event / race-week protocol
- [e.g. Beet It shot × 1/day for 7 days pre-event]
- [e.g. Taurine 3g/day for 7 days pre-event]

## Injury History
- [None / list past injuries + current status]

## Preferences & Constraints
- **Full-time job:** [yes / no — hours available for training]
- **Standing commitments:** [class / group ride / long-run day]
- **Realistic weekly training:** [6-10 hours]
- **Location-specific:** [routes, weather, indoor vs outdoor mix]
