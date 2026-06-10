"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { Box, Container, Stack, Typography } from "@mui/material";
import { Button } from "@/components/ui/Button";
import NextLink from "@/components/ui/NextLink";

const messages = {
  uk: {
    heading: "Щось пішло не так",
    description: "Сталася непередбачена помилка. Спробуйте ще раз.",
    retry: "Спробувати знову",
    home: "На головну",
  },
  en: {
    heading: "Something went wrong",
    description: "An unexpected error occurred. Please try again.",
    retry: "Try again",
    home: "Go home",
  },
};

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] === "en" ? "en" : "uk";
  const dict = messages[locale];

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Box
      component="section"
      sx={{ py: { xs: 12, md: 16 }, minHeight: "60vh", display: "flex", alignItems: "center" }}
    >
      <Container maxWidth="sm">
        <Stack sx={{ alignItems: "center", textAlign: "center", gap: 2 }}>
          <Typography variant="h3">{dict.heading}</Typography>
          <Typography variant="body1" color="text.secondary">
            {dict.description}
          </Typography>
          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button onClick={() => reset()} variant="contained">
              {dict.retry}
            </Button>
            <Button component={NextLink} href="/" variant="outlined">
              {dict.home}
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}
