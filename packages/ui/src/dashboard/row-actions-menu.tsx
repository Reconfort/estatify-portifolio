"use client";

import * as React from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Download, MoreVertical, Printer, Share2, Trash2, type LucideIcon } from "lucide-react";
import { cn } from "@estatify/utils";
import { DASH_EASE } from "./dashboard-card";

export interface RowAction {
  label: string;
  icon: LucideIcon;
  onSelect?: (() => void) | undefined;
  destructive?: boolean | undefined;
}

export const defaultRowActions: readonly RowAction[] = [
  { label: "Download", icon: Download },
  { label: "Print", icon: Printer },
  { label: "Share", icon: Share2 },
  { label: "Delete", icon: Trash2, destructive: true },
];

/**
 * RowActionsMenu — the ⋮ dropdown used in dashboard tables.
 * Click-outside + Escape to close, keyboard navigable, subtle pop animation.
 */
export function RowActionsMenu({
  ariaLabel,
  actions = defaultRowActions,
  className,
}: {
  ariaLabel: string;
  actions?: readonly RowAction[] | undefined;
  className?: string | undefined;
}) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  // Close on click outside / Escape
  React.useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cn("relative inline-flex", className)}>
      <button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "rounded-md p-1.5 text-muted-foreground transition-[opacity,background-color,color]",
          "hover:bg-secondary hover:text-foreground focus-visible:opacity-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          open ? "bg-secondary text-foreground opacity-100" : "opacity-0 group-hover:opacity-100",
        )}
      >
        <MoreVertical className="size-4" aria-hidden />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label={ariaLabel}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, transition: { duration: 0.1 } }}
            transition={{ duration: 0.16, ease: DASH_EASE }}
            className="absolute right-0 top-9 z-30 w-44 origin-top-right rounded-lg border border-border/70 bg-popover p-1.5 shadow-lg"
          >
            {actions.map((a, i) => {
              const Icon = a.icon;
              return (
                <React.Fragment key={a.label}>
                  {a.destructive && i > 0 ? (
                    <div
                      className="mx-1 my-1 border-t border-dashed border-border/70"
                      aria-hidden
                    />
                  ) : null}
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setOpen(false);
                      a.onSelect?.();
                    }}
                    className={cn(
                      "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-body-sm font-medium transition-colors",
                      "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring",
                      a.destructive
                        ? "text-destructive hover:bg-destructive/10"
                        : "text-foreground hover:bg-secondary",
                    )}
                  >
                    <Icon
                      className={cn(
                        "size-4",
                        a.destructive ? "text-destructive" : "text-muted-foreground",
                      )}
                      aria-hidden
                    />
                    {a.label}
                  </button>
                </React.Fragment>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
