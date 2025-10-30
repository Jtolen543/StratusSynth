"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FeatureCard } from "@/components/ui/animated-card"
import { CheckCircle, FileText, Sparkles, Users, ArrowRight, Star, Zap, Shield, Globe } from "lucide-react"
import { motion, useInView } from "framer-motion"
import { useRef } from "react"
const heroStats = [
  {
    label: "Active users",
    value: "10K+",
    helper: "growing community",
    icon: Users
  },
  {
    label: "Uptime",
    value: "99.9%",
    helper: "reliable service",
    icon: Star
  },
  {
    label: "Security",
    value: "Enterprise",
    helper: "grade protection",
    icon: Shield
  }
] as const
const onboardingSteps = [
  {
    title: "Get started",
    description: "Create your account and set up your workspace in minutes."
  },
  {
    title: "Customize",
    description: "Configure your settings and preferences to match your needs."
  },
  {
    title: "Launch",
    description: "Start using the platform and explore all available features."
  }
] as const

export default function LandingPage() {
  const heroRef = useRef(null)
  const featuresRef = useRef(null)
  const ctaRef = useRef(null)
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" })
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" })
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
    hidden: { opacity: 0, y: 24 },
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
    hidden: { opacity: 0, y: 32 },
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
      <motion.section
        ref={heroRef}
        className="relative overflow-hidden px-4 py-24"
        initial="hidden"
        animate={heroInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
        <div className="container relative mx-auto max-w-6xl">
          <div className="absolute inset-x-12 top-10 hidden h-64 rounded-full bg-primary/10 blur-3xl lg:block" />
          <div className="relative grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
            <div className="mx-auto max-w-2xl text-center lg:mx-0 lg:text-left">
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary"
              >
                <Sparkles className="h-4 w-4" />
                Built for modern teams
              </motion.div>
              <motion.h1
                className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground md:text-6xl"
                variants={itemVariants}
              >
                Build amazing experiences with our platform
              </motion.h1>
              <motion.p
                className="mt-6 text-lg text-muted-foreground md:text-xl"
                variants={itemVariants}
              >
                A complete production-ready foundation with authentication, billing, and polished UI components 
                so your team can focus on building great products.
              </motion.p>
              <motion.div
                className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center lg:justify-start"
                variants={itemVariants}
              >
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                  <Button size="lg" className="px-8 shadow-lg">
                    Get started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
                  <Button variant="outline" size="lg" className="px-8">
                    Learn more
                  </Button>
                </motion.div>
              </motion.div>
              <motion.div
                className="mt-12 grid gap-4 sm:grid-cols-3"
                variants={itemVariants}
              >
                {heroStats.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <motion.div
                      key={stat.label}
                      variants={cardVariants}
                      className="rounded-2xl border border-border/70 bg-background/80 px-5 py-6 text-left shadow-sm backdrop-blur"
                    >
                      <div className="flex items-center gap-3">
                        <span className="rounded-full bg-primary/10 p-2 text-primary">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                            {stat.label}
                          </p>
                          <p className="text-xl font-semibold text-foreground">{stat.value}</p>
                        </div>
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">{stat.helper}</p>
                    </motion.div>
                  )
                })}
              </motion.div>
            </div>
            <motion.div
              className="relative mx-auto w-full max-w-md lg:mx-0"
              variants={cardVariants}
            >
              <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-primary/40 via-transparent to-accent/40 opacity-75 blur-3xl" />
              <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-background/85 p-8 shadow-2xl backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Platform metrics
                    </p>
                    <p className="mt-2 text-4xl font-semibold text-foreground">Dashboard</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">
                    Live
                  </span>
                </div>
                <div className="mt-10 space-y-4">
                  <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/70 px-4 py-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Users</p>
                      <p className="text-xs text-muted-foreground">Active this month</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">1,204</p>
                      <p className="text-xs font-medium text-emerald-400">+24%</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/70 px-4 py-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Features</p>
                      <p className="text-xs text-muted-foreground">Available tools</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">12</p>
                      <p className="text-xs font-medium text-emerald-400">Active</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/70 px-4 py-4">
                    <div>
                      <p className="text-sm font-semibold text-foreground">Performance</p>
                      <p className="text-xs text-muted-foreground">System health</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-foreground">92%</p>
                      <p className="text-xs font-medium text-emerald-400">Optimal</p>
                    </div>
                  </div>
                </div>
              </div>
              <motion.div
                className="absolute -bottom-16 left-1/2 w-64 -translate-x-1/2 rounded-2xl border border-border bg-primary/10 p-4 text-left shadow-xl backdrop-blur"
                variants={cardVariants}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-primary/20 p-2 text-primary">
                    <Star className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Real-time insights</p>
                    <p className="text-xs text-muted-foreground">Monitor your platform performance.</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>
      <motion.section
        ref={featuresRef}
        id="features"
        className="bg-muted/30 px-4 py-24"
        initial="hidden"
        animate={featuresInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="container mx-auto max-w-6xl">
          <motion.div className="mx-auto mb-16 max-w-3xl text-center" variants={itemVariants}>
            <h2 className="text-3xl font-semibold text-foreground md:text-4xl">Everything you need to get started</h2>
            <p className="mt-4 text-lg text-muted-foreground md:text-xl">
              Built with modern tools and best practices, ready for production use.
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<Zap className="h-6 w-6 text-primary" />}
              title="Fast performance"
              description="Optimized for speed with modern web technologies and best practices."
              delay={0}
            />
            <FeatureCard
              icon={<Shield className="h-6 w-6 text-primary" />}
              title="Secure authentication"
              description="Built-in user management, sessions, and security features."
              delay={0.08}
            />
            <FeatureCard
              icon={<Globe className="h-6 w-6 text-primary" />}
              title="Responsive design"
              description="Works perfectly on all devices and screen sizes."
              delay={0.16}
            />
            <FeatureCard
              icon={<Users className="h-6 w-6 text-primary" />}
              title="User management"
              description="Complete user system with roles, permissions, and admin controls."
              delay={0.24}
            />
            <FeatureCard
              icon={<CheckCircle className="h-6 w-6 text-primary" />}
              title="Easy to customize"
              description="Clean, modular code that's easy to modify and extend."
              delay={0.32}
            />
            <FeatureCard
              icon={<FileText className="h-6 w-6 text-primary" />}
              title="Production ready"
              description="Includes everything needed to deploy to production."
              delay={0.4}
            />
          </div>
          <motion.div
            className="mt-20 grid items-center gap-12 lg:grid-cols-2"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <h3 className="text-2xl font-semibold text-foreground md:text-3xl">Simple setup, powerful results</h3>
              <p className="text-muted-foreground">
                Get started quickly with our streamlined onboarding process. Each step is designed to get you up and running fast.
              </p>
              <div className="space-y-4">
                {onboardingSteps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    className="flex gap-4 rounded-2xl border border-border/70 bg-background/80 p-5 shadow-sm backdrop-blur"
                    whileHover={{ x: 12 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="text-base font-semibold text-foreground">{step.title}</h4>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              className="relative"
              variants={itemVariants}
            >
              <div className="pointer-events-none absolute -inset-6 rounded-3xl bg-gradient-to-tr from-primary/30 via-transparent to-accent/30 opacity-70 blur-3xl" />
              <div className="relative space-y-4 rounded-3xl border border-border/70 bg-background/85 p-6 shadow-2xl backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">Platform status</p>
                    <p className="mt-2 text-3xl font-semibold text-foreground">Active</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400">
                    Online
                  </span>
                </div>
                <div className="grid gap-3 pt-4">
                  <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">Active users</p>
                        <p className="text-xs text-muted-foreground">Currently online</p>
                      </div>
                      <span className="text-sm font-semibold text-emerald-400">1,204</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">System health</p>
                        <p className="text-xs text-muted-foreground">All systems operational</p>
                      </div>
                      <span className="text-sm font-semibold text-emerald-400">100%</span>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-semibold text-foreground">User satisfaction</p>
                        <p className="text-xs text-muted-foreground">Based on feedback</p>
                      </div>
                      <span className="text-sm font-semibold text-emerald-400">4.8 / 5</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>
      <motion.section
        ref={ctaRef}
        className="relative overflow-hidden px-4 py-24"
        initial="hidden"
        animate={ctaInView ? "visible" : "hidden"}
        variants={containerVariants}
      >
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container relative mx-auto max-w-3xl text-center">
          <motion.h2
            className="text-3xl font-semibold text-foreground md:text-4xl"
            variants={itemVariants}
          >
            Ready to get started?
          </motion.h2>
          <motion.p
            className="mt-4 text-lg text-muted-foreground md:text-xl"
            variants={itemVariants}
          >
            Join thousands of developers who trust our platform for their projects.
          </motion.p>
          <motion.div variants={itemVariants} className="mt-8 flex justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.96 }}>
              <Button size="lg" className="px-8 shadow-lg">
                Start building
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
          <motion.p
            className="mt-4 text-sm text-muted-foreground"
            variants={itemVariants}
          >
            Free to get started - No credit card required
          </motion.p>
        </div>
      </motion.section>
    </div>
  )
}

