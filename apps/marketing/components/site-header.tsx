"use client";

import * as React from "react";
import { Button, Container } from "@estatify/ui";
import { cn } from "@estatify/utils";
import { nav } from "@/components/landing-data";

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
        <a href="#" className="flex items-center gap-2" aria-label="Estatify home">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <span className="text-body-md font-bold">E</span>
          </span>
          <span className={cn("text-h5 font-semibold", solid ? "text-foreground" : "text-white")}>
            Estatify
          </span>
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
          {solid ? (
            <>
              <Button variant="ghost" size="sm">
                Sign in
              </Button>
              <Button size="sm" variant="accent">
                Create free account
              </Button>
            </>
          ) : (
            <Button size="sm" variant="accent">
              Create free account
            </Button>
          )}
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
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
              <Button variant="outline" size="sm" className="flex-1">
                Sign in
              </Button>
              <Button size="sm" variant="accent" className="flex-1">
                Create free account
              </Button>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
