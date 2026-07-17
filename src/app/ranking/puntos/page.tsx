import { PageHeader, Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { pointsLeaderboard } from "@/lib/data";

export const metadata = { title: "Ranking de Puntos — Dalia" };

const MEDALS = ["text-gold", "text-[#a8b7c4]", "text-[#b0793f]"];

export default function PuntosPage() {
  const [first, second, third, ...rest] = pointsLeaderboard;
  const podium = [second, first, third].filter(
    (p): p is (typeof pointsLeaderboard)[number] => p !== undefined
  );

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <PageHeader
        eyebrow="Ranking"
        title="Puntos DALIA.EXE"
        lede="Los puntos se ganan viendo el directo, chateando y participando. Se gastan en sorteos y predicciones — y aquí se presume de ellos."
      />

      {pointsLeaderboard.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-sm text-dim">
            Todavía no hay nadie en el ranking de puntos — se llena solo en cuanto
            la comunidad empiece a ver el directo y verificarse.
          </p>
        </Card>
      ) : (
        <>
          {/* Podio */}
          <Reveal>
            <div className="mb-8 grid grid-cols-3 items-end gap-3">
              {podium.map((p, i) => {
                const place = i === 1 ? 1 : i === 0 ? 2 : 3;
                const heights = ["h-28", "h-36", "h-24"];
                return (
                  <div key={p.user} className="flex flex-col items-center gap-2">
                    <p className={`font-display text-sm font-bold ${MEDALS[place - 1]}`}>
                      {p.user}
                    </p>
                    <p className="tnum text-xs text-dim">{p.points.toLocaleString("es")} pts</p>
                    <div
                      className={`${heights[i]} w-full rounded-t-xl border border-b-0 border-line bg-gradient-to-b from-rose-soft to-surface`}
                    >
                      <p className={`pt-3 text-center font-display text-3xl font-bold ${MEDALS[place - 1]}`}>
                        {place}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Reveal>

          {/* Resto de la tabla */}
          {rest.length > 0 && (
            <Reveal delay={0.1}>
              <Card className="overflow-hidden">
                <ul className="divide-y divide-line/60">
                  {rest.map((p, i) => (
                    <li key={p.user} className="flex items-center gap-4 px-5 py-3 hover:bg-hover">
                      <span className="tnum w-6 text-right text-sm text-faint">{i + 4}</span>
                      <span className="flex-1 font-semibold">{p.user}</span>
                      <span className="tnum hidden text-xs text-faint sm:block">
                        {p.hours} h viendo
                      </span>
                      <span className="tnum font-display font-bold text-rose">
                        {p.points.toLocaleString("es")}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </Reveal>
          )}
        </>
      )}

      <p className="mt-4 text-xs text-faint">
        10 pts por cada 5 minutos de directo · bonus x2 para subs · el ranking se
        reinicia cada temporada (3 meses) con premios para el top 10.
      </p>
    </div>
  );
}
