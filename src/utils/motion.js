import { stagger } from "motion-v";

const prefersReducedMotion = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// Spring configs
export const springs = {
    default: { type: "spring", stiffness: 300, damping: 25 },
    gentle: { type: "spring", stiffness: 200, damping: 20 },
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
