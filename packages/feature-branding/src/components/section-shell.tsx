"use client";

import * as React from "react";
import { Button } from "@estatify/ui";
import { cn } from "@estatify/utils";

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-caption font-medium text-destructive">
      {message}
    </p>
  );
}

export function SectionShell({
  title,
  description,
  children,
  onSave,
  saving,
  isDirty = true,
  savedMessage,
  saveLabel = "Save changes",
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  onSave: () => void;
  saving?: boolean;
  isDirty?: boolean;
  savedMessage?: string | null;
  saveLabel?: string;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-h4 font-semibold text-foreground">{title}</h2>
          {description ? (
            <p className="mt-1 text-body-sm text-muted-foreground">{description}</p>
          ) : null}
          {isDirty ? (
            <p className="mt-1 text-caption text-warning">Unsaved changes</p>
          ) : savedMessage ? (
            <p className="mt-1 text-caption text-accent">{savedMessage}</p>
          ) : (
            <p className="mt-1 text-caption text-muted-foreground">All changes saved</p>
          )}
        </div>
        <Button type="button" onClick={onSave} disabled={saving || !isDirty} className="shrink-0">
          {saving ? "Saving…" : saveLabel}
        </Button>
      </div>
      {children}
    </section>
  );
}

export function FieldGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("grid gap-4 sm:grid-cols-2", className)}>{children}</div>;
}
