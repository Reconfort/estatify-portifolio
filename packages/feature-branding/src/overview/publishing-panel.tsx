"use client";

import * as React from "react";
import { ArrowDown, Check, Circle, Loader2 } from "lucide-react";
import type { ReadinessResult } from "@estatify/website-readiness";
import { Button } from "@estatify/ui";
import { cn } from "@estatify/utils";
import {
  getApiErrorMessage,
  useDiscardComposition,
  usePublishConfiguration,
} from "@estatify/api-client";
import { FormError } from "../components/section-shell";
import { formatRelativeTime } from "./utils";

type PublishStage = "draft" | "preview" | "publish" | "live";

function fmt(iso: string | null) {
  if (!iso) return "Never";
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

function currentStage(isPublished: boolean, hasBlockers: boolean): PublishStage {
  if (isPublished) return "live";
  if (hasBlockers) return "draft";
  return "publish";
}

const STAGES: { id: PublishStage; label: string }[] = [
  { id: "draft", label: "Draft" },
  { id: "preview", label: "Preview" },
  { id: "publish", label: "Publish" },
  { id: "live", label: "Live" },
];

export function PublishingPanel({
  readiness,
  publishedAt,
  updatedAt,
  isPublished,
}: {
  readiness: ReadinessResult;
  publishedAt: string | null;
  updatedAt: string;
  isPublished: boolean;
}) {
  const publish = usePublishConfiguration();
  const discard = useDiscardComposition();
  const [error, setError] = React.useState<string | null>(null);

  const hasBlockers = readiness.blockers.length > 0;
  const stage = currentStage(isPublished, hasBlockers);
  const stageIndex = STAGES.findIndex((s) => s.id === stage);

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
    <section className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-h5 font-semibold text-foreground">Publishing</h2>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {STAGES.map((s, index) => {
          const done = index < stageIndex;
          const active = index === stageIndex;
          return (
            <React.Fragment key={s.id}>
              <span
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-caption",
                  done && "border-accent/30 bg-accent/10 text-foreground",
                  active && "border-primary/30 bg-primary/5 font-medium text-foreground",
                  !done && !active && "border-border text-muted-foreground",
                )}
              >
                {done ? (
                  <Check className="size-3 text-accent" aria-hidden />
                ) : (
                  <Circle
                    className={cn("size-2", active && "fill-primary text-primary")}
                    aria-hidden
                  />
                )}
                {s.label}
              </span>
              {index < STAGES.length - 1 ? (
                <ArrowDown className="size-3.5 rotate-[-90deg] text-muted-foreground" aria-hidden />
              ) : null}
            </React.Fragment>
          );
        })}
      </div>

      <dl className="mt-4 grid gap-2 text-body-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Draft updated</dt>
          <dd className="font-medium text-foreground">{formatRelativeTime(updatedAt)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-muted-foreground">Last published</dt>
          <dd className="font-medium text-foreground">{fmt(publishedAt)}</dd>
        </div>
      </dl>

      {hasBlockers ? (
        <div className="mt-4 rounded-lg border border-warning/30 bg-warning/5 p-3">
          <p className="text-body-sm font-medium text-foreground">Before you publish</p>
          <ul className="mt-2 list-inside list-disc text-caption text-muted-foreground">
            {readiness.blockers.map((b) => (
              <li key={b.id}>
                {b.label}: {b.message}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <FormError message={error} />

      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          onClick={onDiscard}
          disabled={discard.isPending || publish.isPending}
        >
          Discard draft
        </Button>
        <Button
          type="button"
          onClick={onPublish}
          disabled={publish.isPending || discard.isPending || hasBlockers}
        >
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
    </section>
  );
}
