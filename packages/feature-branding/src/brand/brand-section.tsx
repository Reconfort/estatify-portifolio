"use client";

import * as React from "react";
import { useZodForm } from "@estatify/hooks";
import { Field } from "@estatify/ui";
import { getApiErrorMessage, useUpdateBrandIdentity } from "@estatify/api-client";
import {
  brandIdentitySchema,
  buttonStyleSchema,
  shadowPresetSchema,
  themeModeSchema,
  type BrandIdentity,
} from "@estatify/types";
import { FieldGrid, FormError, SectionShell } from "../components/section-shell";
import { MediaUploader } from "../media/media-uploader";

const THEME_OPTIONS = themeModeSchema.options.map((v) => ({ value: v, label: v }));
const BUTTON_OPTIONS = buttonStyleSchema.options.map((v) => ({ value: v, label: v }));
const SHADOW_OPTIONS = shadowPresetSchema.options.map((v) => ({ value: v, label: v }));

export function BrandSection({ brand }: { brand: BrandIdentity }) {
  const form = useZodForm(brandIdentitySchema, { defaultValues: brand });
  const update = useUpdateBrandIdentity();
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    form.reset(brand);
  }, [brand, form]);

  const onSave = form.handleSubmit(async (values) => {
    setError(null);
    try {
      await update.mutateAsync(values);
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  });

  return (
    <div className="flex flex-col gap-6">
      <SectionShell
        title="Brand identity"
        description="Colors, typography, and theme tokens for your agency website."
        onSave={onSave}
        saving={update.isPending}
      >
        <form className="flex flex-col gap-6" noValidate onSubmit={(e) => e.preventDefault()}>
          <div>
            <h3 className="mb-3 text-body-sm font-semibold text-foreground">Colors</h3>
            <FieldGrid>
              <Field control={form.control} name="colors.primary" type="text" label="Primary" />
              <Field control={form.control} name="colors.secondary" type="text" label="Secondary" />
              <Field control={form.control} name="colors.accent" type="text" label="Accent" />
              <Field control={form.control} name="colors.neutral" type="text" label="Neutral" />
              <Field control={form.control} name="colors.success" type="text" label="Success" />
              <Field control={form.control} name="colors.warning" type="text" label="Warning" />
              <Field control={form.control} name="colors.error" type="text" label="Error" />
            </FieldGrid>
          </div>

          <div>
            <h3 className="mb-3 text-body-sm font-semibold text-foreground">Typography</h3>
            <FieldGrid>
              <Field
                control={form.control}
                name="typography.primaryFont"
                type="text"
                label="Primary font"
                hint="CSS font-family value, e.g. Rubik, sans-serif"
              />
              <Field
                control={form.control}
                name="typography.secondaryFont"
                type="text"
                label="Secondary font"
              />
              <Field
                control={form.control}
                name="typography.baseFontSize"
                type="number"
                label="Base font size (px)"
              />
              <Field
                control={form.control}
                name="typography.headingScale"
                type="number"
                label="Heading scale"
              />
            </FieldGrid>
          </div>

          <div>
            <h3 className="mb-3 text-body-sm font-semibold text-foreground">Theme & components</h3>
            <FieldGrid>
              <Field
                control={form.control}
                name="theme.mode"
                type="select"
                label="Theme mode"
                options={THEME_OPTIONS}
              />
              <Field
                control={form.control}
                name="components.buttonStyle"
                type="select"
                label="Button style"
                options={BUTTON_OPTIONS}
              />
              <Field
                control={form.control}
                name="components.shadowPreset"
                type="select"
                label="Shadow preset"
                options={SHADOW_OPTIONS}
              />
            </FieldGrid>
          </div>

          <FormError message={error} />
        </form>
      </SectionShell>

      <section className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-h4 font-semibold text-foreground">Logo & favicon</h2>
        <p className="mt-1 text-body-sm text-muted-foreground">
          Uploaded assets appear on your live site after publishing.
        </p>
        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <MediaUploader category="logo" label="Logo" hint="PNG or SVG recommended." />
          <MediaUploader category="favicon" label="Favicon" hint="32×32 ICO or PNG." />
        </div>
      </section>
    </div>
  );
}
