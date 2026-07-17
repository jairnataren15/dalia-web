import LiveStatus from "@/components/LiveStatus";
import LoginButton from "@/components/LoginButton";
import DiscordIcon from "@/components/icons/DiscordIcon";
import { DISCORD_URL } from "@/lib/channels";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-base/85 px-4 pl-16 backdrop-blur lg:px-6">
      <LiveStatus />
      <div className="flex items-center gap-3">
        <a
          href={DISCORD_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 rounded-lg border border-[#5865f2]/50 bg-[#5865f2]/10 px-4 py-1.5 font-display text-sm font-semibold text-[#7d88f5] transition-colors hover:bg-[#5865f2]/20 sm:flex"
        >
          <DiscordIcon className="h-4 w-4" />
          Discord
        </a>
        <LoginButton />
      </div>
    </header>
  );
}
