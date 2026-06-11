"use client";

import { Box, Button, Container, Stack } from "@mui/material";
import { motion } from "framer-motion";
import type { Dictionary, Locale } from "@/i18n/config";
import NextLink from "@/components/ui/NextLink";
import { SectionBackgroundImage } from "@/components/ui/SectionBackgroundImage";
import { adaptiveOverlaySx, adaptiveOverlayVarsSx } from "@/lib/styles/sectionBackground";
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

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5, ease: "easeOut" }}
            >
              <Button
                component={NextLink}
                href={`/${lang}/booking`}
                variant="contained"
                size="large"
                sx={{ mt: 1, px: 4, py: 1.5, fontSize: "1rem" }}
              >
                {dict.cta}
              </Button>
            </motion.div>
          </Stack>

          <Box sx={{ flex: 1, display: { xs: "none", md: "flex" }, justifyContent: "center" }}>
            <HeroScene />
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
