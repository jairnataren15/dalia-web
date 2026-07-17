"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { activeTournament } from "@/lib/data";

export default function CheckinPanel() {
  // Estado local simulando al equipo del usuario (índice 4 = MidOrFeed)
  const [teams, setTeams] = useState(activeTournament.registered);
  const myTeamIndex = 4;

  const confirm = () => {
    setTeams((prev) =>
      prev.map((t, i) => (i === myTeamIndex ? { ...t, checkedIn: true } : t))
    );
  };

  const done = teams.filter((t) => t.checkedIn).length;
  const myTeam = teams[myTeamIndex];

  return (
    <div className="space-y-6">
      {/* Tu equipo */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-xl border p-6 ${
          myTeam.checkedIn
            ? "border-live/40 bg-live-soft"
            : "rose-glow border-rose/50 bg-rose-soft"
        }`}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-dim">
          Tu equipo
        </p>
        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-display text-xl font-bold">{myTeam.name}</p>
            <p className="text-sm text-dim">Capitán: {myTeam.captain}</p>
          </div>
          {myTeam.checkedIn ? (
            <span className="flex items-center gap-2 font-display font-bold text-live">
              ✓ Check-in hecho
            </span>
          ) : (
            <button
              onClick={confirm}
              className="rounded-lg bg-rose px-6 py-2.5 font-display text-sm font-bold text-base transition-colors hover:bg-rose-hi"
            >
              Confirmar presencia
            </button>
          )}
        </div>
      </motion.div>

      {/* Barra de progreso */}
      <div>
        <div className="mb-2 flex justify-between text-xs text-dim">
          <span>Equipos confirmados</span>
          <span className="tnum">
            {done}/{teams.length}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-raised">
          <motion.div
            className="h-full rounded-full bg-live"
            initial={{ width: 0 }}
            animate={{ width: `${(done / teams.length) * 100}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
          />
        </div>
      </div>

      {/* Panel en vivo de todos los equipos */}
      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="border-b border-line bg-raised/60 px-5 py-3">
          <h2 className="font-display text-sm font-bold uppercase tracking-wider">
            Estado en vivo
          </h2>
        </div>
        <ul className="divide-y divide-line/60">
          {teams.map((t, i) => (
            <motion.li
              key={t.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between px-5 py-3"
            >
              <div>
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-faint">
                  {t.captain} · rango medio {t.avgRank}
                </p>
              </div>
              {t.checkedIn ? (
                <span className="rounded-full bg-live-soft px-3 py-1 text-xs font-bold text-live">
                  ✓ Confirmado
                </span>
              ) : (
                <span className="rounded-full bg-raised px-3 py-1 text-xs font-semibold text-dim">
                  Pendiente…
                </span>
              )}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}
