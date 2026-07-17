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

export async function addScheduleEntry(formData: FormData) {
  await requireAdmin();
  const day = String(formData.get("day") ?? "").trim();
  const time = String(formData.get("time") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const type = String(formData.get("type") ?? "stream");
  if (!day || !time || !content) throw new Error("Completa todos los campos.");

  const max = await prisma.scheduleEntry.aggregate({ _max: { order: true } });
  await prisma.scheduleEntry.create({
    data: { day, time, content, type, order: (max._max.order ?? 0) + 1 },
  });
  revalidatePath("/admin/calendario");
  revalidatePath("/calendario");
}

export async function updateScheduleEntry(id: string, formData: FormData) {
  await requireAdmin();
  const day = String(formData.get("day") ?? "").trim();
  const time = String(formData.get("time") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const type = String(formData.get("type") ?? "stream");
  if (!day || !time || !content) throw new Error("Completa todos los campos.");

  await prisma.scheduleEntry.update({ where: { id }, data: { day, time, content, type } });
  revalidatePath("/admin/calendario");
  revalidatePath("/calendario");
}

export async function deleteScheduleEntry(id: string) {
  await requireAdmin();
  await prisma.scheduleEntry.delete({ where: { id } });
  revalidatePath("/admin/calendario");
  revalidatePath("/calendario");
}
