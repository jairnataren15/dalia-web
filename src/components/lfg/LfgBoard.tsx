"use client";

import { useActionState, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TIER_COLORS, type Tier } from "@/lib/data";
import { createLfgPost, deleteLfgPost, type LfgActionState } from "@/app/lfg/actions";
import UserAvatar from "@/components/UserAvatar";

const ROLE_FILTERS = ["Todos", "Top", "Jungla", "Mid", "ADC", "Soporte"] as const;
const ROLE_OPTIONS = ["Top", "Jungla", "Mid", "ADC", "Soporte"];

export interface LfgPostView {
  id: string;
  userId: string;
  userName: string;
  userImage?: string | null;
  userAvatarChamp?: string | null;
  userPronouns?: string | null;
  role: string;
  looking: string;
  message: string;
  tierSnap: string;
  regionSnap: string;
  createdAt: string; // ISO
}

function timeAgo(iso: string): string {
  const diffMs = Date.now() - new Date(iso).getTime();
  const hours = Math.floor(diffMs / 3_600_000);
  if (hours < 1) return "hace unos minutos";
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  return `hace ${days} día${days > 1 ? "s" : ""}`;
}

const inputCls =
  "w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-rose";

const initialState: LfgActionState = { status: "idle" };

function PublishForm({ onDone }: { onDone: () => void }) {
  const [state, formAction, pending] = useActionState(createLfgPost, initialState);

  useEffect(() => {
    if (state.status === "success") onDone();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.status]);

  return (
    <form action={formAction} className="mb-5 rounded-xl border border-rose/40 bg-rose-soft p-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <select name="role" className={inputCls} defaultValue="Mid" aria-label="Rol">
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
        <input name="looking" required placeholder="¿Qué buscas? Ej. Dúo para subir" className={inputCls} />
      </div>
      <textarea
        name="message"
        required
        rows={3}
        placeholder="Cuéntales algo más: horario, campeones, actitud..."
        className={`${inputCls} mt-3 resize-none`}
      />
      {state.status === "error" && (
        <p className="mt-2 text-sm text-danger">{state.message}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-3 rounded-lg bg-rose px-4 py-2 font-display text-sm font-bold text-base transition-colors hover:bg-rose-hi disabled:opacity-50"
      >
        {pending ? "Publicando…" : "Publicar"}
      </button>
    </form>
  );
}

export default function LfgBoard({
  posts,
  canPost,
  currentUserId,
}: {
  posts: LfgPostView[];
  canPost: boolean;
  currentUserId?: string;
}) {
  const [role, setRole] = useState<(typeof ROLE_FILTERS)[number]>("Todos");
  const [showForm, setShowForm] = useState(false);

  const filtered = posts.filter((p) => role === "Todos" || p.role === role);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {ROLE_FILTERS.map((r) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={`relative rounded-lg px-3.5 py-1.5 font-display text-sm font-semibold transition-colors ${
                role === r ? "text-base" : "text-dim hover:text-ink"
              }`}
            >
              {role === r && (
                <motion.span
                  layoutId="lfg-pill"
                  className="absolute inset-0 rounded-lg bg-rose"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative">{r}</span>
            </button>
          ))}
        </div>
        {canPost ? (
          <button
            onClick={() => setShowForm((v) => !v)}
            className="rounded-lg bg-rose px-4 py-2 font-display text-sm font-bold text-base transition-colors hover:bg-rose-hi"
          >
            {showForm ? "Cancelar" : "+ Publicar anuncio"}
          </button>
        ) : (
          <a
            href="/verificar"
            className="rounded-lg border border-line bg-raised px-4 py-2 font-display text-sm font-semibold text-dim transition-colors hover:bg-hover hover:text-ink"
          >
            Verifica tu cuenta para publicar
          </a>
        )}
      </div>

      {showForm && canPost && <PublishForm onDone={() => setShowForm(false)} />}

      <motion.ul layout className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((p, i) => {
            const [tierName] = p.tierSnap.split(" ");
            const tierColor = TIER_COLORS[tierName as Tier] ?? "#9d8db4";
            return (
              <motion.li
                key={p.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
                className="rounded-xl border border-line bg-surface p-5 transition-colors hover:border-rose/40"
              >
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <UserAvatar
                    avatarChamp={p.userAvatarChamp}
                    image={p.userImage}
                    name={p.userName}
                    size={24}
                  />
                  <span className="font-semibold">{p.userName}</span>
                  {p.userPronouns && (
                    <span className="text-xs text-faint">({p.userPronouns})</span>
                  )}
                  <span
                    className="rounded-full px-2 py-0.5 text-[11px] font-bold"
                    style={{ color: tierColor, backgroundColor: `${tierColor}1f` }}
                  >
                    {p.tierSnap}
                  </span>
                  <span className="rounded-full bg-raised px-2 py-0.5 text-[11px] font-semibold text-dim">
                    {p.role}
                  </span>
                  <span className="rounded-full bg-raised px-2 py-0.5 text-[11px] font-semibold text-dim">
                    {p.regionSnap}
                  </span>
                  <span className="ml-auto text-xs text-faint">{timeAgo(p.createdAt)}</span>
                </div>
                <p className="font-display text-sm font-bold text-rose">{p.looking}</p>
                <p className="mt-1 text-sm text-dim">{p.message}</p>
                <div className="mt-3 flex gap-2">
                  <button className="rounded-lg border border-line bg-raised px-4 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-hover">
                    Contactar por Discord
                  </button>
                  {(p.userId === currentUserId) && (
                    <form action={deleteLfgPost.bind(null, p.id)}>
                      <button
                        type="submit"
                        className="rounded-lg border border-line bg-raised px-3 py-1.5 text-xs font-semibold text-dim transition-colors hover:bg-hover hover:text-danger"
                      >
                        Borrar
                      </button>
                    </form>
                  )}
                </div>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>

      {filtered.length === 0 && (
        <p className="py-12 text-center text-sm text-faint">
          Nadie busca {role === "Todos" ? "equipo" : role} ahora mismo — sé el primero en publicar.
        </p>
      )}
    </div>
  );
}
