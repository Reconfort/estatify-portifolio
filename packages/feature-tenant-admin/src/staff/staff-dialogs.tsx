"use client";

import * as React from "react";
import { useZodForm } from "@estatify/hooks";
import { Button, Field } from "@estatify/ui";
import {
  createStaffSchema,
  updateStaffSchema,
  staffDepartmentSchema,
  staffStatusSchema,
  type StaffListItem,
} from "@estatify/types";
import { getApiErrorMessage, useCreateStaff, useRoles, useUpdateStaff } from "@estatify/api-client";
import { Modal, FormError } from "../components/modal";

const DEPARTMENT_OPTIONS = staffDepartmentSchema.options.map((d) => ({
  value: d,
  label: d.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
}));
const STATUS_OPTIONS = staffStatusSchema.options.map((s) => ({ value: s, label: s }));

function useRoleOptions() {
  const { data } = useRoles();
  return (data ?? []).map((r) => ({ value: r.id, label: r.name }));
}

export function CreateStaffDialog({ onClose }: { onClose: () => void }) {
  const form = useZodForm(createStaffSchema, { defaultValues: { department: "operations" } });
  const create = useCreateStaff();
  const roleOptions = useRoleOptions();
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
    <Modal title="Add staff member" description="Invite an Estatify employee." onClose={onClose}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Field
          control={form.control}
          name="fullName"
          type="text"
          label="Full name"
          placeholder="Jane Doe"
        />
        <Field
          control={form.control}
          name="email"
          type="email"
          label="Email"
          placeholder="jane@estatify.com"
        />
        <Field
          control={form.control}
          name="department"
          type="select"
          label="Department"
          options={DEPARTMENT_OPTIONS}
        />
        <Field
          control={form.control}
          name="roleId"
          type="select"
          label="Role"
          options={roleOptions}
          placeholder="Select a role"
        />
        <FormError message={error} />
        <div className="mt-1 flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting ? "Adding…" : "Add staff"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

export function EditStaffDialog({ staff, onClose }: { staff: StaffListItem; onClose: () => void }) {
  const form = useZodForm(updateStaffSchema, {
    defaultValues: {
      fullName: staff.fullName,
      department: staff.department,
      status: staff.status,
      ...(staff.roleId ? { roleId: staff.roleId } : {}),
    },
  });
  const update = useUpdateStaff();
  const roleOptions = useRoleOptions();
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    try {
      await update.mutateAsync({ id: staff.id, body: values });
      onClose();
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  });

  return (
    <Modal title="Edit staff member" description={staff.email} onClose={onClose}>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Field control={form.control} name="fullName" type="text" label="Full name" />
        <Field
          control={form.control}
          name="department"
          type="select"
          label="Department"
          options={DEPARTMENT_OPTIONS}
        />
        <Field
          control={form.control}
          name="roleId"
          type="select"
          label="Role"
          options={roleOptions}
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
