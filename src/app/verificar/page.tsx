import { PageHeader, Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import RiotLinkForm from "@/components/verificar/RiotLinkForm";
import ChallengeCard from "@/components/verificar/ChallengeCard";
import VerifiedCard from "@/components/verificar/VerifiedCard";
import TwitchCard from "@/components/verificar/TwitchCard";
import { auth, signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import DiscordIcon from "@/components/icons/DiscordIcon";

export const metadata = { title: "Verificar cuenta — Dalia" };

const TIERS = [
  {
    name: "Tier 1 · Conectado",
    req: "Cuenta creada + Discord vinculado",
    perks: [
      "Participar en sorteos de la tienda",
      "Apostar en predicciones",
      "Aparecer en el ranking de puntos",
      "Publicar en el tablero de buscar equipo",
    ],
  },
  {
    name: "Tier 2 · Verificado",
    req: "Todo lo anterior + Riot ID verificado",
    perks: [
      "Aparecer en el ranking de LoL DALIA.EXE",
      "Inscribirte en la Copa DALIA.EXE",
      "Rol de rango automático en Discord",
      "Acceso a sorteos exclusivos (partida de flex, revisión de VOD)",
    ],
  },
  {
    name: "Track · Suscriptor",
    req: "Twitch conectado + suscripción activa al canal",
    perks: [
      "Multiplicador x1.5–x2 en puntos DALIA.EXE",
      "Sorteos exclusivos solo para subs",
      "Insignia de suscriptor en el ranking",
      "Inscripción anticipada a torneos (24h antes)",
    ],
  },
];

export default async function VerificarPage() {
  const session = await auth();
  const user = session?.user
    ? await prisma.user.findUnique({ where: { id: session.user.id } })
    : null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <PageHeader
        eyebrow="Cuenta"
        title="Verifica tu cuenta"
        lede="Con Discord ya participas en casi todo; con tu Riot ID entras al ranking y los torneos; con Twitch desbloqueas beneficios de suscriptor."
      />

      {!user ? (
        <Card className="p-6">
          <p className="mb-4 text-sm text-dim">
            Primero inicia sesión con Discord para poder vincular tu cuenta de LoL.
          </p>
          <form
            action={async () => {
              "use server";
              await signIn("discord");
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-2 rounded-lg bg-rose px-5 py-2.5 font-display text-sm font-bold text-base transition-colors hover:bg-rose-hi"
            >
              <DiscordIcon className="h-4 w-4" />
              Iniciar sesión con Discord
            </button>
          </form>
        </Card>
      ) : user.riotVerified && user.riotGameName && user.riotTagLine ? (
        <VerifiedCard
          gameName={user.riotGameName}
          tagLine={user.riotTagLine}
          region={user.riotRegion ?? "LAN"}
        />
      ) : user.riotPuuid && user.pendingChallengeIcon !== null ? (
        <ChallengeCard
          gameName={user.riotGameName ?? ""}
          tagLine={user.riotTagLine ?? ""}
          challengeIcon={user.pendingChallengeIcon}
        />
      ) : (
        <RiotLinkForm />
      )}

      {user && (
        <div className="mt-5">
          <TwitchCard twitchLogin={user.twitchLogin} subTier={user.subTier} />
        </div>
      )}

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {TIERS.map((t, i) => {
          const accent = i === 1 ? "text-rose" : i === 2 ? "text-[#a970ff]" : "";
          const border = i === 1 ? "border-rose/40" : i === 2 ? "border-[#9147ff]/40" : "";
          const check = i === 1 ? "text-rose" : i === 2 ? "text-[#a970ff]" : "text-live";
          return (
          <Reveal key={t.name} delay={i * 0.08}>
            <Card className={`h-full p-6 ${border}`}>
              <h2 className={`font-display text-lg font-bold ${accent}`}>
                {t.name}
              </h2>
              <p className="mt-1 text-xs uppercase tracking-wider text-faint">{t.req}</p>
              <ul className="mt-4 space-y-2">
                {t.perks.map((p) => (
                  <li key={p} className="flex gap-2.5 text-sm text-dim">
                    <span className={check}>✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
          );
        })}
      </div>

      <p className="mt-6 text-xs text-faint">
        La verificación del Riot ID funciona cambiando temporalmente el icono de
        invocador al que te indiquemos — igual que op.gg. Sin contraseñas, nunca.
      </p>
    </div>
  );
}
