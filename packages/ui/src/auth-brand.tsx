import Image from "next/image";
import { cn } from "@estatify/utils";

export interface AuthBrandProps {
  /** Logo image src (served from the app's /public). */
  logoSrc?: string;
  /** Link target for the brand mark. */
  href?: string;
  /** Optional product label under / beside Estatify (e.g. "Platform"). */
  product?: string;
  className?: string;
}

/**
 * AuthBrand — shared Estatify wordmark for auth screens across all apps.
 */
export function AuthBrand({
  logoSrc = "/assets/logo-gp.svg",
  href = "/",
  product,
  className,
}: AuthBrandProps) {
  return (
    <a
      href={href}
      aria-label="Estatify home"
      className={cn("inline-flex items-center gap-2.5", className)}
    >
      <Image
        src={logoSrc}
        alt=""
        width={27}
        height={32}
        className="h-8 w-auto shrink-0"
        aria-hidden
      />
      <span className="flex flex-col leading-tight">
        <span className="text-h5 font-semibold tracking-tight text-foreground">Estatify</span>
        {product ? (
          <span className="text-[0.65rem] font-medium tracking-[0.12em] text-muted-foreground uppercase">
            {product}
          </span>
        ) : null}
      </span>
    </a>
  );
}
