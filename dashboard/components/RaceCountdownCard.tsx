import { Goal, daysUntil } from "@/lib/goals";

interface Props {
  goal: Goal | null;
}

export function RaceCountdownCard({ goal }: Props) {
  if (!goal) {
    return (
      <div className="card">
        <div className="text-xs text-text-subtle">Next race</div>
        <div className="mt-2 text-lg text-text-muted">No active goal</div>
      </div>
    );
  }
  const days = daysUntil(goal.date);
  const total = Math.max(days, 0);
  // dotted timeline: show last 28 days approaching
  const span = 28;
  const dots = Array.from({ length: span }).map((_, i) => {
    const fromEnd = span - 1 - i;
    if (fromEnd > days) return "past";
    if (fromEnd === days) return "today";
    return "future";
  });
  return (
    <div className="card">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-text-subtle">
            <span>⏱</span> Race countdown
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-5xl font-medium text-text">{total}</span>
            <span className="text-base text-text-muted">days</span>
          </div>
          <div className="mt-1 text-xs text-text-subtle">{goal.event}</div>
          <div className="text-[10px] text-text-faint">{goal.date}</div>
        </div>
      </div>
      <div className="mt-5 grid grid-cols-14 gap-1.5" style={{ gridTemplateColumns: "repeat(14, 1fr)" }}>
        {dots.map((kind, i) => (
          <span
            key={i}
            className={
              "h-2 w-2 rounded-full " +
              (kind === "past"
                ? "bg-accent"
                : kind === "today"
                ? "bg-text"
                : "bg-surface-strong")
            }
          />
        ))}
      </div>
    </div>
  );
}
