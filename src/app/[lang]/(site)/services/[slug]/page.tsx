import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, hasLocale } from "@/i18n/config";
import { getServiceBySlug } from "@/features/services/queries";
import { formatPrice } from "@/features/services/format";
import routes from "@/lib/routing/routes";
import NextLink from "@/components/ui/NextLink";

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/services/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};

  const service = await getServiceBySlug(slug, lang);
  if (!service) return {};

  return {
    title: service.title,
    description: service.description,
    alternates: {
      canonical: `/${lang}/services/${slug}`,
      languages: {
        uk: `/uk/services/${slug}`,
        en: `/en/services/${slug}`,
      },
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps<"/[lang]/services/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const [{ servicesPage, bookingCTA }, service] = await Promise.all([
    getDictionary(lang),
    getServiceBySlug(slug, lang),
  ]);

  if (!service) notFound();

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="md">
        <Stack sx={{ gap: 4 }}>
          <Button
            component={NextLink}
            href={routes(lang).services}
            variant="text"
            sx={{ alignSelf: "flex-start" }}
          >
            {servicesPage.back}
          </Button>

          <Typography variant="h1">{service.title}</Typography>
          <Typography variant="body1" color="text.secondary">
            {service.description}
          </Typography>

          <Stack direction="row" spacing={6}>
            <Stack>
              <Typography variant="caption" color="text.secondary">
                {servicesPage.priceLabel}
              </Typography>
              <Typography variant="h3" color="primary">
                {formatPrice(service.price, lang)}
              </Typography>
            </Stack>
            <Stack>
              <Typography variant="caption" color="text.secondary">
                {servicesPage.durationLabel}
              </Typography>
              <Typography variant="h3">{service.duration}</Typography>
            </Stack>
          </Stack>

          <Button
            component={NextLink}
            href={routes(lang).booking}
            variant="contained"
            size="large"
            sx={{ alignSelf: "flex-start" }}
          >
            {bookingCTA.button}
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}
