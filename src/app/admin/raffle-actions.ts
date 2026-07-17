"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("No autorizado.");
  }
}

function readRaffleFields(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const category = String(formData.get("category") ?? "Merch");
  const cost = Number(formData.get("cost"));
  const maxEntries = Number(formData.get("maxEntries"));
  const closes = String(formData.get("closes") ?? "").trim();
  const image = String(formData.get("image") ?? "").trim() || null;
  if (!name || !closes || !Number.isFinite(cost) || !Number.isFinite(maxEntries)) {
    throw new Error("Completa nombre, costo, cupo y cierre.");
  }
  return { name, category, cost, maxEntries, closes, image };
}

export async function addRaffle(formData: FormData) {
  await requireAdmin();
  const fields = readRaffleFields(formData);
  const max = await prisma.raffle.aggregate({ _max: { order: true } });
  await prisma.raffle.create({
    data: { ...fields, order: (max._max.order ?? 0) + 1 },
  });
  revalidatePath("/admin/sorteos");
  revalidatePath("/tienda");
}

export async function updateRaffle(id: string, formData: FormData) {
  await requireAdmin();
  const fields = readRaffleFields(formData);
  await prisma.raffle.update({ where: { id }, data: fields });
  revalidatePath("/admin/sorteos");
  revalidatePath("/tienda");
}

export async function toggleRaffleActive(id: string, active: boolean) {
  await requireAdmin();
  await prisma.raffle.update({ where: { id }, data: { active } });
  revalidatePath("/admin/sorteos");
  revalidatePath("/tienda");
}

export async function deleteRaffle(id: string) {
  await requireAdmin();
  await prisma.raffle.delete({ where: { id } });
  revalidatePath("/admin/sorteos");
  revalidatePath("/tienda");
}
