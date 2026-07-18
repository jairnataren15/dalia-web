import type { Config } from "@netlify/functions";

// Cada 5 minutos, llama al endpoint interno que reparte puntos DALIA.EXE
// a quien esté en el chat mientras Dalia está en directo. La lógica real
// vive en la app de Next.js (con Prisma) — esta función solo dispara la
// llamada con el secreto compartido.
export default async () => {
  const base = process.env.URL || process.env.DEPLOY_PRIME_URL;
  const secret = process.env.CRON_SECRET;
  if (!base || !secret) {
    console.error("Falta URL o CRON_SECRET para trigger-chat-points");
    return new Response("Config incompleta", { status: 500 });
  }

  try {
    const res = await fetch(`${base}/api/cron/award-chat-points`, {
      headers: { "x-cron-secret": secret },
    });
    const body = await res.text();
    console.log(`award-chat-points -> ${res.status}: ${body}`);
    return new Response(body, { status: res.status });
  } catch (err) {
    console.error("Error llamando a award-chat-points", err);
    return new Response("Error", { status: 500 });
  }
};

export const config: Config = {
  schedule: "*/5 * * * *",
};
