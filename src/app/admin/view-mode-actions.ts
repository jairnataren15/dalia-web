"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { VIEW_MODE_COOKIE } from "@/lib/adminView";

export async function setViewMode(mode: "admin" | "user") {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("No autorizado.");
  }
  const store = await cookies();
  if (mode === "user") {
    store.set(VIEW_MODE_COOKIE, "user", { path: "/", maxAge: 60 * 60 * 24 * 30 });
  } else {
    store.delete(VIEW_MODE_COOKIE);
  }
  revalidatePath("/", "layout");
}
