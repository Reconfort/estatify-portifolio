import type { ReactNode } from "react";
import {
  BarChart3,
  Building2,
  Globe,
  LayoutGrid,
  Target,
  Users,
  Check,
} from "lucide-react";
import {
  Badge,
  BentoCard,
  BentoGrid,
  Button,
  Container,
  Marquee,
  SectionHeading,
  TiltCard,
} from "@estatify/ui";
import { features, logos, pricing, showcase, steps, testimonials } from "@/components/landing-data";

const featureIcons: Record<string, ReactNode> = {
  sites: <Globe className="h-5 w-5" />,
  listings: <LayoutGrid className="h-5 w-5" />,
  leads: <Target className="h-5 w-5" />,
  agents: <Users className="h-5 w-5" />,
  analytics: <BarChart3 className="h-5 w-5" />,
};

/** Logos marquee — social proof. */
export function Logos() {
  return (
    <section className="border-y border-border bg-secondary/30 py-12">
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

/** Features — bento grid. */
export function Features() {
  return (
    <section id="features" className="py-24 sm:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Everything in one place"
          title="The whole stack to run your agency"
          description="Replace the patchwork of website builders, spreadsheets, and inboxes with one platform built for real estate."
        />
        <BentoGrid>
          {features.map((f) => (
            <BentoCard
              key={f.key}
              className={f.span}
              icon={featureIcons[f.key] ?? <Building2 className="h-5 w-5" />}
              title={f.title}
              description={f.description}
            />
          ))}
        </BentoGrid>
      </Container>
    </section>
  );
}

/** How it works — three steps. */
export function Steps() {
  return (
    <section className="border-y border-border bg-secondary/30 py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading eyebrow="How it works" title="Live in three steps" />
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-6">
              <span className="text-display-md font-bold text-primary/30">{s.n}</span>
              <h3 className="text-h4 text-card-foreground">{s.title}</h3>
              <p className="text-body-sm text-muted-foreground">{s.body}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/** Showcase — tilt property cards. */
export function Showcase() {
  return (
    <section id="showcase" className="py-24 sm:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Showcase"
          title="Listings that look the part"
          description="Every property gets a premium, mobile-first card — automatically themed to your brand."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {showcase.map((p) => (
            <TiltCard key={p.name} className="overflow-hidden">
              <div className="relative h-44 bg-gradient-to-br from-primary/15 via-secondary to-accent/20">
                <span className="absolute left-3 top-3">
                  <Badge variant="accent">{p.tag}</Badge>
                </span>
              </div>
              <div className="space-y-1 p-5">
                <h3 className="text-h5 text-card-foreground">{p.name}</h3>
                <p className="text-body-sm text-muted-foreground">{p.location}</p>
                <p className="pt-2 text-h5 text-primary">{p.price}</p>
              </div>
            </TiltCard>
          ))}
        </div>
      </Container>
    </section>
  );
}

/** Testimonials — marquee of quotes. */
export function Testimonials() {
  return (
    <section className="border-y border-border bg-secondary/30 py-24">
      <Container className="flex flex-col gap-12">
        <SectionHeading eyebrow="Loved by agencies" title="Don't take our word for it" />
        <Marquee speed={42}>
          {testimonials.map((t) => (
            <figure
              key={t.name}
              className="flex w-80 shrink-0 flex-col gap-4 rounded-2xl border border-border bg-card p-6"
            >
              <blockquote className="text-body-md text-card-foreground">&ldquo;{t.quote}&rdquo;</blockquote>
              <figcaption className="text-body-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{t.name}</span> · {t.role}
              </figcaption>
            </figure>
          ))}
        </Marquee>
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
        <div className="grid gap-6 lg:grid-cols-3">
          {pricing.map((tier) => (
            <div
              key={tier.name}
              className={
                "flex flex-col gap-6 rounded-2xl border p-8 " +
                (tier.featured
                  ? "border-primary bg-card shadow-lg ring-1 ring-primary"
                  : "border-border bg-card")
              }
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-h4 text-card-foreground">{tier.name}</h3>
                  {tier.featured ? <Badge variant="primary">Most popular</Badge> : null}
                </div>
                <p className="text-body-sm text-muted-foreground">{tier.blurb}</p>
              </div>
              <p className="flex items-end gap-1">
                <span className="text-display-md text-foreground">{tier.price}</span>
                <span className="pb-2 text-body-sm text-muted-foreground">{tier.cadence}</span>
              </p>
              <ul className="flex flex-col gap-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-body-sm text-card-foreground">
                    <Check className="h-4 w-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant={tier.featured ? "primary" : "outline"} className="mt-auto w-full">
                {tier.cta}
              </Button>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

/** Final CTA band. */
export function CtaBand() {
  return (
    <section className="py-24">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-primary px-8 py-16 text-center">
          <div className="relative flex flex-col items-center gap-6">
            <h2 className="max-w-2xl text-h1 text-primary-foreground sm:text-display-md">
              Your agency's platform is one weekend away
            </h2>
            <p className="max-w-xl text-body-lg text-primary-foreground/80">
              Join the agencies building branded, lead-generating property sites with Estatify.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" variant="accent">
                Start free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              >
                Book a demo
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
