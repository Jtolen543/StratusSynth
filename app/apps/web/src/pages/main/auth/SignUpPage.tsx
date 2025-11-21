import {Link} from "react-router"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, ArrowLeft, Sparkles } from "lucide-react"
import { PasswordSignUpForm } from "./forms/signupPasswordForm"
import { SocialSignupForm } from "./forms/signupSocialForm"
import { Easing, motion } from "framer-motion"

export function SignUpPage() {
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
        ease: "easeOut" as Easing
      }
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5 pointer-events-none" />
      
      <motion.div 
        className="w-full max-w-md relative z-10"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="text-center mb-8" variants={itemVariants}>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link to="/" className="inline-flex items-center space-x-2 mb-6 group">
              <motion.div 
                className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:bg-primary/90 transition-colors"
                whileHover={{ rotate: 5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <FileText className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <span className="text-xl font-bold text-foreground">YourApp</span>
            </Link>
          </motion.div>
          <motion.div
            className="inline-flex items-center gap-2 mb-4"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Sparkles className="w-5 h-5 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Create your account</h1>
          </motion.div>
          <p className="text-muted-foreground">Join thousands of users and start your journey today</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="bg-card border-border shadow-xl hover:shadow-2xl transition-all duration-300">
            <CardHeader className="space-y-1">
              <CardTitle className="text-xl text-card-foreground">Sign Up</CardTitle>
              <CardDescription>Create your account to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <SocialSignupForm />
              <CardDescription className="text-center py-2">Or sign up with email</CardDescription>
              <PasswordSignUpForm />
              <div className="mt-6 text-center">
                <div className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/signin" className="text-primary hover:text-primary/80 font-medium transition-colors hover:underline">
                    Sign in
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div 
          className="mt-8 text-center text-sm text-muted-foreground"
          variants={itemVariants}
        >
          <p>
            By creating an account, you agree to our{" "}
            <Link to="/terms" className="text-primary hover:text-primary/80 transition-colors hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="text-primary hover:text-primary/80 transition-colors hover:underline">
              Privacy Policy
            </Link>
          </p>
        </motion.div>

        <motion.div 
          className="mt-6 text-center"
          variants={itemVariants}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}