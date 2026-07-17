import { PageHeader, Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import RiotLinkForm from "@/components/verificar/RiotLinkForm";
import ChallengeCard from "@/components/verificar/ChallengeCard";
import VerifiedCard from "@/components/verificar/VerifiedCard";
import { auth, signIn } from "@/auth";
import { prisma } from "@/lib/prisma";

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
        lede="Dos niveles: con Discord ya participas en casi todo; con tu Riot ID entras al ranking, a los torneos y a los sorteos exclusivos."
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
              className="rounded-lg bg-rose px-5 py-2.5 font-display text-sm font-bold text-base transition-colors hover:bg-rose-hi"
            >
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

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {TIERS.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08}>
            <Card className={`h-full p-6 ${i === 1 ? "border-rose/40" : ""}`}>
              <h2 className={`font-display text-lg font-bold ${i === 1 ? "text-rose" : ""}`}>
                {t.name}
              </h2>
              <p className="mt-1 text-xs uppercase tracking-wider text-faint">{t.req}</p>
              <ul className="mt-4 space-y-2">
                {t.perks.map((p) => (
                  <li key={p} className="flex gap-2.5 text-sm text-dim">
                    <span className={i === 1 ? "text-rose" : "text-live"}>✓</span>
                    {p}
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        ))}
      </div>

      <p className="mt-6 text-xs text-faint">
        La verificación del Riot ID funciona cambiando temporalmente el icono de
        invocador al que te indiquemos — igual que op.gg. Sin contraseñas, nunca.
      </p>
    </div>
  );
}
