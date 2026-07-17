"use server";

import { randomUUID } from "crypto";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  getGalleryStore,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_VIDEO_TYPES,
  MAX_IMAGE_BYTES,
  MAX_VIDEO_BYTES,
} from "@/lib/blobs";
import { parseVideoUrl } from "@/lib/videoEmbed";

export interface UploadState {
  status: "idle" | "error" | "success";
  message?: string;
}

export async function uploadGalleryPost(
  _prev: UploadState,
  formData: FormData
): Promise<UploadState> {
  const session = await auth();
  if (!session?.user) {
    return { status: "error", message: "Inicia sesión para publicar en la galería." };
  }

  const file = formData.get("file");
  const caption = String(formData.get("caption") ?? "").trim().slice(0, 280);

  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Elige una imagen o un video." };
  }

  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
  if (!isImage && !isVideo) {
    return { status: "error", message: "Formato no soportado. Usa JPG, PNG, WEBP, GIF, MP4, WEBM o MOV." };
  }

  const maxBytes = isImage ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  if (file.size > maxBytes) {
    return {
      status: "error",
      message: `El archivo pesa demasiado (máx. ${Math.round(maxBytes / (1024 * 1024))} MB).`,
    };
  }

  const blobKey = `${session.user.id}/${randomUUID()}`;
  const buffer = await file.arrayBuffer();

  try {
    const store = getGalleryStore();
    await store.set(blobKey, buffer, { metadata: { mimeType: file.type } });
  } catch {
    return {
      status: "error",
      message: "No se pudo guardar el archivo. Si estás en desarrollo local, esto solo funciona una vez desplegado.",
    };
  }

  await prisma.galleryPost.create({
    data: {
      userId: session.user.id,
      type: isImage ? "image" : "video",
      blobKey,
      mimeType: file.type,
      fileSize: file.size,
      caption: caption || null,
    },
  });

  revalidatePath("/galeria");
  return { status: "success" };
}

export async function addGalleryLink(
  _prev: UploadState,
  formData: FormData
): Promise<UploadState> {
  const session = await auth();
  if (!session?.user) {
    return { status: "error", message: "Inicia sesión para publicar en la galería." };
  }

  const url = String(formData.get("url") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim().slice(0, 280);

  if (!url) {
    return { status: "error", message: "Pega un link de Twitch, YouTube, Medal, Overplay, etc." };
  }

  const parsed = await parseVideoUrl(url);
  if (!parsed) {
    return { status: "error", message: "Ese link no parece válido." };
  }

  await prisma.galleryPost.create({
    data: {
      userId: session.user.id,
      type: "link",
      externalUrl: url,
      embedUrl: parsed.embedUrl,
      embedWidth: parsed.embedWidth ?? null,
      embedHeight: parsed.embedHeight ?? null,
      platformLabel: parsed.platformLabel,
      caption: caption || null,
    },
  });

  revalidatePath("/galeria");
  return { status: "success" };
}

export async function deleteGalleryPost(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado.");

  const post = await prisma.galleryPost.findUniqueOrThrow({ where: { id } });
  if (post.userId !== session.user.id && session.user.role !== "ADMIN") {
    throw new Error("No puedes borrar la publicación de otra persona.");
  }

  if (post.blobKey) {
    try {
      const store = getGalleryStore();
      await store.delete(post.blobKey);
    } catch {
      // si el blob ya no existe o falla, igual limpiamos el registro
    }
  }

  await prisma.galleryPost.delete({ where: { id } });
  revalidatePath("/galeria");
}
