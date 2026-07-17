import { PageHeader } from "@/components/ui";
import LfgBoard, { type LfgPostView } from "@/components/lfg/LfgBoard";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Buscar equipo — Dalia" };

export default async function LfgPage() {
  const [session, rows] = await Promise.all([
    auth(),
    prisma.lfgPost.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    }),
  ]);

  const posts: LfgPostView[] = rows.map((r) => ({
    id: r.id,
    userId: r.userId,
    userName: r.user.name ?? "Anónimo",
    role: r.role,
    looking: r.looking,
    message: r.message,
    tierSnap: r.tierSnap,
    regionSnap: r.regionSnap,
    createdAt: r.createdAt.toISOString(),
  }));

  const currentUser = session?.user
    ? await prisma.user.findUnique({ where: { id: session.user.id } })
    : null;
  const canPost = Boolean(currentUser?.riotVerified);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <PageHeader
        eyebrow="Comunidad"
        title="Buscar equipo"
        lede="¿Sin dúo? ¿Falta un jungla para la Copa? Publica lo que buscas y contacta por Discord con miembros verificados DALIA.EXE."
      />
      <LfgBoard posts={posts} canPost={canPost} currentUserId={session?.user?.id} />
    </div>
  );
}
