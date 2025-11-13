"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
import { PricingTiersComponent } from "@/components/pricing-tiers"

export default function PricingPage() {
  const ctaRef = useRef(null)
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" })

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
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
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <PricingTiersComponent />


      <motion.section 
        ref={ctaRef}
        className="py-20 px-4 bg-primary/5 relative overflow-hidden"
        initial="hidden"
        animate={ctaInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="container mx-auto text-center max-w-3xl relative">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-foreground mb-6"
            variants={itemVariants}
          >
            Ready to Get Started?
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground mb-8"
            variants={itemVariants}
          >
            Join thousands of businesses that trust our platform to power their growth.
          </motion.p>
          <motion.div variants={itemVariants}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 shadow-lg">
                Start Your Free Trial
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
          <motion.p 
            className="text-sm text-muted-foreground mt-4"
            variants={itemVariants}
          >
            No credit card required • 14-day free trial • Cancel anytime
          </motion.p>
        </div>
      </motion.section>
    </div>
  )
}
