"use client";

import { useState } from "react";
import { updateRaffle, deleteRaffle, toggleRaffleActive } from "@/app/admin/raffle-actions";
import { useActionFeedback } from "@/lib/useActionFeedback";

const CATEGORIES = ["Merch", "Riot", "Periféricos", "Especial"];

const inputCls =
  "w-full rounded-lg border border-line bg-raised px-2.5 py-1.5 text-sm text-ink outline-none transition-colors focus:border-rose";

export interface RaffleView {
  id: string;
  name: string;
  category: string;
  cost: number;
  entries: number;
  maxEntries: number;
  closes: string;
  image: string | null;
  active: boolean;
}

export default function RaffleRow({ raffle }: { raffle: RaffleView }) {
  const [editing, setEditing] = useState(false);
  const { run, isPending } = useActionFeedback();

  if (editing) {
    return (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          run(() => updateRaffle(raffle.id, formData), {
            loading: "Guardando…",
            success: "Cambios guardados.",
          });
          setEditing(false);
        }}
        className="grid gap-2 border-b border-line/60 p-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        <input name="name" defaultValue={raffle.name} required placeholder="Nombre" className={inputCls} />
        <select name="category" defaultValue={raffle.category} className={inputCls}>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input name="closes" defaultValue={raffle.closes} required placeholder="Cierra: Viernes 20:00" className={inputCls} />
        <input name="cost" type="number" min="1" defaultValue={raffle.cost} required placeholder="Costo en puntos" className={inputCls} />
        <input name="maxEntries" type="number" min="1" defaultValue={raffle.maxEntries} required placeholder="Cupo máximo" className={inputCls} />
        <input name="image" defaultValue={raffle.image ?? ""} placeholder="Campeón para ilustrar (opcional)" className={inputCls} />
        <div className="flex gap-1.5 sm:col-span-2 lg:col-span-3">
          <button type="submit" className="rounded-lg bg-rose px-4 py-1.5 font-display text-xs font-bold text-base">
            Guardar
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-lg border border-line px-4 py-1.5 text-xs font-semibold text-dim"
          >
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-line/60 p-4 last:border-0">
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold">{raffle.name}</p>
        <p className="tnum text-xs text-dim">
          {raffle.category} · {raffle.cost} pts · {raffle.entries}/{raffle.maxEntries} · {raffle.closes}
        </p>
      </div>
      <button
        disabled={isPending}
        onClick={() =>
          run(() => toggleRaffleActive(raffle.id, !raffle.active), {
            loading: "Actualizando…",
            success: raffle.active ? "Sorteo ocultado." : "Sorteo activado.",
          })
        }
        className={`rounded-full px-3 py-1 text-xs font-bold uppercase disabled:opacity-50 ${
          raffle.active ? "bg-live-soft text-live" : "bg-raised text-faint"
        }`}
      >
        {raffle.active ? "Activo" : "Oculto"}
      </button>
      <button
        onClick={() => setEditing(true)}
        className="rounded-lg border border-line bg-raised px-2.5 py-1 text-xs font-semibold text-dim transition-colors hover:bg-hover hover:text-ink"
      >
        Editar
      </button>
      <button
        disabled={isPending}
        onClick={() =>
          run(() => deleteRaffle(raffle.id), {
            loading: "Borrando…",
            success: "Sorteo borrado.",
          })
        }
        className="rounded-lg border border-line bg-raised px-2.5 py-1 text-xs font-semibold text-dim transition-colors hover:bg-hover hover:text-danger disabled:opacity-50"
      >
        Borrar
      </button>
    </div>
  );
}
