import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isBroadcasterLive, getChatters } from "@/lib/twitch";

// Se llama cada ~5 minutos desde una Netlify Scheduled Function. Mientras
// Dalia esté en directo, suma puntos DALIA.EXE a los usuarios vinculados
// que estén presentes en el chat ahora mismo (aproximación de "viendo el
// directo" — Twitch no expone la lista real de espectadores).
const POINTS_PER_TICK = 10;

export async function GET(req: NextRequest) {
  const secret = req.headers.get("x-cron-secret");
  if (!secret || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const broadcaster = await prisma.broadcasterToken.findUnique({ where: { id: "dalia" } });
  if (!broadcaster) {
    return NextResponse.json({ awarded: 0, reason: "Twitch de Dalia sin conectar" });
  }

  const live = await isBroadcasterLive(broadcaster.twitchUserId).catch(() => false);
  if (!live) {
    return NextResponse.json({ awarded: 0, reason: "Dalia no está en directo" });
  }

  const chatters = await getChatters().catch(() => []);
  if (chatters.length === 0) {
    return NextResponse.json({ awarded: 0, reason: "Sin datos de chat (¿falta reconectar Twitch?)" });
  }

  const chatterSet = new Set(chatters);
  const linkedUsers = await prisma.user.findMany({
    where: { twitchLogin: { not: null } },
    select: { id: true, twitchLogin: true },
  });
  const inChat = linkedUsers.filter((u) => u.twitchLogin && chatterSet.has(u.twitchLogin.toLowerCase()));

  if (inChat.length > 0) {
    await prisma.user.updateMany({
      where: { id: { in: inChat.map((u) => u.id) } },
      data: { points: { increment: POINTS_PER_TICK } },
    });
  }

  return NextResponse.json({ awarded: inChat.length, pointsEach: POINTS_PER_TICK });
}
