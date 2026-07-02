import fs from "node:fs";
import { PLAN_PATH } from "./paths";
import type { PlanSession, PlanWeek, PlanDoc } from "./planTypes";

// Re-export so existing consumers can import from "@/lib/plan"
export type { PlanSession, PlanWeek, PlanDoc };
export { cleanSessionText } from "./planTypes";

const RACE_RE = /Target Event:\s*([^\n]+)/i;
const RACE_DATE_RE = /^([^—]+?)—\s*(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/m;

function monthIndex(name: string): number {
  const m: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11,
  };
  return m[name.toLowerCase().slice(0, 4)] ?? m[name.toLowerCase().slice(0, 3)];
}

export function parsePlan(): PlanDoc {
  const raw = fs.readFileSync(PLAN_PATH, "utf8");
  const titleMatch = raw.match(/^#\s+Training Plan:\s*([^\n]+)/m);
  const planTitle = titleMatch?.[1] ?? "Training Plan";
  const eventMatch = raw.match(RACE_RE);
  const eventStr = (eventMatch?.[1] ?? planTitle).replace(/\*\*/g, "").trim();

  // Parse race date from event string e.g. "City 10K Run (...) ... 12 October 2025"
  let raceDate = "";
  const dateMatch = raw.match(/(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})/);
  if (dateMatch) {
    const day = parseInt(dateMatch[1]);
    const mi = monthIndex(dateMatch[2]);
    const year = parseInt(dateMatch[3]);
    if (!Number.isNaN(mi)) {
      const d = new Date(Date.UTC(year, mi, day));
      raceDate = d.toISOString().slice(0, 10);
    }
  }

  const weeks: PlanWeek[] = [];
  const weekHeads = [...raw.matchAll(/^##\s+Week\s+(\d+)[^\n]*$/gm)];
  for (let i = 0; i < weekHeads.length; i++) {
    const head = weekHeads[i];
    const start = head.index! + head[0].length;
    const end =
      i + 1 < weekHeads.length ? weekHeads[i + 1].index! : raw.length;
    const block = raw.slice(start, end);
    const weekNumber = parseInt(head[1]);
    const title = head[0].replace(/^##\s+/, "");

    // Intent paragraph (italic-bold prefix)
    const intentMatch = block.match(/\*\*Phase intent:\*\*\s*([^\n]+)/);
    const intent = intentMatch?.[1];

    // Markdown table rows
    const sessions: PlanSession[] = [];
    const tableRows = block.match(/^\|[^\n]+\|$/gm) || [];
    for (const row of tableRows) {
      const cells = row
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());
      // Skip header / separator rows
      if (cells[0]?.toLowerCase().startsWith("day")) continue;
      if (cells[0]?.match(/^-+$/)) continue;
      if (cells.length < 5) continue;
      const day = cells[0].replace(/\*\*/g, "");
      let time: string | undefined;
      let session: string;
      let duration: string | undefined;
      let discipline: string | undefined;
      let intensity: string | undefined;
      let details: string;
      if (cells.length >= 7) {
        // Format: Day | Time | Session | Duration | Discipline | Intensity | Details
        time = cells[1];
        session = cells[2];
        duration = cells[3];
        discipline = cells[4];
        intensity = cells[5];
        details = cells[6];
      } else {
        // Older format: Day | Session | Duration | Discipline | Intensity | Details
        session = cells[1];
        duration = cells[2];
        discipline = cells[3];
        intensity = cells[4];
        details = cells[5];
      }
      const done = /DONE|✓|✅/i.test(details);
      sessions.push({
        day,
        time,
        session: session.replace(/\*\*/g, ""),
        duration,
        discipline,
        intensity,
        details,
        done,
      });
    }

    if (sessions.length) weeks.push({ weekNumber, title, intent, sessions });
  }

  return { raceName: eventStr, raceDate, weeks };
}

export function currentWeek(plan: PlanDoc): PlanWeek | undefined {
  // Parse the date range from each week title and pick the one containing today
  const today = new Date();
  for (const w of plan.weeks) {
    const range = w.title.match(/(\w+)\s+(\d+)\s*-\s*(?:(\w+)\s+)?(\d+)/);
    if (!range) continue;
    const m1 = monthIndex(range[1]);
    const d1 = parseInt(range[2]);
    const m2 = range[3] ? monthIndex(range[3]) : m1;
    const d2 = parseInt(range[4]);
    if (Number.isNaN(m1) || Number.isNaN(m2)) continue;
    const year = today.getUTCFullYear();
    const start = new Date(Date.UTC(year, m1, d1));
    const end = new Date(Date.UTC(year, m2, d2, 23, 59, 59));
    if (today >= start && today <= end) return w;
  }
  return undefined;
}
