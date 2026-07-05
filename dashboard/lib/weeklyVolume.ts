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

export function actualVolumeForWeek(offsetWeeks = 0): ActualMinutes {
  const v = thisWeekVolume(offsetWeeks);
  return {
    Swim: Math.round(v.swimMin),
    Bike: Math.round(v.bikeMin),
    Run: Math.round(v.runMin),
    Strength: Math.round(v.strengthMin),
  };
}

// offsetWeeks shifts the Mon–Sun window: 0 = current week, -1 = last week, +1 = next.
export function getWeekRange(offsetWeeks = 0): { start: Date; end: Date } {
  const now = new Date();
  const day = now.getUTCDay(); // 0=Sun
  const mondayOffset = (day === 0 ? -6 : 1 - day) + offsetWeeks * 7;
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

export function thisWeekVolume(offsetWeeks = 0): DisciplineVolume {
  const acts = loadActivities();
  const { start, end } = getWeekRange(offsetWeeks);
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
