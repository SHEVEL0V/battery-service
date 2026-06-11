"use client";

import { Typography } from "@mui/material";
import type { Dictionary } from "@/i18n/config";
import { StaggerReveal, StaggerItem } from "@/components/animation/StaggerReveal";

interface Props {
  dict: Pick<Dictionary["hero"], "title" | "subtitle" | "description">;
}

export function HeroText({ dict }: Props) {
  return (
    <StaggerReveal>
      <StaggerItem>
        <Typography variant="h1" sx={{ fontSize: { xs: "2rem", md: "3.5rem" } }}>
          {dict.title}
        </Typography>
      </StaggerItem>

      <StaggerItem>
        <Typography variant="h3" color="text.secondary" sx={{ mt: 2 }}>
          {dict.subtitle}
        </Typography>
      </StaggerItem>

      <StaggerItem>
        <Typography variant="body1" sx={{ maxWidth: "600px", mt: 2 }}>
          {dict.description}
        </Typography>
      </StaggerItem>
    </StaggerReveal>
  );
}
