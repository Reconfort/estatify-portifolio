"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { AnnouncementBadge, Button, Container, PointerHighlight } from "@estatify/ui";
import { ListingsIcon } from "@estatify/ui/icons";
import { heroV2 } from "@/components/landing-data";
import { TemplateCarousel } from "./template-carousel";

const ease = [0.2, 0, 0, 1] as const;

type BrandIcon = (typeof heroV2.seenIn.brands)[number]["icon"];
type Brand = (typeof heroV2.seenIn.brands)[number];

function BrandMark({ icon }: { icon: BrandIcon }) {
  const className = "h-5 w-5 shrink-0";
  switch (icon) {
    case "grid":
      return (
        <svg viewBox="0 0 20 20" className={className} aria-hidden fill="currentColor">
          <rect x="2" y="2" width="6" height="6" rx="1" />
          <rect x="12" y="2" width="6" height="6" rx="1" />
          <rect x="2" y="12" width="6" height="6" rx="1" />
          <rect x="12" y="12" width="6" height="6" rx="1" />
        </svg>
      );
    case "wordmark":
      return null;
    case "chat":
      return (
        <svg viewBox="0 0 20 20" className={className} aria-hidden fill="currentColor">
          <path d="M4 3.5A2.5 2.5 0 0 1 6.5 1h7A2.5 2.5 0 0 1 16 3.5v7A2.5 2.5 0 0 1 13.5 13H9.2L5.8 16.4A.75.75 0 0 1 4.5 15.9V13A2.5 2.5 0 0 1 4 10.5v-7Z" />
        </svg>
      );
    case "leaf":
      return (
        <svg viewBox="0 0 20 20" className={className} aria-hidden fill="currentColor">
          <path d="M16.5 3.5c-4.2-.4-8.4 1.2-10.6 4.6-1.5 2.3-1.8 5-1.1 7.4.1.4.6.5.9.3l7.7-4.4c.4-.2.5-.7.3-1.1C12.4 7.5 10.8 5.4 8.7 4.2c2.6-.7 5.4-.6 7.8.3.4.2.8 0 .9-.4.1-.4-.1-.8-.5-.9-.1 0-.2 0-.4 0Z" />
        </svg>
      );
    case "bars":
      return (
        <svg viewBox="0 0 20 20" className={className} aria-hidden fill="currentColor">
          <path d="M7.2 2.5 3.8 17.5h3.2L10.4 2.5H7.2Zm6.2 0L9.8 17.5h3.2l3.6-15H13.4Z" />
        </svg>
      );
    default: {
      const _exhaustive: never = icon;
      return _exhaustive;
    }
  }
}

/**
 * Rotates brand pages (5 at a time) every interval with a soft blur crossfade.
 */
function SeenInBrands({ brands }: { brands: readonly Brand[] }) {
  const reduceMotion = useReducedMotion();
  const pageSize = heroV2.seenIn.pageSize;
  const pageCount = Math.ceil(brands.length / pageSize);
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (reduceMotion || pageCount <= 1) return;
    const id = window.setInterval(() => {
      setPage((current) => (current + 1) % pageCount);
    }, heroV2.seenIn.intervalMs);
    return () => window.clearInterval(id);
  }, [pageCount, reduceMotion]);

  const visible = brands.slice(page * pageSize, page * pageSize + pageSize);

  return (
    <div className="relative min-h-10 w-full">
      <AnimatePresence mode="wait" initial={false}>
        <motion.ul
          key={page}
          initial={
            reduceMotion
              ? { opacity: 1, filter: "blur(0px)" }
              : { opacity: 0, filter: "blur(10px)" }
          }
          animate={{ opacity: 1, filter: "blur(0px)" }}
          exit={
            reduceMotion
              ? { opacity: 0, filter: "blur(0px)" }
              : { opacity: 0, filter: "blur(10px)" }
          }
          transition={{ duration: reduceMotion ? 0 : 0.55, ease }}
          className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5 sm:gap-x-12"
          aria-live="polite"
        >
          {visible.map((brand) => (
            <li key={brand.name} className="inline-flex items-center gap-2 text-neutral-400">
              <BrandMark icon={brand.icon} />
              <span className="text-body-md font-semibold tracking-tight sm:text-body-lg">
                {brand.name}
              </span>
            </li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </div>
  );
}

/**
 * Hero — centered, light, typography-led first viewport.
 * Badge → headline → support line → CTA pair → social proof row.
 */
export function Hero() {
  const reduceMotion = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: reduceMotion ? 0 : 16 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: reduceMotion ? 0 : 0.5,
        delay: reduceMotion ? 0 : i * 0.07,
        ease,
      },
    }),
  };

  return (
    <section className="relative isolate overflow-hidden pt-28 pb-16 sm:pt-32 sm:pb-20">
      <Container className="flex flex-col items-center text-center">
        <motion.div
          custom={0}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <AnnouncementBadge
            href={heroV2.badge.href}
            text={heroV2.badge.text}
            cta={heroV2.badge.cta}
          />
        </motion.div>

        <motion.h1
          custom={1}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="max-w-3xl md:py-12 text-display-lg font-light tracking-tight text-neutral-950 sm:text-display-lg lg:text-display-2xl"
        >
          {heroV2.title.before}
          <PointerHighlight rectangleClassName="border-black" pointerClassName="text-accent">
            <span className="font-light text-accent">{heroV2.title.highlight}</span>
          </PointerHighlight>
        </motion.h1>

        <motion.p
          custom={2}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-5 max-w-xl text-pretty text-body-md text-neutral-500 sm:text-body-lg"
        >
          {heroV2.subtitle}
        </motion.p>

        <motion.div
          custom={3}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-9 flex flex-wrap items-center justify-center gap-3"
        >
          <Button href={heroV2.cta.href} variant="primary" size="lg">
            <ListingsIcon className="h-4 w-4" aria-hidden />
            {heroV2.cta.label}
          </Button>
          <Button href={heroV2.secondaryCta.href} variant="outline" size="lg">
            {heroV2.secondaryCta.label}
          </Button>
        </motion.div>

        {/* <motion.div
          custom={4}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mt-16 flex w-full max-w-5xl flex-col items-center gap-5"
        >
          <p className="text-caption font-medium text-neutral-400">
            {heroV2.seenIn.label}
          </p>
          <SeenInBrands brands={heroV2.seenIn.brands} />
        </motion.div> */}
      </Container>

      <motion.div
        custom={5}
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        className="mt-12 w-full overflow-x-clip sm:mt-16"
      >
        <TemplateCarousel />
      </motion.div>
    </section>
  );
}
