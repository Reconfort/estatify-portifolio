import { cn } from "@estatify/utils";

type DotBackgroundProps = {
  className?: string;
  /**
   * When true (default), pins to the viewport behind page content.
   * Set false for an absolutely positioned section-local backdrop.
   */
  fixed?: boolean;
};

/**
 * DotBackground — Aceternity-style dotted grid with a soft radial fade.
 * Presentational only. Use as a full-page fixed layer (z-0) behind marketing
 * content, or absolutely inside a relative section.
 */
export function DotBackground({ className, fixed = true }: DotBackgroundProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none overflow-hidden bg-background",
        fixed ? "fixed inset-0 z-0" : "absolute inset-0",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(color-mix(in_oklab,var(--color-foreground)_14%,transparent)_1px,transparent_1px)]",
        )}
      />
      {/* Soft center vignette so content stays readable */}
      <div className="absolute inset-0 bg-background [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
    </div>
  );
}
