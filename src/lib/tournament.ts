import { prisma } from "./prisma";

export async function getActiveTournament() {
  return prisma.tournament.findFirst({
    where: { active: true },
    orderBy: { createdAt: "desc" },
    include: {
      teams: { orderBy: { order: "asc" } },
      matches: { orderBy: [{ round: "asc" }, { slot: "asc" }] },
    },
  });
}
