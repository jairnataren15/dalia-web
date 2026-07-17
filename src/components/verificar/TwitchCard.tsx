import Link from "next/link";
import TwitchIcon from "@/components/icons/TwitchIcon";

const TIER_LABEL: Record<number, string> = {
  1000: "Sub Tier 1",
  2000: "Sub Tier 2",
  3000: "Sub Tier 3",
};

export default function TwitchCard({
  twitchLogin,
  subTier,
}: {
  twitchLogin: string | null;
  subTier: number | null;
}) {
  if (!twitchLogin) {
    return (
      <div className="rounded-xl border border-line bg-surface p-6">
        <h3 className="mb-1 font-display text-lg font-bold">Conecta tu Twitch</h3>
        <p className="mb-5 text-sm text-dim">
          Vincula tu cuenta de Twitch para desbloquear beneficios de suscriptor:
          multiplicador de puntos, sorteos exclusivos e insignia en el ranking.
        </p>
        <Link
          href="/api/twitch/connect?mode=viewer"
          className="inline-flex items-center gap-2 rounded-lg bg-[#9147ff] px-5 py-2.5 font-display text-sm font-bold text-white transition-colors hover:bg-[#7d3bdb]"
        >
          <TwitchIcon className="h-4 w-4" />
          Conectar Twitch
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#9147ff]/40 bg-[#9147ff]/10 p-6">
      <h3 className="mb-1 flex items-center gap-2 font-display text-lg font-bold text-[#a970ff]">
        <TwitchIcon className="h-4 w-4" />
        ✓ Twitch conectado
      </h3>
      <p className="mb-2 text-sm text-dim">
        Vinculado como <span className="font-semibold text-ink">{twitchLogin}</span>
      </p>
      {subTier ? (
        <span className="inline-block rounded-full bg-[#9147ff] px-3 py-1 text-xs font-bold text-white">
          {TIER_LABEL[subTier] ?? "Suscriptor"}
        </span>
      ) : (
        <p className="text-xs text-faint">
          Todavía no eres sub del canal — cuando te suscribas se detecta solo.
        </p>
      )}
    </div>
  );
}
