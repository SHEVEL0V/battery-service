import { Box, Container, Stack, Typography } from "@mui/material";
import type { Dictionary } from "@/i18n/config";
import { ContactInfoCards, MapClient } from "./MapClient";

export function MapSection({ dict }: { dict: Dictionary["map"] }) {
  return (
    // overflowX clip: ScrollReveal left/right зміщує картки по X у прихованому стані —
    // без clip це розширює документ і дає горизонтальний скрол на мобільному
    <Box component="section" sx={{ py: { xs: 8, md: 12 }, overflowX: "clip" }}>
      <Container maxWidth="lg">
        <Typography variant="h2" sx={{ mb: 6, textAlign: "center" }}>
          {dict.title}
        </Typography>
        <Stack spacing={4}>
          <Box sx={{ height: 400 }}>
            <MapClient dict={dict} />
          </Box>
          <ContactInfoCards dict={dict} />
        </Stack>
      </Container>
    </Box>
  );
}
