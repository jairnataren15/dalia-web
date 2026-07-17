import { auth, signIn, signOut } from "@/auth";

export default async function LoginButton() {
  const session = await auth();

  if (session?.user) {
    return (
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
