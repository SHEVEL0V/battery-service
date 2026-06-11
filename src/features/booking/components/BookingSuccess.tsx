"use client";

import { Box, Stack, Typography } from "@mui/material";
import { motion, useReducedMotion } from "framer-motion";

const SPARKS = [
  { x: -36, y: -28, delay: 0.4 },
  { x: 36, y: -24, delay: 0.55 },
  { x: -28, y: 24, delay: 0.7 },
  { x: 30, y: 30, delay: 0.85 },
];

export function BookingSuccess({ dict }: { dict: { success: string } }) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <Stack spacing={2} sx={{ alignItems: "center", textAlign: "center", py: 6 }}>
      <Box sx={{ position: "relative", color: "success.main" }}>
        <Box
          component={motion.svg}
          width={64}
          height={64}
          viewBox="0 0 64 64"
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18 }}
        >
          <motion.circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <motion.path
            d="M20 33 L28 41 L45 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: prefersReducedMotion ? 1 : 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.4, delay: 0.5, ease: "easeOut" }}
          />
        </Box>

        {!prefersReducedMotion &&
          SPARKS.map((spark, i) => (
            <Box
              component={motion.span}
              key={i}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: "currentColor",
              }}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], x: spark.x, y: spark.y, scale: 1 }}
              transition={{ duration: 0.8, delay: spark.delay, ease: "easeOut" }}
            />
          ))}
      </Box>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Typography variant="h4">{dict.success}</Typography>
      </motion.div>
    </Stack>
  );
}
