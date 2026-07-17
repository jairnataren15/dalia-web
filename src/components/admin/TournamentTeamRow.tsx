"use client";

import { useState } from "react";
import { updateTeam, deleteTeam, toggleTeamCheckin } from "@/app/admin/tournament-actions";

const inputCls =
  "w-full rounded-lg border border-line bg-raised px-2.5 py-1.5 text-sm text-ink outline-none transition-colors focus:border-rose";

export interface TeamView {
  id: string;
  name: string;
  captain: string;
  avgRank: string;
  checkedIn: boolean;
}

export default function TournamentTeamRow({ team }: { team: TeamView }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <form
        action={async (formData: FormData) => {
          await updateTeam(team.id, formData);
          setEditing(false);
        }}
        className="grid gap-2 border-b border-line/60 p-4 sm:grid-cols-3"
      >
        <input name="name" defaultValue={team.name} required placeholder="Nombre del equipo" className={inputCls} />
        <input name="captain" defaultValue={team.captain} required placeholder="Capitán (Riot ID)" className={inputCls} />
        <input name="avgRank" defaultValue={team.avgRank} required placeholder="Rango medio" className={inputCls} />
        <div className="flex gap-1.5 sm:col-span-3">
          <button type="submit" className="rounded-lg bg-rose px-4 py-1.5 font-display text-xs font-bold text-base">
            Guardar
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-lg border border-line px-4 py-1.5 text-xs font-semibold text-dim"
          >
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-line/60 p-4 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{team.name}</p>
        <p className="tnum text-xs text-dim">
          {team.captain} · rango medio {team.avgRank}
        </p>
      </div>
      <form action={toggleTeamCheckin.bind(null, team.id, !team.checkedIn)}>
        <button
          type="submit"
          className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
            team.checkedIn ? "bg-live-soft text-live" : "bg-raised text-faint"
          }`}
        >
          {team.checkedIn ? "Check-in ✓" : "Pendiente"}
        </button>
      </form>
      <button
        onClick={() => setEditing(true)}
        className="rounded-lg border border-line bg-raised px-2.5 py-1 text-xs font-semibold text-dim transition-colors hover:bg-hover hover:text-ink"
      >
        Editar
      </button>
      <form action={deleteTeam.bind(null, team.id)}>
        <button
          type="submit"
          className="rounded-lg border border-line bg-raised px-2.5 py-1 text-xs font-semibold text-dim transition-colors hover:bg-hover hover:text-danger"
        >
          Borrar
        </button>
      </form>
    </div>
  );
}
