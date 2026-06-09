"use client";

import { IconButton, useColorScheme } from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { mode, setMode } = useColorScheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !mode) {
    return (
      <IconButton size="small" disabled>
        <Brightness4Icon fontSize="small" />
      </IconButton>
    );
  }

  const isDarkMode = mode === "dark";

  return (
    <IconButton
      onClick={() => setMode(isDarkMode ? "light" : "dark")}
      size="small"
      color="inherit"
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 2,
        p: 0.75,
      }}
    >
      {isDarkMode ? (
        <Brightness7Icon fontSize="small" sx={{ color: "amber.main" }} />
      ) : (
        <Brightness4Icon fontSize="small" />
      )}
    </IconButton>
  );
}
