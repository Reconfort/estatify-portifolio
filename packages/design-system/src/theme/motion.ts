/**
 * Motion tokens + Framer Motion variant presets.
 *
 * Durations/easings mirror the CSS custom properties in globals.css so CSS
 * transitions and Framer animations feel identical. Variants are plain objects
 * (no runtime import of framer-motion) and are typed structurally, so this file
 * has zero dependencies and is safe to import anywhere. Pass them to
 * `<motion.div variants={fadeUp} .../>` once framer-motion is installed.
 *
 * Principle: fast, smooth, natural. No bounce on functional UI; springs are
 * reserved for delightful, non-blocking moments. Always honor reduced-motion.
 */

export const durations = {
  fast: 0.12,
  base: 0.2,
  slow: 0.32,
} as const;

export const easing = {
  standard: [0.2, 0, 0, 1],
  emphasized: [0.3, 0, 0, 1],
  in: [0.4, 0, 1, 1],
  out: [0, 0, 0.2, 1],
} as const;

/** Minimal structural types so we don't depend on framer-motion at build time. */
type Transition = Record<string, unknown>;
/** A single animation state: arbitrary CSS targets plus an optional transition. */
type AnimationState = {
  transition?: Transition;
  [key: string]: number | string | Transition | undefined;
};
export type Variant = Record<string, AnimationState>;

export const fadeIn: Variant = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: durations.base, ease: easing.out } },
};

export const fadeUp: Variant = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: durations.base, ease: easing.standard } },
};

export const fadeDown: Variant = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0, transition: { duration: durations.base, ease: easing.standard } },
};

export const scaleIn: Variant = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: durations.base, ease: easing.emphasized } },
};

/** Route/page transition. */
export const pageTransition: Variant = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: durations.slow, ease: easing.standard } },
  exit: { opacity: 0, y: -8, transition: { duration: durations.fast, ease: easing.in } },
};

/** Drawer (slide from edge). Compose with the appropriate axis at the call site. */
export const drawerTransition: Variant = {
  hidden: { x: "100%" },
  visible: { x: 0, transition: { duration: durations.slow, ease: easing.emphasized } },
  exit: { x: "100%", transition: { duration: durations.base, ease: easing.in } },
};

export const modalTransition: Variant = {
  hidden: { opacity: 0, scale: 0.98, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: durations.base, ease: easing.emphasized } },
  exit: { opacity: 0, scale: 0.98, y: 8, transition: { duration: durations.fast, ease: easing.in } },
};

export const dropdownTransition: Variant = {
  hidden: { opacity: 0, scale: 0.96, y: -4 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: durations.fast, ease: easing.out } },
  exit: { opacity: 0, scale: 0.96, y: -4, transition: { duration: durations.fast, ease: easing.in } },
};

/** Stagger container — children should use fadeUp. */
export const staggerContainer: Variant = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.04 } },
};

export const motionPresets = {
  fadeIn,
  fadeUp,
  fadeDown,
  scaleIn,
  pageTransition,
  drawerTransition,
  modalTransition,
  dropdownTransition,
  staggerContainer,
} as const;
