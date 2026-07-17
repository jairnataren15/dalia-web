import { prisma } from "./prisma";
import { getAccount, getSummonerStats, PLATFORM_BY_REGION } from "./riot";
import type { Member, Region, Tier } from "./data";

/** Riot ID fijo de Dalia — siempre aparece en el ranking, verificada o no. */
export const DALIA_RIOT = { gameName: "QuesoTrïpleCrema", tagLine: "LAN", region: "LAN" as Region };

const TIER_ORDER: Tier[] = [
  "Hierro", "Bronce", "Plata", "Oro", "Platino",
  "Esmeralda", "Diamante", "Master", "Grandmaster", "Challenger",
];
const DIVISION_VALUE: Record<string, number> = { IV: 1, III: 2, II: 3, I: 4, "": 5 };

export function rankScore(m: Pick<Member, "tier" | "division" | "lp" | "unranked">): number {
  if (m.unranked) return -1;
  const tierIndex = TIER_ORDER.indexOf(m.tier);
  const divisionValue = DIVISION_VALUE[m.division] ?? 0;
  return tierIndex * 10_000 + divisionValue * 1000 + m.lp;
}

function toMember(
  id: string,
  discord: string,
  region: Region,
  stats: Awaited<ReturnType<typeof getSummonerStats>>
): Member {
  const [riotId, tag] = stats.riotId.split("#");
  if (!stats.ranked) {
    return {
      id,
      riotId,
      tag,
      discord,
      region,
      role: "Mid",
      tier: "Hierro",
      division: "",
      lp: 0,
      wins: 0,
      losses: 0,
      mains: stats.mains,
      kda: 0,
      streak: 0,
      lpHistory: Array(10).fill(0),
      unranked: true,
    };
  }
  return {
    id,
    riotId,
    tag,
    discord,
    region,
    role: "Mid",
    tier: stats.tier as Tier,
    division: stats.division,
    lp: stats.lp,
    wins: stats.wins,
    losses: stats.losses,
    mains: stats.mains,
    kda: 0,
    streak: stats.hotStreak ? 1 : 0,
    lpHistory: Array(10).fill(stats.lp),
  };
}

/** Miembros reales del Jardín: Dalia + todos los usuarios con Riot ID verificado. */
export async function getVerifiedMembers(): Promise<Member[]> {
  const results: Member[] = [];

  const daliaAccount = await getAccount(
    DALIA_RIOT.gameName,
    DALIA_RIOT.tagLine,
    PLATFORM_BY_REGION[DALIA_RIOT.region]
  ).catch(() => null);

  const daliaStats = await getSummonerStats(
    DALIA_RIOT.gameName,
    DALIA_RIOT.tagLine,
    PLATFORM_BY_REGION[DALIA_RIOT.region]
  ).catch(() => null);

  if (daliaStats) {
    results.push(toMember("dalia", "dalia", DALIA_RIOT.region, daliaStats));
  }

  const dbUsers = await prisma.user.findMany({
    where: {
      riotVerified: true,
      riotGameName: { not: null },
      riotTagLine: { not: null },
      riotRegion: { not: null },
    },
  });

  const others = await Promise.all(
    dbUsers
      .filter((u) => u.riotPuuid !== daliaAccount?.puuid) // evita duplicar a Dalia
      .map(async (u) => {
        const region = u.riotRegion as Region;
        const stats = await getSummonerStats(
          u.riotGameName!,
          u.riotTagLine!,
          PLATFORM_BY_REGION[region]
        ).catch(() => null);
        if (!stats) return null;
        return toMember(u.id, u.name ?? u.riotGameName!, region, stats);
      })
  );

  results.push(...others.filter((m): m is Member => m !== null));
  results.sort((a, b) => rankScore(b) - rankScore(a));
  return results;
}
