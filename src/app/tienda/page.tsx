import { PageHeader, Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import RaffleGrid from "@/components/tienda/RaffleGrid";
import { pastWinners } from "@/lib/data";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Tienda — Dalia" };

export default async function TiendaPage() {
  const raffles = await prisma.raffle.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <PageHeader
        eyebrow="Tienda DALIA.EXE"
        title="Sorteos por puntos"
        lede="Cambia tus puntos DALIA.EXE por participaciones. Los ganadores se eligen en directo con todas las participaciones en pantalla."
      />
      <RaffleGrid
        raffles={raffles.map((r) => ({
          id: r.id,
          name: r.name,
          category: r.category as "Merch" | "Riot" | "Periféricos" | "Especial",
          cost: r.cost,
          entries: r.entries,
          maxEntries: r.maxEntries,
          closes: r.closes,
          image: r.image ?? undefined,
        }))}
      />

      <Reveal>
        <section className="mt-14 pb-8">
          <h2 className="mb-4 text-xl font-bold">Últimos ganadores</h2>
          <Card className="overflow-hidden">
            {pastWinners.length === 0 ? (
              <p className="p-5 text-center text-sm text-dim">
                Todavía no se ha resuelto ningún sorteo — el primero quedará
                registrado aquí.
              </p>
            ) : (
              <ul className="divide-y divide-line/60">
                {pastWinners.map((w) => (
                  <li key={`${w.prize}-${w.date}`} className="flex items-center justify-between px-5 py-3">
                    <div>
                      <p className="text-sm font-semibold">{w.prize}</p>
                      <p className="text-xs text-faint">{w.date}</p>
                    </div>
                    <span className="font-display text-sm font-bold text-gold">
                      ✿ {w.winner}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
          <p className="mt-3 text-xs text-faint">
            Todos los sorteos se resuelven en directo. El historial completo es público
            para que nadie dude de nada.
          </p>
        </section>
      </Reveal>
    </div>
  );
}
