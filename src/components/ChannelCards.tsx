"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TWITCH_URL, DISCORD_URL } from "@/lib/channels";

interface TwitchData {
  live: boolean;
  followers: number;
  game: string;
  title: string;
  avatar: string;
}

interface DiscordData {
  name: string;
  members: number;
  online: number;
  icon: string | null;
}

/** Tarjetas de Twitch y Discord con datos reales de las APIs públicas. */
export default function ChannelCards() {
  const [twitch, setTwitch] = useState<TwitchData | null>(null);
  const [discord, setDiscord] = useState<DiscordData | null>(null);
  const [twitchError, setTwitchError] = useState(false);
  const [discordError, setDiscordError] = useState(false);

  useEffect(() => {
    const load = (
      url: string,
      onData: (d: unknown) => void,
      onError: () => void
    ) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000);
      fetch(url, { signal: controller.signal })
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then(onData)
        .catch(onError)
        .finally(() => clearTimeout(timeout));
    };

    load("/api/twitch", (d) => setTwitch(d as TwitchData), () => setTwitchError(true));
    load("/api/discord", (d) => setDiscord(d as DiscordData), () => setDiscordError(true));
  }, []);

  const cardCls =
    "flex items-center gap-4 rounded-xl border border-line bg-surface p-5 transition-colors hover:bg-hover";

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Twitch */}
      <motion.a
        href={TWITCH_URL}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={cardCls}
      >
        {twitch?.avatar ? (
          <img
            src={twitch.avatar}
            alt="Avatar de Twitch"
            className="h-14 w-14 shrink-0 rounded-full ring-1 ring-[#a970ff]/50"
          />
        ) : (
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#a970ff]/15 text-2xl text-[#a970ff]">
            ▶
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-display font-bold">
            Twitch{" "}
            <span className="text-xs font-normal text-faint">dalia3margaret</span>
          </p>
          <p className="tnum text-sm text-dim">
            {twitch ? (
              <>
                {twitch.followers.toLocaleString("es")} seguidores
                {twitch.live && <span className="ml-1 text-live">· EN VIVO</span>}
              </>
            ) : twitchError ? (
              <span className="text-rose">No se pudo cargar — reintenta más tarde</span>
            ) : (
              <span className="text-rose">Cargando…</span>
            )}
          </p>
          {twitch?.game && (
            <p className="truncate text-xs text-faint">Jugando: {twitch.game}</p>
          )}
        </div>
        <span className="rounded-lg bg-[#a970ff] px-4 py-1.5 font-display text-xs font-semibold text-white">
          Seguir
        </span>
      </motion.a>

      {/* Discord */}
      <motion.a
        href={DISCORD_URL}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.08 }}
        className={cardCls}
      >
        {discord?.icon ? (
          <img
            src={discord.icon}
            alt="Icono del servidor de Discord"
            className="h-14 w-14 shrink-0 rounded-full ring-1 ring-[#5865f2]/50"
          />
        ) : (
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#5865f2]/15 text-2xl text-[#5865f2]">
            ✦
          </span>
        )}
        <div className="min-w-0 flex-1">
          <p className="font-display font-bold">Discord</p>
          <p className="tnum text-sm text-dim">
            {discord ? (
              <>
                {discord.members.toLocaleString("es")} miembros
                <span className="ml-1 text-live">· {discord.online} en línea</span>
              </>
            ) : discordError ? (
              <span className="text-rose">No se pudo cargar — reintenta más tarde</span>
            ) : (
              <span className="text-rose">Cargando…</span>
            )}
          </p>
          <p className="truncate text-xs text-faint">DALIA.EXE</p>
        </div>
        <span className="rounded-lg bg-[#5865f2] px-4 py-1.5 font-display text-xs font-semibold text-white">
          Unirme
        </span>
      </motion.a>
    </div>
  );
}
