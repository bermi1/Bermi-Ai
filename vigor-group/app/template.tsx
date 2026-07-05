"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * App Router route-transition shell. `template.tsx` remounts on every
 * navigation, so this cross-fades + lifts each new route into view instead
 * of a hard cut.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
