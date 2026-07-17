"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  getAccount,
  getProfileIconId,
  pickChallengeIcon,
  riotConfigured,
  PLATFORM_BY_REGION,
} from "@/lib/riot";

export interface ActionState {
  status: "idle" | "error" | "success";
  message?: string;
}

const REGIONS = ["EUW", "NA", "LAN", "LAS"] as const;

/** Paso 1: el usuario declara su Riot ID — buscamos la cuenta y lanzamos el reto de icono. */
export async function startVerification(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) {
    return { status: "error", message: "Tienes que iniciar sesión con Discord primero." };
  }

  if (!riotConfigured()) {
    return {
      status: "error",
      message:
        "La Riot API no está configurada en el servidor todavía (falta RIOT_API_KEY). Avisa al staff.",
    };
  }

  const gameName = String(formData.get("gameName") ?? "").trim();
  const tagLine = String(formData.get("tagLine") ?? "").trim().replace(/^#/, "");
  const region = String(formData.get("region") ?? "");

  if (!gameName || !tagLine) {
    return { status: "error", message: "Escribe tu Riot ID completo, ej. Nombre y TAG." };
  }
  if (!REGIONS.includes(region as (typeof REGIONS)[number])) {
    return { status: "error", message: "Elige una región válida." };
  }

  const platform = PLATFORM_BY_REGION[region];

  try {
    const account = await getAccount(gameName, tagLine, platform);

    const existing = await prisma.user.findUnique({
      where: { riotPuuid: account.puuid },
    });
    if (existing && existing.id !== session.user.id) {
      return {
        status: "error",
        message: "Esa cuenta de LoL ya está verificada por otro usuario del sitio.",
      };
    }

    const currentIcon = await getProfileIconId(account.puuid, platform);
    const challenge = pickChallengeIcon(currentIcon);

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        riotPuuid: account.puuid,
        riotGameName: account.gameName,
        riotTagLine: account.tagLine,
        riotRegion: region,
        riotVerified: false,
        riotVerifiedAt: null,
        pendingChallengeIcon: challenge,
        pendingChallengeAt: new Date(),
      },
    });
  } catch {
    return {
      status: "error",
      message: "No encontramos esa cuenta. Revisa el nombre, el TAG y la región.",
    };
  }

  revalidatePath("/verificar");
  return { status: "success", message: "Cuenta encontrada. Cambia tu icono para confirmar." };
}

/** Paso 2: comprobamos que el jugador puso el icono del reto. */
export async function confirmVerification(
  _prev: ActionState
): Promise<ActionState> {
  const session = await auth();
  if (!session?.user) {
    return { status: "error", message: "Tienes que iniciar sesión con Discord primero." };
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.riotPuuid || !user.riotRegion || user.pendingChallengeIcon === null) {
    return { status: "error", message: "No hay ninguna verificación pendiente." };
  }

  const platform = PLATFORM_BY_REGION[user.riotRegion];
  const currentIcon = await getProfileIconId(user.riotPuuid, platform);

  if (currentIcon !== user.pendingChallengeIcon) {
    return {
      status: "error",
      message: `Todavía no veo ese icono puesto. Cámbialo en el cliente de LoL, guarda, y vuelve a intentar (puede tardar un minuto en actualizarse).`,
    };
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      riotVerified: true,
      riotVerifiedAt: new Date(),
      pendingChallengeIcon: null,
      pendingChallengeAt: null,
      points: { increment: 100 },
    },
  });

  revalidatePath("/verificar");
  return { status: "success", message: "¡Cuenta verificada! Ya apareces en el ranking del Jardín." };
}

/** Cancela el reto pendiente para intentar con otro Riot ID. */
export async function cancelVerification(): Promise<void> {
  const session = await auth();
  if (!session?.user) return;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      riotPuuid: null,
      riotGameName: null,
      riotTagLine: null,
      riotRegion: null,
      riotVerified: false,
      pendingChallengeIcon: null,
      pendingChallengeAt: null,
    },
  });

  revalidatePath("/verificar");
}
