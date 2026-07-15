"use client";

import * as React from "react";
import type { BrandIdentity } from "@estatify/types";
import { cn } from "@estatify/utils";

export function ThemeProvider({
  brand,
  children,
  className,
}: {
  brand: BrandIdentity;
  children: React.ReactNode;
  className?: string;
}) {
  const style = {
    "--site-primary": brand.colors.primary,
    "--site-secondary": brand.colors.secondary,
    "--site-accent": brand.colors.accent,
    "--site-neutral": brand.colors.neutral,
    "--site-success": brand.colors.success,
    "--site-font": brand.typography.primaryFont,
    fontFamily: brand.typography.primaryFont,
    fontSize: `${brand.typography.baseFontSize}px`,
  } as React.CSSProperties;

  return (
    <div
      className={cn("min-h-full bg-white text-[var(--site-secondary)]", className)}
      style={style}
    >
      {children}
    </div>
  );
}
