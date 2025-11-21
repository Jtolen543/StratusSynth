import { TabsComponentProps } from "./ProfilePage"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Easing, motion } from "framer-motion"
import { Calendar, DollarSign, Shield, AlertCircle } from "lucide-react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStripeS } from "@fortawesome/free-brands-svg-icons"
import { useNavigate } from "react-router"
import { authClient } from "@/lib/authentication/auth-client"
import { toast } from "sonner"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { PricingTiersComponent } from "@/components/pricing-tiers"
import { config } from "@/config"

export const BillingDetails = ({data}: TabsComponentProps) => {
  const navigate = useNavigate()
  const subscription = data.subscription

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as Easing
      }
    }
  }

  const getSubscriptionStatus = (status: string) => {
    switch (status) {
      case 'active': return { label: 'Active', variant: 'default' as const }
      case 'canceled': return { label: 'Canceled', variant: 'destructive' as const }
      case 'past_due': return { label: 'Past Due', variant: 'destructive' as const }
      case 'unpaid': return { label: 'Unpaid', variant: 'destructive' as const }
      case 'incomplete': return { label: 'Incomplete', variant: 'secondary' as const }
      case 'trialing': return { label: 'Trial', variant: 'secondary' as const }
      default: return { label: 'Unknown', variant: 'outline' as const }
    }
  }

  const formatName = (plan: string) => {
    return plan.slice(0, 1).toUpperCase() + plan.slice(1)
  }

  const handleManageInformationClick = async () => {
    const res = await authClient.subscription.billingPortal({
      returnUrl: `${config.baseURL}/dashboard`,
      fetchOptions: {
        onError: (ctx) => {
          toast.error(ctx.error.message)
        },
        onSuccess: () => {
          toast.info("Successfully created session")
        }
      }
    })
    if (!res.data) return
    navigate(res.data.url)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date)
  }
  
  return (
    <motion.div 
      className="flex flex-col gap-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FontAwesomeIcon icon={faStripeS} className="w-5 h-5 text-primary" />
              Subscription Overview
            </CardTitle>
            <CardDescription>Manage your current subscription and billing details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Separator />
            
            {subscription ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{formatName(subscription.plan)} Plan</h3>
                    <p className="text-muted-foreground">
                      Plan ID: {subscription.id}
                    </p>
                  </div>
                  <Badge variant={getSubscriptionStatus(subscription.status || 'active').variant}>
                    {getSubscriptionStatus(subscription.status || 'active').label}
                  </Badge>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  <motion.div 
                    className="p-4 border rounded-lg border-border hover:bg-accent/5 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Next Billing</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {subscription.periodEnd ? formatDate(new Date(subscription.periodEnd)) : 'N/A'}
                    </p>
                  </motion.div>
                  
                  <motion.div 
                    className="p-4 border rounded-lg border-border hover:bg-accent/5 transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Total Paid</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Subscription Active
                    </p>
                  </motion.div>
                </div>
              </div>
            ) : (
              <motion.div 
                className="text-center py-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold text-lg mb-2">No Active Subscription</h3>
                <p className="text-muted-foreground mb-4">
                  You don't have an active subscription. Choose a plan to get started.
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="hover:bg-primary/90 transition-all duration-200">
                      View Plans
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="min-w-[600px] no-scrollbar">
                    <PricingTiersComponent layout="dialog" displayHeader={false} animate={false}/>
                  </DialogContent>
                </Dialog>
              </motion.div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {subscription && (
        <>
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FontAwesomeIcon icon={faStripeS} className="w-5 h-5 text-primary" />
                  Payment Information
                </CardTitle>
                <CardDescription>Manage your saved payment methods and billing information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                
                <Button 
                  variant="outline" className="w-full hover:bg-accent/50 transition-all duration-200"
                  disabled={subscription?.plan === "basic"}
                  onClick={handleManageInformationClick}
                >
                  <FontAwesomeIcon icon={faStripeS} className="w-5 h-5 text-primary" />
                  Manage Billing Information
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-lg transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Security & Privacy
                </CardTitle>
                <CardDescription>Manage your billing security and privacy settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Separator />
                <motion.div 
                  className="flex items-center justify-between p-4 border rounded-lg border-border hover:bg-accent/5 transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <AlertCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Billing Notifications</p>
                      <p className="text-sm text-muted-foreground">Get notified about billing events and updates</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="hover:bg-accent/50 transition-all duration-200">
                    Configure
                  </Button>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </motion.div>
  )
}
