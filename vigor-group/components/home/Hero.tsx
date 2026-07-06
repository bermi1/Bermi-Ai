"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { group } from "@/data/site";
import { ButtonLink } from "@/components/ui/button";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-graphite-900 text-white">
      {/* Animated gradient field — slow parallax drift, not heavy video. */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-graphite-900 via-graphite-800 to-graphite-950" />
        <div className="absolute -left-24 top-0 h-[42rem] w-[42rem] rounded-full bg-graphite-500/25 blur-3xl animate-gradient-drift" />
        <div
          className="absolute -right-32 bottom-[-8rem] h-[38rem] w-[38rem] rounded-full bg-brand-500/20 blur-3xl animate-gradient-drift"
          style={{ animationDelay: "-6s" }}
        />
        {/* subtle grid texture */}
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:56px_56px]" />
      </div>

      <div className="container flex min-h-[92vh] flex-col justify-center py-32">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.16em] text-brand-200 backdrop-blur"
        >
          {group.descriptor} · Since {group.founded}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.05 }}
          className="max-w-4xl font-heading text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl"
        >
          {group.tagline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.12 }}
          className="mt-6 max-w-2xl text-lg leading-relaxed text-graphite-100/80"
        >
          {group.positioning}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.2 }}
          className="mt-9 flex flex-wrap gap-3"
        >
          <ButtonLink href="/companies" variant="gold" size="lg">
            Explore our companies
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </ButtonLink>
          <ButtonLink href="/about" variant="onDark" size="lg">
            About the group
          </ButtonLink>
        </motion.div>

        <motion.dl
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease, delay: 0.35 }}
          className="mt-16 grid max-w-xl grid-cols-3 gap-6 border-t border-white/10 pt-8"
        >
          {[
            { n: `${group.stats.companies}`, l: "Companies" },
            { n: `${group.stats.employees.toLocaleString()}+`, l: "Employees" },
            { n: `${group.stats.countries}`, l: "Countries" },
          ].map((s) => (
            <div key={s.l}>
              <dt className="font-heading text-3xl font-semibold text-white">{s.n}</dt>
              <dd className="mt-1 text-sm text-graphite-100/70">{s.l}</dd>
            </div>
          ))}
        </motion.dl>
      </div>
    </section>
  );
}
