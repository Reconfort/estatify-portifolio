"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@estatify/utils";
import { ArrowRightIcon, LocationIcon } from "@estatify/ui/icons";
import { Badge, Container } from "@estatify/ui";
import { showcase } from "@/components/landing-data";
import { SectionHeader } from "./section-header";

const ease = [0.22, 1, 0.36, 1] as const;

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease },
  }),
};

function ShowcaseGrid() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {showcase.map((property, i) => (
        <motion.article
          key={property.name}
          custom={i}
          variants={reveal}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-6% 0px" }}
          {...(!reduceMotion ? { whileHover: { y: -8 } } : {})}
          transition={{ duration: 0.28, ease }}
          className={cn(
            "group overflow-hidden rounded-lg border border-border/70 bg-card",
            "hover:border-primary/20",
          )}
        >
          <div className="relative h-52 overflow-hidden sm:h-56">
            <motion.div
              className="absolute inset-0"
              {...(!reduceMotion ? { whileHover: { scale: 1.06 } } : {})}
              transition={{ duration: 0.55, ease }}
            >
              <Image
                src={property.image}
                alt={property.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-neutral-950/40" />
            <div className="absolute left-4 top-4">
              <Badge variant="accent" className="bg-white/90 text-sm">
                {property.tag}
              </Badge>
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
              <div>
                <h3 className="text-h5 text-white">{property.name}</h3>
                <p className="mt-0.5 flex items-center gap-1 text-caption text-white/90">
                  <LocationIcon className="h-3.5 w-3.5 shrink-0" aria-hidden />
                  {property.location}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-border/60 px-5 py-4">
            <p className="text-h5 text-primary">{property.price}</p>
            <span className="flex items-center gap-1 text-caption font-medium text-muted-foreground transition-colors group-hover:text-primary">
              View listing
              <ArrowRightIcon className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </motion.article>
      ))}
    </div>
  );
}

/** Showcase — property listing cards. */
export function Showcase() {
  return (
    <section id="showcase" className="py-24 sm:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeader
          eyebrow="Showcase"
          title="Listings that look the part"
          description="Every property gets a premium, mobile-first card — automatically themed to your brand."
        />
        <ShowcaseGrid />
      </Container>
    </section>
  );
}
