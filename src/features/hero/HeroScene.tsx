"use client";

import { useRef } from "react";
import { alpha, Box, useTheme } from "@mui/material";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";

const SPARKS = [
  { cx: 150, cy: 30, delay: 0 },
  { cx: 165, cy: 55, delay: 0.6 },
  { cx: 145, cy: 75, delay: 1.2 },
  { cx: 170, cy: 20, delay: 1.8 },
];

export function HeroScene() {
  const theme = useTheme();
  const prefersReducedMotion = useReducedMotion();
  const wrapperRef = useRef<HTMLDivElement>(null);

  const rotateX = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });
  const rotateY = useSpring(useMotionValue(0), { stiffness: 150, damping: 20 });

  const glow = useTransform(
    [rotateX, rotateY],
    ([rx, ry]: number[]) => `${50 + ry * 2}% ${50 - rx * 2}%`
  );

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (event.clientX - rect.left) / rect.width - 0.5;
    const py = (event.clientY - rect.top) / rect.height - 0.5;
    rotateY.set(px * 16);
    rotateX.set(-py * 16);
  };

  const handlePointerLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  const primary = theme.palette.primary.main;

  return (
    <Box
      ref={wrapperRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 360,
        aspectRatio: "2 / 1",
        perspective: 800,
      }}
    >
      {/* Ambient glow that follows the pointer */}
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
        style={{
          background: useTransform(
            glow,
            (pos) => `radial-gradient(circle at ${pos}, ${primary}55, transparent 70%)`
          ),
        }}
        animate={
          prefersReducedMotion
            ? undefined
            : { opacity: [0.5, 0.9, 0.5] }
        }
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <Box
        component={motion.div}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        sx={{
          position: "relative",
          width: "100%",
          height: "100%",
          color: "primary.main",
          borderRadius: 1,
          overflow: "hidden",
          boxShadow: `0 24px 80px ${alpha(primary, 0.15)}`,
        }}
      >
        <Box
          component="svg"
          viewBox="0 0 200 100"
          sx={{
            position: "relative",
            width: "100%",
            height: "100%",
            overflow: "visible",
            filter: "drop-shadow(0 0 14px currentColor)",
          }}
        >
          <defs>
            <linearGradient id="hero-charge" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={theme.palette.primary.main} stopOpacity={0.35} />
              <stop offset="100%" stopColor={theme.palette.primary.main} />
            </linearGradient>
            <filter id="hero-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Battery shell */}
          <rect
            x="5"
            y="10"
            width="180"
            height="80"
            rx="8"
            ry="8"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          />
          <rect x="185" y="35" width="12" height="30" rx="3" ry="3" fill="currentColor" />

          {/* Charging fill */}
          <clipPath id="hero-cell-clip">
            <rect x="11" y="16" width="168" height="68" rx="4" ry="4" />
          </clipPath>
          <motion.rect
            x="11"
            y="16"
            height="68"
            rx="4"
            ry="4"
            fill="url(#hero-charge)"
            clipPath="url(#hero-cell-clip)"
            initial={{ width: prefersReducedMotion ? 168 : 30 }}
            animate={
              prefersReducedMotion
                ? undefined
                : { width: [30, 168, 168, 30] }
            }
            transition={{
              duration: 4,
              times: [0, 0.6, 0.85, 1],
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Energy bolt */}
          <motion.path
            d="M103 20 L78 56 L96 56 L92 80 L120 44 L100 44 Z"
            fill="currentColor"
            filter="url(#hero-glow)"
            initial={{ opacity: 0.6, scale: 1 }}
            animate={
              prefersReducedMotion
                ? undefined
                : { opacity: [0.5, 1, 0.5], scale: [0.95, 1.05, 0.95] }
            }
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "100px 50px" }}
          />

          {/* Floating sparks */}
          {!prefersReducedMotion &&
            SPARKS.map((spark, i) => (
              <motion.circle
                key={i}
                cx={spark.cx}
                cy={spark.cy}
                r={1.5}
                fill="currentColor"
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], y: -16 }}
                transition={{
                  duration: 2.4,
                  repeat: Infinity,
                  delay: spark.delay,
                  ease: "easeOut",
                }}
              />
            ))}
        </Box>
      </Box>
    </Box>
  );
}
