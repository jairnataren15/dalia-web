import { PageHeader } from "@/components/ui";
import RegistrationForm from "@/components/torneo/RegistrationForm";
import { activeTournament } from "@/lib/data";

export const metadata = { title: "Inscripción — Copa DALIA.EXE" };

export default function InscripcionPage() {
  const t = activeTournament;
  const spotsLeft = t.maxTeams - t.registered.length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 lg:px-8">
      <PageHeader
        eyebrow={t.name}
        title="Inscripción"
        lede={
          spotsLeft > 0
            ? `Quedan ${spotsLeft} plazas. Puedes inscribirte solo (te asignamos equipo) o como capitán de un equipo de 5.`
            : "El cuadro está completo — las nuevas inscripciones entran en lista de espera y suben si un equipo no hace check-in."
        }
      />
      <RegistrationForm />
    </div>
  );
}
