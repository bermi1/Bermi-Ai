"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { Search, X } from "lucide-react";
import { companies, activeSectors, type Sector } from "@/data/companies";
import { cn } from "@/lib/utils";
import { CompanyCard } from "@/components/CompanyCard";

type Filter = Sector | "All";

/** Full, filterable + searchable grid of all subsidiaries with smooth reflow. */
export function CompanyGrid() {
  const [filter, setFilter] = useState<Filter>("All");
  const [query, setQuery] = useState("");

  const filters: Filter[] = useMemo(() => ["All", ...activeSectors], []);
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return companies.filter((c) => {
      const bySector = filter === "All" || c.sector === filter;
      const byQuery =
        q === "" ||
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.sector.toLowerCase().includes(q);
      return bySector && byQuery;
    });
  }, [filter, query]);

  return (
    <div>
      <div className="mb-6">
        <label htmlFor="company-search" className="sr-only">
          Search companies
        </label>
        <div className="relative max-w-md">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-graphite-400"
            strokeWidth={1.8}
          />
          <input
            id="company-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search companies…"
            className="w-full rounded-full border border-graphite-900/15 bg-white py-2.5 pl-10 pr-10 text-sm text-graphite-900 placeholder:text-graphite-400 focus:border-graphite-500 focus:outline-none focus:ring-2 focus:ring-brand-300"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-graphite-400 hover:text-graphite-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

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
                "relative rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2",
                active ? "text-white" : "text-graphite-700 hover:text-graphite-900",
              )}
            >
              {active && (
                <motion.span
                  layoutId="chip-active"
                  className="absolute inset-0 rounded-full bg-graphite-800"
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

      {visible.length === 0 && (
        <div className="rounded-2xl border border-dashed border-graphite-900/15 bg-white/50 p-10 text-center">
          <p className="font-heading text-lg font-semibold text-graphite-900">No companies found</p>
          <p className="mt-1.5 text-sm text-graphite-600">
            Try a different search term or sector filter.
          </p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("All");
            }}
            className="mt-4 rounded-full bg-graphite-800 px-4 py-2 text-sm font-medium text-white hover:bg-graphite-900"
          >
            Reset filters
          </button>
        </div>
      )}

      <p className="mt-8 text-sm text-graphite-500" aria-live="polite">
        Showing {visible.length} of {companies.length} companies
        {filter !== "All" ? ` in ${filter}` : ""}
        {query ? ` matching “${query}”` : ""}.
      </p>
    </div>
  );
}
