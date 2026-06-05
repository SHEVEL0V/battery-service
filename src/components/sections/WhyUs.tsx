"use client";

import { Box, Container, Stack, Typography, Paper } from "@mui/material";
import { ScrollReveal } from "@/src/components/animation/ScrollReveal";

export function WhyUs() {
  const reasons = [
    { title: "Професіонали", description: "Досвідчена команда спеціалістів" },
    { title: "Якість", description: "Оригінальні деталі та матеріали" },
    { title: "Гарантія", description: "5 років гарантії на всі роботи" },
    { title: "Швидкість", description: "Експресне обслуговування" },
    { title: "Ціна", description: "Конкурентні ціни на ринку" },
    { title: "Сервіс", description: "24/7 техпідтримка" },
  ];

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 }, bgcolor: "background.paper" }}>
      <Container maxWidth="lg">
        <ScrollReveal direction="up">
          <Typography variant="h2" textAlign="center" sx={{ mb: 6 }}>
            Чому обирають нас
          </Typography>
        </ScrollReveal>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr" },
            gap: 3,
          }}
        >
          {reasons.map((reason, idx) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 0.05}>
              <Paper sx={{ p: 3, textAlign: "center" }}>
                <Typography variant="h4" color="primary" gutterBottom>
                  {reason.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {reason.description}
                </Typography>
              </Paper>
            </ScrollReveal>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
