"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getSummonerStats, PLATFORM_BY_REGION } from "@/lib/riot";

export interface LfgActionState {
  status: "idle" | "error" | "success";
  message?: string;
}

export async function createLfgPost(
  _prev: LfgActionState,
  formData: FormData
): Promise<LfgActionState> {
  const session = await auth();
  if (!session?.user) {
    return { status: "error", message: "Inicia sesión para publicar." };
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user?.riotVerified || !user.riotGameName || !user.riotTagLine || !user.riotRegion) {
    return {
      status: "error",
      message: "Necesitas verificar tu Riot ID en /verificar antes de publicar.",
    };
  }

  const role = String(formData.get("role") ?? "");
  const looking = String(formData.get("looking") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!role || !looking || !message) {
    return { status: "error", message: "Completa todos los campos." };
  }

  const stats = await getSummonerStats(
    user.riotGameName,
    user.riotTagLine,
    PLATFORM_BY_REGION[user.riotRegion]
  ).catch(() => null);

  const tierSnap = stats?.ranked ? `${stats.tier} ${stats.division}`.trim() : "Sin clasificar";

  await prisma.lfgPost.create({
    data: {
      userId: user.id,
      role,
      looking,
      message,
      tierSnap,
      regionSnap: user.riotRegion,
    },
  });

  revalidatePath("/lfg");
  return { status: "success" };
}

export async function deleteLfgPost(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado.");

  const post = await prisma.lfgPost.findUnique({ where: { id } });
  if (!post) return;
  if (post.userId !== session.user.id && session.user.role !== "ADMIN") {
    throw new Error("No puedes borrar el anuncio de otra persona.");
  }

  await prisma.lfgPost.delete({ where: { id } });
  revalidatePath("/lfg");
}
