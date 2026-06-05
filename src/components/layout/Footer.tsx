"use client";

import { Box, Container, Stack, Typography } from "@mui/material";

interface FooterProps {
  dict: any;
}

export function Footer({ dict }: FooterProps) {
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
        <Stack spacing={2}>
          <Typography variant="body2" color="text.secondary">
            {dict.footer.description}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {dict.footer.copyright}
          </Typography>
        </Stack>
      </Container>
    </Box>
  );
}
