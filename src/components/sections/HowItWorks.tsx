"use client";

import { Box, Container, Stack, Typography, Paper } from "@mui/material";
import { ScrollReveal } from "@/src/components/animation/ScrollReveal";

export function HowItWorks() {
  const steps = [
    {
      title: "1. Консультація",
      description: "Обговорюємо вашу проблему та робимо первинну діагностику",
    },
    {
      title: "2. Діагностика",
      description: "Проводимо детальну перевірку всіх систем батареї",
    },
    {
      title: "3. Ремонт",
      description: "Виконуємо необхідні ремонти з якісними деталями",
    },
    {
      title: "4. Тестування",
      description: "Перевіряємо роботоспроможність та видаємо гарантію",
    },
  ];

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <ScrollReveal direction="up">
          <Typography variant="h2" textAlign="center" sx={{ mb: 6 }}>
            Як це працює
          </Typography>
        </ScrollReveal>

        <Stack direction={{ xs: "column", md: "row" }} spacing={3} justifyContent="space-between">
          {steps.map((step, idx) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 0.1}>
              <Paper
                sx={{
                  p: 3,
                  flex: 1,
                  textAlign: "center",
                }}
              >
                <Typography variant="h4" color="primary" gutterBottom>
                  {step.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {step.description}
                </Typography>
              </Paper>
            </ScrollReveal>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
