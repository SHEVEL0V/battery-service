"use client";

import { Box, Container, Stack, Typography, Paper } from "@mui/material";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { Dictionary } from "@/dictionaries";

export function HowItWorks({ dict }: { dict: Dictionary["howItWorks"] }) {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <ScrollReveal direction="up">
          <Typography sx={{ mb: 6, textAlign: "center", variant: "h2" }}>Як це працює</Typography>
        </ScrollReveal>

        <Stack sx={{ xs: "column", md: "row", spacing: 3, justifyContent: "space-between" }}>
          {dict.steps.map(({ title, description }, idx) => (
            <ScrollReveal key={idx} direction="up" delay={idx * 0.1}>
              <Paper
                sx={{
                  p: 3,
                  flex: 1,
                  textAlign: "center",
                }}
              >
                <Typography variant="h4" color="primary" gutterBottom>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {description}
                </Typography>
              </Paper>
            </ScrollReveal>
          ))}
        </Stack>
      </Container>
    </Box>
  );
}
