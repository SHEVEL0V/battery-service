"use client";

import { Button, Menu, MenuItem } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";

interface LanguageSwitcherProps {
  locale: string;
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const languages = [
    { code: "uk", label: "Українська" },
    { code: "en", label: "English" },
  ];

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageChange = (lang: string) => {
    const newPathname = pathname.replace(/^\/(uk|en)/, `/${lang}`);
    router.push(newPathname);
    handleClose();
  };

  return (
    <>
      <Button onClick={handleClick} size="small">
        {locale.toUpperCase()}
      </Button>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={locale === lang.code}
          >
            {lang.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
