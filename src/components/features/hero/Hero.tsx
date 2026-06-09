"use client";
import type { Dictionary } from "@/dictionaries";

import { Box, Button, Container, Stack, Typography } from "@mui/material";

import { ScrollReveal } from "@/components/animation/ScrollReveal";

export function Hero({ dict }: { dict: Dictionary["hero"] }) {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        color: "text.primary",
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4} sx={{ alignItems: "center", textAlign: "center" }}>
          <ScrollReveal direction="up">
            <Typography variant="h1" sx={{ fontSize: { xs: "2rem", md: "3.5rem" } }}>
              {dict.title}
            </Typography>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <Typography variant="h3" color="text.secondary">
              {dict.subtitle}
            </Typography>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <Typography variant="body1" sx={{ maxWidth: "600px" }}>
              {dict.description}
            </Typography>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <Button
              variant="contained"
              size="large"
              sx={{
                mt: 2,
                px: 4,
                py: 1.5,
                fontSize: "1rem",
              }}
            >
              {dict.cta}
            </Button>
          </ScrollReveal>
        </Stack>
      </Container>
    </Box>
  );
}
