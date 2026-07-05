import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "ink",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: "ink" | "gold" | "muted" }) {
  const tones = {
    ink: "bg-ink-800/8 text-ink-800",
    gold: "bg-gold-100 text-gold-800",
    muted: "bg-ink-900/5 text-ink-700",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
