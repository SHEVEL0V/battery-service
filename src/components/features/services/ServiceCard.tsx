import { Paper, Typography } from "@mui/material";
import type { Dictionary } from "@/dictionaries";

type ServiceItem = Dictionary["services"]["services"][number];

export function ServiceCard({ title, desc, price }: ServiceItem) {
  return (
    <Paper
      sx={{
        p: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography variant="h3" gutterBottom>
        {title}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
        {desc}
      </Typography>
      <Typography variant="h4" color="primary" sx={{ mt: "auto" }}>
        {price}
      </Typography>
    </Paper>
  );
}
