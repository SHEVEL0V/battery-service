"use client";

import { Box, Container, Stack, Typography, Paper, Rating } from "@mui/material";
import { ScrollReveal } from "@/src/components/animation/ScrollReveal";

export function Reviews() {
  const reviews = [
    {
      author: "Петро Іванов",
      rating: 5,
      text: "Відмінна робота! Батарея як нова. Рекомендую всім.",
      car: "Tesla Model 3",
    },
    {
      author: "Марія Сидоренко",
      rating: 5,
      text: "Швидко, професійно, справедливі ціни. Очень доволена.",
      car: "Tesla Model Y",
    },
    {
      author: "Андрій Коваленко",
      rating: 4,
      text: "Хорошее обслуговування, гарні фахівці. Буду ще.",
      car: "Tesla Model S",
    },
  ];

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <ScrollReveal direction="up">
          <Typography variant="h2" textAlign="center" sx={{ mb: 6 }}>
            Відгуки клієнтів
          </Typography>
        </ScrollReveal>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
            gap: 3,
          }}
        >
          {reviews.map((review, idx) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 0.1}>
              <Paper sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="start">
                  <Stack>
                    <Typography variant="h4">{review.author}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {review.car}
                    </Typography>
                  </Stack>
                  <Rating value={review.rating} readOnly size="small" />
                </Stack>
                <Typography variant="body2">{review.text}</Typography>
              </Paper>
            </ScrollReveal>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
