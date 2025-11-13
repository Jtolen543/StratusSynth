import { motion, useInView } from "framer-motion"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useUserData } from "@/hooks/use-user-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Check, ArrowRight, ChevronDown } from "lucide-react"
import { subscriptionFeatures } from "@/lib/stripe"
import { toast } from "sonner"
import { authClient } from "@/lib/authentication/auth-client"
import { cn } from "@/lib/utils"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface PricingTiersProps {
  displayHeader?: boolean
  animate?: boolean
  layout?: "page" | "dialog"
}

export function PricingTiersComponent({displayHeader = true, animate = true, layout = "page"}: PricingTiersProps) {
  const [isAnnual, setIsAnnual] = useState(false)
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({})
  const router = useRouter()
  const userData = useUserData()
  const pricingRef = useRef(null)
  const isDialog = layout === "dialog"
  
  const pricingInView = useInView(pricingRef, { once: true, margin: "-100px" })

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

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  const handlePricingClick = async (plan: string) => {
    if (plan.toLowerCase() === "basic" || plan.toLowerCase() === userData.subscription?.plan) {
      router.push("/dashboard")
      toast.info("Redirecting you to dashboard")
    } else {
      toast.info("Redirecting you to subscription page")
      await authClient.subscription.upgrade({
        plan,
        annual: isAnnual,
        successUrl: "/dashboard",
        cancelUrl: "/pricing",
        fetchOptions: {
          onError: (ctx) => {
            toast.error(ctx.error.message)
          },
          onSuccess: (ctx) => {
            toast.info("Successfully created checkout session")
          }
        }
      })
    }
  }

  return (
    <div>
      {displayHeader && !isDialog && 
        <motion.section    
          className="pt-20 px-4 relative overflow-hidden"
          initial="hidden"
          animate={pricingInView ? "visible" : "hidden"}
          variants={containerVariants}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
          
          <div className="container mx-auto text-center max-w-4xl relative">
            <motion.div variants={itemVariants}>
              <Badge variant="secondary" className="mb-6 bg-accent/10 text-accent border-accent/20 text-primary">
                <Star className="w-4 h-4 mr-2" />
                Simple, Transparent Pricing
              </Badge>
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-balance mb-6 text-foreground"
              variants={itemVariants}
            >
              Choose Your <span className="text-primary bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Perfect Plan</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl text-muted-foreground text-pretty mb-8 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Start free and scale as you grow. No hidden fees, no surprises. Cancel anytime.
            </motion.p>
          </div>
        </motion.section>
      }

      <motion.section 
        ref={pricingRef}
        className={cn("px-4", isDialog ? "py-8" : "py-20")}
        initial={animate ? "hidden" : "visible"}
        animate={
          animate
            ? pricingInView
              ? "visible"
              : "hidden"
            : undefined
        }
        variants={containerVariants}
      >
        <div
          className={cn(
            "mx-auto w-full",
            isDialog ? "max-w-full" : "container max-w-7xl"
          )}
        >
          <motion.div 
            className={cn(
              "flex flex-col items-center justify-center gap-4 w-full",
              isDialog ? "mb-8" : "mb-12"
            )}
            variants={itemVariants}
          >
            <div className="flex items-center gap-4">
              <span className={`text-sm font-medium ${!isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  isAnnual ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isAnnual ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${isAnnual ? 'text-foreground' : 'text-muted-foreground'}`}>
                Annual
              </span>
            </div>
            <div className="text-green-400 font-bold">Save 20% with annual billing!</div>
          </motion.div>

          <div
            className={cn(
              "grid",
              isDialog ? "grid-cols-1 gap-4" : "md:grid-cols-3 gap-8"
            )}
          >
            {subscriptionFeatures.map((plan, idx) => (
              <motion.div
                key={`${plan.name}-${idx}`}
                variants={cardVariants}
                whileHover={isDialog ? undefined : { y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Card
                  className={cn(
                    "relative flex h-full flex-col",
                    plan.popular
                      ? cn(
                          "border-primary shadow-lg",
                          !isDialog && "md:scale-105"
                        )
                      : "border-border",
                    isDialog && "shadow-sm"
                  )}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center pb-8">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <CardDescription className="text-base">{plan.description}</CardDescription>
                    
                    <div className="mt-6 min-h-[80px]">
                      <div className="flex items-baseline justify-center">
                        <span className="text-4xl font-bold text-foreground">
                          ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                        </span>
                        <span className="text-muted-foreground ml-1">/month</span>
                      </div>
                      <div className="min-h-[20px] mt-1">
                        {isAnnual && plan.annualPrice !== plan.monthlyPrice && (
                          <p className="text-sm text-muted-foreground">
                            Billed annually (${Math.round(plan.annualPrice * 12)}/year)
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="flex-grow space-y-4">
                    {(() => {
                      const visibleFeatures = isDialog
                        ? plan.features.slice(0, 3)
                        : plan.features
                      const hiddenFeatures = isDialog
                        ? plan.features.slice(3)
                        : []
                      const isExpanded = !!expandedPlans[plan.name]

                      if (hiddenFeatures.length === 0) {
                        return (
                          <ul className="space-y-3">
                            {plan.features.map((feature, featureIndex) => (
                              <li key={featureIndex} className="flex items-start">
                                <Check className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                <span className="text-sm text-foreground">{feature}</span>
                              </li>
                            ))}
                          </ul>
                        )
                      }

                      return (
                        <Collapsible
                          open={isExpanded}
                          onOpenChange={(open) =>
                            setExpandedPlans((prev) => ({ ...prev, [plan.name]: open }))
                          }
                        >
                          <ul className="space-y-3">
                            {visibleFeatures.map((feature, featureIndex) => (
                              <li key={`visible-${featureIndex}`} className="flex items-start">
                                <Check className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                <span className="text-sm text-foreground">{feature}</span>
                              </li>
                            ))}
                          </ul>
                          <CollapsibleContent asChild>
                            <ul className="mt-3 space-y-3">
                              {hiddenFeatures.map((feature, hiddenIndex) => (
                                <li key={`hidden-${hiddenIndex}`} className="flex items-start">
                                  <Check className="mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                                  <span className="text-sm text-foreground">{feature}</span>
                                </li>
                              ))}
                            </ul>
                          </CollapsibleContent>
                          <CollapsibleTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="mt-4 w-full gap-2 text-muted-foreground"
                            >
                              {isExpanded
                                ? "Show fewer features"
                                : `Show ${hiddenFeatures.length} more`}
                              <ChevronDown
                                className={cn(
                                  "h-4 w-4 transition-transform",
                                  isExpanded && "rotate-180"
                                )}
                              />
                            </Button>
                          </CollapsibleTrigger>
                        </Collapsible>
                      )
                    })()}
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button 
                      className="w-full" 
                      variant={plan.name === "Plus" ? "outline" : "default"}
                      size="lg"
                      onClick={() => handlePricingClick(plan.name)}
                    >
                      {plan.buttonText}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  )
}
