import fs from "node:fs";
import { PROFILE_PATH } from "./paths";

export interface AthleteProfile {
  ftpW: number | null;
  ftpWkg: number | null;
  cssPace: string | null;
  thresholdPace: string | null; // run threshold pace/km
  maxHr: number | null;
  weightKg: number | null;
}

function num(s: string | undefined): number | null {
  if (!s) return null;
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : null;
}

export function loadProfile(): AthleteProfile | null {
  if (!fs.existsSync(PROFILE_PATH)) return null;
  const raw = fs.readFileSync(PROFILE_PATH, "utf8");
  return {
    ftpW: num(raw.match(/FTP:\*\*\s*\*?\*?(\d+)W/)?.[1]),
    ftpWkg: num(raw.match(/(\d\.\d)\s*W\/kg/)?.[1]),
    cssPace: raw.match(/CSS[^:]*:\*?\*?\s*([~\d:\-]+)\/?100m/)?.[1] ?? null,
    thresholdPace:
      raw.match(/Threshold pace:\*?\*?\s*~?([\d:\-]+)\/km/)?.[1] ?? null,
    maxHr: num(raw.match(/Max HR[^:]*:\*?\*?\s*(\d+)/)?.[1]),
    weightKg: num(raw.match(/Weight:\*?\*?\s*(\d+)/)?.[1]),
  };
}
