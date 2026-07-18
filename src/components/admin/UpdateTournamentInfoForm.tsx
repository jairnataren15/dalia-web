"use client";

import { updateTournamentInfo } from "@/app/admin/tournament-actions";
import { useActionFeedback } from "@/lib/useActionFeedback";

const inputCls =
  "w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-rose";
const labelCls = "mb-1 block text-xs font-semibold uppercase tracking-wider text-dim";

export interface TournamentInfoView {
  id: string;
  name: string;
  format: string;
  date: string;
  patch: string;
  maxTeams: number;
  prize: string;
  checkinCloses: string;
  checkinOpen: boolean;
}

export default function UpdateTournamentInfoForm({ t }: { t: TournamentInfoView }) {
  const { run, isPending } = useActionFeedback();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        run(() => updateTournamentInfo(t.id, formData), {
          loading: "Guardando datos del torneo…",
          success: "Datos del torneo guardados.",
        });
      }}
      className="grid gap-3 sm:grid-cols-2"
    >
      <div>
        <label className={labelCls}>Nombre</label>
        <input name="name" defaultValue={t.name} required className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Formato</label>
        <input name="format" defaultValue={t.format} required className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Fecha</label>
        <input name="date" defaultValue={t.date} required className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Parche</label>
        <input name="patch" defaultValue={t.patch} required className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Cupo máximo de equipos</label>
        <input name="maxTeams" type="number" min="2" defaultValue={t.maxTeams} required className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Premio</label>
        <input name="prize" defaultValue={t.prize} required className={inputCls} />
      </div>
      <div>
        <label className={labelCls}>Check-in cierra</label>
        <input name="checkinCloses" defaultValue={t.checkinCloses} required className={inputCls} />
      </div>
      <label className="mt-6 flex items-center gap-2 text-sm text-dim">
        <input type="checkbox" name="checkinOpen" defaultChecked={t.checkinOpen} className="accent-[#ff4d7d]" />
        Ventana de check-in abierta
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-rose px-4 py-2 font-display text-sm font-bold text-base transition-colors hover:bg-rose-hi disabled:opacity-50 sm:col-span-2"
      >
        {isPending ? "Guardando…" : "Guardar datos del torneo"}
      </button>
    </form>
  );
}
