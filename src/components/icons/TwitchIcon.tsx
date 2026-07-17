export default function TwitchIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M4.32 2 2 7.523v13.229h6.11V24h3.573L15 20.752h4.966L23.7 17V2H4.32Zm2.083 2.017h15.219v11.62l-3.062 3.062H14.63l-3.243 3.243v-3.243H6.403V4.017Zm3.573 9.523h2.041V7.523H9.976v6.017Zm5.615 0h2.04V7.523h-2.04v6.017Z" />
    </svg>
  );
}
