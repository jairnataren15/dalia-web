import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "database" },
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
      session.user.id = user.id;
      session.user.role = dbUser?.role ?? "USER";
      session.user.riotGameName = dbUser?.riotGameName ?? null;
      session.user.riotTagLine = dbUser?.riotTagLine ?? null;
      session.user.riotVerified = dbUser?.riotVerified ?? false;
      session.user.avatarChamp = dbUser?.avatarChamp ?? null;
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // El primer usuario que se registra en toda la web queda como admin.
      const total = await prisma.user.count();
      if (total === 1 && user.id) {
        await prisma.user.update({
          where: { id: user.id },
          data: { role: "ADMIN" },
        });
      }
    },
  },
  pages: {
    signIn: "/",
  },
});
