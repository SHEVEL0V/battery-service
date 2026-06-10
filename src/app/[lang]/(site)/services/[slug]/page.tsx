import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getDictionary, hasLocale } from "@/dictionaries";
import { getServiceBySlug } from "@/components/features/services/queries";
import { formatPrice } from "@/components/features/services/format";
import NextLink from "@/components/ui/NextLink";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps<"/[lang]/services/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};

  const service = await getServiceBySlug(slug);
  if (!service) return {};

  const title = lang === "uk" ? service.titleUk : service.titleEn;
  const description = lang === "uk" ? service.descUk : service.descEn;

  return {
    title,
    description,
    alternates: {
      canonical: `/${lang}/services/${slug}`,
      languages: {
        uk: `/uk/services/${slug}`,
        en: `/en/services/${slug}`,
      },
    },
  };
}

export default async function ServiceDetailPage({
  params,
}: PageProps<"/[lang]/services/[slug]">) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();

  const [{ servicesPage, bookingCTA }, service] = await Promise.all([
    getDictionary(lang),
    getServiceBySlug(slug),
  ]);

  if (!service) notFound();

  const title = lang === "uk" ? service.titleUk : service.titleEn;
  const desc = lang === "uk" ? service.descUk : service.descEn;

  return (
    <Box component="section" sx={{ py: { xs: 8, md: 12 } }}>
      <Container maxWidth="md">
        <Stack sx={{ gap: 4 }}>
          <Button
            component={NextLink}
            href={`/${lang}/services`}
            variant="text"
            sx={{ alignSelf: "flex-start" }}
          >
            {servicesPage.back}
          </Button>

          <Typography variant="h1">{title}</Typography>
          <Typography variant="body1" color="text.secondary">
            {desc}
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
            href={`/${lang}/booking`}
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
