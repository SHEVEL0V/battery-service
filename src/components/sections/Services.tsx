"use client";

import { Box, Container, Grid, Paper, Stack, Typography } from "@mui/material";

import { ScrollReveal } from "@/src/components/animation/ScrollReveal";

export function Services() {
  const services = [
    {
      title: "Діагностика батареї",
      desc: "Повна перевірка стану батареї та її компонентів",
      price: "₴500",
    },
    {
      title: "Заміна модулів",
      desc: "Заміна пошкоджених модулів батареї",
      price: "₴3000",
    },
    {
      title: "Калібрування",
      desc: "Оптимізація роботи батареї",
      price: "₴1000",
    },
  ];

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Stack spacing={6}>
          <ScrollReveal direction="up">
            <Stack sx={{ alignItems: "center", textAlign: "center" }}>
              <Typography variant="h2">Послуги</Typography>
              <Typography variant="body1" color="text.secondary">
                {"description"}
              </Typography>
            </Stack>
          </ScrollReveal>

          <Grid container spacing={3}>
            {services.map((service, idx) => (
              <Grid item xs={12} sm={6} md={4} key={idx}>
                <ScrollReveal delay={idx * 0.1}>
                  <Paper
                    sx={{
                      p: 3,
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Typography variant="h3" gutterBottom>
                      {service.title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      {service.desc}
                    </Typography>
                    <Typography variant="h4" color="primary" sx={{ mt: "auto" }}>
                      {service.price}
                    </Typography>
                  </Paper>
                </ScrollReveal>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
