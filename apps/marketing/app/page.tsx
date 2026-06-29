import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/landing/hero";
import {
  CtaBand,
  Features,
  Logos,
  Pricing,
  Showcase,
  Steps,
  Testimonials,
} from "@/components/landing/sections";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <Logos />
        <Features />
        <Steps />
        <Showcase />
        <Testimonials />
        <Pricing />
        <CtaBand />
      </main>
      <SiteFooter />
    </>
  );
}
