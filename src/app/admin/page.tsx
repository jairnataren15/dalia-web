import { Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { activeTournament, raffles, members } from "@/lib/data";

export default async function AdminDashboard() {
  const [totalUsers, verifiedUsers, adminCount] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { riotVerified: true } }),
    prisma.user.count({ where: { role: "ADMIN" } }),
  ]);

  const stats = [
    { label: "Cuentas registradas", value: totalUsers },
    { label: "Riot ID verificados", value: verifiedUsers },
    { label: "Administradores", value: adminCount },
    { label: "Miembros en el ranking de LoL", value: members.length },
    { label: "Equipos inscritos · Copa activa", value: activeTournament.registered.length },
    { label: "Sorteos activos en la tienda", value: raffles.length },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((s) => (
        <Card key={s.label} className="p-5">
          <p className="text-xs uppercase tracking-wider text-faint">{s.label}</p>
          <p className="tnum mt-1 font-display text-3xl font-bold">{s.value}</p>
        </Card>
      ))}
    </div>
  );
}
