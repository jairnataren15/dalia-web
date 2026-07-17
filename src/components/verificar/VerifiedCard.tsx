import { getSummonerStats, PLATFORM_BY_REGION } from "@/lib/riot";
import { champIcon } from "@/lib/data";

export default async function VerifiedCard({
  gameName,
  tagLine,
  region,
}: {
  gameName: string;
  tagLine: string;
  region: string;
}) {
  const stats = await getSummonerStats(gameName, tagLine, PLATFORM_BY_REGION[region]).catch(
    () => null
  );

  return (
    <div className="rounded-xl border border-live/40 bg-live-soft p-6">
      <p className="mb-1 flex items-center gap-2 font-display text-lg font-bold text-live">
        ✓ Cuenta verificada
      </p>
      <p className="mb-5 text-sm text-dim">
        {gameName}#{tagLine} · {region} — ya apareces en el ranking del Jardín y puedes
        inscribirte a torneos.
      </p>

      {stats?.ranked && (
        <div className="flex flex-wrap items-center gap-6 border-t border-live/20 pt-4">
          <div>
            <p className="text-xs uppercase tracking-wider text-faint">Rango actual</p>
            <p className="font-display text-lg font-bold">
              {stats.tier} {stats.division} · <span className="tnum">{stats.lp} LP</span>
            </p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wider text-faint">Winrate</p>
            <p className="tnum font-display text-lg font-bold">{stats.winrate}%</p>
          </div>
          {stats.mains.length > 0 && (
            <div>
              <p className="mb-1 text-xs uppercase tracking-wider text-faint">Mains</p>
              <div className="flex gap-1.5">
                {stats.mains.map((c) => (
                  <img key={c} src={champIcon(c)} alt={c} className="h-8 w-8 rounded-lg border border-line" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
