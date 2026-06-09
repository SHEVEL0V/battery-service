"use client";

import { usePathname, useRouter } from "next/navigation";
import { Select, MenuItem, FormControl, InputAdornment, SelectChangeEvent } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language";

const locales = [
  { code: "en", label: "English" },
  { code: "uk", label: "Українська" },
];

export default function LocaleSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const currentLocale = pathname?.split("/")[1] || "en";

  const handleLocaleChange = (event: SelectChangeEvent) => {
    const newLocale = event.target.value;
    if (!pathname) return;

    const segments = pathname.split("/");
    segments[1] = newLocale;
    const newPathname = segments.join("/");

    router.push(newPathname);
  };

  return (
    <FormControl variant="standard" size="small" sx={{ minWidth: 140 }}>
      <Select
        value={currentLocale}
        onChange={handleLocaleChange}
        startAdornment={
          <InputAdornment position="start" sx={{ mr: 0.5 }}>
            <LanguageIcon sx={{ fontSize: "small", color: "action.active" }} />
          </InputAdornment>
        }
        sx={{
          borderRadius: 2,
          "& .MuiSelect-select": {
            py: 1,
          },
        }}
      >
        {locales.map((locale) => (
          <MenuItem key={locale.code} value={locale.code}>
            {locale.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
