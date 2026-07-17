import Link from "next/link";
import { Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { activeTournament, raffles, members } from "@/lib/data";

export default async function AdminDashboard() {
  const [totalUsers, verifiedUsers, adminCount, subCount, broadcaster, donorTotal] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { riotVerified: true } }),
      prisma.user.count({ where: { role: "ADMIN" } }),
      prisma.user.count({ where: { subTier: { not: null } } }),
      prisma.broadcasterToken.findUnique({ where: { id: "dalia" } }),
      prisma.donor.aggregate({ _sum: { amount: true }, _count: true }),
    ]);

  const stats = [
    { label: "Cuentas registradas", value: totalUsers },
    { label: "Riot ID verificados", value: verifiedUsers },
    { label: "Administradores", value: adminCount },
    { label: "Suscriptores detectados", value: subCount },
    { label: "Miembros en el ranking de LoL", value: members.length },
    { label: "Equipos inscritos · Copa activa", value: activeTournament.registered.length },
    { label: "Sorteos activos en la tienda", value: raffles.length },
    { label: "Donaciones registradas", value: donorTotal._count },
  ];

  return (
    <div className="space-y-6">
      <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <p className="text-xs uppercase tracking-wider text-faint">Twitch del canal (broadcaster)</p>
          <p className="font-display font-bold">
            {broadcaster ? (
              <span className="text-live">✓ Conectado</span>
            ) : (
              <span className="text-dim">Sin conectar</span>
            )}
          </p>
          <p className="mt-1 text-xs text-dim">
            Necesario para detectar quién está suscrito al canal de Dalia.
          </p>
        </div>
        <Link
          href="/api/twitch/connect?mode=broadcaster"
          className="rounded-lg bg-[#9147ff] px-4 py-2 font-display text-sm font-bold text-white transition-colors hover:bg-[#7d3bdb]"
        >
          {broadcaster ? "Reconectar Twitch" : "Conectar Twitch de Dalia"}
        </Link>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label} className="p-5">
            <p className="text-xs uppercase tracking-wider text-faint">{s.label}</p>
            <p className="tnum mt-1 font-display text-3xl font-bold">{s.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
