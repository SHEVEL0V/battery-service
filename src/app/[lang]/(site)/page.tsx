import { Hero } from "@/components/features/hero/Hero";
import { Stats } from "@/components/features/stats/Stats";
import { ServicesList } from "@/components/features/services/ServicesList";
import { HowItWorks } from "@/components/features/howItWorks/HowItWorks";
import { WhyUs } from "@/components/features/whyUs/WhyUs";
import { ReviewsCarousel } from "@/components/features/reviews/ReviewsCarousel";
import { BookingCTA } from "@/components/features/booking/BookingCTA";
import { MapSection } from "@/components/features/map/MapSection";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/dictionaries";

export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const { hero, stats, services, howItWorks, whyUs, reviews, bookingCTA, map } =
    await getDictionary(lang);

  return (
    <main>
      <Hero dict={hero} />
      <Stats dict={stats} />
      <ServicesList dict={services} />
      <HowItWorks dict={howItWorks} />
      <WhyUs dict={whyUs} />
      <ReviewsCarousel dict={reviews} />
      <BookingCTA dict={bookingCTA} />
      <MapSection dict={map} />
    </main>
  );
}
