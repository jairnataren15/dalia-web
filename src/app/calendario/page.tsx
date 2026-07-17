import { PageHeader, Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Calendario — Dalia" };

const TYPE_STYLES: Record<string, { label: string; cls: string }> = {
  stream: { label: "Directo", cls: "bg-rose/15 text-rose" },
  special: { label: "Especial", cls: "bg-gold-soft text-gold" },
  event: { label: "Evento", cls: "bg-live-soft text-live" },
  off: { label: "Descanso", cls: "bg-raised text-faint" },
};

export default async function CalendarioPage() {
  const schedule = await prisma.scheduleEntry.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <PageHeader
        eyebrow="Horario semanal"
        title="Calendario de directos"
        lede="Horario habitual (CET). Los cambios puntuales se avisan en Discord y Twitter el mismo día."
      />
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
      <p className="mt-6 text-xs text-faint">
        ✿ El sábado 25 es la Copa DALIA.EXE #3 — el directo empieza antes para el
        check-in y el sorteo de llaves.
      </p>
    </div>
  );
}
