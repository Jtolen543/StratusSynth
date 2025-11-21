import { motion } from "framer-motion"
import { Card, CardDescription, CardHeader, CardTitle } from "./card"
import { cn } from "@/lib/utils"

interface AnimatedCardProps {
  children: React.ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  hover?: boolean
}

export function AnimatedCard({ 
  children, 
  className, 
  delay = 0, 
  direction = "up",
  hover = true 
}: AnimatedCardProps) {
  const directionVariants = {
    up: { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } },
    down: { hidden: { opacity: 0, y: -30 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0 } }
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay,
        ease: "easeOut" 
      }}
      variants={directionVariants[direction]}
      whileHover={hover ? { 
        y: -5, 
        transition: { type: "spring", stiffness: 400, damping: 10 } 
      } : undefined}
      className={cn("transition-all duration-300", className)}
    >
      <Card className="bg-card border-border hover:shadow-xl transition-all duration-300 group">
        {children}
      </Card>
    </motion.div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  delay?: number
  className?: string
}

export function FeatureCard({ 
  icon, 
  title, 
  description, 
  delay = 0,
  className 
}: FeatureCardProps) {
  return (
    <AnimatedCard delay={delay} className={className}>
      <CardHeader>
        <motion.div 
          className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors"
          whileHover={{ rotate: 5 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          {icon}
        </motion.div>
        <CardTitle className="text-card-foreground">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </AnimatedCard>
  )
}
