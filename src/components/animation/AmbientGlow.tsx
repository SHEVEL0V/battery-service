"use client";

import { Box } from "@mui/material";
import { motion, MotionValue, useReducedMotion, useTransform } from "framer-motion";

interface AmbientGlowProps {
  position: MotionValue<string>;
  color: string;
}

export function AmbientGlow({ position, color }: AmbientGlowProps) {
  const prefersReducedMotion = useReducedMotion();
  const background = useTransform(
    position,
    (pos) => `radial-gradient(circle at ${pos}, ${color}55, transparent 70%)`
  );

  return (
    <Box
      component={motion.div}
      aria-hidden
      sx={{
        position: "absolute",
        inset: -40,
        borderRadius: "50%",
        filter: "blur(40px)",
        pointerEvents: "none",
      }}
      style={{ background }}
      animate={prefersReducedMotion ? undefined : { opacity: [0.5, 0.9, 0.5] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    />
  );
}
