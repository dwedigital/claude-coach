import { loadActivities, StravaActivity } from "./strava";

export interface DisciplineVolume {
  swimMin: number;
  bikeMin: number;
  runMin: number;
  strengthMin: number;
  totalMin: number;
}

export interface ActualMinutes {
  Swim: number;
  Bike: number;
  Run: number;
  Strength: number;
}

export function actualVolumeForWeek(): ActualMinutes {
  const v = thisWeekVolume();
  return {
    Swim: Math.round(v.swimMin),
    Bike: Math.round(v.bikeMin),
    Run: Math.round(v.runMin),
    Strength: Math.round(v.strengthMin),
  };
}

export function getWeekRange(): { start: Date; end: Date } {
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sun
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const start = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + mondayOffset),
  );
  const end = new Date(start.getTime() + 7 * 86_400_000);
  return { start, end };
}

function classify(a: StravaActivity): keyof DisciplineVolume {
  const t = a.type.toLowerCase();
  if (t.includes("swim")) return "swimMin";
  if (t.includes("ride")) return "bikeMin";
  if (t.includes("run")) return "runMin";
  return "strengthMin";
}

export function thisWeekVolume(): DisciplineVolume {
  const acts = loadActivities();
  const { start, end } = getWeekRange();
  const v: DisciplineVolume = {
    swimMin: 0,
    bikeMin: 0,
    runMin: 0,
    strengthMin: 0,
    totalMin: 0,
  };
  for (const a of acts) {
    const d = new Date(a.start_date_local);
    if (d < start || d >= end) continue;
    const m = a.moving_time / 60;
    const cls = classify(a);
    v[cls] = (v[cls] as number) + m;
    v.totalMin += m;
  }
  return v;
}
