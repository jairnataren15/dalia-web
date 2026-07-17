import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { auth } from "@/auth";

// GET /api/twitch/connect?mode=viewer|broadcaster
// Redirige a Twitch para autorizar. El modo "broadcaster" (solo Admin) pide
// permiso para leer la lista de suscriptores del canal; "viewer" solo pide
// identidad básica para vincular la cuenta.

export async function GET(req: NextRequest) {
  const origin = process.env.AUTH_URL ?? req.nextUrl.origin;
  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect(new URL("/verificar", origin));
  }

  const mode = req.nextUrl.searchParams.get("mode") === "broadcaster" ? "broadcaster" : "viewer";
  if (mode === "broadcaster" && session.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/admin", origin));
  }

  const state = randomBytes(16).toString("hex");
  const redirectUri = new URL("/api/twitch/callback", origin).toString();
  const scope = mode === "broadcaster" ? "channel:read:subscriptions" : "";

  const authorizeUrl = new URL("https://id.twitch.tv/oauth2/authorize");
  authorizeUrl.searchParams.set("client_id", process.env.TWITCH_CLIENT_ID ?? "");
  authorizeUrl.searchParams.set("redirect_uri", redirectUri);
  authorizeUrl.searchParams.set("response_type", "code");
  authorizeUrl.searchParams.set("scope", scope);
  authorizeUrl.searchParams.set("state", state);

  const res = NextResponse.redirect(authorizeUrl);
  res.cookies.set("twitch_oauth", `${state}:${mode}`, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });
  return res;
}
