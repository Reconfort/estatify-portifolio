import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@estatify/utils";

/**
 * Button — the reference primitive for the design system.
 * Token-only styling (no hardcoded colors), variant/size via cva, fully typed,
 * accessible focus ring. Every new primitive follows this pattern.
 */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium transition-colors outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground hover:bg-primary-hover",
        accent: "bg-accent text-accent-foreground hover:opacity-90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-muted",
        outline: "border border-input bg-background text-foreground hover:bg-secondary",
        ghost: "text-foreground hover:bg-secondary",
        destructive: "bg-destructive text-destructive-foreground hover:opacity-90",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 px-3 text-body-sm",
        md: "h-10 px-4 text-body-sm",
        lg: "h-12 px-8 text-body-md",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  function Button({ className, variant, size, ...props }, ref) {
    return (
      <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
    );
  },
);

export { buttonVariants };
