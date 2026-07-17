import { PageHeader, Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import GalleryUploadForm from "@/components/galeria/GalleryUploadForm";
import GalleryPostCard from "@/components/galeria/GalleryPostCard";

export const metadata = { title: "Galería — Dalia" };

export default async function GaleriaPage() {
  const [session, posts] = await Promise.all([
    auth(),
    prisma.galleryPost.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true },
      take: 60,
    }),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <PageHeader
        eyebrow="Comunidad DALIA.EXE"
        title="Galería"
        lede="Capturas, arte, clips de jugadas — todo lo que la comunidad quiera compartir."
      />

      {session?.user ? (
        <div className="mb-8">
          <GalleryUploadForm />
        </div>
      ) : (
        <Card className="mb-8 p-5 text-center text-sm text-dim">
          Inicia sesión con Discord para publicar en la galería.
        </Card>
      )}

      {posts.length === 0 ? (
        <Card className="p-10 text-center text-sm text-dim">
          Todavía no hay nada publicado — sé el primero.
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <GalleryPostCard
              key={p.id}
              post={{
                id: p.id,
                type: p.type,
                caption: p.caption,
                createdAt: p.createdAt.toISOString(),
                authorName: p.user.name,
                authorImage: p.user.image,
                authorAvatarChamp: p.user.avatarChamp,
                authorPronouns: p.user.pronouns,
              }}
              canDelete={session?.user?.id === p.userId || session?.user?.role === "ADMIN"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
