"use client";

import { useTransition } from "react";
import { useToast } from "@/components/ui/ToastProvider";

interface FeedbackMessages {
  loading: string;
  success: string;
  error?: string;
}

/** Envuelve una Server Action con feedback visual (toast) de cargando/éxito/error. */
export function useActionFeedback() {
  const [isPending, startTransition] = useTransition();
  const { showToast, updateToast } = useToast();

  function run(action: () => Promise<void>, messages: FeedbackMessages) {
    const id = showToast(messages.loading, "loading");
    startTransition(async () => {
      try {
        await action();
        updateToast(id, messages.success, "success");
      } catch (e) {
        updateToast(id, messages.error ?? (e instanceof Error ? e.message : "Algo salió mal."), "error");
      }
    });
  }

  return { run, isPending };
}
