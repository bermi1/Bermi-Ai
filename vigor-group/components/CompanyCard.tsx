"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { Company } from "@/data/companies";
import { sectorMeta } from "@/data/site";
import { Icon } from "@/components/Icon";
import { Badge } from "@/components/ui/badge";

export function CompanyCard({ company }: { company: Company }) {
  const meta = sectorMeta[company.sector];
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className="group h-full"
    >
      <Link
        href={`/companies/${company.slug}`}
        className="flex h-full flex-col rounded-2xl border border-ink-900/10 bg-white p-6 shadow-card transition-shadow duration-200 hover:shadow-lift focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
      >
        <div className="mb-5 flex items-center justify-between">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-ink-800/8 text-ink-700 transition-colors group-hover:bg-gold-100 group-hover:text-gold-700">
            <Icon name={meta.icon} className="h-5 w-5" />
          </span>
          <Badge tone="muted">{company.sector}</Badge>
        </div>

        <h3 className="font-heading text-lg font-semibold leading-snug text-ink-900">
          {company.name}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-600">
          {company.description}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-ink-900/8 pt-4">
          <span className="text-[11px] font-medium uppercase tracking-[0.12em] text-gold-700">
            Part of Vigor Group
          </span>
          <span className="inline-flex items-center gap-1 text-sm font-medium text-ink-800 transition-transform group-hover:translate-x-0.5">
            View
            <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
