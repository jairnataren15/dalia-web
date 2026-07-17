import { Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { getActiveTournament } from "@/lib/tournament";
import {
  updateTournamentInfo,
  addTeam,
  addPastTournament,
} from "@/app/admin/tournament-actions";
import TournamentTeamRow from "@/components/admin/TournamentTeamRow";
import BracketMatchRow from "@/components/admin/BracketMatchRow";
import PastTournamentRow from "@/components/admin/PastTournamentRow";

export const metadata = { title: "Torneo — Admin DALIA.EXE" };

const inputCls =
  "w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-rose";
const labelCls = "mb-1 block text-xs font-semibold uppercase tracking-wider text-dim";

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
        <form action={updateTournamentInfo.bind(null, t.id)} className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls}>Nombre</label>
            <input name="name" defaultValue={t.name} required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Formato</label>
            <input name="format" defaultValue={t.format} required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Fecha</label>
            <input name="date" defaultValue={t.date} required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Parche</label>
            <input name="patch" defaultValue={t.patch} required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Cupo máximo de equipos</label>
            <input name="maxTeams" type="number" min="2" defaultValue={t.maxTeams} required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Premio</label>
            <input name="prize" defaultValue={t.prize} required className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Check-in cierra</label>
            <input name="checkinCloses" defaultValue={t.checkinCloses} required className={inputCls} />
          </div>
          <label className="mt-6 flex items-center gap-2 text-sm text-dim">
            <input type="checkbox" name="checkinOpen" defaultChecked={t.checkinOpen} className="accent-[#ff4d7d]" />
            Ventana de check-in abierta
          </label>
          <button
            type="submit"
            className="rounded-lg bg-rose px-4 py-2 font-display text-sm font-bold text-base transition-colors hover:bg-rose-hi sm:col-span-2"
          >
            Guardar datos del torneo
          </button>
        </form>
      </Card>

      <Card className="p-5">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider">
          Añadir equipo inscrito
        </h2>
        <form action={addTeam.bind(null, t.id)} className="grid gap-3 sm:grid-cols-3">
          <input name="name" required placeholder="Nombre del equipo" className={inputCls} />
          <input name="captain" required placeholder="Capitán (Riot ID)" className={inputCls} />
          <input name="avgRank" required placeholder="Rango medio" className={inputCls} />
          <button
            type="submit"
            className="rounded-lg bg-rose px-4 py-2 font-display text-sm font-bold text-base transition-colors hover:bg-rose-hi sm:col-span-3"
          >
            Añadir equipo
          </button>
        </form>
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
        <form action={addPastTournament} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <input name="name" required placeholder="Nombre del torneo" className={inputCls} />
          <input name="date" required placeholder="Fecha" className={inputCls} />
          <input name="teamsCount" type="number" min="1" required placeholder="Nº de equipos" className={inputCls} />
          <input name="winner" required placeholder="Equipo campeón" className={inputCls} />
          <input name="runnerUp" required placeholder="Subcampeón" className={inputCls} />
          <input name="mvp" required placeholder="MVP" className={inputCls} />
          <button
            type="submit"
            className="rounded-lg bg-rose px-4 py-2 font-display text-sm font-bold text-base transition-colors hover:bg-rose-hi sm:col-span-2 lg:col-span-3"
          >
            Añadir al historial
          </button>
        </form>
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
