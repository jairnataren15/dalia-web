import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "USER" | "ADMIN";
      riotGameName: string | null;
      riotTagLine: string | null;
      riotVerified: boolean;
      avatarChamp: string | null;
    } & DefaultSession["user"];
  }
}
