import { Box, Container, Stack, Typography } from "@mui/material";
import { Button } from "@/components/ui/Button";
import NextLink from "@/components/ui/NextLink";
import { defaultLocale, getDictionary } from "@/dictionaries";

export default async function NotFound() {
  const { notFoundPage } = await getDictionary(defaultLocale);

  return (
    <Box
      component="section"
      sx={{ py: { xs: 12, md: 16 }, minHeight: "60vh", display: "flex", alignItems: "center" }}
    >
      <Container maxWidth="sm">
        <Stack sx={{ alignItems: "center", textAlign: "center", gap: 2 }}>
          <Typography variant="h1" color="primary">
            {notFoundPage.title}
          </Typography>
          <Typography variant="h3">{notFoundPage.heading}</Typography>
          <Typography variant="body1" color="text.secondary">
            {notFoundPage.description}
          </Typography>
          <Button component={NextLink} href="/" variant="contained" sx={{ mt: 2 }}>
            {notFoundPage.cta}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
