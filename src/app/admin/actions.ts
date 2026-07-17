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

/** Registra una donación manual (sin integración de pago real). */
export async function addDonor(formData: FormData) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("No autorizado.");
  }

  const name = String(formData.get("name") ?? "").trim();
  const amount = Number(formData.get("amount"));
  const note = String(formData.get("note") ?? "").trim() || null;

  if (!name || !Number.isFinite(amount) || amount <= 0) {
    throw new Error("Nombre y cantidad son obligatorios.");
  }

  await prisma.donor.create({ data: { name, amount, note } });
  revalidatePath("/admin/donadores");
}

/** Elimina un registro de donación. */
export async function deleteDonor(id: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("No autorizado.");
  }
  await prisma.donor.delete({ where: { id } });
  revalidatePath("/admin/donadores");
}
