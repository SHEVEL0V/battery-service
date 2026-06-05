import { Hero } from "@/src/components/sections/Hero";
import { Stats } from "@/src/components/sections/Stats";
import { Services } from "@/src/components/sections/Services";
import { HowItWorks } from "@/src/components/sections/HowItWorks";
import { WhyUs } from "@/src/components/sections/WhyUs";
import { Reviews } from "@/src/components/sections/Reviews";
import { BookingCTA } from "@/src/components/sections/BookingCTA";
import { Map } from "@/src/components/sections/Map";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Stats />
      <Services />
      <HowItWorks />
      <WhyUs />
      <Reviews />
      <BookingCTA />
      <Map />
    </main>
  );
}
