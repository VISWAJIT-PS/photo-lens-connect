import { Variants, Transition } from "framer-motion";

/**
 * Animation configuration constants for consistent motion design
 */

// Easing curves for natural motion
export const easings = {
  easeInOut: [0.4, 0, 0.2, 1],
  easeOut: [0, 0, 0.2, 1],
  easeIn: [0.4, 0, 1, 1],
  bounce: [0.68, -0.55, 0.265, 1.55],
  sharp: [0.4, 0, 0.6, 1],
} as const;

// Animation durations
export const durations = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  verySlow: 0.8,
} as const;

// Spring configurations
export const springs = {
  gentle: {
    type: "spring" as const,
    stiffness: 120,
    damping: 14,
  },
  wobbly: {
    type: "spring" as const,
    stiffness: 180,
    damping: 12,
  },
  stiff: {
    type: "spring" as const,
    stiffness: 200,
    damping: 20,
  },
} as const;

// Standard transition configurations
export const transitions: Record<string, Transition> = {
  default: {
    duration: durations.normal,
    ease: easings.easeInOut,
  },
  fast: {
    duration: durations.fast,
    ease: easings.easeOut,
  },
  slow: {
    duration: durations.slow,
    ease: easings.easeInOut,
  },
  bounce: {
    duration: durations.normal,
    ease: easings.bounce,
  },
  spring: springs.gentle,
  springWobbly: springs.wobbly,
  springStiff: springs.stiff,
};

// Fade animation variants
export const fadeVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: transitions.default,
  },
  exit: {
    opacity: 0,
    transition: transitions.fast,
  },
};

// Slide animation variants
export const slideVariants = {
  up: {
    hidden: {
      opacity: 0,
      y: 40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: transitions.default,
    },
    exit: {
      opacity: 0,
      y: -40,
      transition: transitions.fast,
    },
  },
  down: {
    hidden: {
      opacity: 0,
      y: -40,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: transitions.default,
    },
    exit: {
      opacity: 0,
      y: 40,
      transition: transitions.fast,
    },
  },
  left: {
    hidden: {
      opacity: 0,
      x: 40,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: transitions.default,
    },
    exit: {
      opacity: 0,
      x: -40,
      transition: transitions.fast,
    },
  },
  right: {
    hidden: {
      opacity: 0,
      x: -40,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: transitions.default,
    },
    exit: {
      opacity: 0,
      x: 40,
      transition: transitions.fast,
    },
  },
} as const;

// Scale animation variants
export const scaleVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: transitions.fast,
  },
};

// Hover and tap animations for interactive elements
export const interactionVariants = {
  hover: {
    scale: 1.05,
    transition: transitions.fast,
  },
  tap: {
    scale: 0.95,
    transition: transitions.fast,
  },
  focus: {
    scale: 1.02,
    transition: transitions.fast,
  },
} as const;

// Page transition variants
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  in: {
    opacity: 1,
    y: 0,
    transition: transitions.default,
  },
  out: {
    opacity: 0,
    y: -20,
    transition: transitions.fast,
  },
};

// Stagger animation for lists and grids
export const staggerVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Gallery and photo-specific animations
export const galleryVariants = {
  grid: {
    hidden: {
      opacity: 0,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: durations.normal,
        ease: easings.easeOut,
      },
    },
  },
  photo: {
    hidden: {
      opacity: 0,
      scale: 0.9,
      filter: "blur(4px)",
    },
    visible: {
      opacity: 1,
      scale: 1,
      filter: "blur(0px)",
      transition: {
        duration: durations.slow,
        ease: easings.easeOut,
      },
    },
    hover: {
      scale: 1.03,
      transition: transitions.fast,
    },
  },
} as const;

// Modal and dialog animations
export const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: transitions.spring,
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: transitions.fast,
  },
};

// Loading and skeleton animations
export const loadingVariants = {
  pulse: {
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
  wave: {
    animate: {
      x: ["-100%", "100%"],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  },
  spin: {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      },
    },
  },
} as const;

// Utility functions for creating custom animations
export const createSlideVariant = (direction: "up" | "down" | "left" | "right", distance: number = 40) => ({
  hidden: {
    opacity: 0,
    ...(direction === "up" && { y: distance }),
    ...(direction === "down" && { y: -distance }),
    ...(direction === "left" && { x: distance }),
    ...(direction === "right" && { x: -distance }),
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: transitions.default,
  },
});

export const createStaggerContainer = (delayChildren: number = 0.1, staggerChildren: number = 0.1) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren,
      staggerChildren,
    },
  },
});

// Reduced motion preferences
export const getReducedMotionVariants = (variants: Variants): Variants => {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return Object.keys(variants).reduce((acc, key) => {
      acc[key] = {
        ...variants[key],
        transition: { duration: 0 },
      };
      return acc;
    }, {} as Variants);
  }
  return variants;
};

// Accessibility-aware animation utility
export const getAccessibleVariants = (variants: Variants): Variants => {
  return getReducedMotionVariants(variants);
};