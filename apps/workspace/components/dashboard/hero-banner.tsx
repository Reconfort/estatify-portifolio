"use client";

import { motion, useReducedMotion } from "motion/react";
import { Building2, Globe, Users } from "lucide-react";
import { Button } from "@estatify/ui";
import { DASH_EASE } from "@estatify/ui";

/**
 * HeroBanner — deep-green welcome card with a custom skyline illustration.
 * Calm, premium: one gradient, one accent, generous whitespace.
 */
export function HeroBanner({ agencyName, firstName }: { agencyName: string; firstName?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative flex min-h-56 flex-col justify-center overflow-hidden rounded-lg bg-brand-950 p-6 text-neutral-50 sm:p-8">
      {/* soft ambient light */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full bg-lime-400/10 blur-3xl"
      />

      <div className="relative z-10 max-w-lg space-y-4">
        <motion.p
          initial={{ opacity: 0, y: reduceMotion ? 0 : 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: DASH_EASE }}
          className="text-body-sm text-neutral-300"
        >
          Welcome back{firstName ? `, ${firstName}` : ""} 👋
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06, duration: 0.5, ease: DASH_EASE }}
          className="text-h1 font-semibold tracking-tight text-white sm:text-display-md"
        >
          {agencyName}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.5, ease: DASH_EASE }}
          className="text-body-md leading-relaxed text-neutral-300"
        >
          12 new leads this week and 3 viewings scheduled for today. Your website traffic is up 8% —
          keep the momentum going.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: reduceMotion ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.5, ease: DASH_EASE }}
          className="flex flex-wrap items-center gap-3 pt-1"
        >
          <Button href="/properties" variant="accent" size="md">
            <Building2 className="size-4" aria-hidden />
            Add Property
          </Button>
          <Button
            href="/leads"
            variant="ghost"
            size="md"
            className="text-neutral-200 hover:bg-white/10 hover:text-white"
          >
            <Users className="size-4" aria-hidden />
            View Leads
          </Button>
        </motion.div>
      </div>

      {/* Skyline illustration — bespoke, brand palette */}
      <motion.div
        aria-hidden
        initial={{ opacity: 0, x: reduceMotion ? 0 : 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.7, ease: DASH_EASE }}
        className="pointer-events-none absolute bottom-0 right-0 hidden h-full w-[46%] md:block"
      >
        <SkylineIllustration className="absolute bottom-0 right-4 h-[88%] w-auto" />
      </motion.div>

      <span className="sr-only">
        <Globe aria-hidden /> Estatify workspace overview
      </span>
    </section>
  );
}

/** Minimal real-estate skyline in brand greens with lime windows. */
function SkylineIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 340 220" fill="none" className={className} aria-hidden>
      {/* back towers */}
      <rect x="24" y="60" width="58" height="160" rx="4" fill="var(--green-900)" />
      <rect x="196" y="42" width="64" height="178" rx="4" fill="var(--green-900)" />
      {/* mid towers */}
      <rect x="70" y="90" width="70" height="130" rx="4" fill="var(--green-800)" />
      <rect x="248" y="84" width="58" height="136" rx="4" fill="var(--green-800)" />
      {/* front tower */}
      <rect x="136" y="24" width="76" height="196" rx="5" fill="var(--green-700)" />
      {/* windows — front tower */}
      {Array.from({ length: 6 }).map((_, r) =>
        Array.from({ length: 3 }).map((_, c) => (
          <rect
            key={`f${r}-${c}`}
            x={148 + c * 20}
            y={40 + r * 28}
            width="12"
            height="16"
            rx="1.5"
            fill={r === 1 && c === 2 ? "var(--lime-400)" : "var(--green-500)"}
            opacity={r === 1 && c === 2 ? 1 : 0.5}
          />
        )),
      )}
      {/* windows — mid towers */}
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 2 }).map((_, c) => (
          <rect
            key={`m${r}-${c}`}
            x={82 + c * 24}
            y={104 + r * 26}
            width="14"
            height="14"
            rx="1.5"
            fill={r === 2 && c === 0 ? "var(--lime-400)" : "var(--green-600)"}
            opacity={r === 2 && c === 0 ? 0.95 : 0.45}
          />
        )),
      )}
      {Array.from({ length: 4 }).map((_, r) => (
        <rect
          key={`r${r}`}
          x={262}
          y={98 + r * 28}
          width="30"
          height="12"
          rx="1.5"
          fill="var(--green-600)"
          opacity={0.45}
        />
      ))}
      {/* lime location pin */}
      <circle cx="174" cy="12" r="6" fill="var(--lime-400)" />
      <path d="M174 24 L169 14 H179 Z" fill="var(--lime-400)" />
      {/* ground line */}
      <rect x="0" y="218" width="340" height="2" rx="1" fill="var(--green-800)" />
    </svg>
  );
}
