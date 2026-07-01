import { DisciplineVolume } from "@/lib/weeklyVolume";

interface Props {
  volume: DisciplineVolume;
}

const TARGETS = { swim: 90, bike: 180, run: 120 }; // minutes / week — rough goals

export function DisciplineRings({ volume }: Props) {
  const items = [
    { key: "swim", label: "Swim", value: volume.swimMin, target: TARGETS.swim, color: "#FF6B47" },
    { key: "bike", label: "Bike", value: volume.bikeMin, target: TARGETS.bike, color: "#FFB07A" },
    { key: "run", label: "Run", value: volume.runMin, target: TARGETS.run, color: "#FFD3C7" },
  ];
  const size = 200;
  const center = size / 2;
  const radii = [80, 60, 40];

  return (
    <div className="card">
      <div className="mb-3 text-xs text-text-subtle">This week · discipline volume</div>
      <div className="flex items-center gap-6">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {items.map((it, idx) => {
            const r = radii[idx];
            const circ = 2 * Math.PI * r;
            const pct = Math.min(1, it.value / it.target);
            const dash = pct * circ;
            return (
              <g key={it.key}>
                <circle
                  cx={center}
                  cy={center}
                  r={r}
                  fill="none"
                  stroke="var(--surface-strong)"
                  strokeWidth="10"
                />
                <circle
                  cx={center}
                  cy={center}
                  r={r}
                  fill="none"
                  stroke={it.color}
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${dash} ${circ}`}
                  transform={`rotate(-90 ${center} ${center})`}
                />
              </g>
            );
          })}
        </svg>
        <div className="space-y-2">
          {items.map((it) => (
            <div key={it.key} className="flex items-center gap-2 text-sm">
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: it.color }}
              />
              <span className="text-text-muted">{it.label}</span>
              <span className="ml-auto font-medium text-text">
                {Math.round(it.value)}
              </span>
              <span className="text-text-faint">/ {it.target} min</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
