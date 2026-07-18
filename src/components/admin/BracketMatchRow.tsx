"use client";

import { updateMatch } from "@/app/admin/tournament-actions";
import { useActionFeedback } from "@/lib/useActionFeedback";

const inputCls =
  "w-full rounded-lg border border-line bg-raised px-2.5 py-1.5 text-sm text-ink outline-none transition-colors focus:border-rose";

export interface MatchView {
  id: string;
  round: number;
  hora: string;
  state: string;
  scoreA: number;
  scoreB: number;
  teamAName: string | null;
  teamBName: string | null;
}

const ROUND_LABEL: Record<number, string> = { 1: "Cuartos", 2: "Semis", 3: "Final" };

export default function BracketMatchRow({ match }: { match: MatchView }) {
  const { run, isPending } = useActionFeedback();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        run(() => updateMatch(match.id, formData), {
          loading: "Guardando…",
          success: "Casilla actualizada.",
        });
      }}
      className="grid items-center gap-2 border-b border-line/60 p-4 last:border-0 sm:grid-cols-[80px_1fr_70px_1fr_70px_110px_120px]"
    >
      <span className="text-xs font-semibold uppercase text-faint">{ROUND_LABEL[match.round] ?? match.round}</span>
      <span className="truncate text-sm">{match.teamAName ?? <span className="italic text-faint">Por definir</span>}</span>
      <input name="scoreA" type="number" min="0" defaultValue={match.scoreA} className={inputCls} />
      <span className="truncate text-sm">{match.teamBName ?? <span className="italic text-faint">Por definir</span>}</span>
      <input name="scoreB" type="number" min="0" defaultValue={match.scoreB} className={inputCls} />
      <input name="hora" defaultValue={match.hora} className={inputCls} />
      <div className="flex items-center gap-1.5">
        <select name="state" defaultValue={match.state} className={inputCls}>
          <option value="pendiente">Pendiente</option>
          <option value="en_juego">En juego</option>
          <option value="terminada">Terminada</option>
        </select>
        <button
          type="submit"
          disabled={isPending}
          className="shrink-0 rounded-lg bg-rose px-3 py-1.5 font-display text-xs font-bold text-base disabled:opacity-50"
        >
          Guardar
        </button>
      </div>
    </form>
  );
}
