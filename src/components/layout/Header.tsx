"use client";
import { useState } from "react";
import { Box, Button, Container, Divider, Drawer, IconButton, Stack } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import NextLink from "@/components/ui/NextLink";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import type { Dictionary, Locale } from "@/i18n/config";
import routes from "@/lib/routing/routes";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";

function NavLinks({
  links,
  size,
  onLinkClick,
}: {
  links: { href: string; label: string }[];
  size: "small" | "large";
  onLinkClick?: () => void;
}) {
  return (
    <>
      {links.map((link) => (
        <Button
          key={link.href}
          component={NextLink}
          href={link.href}
          color="inherit"
          size={size}
          onClick={onLinkClick}
        >
          {link.label}
        </Button>
      ))}
    </>
  );
}

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
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const navLinks = [
    { href: r.services, label: dict.services },
    { href: r.contacts, label: dict.contacts },
    ...(isAuthenticated ? [{ href: r.admin, label: dict.admin }] : []),
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
            component={NextLink}
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

          {/* Desktop navigation */}
          <Stack
            direction="row"
            spacing={2}
            sx={{ alignItems: "center", display: { xs: "none", md: "flex" } }}
          >
            {/* Links */}
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
              <NavLinks links={navLinks} size="small" />
            </Stack>
            {/* Action button */}
            <Button
              component={NextLink}
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

          {/* Mobile burger */}
          <IconButton
            aria-label="menu"
            onClick={() => setMenuOpen(true)}
            sx={{ display: { xs: "inline-flex", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Stack>
      </Container>

      {/* Mobile menu */}
      <Drawer
        anchor="right"
        open={menuOpen}
        onClose={closeMenu}
        slotProps={{ paper: { sx: { width: "min(320px, 100vw)" } } }}
      >
        <Stack sx={{ p: 2, height: "100%" }}>
          <Stack direction="row" sx={{ justifyContent: "flex-end" }}>
            <IconButton aria-label="close menu" onClick={closeMenu}>
              <CloseIcon />
            </IconButton>
          </Stack>

          <Stack spacing={1} sx={{ mt: 2 }}>
            <NavLinks links={navLinks} size="large" onLinkClick={closeMenu} />
          </Stack>
          <Box sx={{ flexGrow: 1 }} />
          <Divider sx={{ mb: 2 }} />
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", justifyContent: "center" }}
          >
          <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "center" }}>
            <ThemeToggle />
            <LocaleSwitcher />
          </Stack>
        </Stack>
      </Drawer>
    </Box>
  );
}
