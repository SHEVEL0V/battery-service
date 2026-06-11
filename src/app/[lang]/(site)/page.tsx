import { Hero } from "@/features/hero/components/Hero";
import { Stats } from "@/features/stats/Stats";
import { ServicesList } from "@/features/services/components/ServicesList";
import { HowItWorks } from "@/features/how-it-works/HowItWorks";
import { WhyUs } from "@/features/why-us/WhyUs";
import { ReviewsCarousel } from "@/features/reviews/components/ReviewsCarousel";
import { BookingCTA } from "@/features/booking/components/BookingCTA";
import { MapSection } from "@/features/map/components/MapSection";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/i18n/config";
import { getActiveServices } from "@/features/services/queries";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const [
    { hero, stats, services, howItWorks, whyUs, reviews, bookingCTA, map },
    activeServices,
  ] = await Promise.all([getDictionary(lang), getActiveServices(lang)]);

  return (
    <main>
      <Hero dict={hero} lang={lang} />
      <Stats dict={stats} />
      <ServicesList dict={services} services={activeServices} lang={lang} />
      <HowItWorks dict={howItWorks} />
      <WhyUs dict={whyUs} />
      <ReviewsCarousel dict={reviews} lang={lang} />
      <BookingCTA dict={bookingCTA} lang={lang} />
      <MapSection dict={map} />
    </main>
  );
}
