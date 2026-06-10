import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import { MapClient } from "@/components/features/map/MapClient";
import { ContactForm } from "@/components/features/contact/ContactForm";

export default async function ContactsPage({ params }: PageProps<"/[lang]/contacts">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const { contacts, map } = await getDictionary(lang);

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Stack sx={{ gap: 6 }}>
          <Stack sx={{ alignItems: "center", textAlign: "center" }}>
            <Typography variant="h2">{contacts.title}</Typography>
            <Typography variant="body1" color="text.secondary">
              {contacts.description}
            </Typography>
          </Stack>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 6 }}>
              <ContactForm dict={contacts.form} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <MapClient dict={map} />
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
