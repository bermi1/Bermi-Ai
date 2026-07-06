"use client";

import { motion } from "framer-motion";
import { timeline } from "@/data/site";

/** Animated vertical journey timeline (1980s → today). */
export function Timeline() {
  return (
    <ol className="relative ml-3 border-l-2 border-graphite-900/10">
      {timeline.map((m, i) => (
        <motion.li
          key={m.period}
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: i * 0.05 }}
          className="relative mb-10 pl-8 last:mb-0"
        >
          <span
            aria-hidden="true"
            className="absolute -left-[9px] top-1 grid h-4 w-4 place-items-center rounded-full border-2 border-brand-400 bg-graphite-50"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">
            {m.period}
          </span>
          <h3 className="mt-1 font-heading text-xl font-semibold text-graphite-900">{m.title}</h3>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-graphite-600">{m.body}</p>
        </motion.li>
      ))}
    </ol>
  );
}
