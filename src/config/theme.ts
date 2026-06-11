"use client";
import { extendTheme } from "@mui/material/styles";

const theme = extendTheme({
  colorSchemeSelector: "data-mui-color-scheme",
  defaultColorScheme: "dark",

  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#CC0000" },
        secondary: { main: "#171A20" },
        background: { default: "#FFFFFF", paper: "#F4F4F4" },
        text: { primary: "#171A20", secondary: "#5C5E62" },
      },
    },
    dark: {
      palette: {
        primary: { main: "#CC0000" },
        secondary: { main: "#F5F5F5" },
        background: { default: "#000000", paper: "#171A20" },
        text: { primary: "#F5F5F5", secondary: "#8E8E93" },
      },
    },
  },

  shape: {
    borderRadius: 16,
  },

  typography: {
    fontFamily: "var(--font-manrope), system-ui, sans-serif",
    h1: { fontSize: "3.5rem", fontWeight: 700, letterSpacing: "-0.02em", lineHeight: 1.1 },
    h2: { fontSize: "2.5rem", fontWeight: 600, letterSpacing: "-0.01em", lineHeight: 1.2 },
    h3: { fontSize: "1.75rem", fontWeight: 600, letterSpacing: "-0.01em" },
    h4: { fontSize: "1.25rem", fontWeight: 600 },
    body1: { fontSize: "1rem", fontWeight: 400, lineHeight: 1.7 },
    body2: { fontSize: "0.875rem", fontWeight: 400, lineHeight: 1.6 },
    button: { fontWeight: 600, fontSize: "0.9375rem", letterSpacing: "normal", textTransform: "none" as const },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "999px",
          paddingInline: "24px",
          paddingBlock: "12px",
          boxShadow: "none",
          "&:hover": { boxShadow: "none" },
        },
        sizeLarge: {
          paddingInline: "32px",
          paddingBlock: "16px",
          fontSize: "1rem",
        },
        sizeSmall: {
          paddingInline: "16px",
          paddingBlock: "8px",
          fontSize: "0.8125rem",
        },
        outlined: {
          borderWidth: "1px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow: "none",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: "999px",
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          borderRadius: "999px",
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: "999px",
          border: 0,
        },
      },
    },
  },
});

export default theme;
