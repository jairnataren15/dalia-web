"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { lfgPosts, TIER_COLORS, type Role } from "@/lib/data";

const ROLE_FILTERS = ["Todos", "Top", "Jungla", "Mid", "ADC", "Soporte"] as const;

export default function LfgBoard() {
  const [role, setRole] = useState<(typeof ROLE_FILTERS)[number]>("Todos");

  const filtered = lfgPosts.filter(
    (p) => role === "Todos" || p.role === (role as Role)
  );

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {ROLE_FILTERS.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`relative rounded-lg px-3.5 py-1.5 font-display text-sm font-semibold transition-colors ${
                role === r ? "text-base" : "text-dim hover:text-ink"
              }`}
            >
              {role === r && (
                <motion.span
                  layoutId="lfg-pill"
                  className="absolute inset-0 rounded-lg bg-rose"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">{r}</span>
            </button>
          ))}
        </div>
        <button className="rounded-lg bg-rose px-4 py-2 font-display text-sm font-bold text-base transition-colors hover:bg-rose-hi">
          + Publicar anuncio
        </button>
      </div>

      <motion.ul layout className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => (
            <motion.li
              key={p.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="rounded-xl border border-line bg-surface p-5 transition-colors hover:border-rose/40"
            >
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="font-semibold">{p.user}</span>
                <span
                  className="rounded-full px-2 py-0.5 text-[11px] font-bold"
                  style={{
                    color: TIER_COLORS[p.tier],
                    backgroundColor: `${TIER_COLORS[p.tier]}1f`,
                  }}
                >
                  {p.tier}
                </span>
                <span className="rounded-full bg-raised px-2 py-0.5 text-[11px] font-semibold text-dim">
                  {p.role}
                </span>
                <span className="rounded-full bg-raised px-2 py-0.5 text-[11px] font-semibold text-dim">
                  {p.region}
                </span>
                <span className="ml-auto text-xs text-faint">{p.posted}</span>
              </div>
              <p className="font-display text-sm font-bold text-rose">{p.looking}</p>
              <p className="mt-1 text-sm text-dim">{p.message}</p>
              <button className="mt-3 rounded-lg border border-line bg-raised px-4 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-hover">
                Contactar por Discord
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-faint">
          Nadie busca {role} ahora mismo — sé el primero en publicar.
        </p>
      )}
    </div>
  );
}
