"use client";

import * as React from "react";
import { buttonVariants, Container } from "@estatify/ui";
import { cn } from "@estatify/utils";
import { nav } from "@/components/landing-data";
import { SiteLogo } from "@/components/site-logo";
import { workspaceSignInUrl, workspaceSignUpUrl } from "@/lib/workspace-urls";

/**
 * Marketing header. Transparent with white text while over the hero photo,
 * then gains a solid blurred background once the user scrolls past it.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid ? "border-b border-border bg-background/85 backdrop-blur-md" : "bg-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between">
        <a href="/" aria-label="Estatify home">
          <SiteLogo inverted={!solid} />
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {nav.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={cn(
                "text-body-sm transition-colors",
                solid
                  ? "text-muted-foreground hover:text-foreground"
                  : "text-white/80 hover:text-white",
              )}
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href={workspaceSignInUrl()}
            className={cn(
              "text-body-sm font-medium transition-colors",
              solid
                ? "text-muted-foreground hover:text-foreground"
                : "text-white/80 hover:text-white",
            )}
          >
            Sign in
          </a>
          <a
            href={workspaceSignUpUrl()}
            className={buttonVariants({ variant: "accent", size: "sm" })}
          >
            Get Started
          </a>
        </div>

        <button
          className={cn(
            "inline-flex h-10 w-10 items-center justify-center rounded-md md:hidden",
            solid ? "text-foreground" : "text-white",
          )}
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            {open ? <path d="M6 6l12 12M18 6l-12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </Container>

      {open ? (
        <div className="border-t border-border bg-background md:hidden">
          <Container className="flex flex-col gap-1 py-3">
            {nav.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="rounded-md px-2 py-2 text-body-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="mt-2 flex gap-3">
              <a
                href={workspaceSignInUrl()}
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "flex-1")}
              >
                Sign in
              </a>
              <a
                href={workspaceSignUpUrl()}
                onClick={() => setOpen(false)}
                className={cn(buttonVariants({ variant: "accent", size: "sm" }), "flex-1")}
              >
                Get Started
              </a>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
