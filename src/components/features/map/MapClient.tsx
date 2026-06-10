"use client";

import { Box, Stack, Typography } from "@mui/material";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import type { Dictionary } from "@/dictionaries";

interface Props {
  dict: Dictionary["map"];
}

export function MapClient({ dict }: Props) {
  return (
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
        {process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ? (
          <iframe
            src={process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography color="text.secondary">{dict.description}</Typography>
          </Box>
        )}
      </Box>

      <Stack direction={{ xs: "column", md: "row" }} sx={{ justifyContent: "space-between" }} spacing={3}>
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
  );
}
