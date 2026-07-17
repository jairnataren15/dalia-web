"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/** Da o quita el rol de Admin a un usuario. Solo lo puede llamar otro Admin. */
export async function setUserRole(userId: string, role: "USER" | "ADMIN") {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("No autorizado.");
  }
  if (userId === session.user.id && role === "USER") {
    throw new Error("No puedes quitarte el rol de Admin a ti mismo — pídeselo a otro admin.");
  }

  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/usuarios");
}
