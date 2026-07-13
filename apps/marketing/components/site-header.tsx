"use client";

import * as React from "react";
import { Button } from "@estatify/ui";
import { cn } from "@estatify/utils";
import { nav } from "@/components/landing-data";
import { SiteLogo } from "@/components/site-logo";
import { workspaceSignInUrl } from "@/lib/workspace-urls";

/**
 * Floating capsule header — logo left, nav center, Get Started (→ sign-in) right.
 */
export function SiteHeader() {
  const [open, setOpen] = React.useState(false);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-4 sm:px-5 sm:pt-5">
      <div
        className={cn(
          "pointer-events-auto mx-auto flex max-w-5xl flex-col",
          "rounded-lg border border-black/8 bg-black/5 backdrop-blur-xl",
          open && "rounded-3xl",
        )}
      >
        <div className="flex h-14 items-center justify-between gap-3 px-3 sm:px-4 md:px-5">
          <a href="/" aria-label="Estatify home" className="shrink-0 pl-1">
            <SiteLogo />
          </a>

          <nav
            className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex"
            aria-label="Primary"
          >
            {nav.links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-body-sm font-medium text-neutral-900 transition-opacity hover:opacity-60"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex">
            <Button
              href={workspaceSignInUrl()}
              variant="outline"
              size="md"
              className="-mr-2 rounded-md! px-3 py-3"
            >
              <span
                className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-primary text-primary-foreground"
                aria-hidden
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M13 2L4.5 13.5H11L10 22L19.5 9.5H13L13 2Z" />
                </svg>
              </span>
              Get Started
            </Button>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="md:hidden"
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
          </Button>
        </div>

        {open ? (
          <div className="border-t border-black/6 px-4 pt-2 pb-4 md:hidden">
            <nav className="flex flex-col gap-1" aria-label="Mobile">
              {nav.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="rounded-xl px-3 py-2.5 text-body-sm font-medium text-neutral-800 hover:bg-neutral-100"
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="mt-3">
              <Button
                href={workspaceSignInUrl()}
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-primary-foreground text-primary"
                  aria-hidden
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M13 2L4.5 13.5H11L10 22L19.5 9.5H13L13 2Z" />
                  </svg>
                </span>
                Get Started
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
