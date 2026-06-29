import { Container, Marquee, SectionHeading } from "@estatify/ui";
import { FeaturesBento } from "@/components/landing/features-bento";
import {
  CtaBandPolished,
  PricingGrid,
  TestimonialsMarquee,
} from "@/components/landing/closing-sections";
import { ShowcaseGrid, StepsGrid } from "@/components/landing/steps-showcase";
import { logos } from "@/components/landing-data";

/** Logos marquee — social proof. */
export function Logos() {
  return (
    <section className="border-y border-border bg-secondary/30 pb-12 pt-[clamp(11rem,32vw,18rem)]">
      <Container className="flex flex-col gap-8">
        <p className="text-center text-body-sm text-muted-foreground">
          Trusted by growing agencies across the continent
        </p>
        <Marquee speed={34}>
          {logos.map((name) => (
            <div
              key={name}
              className="flex h-12 items-center rounded-lg border border-border bg-card px-6 text-body-sm font-semibold text-muted-foreground"
            >
              {name}
            </div>
          ))}
        </Marquee>
      </Container>
    </section>
  );
}

/** Features — editorial bento grid (reference layout). */
export function Features() {
  return (
    <section id="features" className="py-24 sm:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Everything in one place"
          title="The whole stack to run your agency"
          description="Replace the patchwork of website builders, spreadsheets, and inboxes with one platform built for real estate."
        />
        <FeaturesBento />
      </Container>
    </section>
  );
}

/** How it works — three steps. */
export function Steps() {
  return (
    <section className="border-y border-border bg-secondary/30 py-24 sm:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="How it works"
          title="Live in three steps"
          description="From blank canvas to live listings — most agencies are up and running in a single weekend."
        />
        <StepsGrid />
      </Container>
    </section>
  );
}

/** Showcase — property listing cards. */
export function Showcase() {
  return (
    <section id="showcase" className="py-24 sm:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Showcase"
          title="Listings that look the part"
          description="Every property gets a premium, mobile-first card — automatically themed to your brand."
        />
        <ShowcaseGrid />
      </Container>
    </section>
  );
}

/** Testimonials — marquee of quotes. */
export function Testimonials() {
  return (
    <section className="border-y border-border bg-secondary/30 py-24 sm:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Loved by agencies"
          title="Don't take our word for it"
          description="Real feedback from agencies who switched to Estatify."
        />
        <TestimonialsMarquee />
      </Container>
    </section>
  );
}

/** Pricing — three tiers. */
export function Pricing() {
  return (
    <section id="pricing" className="py-24 sm:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple plans that scale with you"
          description="Start free. Upgrade when you grow. Cancel anytime."
        />
        <PricingGrid />
      </Container>
    </section>
  );
}

/** Final CTA band. */
export function CtaBand() {
  return (
    <section className="py-24 sm:py-28">
      <Container>
        <CtaBandPolished />
      </Container>
    </section>
  );
}
