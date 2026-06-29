import type { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@estatify/utils";
import {
  ArrowRightIcon,
  CheckIcon,
  MenuIcon,
  SearchIcon,
} from "@estatify/ui/icons";
import {
  Badge,
  Button,
  Container,
  Marquee,
  SectionHeading,
  TiltCard,
} from "@estatify/ui";
import { features, logos, pricing, showcase, steps, testimonials } from "@/components/landing-data";

const featureCopy = Object.fromEntries(features.map((f) => [f.key, f])) as Record<
  (typeof features)[number]["key"],
  (typeof features)[number]
>;

function BentoShell({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/70 bg-card shadow-md",
        className,
      )}
    >
      {children}
    </div>
  );
}

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
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 md:grid-rows-[minmax(17rem,auto)_minmax(17rem,auto)]">
          <ListingsBentoCard />
          <AgentsBentoCard />
          <SitesSearchBentoCard />
          <AnalyticsBentoCard />
        </div>
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
                    <CheckIcon className="h-4 w-4 shrink-0 text-primary" />
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

function ListingsBentoCard() {
  const { title, description } = featureCopy.listings;
  const tags = ["For sale", "For rent", "New build"] as const;

  return (
    <BentoShell className="flex flex-col p-6 md:col-start-1 md:row-start-1">
      <h3 className="text-h4 text-card-foreground">{title}</h3>
      <p className="mt-2 text-body-sm leading-relaxed text-muted-foreground">{description}</p>
      <div className="relative mt-5 min-h-44 flex-1 overflow-hidden rounded-2xl">
        <Image
          src="/assets/bento/listings-agent.jpg"
          alt="Real estate agent reviewing property listings"
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 bg-gradient-to-t from-black/55 via-black/20 to-transparent p-4 pt-10">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/25 bg-white/15 px-3 py-1 text-caption font-medium text-white backdrop-blur-md"
            >
              {tag}
            </span>
          ))}
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 bg-white/15 text-white backdrop-blur-md">
            <ArrowRightIcon className="h-4 w-4" />
          </span>
        </div>
      </div>
      <p className="mt-3 text-caption text-muted-foreground">
        <span className="font-medium text-foreground">{featureCopy.leads.title}</span> —{" "}
        {featureCopy.leads.description}
      </p>
    </BentoShell>
  );
}

function AgentsBentoCard() {
  const { title, description } = featureCopy.agents;
  const agents = [
    { src: "/assets/bento/agent-1.jpg", className: "left-[8%] top-[18%]" },
    { src: "/assets/bento/agent-2.jpg", className: "right-[8%] top-[22%]" },
    { src: "/assets/bento/agent-3.jpg", className: "left-[18%] bottom-[12%]" },
    { src: "/assets/bento/agent-4.jpg", className: "right-[16%] bottom-[10%]" },
  ] as const;

  return (
    <BentoShell className="flex flex-col p-6 md:col-start-2 md:row-start-1">
      <h3 className="text-h4 text-card-foreground">{title}</h3>
      <p className="mt-2 text-body-sm leading-relaxed text-muted-foreground">{description}</p>
      <div className="relative mt-4 min-h-52 flex-1" aria-hidden>
        <svg className="absolute inset-0 h-full w-full text-border" viewBox="0 0 320 200">
          <line x1="160" y1="92" x2="72" y2="52" stroke="currentColor" strokeDasharray="5 5" />
          <line x1="160" y1="92" x2="248" y2="58" stroke="currentColor" strokeDasharray="5 5" />
          <line x1="160" y1="92" x2="96" y2="158" stroke="currentColor" strokeDasharray="5 5" />
          <line x1="160" y1="92" x2="236" y2="162" stroke="currentColor" strokeDasharray="5 5" />
        </svg>
        <div className="absolute left-1/2 top-[46%] z-10 h-16 w-16 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full border-4 border-card shadow-md ring-2 ring-primary/20">
          <Image
            src="/assets/bento/agent-1.jpg"
            alt=""
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        {agents.map((agent) => (
          <div
            key={agent.src}
            className={cn(
              "absolute h-11 w-11 overflow-hidden rounded-full border-2 border-card shadow-sm",
              agent.className,
            )}
          >
            <Image src={agent.src} alt="" fill sizes="44px" className="object-cover" />
          </div>
        ))}
      </div>
    </BentoShell>
  );
}

function SitesSearchBentoCard() {
  const { title, description } = featureCopy.sites;

  return (
    <BentoShell className="flex min-h-[28rem] flex-col md:col-start-3 md:row-span-2 md:row-start-1">
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-caption font-bold text-primary-foreground">
            E
          </span>
          <span className="text-body-sm font-semibold text-foreground">yourcompany.estatify.rw</span>
        </div>
        <MenuIcon className="h-5 w-5 text-muted-foreground" aria-hidden />
      </div>

      <div className="flex flex-col gap-4 px-5 pt-6 text-center">
        <div>
          <h3 className="text-h4 text-card-foreground">{title}</h3>
          <p className="mt-2 text-body-sm text-muted-foreground">{description}</p>
        </div>

        <div className="relative mx-auto w-full max-w-sm">
          <div className="flex items-center gap-2 rounded-full border border-border/80 bg-background px-4 py-2.5 shadow-[inset_0_2px_8px_rgba(0,0,0,0.06),0_8px_24px_rgba(0,0,0,0.06)]">
            <SearchIcon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
            <span className="flex-1 truncate text-left text-body-sm text-muted-foreground">
              Search homes, plots, rentals…
            </span>
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
              <SearchIcon className="h-4 w-4" aria-hidden />
            </span>
          </div>
        </div>
      </div>

      <div className="relative mt-auto min-h-48 flex-1 overflow-hidden">
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-card via-card/40 to-transparent"
        />
        <Image
          src="/assets/bento/property-search-sm.gif"
          alt="Animated property search illustration"
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover object-bottom"
        />
      </div>

      <div className="border-t border-border/60 bg-secondary/20 px-4 py-3">
        <Marquee speed={28} className="opacity-70">
          {logos.slice(0, 5).map((name) => (
            <span
              key={name}
              className="px-4 text-caption font-semibold uppercase tracking-wider text-muted-foreground"
            >
              {name}
            </span>
          ))}
        </Marquee>
      </div>
    </BentoShell>
  );
}

function AnalyticsBentoCard() {
  const { title, description } = featureCopy.analytics;

  return (
    <BentoShell className="md:col-span-2 md:col-start-1 md:row-start-2">
      <div
        className="relative flex min-h-56 flex-col justify-between gap-6 overflow-hidden p-6 sm:min-h-64 sm:flex-row sm:items-center sm:p-8"
        style={{
          background:
            "linear-gradient(105deg, color-mix(in oklab, var(--color-accent) 88%, white) 0%, color-mix(in oklab, var(--color-primary) 78%, black) 58%, color-mix(in oklab, var(--color-primary) 92%, black) 100%)",
        }}
      >
        <div className="relative z-10 max-w-md">
          <h3 className="text-h3 text-white sm:text-h2">{title}</h3>
          <p className="mt-3 text-body-sm leading-relaxed text-white/85 sm:text-body-md">
            {description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              size="sm"
              className="rounded-full bg-primary-foreground text-primary hover:bg-primary-foreground/90"
            >
              View dashboard
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full border-white/35 bg-white/10 text-white hover:bg-white/20"
            >
              See reports
            </Button>
          </div>
        </div>

        <div className="relative z-10 mx-auto h-48 w-full max-w-xs shrink-0 sm:mx-0 sm:h-56 sm:w-72">
          <div className="absolute -right-3 -top-3 h-full w-[88%] rotate-2 rounded-2xl border border-white/20 bg-white/95 p-4 shadow-xl">
            <p className="text-caption font-semibold uppercase tracking-wide text-primary">
              Portfolio pulse
            </p>
            <div className="mt-3 flex items-end gap-1.5">
              {[42, 58, 48, 72, 64, 80, 68, 92].map((h, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-t bg-primary/75"
                  style={{ height: `${h}%`, minHeight: "2rem", maxHeight: "5.5rem" }}
                />
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 left-0 h-40 w-40 overflow-hidden rounded-2xl border-4 border-white shadow-lg sm:h-44 sm:w-44">
            <Image
              src="/assets/bento/analytics-team.jpg"
              alt="Agency team reviewing property analytics"
              fill
              sizes="176px"
              className="object-cover"
            />
          </div>
        </div>

        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 top-0 h-56 w-56 rounded-full bg-white/10 blur-3xl"
        />
      </div>
    </BentoShell>
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
