"use client";

import * as React from "react";
import { Globe, Loader2 } from "lucide-react";
import { Button } from "@estatify/ui";
import { cn } from "@estatify/utils";
import { getApiErrorMessage, usePublishConfiguration } from "@estatify/api-client";
import { FormError } from "./section-shell";

export function PublishBar({
  publishedAt,
  updatedAt,
  className,
}: {
  publishedAt: string | null;
  updatedAt: string;
  className?: string;
}) {
  const publish = usePublishConfiguration();
  const [error, setError] = React.useState<string | null>(null);

  const onPublish = async () => {
    setError(null);
    try {
      await publish.mutateAsync();
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  };

  const fmt = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })
      : "Never";

  return (
    <div
      className={cn(
        "flex flex-col gap-4 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Globe className="size-5" aria-hidden />
        </div>
        <div>
          <p className="text-body-sm font-medium text-foreground">Website publication</p>
          <p className="text-caption text-muted-foreground">
            Last published: {fmt(publishedAt)} · Draft updated: {fmt(updatedAt)}
          </p>
          <FormError message={error} />
        </div>
      </div>
      <Button type="button" onClick={onPublish} disabled={publish.isPending} className="shrink-0">
        {publish.isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Publishing…
          </>
        ) : (
          "Publish website"
        )}
      </Button>
    </div>
  );
}
