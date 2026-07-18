"use client";

import { setUserRole } from "@/app/admin/actions";
import { useActionFeedback } from "@/lib/useActionFeedback";

export default function RoleToggle({
  userId,
  role,
  isSelf,
}: {
  userId: string;
  role: "USER" | "ADMIN";
  isSelf: boolean;
}) {
  const { run, isPending } = useActionFeedback();
  const isAdmin = role === "ADMIN";

  return (
    <button
      onClick={() =>
        run(() => setUserRole(userId, isAdmin ? "USER" : "ADMIN"), {
          loading: "Actualizando rol…",
          success: isAdmin ? "Ahora es usuario normal." : "Ahora es administrador.",
        })
      }
      disabled={isPending || (isSelf && isAdmin)}
      title={isSelf && isAdmin ? "No puedes quitarte el rol a ti mismo" : undefined}
      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        isAdmin
          ? "bg-rose/15 text-rose hover:bg-rose/25"
          : "bg-raised text-dim hover:bg-hover hover:text-ink"
      }`}
    >
      {isPending ? "…" : isAdmin ? "Admin" : "User"}
    </button>
  );
}
