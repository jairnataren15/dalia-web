"use client";

import { useEffect, useState } from "react";
import { TWITCH_URL } from "@/lib/channels";

interface TwitchStatus {
  live: boolean;
  uptime: string | null;
  viewers: number;
  game: string;
  title: string;
}

/** Estado real del canal de Twitch, refrescado cada 60 s. */
export default function LiveStatus() {
  const [status, setStatus] = useState<TwitchStatus | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const res = await fetch("/api/twitch");
        if (!res.ok) return;
        const data = await res.json();
        if (active) setStatus(data);
      } catch {
        /* sin conexión: se reintenta en el siguiente tick */
      }
    };
    load();
    const id = setInterval(load, 60_000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, []);

  if (!status) {
    return (
      <span className="flex items-center gap-2 rounded-full border border-line bg-raised px-3 py-1 text-xs font-semibold text-faint">
        <span className="h-2 w-2 rounded-full bg-faint" />
        Twitch…
      </span>
    );
  }

  if (status.live) {
    return (
      <a
        href={TWITCH_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 rounded-full border border-live/40 bg-live-soft px-3 py-1 text-xs font-semibold text-live transition-colors hover:border-live"
        title={status.title}
      >
        <span className="live-dot h-2 w-2 rounded-full bg-live" />
        EN DIRECTO
        {status.viewers > 0 && (
          <span className="tnum text-live/80">· {status.viewers} viendo</span>
        )}
      </a>
    );
  }

  return (
    <a
      href={TWITCH_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 rounded-full border border-line bg-raised px-3 py-1 text-xs font-semibold text-dim transition-colors hover:text-ink"
    >
      <span className="h-2 w-2 rounded-full bg-faint" />
      OFFLINE · ver canal
    </a>
  );
}
