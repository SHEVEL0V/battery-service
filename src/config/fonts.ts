import { Manrope } from "next/font/google";

export const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
});
