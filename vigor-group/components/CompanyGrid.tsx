"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { companies, activeSectors, type Sector } from "@/data/companies";
import { cn } from "@/lib/utils";
import { CompanyCard } from "@/components/CompanyCard";

type Filter = Sector | "All";

/** Full, filterable grid of all subsidiaries with smooth layout reflow. */
export function CompanyGrid() {
  const [filter, setFilter] = useState<Filter>("All");

  const filters: Filter[] = useMemo(() => ["All", ...activeSectors], []);
  const visible = useMemo(
    () => (filter === "All" ? companies : companies.filter((c) => c.sector === filter)),
    [filter],
  );

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter companies by sector"
        className="mb-8 flex flex-wrap gap-2"
      >
        {filters.map((f) => {
          const active = f === filter;
          return (
            <button
              key={f}
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(f)}
              className={cn(
                "relative rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2",
                active ? "text-white" : "text-ink-700 hover:text-ink-900",
              )}
            >
              {active && (
                <motion.span
                  layoutId="chip-active"
                  className="absolute inset-0 rounded-full bg-ink-800"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <span className="relative z-10">{f}</span>
            </button>
          );
        })}
      </div>

      <LayoutGroup>
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((company) => (
              <CompanyCard key={company.slug} company={company} />
            ))}
          </AnimatePresence>
        </motion.div>
      </LayoutGroup>

      <p className="mt-8 text-sm text-ink-500" aria-live="polite">
        Showing {visible.length} of {companies.length} companies
        {filter !== "All" ? ` in ${filter}` : ""}.
      </p>
    </div>
  );
}
