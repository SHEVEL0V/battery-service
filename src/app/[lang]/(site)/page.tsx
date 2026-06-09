import { Hero } from "@/components/features/hero/Hero";
import { Stats } from "@/components/features/Stats";
import { Services } from "@/components/features/Services";
import { HowItWorks } from "@/components/features/HowItWorks";
import { WhyUs } from "@/components/features/WhyUs";
import { Reviews } from "@/components/features/Reviews";
import { BookingCTA } from "@/components/features/booking/BookingCTA";
import { Map } from "@/components/features/map/Map";
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
      <Services dict={services} />
      <HowItWorks dict={howItWorks} />
      <WhyUs dict={whyUs} />
      <Reviews dict={reviews} />
      <BookingCTA dict={bookingCTA} />
      <Map dict={map} />
    </main>
  );
}
