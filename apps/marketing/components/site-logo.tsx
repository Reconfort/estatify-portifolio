import Image from "next/image";
import { cn } from "@estatify/utils";
import { brandLogo } from "@/components/landing-data";

interface SiteLogoProps {
  className?: string;
  /** White wordmark for use over the hero photo. */
  inverted?: boolean;
}

/** Estatify brand mark — logo icon + wordmark. */
export function SiteLogo({ className, inverted = false }: SiteLogoProps) {
  return (
    <span className={cn("flex items-center gap-2", className)}>
      <Image
        src={brandLogo}
        alt=""
        width={27}
        height={32}
        className="h-8 w-auto shrink-0"
        aria-hidden
      />
      <span className={cn("text-h5 font-semibold", inverted ? "text-white" : "text-foreground")}>
        Estatify
      </span>
    </span>
  );
}
