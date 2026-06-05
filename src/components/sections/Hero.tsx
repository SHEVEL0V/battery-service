"use client";

import { Box, Button, Container, Stack, Typography } from "@mui/material";

import { ScrollReveal } from "@/src/components/animation/ScrollReveal";

export function Hero() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        background: "linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)",
        color: "text.primary",
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={4} sx={{ alignItems: "center", textAlign: "center" }}>
          <ScrollReveal direction="up">
            <Typography variant="h1" sx={{ fontSize: { xs: "2rem", md: "3.5rem" } }}>
              {"title"}
            </Typography>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.1}>
            <Typography variant="h3" color="text.secondary">
              {"subtitle"}
            </Typography>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.2}>
            <Typography variant="body1" sx={{ maxWidth: "600px" }}>
              {"description"}
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
              {"cta"}
            </Button>
          </ScrollReveal>
        </Stack>
      </Container>
    </Box>
  );
}
