"use client";

import { Box } from "@mui/material";

// Placeholder battery visualization. Swap for an R3F <Canvas> scene once
// three/@react-three/fiber are added to the project.
export function HeroScene() {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 360,
        aspectRatio: "2 / 1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "primary.main",
      }}
    >
      <Box component="svg" viewBox="0 0 200 100" sx={{ width: "100%", height: "100%" }}>
        <rect
          x="5"
          y="10"
          width="180"
          height="80"
          rx="8"
          ry="8"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        />
        <rect x="185" y="35" width="12" height="30" rx="3" ry="3" fill="currentColor" />
        <rect x="15" y="20" width="60" height="60" rx="4" ry="4" fill="currentColor" opacity={0.7} />
        <rect x="85" y="20" width="60" height="60" rx="4" ry="4" fill="currentColor" opacity={0.45} />
        <rect x="155" y="20" width="20" height="60" rx="4" ry="4" fill="currentColor" opacity={0.2} />
      </Box>
    </Box>
  );
}
