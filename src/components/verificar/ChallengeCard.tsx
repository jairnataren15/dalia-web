"use client";

import { useActionState } from "react";
import { confirmVerification, cancelVerification, type ActionState } from "@/app/verificar/actions";
import { profileIconUrl } from "@/lib/riot";

const initialState: ActionState = { status: "idle" };

export default function ChallengeCard({
  gameName,
  tagLine,
  challengeIcon,
}: {
  gameName: string;
  tagLine: string;
  challengeIcon: number;
}) {
  const [state, formAction, pending] = useActionState(confirmVerification, initialState);

  return (
    <div className="rounded-xl border border-rose/40 bg-rose-soft p-6">
      <h3 className="mb-1 font-display text-lg font-bold text-rose">
        Confirma que {gameName}#{tagLine} es tuya
      </h3>
      <p className="mb-5 text-sm text-dim">
        Entra al cliente de League of Legends, cambia tu icono de invocador al
        de abajo, guarda los cambios y vuelve aquí para confirmar.
      </p>

      <div className="mb-5 flex items-center gap-4">
        <img
          src={profileIconUrl(challengeIcon)}
          alt={`Icono de reto #${challengeIcon}`}
          className="h-20 w-20 rounded-xl border-2 border-rose"
        />
        <div className="text-sm text-dim">
          <p className="font-semibold text-ink">Icono de invocador #{challengeIcon}</p>
          <p>Este icono lo elegimos al azar solo para ti.</p>
        </div>
      </div>

      {state.status === "error" && (
        <p className="mb-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          {state.message}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <form action={formAction}>
          <button
            type="submit"
            disabled={pending}
            className="rounded-lg bg-rose px-5 py-2.5 font-display text-sm font-bold text-base transition-colors hover:bg-rose-hi disabled:opacity-50"
          >
            {pending ? "Comprobando…" : "Ya cambié mi icono, verificar"}
          </button>
        </form>
        <form action={cancelVerification}>
          <button
            type="submit"
            className="rounded-lg border border-line bg-raised px-5 py-2.5 font-display text-sm font-semibold text-dim transition-colors hover:bg-hover hover:text-ink"
          >
            Usar otro Riot ID
          </button>
        </form>
      </div>
    </div>
  );
}
