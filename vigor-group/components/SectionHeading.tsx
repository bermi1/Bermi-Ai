import { cn } from "@/lib/utils";

export function Eyebrow({ children, dark }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <span
      className={cn(
        "text-xs font-semibold uppercase tracking-[0.16em]",
        dark ? "text-brand-200" : "text-brand-700",
      )}
    >
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  dark = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <Eyebrow dark={dark}>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          "mt-3 font-heading text-3xl font-semibold tracking-tight sm:text-4xl",
          dark ? "text-white" : "text-graphite-900",
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            "mt-4 text-lg leading-relaxed",
            dark ? "text-graphite-100/80" : "text-graphite-600",
          )}
        >
          {intro}
        </p>
      )}
    </div>
  );
}
