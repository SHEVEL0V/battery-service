"use client";

import { Box, Container, Stack, Typography, Paper, Rating } from "@mui/material";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { Dictionary } from "@/dictionaries";

export function ReviewsCarousel({ dict }: { dict: Dictionary["reviews"] }) {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <ScrollReveal direction="up">
          <Typography variant="h2" sx={{ mb: 6, textAlign: "center" }}>{dict.title}</Typography>
        </ScrollReveal>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
            gap: 3,
          }}
        >
          {dict.reviews.map(({ author, text, car }, idx) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 0.1}>
              <Paper sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                <Stack
                  direction="row"
                  sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
                >
                  <Stack>
                    <Typography variant="h4">{author}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {car}
                    </Typography>
                  </Stack>
                  <Rating value={5} readOnly size="small" />
                </Stack>
                <Typography variant="body2">{text}</Typography>
              </Paper>
            </ScrollReveal>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
