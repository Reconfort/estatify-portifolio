"use client";

import * as React from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { Button } from "@estatify/ui";
import { cn } from "@estatify/utils";
import {
  getApiErrorMessage,
  useCreateMediaUpload,
  useDeleteMedia,
  useMedia,
} from "@estatify/api-client";
import type { CreateMediaUploadInput, MediaCategory } from "@estatify/types";
import { FormError } from "../components/section-shell";

const ACCEPT =
  "image/jpeg,image/png,image/webp,image/svg+xml,image/x-icon,image/vnd.microsoft.icon";

function mimeForFile(file: File): CreateMediaUploadInput["mimeType"] | null {
  const allowed: CreateMediaUploadInput["mimeType"][] = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/svg+xml",
    "image/x-icon",
    "image/vnd.microsoft.icon",
  ];
  return allowed.includes(file.type as CreateMediaUploadInput["mimeType"])
    ? (file.type as CreateMediaUploadInput["mimeType"])
    : null;
}

export function MediaUploader({
  category,
  label,
  hint,
  className,
}: {
  category: MediaCategory;
  label: string;
  hint?: string;
  className?: string;
}) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState<string | null>(null);
  const { data } = useMedia({ category, page: 1, pageSize: 1 });
  const upload = useCreateMediaUpload();
  const remove = useDeleteMedia();

  const asset = data?.items[0] ?? null;
  const busy = upload.isPending || remove.isPending;

  const onPick = async (file: File) => {
    setError(null);
    const mimeType = mimeForFile(file);
    if (!mimeType) {
      setError("Unsupported file type. Use JPEG, PNG, WebP, SVG, or ICO.");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("File must be under 10 MB.");
      return;
    }

    try {
      if (asset) await remove.mutateAsync(asset.id);
      await upload.mutateAsync({
        input: {
          category,
          fileName: file.name,
          mimeType,
          fileSize: file.size,
        },
        file,
      });
    } catch (e) {
      setError(getApiErrorMessage(e));
    }
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-body-sm font-medium text-foreground">{label}</span>
      <div className="flex items-center gap-4">
        <div className="flex size-20 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted/40">
          {asset ? (
            <img src={asset.url} alt="" className="max-h-full max-w-full object-contain" />
          ) : (
            <ImagePlus className="size-6 text-muted-foreground" aria-hidden />
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPT}
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onPick(file);
              e.target.value = "";
            }}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
          >
            {busy ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Uploading…
              </>
            ) : asset ? (
              "Replace"
            ) : (
              "Upload"
            )}
          </Button>
          {asset ? (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={busy}
              className="text-destructive hover:text-destructive"
              onClick={async () => {
                setError(null);
                try {
                  await remove.mutateAsync(asset.id);
                } catch (e) {
                  setError(getApiErrorMessage(e));
                }
              }}
            >
              <Trash2 className="size-4" aria-hidden />
              Remove
            </Button>
          ) : null}
        </div>
      </div>
      {hint ? <p className="text-caption text-muted-foreground">{hint}</p> : null}
      <FormError message={error} />
    </div>
  );
}
