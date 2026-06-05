"use client";

import { Box, Button, Container, Stack } from "@mui/material";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface HeaderProps {
  locale: string;
  dict: any;
}

export function Header({ locale, dict }: HeaderProps) {
  return (
    <Box
      component="header"
      sx={{
        py: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Container maxWidth="lg">
        <Stack direction="row" sx={{ justifyContent: "center", alignItems: "center" }}>
          <Box
            component={Link}
            href={`/${locale}`}
            sx={{
              fontSize: "1.5rem",
              fontWeight: 700,
              color: "primary.main",
              textDecoration: "none",
            }}
          >
            Tesla Battery
          </Box>
          <Stack direction="row" sx={{ justifyContent: "center", gap: 2 }}>
            <Button component={Link} href={`/${locale}/services`} size="small">
              {dict.nav.services}
            </Button>
            <Button component={Link} href={`/${locale}/booking`} size="small">
              {dict.nav.booking}
            </Button>
            <Button component={Link} href={`/${locale}/contacts`} size="small">
              {dict.nav.contacts}
            </Button>
            <LanguageSwitcher locale={locale} />
            <ThemeToggle />
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
