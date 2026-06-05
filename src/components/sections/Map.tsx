"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import { ScrollReveal } from "@/src/components/animation/ScrollReveal";

export function Map() {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <ScrollReveal direction="up">
          <Typography variant="h2" textAlign="center" sx={{ mb: 6 }}>
            Знайдіть нас
          </Typography>
        </ScrollReveal>

        <Stack spacing={4}>
          <Box
            sx={{
              width: "100%",
              height: "400px",
              bgcolor: "background.paper",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography>Google Map (Coming Soon)</Typography>
            </Box>
          </Box>

          <Stack direction={{ xs: "column", md: "row" }} spacing={3} justifyContent="space-between">
            <ScrollReveal direction="left">
              <Box>
                <Typography variant="h4" gutterBottom>
                  Адреса
                </Typography>
                <Typography>вул. Прикладу, 123, Київ, Україна</Typography>
              </Box>
            </ScrollReveal>

            <ScrollReveal direction="up">
              <Box>
                <Typography variant="h4" gutterBottom>
                  Телефон
                </Typography>
                <Typography>+38 (044) 123-45-67</Typography>
              </Box>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <Box>
                <Typography variant="h4" gutterBottom>
                  Час роботи
                </Typography>
                <Typography>Пн-Пт: 9:00 - 18:00</Typography>
                <Typography>Сб-Нд: 10:00 - 16:00</Typography>
              </Box>
            </ScrollReveal>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
