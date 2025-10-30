import { motion, useInView } from "framer-motion"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useUserData } from "@/hooks/use-user-data"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Check, ArrowRight } from "lucide-react"
import { subscriptionFeatures } from "@/lib/stripe"
import { toast } from "sonner"
import { authClient } from "@/lib/auth-client"

export function PricingTiersComponent({displayHeader = true}: {displayHeader?: boolean}) {
  const [isAnnual, setIsAnnual] = useState(false)
  const router = useRouter()
  const userData = useUserData()
  const pricingRef = useRef(null)
  
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
      {displayHeader && 
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
        className="py-20 px-4"
        initial="hidden"
        animate={pricingInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="container mx-auto max-w-7xl">
          <motion.div 
            className="flex flex-col items-center justify-center gap-4 mb-12 w-full"
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

          <div className="grid md:grid-cols-3 gap-8">
            {subscriptionFeatures.map((plan, index) => (
              <motion.div
                key={plan.name}
                variants={cardVariants}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Card className={`relative h-full flex flex-col ${plan.popular ? 'border-primary shadow-lg scale-105' : 'border-border'}`}>
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
                  
                  <CardContent className="space-y-4 flex-grow">
                    <ul className="space-y-3">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start">
                          <Check className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
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