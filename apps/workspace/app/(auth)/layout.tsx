import { AuthBrand, AuthLayout, defaultAuthTestimonials } from "@estatify/ui";
import { marketingHomeUrl } from "@/lib/marketing-urls";

/**
 * Single auth chrome for every Workspace auth route.
 * Pages only render `<AuthForm>` — never another full-page layout.
 * Brand + back link send users to the public marketing site.
 */
export default function WorkspaceAuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const marketingUrl = marketingHomeUrl();

  return (
    <AuthLayout
      brand={
        <>
          <AuthBrand href={marketingUrl} />
          <a
            href={marketingUrl}
            className="text-body-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Back to website
          </a>
        </>
      }
      testimonials={defaultAuthTestimonials}
    >
      {children}
    </AuthLayout>
  );
}
