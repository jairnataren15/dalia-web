"use client";

import { useMemo, useState } from "react";
import { champIcon } from "@/lib/data";
import type { ChampionSummary } from "@/lib/champions";

export default function AvatarPicker({
  champions,
  initial,
}: {
  champions: ChampionSummary[];
  initial: string | null;
}) {
  const [selected, setSelected] = useState(initial ?? "");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return champions;
    return champions.filter((c) => c.name.toLowerCase().includes(q));
  }, [champions, query]);

  return (
    <div>
      <input type="hidden" name="avatarChamp" value={selected} />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar campeón…"
        className="mb-3 w-full rounded-lg border border-line bg-raised px-3 py-2 text-sm text-ink outline-none transition-colors placeholder:text-faint focus:border-rose"
      />
      <div className="grid max-h-72 grid-cols-6 gap-2 overflow-y-auto rounded-lg border border-line bg-raised p-3 sm:grid-cols-8 lg:grid-cols-10">
        {filtered.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setSelected(c.id)}
            title={c.name}
            className={`overflow-hidden rounded-lg ring-2 transition-colors ${
              selected === c.id ? "ring-rose" : "ring-transparent hover:ring-line"
            }`}
          >
            <img src={champIcon(c.id)} alt={c.name} className="h-full w-full" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  );
}
