"use client";
import { Box, Button, Container, Stack } from "@mui/material";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import type { Dictionary, Locale } from "@/i18n/config";
import routes from "@/lib/routing/routes";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";

export function Header({
  dict,
  lang,
  isAuthenticated,
}: {
  dict: Dictionary["nav"];
  lang: Locale;
  isAuthenticated: boolean;
}) {
  const r = routes(lang);

  return (
    <Box
      component="header"
      sx={{
        py: 2,
        bgcolor: "color-mix(in srgb, var(--mui-palette-background-paper) 72%, transparent)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        position: "sticky",
        top: 0,
        zIndex: 1100,
      }}
    >
      <Container maxWidth="xl">
        {/* Header content */}
        <Stack
          direction="row"
          spacing={2}
          sx={{
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo / Name */}
          <Box
            component={Link}
            href={r.home}
            sx={{
              fontFamily: "var(--font-manrope), system-ui, sans-serif",
              fontSize: "1.25rem",
              fontWeight: 700,
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "primary.main",
              textDecoration: "none",
            }}
          >
            Battery
          </Box>

          {/* Navigation */}
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            {/* Links */}
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
              <Button component={Link} href={r.services} color="inherit" size="small">
                {dict.services}
              </Button>
              <Button component={Link} href={r.contacts} color="inherit" size="small">
                {dict.contacts}
              </Button>
              {isAuthenticated && (
                <Button component={Link} href={r.admin} color="inherit" size="small">
                  {dict.admin}
                </Button>
              )}
            </Stack>

            {/* Action button */}
            <Button
              component={Link}
              href={r.booking}
              variant="contained"
              color="primary"
              size="small"
            >
              {dict.booking}
            </Button>

            {/* Theme and locale switchers */}
            <Stack
              direction="row"
              spacing={0.5}
              sx={{
                alignItems: "center",
                borderLeft: "1px solid",
                borderColor: "divider",
                pl: 2,
              }}
            >
              <ThemeToggle />
              <LocaleSwitcher />
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
