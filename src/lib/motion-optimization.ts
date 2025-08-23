import { Variants } from "framer-motion";

/**
 * Animation optimization utilities for performance and accessibility
 */

// Performance monitoring
export const animationPerformance = {
  // Track animation performance
  startTime: 0,
  endTime: 0,
  
  startTracking() {
    this.startTime = performance.now();
  },
  
  endTracking() {
    this.endTime = performance.now();
    const duration = this.endTime - this.startTime;
    
    // Log if animation takes too long (over 16ms for 60fps)
    if (duration > 16) {
      console.warn(`Animation took ${duration.toFixed(2)}ms - consider optimization`);
    }
    
    return duration;
  }
};

// Reduced motion detection
export const getReducedMotionPreference = (): boolean => {
  if (typeof window === "undefined") return false;
  
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  return mediaQuery.matches;
};

// Performance-aware animation variants
export const createPerformantVariants = (baseVariants: Variants): Variants => {
  const isReducedMotion = getReducedMotionPreference();
  
  if (isReducedMotion) {
    // Remove transforms and reduce to opacity changes only
    return Object.keys(baseVariants).reduce((acc, key) => {
      acc[key] = {
        opacity: baseVariants[key].opacity || 1,
        transition: { duration: 0 }
      };
      return acc;
    }, {} as Variants);
  }
  
  return baseVariants;
};

// Intersection Observer for performant scroll animations
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options: IntersectionObserverInit = {}
) => {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    return null;
  }
  
  const defaultOptions: IntersectionObserverInit = {
    root: null,
    rootMargin: "10px",
    threshold: 0.1,
    ...options
  };
  
  return new IntersectionObserver(callback, defaultOptions);
};

// Debounced scroll handler for performance
export const createDebouncedScrollHandler = (
  callback: () => void,
  delay: number = 16 // 60fps
) => {
  let timeoutId: NodeJS.Timeout | null = null;
  
  return () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    
    timeoutId = setTimeout(callback, delay);
  };
};

// Animation queue for managing multiple animations
class AnimationQueue {
  private queue: Array<() => Promise<void>> = [];
  private isRunning = false;
  
  add(animation: () => Promise<void>) {
    this.queue.push(animation);
    this.process();
  }
  
  private async process() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    
    while (this.queue.length > 0) {
      const animation = this.queue.shift();
      if (animation) {
        try {
          await animation();
        } catch (error) {
          console.error("Animation error:", error);
        }
      }
    }
    
    this.isRunning = false;
  }
  
  clear() {
    this.queue = [];
    this.isRunning = false;
  }
}

export const animationQueue = new AnimationQueue();

// Memory-efficient animation presets
export const memoryEfficientVariants = {
  // Use transform instead of layout changes
  slideUp: {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  },
  
  // Avoid filter effects for better performance
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  },
  
  // Use scale instead of width/height changes
  scaleIn: {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1 }
  }
};

// GPU-accelerated properties checker
export const isGPUAccelerated = (property: string): boolean => {
  const gpuProperties = [
    'transform',
    'opacity',
    'filter',
    'backdrop-filter',
    'perspective',
    'transform-style'
  ];
  
  return gpuProperties.some(prop => property.includes(prop));
};

// Performance monitoring hook for React components
export const useAnimationPerformance = () => {
  const monitorAnimation = (animationName: string) => {
    const start = performance.now();
    
    return () => {
      const end = performance.now();
      const duration = end - start;
      
      if (duration > 16) {
        console.warn(`${animationName} animation took ${duration.toFixed(2)}ms`);
      }
      
      // Report to analytics if needed
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag('event', 'animation_performance', {
          animation_name: animationName,
          duration: Math.round(duration),
          performance_warning: duration > 16
        });
      }
    };
  };
  
  return { monitorAnimation };
};

// Accessibility-compliant animation utilities
export const accessibilityUtils = {
  // Check if user prefers reduced motion
  shouldReduceMotion(): boolean {
    return getReducedMotionPreference();
  },
  
  // Get accessible transition duration
  getAccessibleDuration(originalDuration: number): number {
    return this.shouldReduceMotion() ? 0 : originalDuration;
  },
  
  // Create accessible variants
  createAccessibleVariants(variants: Variants): Variants {
    if (this.shouldReduceMotion()) {
      return Object.keys(variants).reduce((acc, key) => {
        acc[key] = {
          opacity: variants[key].opacity || 1,
          transition: { duration: 0 }
        };
        return acc;
      }, {} as Variants);
    }
    
    return variants;
  },
  
  // Focus management for animated elements
  manageFocus(element: HTMLElement, shouldFocus: boolean = true) {
    if (shouldFocus) {
      // Ensure element is focusable
      if (!element.hasAttribute('tabindex')) {
        element.setAttribute('tabindex', '-1');
      }
      
      // Focus after animation completes
      setTimeout(() => {
        element.focus();
      }, this.getAccessibleDuration(300));
    }
  }
};

// Bundle size optimization - lazy load heavy animations
export const lazyAnimations = {
  async loadComplexAnimations() {
    // Dynamically import heavy animation libraries only when needed
    if (typeof window !== "undefined") {
      try {
        const { default: lottie } = await import('lottie-web');
        return lottie;
      } catch (error) {
        console.warn('Failed to load complex animations:', error);
        return null;
      }
    }
    return null;
  },
  
  async loadSpringPhysics() {
    try {
      const { useSpring } = await import('@react-spring/web');
      return useSpring;
    } catch (error) {
      console.warn('Failed to load spring physics:', error);
      return null;
    }
  }
};

// Animation cleanup utilities
export const cleanupUtils = {
  // Cancel all running animations
  cancelAllAnimations(elements: HTMLElement[]) {
    elements.forEach(element => {
      element.getAnimations().forEach(animation => {
        animation.cancel();
      });
    });
  },
  
  // Remove animation event listeners
  removeAnimationListeners(element: HTMLElement) {
    const events = ['animationstart', 'animationend', 'animationiteration'];
    events.forEach(event => {
      element.removeEventListener(event, () => {});
    });
  },
  
  // Reset element styles
  resetElementStyles(element: HTMLElement) {
    element.style.transform = '';
    element.style.opacity = '';
    element.style.filter = '';
  }
};

// Production optimization settings
export const productionOptimizations = {
  // Disable debug logging in production
  enableDebugLogging: process.env.NODE_ENV !== 'production',
  
  // Reduce animation complexity in production
  simplifyAnimationsInProduction: process.env.NODE_ENV === 'production',
  
  // Enable performance monitoring in development
  enablePerformanceMonitoring: process.env.NODE_ENV === 'development',
  
  // Animation settings for different environments
  getAnimationConfig() {
    const isProduction = process.env.NODE_ENV === 'production';
    
    return {
      tension: isProduction ? 200 : 180,
      friction: isProduction ? 25 : 20,
      mass: isProduction ? 1 : 1.2,
      clamp: isProduction,
      precision: isProduction ? 0.1 : 0.01
    };
  }
};

// Global animation performance monitor
export const globalAnimationMonitor = {
  activeAnimations: new Set<string>(),
  maxConcurrentAnimations: 10,
  
  startAnimation(id: string) {
    if (this.activeAnimations.size >= this.maxConcurrentAnimations) {
      console.warn('Too many concurrent animations. Consider reducing animation complexity.');
    }
    
    this.activeAnimations.add(id);
  },
  
  endAnimation(id: string) {
    this.activeAnimations.delete(id);
  },
  
  getActiveCount(): number {
    return this.activeAnimations.size;
  },
  
  reset() {
    this.activeAnimations.clear();
  }
};