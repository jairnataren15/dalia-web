"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import UserAvatar from "@/components/UserAvatar";
import CustomVideoPlayer from "@/components/galeria/CustomVideoPlayer";
import { deleteGalleryPost } from "@/app/galeria/actions";
import { useActionFeedback } from "@/lib/useActionFeedback";

export interface GalleryPostView {
  id: string;
  type: string;
  caption: string | null;
  createdAt: string;
  authorName: string | null;
  authorImage: string | null;
  authorAvatarChamp: string | null;
  authorPronouns: string | null;
  externalUrl: string | null;
  embedUrl: string | null;
  embedWidth?: number | null;
  embedHeight?: number | null;
  platformLabel: string | null;
}

function ImageLightbox({ src, alt, onClose }: { src: string; alt: string; onClose: () => void }) {
  return createPortal(
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-6"
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-raised text-xl text-ink hover:bg-hover"
      >
        ✕
      </button>
      <img
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
        className="max-h-full max-w-full rounded-lg object-contain"
      />
    </div>,
    document.body
  );
}

export default function GalleryPostCard({
  post,
  canDelete,
}: {
  post: GalleryPostView;
  canDelete: boolean;
}) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const { run, isPending } = useActionFeedback();

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div className="relative flex aspect-square items-center justify-center bg-raised">
        {post.type === "video" ? (
          <div className="h-full w-full">
            <CustomVideoPlayer src={`/api/gallery/${post.id}`} />
          </div>
        ) : post.type === "link" ? (
          post.embedUrl ? (
            <div
              className="w-full border-t-2 border-rose"
              style={{
                aspectRatio:
                  post.embedWidth && post.embedHeight
                    ? `${post.embedWidth} / ${post.embedHeight}`
                    : "16 / 9",
                maxHeight: "100%",
              }}
            >
              <iframe
                src={post.embedUrl}
                allowFullScreen
                className="h-full w-full border-0"
              />
            </div>
          ) : (
            <a
              href={post.externalUrl ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-full w-full flex-col items-center justify-center gap-2 text-center transition-colors hover:bg-hover"
            >
              <span className="text-3xl">▶</span>
              <span className="font-display text-sm font-bold text-rose">
                Ver en {post.platformLabel ?? "el enlace"}
              </span>
              <span className="max-w-[80%] truncate text-xs text-faint">{post.externalUrl}</span>
            </a>
          )
        ) : (
          <>
            <button
              type="button"
              onClick={() => setLightboxOpen(true)}
              className="h-full w-full cursor-zoom-in"
              aria-label="Ampliar imagen"
            >
              <img
                src={`/api/gallery/${post.id}`}
                alt={post.caption ?? ""}
                className="h-full w-full object-cover"
              />
            </button>
            {lightboxOpen && (
              <ImageLightbox
                src={`/api/gallery/${post.id}`}
                alt={post.caption ?? ""}
                onClose={() => setLightboxOpen(false)}
              />
            )}
          </>
        )}
      </div>
      <div className="p-3">
        <div className="flex items-center gap-2">
          <UserAvatar
            avatarChamp={post.authorAvatarChamp}
            image={post.authorImage}
            name={post.authorName}
            size={24}
          />
          <p className="min-w-0 flex-1 truncate text-xs font-semibold">
            {post.authorName ?? "Anónimo"}
            {post.authorPronouns && (
              <span className="ml-1 font-normal text-faint">({post.authorPronouns})</span>
            )}
          </p>
          {post.type === "link" && post.platformLabel && (
            <span className="rounded-full bg-raised px-2 py-0.5 text-[10px] font-bold uppercase text-faint">
              {post.platformLabel}
            </span>
          )}
          {canDelete && (
            <button
              type="button"
              disabled={isPending}
              onClick={() =>
                run(() => deleteGalleryPost(post.id), {
                  loading: "Borrando…",
                  success: "Publicación borrada.",
                })
              }
              className="rounded-lg border border-line bg-raised px-2 py-0.5 text-[11px] font-semibold text-dim transition-colors hover:bg-hover hover:text-danger disabled:opacity-50"
            >
              Borrar
            </button>
          )}
        </div>
        {post.caption && (
          <p className="mt-2 text-sm text-dim">{post.caption}</p>
        )}
      </div>
    </div>
  );
}
