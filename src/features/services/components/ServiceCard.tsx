import { Paper, Typography } from "@mui/material";
import type { Locale } from "@/config/locales";
import type { LocalizedService } from "../types";
import { formatPrice } from "../format";

interface Props {
  service: LocalizedService;
  lang: Locale;
}

export function ServiceCard({ service, lang }: Props) {
  return (
    <Paper
      sx={{
        p: 3,
        height: "100%",
        minHeight: 220,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h3" gutterBottom>
        {service.title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {service.description}
      </Typography>
      <Typography variant="h4" color="primary" sx={{ mt: "auto" }}>
        {formatPrice(service.price, lang)}
      </Typography>
    </Paper>
  );
}
