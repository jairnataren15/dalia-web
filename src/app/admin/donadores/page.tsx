import { Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { addDonor, deleteDonor } from "@/app/admin/actions";

export const metadata = { title: "Donadores — Admin DALIA.EXE" };

const inputCls =
  "w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-rose";

export default async function AdminDonorsPage() {
  const donors = await prisma.donor.findMany({ orderBy: { date: "desc" } });
  const total = donors.reduce((acc, d) => acc + d.amount, 0);
  const top = [...donors].sort((a, b) => b.amount - a.amount)[0];

  return (
    <div className="space-y-6">
      <p className="text-sm text-dim">
        Registro manual — todavía no hay una plataforma de donaciones conectada.
        Cuando Dalia use Streamlabs/Ko-fi, esto se puede automatizar.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wider text-faint">Total recaudado</p>
          <p className="tnum font-display text-2xl font-bold text-gold">
            {total.toLocaleString("es", { style: "currency", currency: "EUR" })}
          </p>
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wider text-faint">Mayor donador</p>
          <p className="font-display text-2xl font-bold text-rose">
            {top ? top.name : "—"}
          </p>
        </Card>
      </div>

      <Card className="p-5">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider">
          Registrar donación
        </h2>
        <form action={addDonor} className="grid gap-3 sm:grid-cols-[1fr_140px_1fr_auto]">
          <input name="name" required placeholder="Nombre" className={inputCls} />
          <input
            name="amount"
            required
            type="number"
            step="0.01"
            min="0.01"
            placeholder="Cantidad €"
            className={inputCls}
          />
          <input name="note" placeholder="Nota (opcional)" className={inputCls} />
          <button
            type="submit"
            className="rounded-lg bg-rose px-4 py-2 font-display text-sm font-bold text-base transition-colors hover:bg-rose-hi"
          >
            Añadir
          </button>
        </form>
      </Card>

      <Card className="overflow-hidden">
        {donors.length === 0 ? (
          <p className="p-6 text-center text-sm text-dim">
            Todavía no hay donaciones registradas.
          </p>
        ) : (
          <ul className="divide-y divide-line/60">
            {donors.map((d) => (
              <li key={d.id} className="flex items-center gap-4 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">{d.name}</p>
                  {d.note && <p className="text-xs text-faint">{d.note}</p>}
                </div>
                <span className="text-xs text-dim">{d.date.toLocaleDateString("es")}</span>
                <span className="tnum font-display font-bold text-gold">
                  {d.amount.toLocaleString("es", { style: "currency", currency: "EUR" })}
                </span>
                <form
                  action={async () => {
                    "use server";
                    await deleteDonor(d.id);
                  }}
                >
                  <button
                    type="submit"
                    className="rounded-lg border border-line bg-raised px-2.5 py-1 text-xs font-semibold text-dim transition-colors hover:bg-hover hover:text-danger"
                  >
                    Borrar
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
