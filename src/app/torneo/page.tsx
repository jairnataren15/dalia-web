import Link from "next/link";
import { PageHeader, Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import Bracket from "@/components/torneo/Bracket";
import { getActiveTournament } from "@/lib/tournament";
import { getViewMode } from "@/lib/adminView";

export const metadata = { title: "Copa DALIA.EXE — Dalia" };

export default async function TorneoPage() {
  const [t, { isAdminView: isAdmin }] = await Promise.all([getActiveTournament(), getViewMode()]);

  if (!t) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
        <PageHeader eyebrow="Torneo" title="Sin torneo activo" lede="Todavía no hay ninguna copa programada." />
      </div>
    );
  }

  const checkedIn = t.teams.filter((r) => r.checkedIn).length;
  const matches = t.matches.map((m) => ({
    id: m.id,
    round: m.round,
    hora: m.hora,
    state: m.state,
    scoreA: m.scoreA,
    scoreB: m.scoreB,
    teamA: t.teams.find((tm) => tm.id === m.teamAId) ?? null,
    teamB: t.teams.find((tm) => tm.id === m.teamBId) ?? null,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <PageHeader
        eyebrow="Torneo activo"
        title={t.name}
        lede={`${t.format} · ${t.date} · Parche ${t.patch}`}
      />

      {/* Estado + acciones */}
      <Reveal>
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          <Card className="p-4">
            <p className="text-xs uppercase tracking-wider text-faint">Premio</p>
            <p className="mt-1 font-display text-sm font-bold text-gold">{t.prize}</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs uppercase tracking-wider text-faint">Equipos</p>
            <p className="mt-1 font-display text-2xl font-bold">
              {t.teams.length}<span className="text-dim">/{t.maxTeams}</span>
            </p>
          </Card>
          <Card className="p-4">
            <p className="text-xs uppercase tracking-wider text-faint">Check-in</p>
            <p className="mt-1 font-display text-2xl font-bold text-live">
              {checkedIn}<span className="text-dim">/{t.teams.length}</span>
            </p>
            <p className="text-xs text-dim">cierra a las {t.checkinCloses}</p>
          </Card>
        </div>
      </Reveal>

      <Reveal delay={0.05}>
        <div className="mb-10 flex flex-wrap gap-3">
          <Link
            href="/torneo/inscripcion"
            className="rounded-lg bg-rose px-5 py-2.5 font-display text-sm font-semibold text-base transition-colors hover:bg-rose-hi"
          >
            Inscribir mi equipo
          </Link>
          <Link
            href="/torneo/check-in"
            className="rounded-lg border border-live/40 bg-live-soft px-5 py-2.5 font-display text-sm font-semibold text-live transition-colors hover:border-live"
          >
            Hacer check-in
          </Link>
          <Link
            href="/torneo/reglas"
            className="rounded-lg border border-line bg-surface px-5 py-2.5 font-display text-sm font-semibold text-dim transition-colors hover:bg-hover hover:text-ink"
          >
            Reglas
          </Link>
          <Link
            href="/torneo/historial"
            className="rounded-lg border border-line bg-surface px-5 py-2.5 font-display text-sm font-semibold text-dim transition-colors hover:bg-hover hover:text-ink"
          >
            Torneos anteriores
          </Link>
          {isAdmin && (
            <Link
              href="/admin/torneo"
              className="rounded-lg border border-rose/40 bg-rose/10 px-5 py-2.5 font-display text-sm font-semibold text-rose transition-colors hover:border-rose"
            >
              Editar torneo (admin)
            </Link>
          )}
        </div>
      </Reveal>

      {/* Bracket */}
      <Reveal delay={0.1}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Cuadro del torneo</h2>
          {isAdmin && (
            <span className="text-xs text-faint">Modo admin: arrastra equipos entre casillas.</span>
          )}
        </div>
        <Bracket
          matches={matches}
          teams={t.teams.map((tm) => ({ id: tm.id, name: tm.name }))}
          tournamentId={t.id}
          editable={isAdmin}
        />
      </Reveal>
    </div>
  );
}
