import Link from "next/link";
import { SiteLogo } from "@/components/site-logo";

/**
 * Auth layout — deliberately bare: brand mark top-left, centered content,
 * one quiet escape hatch back to the site. No nav, no footer, no noise.
 */
export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="flex items-center justify-between px-6 py-5 sm:px-8">
        <Link href="/" aria-label="Estatify home" className="transition-opacity hover:opacity-80">
          <SiteLogo />
        </Link>
        <Link
          href="/"
          className="text-body-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to site
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-5 pb-16 pt-8">
        {children}
      </main>
    </div>
  );
}
