"use client";

import { Box, Container, Button, Stack, Typography } from "@mui/material";
import { ScrollReveal } from "@/src/components/animation/ScrollReveal";

export function BookingCTA() {
  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        background: "linear-gradient(135deg, #CC0000 0%, #990000 100%)",
        color: "white",
      }}
    >
      <Container maxWidth="lg">
        <ScrollReveal direction="up">
          <Stack alignItems="center" textAlign="center" spacing={3}>
            <Typography variant="h2">Готові відновити вашу батарею?</Typography>
            <Typography variant="body1" sx={{ maxWidth: "600px", fontSize: "1.1rem" }}>
              Запишіться на безплатну діагностику сьогодні. Наша команда допоможе вашому
              електромобілю повернути повну потужність.
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                bgcolor: "white",
                color: "primary.main",
                "&:hover": { bgcolor: "#f0f0f0" },
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                fontWeight: 600,
              }}
            >
              Записатись зараз
            </Button>
          </Stack>
        </ScrollReveal>
      </Container>
    </Box>
  );
}
