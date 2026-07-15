"use client";

import * as React from "react";
import { useZodForm } from "@estatify/hooks";
import { Field } from "@estatify/ui";
import { getApiErrorMessage, useUpdateWebsiteSettings } from "@estatify/api-client";
import { websiteSettingsSchema, type WebsiteSettings } from "@estatify/types";
import { FieldGrid, FormError, SectionShell } from "../components/section-shell";

export function WebsiteSection({ website }: { website: WebsiteSettings }) {
  const form = useZodForm(websiteSettingsSchema, { defaultValues: website });
  const update = useUpdateWebsiteSettings();
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    form.reset(website);
  }, [website, form]);

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
      title="Website settings"
      description="General site information and public contact details."
      onSave={onSave}
      saving={update.isPending}
    >
      <form className="flex flex-col gap-6" noValidate onSubmit={(e) => e.preventDefault()}>
        <div>
          <h3 className="mb-3 text-body-sm font-semibold text-foreground">General</h3>
          <FieldGrid>
            <Field
              control={form.control}
              name="general.websiteName"
              type="text"
              label="Website name"
            />
            <Field
              control={form.control}
              name="general.defaultLanguage"
              type="text"
              label="Default language"
            />
            <div className="sm:col-span-2">
              <Field
                control={form.control}
                name="general.websiteTagline"
                type="text"
                label="Tagline"
              />
            </div>
            <Field control={form.control} name="general.timezone" type="text" label="Timezone" />
            <Field
              control={form.control}
              name="general.currency"
              type="text"
              label="Currency (ISO 4217)"
              hint="Three-letter code, e.g. USD"
            />
          </FieldGrid>
        </div>

        <div>
          <h3 className="mb-3 text-body-sm font-semibold text-foreground">Public contact</h3>
          <FieldGrid>
            <Field
              control={form.control}
              name="contact.websiteEmail"
              type="email"
              label="Website email"
            />
            <Field
              control={form.control}
              name="contact.supportEmail"
              type="email"
              label="Support email"
            />
            <Field
              control={form.control}
              name="contact.salesEmail"
              type="email"
              label="Sales email"
            />
            <Field
              control={form.control}
              name="contact.websitePhone"
              type="tel"
              label="Website phone"
            />
          </FieldGrid>
        </div>

        <p className="text-caption text-muted-foreground">
          Navigation and footer links use sensible defaults. Advanced layout editing comes in a
          later milestone.
        </p>

        <FormError message={error} />
      </form>
    </SectionShell>
  );
}
