"use client";

import { alpha, Box, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { usePointerTilt } from "@/components/animation/usePointerTilt";
import { AmbientGlow } from "@/components/animation/AmbientGlow";
import { ChargeFill } from "@/components/animation/ChargeFill";
import { PulsingPath } from "@/components/animation/PulsingPath";
import { FloatingSparks } from "@/components/animation/FloatingSparks";

const SPARKS = [
  { cx: 150, cy: 30, delay: 0 },
  { cx: 165, cy: 55, delay: 0.6 },
  { cx: 145, cy: 75, delay: 1.2 },
  { cx: 170, cy: 20, delay: 1.8 },
];

export function HeroScene() {
  const theme = useTheme();
  const { ref, rotateX, rotateY, glowPosition, onPointerMove, onPointerLeave } = usePointerTilt();

  const primary = theme.palette.primary.main;

  return (
    <Box
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 360,
        aspectRatio: "2 / 1",
        perspective: 800,
      }}
    >
      <AmbientGlow position={glowPosition} color={primary} />

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
          <ChargeFill
            x={11}
            y={16}
            height={68}
            fill="url(#hero-charge)"
            clipPath="url(#hero-cell-clip)"
            emptyWidth={30}
            fullWidth={168}
          />

          {/* Energy bolt */}
          <PulsingPath
            d="M103 20 L78 56 L96 56 L92 80 L120 44 L100 44 Z"
            fill="currentColor"
            filter="url(#hero-glow)"
            style={{ transformOrigin: "100px 50px" }}
          />

          {/* Floating sparks */}
          <FloatingSparks sparks={SPARKS} />
        </Box>
      </Box>
    </Box>
  );
}
