import fs from "node:fs";
import path from "node:path";
import { GARMIN_DIR } from "./paths";

export interface GarminDay {
  date: string; // YYYY-MM-DD
  hrv: number | null; // lastNightAvg
  hrvWeeklyAvg: number | null;
  hrvStatus: string | null;
  restingHr: number | null;
  readiness: number | null;
  readinessLevel: string | null;
  acuteLoad: number | null;
  recoveryTime: number | null; // minutes
  sleepScore: number | null;
}

function num(v: unknown): number | null {
  return typeof v === "number" ? v : null;
}

export function loadGarminAll(): GarminDay[] {
  if (!fs.existsSync(GARMIN_DIR)) return [];
  const files = fs
    .readdirSync(GARMIN_DIR)
    .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
    .sort();
  const out: GarminDay[] = [];
  for (const f of files) {
    try {
      const raw = JSON.parse(fs.readFileSync(path.join(GARMIN_DIR, f), "utf8"));
      const tr = Array.isArray(raw.training_readiness)
        ? raw.training_readiness[0]
        : raw.training_readiness;
      const rhrMap =
        raw.rhr?.allMetrics?.metricsMap?.WELLNESS_RESTING_HEART_RATE;
      const rhr = Array.isArray(rhrMap) && rhrMap[0]?.value;
      out.push({
        date: raw.date,
        hrv: num(raw.hrv?.hrvSummary?.lastNightAvg),
        hrvWeeklyAvg: num(raw.hrv?.hrvSummary?.weeklyAvg),
        hrvStatus: raw.hrv?.hrvSummary?.status ?? null,
        restingHr: typeof rhr === "number" ? rhr : null,
        readiness: num(tr?.score),
        readinessLevel: tr?.level ?? null,
        acuteLoad: num(tr?.acuteLoad),
        recoveryTime: num(tr?.recoveryTime),
        sleepScore: num(tr?.sleepScore),
      });
    } catch {
      // skip malformed
    }
  }
  return out;
}
