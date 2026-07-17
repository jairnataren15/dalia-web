"use client";

import { useEffect, useState } from "react";

/** Cuenta atrás al próximo sábado 18:00 (día del torneo). */
export default function Countdown() {
  const [label, setLabel] = useState("—");

  useEffect(() => {
    const target = nextSaturday18h();
    const tick = () => {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setLabel("¡En juego!");
        return;
      }
      const d = Math.floor(diff / 86_400_000);
      const h = Math.floor((diff % 86_400_000) / 3_600_000);
      const m = Math.floor((diff % 3_600_000) / 60_000);
      setLabel(d > 0 ? `en ${d}d ${h}h ${m}m` : `en ${h}h ${m}m`);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  return <p className="tnum text-xs text-dim">{label}</p>;
}

function nextSaturday18h(): Date {
  const now = new Date();
  const d = new Date(now);
  d.setHours(18, 0, 0, 0);
  const day = d.getDay(); // 6 = sábado
  let add = (6 - day + 7) % 7;
  if (add === 0 && d.getTime() <= now.getTime()) add = 7;
  d.setDate(d.getDate() + add);
  return d;
}
