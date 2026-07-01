import { AthleteProfile } from "@/lib/profile";

interface Props {
  profile: AthleteProfile | null;
}

export function AthleteStatsCard({ profile }: Props) {
  const items = [
    {
      label: "FTP",
      value: profile?.ftpW ? `${profile.ftpW}W` : "—",
      sub: profile?.ftpWkg ? `${profile.ftpWkg} W/kg` : null,
      icon: "🚴",
    },
    {
      label: "CSS",
      value: profile?.cssPace ?? "—",
      sub: "/100m",
      icon: "🏊",
    },
    {
      label: "Threshold",
      value: profile?.thresholdPace ?? "—",
      sub: "/km",
      icon: "🏃",
    },
    {
      label: "Max HR",
      value: profile?.maxHr ? `${profile.maxHr}` : "—",
      sub: profile?.maxHr ? "bpm" : null,
      icon: "❤️",
    },
  ];
  return (
    <div className="card">
      <div className="mb-4 text-xs text-text-subtle">Benchmarks</div>
      <div className="grid grid-cols-2 gap-3">
        {items.map((it) => (
          <div
            key={it.label}
            className="rounded-2xl bg-surface-elev p-3"
          >
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide text-text-subtle">
              <span>{it.icon}</span>
              {it.label}
            </div>
            <div className="mt-1.5 flex items-baseline gap-1">
              <span className="text-xl font-medium text-text">
                {it.value}
              </span>
              {it.sub && (
                <span className="text-[10px] text-text-subtle">{it.sub}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
