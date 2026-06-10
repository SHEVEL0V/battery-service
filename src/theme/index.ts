"use client";
import { extendTheme } from "@mui/material/styles";
import { Manrope } from "next/font/google";

export const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});

const theme = extendTheme({
  colorSchemeSelector: "data-mui-color-scheme",
  defaultColorScheme: "dark",

  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#CC0000" },
        secondary: { main: "#1A1A1A" },
        background: { default: "#F5F5F5", paper: "#FFFFFF" },
        text: { primary: "#111111", secondary: "#555555" },
      },
    },
    dark: {
      palette: {
        primary: { main: "#CC0000" },
        secondary: { main: "#E5E5E5" },
        background: { default: "#0D0D0D", paper: "#1A1A1A" },
        text: { primary: "#F0F0F0", secondary: "#A0A0A0" },
      },
    },
  },

  typography: {
    fontFamily: "var(--font-manrope), system-ui, sans-serif",
    h1: { fontSize: "3.5rem", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 },
    h2: { fontSize: "2.5rem", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.2 },
    h3: { fontSize: "1.75rem", fontWeight: 600, letterSpacing: "-0.01em" },
    h4: { fontSize: "1.25rem", fontWeight: 600 },
    body1: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.7 },
    body2: { fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.6 },
    button: { fontWeight: 600, letterSpacing: "0.01em", textTransform: "none" as const },
  },
});

export default theme;
