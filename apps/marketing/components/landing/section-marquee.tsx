import Image from "next/image";
import { Marquee } from "@estatify/ui";
import { cn } from "@estatify/utils";

interface SectionMarqueeProps {
  /** Short label repeated across the strip, e.g. "Who we are". */
  label: string;
  /** Visual tone — `dark` for strips sitting on dark panels. */
  tone?: "light" | "dark";
  /** When set, replaces the default dot separator with this icon. */
  separatorIcon?: string;
  separatorIconClassName?: string;
  className?: string;
}

/**
 * SectionMarquee — the auto-scrolling uppercase label strip that introduces
 * each landing section. Decorative only, hidden from assistive tech (the
 * following section supplies the real heading).
 */
export function SectionMarquee({
  label,
  tone = "light",
  separatorIcon,
  separatorIconClassName,
  className,
}: SectionMarqueeProps) {
  const items = Array.from({ length: 8 });

  return (
    <div
      aria-hidden
      className={cn(
        "border-y py-4 select-none",
        tone === "light" ? "border-border bg-secondary/50" : "border-white/10 bg-transparent",
        className,
      )}
    >
      <Marquee speed={40}>
        {items.map((_, i) => (
          <span
            key={i}
            className={cn(
              "flex items-center gap-4 whitespace-nowrap text-h4 font-semibold uppercase tracking-[0.18em]",
              tone === "light" ? "text-muted-foreground/60" : "text-white/40",
            )}
          >
            {label}
            {separatorIcon ? (
              <Image
                src={separatorIcon}
                alt=""
                width={17}
                height={20}
                className={cn("h-5 w-auto shrink-0", separatorIconClassName)}
                aria-hidden
              />
            ) : (
              <span className={cn("h-1.5 w-1.5 rounded-full", tone === "light" ? "bg-accent" : "bg-accent")} />
            )}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
