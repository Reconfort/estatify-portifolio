"use client";

import * as React from "react";
import { useZodForm } from "@estatify/hooks";
import { Button, Field } from "@estatify/ui";
import { cn } from "@estatify/utils";
import { createRoleSchema, PERMISSIONS_BY_MODULE } from "@estatify/types";
import { getApiErrorMessage, useCreateRole, useRole, useUpdateRole } from "@estatify/api-client";
import { Modal, FormError } from "../components/modal";

const roleFormSchema = createRoleSchema.pick({ name: true, description: true });
const MODULES = Object.entries(PERMISSIONS_BY_MODULE);

function ModuleCheckbox({
  checked,
  indeterminate,
  onChange,
  label,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  label: React.ReactNode;
}) {
  const ref = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = Boolean(indeterminate) && !checked;
  }, [indeterminate, checked]);
  return (
    <label className="flex cursor-pointer items-center gap-2">
      <input
        ref={ref}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 rounded border-input text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      />
      {label}
    </label>
  );
}

/**
 * The GitHub-style permission builder. Permissions are grouped by module with a
 * per-module select-all; state is a Set of permission keys persisted on save.
 */
export function RoleBuilderDialog({
  roleId,
  onClose,
}: {
  roleId: string | null; // null = create
  onClose: () => void;
}) {
  const isEdit = Boolean(roleId);
  const detail = useRole(roleId);
  const isSystem = detail.data?.isSystem ?? false;

  return (
    <Modal
      size="xl"
      title={isEdit ? "Edit role" : "Create role"}
      description="Grant capabilities by module. Members of this role get every checked permission."
      onClose={onClose}
    >
      {isEdit && detail.isLoading ? (
        <p className="py-8 text-center text-body-sm text-muted-foreground">Loading role…</p>
      ) : isSystem ? (
        <div className="space-y-4">
          <p className="rounded-lg border border-border bg-muted/40 p-3 text-body-sm text-muted-foreground">
            <span className="font-medium text-foreground">{detail.data?.name}</span> is a system
            role and can&apos;t be edited — it always holds every permission.
          </p>
          <div className="flex justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      ) : (
        <RoleBuilderForm
          key={roleId ?? "new"}
          roleId={roleId}
          initialName={detail.data?.name ?? ""}
          initialDescription={detail.data?.description ?? ""}
          initialKeys={detail.data?.permissionKeys ?? []}
          onClose={onClose}
        />
      )}
    </Modal>
  );
}

function RoleBuilderForm({
  roleId,
  initialName,
  initialDescription,
  initialKeys,
  onClose,
}: {
  roleId: string | null;
  initialName: string;
  initialDescription: string;
  initialKeys: readonly string[];
  onClose: () => void;
}) {
  const isEdit = Boolean(roleId);
  const form = useZodForm(roleFormSchema, {
    defaultValues: { name: initialName, description: initialDescription },
  });
  const create = useCreateRole();
  const update = useUpdateRole();
  const [selected, setSelected] = React.useState(() => new Set(initialKeys));
  const [error, setError] = React.useState<string | null>(null);

  const toggleKey = (key: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const toggleModule = (keys: string[]) =>
    setSelected((prev) => {
      const next = new Set(prev);
      const allOn = keys.every((k) => next.has(k));
      keys.forEach((k) => (allOn ? next.delete(k) : next.add(k)));
      return next;
    });

  const onSubmit = form.handleSubmit(async (values) => {
    setError(null);
    const permissionKeys = [...selected];
    try {
      if (isEdit && roleId) {
        await update.mutateAsync({ id: roleId, body: { ...values, permissionKeys } });
      } else {
        await create.mutateAsync({ ...values, permissionKeys });
      }
      onClose();
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          control={form.control}
          name="name"
          type="text"
          label="Role name"
          placeholder="Support Agent"
        />
        <Field
          control={form.control}
          name="description"
          type="text"
          label="Description"
          placeholder="Handles customer support"
        />
      </div>

      <div className="rounded-lg border border-border">
        <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
          <span className="text-body-sm font-semibold text-foreground">Permissions</span>
          <span className="text-caption text-muted-foreground">{selected.size} selected</span>
        </div>
        <div className="max-h-[42vh] divide-y divide-border overflow-y-auto">
          {MODULES.map(([module, perms]) => {
            const keys = perms.map((p) => p.key);
            const allOn = keys.every((k) => selected.has(k));
            const someOn = keys.some((k) => selected.has(k));
            return (
              <div key={module} className="px-4 py-3">
                <ModuleCheckbox
                  checked={allOn}
                  indeterminate={someOn}
                  onChange={() => toggleModule(keys)}
                  label={
                    <span className="text-body-sm font-semibold text-foreground">{module}</span>
                  }
                />
                <div className="mt-2 grid gap-2 pl-6 sm:grid-cols-2">
                  {perms.map((p) => (
                    <label key={p.key} className="flex cursor-pointer items-start gap-2">
                      <input
                        type="checkbox"
                        checked={selected.has(p.key)}
                        onChange={() => toggleKey(p.key)}
                        className="mt-0.5 size-4 rounded border-input text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                      />
                      <span className="min-w-0">
                        <span className="block text-body-sm capitalize text-foreground">
                          {p.action}
                        </span>
                        <span className={cn("block text-caption text-muted-foreground")}>
                          {p.description}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <FormError message={error} />
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? "Saving…" : isEdit ? "Save role" : "Create role"}
        </Button>
      </div>
    </form>
  );
}
