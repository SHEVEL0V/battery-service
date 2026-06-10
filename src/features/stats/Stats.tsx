"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { Dictionary } from "@/dictionaries";

export function Stats({ dict }: { dict: Dictionary["stats"] }) {
  const stats = [
    { value: "500+", label: dict.repairs },
    { value: "5 років", label: dict.warranty },
    { value: "10+", label: dict.experience },
  ];

  return (
    <Box
      component="section"
      sx={{ py: { xs: 6, md: 10 }, bgcolor: "primary.main", color: "white" }}
    >
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{ justifyContent: "space-around", alignItems: "center" }}
        >
          {stats.map((stat, idx) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 0.1}>
              <Stack sx={{ alignItems: "center", textAlign: "center" }}>
                <Typography variant="h2" sx={{ fontWeight: 700 }}>
                  {stat.value}
                </Typography>
                <Typography variant="body1">{stat.label}</Typography>
              </Stack>
            </ScrollReveal>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
