import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/landing/hero";
import {
  AboutStats,
  Commitment,
  CtaBand,
  Enquiry,
  HowItWorks,
  Logos,
  Pricing,
  ServicesList,
  TemplateShowcase,
} from "@/components/landing/sections";

/**
 * Landing page — ordered as a 30-second trust funnel:
 * what it is (Hero) → who uses it (Logos) → how it works (Steps) →
 * the product (Templates) → what you get (Services) → proof (Stats,
 * Commitment) → price (Pricing) → act (Enquiry, CTA).
 *
 * The Hero is pinned (sticky); this curtain wrapper scrolls over it with a
 * rounded top edge — the section-transition parallax.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <Hero />
        <div className="relative z-10 -mt-10 rounded-t-3xl bg-background shadow-[0_-24px_48px_-24px_rgba(0,0,0,0.35)]">
          <Logos />
          <HowItWorks />
          <TemplateShowcase />
          <ServicesList />
          <AboutStats />
          <Commitment />
          <Pricing />
          <Enquiry />
          <CtaBand />
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
