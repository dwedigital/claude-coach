import { ReadinessDay, Tier, tierFromReadiness } from "@/lib/readiness";

interface Props {
  today?: ReadinessDay;
}

const tierColor: Record<Tier, string> = {
  READY: "#FF6B47",
  MODERATE: "#FFB07A",
  REST: "#666",
};

export function ReadinessCard({ today }: Props) {
  const tier = tierFromReadiness(today);
  const score = today?.readiness ?? 0;
  const pct = Math.min(100, Math.max(0, score));
  const radius = 56;
  const circ = 2 * Math.PI * radius;
  const dash = (pct / 100) * circ;

  return (
    <div className="card flex items-center justify-between">
      <div>
        <div className="text-xs text-text-subtle">Readiness</div>
        <div className="mt-1 text-3xl font-medium text-text">{score}</div>
        <div
          className="mt-2 inline-flex rounded-full px-3 py-1 text-xs font-medium"
          style={{ background: tierColor[tier] + "22", color: tierColor[tier] }}
        >
          {tier}
        </div>
        {today?.recoveryTime !== null && today?.recoveryTime !== undefined && (
          <div className="mt-3 text-[11px] text-text-subtle">
            Recovery time {Math.round(today.recoveryTime / 60)}h
          </div>
        )}
      </div>
      <svg width={140} height={140} viewBox="0 0 140 140">
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="var(--surface-strong)"
          strokeWidth="10"
        />
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={tierColor[tier]}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          transform="rotate(-90 70 70)"
        />
        <text
          x="70"
          y="78"
          textAnchor="middle"
          fontSize="22"
          fontWeight="500"
          fill="var(--text)"
        >
          {Math.round(pct)}%
        </text>
      </svg>
    </div>
  );
}
