"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@estatify/utils";
import { ArrowRightIcon, MenuIcon, SearchIcon } from "@estatify/ui/icons";
import { Button, Marquee } from "@estatify/ui";
import { features, logos } from "@/components/landing-data";

const featureCopy = Object.fromEntries(features.map((f) => [f.key, f])) as Record<
  (typeof features)[number]["key"],
  (typeof features)[number]
>;

const ease = [0.22, 1, 0.36, 1] as const;

const cardReveal = {
  hidden: { opacity: 0, y: 28, scale: 0.98 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.65, delay: i * 0.1, ease },
  }),
};

function BentoShell({
  index,
  className,
  children,
}: {
  index: number;
  className?: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      custom={index}
      variants={cardReveal}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-8% 0px" }}
      whileHover={{ y: -4, transition: { duration: 0.25, ease } }}
      className={cn(
        "group/bento relative overflow-hidden rounded-3xl border border-border/60 bg-card",
        "hover:border-primary/25",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/bento:opacity-100"
        style={{ background: "color-mix(in oklab, var(--color-accent) 6%, transparent)" }}
      />
      {children}
    </motion.div>
  );
}

export function FeaturesBento() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 md:grid-rows-[minmax(18rem,auto)_minmax(18rem,auto)]">
      <ListingsBentoCard />
      <AgentsBentoCard />
      <SitesSearchBentoCard />
      <AnalyticsBentoCard />
    </div>
  );
}

function ListingsBentoCard() {
  const reduceMotion = useReducedMotion();
  const { title, description } = featureCopy.listings;
  const tags = ["For sale", "For rent", "New build"] as const;

  return (
    <BentoShell index={0} className="flex flex-col p-6 md:col-start-1 md:row-start-1">
      <h3 className="text-h4 text-card-foreground">{title}</h3>
      <p className="mt-2 text-body-sm leading-relaxed text-muted-foreground">{description}</p>

      <div className="relative mt-5 min-h-44 flex-1 overflow-hidden rounded-2xl ring-1 ring-border/50">
        <motion.div
          className="absolute inset-0"
          {...(!reduceMotion ? { whileHover: { scale: 1.04 } } : {})}
          transition={{ duration: 0.6, ease }}
        >
          <Image
            src="/assets/bento/listings-home.jpg"
            alt="Model home representing a property listing"
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-neutral-950/45" />
        <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-center gap-2 p-4">
          {tags.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.35 + i * 0.08, duration: 0.4, ease }}
              className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-caption font-medium text-white backdrop-blur-md transition-colors hover:bg-white/30"
            >
              {tag}
            </motion.span>
          ))}
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.35, ease }}
            whileHover={{ scale: 1.08 }}
            className="flex h-8 w-8 cursor-default items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-md"
          >
            <ArrowRightIcon className="h-4 w-4" />
          </motion.span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.45, duration: 0.5 }}
        className="mt-4 flex items-start gap-2 rounded-xl border border-border/60 bg-secondary/30 px-3 py-2.5"
      >
        <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
        <p className="text-caption leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">{featureCopy.leads.title}</span> —{" "}
          {featureCopy.leads.description}
        </p>
      </motion.div>
    </BentoShell>
  );
}

function AgentsBentoCard() {
  const reduceMotion = useReducedMotion();
  const { title, description } = featureCopy.agents;
  const satellites = [
    { src: "/assets/bento/agent-2.jpg", className: "left-[8%] top-[18%]", delay: 0.15 },
    { src: "/assets/bento/agent-3.jpg", className: "right-[8%] top-[22%]", delay: 0.25 },
    { src: "/assets/bento/agent-4.jpg", className: "left-[18%] bottom-[12%]", delay: 0.35 },
    { src: "/assets/bento/agent-1.jpg", className: "right-[16%] bottom-[10%]", delay: 0.45 },
  ] as const;

  const lines = [
    { x1: 160, y1: 92, x2: 72, y2: 52 },
    { x1: 160, y1: 92, x2: 248, y2: 58 },
    { x1: 160, y1: 92, x2: 96, y2: 158 },
    { x1: 160, y1: 92, x2: 236, y2: 162 },
  ] as const;

  return (
    <BentoShell index={1} className="flex flex-col p-6 md:col-start-2 md:row-start-1">
      <h3 className="text-h4 text-card-foreground">{title}</h3>
      <p className="mt-2 text-body-sm leading-relaxed text-muted-foreground">{description}</p>

      <div className="relative mt-4 min-h-52 flex-1" aria-hidden>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 320 200">
          {lines.map((line, i) =>
            reduceMotion ? (
              <line
                key={i}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="currentColor"
                className="text-border"
                strokeWidth={1.5}
                strokeDasharray="6 6"
              />
            ) : (
              <motion.line
                key={i}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="currentColor"
                className="bento-march-line text-border"
                strokeWidth={1.5}
                strokeDasharray="6 6"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }}
              />
            ),
          )}
        </svg>

        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5, ease }}
          className="absolute left-1/2 top-[46%] z-10 h-16 w-16 -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-card ring-2 ring-primary/25">
            <Image src="/assets/bento/agent-1.jpg" alt="" fill sizes="64px" className="object-cover" />
          </div>
          {!reduceMotion ? (
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full ring-2 ring-primary/30"
              animate={{ scale: [1, 1.35], opacity: [0.45, 0] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut" }}
            />
          ) : null}
        </motion.div>

        {satellites.map((agent) => (
          <motion.div
            key={agent.src}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: agent.delay, duration: 0.45, ease }}
            whileHover={{ scale: 1.1, zIndex: 20 }}
            className={cn(
              "absolute h-11 w-11 overflow-hidden rounded-full border-2 border-card",
              agent.className,
            )}
          >
            <Image src={agent.src} alt="" fill sizes="44px" className="object-cover" />
          </motion.div>
        ))}
      </div>
    </BentoShell>
  );
}

function SitesSearchBentoCard() {
  const reduceMotion = useReducedMotion();
  const { title, description } = featureCopy.sites;

  return (
    <BentoShell index={2} className="flex min-h-112 flex-col md:col-start-3 md:row-span-2 md:row-start-1">
      <div className="flex items-center justify-between border-b border-border/60 bg-muted/20 px-4 py-3">
        <div className="flex items-center gap-2.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/75" />
          <span className="h-2.5 w-2.5 rounded-full bg-warning/75" />
          <span className="h-2.5 w-2.5 rounded-full bg-success/75" />
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-center gap-1.5 px-3">
          <svg className="h-3 w-3 shrink-0 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="truncate text-caption font-medium text-muted-foreground">
            yourcompany.estatify.rw
          </span>
        </div>
        <MenuIcon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
      </div>

      <div className="flex flex-col gap-5 px-5 pt-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5, ease }}
        >
          <h3 className="text-h4 text-card-foreground">{title}</h3>
          <p className="mt-2 text-body-sm leading-relaxed text-muted-foreground">{description}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.28, duration: 0.5, ease }}
          className="relative w-full  scale-90 -mt-3"
        >
          <div className="group/search flex items-center gap-2 rounded-xl border border-border/80 bg-background px-4 py-2.5 focus-within:border-primary/30">
            <SearchIcon className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-focus-within/search:text-primary" aria-hidden />
            <span className="flex-1 truncate text-left text-body-sm text-muted-foreground">
              {reduceMotion ? (
                "Search homes, plots, rentals…"
              ) : (
                <TypingPlaceholder text="Search homes, plots, rentals…" />
              )}
            </span>
            <motion.span
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-9 w-9 cursor-default items-center justify-center rounded-lg bg-accent text-accent-foreground ring-2 ring-accent/20 -mr-1"
            >
              <SearchIcon className="h-4 w-4" aria-hidden />
            </motion.span>
          </div>
        </motion.div>
      </div>

      <div className="relative mt-auto min-h-52 flex-1 overflow-hidden">
        {reduceMotion ? (
          <div className="absolute inset-0">
            <Image
              src="/assets/bento/modern-home.jpg"
              alt="Modern property on a branded agency website"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-center"
            />
          </div>
        ) : (
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 1.06, opacity: 0.9 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            animate={{ scale: [1, 1.035, 1] }}
            transition={{
              opacity: { duration: 1, ease },
              scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
            }}
          >
            <Image
              src="/assets/bento/modern-home.jpg"
              alt="Modern property on a branded agency website"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-center"
            />
          </motion.div>
        )}
        <div className="absolute inset-x-0 top-0 h-16 bg-card" />
      </div>

      <div className="relative border-t border-border/60 bg-secondary/25 px-4 py-3">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-8"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-8"
        />
        <Marquee speed={26}>
          {logos.slice(0, 6).map((name) => (
            <span
              key={name}
              className="px-5 text-caption font-semibold uppercase tracking-[0.12em] text-muted-foreground/80"
            >
              {name}
            </span>
          ))}
        </Marquee>
      </div>
    </BentoShell>
  );
}

function TypingPlaceholder({ text }: { text: string }) {
  const [value, setValue] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setValue(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(id);
        setDone(true);
      }
    }, 45);
    return () => window.clearInterval(id);
  }, [text]);

  return (
    <>
      {value}
      {!done ? (
        <motion.span
          aria-hidden
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
          className="ml-px inline-block h-[1em] w-px translate-y-px bg-muted-foreground/70 align-middle"
        />
      ) : null}
    </>
  );
}

const barHeights = [42, 58, 48, 72, 64, 80, 68, 92] as const;

function AnalyticsBentoCard() {
  const reduceMotion = useReducedMotion();
  const { title, description } = featureCopy.analytics;

  return (
    <BentoShell index={3} className="md:col-span-2 md:col-start-1 md:row-start-2">
      <div
        className="relative flex min-h-56 flex-col justify-between gap-6 overflow-hidden p-6 sm:min-h-64 sm:flex-row sm:items-center sm:p-8"
        style={{
          background: "var(--color-lime-700)",
        }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease }}
          className="relative z-10 max-w-md"
        >
          <h3 className="text-h3 text-white sm:text-h2">{title}</h3>
          <p className="mt-3 text-body-sm leading-relaxed text-white/88 sm:text-body-md">
            {description}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              size="sm"
              className="rounded-full bg-white text-primary transition-transform hover:scale-[1.03] hover:bg-white/95 text-sm"
            >
              View dashboard
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="rounded-full border-white/40 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 text-sm"
            >
              See reports
            </Button>
          </div>
        </motion.div>

        <div className="relative z-10 mx-auto h-48 w-full max-w-xs shrink-0 sm:mx-0 sm:h-56 sm:w-72">
          <motion.div
            initial={{ opacity: 0, y: 16, rotate: 4 }}
            whileInView={{ opacity: 1, y: 0, rotate: 2 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.65, ease }}
            whileHover={{ rotate: 0, y: -4 }}
            className="absolute -right-3 -top-3 h-full w-[88%] rounded-2xl border border-white/25 bg-white/95 p-4 backdrop-blur-sm"
          >
            <p className="text-caption font-semibold uppercase tracking-[0.14em] text-primary">
              Portfolio pulse
            </p>
            <div className="mt-4 flex h-28 items-end gap-1.5">
              {barHeights.map((h, i) => (
                <motion.span
                  key={i}
                  className="flex-1 rounded-t-sm bg-lime-600/90"
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true }}
                  transition={{
                    delay: reduceMotion ? 0 : 0.35 + i * 0.06,
                    duration: 0.55,
                    ease,
                  }}
                  style={{ minHeight: "0.5rem", maxHeight: "5.5rem" }}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92, x: -12 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.55, ease }}
            whileHover={{ scale: 1.02 }}
            className="absolute bottom-0 left-0 h-40 w-40 overflow-hidden rounded-2xl border-4 border-white sm:h-44 sm:w-44"
          >
            <Image
              src="/assets/bento/analytics-team.jpg"
              alt="Agency team reviewing property analytics"
              fill
              sizes="176px"
              className="object-cover"
            />
          </motion.div>
        </div>

        <motion.div
          aria-hidden
          {...(!reduceMotion
            ? {
                animate: { x: [0, 12, 0], y: [0, -8, 0] },
                transition: { duration: 7, repeat: Infinity, ease: "easeInOut" as const },
              }
            : {})}
          className="pointer-events-none absolute -left-20 top-4 h-64 w-64 rounded-full bg-white/12 blur-3xl"
        />
        <motion.div
          aria-hidden
          {...(!reduceMotion
            ? {
                animate: { x: [0, -10, 0], y: [0, 10, 0] },
                transition: { duration: 9, repeat: Infinity, ease: "easeInOut" as const },
              }
            : {})}
          className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-accent/20 blur-3xl"
        />
      </div>
    </BentoShell>
  );
}
