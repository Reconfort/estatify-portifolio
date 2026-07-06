import { Container, Marquee } from "@estatify/ui";
import { Reveal } from "./reveal";
import { logos, logosMarquee } from "@/components/landing-data";
import { SectionMarquee } from "./sections";

/** Logos marquee — social proof, immediately after the hero. */
export function Logos() {
  return (
    <section className="rounded-t-3xl bg-background py-12">
      <Container className="flex flex-col gap-8">
        <Reveal y={12}>
          <p className="text-center text-body-sm text-muted-foreground">
            Trusted by growing agencies across the continent
          </p>
        </Reveal>
      </Container>
      <SectionMarquee
        className="border-none bg-transparent pt-12"
        label={logosMarquee.label}
        separatorIcon={logosMarquee.separatorIcon}
        separatorIconClassName="opacity-50 grayscale"
      />
    </section>
  );
}
