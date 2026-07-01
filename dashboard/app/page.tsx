import { format } from "date-fns";
import { Header } from "@/components/Header";
import { TodaySessionCard } from "@/components/TodaySessionCard";
import { RaceCountdownCard } from "@/components/RaceCountdownCard";
import { ReadinessCard } from "@/components/ReadinessCard";
import { TrendChart } from "@/components/TrendChart";
import { DisciplineRadar } from "@/components/DisciplineRadar";
import { RecentReviewsCard } from "@/components/RecentReviewsCard";
import { WeekCalendar } from "@/components/WeekCalendar";
import { AcuteLoadCard } from "@/components/AcuteLoadCard";
import { PhaseGantt } from "@/components/PhaseGantt";
import { AthleteStatsCard } from "@/components/AthleteStatsCard";
import { HeartRateZonesCard } from "@/components/HeartRateZonesCard";
import { loadRenphoReadings, buildMetricSeries } from "@/lib/renpho";
import { loadCurrentGoal } from "@/lib/goals";
import { buildReadinessSeries, todayReadiness } from "@/lib/readiness";
import { loadReviews, reviewsForToday } from "@/lib/reviews";
import { parsePlan, currentWeek } from "@/lib/plan";
import { actualVolumeForWeek } from "@/lib/weeklyVolume";
import { plannedVolumeForWeek } from "@/lib/plannedVolume";
import { loadProfile } from "@/lib/profile";
import { thisWeekZoneDistribution } from "@/lib/zones";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default function HomePage() {
  noStore();
  const goal = loadCurrentGoal();
  const reviews = loadReviews();
  const todayReviews = reviewsForToday(reviews);
  const series = buildReadinessSeries(28);
  const today = todayReadiness(series);
  let plan: ReturnType<typeof parsePlan> | null = null;
  try {
    plan = parsePlan();
  } catch {
    plan = null;
  }
  const week = plan ? currentWeek(plan) : undefined;
  const todayDow = format(new Date(), "EEE");
  const todayMon = format(new Date(), "MMM");
  const todayNum = format(new Date(), "d");
  const todaySessions =
    week?.sessions.filter((s) => {
      const day = s.day;
      const dayNumRe = new RegExp(`\\b${todayNum}\\b`);
      return (
        day.toLowerCase().includes(todayDow.toLowerCase()) &&
        day.includes(todayMon) &&
        dayNumRe.test(day)
      );
    }) ?? [];
  const plannedVol = plannedVolumeForWeek(week);
  const actualVol = actualVolumeForWeek();
  const profile = loadProfile();
  const zoneDist = thisWeekZoneDistribution();
  const renpho = loadRenphoReadings();
  const bcWeight = buildMetricSeries(renpho, "weight_kg", "kg", 1);
  const bcBodyFat = buildMetricSeries(renpho, "body_fat_pct", "pp", 1);
  const bcLean = buildMetricSeries(renpho, "lean_body_mass_kg", "kg", 2);
  const bcBmi = buildMetricSeries(renpho, "bmi", "", 1);
  const bcHydration = buildMetricSeries(renpho, "water_pct", "pp", 1);
  const bcVisceral = buildMetricSeries(renpho, "visceral_fat_level", "", 0);
  const bcLatestDate = renpho[renpho.length - 1]?.date;
  const bcDaysSince =
    bcLatestDate
      ? Math.floor(
          (Date.now() - new Date(bcLatestDate + "T00:00:00Z").getTime()) /
            (1000 * 60 * 60 * 24),
        )
      : null;
  const bcSubtitle =
    bcDaysSince == null
      ? "Renpho · no readings"
      : bcDaysSince === 0
        ? "Renpho · weighed today"
        : bcDaysSince === 1
          ? "Renpho · 1 day ago"
          : `Renpho · ${bcDaysSince}d ago${bcDaysSince > 7 ? " ⚠" : ""}`;

  const hrvData = series.map((d) => ({
    date: d.date.slice(5),
    primary: d.esHrv,
    secondary: d.garminHrv,
  }));
  const rhrData = series.map((d) => ({
    date: d.date.slice(5),
    primary: d.esRhr,
    secondary: d.garminRhr,
  }));
  const sleepData = series.map((d) => ({
    date: d.date.slice(5),
    primary: d.esSleepScore,
    secondary: d.garminSleepScore,
  }));

  const latestEsHrv = [...series]
    .reverse()
    .find((d) => d.esHrv !== null)?.esHrv;
  const latestRhr = [...series].reverse().find((d) => d.esRhr !== null)?.esRhr;
  const latestSleep = [...series]
    .reverse()
    .find((d) => d.esSleepScore !== null)?.esSleepScore;

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-8">
      <Header
        athleteName={process.env.NEXT_PUBLIC_ATHLETE_NAME || "Athlete"}
        todayReview={todayReviews[0]}
      />

      <div className="grid grid-cols-12 items-start gap-4">
        {/* Row 1 — at-a-glance */}
        <div className="col-span-12 lg:col-span-4">
          <TodaySessionCard sessions={todaySessions} />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 grid h-full">
          <RaceCountdownCard goal={goal} />
        </div>
        <div className="col-span-12 sm:col-span-6 lg:col-span-4 grid h-full">
          <ReadinessCard today={today} />
        </div>

        {/* Row 2 — Phase Gantt (full width) */}
        <div className="col-span-12">
          <PhaseGantt plan={plan} />
        </div>

        {/* Row 3 — Week calendar (full width, 7 days) */}
        <div className="col-span-12">
          <WeekCalendar week={week} />
        </div>

        {/* Row 4 — Trends row */}
        <div className="col-span-6 md:col-span-3 grid h-full">
          <TrendChart
            title="HRV · 28d"
            subtitle="Eight Sleep · Garmin"
            data={hrvData}
            primaryLabel="Eight Sleep"
            secondaryLabel="Garmin"
            current={latestEsHrv}
          />
        </div>
        <div className="col-span-6 md:col-span-3 grid h-full">
          <TrendChart
            title="Resting HR · 28d"
            subtitle="Eight Sleep · Garmin"
            data={rhrData}
            primaryLabel="Eight Sleep"
            secondaryLabel="Garmin"
            current={latestRhr}
          />
        </div>
        <div className="col-span-6 md:col-span-3 grid h-full">
          <TrendChart
            title="Sleep score · 28d"
            subtitle="Eight Sleep · Garmin"
            data={sleepData}
            primaryLabel="Eight Sleep"
            secondaryLabel="Garmin"
            domain={[40, 100]}
            current={latestSleep}
          />
        </div>
        <div className="col-span-6 md:col-span-3 grid h-full">
          <AcuteLoadCard series={series} />
        </div>

        {/* Row 4.5 — Body composition (6 widgets across on desktop) */}
        <div className="col-span-6 md:col-span-4 lg:col-span-2 grid h-full">
          <TrendChart
            title="Weight"
            subtitle={bcSubtitle}
            data={bcWeight.data}
            primaryLabel="Weight"
            current={bcWeight.current}
            trend={bcWeight.trend ?? undefined}
            unit="kg"
            precision={1}
          />
        </div>
        <div className="col-span-6 md:col-span-4 lg:col-span-2 grid h-full">
          <TrendChart
            title="Body fat"
            subtitle={bcSubtitle}
            data={bcBodyFat.data}
            primaryLabel="Body fat %"
            current={bcBodyFat.current}
            trend={bcBodyFat.trend ?? undefined}
            unit="%"
            precision={1}
          />
        </div>
        <div className="col-span-6 md:col-span-4 lg:col-span-2 grid h-full">
          <TrendChart
            title="Lean body mass"
            subtitle={bcSubtitle}
            data={bcLean.data}
            primaryLabel="LBM"
            current={bcLean.current}
            trend={bcLean.trend ?? undefined}
            unit="kg"
            precision={2}
          />
        </div>
        <div className="col-span-6 md:col-span-4 lg:col-span-2 grid h-full">
          <TrendChart
            title="BMI"
            subtitle={`${bcSubtitle} · 18.5-25 ok`}
            data={bcBmi.data}
            primaryLabel="BMI"
            current={bcBmi.current}
            trend={bcBmi.trend ?? undefined}
            domain={[18, 30]}
            precision={1}
          />
        </div>
        <div className="col-span-6 md:col-span-4 lg:col-span-2 grid h-full">
          <TrendChart
            title="Hydration"
            subtitle={`${bcSubtitle} · >55% ok`}
            data={bcHydration.data}
            primaryLabel="Body water %"
            current={bcHydration.current}
            trend={bcHydration.trend ?? undefined}
            unit="%"
            domain={[45, 65]}
            precision={1}
          />
        </div>
        <div className="col-span-12 md:col-span-4 lg:col-span-2 grid h-full">
          <TrendChart
            title="Visceral fat"
            subtitle={`${bcSubtitle} · <10 ok`}
            data={bcVisceral.data}
            primaryLabel="Visceral fat level"
            current={bcVisceral.current}
            trend={bcVisceral.trend ?? undefined}
            domain={[0, 12]}
            precision={0}
          />
        </div>

        {/* Row 5 — HR Zones · Discipline · Athlete stats */}
        <div className="col-span-12 md:col-span-4 grid h-full">
          <HeartRateZonesCard distribution={zoneDist} />
        </div>
        <div className="col-span-12 md:col-span-4 grid h-full">
          <DisciplineRadar planned={plannedVol} actual={actualVol} />
        </div>
        <div className="col-span-12 md:col-span-4 grid h-full">
          <AthleteStatsCard profile={profile} />
        </div>

        {/* Row 6 — Recent reviews (full width) */}
        <div className="col-span-12">
          <RecentReviewsCard reviews={reviews} />
        </div>
      </div>

      <footer className="mt-10 text-center text-[10px] text-zinc-700">
        Coach Dashboard · refreshed at build · data via Strava, Eight Sleep,
        Garmin
      </footer>
    </main>
  );
}
