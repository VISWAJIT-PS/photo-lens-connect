import React from "react";
import { motion } from "framer-motion";
import { Camera, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { loadingVariants, transitions } from "@/lib/motion";

// Loading Spinner Component
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  color?: "primary" | "secondary" | "muted";
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className,
  color = "primary",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const colorClasses = {
    primary: "text-primary",
    secondary: "text-secondary",
    muted: "text-muted-foreground",
  };

  return (
    <motion.div
      className={cn("inline-block", className)}
      variants={loadingVariants.spin}
      animate="animate"
    >
      <Loader2 className={cn(sizeClasses[size], colorClasses[color])} />
    </motion.div>
  );
};

// Loading Dots Component
interface LoadingDotsProps {
  className?: string;
  color?: "primary" | "secondary" | "muted";
}

export const LoadingDots: React.FC<LoadingDotsProps> = ({
  className,
  color = "primary",
}) => {
  const colorClasses = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    muted: "bg-muted-foreground",
  };

  return (
    <div className={cn("flex space-x-1", className)}>
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className={cn("h-2 w-2 rounded-full", colorClasses[color])}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
            delay: index * 0.2,
          }}
        />
      ))}
    </div>
  );
};

// Skeleton Components
interface SkeletonProps {
  className?: string;
  variant?: "text" | "rectangular" | "circular";
  animate?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className,
  variant = "text",
  animate = true,
}) => {
  const baseClasses = "bg-muted";
  const variantClasses = {
    text: "h-4 rounded",
    rectangular: "rounded-md",
    circular: "rounded-full",
  };

  if (animate) {
    return (
      <motion.div
        className={cn(baseClasses, variantClasses[variant], className)}
        variants={loadingVariants.pulse}
        animate="animate"
      />
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        "animate-pulse",
        className
      )}
    />
  );
};

// Card Skeleton
export const SkeletonCard: React.FC<{ className?: string }> = ({
  className,
}) => (
  <div className={cn("space-y-4 p-4 border rounded-lg", className)}>
    <Skeleton variant="rectangular" className="h-48 w-full" />
    <div className="space-y-2">
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
    </div>
    <div className="flex space-x-2">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-20" />
    </div>
  </div>
);

// Avatar Skeleton
export const SkeletonAvatar: React.FC<{ 
  size?: "sm" | "md" | "lg";
  className?: string;
}> = ({ size = "md", className }) => {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  return (
    <Skeleton
      variant="circular"
      className={cn(sizeClasses[size], className)}
    />
  );
};

// Text Lines Skeleton
export const SkeletonText: React.FC<{
  lines?: number;
  className?: string;
}> = ({ lines = 3, className }) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        className={cn(
          "h-4",
          index === lines - 1 ? "w-3/4" : "w-full"
        )}
      />
    ))}
  </div>
);

// Photo Gallery Skeleton
export const SkeletonGallery: React.FC<{
  columns?: number;
  rows?: number;
  className?: string;
}> = ({ columns = 3, rows = 2, className }) => (
  <div
    className={cn(
      "grid gap-4",
      `grid-cols-${columns}`,
      className
    )}
  >
    {Array.from({ length: columns * rows }).map((_, index) => (
      <motion.div
        key={index}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1, duration: 0.5 }}
      >
        <Skeleton variant="rectangular" className="aspect-square w-full" />
      </motion.div>
    ))}
  </div>
);

// Loading Page Component
interface LoadingPageProps {
  message?: string;
  showLogo?: boolean;
  className?: string;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({
  message = "Loading...",
  showLogo = true,
  className,
}) => (
  <div className={cn("min-h-screen flex items-center justify-center", className)}>
    <div className="text-center space-y-4">
      {showLogo && (
        <motion.div
          className="inline-block"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <div className="p-3 bg-gradient-primary rounded-lg">
            <Camera className="h-8 w-8 text-primary-foreground" />
          </div>
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <LoadingDots className="justify-center mb-2" />
        <p className="text-muted-foreground">{message}</p>
      </motion.div>
    </div>
  </div>
);

// Progress Bar Component
interface ProgressBarProps {
  progress: number; // 0-100
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className,
  showPercentage = false,
  animated = true,
}) => (
  <div className={cn("space-y-2", className)}>
    {showPercentage && (
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
    )}
    <div className="h-2 bg-muted rounded-full overflow-hidden">
      <motion.div
        className="h-full bg-primary rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={animated ? transitions.default : { duration: 0 }}
      />
    </div>
  </div>
);

// Shimmer Effect Component
export const ShimmerEffect: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className }) => (
  <div className={cn("relative overflow-hidden", className)}>
    {children}
    <motion.div
      className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
      animate={{ x: ["100%", "-100%"] }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  </div>
);

// Pulse Container
export const PulseContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  intensity?: "low" | "medium" | "high";
}> = ({ children, className, intensity = "medium" }) => {
  const intensityScale = {
    low: [1, 1.02, 1],
    medium: [1, 1.05, 1],
    high: [1, 1.1, 1],
  };

  return (
    <motion.div
      className={className}
      animate={{ scale: intensityScale[intensity] }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
};