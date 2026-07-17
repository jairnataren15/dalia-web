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

function revalidateTorneo() {
  revalidatePath("/torneo");
  revalidatePath("/torneo/check-in");
  revalidatePath("/torneo/reglas");
  revalidatePath("/torneo/inscripcion");
  revalidatePath("/torneo/historial");
  revalidatePath("/admin/torneo");
  revalidatePath("/admin");
  revalidatePath("/");
}

export async function updateTournamentInfo(id: string, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const format = String(formData.get("format") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const maxTeams = Number(formData.get("maxTeams"));
  const prize = String(formData.get("prize") ?? "").trim();
  const patch = String(formData.get("patch") ?? "").trim();
  const checkinCloses = String(formData.get("checkinCloses") ?? "").trim();
  const checkinOpen = formData.get("checkinOpen") === "on";
  if (!name || !format || !date || !prize || !patch || !checkinCloses || !Number.isFinite(maxTeams)) {
    throw new Error("Completa todos los campos del torneo.");
  }
  await prisma.tournament.update({
    where: { id },
    data: { name, format, date, maxTeams, prize, patch, checkinCloses, checkinOpen },
  });
  revalidateTorneo();
}

export async function addTeam(tournamentId: string, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const captain = String(formData.get("captain") ?? "").trim();
  const avgRank = String(formData.get("avgRank") ?? "").trim();
  if (!name || !captain || !avgRank) {
    throw new Error("Completa nombre, capitán y rango medio del equipo.");
  }
  const max = await prisma.tournamentTeam.aggregate({
    where: { tournamentId },
    _max: { order: true },
  });
  await prisma.tournamentTeam.create({
    data: { tournamentId, name, captain, avgRank, order: (max._max.order ?? 0) + 1 },
  });
  revalidateTorneo();
}

export async function updateTeam(id: string, formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const captain = String(formData.get("captain") ?? "").trim();
  const avgRank = String(formData.get("avgRank") ?? "").trim();
  if (!name || !captain || !avgRank) {
    throw new Error("Completa nombre, capitán y rango medio del equipo.");
  }
  await prisma.tournamentTeam.update({ where: { id }, data: { name, captain, avgRank } });
  revalidateTorneo();
}

export async function toggleTeamCheckin(id: string, checkedIn: boolean) {
  await requireAdmin();
  await prisma.tournamentTeam.update({ where: { id }, data: { checkedIn } });
  revalidateTorneo();
}

export async function deleteTeam(id: string) {
  await requireAdmin();
  await prisma.tournamentTeam.delete({ where: { id } });
  revalidateTorneo();
}

export async function updateMatch(id: string, formData: FormData) {
  await requireAdmin();
  const scoreA = Number(formData.get("scoreA"));
  const scoreB = Number(formData.get("scoreB"));
  const state = String(formData.get("state") ?? "pendiente");
  const hora = String(formData.get("hora") ?? "").trim();
  if (!Number.isFinite(scoreA) || !Number.isFinite(scoreB) || !hora) {
    throw new Error("Completa marcador y hora.");
  }
  await prisma.bracketMatch.update({ where: { id }, data: { scoreA, scoreB, state, hora } });
  revalidateTorneo();
}

// Coloca (o quita, si teamId es null) un equipo en una casilla del bracket.
// Si el equipo ya estaba en otra casilla, se limpia de ahí primero (una plaza por equipo).
export async function setBracketSlot(matchId: string, side: "A" | "B", teamId: string | null) {
  await requireAdmin();
  const match = await prisma.bracketMatch.findUniqueOrThrow({ where: { id: matchId } });

  if (teamId) {
    await prisma.bracketMatch.updateMany({
      where: { tournamentId: match.tournamentId, teamAId: teamId },
      data: { teamAId: null },
    });
    await prisma.bracketMatch.updateMany({
      where: { tournamentId: match.tournamentId, teamBId: teamId },
      data: { teamBId: null },
    });
  }

  await prisma.bracketMatch.update({
    where: { id: matchId },
    data: side === "A" ? { teamAId: teamId } : { teamBId: teamId },
  });
  revalidateTorneo();
}

export async function unassignTeamFromBracket(tournamentId: string, teamId: string) {
  await requireAdmin();
  await prisma.bracketMatch.updateMany({
    where: { tournamentId, teamAId: teamId },
    data: { teamAId: null },
  });
  await prisma.bracketMatch.updateMany({
    where: { tournamentId, teamBId: teamId },
    data: { teamBId: null },
  });
  revalidateTorneo();
}

export async function addPastTournament(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const winner = String(formData.get("winner") ?? "").trim();
  const runnerUp = String(formData.get("runnerUp") ?? "").trim();
  const mvp = String(formData.get("mvp") ?? "").trim();
  const teamsCount = Number(formData.get("teamsCount"));
  if (!name || !date || !winner || !runnerUp || !mvp || !Number.isFinite(teamsCount)) {
    throw new Error("Completa todos los campos del torneo pasado.");
  }
  const max = await prisma.pastTournament.aggregate({ _max: { order: true } });
  await prisma.pastTournament.create({
    data: { name, date, winner, runnerUp, mvp, teamsCount, order: (max._max.order ?? 0) + 1 },
  });
  revalidateTorneo();
}

export async function deletePastTournament(id: string) {
  await requireAdmin();
  await prisma.pastTournament.delete({ where: { id } });
  revalidateTorneo();
}
