"use client";

import { useState } from "react";
import Link from "next/link";
import { PlanWeek, PlanSession, cleanSessionText } from "@/lib/planTypes";
import { format, addDays, isSameDay } from "date-fns";
import { SessionModal } from "./SessionModal";

interface Props {
  week?: PlanWeek;
  /** ISO string for the Monday of the week being shown. */
  weekStartISO: string;
  /** Week offset from the current week: 0 = this week, -1 = last, +1 = next. */
  offset: number;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function sessionsForDay(week: PlanWeek | undefined, dow: string): PlanSession[] {
  if (!week) return [];
  return week.sessions.filter((s) => {
    const dayStr = s.day.toLowerCase();
    return dayStr.includes(dow.toLowerCase());
  });
}

/** Word-boundary keyword test — "strides" must NOT match "ride". */
function hasWord(txt: string, ...stems: string[]): boolean {
  return stems.some((s) => new RegExp(`\\b${s}`).test(txt));
}

function disciplineIcon(session: PlanSession): string {
  const cleaned = cleanSessionText(session.session).toLowerCase();
  const txt = (cleaned + " " + (session.discipline ?? "")).toLowerCase();
  // Priority order: REST first (handles "X → REST" cases)
  if (/\brest\b/.test(cleaned) && !cleaned.includes("rehearsal")) return "🛏️";
  if (hasWord(txt, "race")) return "🏁";
  if (hasWord(txt, "brick")) return "🚴🏃";
  if (hasWord(txt, "swim")) return "🏊";
  if (hasWord(txt, "bike", "ride", "cycle")) return "🚴";
  if (hasWord(txt, "run", "jog")) return "🏃";
  if (txt.includes("s&c") || hasWord(txt, "strength")) return "💪";
  return "•";
}

export function WeekCalendar({ week, weekStartISO, offset }: Props) {
  const [openSession, setOpenSession] = useState<PlanSession | null>(null);

  const today = new Date();
  const monday = new Date(weekStartISO);
  const days = DAYS.map((_, i) => addDays(monday, i));
  const rangeLabel = `${format(monday, "MMM d")} – ${format(addDays(monday, 6), "MMM d")}`;

  const navBtn =
    "flex h-6 w-6 items-center justify-center rounded-full bg-surface-elev text-text-muted transition-colors hover:bg-surface-strong hover:text-text";

  return (
    <>
      <div className="card">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs">{week ? week.title : rangeLabel}</div>
            {week?.intent ? (
              <div className="mt-1 line-clamp-1 text-[11px] text-text-faint">
                {week.intent.replace(/\*\*/g, "")}
              </div>
            ) : (
              !week && (
                <div className="mt-1 text-[11px] text-text-faint">
                  No plan for this week
                </div>
              )
            )}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {week && <div className="pill">{week.sessions.length} sessions</div>}
            <div className="flex items-center gap-1">
              <Link
                href={`/?w=${offset - 1}`}
                className={navBtn}
                aria-label="Previous week"
                scroll={false}
              >
                ‹
              </Link>
              {offset !== 0 && (
                <Link
                  href="/?w=0"
                  className="rounded-full bg-surface-elev px-2.5 py-1 text-[10px] text-text-muted transition-colors hover:bg-surface-strong hover:text-text"
                  scroll={false}
                >
                  Today
                </Link>
              )}
              <Link
                href={`/?w=${offset + 1}`}
                className={navBtn}
                aria-label="Next week"
                scroll={false}
              >
                ›
              </Link>
            </div>
          </div>
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
