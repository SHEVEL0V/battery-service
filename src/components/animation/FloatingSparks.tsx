"use client";

import { motion, useReducedMotion } from "framer-motion";

interface Spark {
  cx: number;
  cy: number;
  delay: number;
}

interface FloatingSparksProps {
  sparks: Spark[];
  radius?: number;
  distance?: number;
  duration?: number;
}

export function FloatingSparks({ sparks, radius = 1.5, distance = 16, duration = 2.4 }: FloatingSparksProps) {
  const prefersReducedMotion = useReducedMotion();
  if (prefersReducedMotion) return null;

  return (
    <>
      {sparks.map((spark, i) => (
        <motion.circle
          key={i}
          cx={spark.cx}
          cy={spark.cy}
          r={radius}
          fill="currentColor"
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: [0, 1, 0], y: -distance }}
          transition={{ duration, repeat: Infinity, delay: spark.delay, ease: "easeOut" }}
        />
      ))}
    </>
  );
}
