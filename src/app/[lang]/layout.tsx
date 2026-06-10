import type { Metadata } from "next";
import { notFound } from "next/navigation";
import InitColorSchemeScript from "@mui/material/InitColorSchemeScript";
import { hasLocale } from "@/dictionaries";
import { AppProviders } from "@/components/providers/AppProviders";
import { manrope } from "@/theme";

export async function generateStaticParams() {
  return [{ lang: "uk" }, { lang: "en" }];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Tesla Battery Service - Professional Repair",
    description: "Professional Tesla battery repair service",
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html lang={lang} className={manrope.variable} suppressHydrationWarning>
      <head>
        <InitColorSchemeScript attribute="data-mui-color-scheme" defaultMode="dark" />
      </head>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
