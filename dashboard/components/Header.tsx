import Link from "next/link";
import { format } from "date-fns";
import { Review } from "@/lib/reviews";
import { SyncButton } from "./SyncButton";
import { ThemeToggle } from "./ThemeToggle";

interface Props {
  athleteName: string;
  todayReview?: Review;
}

export function Header({ athleteName, todayReview }: Props) {
  const now = new Date();
  return (
    <header className="mb-8">
      <div className="mb-10 flex items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold tracking-tight"
            style={{ background: "var(--accent)", color: "var(--bg)" }}
          >
            CC
          </div>
          <div>
            <div className="text-sm font-medium text-text">
              Coach Dashboard
            </div>
            <div className="text-xs text-text-subtle">{athleteName}</div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm">
            {format(now, "EEEE do MMMM yyyy")}
          </div>
          <Link
            href="/about"
            className="text-xs text-text-subtle transition-colors hover:text-text"
          >
            About
          </Link>
          <SyncButton />
          <ThemeToggle />
        </div>
      </div>

      <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">


        <div className="max-w-md">
          <div className="text-2xl font-medium text-text">
            {todayReview
              ? "Coach Claude reviewed today's session ✓"
              : `Hey, ${athleteName} 👋`}
          </div>
          <div className="text-base text-text-subtle">
            {todayReview
              ? todayReview.session ?? todayReview.type ?? "Open the review"
              : "Use Coach Claude in your terminal for plan adjustments and reviews."}
          </div>
        </div>
      </div>
    </header>
  );
}
