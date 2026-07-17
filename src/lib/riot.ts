// Capa de acceso a la Riot Games API (solo servidor).
// Necesita RIOT_API_KEY en .env.local — consíguela en https://developer.riotgames.com
// (la key de desarrollo caduca cada 24 h; para producción hay que registrar la app).

export type Platform = "euw1" | "na1" | "la1" | "la2";

// account-v1 usa routing regional; league-v4 usa el host de la plataforma.
const CLUSTER: Record<Platform, string> = {
  euw1: "europe",
  na1: "americas",
  la1: "americas",
  la2: "americas",
};

export const PLATFORM_BY_REGION: Record<string, Platform> = {
  EUW: "euw1",
  NA: "na1",
  LAN: "la1",
  LAS: "la2",
};

function apiKey(): string | null {
  return process.env.RIOT_API_KEY ?? null;
}

async function riotFetch<T>(url: string): Promise<T> {
  const key = apiKey();
  if (!key) throw new Error("RIOT_API_KEY no configurada");
  const res = await fetch(url, {
    headers: { "X-Riot-Token": key },
    next: { revalidate: 900 }, // 15 min, igual que promete la UI
  });
  if (!res.ok) throw new Error(`Riot API ${res.status} en ${url}`);
  return res.json();
}

export function riotConfigured(): boolean {
  return apiKey() !== null;
}

interface RiotAccount {
  puuid: string;
  gameName: string;
  tagLine: string;
}

interface LeagueEntry {
  queueType: string; // RANKED_SOLO_5x5, RANKED_FLEX_SR
  tier: string; // DIAMOND, EMERALD...
  rank: string; // I..IV
  leaguePoints: number;
  wins: number;
  losses: number;
  hotStreak: boolean;
}

/** Riot ID (Nombre#TAG) → cuenta con puuid. */
export async function getAccount(
  gameName: string,
  tagLine: string,
  platform: Platform
): Promise<RiotAccount> {
  const cluster = CLUSTER[platform];
  return riotFetch<RiotAccount>(
    `https://${cluster}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(gameName)}/${encodeURIComponent(tagLine)}`
  );
}

/** Entradas de liga (soloQ/flex) por puuid. */
export async function getLeagueEntries(
  puuid: string,
  platform: Platform
): Promise<LeagueEntry[]> {
  return riotFetch<LeagueEntry[]>(
    `https://${platform}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`
  );
}

interface ChampionMastery {
  championId: number;
  championPoints: number;
}

let championIdToKey: Record<number, string> | null = null;

/** id numérico de campeón (mastery) → nombre para Data Dragon (ej. 103 → "Ahri"). */
async function loadChampionMap(): Promise<Record<number, string>> {
  if (championIdToKey) return championIdToKey;
  const { DDRAGON_VER } = await import("./data");
  const res = await fetch(
    `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER}/data/en_US/champion.json`,
    { next: { revalidate: 86_400 } }
  );
  const json = await res.json();
  const map: Record<number, string> = {};
  for (const champ of Object.values(json.data) as { key: string; id: string }[]) {
    map[Number(champ.key)] = champ.id;
  }
  championIdToKey = map;
  return map;
}

/** Los 3 campeones con más maestría de un jugador, como nombres de Data Dragon. */
export async function getTopChampions(
  puuid: string,
  platform: Platform,
  count = 3
): Promise<string[]> {
  const masteries = await riotFetch<ChampionMastery[]>(
    `https://${platform}.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/top?count=${count}`
  );
  const map = await loadChampionMap();
  return masteries.map((m) => map[m.championId]).filter(Boolean);
}

/** Icono de perfil actual de un invocador (para el reto de verificación). */
export async function getProfileIconId(
  puuid: string,
  platform: Platform
): Promise<number> {
  const data = await riotFetch<{ profileIconId: number }>(
    `https://${platform}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}`
  );
  return data.profileIconId;
}

// Iconos base del juego (0-28): siempre existen en cualquier cuenta y son neutrales.
const CHALLENGE_ICON_POOL = Array.from({ length: 29 }, (_, i) => i);

/** Elige un icono de reto distinto al que el jugador ya tiene puesto. */
export function pickChallengeIcon(currentIconId: number): number {
  const pool = CHALLENGE_ICON_POOL.filter((i) => i !== currentIconId);
  return pool[Math.floor(Math.random() * pool.length)];
}

export const profileIconUrl = (iconId: number) =>
  `https://ddragon.leagueoflegends.com/cdn/${DDRAGON_VER_FALLBACK}/img/profileicon/${iconId}.png`;

const DDRAGON_VER_FALLBACK = "14.24.1";

const TIER_ES: Record<string, string> = {
  IRON: "Hierro",
  BRONZE: "Bronce",
  SILVER: "Plata",
  GOLD: "Oro",
  PLATINUM: "Platino",
  EMERALD: "Esmeralda",
  DIAMOND: "Diamante",
  MASTER: "Master",
  GRANDMASTER: "Grandmaster",
  CHALLENGER: "Challenger",
};

/** Stats de soloQ de un Riot ID, listas para la UI. */
export async function getSummonerStats(
  gameName: string,
  tagLine: string,
  platform: Platform
) {
  const account = await getAccount(gameName, tagLine, platform);
  const [entries, mains] = await Promise.all([
    getLeagueEntries(account.puuid, platform),
    getTopChampions(account.puuid, platform).catch(() => []),
  ]);
  const solo = entries.find((e) => e.queueType === "RANKED_SOLO_5x5");

  if (!solo) {
    return {
      riotId: `${account.gameName}#${account.tagLine}`,
      ranked: false as const,
      mains,
    };
  }

  return {
    riotId: `${account.gameName}#${account.tagLine}`,
    ranked: true as const,
    tier: TIER_ES[solo.tier] ?? solo.tier,
    division: ["MASTER", "GRANDMASTER", "CHALLENGER"].includes(solo.tier)
      ? ""
      : solo.rank,
    lp: solo.leaguePoints,
    wins: solo.wins,
    losses: solo.losses,
    winrate: Math.round((solo.wins / (solo.wins + solo.losses)) * 100),
    hotStreak: solo.hotStreak,
    mains,
  };
}
