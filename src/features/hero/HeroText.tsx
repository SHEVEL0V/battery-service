"use client";

import { Typography } from "@mui/material";
import { motion } from "framer-motion";
import type { Dictionary } from "@/dictionaries";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

interface Props {
  dict: Pick<Dictionary["hero"], "title" | "subtitle" | "description">;
}

export function HeroText({ dict }: Props) {
  return (
    <motion.div variants={container} initial="hidden" animate="visible">
      <motion.div variants={item}>
        <Typography variant="h1" sx={{ fontSize: { xs: "2rem", md: "3.5rem" } }}>
          {dict.title}
        </Typography>
      </motion.div>

      <motion.div variants={item}>
        <Typography variant="h3" color="text.secondary" sx={{ mt: 2 }}>
          {dict.subtitle}
        </Typography>
      </motion.div>

      <motion.div variants={item}>
        <Typography variant="body1" sx={{ maxWidth: "600px", mt: 2 }}>
          {dict.description}
        </Typography>
      </motion.div>
    </motion.div>
  );
}
