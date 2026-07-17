import { PageHeader, Card } from "@/components/ui";
import Reveal from "@/components/Reveal";
import { activeTournament } from "@/lib/data";

export const metadata = { title: "Reglas — Copa DALIA.EXE" };

const SECTIONS = [
  {
    title: "Formato",
    rules: [
      "Eliminación simple a Bo1. La final se juega a Bo3.",
      `Se juega en el parche ${activeTournament.patch} — Grieta del Invocador, modo Torneo (draft con bans).`,
      "Draft: ban-pick alternado estándar (3-2 bans por lado).",
      "El equipo de arriba en el bracket elige lado en la primera partida; en la final, el lado se alterna.",
    ],
  },
  {
    title: "Inscripción y check-in",
    rules: [
      "Todos los jugadores necesitan cuenta verificada Tier 2 (Riot ID vinculado).",
      "El rango máximo permitido se anuncia con cada torneo. La validación es automática contra la Riot API al inscribirse.",
      "El roster se bloquea al cierre de inscripciones. Cambios posteriores solo con aprobación del staff.",
      "El check-in abre 30 minutos antes y cierra 15 minutos antes del inicio. Sin check-in completo, la plaza pasa a la lista de espera.",
    ],
  },
  {
    title: "Puntualidad y ausencias",
    rules: [
      "10 minutos de cortesía desde la hora programada de cada partida.",
      "Pasados los 10 minutos, el equipo ausente pierde la partida por defecto (0-1).",
      "Si un jugador se desconecta antes del minuto 3 y no vuelve en 10 minutos, se puede rehacer la partida una única vez.",
      "Se permite 1 suplente por equipo, declarado en la inscripción y con el mismo requisito de rango.",
    ],
  },
  {
    title: "Resultados y disputas",
    rules: [
      "El capitán ganador reporta el resultado con captura de la pantalla de victoria.",
      "Si los dos equipos reportan resultados distintos, el staff revisa el historial de la partida y su decisión es final.",
      "Cualquier comportamiento tóxico grave (dentro o fuera del juego) puede suponer descalificación inmediata.",
    ],
  },
  {
    title: "Premios",
    rules: [
      `Campeón: ${activeTournament.prize}.`,
      "Subcampeón: 25€ en RP por jugador.",
      "MVP del torneo (elegido por Dalia y el staff): skin legendaria a elegir.",
      "Todos los participantes con check-in reciben 500 puntos DALIA.EXE.",
    ],
  },
];

export default function ReglasPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <PageHeader
        eyebrow="Copa DALIA.EXE"
        title="Reglas del torneo"
        lede="Léelas antes de inscribirte. El staff aplica esto tal cual está escrito — así nadie improvisa en directo."
      />
      <div className="space-y-5">
        {SECTIONS.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.05}>
            <Card className="p-6">
              <h2 className="mb-3 font-display text-lg font-bold text-rose">
                {i + 1}. {s.title}
              </h2>
              <ul className="space-y-2">
                {s.rules.map((r, j) => (
                  <li key={j} className="flex gap-3 text-sm text-dim">
                    <span className="mt-0.5 text-rose">✿</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
