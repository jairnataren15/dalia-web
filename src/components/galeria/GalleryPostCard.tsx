"use client";

import UserAvatar from "@/components/UserAvatar";
import CustomVideoPlayer from "@/components/galeria/CustomVideoPlayer";
import { deleteGalleryPost } from "@/app/galeria/actions";

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
  platformLabel: string | null;
}

export default function GalleryPostCard({
  post,
  canDelete,
}: {
  post: GalleryPostView;
  canDelete: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface">
      <div
        className={`relative bg-raised ${
          post.type === "video" || post.type === "link" ? "aspect-video" : "aspect-square"
        }`}
      >
        {post.type === "video" ? (
          <CustomVideoPlayer src={`/api/gallery/${post.id}`} />
        ) : post.type === "link" ? (
          post.embedUrl ? (
            <div className="h-full w-full border-t-2 border-rose">
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
          <img
            src={`/api/gallery/${post.id}`}
            alt={post.caption ?? ""}
            className="h-full w-full object-cover"
          />
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
            <form action={deleteGalleryPost.bind(null, post.id)}>
              <button
                type="submit"
                className="rounded-lg border border-line bg-raised px-2 py-0.5 text-[11px] font-semibold text-dim transition-colors hover:bg-hover hover:text-danger"
              >
                Borrar
              </button>
            </form>
          )}
        </div>
        {post.caption && (
          <p className="mt-2 text-sm text-dim">{post.caption}</p>
        )}
      </div>
    </div>
  );
}
