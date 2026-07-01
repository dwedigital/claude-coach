"use client";

import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Review } from "@/lib/reviews";

interface Props {
  review: Review | null;
  onClose: () => void;
}

export function ReviewModal({ review, onClose }: Props) {
  useEffect(() => {
    if (!review) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [review, onClose]);

  if (!review) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/60 backdrop-blur-sm px-4 py-12"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl rounded-3xl border border-border-strong bg-surface p-8 shadow-2xl"
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
            <span>{review.date}</span>
            {review.type && <span className="pill text-[10px]">{review.type}</span>}
          </div>
          <h2 className="mt-2 text-xl font-medium text-text">
            {review.session ?? review.file.split("/").pop()}
          </h2>
        </div>

        {(review.planned || review.actual || review.verdict) && (
          <div className="mb-6 space-y-3">
            {review.planned && (
              <div className="rounded-2xl bg-surface-elev p-3">
                <div className="text-[10px] uppercase tracking-wide text-text-subtle">
                  Planned
                </div>
                <div className="mt-1 text-sm text-text-muted">{review.planned}</div>
              </div>
            )}
            {review.actual && (
              <div className="rounded-2xl bg-surface-elev p-3">
                <div className="text-[10px] uppercase tracking-wide text-text-subtle">
                  Actual
                </div>
                <div className="mt-1 text-sm text-text-muted">{review.actual}</div>
              </div>
            )}
            {review.verdict && (
              <div className="rounded-2xl border border-accent bg-accent-soft p-3">
                <div className="text-[10px] uppercase tracking-wide text-accent">
                  Verdict
                </div>
                <div className="mt-1 text-sm text-text">{review.verdict}</div>
              </div>
            )}
          </div>
        )}

        <div className="prose-review">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{review.body}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
