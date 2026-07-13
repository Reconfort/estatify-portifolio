import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@estatify/utils";

const announcementBadgeVariants = cva(
  "inline-flex items-center gap-2 border text-body-sm transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  {
    variants: {
      variant: {
        soft: "border-border bg-card/80 text-muted-foreground backdrop-blur-sm hover:bg-card",
        solid: "border-border bg-card text-muted-foreground hover:bg-secondary",
      },
      size: {
        sm: "rounded-full px-3 py-1.5",
        md: "rounded-md px-5 py-3",
      },
    },
    defaultVariants: { variant: "soft", size: "md" },
  },
);

export interface AnnouncementBadgeProps extends VariantProps<typeof announcementBadgeVariants> {
  /** Primary message (plain text). */
  text: React.ReactNode;
  /** Emphasized trailing CTA label (e.g. "Start free →"). */
  cta?: React.ReactNode;
  /** When set, renders as an anchor. */
  href?: string;
  /** Show the status dot. Defaults to true. */
  showDot?: boolean;
  className?: string;
}

/**
 * AnnouncementBadge — reusable status / promo chip for marketing + product surfaces.
 * Presentational only; apps own copy and destinations.
 */
export const AnnouncementBadge = React.forwardRef<
  HTMLAnchorElement | HTMLSpanElement,
  AnnouncementBadgeProps
>(function AnnouncementBadge({ text, cta, href, showDot = true, variant, size, className }, ref) {
  const classes = cn(announcementBadgeVariants({ variant, size }), className);

  const body = (
    <>
      {showDot ? <span className="h-2 w-2 shrink-0 rounded-[0.5px] bg-accent" aria-hidden /> : null}
      <span>
        {text}
        {cta ? (
          <>
            {" "}
            <span className="font-medium text-accent ml-1">{cta}</span>
          </>
        ) : null}
      </span>
    </>
  );

  if (href) {
    return (
      <a ref={ref as React.Ref<HTMLAnchorElement>} href={href} className={classes}>
        {body}
      </a>
    );
  }

  return (
    <span ref={ref as React.Ref<HTMLSpanElement>} className={classes}>
      {body}
    </span>
  );
});

export { announcementBadgeVariants };
