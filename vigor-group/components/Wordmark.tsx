import { cn } from "@/lib/utils";

/**
 * VIGOR wordmark — a faithful re-creation of the official logo lockup:
 * a red "V" mark (with the silver swoosh accent), the VIGOR wordmark, and the
 * "A Turky's Group of Companies · Since 1980" descriptor.
 * Replace the SVG with the supplied vector logo file when available.
 */
export function VMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 92" className={className} role="img" aria-label="VIGOR">
      {/* silver swoosh accent (behind) */}
      <path
        d="M30 6 L58 6 L44 34 Z"
        fill="#b8babf"
      />
      {/* red V */}
      <path
        d="M12 8 L50 84 L88 8"
        fill="none"
        stroke="#d81f26"
        strokeWidth="17"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Wordmark({
  tone = "ink",
  className,
}: {
  tone?: "ink" | "light";
  className?: string;
}) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <VMark className="h-9 w-9" />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-heading text-xl font-bold tracking-tight",
            tone === "ink" ? "text-brand-600" : "text-white",
          )}
        >
          VIGOR
        </span>
        <span
          className={cn(
            "mt-0.5 text-[9px] font-semibold uppercase tracking-[0.14em]",
            tone === "ink" ? "text-graphite-500" : "text-white/70",
          )}
        >
          A Turky&apos;s Group · Since 1980
        </span>
      </span>
    </span>
  );
}
