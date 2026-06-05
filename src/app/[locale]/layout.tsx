import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "./dictionaries";
import { Providers } from "@/src/components/Providers";
import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Tesla Battery Service - Professional Repair",
    description: "Professional Tesla battery repair service",
    viewport: "width=device-width, initial-scale=1",
  };
}

export async function generateStaticParams() {
  return [{ locale: "uk" }, { locale: "en" }];
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!hasLocale(locale)) {
    notFound();
  }

  const dict = await getDictionary(locale);

  return (
    <html lang={locale} suppressHydrationWarning data-theme="light">
      {/*<head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`,
          }}
        />
      </head>*/}
      <body>
        {/*<Providers locale={locale}>*/}
        <Header locale={locale} dict={dict} />
        {children}
        <Footer dict={dict} />
        {/*</Providers>*/}
      </body>
    </html>
  );
}
