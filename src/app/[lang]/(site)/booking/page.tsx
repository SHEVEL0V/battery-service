import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/i18n/config";
import { BookingForm } from "@/features/booking/components/BookingForm";

export default async function BookingPage({ params }: PageProps<"/[lang]/booking">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const { booking, errors } = await getDictionary(lang);

  return <BookingForm dict={booking} errorsDict={errors} lang={lang} />;
}
