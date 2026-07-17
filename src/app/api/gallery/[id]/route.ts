import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getGalleryStore } from "@/lib/blobs";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await prisma.galleryPost.findUnique({ where: { id } });
  if (!post) {
    return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  }

  const store = getGalleryStore();
  const data = await store.get(post.blobKey, { type: "arrayBuffer" });
  if (!data) {
    return NextResponse.json({ error: "Archivo no disponible" }, { status: 404 });
  }

  return new NextResponse(data, {
    headers: {
      "Content-Type": post.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
