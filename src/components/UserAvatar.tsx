import { champIcon } from "@/lib/data";

export default function UserAvatar({
  avatarChamp,
  image,
  name,
  size = 40,
}: {
  avatarChamp?: string | null;
  image?: string | null;
  name?: string | null;
  size?: number;
}) {
  const src = avatarChamp ? champIcon(avatarChamp) : image;

  if (src) {
    return (
      <img
        src={src}
        alt={name ?? ""}
        style={{ width: size, height: size }}
        className="shrink-0 rounded-full ring-1 ring-rose/40 object-cover"
      />
    );
  }

  return (
    <span
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full bg-rose-soft text-rose ring-1 ring-rose/40"
    >
      {(name ?? "?").slice(0, 1).toUpperCase()}
    </span>
  );
}
