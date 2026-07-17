"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { activePrediction, champIcon } from "@/lib/data";

export default function PredictionWidget() {
  const [bet, setBet] = useState<"yes" | "no" | null>(null);
  const [amount, setAmount] = useState(100);

  const p = activePrediction;
  const total = p.poolYes + p.poolNo;
  const pctYes = Math.round((p.poolYes / total) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-xl border border-line bg-surface"
    >
      <div className="flex items-center gap-4 border-b border-line bg-raised/60 px-6 py-4">
        <img
          src={champIcon(p.champ)}
          alt={p.champ}
          className="h-12 w-12 rounded-xl border border-rose/40"
        />
        <div>
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose">
            <span className="live-dot h-1.5 w-1.5 rounded-full bg-rose" />
            Predicción abierta
          </p>
          <h2 className="font-display text-lg font-bold">{p.question}</h2>
        </div>
      </div>

      <div className="p-6">
        {/* Barra de pools */}
        <div className="mb-1 flex justify-between text-xs font-semibold">
          <span className="text-live">GANA · {pctYes}%</span>
          <span className="text-danger">PIERDE · {100 - pctYes}%</span>
        </div>
        <div className="flex h-3 overflow-hidden rounded-full">
          <motion.div
            className="bg-live"
            initial={{ width: 0 }}
            animate={{ width: `${pctYes}%` }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
          <div className="flex-1 bg-danger/70" />
        </div>
        <div className="mt-1 flex justify-between text-[11px] text-faint">
          <span className="tnum">{p.poolYes.toLocaleString("es")} pts apostados</span>
          <span className="tnum">{p.poolNo.toLocaleString("es")} pts apostados</span>
        </div>

        {/* Selección */}
        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            onClick={() => setBet("yes")}
            className={`rounded-xl border-2 py-4 font-display text-lg font-bold transition-all ${
              bet === "yes"
                ? "border-live bg-live-soft text-live"
                : "border-line bg-raised text-dim hover:border-live/50 hover:text-ink"
            }`}
          >
            GANA
          </button>
          <button
            onClick={() => setBet("no")}
            className={`rounded-xl border-2 py-4 font-display text-lg font-bold transition-all ${
              bet === "no"
                ? "border-danger bg-danger/10 text-danger"
                : "border-line bg-raised text-dim hover:border-danger/50 hover:text-ink"
            }`}
          >
            PIERDE
          </button>
        </div>

        {/* Cantidad */}
        <motion.div
          animate={{ opacity: bet ? 1 : 0.4 }}
          className="mt-5 flex flex-wrap items-center gap-3"
        >
          <input
            type="range"
            min={50}
            max={1000}
            step={50}
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            disabled={!bet}
            className="min-w-40 flex-1 accent-[#ff4d7d]"
            aria-label="Cantidad de puntos"
          />
          <span className="tnum w-24 text-right font-display font-bold text-rose">
            {amount} pts
          </span>
          <button
            disabled={!bet}
            className="rounded-lg bg-rose px-6 py-2.5 font-display text-sm font-bold text-base transition-colors enabled:hover:bg-rose-hi disabled:cursor-not-allowed disabled:opacity-40"
          >
            Apostar
          </button>
        </motion.div>

        <p className="mt-4 text-xs text-faint">
          Se cierra {p.closesIn.toLowerCase()} · si aciertas, te llevas tu parte
          proporcional del pool contrario. Las partidas canceladas devuelven lo apostado.
        </p>
      </div>
    </motion.div>
  );
}
