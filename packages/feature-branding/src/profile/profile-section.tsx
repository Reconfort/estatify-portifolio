"use client";

import * as React from "react";
import { useZodForm } from "@estatify/hooks";
import { Field } from "@estatify/ui";
import { getApiErrorMessage, useUpdateAgencyProfile } from "@estatify/api-client";
import { agencyProfileSchema, type AgencyProfile } from "@estatify/types";
import { FieldGrid, FormError, SectionShell } from "../components/section-shell";

export function ProfileSection({ profile }: { profile: AgencyProfile }) {
  const form = useZodForm(agencyProfileSchema, { defaultValues: profile });
  const update = useUpdateAgencyProfile();
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    form.reset(profile);
  }, [profile, form]);

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
      title="Agency profile"
      description="Company details shown on your public website and contact pages."
      onSave={onSave}
      saving={update.isPending}
    >
      <form className="flex flex-col gap-6" noValidate onSubmit={(e) => e.preventDefault()}>
        <div>
          <h3 className="mb-3 text-body-sm font-semibold text-foreground">Basic</h3>
          <FieldGrid>
            <Field
              control={form.control}
              name="basic.companyName"
              type="text"
              label="Company name"
            />
            <Field
              control={form.control}
              name="basic.yearFounded"
              type="number"
              label="Year founded"
            />
            <div className="sm:col-span-2">
              <Field
                control={form.control}
                name="basic.companyDescription"
                type="textarea"
                label="Description"
                rows={3}
              />
            </div>
            <Field
              control={form.control}
              name="basic.registrationNumber"
              type="text"
              label="Registration number"
            />
          </FieldGrid>
        </div>

        <div>
          <h3 className="mb-3 text-body-sm font-semibold text-foreground">Contact</h3>
          <FieldGrid>
            <Field
              control={form.control}
              name="contact.primaryEmail"
              type="email"
              label="Primary email"
            />
            <Field
              control={form.control}
              name="contact.secondaryEmail"
              type="email"
              label="Secondary email"
            />
            <Field
              control={form.control}
              name="contact.primaryPhone"
              type="tel"
              label="Primary phone"
            />
            <Field control={form.control} name="contact.whatsApp" type="tel" label="WhatsApp" />
          </FieldGrid>
        </div>

        <div>
          <h3 className="mb-3 text-body-sm font-semibold text-foreground">Address</h3>
          <FieldGrid>
            <Field control={form.control} name="address.country" type="text" label="Country" />
            <Field control={form.control} name="address.city" type="text" label="City" />
            <Field control={form.control} name="address.street" type="text" label="Street" />
            <Field
              control={form.control}
              name="address.postalCode"
              type="text"
              label="Postal code"
            />
          </FieldGrid>
        </div>

        <div>
          <h3 className="mb-3 text-body-sm font-semibold text-foreground">Social</h3>
          <FieldGrid>
            <Field control={form.control} name="social.facebook" type="url" label="Facebook" />
            <Field control={form.control} name="social.instagram" type="url" label="Instagram" />
            <Field control={form.control} name="social.linkedin" type="url" label="LinkedIn" />
            <Field control={form.control} name="social.youtube" type="url" label="YouTube" />
          </FieldGrid>
        </div>

        <FormError message={error} />
      </form>
    </SectionShell>
  );
}
