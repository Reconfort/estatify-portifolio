"use client";

import { Container } from "@estatify/ui";
import { FrownIcon, HourglassIcon, WandIcon, type IconComponent } from "@estatify/ui/icons";
import { cn } from "@estatify/utils";
import { Reveal } from "./reveal";
import { SectionHeader } from "./section-header";
import { problem } from "@/components/landing-data";

const iconMap = {
  hourglass: HourglassIcon,
  frown: FrownIcon,
  wand: WandIcon,
} as const satisfies Record<(typeof problem.cards)[number]["icon"], IconComponent>;

const iconTone = {
  violet: "bg-violet-500",
  orange: "bg-orange-400",
  teal: "bg-teal-500",
} as const;

/**
 * Problem — open, light three-up matching the reference:
 * badge → two-tone headline → icon / title / body columns (no card chrome).
 */
export function Problem() {
  return (
    <section id="problem" className="py-20 sm:py-28">
      <Container className="flex flex-col gap-14 sm:gap-16">
        <SectionHeader
          eyebrow={problem.eyebrow}
          eyebrowVariant="badge"
          eyebrowDotClassName="bg-orange-500"
          title={problem.title.lead}
          titleMuted={problem.title.muted}
          titleBreak
        />

        <ul className="mx-auto grid w-full max-w-5xl list-none grid-cols-1 gap-12 md:grid-cols-3 md:gap-8 lg:gap-12">
          {problem.cards.map((card, i) => {
            const Icon = iconMap[card.icon];

            return (
              <Reveal key={card.key} index={i}>
                <li className="group flex flex-col items-center text-center">
                  <span
                    aria-hidden
                    className={cn(
                      "mb-6 flex size-14 items-center justify-center rounded-lg text-white transition-transform duration-200 ease-out group-hover:-translate-y-0.5 sm:size-16 sm:rounded-[1.15rem]",
                      iconTone[card.tone],
                    )}
                  >
                    <Icon className="size-6 sm:size-7" strokeWidth={2} />
                  </span>
                  <h3 className="max-w-[18ch] text-h4 font-semibold tracking-tight text-balance text-foreground sm:text-h3">
                    {card.title}
                  </h3>
                  <p className="mt-3 max-w-[32ch] text-body-sm leading-relaxed text-muted-foreground sm:text-body-md">
                    {card.body}
                  </p>
                </li>
              </Reveal>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
