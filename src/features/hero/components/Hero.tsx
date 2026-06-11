"use client";

import { Box, Button, Container, Stack } from "@mui/material";
import type { Dictionary, Locale } from "@/i18n/config";
import NextLink from "@/components/ui/NextLink";
import { SectionBackgroundImage } from "@/components/ui/SectionBackgroundImage";
import { adaptiveOverlaySx, adaptiveOverlayVarsSx } from "@/lib/styles/sectionBackground";
import { FadeIn } from "@/components/animation/FadeIn";
import { HeroText } from "./HeroText";
import { HeroParticles } from "./HeroParticles";
import { HeroScene } from "./HeroScene";

export function Hero({ dict, lang }: { dict: Dictionary["hero"]; lang: Locale }) {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        ...adaptiveOverlayVarsSx,
      }}
    >
      <SectionBackgroundImage src="/images/hero-model3.jpg" priority overlaySx={adaptiveOverlaySx} />

      <HeroParticles />

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={6} sx={{ alignItems: "center" }}>
          <Stack
            spacing={3}
            sx={{
              flex: 1,
              alignItems: { xs: "center", md: "flex-start" },
              textAlign: { xs: "center", md: "left" },
            }}
          >
            <HeroText dict={dict} />

            <FadeIn delay={0.6}>
              <Button
                component={NextLink}
                href={`/${lang}/booking`}
                variant="contained"
                size="large"
                sx={{ mt: 1, px: 4, py: 1.5, fontSize: "1rem" }}
              >
                {dict.cta}
              </Button>
            </FadeIn>
          </Stack>

          <Box sx={{ flex: 1, display: { xs: "none", md: "flex" }, justifyContent: "center" }}>
            <HeroScene />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
