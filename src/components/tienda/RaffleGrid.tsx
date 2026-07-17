"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { champSplash, type RaffleItem } from "@/lib/data";

const CATEGORIES = ["Todos", "Riot", "Merch", "Periféricos", "Especial"] as const;

function RaffleCard({ item, index }: { item: RaffleItem; index: number }) {
  const pct = Math.round((item.entries / item.maxEntries) * 100);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      className="group overflow-hidden rounded-xl border border-line bg-surface transition-colors hover:border-rose/40"
    >
      <div className="relative flex aspect-[16/8] items-center justify-center overflow-hidden bg-raised">
        {item.image ? (
          <img
            src={champSplash(item.image, 0)}
            alt=""
            className="h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="text-5xl opacity-40">
            {item.category === "Merch" ? "❖" : item.category === "Periféricos" ? "⌨" : "✿"}
          </span>
        )}
        <span className="absolute left-2 top-2 rounded bg-base/85 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-rose backdrop-blur">
          {item.category}
        </span>
        <span className="absolute bottom-2 right-2 rounded bg-base/85 px-2 py-0.5 text-[11px] font-semibold text-dim backdrop-blur">
          Cierra: {item.closes}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-display text-sm font-bold leading-snug">{item.name}</h3>

        <div className="mt-3">
          <div className="mb-1 flex justify-between text-[11px] text-faint">
            <span className="tnum">{item.entries} participaciones</span>
            <span className="tnum">{pct}%</span>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-raised">
            <motion.div
              className="h-full rounded-full bg-rose"
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          </div>
        </div>

        <button className="mt-4 w-full rounded-lg bg-rose py-2 font-display text-xs font-bold text-base transition-colors hover:bg-rose-hi">
          Participar · {item.cost} pts
        </button>
      </div>
    </motion.div>
  );
}

export default function RaffleGrid({ raffles }: { raffles: RaffleItem[] }) {
  const [cat, setCat] = useState<(typeof CATEGORIES)[number]>("Todos");

  const filtered = raffles.filter((r) => cat === "Todos" || r.category === cat);

  return (
    <div>
      <div className="mb-5 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`relative rounded-lg px-4 py-1.5 font-display text-sm font-semibold transition-colors ${
              cat === c ? "text-base" : "text-dim hover:text-ink"
            }`}
          >
            {cat === c && (
              <motion.span
                layoutId="cat-pill"
                className="absolute inset-0 rounded-lg bg-rose"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">{c}</span>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-faint">
          No hay sorteos activos en esta categoría ahora mismo.
        </p>
      ) : (
        <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((item, i) => (
              <RaffleCard key={item.id} item={item} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
