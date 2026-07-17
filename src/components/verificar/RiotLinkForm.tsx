"use client";

import { useActionState } from "react";
import { startVerification, type ActionState } from "@/app/verificar/actions";

const initialState: ActionState = { status: "idle" };

const inputCls =
  "w-full rounded-lg border border-line bg-raised px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-rose";
const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-dim";

export default function RiotLinkForm() {
  const [state, formAction, pending] = useActionState(startVerification, initialState);

  return (
    <form action={formAction} className="rounded-xl border border-line bg-surface p-6">
      <h3 className="mb-1 font-display text-lg font-bold">Vincula tu cuenta de LoL</h3>
      <p className="mb-5 text-sm text-dim">
        Escribe tu Riot ID exacto. Te vamos a pedir que cambies tu icono de
        invocador un momento para confirmar que es tuya — nunca tu contraseña.
      </p>

      <div className="grid gap-4 sm:grid-cols-[1fr_auto_120px]">
        <div>
          <label htmlFor="gameName" className={labelCls}>Nombre</label>
          <input id="gameName" name="gameName" required placeholder="Sam Chispas" className={inputCls} />
        </div>
        <div>
          <label htmlFor="tagLine" className={labelCls}>TAG</label>
          <input id="tagLine" name="tagLine" required placeholder="Lux" className={inputCls} />
        </div>
        <div>
          <label htmlFor="region" className={labelCls}>Región</label>
          <select id="region" name="region" defaultValue="LAN" className={inputCls}>
            <option value="EUW">EUW</option>
            <option value="NA">NA</option>
            <option value="LAN">LAN</option>
            <option value="LAS">LAS</option>
          </select>
        </div>
      </div>

      {state.status === "error" && (
        <p className="mt-4 rounded-lg bg-danger/10 px-3 py-2 text-sm text-danger">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-5 w-full rounded-lg bg-rose py-3 font-display text-sm font-bold text-base transition-colors hover:bg-rose-hi disabled:opacity-50"
      >
        {pending ? "Buscando cuenta…" : "Buscar mi cuenta"}
      </button>
    </form>
  );
}
