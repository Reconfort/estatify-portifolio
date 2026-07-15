"use client";

import * as React from "react";
import { X } from "lucide-react";

const SIZE_CLASS = { md: "max-w-md", lg: "max-w-lg", xl: "max-w-2xl" } as const;

/** Minimal accessible modal shell shared by every Access Management dialog. */
export function Modal({
  title,
  description,
  size = "md",
  onClose,
  children,
}: {
  title: string;
  description?: string;
  size?: keyof typeof SIZE_CLASS;
  onClose: () => void;
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="fixed inset-0 bg-neutral-950/40 backdrop-blur-xs"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={`relative z-10 max-h-[90vh] w-full overflow-y-auto rounded-xl border border-border bg-card p-6  animate-in fade-in zoom-in-95 duration-150 ${SIZE_CLASS[size]}`}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <X className="size-4" aria-hidden />
        </button>
        <h2 className="text-h4 font-semibold text-foreground">{title}</h2>
        {description ? (
          <p className="mt-1 text-body-sm text-muted-foreground">{description}</p>
        ) : null}
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <p role="alert" className="text-caption font-medium text-destructive">
      {message}
    </p>
  );
}
