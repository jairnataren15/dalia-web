import { Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import RoleToggle from "@/components/admin/RoleToggle";

export const metadata = { title: "Usuarios — Admin DALIA.EXE" };

const TIER_LABEL: Record<number, string> = {
  1000: "Tier 1",
  2000: "Tier 2",
  3000: "Tier 3",
};

export default async function AdminUsersPage() {
  const session = await auth();
  const users = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });

  return (
    <div>
      <p className="mb-4 text-sm text-dim">
        {users.length} cuenta{users.length === 1 ? "" : "s"} registrada
        {users.length === 1 ? "" : "s"} con Discord.
      </p>
      <Card className="overflow-x-auto">
        <table className="w-full min-w-175 text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs uppercase tracking-wider text-faint">
              <th className="px-4 py-3 font-semibold">Usuario</th>
              <th className="px-4 py-3 font-semibold">Riot ID</th>
              <th className="px-4 py-3 font-semibold">Twitch</th>
              <th className="px-4 py-3 text-right font-semibold">Puntos</th>
              <th className="px-4 py-3 font-semibold">Desde</th>
              <th className="px-4 py-3 text-right font-semibold">Rol</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-line/60 last:border-0 hover:bg-hover">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {u.image && (
                      <img src={u.image} alt="" className="h-8 w-8 rounded-full" />
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{u.name ?? "Sin nombre"}</p>
                      <p className="truncate text-xs text-faint">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  {u.riotVerified ? (
                    <span className="text-live">
                      ✓ {u.riotGameName}#{u.riotTagLine}
                    </span>
                  ) : u.riotPuuid ? (
                    <span className="text-gold">Pendiente de confirmar</span>
                  ) : (
                    <span className="text-faint">Sin vincular</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {u.twitchLogin ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[#a970ff]">{u.twitchLogin}</span>
                      {u.subTier && (
                        <span className="rounded-full bg-[#9147ff]/20 px-2 py-0.5 text-[10px] font-bold uppercase text-[#a970ff]">
                          {TIER_LABEL[u.subTier] ?? "Sub"}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="text-faint">Sin vincular</span>
                  )}
                </td>
                <td className="tnum px-4 py-3 text-right">{u.points}</td>
                <td className="px-4 py-3 text-xs text-dim">
                  {u.createdAt.toLocaleDateString("es")}
                </td>
                <td className="px-4 py-3 text-right">
                  <RoleToggle
                    userId={u.id}
                    role={u.role}
                    isSelf={u.id === session?.user.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
