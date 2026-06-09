"use client";

import { Box, Container, Grid, Paper, Stack, Typography } from "@mui/material";

import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { Dictionary } from "@/dictionaries";

export function Services({ dict }: { dict: Dictionary["services"] }) {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Stack sx={{ gap: 6 }}>
          <ScrollReveal direction="up">
            <Stack sx={{ alignItems: "center", textAlign: "center" }}>
              <Typography variant="h2">Послуги</Typography>
              <Typography variant="body1" color="text.secondary">
                {dict.description}
              </Typography>
            </Stack>
          </ScrollReveal>

          <Grid container spacing={3}>
            {dict.services.map(({ title, desc, price }, idx) => (
              <Grid sx={{ xs: 12, sm: 6, md: 4 }} key={idx}>
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
                      {title}
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                      {desc}
                    </Typography>
                    <Typography variant="h4" color="primary" sx={{ mt: "auto" }}>
                      {price}
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
