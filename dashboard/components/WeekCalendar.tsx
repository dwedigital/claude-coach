"use client";

import { useState } from "react";
import { PlanWeek, PlanSession, cleanSessionText } from "@/lib/planTypes";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { SessionModal } from "./SessionModal";

interface Props {
  week?: PlanWeek;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function sessionsForDay(week: PlanWeek | undefined, dow: string): PlanSession[] {
  if (!week) return [];
  return week.sessions.filter((s) => {
    const dayStr = s.day.toLowerCase();
    return dayStr.includes(dow.toLowerCase());
  });
}

function disciplineIcon(session: PlanSession): string {
  const cleaned = cleanSessionText(session.session).toLowerCase();
  const txt = (cleaned + " " + (session.discipline ?? "")).toLowerCase();
  // Priority order: REST first (handles "X → REST" cases)
  if (cleaned.includes("rest") && !cleaned.includes("rehearsal")) return "🛏️";
  if (txt.includes("race")) return "🏁";
  if (txt.includes("brick")) return "🚴🏃";
  if (txt.includes("swim")) return "🏊";
  if (txt.includes("bike") || txt.includes("ride") || txt.includes("cycle"))
    return "🚴";
  if (txt.includes("run") || txt.includes("jog")) return "🏃";
  if (txt.includes("s&c") || txt.includes("strength")) return "💪";
  return "•";
}

export function WeekCalendar({ week }: Props) {
  const [openSession, setOpenSession] = useState<PlanSession | null>(null);

  if (!week) {
    return (
      <div className="card">
        <div className="text-xs text-text-subtle">This week</div>
        <div className="mt-2 text-sm text-text-muted">No active week</div>
      </div>
    );
  }
  const today = new Date();
  const monday = startOfWeek(today, { weekStartsOn: 1 });
  const days = DAYS.map((label, i) => addDays(monday, i));

  return (
    <>
      <div className="card">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <div className="text-xs">{week.title}</div>
            {week.intent && (
              <div className="mt-1 line-clamp-1 text-[11px] text-text-faint">
                {week.intent.replace(/\*\*/g, "")}
              </div>
            )}
          </div>
          <div className="pill">{week.sessions.length} sessions</div>
        </div>
        <div className="grid grid-cols-1 gap-2 lg:grid-cols-7">
          {days.map((d, i) => {
            const isToday = isSameDay(d, today);
            const sessions = sessionsForDay(week, DAYS[i]);
            return (
              <div
                key={i}
                className={
                  "flex flex-row gap-3 rounded-2xl border p-3 transition-colors lg:min-h-[180px] lg:flex-col lg:gap-0 " +
                  (isToday
                    ? "border-accent bg-accent-soft"
                    : "border-border bg-surface-elev")
                }
              >
                {/* Day label / number — left on mobile, top on lg */}
                <div className="flex w-[64px] shrink-0 flex-col items-start gap-0.5 lg:mb-2 lg:w-full lg:flex-row lg:items-baseline lg:justify-between lg:gap-0">
                  <div
                    className={
                      "text-[10px] uppercase tracking-wide " +
                      (isToday ? "text-accent" : "text-text-subtle")
                    }
                  >
                    {DAYS[i]}
                  </div>
                  <div
                    className={
                      "text-2xl font-medium leading-none lg:text-base " +
                      (isToday ? "text-accent" : "text-text-muted")
                    }
                  >
                    {format(d, "d")}
                  </div>
                </div>
                {/* Sessions — right on mobile, below on lg */}
                <div className="flex-1 space-y-1.5">
                  {sessions.length === 0 ? (
                    <div className="text-[10px] text-text-faint">—</div>
                  ) : (
                    sessions.map((s, j) => (
                      <button
                        key={j}
                        onClick={() => setOpenSession(s)}
                        className={
                          "block w-full rounded-lg p-2 text-left transition-colors hover:bg-surface-strong " +
                          (s.done ? "bg-accent-soft" : "bg-surface-elev")
                        }
                      >
                        <div className="flex items-start gap-1.5">
                          <span className="text-xs leading-tight">
                            {disciplineIcon(s)}
                          </span>
                          <div className="min-w-0 flex-1">
                            <div className="line-clamp-2 text-[12px] font-medium leading-tight text-text lg:text-[12px]">
                              {cleanSessionText(s.session)}
                            </div>
                            <div className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[10px]">
                              {s.time && <span>{s.time}</span>}
                              {s.duration && (
                                <span className="text-accent">{s.duration}</span>
                              )}
                            </div>
                          </div>
                          {s.done && (
                            <span className="text-[9px] text-accent">✓</span>
                          )}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <SessionModal
        session={openSession}
        onClose={() => setOpenSession(null)}
      />
    </>
  );
}
