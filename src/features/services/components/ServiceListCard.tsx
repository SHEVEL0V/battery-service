import { Button, Paper, Stack, Typography } from "@mui/material";
import NextLink from "@/components/ui/NextLink";
import type { Dictionary, Locale } from "@/dictionaries";
import type { Service } from "@/types";
import { formatPrice } from "../format";

interface Props {
  service: Service;
  lang: Locale;
  dict: Dictionary["servicesPage"];
}

export function ServiceListCard({ service, lang, dict }: Props) {
  const title = lang === "uk" ? service.titleUk : service.titleEn;
  const desc = lang === "uk" ? service.descUk : service.descEn;

  return (
    <Paper sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography variant="h3" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {desc}
      </Typography>

      <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
        <Stack>
          <Typography variant="caption" color="text.secondary">
            {dict.priceLabel}
          </Typography>
          <Typography variant="h5" color="primary">
            {formatPrice(service.price, lang)}
          </Typography>
        </Stack>
        <Stack>
          <Typography variant="caption" color="text.secondary">
            {dict.durationLabel}
          </Typography>
          <Typography variant="h5">{service.duration}</Typography>
        </Stack>
      </Stack>

      <Button
        component={NextLink}
        href={`/${lang}/services/${service.slug}`}
        variant="outlined"
        sx={{ mt: "auto", alignSelf: "flex-start" }}
      >
        {dict.viewDetails}
      </Button>
    </Paper>
  );
}
