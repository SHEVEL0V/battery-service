import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import { MuiProvider } from "@/components/providers/MuiProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "uk" }];
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Tesla Battery Service - Professional Repair",
    description: "Professional Tesla battery repair service",
    viewport: "width=device-width, initial-scale=1",
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const { nav, footer } = await getDictionary(lang);

  return (
    <html lang={lang} suppressHydrationWarning data-theme="light">
      <body>
        <MuiProvider>
          <Header dict={nav} />
          {children}
          <Footer dict={footer} />
        </MuiProvider>
      </body>
    </html>
  );
}
