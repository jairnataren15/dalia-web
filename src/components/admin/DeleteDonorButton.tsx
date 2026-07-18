"use client";

import { deleteDonor } from "@/app/admin/actions";
import { useActionFeedback } from "@/lib/useActionFeedback";

export default function DeleteDonorButton({ id }: { id: string }) {
  const { run, isPending } = useActionFeedback();

  return (
    <button
      disabled={isPending}
      onClick={() =>
        run(() => deleteDonor(id), {
          loading: "Borrando…",
          success: "Donación borrada.",
        })
      }
      className="rounded-lg border border-line bg-raised px-2.5 py-1 text-xs font-semibold text-dim transition-colors hover:bg-hover hover:text-danger disabled:opacity-50"
    >
      Borrar
    </button>
  );
}
