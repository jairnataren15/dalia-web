import { NextResponse } from "next/server";
import { DISCORD_INVITE_CODE } from "@/lib/channels";

// Contadores públicos del servidor vía la API de invitaciones (sin bot ni token).

export async function GET() {
  try {
    const res = await fetch(
      `https://discord.com/api/v10/invites/${DISCORD_INVITE_CODE}?with_counts=true`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) throw new Error(`Discord respondió ${res.status}`);
    const data = await res.json();

    const icon = data.guild?.icon
      ? `https://cdn.discordapp.com/icons/${data.guild.id}/${data.guild.icon}.png?size=128`
      : null;

    return NextResponse.json({
      name: data.guild?.name ?? "DALIA.EXE",
      members: data.approximate_member_count ?? 0,
      online: data.approximate_presence_count ?? 0,
      icon,
    });
  } catch {
    return NextResponse.json(
      { name: "DALIA.EXE", members: 0, online: 0, icon: null, error: "No se pudo consultar Discord" },
      { status: 502 }
    );
  }
}
