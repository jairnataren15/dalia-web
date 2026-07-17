import { NextRequest, NextResponse } from "next/server";
import {
  getSummonerStats,
  riotConfigured,
  PLATFORM_BY_REGION,
  type Platform,
} from "@/lib/riot";

// GET /api/lol/summoner?name=Dalia&tag=FLOR&region=EUW

export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name");
  const tag = req.nextUrl.searchParams.get("tag");
  const region = req.nextUrl.searchParams.get("region") ?? "EUW";

  if (!name || !tag) {
    return NextResponse.json(
      { error: "Faltan parámetros: name y tag" },
      { status: 400 }
    );
  }

  if (!riotConfigured()) {
    return NextResponse.json(
      {
        error:
          "RIOT_API_KEY no configurada. Añádela a .env.local — se consigue gratis en developer.riotgames.com. Mientras tanto la web usa datos de ejemplo.",
      },
      { status: 503 }
    );
  }

  const platform: Platform = PLATFORM_BY_REGION[region] ?? "euw1";

  try {
    const stats = await getSummonerStats(name, tag, platform);
    return NextResponse.json(stats);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Error consultando Riot" },
      { status: 502 }
    );
  }
}
