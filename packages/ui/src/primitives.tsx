import * as React from "react";
import { cn } from "@estatify/utils";

/** Max-width page container with responsive gutters. */
export function Container({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-6 lg:px-8", className)} {...props} />;
}

/** Small uppercase label above a heading. */
export function Eyebrow({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-overline uppercase text-primary", className)}
      {...props}
    />
  );
}

/** Pill badge — token-only. */
export function Badge({
  className,
  variant = "muted",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "muted" | "primary" | "accent" }) {
  const styles = {
    muted: "bg-secondary text-secondary-foreground",
    primary: "bg-primary/10 text-primary",
    accent: "bg-accent/20 text-accent-foreground",
  } as const;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-caption font-medium",
        styles[variant],
        className,
      )}
      {...props}
    />
  );
}

interface SectionHeadingProps extends React.HTMLAttributes<HTMLDivElement> {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
}

/** Reusable section header block. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl",
        className,
      )}
      {...props}
    >
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <h2 className="text-h1 text-foreground sm:text-display-md">{title}</h2>
      {description ? <p className="text-body-lg text-muted-foreground">{description}</p> : null}
    </div>
  );
}
