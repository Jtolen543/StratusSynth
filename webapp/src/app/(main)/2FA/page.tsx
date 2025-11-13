"use client"

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { ShieldCheck, ArrowLeft, Mail } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from "sonner";
import {
  Form, 
  FormField,
  FormItem,
  FormDescription,
  FormMessage,
  FormLabel,
  FormControl 
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/authentication/auth-client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Loader } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"

export default function Page() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const FormSchema = z.object({
    pin: z.string().min(8, {
      error: "Your one-time password must be 8 characters"
    })
  })

  async function resendOTP() {
    await authClient.twoFactor.sendOtp()
  }

  async function onSubmitOTP(data: z.infer<typeof FormSchema>) {
    setLoading(true)
    await authClient.twoFactor.verifyOtp({
      code: data.pin,
      trustDevice: true,
      fetchOptions: {
        onSuccess: () => {
          toast.success("You are now signed in!")
          router.push("/")
        },
        onError: (ctx) => {
          toast.error(ctx.error.message  || "Incorrect OTP code, please check your code")
          setLoading(false)
        }
      }
    })
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: ""
    }
  })

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
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <motion.div 
        className="w-full max-w-md relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div 
          className="flex flex-col gap-6 items-center bg-card border border-border rounded-2xl p-8 shadow-xl"
          variants={itemVariants}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              delay: 0.3
            }}
          >
            <ShieldCheck size={80} className="text-primary" />
          </motion.div>
          
          <motion.div 
            className="text-center space-y-2"
            variants={itemVariants}
          >
            <h1 className="text-2xl font-bold text-foreground">Two-Factor Authentication</h1>
            <p className="text-muted-foreground">
              We've sent a verification code to your email address. Please enter it below to complete your sign-in.
            </p>
          </motion.div>

          <Form {...form}>
            <motion.form 
              onSubmit={form.handleSubmit(onSubmitOTP)} 
              className="flex flex-col justify-center gap-6 w-full"
              variants={itemVariants}
            >
              <FormField
                control={form.control}
                name="pin"
                render={({ field }) => (
                  <FormItem className="flex flex-col items-center gap-4">
                    <FormLabel className="text-foreground font-medium">Verification Code</FormLabel>
                    <FormControl>
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                      >
                        <InputOTP maxLength={8} {...field} className="gap-2">
                          <InputOTPGroup>
                            <InputOTPSlot index={0} className="w-8 h-8 text-lg" />
                            <InputOTPSlot index={1} className="w-8 h-8 text-lg" />
                            <InputOTPSlot index={2} className="w-8 h-8 text-lg" />
                            <InputOTPSlot index={3} className="w-8 h-8 text-lg" />
                          </InputOTPGroup>
                          <InputOTPSeparator />
                          <InputOTPGroup>
                            <InputOTPSlot index={4} className="w-8 h-8 text-lg" />
                            <InputOTPSlot index={5} className="w-8 h-8 text-lg" />
                            <InputOTPSlot index={6} className="w-8 h-8 text-lg" />
                            <InputOTPSlot index={7} className="w-8 h-8 text-lg" />
                          </InputOTPGroup>
                        </InputOTP>
                      </motion.div>
                    </FormControl>
                    <FormDescription className="text-muted-foreground text-center">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Check your email for the 8-digit code
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="space-y-4"
              >
                <Button 
                  type="submit" 
                  className={`w-full ${loading ? "bg-muted/60 hover:cursor-not-allowed" : ""}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader className="animate-spin mr-2" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Code"
                  )}
                </Button>
                
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Didn't receive the code?</p>
                  <Button 
                    variant="ghost" 
                    className="text-primary hover:text-primary/80 font-medium"
                    onClick={resendOTP}
                    disabled={loading}
                  >
                    Resend Code
                  </Button>
                </div>
              </motion.div>
            </motion.form>
          </Form>

          <motion.div 
            className="mt-4"
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
        </motion.div>
      </motion.div>
    </div>
  )
}