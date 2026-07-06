import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({
  className,
  tone = "ink",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: "ink" | "gold" | "muted" }) {
  const tones = {
    ink: "bg-graphite-800/8 text-graphite-800",
    gold: "bg-brand-100 text-brand-800",
    muted: "bg-graphite-900/5 text-graphite-700",
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
