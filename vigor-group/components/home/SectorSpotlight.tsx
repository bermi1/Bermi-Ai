"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { spotlightSectors, sectorMeta } from "@/data/site";
import { companiesBySector } from "@/data/companies";
import { Icon } from "@/components/Icon";
import { cn } from "@/lib/utils";

const AUTO_MS = 5000;

export function SectorSpotlight() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = spotlightSectors.length;

  const go = useCallback((dir: number) => {
    setIndex((i) => (i + dir + count) % count);
  }, [count]);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % count), AUTO_MS);
    return () => clearInterval(id);
  }, [paused, count]);

  const sector = spotlightSectors[index];
  const meta = sectorMeta[sector];
  const members = companiesBySector(sector);

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-graphite-900/10 bg-graphite-900 text-white"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Sector spotlight"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-1 transition-colors duration-500"
        style={{ backgroundColor: meta.color }}
      />
      <div
        aria-hidden="true"
        className="absolute -right-24 -top-24 h-80 w-80 rounded-full blur-3xl transition-colors duration-500"
        style={{ backgroundColor: `${meta.color}33` }}
      />
      <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={sector}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <span
              className="grid h-14 w-14 place-items-center rounded-2xl text-white"
              style={{ backgroundColor: `${meta.color}40` }}
            >
              <Icon name={meta.icon} className="h-7 w-7" />
            </span>
            <p
              className="mt-6 text-xs font-medium uppercase tracking-[0.18em]"
              style={{ color: meta.color }}
            >
              Sector {index + 1} of {count}
            </p>
            <h3 className="mt-2 font-heading text-3xl font-semibold sm:text-4xl">
              {meta.label}
            </h3>
            <p className="mt-4 max-w-md text-graphite-100/80">{meta.blurb}</p>
            <Link
              href="/companies"
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-200 hover:text-white"
            >
              View {meta.label.toLowerCase()} companies
              <ArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.ul
            key={`${sector}-list`}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-2.5"
          >
            {members.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/companies/${c.slug}`}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm transition-colors hover:border-brand-300/40 hover:bg-white/10"
                >
                  <span className="font-medium">{c.name}</span>
                  <ArrowRight className="h-4 w-4 text-brand-200" strokeWidth={1.8} />
                </Link>
              </li>
            ))}
          </motion.ul>
        </AnimatePresence>
      </div>

      <div className="relative flex items-center justify-between border-t border-white/10 px-8 py-4 sm:px-12">
        <div className="flex gap-2" role="tablist" aria-label="Choose sector">
          {spotlightSectors.map((s, i) => (
            <button
              key={s}
              role="tab"
              aria-selected={i === index}
              aria-label={`Show ${sectorMeta[s].label}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-8 bg-brand-300" : "w-3 bg-white/25 hover:bg-white/50",
              )}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous sector"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/80 hover:border-brand-300 hover:text-white"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next sector"
            className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/80 hover:border-brand-300 hover:text-white"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
