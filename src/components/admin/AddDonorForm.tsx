"use client";

import { useRef } from "react";
import { addDonor } from "@/app/admin/actions";
import { useActionFeedback } from "@/lib/useActionFeedback";

const inputCls =
  "w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-rose";

export default function AddDonorForm() {
  const { run, isPending } = useActionFeedback();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        run(() => addDonor(formData), {
          loading: "Registrando donación…",
          success: "Donación registrada.",
        });
        formRef.current?.reset();
      }}
      className="grid gap-3 sm:grid-cols-[1fr_140px_1fr_auto]"
    >
      <input name="name" required placeholder="Nombre" className={inputCls} />
      <input
        name="amount"
        required
        type="number"
        step="0.01"
        min="0.01"
        placeholder="Cantidad $"
        className={inputCls}
      />
      <input name="note" placeholder="Nota (opcional)" className={inputCls} />
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
