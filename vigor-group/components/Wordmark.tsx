import { cn } from "@/lib/utils";

/**
 * PLACEHOLDER wordmark — a typographic lockup until Vigor Group supplies a
 * real logo. The "V" monogram sits in a gold roundel; the group name in the
 * heading serif reinforces the heritage positioning.
 */
export function Wordmark({
  tone = "ink",
  className,
}: {
  tone?: "ink" | "light";
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        aria-hidden="true"
        className="grid h-9 w-9 place-items-center rounded-xl bg-gold-400 font-heading text-lg font-bold text-ink-900"
      >
        V
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading text-lg font-semibold tracking-tight",
            tone === "ink" ? "text-ink-900" : "text-white",
          )}
        >
          Vigor Group
        </span>
        <span
          className={cn(
            "text-[10px] font-medium uppercase tracking-[0.18em]",
            tone === "ink" ? "text-ink-500" : "text-white/70",
          )}
        >
          of Companies
        </span>
      </span>
    </span>
  );
}
