import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default async function SiteLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const { nav, footer } = await getDictionary(lang);

  return (
    <>
      <Header dict={nav} />
      {children}
      <Footer dict={footer} />
    </>
  );
}
