import { cookies } from "next/headers";
import { auth } from "@/auth";

export const VIEW_MODE_COOKIE = "dalia_view_mode";

// isRealAdmin: el usuario tiene rol ADMIN en la base de datos.
// isAdminView: además de ser admin, no está previsualizando la web como usuario normal.
export async function getViewMode() {
  const session = await auth();
  const isRealAdmin = session?.user?.role === "ADMIN";
  const store = await cookies();
  const raw = store.get(VIEW_MODE_COOKIE)?.value;
  const isAdminView = isRealAdmin && raw !== "user";
  return { isRealAdmin, isAdminView };
}
