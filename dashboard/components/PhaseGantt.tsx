import { PlanDoc, PlanWeek } from "@/lib/plan";

interface Props {
  plan: PlanDoc | null;
}

interface ParsedWeek {
  week: PlanWeek;
  start: Date;
  end: Date;
  phase: string;
  color: string;
}

const PHASE_COLORS: Record<string, string> = {
  recovery: "#52525b",
  return: "#6366f1",
  threshold: "#FFB07A",
  vo2: "#ef4444",
  sprint: "#ef4444",
  sharpen: "#FF6B47",
  taper: "#14b8a6",
  race: "#FF6B47",
  build: "#FF8E6D",
};

function monthIndex(name: string): number {
  const map: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, sept: 8, oct: 9, nov: 10, dec: 11,
  };
  return map[name.toLowerCase().slice(0, 3)] ?? -1;
}

function parsePhase(title: string): { phase: string; color: string } {
  const lower = title.toLowerCase();
  for (const key of Object.keys(PHASE_COLORS)) {
    if (lower.includes(key)) return { phase: key, color: PHASE_COLORS[key] };
  }
  return { phase: "build", color: "#FF8E6D" };
}

function parseWeeks(plan: PlanDoc): ParsedWeek[] {
  const year = new Date().getUTCFullYear();
  const out: ParsedWeek[] = [];
  for (const w of plan.weeks) {
    const range = w.title.match(/(\w+)\s+(\d+)\s*-\s*(?:(\w+)\s+)?(\d+)/);
    if (!range) continue;
    const m1 = monthIndex(range[1]);
    const d1 = parseInt(range[2]);
    const m2 = range[3] ? monthIndex(range[3]) : m1;
    const d2 = parseInt(range[4]);
    if (m1 < 0 || m2 < 0) continue;
    const start = new Date(Date.UTC(year, m1, d1));
    const end = new Date(Date.UTC(year, m2, d2));
    const { phase, color } = parsePhase(w.title);
    out.push({ week: w, start, end, phase, color });
  }
  return out;
}

export function PhaseGantt({ plan }: Props) {
  if (!plan || plan.weeks.length === 0) {
    return (
      <div className="card">
        <div className="text-xs text-text-subtle">Build phases</div>
        <div className="mt-2 text-sm text-text-muted">No plan loaded</div>
      </div>
    );
  }
  const parsed = parseWeeks(plan);
  if (parsed.length === 0) {
    return (
      <div className="card">
        <div className="text-xs text-text-subtle">Build phases</div>
        <div className="mt-2 text-sm text-text-muted">Couldn't parse weeks</div>
      </div>
    );
  }

  const overallStart = parsed[0].start.getTime();
  const overallEnd = parsed[parsed.length - 1].end.getTime();
  const span = overallEnd - overallStart;
  const today = Date.now();
  const todayPct = Math.max(
    0,
    Math.min(100, ((today - overallStart) / span) * 100),
  );

  // Group adjacent weeks with same phase
  const groups: {
    phase: string;
    color: string;
    start: Date;
    end: Date;
    weeks: ParsedWeek[];
  }[] = [];
  for (const w of parsed) {
    const last = groups[groups.length - 1];
    if (last && last.phase === w.phase) {
      last.end = w.end;
      last.weeks.push(w);
    } else {
      groups.push({
        phase: w.phase,
        color: w.color,
        start: w.start,
        end: w.end,
        weeks: [w],
      });
    }
  }

  const fmt = (d: Date) =>
    d.toLocaleDateString("en-GB", { month: "short", day: "numeric" });

  // Today label positioned right of marker if near left edge
  const labelLeftSide = todayPct > 8;

  return (
    <div className="card">
      <div className="mb-5 flex items-start justify-between">
        <div>
          <div className="text-xs text-text-subtle">
            Build phases · {plan.raceName}
          </div>
          <div className="mt-1 text-[12px]">
            {fmt(parsed[0].start)} → 🏁 {fmt(parsed[parsed.length - 1].end)} ·{" "}
            {plan.weeks.length} weeks
          </div>
        </div>
      </div>

      <div className="relative pb-10 pt-2">
        {/* Bars */}
        <div className="relative flex h-10 overflow-hidden rounded-2xl bg-surface-elev">
          {groups.map((g, i) => {
            const width =
              ((g.end.getTime() - g.start.getTime()) / span) * 100;
            return (
              <div
                key={i}
                className="border-l border-border first:border-l-0"
                style={{
                  width: `${width}%`,
                  background: g.color + "55",
                }}
              />
            );
          })}
          {/* Today marker — high-contrast dashed line, contained within bar */}
          <div
            className="pointer-events-none absolute top-0 bottom-0"
            style={{
              left: `${todayPct}%`,
              transform: "translateX(-1.5px)",
              borderLeft: "3px dashed var(--text)",
              opacity: 0.85,
            }}
          />
        </div>

        {/* Phase labels below the bar */}
        <div className="mt-2 flex w-full overflow-hidden">
          {groups.map((g, i) => {
            const width =
              ((g.end.getTime() - g.start.getTime()) / span) * 100;
            return (
              <div
                key={i}
                className="min-w-0 overflow-hidden pl-1 pr-0.5"
                style={{ width: `${width}%` }}
              >
                <div
                  className="truncate text-[9px] font-medium uppercase tracking-tight sm:text-[10px] sm:tracking-wide"
                  style={{ color: g.color }}
                >
                  {g.phase}
                </div>
                <div className="text-[9px] text-text-faint">
                  {g.weeks.length}w
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
