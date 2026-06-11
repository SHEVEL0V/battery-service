import { notFound } from "next/navigation";
import { verifySession } from "@/lib/auth/dal";
import { getDictionary, hasLocale } from "@/i18n/config";
import { AdminHeader } from "@/components/layout/AdminHeader";

export default async function AdminLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  await verifySession(lang);
  const { admin } = await getDictionary(lang);

  return (
    <>
      <AdminHeader dict={admin} lang={lang} />
      {children}
    </>
  );
}
