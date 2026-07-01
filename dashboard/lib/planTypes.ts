export interface PlanSession {
  day: string; // e.g. "Wed Jul 1"
  time?: string;
  session: string;
  duration?: string;
  discipline?: string;
  intensity?: string;
  details: string;
  done: boolean;
}

export interface PlanWeek {
  weekNumber: number;
  title: string; // full heading
  intent?: string;
  sessions: PlanSession[];
}

export interface PlanDoc {
  raceName: string;
  raceDate: string; // ISO YYYY-MM-DD
  weeks: PlanWeek[];
}

/** Clean session text for display — drops struck-through content, arrows, bold markers */
export function cleanSessionText(s: string): string {
  return s
    .replace(/~~[^~]+~~/g, "") // remove strikethrough content
    .replace(/→/g, "")
    .replace(/\*\*/g, "")
    .replace(/\s+/g, " ")
    .trim();
}
