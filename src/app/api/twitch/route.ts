import { NextResponse } from "next/server";
import { TWITCH_USER } from "@/lib/channels";

// Datos públicos de Twitch vía decapi.me (sin API key).
// Para producción con más volumen, cambiar a Twitch Helix con TWITCH_CLIENT_ID/SECRET.

const DECAPI = "https://decapi.me/twitch";

async function decapi(endpoint: string): Promise<string> {
  const res = await fetch(`${DECAPI}/${endpoint}/${TWITCH_USER}`, {
    next: { revalidate: 60 },
  });
  return (await res.text()).trim();
}

export async function GET() {
  try {
    const [uptime, game, title, followers, avatar] = await Promise.all([
      decapi("uptime"),
      decapi("game"),
      decapi("title"),
      decapi("followcount"),
      decapi("avatar"),
    ]);

    const live = !uptime.toLowerCase().includes("offline");

    let viewers = 0;
    if (live) {
      const v = await decapi("viewercount");
      viewers = Number.parseInt(v, 10) || 0;
    }

    return NextResponse.json({
      user: TWITCH_USER,
      live,
      uptime: live ? uptime : null,
      viewers,
      game,
      title,
      followers: Number.parseInt(followers, 10) || 0,
      avatar,
    });
  } catch {
    return NextResponse.json(
      { user: TWITCH_USER, live: false, error: "No se pudo consultar Twitch" },
      { status: 502 }
    );
  }
}
