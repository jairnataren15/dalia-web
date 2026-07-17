import { DDRAGON_VER } from "./data";

export interface ChampionSummary {
  id: string; // ej. "Ahri" — usado para armar la URL del icono
  name: string; // nombre para mostrar, ej. "Ahri"
}

/** Lista completa de campeones desde Data Dragon (cache 24h). */
export async function getChampionList(): Promise<ChampionSummary[]> {
  const res = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/data/en_US/champion.json`,
    { next: { revalidate: 86_400 } }
  );
  if (!res.ok) return [];
  const json = await res.json();
  const data = json.data as Record<string, { id: string; name: string }>;
  return Object.values(data)
    .map((c) => ({ id: c.id, name: c.name }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
