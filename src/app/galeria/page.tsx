import { PageHeader, Card } from "@/components/ui";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { parseVideoUrl } from "@/lib/videoEmbed";
import GalleryUploadForm from "@/components/galeria/GalleryUploadForm";
import GalleryPostCard from "@/components/galeria/GalleryPostCard";

export const metadata = { title: "Galería — Dalia" };

export default async function GaleriaPage() {
  const [session, rawPosts] = await Promise.all([
    auth(),
    prisma.galleryPost.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true },
      take: 60,
    }),
  ]);

  // Autorepara posts de link que quedaron sin embed antes de soportar su
  // plataforma (ej. Medal se añadió después de que ya hubiera posts).
  const posts = await Promise.all(
    rawPosts.map(async (p) => {
      if (p.type === "link" && !p.embedUrl && p.externalUrl) {
        const parsed = await parseVideoUrl(p.externalUrl).catch(() => null);
        if (parsed?.embedUrl) {
          await prisma.galleryPost.update({
            where: { id: p.id },
            data: { embedUrl: parsed.embedUrl, platformLabel: parsed.platformLabel },
          });
          return { ...p, embedUrl: parsed.embedUrl, platformLabel: parsed.platformLabel };
        }
      }
      return p;
    })
  );

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
                externalUrl: p.externalUrl,
                embedUrl: p.embedUrl,
                platformLabel: p.platformLabel,
              }}
              canDelete={session?.user?.id === p.userId || session?.user?.role === "ADMIN"}
            />
          ))}
        </div>
      )}
    </div>
  );
}
