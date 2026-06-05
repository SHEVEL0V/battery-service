"use client";

import { ReactNode } from "react";
import { ThemeProvider as MuiThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "next-themes";
import { useTheme } from "next-themes";
import { lightTheme, darkTheme } from "@/src/theme";

interface ProvidersProps {
  children: ReactNode;
  locale: string;
}

function ThemedContent({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme();
  const muiTheme = resolvedTheme === "dark" ? darkTheme : lightTheme;

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="light" storageKey="theme">
      <ThemedContent>{children}</ThemedContent>
    </ThemeProvider>
  );
}
