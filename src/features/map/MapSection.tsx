import { Box, Container, Typography } from "@mui/material";
import type { Dictionary } from "@/dictionaries";
import { MapClient } from "./MapClient";

export function MapSection({ dict }: { dict: Dictionary["map"] }) {
  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 6, textAlign: "center" }}>
          {dict.title}
        </Typography>
        <MapClient dict={dict} />
      </Container>
    </Box>
  );
}
