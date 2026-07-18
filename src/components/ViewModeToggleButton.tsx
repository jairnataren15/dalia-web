"use client";

import { setViewMode } from "@/app/admin/view-mode-actions";
import { useActionFeedback } from "@/lib/useActionFeedback";

export default function ViewModeToggleButton({ isAdminView }: { isAdminView: boolean }) {
  const { run, isPending } = useActionFeedback();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() =>
        run(() => setViewMode(isAdminView ? "user" : "admin"), {
          loading: "Cambiando de vista…",
          success: isAdminView ? "Ahora ves la web como usuario." : "Volviste a tu vista de admin.",
        })
      }
      className={`rounded-lg border px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wide transition-colors disabled:opacity-50 ${
        isAdminView
          ? "border-rose/40 bg-rose/10 text-rose hover:border-rose"
          : "border-live/40 bg-live-soft text-live hover:border-live"
      }`}
      title={
        isAdminView
          ? "Previsualizar la web como la vería un usuario normal"
          : "Volver a tu vista de administrador"
      }
    >
      {isAdminView ? "Ver como usuario" : "Ver como admin"}
    </button>
  );
}
