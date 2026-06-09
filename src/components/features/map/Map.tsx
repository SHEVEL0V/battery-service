"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import { Dictionary } from "@/dictionaries";

export function Map({ dict }: { dict: Dictionary["map"] }) {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <ScrollReveal direction="up">
          <Typography variant="h2" sx={{ mb: 6, textAlign: "center" }}>
            {dict.title}
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
              <Typography>{dict.description}</Typography>
            </Box>
          </Box>

          <Stack sx={{ xs: "column", md: "row", justifyContent: "space-between", spacing: 3 }}>
            <ScrollReveal direction="left">
              <Box>
                <Typography variant="h4" gutterBottom>
                  {dict.address}
                </Typography>
                <Typography>{dict.addressValue}</Typography>
              </Box>
            </ScrollReveal>

            <ScrollReveal direction="up">
              <Box>
                <Typography variant="h4" gutterBottom>
                  {dict.phone}
                </Typography>
                <Typography>{dict.phoneValue}</Typography>
              </Box>
            </ScrollReveal>

            <ScrollReveal direction="right">
              <Box>
                <Typography variant="h4" gutterBottom>
                  {dict.hours}
                </Typography>
                <Typography>{dict.hoursValue}</Typography>
              </Box>
            </ScrollReveal>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
