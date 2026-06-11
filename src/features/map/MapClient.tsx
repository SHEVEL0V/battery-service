"use client";

import { Box, Grid, Paper, Stack, Typography, useColorScheme } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import { ScrollReveal } from "@/components/animation/ScrollReveal";
import type { Dictionary } from "@/i18n/config";
import { MAP_CONFIG } from "@/config/maps";

interface Props {
  dict: Dictionary["map"];
}

const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

function MapView() {
  const { mode } = useColorScheme();

  return (
    <Map
      defaultCenter={MAP_CONFIG.center}
      defaultZoom={MAP_CONFIG.zoom}
      colorScheme={mode === "light" ? "LIGHT" : "DARK"}
      disableDefaultUI
      gestureHandling="cooperative"
    >
      <Marker position={MAP_CONFIG.center} />
    </Map>
  );
}

export function MapClient({ dict }: Props) {
  return (
    <Stack spacing={4}>
      <Box
        sx={{
          width: "100%",
          height: "400px",
          bgcolor: "background.paper",
          borderRadius: 0.5,
          overflow: "hidden",
        }}
      >
        {apiKey ? (
          <APIProvider apiKey={apiKey}>
            <MapView />
          </APIProvider>
        ) : (
          <Box
            sx={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography color="text.secondary">{dict.description}</Typography>
          </Box>
        )}
      </Box>

      <Grid container spacing={3} sx={{ alignItems: "stretch" }}>
        {[
          { icon: <LocationOnIcon color="primary" />, label: dict.address, value: dict.addressValue, direction: "left" as const },
          { icon: <PhoneIcon color="primary" />, label: dict.phone, value: dict.phoneValue, direction: "up" as const },
          { icon: <AccessTimeIcon color="primary" />, label: dict.hours, value: dict.hoursValue, direction: "right" as const },
        ].map(({ icon, label, value, direction }) => (
          <Grid size={{ xs: 12, md: 4 }} key={label} sx={{ display: "flex" }}>
            <ScrollReveal direction={direction} style={{ width: "100%" }}>
              <Paper sx={{ p: 3, height: "100%" }}>
                <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 1.5 }}>
                  {icon}
                  <Typography variant="h4">{label}</Typography>
                </Stack>
                <Typography color="text.secondary" sx={{ whiteSpace: "pre-line" }}>
                  {value}
                </Typography>
              </Paper>
            </ScrollReveal>
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
