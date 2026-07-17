import { PageHeader } from "@/components/ui";
import FaqAccordion from "@/components/faq/FaqAccordion";

export const metadata = { title: "FAQ — Dalia" };

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <PageHeader
        eyebrow="Ayuda"
        title="Preguntas frecuentes"
        lede="Si tu duda no está aquí, pregunta en el canal #ayuda del Discord — el staff responde rápido."
      />
      <FaqAccordion />
    </div>
  );
}
