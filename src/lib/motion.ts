import type { Transition, Variants } from "motion/react";

/**
 * Zentrales Motion-System für KlassenHub.
 *
 * Regeln:
 * - Maximaldauer 600 ms, keine Bounce-Easings.
 * - Eine Standard-Kurve (EASE_OUT) für Eintritte, EASE_IN_OUT für Overlays.
 * - Komponenten mit y/scale-Bewegung sollten `useReducedMotion()` prüfen
 *   und auf `fadeIn` bzw. den Endzustand zurückfallen.
 */

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;

export const DURATION = {
  fast: 0.15,
  base: 0.25,
  slow: 0.45,
} as const;

/** Weiche Feder ohne Überschwingen – für layoutId-Indikatoren. */
export const SPRING_SOFT: Transition = {
  type: "spring",
  stiffness: 320,
  damping: 32,
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.slow, ease: EASE_OUT },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06, delayChildren: 0.08 },
  },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: EASE_OUT },
  },
};

export const listItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: { duration: DURATION.base, ease: EASE_IN_OUT },
  },
};

/** Hover/Press für klickbare Cards (als motion-Props spreaden). */
export const cardHover = {
  whileHover: { y: -3 },
  whileTap: { scale: 0.99 },
  transition: { duration: 0.2, ease: EASE_OUT },
} as const;

/** Press-Feedback für Buttons (als motion-Props spreaden). */
export const buttonMicroInteraction = {
  whileTap: { scale: 0.97 },
  transition: { duration: DURATION.fast, ease: EASE_OUT },
} as const;

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: EASE_OUT },
  },
};

export const modalTransition: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DURATION.base, ease: EASE_OUT },
  },
  exit: {
    opacity: 0,
    y: 8,
    scale: 0.97,
    transition: { duration: DURATION.fast, ease: EASE_IN_OUT },
  },
};

/** Transition für aktive Routen-Indikatoren via `layoutId`. */
export const activeRouteIndicator: Transition = SPRING_SOFT;

/** Animation für Poll-Ergebnisbalken (Breite wächst einmalig ein). */
export function pollBarAnimation(percentage: number, index = 0) {
  return {
    initial: { width: 0 },
    whileInView: { width: `${Math.max(0, Math.min(100, percentage))}%` },
    viewport: { once: true, amount: 0.4 },
    transition: {
      duration: 0.6,
      ease: EASE_OUT,
      delay: Math.min(index, 6) * 0.08,
    },
  } as const;
}
