import { Container } from "@estatify/ui";

const columns = [
  { title: "Product", links: ["Features", "Showcase", "Pricing", "Templates"] },
  { title: "Company", links: ["About", "Blog", "Careers", "Contact"] },
  { title: "Resources", links: ["Docs", "Support", "Status", "Changelog"] },
  { title: "Legal", links: ["Privacy", "Terms", "Cookies"] },
];

/** Marketing footer. */
export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background py-16">
      <Container className="flex flex-col gap-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="flex flex-col gap-3 lg:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-body-md font-bold">E</span>
              </span>
              <span className="text-h5 font-semibold text-foreground">Estatify</span>
            </div>
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
