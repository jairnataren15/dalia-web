"use client";

import { useRef } from "react";
import { addScheduleEntry } from "@/app/admin/schedule-actions";
import { useActionFeedback } from "@/lib/useActionFeedback";

const inputCls =
  "w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-rose";

export default function AddScheduleForm() {
  const { run, isPending } = useActionFeedback();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        run(() => addScheduleEntry(formData), {
          loading: "Añadiendo día…",
          success: "Día añadido al calendario.",
        });
        formRef.current?.reset();
      }}
      className="grid gap-3 sm:grid-cols-[100px_140px_1fr_110px_auto]"
    >
      <input name="day" required placeholder="Lunes" className={inputCls} />
      <input name="time" required placeholder="18:00 – 22:00" className={inputCls} />
      <input name="content" required placeholder="Qué hace ese día" className={inputCls} />
      <select name="type" defaultValue="stream" className={inputCls}>
        <option value="stream">stream</option>
        <option value="special">special</option>
        <option value="event">event</option>
        <option value="off">off</option>
      </select>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-rose px-4 py-2 font-display text-sm font-bold text-base transition-colors hover:bg-rose-hi disabled:opacity-50"
      >
        {isPending ? "Añadiendo…" : "Añadir"}
      </button>
    </form>
  );
}
