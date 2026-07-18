import { auth, signIn, signOut } from "@/auth";
import { getViewMode } from "@/lib/adminView";
import UserAvatar from "@/components/UserAvatar";
import ViewModeToggleButton from "@/components/ViewModeToggleButton";

export default async function LoginButton() {
  const session = await auth();

  if (session?.user) {
    const { isRealAdmin, isAdminView } = await getViewMode();

    return (
      <div className="flex items-center gap-2">
        {isRealAdmin && <ViewModeToggleButton isAdminView={isAdminView} />}
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/" });
          }}
          className="flex items-center gap-2"
        >
          <UserAvatar
            avatarChamp={session.user.avatarChamp}
            image={session.user.image}
            name={session.user.name}
            size={28}
          />
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
