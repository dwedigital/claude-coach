"use client";

import { useState } from "react";
import { Review } from "@/lib/reviews";
import { ReviewModal } from "./ReviewModal";

interface Props {
  reviews: Review[];
}

function disciplineIcon(type?: string, session?: string) {
  const t = ((type ?? "") + " " + (session ?? "")).toLowerCase();
  if (t.includes("swim")) return "🏊";
  if (t.includes("brick")) return "🚴🏃";
  if (t.includes("bike") || t.includes("ride") || t.includes("cycle"))
    return "🚴";
  if (t.includes("run")) return "🏃";
  if (t.includes("race")) return "🏁";
  return "💪";
}

function titleFrom(r: Review): string {
  if (r.session) return r.session;
  const filename = r.file.split("/").pop()?.replace(/\.md$/, "") ?? "";
  // Strip leading date prefix from filename
  return filename.replace(/^\d{4}-\d{2}-\d{2}-?/, "").replace(/-/g, " ");
}

export function RecentReviewsCard({ reviews }: Props) {
  const [openReview, setOpenReview] = useState<Review | null>(null);
  const top = reviews.slice(0, 6);

  return (
    <>
      <div className="card">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-xs text-text-subtle">Recent reviews</div>
          <div className="text-[10px] text-text-faint">{reviews.length} total</div>
        </div>
        <div className="space-y-3">
          {top.map((r) => (
            <button
              key={r.file}
              onClick={() => setOpenReview(r)}
              className="flex w-full items-start gap-3 rounded-2xl bg-surface-elev p-3 text-left transition-colors hover:bg-surface-strong"
            >
              <span className="text-lg">{disciplineIcon(r.type, r.session)}</span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 text-[10px] text-text-subtle">
                  <span>{r.date}</span>
                  {r.type && <span className="pill text-[10px]">{r.type}</span>}
                </div>
                <div className="mt-1 truncate text-sm font-medium text-text">
                  {titleFrom(r)}
                </div>
                {r.verdict && (
                  <div className="mt-1 line-clamp-2 text-[11px] text-text-muted">
                    {r.verdict.slice(0, 140)}
                    {r.verdict.length > 140 ? "…" : ""}
                  </div>
                )}
              </div>
              <span className="text-xs text-text-faint transition-colors group-hover:text-accent">
                →
              </span>
            </button>
          ))}
          {top.length === 0 && (
            <div className="text-sm text-text-subtle">No reviews yet</div>
          )}
        </div>
      </div>
      <ReviewModal review={openReview} onClose={() => setOpenReview(null)} />
    </>
  );
}
