"use client";

import { useState } from "react";
import { PlanSession, cleanSessionText } from "@/lib/planTypes";
import { format } from "date-fns";
import { SessionModal } from "./SessionModal";

interface Props {
  sessions: PlanSession[];
}

function disciplineIcon(session: PlanSession): string {
  const cleaned = cleanSessionText(session.session).toLowerCase();
  const txt = (cleaned + " " + (session.discipline ?? "")).toLowerCase();
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

function timeOfDay(session: PlanSession): string | undefined {
  if (session.time) return session.time;
  const day = session.day.toLowerCase();
  if (day.includes("pm")) return "PM";
  if (day.includes("am")) return "AM";
  return undefined;
}

export function TodaySessionCard({ sessions }: Props) {
  const [openSession, setOpenSession] = useState<PlanSession | null>(null);
  const today = format(new Date(), "EEE MMM d");

  return (
    <>
      <div
        id="today-session"
        className="card flex flex-col gap-4 scroll-mt-6"
      >
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-xs text-text-subtle">Today · {today}</div>
            <div className="mt-1 text-lg font-medium text-text">
              {sessions.length === 0
                ? "Rest day"
                : sessions.length === 1
                ? cleanSessionText(sessions[0].session)
                : `${sessions.length} sessions`}
            </div>
          </div>
          {sessions.length > 0 && (
            <span className="pill text-accent">
              {sessions.filter((s) => s.done).length}/{sessions.length} done
            </span>
          )}
        </div>

        <div className="space-y-2">
          {sessions.length === 0 ? (
            <div className="rounded-2xl bg-surface-elev p-3 text-xs text-text-subtle">
              Nothing scheduled — enjoy the rest.
            </div>
          ) : (
            sessions.map((s, i) => {
              const tod = timeOfDay(s);
              return (
                <button
                  key={i}
                  onClick={() => setOpenSession(s)}
                  className={
                    "block w-full rounded-2xl p-3 text-left transition-colors hover:bg-surface-strong " +
                    (s.done ? "bg-accent-soft" : "bg-surface-elev")
                  }
                >
                  <div className="flex items-start gap-2">
                    <span className="text-base leading-tight">
                      {disciplineIcon(s)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        {tod && (
                          <span className="text-[10px] uppercase tracking-wide text-accent">
                            {tod}
                          </span>
                        )}
                        <span className="line-clamp-2 text-sm font-medium text-text">
                          {cleanSessionText(s.session)}
                        </span>
                        {s.done && (
                          <span className="ml-auto text-xs text-accent">
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10px] text-text-subtle">
                        {s.duration && (
                          <span>
                            <span className="text-text-faint">Duration:</span>{" "}
                            <span className="text-text-muted">{s.duration}</span>
                          </span>
                        )}
                        {s.intensity && (
                          <span>
                            <span className="text-text-faint">Intensity:</span>{" "}
                            <span className="text-accent">
                              {s.intensity}
                            </span>
                          </span>
                        )}
                        {s.discipline && (
                          <span>
                            <span className="text-text-faint">Type:</span>{" "}
                            <span className="text-text-muted">{s.discipline}</span>
                          </span>
                        )}
                      </div>
                      {s.details && (
                        <div className="mt-2 line-clamp-2 text-[11px] text-text-muted">
                          {s.details
                            .replace(/\*\*/g, "")
                            .replace(/~~/g, "")
                            .slice(0, 180)}
                          {s.details.length > 180 ? "…" : ""}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
      <SessionModal
        session={openSession}
        onClose={() => setOpenSession(null)}
      />
    </>
  );
}
