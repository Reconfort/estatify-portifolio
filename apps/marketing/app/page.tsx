import { DotBackground } from "@estatify/ui";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Hero } from "@/components/landing/hero";
import { CtaBand, Problem, Pricing, Process, Solution } from "@/components/landing/sections";

/**
 * Landing page — fixed dotted backdrop (z-0) sits behind all content (z-10).
 */
export default function HomePage() {
  return (
    <>
      <DotBackground />
      <div className="relative z-10 flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1">
          <Hero />
          <Problem />
          <Solution />
          <Process />
          <Pricing />
          <CtaBand />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
