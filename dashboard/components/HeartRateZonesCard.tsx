import { ZONES, WeekZoneDistribution } from "@/lib/zones";

interface Props {
  distribution: WeekZoneDistribution;
  weekLabel?: string;
}

export function HeartRateZonesCard({
  distribution,
  weekLabel = "this week",
}: Props) {
  const totalMin = distribution.totalMin;
  return (
    <div className="card">
      <div className="mb-4 flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-xs text-text-subtle">Heart rate zones</div>
          <div className="truncate text-[10px] text-text-faint">
            Lab VO2 test · road pace · 80/20 polarised target
          </div>
        </div>
        <div className="shrink-0 text-right text-[10px] text-text-subtle">
          {Math.round(totalMin)} min {weekLabel}
        </div>
      </div>

      {/* Stacked time-in-zone bar */}
      {totalMin > 0 ? (
        <div className="mb-5">
          <div className="flex h-3 overflow-hidden rounded-full bg-surface-elev">
            {ZONES.map((z) => {
              const mins = distribution.byZone[z.zone] ?? 0;
              const pct = totalMin > 0 ? (mins / totalMin) * 100 : 0;
              if (pct === 0) return null;
              return (
                <div
                  key={z.zone}
                  style={{ width: `${pct}%`, background: z.color }}
                  title={`${z.zone}: ${Math.round(mins)} min (${Math.round(pct)}%)`}
                />
              );
            })}
          </div>
          <div className="mt-2 flex flex-wrap justify-between gap-x-3 gap-y-1 text-[10px]">
            <span className="text-text-subtle">
              Easy (Z1-Z2):{" "}
              <span className="font-medium text-text">
                {Math.round(distribution.easyPct)}%
              </span>
              <span className="text-text-faint"> / 80% target</span>
            </span>
            <span className="text-text-subtle">
              Hard (Z4-Z5):{" "}
              <span className="font-medium text-text">
                {Math.round(distribution.hardPct)}%
              </span>
              <span className="text-text-faint"> / 20% target</span>
            </span>
          </div>
        </div>
      ) : (
        <div className="mb-5 rounded-2xl bg-surface-elev px-3 py-2 text-[10px] text-text-subtle">
          No HR-tracked activities {weekLabel} yet
        </div>
      )}

      {/* Zones reference table */}
      <div className="space-y-1.5">
        {ZONES.map((z) => {
          const mins = distribution.byZone[z.zone] ?? 0;
          const pct = totalMin > 0 ? (mins / totalMin) * 100 : 0;
          return (
            <div
              key={z.zone}
              className="flex items-center gap-2 rounded-lg bg-surface-elev px-2 py-2 text-xs sm:px-3"
            >
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: z.color }}
              />
              <span className="w-6 shrink-0 font-medium text-text sm:w-7">
                {z.zone}
              </span>
              <span className="min-w-0 flex-1 truncate text-text-muted lg:w-20 lg:flex-none">
                {z.name}
              </span>
              <span className="shrink-0 sm:w-20">
                {z.hrMin === 0
                  ? `<${z.hrMax + 1}`
                  : z.hrMax === 220
                  ? `${z.hrMin}+`
                  : `${z.hrMin}-${z.hrMax}`}
              </span>
              <span className="hidden min-w-0 flex-1 truncate lg:block">
                {z.pace}
              </span>
              <span className="w-10 shrink-0 text-right text-accent">
                {mins > 0 ? `${Math.round(pct)}%` : ""}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
