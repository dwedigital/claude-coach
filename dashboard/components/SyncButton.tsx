"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type State =
  | { kind: "idle" }
  | { kind: "syncing" }
  | { kind: "success"; durationMs: number }
  | { kind: "error"; message: string };

export function SyncButton() {
  const router = useRouter();
  const [state, setState] = useState<State>({ kind: "idle" });

  async function handleClick() {
    if (state.kind === "syncing") return;
    setState({ kind: "syncing" });

    try {
      const res = await fetch("/api/sync", { method: "POST" });
      const data = await res.json();

      if (data.ok) {
        setState({ kind: "success", durationMs: data.durationMs });
        router.refresh();
        setTimeout(() => setState({ kind: "idle" }), 5000);
      } else {
        setState({
          kind: "error",
          message: data.error || `Sync failed (status ${res.status})`,
        });
        setTimeout(() => setState({ kind: "idle" }), 8000);
      }
    } catch (err) {
      setState({
        kind: "error",
        message: err instanceof Error ? err.message : "Network error",
      });
      setTimeout(() => setState({ kind: "idle" }), 8000);
    }
  }

  const label =
    state.kind === "idle"
      ? "Sync"
      : state.kind === "syncing"
        ? "Syncing…"
        : state.kind === "success"
          ? `Synced · ${Math.round(state.durationMs / 1000)}s`
          : "Failed";

  const icon =
    state.kind === "idle"
      ? "↻"
      : state.kind === "syncing"
        ? "◐"
        : state.kind === "success"
          ? "✓"
          : "✕";

  const stateClass =
    state.kind === "success"
      ? "border-emerald-500/40 text-emerald-500"
      : state.kind === "error"
        ? "border-red-500/40 text-red-500"
        : "border-border text-text-subtle hover:bg-surface-elev";

  return (
    <button
      onClick={handleClick}
      disabled={state.kind === "syncing"}
      title={
        state.kind === "error"
          ? state.message
          : "Sync Strava, Eight Sleep, and Garmin data"
      }
      className={`inline-flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs transition-colors disabled:cursor-wait ${stateClass}`}
    >
      <span className={state.kind === "syncing" ? "inline-block animate-spin" : ""}>
        {icon}
      </span>
      {label}
    </button>
  );
}
