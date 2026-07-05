"use client";

import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { DisciplineMinutes } from "@/lib/plannedVolume";
import { ActualMinutes } from "@/lib/weeklyVolume";

interface Props {
  planned: DisciplineMinutes;
  actual: ActualMinutes;
  weekLabel?: string;
}

const DISCIPLINES: (keyof DisciplineMinutes)[] = ["Swim", "Bike", "Run", "Strength"];

export function DisciplineRadar({ planned, actual, weekLabel = "this week" }: Props) {
  const heading =
    weekLabel.charAt(0).toUpperCase() + weekLabel.slice(1);
  const data = DISCIPLINES.map((d) => ({
    discipline: d,
    planned: planned[d],
    actual: actual[d],
  }));

  const max = Math.max(
    ...DISCIPLINES.map((d) => Math.max(planned[d], actual[d])),
    30, // floor so empty weeks still show grid
  );
  const axisMax = Math.ceil((max * 1.2) / 30) * 30; // round up to next 30 min

  return (
    <div className="card">
      <div className="mb-1 text-xs text-text-subtle">
        {heading} · volume vs plan
      </div>
      <div className="mb-3 text-[10px] text-text-faint">
        Planned (outline) · Actual (filled) · minutes
      </div>

      <div className="h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="72%">
            <PolarGrid stroke="var(--surface-strong)" />
            <PolarAngleAxis
              dataKey="discipline"
              tick={{ fill: "var(--text-muted)", fontSize: 11 }}
              tickFormatter={(v: string) => (v === "Strength" ? "S&C" : v)}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, axisMax]}
              tick={{ fill: "var(--text-faint)", fontSize: 9 }}
              axisLine={false}
              tickCount={4}
            />
            <Radar
              name="Planned"
              dataKey="planned"
              stroke="var(--text-subtle)"
              strokeDasharray="4 4"
              fill="transparent"
              strokeWidth={1.5}
            />
            <Radar
              name="Actual"
              dataKey="actual"
              stroke="var(--accent)"
              fill="var(--accent)"
              fillOpacity={0.35}
              strokeWidth={2}
            />
            <Tooltip
              contentStyle={{
                background: "var(--surface)",
                border: "1px solid var(--border-strong)",
                borderRadius: 8,
                fontSize: 11,
                color: "var(--text)",
              }}
              labelStyle={{ color: "var(--text-muted)" }}
              itemStyle={{ color: "var(--text)" }}
              formatter={(v: number) => `${v} min`}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
        {DISCIPLINES.map((d) => {
          const p = planned[d];
          const a = actual[d];
          const pct = p > 0 ? Math.round((a / p) * 100) : a > 0 ? 100 : 0;
          return (
            <div
              key={d}
              className="flex items-center justify-between rounded-lg bg-surface-elev px-2.5 py-1.5"
            >
              <span className="min-w-0 truncate text-text-muted">{d}</span>
              <span className="flex shrink-0 items-baseline gap-1.5 whitespace-nowrap">
                <span className="font-medium text-text">{a}</span>
                <span className="text-text-faint">/ {p || "—"} min</span>
                {p > 0 && (
                  <span
                    className={
                      "ml-1 text-[9px] " +
                      (pct >= 95
                        ? "text-pine"
                        : pct >= 50
                        ? "text-text-muted"
                        : "text-accent")
                    }
                  >
                    {pct}%
                  </span>
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
