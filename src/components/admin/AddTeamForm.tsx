"use client";

import { useRef } from "react";
import { addTeam } from "@/app/admin/tournament-actions";
import { useActionFeedback } from "@/lib/useActionFeedback";

const inputCls =
  "w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-rose";

export default function AddTeamForm({ tournamentId }: { tournamentId: string }) {
  const { run, isPending } = useActionFeedback();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        run(() => addTeam(tournamentId, formData), {
          loading: "Añadiendo equipo…",
          success: "Equipo añadido.",
        });
        formRef.current?.reset();
      }}
      className="grid gap-3 sm:grid-cols-3"
    >
      <input name="name" required placeholder="Nombre del equipo" className={inputCls} />
      <input name="captain" required placeholder="Capitán (Riot ID)" className={inputCls} />
      <input name="avgRank" required placeholder="Rango medio" className={inputCls} />
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-rose px-4 py-2 font-display text-sm font-bold text-base transition-colors hover:bg-rose-hi disabled:opacity-50 sm:col-span-3"
      >
        {isPending ? "Añadiendo…" : "Añadir equipo"}
      </button>
    </form>
  );
}
