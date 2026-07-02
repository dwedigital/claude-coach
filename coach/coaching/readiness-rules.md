# Readiness Rules — Proceed / Modify / Rest

**Purpose:** turn recovery data (HRV, resting HR, sleep, subjective wellness) into a daily decision — proceed as planned, modify the session, or rest — using the athlete's *own* baselines, not generic numbers. Read this before any readiness check and before prescribing a hard session.

**The honest headline first.** HRV-guided training is worth doing, but for a specific reason: it *reduces bad days and protects against digging holes*, not because it produces bigger fitness gains. The pooled meta-analysis found no significant group-level performance advantage over a fixed plan — the only reliable benefit was to vagal HRV itself. So treat readiness data as a **veto and a timing tool**, not a performance engine. And note: across the whole literature, the best-evidenced signals are **subjective wellness and sleep**, not HRV. Weight them accordingly.

> Manresa-Rocamora et al. (2021), *IJERPH* 18(19):10299 [verified]: 8 studies, VO2max SMD 0.13 (NS), endurance 0.20 (NS); only vagal HRV SMD 0.50 (p<0.01) significant. Saw, Main & Gastin (2016), *Br J Sports Med* 50(5):281-291 [verified]: subjective self-report more sensitive/consistent than objective markers (56 studies).

---

## The four methodological rules that make this work

1. **Trend over point.** A single reading is noise. The signal is the **7-day rolling average**, which correlates with real performance change far better than any one day. One low morning inside the normal band → proceed.
   > Plews et al. (2012), *IJSPP* 7(4) [verified].

2. **Individual band, not universal cutoff.** "Normal" = each stream's own baseline ± its own noise (smallest worthwhile change ≈ 0.5× the day-to-day SD). There is no universal HRV number that means "tired" — only movement outside *this athlete's* band.
   > Plews et al. (2013), *Sports Med* 43(9):773-781 [verified].

3. **Never mix measurement sources.** Nocturnal HRV (a bed/wearable sensor) and morning spot-check HRV (a chest-strap app) have **different absolute values and separate baselines** — same for their HR. Two different devices' HRV numbers are not interchangeable. Compare each stream to its own baseline; never read a "drop" because the device or timing changed.
   > Nummela et al. (2022), *PLOS One* 17(1):e0262333 [verified]: nocturnal and morning HRV respond differently day-to-day. Plews et al. (2017), *IJSPP* 12(10):1324-1328 [verified].

4. **Agreement = act; divergence = investigate.** If multiple independent signals agree, trust it. If one flags and others don't, suspect measurement error before fatigue (see the framework below).

---

## Establishing the athlete's baselines (a template — fill from their own data)

**Do not use generic numbers.** Derive each stream's baseline from ~4 weeks of the athlete's own logged data, then keep each stream in its own row and recalibrate every ~4 weeks. Record the filled-in version in the athlete's profile / a readiness note.

| Stream | Baseline | Normal range | Concern threshold |
|---|---|---|---|
| **Nocturnal HRV** (rMSSD, bed/wearable sensor) | `[4-wk mean]` | `[baseline ± ~1 SD]` | 7-day mean below the bottom of the normal range, or a single very low night *plus* another flag |
| **Morning / other-device HRV** (separate scale) | `[its own 4-wk mean]` | `[its own range]` | below its own low bound sustained, or the device's own status flips to "Unbalanced"/"Low" |
| **Nocturnal RHR** | `[4-wk mean]` | `[range]` | above range sustained (2+ nights) |
| **Watch/other-device RHR** | `[its own mean]` | `[its own range]` | above its own range sustained (2+ nights) |
| **Sleep duration** | `[typical]` | `[range]` | below the low bound for 2+ nights, or a run of poor nights |
| **Sleep composition** | `[deep %, REM %]` | — | use as context, not a standalone trigger |

*Illustration of the shape (fictional round numbers, not a target):* suppose an athlete's nocturnal-HRV baseline sits at 100 (range 85–115) while the *same athlete's* watch-derived HRV reads ~85 on its own scale. Those are different devices measuring differently — a "drop" from 100 to 85 is only real if it's within one stream. This is exactly why the two streams must never be compared to each other, only each to its own baseline.

**Converting a legacy absolute threshold to source-specific bands.** If the athlete has an old "HRV < X → rest" rule sitting in a plan, treat it with suspicion: an absolute number set months ago goes stale as fitness (and baseline HRV) rises, and it's usually ambiguous about *which* device it referred to. Re-express it as **each source's 7-day mean dropping toward the bottom of that source's own current range**, not a single fixed number on an unspecified device. A single low night on one stream is likely noise or vagal saturation (below) — don't veto on it alone; require a second corroborating signal.

**Sensor hygiene:** discard obvious artifacts (e.g. a watch RHR reading 30+ bpm above baseline on a rest day = strap-off / bad contact). A physiologically implausible jump is a sensor problem, not a readiness signal.

---

## The parasympathetic-saturation caveat (important for a fit, low-RHR athlete)

For an aerobically fit athlete with a low RHR, HRV can **plateau or even fall while fitness is fine** — at very low heart rates the sinus node's response to vagal tone saturates, so a *fitter, slower* heart can post a *lower* rMSSD as a ceiling artifact, not fatigue. Conversely, HRV can *rise* abnormally in functional overreaching. So the HRV↔fatigue relationship is **not monotonic**: an unexplained large drop *and* an unexplained large rise both deserve scrutiny rather than a reflexive read.

**Rule:** never read a single low HRV night as fatigue in isolation. Cross-check RHR, sleep, subjective state, and recent load before acting.

> Schmitt, Regnard & Millet (2015), *Front Physiol* 6:343 [verified]: vagal saturation biases rMSSD downward. Le Meur et al. (2013), *MSSE* 45(11):2061-2071 [verified]: HRV rose with functional overreaching.

---

## The decision framework

| Situation | Read | Action |
|---|---|---|
| **All signals in band** — HRV, RHR, sleep, subjective all normal | Recovered | **Proceed** as planned; progress if the trend is rising |
| **Agreement to the downside** — HRV 7-day mean down **and** RHR up **and** poor sleep/subjective | High-confidence fatigue | **Back off** — swap hard session for easy or rest; redistribute load |
| **Divergence** — one stream flags, others don't | Ambiguous | **Investigate, don't overreact** — sensor artifact? nocturnal-vs-morning mismatch? one bad night vs a trend? Escalate only if it persists or a second signal joins |
| **Single low HRV night, everything else fine** | Likely noise / saturation | **Proceed**; note it, watch the rolling mean |
| **HRV rising abnormally + rising fatigue / flat performance** | Possible overreaching | **Investigate as fatigue, not fitness** |
| **Subjective/sleep drifting down over days, HRV still OK** | Valid fatigue signal on its own | **Modify** — subjective self-report is the most sensitive marker; trust it |

**Load context matters.** Poor recovery after a deliberate hard block is expected — that's functional overreaching, absorb it. Poor recovery on an *easy* week is the red flag. Always read the number against what produced it.

---

## Output

Write the decision to `log/readiness/YYYY-MM-DD.md`: the call (proceed / modify / rest), the specific numbers that drove it (per source, vs that source's baseline), and the reasoning. Keep it short — a decision record, not a report. Pull whatever recovery sources are connected (e.g. a watch, a sleep sensor, and recent training load) per the CLAUDE.md readiness workflow.

---

## References (all verified against primary sources)

1. Kiviniemi AM, Hautala AJ, Kinnunen H, Tulppo MP (2007). Endurance training guided individually by daily HRV. *Eur J Appl Physiol* 101(6):743-751.
2. Vesterinen V et al. (2016). Individual Endurance Training Prescription with HRV. *Med Sci Sports Exerc* 48(7):1347-1354.
3. Nuuttila O-P et al. (2017). HRV-Guided vs. Predetermined Block Training. *Int J Sports Med* 38(12):909-920.
4. Javaloyes A, Sarabia JM, Lamberts RP, Moya-Ramón M (2019). Training Prescription Guided by HRV in Cycling. *Int J Sports Physiol Perform* 14(1):23-32.
5. Manresa-Rocamora A et al. (2021). HRV-Guided Training… Systematic Review with Meta-Analysis. *Int J Environ Res Public Health* 18(19):10299.
6. Plews DJ, Laursen PB, Stanley J, Kilding AE, Buchheit M (2013). Training adaptation and HRV in elite endurance athletes. *Sports Med* 43(9):773-781.
7. Plews DJ, Laursen PB, Kilding AE, Buchheit M (2012). Evaluating training adaptation with heart-rate measures. *Int J Sports Physiol Perform* 7(4).
8. Buchheit M (2014). Monitoring training status with HR measures: do all roads lead to Rome? *Front Physiol* 5:73.
9. Esco MR, Flatt AA (2014). Ultra-short-term HRV indexes at rest and post-exercise in athletes. *J Sports Sci Med* 13(3):535-541.
10. Plews DJ, Scott B, Altini M, Wood M, Kilding AE, Laursen PB (2017). Comparison of HRV recording: smartphone PPG, Polar H7, ECG. *Int J Sports Physiol Perform* 12(10):1324-1328.
11. Nummela A et al. (2022). Nocturnal vs. morning measures of heart rate indices in young athletes. *PLOS One* 17(1):e0262333.
12. Schmitt L, Regnard J, Millet GP (2015). Monitoring fatigue status with HRV: an avenue beyond RMSSD? *Front Physiol* 6:343.
13. Le Meur Y et al. (2013). Evidence of parasympathetic hyperactivity in functionally overreached athletes. *Med Sci Sports Exerc* 45(11):2061-2071.
14. Saw AE, Main LC, Gastin PB (2016). Subjective self-reported measures trump commonly used objective measures: a systematic review. *Br J Sports Med* 50(5):281-291.
15. Milewski MD et al. (2014). Chronic lack of sleep is associated with increased sports injuries in adolescent athletes. *J Pediatr Orthop* 34(2):129-133.
16. Mah CD, Mah KE, Kezirian EJ, Dement WC (2011). The effects of sleep extension on the athletic performance of collegiate basketball players. *Sleep* 34(7):943-950.

*Heuristic, not validated cutoffs: the specific RHR "+3-7 bpm" style thresholds and any single universal HRV number. The athlete's bands must be derived from their own logged data and recalibrated as fitness shifts.*
