"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import { Dictionary } from "@/i18n/config";

export function Footer({ dict }: { dict: Dictionary["footer"] }) {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        bgcolor: "background.paper",
        mt: 8,
      }}
    >
      <Container maxWidth="xl">
        <Stack sx={{ gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {dict.description}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {dict.copyright}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
