"use client";

import { useRouter, usePathname } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === "/") return null;

  return (
    <button
      type="button"
      onClick={() => router.back()}
      aria-label="Volver"
      className="flex shrink-0 items-center gap-1.5 rounded-lg border border-line bg-raised px-3 py-1.5 font-display text-sm font-semibold text-dim transition-colors hover:bg-hover hover:text-ink"
    >
      ← Volver
    </button>
  );
}
