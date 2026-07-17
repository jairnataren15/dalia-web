"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export interface ProfileState {
  status: "idle" | "error" | "success";
  message?: string;
}

export async function updateProfile(
  _prev: ProfileState,
  formData: FormData
): Promise<ProfileState> {
  const session = await auth();
  if (!session?.user) {
    return { status: "error", message: "Inicia sesión para editar tu perfil." };
  }

  const bio = String(formData.get("bio") ?? "").trim().slice(0, 300);
  const pronouns = String(formData.get("pronouns") ?? "").trim().slice(0, 40);
  const avatarChamp = String(formData.get("avatarChamp") ?? "").trim() || null;

  await prisma.user.update({
    where: { id: session.user.id },
    data: { bio: bio || null, pronouns: pronouns || null, avatarChamp },
  });

  revalidatePath("/perfil");
  revalidatePath("/galeria");
  revalidatePath("/lfg");
  return { status: "success" };
}
