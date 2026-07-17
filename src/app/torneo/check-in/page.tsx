import { PageHeader } from "@/components/ui";
import CheckinPanel from "@/components/torneo/CheckinPanel";
import { getActiveTournament } from "@/lib/tournament";

export const metadata = { title: "Check-in — Copa DALIA.EXE" };

export default async function CheckinPage() {
  const t = await getActiveTournament();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-8">
      <PageHeader
        eyebrow={t?.name ?? "Copa DALIA.EXE"}
        title="Check-in"
        lede={`La ventana está abierta y cierra a las ${t?.checkinCloses ?? "—"}. Los equipos sin check-in completo pierden la plaza y entra la lista de espera.`}
      />
      <CheckinPanel teams={t?.teams ?? []} />
    </div>
  );
}
