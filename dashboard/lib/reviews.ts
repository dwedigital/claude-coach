import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { REVIEWS_DIR } from "./paths";

function dateStr(v: unknown): string | undefined {
  if (!v) return undefined;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return String(v);
}

function stripFrontmatter(raw: string): string {
  // Robust: strip leading `---\n...\n---` block from a file
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return raw;
  return raw.slice(m[0].length);
}

function firstHeading(body: string): string | undefined {
  const m = body.match(/^#\s+(.+?)$/m);
  return m?.[1]?.trim();
}

export interface Review {
  file: string;
  date: string;
  type?: string;
  session?: string;
  planned?: string;
  actual?: string;
  verdict?: string;
  stravaId?: string | number;
  body: string;
}

export function loadReviews(): Review[] {
  if (!fs.existsSync(REVIEWS_DIR)) return [];
  const files = fs
    .readdirSync(REVIEWS_DIR)
    .filter((f) => f.endsWith(".md"))
    .sort()
    .reverse();
  const out: Review[] = [];
  for (const f of files) {
    const full = path.join(REVIEWS_DIR, f);
    const raw = fs.readFileSync(full, "utf8");
    // Always strip frontmatter manually to ensure body is clean — even if YAML parsing failed
    const cleanBody = stripFrontmatter(raw);

    // Always parse frontmatter manually with regex (more resilient than YAML)
    let date: string | undefined;
    let type: string | undefined;
    let session: string | undefined;
    let planned: string | undefined;
    let actual: string | undefined;
    let verdict: string | undefined;
    let stravaId: string | number | undefined;

    const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (fmMatch) {
      const fm = fmMatch[1];
      const get = (key: string) => {
        const r = new RegExp(`^${key}:\\s*(.+?)$`, "m").exec(fm);
        return r ? r[1].trim() : undefined;
      };
      date = get("date");
      type = get("type");
      session = get("session");
      planned = get("planned");
      actual = get("actual");
      verdict = get("verdict");
      stravaId = get("strava_id") ?? get("strava_ids");
    }

    // Also try gray-matter — if it succeeds, prefer its parsed values (it strips quotes etc)
    try {
      const { data } = matter(raw);
      if (data.date) date = dateStr(data.date) ?? date;
      if (data.type) type = String(data.type);
      if (data.session) session = String(data.session);
      if (data.planned) planned = String(data.planned);
      if (data.actual) actual = String(data.actual);
      if (data.verdict) verdict = String(data.verdict);
      if (data.strava_id) stravaId = data.strava_id;
      if (data.strava_ids) stravaId = data.strava_ids;
    } catch {
      // YAML failed — keep the regex-parsed values
    }

    out.push({
      file: full,
      date: date ?? f.slice(0, 10),
      type,
      session: session ?? firstHeading(cleanBody),
      planned,
      actual,
      verdict,
      stravaId,
      body: cleanBody,
    });
  }
  return out.filter((r) => r.date);
}

export function reviewsForToday(reviews: Review[]): Review[] {
  const today = new Date().toISOString().slice(0, 10);
  return reviews.filter((r) => r.date === today);
}
