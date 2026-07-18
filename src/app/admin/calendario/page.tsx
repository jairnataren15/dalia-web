import { Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import AddScheduleForm from "@/components/admin/AddScheduleForm";
import ScheduleRow from "@/components/admin/ScheduleRow";

export const metadata = { title: "Calendario — Admin DALIA.EXE" };

export default async function AdminSchedulePage() {
  const entries = await prisma.scheduleEntry.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider">
          Añadir día
        </h2>
        <AddScheduleForm />
      </Card>

      <Card className="overflow-hidden">
        {entries.length === 0 ? (
          <p className="p-6 text-center text-sm text-dim">Sin entradas todavía.</p>
        ) : (
          entries.map((e) => <ScheduleRow key={e.id} entry={e} />)
        )}
      </Card>
    </div>
  );
}
