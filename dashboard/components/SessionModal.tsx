"use client";

import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PlanSession, cleanSessionText } from "@/lib/planTypes";

interface Props {
  session: PlanSession | null;
  onClose: () => void;
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

export function SessionModal({ session, onClose }: Props) {
  useEffect(() => {
    if (!session) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [session, onClose]);

  if (!session) return null;

  const clean = (s: string) => s.replace(/\*\*/g, "**").replace(/~~/g, "~~");
  const cleanedDetails = session.details ?? "";

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm px-4 py-12"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl border border-border-strong bg-surface p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full border border-border-strong bg-surface-elev text-text-muted hover:bg-surface-strong hover:text-text"
          aria-label="Close"
        >
          ×
        </button>

        <div className="mb-6 border-b border-border pb-5">
          <div className="flex items-center gap-2 text-xs text-text-subtle">
            <span>{session.day}</span>
            {session.time && <span className="pill text-[10px]">{session.time}</span>}
            {session.done && (
              <span className="pill text-[10px] text-accent">DONE ✓</span>
            )}
          </div>
          <div className="mt-2 flex items-start gap-3">
            <span className="text-3xl leading-none">{disciplineIcon(session)}</span>
            <h2 className="text-xl font-medium text-text">
              {cleanSessionText(session.session)}
            </h2>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl bg-surface-elev p-3">
            <div className="text-[10px] uppercase tracking-wide text-text-subtle">
              Duration
            </div>
            <div className="mt-1 text-base font-medium">
              {session.duration ?? "—"}
            </div>
          </div>
          <div className="rounded-2xl bg-surface-elev p-3">
            <div className="text-[10px] uppercase tracking-wide text-text-subtle">
              Intensity
            </div>
            <div className="mt-1 text-base font-medium">
              {session.intensity ?? "—"}
            </div>
          </div>
          <div className="rounded-2xl bg-surface-elev p-3">
            <div className="text-[10px] uppercase tracking-wide text-text-subtle">
              Discipline
            </div>
            <div className="mt-1 text-base font-medium">
              {session.discipline ?? "—"}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-surface-elev p-4">
          <div className="mb-2 text-[10px] uppercase tracking-wide text-text-subtle">
            Details
          </div>
          <div className="prose-review">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {clean(cleanedDetails)}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
