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
import { ColorField } from "../components/color-field";
import { FormGroup } from "../components/form-group";
import { FieldGrid, FormError, SectionShell } from "../components/section-shell";
import { MediaUploader } from "../media/media-uploader";

const THEME_OPTIONS = themeModeSchema.options.map((v) => ({ value: v, label: v }));
const BUTTON_OPTIONS = buttonStyleSchema.options.map((v) => ({ value: v, label: v }));
const SHADOW_OPTIONS = shadowPresetSchema.options.map((v) => ({ value: v, label: v }));

const COLOR_FIELDS = [
  { name: "colors.primary" as const, label: "Primary" },
  { name: "colors.secondary" as const, label: "Secondary" },
  { name: "colors.accent" as const, label: "Accent" },
  { name: "colors.neutral" as const, label: "Neutral" },
  { name: "colors.success" as const, label: "Success" },
  { name: "colors.warning" as const, label: "Warning" },
  { name: "colors.error" as const, label: "Error" },
];

export function BrandSection({ brand }: { brand: BrandIdentity }) {
  const form = useZodForm(brandIdentitySchema, { defaultValues: brand });
  const update = useUpdateBrandIdentity();
  const [error, setError] = React.useState<string | null>(null);
  const [savedMessage, setSavedMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    form.reset(brand);
  }, [brand, form]);

  const onSave = form.handleSubmit(async (values) => {
    setError(null);
    setSavedMessage(null);
    try {
      await update.mutateAsync(values);
      setSavedMessage("Brand saved.");
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  });

  return (
    <div className="flex flex-col gap-4">
      <SectionShell
        title="Brand identity"
        description="Colors, typography, and theme tokens for your agency website."
        onSave={onSave}
        saving={update.isPending}
        isDirty={form.formState.isDirty}
        savedMessage={savedMessage}
      >
        <form className="flex flex-col gap-4" noValidate onSubmit={(e) => e.preventDefault()}>
          <FormGroup title="Colors">
            <FieldGrid>
              {COLOR_FIELDS.map((c) => (
                <ColorField key={c.name} control={form.control} name={c.name} label={c.label} />
              ))}
            </FieldGrid>
          </FormGroup>

          <FormGroup title="Typography">
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
          </FormGroup>

          <FormGroup title="Theme & components" defaultOpen={false}>
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
          </FormGroup>

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
