import { loadES } from "./eightSleep";
import { loadGarminAll } from "./garmin";

export interface ReadinessDay {
  date: string;
  esHrv: number | null;
  garminHrv: number | null;
  esRhr: number | null;
  garminRhr: number | null;
  esSleepScore: number | null;
  garminSleepScore: number | null;
  readiness: number | null; // 0-100 garmin score
  readinessLevel: string | null;
  recoveryTime: number | null;
  acuteLoad: number | null;
}

export function buildReadinessSeries(days = 28): ReadinessDay[] {
  const es = loadES();
  const garmin = loadGarminAll();
  const esMap = new Map(es.map((d) => [d.date, d]));
  const garminMap = new Map(garmin.map((d) => [d.date, d]));
  const dates = new Set([...esMap.keys(), ...garminMap.keys()]);
  const sorted = [...dates].sort();
  const last = sorted.slice(-days);
  return last.map((date) => {
    const e = esMap.get(date);
    const g = garminMap.get(date);
    return {
      date,
      esHrv: e?.hrv ?? null,
      garminHrv: g?.hrv ?? null,
      esRhr: e?.restingHr ?? null,
      garminRhr: g?.restingHr ?? null,
      esSleepScore: e?.score ?? null,
      garminSleepScore: g?.sleepScore ?? null,
      readiness: g?.readiness ?? null,
      readinessLevel: g?.readinessLevel ?? null,
      recoveryTime: g?.recoveryTime ?? null,
      acuteLoad: g?.acuteLoad ?? null,
    };
  });
}

export type Tier = "READY" | "MODERATE" | "REST";

export function tierFromReadiness(r: ReadinessDay | undefined): Tier {
  if (!r) return "MODERATE";
  if (r.readiness !== null) {
    if (r.readiness >= 75) return "READY";
    if (r.readiness >= 50) return "MODERATE";
    return "REST";
  }
  // Fallback from HRV signal
  const hrv = r.esHrv ?? r.garminHrv;
  if (hrv && hrv >= 100) return "READY";
  if (hrv && hrv < 80) return "REST";
  return "MODERATE";
}

export function todayReadiness(series: ReadinessDay[]): ReadinessDay | undefined {
  return series[series.length - 1];
}
