import { loadActivities, StravaActivity } from "./strava";
import { getWeekRange } from "./weeklyVolume";

export interface HrZone {
  zone: "Z1" | "Z2" | "Z3" | "Z4" | "Z5";
  name: string;
  hrMin: number;
  hrMax: number;
  pace: string;
  rpe: string;
  color: string;
}

// From athlete/profile.md — VO2 lab test 2025-03-28
export const ZONES: HrZone[] = [
  { zone: "Z1", name: "Recovery", hrMin: 0, hrMax: 124, pace: ">5:30/km", rpe: "1-2", color: "#52525b" },
  { zone: "Z2", name: "Endurance", hrMin: 125, hrMax: 145, pace: "5:00-5:30/km", rpe: "3-4", color: "#FFB07A" },
  { zone: "Z3", name: "Tempo", hrMin: 146, hrMax: 153, pace: "4:20-4:50/km", rpe: "5-6", color: "#FF8E6D" },
  { zone: "Z4", name: "Threshold", hrMin: 154, hrMax: 169, pace: "4:00-4:15/km", rpe: "7-8", color: "#FF6B47" },
  { zone: "Z5", name: "VO2max+", hrMin: 170, hrMax: 220, pace: "<4:00/km", rpe: "9-10", color: "#ef4444" },
];

export function zoneForHr(hr: number): HrZone | undefined {
  return ZONES.find((z) => hr >= z.hrMin && hr <= z.hrMax);
}

export interface WeekZoneDistribution {
  byZone: Record<string, number>; // minutes per zone
  totalMin: number;
  easyMin: number; // Z1 + Z2
  hardMin: number; // Z4 + Z5
  easyPct: number;
  hardPct: number;
}

export function thisWeekZoneDistribution(offsetWeeks = 0): WeekZoneDistribution {
  const acts = loadActivities();
  const { start, end } = getWeekRange(offsetWeeks);
  const byZone: Record<string, number> = {
    Z1: 0,
    Z2: 0,
    Z3: 0,
    Z4: 0,
    Z5: 0,
  };
  let total = 0;
  for (const a of acts as StravaActivity[]) {
    const d = new Date(a.start_date_local);
    if (d < start || d >= end) continue;
    if (!a.average_heartrate || a.moving_time < 60) continue;
    const z = zoneForHr(a.average_heartrate);
    if (!z) continue;
    const mins = a.moving_time / 60;
    byZone[z.zone] += mins;
    total += mins;
  }
  const easy = byZone.Z1 + byZone.Z2;
  const hard = byZone.Z4 + byZone.Z5;
  return {
    byZone,
    totalMin: total,
    easyMin: easy,
    hardMin: hard,
    easyPct: total > 0 ? (easy / total) * 100 : 0,
    hardPct: total > 0 ? (hard / total) * 100 : 0,
  };
}
