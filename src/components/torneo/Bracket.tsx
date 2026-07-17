"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  setBracketSlot,
  unassignTeamFromBracket,
  quickUpdateMatch,
  addEarlierRound,
  removeEarliestRound,
} from "@/app/admin/tournament-actions";

const ROUND_NAME_BY_TEAMS: Record<number, string> = {
  64: "Treintaidosavos de final",
  32: "Dieciseisavos de final",
  16: "Octavos de final",
  8: "Cuartos de final",
  4: "Semifinales",
  2: "Final",
};

function roundName(teamsInRound: number) {
  return ROUND_NAME_BY_TEAMS[teamsInRound] ?? `Ronda de ${teamsInRound}`;
}

export interface BracketTeam {
  id: string;
  name: string;
}

export interface BracketMatchView {
  id: string;
  round: number;
  hora: string;
  state: string;
  scoreA: number;
  scoreB: number;
  teamA: BracketTeam | null;
  teamB: BracketTeam | null;
}

function ScoreField({
  matchId,
  side,
  value,
  editable,
}: {
  matchId: string;
  side: "scoreA" | "scoreB";
  value: number;
  editable: boolean;
}) {
  const [, startTransition] = useTransition();
  const [local, setLocal] = useState(value);

  if (!editable) return <span className="tnum shrink-0">{value}</span>;

  return (
    <input
      type="number"
      min="0"
      value={local}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => setLocal(Number(e.target.value))}
      onBlur={() => {
        if (local !== value) startTransition(() => quickUpdateMatch(matchId, { [side]: local }));
      }}
      className="tnum w-9 shrink-0 rounded border border-transparent bg-transparent px-1 text-right outline-none hover:border-line focus:border-rose focus:bg-raised"
    />
  );
}

function HoraField({ matchId, hora, editable }: { matchId: string; hora: string; editable: boolean }) {
  const [, startTransition] = useTransition();
  const [local, setLocal] = useState(hora);

  if (!editable) return <span className="tnum text-[11px] text-faint">{hora}</span>;

  return (
    <input
      value={local}
      onClick={(e) => e.stopPropagation()}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => {
        if (local !== hora) startTransition(() => quickUpdateMatch(matchId, { hora: local }));
      }}
      className="tnum w-14 rounded border border-transparent bg-transparent text-[11px] text-faint outline-none hover:border-line focus:border-rose focus:bg-raised focus:text-ink"
    />
  );
}

function StatePill({ matchId, state, editable }: { matchId: string; state: string; editable: boolean }) {
  const [, startTransition] = useTransition();
  const live = state === "en_juego";
  const done = state === "terminada";

  const label = live ? "En juego" : done ? "Final" : "Pendiente";
  const cls = live
    ? "flex items-center gap-1.5 text-[11px] font-bold uppercase text-rose"
    : done
      ? "text-[11px] font-semibold uppercase text-faint"
      : "text-[11px] uppercase text-faint";

  if (!editable) {
    return (
      <span className={cls}>
        {live && <span className="live-dot h-1.5 w-1.5 rounded-full bg-rose" />}
        {label}
      </span>
    );
  }

  const cycle = { pendiente: "en_juego", en_juego: "terminada", terminada: "pendiente" } as const;

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        const next = cycle[state as keyof typeof cycle] ?? "pendiente";
        startTransition(() => quickUpdateMatch(matchId, { state: next }));
      }}
      className={`${cls} cursor-pointer rounded px-1 hover:bg-raised`}
      title="Clic para cambiar el estado"
    >
      {live && <span className="live-dot h-1.5 w-1.5 rounded-full bg-rose" />}
      {label}
    </button>
  );
}

function TeamRow({
  team,
  matchId,
  side,
  editable,
  isWinner,
  done,
  scoreField,
}: {
  team: BracketTeam | null;
  matchId: string;
  side: "A" | "B";
  editable: boolean;
  isWinner: boolean;
  done: boolean;
  scoreField: React.ReactNode;
}) {
  const [, startTransition] = useTransition();
  const [dragOver, setDragOver] = useState(false);

  return (
    <div
      draggable={editable && team !== null}
      onDragStart={(e) => {
        if (!team) return;
        e.dataTransfer.setData("text/plain", team.id);
      }}
      onDragOver={(e) => {
        if (!editable) return;
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        if (!editable) return;
        e.preventDefault();
        setDragOver(false);
        const teamId = e.dataTransfer.getData("text/plain");
        if (!teamId) return;
        startTransition(() => {
          setBracketSlot(matchId, side, teamId);
        });
      }}
      className={`flex items-center justify-between gap-2 px-3 py-2 text-sm transition-colors ${
        team === null
          ? "text-faint italic"
          : done && isWinner
            ? "font-bold text-ink"
            : done
              ? "text-faint line-through decoration-danger/60"
              : "text-ink"
      } ${editable ? "cursor-grab active:cursor-grabbing" : ""} ${dragOver ? "bg-rose/15" : ""}`}
    >
      <span className="truncate">
        {team?.name ?? (editable ? "Suelta un equipo aquí" : "Por definir")}
      </span>
      {scoreField}
    </div>
  );
}

function MatchCard({
  match,
  editable,
}: {
  match: BracketMatchView;
  editable: boolean;
}) {
  const done = match.state === "terminada";
  const live = match.state === "en_juego";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 300, damping: 28 }}
      className={`w-60 shrink-0 overflow-hidden rounded-lg border bg-surface ${
        live ? "rose-glow border-rose/60" : "border-line"
      }`}
    >
      <div className="flex items-center justify-between border-b border-line/60 bg-raised/60 px-3 py-1.5">
        <HoraField matchId={match.id} hora={match.hora} editable={editable} />
        <StatePill matchId={match.id} state={match.state} editable={editable} />
      </div>
      <TeamRow
        team={match.teamA}
        matchId={match.id}
        side="A"
        editable={editable}
        isWinner={match.scoreA > match.scoreB}
        done={done}
        scoreField={
          <ScoreField matchId={match.id} side="scoreA" value={match.scoreA} editable={editable} />
        }
      />
      <div className="border-t border-line/40" />
      <TeamRow
        team={match.teamB}
        matchId={match.id}
        side="B"
        editable={editable}
        isWinner={match.scoreB > match.scoreA}
        done={done}
        scoreField={
          <ScoreField matchId={match.id} side="scoreB" value={match.scoreB} editable={editable} />
        }
      />
    </motion.div>
  );
}

function BenchTeam({ team }: { team: BracketTeam }) {
  return (
    <span
      draggable
      onDragStart={(e: React.DragEvent) => e.dataTransfer.setData("text/plain", team.id)}
      className="cursor-grab rounded-full border border-line bg-raised px-3 py-1 text-xs font-semibold text-ink active:cursor-grabbing"
      title={`Arrastra "${team.name}" a una casilla del bracket`}
    >
      {team.name}
    </span>
  );
}

export default function Bracket({
  matches,
  teams = [],
  tournamentId,
  editable = false,
}: {
  matches: BracketMatchView[];
  teams?: BracketTeam[];
  tournamentId?: string;
  editable?: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const roundNumbers = Array.from(new Set(matches.map((m) => m.round))).sort((a, b) => a - b);
  const rounds = roundNumbers.map((r) => matches.filter((m) => m.round === r));
  const placedIds = new Set(
    matches.flatMap((m) => [m.teamA?.id, m.teamB?.id].filter((x): x is string => Boolean(x)))
  );
  const bench = teams.filter((t) => !placedIds.has(t.id));

  return (
    <div>
      {editable && tournamentId && (
        <div className="mb-5 space-y-3">
          <div
            className="flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-line bg-raised/40 p-3"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const teamId = e.dataTransfer.getData("text/plain");
              if (teamId) unassignTeamFromBracket(tournamentId, teamId);
            }}
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-faint">
              Equipos sin colocar (arrastra a una casilla, o suelta uno aquí para quitarlo)
            </span>
            <AnimatePresence mode="popLayout">
              {bench.length === 0 ? (
                <span className="text-xs text-dim">Todos los equipos están colocados.</span>
              ) : (
                bench.map((t) => <BenchTeam key={t.id} team={t} />)
              )}
            </AnimatePresence>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              disabled={isPending}
              onClick={() => startTransition(() => addEarlierRound(tournamentId))}
              className="rounded-lg border border-rose/40 bg-rose/10 px-3 py-1.5 text-xs font-semibold text-rose transition-colors hover:border-rose disabled:opacity-50"
            >
              {isPending ? "Aplicando…" : "+ Añadir ronda anterior (dobla equipos)"}
            </button>
            {rounds.length > 1 && (
              <button
                type="button"
                disabled={isPending}
                onClick={() => {
                  if (confirm("Esto borra la ronda más temprana del bracket. ¿Continuar?")) {
                    startTransition(() => removeEarliestRound(tournamentId));
                  }
                }}
                className="rounded-lg border border-line bg-raised px-3 py-1.5 text-xs font-semibold text-dim transition-colors hover:bg-hover hover:text-danger disabled:opacity-50"
              >
                {isPending ? "Aplicando…" : "− Quitar ronda anterior"}
              </button>
            )}
          </div>
        </div>
      )}
      <div className="overflow-x-auto pb-4">
        <motion.div layout className="flex min-w-fit gap-10">
          <AnimatePresence mode="popLayout">
            {rounds.map((roundMatches, ri) => (
              <motion.div layout key={roundNumbers[ri]} className="flex flex-col">
                <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.18em] text-rose">
                  {roundName(roundMatches.length * 2)}
                </p>
                <div
                  className="flex flex-1 flex-col gap-4"
                  style={{ justifyContent: ri === 0 ? "flex-start" : "space-around" }}
                >
                  <AnimatePresence mode="popLayout">
                    {roundMatches.map((m) => (
                      <MatchCard key={m.id} match={m} editable={editable} />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
