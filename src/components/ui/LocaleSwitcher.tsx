"use client";

import { usePathname, useRouter } from "next/navigation";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";

const locales = [
  { code: "uk", label: "UA" },
  { code: "en", label: "EN" },
];

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const currentLocale = pathname?.split("/")[1] || "uk";

  const handleLocaleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newLocale: string | null
  ) => {
    if (!newLocale || !pathname || newLocale === currentLocale) return;

    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
  };

  return (
    <ToggleButtonGroup
      value={currentLocale}
      exclusive
      onChange={handleLocaleChange}
      size="small"
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 0.25,
        gap: 0.25,
        "& .MuiToggleButtonGroup-grouped": {
          border: 0,
          borderRadius: 1.5,
          minWidth: 36,
          px: 1,
          py: 0.25,
          fontSize: "0.75rem",
          fontWeight: 600,
          letterSpacing: "0.02em",
          color: "text.secondary",
          "&.Mui-selected": {
            color: "primary.contrastText",
            bgcolor: "primary.main",
            "&:hover": {
              bgcolor: "primary.main",
            },
          },
        },
      }}
    >
      {locales.map((locale) => (
        <ToggleButton key={locale.code} value={locale.code} aria-label={locale.label}>
          {locale.label}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
