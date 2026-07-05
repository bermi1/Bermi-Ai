"use client";

import Link from "next/link";

/** Shared dark, single-focus shell for the auth pages — matches the landing
 * page's visual language exactly. */
export default function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#0d0c0b] px-5 py-10 text-stone-200 bermi-grid">
      <div
        className="pointer-events-none absolute left-1/2 top-[-20%] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-accent/15 blur-[130px] bermi-glow"
        aria-hidden
      />
      <div className="relative w-full max-w-sm">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent font-serif text-2xl font-bold text-white">
              B
            </span>
          </Link>
          <h1 className="mt-5 text-2xl font-semibold tracking-tight text-white">{title}</h1>
          <p className="mt-1.5 text-sm text-stone-400">{subtitle}</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur">
          {children}
        </div>

        {footer && <div className="mt-6 text-center text-sm text-stone-400">{footer}</div>}

        <p className="mt-6 text-center text-xs text-stone-600">
          <Link href="/" className="transition-colors hover:text-stone-400">
            ← Back to home
          </Link>
        </p>
      </div>
    </div>
  );
}

export const authInput =
  "w-full rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-stone-500 focus:border-accent/60 focus:bg-white/[0.06]";

export const authButton =
  "w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50";
