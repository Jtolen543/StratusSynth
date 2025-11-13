"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, KeyRound } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react"
import { authClient } from "@/lib/authentication/auth-client"
import { motion } from "framer-motion"
import { toast } from "sonner"

export function PasswordForgetForm() {
  const [email, setEmail] = useState<string>("")
  const [loading, setLoading] = useState(false)

  const sendResetLink = async (email: string) => {
    if (!email) {
      toast.error("Please enter your email address")
      return
    }
    
    setLoading(true)
    try {
      await authClient.requestPasswordReset({
        email,
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password`
      })
      toast.success("Password reset link sent to your email!")
    } catch (error) {
      toast.error("Failed to send reset link. Please try again.")
    } finally {
      setLoading(false)
    }
  }

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
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <motion.div 
        className="w-full max-w-md relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants}>
          <Card className="w-full border-border shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="space-y-1 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 200, 
                  damping: 15,
                  delay: 0.3
                }}
                className="mx-auto mb-4"
              >
                <KeyRound className="w-12 h-12 text-primary" />
              </motion.div>
              <CardTitle className="text-2xl font-semibold text-foreground">Reset Password</CardTitle>
              <CardDescription className="text-muted-foreground">
                Enter your email address and we'll send you a secure link to reset your password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <motion.div className="space-y-2" variants={itemVariants}>
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="name@example.com"
                    className="pl-10 bg-background border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20"
                    value={email}
                    onChange={(e) => setEmail(e.currentTarget.value)}
                    type="email"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Button 
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200" 
                  onClick={() => sendResetLink(email)}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
              </motion.div>

              <motion.div 
                className="text-center"
                variants={itemVariants}
              >
                <Link
                  href="/signin"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                >
                  <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Sign In
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}