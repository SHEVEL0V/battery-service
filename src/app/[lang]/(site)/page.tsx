import { Hero } from "@/features/hero/Hero";
import { Stats } from "@/features/stats/Stats";
import { ServicesList } from "@/features/services/components/ServicesList";
import { HowItWorks } from "@/features/how-it-works/HowItWorks";
import { WhyUs } from "@/features/why-us/WhyUs";
import { ReviewsCarousel } from "@/features/reviews/ReviewsCarousel";
import { BookingCTA } from "@/features/booking/components/BookingCTA";
import { MapSection } from "@/features/map/MapSection";
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
