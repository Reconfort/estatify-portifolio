"use client";

import * as React from "react";
import { motion, useInView, useMotionValue, useReducedMotion, useTransform, animate } from "motion/react";
import { Container, Eyebrow } from "@estatify/ui";
import { Reveal } from "./reveal";
import { SectionHeader } from "./section-header";
import { about } from "@/components/landing-data";

/** Animated integer counter that starts when scrolled into view. */
function CountUp({ value, suffix }: { value: number; suffix?: string }) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const reduceMotion = useReducedMotion();
  const raw = useMotionValue(0);
  const rounded = useTransform(raw, (v) => Math.round(v).toLocaleString());
  const [display, setDisplay] = React.useState("0");

  React.useEffect(() => rounded.on("change", setDisplay), [rounded]);

  React.useEffect(() => {
    if (!inView) return;
    if (reduceMotion) {
      raw.set(value);
      return;
    }
    const controls = animate(raw, value, { duration: 1.6, ease: [0.22, 1, 0.36, 1] });
    return controls.stop;
  }, [inView, value, raw, reduceMotion]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}

/**
 * AboutStats — vision/mission statements beside animated proof-point counters.
 */
export function AboutStats() {
  return (
    <section id="about" className="py-20 sm:py-28">
      <Container className="flex flex-col gap-14 sm:gap-16">
        <SectionHeader eyebrow={about.marquee} title={about.title} />

        <div className="grid gap-14 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
          <dl className="flex flex-col divide-y divide-border border-y border-border">
            {about.items.map((item, i) => (
              <Reveal key={item.label} index={i}>
                <div className="grid gap-2 py-6 sm:grid-cols-[10rem_1fr] sm:gap-8">
                  <dt className="text-label font-semibold uppercase tracking-wide text-primary">
                    {item.label}
                  </dt>
                  <dd className="text-body-md leading-relaxed text-muted-foreground">{item.body}</dd>
                </div>
              </Reveal>
            ))}
          </dl>

          <div className="flex flex-col justify-center gap-10">
            {about.stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex flex-col gap-1 border-l-2 border-accent pl-6"
              >
                <Eyebrow className="text-muted-foreground">{stat.eyebrow}</Eyebrow>
                <p className="text-display-md font-bold text-foreground sm:text-display-lg">
                  <CountUp value={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-body-sm text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
