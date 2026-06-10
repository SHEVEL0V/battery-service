import { Box, Container, Grid, Stack, Typography } from "@mui/material";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import { getActiveServices } from "@/features/services/queries";
import { ServiceListCard } from "@/features/services/components/ServiceListCard";

export const dynamic = "force-dynamic";

export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const [{ servicesPage }, services] = await Promise.all([
    getDictionary(lang),
    getActiveServices(lang),
  ]);

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="lg">
        <Stack sx={{ gap: 6 }}>
          <Stack sx={{ alignItems: "center", textAlign: "center" }}>
            <Typography variant="h2">{servicesPage.title}</Typography>
            <Typography variant="body1" color="text.secondary">
              {servicesPage.description}
            </Typography>
          </Stack>

          <Grid container spacing={3}>
            {services.map((service) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={service.id}>
                <ServiceListCard service={service} lang={lang} dict={servicesPage} />
              </Grid>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}
