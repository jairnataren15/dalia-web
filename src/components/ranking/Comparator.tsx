"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  winrate,
  rankLabel,
  champIcon,
  TIER_COLORS,
  type Member,
} from "@/lib/data";

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const w = 220;
  const h = 56;
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * (h - 8) - 4}`)
    .join(" ");
  const last = data[data.length - 1];
  const lastY = h - ((last - min) / range) * (h - 8) - 4;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" aria-hidden>
      <polyline
        points={pts}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <polygon
        points={`0,${h} ${pts} ${w},${h}`}
        fill={color}
        opacity="0.08"
      />
      <circle cx={w} cy={lastY} r="3.5" fill={color} />
    </svg>
  );
}

function StatRow({
  label,
  a,
  b,
  higherWins = true,
  format = (v: number) => String(v),
}: {
  label: string;
  a: number;
  b: number;
  higherWins?: boolean;
  format?: (v: number) => string;
}) {
  const aWins = higherWins ? a > b : a < b;
  const bWins = higherWins ? b > a : b < a;
  return (
    <div className="grid grid-cols-3 items-center border-b border-line/60 py-2.5 last:border-0">
      <span className={`tnum text-right font-semibold ${aWins ? "text-live" : "text-dim"}`}>
        {format(a)}
      </span>
      <span className="text-center text-xs uppercase tracking-wider text-faint">
        {label}
      </span>
      <span className={`tnum font-semibold ${bWins ? "text-live" : "text-dim"}`}>
        {format(b)}
      </span>
    </div>
  );
}

function PlayerCol({ m, align }: { m: Member; align: "left" | "right" }) {
  const color = TIER_COLORS[m.tier];
  return (
    <div className={`flex items-center gap-3 ${align === "right" ? "flex-row-reverse text-right" : ""}`}>
      <img
        src={champIcon(m.mains[0])}
        alt={m.mains[0]}
        className="h-14 w-14 rounded-xl border-2"
        style={{ borderColor: color }}
      />
      <div>
        <p className="font-display text-lg font-bold leading-tight">
          {m.riotId}
          <span className="ml-1 text-xs font-normal text-faint">#{m.tag}</span>
        </p>
        <p className="text-sm font-medium" style={{ color }}>
          {rankLabel(m)} · <span className="tnum">{m.lp} LP</span>
        </p>
      </div>
    </div>
  );
}

export default function Comparator({ members }: { members: Member[] }) {
  const [aId, setAId] = useState(members[0]?.id ?? "");
  const [bId, setBId] = useState(members[1]?.id ?? "");

  const a = members.find((m) => m.id === aId);
  const b = members.find((m) => m.id === bId);

  if (!a || !b) return null;

  const selectCls =
    "w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm font-medium text-ink outline-none transition-colors focus:border-rose";

  return (
    <div className="rounded-xl border border-line bg-surface p-5 sm:p-6">
      {/* Selectores */}
      <div className="mb-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <select value={aId} onChange={(e) => setAId(e.target.value)} className={selectCls} aria-label="Jugador A">
          {members.map((m) => (
            <option key={m.id} value={m.id} disabled={m.id === bId}>
              {m.riotId}#{m.tag}
            </option>
          ))}
        </select>
        <span className="font-display text-lg font-bold text-rose">VS</span>
        <select value={bId} onChange={(e) => setBId(e.target.value)} className={selectCls} aria-label="Jugador B">
          {members.map((m) => (
            <option key={m.id} value={m.id} disabled={m.id === aId}>
              {m.riotId}#{m.tag}
            </option>
          ))}
        </select>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${aId}-${bId}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25 }}
        >
          {/* Cabeceras de jugador */}
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row">
            <PlayerCol m={a} align="left" />
            <PlayerCol m={b} align="right" />
          </div>

          {/* Stats */}
          <StatRow label="Winrate" a={winrate(a)} b={winrate(b)} format={(v) => `${v}%`} />
          {(a.kda > 0 || b.kda > 0) && (
            <StatRow label="KDA medio" a={a.kda} b={b.kda} format={(v) => v.toFixed(1)} />
          )}
          <StatRow label="Victorias" a={a.wins} b={b.wins} />
          <StatRow label="Partidas" a={a.wins + a.losses} b={b.wins + b.losses} />
          <StatRow
            label="Racha"
            a={a.streak}
            b={b.streak}
            format={(v) => (v > 0 ? `+${v}` : String(v))}
          />

          {/* LP históricos */}
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs uppercase tracking-wider text-faint">
                LP · últimas 10 semanas — {a.riotId}
              </p>
              <Sparkline data={a.lpHistory} color={TIER_COLORS[a.tier]} />
            </div>
            <div>
              <p className="mb-2 text-xs uppercase tracking-wider text-faint">
                LP · últimas 10 semanas — {b.riotId}
              </p>
              <Sparkline data={b.lpHistory} color={TIER_COLORS[b.tier]} />
            </div>
          </div>

          {/* Campeones */}
          <div className="mt-6 grid grid-cols-2 gap-6 border-t border-line/60 pt-5">
            <div className="flex gap-2">
              {a.mains.map((c) => (
                <img key={c} src={champIcon(c)} alt={c} title={c} className="h-10 w-10 rounded-lg border border-line" />
              ))}
            </div>
            <div className="flex justify-end gap-2">
              {b.mains.map((c) => (
                <img key={c} src={champIcon(c)} alt={c} title={c} className="h-10 w-10 rounded-lg border border-line" />
              ))}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
