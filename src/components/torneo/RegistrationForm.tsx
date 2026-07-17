"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Mode = "solo" | "equipo";
const ROLES = ["Top", "Jungla", "Mid", "ADC", "Soporte"];

const inputCls =
  "w-full rounded-lg border border-line bg-raised px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-rose";
const labelCls = "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-dim";

export default function RegistrationForm({
  defaultRiotId,
}: {
  defaultRiotId?: string | null;
}) {
  const [mode, setMode] = useState<Mode>("solo");
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-xl border border-live/40 bg-live-soft p-8 text-center"
      >
        <p className="mb-2 text-4xl">✿</p>
        <h2 className="mb-2 font-display text-xl font-bold text-live">
          ¡Inscripción enviada!
        </h2>
        <p className="mx-auto max-w-sm text-sm text-dim">
          Validaremos tu rango con la Riot API y recibirás la confirmación por
          Discord. Recuerda: el check-in abre 30 minutos antes del torneo.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSent(true);
      }}
      className="rounded-xl border border-line bg-surface p-6"
    >
      {/* Modo */}
      <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-raised p-1">
        {(["solo", "equipo"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`relative rounded-md px-4 py-2 font-display text-sm font-semibold transition-colors ${
              mode === m ? "text-base" : "text-dim hover:text-ink"
            }`}
          >
            {mode === m && (
              <motion.span
                layoutId="mode-pill"
                className="absolute inset-0 rounded-md bg-rose"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            )}
            <span className="relative">
              {m === "solo" ? "Voy solo" : "Con mi equipo"}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="riot" className={labelCls}>Tu Riot ID</label>
          {defaultRiotId ? (
            <input
              id="riot"
              readOnly
              value={defaultRiotId}
              className={`${inputCls} cursor-not-allowed text-dim`}
            />
          ) : (
            <input id="riot" required placeholder="Nombre#TAG" className={inputCls} />
          )}
          <p className="mt-1 text-xs text-faint">
            {defaultRiotId ? (
              "Es el Riot ID de tu cuenta verificada — no se puede cambiar aquí."
            ) : (
              <>
                Verifica tu cuenta en{" "}
                <a href="/verificar" className="text-rose hover:underline">/verificar</a>{" "}
                para autocompletar esto.
              </>
            )}
          </p>
        </div>

        <div>
          <label htmlFor="role" className={labelCls}>Rol preferido</label>
          <select id="role" className={inputCls} defaultValue="Mid">
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>

        <AnimatePresence>
          {mode === "equipo" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-4 overflow-hidden"
            >
              <div>
                <label htmlFor="teamname" className={labelCls}>Nombre del equipo</label>
                <input id="teamname" required placeholder="Los Increíbles del Mid" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Riot IDs de tus 4 compañeros</label>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((n) => (
                    <input
                      key={n}
                      required
                      placeholder={`Compañero ${n} — Nombre#TAG`}
                      className={inputCls}
                      aria-label={`Compañero ${n}`}
                    />
                  ))}
                </div>
                <p className="mt-1 text-xs text-faint">
                  Todos deben tener la cuenta verificada (Tier 2). El roster se
                  bloquea al cierre de inscripciones.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <label className="flex items-start gap-2 text-xs text-dim">
          <input type="checkbox" required className="mt-0.5 accent-[#ff4d7d]" />
          He leído las reglas del torneo y sé que sin check-in perdemos la plaza.
        </label>

        <button
          type="submit"
          className="w-full rounded-lg bg-rose py-3 font-display text-sm font-bold text-base transition-colors hover:bg-rose-hi"
        >
          {mode === "solo" ? "Inscribirme" : "Inscribir equipo"}
        </button>
      </div>
    </form>
  );
}
