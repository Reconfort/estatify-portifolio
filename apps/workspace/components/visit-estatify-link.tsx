import { marketingHomeUrl } from "../lib/marketing-urls";

/**
 * Escape hatch back to the public marketing site.
 * Label is "Visit Estatify" / "← Estatify Home" — never "Back to Home"
 * (ambiguous once the user is inside the product).
 */
export function VisitEstatifyLink({
  variant = "visit",
  className,
}: {
  variant?: "visit" | "home";
  className?: string;
}) {
  const label = variant === "home" ? "← Estatify Home" : "Visit Estatify";
  return (
    <a
      href={marketingHomeUrl()}
      className={
        className ?? "text-body-sm text-muted-foreground transition-colors hover:text-foreground"
      }
    >
      {label}
    </a>
  );
}
