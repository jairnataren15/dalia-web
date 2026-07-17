import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export const metadata = { title: "Admin — DALIA.EXE" };

const NAV = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/usuarios", label: "Usuarios" },
  { href: "/admin/donadores", label: "Donadores" },
  { href: "/admin/calendario", label: "Calendario" },
  { href: "/admin/sorteos", label: "Sorteos" },
  { href: "/admin/torneo", label: "Torneo" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/verificar");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="font-display text-xs font-semibold uppercase tracking-[0.2em] text-rose">
            Panel privado
          </p>
          <h1 className="text-2xl font-bold">Administración de DALIA.EXE</h1>
        </div>
        <nav className="flex flex-wrap gap-2">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg border border-line bg-surface px-3.5 py-1.5 text-sm font-semibold text-dim transition-colors hover:bg-hover hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
      {children}
    </div>
  );
}
