"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import DemoChat from "@/components/landing/DemoChat";
import Reveal from "@/components/landing/Reveal";
import { getToken } from "@/lib/api";

const FEATURES = [
  {
    icon: "❝",
    title: "Answers you can trust, with citations",
    body: "Upload your documents and Bermi AI answers from them — every claim linked to the exact page and section. No more guessing where the answer came from.",
  },
  {
    icon: "🗣",
    title: "Fluent in English and Swahili",
    body: "Write how you speak. Bermi AI replies in your language with natural, professional phrasing tuned for how work actually happens across the region.",
  },
  {
    icon: "✍",
    title: "From prompt to polished document",
    body: "Ask for a proposal, letter, or report and get a ready-to-submit Word document following a proven structure — not a rough first draft.",
  },
  {
    icon: "◎",
    title: "It learns your niche",
    body: "A short onboarding builds a private profile of who you are and what you do, so every answer is shaped around your goals — not generic advice.",
  },
];

const STATS = [
  { value: "Africa-first", label: "Built for how the region works" },
  { value: "EN + SW", label: "Bilingual from day one" },
  { value: "Cited", label: "Grounded in your documents" },
  { value: "Free", label: "Start solo, no organisation needed" },
];

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent font-serif text-lg font-bold text-white">
        B
      </div>
      <span className="text-[17px] font-semibold tracking-tight text-white">Bermi AI</span>
    </div>
  );
}

export default function LandingPage() {
  const [signedIn, setSignedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setSignedIn(!!getToken());
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const primaryHref = signedIn ? "/app" : "/register";

  return (
    <div className="min-h-screen bg-[#0d0c0b] text-stone-200">
      {/* ── Nav ─────────────────────────────────────────── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled ? "border-b border-white/10 bg-[#0d0c0b]/85 backdrop-blur" : ""
        }`}
      >
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <Logo />
          <div className="flex items-center gap-2">
            <a
              href="#features"
              className="hidden rounded-lg px-3 py-2 text-sm text-stone-300 transition-colors hover:text-white sm:block"
            >
              Features
            </a>
            <a
              href="#demo"
              className="hidden rounded-lg px-3 py-2 text-sm text-stone-300 transition-colors hover:text-white sm:block"
            >
              Try it
            </a>
            {signedIn ? (
              <Link
                href="/app"
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
              >
                Open app
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-lg px-3 py-2 text-sm text-stone-200 transition-colors hover:text-white"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* ── Hero ────────────────────────────────────────── */}
      <section className="relative overflow-hidden bermi-grid">
        {/* Ambient glows */}
        <div
          className="pointer-events-none absolute left-1/2 top-[-10%] h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-accent/20 blur-[130px] bermi-glow"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-[-10%] top-[30%] h-[360px] w-[360px] rounded-full bg-[#e6a883]/10 blur-[110px]"
          aria-hidden
        />

        <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-32 sm:pt-40">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-stone-300">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              The AI operating system for Africa
            </span>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-6xl">
              Intelligence that speaks
              <br />
              <span className="bermi-gradient-text">your language.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-stone-400 sm:text-lg">
              Bermi AI is an Africa-first assistant that answers from your own documents with
              real citations, writes ready-to-submit work, and understands your niche — in
              English and Swahili.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="#demo"
                className="w-full rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover hover:shadow-accent/30 sm:w-auto"
              >
                Try Bermi AI — free
              </a>
              <Link
                href={primaryHref}
                className="w-full rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-stone-100 transition-colors hover:bg-white/5 sm:w-auto"
              >
                {signedIn ? "Open the app" : "Create your account"}
              </Link>
            </div>
            <p className="mt-4 text-xs text-stone-500">
              No credit card. No organisation required. Start chatting in seconds.
            </p>
          </Reveal>

          {/* Embedded live demo */}
          <div id="demo" className="scroll-mt-24">
            <Reveal className="mt-14" delay={120}>
              <DemoChat />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Stats strip ─────────────────────────────────── */}
      <section className="border-y border-white/10 bg-white/[0.02]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-8 px-5 py-10 sm:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.value} delay={i * 80} className="text-center">
              <div className="text-2xl font-semibold text-white sm:text-3xl">{s.value}</div>
              <div className="mt-1 text-xs text-stone-400">{s.label}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────── */}
      <section id="features" className="mx-auto max-w-6xl px-5 py-24">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Not another chatbot.
          </h2>
          <p className="mt-4 text-stone-400">
            Bermi AI is built for real work — grounded, accountable, and tuned to the way
            things actually get done across the region.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 2) * 100}>
              <div className="group h-full rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-transparent p-6 transition-colors hover:border-accent/30">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/15 text-xl text-accent">
                  {f.icon}
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-400">{f.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Closing CTA ─────────────────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/10">
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/15 blur-[120px]"
          aria-hidden
        />
        <Reveal className="relative mx-auto max-w-2xl px-5 py-24 text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Start with a single question.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-stone-400">
            Create a free account in seconds — as an individual or a team. Your work,
            grounded in your world.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href={primaryHref}
              className="w-full rounded-xl bg-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-accent/20 transition-all hover:bg-accent-hover sm:w-auto"
            >
              {signedIn ? "Open the app" : "Get started free"}
            </Link>
            <a
              href="#demo"
              className="w-full rounded-xl border border-white/15 px-6 py-3 text-sm font-semibold text-stone-100 transition-colors hover:bg-white/5 sm:w-auto"
            >
              Try the demo
            </a>
          </div>
        </Reveal>
      </section>

      {/* ── Footer ──────────────────────────────────────── */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
          <Logo />
          <p className="text-xs text-stone-500">
            Built by Bemri Tech Company · Africa-first AI · © {new Date().getFullYear()}
          </p>
          <div className="flex gap-4 text-xs text-stone-400">
            <Link href="/login" className="transition-colors hover:text-white">
              Log in
            </Link>
            <Link href="/register" className="transition-colors hover:text-white">
              Sign up
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
