"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { activeTournament } from "@/lib/data";

export default function CheckinPanel() {
  const [teams] = useState(activeTournament.registered);

  if (teams.length === 0) {
    return (
      <div className="rounded-xl border border-line bg-surface p-8 text-center">
        <p className="text-sm text-dim">
          Todavía no hay equipos inscritos en la Copa DALIA.EXE. En cuanto abran
          las inscripciones, aquí verás el estado de check-in de cada equipo.
        </p>
      </div>
    );
  }

  const done = teams.filter((t) => t.checkedIn).length;

  return (
    <div className="space-y-6">
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
