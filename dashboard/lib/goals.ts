import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { GOALS_DIR } from "./paths";

function dateStr(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v ?? "");
}

export interface Goal {
  date: string;
  event: string;
  status: string;
  body: string;
}

export function loadCurrentGoal(): Goal | null {
  if (!fs.existsSync(GOALS_DIR)) return null;
  const files = fs.readdirSync(GOALS_DIR).filter((f) => f.endsWith(".md"));
  const today = new Date().toISOString().slice(0, 10);
  const goals: Goal[] = [];
  for (const f of files) {
    const raw = fs.readFileSync(path.join(GOALS_DIR, f), "utf8");
    const { data, content } = matter(raw);
    if (!data.date) continue;
    const status = String(data.status ?? "active");
    if (status !== "active") continue;
    goals.push({
      date: dateStr(data.date),
      event: String(data.event ?? f),
      status,
      body: content,
    });
  }
  // Latest race in the future (or most recent if all past)
  const future = goals
    .filter((g) => g.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  if (future.length) return future[0];
  return goals.sort((a, b) => b.date.localeCompare(a.date))[0] ?? null;
}

export function daysUntil(date: string): number {
  const target = new Date(date + "T00:00:00Z");
  const now = new Date();
  const utcNow = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
  );
  return Math.ceil((target.getTime() - utcNow) / 86_400_000);
}
