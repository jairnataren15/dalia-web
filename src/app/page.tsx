import Link from "next/link";
import Reveal from "@/components/Reveal";
import { Card } from "@/components/ui";
import Countdown from "@/components/Countdown";
import ChannelCards from "@/components/ChannelCards";
import { DISCORD_URL } from "@/lib/channels";
import {
  champSplash,
  champIcon,
  latestVideos,
  members,
  rankLabel,
  activeTournament,
} from "@/lib/data";

export default function Home() {
  const dalia = members.find((m) => m.id === "dalia")!;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 lg:px-8">
      {/* Hero */}
      <Reveal>
        <section className="relative overflow-hidden rounded-2xl border border-line">
          <img
            src={champSplash(dalia.mains[0], 0)}
            alt=""
            className="absolute inset-0 h-full w-full object-cover object-[center_20%] opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-base via-base/80 to-transparent" />
          <div className="relative px-6 py-12 sm:px-10 sm:py-16">
            <p className="mb-2 font-display text-xs font-semibold uppercase tracking-[0.25em] text-rose">
              Bienvenido a DALIA.EXE
            </p>
            <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              La comunidad de{" "}
              <span className="text-rose">Dalia</span> florece aquí
            </h1>
            <p className="mt-3 max-w-lg text-sm text-dim sm:text-base">
              Rankings de LoL, torneos de la comunidad, sorteos y predicciones.
              Todo lo que pasa dentro y fuera del directo, en un solo sitio.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/verificar"
                className="rose-glow rounded-lg bg-rose px-5 py-2.5 font-display text-sm font-semibold text-base transition-colors hover:bg-rose-hi"
              >
                Verificar mi cuenta
              </Link>
              <Link
                href="/torneo"
                className="rounded-lg border border-line bg-surface/80 px-5 py-2.5 font-display text-sm font-semibold text-ink backdrop-blur transition-colors hover:bg-hover"
              >
                Ver la Copa DALIA.EXE ♛
              </Link>
              <a
                href={DISCORD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-[#5865f2]/50 bg-[#5865f2]/15 px-5 py-2.5 font-display text-sm font-semibold text-[#8f99ff] backdrop-blur transition-colors hover:bg-[#5865f2]/25"
              >
                Unirme al Discord
              </a>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Fila de stats rápidas */}
      <Reveal delay={0.1}>
        <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Card className="p-4">
            <p className="text-xs uppercase tracking-wider text-faint">Racha de Dalia</p>
            <p className="mt-1 font-display text-2xl font-bold text-live">
              {dalia.streak} victorias
            </p>
            <p className="text-xs text-dim">seguidas en ranked</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs uppercase tracking-wider text-faint">Rango actual</p>
            <p className="mt-1 font-display text-2xl font-bold text-[#5e9ee6]">
              {rankLabel(dalia)}
            </p>
            <p className="tnum text-xs text-dim">{dalia.lp} LP · {Math.round((dalia.wins / (dalia.wins + dalia.losses)) * 100)}% WR</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs uppercase tracking-wider text-faint">Miembros verificados</p>
            <p className="mt-1 font-display text-2xl font-bold">{members.length}</p>
            <p className="text-xs text-dim">en el ranking DALIA.EXE</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs uppercase tracking-wider text-faint">Próximo evento</p>
            <p className="mt-1 font-display text-lg font-bold text-gold">
              {activeTournament.name}
            </p>
            <Countdown />
          </Card>
        </section>
      </Reveal>

      {/* Canales reales */}
      <Reveal delay={0.05}>
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold">Canales oficiales</h2>
          <ChannelCards />
        </section>
      </Reveal>

      {/* Últimos vídeos */}
      <Reveal delay={0.05}>
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold">Últimos vídeos</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {latestVideos.map((v) => (
              <Card key={v.title} className="group overflow-hidden transition-colors hover:bg-hover">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={champSplash(v.champ, 0)}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-[11px] font-semibold">
                    {v.duration}
                  </span>
                  <span className="absolute left-2 top-2 rounded bg-rose px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-base">
                    #{v.category}
                  </span>
                </div>
                <div className="p-3">
                  <p className="line-clamp-2 text-sm font-semibold leading-snug">
                    {v.title}
                  </p>
                  <p className="mt-1 text-xs text-dim">{v.views} visitas</p>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Top 3 del ranking como gancho */}
      <Reveal delay={0.05}>
        <section className="my-10 pb-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">Top DALIA.EXE</h2>
            <Link href="/ranking/lol" className="text-sm font-medium text-rose hover:text-rose-hi">
              Ver ranking completo →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {members.slice(0, 3).map((m, i) => (
              <Card key={m.id} className="relative overflow-hidden p-5">
                <span className="absolute -right-2 -top-4 font-display text-7xl font-bold text-line select-none">
                  {i + 1}
                </span>
                <div className="relative flex items-center gap-3">
                  <img
                    src={champIcon(m.mains[0])}
                    alt={m.mains[0]}
                    className="h-12 w-12 rounded-lg border border-line"
                  />
                  <div>
                    <p className="font-display font-bold">
                      {m.riotId}
                      <span className="ml-1 text-xs font-normal text-faint">#{m.tag}</span>
                    </p>
                    <p className="text-sm text-dim">{rankLabel(m)} · <span className="tnum">{m.lp} LP</span></p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </Reveal>
    </div>
  );
}
