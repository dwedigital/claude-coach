# Signal Hierarchy — Which Metric Wins When They Disagree

**Purpose:** a decision reference for reading training data when signals conflict. HR, pace, power, and RPE do not always agree. This document says which one to trust, in which context, and why. Read this before any activity review.

**Origin:** written after a review error — a recovery open-water swim was flagged "non-compliant" on pool pace bands when HR was obediently in Z1. The lesson: when signals conflict, the failure is almost always in *not knowing which signal is primary for that context*, not in the data. This doc encodes the hierarchy so that call is made on rules, not vibes.

---

## The core principle: internal vs external load

Two families of intensity signal, and they answer different questions:

- **Internal load** — what the effort cost *this athlete*: heart rate, RPE. Individual, adaptive, affected by state (heat, fatigue, illness, caffeine).
- **External load** — the physical work done, independent of who did it: pace, power, distance. Objective, but blind to cost.

Neither is "the truth." The right anchor depends on the session and the environment. The framework: use external load (pace/power) to *prescribe and control* work; use internal load (HR/RPE) to *check the cost was right*; and know which one to believe when they diverge.

> Impellizzeri, Marcora & Coutts (2019), *IJSPP* 14(2):270-273 — the internal/external load framework [verified]. Borg (1982), *MSSE* 14(5):377-381 — RPE as an internal-load measure [verified]. Chen, Fan & Moe (2002), *J Sports Sci* 20(11):873-899 — RPE meta-analysis: moderate criterion validity vs HR (r≈.57), lactate (.56), VO2 (.48) [verified].

---

## Decision rules by context

### 1. Short intervals (reps under ~3-5 min): anchor to PACE / POWER / RPE, NOT HR

HR physically cannot keep up with a short hard rep. It rises mono-exponentially with a time constant of ~30-45 s (time to reach ~63% of the change), so on a 60-90 s rep HR is still climbing toward the target when the rep ends. Reading "HR only hit Z4 at the end of the 3-min rep" as under-performance is a misread — that's HR lag, not effort.

**Rule:** for intervals, prescribe and judge by pace (run), power (bike), or RPE. Use HR only as a coarse post-hoc check (did it eventually get up there across the set), never as the intra-rep control signal.

> Buchheit & Laursen (2013), *Sports Med* 43(5):313-338, §2.3 [verified verbatim]: HR "may be limited" for controlling HIT; HR often fails to reach expected max "especially for very short (<30 s) and medium-long (1-2 min) intervals… related to the well-known HR lag at exercise onset." For supramaximal reps, anchor to fraction of anaerobic speed reserve — Sandford, Laursen & Buchheit (2021), *Sports Med* 51(10):2017-2028 [verified].

### 2. Long steady efforts: watch for CARDIAC DRIFT — then trust pace/power/RPE over HR

Over a long effort (>10-20 min), HR drifts upward at constant pace/power — stroke volume falls, HR rises to defend cardiac output. Heat and dehydration amplify it. When drift is happening, HR *over-reads* the effort: the athlete isn't working harder, the heart is just compensating.

**Rule:** on long efforts, if pace/power/RPE are steady but HR is climbing, that's drift — do not chase a lower HR by slowing down past what the session intends. Conversely, a strict HR cap on a long hot session will get more conservative as it drifts; that's expected, not a fitness problem. Decoupling (below) quantifies it.

> Coyle & González-Alonso (2001), *Exerc Sport Sci Rev* 29(2):88-92 [verified]. Wingo et al. (2005), *MSSE* 37(2):248-255 [verified]: in 35°C, +12% HR / −16% stroke volume / −19% VO2max over 15→45 min. Montain & Coyle (1992), *J Appl Physiol* 73(4):1340-1350 [verified]: HR rise scales with dehydration (r=0.99).

**Aerobic decoupling (Pw:HR / Pa:HR)** — a durability check on long steady efforts. Compare efficiency factor (normalised power or graded pace ÷ avg HR) for the first vs second half; decoupling = (EF₁ − EF₂)/EF₁. **≤5% = sound aerobic durability; >5% = the aerobic base isn't yet holding that duration.** This is a coaching convention (Friel / TrainingPeaks), not a validated lab threshold — use it directionally.

### 3. Open water / sea swim: HR (or RPE) is the anchor — POOL PACE BANDS DO NOT TRANSFER

This is the rule the doc was born from. Pool pace/100m does not map to open water, and for a wetsuit sea swim the bias is toward *faster* pace at the same aerobic cost:

- **Wetsuit** reduces active drag ~14% by lifting the hips/legs — so for an athlete whose stroke fault is low body position (legs low in the water), the wetsuit removes drag they carry in the pool. Triathletes (not pool swimmers) gain most: ~19 s over 400 m, gain correlating with hydrostatic lift.
- **Salt water** is ~2.5% denser than fresh (≈1.025 vs 1.000 g/cm³) → more buoyancy on top of the wetsuit. (Physics, not a measured pace study — but directionally certain.)
- **No push-off turns:** pool times bank a ~3.0 m/s wall push-off vs ~1.5 m/s free-swim speed, worth 20-40% of pool race time. Open water has none of that.
- **Sighting** raises drag ~10% each time the head lifts — a cost pool swimming doesn't have.

**Rule:** for OW/sea swims, judge compliance by HR zone (or RPE if no strap). If HR is in the prescribed band, the session complied — do NOT call it off pool pace. As a rough translation, subtract ~10-15 s/100m from the OW pace to get a pool-equivalent before comparing to bands. (Conditions can reverse this — heavy chop, current against, cold — so read the conditions if the athlete reports them.)

> Toussaint et al. (1989), *MSSE* 21(3):325-328 [verified]. Chatard et al. (1995), *MSSE* 27(4):580-586 [verified]. Chatard & Millet (1996), *Sports Med* 22(2):70-75 [verified]: wetsuit velocity +3.2-12.9%, larger for weaker swimmers. Cortesi & Gatta (2015), *J Hum Kinet* [verified]: head-up +~10% drag. Born et al. (2021), *Sports* (Basel) [verified]: push-off vs free-swim speed.

### 4. Bike vs run: HR runs ~5-10 bpm LOWER on the bike at equal effort — don't apply run zones to the bike

Same athlete, same internal effort, lower HR seated on the bike than running — driven by smaller active muscle mass, posture, and venous return differences. Direction is robust in the literature; magnitude is individual (studies span ~2 to ~10 bpm). Record bike and run threshold HR separately in the profile rather than assuming one set of zones covers both.

**Rule:** use bike-specific HR references (and ideally power) on the bike. A bike session sitting 8 bpm under the equivalent run zone is not "too easy" — it's the modality offset. Prefer power as the bike anchor; use HR as the cross-check.

> Millet, Vleck & Bentley (2009), *Sports Med* 39(3):179-206 [verified]: HRmax commonly ~5-10 bpm higher running than cycling; mechanism = active muscle mass + cardiac-output adaptation. Basset & Boulay (2000), *Eur J Appl Physiol* [verified]. Kasiak et al. (2023), *J Clin Med* [verified].

### 5. Environmental & state confounds: heat, altitude, dehydration, caffeine, illness, stress all raise HR independent of effort

When HR says "too hard" but pace/power/RPE say the effort was right, suspect a confound before concluding the session was overcooked:

- **Heat/humidity** — raises HR at a given workload (blood diverted to skin, reduced stroke volume).
- **Altitude** — submax HR elevated for a given workload; max HR falls ~1.7 bpm per 1000 m.
- **Dehydration** — ~graded HR rise (commonly cited ~3 bpm per 1% body-mass loss; a rule of thumb derived from the drift literature, not a hard constant).
- **Caffeine** — small (~3 bpm), inconsistent.
- **Illness / psychological stress / poor sleep** — elevate resting and exercise HR.

**Rule:** cross-check RPE and pace/power before calling a session too hard off HR alone. Flag the likely confound in the review.

> Rowell (1974), *Physiol Rev* 54(1):75-159 [verified]. Mourot (2018), *Front Physiol* 9:972 [verified]. Montain & Coyle (1992) [verified]. Grinberg et al. (2022), *Appl Physiol Nutr Metab* [verified, effect small/mixed].

**Illness exception — this one is a STOP, not a confound to work around:** fever or resting HR >10 bpm above baseline = do not train (myocarditis risk). See `protocols.md` §1.

---

## Quick-reference table

| Context | Primary anchor | Cross-check | Trap to avoid |
|---|---|---|---|
| Intervals <3-5 min | Pace / power / RPE | HR (post-hoc, coarse) | Reading HR lag as under-performance |
| Long steady efforts | Pace / power / RPE | HR + decoupling | Chasing HR down through cardiac drift |
| OW / sea swim | HR (or RPE) | Effort-adjusted pace (−10-15 s/100m) | Judging off pool pace bands |
| Bike | Power | Bike-specific HR | Applying run HR zones to the bike |
| Any hot/altitude/ill/stressed session | Pace / power / RPE | HR (expect it elevated) | Calling it overcooked off raw HR |
| Steady aerobic, normal conditions | HR ≈ RPE ≈ pace all agree | — | Overthinking it |

**The through-line:** HR is the honest anchor for *steady* aerobic work in *normal* conditions. The moment the effort is short, long, in water, on the bike, or in a confounding environment, an external-load or perceptual anchor is more trustworthy — and the reviewer's job is to name which one and why, not to default to whichever metric looks worst.

---

## References (all verified against primary sources)

1. Borg GA (1982). Psychophysical bases of perceived exertion. *Med Sci Sports Exerc* 14(5):377-381.
2. Chen MJ, Fan X, Moe ST (2002). Criterion-related validity of the Borg RPE scale: a meta-analysis. *J Sports Sci* 20(11):873-899.
3. Impellizzeri FM, Marcora SM, Coutts AJ (2019). Internal and External Training Load: 15 Years On. *Int J Sports Physiol Perform* 14(2):270-273. (See also Impellizzeri, Rampinini & Marcora 2005, *J Sports Sci* 23(6):583-592.)
4. Buchheit M, Laursen PB (2013). High-Intensity Interval Training, Part I: Cardiopulmonary Emphasis. *Sports Med* 43(5):313-338.
5. Sandford GN, Laursen PB, Buchheit M (2021). Anaerobic Speed/Power Reserve and Sport Performance. *Sports Med* 51(10):2017-2028.
6. Coyle EF, González-Alonso J (2001). Cardiovascular drift: new perspective. *Exerc Sport Sci Rev* 29(2):88-92.
7. Wingo JE, Lafrenz AJ, Ganio MS, Edwards GL, Cureton KJ (2005). Cardiovascular drift is related to reduced VO2max during heat stress. *Med Sci Sports Exerc* 37(2):248-255.
8. Montain SJ, Coyle EF (1992). Influence of graded dehydration on hyperthermia and cardiovascular drift. *J Appl Physiol* 73(4):1340-1350.
9. Toussaint HM et al. (1989). Effect of a triathlon wet suit on drag during swimming. *Med Sci Sports Exerc* 21(3):325-328.
10. Chatard JC, Senegas X, Selles M, Dreanot P, Geyssant A (1995). Wet suit effect: swimmers vs triathletes. *Med Sci Sports Exerc* 27(4):580-586.
11. Chatard JC, Millet G (1996). Effects of wetsuit use in swimming events. *Sports Med* 22(2):70-75.
12. Cortesi M, Gatta G (2015). Effect of the Swimmer's Head Position on Passive Drag. *J Hum Kinet*.
13. Born DP et al. (2021). Turn Fast and Win. *Sports* (Basel).
14. Millet GP, Vleck VE, Bentley DJ (2009). Physiological Differences Between Cycling and Running. *Sports Med* 39(3):179-206.
15. Basset FA, Boulay MR (2000). Specificity of treadmill and cycle ergometer tests. *Eur J Appl Physiol*.
16. Kasiak P et al. (2023). Validity of Maximal Heart Rate Prediction Models among Runners and Cyclists. *J Clin Med*.
17. Rowell LB (1974). Human cardiovascular adjustments to exercise and thermal stress. *Physiol Rev* 54(1):75-159.
18. Mourot L (2018). Limitation of Maximal Heart Rate in Hypoxia. *Front Physiol* 9:972.
19. Grinberg N et al. (2022). Caffeinated energy drinks & cardiovascular responses during exercise: SR & meta-analysis of RCTs. *Appl Physiol Nutr Metab*.

*Aerobic decoupling / EF: Friel J & TrainingPeaks (coaching convention, not a validated lab threshold). Salt-water density: physics (seawater ~1.025 g/cm³), not a swim-pace trial.*
