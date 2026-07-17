import { PageHeader, Card } from "@/components/ui";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getChampionList } from "@/lib/champions";
import ProfileForm from "@/components/perfil/ProfileForm";
import UserAvatar from "@/components/UserAvatar";

export const metadata = { title: "Mi perfil — Dalia" };

export default async function PerfilPage() {
  const session = await auth();

  if (!session?.user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 lg:px-8">
        <PageHeader eyebrow="Mi perfil" title="Inicia sesión" lede="Necesitas iniciar sesión con Discord para editar tu perfil." />
      </div>
    );
  }

  const [user, champions] = await Promise.all([
    prisma.user.findUniqueOrThrow({ where: { id: session.user.id } }),
    getChampionList(),
  ]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 lg:px-8">
      <PageHeader
        eyebrow="Mi cuenta"
        title="Mi perfil"
        lede="Elige tu avatar, cuenta quién eres y tus pronombres — se muestra en la galería y el tablero de buscar equipo."
      />

      <Card className="mb-6 flex items-center gap-4 p-5">
        <UserAvatar
          avatarChamp={user.avatarChamp}
          image={user.image}
          name={user.name}
          size={56}
        />
        <div>
          <p className="font-display font-bold">{user.name}</p>
          {user.pronouns && <p className="text-xs text-faint">{user.pronouns}</p>}
        </div>
      </Card>

      <ProfileForm
        champions={champions}
        bio={user.bio ?? ""}
        pronouns={user.pronouns ?? ""}
        avatarChamp={user.avatarChamp}
      />
    </div>
  );
}
