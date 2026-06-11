import { alpha } from "@mui/material/styles";
import type { SxProps, Theme } from "@mui/material";

/**
 * CSS variables for an image overlay that flips between a light wash and a
 * dark wash depending on the active MUI color scheme. Used by sections with
 * a full-bleed background photo so body text stays readable in both themes.
 */
export const adaptiveOverlayVarsSx: SxProps<Theme> = {
  position: "relative",
  overflow: "hidden",
  color: "var(--section-text-primary)",
  "--section-text-primary": "#111111",
  "--section-text-secondary": "rgba(17, 17, 17, 0.72)",
  "--section-image-overlay":
    "linear-gradient(90deg, rgba(255, 255, 255, 0.82), rgba(255, 255, 255, 0.48), rgba(255, 255, 255, 0.18))",
  '[data-mui-color-scheme="dark"] &': {
    "--section-text-primary": "#FFFFFF",
    "--section-text-secondary": "rgba(255, 255, 255, 0.78)",
    "--section-image-overlay":
      "linear-gradient(90deg, rgba(0, 0, 0, 0.86), rgba(0, 0, 0, 0.56), rgba(0, 0, 0, 0.26))",
  },
};

export const adaptiveOverlaySx: SxProps<Theme> = {
  background: "var(--section-image-overlay)",
};

/** Brand red wash matching theme.palette.primary — used over photos in CTA sections. */
export const brandOverlaySx: SxProps<Theme> = (theme) => ({
  background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.9)} 0%, ${alpha(theme.palette.primary.dark, 0.88)} 100%)`,
});
