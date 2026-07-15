"use client";

import * as React from "react";
import { useZodForm } from "@estatify/hooks";
import { Field } from "@estatify/ui";
import { getApiErrorMessage, useUpdateSeoConfiguration } from "@estatify/api-client";
import {
  robotsDirectiveSchema,
  seoConfigurationSchema,
  type SeoConfiguration,
} from "@estatify/types";
import { FieldGrid, FormError, SectionShell } from "../components/section-shell";

const ROBOTS_OPTIONS = robotsDirectiveSchema.options.map((v) => ({ value: v, label: v }));

export function SeoSection({ seo }: { seo: SeoConfiguration }) {
  const form = useZodForm(seoConfigurationSchema, { defaultValues: seo });
  const update = useUpdateSeoConfiguration();
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    form.reset(seo);
  }, [seo, form]);

  const onSave = form.handleSubmit(async (values) => {
    setError(null);
    try {
      await update.mutateAsync(values);
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  });

  return (
    <SectionShell
      title="SEO"
      description="Search and social metadata for your public website."
      onSave={onSave}
      saving={update.isPending}
    >
      <form className="flex flex-col gap-6" noValidate onSubmit={(e) => e.preventDefault()}>
        <div>
          <h3 className="mb-3 text-body-sm font-semibold text-foreground">Meta tags</h3>
          <FieldGrid>
            <Field control={form.control} name="metaTitle" type="text" label="Meta title" />
            <Field
              control={form.control}
              name="robots"
              type="select"
              label="Robots"
              options={ROBOTS_OPTIONS}
            />
            <div className="sm:col-span-2">
              <Field
                control={form.control}
                name="metaDescription"
                type="textarea"
                label="Meta description"
                rows={3}
              />
            </div>
            <Field control={form.control} name="canonicalUrl" type="url" label="Canonical URL" />
            <Field control={form.control} name="faviconUrl" type="url" label="Favicon URL" />
          </FieldGrid>
        </div>

        <div>
          <h3 className="mb-3 text-body-sm font-semibold text-foreground">Open Graph</h3>
          <FieldGrid>
            <Field control={form.control} name="openGraph.title" type="text" label="OG title" />
            <Field
              control={form.control}
              name="openGraph.imageUrl"
              type="url"
              label="OG image URL"
            />
            <div className="sm:col-span-2">
              <Field
                control={form.control}
                name="openGraph.description"
                type="textarea"
                label="OG description"
                rows={2}
              />
            </div>
          </FieldGrid>
        </div>

        <FormError message={error} />
      </form>
    </SectionShell>
  );
}
