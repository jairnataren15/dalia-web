"use client";

import { useActionState, useRef, useState } from "react";
import { uploadGalleryPost, addGalleryLink, type UploadState } from "@/app/galeria/actions";

const initialState: UploadState = { status: "idle" };

function FileTab() {
  const [state, formAction, pending] = useActionState(uploadGalleryPost, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
    >
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
      {state.status === "error" && <p className="mt-2 text-sm text-danger">{state.message}</p>}
      {state.status === "success" && <p className="mt-2 text-sm text-live">✓ Publicado.</p>}
    </form>
  );
}

function LinkTab() {
  const [state, formAction, pending] = useActionState(addGalleryLink, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
    >
      <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
        <input
          type="url"
          name="url"
          required
          placeholder="https://clips.twitch.tv/... · youtube.com/... · medal.tv/... · overplay.gg/..."
          className="w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-rose"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-rose px-5 py-2 font-display text-sm font-bold text-base transition-colors hover:bg-rose-hi disabled:opacity-50"
        >
          {pending ? "Publicando…" : "Publicar"}
        </button>
      </div>
      <input
        name="caption"
        placeholder="Un texto corto (opcional)"
        maxLength={280}
        className="mt-3 w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-rose"
      />
      <p className="mt-2 text-xs text-faint">
        Twitch y YouTube se incrustan directo. Medal, Overplay y otros se muestran como tarjeta con link.
      </p>
      {state.status === "error" && <p className="mt-2 text-sm text-danger">{state.message}</p>}
      {state.status === "success" && <p className="mt-2 text-sm text-live">✓ Publicado.</p>}
    </form>
  );
}

export default function GalleryUploadForm() {
  const [mode, setMode] = useState<"file" | "link">("file");

  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-sm font-bold uppercase tracking-wider">
          Publicar en la galería
        </h2>
        <div className="flex gap-1 rounded-lg bg-raised p-1">
          <button
            type="button"
            onClick={() => setMode("file")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
              mode === "file" ? "bg-rose text-base" : "text-dim hover:text-ink"
            }`}
          >
            Subir archivo
          </button>
          <button
            type="button"
            onClick={() => setMode("link")}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
              mode === "link" ? "bg-rose text-base" : "text-dim hover:text-ink"
            }`}
          >
            Pegar link
          </button>
        </div>
      </div>
      {mode === "file" ? <FileTab /> : <LinkTab />}
    </div>
  );
}
