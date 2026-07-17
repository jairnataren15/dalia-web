"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import DiscordIcon from "@/components/icons/DiscordIcon";
import TwitchIcon from "@/components/icons/TwitchIcon";

interface NavItem {
  href: string;
  label: string;
  icon: string;
  badge?: string;
}

interface NavGroup {
  title: string | null;
  items: NavItem[];
}

const NAV: NavGroup[] = [
  {
    title: null,
    items: [
      { href: "/verificar", label: "Verificar cuenta", icon: "✿", badge: "Tiers" },
    ],
  },
  {
    title: "Stream",
    items: [
      { href: "/", label: "Inicio", icon: "⌂" },
      { href: "/tienda", label: "Tienda", icon: "❖" },
      { href: "/predicciones", label: "Predicciones", icon: "◈" },
      { href: "/faq", label: "FAQ", icon: "?" },
    ],
  },
  {
    title: "Eventos",
    items: [
      { href: "/torneo", label: "Copa DALIA.EXE", icon: "♛", badge: "En vivo" },
      { href: "/calendario", label: "Calendario", icon: "▦" },
    ],
  },
  {
    title: "Ranking",
    items: [
      { href: "/ranking/lol", label: "LoL", icon: "▲" },
      { href: "/ranking/equipos", label: "Equipos", icon: "⬟" },
      { href: "/ranking/puntos", label: "Puntos", icon: "✦" },
    ],
  },
  {
    title: "Comunidad",
    items: [{ href: "/lfg", label: "Buscar equipo", icon: "◎" }],
  },
];

const ADMIN_GROUP: NavGroup = {
  title: "Staff",
  items: [{ href: "/admin", label: "Admin", icon: "⚑" }],
};

function NavLinks({
  onNavigate,
  isAdmin,
  verified,
}: {
  onNavigate?: () => void;
  isAdmin?: boolean;
  verified?: boolean;
}) {
  const pathname = usePathname();
  const groups = isAdmin ? [...NAV, ADMIN_GROUP] : NAV;

  return (
    <nav className="flex-1 overflow-y-auto px-3 py-4">
      {groups.map((group, gi) => (
        <div key={gi} className="mb-5">
          {group.title && (
            <p className="px-3 pb-2 font-display text-[11px] font-semibold uppercase tracking-[0.18em] text-faint">
              {group.title}
            </p>
          )}
          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const isVerifyItem = item.href === "/verificar";
              const label = isVerifyItem && verified ? "Cuenta verificada" : item.label;
              const badge = isVerifyItem && verified ? "✓" : item.badge;
              const badgeCls =
                isVerifyItem && verified
                  ? "bg-live-soft text-live"
                  : "bg-rose/15 text-rose";
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={`group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? "text-ink"
                        : "text-dim hover:bg-hover hover:text-ink"
                    }`}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-lg bg-rose-soft ring-1 ring-rose/40"
                        transition={{ type: "spring", stiffness: 400, damping: 32 }}
                      />
                    )}
                    <span
                      className={`relative w-5 text-center text-base ${
                        active ? "text-rose" : "text-faint group-hover:text-rose"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className={`relative font-medium ${isVerifyItem && verified ? "text-live" : ""}`}>
                      {label}
                    </span>
                    {badge && (
                      <span className={`relative ml-auto rounded px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badgeCls}`}>
                        {badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3 px-5 py-5">
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-soft text-xl text-rose ring-1 ring-rose/40">
        ✿
      </span>
      <span>
        <span className="block font-display text-lg font-bold leading-tight tracking-wide">
          DALIA<span className="text-rose">.EXE</span>
        </span>
        <span className="block text-[11px] uppercase tracking-[0.22em] text-faint">
          Comunidad oficial
        </span>
      </span>
    </Link>
  );
}

export default function Sidebar({
  isAdmin,
  verified,
}: {
  isAdmin?: boolean;
  verified?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Escritorio */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-line bg-surface lg:flex">
        <Brand />
        <NavLinks isAdmin={isAdmin} verified={verified} />
        <div className="border-t border-line px-5 py-4">
          <div className="mb-2 flex gap-3 text-xs font-semibold">
            <a
              href="https://www.twitch.tv/dalia3margaret"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#a970ff] hover:underline"
            >
              <TwitchIcon className="h-3.5 w-3.5" />
              Twitch
            </a>
            <a
              href="https://discord.gg/SkXgFQrpgx"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-[#5865f2] hover:underline"
            >
              <DiscordIcon className="h-3.5 w-3.5" />
              Discord
            </a>
          </div>
          <p className="text-[11px] text-faint">Hecho con ✿ para la comunidad</p>
        </div>
      </aside>

      {/* Botón móvil */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Abrir menú"
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface text-ink lg:hidden"
      >
        ☰
      </button>

      {/* Menú móvil */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              transition={{ type: "spring", stiffness: 380, damping: 36 }}
              className="fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-line bg-surface lg:hidden"
            >
              <Brand />
              <NavLinks onNavigate={() => setOpen(false)} isAdmin={isAdmin} verified={verified} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
