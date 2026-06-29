import * as React from "react";
import { cn } from "@estatify/utils";

/**
 * BentoGrid — responsive asymmetric grid for feature cards. Children control
 * their own column/row span via className (e.g. "md:col-span-2"). Token-based.
 */
export function BentoGrid({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-3 md:auto-rows-[minmax(11.5rem,auto)]",
        className,
      )}
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
        "group relative flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card p-6",
        "hover:-translate-y-0.5 hover:border-primary/20",
        className,
      )}
      {...props}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 100% 0%, color-mix(in oklab, var(--color-accent) 12%, transparent), transparent)",
        }}
      />
      <div
        aria-hidden
        className="absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "color-mix(in oklab, var(--color-accent) 22%, transparent)" }}
      />
      <div className="relative z-10 flex flex-1 flex-col">
        {icon ? (
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl border border-primary/10 bg-primary/10 text-primary ring-1 ring-primary/5">
            {icon}
          </div>
        ) : null}
        <h3 className="text-h4 text-card-foreground">{title}</h3>
        {description ? (
          <p className="mt-2 max-w-prose text-body-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        ) : null}
        {children}
      </div>
    </div>
  );
}
