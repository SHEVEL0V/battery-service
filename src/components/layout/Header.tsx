"use client";
import { Box, Button, Container, Stack } from "@mui/material";
import Link from "next/link";
import { ThemeToggle } from "../ui/ThemeToggle";
import routes from "../../routes";
import { Dictionary } from "@/dictionaries";
import LocaleSwitcher from "@/components/ui/LocaleSwitcher";

export function Header({ dict }: { dict: Dictionary["nav"] }) {
  return (
    <Box
      component="header"
      sx={{
        py: 2,
        borderBottom: "1px solid",
        borderColor: "divider",
        bgcolor: "background.paper",
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
            href={routes.home}
            sx={{
              fontSize: "1.5rem",
              fontWeight: 800,
              color: "primary.main",
              textDecoration: "none",
            }}
          >
            Tesla Battery
          </Box>

          {/* Navigation */}
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            {/* Links */}
            <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
              <Button component={Link} href={routes.services} color="inherit" size="small">
                {dict.services}
              </Button>
              <Button component={Link} href={routes.contacts} color="inherit" size="small">
                {dict.contacts}
              </Button>
            </Stack>

            {/* Action button */}
            <Button
              component={Link}
              href={routes.booking}
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
