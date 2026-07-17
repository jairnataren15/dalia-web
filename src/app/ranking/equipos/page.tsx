import { PageHeader, Card, RankBadge } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { teams, members, champIcon, rankLabel, winrate, TIER_COLORS } from "@/lib/data";

export const metadata = { title: "Equipos — Dalia" };

export default function EquiposPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <PageHeader
        eyebrow="Ranking"
        title="Equipos DALIA.EXE"
        lede="Los escuadrones fijos de la comunidad: stats agregadas de flex, torneos internos y el eterno pique entre ellos."
      />
      <div className="grid gap-5 lg:grid-cols-1">
        {teams.map((team, ti) => {
          const roster = team.memberIds
            .map((id) => members.find((m) => m.id === id))
            .filter((m) => m !== undefined);
          const totalGames = team.wins + team.losses;
          const wr = Math.round((team.wins / totalGames) * 100);
          const avgWr = Math.round(
            roster.reduce((acc, m) => acc + winrate(m), 0) / roster.length
          );

          return (
            <Reveal key={team.id} delay={ti * 0.08}>
              <Card className="overflow-hidden">
                <div className="flex flex-col justify-between gap-4 border-b border-line bg-raised/50 px-5 py-4 sm:flex-row sm:items-center">
                  <div>
                    <h2 className="font-display text-xl font-bold">{team.name}</h2>
                    <p className="text-sm text-dim">{team.tagline}</p>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-wider text-faint">Flex juntos</p>
                      <p className="tnum font-semibold">
                        <span className="text-live">{team.wins}V</span>{" "}
                        <span className="text-danger">{team.losses}D</span>{" "}
                        <span className={wr >= 55 ? "text-live" : "text-dim"}>({wr}%)</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs uppercase tracking-wider text-faint">WR medio soloQ</p>
                      <p className="tnum font-semibold">{avgWr}%</p>
                    </div>
                  </div>
                </div>
                <ul className="divide-y divide-line/60">
                  {roster.map((m) => (
                    <li key={m.id} className="flex items-center gap-4 px-5 py-3 hover:bg-hover">
                      <img
                        src={champIcon(m.mains[0])}
                        alt={m.mains[0]}
                        className="h-9 w-9 rounded-lg border border-line"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-semibold">
                          {m.riotId}
                          <span className="ml-1 text-xs font-normal text-faint">#{m.tag}</span>
                        </p>
                        <p className="text-xs text-dim">{m.role}</p>
                      </div>
                      <div className="hidden sm:block">
                        <RankBadge tier={m.tier} division={m.division} />
                      </div>
                      <span
                        className="tnum text-sm font-semibold"
                        style={{ color: TIER_COLORS[m.tier] }}
                      >
                        {winrate(m)}%
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          );
        })}
      </div>
      <p className="mt-6 text-xs text-faint">
        ¿Tu grupo quiere aparecer aquí? Formad equipo en el próximo torneo o
        pedidlo en el canal #equipos del Discord.
      </p>
    </div>
  );
}
