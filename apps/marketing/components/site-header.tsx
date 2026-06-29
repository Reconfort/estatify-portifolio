"use client";

import * as React from "react";
import { Button, Container } from "@estatify/ui";
import { nav } from "@/components/landing-data";

/** Sticky marketing header with a token-tinted blur, logo, nav, and CTAs. */
export function SiteHeader() {
  const [open, setOpen] = React.useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <Container className="flex h-16 items-center justify-between">
        <a href="#" className="flex items-center gap-2" aria-label="Estatify home">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <span className="text-body-md font-bold">E</span>
          </span>
          <span className="text-h5 font-semibold text-foreground">Estatify</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {nav.links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-body-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
          <Button size="sm">Start free</Button>
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">Menu</span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {open ? <path d="M6 6l12 12M18 6l-12 12" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </Container>

      {open ? (
        <div className="border-t border-border md:hidden">
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
              <Button size="sm" className="flex-1">
                Start free
              </Button>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
