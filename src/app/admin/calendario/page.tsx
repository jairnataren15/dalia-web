import { Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { addScheduleEntry } from "@/app/admin/schedule-actions";
import ScheduleRow from "@/components/admin/ScheduleRow";

export const metadata = { title: "Calendario — Admin DALIA.EXE" };

const inputCls =
  "w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-rose";

export default async function AdminSchedulePage() {
  const entries = await prisma.scheduleEntry.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider">
          Añadir día
        </h2>
        <form action={addScheduleEntry} className="grid gap-3 sm:grid-cols-[100px_140px_1fr_110px_auto]">
          <input name="day" required placeholder="Lunes" className={inputCls} />
          <input name="time" required placeholder="18:00 – 22:00" className={inputCls} />
          <input name="content" required placeholder="Qué hace ese día" className={inputCls} />
          <select name="type" defaultValue="stream" className={inputCls}>
            <option value="stream">stream</option>
            <option value="special">special</option>
            <option value="event">event</option>
            <option value="off">off</option>
          </select>
          <button
            type="submit"
            className="rounded-lg bg-rose px-4 py-2 font-display text-sm font-bold text-base transition-colors hover:bg-rose-hi"
          >
            Añadir
          </button>
        </form>
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
