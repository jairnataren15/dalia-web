"use client";

import { motion } from "framer-motion";
import { activeTournament, type BracketMatch } from "@/lib/data";

const ROUND_NAMES = ["Cuartos de final", "Semifinales", "Final"];

function MatchCard({ match, index }: { match: BracketMatch; index: number }) {
  const live = match.state === "en_juego";
  const done = match.state === "terminada";

  const rowCls = (isWinner: boolean, name: string | null) =>
    `flex items-center justify-between gap-2 px-3 py-2 text-sm ${
      name === null
        ? "text-faint italic"
        : done && isWinner
          ? "font-bold text-ink"
          : done
            ? "text-faint line-through decoration-danger/60"
            : "text-ink"
    }`;

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
      <div className={rowCls(match.scoreA > match.scoreB, match.teamA)}>
        <span className="truncate">{match.teamA ?? "Por definir"}</span>
        <span className="tnum">{done || live ? match.scoreA : ""}</span>
      </div>
      <div className="border-t border-line/40" />
      <div className={rowCls(match.scoreB > match.scoreA, match.teamB)}>
        <span className="truncate">{match.teamB ?? "Por definir"}</span>
        <span className="tnum">{done || live ? match.scoreB : ""}</span>
      </div>
    </motion.div>
  );
}

export default function Bracket() {
  const rounds = [1, 2, 3].map((r) =>
    activeTournament.bracket.filter((m) => m.round === r)
  );

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex min-w-fit gap-10">
        {rounds.map((matches, ri) => (
          <div key={ri} className="flex flex-col">
            <p className="mb-3 font-display text-xs font-semibold uppercase tracking-[0.18em] text-rose">
              {ROUND_NAMES[ri]}
            </p>
            <div
              className="flex flex-1 flex-col gap-4"
              style={{ justifyContent: ri === 0 ? "flex-start" : "space-around" }}
            >
              {matches.map((m, i) => (
                <MatchCard key={m.id} match={m} index={ri * 2 + i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
