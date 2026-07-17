"use client";

import { useActionState, useRef } from "react";
import { uploadGalleryPost, type UploadState } from "@/app/galeria/actions";

const initialState: UploadState = { status: "idle" };

export default function GalleryUploadForm() {
  const [state, formAction, pending] = useActionState(uploadGalleryPost, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="rounded-xl border border-line bg-surface p-5"
    >
      <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider">
        Publicar en la galería
      </h2>
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          type="file"
          name="file"
          accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
          required
          className="w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm text-ink outline-none file:mr-3 file:rounded-md file:border-0 file:bg-rose file:px-3 file:py-1.5 file:text-xs file:font-bold file:text-base"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-rose px-5 py-2 font-display text-sm font-bold text-base transition-colors hover:bg-rose-hi disabled:opacity-50"
        >
          {pending ? "Subiendo…" : "Publicar"}
        </button>
      </div>
      <input
        name="caption"
        placeholder="Un texto corto (opcional)"
        maxLength={280}
        className="mt-3 w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-rose"
      />
      <p className="mt-2 text-xs text-faint">
        Imágenes hasta 8 MB (JPG, PNG, WEBP, GIF) o clips de video hasta 15 MB (MP4, WEBM, MOV).
      </p>
      {state.status === "error" && (
        <p className="mt-2 text-sm text-danger">{state.message}</p>
      )}
      {state.status === "success" && (
        <p className="mt-2 text-sm text-live">✓ Publicado.</p>
      )}
    </form>
  );
}
