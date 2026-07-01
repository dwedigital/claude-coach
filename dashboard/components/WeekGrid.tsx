import { PlanWeek } from "@/lib/plan";

interface Props {
  week?: PlanWeek;
}

function shortenDay(d: string) {
  // "Mon Jul 6 07:15" -> "Mon"
  const m = d.match(/^([A-Za-z]{3})/);
  return m ? m[1] : d.slice(0, 3);
}

export function WeekGrid({ week }: Props) {
  if (!week) {
    return (
      <div className="card">
        <div className="text-xs text-text-subtle">This week</div>
        <div className="mt-2 text-sm text-text-muted">No active week</div>
      </div>
    );
  }
  return (
    <div className="card">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="text-xs text-text-subtle">{week.title}</div>
          {week.intent && (
            <div className="mt-1 line-clamp-1 text-[11px] text-text-faint">
              {week.intent.replace(/\*\*/g, "")}
            </div>
          )}
        </div>
        <div className="pill">{week.sessions.length} sessions</div>
      </div>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {week.sessions.map((s, i) => (
          <div
            key={i}
            className={
              "rounded-2xl bg-surface-elev p-3 text-xs " +
              (s.done ? "border border-accent" : "")
            }
          >
            <div className="flex items-center justify-between text-[10px] text-text-subtle">
              <span>{shortenDay(s.day)}</span>
              {s.time && <span>{s.time}</span>}
            </div>
            <div className="mt-1 line-clamp-2 text-sm font-medium text-text">
              {s.session}
            </div>
            <div className="mt-1 flex items-center gap-2 text-[10px] text-text-subtle">
              {s.duration && <span>{s.duration}</span>}
              {s.intensity && (
                <span className="text-accent">{s.intensity}</span>
              )}
              {s.done && <span className="ml-auto text-accent">✓</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
