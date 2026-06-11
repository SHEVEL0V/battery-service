"use client";

import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { ServiceCard } from "./ServiceCard";
import { Dictionary } from "@/i18n/config";

export function ServicesList({ dict }: { dict: Dictionary["services"] }) {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Stack sx={{ gap: 6 }}>
          <ScrollReveal direction="up">
            <Stack sx={{ alignItems: "center", textAlign: "center" }}>
              <Typography variant="h2">{dict.title}</Typography>
              <Typography variant="body1" color="text.secondary">
                {dict.description}
              </Typography>
            </Stack>
          </ScrollReveal>

          <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
            {dict.services.map((service, idx) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={idx} sx={{ display: "flex" }}>
                <ScrollReveal delay={idx * 0.1} style={{ width: "100%" }}>
                  <ServiceCard {...service} />
                </ScrollReveal>
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
