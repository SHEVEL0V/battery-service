"use client";
import { Box, Button, Container, Stack } from "@mui/material";
import NextLink from "@/components/ui/NextLink";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";
import type { Dictionary, Locale } from "@/i18n/config";
import routes from "@/lib/routing/routes";
import { logout } from "@/features/auth/actions";

export function AdminHeader({ dict, lang }: { dict: Dictionary["admin"]; lang: Locale }) {
  const r = routes(lang);
  const pathname = usePathname();

  const links = [
    { href: r.admin, label: dict.dashboard },
    { href: r.adminBookings, label: dict.bookings },
    { href: r.adminServices, label: dict.services },
    { href: r.adminReviews, label: dict.reviews },
    { href: r.adminContacts, label: dict.contacts },
  ];

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
            component={NextLink}
            href={r.admin}
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
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
              {links.map(({ href, label }) => (
                <Button
                  key={href}
                  component={NextLink}
                  href={href}
                  color={pathname === href ? "primary" : "inherit"}
                  size="small"
                >
                  {label}
                </Button>
              ))}
            </Stack>

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
              <Button component={NextLink} href={r.home} color="inherit" size="small">
                {dict.viewSite}
              </Button>
              <ThemeToggle />
              <LocaleSwitcher />
              <Box component="form" action={logout}>
                <input type="hidden" name="lang" value={lang} />
                <Button type="submit" color="inherit" size="small">
                  {dict.logout}
                </Button>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
