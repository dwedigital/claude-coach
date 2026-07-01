import fs from "node:fs";
import path from "node:path";
import { RENPHO_DIR } from "./paths";

export interface RenphoReading {
  date: string; // YYYY-MM-DD
  weight_kg: number | null;
  bmi: number | null;
  body_fat_pct: number | null;
  water_pct: number | null;
  muscle_pct: number | null;
  bone_pct: number | null;
  bmr_kcal: number | null;
  visceral_fat_level: number | null;
  subcutaneous_fat_pct: number | null;
  protein_pct: number | null;
  lean_body_mass_kg: number | null;
  fat_free_weight_kg: number | null;
}

interface RawReading {
  weight_kg?: number | null;
  bmi?: number | null;
  body_fat_pct?: number | null;
  water_pct?: number | null;
  muscle_pct?: number | null;
  bone_pct?: number | null;
  bmr_kcal?: number | null;
  visceral_fat_level?: number | null;
  subcutaneous_fat_pct?: number | null;
  protein_pct?: number | null;
  lean_body_mass_kg?: number | null;
  fat_free_weight_kg?: number | null;
}

interface RawFile {
  date: string;
  readings: RawReading[];
}

/** Load all Renpho readings, one per file. Newest last (chronological). */
export function loadRenphoReadings(): RenphoReading[] {
  if (!fs.existsSync(RENPHO_DIR)) return [];
  const files = fs
    .readdirSync(RENPHO_DIR)
    .filter((f) => f.endsWith(".json"))
    .sort();
  const out: RenphoReading[] = [];
  for (const f of files) {
    try {
      const raw = JSON.parse(
        fs.readFileSync(path.join(RENPHO_DIR, f), "utf8"),
      ) as RawFile;
      const first = raw.readings?.[0];
      if (!first) continue;
      out.push({
        date: raw.date,
        weight_kg: first.weight_kg ?? null,
        bmi: first.bmi ?? null,
        body_fat_pct: first.body_fat_pct ?? null,
        water_pct: first.water_pct ?? null,
        muscle_pct: first.muscle_pct ?? null,
        bone_pct: first.bone_pct ?? null,
        bmr_kcal: first.bmr_kcal ?? null,
        visceral_fat_level: first.visceral_fat_level ?? null,
        subcutaneous_fat_pct: first.subcutaneous_fat_pct ?? null,
        protein_pct: first.protein_pct ?? null,
        lean_body_mass_kg: first.lean_body_mass_kg ?? null,
        fat_free_weight_kg: first.fat_free_weight_kg ?? null,
      });
    } catch {
      // Skip malformed files silently
    }
  }
  return out;
}

export interface BodyCompSummary {
  latest: RenphoReading | null;
  previous: RenphoReading | null; // The prior reading, for delta
  monthAgo: RenphoReading | null; // Closest reading ~30 days before latest
  allTimeFirst: RenphoReading | null; // Oldest reading in the log
  daysSinceLatest: number | null;
  readings: RenphoReading[]; // All, chronological
}

export interface RenphoSeriesPoint {
  date: string;
  primary: number | null;
}

export interface RenphoMetric {
  data: RenphoSeriesPoint[];
  current: number | null;
  trend: string | null; // e.g. "−0.1 kg vs 30d"
}

/** Series (last N days) + current + 30d-delta trend for a given field. */
export function buildMetricSeries(
  readings: RenphoReading[],
  field: keyof RenphoReading,
  unit: string,
  precision = 1,
  days = 180,
): RenphoMetric {
  if (!readings.length) {
    return { data: [], current: null, trend: null };
  }
  const cutoff = new Date();
  cutoff.setUTCDate(cutoff.getUTCDate() - days);
  const data = readings
    .filter((r) => new Date(r.date + "T00:00:00Z") >= cutoff)
    .map((r) => {
      const v = r[field];
      return {
        date: r.date.slice(5),
        primary: typeof v === "number" ? v : null,
      };
    });

  const latest = readings[readings.length - 1];
  const current = typeof latest[field] === "number" ? (latest[field] as number) : null;

  // Delta vs closest reading ~30 days before latest
  const latestDate = new Date(latest.date + "T00:00:00Z");
  const target = new Date(latestDate);
  target.setUTCDate(target.getUTCDate() - 30);
  let monthAgo: RenphoReading | null = null;
  let bestDelta = Infinity;
  for (const r of readings) {
    if (r.date === latest.date) continue;
    const d = new Date(r.date + "T00:00:00Z");
    const delta = Math.abs(d.getTime() - target.getTime());
    if (delta < bestDelta) {
      bestDelta = delta;
      monthAgo = r;
    }
  }
  const prior = monthAgo && typeof monthAgo[field] === "number" ? (monthAgo[field] as number) : null;
  let trend: string | null = null;
  if (current != null && prior != null) {
    const diff = current - prior;
    if (Math.abs(diff) < Math.pow(10, -precision - 1)) {
      trend = `±0 ${unit} vs 30d`;
    } else {
      const sign = diff > 0 ? "+" : "−";
      trend = `${sign}${Math.abs(diff).toFixed(precision)} ${unit} vs 30d`;
    }
  }

  return { data, current, trend };
}

export function summarise(readings: RenphoReading[]): BodyCompSummary {
  if (!readings.length) {
    return {
      latest: null,
      previous: null,
      monthAgo: null,
      allTimeFirst: null,
      daysSinceLatest: null,
      readings,
    };
  }
  const latest = readings[readings.length - 1];
  const previous =
    readings.length > 1 ? readings[readings.length - 2] : null;
  const allTimeFirst = readings[0];

  const latestDate = new Date(latest.date + "T00:00:00Z");
  const now = new Date();
  const daysSinceLatest = Math.floor(
    (now.getTime() - latestDate.getTime()) / (1000 * 60 * 60 * 24),
  );

  // Find closest reading ~30 days before latest
  const target = new Date(latestDate);
  target.setUTCDate(target.getUTCDate() - 30);
  let monthAgo: RenphoReading | null = null;
  let bestDelta = Infinity;
  for (const r of readings) {
    if (r.date === latest.date) continue;
    const d = new Date(r.date + "T00:00:00Z");
    const delta = Math.abs(d.getTime() - target.getTime());
    if (delta < bestDelta) {
      bestDelta = delta;
      monthAgo = r;
    }
  }

  return {
    latest,
    previous,
    monthAgo,
    allTimeFirst,
    daysSinceLatest,
    readings,
  };
}
