import { Box } from "@mui/material";
import type { SxProps, Theme } from "@mui/material";
import Image from "next/image";

interface Props {
  src: string;
  alt?: string;
  priority?: boolean;
  overlaySx: SxProps<Theme>;
}

/** Full-bleed background photo with a tinted overlay, placed behind section content. */
export function SectionBackgroundImage({ src, alt = "", priority = false, overlaySx }: Props) {
  return (
    <Box aria-hidden sx={{ position: "absolute", inset: 0, zIndex: 0 }}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        loading={priority ? undefined : "lazy"}
        sizes="100vw"
        style={{ objectFit: "cover" }}
      />
      <Box
        sx={[
          { position: "absolute", inset: 0 },
          ...(Array.isArray(overlaySx) ? overlaySx : [overlaySx]),
        ]}
      />
    </Box>
  );
}
