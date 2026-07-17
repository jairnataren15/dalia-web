import { PageHeader } from "@/components/ui";
import RegistrationForm from "@/components/torneo/RegistrationForm";
import { getActiveTournament } from "@/lib/tournament";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export const metadata = { title: "Inscripción — Copa DALIA.EXE" };

export default async function InscripcionPage() {
  const t = await getActiveTournament();
  const spotsLeft = t ? t.maxTeams - t.teams.length : 0;

  const session = await auth();
  const user = session?.user
    ? await prisma.user.findUnique({ where: { id: session.user.id } })
    : null;
  const defaultRiotId =
    user?.riotVerified && user.riotGameName && user.riotTagLine
      ? `${user.riotGameName}#${user.riotTagLine}`
      : null;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 lg:px-8">
      <PageHeader
        eyebrow={t?.name ?? "Copa DALIA.EXE"}
        title="Inscripción"
        lede={
          spotsLeft > 0
            ? `Quedan ${spotsLeft} plazas. Puedes inscribirte solo (te asignamos equipo) o como capitán de un equipo de 5.`
            : "El cuadro está completo — las nuevas inscripciones entran en lista de espera y suben si un equipo no hace check-in."
        }
      />
      <RegistrationForm defaultRiotId={defaultRiotId} />
    </div>
  );
}
