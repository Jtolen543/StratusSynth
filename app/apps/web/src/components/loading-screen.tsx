import { Easing, motion } from "framer-motion"
import { Loader2, Sparkles } from "lucide-react"
import { useState, useEffect } from "react"

/**
 * LoadingScreen Component
 * 
 * A beautiful, animated loading screen component with multiple variants and features.
 * 
 * @example
 * // Basic usage
 * <LoadingScreen message="Loading your data..." />
 * 
 * @example
 * // With progress bar
 * <LoadingScreen 
 *   message="Processing..." 
 *   showProgress={true} 
 *   progress={75} 
 * />
 * 
 * @example
 * // Different variants
 * <LoadingScreen variant="minimal" message="Quick load..." />
 * <LoadingScreen variant="sparkle" message="Magic happening..." />
 */

interface LoadingScreenProps {
  /** Custom loading message to display */
  message?: string
  /** Whether to show the progress bar */
  showProgress?: boolean
  /** Progress value (0-100) for the progress bar */
  progress?: number
  /** Visual variant of the loading screen */
  variant?: "default" | "minimal" | "sparkle"
}

export const LoadingScreen = ({ 
  message = "Loading", 
  showProgress = false, 
  progress = 0,
  variant = "default" 
}: LoadingScreenProps) => {
  const [dots, setDots] = useState<string>("")

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDots((prev) => prev.length === 5 ? "" : prev + ".")
    }, 500)
    return () => clearInterval(intervalId)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.3,
        staggerChildren: 0.1
      }
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.3,
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as Easing
      }
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.3,
        ease: "easeIn" as Easing
      }
    }
  }

  const sparkleVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut" as Easing
      }
    },
    exit: {
      opacity: 0,
      scale: 0,
      transition: {
        duration: 0.2
      }
    }
  }

  const progressVariants = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut" as Easing
      }
    }
  }

  if (variant === "minimal") {
    return (
      <motion.div
        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        <motion.div
          className="flex flex-col items-center gap-4"
          variants={itemVariants}
        >
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-sm text-muted-foreground">{message}{dots}</p>
        </motion.div>
      </motion.div>
    )
  }

  if (variant === "sparkle") {
    return (
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 z-50 flex items-center justify-center"
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={containerVariants}
      >
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-primary/20 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
        
        <motion.div
          className="flex flex-col items-center gap-6 relative z-10"
          variants={itemVariants}
        >
          <motion.div
            className="relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              variants={sparkleVariants}
            >
              <Sparkles className="w-6 h-6 text-primary" />
            </motion.div>
          </motion.div>
          
          <div className="text-center space-y-2">
            <motion.h2 
              className="text-2xl font-bold text-foreground"
              variants={itemVariants}
            >
              {message}
            </motion.h2>
            <motion.p 
              className="text-muted-foreground"
              variants={itemVariants}
            >
              Please wait while we prepare everything for you
            </motion.p>
          </div>

          {showProgress && (
            <motion.div
              className="w-64 space-y-2"
              variants={itemVariants}
            >
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground font-medium">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                  initial="hidden"
                  animate="visible"
                  variants={progressVariants}
                  style={{ transformOrigin: "left" }}
                />
              </div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    )
  }

  // Default variant
  return (
    <motion.div
      className="fixed inset-0 bg-background z-50 flex items-center justify-center"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={containerVariants}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <motion.div
        className="flex flex-col items-center gap-8 relative z-10 max-w-md mx-auto px-6"
        variants={itemVariants}
      >
        {/* Main Loading Animation */}
        <motion.div
          className="relative"
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-10 h-10 text-primary" />
            </motion.div>
          </div>
          
          {/* Orbiting dots */}
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-primary rounded-full"
              style={{
                top: "50%",
                left: "50%",
                marginTop: "-6px",
                marginLeft: "-6px",
              }}
              animate={{
                x: [0, 40 * Math.cos((i * 120 * Math.PI) / 180), 0],
                y: [0, 40 * Math.sin((i * 120 * Math.PI) / 180), 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        {/* Content */}
        <div className="text-center space-y-4">
          <motion.h1 
            className="text-3xl font-bold text-foreground"
            variants={itemVariants}
          >
            {message}
          </motion.h1>
          <motion.p 
            className="text-muted-foreground text-lg"
            variants={itemVariants}
          >
            We're getting everything ready for you
          </motion.p>
        </div>

        {/* Progress Bar */}
        {showProgress && (
          <motion.div
            className="w-full space-y-3"
            variants={itemVariants}
          >
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Loading progress</span>
              <span className="text-foreground font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-primary via-primary/80 to-accent rounded-full relative"
                initial="hidden"
                animate="visible"
                variants={progressVariants}
                style={{ transformOrigin: "left" }}
              >
                <motion.div
                  className="absolute inset-0 bg-white/20 rounded-full"
                  animate={{
                    x: ["-100%", "100%"],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Animated dots */}
        <motion.div
          className="flex gap-2"
          variants={itemVariants}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-primary rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  )
}

// Hook for easy usage
export const useLoadingScreen = () => {
  const showLoading = (message?: string, variant?: LoadingScreenProps["variant"],) => {
    // This would typically be used with a state management solution
    // For now, it's a placeholder for the interface
    console.log("Show loading:", message, variant)
  }

  const hideLoading = () => {
    console.log("Hide loading")
  }

  return { showLoading, hideLoading }
}
