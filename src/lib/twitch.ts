// Capa de acceso a la API de Twitch para: identidad del viewer, y estado
// de suscripción vía el token del broadcaster (Dalia).
// Necesita TWITCH_CLIENT_ID + TWITCH_CLIENT_SECRET en .env.local.

import { prisma } from "./prisma";

const HELIX = "https://api.twitch.tv/helix";
const TOKEN_URL = "https://id.twitch.tv/oauth2/token";

function clientId(): string {
  const id = process.env.TWITCH_CLIENT_ID;
  if (!id) throw new Error("TWITCH_CLIENT_ID no configurada");
  return id;
}

function clientSecret(): string {
  const secret = process.env.TWITCH_CLIENT_SECRET;
  if (!secret) throw new Error("TWITCH_CLIENT_SECRET no configurada");
  return secret;
}

export function twitchConfigured(): boolean {
  return Boolean(process.env.TWITCH_CLIENT_ID && process.env.TWITCH_CLIENT_SECRET);
}

interface TwitchTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string[];
}

/** Intercambia el código de autorización (redirect de Twitch) por tokens. */
export async function exchangeCode(
  code: string,
  redirectUri: string
): Promise<TwitchTokenResponse> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId(),
      client_secret: clientSecret(),
      code,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
    }),
  });
  if (!res.ok) throw new Error(`Twitch token exchange ${res.status}`);
  return res.json();
}

async function refreshAccessToken(refreshToken: string): Promise<TwitchTokenResponse> {
  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId(),
      client_secret: clientSecret(),
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });
  if (!res.ok) throw new Error(`Twitch token refresh ${res.status}`);
  return res.json();
}

interface TwitchUser {
  id: string;
  login: string;
  display_name: string;
  profile_image_url: string;
}

/** Identidad del usuario dueño del access token dado (viewer o broadcaster). */
export async function getTwitchUser(accessToken: string): Promise<TwitchUser> {
  const res = await fetch(`${HELIX}/users`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Client-Id": clientId(),
    },
  });
  if (!res.ok) throw new Error(`Twitch users ${res.status}`);
  const json = await res.json();
  return json.data[0];
}

/** Access token válido de Dalia (broadcaster), refrescándolo si hace falta. */
export async function getBroadcasterAccessToken(): Promise<{
  accessToken: string;
  broadcasterId: string;
} | null> {
  const row = await prisma.broadcasterToken.findUnique({ where: { id: "dalia" } });
  if (!row) return null;

  // Twitch access tokens duran ~4h; los refrescamos siempre para simplificar.
  try {
    const refreshed = await refreshAccessToken(row.refreshToken);
    await prisma.broadcasterToken.update({
      where: { id: "dalia" },
      data: {
        accessToken: refreshed.access_token,
        refreshToken: refreshed.refresh_token,
      },
    });
    return { accessToken: refreshed.access_token, broadcasterId: row.twitchUserId };
  } catch {
    return { accessToken: row.accessToken, broadcasterId: row.twitchUserId };
  }
}

interface SubscriptionEntry {
  broadcaster_id: string;
  user_id: string;
  tier: string; // "1000" | "2000" | "3000"
}

/** Consulta si un viewer (por su twitchId) está suscrito al canal de Dalia. */
export async function checkSubscription(
  viewerTwitchId: string
): Promise<{ subscribed: boolean; tier?: number }> {
  const broadcaster = await getBroadcasterAccessToken();
  if (!broadcaster) return { subscribed: false };

  const res = await fetch(
    `${HELIX}/subscriptions?broadcaster_id=${broadcaster.broadcasterId}&user_id=${viewerTwitchId}`,
    {
      headers: {
        Authorization: `Bearer ${broadcaster.accessToken}`,
        "Client-Id": clientId(),
      },
    }
  );
  if (!res.ok) return { subscribed: false };
  const json = await res.json();
  const entry = (json.data as SubscriptionEntry[])[0];
  if (!entry) return { subscribed: false };
  return { subscribed: true, tier: Number(entry.tier) };
}
