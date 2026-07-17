import { TIER_COLORS, type Tier } from "@/lib/data";

export function RankBadge({ tier, division, lp }: { tier: Tier; division?: string; lp?: number }) {
  const color = TIER_COLORS[tier];
  return (
    <span className="inline-flex items-center gap-2">
      <span
        className="inline-block h-2.5 w-2.5 rotate-45"
        style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}66` }}
      />
      <span className="font-medium" style={{ color }}>
        {tier}
        {division ? ` ${division}` : ""}
      </span>
      {lp !== undefined && <span className="tnum text-xs text-dim">{lp} LP</span>}
    </span>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
}) {
  return (
    <header className="mb-8">
      <p className="mb-1 font-display text-xs font-semibold uppercase tracking-[0.2em] text-rose">
        {eyebrow}
      </p>
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
      {lede && <p className="mt-2 max-w-2xl text-sm text-dim">{lede}</p>}
    </header>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-line bg-surface ${className}`}>
      {children}
    </div>
  );
}
