// Detecta la plataforma de un link de video/clip y arma la URL de embed
// cuando la plataforma lo permite (YouTube, Twitch). El resto (Medal,
// Overplay/Outplayed, etc.) se muestra como tarjeta de enlace externo.

const TWITCH_PARENTS = ["dalia-exe.netlify.app", "localhost"];

export interface ParsedVideoUrl {
  platformLabel: string;
  embedUrl: string | null;
}

/** Resuelve el iframe real de una plataforma vía su oEmbed público. */
async function resolveOembed(url: string, endpoint: string): Promise<string | null> {
  try {
    const res = await fetch(`${endpoint}?url=${encodeURIComponent(url)}&format=json`, {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return null;
    const json = await res.json();
    const html = typeof json.html === "string" ? json.html : null;
    if (!html) return null;
    const match = html.match(/src="([^"]+)"/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

export async function parseVideoUrl(raw: string): Promise<ParsedVideoUrl | null> {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return null;
  }
  if (u.protocol !== "https:" && u.protocol !== "http:") return null;

  const host = u.hostname.replace(/^www\./, "").replace(/^m\./, "");
  const parentParams = TWITCH_PARENTS.map((p) => `parent=${p}`).join("&");

  // YouTube
  if (host === "youtube.com") {
    const id = u.searchParams.get("v");
    if (id) return { platformLabel: "YouTube", embedUrl: `https://www.youtube.com/embed/${id}` };
    const shorts = u.pathname.match(/^\/shorts\/([\w-]+)/);
    if (shorts) return { platformLabel: "YouTube", embedUrl: `https://www.youtube.com/embed/${shorts[1]}` };
  }
  if (host === "youtu.be") {
    const id = u.pathname.slice(1);
    if (id) return { platformLabel: "YouTube", embedUrl: `https://www.youtube.com/embed/${id}` };
  }

  // Twitch clips
  if (host === "clips.twitch.tv") {
    const slug = u.pathname.slice(1);
    if (slug) {
      return {
        platformLabel: "Twitch Clip",
        embedUrl: `https://clips.twitch.tv/embed?clip=${slug}&${parentParams}`,
      };
    }
  }
  if (host === "twitch.tv") {
    const clipMatch = u.pathname.match(/\/clip\/([\w-]+)/);
    if (clipMatch) {
      return {
        platformLabel: "Twitch Clip",
        embedUrl: `https://clips.twitch.tv/embed?clip=${clipMatch[1]}&${parentParams}`,
      };
    }
    const vodMatch = u.pathname.match(/^\/videos\/(\d+)/);
    if (vodMatch) {
      return {
        platformLabel: "Twitch VOD",
        embedUrl: `https://player.twitch.tv/?video=${vodMatch[1]}&${parentParams}`,
      };
    }
  }

  // Medal.tv — usa su oEmbed público para conseguir el iframe real.
  if (host === "medal.tv") {
    const embedUrl = await resolveOembed(raw, "https://medal.tv/api/oembed");
    return { platformLabel: "Medal", embedUrl };
  }

  // Overplay / Outplayed y cualquier otro dominio no reconocido.
  if (host.includes("overplay") || host.includes("outplayed")) {
    return { platformLabel: "Overplay", embedUrl: null };
  }

  return { platformLabel: host, embedUrl: null };
}
