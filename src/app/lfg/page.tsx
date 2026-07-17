import { PageHeader } from "@/components/ui";
import LfgBoard from "@/components/lfg/LfgBoard";

export const metadata = { title: "Buscar equipo — Dalia" };

export default function LfgPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-8">
      <PageHeader
        eyebrow="Comunidad"
        title="Buscar equipo"
        lede="¿Sin dúo? ¿Falta un jungla para la Copa? Publica lo que buscas y contacta por Discord con miembros verificados DALIA.EXE."
      />
      <LfgBoard />
    </div>
  );
}
