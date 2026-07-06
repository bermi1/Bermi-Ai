"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { group } from "@/data/site";
import { companies } from "@/data/companies";
import { ButtonLink } from "@/components/ui/button";
import { VMark } from "@/components/Wordmark";

const ease = [0.22, 1, 0.36, 1] as const;

/**
 * Modern light hero: oversized type on a clean white canvas, VIGOR red
 * accents, and a marquee strip of the group's companies.
 */
export function Hero() {
  const names = companies.map((c) => c.name);
  return (
    <section className="relative isolate overflow-hidden bg-white">
      {/* soft red aura + grid texture */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-brand-100/70 blur-3xl animate-gradient-drift" />
        <div className="absolute -left-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-graphite-100 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.5] [background-image:linear-gradient(to_right,#f0f0f2_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f2_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,black,transparent)]" />
      </div>

      <div className="container flex min-h-[88vh] flex-col justify-center pb-16 pt-32">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="mb-8 inline-flex w-fit items-center gap-2.5 rounded-full border border-graphite-200 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-graphite-600 shadow-sm"
        >
          <VMark className="h-4 w-4" />
          {group.descriptor} · Since {group.founded}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.06 }}
          className="max-w-5xl font-heading text-5xl font-bold leading-[1.02] tracking-tight text-graphite-950 sm:text-6xl lg:text-7xl"
        >
          Trusted solutions for{" "}
          <span className="relative whitespace-nowrap text-brand-600">
            life
            <svg
              aria-hidden="true"
              viewBox="0 0 120 12"
              className="absolute -bottom-1 left-0 w-full"
              preserveAspectRatio="none"
            >
              <path
                d="M2 9 Q60 1 118 7"
                fill="none"
                stroke="#d81f26"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>
          </span>{" "}
          and <span className="text-brand-600">business</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.14 }}
          className="mt-7 max-w-2xl text-lg leading-relaxed text-graphite-600 sm:text-xl"
        >
          {group.positioning}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease, delay: 0.22 }}
          className="mt-10 flex flex-wrap gap-3"
        >
          <ButtonLink href="/companies" variant="primary" size="lg">
            Explore our companies
            <ArrowRight className="h-4 w-4" strokeWidth={2} />
          </ButtonLink>
          <ButtonLink href="/about" variant="outline" size="lg">
            About the group
          </ButtonLink>
        </motion.div>

      </div>

      {/* company marquee */}
      <div className="border-y border-graphite-200 bg-graphite-950 py-4">
        <div className="relative overflow-hidden" aria-hidden="true">
          <div className="flex w-max animate-marquee gap-12 whitespace-nowrap pr-12">
            {[...names, ...names].map((n, i) => (
              <span
                key={`${n}-${i}`}
                className="flex items-center gap-12 text-sm font-medium uppercase tracking-[0.14em] text-white/60"
              >
                {n}
                <span className="h-1.5 w-1.5 rounded-full bg-brand-600" />
              </span>
            ))}
          </div>
        </div>
        <span className="sr-only">{names.join(", ")}</span>
      </div>
    </section>
  );
}
