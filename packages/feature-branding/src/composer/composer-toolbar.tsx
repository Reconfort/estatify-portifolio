"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@estatify/ui";
import {
  getApiErrorMessage,
  useDiscardComposition,
  usePublishConfiguration,
} from "@estatify/api-client";

export function ComposerToolbar({
  pageLabel,
  updatedAt,
  publishedAt,
  saving,
}: {
  pageLabel: string;
  updatedAt: string;
  publishedAt: string | null;
  saving?: boolean;
}) {
  const publish = usePublishConfiguration();
  const discard = useDiscardComposition();
  const [error, setError] = React.useState<string | null>(null);

  const fmt = (iso: string | null) =>
    iso
      ? new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
      : "Never";

  const onPublish = async () => {
    setError(null);
    try {
      await publish.mutateAsync();
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  };

  const onDiscard = async () => {
    setError(null);
    try {
      await discard.mutateAsync();
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-4 py-3">
      <div>
        <p className="text-body-sm font-semibold text-foreground">{pageLabel}</p>
        <p className="text-caption text-muted-foreground">
          Draft updated {fmt(updatedAt)} · Published {fmt(publishedAt)}
          {saving ? " · Saving…" : ""}
        </p>
        {error ? <p className="text-caption text-destructive">{error}</p> : null}
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onDiscard}
          disabled={discard.isPending || publish.isPending}
        >
          Discard
        </Button>
        <Button
          type="button"
          size="sm"
          onClick={onPublish}
          disabled={publish.isPending || discard.isPending}
        >
          {publish.isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" aria-hidden />
              Publishing…
            </>
          ) : (
            "Publish"
          )}
        </Button>
      </div>
    </div>
  );
}
