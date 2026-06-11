import { Button, Paper, Stack, Typography } from "@mui/material";
import NextLink from "@/components/ui/NextLink";
import type { Dictionary, Locale } from "@/i18n/config";
import routes from "@/lib/routing/routes";
import type { LocalizedService } from "../types";
import { formatPrice } from "../format";

interface Props {
  service: LocalizedService;
  lang: Locale;
  dict: Dictionary["servicesPage"];
}

export function ServiceListCard({ service, lang, dict }: Props) {
  return (
    <Paper sx={{ p: 3, height: "100%", display: "flex", flexDirection: "column" }}>
      <Typography variant="h3" gutterBottom>
        {service.title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {service.description}
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
        href={routes(lang).service(service.slug)}
        variant="outlined"
        sx={{ mt: "auto", alignSelf: "flex-start" }}
      >
        {dict.viewDetails}
      </Button>
    </Paper>
  );
}
