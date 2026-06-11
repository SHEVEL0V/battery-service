import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/i18n/config";
import { decrypt } from "@/lib/auth/session";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default async function SiteLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const { nav, footer } = await getDictionary(lang);

  const sessionCookie = (await cookies()).get("session")?.value;
  const session = await decrypt(sessionCookie);
  const isAuthenticated = Boolean(session?.userId);

  return (
    <>
      <Header dict={nav} lang={lang} isAuthenticated={isAuthenticated} />
      {children}
      <Footer dict={footer} />
    </>
  );
}
