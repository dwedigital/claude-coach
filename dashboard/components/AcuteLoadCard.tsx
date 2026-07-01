"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { ReadinessDay } from "@/lib/readiness";

interface Props {
  series: ReadinessDay[];
}

export function AcuteLoadCard({ series }: Props) {
  const data = series.map((d) => ({
    date: d.date.slice(5),
    acuteLoad: d.acuteLoad ?? 0,
  }));
  const valid = series.filter((d) => d.acuteLoad !== null);
  const latest = valid[valid.length - 1]?.acuteLoad ?? 0;
  const prev = valid[valid.length - 2]?.acuteLoad ?? null;
  const delta = prev !== null ? latest - prev : null;
  return (
    <div className="card">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="text-xs text-text-subtle">Acute training load · 7d rolling</div>
          <div className="text-[10px] text-text-faint">
            Garmin · accumulated stress, decays with rest
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-medium text-text">{latest}</div>
          {delta !== null && (
            <div
              className={
                "text-[10px] " +
                (delta < 0
                  ? "text-pine"
                  : delta > 0
                  ? "text-accent"
                  : "text-text-subtle")
              }
            >
              {delta > 0 ? "+" : ""}
              {delta} vs yesterday
            </div>
          )}
        </div>
      </div>
      <div className="h-[70px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" hide />
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
              cursor={{ fill: "var(--surface-elev)" }}
            />
            <Bar dataKey="acuteLoad" fill="var(--accent)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
