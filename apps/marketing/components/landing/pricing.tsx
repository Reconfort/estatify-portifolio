"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@estatify/utils";
import { ArrowRightIcon, CheckIcon, SparkleIcon } from "@estatify/ui/icons";
import { Badge, Button, Container } from "@estatify/ui";
import { pricing } from "@/components/landing-data";
import { SectionHeader } from "./section-header";

const ease = [0.22, 1, 0.36, 1] as const;

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease },
  }),
};

function PricingGrid() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid items-stretch gap-6 pt-6 lg:grid-cols-3 lg:gap-5 lg:pt-8">
      {pricing.map((tier, i) => {
        const isFeatured = tier.featured;

        return (
          <motion.article
            key={tier.name}
            custom={i}
            variants={reveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-6% 0px" }}
            {...(!reduceMotion ? { whileHover: { y: -4 } } : {})}
            transition={{ duration: 0.28, ease }}
            className={cn("relative flex flex-col", isFeatured && "lg:z-10")}
          >
            {isFeatured ? (
              <div className="absolute left-1/2 top-0 z-30 -translate-x-1/2 -translate-y-1/2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent px-4 py-1.5 text-caption font-semibold text-accent-foreground">
                  <SparkleIcon className="h-3.5 w-3.5 text-accent-foreground" aria-hidden />
                  Most popular
                </span>
              </div>
            ) : null}

            <div
              className={cn(
                "relative flex h-full flex-col gap-6 rounded-3xl border p-8 duration-300",
                isFeatured
                  ? "border-accent/30 bg-card pt-10 ring-accent/15"
                  : "border-border/70 bg-card hover:border-accent/20",
              )}
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-h4 text-card-foreground">{tier.name}</h3>
                    <p className="text-body-sm text-muted-foreground">{tier.blurb}</p>
                  </div>
                  {isFeatured ? (
                    <Badge variant="accent" className="shrink-0 text-xs">
                      Best value
                    </Badge>
                  ) : null}
                </div>
              </div>

              <div
                className={cn(
                  "rounded-2xl px-1 py-1",
                  isFeatured ? "border border-accent/15 bg-accent/5 px-4 py-4" : "border-b border-border/60 pb-6",
                )}
              >
                <p className="flex items-end gap-1">
                  <span
                    className={cn(
                      "font-semibold tracking-tight text-foreground",
                      isFeatured ? "text-display-lg" : "text-display-md",
                    )}
                  >
                    {tier.price}
                  </span>
                  {tier.cadence ? (
                    <span className="pb-2 text-body-sm text-muted-foreground">{tier.cadence}</span>
                  ) : null}
                </p>
                {isFeatured ? (
                  <p className="mt-2 text-caption font-medium text-lime-800">
                    14-day trial included · Cancel anytime
                  </p>
                ) : null}
              </div>

              <ul className="flex flex-1 flex-col gap-3">
                {tier.features.map((feature, fi) => (
                  <motion.li
                    key={feature}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: reduceMotion ? 0 : 0.12 + fi * 0.04, duration: 0.4, ease }}
                    className="flex items-start gap-3 text-body-sm text-card-foreground"
                  >
                    <span
                      className={cn(
                        "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                        isFeatured ? "bg-accent text-accent-foreground" : "bg-accent/10 text-lime-800",
                      )}
                    >
                      <CheckIcon className="h-3 w-3" />
                    </span>
                    {feature}
                  </motion.li>
                ))}
              </ul>

              <Button
                variant={isFeatured ? "accent" : "outline"}
                className={cn(
                  "group mt-auto w-full rounded-full",
                  !isFeatured && "hover:border-accent/40 hover:text-foreground",
                )}
              >
                {tier.cta}
                {isFeatured ? (
                  <ArrowRightIcon
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                ) : null}
              </Button>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}

/** Pricing — three tiers. */
export function Pricing() {
  return (
    <section id="pricing" className="py-24 sm:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeader
          eyebrow="Pricing"
          title="Simple plans that scale with you"
          description="Start free. Upgrade when you grow. Cancel anytime."
        />
        <PricingGrid />
      </Container>
    </section>
  );
}
