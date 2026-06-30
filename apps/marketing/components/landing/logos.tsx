import { Container, Marquee } from "@estatify/ui";
import { logos } from "@/components/landing-data";

/** Logos marquee — social proof. */
export function Logos() {
  return (
    <section className="border-y border-border bg-secondary/30 pb-12 pt-[clamp(12rem,30vw,17rem)]">
      <Container className="flex flex-col gap-8">
        <p className="text-center text-body-sm text-muted-foreground">
          Trusted by growing agencies across the continent
        </p>
        <Marquee speed={34}>
          {logos.map((name) => (
            <div
              key={name}
              className="flex h-12 items-center rounded-lg border border-border bg-card px-6 text-body-sm font-semibold text-muted-foreground"
            >
              {name}
            </div>
          ))}
        </Marquee>
      </Container>
    </section>
  );
}
