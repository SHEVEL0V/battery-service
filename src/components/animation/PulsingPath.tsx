"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ComponentProps } from "react";

type PulsingPathProps = ComponentProps<typeof motion.path>;

export function PulsingPath(props: PulsingPathProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.path
      {...props}
      initial={{ opacity: 0.6, scale: 1 }}
      animate={prefersReducedMotion ? undefined : { opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
