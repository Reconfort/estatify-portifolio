import * as React from "react";
import { cn } from "@estatify/utils";
import { DotBackground } from "./dot-background";
import { AuthTestimonialPanel, type AuthTestimonial } from "./auth-testimonial-panel";

export interface AuthLayoutProps {
  children: React.ReactNode;
  /** Brand mark in the top-left of the form column. */
  brand?: React.ReactNode;
  /**
   * Right-panel testimonials. When provided, renders AuthTestimonialPanel.
   * Pass `panel` instead to fully replace the right column.
   */
  testimonials?: readonly AuthTestimonial[];
  /** Override the entire right column (takes precedence over testimonials). */
  panel?: React.ReactNode;
  className?: string;
}

/**
 * AuthLayout — the single auth shell for every Estatify app.
 *
 * Use once in each app's `app/(auth)/layout.tsx`. Pages only render
 * `<AuthForm>` content — never another full-page chrome.
 *
 *   // app/(auth)/layout.tsx
 *   <AuthLayout brand={<AuthBrand />} testimonials={authTestimonials}>
 *     {children}
 *   </AuthLayout>
 */
export function AuthLayout({ children, brand, testimonials, panel, className }: AuthLayoutProps) {
  const right =
    panel ??
    (testimonials && testimonials.length > 0 ? (
      <AuthTestimonialPanel items={testimonials} />
    ) : null);

  return (
    <div className={cn("relative min-h-dvh", className)}>
      <DotBackground />
      <div className="relative z-10 grid min-h-dvh lg:grid-cols-2">
        <div className="relative flex min-h-dvh flex-col px-5 py-8 sm:px-8 lg:px-12 lg:py-10">
          {brand ? (
            <div className="mb-10 flex w-full shrink-0 items-center justify-between gap-4">
              {brand}
            </div>
          ) : null}
          <div className="mx-auto flex w-full max-w-md flex-1 flex-col">{children}</div>
        </div>
        {right ? (
          <div className="relative hidden min-h-dvh overflow-hidden lg:block">{right}</div>
        ) : null}
      </div>
    </div>
  );
}

export interface AuthFormProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  copyright?: React.ReactNode;
  className?: string;
}

/**
 * AuthForm — page body inside AuthLayout (heading + form + footer).
 * Every auth route should render this — not a second layout.
 */
export function AuthForm({
  title,
  description,
  children,
  footer,
  copyright,
  className,
}: AuthFormProps) {
  return (
    <div className={cn("flex flex-1 flex-col", className)}>
      <div className="flex flex-1 flex-col justify-center py-2 lg:py-6">
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            {title}
          </h1>
          {description ? <p className="text-body-md text-muted-foreground">{description}</p> : null}
        </div>

        {children}

        {footer ? (
          <div className="mt-8 text-center text-body-sm text-muted-foreground">{footer}</div>
        ) : null}
      </div>

      {copyright ? (
        <p className="mt-auto pt-8 text-caption text-muted-foreground">{copyright}</p>
      ) : (
        <p className="mt-auto pt-8 text-caption text-muted-foreground">
          © Estatify {new Date().getFullYear()}
        </p>
      )}
    </div>
  );
}
