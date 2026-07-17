import { getStore } from "@netlify/blobs";

// Store de Netlify Blobs para los archivos de la Galería (imágenes/clips).
// En producción (Netlify) el contexto se detecta solo. En local (next dev
// sin `netlify dev`) esto lanza si no hay contexto — la subida de archivos
// solo puede probarse una vez desplegado.
export function getGalleryStore() {
  return getStore("gallery");
}

export const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8 MB
export const MAX_VIDEO_BYTES = 15 * 1024 * 1024; // 15 MB — clips cortos

export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
export const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
