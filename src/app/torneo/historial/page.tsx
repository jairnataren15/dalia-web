import { PageHeader, Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Historial de torneos — Dalia" };

export default async function HistorialPage() {
  const pastTournaments = await prisma.pastTournament.findMany({ orderBy: { order: "asc" } });

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <PageHeader
        eyebrow="Torneos"
        title="Historial de la Copa"
        lede="Todos los torneos DALIA.EXE, con sus campeones y MVPs. La gloria queda escrita."
      />
      {pastTournaments.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-sm text-dim">
            Todavía no se ha jugado ningún torneo — el historial se llena en
            cuanto termine la primera Copa DALIA.EXE.
          </p>
        </Card>
      )}
      <div className="space-y-4">
        {pastTournaments.map((t, i) => (
          <Reveal key={t.id} delay={i * 0.06}>
            <Card className="flex flex-col justify-between gap-4 p-6 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-display text-lg font-bold">{t.name}</h2>
                <p className="text-sm text-dim">
                  {t.date} · {t.teamsCount} equipos
                </p>
              </div>
              <div className="flex gap-8 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider text-faint">Campeón</p>
                  <p className="font-display font-bold text-gold">🏆 {t.winner}</p>
                  <p className="text-xs text-dim">vs {t.runnerUp}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-faint">MVP</p>
                  <p className="font-semibold text-rose">{t.mvp}</p>
                </div>
              </div>
            </Card>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
