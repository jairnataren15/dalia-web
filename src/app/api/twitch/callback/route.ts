import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { exchangeCode, getTwitchUser, checkSubscription } from "@/lib/twitch";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect(new URL("/verificar", req.url));
  }

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const cookie = req.cookies.get("twitch_oauth")?.value ?? "";
  const [savedState, mode] = cookie.split(":");

  const failUrl = mode === "broadcaster" ? "/admin" : "/verificar";

  if (!code || !state || state !== savedState) {
    return NextResponse.redirect(new URL(`${failUrl}?twitch=error`, req.url));
  }

  try {
    const redirectUri = new URL("/api/twitch/callback", req.url).toString();
    const tokens = await exchangeCode(code, redirectUri);
    const twitchUser = await getTwitchUser(tokens.access_token);

    if (mode === "broadcaster") {
      if (session.user.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/admin?twitch=error", req.url));
      }
      await prisma.broadcasterToken.upsert({
        where: { id: "dalia" },
        create: {
          id: "dalia",
          twitchUserId: twitchUser.id,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          scope: tokens.scope.join(" "),
        },
        update: {
          twitchUserId: twitchUser.id,
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          scope: tokens.scope.join(" "),
        },
      });
      const res = NextResponse.redirect(new URL("/admin?twitch=connected", req.url));
      res.cookies.delete("twitch_oauth");
      return res;
    }

    // Modo viewer: vincula la identidad de Twitch a la cuenta logueada.
    const existing = await prisma.user.findUnique({ where: { twitchId: twitchUser.id } });
    if (existing && existing.id !== session.user.id) {
      return NextResponse.redirect(new URL("/verificar?twitch=taken", req.url));
    }

    const sub = await checkSubscription(twitchUser.id).catch(
      () => ({ subscribed: false }) as { subscribed: boolean; tier?: number }
    );

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twitchId: twitchUser.id,
        twitchLogin: twitchUser.login,
        twitchProfileImg: twitchUser.profile_image_url,
        twitchConnectedAt: new Date(),
        subTier: sub.subscribed ? (sub.tier ?? null) : null,
        subSince: sub.subscribed ? new Date() : null,
        subCheckedAt: new Date(),
      },
    });

    const res = NextResponse.redirect(new URL("/verificar?twitch=connected", req.url));
    res.cookies.delete("twitch_oauth");
    return res;
  } catch {
    return NextResponse.redirect(new URL(`${failUrl}?twitch=error`, req.url));
  }
}
