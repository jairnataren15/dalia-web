"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { members, winrate, rankLabel, champIcon, type Region } from "@/lib/data";
import { RankBadge } from "@/components/ui";

const REGIONS: (Region | "GLOBAL")[] = ["GLOBAL", "EUW", "NA", "LAN", "LAS"];

export default function LolRanking() {
  const [region, setRegion] = useState<(typeof REGIONS)[number]>("GLOBAL");

  const filtered = members.filter(
    (m) => region === "GLOBAL" || m.region === region
  );

  return (
    <div>
      {/* Filtros de región */}
      <div className="mb-4 flex flex-wrap gap-2">
        {REGIONS.map((r) => (
          <button
            key={r}
            onClick={() => setRegion(r)}
            className={`relative rounded-lg px-4 py-1.5 font-display text-sm font-semibold transition-colors ${
              region === r ? "text-base" : "text-dim hover:text-ink"
            }`}
          >
            {region === r && (
              <motion.span
                layoutId="region-pill"
                className="absolute inset-0 rounded-lg bg-rose"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{r}</span>
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-line bg-surface">
        <table className="w-full min-w-155 text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-faint">
              <th className="px-4 py-3 font-semibold">#</th>
              <th className="px-4 py-3 font-semibold">Jugador</th>
              <th className="px-4 py-3 font-semibold">Mains</th>
              <th className="px-4 py-3 font-semibold">Rango</th>
              <th className="px-4 py-3 text-right font-semibold">V / D</th>
              <th className="px-4 py-3 text-right font-semibold">Winrate</th>
              <th className="px-4 py-3 text-right font-semibold">Racha</th>
            </tr>
          </thead>
          <AnimatePresence mode="popLayout">
            <tbody>
              {filtered.map((m, i) => {
                const wr = winrate(m);
                return (
                  <motion.tr
                    key={m.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.3 }}
                    className="border-b border-line/60 last:border-0 hover:bg-hover"
                  >
                    <td className="tnum px-4 py-3 text-dim">{i + 1}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`https://www.op.gg/summoners/${m.region.toLowerCase()}/${m.riotId}-${m.tag}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold hover:text-rose"
                      >
                        {m.riotId}
                        <span className="ml-1 text-xs font-normal text-faint">
                          #{m.tag}
                        </span>
                      </a>
                      <span className="ml-2 rounded bg-raised px-1.5 py-0.5 text-[10px] font-semibold text-dim">
                        {m.region}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex -space-x-1.5">
                        {m.mains.map((c) => (
                          <img
                            key={c}
                            src={champIcon(c)}
                            alt={c}
                            title={c}
                            className="h-7 w-7 rounded-full border-2 border-surface"
                          />
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <RankBadge tier={m.tier} division={m.division} lp={m.lp} />
                    </td>
                    <td className="tnum px-4 py-3 text-right text-dim">
                      <span className="text-live">{m.wins}</span> /{" "}
                      <span className="text-danger">{m.losses}</span>
                    </td>
                    <td className="tnum px-4 py-3 text-right font-semibold">
                      <span className={wr >= 53 ? "text-live" : wr < 50 ? "text-danger" : ""}>
                        {wr}%
                      </span>
                    </td>
                    <td className="tnum px-4 py-3 text-right">
                      {m.streak > 0 ? (
                        <span className="text-live">▲ {m.streak}</span>
                      ) : (
                        <span className="text-danger">▼ {Math.abs(m.streak)}</span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </AnimatePresence>
        </table>
      </div>
      <p className="mt-2 text-xs text-faint">
        {rankLabel(members[0])} es el rango más alto de DALIA.EXE ahora mismo ·
        Los nombres enlazan a op.gg
      </p>
    </div>
  );
}
