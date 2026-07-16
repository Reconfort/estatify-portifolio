"use client";

import { LayoutTemplate } from "lucide-react";
import { Button } from "@estatify/ui";
import { templateLabel } from "./utils";

export function TemplateCard({
  templateId,
  onPreview,
}: {
  templateId: string | null;
  onPreview: () => void;
}) {
  return (
    <section className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
          <LayoutTemplate className="size-5" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-h5 font-semibold text-foreground">Template</h2>
          <p className="mt-0.5 text-body-sm text-foreground">{templateLabel(templateId)}</p>
          <p className="mt-1 text-caption text-muted-foreground">
            Layout and section structure for your public site.
          </p>
        </div>
      </div>
      <div className="mt-4 flex gap-2">
        <Button type="button" variant="outline" className="flex-1" onClick={onPreview}>
          Preview layout
        </Button>
        <Button type="button" variant="outline" className="flex-1" disabled>
          Change template
        </Button>
      </div>
    </section>
  );
}
