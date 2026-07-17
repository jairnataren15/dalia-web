import { Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { addRaffle } from "@/app/admin/raffle-actions";
import RaffleRow from "@/components/admin/RaffleRow";

export const metadata = { title: "Sorteos — Admin DALIA.EXE" };

const inputCls =
  "w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-rose";

export default async function AdminRafflesPage() {
  const raffles = await prisma.raffle.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider">
          Añadir sorteo
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

      <Card className="overflow-hidden">
        {raffles.length === 0 ? (
          <p className="p-6 text-center text-sm text-dim">Sin sorteos todavía.</p>
        ) : (
          raffles.map((r) => <RaffleRow key={r.id} raffle={r} />)
        )}
      </Card>
    </div>
  );
}
