import { stagger } from "motion-v";

// Spring configs
export const springs = {
    default: { type: "spring", stiffness: 300, damping: 25 },
    gentle: { type: "spring", stiffness: 200, damping: 20 },
    bouncy: { type: "spring", stiffness: 400, damping: 15 },
    snappy: { type: "spring", stiffness: 500, damping: 30 },
};

// Stagger container variants
export const staggerContainer = (delay = 0.06) => ({
    hidden: {},
    visible: {
        transition: {
            delayChildren: stagger(delay),
        },
    },
});

// Fade up (most common element entrance)
export const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: springs.default },
};

// Fade in from left (for border-l sections)
export const fadeLeft = {
    hidden: { opacity: 0, x: -15 },
    visible: { opacity: 1, x: 0, transition: springs.default },
};

// Scale fade (for cards)
export const scaleFade = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: springs.gentle },
};

// Hover/press presets
export const cardHover = { scale: 1.02, transition: springs.snappy };
export const cardPress = { scale: 0.98 };
export const linkHover = { x: 3, transition: springs.snappy };

// Page transition presets
export const pageEnter = { opacity: 0, y: 15, filter: "blur(4px)" };
export const pageAnimate = { opacity: 1, y: 0, filter: "blur(0px)" };
export const pageExit = { opacity: 0, y: -10, filter: "blur(4px)" };
export const pageTransition = springs.gentle;
