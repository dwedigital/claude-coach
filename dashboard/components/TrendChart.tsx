"use client";

import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Point {
  date: string;
  primary: number | null;
  secondary?: number | null;
}

interface Props {
  title: string;
  subtitle?: string;
  data: Point[];
  primaryLabel: string;
  secondaryLabel?: string;
  domain?: [number | "auto", number | "auto"];
  current?: number | null;
  trend?: string;
  unit?: string;
  precision?: number;
}

export function TrendChart({
  title,
  subtitle,
  data,
  primaryLabel,
  secondaryLabel,
  domain,
  current,
  trend,
  unit,
  precision,
}: Props) {
  const currentDisplay =
    current == null
      ? "—"
      : precision !== undefined
        ? current.toFixed(precision)
        : `${current}`;
  return (
    <div className="card">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <div className="text-xs text-text-subtle">{title}</div>
          {subtitle && (
            <div className="text-[10px] text-text-faint">{subtitle}</div>
          )}
        </div>
        {current !== undefined && (
          <div className="text-right">
            <div className="text-2xl font-medium text-text">
              {currentDisplay}
              {unit && current != null && (
                <span className="ml-1 text-sm text-text-subtle">{unit}</span>
              )}
            </div>
            {trend && <div className="text-[10px] text-accent">{trend}</div>}
          </div>
        )}
      </div>
      <div className="h-[80px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" hide />
            <YAxis hide domain={domain ?? ["auto", "auto"]} />
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
            />
            <Line
              type="monotone"
              dataKey="primary"
              stroke="var(--accent)"
              strokeWidth={2}
              dot={false}
              name={primaryLabel}
              connectNulls
            />
            {secondaryLabel && (
              <Line
                type="monotone"
                dataKey="secondary"
                stroke="var(--text-subtle)"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                name={secondaryLabel}
                connectNulls
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
      {secondaryLabel && (
        <div className="mt-2 flex items-center gap-3 text-[10px] text-text-subtle">
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-3 bg-accent" />
            {primaryLabel}
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block h-0.5 w-3 bg-text-muted" />
            {secondaryLabel}
          </span>
        </div>
      )}
    </div>
  );
}
