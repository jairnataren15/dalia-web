import { PageHeader, Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { prisma } from "@/lib/prisma";
import { getViewMode } from "@/lib/adminView";
import { addScheduleEntry } from "@/app/admin/schedule-actions";
import ScheduleRow from "@/components/admin/ScheduleRow";

export const metadata = { title: "Calendario — Dalia" };

const TYPE_STYLES: Record<string, { label: string; cls: string }> = {
  stream: { label: "Directo", cls: "bg-rose/15 text-rose" },
  special: { label: "Especial", cls: "bg-gold-soft text-gold" },
  event: { label: "Evento", cls: "bg-live-soft text-live" },
  off: { label: "Descanso", cls: "bg-raised text-faint" },
};

const inputCls =
  "w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-rose";

export default async function CalendarioPage() {
  const [schedule, { isAdminView: isAdmin }] = await Promise.all([
    prisma.scheduleEntry.findMany({ orderBy: { order: "asc" } }),
    getViewMode(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <PageHeader
        eyebrow="Horario semanal"
        title="Calendario de directos"
        lede="Horario habitual (CET). Los cambios puntuales se avisan en Discord y Twitter el mismo día."
      />

      {isAdmin && (
        <Card className="mb-6 p-5">
          <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider">
            Añadir día (admin)
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
      )}

      {isAdmin ? (
        <Card className="overflow-hidden">
          {schedule.length === 0 ? (
            <p className="p-6 text-center text-sm text-dim">Sin entradas todavía.</p>
          ) : (
            schedule.map((e) => <ScheduleRow key={e.id} entry={e} />)
          )}
        </Card>
      ) : (
        <div className="space-y-3">
          {schedule.map((s, i) => {
            const t = TYPE_STYLES[s.type];
            return (
              <Reveal key={s.id} delay={i * 0.04}>
                <Card
                  className={`flex items-center gap-4 p-4 ${
                    s.type === "event" ? "border-live/40" : ""
                  } ${s.type === "off" ? "opacity-60" : ""}`}
                >
                  <div className="w-24 shrink-0">
                    <p className="font-display font-bold">{s.day}</p>
                    <p className="tnum text-xs text-dim">{s.time}</p>
                  </div>
                  <p className="flex-1 text-sm text-dim">{s.content}</p>
                  <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${t.cls}`}>
                    {t.label}
                  </span>
                </Card>
              </Reveal>
            );
          })}
        </div>
      )}

      <p className="mt-6 text-xs text-faint">
        ✿ El sábado 25 es la Copa DALIA.EXE #3 — el directo empieza antes para el
        check-in y el sorteo de llaves.
      </p>
    </div>
  );
}
