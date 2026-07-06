"use client";

import * as React from "react";
import { Container, Field } from "@estatify/ui";
import { CheckIcon } from "@estatify/ui/icons";
import { useZodForm } from "@estatify/hooks";
import { enquirySchema, type EnquiryInput } from "@estatify/schemas";
import { SectionHeader } from "./section-header";
import { enquiry } from "@/components/landing-data";

/**
 * Enquiry — dark callback-request band. The form is scoped `.dark` so the
 * shared <Field /> controls pick up dark-mode tokens on the brand panel.
 * Validation: enquirySchema (@estatify/schemas) via useZodForm.
 */
export function Enquiry() {
  const [submitted, setSubmitted] = React.useState(false);

  const form = useZodForm(enquirySchema, {
    defaultValues: { name: "", email: "", phone: "", topic: "", message: "" },
  });

  const topicOptions = enquiry.topics.map((t) => ({ value: t, label: t }));

  // TODO(leads): POST to the lead service (apps/api) once the endpoint exists.
  const onSubmit = (_values: EnquiryInput) => setSubmitted(true);

  return (
    <section
      id="enquiry"
      className="py-20 sm:py-28"
      style={{ background: "var(--green-950)" }}
    >
      <Container className="flex flex-col gap-12">
        <SectionHeader
          tone="dark"
          eyebrow={enquiry.marquee}
          title={enquiry.title}
          description={enquiry.note}
        />

        <div className="mx-auto w-full max-w-3xl">
          {submitted ? (
            <div className="flex flex-col items-center justify-center gap-3 text-center" role="status">
              <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <CheckIcon className="h-6 w-6" aria-hidden />
              </span>
              <p className="text-h4 font-semibold text-white">Request received.</p>
              <p className="text-body-md text-white/70">
                A specialist will call you back within one business day.
              </p>
            </div>
          ) : (
            <form
              className="dark grid gap-4 sm:grid-cols-2"
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
            >
              <Field
                control={form.control}
                name="name"
                type="text"
                label="Full name *"
                placeholder="Amara Okafor"
                autoComplete="name"
              />
              <Field
                control={form.control}
                name="email"
                type="email"
                label="Work email *"
                placeholder="you@agency.com"
                autoComplete="email"
              />
              <Field
                control={form.control}
                name="phone"
                type="tel"
                label="Phone"
                placeholder="+250 000 000 000"
                autoComplete="tel"
              />
              <Field
                control={form.control}
                name="topic"
                type="select"
                label="You're enquiring about *"
                placeholder="Select a topic"
                options={topicOptions}
              />
              <Field
                control={form.control}
                name="message"
                type="textarea"
                label="Anything else we should know?"
                placeholder="Tell us about your agency, portfolio size, and timeline."
                className="sm:col-span-2"
              />

              <button
                type="submit"
                className="mt-2 inline-flex w-fit items-center gap-2 rounded-full bg-accent px-8 py-3 text-body-sm font-semibold text-accent-foreground transition-[background-color,transform] duration-150 ease-out hover:bg-accent/90 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:col-span-2"
              >
                {enquiry.cta}
              </button>
            </form>
          )}
        </div>
      </Container>
    </section>
  );
}
