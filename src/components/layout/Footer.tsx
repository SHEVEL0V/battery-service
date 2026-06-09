"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import { Dictionary } from "@/dictionaries";

export function Footer({ dict }: { dict: Dictionary["footer"] }) {
  return (
    <Box
      component="footer"
      sx={{
        py: 4,
        borderTop: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
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
