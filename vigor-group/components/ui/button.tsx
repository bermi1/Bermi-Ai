import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-sand-50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-ink-800 text-sand-50 hover:bg-ink-900 hover:shadow-lift",
        gold: "bg-gold-400 text-ink-900 hover:bg-gold-500 hover:shadow-lift",
        outline:
          "border border-ink-800/25 bg-transparent text-ink-800 hover:border-ink-800 hover:bg-ink-800/5",
        ghost: "bg-transparent text-ink-800 hover:bg-ink-800/5",
        onDark:
          "border border-white/30 bg-white/10 text-white backdrop-blur hover:bg-white/20",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-7 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type BaseProps = VariantProps<typeof buttonVariants> & { className?: string };

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    BaseProps {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
  );
}

interface ButtonLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
    BaseProps {
  href: string;
}

export function ButtonLink({
  className,
  variant,
  size,
  href,
  ...props
}: ButtonLinkProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
  const external = href.startsWith("http") || href.startsWith("mailto:");
  if (external) {
    return <a href={href} className={classes} {...props} />;
  }
  return <Link href={href} className={classes} {...props} />;
}

export { buttonVariants };
