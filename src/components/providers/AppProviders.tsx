"use client";

import { MuiThemeProvider } from "./MuiThemeProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return <MuiThemeProvider>{children}</MuiThemeProvider>;
}
