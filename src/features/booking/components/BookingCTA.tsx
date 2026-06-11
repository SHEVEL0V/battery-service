"use client";

import { Box, Container, Button, Stack, Typography } from "@mui/material";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { Dictionary, Locale } from "@/i18n/config";
import NextLink from "@/components/ui/NextLink";
import { SectionBackgroundImage } from "@/components/ui/SectionBackgroundImage";
import { brandOverlaySx } from "@/lib/styles/sectionBackground";

export function BookingCTA({ dict, lang }: { dict: Dictionary["bookingCTA"]; lang: Locale }) {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        position: "relative",
        overflow: "hidden",
        color: "white",
      }}
    >
      <SectionBackgroundImage src="/images/service.jpg" overlaySx={brandOverlaySx} />

      <Container maxWidth="lg" sx={{ position: "relative" }}>
        <ScrollReveal direction="up">
          <Stack sx={{ alignItems: "center", textAlign: "center", spacing: 3 }}>
            <Typography variant="h2">{dict.title}</Typography>
            <Typography variant="body1" sx={{ maxWidth: "600px", fontSize: "1.1rem" }}>
              {dict.description}
            </Typography>
            <Button
              component={NextLink}
              href={`/${lang}/booking`}
              variant="contained"
              size="large"
              sx={{
                bgcolor: "common.white",
                color: "primary.main",
                "&:hover": { bgcolor: "grey.200" },
                px: 4,
                py: 1.5,
                mt: 2,
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              {dict.button}
            </Button>
          </Stack>
        </ScrollReveal>
      </Container>
    </Box>
  );
}
