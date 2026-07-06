import { cn } from "@/lib/utils";
import { Icon } from "@/components/Icon";

/**
 * PLACEHOLDER visual — a branded gradient panel standing in for real
 * photography (which we do NOT fabricate). Carries descriptive alt-equivalent
 * text via `label`/aria-label. Pass `color` to tint it with a unit's accent so
 * each subsidiary keeps its own identity. Swap for <Image> when assets exist.
 */
export function PlaceholderImage({
  label,
  icon = "sparkles",
  className,
  aspect = "aspect-[4/3]",
  color = "#d81f26",
}: {
  label: string;
  icon?: string;
  className?: string;
  aspect?: string;
  color?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`Placeholder image: ${label}`}
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-2xl",
        aspect,
        className,
      )}
      style={{
        backgroundImage: `linear-gradient(135deg, ${color}f2, #16171b)`,
      }}
    >
      <div
        aria-hidden="true"
        className="absolute -right-10 -top-10 h-40 w-40 rounded-full blur-2xl"
        style={{ backgroundColor: `${color}55` }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.09] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:40px_40px]"
      />
      <div className="relative flex flex-col items-center gap-3 px-6 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/15 text-white">
          <Icon name={icon} className="h-7 w-7" />
        </span>
        <span className="text-xs font-medium uppercase tracking-[0.14em] text-white/80">
          {label}
        </span>
      </div>
    </div>
  );
}
