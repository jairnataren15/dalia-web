"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { setBracketSlot, unassignTeamFromBracket } from "@/app/admin/tournament-actions";

const ROUND_NAMES = ["Cuartos de final", "Semifinales", "Final"];

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

function TeamRow({
  team,
  matchId,
  side,
  editable,
  isWinner,
  done,
  live,
  score,
}: {
  team: BracketTeam | null;
  matchId: string;
  side: "A" | "B";
  editable: boolean;
  isWinner: boolean;
  done: boolean;
  live: boolean;
  score: number;
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
      <span className="tnum shrink-0">{done || live ? score : ""}</span>
    </div>
  );
}

function MatchCard({
  match,
  index,
  editable,
}: {
  match: BracketMatchView;
  index: number;
  editable: boolean;
}) {
  const live = match.state === "en_juego";
  const done = match.state === "terminada";

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className={`w-56 shrink-0 overflow-hidden rounded-lg border bg-surface ${
        live ? "rose-glow border-rose/60" : "border-line"
      }`}
    >
      <div className="flex items-center justify-between border-b border-line/60 bg-raised/60 px-3 py-1.5">
        <span className="tnum text-[11px] text-faint">{match.hora}</span>
        {live ? (
          <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase text-rose">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-rose" />
            En juego
          </span>
        ) : done ? (
          <span className="text-[11px] font-semibold uppercase text-faint">Final</span>
        ) : (
          <span className="text-[11px] uppercase text-faint">Pendiente</span>
        )}
      </div>
      <TeamRow
        team={match.teamA}
        matchId={match.id}
        side="A"
        editable={editable}
        isWinner={match.scoreA > match.scoreB}
        done={done}
        live={live}
        score={match.scoreA}
      />
      <div className="border-t border-line/40" />
      <TeamRow
        team={match.teamB}
        matchId={match.id}
        side="B"
        editable={editable}
        isWinner={match.scoreB > match.scoreA}
        done={done}
        live={live}
        score={match.scoreB}
      />
    </motion.div>
  );
}

function BenchTeam({ team, tournamentId }: { team: BracketTeam; tournamentId: string }) {
  return (
    <span
      draggable
      onDragStart={(e) => e.dataTransfer.setData("text/plain", team.id)}
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
  const rounds = [1, 2, 3].map((r) => matches.filter((m) => m.round === r));
  const placedIds = new Set(
    matches.flatMap((m) => [m.teamA?.id, m.teamB?.id].filter((x): x is string => Boolean(x)))
  );
  const bench = teams.filter((t) => !placedIds.has(t.id));

  return (
    <div>
      {editable && tournamentId && (
        <div
          className="mb-5 flex flex-wrap items-center gap-2 rounded-lg border border-dashed border-line bg-raised/40 p-3"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const teamId = e.dataTransfer.getData("text/plain");
            if (teamId) unassignTeamFromBracket(tournamentId, teamId);
          }}
        >
          <span className="text-xs font-semibold uppercase tracking-wider text-faint">
            Equipos sin colocar (arrastra a una casilla, o suelta uno aquí para quitarlo del bracket)
          </span>
          {bench.length === 0 ? (
            <span className="text-xs text-dim">Todos los equipos están colocados.</span>
          ) : (
            bench.map((t) => <BenchTeam key={t.id} team={t} tournamentId={tournamentId} />)
          )}
        </div>
      )}
      <div className="overflow-x-auto pb-4">
        <div className="flex min-w-fit gap-10">
          {rounds.map((roundMatches, ri) => (
            <div key={ri} className="flex flex-col">
              <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.18em] text-rose">
                {ROUND_NAMES[ri]}
              </p>
              <div
                className="flex flex-1 flex-col gap-4"
                style={{ justifyContent: ri === 0 ? "flex-start" : "space-around" }}
              >
                {roundMatches.map((m, i) => (
                  <MatchCard key={m.id} match={m} index={ri * 2 + i} editable={editable} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
