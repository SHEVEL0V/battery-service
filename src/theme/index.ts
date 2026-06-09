import { extendTheme } from "@mui/material/styles";

export const theme = extendTheme({
  colorSchemeSelector: "data",

  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#CC0000",
        },
        secondary: {
          main: "#1A1A1A",
        },
        background: {
          default: "linear-gradient(135deg, #F5F5F5 0%, #EAEAEA 100%)",
          paper: "#FFFFFF",
        },
        text: {
          primary: "#1A1A1A",
          secondary: "#666666",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#CC0000",
        },
        secondary: {
          main: "#E5E5E5",
        },
        background: {
          default: "linear-gradient(135deg, #0A0A0A 0%, #1A1A1A 100%)",
          paper: "#141414",
        },
        text: {
          primary: "#E5E5E5",
          secondary: "#999999",
        },
      },
    },
  },

  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Oxygen", "Ubuntu", sans-serif',
    h1: {
      fontSize: "3.5rem",
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h3: {
      fontSize: "1.8rem",
      fontWeight: 600,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.6,
    },
  },
});

export default theme;
