import { PageHeader, Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import RaffleGrid from "@/components/tienda/RaffleGrid";
import RaffleRow from "@/components/admin/RaffleRow";
import { pastWinners } from "@/lib/data";
import { prisma } from "@/lib/prisma";
import { getViewMode } from "@/lib/adminView";
import { addRaffle } from "@/app/admin/raffle-actions";

export const metadata = { title: "Tienda — Dalia" };

const inputCls =
  "w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-rose";

export default async function TiendaPage() {
  const { isAdminView: isAdmin } = await getViewMode();

  const raffles = await prisma.raffle.findMany({
    where: isAdmin ? undefined : { active: true },
    orderBy: { order: "asc" },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <PageHeader
        eyebrow="Tienda DALIA.EXE"
        title="Sorteos por puntos"
        lede="Cambia tus puntos DALIA.EXE por participaciones. Los ganadores se eligen en directo con todas las participaciones en pantalla."
      />

      {isAdmin && (
        <Card className="mb-6 p-5">
          <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider">
            Añadir sorteo (admin)
          </h2>
          <form action={addRaffle} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <input name="name" required placeholder="Nombre del premio" className={inputCls} />
            <select name="category" defaultValue="Merch" className={inputCls}>
              <option value="Merch">Merch</option>
              <option value="Riot">Riot</option>
              <option value="Periféricos">Periféricos</option>
              <option value="Especial">Especial</option>
            </select>
            <input name="closes" required placeholder="Cierra: Viernes 20:00" className={inputCls} />
            <input name="cost" type="number" min="1" required placeholder="Costo en puntos" className={inputCls} />
            <input name="maxEntries" type="number" min="1" required placeholder="Cupo máximo" className={inputCls} />
            <input name="image" placeholder="Campeón para ilustrar (opcional)" className={inputCls} />
            <button
              type="submit"
              className="rounded-lg bg-rose px-4 py-2 font-display text-sm font-bold text-base transition-colors hover:bg-rose-hi sm:col-span-2 lg:col-span-3"
            >
              Añadir sorteo
            </button>
          </form>
        </Card>
      )}

      {isAdmin ? (
        <Card className="mb-8 overflow-hidden">
          {raffles.length === 0 ? (
            <p className="p-6 text-center text-sm text-dim">Sin sorteos todavía.</p>
          ) : (
            raffles.map((r) => <RaffleRow key={r.id} raffle={r} />)
          )}
        </Card>
      ) : (
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
      )}

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
