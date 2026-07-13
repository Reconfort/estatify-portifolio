"use client";

import * as React from "react";
import { useZodForm } from "@estatify/hooks";
import { Button, Field } from "@estatify/ui";
import { cn } from "@estatify/utils";
import {
  createTenantSchema,
  updateTenantSchema,
  tenantPlanSchema,
  tenantStatusSchema,
  type TenantListItem,
} from "@estatify/types";
import { getApiErrorMessage, useCreateTenant, useUpdateTenant } from "@estatify/api-client";
import { Modal, FormError } from "../components/modal";

const PLAN_OPTIONS = tenantPlanSchema.options.map((p) => ({ value: p, label: p }));
const STATUS_OPTIONS = tenantStatusSchema.options.map((s) => ({ value: s, label: s }));

export function CreateTenantDialog({ onClose }: { onClose: () => void }) {
  const form = useZodForm(createTenantSchema, { defaultValues: { plan: "free" } });
  const create = useCreateTenant();
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    try {
      await create.mutateAsync(values);
      onClose();
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  });

  return (
    <Modal title="Create tenant" description="Provision a new agency workspace." onClose={onClose}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Field
          control={form.control}
          name="agencyName"
          type="text"
          label="Agency name"
          placeholder="Acme Realty"
        />
        <Field
          control={form.control}
          name="slug"
          type="text"
          label="Subdomain"
          placeholder="acme"
          hint="Becomes acme.estatify.com"
        />
        <Field
          control={form.control}
          name="ownerEmail"
          type="email"
          label="Owner email"
          placeholder="owner@acme.com"
        />
        <Field
          control={form.control}
          name="plan"
          type="select"
          label="Plan"
          options={PLAN_OPTIONS}
        />
        <FormError message={error} />
        <div className="mt-1 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Creating…" : "Create tenant"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export function EditTenantDialog({
  tenant,
  onClose,
}: {
  tenant: TenantListItem;
  onClose: () => void;
}) {
  const form = useZodForm(updateTenantSchema, {
    defaultValues: { agencyName: tenant.agencyName, plan: tenant.plan, status: tenant.status },
  });
  const update = useUpdateTenant();
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    try {
      await update.mutateAsync({ id: tenant.id, body: values });
      onClose();
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  });

  return (
    <Modal title="Edit tenant" description={tenant.slug} onClose={onClose}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Field control={form.control} name="agencyName" type="text" label="Agency name" />
        <Field
          control={form.control}
          name="plan"
          type="select"
          label="Plan"
          options={PLAN_OPTIONS}
        />
        <Field
          control={form.control}
          name="status"
          type="select"
          label="Status"
          options={STATUS_OPTIONS}
        />
        <FormError message={error} />
        <div className="mt-1 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  destructive,
  onConfirm,
  onClose,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  destructive?: boolean;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}) {
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const run = async () => {
    setBusy(true);
    setError(null);
    try {
      await onConfirm();
      onClose();
    } catch (e) {
      setError(getApiErrorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title={title} onClose={onClose}>
      <p className={cn("text-body-sm text-muted-foreground")}>{description}</p>
      <FormError message={error} />
      <div className="mt-5 flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="button"
          variant={destructive ? "destructive" : "primary"}
          disabled={busy}
          onClick={() => void run()}
        >
          {busy ? "Working…" : confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
