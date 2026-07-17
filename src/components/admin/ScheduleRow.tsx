"use client";

import { useState } from "react";
import { updateScheduleEntry, deleteScheduleEntry } from "@/app/admin/schedule-actions";

const TYPES = ["stream", "special", "event", "off"];

const inputCls =
  "w-full rounded-lg border border-line bg-raised px-2.5 py-1.5 text-sm text-ink outline-none transition-colors focus:border-rose";

export interface ScheduleEntryView {
  id: string;
  day: string;
  time: string;
  content: string;
  type: string;
}

export default function ScheduleRow({ entry }: { entry: ScheduleEntryView }) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <form
        action={async (formData: FormData) => {
          await updateScheduleEntry(entry.id, formData);
          setEditing(false);
        }}
        className="grid gap-2 border-b border-line/60 px-5 py-3 sm:grid-cols-[100px_140px_1fr_110px_auto]"
      >
        <input name="day" defaultValue={entry.day} required className={inputCls} />
        <input name="time" defaultValue={entry.time} required className={inputCls} />
        <input name="content" defaultValue={entry.content} required className={inputCls} />
        <select name="type" defaultValue={entry.type} className={inputCls}>
          {TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <div className="flex gap-1.5">
          <button type="submit" className="rounded-lg bg-rose px-3 py-1.5 text-xs font-bold text-base">
            Guardar
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className="rounded-lg border border-line px-3 py-1.5 text-xs font-semibold text-dim"
          >
            Cancelar
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex items-center gap-4 border-b border-line/60 px-5 py-3 last:border-0">
      <span className="w-20 shrink-0 font-semibold">{entry.day}</span>
      <span className="tnum w-32 shrink-0 text-xs text-dim">{entry.time}</span>
      <span className="flex-1 text-sm text-dim">{entry.content}</span>
      <span className="rounded bg-raised px-2 py-0.5 text-[10px] font-bold uppercase text-faint">
        {entry.type}
      </span>
      <button
        onClick={() => setEditing(true)}
        className="rounded-lg border border-line bg-raised px-2.5 py-1 text-xs font-semibold text-dim transition-colors hover:bg-hover hover:text-ink"
      >
        Editar
      </button>
      <form action={deleteScheduleEntry.bind(null, entry.id)}>
        <button
          type="submit"
          className="rounded-lg border border-line bg-raised px-2.5 py-1 text-xs font-semibold text-dim transition-colors hover:bg-hover hover:text-danger"
        >
          Borrar
        </button>
      </form>
    </div>
  );
}
