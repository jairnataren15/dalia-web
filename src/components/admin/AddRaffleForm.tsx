"use client";

import { useRef } from "react";
import { addRaffle } from "@/app/admin/raffle-actions";
import { useActionFeedback } from "@/lib/useActionFeedback";

const inputCls =
  "w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-rose";

export default function AddRaffleForm() {
  const { run, isPending } = useActionFeedback();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        run(() => addRaffle(formData), {
          loading: "Añadiendo sorteo…",
          success: "Sorteo añadido.",
        });
        formRef.current?.reset();
      }}
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      <input name="name" required placeholder="Nombre del premio" className={inputCls} />
      <select name="category" defaultValue="Merch" className={inputCls}>
        <option value="Merch">Merch</option>
        <option value="Riot">Riot</option>
        <option value="Periféricos">Periféricos</option>
        <option value="Especial">Especial</option>
      </select>
      <input name="closes" required placeholder="Cierra: Viernes 20:00" className={inputCls} />
      <input name="cost" type="number" min="1" required placeholder="Costo en puntos" className={inputCls} />
      <input name="maxEntries" type="number" min="1" required placeholder="Cupo máximo" className={inputCls} />
      <input name="image" placeholder="Campeón para ilustrar (opcional)" className={inputCls} />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-rose px-4 py-2 font-display text-sm font-bold text-base transition-colors hover:bg-rose-hi disabled:opacity-50 sm:col-span-2 lg:col-span-3"
      >
        {isPending ? "Añadiendo…" : "Añadir sorteo"}
      </button>
    </form>
  );
}
