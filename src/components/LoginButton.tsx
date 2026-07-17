import { auth, signIn, signOut } from "@/auth";
import { getViewMode } from "@/lib/adminView";
import { setViewMode } from "@/app/admin/view-mode-actions";

export default async function LoginButton() {
  const session = await auth();

  if (session?.user) {
    const { isRealAdmin, isAdminView } = await getViewMode();

    return (
      <div className="flex items-center gap-2">
        {isRealAdmin && (
          <form action={setViewMode.bind(null, isAdminView ? "user" : "admin")}>
            <button
              type="submit"
              className={`rounded-lg border px-3 py-1.5 font-display text-xs font-bold uppercase tracking-wide transition-colors ${
                isAdminView
                  ? "border-rose/40 bg-rose/10 text-rose hover:border-rose"
                  : "border-live/40 bg-live-soft text-live hover:border-live"
              }`}
              title={
                isAdminView
                  ? "Previsualizar la web como la vería un usuario normal"
                  : "Volver a tu vista de administrador"
              }
            >
              {isAdminView ? "Ver como usuario" : "Ver como admin"}
            </button>
          </form>
        )}
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
          className="flex items-center gap-2"
        >
          {session.user.image && (
            <img
              src={session.user.image}
              alt=""
              className="h-7 w-7 rounded-full ring-1 ring-rose/40"
            />
          )}
          <span className="hidden text-sm font-semibold sm:block">
            {session.user.name}
          </span>
          <button
            type="submit"
            className="rounded-lg border border-line bg-raised px-3 py-1.5 font-display text-xs font-semibold text-dim transition-colors hover:bg-hover hover:text-ink"
          >
            Salir
          </button>
        </form>
      </div>
    );
  }

  return (
    <form
      action={async () => {
        "use server";
        await signIn("discord");
      }}
    >
      <button
        type="submit"
        className="rounded-lg bg-rose px-4 py-1.5 font-display text-sm font-semibold text-base transition-colors hover:bg-rose-hi"
      >
        Iniciar sesión
      </button>
    </form>
  );
}
