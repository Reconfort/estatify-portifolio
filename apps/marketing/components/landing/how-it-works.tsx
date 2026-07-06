import Image from "next/image";
import { Container } from "@estatify/ui";
import {
  ArrowRightIcon,
  BillingIcon,
  GlobeIcon,
  SearchIcon,
  SparkleIcon,
} from "@estatify/ui/icons";
import type { IconComponent } from "@estatify/ui/icons";
import { cn } from "@estatify/utils";
import { ImageReveal, Reveal } from "./reveal";
import { SectionHeader } from "./section-header";
import { howItWorks } from "@/components/landing-data";

const stepIcons: IconComponent[] = [SearchIcon, BillingIcon, SparkleIcon, GlobeIcon];

/**
 * HowItWorks — editorial split: featured image left, numbered step list right.
 * Centered intro; asymmetric image frame echoes the reference layout.
 */
export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background py-20 sm:py-28">
      <Container className="flex flex-col gap-14 sm:gap-16">
        <SectionHeader
          eyebrow={howItWorks.marquee}
          title={howItWorks.title}
          description={howItWorks.description}
        />

        <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-16 xl:gap-20">
          <Reveal className="lg:sticky lg:top-28">
            <div className="relative mx-auto w-full max-w-md lg:max-w-none">
              <ImageReveal className="overflow-hidden rounded-[2rem]">
                <Image
                  src={howItWorks.image}
                  alt={howItWorks.imageAlt}
                  width={960}
                  height={1200}
                  sizes="(max-width: 1024px) 90vw, 44vw"
                  className="aspect-4/5 w-full object-cover"
                />
              </ImageReveal>
            </div>
          </Reveal>

          <ol className="flex flex-col gap-2">
            {howItWorks.steps.map((step, i) => {
              const Icon = stepIcons[i] ?? SearchIcon;

              return (
                <li key={step.n}>
                  <Reveal index={i} y={14}>
                    <div
                      className={cn(
                        "group -mx-2 flex gap-5 rounded-xl px-2 py-8 transition-colors duration-200 sm:gap-6 sm:py-9",
                        "hover:bg-secondary/40",
                      )}
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-foreground",
                          "transition-[border-color,background-color,color] duration-200",
                          "group-hover:border-accent/40 group-hover:bg-accent/10 group-hover:text-primary",
                        )}
                      >
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      </span>
                      <div className="flex min-w-0 flex-col gap-2">
                        <h3 className="text-h5 font-semibold text-foreground sm:text-h4">
                          <span className="mr-2 tabular-nums text-muted-foreground">{step.n}.</span>
                          {step.title}
                        </h3>
                        <p className="text-body-sm leading-relaxed text-muted-foreground sm:text-body-md">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>

        <Reveal>
          <p className="text-center text-body-md text-muted-foreground">
            {howItWorks.footer.text}{" "}
            <a
              href={howItWorks.footer.href}
              className="group inline-flex items-center gap-1.5 font-semibold text-foreground underline-offset-4 transition-colors hover:text-primary hover:underline"
            >
              {howItWorks.footer.label}
              <ArrowRightIcon
                className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
                aria-hidden
              />
            </a>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
