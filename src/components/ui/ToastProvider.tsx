"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

type ToastKind = "loading" | "success" | "error";

interface ToastItem {
  id: number;
  message: string;
  kind: ToastKind;
}

interface ToastContextValue {
  showToast: (message: string, kind?: ToastKind, duration?: number) => number;
  updateToast: (id: number, message: string, kind: "success" | "error", duration?: number) => void;
  dismissToast: (id: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast debe usarse dentro de <ToastProvider>.");
  return ctx;
}

let idCounter = 0;

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Record<number, ReturnType<typeof setTimeout>>>({});

  const dismissToast = useCallback((id: number) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    clearTimeout(timers.current[id]);
    delete timers.current[id];
  }, []);

  const scheduleDismiss = useCallback(
    (id: number, duration: number) => {
      clearTimeout(timers.current[id]);
      timers.current[id] = setTimeout(() => dismissToast(id), duration);
    },
    [dismissToast]
  );

  const showToast = useCallback(
    (message: string, kind: ToastKind = "loading", duration = 3000) => {
      const id = ++idCounter;
      setToasts((t) => [...t, { id, message, kind }]);
      if (kind !== "loading") scheduleDismiss(id, duration);
      return id;
    },
    [scheduleDismiss]
  );

  const updateToast = useCallback(
    (id: number, message: string, kind: "success" | "error", duration = 3000) => {
      setToasts((t) => t.map((x) => (x.id === id ? { ...x, message, kind } : x)));
      scheduleDismiss(id, duration);
    },
    [scheduleDismiss]
  );

  return (
    <ToastContext.Provider value={{ showToast, updateToast, dismissToast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-200 flex flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: -16, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className={`pointer-events-auto flex max-w-sm items-center gap-2 rounded-lg border px-4 py-2.5 font-display text-sm font-semibold shadow-xl backdrop-blur ${
                t.kind === "loading"
                  ? "border-line bg-surface/95 text-dim"
                  : t.kind === "success"
                    ? "border-live/40 bg-live-soft/95 text-live"
                    : "border-danger/40 bg-danger/10 text-danger"
              }`}
            >
              {t.kind === "loading" && (
                <span className="h-3.5 w-3.5 shrink-0 animate-spin rounded-full border-2 border-dim border-t-transparent" />
              )}
              {t.kind === "success" && <span className="shrink-0">✓</span>}
              {t.kind === "error" && <span className="shrink-0">✕</span>}
              <span>{t.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
