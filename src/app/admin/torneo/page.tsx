import { Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { getActiveTournament } from "@/lib/tournament";
import TournamentTeamRow from "@/components/admin/TournamentTeamRow";
import BracketMatchRow from "@/components/admin/BracketMatchRow";
import PastTournamentRow from "@/components/admin/PastTournamentRow";
import UpdateTournamentInfoForm from "@/components/admin/UpdateTournamentInfoForm";
import AddTeamForm from "@/components/admin/AddTeamForm";
import AddPastTournamentForm from "@/components/admin/AddPastTournamentForm";

export const metadata = { title: "Torneo — Admin DALIA.EXE" };

export default async function AdminTorneoPage() {
  const [t, pastTournaments] = await Promise.all([
    getActiveTournament(),
    prisma.pastTournament.findMany({ orderBy: { order: "asc" } }),
  ]);

  if (!t) {
    return (
      <Card className="p-6 text-center text-sm text-dim">
        No hay ningún torneo activo en la base de datos.
      </Card>
    );
  }

  const teamById = new Map(t.teams.map((tm) => [tm.id, tm.name]));
  const matches = t.matches.map((m) => ({
    id: m.id,
    round: m.round,
    hora: m.hora,
    state: m.state,
    scoreA: m.scoreA,
    scoreB: m.scoreB,
    teamAName: m.teamAId ? (teamById.get(m.teamAId) ?? null) : null,
    teamBName: m.teamBId ? (teamById.get(m.teamBId) ?? null) : null,
  }));

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider">
          Datos del torneo activo
        </h2>
        <UpdateTournamentInfoForm
          t={{
            id: t.id,
            name: t.name,
            format: t.format,
            date: t.date,
            patch: t.patch,
            maxTeams: t.maxTeams,
            prize: t.prize,
            checkinCloses: t.checkinCloses,
            checkinOpen: t.checkinOpen,
          }}
        />
      </Card>

      <Card className="p-5">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider">
          Añadir equipo inscrito
        </h2>
        <AddTeamForm tournamentId={t.id} />
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-line bg-raised/60 px-5 py-3">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider">
            Equipos inscritos ({t.teams.length}/{t.maxTeams})
          </h2>
        </div>
        {t.teams.length === 0 ? (
          <p className="p-6 text-center text-sm text-dim">Todavía no hay equipos inscritos.</p>
        ) : (
          t.teams.map((tm) => (
            <TournamentTeamRow
              key={tm.id}
              team={{ id: tm.id, name: tm.name, captain: tm.captain, avgRank: tm.avgRank, checkedIn: tm.checkedIn }}
            />
          ))
        )}
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-line bg-raised/60 px-5 py-3">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider">
            Casillas del bracket (marcador y estado)
          </h2>
          <p className="mt-1 text-xs text-dim">
            Para mover equipos entre casillas ve a{" "}
            <a href="/torneo" className="text-rose hover:underline">/torneo</a> — ahí puedes arrastrarlos directamente.
          </p>
        </div>
        {matches.map((m) => (
          <BracketMatchRow key={m.id} match={m} />
        ))}
      </Card>

      <Card className="p-5">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider">
          Añadir torneo al historial
        </h2>
        <AddPastTournamentForm />
      </Card>

      <Card className="overflow-hidden">
        <div className="border-b border-line bg-raised/60 px-5 py-3">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider">Historial de torneos</h2>
        </div>
        {pastTournaments.length === 0 ? (
          <p className="p-6 text-center text-sm text-dim">Sin torneos anteriores todavía.</p>
        ) : (
          pastTournaments.map((pt) => <PastTournamentRow key={pt.id} t={pt} />)
        )}
      </Card>
    </div>
  );
}
