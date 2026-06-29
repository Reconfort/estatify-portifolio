"use client";

import * as React from "react";
import NextImage, { type ImageProps } from "next/image";
import { cn } from "@estatify/utils";

/**
 * AppImage — the single image abstraction for the platform. Wraps next/image so
 * apps never optimize images independently. Adds:
 *   - fade-in on load (skipped for `priority` images to avoid hero flash)
 *   - graceful error fallback (swap to `fallbackSrc`)
 *   - all next/image features pass through (responsive sizes, lazy, fill, blur)
 *
 * Always provide a meaningful `alt` ("" for decorative images).
 */
export interface AppImageProps extends ImageProps {
  /** Shown if the primary source fails to load. */
  fallbackSrc?: ImageProps["src"];
}

export function AppImage({
  className,
  fallbackSrc,
  onLoad,
  onError,
  priority,
  alt,
  ...props
}: AppImageProps) {
  const [loaded, setLoaded] = React.useState(false);
  const [errored, setErrored] = React.useState(false);

  const src = errored && fallbackSrc ? fallbackSrc : props.src;
  // Priority images (e.g. the hero) must paint immediately — no fade.
  const fade = !priority;

  return (
    <NextImage
      {...props}
      src={src}
      alt={alt}
      priority={priority}
      className={cn(
        fade && "transition-opacity duration-500",
        fade && !loaded ? "opacity-0" : "opacity-100",
        className,
      )}
      onLoad={(e) => {
        setLoaded(true);
        onLoad?.(e);
      }}
      onError={(e) => {
        setErrored(true);
        onError?.(e);
      }}
    />
  );
}
