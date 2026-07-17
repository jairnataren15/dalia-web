"use client";

import { useActionState } from "react";
import { updateProfile, type ProfileState } from "@/app/perfil/actions";
import AvatarPicker from "@/components/perfil/AvatarPicker";
import type { ChampionSummary } from "@/lib/champions";

const initialState: ProfileState = { status: "idle" };

export default function ProfileForm({
  champions,
  bio,
  pronouns,
  avatarChamp,
}: {
  champions: ChampionSummary[];
  bio: string;
  pronouns: string;
  avatarChamp: string | null;
}) {
  const [state, formAction, pending] = useActionState(updateProfile, initialState);

  return (
    <form action={formAction} className="rounded-xl border border-line bg-surface p-6">
      <div className="mb-5">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-dim">
          Avatar (icono de campeón)
        </label>
        <AvatarPicker champions={champions} initial={avatarChamp} />
      </div>

      <div className="mb-4">
        <label htmlFor="pronouns" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-dim">
          Pronombres
        </label>
        <input
          id="pronouns"
          name="pronouns"
          defaultValue={pronouns}
          placeholder="ella/she · él/he · elle/they…"
          maxLength={40}
          className="w-full rounded-lg border border-line bg-raised px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-rose"
        />
      </div>

      <div className="mb-5">
        <label htmlFor="bio" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-dim">
          Biografía
        </label>
        <textarea
          id="bio"
          name="bio"
          defaultValue={bio}
          maxLength={300}
          rows={4}
          placeholder="Cuéntale a la comunidad quién eres…"
          className="w-full resize-none rounded-lg border border-line bg-raised px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-rose"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-rose px-5 py-2.5 font-display text-sm font-bold text-base transition-colors hover:bg-rose-hi disabled:opacity-50"
      >
        {pending ? "Guardando…" : "Guardar perfil"}
      </button>
      {state.status === "success" && (
        <span className="ml-3 text-sm text-live">✓ Guardado</span>
      )}
      {state.status === "error" && (
        <span className="ml-3 text-sm text-danger">{state.message}</span>
      )}
    </form>
  );
}
