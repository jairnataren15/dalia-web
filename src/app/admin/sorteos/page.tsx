import { Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import AddRaffleForm from "@/components/admin/AddRaffleForm";
import RaffleRow from "@/components/admin/RaffleRow";

export const metadata = { title: "Sorteos — Admin DALIA.EXE" };

export default async function AdminRafflesPage() {
  const raffles = await prisma.raffle.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider">
          Añadir sorteo
        </h2>
        <AddRaffleForm />
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
