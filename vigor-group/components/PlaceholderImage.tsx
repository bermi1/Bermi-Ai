import { cn } from "@/lib/utils";
import { Icon } from "@/components/Icon";

/**
 * PLACEHOLDER visual — a branded gradient panel standing in for real
 * photography (which the brief says NOT to fabricate). Carries descriptive
 * alt-equivalent text via `label` and an aria-label so it stays accessible.
 * Swap for a next/image <Image> when real assets are supplied.
 */
export function PlaceholderImage({
  label,
  icon = "sparkles",
  className,
  aspect = "aspect-[4/3]",
}: {
  label: string;
  icon?: string;
  className?: string;
  aspect?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`Placeholder image: ${label}`}
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-ink-800 to-ink-950",
        aspect,
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-500/25 blur-2xl"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.08] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:40px_40px]"
      />
      <div className="relative flex flex-col items-center gap-3 px-6 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/10 text-gold-200">
          <Icon name={icon} className="h-7 w-7" />
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-sand-100/70">
          {label}
        </span>
      </div>
    </div>
  );
}
