"use client";

import { motion } from "motion/react";
import { Badge, Button, Container, Spotlight, GridBackdrop, TiltCard } from "@estatify/ui";
import { hero } from "@/components/landing-data";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: [0.2, 0, 0, 1] as const },
  }),
};

/** Hero — animated spotlight + grid backdrop, headline, CTAs, product preview. */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <Spotlight />
      <GridBackdrop />
      <Container className="relative flex flex-col items-center gap-8 py-24 text-center sm:py-32">
        <motion.div custom={0} variants={fadeUp} initial="hidden" animate="visible">
          <Badge variant="primary">{hero.badge}</Badge>
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="max-w-3xl text-display-md text-foreground sm:text-display-xl"
        >
          {hero.title}{" "}
          <span className="relative whitespace-nowrap text-primary">
            {hero.highlight}
            <span
              aria-hidden
              className="absolute -bottom-1 left-0 h-2 w-full rounded-full bg-accent/50"
            />
          </span>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="max-w-2xl text-body-lg text-muted-foreground"
        >
          {hero.subtitle}
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center gap-3 sm:flex-row"
        >
          <Button size="lg">{hero.primaryCta}</Button>
          <Button size="lg" variant="outline">
            {hero.secondaryCta}
          </Button>
        </motion.div>

        <motion.p
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-caption text-muted-foreground"
        >
          {hero.note}
        </motion.p>

        <motion.div
          custom={5}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-6 w-full max-w-4xl"
        >
          <TiltCard intensity={5} className="overflow-hidden p-2">
            <div className="rounded-xl bg-background">
              <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-muted" />
                <span className="h-3 w-3 rounded-full bg-muted" />
                <span className="h-3 w-3 rounded-full bg-muted" />
                <span className="ml-3 text-caption text-muted-foreground">yourpagency.estatify.site</span>
              </div>
              <div className="grid gap-4 p-5 sm:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="overflow-hidden rounded-lg border border-border">
                    <div className="h-28 bg-gradient-to-br from-secondary to-muted" />
                    <div className="space-y-2 p-3">
                      <div className="h-3 w-3/4 rounded bg-secondary" />
                      <div className="h-3 w-1/2 rounded bg-secondary" />
                      <div className="mt-2 h-6 w-20 rounded bg-primary/15" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </Container>
    </section>
  );
}
