"use client";

import { useColorScheme } from "@mui/material/styles";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";

export function ThemeToggle() {
  const { mode, setMode } = useColorScheme();

  return (
    <IconButton
      onClick={() => setMode(mode === "dark" ? "light" : "dark")}
      size="small"
      color="inherit"
      title={mode === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      sx={{
        bgcolor: "background.paper",
        borderRadius: "50%",
        p: 0.75,
      }}
    >
      {mode === "dark" ? (
        <Brightness7Icon fontSize="small" />
      ) : (
        <Brightness4Icon fontSize="small" />
      )}
    </IconButton>
  );
}
