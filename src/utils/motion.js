import { stagger } from "motion-v";

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Spring configs
export const springs = {
    default: { type: "spring", stiffness: 300, damping: 25 },
    gentle: { type: "spring", stiffness: 200, damping: 20 },
    bouncy: { type: "spring", stiffness: 400, damping: 15 },
    snappy: { type: "spring", stiffness: 500, damping: 30 },
};

const noMotion = { duration: 0 };

// Stagger container variants
export const staggerContainer = (delay = 0.06) => ({
    hidden: {},
    visible: {
        transition: prefersReducedMotion()
            ? {}
            : { delayChildren: stagger(delay) },
    },
});

// Fade up (most common element entrance)
export const fadeUp = prefersReducedMotion()
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: noMotion } }
    : { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: springs.default } };

// Fade in from left (for border-l sections)
export const fadeLeft = prefersReducedMotion()
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: noMotion } }
    : { hidden: { opacity: 0, x: -15 }, visible: { opacity: 1, x: 0, transition: springs.default } };

// Scale fade (for cards)
export const scaleFade = prefersReducedMotion()
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: noMotion } }
    : { hidden: { opacity: 0, scale: 0.95, y: 10 }, visible: { opacity: 1, scale: 1, y: 0, transition: springs.gentle } };

// Hover/press presets
export const cardHover = prefersReducedMotion() ? {} : { scale: 1.02, transition: springs.snappy };
export const cardPress = prefersReducedMotion() ? {} : { scale: 0.98 };
export const linkHover = prefersReducedMotion() ? {} : { x: 3, transition: springs.snappy };

// Page transition presets (removed filter: blur — not compositor-friendly)
export const pageEnter = prefersReducedMotion()
    ? { opacity: 0 }
    : { opacity: 0, y: 15 };
export const pageAnimate = prefersReducedMotion()
    ? { opacity: 1 }
    : { opacity: 1, y: 0 };
export const pageExit = prefersReducedMotion()
    ? { opacity: 0 }
    : { opacity: 0, y: -10 };
export const pageTransition = prefersReducedMotion() ? noMotion : springs.gentle;
