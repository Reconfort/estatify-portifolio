import * as React from "react";
import { cn } from "@estatify/utils";

/**
 * BentoGrid — responsive asymmetric grid for feature cards. Children control
 * their own column/row span via className (e.g. "md:col-span-2"). Token-based.
 */
export function BentoGrid({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("grid grid-cols-1 gap-4 md:grid-cols-3 md:auto-rows-[15rem]", className)}
      {...props}
    />
  );
}

interface BentoCardProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
}

/** A single bento cell with hover lift and a token-tinted corner glow. */
export function BentoCard({
  icon,
  title,
  description,
  className,
  children,
  ...props
}: BentoCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-6",
        "shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden
        className="absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "color-mix(in oklab, var(--color-primary) 18%, transparent)" }}
      />
      {icon ? (
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      ) : null}
      <h3 className="text-h4 text-card-foreground">{title}</h3>
      {description ? (
        <p className="mt-2 text-body-sm text-muted-foreground">{description}</p>
      ) : null}
      {children}
    </div>
  );
}
