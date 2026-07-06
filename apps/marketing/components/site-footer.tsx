import { Container } from "@estatify/ui";
import { SiteLogo } from "@/components/site-logo";

const columns = [
  { title: "Product", links: ["Features", "Showcase", "Pricing", "Templates"] },
  { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
  { title: "Resources", links: ["Docs", "Support", "Status", "Changelog"] },
  { title: "Legal", links: ["Privacy", "Terms", "Cookies"] },
];

/** Marketing footer. */
export function SiteFooter() {
  return (
    // relative z-10 keeps the footer above the pinned hero curtain.
    <footer className="relative z-10 border-t border-border bg-background py-16">
      <Container className="flex flex-col gap-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="flex flex-col gap-3 lg:col-span-2">
            <SiteLogo />
            <p className="max-w-xs text-body-sm text-muted-foreground">
              Branded property platforms for African real estate agencies.
            </p>
          </div>
          {columns.map((col) => (
            <nav key={col.title} className="flex flex-col gap-3" aria-label={col.title}>
              <p className="text-label text-foreground">{col.title}</p>
              {col.links.map((l) => (
                <a
                  key={l}
                  href="#"
                  className="text-body-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {l}
                </a>
              ))}
            </nav>
          ))}
        </div>
        <div className="flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-caption text-muted-foreground">
            © {new Date().getFullYear()} Estatify. All rights reserved.
          </p>
          <p className="text-caption text-muted-foreground">Built for the African real estate market.</p>
        </div>
      </Container>
    </footer>
  );
}
