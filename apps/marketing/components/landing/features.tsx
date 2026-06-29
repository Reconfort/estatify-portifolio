import { Container, SectionHeading } from "@estatify/ui";
import { FeaturesBento } from "@/components/landing/features-bento";

/** Features — editorial bento grid. Content lives in features-bento.tsx. */
export function Features() {
  return (
    <section id="features" className="py-24 sm:py-28">
      <Container className="flex flex-col gap-12">
        <SectionHeading
          eyebrow="Everything in one place"
          title="The whole stack to run your agency"
          description="Replace the patchwork of website builders, spreadsheets, and inboxes with one platform built for real estate."
        />
        <FeaturesBento />
      </Container>
    </section>
  );
}
