"use client";

import { useRef } from "react";
import { addPastTournament } from "@/app/admin/tournament-actions";
import { useActionFeedback } from "@/lib/useActionFeedback";

const inputCls =
  "w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-rose";

export default function AddPastTournamentForm() {
  const { run, isPending } = useActionFeedback();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        run(() => addPastTournament(formData), {
          loading: "Añadiendo al historial…",
          success: "Torneo añadido al historial.",
        });
        formRef.current?.reset();
      }}
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      <input name="name" required placeholder="Nombre del torneo" className={inputCls} />
      <input name="date" required placeholder="Fecha" className={inputCls} />
      <input name="teamsCount" type="number" min="1" required placeholder="Nº de equipos" className={inputCls} />
      <input name="winner" required placeholder="Equipo campeón" className={inputCls} />
      <input name="runnerUp" required placeholder="Subcampeón" className={inputCls} />
      <input name="mvp" required placeholder="MVP" className={inputCls} />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-rose px-4 py-2 font-display text-sm font-bold text-base transition-colors hover:bg-rose-hi disabled:opacity-50 sm:col-span-2 lg:col-span-3"
      >
        {isPending ? "Añadiendo…" : "Añadir al historial"}
      </button>
    </form>
  );
}
