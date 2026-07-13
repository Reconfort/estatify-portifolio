import type { Metadata } from "next";
import { DotBackground } from "@estatify/ui";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { TemplateShowcase } from "@/components/landing/sections";

export const metadata: Metadata = {
  title: "Templates — Estatify",
  description:
    "Browse ready-to-launch real estate website templates. Preview live, then claim one for your agency.",
};

/**
 * Templates gallery — standalone page (moved off the home screen).
 */
export default function TemplatesPage() {
  return (
    <>
      <DotBackground />
      <div className="relative z-10 flex min-h-full flex-col">
        <SiteHeader />
        <main className="flex-1 pt-20 sm:pt-24">
          <TemplateShowcase />
        </main>
        <SiteFooter />
      </div>
    </>
  );
}
