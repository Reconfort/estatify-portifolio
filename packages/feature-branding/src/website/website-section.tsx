"use client";

import * as React from "react";
import { useZodForm } from "@estatify/hooks";
import { Field } from "@estatify/ui";
import { getApiErrorMessage, useUpdateWebsiteSettings } from "@estatify/api-client";
import { websiteSettingsSchema, type WebsiteSettings } from "@estatify/types";
import { FormGroup } from "../components/form-group";
import { FieldGrid, FormError, SectionShell } from "../components/section-shell";

export function WebsiteSection({ website }: { website: WebsiteSettings }) {
  const form = useZodForm(websiteSettingsSchema, { defaultValues: website });
  const update = useUpdateWebsiteSettings();
  const [error, setError] = React.useState<string | null>(null);
  const [savedMessage, setSavedMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    form.reset(website);
  }, [website, form]);

  const onSave = form.handleSubmit(async (values) => {
    setError(null);
    setSavedMessage(null);
    try {
      await update.mutateAsync(values);
      setSavedMessage("Website settings saved.");
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
      isDirty={form.formState.isDirty}
      savedMessage={savedMessage}
    >
      <form className="flex flex-col gap-4" noValidate onSubmit={(e) => e.preventDefault()}>
        <FormGroup title="General">
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
        </FormGroup>

        <FormGroup title="Public contact">
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
        </FormGroup>

        <p className="text-caption text-muted-foreground">
          Navigation and footer links use sensible defaults. Arrange homepage sections in the
          Composer tab.
        </p>

        <FormError message={error} />
      </form>
    </SectionShell>
  );
}
