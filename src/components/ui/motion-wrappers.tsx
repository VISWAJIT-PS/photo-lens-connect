import React from "react";
import { motion, AnimatePresence, MotionProps, Variants, TargetAndTransition, VariantLabels } from "framer-motion";
import { 
  fadeVariants, 
  slideVariants, 
  scaleVariants, 
  pageVariants,
  staggerVariants,
  getAccessibleVariants,
  transitions,
  interactionVariants
} from "@/lib/motion";

// Base animated component props
interface BaseAnimatedProps {
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
  initial?: boolean | TargetAndTransition | VariantLabels;
  animate?: boolean | TargetAndTransition | VariantLabels;
  exit?: TargetAndTransition | VariantLabels;
}

// Fade animation wrapper
export const FadeIn: React.FC<BaseAnimatedProps> = ({ 
  children, 
  className,
  variants = fadeVariants,
  initial = "hidden",
  animate = "visible",
  exit = "exit",
  ...props 
}) => (
  <motion.div
    className={className}
    variants={getAccessibleVariants(variants)}
    initial={initial}
    animate={animate}
    exit={exit}
    {...props}
  >
    {children}
  </motion.div>
);

// Slide animation wrapper with direction
interface SlideInProps extends BaseAnimatedProps {
  direction?: "up" | "down" | "left" | "right";
}

export const SlideIn: React.FC<SlideInProps> = ({ 
  children, 
  direction = "up",
  className,
  initial = "hidden",
  animate = "visible",
  exit = "exit",
  ...props 
}) => {
  const variants = getAccessibleVariants(slideVariants[direction]);
  
  return (
    <motion.div
      className={className}
      variants={variants}
      initial={initial}
      animate={animate}
      exit={exit}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Scale animation wrapper
export const ScaleIn: React.FC<BaseAnimatedProps> = ({ 
  children, 
  className,
  variants = scaleVariants,
  initial = "hidden",
  animate = "visible",
  exit = "exit",
  ...props 
}) => (
  <motion.div
    className={className}
    variants={getAccessibleVariants(variants)}
    initial={initial}
    animate={animate}
    exit={exit}
    {...props}
  >
    {children}
  </motion.div>
);

// Stagger container for animating lists
interface StaggerContainerProps extends BaseAnimatedProps {
  delayChildren?: number;
  staggerChildren?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({ 
  children, 
  className,
  delayChildren = 0.2,
  staggerChildren = 0.1,
  initial = "hidden",
  animate = "visible",
  ...props 
}) => {
  const variants = getAccessibleVariants({
    ...staggerVariants,
    visible: {
      ...staggerVariants.visible,
      transition: {
        delayChildren,
        staggerChildren,
      },
    },
  });

  return (
    <motion.div
      className={className}
      variants={variants}
      initial={initial}
      animate={animate}
      {...props}
    >
      {children}
    </motion.div>
  );
};

// Stagger item for use within StaggerContainer
export const StaggerItem: React.FC<BaseAnimatedProps> = ({ 
  children, 
  className,
  variants = fadeVariants,
  ...props 
}) => (
  <motion.div
    className={className}
    variants={getAccessibleVariants(variants)}
    {...props}
  >
    {children}
  </motion.div>
);

// Interactive button wrapper with hover and tap animations
interface InteractiveProps extends BaseAnimatedProps {
  enableHover?: boolean;
  enableTap?: boolean;
  enableFocus?: boolean;
  whileHover?: TargetAndTransition | VariantLabels;
  whileTap?: TargetAndTransition | VariantLabels;
  whileFocus?: TargetAndTransition | VariantLabels;
}

export const Interactive: React.FC<InteractiveProps> = ({ 
  children, 
  className,
  enableHover = true,
  enableTap = true,
  enableFocus = true,
  whileHover = enableHover ? interactionVariants.hover : undefined,
  whileTap = enableTap ? interactionVariants.tap : undefined,
  whileFocus = enableFocus ? interactionVariants.focus : undefined,
  ...props 
}) => (
  <motion.div
    className={className}
    whileHover={whileHover}
    whileTap={whileTap}
    whileFocus={whileFocus}
    {...props}
  >
    {children}
  </motion.div>
);

// Page transition wrapper
export const PageTransition: React.FC<BaseAnimatedProps> = ({ 
  children, 
  className,
  variants = pageVariants,
  initial = "initial",
  animate = "in",
  exit = "out",
  ...props 
}) => (
  <motion.div
    className={className}
    variants={getAccessibleVariants(variants)}
    initial={initial}
    animate={animate}
    exit={exit}
    {...props}
  >
    {children}
  </motion.div>
);

// Modal/Dialog wrapper with backdrop
interface ModalWrapperProps extends BaseAnimatedProps {
  isOpen: boolean;
  onClose?: () => void;
  backdropClassName?: string;
}

export const ModalWrapper: React.FC<ModalWrapperProps> = ({ 
  children, 
  isOpen,
  onClose,
  className,
  backdropClassName = "fixed inset-0 bg-black/50 z-50 flex items-center justify-center",
  variants = scaleVariants,
  ...props 
}) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        className={backdropClassName}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={transitions.fast}
        onClick={onClose}
      >
        <motion.div
          className={className}
          variants={getAccessibleVariants(variants)}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Layout animation wrapper for smooth layout changes
export const LayoutWrapper: React.FC<BaseAnimatedProps> = ({ 
  children, 
  className,
  ...props 
}) => (
  <motion.div
    className={className}
    layout
    transition={transitions.spring}
    {...props}
  >
    {children}
  </motion.div>
);

// Parallax wrapper for scroll-based animations
interface ParallaxProps extends BaseAnimatedProps {
  offset?: number;
}

export const Parallax: React.FC<ParallaxProps> = ({ 
  children, 
  className,
  offset = 50,
  ...props 
}) => (
  <motion.div
    className={className}
    initial={{ y: offset, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={transitions.default}
    {...props}
  >
    {children}
  </motion.div>
);

// Higher-order component for adding animations to any component
export function withMotion<P extends object>(
  Component: React.ComponentType<P>,
  animationConfig: {
    variants?: Variants;
    initial?: boolean | TargetAndTransition | VariantLabels;
    animate?: boolean | TargetAndTransition | VariantLabels;
    exit?: TargetAndTransition | VariantLabels;
    transition?: any;
  } = {}
) {
  const {
    variants = fadeVariants,
    initial = "hidden",
    animate = "visible",
    exit = "exit",
    transition = transitions.default,
  } = animationConfig;

  return React.forwardRef<any, P & { className?: string }>((props, ref) => (
    <motion.div
      ref={ref}
      variants={getAccessibleVariants(variants)}
      initial={initial as VariantLabels}
      animate={animate as VariantLabels}
      exit={exit as VariantLabels}
      transition={transition}
      className={props.className}
    >
      <Component {...(props as P)} />
    </motion.div>
  ));
}

// Utility component for animating presence of conditional content
interface ConditionalAnimateProps {
  show: boolean;
  children: React.ReactNode;
  className?: string;
  variants?: Variants;
}

export const ConditionalAnimate: React.FC<ConditionalAnimateProps> = ({
  show,
  children,
  className,
  variants = fadeVariants,
}) => (
  <AnimatePresence>
    {show && (
      <motion.div
        className={className}
        variants={getAccessibleVariants(variants)}
        initial="hidden" as VariantLabels
        animate="visible" as VariantLabels
        exit="exit" as VariantLabels
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

// Pre-configured commonly used animated components
export const AnimatedCard = motion.div;
export const AnimatedButton = motion.button;
export const AnimatedImage = motion.img;
export const AnimatedGrid = motion.div;
export const AnimatedList = motion.ul;
export const AnimatedListItem = motion.li;