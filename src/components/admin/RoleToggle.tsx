"use client";

import { useTransition } from "react";
import { setUserRole } from "@/app/admin/actions";

export default function RoleToggle({
  userId,
  role,
  isSelf,
}: {
  userId: string;
  role: "USER" | "ADMIN";
  isSelf: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const isAdmin = role === "ADMIN";

  const toggle = () => {
    startTransition(() => {
      setUserRole(userId, isAdmin ? "USER" : "ADMIN").catch((e) => {
        alert(e instanceof Error ? e.message : "No se pudo cambiar el rol.");
      });
    });
  };

  return (
    <button
      onClick={toggle}
      disabled={pending || (isSelf && isAdmin)}
      title={isSelf && isAdmin ? "No puedes quitarte el rol a ti mismo" : undefined}
      className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${
        isAdmin
          ? "bg-rose/15 text-rose hover:bg-rose/25"
          : "bg-raised text-dim hover:bg-hover hover:text-ink"
      }`}
    >
      {pending ? "…" : isAdmin ? "Admin" : "User"}
    </button>
  );
}
