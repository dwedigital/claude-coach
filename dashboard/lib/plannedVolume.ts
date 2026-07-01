import { PlanWeek, PlanSession } from "./planTypes";

export interface DisciplineMinutes {
  Swim: number;
  Bike: number;
  Run: number;
  Strength: number;
}

/** Parse "30 min" / "1h" / "30-40 min" / "3-4h" / "1:30" → minutes */
export function parseDuration(d?: string): number {
  if (!d) return 0;
  const txt = d.toLowerCase().replace(/\s+/g, " ").trim();
  if (txt === "—" || txt === "-" || txt === "") return 0;

  // Range first: "30-40 min" or "3-4h" or "1-2 h"
  const range = txt.match(
    /(\d+(?:\.\d+)?)\s*-\s*(\d+(?:\.\d+)?)\s*(h|hr|hour|hours|min|m)?/,
  );
  if (range) {
    const lo = parseFloat(range[1]);
    const hi = parseFloat(range[2]);
    const unit = range[3] ?? "min";
    const mid = (lo + hi) / 2;
    return unit.startsWith("h") ? Math.round(mid * 60) : Math.round(mid);
  }

  // Hours with optional minutes: "1h30" / "1h 30 min" / "1.5h"
  const hMatch = txt.match(
    /(\d+(?:\.\d+)?)\s*h(?:r|our|ours)?\s*(\d+)?\s*(?:min|m)?/,
  );
  if (hMatch) {
    const h = parseFloat(hMatch[1]);
    const m = hMatch[2] ? parseInt(hMatch[2]) : 0;
    return Math.round(h * 60 + m);
  }

  // Colon time: "1:30"
  const colon = txt.match(/^(\d+):(\d+)/);
  if (colon) return parseInt(colon[1]) * 60 + parseInt(colon[2]);

  // Just minutes
  const mMatch = txt.match(/(\d+)\s*(min|m)?/);
  if (mMatch) return parseInt(mMatch[1]);

  return 0;
}

function classify(session: PlanSession): keyof DisciplineMinutes | null {
  const txt = (
    session.session +
    " " +
    (session.discipline ?? "")
  ).toLowerCase();
  if (txt.includes("rest")) return null;
  if (txt.includes("brick")) {
    // Brick splits — count as both bike + run; handled by caller
    return null;
  }
  if (txt.includes("swim")) return "Swim";
  if (txt.includes("bike") || txt.includes("ride") || txt.includes("cycle"))
    return "Bike";
  if (txt.includes("run") || txt.includes("jog")) return "Run";
  if (txt.includes("s&c") || txt.includes("strength") || txt.includes("gym"))
    return "Strength";
  return null;
}

export function plannedVolumeForWeek(week?: PlanWeek): DisciplineMinutes {
  const out: DisciplineMinutes = { Swim: 0, Bike: 0, Run: 0, Strength: 0 };
  if (!week) return out;
  for (const s of week.sessions) {
    const mins = parseDuration(s.duration);
    if (!mins) continue;
    const txt = (
      s.session +
      " " +
      (s.discipline ?? "")
    ).toLowerCase();
    if (txt.includes("rest")) continue;
    if (txt.includes("brick")) {
      // 60/40 split bike/run, rough
      out.Bike += Math.round(mins * 0.65);
      out.Run += Math.round(mins * 0.35);
      continue;
    }
    const c = classify(s);
    if (c) out[c] += mins;
  }
  return out;
}
