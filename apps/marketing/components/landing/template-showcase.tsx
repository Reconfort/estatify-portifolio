import Image from "next/image";
import { Badge, Container } from "@estatify/ui";
import { ArrowRightIcon } from "@estatify/ui/icons";
import { ImageReveal, Reveal } from "./reveal";
import { Parallax } from "./parallax";
import { SectionHeader } from "./section-header";
import { showcaseV2, templatesV2 } from "@/components/landing-data";

/**
 * TemplateShowcase — the product itself: live-previewable site templates,
 * closing with the social-proof rating chip. Numbered editorial layout with
 * curtain image reveals.
 */
export function TemplateShowcase() {
  return (
    <section id="templates" className="py-20 sm:py-28">
      <Container className="flex flex-col gap-14">
        <SectionHeader
          eyebrow={templatesV2.marquee}
          title={templatesV2.title}
          description={templatesV2.description}
        />

        <ol className="flex flex-col">
          {templatesV2.items.map((template, i) => (
            <li key={template.name} className="border-t border-border py-10 last:border-b">
              <Reveal index={i} className="grid items-center gap-6 sm:grid-cols-[6rem_1fr_auto] lg:grid-cols-[8rem_1fr_26rem]">
                <Parallax range={24}>
                  <span
                    aria-hidden
                    className="text-display-lg font-bold tabular-nums text-muted-foreground/25 lg:text-display-2xl"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </Parallax>

                <div className="flex flex-col gap-3">
                  <Badge variant="primary" className="w-fit">{template.category}</Badge>
                  <h3 className="text-h2 font-semibold text-foreground sm:text-h1">
                    {template.name}
                  </h3>
                  <p className="text-body-md text-muted-foreground">{template.tagline}</p>
                  <a
                    href={template.href}
                    className="group inline-flex w-fit items-center gap-2 text-body-sm font-semibold text-primary transition-[color,transform] duration-150 ease-out hover:text-primary-hover active:scale-[0.98]"
                  >
                    {templatesV2.ctaLabel}
                    <ArrowRightIcon
                      className="h-4 w-4 transition-transform duration-150 ease-out group-hover:translate-x-0.5"
                      aria-hidden
                    />
                  </a>
                </div>

                <ImageReveal className="overflow-hidden rounded-2xl">
                  <Image
                    src={template.image}
                    alt={`${template.name} template preview — ${template.tagline}`}
                    width={768}
                    height={512}
                    sizes="(max-width: 1024px) 100vw, 416px"
                    className="h-60 w-full object-cover transition-transform duration-500 ease-out hover:scale-[1.04]"
                  />
                </ImageReveal>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal>
          <div className="flex items-center gap-4 self-start rounded-full border-none bg-card py-2 pl-3 pr-6">
            <div className="flex -space-x-2">
              {showcaseV2.avatars.map((src) => (
                <Image
                  key={src}
                  src={src}
                  alt=""
                  width={64}
                  height={64}
                  sizes="36px"
                  className="h-9 w-9 rounded-full border-2 border-background object-cover"
                />
              ))}
            </div>
            <p className="text-body-sm text-muted-foreground">
              <span className="font-bold text-foreground">{showcaseV2.rating.score}</span>{" "}
              {showcaseV2.rating.note}
            </p>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
