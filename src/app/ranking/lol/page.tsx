import { PageHeader, Card } from "@/components/ui";
import LolRanking from "@/components/ranking/LolRanking";
import Comparator from "@/components/ranking/Comparator";
import { getVerifiedMembers } from "@/lib/ranking";

export const metadata = { title: "Ranking LoL — Dalia" };

export default async function RankingLolPage() {
  const members = await getVerifiedMembers();

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      <PageHeader
        eyebrow="Ranking"
        title="Clasificación DALIA.EXE"
        lede="Los miembros verificados de la comunidad, ordenados por rango. Actualizado cada 15 minutos desde la Riot API."
      />
      <LolRanking members={members} />
      <div className="mt-14">
        <h2 className="mb-1 text-2xl font-bold">Comparador cara a cara</h2>
        <p className="mb-6 max-w-xl text-sm text-dim">
          Elige dos miembros y compara su rango, winrate, KDA y progresión de LP
          de las últimas 10 semanas.
        </p>
        {members.length >= 2 ? (
          <Comparator members={members} />
        ) : (
          <Card className="p-8 text-center">
            <p className="text-sm text-dim">
              Hace falta al menos 2 miembros verificados para poder comparar —
              en cuanto se verifique alguien más, el comparador se activa solo.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
