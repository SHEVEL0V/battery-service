"use client";

import { Box, Container, Button, Stack, Typography } from "@mui/material";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { Dictionary } from "@/dictionaries";

export function BookingCTA({ dict }: { dict: Dictionary["bookingCTA"] }) {
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
          <Stack sx={{ alignItems: "center", textAlign: "center", spacing: 3 }}>
            <Typography variant="h2">{dict.title}</Typography>
            <Typography variant="body1" sx={{ maxWidth: "600px", fontSize: "1.1rem" }}>
              {dict.description}
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
              {dict.button}
            </Button>
          </Stack>
        </ScrollReveal>
      </Container>
    </Box>
  );
}
