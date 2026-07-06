"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { MapPin } from "lucide-react";
import { jobs, type Job } from "@/data/careers";
import { activeSectors, type Sector } from "@/data/companies";
import { group } from "@/data/site";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ButtonLink } from "@/components/ui/button";

type Filter = Sector | "All";

export function CareersList() {
  const [filter, setFilter] = useState<Filter>("All");

  const sectorsWithJobs = useMemo(
    () => activeSectors.filter((s) => jobs.some((j) => j.sector === s)),
    [],
  );
  const filters: Filter[] = ["All", ...sectorsWithJobs];
  const visible = useMemo(
    () => (filter === "All" ? jobs : jobs.filter((j) => j.sector === filter)),
    [filter],
  );

  return (
    <div>
      <div
        role="tablist"
        aria-label="Filter roles by sector"
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
                  layoutId="career-chip"
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
        <motion.ul layout className="space-y-4">
          <AnimatePresence mode="popLayout">
            {visible.map((job) => (
              <JobRow key={job.id} job={job} />
            ))}
          </AnimatePresence>
        </motion.ul>
      </LayoutGroup>
    </div>
  );
}

function JobRow({ job }: { job: Job }) {
  const mailHref = `mailto:${group.email}?subject=${encodeURIComponent(
    `Application: ${job.title} (${job.sector})`,
  )}`;
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-4 rounded-2xl border border-graphite-900/10 bg-white p-6 shadow-card sm:flex-row sm:items-center sm:justify-between"
    >
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="ink">{job.sector}</Badge>
          <Badge tone="muted">{job.type}</Badge>
        </div>
        <h3 className="mt-3 font-heading text-lg font-semibold text-graphite-900">{job.title}</h3>
        <p className="mt-1 text-sm text-graphite-600">{job.summary}</p>
        <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-graphite-500">
          <MapPin className="h-4 w-4" strokeWidth={1.6} /> {job.location}
        </p>
      </div>
      <ButtonLink href={mailHref} variant="outline" className="shrink-0">
        Apply
      </ButtonLink>
    </motion.li>
  );
}
