import { Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import AddDonorForm from "@/components/admin/AddDonorForm";
import DeleteDonorButton from "@/components/admin/DeleteDonorButton";

export const metadata = { title: "Donadores — Admin DALIA.EXE" };

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
            {total.toLocaleString("es", { style: "currency", currency: "USD" })}
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
        <AddDonorForm />
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
                  {d.amount.toLocaleString("es", { style: "currency", currency: "USD" })}
                </span>
                <DeleteDonorButton id={d.id} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
