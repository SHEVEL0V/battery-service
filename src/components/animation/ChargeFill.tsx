"use client";

import { motion, useReducedMotion } from "framer-motion";

interface ChargeFillProps {
  x: number;
  y: number;
  height: number;
  rx?: number;
  ry?: number;
  fill: string;
  clipPath?: string;
  fullWidth: number;
  emptyWidth: number;
}

export function ChargeFill({
  x,
  y,
  height,
  rx = 4,
  ry = 4,
  fill,
  clipPath,
  fullWidth,
  emptyWidth,
}: ChargeFillProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.rect
      x={x}
      y={y}
      height={height}
      rx={rx}
      ry={ry}
      fill={fill}
      clipPath={clipPath}
      initial={{ width: prefersReducedMotion ? fullWidth : emptyWidth }}
      animate={prefersReducedMotion ? undefined : { width: [emptyWidth, fullWidth, fullWidth, emptyWidth] }}
      transition={{
        duration: 4,
        times: [0, 0.6, 0.85, 1],
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}
