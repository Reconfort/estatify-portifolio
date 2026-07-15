"use client";

import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CreateMediaUploadInput,
  MediaAssetItem,
  MediaListQuery,
  MediaUploadResponse,
  Paginated,
} from "@estatify/types";
import { apiFetch } from "./http";
import { configurationKeys } from "./workspace-configuration";

function toQueryString(query: MediaListQuery): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null) params.set(key, String(value));
  }
  return params.toString();
}

export const mediaApi = {
  list: (query: MediaListQuery) =>
    apiFetch<Paginated<MediaAssetItem>>(`/workspace/media?${toQueryString(query)}`),
  createUpload: (body: CreateMediaUploadInput) =>
    apiFetch<MediaUploadResponse>("/workspace/media/upload-url", { method: "POST", body }),
  remove: (id: string) => apiFetch<void>(`/workspace/media/${id}`, { method: "DELETE" }),
};

/** PUT file bytes to the presigned URL (different host — not via apiFetch). */
export async function uploadToPresignedUrl(
  uploadUrl: string,
  file: File | Blob,
  mimeType: string,
): Promise<void> {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "content-type": mimeType },
    body: file,
  });
  if (!res.ok) throw new Error("Upload failed");
}

export const mediaKeys = {
  all: ["workspace", "media"] as const,
  list: (query: MediaListQuery) => ["workspace", "media", "list", query] as const,
};

export function useMedia(query: MediaListQuery, enabled = true) {
  return useQuery({
    queryKey: mediaKeys.list(query),
    queryFn: () => mediaApi.list(query),
    placeholderData: keepPreviousData,
    enabled,
  });
}

function useInvalidateMedia() {
  const qc = useQueryClient();
  return () => {
    void qc.invalidateQueries({ queryKey: mediaKeys.all });
    void qc.invalidateQueries({ queryKey: configurationKeys.all });
  };
}

export function useCreateMediaUpload() {
  const invalidate = useInvalidateMedia();
  return useMutation({
    mutationFn: async (vars: { input: CreateMediaUploadInput; file: File }) => {
      const presign = await mediaApi.createUpload(vars.input);
      await uploadToPresignedUrl(presign.uploadUrl, vars.file, vars.input.mimeType);
      return presign;
    },
    onSuccess: invalidate,
  });
}

export function useDeleteMedia() {
  const invalidate = useInvalidateMedia();
  return useMutation({ mutationFn: mediaApi.remove, onSuccess: invalidate });
}
