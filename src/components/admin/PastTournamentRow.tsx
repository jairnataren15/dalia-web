"use client";

import { deletePastTournament } from "@/app/admin/tournament-actions";

export interface PastTournamentView {
  id: string;
  name: string;
  date: string;
  winner: string;
  runnerUp: string;
  mvp: string;
  teamsCount: number;
}

export default function PastTournamentRow({ t }: { t: PastTournamentView }) {
  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-line/60 p-4 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{t.name}</p>
        <p className="text-xs text-dim">
          {t.date} · {t.teamsCount} equipos · 🏆 {t.winner} vs {t.runnerUp} · MVP {t.mvp}
        </p>
      </div>
      <form action={deletePastTournament.bind(null, t.id)}>
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
